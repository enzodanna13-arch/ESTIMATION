// Client du service PHONING (tableaux d'appels par cible) + calculs de stats.
// Stockage serveur par négociateur (voir serverPhoning), pour la visibilité manager.

import { getHistoryKey } from "./history";
import { getAdminKey } from "./admin";
import { STATUTS_NEGATIFS, STATUTS_POSITIFS, PHRASES_MOTIVATION_DEFAUT } from "./phoningScripts";
import type { LignePhoning, PhoningData, PhoningNego } from "./serverPhoning";
import type { BaseContact } from "./serverPhoningBase";

export type { LignePhoning, PhoningData, PhoningNego } from "./serverPhoning";
export type { BaseContact } from "./serverPhoningBase";

export const estNegatif = (statut: string) => STATUTS_NEGATIFS.includes(statut);
export const estPositif = (statut: string) => STATUTS_POSITIFS.includes(statut);

const headers = () => ({ "x-history-key": getHistoryKey() });
const jsonHeaders = () => ({ "content-type": "application/json", "x-history-key": getHistoryKey() });

export async function chargerPhoning(negoId: string): Promise<PhoningData> {
  try {
    const res = await fetch(`/api/phoning/${encodeURIComponent(negoId)}`, { cache: "no-store", headers: headers() });
    if (!res.ok) return {};
    return ((await res.json()) as { data?: PhoningData }).data ?? {};
  } catch { return {}; }
}

export async function sauverPhoning(negoId: string, data: PhoningData): Promise<boolean> {
  try {
    const res = await fetch(`/api/phoning/${encodeURIComponent(negoId)}`, {
      method: "PUT", headers: jsonHeaders(), body: JSON.stringify({ data }),
    });
    return res.ok;
  } catch { return false; }
}

// Vue manager : phoning de tous les négociateurs (negoId -> data).
export async function listerPhoning(): Promise<Record<string, PhoningData>> {
  try {
    const res = await fetch(`/api/phoning`, { cache: "no-store", headers: headers() });
    if (!res.ok) return {};
    const d = (await res.json()) as { phoning?: PhoningNego[] };
    const out: Record<string, PhoningData> = {};
    for (const p of d.phoning ?? []) out[p.negoId] = p.data ?? {};
    return out;
  } catch { return {}; }
}

export interface StatsPhoning {
  total: number;
  aAppeler: number;
  appeles: number;   // tout contact avec un statut autre que « À appeler »
  rdv: number;
  mandats: number;
  rappels: number;   // statut « Rappel » ou rappel daté dans le futur/passé
}

const estAppele = (s: string) => s && s !== "À appeler";

export function statsLignes(lignes: LignePhoning[]): StatsPhoning {
  const st: StatsPhoning = { total: 0, aAppeler: 0, appeles: 0, rdv: 0, mandats: 0, rappels: 0 };
  for (const l of lignes) {
    st.total++;
    if (!estAppele(l.statut)) st.aAppeler++; else st.appeles++;
    if (l.statut === "RDV fixé") st.rdv++;
    if (l.statut === "Mandat / Vente") st.mandats++;
    if (l.statut === "Rappel" || l.rappel) st.rappels++;
  }
  return st;
}

export function statsData(data: PhoningData): StatsPhoning {
  const toutes = Object.values(data).flat();
  return statsLignes(toutes);
}

// --- Phrases de remotivation (config globale, éditée par le manager) ---
export async function chargerMotivation(): Promise<string[]> {
  try {
    const res = await fetch(`/api/phoning/motivation`, { cache: "no-store", headers: headers() });
    if (!res.ok) return PHRASES_MOTIVATION_DEFAUT;
    const d = (await res.json()) as { phrases?: string[] };
    return d.phrases && d.phrases.length ? d.phrases : PHRASES_MOTIVATION_DEFAUT;
  } catch { return PHRASES_MOTIVATION_DEFAUT; }
}

export async function sauverMotivation(phrases: string[]): Promise<string[] | null> {
  try {
    const res = await fetch(`/api/phoning/motivation`, { method: "PUT", headers: jsonHeaders(), body: JSON.stringify({ phrases }) });
    if (!res.ok) return null;
    return ((await res.json()) as { phrases?: string[] }).phrases ?? null;
  } catch { return null; }
}

// --- Base partagée de contacts par cible (importée par l'admin) ---
export async function chargerBasePhoning(cibleId: string): Promise<BaseContact[]> {
  try {
    const res = await fetch(`/api/phoning/base/${encodeURIComponent(cibleId)}`, { cache: "no-store", headers: headers() });
    if (!res.ok) return [];
    return ((await res.json()) as { contacts?: BaseContact[] }).contacts ?? [];
  } catch { return []; }
}

// Réservé à l'admin : le code admin voyage dans x-admin-key (vérifié côté serveur).
// mode "remplacer" (défaut) écrase la base ; "ajouter" complète sans doublon.
export async function remplacerBasePhoning(cibleId: string, contacts: BaseContact[], mode: "remplacer" | "ajouter" = "remplacer"): Promise<BaseContact[] | null> {
  try {
    const res = await fetch(`/api/phoning/base/${encodeURIComponent(cibleId)}`, {
      method: "PUT",
      headers: { ...jsonHeaders(), "x-admin-key": getAdminKey() },
      body: JSON.stringify({ contacts, mode }),
    });
    if (!res.ok) return null;
    return ((await res.json()) as { contacts?: BaseContact[] }).contacts ?? [];
  } catch { return null; }
}
