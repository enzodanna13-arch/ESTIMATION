import { getHistoryKey } from "./history";
export type { AlerteDpe } from "./veilleDpe";
import type { AlerteDpe } from "./veilleDpe";

const headers = () => ({ "x-history-key": getHistoryKey() });
const jsonHeaders = () => ({ "content-type": "application/json", "x-history-key": getHistoryKey() });

export async function listAlertesVeille(): Promise<AlerteDpe[]> {
  const res = await fetch("/api/veille-dpe", { cache: "no-store", headers: headers() });
  if (!res.ok) return [];
  return ((await res.json()) as { alertes?: AlerteDpe[] }).alertes ?? [];
}

export async function analyserVeille(): Promise<{ analysees: number; nouvelles: number; total: number; alertes: AlerteDpe[] } | null> {
  const res = await fetch("/api/veille-dpe", { method: "POST", headers: jsonHeaders() });
  if (!res.ok) return null;
  return (await res.json()) as { analysees: number; nouvelles: number; total: number; alertes: AlerteDpe[] };
}

export async function majStatutVeille(id: string, statut: AlerteDpe["statut"]): Promise<AlerteDpe[]> {
  const res = await fetch("/api/veille-dpe", { method: "PATCH", headers: jsonHeaders(), body: JSON.stringify({ id, statut }) });
  if (!res.ok) return [];
  return ((await res.json()) as { alertes?: AlerteDpe[] }).alertes ?? [];
}
