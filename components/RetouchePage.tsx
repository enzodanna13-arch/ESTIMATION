"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { zipStore } from "@/lib/carrousel";
import { imageEditingService } from "@/lib/imageEditing/service";
import { ROOM_TYPES, STYLES_DECO, type EditAction, type ImageData } from "@/lib/imageEditing/types";

// ---- Modèle de données ----
type VersionKind = EditAction | "original";
interface Version {
  id: string;
  kind: VersionKind;
  label: string;
  image: ImageData;
  style?: string;
  roomType?: string;
  validee?: boolean;
  createdAt: number;
}
interface PhotoBien {
  id: string;
  nom: string;
  versions: Version[]; // [0] = original
  courantId: string;
}

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const src = (im: ImageData) => `data:${im.mediaType};base64,${im.data}`;

const KIND_LABEL: Record<VersionKind, string> = {
  original: "Original",
  enhance: "Embellie",
  emptyRoom: "Pièce vide",
  virtualStaging: "Meublée",
};

// Fichier → ImageData en qualité publication (max 1920 px, JPEG 0.9)
function fichierVersImageData(file: File): Promise<ImageData> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 1920 / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d");
      if (!ctx) return rej(new Error("Canvas indisponible"));
      ctx.drawImage(img, 0, 0, w, h);
      res({ mediaType: "image/jpeg", data: c.toDataURL("image/jpeg", 0.9).split(",")[1] });
    };
    img.onerror = () => rej(new Error("Image illisible"));
    const fr = new FileReader();
    fr.onload = () => (img.src = fr.result as string);
    fr.onerror = () => rej(new Error("Lecture impossible"));
    fr.readAsDataURL(file);
  });
}

function b64ToUint8(b64: string): Uint8Array {
  const bin = atob(b64);
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}
function telechargerBlob(blob: Blob, nom: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = nom; a.click();
  URL.revokeObjectURL(url);
}
function nomFichier(p: PhotoBien, v: Version) {
  const base = p.nom.replace(/\.[^.]+$/, "");
  return `${base}-${v.kind}.jpg`;
}

export default function RetouchePage({ onRetour }: { onRetour: () => void }) {
  const [photos, setPhotos] = useState<PhotoBien[]>([]);
  const [selId, setSelId] = useState<string | null>(null);
  const [importEnCours, setImportEnCours] = useState(false);
  const [comparer, setComparer] = useState(false);
  const [curseur, setCurseur] = useState(50); // position du comparateur (%)
  const [stagingOuvert, setStagingOuvert] = useState(false);
  const [styleChoisi, setStyleChoisi] = useState<string>("auto");
  const [roomChoisi, setRoomChoisi] = useState<string>("salon");
  // État de génération
  const [traitement, setTraitement] = useState<{ action: EditAction; progress: number; message: string } | null>(null);
  const [erreur, setErreur] = useState<{ action: EditAction; message: string; notConfigured?: boolean } | null>(null);
  const [selectionDl, setSelectionDl] = useState<Set<string>>(new Set());

  const photo = photos.find((p) => p.id === selId) ?? null;
  const courant = photo?.versions.find((v) => v.id === photo.courantId) ?? null;
  const original = photo?.versions[0] ?? null;

  // ---- Import ----
  const importer = async (files: FileList | null) => {
    if (!files?.length) return;
    setImportEnCours(true);
    const nouvelles: PhotoBien[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) continue;
      try {
        const im = await fichierVersImageData(f);
        const vid = uid();
        nouvelles.push({ id: uid(), nom: f.name, courantId: vid, versions: [{ id: vid, kind: "original", label: "Original", image: im, createdAt: Date.now() }] });
      } catch { /* ignore le fichier illisible */ }
    }
    setPhotos((p) => [...p, ...nouvelles]);
    if (!selId && nouvelles[0]) setSelId(nouvelles[0].id);
    setImportEnCours(false);
  };

  // ---- Génération ----
  const majPhoto = (id: string, fn: (p: PhotoBien) => PhotoBien) =>
    setPhotos((prev) => prev.map((p) => (p.id === id ? fn(p) : p)));

  const lancer = async (action: EditAction) => {
    if (!photo || !courant) return;
    setErreur(null);
    setStagingOuvert(false);
    // Base : pour meubler/vider on part de la version courante affichée
    const base = courant.image;
    const messages: Record<EditAction, string> = {
      enhance: "Amélioration de la photo…",
      emptyRoom: "Suppression du mobilier et reconstruction…",
      virtualStaging: "Aménagement virtuel de la pièce…",
    };
    setTraitement({ action, progress: 6, message: messages[action] });
    const timer = setInterval(() => {
      setTraitement((t) => (t ? { ...t, progress: Math.min(t.progress + (action === "enhance" ? 22 : 7), 92) } : t));
    }, action === "enhance" ? 120 : 900);

    let result;
    if (action === "enhance") result = await imageEditingService.enhanceImage(base);
    else if (action === "emptyRoom") result = await imageEditingService.emptyRoom(base);
    else result = await imageEditingService.virtualStaging(base, styleChoisi, roomChoisi);

    clearInterval(timer);
    if (!result.ok || !result.image) {
      setTraitement(null);
      setErreur({ action, message: result.error ?? "Échec de la génération.", notConfigured: result.notConfigured });
      return;
    }
    setTraitement((t) => (t ? { ...t, progress: 100 } : t));
    const v: Version = {
      id: uid(), kind: action, label: KIND_LABEL[action], image: result.image,
      style: action === "virtualStaging" ? styleChoisi : undefined,
      roomType: action === "virtualStaging" ? roomChoisi : undefined,
      createdAt: Date.now(),
    };
    setTimeout(() => {
      majPhoto(photo.id, (p) => ({ ...p, versions: [...p.versions, v], courantId: v.id }));
      setTraitement(null);
      setComparer(true);
    }, 250);
  };

  const revenirOriginal = () => photo && original && majPhoto(photo.id, (p) => ({ ...p, courantId: p.versions[0].id }));
  const choisirVersion = (vid: string) => photo && majPhoto(photo.id, (p) => ({ ...p, courantId: vid }));
  const conserver = () => photo && courant && majPhoto(photo.id, (p) => ({ ...p, versions: p.versions.map((v) => (v.id === courant.id ? { ...v, validee: true } : v)) }));
  const supprimerVersion = (vid: string) =>
    photo && majPhoto(photo.id, (p) => {
      if (p.versions[0].id === vid) return p; // on ne supprime jamais l'original
      const versions = p.versions.filter((v) => v.id !== vid);
      return { ...p, versions, courantId: p.courantId === vid ? p.versions[0].id : p.courantId };
    });

  // ---- Téléchargements ----
  const dlCourant = () => photo && courant && telechargerBlob(new Blob([b64ToUint8(courant.image.data) as unknown as BlobPart], { type: courant.image.mediaType }), nomFichier(photo, courant));
  const versionFinale = (p: PhotoBien) => p.versions.find((v) => v.id === p.courantId) ?? p.versions[0];
  const dlZip = (liste: PhotoBien[], nomZip: string) => {
    const fichiers = liste.map((p) => { const v = versionFinale(p); return { nom: nomFichier(p, v), data: b64ToUint8(v.image.data) }; });
    if (fichiers.length) telechargerBlob(zipStore(fichiers), nomZip);
  };
  const toggleSel = (id: string) => setSelectionDl((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  useEffect(() => { setComparer(false); setErreur(null); }, [selId]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3 print:hidden">
        <button type="button" onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Accueil</button>
        <h2 className="text-2xl font-bold text-navy">🎨 Retouche photo</h2>
        <span className="rounded-full bg-copper-soft px-3 py-1 text-xs font-semibold text-copper">Importer → Choisir une action → Générer → Comparer → Valider → Télécharger</span>
      </div>

      {photos.length === 0 ? (
        /* ---- Zone d'import initiale ---- */
        <label className="flex min-h-[45vh] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white text-center transition hover:border-copper hover:bg-copper-soft/20">
          <div className="text-5xl">📷</div>
          <div className="mt-3 text-lg font-bold text-navy">{importEnCours ? "Import en cours…" : "Importer des photos du bien"}</div>
          <div className="mt-1 max-w-md text-sm text-slate-500">Glissez ou sélectionnez une ou plusieurs photos. L&apos;original est toujours conservé.</div>
          <span className="mt-4 rounded-lg bg-copper px-5 py-2 text-sm font-bold text-white">Choisir des photos</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { void importer(e.target.files); e.target.value = ""; }} />
        </label>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
          {/* ---- Galerie ---- */}
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-copper/60 px-3 py-2.5 text-sm font-semibold text-copper transition hover:bg-copper-soft/40">
              + Ajouter des photos
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { void importer(e.target.files); e.target.value = ""; }} />
            </label>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {photos.map((p) => {
                const v = versionFinale(p);
                const active = p.id === selId;
                return (
                  <button key={p.id} type="button" onClick={() => setSelId(p.id)} className={`group relative overflow-hidden rounded-xl border-2 text-left transition ${active ? "border-copper shadow-md" : "border-slate-200 hover:border-slate-300"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src(v.image)} alt={p.nom} className="h-24 w-full object-cover lg:h-28" />
                    <span className="absolute left-1 top-1 rounded bg-navy/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">{KIND_LABEL[v.kind]}</span>
                    {p.versions.length > 1 && <span className="absolute right-1 top-1 rounded bg-copper px-1.5 py-0.5 text-[10px] font-bold text-white">{p.versions.length} vers.</span>}
                    <label className="absolute bottom-1 right-1 flex items-center gap-1 rounded bg-white/85 px-1.5 py-0.5 text-[10px] text-slate-700" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={selectionDl.has(p.id)} onChange={() => toggleSel(p.id)} /> sél.
                    </label>
                  </button>
                );
              })}
            </div>
            {/* Téléchargements groupés */}
            <div className="space-y-1.5 border-t border-slate-200 pt-2">
              <button type="button" disabled={selectionDl.size === 0} onClick={() => dlZip(photos.filter((p) => selectionDl.has(p.id)), "photos-selection.zip")} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40">⬇ Sélection ({selectionDl.size})</button>
              <button type="button" onClick={() => dlZip(photos, "photos-bien.zip")} className="w-full rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-deep">⬇ Toutes les photos finales</button>
            </div>
          </div>

          {/* ---- Zone principale ---- */}
          <div className="space-y-4">
            {photo && courant && (
              <>
                {/* Aperçu / comparateur */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900">
                  {comparer && original && courant.id !== original.id ? (
                    <div className="relative select-none">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src(courant.image)} alt="Après" className="block max-h-[62vh] w-full object-contain" />
                      <div className="absolute inset-0 overflow-hidden" style={{ width: `${curseur}%` }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src(original.image)} alt="Avant" className="block h-full w-full object-contain" style={{ maxHeight: "62vh" }} />
                      </div>
                      <div className="absolute inset-y-0" style={{ left: `${curseur}%` }}><div className="h-full w-0.5 bg-white/90" /></div>
                      <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">Avant</span>
                      <span className="absolute right-2 top-2 rounded bg-copper px-2 py-0.5 text-xs font-semibold text-white">Après</span>
                      <input type="range" min={0} max={100} value={curseur} onChange={(e) => setCurseur(+e.target.value)} className="absolute inset-x-0 bottom-3 mx-auto w-2/3 accent-copper" />
                    </div>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={src(courant.image)} alt={photo.nom} className="mx-auto block max-h-[62vh] w-full object-contain" />
                  )}

                  {/* Overlay génération en cours */}
                  {traitement && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-deep/80 text-white backdrop-blur-sm">
                      <div className="text-4xl">✨</div>
                      <div className="mt-3 text-sm font-semibold">Votre photo est en cours de transformation…</div>
                      <div className="mt-1 text-xs text-slate-300">{traitement.message}</div>
                      <div className="mt-4 h-2 w-64 overflow-hidden rounded-full bg-white/20">
                        <div className="h-full rounded-full bg-copper transition-all duration-300" style={{ width: `${traitement.progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Barre d'état / actions post-génération */}
                {erreur && (
                  <div className={`rounded-xl border p-3 text-sm ${erreur.notConfigured ? "border-amber-300 bg-amber-50 text-amber-800" : "border-red-200 bg-red-50 text-red-700"}`}>
                    <b>{erreur.notConfigured ? "Fonction prête à connecter." : "Échec de la génération."}</b> {erreur.message}
                    {!erreur.notConfigured && (
                      <button type="button" onClick={() => lancer(erreur.action)} className="ml-2 rounded bg-red-600 px-2.5 py-1 text-xs font-bold text-white hover:brightness-110">Relancer</button>
                    )}
                  </div>
                )}

                {/* Actions */}
                {!traitement && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => lancer("enhance")} className="rounded-xl bg-copper px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110">✨ Embellir la photo</button>
                      <button type="button" onClick={() => lancer("emptyRoom")} className="rounded-xl border border-navy bg-navy px-4 py-2.5 text-sm font-bold text-white transition hover:bg-navy-deep">🪑 Vider la pièce</button>
                      <button type="button" onClick={() => setStagingOuvert(!stagingOuvert)} className="rounded-xl border-2 border-copper px-4 py-2.5 text-sm font-bold text-copper transition hover:bg-copper-soft/40">🛋 Meubler virtuellement</button>
                      <div className="ml-auto flex flex-wrap gap-2">
                        {original && courant.id !== original.id && <button type="button" onClick={() => setComparer(!comparer)} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">{comparer ? "Vue simple" : "⇄ Avant/Après"}</button>}
                        <button type="button" onClick={dlCourant} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">⬇ Télécharger</button>
                      </div>
                    </div>

                    {/* Décisions post-génération */}
                    {courant.kind !== "original" && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                        <span className="text-xs font-semibold text-slate-400">Cette version :</span>
                        <button type="button" onClick={conserver} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${courant.validee ? "bg-emerald-100 text-emerald-700" : "bg-emerald-600 text-white hover:brightness-110"}`}>{courant.validee ? "✓ Conservée" : "Conserver cette version"}</button>
                        <button type="button" onClick={() => lancer(courant.kind as EditAction)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100">↻ Régénérer</button>
                        {courant.kind === "virtualStaging" && <button type="button" onClick={() => setStagingOuvert(true)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100">🎨 Changer de style</button>}
                        <button type="button" onClick={revenirOriginal} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100">↩ Revenir à l&apos;original</button>
                      </div>
                    )}

                    {/* Panneau home staging : type de pièce + styles */}
                    {stagingOuvert && (
                      <div className="mt-3 rounded-xl border border-copper/40 bg-copper-soft/20 p-3">
                        <div className="mb-2 text-sm font-bold text-navy">Meublement virtuel</div>
                        <div className="mb-3">
                          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Type de pièce</div>
                          <div className="flex flex-wrap gap-1.5">
                            {ROOM_TYPES.map((r) => (
                              <button key={r.id} type="button" onClick={() => setRoomChoisi(r.id)} className={`rounded-full px-3 py-1 text-xs font-semibold transition ${roomChoisi === r.id ? "bg-navy text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}>{r.label}</button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Style de décoration</div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                          <button type="button" onClick={() => setStyleChoisi("auto")} className={`rounded-xl border-2 p-2 text-left transition ${styleChoisi === "auto" ? "border-copper" : "border-slate-200 hover:border-slate-300"}`}>
                            <div className="mb-1 flex h-10 items-center justify-center rounded-lg bg-gradient-to-br from-copper to-navy text-lg">🤖</div>
                            <div className="text-xs font-bold text-navy">IA choisit</div>
                            <div className="text-[10px] text-slate-500">Le style le plus adapté</div>
                          </button>
                          {STYLES_DECO.map((s) => (
                            <button key={s.id} type="button" onClick={() => setStyleChoisi(s.id)} className={`rounded-xl border-2 p-2 text-left transition ${styleChoisi === s.id ? "border-copper" : "border-slate-200 hover:border-slate-300"}`}>
                              <div className="mb-1 h-10 rounded-lg" style={{ background: `linear-gradient(135deg, ${s.swatch[0]}, ${s.swatch[1]})` }} />
                              <div className="text-xs font-bold text-navy">{s.label}</div>
                              <div className="text-[10px] text-slate-500">{s.description}</div>
                            </button>
                          ))}
                        </div>
                        <button type="button" onClick={() => lancer("virtualStaging")} className="mt-3 w-full rounded-xl bg-copper px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-110">
                          Générer le home staging{styleChoisi !== "auto" ? ` · ${STYLES_DECO.find((s) => s.id === styleChoisi)?.label}` : " · IA"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Historique des versions */}
                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Versions de « {photo.nom} »</div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {photo.versions.map((v) => (
                      <button key={v.id} type="button" onClick={() => choisirVersion(v.id)} className={`group relative shrink-0 overflow-hidden rounded-lg border-2 transition ${v.id === photo.courantId ? "border-copper" : "border-slate-200 hover:border-slate-300"}`} title={v.label}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src(v.image)} alt={v.label} className="h-16 w-24 object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-navy/75 px-1 py-0.5 text-center text-[9px] font-semibold text-white">{v.label}{v.validee ? " ✓" : ""}</span>
                        {v.kind !== "original" && <span onClick={(e) => { e.stopPropagation(); supprimerVersion(v.id); }} className="absolute right-0.5 top-0.5 hidden rounded bg-white/80 px-1 text-[10px] text-red-600 group-hover:block">✕</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
