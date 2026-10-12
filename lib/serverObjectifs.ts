import { del, list, put } from "@vercel/blob";

// OBJECTIFS DE CHIFFRE D'AFFAIRES (commissions) par année. Un seul blob versionné
// stocke la carte année → montant € (ex. { "2026": 300000 }).

export type ObjectifsCA = Record<string, number>;

const PREFIX = "config/objectifsca~";
const version = (pathname: string) => { const m = pathname.match(/~(\d+)\.json$/); return m ? Number(m[1]) : 0; };

export async function getObjectifsServer(): Promise<ObjectifsCA> {
  const { blobs } = await list({ prefix: PREFIX, limit: 100 });
  if (blobs.length === 0) return {};
  let best = blobs[0];
  for (const b of blobs) if (version(b.pathname) > version(best.pathname)) best = b;
  try {
    const r = await fetch(best.url, { cache: "no-store" });
    if (!r.ok) return {};
    const d = (await r.json()) as Record<string, unknown>;
    const out: ObjectifsCA = {};
    for (const [k, v] of Object.entries(d)) { const n = Number(v); if (/^\d{4}$/.test(k) && Number.isFinite(n) && n >= 0) out[k] = Math.round(n); }
    return out;
  } catch { return {}; }
}

export async function saveObjectifServer(annee: number, montant: number): Promise<ObjectifsCA> {
  const cur = await getObjectifsServer();
  const m = Math.max(0, Math.round(Number(montant) || 0));
  const map: ObjectifsCA = { ...cur, [String(annee)]: m };
  const now = Date.now();
  const nom = `${PREFIX}${now}.json`;
  await put(nom, JSON.stringify(map), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: PREFIX, limit: 100 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
  return map;
}
