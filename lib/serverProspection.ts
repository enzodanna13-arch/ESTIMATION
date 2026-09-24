import { del, list, put } from "@vercel/blob";
import {
  CONFIG_PROSPECTION_DEFAUT, type Opportunite, type ProspectionConfig, type Tournee,
} from "./prospectionTypes";

// Stockage PARTAGÉ (Vercel Blob) du module Prospection ciblée. Aucune base SQL
// dans ce projet : on suit le même schéma que les leads / la chasse (un blob
// versionné par objet, on garde la version la plus récente). Les listes sont
// paginées via le curseur Blob pour tenir la montée en charge.

const OPP_PREFIX = "prospection/opp/";
const OPP_ARCHIVE = "prospection/opp-archive/";
const TOURNEE_PREFIX = "prospection/tournee/";
const CONFIG_CLE = "config/prospection.json";
const SYNC_CLE = "prospection/sync-state.json";

const safe = (id: string) => (id || "").replace(/[^a-z0-9-]/gi, "");

// Liste TOUS les blobs d'un préfixe (suit le curseur : pas de plafond à 1000).
async function listAll(prefix: string): Promise<{ pathname: string; url: string }[]> {
  const out: { pathname: string; url: string }[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, limit: 1000, cursor });
    out.push(...page.blobs.map((b) => ({ pathname: b.pathname, url: b.url })));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out;
}

async function chargerJson<T>(url: string, essais = 3): Promise<T | null> {
  for (let i = 0; i < essais; i++) {
    try { const r = await fetch(url, { cache: "no-store" }); if (r.ok) return (await r.json()) as T; } catch { /* retry */ }
  }
  return null;
}

// ---------------------------------------------------------------------------
// CONFIGURATION (avec petit cache mémoire de 15 s).
let cfgCache: ProspectionConfig | undefined;
let cfgAt = 0;

export async function getConfigProspection(): Promise<ProspectionConfig> {
  if (cfgCache !== undefined && Date.now() - cfgAt < 15000) return cfgCache;
  try {
    const { blobs } = await list({ prefix: CONFIG_CLE, limit: 1 });
    if (blobs.length > 0) {
      const c = await chargerJson<Partial<ProspectionConfig>>(blobs[0].url);
      if (c) {
        cfgCache = fusionnerConfig(c);
        cfgAt = Date.now();
        return cfgCache;
      }
    }
  } catch { /* défaut ci-dessous */ }
  cfgCache = { ...CONFIG_PROSPECTION_DEFAUT };
  cfgAt = Date.now();
  return cfgCache;
}

// Fusionne une config stockée (potentiellement partielle / ancienne) avec les
// défauts, pour ne jamais planter sur un champ ajouté après coup.
function fusionnerConfig(c: Partial<ProspectionConfig>): ProspectionConfig {
  const d = CONFIG_PROSPECTION_DEFAUT;
  return {
    ...d,
    ...c,
    coefficients: { ...d.coefficients, ...(c.coefficients ?? {}) },
    seuils: { ...d.seuils, ...(c.seuils ?? {}) },
    // Migration auto des paramètres de tournée : si la config stockée n'est pas
    // à la dernière version, on repart des défauts (ex. 10 adresses/tournée
    // pour tenir dans le GPS). Une fois ré-enregistrée, les valeurs sont gardées.
    tournee: c.tourneeVersion === d.tourneeVersion ? { ...d.tournee, ...(c.tournee ?? {}) } : { ...d.tournee },
    tourneeVersion: d.tourneeVersion,
    relances: { ...d.relances, ...(c.relances ?? {}) },
    // Migration auto de la liste des communes : si la config stockée n'est pas
    // à la dernière version de la zone par défaut, on remplace par la zone
    // courante (retrait d'Istres, ajout Fos/Ensuès/Châteauneuf…). Une fois
    // ré-enregistrée par l'utilisateur, ses propres communes sont conservées.
    communes: c.communesVersion === d.communesVersion && c.communes ? c.communes : d.communes,
    communesVersion: d.communesVersion,
    secteurs: c.secteurs ?? d.secteurs,
    typesBien: c.typesBien ?? d.typesBien,
  };
}

export async function saveConfigProspection(patch: Partial<ProspectionConfig>): Promise<ProspectionConfig> {
  const actuel = await getConfigProspection();
  const maj = fusionnerConfig({ ...actuel, ...patch, updatedAt: Date.now() });
  await put(CONFIG_CLE, JSON.stringify(maj), { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
  cfgCache = maj; cfgAt = Date.now();
  return maj;
}

// ---------------------------------------------------------------------------
// ÉTAT DE SYNCHRONISATION (incrémental) : dernier DPE établi vu par commune.
export interface SyncState {
  communes: Record<string, { dernierEtablissement: string; lastRunAt: number; nbConnus: number }>;
  lastRunAt: number;
}

export async function getSyncState(): Promise<SyncState> {
  try {
    const { blobs } = await list({ prefix: SYNC_CLE, limit: 1 });
    if (blobs.length > 0) {
      const s = await chargerJson<SyncState>(blobs[0].url);
      if (s) return { communes: s.communes ?? {}, lastRunAt: s.lastRunAt ?? 0 };
    }
  } catch { /* défaut */ }
  return { communes: {}, lastRunAt: 0 };
}

export async function saveSyncState(state: SyncState): Promise<void> {
  await put(SYNC_CLE, JSON.stringify(state), { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
}

// ---------------------------------------------------------------------------
// OPPORTUNITÉS
function versionDe(pathname: string): number { const m = pathname.match(/~(\d+)\.json$/); return m ? Number(m[1]) : 0; }

async function putOpp(opp: Opportunite): Promise<void> {
  const nom = `${OPP_PREFIX}${safe(opp.id)}~${opp.updatedAt}.json`;
  await put(nom, JSON.stringify(opp), { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
  try {
    const { blobs } = await list({ prefix: `${OPP_PREFIX}${safe(opp.id)}~`, limit: 100 });
    const vieux = blobs.filter((b) => versionDe(b.pathname) < opp.updatedAt).map((b) => b.url);
    if (vieux.length > 0) await del(vieux);
  } catch { /* la dernière version prime */ }
}

export async function saveOpportunite(opp: Opportunite): Promise<Opportunite> {
  opp.updatedAt = Date.now();
  await putOpp(opp);
  return opp;
}

// Enregistre plusieurs opportunités (sync) — écriture PARALLÈLE bornée et SANS
// nettoyage des anciennes versions (trop coûteux en masse ; listOpportunites
// ne garde de toute façon que la version la plus récente par id). Tolérant aux
// erreurs unitaires. Conçu pour rester dans le temps limite d'une requête.
export async function saveOpportunitesBatch(opps: Opportunite[]): Promise<void> {
  const CONC = 12;
  let i = 0;
  const worker = async () => {
    while (i < opps.length) {
      const o = opps[i++];
      o.updatedAt = Date.now();
      const nom = `${OPP_PREFIX}${safe(o.id)}~${o.updatedAt}.json`;
      try {
        await put(nom, JSON.stringify(o), { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
      } catch { /* on continue le batch */ }
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONC, opps.length || 1) }, worker));
}

export async function listOpportunites(): Promise<Opportunite[]> {
  const blobs = await listAll(OPP_PREFIX);
  const parId = new Map<string, { updatedAt: number; url: string }>();
  for (const b of blobs) {
    const m = b.pathname.slice(OPP_PREFIX.length).match(/^(.+)~(\d+)\.json$/);
    if (!m) continue;
    const id = m[1]; const updatedAt = Number(m[2]);
    const prev = parId.get(id);
    if (!prev || updatedAt > prev.updatedAt) parId.set(id, { updatedAt, url: b.url });
  }
  const opps = await Promise.all([...parId.values()].map((v) => chargerJson<Opportunite>(v.url)));
  return opps.filter((o): o is Opportunite => o !== null && !o.archived).sort((a, b) => b.score - a.score || b.detecteLe - a.detecteLe);
}

export async function getOpportunite(id: string): Promise<Opportunite | null> {
  const { blobs } = await list({ prefix: `${OPP_PREFIX}${safe(id)}~`, limit: 100 });
  if (blobs.length === 0) return null;
  const dernier = blobs.reduce((a, b) => (versionDe(b.pathname) > versionDe(a.pathname) ? b : a));
  return chargerJson<Opportunite>(dernier.url);
}

export async function deleteOpportunite(id: string): Promise<void> {
  const opp = await getOpportunite(id);
  if (opp) {
    try {
      await put(`${OPP_ARCHIVE}${safe(id)}~${Date.now()}.json`, JSON.stringify({ ...opp, archived: true }), {
        access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json",
      });
    } catch { /* archive best-effort */ }
  }
  const { blobs } = await list({ prefix: `${OPP_PREFIX}${safe(id)}~`, limit: 100 });
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
}

// ---------------------------------------------------------------------------
// TOURNÉES
export async function saveTournee(t: Tournee): Promise<Tournee> {
  t.updatedAt = Date.now();
  const nom = `${TOURNEE_PREFIX}${safe(t.id)}~${t.updatedAt}.json`;
  await put(nom, JSON.stringify(t), { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
  try {
    const { blobs } = await list({ prefix: `${TOURNEE_PREFIX}${safe(t.id)}~`, limit: 100 });
    const vieux = blobs.filter((b) => versionDe(b.pathname) < t.updatedAt).map((b) => b.url);
    if (vieux.length > 0) await del(vieux);
  } catch { /* ok */ }
  return t;
}

export async function listTournees(): Promise<Tournee[]> {
  const blobs = await listAll(TOURNEE_PREFIX);
  const parId = new Map<string, { updatedAt: number; url: string }>();
  for (const b of blobs) {
    const m = b.pathname.slice(TOURNEE_PREFIX.length).match(/^(.+)~(\d+)\.json$/);
    if (!m) continue;
    const id = m[1]; const updatedAt = Number(m[2]);
    const prev = parId.get(id);
    if (!prev || updatedAt > prev.updatedAt) parId.set(id, { updatedAt, url: b.url });
  }
  const ts = await Promise.all([...parId.values()].map((v) => chargerJson<Tournee>(v.url)));
  return ts.filter((t): t is Tournee => t !== null).sort((a, b) => b.date - a.date);
}

export async function getTournee(id: string): Promise<Tournee | null> {
  const { blobs } = await list({ prefix: `${TOURNEE_PREFIX}${safe(id)}~`, limit: 100 });
  if (blobs.length === 0) return null;
  const dernier = blobs.reduce((a, b) => (versionDe(b.pathname) > versionDe(a.pathname) ? b : a));
  return chargerJson<Tournee>(dernier.url);
}

export async function deleteTournee(id: string): Promise<void> {
  const { blobs } = await list({ prefix: `${TOURNEE_PREFIX}${safe(id)}~`, limit: 100 });
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
}

// Supprime TOUTES les tournées (purge). Renvoie le nombre de fichiers supprimés.
export async function deleteToutesTournees(): Promise<number> {
  const blobs = await listAll(TOURNEE_PREFIX);
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
  return blobs.length;
}
