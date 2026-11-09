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
  lat: number | null;
  lon: number | null;
  photo: string; // URL de la vignette (vide si aucune)
  lien: string; // lien externe éventuel (annonce chasse)
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

// ---- Suivi des correspondances (statut pipeline par paire acquéreur↔bien) ----
export const STATUTS_RAPPRO = ["Nouveau", "À contacter", "Proposé", "Visite", "Refusé", "Accepté"] as const;
export type StatutRappro = (typeof STATUTS_RAPPRO)[number];
export interface SuiviRappro { statut: StatutRappro; note?: string; updatedAt: number }
export type SuiviMap = Record<string, SuiviRappro>;

export const cleSuivi = (acqId: string, source: SourceBien, bienId: string) => `${acqId}|${source}|${bienId}`;

export async function getSuivi(): Promise<SuiviMap> {
  try {
    const res = await fetch("/api/rapprochement/suivi", { cache: "no-store", headers: { "x-history-key": getHistoryKey() } });
    if (!res.ok) return {};
    return ((await res.json()) as { suivi?: SuiviMap }).suivi ?? {};
  } catch { return {}; }
}

export async function setSuivi(cle: string, statut: StatutRappro, note?: string): Promise<SuiviMap> {
  try {
    const res = await fetch("/api/rapprochement/suivi", {
      method: "POST",
      headers: { "content-type": "application/json", "x-history-key": getHistoryKey() },
      body: JSON.stringify({ cle, statut, note }),
    });
    if (!res.ok) return {};
    return ((await res.json()) as { suivi?: SuiviMap }).suivi ?? {};
  } catch { return {}; }
}
