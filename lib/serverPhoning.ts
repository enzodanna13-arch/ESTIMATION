import { del, list, put } from "@vercel/blob";

// PHONING par négociateur : pour chaque cible (estimations archivées, mandats
// archivés, acquéreurs archivés, estimations récentes…), le négociateur remplit
// un tableau d'appels. Stocké sur le Blob (versionné, lecture cohérente) pour
// donner de la visibilité au manager.

export interface LignePhoning {
  id: string;
  contact: string;
  tel: string;
  statut: string;
  date?: number;   // date de l'appel (timestamp)
  rappel?: number; // date de rappel prévue (timestamp)
  notes: string;
  createdAt: number;
}
export type PhoningData = Record<string, LignePhoning[]>; // cibleId -> lignes

export interface PhoningNego {
  negoId: string;
  data: PhoningData;
  updatedAt: number;
}

const PREFIX = "phoning/";
const safeId = (s: string) => (s ?? "").replace(/[^a-z0-9-]/gi, "").slice(0, 60);
const version = (pathname: string) => { const m = pathname.match(/~(\d+)\.json$/); return m ? Number(m[1]) : 0; };
const txt = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
const ts = (v: unknown) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : undefined; };

// Nettoie/borne la structure reçue (limite le nombre de cibles et de lignes).
export function nettoyerPhoning(d: unknown): PhoningData {
  const out: PhoningData = {};
  if (!d || typeof d !== "object") return out;
  for (const [cible, lignes] of Object.entries(d as Record<string, unknown>)) {
    if (!Array.isArray(lignes)) continue;
    const cle = String(cible).slice(0, 40);
    out[cle] = lignes.slice(0, 2000).map((l) => {
      const o = (l ?? {}) as Record<string, unknown>;
      const ligne: LignePhoning = {
        id: txt(o.id, 40) || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        contact: txt(o.contact, 160),
        tel: txt(o.tel, 40),
        statut: txt(o.statut, 40),
        notes: txt(o.notes, 2000),
        createdAt: ts(o.createdAt) ?? Date.now(),
      };
      const d1 = ts(o.date); if (d1) ligne.date = d1;
      const d2 = ts(o.rappel); if (d2) ligne.rappel = d2;
      return ligne;
    });
  }
  return out;
}

export async function getPhoningServer(negoId: string): Promise<PhoningNego | null> {
  const id = safeId(negoId);
  if (!id) return null;
  const { blobs } = await list({ prefix: `${PREFIX}${id}~`, limit: 100 });
  if (blobs.length === 0) return null;
  let best = blobs[0];
  for (const b of blobs) if (version(b.pathname) > version(best.pathname)) best = b;
  try { const r = await fetch(best.url, { cache: "no-store" }); return r.ok ? ((await r.json()) as PhoningNego) : null; } catch { return null; }
}

export async function savePhoningServer(negoId: string, data: PhoningData): Promise<PhoningNego> {
  const id = safeId(negoId);
  const now = Date.now();
  const payload: PhoningNego = { negoId: id, data: data ?? {}, updatedAt: now };
  const nom = `${PREFIX}${id}~${now}.json`;
  await put(nom, JSON.stringify(payload), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: `${PREFIX}${id}~`, limit: 100 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
  return payload;
}

export async function listPhoningServer(): Promise<PhoningNego[]> {
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
  const parId = new Map<string, { url: string; ts: number }>();
  for (const b of blobs) {
    const nom = b.pathname.slice(b.pathname.lastIndexOf("/") + 1);
    const id = nom.split("~")[0];
    const t = version(b.pathname);
    const cur = parId.get(id);
    if (!cur || t > cur.ts) parId.set(id, { url: b.url, ts: t });
  }
  const metas = await Promise.all([...parId.values()].map(async ({ url }) => {
    try { const r = await fetch(url, { cache: "no-store" }); return r.ok ? ((await r.json()) as PhoningNego) : null; } catch { return null; }
  }));
  return metas.filter((m): m is PhoningNego => m !== null);
}
