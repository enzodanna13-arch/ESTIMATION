import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

// Hachage de mot de passe avec scrypt (module crypto natif Node — aucune
// dépendance). Le mot de passe en clair n'est jamais stocké ni journalisé.

export function hashPassword(motDePasse: string): { salt: string; hash: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(motDePasse, salt, 64).toString("hex");
  return { salt, hash };
}

export function verifyPassword(motDePasse: string, salt: string, hash: string): boolean {
  if (!salt || !hash) return false;
  try {
    const attendu = Buffer.from(hash, "hex");
    const calcule = scryptSync(motDePasse, salt, attendu.length);
    return attendu.length === calcule.length && timingSafeEqual(attendu, calcule);
  } catch {
    return false;
  }
}
