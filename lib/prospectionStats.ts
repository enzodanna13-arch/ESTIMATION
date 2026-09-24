import type { Opportunite } from "./prospectionTypes";

// Statistiques de conversion & fraîcheur (calcul PUR à partir des
// opportunités). Sert le dashboard. On mesure l'entonnoir
// opportunité → prospecté → contact → projet → estimation → mandat → vente,
// et le délai « DPE établi → détection IA Estimation ».

const JOUR = 86_400_000;

// Étape maximale atteinte par une opportunité (0 = détectée seulement).
export function etapeAtteinte(o: Opportunite): number {
  let s = 0;
  if ((o.passages ?? []).length > 0) s = 1; // prospecté (au moins un passage)
  const statutStage: Record<string, number> = {
    "Contact établi": 2, "Pas de projet": 2, "À relancer": Math.max(s, 1),
    "Projet identifié": 3, "RDV estimation": 4, "Mandat obtenu": 5,
  };
  const tousStatuts = [o.statut, ...(o.passages ?? []).map((p) => p.resultat)];
  for (const st of tousStatuts) if (statutStage[st]) s = Math.max(s, statutStage[st]);
  if (o.estimationId) s = Math.max(s, 4);
  if (o.mandat) s = Math.max(s, 5);
  if (o.vente) s = Math.max(s, 6);
  return s;
}

export interface FiltresStats {
  periodeJours?: number | null; // détectées dans les N derniers jours
  negociateur?: string;
  codeInsee?: string;
  niveau?: string;
  scoreMin?: number | null;
}

export function filtrerOpps(opps: Opportunite[], f: FiltresStats): Opportunite[] {
  const maintenant = Date.now();
  return opps.filter((o) => {
    if (f.periodeJours && o.detecteLe < maintenant - f.periodeJours * JOUR) return false;
    if (f.negociateur && o.negociateur !== f.negociateur) return false;
    if (f.codeInsee && o.codeInsee !== f.codeInsee) return false;
    if (f.niveau && o.niveau !== f.niveau) return false;
    if (f.scoreMin != null && o.score < f.scoreMin) return false;
    return true;
  });
}

export interface StatsProspection {
  total: number;
  entonnoir: { detectees: number; prioritaires: number; prospectees: number; contacts: number; projets: number; estimations: number; mandats: number; ventes: number };
  taux: { contact: number; projet: number; rdv: number; mandat: number; vente: number };
  fraicheur: { delaiMoyenJours: number | null; delaiMedianJours: number | null; nbMesures: number };
  parNiveau: { niveau: string; total: number; contacts: number; projets: number }[];
  parCommune: { code: string; nom: string; total: number; prospectees: number; projets: number }[];
  parNegociateur: { nom: string; total: number; prospectees: number; contacts: number; projets: number }[];
  parAgeDpe: { tranche: string; total: number; projets: number }[];
}

const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : 0);

export function calculerStats(toutes: Opportunite[], filtres: FiltresStats = {}): StatsProspection {
  const opps = filtrerOpps(toutes, filtres);
  const stage = new Map<string, number>();
  for (const o of opps) stage.set(o.id, etapeAtteinte(o));
  const compteStage = (min: number) => opps.filter((o) => (stage.get(o.id) ?? 0) >= min).length;

  const detectees = opps.length;
  const prioritaires = opps.filter((o) => o.niveau === "tres_prioritaire" || o.niveau === "prioritaire").length;
  const prospectees = compteStage(1);
  const contacts = compteStage(2);
  const projets = compteStage(3);
  const estimations = compteStage(4);
  const mandats = compteStage(5);
  const ventes = compteStage(6);

  // Fraîcheur : délai DPE établi → 1re détection IA Estimation.
  const delais: number[] = [];
  for (const o of opps) {
    if (!o.dpeDateEtablissement || !o.detecteLe) continue;
    const t = Date.parse(o.dpeDateEtablissement);
    if (!Number.isFinite(t)) continue;
    const j = Math.round((o.detecteLe - t) / JOUR);
    if (j >= 0 && j < 3650) delais.push(j);
  }
  delais.sort((a, b) => a - b);
  const delaiMoyen = delais.length ? Math.round(delais.reduce((s, x) => s + x, 0) / delais.length) : null;
  const delaiMedian = delais.length ? delais[Math.floor(delais.length / 2)] : null;

  // Par niveau
  const niveaux = ["tres_prioritaire", "prioritaire", "a_travailler", "faible"];
  const parNiveau = niveaux.map((niv) => {
    const g = opps.filter((o) => o.niveau === niv);
    return { niveau: niv, total: g.length, contacts: g.filter((o) => (stage.get(o.id) ?? 0) >= 2).length, projets: g.filter((o) => (stage.get(o.id) ?? 0) >= 3).length };
  });

  // Par commune
  const communeMap = new Map<string, { nom: string; g: Opportunite[] }>();
  for (const o of opps) {
    const e = communeMap.get(o.codeInsee) ?? { nom: o.ville, g: [] };
    e.g.push(o); communeMap.set(o.codeInsee, e);
  }
  const parCommune = [...communeMap.entries()].map(([code, { nom, g }]) => ({
    code, nom, total: g.length,
    prospectees: g.filter((o) => (stage.get(o.id) ?? 0) >= 1).length,
    projets: g.filter((o) => (stage.get(o.id) ?? 0) >= 3).length,
  })).sort((a, b) => b.total - a.total);

  // Par négociateur
  const negMap = new Map<string, Opportunite[]>();
  for (const o of opps) { const k = o.negociateur || "(non attribué)"; (negMap.get(k) ?? negMap.set(k, []).get(k)!).push(o); }
  const parNegociateur = [...negMap.entries()].map(([nom, g]) => ({
    nom, total: g.length,
    prospectees: g.filter((o) => (stage.get(o.id) ?? 0) >= 1).length,
    contacts: g.filter((o) => (stage.get(o.id) ?? 0) >= 2).length,
    projets: g.filter((o) => (stage.get(o.id) ?? 0) >= 3).length,
  })).sort((a, b) => b.total - a.total);

  // Par âge du DPE au moment de la détection (conversion selon fraîcheur).
  const tranches: { tranche: string; min: number; max: number }[] = [
    { tranche: "0-7 j", min: 0, max: 7 }, { tranche: "8-30 j", min: 8, max: 30 },
    { tranche: "31-90 j", min: 31, max: 90 }, { tranche: "> 90 j", min: 91, max: Infinity },
  ];
  const ageDe = (o: Opportunite): number | null => {
    const snap = o.signauxSnapshot?.ageDpeJours;
    if (typeof snap === "number") return snap;
    if (!o.dpeDateEtablissement) return null;
    const t = Date.parse(o.dpeDateEtablissement);
    return Number.isFinite(t) ? Math.round((o.detecteLe - t) / JOUR) : null;
  };
  const parAgeDpe = tranches.map((tr) => {
    const g = opps.filter((o) => { const a = ageDe(o); return a != null && a >= tr.min && a <= tr.max; });
    return { tranche: tr.tranche, total: g.length, projets: g.filter((o) => (stage.get(o.id) ?? 0) >= 3).length };
  });

  return {
    total: detectees,
    entonnoir: { detectees, prioritaires, prospectees, contacts, projets, estimations, mandats, ventes },
    taux: {
      contact: pct(contacts, prospectees), projet: pct(projets, contacts),
      rdv: pct(estimations, projets), mandat: pct(mandats, estimations), vente: pct(ventes, mandats),
    },
    fraicheur: { delaiMoyenJours: delaiMoyen, delaiMedianJours: delaiMedian, nbMesures: delais.length },
    parNiveau, parCommune, parNegociateur, parAgeDpe,
  };
}
