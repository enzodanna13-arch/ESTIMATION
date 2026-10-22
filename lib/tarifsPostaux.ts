// Grille d'affranchissement — Lettre recommandée France, tarif Entreprise 2026.
// Niveaux R1 / R2 / R3 (niveaux de garantie) + avis de réception (AR).

export type NiveauReco = "R1" | "R2" | "R3";
export const NIVEAUX_RECO: NiveauReco[] = ["R1", "R2", "R3"];

export interface PalierTarif { max: number; libelle: string; R1: number; R2: number; R3: number; }

export const TARIFS_RECO: PalierTarif[] = [
  { max: 20, libelle: "Jusqu'à 20 g", R1: 6.11, R2: 7.29, R3: 8.97 },
  { max: 50, libelle: "Jusqu'à 50 g", R1: 6.98, R2: 8.07, R3: 9.67 },
  { max: 100, libelle: "Jusqu'à 100 g", R1: 7.88, R2: 8.97, R3: 10.54 },
  { max: 250, libelle: "Jusqu'à 250 g", R1: 9.63, R2: 10.73, R3: 12.42 },
  { max: 500, libelle: "Jusqu'à 500 g", R1: 11.32, R2: 12.35, R3: 13.90 },
  { max: 1000, libelle: "Jusqu'à 1 kg", R1: 13.02, R2: 14.11, R3: 15.65 },
  { max: 2000, libelle: "Jusqu'à 2 kg", R1: 15.42, R2: 16.48, R3: 18.18 },
];

export const TARIF_AR = 1.45; // avis de réception

// Affranchissement (hors AR) pour un poids donné et un niveau. null si hors grille.
export function affranchissement(poidsG: number, niveau: NiveauReco): number | null {
  if (!(poidsG > 0)) return null;
  const palier = TARIFS_RECO.find((p) => poidsG <= p.max);
  return palier ? palier[niveau] : null;
}

// Coût total d'un envoi (affranchissement + AR si demandé). null si hors grille.
export function coutEnvoi(poidsG: number, niveau: NiveauReco, avecAR = true): number | null {
  const a = affranchissement(poidsG, niveau);
  if (a == null) return null;
  return Math.round((a + (avecAR ? TARIF_AR : 0)) * 100) / 100;
}

export const euros = (n: number) => `${n.toFixed(2).replace(".", ",")} €`;
