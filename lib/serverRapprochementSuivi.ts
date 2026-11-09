import { del, list, put } from "@vercel/blob";

// Suivi des correspondances acquéreur ⇄ bien : statut (pipeline) par paire.
// Stocké dans UN seul document versionné (rapprochement/suivi~<ts>.json),
// clé = "<acqId>|<source>|<bienId>". Partagé équipe.

export const STATUTS_RAPPRO = ["Nouveau", "À contacter", "Proposé", "Visite", "Refusé", "Accepté"] as const;
export type StatutRappro = (typeof STATUTS_RAPPRO)[number];

export interface SuiviRappro {
  statut: StatutRappro;
  note?: string;
  updatedAt: number;
}
export type SuiviMap = Record<string, SuiviRappro>;

const PREFIX = "rapprochement/suivi";
const version = (p: string) => { const m = p.match(/~(\d+)\.json$/); return m ? Number(m[1]) : 0; };
const statutValide = (s: unknown): StatutRappro => ((STATUTS_RAPPRO as readonly string[]).includes(typeof s === "string" ? s : "") ? (s as StatutRappro) : "Nouveau");

export async function getSuiviServer(): Promise<SuiviMap> {
  const { blobs } = await list({ prefix: PREFIX, limit: 100 });
  if (blobs.length === 0) return {};
  const best = blobs.reduce((a, b) => (version(b.pathname) > version(a.pathname) ? b : a));
  try { const r = await fetch(best.url, { cache: "no-store" }); return r.ok ? ((await r.json()) as SuiviMap) : {}; } catch { return {}; }
}

async function putSuivi(map: SuiviMap): Promise<void> {
  const ts = Date.now();
  const nom = `${PREFIX}~${ts}.json`;
  await put(nom, JSON.stringify(map), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: PREFIX, limit: 100 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
}

export async function setSuiviServer(cle: string, statut: string, note?: string): Promise<SuiviMap> {
  const map = await getSuiviServer();
  const k = String(cle).slice(0, 200);
  const st = statutValide(statut);
  if (st === "Nouveau" && !note) delete map[k]; // "Nouveau" sans note = pas de suivi
  else map[k] = { statut: st, note: typeof note === "string" ? note.slice(0, 1000) : map[k]?.note, updatedAt: Date.now() };
  await putSuivi(map);
  return map;
}
