import { del, list, put } from "@vercel/blob";

// Couche d'accès Blob générique pour le module Syndic. Chaque enregistrement est
// un fichier JSON versionné « syndic/<collection>/<id>~<updatedAt>.json » : on
// garde la version la plus récente par id et on supprime les plus anciennes.
// Même principe éprouvé que les leads/dossiers du module Estimation — un
// enregistrement ne peut pas « disparaître » sur un aléa d'écriture concurrent.

const RACINE = "syndic/";
const safe = (s: string) => String(s).replace(/[^a-z0-9-]/gi, "");
const versionDe = (p: string) => {
  const m = p.match(/~(\d+)\.json$/);
  return m ? Number(m[1]) : 0;
};

interface Enregistrement {
  id: string;
  updatedAt: number;
}

function prefixe(collection: string): string {
  return `${RACINE}${collection}/`;
}

export async function enregistrer<T extends Enregistrement>(collection: string, item: T): Promise<T> {
  item.updatedAt = Date.now();
  const chemin = `${prefixe(collection)}${safe(item.id)}~${item.updatedAt}.json`;
  await put(chemin, JSON.stringify(item), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
  const { blobs } = await list({ prefix: `${prefixe(collection)}${safe(item.id)}~`, limit: 100 });
  const anciennes = blobs
    .filter((b) => b.pathname !== chemin && versionDe(b.pathname) < item.updatedAt)
    .map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
  return item;
}

export async function lister<T extends Enregistrement>(collection: string): Promise<T[]> {
  const { blobs } = await list({ prefix: prefixe(collection), limit: 1000 });
  const parId = new Map<string, { url: string; ts: number }>();
  for (const b of blobs) {
    const nom = b.pathname.slice(b.pathname.lastIndexOf("/") + 1);
    const id = nom.split("~")[0];
    const ts = versionDe(b.pathname);
    const cur = parId.get(id);
    if (!cur || ts > cur.ts) parId.set(id, { url: b.url, ts });
  }
  const charger = async (url: string): Promise<T | null> => {
    for (let essai = 0; essai < 3; essai++) {
      try {
        const r = await fetch(url, { cache: "no-store" });
        if (r.ok) return (await r.json()) as T;
      } catch { /* on réessaie */ }
    }
    return null;
  };
  const items = await Promise.all([...parId.values()].map(({ url }) => charger(url)));
  return items.filter((x) => x !== null) as T[];
}

export async function obtenir<T extends Enregistrement>(collection: string, id: string): Promise<T | null> {
  const { blobs } = await list({ prefix: `${prefixe(collection)}${safe(id)}~`, limit: 100 });
  if (blobs.length === 0) return null;
  const dernier = blobs.reduce((a, b) => (versionDe(b.pathname) > versionDe(a.pathname) ? b : a));
  try {
    const r = await fetch(dernier.url, { cache: "no-store" });
    return r.ok ? ((await r.json()) as T) : null;
  } catch {
    return null;
  }
}

export async function supprimer(collection: string, id: string): Promise<void> {
  const { blobs } = await list({ prefix: `${prefixe(collection)}${safe(id)}~`, limit: 100 });
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
}

export function nouvelId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
