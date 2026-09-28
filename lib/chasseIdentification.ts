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
  typeBien: string;
  dateDpe: string;
  scoreBan: number | null;
  superficieFonciere: number | null; // cadastre (m²)
  parcelle: { idu: string; section: string; numero: string } | null;
  orthophoto: string | null;
  geoportail: string | null;
  streetView: string | null;
  maps: string | null;
  score: number;      // confiance 0..100
  raisons: string[];
}

export interface ResultatIdentification {
  candidats: CandidatIdentification[];
  totalTrouves: number;
}

export interface ParamsIdentification {
  codePostal: string;
  ville?: string;
  surface: number;
  dpe?: string;
  type?: string; // maison | appartement | immeuble
}

export async function identifierBien(p: ParamsIdentification): Promise<ResultatIdentification> {
  const res = await fetch("/api/chasse/identifier", {
    method: "POST",
    headers: { "content-type": "application/json", "x-history-key": getHistoryKey() },
    body: JSON.stringify(p),
  });
  if (!res.ok) {
    const d = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(d.error || "Identification impossible");
  }
  return (await res.json()) as ResultatIdentification;
}
