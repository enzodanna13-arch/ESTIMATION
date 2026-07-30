// Client de la veille concurrente par lien.
export type { ConcurrentListing } from "./serverHistory";
import type { ConcurrentListing } from "./serverHistory";
import { getHistoryKey } from "./history";

const h = () => ({ "x-history-key": getHistoryKey() });
const hj = () => ({ "content-type": "application/json", "x-history-key": getHistoryKey() });

export async function listConcurrents(): Promise<ConcurrentListing[]> {
  const res = await fetch("/api/concurrents", { cache: "no-store", headers: h() });
  if (!res.ok) return [];
  const b = (await res.json()) as { concurrents?: ConcurrentListing[] };
  return b.concurrents ?? [];
}

export async function ajouterConcurrent(d: { url: string; ville?: string; negociateur?: string; note?: string }): Promise<ConcurrentListing> {
  const res = await fetch("/api/concurrents", { method: "POST", headers: hj(), body: JSON.stringify(d) });
  const b = (await res.json().catch(() => null)) as { concurrent?: ConcurrentListing; error?: string } | null;
  if (!res.ok || !b?.concurrent) throw new Error(b?.error ?? "Ajout impossible");
  return b.concurrent;
}

export async function majConcurrent(
  id: string,
  d: { action?: "refresh"; titre?: string; prix?: number | null; ville?: string; note?: string },
): Promise<ConcurrentListing | null> {
  const res = await fetch(`/api/concurrents/${encodeURIComponent(id)}`, { method: "POST", headers: hj(), body: JSON.stringify(d) });
  if (!res.ok) return null;
  const b = (await res.json()) as { concurrent?: ConcurrentListing };
  return b.concurrent ?? null;
}

export async function supprimerConcurrent(id: string): Promise<boolean> {
  const res = await fetch(`/api/concurrents/${encodeURIComponent(id)}`, { method: "DELETE", headers: h() });
  return res.ok;
}
