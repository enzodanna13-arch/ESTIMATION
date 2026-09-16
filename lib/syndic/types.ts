// Module SYNDIC — modèle de données (stocké sur Vercel Blob, isolé du reste de
// l'outil sous le préfixe « syndic/ »). Aucune donnée du module Estimation
// n'est touchée. Les types Ticket/Événement sont définis dès maintenant pour
// figer le modèle ; leur CRUD arrive au Lot 2.

export type SyndicRole = "accueil" | "gestionnaire_syndic" | "admin";

export const ROLES_LABELS: Record<SyndicRole, string> = {
  accueil: "Accueil",
  gestionnaire_syndic: "Gestionnaire de copropriété",
  admin: "Responsable d'agence",
};

export interface SyndicUser {
  id: string;
  nom: string;
  prenom: string;
  email: string; // identifiant de connexion (unique, minuscules)
  role: SyndicRole;
  telephoneMobile: string; // pour les SMS (Lot 4)
  actif: boolean;
  absentDu: string | null; // YYYY-MM-DD (renvoi vers suppléant)
  absentAu: string | null; // YYYY-MM-DD
  passwordHash: string; // scrypt (hex)
  passwordSalt: string; // hex
  createdAt: number;
  updatedAt: number;
}

// Vue publique d'un utilisateur : jamais de secret exposé au navigateur.
export type SyndicUserPublic = Omit<SyndicUser, "passwordHash" | "passwordSalt">;
export function toPublicUser(u: SyndicUser): SyndicUserPublic {
  const { passwordHash: _h, passwordSalt: _s, ...pub } = u;
  return pub;
}

export interface Residence {
  id: string;
  nom: string;
  adresse: string;
  codePostal: string;
  commune: string;
  gestionnaireTitulaireId: string | null;
  gestionnaireSuppleantId: string | null;
  refExterne: string; // identifiant dans le logiciel de syndic (upsert)
  actif: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface LotSyndic {
  id: string;
  residenceId: string;
  numero: string;
  batiment: string;
  etage: string;
  type: string; // appartement, cave, parking, local…
  refExterne: string;
  createdAt: number;
  updatedAt: number;
}

export type QualiteContact = "proprietaire" | "occupant" | "conseil_syndical";
export const QUALITES_LABELS: Record<QualiteContact, string> = {
  proprietaire: "Propriétaire",
  occupant: "Occupant",
  conseil_syndical: "Membre du conseil syndical",
};

export interface LienLot {
  lotId: string;
  qualite: QualiteContact;
}

export interface ContactSyndic {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  refExterne: string;
  emailVerifie: boolean; // préparé pour la phase 2 (portail copropriétaires)
  liens: LienLot[]; // relation N-N avec les lots (+ qualité)
  createdAt: number;
  updatedAt: number;
}

// --- Tickets (modèle figé maintenant ; CRUD au Lot 2) -----------------------
export type TicketService = "syndic" | "gestion_locative";
export type TicketOrigine =
  | "accueil_telephone" | "accueil_visite" | "mail" | "courrier" | "portail" | "gestionnaire";
export type TicketCategorie =
  | "information" | "demande_document" | "travaux_parties_communes" | "sinistre"
  | "reclamation" | "charges_comptabilite" | "assemblee_generale" | "autre";
export type TicketPriorite = "normale" | "haute" | "urgence";
export type TicketStatut = "nouveau" | "assigne" | "en_cours" | "en_attente" | "clos";

export interface Ticket {
  id: string;
  numero: string; // SYN-2026-000123
  service: TicketService;
  origine: TicketOrigine;
  categorie: TicketCategorie;
  priorite: TicketPriorite;
  statut: TicketStatut;
  residenceId: string | null; // null → file « à qualifier »
  lotId: string | null;
  // Demandeur (contact connu OU saisie libre)
  contactId: string | null;
  demandeurNom: string;
  demandeurTelephone: string;
  demandeurEmail: string;
  demandeurQualite: QualiteContact | "";
  // Contenu
  objet: string;
  description: string;
  creneauRappel: string;
  // Personnes
  assigneA: string | null; // userId
  creePar: string | null; // userId
  // Dates (timestamps ms)
  creeLe: number;
  assigneLe: number | null;
  premiereReponseLe: number | null;
  accuseReceptionLe: number | null;
  echeancePremiereReponse: number | null;
  echeanceResolution: number | null;
  closLe: number | null;
  // Clôture / attente
  motifAttente: string;
  resumeResolution: string;
  nbRelancesClient: number;
  // Suggestions IA (Lot 6)
  iaCategorie: TicketCategorie | null;
  iaPriorite: TicketPriorite | null;
  iaResidenceId: string | null;
  iaConfiance: number | null;
  iaSuggestionAcceptee: boolean;
  updatedAt: number;
}

export type TicketEvenementType =
  | "creation" | "assignation" | "reassignation" | "changement_statut"
  | "commentaire_interne" | "rappel_client_effectue" | "message_envoye_client"
  | "relance_client" | "rappel_echeance" | "escalade" | "notification_envoyee";

export interface TicketEvenement {
  id: string;
  ticketId: string;
  type: TicketEvenementType;
  auteurId: string | null;
  contenu: string;
  creeLe: number; // historique NON modifiable
}

export interface ParametreDelai {
  id: string; // ex. "reclamation", "demande_document", "urgence", "autre"
  libelle: string;
  premiereReponseHeures: number | null; // heures ouvrées, null = suivi manuel
  resolutionJours: number | null; // jours ouvrés
  updatedAt: number;
}
