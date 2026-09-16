import { enregistrer, lister, nouvelId, obtenir } from "./store";
import { obtenirResidence } from "./residences";
import { listerUsers } from "./users";
import { choisirGestionnaire } from "./attribution";
import type {
  Ticket, TicketCategorie, TicketEvenement, TicketEvenementType, TicketOrigine,
  TicketPriorite, TicketStatut, QualiteContact,
} from "./types";

const COLL = "tickets";
const EV = "ticket-evenements";
const CPT = "compteur";

// Date du jour au format YYYY-MM-DD, fuseau Europe/Paris (pour l'attribution).
const jourParis = () => new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Paris" });

interface Compteur { id: string; n: number; updatedAt: number }

// Numéro lisible SYN-2026-000123 (compteur annuel). Blob n'a pas de
// transaction : au volume d'une agence le risque de collision est négligeable,
// et un doublon éventuel resterait cosmétique (l'id interne reste unique).
async function numeroTicket(): Promise<string> {
  const annee = new Date().getFullYear();
  const id = String(annee);
  const cur = (await obtenir<Compteur>(CPT, id)) ?? { id, n: 0, updatedAt: 0 };
  cur.n += 1;
  await enregistrer(CPT, cur);
  return `SYN-${annee}-${String(cur.n).padStart(6, "0")}`;
}

// Un événement stocké porte un updatedAt (exigé par la couche Blob versionnée) ;
// l'historique reste NON modifiable : chaque événement est un fichier distinct.
type EvStocke = TicketEvenement & { updatedAt: number };

export async function ajouterEvenement(
  ticketId: string, type: TicketEvenementType, auteurId: string | null, contenu: string,
): Promise<TicketEvenement> {
  const now = Date.now();
  const ev: EvStocke = { id: nouvelId(), ticketId, type, auteurId, contenu, creeLe: now, updatedAt: now };
  await enregistrer(EV, ev);
  return ev;
}

export async function evenementsDuTicket(ticketId: string): Promise<TicketEvenement[]> {
  const evs = await lister<EvStocke>(EV);
  return evs.filter((e) => e.ticketId === ticketId).sort((a, b) => a.creeLe - b.creeLe);
}

export async function obtenirTicket(id: string): Promise<Ticket | null> {
  return obtenir<Ticket>(COLL, id);
}

export async function listerTickets(): Promise<Ticket[]> {
  const ts = await lister<Ticket>(COLL);
  return ts.sort((a, b) => b.creeLe - a.creeLe);
}

export async function creerTicket(data: {
  origine: TicketOrigine;
  categorie: TicketCategorie;
  priorite: TicketPriorite;
  residenceId: string | null;
  lotId: string | null;
  contactId: string | null;
  demandeurNom: string;
  demandeurTelephone: string;
  demandeurEmail: string;
  demandeurQualite: QualiteContact | "";
  objet: string;
  description: string;
  creneauRappel: string;
}, creePar: string): Promise<Ticket> {
  const numero = await numeroTicket();
  const residence = data.residenceId ? await obtenirResidence(data.residenceId) : null;
  const users = await listerUsers();
  const map = new Map(users.map((u) => [u.id, u] as const));
  const attr = choisirGestionnaire(residence, map, jourParis());
  const now = Date.now();

  const ticket: Ticket = {
    id: nouvelId(),
    numero,
    service: "syndic",
    origine: data.origine,
    categorie: data.categorie,
    priorite: data.priorite,
    statut: attr.userId ? "assigne" : "nouveau",
    residenceId: data.residenceId,
    lotId: data.lotId,
    contactId: data.contactId,
    demandeurNom: data.demandeurNom,
    demandeurTelephone: data.demandeurTelephone,
    demandeurEmail: data.demandeurEmail,
    demandeurQualite: data.demandeurQualite,
    objet: data.objet,
    description: data.description,
    creneauRappel: data.creneauRappel,
    assigneA: attr.userId,
    creePar,
    creeLe: now,
    assigneLe: attr.userId ? now : null,
    premiereReponseLe: null,
    accuseReceptionLe: null,
    echeancePremiereReponse: null,
    echeanceResolution: null,
    closLe: null,
    motifAttente: "",
    resumeResolution: "",
    nbRelancesClient: 0,
    iaCategorie: null, iaPriorite: null, iaResidenceId: null, iaConfiance: null, iaSuggestionAcceptee: false,
    updatedAt: now,
  };
  await enregistrer(COLL, ticket);

  const fileTxt = attr.file === "assigne" ? `attribuée automatiquement (${attr.via})`
    : attr.file === "a_attribuer" ? "en attente d'attribution (aucun gestionnaire disponible)"
      : "à qualifier (résidence inconnue)";
  await ajouterEvenement(ticket.id, "creation", creePar, `Demande créée — ${fileTxt}`);
  if (attr.userId) await ajouterEvenement(ticket.id, "assignation", null, `Attribuée au gestionnaire titulaire/suppléant (${attr.via})`);
  return ticket;
}

export async function sauverTicket(ticket: Ticket): Promise<Ticket> {
  return enregistrer(COLL, ticket);
}

export type ActionTicket =
  | { action: "prendre" }
  | { action: "reponse" }
  | { action: "commentaire"; texte: string }
  | { action: "statut"; statut: TicketStatut; motif?: string }
  | { action: "reassigner"; assigneA: string; motif: string }
  | { action: "qualifier"; residenceId: string };

// Applique une action sur un ticket, journalise l'événement, renvoie le ticket.
export async function appliquerAction(
  ticket: Ticket, act: ActionTicket, auteurId: string,
): Promise<{ ticket: Ticket } | { erreur: string }> {
  const now = Date.now();
  const t = { ...ticket };

  switch (act.action) {
    case "prendre":
      t.statut = "en_cours";
      await ajouterEvenement(t.id, "changement_statut", auteurId, "Prise en charge par le gestionnaire");
      break;
    case "reponse":
      if (!t.premiereReponseLe) t.premiereReponseLe = now;
      if (t.statut === "assigne" || t.statut === "nouveau") t.statut = "en_cours";
      await ajouterEvenement(t.id, "rappel_client_effectue", auteurId, "Client rappelé / première réponse apportée");
      break;
    case "commentaire":
      if (!act.texte.trim()) return { erreur: "Commentaire vide" };
      await ajouterEvenement(t.id, "commentaire_interne", auteurId, act.texte.trim());
      break;
    case "statut":
      if (act.statut === "en_attente" && !(act.motif ?? "").trim()) return { erreur: "Un motif d'attente est obligatoire" };
      if (act.statut === "clos" && !(act.motif ?? "").trim()) return { erreur: "Un résumé de résolution est obligatoire pour clore" };
      t.statut = act.statut;
      if (act.statut === "en_attente") t.motifAttente = (act.motif ?? "").trim();
      if (act.statut === "clos") { t.resumeResolution = (act.motif ?? "").trim(); t.closLe = now; }
      await ajouterEvenement(t.id, "changement_statut", auteurId,
        `Statut : ${act.statut}${act.motif ? ` — ${act.motif.trim()}` : ""}`);
      break;
    case "reassigner":
      if (!act.assigneA) return { erreur: "Choisissez un gestionnaire" };
      if (!(act.motif ?? "").trim()) return { erreur: "Le motif de réattribution est obligatoire" };
      t.assigneA = act.assigneA;
      t.assigneLe = now;
      if (t.statut === "nouveau") t.statut = "assigne";
      await ajouterEvenement(t.id, "reassignation", auteurId, `Réattribuée — ${act.motif.trim()}`);
      break;
    case "qualifier": {
      if (!act.residenceId) return { erreur: "Choisissez une résidence" };
      t.residenceId = act.residenceId;
      const residence = await obtenirResidence(act.residenceId);
      const users = await listerUsers();
      const map = new Map(users.map((u) => [u.id, u] as const));
      const attr = choisirGestionnaire(residence, map, jourParis());
      t.assigneA = attr.userId;
      t.assigneLe = attr.userId ? now : null;
      t.statut = attr.userId ? "assigne" : "nouveau";
      await ajouterEvenement(t.id, "assignation", auteurId,
        `Résidence qualifiée${attr.userId ? ` — attribuée automatiquement (${attr.via})` : " — aucun gestionnaire disponible"}`);
      break;
    }
    default:
      return { erreur: "Action inconnue" };
  }
  t.updatedAt = now;
  await sauverTicket(t);
  return { ticket: t };
}
