import type { Opportunite, SignalDPE } from "./prospectionTypes";

// Déduplication : empêcher plusieurs opportunités pour le même bien
// (variantes d'adresse, DPE remplacé, plusieurs DPE du même logement…), tout
// en conservant l'HISTORIQUE des signaux.

const strip = (s: string) =>
  (s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// Normalise une voie (retire les mots de type de voie) → cœur comparable.
export function normVoie(v: string): string {
  return strip(v).replace(/\b(rue|avenue|av|boulevard|bd|allee|all|chemin|che|impasse|imp|place|pl|route|rte|lotissement|lot|traverse|montee|quai)\b/g, "").replace(/\s+/g, "");
}

// Clé de déduplication d'un bien, par ordre de fiabilité décroissante :
//   1. identifiant BAN (le plus fiable pour un logement) ;
//   2. parcelle cadastrale ;
//   3. coordonnées arrondies + n° + voie normalisée.
export function cleDedup(o: {
  identifiantBan?: string; parcelle?: string; numero?: string; voie?: string;
  codeInsee?: string; codePostal?: string; lat?: number | null; lon?: number | null;
}): string {
  if (o.identifiantBan) return `ban:${strip(o.identifiantBan)}`;
  if (o.parcelle) return `par:${strip(o.parcelle)}`;
  const voie = normVoie(o.voie ?? "");
  const num = strip(o.numero ?? "");
  const zone = o.codeInsee || o.codePostal || "";
  if (voie && num) return `adr:${zone}:${num}:${voie}`;
  // Repli géographique : grille ~11 m (5 décimales).
  if (o.lat != null && o.lon != null) return `geo:${o.lat.toFixed(4)}:${o.lon.toFixed(4)}:${voie}`;
  return `adr:${zone}:${num}:${voie}`;
}

// Fusionne un nouveau signal dans une opportunité existante (même bien).
// Conserve l'historique, met à jour le « dernier DPE » si le signal est plus
// récent, et ne perd jamais l'attribution / le suivi terrain existants.
export function fusionnerSignal(existante: Opportunite, signal: SignalDPE, bien: Partial<Opportunite>): Opportunite {
  const dejaVu = existante.signaux.some((s) => s.numeroDpe === signal.numeroDpe);
  const signaux = dejaVu
    ? existante.signaux.map((s) => (s.numeroDpe === signal.numeroDpe ? { ...s, syncLe: signal.syncLe } : s))
    : [...existante.signaux, signal];

  // Le signal est-il plus récent que le DPE actuellement retenu ?
  const plusRecent = !existante.dpeDateEtablissement || signal.dateEtablissement > existante.dpeDateEtablissement;

  return {
    ...existante,
    signaux,
    syncLe: signal.syncLe,
    // On rafraîchit les infos du bien seulement si le nouveau DPE est plus récent.
    ...(plusRecent
      ? {
          dpeNumero: signal.numeroDpe,
          dpeDateEtablissement: signal.dateEtablissement,
          dpeDateReception: signal.dateReception,
          dpeDateVisite: signal.dateVisite,
          dpe: signal.etiquetteDpe || existante.dpe,
          ges: signal.etiquetteGes || existante.ges,
          surface: bien.surface ?? existante.surface,
          periodeConstruction: bien.periodeConstruction || existante.periodeConstruction,
          lat: bien.lat ?? existante.lat,
          lon: bien.lon ?? existante.lon,
          ademe: bien.ademe ?? existante.ademe,
        }
      : {}),
    updatedAt: Date.now(),
  };
}
