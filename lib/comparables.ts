import type { DvfSale } from "./types";

// Sélection des comparables DVF — cœur du moteur d'estimation.
//
// PRINCIPE : « dans votre rue / à proximité immédiate, les biens se vendent à
// X €/m² — donc votre bien tourne dans cette fourchette, ajustée à sa
// superficie ». On PRIVILÉGIE la proximité géographique (même adresse → même
// rue → rayon proche) MÊME si la surface ou la typologie ne collent pas
// parfaitement, puis on CORRIGE le €/m² de chaque référence selon la
// superficie du bien à estimer :
//   1. priorité géographique absolue (rayon croissant jusqu'à assez de ventes) ;
//   2. détection des valeurs aberrantes (€/m² très au-dessus ou en dessous du
//      micro-marché : bien d'exception, vente entre proches → écarté) ;
//   3. CORRECTION DE SUPERFICIE : le €/m² décroît quand la surface augmente.
//      Chaque vente est ramenée au €/m² qu'aurait le bien à SA surface
//      (référence petite → €/m² revu à la baisse ; référence grande → à la
//      hausse), via une élasticité prix/surface ;
//   4. médiane PONDÉRÉE par la proximité du €/m² corrigé → base à la surface
//      exacte du bien ;
//   5. indicateur de fiabilité (élevée / moyenne / faible) qui reflète la
//      qualité réelle des comparables et pilote la largeur de la fourchette.
//
// Volontairement SANS actualisation du marché ici : la décote conjoncturelle
// reste une ligne d'ajustement unique en aval (pas de double comptage).

export type Fiabilite = "élevée" | "moyenne" | "faible";

// Élasticité prix/surface : le €/m² varie en (surface)^(-BETA). Empiriquement
// ~0,20-0,25 pour le résidentiel — un bien 2× plus grand a un €/m² ~15 % plus
// bas. Sert à transposer le €/m² d'une référence à la surface du bien estimé.
const BETA_SURFACE = 0.22;

export interface ComparableRetenu extends DvfSale {
  score: number;
  distance_m: number | null;
  prix_m2_ajuste: number;
  raison: string;
}

export interface SelectionComparables {
  retenues: ComparableRetenu[];
  baseM2: number | null; // €/m² corrigé retenu, appliqué à la surface du bien
  baseMediane: number;
  mediineM2: number; // €/m² BRUT médian du secteur (avant correction surface)
  secteurM2Bas: number; // fourchette €/m² brut observée « dans votre rue »
  secteurM2Haut: number;
  betaSurface: number;
  fiabilite: Fiabilite;
  raisonFiabilite: string;
  nbAberrantes: number;
}

const TYPE_LOCAL: Record<string, string> = { maison: "Maison", appartement: "Appartement" };

function median(values: number[]): number | null {
  const v = [...values].sort((a, b) => a - b);
  if (v.length === 0) return null;
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}

// Écart absolu médian (MAD) → dispersion robuste, insensible aux extrêmes.
function mad(values: number[], med: number | null): number {
  if (values.length === 0 || med == null) return 0;
  return median(values.map((x) => Math.abs(x - med))) ?? 0;
}

function ageMois(dateIso: string): number {
  const t = new Date(dateIso).getTime();
  if (!Number.isFinite(t)) return 999;
  return Math.max(0, Math.round((Date.now() - t) / (30.44 * 24 * 3600 * 1000)));
}

// Médiane pondérée : valeur pour laquelle le poids cumulé atteint la moitié
// du poids total.
function weightedMedian(pairs: { value: number; weight: number }[]): number | null {
  const sorted = pairs
    .filter((p) => p.weight > 0 && Number.isFinite(p.value))
    .sort((a, b) => a.value - b.value);
  const total = sorted.reduce((s, p) => s + p.weight, 0);
  if (sorted.length === 0 || total <= 0) return null;
  const cible = total / 2;
  let acc = 0;
  for (let i = 0; i < sorted.length; i++) {
    const avant = acc;
    acc += sorted[i].weight;
    if (acc >= cible) {
      if (i > 0 && avant === cible) return (sorted[i - 1].value + sorted[i].value) / 2;
      return sorted[i].value;
    }
  }
  return sorted[sorted.length - 1].value;
}

// --- Scores partiels (barème borné, proximité dominante) --------------------
function scoreProximite(s: DvfSale): number {
  if (s.memeAdresse) return 45;
  const d = s.distanceM;
  if (d == null) return 8;
  if (d <= 100) return 43;
  if (d <= 250) return 38;
  if (d <= 500) return 31;
  if (d <= 800) return 24;
  if (d <= 1200) return 17;
  if (d <= 2000) return 10;
  if (d <= 3500) return 5;
  return 2;
}

function scoreSurface(surface: number, s: DvfSale): number {
  if (!surface || !s.surface) return 6;
  const ecart = Math.abs(s.surface / surface - 1);
  if (ecart <= 0.05) return 22;
  if (ecart <= 0.1) return 20;
  if (ecart <= 0.15) return 17;
  if (ecart <= 0.25) return 13;
  if (ecart <= 0.4) return 8;
  if (ecart <= 0.6) return 4;
  return 1;
}

function scoreType(wantedType: string, s: DvfSale): number {
  if (!wantedType) return 5;
  return s.typeLocal === wantedType ? 8 : 1;
}

function scoreRecence(s: DvfSale): number {
  const m = ageMois(s.date);
  if (m <= 6) return 20;
  if (m <= 12) return 17;
  if (m <= 24) return 12;
  if (m <= 36) return 7;
  if (m <= 48) return 4;
  return 2;
}

function scoreComparable(surface: number, wantedType: string, s: DvfSale): number {
  return scoreProximite(s) + scoreSurface(surface, s) + scoreType(wantedType, s) + scoreRecence(s);
}

function distanceLabel(s: { memeAdresse?: boolean; distanceM?: number | null }): string {
  if (s.memeAdresse) return "même adresse";
  if (s.distanceM == null) return "distance inconnue";
  return s.distanceM < 1000 ? `à ${s.distanceM} m` : `à ${(s.distanceM / 1000).toFixed(1)} km`;
}

// Raison synthétique de la sélection (proximité d'abord, puis rapport de
// surface expliquant la correction du €/m²).
function raisonSelection(surface: number, s: DvfSale): string {
  const bouts: string[] = [];
  if (s.memeAdresse) bouts.push("même immeuble / parcelle");
  else if (s.distanceM != null && s.distanceM <= 500) bouts.push(`très proche (${distanceLabel(s)})`);
  else bouts.push(distanceLabel(s));
  if (surface && s.surface) {
    const ratio = s.surface / surface;
    if (Math.abs(ratio - 1) <= 0.12) bouts.push("surface équivalente");
    else if (ratio < 1) bouts.push("réf. plus petite → €/m² ajusté à la baisse");
    else bouts.push("réf. plus grande → €/m² ajusté à la hausse");
  }
  const m = ageMois(s.date);
  if (m <= 12) bouts.push("vente récente");
  else if (m <= 24) bouts.push("vente < 2 ans");
  return bouts.join(" · ");
}

// ---------------------------------------------------------------------------
// Sélection robuste : comparables retenus (enrichis), base de marché robuste
// (médiane pondérée du €/m² × surface), €/m² retenu, fiabilité, aberrantes.
// ---------------------------------------------------------------------------
export function selectionnerComparables(
  dvfSales: DvfSale[],
  { surface = 0, typeBien = "" }: { surface?: number; typeBien?: string },
): SelectionComparables {
  const wantedType = TYPE_LOCAL[typeBien] || "";

  // 1) Pool de candidats : €/m² plausible et bonne typologie si possible. On NE
  //    filtre PAS sur la surface : la priorité est géographique (la correction
  //    de superficie à l'étape 3 permet d'exploiter aussi des surfaces
  //    différentes). On écarte seulement les surfaces sans commune mesure
  //    (< 0,35× ou > 2,8×), au-delà desquelles la loi €/m²–surface n'est plus
  //    fiable (studio vs villa).
  let pool = (dvfSales || []).filter(
    (s) => s.surface && s.prixM2 && s.prixM2 > 300 && s.prixM2 < 25000,
  );
  if (wantedType) {
    const sameType = pool.filter((s) => s.typeLocal === wantedType);
    if (sameType.length >= 3) pool = sameType;
  }
  if (surface > 0) {
    const raisonnable = pool.filter(
      (s) => (s.surface as number) >= surface * 0.35 && (s.surface as number) <= surface * 2.8,
    );
    if (raisonnable.length >= 3) pool = raisonnable;
  }
  if (pool.length === 0) {
    return {
      retenues: [], baseM2: null, baseMediane: 0, mediineM2: 0,
      secteurM2Bas: 0, secteurM2Haut: 0, betaSurface: BETA_SURFACE,
      fiabilite: "faible", raisonFiabilite: "Aucune vente comparable exploitable.", nbAberrantes: 0,
    };
  }

  // 2) Détection des valeurs aberrantes sur le €/m² du micro-marché : un bien
  //    vendu très au-dessus (bien d'exception, saisie erronée) ou très en
  //    dessous (vente entre proches, bien dégradé) fausse la référence.
  const m2Pool = pool.map((s) => s.prixM2 as number);
  const medM2 = median(m2Pool);
  const madM2 = mad(m2Pool, medM2);
  const seuilRobuste = madM2 > 0 ? 3.0 * 1.4826 * madM2 : Infinity;
  const estAberrante = (s: DvfSale) => {
    if (pool.length < 5 || medM2 == null) return false;
    const ecartRobuste = Math.abs((s.prixM2 as number) - medM2) > seuilRobuste;
    const horsBande = (s.prixM2 as number) < medM2 * 0.6 || (s.prixM2 as number) > medM2 * 1.6;
    return ecartRobuste || horsBande;
  };
  const nonAberrantes = pool.filter((s) => !estAberrante(s));
  const nbAberrantes = pool.length - nonAberrantes.length;
  const propres = nonAberrantes.length >= 3 ? nonAberrantes : pool;

  // 3) SÉLECTION PAR PROXIMITÉ GÉOGRAPHIQUE (rayon croissant) : « dans votre rue
  //    d'abord ». On prend les ventes les plus proches jusqu'à en avoir assez
  //    (≥ 5), en élargissant le rayon par paliers ; la surface n'entre PAS dans
  //    le choix — seule la distance compte.
  const rankProx = (s: DvfSale) =>
    s.memeAdresse ? -1 : s.distanceM != null ? s.distanceM : Number.MAX_SAFE_INTEGER;
  const parProximite = [...propres].sort(
    (a, b) => rankProx(a) - rankProx(b) || (a.date < b.date ? 1 : -1),
  );
  const PALIERS = [50, 100, 200, 500, 1000, Infinity];
  let retenuesRaw = parProximite.slice(0, 8);
  for (const rayon of PALIERS) {
    const dans = parProximite.filter((s) => s.memeAdresse || (s.distanceM != null && s.distanceM <= rayon));
    if (dans.length >= 5) {
      retenuesRaw = dans.slice(0, 8);
      break;
    }
  }
  if (retenuesRaw.length < 3) retenuesRaw = parProximite.slice(0, Math.min(8, parProximite.length));

  // 4) CORRECTION DE SUPERFICIE puis médiane PONDÉRÉE PAR LA PROXIMITÉ. Chaque
  //    référence est ramenée au €/m² qu'elle vaudrait à la surface du bien :
  //    ajusté = €/m² × (surface_réf / surface_bien)^BETA. Une petite référence
  //    (€/m² élevé) est révisée à la baisse, une grande (€/m² faible) à la
  //    hausse. La base = médiane de ces €/m² corrigés, pondérée par la
  //    proximité (les ventes les plus proches pèsent le plus).
  const ajusteM2 = (s: DvfSale) =>
    surface > 0 && s.surface
      ? Math.round((s.prixM2 as number) * Math.pow((s.surface as number) / surface, BETA_SURFACE))
      : (s.prixM2 as number);
  const withScore = retenuesRaw.map((s) => ({
    ...s,
    _score: scoreComparable(surface, wantedType, s),
    _adj: ajusteM2(s),
    _wProx: Math.max(scoreProximite(s), 1),
  }));
  const baseM2 = weightedMedian(withScore.map((s) => ({ value: s._adj, weight: s._wProx })));
  const mediineM2 = median(retenuesRaw.map((s) => s.prixM2 as number)) ?? 0;
  const bruts = retenuesRaw.map((s) => s.prixM2 as number).sort((a, b) => a - b);
  const secteurM2Bas = bruts[0] ?? 0;
  const secteurM2Haut = bruts[bruts.length - 1] ?? 0;
  const baseMediane =
    surface > 0 && baseM2
      ? Math.round((baseM2 * surface) / 100) * 100
      : Math.round(median(retenuesRaw.map((s) => s.valeurFonciere)) ?? 0);

  // 5) Fiabilité : nombre de comparables, proximité, dispersion, fraîcheur.
  const distances = retenuesRaw
    .map((s) => (s.memeAdresse ? 0 : s.distanceM))
    .filter((d): d is number => d != null);
  const minDist = distances.length ? Math.min(...distances) : null;
  const adjVals = withScore.map((s) => s._adj);
  const medAdj = median(adjVals);
  const dispersion = baseM2 ? (mad(adjVals, medAdj) * 1.4826) / baseM2 : 1;
  const recents = retenuesRaw.filter((s) => ageMois(s.date) <= 24).length;
  const aMemeAdresse = retenuesRaw.some((s) => s.memeAdresse);

  let fiabilite: Fiabilite;
  let raisonFiabilite: string;
  if (
    retenuesRaw.length >= 4 &&
    (aMemeAdresse || (minDist != null && minDist <= 250)) &&
    dispersion <= 0.2 &&
    recents >= 2
  ) {
    fiabilite = "élevée";
    raisonFiabilite = `${retenuesRaw.length} ventes comparables${aMemeAdresse ? " dont une même adresse" : minDist != null ? `, la plus proche à ${minDist} m` : ""}, prix homogènes et récents.`;
  } else if (retenuesRaw.length < 3 || (minDist != null && minDist > 1500) || dispersion > 0.35) {
    fiabilite = "faible";
    const causes: string[] = [];
    if (retenuesRaw.length < 3) causes.push("peu de ventes comparables");
    if (minDist != null && minDist > 1500) causes.push("comparables éloignés du bien");
    if (minDist == null) causes.push("distances non géolocalisées");
    if (dispersion > 0.35) causes.push("prix très dispersés");
    raisonFiabilite = `Fourchette élargie par prudence : ${causes.join(", ") || "données comparables limitées"}.`;
  } else {
    fiabilite = "moyenne";
    raisonFiabilite = `${retenuesRaw.length} ventes comparables${minDist != null ? `, la plus proche à ${minDist < 1000 ? `${minDist} m` : `${(minDist / 1000).toFixed(1)} km`}` : ""} — bonne cohérence d'ensemble.`;
  }

  const retenues: ComparableRetenu[] = withScore.map((s) => {
    const { _score, _adj, _wProx, ...sale } = s;
    void _wProx;
    return {
      ...sale,
      score: Math.round(_score),
      distance_m: s.memeAdresse ? 0 : s.distanceM ?? null,
      prix_m2_ajuste: _adj,
      raison: raisonSelection(surface, s),
    };
  });

  return {
    retenues, baseM2, baseMediane, mediineM2,
    secteurM2Bas, secteurM2Haut, betaSurface: BETA_SURFACE,
    fiabilite, raisonFiabilite, nbAberrantes,
  };
}
