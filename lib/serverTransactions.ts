import { del, list, put } from "@vercel/blob";

// Service TRANSACTIONS (ventes réalisées) : pour chaque vente conclue, on
// conserve les pièces de clôture — attestation du notaire, facture d'agence…
// Même mécanique de stockage que les dossiers clients (métas versionnés +
// pièces PDF sur le Blob), indépendante.

export const CATEGORIES_TRANSACTION = [
  "Attestation notaire",
  "Facture agence",
  "Compromis",
  "Acte de vente",
  "Autre",
] as const;

export interface PieceTransaction {
  fileId: string;
  nom: string;
  taille: number;
  categorie: string;
  createdAt: number;
  url?: string; // URL du blob (lecture en cohérence forte)
}

export interface Transaction {
  id: string;
  createdAt: number;
  updatedAt: number;
  bien: string; // désignation du bien (ex. « Maison T5 — 12 rue … »)
  adresse: string;
  ville: string;
  prixVente: number; // prix de vente net vendeur (0 si non saisi)
  honoraires: number; // honoraires d'agence TTC (0 si non saisi)
  dateVente: number; // date de signature de l'acte (timestamp, 0 si non saisi)
  vendeur: string;
  acquereur: string;
  negociateur: string;
  notes: string;
  pieces: PieceTransaction[];
}

const META_PREFIX = "transactions/meta/";
const FILE_PREFIX = "transactions/files/";
const safeId = (s: string) => s.replace(/[^a-z0-9-]/gi, "");
const version = (pathname: string) => { const m = pathname.match(/~(\d+)\.json$/); return m ? Number(m[1]) : 0; };

async function putMeta(t: Transaction): Promise<void> {
  const nom = `${META_PREFIX}${t.id}~${t.updatedAt}.json`;
  await put(nom, JSON.stringify(t), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: `${META_PREFIX}${t.id}~`, limit: 100 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
}

export async function listTransactionsServer(): Promise<Transaction[]> {
  const { blobs } = await list({ prefix: META_PREFIX, limit: 1000 });
  const parId = new Map<string, { url: string; ts: number }>();
  for (const b of blobs) {
    const nom = b.pathname.slice(b.pathname.lastIndexOf("/") + 1);
    const id = nom.split("~")[0];
    const ts = version(b.pathname);
    const cur = parId.get(id);
    if (!cur || ts > cur.ts) parId.set(id, { url: b.url, ts });
  }
  const metas = await Promise.all([...parId.values()].map(async ({ url }) => {
    try { const r = await fetch(url, { cache: "no-store" }); return r.ok ? ((await r.json()) as Transaction) : null; } catch { return null; }
  }));
  return metas.filter((m): m is Transaction => m !== null).sort((a, b) => (b.dateVente || b.createdAt) - (a.dateVente || a.createdAt));
}

export async function getTransactionServer(id: string): Promise<Transaction | null> {
  const { blobs } = await list({ prefix: `${META_PREFIX}${safeId(id)}~`, limit: 100 });
  if (blobs.length === 0) return null;
  const dernier = blobs.reduce((a, b) => (version(b.pathname) > version(a.pathname) ? b : a));
  try { const r = await fetch(dernier.url, { cache: "no-store" }); return r.ok ? ((await r.json()) as Transaction) : null; } catch { return null; }
}

export async function saveTransactionServer(t: Transaction): Promise<void> {
  await putMeta(t);
}

export async function deleteTransactionServer(id: string): Promise<void> {
  const safe = safeId(id);
  const [meta, files] = await Promise.all([
    list({ prefix: `${META_PREFIX}${safe}~`, limit: 100 }),
    list({ prefix: `${FILE_PREFIX}${safe}/`, limit: 1000 }),
  ]);
  const urls = [...meta.blobs, ...files.blobs].map((b) => b.url);
  if (urls.length > 0) await del(urls);
}

// Enregistre des pièces DÉJÀ téléversées sur le Blob (upload direct navigateur)
// en récupérant leur url + taille pour une relecture fiable.
export async function addTransactionPiecesServer(
  id: string,
  pieces: { fileId: string; nom: string; categorie: string }[],
): Promise<Transaction | null> {
  const t = await getTransactionServer(id);
  if (!t) return null;
  for (const p of pieces) {
    const { blobs } = await list({ prefix: `${FILE_PREFIX}${safeId(id)}/${safeId(p.fileId)}.pdf`, limit: 1 });
    if (blobs.length === 0) continue;
    t.pieces.push({
      fileId: p.fileId,
      nom: (p.nom || "document").slice(0, 200),
      taille: blobs[0].size ?? 0,
      categorie: p.categorie,
      createdAt: Date.now(),
      url: blobs[0].url,
    });
  }
  t.updatedAt = Date.now();
  await putMeta(t);
  return t;
}

export async function resoudreUrlPieceTransaction(id: string, fileId: string, url?: string): Promise<string | null> {
  if (url) return url;
  try {
    const exact = await list({ prefix: `${FILE_PREFIX}${safeId(id)}/${safeId(fileId)}.pdf`, limit: 1 });
    if (exact.blobs.length > 0) return exact.blobs[0].url;
    const folder = await list({ prefix: `${FILE_PREFIX}${safeId(id)}/`, limit: 1000 });
    return folder.blobs.find((b) => b.pathname.includes(fileId) || b.pathname.includes(safeId(fileId)))?.url ?? null;
  } catch { return null; }
}

export async function getTransactionFileServer(id: string, fileId: string, url?: string): Promise<ArrayBuffer | null> {
  const cible = await resoudreUrlPieceTransaction(id, fileId, url);
  if (!cible) return null;
  try { const r = await fetch(cible, { cache: "no-store" }); return r.ok ? await r.arrayBuffer() : null; } catch { return null; }
}

export async function deleteTransactionFileServer(id: string, fileId: string): Promise<Transaction | null> {
  const t = await getTransactionServer(id);
  if (!t) return null;
  const { blobs } = await list({ prefix: `${FILE_PREFIX}${safeId(id)}/${safeId(fileId)}.pdf`, limit: 1 });
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
  t.pieces = t.pieces.filter((p) => p.fileId !== fileId);
  t.updatedAt = Date.now();
  await putMeta(t);
  return t;
}

export async function renameTransactionFileServer(id: string, fileId: string, nom: string, categorie?: string): Promise<Transaction | null> {
  const t = await getTransactionServer(id);
  if (!t) return null;
  const piece = t.pieces.find((p) => p.fileId === fileId);
  if (!piece) return null;
  const nomPropre = nom.trim().slice(0, 200);
  if (!nomPropre) return null;
  piece.nom = nomPropre;
  if (categorie !== undefined && (CATEGORIES_TRANSACTION as readonly string[]).includes(categorie)) piece.categorie = categorie;
  t.updatedAt = Date.now();
  await putMeta(t);
  return t;
}
