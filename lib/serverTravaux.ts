import { del, list, put } from "@vercel/blob";
import type { DossierTravaux, LigneTravaux, PhotoTravaux, UniteTravaux } from "./travauxBareme";

// DOSSIERS TRAVAUX : chiffrage des travaux à réaliser dans un logement, avec
// photos d'origine + descriptif « avant / après » et devis estimatif.
// Un dossier = un meta JSON versionné (travaux/meta/<id>~<ts>.json) + des
// photos JPEG (travaux/photos/<id>/<photoId>.jpg). Partagé équipe.

const META_PREFIX = "travaux/meta/";
const PHOTO_PREFIX = "travaux/photos/";

const UNITES: UniteTravaux[] = ["m²", "ml", "u", "forfait", "h", "m³"];

const safeId = (s: string) => (s || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
const version = (p: string) => { const m = p.match(/~(\d+)\.json$/); return m ? Number(m[1]) : 0; };
const txt = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
const numPos = (v: unknown): number => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : 0; };
const numOrNull = (v: unknown): number | null => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : null; };
const unite = (v: unknown): UniteTravaux => (UNITES.includes(v as UniteTravaux) ? (v as UniteTravaux) : "u");
const rid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

function normLigne(l: Partial<LigneTravaux>): LigneTravaux {
  return {
    id: safeId(l.id || "") || rid(),
    piece: txt(l.piece, 120),
    posteId: txt(l.posteId, 60),
    libelle: txt(l.libelle, 300),
    unite: unite(l.unite),
    quantite: numPos(l.quantite),
    prixUnitaire: numPos(l.prixUnitaire),
  };
}

function normPhoto(p: Partial<PhotoTravaux>): PhotoTravaux {
  return {
    id: safeId(p.id || "") || rid(),
    nom: txt(p.nom, 120) || "Photo",
    piece: txt(p.piece, 120),
    etat: txt(p.etat, 1000),
    legendeAvant: txt(p.legendeAvant, 600),
    legendeApres: txt(p.legendeApres, 1200),
    addedAt: typeof p.addedAt === "number" ? p.addedAt : Date.now(),
  };
}

function normaliser(input: Partial<DossierTravaux>, base?: DossierTravaux): DossierTravaux {
  const now = Date.now();
  return {
    id: base?.id ?? (safeId(input.id || "") || rid()),
    reference: txt(input.reference, 60),
    adresse: txt(input.adresse, 300),
    codePostal: txt(input.codePostal, 10),
    ville: txt(input.ville, 120),
    typeBien: txt(input.typeBien, 60),
    surface: numOrNull(input.surface),
    nbPieces: numOrNull(input.nbPieces),
    clientNom: txt(input.clientNom, 200),
    negociateur: txt(input.negociateur, 120),
    contexte: txt(input.contexte, 3000),
    syntheseIA: txt(input.syntheseIA, 6000),
    // Photos et lignes : on part de la base lors d'un merge, sinon de l'input
    // (création) ; les photos sont gérées par les routes dédiées.
    photos: Array.isArray(base?.photos)
      ? base!.photos
      : Array.isArray(input.photos) ? input.photos.map(normPhoto) : [],
    lignes: Array.isArray(input.lignes) ? input.lignes.map(normLigne) : Array.isArray(base?.lignes) ? base!.lignes : [],
    margeAlea: Math.max(0, Math.min(50, Number(input.margeAlea) || 0)),
    createdAt: base?.createdAt ?? now,
    updatedAt: now,
  };
}

async function putMeta(d: DossierTravaux): Promise<void> {
  const nom = `${META_PREFIX}${d.id}~${d.updatedAt}.json`;
  await put(nom, JSON.stringify(d), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: `${META_PREFIX}${d.id}~`, limit: 100 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
}

export async function listTravaux(): Promise<DossierTravaux[]> {
  const { blobs } = await list({ prefix: META_PREFIX, limit: 1000 });
  const parId = new Map<string, { url: string; v: number }>();
  for (const b of blobs) {
    const m = b.pathname.slice(META_PREFIX.length).match(/^(.+)~(\d+)\.json$/);
    if (!m) continue;
    const id = m[1], v = Number(m[2]);
    const cur = parId.get(id);
    if (!cur || v > cur.v) parId.set(id, { url: b.url, v });
  }
  const out: DossierTravaux[] = [];
  await Promise.all([...parId.values()].map(async ({ url }) => {
    try { const r = await fetch(url, { cache: "no-store" }); if (r.ok) out.push((await r.json()) as DossierTravaux); } catch { /* ignore */ }
  }));
  out.sort((a, b) => b.updatedAt - a.updatedAt);
  return out;
}

export async function getTravaux(id: string): Promise<DossierTravaux | null> {
  const { blobs } = await list({ prefix: `${META_PREFIX}${safeId(id)}~`, limit: 100 });
  if (blobs.length === 0) return null;
  const best = blobs.reduce((a, b) => (version(b.pathname) > version(a.pathname) ? b : a));
  try { const r = await fetch(best.url, { cache: "no-store" }); return r.ok ? ((await r.json()) as DossierTravaux) : null; } catch { return null; }
}

export async function createTravaux(input: Partial<DossierTravaux>): Promise<DossierTravaux> {
  const d = normaliser(input);
  if (!d.reference) d.reference = `TRV-${new Date(d.createdAt).getFullYear()}-${d.id.slice(-4).toUpperCase()}`;
  await putMeta(d);
  return d;
}

export async function updateTravaux(id: string, input: Partial<DossierTravaux>): Promise<DossierTravaux | null> {
  const base = await getTravaux(id);
  if (!base) return null;
  // Fusion partielle : seuls les champs fournis changent, photos préservées.
  const d = normaliser({ ...base, ...input, id: base.id, photos: undefined }, base);
  if (!d.reference) d.reference = base.reference;
  await putMeta(d);
  return d;
}

export async function deleteTravaux(id: string): Promise<boolean> {
  const safe = safeId(id);
  const [meta, photos] = await Promise.all([
    list({ prefix: `${META_PREFIX}${safe}~`, limit: 100 }),
    list({ prefix: `${PHOTO_PREFIX}${safe}/`, limit: 1000 }),
  ]);
  const urls = [...meta.blobs, ...photos.blobs].map((b) => b.url);
  if (urls.length > 0) await del(urls);
  return urls.length > 0;
}

// ---- Photos ----
export async function addPhoto(
  id: string,
  photo: { nom: string; piece: string; etat: string; legendeAvant: string; legendeApres: string; data: string },
): Promise<DossierTravaux | null> {
  const base = await getTravaux(id);
  if (!base) return null;
  const photoId = rid();
  const octets = Buffer.from(photo.data, "base64");
  await put(`${PHOTO_PREFIX}${base.id}/${photoId}.jpg`, octets, { access: "public", addRandomSuffix: false, contentType: "image/jpeg" });
  const p = normPhoto({ id: photoId, nom: photo.nom, piece: photo.piece, etat: photo.etat, legendeAvant: photo.legendeAvant, legendeApres: photo.legendeApres, addedAt: Date.now() });
  const d: DossierTravaux = { ...base, photos: [...base.photos, p], updatedAt: Date.now() };
  await putMeta(d);
  return d;
}

export async function updatePhoto(
  id: string,
  photoId: string,
  champs: { nom?: string; piece?: string; etat?: string; legendeAvant?: string; legendeApres?: string },
): Promise<DossierTravaux | null> {
  const base = await getTravaux(id);
  if (!base) return null;
  const photos = base.photos.map((p) =>
    p.id === photoId
      ? normPhoto({ ...p, ...Object.fromEntries(Object.entries(champs).filter(([, v]) => typeof v === "string")) })
      : p,
  );
  const d: DossierTravaux = { ...base, photos, updatedAt: Date.now() };
  await putMeta(d);
  return d;
}

export async function deletePhoto(id: string, photoId: string): Promise<DossierTravaux | null> {
  const base = await getTravaux(id);
  if (!base) return null;
  const { blobs } = await list({ prefix: `${PHOTO_PREFIX}${safeId(id)}/${safeId(photoId)}.jpg`, limit: 1 });
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
  const d: DossierTravaux = { ...base, photos: base.photos.filter((p) => p.id !== photoId), updatedAt: Date.now() };
  await putMeta(d);
  return d;
}

export async function getPhotoBytes(id: string, photoId: string): Promise<ArrayBuffer | null> {
  const { blobs } = await list({ prefix: `${PHOTO_PREFIX}${safeId(id)}/${safeId(photoId)}.jpg`, limit: 1 });
  if (blobs.length === 0) return null;
  try { const r = await fetch(blobs[0].url, { cache: "no-store" }); return r.ok ? await r.arrayBuffer() : null; } catch { return null; }
}
