import { getHistoryKey } from "./history";
import type { Recommande } from "./serverRecommandes";

export type { Recommande, ScanPiece, SuiviEntree } from "./serverRecommandes";
export { STATUTS_RECO, PRIORITES_RECO } from "./serverRecommandes";

const headers = () => ({ "x-history-key": getHistoryKey() });
const jsonHeaders = () => ({ "content-type": "application/json", "x-history-key": getHistoryKey() });

export async function listRecommandes(): Promise<Recommande[]> {
  try {
    const res = await fetch("/api/recommandes", { cache: "no-store", headers: headers() });
    if (!res.ok) return [];
    return ((await res.json()) as { recommandes?: Recommande[] }).recommandes ?? [];
  } catch { return []; }
}

export async function createRecommande(input: Partial<Recommande>): Promise<Recommande | null> {
  try {
    const res = await fetch("/api/recommandes", { method: "POST", headers: jsonHeaders(), body: JSON.stringify(input) });
    if (!res.ok) return null;
    return ((await res.json()) as { recommande?: Recommande }).recommande ?? null;
  } catch { return null; }
}

export async function updateRecommande(id: string, input: Partial<Recommande>): Promise<Recommande | null> {
  try {
    const res = await fetch(`/api/recommandes/${encodeURIComponent(id)}`, { method: "PUT", headers: jsonHeaders(), body: JSON.stringify(input) });
    if (!res.ok) return null;
    return ((await res.json()) as { recommande?: Recommande }).recommande ?? null;
  } catch { return null; }
}

export async function deleteRecommande(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/recommandes/${encodeURIComponent(id)}`, { method: "DELETE", headers: headers() });
    return res.ok;
  } catch { return false; }
}

export async function ajouterSuiviReco(id: string, texte: string, statut?: string): Promise<Recommande | null> {
  try {
    const res = await fetch(`/api/recommandes/${encodeURIComponent(id)}/suivi`, { method: "POST", headers: jsonHeaders(), body: JSON.stringify({ texte, statut }) });
    if (!res.ok) return null;
    return ((await res.json()) as { recommande?: Recommande }).recommande ?? null;
  } catch { return null; }
}

export async function ajouterScan(id: string, scan: { nom: string; type: "pdf" | "image"; data: string }): Promise<Recommande | null> {
  const res = await fetch(`/api/recommandes/${encodeURIComponent(id)}/scan`, { method: "POST", headers: jsonHeaders(), body: JSON.stringify(scan) });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Envoi du scan impossible");
  }
  return ((await res.json()) as { recommande?: Recommande }).recommande ?? null;
}

export async function supprimerScan(id: string, fileId: string): Promise<Recommande | null> {
  try {
    const res = await fetch(`/api/recommandes/${encodeURIComponent(id)}/scan/${encodeURIComponent(fileId)}`, { method: "DELETE", headers: headers() });
    if (!res.ok) return null;
    return ((await res.json()) as { recommande?: Recommande }).recommande ?? null;
  } catch { return null; }
}

export const urlScanReco = (id: string, fileId: string) =>
  `/api/recommandes/${encodeURIComponent(id)}/scan/${encodeURIComponent(fileId)}`;
