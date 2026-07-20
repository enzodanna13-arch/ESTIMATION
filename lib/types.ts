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
  negociateurTel: string;
  negociateurEmail: string;
  negociateurPhoto?: PhotoInput | null; // portrait affiché sur le dossier

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

  // Dépendances (maison) : type + surface
  dependances: { type: string; surface: number | null }[];

  // Charges & fiscalité
  chargesCopro: number | null;
  taxeFonciere: number | null;

  // Mission de l'outil : estimation vente (défaut), audit d'un bien qui ne
  // se vend pas, estimation locative, ou estimation d'un bien vendu loué
  // (prix par la rentabilité nette)
  mission?: "vente" | "audit" | "locatif" | "bienloue";

  // Audit de commercialisation
  prixAffiche?: number | null; // prix actuellement affiché
  moisEnVente?: number | null; // ancienneté de la mise en vente (mois)
  nbVisites?: number | null;
  nbOffres?: number | null;
  baissesPrix?: string; // baisses de prix déjà réalisées
  urlAnnonce?: string; // lien de l'annonce en ligne à auditer

  // Estimation locative
  meuble?: string; // "Vide" | "Meublé"
  loyerSouhaite?: number | null; // loyer envisagé par le propriétaire (€/mois)

  // Bien vendu loué : le prix est fixé par capitalisation du loyer NET
  // (loyer − charges non récupérables − taxe foncière) entre 6 et 8 % net
  loyerActuel?: number | null; // loyer actuellement perçu (€/mois hors charges)
  chargesNonRecuperables?: number | null; // charges propriétaire non récupérables (€/an)

  // Plus-value immobilière (calcul fiscal du dossier bien loué)
  prixAcquisition?: number | null; // prix d'achat du bien (€)
  anneeAcquisition?: number | null; // année d'acquisition
  fraisAcquisitionReels?: number | null; // frais réels (€) — sinon forfait 7,5 %
  travauxRealises?: number | null; // travaux justifiés (€) — sinon forfait 15 % si ≥ 5 ans

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
  adresse?: string; // numéro + voie (fichiers DVF géolocalisés)
  lat?: number | null;
  lon?: number | null;
  distanceM?: number | null; // distance au bien estimé, si adresse géocodée
  memeAdresse?: boolean; // même voie + numéro que le bien (même copropriété)
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
  positionnement: string; // supérieur | équivalent | inférieur (vs le bien estimé)
  invendu: boolean; // en ligne depuis +90 jours, re-publiée ou baissée plusieurs fois
}

export interface AuditConcurrentiel {
  nb_annonces_analysees: number;
  prix_m2_min: number;
  prix_m2_median: number;
  prix_m2_max: number;
  tension_marche: string;
  synthese: string;
}

export interface ScenarioPrix {
  strategie: string; // Vente rapide | Prix optimal | Prix plafond
  prix: number;
  delai: string;
  commentaire: string;
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
  audit_concurrentiel: AuditConcurrentiel;
  scenarios_prix: ScenarioPrix[];
  references_dvf: ReferenceDvf[];
  base_mediane: number;
  ajustements: Ajustement[];
  etapes_commercialisation: string[];
  points_forts: string[];
  points_faibles: string[];
  strategie_commercialisation: string;
  argumentaire_vendeur: string;
  // Estimation locative uniquement
  valeur_venale_indicative?: number; // valeur de vente indicative (rendement)
  rendement_brut?: number; // % annuel brut
  // Audit de commercialisation uniquement
  analyse_annonce?: string; // synthèse de l'audit de l'annonce en ligne
  anciennete_annonce?: string; // ancienneté détectée de l'annonce
  baisses_annonce?: string; // baisses de prix détectées
  recommandations_annonce?: RecommandationAnnonce[];
}

export interface RecommandationAnnonce {
  categorie: string; // Prix | Titre & texte | Photos | Diffusion | Mise en valeur
  constat: string; // ce qui pèche aujourd'hui
  recommandation: string; // l'action concrète à mener
  priorite: string; // haute | moyenne | basse
}

export interface MarketStudy {
  analyse_dvf: string;
  analyse_concurrence: string;
  analyse_invendus: string;
  annonces_concurrentes: CompetitorAd[];
  audit_concurrentiel: AuditConcurrentiel;
  references_dvf: ReferenceDvf[];
  base_mediane: number;
}

export interface EstimateResponse {
  report: EstimationReport;
  dvfSales: DvfSale[];
  dvfSource: "api" | "indisponible";
  engine: "ia" | "statistique";
  subject?: { lat: number; lon: number } | null; // position géocodée du bien (carte)
  input?: PropertyInput; // saisie enrichie par l'annonce (mission audit par lien)
}
