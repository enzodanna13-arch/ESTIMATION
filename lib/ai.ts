import Anthropic from "@anthropic-ai/sdk";
import { buildDvfReferences } from "./references";
import type {
  AuditConcurrentiel,
  CompetitorAd,
  DvfSale,
  EstimationReport,
  MarketStudy,
  PropertyInput,
  ReferenceDvf,
} from "./types";

// L'analyse est découpée en 2 phases pour tenir dans le budget d'exécution
// serverless (~5 min par requête) : 1) audit du marché (recherche web),
// 2) analyse des photos + rédaction du dossier (sans outils, donc rapide).

const MARKET_SCHEMA = {
  type: "object",
  properties: {
    analyse_dvf: { type: "string", description: "3 phrases simples maximum : ce que les ventes réelles montrent pour ce bien (fourchette €/m², références les plus proches)" },
    analyse_concurrence: { type: "string", description: "2 à 3 phrases simples : prix affichés des biens comparables en vente (cite les chiffres et sources)" },
    analyse_invendus: { type: "string", description: "2 à 3 phrases simples : les annonces qui ne se vendent pas et le prix que le marché refuse" },
    annonces_concurrentes: {
      type: "array",
      description: "Les 6 à 8 annonces concurrentes les plus pertinentes",
      items: {
        type: "object",
        properties: {
          titre: { type: "string", description: "Titre court (8 mots maximum)" },
          url_annonce: { type: "string", description: "URL réelle de l'annonce, sinon chaîne vide — ne JAMAIS inventer" },
          url_photo: { type: "string", description: "URL de la photo principale (og:image via web_fetch), sinon chaîne vide — ne JAMAIS inventer" },
          prix: { type: "number", description: "PRIX AFFICHÉ en euros — OBLIGATOIRE et > 0 : si le prix est introuvable, ÉCARTE l'annonce" },
          surface: { type: "number", description: "0 si inconnue" },
          prix_m2: { type: "number", description: "0 si non calculable" },
          caracteristiques: { type: "string" },
          anciennete: { type: "string", description: "Fraîcheur de l'annonce si détectable" },
          source: { type: "string", description: "Portail ou agence" },
          comparaison: { type: "string", description: "1 phrase courte (12 mots maximum) vs le bien estimé" },
          positionnement: { type: "string", enum: ["supérieur", "équivalent", "inférieur"] },
          invendu: { type: "boolean", description: "true si l'annonce est un INVENDU : en ligne depuis plus de 90 jours, re-publiée ou baissée plusieurs fois" },
        },
        required: ["titre", "url_annonce", "url_photo", "prix", "surface", "prix_m2", "caracteristiques", "anciennete", "source", "comparaison", "positionnement", "invendu"],
      },
    },
    audit_concurrentiel: {
      type: "object",
      properties: {
        nb_annonces_analysees: { type: "number" },
        prix_m2_min: { type: "number", description: "Sur les annonces VIVES uniquement (invendus +90j exclus)" },
        prix_m2_median: { type: "number", description: "Médiane des biens équivalents VIFS uniquement (invendus +90j exclus) — repère central de positionnement" },
        prix_m2_max: { type: "number", description: "Sur les annonces VIVES uniquement (invendus +90j exclus)" },
        tension_marche: { type: "string", description: "1 à 2 phrases simples" },
        synthese: { type: "string", description: "2 à 3 phrases simples : la zone de prix gagnante et pourquoi" },
      },
      required: ["nb_annonces_analysees", "prix_m2_min", "prix_m2_median", "prix_m2_max", "tension_marche", "synthese"],
    },
    references_dvf: {
      type: "array",
      description: "4 à 6 références DVF choisies dans la liste fournie — ne JAMAIS inventer une transaction",
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
  },
  required: ["analyse_dvf", "analyse_concurrence", "analyse_invendus", "annonces_concurrentes", "audit_concurrentiel", "references_dvf", "base_mediane"],
} as const;

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
    fourchette_basse: { type: "number" },
    fourchette_haute: { type: "number" },
    prix_m2: { type: "number" },
    prix_presentation: { type: "number", description: "Prix affiché conseillé (= scénario Prix optimal)" },
    description_bien: { type: "string", description: "2 paragraphes professionnels et valorisants, adressés au client (« votre maison », « votre appartement »)" },
    indice_confiance: { type: "number", description: "0 à 100" },
    delai_vente_estime: { type: "string" },
    positionnement_marche: { type: "string", description: "3 à 4 phrases SIMPLES : la base (médiane DVF), le repère concurrentiel, et pourquoi les deux bornes de la fourchette — compréhensible par le vendeur à la première lecture" },
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
      description: "Exactement 3 : Vente rapide, Prix optimal, Prix plafond",
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

const JSON_RULE = `FORMAT DE SORTIE (impératif) : réponds EXCLUSIVEMENT par un objet JSON valide — aucun texte avant ou après, aucune balise markdown — conforme exactement au schéma JSON fourni dans le message utilisateur.`;

const CONJONCTURE_RULE = `CONJONCTURE (mesurée, sans excès) : le marché est baissier (taux d'intérêt, pouvoir d'achat), mais la conjoncture ne doit PAS écraser la valeur — les biens de qualité se vendent toujours à leur juste prix. Règles :
- correction conjoncturelle MODÉRÉE sur la base médiane : -1 à -3 % MAXIMUM, et uniquement si les baromètres locaux confirment la baisse. Si la tendance locale est stable, pas de décote conjoncturelle.
- INTERDICTION DE DOUBLE COMPTAGE : la conjoncture ne se décompte qu'UNE fois. Ne cumule pas décote conjoncturelle + pondération renforcée des prix affichés + positionnement bas de fourchette pour le même motif.
- les prix affichés par la concurrence sont des prix d'espérance : marge de négociation de 3 à 5 %, pas plus.
- la fourchette se cale sur la ZONE GAGNANTE elle-même (pas sur son bas) : le repère central est la médiane concurrentielle des biens équivalents VIFS.
- sois réaliste sur les délais de vente sans les exagérer.`;

const STYLE_RULE = `STYLE DES TEXTES (le dossier est remis directement AU CLIENT vendeur) : ADRESSE-TOI À LUI : « votre maison », « votre appartement », « vous », « nous vous conseillons » — jamais « le vendeur », « le bien à estimer » ni la troisième personne. Écris SIMPLE et clair : phrases courtes (une idée par phrase), vocabulaire courant, pas de jargon (« ancre de valeur », « transposable », « décote conjoncturelle », « médiane des actés »…) — dis plutôt « les ventes réelles », « les biens comparables au vôtre se sont vendus entre X et Y », « le marché refuse au-delà de Z ». Chaque texte d'analyse : 2 à 4 phrases maximum, compréhensibles à la première lecture.`;

const PROXIMITE_RULE = `PROXIMITÉ (impératif) : chaque vente DVF de la liste indique son adresse et sa distance au bien. APPARTEMENT → priorité absolue aux ventes à la MÊME ADRESSE (même copropriété : comparables parfaits), puis même rue, puis rayon proche. MAISON → priorité aux environs immédiats (même rue, rayon ~1 km), puis quartier. N'utilise les ventes éloignées que faute de mieux, et signale-le. La médiane des références doit refléter le micro-marché du bien, pas la commune entière.`;

const MARKET_SYSTEM = `Tu es un analyste pricing immobilier. Tu conduis un AUDIT CONCURRENTIEL complet du marché local pour préparer un avis de valeur.

PROTOCOLE (obligatoire, exhaustif) :
1. RECENSEMENT — balaie le marché actif sous plusieurs angles avec web_search (ville + quartier, type + surface, baromètres multiples, annonces récentes vs anciennes) : vise 6 à 10 annonces comparables examinées — sois EFFICACE : requêtes larges et bien choisies plutôt que nombreuses. PRIORITÉ ABSOLUE aux biens ÉQUIVALENTS actuellement en vente (même type, surface ±20 %, même secteur, prestations proches) : ce sont eux qui calibrent le positionnement. Restitue les 6 à 8 plus pertinents, chacun classé supérieur / équivalent / inférieur vs le bien.
2. VÉRIFICATION — pour chaque annonce retenue, essaie d'ouvrir la page avec web_fetch pour vérifier prix/surface et récupérer l'URL de la photo principale (og:image) et de l'annonce. URL vide si introuvable — n'invente JAMAIS une URL, un prix ou une annonce. LE PRIX AFFICHÉ EST OBLIGATOIRE : une annonce dont tu n'as pas pu établir le prix (via les résultats de recherche ou la page) ne doit PAS figurer dans annonces_concurrentes — remplace-la par une annonce dont le prix est connu.
3. INVENDUS — c'est TOI qui les identifies, JAMAIS le commercial : un INVENDU = une annonce en ligne depuis plus de 90 jours, re-publiée ou baissée plusieurs fois. Recherche-les activement (annonces anciennes des portails, mentions « baisse de prix », historique) et marque invendu=true sur ces annonces. analyse_invendus décrit TES constats chiffrés (prix, ancienneté, seuil de blocage) — n'écris JAMAIS qu'aucun invendu n'a été saisi ou renseigné : si tu n'en détectes aucun, dis que le marché ne présente pas de stock ancien détectable et ce que cela implique.
4. CARTOGRAPHIE — min / médiane / max des €/m² calculés sur les annonces VIVES uniquement : les invendus (+90 jours) sont EXCLUS des statistiques — ils ne servent qu'à matérialiser le plafond que le marché refuse. prix_m2_median = médiane des biens équivalents VIFS.
5. ZONE GAGNANTE — détermine la zone de prix où le bien est objectivement le meilleur choix de sa catégorie et explique pourquoi dans audit_concurrentiel.synthese. La médiane concurrentielle des biens équivalents VIFS (prix_m2_median) est le repère central : recommande une zone JUSTE SOUS cette médiane (0 à 3 % en dessous) — pas 5-10 % en dessous, ce serait brader le bien.
6. DVF — la liste fournie couvre la COMMUNE ENTIÈRE du code postal, triée par PROXIMITÉ avec le bien (adresse et distance indiquées) : sélectionne les 4 à 6 ventes réelles les plus comparables en appliquant la règle de PROXIMITÉ ci-dessous ET des surfaces proches du bien (±25 %) (élargis si nécessaire — dès que la liste n'est pas vide, references_dvf ne doit JAMAIS être vide). base_mediane = la médiane des PRIX ACTÉS de ces références, telle quelle — ne la transpose NI au m² NI à la surface du bien : c'est l'ANCRE de valeur du dossier.

7. CONJONCTURE — vérifie via web_search la tendance de prix récente du secteur (baromètres) et intègre-la à la cartographie et à la zone gagnante.

${PROXIMITE_RULE}

${CONJONCTURE_RULE}

${STYLE_RULE}

Cite les prix au m² et leurs sources (portail/baromètre, sans URL) dans les analyses. Réponds intégralement en français.

${JSON_RULE}`;

const FINAL_SYSTEM = `Tu es un expert en estimation immobilière d'une agence haut de gamme. Tu disposes d'une ÉTUDE DE MARCHÉ complète (audit concurrentiel + ventes réelles DVF) fournie dans le message. Tu produis l'avis de valeur final.

RÈGLES :
- Analyse CHAQUE photo fournie (numérotées dans l'ordre : 1 = première) : pièce/vue identifiée, bons points, défauts visibles concrets — ces fiches figurent dans le dossier remis au vendeur. Note l'état par catégorie (etat_notes, 1 à 5) et chiffre impact_etat en euros signés. Signale tout écart avec l'état déclaré. Sans photo : analyse_par_photo et etat_notes vides, impact_etat 0.
- FOURCHETTE D'ABORD : le résultat principal est fourchette_basse → fourchette_haute, resserrée au maximum justifiable (5 à 8 % d'écart quand les données concordent). prix_estime est le cœur de fourchette. Justifie les deux bornes dans positionnement_marche.
- L'estimation reste SOUS le plafond révélé par les invendus de l'étude de marché, à prestations comparables — mais les invendus sont EXCLUS du calcul et des médianes : seuls les biens équivalents VIFS calibrent le positionnement. Les prix affichés de la concurrence se pondèrent d'une marge de négociation modérée (3 à 5 %).
- MÉTHODE D'ESTIMATION (chemin imposé, dans cet ordre) :
  1. ANALYSE DVF → base_mediane = médiane des prix actés des références comparables : c'est la BASE DE CALCUL.
  2. ANALYSE CONCURRENTIELLE → médiane concurrentielle = niveau de prix des biens équivalents VIFS actuellement affichés (invendus +90 jours exclus) : elle sert au POSITIONNEMENT, jamais de base de calcul.
  3. CALCUL → fourchette de commercialisation = base_mediane + plus-values (spécificités du bien) − décotes (conjoncture, défauts).
  4. AFFINAGE CONCURRENTIEL → le prix de présentation (prix_presentation, scénario « Prix optimal ») se cale JUSTE SOUS la médiane concurrentielle des biens équivalents vifs : 0 à 3 % en dessous, PAS davantage. CONTRÔLE DE COHÉRENCE obligatoire : si le calcul de l'étape 3 ressort à plus de 5 % SOUS la médiane concurrentielle à prestations équivalentes, tes décotes sont excessives — réduis-les et recalcule ; s'il ressort au-dessus, resserre vers la médiane et justifie.
- references_dvf : sélectionne 4 à 6 ventes réelles dans la liste DVF fournie (reprends celles de l'étude de marché si elle en contient), en appliquant la règle de PROXIMITÉ ci-dessous et des surfaces proches du bien (±25 %) — dès que la liste DVF n'est pas vide, references_dvf ne doit JAMAIS être vide. Reporte l'adresse et la distance dans localisation/detail. base_mediane = la médiane des PRIX ACTÉS de ces références, telle quelle (le chiffre affiché sous le tableau des comparables du dossier) — ne la transpose NI au m² NI à la surface du bien. Rédige analyse_dvf.
- ajustements : pars de base_mediane (l'ancre) et liste les PLUS-VALUES (montants positifs : atouts réels du bien — extérieur, DPE, état issu des photos, stationnement, annexes…) et les DÉCOTES (montants négatifs : défauts réels — nuisances, travaux, conjoncture…) dont la somme aboutit exactement à prix_estime. Chaque ligne est une caractéristique concrète du bien ou du marché, JAMAIS une correction technique abstraite. Si la surface du bien diffère sensiblement de celle des références, exprime-le comme une seule ligne « Surface supérieure/inférieure aux références (X m² vs Y m² médians) » — c'est une caractéristique du bien comme une autre. La décote « Conjoncture — marché baissier (taux, pouvoir d'achat) » est limitée à -1 à -3 % de base_mediane (0 si tendance locale stable). GARDE-FOU : hors ligne de surface, la somme des décotes ne doit pas excéder ~10 % de base_mediane, sauf défaut majeur objectif (travaux lourds, nuisance grave) explicitement justifié — chaque facteur ne se décompte qu'UNE fois.
- scenarios_prix : exactement 3 scénarios chiffrés — « Vente rapide » (sous la zone gagnante, délai court), « Prix optimal » (= prix_presentation, SOUS la médiane concurrentielle des biens équivalents, meilleur ratio prix/délai), « Prix plafond » (à ne pas dépasser sous peine de rejoindre les invendus).
- argumentaire_vendeur : 3 à 5 points clés chiffrés ADRESSÉS DIRECTEMENT AU CLIENT (« votre bien », « vous »), DIGESTES : un point par ligne (séparés par \\n), chacun au format « Titre court — explication en 1 à 2 phrases maximum ». Si le prix souhaité par le client est renseigné, l'un des points le positionne avec pédagogie (« à ce prix, votre bien rejoindrait les annonces qui ne se vendent pas »).
- description_bien : 2 paragraphes factuels et valorisants, style avis de valeur d'agence.
- indice_confiance : reflète la quantité et la cohérence des données (DVF, annonces, photos).
- Réponds intégralement en français.

${PROXIMITE_RULE}

${CONJONCTURE_RULE}

${STYLE_RULE}

${JSON_RULE}`;

function fmtComparables(list: PropertyInput["concurrence"]): string {
  if (list.length === 0) return "(rien de saisi — sans incidence : ton audit web fait foi, ne mentionne jamais cette absence dans le dossier)";
  return list
    .map((c) => {
      const pm2 = c.prix && c.surface ? ` soit ${Math.round(c.prix / c.surface)} €/m²` : "";
      const jours = c.joursEnLigne != null ? ` — en ligne depuis ${c.joursEnLigne} jours` : "";
      return `- ${c.description || "bien"} : ${c.surface ?? "?"} m², ${c.prix ?? "?"} €${pm2}${jours}`;
    })
    .join("\n");
}

function buildPropertyText(input: PropertyInput): string {
  return `# BIEN À ESTIMER

## Vendeur & contexte commercial
- Vendeur : ${[input.clientCivilite, input.clientPrenom, input.clientNom].filter(Boolean).join(" ") || "n.c."}
- Horizon de vente : ${input.horizonVente || "n.c."}
- Négociateur en charge : ${input.negociateur || "n.c."}

## Localisation
Adresse : ${input.adresse}, ${input.codePostal} ${input.ville}${input.quartier ? ` — quartier : ${input.quartier}` : ""}

## Caractéristiques
- Type : ${input.typeBien}
- Surface habitable : ${input.surfaceHabitable ?? "?"} m²${input.surfaceTerrain ? ` | Terrain : ${input.surfaceTerrain} m²` : ""}
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
- Charges copro : ${input.chargesCopro ?? "n.c."} €/mois | Taxe foncière : ${input.taxeFonciere ?? "n.c."} €/an

## Contexte de vente
- Prix souhaité par le vendeur : ${input.prixSouhaiteVendeur ? `${input.prixSouhaiteVendeur} €` : "non communiqué"}
- Contexte : ${input.contexteVente || "n.c."}
${input.commentaires ? `- Commentaires du négociateur : ${input.commentaires}` : ""}`;
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
            `- ${s.date} | ${s.typeLocal} | ${s.surface ?? "?"} m² | ${s.valeurFonciere} € | ${s.prixM2 ?? "?"} €/m² | ${s.adresse ? `${s.adresse}, ` : ""}${s.commune}${dist(s)}`,
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

function normalizeMarket(r: Record<string, unknown>): MarketStudy {
  const audit = (r.audit_concurrentiel ?? {}) as Record<string, unknown>;
  return {
    analyse_dvf: str(r.analyse_dvf),
    analyse_concurrence: str(r.analyse_concurrence),
    analyse_invendus: str(r.analyse_invendus),
    annonces_concurrentes: arr<CompetitorAd>(r.annonces_concurrentes).map((a) => ({
      titre: str(a?.titre),
      url_annonce: str(a?.url_annonce),
      url_photo: str(a?.url_photo),
      prix: num(a?.prix),
      surface: num(a?.surface),
      prix_m2: num(a?.prix_m2),
      caracteristiques: str(a?.caracteristiques),
      anciennete: str(a?.anciennete),
      source: str(a?.source),
      comparaison: str(a?.comparaison),
      positionnement: str(a?.positionnement),
      invendu: a?.invendu === true,
    })),
    audit_concurrentiel: {
      nb_annonces_analysees: num(audit.nb_annonces_analysees),
      prix_m2_min: num(audit.prix_m2_min),
      prix_m2_median: num(audit.prix_m2_median),
      prix_m2_max: num(audit.prix_m2_max),
      tension_marche: str(audit.tension_marche),
      synthese: str(audit.synthese),
    } as AuditConcurrentiel,
    references_dvf: arr(r.references_dvf),
    base_mediane: num(r.base_mediane),
  };
}

/** Phase 1 — audit du marché (recherche web + DVF), sans photos. */
export async function computeMarketStudy(
  input: PropertyInput,
  dvfSales: DvfSale[],
  onProgress: (label: string) => void = () => {},
): Promise<MarketStudy> {
  const client = new Anthropic();
  const { model, effort } = modelConfig();

  const text = `${buildPropertyText(input)}

# DONNÉES DE MARCHÉ

## Transactions DVF (ventes réelles actées — COMMUNE ENTIÈRE du code postal ${input.codePostal})
${dvfBlock(dvfSales)}

## Concurrence déjà repérée par le négociateur (complément FACULTATIF — ta recherche web reste obligatoire)
${fmtComparables(input.concurrence)}

## Invendus déjà repérés par le négociateur (complément FACULTATIF — c'est TOI qui identifies les invendus du marché : annonces +90 jours, re-publiées ou baissées)
${fmtComparables(input.invendus)}

# SCHÉMA JSON DE LA RÉPONSE (respecte-le exactement)
${JSON.stringify(MARKET_SCHEMA)}`;

  let messages: Anthropic.MessageParam[] = [{ role: "user", content: text }];
  let message: Anthropic.Message;
  const MAX_CONTINUATIONS = 4;
  // Budget temps : la fonction serverless est tuée à 300 s — au-delà de ce
  // seuil on force la conclusion (sans outils) plutôt que de tout perdre.
  const DEADLINE_MS = 195_000;
  const t0 = Date.now();
  let continuations = 0;
  let wrapUp = false;
  onProgress("Audit du marché : recherche des annonces concurrentes sur le web…");
  for (;;) {
    const stream = client.messages.stream({
      model,
      max_tokens: 12000,
      thinking: { type: "adaptive" },
      system: MARKET_SYSTEM,
      ...(wrapUp
        ? {}
        : {
            tools: [
              { type: "web_search_20260209" as const, name: "web_search" as const, max_uses: 6 },
              { type: "web_fetch_20260209" as const, name: "web_fetch" as const, max_uses: 4 },
            ],
          }),
      output_config: { effort },
      messages,
    });
    message = await stream.finalMessage();
    if (message.stop_reason === "pause_turn" && continuations < MAX_CONTINUATIONS) {
      continuations += 1;
      messages = [...messages, { role: "assistant", content: message.content }];
      if (Date.now() - t0 > DEADLINE_MS && !wrapUp) {
        // Trop long : dernière passe sans outils, conclusion immédiate
        wrapUp = true;
        onProgress("Audit du marché : synthèse des données collectées…");
        messages = [
          ...messages,
          { role: "user", content: "Temps écoulé : arrête les recherches et réponds MAINTENANT, uniquement l'objet JSON final conforme au schéma, à partir des éléments déjà collectés." },
        ];
      } else {
        onProgress(`Audit du marché : croisement des sources (passe ${continuations + 1})…`);
      }
      continue;
    }
    break;
  }
  if (message.stop_reason === "refusal") throw new Error("Requête refusée par les garde-fous du modèle");

  const finalText = (msg: Anthropic.Message) =>
    msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

  try {
    return normalizeMarket(parseJsonLoose(finalText(message)));
  } catch {
    // La réponse ne contient pas le JSON attendu : une relance de
    // récupération (sans outils, donc rapide) plutôt que de perdre l'audit.
    onProgress("Audit du marché : mise en forme des résultats…");
    const retry = await client.messages
      .stream({
        model,
        max_tokens: 12000,
        thinking: { type: "adaptive" },
        system: MARKET_SYSTEM,
        output_config: { effort: "low" },
        messages: [
          ...messages,
          { role: "assistant", content: message.content },
          { role: "user", content: "Ta réponse précédente n'était pas un JSON exploitable. Réponds MAINTENANT uniquement l'objet JSON final conforme au schéma, à partir des éléments déjà collectés." },
        ],
      })
      .finalMessage();
    return normalizeMarket(parseJsonLoose(finalText(retry)));
  }
}

/** Phase 2 — analyse des photos + rédaction du dossier final (sans outils). */
export async function computeFinalReport(
  input: PropertyInput,
  dvfSales: DvfSale[],
  marche: MarketStudy | null,
  onProgress: (label: string) => void = () => {},
): Promise<EstimationReport> {
  const client = new Anthropic();
  const { model, effort } = modelConfig();

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

# ÉTUDE DE MARCHÉ (réalisée en phase 1 — appuie-toi dessus)
${marche ? JSON.stringify(marche) : "(étude de marché indisponible — appuie-toi sur les données DVF ci-dessous et baisse l'indice de confiance)"}

# TRANSACTIONS DVF (commune entière du code postal ${input.codePostal})
${dvfBlock(dvfSales)}

# TA MISSION
Produis l'avis de valeur final : analyse chaque photo, fixe la fourchette (5-8 % d'écart justifié), les 3 scénarios de prix, les ajustements depuis la base médiane (${marche?.base_mediane || "à estimer"} €), et l'argumentaire vendeur.

# SCHÉMA JSON DE LA RÉPONSE (respecte-le exactement)
${JSON.stringify(FINAL_SCHEMA)}`,
  });

  onProgress(
    input.photos.length > 0
      ? `Analyse des ${Math.min(input.photos.length, 20)} photos et rédaction de l'avis de valeur…`
      : "Rédaction de l'avis de valeur…",
  );

  const stream = client.messages.stream({
    model,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: FINAL_SYSTEM,
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

  const emptyMarket: MarketStudy = {
    analyse_dvf: "",
    analyse_concurrence: "",
    analyse_invendus: "",
    annonces_concurrentes: [],
    audit_concurrentiel: {
      nb_annonces_analysees: 0, prix_m2_min: 0, prix_m2_median: 0, prix_m2_max: 0,
      tension_marche: "", synthese: "",
    },
    references_dvf: [],
    base_mediane: 0,
  };
  const m = marche ?? emptyMarket;

  // Références DVF : priorité à l'étude de marché, sinon la sélection du
  // rédacteur final, sinon la sélection déterministe — jamais de tableau
  // vide tant que des ventes DVF existent.
  const deterministic = buildDvfReferences(dvfSales, input);
  const referencesDvf =
    m.references_dvf.length > 0
      ? m.references_dvf
      : arr<ReferenceDvf>(r.references_dvf).length > 0
        ? arr<ReferenceDvf>(r.references_dvf)
        : deterministic.references;
  const baseMediane = m.base_mediane || num(r.base_mediane) || deterministic.baseMediane;

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
    analyse_dvf: m.analyse_dvf || str(r.analyse_dvf),
    analyse_concurrence: m.analyse_concurrence,
    analyse_invendus: m.analyse_invendus,
    analyse_photos: str(r.analyse_photos),
    analyse_par_photo: arr(r.analyse_par_photo),
    etat_notes: arr(r.etat_notes),
    coefficient_etat: str(r.coefficient_etat),
    impact_etat: num(r.impact_etat),
    annonces_concurrentes: m.annonces_concurrentes,
    audit_concurrentiel: m.audit_concurrentiel,
    scenarios_prix: arr(r.scenarios_prix),
    references_dvf: referencesDvf,
    base_mediane: baseMediane,
    ajustements: arr(r.ajustements),
    etapes_commercialisation: arr(r.etapes_commercialisation),
    points_forts: arr(r.points_forts),
    points_faibles: arr(r.points_faibles),
    strategie_commercialisation: str(r.strategie_commercialisation),
    argumentaire_vendeur: str(r.argumentaire_vendeur),
  };
  if (report.prix_estime <= 0 || report.fourchette_basse <= 0) {
    throw new Error("Réponse IA incomplète (prix manquants)");
  }
  return report;
}
