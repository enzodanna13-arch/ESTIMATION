import type { DvfSale } from "./types";

const GEO_API = "https://geo.api.gouv.fr/communes";
const DVF_FILES = "https://files.data.gouv.fr/geo-dvf/latest/csv";
const LEGACY_DVF_API = process.env.DVF_API_URL ?? "https://api.cquest.org/dvf";

function toNumber(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

async function fetchWithTimeout(url: string, ms: number): Promise<Response | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(ms), headers: { accept: "*/*" } });
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

/**
 * Code postal → codes INSEE (API officielle geo.api.gouv.fr).
 * Paris, Lyon et Marseille sont découpés par arrondissement municipal dans
 * les fichiers DVF : on interroge d'abord ce niveau, puis les communes.
 */
async function getInseeCodes(codePostal: string): Promise<string[]> {
  for (const type of ["arrondissement-municipal", ""]) {
    const url = `${GEO_API}?codePostal=${codePostal}&fields=code&format=json${type ? `&type=${type}` : ""}`;
    const res = await fetchWithTimeout(url, 8000);
    if (!res) continue;
    try {
      const body = (await res.json()) as { code?: string }[];
      const codes = body.map((c) => c.code).filter((c): c is string => !!c).slice(0, 3);
      if (codes.length > 0) return codes;
    } catch {
      /* essai suivant */
    }
  }
  return [];
}

/**
 * Source officielle Etalab « DVF géolocalisées » : un CSV par commune et par
 * millésime. Couvre l'intégralité du code postal (commune entière), là où
 * les recherches par quartier peuvent manquer de comparables.
 */
async function fetchOfficialDvf(insee: string, year: number, typeLocal: string): Promise<DvfSale[]> {
  const dep = insee.startsWith("97") ? insee.slice(0, 3) : insee.slice(0, 2);
  const res = await fetchWithTimeout(`${DVF_FILES}/${year}/communes/${dep}/${insee}.csv`, 15000);
  if (!res) return [];
  const text = await res.text();
  const lines = text.split("\n");
  if (lines.length < 2) return [];

  const header = lines[0].split(",");
  const col = (name: string) => header.indexOf(name);
  const iId = col("id_mutation");
  const iDate = col("date_mutation");
  const iValeur = col("valeur_fonciere");
  const iType = col("type_local");
  const iSurface = col("surface_reelle_bati");
  const iCommune = col("nom_commune");
  if (iValeur < 0 || iDate < 0) return [];

  // Une mutation peut compter plusieurs lignes (dépendances, lots) :
  // on garde la ligne principale (surface bâtie la plus grande).
  const byMutation = new Map<string, DvfSale & { _surface: number }>();
  for (let l = 1; l < lines.length; l++) {
    const cells = lines[l].split(",");
    if (cells.length < header.length) continue;
    if (typeLocal && cells[iType] !== typeLocal) continue;
    const valeur = toNumber(cells[iValeur]);
    const surface = toNumber(cells[iSurface]);
    if (!valeur || valeur < 5000 || !surface || surface < 9) continue;
    const sale: DvfSale & { _surface: number } = {
      date: cells[iDate],
      valeurFonciere: Math.round(valeur),
      surface: Math.round(surface),
      prixM2: Math.round(valeur / surface),
      typeLocal: cells[iType],
      commune: cells[iCommune] ?? "",
      _surface: surface,
    };
    const key = cells[iId] || `${l}`;
    const existing = byMutation.get(key);
    if (!existing || surface > existing._surface) byMutation.set(key, sale);
  }
  return [...byMutation.values()]
    .filter((s) => s.prixM2 !== null && s.prixM2 > 300 && s.prixM2 < 25000)
    .map(({ _surface: _ignored, ...s }) => s);
}

/** Ancienne API communautaire, gardée en secours si les fichiers officiels échouent. */
async function fetchLegacyDvf(codePostal: string, typeLocal: string): Promise<DvfSale[]> {
  const url = new URL(LEGACY_DVF_API);
  url.searchParams.set("code_postal", codePostal);
  if (typeLocal) url.searchParams.set("type_local", typeLocal);
  const res = await fetchWithTimeout(url.toString(), 8000);
  if (!res) return [];
  try {
    const body: unknown = await res.json();
    const rows: unknown[] = Array.isArray(body)
      ? body
      : ((body as Record<string, unknown>)?.resultats as unknown[]) ??
        ((body as Record<string, unknown>)?.features as unknown[]) ??
        [];
    return rows
      .map((raw) => {
        const props = ((raw as Record<string, unknown>).properties as Record<string, unknown>) ?? (raw as Record<string, unknown>);
        const valeur = toNumber(props.valeur_fonciere);
        const surface = toNumber(props.surface_relle_bati ?? props.surface_reelle_bati);
        if (!valeur || valeur < 5000 || !surface || surface < 9) return null;
        return {
          date: String(props.date_mutation ?? ""),
          valeurFonciere: Math.round(valeur),
          surface: Math.round(surface),
          prixM2: Math.round(valeur / surface),
          typeLocal: String(props.type_local ?? ""),
          commune: String(props.commune ?? ""),
        } as DvfSale;
      })
      .filter((s): s is DvfSale => s !== null);
  } catch {
    return [];
  }
}

/**
 * Récupère les ventes réelles DVF sur TOUT le code postal (commune entière),
 * millésimes récents en priorité, pour garantir des comparables à chaque
 * estimation. Toute erreur renvoie une liste vide : l'estimation continue.
 */
export async function fetchDvfSales(codePostal: string, typeBien: string): Promise<DvfSale[]> {
  if (!/^\d{5}$/.test(codePostal)) return [];
  const typeLocal =
    typeBien === "maison" ? "Maison" : typeBien === "appartement" ? "Appartement" : "";

  const currentYear = new Date().getFullYear();
  const sales: DvfSale[] = [];

  const inseeCodes = await getInseeCodes(codePostal);
  if (inseeCodes.length > 0) {
    // Millésimes du plus récent au plus ancien, jusqu'à avoir assez de comparables
    for (const year of [currentYear, currentYear - 1, currentYear - 2, currentYear - 3]) {
      const batches = await Promise.all(inseeCodes.map((insee) => fetchOfficialDvf(insee, year, typeLocal)));
      sales.push(...batches.flat());
      if (sales.length >= 30) break;
    }
  }

  if (sales.length === 0) {
    sales.push(...(await fetchLegacyDvf(codePostal, typeLocal)));
  }

  sales.sort((a, b) => (a.date < b.date ? 1 : -1));
  return sales.slice(0, 60);
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
