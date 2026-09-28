import { verifierAccesEquipe } from "@/lib/historyAuth";
import { fetchDpeCandidats, type DpeBrut } from "@/lib/ademe";
import { getInseeCodes } from "@/lib/dvf";
import { parcelleAuPoint } from "@/lib/cadastre";
import { geoportailUrl, googleMapsUrl, orthophotoUrl, streetViewUrl } from "@/lib/ign";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// IDENTIFICATION d'un bien à vendre : on part des champs connus de l'annonce
// (commune + surface habitable + DPE + type) et on retrouve, via l'ADEME
// (open data, adresse exacte), les adresses candidates — enrichies du foncier
// cadastral (contenance) et d'une orthophoto IGN pour confirmation visuelle.

interface Corps {
  ville?: string;
  codePostal?: string;
  codeInsee?: string;
  surface: number;
  dpe?: string;
  type?: string; // maison | appartement | immeuble
}

const norm = (s: string) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

function anneeDe(iso: string): number | null {
  const m = (iso || "").match(/^(\d{4})/);
  return m ? Number(m[1]) : null;
}

// Confiance 0..100 : surtout la proximité de surface, puis DPE, géocodage,
// fraîcheur du diagnostic et correspondance de la commune.
function scoreCandidat(d: DpeBrut, b: Corps): number {
  let s = 45;
  if (d.surface != null && b.surface > 0) {
    const ecart = Math.abs(d.surface - b.surface) / b.surface;
    s += Math.max(0, 38 * (1 - ecart / 0.1)); // 0 % d'écart → +38 ; ≥10 % → 0
  }
  if (b.dpe && d.etiquetteDpe && d.etiquetteDpe === b.dpe.toUpperCase().slice(0, 1)) s += 8;
  if (d.scoreBan != null) s += d.scoreBan * 5;
  const an = anneeDe(d.dateEtablissement);
  if (an) { const age = new Date().getFullYear() - an; if (age <= 1) s += 6; else if (age <= 2) s += 3; }
  if (b.ville && norm(d.ville).includes(norm(b.ville))) s += 4;
  return Math.round(Math.min(100, Math.max(0, s)));
}

function raisons(d: DpeBrut, b: Corps, contenance: number | null, section: string, numero: string): string[] {
  const r: string[] = [];
  if (d.surface != null) {
    const ecart = b.surface > 0 ? Math.round(Math.abs(d.surface - b.surface)) : null;
    r.push(`Surface ${d.surface} m²${ecart != null ? ` (cible ${b.surface} m², écart ${ecart} m²)` : ""}`);
  }
  if (d.etiquetteDpe) r.push(`DPE ${d.etiquetteDpe}${d.etiquetteGes ? ` · GES ${d.etiquetteGes}` : ""}`);
  const an = anneeDe(d.dateEtablissement);
  if (an) r.push(`Diagnostic ${an}`);
  if (contenance != null) r.push(`Terrain ${contenance} m²`);
  if (section && numero) r.push(`Parcelle ${section} ${numero}`);
  return r;
}

export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  let body: Corps;
  try { body = (await request.json()) as Corps; } catch { return Response.json({ error: "Requête invalide" }, { status: 400 }); }
  if (!(body.surface > 0)) return Response.json({ error: "Renseignez la surface habitable." }, { status: 400 });

  // 1) Résoudre le(s) code(s) INSEE de la commune.
  let insees: string[] = [];
  if (body.codeInsee) insees = [body.codeInsee];
  else if (body.codePostal) insees = await getInseeCodes(body.codePostal.trim()).catch(() => []);
  if (insees.length === 0) return Response.json({ error: "Commune introuvable — renseignez un code postal valide." }, { status: 400 });

  // 2) Récupérer les DPE candidats (adresses) sur ces communes.
  const brut: DpeBrut[] = [];
  const vus = new Set<string>();
  for (const insee of insees.slice(0, 4)) {
    const c = await fetchDpeCandidats(insee, { surface: body.surface, type: body.type, dpe: body.dpe }).catch(() => []);
    for (const d of c) if (!vus.has(d.numeroDpe)) { vus.add(d.numeroDpe); brut.push(d); }
  }

  // 3) Scorer, trier, garder les meilleurs.
  const meilleurs = brut
    .map((d) => ({ d, score: scoreCandidat(d, body) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  // 4) Enrichir chaque candidat du foncier cadastral + liens visuels.
  const candidats = await Promise.all(meilleurs.map(async ({ d, score }) => {
    const geo = d.lat != null && d.lon != null;
    const parcelle = geo ? await parcelleAuPoint(d.lat as number, d.lon as number).catch(() => null) : null;
    return {
      adresse: d.adresse,
      ville: d.ville,
      codePostal: d.codePostal,
      codeInsee: d.codeInsee,
      lat: d.lat,
      lon: d.lon,
      surfaceHabitable: d.surface,
      dpe: d.etiquetteDpe,
      ges: d.etiquetteGes,
      typeBien: d.typeBien,
      dateDpe: d.dateEtablissement,
      scoreBan: d.scoreBan,
      superficieFonciere: parcelle?.contenance ?? null,
      parcelle: parcelle ? { idu: parcelle.idu, section: parcelle.section, numero: parcelle.numero } : null,
      orthophoto: geo ? orthophotoUrl(d.lat as number, d.lon as number) : null,
      geoportail: geo ? geoportailUrl(d.lat as number, d.lon as number) : null,
      streetView: geo ? streetViewUrl(d.lat as number, d.lon as number) : null,
      maps: geo ? googleMapsUrl(d.lat as number, d.lon as number) : null,
      score,
      raisons: raisons(d, body, parcelle?.contenance ?? null, parcelle?.section ?? "", parcelle?.numero ?? ""),
    };
  }));

  return Response.json({ candidats, totalTrouves: brut.length });
}
