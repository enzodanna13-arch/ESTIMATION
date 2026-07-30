"use client";

import { useEffect, useState } from "react";
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

export default function VisitesPage({ onRetour }: { onRetour: () => void }) {
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

  const lienPartage = ouverte ? `${typeof window !== "undefined" ? window.location.origin : ""}/visite/${ouverte.id}` : "";
  const copierLien = async () => {
    try {
      await navigator.clipboard.writeText(lienPartage);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      /* presse-papiers indisponible */
    }
  };

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
          <h2 className="text-2xl font-bold text-navy">🎥 Visites virtuelles</h2>
          <p className="text-sm text-slate-500">Déposez vos prises de vue Insta360 — la visite 360° se génère automatiquement, avec un lien à envoyer aux clients.</p>
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
