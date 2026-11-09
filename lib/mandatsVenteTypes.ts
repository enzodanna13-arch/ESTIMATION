import type { BienCriteres } from "./matching";

// MANDATS DE VENTE : portefeuille des biens pris en mandat (à vendre), avec
// critères structurés pour le rapprochement acquéreurs. Fichier PARTAGÉ
// client/serveur (aucune dépendance Vercel Blob ici).

export const TYPES_MANDAT = ["Exclusif", "Simple", "Semi-exclusif"] as const;
export const STATUTS_MANDAT = ["Actif", "Sous compromis", "Vendu", "Expiré", "Suspendu"] as const;
export const TYPES_BIEN_MANDAT = ["appartement", "maison", "terrain", "immeuble", "local"] as const;
export const EXTERIEURS_MANDAT = ["terrasse", "balcon", "jardin"] as const;

export interface MandatVente {
  id: string;
  reference: string;
  type: string; // Exclusif | Simple | Semi-exclusif
  statut: string; // Actif | Sous compromis | …
  negociateur: string;
  // Vendeur
  vendeurNom: string;
  vendeurTel: string;
  vendeurEmail: string;
  // Bien
  adresse: string;
  codePostal: string;
  ville: string;
  quartier: string;
  typeBien: string;
  prix: number | null; // prix de présentation
  surface: number | null;
  nbPieces: number | null;
  nbChambres: number | null;
  etage: string;
  ascenseur: boolean;
  exterieurs: string[];
  garage: boolean;
  stationnement: boolean;
  cave: boolean;
  dpe: string;
  travaux: boolean;
  // Géolocalisation (calculée au save) + photos du bien
  lat: number | null;
  lon: number | null;
  photos: { id: string; addedAt: number }[];
  // Mandat
  dateMandat: string; // yyyy-mm-dd
  dateFin: string; // yyyy-mm-dd
  honoraires: number | null;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export function mandatVide(): MandatVente {
  return {
    id: "", reference: "", type: "Exclusif", statut: "Actif", negociateur: "",
    vendeurNom: "", vendeurTel: "", vendeurEmail: "",
    adresse: "", codePostal: "", ville: "Martigues", quartier: "", typeBien: "appartement",
    prix: null, surface: null, nbPieces: null, nbChambres: null, etage: "", ascenseur: false,
    exterieurs: [], garage: false, stationnement: false, cave: false, dpe: "", travaux: false,
    lat: null, lon: null, photos: [],
    dateMandat: "", dateFin: "", honoraires: null, notes: "", createdAt: 0, updatedAt: 0,
  };
}

// Mandat de vente -> bien normalisé pour le moteur de rapprochement.
export function bienDepuisMandat(m: MandatVente): BienCriteres {
  const etageNum = parseInt((m.etage ?? "").replace(/[^0-9]/g, ""), 10);
  return {
    ville: m.ville ?? "",
    codePostal: m.codePostal ?? "",
    quartier: m.quartier ?? "",
    typeBien: m.typeBien ?? "",
    prix: m.prix && m.prix > 0 ? m.prix : null,
    surface: m.surface && m.surface > 0 ? m.surface : null,
    nbPieces: m.nbPieces && m.nbPieces > 0 ? m.nbPieces : null,
    nbChambres: m.nbChambres && m.nbChambres > 0 ? m.nbChambres : null,
    etage: Number.isFinite(etageNum) ? etageNum : null,
    ascenseur: !!m.ascenseur,
    exterieurs: (m.exterieurs ?? []).map((e) => e.toLowerCase()),
    garage: !!m.garage,
    stationnement: !!m.stationnement || !!m.garage,
    cave: !!m.cave,
    dpe: (m.dpe ?? "").toUpperCase().slice(0, 1),
    travaux: !!m.travaux,
  };
}

// Un mandat entre-t-il dans le rapprochement ? (biens encore à vendre)
export const mandatRapprochable = (m: MandatVente): boolean => m.statut === "Actif" || m.statut === "Sous compromis";
