import { createHash, timingSafeEqual } from "crypto";
import { list, put } from "@vercel/blob";
import { hashPassword, verifyPassword } from "./syndic/password";
import { verifierValeur } from "./historyAuth";

// CODE ADMIN : second niveau d'accès, au-dessus du mot de passe d'équipe.
// Le mot de passe d'équipe laisse entrer tout le monde (négociateurs) ; le code
// admin déverrouille en plus les sections de pilotage réservées au responsable
// (suivi des négociateurs, tableau de bord, transactions, sauvegarde, réglages).
//
// Deux sources possibles, comme pour le mot de passe d'équipe :
//   1. variable d'environnement ADMIN_PASSWORD (optionnelle) ;
//   2. code STOCKÉ (Vercel Blob, haché scrypt) défini depuis l'outil. Dès qu'il
//      est défini, il a la priorité.
// Amorçage : tant qu'aucun code admin n'existe, on peut en créer un en fournissant
// le mot de passe d'ÉQUIPE (que seul le responsable est censé connaître).

const CLE = "config/admin.json";
interface CodeStocke { hash: string; salt: string; updatedAt: number }

let cache: CodeStocke | null | undefined;
let cacheAt = 0;

async function lireStocke(): Promise<CodeStocke | null> {
  if (cache !== undefined && Date.now() - cacheAt < 20000) return cache;
  try {
    const { blobs } = await list({ prefix: CLE, limit: 1 });
    if (blobs.length === 0) { cache = null; cacheAt = Date.now(); return null; }
    const r = await fetch(blobs[0].url, { cache: "no-store" });
    cache = r.ok ? ((await r.json()) as CodeStocke) : null;
  } catch { cache = null; }
  cacheAt = Date.now();
  return cache;
}

function egaleEnv(valeur: string): boolean {
  const attendu = process.env.ADMIN_PASSWORD;
  if (!attendu) return false;
  const a = createHash("sha256").update(valeur ?? "").digest();
  const b = createHash("sha256").update(attendu).digest();
  return a.length === b.length && timingSafeEqual(a, b);
}

// Un code admin a-t-il déjà été configuré (stocké ou via l'environnement) ?
export async function adminConfigure(): Promise<boolean> {
  if (await lireStocke()) return true;
  return !!process.env.ADMIN_PASSWORD;
}

// La valeur correspond-elle au code admin effectif ?
export async function verifierAdmin(valeur: string): Promise<boolean> {
  if (!valeur) return false;
  const stocke = await lireStocke();
  if (stocke) return verifyPassword(valeur, stocke.salt, stocke.hash);
  return egaleEnv(valeur);
}

// Définit / change le code admin. `actuel` doit être le code admin courant OU,
// en amorçage/secours, le mot de passe d'équipe. `nouveau` : au moins 4 caractères.
export async function definirCodeAdmin(actuel: string, nouveau: string): Promise<{ ok: true } | { erreur: string }> {
  if ((nouveau ?? "").length < 4) return { erreur: "Le code admin doit faire au moins 4 caractères." };
  const configure = await adminConfigure();
  const autorise = configure
    ? ((await verifierAdmin(actuel ?? "")) || egaleEnv(actuel ?? "") || (await verifierValeur(actuel ?? "")))
    : (await verifierValeur(actuel ?? "")); // amorçage : mot de passe d'équipe
  if (!autorise) return { erreur: configure ? "Code admin (ou mot de passe d'équipe) incorrect." : "Mot de passe d'équipe incorrect." };
  const { salt, hash } = hashPassword(nouveau);
  const enreg: CodeStocke = { hash, salt, updatedAt: Date.now() };
  await put(CLE, JSON.stringify(enreg), { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
  cache = enreg; cacheAt = Date.now();
  return { ok: true };
}
