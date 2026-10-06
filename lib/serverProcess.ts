import { del, list, put } from "@vercel/blob";

// Personnalisations des PROCESS par le manager (surcharge du contenu par défaut).
// Stocké dans un unique blob versionné : { [processId]: string[] (contenu) }.

export type ProcessOverrides = Record<string, string[]>;

const PREFIX = "process/overrides~";
const version = (pathname: string) => { const m = pathname.match(/~(\d+)\.json$/); return m ? Number(m[1]) : 0; };

function nettoyerContenu(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x).slice(0, 2000)).slice(0, 400);
}

export async function getProcessOverrides(): Promise<ProcessOverrides> {
  const { blobs } = await list({ prefix: PREFIX, limit: 100 });
  if (blobs.length === 0) return {};
  let best = blobs[0];
  for (const b of blobs) if (version(b.pathname) > version(best.pathname)) best = b;
  try {
    const r = await fetch(best.url, { cache: "no-store" });
    if (!r.ok) return {};
    const d = (await r.json()) as ProcessOverrides;
    return d && typeof d === "object" ? d : {};
  } catch { return {}; }
}

export async function saveProcessOverride(id: string, contenu: unknown): Promise<ProcessOverrides> {
  const cle = String(id).slice(0, 60);
  const current = await getProcessOverrides();
  current[cle] = nettoyerContenu(contenu);
  const now = Date.now();
  const nom = `${PREFIX}${now}.json`;
  await put(nom, JSON.stringify(current), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: PREFIX, limit: 100 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
  return current;
}
