import { getHistoryKey } from "./history";
import { getAdminKey } from "./admin";
import type { ObjectifsCA } from "./serverObjectifs";

export type { ObjectifsCA } from "./serverObjectifs";

export const OBJECTIF_CA_DEFAUT = 300000; // objectif annuel par défaut (€)

export async function chargerObjectifs(): Promise<ObjectifsCA> {
  try {
    const res = await fetch("/api/objectifs-ca", { cache: "no-store", headers: { "x-history-key": getHistoryKey() } });
    if (!res.ok) return {};
    return ((await res.json()) as { objectifs?: ObjectifsCA }).objectifs ?? {};
  } catch { return {}; }
}

// Réservé à l'admin (code admin dans x-admin-key).
export async function definirObjectif(annee: number, montant: number): Promise<ObjectifsCA | null> {
  try {
    const res = await fetch("/api/objectifs-ca", {
      method: "PUT",
      headers: { "content-type": "application/json", "x-history-key": getHistoryKey(), "x-admin-key": getAdminKey() },
      body: JSON.stringify({ annee, montant }),
    });
    if (!res.ok) return null;
    return ((await res.json()) as { objectifs?: ObjectifsCA }).objectifs ?? {};
  } catch { return null; }
}
