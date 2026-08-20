// Score de complétude DÉTERMINISTE du dossier client (0–100 %).
// Aucun LLM : un simple barème pondéré, stable et reproductible, qui mesure la
// richesse des informations fournies et encourage le propriétaire à compléter
// (surtout les photos). Sert d'indicateur de qualité du dossier, pas de prix.

import type { ClientEstimationInput } from "./clientTypes";

interface Critere {
  cle: string;
  points: number;
  rempli: (i: ClientEstimationInput, nbPhotos: number) => boolean;
  conseil: string; // message d'encouragement si non rempli
}

const rempliTexte = (v?: string | null) => !!v && String(v).trim().length > 0;
const rempliNum = (v?: number | null) => typeof v === "number" && v > 0;

const CRITERES: Critere[] = [
  { cle: "adresse", points: 14, rempli: (i) => rempliTexte(i.adresse) && /^\d{5}$/.test(i.codePostal), conseil: "Précisez l'adresse exacte : elle conditionne la recherche des ventes de référence." },
  { cle: "surface", points: 14, rempli: (i) => rempliNum(i.surfaceHabitable), conseil: "Indiquez la surface habitable." },
  { cle: "pieces", points: 8, rempli: (i) => rempliNum(i.nbPieces), conseil: "Renseignez le nombre de pièces." },
  { cle: "chambres", points: 6, rempli: (i) => rempliNum(i.nbChambres), conseil: "Renseignez le nombre de chambres." },
  { cle: "sallesDeBain", points: 4, rempli: (i) => rempliNum(i.nbSallesDeBain), conseil: "Ajoutez le nombre de salles de bain." },
  { cle: "etat", points: 12, rempli: (i) => rempliTexte(i.etat), conseil: "Précisez l'état du bien." },
  { cle: "prestations", points: 8, rempli: (i) => i.prestations.length > 0, conseil: "Cochez les prestations (terrasse, garage, piscine…)." },
  { cle: "dpe", points: 6, rempli: (i) => rempliTexte(i.dpe), conseil: "Ajoutez le DPE si vous le connaissez." },
  { cle: "anneeOuChauffage", points: 4, rempli: (i) => rempliTexte(i.anneeConstruction) || rempliTexte(i.chauffage), conseil: "Indiquez l'année de construction ou le chauffage." },
  { cle: "terrain", points: 4, rempli: (i) => i.typeBien !== "maison" || rempliNum(i.surfaceTerrain), conseil: "Indiquez la surface du terrain." },
  // Photos : jusqu'à 20 points, en 3 paliers pour encourager un dossier fourni.
  { cle: "photo1", points: 6, rempli: (_i, n) => n >= 1, conseil: "Ajoutez au moins une photo représentative." },
  { cle: "photos3", points: 8, rempli: (_i, n) => n >= 3, conseil: "Ajoutez quelques photos supplémentaires (3 minimum recommandé)." },
  { cle: "photos6", points: 6, rempli: (_i, n) => n >= 6, conseil: "Un dossier avec 6 photos ou plus est nettement plus complet." },
];

const TOTAL = CRITERES.reduce((s, c) => s + c.points, 0); // 100

export interface Completude {
  score: number; // 0–100
  manquants: string[]; // conseils pour les critères non remplis, priorité décroissante
}

export function calculerCompletude(input: ClientEstimationInput, nbPhotos: number): Completude {
  let acquis = 0;
  const manquants: { points: number; conseil: string }[] = [];
  for (const c of CRITERES) {
    if (c.rempli(input, nbPhotos)) acquis += c.points;
    else manquants.push({ points: c.points, conseil: c.conseil });
  }
  const score = Math.round((acquis / TOTAL) * 100);
  manquants.sort((a, b) => b.points - a.points);
  return { score, manquants: manquants.map((m) => m.conseil) };
}
