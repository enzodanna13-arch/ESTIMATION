import { getHistoryKey } from "./history";
import type { MandatVente } from "./mandatsVenteTypes";

export type { MandatVente } from "./mandatsVenteTypes";
export { TYPES_MANDAT, STATUTS_MANDAT, TYPES_BIEN_MANDAT, EXTERIEURS_MANDAT, mandatVide, bienDepuisMandat, mandatRapprochable } from "./mandatsVenteTypes";

const headers = () => ({ "x-history-key": getHistoryKey() });
const jsonHeaders = () => ({ "content-type": "application/json", "x-history-key": getHistoryKey() });

export async function listMandats(): Promise<MandatVente[]> {
  try {
    const res = await fetch("/api/mandats", { cache: "no-store", headers: headers() });
    if (!res.ok) return [];
    return ((await res.json()) as { mandats?: MandatVente[] }).mandats ?? [];
  } catch { return []; }
}

export async function saveMandat(input: Partial<MandatVente>): Promise<MandatVente | null> {
  try {
    const estMaj = Boolean(input.id);
    const url = estMaj ? `/api/mandats/${encodeURIComponent(input.id!)}` : "/api/mandats";
    const res = await fetch(url, { method: estMaj ? "PUT" : "POST", headers: jsonHeaders(), body: JSON.stringify(input) });
    if (!res.ok) return null;
    return ((await res.json()) as { mandat?: MandatVente }).mandat ?? null;
  } catch { return null; }
}

export async function deleteMandat(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/mandats/${encodeURIComponent(id)}`, { method: "DELETE", headers: headers() });
    return res.ok;
  } catch { return false; }
}
