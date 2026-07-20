import type { LoyerIndicateur } from "./loyers";

/**
 * Niveaux de loyers OFFICIELS de la zone 5 de l'observatoire local des
 * loyers des Bouches-du-Rhône (OLL 13, collecte 2023) — Martigues,
 * Berre-l'Étang, Cuges-les-Pins… C'est LA référence de l'agence pour les
 * estimations locatives du secteur.
 *
 * RÈGLE DE L'AGENCE : la fourchette de loyer va TOUJOURS de la valeur
 * BASSE à la valeur MÉDIANE — le médian est le plafond du loyer conseillé,
 * la valeur haute du tableau n'est qu'informative.
 */
interface LigneOll {
  typologie: string;
  nbEnquetes: number;
  surfaceMoyenne: number;
  basM2: number;
  medianM2: number;
  hautM2: number;
}

const ZONE5: Record<string, LigneOll> = {
  appart1: { typologie: "Appartement 1 pièce", nbEnquetes: 806, surfaceMoyenne: 29, basM2: 13.6, medianM2: 15.7, hautM2: 19.1 },
  appart2: { typologie: "Appartement 2 pièces", nbEnquetes: 1600, surfaceMoyenne: 42, basM2: 12.1, medianM2: 14.1, hautM2: 15.8 },
  appart3: { typologie: "Appartement 3 pièces", nbEnquetes: 1254, surfaceMoyenne: 63, basM2: 10.2, medianM2: 11.5, hautM2: 12.8 },
  appart4: { typologie: "Appartement 4 pièces et +", nbEnquetes: 367, surfaceMoyenne: 87, basM2: 9.4, medianM2: 10.5, hautM2: 11.4 },
  appartTout: { typologie: "Appartement (toutes tailles)", nbEnquetes: 4027, surfaceMoyenne: 52, basM2: 10.8, medianM2: 12.7, hautM2: 15.3 },
  maison: { typologie: "Maison", nbEnquetes: 81, surfaceMoyenne: 74, basM2: 10.5, medianM2: 12.1, hautM2: 15.0 },
  ensemble: { typologie: "Ensemble du parc", nbEnquetes: 4108, surfaceMoyenne: 54, basM2: 10.8, medianM2: 12.6, hautM2: 15.3 },
};

function ligne(typeBien: string, nbPieces: number | null | undefined): LigneOll {
  if (typeBien === "maison") return ZONE5.maison;
  if (typeBien === "appartement") {
    if (!nbPieces) return ZONE5.appartTout;
    if (nbPieces <= 1) return ZONE5.appart1;
    if (nbPieces === 2) return ZONE5.appart2;
    if (nbPieces === 3) return ZONE5.appart3;
    return ZONE5.appart4;
  }
  return ZONE5.ensemble;
}

/**
 * Indicateur de loyer OLL 13 zone 5, appliqué aux communes des
 * Bouches-du-Rhône (le secteur de l'agence). Retourne null hors du 13 —
 * la « carte des loyers » nationale prend alors le relais.
 * Convention LoyerIndicateur : loyerM2 = MÉDIAN, loyerM2Bas = BAS,
 * loyerM2Haut = HAUT (informatif).
 */
export function oll13Indicateur(
  codePostal: string,
  typeBien: string,
  nbPieces: number | null | undefined,
): LoyerIndicateur | null {
  if (!/^13\d{3}$/.test(codePostal ?? "")) return null;
  const l = ligne(typeBien, nbPieces);
  return {
    loyerM2: l.medianM2,
    loyerM2Bas: l.basM2,
    loyerM2Haut: l.hautM2,
    nbAnnonces: l.nbEnquetes,
    typologie: l.typologie,
    millesime: "OLL 13, collecte 2023",
    commune: "Zone 5 — Martigues, Berre-l'Étang, Cuges-les-Pins…",
  };
}
