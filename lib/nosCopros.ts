import { getHistoryKey } from "./history";
import type { NosCoprosDataset } from "./serverNosCopros";

export type { NosCopro, NosCoprosDataset } from "./serverNosCopros";

const headers = () => ({ "x-history-key": getHistoryKey() });

export async function chargerNosCopros(): Promise<NosCoprosDataset | null> {
  try {
    const res = await fetch("/api/nos-copros", { cache: "no-store", headers: headers() });
    if (!res.ok) return null;
    return ((await res.json()) as { dataset?: NosCoprosDataset }).dataset ?? null;
  } catch { return null; }
}

export async function rafraichirNosCopros(): Promise<NosCoprosDataset | null> {
  try {
    const res = await fetch("/api/nos-copros", { method: "POST", headers: headers() });
    if (!res.ok) return null;
    return ((await res.json()) as { dataset?: NosCoprosDataset }).dataset ?? null;
  } catch { return null; }
}
