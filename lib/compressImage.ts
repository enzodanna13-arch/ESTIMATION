import type { PhotoInput } from "./types";

// Paliers de compression essayés dans l'ordre jusqu'à passer sous la cible :
// avec 20 photos, chaque image doit rester ≈ 200 Ko pour que la requête
// tienne sous la limite des fonctions serverless (~4,5 Mo).
const STEPS: { dimension: number; quality: number }[] = [
  { dimension: 1280, quality: 0.8 },
  { dimension: 1280, quality: 0.65 },
  { dimension: 1024, quality: 0.6 },
  { dimension: 900, quality: 0.5 },
];
const TARGET_BASE64_CHARS = 270_000; // ≈ 200 Ko binaires

export async function compressImage(file: File): Promise<PhotoInput> {
  const bitmap = await createImageBitmap(file);
  let data = "";
  for (const step of STEPS) {
    const scale = Math.min(1, step.dimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas non disponible");
    ctx.drawImage(bitmap, 0, 0, width, height);
    data = canvas.toDataURL("image/jpeg", step.quality).split(",")[1];
    if (data.length <= TARGET_BASE64_CHARS) break;
  }
  bitmap.close();
  return { name: file.name, mediaType: "image/jpeg", data };
}
