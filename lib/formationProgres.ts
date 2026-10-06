// Client + calculs de PROGRESSION FORMATION. La progression de chaque
// négociateur est stockée côté serveur (voir serverFormation) pour donner au
// manager une visibilité centralisée, et mise en cache locale pour la réactivité.

import { getHistoryKey } from "./history";
import { MODULES_FORMATION, minutesModule, type ModuleFormation } from "./formations";
import type { ProgresModule, ProgresFormation, ProgresNego } from "./serverFormation";

export type { ProgresModule, ProgresFormation, ProgresNego } from "./serverFormation";

const headers = () => ({ "x-history-key": getHistoryKey() });
const jsonHeaders = () => ({ "content-type": "application/json", "x-history-key": getHistoryKey() });

// ---------------------------------------------------------------------------
// Calculs partagés (page Formation ET Suivi des négociateurs)
// ---------------------------------------------------------------------------
export function avancementModule(m: ModuleFormation, e?: ProgresModule): number {
  const lus = Math.min(e?.lecons?.length ?? 0, m.lecons.length);
  const total = m.lecons.length + 1; // +1 pour le quiz
  const faits = lus + (e?.quiz !== undefined ? 1 : 0);
  return Math.round((faits / total) * 100);
}
// « Terminé » = toutes les leçons lues + quiz passé (quel que soit le score).
export function moduleTermine(m: ModuleFormation, e?: ProgresModule): boolean {
  return !!e && (e.lecons?.length ?? 0) >= m.lecons.length && e.quiz !== undefined;
}
// « Validé » = toutes les leçons lues + quiz parfait (sert à l'attestation).
export function moduleValide(m: ModuleFormation, e?: ProgresModule): boolean {
  return !!e && (e.lecons?.length ?? 0) >= m.lecons.length && e.quiz === m.quiz.length;
}

export interface StatsFormation {
  globalPct: number;
  termines: number;
  valides: number;
  leconsLues: number;
  totalLecons: number;
  quizReussis: number;
  minutesValidees: number;
}
export function statsFormation(progres: ProgresFormation): StatsFormation {
  let leconsLues = 0, quizReussis = 0, termines = 0, valides = 0, minutesValidees = 0, av = 0;
  for (const m of MODULES_FORMATION) {
    const e = progres[m.id];
    leconsLues += Math.min(e?.lecons?.length ?? 0, m.lecons.length);
    if (e?.quiz === m.quiz.length) quizReussis += 1;
    if (moduleTermine(m, e)) termines += 1;
    if (moduleValide(m, e)) { valides += 1; minutesValidees += minutesModule(m); }
    av += avancementModule(m, e);
  }
  return {
    globalPct: Math.round(av / MODULES_FORMATION.length),
    termines, valides, leconsLues,
    totalLecons: MODULES_FORMATION.reduce((s, m) => s + m.lecons.length, 0),
    quizReussis, minutesValidees,
  };
}

// ---------------------------------------------------------------------------
// API serveur
// ---------------------------------------------------------------------------
export async function chargerProgresNego(negoId: string): Promise<ProgresFormation> {
  try {
    const res = await fetch(`/api/formation/progres/${encodeURIComponent(negoId)}`, { cache: "no-store", headers: headers() });
    if (!res.ok) return {};
    return ((await res.json()) as { progres?: ProgresFormation }).progres ?? {};
  } catch { return {}; }
}

export async function sauverProgresNego(negoId: string, progres: ProgresFormation): Promise<boolean> {
  try {
    const res = await fetch(`/api/formation/progres/${encodeURIComponent(negoId)}`, {
      method: "PUT", headers: jsonHeaders(), body: JSON.stringify({ progres }),
    });
    return res.ok;
  } catch { return false; }
}

// Pour le manager : progression de TOUS les négociateurs (negoId -> progression).
export async function listerProgresNego(): Promise<Record<string, ProgresFormation>> {
  try {
    const res = await fetch(`/api/formation/progres`, { cache: "no-store", headers: headers() });
    if (!res.ok) return {};
    const data = (await res.json()) as { progres?: ProgresNego[] };
    const out: Record<string, ProgresFormation> = {};
    for (const p of data.progres ?? []) out[p.negoId] = p.progres ?? {};
    return out;
  } catch { return {}; }
}
