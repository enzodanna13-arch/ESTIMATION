import { list, put } from "@vercel/blob";

// Réglage de la relance SMS automatique (clients non joints), pilotable depuis
// l'écran Réglages du CRM (sans passer par Vercel). Stocké dans Vercel Blob.

const CLE = "config/relances.json";
export interface RelancesConfig {
  actif: boolean;
  dernierRun?: number; // date du dernier passage de la tâche
  dernierEnvoi?: number; // nombre de relances au dernier passage
}

let cache: RelancesConfig | undefined;
let cacheAt = 0;

export async function lireRelancesConfig(): Promise<RelancesConfig> {
  if (cache && Date.now() - cacheAt < 15000) return cache;
  try {
    const { blobs } = await list({ prefix: CLE, limit: 1 });
    if (blobs.length === 0) { cache = { actif: false }; cacheAt = Date.now(); return cache; }
    const r = await fetch(blobs[0].url, { cache: "no-store" });
    cache = r.ok ? ((await r.json()) as RelancesConfig) : { actif: false };
  } catch {
    cache = { actif: false };
  }
  cacheAt = Date.now();
  return cache;
}

export async function ecrireRelancesConfig(patch: Partial<RelancesConfig>): Promise<RelancesConfig> {
  const actuel = await lireRelancesConfig();
  const maj = { ...actuel, ...patch };
  await put(CLE, JSON.stringify(maj), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  cache = maj; cacheAt = Date.now();
  return maj;
}
