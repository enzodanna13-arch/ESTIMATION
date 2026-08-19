import { createHash, timingSafeEqual } from "crypto";

// Protection de l'historique partagé : le mot de passe (HISTORY_PASSWORD,
// variable d'environnement Vercel) est exigé sur toutes les routes de
// lecture/suppression. Comparaison en temps constant sur les empreintes.

export function checkHistoryPassword(request: Request): boolean {
  const expected = process.env.HISTORY_PASSWORD;
  if (!expected) return true; // pas de mot de passe configuré : accès libre
  const given = request.headers.get("x-history-key") ?? "";
  return compareKey(given, expected);
}

// Vérifie une valeur de mot de passe fournie autrement que par l'en-tête
// (ex. `clientPayload` du flux d'upload direct Vercel Blob, où l'en-tête
// n'est pas transmis). Même comparaison en temps constant.
export function checkHistoryKeyValue(value: string): boolean {
  const expected = process.env.HISTORY_PASSWORD;
  if (!expected) return true;
  return compareKey(value ?? "", expected);
}

function compareKey(given: string, expected: string): boolean {
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}
