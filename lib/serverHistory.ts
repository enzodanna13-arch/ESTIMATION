import { del, list, put } from "@vercel/blob";
import type { DocumentInput, DocumentResult } from "./docTypes";
import type { EstimateResponse, PropertyInput } from "./types";

// Historique PARTAGÉ des estimations (Vercel Blob) : chaque négociateur de
// l'équipe voit et télécharge tous les dossiers, depuis n'importe quel
// poste. Deux familles de fichiers : « meta » (liste légère de l'accueil)
// et « full » (dossier complet avec photos, chargé à l'ouverture).

export interface HistoryMeta {
  id: string;
  createdAt: number;
  client: string;
  bien: string;
  ville: string;
  negociateur: string;
  fourchetteBasse: number;
  fourchetteHaute: number;
}

export interface HistoryFull extends HistoryMeta {
  result: EstimateResponse;
  input: PropertyInput;
}

const META_PREFIX = "estimations/meta/";
const FULL_PREFIX = "estimations/full/";

export async function saveEstimationServer(entry: HistoryFull): Promise<void> {
  const { result: _r, input: _i, ...meta } = entry;
  await Promise.all([
    put(`${META_PREFIX}${entry.id}.json`, JSON.stringify(meta), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    }),
    put(`${FULL_PREFIX}${entry.id}.json`, JSON.stringify(entry), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    }),
  ]);
}

export async function listEstimationsServer(): Promise<HistoryMeta[]> {
  const { blobs } = await list({ prefix: META_PREFIX, limit: 500 });
  const metas = await Promise.all(
    blobs.map(async (b) => {
      try {
        const res = await fetch(b.url, { cache: "no-store" });
        return res.ok ? ((await res.json()) as HistoryMeta) : null;
      } catch {
        return null;
      }
    }),
  );
  return metas
    .filter((m): m is HistoryMeta => m !== null)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getEstimationServer(id: string): Promise<HistoryFull | null> {
  const safe = id.replace(/[^a-z0-9-]/gi, "");
  const { blobs } = await list({ prefix: `${FULL_PREFIX}${safe}.json`, limit: 1 });
  if (blobs.length === 0) return null;
  try {
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    return res.ok ? ((await res.json()) as HistoryFull) : null;
  } catch {
    return null;
  }
}

export async function deleteEstimationServer(id: string): Promise<void> {
  const safe = id.replace(/[^a-z0-9-]/gi, "");
  const [meta, full] = await Promise.all([
    list({ prefix: `${META_PREFIX}${safe}.json`, limit: 1 }),
    list({ prefix: `${FULL_PREFIX}${safe}.json`, limit: 1 }),
  ]);
  const urls = [...meta.blobs, ...full.blobs].map((b) => b.url);
  if (urls.length > 0) await del(urls);
}


// ---------------------------------------------------------------------------
// Historique PARTAGÉ des documents générés (annonce, courriers, devis,
// facture, compromis) — même principe que les estimations : meta légère
// pour la liste, full pour la réouverture. Les pièces PDF téléversées du
// compromis ne sont PAS conservées (confidentialité) : seule la saisie l'est.
// ---------------------------------------------------------------------------

export interface DocHistoryMeta {
  id: string;
  createdAt: number;
  docType: string;
  titre: string; // libellé du type de document
  reference: string; // client / dossier / bien concerné
  negociateur: string;
}

export interface DocHistoryFull extends DocHistoryMeta {
  doc: DocumentResult;
  input: DocumentInput;
}

const DOC_META_PREFIX = "documents/meta/";
const DOC_FULL_PREFIX = "documents/full/";

export async function saveDocumentServer(entry: DocHistoryFull): Promise<void> {
  const { doc: _d, input: _i, ...meta } = entry;
  await Promise.all([
    put(`${DOC_META_PREFIX}${entry.id}.json`, JSON.stringify(meta), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    }),
    put(`${DOC_FULL_PREFIX}${entry.id}.json`, JSON.stringify(entry), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    }),
  ]);
}

export async function listDocumentsServer(): Promise<DocHistoryMeta[]> {
  const { blobs } = await list({ prefix: DOC_META_PREFIX, limit: 500 });
  const metas = await Promise.all(
    blobs.map(async (b) => {
      try {
        const res = await fetch(b.url, { cache: "no-store" });
        return res.ok ? ((await res.json()) as DocHistoryMeta) : null;
      } catch {
        return null;
      }
    }),
  );
  return metas
    .filter((m): m is DocHistoryMeta => m !== null)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getDocumentServer(id: string): Promise<DocHistoryFull | null> {
  const safe = id.replace(/[^a-z0-9-]/gi, "");
  const { blobs } = await list({ prefix: `${DOC_FULL_PREFIX}${safe}.json`, limit: 1 });
  if (blobs.length === 0) return null;
  try {
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    return res.ok ? ((await res.json()) as DocHistoryFull) : null;
  } catch {
    return null;
  }
}

export async function deleteDocumentServer(id: string): Promise<void> {
  const safe = id.replace(/[^a-z0-9-]/gi, "");
  const [meta, full] = await Promise.all([
    list({ prefix: `${DOC_META_PREFIX}${safe}.json`, limit: 1 }),
    list({ prefix: `${DOC_FULL_PREFIX}${safe}.json`, limit: 1 }),
  ]);
  const urls = [...meta.blobs, ...full.blobs].map((b) => b.url);
  if (urls.length > 0) await del(urls);
}


// ---------------------------------------------------------------------------
// DOSSIERS CLIENTS partagés : un dossier par client, dans lequel les
// négociateurs déposent toutes les pièces PDF (comptes rendus de visite,
// mandat, diagnostics…). Les PDF sont stockés en binaire sur le Blob ; leur
// téléchargement passe TOUJOURS par l'API protégée par mot de passe — les
// URL de stockage ne sont jamais exposées au navigateur.
// ---------------------------------------------------------------------------

export { CATEGORIES_PIECES } from "./docTypes";

export interface PieceClient {
  fileId: string;
  nom: string;
  taille: number;
  categorie: string;
  createdAt: number;
}

export interface ClientDossier {
  id: string;
  createdAt: number;
  updatedAt: number;
  nom: string; // nom du client
  bien: string; // bien concerné
  negociateur: string;
  pieces: PieceClient[];
}

const CLIENT_META_PREFIX = "clients/meta/";
const CLIENT_FILE_PREFIX = "clients/files/";

const safeId = (s: string) => s.replace(/[^a-z0-9-]/gi, "");

// Les métas sont VERSIONNÉS (« <id>~<updatedAt>.json ») : écraser un blob au
// même chemin laisse le CDN servir l'ancienne version pendant ~1 minute —
// un nouveau chemin à chaque mise à jour garantit une lecture toujours
// fraîche ; les anciennes versions sont supprimées dans la foulée.
async function putClientMeta(dossier: ClientDossier): Promise<void> {
  const nom = `${CLIENT_META_PREFIX}${dossier.id}~${dossier.updatedAt}.json`;
  await put(nom, JSON.stringify(dossier), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
  const { blobs } = await list({ prefix: `${CLIENT_META_PREFIX}${dossier.id}~`, limit: 100 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
}

/** Dernière version d'un méta parmi des blobs « <id>~<ts>.json ». */
function derniereVersion(pathname: string): number {
  const m = pathname.match(/~(\d+)\.json$/);
  return m ? Number(m[1]) : 0;
}

export async function saveClientServer(dossier: ClientDossier): Promise<void> {
  await putClientMeta(dossier);
}

export async function listClientsServer(): Promise<ClientDossier[]> {
  const { blobs } = await list({ prefix: CLIENT_META_PREFIX, limit: 1000 });
  // Une seule version (la plus récente) par dossier
  const parId = new Map<string, { url: string; ts: number }>();
  for (const b of blobs) {
    const nom = b.pathname.slice(b.pathname.lastIndexOf("/") + 1);
    const id = nom.split("~")[0];
    const ts = derniereVersion(b.pathname);
    const cur = parId.get(id);
    if (!cur || ts > cur.ts) parId.set(id, { url: b.url, ts });
  }
  const metas = await Promise.all(
    [...parId.values()].map(async ({ url }) => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        return res.ok ? ((await res.json()) as ClientDossier) : null;
      } catch {
        return null;
      }
    }),
  );
  return metas
    .filter((m): m is ClientDossier => m !== null)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getClientServer(id: string): Promise<ClientDossier | null> {
  const { blobs } = await list({ prefix: `${CLIENT_META_PREFIX}${safeId(id)}~`, limit: 100 });
  if (blobs.length === 0) return null;
  const dernier = blobs.reduce((a, b) => (derniereVersion(b.pathname) > derniereVersion(a.pathname) ? b : a));
  try {
    const res = await fetch(dernier.url, { cache: "no-store" });
    return res.ok ? ((await res.json()) as ClientDossier) : null;
  } catch {
    return null;
  }
}

export async function deleteClientServer(id: string): Promise<void> {
  const safe = safeId(id);
  const [meta, files] = await Promise.all([
    list({ prefix: `${CLIENT_META_PREFIX}${safe}~`, limit: 100 }),
    list({ prefix: `${CLIENT_FILE_PREFIX}${safe}/`, limit: 1000 }),
  ]);
  const urls = [...meta.blobs, ...files.blobs].map((b) => b.url);
  if (urls.length > 0) await del(urls);
}

export async function addClientFileServer(
  id: string,
  piece: { nom: string; categorie: string; data: string },
): Promise<ClientDossier | null> {
  const dossier = await getClientServer(id);
  if (!dossier) return null;
  const fileId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const octets = Buffer.from(piece.data, "base64");
  await put(`${CLIENT_FILE_PREFIX}${dossier.id}/${fileId}.pdf`, octets, {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/pdf",
  });
  dossier.pieces.push({
    fileId,
    nom: piece.nom,
    taille: octets.length,
    categorie: piece.categorie,
    createdAt: Date.now(),
  });
  dossier.updatedAt = Date.now();
  await putClientMeta(dossier);
  return dossier;
}

export async function getClientFileServer(id: string, fileId: string): Promise<ArrayBuffer | null> {
  const { blobs } = await list({
    prefix: `${CLIENT_FILE_PREFIX}${safeId(id)}/${safeId(fileId)}.pdf`,
    limit: 1,
  });
  if (blobs.length === 0) return null;
  try {
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export async function deleteClientFileServer(id: string, fileId: string): Promise<ClientDossier | null> {
  const dossier = await getClientServer(id);
  if (!dossier) return null;
  const { blobs } = await list({
    prefix: `${CLIENT_FILE_PREFIX}${dossier.id}/${safeId(fileId)}.pdf`,
    limit: 1,
  });
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
  dossier.pieces = dossier.pieces.filter((p) => p.fileId !== fileId);
  dossier.updatedAt = Date.now();
  await putClientMeta(dossier);
  return dossier;
}
