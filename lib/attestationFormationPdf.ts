import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";

// Génère une ATTESTATION DE FORMATION en PDF (pdf-lib). Récapitule les modules
// validés par l'apprenant et le volume horaire total — utile au titre de
// l'obligation de formation continue des professionnels de l'immobilier
// (loi ALUR : 14 h/an ou 42 h sur 3 ans). Valeur interne / pédagogique.

export interface LigneAttestation {
  titre: string;
  categorie: string;
  minutes: number;
}

export interface DonneesAttestation {
  apprenant: string;
  modules: LigneAttestation[];
  date?: number; // timestamp (défaut : aujourd'hui)
}

const OR = rgb(0.706, 0.592, 0.357);
const NOIR = rgb(0, 0, 0);
const GRIS_CLAIR = rgb(0.95, 0.95, 0.95);
const H = 842, W = 595;

// La police standard (WinAnsi) ne sait pas encoder certains caractères Unicode
// (espaces fines/insécables, tirets longs, apostrophes typographiques…).
const nettoyer = (s: string) => (s ?? "")
  .replace(/[    ⁠﻿]/g, " ")
  .replace(/[–—]/g, "-")
  .replace(/[‘’]/g, "'")
  .replace(/[“”]/g, '"')
  .replace(/[^\x09\x0A\x0D\x20-\xFF€]/g, "?");

export async function genererAttestationFormationPdf(d: DonneesAttestation): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([W, H]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const T = (txtBrut: string, x: number, yTop: number, o: { size?: number; f?: PDFFont; align?: "left" | "center" | "right"; color?: ReturnType<typeof rgb> } = {}) => {
    const txt = nettoyer(txtBrut);
    const size = o.size ?? 10.5; const f = o.f ?? font; const color = o.color ?? NOIR;
    const w = f.widthOfTextAtSize(txt, size);
    const x2 = o.align === "center" ? x - w / 2 : o.align === "right" ? x - w : x;
    page.drawText(txt, { x: x2, y: H - yTop - size, size, font: f, color });
  };

  const dateStr = new Date(d.date && d.date > 0 ? d.date : Date.now()).toLocaleDateString("fr-FR");
  const totalMin = d.modules.reduce((s, m) => s + (m.minutes || 0), 0);
  const heures = Math.floor(totalMin / 60);
  const minutes = totalMin % 60;
  const dureeStr = heures > 0 ? `${heures} h${minutes > 0 ? ` ${String(minutes).padStart(2, "0")}` : ""}` : `${minutes} min`;

  // Bordure décorative
  page.drawRectangle({ x: 24, y: 24, width: W - 48, height: H - 48, borderColor: OR, borderWidth: 2 });
  page.drawRectangle({ x: 30, y: 30, width: W - 60, height: H - 60, borderColor: OR, borderWidth: 0.6 });

  // En-tête
  T("CENTURY 21", W / 2, 70, { size: 22, f: bold, color: OR, align: "center" });
  T("ICAZA Immobilier - Centre de formation interne", W / 2, 98, { size: 10, align: "center" });

  T("ATTESTATION DE FORMATION", W / 2, 150, { size: 20, f: bold, align: "center" });
  page.drawLine({ start: { x: W / 2 - 110, y: H - 178 }, end: { x: W / 2 + 110, y: H - 178 }, thickness: 1.2, color: OR });

  T("Le centre de formation atteste que", W / 2, 210, { size: 11, align: "center" });
  T(d.apprenant || "—", W / 2, 234, { size: 16, f: bold, color: OR, align: "center" });
  T("a suivi et validé les modules de formation suivants :", W / 2, 266, { size: 11, align: "center" });

  // Tableau des modules
  let y = 300;
  const x0 = 60, x1 = W - 60;
  // en-tête tableau
  page.drawRectangle({ x: x0, y: H - y - 20, width: x1 - x0, height: 20, color: OR });
  T("Module", x0 + 10, y + 5, { size: 9.5, f: bold, color: rgb(1, 1, 1) });
  T("Catégorie", x1 - 150, y + 5, { size: 9.5, f: bold, color: rgb(1, 1, 1) });
  T("Durée", x1 - 10, y + 5, { size: 9.5, f: bold, color: rgb(1, 1, 1), align: "right" });
  y += 20;

  const maxLignes = 22;
  const lignes = d.modules.slice(0, maxLignes);
  lignes.forEach((m, i) => {
    if (i % 2 === 1) page.drawRectangle({ x: x0, y: H - y - 18, width: x1 - x0, height: 18, color: GRIS_CLAIR });
    const titre = m.titre.length > 52 ? m.titre.slice(0, 51) + "…" : m.titre;
    T(titre, x0 + 10, y + 4, { size: 9 });
    T(m.categorie, x1 - 150, y + 4, { size: 9 });
    const mn = m.minutes || 0;
    T(mn >= 60 ? `${Math.floor(mn / 60)} h ${String(mn % 60).padStart(2, "0")}` : `${mn} min`, x1 - 10, y + 4, { size: 9, align: "right" });
    y += 18;
  });
  if (d.modules.length > maxLignes) { T(`… et ${d.modules.length - maxLignes} autre(s) module(s)`, x0 + 10, y + 4, { size: 8.5, color: rgb(0.4, 0.4, 0.4) }); y += 16; }
  page.drawLine({ start: { x: x0, y: H - y }, end: { x: x1, y: H - y }, thickness: 0.8, color: OR });
  y += 10;

  // Total
  T(`Volume horaire total : ${dureeStr}`, x1 - 10, y + 2, { size: 12, f: bold, color: OR, align: "right" });
  T(`${d.modules.length} module(s) validé(s)`, x0 + 10, y + 2, { size: 10 });
  y += 36;

  T("Formation continue au sens de la loi ALUR (14 h/an, 42 h sur 3 ans) et du", W / 2, y, { size: 9, align: "center", color: rgb(0.35, 0.35, 0.35) });
  T("décret n° 2016-173 du 18 février 2016. Document interne à valeur justificative.", W / 2, y + 13, { size: 9, align: "center", color: rgb(0.35, 0.35, 0.35) });

  // Signature / date
  T(`Fait à Martigues, le ${dateStr}`, x1 - 10, H - 150, { size: 10, align: "right" });
  T("Le responsable de formation", x1 - 10, H - 130, { size: 10, align: "right" });
  T("ICAZA Immobilier", x1 - 10, H - 110, { size: 10, f: bold, align: "right" });

  return pdf.save();
}

export function nomFichierAttestation(apprenant?: string): string {
  const base = ["Attestation de formation", apprenant].filter(Boolean).join(" - ")
    .replace(/[\\/:*?"<>|\r\n]+/g, " ").trim().slice(0, 120);
  return `${base || "Attestation de formation"}.pdf`;
}
