"use client";

import { useEffect, useState } from "react";
import MontageVideo from "@/components/MontageVideo";
import Visite360 from "@/components/Visite360";
import {
  addVisiteScene,
  compresserPriseDeVue,
  createVisite,
  deleteVisite,
  deleteVisiteScene,
  listVisites,
  urlImageVisite,
  type VisiteVirtuelle,
} from "@/lib/visites";

// Univers « Visites virtuelles » : les négociateurs déposent leurs prises
// de vue 360° (exports JPG équirectangulaires de l'Insta360, une par pièce)
// et la visite navigable est générée automatiquement, avec un lien de
// partage à envoyer aux clients.

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/20";

const dateFr = (t: number) => new Date(t).toLocaleDateString("fr-FR");

// Domaine PUBLIC des liens de visite — distinct de l'outil interne, pour
// que les clients ne voient jamais l'adresse de l'outil IA. En local, on
// garde l'origine courante pour pouvoir tester.
const HOTE_VISITE = process.env.NEXT_PUBLIC_VISITE_HOST ?? "https://visite360-icaza.vercel.app";
const baseLienVisite = () =>
  typeof window !== "undefined" && window.location.hostname === "localhost" ? window.location.origin : HOTE_VISITE;

/** Télécharge la visite en UN fichier HTML autonome (viewer + prises de
 *  vue incluses en base64) — lisible hors ligne dans tout navigateur. */
async function telechargerVisiteHtml(v: VisiteVirtuelle): Promise<void> {
  const urls = urlImageVisite(v.id);
  const scenes: { nom: string; dataUri: string }[] = [];
  for (const s of v.scenes) {
    const res = await fetch(urls(s.imgId));
    if (!res.ok) throw new Error(`Prise de vue « ${s.nom} » introuvable`);
    const buf = new Uint8Array(await res.arrayBuffer());
    let bin = "";
    for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    scenes.push({ nom: s.nom, dataUri: `data:image/jpeg;base64,${btoa(bin)}` });
  }
  const html = [
    "<!doctype html><html lang=\"fr\"><head><meta charset=\"utf-8\">",
    "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">",
    `<title>Visite 360° — ${v.bien.replace(/</g, "&lt;")}</title>`,
    "<style>body{margin:0;background:#0c1b2a;color:#fff;font-family:Arial,sans-serif}header{display:flex;align-items:center;gap:12px;padding:14px 18px}header .b{width:40px;height:40px;border-radius:10px;background:#b4975b;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:17px}h1{font-size:16px;margin:0}p.s{margin:2px 0 0;font-size:12px;color:#9fb0c0}#vue{position:relative;height:78vh;margin:0 14px;border-radius:14px;overflow:hidden;background:#000}canvas{width:100%;height:100%;display:block;cursor:grab;touch-action:none}#barre{position:absolute;left:0;right:0;bottom:0;display:flex;flex-wrap:wrap;gap:6px;padding:10px;background:linear-gradient(transparent,rgba(0,0,0,.8))}#barre button{border:0;border-radius:99px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;background:rgba(255,255,255,.15);color:#fff}#barre button.on{background:#b4975b}footer{text-align:center;font-size:11px;color:#9fb0c0;padding:12px}</style></head><body>",
    "<header><div class=\"b\">21</div><div><h1>CENTURY 21 Icaza Immobilier</h1>",
    `<p class="s">Visite virtuelle — ${v.bien.replace(/</g, "&lt;")}</p></div></header>`,
    "<div id=\"vue\"><canvas id=\"cv\"></canvas><div id=\"barre\"></div></div>",
    "<footer>CENTURY 21 Icaza Immobilier — 32 avenue de la Paix, 13500 Martigues · 04 42 42 80 85</footer>",
    "<script>",
    `var SCENES=${JSON.stringify(scenes)};`,
    "var cv=document.getElementById('cv'),gl=cv.getContext('webgl');",
    "var VS='attribute vec2 aPos;void main(){gl_Position=vec4(aPos,0.,1.);}';",
    "var FS='precision highp float;uniform sampler2D uTex;uniform vec2 uReso;uniform float uYaw;uniform float uPitch;uniform float uFov;const float PI=3.14159265358979;void main(){vec2 ndc=(gl_FragCoord.xy/uReso)*2.-1.;float aspect=uReso.x/uReso.y;float t=tan(uFov*.5);float cy=cos(uYaw),sy=sin(uYaw),cp=cos(uPitch),sp=sin(uPitch);vec3 f=vec3(cp*sy,sp,-cp*cy);vec3 r=vec3(cy,0.,sy);vec3 u=cross(r,f);vec3 d=normalize(f+ndc.x*t*aspect*r+ndc.y*t*u);float lon=atan(d.x,-d.z);float lat=asin(clamp(d.y,-1.,1.));gl_FragColor=texture2D(uTex,vec2((lon+PI)/(2.*PI),.5-lat/PI));}';",
    "function sh(t,s){var x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);return x;}",
    "var pg=gl.createProgram();gl.attachShader(pg,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pg,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pg);gl.useProgram(pg);",
    "var bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);",
    "var aP=gl.getAttribLocation(pg,'aPos');gl.enableVertexAttribArray(aP);gl.vertexAttribPointer(aP,2,gl.FLOAT,false,0,0);",
    "var U={};['uReso','uYaw','uPitch','uFov','uTex'].forEach(function(n){U[n]=gl.getUniformLocation(pg,n);});",
    "var tx=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tx);[[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE],[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR]].forEach(function(p){gl.texParameteri(gl.TEXTURE_2D,p[0],p[1]);});gl.uniform1i(U.uTex,0);",
    "var yaw=0,pitch=0,fov=75*Math.PI/180,drag=false,px=0,py=0;",
    "function rd(){var d=Math.min(devicePixelRatio||1,2),w=Math.round(cv.clientWidth*d),h=Math.round(cv.clientHeight*d);if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;gl.viewport(0,0,w,h);}gl.uniform2f(U.uReso,cv.width,cv.height);gl.uniform1f(U.uYaw,yaw);gl.uniform1f(U.uPitch,pitch);gl.uniform1f(U.uFov,fov);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}",
    "function charge(i){var im=new Image();im.onload=function(){gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,im);yaw=0;pitch=0;rd();};im.src=SCENES[i].dataUri;var bs=document.querySelectorAll('#barre button');for(var j=0;j<bs.length;j++)bs[j].className=j===i?'on':'';}",
    "var barre=document.getElementById('barre');SCENES.forEach(function(s,i){var b=document.createElement('button');b.textContent=s.nom;b.onclick=function(){charge(i);};barre.appendChild(b);});",
    "cv.addEventListener('pointerdown',function(e){drag=true;px=e.clientX;py=e.clientY;cv.setPointerCapture(e.pointerId);});",
    "cv.addEventListener('pointermove',function(e){if(!drag)return;var v=fov/(cv.clientHeight||600);yaw-=(e.clientX-px)*v;pitch+=(e.clientY-py)*v;pitch=Math.max(-1.48,Math.min(1.48,pitch));px=e.clientX;py=e.clientY;rd();});",
    "cv.addEventListener('pointerup',function(){drag=false;});",
    "cv.addEventListener('wheel',function(e){e.preventDefault();fov=Math.max(30*Math.PI/180,Math.min(100*Math.PI/180,fov+e.deltaY*.001));rd();},{passive:false});",
    "addEventListener('resize',rd);if(SCENES.length)charge(0);",
    "</script></body></html>",
  ].join("");
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Visite 360 - ${v.bien.replace(/[\\/:*?"<>|]/g, "-")}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function VisitesPage({ onRetour }: { onRetour: () => void }) {
  const [mode, setMode] = useState<"virtuelle" | "montage">("virtuelle");
  const [visites, setVisites] = useState<VisiteVirtuelle[] | null>(null);
  const [ouverte, setOuverte] = useState<VisiteVirtuelle | null>(null);
  const [creation, setCreation] = useState(false);
  const [bien, setBien] = useState("");
  const [nego, setNego] = useState("");
  const [nomPiece, setNomPiece] = useState("");
  const [busy, setBusy] = useState(false);
  const [progression, setProgression] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [copie, setCopie] = useState(false);

  const recharger = () => listVisites().then(setVisites).catch(() => setVisites([]));
  useEffect(() => {
    void recharger();
  }, []);

  const creer = async () => {
    if (!bien.trim()) return setErreur("Renseignez la désignation du bien.");
    setBusy(true);
    setErreur(null);
    const v = await createVisite({ bien, negociateur: nego });
    setBusy(false);
    if (!v) return setErreur("Création impossible — réessayez.");
    setCreation(false);
    setBien("");
    setOuverte(v);
    void recharger();
  };

  const ajouterPrises = async (files: FileList | null) => {
    if (!files || !ouverte) return;
    setBusy(true);
    setErreur(null);
    try {
      let v: VisiteVirtuelle | null = ouverte;
      const liste = Array.from(files);
      for (let i = 0; i < liste.length; i++) {
        const f = liste[i];
        setProgression(`Compression et envoi ${i + 1}/${liste.length} — ${f.name}`);
        const data = await compresserPriseDeVue(f);
        const nom = nomPiece.trim()
          ? liste.length > 1
            ? `${nomPiece.trim()} ${i + 1}`
            : nomPiece.trim()
          : f.name.replace(/\.[^.]+$/, "").slice(0, 40);
        v = await addVisiteScene(ouverte.id, { nom, data });
      }
      if (v) setOuverte(v);
      setNomPiece("");
      void recharger();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Envoi impossible");
    } finally {
      setBusy(false);
      setProgression(null);
    }
  };

  const supprimerScene = async (imgId: string, nom: string) => {
    if (!ouverte) return;
    if (!confirm(`Retirer la pièce « ${nom} » de la visite ?`)) return;
    const v = await deleteVisiteScene(ouverte.id, imgId);
    if (v) setOuverte(v);
    void recharger();
  };

  const supprimerVisite = async () => {
    if (!ouverte) return;
    if (!confirm(`Supprimer la visite « ${ouverte.bien} » et toutes ses prises de vue ? Le lien client cessera de fonctionner.`)) return;
    await deleteVisite(ouverte.id);
    setOuverte(null);
    void recharger();
  };

  const lienPartage = ouverte ? `${baseLienVisite()}/visite/${ouverte.id}` : "";
  const copierLien = async () => {
    try {
      await navigator.clipboard.writeText(lienPartage);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      /* presse-papiers indisponible */
    }
  };

  // Barre d'onglets : visite virtuelle 360° ↔ montage vidéo classique
  const Onglets = () => (
    <div className="mb-4 flex gap-2">
      <button onClick={() => setMode("virtuelle")} className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${mode === "virtuelle" ? "bg-navy text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
        🌐 Visite virtuelle 360°
      </button>
      <button onClick={() => { setMode("montage"); setOuverte(null); }} className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${mode === "montage" ? "bg-navy text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
        🎬 Montage vidéo (réseaux sociaux)
      </button>
    </div>
  );

  // ---------- Montage vidéo classique ----------
  if (mode === "montage") {
    return (
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-navy">🎬 Montage vidéo</h2>
            <p className="text-sm text-slate-500">Une vidéo animée du bien à partir des photos — pour vos Reels et posts, sans visite 360°.</p>
          </div>
          <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
            ← Accueil
          </button>
        </div>
        <Onglets />
        <MontageVideo />
      </div>
    );
  }

  // ---------- Vue d'une visite ----------
  if (ouverte) {
    return (
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-navy">🎥 {ouverte.bien}</h2>
            <p className="text-sm text-slate-500">
              {[ouverte.negociateur, `${ouverte.scenes.length} pièce${ouverte.scenes.length > 1 ? "s" : ""}`, `créée le ${dateFr(ouverte.createdAt)}`]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setOuverte(null)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
              ← Toutes les visites
            </button>
            <button onClick={() => void supprimerVisite()} className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50">
              Supprimer
            </button>
          </div>
        </div>

        {/* Lien de partage client */}
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-copper/40 bg-copper-soft/30 p-4">
          <span className="text-sm font-bold text-navy">🔗 Lien à envoyer au client :</span>
          <code className="min-w-0 flex-1 truncate rounded-lg bg-white px-3 py-1.5 text-xs text-slate-700">{lienPartage}</code>
          <button onClick={() => void copierLien()} className="rounded-lg bg-copper px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110">
            {copie ? "✓ Copié !" : "📋 Copier"}
          </button>
          <a href={lienPartage} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
            Ouvrir ↗
          </a>
          <button
            onClick={() => {
              setBusy(true);
              setErreur(null);
              void telechargerVisiteHtml(ouverte)
                .catch((e) => setErreur(e instanceof Error ? e.message : "Téléchargement impossible"))
                .finally(() => setBusy(false));
            }}
            disabled={busy || ouverte.scenes.length === 0}
            className="rounded-lg border border-copper bg-white px-3 py-1.5 text-sm font-bold text-copper transition hover:bg-copper-soft/40 disabled:opacity-50"
          >
            {busy ? "Préparation…" : "⬇ Télécharger la visite"}
          </button>
          <p className="w-full text-xs text-slate-500">
            Le lien s&apos;ouvre sur <b>visite360-icaza.vercel.app</b> — distinct de l&apos;outil interne. Le
            téléchargement produit un fichier HTML autonome (visite complète incluse) lisible hors ligne.
          </p>
        </div>

        {/* Dépôt des prises de vue */}
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-end gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Nom de la pièce (vide = nom du fichier)</span>
              <input className={inputCls} value={nomPiece} onChange={(e) => setNomPiece(e.target.value)} placeholder="Séjour" />
            </label>
            <label className={`cursor-pointer rounded-xl border-2 border-dashed border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-500 transition hover:border-copper hover:text-copper ${busy ? "pointer-events-none opacity-50" : ""}`}>
              {busy ? progression ?? "Envoi en cours…" : "+ Ajouter des prises de vue 360° (JPG)"}
              <input type="file" accept="image/jpeg,image/jpg,image/png" multiple className="hidden" onChange={(e) => { void ajouterPrises(e.target.files); e.target.value = ""; }} />
            </label>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Depuis l&apos;app Insta360 : exportez chaque pièce en <b>photo 360 (JPG équirectangulaire)</b> puis
            déposez les fichiers ici — la visite se génère automatiquement. Compression automatique avant envoi.
          </p>
          {erreur && <p className="mt-2 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">{erreur}</p>}
        </div>

        {/* La visite générée */}
        {ouverte.scenes.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-400">
            Aucune prise de vue pour l&apos;instant — déposez vos photos 360° ci-dessus.
          </p>
        ) : (
          <>
            <Visite360 scenes={ouverte.scenes} urlImage={urlImageVisite(ouverte.id)} />
            <ul className="mt-3 flex flex-wrap gap-2">
              {ouverte.scenes.map((s) => (
                <li key={s.imgId} className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-700">
                  {s.nom}
                  <button onClick={() => void supprimerScene(s.imgId, s.nom)} className="text-slate-400 hover:text-red-600" aria-label={`Retirer ${s.nom}`}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }

  // ---------- Liste des visites ----------
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-navy">🎬 Montage vidéo</h2>
          <p className="text-sm text-slate-500">Visite virtuelle 360° (prises de vue Insta360) ou montage vidéo classique du bien pour les réseaux sociaux.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
            ← Accueil
          </button>
          <button onClick={() => setCreation(!creation)} className="rounded-lg bg-copper px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110">
            + Nouvelle visite
          </button>
        </div>
      </div>
      <Onglets />

      {creation && (
        <div className="mb-4 grid gap-3 rounded-2xl border border-copper/40 bg-copper-soft/30 p-4 sm:grid-cols-3">
          <input className={inputCls} value={bien} onChange={(e) => setBien(e.target.value)} placeholder="Bien * (T3 — 12 quai Brescon, Martigues)" />
          <input className={inputCls} value={nego} onChange={(e) => setNego(e.target.value)} placeholder="Négociateur" />
          <button onClick={() => void creer()} disabled={busy} className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-navy-deep disabled:opacity-50">
            {busy ? "Création…" : "Créer la visite"}
          </button>
          {erreur && <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700 sm:col-span-3">{erreur}</p>}
        </div>
      )}

      {visites === null ? (
        <p className="p-4 text-sm text-slate-400">Chargement…</p>
      ) : visites.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-400">Aucune visite virtuelle pour l&apos;instant — créez la première.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visites.map((v) => (
            <button
              key={v.id}
              onClick={() => setOuverte(v)}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-copper hover:shadow-md"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-lg">🎥</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                  {v.scenes.length} pièce{v.scenes.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="text-sm font-bold text-navy">{v.bien}</div>
              <div className="mt-1 text-xs text-slate-400">
                {[v.negociateur, `mise à jour le ${dateFr(v.updatedAt)}`].filter(Boolean).join(" · ")}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
