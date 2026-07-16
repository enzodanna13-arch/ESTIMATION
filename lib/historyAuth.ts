import { createHash, timingSafeEqual } from "crypto";

// Protection de l'historique partagé : le mot de passe (HISTORY_PASSWORD,
// variable d'environnement Vercel) est exigé sur toutes les routes de
// lecture/suppression. Comparaison en temps constant sur les empreintes.

export function checkHistoryPassword(request: Request): boolean {
  const expected = process.env.HISTORY_PASSWORD;
  if (!expected) return true; // pas de mot de passe configuré : accès libre
  const given = request.headers.get("x-history-key") ?? "";
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}
