import { selectionnerComparables, type Fiabilite } from "./comparables";
import { surfaceHabitableTotale } from "./surfaces";
import type { DvfSale, PropertyInput, ReferenceDvf } from "./types";

// Sélection déterministe de références DVF : garantit que le tableau des
// comparables du dossier n'est jamais vide dès que des ventes existent,
// même si l'audit IA de la phase 1 a échoué (aucun risque d'invention :
// les lignes proviennent directement des données Etalab).

/**
 * Médiane des PRIX ACTÉS des références retenues — la définition canonique,
 * partagée entre le tableau des comparables (page Méthodologie) et la base
 * du calcul d'ajustements (page Du marché au prix retenu) pour que les deux
 * pages affichent exactement le même chiffre.
 */
export function medianeReferences(refs: Pick<ReferenceDvf, "prix">[]): number {
  if (refs.length === 0) return 0;
  const sorted = refs.map((r) => r.prix).sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function fmtDate(iso: string): string {
  const [y, m] = iso.split("-");
  return m && y ? `${m}/${y}` : iso;
}

export function buildDvfReferences(
  dvfSales: DvfSale[],
  input: Pick<PropertyInput, "typeBien" | "surfaceHabitable"> & Partial<Pick<PropertyInput, "dependances">>,
): {
  references: ReferenceDvf[];
  baseMediane: number;
  baseM2: number;
  mediineM2: number;
  secteurM2Bas: number;
  secteurM2Haut: number;
  betaSurface: number;
  fiabilite: Fiabilite;
  raisonFiabilite: string;
  nbAberrantes: number;
} {
  // Surface de comparaison = habitable totale (logement principal
  // + dépendances habitables)
  const surface = surfaceHabitableTotale({
    surfaceHabitable: input.surfaceHabitable,
    dependances: input.dependances ?? [],
  });

  const {
    retenues, baseM2, baseMediane, mediineM2, secteurM2Bas, secteurM2Haut,
    betaSurface, fiabilite, raisonFiabilite, nbAberrantes,
  } = selectionnerComparables(dvfSales, { surface, typeBien: input.typeBien });

  // Références affichées : les plus récentes d'abord, enrichies de la distance,
  // du score de similarité et de la raison de la sélection.
  const references: ReferenceDvf[] = [...retenues]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((s) => ({
      localisation: s.adresse ? `${s.adresse}, ${s.commune}` : s.commune,
      detail: `${s.typeLocal} · ${s.surface} m² — vente actée (DVF)${
        s.memeAdresse
          ? " · même adresse"
          : s.distance_m != null
            ? ` · à ${s.distance_m < 1000 ? `${s.distance_m} m` : `${(s.distance_m / 1000).toFixed(1)} km`} du bien`
            : ""
      }`,
      surface: s.surface as number,
      date: fmtDate(s.date),
      prix: Math.round(s.valeurFonciere),
      prix_m2: s.prixM2 as number,
      prix_m2_ajuste: s.prix_m2_ajuste,
      distance_m: s.distance_m,
      meme_adresse: Boolean(s.memeAdresse),
      score: s.score,
      raison: s.raison,
    }));

  // Base = €/m² du micro-marché (ventes les plus proches), CORRIGÉ de la
  // superficie du bien puis appliqué à sa surface. Repli sur la médiane des
  // prix actés si surface inconnue.
  return {
    references,
    baseMediane: baseMediane || medianeReferences(references),
    baseM2: baseM2 || 0,
    mediineM2: mediineM2 || 0,
    secteurM2Bas: secteurM2Bas || 0,
    secteurM2Haut: secteurM2Haut || 0,
    betaSurface,
    fiabilite,
    raisonFiabilite,
    nbAberrantes,
  };
}
