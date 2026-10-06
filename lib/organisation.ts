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

// Les 5 familles de tâches (ordre d'affichage).
export const CATEGORIES = ["Chasse", "Identification", "Phoning", "Prospection", "Formation"] as const;

// Chasse et identification sont des objectifs TERRAIN fixes, tous les jours :
// 10 biens chassés et 5 biens identifiés. Le reste (phoning, prospection,
// formation) est dosé selon la charge de RDV pour ne pas surcharger.
const CHASSE_PAR_JOUR = 10;
const IDENT_PAR_JOUR = 5;
// Le phoning se mesure en TEMPS (minutes), pas en nombre de contacts : de 30 min
// les journées très chargées en RDV à 1h30 les journées libres.
const PROFILS: Record<Niveau, { phoningMin: number; prospection: number; form: number }> = {
  intensif: { phoningMin: 90, prospection: 2, form: 1 },
  equilibre: { phoningMin: 60, prospection: 1, form: 1 },
  leger: { phoningMin: 30, prospection: 1, form: 0 },
};

// Minutes -> libellé court (30 min, 1h, 1h30).
function dureeTexte(min: number): string {
  const h = Math.floor(min / 60); const m = min % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
}

export function genererTaches(rdv: RdvJour): TacheOrg[] {
  const P = PROFILS[niveauDe(rdv)];
  const T: TacheOrg[] = []; let i = 0;
  const add = (categorie: string, libelle: string, objectif?: number) => T.push({ id: `t${i++}`, categorie, libelle, objectif, fait: false });
  // Chasse : chasser des biens sur le terrain (objectif fixe quotidien).
  add("Chasse", `Chasser ${CHASSE_PAR_JOUR} biens sur le terrain (démarchage des vendeurs : porte-à-porte, boîtage, contact direct)`, CHASSE_PAR_JOUR);
  // Identification : trouver des biens à la vente (objectif fixe quotidien).
  add("Identification", `Identifier ${IDENT_PAR_JOUR} biens à vendre (annonces, panneaux, bouche-à-oreille)`, IDENT_PAR_JOUR);
  // Phoning : relance de la base, en temps passé.
  add("Phoning", `Faire ${dureeTexte(P.phoningMin)} de phoning (relance de la base : estimations, mandats, acquéreurs)`, P.phoningMin);
  // Prospection ciblée via l'outil CRM.
  add("Prospection", `Travailler ${P.prospection} secteur(s) de prospection ciblée (CRM : propriétaires, DVF)`, P.prospection);
  // Formation.
  if (P.form > 0) add("Formation", `Avancer ${P.form} leçon(s) du centre de formation`, P.form);
  return T;
}

export function construirePlan(date: string, rdv: RdvJour): PlanJour {
  return { date, rdv, niveau: niveauDe(rdv), taches: genererTaches(rdv) };
}

// --- Traçabilité des RDV ---
// Chaque jour le négociateur saisit ses RDV ; on en garde l'historique pour le
// suivi (côté négociateur et côté manager).
export interface RecapJour { date: string; rdv: RdvJour; total: number; }
export interface CumulRdv { visites: number; r1: number; r2: number; total: number; nbJours: number; }

// Historique des RDV, du plus récent au plus ancien.
export function recapRdv(jours: JoursOrg): RecapJour[] {
  return Object.values(jours)
    .map((p) => ({ date: p.date, rdv: p.rdv, total: totalRdv(p.rdv) }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

// Cumul des RDV sur les jours >= depuisInclus (yyyy-mm-dd). Sans borne : tout.
export function cumulRdv(jours: JoursOrg, depuisInclus = ""): CumulRdv {
  const c: CumulRdv = { visites: 0, r1: 0, r2: 0, total: 0, nbJours: 0 };
  for (const p of Object.values(jours)) {
    if (depuisInclus && p.date < depuisInclus) continue;
    c.visites += p.rdv.visites || 0; c.r1 += p.rdv.r1 || 0; c.r2 += p.rdv.r2 || 0; c.nbJours += 1;
  }
  c.total = c.visites + c.r1 + c.r2;
  return c;
}

const pad = (n: number) => String(n).padStart(2, "0");
// Lundi de la semaine en cours (yyyy-mm-dd).
export function debutSemaineISO(ref = new Date()): string {
  const d = new Date(ref); const lundi = (d.getDay() + 6) % 7; d.setDate(d.getDate() - lundi);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
// Premier jour du mois en cours (yyyy-mm-dd).
export function debutMoisISO(ref = new Date()): string {
  const d = new Date(ref); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`;
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
