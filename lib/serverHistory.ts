import { del, list, put } from "@vercel/blob";
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
