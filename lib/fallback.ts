import { medianPrixM2 } from "./dvf";
import type { LoyerIndicateur } from "./loyers";
import { loyerNetAnnuel, prixParRendement, RENDEMENT_NET_BAS, RENDEMENT_NET_HAUT, RENDEMENT_NET_MEDIAN } from "./rendement";
import { buildDvfReferences } from "./references";
import { surfaceHabitableTotale } from "./surfaces";
import type { DvfSale, EstimationReport, PropertyInput } from "./types";

function medianOf(values: number[]): number | null {
  const v = [...values].sort((a, b) => a - b);
  if (v.length === 0) return null;
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : Math.round((v[mid - 1] + v[mid]) / 2);
}

/**
 * Moteur statistique de secours : utilisé quand la clé ANTHROPIC_API_KEY
 * n'est pas configurée ou que l'appel IA échoue. Croise la médiane DVF,
 * la concurrence active et la décote observée sur les invendus.
 */
export function computeFallbackEstimate(
  input: PropertyInput,
  dvfSales: DvfSale[],
): EstimationReport {
  const surface = surfaceHabitableTotale(input);

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

  // Analyse au m² pure : pas d'ajustement DPE/état — l'analyse des ventes
  // comparables du secteur intègre déjà ces éléments.
  const prixM2 = baseM2 ? Math.round(baseM2) : 0;
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
        ? `Estimation statistique calculée à partir de : ${sources.join(", ")}. Analyse au m² pure, sans ajustement de caractéristique.`
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


/**
 * Moteur statistique locatif (sans IA) : loyer = indicateur officiel × surface
 * habitable totale, fourchette ± l'intervalle de prédiction de l'indicateur.
 */
export function computeFallbackLocatif(
  input: PropertyInput,
  dvfSales: DvfSale[],
  loyer: LoyerIndicateur | null,
): EstimationReport {
  const base = computeFallbackEstimate(input, dvfSales);
  const surface = surfaceHabitableTotale(input);
  // Règle de l'agence : la RÉFÉRENCE du loyer est la valeur HAUTE du
  // tableau officiel ; la fourchette va du MÉDIAN au HAUT × surface
  const m2Med = loyer?.loyerM2 ?? 0;
  const m2Haut = loyer?.loyerM2Haut && loyer.loyerM2Haut > 0 ? loyer.loyerM2Haut : m2Med;
  const medM = m2Med > 0 && surface > 0 ? Math.floor((m2Med * surface) / 10) * 10 : 0;
  const hautM = m2Haut > 0 && surface > 0 ? Math.max(Math.floor((m2Haut * surface) / 10) * 10, medM) : medM;
  const venale = base.prix_estime;
  return {
    ...base,
    prix_estime: hautM,
    fourchette_basse: medM,
    fourchette_haute: hautM,
    prix_m2: m2Haut > 0 ? Math.round(m2Haut * 100) / 100 : 0,
    prix_presentation: hautM,
    base_mediane: hautM,
    references_dvf: [],
    ajustements: [],
    delai_vente_estime: "2 à 6 semaines",
    positionnement_marche: hautM > 0
      ? `L'observatoire officiel des loyers de votre secteur (${loyer?.millesime ?? "source officielle"}) situe le haut du marché à ${m2Haut} €/m² pour votre typologie : c'est notre référence. Pour ${surface} m², votre fourchette va de ${medM} €/mois (médian) à ${hautM} €/mois (haut), et nous conseillons ${hautM} €/mois.`
      : "L'indicateur officiel des loyers est indisponible pour cette commune : estimation locative à confirmer lors du rendez-vous.",
    analyse_dvf: hautM > 0
      ? `Les loyers observés sur votre secteur (${loyer?.typologie ?? "votre typologie"}, ${loyer?.nbAnnonces ?? "?"} loyers collectés — ${loyer?.millesime ?? "source officielle"}) montent jusqu'à ${m2Haut} €/m². Votre loyer se cale sur cette valeur haute, sans jamais descendre sous le médian (${m2Med} €/m²).`
      : "",
    scenarios_prix: hautM > 0
      ? [
          { strategie: "Vente rapide", prix: medM, delai: "1 à 3 semaines", commentaire: "Le loyer médian officiel du secteur : le plancher de votre fourchette." },
          { strategie: "Prix optimal", prix: hautM, delai: "2 à 6 semaines", commentaire: "Le loyer que nous conseillons pour votre bien, ancré sur le haut du marché officiel de votre secteur." },
          { strategie: "Prix plafond", prix: hautM, delai: "Haut du marché", commentaire: "La valeur haute officielle observée sur votre secteur : le maximum que le marché accepte pour votre typologie." },
        ]
      : base.scenarios_prix,
    valeur_venale_indicative: venale,
    rendement_brut: venale > 0 && hautM > 0 ? Math.round(((hautM * 12) / venale) * 1000) / 10 : 0,
  };
}


/**
 * Moteur statistique « bien vendu loué » (sans IA) : prix par capitalisation
 * du loyer NET annuel à une rentabilité nette de 6 à 8 % — le calcul est
 * mécanique, l'IA n'apporte que la rédaction.
 */
export function computeFallbackBienLoue(
  input: PropertyInput,
  dvfSales: DvfSale[],
): EstimationReport {
  const base = computeFallbackEstimate(input, dvfSales);
  const net = loyerNetAnnuel(input);
  if (net <= 0) return base; // loyer non renseigné : estimation classique
  const pRapide = prixParRendement(net, RENDEMENT_NET_HAUT);
  const pOptimal = prixParRendement(net, RENDEMENT_NET_BAS);
  const pEstime = prixParRendement(net, RENDEMENT_NET_MEDIAN);
  const surface = surfaceHabitableTotale(input);
  const det = buildDvfReferences(dvfSales, input);
  return {
    ...base,
    prix_estime: pEstime,
    fourchette_basse: pRapide,
    fourchette_haute: pOptimal,
    prix_m2: surface > 0 ? Math.round(pEstime / surface) : 0,
    prix_presentation: pOptimal,
    references_dvf: det.references,
    base_mediane: det.baseMediane,
    ajustements: [],
    indice_confiance: 75,
    delai_vente_estime: "2 à 4 mois auprès d'investisseurs",
    positionnement_marche: `Votre bien est vendu loué : son prix se fixe par la rentabilité nette offerte à l'investisseur. Loyer net annuel de ${net} € (loyer perçu moins charges non récupérables et taxe foncière), capitalisé entre 6 et 8 % net : la fourchette va de ${pRapide} € à ${pOptimal} €.`,
    scenarios_prix: [
      { strategie: "Vente rapide", prix: pRapide, delai: "4 à 8 semaines", commentaire: "À ce prix, l'acheteur obtient 8 % de rentabilité nette : votre bien devient une évidence pour les investisseurs du secteur." },
      { strategie: "Prix optimal", prix: pOptimal, delai: "2 à 4 mois", commentaire: "Le haut de fourchette défendable : 6 % de rentabilité nette pour l'acheteur, le plancher qu'accepte le marché de l'investissement." },
    ],
    etapes_commercialisation: [
      "Dossier investisseur complet — bail, quittances, charges et taxe foncière réunis dès la mise en vente",
      "Rendement net mis en avant dans l'annonce — c'est le premier critère de l'acheteur investisseur",
      "Diffusion ciblée — investisseurs locaux et acquéreurs en recherche de rapport",
      "Comptes rendus réguliers — vous suivez chaque contact et chaque offre",
    ],
    strategie_commercialisation:
      "Le bien étant vendu loué, la commercialisation vise les investisseurs : le rendement net est l'argument central de l'annonce et du dossier remis aux acquéreurs.",
    argumentaire_vendeur: `Un prix fixé par le rendement — l'acheteur d'un bien loué est un investisseur : il paie ce que rapporte votre bien, soit ${net} € nets par an.\nUne fourchette de 6 à 8 % net — au-delà de ${pOptimal} €, la rentabilité passe sous 6 % et les investisseurs ne regardent plus l'annonce.\nUn locataire en place — des revenus dès le premier jour : c'est un vrai atout de vente auprès des investisseurs.`,
  };
}
