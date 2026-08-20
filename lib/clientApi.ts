// Client (navigateur) du tunnel public IA Estimation Client. Aucune clé, aucun
// mot de passe : l'endpoint est public et protégé côté serveur (Turnstile,
// plafonds). Sert le tunnel et la page de résultat.

import type { ClientEstimationInput, DossierClientPublic } from "./clientTypes";

export interface ResultatLancement {
  status: "ready" | "pending";
  token: string;
  completude?: number;
  prixEstime?: number;
  fourchetteBasse?: number;
  fourchetteHaute?: number;
  message?: string;
}

/** Lance une estimation. Renvoie { erreur } (message lisible) en cas d'échec. */
export async function lancerEstimation(
  input: ClientEstimationInput,
): Promise<{ resultat?: ResultatLancement; erreur?: string }> {
  try {
    const res = await fetch("/api/client/estimate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { erreur: (data as { error?: string }).error ?? "Une erreur est survenue. Merci de réessayer." };
    return { resultat: data as ResultatLancement };
  } catch {
    return { erreur: "Service momentanément indisponible. Merci de réessayer dans un instant." };
  }
}

/** Récupère un dossier client par token (page de résultat). */
export async function getDossier(token: string): Promise<DossierClientPublic | null> {
  try {
    const res = await fetch(`/api/client/estimation/${encodeURIComponent(token)}`, { cache: "no-store" });
    if (!res.ok) return null;
    return ((await res.json()) as { dossier?: DossierClientPublic }).dossier ?? null;
  } catch {
    return null;
  }
}

/** URL d'une photo du dossier (servie par token). */
export function urlPhoto(token: string, idx: number): string {
  return `/api/client/estimation/${encodeURIComponent(token)}/photo/${idx}`;
}

/** Demande de rappel depuis le dossier (remonte dans le back-office). */
export async function demanderRappel(token: string): Promise<boolean> {
  try {
    const res = await fetch("/api/client/rappel", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
