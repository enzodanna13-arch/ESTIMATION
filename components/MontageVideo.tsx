"use client";

import { useRef, useState } from "react";

// Montage vidéo automatique pour les réseaux sociaux : le négociateur
// fournit ses CLIPS vidéo du bien (et éventuellement des photos), l'outil
// les assemble tout seul en UNE vidéo — chaque clip est coupé à une durée
// max, habillage CENTURY 21 (intro + filigrane + slide contact), audio des
// clips conservé. 100 % sur le poste (canvas + MediaRecorder), sans visite
// 360°, sans envoi serveur.

const OR = "#b4975b";
const NAVY = "#0c1b2a";

const FORMATS = {
  reel: { w: 1080, h: 1920, label: "Reel / Story (9:16)" },
  carre: { w: 1080, h: 1080, label: "Carré (1:1)" },
  paysage: { w: 1920, h: 1080, label: "Paysage (16:9)" },
} as const;
type FormatKey = keyof typeof FORMATS;

type Segment = { kind: "video" | "image"; url: string; nom: string };

const supporte = () =>
  typeof window !== "undefined" &&
  typeof window.MediaRecorder !== "undefined" &&
  typeof (HTMLCanvasElement.prototype as unknown as { captureStream?: unknown }).captureStream === "function";

const eur = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

function drawCover(ctx: CanvasRenderingContext2D, src: CanvasImageSource, sw: number, sh: number, W: number, H: number, zoom = 1, panX = 0) {
  const r = Math.max(W / sw, H / sh) * zoom;
  const w = sw * r;
  const h = sh * r;
  ctx.drawImage(src, (W - w) / 2 + panX, (H - h) / 2, w, h);
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

export default function MontageVideo() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [format, setFormat] = useState<FormatKey>("reel");
  const [maxClip, setMaxClip] = useState(5);
  const [dureeImg, setDureeImg] = useState(2.5);
  const [titre, setTitre] = useState("");
  const [ville, setVille] = useState("");
  const [prix, setPrix] = useState("");
  const [nego, setNego] = useState("");
  const [gardeSon, setGardeSon] = useState(true);
  const [busy, setBusy] = useState(false);
  const [etape, setEtape] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const annuler = useRef(false);

  const ajouter = (files: FileList | null) => {
    if (!files) return;
    const nouveaux: Segment[] = [];
    for (const f of Array.from(files)) {
      if (f.type.startsWith("video/")) nouveaux.push({ kind: "video", url: URL.createObjectURL(f), nom: f.name });
      else if (f.type.startsWith("image/")) nouveaux.push({ kind: "image", url: URL.createObjectURL(f), nom: f.name });
    }
    setSegments((s) => [...s, ...nouveaux]);
  };
  const deplacer = (i: number, d: -1 | 1) =>
    setSegments((s) => {
      const n = [...s];
      const j = i + d;
      if (j < 0 || j >= n.length) return s;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });

  const chargerImage = (src: string) =>
    new Promise<HTMLImageElement>((res, rej) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = rej;
      im.src = src;
    });
  const chargerVideo = (src: string) =>
    new Promise<HTMLVideoElement>((res, rej) => {
      const v = document.createElement("video");
      v.src = src;
      v.playsInline = true;
      v.muted = !gardeSon;
      v.crossOrigin = "anonymous";
      v.onloadedmetadata = () => res(v);
      v.onerror = rej;
    });

  const generer = async () => {
    if (segments.length === 0) return setErreur("Ajoutez au moins un clip vidéo (ou une photo).");
    if (!supporte()) return setErreur("Votre navigateur ne permet pas l'enregistrement vidéo. Utilisez Chrome à jour.");
    setBusy(true);
    setErreur(null);
    setVideoUrl(null);
    annuler.current = false;
    let ac: AudioContext | null = null;
    try {
      const { w: W, h: H } = FORMATS[format];
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      // Préchargement des médias
      setEtape("Préparation des clips…");
      const medias = await Promise.all(
        segments.map(async (s) => (s.kind === "video" ? { ...s, el: await chargerVideo(s.url) } : { ...s, el: await chargerImage(s.url) })),
      );

      // Flux : vidéo (canvas) + audio (clips) mixé
      const vStream = (canvas as unknown as { captureStream: (f: number) => MediaStream }).captureStream(30);
      const tracks = [...vStream.getVideoTracks()];
      const clips = medias.filter((m) => m.kind === "video") as { el: HTMLVideoElement }[];
      if (gardeSon && clips.length) {
        ac = new AudioContext();
        await ac.resume();
        const dest = ac.createMediaStreamDestination();
        for (const c of clips) {
          try {
            ac.createMediaElementSource(c.el).connect(dest);
          } catch {
            /* source déjà créée : on ignore */
          }
        }
        tracks.push(...dest.stream.getAudioTracks());
      }
      const combined = new MediaStream(tracks);
      const mime = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].find((m) => MediaRecorder.isTypeSupported(m)) ?? "video/webm";
      const chunks: BlobPart[] = [];
      const rec = new MediaRecorder(combined, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      const fini = new Promise<Blob>((r) => (rec.onstop = () => r(new Blob(chunks, { type: "video/webm" }))));

      const filigrane = () => {
        const g = ctx.createLinearGradient(0, H - H * 0.13, 0, H);
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(1, "rgba(0,0,0,0.5)");
        ctx.fillStyle = g;
        ctx.fillRect(0, H - H * 0.13, W, H * 0.13);
        badge21(ctx, 30, H - W * 0.06 - 30, W * 0.055);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.font = `700 ${W * 0.024}px Arial`;
        ctx.fillText("CENTURY 21 Icaza Immobilier", 30 + W * 0.055 + 16, H - 40);
      };
      const attendre = (ms: number) => new Promise((r) => setTimeout(r, ms));
      const boucle = (dessine: (t: number) => boolean) =>
        new Promise<void>((resolve) => {
          const t0 = performance.now();
          const tick = () => {
            if (annuler.current) return resolve();
            if (dessine((performance.now() - t0) / 1000)) return resolve();
            requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });

      rec.start();

      // --- Intro ---
      if (titre || ville) {
        setEtape("Intro…");
        await boucle((t) => {
          ctx.fillStyle = NAVY;
          ctx.fillRect(0, 0, W, H);
          badge21(ctx, 60, 60, W * 0.1);
          ctx.fillStyle = "#fff";
          ctx.textAlign = "left";
          ctx.font = `800 ${W * 0.072}px Arial`;
          ctx.fillText((titre || "À VENDRE").slice(0, 24), 60, H * 0.52);
          ctx.fillStyle = OR;
          ctx.font = `700 ${W * 0.045}px Arial`;
          if (ville) ctx.fillText(ville, 60, H * 0.52 + W * 0.08);
          if (prix) {
            ctx.fillStyle = "#fff";
            ctx.font = `900 ${W * 0.062}px Arial`;
            ctx.fillText(`${eur.format(Number(prix))} €`, 60, H * 0.52 + W * 0.17);
          }
          return t >= 2;
        });
      }

      // --- Clips / photos ---
      for (let i = 0; i < medias.length; i++) {
        if (annuler.current) break;
        const m = medias[i];
        setEtape(`Clip ${i + 1}/${medias.length}…`);
        if (m.kind === "video") {
          const v = m.el as HTMLVideoElement;
          v.currentTime = 0;
          try {
            await v.play();
          } catch {
            /* lecture auto refusée : on dessine quand même les frames dispo */
          }
          const limite = Math.min(maxClip, isFinite(v.duration) ? v.duration : maxClip);
          await boucle(() => {
            drawCover(ctx, v, v.videoWidth || 1280, v.videoHeight || 720, W, H);
            filigrane();
            return v.currentTime >= limite || v.ended;
          });
          v.pause();
        } else {
          const img = m.el as HTMLImageElement;
          await boucle((t) => {
            const k = Math.min(1, t / dureeImg);
            drawCover(ctx, img, img.width, img.height, W, H, 1.04 + 0.08 * k, (i % 2 ? -1 : 1) * W * 0.03 * (k - 0.5));
            filigrane();
            return t >= dureeImg;
          });
        }
        // Petit fondu noir entre segments
        if (i < medias.length - 1) {
          await boucle((t) => {
            ctx.fillStyle = `rgba(0,0,0,${Math.min(1, t / 0.18)})`;
            ctx.fillRect(0, 0, W, H);
            return t >= 0.18;
          });
        }
      }

      // --- Outro contact ---
      if (!annuler.current) {
        setEtape("Slide contact…");
        await boucle((t) => {
          ctx.fillStyle = NAVY;
          ctx.fillRect(0, 0, W, H);
          badge21(ctx, (W - W * 0.14) / 2, H * 0.28, W * 0.14);
          ctx.fillStyle = "#fff";
          ctx.textAlign = "center";
          ctx.font = `800 ${W * 0.052}px Arial`;
          ctx.fillText("Ce bien vous intéresse ?", W / 2, H * 0.5);
          ctx.fillStyle = OR;
          ctx.font = `700 ${W * 0.038}px Arial`;
          ctx.fillText("CENTURY 21 Icaza Immobilier", W / 2, H * 0.56);
          ctx.fillStyle = "#fff";
          ctx.font = `600 ${W * 0.032}px Arial`;
          ctx.fillText("04 42 42 80 85", W / 2, H * 0.61);
          if (nego) ctx.fillText(nego, W / 2, H * 0.655);
          return t >= 2.4;
        });
      }

      await attendre(120);
      rec.stop();
      const blob = await fini;
      combined.getTracks().forEach((t) => t.stop());
      if (ac) await ac.close();
      if (annuler.current) return;
      setVideoUrl(URL.createObjectURL(blob));
    } catch {
      setErreur("Génération de la vidéo impossible.");
    } finally {
      setEtape("");
      setBusy(false);
    }
  };

  const inputCls = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";
  const dureeTotale = segments.reduce((s, x) => s + (x.kind === "video" ? maxClip : dureeImg), 0) + (titre || ville ? 2 : 0) + 2.4;

  return (
    <div>
      <div className="mb-4 rounded-2xl border border-copper/40 bg-copper-soft/40 p-3 text-xs text-slate-600">
        <b className="text-navy">Montage automatique :</b> déposez vos <b>clips vidéo</b> du bien (et éventuellement
        des photos), l&apos;outil les <b>assemble tout seul</b> en une vidéo — chaque clip est coupé à la durée choisie,
        avec intro/contact CENTURY 21 et le son des clips conservé. Prêt pour vos Reels.
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
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Couper les clips à : {maxClip}s</span>
          <input type="range" min={2} max={10} step={1} value={maxClip} onChange={(e) => setMaxClip(Number(e.target.value))} className="w-full" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Durée des photos : {dureeImg}s</span>
          <input type="range" min={1.5} max={4} step={0.5} value={dureeImg} onChange={(e) => setDureeImg(Number(e.target.value))} className="w-full" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Titre (intro)</span>
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
        <label className="flex items-center gap-2 pt-6 text-sm text-slate-600">
          <input type="checkbox" checked={gardeSon} onChange={(e) => setGardeSon(e.target.checked)} />
          Conserver le son des clips
        </label>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <label className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-500 transition hover:border-copper hover:text-copper">
          + Ajouter des clips vidéo (et photos)
          <input type="file" accept="video/*,image/*" multiple className="hidden" onChange={(e) => { ajouter(e.target.files); e.target.value = ""; }} />
        </label>
        {segments.length > 0 && (
          <ul className="mt-3 space-y-1">
            {segments.map((s, i) => (
              <li key={i} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-700">
                <span className="font-bold text-slate-400">{i + 1}</span>
                <span>{s.kind === "video" ? "🎞️" : "🖼️"}</span>
                <span className="min-w-0 flex-1 truncate">{s.nom}</span>
                <button onClick={() => deplacer(i, -1)} disabled={i === 0} className="px-1 text-slate-400 disabled:opacity-30">▲</button>
                <button onClick={() => deplacer(i, 1)} disabled={i === segments.length - 1} className="px-1 text-slate-400 disabled:opacity-30">▼</button>
                <button onClick={() => setSegments((p) => p.filter((_, j) => j !== i))} className="text-red-500">✕</button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-xs text-slate-400">L&apos;ordre de la liste = l&apos;ordre du montage. Durée finale ≈ {dureeTotale.toFixed(0)}s.</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button onClick={() => void generer()} disabled={busy || segments.length === 0} className="rounded-xl bg-copper px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-copper/30 transition hover:brightness-110 disabled:opacity-50">
          {busy ? `🎬 Montage en cours… ${etape}` : "🎬 Monter la vidéo automatiquement"}
        </button>
        {busy && (
          <button onClick={() => (annuler.current = true)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
            Annuler
          </button>
        )}
        {busy && <span className="text-xs text-slate-400">Le montage se construit en temps réel (~{dureeTotale.toFixed(0)}s), laissez l&apos;onglet ouvert et actif.</span>}
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
