import { del, list, put } from "@vercel/blob";

// SUIVI DES RECOMMANDÉS REÇUS par les gestionnaires : chaque recommandé scanné
// devient une tâche avec un statut et un journal de suivi. Scans (PDF/images)
// stockés sur Blob, métadonnées en JSON versionné (partagé équipe).

export const STATUTS_RECO = ["À traiter", "En cours", "En attente de réponse", "Traité", "Clôturé"] as const;
export const PRIORITES_RECO = ["Normale", "Haute", "Urgente"] as const;

export interface ScanPiece { id: string; nom: string; type: "pdf" | "image"; addedAt: number; }
export interface SuiviEntree { id: string; date: number; texte: string; statut?: string; }

export interface Recommande {
  id: string;
  reference: string;
  objet: string;
  expediteur: string;
  gestionnaire: string;
  copropriete: string;
  dateReception: string; // yyyy-mm-dd
  echeance: string;      // yyyy-mm-dd ou ""
  priorite: string;
  statut: string;
  notes: string;
  scans: ScanPiece[];
  suivi: SuiviEntree[];
  createdAt: number;
  updatedAt: number;
}

const META_PREFIX = "recommandes/meta/";
const SCAN_PREFIX = "recommandes/scans/";

const safeId = (s: string) => (s || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
const version = (p: string) => { const m = p.match(/~(\d+)\.json$/); return m ? Number(m[1]) : 0; };
const txt = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
const rid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
const statutValide = (s: unknown) => ((STATUTS_RECO as readonly string[]).includes(typeof s === "string" ? s : "") ? (s as string) : "À traiter");
const prioriteValide = (s: unknown) => ((PRIORITES_RECO as readonly string[]).includes(typeof s === "string" ? s : "") ? (s as string) : "Normale");

function normaliser(input: Partial<Recommande>, base?: Recommande): Recommande {
  const now = Date.now();
  return {
    id: base?.id ?? (safeId(input.id || "") || rid()),
    reference: txt(input.reference, 60),
    objet: txt(input.objet, 300),
    expediteur: txt(input.expediteur, 200),
    gestionnaire: txt(input.gestionnaire, 120),
    copropriete: txt(input.copropriete, 200),
    dateReception: txt(input.dateReception, 10),
    echeance: txt(input.echeance, 10),
    priorite: prioriteValide(input.priorite),
    statut: statutValide(input.statut),
    notes: txt(input.notes, 3000),
    scans: Array.isArray(base?.scans) ? base!.scans : [],
    suivi: Array.isArray(base?.suivi) ? base!.suivi : [],
    createdAt: base?.createdAt ?? now,
    updatedAt: now,
  };
}

async function putMeta(r: Recommande): Promise<void> {
  const nom = `${META_PREFIX}${r.id}~${r.updatedAt}.json`;
  await put(nom, JSON.stringify(r), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: `${META_PREFIX}${r.id}~`, limit: 100 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
}

export async function listRecommandes(): Promise<Recommande[]> {
  const { blobs } = await list({ prefix: META_PREFIX, limit: 1000 });
  const parId = new Map<string, { url: string; v: number }>();
  for (const b of blobs) {
    const m = b.pathname.slice(META_PREFIX.length).match(/^(.+)~(\d+)\.json$/);
    if (!m) continue;
    const id = m[1], v = Number(m[2]);
    const cur = parId.get(id);
    if (!cur || v > cur.v) parId.set(id, { url: b.url, v });
  }
  const out: Recommande[] = [];
  await Promise.all([...parId.values()].map(async ({ url }) => {
    try { const r = await fetch(url, { cache: "no-store" }); if (r.ok) out.push((await r.json()) as Recommande); } catch { /* ignore */ }
  }));
  out.sort((a, b) => (b.dateReception || "").localeCompare(a.dateReception || "") || b.updatedAt - a.updatedAt);
  return out;
}

export async function getRecommande(id: string): Promise<Recommande | null> {
  const { blobs } = await list({ prefix: `${META_PREFIX}${safeId(id)}~`, limit: 100 });
  if (blobs.length === 0) return null;
  const best = blobs.reduce((a, b) => (version(b.pathname) > version(a.pathname) ? b : a));
  try { const r = await fetch(best.url, { cache: "no-store" }); return r.ok ? ((await r.json()) as Recommande) : null; } catch { return null; }
}

export async function createRecommande(input: Partial<Recommande>): Promise<Recommande> {
  const r = normaliser(input);
  if (!r.reference) r.reference = `REC-${new Date(r.createdAt).getFullYear()}-${r.id.slice(-4).toUpperCase()}`;
  if (!r.dateReception) r.dateReception = new Date(r.createdAt).toISOString().slice(0, 10);
  r.suivi = [{ id: rid(), date: r.createdAt, texte: "Recommandé enregistré", statut: r.statut }];
  await putMeta(r);
  return r;
}

export async function updateRecommande(id: string, input: Partial<Recommande>): Promise<Recommande | null> {
  const base = await getRecommande(id);
  if (!base) return null;
  const r = normaliser({ ...base, ...input, id: base.id }, base);
  if (!r.reference) r.reference = base.reference;
  if (input.statut && input.statut !== base.statut) {
    r.suivi = [...r.suivi, { id: rid(), date: Date.now(), texte: `Statut : ${r.statut}`, statut: r.statut }];
  }
  await putMeta(r);
  return r;
}

export async function deleteRecommande(id: string): Promise<boolean> {
  const safe = safeId(id);
  const [meta, scans] = await Promise.all([
    list({ prefix: `${META_PREFIX}${safe}~`, limit: 100 }),
    list({ prefix: `${SCAN_PREFIX}${safe}/`, limit: 1000 }),
  ]);
  const urls = [...meta.blobs, ...scans.blobs].map((b) => b.url);
  if (urls.length > 0) await del(urls);
  return urls.length > 0;
}

export async function addSuivi(id: string, texte: string, statut?: string): Promise<Recommande | null> {
  const base = await getRecommande(id);
  if (!base) return null;
  const entree: SuiviEntree = { id: rid(), date: Date.now(), texte: txt(texte, 2000), statut: statut ? statutValide(statut) : undefined };
  const r: Recommande = { ...base, suivi: [...base.suivi, entree], statut: entree.statut ?? base.statut, updatedAt: Date.now() };
  await putMeta(r);
  return r;
}

// --- Scans (PDF ou image) ---
export async function addScan(id: string, scan: { nom: string; type: "pdf" | "image"; data: string }): Promise<Recommande | null> {
  const base = await getRecommande(id);
  if (!base) return null;
  const fileId = rid();
  const ext = scan.type === "pdf" ? "pdf" : "jpg";
  const ct = scan.type === "pdf" ? "application/pdf" : "image/jpeg";
  await put(`${SCAN_PREFIX}${base.id}/${fileId}.${ext}`, Buffer.from(scan.data, "base64"), { access: "public", addRandomSuffix: false, contentType: ct });
  const piece: ScanPiece = { id: fileId, nom: txt(scan.nom, 160) || "Scan", type: scan.type, addedAt: Date.now() };
  const r: Recommande = { ...base, scans: [...base.scans, piece], updatedAt: Date.now() };
  await putMeta(r);
  return r;
}

export async function deleteScan(id: string, fileId: string): Promise<Recommande | null> {
  const base = await getRecommande(id);
  if (!base) return null;
  const { blobs } = await list({ prefix: `${SCAN_PREFIX}${safeId(id)}/${safeId(fileId)}.`, limit: 2 });
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
  const r: Recommande = { ...base, scans: base.scans.filter((x) => x.id !== fileId), updatedAt: Date.now() };
  await putMeta(r);
  return r;
}

export async function getScanBytes(id: string, fileId: string): Promise<{ bytes: ArrayBuffer; contentType: string } | null> {
  const { blobs } = await list({ prefix: `${SCAN_PREFIX}${safeId(id)}/${safeId(fileId)}.`, limit: 2 });
  if (blobs.length === 0) return null;
  const b = blobs[0];
  const contentType = b.pathname.endsWith(".pdf") ? "application/pdf" : "image/jpeg";
  try { const r = await fetch(b.url, { cache: "no-store" }); return r.ok ? { bytes: await r.arrayBuffer(), contentType } : null; } catch { return null; }
}
