"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SOURCES_LEAD, STATUTS_LEAD, STATUT_LEAD_COULEURS, SUIVI_TYPES, SUIVI_ACTIONS, TYPES_PROJET_LEAD,
  createLead, deleteLead, listLeads, restaurerLeadsArchives, updateLead,
  listSmsLead, envoyerSmsLead, exporterLeadsCsv, reinitialiserExportLeads,
  type Lead, type SmsRecordClient,
} from "@/lib/leads";
import { createClient } from "@/lib/clients";
import { NEGOCIATEURS } from "@/lib/equipe";
import { buildSmsTemplate, SMS_TYPES_MANUELS, SMS_TYPE_LABELS, type SmsType } from "@/lib/smsTemplates";

const SMS_STATUT_LABEL: Record<string, string> = {
  queued: "En attente", sent: "Envoyé", delivered: "Délivré",
  undelivered: "Non délivré", failed: "Échec", error: "Échec",
};
const SMS_STATUT_CLS: Record<string, string> = {
  delivered: "bg-green-100 text-green-700", sent: "bg-blue-100 text-blue-700",
  queued: "bg-slate-100 text-slate-600", undelivered: "bg-orange-100 text-orange-700",
  failed: "bg-red-100 text-red-600", error: "bg-red-100 text-red-600",
};

const inputCls = "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/20";
const int = new Intl.NumberFormat("fr-FR");
const dateFr = (t: number) => new Date(t).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" });
const labelSource = (id: string) => SOURCES_LEAD.find((s) => s.id === id)?.label ?? id;
const labelProjet = (id: string) => TYPES_PROJET_LEAD.find((t) => t.id === id)?.label ?? id;

const TERMINAUX = ["Prise de mandat", "Converti", "Pas intéressé", "Perdu", "Estimation — sans projet"];
const jour = 86400000;
const joursDepuis = (t: number) => Math.floor((Date.now() - t) / jour);
const finJournee = () => { const d = new Date(); d.setHours(23, 59, 59, 999); return d.getTime(); };
// Un « vrai » suivi = un contact/action consigné (appel, email, RDV, note) :
// la création auto et le transfert/changement de statut ne comptent pas.
const SUIVI_CONTACT = ["appel", "email", "rdv", "note", "repondeur", "estim_sans_projet", "estim_projet", "pas_interesse"];
const aUnSuivi = (l: Lead) => (l.suivi ?? []).some((s) => SUIVI_CONTACT.includes(s.type));
// Un lead « à relancer » : rappel programmé échu, AUCUN suivi consigné, ou
// lead ouvert non traité depuis 2 j.
// Statuts « engagés » (RDV/estimation pris) : le prospect a été traité, il sort
// de « à relancer » (sauf si un rappel programmé arrive à échéance).
const STATUTS_ENGAGES = new Set(["RDV fixé", "Estimation — projet de vente"]);
function aRelancer(l: Lead): boolean {
  if (TERMINAUX.includes(l.statut)) return false; // terminé (Converti, Prise de mandat, Pas intéressé, Perdu, Estim. sans projet)
  if (l.relanceLe && l.relanceLe <= finJournee()) return true; // rappel programmé échu → toujours prioritaire
  if (STATUTS_ENGAGES.has(l.statut)) return false; // RDV fixé / Estimation projet : déjà pris en charge
  // Sinon (Nouveau, À rappeler, Répondeur, Transféré) : à relancer tant qu'aucun
  // contact n'est consigné (appel/email/RDV/note).
  if (!aUnSuivi(l)) return true;
  return false;
}
const ageTexte = (t: number) => { const j = joursDepuis(t); return j <= 0 ? "aujourd'hui" : j === 1 ? "hier" : `il y a ${j} j`; };

// Niveau atteint dans l'entonnoir de conversion (cumulatif) :
// 0 = généré · 1 = contacté · 2 = estimation fixée/faite · 3 = mandat pris.
const STATUTS_CONTACT = new Set(["Répondeur / message laissé", "Converti", "Pas intéressé"]);
const STATUTS_ESTIM = new Set(["RDV fixé", "Estimation — projet de vente", "Estimation — sans projet"]);
function niveauFunnel(l: Lead): number {
  if (l.statut === "Prise de mandat") return 3;
  if (STATUTS_ESTIM.has(l.statut)) return 2;
  if (aUnSuivi(l) || STATUTS_CONTACT.has(l.statut)) return 1;
  return 0;
}

// Analyse des créneaux horaires (heure d'arrivée du lead → issue).
interface CreneauBucket { label: string; n: number; nContact: number; nConv: number; contact: number; conv: number; }
interface CreneauxData {
  parHeure: CreneauBucket[];
  parJour: CreneauBucket[];
  meilleureHeure: CreneauBucket | null;
  meilleurJour: CreneauBucket | null;
  total: number;
  seuil: number;
  maxN: number;
}
const clsTaux = (p: number) => (p >= 50 ? "text-emerald-600" : p >= 25 ? "text-amber-600" : "text-red-500");

export default function LeadsPage({ onRetour }: { onRetour: () => void }) {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [q, setQ] = useState("");
  const [fStatut, setFStatut] = useState("");
  const [fSource, setFSource] = useState("");
  const [fRelance, setFRelance] = useState(false);
  const [fAppeler, setFAppeler] = useState(false);
  const resetFiltres = () => { setFStatut(""); setFRelance(false); setFAppeler(false); };
  const filtrer = (kind: "statut" | "relance" | "appeler", val = "") => {
    setFStatut(kind === "statut" ? (fStatut === val ? "" : val) : "");
    setFRelance(kind === "relance" ? !fRelance : false);
    setFAppeler(kind === "appeler" ? !fAppeler : false);
  };
  const [vue, setVue] = useState<"liste" | "pipeline" | "creneaux">("liste");
  const [sel, setSel] = useState<Lead | null>(null);
  const [creation, setCreation] = useState(false);
  const [config, setConfig] = useState(false);
  const [nouveau, setNouveau] = useState<Partial<Lead>>({ typeProjet: "acquereur", source: "manuel" });

  const [maj, setMaj] = useState(false);
  const recharger = () => { setMaj(true); return listLeads().then(setLeads).catch(() => setLeads([])).finally(() => setTimeout(() => setMaj(false), 400)); };
  useEffect(() => {
    void recharger();
    const t = setInterval(() => { listLeads().then(setLeads).catch(() => {}); }, 30000);
    return () => clearInterval(t);
  }, []);

  const resultats = useMemo(() => {
    let base = leads ?? [];
    const t = q.trim().toLowerCase();
    if (t) base = base.filter((l) => [l.nom, l.prenom, l.tel, l.email, l.ville, l.campagne, l.negociateur, l.message].filter(Boolean).join(" ").toLowerCase().includes(t));
    if (fStatut) base = base.filter((l) => l.statut === fStatut);
    if (fSource) base = base.filter((l) => l.source === fSource);
    if (fRelance) base = base.filter(aRelancer);
    if (fAppeler) base = base.filter((l) => l.statut === "Nouveau" || l.statut === "À rappeler");
    // Liste COMPLÈTE et STABLE : tous les leads générés, du plus récent au plus
    // ancien. On ne réordonne PAS selon le statut/relance, pour qu'un lead ne
    // « bouge » jamais quand on l'attribue — il reste à sa place dans la liste.
    return [...base].sort((a, b) => b.createdAt - a.createdAt);
  }, [leads, q, fStatut, fSource, fRelance, fAppeler]);

  const kpi = useMemo(() => {
    const ls = leads ?? [];
    const c: Record<string, number> = {};
    for (const l of ls) c[l.statut] = (c[l.statut] ?? 0) + 1;
    const aAppeler = (c["Nouveau"] ?? 0) + (c["À rappeler"] ?? 0);
    return {
      c, total: ls.length, aAppeler,
      relancer: ls.filter(aRelancer).length,
      estimationFixee: c["RDV fixé"] ?? 0,
      mandat: c["Prise de mandat"] ?? 0,
    };
  }, [leads]);

  // Entonnoir de conversion par étape (comptes cumulatifs + taux entre étapes)
  const funnel = useMemo(() => {
    const ls = leads ?? [];
    const total = ls.length;
    const contactes = ls.filter((l) => niveauFunnel(l) >= 1).length;
    const estim = ls.filter((l) => niveauFunnel(l) >= 2).length;
    const mandat = ls.filter((l) => niveauFunnel(l) >= 3).length;
    const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);
    return [
      { label: "Leads générés", n: total, pctTotal: 100, conv: null as number | null, depuis: "" },
      { label: "Contactés", n: contactes, pctTotal: pct(contactes, total), conv: pct(contactes, total), depuis: "leads" },
      { label: "Estimation fixée", n: estim, pctTotal: pct(estim, total), conv: pct(estim, contactes), depuis: "contactés" },
      { label: "Prise de mandat", n: mandat, pctTotal: pct(mandat, total), conv: pct(mandat, estim), depuis: "estimation" },
    ];
  }, [leads]);

  // Analyse des CRÉNEAUX HORAIRES : à partir de l'heure d'ARRIVÉE de chaque
  // lead (createdAt, heure locale) et de son issue, on mesure quels créneaux
  // rapportent les leads qui se transforment le mieux. Deux lectures : par
  // tranche horaire (2 h) et par jour de la semaine. Métriques par créneau :
  // volume, taux de contact (au moins un échange consigné) et taux de
  // conversion (mandat pris / converti). Utile pour caler la diffusion des
  // pubs et pour prioriser le rappel des leads « chauds » à la bonne heure.
  const creneaux = useMemo(() => {
    const ls = leads ?? [];
    const converti = (l: Lead) => l.statut === "Prise de mandat" || l.statut === "Converti";
    const contacte = (l: Lead) => niveauFunnel(l) >= 1;

    const agrege = (label: string, items: Lead[]): CreneauBucket => {
      const n = items.length;
      const nContact = items.filter(contacte).length;
      const nConv = items.filter(converti).length;
      return { label, n, nContact, nConv, contact: n ? Math.round((nContact / n) * 100) : 0, conv: n ? Math.round((nConv / n) * 100) : 0 };
    };

    const TRANCHES: [string, number, number][] = [
      ["Nuit · 0h–8h", 0, 8], ["8h–10h", 8, 10], ["10h–12h", 10, 12], ["12h–14h", 12, 14],
      ["14h–16h", 14, 16], ["16h–18h", 16, 18], ["18h–20h", 18, 20], ["20h–00h", 20, 24],
    ];
    const parHeure = TRANCHES.map(([label, h0, h1]) =>
      agrege(label, ls.filter((l) => { const h = new Date(l.createdAt).getHours(); return h >= h0 && h < h1; })),
    );

    // Semaine du lundi au dimanche (getDay : 0 = dimanche)
    const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const parJour = JOURS.map((label, i) => {
      const js = (i + 1) % 7; // Lundi → 1 … Dimanche → 0
      return agrege(label, ls.filter((l) => new Date(l.createdAt).getDay() === js));
    });

    // Meilleur créneau : on classe d'abord par conversion (avec un minimum de
    // volume pour éviter qu'un 1/1 = 100 % ne fausse tout) ; si les mandats
    // sont encore trop rares, on bascule sur le taux de contact.
    const total = ls.length;
    const seuil = Math.max(3, Math.round(total * 0.04));
    const meilleur = (buckets: CreneauBucket[]): CreneauBucket | null => {
      const eligibles = buckets.filter((b) => b.n >= seuil);
      const pool = eligibles.length ? eligibles : buckets.filter((b) => b.n > 0);
      if (pool.length === 0) return null;
      const parConv = [...pool].sort((a, b) => b.conv - a.conv || b.n - a.n);
      if (parConv[0].nConv > 0) return parConv[0];
      return [...pool].sort((a, b) => b.contact - a.contact || b.n - a.n)[0]; // pas encore de mandat : on se base sur le contact
    };

    return { parHeure, parJour, meilleureHeure: meilleur(parHeure), meilleurJour: meilleur(parJour), total, seuil, maxN: Math.max(1, ...parHeure.map((b) => b.n), ...parJour.map((b) => b.n)) };
  }, [leads]);

  const majLead = async (id: string, patch: Partial<Lead>) => {
    const m = await updateLead(id, patch);
    if (m) { setSel((s) => (s?.id === id ? m : s)); setLeads((ls) => (ls ?? []).map((l) => (l.id === id ? m : l))); }
    return m;
  };
  const changerStatut = async (l: Lead, statut: string) => {
    const suivi = [{ id: `${Date.now()}`, date: Date.now(), type: "statut", texte: `Statut : ${statut}`, auteur: l.negociateur || "—" }, ...l.suivi];
    // Passer à un statut terminal/actif efface la relance en attente
    const patch: Partial<Lead> = { statut, suivi };
    if (TERMINAUX.includes(statut)) patch.relanceLe = null;
    await majLead(l.id, patch);
  };
  const avancer = async (l: Lead, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const i = STATUTS_LEAD.indexOf(l.statut);
    if (i >= 0 && i < STATUTS_LEAD.length - 1) await changerStatut(l, STATUTS_LEAD[i + 1]);
  };
  const reculer = async (l: Lead, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const i = STATUTS_LEAD.indexOf(l.statut);
    if (i > 0) await changerStatut(l, STATUTS_LEAD[i - 1]);
  };
  const ajouterSuivi = async (l: Lead, type: string, texte: string) => {
    const def = SUIVI_TYPES.find((t) => t.id === type);
    // Le texte est facultatif pour les types « à sens unique » (ex. « Pas
    // intéressé », « Estimation faite… ») : on retombe sur le libellé du type.
    const txt = texte.trim() || def?.label || "";
    if (!txt) return;
    const suivi = [{ id: `${Date.now()}`, date: Date.now(), type, texte: txt, auteur: l.negociateur || "—" }, ...l.suivi];
    const patch: Partial<Lead> = { suivi };
    // Certains suivis font avancer le statut automatiquement (RDV, pas intéressé…)
    if (def?.statut && def.statut !== l.statut) patch.statut = def.statut;
    await majLead(l.id, patch);
  };
  // Réattribution : négociateur + trace de suivi (+ statut) en UN SEUL
  // enregistrement, pour ne jamais déclencher deux écritures simultanées.
  // Changer / corriger le négociateur en charge. Une simple correction ne
  // modifie PAS le statut ; une première attribution depuis « Nouveau » passe
  // le lead en « Transféré ». On peut aussi retirer l'attribution (vide).
  const transferer = async (l: Lead, negociateur: string) => {
    const nv = negociateur.trim();
    if (nv === (l.negociateur ?? "").trim()) return; // aucun changement
    // Attribuer NE CHANGE PAS le statut : le lead garde sa place dans la liste
    // principale (attribution et statut sont deux axes indépendants).
    const texte = nv ? `Négociateur en charge : ${nv}` : "Attribution retirée";
    const suivi = [{ id: `${Date.now()}`, date: Date.now(), type: "transfert", texte, auteur: nv || l.negociateur || "—" }, ...l.suivi];
    await majLead(l.id, { negociateur: nv, suivi });
  };
  const creerLead = async () => {
    if (!nouveau.nom?.trim() && !nouveau.tel?.trim() && !nouveau.email?.trim()) return;
    const l = await createLead(nouveau);
    if (l) { setCreation(false); setNouveau({ typeProjet: "acquereur", source: "manuel" }); void recharger(); setSel(l); }
  };
  const convertir = async (l: Lead) => {
    if (l.dossierId) return alert("Ce lead est déjà converti en dossier.");
    const type = l.typeProjet === "investisseur" ? "investisseur" : l.typeProjet === "vendeur" ? "vendeur" : "acquereur";
    const d = await createClient({ nom: l.nom || "Lead", bien: [l.ville, l.message].filter(Boolean).join(" — "), prenom: l.prenom, tel: l.tel, email: l.email, negociateur: l.negociateur, typeClient: type });
    if (!d) return alert("Conversion impossible.");
    // Un dossier VENDEUR = une prise de mandat : le lead passe automatiquement
    // en « Prise de mandat ». Acquéreur / investisseur → « Converti ».
    const statut = type === "vendeur" ? "Prise de mandat" : "Converti";
    const texteSuivi = type === "vendeur" ? "Prise de mandat — dossier vendeur créé" : `Converti en dossier ${type}`;
    const suivi = [{ id: `${Date.now()}`, date: Date.now(), type: "conversion", texte: texteSuivi, auteur: l.negociateur || "—" }, ...l.suivi];
    await majLead(l.id, { statut, dossierId: d.id, relanceLe: null, suivi });
    alert(`Dossier ${type} créé${type === "vendeur" ? " — lead passé en « Prise de mandat »" : ""}. Retrouvez-le dans « Dossiers clients ».`);
  };
  const supprimer = async (l: Lead) => { if (confirm("Supprimer ce lead ?")) { await deleteLead(l.id); setSel(null); void recharger(); } };

  const [restauration, setRestauration] = useState(false);
  const restaurer = async () => {
    setRestauration(true);
    const r = await restaurerLeadsArchives();
    await recharger();
    setRestauration(false);
    if (r) alert(r.restaures > 0 ? `✓ ${r.restaures} lead(s) restauré(s) depuis l'archive.` : "Aucun lead à restaurer — tous vos leads sont déjà présents.");
    else alert("Restauration impossible — réessayez.");
  };

  // Export CSV pour systeme.io — panneau de choix : statuts, avec/sans email,
  // et « nouveaux uniquement » (anti-doublon désactivable).
  const [exportPanel, setExportPanel] = useState(false);
  const [exportEnCours, setExportEnCours] = useState(false);
  const [expStatuts, setExpStatuts] = useState<Set<string>>(new Set());
  const [expAvecEmail, setExpAvecEmail] = useState(true);
  const [expNouveaux, setExpNouveaux] = useState(true);
  const [expJours, setExpJours] = useState(0); // 0 = tous, 1/2/3 = N derniers jours

  const toggleStatut = (s: string) => setExpStatuts((prev) => { const n = new Set(prev); if (n.has(s)) n.delete(s); else n.add(s); return n; });

  // Combien de contacts correspondent aux filtres (calculé côté client).
  const compteExport = useMemo(() => {
    const aMail = (l: Lead) => /.+@.+\..+/.test((l.email ?? "").trim());
    const seuil = expJours > 0 ? Date.now() - expJours * 86400000 : null;
    return (leads ?? []).filter((l) => {
      if (expStatuts.size > 0 && !expStatuts.has(l.statut)) return false;
      if (expAvecEmail && !aMail(l)) return false;
      if (expNouveaux && l.exporteLe) return false;
      if (seuil !== null && l.createdAt < seuil) return false;
      return true;
    }).length;
  }, [leads, expStatuts, expAvecEmail, expNouveaux, expJours]);

  const exporterCsv = async () => {
    setExportEnCours(true);
    const r = await exporterLeadsCsv({ statuts: [...expStatuts], avecEmail: expAvecEmail, nouveauxUniquement: expNouveaux, joursMax: expJours });
    setExportEnCours(false);
    if (!r) { alert("Export impossible — réessayez."); return; }
    if (r.count === 0) { alert("Aucun contact ne correspond à ces filtres.\nAstuce : décochez « Uniquement les nouveaux » pour ré-exporter, ou « Avec email uniquement »."); return; }
    const blob = new Blob([r.csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-systemeio-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    await recharger();
    alert(`✓ ${r.count} contact(s) exporté(s). Importez ce fichier dans systeme.io (Contacts → Importer).`);
  };
  const reinitExport = async () => {
    if (!confirm("Réinitialiser le marquage d'export ? Tous les contacts pourront à nouveau être exportés (utile en cas d'erreur).")) return;
    const n = await reinitialiserExportLeads();
    await recharger();
    alert(n != null ? `✓ ${n} contact(s) réinitialisé(s). Ils ressortiront au prochain export.` : "Réinitialisation impossible.");
  };

  const KpiCase = ({ v, l, accent, onClick, actif }: { v: string | number; l: string; accent?: string; onClick?: () => void; actif?: boolean }) => (
    <button type="button" onClick={onClick} className={`rounded-xl border p-3 text-left transition ${actif ? "border-copper ring-2 ring-copper/30" : "border-slate-200 hover:border-copper/50"} ${onClick ? "cursor-pointer" : "cursor-default"} bg-white`}>
      <div className={`text-xl font-extrabold ${accent ?? "text-navy"}`}>{v}</div>
      <div className="text-[11px] font-semibold text-slate-500">{l}</div>
    </button>
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-navy">📥 Leads entrant</h2>
          <p className="text-sm text-slate-500">Liste complète de tous vos leads générés. Attribuer un lead l&apos;ajoute à l&apos;espace du négociateur — sans jamais le retirer d&apos;ici.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">← Accueil</button>
          <button onClick={() => void recharger()} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">{maj ? "⏳" : "🔄"} Actualiser</button>
          <button onClick={() => void restaurer()} disabled={restauration} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50" title="Récupérer les leads éventuellement perdus, depuis l'archive de sécurité">{restauration ? "⏳ Restauration…" : "♻️ Restaurer les leads perdus"}</button>
          <button onClick={() => setConfig(!config)} className="rounded-lg border border-copper bg-white px-3 py-1.5 text-sm font-bold text-copper hover:bg-copper-soft/40">🔌 Brancher mes campagnes</button>
          <button onClick={() => setExportPanel(!exportPanel)} className={`rounded-lg border px-3 py-1.5 text-sm font-semibold hover:bg-slate-100 ${exportPanel ? "border-copper text-copper" : "border-slate-300 text-slate-600"}`} title="Exporter en CSV pour systeme.io — choix des statuts">⬇️ Export CSV</button>
          <button onClick={() => setCreation(!creation)} className="rounded-lg bg-copper px-4 py-1.5 text-sm font-bold text-white hover:brightness-110">+ Nouveau lead</button>
        </div>
      </div>

      {exportPanel && (
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3">
          <div className="mb-1 text-sm font-bold text-navy">Export CSV pour systeme.io</div>
          <p className="mb-2 text-xs text-slate-500">Choisis les statuts à extraire. Le fichier se télécharge, prêt à importer dans systeme.io.</p>
          <div className="mb-2 text-[11px] font-semibold uppercase text-slate-400">Statuts <span className="normal-case text-slate-400">(aucun coché = tous)</span></div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {STATUTS_LEAD.map((s) => (
              <button key={s} onClick={() => toggleStatut(s)} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${expStatuts.has(s) ? "bg-navy text-white" : STATUT_LEAD_COULEURS[s] ?? "bg-slate-100 text-slate-600"}`}>{s}</button>
            ))}
          </div>
          <div className="mb-2 text-[11px] font-semibold uppercase text-slate-400">Période de réception</div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {[[0, "Tous"], [1, "Dernier jour"], [2, "2 derniers jours"], [3, "3 derniers jours"]].map(([v, lbl]) => (
              <button key={v} onClick={() => setExpJours(v as number)} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${expJours === v ? "bg-navy text-white" : "bg-slate-100 text-slate-600"}`}>{lbl}</button>
            ))}
          </div>
          <div className="mb-3 flex flex-wrap gap-4 text-sm text-slate-600">
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={expAvecEmail} onChange={(e) => setExpAvecEmail(e.target.checked)} /> Avec email uniquement</label>
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={expNouveaux} onChange={(e) => setExpNouveaux(e.target.checked)} /> Uniquement les nouveaux (jamais exportés)</label>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => void exporterCsv()} disabled={exportEnCours || compteExport === 0} className="rounded-lg bg-copper px-4 py-1.5 text-sm font-bold text-white hover:brightness-110 disabled:opacity-50">{exportEnCours ? "⏳ Export…" : `⬇️ Télécharger (${compteExport})`}</button>
            <span className="text-xs text-slate-500">{compteExport} contact(s) correspondent aux filtres.</span>
            <button onClick={() => void reinitExport()} className="ml-auto rounded-lg px-2 py-1 text-xs text-slate-400 hover:text-copper" title="Repasser tous les contacts comme non exportés">↺ Réinitialiser les exports</button>
          </div>
        </div>
      )}

      {config && <ConfigPasserelle />}

      {creation && (
        <div className="mb-4 grid gap-3 rounded-2xl border border-copper/40 bg-copper-soft/30 p-4 sm:grid-cols-3">
          <input className={inputCls} placeholder="Nom" value={nouveau.nom ?? ""} onChange={(e) => setNouveau({ ...nouveau, nom: e.target.value })} />
          <input className={inputCls} placeholder="Prénom" value={nouveau.prenom ?? ""} onChange={(e) => setNouveau({ ...nouveau, prenom: e.target.value })} />
          <input className={inputCls} placeholder="Téléphone" value={nouveau.tel ?? ""} onChange={(e) => setNouveau({ ...nouveau, tel: e.target.value })} />
          <input className={inputCls} placeholder="Email" value={nouveau.email ?? ""} onChange={(e) => setNouveau({ ...nouveau, email: e.target.value })} />
          <input className={inputCls} placeholder="Ville / secteur" value={nouveau.ville ?? ""} onChange={(e) => setNouveau({ ...nouveau, ville: e.target.value })} />
          <select className={inputCls} value={nouveau.typeProjet} onChange={(e) => setNouveau({ ...nouveau, typeProjet: e.target.value })}>{TYPES_PROJET_LEAD.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</select>
          <textarea className={`${inputCls} sm:col-span-2`} rows={2} placeholder="Message / demande" value={nouveau.message ?? ""} onChange={(e) => setNouveau({ ...nouveau, message: e.target.value })} />
          <button onClick={() => void creerLead()} className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white hover:bg-navy-deep">Créer le lead</button>
        </div>
      )}

      {/* KPI cliquables */}
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCase v={kpi.total} l="Total leads" onClick={() => resetFiltres()} actif={!fStatut && !fRelance && !fAppeler} />
        <KpiCase v={kpi.aAppeler} l="À appeler" accent="text-amber-600" onClick={() => filtrer("appeler")} actif={fAppeler} />
        <KpiCase v={kpi.relancer} l="À relancer" accent="text-red-600" onClick={() => filtrer("relance")} actif={fRelance} />
        <KpiCase v={kpi.estimationFixee} l="Estimation fixée" accent="text-violet-600" onClick={() => filtrer("statut", "RDV fixé")} actif={fStatut === "RDV fixé"} />
        <KpiCase v={kpi.mandat} l="Mandat" accent="text-teal-700" onClick={() => filtrer("statut", "Prise de mandat")} actif={fStatut === "Prise de mandat"} />
      </div>

      {/* Entonnoir : taux de conversion par étape */}
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-3 text-sm font-bold text-navy">📈 Taux de conversion par étape</div>
        <div className="space-y-2">
          {funnel.map((e, i) => (
            <div key={e.label} className="flex items-center gap-3">
              <div className="w-36 shrink-0 text-sm font-semibold text-slate-700">{e.label}</div>
              <div className="relative h-6 flex-1 overflow-hidden rounded-lg bg-slate-100">
                <div className={`h-full rounded-lg ${i === 0 ? "bg-navy" : i === 1 ? "bg-amber-400" : i === 2 ? "bg-violet-400" : "bg-teal-500"}`} style={{ width: `${Math.max(e.pctTotal, 3)}%` }} />
                <span className="absolute inset-y-0 left-2 flex items-center text-xs font-bold text-slate-700">{e.n} · {e.pctTotal}%</span>
              </div>
              <div className="w-40 shrink-0 text-right text-xs">
                {e.conv === null ? <span className="text-slate-400">base 100 %</span> : (
                  <span className={`font-semibold ${e.conv >= 50 ? "text-emerald-600" : e.conv >= 25 ? "text-amber-600" : "text-red-500"}`}>
                    {e.conv}% <span className="font-normal text-slate-400">depuis {e.depuis}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Chaque étape est cumulative : « Contactés » inclut ceux allés plus loin. Le taux à droite = conversion depuis l&apos;étape précédente.
          Conversion globale leads → mandat : <span className="font-semibold text-teal-700">{funnel[0].n ? Math.round((funnel[3].n / funnel[0].n) * 100) : 0}%</span>.
        </p>
      </div>

      {/* Barre d'outils : recherche, source, vue */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input className={`${inputCls} max-w-xs flex-1`} placeholder="🔎 Nom, tél, ville, campagne…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={`${inputCls} w-auto`} value={fSource} onChange={(e) => setFSource(e.target.value)}><option value="">Toutes sources</option>{SOURCES_LEAD.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
        <div className="ml-auto inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-semibold">
          <button onClick={() => setVue("liste")} className={`rounded-md px-3 py-1 transition ${vue === "liste" ? "bg-copper text-white" : "text-slate-600 hover:bg-slate-100"}`}>≣ Liste</button>
          <button onClick={() => setVue("pipeline")} className={`rounded-md px-3 py-1 transition ${vue === "pipeline" ? "bg-copper text-white" : "text-slate-600 hover:bg-slate-100"}`}>🗂️ Pipeline</button>
          <button onClick={() => setVue("creneaux")} className={`rounded-md px-3 py-1 transition ${vue === "creneaux" ? "bg-copper text-white" : "text-slate-600 hover:bg-slate-100"}`}>⏰ Créneaux</button>
        </div>
      </div>

      {/* Filtres statut (chips) */}
      {vue === "liste" && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          <button onClick={() => resetFiltres()} className={`rounded-full px-3 py-1 text-xs font-semibold ${!fStatut && !fRelance && !fAppeler ? "bg-navy text-white" : "border border-slate-200 bg-white text-slate-600"}`}>Tous ({kpi.total})</button>
          {STATUTS_LEAD.map((s) => (
            <button key={s} onClick={() => filtrer("statut", s)} className={`rounded-full px-3 py-1 text-xs font-semibold ${fStatut === s ? "ring-2 ring-navy " : ""}${STATUT_LEAD_COULEURS[s]}`}>{s} ({kpi.c[s] ?? 0})</button>
          ))}
        </div>
      )}

      {leads === null ? <p className="text-sm text-slate-400">Chargement…</p> : (leads.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-400">Aucun lead. Branchez vos campagnes (bouton « Brancher mes campagnes ») ou créez un lead manuellement.</p>
      ) : vue === "liste" ? (
        resultats.length === 0 ? <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-400">Aucun lead ne correspond à ces filtres.</p> : (
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {resultats.map((l) => {
              const relance = aRelancer(l);
              const i = STATUTS_LEAD.indexOf(l.statut);
              return (
                <div key={l.id} onClick={() => setSel(l)} className={`cursor-pointer rounded-2xl border bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${relance ? "border-red-300 ring-1 ring-red-200" : "border-slate-200 hover:border-copper/50"}`}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUT_LEAD_COULEURS[l.statut] ?? "bg-slate-100 text-slate-600"}`}>{l.statut}</span>
                    {relance && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">⏰ À relancer</span>}
                  </div>
                  <div className="text-sm font-bold text-navy">{[l.prenom, l.nom].filter(Boolean).join(" ") || "—"}</div>
                  <div className="truncate text-xs text-slate-500">{[labelProjet(l.typeProjet), l.ville, l.budget != null ? `${int.format(l.budget)} €` : ""].filter(Boolean).join(" · ")}</div>
                  <div className="mt-0.5 text-[11px] text-slate-400">{labelSource(l.source)} · reçu {ageTexte(l.createdAt)}{l.negociateur ? ` · 👤 ${l.negociateur}` : ""}</div>
                  <div className="mt-2 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {l.tel && <a href={`tel:${l.tel}`} className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100" title="Appeler">📞</a>}
                    {l.email && <a href={`mailto:${l.email}`} className="rounded-lg bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100" title="Envoyer un email">✉</a>}
                    <button onClick={(e) => void reculer(l, e)} disabled={i <= 0} className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-30" title="Statut précédent">‹</button>
                    <button onClick={(e) => void avancer(l, e)} disabled={i >= STATUTS_LEAD.length - 1} className="rounded-lg bg-navy px-2 py-1 text-xs font-semibold text-white hover:bg-navy-deep disabled:opacity-30" title="Avancer au statut suivant">Avancer ›</button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : vue === "creneaux" ? (
        /* Vue Créneaux horaires : quels créneaux d'arrivée convertissent le mieux */
        <CreneauxView data={creneaux} />
      ) : (
        /* Vue Pipeline (kanban) */
        <div className="flex gap-3 overflow-x-auto pb-3">
          {STATUTS_LEAD.map((col) => {
            const cartes = resultats.filter((l) => l.statut === col);
            return (
              <div key={col} className="flex w-64 shrink-0 flex-col rounded-2xl bg-slate-50 p-2">
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUT_LEAD_COULEURS[col] ?? "bg-slate-100 text-slate-600"}`}>{col}</span>
                  <span className="text-xs font-semibold text-slate-400">{cartes.length}</span>
                </div>
                <div className="space-y-2">
                  {cartes.map((l) => {
                    const relance = aRelancer(l);
                    const i = STATUTS_LEAD.indexOf(l.statut);
                    return (
                      <div key={l.id} onClick={() => setSel(l)} className={`cursor-pointer rounded-xl border bg-white p-2.5 shadow-sm ${relance ? "border-red-300" : "border-slate-200"}`}>
                        <div className="text-sm font-bold text-navy">{[l.prenom, l.nom].filter(Boolean).join(" ") || "—"}</div>
                        <div className="truncate text-xs text-slate-500">{[l.ville, l.budget != null ? `${int.format(l.budget)} €` : "", labelProjet(l.typeProjet)].filter(Boolean).join(" · ")}</div>
                        <div className="text-[11px] text-slate-400">reçu {ageTexte(l.createdAt)}{relance ? " · ⏰" : ""}</div>
                        <div className="mt-1.5 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-1">
                            {l.tel && <a href={`tel:${l.tel}`} className="rounded px-1.5 py-0.5 text-emerald-600 hover:bg-emerald-50" title="Appeler">📞</a>}
                            <button onClick={(e) => void reculer(l, e)} disabled={i <= 0} className="rounded px-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-30">‹</button>
                            <button onClick={(e) => void avancer(l, e)} disabled={i >= STATUTS_LEAD.length - 1} className="rounded px-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-30">›</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {cartes.length === 0 && <div className="rounded-lg border border-dashed border-slate-200 px-2 py-3 text-center text-[11px] text-slate-300">—</div>}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {sel && <FicheLead key={sel.id} lead={sel} onClose={() => setSel(null)} onStatut={changerStatut} onSuivi={ajouterSuivi} onPatch={majLead} onTransfert={transferer} onConvert={convertir} onDelete={supprimer} />}
    </div>
  );
}

function ConfigPasserelle() {
  const [origin, setOrigin] = useState("");
  useEffect(() => { setOrigin(window.location.origin); }, []);
  return (
    <div className="mb-4 rounded-2xl border border-copper/40 bg-white p-4 text-sm">
      <div className="mb-2 font-bold text-navy">🔌 Brancher vos campagnes (Facebook / Instagram Ads)</div>
      <ol className="ml-4 list-decimal space-y-1.5 text-slate-600">
        <li><b>Le plus simple (Zapier / Make)</b> : créez un scénario « Nouveau lead Facebook » → action « Webhook POST » vers <code className="rounded bg-slate-100 px-1">{origin}/api/leads</code>, en-tête <code className="rounded bg-slate-100 px-1">x-leads-key: VOTRE_SECRET</code>, corps JSON avec nom, prenom, tel, email, ville, message, source.</li>
        <li><b>Intégration native Meta</b> : dans votre App Meta, ajoutez le webhook <code className="rounded bg-slate-100 px-1">{origin}/api/leads/facebook</code> (champ <i>leadgen</i>), token de vérification <code className="rounded bg-slate-100 px-1">META_VERIFY_TOKEN</code>. Les leads arrivent automatiquement.</li>
      </ol>
      <p className="mt-2 text-xs text-slate-400">Variables à définir sur Vercel : <code>LEADS_INBOUND_SECRET</code> (Zapier/Make), <code>META_VERIFY_TOKEN</code> + <code>META_PAGE_TOKEN</code> (natif). Donnez-moi le feu vert et je peux les configurer.</p>
    </div>
  );
}

// Bloc SMS de la fiche lead : dernier SMS, envoi manuel (relances + message
// personnalisé) avec aperçu, garde-fou d'attribution, et historique complet.
function SmsBloc({ lead }: { lead: Lead }) {
  const [sms, setSms] = useState<SmsRecordClient[]>([]);
  const [ouvert, setOuvert] = useState(false);
  const [type, setType] = useState<SmsType>("NO_ANSWER");
  const [custom, setCustom] = useState("");
  const [busy, setBusy] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const recharger = () => { void listSmsLead(lead.id).then(setSms); };
  useEffect(() => { void listSmsLead(lead.id).then(setSms); }, [lead.id]);

  const agentNom = (lead.negociateur ?? "").trim();
  const tpl = buildSmsTemplate(type, lead, agentNom || undefined, custom);
  const manqueNego = tpl.requiresAgent && !agentNom;
  const apercu = tpl.body;

  const envoyer = async () => {
    setBusy(true); setErreur(null); setOk(null);
    const r = await envoyerSmsLead(lead.id, type as "NO_ANSWER" | "NOT_INTERESTED" | "CUSTOM", custom);
    setBusy(false);
    if (r.error) { setErreur(r.error); return; }
    setOk("SMS envoyé."); setCustom(""); setOuvert(false); recharger();
  };

  const dernier = sms[0];
  return (
    <div className="mt-3 rounded-lg border border-slate-200 p-2.5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase text-slate-400">📩 SMS</div>
        <button onClick={() => { setOuvert((o) => !o); setErreur(null); setOk(null); }} className="rounded-lg bg-copper px-3 py-1 text-xs font-bold text-white transition hover:brightness-110">Envoyer un SMS</button>
      </div>
      {dernier ? (
        <div className="mt-1 text-xs text-slate-500">Dernier : {new Date(dernier.createdAt).toLocaleString("fr-FR")} · {SMS_TYPE_LABELS[dernier.type as SmsType] ?? dernier.type} · <span className={`rounded px-1.5 py-0.5 font-semibold ${SMS_STATUT_CLS[dernier.status] ?? ""}`}>{SMS_STATUT_LABEL[dernier.status] ?? dernier.status}</span></div>
      ) : <div className="mt-1 text-xs text-slate-400">Aucun SMS envoyé.</div>}

      {ouvert && (
        <div className="mt-2 space-y-2 rounded-lg bg-slate-50 p-2">
          <div className="flex flex-wrap gap-1.5">
            {SMS_TYPES_MANUELS.map((t) => (
              <button key={t} onClick={() => setType(t)} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${type === t ? "bg-navy text-white" : "border border-slate-200 bg-white text-slate-600"}`}>{SMS_TYPE_LABELS[t]}</button>
            ))}
          </div>
          {type === "CUSTOM" && (
            <div>
              <textarea className={`${inputCls} h-20`} value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Votre message…" />
              <div className="text-right text-[11px] text-slate-400">{apercu.length} caractères{apercu.length > 160 ? ` · ${Math.ceil(apercu.length / 153)} SMS` : ""}</div>
            </div>
          )}
          <div className="rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-600">
            <div><b>Destinataire :</b> {[lead.prenom, lead.nom].filter(Boolean).join(" ") || "—"} · {lead.tel || "numéro manquant"}</div>
            <div><b>Négociatrice :</b> {lead.negociateur || "non attribuée"} · <b>Type :</b> {SMS_TYPE_LABELS[type]}</div>
            <div className="mt-1 whitespace-pre-wrap border-t border-slate-100 pt-1 text-slate-700">{apercu || "…"}</div>
          </div>
          {manqueNego && <div className="rounded bg-amber-50 p-1.5 text-[11px] text-amber-700">Attribuez d&apos;abord ce lead à une négociatrice avant d&apos;envoyer cette relance.</div>}
          {erreur && <div className="rounded bg-red-50 p-1.5 text-[11px] text-red-700">{erreur}</div>}
          <button disabled={busy || manqueNego || !lead.tel || (type === "CUSTOM" && !custom.trim())} onClick={() => void envoyer()} className="w-full rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{busy ? "Envoi…" : "Envoyer le SMS"}</button>
        </div>
      )}
      {ok && <div className="mt-1 text-[11px] text-emerald-600">✓ {ok}</div>}

      {sms.length > 0 && (
        <div className="mt-2 space-y-1">
          <div className="text-[11px] font-semibold uppercase text-slate-400">Historique</div>
          {sms.map((s) => (
            <div key={s.id} className="rounded border border-slate-100 px-2 py-1 text-[11px] text-slate-600">
              <div className="flex items-center justify-between gap-2">
                <span>{new Date(s.createdAt).toLocaleString("fr-FR")} · <b>{SMS_TYPE_LABELS[s.type as SmsType] ?? s.type}</b>{s.agent ? ` · ${s.agent}` : ""}</span>
                <span className={`shrink-0 rounded px-1.5 py-0.5 font-semibold ${SMS_STATUT_CLS[s.status] ?? ""}`}>{SMS_STATUT_LABEL[s.status] ?? s.status}</span>
              </div>
              <div className="text-slate-400">{s.recipient}{s.errorMessage ? ` · ${s.errorMessage}` : ""}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function FicheLead({ lead, onClose, onStatut, onSuivi, onPatch, onTransfert, onConvert, onDelete }: {
  lead: Lead; onClose: () => void;
  onStatut: (l: Lead, s: string) => void; onSuivi: (l: Lead, t: string, txt: string) => void;
  onPatch: (id: string, p: Partial<Lead>) => Promise<Lead | null>; onTransfert: (l: Lead, nego: string) => void; onConvert: (l: Lead) => void; onDelete: (l: Lead) => void;
}) {
  const [type, setType] = useState(SUIVI_TYPES[0].id);
  const [texte, setTexte] = useState("");
  const [notes, setNotes] = useState(lead.notes);
  const [prenom, setPrenom] = useState(lead.prenom);
  const [nom, setNom] = useState(lead.nom);
  const [tel, setTel] = useState(lead.tel);
  const [email, setEmail] = useState(lead.email);
  const [copie, setCopie] = useState(false);

  const relanceISO = lead.relanceLe ? new Date(lead.relanceLe).toISOString().slice(0, 10) : "";
  const relanceEchue = lead.relanceLe && lead.relanceLe <= finJournee() && !TERMINAUX.includes(lead.statut);
  const definirRelance = (dans: number) => { const d = new Date(); d.setHours(9, 0, 0, 0); d.setDate(d.getDate() + dans); void onPatch(lead.id, { relanceLe: d.getTime() }); };

  const ficheEnTexte = (l: Lead): string =>
    [
      "🔔 LEAD — " + labelProjet(l.typeProjet),
      "",
      ["Nom", [l.prenom, l.nom].filter(Boolean).join(" ")],
      ["Téléphone", l.tel],
      ["Email", l.email],
      ["Ville", l.ville],
      l.budget != null ? ["Budget", `${int.format(l.budget)} €`] : null,
      ["Demande", l.message],
      ["Source", `${labelSource(l.source)}${l.campagne ? ` (${l.campagne})` : ""}`],
      ["Statut", l.statut],
      ["Négociateur", l.negociateur],
      ["Reçu le", new Date(l.createdAt).toLocaleString("fr-FR")],
    ]
      .filter(Boolean)
      .map((e) => (Array.isArray(e) ? (e[1] && String(e[1]).trim() ? `${e[0]} : ${e[1]}` : "") : e))
      .filter((x) => x !== "")
      .join("\n");
  const copierFiche = async () => { try { await navigator.clipboard.writeText(ficheEnTexte(lead)); setCopie(true); setTimeout(() => setCopie(false), 1800); } catch { /* indisponible */ } };

  const i = STATUTS_LEAD.indexOf(lead.statut);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between">
          <div>
            <div className="text-lg font-bold text-navy">{[lead.prenom, lead.nom].filter(Boolean).join(" ") || "Lead"}</div>
            <div className="text-xs text-slate-500">{labelSource(lead.source)}{lead.campagne ? ` · ${lead.campagne}` : ""} · reçu le {new Date(lead.createdAt).toLocaleString("fr-FR")}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => void copierFiche()} className="rounded-lg bg-copper px-3 py-1.5 text-sm font-bold text-white transition hover:brightness-110">{copie ? "✓ Copié" : "📋 Copier la fiche"}</button>
            <button onClick={onClose} className="rounded-lg border border-slate-200 px-2 py-1 text-sm text-slate-500 hover:bg-slate-100">✕</button>
          </div>
        </div>

        {/* Identité + coordonnées éditables (souvent absentes des leads entrants) */}
        <div className="mb-3 grid gap-2 rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 sm:grid-cols-2">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Prénom
            <input className={`${inputCls} mt-0.5`} value={prenom} onChange={(e) => setPrenom(e.target.value)} onBlur={() => prenom !== lead.prenom && void onPatch(lead.id, { prenom })} placeholder="Prénom du client" />
          </label>
          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Nom
            <input className={`${inputCls} mt-0.5`} value={nom} onChange={(e) => setNom(e.target.value)} onBlur={() => nom !== lead.nom && void onPatch(lead.id, { nom })} placeholder="Nom du client" />
          </label>
          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Téléphone
            <input className={`${inputCls} mt-0.5`} value={tel} onChange={(e) => setTel(e.target.value)} onBlur={() => tel !== lead.tel && void onPatch(lead.id, { tel })} placeholder="Téléphone" />
          </label>
          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Email
            <input className={`${inputCls} mt-0.5`} value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => email !== lead.email && void onPatch(lead.id, { email })} placeholder="Email" />
          </label>
        </div>

        {/* Actions rapides de contact */}
        <div className="mb-3 flex flex-wrap gap-2">
          {lead.tel && <a href={`tel:${lead.tel}`} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-bold text-white hover:brightness-110">📞 Appeler {lead.tel}</a>}
          {lead.tel && <a href={`sms:${lead.tel}`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">💬 SMS tél.</a>}
          {lead.email && <a href={`mailto:${lead.email}`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">✉ Email</a>}
        </div>

        {/* SMS Twilio : dernier envoi, envoi manuel (relances) et historique */}
        <SmsBloc lead={lead} />

        <div className="grid items-center gap-1.5 text-sm sm:grid-cols-2">
          {lead.ville && <div>📍 {lead.ville}</div>}
          {lead.budget != null && <div>💶 {int.format(lead.budget)} €</div>}
          <label className="flex items-center gap-1.5">
            <span title="Type de projet">🏷️ Projet :</span>
            <select
              className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-navy focus:border-copper focus:outline-none"
              value={lead.typeProjet}
              onChange={(e) => void onPatch(lead.id, { typeProjet: e.target.value })}
            >
              {TYPES_PROJET_LEAD.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </label>
        </div>
        {lead.message && <p className="mt-2 rounded-lg bg-slate-50 p-2 text-sm text-slate-700">💬 {lead.message}</p>}

        {/* Statut + avance rapide */}
        <div className="mt-3">
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">Statut du lead
            {i < STATUTS_LEAD.length - 1 && <button onClick={() => onStatut(lead, STATUTS_LEAD[i + 1])} className="rounded-full bg-navy px-2 py-0.5 text-[10px] font-bold normal-case text-white hover:bg-navy-deep">→ {STATUTS_LEAD[i + 1]}</button>}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STATUTS_LEAD.map((s) => (
              <button key={s} onClick={() => onStatut(lead, s)} className={`rounded-full px-3 py-1 text-xs font-semibold ${lead.statut === s ? "ring-2 ring-navy " : ""}${STATUT_LEAD_COULEURS[s]}`}>{s}</button>
            ))}
          </div>
        </div>

        {/* Relance programmée */}
        <div className="mt-3 rounded-lg border border-slate-200 p-2.5">
          <div className={`mb-1 text-xs font-semibold uppercase ${relanceEchue ? "text-red-600" : "text-slate-400"}`}>⏰ Prochaine relance {relanceEchue ? "— échue !" : lead.relanceLe ? `— ${new Date(lead.relanceLe).toLocaleDateString("fr-FR")}` : ""}</div>
          <div className="flex flex-wrap items-center gap-1.5">
            <input type="date" className={`${inputCls} w-auto`} value={relanceISO} onChange={(e) => onPatch(lead.id, { relanceLe: e.target.value ? new Date(e.target.value + "T09:00").getTime() : null })} />
            <button onClick={() => definirRelance(1)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">Demain</button>
            <button onClick={() => definirRelance(3)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">+3 j</button>
            <button onClick={() => definirRelance(7)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">+7 j</button>
            {lead.relanceLe && <button onClick={() => onPatch(lead.id, { relanceLe: null })} className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:text-red-600">Effacer</button>}
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-slate-500">Négociateur en charge
            <select className={`${inputCls} mt-1`} value={lead.negociateur || ""} onChange={(e) => onTransfert(lead, e.target.value)}>
              <option value="">— Non attribué —</option>
              {NEGOCIATEURS.map((n) => <option key={n} value={n}>{n}</option>)}
              {lead.negociateur && !NEGOCIATEURS.includes(lead.negociateur) && <option value={lead.negociateur}>{lead.negociateur}</option>}
            </select>
          </label>
          <label className="text-xs font-semibold text-slate-500">Notes internes
            <textarea className={`${inputCls} mt-1`} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={() => notes !== lead.notes && void onPatch(lead.id, { notes })} />
          </label>
        </div>

        {/* Ajout de suivi */}
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <select className={`${inputCls} w-auto`} value={type} onChange={(e) => setType(e.target.value)}>{SUIVI_ACTIONS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</select>
          <input className={`${inputCls} min-w-[180px] flex-1`} value={texte} onChange={(e) => setTexte(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { onSuivi(lead, type, texte); setTexte(""); } }} placeholder="Ex. Appelé, RDV fixé mardi 14h" />
          <button onClick={() => { onSuivi(lead, type, texte); setTexte(""); }} className="rounded-lg bg-copper px-4 py-1.5 text-sm font-bold text-white">Ajouter au suivi</button>
        </div>

        {/* Timeline */}
        <ul className="mt-3 space-y-1.5">
          {lead.suivi.map((s) => (
            <li key={s.id} className="flex gap-2 text-sm"><span className="mt-0.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-500">{SUIVI_TYPES.find((t) => t.id === s.type)?.label ?? s.type}</span><div><div className="text-slate-800">{s.texte}</div><div className="text-xs text-slate-400">{new Date(s.date).toLocaleString("fr-FR")}{s.auteur && s.auteur !== "—" ? ` · ${s.auteur}` : ""}</div></div></li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <button onClick={() => onDelete(lead)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">Supprimer</button>
          <button onClick={() => onConvert(lead)} disabled={!!lead.dossierId} className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-bold text-white hover:brightness-110 disabled:opacity-50">{lead.dossierId ? "✓ Converti en dossier" : "→ Convertir en dossier client"}</button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Vue CRÉNEAUX HORAIRES : quels créneaux d'arrivée des leads convertissent le
// mieux. Barre = taux de conversion du créneau ; à droite le volume et le
// taux de contact. Un badge « Meilleur » repère le créneau le plus performant.
// ---------------------------------------------------------------------------
function CreneauLigne({ b, best }: { b: CreneauBucket; best: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex w-28 shrink-0 items-center gap-1.5 text-sm font-semibold text-slate-700">
        {b.label}
        {best && <span className="rounded-full bg-teal-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">Top</span>}
      </div>
      <div className="relative h-6 flex-1 overflow-hidden rounded-lg bg-slate-100">
        <div className={`h-full rounded-lg ${best ? "bg-teal-500" : "bg-copper/70"}`} style={{ width: `${Math.max(b.conv, b.n ? 3 : 0)}%` }} />
        <span className="absolute inset-y-0 left-2 flex items-center text-xs font-bold text-slate-700">
          {b.n > 0 ? `${b.conv}% conversion` : "—"}
        </span>
      </div>
      <div className="w-40 shrink-0 text-right text-xs text-slate-500">
        {b.n > 0 ? (
          <>
            <span className="font-semibold text-slate-700">{b.n}</span> lead{b.n > 1 ? "s" : ""} ·{" "}
            <span className={`font-semibold ${clsTaux(b.contact)}`}>{b.contact}%</span> contact
          </>
        ) : (
          <span className="text-slate-300">aucun lead</span>
        )}
      </div>
    </div>
  );
}

function CreneauBloc({ titre, buckets, best }: { titre: string; buckets: CreneauBucket[]; best: CreneauBucket | null }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 text-sm font-bold text-navy">{titre}</div>
      <div className="space-y-2">
        {buckets.map((b) => <CreneauLigne key={b.label} b={b} best={best?.label === b.label && b.n > 0} />)}
      </div>
    </div>
  );
}

function CreneauxView({ data }: { data: CreneauxData }) {
  const { parHeure, parJour, meilleureHeure, meilleurJour, total, seuil } = data;

  return (
    <div className="space-y-4">
      {/* Recommandation en tête */}
      <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-4">
        <div className="mb-1 text-sm font-bold text-teal-800">🎯 Vos meilleurs créneaux</div>
        {meilleureHeure || meilleurJour ? (
          <p className="text-sm text-slate-700">
            {meilleureHeure && (
              <>Le créneau <span className="font-bold text-teal-800">{meilleureHeure.label}</span> est le plus performant :{" "}
                <span className={`font-bold ${clsTaux(meilleureHeure.conv)}`}>{meilleureHeure.conv}% de conversion</span>{" "}
                et <span className={`font-bold ${clsTaux(meilleureHeure.contact)}`}>{meilleureHeure.contact}% de contact</span> sur {meilleureHeure.n} leads reçus. </>
            )}
            {meilleurJour && (
              <>Meilleur jour : <span className="font-bold text-teal-800">{meilleurJour.label}</span>{" "}
                ({meilleurJour.conv}% de conversion, {meilleurJour.n} leads).</>
            )}
          </p>
        ) : (
          <p className="text-sm text-slate-500">Pas encore assez de leads pour dégager une tendance fiable — l&apos;analyse s&apos;affine à chaque nouveau lead.</p>
        )}
        <p className="mt-1.5 text-xs text-slate-400">
          Créneau = heure d&apos;<b>arrivée</b> du lead. « Contact » = au moins un échange consigné ; « Conversion » = mandat pris ou lead converti.
          Un créneau doit compter au moins {seuil} leads pour être élu « Top ». Analyse sur {total} lead{total > 1 ? "s" : ""} au total.
        </p>
      </div>

      <CreneauBloc titre="⏰ Par tranche horaire (heure d'arrivée)" buckets={parHeure} best={meilleureHeure} />
      <CreneauBloc titre="📅 Par jour de la semaine" buckets={parJour} best={meilleurJour} />

      <p className="text-xs text-slate-400">
        💡 À exploiter : concentrez la diffusion de vos publicités sur les créneaux qui convertissent le mieux, et rappelez en priorité — le plus vite possible — les leads qui arrivent pendant ces fenêtres.
      </p>
    </div>
  );
}
