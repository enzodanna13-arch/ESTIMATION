import { createHash, timingSafeEqual } from "crypto";
import { list, put } from "@vercel/blob";
import { hashPassword, verifyPassword } from "./syndic/password";

// Protection de l'outil (mot de passe d'équipe). Deux sources possibles :
//  1. la variable d'environnement HISTORY_PASSWORD (valeur d'origine, gérée sur
//     Vercel) — sert aussi de clé de SECOURS pour réinitialiser le mot de passe ;
//  2. un mot de passe STOCKÉ (Vercel Blob, haché avec scrypt) défini depuis
//     l'écran « Réglages » de l'outil. Dès qu'il est défini, il a la PRIORITÉ
//     pour la connexion : l'ancien mot de passe d'environnement ne permet plus
//     de se connecter (il reste seulement utilisable pour réinitialiser).

const CLE = "config/motdepasse.json";
interface MotDePasseStocke { hash: string; salt: string; updatedAt: number }

// Petit cache mémoire (20 s) pour éviter une lecture Blob à chaque requête.
let cache: MotDePasseStocke | null | undefined;
let cacheAt = 0;

async function lireStocke(): Promise<MotDePasseStocke | null> {
  if (cache !== undefined && Date.now() - cacheAt < 20000) return cache;
  try {
    const { blobs } = await list({ prefix: CLE, limit: 1 });
    if (blobs.length === 0) { cache = null; cacheAt = Date.now(); return null; }
    const r = await fetch(blobs[0].url, { cache: "no-store" });
    cache = r.ok ? ((await r.json()) as MotDePasseStocke) : null;
  } catch { cache = null; }
  cacheAt = Date.now();
  return cache;
}

// Comparaison en temps constant avec le mot de passe d'ENVIRONNEMENT.
function egaleEnv(valeur: string): boolean {
  const attendu = process.env.HISTORY_PASSWORD;
  if (!attendu) return false;
  const a = createHash("sha256").update(valeur ?? "").digest();
  const b = createHash("sha256").update(attendu).digest();
  return a.length === b.length && timingSafeEqual(a, b);
}

// Une valeur correspond-elle au mot de passe d'équipe EFFECTIF (connexion) ?
export async function verifierValeur(valeur: string): Promise<boolean> {
  const stocke = await lireStocke();
  if (stocke) return verifyPassword(valeur ?? "", stocke.salt, stocke.hash);
  if (!process.env.HISTORY_PASSWORD) return true; // aucun mot de passe configuré → accès libre (historique)
  return egaleEnv(valeur ?? "");
}

// Vérifie l'accès depuis l'en-tête x-history-key d'une requête.
export async function verifierAccesEquipe(request: Request): Promise<boolean> {
  return verifierValeur(request.headers.get("x-history-key") ?? "");
}

// Vérifie une valeur fournie autrement (ex. clientPayload de l'upload direct Blob).
export async function verifierCleEquipe(valeur: string): Promise<boolean> {
  return verifierValeur(valeur ?? "");
}

// Y a-t-il déjà un mot de passe défini depuis l'outil ?
export async function motDePasseDefini(): Promise<boolean> {
  return (await lireStocke()) !== null;
}

// Définit / change le mot de passe stocké. `actuel` doit être le mot de passe
// effectif courant OU le mot de passe d'environnement (secours). `nouveau` doit
// faire au moins 6 caractères.
export async function definirMotDePasseEquipe(actuel: string, nouveau: string): Promise<{ ok: true } | { erreur: string }> {
  if ((nouveau ?? "").length < 6) return { erreur: "Le nouveau mot de passe doit faire au moins 6 caractères." };
  const okActuel = (await verifierValeur(actuel ?? "")) || egaleEnv(actuel ?? "");
  if (!okActuel) return { erreur: "Le mot de passe actuel est incorrect." };
  const { salt, hash } = hashPassword(nouveau);
  const enreg: MotDePasseStocke = { hash, salt, updatedAt: Date.now() };
  await put(CLE, JSON.stringify(enreg), { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
  cache = enreg; cacheAt = Date.now();
  return { ok: true };
}
