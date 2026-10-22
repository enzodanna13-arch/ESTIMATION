// Grille d'affranchissement — Lettre recommandée France, tarif Entreprise 2026.
// Niveaux R1 / R2 / R3 (niveaux de garantie) + avis de réception (AR).

export type NiveauReco = "R1" | "R2" | "R3";
export const NIVEAUX_RECO: NiveauReco[] = ["R1", "R2", "R3"];

export interface PalierTarif { max: number; libelle: string; R1: number; R2: number; R3: number; }

export const TARIFS_RECO: PalierTarif[] = [
  { max: 20, libelle: "Jusqu'à 20 g", R1: 5.37, R2: 6.36, R3: 7.81 },
  { max: 50, libelle: "20 à 50 g", R1: 5.97, R2: 6.97, R3: 8.38 },
  { max: 100, libelle: "50 à 100 g", R1: 6.81, R2: 7.75, R3: 9.14 },
  { max: 250, libelle: "100 à 250 g", R1: 8.29, R2: 9.24, R3: 10.66 },
  { max: 500, libelle: "250 à 500 g", R1: 9.68, R2: 10.61, R3: 12.05 },
  { max: 1000, libelle: "500 g à 1 kg", R1: 11.24, R2: 12.18, R3: 13.61 },
  { max: 2000, libelle: "1 kg à 2 kg", R1: 13.21, R2: 14.14, R3: 15.58 },
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
