import { getHistoryKey } from "./history";
import type { SyndicProspectMap } from "./serverSyndicProspect";

export type { SyndicProspect, SyndicProspectMap } from "./serverSyndicProspect";
export { STATUTS_SYNDIC } from "./serverSyndicProspect";

const headers = () => ({ "x-history-key": getHistoryKey() });
const jsonHeaders = () => ({ "content-type": "application/json", "x-history-key": getHistoryKey() });

export async function chargerSyndicProspect(): Promise<SyndicProspectMap> {
  try {
    const res = await fetch("/api/syndic-prospect", { cache: "no-store", headers: headers() });
    if (!res.ok) return {};
    return ((await res.json()) as { prospect?: SyndicProspectMap }).prospect ?? {};
  } catch { return {}; }
}

export async function sauverSyndicProspect(coproId: string, statut: string, notes: string): Promise<SyndicProspectMap | null> {
  try {
    const res = await fetch("/api/syndic-prospect", { method: "PUT", headers: jsonHeaders(), body: JSON.stringify({ coproId, statut, notes }) });
    if (!res.ok) return null;
    return ((await res.json()) as { prospect?: SyndicProspectMap }).prospect ?? null;
  } catch { return null; }
}
