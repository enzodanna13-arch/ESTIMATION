import type { PhotoInput } from "./types";

// Paliers de compression essayés dans l'ordre jusqu'à passer sous la cible :
// avec 20 photos, chaque image doit rester ≈ 200 Ko pour que la requête
// tienne sous la limite des fonctions serverless (~4,5 Mo).
const STEPS: { dimension: number; quality: number }[] = [
  { dimension: 1280, quality: 0.75 },
  { dimension: 1150, quality: 0.62 },
  { dimension: 1000, quality: 0.55 },
  { dimension: 880, quality: 0.48 },
  { dimension: 800, quality: 0.42 },
];
const TARGET_BASE64_CHARS = 190_000; // ≈ 140 Ko binaires — 20 photos ≈ 3,8 Mo

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
