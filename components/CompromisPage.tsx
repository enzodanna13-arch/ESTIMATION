"use client";

import { useState } from "react";
import { EnTete, PiedC21 } from "@/components/PreEtatDate";
import type { DocumentInput } from "@/lib/docTypes";

// Demande de compromis de vente au notaire — courrier sur papier à en-tête
// C21 + PIÈCES JOINTES : les PDF des dossiers vendeur et acquéreur sont
// fusionnés avec la lettre en UN SEUL PDF, prêt à transmettre au notaire.
// La fusion se fait entièrement dans le navigateur (pdf-lib) : aucun
// document n'est envoyé sur un serveur.

interface Piece {
  nom: string;
  taille: number;
  data: ArrayBuffer;
}

const OR = { r: 0.706, g: 0.592, b: 0.357 };

function lignes(v?: string): string[] {
  return (v ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
}

function ZonePieces({
  titre,
  pieces,
  setter,
  ajouter,
}: {
  titre: string;
  pieces: Piece[];
  setter: React.Dispatch<React.SetStateAction<Piece[]>>;
  ajouter: (files: FileList | null, setter: React.Dispatch<React.SetStateAction<Piece[]>>) => Promise<void>;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-bold text-navy">{titre}</h4>
        <span className="text-xs text-slate-400">{pieces.length} PDF</span>
      </div>
      <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-3 text-center text-xs font-semibold text-slate-500 transition hover:border-copper hover:text-copper">
        + Ajouter des PDF
        <input type="file" accept="application/pdf" multiple className="hidden" onChange={(e) => { void ajouter(e.target.files, setter); e.target.value = ""; }} />
      </label>
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

export default function CompromisPage({ input, onReset }: { input: DocumentInput; onReset: () => void }) {
  const [piecesVendeur, setPiecesVendeur] = useState<Piece[]>([]);
  const [piecesAcquereur, setPiecesAcquereur] = useState<Piece[]>([]);
  const [fusionEnCours, setFusionEnCours] = useState(false);
  const [fusionErreur, setFusionErreur] = useState<string | null>(null);
  const dateStr = new Date().toLocaleDateString("fr-FR");
  const objet = `Demande de date pour signature du compromis de vente – ${input.compromisObjetBien || "—"}`;

  const ajouterPieces = async (files: FileList | null, setter: React.Dispatch<React.SetStateAction<Piece[]>>) => {
    if (!files) return;
    for (const f of Array.from(files)) {
      if (!f.name.toLowerCase().endsWith(".pdf")) continue;
      const data = await f.arrayBuffer();
      setter((prev) => [...prev, { nom: f.name, taille: f.size, data }]);
    }
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
      const M = 57; // marge ~20 mm
      const LARG = A4[0] - 2 * M;
      const or = rgb(OR.r, OR.g, OR.b);
      const noir = rgb(0, 0, 0);
      const gris = rgb(0.45, 0.45, 0.45);

      let page = pdf.addPage(A4);
      let y = 0;

      const enTetePdf = () => {
        let yy = A4[1] - 46;
        page.drawText("CENTURY 21", { x: M, y: yy, size: 14, font: helvB, color: or });
        yy -= 16;
        page.drawText("Icaza Immobilier", { x: M, y: yy, size: 11, font: helv, color: gris });
        yy -= 14;
        page.drawText("32 avenue de la Paix", { x: M, y: yy, size: 9, font: times, color: noir });
        yy -= 12;
        page.drawText("13500 Martigues", { x: M, y: yy, size: 9, font: times, color: noir });
        y = yy - 26;
      };

      const nouvellePage = () => {
        page = pdf.addPage(A4);
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
            if (y < 64) nouvellePage();
            page.drawText(l, { x: M + indent, y, size, font, color: opts.couleur ?? noir });
            y -= size * 1.42;
          }
        }
        y -= opts.gap ?? 8;
      };

      const titreSection = (t: string) => {
        y -= 4;
        if (y < 90) nouvellePage();
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
        `Je me permets de revenir vers vous afin de convenir d’une date pour la signature du compromis de vente relatif au bien situé ${input.compromisObjetBien || "—"}, dont les éléments sont détaillés ci-dessous.`,
        { gap: 10 },
      );
      titreSection("Identification du bien vendu");
      para(input.compromisBien || "—", { gap: 10 });
      titreSection("Vendeurs");
      para(input.compromisVendeurs || "—", { gap: 10 });
      titreSection("Acquéreur");
      para(input.compromisAcquereur || "—", { gap: 10 });
      titreSection("Représentation notariale");
      para("Notaire vendeur :", { font: timesB, size: 11, gap: 2 });
      para(input.compromisNotaireVendeur || "—", { gap: 8 });
      para("Notaire acquéreur :", { font: timesB, size: 11, gap: 2 });
      para(input.compromisNotaireAcquereur || "—", { gap: 10 });
      titreSection("Conditions de la vente");
      for (const c of lignes(input.compromisConditions)) para(`•  ${c}`, { gap: 0, indent: 6 });
      y -= 10;
      titreSection("Pièces transmises");
      para("Dossier vendeur :", { font: timesB, size: 11, gap: 2 });
      for (const p of lignes(input.compromisPiecesVendeur)) para(`•  ${p}`, { gap: 0, indent: 6 });
      y -= 6;
      para("Dossier acquéreur :", { font: timesB, size: 11, gap: 2 });
      for (const p of lignes(input.compromisPiecesAcquereur)) para(`•  ${p}`, { gap: 0, indent: 6 });
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
      para(`${input.negociateur || "L'équipe transaction"}`, { font: timesB, size: 11, gap: 0 });
      para(
        `CENTURY 21 Icaza Immobilier${input.negociateurTel ? ` · ${input.negociateurTel}` : ""}${input.negociateurEmail ? ` · ${input.negociateurEmail}` : ""}`,
        { size: 10, couleur: gris, gap: 0 },
      );

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
      a.download = `Dossier compromis - ${(input.compromisObjetBien || "dossier").replace(/[\\/:*?"<>|]/g, "-")}.pdf`;
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

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h2 className="text-2xl font-bold text-navy">Demande de compromis au notaire</h2>
        <div className="flex items-center gap-2">
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
        <ZonePieces titre="Pièces du dossier VENDEUR" pieces={piecesVendeur} setter={setPiecesVendeur} ajouter={ajouterPieces} />
        <ZonePieces titre="Pièces du dossier ACQUÉREUR" pieces={piecesAcquereur} setter={setPiecesAcquereur} ajouter={ajouterPieces} />
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
              de vente relatif au bien situé <b>{input.compromisObjetBien || "—"}</b>, dont les éléments sont
              détaillés ci-dessous.
            </p>

            <p style={{ fontWeight: 700, marginBottom: 4 }}>Identification du bien vendu</p>
            {lignes(input.compromisBien).map((l, i) => (<p key={i} style={{ marginBottom: 2 }}>{l}</p>))}
            <p style={{ fontWeight: 700, margin: "12px 0 4px" }}>Vendeurs</p>
            {lignes(input.compromisVendeurs).map((l, i) => (<p key={i} style={{ marginBottom: 2 }}>{l}</p>))}
            <p style={{ fontWeight: 700, margin: "12px 0 4px" }}>Acquéreur</p>
            {lignes(input.compromisAcquereur).map((l, i) => (<p key={i} style={{ marginBottom: 2 }}>{l}</p>))}
          </div>

          <PiedC21 />
        </section>

        <section className="page page-c21">
          <EnTete />
          <div style={{ marginTop: 18 }}>
            <p style={{ fontWeight: 700, marginBottom: 4 }}>Représentation notariale</p>
            <p style={{ fontWeight: 700, marginBottom: 2 }}>Notaire vendeur :</p>
            {lignes(input.compromisNotaireVendeur).map((l, i) => (<p key={i} style={{ marginBottom: 2 }}>{l}</p>))}
            <p style={{ fontWeight: 700, margin: "8px 0 2px" }}>Notaire acquéreur :</p>
            {lignes(input.compromisNotaireAcquereur).map((l, i) => (<p key={i} style={{ marginBottom: 2 }}>{l}</p>))}

            <p style={{ fontWeight: 700, margin: "12px 0 4px" }}>Conditions de la vente</p>
            <ul style={{ paddingLeft: 18, marginBottom: 4 }}>
              {lignes(input.compromisConditions).map((l, i) => (<li key={i} style={{ marginBottom: 2 }}>{l}</li>))}
            </ul>

            <p style={{ fontWeight: 700, margin: "12px 0 4px" }}>Pièces transmises</p>
            <p style={{ fontWeight: 700, marginBottom: 2 }}>Dossier vendeur :</p>
            <ul style={{ paddingLeft: 18, marginBottom: 6 }}>
              {lignes(input.compromisPiecesVendeur).map((l, i) => (<li key={i} style={{ marginBottom: 2 }}>{l}</li>))}
            </ul>
            <p style={{ fontWeight: 700, marginBottom: 2 }}>Dossier acquéreur :</p>
            <ul style={{ paddingLeft: 18, marginBottom: 6 }}>
              {lignes(input.compromisPiecesAcquereur).map((l, i) => (<li key={i} style={{ marginBottom: 2 }}>{l}</li>))}
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
            <p style={{ fontWeight: 700 }}>{input.negociateur || "L'équipe transaction"}</p>
            <p style={{ fontSize: "10pt", color: "#666" }}>
              CENTURY 21 Icaza Immobilier
              {input.negociateurTel ? ` · ${input.negociateurTel}` : ""}
              {input.negociateurEmail ? ` · ${input.negociateurEmail}` : ""}
            </p>
          </div>
          <PiedC21 />
        </section>
      </div>
    </div>
  );
}
