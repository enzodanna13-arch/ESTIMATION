import { fetchOfficialDvf, medianPrixM2 } from "./dvf";
import type { DvfSale } from "./types";

// Veille de zone de chalandise CENTURY 21 Icaza Immobilier — fondée sur la
// SEULE source ouverte fiable : les ventes réelles DVF (Demandes de Valeurs
// Foncières, open data Etalab). Les portails d'annonces (SeLoger, Leboncoin)
// n'exposent aucune API ouverte et bloquent le scraping serveur (DataDome) ;
// la veille s'appuie donc sur le marché ACTÉ, pas sur les annonces en cours.

export interface CommuneZone {
  nom: string;
  insee: string;
  cp: string;
  note?: string;
}

// Zone de chalandise de l'agence (INSEE résolus via geo.api.gouv.fr).
// La Couronne et Carro sont des quartiers de Martigues → couverts par 13056.
export const COMMUNES_ZONE: CommuneZone[] = [
  { nom: "Martigues", insee: "13056", cp: "13500", note: "inclut La Couronne et Carro" },
  { nom: "Port-de-Bouc", insee: "13077", cp: "13110" },
  { nom: "Saint-Mitre-les-Remparts", insee: "13098", cp: "13920" },
  { nom: "Fos-sur-Mer", insee: "13039", cp: "13270" },
  { nom: "Châteauneuf-les-Martigues", insee: "13026", cp: "13220" },
  { nom: "Sausset-les-Pins", insee: "13104", cp: "13960" },
  { nom: "Carry-le-Rouet", insee: "13021", cp: "13620" },
  { nom: "Ensuès-la-Redonne", insee: "13033", cp: "13820" },
];

export interface AperçuCommune {
  nom: string;
  insee: string;
  cp: string;
  note?: string;
  annee: number;
  nbTotal: number;
  nbAppart: number;
  medAppartM2: number | null;
  nbMaison: number;
  medMaisonM2: number | null;
}

export interface VenteZone {
  date: string;
  type: string;
  surface: number;
  prix: number;
  prixM2: number | null;
  adresse: string;
  commune: string;
}

function median(nombres: number[]): number | null {
  if (nombres.length === 0) return null;
  const t = [...nombres].sort((a, b) => a - b);
  const m = Math.floor(t.length / 2);
  return t.length % 2 ? t[m] : Math.round((t[m - 1] + t[m]) / 2);
}

/** Aperçu marché d'une commune pour un millésime : volumes et médianes €/m². */
export async function apercuCommune(c: CommuneZone, annee: number): Promise<AperçuCommune> {
  const ventes = await fetchOfficialDvf(c.insee, annee, "");
  const appart = ventes.filter((v) => v.typeLocal === "Appartement");
  const maison = ventes.filter((v) => v.typeLocal === "Maison");
  return {
    nom: c.nom,
    insee: c.insee,
    cp: c.cp,
    note: c.note,
    annee,
    nbTotal: ventes.length,
    nbAppart: appart.length,
    medAppartM2: medianPrixM2(appart),
    nbMaison: maison.length,
    medMaisonM2: medianPrixM2(maison),
  };
}

/** Ventes récentes d'une commune (les plus récentes d'abord), pour le détail. */
export async function ventesCommune(insee: string, annee: number, limite = 120): Promise<VenteZone[]> {
  const ventes: DvfSale[] = await fetchOfficialDvf(insee, annee, "");
  return ventes
    .filter((v) => v.typeLocal === "Appartement" || v.typeLocal === "Maison")
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limite)
    .map((v) => ({
      date: v.date,
      type: v.typeLocal,
      surface: v.surface ?? 0,
      prix: v.valeurFonciere,
      prixM2: v.prixM2,
      adresse: v.adresse ?? "",
      commune: v.commune,
    }));
}

export { median };
