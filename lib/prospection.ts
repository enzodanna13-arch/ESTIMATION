// Client du module Prospection ciblée — appels API protégés par le mot de
// passe d'équipe (en-tête x-history-key), comme le reste de l'outil.
import { getHistoryKey } from "./history";
import type { Opportunite, ProspectionConfig, Tournee } from "./prospectionTypes";
import type { ResultatSync } from "./prospectionSync";
import type { ResultatGeneration } from "./prospectionTournees";

export type { Opportunite, ProspectionConfig, Tournee } from "./prospectionTypes";

const headers = () => ({ "x-history-key": getHistoryKey() });
const jsonHeaders = () => ({ "content-type": "application/json", "x-history-key": getHistoryKey() });

// --- Config ---
export async function getConfig(): Promise<ProspectionConfig | null> {
  const r = await fetch("/api/prospection/config", { cache: "no-store", headers: headers() });
  if (!r.ok) return null;
  return ((await r.json()) as { config?: ProspectionConfig }).config ?? null;
}
export async function saveConfig(patch: Partial<ProspectionConfig>): Promise<ProspectionConfig | null> {
  const r = await fetch("/api/prospection/config", { method: "PUT", headers: jsonHeaders(), body: JSON.stringify(patch) });
  if (!r.ok) return null;
  return ((await r.json()) as { config?: ProspectionConfig }).config ?? null;
}

// --- Opportunités ---
export async function listOpportunites(): Promise<Opportunite[]> {
  const r = await fetch("/api/prospection/opportunites", { cache: "no-store", headers: headers() });
  if (!r.ok) return [];
  return ((await r.json()) as { opportunites?: Opportunite[] }).opportunites ?? [];
}
export async function getOpportunite(id: string): Promise<Opportunite | null> {
  const r = await fetch(`/api/prospection/opportunites/${encodeURIComponent(id)}`, { cache: "no-store", headers: headers() });
  if (!r.ok) return null;
  return ((await r.json()) as { opportunite?: Opportunite }).opportunite ?? null;
}
export async function createOpportunite(opportunite: Partial<Opportunite>): Promise<Opportunite | null> {
  const r = await fetch("/api/prospection/opportunites", { method: "POST", headers: jsonHeaders(), body: JSON.stringify({ opportunite }) });
  if (!r.ok) return null;
  return ((await r.json()) as { opportunite?: Opportunite }).opportunite ?? null;
}
export async function updateOpportunite(id: string, patch: Partial<Opportunite>): Promise<Opportunite | null> {
  const r = await fetch(`/api/prospection/opportunites/${encodeURIComponent(id)}`, { method: "PUT", headers: jsonHeaders(), body: JSON.stringify(patch) });
  if (!r.ok) return null;
  return ((await r.json()) as { opportunite?: Opportunite }).opportunite ?? null;
}
export async function deleteOpportunite(id: string): Promise<boolean> {
  const r = await fetch(`/api/prospection/opportunites/${encodeURIComponent(id)}`, { method: "DELETE", headers: headers() });
  return r.ok;
}

// --- Synchronisation / scoring ---
async function postSync(bodyObj: Record<string, unknown>): Promise<{ ok: boolean; body: (ResultatSync & { error?: string }) | null }> {
  try {
    const r = await fetch("/api/prospection/sync", { method: "POST", headers: jsonHeaders(), body: JSON.stringify(bodyObj) });
    const body = (await r.json().catch(() => null)) as (ResultatSync & { error?: string }) | null;
    return { ok: r.ok, body };
  } catch {
    return { ok: false, body: null };
  }
}

// Synchronise COMMUNE PAR COMMUNE (une requête par commune) pour rester bien
// en-deçà du temps limite Vercel, puis agrège les résultats. `onProgress`
// permet d'afficher l'avancement.
export async function synchroniser(onProgress?: (nom: string, i: number, total: number) => void): Promise<ResultatSync | null> {
  const config = await getConfig();
  const communes = config?.communes ?? [];
  if (communes.length === 0) {
    const { ok, body } = await postSync({});
    if (!body) return null;
    return ok ? (body as ResultatSync) : { ok: false, nouveaux: 0, misAJour: 0, communes: [], erreurs: [body.error ?? "Synchronisation impossible"], duréeMs: 0 };
  }
  return synchroniserPlusieurs(communes.map((c) => c.code), communes, onProgress);
}

// Synchronise UNE seule commune (déclenchement manuel depuis l'interface pour
// limiter le volume de requêtes / étaler dans le temps).
export async function synchroniserUne(code: string): Promise<ResultatSync | null> {
  const { ok, body } = await postSync({ commune: code });
  if (!body) return null;
  return ok ? (body as ResultatSync) : { ok: false, nouveaux: 0, misAJour: 0, communes: [], erreurs: [body.error ?? "Échec"], duréeMs: 0 };
}

async function synchroniserPlusieurs(
  codes: string[],
  communes: { code: string; nom: string }[],
  onProgress?: (nom: string, i: number, total: number) => void,
): Promise<ResultatSync> {
  const agg: ResultatSync = { ok: true, nouveaux: 0, misAJour: 0, communes: [], erreurs: [], duréeMs: 0 };
  const nomDe = (code: string) => communes.find((c) => c.code === code)?.nom ?? code;
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    onProgress?.(nomDe(code), i + 1, codes.length);
    const { ok, body } = await postSync({ commune: code });
    if (!body) { agg.erreurs.push(`${nomDe(code)} : injoignable`); agg.ok = false; continue; }
    if (!ok) { agg.erreurs.push(`${nomDe(code)} : ${body.error ?? "échec"}`); agg.ok = false; continue; }
    agg.nouveaux += body.nouveaux ?? 0;
    agg.misAJour += body.misAJour ?? 0;
    if (Array.isArray(body.communes)) agg.communes.push(...body.communes);
    if (Array.isArray(body.erreurs)) agg.erreurs.push(...body.erreurs);
  }
  return agg;
}

export async function rescorer(): Promise<number | null> {
  const r = await fetch("/api/prospection/sync", { method: "POST", headers: jsonHeaders(), body: JSON.stringify({ rescore: true }) });
  if (!r.ok) return null;
  return ((await r.json()) as { rescored?: number }).rescored ?? null;
}

// --- Tournées ---
export async function listTournees(): Promise<Tournee[]> {
  const r = await fetch("/api/prospection/tournees", { cache: "no-store", headers: headers() });
  if (!r.ok) return [];
  return ((await r.json()) as { tournees?: Tournee[] }).tournees ?? [];
}
export async function getTournee(id: string): Promise<Tournee | null> {
  const r = await fetch(`/api/prospection/tournees/${encodeURIComponent(id)}`, { cache: "no-store", headers: headers() });
  if (!r.ok) return null;
  return ((await r.json()) as { tournee?: Tournee }).tournee ?? null;
}
export async function genererTournees(): Promise<ResultatGeneration | null> {
  const r = await fetch("/api/prospection/tournees", { method: "POST", headers: jsonHeaders(), body: "{}" });
  if (!r.ok) return null;
  return (await r.json()) as ResultatGeneration;
}
export async function supprimerToutesTournees(): Promise<number | null> {
  const r = await fetch("/api/prospection/tournees", { method: "DELETE", headers: headers() });
  if (!r.ok) return null;
  return ((await r.json()) as { supprimees?: number }).supprimees ?? 0;
}

// --- Résultat terrain ---
export async function enregistrerResultat(params: {
  opportuniteId: string; tourneeId?: string; resultat: string; note?: string; negociateur?: string; relanceLe?: number | null;
}): Promise<Opportunite | null> {
  const r = await fetch("/api/prospection/resultat", { method: "POST", headers: jsonHeaders(), body: JSON.stringify(params) });
  if (!r.ok) return null;
  return ((await r.json()) as { opportunite?: Opportunite }).opportunite ?? null;
}

// --- Utilitaires d'affichage ---
// Un arrêt GPS : on privilégie les COORDONNÉES (géocodées au numéro par la BAN
// via l'ADEME) — Google route alors sur le point EXACT du bien. On évite le
// texte d'adresse, car le géocodeur de Google lui préfère souvent un commerce
// du même secteur (ex. « CENTRE AFFAIRES… »), ce qui envoie au mauvais endroit.
// L'adresse ne sert que de repli si la coordonnée manque.
function arretGps(p: { adresse?: string; ville?: string; lat: number | null; lon: number | null }): string {
  if (p.lat != null && p.lon != null) return `${p.lat},${p.lon}`;
  const adr = (p.adresse ?? "").replace(/\s+/g, " ").trim();
  if (adr) return /\d{5}/.test(adr) ? adr : [adr, p.ville].filter(Boolean).join(" ").trim();
  return "";
}

export function lienNavigation(o: { lat: number | null; lon: number | null; adresse: string; ville: string }): string {
  const q = arretGps(o);
  if (!q) return "";
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}&travelmode=driving`;
}

// Itinéraire COMPLET d'une tournée dans Google Maps (tous les arrêts, dans
// l'ordre). Chaque arrêt est passé par son ADRESSE (repli coordonnées) pour
// que Google affiche exactement les adresses de la tournée. ≤ 10 arrêts :
// origine = position actuelle + waypoints ordonnés. > 10 : format multi-points.
export function lienItineraireComplet(points: { adresse?: string; ville?: string; lat: number | null; lon: number | null }[]): string {
  const toks = points.map(arretGps).filter(Boolean);
  if (toks.length === 0) return "";
  if (toks.length === 1) return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(toks[0])}&travelmode=driving`;
  if (toks.length <= 10) {
    const dest = encodeURIComponent(toks[toks.length - 1]);
    const wp = encodeURIComponent(toks.slice(0, -1).join("|"));
    return `https://www.google.com/maps/dir/?api=1&destination=${dest}&waypoints=${wp}&travelmode=driving`;
  }
  return `https://www.google.com/maps/dir/${toks.map(encodeURIComponent).join("/")}`;
}

export function ageJours(dateIso: string): number | null {
  if (!dateIso) return null;
  const t = Date.parse(dateIso);
  return Number.isFinite(t) ? Math.floor((Date.now() - t) / 86_400_000) : null;
}
