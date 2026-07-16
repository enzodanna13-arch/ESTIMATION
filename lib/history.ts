// Client de l'historique PARTAGÉ des estimations : toute l'équipe voit et
// télécharge les mêmes dossiers, depuis n'importe quel poste — protégé par
// le mot de passe d'équipe (vérifié par le serveur à chaque requête).

export type { HistoryFull, HistoryMeta } from "./serverHistory";
import type { HistoryFull, HistoryMeta } from "./serverHistory";

const KEY_STORAGE = "estimation-history-key";

export function getHistoryKey(): string {
  try {
    return sessionStorage.getItem(KEY_STORAGE) ?? "";
  } catch {
    return "";
  }
}

export function setHistoryKey(key: string): void {
  try {
    sessionStorage.setItem(KEY_STORAGE, key);
  } catch {
    /* navigation privée : le déverrouillage ne durera que la page */
  }
}

const headers = () => ({ "x-history-key": getHistoryKey() });

export class HistoryLockedError extends Error {
  constructor() {
    super("Mot de passe requis");
  }
}

export async function listEstimations(): Promise<HistoryMeta[]> {
  const res = await fetch("/api/history", { cache: "no-store", headers: headers() });
  if (res.status === 401) throw new HistoryLockedError();
  if (!res.ok) return [];
  const body = (await res.json()) as { entries?: HistoryMeta[] };
  return body.entries ?? [];
}

export async function getEstimation(id: string): Promise<HistoryFull | null> {
  const res = await fetch(`/api/history/${encodeURIComponent(id)}`, {
    cache: "no-store",
    headers: headers(),
  });
  if (res.status === 401) throw new HistoryLockedError();
  if (!res.ok) return null;
  return (await res.json()) as HistoryFull;
}

export async function deleteEstimation(id: string): Promise<void> {
  await fetch(`/api/history/${encodeURIComponent(id)}`, { method: "DELETE", headers: headers() });
}
