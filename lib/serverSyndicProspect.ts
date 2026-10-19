import { del, list, put } from "@vercel/blob";

// SUIVI de PROSPECTION SYNDIC par copropriété (statut + notes), partagé pour la
// visibilité équipe. Un seul blob versionné : map coproId -> suivi.

export interface SyndicProspect { statut: string; notes: string; updatedAt: number; }
export type SyndicProspectMap = Record<string, SyndicProspect>;

export const STATUTS_SYNDIC = ["À contacter", "Courrier envoyé", "Contact établi", "RDV / AG visée", "Gagné", "Perdu", "Écarté"];

const PREFIX = "syndicprospect~";
const version = (p: string) => { const m = p.match(/~(\d+)\.json$/); return m ? Number(m[1]) : 0; };
const txt = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

export async function getSyndicProspect(): Promise<SyndicProspectMap> {
  const { blobs } = await list({ prefix: PREFIX, limit: 50 });
  if (blobs.length === 0) return {};
  let best = blobs[0];
  for (const b of blobs) if (version(b.pathname) > version(best.pathname)) best = b;
  try { const r = await fetch(best.url, { cache: "no-store" }); return r.ok ? ((await r.json()) as SyndicProspectMap) : {}; } catch { return {}; }
}

export async function setSyndicProspect(coproId: string, statut: string, notes: string): Promise<SyndicProspectMap> {
  const id = txt(coproId, 60);
  if (!id) return getSyndicProspect();
  const map = await getSyndicProspect();
  map[id] = { statut: txt(statut, 40) || "À contacter", notes: txt(notes, 2000), updatedAt: Date.now() };
  const now = Date.now();
  const nom = `${PREFIX}${now}.json`;
  await put(nom, JSON.stringify(map), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: PREFIX, limit: 50 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
  return map;
}
