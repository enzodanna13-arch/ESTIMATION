// Appels API du module Syndic (côté navigateur). Le cookie de session httpOnly
// est envoyé automatiquement (même origine) : aucun secret ne transite ici.

import type { SyndicUserPublic } from "./types";
import { getHistoryKey } from "../history";

async function j<T = unknown>(path: string, opts?: RequestInit): Promise<T> {
  const r = await fetch(`/api/syndic${path}`, {
    ...opts,
    // Accès via le mot de passe d'équipe partagé (plus de comptes individuels).
    headers: { "content-type": "application/json", "x-history-key": getHistoryKey(), ...(opts?.headers ?? {}) },
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((data as { error?: string }).error ?? `Erreur serveur (${r.status})`);
  return data as T;
}

export const meApi = () => j<{ user: SyndicUserPublic | null; besoinBootstrap?: boolean }>("/auth/me");
export const loginApi = (email: string, password: string) =>
  j<{ user: SyndicUserPublic }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
export const bootstrapApi = (payload: { nom: string; prenom: string; email: string; motDePasse: string }, motDePasseEquipe: string) =>
  j<{ user: SyndicUserPublic }>("/auth/bootstrap", {
    method: "POST", headers: { "x-history-key": motDePasseEquipe }, body: JSON.stringify(payload),
  });
export const logoutApi = () => j("/auth/logout", { method: "POST" });

export const assistantApi = (messages: { role: "user" | "assistant"; content: string; pieces?: { type: "pdf" | "image"; data: string; nom?: string }[] }[]) =>
  j<{ reply: string }>("/assistant", { method: "POST", body: JSON.stringify({ messages }) });

// --- Archive syndic ---
export const CATEGORIES_ARCHIVE = [
  "Procès-verbal d'AG", "Convocation d'AG", "Appel de fonds", "Décompte de charges",
  "Budget prévisionnel", "Contrat", "Facture", "Devis", "Règlement de copropriété",
  "Diagnostic technique", "Courrier", "Sinistre / Assurance", "Mutation / État daté",
  "Relevé / Comptabilité", "Carnet d'entretien", "Autre",
] as const;
export interface DocArchive { id: string; nom: string; categorie: string; copropriete: string; date: string; resume: string; type: "pdf" | "image"; taille: number; createdAt: number; updatedAt: number }
export interface ExtraitArchive { nom: string; categorie: string; copropriete: string; date: string; resume: string }
export const listArchiveApi = () => j<{ documents: DocArchive[] }>("/archive");
export const analyserArchiveApi = (data: string, type: "pdf" | "image") => j<{ extrait: ExtraitArchive | null }>("/archive/analyser", { method: "POST", body: JSON.stringify({ data, type }) });
export interface SegmentArchive { pageDebut: number; pageFin: number; continuation: boolean; categorie: string; copropriete: string; date: string; nom: string; resume: string }
export const segmenterArchiveApi = (data: string, offset: number, contexte: string) => j<{ documents: SegmentArchive[] }>("/archive/segmenter", { method: "POST", body: JSON.stringify({ data, offset, contexte }) });
export const creerArchiveApi = (champs: Partial<DocArchive> & { data: string; type: "pdf" | "image" }) => j<{ document: DocArchive }>("/archive", { method: "POST", body: JSON.stringify(champs) });
export const updateArchiveApi = (id: string, p: Partial<DocArchive>) => j<{ document: DocArchive }>(`/archive/${id}`, { method: "PUT", body: JSON.stringify(p) });
export const deleteArchiveApi = (id: string) => j(`/archive/${id}`, { method: "DELETE" });
export const urlArchiveFile = (id: string) => `/api/syndic/archive/${encodeURIComponent(id)}/file`;

export const listUsersApi = () => j<{ users: SyndicUserPublic[] }>("/users");
export const createUserApi = (u: Record<string, unknown>) => j<{ user: SyndicUserPublic }>("/users", { method: "POST", body: JSON.stringify(u) });
export const updateUserApi = (id: string, p: Record<string, unknown>) => j<{ user: SyndicUserPublic }>(`/users/${id}`, { method: "PATCH", body: JSON.stringify(p) });
export const deleteUserApi = (id: string) => j(`/users/${id}`, { method: "DELETE" });

export interface ResidenceListe {
  id: string; nom: string; adresse: string; codePostal: string; commune: string;
  gestionnaireTitulaireId: string | null; gestionnaireSuppleantId: string | null;
  refExterne: string; actif: boolean; nbLots: number;
}
export const listResidencesApi = () => j<{ residences: ResidenceListe[] }>("/residences");
export const createResidenceApi = (r: Record<string, unknown>) => j("/residences", { method: "POST", body: JSON.stringify(r) });
export const updateResidenceApi = (id: string, p: Record<string, unknown>) => j(`/residences/${id}`, { method: "PATCH", body: JSON.stringify(p) });
export const deleteResidenceApi = (id: string) => j(`/residences/${id}`, { method: "DELETE" });

export interface ApercuImport {
  headers: string[];
  apercu: { ligne: number; valeurs: Record<string, string>; erreurs: string[] }[];
  nbValides: number; nbErreurs: number; total: number;
}
// --- Tickets / demandes -----------------------------------------------------
export interface TicketResume {
  id: string; numero: string; objet: string; categorie: string; priorite: string;
  statut: string; creeLe: number; creneauRappel: string; residenceNom: string;
  assigneNom: string; aQualifier: boolean; aAttribuer: boolean; aValider: boolean; origine: string;
}
export interface ResultatIngestion { statut: string; ticketId?: string; numero?: string; aValider?: boolean; raison?: string }
export const ingestEmailApi = (email: { from: string; fromName: string; subject: string; body: string }) =>
  j<{ resultat: ResultatIngestion }>("/emails/ingest", { method: "POST", body: JSON.stringify(email) });
export interface EvenementUI {
  id: string; type: string; contenu: string; creeLe: number; auteurNom: string;
}
export interface TicketDetail {
  ticket: Record<string, unknown> & {
    id: string; numero: string; objet: string; description: string; categorie: string;
    priorite: string; statut: string; residenceId: string | null; assigneA: string | null;
    demandeurNom: string; demandeurTelephone: string; demandeurEmail: string; demandeurQualite: string;
    creneauRappel: string; creeLe: number; motifAttente: string; resumeResolution: string;
  };
  residenceNom: string; assigneNom: string; creeParNom: string; evenements: EvenementUI[];
}
export const listTicketsApi = () => j<{ tickets: TicketResume[]; role: string }>("/tickets");
export const createTicketApi = (t: Record<string, unknown>) => j<{ ticket: { id: string; numero: string } }>("/tickets", { method: "POST", body: JSON.stringify(t) });
export const getTicketApi = (id: string) => j<TicketDetail>(`/tickets/${id}`);
export const patchTicketApi = (id: string, action: Record<string, unknown>) => j<{ ticket: unknown }>(`/tickets/${id}`, { method: "PATCH", body: JSON.stringify(action) });
export const draftEmailApi = (id: string, faits: string) => j<{ brouillon: { objet: string; corps: string } }>(`/tickets/${id}/draft-email`, { method: "POST", body: JSON.stringify({ faits }) });

export const previewImportApi = (type: string, csvText: string, mapping: Record<string, string>) =>
  j<ApercuImport>("/import", { method: "POST", body: JSON.stringify({ type, csvText, mapping, appliquer: false }) });
export const applyImportApi = (type: string, csvText: string, mapping: Record<string, string>) =>
  j<{ crees: number; majs: number; ignores: number; erreurs: string[] }>("/import", { method: "POST", body: JSON.stringify({ type, csvText, mapping, appliquer: true }) });
