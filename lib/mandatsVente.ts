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

export async function ajouterPhotoMandat(id: string, data: string): Promise<MandatVente | null> {
  const res = await fetch(`/api/mandats/${encodeURIComponent(id)}/photos`, { method: "POST", headers: jsonHeaders(), body: JSON.stringify({ data }) });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Envoi de la photo impossible");
  }
  return ((await res.json()) as { mandat?: MandatVente }).mandat ?? null;
}

export async function supprimerPhotoMandat(id: string, photoId: string): Promise<MandatVente | null> {
  try {
    const res = await fetch(`/api/mandats/${encodeURIComponent(id)}/photos/${encodeURIComponent(photoId)}`, { method: "DELETE", headers: headers() });
    if (!res.ok) return null;
    return ((await res.json()) as { mandat?: MandatVente }).mandat ?? null;
  } catch { return null; }
}

export const urlPhotoMandat = (id: string, photoId: string) =>
  `/api/mandats/${encodeURIComponent(id)}/photos/${encodeURIComponent(photoId)}`;

// Compresse une photo sous la limite serverless (~4,5 Mo) -> base64 JPEG.
export async function compresserPhoto(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const PALIERS = [{ px: 1600, q: 0.78 }, { px: 1280, q: 0.72 }, { px: 1024, q: 0.68 }];
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
  return data;
}
