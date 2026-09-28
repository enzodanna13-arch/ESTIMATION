import { getHistoryKey } from "./history";

// Client du module « Chasse — Identification » : retrouve les adresses probables
// d'un bien à vendre à partir de ses caractéristiques (croisement ADEME + cadastre
// + orthophoto IGN). Aucune donnée de portail n'est scrapée.

export interface CandidatIdentification {
  adresse: string;
  ville: string;
  codePostal: string;
  codeInsee: string;
  lat: number | null;
  lon: number | null;
  surfaceHabitable: number | null; // ADEME (m²)
  dpe: string;
  ges: string;
  anneeConstruction: number | null; // ADEME
  conso: number | null;        // kWh/m²/an (ADEME)
  emissionGes: number | null;  // kg CO2/m²/an (ADEME)
  energie: string;             // catégorie d'énergie de chauffage
  nbNiveaux: number | null;
  typeBien: string;
  dateDpe: string;
  scoreBan: number | null;
  superficieFonciere: number | null; // cadastre (m²)
  terrainEtat: "in" | "near" | "out" | "unknown" | "na";
  parcelle: { idu: string; section: string; numero: string } | null;
  piscine: boolean | null; // détection sur la vue aérienne (si demandée)
  dateMatch: boolean;      // la date de DPE correspond à celle de l'annonce
  orthophoto: string | null;
  geoportail: string | null;
  streetView: string | null;
  maps: string | null;
  score: number;      // confiance 0..100
  raisons: string[];
}

export interface ExtraitAnnonce {
  type: string; ville: string; codePostal: string;
  surface: number; pieces: number; dpe: string; ges: string;
  surfaceTerrain: number; anneeConstruction: number; prix: number; dateDiagnostic: string;
  consoEnergie: number; emissionGes: number; energieChauffage: string; nbNiveaux: number; indiceLieu: string; typeVoie: string; piscine: boolean;
}

export interface ResultatIdentification {
  candidats: CandidatIdentification[];
  totalTrouves: number;
  extrait?: ExtraitAnnonce | null;
}

export interface ParamsIdentification {
  codePostal?: string;
  ville?: string;
  surface?: number;
  dpe?: string;
  ges?: string;          // classe GES A..G
  anneeConstruction?: number; // année de construction
  type?: string;         // maison | appartement | immeuble
  terrainMin?: number;   // fourchette de superficie du terrain (m²)
  terrainMax?: number;
  piscine?: "avec" | "sans"; // filtre piscine (absent = indifférent)
  dateDiagnostic?: string; // AAAA-MM-JJ si connue
  texte?: string;        // texte d'annonce à faire analyser par l'IA
  pdf?: string;          // fiche PDF (base64 sans préfixe) à faire analyser
}

// Ne lève pas : renvoie l'erreur (et l'éventuel `extrait`) dans l'objet, pour
// pouvoir pré-remplir le formulaire même quand un champ manque.
export async function identifierBien(p: ParamsIdentification): Promise<ResultatIdentification & { error?: string }> {
  const res = await fetch("/api/chasse/identifier", {
    method: "POST",
    headers: { "content-type": "application/json", "x-history-key": getHistoryKey() },
    body: JSON.stringify(p),
  });
  const data = (await res.json().catch(() => ({}))) as ResultatIdentification & { error?: string };
  if (!res.ok) return { candidats: [], totalTrouves: 0, extrait: data.extrait ?? null, error: data.error || "Identification impossible" };
  return data;
}
