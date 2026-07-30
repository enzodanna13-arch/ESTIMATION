// Client des DOSSIERS CLIENTS partagés : création, recherche, pièces PDF.
// Tout passe par l'API protégée par le mot de passe d'équipe.

export type { ClientDossier, PieceClient } from "./serverHistory";
export { CATEGORIES_PIECES } from "./docTypes";
import type { ClientDossier } from "./serverHistory";
import { getHistoryKey } from "./history";

const headers = () => ({ "x-history-key": getHistoryKey() });
const jsonHeaders = () => ({ "content-type": "application/json", "x-history-key": getHistoryKey() });

export async function listClients(): Promise<ClientDossier[]> {
  const res = await fetch("/api/clients", { cache: "no-store", headers: headers() });
  if (!res.ok) return [];
  const body = (await res.json()) as { dossiers?: ClientDossier[] };
  return body.dossiers ?? [];
}

export async function createClient(d: { nom: string; bien: string; negociateur: string }): Promise<ClientDossier | null> {
  const res = await fetch("/api/clients", { method: "POST", headers: jsonHeaders(), body: JSON.stringify(d) });
  if (!res.ok) return null;
  const body = (await res.json()) as { dossier?: ClientDossier };
  return body.dossier ?? null;
}

export async function getClient(id: string): Promise<ClientDossier | null> {
  const res = await fetch(`/api/clients/${encodeURIComponent(id)}`, { cache: "no-store", headers: headers() });
  if (!res.ok) return null;
  const body = (await res.json()) as { dossier?: ClientDossier };
  return body.dossier ?? null;
}

export async function deleteClient(id: string): Promise<boolean> {
  const res = await fetch(`/api/clients/${encodeURIComponent(id)}`, { method: "DELETE", headers: headers() });
  return res.ok;
}

export async function addClientFile(
  id: string,
  piece: { nom: string; categorie: string; data: string },
): Promise<ClientDossier | null> {
  const res = await fetch(`/api/clients/${encodeURIComponent(id)}/files`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(piece),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Enregistrement de la pièce impossible");
  }
  const body = (await res.json()) as { dossier?: ClientDossier };
  return body.dossier ?? null;
}

export async function deleteClientFile(id: string, fileId: string): Promise<ClientDossier | null> {
  const res = await fetch(`/api/clients/${encodeURIComponent(id)}/files/${encodeURIComponent(fileId)}`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { dossier?: ClientDossier };
  return body.dossier ?? null;
}

/** Télécharge une pièce dans le navigateur (via l'API protégée). */
export async function telechargerClientFile(id: string, fileId: string, nom: string): Promise<void> {
  const res = await fetch(`/api/clients/${encodeURIComponent(id)}/files/${encodeURIComponent(fileId)}`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error("Téléchargement impossible");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nom || "piece.pdf";
  a.click();
  URL.revokeObjectURL(url);
}

/** Récupère une pièce en base64 (pour la joindre à une génération IA). */
export async function getClientFileB64(id: string, fileId: string): Promise<string> {
  const res = await fetch(`/api/clients/${encodeURIComponent(id)}/files/${encodeURIComponent(fileId)}`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error("Pièce introuvable");
  const buf = new Uint8Array(await res.arrayBuffer());
  let bin = "";
  for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(bin);
}
