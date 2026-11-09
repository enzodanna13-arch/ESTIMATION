import { del, list, put } from "@vercel/blob";
import type { MandatVente } from "./mandatsVenteTypes";
import { STATUTS_MANDAT, TYPES_MANDAT } from "./mandatsVenteTypes";

// Stockage des mandats de vente : un meta JSON versionné par mandat
// (mandats/meta/<id>~<ts>.json). Partagé équipe.

const META_PREFIX = "mandats/meta/";

const safeId = (s: string) => (s || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
const version = (p: string) => { const m = p.match(/~(\d+)\.json$/); return m ? Number(m[1]) : 0; };
const txt = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
const numOrNull = (v: unknown): number | null => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : null; };
const strArr = (v: unknown, max = 20): string[] => (Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, max) as string[] : []);
const rid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
const typeValide = (v: unknown) => ((TYPES_MANDAT as readonly string[]).includes(typeof v === "string" ? v : "") ? (v as string) : "Exclusif");
const statutValide = (v: unknown) => ((STATUTS_MANDAT as readonly string[]).includes(typeof v === "string" ? v : "") ? (v as string) : "Actif");

function normaliser(input: Partial<MandatVente>, base?: MandatVente): MandatVente {
  const now = Date.now();
  return {
    id: base?.id ?? (safeId(input.id || "") || rid()),
    reference: txt(input.reference, 60),
    type: typeValide(input.type),
    statut: statutValide(input.statut),
    negociateur: txt(input.negociateur, 120),
    vendeurNom: txt(input.vendeurNom, 200),
    vendeurTel: txt(input.vendeurTel, 40),
    vendeurEmail: txt(input.vendeurEmail, 200),
    adresse: txt(input.adresse, 300),
    codePostal: txt(input.codePostal, 10),
    ville: txt(input.ville, 120),
    quartier: txt(input.quartier, 160),
    typeBien: txt(input.typeBien, 40) || "appartement",
    prix: numOrNull(input.prix),
    surface: numOrNull(input.surface),
    nbPieces: numOrNull(input.nbPieces),
    nbChambres: numOrNull(input.nbChambres),
    etage: txt(input.etage, 20),
    ascenseur: input.ascenseur === true,
    exterieurs: strArr(input.exterieurs),
    garage: input.garage === true,
    stationnement: input.stationnement === true,
    cave: input.cave === true,
    dpe: txt(input.dpe, 2).toUpperCase(),
    travaux: input.travaux === true,
    dateMandat: txt(input.dateMandat, 10),
    dateFin: txt(input.dateFin, 10),
    honoraires: numOrNull(input.honoraires),
    notes: txt(input.notes, 4000),
    createdAt: base?.createdAt ?? now,
    updatedAt: now,
  };
}

async function putMeta(m: MandatVente): Promise<void> {
  const nom = `${META_PREFIX}${m.id}~${m.updatedAt}.json`;
  await put(nom, JSON.stringify(m), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: `${META_PREFIX}${m.id}~`, limit: 100 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
}

export async function listMandatsServer(): Promise<MandatVente[]> {
  const { blobs } = await list({ prefix: META_PREFIX, limit: 1000 });
  const parId = new Map<string, { url: string; v: number }>();
  for (const b of blobs) {
    const mm = b.pathname.slice(META_PREFIX.length).match(/^(.+)~(\d+)\.json$/);
    if (!mm) continue;
    const id = mm[1], v = Number(mm[2]);
    const cur = parId.get(id);
    if (!cur || v > cur.v) parId.set(id, { url: b.url, v });
  }
  const out: MandatVente[] = [];
  await Promise.all([...parId.values()].map(async ({ url }) => {
    try { const r = await fetch(url, { cache: "no-store" }); if (r.ok) out.push((await r.json()) as MandatVente); } catch { /* ignore */ }
  }));
  out.sort((a, b) => b.updatedAt - a.updatedAt);
  return out;
}

export async function getMandatServer(id: string): Promise<MandatVente | null> {
  const { blobs } = await list({ prefix: `${META_PREFIX}${safeId(id)}~`, limit: 100 });
  if (blobs.length === 0) return null;
  const best = blobs.reduce((a, b) => (version(b.pathname) > version(a.pathname) ? b : a));
  try { const r = await fetch(best.url, { cache: "no-store" }); return r.ok ? ((await r.json()) as MandatVente) : null; } catch { return null; }
}

export async function createMandatServer(input: Partial<MandatVente>): Promise<MandatVente> {
  const m = normaliser(input);
  if (!m.reference) m.reference = `MDT-${new Date(m.createdAt).getFullYear()}-${m.id.slice(-4).toUpperCase()}`;
  await putMeta(m);
  return m;
}

export async function updateMandatServer(id: string, input: Partial<MandatVente>): Promise<MandatVente | null> {
  const base = await getMandatServer(id);
  if (!base) return null;
  const m = normaliser({ ...base, ...input, id: base.id }, base);
  if (!m.reference) m.reference = base.reference;
  await putMeta(m);
  return m;
}

export async function deleteMandatServer(id: string): Promise<boolean> {
  const { blobs } = await list({ prefix: `${META_PREFIX}${safeId(id)}~`, limit: 100 });
  const urls = blobs.map((b) => b.url);
  if (urls.length > 0) await del(urls);
  return urls.length > 0;
}
