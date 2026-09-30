"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CATEGORIES_PIECES,
  createClient,
  deleteClient,
  deleteClientFile,
  enregistrerPiecesPreuploadees,
  fractionnerDossierPdf,
  getClientFileB64,
  listClients,
  renommerClientFile,
  telechargerClientFile,
  televerserBlobDirecte,
  updateClient,
  type ClientDossier,
  type PieceClient,
} from "@/lib/clients";
import { PIECES_ATTENDUES, estDossierVendeurComplet } from "@/lib/docTypes";
import { compresserDocument } from "@/lib/compressDoc";

// Encode un fichier en base64 (fallback quand la compression n'est pas possible).
async function fichierEnB64(f: File): Promise<string> {
  const buf = new Uint8Array(await f.arrayBuffer());
  let bin = "";
  for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(bin);
}

// Décode un base64 en Blob (pour l'upload direct navigateur → Blob).
function base64EnBlob(b64: string, type: string): Blob {
  const bin = atob(b64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return new Blob([u8], { type });
}
import AcquereurFiche from "@/components/AcquereurFiche";
import { STATUTS_RECHERCHE, STATUT_COULEURS, resumeRecherche } from "@/lib/acquereurs";
import { NEGOCIATEURS } from "@/lib/equipe";

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
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700" title="Dossier complet — compté comme mandat">✓ Mandat</span>
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
    [d.nom, d.prenom, d.bien, d.negociateur, d.tel, d.email, d.statut,
      ...(d.recherches ?? []).flatMap((r) => [...r.villes, r.secteurs]),
      ...d.pieces.map((p) => p.nom)]
      .filter(Boolean).join(" ").toLowerCase().includes(t),
  );
}
const typeDe = (d: ClientDossier) => d.typeClient ?? "vendeur";

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
export default function ClientsPage({ onRetour, onOuvrirEstimation }: { onRetour: () => void; onOuvrirEstimation?: (id: string) => void }) {
  const [dossiers, setDossiers] = useState<ClientDossier[] | null>(null);
  const [q, setQ] = useState("");
  const [ouvert, setOuvert] = useState<ClientDossier | null>(null);
  const [creation, setCreation] = useState(false);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [bien, setBien] = useState("");
  const [nego, setNego] = useState("");
  const [typeCreation, setTypeCreation] = useState<"vendeur" | "acquereur" | "investisseur">("acquereur");
  const [categorie, setCategorie] = useState<string>(CATEGORIES_PIECES[0]);
  const [filtreType, setFiltreType] = useState<"" | "vendeur" | "acquereur" | "investisseur">("");
  const [filtreStatut, setFiltreStatut] = useState("");
  const [busy, setBusy] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [etatCompression, setEtatCompression] = useState<string | null>(null);
  const [rapportOuvert, setRapportOuvert] = useState(false);
  const [dragActif, setDragActif] = useState(false);
  // File d'attente : une ligne par document, chacune avec sa propre catégorie.
  const [enAttente, setEnAttente] = useState<{ id: string; file: File; categorie: string }[]>([]);
  // Fractionnement IA d'un PDF combiné.
  const [fractionnement, setFractionnement] = useState<string | null>(null);
  const [resultatFraction, setResultatFraction] = useState<{ categorie: string; titre: string }[] | null>(null);
  const [edit, setEdit] = useState<{ nom: string; prenom: string; tel: string; email: string; bien: string; nego: string } | null>(null);
  // Pièce en cours de renommage : fileId + nouveau nom + nouvelle catégorie.
  const [pieceEdit, setPieceEdit] = useState<{ fileId: string; nom: string; categorie: string } | null>(null);

  const recharger = () => listClients().then(setDossiers).catch(() => setDossiers([]));
  useEffect(() => {
    void recharger();
  }, []);
  // Retour à la liste : on ferme le dossier et on vide la file d'attente
  // (les fichiers en attente appartiennent au dossier qu'on quitte).
  const fermerDossier = () => { setEnAttente([]); setResultatFraction(null); setFractionnement(null); setOuvert(null); };

  const resultats = useMemo(() => {
    let base = filtrer(dossiers ?? [], q);
    if (filtreType) base = base.filter((d) => typeDe(d) === filtreType);
    if (filtreStatut) base = base.filter((d) => (d.statut ?? "") === filtreStatut);
    return base;
  }, [dossiers, q, filtreType, filtreStatut]);

  const creer = async () => {
    if (!nom.trim()) return setErreur("Le nom du client est requis.");
    setBusy(true);
    setErreur(null);
    const d = await createClient({ nom, bien, negociateur: nego, typeClient: typeCreation, prenom, tel, email });
    setBusy(false);
    if (!d) return setErreur("Création impossible — réessayez.");
    setCreation(false);
    setNom(""); setPrenom(""); setTel(""); setEmail(""); setBien(""); setNego("");
    setOuvert(d);
    void recharger();
  };

  // Ajoute les fichiers choisis/déposés à la file d'attente (une ligne par
  // document). Chaque ligne prend par défaut la catégorie sélectionnée, puis
  // reste modifiable individuellement avant l'enregistrement.
  const ajouterEnAttente = (files: FileList | null) => {
    if (!files) return;
    const acceptes = Array.from(files).filter((f) => {
      const n = f.name.toLowerCase();
      return n.endsWith(".pdf") || /\.(jpe?g|png|webp|heic|heif)$/.test(n) || f.type.startsWith("image/");
    });
    if (acceptes.length === 0) {
      setErreur("Formats acceptés : PDF, JPEG, PNG, WEBP, HEIC.");
      return;
    }
    setErreur(null);
    setInfo(null);
    setEnAttente((prev) => [
      ...prev,
      ...acceptes.map((f) => ({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${f.name}`, file: f, categorie })),
    ]);
  };

  const majCategorieLigne = (id: string, cat: string) =>
    setEnAttente((prev) => prev.map((x) => (x.id === id ? { ...x, categorie: cat } : x)));
  const retirerLigne = (id: string) => setEnAttente((prev) => prev.filter((x) => x.id !== id));

  // Enregistre TOUTE la file d'attente : chaque document est compressé puis
  // téléversé direct (navigateur → Blob), avec SA catégorie ; toutes les
  // fiches sont écrites en un seul appel (aucune perte possible).
  const integrer = async () => {
    if (!ouvert || enAttente.length === 0) return;
    setBusy(true);
    setErreur(null);
    try {
      const aEnregistrer: { fileId: string; nom: string; categorie: string }[] = [];
      let gainTotal = 0;
      let i = 0;
      for (const item of enAttente) {
        i++;
        const f = item.file;
        const suffixe = enAttente.length > 1 ? ` (${i}/${enAttente.length})` : "";
        if (f.size < 100) throw new Error(`« ${f.name} » est vide (0 octet). Vérifie le fichier puis réessaie.`);
        const estPdf = f.name.toLowerCase().endsWith(".pdf") || f.type === "application/pdf";
        setEtatCompression(`Compression de « ${f.name} »…${suffixe}`);
        let c = await compresserDocument(f).catch(() => null);
        if ((!c || !c.data || c.tailleApres < 200) && estPdf) {
          const data = await fichierEnB64(f);
          c = { nom: f.name, data, tailleAvant: f.size, tailleApres: f.size };
        }
        if (!c || !c.data || c.tailleApres < 200) {
          throw new Error(`« ${f.name} » n'a pas pu être préparé (format non pris en charge). Réessaie avec un PDF, ou une photo JPEG/PNG.`);
        }
        const pdfBlob = estPdf && c.tailleApres >= f.size ? f : base64EnBlob(c.data, "application/pdf");
        setEtatCompression(`Envoi de « ${f.name} »…${suffixe}`);
        const fileId = await televerserBlobDirecte(ouvert.id, pdfBlob);
        aEnregistrer.push({ fileId, nom: c.nom, categorie: item.categorie });
        gainTotal += Math.max(0, c.tailleAvant - c.tailleApres);
      }
      setEtatCompression(`Enregistrement de ${aEnregistrer.length} document${aEnregistrer.length > 1 ? "s" : ""}…`);
      const res = await enregistrerPiecesPreuploadees(ouvert.id, aEnregistrer);
      setEtatCompression(null);
      if (res?.dossier) setOuvert(res.dossier);
      setEnAttente([]);
      const n = res?.ajoutees ?? aEnregistrer.length;
      const parts = [`${n} document${n > 1 ? "s" : ""} ajouté${n > 1 ? "s" : ""} au dossier`];
      if (gainTotal > 50_000) parts.push(`compression : ${(gainTotal / 1_048_576).toFixed(1)} Mo économisés`);
      setInfo(parts.join(" · "));
      void recharger();
    } catch (err) {
      setEtatCompression(null);
      setErreur(err instanceof Error ? err.message : "Téléversement impossible");
    } finally {
      setBusy(false);
    }
  };

  // Glisser-déposer : on réutilise exactement la même logique que le bouton
  // « Ajouter des documents » (compression + upload direct pour les gros PDF).
  const onDragOver = (e: React.DragEvent) => {
    if (busy) return;
    // Il faut appeler preventDefault sur dragover pour autoriser le drop.
    if (Array.from(e.dataTransfer.types).includes("Files")) {
      e.preventDefault();
      if (!dragActif) setDragActif(true);
    }
  };
  const onDragLeave = (e: React.DragEvent) => {
    // On ne réinitialise que si le curseur quitte réellement la zone
    // (et non un enfant), sinon l'état clignote.
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragActif(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActif(false);
    if (busy) return;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) ajouterEnAttente(files);
  };

  // Fractionnement IA : un seul PDF contenant tout le dossier → l'IA détecte
  // et sépare chaque document, chacun classé automatiquement.
  const fractionner = async (files: FileList | null) => {
    if (!ouvert || !files || files.length === 0) return;
    const f = files[0];
    if (!(f.name.toLowerCase().endsWith(".pdf") || f.type === "application/pdf")) {
      setErreur("Choisis un PDF (le dossier complet à fractionner).");
      return;
    }
    setBusy(true);
    setErreur(null);
    setInfo(null);
    setResultatFraction(null);
    try {
      setFractionnement("Envoi du PDF puis analyse page par page par l'IA (jusqu'à ~2 min pour un gros dossier)…");
      const res = await fractionnerDossierPdf(ouvert.id, f);
      setFractionnement(null);
      if (res.dossier) setOuvert(res.dossier);
      setResultatFraction(res.segments.map((s) => ({ categorie: s.categorie, titre: s.titre })));
      setInfo(`${res.ajoutees} document${res.ajoutees > 1 ? "s" : ""} détecté${res.ajoutees > 1 ? "s" : ""} et classé${res.ajoutees > 1 ? "s" : ""} automatiquement`);
      void recharger();
    } catch (err) {
      setFractionnement(null);
      setErreur(err instanceof Error ? err.message : "Fractionnement impossible");
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

  const enregistrerRenommage = async () => {
    if (!ouvert || !pieceEdit) return;
    const nom = pieceEdit.nom.trim();
    if (!nom) { setErreur("Le nom de la pièce ne peut pas être vide."); return; }
    const d = await renommerClientFile(ouvert.id, pieceEdit.fileId, nom, pieceEdit.categorie);
    if (d) { setOuvert(d); setPieceEdit(null); void recharger(); }
    else setErreur("Renommage impossible.");
  };

  const supprimerDossier = async (sansConfirmation = false) => {
    if (!ouvert) return;
    if (!sansConfirmation && !confirm(`Supprimer le dossier « ${ouvert.nom} » et TOUTES ses pièces ? Cette action est définitive.`)) return;
    await deleteClient(ouvert.id);
    setEnAttente([]);
    setOuvert(null);
    void recharger();
  };

  const enregistrerEdit = async () => {
    if (!ouvert || !edit) return;
    if (!edit.nom.trim()) return setErreur("Le nom du client est requis.");
    setBusy(true); setErreur(null);
    const maj = await updateClient(ouvert.id, {
      nom: edit.nom.trim(), prenom: edit.prenom.trim(), tel: edit.tel.trim(),
      email: edit.email.trim(), bien: edit.bien.trim(), negociateur: edit.nego.trim(),
    });
    setBusy(false);
    if (!maj) return setErreur("Enregistrement impossible.");
    setOuvert(maj); setEdit(null); void recharger();
  };

  // ---------- Fiche acquéreur / investisseur (CRM) ----------
  if (ouvert && (ouvert.typeClient === "acquereur" || ouvert.typeClient === "investisseur")) {
    return (
      <AcquereurFiche
        dossier={ouvert}
        onRetour={() => { setOuvert(null); void recharger(); }}
        onSaved={(d) => { setOuvert(d); void recharger(); }}
        onSupprime={() => void supprimerDossier(true)}
        onOuvrirEstimation={onOuvrirEstimation}
      />
    );
  }

  // ---------- Vue dossier ouvert (vendeur : pièces) ----------
  if (ouvert) {
    return (
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-navy">📁 {[ouvert.prenom, ouvert.nom].filter(Boolean).join(" ") || ouvert.nom}</h2>
            <p className="text-sm text-slate-500">
              {[ouvert.bien, ouvert.tel, ouvert.email, ouvert.negociateur && `Négociateur : ${ouvert.negociateur}`, `créé le ${dateFr(ouvert.createdAt)}`]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fermerDossier} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
              ← Tous les dossiers
            </button>
            <button onClick={() => setEdit({ nom: ouvert.nom, prenom: ouvert.prenom ?? "", tel: ouvert.tel ?? "", email: ouvert.email ?? "", bien: ouvert.bien, nego: ouvert.negociateur })} className="rounded-lg border border-copper bg-white px-3 py-1.5 text-sm font-bold text-copper transition hover:bg-copper-soft/40">
              ✏️ Modifier la fiche
            </button>
            <button onClick={() => void supprimerDossier()} className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50">
              Supprimer le dossier
            </button>
          </div>
        </div>

        {edit && (
          <div className="mb-4 rounded-2xl border border-copper/40 bg-copper-soft/30 p-4">
            <div className="mb-2 text-sm font-bold text-navy">Modifier la fiche du client</div>
            <div className="grid gap-3 sm:grid-cols-3">
              <input className={inputCls} value={edit.nom} onChange={(e) => setEdit({ ...edit, nom: e.target.value })} placeholder="Nom *" />
              <input className={inputCls} value={edit.prenom} onChange={(e) => setEdit({ ...edit, prenom: e.target.value })} placeholder="Prénom" />
              <input className={inputCls} value={edit.nego} onChange={(e) => setEdit({ ...edit, nego: e.target.value })} placeholder="Négociateur" list="negos-c1" />
              <datalist id="negos-c1">{NEGOCIATEURS.map((n) => <option key={n} value={n} />)}</datalist>
              <input className={inputCls} value={edit.tel} onChange={(e) => setEdit({ ...edit, tel: e.target.value })} placeholder="Téléphone" />
              <input className={inputCls} value={edit.email} onChange={(e) => setEdit({ ...edit, email: e.target.value })} placeholder="Email" />
              <input className={inputCls} value={edit.bien} onChange={(e) => setEdit({ ...edit, bien: e.target.value })} placeholder="Bien concerné" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button onClick={() => void enregistrerEdit()} disabled={busy} className="rounded-lg bg-copper px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{busy ? "Enregistrement…" : "Enregistrer"}</button>
              <button onClick={() => setEdit(null)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">Annuler</button>
            </div>
          </div>
        )}

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

        <div
          className={`mb-4 rounded-2xl border p-4 transition ${dragActif ? "border-2 border-dashed border-copper bg-copper-soft/40 ring-2 ring-copper/20" : "border-slate-200 bg-white"}`}
          onDragOver={onDragOver}
          onDragEnter={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className="flex flex-wrap items-end gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Catégorie par défaut</span>
              <select className={inputCls} value={categorie} onChange={(e) => setCategorie(e.target.value)}>
                {CATEGORIES_PIECES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className={`cursor-pointer rounded-xl border-2 border-dashed border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-500 transition hover:border-copper hover:text-copper ${busy ? "pointer-events-none opacity-50" : ""}`}>
              {etatCompression ?? (busy ? "Envoi en cours…" : "+ Choisir des documents (plusieurs à la fois)")}
              <input type="file" accept="application/pdf,image/*" multiple className="hidden" onChange={(e) => { ajouterEnAttente(e.target.files); e.target.value = ""; }} />
            </label>
            <p className="text-xs text-slate-400">
              {dragActif
                ? <span className="font-bold text-copper">Relâchez pour ajouter à la liste</span>
                : <>Cliquez ou <strong>glissez-déposez plusieurs fichiers d&apos;un coup</strong> — vous choisissez ensuite une catégorie par document, puis vous validez tout ensemble. PDF et photos acceptés · <strong>compression automatique puissante</strong>.</>}
            </p>
          </div>

          {/* File d'attente : une ligne par document, catégorie modifiable */}
          {enAttente.length > 0 && (
            <div className="mt-3 rounded-xl border border-copper/40 bg-copper-soft/20 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-navy">
                  {enAttente.length} document{enAttente.length > 1 ? "s" : ""} à ajouter — choisissez une catégorie par ligne
                </span>
                {!busy && (
                  <button onClick={() => setEnAttente([])} className="text-xs font-semibold text-slate-500 hover:text-red-600">Tout retirer</button>
                )}
              </div>
              <ul className="space-y-1.5">
                {enAttente.map((item) => (
                  <li key={item.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                    <span className="text-base">📄</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-slate-800">{item.file.name}</div>
                      <div className="text-xs text-slate-400">{Math.max(1, Math.round(item.file.size / 1024))} Ko</div>
                    </div>
                    <select
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/20 disabled:opacity-50"
                      value={item.categorie}
                      disabled={busy}
                      onChange={(e) => majCategorieLigne(item.id, e.target.value)}
                    >
                      {CATEGORIES_PIECES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    {!busy && (
                      <button onClick={() => retirerLigne(item.id)} className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 transition hover:bg-red-50" title="Retirer ce document">✕</button>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => void integrer()}
                  disabled={busy}
                  className="rounded-lg bg-copper px-5 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50"
                >
                  {busy ? (etatCompression ?? "Envoi en cours…") : `Ajouter ${enAttente.length} document${enAttente.length > 1 ? "s" : ""} au dossier`}
                </button>
              </div>
            </div>
          )}

          {info && <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-700">✓ {info}</p>}
          {erreur && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">{erreur}</p>}
        </div>

        {/* Fractionnement IA : un seul PDF combiné → l'IA sépare chaque document */}
        <div className="mb-4 rounded-2xl border border-violet-200 bg-violet-50/40 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-navy">🪄 Fractionner automatiquement un dossier PDF</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Un seul PDF qui contient tout le dossier de vente ? L&apos;IA lit chaque page, sépare les documents
                (mandat, diagnostics, titre de propriété…) et les classe tout seuls. <strong>Gros dossiers acceptés</strong> (fichiers lourds découpés automatiquement).
              </p>
            </div>
            <label className={`cursor-pointer whitespace-nowrap rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-110 ${busy ? "pointer-events-none opacity-50" : ""}`}>
              {fractionnement ? "Analyse en cours…" : "📄 Importer le PDF à fractionner"}
              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => { void fractionner(e.target.files); e.target.value = ""; }} />
            </label>
          </div>
          {fractionnement && (
            <p className="mt-3 flex items-center gap-2 rounded-lg border border-violet-200 bg-white p-2.5 text-sm text-violet-700">
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-violet-300 border-t-violet-600" />
              {fractionnement}
            </p>
          )}
          {resultatFraction && resultatFraction.length > 0 && (
            <div className="mt-3 rounded-lg border border-violet-200 bg-white p-3">
              <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-navy">Documents détectés et classés :</div>
              <ul className="space-y-1">
                {resultatFraction.map((s, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Badge categorie={s.categorie} />
                    <span className="truncate text-slate-600">{s.titre}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-slate-400">Vérifie les catégories ci-dessous et ajuste si besoin (télécharge puis re-catégorise en cas d&apos;erreur).</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {ouvert.pieces.length === 0 ? (
            <p className="p-6 text-sm text-slate-400">Aucune pièce pour l&apos;instant — ajoutez les PDF du client ci-dessus.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {[...ouvert.pieces].sort((a, b) => b.createdAt - a.createdAt).map((p) => (
                <li key={p.fileId} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <span className="text-lg">📄</span>
                  {pieceEdit?.fileId === p.fileId ? (
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                      <input
                        autoFocus
                        value={pieceEdit.nom}
                        onChange={(e) => setPieceEdit({ ...pieceEdit, nom: e.target.value })}
                        onKeyDown={(e) => { if (e.key === "Enter") void enregistrerRenommage(); if (e.key === "Escape") setPieceEdit(null); }}
                        className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
                        placeholder="Nom de la pièce"
                      />
                      <select
                        value={pieceEdit.categorie}
                        onChange={(e) => setPieceEdit({ ...pieceEdit, categorie: e.target.value })}
                        className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
                      >
                        {CATEGORIES_PIECES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => void enregistrerRenommage()}
                        className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700"
                      >
                        Enregistrer
                      </button>
                      <button
                        onClick={() => setPieceEdit(null)}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-slate-800">{p.nom}</div>
                        <div className="text-xs text-slate-400">{Math.round(p.taille / 1024)} Ko · ajouté le {dateFr(p.createdAt)}</div>
                      </div>
                      <Badge categorie={p.categorie} />
                      <button
                        onClick={() => setPieceEdit({ fileId: p.fileId, nom: p.nom, categorie: p.categorie })}
                        className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                      >
                        ✎ Renommer
                      </button>
                      <button
                        onClick={() => void telechargerClientFile(ouvert.id, p.fileId, p.nom).catch(() => setErreur("Téléchargement impossible"))}
                        className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                      >
                        ⬇ Télécharger
                      </button>
                      <button onClick={() => void supprimerPiece(p)} className="rounded-lg border border-red-200 px-2.5 py-1 text-xs text-red-600 transition hover:bg-red-50">
                        ✕
                      </button>
                    </>
                  )}
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
                {(() => {
                  const vend = dossiers.filter((d) => (d.typeClient ?? "vendeur") === "vendeur");
                  const mandats = vend.filter((d) => estDossierVendeurComplet(d)).length;
                  const aCompleter = vend.length - mandats;
                  return `${mandats} mandat${mandats > 1 ? "s" : ""} (dossier vendeur complet) · ${aCompleter} à compléter`;
                })()}
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
        <div className="mb-4 rounded-2xl border border-copper/40 bg-copper-soft/30 p-4">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {([["acquereur", "🔑 Acquéreur"], ["investisseur", "📈 Investisseur"], ["vendeur", "🏠 Vendeur"]] as const).map(([t, l]) => (
              <button key={t} type="button" onClick={() => setTypeCreation(t)} className={`rounded-full px-3 py-1 text-sm font-semibold transition ${typeCreation === t ? "bg-navy text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}>{l}</button>
            ))}
          </div>
          {typeCreation === "vendeur" ? (
            <div className="grid gap-3 sm:grid-cols-4">
              <input className={inputCls} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom du client * (M. et Mme Dupont)" />
              <input className={inputCls} value={bien} onChange={(e) => setBien(e.target.value)} placeholder="Bien (T3, 12 quai Brescon, Martigues)" />
              <input className={inputCls} value={nego} onChange={(e) => setNego(e.target.value)} placeholder="Négociateur" list="negos-c2" />
              <datalist id="negos-c2">{NEGOCIATEURS.map((n) => <option key={n} value={n} />)}</datalist>
              <button onClick={() => void creer()} disabled={busy} className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-navy-deep disabled:opacity-50">{busy ? "Création…" : "Créer le dossier"}</button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              <input className={inputCls} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom *" />
              <input className={inputCls} value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Prénom" />
              <input className={inputCls} value={nego} onChange={(e) => setNego(e.target.value)} placeholder="Négociateur en charge" list="negos-c3" />
              <datalist id="negos-c3">{NEGOCIATEURS.map((n) => <option key={n} value={n} />)}</datalist>
              <input className={inputCls} value={tel} onChange={(e) => setTel(e.target.value)} placeholder="Téléphone" />
              <input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              <button onClick={() => void creer()} disabled={busy} className="rounded-lg bg-copper px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{busy ? "Création…" : "Créer et remplir la fiche"}</button>
              <p className="text-xs text-slate-500 sm:col-span-3">Vous renseignerez ensuite le projet de recherche, le financement et les documents — le rapprochement avec les biens se fait automatiquement.</p>
            </div>
          )}
          {erreur && <p className="mt-2 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">{erreur}</p>}
        </div>
      )}

      <input className={`${inputCls} mb-2`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔎 Rechercher : nom, prénom, ville recherchée, négociateur, pièce…" />
      <div className="mb-4 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-400">Type :</span>
        {([["", "Tous"], ["acquereur", "🔑 Acquéreurs"], ["investisseur", "📈 Investisseurs"], ["vendeur", "🏠 Vendeurs"]] as const).map(([t, l]) => (
          <button key={t} type="button" onClick={() => setFiltreType(t)} className={`rounded-full px-2.5 py-1 font-semibold ${filtreType === t ? "bg-copper text-white" : "border border-slate-200 bg-white text-slate-600"}`}>{l}</button>
        ))}
        <select className="ml-2 rounded-lg border border-slate-200 bg-white px-2 py-1" value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}>
          <option value="">Tous statuts</option>
          {STATUTS_RECHERCHE.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {dossiers === null ? (
        <p className="p-4 text-sm text-slate-400">Chargement des dossiers…</p>
      ) : resultats.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-400">
          {q ? "Aucun dossier ne correspond à cette recherche." : "Aucun dossier client pour l'instant — créez le premier."}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {resultats.map((d) => {
            const t = typeDe(d);
            const acq = t === "acquereur" || t === "investisseur";
            return (
              <button
                key={d.id}
                onClick={() => setOuvert(d)}
                className={`rounded-2xl border border-l-4 border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-copper hover:shadow-md ${t === "investisseur" ? "border-l-violet-400" : t === "acquereur" ? "border-l-blue-400" : "border-l-amber-400"}`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${t === "investisseur" ? "bg-violet-100 text-violet-700" : t === "acquereur" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                    {t === "investisseur" ? "📈 Investisseur" : t === "acquereur" ? "🔑 Acquéreur" : "🏠 Vendeur"}
                  </span>
                  {acq ? (
                    d.statut && <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUT_COULEURS[d.statut] ?? "bg-slate-100 text-slate-600"}`}>{d.statut}</span>
                  ) : (
                    <BadgeCompletude d={d} />
                  )}
                </div>
                <div className="text-sm font-bold text-navy">{[d.prenom, d.nom].filter(Boolean).join(" ") || d.nom}</div>
                <div className="mt-0.5 truncate text-xs text-slate-500">{acq ? resumeRecherche(d) : d.bien}</div>
                <div className="mt-1 text-xs text-slate-400">
                  {[d.negociateur, acq ? `${d.pieces.length} doc.` : `${d.pieces.length} pièce${d.pieces.length > 1 ? "s" : ""}`, `maj ${dateFr(d.updatedAt)}`].filter(Boolean).join(" · ")}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
