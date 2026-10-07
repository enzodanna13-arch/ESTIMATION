import { del, list, put } from "@vercel/blob";

// BASE PARTAGÉE de contacts par cible de phoning (ex. estimations archivées).
// Données de l'agence (importées depuis Excel/CSV par la direction), stockées
// côté serveur sur le Blob — JAMAIS dans le dépôt, car elles contiennent des
// coordonnées clients. Chaque négociateur peut ensuite charger cette base dans
// son propre tableau d'appels.

export interface BaseContact { contact: string; tel: string; notes: string; }
export interface PhoningBase { cible: string; contacts: BaseContact[]; updatedAt: number; }

const PREFIX = "phoningbase/";
const safeId = (s: string) => (s ?? "").replace(/[^a-z0-9-]/gi, "").slice(0, 40);
const version = (pathname: string) => { const m = pathname.match(/~(\d+)\.json$/); return m ? Number(m[1]) : 0; };
const txt = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

export function nettoyerContacts(v: unknown): BaseContact[] {
  if (!Array.isArray(v)) return [];
  return v.slice(0, 20000).map((c) => {
    const o = (c ?? {}) as Record<string, unknown>;
    return { contact: txt(o.contact, 160), tel: txt(o.tel, 60), notes: txt(o.notes, 2000) };
  }).filter((c) => c.contact || c.tel);
}

export async function getBaseServer(cibleId: string): Promise<PhoningBase | null> {
  const id = safeId(cibleId);
  if (!id) return null;
  const { blobs } = await list({ prefix: `${PREFIX}${id}~`, limit: 100 });
  if (blobs.length === 0) return null;
  let best = blobs[0];
  for (const b of blobs) if (version(b.pathname) > version(best.pathname)) best = b;
  try { const r = await fetch(best.url, { cache: "no-store" }); return r.ok ? ((await r.json()) as PhoningBase) : null; } catch { return null; }
}

// Remplace entièrement la base d'une cible.
export async function saveBaseServer(cibleId: string, contacts: unknown): Promise<PhoningBase> {
  const id = safeId(cibleId);
  const clean = nettoyerContacts(contacts);
  const now = Date.now();
  const payload: PhoningBase = { cible: id, contacts: clean, updatedAt: now };
  const nom = `${PREFIX}${id}~${now}.json`;
  await put(nom, JSON.stringify(payload), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: `${PREFIX}${id}~`, limit: 100 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
  return payload;
}
