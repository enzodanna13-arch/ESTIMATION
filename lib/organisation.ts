// Client + logique de l'ORGANISATION QUOTIDIENNE. Le négociateur saisit ses RDV
// du jour ; on génère une liste de tâches dosée selon la charge (moins de tâches
// quand il a beaucoup de RDV). Stockage serveur par négociateur (voir serverOrganisation).

import { getHistoryKey } from "./history";
import type { RdvJour, TacheOrg, PlanJour, JoursOrg, OrgNego } from "./serverOrganisation";

export type { RdvJour, TacheOrg, PlanJour, JoursOrg, OrgNego } from "./serverOrganisation";

const headers = () => ({ "x-history-key": getHistoryKey() });
const jsonHeaders = () => ({ "content-type": "application/json", "x-history-key": getHistoryKey() });

// Date du jour locale (yyyy-mm-dd).
export function dateJour(): string {
  const d = new Date(); const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export const totalRdv = (r: RdvJour) => (r.visites || 0) + (r.r1 || 0) + (r.r2 || 0);
export type Niveau = "intensif" | "equilibre" | "leger";
export function niveauDe(r: RdvJour): Niveau {
  const t = totalRdv(r);
  return t <= 1 ? "intensif" : t <= 3 ? "equilibre" : "leger";
}
export const LABEL_NIVEAU: Record<Niveau, string> = {
  intensif: "Journée prospection (peu de RDV)",
  equilibre: "Journée équilibrée",
  leger: "Journée chargée en RDV (allégée)",
};

// Dosage des tâches selon la charge de RDV.
const PROFILS: Record<Niveau, { pige: number; ident: number; appels: number; relance: number; form: number }> = {
  intensif: { pige: 10, ident: 5, appels: 30, relance: 8, form: 1 },
  equilibre: { pige: 6, ident: 3, appels: 20, relance: 5, form: 1 },
  leger: { pige: 3, ident: 1, appels: 10, relance: 3, form: 0 },
};

export function genererTaches(rdv: RdvJour): TacheOrg[] {
  const P = PROFILS[niveauDe(rdv)];
  const T: TacheOrg[] = []; let i = 0;
  const add = (categorie: string, libelle: string, objectif?: number) => T.push({ id: `t${i++}`, categorie, libelle, objectif, fait: false });
  // Socle non négociable (tous les jours)
  add("Socle", "Traiter mes leads reçus et mes rappels du jour");
  add("Socle", "Mettre à jour mon CRM (statuts, suivis, notes)");
  add("Socle", "Préparer mes RDV du jour (dossiers, itinéraire)");
  // Prospection & chasse (dosé)
  add("Prospection", `Piger ${P.pige} nouveaux biens`, P.pige);
  add("Chasse", `Identifier ${P.ident} propriétaire(s) de biens repérés`, P.ident);
  add("Phoning", `Passer ${P.appels} appels de phoning`, P.appels);
  add("Suivi", `Relancer ${P.relance} contacts du portefeuille`, P.relance);
  if (P.form > 0) add("Formation", `Avancer ${P.form} leçon(s) du centre de formation`, P.form);
  return T;
}

export function construirePlan(date: string, rdv: RdvJour): PlanJour {
  return { date, rdv, niveau: niveauDe(rdv), taches: genererTaches(rdv) };
}

// --- API serveur ---
export async function chargerOrg(negoId: string): Promise<JoursOrg> {
  try {
    const res = await fetch(`/api/organisation/${encodeURIComponent(negoId)}`, { cache: "no-store", headers: headers() });
    if (!res.ok) return {};
    return ((await res.json()) as { jours?: JoursOrg }).jours ?? {};
  } catch { return {}; }
}
export async function sauverJour(negoId: string, plan: PlanJour): Promise<boolean> {
  try {
    const res = await fetch(`/api/organisation/${encodeURIComponent(negoId)}`, {
      method: "PUT", headers: jsonHeaders(), body: JSON.stringify({ date: plan.date, plan }),
    });
    return res.ok;
  } catch { return false; }
}
export async function listerOrg(): Promise<OrgNego[]> {
  try {
    const res = await fetch(`/api/organisation`, { cache: "no-store", headers: headers() });
    if (!res.ok) return [];
    return ((await res.json()) as { org?: OrgNego[] }).org ?? [];
  } catch { return []; }
}
