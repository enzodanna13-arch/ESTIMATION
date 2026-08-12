import type { EditResult, ImageData } from "./types";

// « Embellir la photo » — amélioration RÉELLE côté client (canvas), sans API
// externe : balance des blancs auto (gray-world), luminosité, contraste,
// saturation naturelle et accentuation de netteté (unsharp mask). N'altère
// pas le contenu du bien : améliore uniquement le rendu de présentation.

export interface EnhanceOptions {
  luminosite?: number; // -100..100 (défaut auto léger)
  contraste?: number; // -100..100
  saturation?: number; // -100..100
  nettete?: number; // 0..100
  balanceBlancs?: boolean; // correction auto des blancs
  maxDimension?: number; // qualité export (défaut 1920 pour portails)
}

const DEFAUT: Required<EnhanceOptions> = {
  luminosite: 8,
  contraste: 14,
  saturation: 12,
  nettete: 45,
  balanceBlancs: true,
  maxDimension: 1920,
};

function dataUrlVersImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => rej(new Error("Image illisible"));
    img.src = dataUrl;
  });
}

export async function enhanceLocal(image: ImageData, options?: EnhanceOptions): Promise<EditResult> {
  const o = { ...DEFAUT, ...(options ?? {}) };
  try {
    const img = await dataUrlVersImage(`data:${image.mediaType};base64,${image.data}`);
    const scale = Math.min(1, o.maxDimension / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas indisponible");
    ctx.drawImage(img, 0, 0, w, h);
    const src = ctx.getImageData(0, 0, w, h);
    const px = src.data;
    const n = px.length;

    // 1) Balance des blancs auto (gray-world) : on aligne les moyennes RVB
    let wr = 1, wg = 1, wb = 1;
    if (o.balanceBlancs) {
      let sr = 0, sg = 0, sb = 0, cnt = 0;
      for (let i = 0; i < n; i += 4) {
        sr += px[i]; sg += px[i + 1]; sb += px[i + 2]; cnt++;
      }
      const mr = sr / cnt, mg = sg / cnt, mb = sb / cnt;
      const gris = (mr + mg + mb) / 3;
      // Correction douce (0,7) pour ne pas dénaturer
      wr = 1 + 0.7 * (gris / (mr || 1) - 1);
      wg = 1 + 0.7 * (gris / (mg || 1) - 1);
      wb = 1 + 0.7 * (gris / (mb || 1) - 1);
    }

    // 2) Luminosité / contraste / saturation
    const lum = o.luminosite * 1.2; // décalage
    const c = o.contraste / 100;
    const cf = (1 + c) / (1 - c + 1e-6); // facteur de contraste
    const sat = 1 + o.saturation / 100;

    for (let i = 0; i < n; i += 4) {
      let r = px[i] * wr;
      let g = px[i + 1] * wg;
      let b = px[i + 2] * wb;
      // contraste autour de 128 + luminosité
      r = cf * (r - 128) + 128 + lum;
      g = cf * (g - 128) + 128 + lum;
      b = cf * (b - 128) + 128 + lum;
      // saturation (autour de la luminance)
      const ly = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      r = ly + (r - ly) * sat;
      g = ly + (g - ly) * sat;
      b = ly + (b - ly) * sat;
      px[i] = r < 0 ? 0 : r > 255 ? 255 : r;
      px[i + 1] = g < 0 ? 0 : g > 255 ? 255 : g;
      px[i + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
    }
    ctx.putImageData(src, 0, 0);

    // 3) Accentuation de netteté (unsharp mask) : original - flou
    if (o.nettete > 0) {
      const flou = document.createElement("canvas");
      flou.width = w; flou.height = h;
      const fctx = flou.getContext("2d");
      if (fctx) {
        fctx.filter = "blur(1.4px)";
        fctx.drawImage(canvas, 0, 0);
        const base = ctx.getImageData(0, 0, w, h);
        const bl = fctx.getImageData(0, 0, w, h);
        const amount = o.nettete / 100;
        const bp = base.data, blp = bl.data;
        for (let i = 0; i < bp.length; i += 4) {
          for (let k = 0; k < 3; k++) {
            const v = bp[i + k] + amount * (bp[i + k] - blp[i + k]);
            bp[i + k] = v < 0 ? 0 : v > 255 ? 255 : v;
          }
        }
        ctx.putImageData(base, 0, 0);
      }
    }

    const out = canvas.toDataURL("image/jpeg", 0.92).split(",")[1];
    return { ok: true, image: { mediaType: "image/jpeg", data: out }, provider: "local-enhance" };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Amélioration impossible" };
  }
}
