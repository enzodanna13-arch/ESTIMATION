import { getHistoryKey } from "./history";
import type { BienCriteres } from "./matching";

// Bien NORMALISÉ, toutes sources confondues (estimation / chasse / mandat),
// prêt pour le moteur de rapprochement. Métadonnées d'affichage + critères.
export type SourceBien = "estimation" | "chasse" | "mandat";

export interface BienNormalise {
  id: string; // id interne de la source
  source: SourceBien;
  ref: string; // référence / titre court
  titre: string; // libellé lisible (adresse ou bien)
  ville: string;
  codePostal: string;
  quartier: string;
  typeBien: string;
  prix: number | null;
  surface: number | null;
  nbPieces: number | null;
  negociateur: string;
  vendeur: string; // nom du vendeur / client
  statut: string; // statut (mandat) ou motif (estimation)
  dateMs: number;
  criteres: BienCriteres;
}

export const LABEL_SOURCE: Record<SourceBien, string> = {
  estimation: "Estimation",
  chasse: "Chasse",
  mandat: "Mandat de vente",
};

export async function listBiensRapprochement(): Promise<BienNormalise[]> {
  try {
    const res = await fetch("/api/rapprochement", { cache: "no-store", headers: { "x-history-key": getHistoryKey() } });
    if (!res.ok) return [];
    return ((await res.json()) as { biens?: BienNormalise[] }).biens ?? [];
  } catch { return []; }
}
