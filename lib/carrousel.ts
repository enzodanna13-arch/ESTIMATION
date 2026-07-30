// Génération d'un CARROUSEL réseaux sociaux à partir des photos du bien —
// 100 % côté navigateur (canvas + ZIP « store » maison, aucune dépendance).
// Slides carrées 1080×1080 : couverture habillée CENTURY 21 → photos du bien
// (habillage discret) → slide de contact. Téléchargé en un fichier .zip.

const OR = "#b4975b";
const NAVY = "#0c1b2a";

export interface CarrouselOpts {
  photos: string[]; // data URLs (image/jpeg) des photos du bien
  typeBien?: string;
  surface?: number | null;
  nbPieces?: number | null;
  ville?: string;
  prix?: number | null;
  accroche?: string; // 1re ligne de la légende générée (facultatif)
  negociateur?: string;
  negociateurTel?: string;
}

const eur = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

function chargerImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Dessine une image en « cover » (remplit le carré, recadré au centre). */
function dessinerCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, S: number) {
  const r = Math.max(S / img.width, S / img.height);
  const w = img.width * r;
  const h = img.height * r;
  ctx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
}

function badge21(ctx: CanvasRenderingContext2D, x: number, y: number, taille: number) {
  ctx.save();
  ctx.fillStyle = OR;
  const r = taille * 0.22;
  ctx.beginPath();
  ctx.roundRect(x, y, taille, taille, r);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = `900 ${taille * 0.5}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("21", x + taille / 2, y + taille / 2 + taille * 0.02);
  ctx.restore();
}

function texteMultiligne(ctx: CanvasRenderingContext2D, texte: string, x: number, y: number, maxW: number, lh: number): number {
  const mots = texte.split(" ");
  let ligne = "";
  let yy = y;
  for (const mot of mots) {
    const test = ligne ? `${ligne} ${mot}` : mot;
    if (ctx.measureText(test).width > maxW && ligne) {
      ctx.fillText(ligne, x, yy);
      ligne = mot;
      yy += lh;
    } else ligne = test;
  }
  if (ligne) ctx.fillText(ligne, x, yy);
  return yy;
}

async function canvasVersPng(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), "image/png", 0.92));
  return new Uint8Array(await blob.arrayBuffer());
}

export async function construireSlides(opts: CarrouselOpts): Promise<Uint8Array[]> {
  const S = 1080;
  const slides: Uint8Array[] = [];
  const mk = () => {
    const c = document.createElement("canvas");
    c.width = S;
    c.height = S;
    return { c, ctx: c.getContext("2d")! };
  };

  // --- Slide de couverture ---
  {
    const { c, ctx } = mk();
    // Photo de fond (1re photo) assombrie, sinon fond navy
    if (opts.photos[0]) {
      try {
        dessinerCover(ctx, await chargerImage(opts.photos[0]), S);
        ctx.fillStyle = "rgba(12,27,42,0.62)";
        ctx.fillRect(0, 0, S, S);
      } catch {
        ctx.fillStyle = NAVY;
        ctx.fillRect(0, 0, S, S);
      }
    } else {
      ctx.fillStyle = NAVY;
      ctx.fillRect(0, 0, S, S);
    }
    badge21(ctx, 70, 70, 110);
    ctx.fillStyle = "#fff";
    ctx.font = "700 34px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("CENTURY 21 Icaza Immobilier", 200, 128);
    // Titre
    ctx.font = "800 78px Arial";
    const titre = opts.accroche?.slice(0, 60) || `${(opts.typeBien || "Bien").toUpperCase()} À VENDRE`;
    const yFin = texteMultiligne(ctx, titre, 70, 600, S - 140, 88);
    // Sous-ligne caractéristiques
    ctx.fillStyle = OR;
    ctx.font = "700 44px Arial";
    const carac = [
      opts.ville,
      opts.surface ? `${opts.surface} m²` : "",
      opts.nbPieces ? `${opts.nbPieces} pièces` : "",
    ].filter(Boolean).join("  ·  ");
    if (carac) ctx.fillText(carac, 70, yFin + 80);
    // Prix
    if (opts.prix) {
      ctx.fillStyle = "#fff";
      ctx.font = "900 66px Arial";
      ctx.fillText(`${eur.format(opts.prix)} €`, 70, yFin + 165);
    }
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "600 30px Arial";
    ctx.fillText("Glissez pour découvrir  →", 70, S - 70);
    slides.push(await canvasVersPng(c));
  }

  // --- Slides photos ---
  for (let i = 0; i < opts.photos.length; i++) {
    const { c, ctx } = mk();
    try {
      dessinerCover(ctx, await chargerImage(opts.photos[i]), S);
    } catch {
      ctx.fillStyle = NAVY;
      ctx.fillRect(0, 0, S, S);
    }
    // Dégradé bas + filigrane
    const grad = ctx.createLinearGradient(0, S - 170, 0, S);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, S - 170, S, 170);
    badge21(ctx, 40, S - 110, 64);
    ctx.fillStyle = "#fff";
    ctx.font = "700 30px Arial";
    ctx.textAlign = "left";
    ctx.fillText("CENTURY 21 Icaza Immobilier", 120, S - 62);
    if (i === 0 && opts.prix) {
      ctx.textAlign = "right";
      ctx.font = "900 46px Arial";
      ctx.fillText(`${eur.format(opts.prix)} €`, S - 40, S - 58);
    }
    slides.push(await canvasVersPng(c));
  }

  // --- Slide contact ---
  {
    const { c, ctx } = mk();
    ctx.fillStyle = NAVY;
    ctx.fillRect(0, 0, S, S);
    badge21(ctx, (S - 150) / 2, 250, 150);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "800 60px Arial";
    ctx.fillText("Ce bien vous intéresse ?", S / 2, 520);
    ctx.fillStyle = OR;
    ctx.font = "700 46px Arial";
    ctx.fillText("CENTURY 21 Icaza Immobilier", S / 2, 610);
    ctx.fillStyle = "#fff";
    ctx.font = "600 40px Arial";
    ctx.fillText("32 avenue de la Paix — 13500 Martigues", S / 2, 700);
    ctx.fillText("04 42 42 80 85", S / 2, 760);
    if (opts.negociateur) {
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "600 36px Arial";
      ctx.fillText(
        [opts.negociateur, opts.negociateurTel].filter(Boolean).join(" · "),
        S / 2,
        850,
      );
    }
    slides.push(await canvasVersPng(c));
  }

  return slides;
}

// --------- ZIP « store » (sans compression) : suffisant pour des PNG ---------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export function zipStore(fichiers: { nom: string; data: Uint8Array }[]): Blob {
  const enc = new TextEncoder();
  const locals: Uint8Array[] = [];
  const centraux: Uint8Array[] = [];
  let offset = 0;

  for (const f of fichiers) {
    const nom = enc.encode(f.nom);
    const crc = crc32(f.data);
    const n = f.data.length;
    const lh = new Uint8Array(30 + nom.length);
    const dv = new DataView(lh.buffer);
    dv.setUint32(0, 0x04034b50, true);
    dv.setUint16(4, 20, true);
    dv.setUint16(6, 0, true);
    dv.setUint16(8, 0, true); // store
    dv.setUint16(10, 0, true);
    dv.setUint16(12, 0, true);
    dv.setUint32(14, crc, true);
    dv.setUint32(18, n, true);
    dv.setUint32(22, n, true);
    dv.setUint16(26, nom.length, true);
    dv.setUint16(28, 0, true);
    lh.set(nom, 30);
    locals.push(lh, f.data);

    const ch = new Uint8Array(46 + nom.length);
    const cv = new DataView(ch.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, n, true);
    cv.setUint32(24, n, true);
    cv.setUint16(28, nom.length, true);
    cv.setUint32(42, offset, true);
    ch.set(nom, 46);
    centraux.push(ch);
    offset += lh.length + n;
  }

  const centralSize = centraux.reduce((s, a) => s + a.length, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, fichiers.length, true);
  ev.setUint16(10, fichiers.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);

  const parts = [...locals, ...centraux, eocd] as unknown as BlobPart[];
  return new Blob(parts, { type: "application/zip" });
}

/** Construit le carrousel et déclenche le téléchargement du .zip. */
export async function telechargerCarrousel(opts: CarrouselOpts): Promise<number> {
  const slides = await construireSlides(opts);
  const fichiers = slides.map((data, i) => ({
    nom: `carrousel-${String(i + 1).padStart(2, "0")}.png`,
    data,
  }));
  const blob = zipStore(fichiers);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Carrousel ${(opts.ville || "bien").replace(/[\\/:*?"<>|]/g, "-")}.zip`;
  a.click();
  URL.revokeObjectURL(url);
  return slides.length;
}
