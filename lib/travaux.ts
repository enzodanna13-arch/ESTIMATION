import { getHistoryKey } from "./history";
import type { DossierTravaux, PhotoTravaux } from "./travauxBareme";

export type { DossierTravaux, PhotoTravaux, LigneTravaux, PosteBareme, UniteTravaux } from "./travauxBareme";
export { POSTES_TRAVAUX, CATEGORIES_TRAVAUX, posteParId, totalLigne, chiffrage } from "./travauxBareme";

const headers = () => ({ "x-history-key": getHistoryKey() });
const jsonHeaders = () => ({ "content-type": "application/json", "x-history-key": getHistoryKey() });

export async function listTravaux(): Promise<DossierTravaux[]> {
  try {
    const res = await fetch("/api/travaux", { cache: "no-store", headers: headers() });
    if (!res.ok) return [];
    return ((await res.json()) as { dossiers?: DossierTravaux[] }).dossiers ?? [];
  } catch { return []; }
}

export async function createTravaux(input: Partial<DossierTravaux>): Promise<DossierTravaux | null> {
  try {
    const res = await fetch("/api/travaux", { method: "POST", headers: jsonHeaders(), body: JSON.stringify(input) });
    if (!res.ok) return null;
    return ((await res.json()) as { dossier?: DossierTravaux }).dossier ?? null;
  } catch { return null; }
}

export async function updateTravaux(id: string, input: Partial<DossierTravaux>): Promise<DossierTravaux | null> {
  try {
    const res = await fetch(`/api/travaux/${encodeURIComponent(id)}`, { method: "PUT", headers: jsonHeaders(), body: JSON.stringify(input) });
    if (!res.ok) return null;
    return ((await res.json()) as { dossier?: DossierTravaux }).dossier ?? null;
  } catch { return null; }
}

export async function deleteTravaux(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/travaux/${encodeURIComponent(id)}`, { method: "DELETE", headers: headers() });
    return res.ok;
  } catch { return false; }
}

export async function ajouterPhoto(
  id: string,
  photo: { nom: string; piece: string; etat: string; legendeAvant: string; legendeApres: string; data: string },
): Promise<DossierTravaux | null> {
  const res = await fetch(`/api/travaux/${encodeURIComponent(id)}/photos`, { method: "POST", headers: jsonHeaders(), body: JSON.stringify(photo) });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Envoi de la photo impossible");
  }
  return ((await res.json()) as { dossier?: DossierTravaux }).dossier ?? null;
}

export async function modifierPhoto(
  id: string,
  photoId: string,
  champs: Partial<Pick<PhotoTravaux, "nom" | "piece" | "etat" | "legendeAvant" | "legendeApres">>,
): Promise<DossierTravaux | null> {
  try {
    const res = await fetch(`/api/travaux/${encodeURIComponent(id)}/photos/${encodeURIComponent(photoId)}`, { method: "PUT", headers: jsonHeaders(), body: JSON.stringify(champs) });
    if (!res.ok) return null;
    return ((await res.json()) as { dossier?: DossierTravaux }).dossier ?? null;
  } catch { return null; }
}

export async function supprimerPhoto(id: string, photoId: string): Promise<DossierTravaux | null> {
  try {
    const res = await fetch(`/api/travaux/${encodeURIComponent(id)}/photos/${encodeURIComponent(photoId)}`, { method: "DELETE", headers: headers() });
    if (!res.ok) return null;
    return ((await res.json()) as { dossier?: DossierTravaux }).dossier ?? null;
  } catch { return null; }
}

export const urlPhotoTravaux = (id: string, photoId: string) =>
  `/api/travaux/${encodeURIComponent(id)}/photos/${encodeURIComponent(photoId)}`;

// Analyse IA d'une photo : état constaté, travaux conseillés (rattachés au
// barème), et descriptif « après travaux ».
export interface AnalyseTravauxPhoto {
  piece: string;
  etat: string;
  legendeAvant: string;
  legendeApres: string;
  travaux: { posteId: string; libelle: string; unite: string; quantite: number }[];
}
export async function analyserPhotoTravaux(data: string, contexte?: string): Promise<AnalyseTravauxPhoto | null> {
  const res = await fetch("/api/travaux/analyser", { method: "POST", headers: jsonHeaders(), body: JSON.stringify({ data, contexte }) });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Analyse impossible");
  }
  return ((await res.json()) as { analyse?: AnalyseTravauxPhoto }).analyse ?? null;
}

// Compresse une photo sous la limite serverless (~4,5 Mo) et renvoie le base64
// JPEG prêt à l'envoi (même logique que pour les sinistres).
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
  return data;
}
