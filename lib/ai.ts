import Anthropic from "@anthropic-ai/sdk";
import { loyerNetAnnuel, prixParRendement, RENDEMENT_NET_BAS, RENDEMENT_NET_HAUT } from "./rendement";
import { buildDvfReferences } from "./references";
import { surfaceDependancesHabitables, surfaceHabitableTotale } from "./surfaces";
import type { LoyerIndicateur } from "./loyers";
import type {
  DvfSale,
  EstimationReport,
  PropertyInput,
  ReferenceDvf,
} from "./types";

// Estimation en une seule phase, fondée EXCLUSIVEMENT sur les ventes
// réelles DVF (aucune annonce en ligne) : analyse des photos + rédaction
// du dossier, sans outils web — rapide et fiable.

const FINAL_SCHEMA = {
  type: "object",
  properties: {
    analyse_dvf: { type: "string", description: "3 phrases simples maximum : ce que les ventes réelles montrent pour ce bien" },
    references_dvf: {
      type: "array",
      description: "4 à 6 ventes choisies EXCLUSIVEMENT dans la liste DVF fournie — ne JAMAIS inventer une transaction. Ne doit JAMAIS être vide si la liste DVF ne l'est pas (reprends celles de l'étude de marché si elle en contient).",
      items: {
        type: "object",
        properties: {
          localisation: { type: "string" },
          detail: { type: "string" },
          surface: { type: "number" },
          date: { type: "string", description: "MM/AAAA" },
          prix: { type: "number" },
          prix_m2: { type: "number" },
        },
        required: ["localisation", "detail", "surface", "date", "prix", "prix_m2"],
      },
    },
    base_mediane: { type: "number", description: "BASE DE MARCHÉ en euros = médiane pondérée du €/m² des references_dvf appliquée à la surface du bien. Si une base_mediane IMPOSÉE est fournie dans la fiche, reprends-la EXACTEMENT (0 si non calculable)" },
    prix_estime: { type: "number", description: "Cœur de fourchette en euros" },
    fourchette_basse: { type: "number", description: "= prix du scénario Vente rapide" },
    fourchette_haute: { type: "number", description: "Haut de la fourchette présentée au client (« Prix plafond »), jamais au-delà de la meilleure vente comparable actualisée" },
    prix_m2: { type: "number" },
    prix_presentation: { type: "number", description: "Prix affiché conseillé (= scénario Prix optimal) : AU MOINS 25 000 € au-dessus de fourchette_basse (Vente rapide), jamais au sommet, arrondi vers le bas à un seuil attractif" },
    description_bien: { type: "string", description: "2 paragraphes professionnels et valorisants, adressés au client (« votre maison », « votre appartement »)" },
    indice_confiance: { type: "number", description: "0 à 100" },
    delai_vente_estime: { type: "string" },
    positionnement_marche: { type: "string", description: "3 à 4 phrases SIMPLES : les ventes réelles de référence, l'actualisation au marché actuel, et pourquoi les deux bornes de la fourchette — compréhensible par le client à la première lecture" },
    analyse_photos: { type: "string", description: "Synthèse de l'analyse visuelle" },
    analyse_par_photo: {
      type: "array",
      description: "Une entrée par photo fournie, dans l'ordre (1 = première)",
      items: {
        type: "object",
        properties: {
          photo: { type: "integer" },
          titre: { type: "string" },
          bons_points: { type: "array", items: { type: "string" } },
          defauts: { type: "array", items: { type: "string" } },
        },
        required: ["photo", "titre", "bons_points", "defauts"],
      },
    },
    etat_notes: {
      type: "array",
      description: "Notes 1-5 par catégorie (État général, Luminosité, Cuisine, Salle de bain, Sols & murs, Extérieur) — vide sans photo",
      items: {
        type: "object",
        properties: { categorie: { type: "string" }, note: { type: "number" } },
        required: ["categorie", "note"],
      },
    },
    coefficient_etat: { type: "string" },
    impact_etat: { type: "number", description: "Impact de l'état en euros signés" },
    scenarios_prix: {
      type: "array",
      description: "Exactement 3, prix croissants : Vente rapide (= fourchette_basse) < Prix optimal (= prix_presentation) < Prix plafond (le maximum réaliste, garde-fou interne)",
      items: {
        type: "object",
        properties: {
          strategie: { type: "string", enum: ["Vente rapide", "Prix optimal", "Prix plafond"] },
          prix: { type: "number" },
          delai: { type: "string" },
          commentaire: { type: "string" },
        },
        required: ["strategie", "prix", "delai", "commentaire"],
      },
    },
    ajustements: {
      type: "array",
      description: "Lignes signées appliquées à la base médiane pour aboutir à prix_estime",
      items: {
        type: "object",
        properties: { libelle: { type: "string" }, montant: { type: "number" } },
        required: ["libelle", "montant"],
      },
    },
    etapes_commercialisation: { type: "array", items: { type: "string" }, description: "4-5 actions « Titre — détail »" },
    points_forts: { type: "array", items: { type: "string" } },
    points_faibles: { type: "array", items: { type: "string" } },
    strategie_commercialisation: { type: "string" },
    argumentaire_vendeur: { type: "string", description: "3 à 5 arguments percutants et digestes, UN PAR LIGNE (séparés par \\n), chacun au format « Titre court — explication chiffrée en 1 à 2 phrases max ». Jamais de bloc compact." },
  },
  required: [
    "analyse_dvf", "references_dvf", "base_mediane",
    "prix_estime", "fourchette_basse", "fourchette_haute", "prix_m2", "prix_presentation",
    "description_bien", "indice_confiance", "delai_vente_estime", "positionnement_marche",
    "analyse_photos", "analyse_par_photo", "etat_notes", "coefficient_etat", "impact_etat",
    "scenarios_prix", "ajustements", "etapes_commercialisation",
    "points_forts", "points_faibles", "strategie_commercialisation", "argumentaire_vendeur",
  ],
} as const;

/** Schéma adapté à la mission (le locatif exprime tout en €/mois + rendement). */
function schemaFor(mission: string): Record<string, unknown> {
  const schema = JSON.parse(JSON.stringify(FINAL_SCHEMA)) as {
    properties: Record<string, { description?: string } & Record<string, unknown>>;
    required: string[];
  };
  if (mission === "locatif") {
    schema.properties.prix_estime.description = "Loyer mensuel estimé (cœur de fourchette), en €/mois hors charges";
    schema.properties.fourchette_basse.description = "= valeur MÉDIANE officielle × surface habitable totale (€/mois) — plancher de la fourchette";
    schema.properties.fourchette_haute.description = "= valeur HAUTE officielle du secteur × surface habitable totale (€/mois) — borne haute d'information du marché";
    schema.properties.prix_m2.description = "Loyer mensuel par m² habitable";
    schema.properties.prix_presentation.description = "Loyer conseillé à l'affichage (= scénario Prix optimal), €/mois";
    schema.properties.base_mediane.description = "Loyer de référence : valeur HAUTE officielle €/m² × surface habitable totale, arrondi à la dizaine (€/mois)";
    schema.properties.references_dvf.description = "TOUJOURS un tableau vide [] pour une estimation locative";
    schema.properties.delai_vente_estime.description = "Délai estimé de mise en location";
    schema.properties.prix_presentation.description = "TON loyer conseillé (= prix_estime = scénario Prix optimal), entre le MÉDIAN et le HAUT officiels, ancré sur le haut, €/mois";
  }
  if (mission === "bienloue") {
    schema.properties.prix_estime.description =
      "Prix retenu = loyer NET annuel ÷ 7 % (capitalisation au taux médian), arrondi vers le bas au millier";
    schema.properties.fourchette_basse.description =
      "= prix du scénario Vente rapide = loyer NET annuel ÷ 8 % de rentabilité nette";
    schema.properties.fourchette_haute.description =
      "= prix du scénario Prix optimal (= prix_presentation) = loyer NET annuel ÷ 6 % de rentabilité nette";
    schema.properties.prix_presentation.description =
      "Prix de présentation conseillé = le prix du scénario Prix optimal (6 % net)";
    schema.properties.ajustements.description =
      "TOUJOURS un tableau vide [] : le prix d'un bien loué est fixé par la rentabilité nette, pas par des ajustements";
  }
  if (mission === "audit") {
    schema.properties.analyse_annonce = {
      type: "string",
      description: "2 à 3 phrases simples : verdict global sur l'annonce en ligne (vide si aucune URL fournie)",
    };
    schema.properties.anciennete_annonce = {
      type: "string",
      description: "Ancienneté détectée de l'annonce, avec la source (vide si non vérifiable)",
    };
    schema.properties.baisses_annonce = {
      type: "string",
      description: "Baisses de prix détectées, chronologie courte (vide si non vérifiable)",
    };
    schema.properties.recommandations_annonce = {
      type: "array",
      description: "4 à 8 recommandations concrètes façon audit professionnel, priorité décroissante (vide si aucune URL fournie)",
      items: {
        type: "object",
        properties: {
          categorie: { type: "string", enum: ["Prix", "Titre & texte", "Photos", "Diffusion", "Mise en valeur"] },
          constat: { type: "string", description: "Ce qui pèche aujourd'hui — factuel, 1 phrase courte" },
          recommandation: { type: "string", description: "L'action précise à mener — 1 phrase courte" },
          priorite: { type: "string", enum: ["haute", "moyenne", "basse"] },
        },
        required: ["categorie", "constat", "recommandation", "priorite"],
      },
    };
    schema.required.push("analyse_annonce", "anciennete_annonce", "baisses_annonce", "recommandations_annonce");
  }
  return schema;
}

const JSON_RULE = `FORMAT DE SORTIE (impératif) : réponds EXCLUSIVEMENT par un objet JSON valide — aucun texte avant ou après, aucune balise markdown — conforme exactement au schéma JSON fourni dans le message utilisateur.`;

const CONJONCTURE_RULE = `MARCHÉ BAISSIER (règle PRIORITAIRE) : le marché immobilier est actuellement en baisse — taux d'intérêt élevés, budget des acquéreurs en recul. Une vente conclue il y a un ou deux ans l'a donc été à un prix PLUS ÉLEVÉ que ce que le même bien vaudrait aujourd'hui. Conséquences obligatoires :
- ACTUALISE les références selon leur ancienneté (l'âge de chaque vente est indiqué dans la liste) : barème de -3 % PAR ANNÉE écoulée depuis la vente (au prorata des mois : une vente d'il y a 18 mois se déprécie d'environ -4,5 %), à moduler légèrement selon la dynamique visible dans les données.
- traduis cette actualisation par une ligne de décote OBLIGATOIRE dans les ajustements : « Actualisation au marché actuel (ventes datées, marché en baisse) », chiffrée selon l'ancienneté moyenne des références retenues. Si toutes les références ont moins de 6 mois, la ligne peut être faible — mais elle figure et tu l'expliques.
- INTERDICTION DE DOUBLE COMPTAGE : l'effet du marché baissier ne se décompte qu'une seule fois (cette ligne d'actualisation, rien d'autre).
- sois réaliste sur les délais de vente : ils s'allongent en marché baissier.`;

const STYLE_RULE = `STYLE DES TEXTES (le dossier est remis directement AU CLIENT vendeur) : ADRESSE-TOI À LUI : « votre maison », « votre appartement », « vous », « nous vous conseillons » — jamais « le vendeur », « le bien à estimer » ni la troisième personne. Écris SIMPLE et clair : phrases courtes (une idée par phrase), vocabulaire courant, pas de jargon (« ancre de valeur », « transposable », « décote conjoncturelle », « médiane des actés »…) — dis plutôt « les ventes réelles », « les biens comparables au vôtre se sont vendus entre X et Y », « le marché refuse au-delà de Z ». Chaque texte d'analyse : 2 à 4 phrases maximum, compréhensibles à la première lecture.`;

const AUDIT_RULE = `MISSION : AUDIT DE COMMERCIALISATION. Le bien est DÉJÀ EN VENTE et ne se vend pas. La fiche du bien a été EXTRAITE DE L'ANNONCE EN LIGNE elle-même (le négociateur n'a saisi que le client et le lien) : les champs absents de l'annonce sont vides — ne les invente pas, et fonde ton estimation sur les caractéristiques disponibles + les ventes DVF, exactement comme une estimation classique. En plus de l'estimation complète :
- positionnement_marche = le DIAGNOSTIC en 3 à 4 phrases simples : pourquoi le bien ne se vend pas (écart entre le prix affiché et la valeur de marché actualisée, présentation, cible), chiffres à l'appui.
- points_faibles = les freins concrets à la vente identifiés ; points_forts = les atouts à mieux mettre en avant dans l'annonce.
- RÈGLE ABSOLUE DE PRIX : TOUS les prix rendus (fourchette basse et haute, prix de relance, vente rapide, prix estimé) sont STRICTEMENT INFÉRIEURS au prix affiché actuel — au moins ~1 % en dessous. Un prix de relance égal ou supérieur au prix auquel le bien ne se vend pas n'a AUCUN sens : la relance doit créer un signal de baisse visible pour les acheteurs.
- scenarios_prix : « Prix optimal » = le PRIX DE RELANCE conseillé (repositionnement) — TOUJOURS sous le prix affiché actuel ; « Vente rapide » = l'option coup de fusil.
- etapes_commercialisation = PLAN DE RELANCE concret : repositionnement du prix, re-shooting photo, réécriture de l'annonce, re-publication (retrouver la fraîcheur), élargissement de la diffusion, home staging…
- argumentaire_vendeur = les points clés chiffrés pour faire accepter le repositionnement au client (ex. « à ce prix, votre bien est ignoré : N visites en M mois — au prix de relance, il revient dans la zone où les acheteurs cliquent »).
- delai_vente_estime = délai estimé APRÈS repositionnement.
- AUDIT DE L'ANNONCE : tu n'as PAS d'accès web dans cette phase. Les CONSTATS RELEVÉS EN LIGNE (ancienneté, baisses, qualité du titre/texte/photos) figurent déjà dans la fiche, section « Constats relevés en ligne » — c'est TA matière première, ne cherche pas à re-vérifier et n'invente RIEN au-delà. Si le bien est diffusé par PLUSIEURS AGENCES (mandat simple, visible dans les sources des liens ou les constats), relève-le : prix divergents, annonces concurrentes = constat majeur qui brouille les acheteurs (catégorie Diffusion). Renseigne :
  · anciennete_annonce et baisses_annonce : reprends les constats fournis, croisés avec la saisie du négociateur — indique « Non vérifiable » si rien n'a été détecté ;
  · analyse_annonce : 2 à 3 phrases simples, le verdict global sur l'annonce ;
  · recommandations_annonce : 4 à 8 recommandations CONCRÈTES, façon audit professionnel — chacune avec categorie (Prix, Titre & texte, Photos, Diffusion, Mise en valeur), constat (ce qui pèche aujourd'hui, factuel, tiré des constats fournis ou du positionnement prix), recommandation (l'action précise à mener) et priorite (haute / moyenne / basse). Classe-les par priorité décroissante.
  Si les constats fournis sont vides (annonce inaccessible), appuie-toi sur les informations disponibles, dis ce qui n'a pas pu être vérifié — n'invente JAMAIS un constat.`;

const PROXIMITE_RULE = `PROXIMITÉ (impératif) : chaque vente DVF de la liste indique son adresse et sa distance au bien. APPARTEMENT → priorité absolue aux ventes à la MÊME ADRESSE (même copropriété : comparables parfaits), puis même rue, puis rayon proche. MAISON → priorité aux environs immédiats (même rue, rayon ~1 km), puis quartier. N'utilise les ventes éloignées que faute de mieux, et signale-le. La médiane des références doit refléter le micro-marché du bien, pas la commune entière.`;

const FINAL_SYSTEM = `Tu es un expert en estimation immobilière d'une agence haut de gamme. Tu disposes des VENTES RÉELLES DVF autour du bien (triées par proximité, avec adresse, distance et âge de chaque vente). Tu produis l'avis de valeur final, fondé EXCLUSIVEMENT sur ces ventes réelles et les caractéristiques du bien — AUCUNE annonce en ligne n'entre dans l'analyse ni dans le dossier.

RÈGLES :
- Analyse CHAQUE photo fournie (numérotées dans l'ordre : 1 = première) : pièce/vue identifiée, bons points, défauts visibles concrets — ces fiches figurent dans le dossier remis au client. Note l'état par catégorie (etat_notes, 1 à 5) et chiffre impact_etat en euros signés. Signale tout écart avec l'état déclaré. Sans photo : analyse_par_photo et etat_notes vides, impact_etat 0.
- MÉTHODE D'ESTIMATION (chemin imposé, dans cet ordre) :
  1. RÉFÉRENCES → si la fiche fournit une section « RÉFÉRENCES RETENUES », reprends-la TELLE QUELLE dans references_dvf (mêmes ventes, mêmes montants) et utilise la base_mediane IMPOSÉE : c'est ce qui garantit qu'un même dossier donne toujours le même calcul. Sinon, sélectionne 3 à 6 ventes réelles dans la liste DVF fournie, en appliquant la règle de PROXIMITÉ ci-dessous et des surfaces proches du bien (±25 %), et en ÉCARTANT toute vente au €/m² manifestement atypique (bien d'exception, vente entre proches) — mieux vaut 3-4 excellents comparables très proches que 6 éloignés. Dès que la liste n'est pas vide, references_dvf ne doit JAMAIS être vide. Reporte l'adresse et la distance dans localisation/detail. Rédige analyse_dvf.
  2. BASE → base_mediane = le €/m² MÉDIAN de ces références (en privilégiant les plus proches et les plus semblables) MULTIPLIÉ par la surface habitable du bien. Quand la base_mediane est IMPOSÉE, reprends-la exactement : elle est déjà calculée à la surface du bien.
  3. AJUSTEMENTS → liste les PLUS-VALUES (montants positifs : atouts réels — extérieur, DPE, état issu des photos, stationnement, annexes…) et les DÉCOTES (montants négatifs : défauts réels — nuisances, travaux…) dont la somme, depuis base_mediane, aboutit exactement à prix_estime. Chaque ligne est une caractéristique concrète, JAMAIS une correction technique abstraite. La base_mediane étant DÉJÀ calculée à la surface du bien (via le €/m² corrigé de la superficie), N'AJOUTE PAS de ligne « surface » sauf écart résiduel explicitement indiqué. Ligne OBLIGATOIRE d'actualisation au marché actuel (voir règle prioritaire ci-dessous). GARDE-FOUS (dans les deux sens) : hors lignes de surface et d'actualisation, la somme des DÉCOTES ne doit pas excéder ~10 % de base_mediane (sauf défaut majeur objectif justifié), et la somme des PLUS-VALUES ne doit pas excéder ~8 % de base_mediane — SAUF présence d'ÉQUIPEMENT(S) DE VALEUR objectif(s) et justifié(s) (piscine enterrée/en dur, panneaux solaires/photovoltaïques…), auquel cas le total des plus-values peut légitimement atteindre ~12 à 15 %. Chaque facteur ne se compte qu'UNE fois dans un seul sens — ne cumule pas plusieurs lignes pour le même avantage (un simple jardin + terrasse + balcon = UN seul atout « extérieur »). EN REVANCHE, les ÉQUIPEMENTS DE VALEUR se chiffrent CHACUN sur sa PROPRE ligne dédiée, à leur apport réel au prix, et ne sont JAMAIS noyés dans un atout générique ni oubliés : piscine enterrée/en dur +3 à 6 % (piscine hors-sol : négligeable), panneaux solaires/photovoltaïques +2 à 4 %, climatisation réversible / véranda / garage fermé / dépendance aménagée / domotique / borne de recharge +1 à 3 % chacun. Pour le reste, reste sobre : un atout courant vaut 1 à 2 % de la base, un atout rare 3 à 4 % maximum. IMPÉRATIF : passe en revue les ÉQUIPEMENTS listés dans la fiche du bien ci-dessous et valorise explicitement chaque équipement de valeur qui y figure.
  4. FOURCHETTE → fourchette_basse = le prix du scénario « Vente rapide » ; fourchette_haute = le HAUT de la fourchette présentée au client (« Prix plafond »), prix_estime entre les deux. CONTRAINTE IMPÉRATIVE D'ÉCART : l'écart entre « Prix optimal » (prix_presentation) et « Vente rapide » (fourchette_basse) doit être d'AU MOINS 25 000 € — jamais moins. Si le calcul aboutit à un écart inférieur, ABAISSE « Vente rapide » (donc fourchette_basse) jusqu'à obtenir au minimum 25 000 € d'écart. Le prix de mise en marché conseillé (prix_presentation = « Prix optimal ») se place clairement au-dessus de « Vente rapide » (≥ 25 000 €) et jamais au sommet de la fourchette, arrondi vers le bas à un seuil attractif (ex. 355 000). Le « Prix plafond » reste ton garde-fou interne : fourchette_haute ne dépasse jamais la meilleure vente comparable ACTUALISÉE. Justifie les deux bornes et le prix conseillé dans positionnement_marche (ventes de référence, actualisation, atouts/défauts).
- scenarios_prix : exactement 3 scénarios chiffrés, prix STRICTEMENT CROISSANTS :
  1. « Vente rapide » — sous la fourchette, pour vendre en quelques semaines ; il est AU MOINS 25 000 € SOUS le « Prix optimal » (écart minimum impératif).
  2. « Prix optimal » (= prix_presentation) — entre « Vente rapide » et « Prix plafond », au minimum 25 000 € au-dessus de « Vente rapide », arrondi vers le bas à un seuil attractif : le meilleur équilibre entre le prix obtenu et le délai de vente. C'est le prix de mise en marché conseillé.
  3. « Prix plafond » — le prix affiché MAXIMUM raisonnable : ce que le marché peut encore accepter pour ce bien (= le haut de la fourchette, jamais au-dessus de la meilleure vente comparable actualisée). Ce n'est PAS un plafond théorique gonflé : c'est le haut RÉALISTE — l'ancien « prix optimal ambitieux ».
- PRIX PSYCHOLOGIQUES : arrondis prix_presentation et les 3 scénarios VERS LE BAS, à un seuil attractif en milliers ronds (ex. un calcul à 209 300 € s'affiche 209 000 € ou mieux 205 000 € s'il faut passer sous un seuil de recherche) — JAMAIS d'arrondi vers le haut.
- argumentaire_vendeur : 3 à 5 points clés chiffrés ADRESSÉS DIRECTEMENT AU CLIENT (« votre bien », « vous »), DIGESTES : un point par ligne (séparés par \\n), chacun au format « Titre court — explication en 1 à 2 phrases maximum ». Si le prix souhaité par le client est renseigné, l'un des points le positionne avec pédagogie face aux ventes réelles actualisées.
- description_bien : 2 paragraphes factuels et valorisants, adressés au client.
- indice_confiance : reflète la quantité, la proximité et la fraîcheur des ventes de référence (et les photos).
- Réponds intégralement en français.

${PROXIMITE_RULE}

${CONJONCTURE_RULE}

${STYLE_RULE}

${JSON_RULE}`;

function buildPropertyText(input: PropertyInput): string {
  return `# BIEN À ESTIMER

## Vendeur & contexte commercial
- Vendeur : ${[input.clientCivilite, input.clientPrenom, input.clientNom].filter(Boolean).join(" ") || "n.c."}
- Horizon de vente : ${input.horizonVente || "n.c."}
- Négociateur en charge : ${input.negociateur || "n.c."}${input.negociateurTel ? ` — ${input.negociateurTel}` : ""}${input.negociateurEmail ? ` — ${input.negociateurEmail}` : ""}

## Localisation
Adresse : ${input.adresse}, ${input.codePostal} ${input.ville}${input.quartier ? ` — quartier : ${input.quartier}` : ""}

## Caractéristiques
- Type : ${input.typeBien}
- Surface habitable du logement principal : ${input.surfaceHabitable ?? "?"} m²${surfaceDependancesHabitables(input) > 0 ? ` | Dépendances habitables : ${surfaceDependancesHabitables(input)} m² | SURFACE HABITABLE TOTALE : ${surfaceHabitableTotale(input)} m² (c'est CETTE surface totale qui sert de base de comparaison avec les références)` : ""}${input.surfaceTerrain ? ` | Terrain : ${input.surfaceTerrain} m²` : ""}
- Pièces : ${input.nbPieces ?? "?"} | Chambres : ${input.nbChambres ?? "?"} | Salles de bain : ${input.nbSallesDeBain ?? "?"}
- Étage : ${input.etage || "n.c."} | Ascenseur : ${input.ascenseur ? "oui" : "non"}
- Année de construction : ${input.anneeConstruction || "n.c."}
- DPE : ${input.dpe || "n.c."} | GES : ${input.ges || "n.c."}
- État général : ${input.etatGeneral || "n.c."}${input.travauxAPrevoir.length ? ` | Travaux à prévoir : ${input.travauxAPrevoir.join(", ")}` : ""}
- Chauffage : ${input.chauffage || "n.c."} | Exposition : ${input.exposition.length ? input.exposition.join(", ") : "n.c."}
- Luminosité : ${input.luminosite || "n.c."} | Vue : ${input.vue || "n.c."} | Environnement : ${input.environnement || "n.c."}
- Cuisine : ${input.cuisine || "n.c."} | Menuiseries : ${input.menuiseries || "n.c."}${input.mitoyennete ? ` | Mitoyenneté : ${input.mitoyennete}` : ""}
- Équipements : ${input.equipements.length ? `${input.equipements.join(", ")} — chiffre CHAQUE équipement de valeur (piscine en dur, panneaux solaires, climatisation…) sur sa propre ligne de plus-value` : "aucun"}
- Extérieur : ${input.exterieur.length ? input.exterieur.join(", ") : "aucun"}
- Stationnement : ${input.stationnement || "aucun"} | Cave : ${input.cave ? "oui" : "non"}
${(input.dependances ?? []).length ? `- Dépendances : ${(input.dependances ?? []).map((d) => `${d.type}${d.surface ? ` (${d.surface} m²)` : ""}`).join(", ")} — valorise-les dans les plus-values` : ""}
- Charges copro : ${input.chargesCopro ?? "n.c."} €/mois | Taxe foncière : ${input.taxeFonciere ?? "n.c."} €/an

## Contexte de vente
- Prix souhaité par le vendeur : ${input.prixSouhaiteVendeur ? `${input.prixSouhaiteVendeur} €` : "non communiqué"}
- Contexte : ${input.contexteVente || "n.c."}
${input.commentaires ? `- Commentaires du négociateur : ${input.commentaires}` : ""}${
    input.instructionsIA?.trim()
      ? `

## INSTRUCTIONS PARTICULIÈRES DU NÉGOCIATEUR (respecte-les dans l'analyse, la pondération et la rédaction — sans JAMAIS enfreindre les règles de calcul imposées ni inventer de données)
${input.instructionsIA.trim()}`
      : ""
  }
${
  input.mission === "audit"
    ? `
## Commercialisation en cours (le bien ne se vend pas)
- Prix affiché actuel : ${input.prixAffiche ? `${input.prixAffiche} €` : "n.c."}
- En vente depuis : ${input.moisEnVente ?? "?"} mois | Visites réalisées : ${input.nbVisites ?? "n.c."} | Offres reçues : ${input.nbOffres ?? "n.c."}
- Baisses de prix déjà réalisées : ${input.baissesPrix || "aucune"}
${auditLiens(input).length > 0 ? auditLiens(input).map((l, i) => `- Annonce auditée${auditLiens(input).length > 1 ? ` — diffusion ${i + 1}/${auditLiens(input).length} de la même annonce` : ""} (source : ${l.source}) : ${l.url}`).join("\n") : "- (aucun lien d'annonce fourni : audite à partir des informations saisies)"}${
      input.auditWebNotes
        ? `

### Constats relevés en ligne (audit automatique de l'annonce — ta matière première)
${input.auditWebNotes}`
        : ""
    }`
    : ""
}${
  input.mission === "locatif"
    ? `
## Projet locatif
- Location : ${input.meuble || "Vide"}
- Loyer envisagé par le propriétaire : ${input.loyerSouhaite ? `${input.loyerSouhaite} €/mois` : "non communiqué"}${
        input.dissocierAnnexes
          ? `
- ANNEXES DISSOCIÉES (choix du propriétaire) : le loyer estimé porte sur le LOGEMENT SEUL — garage, parking, cave et annexes sont EXCLUS du loyer et seront loués séparément. INTERDICTION d'ajouter une plus-value pour stationnement, garage, cave ou annexe dans les ajustements. Mentionne dans les points de vigilance qu'une annexe louée séparément relève d'un contrat de location libre (hors bail d'habitation), et dans la stratégie qu'elle peut générer un revenu complémentaire.`
          : ""
      }`
    : ""
}${
  input.mission === "bienloue"
    ? `
## Bien vendu loué (calcul par la rentabilité nette)
- Loyer actuellement perçu : ${input.loyerActuel ? `${input.loyerActuel} €/mois hors charges` : "NON RENSEIGNÉ"} (${input.meuble || "Vide"})
- Charges non récupérables du propriétaire : ${input.chargesNonRecuperables ?? 0} €/an | Taxe foncière : ${input.taxeFonciere ?? 0} €/an
- LOYER NET ANNUEL = ${loyerNetAnnuel(input)} € — c'est LA base du calcul
- FOURCHETTE IMPOSÉE (rentabilité nette 6 à 8 %) : Vente rapide = ${prixParRendement(loyerNetAnnuel(input), RENDEMENT_NET_HAUT)} € (8 % net) → Prix optimal = ${prixParRendement(loyerNetAnnuel(input), RENDEMENT_NET_BAS)} € (6 % net)${
        input.prixAcquisition
          ? `
- Acquisition : ${input.prixAcquisition} € en ${input.anneeAcquisition ?? "?"} — le dossier inclut une page de calcul de plus-value immobilière (abattements par durée de détention, impôt 19 % + prélèvements sociaux 17,2 %, net vendeur) calculée automatiquement : tu peux évoquer la fiscalité de la revente dans l'argumentaire, sans refaire le calcul.`
          : ""
      }`
    : ""
}`;
}

const LOCATIF_SYSTEM = `Tu es un expert en gestion locative d'une agence haut de gamme. Tu produis une ESTIMATION LOCATIVE : TOUS les montants principaux (prix_estime, fourchette_basse, fourchette_haute, prix_presentation, prix des scénarios, montants des ajustements, base_mediane) sont des LOYERS MENSUELS en euros par mois (hors charges). prix_m2 = loyer mensuel par m².

RÈGLES :
- Analyse CHAQUE photo fournie (numérotées dans l'ordre : 1 = première) : pièce/vue identifiée, bons points, défauts — ces fiches figurent dans le dossier remis au client propriétaire. Note l'état par catégorie (etat_notes, 1 à 5) et chiffre impact_etat en euros/mois signés. Sans photo : analyse_par_photo et etat_notes vides, impact_etat 0.
- MÉTHODE (chemin imposé, dans cet ordre — RÈGLE DE L'AGENCE : la RÉFÉRENCE du loyer est EXCLUSIVEMENT la valeur HAUTE du tableau officiel (m² haut) ; le loyer conseillé s'ancre sur ce haut et ne descend JAMAIS sous le médian) :
  1. BASE → l'indicateur OFFICIEL de loyer du secteur est fourni (observatoire local des loyers, €/m²/mois, valeurs bas/médian/haut) : base_mediane = HAUT €/m² × surface habitable totale, arrondie à la dizaine d'euros — c'est LA référence du calcul. Si l'indicateur est indisponible, estime le niveau local et baisse l'indice de confiance.
  2. POSITIONNEMENT → place le loyer retenu (prix_estime) ENTRE le MÉDIAN et le HAUT de la fourchette officielle selon l'état et les atouts/défauts du bien : un bien impeccable et bien placé se loue AU haut (la référence), un bien avec défauts descend vers le médian — JAMAIS en dessous du médian. C'est TON JUGEMENT professionnel qui fixe ce positionnement — il peut légitimement différer d'une analyse à l'autre. Les ajustements (en euros/MOIS, négatifs depuis la base haute) le matérialisent — chaque facteur compté UNE fois, somme exacte de base_mediane à prix_estime.
  3. FOURCHETTE → fourchette_basse = valeur MÉDIANE officielle × surface (= scénario « Vente rapide », interne au calcul) ; fourchette_haute = valeur HAUTE officielle × surface. Le loyer CONSEILLÉ (= prix_presentation = scénario « Prix optimal », affiché « Loyer optimal ») = TON loyer retenu (prix_estime), entre médian et haut. « Prix plafond » = valeur HAUTE × surface, affiché au client comme « Loyer maximum ». AUCUNE valeur de vente ni rendement dans ce dossier : il parle exclusivement de loyers.
- CADRE LÉGAL : si le DPE est F ou G, rappelle les contraintes (gel des loyers, interdiction progressive de louer les passoires) dans les points de vigilance et tiens-en compte dans le loyer. Si la commune est en zone d'encadrement des loyers connue, signale-le.
- references_dvf : tableau VIDE [] (pas de tableau de ventes dans un dossier locatif). analyse_dvf = 2 à 3 phrases simples sur le marché locatif local (niveau officiel des loyers, demande).
- scenarios_prix : exactement 3, prix croissants, en €/mois — « Vente rapide » (bas officiel, interne au calcul), « Prix optimal » (TON loyer conseillé — affiché « Loyer optimal »), « Prix plafond » (valeur haute officielle — affiché « Loyer maximum », le niveau au-delà duquel le bien reste vide).
- delai_vente_estime = délai estimé de mise en location.
- description_bien, points forts/faibles, etapes_commercialisation (plan de mise en location : annonce, photos, visites, dossier locataire) et argumentaire_vendeur (points clés pour le propriétaire, dont le rendement) : adressés directement au client.
- indice_confiance : reflète la fiabilité de l'indicateur (nombre d'annonces observées) et la cohérence des données.
- Réponds intégralement en français.

${STYLE_RULE}

${JSON_RULE}`;

const BIENLOUE_SYSTEM = `Tu es un expert en immobilier d'investissement d'une agence haut de gamme. Le bien est VENDU LOUÉ (un locataire est en place) : l'acheteur est un INVESTISSEUR, et le prix d'un bien loué se fixe par sa RENTABILITÉ NETTE — pas par comparaison directe avec les biens vendus libres.

MÉTHODE IMPOSÉE (l'unique chemin de calcul) :
1. LOYER NET ANNUEL → loyer actuellement perçu × 12, MOINS les charges non récupérables du propriétaire et la taxe foncière (les montants sont fournis dans la fiche, avec le loyer net annuel déjà calculé — reprends-le tel quel).
2. FOURCHETTE PAR CAPITALISATION à une rentabilité NETTE de 6 à 8 % (règle stricte) :
   - scénario « Vente rapide » = loyer net annuel ÷ 8 % — le prix qui offre 8 % net à l'investisseur : il part en quelques semaines.
   - scénario « Prix optimal » (= prix_presentation = fourchette_haute) = loyer net annuel ÷ 6 % — le haut de fourchette défendable (6 % net, plancher du marché de l'investissement).
   - prix_estime = loyer net annuel ÷ 7 % (le cœur de fourchette).
   - Arrondis tous ces prix VERS LE BAS au millier. Aucun prix en dehors de cette fourchette 6-8 % net.
3. CONTRÔLE MARCHÉ → les ventes réelles DVF fournies servent de CONTEXTE : sélectionne 4 à 6 références proches (references_dvf, règle de proximité), base_mediane = médiane de leurs prix actés, et commente dans analyse_dvf l'écart entre la valeur « libre » du marché et le prix investisseur (un bien occupé se vend sous sa valeur libre : décote d'occupation). ajustements = [] TOUJOURS (le prix vient de la rentabilité, pas d'ajustements).
- positionnement_marche : explique SIMPLEMENT au client pourquoi un bien loué se vend par sa rentabilité : l'acheteur est un investisseur qui raisonne en rendement net (2 à 4 phrases, chiffres à l'appui : loyer net, fourchette 6-8 %).
- scenarios_prix : exactement les 2 stratégies « Vente rapide » (8 % net) et « Prix optimal » (6 % net), prix croissants, chaque commentaire mentionnant la rentabilité nette offerte à l'acheteur.
- delai_vente_estime : délai réaliste pour une vente investisseur au prix conseillé.
- points_forts : ce qui rassure un investisseur (locataire en place et payeur, loyer net solide, taxe foncière contenue…) ; points_faibles : ce qui le freine (DPE, charges, loyer sous le marché…).
- etapes_commercialisation : plan de commercialisation ORIENTÉ INVESTISSEURS (dossier locatif complet : bail, quittances, rendement net mis en avant dans l'annonce, diffusion vers les investisseurs…).
- argumentaire_vendeur : points clés chiffrés pour le client (« votre bien », « vous ») autour du rendement : ce qu'un investisseur accepte de payer, pourquoi viser plus de 6 % net fait fuir les acheteurs.
- Analyse CHAQUE photo fournie comme pour une estimation classique (analyse_par_photo, etat_notes, impact_etat en euros signés — informatif ici, le prix restant fixé par la rentabilité). Sans photo : tableaux vides, impact_etat 0.
- prix_m2 = prix_estime ÷ surface habitable totale, arrondi à l'euro.
- indice_confiance : élevé si loyer et charges sont renseignés (le calcul est alors mécanique), abaissé sinon.
- Réponds intégralement en français.

${PROXIMITE_RULE}

${STYLE_RULE}

${JSON_RULE}`;

function ageMois(dateIso: string): number {
  const t = new Date(dateIso).getTime();
  if (!Number.isFinite(t)) return 0;
  return Math.max(0, Math.round((Date.now() - t) / (30.44 * 24 * 3600 * 1000)));
}

function dvfBlock(dvfSales: DvfSale[]): string {
  const dist = (s: DvfSale) =>
    s.memeAdresse
      ? " | MÊME ADRESSE (même copropriété/parcelle)"
      : s.distanceM != null
        ? ` | à ${s.distanceM < 1000 ? `${s.distanceM} m` : `${(s.distanceM / 1000).toFixed(1)} km`} du bien`
        : "";
  return dvfSales.length > 0
    ? dvfSales
        .slice(0, 40)
        .map(
          (s) =>
            `- ${s.date} (il y a ${ageMois(s.date)} mois) | ${s.typeLocal} | ${s.surface ?? "?"} m² | ${s.valeurFonciere} € | ${s.prixM2 ?? "?"} €/m² | ${s.adresse ? `${s.adresse}, ` : ""}${s.commune}${dist(s)}`,
        )
        .join("\n")
    : "(données DVF indisponibles pour ce secteur — baisse l'indice de confiance en conséquence)";
}

function modelConfig() {
  return {
    model: process.env.ESTIMATION_MODEL ?? "claude-opus-4-8",
    effort: (process.env.ESTIMATION_EFFORT ?? "high") as "low" | "medium" | "high",
  };
}

/** Extrait l'objet JSON de la réponse (tolère balises markdown et texte parasite). */
function parseJsonLoose(text: string): Record<string, unknown> {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Réponse IA sans objet JSON");
  return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
}

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
const str = (v: unknown) => (typeof v === "string" ? v : "");
const arr = <T,>(v: unknown) => (Array.isArray(v) ? (v as T[]) : []);

/** Tous les liens de l'annonce à auditer (principal + multidiffusion), dédoublonnés. */
export function auditUrls(input: PropertyInput): string[] {
  return auditLiens(input).map((l) => l.url);
}

/** Liens annotés de leur source (site de notre agence, agence concurrente,
 *  portail…) : l'annotation guide l'IA — qui détient le mandat, quels
 *  portails diffusent, où chercher l'historique. */
export function auditLiens(input: PropertyInput): { url: string; source: string }[] {
  const urls = input.urlsAnnonce?.length ? input.urlsAnnonce : [input.urlAnnonce ?? ""];
  const sources = input.sourcesAnnonce ?? [];
  const vus = new Set<string>();
  const out: { url: string; source: string }[] = [];
  urls.forEach((u, i) => {
    const url = (u ?? "").trim();
    if (!/^https?:\/\/\S+/.test(url) || vus.has(url)) return;
    vus.add(url);
    out.push({ url, source: (sources[i] ?? "").trim() || "Non précisé" });
  });
  return out;
}

// ---------------------------------------------------------------------------
// Audit de commercialisation : le négociateur ne saisit QUE le client et le
// lien de l'annonce. Cette phase ouvre l'annonce et en extrait la fiche
// complète du bien (localisation, surface, pièces, DPE, prix affiché…),
// qui alimente ensuite le même moteur d'estimation DVF que le mode Vente.
// ---------------------------------------------------------------------------

const EXTRACT_SCHEMA = {
  type: "object",
  properties: {
    adresse: { type: "string", description: "Adresse ou rue si mentionnée, sinon le secteur indiqué par l'annonce" },
    codePostal: { type: "string", description: "Code postal à 5 chiffres — déduis-le de la ville/du secteur si l'annonce ne l'affiche pas (web_search autorisé)" },
    ville: { type: "string" },
    quartier: { type: "string" },
    typeBien: { type: "string", enum: ["appartement", "maison", "terrain", "immeuble", "local"] },
    surfaceHabitable: { type: "number", description: "m² habitables (0 si introuvable)" },
    surfaceTerrain: { type: "number", description: "m² de terrain (0 si sans objet)" },
    nbPieces: { type: "number" },
    nbChambres: { type: "number" },
    nbSallesDeBain: { type: "number" },
    etage: { type: "string" },
    ascenseur: { type: "boolean" },
    anneeConstruction: { type: "string" },
    dpe: { type: "string", description: "Lettre A à G, vide si absente" },
    ges: { type: "string" },
    etatGeneral: { type: "string", description: "Ex. Bon état, Travaux à prévoir — d'après le texte de l'annonce" },
    chauffage: { type: "string" },
    exposition: { type: "array", items: { type: "string" } },
    exterieur: { type: "array", items: { type: "string" }, description: "Balcon, Terrasse, Jardin, Piscine…" },
    stationnement: { type: "string" },
    cave: { type: "boolean" },
    vue: { type: "string" },
    environnement: { type: "string" },
    luminosite: { type: "string" },
    equipements: { type: "array", items: { type: "string" } },
    chargesCopro: { type: "number", description: "Charges de copropriété €/mois (0 si absentes)" },
    taxeFonciere: { type: "number", description: "€/an (0 si absente)" },
    prixAffiche: { type: "number", description: "PRIX AFFICHÉ actuel de l'annonce en euros" },
    baissesPrix: { type: "string", description: "Baisses de prix détectées (mention de l'annonce ou historique web), chronologie courte, vide sinon" },
    ancienneteAnnonce: { type: "string", description: "Ancienneté détectée de la diffusion (annonce + historique web), avec la source, vide si non vérifiable" },
    qualiteAnnonce: { type: "string", description: "3 à 6 constats CONCIS sur l'annonce elle-même, un par ligne : titre (accroche ?), texte (longueur, atouts mis en avant, clarté), photos (nombre, ordre, qualité apparente), mentions de baisse, diffusion multi-agences éventuelle" },
    commentaires: { type: "string", description: "2 à 3 phrases : ce que l'annonce met en avant + nombre et qualité apparente des photos" },
  },
  required: ["codePostal", "ville", "typeBien", "surfaceHabitable", "prixAffiche", "ancienneteAnnonce", "baissesPrix", "qualiteAnnonce"],
} as const;

/** Ouvre l'annonce en ligne et en extrait la fiche du bien (mission audit).
 *  Accepte plusieurs liens de la MÊME annonce (multidiffusion) : si un
 *  portail bloque, le suivant prend le relais. */
export async function extractListingFacts(
  liens: { url: string; source: string }[],
  onProgress: (label: string) => void = () => {},
): Promise<Record<string, unknown>> {
  const client = new Anthropic();
  const { model } = modelConfig();
  onProgress("Lecture de l'annonce en ligne : extraction de la fiche du bien…");
  const liste = liens.map((l, i) => `${i + 1}. [${l.source}] ${l.url}`).join("\n");
  let messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `Voici ${liens.length > 1 ? "les liens de la MÊME annonce immobilière, diffusée sur plusieurs sites" : "le lien d'une annonce immobilière"}, chacun annoté de sa source entre crochets (site de notre agence, agence concurrente, portail…) :
${liste}

C'est la SEULE phase avec accès au web : fais TOUT le travail en ligne ici, en une passe efficace.
1. FICHE DU BIEN → ouvre l'annonce avec web_fetch (commence par le lien 1 ; si un site bloque l'accès, passe au lien suivant, les annotations t'indiquent la nature de chaque site) et extrais la fiche EXACTE du bien.
2. AUDIT DE LA DIFFUSION → note tes constats sur l'annonce elle-même (qualiteAnnonce : titre, texte, photos, mentions de baisse) et utilise UNE OU DEUX recherches web maximum pour l'historique (ancienneteAnnonce, baissesPrix : ancienneté réelle, baisses successives, re-publications).${liens.length > 1 ? " Si plusieurs versions sont accessibles, CROISE-les : elles se complètent, et un écart de prix entre elles (annonce non mise à jour, prix différents selon les agences) est un constat précieux — signale-le." : ""}

RÈGLES :
- SOIS RAPIDE ET DIRECT : pas d'exploration exhaustive — dès que tu as la fiche et 2-3 constats solides, réponds. Un champ non trouvé reste vide, ce n'est pas un échec.
- N'invente RIEN : un champ absent de l'annonce reste vide ("", 0, false ou []).
- codePostal est OBLIGATOIRE : s'il n'apparaît pas, déduis-le de la ville ou du quartier.
- prixAffiche = le prix actuellement affiché par l'annonce, en euros (le plus récent si les versions divergent).
- Si TOUTES les versions sont inaccessibles (pages bloquées), réponds quand même avec ce que les URLs et une recherche web permettent d'établir (ville, type de bien…), champs inconnus vides.

FORMAT : réponds EXCLUSIVEMENT par un objet JSON conforme à ce schéma :
${JSON.stringify(EXTRACT_SCHEMA)}`,
    },
  ];
  let message: Anthropic.Message;
  let continuations = 0;
  for (;;) {
    const stream = client.messages.stream({
      model,
      max_tokens: 5000,
      system:
        "Tu extrais la fiche d'un bien immobilier depuis son annonce en ligne et tu relèves les constats d'audit (ancienneté, baisses, qualité de l'annonce). Tu travailles VITE : le strict nécessaire d'outils, pas d'exploration superflue. Tu réponds exclusivement par un objet JSON valide conforme au schéma fourni, sans texte autour.",
      tools: [
        { type: "web_fetch_20260209" as const, name: "web_fetch" as const, max_uses: 4 },
        { type: "web_search_20260209" as const, name: "web_search" as const, max_uses: 2 },
      ],
      output_config: { effort: "medium" },
      messages,
    });
    message = await stream.finalMessage();
    if (message.stop_reason === "pause_turn" && continuations < 4) {
      continuations += 1;
      onProgress("Audit de l'annonce en ligne : historique et constats…");
      messages = [...messages, { role: "assistant", content: message.content }];
      continue;
    }
    break;
  }
  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  return parseJsonLoose(text);
}

/**
 * Fusionne la fiche extraite de l'annonce dans la saisie du négociateur :
 * les champs extraits remplissent la fiche (en mission audit, seuls le
 * client et le lien sont saisis), sans jamais toucher aux informations
 * client/négociateur ni aux champs déjà renseignés à la main.
 */
export function mergeListingFacts(
  input: PropertyInput,
  facts: Record<string, unknown>,
): PropertyInput {
  const out: PropertyInput = { ...input };
  const KEYS: (keyof PropertyInput)[] = [
    "adresse", "codePostal", "ville", "quartier", "typeBien",
    "surfaceHabitable", "surfaceTerrain", "nbPieces", "nbChambres", "nbSallesDeBain",
    "etage", "ascenseur", "anneeConstruction", "dpe", "ges", "etatGeneral",
    "chauffage", "exposition", "exterieur", "stationnement", "cave", "vue",
    "environnement", "luminosite", "equipements", "chargesCopro", "taxeFonciere",
    "prixAffiche", "baissesPrix",
  ];
  const empty = (v: unknown) =>
    v === null || v === undefined || v === "" || v === 0 || v === false ||
    (Array.isArray(v) && v.length === 0);
  for (const k of KEYS) {
    const v = facts[k];
    if (empty(v)) continue;
    if (empty(out[k]) || ["adresse", "codePostal", "ville", "typeBien", "surfaceHabitable"].includes(k)) {
      (out as unknown as Record<string, unknown>)[k] = v as unknown;
    }
  }
  // codePostal : ne garder que 5 chiffres valides
  if (!/^\d{5}$/.test(out.codePostal ?? "")) {
    const m = String(facts.codePostal ?? "").match(/\d{5}/);
    out.codePostal = m ? m[0] : input.codePostal;
  }
  // Le résumé de l'annonce enrichit les commentaires sans écraser la saisie
  const resume = typeof facts.commentaires === "string" ? facts.commentaires.trim() : "";
  if (resume) {
    out.commentaires = [input.commentaires?.trim(), `Lu dans l'annonce : ${resume}`]
      .filter(Boolean)
      .join("\n");
  }
  // Constats web (ancienneté, baisses, qualité de l'annonce) : digest passé
  // à la phase de rédaction, qui n'a PLUS d'accès web — une seule passe en
  // ligne pour tout l'audit
  const sTxt = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const notes = [
    sTxt(facts.ancienneteAnnonce) ? `Ancienneté détectée : ${sTxt(facts.ancienneteAnnonce)}` : "",
    sTxt(facts.baissesPrix) ? `Baisses de prix détectées : ${sTxt(facts.baissesPrix)}` : "",
    sTxt(facts.qualiteAnnonce) ? `Constats sur l'annonce (titre, texte, photos) :\n${sTxt(facts.qualiteAnnonce)}` : "",
  ].filter(Boolean);
  if (notes.length) out.auditWebNotes = notes.join("\n");
  return out;
}

/** Estimation complète en une phase : photos + ventes réelles DVF (sans outils web). */
export async function computeFinalReport(
  input: PropertyInput,
  dvfSales: DvfSale[],
  onProgress: (label: string) => void = () => {},
  loyer: LoyerIndicateur | null = null,
): Promise<EstimationReport> {
  const client = new Anthropic();
  const { model, effort } = modelConfig();
  const mission = input.mission ?? "vente";
  const system =
    mission === "locatif"
      ? LOCATIF_SYSTEM
      : mission === "bienloue"
        ? BIENLOUE_SYSTEM
        : mission === "audit"
          ? `${FINAL_SYSTEM}\n\n${AUDIT_RULE}`
          : FINAL_SYSTEM;

  const content: Anthropic.ContentBlockParam[] = [];
  for (const photo of input.photos.slice(0, 20)) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: photo.mediaType, data: photo.data },
    });
  }
  // Sélection déterministe des références AVANT l'appel : le même dossier
  // relancé deux fois s'appuie ainsi sur les MÊMES ventes et la MÊME base
  // médiane — seuls les textes gardent une légère variation rédactionnelle
  const deterministic = mission === "locatif" ? null : buildDvfReferences(dvfSales, input);
  content.push({
    type: "text",
    text: `${buildPropertyText(input)}

# VENTES RÉELLES DVF (commune entière du code postal ${input.codePostal}, triées par proximité avec le bien)
${dvfBlock(dvfSales)}
${
  deterministic && deterministic.references.length > 0
    ? `
# RÉFÉRENCES RETENUES — « DANS VOTRE RUE / À PROXIMITÉ IMMÉDIATE » (priorité géographique : les ventes les plus proches, valeurs aberrantes exclues — reprends-les TELLES QUELLES dans references_dvf, sans en changer ni les ventes ni les montants)
${deterministic.references.map((ref) => `- ${ref.localisation} | ${ref.detail} | ${ref.surface} m² | ${ref.date} | ${ref.prix} € | ${ref.prix_m2} €/m² brut → ${ref.prix_m2_ajuste} €/m² ajusté à ${surfaceHabitableTotale(input)} m²${ref.raison ? ` | ${ref.raison}` : ""}`).join("\n")}
- RÉFÉRENCE DU SECTEUR : à proximité immédiate, les biens se vendent entre ${deterministic.secteurM2Bas} et ${deterministic.secteurM2Haut} €/m² BRUT. Appuie-toi sur ce constat dans positionnement_marche : « dans votre rue / secteur, les ventes se situent autour de X €/m² ».
- CORRECTION DE SUPERFICIE (déjà appliquée) : le €/m² décroît avec la surface (élasticité ${deterministic.betaSurface}) — une référence plus petite est ramenée à la baisse, une plus grande à la hausse, pour être comparable à un bien de ${surfaceHabitableTotale(input)} m². Explique ce principe SIMPLEMENT au propriétaire (plus le bien est grand, plus le prix au m² baisse, et inversement).
- base_mediane IMPOSÉE = ${deterministic.baseMediane} € = ${deterministic.baseM2 || "?"} €/m² (référence de proximité CORRIGÉE de la superficie) × surface du bien. NE la recalcule PAS, NE la transpose PAS : c'est déjà ta base de départ, à la surface exacte du bien.
- FIABILITÉ des comparables : ${deterministic.fiabilite}${deterministic.raisonFiabilite ? ` — ${deterministic.raisonFiabilite}` : ""}${deterministic.nbAberrantes > 0 ? ` (${deterministic.nbAberrantes} vente(s) atypique(s) écartée(s) du calcul)` : ""}. Si la fiabilité est « faible », élargis la fourchette, reste prudent sur le prix conseillé et adapte l'indice de confiance à cette fiabilité.
`
    : ""
}${
  mission === "locatif"
    ? `
# INDICATEUR OFFICIEL DE LOYER DU SECTEUR (observatoire des loyers)
${
        loyer
          ? `- Secteur : ${loyer.commune} | Typologie : ${loyer.typologie} | Source : ${loyer.millesime} (${loyer.nbAnnonces} loyers observés)
- Loyer BAS : ${loyer.loyerM2Bas} €/m²/mois | Loyer MÉDIAN : ${loyer.loyerM2} €/m²/mois | (haut : ${loyer.loyerM2Haut} €/m², INFORMATIF UNIQUEMENT)
- RÈGLE STRICTE : la RÉFÉRENCE = le m² HAUT. Fourchette de loyer = du MÉDIAN au HAUT × surface ; le loyer CONSEILLÉ s'ancre sur le HAUT et ne descend jamais sous le médian.`
          : "(indicateur indisponible pour cette commune — estime prudemment le niveau local et baisse l'indice de confiance)"
      }
`
    : ""
}
# TA MISSION
${
  mission === "locatif"
    ? "Produis l'estimation locative complète : analyse chaque photo, fixe le loyer de base depuis l'indicateur officiel (médian), les ajustements en €/mois, la fourchette de loyer (bas → haut du secteur) et les 3 scénarios — uniquement des loyers, aucune valeur de vente."
    : mission === "bienloue"
      ? "Produis l'estimation du bien vendu loué : fourchette par capitalisation du loyer net annuel à 6-8 % de rentabilité nette (méthode imposée), références DVF en contexte (décote d'occupation), plan de commercialisation orienté investisseurs et argumentaire rendement pour le client."
      : mission === "audit"
      ? "Produis l'audit de commercialisation complet : estimation de la valeur réelle (ventes DVF actualisées), diagnostic chiffré des raisons de la non-vente, prix de relance conseillé et plan de relance concret."
      : "Produis l'avis de valeur final, fondé uniquement sur ces ventes réelles : analyse chaque photo, sélectionne les références les plus proches, fixe la base médiane, les ajustements (dont l'actualisation au marché actuel), la fourchette (4-6 % d'écart justifié) et les 3 scénarios de prix."
}

# SCHÉMA JSON DE LA RÉPONSE (respecte-le exactement)
${JSON.stringify(schemaFor(mission))}`,
  });

  // AUCUN outil web ici, quel que soit le mode : en audit, tout le travail
  // en ligne a déjà été fait par la phase d'extraction (une seule passe web)
  // — la rédaction est ainsi rapide, fiable et économe en tokens
  onProgress(
    mission === "audit"
      ? "Rédaction de l'audit : diagnostic, prix de relance et recommandations…"
      : input.photos.length > 0
        ? `Analyse des ${Math.min(input.photos.length, 20)} photos et rédaction de l'avis de valeur…`
        : "Rédaction de l'avis de valeur…",
  );

  const stream = client.messages.stream({
    model,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system,
    output_config: { effort },
    messages: [{ role: "user", content }],
  });
  const message = await stream.finalMessage();
  if (message.stop_reason === "refusal") throw new Error("Requête refusée par les garde-fous du modèle");

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  const r = parseJsonLoose(text);

  // Références DVF : la sélection déterministe fait TOUJOURS foi (stabilité
  // entre deux lancements du même dossier) ; celle du rédacteur ne sert que
  // de secours. En mission locative, pas de tableau de ventes.
  const referencesDvf =
    mission === "locatif"
      ? []
      : (deterministic?.references.length ?? 0) > 0
        ? deterministic!.references
        : arr<ReferenceDvf>(r.references_dvf);
  const loyerBase = loyer
    ? Math.round((loyer.loyerM2 * surfaceHabitableTotale(input)) / 10) * 10
    : 0;
  const baseMediane =
    mission === "locatif"
      ? num(r.base_mediane) || loyerBase
      : (deterministic?.baseMediane ?? 0) || num(r.base_mediane);

  const report: EstimationReport = {
    prix_estime: num(r.prix_estime),
    fourchette_basse: num(r.fourchette_basse),
    fourchette_haute: num(r.fourchette_haute),
    prix_m2: num(r.prix_m2),
    prix_presentation: num(r.prix_presentation),
    description_bien: str(r.description_bien),
    indice_confiance: num(r.indice_confiance),
    delai_vente_estime: str(r.delai_vente_estime),
    positionnement_marche: str(r.positionnement_marche),
    analyse_dvf: str(r.analyse_dvf),
    analyse_concurrence: "",
    analyse_invendus: "",
    analyse_photos: str(r.analyse_photos),
    analyse_par_photo: arr(r.analyse_par_photo),
    etat_notes: arr(r.etat_notes),
    coefficient_etat: str(r.coefficient_etat),
    impact_etat: num(r.impact_etat),
    annonces_concurrentes: [],
    audit_concurrentiel: {
      nb_annonces_analysees: 0, prix_m2_min: 0, prix_m2_median: 0, prix_m2_max: 0,
      tension_marche: "", synthese: "",
    },
    scenarios_prix: arr(r.scenarios_prix),
    references_dvf: referencesDvf,
    base_mediane: baseMediane,
    ajustements: arr(r.ajustements),
    etapes_commercialisation: arr(r.etapes_commercialisation),
    points_forts: arr(r.points_forts),
    points_faibles: arr(r.points_faibles),
    strategie_commercialisation: str(r.strategie_commercialisation),
    argumentaire_vendeur: str(r.argumentaire_vendeur),
    valeur_venale_indicative: num(r.valeur_venale_indicative),
    rendement_brut: num(r.rendement_brut),
    analyse_annonce: str(r.analyse_annonce),
    anciennete_annonce: str(r.anciennete_annonce),
    baisses_annonce: str(r.baisses_annonce),
    recommandations_annonce: arr(r.recommandations_annonce),
  };
  // Garantie déterministe (missions de VENTE uniquement, pas les loyers) :
  // l'écart « Prix optimal » (prix_presentation) − « Vente rapide »
  // (fourchette_basse) est d'au moins 25 000 €. Si l'IA propose moins, on
  // abaisse la borne basse et on réaligne le scénario « Vente rapide ».
  const ECART_MIN_VENTE = 25000;
  const missionVente = mission === "vente" || mission === "audit";
  if (missionVente && report.prix_presentation > 0 && report.fourchette_basse > 0
      && report.prix_presentation - report.fourchette_basse < ECART_MIN_VENTE) {
    const nouvelleBasse = Math.floor((report.prix_presentation - ECART_MIN_VENTE) / 1000) * 1000;
    if (nouvelleBasse > 0) {
      report.fourchette_basse = nouvelleBasse;
      if (report.prix_estime < nouvelleBasse) report.prix_estime = nouvelleBasse;
      const sc = report.scenarios_prix;
      if (Array.isArray(sc) && sc.length) {
        let idxMin = 0;
        for (let i = 1; i < sc.length; i++) if (num(sc[i]?.prix) < num(sc[idxMin]?.prix)) idxMin = i;
        if (sc[idxMin]) sc[idxMin].prix = nouvelleBasse;
      }
    }
  }
  if (report.prix_estime <= 0 || report.fourchette_basse <= 0) {
    throw new Error("Réponse IA incomplète (prix manquants)");
  }
  return report;
}
