import type { ClientDossier, FinancementClient, InvestissementClient, RechercheImmo } from "./serverHistory";

// Catalogues et helpers du CRM acquéreurs / investisseurs (partagés UI).

export const TYPES_BIEN_RECHERCHE = [
  { id: "appartement", label: "Appartement" },
  { id: "maison", label: "Maison" },
  { id: "immeuble", label: "Immeuble" },
  { id: "terrain", label: "Terrain" },
  { id: "local", label: "Local commercial" },
  { id: "garage", label: "Garage" },
  { id: "autre", label: "Autre" },
];

export const EXTERIEURS = [
  { id: "terrasse", label: "Terrasse" },
  { id: "balcon", label: "Balcon" },
  { id: "jardin", label: "Jardin" },
];

export const ETATS_RECHERCHE = [
  { id: "ancien", label: "Ancien" },
  { id: "recent", label: "Récent" },
  { id: "neuf", label: "Neuf" },
];

export const STATUTS_RECHERCHE = [
  "Nouveau", "À qualifier", "Recherche active", "Financement en cours",
  "Financement validé", "Visites en cours", "Offre réalisée", "Sous compromis",
  "Recherche suspendue", "Projet abandonné", "Projet réalisé",
];

export const STATUT_COULEURS: Record<string, string> = {
  Nouveau: "bg-slate-100 text-slate-700",
  "À qualifier": "bg-amber-100 text-amber-700",
  "Recherche active": "bg-emerald-100 text-emerald-700",
  "Financement en cours": "bg-blue-100 text-blue-700",
  "Financement validé": "bg-blue-100 text-blue-800",
  "Visites en cours": "bg-cyan-100 text-cyan-700",
  "Offre réalisée": "bg-violet-100 text-violet-700",
  "Sous compromis": "bg-indigo-100 text-indigo-700",
  "Recherche suspendue": "bg-orange-100 text-orange-700",
  "Projet abandonné": "bg-red-100 text-red-600",
  "Projet réalisé": "bg-green-100 text-green-700",
};

export const OBJECTIFS_INVEST = [
  { id: "locative", label: "Résidence locative" },
  { id: "deficit_foncier", label: "Déficit foncier" },
  { id: "meublee", label: "Location meublée" },
  { id: "lmnp", label: "LMNP" },
  { id: "immeuble_rapport", label: "Immeuble de rapport" },
  { id: "achat_revente", label: "Achat-revente" },
  { id: "autre", label: "Autre" },
];

export const TYPES_TIMELINE = [
  { id: "appel", label: "Appel" },
  { id: "email", label: "Email" },
  { id: "rdv", label: "Rendez-vous" },
  { id: "visite", label: "Visite" },
  { id: "bien_propose", label: "Bien proposé" },
  { id: "retour", label: "Retour sur un bien" },
  { id: "offre", label: "Offre" },
  { id: "criteres", label: "Modification des critères" },
  { id: "note", label: "Note" },
];

export function rechercheVide(libelle = "Recherche principale"): RechercheImmo {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    libelle, actif: true, villes: [], secteurs: "", rayonKm: null, typesBien: [],
    budgetMin: null, budgetMax: null, surfaceMin: null, surfaceIdeale: null,
    piecesMin: null, chambresMin: null, etage: "", ascenseur: "indiff",
    exterieurs: [], garage: false, stationnement: false, cave: false, piscine: false,
    travaux: "indiff", etatRecherche: [], dpeMin: "", indispensables: "",
    secondaires: "", redhibitoires: "", commentaires: "",
  };
}

export function financementVide(): FinancementClient {
  return {
    budgetMax: null, apport: null, montantFinancement: null, financementValide: "non",
    banque: "", courtier: "", accordPrincipe: false, dateAccord: "",
    capaciteEmprunt: null, mensualiteMax: null,
  };
}

export function investissementVide(): InvestissementClient {
  return { objectifs: [], rendementMin: null, loyerCible: null, rentabiliteBrute: null, cashflowMin: null, typeLocation: "", dureeProjet: "" };
}

// Catégories de documents spécifiques aux dossiers acquéreurs / investisseurs
export const CATEGORIES_DOCS_ACQUEREUR = [
  "Pièce d'identité", "Accord de financement", "Simulation bancaire",
  "Attestation bancaire", "Justificatif d'apport", "Avis d'imposition",
  "Documents du courtier", "Offre de prêt", "Autre",
];

// Complétude du dossier (0..100) — pondère les champs ESSENTIELS au
// rapprochement plus fortement, pour inciter à les remplir.
export function completudeDossier(d: ClientDossier): { pct: number; manquants: string[] } {
  const r = d.recherches?.[0];
  const f = d.financement;
  const checks: { ok: boolean; poids: number; label: string; essentiel?: boolean }[] = [
    { ok: !!(d.nom && d.prenom), poids: 1, label: "Identité" },
    { ok: !!(d.tel || d.email), poids: 1, label: "Contact" },
    { ok: !!r && (r.villes.length > 0 || !!r.secteurs.trim()), poids: 2, label: "Localisation recherchée", essentiel: true },
    { ok: !!r && r.typesBien.length > 0, poids: 2, label: "Type de bien", essentiel: true },
    { ok: !!r && r.budgetMax != null, poids: 2, label: "Budget max", essentiel: true },
    { ok: !!r && r.surfaceMin != null, poids: 1, label: "Surface min" },
    { ok: !!r && (r.piecesMin != null || r.chambresMin != null), poids: 1, label: "Pièces / chambres" },
    { ok: !!f && f.financementValide !== "non", poids: 1, label: "Financement" },
    { ok: (d.pieces?.length ?? 0) > 0, poids: 1, label: "Au moins un document" },
    { ok: !!d.statut, poids: 1, label: "Statut" },
  ];
  const total = checks.reduce((s, c) => s + c.poids, 0);
  const acquis = checks.reduce((s, c) => s + (c.ok ? c.poids : 0), 0);
  const manquants = checks.filter((c) => !c.ok).map((c) => c.label + (c.essentiel ? " ★" : ""));
  return { pct: Math.round((acquis / total) * 100), manquants };
}

// Résumé court d'une recherche (pour listes et rapprochement)
export function resumeRecherche(d: ClientDossier): string {
  const r = d.recherches?.[0];
  if (!r) return "Projet à préciser";
  const types = r.typesBien.map((t) => TYPES_BIEN_RECHERCHE.find((x) => x.id === t)?.label ?? t).join("/");
  const lieu = r.villes.join(", ") || r.secteurs || "—";
  const budget = r.budgetMax ? `≤ ${new Intl.NumberFormat("fr-FR").format(r.budgetMax)} €` : "";
  return [types || "Bien", lieu, budget].filter(Boolean).join(" · ");
}
