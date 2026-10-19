import { getHistoryKey } from "./history";
import type { CoproDataset } from "./serverCopros";

export type { Copro, DpeCopro, CoproDataset } from "./serverCopros";

const headers = () => ({ "x-history-key": getHistoryKey() });

export async function chargerCopros(): Promise<CoproDataset | null> {
  try {
    const res = await fetch("/api/copros", { cache: "no-store", headers: headers() });
    if (!res.ok) return null;
    return ((await res.json()) as { dataset?: CoproDataset }).dataset ?? null;
  } catch { return null; }
}

// Force le recalcul (RNC + DPE). Peut être long (30–90 s).
export async function rafraichirCopros(): Promise<CoproDataset | null> {
  try {
    const res = await fetch("/api/copros", { method: "POST", headers: headers() });
    if (!res.ok) return null;
    return ((await res.json()) as { dataset?: CoproDataset }).dataset ?? null;
  } catch { return null; }
}
