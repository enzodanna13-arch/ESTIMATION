import { getInseeCodes } from "./dvf";

// « Carte des loyers » officielle (Ministère du Logement, data.gouv.fr) :
// indicateurs de loyers d'annonce par commune, charges comprises, en €/m².
// Utilisée comme base de calcul de l'estimation locative — millésime le
// plus récent d'abord, repli sur le précédent.

export interface LoyerIndicateur {
  loyerM2: number; // loyer d'annonce prédit, €/m²/mois (charges comprises)
  loyerM2Bas: number; // borne basse de l'intervalle de prédiction
  loyerM2Haut: number; // borne haute
  nbAnnonces: number; // nombre d'annonces observées sur la commune
  typologie: string; // libellé de l'indicateur utilisé
  millesime: string; // année du millésime
  commune: string;
}

const DATASETS: { id: string; millesime: string }[] = [
  { id: "693aa2feed1bf4da603faa49", millesime: "2025" },
  { id: "6751be987c09f4be821c6934", millesime: "2024" },
];

// Cache mémoire (persistant entre invocations à chaud sur Vercel)
const csvCache = new Map<string, string>();

async function fetchText(url: string, ms: number): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(ms), headers: { accept: "*/*" } });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

function pickResource(
  resources: { format?: string; title?: string; url?: string }[],
  typeBien: string,
  nbPieces: number | null,
): { url: string; typologie: string } | null {
  const csvs = resources.filter((r) => (r.format ?? "").toLowerCase() === "csv" && r.url);
  const byTitle = (pred: (t: string) => boolean) =>
    csvs.find((r) => pred((r.title ?? "").toLowerCase()));
  if (typeBien === "maison") {
    const r = byTitle((t) => t.includes("maison"));
    return r ? { url: r.url as string, typologie: "maison" } : null;
  }
  // Appartement : typologie la plus fine disponible selon le nombre de pièces
  if (nbPieces != null && nbPieces <= 2) {
    const r = byTitle((t) => t.includes("1 ou 2"));
    if (r) return { url: r.url as string, typologie: "appartement 1-2 pièces" };
  }
  if (nbPieces != null && nbPieces >= 3) {
    const r = byTitle((t) => t.includes("3 pièces"));
    if (r) return { url: r.url as string, typologie: "appartement 3 pièces et plus" };
  }
  const r = byTitle((t) => t.includes("appartement") && !t.includes("1 ou 2") && !t.includes("3 pièces"));
  return r ? { url: r.url as string, typologie: "appartement (toutes typologies)" } : null;
}

const frNum = (v: string) => parseFloat(v.replace(/"/g, "").replace(",", "."));

/**
 * Indicateur officiel de loyer pour la commune du bien. Renvoie null si la
 * source est indisponible — l'estimation continue avec prudence.
 */
export async function fetchLoyerIndicateur(
  codePostal: string,
  typeBien: string,
  nbPieces: number | null,
): Promise<LoyerIndicateur | null> {
  if (!/^\d{5}$/.test(codePostal)) return null;
  if (typeBien !== "maison" && typeBien !== "appartement") return null;

  const inseeCodes = await getInseeCodes(codePostal);
  if (inseeCodes.length === 0) return null;

  for (const ds of DATASETS) {
    const meta = await fetchText(`https://www.data.gouv.fr/api/1/datasets/${ds.id}/`, 8000);
    if (!meta) continue;
    let resources: { format?: string; title?: string; url?: string }[] = [];
    try {
      resources = (JSON.parse(meta) as { resources?: typeof resources }).resources ?? [];
    } catch {
      continue;
    }
    const res = pickResource(resources, typeBien, nbPieces);
    if (!res) continue;

    let csv = csvCache.get(res.url) ?? null;
    if (!csv) {
      csv = await fetchText(res.url, 20000);
      if (csv) csvCache.set(res.url, csv);
    }
    if (!csv) continue;

    const lines = csv.split("\n");
    const header = lines[0].replace(/"/g, "").split(";");
    const iInsee = header.indexOf("INSEE_C");
    const iLib = header.indexOf("LIBGEO");
    const iPred = header.indexOf("loypredm2");
    const iLwr = header.findIndex((h) => h.startsWith("lwr"));
    const iUpr = header.findIndex((h) => h.startsWith("upr"));
    const iNb = header.indexOf("nbobs_com");
    if (iInsee < 0 || iPred < 0) continue;

    for (const insee of inseeCodes) {
      const line = lines.find((l) => l.includes(`"${insee}"`));
      if (!line) continue;
      const cells = line.split(";");
      const loyerM2 = frNum(cells[iPred] ?? "");
      if (!Number.isFinite(loyerM2) || loyerM2 <= 0) continue;
      return {
        loyerM2: Math.round(loyerM2 * 100) / 100,
        loyerM2Bas: iLwr >= 0 ? Math.round(frNum(cells[iLwr]) * 100) / 100 : 0,
        loyerM2Haut: iUpr >= 0 ? Math.round(frNum(cells[iUpr]) * 100) / 100 : 0,
        nbAnnonces: iNb >= 0 ? Math.round(frNum(cells[iNb])) || 0 : 0,
        typologie: res.typologie,
        millesime: ds.millesime,
        commune: iLib >= 0 ? (cells[iLib] ?? "").replace(/"/g, "") : "",
      };
    }
  }
  return null;
}
