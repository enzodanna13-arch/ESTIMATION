import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { MODELE_TRACFIN_B64 } from "./modele";

// Données d'identité reportées sur la fiche Tracfin. Tous les champs sont
// facultatifs : un champ absent laisse simplement l'emplacement vide.
export interface DonneesTracfin {
  dateFiche?: string;
  references?: string;
  nomPrenoms?: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  nationalite?: string;
  situationFamiliale?: string;
  profession?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  dureeDetention?: string;
}

// Emplacements repérés sur le modèle (page 1, origine en bas à gauche, mêmes
// unités que le PDF). x = début de la zone pointillée, y = ligne de base.
const CHAMPS: { cle: keyof DonneesTracfin; x: number; y: number; taille?: number; largeurMax?: number }[] = [
  { cle: "dateFiche", x: 122, y: 729 },
  { cle: "references", x: 152, y: 714, largeurMax: 380 },
  { cle: "nomPrenoms", x: 115, y: 522, largeurMax: 420 },
  { cle: "dateNaissance", x: 154, y: 507, largeurMax: 115 },
  { cle: "lieuNaissance", x: 291, y: 507, largeurMax: 250 },
  { cle: "nationalite", x: 89, y: 492, largeurMax: 440 },
  { cle: "situationFamiliale", x: 121, y: 477, largeurMax: 400 },
  { cle: "profession", x: 87, y: 462, largeurMax: 430 },
  { cle: "adresse", x: 131, y: 447, largeurMax: 410 },
  { cle: "telephone", x: 87, y: 435, largeurMax: 430 },
  { cle: "email", x: 68, y: 420, largeurMax: 450 },
  { cle: "dureeDetention", x: 172, y: 102, largeurMax: 360 },
];

// Tronque un texte pour qu'il tienne dans la largeur disponible (évite le
// débordement sur la colonne voisine).
function ajuster(texte: string, taille: number, largeurMax: number | undefined, font: import("pdf-lib").PDFFont): string {
  if (!largeurMax) return texte;
  let t = texte;
  while (t.length > 1 && font.widthOfTextAtSize(t, taille) > largeurMax) {
    t = t.slice(0, -1);
  }
  return t === texte ? t : t.slice(0, -1) + "…";
}

// Remplit le modèle Tracfin avec les données fournies et renvoie le PDF final.
// Le modèle n'est jamais modifié : on écrit par-dessus (le reste de la fiche —
// notation des risques, mentions légales — reste intact et à valider par
// l'agent).
export async function remplirFicheTracfin(donnees: DonneesTracfin): Promise<Uint8Array> {
  const modele = Buffer.from(MODELE_TRACFIN_B64, "base64");
  const pdf = await PDFDocument.load(modele);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const page = pdf.getPages()[0];
  const couleur = rgb(0.06, 0.09, 0.16);

  for (const champ of CHAMPS) {
    const valeur = (donnees[champ.cle] ?? "").toString().trim();
    if (!valeur) continue;
    const taille = champ.taille ?? 9;
    page.drawText(ajuster(valeur, taille, champ.largeurMax, font), {
      x: champ.x + 3,
      y: champ.y + 1,
      size: taille,
      font,
      color: couleur,
    });
  }
  return pdf.save();
}
