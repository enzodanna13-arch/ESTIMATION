import Anthropic from "@anthropic-ai/sdk";
import { buildDvfReferences } from "./references";
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
    fourchette_basse: { type: "number" },
    fourchette_haute: { type: "number" },
    prix_m2: { type: "number" },
    prix_presentation: { type: "number", description: "Prix affiché conseillé (= scénario Prix optimal)" },
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

const CONJONCTURE_RULE = `MARCHÉ BAISSIER (règle PRIORITAIRE) : le marché immobilier est actuellement en baisse — taux d'intérêt élevés, budget des acquéreurs en recul. Une vente conclue il y a un ou deux ans l'a donc été à un prix PLUS ÉLEVÉ que ce que le même bien vaudrait aujourd'hui. Conséquences obligatoires :
- ACTUALISE les références selon leur ancienneté (l'âge de chaque vente est indiqué dans la liste) : barème de -3 % PAR ANNÉE écoulée depuis la vente (au prorata des mois : une vente d'il y a 18 mois se déprécie d'environ -4,5 %), à moduler légèrement selon la dynamique visible dans les données.
- traduis cette actualisation par une ligne de décote OBLIGATOIRE dans les ajustements : « Actualisation au marché actuel (ventes datées, marché en baisse) », chiffrée selon l'ancienneté moyenne des références retenues. Si toutes les références ont moins de 6 mois, la ligne peut être faible — mais elle figure et tu l'expliques.
- INTERDICTION DE DOUBLE COMPTAGE : l'effet du marché baissier ne se décompte qu'une seule fois (cette ligne d'actualisation, rien d'autre).
- sois réaliste sur les délais de vente : ils s'allongent en marché baissier.`;

const STYLE_RULE = `STYLE DES TEXTES (le dossier est remis directement AU CLIENT vendeur) : ADRESSE-TOI À LUI : « votre maison », « votre appartement », « vous », « nous vous conseillons » — jamais « le vendeur », « le bien à estimer » ni la troisième personne. Écris SIMPLE et clair : phrases courtes (une idée par phrase), vocabulaire courant, pas de jargon (« ancre de valeur », « transposable », « décote conjoncturelle », « médiane des actés »…) — dis plutôt « les ventes réelles », « les biens comparables au vôtre se sont vendus entre X et Y », « le marché refuse au-delà de Z ». Chaque texte d'analyse : 2 à 4 phrases maximum, compréhensibles à la première lecture.`;

const PROXIMITE_RULE = `PROXIMITÉ (impératif) : chaque vente DVF de la liste indique son adresse et sa distance au bien. APPARTEMENT → priorité absolue aux ventes à la MÊME ADRESSE (même copropriété : comparables parfaits), puis même rue, puis rayon proche. MAISON → priorité aux environs immédiats (même rue, rayon ~1 km), puis quartier. N'utilise les ventes éloignées que faute de mieux, et signale-le. La médiane des références doit refléter le micro-marché du bien, pas la commune entière.`;

const FINAL_SYSTEM = `Tu es un expert en estimation immobilière d'une agence haut de gamme. Tu disposes des VENTES RÉELLES DVF autour du bien (triées par proximité, avec adresse, distance et âge de chaque vente). Tu produis l'avis de valeur final, fondé EXCLUSIVEMENT sur ces ventes réelles et les caractéristiques du bien — AUCUNE annonce en ligne n'entre dans l'analyse ni dans le dossier.

RÈGLES :
- Analyse CHAQUE photo fournie (numérotées dans l'ordre : 1 = première) : pièce/vue identifiée, bons points, défauts visibles concrets — ces fiches figurent dans le dossier remis au client. Note l'état par catégorie (etat_notes, 1 à 5) et chiffre impact_etat en euros signés. Signale tout écart avec l'état déclaré. Sans photo : analyse_par_photo et etat_notes vides, impact_etat 0.
- MÉTHODE D'ESTIMATION (chemin imposé, dans cet ordre) :
  1. RÉFÉRENCES → sélectionne 4 à 6 ventes réelles dans la liste DVF fournie, en appliquant la règle de PROXIMITÉ ci-dessous et des surfaces proches du bien (±25 %) — dès que la liste n'est pas vide, references_dvf ne doit JAMAIS être vide. Reporte l'adresse et la distance dans localisation/detail. Rédige analyse_dvf.
  2. BASE → base_mediane = la médiane des PRIX ACTÉS de ces références, telle quelle (le chiffre affiché sous le tableau des comparables du dossier) — ne la transpose NI au m² NI à la surface du bien.
  3. AJUSTEMENTS → liste les PLUS-VALUES (montants positifs : atouts réels — extérieur, DPE, état issu des photos, stationnement, annexes…) et les DÉCOTES (montants négatifs : défauts réels — nuisances, travaux…) dont la somme, depuis base_mediane, aboutit exactement à prix_estime. Chaque ligne est une caractéristique concrète, JAMAIS une correction technique abstraite. Si la surface du bien diffère sensiblement des références : une seule ligne « Surface supérieure/inférieure aux références (X m² vs Y m² médians) ». Ligne OBLIGATOIRE d'actualisation au marché actuel (voir règle prioritaire ci-dessous). GARDE-FOU : hors lignes de surface et d'actualisation, la somme des décotes ne doit pas excéder ~10 % de base_mediane, sauf défaut majeur objectif explicitement justifié — chaque facteur ne se décompte qu'UNE fois.
  4. FOURCHETTE → fourchette_basse → fourchette_haute resserrée (5 à 8 % d'écart quand les données concordent), prix_estime au cœur. La borne haute ne dépasse la meilleure vente comparable ACTUALISÉE que si des atouts objectifs le justifient. Justifie les deux bornes dans positionnement_marche (ventes de référence, actualisation, atouts/défauts).
- scenarios_prix : exactement 3 scénarios chiffrés — « Vente rapide » (sous la fourchette, délai court), « Prix optimal » (= prix_presentation, dans la fourchette, meilleur équilibre prix/délai), « Prix plafond » (borne à ne pas dépasser : au-delà, le bien resterait sans acheteur dans un marché en baisse).
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
${(input.dependances ?? []).length ? `- Dépendances : ${(input.dependances ?? []).map((d) => `${d.type}${d.surface ? ` (${d.surface} m²)` : ""}`).join(", ")} — valorise-les dans les plus-values` : ""}
- Charges copro : ${input.chargesCopro ?? "n.c."} €/mois | Taxe foncière : ${input.taxeFonciere ?? "n.c."} €/an

## Contexte de vente
- Prix souhaité par le vendeur : ${input.prixSouhaiteVendeur ? `${input.prixSouhaiteVendeur} €` : "non communiqué"}
- Contexte : ${input.contexteVente || "n.c."}
${input.commentaires ? `- Commentaires du négociateur : ${input.commentaires}` : ""}`;
}

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

# VENTES RÉELLES DVF (commune entière du code postal ${input.codePostal}, triées par proximité avec le bien)
${dvfBlock(dvfSales)}

# TA MISSION
Produis l'avis de valeur final, fondé uniquement sur ces ventes réelles : analyse chaque photo, sélectionne les références les plus proches, fixe la base médiane, les ajustements (dont l'actualisation au marché actuel), la fourchette (5-8 % d'écart justifié) et les 3 scénarios de prix.

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

  // Références DVF : sélection du rédacteur, sinon la sélection déterministe
  // — jamais de tableau vide tant que des ventes DVF existent.
  const deterministic = buildDvfReferences(dvfSales, input);
  const referencesDvf =
    arr<ReferenceDvf>(r.references_dvf).length > 0
      ? arr<ReferenceDvf>(r.references_dvf)
      : deterministic.references;
  const baseMediane = num(r.base_mediane) || deterministic.baseMediane;

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
  };
  if (report.prix_estime <= 0 || report.fourchette_basse <= 0) {
    throw new Error("Réponse IA incomplète (prix manquants)");
  }
  return report;
}
