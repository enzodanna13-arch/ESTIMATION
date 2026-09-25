import type { ClientDossier, RechercheImmo } from "./serverHistory";
import type { EstimationReport, PropertyInput } from "./types";

// Moteur de RAPPROCHEMENT acquéreurs ⇄ biens — modulaire et « souple » :
// chaque critère produit un sous-score dans [0,1] (jamais d'exclusion brutale
// pour un écart mineur). Un score global pondéré est calculé, puis un niveau.
// Conçu comme des fonctions PURES pour pouvoir, plus tard, tourner côté
// serveur ou être remplacé par une analyse IA sans toucher à l'interface.

export interface BienCriteres {
  ville: string;
  codePostal: string;
  quartier: string;
  typeBien: string; // appartement | maison | terrain | immeuble | local
  prix: number | null;
  surface: number | null;
  nbPieces: number | null;
  nbChambres: number | null;
  etage: number | null;
  ascenseur: boolean;
  exterieurs: string[]; // terrasse | balcon | jardin
  garage: boolean;
  stationnement: boolean;
  cave: boolean;
  dpe: string;
  travaux: boolean; // des travaux sont à prévoir
}

// Extraction d'un bien normalisé depuis une estimation
export function bienDepuisEstimation(input: PropertyInput, report?: EstimationReport | null): BienCriteres {
  const prix = report?.prix_presentation || report?.prix_estime || input.prixSouhaiteVendeur || input.prixAffiche || null;
  const ext = (input.exterieur ?? []).map((e) => e.toLowerCase());
  const exterieurs = ["terrasse", "balcon", "jardin"].filter((k) => ext.some((e) => e.includes(k)));
  const stat = (input.stationnement ?? "").toLowerCase();
  const deps = (input.dependances ?? []).map((d) => (d.type ?? "").toLowerCase());
  const garage = /garage|box/.test(stat) || deps.some((d) => /garage|box/.test(d));
  const etageNum = parseInt((input.etage ?? "").replace(/[^0-9]/g, ""), 10);
  return {
    ville: input.ville ?? "",
    codePostal: input.codePostal ?? "",
    quartier: input.quartier ?? "",
    typeBien: input.typeBien ?? "",
    prix,
    surface: input.surfaceHabitable ?? null,
    nbPieces: input.nbPieces ?? null,
    nbChambres: input.nbChambres ?? null,
    etage: Number.isFinite(etageNum) ? etageNum : null,
    ascenseur: !!input.ascenseur,
    exterieurs,
    garage,
    stationnement: !!stat && stat !== "aucun" && stat !== "non",
    cave: !!input.cave,
    dpe: (input.dpe ?? "").toUpperCase().slice(0, 1),
    travaux: (input.travauxAPrevoir ?? []).length > 0 || /rénover|travaux|rafraîch/i.test(input.etatGeneral ?? ""),
  };
}

export type NiveauMatch = "forte" | "interessante" | "possible";
export const NIVEAUX: Record<NiveauMatch, { label: string; min: number; couleur: string }> = {
  forte: { label: "Très forte correspondance", min: 82, couleur: "emerald" },
  interessante: { label: "Correspondance intéressante", min: 62, couleur: "amber" },
  possible: { label: "Correspondance possible", min: 45, couleur: "slate" },
};

export interface CritereDetail {
  cle: string;
  label: string;
  etat: "ok" | "partiel" | "faible";
  texte: string;
}
export interface ResultatMatch {
  score: number; // 0..100
  niveau: NiveauMatch | null; // null = sous le seuil (non retenu)
  details: CritereDetail[];
}

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
const DPE_ORDRE = ["A", "B", "C", "D", "E", "F", "G"];

// Score d'un bien pour UNE recherche
export function scorerRecherche(bien: BienCriteres, r: RechercheImmo): ResultatMatch {
  const details: CritereDetail[] = [];
  let total = 0, poidsTotal = 0;
  const add = (poids: number, sous: number, d: CritereDetail) => {
    total += poids * sous; poidsTotal += poids; details.push(d);
  };
  const etat = (s: number): "ok" | "partiel" | "faible" => (s >= 0.85 ? "ok" : s >= 0.5 ? "partiel" : "faible");

  // Localisation (25)
  if (r.villes.length || r.secteurs.trim()) {
    const villesN = r.villes.map(norm);
    const secteursN = norm(r.secteurs);
    const bv = norm(bien.ville), bq = norm(bien.quartier);
    let s = 0.3;
    if (villesN.some((v) => v && (v === bv || bv.includes(v) || v.includes(bv)))) s = 1;
    else if (secteursN && (secteursN.includes(bq) || (bq && secteursN.includes(bq)))) s = 0.9;
    else if (r.villes.length === 0) s = 0.6;
    add(25, s, { cle: "loc", label: "Localisation", etat: etat(s), texte: s >= 1 ? `${bien.ville} recherchée` : s >= 0.9 ? "Secteur recherché" : `${bien.ville} hors zone prioritaire` });
  }

  // Budget vs prix (25) — SÉLECTIF sur la PROXIMITÉ. On privilégie les
  // acquéreurs dont le budget colle au prix du bien : un bien à 400 000 €
  // cible idéalement un budget ~400 000–450 000 €. Un acquéreur qui vise
  // nettement plus cher (budget très au-dessus) n'est PAS un bon rapprochement
  // (il cherche plus grand / plus haut de gamme) et est fortement déclassé ;
  // un acquéreur qui ne peut pas suivre le prix l'est aussi.
  let budgetSub: number | null = null;
  if (bien.prix != null && (r.budgetMax != null || r.budgetMin != null)) {
    const P = bien.prix;
    const max = r.budgetMax;
    const min = r.budgetMin;
    let s: number, txt: string;
    if (max != null) {
      if (P <= max) {
        const over = (max - P) / P;                       // dépassement du plafond / prix
        if (over <= 0.125) { s = 1; txt = "Budget aligné sur le prix"; }
        else if (over <= 0.40) { s = 1 - ((over - 0.125) / 0.275) * 0.45; txt = `Budget ~${Math.round(over * 100)} % au-dessus du prix`; }
        else if (over <= 0.60) { s = 0.55 - ((over - 0.40) / 0.20) * 0.35; txt = "Vise plus cher que ce bien"; }
        else { s = 0.15; txt = "Vise bien plus cher"; }
      } else {
        const short = (P - max) / P;                       // prix au-dessus du budget
        if (short <= 0.05) { s = 0.7; txt = "Prix juste au-dessus (négociable)"; }
        else if (short <= 0.12) { s = 0.45; txt = `${Math.round(short * 100)} % au-dessus du budget`; }
        else { s = 0.12; txt = `${Math.round(short * 100)} % au-dessus du budget`; }
      }
    } else {
      // seul un budget plancher est renseigné
      s = min != null && P >= min * 0.95 ? 0.8 : 0.5; txt = "Budget indicatif";
    }
    // Bien nettement SOUS le budget minimum visé → l'acquéreur cherche plus haut de gamme.
    if (min != null && P < min * 0.9) { s = Math.min(s, 0.4); txt = "Sous le budget minimum visé"; }
    budgetSub = s;
    add(25, s, { cle: "budget", label: "Budget", etat: etat(s), texte: txt });
  }

  // Type de bien (15)
  if (r.typesBien.length) {
    const s = r.typesBien.map(norm).includes(norm(bien.typeBien)) ? 1 : 0.2;
    add(15, s, { cle: "type", label: "Type de bien", etat: etat(s), texte: s >= 1 ? "Type recherché" : `${bien.typeBien} non ciblé` });
  }

  // Surface (12)
  if (r.surfaceMin != null && bien.surface != null) {
    let s: number;
    if (bien.surface >= r.surfaceMin) s = 1;
    else if (bien.surface >= r.surfaceMin * 0.85) s = 0.6;
    else s = 0.25;
    if (r.surfaceIdeale && bien.surface >= r.surfaceIdeale) s = 1;
    add(12, s, { cle: "surface", label: "Surface", etat: etat(s), texte: `${bien.surface ?? "?"} m² (min ${r.surfaceMin})` });
  }

  // Pièces (8) / chambres (8)
  if (r.piecesMin != null && bien.nbPieces != null) {
    const s = bien.nbPieces >= r.piecesMin ? 1 : bien.nbPieces >= r.piecesMin - 1 ? 0.6 : 0.3;
    add(8, s, { cle: "pieces", label: "Pièces", etat: etat(s), texte: `${bien.nbPieces} pièces (min ${r.piecesMin})` });
  }
  if (r.chambresMin != null && bien.nbChambres != null) {
    const s = bien.nbChambres >= r.chambresMin ? 1 : bien.nbChambres >= r.chambresMin - 1 ? 0.55 : 0.25;
    add(8, s, { cle: "chambres", label: "Chambres", etat: etat(s), texte: `${bien.nbChambres} ch. (min ${r.chambresMin})` });
  }

  // Extérieur (6)
  if (r.exterieurs.length) {
    const s = r.exterieurs.some((e) => bien.exterieurs.includes(norm(e))) ? 1 : 0.35;
    add(6, s, { cle: "ext", label: "Extérieur", etat: etat(s), texte: s >= 1 ? "Extérieur présent" : "Pas d'extérieur correspondant" });
  }

  // Garage / stationnement (4)
  if (r.garage || r.stationnement) {
    const ok = (r.garage && bien.garage) || (r.stationnement && (bien.stationnement || bien.garage));
    const s = ok ? 1 : 0.4;
    add(4, s, { cle: "parking", label: "Stationnement", etat: etat(s), texte: ok ? "Stationnement OK" : "Sans stationnement" });
  }

  // Ascenseur (3)
  if (r.ascenseur === "oui") {
    const s = bien.ascenseur ? 1 : (bien.etage ?? 0) <= 2 ? 0.6 : 0.3;
    add(3, s, { cle: "asc", label: "Ascenseur", etat: etat(s), texte: bien.ascenseur ? "Ascenseur" : "Sans ascenseur" });
  }

  // Travaux (3) — client ne veut PAS de travaux
  if (r.travaux === "non") {
    const s = bien.travaux ? 0.4 : 1;
    add(3, s, { cle: "travaux", label: "Travaux", etat: etat(s), texte: bien.travaux ? "Travaux à prévoir" : "Sans travaux" });
  }

  // DPE (3)
  if (r.dpeMin && bien.dpe) {
    const im = DPE_ORDRE.indexOf(r.dpeMin.toUpperCase());
    const ib = DPE_ORDRE.indexOf(bien.dpe);
    const s = ib >= 0 && im >= 0 ? (ib <= im ? 1 : ib <= im + 1 ? 0.6 : 0.35) : 0.7;
    add(3, s, { cle: "dpe", label: "DPE", etat: etat(s), texte: `DPE ${bien.dpe} (min ${r.dpeMin})` });
  }

  let score = poidsTotal > 0 ? Math.round((total / poidsTotal) * 100) : 0;

  // Sélectivité BUDGET : le budget est un critère décisif du rapprochement.
  // - budget nettement hors cible (vise BIEN plus cher, ou ne peut pas suivre)
  //   → l'acquéreur est ÉCARTÉ (score sous le seuil d'affichage).
  // - budget moyennement décalé → il ne peut pas ressortir en correspondance
  //   forte / intéressante haute : plafonné en « correspondance possible ».
  if (budgetSub != null) {
    if (budgetSub <= 0.2) score = Math.min(score, 40);                                 // écarté (hors cible)
    else if (budgetSub < 0.5) score = Math.min(score, NIVEAUX.interessante.min - 1);   // au mieux « possible »
    else if (budgetSub < 0.999) score = Math.min(score, NIVEAUX.forte.min - 1);        // au mieux « intéressante »
  }

  // Rédhibitoires : si un mot rédhibitoire apparaît dans les caractéristiques
  // clés du bien, on plafonne fortement le score.
  const redhib = norm(r.redhibitoires).split(/[\n,;]+/).map((x) => x.trim()).filter(Boolean);
  if (redhib.length) {
    const foin = norm([bien.ville, bien.quartier, bien.typeBien, bien.travaux ? "travaux" : "", bien.dpe].join(" "));
    if (redhib.some((k) => foin.includes(k))) {
      score = Math.min(score, 30);
      details.push({ cle: "redhib", label: "Critère rédhibitoire", etat: "faible", texte: "Un critère rédhibitoire semble présent" });
    }
  }

  let niveau: NiveauMatch | null = null;
  if (score >= NIVEAUX.forte.min) niveau = "forte";
  else if (score >= NIVEAUX.interessante.min) niveau = "interessante";
  else if (score >= NIVEAUX.possible.min) niveau = "possible";
  return { score, niveau, details };
}

export interface AcquereurMatch {
  dossier: ClientDossier;
  recherche: RechercheImmo;
  resultat: ResultatMatch;
}

// Rapproche un bien avec tous les dossiers acquéreurs/investisseurs.
// Pour chaque dossier, on garde sa MEILLEURE recherche active.
export function rapprocherAcquereurs(bien: BienCriteres, dossiers: ClientDossier[]): AcquereurMatch[] {
  const matches: AcquereurMatch[] = [];
  for (const d of dossiers) {
    if (d.typeClient !== "acquereur" && d.typeClient !== "investisseur") continue;
    const recherches = (d.recherches ?? []).filter((r) => r.actif !== false);
    let best: AcquereurMatch | null = null;
    for (const r of recherches) {
      const resultat = scorerRecherche(bien, r);
      if (resultat.niveau && (!best || resultat.score > best.resultat.score)) best = { dossier: d, recherche: r, resultat };
    }
    if (best) matches.push(best);
  }
  return matches.sort((a, b) => b.resultat.score - a.resultat.score);
}
