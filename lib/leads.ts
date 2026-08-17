export type { Lead, SuiviLead } from "./serverLeads";
import type { Lead } from "./serverLeads";
import { getHistoryKey } from "./history";

const headers = () => ({ "x-history-key": getHistoryKey() });
const jsonHeaders = () => ({ "content-type": "application/json", "x-history-key": getHistoryKey() });

// Statuts de suivi d'un lead (pipeline commercial)
export const STATUTS_LEAD = [
  "Nouveau", "À appeler", "Transféré", "RDV fixé", "En cours", "Converti", "Non converti", "Perdu",
];

export const STATUT_LEAD_COULEURS: Record<string, string> = {
  Nouveau: "bg-blue-100 text-blue-700",
  "À appeler": "bg-amber-100 text-amber-700",
  Transféré: "bg-cyan-100 text-cyan-700",
  "RDV fixé": "bg-violet-100 text-violet-700",
  "En cours": "bg-indigo-100 text-indigo-700",
  Converti: "bg-emerald-100 text-emerald-700",
  "Non converti": "bg-slate-100 text-slate-600",
  Perdu: "bg-red-100 text-red-600",
};

export const SOURCES_LEAD = [
  { id: "facebook", label: "Facebook Ads" },
  { id: "instagram", label: "Instagram" },
  { id: "site", label: "Site web" },
  { id: "manuel", label: "Saisie manuelle" },
  { id: "autre", label: "Autre" },
];

export const TYPES_PROJET_LEAD = [
  { id: "acquereur", label: "Acquéreur" },
  { id: "investisseur", label: "Investisseur" },
  { id: "vendeur", label: "Vendeur" },
  { id: "estimation", label: "Estimation" },
  { id: "autre", label: "Autre" },
];

// Types de suivi d'un lead. `statut` (optionnel) = statut appliqué
// automatiquement au lead quand on enregistre ce type de suivi.
export const SUIVI_TYPES: { id: string; label: string; statut?: string }[] = [
  { id: "appel", label: "Appel" },
  { id: "repondeur", label: "Répondeur / message laissé" },
  { id: "email", label: "Email" },
  { id: "rdv", label: "RDV", statut: "RDV fixé" },
  { id: "note", label: "Note" },
  { id: "transfert", label: "Transfert" },
  { id: "estim_sans_projet", label: "Estimation faite — sans projet de vente" },
  { id: "estim_projet", label: "Estimation faite — projet de vente", statut: "En cours" },
  { id: "pas_interesse", label: "Pas intéressé", statut: "Non converti" },
];

export async function listLeads(): Promise<Lead[]> {
  const res = await fetch("/api/leads", { cache: "no-store", headers: headers() });
  if (!res.ok) return [];
  const body = (await res.json()) as { leads?: Lead[] };
  return body.leads ?? [];
}

// Restaure les leads archivés absents de la liste (perdus par un ancien bug)
export async function restaurerLeadsArchives(): Promise<{ restaures: number; ids: string[] } | null> {
  try {
    const res = await fetch("/api/leads", { method: "POST", headers: jsonHeaders(), body: JSON.stringify({ restaurer: true }) });
    if (!res.ok) return null;
    return (await res.json()) as { restaures: number; ids: string[] };
  } catch {
    return null;
  }
}

export async function createLead(partial: Partial<Lead>): Promise<Lead | null> {
  const res = await fetch("/api/leads", { method: "POST", headers: jsonHeaders(), body: JSON.stringify(partial) });
  if (!res.ok) return null;
  return ((await res.json()) as { lead?: Lead }).lead ?? null;
}

export async function updateLead(id: string, patch: Partial<Lead>): Promise<Lead | null> {
  const res = await fetch(`/api/leads/${encodeURIComponent(id)}`, { method: "PUT", headers: jsonHeaders(), body: JSON.stringify(patch) });
  if (!res.ok) return null;
  return ((await res.json()) as { lead?: Lead }).lead ?? null;
}

export async function deleteLead(id: string): Promise<boolean> {
  const res = await fetch(`/api/leads/${encodeURIComponent(id)}`, { method: "DELETE", headers: headers() });
  return res.ok;
}
