// Pré-remplissage de l'outil d'estimation NÉGOCIATEUR à partir d'une estimation
// CLIENT : « refaire l'estimation dans l'outil », avec le bien et les photos
// déjà chargés. On passe par un id en sessionStorage (léger) + navigation même
// onglet vers l'app ; celle-ci consomme le prefill une fois déverrouillée.

import { getClientEstimation, urlPhotoBackoffice } from "./backofficeEstimations";
import type { PhotoInput, PropertyInput } from "./types";

const PREFILL_KEY = "prefill-estimation-id";

/** Depuis le back-office : mémorise l'estimation à recharger puis ouvre l'outil. */
export function demanderPrefillEstimation(id: string): void {
  try { sessionStorage.setItem(PREFILL_KEY, id); } catch { /* ignore */ }
  window.location.assign("/"); // même onglet → la clé de session est conservée
}

async function photoBase64(id: string, idx: number, mediaType: PhotoInput["mediaType"]): Promise<PhotoInput | null> {
  try {
    const res = await fetch(urlPhotoBackoffice(id, idx), {
      cache: "no-store",
      headers: { "x-history-key": sessionStorage.getItem("estimation-history-key") ?? "" },
    });
    if (!res.ok) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    let bin = "";
    for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    return { name: `photo-${idx + 1}`, mediaType, data: btoa(bin) };
  } catch { return null; }
}

/** Dans l'app : renvoie le PropertyInput à charger (bien + photos), ou null. */
export async function consommerPrefillEstimation(): Promise<PropertyInput | null> {
  let id: string | null = null;
  try { id = sessionStorage.getItem(PREFILL_KEY); } catch { return null; }
  if (!id) return null;
  try { sessionStorage.removeItem(PREFILL_KEY); } catch { /* ignore */ }

  const rec = await getClientEstimation(id);
  if (!rec?.proInput) return null;

  const mt = (i: number): PhotoInput["mediaType"] => {
    const m = rec.photos.find((p) => p.idx === i)?.mediaType ?? "image/jpeg";
    return m === "image/png" || m === "image/webp" ? m : "image/jpeg";
  };
  const photos: PhotoInput[] = [];
  for (const p of rec.photos) {
    const ph = await photoBase64(id, p.idx, mt(p.idx));
    if (ph) photos.push(ph);
  }
  return { ...rec.proInput, photos };
}
