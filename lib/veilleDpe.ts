import { list, put } from "@vercel/blob";
import { fetchDpeParBanId } from "./ademe";
import { getEstimationServer, listEstimationsServer } from "./serverHistory";

// VEILLE « MISE EN VENTE » : on croise les adresses des estimations réalisées
// par l'agence avec la base ADEME. Si un DPE est établi sur un bien estimé
// APRÈS l'estimation, c'est un signal fort que le propriétaire prépare la
// vente (souvent sans le dire) → on alerte le négociateur pour qu'il rappelle.

export interface AlerteDpe {
  id: string;              // = estimationId (une alerte par estimation)
  estimationId: string;
  createdAt: number;       // 1re détection
  updatedAt: number;
  adresse: string;
  ville: string;
  codePostal: string;
  negociateur: string;
  client: string;
  dateEstimation: number;
  dpeNumero: string;
  dpeDate: string;         // date d'établissement du DPE (AAAA-MM-JJ)
  dpeClasse: string;       // A..G
  dpeSurface: number | null;
  dpeAdresseBan: string;
  statut: "nouveau" | "vu" | "contacté" | "écarté";
}

const CLE = "veille-dpe/alertes.json";

export async function listAlertesDpe(): Promise<AlerteDpe[]> {
  try {
    const { blobs } = await list({ prefix: CLE, limit: 1 });
    if (blobs.length > 0) {
      const r = await fetch(blobs[0].url, { cache: "no-store" });
      if (r.ok) return (await r.json()) as AlerteDpe[];
    }
  } catch { /* vide par défaut */ }
  return [];
}

async function sauverAlertes(a: AlerteDpe[]): Promise<void> {
  await put(CLE, JSON.stringify(a), { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
}

export async function majStatutAlerteDpe(id: string, statut: AlerteDpe["statut"]): Promise<AlerteDpe[]> {
  const a = await listAlertesDpe();
  const maj = a.map((x) => (x.id === id ? { ...x, statut, updatedAt: Date.now() } : x));
  await sauverAlertes(maj);
  return maj;
}

// Géocodage BAN (adresse → identifiant BAN + code INSEE + score).
interface BanResult { lat: number; lon: number; insee: string; id: string; score: number; label: string; }
async function geocoderBan(adresse: string, codePostal: string, ville: string): Promise<BanResult | null> {
  const q = [adresse, codePostal, ville].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  if (!q) return null;
  try {
    const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=1${/^\d{5}$/.test(codePostal) ? `&postcode=${codePostal}` : ""}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(10_000), headers: { accept: "application/json" } });
    if (!r.ok) return null;
    const d = (await r.json()) as { features?: { properties: { id: string; citycode: string; score: number; label: string }; geometry: { coordinates: [number, number] } }[] };
    const f = d.features?.[0];
    if (!f?.properties?.id) return null;
    return { lon: f.geometry.coordinates[0], lat: f.geometry.coordinates[1], insee: f.properties.citycode, id: f.properties.id, score: f.properties.score, label: f.properties.label };
  } catch { return null; }
}

async function mapLimit<T>(items: T[], limit: number, fn: (x: T) => Promise<void>): Promise<void> {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) { const idx = i++; await fn(items[idx]); }
  }));
}

export interface ResultatVeille { analysees: number; nouvelles: number; total: number }

// Analyse : pour chaque estimation récente, on géocode l'adresse (BAN) puis on
// cherche un DPE établi APRÈS l'estimation. On conserve les alertes existantes
// (et leur statut) et on n'en ajoute/rafraîchit que de nouvelles.
export async function analyserVeilleDpe(opts: { maxEstimations?: number; moisMax?: number } = {}): Promise<ResultatVeille> {
  const moisMax = opts.moisMax ?? 24;
  const limiteDate = Date.now() - moisMax * 30 * 86_400_000;
  const metas = (await listEstimationsServer())
    .filter((m) => m.createdAt >= limiteDate)
    .slice(0, opts.maxEstimations ?? 300);

  const existantes = await listAlertesDpe();
  const parId = new Map<string, AlerteDpe>(existantes.map((a) => [a.estimationId, a]));
  let nouvelles = 0;

  await mapLimit(metas, 5, async (m) => {
    const full = await getEstimationServer(m.id).catch(() => null);
    const inp = full?.input;
    if (!inp) return;
    const adresse = inp.adresse ?? "";
    const codePostal = inp.codePostal ?? "";
    const ville = inp.ville ?? m.ville ?? "";
    if (!adresse && !codePostal) return;

    const ban = await geocoderBan(adresse, codePostal, ville);
    if (!ban || ban.score < 0.5) return;

    const dpes = await fetchDpeParBanId(ban.id).catch(() => []);
    // DPE établi APRÈS l'estimation → signal de mise en vente.
    const apres = dpes
      .filter((d) => { const t = Date.parse(d.dateEtablissement); return Number.isFinite(t) && t > m.createdAt; })
      .sort((a, b) => Date.parse(b.dateEtablissement) - Date.parse(a.dateEtablissement));
    const d = apres[0];
    if (!d) return;

    const prev = parId.get(m.id);
    const memeDpe = prev && prev.dpeNumero === d.numeroDpe;
    if (!memeDpe) nouvelles++;
    parId.set(m.id, {
      id: m.id, estimationId: m.id,
      createdAt: memeDpe ? prev!.createdAt : Date.now(),
      updatedAt: Date.now(),
      adresse: adresse || ban.label, ville, codePostal,
      negociateur: m.negociateur, client: m.client, dateEstimation: m.createdAt,
      dpeNumero: d.numeroDpe, dpeDate: d.dateEtablissement, dpeClasse: d.etiquetteDpe,
      dpeSurface: d.surface, dpeAdresseBan: d.adresse,
      statut: memeDpe ? prev!.statut : "nouveau",
    });
  });

  const alertes = [...parId.values()].sort((a, b) => Date.parse(b.dpeDate) - Date.parse(a.dpeDate));
  await sauverAlertes(alertes);
  return { analysees: metas.length, nouvelles, total: alertes.length };
}
