"use client";

import { useState } from "react";
import { SelecteurPiecesClient } from "@/components/ClientsPage";
import { EnTete, PiedC21 } from "@/components/PreEtatDate";
import type { DocumentInput } from "@/lib/docTypes";
import { getHistoryKey } from "@/lib/history";

// Demande de compromis de vente au notaire — assistant en deux temps :
// 1) SAISIE : champs classiques (bien, vendeurs, acquéreur, notaires,
//    conditions) + pièces PDF ; l'IA peut LIRE les pièces et pré-remplir
//    les champs automatiquement.
// 2) APERÇU : lettre sur papier à en-tête C21 + fusion lettre + pièces
//    vendeur + pièces acquéreur en UN SEUL PDF (pdf-lib, 100 % local).

interface Piece {
  nom: string;
  taille: number;
  data: ArrayBuffer;
}

const OR = { r: 0.706, g: 0.592, b: 0.357 };

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/20";

function Champ({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function SousTitre({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 mt-5 text-sm font-bold uppercase tracking-wide text-navy first:mt-0">{children}</h3>;
}

function lignes(v?: string): string[] {
  return (v ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
}

const int = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

/** Assemble les champs structurés en textes de la lettre (les anciens
 *  champs texte restent des replis pour les dossiers de l'historique). */
function assembler(d: DocumentInput): DocumentInput {
  // Lots : principal + annexes (cave, garage…) — chaque lot est une partie
  // privative avec sa quote-part des parties communes
  const lots = (d.cLots ?? []).filter((l) => l.numero.trim());
  const lignesLots = lots.length
    ? lots.map((l, i) =>
        i === 0
          ? [`Lot n°${l.numero.trim()}${l.nature ? ` – ${l.nature}` : ""} :`, d.cBienDescription ?? ""].filter(Boolean).join("\n")
          : `Lot n°${l.numero.trim()}${l.nature ? ` – ${l.nature}` : ""}`,
      )
    : [d.cLot ? `Lot n°${d.cLot} :` : "", d.cBienDescription ?? ""].filter(Boolean);
  const bien = [
    d.compromisObjetBien ? `Un ensemble immobilier situé ${d.compromisObjetBien}.` : "",
    ...lignesLots,
    d.cTantiemes ? `Et les ${d.cTantiemes}.` : "",
  ].filter(Boolean).join("\n");

  const vM = d.cVendeurM?.trim();
  const vMme = d.cVendeurMme?.trim();
  const nomsVendeurs = vM && vMme
    ? `Monsieur ${vM}${d.cVendeurMProfession ? `, ${d.cVendeurMProfession}` : ""},\net Madame ${vMme}${d.cVendeurMmeProfession ? `, ${d.cVendeurMmeProfession}` : ""},`
    : vM
      ? `Monsieur ${vM}${d.cVendeurMProfession ? `, ${d.cVendeurMProfession}` : ""},`
      : vMme
        ? `Madame ${vMme}${d.cVendeurMmeProfession ? `, ${d.cVendeurMmeProfession}` : ""},`
        : [d.cVendeurNoms ?? "", d.cVendeurProfessions ?? ""].filter(Boolean).join("\n");
  const naissV = [
    vM && d.cVendeurMNaissance ? `Monsieur, ${d.cVendeurMNaissance}` : "",
    vMme && d.cVendeurMmeNaissance ? `Madame, ${d.cVendeurMmeNaissance}` : "",
  ].filter(Boolean).join(" — ") || d.cVendeurNaissances || "";
  const vendeurs = [
    nomsVendeurs,
    d.cVendeurAdresse ? `demeurant ${vM && vMme ? "ensemble " : ""}${d.cVendeurAdresse}.` : "",
    naissV ? `Nés respectivement : ${naissV}` : "",
    d.cVendeurTel ? `Contact : ${d.cVendeurTel}` : "",
    d.cVendeurEmail ? `Email : ${d.cVendeurEmail}` : "",
  ].filter(Boolean).join("\n");

  const aM = d.cAcqM?.trim();
  const aMme = d.cAcqMme?.trim();
  const blocsAcq: string[] = [];
  if (aM) {
    blocsAcq.push([`Monsieur ${aM},`, d.cAcqMNaissance ? `${d.cAcqMNaissance},` : "", d.cAcqMProfession ? `${d.cAcqMProfession},` : ""].filter(Boolean).join("\n"));
  }
  if (aMme) {
    blocsAcq.push([`${aM ? "et " : ""}Madame ${aMme},`, d.cAcqMmeNaissance ? `${d.cAcqMmeNaissance},` : "", d.cAcqMmeProfession ? `${d.cAcqMmeProfession},` : ""].filter(Boolean).join("\n"));
  }
  const acquereur = [
    blocsAcq.length
      ? blocsAcq.join("\n")
      : [d.cAcqNom ?? "", d.cAcqNaissance ? `${d.cAcqNaissance},` : "", d.cAcqProfession ? `${d.cAcqProfession},` : ""].filter(Boolean).join("\n"),
    d.cAcqAdresse ? `demeurant ${aM && aMme ? "ensemble " : ""}${d.cAcqAdresse}.` : "",
    d.cAcqTel ? `Contact : ${d.cAcqTel}` : "",
    d.cAcqEmail ? `Email : ${d.cAcqEmail}` : "",
  ].filter(Boolean).join("\n");
  const notV = [d.cNotVNom, d.cNotVEtude, d.cNotVAdresse, [d.cNotVTel, d.cNotVEmail].filter(Boolean).join(" · ")]
    .map((x) => (x ?? "").trim()).filter(Boolean).join("\n");
  const notA = [d.cNotANom, d.cNotAEtude, d.cNotAAdresse, [d.cNotATel, d.cNotAEmail].filter(Boolean).join(" · ")]
    .map((x) => (x ?? "").trim()).filter(Boolean).join("\n");
  const conditions = [
    d.cPrixVente ? `Prix de vente : ${int.format(d.cPrixVente)} € frais d'agence inclus` : "",
    d.cHonoraires ? `Honoraires d'agence : ${int.format(d.cHonoraires)} € TTC` : "",
    d.cPaiement ?? "",
    d.cCondSuspensive ?? "",
  ].filter(Boolean).join("\n");
  return {
    ...d,
    compromisBien: bien || d.compromisBien,
    compromisVendeurs: vendeurs || d.compromisVendeurs,
    compromisAcquereur: acquereur || d.compromisAcquereur,
    compromisNotaireVendeur: notV || d.compromisNotaireVendeur,
    compromisNotaireAcquereur: notA || d.compromisNotaireAcquereur,
    compromisConditions: conditions || d.compromisConditions,
  };
}

function bufToB64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

function b64ToBuf(b64: string): ArrayBuffer {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

// Pièces pré-cochées lors de l'import depuis un dossier client
const PRECOCHE_VENDEUR = new Set([
  "Titre de propriété", "Mandat", "Pièce d'identité", "Diagnostics",
  "Taxe foncière", "PV d'AG", "Appel de fonds", "Tracfin",
]);
const PRECOCHE_ACQUEREUR = new Set(["Pièce d'identité", "Offre d'achat"]);

function ZonePieces({
  titre,
  pieces,
  setter,
  ajouter,
  onImporter,
}: {
  titre: string;
  pieces: Piece[];
  setter: React.Dispatch<React.SetStateAction<Piece[]>>;
  ajouter: (files: FileList | null, setter: React.Dispatch<React.SetStateAction<Piece[]>>) => Promise<void>;
  onImporter?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-bold text-navy">{titre}</h4>
        <span className="text-xs text-slate-400">{pieces.length} PDF</span>
      </div>
      <div className={onImporter ? "grid gap-2 sm:grid-cols-2" : ""}>
        <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-3 text-center text-xs font-semibold text-slate-500 transition hover:border-copper hover:text-copper">
          + Ajouter des PDF
          <input type="file" accept="application/pdf" multiple className="hidden" onChange={(e) => { void ajouter(e.target.files, setter); e.target.value = ""; }} />
        </label>
        {onImporter && (
          <button
            type="button"
            onClick={onImporter}
            className="rounded-xl border-2 border-dashed border-copper/60 p-3 text-center text-xs font-semibold text-copper transition hover:border-copper hover:bg-copper-soft/30"
          >
            📁 Importer du dossier client
          </button>
        )}
      </div>
      {pieces.length > 0 && (
        <ul className="mt-2 space-y-1">
          {pieces.map((p, i) => (
            <li key={i} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-700">
              <span className="truncate">📄 {p.nom} <span className="text-slate-400">({Math.round(p.taille / 1024)} Ko)</span></span>
              <button type="button" onClick={() => setter((prev) => prev.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-600">✕</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CompromisPage({
  input,
  onReset,
  onSauvegarder,
}: {
  input: DocumentInput;
  onReset: () => void;
  onSauvegarder?: (d: DocumentInput) => void;
}) {
  const dejaRempli = Boolean(
    input.compromisVendeurs?.trim() || input.cVendeurNoms?.trim() || input.cVendeurM?.trim() || input.cVendeurMme?.trim(),
  );
  const [donnees, setDonnees] = useState<DocumentInput>(input);
  const [mode, setMode] = useState<"saisie" | "apercu">(dejaRempli ? "apercu" : "saisie");
  const [piecesVendeur, setPiecesVendeur] = useState<Piece[]>([]);
  const [piecesAcquereur, setPiecesAcquereur] = useState<Piece[]>([]);
  // Import de pièces depuis un dossier client : cible en cours (ou null)
  const [importPour, setImportPour] = useState<"vendeur" | "acquereur" | null>(null);
  const [fusionEnCours, setFusionEnCours] = useState(false);
  const [fusionErreur, setFusionErreur] = useState<string | null>(null);
  const [iaEnCours, setIaEnCours] = useState(false);
  const [iaMessage, setIaMessage] = useState<string | null>(null);
  const [saisieErreur, setSaisieErreur] = useState<string | null>(null);
  const dateStr = new Date().toLocaleDateString("fr-FR");
  const d = mode === "apercu" ? assembler(donnees) : donnees;
  const objet = `Demande de date pour signature du compromis de vente – ${d.compromisObjetBien || "—"}`;

  const set = <K extends keyof DocumentInput>(key: K, value: DocumentInput[K]) =>
    setDonnees((prev) => ({ ...prev, [key]: value }));
  const num = (v: string) => (v === "" ? null : +v);

  const ajouterPieces = async (files: FileList | null, setter: React.Dispatch<React.SetStateAction<Piece[]>>) => {
    if (!files) return;
    for (const f of Array.from(files)) {
      if (!f.name.toLowerCase().endsWith(".pdf")) continue;
      const data = await f.arrayBuffer();
      setter((prev) => [...prev, { nom: f.name, taille: f.size, data }]);
    }
  };

  // Panneau d'import depuis un dossier client (vendeur ou acquéreur)
  const panneauImport = importPour && (
    <div className="sm:col-span-2">
      <SelecteurPiecesClient
        categorieParDefaut={importPour === "vendeur" ? "Titre de propriété" : "Pièce d'identité"}
        precocher={(p) => (importPour === "vendeur" ? PRECOCHE_VENDEUR : PRECOCHE_ACQUEREUR).has(p.categorie)}
        onAjouter={(pieces) => {
          const setter = importPour === "vendeur" ? setPiecesVendeur : setPiecesAcquereur;
          setter((prev) => [...prev, ...pieces.map((p) => ({ nom: p.nom, taille: p.taille, data: b64ToBuf(p.data) }))]);
        }}
        onFermer={() => setImportPour(null)}
      />
    </div>
  );

  // ---- Pré-remplissage des champs par l'IA à partir des pièces PDF ----
  const preRemplir = async () => {
    const toutes = [...piecesVendeur, ...piecesAcquereur];
    if (toutes.length === 0) {
      setIaMessage("Ajoutez d'abord les pièces PDF (vendeur et/ou acquéreur) ci-dessus.");
      return;
    }
    setIaEnCours(true);
    setIaMessage(null);
    try {
      // Limite d'envoi serveur (~4,5 Mo) : les pièces les plus légères d'abord
      const triees = [...toutes].sort((a, b) => a.taille - b.taille);
      let total = 0;
      const retenues: Piece[] = [];
      for (const p of triees) {
        if (total + p.taille > 3_800_000) continue;
        total += p.taille;
        retenues.push(p);
      }
      if (retenues.length === 0) throw new Error("Pièces trop lourdes pour la lecture IA (limite ~4 Mo)");
      const res = await fetch("/api/compromis-extract", {
        method: "POST",
        headers: { "content-type": "application/json", "x-history-key": getHistoryKey() },
        body: JSON.stringify({ fichiers: retenues.map((p) => ({ nom: p.nom, data: bufToB64(p.data) })) }),
      });
      const body = (await res.json()) as {
        champs?: Record<string, string | number>;
        lots?: { numero: string; nature: string }[];
        error?: string;
      };
      if (!res.ok || !body.champs) throw new Error(body.error ?? "Lecture impossible");
      const champs = body.champs;
      const lotsIA = (body.lots ?? []).filter((l) => l.numero?.trim());
      let remplis = 0;
      setDonnees((prev) => {
        const n = { ...prev } as Record<string, unknown>;
        for (const [k, v] of Object.entries(champs)) {
          const actuel = n[k];
          const vide = actuel === null || actuel === undefined || String(actuel).trim() === "" || actuel === 0;
          if (vide) {
            n[k] = v;
            remplis += 1;
          }
        }
        // Lots détectés par l'IA : repris seulement si rien n'a été saisi
        const lotsSaisis = (prev.cLots ?? []).filter((l) => l.numero.trim());
        if (lotsIA.length > 0 && lotsSaisis.length === 0 && !prev.cLot?.trim()) {
          n.cLots = lotsIA;
          n.cLot = lotsIA[0]?.numero ?? "";
          remplis += 1;
        }
        return n as unknown as DocumentInput;
      });
      const ignorees = toutes.length - retenues.length;
      setIaMessage(
        `✓ ${remplis} champ${remplis > 1 ? "s" : ""} pré-rempli${remplis > 1 ? "s" : ""} à partir de ${retenues.length} pièce${retenues.length > 1 ? "s" : ""}${ignorees > 0 ? ` (${ignorees} pièce(s) trop lourde(s) non lue(s))` : ""} — vérifiez et corrigez avant de générer.`,
      );
    } catch (err) {
      setIaMessage(err instanceof Error ? err.message : "Lecture des pièces impossible");
    } finally {
      setIaEnCours(false);
    }
  };

  const genererLettre = () => {
    if (!donnees.compromisObjetBien?.trim()) return setSaisieErreur("Renseignez le bien (objet du courrier).");
    if (!donnees.cVendeurM?.trim() && !donnees.cVendeurMme?.trim() && !donnees.cVendeurNoms?.trim() && !donnees.compromisVendeurs?.trim())
      return setSaisieErreur("Renseignez le(s) vendeur(s) — Monsieur et/ou Madame.");
    if (!donnees.cAcqM?.trim() && !donnees.cAcqMme?.trim() && !donnees.cAcqNom?.trim() && !donnees.compromisAcquereur?.trim())
      return setSaisieErreur("Renseignez l'acquéreur — Monsieur et/ou Madame.");
    setSaisieErreur(null);
    const assemblees = assembler(donnees);
    setDonnees(assemblees);
    setMode("apercu");
    onSauvegarder?.(assemblees);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---- Construction du PDF fusionné (lettre + pièces) ----
  const telechargerDossier = async () => {
    setFusionEnCours(true);
    setFusionErreur(null);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const pdf = await PDFDocument.create();
      const helv = await pdf.embedFont(StandardFonts.Helvetica);
      const helvB = await pdf.embedFont(StandardFonts.HelveticaBold);
      const times = await pdf.embedFont(StandardFonts.TimesRoman);
      const timesB = await pdf.embedFont(StandardFonts.TimesRomanBold);
      const A4: [number, number] = [595.28, 841.89];
      const M = 57;
      const LARG = A4[0] - 2 * M;
      const or = rgb(OR.r, OR.g, OR.b);
      const noir = rgb(0, 0, 0);
      const gris = rgb(0.45, 0.45, 0.45);

      // Visuels officiels du papier à en-tête (mêmes fichiers que l'aperçu) —
      // en cas d'échec de chargement, repli sur l'en-tête texte
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
      let y = 0;
      const pagesLettre = [page];

      const enTetePdf = () => {
        // Positions du modèle : wordmark 86×10 pt, sceau 84×107 pt angle haut droit
        if (imgWordmark) {
          page.drawImage(imgWordmark, { x: M, y: A4[1] - 44, width: 86.5, height: 10 });
        } else {
          page.drawText("CENTURY 21", { x: M, y: A4[1] - 46, size: 14, font: helvB, color: or });
        }
        if (imgSceau) {
          page.drawImage(imgSceau, { x: 468, y: A4[1] - 112.5, width: 84.5, height: 107.5 });
        }
        let yy = A4[1] - 60;
        page.drawText("Icaza Immobilier", { x: M, y: yy, size: 10.5, font: helv, color: or });
        yy -= 13;
        page.drawText("32 avenue de la Paix", { x: M, y: yy, size: 8.5, font: helv, color: noir });
        yy -= 11;
        page.drawText("13500 Martigues", { x: M, y: yy, size: 8.5, font: helv, color: noir });
        y = yy - 26;
      };

      const nouvellePage = () => {
        page = pdf.addPage(A4);
        pagesLettre.push(page);
        enTetePdf();
      };

      const wrap = (texte: string, font: typeof times, size: number, larg: number): string[] => {
        const mots = texte.split(/\s+/).filter(Boolean);
        const out: string[] = [];
        let cur = "";
        for (const mot of mots) {
          const test = cur ? `${cur} ${mot}` : mot;
          if (font.widthOfTextAtSize(test, size) > larg && cur) {
            out.push(cur);
            cur = mot;
          } else {
            cur = test;
          }
        }
        if (cur) out.push(cur);
        return out.length ? out : [""];
      };

      const para = (texte: string, opts: { font?: typeof times; size?: number; gap?: number; indent?: number; couleur?: ReturnType<typeof rgb> } = {}) => {
        const font = opts.font ?? times;
        const size = opts.size ?? 11;
        const indent = opts.indent ?? 0;
        for (const brut of texte.split("\n")) {
          for (const l of wrap(brut, font, size, LARG - indent)) {
            if (y < 96) nouvellePage();
            page.drawText(l, { x: M + indent, y, size, font, color: opts.couleur ?? noir });
            y -= size * 1.42;
          }
        }
        y -= opts.gap ?? 8;
      };

      const titreSection = (t: string) => {
        y -= 4;
        if (y < 122) nouvellePage();
        para(t, { font: timesB, size: 11.5, gap: 2 });
      };

      // ----- La lettre -----
      enTetePdf();
      const dateTxt = `Martigues, le ${dateStr}`;
      page.drawText(dateTxt, { x: A4[0] - M - times.widthOfTextAtSize(dateTxt, 11), y, size: 11, font: times, color: noir });
      y -= 34;
      para(`Objet : ${objet}`, { font: timesB, size: 11.5, gap: 12 });
      para("Maître,", { gap: 8 });
      para(
        `Je me permets de revenir vers vous afin de convenir d’une date pour la signature du compromis de vente relatif au bien situé ${d.compromisObjetBien || "—"}, dont les éléments sont détaillés ci-dessous.`,
        { gap: 10 },
      );
      titreSection("Identification du bien vendu");
      para(d.compromisBien || "—", { gap: 10 });
      titreSection("Vendeurs");
      para(d.compromisVendeurs || "—", { gap: 10 });
      titreSection("Acquéreur");
      para(d.compromisAcquereur || "—", { gap: 10 });
      titreSection("Représentation notariale");
      para("Notaire vendeur :", { font: timesB, size: 11, gap: 2 });
      para(d.compromisNotaireVendeur || "—", { gap: 8 });
      para("Notaire acquéreur :", { font: timesB, size: 11, gap: 2 });
      para(d.compromisNotaireAcquereur || "—", { gap: 10 });
      titreSection("Conditions de la vente");
      for (const c of lignes(d.compromisConditions)) para(`•  ${c}`, { gap: 0, indent: 6 });
      y -= 10;
      titreSection("Pièces transmises");
      para("Dossier vendeur :", { font: timesB, size: 11, gap: 2 });
      for (const p of lignes(d.compromisPiecesVendeur)) para(`•  ${p}`, { gap: 0, indent: 6 });
      y -= 6;
      para("Dossier acquéreur :", { font: timesB, size: 11, gap: 2 });
      for (const p of lignes(d.compromisPiecesAcquereur)) para(`•  ${p}`, { gap: 0, indent: 6 });
      y -= 10;
      titreSection("Demande de rendez-vous");
      para(
        "Afin de faire avancer la transaction, je vous remercie de bien vouloir nous proposer plusieurs créneaux de rendez-vous dans les meilleurs délais pour la signature du compromis de vente.",
        { gap: 4 },
      );
      para(
        "Je reste naturellement à votre disposition pour toute information complémentaire ou transmission de pièces nécessaires à la constitution du dossier.",
        { gap: 4 },
      );
      para("Je vous remercie par avance pour votre retour.", { gap: 12 });
      para("Cordialement,", { gap: 4 });
      para(`${d.negociateur || "L'équipe transaction"}`, { font: timesB, size: 11, gap: 0 });
      para(
        `CENTURY 21 Icaza Immobilier${d.negociateurTel ? ` · ${d.negociateurTel}` : ""}${d.negociateurEmail ? ` · ${d.negociateurEmail}` : ""}`,
        { size: 10, couleur: gris, gap: 0 },
      );

      // Bandeau officiel « PARLONS DE VOUS, PARLONS BIENS » au bas de chaque
      // page de la lettre — position du modèle : 512×56 pt à 14 pt du bord
      if (imgBandeau) {
        for (const pg of pagesLettre) {
          pg.drawImage(imgBandeau, { x: 14, y: 20, width: 512, height: 56 });
        }
      }

      // ----- Pages de garde + pièces jointes -----
      const pageGarde = (titre: string, pieces: Piece[]) => {
        const p = pdf.addPage(A4);
        p.drawText("CENTURY 21 — Icaza Immobilier", { x: M, y: A4[1] - 50, size: 10, font: helvB, color: or });
        const t = titre.toUpperCase();
        p.drawText(t, {
          x: (A4[0] - helvB.widthOfTextAtSize(t, 20)) / 2,
          y: A4[1] / 2 + 40,
          size: 20,
          font: helvB,
          color: noir,
        });
        let yy = A4[1] / 2;
        for (const pc of pieces) {
          const l = `•  ${pc.nom}`;
          p.drawText(l.length > 90 ? l.slice(0, 90) + "…" : l, {
            x: (A4[0] - Math.min(helv.widthOfTextAtSize(l, 11), LARG)) / 2,
            y: yy,
            size: 11,
            font: helv,
            color: noir,
          });
          yy -= 18;
        }
      };

      const erreurs: string[] = [];
      const ajouterGroupe = async (titre: string, pieces: Piece[]) => {
        if (pieces.length === 0) return;
        pageGarde(titre, pieces);
        for (const pc of pieces) {
          try {
            const src = await PDFDocument.load(pc.data, { ignoreEncryption: true });
            const pages = await pdf.copyPages(src, src.getPageIndices());
            pages.forEach((pg) => pdf.addPage(pg));
          } catch {
            erreurs.push(pc.nom);
          }
        }
      };

      await ajouterGroupe("Pièces du dossier vendeur", piecesVendeur);
      await ajouterGroupe("Pièces du dossier acquéreur", piecesAcquereur);

      const octets = await pdf.save();
      const blob = new Blob([new Uint8Array(octets)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Dossier compromis - ${(d.compromisObjetBien || "dossier").replace(/[\\/:*?"<>|]/g, "-")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      if (erreurs.length) {
        setFusionErreur(`Fichier(s) illisible(s), non inclus : ${erreurs.join(", ")} (PDF protégé ou corrompu).`);
      }
    } catch (err) {
      setFusionErreur(err instanceof Error ? err.message : "Fusion impossible — réessayez.");
    } finally {
      setFusionEnCours(false);
    }
  };

  // ================= MODE SAISIE =================
  if (mode === "saisie") {
    return (
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-navy">Demande de compromis au notaire</h2>
          <button onClick={onReset} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
            ← Documents
          </button>
        </div>

        <div className="mb-4 rounded-2xl border border-copper/40 bg-copper-soft/40 p-4 text-sm text-slate-700">
          <b className="text-navy">En 4 étapes :</b> 1️⃣ ajoutez les PDF du dossier (vendeur et acquéreur) ·
          2️⃣ cliquez « ✨ Pré-remplir avec l'IA » (elle lit les pièces et remplit les champs) ·
          3️⃣ vérifiez et complétez les champs · 4️⃣ générez la lettre, puis téléchargez le dossier complet.
        </div>

        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <ZonePieces titre="1️⃣ Pièces du dossier VENDEUR (PDF)" pieces={piecesVendeur} setter={setPiecesVendeur} ajouter={ajouterPieces} onImporter={() => setImportPour("vendeur")} />
          <ZonePieces titre="1️⃣ Pièces du dossier ACQUÉREUR (PDF)" pieces={piecesAcquereur} setter={setPiecesAcquereur} ajouter={ajouterPieces} onImporter={() => setImportPour("acquereur")} />
          {panneauImport}
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={() => void preRemplir()}
              disabled={iaEnCours}
              className="rounded-xl bg-navy px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-navy/25 transition hover:bg-navy-deep disabled:opacity-60"
            >
              {iaEnCours ? "✨ Lecture des pièces en cours…" : "2️⃣ ✨ Pré-remplir les champs avec l'IA (lit les pièces PDF)"}
            </button>
            <span className="text-xs text-slate-500">
              L&apos;IA lit les pièces (identité, taxe foncière, offre, mandat…) et remplit les champs vides — rien n&apos;est inventé.
            </span>
          </div>
          {iaMessage && (
            <p className={`rounded-lg border p-3 text-sm sm:col-span-2 ${iaMessage.startsWith("✓") ? "border-green-200 bg-green-50 text-green-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
              {iaMessage}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <SousTitre>Le bien</SousTitre>
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ label="Résidence / adresse du bien *" className="sm:col-span-2">
              <input className={inputCls} value={donnees.compromisObjetBien ?? ""} onChange={(e) => set("compromisObjetBien", e.target.value)} placeholder="Résidence Le Canal – Bâtiment SD4 – 13500 Martigues" />
            </Champ>
            <Champ label="Composition du bien (étage, pièces, annexes)">
              <textarea rows={2} className={inputCls} value={donnees.cBienDescription ?? ""} onChange={(e) => set("cBienDescription", e.target.value)} placeholder="Appartement au deuxième étage, porte de droite : entrée, WC, séjour, cuisine, salle de bains, deux chambres, cellier, placards, loggia." />
            </Champ>
          </div>
          {(() => {
            const lots = donnees.cLots?.length ? donnees.cLots : [{ numero: donnees.cLot ?? "", nature: "Appartement" }];
            const setLots = (next: { numero: string; nature: string }[]) =>
              setDonnees((prev) => ({ ...prev, cLots: next, cLot: next[0]?.numero ?? "" }));
            return (
              <div className="mt-3">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Lots vendus (appartement, cave, garage…)</span>
                <div className="grid gap-2">
                  {lots.map((l, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <select
                        className={`${inputCls} w-44`}
                        value={l.nature}
                        onChange={(e) => setLots(lots.map((x, j) => (j === i ? { ...x, nature: e.target.value } : x)))}
                      >
                        {["Appartement", "Maison", "Cave", "Garage", "Parking", "Cellier", "Autre"].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                      <input
                        className={`${inputCls} w-36`}
                        value={l.numero}
                        onChange={(e) => setLots(lots.map((x, j) => (j === i ? { ...x, numero: e.target.value } : x)))}
                        placeholder={i === 0 ? "Lot n° 8" : "Lot n° 21"}
                      />
                      {i > 0 && (
                        <button type="button" onClick={() => setLots(lots.filter((_, j) => j !== i))} className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100" aria-label="Retirer ce lot">✕</button>
                      )}
                    </div>
                  ))}
                </div>
                {lots.length < 6 && (
                  <button type="button" onClick={() => setLots([...lots, { numero: "", nature: "Cave" }])} className="mt-2 rounded-lg border border-dashed border-copper px-3 py-1.5 text-xs font-semibold text-copper transition hover:bg-copper-soft/40">
                    + Ajouter un lot (cave, garage…)
                  </button>
                )}
              </div>
            );
          })()}
          <details className="mt-2">
            <summary className="cursor-pointer text-xs font-semibold text-slate-500 hover:text-copper">+ Détails facultatifs du bien (tantièmes)</summary>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Champ label="Tantièmes des parties communes" className="sm:col-span-2">
                <input className={inputCls} value={donnees.cTantiemes ?? ""} onChange={(e) => set("cTantiemes", e.target.value)} placeholder="46/1000èmes de la propriété du sol et des parties communes générales" />
              </Champ>
            </div>
          </details>

          <SousTitre>Vendeur(s)</SousTitre>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Champ label="Monsieur — nom complet">
              <input className={inputCls} value={donnees.cVendeurM ?? ""} onChange={(e) => set("cVendeurM", e.target.value)} placeholder="Patrice Jean-François Victor VELLA" />
            </Champ>
            <Champ label="Madame — nom complet">
              <input className={inputCls} value={donnees.cVendeurMme ?? ""} onChange={(e) => set("cVendeurMme", e.target.value)} placeholder="Cindy Varié LEQUESNE" />
            </Champ>
            <Champ label="Téléphone">
              <input className={inputCls} inputMode="tel" value={donnees.cVendeurTel ?? ""} onChange={(e) => set("cVendeurTel", e.target.value)} placeholder="06 13 89 37 24" />
            </Champ>
          </div>
          <details className="mt-2" open={Boolean(donnees.cVendeurMProfession || donnees.cVendeurMmeProfession || donnees.cVendeurAdresse || donnees.cVendeurMNaissance || donnees.cVendeurMmeNaissance || donnees.cVendeurEmail)}>
            <summary className="cursor-pointer text-xs font-semibold text-slate-500 hover:text-copper">+ Détails vendeur(s) : professions, naissances, adresse, email (l'IA les remplit depuis les pièces)</summary>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Champ label="Monsieur — profession">
                <input className={inputCls} value={donnees.cVendeurMProfession ?? ""} onChange={(e) => set("cVendeurMProfession", e.target.value)} placeholder="électricien" />
              </Champ>
              <Champ label="Madame — profession">
                <input className={inputCls} value={donnees.cVendeurMmeProfession ?? ""} onChange={(e) => set("cVendeurMmeProfession", e.target.value)} placeholder="employée en restauration" />
              </Champ>
              <Champ label="Monsieur — naissance">
                <input className={inputCls} value={donnees.cVendeurMNaissance ?? ""} onChange={(e) => set("cVendeurMNaissance", e.target.value)} placeholder="à Martigues (13500), le 12 juillet 1984" />
              </Champ>
              <Champ label="Madame — naissance">
                <input className={inputCls} value={donnees.cVendeurMmeNaissance ?? ""} onChange={(e) => set("cVendeurMmeNaissance", e.target.value)} placeholder="à Marignane (13700), le 24 septembre 1986" />
              </Champ>
              <Champ label="Adresse">
                <input className={inputCls} value={donnees.cVendeurAdresse ?? ""} onChange={(e) => set("cVendeurAdresse", e.target.value)} placeholder="Résidence Le Canal – Bâtiment SD4 – 13500 Martigues" />
              </Champ>
              <Champ label="Email">
                <input className={inputCls} inputMode="email" value={donnees.cVendeurEmail ?? ""} onChange={(e) => set("cVendeurEmail", e.target.value)} placeholder="email@exemple.fr" />
              </Champ>
            </div>
          </details>

          <SousTitre>Acquéreur(s)</SousTitre>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Champ label="Monsieur — nom complet">
              <input className={inputCls} value={donnees.cAcqM ?? ""} onChange={(e) => set("cAcqM", e.target.value)} placeholder="Karim YASSIN" />
            </Champ>
            <Champ label="Madame — nom complet">
              <input className={inputCls} value={donnees.cAcqMme ?? ""} onChange={(e) => set("cAcqMme", e.target.value)} placeholder="CASQUEL épouse YASSIN Marie-Christine" />
            </Champ>
            <Champ label="Téléphone">
              <input className={inputCls} inputMode="tel" value={donnees.cAcqTel ?? ""} onChange={(e) => set("cAcqTel", e.target.value)} placeholder="06 63 69 93 71" />
            </Champ>
          </div>
          <details className="mt-2" open={Boolean(donnees.cAcqMNaissance || donnees.cAcqMmeNaissance || donnees.cAcqMProfession || donnees.cAcqMmeProfession || donnees.cAcqAdresse || donnees.cAcqEmail)}>
            <summary className="cursor-pointer text-xs font-semibold text-slate-500 hover:text-copper">+ Détails acquéreur(s) : naissances, professions, adresse, email (l'IA les remplit depuis les pièces)</summary>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Champ label="Monsieur — naissance (date et lieu)">
                <input className={inputCls} value={donnees.cAcqMNaissance ?? ""} onChange={(e) => set("cAcqMNaissance", e.target.value)} placeholder="né le 3 mars 1955 à Marseille" />
              </Champ>
              <Champ label="Madame — naissance (date et lieu)">
                <input className={inputCls} value={donnees.cAcqMmeNaissance ?? ""} onChange={(e) => set("cAcqMmeNaissance", e.target.value)} placeholder="née le 16 septembre 1957 à Marseille" />
              </Champ>
              <Champ label="Monsieur — nationalité et profession">
                <input className={inputCls} value={donnees.cAcqMProfession ?? ""} onChange={(e) => set("cAcqMProfession", e.target.value)} placeholder="de nationalité française, retraité" />
              </Champ>
              <Champ label="Madame — nationalité et profession">
                <input className={inputCls} value={donnees.cAcqMmeProfession ?? ""} onChange={(e) => set("cAcqMmeProfession", e.target.value)} placeholder="de nationalité française, retraitée" />
              </Champ>
              <Champ label="Adresse">
                <input className={inputCls} value={donnees.cAcqAdresse ?? ""} onChange={(e) => set("cAcqAdresse", e.target.value)} placeholder="Résidence Paradis Parc – 13500 Martigues" />
              </Champ>
              <Champ label="Email">
                <input className={inputCls} inputMode="email" value={donnees.cAcqEmail ?? ""} onChange={(e) => set("cAcqEmail", e.target.value)} placeholder="email@exemple.fr" />
              </Champ>
            </div>
          </details>

          <SousTitre>Notaire vendeur</SousTitre>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Champ label="Nom">
              <input className={inputCls} value={donnees.cNotVNom ?? ""} onChange={(e) => set("cNotVNom", e.target.value)} placeholder="Maître Mathieu TORRES" />
            </Champ>
            <Champ label="Étude">
              <input className={inputCls} value={donnees.cNotVEtude ?? ""} onChange={(e) => set("cNotVEtude", e.target.value)} placeholder="Omega Notaires" />
            </Champ>
            <Champ label="Adresse">
              <input className={inputCls} value={donnees.cNotVAdresse ?? ""} onChange={(e) => set("cNotVAdresse", e.target.value)} placeholder="Avenue Jean Moulin – 13500 Martigues" />
            </Champ>
            <Champ label="Tél / email">
              <input className={inputCls} value={donnees.cNotVTel ?? ""} onChange={(e) => set("cNotVTel", e.target.value)} placeholder="04 42 80 70 00 · contact@omega-notaires.fr" />
            </Champ>
          </div>

          <SousTitre>Notaire acquéreur</SousTitre>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Champ label="Nom">
              <input className={inputCls} value={donnees.cNotANom ?? ""} onChange={(e) => set("cNotANom", e.target.value)} placeholder="Maître PASQUIER" />
            </Champ>
            <Champ label="Étude">
              <input className={inputCls} value={donnees.cNotAEtude ?? ""} onChange={(e) => set("cNotAEtude", e.target.value)} placeholder="Office notarial" />
            </Champ>
            <Champ label="Adresse">
              <input className={inputCls} value={donnees.cNotAAdresse ?? ""} onChange={(e) => set("cNotAAdresse", e.target.value)} placeholder="13220 Châteauneuf-les-Martigues" />
            </Champ>
            <Champ label="Tél / email">
              <input className={inputCls} value={donnees.cNotATel ?? ""} onChange={(e) => set("cNotATel", e.target.value)} placeholder="04 42 76 20 00 · office.13105@notaires.fr" />
            </Champ>
          </div>

          <SousTitre>Conditions de la vente</SousTitre>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Champ label="Prix de vente (€ FAI)">
              <input type="number" className={inputCls} value={donnees.cPrixVente ?? ""} onChange={(e) => set("cPrixVente", num(e.target.value))} placeholder="155000" />
            </Champ>
            <Champ label="Honoraires d'agence (€ TTC)">
              <input type="number" className={inputCls} value={donnees.cHonoraires ?? ""} onChange={(e) => set("cHonoraires", num(e.target.value))} placeholder="7000" />
            </Champ>
            <Champ label="Paiement">
              <select className={inputCls} value={donnees.cPaiement ?? ""} onChange={(e) => set("cPaiement", e.target.value)}>
                <option value="">—</option>
                <option>Paiement comptant du prix de vente</option>
                <option>Financement par prêt bancaire</option>
              </select>
            </Champ>
            <Champ label="Condition suspensive">
              <select className={inputCls} value={donnees.cCondSuspensive ?? ""} onChange={(e) => set("cCondSuspensive", e.target.value)}>
                <option value="">—</option>
                <option>Absence de condition suspensive de financement</option>
                <option>Sous condition suspensive d&apos;obtention de prêt</option>
              </select>
            </Champ>
          </div>

          <details className="mt-5">
            <summary className="cursor-pointer text-sm font-bold uppercase tracking-wide text-navy">Pièces transmises listées dans la lettre (pré-remplies — cliquez pour modifier)</summary>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Champ label="Dossier vendeur (une pièce par ligne)">
                <textarea rows={5} className={inputCls} value={donnees.compromisPiecesVendeur ?? ""} onChange={(e) => set("compromisPiecesVendeur", e.target.value)} />
              </Champ>
              <Champ label="Dossier acquéreur (une pièce par ligne)">
                <textarea rows={5} className={inputCls} value={donnees.compromisPiecesAcquereur ?? ""} onChange={(e) => set("compromisPiecesAcquereur", e.target.value)} />
              </Champ>
            </div>
          </details>

          <SousTitre>Signature</SousTitre>
          <div className="grid gap-4 sm:grid-cols-3">
            <Champ label="Négociateur">
              <input className={inputCls} value={donnees.negociateur ?? ""} onChange={(e) => set("negociateur", e.target.value)} placeholder="Votre nom" />
            </Champ>
            <Champ label="Téléphone">
              <input className={inputCls} inputMode="tel" value={donnees.negociateurTel ?? ""} onChange={(e) => set("negociateurTel", e.target.value)} placeholder="06 12 34 56 78" />
            </Champ>
            <Champ label="Email">
              <input className={inputCls} inputMode="email" value={donnees.negociateurEmail ?? ""} onChange={(e) => set("negociateurEmail", e.target.value)} placeholder="prenom.nom@century21.fr" />
            </Champ>
          </div>

          {saisieErreur && (
            <p className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{saisieErreur}</p>
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={genererLettre}
              className="rounded-xl bg-copper px-7 py-2.5 text-sm font-bold text-white shadow-md shadow-copper/30 transition hover:brightness-110"
            >
              4️⃣ ✦ Générer la lettre →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= MODE APERÇU =================
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h2 className="text-2xl font-bold text-navy">Demande de compromis au notaire</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setMode("saisie")} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
            ← Modifier la saisie
          </button>
          <button onClick={() => window.print()} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
            🖨 Imprimer la lettre
          </button>
          <button
            onClick={() => void telechargerDossier()}
            disabled={fusionEnCours}
            className="rounded-lg bg-copper px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {fusionEnCours ? "Fusion en cours…" : "📦 Télécharger le dossier complet (PDF)"}
          </button>
          <button onClick={onReset} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
            Nouveau document
          </button>
        </div>
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-2 print:hidden">
        <ZonePieces titre="Pièces du dossier VENDEUR" pieces={piecesVendeur} setter={setPiecesVendeur} ajouter={ajouterPieces} onImporter={() => setImportPour("vendeur")} />
        <ZonePieces titre="Pièces du dossier ACQUÉREUR" pieces={piecesAcquereur} setter={setPiecesAcquereur} ajouter={ajouterPieces} onImporter={() => setImportPour("acquereur")} />
        {panneauImport}
        <p className="text-xs text-slate-500 sm:col-span-2">
          Le « dossier complet » = la lettre ci-dessous + une page de garde « Pièces du dossier vendeur » suivie
          de tous ses PDF, puis « Pièces du dossier acquéreur » et les siens — en un seul fichier PDF, prêt à
          envoyer au notaire. La fusion se fait sur votre ordinateur : aucun document n&apos;est envoyé sur un serveur.
        </p>
        {fusionErreur && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 sm:col-span-2">{fusionErreur}</p>
        )}
      </div>

      {/* Aperçu imprimable de la lettre — papier à en-tête C21 */}
      <div className="dossier">
        <section className="page page-c21">
          <EnTete />
          <div style={{ textAlign: "right", marginTop: 14 }}>Martigues, le {dateStr}</div>

          <div style={{ marginTop: 18 }}>
            <p style={{ marginBottom: 14 }}><b>Objet : {objet}</b></p>
            <p style={{ marginBottom: 10 }}>Maître,</p>
            <p style={{ marginBottom: 12, textAlign: "justify" }}>
              Je me permets de revenir vers vous afin de convenir d&rsquo;une date pour la signature du compromis
              de vente relatif au bien situé <b>{d.compromisObjetBien || "—"}</b>, dont les éléments sont
              détaillés ci-dessous.
            </p>

            <p style={{ fontWeight: 700, marginBottom: 4 }}>Identification du bien vendu</p>
            {lignes(d.compromisBien).map((l, i) => (<p key={i} style={{ marginBottom: 2 }}>{l}</p>))}
            <p style={{ fontWeight: 700, margin: "12px 0 4px" }}>Vendeurs</p>
            {lignes(d.compromisVendeurs).map((l, i) => (<p key={i} style={{ marginBottom: 2 }}>{l}</p>))}
            <p style={{ fontWeight: 700, margin: "12px 0 4px" }}>Acquéreur</p>
            {lignes(d.compromisAcquereur).map((l, i) => (<p key={i} style={{ marginBottom: 2 }}>{l}</p>))}
          </div>

          <PiedC21 />
        </section>

        <section className="page page-c21">
          <EnTete />
          <div style={{ marginTop: 18 }}>
            <p style={{ fontWeight: 700, marginBottom: 4 }}>Représentation notariale</p>
            <p style={{ fontWeight: 700, marginBottom: 2 }}>Notaire vendeur :</p>
            {lignes(d.compromisNotaireVendeur).map((l, i) => (<p key={i} style={{ marginBottom: 2 }}>{l}</p>))}
            <p style={{ fontWeight: 700, margin: "8px 0 2px" }}>Notaire acquéreur :</p>
            {lignes(d.compromisNotaireAcquereur).map((l, i) => (<p key={i} style={{ marginBottom: 2 }}>{l}</p>))}

            <p style={{ fontWeight: 700, margin: "12px 0 4px" }}>Conditions de la vente</p>
            <ul style={{ paddingLeft: 18, marginBottom: 4 }}>
              {lignes(d.compromisConditions).map((l, i) => (<li key={i} style={{ marginBottom: 2 }}>{l}</li>))}
            </ul>

            <p style={{ fontWeight: 700, margin: "12px 0 4px" }}>Pièces transmises</p>
            <p style={{ fontWeight: 700, marginBottom: 2 }}>Dossier vendeur :</p>
            <ul style={{ paddingLeft: 18, marginBottom: 6 }}>
              {lignes(d.compromisPiecesVendeur).map((l, i) => (<li key={i} style={{ marginBottom: 2 }}>{l}</li>))}
            </ul>
            <p style={{ fontWeight: 700, marginBottom: 2 }}>Dossier acquéreur :</p>
            <ul style={{ paddingLeft: 18, marginBottom: 6 }}>
              {lignes(d.compromisPiecesAcquereur).map((l, i) => (<li key={i} style={{ marginBottom: 2 }}>{l}</li>))}
            </ul>

            <p style={{ fontWeight: 700, margin: "12px 0 4px" }}>Demande de rendez-vous</p>
            <p style={{ marginBottom: 8, textAlign: "justify" }}>
              Afin de faire avancer la transaction, je vous remercie de bien vouloir nous proposer plusieurs
              créneaux de rendez-vous dans les meilleurs délais pour la signature du compromis de vente.
            </p>
            <p style={{ marginBottom: 8, textAlign: "justify" }}>
              Je reste naturellement à votre disposition pour toute information complémentaire ou transmission
              de pièces nécessaires à la constitution du dossier.
            </p>
            <p style={{ marginBottom: 14 }}>Je vous remercie par avance pour votre retour.</p>
            <p style={{ marginBottom: 4 }}>Cordialement,</p>
            <p style={{ fontWeight: 700 }}>{d.negociateur || "L'équipe transaction"}</p>
            <p style={{ fontSize: "10pt", color: "#666" }}>
              CENTURY 21 Icaza Immobilier
              {d.negociateurTel ? ` · ${d.negociateurTel}` : ""}
              {d.negociateurEmail ? ` · ${d.negociateurEmail}` : ""}
            </p>
          </div>
          <PiedC21 />
        </section>
      </div>
    </div>
  );
}
