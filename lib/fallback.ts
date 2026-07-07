import { medianPrixM2 } from "./dvf";
import type { DvfSale, EstimationReport, PropertyInput } from "./types";

function medianOf(values: number[]): number | null {
  const v = [...values].sort((a, b) => a - b);
  if (v.length === 0) return null;
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : Math.round((v[mid - 1] + v[mid]) / 2);
}

const DPE_ADJUSTMENT: Record<string, number> = {
  A: 1.06, B: 1.04, C: 1.02, D: 1.0, E: 0.96, F: 0.9, G: 0.85,
};

const ETAT_ADJUSTMENT: Record<string, number> = {
  neuf: 1.08,
  "refait à neuf": 1.05,
  "bon état": 1.0,
  "rafraîchissement à prévoir": 0.93,
  "travaux importants": 0.82,
};

/**
 * Moteur statistique de secours : utilisé quand la clé ANTHROPIC_API_KEY
 * n'est pas configurée ou que l'appel IA échoue. Croise la médiane DVF,
 * la concurrence active et la décote observée sur les invendus.
 */
export function computeFallbackEstimate(
  input: PropertyInput,
  dvfSales: DvfSale[],
): EstimationReport {
  const surface = input.surfaceHabitable ?? 0;

  const dvfMedian = medianPrixM2(dvfSales);
  const concurrenceM2 = medianOf(
    input.concurrence
      .filter((c) => c.prix && c.surface && c.surface > 8)
      .map((c) => Math.round(c.prix! / c.surface!)),
  );
  const invendusM2 = medianOf(
    input.invendus
      .filter((c) => c.prix && c.surface && c.surface > 8)
      .map((c) => Math.round(c.prix! / c.surface!)),
  );

  // Base : DVF (prix réels) pondéré avec la concurrence (prix affichés,
  // généralement négociés à la baisse de ~5%).
  let baseM2: number | null = null;
  if (dvfMedian && concurrenceM2) baseM2 = Math.round(dvfMedian * 0.6 + concurrenceM2 * 0.95 * 0.4);
  else baseM2 = dvfMedian ?? (concurrenceM2 ? Math.round(concurrenceM2 * 0.95) : null);

  // Les invendus marquent le plafond que le marché refuse.
  const plafondM2 = invendusM2 ? Math.round(invendusM2 * 0.97) : null;
  if (baseM2 && plafondM2 && baseM2 > plafondM2) baseM2 = plafondM2;

  const dpeAdj = DPE_ADJUSTMENT[input.dpe?.toUpperCase()] ?? 1.0;
  const etatAdj = ETAT_ADJUSTMENT[input.etatGeneral?.toLowerCase()] ?? 1.0;

  const prixM2 = baseM2 ? Math.round(baseM2 * dpeAdj * etatAdj) : 0;
  const prixEstime = surface > 0 ? Math.round((prixM2 * surface) / 1000) * 1000 : 0;

  const sources = [
    dvfMedian ? `médiane DVF ${dvfMedian} €/m² (${dvfSales.length} ventes)` : null,
    concurrenceM2 ? `concurrence active ${concurrenceM2} €/m² affiché` : null,
    invendusM2 ? `invendus +90j ${invendusM2} €/m² (plafond de marché)` : null,
  ].filter(Boolean);

  const confiance = Math.min(80, 25 + (dvfMedian ? 25 : 0) + (concurrenceM2 ? 20 : 0) + (invendusM2 ? 10 : 0));

  return {
    prix_estime: prixEstime,
    fourchette_basse: Math.round((prixEstime * 0.95) / 1000) * 1000,
    fourchette_haute: Math.round((prixEstime * 1.05) / 1000) * 1000,
    prix_m2: prixM2,
    indice_confiance: prixEstime > 0 ? confiance : 10,
    delai_vente_estime: "2 à 4 mois au prix recommandé",
    positionnement_marche:
      prixEstime > 0
        ? `Estimation statistique calculée à partir de : ${sources.join(", ")}. Ajustements appliqués : DPE ${input.dpe || "n.c."} (×${dpeAdj}), état « ${input.etatGeneral || "n.c."} » (×${etatAdj}).`
        : "Données insuffisantes pour une estimation fiable : renseignez la surface, et ajoutez des biens concurrents ou vérifiez le code postal pour les données DVF.",
    analyse_dvf: dvfMedian
      ? `${dvfSales.length} transactions DVF exploitées, médiane à ${dvfMedian} €/m².`
      : "Données DVF indisponibles pour ce secteur (API injoignable ou code postal sans transactions récentes).",
    analyse_concurrence: concurrenceM2
      ? `Concurrence active médiane à ${concurrenceM2} €/m² affiché (décote de négociation ~5 % appliquée).`
      : "Aucun bien concurrent renseigné.",
    analyse_invendus: invendusM2
      ? `Les biens invendus (+90 jours) affichent une médiane de ${invendusM2} €/m² : ce niveau constitue le plafond que le marché refuse — l'estimation reste en dessous.`
      : "Aucun invendu renseigné : le plafond de sur-commercialisation n'a pas pu être mesuré.",
    analyse_photos:
      input.photos.length > 0
        ? "Analyse visuelle non disponible en mode statistique (configurer ANTHROPIC_API_KEY pour l'analyse IA des photos)."
        : "Aucune photo fournie.",
    prix_presentation: prixEstime > 0 ? Math.round((prixEstime * 1.026) / 1000) * 1000 : 0,
    description_bien: "",
    analyse_par_photo: [],
    etat_notes: [],
    coefficient_etat: input.etatGeneral || "",
    impact_etat: 0,
    annonces_concurrentes: [],
    audit_concurrentiel: {
      nb_annonces_analysees: 0,
      prix_m2_min: 0,
      prix_m2_median: concurrenceM2 ?? 0,
      prix_m2_max: 0,
      tension_marche: "",
      synthese: "",
    },
    scenarios_prix: [],
    references_dvf: [],
    base_mediane: 0,
    ajustements: [],
    etapes_commercialisation: [],
    points_forts: [],
    points_faibles: [],
    strategie_commercialisation:
      "Mode statistique : positionner le bien légèrement sous la concurrence active pour capter les acheteurs en veille, et rester sous le niveau des invendus. Pour une stratégie détaillée, activer le moteur IA.",
    argumentaire_vendeur:
      "Cette estimation croise les prix de vente réels (DVF), les biens actuellement en concurrence et les biens qui ne se vendent pas : un prix au-dessus de cette fourchette expose à une commercialisation longue et à une négociation finale plus dure.",
  };
}
