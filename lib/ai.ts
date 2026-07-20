import Anthropic from "@anthropic-ai/sdk";
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
    base_mediane: { type: "number", description: "MÉDIANE DES PRIX ACTÉS des references_dvf sélectionnées, en euros — le prix médian TEL QUEL, sans transposition au m² ni à la surface du bien (0 si non calculable)" },
    prix_estime: { type: "number", description: "Cœur de fourchette en euros" },
    fourchette_basse: { type: "number", description: "= prix du scénario Vente rapide" },
    fourchette_haute: { type: "number", description: "= prix du scénario Prix optimal (= prix_presentation)" },
    prix_m2: { type: "number" },
    prix_presentation: { type: "number", description: "Prix affiché conseillé (= scénario Prix optimal, à mi-chemin entre Vente rapide et Prix plafond)" },
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
      description: "Exactement 3, prix croissants : Vente rapide < Prix optimal (= prix_presentation, à mi-chemin) < Prix plafond (= fourchette_haute, le maximum réaliste)",
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
    schema.properties.fourchette_basse.description = "= loyer du scénario Vente rapide (mise en location immédiate), €/mois";
    schema.properties.fourchette_haute.description = "= loyer du scénario Prix optimal (loyer conseillé, = prix_presentation), €/mois";
    schema.properties.prix_m2.description = "Loyer mensuel par m² habitable";
    schema.properties.prix_presentation.description = "Loyer conseillé à l'affichage (= scénario Prix optimal), €/mois";
    schema.properties.base_mediane.description = "Loyer de base : indicateur officiel €/m² × surface habitable totale, arrondi à la dizaine (€/mois)";
    schema.properties.references_dvf.description = "TOUJOURS un tableau vide [] pour une estimation locative";
    schema.properties.delai_vente_estime.description = "Délai estimé de mise en location";
    schema.properties.valeur_venale_indicative = {
      type: "number",
      description: "Valeur de VENTE indicative du bien (euros), fondée sur les ventes DVF fournies actualisées — sert au calcul du rendement",
    };
    schema.properties.rendement_brut = {
      type: "number",
      description: "Rendement brut annuel en % = (loyer mensuel × 12) ÷ valeur vénale × 100, arrondi au dixième",
    };
    schema.required.push("valeur_venale_indicative", "rendement_brut");
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

const AUDIT_RULE = `MISSION : AUDIT DE COMMERCIALISATION. Le bien est DÉJÀ EN VENTE et ne se vend pas (prix affiché, ancienneté, visites et offres fournis dans la fiche). En plus de l'estimation complète :
- positionnement_marche = le DIAGNOSTIC en 3 à 4 phrases simples : pourquoi le bien ne se vend pas (écart entre le prix affiché et la valeur de marché actualisée, présentation, cible), chiffres à l'appui.
- points_faibles = les freins concrets à la vente identifiés ; points_forts = les atouts à mieux mettre en avant dans l'annonce.
- scenarios_prix : « Prix optimal » = le PRIX DE RELANCE conseillé (repositionnement) — sous le prix affiché actuel si celui-ci est au-dessus du marché ; « Vente rapide » = l'option coup de fusil.
- etapes_commercialisation = PLAN DE RELANCE concret : repositionnement du prix, re-shooting photo, réécriture de l'annonce, re-publication (retrouver la fraîcheur), élargissement de la diffusion, home staging…
- argumentaire_vendeur = les points clés chiffrés pour faire accepter le repositionnement au client (ex. « à ce prix, votre bien est ignoré : N visites en M mois — au prix de relance, il revient dans la zone où les acheteurs cliquent »).
- delai_vente_estime = délai estimé APRÈS repositionnement.
- ANALYSE DE L'ANNONCE EN LIGNE (si une URL d'annonce est fournie) : OUVRE l'annonce avec web_fetch. Analyse le prix affiché, le titre et le texte (accroche, longueur, atouts mis en avant, clarté), la qualité, le nombre et l'ordre des photos, les mentions de baisse. Utilise web_search pour retrouver l'HISTORIQUE de l'annonce : ancienneté réelle, baisses de prix successives, re-publications (sites d'historique d'annonces, cache des portails). Renseigne :
  · anciennete_annonce (ce que tu as détecté, avec la source) et baisses_annonce (chronologie des baisses détectées) — croise avec les informations saisies par le négociateur ;
  · analyse_annonce : 2 à 3 phrases simples, le verdict global sur l'annonce ;
  · recommandations_annonce : 4 à 8 recommandations CONCRÈTES, façon audit professionnel — chacune avec categorie (Prix, Titre & texte, Photos, Diffusion, Mise en valeur), constat (ce qui pèche aujourd'hui, factuel), recommandation (l'action précise à mener) et priorite (haute / moyenne / basse). Classe-les par priorité décroissante.
  Si l'annonce est inaccessible (portail bloqué), appuie-toi sur les informations saisies, dis ce que tu n'as pas pu vérifier — n'invente JAMAIS un constat.`;

const PROXIMITE_RULE = `PROXIMITÉ (impératif) : chaque vente DVF de la liste indique son adresse et sa distance au bien. APPARTEMENT → priorité absolue aux ventes à la MÊME ADRESSE (même copropriété : comparables parfaits), puis même rue, puis rayon proche. MAISON → priorité aux environs immédiats (même rue, rayon ~1 km), puis quartier. N'utilise les ventes éloignées que faute de mieux, et signale-le. La médiane des références doit refléter le micro-marché du bien, pas la commune entière.`;

const FINAL_SYSTEM = `Tu es un expert en estimation immobilière d'une agence haut de gamme. Tu disposes des VENTES RÉELLES DVF autour du bien (triées par proximité, avec adresse, distance et âge de chaque vente). Tu produis l'avis de valeur final, fondé EXCLUSIVEMENT sur ces ventes réelles et les caractéristiques du bien — AUCUNE annonce en ligne n'entre dans l'analyse ni dans le dossier.

RÈGLES :
- Analyse CHAQUE photo fournie (numérotées dans l'ordre : 1 = première) : pièce/vue identifiée, bons points, défauts visibles concrets — ces fiches figurent dans le dossier remis au client. Note l'état par catégorie (etat_notes, 1 à 5) et chiffre impact_etat en euros signés. Signale tout écart avec l'état déclaré. Sans photo : analyse_par_photo et etat_notes vides, impact_etat 0.
- MÉTHODE D'ESTIMATION (chemin imposé, dans cet ordre) :
  1. RÉFÉRENCES → sélectionne 4 à 6 ventes réelles dans la liste DVF fournie, en appliquant la règle de PROXIMITÉ ci-dessous et des surfaces proches du bien (±25 %) — dès que la liste n'est pas vide, references_dvf ne doit JAMAIS être vide. Reporte l'adresse et la distance dans localisation/detail. Rédige analyse_dvf.
  2. BASE → base_mediane = la médiane des PRIX ACTÉS de ces références, telle quelle (le chiffre affiché sous le tableau des comparables du dossier) — ne la transpose NI au m² NI à la surface du bien.
  3. AJUSTEMENTS → liste les PLUS-VALUES (montants positifs : atouts réels — extérieur, DPE, état issu des photos, stationnement, annexes…) et les DÉCOTES (montants négatifs : défauts réels — nuisances, travaux…) dont la somme, depuis base_mediane, aboutit exactement à prix_estime. Chaque ligne est une caractéristique concrète, JAMAIS une correction technique abstraite. Si la surface du bien diffère sensiblement des références : une seule ligne « Surface supérieure/inférieure aux références (X m² vs Y m² médians) ». Ligne OBLIGATOIRE d'actualisation au marché actuel (voir règle prioritaire ci-dessous). GARDE-FOUS (dans les deux sens) : hors lignes de surface et d'actualisation, la somme des DÉCOTES ne doit pas excéder ~10 % de base_mediane (sauf défaut majeur objectif justifié), et la somme des PLUS-VALUES ne doit pas excéder ~8 % de base_mediane. Chaque facteur ne se compte qu'UNE fois dans un seul sens — ne cumule pas plusieurs lignes pour le même avantage (ex. « piscine » + « extérieur » + « jardin » = un seul atout extérieur). Reste sobre : un atout courant vaut 1 à 2 % de la base, un atout rare 3 à 4 % maximum.
  4. FOURCHETTE RESSERRÉE → fourchette_basse = le prix du scénario « Vente rapide » et fourchette_haute = le prix du scénario « Prix optimal » (= prix_presentation) : la fourchette présentée au client va du prix de vente rapide au prix conseillé, avec un écart total de 4 à 6 % MAXIMUM et prix_estime entre les deux. Le « Prix plafond » reste ton garde-fou interne : fourchette_haute ne dépasse jamais la meilleure vente comparable ACTUALISÉE. Justifie les deux bornes dans positionnement_marche (ventes de référence, actualisation, atouts/défauts).
- scenarios_prix : exactement 3 scénarios chiffrés, prix STRICTEMENT CROISSANTS :
  1. « Vente rapide » — sous la fourchette, pour vendre en quelques semaines.
  2. « Prix optimal » (= prix_presentation) — à MI-CHEMIN entre Vente rapide et Prix plafond : le meilleur équilibre entre le prix obtenu et le délai de vente. C'est le prix de mise en marché conseillé.
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
- Équipements : ${input.equipements.length ? input.equipements.join(", ") : "aucun"}
- Extérieur : ${input.exterieur.length ? input.exterieur.join(", ") : "aucun"}
- Stationnement : ${input.stationnement || "aucun"} | Cave : ${input.cave ? "oui" : "non"}
${(input.dependances ?? []).length ? `- Dépendances : ${(input.dependances ?? []).map((d) => `${d.type}${d.surface ? ` (${d.surface} m²)` : ""}`).join(", ")} — valorise-les dans les plus-values` : ""}
- Charges copro : ${input.chargesCopro ?? "n.c."} €/mois | Taxe foncière : ${input.taxeFonciere ?? "n.c."} €/an

## Contexte de vente
- Prix souhaité par le vendeur : ${input.prixSouhaiteVendeur ? `${input.prixSouhaiteVendeur} €` : "non communiqué"}
- Contexte : ${input.contexteVente || "n.c."}
${input.commentaires ? `- Commentaires du négociateur : ${input.commentaires}` : ""}
${
  input.mission === "audit"
    ? `
## Commercialisation en cours (le bien ne se vend pas)
- Prix affiché actuel : ${input.prixAffiche ? `${input.prixAffiche} €` : "n.c."}
- En vente depuis : ${input.moisEnVente ?? "?"} mois | Visites réalisées : ${input.nbVisites ?? "n.c."} | Offres reçues : ${input.nbOffres ?? "n.c."}
- Baisses de prix déjà réalisées : ${input.baissesPrix || "aucune"}
${input.urlAnnonce ? `- ANNONCE EN LIGNE À AUDITER : ${input.urlAnnonce}` : "- (aucun lien d'annonce fourni : audite à partir des informations saisies)"}`
    : ""
}${
  input.mission === "locatif"
    ? `
## Projet locatif
- Location : ${input.meuble || "Vide"}
- Loyer envisagé par le propriétaire : ${input.loyerSouhaite ? `${input.loyerSouhaite} €/mois` : "non communiqué"}`
    : ""
}`;
}

const LOCATIF_SYSTEM = `Tu es un expert en gestion locative d'une agence haut de gamme. Tu produis une ESTIMATION LOCATIVE : TOUS les montants principaux (prix_estime, fourchette_basse, fourchette_haute, prix_presentation, prix des scénarios, montants des ajustements, base_mediane) sont des LOYERS MENSUELS en euros par mois (hors charges). prix_m2 = loyer mensuel par m².

RÈGLES :
- Analyse CHAQUE photo fournie (numérotées dans l'ordre : 1 = première) : pièce/vue identifiée, bons points, défauts — ces fiches figurent dans le dossier remis au client propriétaire. Note l'état par catégorie (etat_notes, 1 à 5) et chiffre impact_etat en euros/mois signés. Sans photo : analyse_par_photo et etat_notes vides, impact_etat 0.
- MÉTHODE (chemin imposé, dans cet ordre) :
  1. BASE → l'indicateur OFFICIEL de loyer de la commune est fourni (« carte des loyers », €/m²/mois) : base_mediane = indicateur €/m² × surface habitable totale, arrondie à la dizaine d'euros. Si l'indicateur est indisponible, estime prudemment le niveau local et baisse l'indice de confiance.
  2. AJUSTEMENTS → PLUS-VALUES (atouts réels : extérieur, DPE performant, stationnement, meublé, état, annexes…) et DÉCOTES (défauts : travaux, DPE F/G, nuisances…) en euros/MOIS, dont la somme depuis base_mediane aboutit exactement à prix_estime. GARDE-FOUS : plus-values ≤ ~15 % de la base, décotes ≤ ~15 % (sauf contrainte légale majeure), chaque facteur compté UNE fois.
  3. FOURCHETTE → fourchette_basse = prix du scénario « Vente rapide » (mise en location immédiate) ; fourchette_haute = prix du scénario « Prix optimal » (loyer conseillé, = prix_presentation) ; écart total 4 à 8 %. « Prix plafond » = garde-fou interne : le loyer au-delà duquel le bien resterait vacant.
  4. RENDEMENT → valeur_venale_indicative = valeur de VENTE indicative du bien, fondée sur les ventes réelles DVF fournies (actualisées au marché actuel) ; rendement_brut = (prix_estime × 12) ÷ valeur_venale_indicative × 100, arrondi au dixième.
- CADRE LÉGAL : si le DPE est F ou G, rappelle les contraintes (gel des loyers, interdiction progressive de louer les passoires) dans les points de vigilance et tiens-en compte dans le loyer. Si la commune est en zone d'encadrement des loyers connue, signale-le.
- references_dvf : tableau VIDE [] (pas de tableau de ventes dans un dossier locatif). analyse_dvf = 2 à 3 phrases simples sur le marché locatif local (niveau officiel des loyers, demande).
- scenarios_prix : exactement 3, prix croissants, en €/mois — « Vente rapide » (location immédiate, léger sous-marché), « Prix optimal » (loyer conseillé), « Prix plafond » (à ne pas dépasser : vacance locative).
- delai_vente_estime = délai estimé de mise en location.
- description_bien, points forts/faibles, etapes_commercialisation (plan de mise en location : annonce, photos, visites, dossier locataire) et argumentaire_vendeur (points clés pour le propriétaire, dont le rendement) : adressés directement au client.
- indice_confiance : reflète la fiabilité de l'indicateur (nombre d'annonces observées) et la cohérence des données.
- Réponds intégralement en français.

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
  content.push({
    type: "text",
    text: `${buildPropertyText(input)}

# VENTES RÉELLES DVF (commune entière du code postal ${input.codePostal}, triées par proximité avec le bien)
${dvfBlock(dvfSales)}
${
  mission === "locatif"
    ? `
# INDICATEUR OFFICIEL DE LOYER (« carte des loyers », Ministère du Logement)
${
        loyer
          ? `- Commune : ${loyer.commune} | Typologie : ${loyer.typologie} | Millésime ${loyer.millesime}
- Loyer d'annonce prédit : ${loyer.loyerM2} €/m²/mois (intervalle ${loyer.loyerM2Bas} – ${loyer.loyerM2Haut} €/m²) — ${loyer.nbAnnonces} annonces observées sur la commune`
          : "(indicateur indisponible pour cette commune — estime prudemment le niveau local et baisse l'indice de confiance)"
      }
`
    : ""
}
# TA MISSION
${
  mission === "locatif"
    ? "Produis l'estimation locative complète : analyse chaque photo, fixe le loyer de base depuis l'indicateur officiel, les ajustements en €/mois, la fourchette de loyer, les 3 scénarios, la valeur vénale indicative (ventes DVF actualisées) et le rendement brut."
    : mission === "audit"
      ? "Produis l'audit de commercialisation complet : estimation de la valeur réelle (ventes DVF actualisées), diagnostic chiffré des raisons de la non-vente, prix de relance conseillé et plan de relance concret."
      : "Produis l'avis de valeur final, fondé uniquement sur ces ventes réelles : analyse chaque photo, sélectionne les références les plus proches, fixe la base médiane, les ajustements (dont l'actualisation au marché actuel), la fourchette (4-6 % d'écart justifié) et les 3 scénarios de prix."
}

# SCHÉMA JSON DE LA RÉPONSE (respecte-le exactement)
${JSON.stringify(schemaFor(mission))}`,
  });

  // L'audit d'une annonce en ligne réactive les outils web (uniquement
  // pour ce mode) : ouverture de l'annonce + recherche de son historique
  const useWebTools = mission === "audit" && Boolean(input.urlAnnonce);
  onProgress(
    useWebTools
      ? "Ouverture et analyse de l'annonce en ligne (historique, texte, photos)…"
      : input.photos.length > 0
        ? `Analyse des ${Math.min(input.photos.length, 20)} photos et rédaction de l'avis de valeur…`
        : "Rédaction de l'avis de valeur…",
  );

  let messages: Anthropic.MessageParam[] = [{ role: "user", content }];
  let message: Anthropic.Message;
  const MAX_CONTINUATIONS = 3;
  let continuations = 0;
  for (;;) {
    const stream = client.messages.stream({
      model,
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      system,
      ...(useWebTools
        ? {
            tools: [
              { type: "web_fetch_20260209" as const, name: "web_fetch" as const, max_uses: 3 },
              { type: "web_search_20260209" as const, name: "web_search" as const, max_uses: 4 },
            ],
          }
        : {}),
      output_config: { effort },
      messages,
    });
    message = await stream.finalMessage();
    if (message.stop_reason === "pause_turn" && continuations < MAX_CONTINUATIONS) {
      continuations += 1;
      onProgress("Audit de l'annonce : croisement des sources et rédaction…");
      messages = [...messages, { role: "assistant", content: message.content }];
      continue;
    }
    break;
  }
  if (message.stop_reason === "refusal") throw new Error("Requête refusée par les garde-fous du modèle");

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  const r = parseJsonLoose(text);

  // Références DVF : sélection du rédacteur, sinon la sélection déterministe
  // — jamais de tableau vide tant que des ventes DVF existent. En mission
  // locative, pas de tableau de ventes et la base = indicateur de loyer.
  const deterministic = mission === "locatif" ? null : buildDvfReferences(dvfSales, input);
  const referencesDvf =
    mission === "locatif"
      ? []
      : arr<ReferenceDvf>(r.references_dvf).length > 0
        ? arr<ReferenceDvf>(r.references_dvf)
        : (deterministic?.references ?? []);
  const loyerBase = loyer
    ? Math.round((loyer.loyerM2 * surfaceHabitableTotale(input)) / 10) * 10
    : 0;
  const baseMediane =
    mission === "locatif"
      ? num(r.base_mediane) || loyerBase
      : num(r.base_mediane) || (deterministic?.baseMediane ?? 0);

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
  if (report.prix_estime <= 0 || report.fourchette_basse <= 0) {
    throw new Error("Réponse IA incomplète (prix manquants)");
  }
  return report;
}
