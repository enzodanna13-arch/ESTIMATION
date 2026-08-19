export type { Lead, SuiviLead } from "./serverLeads";
import type { Lead } from "./serverLeads";
import { getHistoryKey } from "./history";

const headers = () => ({ "x-history-key": getHistoryKey() });
const jsonHeaders = () => ({ "content-type": "application/json", "x-history-key": getHistoryKey() });

// Statuts de suivi d'un lead (pipeline commercial)
// Statuts de suivi d'un lead (pipeline immobilier orienté résultat).
export const STATUTS_LEAD = [
  "Nouveau",
  "À rappeler",
  "Répondeur / message laissé",
  "Transféré",
  "RDV fixé",
  "Estimation — projet de vente",
  "Prise de mandat",
  "Converti",
  "Estimation — sans projet",
  "Pas intéressé",
  "Perdu",
];

export const STATUT_LEAD_COULEURS: Record<string, string> = {
  Nouveau: "bg-blue-100 text-blue-700",
  "À rappeler": "bg-amber-100 text-amber-700",
  "Répondeur / message laissé": "bg-cyan-100 text-cyan-700",
  Transféré: "bg-indigo-100 text-indigo-700",
  "RDV fixé": "bg-violet-100 text-violet-700",
  "Estimation — projet de vente": "bg-emerald-100 text-emerald-700",
  "Prise de mandat": "bg-teal-200 text-teal-800",
  Converti: "bg-green-100 text-green-700",
  "Estimation — sans projet": "bg-slate-100 text-slate-600",
  "Pas intéressé": "bg-orange-100 text-orange-700",
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
// Types de suivi (timeline). `statut` (optionnel) = statut appliqué au lead
// quand on enregistre ce suivi. Les résultats « Répondeur », « Pas intéressé »,
// « Estimation… » sont désormais des STATUTS (chips), pas des lignes de suivi.
export const SUIVI_TYPES: { id: string; label: string; statut?: string }[] = [
  { id: "appel", label: "Appel" },
  { id: "email", label: "Email" },
  { id: "rdv", label: "RDV", statut: "RDV fixé" },
  { id: "note", label: "Note" },
  // types techniques (affichés dans la timeline, non proposés à la saisie libre)
  { id: "transfert", label: "Transfert" },
  { id: "statut", label: "Statut" },
  { id: "creation", label: "Création" },
  { id: "conversion", label: "Conversion" },
];

// Actions proposées à la saisie manuelle d'un suivi (menu déroulant).
export const SUIVI_ACTIONS = SUIVI_TYPES.filter((t) => ["appel", "email", "rdv", "note"].includes(t.id));

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

// --- SMS (Twilio) : historique et envoi manuel depuis la fiche lead ----------
export interface SmsRecordClient {
  id: string; leadId: string; agent: string | null; twilioSid: string;
  type: string; recipient: string; body: string; status: string;
  errorMessage: string; createdAt: number; sentAt: number | null;
  deliveredAt: number | null; updatedAt: number;
}

export async function listSmsLead(leadId: string): Promise<SmsRecordClient[]> {
  try {
    const res = await fetch(`/api/sms?leadId=${encodeURIComponent(leadId)}`, { cache: "no-store", headers: headers() });
    if (!res.ok) return [];
    return ((await res.json()).sms ?? []) as SmsRecordClient[];
  } catch { return []; }
}

// --- Export CSV pour systeme.io (nouveaux contacts uniquement) ---------------
export async function compterLeadsExportables(): Promise<number> {
  try {
    const res = await fetch("/api/leads/export", { cache: "no-store", headers: headers() });
    if (!res.ok) return 0;
    return ((await res.json()).disponibles ?? 0) as number;
  } catch { return 0; }
}

export async function exporterLeadsCsv(): Promise<{ count: number; csv: string } | null> {
  try {
    const res = await fetch("/api/leads/export", { method: "POST", headers: jsonHeaders(), body: "{}" });
    if (!res.ok) return null;
    return (await res.json()) as { count: number; csv: string };
  } catch { return null; }
}

export async function reinitialiserExportLeads(): Promise<number | null> {
  try {
    const res = await fetch("/api/leads/export", { method: "POST", headers: jsonHeaders(), body: JSON.stringify({ reset: true }) });
    if (!res.ok) return null;
    return ((await res.json()).reset ?? 0) as number;
  } catch { return null; }
}

// Renvoie { record } en cas de succès, ou { error } (message lisible).
export async function envoyerSmsLead(
  leadId: string,
  type: "NO_ANSWER" | "NOT_INTERESTED" | "CUSTOM",
  custom?: string,
): Promise<{ record?: SmsRecordClient; error?: string }> {
  try {
    const res = await fetch("/api/sms/send", {
      method: "POST", headers: jsonHeaders(), body: JSON.stringify({ leadId, type, custom }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: data.error ?? "Envoi impossible." };
    return { record: data.record as SmsRecordClient };
  } catch {
    return { error: "Service SMS injoignable. Réessayez." };
  }
}
