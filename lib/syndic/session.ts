import { createHmac, timingSafeEqual } from "crypto";
import type { SyndicRole } from "./types";

// Session utilisateur du module Syndic : jeton signé (HMAC-SHA256) déposé dans
// un cookie httpOnly. Le cloisonnement est ainsi vérifié CÔTÉ SERVEUR : sans
// jeton valide, aucune route /api/syndic/* ne répond. Indépendant du mot de
// passe d'équipe du module Estimation.

export const COOKIE_NAME = "syndic_session";
const DUREE_SECONDES = 60 * 60 * 12; // 12 h

interface SessionPayload {
  userId: string;
  role: SyndicRole;
  exp: number; // timestamp seconde
}

function secret(): string {
  // SESSION_SECRET dédié en priorité ; repli sur le mot de passe d'équipe pour
  // ne jamais rester sans clé, avec un dernier repli de développement.
  return process.env.SESSION_SECRET || process.env.HISTORY_PASSWORD || "syndic-dev-secret-change-me";
}

const b64url = (buf: Buffer) => buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64url = (s: string) => Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");

function signe(dataB64: string): string {
  return b64url(createHmac("sha256", secret()).update(dataB64).digest());
}

export function creerJeton(userId: string, role: SyndicRole): string {
  const payload: SessionPayload = { userId, role, exp: Math.floor(Date.now() / 1000) + DUREE_SECONDES };
  const data = b64url(Buffer.from(JSON.stringify(payload)));
  return `${data}.${signe(data)}`;
}

export function verifierJeton(jeton: string | undefined | null): SessionPayload | null {
  if (!jeton || !jeton.includes(".")) return null;
  const [data, sig] = jeton.split(".");
  if (!data || !sig) return null;
  const attendu = signe(data);
  const a = Buffer.from(sig);
  const b = Buffer.from(attendu);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(fromB64url(data).toString()) as SessionPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function lireCookieSession(request: Request): SessionPayload | null {
  const brut = request.headers.get("cookie") ?? "";
  const trouve = brut.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!trouve) return null;
  return verifierJeton(decodeURIComponent(trouve.slice(COOKIE_NAME.length + 1)));
}

export function cookieConnexion(jeton: string): string {
  return `${COOKIE_NAME}=${encodeURIComponent(jeton)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${DUREE_SECONDES}; Secure`;
}

export function cookieDeconnexion(): string {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0; Secure`;
}
