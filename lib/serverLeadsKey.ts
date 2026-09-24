import { randomBytes, timingSafeEqual } from "crypto";
import { list, put } from "@vercel/blob";

// Clé d'accès dédiée à la passerelle leads (Zapier/Make/Meta), indépendante du
// mot de passe d'équipe. Générée et affichée depuis l'écran Réglages du CRM,
// stockée dans Vercel Blob (aucune action sur Vercel nécessaire). C'est un
// jeton porteur (bearer) : on le conserve en clair pour pouvoir l'afficher à
// l'utilisateur, exactement comme une clé d'API.

const CLE = "config/leadskey.json";
interface Enreg { key: string; updatedAt: number }

let cache: string | null | undefined;
let cacheAt = 0;

export async function lireCleLeads(): Promise<string> {
  if (cache !== undefined && Date.now() - cacheAt < 20000) return cache ?? "";
  try {
    const { blobs } = await list({ prefix: CLE, limit: 1 });
    if (blobs.length === 0) { cache = null; cacheAt = Date.now(); return ""; }
    const r = await fetch(blobs[0].url, { cache: "no-store" });
    const j = r.ok ? ((await r.json()) as Enreg) : null;
    cache = j?.key ?? null;
  } catch {
    cache = null;
  }
  cacheAt = Date.now();
  return cache ?? "";
}

// Génère (ou régénère) la clé et la renvoie en clair.
export async function definirCleLeads(): Promise<string> {
  const key = "lead_" + randomBytes(24).toString("hex");
  const enreg: Enreg = { key, updatedAt: Date.now() };
  await put(CLE, JSON.stringify(enreg), { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
  cache = key; cacheAt = Date.now();
  return key;
}

// Comparaison en temps constant avec la clé stockée.
export async function verifierCleLeadsStockee(valeur: string): Promise<boolean> {
  const attendue = await lireCleLeads();
  if (!attendue || !valeur) return false;
  const a = Buffer.from(attendue);
  const b = Buffer.from(valeur);
  return a.length === b.length && timingSafeEqual(a, b);
}
