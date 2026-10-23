import { del, list, put } from "@vercel/blob";

// REGISTRE DES SINISTRES par copropriété + suivi d'avancement et pièces photo.
// Un sinistre = un meta JSON versionné (sinistres/meta/<id>~<ts>.json) + des
// photos stockées en JPEG (sinistres/photos/<id>/<photoId>.jpg). Partagé équipe.

export const STATUTS_SINISTRE = [
  "Déclaré",
  "Déclaration envoyée",
  "Expertise en attente",
  "Expertise réalisée",
  "Travaux en cours",
  "Indemnisé",
  "Clôturé",
] as const;

export const MOTIFS_SINISTRE = [
  "Inondation",
  "Catastrophe naturelle",
  "Dégât des eaux",
  "Incendie",
  "Tempête / Grêle",
  "Bris de glace",
  "Vandalisme",
  "Autre",
] as const;

export interface PhotoSinistre {
  id: string;
  nom: string;
  legende: string; // explication affichée sous la photo dans la déclaration
  addedAt: number;
}

export interface DocSinistre {
  id: string;
  nom: string;
  taille: number; // octets (après compression)
  addedAt: number;
}

export interface SuiviEntree {
  id: string;
  date: number;
  texte: string;
  statut?: string; // statut éventuellement posé à cette étape
}

export interface Sinistre {
  id: string;
  reference: string;
  coproNom: string;
  coproAdresse: string;
  coproId?: string;
  motif: string;
  dateSinistre: string; // yyyy-mm-dd
  description: string;
  statut: string;
  gravite: string; // "" | "Léger" | "Modéré" | "Grave"
  montantEstime: number | null;
  assureur: string;
  assurancePolice: string;
  assuranceContact: string;
  assuranceAdresse: string;
  signataire: string;
  qualite: string;
  poidsEnvoi: number | null; // poids de l'envoi recommandé, en grammes
  niveauReco: string;        // niveau de recommandation : R1 | R2 | R3
  mailEnvoye: boolean;       // mail à l'assureur envoyé ?
  mailEnvoyeLe: number | null;
  photos: PhotoSinistre[];
  documents: DocSinistre[];
  suivi: SuiviEntree[];
  createdAt: number;
  updatedAt: number;
}

const META_PREFIX = "sinistres/meta/";
const PHOTO_PREFIX = "sinistres/photos/";
const DOC_PREFIX = "sinistres/docs/";

const safeId = (s: string) => (s || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
const version = (p: string) => { const m = p.match(/~(\d+)\.json$/); return m ? Number(m[1]) : 0; };
const txt = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
const num = (v: unknown): number | null => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : null; };
const rid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const statutValide = (s: unknown) => ((STATUTS_SINISTRE as readonly string[]).includes(typeof s === "string" ? s : "") ? (s as string) : "Déclaré");
const motifValide = (s: unknown) => ((MOTIFS_SINISTRE as readonly string[]).includes(typeof s === "string" ? s : "") ? (s as string) : "Autre");

function normaliser(input: Partial<Sinistre>, base?: Sinistre): Sinistre {
  const now = Date.now();
  return {
    id: base?.id ?? (safeId(input.id || "") || rid()),
    reference: txt(input.reference, 60),
    coproNom: txt(input.coproNom, 200),
    coproAdresse: txt(input.coproAdresse, 300),
    coproId: txt(input.coproId, 80) || undefined,
    motif: motifValide(input.motif),
    dateSinistre: txt(input.dateSinistre, 10),
    description: txt(input.description, 5000),
    statut: statutValide(input.statut),
    gravite: txt(input.gravite, 20),
    montantEstime: num(input.montantEstime),
    assureur: txt(input.assureur, 200),
    assurancePolice: txt(input.assurancePolice, 100),
    assuranceContact: txt(input.assuranceContact, 300),
    assuranceAdresse: txt(input.assuranceAdresse, 300),
    signataire: txt(input.signataire, 120),
    qualite: txt(input.qualite, 120),
    poidsEnvoi: typeof input.poidsEnvoi === "number" && input.poidsEnvoi > 0 ? Math.round(input.poidsEnvoi) : null,
    niveauReco: (["R1", "R2", "R3"] as string[]).includes(input.niveauReco as string) ? (input.niveauReco as string) : "R1",
    mailEnvoye: input.mailEnvoye === true,
    mailEnvoyeLe: typeof input.mailEnvoyeLe === "number" ? input.mailEnvoyeLe : null,
    photos: Array.isArray(base?.photos) ? base!.photos : [],
    documents: Array.isArray(base?.documents) ? base!.documents : [],
    suivi: Array.isArray(base?.suivi) ? base!.suivi : [],
    createdAt: base?.createdAt ?? now,
    updatedAt: now,
  };
}

async function putMeta(s: Sinistre): Promise<void> {
  const nom = `${META_PREFIX}${s.id}~${s.updatedAt}.json`;
  await put(nom, JSON.stringify(s), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: `${META_PREFIX}${s.id}~`, limit: 100 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
}

export async function listSinistres(): Promise<Sinistre[]> {
  const { blobs } = await list({ prefix: META_PREFIX, limit: 1000 });
  // On garde la dernière version de chaque id.
  const parId = new Map<string, { url: string; v: number }>();
  for (const b of blobs) {
    const m = b.pathname.slice(META_PREFIX.length).match(/^(.+)~(\d+)\.json$/);
    if (!m) continue;
    const id = m[1], v = Number(m[2]);
    const cur = parId.get(id);
    if (!cur || v > cur.v) parId.set(id, { url: b.url, v });
  }
  const out: Sinistre[] = [];
  await Promise.all([...parId.values()].map(async ({ url }) => {
    try { const r = await fetch(url, { cache: "no-store" }); if (r.ok) out.push((await r.json()) as Sinistre); } catch { /* ignore */ }
  }));
  out.sort((a, b) => (b.dateSinistre || "").localeCompare(a.dateSinistre || "") || b.updatedAt - a.updatedAt);
  return out;
}

export async function getSinistre(id: string): Promise<Sinistre | null> {
  const { blobs } = await list({ prefix: `${META_PREFIX}${safeId(id)}~`, limit: 100 });
  if (blobs.length === 0) return null;
  const best = blobs.reduce((a, b) => (version(b.pathname) > version(a.pathname) ? b : a));
  try { const r = await fetch(best.url, { cache: "no-store" }); return r.ok ? ((await r.json()) as Sinistre) : null; } catch { return null; }
}

export async function createSinistre(input: Partial<Sinistre>): Promise<Sinistre> {
  const s = normaliser(input);
  if (!s.reference) s.reference = `SIN-${new Date(s.createdAt).getFullYear()}-${s.id.slice(-4).toUpperCase()}`;
  s.suivi = [{ id: rid(), date: s.createdAt, texte: "Sinistre enregistré", statut: s.statut }];
  await putMeta(s);
  return s;
}

export async function updateSinistre(id: string, input: Partial<Sinistre>): Promise<Sinistre | null> {
  const base = await getSinistre(id);
  if (!base) return null;
  // On fusionne sur la base : une mise à jour partielle (ex. poids seul) ne
  // réinitialise pas les autres champs.
  const s = normaliser({ ...base, ...input, id: base.id }, base);
  if (!s.reference) s.reference = base.reference;
  // Trace automatique d'un changement de statut dans le suivi.
  if (input.statut && input.statut !== base.statut) {
    s.suivi = [...s.suivi, { id: rid(), date: Date.now(), texte: `Statut : ${s.statut}`, statut: s.statut }];
  }
  await putMeta(s);
  return s;
}

export async function deleteSinistre(id: string): Promise<boolean> {
  const safe = safeId(id);
  const [meta, photos, docs] = await Promise.all([
    list({ prefix: `${META_PREFIX}${safe}~`, limit: 100 }),
    list({ prefix: `${PHOTO_PREFIX}${safe}/`, limit: 1000 }),
    list({ prefix: `${DOC_PREFIX}${safe}/`, limit: 1000 }),
  ]);
  const urls = [...meta.blobs, ...photos.blobs, ...docs.blobs].map((b) => b.url);
  if (urls.length > 0) await del(urls);
  return urls.length > 0;
}

// --- Suivi (journal d'avancement) ---
export async function addSuivi(id: string, texte: string, statut?: string): Promise<Sinistre | null> {
  const base = await getSinistre(id);
  if (!base) return null;
  const entree: SuiviEntree = { id: rid(), date: Date.now(), texte: txt(texte, 2000), statut: statut ? statutValide(statut) : undefined };
  const s: Sinistre = { ...base, suivi: [...base.suivi, entree], statut: entree.statut ?? base.statut, updatedAt: Date.now() };
  await putMeta(s);
  return s;
}

// --- Photos ---
export async function addPhoto(id: string, photo: { nom: string; legende: string; data: string }): Promise<Sinistre | null> {
  const base = await getSinistre(id);
  if (!base) return null;
  const photoId = rid();
  const octets = Buffer.from(photo.data, "base64");
  await put(`${PHOTO_PREFIX}${base.id}/${photoId}.jpg`, octets, { access: "public", addRandomSuffix: false, contentType: "image/jpeg" });
  const p: PhotoSinistre = { id: photoId, nom: txt(photo.nom, 120) || "Photo", legende: txt(photo.legende, 500), addedAt: Date.now() };
  const s: Sinistre = { ...base, photos: [...base.photos, p], updatedAt: Date.now() };
  await putMeta(s);
  return s;
}

export async function updatePhotoLegende(id: string, photoId: string, nom: string, legende: string): Promise<Sinistre | null> {
  const base = await getSinistre(id);
  if (!base) return null;
  const photos = base.photos.map((p) => (p.id === photoId ? { ...p, nom: txt(nom, 120) || p.nom, legende: txt(legende, 500) } : p));
  const s: Sinistre = { ...base, photos, updatedAt: Date.now() };
  await putMeta(s);
  return s;
}

export async function deletePhoto(id: string, photoId: string): Promise<Sinistre | null> {
  const base = await getSinistre(id);
  if (!base) return null;
  const { blobs } = await list({ prefix: `${PHOTO_PREFIX}${safeId(id)}/${safeId(photoId)}.jpg`, limit: 1 });
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
  const s: Sinistre = { ...base, photos: base.photos.filter((p) => p.id !== photoId), updatedAt: Date.now() };
  await putMeta(s);
  return s;
}

export async function getPhotoBytes(id: string, photoId: string): Promise<ArrayBuffer | null> {
  const { blobs } = await list({ prefix: `${PHOTO_PREFIX}${safeId(id)}/${safeId(photoId)}.jpg`, limit: 1 });
  if (blobs.length === 0) return null;
  try { const r = await fetch(blobs[0].url, { cache: "no-store" }); return r.ok ? await r.arrayBuffer() : null; } catch { return null; }
}

// --- Documents (PDF) ---
export async function addDocument(id: string, doc: { nom: string; data: string }): Promise<Sinistre | null> {
  const base = await getSinistre(id);
  if (!base) return null;
  const docId = rid();
  const octets = Buffer.from(doc.data, "base64");
  await put(`${DOC_PREFIX}${base.id}/${docId}.pdf`, octets, { access: "public", addRandomSuffix: false, contentType: "application/pdf" });
  let nom = txt(doc.nom, 160) || "Document";
  if (!/\.pdf$/i.test(nom)) nom = `${nom}.pdf`;
  const d: DocSinistre = { id: docId, nom, taille: octets.length, addedAt: Date.now() };
  const s: Sinistre = { ...base, documents: [...base.documents, d], updatedAt: Date.now() };
  await putMeta(s);
  return s;
}

export async function deleteDocument(id: string, docId: string): Promise<Sinistre | null> {
  const base = await getSinistre(id);
  if (!base) return null;
  const { blobs } = await list({ prefix: `${DOC_PREFIX}${safeId(id)}/${safeId(docId)}.pdf`, limit: 1 });
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
  const s: Sinistre = { ...base, documents: base.documents.filter((x) => x.id !== docId), updatedAt: Date.now() };
  await putMeta(s);
  return s;
}

export async function getDocBytes(id: string, docId: string): Promise<ArrayBuffer | null> {
  const { blobs } = await list({ prefix: `${DOC_PREFIX}${safeId(id)}/${safeId(docId)}.pdf`, limit: 1 });
  if (blobs.length === 0) return null;
  try { const r = await fetch(blobs[0].url, { cache: "no-store" }); return r.ok ? await r.arrayBuffer() : null; } catch { return null; }
}
