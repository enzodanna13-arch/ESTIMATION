// Client de la veille de zone : appels à l'API protégée.
export type { AperçuCommune, VenteZone } from "./veilleZone";
import type { AperçuCommune, VenteZone } from "./veilleZone";
import { getHistoryKey } from "./history";

const headers = () => ({ "x-history-key": getHistoryKey() });

export async function getVeilleZone(annee: number): Promise<{ annee: number; communes: AperçuCommune[] } | null> {
  const res = await fetch(`/api/veille?annee=${annee}`, { cache: "no-store", headers: headers() });
  if (!res.ok) return null;
  return (await res.json()) as { annee: number; communes: AperçuCommune[] };
}

export async function getVentesCommune(insee: string, annee: number): Promise<VenteZone[]> {
  const res = await fetch(`/api/veille/${encodeURIComponent(insee)}?annee=${annee}`, {
    cache: "no-store",
    headers: headers(),
  });
  if (!res.ok) return [];
  const body = (await res.json()) as { ventes?: VenteZone[] };
  return body.ventes ?? [];
}
