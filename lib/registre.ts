// Client du registre des appels PARTAGÉ — protégé par le mot de passe
// d'équipe (vérifié côté serveur). Les entrées historiques viennent du
// fichier statique public/registre-seed.json ; les nouvelles du serveur.

export type { AppelEntry } from "./serverRegistre";
import type { AppelEntry } from "./serverRegistre";
import { getHistoryKey } from "./history";

const headers = () => ({ "x-history-key": getHistoryKey() });

// Colonnes du registre, dans l'ordre du fichier de l'agence
export const REGISTRE_COLONNES: { cle: keyof AppelEntry; label: string }[] = [
  { cle: "date", label: "Date" },
  { cle: "jour", label: "Jour" },
  { cle: "origine", label: "Origine appel" },
  { cle: "destinataire", label: "Destinataire" },
  { cle: "nom", label: "Nom" },
  { cle: "telephone", label: "Téléphone" },
  { cle: "mail", label: "Mail" },
  { cle: "refBien", label: "Réf. bien" },
  { cle: "message", label: "Message" },
  { cle: "traitement", label: "Traitement de la demande" },
  { cle: "finalise", label: "Finalisé" },
];

export interface RegistreSeed {
  mois: string[];
  entrees: Omit<AppelEntry, "id" | "createdAt">[];
}

let seedCache: RegistreSeed | null = null;

export async function chargerSeed(): Promise<RegistreSeed> {
  if (seedCache) return seedCache;
  try {
    const res = await fetch("/registre-seed.json", { cache: "force-cache" });
    seedCache = res.ok ? ((await res.json()) as RegistreSeed) : { mois: [], entrees: [] };
  } catch {
    seedCache = { mois: [], entrees: [] };
  }
  return seedCache;
}

// Appels + mois connus (dont les mois créés mais encore vides)
export async function listRegistre(): Promise<{ entrees: AppelEntry[]; mois: string[] }> {
  try {
    const res = await fetch("/api/registre", { cache: "no-store", headers: headers() });
    if (!res.ok) return { entrees: [], mois: [] };
    const body = (await res.json()) as { entries?: AppelEntry[]; mois?: string[] };
    return { entrees: body.entries ?? [], mois: body.mois ?? [] };
  } catch {
    return { entrees: [], mois: [] };
  }
}

export async function listAppels(): Promise<AppelEntry[]> {
  return (await listRegistre()).entrees;
}

// Crée (et persiste) un mois vide
export async function createMois(mois: string): Promise<boolean> {
  const res = await fetch("/api/registre", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers() },
    body: JSON.stringify({ creerMois: true, mois }),
  });
  return res.ok;
}

// Reclasse tous les appels dans le mois de leur date réelle. Renvoie le nombre
// d'appels déplacés (ou null si l'opération a échoué).
export async function reclasserParDate(): Promise<{ deplaces: number; total: number } | null> {
  try {
    const res = await fetch("/api/registre", {
      method: "POST",
      headers: { "content-type": "application/json", ...headers() },
      body: JSON.stringify({ reclasser: true }),
    });
    if (!res.ok) return null;
    return (await res.json()) as { deplaces: number; total: number };
  } catch {
    return null;
  }
}

export async function addAppel(entry: AppelEntry): Promise<boolean> {
  const res = await fetch("/api/registre", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers() },
    body: JSON.stringify(entry),
  });
  return res.ok;
}

export async function deleteAppel(mois: string, id: string): Promise<boolean> {
  const res = await fetch(`/api/registre?mois=${encodeURIComponent(mois)}&id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: headers(),
  });
  return res.ok;
}
