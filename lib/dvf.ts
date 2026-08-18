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
export async function getInseeCodes(codePostal: string): Promise<string[]> {
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
export async function fetchOfficialDvf(insee: string, year: number, typeLocal: string): Promise<DvfSale[]> {
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
  const iNumero = col("adresse_numero");
  const iVoie = col("adresse_nom_voie");
  const iLat = col("latitude");
  const iLon = col("longitude");
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
      adresse: [iNumero >= 0 ? cells[iNumero] : "", iVoie >= 0 ? cells[iVoie] : ""]
        .filter(Boolean)
        .join(" ")
        .trim(),
      lat: iLat >= 0 ? toNumber(cells[iLat]) : null,
      lon: iLon >= 0 ? toNumber(cells[iLon]) : null,
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

/** Géocodage de l'adresse du bien via la Base Adresse Nationale (gratuite). */
async function geocodeAddress(
  adresse: string,
  codePostal: string,
  ville: string,
): Promise<{ lat: number; lon: number; voie: string; numero: string } | null> {
  const q = [adresse, ville].filter(Boolean).join(" ").trim();
  if (!q) return null;
  const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&postcode=${codePostal}&limit=1`;
  const res = await fetchWithTimeout(url, 6000);
  if (!res) return null;
  try {
    const body = (await res.json()) as {
      features?: { geometry?: { coordinates?: number[] }; properties?: { street?: string; name?: string; housenumber?: string } }[];
    };
    const f = body.features?.[0];
    const [lon, lat] = f?.geometry?.coordinates ?? [];
    if (typeof lat !== "number" || typeof lon !== "number") return null;
    return {
      lat,
      lon,
      voie: (f?.properties?.street ?? f?.properties?.name ?? "").toUpperCase(),
      numero: f?.properties?.housenumber ?? "",
    };
  } catch {
    return null;
  }
}

const normVoie = (v: string) =>
  v
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(RUE|AVENUE|AV|BOULEVARD|BD|ALLEE|ALL|CHEMIN|CHE|IMPASSE|IMP|PLACE|PL|ROUTE|RTE)\b\.?/g, "")
    .replace(/[^A-Z0-9]/g, "");

function haversineM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
}

/**
 * Récupère les ventes réelles DVF sur TOUT le code postal (commune entière),
 * millésimes récents en priorité. Si l'adresse du bien est fournie, chaque
 * vente est enrichie de sa distance au bien et la liste est triée par
 * proximité : même adresse (copropriété) d'abord pour un appartement,
 * environs proches pour une maison. Toute erreur renvoie une liste vide.
 */
export async function fetchDvfSales(
  codePostal: string,
  typeBien: string,
  adresse = "",
  ville = "",
): Promise<DvfSale[]> {
  return (await fetchDvfContext(codePostal, typeBien, adresse, ville)).sales;
}

/** Ventes DVF + position géocodée du bien (pour la carte du dossier). */
export async function fetchDvfContext(
  codePostal: string,
  typeBien: string,
  adresse = "",
  ville = "",
): Promise<{ sales: DvfSale[]; subject: { lat: number; lon: number } | null }> {
  if (!/^\d{5}$/.test(codePostal)) return { sales: [], subject: null };
  const typeLocal =
    typeBien === "maison" ? "Maison" : typeBien === "appartement" ? "Appartement" : "";

  const currentYear = new Date().getFullYear();
  const sales: DvfSale[] = [];

  const [inseeCodes, geo] = await Promise.all([
    getInseeCodes(codePostal),
    geocodeAddress(adresse, codePostal, ville),
  ]);
  if (inseeCodes.length > 0) {
    // Millésimes du plus récent jusqu'à 2018 (marché de prix comparable à
    // aujourd'hui) : on remonte tant qu'on n'a pas un vivier suffisant de
    // comparables pour les rayons de proximité serrés (50-500 m).
    const annees: number[] = [];
    for (let y = currentYear; y >= 2018; y--) annees.push(y);
    for (const year of annees) {
      const batches = await Promise.all(inseeCodes.map((insee) => fetchOfficialDvf(insee, year, typeLocal)));
      sales.push(...batches.flat());
      if (sales.length >= 80) break;
    }
  }

  if (sales.length === 0) {
    sales.push(...(await fetchLegacyDvf(codePostal, typeLocal)));
  }

  if (geo) {
    const subjectVoie = normVoie(geo.voie);
    for (const s of sales) {
      s.distanceM = s.lat != null && s.lon != null ? haversineM(geo.lat, geo.lon, s.lat, s.lon) : null;
      const saleVoie = s.adresse ? normVoie(s.adresse.replace(/^\d+\s*/, "")) : "";
      const sameVoie = subjectVoie.length > 2 && saleVoie.includes(subjectVoie);
      const saleNumero = s.adresse?.match(/^\d+/)?.[0] ?? "";
      s.memeAdresse =
        (sameVoie && geo.numero !== "" && saleNumero === geo.numero) ||
        (s.distanceM != null && s.distanceM <= 25);
    }
    // Proximité d'abord (même adresse en tête), puis date récente
    const rank = (s: DvfSale) =>
      s.memeAdresse ? -1 : s.distanceM != null ? s.distanceM : Number.MAX_SAFE_INTEGER;
    sales.sort((a, b) => rank(a) - rank(b) || (a.date < b.date ? 1 : -1));
  } else {
    sales.sort((a, b) => (a.date < b.date ? 1 : -1));
  }
  return { sales: sales.slice(0, 120), subject: geo ? { lat: geo.lat, lon: geo.lon } : null };
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
