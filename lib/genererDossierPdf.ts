// Génération directe d'un PDF A4 portrait du dossier, SANS passer par la fenêtre
// d'impression du navigateur (donc indépendant des réglages orientation/marges/
// arrière-plans). Chaque section « .page » du dossier est capturée puis posée
// sur une feuille A4 ; une section plus haute qu'une feuille est découpée
// proprement sur la suivante. Les fonds (page de garde noire) sont conservés.

const A4_L = 210; // mm
const A4_H = 297; // mm

// Style forcé pendant la capture : mise en page A4 « comme à l'impression »
// (largeur 210 mm, pleine hauteur, pied de page en bas), quelle que soit la
// taille de l'écran.
const STYLE_CAPTURE = `
  .dossier .page { width: 210mm !important; min-height: 297mm !important; margin: 0 !important; box-shadow: none !important; }
  .dossier .page.cover { min-height: 297mm !important; }
  .dossier .foot { margin-top: auto !important; }
`;

export async function genererDossierPdf(nomFichier = "dossier.pdf"): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const dossier = document.querySelector<HTMLElement>(".dossier");
  if (!dossier) return false;
  const pages = Array.from(dossier.querySelectorAll<HTMLElement>(":scope > .page"));
  if (pages.length === 0) return false;

  const [{ jsPDF }, html2canvasMod] = await Promise.all([
    import("jspdf"),
    import("html2canvas-pro"),
  ]);
  const html2canvas = (html2canvasMod as unknown as { default: typeof import("html2canvas-pro").default }).default;

  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
  let premiere = true;

  for (const el of pages) {
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: 820,
      onclone: (doc: Document) => {
        const s = doc.createElement("style");
        s.textContent = STYLE_CAPTURE;
        doc.head.appendChild(s);
      },
    });

    const pxParMm = canvas.width / A4_L; // pixels par millimètre (largeur A4)
    const hauteurTotaleMm = canvas.height / pxParMm;

    if (hauteurTotaleMm <= A4_H + 0.5) {
      if (!premiere) pdf.addPage();
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, A4_L, hauteurTotaleMm);
      premiere = false;
    } else {
      // Section plus haute qu'une feuille : découpe en tranches A4.
      const trancheHpx = Math.floor(A4_H * pxParMm);
      let y = 0;
      while (y < canvas.height) {
        const h = Math.min(trancheHpx, canvas.height - y);
        const c = document.createElement("canvas");
        c.width = canvas.width;
        c.height = h;
        c.getContext("2d")!.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
        if (!premiere) pdf.addPage();
        pdf.addImage(c.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, A4_L, h / pxParMm);
        premiere = false;
        y += h;
      }
    }
  }

  pdf.save(nomFichier);
  return true;
}
