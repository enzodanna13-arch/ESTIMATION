// Appels API du module Syndic (côté navigateur). Le cookie de session httpOnly
// est envoyé automatiquement (même origine) : aucun secret ne transite ici.

import type { SyndicUserPublic } from "./types";

async function j<T = unknown>(path: string, opts?: RequestInit): Promise<T> {
  const r = await fetch(`/api/syndic${path}`, {
    headers: { "content-type": "application/json", ...(opts?.headers ?? {}) },
    ...opts,
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
export const previewImportApi = (type: string, csvText: string, mapping: Record<string, string>) =>
  j<ApercuImport>("/import", { method: "POST", body: JSON.stringify({ type, csvText, mapping, appliquer: false }) });
export const applyImportApi = (type: string, csvText: string, mapping: Record<string, string>) =>
  j<{ crees: number; majs: number; ignores: number; erreurs: string[] }>("/import", { method: "POST", body: JSON.stringify({ type, csvText, mapping, appliquer: true }) });
