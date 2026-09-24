// Client Open Data ADEME — jeu de données « DPE logements existants »
// (dpe03existant, ~15,6 M lignes, mis à jour en continu, sans clé d'API).
// API Data Fair : filtre Lucene (qs), tri, sélection de champs, pagination
// par curseur (`next`). On récupère de façon INCRÉMENTALE les DPE récents
// des communes surveillées.
//
// Doc : https://data.ademe.fr/datasets/dpe03existant

import { typeBienDepuisAdeme } from "./prospectionTypes";

const BASE = "https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/lines";
export const SOURCE_DPE = "ademe-dpe-existant";

// Champs ADEME de base (snake_case dans ce jeu de données).
const CHAMPS_BASE = [
  "numero_dpe", "date_etablissement_dpe", "date_reception_dpe", "date_visite_diagnostiqueur",
  "etiquette_dpe", "etiquette_ges", "type_batiment", "surface_habitable_logement",
  "periode_construction", "adresse_ban", "numero_voie_ban", "nom_rue_ban",
  "code_postal_ban", "nom_commune_ban", "code_insee_ban", "identifiant_ban", "score_ban",
  "_geopoint", "complement_adresse_batiment",
];

// Champs ADEME complémentaires exposés au négociateur (fiche « Données DPE »).
// Libellés lisibles dans lib/prospectionTypes.ts (LABELS_ADEME).
export const CHAMPS_DETAILS = [
  "annee_construction", "hauteur_sous_plafond", "nombre_niveau_logement", "classe_inertie_batiment",
  "conso_5_usages_par_m2_ep", "conso_5_usages_par_m2_ef", "emission_ges_5_usages_par_m2", "cout_total_5_usages",
  "type_energie_principale_chauffage", "type_generateur_chauffage_principal", "type_installation_chauffage",
  "type_energie_principale_ecs", "type_generateur_chauffage_principal_ecs",
  "type_ventilation", "qualite_isolation_murs", "qualite_isolation_menuiseries",
  "qualite_isolation_plancher_bas", "qualite_isolation_plancher_haut",
  "date_fin_validite_dpe", "date_derniere_modification_dpe", "version_dpe", "modele_dpe",
];

const CHAMPS = [...CHAMPS_BASE, ...CHAMPS_DETAILS].join(",");

export interface DpeBrut {
  numeroDpe: string;
  dateEtablissement: string;
  dateReception: string;
  dateVisite: string;
  etiquetteDpe: string;
  etiquetteGes: string;
  typeBien: string;        // maison | appartement | immeuble
  typeBatiment: string;    // valeur brute ADEME
  surface: number | null;
  periodeConstruction: string;
  adresse: string;
  numero: string;
  voie: string;
  codePostal: string;
  ville: string;
  codeInsee: string;
  identifiantBan: string;
  scoreBan: number | null; // qualité du géocodage BAN (0..1)
  lat: number | null;
  lon: number | null;
  details: Record<string, string | number | null>; // champs ADEME complémentaires
}

interface LigneAdeme {
  numero_dpe?: string;
  date_etablissement_dpe?: string;
  date_reception_dpe?: string;
  date_visite_diagnostiqueur?: string;
  etiquette_dpe?: string;
  etiquette_ges?: string;
  type_batiment?: string;
  surface_habitable_logement?: number | string;
  periode_construction?: string;
  adresse_ban?: string;
  numero_voie_ban?: string | number;
  nom_rue_ban?: string;
  code_postal_ban?: string | number;
  nom_commune_ban?: string;
  code_insee_ban?: string | number;
  identifiant_ban?: string;
  score_ban?: number | null;
  _geopoint?: string; // "lat,lon"
}

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function parseGeo(g?: string): { lat: number | null; lon: number | null } {
  if (!g || typeof g !== "string") return { lat: null, lon: null };
  const [la, lo] = g.split(",");
  return { lat: num(la), lon: num(lo) };
}

function mapLigne(r: LigneAdeme): DpeBrut | null {
  const numeroDpe = String(r.numero_dpe ?? "").trim();
  if (!numeroDpe) return null;
  const { lat, lon } = parseGeo(r._geopoint);
  const rec = r as Record<string, unknown>;
  const details: Record<string, string | number | null> = {};
  for (const k of CHAMPS_DETAILS) {
    const v = rec[k];
    if (v === undefined || v === null || v === "") continue;
    details[k] = typeof v === "number" ? v : String(v);
  }
  return {
    numeroDpe,
    dateEtablissement: String(r.date_etablissement_dpe ?? "").slice(0, 10),
    dateReception: String(r.date_reception_dpe ?? "").slice(0, 10),
    dateVisite: String(r.date_visite_diagnostiqueur ?? "").slice(0, 10),
    etiquetteDpe: String(r.etiquette_dpe ?? "").toUpperCase().slice(0, 1),
    etiquetteGes: String(r.etiquette_ges ?? "").toUpperCase().slice(0, 1),
    typeBien: typeBienDepuisAdeme(String(r.type_batiment ?? "")),
    typeBatiment: String(r.type_batiment ?? ""),
    surface: num(r.surface_habitable_logement),
    periodeConstruction: String(r.periode_construction ?? ""),
    adresse: String(r.adresse_ban ?? "").replace(/\s+/g, " ").trim(),
    numero: String(r.numero_voie_ban ?? "").trim(),
    voie: String(r.nom_rue_ban ?? "").trim(),
    codePostal: String(r.code_postal_ban ?? "").trim(),
    ville: String(r.nom_commune_ban ?? "").trim(),
    codeInsee: String(r.code_insee_ban ?? "").trim(),
    identifiantBan: String(r.identifiant_ban ?? "").trim(),
    scoreBan: num(r.score_ban),
    lat,
    lon,
    details,
  };
}

async function fetchJson(url: string, ms = 20000, retries = 2): Promise<{ results?: LigneAdeme[]; next?: string } | null> {
  let dernierStatut = 0;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(ms),
        headers: { accept: "application/json", "user-agent": "IA-Estimation/1.0 (CENTURY21 Icaza; prospection)" },
      });
      if (res.ok) return (await res.json()) as { results?: LigneAdeme[]; next?: string };
      dernierStatut = res.status;
      if (res.status === 404) return null;
    } catch { /* aléa réseau : on réessaie */ }
    if (attempt < retries) await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
  }
  if (dernierStatut) throw new Error(`ADEME a répondu ${dernierStatut}`);
  return null;
}

function clauseTypes(typesBien: string[]): string {
  const types = typesBien.filter(Boolean);
  if (types.length === 0) return "";
  const map: Record<string, string> = { maison: "maison", appartement: "appartement", immeuble: "immeuble" };
  const clauses = types.map((t) => `type_batiment:"${map[t] ?? t}"`);
  return clauses.length === 1 ? clauses[0] : `(${clauses.join(" OR ")})`;
}

/**
 * Récupère les DPE d'une commune (code INSEE) établis à partir de `depuisDate`
 * (AAAA-MM-JJ incluse), filtrés par type de bâtiment. Pagination suivie via le
 * curseur `next`, avec un plafond de sécurité. Une indisponibilité renvoie [].
 */
export async function fetchDpeCommune(
  insee: string,
  typesBien: string[],
  depuisDate: string,
  opts: { maxPages?: number; taille?: number } = {},
): Promise<DpeBrut[]> {
  if (!insee) return [];
  const maxPages = opts.maxPages ?? 40;
  const taille = opts.taille ?? 100;
  const clauses = [`code_insee_ban:"${insee}"`, clauseTypes(typesBien)].filter(Boolean);
  if (depuisDate) clauses.push(`date_etablissement_dpe:[${depuisDate} TO *]`);
  const qs = clauses.join(" AND ");

  const params = new URLSearchParams({
    size: String(taille),
    select: CHAMPS,
    sort: "-date_etablissement_dpe",
    qs,
  });
  let url: string | undefined = `${BASE}?${params.toString()}`;

  const out: DpeBrut[] = [];
  const vus = new Set<string>();
  for (let page = 0; page < maxPages && url; page++) {
    const body = await fetchJson(url);
    if (!body) { if (page === 0) throw new Error("ADEME injoignable"); break; }
    const lignes = body.results ?? [];
    if (lignes.length === 0) break;
    for (const l of lignes) {
      const d = mapLigne(l);
      if (d && !vus.has(d.numeroDpe)) { vus.add(d.numeroDpe); out.push(d); }
    }
    url = body.next;
  }
  return out;
}
