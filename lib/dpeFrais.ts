import { getHistoryKey } from "./history";
import type { DpeFraisDataset } from "./serverDpeFrais";

export type { FreshDpe, DpeFraisDataset } from "./serverDpeFrais";

const headers = () => ({ "x-history-key": getHistoryKey() });

export async function chargerDpeFrais(): Promise<DpeFraisDataset | null> {
  try {
    const res = await fetch("/api/dpe-frais", { cache: "no-store", headers: headers() });
    if (!res.ok) return null;
    return ((await res.json()) as { dataset?: DpeFraisDataset }).dataset ?? null;
  } catch { return null; }
}
export async function rafraichirDpeFrais(): Promise<DpeFraisDataset | null> {
  try {
    const res = await fetch("/api/dpe-frais", { method: "POST", headers: headers() });
    if (!res.ok) return null;
    return ((await res.json()) as { dataset?: DpeFraisDataset }).dataset ?? null;
  } catch { return null; }
}
