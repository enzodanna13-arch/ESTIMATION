import { del, list, put } from "@vercel/blob";
import { fetchDpeCommune, type DpeBrut } from "./ademe";

// DPE FRAIS d'une commune : les diagnostics récents (tous types de biens). Un DPE
// récent = un bien qui se prépare souvent à la vente. On s'en sert pour croiser
// avec les recherches des acquéreurs (service privé direction).

export interface FreshDpe {
  numeroDpe: string;
  date: string;
  etiquetteDpe: string;
  etiquetteGes: string;
  typeBien: string;        // maison | appartement | immeuble
  surface: number | null;
  etage: string;
  residence: string;
  adresse: string;
  numero: string;
  voie: string;
  ville: string;
  codePostal: string;
  lat: number | null;
  lon: number | null;
  details: Record<string, string | number | null>;
}
export interface DpeFraisDataset { insee: string; depuis: string; dpes: FreshDpe[]; updatedAt: number; }

const RESIDENCE_GENERIQUE = new Set(["", "batiment", "bâtiment", "immeuble", "-", "sans", "na", "nc", "appartement"]);
const txt = (v: unknown) => (v === null || v === undefined ? "" : String(v)).trim();

function toFresh(d: DpeBrut): FreshDpe {
  const residence = txt(d.details.nom_residence);
  return {
    numeroDpe: d.numeroDpe,
    date: d.dateEtablissement,
    etiquetteDpe: d.etiquetteDpe,
    etiquetteGes: d.etiquetteGes,
    typeBien: d.typeBien,
    surface: d.surface,
    etage: txt(d.details.numero_etage_appartement),
    residence: RESIDENCE_GENERIQUE.has(residence.toLowerCase()) ? "" : residence,
    adresse: d.adresse,
    numero: d.numero,
    voie: d.voie,
    ville: d.ville,
    codePostal: d.codePostal,
    lat: d.lat,
    lon: d.lon,
    details: d.details,
  };
}

export async function computeDpeFrais(insee: string, depuisDate: string): Promise<DpeFraisDataset> {
  const bruts = await fetchDpeCommune(insee, ["maison", "appartement", "immeuble"], depuisDate, { maxPages: 60, taille: 100 }).catch(() => [] as DpeBrut[]);
  const dpes = bruts.map(toFresh).sort((a, b) => b.date.localeCompare(a.date));
  return { insee, depuis: depuisDate, dpes, updatedAt: Date.now() };
}

// --- Cache Blob ---
const PREFIX = "dpefrais~";
const version = (p: string) => { const m = p.match(/~(\d+)\.json$/); return m ? Number(m[1]) : 0; };
export async function getDpeFraisCache(): Promise<DpeFraisDataset | null> {
  const { blobs } = await list({ prefix: PREFIX, limit: 50 });
  if (blobs.length === 0) return null;
  let best = blobs[0];
  for (const b of blobs) if (version(b.pathname) > version(best.pathname)) best = b;
  try { const r = await fetch(best.url, { cache: "no-store" }); return r.ok ? ((await r.json()) as DpeFraisDataset) : null; } catch { return null; }
}
export async function saveDpeFraisCache(ds: DpeFraisDataset): Promise<void> {
  const nom = `${PREFIX}${ds.updatedAt}.json`;
  await put(nom, JSON.stringify(ds), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: PREFIX, limit: 50 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
}
