// Anti-abus du tunnel public (endpoint IA payant, ouvert à Internet).
// Trois garde-fous, tous côté serveur, aucun secret exposé :
//   1. CAPTCHA Cloudflare Turnstile (anti-bot) ;
//   2. PLAFOND quotidien global d'estimations ;
//   3. LIMITE anti-spam par contact (même tel/email trop rapproché).
// Aucune clé n'est jamais renvoyée au client ni journalisée.

// Vérifie le jeton Turnstile auprès de Cloudflare. Si TURNSTILE_SECRET n'est
// PAS configuré, la vérification est considérée désactivée (renvoie true) —
// comme HISTORY_PASSWORD non défini ouvre l'accès. Le secret DOIT être défini
// avant la mise en ligne publique (décision « captcha obligatoire »).
export async function verifierTurnstile(token: string | undefined, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) return true; // non configuré → désactivé (obligatoire avant go-live)
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false; // en cas d'incident réseau du vérificateur, on refuse (fail-closed)
  }
}

// Plafond quotidien global (protège la facture IA). Défaut prudent : 300/jour.
export function plafondQuotidien(): number {
  const n = Number(process.env.CLIENT_DAILY_CAP);
  return Number.isFinite(n) && n > 0 ? n : 300;
}

// Fenêtre anti-spam par contact (millisecondes). Défaut : 5 minutes.
export function fenetreAntiSpamMs(): number {
  const n = Number(process.env.CLIENT_MIN_INTERVAL_MIN);
  const minutes = Number.isFinite(n) && n > 0 ? n : 5;
  return minutes * 60 * 1000;
}

// Extrait l'IP appelante des en-têtes de proxy (best-effort, pour Turnstile).
export function ipDe(request: Request): string | null {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip");
}
