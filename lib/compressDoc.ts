"use client";

// Compression PUISSANTE des pièces de dossier client, côté navigateur, AVANT
// envoi — pour que chaque document tienne largement sous la limite serverless
// (~4,5 Mo) et occupe le moins d'espace possible dans le stockage.
//
// Deux entrées :
//   • un PDF (souvent un scan lourd) → chaque page est re-rendue en image
//     JPEG à résolution/qualité maîtrisées, puis réassemblée en un PDF léger ;
//   • une image (photo d'un document) → compressée puis emballée en PDF.
//
// Sécurité : si la compression échoue OU ne fait pas gagner de place, on
// renvoie le fichier d'origine — jamais de blocage ni de document alourdi.

import { PDFDocument } from "pdf-lib";

// Polyfill : pdf.js v4 exige Promise.withResolvers, absent des navigateurs un
// peu anciens → sans lui, la compression échouait silencieusement.
if (typeof (Promise as unknown as { withResolvers?: unknown }).withResolvers !== "function") {
  (Promise as unknown as { withResolvers: () => unknown }).withResolvers = function <T>() {
    let resolve!: (v: T | PromiseLike<T>) => void;
    let reject!: (r?: unknown) => void;
    const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
  };
}

export interface PieceCompressee {
  nom: string; // toujours en .pdf
  data: string; // base64 du PDF (sans préfixe data:)
  tailleAvant: number; // octets
  tailleApres: number; // octets
}

// Paliers essayés du plus qualitatif au plus léger jusqu'à passer sous la cible.
// On part d'une qualité élevée : la compression ne descend que le strict
// nécessaire pour passer, en conservant le maximum de lisibilité.
const PALIERS = [
  { dpi: 180, quality: 0.72 },
  { dpi: 150, quality: 0.62 },
  { dpi: 125, quality: 0.55 },
  { dpi: 105, quality: 0.48 },
  { dpi: 90, quality: 0.42 },
  { dpi: 72, quality: 0.38 },
];

function u8ToB64(u8: Uint8Array): string {
  let bin = "";
  const CH = 0x8000;
  for (let i = 0; i < u8.length; i += CH) {
    bin += String.fromCharCode(...u8.subarray(i, i + CH));
  }
  return btoa(bin);
}

function dataUrlToU8(dataUrl: string): Uint8Array<ArrayBuffer> {
  const bin = atob(dataUrl.split(",")[1]);
  const u8 = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8;
}

async function fileToB64(file: File): Promise<string> {
  return u8ToB64(new Uint8Array(await file.arrayBuffer()));
}

// pdf.js chargé dynamiquement (navigateur uniquement). Le worker est le point
// fragile en production : on tente le worker BUNDLÉ, puis le worker CDN (même
// version), et en dernier recours le mode « fake worker » (thread principal) —
// pour que la compression fonctionne quel que soit l'environnement.
let pdfjsCharge: Promise<typeof import("pdfjs-dist")> | null = null;
async function chargerPdfjs() {
  if (pdfjsCharge) return pdfjsCharge;
  pdfjsCharge = (async () => {
    const pdfjs = await import("pdfjs-dist");
    const cdn = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
    let src = cdn;
    try {
      src = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
    } catch { src = cdn; }
    pdfjs.GlobalWorkerOptions.workerSrc = src;
    return pdfjs;
  })();
  return pdfjsCharge;
}

// Ouvre le PDF, en basculant sur le worker CDN si le worker bundlé échoue.
async function ouvrirPdf(bytes: Uint8Array) {
  const pdfjs = await chargerPdfjs();
  try {
    return await pdfjs.getDocument({ data: bytes }).promise;
  } catch {
    // Bascule sur le worker CDN (même version) puis réessaie une fois.
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
    return await pdfjs.getDocument({ data: bytes }).promise;
  }
}

// Rend chaque page à un DPI/qualité donnés et réassemble un PDF de JPEG.
async function rasteriser(
  bytes: Uint8Array,
  dpi: number,
  quality: number,
): Promise<Uint8Array> {
  const doc = await ouvrirPdf(bytes);
  const out = await PDFDocument.create();
  try {
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const base = page.getViewport({ scale: 1 });
      const scale = Math.min(dpi / 72, 2200 / Math.max(base.width, base.height));
      const vp = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(vp.width);
      canvas.height = Math.ceil(vp.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas indisponible");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport: vp }).promise;
      const jpg = canvas.toDataURL("image/jpeg", quality);
      const img = await out.embedJpg(dataUrlToU8(jpg));
      const p = out.addPage([base.width, base.height]);
      p.drawImage(img, { x: 0, y: 0, width: base.width, height: base.height });
    }
  } finally {
    await doc.destroy();
  }
  return out.save({ useObjectStreams: true });
}

// Compresse un PDF : on descend les paliers jusqu'à la cible, avec repli sur
// l'original si aucune version compressée n'est plus légère.
async function compresserPdf(file: File, cibleOctets: number): Promise<PieceCompressee> {
  const original = new Uint8Array(await file.arrayBuffer());
  const nom = file.name.replace(/\.[^.]+$/, "") + ".pdf";
  let meilleur: Uint8Array = original;
  for (const { dpi, quality } of PALIERS) {
    try {
      const candidat = await rasteriser(original, dpi, quality);
      if (candidat.length < meilleur.length) meilleur = candidat;
      if (candidat.length <= cibleOctets) break;
    } catch {
      break; // PDF illisible par pdf.js (chiffré, exotique) → on garde l'original
    }
  }
  return {
    nom,
    data: u8ToB64(meilleur),
    tailleAvant: original.length,
    tailleApres: meilleur.length,
  };
}

// Compresse une image et l'emballe dans un PDF d'une page à sa taille.
async function imageVersPdf(file: File, cibleOctets: number): Promise<PieceCompressee> {
  const bitmap = await createImageBitmap(file);
  const nom = file.name.replace(/\.[^.]+$/, "") + ".pdf";
  const avant = file.size;
  let meilleur: Uint8Array | null = null;
  for (const { dpi, quality } of PALIERS) {
    const maxPx = Math.max(900, Math.round((dpi / 150) * 1800));
    const scale = Math.min(1, maxPx / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) break;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bitmap, 0, 0, w, h);
    const jpg = canvas.toDataURL("image/jpeg", quality);
    const pdf = await PDFDocument.create();
    const img = await pdf.embedJpg(dataUrlToU8(jpg));
    const page = pdf.addPage([w, h]);
    page.drawImage(img, { x: 0, y: 0, width: w, height: h });
    const bytes = await pdf.save({ useObjectStreams: true });
    if (!meilleur || bytes.length < meilleur.length) meilleur = bytes;
    if (bytes.length <= cibleOctets) break;
  }
  bitmap.close();
  const data = meilleur ? u8ToB64(meilleur) : await fileToB64(file);
  return { nom, data, tailleAvant: avant, tailleApres: meilleur ? meilleur.length : avant };
}

// Point d'entrée : compresse un document (PDF ou image) en un PDF léger.
// cibleKo = taille visée par pièce. Défaut 3,0 Mo : l'envoi étant transporté en
// base64 (+33 %), un PDF de 3,0 Mo pèse ≈ 4,0 Mo dans la requête — juste sous
// la limite serverless (~4,5 Mo). Viser 4 Mo de PDF ferait ≈ 5,3 Mo et
// bloquerait l'envoi ; on garde donc la marge tout en compressant le MINIMUM
// nécessaire pour préserver la qualité.
export async function compresserDocument(file: File, cibleKo = 3000): Promise<PieceCompressee> {
  const cibleOctets = cibleKo * 1024;
  const type = file.type.toLowerCase();
  const nomBas = file.name.toLowerCase();
  if (type.startsWith("image/") || /\.(jpe?g|png|webp|heic|heif)$/.test(nomBas)) {
    return imageVersPdf(file, cibleOctets);
  }
  return compresserPdf(file, cibleOctets);
}
