// Génération d'un PDF A4 des flyers de prospection (2 flyers A5 par feuille A4),
// sans passer par la fenêtre d'impression. Chaque « .flyer-sheet » = une feuille
// A4. Même moteur éprouvé que le dossier (html2canvas-pro → jsPDF), avec
// box-sizing: border-box pour remplir exactement la feuille.

const A4_L = 210; // mm
const A4_H = 297; // mm

const STYLE_CAPTURE = `
  .flyers-doc { transform: none !important; }
  .flyers-doc .flyer-sheet { box-sizing: border-box !important; width: 210mm !important; min-height: 297mm !important; height: 297mm !important; margin: 0 !important; box-shadow: none !important; transform: none !important; }
`;

const pause = () => new Promise<void>((r) => (typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame(() => r()) : setTimeout(r, 0)));

export async function genererFlyersPdf(
  nomFichier = "flyers.pdf",
  onProgress?: (fait: number, total: number) => void,
): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const doc = document.querySelector<HTMLElement>(".flyers-doc");
  if (!doc) return false;
  const sheets = Array.from(doc.querySelectorAll<HTMLElement>(".flyer-sheet"));
  if (sheets.length === 0) return false;

  const [{ jsPDF }, html2canvasMod] = await Promise.all([
    import("jspdf"),
    import("html2canvas-pro"),
  ]);
  const html2canvas = (html2canvasMod as unknown as { default: typeof import("html2canvas-pro").default }).default;

  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
  let premiere = true;

  // L'aperçu affiche « .flyers-doc » réduit (transform: scale). On neutralise
  // cette réduction sur le vrai DOM le temps de la capture, puis on restaure.
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
      windowWidth: 820,
      onclone: (d: Document) => {
        const s = d.createElement("style");
        s.textContent = STYLE_CAPTURE;
        d.head.appendChild(s);
      },
    });

    const pxParMm = canvas.width / A4_L;
    const hauteurTotaleMm = canvas.height / pxParMm;
    const img = canvas.toDataURL("image/jpeg", 0.9);
    if (!premiere) pdf.addPage();
    premiere = false;
    if (hauteurTotaleMm <= A4_H + 0.5) {
      pdf.addImage(img, "JPEG", 0, 0, A4_L, hauteurTotaleMm);
    } else {
      const ratio = A4_H / hauteurTotaleMm;
      const largeur = A4_L * ratio;
      const x = (A4_L - largeur) / 2;
      pdf.addImage(img, "JPEG", x, 0, largeur, A4_H);
    }
  }

  } finally {
    doc.style.transform = transformInit;
  }

  onProgress?.(sheets.length, sheets.length);
  pdf.save(nomFichier);
  return true;
}
