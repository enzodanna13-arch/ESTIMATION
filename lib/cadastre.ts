// Cadastre IGN (API Carto, open data, sans clé) : parcelle contenant un point
// → superficie FONCIÈRE (contenance) + références cadastrales (section, numéro).
// Utilisé pour compléter la surface habitable (ADEME) par la surface du terrain.

export interface ParcelleCadastre {
  idu: string;         // identifiant unique (ex. 13056000AC0374)
  section: string;     // ex. AC
  numero: string;      // ex. 0374
  codeInsee: string;   // ex. 13056
  commune: string;     // ex. Martigues
  contenance: number | null; // superficie du terrain en m² (foncier)
}

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

// Parcelle cadastrale contenant le point (lat, lon). Renvoie null si aucune
// parcelle ou si le service est indisponible (dégradation propre).
export async function parcelleAuPoint(lat: number, lon: number): Promise<ParcelleCadastre | null> {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  const geom = encodeURIComponent(JSON.stringify({ type: "Point", coordinates: [lon, lat] }));
  const url = `https://apicarto.ign.fr/api/cadastre/parcelle?geom=${geom}&_limit=1`;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(12_000),
      headers: { accept: "application/json", "user-agent": "IA-Estimation/1.0 (CENTURY21 Icaza; chasse)" },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { features?: { properties?: Record<string, unknown> }[] };
    const p = body.features?.[0]?.properties;
    if (!p) return null;
    return {
      idu: String(p.idu ?? ""),
      section: String(p.section ?? ""),
      numero: String(p.numero ?? ""),
      codeInsee: String(p.code_insee ?? ""),
      commune: String(p.nom_com ?? ""),
      contenance: num(p.contenance),
    };
  } catch {
    return null;
  }
}
