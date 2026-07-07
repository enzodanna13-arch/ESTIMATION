import type { PhotoInput } from "./types";

const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.8;

/**
 * Redimensionne et compresse une photo côté navigateur avant envoi,
 * pour rester sous la limite de taille des fonctions serverless (~4,5 Mo).
 */
export async function compressImage(file: File): Promise<PhotoInput> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas non disponible");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  return {
    name: file.name,
    mediaType: "image/jpeg",
    data: dataUrl.split(",")[1],
  };
}
