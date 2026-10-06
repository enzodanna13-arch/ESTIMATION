import { del, list, put } from "@vercel/blob";

// ORGANISATION QUOTIDIENNE par négociateur : chaque jour, un plan (RDV saisis +
// tâches dosées à cocher). Stocké sur le Blob, versionné, pour donner un cadre
// aux négociateurs (surtout les nouveaux) et de la visibilité au manager.

export interface RdvJour { visites: number; r1: number; r2: number; }
export interface TacheOrg { id: string; categorie: string; libelle: string; objectif?: number; fait: boolean; }
export interface PlanJour { date: string; rdv: RdvJour; niveau: string; taches: TacheOrg[]; }
export type JoursOrg = Record<string, PlanJour>;
export interface OrgNego { negoId: string; jours: JoursOrg; updatedAt: number; }

const PREFIX = "organisation/";
const safeId = (s: string) => (s ?? "").replace(/[^a-z0-9-]/gi, "").slice(0, 60);
const version = (pathname: string) => { const m = pathname.match(/~(\d+)\.json$/); return m ? Number(m[1]) : 0; };
const n0 = (v: unknown) => { const n = Math.round(Number(v)); return Number.isFinite(n) && n >= 0 && n <= 50 ? n : 0; };
const txt = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

export function nettoyerPlan(p: unknown, dateDefaut: string): PlanJour {
  const o = (p ?? {}) as Record<string, unknown>;
  const rdv = (o.rdv ?? {}) as Record<string, unknown>;
  const taches = Array.isArray(o.taches) ? o.taches.slice(0, 40).map((t) => {
    const x = (t ?? {}) as Record<string, unknown>;
    const tache: TacheOrg = { id: txt(x.id, 40) || Math.random().toString(36).slice(2, 8), categorie: txt(x.categorie, 40), libelle: txt(x.libelle, 200), fait: !!x.fait };
    if (Number.isFinite(Number(x.objectif))) tache.objectif = Number(x.objectif);
    return tache;
  }) : [];
  return {
    date: txt(o.date, 10) || dateDefaut,
    rdv: { visites: n0(rdv.visites), r1: n0(rdv.r1), r2: n0(rdv.r2) },
    niveau: txt(o.niveau, 20) || "equilibre",
    taches,
  };
}

export async function getOrgServer(negoId: string): Promise<OrgNego | null> {
  const id = safeId(negoId);
  if (!id) return null;
  const { blobs } = await list({ prefix: `${PREFIX}${id}~`, limit: 100 });
  if (blobs.length === 0) return null;
  let best = blobs[0];
  for (const b of blobs) if (version(b.pathname) > version(best.pathname)) best = b;
  try { const r = await fetch(best.url, { cache: "no-store" }); return r.ok ? ((await r.json()) as OrgNego) : null; } catch { return null; }
}

export async function saveJourServer(negoId: string, date: string, plan: unknown): Promise<PlanJour> {
  const id = safeId(negoId);
  const d = txt(date, 10);
  const existing = await getOrgServer(id);
  const jours: JoursOrg = existing?.jours ?? {};
  const clean = nettoyerPlan(plan, d);
  clean.date = d || clean.date;
  jours[clean.date] = clean;
  // Ne conserver que les 120 derniers jours.
  const cles = Object.keys(jours).sort().slice(-120);
  const joursLimite: JoursOrg = {};
  for (const k of cles) joursLimite[k] = jours[k];
  const now = Date.now();
  const payload: OrgNego = { negoId: id, jours: joursLimite, updatedAt: now };
  const nom = `${PREFIX}${id}~${now}.json`;
  await put(nom, JSON.stringify(payload), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: `${PREFIX}${id}~`, limit: 100 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
  return clean;
}

export async function listOrgServer(): Promise<OrgNego[]> {
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
    try { const r = await fetch(url, { cache: "no-store" }); return r.ok ? ((await r.json()) as OrgNego) : null; } catch { return null; }
  }));
  return metas.filter((m): m is OrgNego => m !== null);
}
