import Anthropic from "@anthropic-ai/sdk";
import { verifierAccesEquipe } from "@/lib/historyAuth";
import { fetchDpeCandidats, type DpeBrut } from "@/lib/ademe";
import { getInseeCodes } from "@/lib/dvf";
import { parcelleAuPoint, type ParcelleCadastre } from "@/lib/cadastre";
import { geoportailUrl, googleMapsUrl, orthophotoUrl, streetViewUrl } from "@/lib/ign";
import { detecterPiscine } from "@/lib/piscineVision";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

// IDENTIFICATION d'un bien à vendre : champs connus de l'annonce
// (commune + surface habitable + DPE + type + FOURCHETTE de terrain + piscine
// + DATE de diagnostic) → adresses probables via ADEME (adresse), cadastre
// (surface FONCIÈRE) et orthophoto IGN (vue aérienne + détection de piscine).
// On peut aussi fournir directement le TEXTE de l'annonce : l'IA en extrait
// tous les champs (dont la date de DPE) avant de lancer la recherche.

interface Corps {
  ville?: string;
  codePostal?: string;
  codeInsee?: string;
  surface: number;         // surface habitable cible
  dpe?: string;
  ges?: string;            // classe GES A..G
  anneeConstruction?: number; // année de construction
  type?: string;           // maison | appartement | immeuble
  terrainMin?: number;     // fourchette de superficie du terrain (m²)
  terrainMax?: number;
  piscine?: boolean;       // détecter la présence d'une piscine sur la vue aérienne
  dateDiagnostic?: string; // date d'établissement du DPE si connue (AAAA-MM-JJ)
  // Signaux fins (surtout issus de l'extraction annonce) :
  consoEnergie?: number;   // kWh/m²/an (valeur exacte du DPE)
  emissionGes?: number;    // kg CO2/m²/an (valeur exacte du GES)
  energieChauffage?: string; // gaz | electricite | bois | pac | fioul…
  nbNiveaux?: number;      // niveaux du logement (1 = plain-pied)
  typeVoie?: string;       // rue | impasse | allee | avenue | boulevard | chemin | place
  hintLat?: number;        // point géocodé de l'indice de lieu (rempli serveur)
  hintLon?: number;
  texte?: string;          // texte brut d'une annonce à analyser par l'IA
  pdf?: string;            // fiche PDF (base64, sans préfixe data:) à analyser
}

interface Extrait {
  type: string; ville: string; codePostal: string;
  surface: number; pieces: number; dpe: string; ges: string;
  surfaceTerrain: number; anneeConstruction: number; prix: number; dateDiagnostic: string;
  consoEnergie: number; emissionGes: number; energieChauffage: string; nbNiveaux: number;
  indiceLieu: string; typeVoie: string;
}

// Extraction IA des caractéristiques (dont la DATE de diagnostic) depuis un
// texte d'annonce collé.
const SCHEMA_EXTRAIT = {
  type: "object",
  properties: {
    type: { type: "string", description: "Type de bien en minuscule : maison | appartement | immeuble | terrain | local. Une « villa » = maison. Vide si inconnu." },
    ville: { type: "string", description: "Commune du bien (ex. « Martigues - 13500 » → Martigues). Vide si inconnue." },
    codePostal: { type: "string", description: "Code postal à 5 chiffres (ex. « Martigues - 13500 » → 13500). Vide si inconnu." },
    surface: { type: "number", description: "Surface HABITABLE du logement en m² (nombre seul). C'est la surface du bien lui-même (ex. « Maison: 101 m² » → 101). N'utilise JAMAIS la surface de la terrasse, du jardin ni du terrain. Si le résumé/entête et le texte diffèrent, privilégie la valeur de l'entête. 0 si inconnue." },
    pieces: { type: "number", description: "Nombre de pièces (ex. « 4 pièces » → 4). 0 si inconnu." },
    dpe: { type: "string", description: "Classe DPE / énergie : la lettre A à G qui suit « DPE » (ex. « DPE D » → D). Vide si inconnue." },
    ges: { type: "string", description: "Classe GES / émissions : la lettre A à G qui suit « GES » (ex. « GES B » → B). Vide si inconnue." },
    surfaceTerrain: { type: "number", description: "Surface du TERRAIN / de la parcelle en m² (nombre seul), ex. « Terrain 535 m² » → 535. Prends la valeur chiffrée exacte de l'entête plutôt qu'un « environ » du texte. 0 si inconnue ou non applicable (appartement)." },
    anneeConstruction: { type: "number", description: "Année de construction (4 chiffres), ex. « Construit en 1987 » → 1987. 0 si inconnue." },
    consoEnergie: { type: "number", description: "Consommation énergétique du DPE en kWh/m²/an (nombre seul), si l'annonce donne la valeur chiffrée (ex. « 185 kWh »). 0 si absente." },
    emissionGes: { type: "number", description: "Émissions du GES en kg CO2/m²/an (nombre seul), si l'annonce donne la valeur chiffrée (ex. « 25 kg »). 0 si absente." },
    energieChauffage: { type: "string", description: "Énergie principale de chauffage si mentionnée, en un mot : gaz | electricite | bois | pac | fioul. « poêle à bois » → bois, « pompe à chaleur » → pac. Vide si absente." },
    nbNiveaux: { type: "number", description: "Nombre de niveaux du logement : 1 si de plain-pied, 2 si R+1 / étage, etc. 0 si inconnu." },
    indiceLieu: { type: "string", description: "Nom de quartier ou lieu-dit permettant de localiser (ex. « quartier de Barboussade » → Barboussade). Vide si absent. Ne mets pas un point d'intérêt (parc, école)." },
    typeVoie: { type: "string", description: "Type de voie du bien SEULEMENT s'il est indiqué : rue | impasse | allee | avenue | boulevard | chemin | place. Ex. « au fond d'une impasse » → impasse. Vide sinon." },
    prix: { type: "number", description: "Prix affiché en euros, nombre seul sans espaces (ex. « 499 000 € » → 499000). 0 si inconnu." },
    dateDiagnostic: { type: "string", description: "Date d'établissement du DPE au format AAAA-MM-JJ, UNIQUEMENT si l'annonce donne explicitement la date du DPE/diagnostic (ex. « DPE réalisé le 12/03/2025 », « diagnostic établi le… »). NE PAS utiliser la date de publication de l'annonce (« Publiée le… »), l'année de construction (« Construit en… »), ni une date de visite. Si aucune date de diagnostic n'est explicitement donnée → \"\" (vide). Convertis « 12/03/2025 » ou « 12 mars 2025 » en 2025-03-12." },
  },
  required: ["type", "ville", "codePostal", "surface", "pieces", "dpe", "ges", "surfaceTerrain", "anneeConstruction", "consoEnergie", "emissionGes", "energieChauffage", "nbNiveaux", "indiceLieu", "typeVoie", "prix", "dateDiagnostic"],
} as const;

async function extraireAnnonce(input: { texte?: string; pdf?: string }): Promise<Extrait | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  try {
    const client = new Anthropic();
    const consigne = `Extrais les caractéristiques du bien de cette fiche/annonce immobilière dans le schéma JSON.\nSCHÉMA : ${JSON.stringify(SCHEMA_EXTRAIT)}`;
    const content: Anthropic.ContentBlockParam[] = input.pdf
      ? [{ type: "document", source: { type: "base64", media_type: "application/pdf", data: input.pdf } }, { type: "text", text: consigne }]
      : [{ type: "text", text: `${consigne}\n\nANNONCE :\n${(input.texte ?? "").slice(0, 8000)}` }];
    const msg = await client.messages.create({
      model: process.env.EXTRACT_MODEL ?? "claude-opus-4-8",
      max_tokens: 500,
      system: [
        "Tu extrais les caractéristiques d'un bien depuis une annonce immobilière française (texte ou fiche PDF).",
        "Tu réponds EXCLUSIVEMENT par un objet JSON conforme au schéma, sans commentaire.",
        "Règles STRICTES :",
        "- surface = surface HABITABLE du logement, jamais la terrasse, le jardin ni le terrain.",
        "- surfaceTerrain = superficie de la parcelle (« Terrain X m² »).",
        "- dpe / ges = la lettre A–G qui suit « DPE » / « GES ».",
        "- dateDiagnostic = date du DPE UNIQUEMENT si explicitement donnée ; jamais la date de publication ni l'année de construction ; sinon vide.",
        "- Tu n'inventes jamais : un champ absent reste vide (\"\") ou 0.",
      ].join("\n"),
      messages: [{ role: "user", content }],
    });
    const txt = msg.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("");
    const s = txt.indexOf("{"), e = txt.lastIndexOf("}");
    if (s < 0 || e <= s) return null;
    const r = JSON.parse(txt.slice(s, e + 1)) as Record<string, unknown>;
    const str = (k: string) => (typeof r[k] === "string" ? (r[k] as string).trim() : "");
    const num = (k: string) => (typeof r[k] === "number" && isFinite(r[k] as number) ? (r[k] as number) : 0);
    const dateIso = (() => { const m = str("dateDiagnostic").match(/(\d{4})-(\d{2})-(\d{2})/); return m ? m[0] : ""; })();
    return {
      type: str("type").toLowerCase(), ville: str("ville"), codePostal: str("codePostal"),
      surface: num("surface"), pieces: num("pieces"), dpe: str("dpe").toUpperCase().slice(0, 1), ges: str("ges").toUpperCase().slice(0, 1),
      surfaceTerrain: num("surfaceTerrain"), anneeConstruction: num("anneeConstruction"), prix: num("prix"), dateDiagnostic: dateIso,
      consoEnergie: num("consoEnergie"), emissionGes: num("emissionGes"), energieChauffage: normEnergie(str("energieChauffage")), nbNiveaux: num("nbNiveaux"),
      indiceLieu: str("indiceLieu"), typeVoie: norm(str("typeVoie")),
    };
  } catch { return null; }
}

// Commune → code INSEE à partir du nom (repli quand pas de code postal).
async function inseeDepuisVille(ville: string): Promise<string[]> {
  if (!ville.trim()) return [];
  try {
    const url = `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(ville.trim())}&fields=code&boost=population&limit=1`;
    const r = await fetch(url, { signal: AbortSignal.timeout(8000), headers: { accept: "application/json" } });
    if (!r.ok) return [];
    const d = (await r.json()) as { code?: string }[];
    return d[0]?.code ? [d[0].code] : [];
  } catch { return []; }
}

const norm = (s: string) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
const anneeDe = (iso: string): number | null => { const m = (iso || "").match(/^(\d{4})/); return m ? Number(m[1]) : null; };
const detailNum = (d: DpeBrut, k: string): number | null => { const v = d.details[k]; const n = typeof v === "number" ? v : parseFloat(String(v ?? "").replace(",", ".")); return Number.isFinite(n) ? n : null; };
const detailStr = (d: DpeBrut, k: string): string => { const v = d.details[k]; return v == null ? "" : String(v); };
const consoDe = (d: DpeBrut) => detailNum(d, "conso_5_usages_par_m2_ep") ?? detailNum(d, "conso_5_usages_par_m2_ef");
const emissionDe = (d: DpeBrut) => detailNum(d, "emission_ges_5_usages_par_m2");
const niveauxDe = (d: DpeBrut) => detailNum(d, "nombre_niveau_logement");
// Catégorie d'énergie de chauffage normalisée (pour comparer annonce ⇄ ADEME).
function normEnergie(s: string): string {
  const x = norm(s);
  if (/pompe a chaleur|\bpac\b|aerotherm|geotherm/.test(x)) return "pac";
  if (/bois|granul|pellet|buche|poele/.test(x)) return "bois";
  if (/gaz/.test(x)) return "gaz";
  if (/fioul|mazout/.test(x)) return "fioul";
  if (/elec/.test(x)) return "electricite";
  if (/reseau|urbain/.test(x)) return "reseau";
  return "";
}
function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371, d2r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * d2r, dLon = (b.lon - a.lon) * d2r;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * d2r) * Math.cos(b.lat * d2r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
// Géocode un indice de lieu (quartier / lieu-dit) via la BAN → point approx.
async function geocoderIndice(indice: string, ville: string, codePostal?: string): Promise<{ lat: number; lon: number } | null> {
  const q = [indice, ville].filter(Boolean).join(" ").trim();
  if (q.length < 3) return null;
  try {
    const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=1${codePostal && /^\d{5}$/.test(codePostal) ? `&postcode=${codePostal}` : ""}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(8000), headers: { accept: "application/json" } });
    if (!r.ok) return null;
    const d = (await r.json()) as { features?: { properties: { score: number }; geometry: { coordinates: [number, number] } }[] };
    const f = d.features?.[0];
    if (!f || f.properties.score < 0.3) return null;
    return { lon: f.geometry.coordinates[0], lat: f.geometry.coordinates[1] };
  } catch { return null; }
}

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
  if (b.ges && d.etiquetteGes && d.etiquetteGes === b.ges.toUpperCase().slice(0, 1)) s += 5;
  // Année de construction : critère très discriminant (± tolérance ADEME).
  if (b.anneeConstruction && d.anneeConstruction) {
    const diff = Math.abs(d.anneeConstruction - b.anneeConstruction);
    if (diff === 0) s += 14; else if (diff <= 2) s += 8; else if (diff <= 5) s += 3; else s -= 4;
  }
  // Valeurs EXACTES du DPE (kWh/m²) et GES (kg CO2/m²) : quasi-uniques.
  if (b.consoEnergie) { const dc = consoDe(d); if (dc != null && dc > 0) { const rel = Math.abs(dc - b.consoEnergie) / b.consoEnergie; if (rel <= 0.03) s += 18; else if (rel <= 0.08) s += 8; else s -= 3; } }
  if (b.emissionGes) { const de = emissionDe(d); if (de != null && de > 0) { const rel = Math.abs(de - b.emissionGes) / b.emissionGes; if (rel <= 0.05) s += 14; else if (rel <= 0.12) s += 6; else s -= 2; } }
  // Énergie de chauffage + nombre de niveaux.
  if (b.energieChauffage) { const e = normEnergie(detailStr(d, "type_energie_principale_chauffage")); if (e && e === b.energieChauffage) s += 6; else if (e && e !== b.energieChauffage) s -= 2; }
  if (b.nbNiveaux) { const n = niveauxDe(d); if (n != null) { if (n === b.nbNiveaux) s += 5; else if (Math.abs(n - b.nbNiveaux) === 1) s += 1; } }
  // Type de voie mentionné dans l'annonce (ex. « impasse »).
  if (b.typeVoie && norm(`${d.voie} ${d.adresse}`).includes(b.typeVoie)) s += 6;
  // Proximité de l'indice de lieu (quartier / lieu-dit géocodé).
  if (b.hintLat != null && b.hintLon != null && d.lat != null && d.lon != null) {
    const km = haversineKm({ lat: b.hintLat, lon: b.hintLon }, { lat: d.lat, lon: d.lon });
    if (km <= 0.6) s += 12; else if (km <= 1.2) s += 6; else if (km <= 2) s += 2; else if (km > 4) s -= 4;
  }
  if (d.scoreBan != null) s += d.scoreBan * 4;
  const an = anneeDe(d.dateEtablissement);
  if (an) { const age = new Date().getFullYear() - an; if (age <= 1) s += 5; else if (age <= 2) s += 2; }
  if (b.ville && norm(d.ville).includes(norm(b.ville))) s += 3;
  // DATE de diagnostic (fournie par l'annonce) : signal quasi-unique.
  if (b.dateDiagnostic && d.dateEtablissement) {
    if (d.dateEtablissement === b.dateDiagnostic) s += 45;                                  // date exacte → quasi certain
    else if (d.dateEtablissement.slice(0, 7) === b.dateDiagnostic.slice(0, 7)) s += 18;     // même mois
  }
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
  if (b.consoEnergie) { const c = consoDe(d); if (c != null && c > 0) r.push(`${c} kWh/m²${Math.abs(c - b.consoEnergie) / b.consoEnergie <= 0.03 ? " ✓" : ""}`); }
  if (b.energieChauffage) { const e = normEnergie(detailStr(d, "type_energie_principale_chauffage")); if (e) r.push(`Chauffage ${e}${e === b.energieChauffage ? " ✓" : ""}`); }
  if (b.hintLat != null && b.hintLon != null && d.lat != null && d.lon != null) { const km = haversineKm({ lat: b.hintLat, lon: b.hintLon }, { lat: d.lat, lon: d.lon }); if (km <= 1.2) r.push(`≈ ${km.toFixed(1)} km du secteur visé ✓`); }
  if (d.anneeConstruction) {
    const tag = b.anneeConstruction ? (d.anneeConstruction === b.anneeConstruction ? " ✓" : Math.abs(d.anneeConstruction - b.anneeConstruction) <= 2 ? " ~" : " ✗") : "";
    r.push(`Construit en ${d.anneeConstruction}${tag}`);
  }
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

  // 0) Texte collé OU fiche PDF → l'IA extrait les champs (dont la date de DPE).
  let extrait: Extrait | null = null;
  if (body.pdf || (body.texte && body.texte.trim().length >= 20)) {
    extrait = await extraireAnnonce({ texte: body.texte, pdf: body.pdf }).catch(() => null);
    if (extrait) {
      body = {
        ...body,
        type: body.type || extrait.type || undefined,
        ville: body.ville || extrait.ville || undefined,
        codePostal: body.codePostal || (/^\d{5}$/.test(extrait.codePostal) ? extrait.codePostal : undefined),
        surface: body.surface > 0 ? body.surface : extrait.surface,
        dpe: body.dpe || extrait.dpe || undefined,
        ges: body.ges || extrait.ges || undefined,
        anneeConstruction: body.anneeConstruction || (extrait.anneeConstruction > 1700 ? extrait.anneeConstruction : undefined),
        terrainMin: body.terrainMin ?? (extrait.surfaceTerrain > 0 ? Math.round(extrait.surfaceTerrain * 0.9) : undefined),
        terrainMax: body.terrainMax ?? (extrait.surfaceTerrain > 0 ? Math.round(extrait.surfaceTerrain * 1.1) : undefined),
        dateDiagnostic: body.dateDiagnostic || extrait.dateDiagnostic || undefined,
        consoEnergie: body.consoEnergie ?? (extrait.consoEnergie > 0 ? extrait.consoEnergie : undefined),
        emissionGes: body.emissionGes ?? (extrait.emissionGes > 0 ? extrait.emissionGes : undefined),
        energieChauffage: body.energieChauffage || extrait.energieChauffage || undefined,
        nbNiveaux: body.nbNiveaux ?? (extrait.nbNiveaux > 0 ? extrait.nbNiveaux : undefined),
        typeVoie: body.typeVoie || extrait.typeVoie || undefined,
      };
    }
  }
  // Indice de lieu (quartier / lieu-dit) → point approx pour booster la proximité.
  if (extrait?.indiceLieu) {
    const pt = await geocoderIndice(extrait.indiceLieu, body.ville ?? extrait.ville, body.codePostal).catch(() => null);
    if (pt) { body.hintLat = pt.lat; body.hintLon = pt.lon; }
  }

  if (!(body.surface > 0)) return Response.json({ error: extrait ? "Surface habitable introuvable dans l'annonce — complétez-la." : "Renseignez la surface habitable.", extrait }, { status: 400 });
  const terrainActif = body.terrainMin != null || body.terrainMax != null;

  // 1) Code(s) INSEE : code postal, sinon nom de commune.
  let insees: string[] = [];
  if (body.codeInsee) insees = [body.codeInsee];
  else if (body.codePostal) insees = await getInseeCodes(body.codePostal.trim()).catch(() => []);
  if (insees.length === 0 && body.ville) insees = await inseeDepuisVille(body.ville).catch(() => []);
  if (insees.length === 0) return Response.json({ error: "Commune introuvable — renseignez un code postal.", extrait }, { status: 400 });

  // 2) Candidats DPE (adresses) par surface habitable + DPE + type.
  const brut: DpeBrut[] = [];
  const vus = new Set<string>();
  for (const insee of insees.slice(0, 4)) {
    const c = await fetchDpeCandidats(insee, { surface: body.surface, type: body.type, dpe: body.dpe, ges: body.ges, taille: 80 }).catch(() => []);
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

  // 4) La PISCINE est un FILTRE : on la détecte sur un lot élargi (vue aérienne
  //    IGN), puis on garde soit les biens AVEC piscine (case cochée), soit ceux
  //    SANS piscine (case décochée). On ne masque que les piscines CONFIRMÉES.
  const large = enrichis.sort((a, b) => b.score - a.score).slice(0, 14);
  const piscines = await mapLimit(large, 4, async ({ d }) =>
    d.lat != null && d.lon != null ? await detecterPiscine(orthophotoUrl(d.lat, d.lon, { width: 360, height: 360, half: 45 })).catch(() => null) : null,
  );
  const veutPiscine = body.piscine === true;
  const meilleurs = large
    .map((x, i) => ({ ...x, piscine: piscines[i] }))
    .filter((x) => (veutPiscine ? x.piscine === true : x.piscine !== true))
    .slice(0, 8);

  const candidats = meilleurs.map(({ d, par, etatT, score, piscine }) => {
    const geo = d.lat != null && d.lon != null;
    const dateMatch = !!(body.dateDiagnostic && d.dateEtablissement === body.dateDiagnostic);
    const rs = raisons(d, body, par, etatT, piscine);
    if (dateMatch) rs.unshift("📅 Date de diagnostic identique à l'annonce");
    return {
      adresse: d.adresse, ville: d.ville, codePostal: d.codePostal, codeInsee: d.codeInsee,
      lat: d.lat, lon: d.lon,
      surfaceHabitable: d.surface, dpe: d.etiquetteDpe, ges: d.etiquetteGes, typeBien: d.typeBien,
      anneeConstruction: d.anneeConstruction,
      conso: consoDe(d), emissionGes: emissionDe(d), energie: normEnergie(detailStr(d, "type_energie_principale_chauffage")), nbNiveaux: niveauxDe(d),
      dateDpe: d.dateEtablissement, scoreBan: d.scoreBan,
      superficieFonciere: par?.contenance ?? null,
      terrainEtat: etatT,
      parcelle: par ? { idu: par.idu, section: par.section, numero: par.numero } : null,
      piscine, dateMatch,
      orthophoto: geo ? orthophotoUrl(d.lat as number, d.lon as number) : null,
      geoportail: geo ? geoportailUrl(d.lat as number, d.lon as number) : null,
      streetView: geo ? streetViewUrl(d.lat as number, d.lon as number) : null,
      maps: geo ? googleMapsUrl(d.lat as number, d.lon as number) : null,
      score,
      raisons: rs,
    };
  });

  return Response.json({ candidats, totalTrouves: brut.length, extrait });
}
