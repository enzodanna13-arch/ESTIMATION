export interface PhotoInput {
  name: string;
  mediaType: "image/jpeg" | "image/png" | "image/webp";
  data: string; // base64 sans préfixe data:
}

export interface ComparableListing {
  description: string;
  surface: number | null;
  prix: number | null;
  joursEnLigne: number | null;
}

export interface PropertyInput {
  // Localisation
  adresse: string;
  codePostal: string;
  ville: string;
  quartier: string;

  // Caractéristiques principales
  typeBien: "appartement" | "maison" | "terrain" | "immeuble" | "local";
  surfaceHabitable: number | null;
  surfaceTerrain: number | null;
  nbPieces: number | null;
  nbChambres: number | null;
  nbSallesDeBain: number | null;
  etage: string;
  ascenseur: boolean;
  anneeConstruction: string;

  // État & énergie
  dpe: string;
  ges: string;
  etatGeneral: string;
  travauxAPrevoir: string;
  chauffage: string;

  // Atouts
  exposition: string;
  exterieur: string[];
  stationnement: string;
  cave: boolean;

  // Charges & fiscalité
  chargesCopro: number | null;
  taxeFonciere: number | null;

  // Contexte de vente
  prixSouhaiteVendeur: number | null;
  contexteVente: string;
  commentaires: string;

  // Marché (saisi par le commercial)
  concurrence: ComparableListing[];
  invendus: ComparableListing[];

  photos: PhotoInput[];
}

export interface DvfSale {
  date: string;
  valeurFonciere: number;
  surface: number | null;
  prixM2: number | null;
  typeLocal: string;
  commune: string;
}

export interface EstimationReport {
  prix_estime: number;
  fourchette_basse: number;
  fourchette_haute: number;
  prix_m2: number;
  indice_confiance: number;
  delai_vente_estime: string;
  positionnement_marche: string;
  analyse_dvf: string;
  analyse_concurrence: string;
  analyse_invendus: string;
  analyse_photos: string;
  points_forts: string[];
  points_faibles: string[];
  strategie_commercialisation: string;
  argumentaire_vendeur: string;
}

export interface EstimateResponse {
  report: EstimationReport;
  dvfSales: DvfSale[];
  dvfSource: "api" | "indisponible";
  engine: "ia" | "statistique";
}
