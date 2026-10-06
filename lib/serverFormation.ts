import { del, list, put } from "@vercel/blob";

// PROGRESSION FORMATION par négociateur. Chaque négociateur a sa progression
// (leçons lues + score de quiz par module) stockée sur le Blob, afin que le
// manager ait une visibilité centralisée dans « Suivi des négociateurs ».
// Même mécanique versionnée que les autres métas (cohérence forte à la lecture).

export type ProgresModule = { lecons: number[]; quiz?: number };
export type ProgresFormation = Record<string, ProgresModule>;

export interface ProgresNego {
  negoId: string;
  progres: ProgresFormation;
  updatedAt: number;
}

const PREFIX = "formation/progres/";
const safeId = (s: string) => (s ?? "").replace(/[^a-z0-9-]/gi, "").slice(0, 60);
const version = (pathname: string) => { const m = pathname.match(/~(\d+)\.json$/); return m ? Number(m[1]) : 0; };

// Borne/nettoie la structure reçue (tableaux d'entiers, scores entiers).
export function nettoyerProgres(p: unknown): ProgresFormation {
  const out: ProgresFormation = {};
  if (!p || typeof p !== "object") return out;
  for (const [cle, val] of Object.entries(p as Record<string, unknown>)) {
    const id = String(cle).slice(0, 60);
    const v = (val ?? {}) as { lecons?: unknown; quiz?: unknown };
    const lecons = Array.isArray(v.lecons)
      ? [...new Set(v.lecons.map((n) => Number(n)).filter((n) => Number.isInteger(n) && n >= 0 && n < 100))].slice(0, 100)
      : [];
    const entry: ProgresModule = { lecons };
    if (Number.isInteger(Number(v.quiz)) && Number(v.quiz) >= 0) entry.quiz = Number(v.quiz);
    out[id] = entry;
  }
  return out;
}

export async function getProgresServer(negoId: string): Promise<ProgresNego | null> {
  const id = safeId(negoId);
  if (!id) return null;
  const { blobs } = await list({ prefix: `${PREFIX}${id}~`, limit: 100 });
  if (blobs.length === 0) return null;
  let best = blobs[0];
  for (const b of blobs) if (version(b.pathname) > version(best.pathname)) best = b;
  try { const r = await fetch(best.url, { cache: "no-store" }); return r.ok ? ((await r.json()) as ProgresNego) : null; } catch { return null; }
}

export async function saveProgresServer(negoId: string, progres: ProgresFormation): Promise<ProgresNego> {
  const id = safeId(negoId);
  const now = Date.now();
  const data: ProgresNego = { negoId: id, progres: progres ?? {}, updatedAt: now };
  const nom = `${PREFIX}${id}~${now}.json`;
  await put(nom, JSON.stringify(data), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: `${PREFIX}${id}~`, limit: 100 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
  return data;
}

export async function listProgresServer(): Promise<ProgresNego[]> {
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
  const parId = new Map<string, { url: string; ts: number }>();
  for (const b of blobs) {
    const nom = b.pathname.slice(b.pathname.lastIndexOf("/") + 1);
    const id = nom.split("~")[0];
    const ts = version(b.pathname);
    const cur = parId.get(id);
    if (!cur || ts > cur.ts) parId.set(id, { url: b.url, ts });
  }
  const metas = await Promise.all([...parId.values()].map(async ({ url }) => {
    try { const r = await fetch(url, { cache: "no-store" }); return r.ok ? ((await r.json()) as ProgresNego) : null; } catch { return null; }
  }));
  return metas.filter((m): m is ProgresNego => m !== null);
}
