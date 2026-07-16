// Client de l'historique PARTAGÉ des estimations : toute l'équipe voit et
// télécharge les mêmes dossiers, depuis n'importe quel poste (stockage
// Vercel Blob côté serveur — la sauvegarde est automatique après chaque
// estimation, effectuée par l'API).

export type { HistoryFull, HistoryMeta } from "./serverHistory";
import type { HistoryFull, HistoryMeta } from "./serverHistory";

export async function listEstimations(): Promise<HistoryMeta[]> {
  const res = await fetch("/api/history", { cache: "no-store" });
  if (!res.ok) return [];
  const body = (await res.json()) as { entries?: HistoryMeta[] };
  return body.entries ?? [];
}

export async function getEstimation(id: string): Promise<HistoryFull | null> {
  const res = await fetch(`/api/history/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as HistoryFull;
}

export async function deleteEstimation(id: string): Promise<void> {
  await fetch(`/api/history/${encodeURIComponent(id)}`, { method: "DELETE" });
}
