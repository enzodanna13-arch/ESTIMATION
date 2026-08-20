import Anthropic from "@anthropic-ai/sdk";
import { buildDvfReferences } from "../references";
import { surfaceHabitableTotale } from "../surfaces";
import type { DvfSale, EstimationReport, PropertyInput, ReferenceDvf } from "../types";

// ============================================================================
// MOTEUR D'ESTIMATION CLIENT (IA Estimation Client) — dupliqué du moteur Pro
// puis ISOLÉ : il peut évoluer librement sans jamais toucher lib/ai.ts.
// Mission unique : la VENTE (le tunnel public ne propose ni audit, ni locatif,
// ni bien loué). Modèle par défaut : Claude Sonnet (volume public maîtrisé).
// Réutilise EN LECTURE SEULE les libs de données partagées (références DVF,
// surfaces). Aucune donnée n'est inventée : sans DVF, la fiabilité baisse.
// ============================================================================

const MOTEUR_VERSION = "client-1";

function modelConfig() {
  return {
    model: process.env.CLIENT_ESTIMATION_MODEL ?? "claude-sonnet-5",
    effort: (process.env.CLIENT_ESTIMATION_EFFORT ?? "medium") as
      | "low" | "medium" | "high" | "xhigh" | "max",
  };
}

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
const str = (v: unknown) => (typeof v === "string" ? v : "");
const arr = <T,>(v: unknown) => (Array.isArray(v) ? (v as T[]) : []);

function ageMois(dateIso: string): number {
  const t = new Date(dateIso).getTime();
  if (!Number.isFinite(t)) return 0;
  return Math.max(0, Math.round((Date.now() - t) / (30.44 * 24 * 3600 * 1000)));
}

function parseJsonLoose(text: string): Record<string, unknown> {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Réponse IA sans objet JSON");
  return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
}

// Schéma de sortie (vente uniquement) — copie autonome, libre de diverger.
const CLIENT_SCHEMA = {
  type: "object",
  properties: {
    analyse_dvf: { type: "string", description: "3 phrases simples : ce que les ventes réelles proches montrent pour ce bien" },
    references_dvf: {
      type: "array",
      description: "4 à 6 ventes choisies EXCLUSIVEMENT dans la liste fournie — ne JAMAIS inventer. Si une section « RÉFÉRENCES RETENUES » est fournie, reprends-la telle quelle.",
      items: {
        type: "object",
        properties: {
          localisation: { type: "string" }, detail: { type: "string" }, surface: { type: "number" },
          date: { type: "string", description: "MM/AAAA" }, prix: { type: "number" }, prix_m2: { type: "number" },
        },
        required: ["localisation", "detail", "surface", "date", "prix", "prix_m2"],
      },
    },
    base_mediane: { type: "number", description: "BASE DE MARCHÉ € = médiane du €/m² des références × surface. Si une base_mediane IMPOSÉE est fournie, reprends-la EXACTEMENT." },
    prix_estime: { type: "number", description: "Valeur estimée (cœur de fourchette), en euros" },
    fourchette_basse: { type: "number", description: "= prix du scénario Vente rapide" },
    fourchette_haute: { type: "number", description: "Haut de la fourchette, jamais au-delà de la meilleure vente comparable actualisée" },
    prix_m2: { type: "number" },
    prix_presentation: { type: "number", description: "Prix conseillé à l'affichage (= Prix optimal), au moins 25 000 € au-dessus de la borne basse, arrondi vers le bas" },
    description_bien: { type: "string", description: "2 paragraphes valorisants adressés au propriétaire (« votre maison », « votre appartement »)" },
    indice_confiance: { type: "number", description: "0 à 100" },
    delai_vente_estime: { type: "string" },
    positionnement_marche: { type: "string", description: "3 à 4 phrases SIMPLES : les ventes de référence, l'actualisation au marché actuel, et pourquoi les deux bornes" },
    analyse_photos: { type: "string", description: "Synthèse de l'analyse visuelle (vide sans photo)" },
    analyse_par_photo: {
      type: "array",
      description: "Une entrée par photo fournie, dans l'ordre (1 = première) — vide sans photo",
      items: {
        type: "object",
        properties: { photo: { type: "integer" }, titre: { type: "string" }, bons_points: { type: "array", items: { type: "string" } }, defauts: { type: "array", items: { type: "string" } } },
        required: ["photo", "titre", "bons_points", "defauts"],
      },
    },
    etat_notes: {
      type: "array",
      description: "Notes 1-5 par catégorie (État général, Luminosité, Cuisine, Salle de bain, Sols & murs, Extérieur) — vide sans photo",
      items: { type: "object", properties: { categorie: { type: "string" }, note: { type: "number" } }, required: ["categorie", "note"] },
    },
    coefficient_etat: { type: "string" },
    impact_etat: { type: "number", description: "Impact de l'état en euros signés (0 sans photo)" },
    scenarios_prix: {
      type: "array",
      description: "Exactement 3, prix croissants : Vente rapide < Prix optimal (= prix_presentation) < Prix plafond",
      items: {
        type: "object",
        properties: { strategie: { type: "string", enum: ["Vente rapide", "Prix optimal", "Prix plafond"] }, prix: { type: "number" }, delai: { type: "string" }, commentaire: { type: "string" } },
        required: ["strategie", "prix", "delai", "commentaire"],
      },
    },
    ajustements: {
      type: "array",
      description: "UNE SEULE ligne : l'actualisation au marché actuel (marché baissier). AUCUNE plus-value ni décote de caractéristique.",
      items: { type: "object", properties: { libelle: { type: "string" }, montant: { type: "number" } }, required: ["libelle", "montant"] },
    },
    points_forts: { type: "array", items: { type: "string" } },
    points_faibles: { type: "array", items: { type: "string" } },
    synthese: { type: "string", description: "3 à 4 phrases simples : pourquoi votre bien se situe dans cette fourchette" },
  },
  required: [
    "analyse_dvf", "references_dvf", "base_mediane", "prix_estime", "fourchette_basse",
    "fourchette_haute", "prix_m2", "prix_presentation", "description_bien", "indice_confiance",
    "delai_vente_estime", "positionnement_marche", "analyse_photos", "analyse_par_photo",
    "etat_notes", "coefficient_etat", "impact_etat", "scenarios_prix", "ajustements",
    "points_forts", "points_faibles", "synthese",
  ],
} as const;

const CLIENT_SYSTEM = `Tu es un expert en estimation immobilière d'une agence haut de gamme, CENTURY 21 Icaza Immobilier. Le dossier que tu produis est remis DIRECTEMENT au propriétaire du bien : écris pour lui, avec pédagogie. Tu disposes des VENTES RÉELLES DVF autour du bien (triées par proximité, avec adresse, distance et âge de chaque vente). Ton avis de valeur se fonde EXCLUSIVEMENT sur ces ventes réelles et les caractéristiques du bien — AUCUNE annonce en ligne.

RÈGLES :
- Analyse CHAQUE photo fournie (numérotées : 1 = première) : pièce/vue identifiée, bons points, défauts visibles concrets. Note l'état par catégorie (etat_notes, 1 à 5) et chiffre impact_etat en euros signés. Sans photo : analyse_par_photo et etat_notes vides, impact_etat 0, et baisse l'indice de confiance.
- MÉTHODE D'ESTIMATION (chemin imposé) :
  1. RÉFÉRENCES → si la fiche fournit une section « RÉFÉRENCES RETENUES », reprends-la TELLE QUELLE dans references_dvf (mêmes ventes, mêmes montants) et utilise la base_mediane IMPOSÉE. Sinon, sélectionne 4 à 6 ventes réelles proches (surfaces ±25 %), en écartant les €/m² manifestement atypiques. references_dvf ne doit jamais être vide si la liste DVF ne l'est pas.
  2. BASE → base_mediane = €/m² médian des références × surface habitable. Quand elle est IMPOSÉE, reprends-la exactement.
  3. PRIX RETENU (analyse au m² PURE) → prix_estime = base_mediane + UNIQUEMENT l'actualisation au marché actuel (marché baissier). N'ajoute AUCUNE plus-value ni décote de caractéristique (ni DPE, ni état, ni extérieur, ni équipement) : l'analyse au m² des ventes comparables les intègre déjà. Le tableau ajustements ne contient QU'UNE ligne : « Actualisation au marché actuel (ventes datées, marché en baisse) », montant négatif ou nul.
  4. FOURCHETTE → fourchette_basse = « Vente rapide » ; fourchette_haute = « Prix plafond ». Écart minimum de 25 000 € entre prix_presentation (« Prix optimal ») et fourchette_basse. prix_presentation arrondi vers le bas à un seuil attractif, jamais au sommet.
- scenarios_prix : exactement 3, prix STRICTEMENT croissants (Vente rapide < Prix optimal < Prix plafond).
- PRIX PSYCHOLOGIQUES : arrondis TOUJOURS vers le bas à un seuil attractif.
- synthese : explique SIMPLEMENT au propriétaire pourquoi son bien se situe dans cette fourchette.
- indice_confiance : reflète la quantité, la proximité et la fraîcheur des ventes de référence et la présence de photos.
- Réponds intégralement en français.

PROXIMITÉ : chaque vente indique son adresse et sa distance. APPARTEMENT → priorité à la MÊME ADRESSE (même copropriété), puis même rue, puis rayon proche. MAISON → priorité aux environs immédiats (même rue, ~1 km), puis quartier. La médiane doit refléter le micro-marché du bien.

MARCHÉ BAISSIER : le marché est en baisse (taux élevés). Une vente conclue il y a 1-2 ans l'a été plus cher que la valeur actuelle. ACTUALISE selon l'ancienneté : barème -3 % PAR ANNÉE écoulée (au prorata des mois). Une seule ligne d'actualisation, jamais de double comptage. Sois réaliste : les délais s'allongent.

STYLE : adresse-toi au propriétaire (« votre maison », « vous », « nous vous conseillons »). Phrases courtes, vocabulaire courant, aucun jargon. Chaque texte : 2 à 4 phrases maximum, clair à la première lecture.

FORMAT DE SORTIE : réponds EXCLUSIVEMENT par un objet JSON valide conforme au schéma fourni — aucun texte ni balise autour.`;

function buildPropertyText(input: PropertyInput): string {
  const surfaceTotale = surfaceHabitableTotale(input);
  return `# VOTRE BIEN

## Localisation
Adresse : ${input.adresse}, ${input.codePostal} ${input.ville}${input.quartier ? ` — quartier : ${input.quartier}` : ""}

## Caractéristiques
- Type : ${input.typeBien}
- Surface habitable : ${input.surfaceHabitable ?? "?"} m²${surfaceTotale && surfaceTotale !== input.surfaceHabitable ? ` (surface totale de comparaison : ${surfaceTotale} m²)` : ""}${input.surfaceTerrain ? ` | Terrain : ${input.surfaceTerrain} m²` : ""}
- Pièces : ${input.nbPieces ?? "?"} | Chambres : ${input.nbChambres ?? "?"} | Salles de bain : ${input.nbSallesDeBain ?? "?"}
- Étage : ${input.etage || "n.c."} | Ascenseur : ${input.ascenseur ? "oui" : "non"}
- Année de construction : ${input.anneeConstruction || "n.c."} | DPE : ${input.dpe || "n.c."}
- État général : ${input.etatGeneral || "n.c."} | Chauffage : ${input.chauffage || "n.c."}
- Exposition : ${input.exposition.length ? input.exposition.join(", ") : "n.c."} | Vue : ${input.vue || "n.c."}
- Extérieur : ${input.exterieur.length ? input.exterieur.join(", ") : "aucun"} | Stationnement : ${input.stationnement || "aucun"} | Cave : ${input.cave ? "oui" : "non"}
- Équipements : ${input.equipements.length ? input.equipements.join(", ") : "aucun"}`;
}

function dvfBlock(dvfSales: DvfSale[]): string {
  const dist = (s: DvfSale) =>
    s.memeAdresse ? " | MÊME ADRESSE (même copropriété/parcelle)"
      : s.distanceM != null ? ` | à ${s.distanceM < 1000 ? `${s.distanceM} m` : `${(s.distanceM / 1000).toFixed(1)} km`} du bien`
      : "";
  return dvfSales.length > 0
    ? dvfSales.slice(0, 40).map((s) =>
        `- ${s.date} (il y a ${ageMois(s.date)} mois) | ${s.typeLocal} | ${s.surface ?? "?"} m² | ${s.valeurFonciere} € | ${s.prixM2 ?? "?"} €/m² | ${s.adresse ? `${s.adresse}, ` : ""}${s.commune}${dist(s)}`,
      ).join("\n")
    : "(données DVF indisponibles pour ce secteur — baisse l'indice de confiance en conséquence)";
}

export interface ResultatMoteurClient {
  report: EstimationReport;
  moteurVersion: string;
}

/** Estimation client complète : photos + ventes réelles DVF (sans outils web). */
export async function computeClientReport(
  input: PropertyInput,
  dvfSales: DvfSale[],
  onProgress: (label: string) => void = () => {},
): Promise<ResultatMoteurClient> {
  const client = new Anthropic();
  const { model, effort } = modelConfig();
  const surfaceTotale = surfaceHabitableTotale(input);

  const content: Anthropic.ContentBlockParam[] = [];
  for (const photo of input.photos.slice(0, 15)) {
    content.push({ type: "image", source: { type: "base64", media_type: photo.mediaType, data: photo.data } });
  }

  // Sélection déterministe des références AVANT l'appel (stabilité du calcul).
  const deterministic = buildDvfReferences(dvfSales, input);
  content.push({
    type: "text",
    text: `${buildPropertyText(input)}

# VENTES RÉELLES DVF (commune du code postal ${input.codePostal}, triées par proximité)
${dvfBlock(dvfSales)}
${
  deterministic.references.length > 0
    ? `
# RÉFÉRENCES RETENUES — « DANS VOTRE RUE / À PROXIMITÉ IMMÉDIATE » (reprends-les TELLES QUELLES dans references_dvf)
${deterministic.references.map((ref) => `- ${ref.localisation} | ${ref.detail} | ${ref.surface} m² | ${ref.date} | ${ref.prix} € | ${ref.prix_m2} €/m² brut → ${ref.prix_m2_ajuste} €/m² ajusté à ${surfaceTotale} m²${ref.raison ? ` | ${ref.raison}` : ""}`).join("\n")}
- RÉFÉRENCE DU SECTEUR : à proximité immédiate, les biens se vendent entre ${deterministic.secteurM2Bas} et ${deterministic.secteurM2Haut} €/m² BRUT.
- base_mediane IMPOSÉE = ${deterministic.baseMediane} € = ${deterministic.baseM2 || "?"} €/m² (proximité, corrigé de la superficie) × surface du bien. NE la recalcule PAS.
- FIABILITÉ des comparables : ${deterministic.fiabilite}${deterministic.raisonFiabilite ? ` — ${deterministic.raisonFiabilite}` : ""}${deterministic.nbAberrantes > 0 ? ` (${deterministic.nbAberrantes} vente(s) atypique(s) écartée(s))` : ""}. Si « faible », élargis la fourchette et baisse l'indice de confiance.
`
    : ""
}
# TA MISSION
Produis l'avis de valeur du bien, fondé uniquement sur ces ventes réelles : analyse chaque photo, sélectionne les références les plus proches, fixe la base médiane, l'unique ligne d'actualisation au marché, la fourchette et les 3 scénarios de prix. Rédige une synthèse pédagogique pour le propriétaire.

# SCHÉMA JSON DE LA RÉPONSE (respecte-le exactement)
${JSON.stringify(CLIENT_SCHEMA)}`,
  });

  onProgress(
    input.photos.length > 0
      ? `Analyse de ${Math.min(input.photos.length, 15)} photo(s) et rédaction de votre dossier…`
      : "Rédaction de votre dossier d'estimation…",
  );

  const stream = client.messages.stream({
    model,
    max_tokens: 12000,
    thinking: { type: "adaptive" },
    system: CLIENT_SYSTEM,
    output_config: { effort },
    messages: [{ role: "user", content }],
  });
  const message = await stream.finalMessage();
  if (message.stop_reason === "refusal") throw new Error("Requête refusée par les garde-fous du modèle");

  const text = message.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("");
  const r = parseJsonLoose(text);

  // La sélection déterministe fait TOUJOURS foi pour les références et la base.
  const referencesDvf = deterministic.references.length > 0 ? deterministic.references : arr<ReferenceDvf>(r.references_dvf);
  const baseMediane = deterministic.baseMediane || num(r.base_mediane);

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
    audit_concurrentiel: { nb_annonces_analysees: 0, prix_m2_min: 0, prix_m2_median: 0, prix_m2_max: 0, tension_marche: "", synthese: "" },
    scenarios_prix: arr(r.scenarios_prix),
    references_dvf: referencesDvf,
    base_mediane: baseMediane,
    ajustements: arr(r.ajustements),
    etapes_commercialisation: [],
    points_forts: arr(r.points_forts),
    points_faibles: arr(r.points_faibles),
    strategie_commercialisation: "",
    argumentaire_vendeur: str(r.synthese),
    fiabilite: deterministic.fiabilite,
    fiabilite_raison: deterministic.raisonFiabilite,
    secteur_m2_bas: deterministic.secteurM2Bas,
    secteur_m2_haut: deterministic.secteurM2Haut,
    secteur_beta: deterministic.betaSurface,
  };

  // Garantie déterministe : écart « Prix optimal » − « Vente rapide » ≥ 25 000 €.
  const ECART_MIN = 25000;
  if (report.prix_presentation > 0 && report.fourchette_basse > 0 && report.prix_presentation - report.fourchette_basse < ECART_MIN) {
    const nouvelleBasse = Math.floor((report.prix_presentation - ECART_MIN) / 1000) * 1000;
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

  // Plafonnement de l'indice de confiance selon la fiabilité réelle des comparables.
  const capFiab = deterministic.fiabilite === "faible" ? 55 : deterministic.fiabilite === "moyenne" ? 78 : 92;
  if (report.indice_confiance > capFiab) report.indice_confiance = capFiab;

  if (report.prix_estime <= 0 || report.fourchette_basse <= 0) throw new Error("Réponse IA incomplète (prix manquants)");
  return { report, moteurVersion: MOTEUR_VERSION };
}
