"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addClientFile,
  CATEGORIES_PIECES,
  createClient,
  deleteClient,
  deleteClientFile,
  getClientFileB64,
  listClients,
  telechargerClientFile,
  type ClientDossier,
  type PieceClient,
} from "@/lib/clients";
import { PIECES_ATTENDUES } from "@/lib/docTypes";

// Dossiers clients partagés : chaque négociateur y range toutes les pièces
// PDF d'un client (comptes rendus de visite, mandat, diagnostics…), les
// retrouve par la recherche, et peut les réinjecter ailleurs dans l'outil
// (ex. comptes rendus → bilan de commercialisation).

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/20";

const dateFr = (t: number) => new Date(t).toLocaleDateString("fr-FR");

const CATEGORIE_COULEURS: Record<string, string> = {
  "Compte rendu de visite": "bg-copper-soft/60 text-copper",
  "Titre de propriété": "bg-emerald-50 text-emerald-700",
  Mandat: "bg-blue-50 text-blue-700",
  "Pièce d'identité": "bg-violet-50 text-violet-700",
  Tracfin: "bg-red-50 text-red-700",
  Diagnostics: "bg-green-50 text-green-700",
  "Taxe foncière": "bg-amber-50 text-amber-700",
  "PV d'AG": "bg-cyan-50 text-cyan-700",
  "Appel de fonds": "bg-teal-50 text-teal-700",
  "Bon de visite": "bg-indigo-50 text-indigo-700",
  "Bilan de commercialisation": "bg-orange-50 text-orange-700",
  "Offre d'achat": "bg-rose-50 text-rose-700",
  Autre: "bg-slate-100 text-slate-600",
};

/** Analyse de complétude : pièces attendues absentes du dossier. */
function piecesManquantes(d: ClientDossier): { categorie: string; copro?: boolean }[] {
  const presentes = new Set(d.pieces.map((p) => p.categorie));
  return PIECES_ATTENDUES.filter((a) => !presentes.has(a.categorie));
}

function BadgeCompletude({ d }: { d: ClientDossier }) {
  const manquantes = piecesManquantes(d);
  return manquantes.length === 0 ? (
    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-700">✓ Complet</span>
  ) : (
    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">
      {manquantes.length} manquant{manquantes.length > 1 ? "s" : ""}
    </span>
  );
}

function Badge({ categorie }: { categorie: string }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${CATEGORIE_COULEURS[categorie] ?? CATEGORIE_COULEURS.Autre}`}>
      {categorie}
    </span>
  );
}

function filtrer(dossiers: ClientDossier[], q: string): ClientDossier[] {
  const t = q.trim().toLowerCase();
  if (!t) return dossiers;
  return dossiers.filter((d) =>
    [d.nom, d.bien, d.negociateur, ...d.pieces.map((p) => p.nom)].join(" ").toLowerCase().includes(t),
  );
}

/** Rapport de complétude en PDF (pdf-lib, généré sur le poste — papier à
 *  en-tête C21 avec wordmark, sceau et bandeau officiels). */
async function telechargerRapportPdf(dossiers: ClientDossier[]): Promise<void> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvB = await pdf.embedFont(StandardFonts.HelveticaBold);
  const A4: [number, number] = [595.28, 841.89];
  const M = 57;
  const noir = rgb(0, 0, 0);
  const gris = rgb(0.45, 0.45, 0.45);
  const or = rgb(0.706, 0.592, 0.357);
  const ambre = rgb(0.72, 0.45, 0.05);
  const vert = rgb(0.13, 0.55, 0.25);

  const chargerPng = async (url: string) => {
    try {
      const r = await fetch(url);
      if (!r.ok) return null;
      return await pdf.embedPng(await r.arrayBuffer());
    } catch {
      return null;
    }
  };
  const [imgWordmark, imgSceau, imgBandeau] = await Promise.all([
    chargerPng("/c21/wordmark.png"),
    chargerPng("/c21/sceau.png"),
    chargerPng("/c21/bandeau.png"),
  ]);

  let page = pdf.addPage(A4);
  const pages = [page];
  let y = 0;

  const enTete = () => {
    if (imgWordmark) page.drawImage(imgWordmark, { x: M, y: A4[1] - 44, width: 86.5, height: 10 });
    else page.drawText("CENTURY 21", { x: M, y: A4[1] - 46, size: 14, font: helvB, color: or });
    if (imgSceau) page.drawImage(imgSceau, { x: 468, y: A4[1] - 112.5, width: 84.5, height: 107.5 });
    page.drawText("Icaza Immobilier", { x: M, y: A4[1] - 60, size: 10.5, font: helv, color: or });
    page.drawText("32 avenue de la Paix — 13500 Martigues", { x: M, y: A4[1] - 73, size: 8.5, font: helv, color: noir });
    y = A4[1] - 130;
  };
  const nouvellePage = () => {
    page = pdf.addPage(A4);
    pages.push(page);
    enTete();
  };
  const ligne = (texte: string, opts: { font?: typeof helv; size?: number; couleur?: ReturnType<typeof rgb>; indent?: number; gap?: number } = {}) => {
    if (y < 100) nouvellePage();
    page.drawText(texte, { x: M + (opts.indent ?? 0), y, size: opts.size ?? 10.5, font: opts.font ?? helv, color: opts.couleur ?? noir });
    y -= (opts.size ?? 10.5) * 1.45 + (opts.gap ?? 0);
  };

  enTete();
  const dateStr = new Date().toLocaleDateString("fr-FR");
  ligne("Rapport de complétude des dossiers clients", { font: helvB, size: 15, gap: 4 });
  const complets = dossiers.filter((d) => piecesManquantes(d).length === 0).length;
  ligne(`Édité le ${dateStr} — ${dossiers.length} dossier${dossiers.length > 1 ? "s" : ""} : ${complets} complet${complets > 1 ? "s" : ""}, ${dossiers.length - complets} incomplet${dossiers.length - complets > 1 ? "s" : ""}.`, { size: 9.5, couleur: gris, gap: 10 });

  const tries = [...dossiers].sort((a, b) => piecesManquantes(b).length - piecesManquantes(a).length);
  for (const d of tries) {
    const manquantes = piecesManquantes(d);
    if (y < 150) nouvellePage();
    ligne(d.nom, { font: helvB, size: 11.5, gap: 1 });
    const sousTitre = [d.bien, d.negociateur].filter(Boolean).join(" · ");
    if (sousTitre) ligne(sousTitre, { size: 9, couleur: gris, gap: 1 });
    if (manquantes.length === 0) {
      ligne(`Dossier complet — ${d.pieces.length} pièce${d.pieces.length > 1 ? "s" : ""} au dossier.`, { size: 10, couleur: vert, gap: 8 });
    } else {
      ligne(`${manquantes.length} document${manquantes.length > 1 ? "s" : ""} manquant${manquantes.length > 1 ? "s" : ""} (${d.pieces.length} pièce${d.pieces.length > 1 ? "s" : ""} au dossier) :`, { size: 10, couleur: ambre, gap: 2 });
      for (const m of manquantes) {
        ligne(`—  ${m.categorie}${m.copro ? " (si copropriété)" : ""}`, { size: 10, indent: 14, couleur: ambre });
      }
      y -= 8;
    }
  }
  ligne("Documents obligatoires pour un dossier complet : titre de propriété, pièce d'identité,", { size: 8, couleur: gris, gap: 0 });
  ligne("mandat, diagnostics, Tracfin.", { size: 8, couleur: gris });

  if (imgBandeau) {
    for (const pg of pages) pg.drawImage(imgBandeau, { x: 14, y: 20, width: 512, height: 56 });
  }

  const octets = await pdf.save();
  const blob = new Blob([new Uint8Array(octets)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Rapport documents manquants - ${dateStr.replace(/\//g, "-")}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

async function fichierEnB64(f: File): Promise<string> {
  const buf = new Uint8Array(await f.arrayBuffer());
  let bin = "";
  for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(bin);
}

// ---------------------------------------------------------------------------
// Sélecteur de pièces : réutilisé par le bilan de commercialisation pour
// importer les comptes rendus de visite depuis un dossier client.
// ---------------------------------------------------------------------------
export function SelecteurPiecesClient({
  categorieParDefaut,
  precocher,
  onAjouter,
  onFermer,
}: {
  categorieParDefaut: string;
  /** Règle de pré-cochage des pièces (défaut : catégorie === categorieParDefaut) */
  precocher?: (p: PieceClient) => boolean;
  onAjouter: (pieces: { nom: string; taille: number; data: string }[]) => void;
  onFermer: () => void;
}) {
  const [dossiers, setDossiers] = useState<ClientDossier[] | null>(null);
  const [q, setQ] = useState("");
  const [dossier, setDossier] = useState<ClientDossier | null>(null);
  const [coches, setCoches] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    listClients().then(setDossiers).catch(() => setDossiers([]));
  }, []);

  const ouvrir = (d: ClientDossier) => {
    setDossier(d);
    const regle = precocher ?? ((p: PieceClient) => p.categorie === categorieParDefaut);
    setCoches(new Set(d.pieces.filter(regle).map((p) => p.fileId)));
  };

  const importer = async () => {
    if (!dossier || coches.size === 0) return;
    setBusy(true);
    setErreur(null);
    try {
      const pieces: { nom: string; taille: number; data: string }[] = [];
      for (const p of dossier.pieces.filter((x) => coches.has(x.fileId))) {
        pieces.push({ nom: p.nom, taille: p.taille, data: await getClientFileB64(dossier.id, p.fileId) });
      }
      onAjouter(pieces);
      onFermer();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Import impossible");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-copper/50 bg-white p-4 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-bold text-navy">
          📁 {dossier ? `Pièces de « ${dossier.nom} »` : "Choisissez le dossier client"}
        </h4>
        <button type="button" onClick={onFermer} className="text-slate-400 hover:text-red-600">✕</button>
      </div>

      {!dossier ? (
        <>
          <input className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔎 Rechercher un client, un bien…" />
          <div className="mt-2 max-h-56 space-y-1 overflow-y-auto">
            {dossiers === null ? (
              <p className="p-2 text-xs text-slate-400">Chargement…</p>
            ) : filtrer(dossiers, q).length === 0 ? (
              <p className="p-2 text-xs text-slate-400">Aucun dossier client — créez-le dans l&apos;univers « Dossiers clients ».</p>
            ) : (
              filtrer(dossiers, q).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => ouvrir(d)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left text-sm transition hover:border-copper hover:bg-copper-soft/30"
                >
                  <span className="font-semibold text-navy">{d.nom}</span>
                  <span className="text-xs text-slate-500">{d.pieces.length} pièce{d.pieces.length > 1 ? "s" : ""}</span>
                </button>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          <div className="max-h-56 space-y-1 overflow-y-auto">
            {dossier.pieces.length === 0 && <p className="p-2 text-xs text-slate-400">Ce dossier ne contient aucune pièce.</p>}
            {dossier.pieces.map((p) => (
              <label key={p.fileId} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={coches.has(p.fileId)}
                  onChange={(e) => {
                    const n = new Set(coches);
                    if (e.target.checked) n.add(p.fileId);
                    else n.delete(p.fileId);
                    setCoches(n);
                  }}
                />
                <span className="flex-1 truncate">{p.nom}</span>
                <Badge categorie={p.categorie} />
              </label>
            ))}
          </div>
          {erreur && <p className="mt-2 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">{erreur}</p>}
          <div className="mt-3 flex items-center justify-between">
            <button type="button" onClick={() => setDossier(null)} className="text-xs font-semibold text-slate-500 hover:text-copper">← Autre dossier</button>
            <button
              type="button"
              onClick={() => void importer()}
              disabled={busy || coches.size === 0}
              className="rounded-lg bg-copper px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {busy ? "Import…" : `Ajouter ${coches.size} pièce${coches.size > 1 ? "s" : ""}`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// L'univers « Dossiers clients »
// ---------------------------------------------------------------------------
export default function ClientsPage({ onRetour }: { onRetour: () => void }) {
  const [dossiers, setDossiers] = useState<ClientDossier[] | null>(null);
  const [q, setQ] = useState("");
  const [ouvert, setOuvert] = useState<ClientDossier | null>(null);
  const [creation, setCreation] = useState(false);
  const [nom, setNom] = useState("");
  const [bien, setBien] = useState("");
  const [nego, setNego] = useState("");
  const [categorie, setCategorie] = useState<string>(CATEGORIES_PIECES[0]);
  const [busy, setBusy] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [rapportOuvert, setRapportOuvert] = useState(false);

  const recharger = () => listClients().then(setDossiers).catch(() => setDossiers([]));
  useEffect(() => {
    void recharger();
  }, []);

  const resultats = useMemo(() => filtrer(dossiers ?? [], q), [dossiers, q]);

  const creer = async () => {
    if (!nom.trim()) return setErreur("Le nom du client est requis.");
    setBusy(true);
    setErreur(null);
    const d = await createClient({ nom, bien, negociateur: nego });
    setBusy(false);
    if (!d) return setErreur("Création impossible — réessayez.");
    setCreation(false);
    setNom(""); setBien(""); setNego("");
    setOuvert(d);
    void recharger();
  };

  const televerser = async (files: FileList | null) => {
    if (!files || !ouvert) return;
    setBusy(true);
    setErreur(null);
    try {
      let dossier: ClientDossier | null = ouvert;
      for (const f of Array.from(files)) {
        if (!f.name.toLowerCase().endsWith(".pdf")) continue;
        if (f.size > 4_000_000) throw new Error(`« ${f.name} » dépasse 4 Mo — compressez-le avant l'envoi.`);
        dossier = await addClientFile(ouvert.id, { nom: f.name, categorie, data: await fichierEnB64(f) });
      }
      if (dossier) setOuvert(dossier);
      void recharger();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Téléversement impossible");
    } finally {
      setBusy(false);
    }
  };

  const supprimerPiece = async (p: PieceClient) => {
    if (!ouvert) return;
    if (!confirm(`Supprimer « ${p.nom} » du dossier ?`)) return;
    const d = await deleteClientFile(ouvert.id, p.fileId);
    if (d) setOuvert(d);
    void recharger();
  };

  const supprimerDossier = async () => {
    if (!ouvert) return;
    if (!confirm(`Supprimer le dossier « ${ouvert.nom} » et TOUTES ses pièces ? Cette action est définitive.`)) return;
    await deleteClient(ouvert.id);
    setOuvert(null);
    void recharger();
  };

  // ---------- Vue dossier ouvert ----------
  if (ouvert) {
    return (
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-navy">📁 {ouvert.nom}</h2>
            <p className="text-sm text-slate-500">
              {[ouvert.bien, ouvert.negociateur && `Négociateur : ${ouvert.negociateur}`, `créé le ${dateFr(ouvert.createdAt)}`]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setOuvert(null)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
              ← Tous les dossiers
            </button>
            <button onClick={() => void supprimerDossier()} className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50">
              Supprimer le dossier
            </button>
          </div>
        </div>

        {(() => {
          const manquantes = piecesManquantes(ouvert);
          return (
            <div className={`mb-4 rounded-2xl border p-4 ${manquantes.length === 0 ? "border-green-200 bg-green-50/60" : "border-amber-200 bg-amber-50/60"}`}>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-sm font-bold text-navy">
                  {manquantes.length === 0
                    ? "✅ Dossier complet — toutes les pièces attendues sont présentes"
                    : `⚠️ Dossier incomplet — ${manquantes.length} pièce${manquantes.length > 1 ? "s" : ""} attendue${manquantes.length > 1 ? "s" : ""} manquante${manquantes.length > 1 ? "s" : ""}`}
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PIECES_ATTENDUES.map((a) => {
                  const ok = !manquantes.some((m) => m.categorie === a.categorie);
                  return (
                    <span
                      key={a.categorie}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${ok ? "bg-green-100 text-green-700" : "bg-white text-amber-700 ring-1 ring-amber-300"}`}
                    >
                      {ok ? "✓" : "✗"} {a.categorie}
                      {a.copro ? " (copro)" : ""}
                    </span>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Documents obligatoires : titre de propriété, pièce d&apos;identité, mandat, diagnostics, Tracfin.
              </p>
            </div>
          );
        })()}

        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-end gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Catégorie des pièces ajoutées</span>
              <select className={inputCls} value={categorie} onChange={(e) => setCategorie(e.target.value)}>
                {CATEGORIES_PIECES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className={`cursor-pointer rounded-xl border-2 border-dashed border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-500 transition hover:border-copper hover:text-copper ${busy ? "pointer-events-none opacity-50" : ""}`}>
              {busy ? "Envoi en cours…" : "+ Ajouter des PDF au dossier"}
              <input type="file" accept="application/pdf" multiple className="hidden" onChange={(e) => { void televerser(e.target.files); e.target.value = ""; }} />
            </label>
            <p className="text-xs text-slate-400">PDF uniquement · 4 Mo max par pièce · stockage partagé de l&apos;équipe, accès protégé par le mot de passe.</p>
          </div>
          {erreur && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">{erreur}</p>}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {ouvert.pieces.length === 0 ? (
            <p className="p-6 text-sm text-slate-400">Aucune pièce pour l&apos;instant — ajoutez les PDF du client ci-dessus.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {[...ouvert.pieces].sort((a, b) => b.createdAt - a.createdAt).map((p) => (
                <li key={p.fileId} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <span className="text-lg">📄</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-slate-800">{p.nom}</div>
                    <div className="text-xs text-slate-400">{Math.round(p.taille / 1024)} Ko · ajouté le {dateFr(p.createdAt)}</div>
                  </div>
                  <Badge categorie={p.categorie} />
                  <button
                    onClick={() => void telechargerClientFile(ouvert.id, p.fileId, p.nom).catch(() => setErreur("Téléchargement impossible"))}
                    className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                  >
                    ⬇ Télécharger
                  </button>
                  <button onClick={() => void supprimerPiece(p)} className="rounded-lg border border-red-200 px-2.5 py-1 text-xs text-red-600 transition hover:bg-red-50">
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // ---------- Vue liste + recherche ----------
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-navy">📁 Dossiers clients</h2>
          <p className="text-sm text-slate-500">Toutes les pièces PDF de vos clients, partagées avec l&apos;équipe et réutilisables dans les documents.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
            ← Accueil
          </button>
          <button onClick={() => setRapportOuvert(!rapportOuvert)} className="rounded-lg border border-copper bg-white px-4 py-1.5 text-sm font-bold text-copper transition hover:bg-copper-soft/40">
            📋 Rapport des documents manquants
          </button>
          <button onClick={() => setCreation(!creation)} className="rounded-lg bg-copper px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110">
            + Nouveau dossier client
          </button>
        </div>
      </div>

      {rapportOuvert && dossiers !== null && (
        <div className="mb-4 rounded-2xl border border-copper/40 bg-white p-5 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wide text-navy">📋 Rapport de complétude des dossiers</h3>
            <span className="flex items-center gap-3">
              <span className="text-xs text-slate-500">
                {dossiers.filter((d) => piecesManquantes(d).length === 0).length} complet{dossiers.filter((d) => piecesManquantes(d).length === 0).length > 1 ? "s" : ""} ·{" "}
                {dossiers.filter((d) => piecesManquantes(d).length > 0).length} incomplet{dossiers.filter((d) => piecesManquantes(d).length > 0).length > 1 ? "s" : ""}
              </span>
              <button
                type="button"
                onClick={() => { setBusy(true); void telechargerRapportPdf(dossiers).catch(() => setErreur("Génération du PDF impossible")).finally(() => setBusy(false)); }}
                disabled={busy || dossiers.length === 0}
                className="rounded-lg bg-copper px-3 py-1.5 text-xs font-bold text-white transition hover:brightness-110 disabled:opacity-50"
              >
                {busy ? "Génération…" : "⬇ Télécharger le rapport (PDF)"}
              </button>
            </span>
          </div>
          {dossiers.length === 0 ? (
            <p className="text-sm text-slate-400">Aucun dossier client.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {[...dossiers]
                .sort((a, b) => piecesManquantes(b).length - piecesManquantes(a).length)
                .map((d) => {
                  const manquantes = piecesManquantes(d);
                  return (
                    <li key={d.id} className="flex flex-wrap items-center gap-2 py-2.5">
                      <button onClick={() => setOuvert(d)} className="min-w-40 text-left text-sm font-semibold text-navy hover:text-copper">
                        {d.nom}
                      </button>
                      <BadgeCompletude d={d} />
                      {manquantes.length > 0 && (
                        <span className="flex flex-wrap gap-1">
                          {manquantes.map((m) => (
                            <span key={m.categorie} className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
                              ✗ {m.categorie}
                              {m.copro ? " (copro)" : ""}
                            </span>
                          ))}
                        </span>
                      )}
                    </li>
                  );
                })}
            </ul>
          )}
          <p className="mt-3 text-xs text-slate-400">
            Documents obligatoires : titre de propriété, pièce d&apos;identité, mandat, diagnostics, Tracfin.
          </p>
        </div>
      )}

      {creation && (
        <div className="mb-4 grid gap-3 rounded-2xl border border-copper/40 bg-copper-soft/30 p-4 sm:grid-cols-4">
          <input className={inputCls} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom du client * (M. et Mme Dupont)" />
          <input className={inputCls} value={bien} onChange={(e) => setBien(e.target.value)} placeholder="Bien (T3, 12 quai Brescon, Martigues)" />
          <input className={inputCls} value={nego} onChange={(e) => setNego(e.target.value)} placeholder="Négociateur" />
          <button onClick={() => void creer()} disabled={busy} className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-navy-deep disabled:opacity-50">
            {busy ? "Création…" : "Créer le dossier"}
          </button>
          {erreur && <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700 sm:col-span-4">{erreur}</p>}
        </div>
      )}

      <input className={`${inputCls} mb-4`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔎 Rechercher un dossier : nom du client, bien, négociateur, nom d'une pièce…" />

      {dossiers === null ? (
        <p className="p-4 text-sm text-slate-400">Chargement des dossiers…</p>
      ) : resultats.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-400">
          {q ? "Aucun dossier ne correspond à cette recherche." : "Aucun dossier client pour l'instant — créez le premier."}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {resultats.map((d) => (
            <button
              key={d.id}
              onClick={() => setOuvert(d)}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-copper hover:shadow-md"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-lg">📁</span>
                <span className="flex items-center gap-1.5">
                  <BadgeCompletude d={d} />
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    {d.pieces.length} pièce{d.pieces.length > 1 ? "s" : ""}
                  </span>
                </span>
              </div>
              <div className="text-sm font-bold text-navy">{d.nom}</div>
              {d.bien && <div className="mt-0.5 truncate text-xs text-slate-500">{d.bien}</div>}
              <div className="mt-1 text-xs text-slate-400">
                {[d.negociateur, `mis à jour le ${dateFr(d.updatedAt)}`].filter(Boolean).join(" · ")}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
