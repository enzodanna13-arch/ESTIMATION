// Types du SYSTÈME CLIENT (IA Estimation Client) — TOTALEMENT indépendants du
// moteur négociateur (IA Estimation Pro). Le tunnel public collecte un
// sous-ensemble d'informations, que l'on projette ensuite dans le
// PropertyInput partagé pour réutiliser, EN LECTURE SEULE, les libs de
// données (DVF, comparables, références). Aucun champ Pro n'est modifié.

import type { DvfSale, EstimationReport, PhotoInput, PropertyInput } from "./types";

export type TypeBienClient = "maison" | "appartement";

// Intention de projet du propriétaire (étape coordonnées).
export const PROJETS_CLIENT = [
  "Je souhaite vendre rapidement",
  "Vente dans les 3 mois",
  "Vente dans les 6 mois",
  "Vente dans l'année",
  "Je souhaite uniquement connaître la valeur",
  "Autre",
] as const;

// États du bien (étape état) — exploités par le moteur client dans les TEXTES,
// jamais comme ligne d'ajustement chiffrée (méthode « analyse au m² pure »).
export const ETATS_CLIENT = [
  "À rénover entièrement",
  "Travaux importants",
  "État correct",
  "Bon état",
  "Très bon état",
  "Entièrement rénové",
  "Prestations haut de gamme",
] as const;

// Prestations proposées (étape prestations).
export const PRESTATIONS_CLIENT = [
  "Terrasse", "Balcon", "Jardin", "Piscine", "Garage", "Parking", "Cave",
  "Climatisation", "Vue mer", "Vue dégagée", "Dépendance", "Ascenseur",
] as const;

// Paramètres marketing d'origine (Meta/Google Ads…), conservés pour le suivi
// Campagne → Lead → Estimation → RDV → Mandat.
export interface MarketingSource {
  origin?: string; // direct | organique | facebook | instagram | google | email…
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referer?: string;
}

// Une photo du tunnel : base64 + type de pièce éventuel (aide à l'analyse).
export interface PhotoClient extends PhotoInput {
  piece?: string; // Séjour, Cuisine, Façade, Jardin… (facultatif)
}

// Saisie complète du tunnel public.
export interface ClientEstimationInput {
  // Localisation
  adresse: string;
  codePostal: string;
  ville: string;
  quartier?: string;

  // Bien
  typeBien: TypeBienClient;
  surfaceHabitable: number | null;
  surfaceTerrain?: number | null;
  nbPieces: number | null;
  nbChambres: number | null;
  nbSallesDeBain?: number | null;
  nbWc?: number | null;
  etage?: string;
  nbEtages?: number | null;
  ascenseur?: boolean;
  anneeConstruction?: string;
  chauffage?: string;
  dpe?: string;
  exposition?: string;

  // Prestations & état
  prestations: string[];
  etat: string;

  // Coordonnées & projet
  prenom: string;
  nom: string;
  tel: string;
  email: string;
  projet: string;
  souhaiteRappel: boolean;
  consentement: boolean;

  // Marketing & anti-abus (jamais renvoyés au client)
  marketing?: MarketingSource;
  turnstileToken?: string;
}

// Statuts commerciaux d'une estimation client dans le back-office.
export const STATUTS_ESTIMATION_CLIENT = [
  "Nouveau lead",
  "À appeler",
  "Appelé",
  "Pas répondu",
  "À relancer",
  "RDV fixé",
  "Estimation terrain",
  "Mandat obtenu",
  "Perdu",
] as const;

export interface NoteCommerciale {
  id: string;
  date: number;
  auteur: string;
  texte: string;
}

// Métadonnées d'une photo stockée (le binaire vit sur le Blob).
export interface PhotoMeta {
  idx: number;
  piece?: string;
  mediaType: string;
}

// Enregistrement complet côté back-office (source de vérité).
export interface ClientEstimationRecord {
  id: string;
  token: string; // secret, sert l'URL publique du dossier — jamais devinable
  createdAt: number;
  updatedAt: number;
  moteurVersion: string; // ex. "client-1" — traçabilité
  statut: string;
  // Saisie (SANS les binaires photos)
  input: Omit<ClientEstimationInput, "turnstileToken" | "consentement"> & { consentement: boolean };
  photos: PhotoMeta[];
  // Résultat
  report: EstimationReport;
  dvfSource: "api" | "indisponible";
  engine: "ia" | "statistique";
  // De quoi RE-RENDRE le dossier EXACTEMENT comme l'outil négociateur
  // (composant Report.tsx). proInput est stocké SANS les photos base64
  // (rechargées depuis le Blob à l'affichage) pour ne pas alourdir la fiche.
  proInput?: PropertyInput;
  dvfSales?: DvfSale[];
  subject?: { lat: number; lon: number } | null;
  completude: number; // 0–100, déterministe
  confiance: number; // 0–100 (indice de confiance du rapport)
  // Suivi commercial & lien CRM
  leadId?: string;
  notes: NoteCommerciale[];
  marketing?: MarketingSource;
  // Remise du dossier : l'estimation IA reste INTERNE tant que le négociateur
  // ne l'a pas validée et transmise (appel + envoi par mail). Le client ne voit
  // son dossier en ligne qu'une fois transmisAuClient = true.
  transmisAuClient?: boolean;
  envoyeLe?: number | null;
}

// Vue légère pour la liste du back-office.
export interface ClientEstimationMeta {
  id: string;
  createdAt: number;
  updatedAt: number;
  statut: string;
  prenom: string;
  nom: string;
  tel: string;
  email: string;
  ville: string;
  typeBien: string;
  surfaceHabitable: number | null;
  prixEstime: number;
  projet: string;
  souhaiteRappel: boolean;
  origin?: string;
  utm_campaign?: string;
}

// Vue CLIENT (dossier public) : strictement ce que le propriétaire peut voir.
// AUCUNE donnée interne (notes, leadId, marketing, prompts, coûts…).
export interface DossierClientPublic {
  token: string;
  createdAt: number;
  transmis: boolean; // le dossier n'est visible du client qu'une fois transmis
  bien: {
    adresse: string;
    ville: string;
    typeBien: string;
    surfaceHabitable: number | null;
    surfaceTerrain?: number | null;
    nbPieces: number | null;
    nbChambres: number | null;
    etat: string;
    prestations: string[];
  };
  proprietaire: { prenom: string; nom: string };
  report: EstimationReport;
  completude: number;
  confiance: number;
  photos: PhotoMeta[]; // servies via l'API publique par token
}

// Projette la saisie du tunnel dans le PropertyInput partagé, pour réutiliser
// EN LECTURE SEULE fetchDvfContext / buildDvfReferences / surfaces. Les champs
// négociateur/commerciaux sont remplis de valeurs neutres : le moteur client
// n'utilise que la localisation, les caractéristiques et l'état.
export function versPropertyInput(input: ClientEstimationInput, photos: PhotoInput[]): PropertyInput {
  const p = new Set(input.prestations.map((s) => s.toLowerCase()));
  const has = (s: string) => p.has(s.toLowerCase());
  const exterieur = ["Terrasse", "Balcon", "Jardin", "Piscine"].filter(has);
  const equipements = ["Climatisation", "Piscine", "Dépendance"].filter(has);
  const stationnement = has("Garage") ? "Garage" : has("Parking") ? "Parking" : "";
  const vue = has("Vue mer") ? "Vue mer" : has("Vue dégagée") ? "Vue dégagée" : "";

  return {
    clientCivilite: "",
    clientNom: input.nom,
    clientPrenom: input.prenom,
    clientTel: input.tel,
    clientEmail: input.email,
    horizonVente: input.projet,
    negociateur: "",
    negociateurTel: "",
    negociateurEmail: "",
    negociateurPhoto: null,

    adresse: input.adresse,
    codePostal: input.codePostal,
    ville: input.ville,
    quartier: input.quartier ?? "",

    typeBien: input.typeBien,
    surfaceHabitable: input.surfaceHabitable,
    surfaceTerrain: input.surfaceTerrain ?? null,
    nbPieces: input.nbPieces,
    nbChambres: input.nbChambres,
    nbSallesDeBain: input.nbSallesDeBain ?? null,
    etage: input.etage ?? "",
    ascenseur: input.ascenseur ?? has("Ascenseur"),
    anneeConstruction: input.anneeConstruction ?? "",

    dpe: input.dpe ?? "",
    ges: "",
    etatGeneral: input.etat,
    travauxAPrevoir: [],
    chauffage: input.chauffage ?? "",

    exposition: input.exposition ? [input.exposition] : [],
    exterieur,
    stationnement,
    cave: has("Cave"),
    vue,
    environnement: "",
    luminosite: "",
    cuisine: "",
    menuiseries: "",
    mitoyennete: "",
    equipements,
    dependances: has("Dépendance") ? [{ type: "Dépendance", surface: null }] : [],
    chargesCopro: null,
    taxeFonciere: null,

    mission: "vente",

    prixSouhaiteVendeur: null,
    contexteVente: "",
    commentaires: "",
    concurrence: [],
    invendus: [],
    photos,
  };
}
