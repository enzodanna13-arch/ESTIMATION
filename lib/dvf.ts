import type { DvfSale } from "./types";

const DVF_API_URL = process.env.DVF_API_URL ?? "https://api.cquest.org/dvf";

function toNumber(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function normalizeRecord(raw: Record<string, unknown>): DvfSale | null {
  const props = (raw.properties as Record<string, unknown>) ?? raw;
  const valeur = toNumber(props.valeur_fonciere ?? props.valeurfonc);
  if (!valeur || valeur < 1000) return null;
  const surface = toNumber(props.surface_relle_bati ?? props.surface_reelle_bati ?? props.sbati);
  const prixM2 = surface && surface > 8 ? Math.round(valeur / surface) : null;
  return {
    date: String(props.date_mutation ?? props.datemut ?? ""),
    valeurFonciere: valeur,
    surface,
    prixM2,
    typeLocal: String(props.type_local ?? props.libtyploc ?? ""),
    commune: String(props.commune ?? props.nom_commune ?? ""),
  };
}

/**
 * Interroge l'API DVF publique (transactions immobilières réelles publiées
 * par la DGFiP). L'API est en libre accès et parfois indisponible : toute
 * erreur renvoie simplement une liste vide, l'estimation continue avec les
 * données saisies par le commercial.
 */
export async function fetchDvfSales(
  codePostal: string,
  typeBien: string,
): Promise<DvfSale[]> {
  if (!/^\d{5}$/.test(codePostal)) return [];

  const typeLocal =
    typeBien === "maison" ? "Maison" : typeBien === "appartement" ? "Appartement" : "";
  const url = new URL(DVF_API_URL);
  url.searchParams.set("code_postal", codePostal);
  if (typeLocal) url.searchParams.set("type_local", typeLocal);

  try {
    const res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(10_000),
      headers: { accept: "application/json" },
    });
    if (!res.ok) return [];
    const body: unknown = await res.json();
    const rows: unknown[] = Array.isArray(body)
      ? body
      : ((body as Record<string, unknown>)?.resultats as unknown[]) ??
        ((body as Record<string, unknown>)?.features as unknown[]) ??
        ((body as Record<string, unknown>)?.data as unknown[]) ??
        [];
    const sales = rows
      .map((r) => normalizeRecord(r as Record<string, unknown>))
      .filter((s): s is DvfSale => s !== null)
      .filter((s) => s.prixM2 !== null);
    // Les plus récentes d'abord, plafonné pour tenir dans le prompt
    sales.sort((a, b) => (a.date < b.date ? 1 : -1));
    return sales.slice(0, 60);
  } catch {
    return [];
  }
}

export function medianPrixM2(sales: DvfSale[]): number | null {
  const values = sales
    .map((s) => s.prixM2)
    .filter((v): v is number => v !== null)
    .sort((a, b) => a - b);
  if (values.length === 0) return null;
  const mid = Math.floor(values.length / 2);
  return values.length % 2 ? values[mid] : Math.round((values[mid - 1] + values[mid]) / 2);
}
