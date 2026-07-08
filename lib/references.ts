import type { DvfSale, PropertyInput, ReferenceDvf } from "./types";

// Sélection déterministe de références DVF : garantit que le tableau des
// comparables du dossier n'est jamais vide dès que des ventes existent,
// même si l'audit IA de la phase 1 a échoué (aucun risque d'invention :
// les lignes proviennent directement des données Etalab).

const TYPE_LOCAL: Partial<Record<PropertyInput["typeBien"], string>> = {
  maison: "Maison",
  appartement: "Appartement",
};

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
  input: Pick<PropertyInput, "typeBien" | "surfaceHabitable">,
): { references: ReferenceDvf[]; baseMediane: number } {
  const surface = input.surfaceHabitable ?? 0;
  const wantedType = TYPE_LOCAL[input.typeBien];

  let pool = dvfSales.filter((s) => s.surface && s.prixM2 && s.prixM2 > 300 && s.prixM2 < 25000);
  if (wantedType) {
    const sameType = pool.filter((s) => s.typeLocal === wantedType);
    if (sameType.length >= 3) pool = sameType;
  }
  if (surface > 0) {
    // Resserre sur des surfaces réellement comparables (±25 %) pour que la
    // médiane des prix actés soit directement représentative du bien ;
    // à défaut, écarte au moins les surfaces sans rapport (½× à 2×)
    const tight = pool.filter((s) => (s.surface as number) >= surface * 0.75 && (s.surface as number) <= surface * 1.25);
    const close = pool.filter((s) => (s.surface as number) >= surface * 0.5 && (s.surface as number) <= surface * 2);
    if (tight.length >= 3) pool = tight;
    else if (close.length >= 3) pool = close;
  }

  const refs = [...pool]
    .sort((a, b) => {
      if (surface > 0) {
        const da = Math.abs((a.surface as number) - surface);
        const db = Math.abs((b.surface as number) - surface);
        if (da !== db) return da - db;
      }
      return b.date.localeCompare(a.date); // plus récent d'abord
    })
    .slice(0, 6)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((s) => ({
      localisation: s.commune,
      detail: `${s.typeLocal} · ${s.surface} m² — vente actée (DVF)`,
      surface: s.surface as number,
      date: fmtDate(s.date),
      prix: Math.round(s.valeurFonciere),
      prix_m2: s.prixM2 as number,
    }));

  // Base = médiane des prix actés des références (le chiffre affiché sous le
  // tableau des comparables) — la transposition à la surface du bien est une
  // ligne d'ajustement, pas un recalcul silencieux de la base.
  return { references: refs, baseMediane: medianeReferences(refs) };
}
