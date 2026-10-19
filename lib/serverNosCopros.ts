import { del, list, put } from "@vercel/blob";
import { fetchDpeCommune, type DpeBrut } from "./ademe";
import { dpesAutour, type DpeCopro } from "./serverCopros";
import { listerResidences } from "./syndic/residences";

// « NOS COPROS » : les copropriétés que l'agence gère en syndic (résidences du
// module syndic), géocodées puis croisées avec les DPE récents (ADEME). Un DPE
// dans un de nos immeubles = un propriétaire qui prépare peut-être une vente —
// et comme on gère la copro, on peut l'appeler directement.

export interface NosCopro {
  id: string;
  nom: string;
  adresse: string;
  codePostal: string;
  commune: string;
  lat: number | null;
  lon: number | null;
  dpeCount: number;
  dpeCountPrecis: number;
  dernierDpe: DpeCopro | null;
  dpes: DpeCopro[];
}
export interface NosCoprosDataset { copros: NosCopro[]; nbResidences: number; nbDpeIndexes: number; updatedAt: number; }

const BAN = "https://api-adresse.data.gouv.fr/search/";

async function geocode(adresse: string, cp: string, commune: string): Promise<{ lat: number; lon: number; insee: string } | null> {
  const q = [adresse, cp, commune].filter(Boolean).join(" ").trim();
  if (!q) return null;
  try {
    const url = `${BAN}?q=${encodeURIComponent(q)}&limit=1${/^\d{5}$/.test(cp) ? `&postcode=${cp}` : ""}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(12000), headers: { accept: "application/json" } });
    if (!res.ok) return null;
    const d = (await res.json()) as { features?: { geometry?: { coordinates?: [number, number] }; properties?: { citycode?: string } }[] };
    const f = d.features?.[0];
    const c = f?.geometry?.coordinates;
    if (!c) return null;
    return { lat: c[1], lon: c[0], insee: String(f?.properties?.citycode ?? "") };
  } catch { return null; }
}

export async function computeNosCopros(depuisDate: string): Promise<NosCoprosDataset> {
  const residences = (await listerResidences()).filter((r) => r.actif !== false);
  // Géocodage (en parallèle borné).
  const geo = new Map<string, { lat: number; lon: number; insee: string }>();
  const lots = [...residences];
  const worker = async () => {
    while (lots.length) {
      const r = lots.shift()!;
      const g = await geocode(r.adresse, r.codePostal, r.commune);
      if (g) geo.set(r.id, g);
    }
  };
  await Promise.all(Array.from({ length: 5 }, worker));

  // DPE par commune (INSEE) rencontrée.
  const insees = [...new Set([...geo.values()].map((g) => g.insee).filter(Boolean))];
  const parInsee = new Map<string, DpeBrut[]>();
  await Promise.all(insees.map(async (insee) => {
    const d = await fetchDpeCommune(insee, ["appartement", "immeuble"], depuisDate, { maxPages: 60, taille: 100 }).catch(() => [] as DpeBrut[]);
    parInsee.set(insee, d);
  }));
  const nbDpeIndexes = [...parInsee.values()].reduce((s, a) => s + a.length, 0);

  const copros: NosCopro[] = residences.map((r) => {
    const g = geo.get(r.id);
    const dpes = g ? dpesAutour(g.lat, g.lon, parInsee.get(g.insee) ?? []) : [];
    return {
      id: r.id, nom: r.nom, adresse: r.adresse, codePostal: r.codePostal, commune: r.commune,
      lat: g?.lat ?? null, lon: g?.lon ?? null,
      dpeCount: dpes.length, dpeCountPrecis: dpes.filter((d) => d.precis).length,
      dernierDpe: dpes[0] ?? null, dpes: dpes.slice(0, 60),
    };
  });
  copros.sort((a, b) => (b.dernierDpe?.date ?? "").localeCompare(a.dernierDpe?.date ?? "") || a.nom.localeCompare(b.nom));
  return { copros, nbResidences: residences.length, nbDpeIndexes, updatedAt: Date.now() };
}

// --- Cache Blob ---
const PREFIX = "noscopros~";
const version = (p: string) => { const m = p.match(/~(\d+)\.json$/); return m ? Number(m[1]) : 0; };

export async function getNosCoprosCache(): Promise<NosCoprosDataset | null> {
  const { blobs } = await list({ prefix: PREFIX, limit: 50 });
  if (blobs.length === 0) return null;
  let best = blobs[0];
  for (const b of blobs) if (version(b.pathname) > version(best.pathname)) best = b;
  try { const r = await fetch(best.url, { cache: "no-store" }); return r.ok ? ((await r.json()) as NosCoprosDataset) : null; } catch { return null; }
}
export async function saveNosCoprosCache(ds: NosCoprosDataset): Promise<void> {
  const nom = `${PREFIX}${ds.updatedAt}.json`;
  await put(nom, JSON.stringify(ds), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: PREFIX, limit: 50 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
}
