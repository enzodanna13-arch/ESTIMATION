import { getHistoryKey } from "./history";
import type { ClientEstimationMeta, ClientEstimationRecord } from "./clientTypes";

// Client (back-office) de la rubrique « Estimations clients ». Protégé par le
// mot de passe d'équipe (x-history-key), comme le reste de l'outil négociateur.

const headers = () => ({ "x-history-key": getHistoryKey() });
const jsonHeaders = () => ({ "content-type": "application/json", "x-history-key": getHistoryKey() });

export async function listClientEstimations(): Promise<ClientEstimationMeta[]> {
  try {
    const res = await fetch("/api/client-estimations", { cache: "no-store", headers: headers() });
    if (!res.ok) return [];
    return ((await res.json()).estimations ?? []) as ClientEstimationMeta[];
  } catch { return []; }
}

export async function getClientEstimation(id: string): Promise<ClientEstimationRecord | null> {
  try {
    const res = await fetch(`/api/client-estimations/${encodeURIComponent(id)}`, { cache: "no-store", headers: headers() });
    if (!res.ok) return null;
    return ((await res.json()).estimation ?? null) as ClientEstimationRecord | null;
  } catch { return null; }
}

export async function majClientEstimation(
  id: string,
  patch: { statut?: string; ajouterNote?: string; auteur?: string },
): Promise<ClientEstimationRecord | null> {
  try {
    const res = await fetch(`/api/client-estimations/${encodeURIComponent(id)}`, {
      method: "PUT", headers: jsonHeaders(), body: JSON.stringify(patch),
    });
    if (!res.ok) return null;
    return ((await res.json()).estimation ?? null) as ClientEstimationRecord | null;
  } catch { return null; }
}

export function urlPhotoBackoffice(id: string, idx: number): string {
  return `/api/client-estimations/${encodeURIComponent(id)}/photo/${idx}`;
}
