// Client des VISITES VIRTUELLES 360° : création, scènes, partage.
// Lecture publique (lien client) — écriture protégée par le mot de passe.

export type { SceneVisite, VisiteVirtuelle } from "./serverHistory";
import type { VisiteVirtuelle } from "./serverHistory";
import { getHistoryKey } from "./history";

const headers = () => ({ "x-history-key": getHistoryKey() });
const jsonHeaders = () => ({ "content-type": "application/json", "x-history-key": getHistoryKey() });

export async function listVisites(): Promise<VisiteVirtuelle[]> {
  const res = await fetch("/api/visites", { cache: "no-store", headers: headers() });
  if (!res.ok) return [];
  const body = (await res.json()) as { visites?: VisiteVirtuelle[] };
  return body.visites ?? [];
}

export async function createVisite(d: { bien: string; negociateur: string }): Promise<VisiteVirtuelle | null> {
  const res = await fetch("/api/visites", { method: "POST", headers: jsonHeaders(), body: JSON.stringify(d) });
  if (!res.ok) return null;
  const body = (await res.json()) as { visite?: VisiteVirtuelle };
  return body.visite ?? null;
}

export async function getVisite(id: string): Promise<VisiteVirtuelle | null> {
  const res = await fetch(`/api/visites/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (!res.ok) return null;
  const body = (await res.json()) as { visite?: VisiteVirtuelle };
  return body.visite ?? null;
}

export async function deleteVisite(id: string): Promise<boolean> {
  const res = await fetch(`/api/visites/${encodeURIComponent(id)}`, { method: "DELETE", headers: headers() });
  return res.ok;
}

export async function addVisiteScene(
  id: string,
  scene: { nom: string; data: string },
): Promise<VisiteVirtuelle | null> {
  const res = await fetch(`/api/visites/${encodeURIComponent(id)}/images`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(scene),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Envoi de la prise de vue impossible");
  }
  const body = (await res.json()) as { visite?: VisiteVirtuelle };
  return body.visite ?? null;
}

export async function deleteVisiteScene(id: string, imgId: string): Promise<VisiteVirtuelle | null> {
  const res = await fetch(`/api/visites/${encodeURIComponent(id)}/images/${encodeURIComponent(imgId)}`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { visite?: VisiteVirtuelle };
  return body.visite ?? null;
}

export const urlImageVisite = (id: string) => (imgId: string) =>
  `/api/visites/${encodeURIComponent(id)}/images/${encodeURIComponent(imgId)}`;

/**
 * Compresse une prise de vue 360° équirectangulaire pour l'envoi : les
 * exports Insta360 (6-8K, 5-15 Mo) sont redimensionnés par paliers jusqu'à
 * passer sous la limite serverless (~4,5 Mo de corps de requête).
 */
export async function compresserPriseDeVue(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const PALIERS: { largeur: number; qualite: number }[] = [
    { largeur: 4096, qualite: 0.82 },
    { largeur: 3584, qualite: 0.78 },
    { largeur: 3072, qualite: 0.74 },
    { largeur: 2560, qualite: 0.7 },
    { largeur: 2048, qualite: 0.66 },
  ];
  let data = "";
  for (const p of PALIERS) {
    const scale = Math.min(1, p.largeur / bitmap.width);
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas indisponible");
    ctx.drawImage(bitmap, 0, 0, w, h);
    data = canvas.toDataURL("image/jpeg", p.qualite).split(",")[1];
    if (data.length <= 3_600_000) break; // base64 ≈ 2,7 Mo binaires
  }
  bitmap.close();
  if (data.length > 3_600_000) throw new Error("Prise de vue trop lourde même compressée");
  return data;
}
