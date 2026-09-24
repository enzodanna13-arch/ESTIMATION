import type { LigneScore, NiveauProspection, Opportunite, ProspectionConfig } from "./prospectionTypes";

// Moteur de SCORE « potentiel vendeur » (0..100), explicable et configurable.
// Chaque composante ajoute/retranche des points selon les coefficients de la
// config. Le détail est renvoyé pour affichage (« pourquoi ce score »).
//
// RÈGLE MÉTIER : un DPE récent est un SIGNAL, jamais une preuve de vente. Le
// score exprime une PROBABILITÉ de projet, pas une certitude.

const JOUR = 86_400_000;

function joursDepuis(dateIso: string, ref = Date.now()): number | null {
  if (!dateIso) return null;
  const t = Date.parse(dateIso);
  if (!Number.isFinite(t)) return null;
  return Math.floor((ref - t) / JOUR);
}

export interface ResultatScore {
  score: number;
  niveau: NiveauProspection;
  detail: LigneScore[];
}

// Calcule le score d'une opportunité à partir de ses données + de la config.
// `communePrioritaire` : la commune du bien est-elle marquée prioritaire ?
export function scorerOpportunite(
  opp: Pick<
    Opportunite,
    | "typeBien" | "dpe" | "dpeDateEtablissement" | "dvfDerniereMutationDate"
    | "statut" | "derniereAction" | "passages" | "dossierId" | "estimationId" | "penaliteManuelle"
  >,
  config: ProspectionConfig,
  communePrioritaire: boolean,
): ResultatScore {
  const c = config.coefficients;
  const detail: LigneScore[] = [];
  let score = 0;
  const add = (cle: string, label: string, points: number) => {
    if (points === 0) return;
    score += points;
    detail.push({ cle, label, points });
  };

  // Nouveau DPE = signal principal.
  add("nouveau_dpe", "Nouveau DPE détecté", c.nouveauDpe);

  // Fraîcheur du DPE.
  const ageDpe = joursDepuis(opp.dpeDateEtablissement);
  if (ageDpe != null) {
    if (ageDpe <= 7) add("dpe_7j", `DPE réalisé il y a ${Math.max(ageDpe, 0)} j`, c.dpeMoins7j);
    else if (ageDpe <= 30) add("dpe_30j", `DPE réalisé il y a ${ageDpe} j`, c.dpe8a30j);
  }

  // Maison individuelle.
  if ((opp.typeBien || "").toLowerCase() === "maison") add("maison", "Maison individuelle", c.maisonIndividuelle);

  // Secteur commercial prioritaire.
  if (communePrioritaire) add("zone", "Secteur prioritaire", c.zonePrioritaire);

  // Ancienneté de la dernière mutation DVF (plus c'est ancien, plus le
  // propriétaire est susceptible d'avoir un projet). Barème progressif.
  const anneesMut = opp.dvfDerniereMutationDate ? (joursDepuis(opp.dvfDerniereMutationDate) ?? 0) / 365 : null;
  if (anneesMut != null && c.mutationAncienneSeuilAns > 0) {
    const ratio = Math.min(1, anneesMut / c.mutationAncienneSeuilAns);
    const pts = Math.round(ratio * c.mutationAncienneMax);
    if (pts > 0) add("mutation", `Dernière vente il y a ${Math.round(anneesMut)} ans`, pts);
  }

  // Passoire énergétique (F/G) : incitation réglementaire à vendre/rénover.
  if (["F", "G"].includes((opp.dpe || "").toUpperCase())) add("dpe_fg", `Étiquette DPE ${opp.dpe}`, c.dpeFouG);

  // Pénalité : prospecté récemment (dernier passage dans la fenêtre).
  const dernierPassage = (opp.passages ?? []).reduce<number | null>((m, p) => (m == null || p.date > m ? p.date : m), null);
  const refAction = dernierPassage ?? opp.derniereAction ?? null;
  if (refAction != null) {
    const jours = Math.floor((Date.now() - refAction) / JOUR);
    if (jours <= c.penaliteProspecteJours) add("prospecte", `Prospecté il y a ${jours} j`, c.penaliteProspecteRecent);
  }

  // Ajustement manuel / automatique (ex. pénalité après 3 absences).
  if (opp.penaliteManuelle) add("ajustement", "Ajustement", -Math.abs(opp.penaliteManuelle));

  // Bornage 0..100.
  score = Math.max(0, Math.min(100, score));

  const s = config.seuils;
  let niveau: NiveauProspection = "faible";
  if (score >= s.tresPrioritaire) niveau = "tres_prioritaire";
  else if (score >= s.prioritaire) niveau = "prioritaire";
  else if (score >= s.aTravailler) niveau = "a_travailler";

  return { score, niveau, detail };
}

// Applique le score calculé à l'opportunité (mutation d'une copie).
export function appliquerScore(opp: Opportunite, config: ProspectionConfig): Opportunite {
  const prioritaire = !!config.communes.find((cm) => cm.code === opp.codeInsee)?.prioritaire;
  const r = scorerOpportunite(opp, config, prioritaire);
  return { ...opp, score: r.score, niveau: r.niveau, scoreDetail: r.detail, scoreLe: Date.now() };
}
