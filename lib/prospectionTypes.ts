// Module PROSPECTION CIBLÉE (« Chasse immobilière »)
// ---------------------------------------------------
// Moteur de prospection : les données Open Data (DPE ADEME, DVF…) sont
// transformées en opportunités qualifiées, scorées, attribuées puis
// organisées en tournées terrain optimisées pour les négociateurs.
//
// Ce fichier ne contient QUE des types et des constantes PURES (aucun import
// Blob / réseau) afin d'être partagé par le client et le serveur.

// ---------------------------------------------------------------------------
// Signal Open Data (ex. apparition d'un DPE). On conserve l'historique des
// signaux d'un même bien pour l'analyse « apprentissage par les résultats ».
export interface SignalDPE {
  numeroDpe: string;
  dateEtablissement: string; // AAAA-MM-JJ (réalisation du DPE)
  dateReception: string;     // publication / réception ADEME
  dateVisite: string;        // visite du diagnostiqueur
  etiquetteDpe: string;      // A..G
  etiquetteGes: string;      // A..G
  source: string;            // ex. "ademe-dpe-existant"
  detecteLe: number;         // 1re détection par IA Estimation (timestamp)
  syncLe: number;            // dernière synchronisation ayant vu ce signal
}

// Passage terrain (résultat d'une prospection).
export interface PassageProspection {
  id: string;
  date: number;
  negociateur: string;
  resultat: string;   // un des STATUTS_PROSPECTION (résultat du passage)
  note: string;
  relanceLe: number | null;
}

// Ligne de détail du score (explicabilité).
export interface LigneScore {
  cle: string;
  label: string;
  points: number;
}

export type NiveauProspection = "tres_prioritaire" | "prioritaire" | "a_travailler" | "faible";
export type Confiance = "haute" | "moyenne" | "faible" | "aucune";

// L'OBJET central : une opportunité de prospection rattachée à un bien.
export interface Opportunite {
  id: string;
  createdAt: number; // 1re détection
  updatedAt: number;

  // --- Identité / déduplication ---
  cleBien: string;         // clé de dédup (parcelle / identifiant BAN / geo+voie)
  identifiantBan: string;  // identifiant BAN quand disponible
  parcelle: string;        // référence cadastrale quand disponible

  // --- Bien ---
  adresse: string;         // adresse complète normalisée
  numero: string;
  voie: string;
  ville: string;
  codePostal: string;
  codeInsee: string;
  lat: number | null;
  lon: number | null;
  typeBien: string;        // maison | appartement
  surface: number | null;  // m²
  periodeConstruction: string;
  dpe: string;             // classe énergie A..G (dernier DPE)
  ges: string;             // classe GES A..G

  // --- Signal principal (dernier DPE) + historique ---
  dpeNumero: string;
  dpeDateEtablissement: string;
  dpeDateReception: string;
  dpeDateVisite: string;
  signaux: SignalDPE[];
  detecteLe: number;       // 1re détection IA Estimation
  syncLe: number;          // dernière synchro
  source: string;

  // --- Enrichissement DVF ---
  dvfDerniereMutationDate: string | null;
  dvfDerniereMutationPrix: number | null;
  dvfNature: string | null;
  dvfSurface: number | null;
  enrichiLe: number | null;

  // --- Fiabilité du rapprochement ---
  confiance: Confiance;
  confianceMotif: string;

  // --- Scoring « potentiel vendeur » ---
  score: number;                 // 0..100
  niveau: NiveauProspection;
  scoreDetail: LigneScore[];
  scoreLe: number;
  penaliteManuelle: number;      // ajustement manuel/automatique (ex. 3e absence)
  // Signaux figés à la détection (pour mesurer la conversion par signal).
  signauxSnapshot: Record<string, number | string | boolean | null>;

  // --- Attribution & prospection ---
  negociateur: string;           // attribution EXCLUSIVE (un seul négociateur)
  statut: string;                // un des STATUTS_PROSPECTION
  passages: PassageProspection[];
  derniereAction: number | null;
  prochaineRelance: number | null;
  nbAbsences: number;

  // --- Conversion (rattachement au CRM existant) ---
  dossierId: string;     // dossier client / prospect
  estimationId: string;  // estimation liée
  leadId: string;        // lead lié
  mandat: boolean;
  vente: boolean;

  // --- Conformité ---
  exclu: boolean;        // opt-out / refus de prospection / à exclure
  exclusMotif: string;

  archived?: boolean;
}

// ---------------------------------------------------------------------------
// Statuts (workflow terrain). Ordre = progression logique.
export const STATUTS_PROSPECTION = [
  "À prospecter",
  "Tournée planifiée",
  "Passage effectué",
  "Absent",
  "Contact établi",
  "À relancer",
  "Projet identifié",
  "RDV estimation",
  "Pas de projet",
  "Refus de prospection",
  "Déjà client",
  "Mandat obtenu",
  "À exclure",
] as const;
export type StatutProspection = (typeof STATUTS_PROSPECTION)[number];

// Résultats rapides d'un passage terrain (boutons « Ma tournée »).
export const RESULTATS_PASSAGE: { statut: StatutProspection; label: string; relanceJours?: number }[] = [
  { statut: "Absent", label: "Absent", relanceJours: 7 },
  { statut: "Contact établi", label: "Contact établi" },
  { statut: "Projet identifié", label: "Projet identifié" },
  { statut: "RDV estimation", label: "RDV estimation" },
  { statut: "Pas de projet", label: "Pas de projet" },
  { statut: "À relancer", label: "À relancer", relanceJours: 15 },
  { statut: "Refus de prospection", label: "Refus" },
];

export const STATUT_PROSPECTION_COULEURS: Record<string, string> = {
  "À prospecter": "bg-slate-100 text-slate-600",
  "Tournée planifiée": "bg-blue-100 text-blue-700",
  "Passage effectué": "bg-cyan-100 text-cyan-700",
  Absent: "bg-amber-100 text-amber-700",
  "Contact établi": "bg-indigo-100 text-indigo-700",
  "À relancer": "bg-orange-100 text-orange-700",
  "Projet identifié": "bg-violet-100 text-violet-700",
  "RDV estimation": "bg-emerald-100 text-emerald-700",
  "Pas de projet": "bg-slate-100 text-slate-500",
  "Refus de prospection": "bg-red-100 text-red-600",
  "Déjà client": "bg-teal-100 text-teal-700",
  "Mandat obtenu": "bg-green-100 text-green-700",
  "À exclure": "bg-red-50 text-red-500",
};

// Statuts « sortis » de la prospection standard (ne rentrent plus en tournée).
export const STATUTS_HORS_TOURNEE = new Set<string>([
  "Projet identifié", "RDV estimation", "Refus de prospection",
  "Déjà client", "Mandat obtenu", "À exclure", "Pas de projet",
]);

export const NIVEAUX_PROSPECTION: Record<NiveauProspection, { label: string; couleur: string; badge: string; ordre: number }> = {
  tres_prioritaire: { label: "Très prioritaire", couleur: "emerald", badge: "bg-emerald-100 text-emerald-700", ordre: 3 },
  prioritaire: { label: "Prioritaire", couleur: "amber", badge: "bg-amber-100 text-amber-700", ordre: 2 },
  a_travailler: { label: "À travailler", couleur: "sky", badge: "bg-sky-100 text-sky-700", ordre: 1 },
  faible: { label: "Faible priorité", couleur: "slate", badge: "bg-slate-100 text-slate-500", ordre: 0 },
};

// ---------------------------------------------------------------------------
// CONFIGURATION (stockée dans Blob : config/prospection.json). Tous les
// coefficients de scoring et seuils sont ici — jamais codés en dur ailleurs.
export interface CommuneSurveillee {
  code: string;        // code INSEE
  nom: string;
  codePostal: string;
  prioritaire?: boolean; // secteur commercial prioritaire (bonus de score)
}

export interface SecteurNegociateur {
  communes: string[];    // codes INSEE couverts
  zones: string;         // description libre des quartiers
  jours: string[];       // jours de prospection (lun..dim)
  maxAdresses: number;   // nb max d'adresses par tournée
  dureeMinutes: number;  // durée disponible par tournée
}

export interface CoefficientsScore {
  nouveauDpe: number;            // +35
  maisonIndividuelle: number;    // +10
  dpeMoins7j: number;            // +15
  dpe8a30j: number;              // +10
  zonePrioritaire: number;       // +10
  mutationAncienneMax: number;   // jusqu'à +10
  mutationAncienneSeuilAns: number; // années pour atteindre le max (ex. 12)
  dpeFouG: number;               // +5
  penaliteProspecteRecent: number;  // -30
  penaliteProspecteJours: number;   // fenêtre (jours) de la pénalité
}

export interface ReglesRelance {
  absent1Jours: number;   // 1re absence → reproposer dans N jours
  absent2Jours: number;   // 2e absence → dans N jours
  absent3Action: "archiver" | "baisser_score"; // 3e absence
  absent3Points: number;  // baisse de score si "baisser_score"
  aRelancerJours: number; // « À relancer » par défaut
}

export interface ProspectionConfig {
  actif: boolean;
  communes: CommuneSurveillee[];
  typesBien: string[];            // ex. ["maison"]
  ageMaxDpeJours: number;         // ne détecter que les DPE récents (<= N jours)
  scoreMin: number;               // seuil d'entrée en tournée
  coefficients: CoefficientsScore;
  seuils: { tresPrioritaire: number; prioritaire: number; aTravailler: number };
  tournee: { maxAdresses: number; dureeMinutes: number; minutesParArret: number; vitesseKmh: number };
  secteurs: Record<string, SecteurNegociateur>; // clé = id membre équipe
  relances: ReglesRelance;
  syncFrequence: string;          // libellé indicatif (ex. "quotidienne")
  seuilNotification: number;      // score au-delà duquel notifier
  updatedAt: number;
}

// Valeurs par défaut — secteur de l'agence (Martigues / étang de Berre / Côte Bleue).
export const CONFIG_PROSPECTION_DEFAUT: ProspectionConfig = {
  actif: false,
  communes: [
    { code: "13056", nom: "Martigues", codePostal: "13500", prioritaire: true },
    { code: "13077", nom: "Port-de-Bouc", codePostal: "13110" },
    { code: "13102", nom: "Saint-Mitre-les-Remparts", codePostal: "13920" },
    { code: "13047", nom: "Istres", codePostal: "13800" },
    { code: "13098", nom: "Sausset-les-Pins", codePostal: "13960", prioritaire: true },
    { code: "13015", nom: "Carry-le-Rouet", codePostal: "13620", prioritaire: true },
  ],
  typesBien: ["maison"],
  ageMaxDpeJours: 120,
  scoreMin: 40,
  coefficients: {
    nouveauDpe: 35,
    maisonIndividuelle: 10,
    dpeMoins7j: 15,
    dpe8a30j: 10,
    zonePrioritaire: 10,
    mutationAncienneMax: 10,
    mutationAncienneSeuilAns: 12,
    dpeFouG: 5,
    penaliteProspecteRecent: -30,
    penaliteProspecteJours: 30,
  },
  seuils: { tresPrioritaire: 80, prioritaire: 60, aTravailler: 40 },
  tournee: { maxAdresses: 18, dureeMinutes: 150, minutesParArret: 5, vitesseKmh: 28 },
  secteurs: {},
  relances: { absent1Jours: 7, absent2Jours: 15, absent3Action: "baisser_score", absent3Points: 20, aRelancerJours: 15 },
  syncFrequence: "quotidienne",
  seuilNotification: 80,
  updatedAt: 0,
};

// ---------------------------------------------------------------------------
// TOURNÉE terrain (générée automatiquement pour un négociateur).
export interface EtapeTournee {
  opportuniteId: string;
  ordre: number;         // 1..N (ordre de passage optimisé)
  adresse: string;
  ville: string;
  lat: number | null;
  lon: number | null;
  typeBien: string;
  surface: number | null;
  dpe: string;
  score: number;
  niveau: NiveauProspection;
  fait: boolean;
  resultat: string;
}

export interface Tournee {
  id: string;
  createdAt: number;
  updatedAt: number;
  date: number;              // jour de la tournée (timestamp minuit)
  negociateur: string;
  etapes: EtapeTournee[];
  distanceKm: number;
  dureeMin: number;
  statut: "planifiee" | "en_cours" | "terminee";
}

// Fabrique d'une opportunité vide/normalisée (jamais de champ undefined).
export function opportuniteVide(partial: Partial<Opportunite>): Opportunite {
  const now = Date.now();
  return {
    id: partial.id ?? `op-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: partial.createdAt ?? now,
    updatedAt: now,
    cleBien: partial.cleBien ?? "",
    identifiantBan: partial.identifiantBan ?? "",
    parcelle: partial.parcelle ?? "",
    adresse: partial.adresse ?? "",
    numero: partial.numero ?? "",
    voie: partial.voie ?? "",
    ville: partial.ville ?? "",
    codePostal: partial.codePostal ?? "",
    codeInsee: partial.codeInsee ?? "",
    lat: partial.lat ?? null,
    lon: partial.lon ?? null,
    typeBien: partial.typeBien ?? "",
    surface: partial.surface ?? null,
    periodeConstruction: partial.periodeConstruction ?? "",
    dpe: partial.dpe ?? "",
    ges: partial.ges ?? "",
    dpeNumero: partial.dpeNumero ?? "",
    dpeDateEtablissement: partial.dpeDateEtablissement ?? "",
    dpeDateReception: partial.dpeDateReception ?? "",
    dpeDateVisite: partial.dpeDateVisite ?? "",
    signaux: partial.signaux ?? [],
    detecteLe: partial.detecteLe ?? now,
    syncLe: partial.syncLe ?? now,
    source: partial.source ?? "",
    dvfDerniereMutationDate: partial.dvfDerniereMutationDate ?? null,
    dvfDerniereMutationPrix: partial.dvfDerniereMutationPrix ?? null,
    dvfNature: partial.dvfNature ?? null,
    dvfSurface: partial.dvfSurface ?? null,
    enrichiLe: partial.enrichiLe ?? null,
    confiance: partial.confiance ?? "moyenne",
    confianceMotif: partial.confianceMotif ?? "",
    score: partial.score ?? 0,
    niveau: partial.niveau ?? "faible",
    scoreDetail: partial.scoreDetail ?? [],
    scoreLe: partial.scoreLe ?? 0,
    penaliteManuelle: partial.penaliteManuelle ?? 0,
    signauxSnapshot: partial.signauxSnapshot ?? {},
    negociateur: partial.negociateur ?? "",
    statut: partial.statut ?? "À prospecter",
    passages: partial.passages ?? [],
    derniereAction: partial.derniereAction ?? null,
    prochaineRelance: partial.prochaineRelance ?? null,
    nbAbsences: partial.nbAbsences ?? 0,
    dossierId: partial.dossierId ?? "",
    estimationId: partial.estimationId ?? "",
    leadId: partial.leadId ?? "",
    mandat: partial.mandat ?? false,
    vente: partial.vente ?? false,
    exclu: partial.exclu ?? false,
    exclusMotif: partial.exclusMotif ?? "",
    archived: partial.archived ?? false,
  };
}

// Type de bâtiment ADEME → type de bien interne.
export function typeBienDepuisAdeme(typeBatiment: string): string {
  const t = (typeBatiment || "").toLowerCase();
  if (t.includes("maison")) return "maison";
  if (t.includes("appartement")) return "appartement";
  if (t.includes("immeuble")) return "immeuble";
  return t || "";
}

export const int = new Intl.NumberFormat("fr-FR");

// Classe Tailwind pour un badge d'étiquette DPE (A..G).
export function dpeCls(dpe: string): string {
  return {
    A: "bg-green-100 text-green-700", B: "bg-green-100 text-green-700", C: "bg-lime-100 text-lime-700",
    D: "bg-yellow-100 text-yellow-700", E: "bg-orange-100 text-orange-700",
    F: "bg-red-100 text-red-600", G: "bg-red-200 text-red-700",
  }[(dpe || "").toUpperCase()] ?? "bg-slate-100 text-slate-500";
}
