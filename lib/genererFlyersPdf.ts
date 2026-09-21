// Génération d'un PDF A4 des flyers de prospection, sans passer par la fenêtre
// d'impression. Chaque « .flyer-sheet » = une feuille A4. Deux orientations :
// - portrait  : 2 flyers A5 paysage empilés (visuels par défaut) ;
// - landscape : 2 flyers A5 portrait côte à côte (flyer « Juste une visite »).
// Même moteur éprouvé que le dossier (html2canvas-pro → jsPDF), box-sizing
// border-box pour remplir exactement la feuille.

const pause = () => new Promise<void>((r) => (typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame(() => r()) : setTimeout(r, 0)));

export async function genererFlyersPdf(
  nomFichier = "flyers.pdf",
  onProgress?: (fait: number, total: number) => void,
  orientation: "portrait" | "landscape" = "portrait",
): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const doc = document.querySelector<HTMLElement>(".flyers-doc");
  if (!doc) return false;
  const sheets = Array.from(doc.querySelectorAll<HTMLElement>(".flyer-sheet"));
  if (sheets.length === 0) return false;

  const pageL = orientation === "landscape" ? 297 : 210; // largeur mm
  const pageH = orientation === "landscape" ? 210 : 297; // hauteur mm
  const STYLE_CAPTURE = `
    .flyers-doc { transform: none !important; }
    .flyers-doc .flyer-sheet { box-sizing: border-box !important; width: ${pageL}mm !important; min-height: ${pageH}mm !important; height: ${pageH}mm !important; margin: 0 !important; box-shadow: none !important; transform: none !important; }
  `;

  const [{ jsPDF }, html2canvasMod] = await Promise.all([
    import("jspdf"),
    import("html2canvas-pro"),
  ]);
  const html2canvas = (html2canvasMod as unknown as { default: typeof import("html2canvas-pro").default }).default;

  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation, compress: true });
  let premiere = true;

  const transformInit = doc.style.transform;
  doc.style.transform = "none";

  try {
    for (let i = 0; i < sheets.length; i++) {
      onProgress?.(i, sheets.length);
      await pause();

      const canvas = await html2canvas(sheets[i], {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: orientation === "landscape" ? 1160 : 820,
        onclone: (d: Document) => {
          const s = d.createElement("style");
          s.textContent = STYLE_CAPTURE;
          d.head.appendChild(s);
        },
      });

      const pxParMm = canvas.width / pageL;
      const hauteurTotaleMm = canvas.height / pxParMm;
      const img = canvas.toDataURL("image/jpeg", 0.9);
      if (!premiere) pdf.addPage();
      premiere = false;
      if (hauteurTotaleMm <= pageH + 0.5) {
        pdf.addImage(img, "JPEG", 0, 0, pageL, hauteurTotaleMm);
      } else {
        const ratio = pageH / hauteurTotaleMm;
        const largeur = pageL * ratio;
        const x = (pageL - largeur) / 2;
        pdf.addImage(img, "JPEG", x, 0, largeur, pageH);
      }
    }
  } finally {
    doc.style.transform = transformInit;
  }

  onProgress?.(sheets.length, sheets.length);
  pdf.save(nomFichier);
  return true;
}
