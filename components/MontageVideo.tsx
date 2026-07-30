"use client";

import { useRef, useState } from "react";

// Montage vidéo « classique » d'un bien pour les réseaux sociaux : le
// négociateur dépose les photos, l'outil fabrique une VIDÉO animée
// (diaporama Ken Burns + habillage CENTURY 21 + slide contact) exportée en
// .webm — 100 % sur le poste (canvas + MediaRecorder), sans visite 360°.

const OR = "#b4975b";
const NAVY = "#0c1b2a";

const FORMATS = {
  reel: { w: 1080, h: 1920, label: "Reel / Story (9:16)" },
  carre: { w: 1080, h: 1080, label: "Carré (1:1)" },
  paysage: { w: 1920, h: 1080, label: "Paysage (16:9)" },
} as const;
type FormatKey = keyof typeof FORMATS;

const supporte = () =>
  typeof window !== "undefined" &&
  typeof window.MediaRecorder !== "undefined" &&
  typeof (HTMLCanvasElement.prototype as unknown as { captureStream?: unknown }).captureStream === "function";

function chargerImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, W: number, H: number, zoom: number, panX: number) {
  const r = Math.max(W / img.width, H / img.height) * zoom;
  const w = img.width * r;
  const h = img.height * r;
  ctx.drawImage(img, (W - w) / 2 + panX, (H - h) / 2, w, h);
}

function badge21(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  ctx.save();
  ctx.fillStyle = OR;
  ctx.beginPath();
  ctx.roundRect(x, y, t, t, t * 0.22);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = `900 ${t * 0.5}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("21", x + t / 2, y + t / 2 + t * 0.02);
  ctx.restore();
}

const eur = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

export default function MontageVideo() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [format, setFormat] = useState<FormatKey>("reel");
  const [dureePhoto, setDureePhoto] = useState(2.5);
  const [titre, setTitre] = useState("");
  const [ville, setVille] = useState("");
  const [prix, setPrix] = useState("");
  const [nego, setNego] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [erreur, setErreur] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const annuler = useRef(false);

  const lireDataUrl = (f: File) =>
    new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = reject;
      r.readAsDataURL(f);
    });
  const ajouter = async (files: FileList | null) => {
    if (!files) return;
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) continue;
      try {
        const url = await lireDataUrl(f);
        setPhotos((p) => [...p, url]);
      } catch {
        setErreur("Une photo n'a pas pu être lue.");
      }
    }
  };

  const generer = async () => {
    if (photos.length === 0) return setErreur("Ajoutez au moins une photo du bien.");
    if (!supporte()) return setErreur("Votre navigateur ne permet pas l'enregistrement vidéo. Utilisez Chrome à jour.");
    setBusy(true);
    setErreur(null);
    setVideoUrl(null);
    setProgress(0);
    annuler.current = false;
    try {
      const { w: W, h: H } = FORMATS[format];
      const imgs = await Promise.all(photos.map(chargerImage));
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;
      const stream = (canvas as unknown as { captureStream: (f: number) => MediaStream }).captureStream(30);
      const mime = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find((m) => MediaRecorder.isTypeSupported(m)) ?? "video/webm";
      const chunks: BlobPart[] = [];
      const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6_000_000 });
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);

      const fin = new Promise<Blob>((resolve) => {
        rec.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
      });
      rec.start();

      const INTRO = titre || ville ? 2.2 : 0;
      const OUTRO = 2.4;
      const total = INTRO + photos.length * dureePhoto + OUTRO;

      // Habillages fixes
      const drawIntro = (a: number) => {
        ctx.fillStyle = NAVY;
        ctx.fillRect(0, 0, W, H);
        if (imgs[0]) {
          ctx.globalAlpha = 0.35;
          drawCover(ctx, imgs[0], W, H, 1.05, 0);
          ctx.globalAlpha = 1;
          ctx.fillStyle = "rgba(12,27,42,0.55)";
          ctx.fillRect(0, 0, W, H);
        }
        ctx.globalAlpha = a;
        badge21(ctx, 60, 60, W * 0.1);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.font = `800 ${W * 0.075}px Arial`;
        ctx.fillText((titre || "À VENDRE").slice(0, 24), 60, H * 0.52);
        ctx.fillStyle = OR;
        ctx.font = `700 ${W * 0.045}px Arial`;
        if (ville) ctx.fillText(ville, 60, H * 0.52 + W * 0.075);
        if (prix) {
          ctx.fillStyle = "#fff";
          ctx.font = `900 ${W * 0.065}px Arial`;
          ctx.fillText(`${eur.format(Number(prix))} €`, 60, H * 0.52 + W * 0.16);
        }
        ctx.globalAlpha = 1;
      };
      const drawOutro = (a: number) => {
        ctx.fillStyle = NAVY;
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = a;
        badge21(ctx, (W - W * 0.14) / 2, H * 0.28, W * 0.14);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = `800 ${W * 0.055}px Arial`;
        ctx.fillText("Ce bien vous intéresse ?", W / 2, H * 0.5);
        ctx.fillStyle = OR;
        ctx.font = `700 ${W * 0.04}px Arial`;
        ctx.fillText("CENTURY 21 Icaza Immobilier", W / 2, H * 0.56);
        ctx.fillStyle = "#fff";
        ctx.font = `600 ${W * 0.033}px Arial`;
        ctx.fillText("04 42 42 80 85", W / 2, H * 0.61);
        if (nego) ctx.fillText(nego, W / 2, H * 0.65);
        ctx.globalAlpha = 1;
      };
      const drawPhoto = (idx: number, k: number, fade: number) => {
        // k : 0→1 progression dans la photo (Ken Burns) ; fade : 0→1 apparition
        const zoom = 1.04 + 0.08 * k;
        const pan = (idx % 2 === 0 ? 1 : -1) * (W * 0.03) * (k - 0.5);
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, W, H);
        drawCover(ctx, imgs[idx], W, H, zoom, pan);
        // filigrane bas
        const g = ctx.createLinearGradient(0, H - H * 0.14, 0, H);
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(1, "rgba(0,0,0,0.5)");
        ctx.fillStyle = g;
        ctx.fillRect(0, H - H * 0.14, W, H * 0.14);
        badge21(ctx, 34, H - W * 0.075 - 34, W * 0.06);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.font = `700 ${W * 0.026}px Arial`;
        ctx.fillText("CENTURY 21 Icaza Immobilier", 34 + W * 0.06 + 18, H - 44);
        if (idx === 0 && prix) {
          ctx.textAlign = "right";
          ctx.font = `900 ${W * 0.04}px Arial`;
          ctx.fillText(`${eur.format(Number(prix))} €`, W - 34, H - 42);
        }
        if (fade < 1) {
          ctx.fillStyle = `rgba(0,0,0,${1 - fade})`;
          ctx.fillRect(0, 0, W, H);
        }
      };

      const t0 = performance.now();
      await new Promise<void>((resolve) => {
        const tick = () => {
          if (annuler.current) return resolve();
          const t = (performance.now() - t0) / 1000;
          if (t >= total) return resolve();
          setProgress(Math.min(99, Math.round((t / total) * 100)));
          if (t < INTRO) {
            drawIntro(Math.min(1, t / 0.5) * Math.min(1, (INTRO - t) / 0.4 + 0.001 > 1 ? 1 : (INTRO - t) / 0.4));
          } else if (t < INTRO + photos.length * dureePhoto) {
            const rel = t - INTRO;
            const idx = Math.min(photos.length - 1, Math.floor(rel / dureePhoto));
            const k = (rel - idx * dureePhoto) / dureePhoto;
            drawPhoto(idx, k, Math.min(1, (k * dureePhoto) / 0.4));
          } else {
            const rel = t - INTRO - photos.length * dureePhoto;
            drawOutro(Math.min(1, rel / 0.5));
          }
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });

      rec.stop();
      const blob = await fin;
      stream.getTracks().forEach((tr) => tr.stop());
      if (annuler.current) return;
      setVideoUrl(URL.createObjectURL(blob));
      setProgress(100);
    } catch {
      setErreur("Génération de la vidéo impossible.");
    } finally {
      setBusy(false);
    }
  };

  const inputCls = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";

  return (
    <div>
      <div className="mb-4 rounded-2xl border border-copper/40 bg-copper-soft/40 p-3 text-xs text-slate-600">
        <b className="text-navy">Montage vidéo pour réseaux sociaux :</b> déposez les photos du bien, choisissez le
        format, et l&apos;outil fabrique une <b>vidéo animée</b> (couverture C21, diaporama, slide contact) prête à
        publier en Reel / Story. Généré sur votre poste, sans visite 360°.
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Format</span>
          <select className={inputCls} value={format} onChange={(e) => setFormat(e.target.value as FormatKey)}>
            {(Object.keys(FORMATS) as FormatKey[]).map((k) => (
              <option key={k} value={k}>{FORMATS[k].label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Durée par photo : {dureePhoto}s</span>
          <input type="range" min={1.5} max={4} step={0.5} value={dureePhoto} onChange={(e) => setDureePhoto(Number(e.target.value))} className="w-full" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Titre (couverture)</span>
          <input className={inputCls} value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Appartement T4 vue mer" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ville</span>
          <input className={inputCls} value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Martigues" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Prix (€)</span>
          <input className={inputCls} value={prix} onChange={(e) => setPrix(e.target.value.replace(/[^\d]/g, ""))} placeholder="349000" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Négociateur (slide contact)</span>
          <input className={inputCls} value={nego} onChange={(e) => setNego(e.target.value)} placeholder="Enzo D. · 06 12 34 56 78" />
        </label>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <label className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-500 transition hover:border-copper hover:text-copper">
          + Ajouter des photos du bien
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { void ajouter(e.target.files); e.target.value = ""; }} />
        </label>
        {photos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {photos.map((src, i) => (
              <div key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-20 w-20 rounded-lg border border-slate-200 object-cover" />
                <div className="absolute left-1 top-1 rounded bg-black/60 px-1 text-[10px] font-bold text-white">{i + 1}</div>
                <button type="button" onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))} className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-red-600 text-xs font-bold text-white">✕</button>
              </div>
            ))}
          </div>
        )}
        <p className="mt-2 text-xs text-slate-400">
          L&apos;ordre des photos = l&apos;ordre dans la vidéo. Durée totale ≈ {(photos.length * dureePhoto + 4.6).toFixed(0)}s.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => void generer()}
          disabled={busy || photos.length === 0}
          className="rounded-xl bg-copper px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-copper/30 transition hover:brightness-110 disabled:opacity-50"
        >
          {busy ? `🎬 Montage en cours… ${progress}%` : "🎬 Générer la vidéo"}
        </button>
        {busy && (
          <button onClick={() => (annuler.current = true)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
            Annuler
          </button>
        )}
        {busy && <span className="text-xs text-slate-400">La vidéo se construit en temps réel (~{(photos.length * dureePhoto + 4.6).toFixed(0)}s), laissez l&apos;onglet ouvert.</span>}
      </div>
      {erreur && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{erreur}</p>}

      {videoUrl && (
        <div className="mt-5">
          <video src={videoUrl} controls className="w-full max-w-sm rounded-2xl border border-slate-200 bg-black" />
          <div className="mt-3">
            <a href={videoUrl} download={`Montage ${(ville || "bien").replace(/[\\/:*?"<>|]/g, "-")}.webm`} className="rounded-xl bg-navy px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-deep">
              ⬇ Télécharger la vidéo (.webm)
            </a>
            <p className="mt-2 text-xs text-slate-400">Format .webm — accepté par Facebook/LinkedIn ; pour Instagram/TikTok, convertissez en .mp4 (l&apos;app de publication le propose souvent).</p>
          </div>
        </div>
      )}
    </div>
  );
}
