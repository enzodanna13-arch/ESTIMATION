import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

// Génère la FACTURE D'HONORAIRES de l'agence en PDF (pdf-lib), à partir des
// données d'une facture. Reprend la structure du modèle Century 21 Icaza :
// client facturé, n° de facture, honoraires, totaux HT/TVA/TTC, RIB et
// mentions légales. Produit un PDF A4 standard, attachable à une transaction.

export interface DonneesFactureAgence {
  numero?: string;
  clientNom?: string;
  clientAdresse?: string;
  bien?: string;
  notaire?: string;
  ref?: string;
  commissionTTC?: number;
  date?: number; // timestamp (défaut : aujourd'hui)
}

const OR = rgb(0.706, 0.592, 0.357);
const NOIR = rgb(0, 0, 0);
const GRIS = rgb(0.85, 0.85, 0.85);
const H = 842, W = 595;
const milliers = (v: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(v);

const MENTIONS = [
  "ICAZA Immobilier - SAS au capital de 25 000 € - 32 avenue de la Paix 13500 Martigues - SIREN 830 042 354 RCS Aix en Provence.",
  "Tél. 04 42 42 80 85   email : icaza@century21.fr",
  "Carte professionnelle CPI 1310 2017 000 020 086 délivrée par la CCI Marseille Provence.",
  "Transaction sur immeuble et fonds de commerce (non détention de fonds), gestion immobilière, syndic.",
  "Garantie financière GALIAN 89 rue de la Boétie 75008 Paris.",
];

export async function genererFactureAgencePdf(d: DonneesFactureAgence): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([W, H]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const T = (txt: string, x: number, yTop: number, o: { size?: number; f?: PDFFont; align?: "left" | "center" | "right"; color?: ReturnType<typeof rgb> } = {}) => {
    const size = o.size ?? 10.5; const f = o.f ?? font; const color = o.color ?? NOIR;
    const w = f.widthOfTextAtSize(txt, size);
    const x2 = o.align === "center" ? x - w / 2 : o.align === "right" ? x - w : x;
    page.drawText(txt, { x: x2, y: H - yTop - size, size, font: f, color });
  };
  const rect = (x: number, yTop: number, w: number, h: number, fill?: ReturnType<typeof rgb>) => {
    page.drawRectangle({ x, y: H - yTop - h, width: w, height: h, borderColor: NOIR, borderWidth: 0.8, color: fill });
  };

  const dateStr = new Date(d.date && d.date > 0 ? d.date : Date.now()).toLocaleDateString("fr-FR");
  const ttc = d.commissionTTC && d.commissionTTC > 0 ? Math.round(d.commissionTTC) : 0;
  const ht = ttc > 0 ? Math.round(ttc / 1.2) : 0;
  const tva = ttc - ht;

  // En-tête agence
  T("CENTURY 21", 40, 36, { size: 20, f: bold, color: OR });
  T("ICAZA Immobilier", 40, 60, { size: 12, f: bold });

  // Client facturé (centré)
  T(d.clientNom || "—", W / 2, 110, { size: 11, f: bold, align: "center" });
  if (d.clientAdresse) T(d.clientAdresse, W / 2, 128, { size: 10.5, align: "center" });

  T(`Martigues, le ${dateStr}`, W / 2, 160, { size: 11, align: "center" });

  // Cadre « Facture n° »
  rect(40, 190, W - 80, 30);
  T(`Facture n° ${d.numero || "—"}`, 60, 198, { size: 13, f: bold });

  // Tableau honoraires
  const tblY = 240, rowH = 150;
  const cols = [40, 95, 150, 360, 460, W - 40]; // bornes x : Réf | Qté | Description | PU HT | Montant HT
  // en-tête
  rect(cols[0], tblY, cols[5] - cols[0], 26);
  for (let i = 1; i < 5; i++) page.drawLine({ start: { x: cols[i], y: H - tblY }, end: { x: cols[i], y: H - tblY - 26 }, thickness: 0.8, color: NOIR });
  const entetes = ["Réf.", "Qté.", "Description", "P.U. € HT", "Montant € HT"];
  const centres = [(cols[0] + cols[1]) / 2, (cols[1] + cols[2]) / 2, (cols[2] + cols[3]) / 2, (cols[3] + cols[4]) / 2, (cols[4] + cols[5]) / 2];
  entetes.forEach((h, i) => T(h, centres[i], tblY + 8, { size: 9.5, f: bold, align: "center" }));
  // ligne
  rect(cols[0], tblY + 26, cols[5] - cols[0], rowH);
  for (let i = 1; i < 5; i++) page.drawLine({ start: { x: cols[i], y: H - tblY - 26 }, end: { x: cols[i], y: H - tblY - 26 - rowH }, thickness: 0.8, color: NOIR });
  T(d.ref || "", centres[0], tblY + 36, { size: 10, align: "center" });
  T("1", centres[1], tblY + 36, { size: 10, align: "center" });
  T("Honoraires de transaction", centres[2], tblY + 40, { size: 10, align: "center" });
  if (d.bien) T(d.bien.slice(0, 40), centres[2], tblY + 58, { size: 9.5, align: "center" });
  T("Signé en l'étude de", centres[2], tblY + 100, { size: 10, align: "center" });
  T(`Maître ${d.notaire || "—"}`, centres[2], tblY + 116, { size: 10, align: "center" });
  T(ht > 0 ? milliers(ht) : "—", cols[5] - 8, tblY + 36, { size: 10, align: "right" });

  // Totaux (bloc droite)
  const totY = tblY + 26 + rowH + 14;
  const tx0 = 360, tx1 = 470, tx2 = W - 40;
  const totaux: [string, string][] = [
    ["Total HT", ht > 0 ? milliers(ht) + " €" : "—"],
    ["TVA 20 %", ht > 0 ? milliers(tva) + " €" : "—"],
    ["Total TTC", ttc > 0 ? milliers(ttc) + " €" : "—"],
  ];
  totaux.forEach(([k, v], i) => {
    const y = totY + i * 22;
    rect(tx0, y, tx1 - tx0, 22); rect(tx1, y, tx2 - tx1, 22);
    T(k, tx0 + 6, y + 6, { size: 10, f: bold });
    T(v, tx2 - 6, y + 6, { size: 10, align: "right" });
  });

  T("Valeur en votre aimable règlement", W / 2, totY + 3 * 22 + 16, { size: 11, align: "center" });

  // Cadre RIB
  const ribY = totY + 3 * 22 + 40;
  rect(40, ribY, W - 80, 86);
  T("Identifiant national de compte bancaire – RIB", 48, ribY + 6, { size: 8.5 });
  const rib = [["Code Banque", "10278"], ["Code guichet", "08977"], ["Numéro de compte", "00020715502"], ["Clé RIB", "82"]];
  let rx = 48; const rw = 95;
  rib.forEach(([h, v]) => {
    rect(rx, ribY + 20, rw, 16); T(h, rx + rw / 2, ribY + 24, { size: 8, f: bold, align: "center" });
    rect(rx, ribY + 36, rw, 16, GRIS); T(v, rx + rw / 2, ribY + 40, { size: 8, f: bold, align: "center" });
    rx += rw;
  });
  T("Domiciliation : CCM MARTIGUES JONQUIERES", 48, ribY + 58, { size: 8.5, f: bold });
  T("IBAN : FR76 1027 8089 7700 0207 1550 282      BIC : CMCIFR2A", 48, ribY + 72, { size: 9, f: bold });

  // Mentions légales (bas de page)
  let my = H - 70;
  for (const m of MENTIONS) { page.drawText(m, { x: 40, y: my, size: 6.8, font, color: NOIR, maxWidth: W - 80 }); my += 10; }

  return pdf.save();
}

// Formate un nom de fichier de facture.
export function nomFichierFacture(numero?: string, client?: string): string {
  const base = [numero ? `Facture ${numero}` : "Facture agence", client].filter(Boolean).join(" - ").replace(/[\\/:*?"<>|\r\n]+/g, " ").trim().slice(0, 120);
  return `${base || "Facture agence"}.pdf`;
}
