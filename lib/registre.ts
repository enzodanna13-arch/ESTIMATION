// Client du registre des appels PARTAGÉ — protégé par le mot de passe
// d'équipe (vérifié côté serveur). Les entrées historiques viennent du
// fichier statique public/registre-seed.json ; les nouvelles du serveur.

export type { AppelEntry } from "./serverRegistre";
import type { AppelEntry } from "./serverRegistre";
import { getHistoryKey } from "./history";

const headers = () => ({ "x-history-key": getHistoryKey() });

// Colonnes du registre, dans l'ordre du fichier de l'agence
export const REGISTRE_COLONNES: { cle: keyof AppelEntry; label: string }[] = [
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

export async function listAppels(): Promise<AppelEntry[]> {
  try {
    const res = await fetch("/api/registre", { cache: "no-store", headers: headers() });
    if (!res.ok) return [];
    const body = (await res.json()) as { entries?: AppelEntry[] };
    return body.entries ?? [];
  } catch {
    return [];
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
