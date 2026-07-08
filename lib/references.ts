import type { DvfSale, PropertyInput, ReferenceDvf } from "./types";

// Sélection déterministe de références DVF : garantit que le tableau des
// comparables du dossier n'est jamais vide dès que des ventes existent,
// même si l'audit IA de la phase 1 a échoué (aucun risque d'invention :
// les lignes proviennent directement des données Etalab).

const TYPE_LOCAL: Partial<Record<PropertyInput["typeBien"], string>> = {
  maison: "Maison",
  appartement: "Appartement",
};

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
    // Écarte les surfaces sans rapport (moins de la moitié / plus du double)
    const close = pool.filter((s) => (s.surface as number) >= surface * 0.5 && (s.surface as number) <= surface * 2);
    if (close.length >= 3) pool = close;
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

  let baseMediane = 0;
  if (refs.length > 0) {
    const m2 = refs.map((r) => r.prix_m2).sort((a, b) => a - b);
    const median =
      m2.length % 2 === 1 ? m2[(m2.length - 1) / 2] : (m2[m2.length / 2 - 1] + m2[m2.length / 2]) / 2;
    baseMediane =
      surface > 0
        ? Math.round((median * surface) / 1000) * 1000
        : Math.round(refs.map((r) => r.prix).sort((a, b) => a - b)[Math.floor(refs.length / 2)] / 1000) * 1000;
  }

  return { references: refs, baseMediane };
}
