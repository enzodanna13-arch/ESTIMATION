import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import type { Sinistre } from "./serverSinistres";

// Génère la DÉCLARATION DE SINISTRE à l'assurance (pdf-lib) : lettre type
// (syndic → assureur) pré-remplie à partir du sinistre, suivie d'une annexe
// « reportage photographique » où chaque photo est légendée en dessous.

const OR = rgb(0.706, 0.592, 0.357);
const NOIR = rgb(0.1, 0.1, 0.12);
const GRIS = rgb(0.45, 0.45, 0.5);
const W = 595, H = 842, M = 56;

// WinAnsi ne sait pas tout encoder : on ramène les caractères FR exotiques.
const nettoyer = (s: string) => (s ?? "")
  .replace(/[   ⁠﻿]/g, " ")
  .replace(/[–—]/g, "-")
  .replace(/[‘’]/g, "'")
  .replace(/[“”]/g, '"')
  .replace(/…/g, "...")
  .replace(/[^\x09\x0A\x0D\x20-\xFF€]/g, "");

const AGENCE = [
  "CENTURY 21 ICAZA Immobilier",
  "32 avenue de la Paix",
  "13500 Martigues",
  "Tél. 04 42 42 80 85",
  "icaza@century21.fr",
];

const dateFr = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  return Number.isFinite(d.getTime()) ? d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : iso;
};
const euros = (n: number) => nettoyer(new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n)) + " €";

export interface PhotoBytes { nom: string; legende: string; bytes: Uint8Array; }

export interface OptionsDeclaration {
  lieu?: string;
  dateDeclaration?: number;
  recommande?: boolean;
  circonstances?: string; // paragraphe libre complémentaire
  dommages?: string;      // liste des dommages constatés
}

export async function genererDeclarationSinistrePdf(
  s: Sinistre,
  photos: PhotoBytes[],
  opts: OptionsDeclaration = {},
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);

  let page = pdf.addPage([W, H]);
  let y = M; // distance depuis le haut

  const newPage = () => { page = pdf.addPage([W, H]); y = M; };
  const ensure = (h: number) => { if (y + h > H - M) newPage(); };

  const draw = (txt: string, x: number, size: number, f: PDFFont, color = NOIR, align: "left" | "right" | "center" = "left") => {
    const t = nettoyer(txt);
    const w = f.widthOfTextAtSize(t, size);
    const x2 = align === "right" ? x - w : align === "center" ? x - w / 2 : x;
    page.drawText(t, { x: x2, y: H - y - size, size, font: f, color });
  };

  // Paragraphe avec retour à la ligne automatique.
  const para = (txt: string, size = 10.5, f: PDFFont = font, color = NOIR, interligne = 1.45, gapApres = 8) => {
    const maxW = W - 2 * M;
    const lh = size * interligne;
    for (const brut of nettoyer(txt).split("\n")) {
      const mots = brut.split(" ");
      let ligne = "";
      for (const mot of mots) {
        const essai = ligne ? `${ligne} ${mot}` : mot;
        if (f.widthOfTextAtSize(essai, size) > maxW && ligne) {
          ensure(lh); page.drawText(ligne, { x: M, y: H - y - size, size, font: f, color }); y += lh; ligne = mot;
        } else ligne = essai;
      }
      ensure(lh); page.drawText(ligne, { x: M, y: H - y - size, size, font: f, color }); y += lh;
    }
    y += gapApres;
  };

  // --- En-tête : expéditeur (gauche) / destinataire (droite) ---
  const yStart = y;
  draw("CENTURY 21", M, 17, bold, OR);
  y += 22;
  AGENCE.slice(0, 1).forEach(() => {}); // (le logo texte occupe la 1re ligne)
  draw("ICAZA Immobilier - Syndic de copropriété", M, 9.5, bold, NOIR);
  y += 14;
  for (const l of AGENCE.slice(1)) { draw(l, M, 9.5, font, GRIS); y += 12; }

  // Destinataire (bloc aligné à droite, à hauteur de l'en-tête)
  let yd = yStart;
  const drawRight = (txt: string, size: number, f: PDFFont, color = NOIR) => {
    const t = nettoyer(txt); page.drawText(t, { x: W - M - f.widthOfTextAtSize(t, size), y: H - yd - size, size, font: f, color }); yd += size * 1.5;
  };
  drawRight("À l'attention de", 9, italic, GRIS);
  drawRight(s.assureur || "Compagnie d'assurance", 11, bold);
  for (const l of (s.assuranceAdresse || "").split("\n")) if (l.trim()) drawRight(l.trim(), 9.5, font, GRIS);
  for (const l of (s.assuranceContact || "").split("\n")) if (l.trim()) drawRight(l.trim(), 9.5, font, GRIS);

  y = Math.max(y, yd) + 24;

  // --- Lieu et date ---
  draw(`${opts.lieu || "Martigues"}, le ${new Date(opts.dateDeclaration || Date.now()).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}`, W - M, 10.5, font, NOIR, "right");
  y += 24;

  // --- Références ---
  if (s.assurancePolice) { draw(`Contrat / police n° : ${s.assurancePolice}`, M, 9.5, font, GRIS); y += 13; }
  if (s.reference) { draw(`Référence sinistre : ${s.reference}`, M, 9.5, font, GRIS); y += 13; }
  if (opts.recommande !== false) { draw("Lettre recommandée avec accusé de réception", M, 9.5, italic, GRIS); y += 13; }
  y += 8;

  // --- Objet ---
  ensure(20);
  draw(`Objet : Déclaration de sinistre - ${s.motif} - Copropriété ${s.coproNom}`, M, 11, bold, NOIR);
  y += 24;

  // --- Corps ---
  para("Madame, Monsieur,", 10.5, font, NOIR, 1.45, 10);

  const lieuBien = [s.coproNom ? `« ${s.coproNom} »` : "", s.coproAdresse ? `sise ${s.coproAdresse}` : ""].filter(Boolean).join(" ");
  para(
    `En notre qualité de ${s.qualite || "syndic"} de la copropriété ${lieuBien}, nous vous déclarons par la présente le sinistre survenu le ${dateFr(s.dateSinistre) || "(date à préciser)"}, dont la nature est la suivante : ${s.motif.toLowerCase()}.`,
  );

  if (s.description.trim()) para(s.description.trim());
  if (opts.circonstances?.trim()) para(opts.circonstances.trim());

  if (opts.dommages?.trim()) {
    para("Dommages constatés :", 10.5, bold, NOIR, 1.45, 4);
    for (const d of opts.dommages.split("\n").map((x) => x.trim()).filter(Boolean)) para(`-  ${d}`, 10.5, font, NOIR, 1.4, 2);
    y += 6;
  }

  if (s.montantEstime && s.montantEstime > 0) para(`Le montant des dommages est estimé à titre indicatif à ${euros(s.montantEstime)}.`);

  if (photos.length > 0) para(`Vous trouverez en annexe un reportage photographique (${photos.length} vue${photos.length > 1 ? "s" : ""}) illustrant les désordres constatés.`);

  para("Nous vous remercions de bien vouloir diligenter une expertise dans les meilleurs délais et restons à votre entière disposition pour tout complément d'information ou visite des lieux.");
  para("Dans cette attente, nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.");

  y += 16;
  ensure(40);
  draw(s.signataire || "Le Syndic", W - M, 10.5, bold, NOIR, "right");
  y += 14;
  draw(s.qualite || "CENTURY 21 ICAZA Immobilier", W - M, 9.5, font, GRIS, "right");

  // --- Annexe photos ---
  if (photos.length > 0) {
    newPage();
    draw("Annexe - Reportage photographique", M, 14, bold, OR);
    y += 20;
    draw(`Copropriété ${s.coproNom} - Sinistre ${s.motif} du ${dateFr(s.dateSinistre)}`, M, 9.5, italic, GRIS);
    y += 24;

    const maxW = W - 2 * M;
    const maxImgH = 300;
    let i = 0;
    for (const p of photos) {
      i += 1;
      let img: PDFImage | null = null;
      try { img = await pdf.embedJpg(p.bytes); } catch { try { img = await pdf.embedPng(p.bytes); } catch { img = null; } }
      // Dimensions mises à l'échelle (largeur page, hauteur plafonnée)
      let dw = maxW, dh = 180;
      if (img) { const r = img.height / img.width; dh = Math.min(maxImgH, maxW * r); dw = dh / r; }
      // Légende : estimer la hauteur pour ne pas couper le bloc photo+texte
      const legende = `Photo ${i}${p.nom ? ` - ${p.nom}` : ""}${p.legende ? ` : ${p.legende}` : ""}`;
      const legLignes = Math.max(1, Math.ceil(font.widthOfTextAtSize(nettoyer(legende), 9.5) / maxW));
      const bloc = dh + 8 + legLignes * 14 + 20;
      if (y + bloc > H - M) { newPage(); }
      if (img) {
        const x = M + (maxW - dw) / 2;
        page.drawImage(img, { x, y: H - y - dh, width: dw, height: dh });
      } else {
        page.drawRectangle({ x: M, y: H - y - dh, width: maxW, height: dh, borderColor: GRIS, borderWidth: 0.8 });
        draw("(image non disponible)", W / 2, 10, italic, GRIS, "center");
      }
      y += dh + 8;
      para(legende, 9.5, font, NOIR, 1.4, 16);
    }
  }

  return await pdf.save();
}
