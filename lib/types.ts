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
  // Client vendeur (repris dans le dossier)
  clientCivilite: string;
  clientNom: string;
  clientPrenom: string;
  clientTel: string;
  clientEmail: string;
  horizonVente: string;
  negociateur: string;

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
  travauxAPrevoir: string[];
  chauffage: string;

  // Atouts & environnement
  exposition: string[];
  exterieur: string[];
  stationnement: string;
  cave: boolean;
  vue: string;
  environnement: string;
  luminosite: string;
  cuisine: string;
  menuiseries: string;
  mitoyennete: string;
  equipements: string[];

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

export interface PhotoAnalysis {
  photo: number; // 1 = première photo fournie
  titre: string;
  bons_points: string[];
  defauts: string[];
}

export interface CompetitorAd {
  titre: string;
  url_annonce: string;
  url_photo: string;
  prix: number;
  surface: number;
  prix_m2: number;
  caracteristiques: string;
  anciennete: string;
  source: string;
  comparaison: string;
}

export interface EtatNote {
  categorie: string;
  note: number; // 1 à 5
}

export interface Ajustement {
  libelle: string;
  montant: number; // signé, en euros
}

export interface ReferenceDvf {
  localisation: string;
  detail: string;
  surface: number;
  date: string;
  prix: number;
  prix_m2: number;
}

export interface EstimationReport {
  prix_estime: number;
  fourchette_basse: number;
  fourchette_haute: number;
  prix_m2: number;
  prix_presentation: number;
  description_bien: string;
  indice_confiance: number;
  delai_vente_estime: string;
  positionnement_marche: string;
  analyse_dvf: string;
  analyse_concurrence: string;
  analyse_invendus: string;
  analyse_photos: string;
  analyse_par_photo: PhotoAnalysis[];
  etat_notes: EtatNote[];
  coefficient_etat: string;
  impact_etat: number;
  annonces_concurrentes: CompetitorAd[];
  references_dvf: ReferenceDvf[];
  base_mediane: number;
  ajustements: Ajustement[];
  etapes_commercialisation: string[];
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
