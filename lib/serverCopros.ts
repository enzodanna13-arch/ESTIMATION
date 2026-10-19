import { del, list, put } from "@vercel/blob";
import { fetchDpeCommune, type DpeBrut } from "./ademe";

// PROSPECTION COPROPRIÉTÉS (appartements) : à partir du Registre National
// d'Immatriculation des Copropriétés (RNIC, open data ANAH via l'API tabulaire
// data.gouv.fr), on liste les copropriétés d'une commune au-dessus d'un seuil de
// lots, puis on les CROISE avec les derniers DPE réalisés (ADEME) par proximité
// géographique — pour repérer les immeubles « actifs » (diagnostics récents =
// signal de mise en vente) et afficher toutes les infos du diag.

// Resource « Actualisation quotidienne » du RNIC (CSV indexé, API tabulaire).
const RNIC_RESOURCE = process.env.RNIC_RESOURCE_ID ?? "3ea8e2c3-0038-464a-b17e-cd5c91f65ce2";
const RNIC_BASE = `https://tabular-api.data.gouv.fr/api/resources/${RNIC_RESOURCE}/data/`;

export interface DpeCopro {
  numeroDpe: string;
  date: string;
  etiquetteDpe: string;
  etiquetteGes: string;
  typeBien: string;
  surface: number | null;
  adresse: string;
  etage: string;      // numéro d'étage de l'appartement (si connu)
  residence: string;  // nom de résidence / bâtiment (si spécifique)
  precis: boolean;    // localisation fine connue (étage et/ou entrée/bâtiment)
  details: Record<string, string | number | null>;
}
export interface Copro {
  id: string;
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  lotsTotal: number;
  lotsHabitation: number;
  periodeConstruction: string;
  typeSyndic: string;
  syndic: string;
  mandatEnCours: string;
  dateFinMandat: string;
  cibleSyndic: boolean;   // opportunité de prospection syndic
  motifSyndic: string;    // pourquoi (bénévole, fin de mandat…)
  parcelle: string;
  dateImmatriculation: string;
  lat: number | null;
  lon: number | null;
  dpeCount: number;
  dpeCountPrecis: number; // DPE avec localisation fine (étage / entrée)
  dernierDpe: DpeCopro | null;
  dpes: DpeCopro[];
}
export interface CoproDataset {
  commune: string;
  insee: string;
  minLots: number;
  copros: Copro[];
  nbDpeIndexes: number;
  updatedAt: number;
}

const txt = (v: unknown) => (v === null || v === undefined ? "" : String(v)).trim();
const n0 = (v: unknown) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
const numOrNull = (v: unknown) => { const n = Number(v); return Number.isFinite(n) ? n : null; };

// Parse une date FR (JJ/MM/AAAA) ou ISO (AAAA-MM-JJ) → timestamp ou null.
function parseDate(s: string): number | null {
  if (!s) return null;
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]), 12).getTime();
  const fr = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/);
  if (fr) return new Date(Number(fr[3]), Number(fr[2]) - 1, Number(fr[1]), 12).getTime();
  return null;
}

// Une copropriété est-elle une CIBLE pour une offre de syndic, et pourquoi ?
// - syndic bénévole / coopératif / non professionnel → facile à convaincre ;
// - fin de mandat proche (≤ 6 mois) → moment de la mise en concurrence à l'AG ;
// - aucun mandat en cours.
function cibleSyndic(typeSyndic: string, mandatEnCours: string, dateFinMandat: string): string {
  const t = typeSyndic.toLowerCase();
  if (t.includes("coop")) return "Syndic coopératif";
  if (t.includes("bénév") || t.includes("benev")) return "Syndic bénévole";
  if (t && !t.includes("profession")) return "Syndic non professionnel";
  const fin = parseDate(dateFinMandat);
  if (fin && fin <= Date.now() + 183 * 86400000 && fin >= Date.now() - 365 * 86400000) {
    return fin < Date.now() ? "Mandat expiré" : "Fin de mandat proche";
  }
  const m = mandatEnCours.toLowerCase();
  if (m === "non" || m === "false" || m === "0" || (m === "" && !dateFinMandat)) return "Sans mandat en cours";
  return "";
}

async function fetchJson(url: string, ms = 25000, retries = 2): Promise<Record<string, unknown> | null> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(ms), headers: { accept: "application/json", "user-agent": "IA-Estimation/1.0 (CENTURY21 Icaza; copros)" } });
      if (res.ok) return (await res.json()) as Record<string, unknown>;
      if (res.status === 404) return null;
    } catch { /* réseau : on réessaie */ }
    if (i < retries) await new Promise((r) => setTimeout(r, 600 * (i + 1)));
  }
  return null;
}

// Récupère les copropriétés d'une commune (INSEE) avec plus de `minLots` lots.
async function fetchCoprosRNC(insee: string, minLots: number): Promise<Copro[]> {
  const copros: Copro[] = [];
  const pageSize = 50;
  for (let page = 1; page <= 40; page++) {
    const url = `${RNIC_BASE}?commune__exact=${encodeURIComponent(insee)}&nombre_total_lots__greater=${minLots}&page=${page}&page_size=${pageSize}`;
    const body = await fetchJson(url);
    const rows = (body?.data as Record<string, unknown>[] | undefined) ?? [];
    if (rows.length === 0) break;
    for (const r of rows) {
      const typeSyndic = txt(r.type_syndic);
      const mandatEnCours = txt(r.mandat_en_cours);
      const dateFinMandat = txt(r.date_fin_dernier_mandat).slice(0, 10);
      const motifSyndic = cibleSyndic(typeSyndic, mandatEnCours, dateFinMandat);
      copros.push({
        id: txt(r.numero_immatriculation) || `${txt(r.nom_usage_copropriete)}-${copros.length}`,
        nom: txt(r.nom_usage_copropriete) || "Copropriété",
        adresse: txt(r.adresse_reference),
        codePostal: txt(r.code_postal_adresse),
        ville: txt(r.commune_adresse),
        lotsTotal: n0(r.nombre_total_lots),
        lotsHabitation: n0(r.nombre_lots_habitation),
        periodeConstruction: txt(r.periode_construction),
        typeSyndic,
        syndic: txt(r.raison_sociale_representant_legal),
        mandatEnCours,
        dateFinMandat,
        cibleSyndic: !!motifSyndic,
        motifSyndic,
        parcelle: txt(r.reference_cadastrale_1),
        dateImmatriculation: txt(r.date_immatriculation).slice(0, 10),
        lat: numOrNull(r.latitude),
        lon: numOrNull(r.longitude),
        dpeCount: 0,
        dpeCountPrecis: 0,
        dernierDpe: null,
        dpes: [],
      });
    }
    if (rows.length < pageSize) break;
  }
  return copros;
}

// Distance approximative (mètres) entre deux points géographiques.
function distanceM(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const R = 6371000;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLon = ((bLon - aLon) * Math.PI) / 180;
  const la1 = (aLat * Math.PI) / 180, la2 = (bLat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

const RAYON_M = 90; // rayon de rapprochement copro ↔ DPE
const RESIDENCE_GENERIQUE = new Set(["", "batiment", "bâtiment", "immeuble", "-", "sans", "na", "nc", "appartement"]);
const dpeCopro = (d: DpeBrut): DpeCopro => {
  const etageRaw = txt(d.details.numero_etage_appartement);
  const residenceRaw = txt(d.details.nom_residence);
  const residenceSpecifique = !RESIDENCE_GENERIQUE.has(residenceRaw.toLowerCase());
  const etageConnu = etageRaw !== "" && Number.isFinite(Number(etageRaw)) && Number(etageRaw) > 0;
  return {
    numeroDpe: d.numeroDpe,
    date: d.dateEtablissement,
    etiquetteDpe: d.etiquetteDpe,
    etiquetteGes: d.etiquetteGes,
    typeBien: d.typeBien,
    surface: d.surface,
    adresse: d.adresse,
    etage: etageRaw,
    residence: residenceSpecifique ? residenceRaw : "",
    precis: etageConnu || residenceSpecifique,
    details: d.details,
  };
};

// Croise les copros avec les DPE par proximité géographique (grille spatiale).
function croiser(copros: Copro[], dpes: DpeBrut[]): void {
  const cle = (lat: number, lon: number) => `${Math.round(lat * 1000)},${Math.round(lon * 1000)}`;
  const grille = new Map<string, DpeBrut[]>();
  for (const d of dpes) {
    if (d.lat == null || d.lon == null) continue;
    const k = cle(d.lat, d.lon);
    (grille.get(k) ?? grille.set(k, []).get(k)!).push(d);
  }
  for (const c of copros) {
    if (c.lat == null || c.lon == null) continue;
    const baseLat = Math.round(c.lat * 1000), baseLon = Math.round(c.lon * 1000);
    const proches: { d: DpeBrut; dist: number }[] = [];
    for (let dla = -1; dla <= 1; dla++) {
      for (let dlo = -1; dlo <= 1; dlo++) {
        const bucket = grille.get(`${baseLat + dla},${baseLon + dlo}`);
        if (!bucket) continue;
        for (const d of bucket) {
          const dist = distanceM(c.lat, c.lon, d.lat!, d.lon!);
          if (dist <= RAYON_M) proches.push({ d, dist });
        }
      }
    }
    const convertis = proches.map((p) => dpeCopro(p.d));
    // Priorité aux diags localisés (étage / entrée connus), puis aux plus récents.
    convertis.sort((a, b) => Number(b.precis) - Number(a.precis) || b.date.localeCompare(a.date));
    c.dpeCount = convertis.length;
    c.dpeCountPrecis = convertis.filter((d) => d.precis).length;
    c.dpes = convertis.slice(0, 40);
    c.dernierDpe = c.dpes[0] ?? null;
  }
}

export async function computeCoproDataset(insee: string, minLots: number, depuisDate: string): Promise<CoproDataset> {
  const [copros, dpes] = await Promise.all([
    fetchCoprosRNC(insee, minLots),
    fetchDpeCommune(insee, ["appartement", "immeuble"], depuisDate, { maxPages: 60, taille: 100 }).catch(() => [] as DpeBrut[]),
  ]);
  croiser(copros, dpes);
  // Tri : copros avec diagnostics LOCALISÉS d'abord, puis diag récent, puis lots.
  copros.sort((a, b) =>
    Number(b.dpeCountPrecis > 0) - Number(a.dpeCountPrecis > 0)
    || (b.dernierDpe?.date ?? "").localeCompare(a.dernierDpe?.date ?? "")
    || b.lotsTotal - a.lotsTotal);
  return { commune: copros[0]?.ville || "Martigues", insee, minLots, copros, nbDpeIndexes: dpes.length, updatedAt: Date.now() };
}

// --- Cache Blob (recalcul coûteux : on garde le dernier calcul) ---
// v2 : ajout de la localisation fine (étage / entrée) → on repart d'un cache neuf.
const PREFIX = "coprosv3/";
const version = (p: string) => { const m = p.match(/~(\d+)\.json$/); return m ? Number(m[1]) : 0; };

export async function getCoprosCache(insee: string): Promise<CoproDataset | null> {
  const { blobs } = await list({ prefix: `${PREFIX}${insee}~`, limit: 50 });
  if (blobs.length === 0) return null;
  let best = blobs[0];
  for (const b of blobs) if (version(b.pathname) > version(best.pathname)) best = b;
  try { const r = await fetch(best.url, { cache: "no-store" }); return r.ok ? ((await r.json()) as CoproDataset) : null; } catch { return null; }
}

export async function saveCoprosCache(ds: CoproDataset): Promise<void> {
  const nom = `${PREFIX}${ds.insee}~${ds.updatedAt}.json`;
  await put(nom, JSON.stringify(ds), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: `${PREFIX}${ds.insee}~`, limit: 50 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
}
