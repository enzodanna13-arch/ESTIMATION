import { verifierAccesEquipe } from "@/lib/historyAuth";
import { fetchDpeCandidats, type DpeBrut } from "@/lib/ademe";
import { getInseeCodes } from "@/lib/dvf";
import { parcelleAuPoint, type ParcelleCadastre } from "@/lib/cadastre";
import { geoportailUrl, googleMapsUrl, orthophotoUrl, streetViewUrl } from "@/lib/ign";
import { detecterPiscine } from "@/lib/piscineVision";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

// IDENTIFICATION d'un bien à vendre : champs connus de l'annonce
// (commune + surface habitable + DPE + type + FOURCHETTE de terrain + piscine)
// → adresses probables via ADEME (adresse), cadastre (surface FONCIÈRE) et
// orthophoto IGN (vue aérienne + détection de piscine).

interface Corps {
  ville?: string;
  codePostal?: string;
  codeInsee?: string;
  surface: number;         // surface habitable cible
  dpe?: string;
  type?: string;           // maison | appartement | immeuble
  terrainMin?: number;     // fourchette de superficie du terrain (m²)
  terrainMax?: number;
  piscine?: boolean;       // détecter la présence d'une piscine sur la vue aérienne
}

const norm = (s: string) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
const anneeDe = (iso: string): number | null => { const m = (iso || "").match(/^(\d{4})/); return m ? Number(m[1]) : null; };

// Exécute `fn` sur chaque élément avec une concurrence bornée.
async function mapLimit<T, R>(items: T[], limit: number, fn: (x: T, i: number) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx], idx); }
  }));
  return out;
}

// Score « surface habitable » (base, hors terrain/piscine).
function scoreHabitable(d: DpeBrut, b: Corps): number {
  let s = 45;
  if (d.surface != null && b.surface > 0) {
    const ecart = Math.abs(d.surface - b.surface) / b.surface;
    s += Math.max(0, 34 * (1 - ecart / 0.1)); // 0 % → +34 ; ≥10 % → 0
  }
  if (b.dpe && d.etiquetteDpe && d.etiquetteDpe === b.dpe.toUpperCase().slice(0, 1)) s += 6;
  if (d.scoreBan != null) s += d.scoreBan * 4;
  const an = anneeDe(d.dateEtablissement);
  if (an) { const age = new Date().getFullYear() - an; if (age <= 1) s += 5; else if (age <= 2) s += 2; }
  if (b.ville && norm(d.ville).includes(norm(b.ville))) s += 3;
  return s;
}

type EtatTerrain = "in" | "near" | "out" | "unknown" | "na";
// Contribution du terrain : la fourchette de superficie foncière est le
// critère le plus discriminant → gros bonus si dedans, pénalité si dehors.
function scoreTerrain(contenance: number | null, min?: number, max?: number): { delta: number; etat: EtatTerrain } {
  if (min == null && max == null) return { delta: 0, etat: "na" };       // pas de filtre terrain
  if (contenance == null) return { delta: -8, etat: "unknown" };          // cadastre indisponible
  const lo = min ?? 0, hi = max ?? Infinity;
  if (contenance >= lo && contenance <= hi) return { delta: 34, etat: "in" };
  const distLo = lo > 0 ? (lo - contenance) / lo : Infinity;
  const distHi = hi < Infinity ? (contenance - hi) / hi : Infinity;
  const near = Math.min(distLo > 0 ? distLo : Infinity, distHi > 0 ? distHi : Infinity);
  if (near <= 0.15) return { delta: 10, etat: "near" };
  return { delta: -32, etat: "out" };
}

function raisons(d: DpeBrut, b: Corps, par: ParcelleCadastre | null, etatT: EtatTerrain, piscine: boolean | null): string[] {
  const r: string[] = [];
  if (d.surface != null) {
    const ecart = b.surface > 0 ? Math.round(Math.abs(d.surface - b.surface)) : null;
    r.push(`Surface hab. ${d.surface} m²${ecart != null ? ` (cible ${b.surface}, écart ${ecart} m²)` : ""}`);
  }
  if (par?.contenance != null) {
    const tag = etatT === "in" ? " ✓ dans la fourchette" : etatT === "near" ? " ~ proche" : etatT === "out" ? " ✗ hors fourchette" : "";
    r.push(`Terrain ${par.contenance} m²${tag}`);
  } else if (etatT === "unknown") r.push("Terrain non trouvé au cadastre");
  if (d.etiquetteDpe) r.push(`DPE ${d.etiquetteDpe}${d.etiquetteGes ? ` · GES ${d.etiquetteGes}` : ""}`);
  const an = anneeDe(d.dateEtablissement);
  if (an) r.push(`Diagnostic ${an}`);
  if (par?.section && par?.numero) r.push(`Parcelle ${par.section} ${par.numero}`);
  if (piscine === true) r.push("🏊 Piscine détectée");
  else if (piscine === false) r.push("Pas de piscine visible");
  return r;
}

export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  let body: Corps;
  try { body = (await request.json()) as Corps; } catch { return Response.json({ error: "Requête invalide" }, { status: 400 }); }
  if (!(body.surface > 0)) return Response.json({ error: "Renseignez la surface habitable." }, { status: 400 });
  const terrainActif = body.terrainMin != null || body.terrainMax != null;

  // 1) Code(s) INSEE.
  let insees: string[] = [];
  if (body.codeInsee) insees = [body.codeInsee];
  else if (body.codePostal) insees = await getInseeCodes(body.codePostal.trim()).catch(() => []);
  if (insees.length === 0) return Response.json({ error: "Commune introuvable — renseignez un code postal valide." }, { status: 400 });

  // 2) Candidats DPE (adresses) par surface habitable + DPE + type.
  const brut: DpeBrut[] = [];
  const vus = new Set<string>();
  for (const insee of insees.slice(0, 4)) {
    const c = await fetchDpeCandidats(insee, { surface: body.surface, type: body.type, dpe: body.dpe, taille: 80 }).catch(() => []);
    for (const d of c) if (!vus.has(d.numeroDpe)) { vus.add(d.numeroDpe); brut.push(d); }
  }

  // 3) Pré-classement par surface habitable, puis on enrichit du cadastre un
  //    lot plus large (nécessaire pour filtrer sur la fourchette de terrain).
  const prelim = brut.map((d) => ({ d, base: scoreHabitable(d, body) })).sort((a, b) => b.base - a.base);
  const aEnrichir = prelim.slice(0, terrainActif ? 28 : 12);
  const enrichis = await mapLimit(aEnrichir, 6, async ({ d, base }) => {
    const par = d.lat != null && d.lon != null ? await parcelleAuPoint(d.lat, d.lon).catch(() => null) : null;
    const t = scoreTerrain(par?.contenance ?? null, body.terrainMin, body.terrainMax);
    const score = Math.round(Math.min(100, Math.max(0, base + t.delta)));
    return { d, par, etatT: t.etat, score };
  });

  // 4) Tri final + on garde les meilleurs.
  const meilleurs = enrichis.sort((a, b) => b.score - a.score).slice(0, 8);

  // 5) Détection de piscine (opt-in) sur la vue aérienne des finalistes.
  let piscines: (boolean | null)[] = meilleurs.map(() => null);
  if (body.piscine) {
    piscines = await mapLimit(meilleurs, 4, async ({ d }) =>
      d.lat != null && d.lon != null ? await detecterPiscine(orthophotoUrl(d.lat, d.lon, { width: 360, height: 360, half: 45 })).catch(() => null) : null,
    );
  }

  const candidats = meilleurs.map(({ d, par, etatT, score }, i) => {
    const geo = d.lat != null && d.lon != null;
    const piscine = piscines[i];
    return {
      adresse: d.adresse, ville: d.ville, codePostal: d.codePostal, codeInsee: d.codeInsee,
      lat: d.lat, lon: d.lon,
      surfaceHabitable: d.surface, dpe: d.etiquetteDpe, ges: d.etiquetteGes, typeBien: d.typeBien,
      dateDpe: d.dateEtablissement, scoreBan: d.scoreBan,
      superficieFonciere: par?.contenance ?? null,
      terrainEtat: etatT,
      parcelle: par ? { idu: par.idu, section: par.section, numero: par.numero } : null,
      piscine,
      orthophoto: geo ? orthophotoUrl(d.lat as number, d.lon as number) : null,
      geoportail: geo ? geoportailUrl(d.lat as number, d.lon as number) : null,
      streetView: geo ? streetViewUrl(d.lat as number, d.lon as number) : null,
      maps: geo ? googleMapsUrl(d.lat as number, d.lon as number) : null,
      score,
      raisons: raisons(d, body, par, etatT, piscine),
    };
  });

  return Response.json({ candidats, totalTrouves: brut.length });
}
