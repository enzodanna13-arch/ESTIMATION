import { getHistoryKey } from "./history";
import type { Sinistre } from "./serverSinistres";

export type { Sinistre, PhotoSinistre, DocSinistre, SuiviEntree } from "./serverSinistres";
export { STATUTS_SINISTRE, MOTIFS_SINISTRE } from "./serverSinistres";

const headers = () => ({ "x-history-key": getHistoryKey() });
const jsonHeaders = () => ({ "content-type": "application/json", "x-history-key": getHistoryKey() });

export async function listSinistres(): Promise<Sinistre[]> {
  try {
    const res = await fetch("/api/sinistres", { cache: "no-store", headers: headers() });
    if (!res.ok) return [];
    return ((await res.json()) as { sinistres?: Sinistre[] }).sinistres ?? [];
  } catch { return []; }
}

export async function createSinistre(input: Partial<Sinistre>): Promise<Sinistre | null> {
  try {
    const res = await fetch("/api/sinistres", { method: "POST", headers: jsonHeaders(), body: JSON.stringify(input) });
    if (!res.ok) return null;
    return ((await res.json()) as { sinistre?: Sinistre }).sinistre ?? null;
  } catch { return null; }
}

export async function updateSinistre(id: string, input: Partial<Sinistre>): Promise<Sinistre | null> {
  try {
    const res = await fetch(`/api/sinistres/${encodeURIComponent(id)}`, { method: "PUT", headers: jsonHeaders(), body: JSON.stringify(input) });
    if (!res.ok) return null;
    return ((await res.json()) as { sinistre?: Sinistre }).sinistre ?? null;
  } catch { return null; }
}

export async function deleteSinistre(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/sinistres/${encodeURIComponent(id)}`, { method: "DELETE", headers: headers() });
    return res.ok;
  } catch { return false; }
}

export async function ajouterSuivi(id: string, texte: string, statut?: string): Promise<Sinistre | null> {
  try {
    const res = await fetch(`/api/sinistres/${encodeURIComponent(id)}/suivi`, { method: "POST", headers: jsonHeaders(), body: JSON.stringify({ texte, statut }) });
    if (!res.ok) return null;
    return ((await res.json()) as { sinistre?: Sinistre }).sinistre ?? null;
  } catch { return null; }
}

export async function ajouterPhoto(id: string, photo: { nom: string; legende: string; data: string }): Promise<Sinistre | null> {
  const res = await fetch(`/api/sinistres/${encodeURIComponent(id)}/photos`, { method: "POST", headers: jsonHeaders(), body: JSON.stringify(photo) });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Envoi de la photo impossible");
  }
  return ((await res.json()) as { sinistre?: Sinistre }).sinistre ?? null;
}

export async function modifierPhoto(id: string, photoId: string, nom: string, legende: string): Promise<Sinistre | null> {
  try {
    const res = await fetch(`/api/sinistres/${encodeURIComponent(id)}/photos/${encodeURIComponent(photoId)}`, { method: "PUT", headers: jsonHeaders(), body: JSON.stringify({ nom, legende }) });
    if (!res.ok) return null;
    return ((await res.json()) as { sinistre?: Sinistre }).sinistre ?? null;
  } catch { return null; }
}

export async function supprimerPhoto(id: string, photoId: string): Promise<Sinistre | null> {
  try {
    const res = await fetch(`/api/sinistres/${encodeURIComponent(id)}/photos/${encodeURIComponent(photoId)}`, { method: "DELETE", headers: headers() });
    if (!res.ok) return null;
    return ((await res.json()) as { sinistre?: Sinistre }).sinistre ?? null;
  } catch { return null; }
}

export const urlPhotoSinistre = (id: string, photoId: string) =>
  `/api/sinistres/${encodeURIComponent(id)}/photos/${encodeURIComponent(photoId)}`;

export async function ajouterDocument(id: string, doc: { nom: string; data: string }): Promise<Sinistre | null> {
  const res = await fetch(`/api/sinistres/${encodeURIComponent(id)}/documents`, { method: "POST", headers: jsonHeaders(), body: JSON.stringify(doc) });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Envoi du document impossible");
  }
  return ((await res.json()) as { sinistre?: Sinistre }).sinistre ?? null;
}

export async function supprimerDocument(id: string, docId: string): Promise<Sinistre | null> {
  try {
    const res = await fetch(`/api/sinistres/${encodeURIComponent(id)}/documents/${encodeURIComponent(docId)}`, { method: "DELETE", headers: headers() });
    if (!res.ok) return null;
    return ((await res.json()) as { sinistre?: Sinistre }).sinistre ?? null;
  } catch { return null; }
}

export const urlDocumentSinistre = (id: string, docId: string) =>
  `/api/sinistres/${encodeURIComponent(id)}/documents/${encodeURIComponent(docId)}`;

// Compresse une photo (fichier appareil) sous la limite serverless (~4,5 Mo de
// corps de requête) et renvoie le base64 JPEG prêt à l'envoi.
export async function compresserPhoto(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const PALIERS = [
    { px: 2000, q: 0.82 },
    { px: 1600, q: 0.78 },
    { px: 1280, q: 0.72 },
    { px: 1024, q: 0.68 },
  ];
  let data = "";
  for (const p of PALIERS) {
    const scale = Math.min(1, p.px / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas indisponible");
    ctx.drawImage(bitmap, 0, 0, w, h);
    data = canvas.toDataURL("image/jpeg", p.q).split(",")[1];
    if (data.length <= 3_600_000) break;
  }
  bitmap.close();
  if (data.length > 3_600_000) throw new Error("Photo trop lourde même compressée");
  return data;
}
