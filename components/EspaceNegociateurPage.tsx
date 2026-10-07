"use client";

import { useEffect, useMemo, useState } from "react";
import { listLeads, updateLead, deleteLead, STATUTS_LEAD, STATUT_LEAD_COULEURS, SUIVI_TYPES, type Lead } from "@/lib/leads";
import { listClients, createClient, type ClientDossier } from "@/lib/clients";
import { STATUT_COULEURS } from "@/lib/acquereurs";
import { listEstimations, type HistoryMeta } from "@/lib/history";
import { listChasse, STATUT_CHASSE_COULEURS, type FicheChasse } from "@/lib/chasse";
import { chargerPhoning, type PhoningData } from "@/lib/phoning";
import { scorerRecherche, bienDepuisChasse, NIVEAUX, type NiveauMatch } from "@/lib/matching";
import { EQUIPE, membreDepuisNom } from "@/lib/equipe";
import { FicheLead } from "@/components/LeadsPage";

const int = new Intl.NumberFormat("fr-FR");
const eur = (n?: number | null) => (n != null ? `${int.format(Math.round(n))} €` : "");
const dateFr = (t?: number) => (t ? new Date(t).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "");

// --- utilitaires « à relancer » ---
const JOUR = 86400000;
const joursDepuis = (t: number) => Math.floor((Date.now() - t) / JOUR);
const finJournee = () => { const d = new Date(); d.setHours(23, 59, 59, 999); return d.getTime(); };
const LEAD_TERMINAUX = ["Prise de mandat", "Converti", "Pas intéressé", "Perdu", "Estimation — sans projet"];
const ACQ_TERMINAUX = ["Projet abandonné", "Projet réalisé"];
const derniereActiviteLead = (l: Lead) => Math.max(l.createdAt, ...(l.suivi ?? []).map((s) => s.date));
// Un « vrai » suivi = un contact/action consigné (appel, email, RDV, note) —
// la création automatique et le simple transfert/changement de statut ne comptent pas.
const SUIVI_CONTACT = ["appel", "email", "rdv", "note", "repondeur", "estim_sans_projet", "estim_projet", "pas_interesse"];
const aUnSuivi = (l: Lead) => (l.suivi ?? []).some((s) => SUIVI_CONTACT.includes(s.type));
// Statuts engagés (RDV/estimation pris) : sortent de « à relancer ».
const STATUTS_ENGAGES = new Set(["RDV fixé", "Estimation — projet de vente"]);
function leadARelancer(l: Lead): boolean {
  if (LEAD_TERMINAUX.includes(l.statut)) return false;
  if (l.relanceLe && l.relanceLe <= finJournee()) return true;
  if (STATUTS_ENGAGES.has(l.statut)) return false; // RDV fixé / Estimation projet : déjà pris en charge
  if (!aUnSuivi(l)) return true; // aucun contact consigné → à relancer
  return false;
}
function dossierARelancer(c: ClientDossier): boolean {
  if (ACQ_TERMINAUX.includes(c.statut ?? "")) return false;
  const ref = c.derniereInteraction ?? c.updatedAt ?? c.createdAt;
  return joursDepuis(ref) >= 7;
}

const roster = EQUIPE.filter((m) => m.sections.some((s) => s === "transaction" || s === "gestion"));

export default function EspaceNegociateurPage({ onRetour }: { onRetour: () => void }) {
  const [membreId, setMembreId] = useState<string>(roster.find((m) => m.id === "lea")?.id ?? roster[0]?.id ?? "");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<ClientDossier[]>([]);
  const [estims, setEstims] = useState<HistoryMeta[]>([]);
  const [chasses, setChasses] = useState<FicheChasse[]>([]);
  const [phoning, setPhoning] = useState<PhoningData>({});
  const [masquees, setMasquees] = useState<Set<string>>(new Set());
  const [chargement, setChargement] = useState(true);
  const [onglet, setOnglet] = useState<"tableau" | "actions" | "relance" | "leads" | "acquereurs" | "ventes" | "estimations">("tableau");
  const [copie, setCopie] = useState<string | null>(null);

  const recharger = async () => {
    const [l, c, e, ch] = await Promise.all([listLeads(), listClients(), listEstimations().catch(() => []), listChasse().catch(() => [])]);
    setLeads(l); setClients(c); setEstims(e); setChasses(ch); setChargement(false);
  };
  useEffect(() => { void recharger(); }, []);

  // Phoning + actions « traitées » du négociateur sélectionné.
  const cleMasquees = (id: string) => `espace:actions:masquees:${id}`;
  useEffect(() => {
    let annule = false;
    void (async () => { const p = await chargerPhoning(membreId); if (!annule) setPhoning(p); })();
    try { const brut = localStorage.getItem(cleMasquees(membreId)); setMasquees(new Set(brut ? (JSON.parse(brut) as string[]) : [])); } catch { setMasquees(new Set()); }
    return () => { annule = true; };
  }, [membreId]);

  const marquerTraitee = (cle: string) => {
    setMasquees((s) => {
      const n = new Set(s); n.add(cle);
      try { localStorage.setItem(cleMasquees(membreId), JSON.stringify([...n])); } catch { /* ignore */ }
      return n;
    });
  };

  const membre = roster.find((m) => m.id === membreId) ?? null;
  const estMien = (nego?: string) => membreDepuisNom(nego)?.id === membreId;

  const data = useMemo(() => {
    const mesLeads = leads.filter((l) => estMien(l.negociateur));
    const mesDossiers = clients.filter((c) => estMien(c.negociateur));
    const mesAcq = mesDossiers.filter((c) => c.typeClient === "acquereur" || c.typeClient === "investisseur");
    const mesVentes = mesDossiers.filter((c) => (c.typeClient ?? "vendeur") === "vendeur");
    const mesEstims = estims.filter((e) => estMien(e.negociateur));
    const leadsRelance = mesLeads.filter(leadARelancer).sort((a, b) => (a.relanceLe ?? Infinity) - (b.relanceLe ?? Infinity));
    const dossiersRelance = [...mesAcq, ...mesVentes].filter(dossierARelancer)
      .sort((a, b) => (a.derniereInteraction ?? a.updatedAt) - (b.derniereInteraction ?? b.updatedAt));
    return { mesLeads, mesAcq, mesVentes, mesEstims, leadsRelance, dossiersRelance };
  }, [leads, clients, estims, membreId]);

  // ACTIONS — rapprochements : mes acquéreurs ⇄ biens repérés en chasse (par moi
  // ou un collègue). Ex. « Appeler M. X : correspond au bien chassé par Léa ».
  const actions = useMemo(() => {
    const fiches = chasses.filter((f) => !f.archived && f.statut !== "Écarté" && (f.prixAffiche > 0 || f.surface > 0));
    const out: { fiche: FicheChasse; acq: ClientDossier; rechLibelle: string; score: number; niveau: NiveauMatch }[] = [];
    for (const acq of data.mesAcq) {
      const recherches = (acq.recherches ?? []).filter((r) => r.actif !== false);
      if (recherches.length === 0) continue;
      for (const f of fiches) {
        const bien = bienDepuisChasse(f);
        let best: { score: number; niveau: NiveauMatch; libelle: string } | null = null;
        for (const r of recherches) {
          const res = scorerRecherche(bien, r);
          if (res.niveau && (!best || res.score > best.score)) best = { score: res.score, niveau: res.niveau, libelle: r.libelle || "Recherche" };
        }
        // On ne retient que les correspondances sérieuses (forte / intéressante)
        // et non encore traitées.
        if (best && (best.niveau === "forte" || best.niveau === "interessante") && !masquees.has(`${acq.id}:${f.id}`)) {
          out.push({ fiche: f, acq, rechLibelle: best.libelle, score: best.score, niveau: best.niveau });
        }
      }
    }
    return out.sort((a, b) => b.score - a.score);
  }, [chasses, data.mesAcq, masquees]);

  // Rappels phoning dus aujourd'hui (date de rappel passée/du jour) ou statut « Rappel ».
  const rappelsPhoning = useMemo(() => {
    const fin = finJournee();
    const out: { contact: string; tel: string; cible: string; rappel?: number }[] = [];
    for (const lignes of Object.values(phoning)) {
      for (const l of lignes) {
        if ((l.rappel && l.rappel <= fin) || l.statut === "Rappel") out.push({ contact: l.contact, tel: l.tel, cible: "", rappel: l.rappel });
      }
    }
    return out.sort((a, b) => (a.rappel ?? Infinity) - (b.rappel ?? Infinity));
  }, [phoning]);

  // Synthèse pour le tableau de bord (répartitions + chiffres du mois).
  const synthese = useMemo(() => {
    const parStatut = (arr: { statut?: string }[]) => {
      const m = new Map<string, number>();
      for (const x of arr) { const s = x.statut || "—"; m.set(s, (m.get(s) ?? 0) + 1); }
      return [...m.entries()].sort((a, b) => b[1] - a[1]);
    };
    const d = new Date(); const debutMois = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
    const estimsMois = data.mesEstims.filter((e) => e.createdAt >= debutMois).length;
    const mandatsEnCours = data.mesVentes.filter((v) => !["Projet abandonné", "Projet réalisé", "Vendu"].includes(v.statut ?? "")).length;
    return { leadsParStatut: parStatut(data.mesLeads), acqParStatut: parStatut(data.mesAcq), estimsMois, mandatsEnCours };
  }, [data.mesLeads, data.mesAcq, data.mesEstims, data.mesVentes]);

  const definirRelance = async (l: Lead, dans: number) => {
    const d = new Date(); d.setHours(9, 0, 0, 0); d.setDate(d.getDate() + dans);
    const maj = await updateLead(l.id, { relanceLe: d.getTime() });
    if (maj) setLeads((ls) => ls.map((x) => (x.id === l.id ? maj : x)));
  };
  const avancerLead = async (l: Lead) => {
    const i = STATUTS_LEAD.indexOf(l.statut);
    if (i < 0 || i >= STATUTS_LEAD.length - 1) return;
    const statut = STATUTS_LEAD[i + 1];
    const suivi = [{ id: `${Date.now()}`, date: Date.now(), type: "statut", texte: `Statut : ${statut}`, auteur: l.negociateur || "—" }, ...l.suivi];
    const maj = await updateLead(l.id, { statut, suivi });
    if (maj) setLeads((ls) => ls.map((x) => (x.id === l.id ? maj : x)));
  };

  const copier = async (cle: string, texte: string) => {
    try { await navigator.clipboard.writeText(texte); setCopie(cle); setTimeout(() => setCopie((c) => (c === cle ? null : c)), 1500); } catch { /* */ }
  };

  // ---- Ouverture de la fiche complète d'un lead (suivi, statut, relance, attribution) ----
  const [sel, setSel] = useState<Lead | null>(null);
  const majLead = async (id: string, patch: Partial<Lead>) => {
    const m = await updateLead(id, patch);
    if (m) { setSel((s) => (s?.id === id ? m : s)); setLeads((ls) => ls.map((l) => (l.id === id ? m : l))); }
    return m;
  };
  const onStatut = async (l: Lead, statut: string) => {
    const suivi = [{ id: `${Date.now()}`, date: Date.now(), type: "statut", texte: `Statut : ${statut}`, auteur: l.negociateur || "—" }, ...l.suivi];
    const patch: Partial<Lead> = { statut, suivi };
    if (LEAD_TERMINAUX.includes(statut)) patch.relanceLe = null;
    await majLead(l.id, patch);
  };
  const onSuivi = async (l: Lead, type: string, texte: string) => {
    const def = SUIVI_TYPES.find((t) => t.id === type);
    const txt = texte.trim() || def?.label || "";
    if (!txt) return;
    const suivi = [{ id: `${Date.now()}`, date: Date.now(), type, texte: txt, auteur: l.negociateur || "—" }, ...l.suivi];
    const patch: Partial<Lead> = { suivi };
    if (def?.statut && def.statut !== l.statut) patch.statut = def.statut;
    await majLead(l.id, patch);
  };
  const onTransfert = async (l: Lead, negociateur: string) => {
    const nv = negociateur.trim();
    if (nv === (l.negociateur ?? "").trim()) return;
    // Attribuer ne change pas le statut du lead (il reste dans la liste).
    const texte = nv ? `Négociateur en charge : ${nv}` : "Attribution retirée";
    const suivi = [{ id: `${Date.now()}`, date: Date.now(), type: "transfert", texte, auteur: nv || l.negociateur || "—" }, ...l.suivi];
    await majLead(l.id, { negociateur: nv, suivi });
  };
  const onConvert = async (l: Lead) => {
    if (l.dossierId) return alert("Ce lead est déjà converti en dossier.");
    const type = l.typeProjet === "investisseur" ? "investisseur" : l.typeProjet === "vendeur" ? "vendeur" : "acquereur";
    const d = await createClient({ nom: l.nom || "Lead", bien: [l.ville, l.message].filter(Boolean).join(" — "), prenom: l.prenom, tel: l.tel, email: l.email, negociateur: l.negociateur, typeClient: type });
    if (!d) return alert("Conversion impossible.");
    const statut = type === "vendeur" ? "Prise de mandat" : "Converti";
    const texteSuivi = type === "vendeur" ? "Prise de mandat — dossier vendeur créé" : `Converti en dossier ${type}`;
    const suivi = [{ id: `${Date.now()}`, date: Date.now(), type: "conversion", texte: texteSuivi, auteur: l.negociateur || "—" }, ...l.suivi];
    await majLead(l.id, { statut, dossierId: d.id, relanceLe: null, suivi });
    alert(`Dossier ${type} créé${type === "vendeur" ? " — lead passé en « Prise de mandat »" : ""}.`);
  };
  const onDelete = async (l: Lead) => { if (confirm("Supprimer ce lead ?")) { await deleteLead(l.id); setSel(null); void recharger(); } };

  const Contacts = ({ tel, email }: { tel?: string; email?: string }) => (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      {tel && <a href={`tel:${tel}`} className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100" title={`Appeler ${tel}`}>📞</a>}
      {tel && <a href={`sms:${tel}`} className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100" title="SMS">💬</a>}
      {email && <a href={`mailto:${email}`} className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100" title="Email">✉</a>}
    </div>
  );

  const ONGLETS: { id: typeof onglet; label: string; n: number }[] = [
    { id: "tableau", label: "📊 Tableau de bord", n: 0 },
    { id: "actions", label: "🎯 Mes actions", n: actions.length + rappelsPhoning.length + data.leadsRelance.length + data.dossiersRelance.length },
    { id: "relance", label: "🔔 À relancer", n: data.leadsRelance.length + data.dossiersRelance.length },
    { id: "leads", label: "📥 Mes leads", n: data.mesLeads.length },
    { id: "acquereurs", label: "🔑 Mes acquéreurs", n: data.mesAcq.length },
    { id: "ventes", label: "🏠 Mes ventes", n: data.mesVentes.length },
    { id: "estimations", label: "📊 Mes estimations", n: data.mesEstims.length },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Accueil</button>
        <h2 className="text-2xl font-bold text-navy">👤 Espace négociateur</h2>
        <button onClick={() => { setChargement(true); void recharger(); }} className="ml-auto rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100">↻ Rafraîchir</button>
      </div>

      {/* Choix du négociateur */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {roster.map((m) => (
          <button key={m.id} onClick={() => setMembreId(m.id)} className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${membreId === m.id ? "bg-navy text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}>
            {m.nom} <span className="text-xs font-normal opacity-70">· {m.role}</span>
          </button>
        ))}
      </div>

      {chargement ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">Chargement de l&apos;espace…</div>
      ) : (
        <>
          {/* KPIs */}
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { v: actions.length + rappelsPhoning.length + data.leadsRelance.length + data.dossiersRelance.length, l: "Actions à faire", a: "text-emerald-600" },
              { v: data.leadsRelance.length + data.dossiersRelance.length, l: "À relancer", a: "text-red-600" },
              { v: data.mesLeads.length, l: "Leads", a: "text-copper" },
              { v: data.mesAcq.length, l: "Acquéreurs", a: "text-blue-600" },
              { v: data.mesVentes.length, l: "Ventes / mandats", a: "text-amber-600" },
              { v: data.mesEstims.length, l: "Estimations", a: "text-navy" },
            ].map((k) => (
              <div key={k.l} className="rounded-xl border border-slate-200 bg-white p-3">
                <div className={`text-xl font-extrabold ${k.a}`}>{k.v}</div>
                <div className="text-[11px] font-semibold text-slate-500">{k.l}</div>
              </div>
            ))}
          </div>

          {/* Onglets */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {ONGLETS.map((o) => (
              <button key={o.id} onClick={() => setOnglet(o.id)} className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${onglet === o.id ? "bg-copper text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}>
                {o.label}{o.n > 0 ? ` (${o.n})` : ""}
              </button>
            ))}
          </div>

          {/* TABLEAU DE BORD — synthèse du négociateur */}
          {onglet === "tableau" && (
            <div className="space-y-5">
              {/* Priorités du jour */}
              <div>
                <h3 className="mb-2 text-sm font-bold text-navy">🚀 Tes priorités du jour</h3>
                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    { n: actions.length, t: "Acquéreurs à appeler", s: "un bien repéré leur correspond", go: "actions" as const, cls: "border-emerald-200 bg-emerald-50/60 text-emerald-800" },
                    { n: rappelsPhoning.length, t: "Rappels phoning", s: "prévus aujourd'hui", go: "actions" as const, cls: "border-blue-200 bg-blue-50/60 text-blue-800" },
                    { n: data.leadsRelance.length + data.dossiersRelance.length, t: "À relancer", s: "leads & dossiers", go: "relance" as const, cls: "border-red-200 bg-red-50/60 text-red-800" },
                  ].map((p) => (
                    <button key={p.t} onClick={() => setOnglet(p.go)} className={`rounded-2xl border p-4 text-left transition hover:shadow-md ${p.cls}`}>
                      <div className="text-3xl font-black">{p.n}</div>
                      <div className="text-sm font-bold">{p.t}</div>
                      <div className="text-[11px] opacity-80">{p.s}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pipelines */}
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-navy">📥 Mes leads par statut</h3>
                    <button onClick={() => setOnglet("leads")} className="text-[11px] font-semibold text-copper hover:underline">tout voir →</button>
                  </div>
                  {synthese.leadsParStatut.length === 0 ? <p className="text-xs text-slate-400">Aucun lead attribué.</p> : (
                    <div className="space-y-1.5">
                      {synthese.leadsParStatut.map(([s, n]) => (
                        <div key={s} className="flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUT_LEAD_COULEURS[s] ?? "bg-slate-100 text-slate-600"}`}>{s}</span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-copper" style={{ width: `${Math.round((n / data.mesLeads.length) * 100)}%` }} /></div>
                          <span className="w-6 text-right text-xs font-bold text-navy">{n}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-navy">🔑 Mes acquéreurs par statut</h3>
                    <button onClick={() => setOnglet("acquereurs")} className="text-[11px] font-semibold text-copper hover:underline">tout voir →</button>
                  </div>
                  {synthese.acqParStatut.length === 0 ? <p className="text-xs text-slate-400">Aucun acquéreur attribué.</p> : (
                    <div className="space-y-1.5">
                      {synthese.acqParStatut.map(([s, n]) => (
                        <div key={s} className="flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUT_COULEURS[s] ?? "bg-slate-100 text-slate-600"}`}>{s}</span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-400" style={{ width: `${Math.round((n / data.mesAcq.length) * 100)}%` }} /></div>
                          <span className="w-6 text-right text-xs font-bold text-navy">{n}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Chiffres clés */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { v: synthese.mandatsEnCours, l: "Mandats / ventes en cours", go: "ventes" as const },
                  { v: synthese.estimsMois, l: "Estimations ce mois-ci", go: "estimations" as const },
                  { v: data.mesEstims.length, l: "Estimations au total", go: "estimations" as const },
                  { v: data.mesAcq.length, l: "Acquéreurs actifs", go: "acquereurs" as const },
                ].map((k) => (
                  <button key={k.l} onClick={() => setOnglet(k.go)} className="rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-copper hover:shadow-sm">
                    <div className="text-2xl font-extrabold text-navy">{k.v}</div>
                    <div className="text-[11px] font-semibold text-slate-500">{k.l}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MES ACTIONS — hub : rapprochements + rappels phoning + relances */}
          {onglet === "actions" && (
            <div className="space-y-5">
              {actions.length + rappelsPhoning.length + data.leadsRelance.length + data.dossiersRelance.length === 0 && (
                <div className="rounded-2xl border border-green-200 bg-green-50/60 p-8 text-center text-sm text-green-700">✅ Aucune action en attente pour {membre?.nom}. Beau travail !</div>
              )}

              {/* 1. Rapprochements acquéreur ⇄ bien repéré en chasse */}
              {actions.length > 0 && (
                <div>
                  <h3 className="mb-1.5 text-sm font-bold text-navy">🎯 Acquéreurs à appeler — un bien repéré leur correspond ({actions.length})</h3>
                  <p className="mb-2 text-xs text-slate-500">Des biens repérés en chasse (par toi ou un collègue) collent à la recherche de tes acquéreurs : propose-leur le bien.</p>
                  <div className="space-y-2">
                    {actions.map(({ fiche, acq, rechLibelle, score, niveau }) => {
                      const badgeCls = niveau === "forte" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700";
                      const chasseur = membreDepuisNom(fiche.negociateur)?.nom ?? fiche.negociateur;
                      const parMoi = estMien(fiche.negociateur);
                      const bienTxt = [fiche.typeBien, fiche.surface > 0 ? `${fiche.surface} m²` : "", fiche.ville, fiche.prixAffiche > 0 ? eur(fiche.prixAffiche) : ""].filter(Boolean).join(" · ");
                      return (
                        <div key={`${acq.id}-${fiche.id}`} className={`rounded-xl border border-y-slate-200 border-r-slate-200 bg-white p-3 shadow-sm border-l-4 ${niveau === "forte" ? "border-l-emerald-400" : "border-l-amber-400"}`}>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-base">📞</span>
                            <span className="text-sm font-bold text-navy">Appeler {[acq.prenom, acq.nom].filter(Boolean).join(" ") || acq.nom}</span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeCls}`}>{NIVEAUX[niveau].label} · {score}%</span>
                            <div className="ml-auto"><Contacts tel={acq.tel} email={acq.email} /></div>
                          </div>
                          <div className="mt-1.5 text-[13px] text-slate-700">→ pour le bien : <b className="text-navy">{bienTxt || fiche.titre || "Bien repéré"}</b></div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                            <span className={`rounded-full px-2 py-0.5 font-semibold ${STATUT_CHASSE_COULEURS[fiche.statut] ?? "bg-slate-100 text-slate-500"}`}>{fiche.statut}</span>
                            <span className="text-slate-400">Chassé par {parMoi ? "toi" : (chasseur || "un collègue")}</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-slate-400">Recherche « {rechLibelle} »</span>
                            {fiche.url && <a href={fiche.url} target="_blank" rel="noopener noreferrer" className="rounded-md border border-slate-200 px-2 py-0.5 font-semibold text-slate-500 hover:bg-slate-100">Voir l&apos;annonce ↗</a>}
                            <button onClick={() => marquerTraitee(`${acq.id}:${fiche.id}`)} className="ml-auto rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 hover:bg-emerald-100" title="J'ai proposé le bien / traité">✓ Traité</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Rappels phoning du jour */}
              {rappelsPhoning.length > 0 && (
                <div>
                  <h3 className="mb-1.5 text-sm font-bold text-navy">📞 Rappels phoning du jour ({rappelsPhoning.length})</h3>
                  <div className="space-y-2">
                    {rappelsPhoning.slice(0, 50).map((r, i) => (
                      <div key={i} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                        <div className="min-w-[140px]">
                          <div className="text-sm font-bold text-navy">{r.contact || "Contact"}</div>
                          <div className="text-xs text-slate-500">{r.rappel ? `rappel prévu le ${dateFr(r.rappel)}` : "à rappeler"}</div>
                        </div>
                        <div className="ml-auto"><Contacts tel={r.tel} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Relances (leads + dossiers) — raccourci vers l'onglet détaillé */}
              {(data.leadsRelance.length > 0 || data.dossiersRelance.length > 0) && (
                <div>
                  <h3 className="mb-1.5 text-sm font-bold text-navy">🔔 À relancer ({data.leadsRelance.length + data.dossiersRelance.length})</h3>
                  <button onClick={() => setOnglet("relance")} className="rounded-xl border border-red-200 bg-red-50/60 px-4 py-3 text-left text-sm text-red-700 transition hover:bg-red-50">
                    {data.leadsRelance.length} lead(s) et {data.dossiersRelance.length} dossier(s) à relancer aujourd&apos;hui — <span className="font-bold underline">ouvrir la liste →</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* À RELANCER */}
          {onglet === "relance" && (
            <div className="space-y-2">
              {data.leadsRelance.length === 0 && data.dossiersRelance.length === 0 && (
                <div className="rounded-2xl border border-green-200 bg-green-50/60 p-8 text-center text-sm text-green-700">✅ Rien à relancer aujourd&apos;hui pour {membre?.nom}. Beau travail !</div>
              )}
              {data.leadsRelance.map((l) => {
                const retard = l.relanceLe && l.relanceLe <= finJournee();
                return (
                  <div key={l.id} onClick={() => setSel(l)} className="flex cursor-pointer flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-white p-3 shadow-sm transition hover:shadow-md">
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">LEAD</span>
                    <div className="min-w-[140px]">
                      <div className="text-sm font-bold text-navy">{[l.prenom, l.nom].filter(Boolean).join(" ") || "Lead sans nom"}</div>
                      <div className="text-xs text-slate-500">{[l.ville, eur(l.budget)].filter(Boolean).join(" · ")}</div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUT_LEAD_COULEURS[l.statut] ?? "bg-slate-100"}`}>{l.statut}</span>
                    <span className="text-xs text-red-600">{retard ? `relance prévue le ${dateFr(l.relanceLe!)}` : `sans contact depuis ${joursDepuis(derniereActiviteLead(l))} j`}</span>
                    <div className="ml-auto flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <Contacts tel={l.tel} email={l.email} />
                      <button onClick={() => void definirRelance(l, 3)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100" title="Reprogrammer dans 3 jours">↻ +3j</button>
                      <button onClick={() => setSel(l)} className="rounded-lg border border-copper px-2 py-1 text-xs font-semibold text-copper hover:bg-copper-soft/40">Ouvrir</button>
                      <button onClick={() => void avancerLead(l)} className="rounded-lg bg-navy px-2 py-1 text-xs font-semibold text-white hover:bg-navy-deep">Avancer ›</button>
                    </div>
                  </div>
                );
              })}
              {data.dossiersRelance.map((c) => (
                <div key={c.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-white p-3 shadow-sm">
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">{c.typeClient === "vendeur" || !c.typeClient ? "VENTE" : "ACQ."}</span>
                  <div className="min-w-[140px]">
                    <div className="text-sm font-bold text-navy">{[c.prenom, c.nom].filter(Boolean).join(" ") || c.nom}</div>
                    <div className="text-xs text-slate-500">{(c.recherches?.[0]?.villes ?? []).join(", ") || c.bien}</div>
                  </div>
                  {c.statut && <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUT_COULEURS[c.statut] ?? "bg-slate-100"}`}>{c.statut}</span>}
                  <span className="text-xs text-amber-700">dernier contact {dateFr(c.derniereInteraction ?? c.updatedAt)}</span>
                  <div className="ml-auto"><Contacts tel={c.tel} email={c.email} /></div>
                </div>
              ))}
            </div>
          )}

          {/* MES LEADS */}
          {onglet === "leads" && (
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {data.mesLeads.length === 0 && <div className="text-sm text-slate-400">Aucun lead attribué à {membre?.nom}.</div>}
              {data.mesLeads.map((l) => {
                const cle = `l${l.id}`;
                const texte = `${[l.prenom, l.nom].filter(Boolean).join(" ")}\n${l.tel}\n${l.email}\n${l.ville}\n${l.message}`;
                return (
                  <div key={l.id} onClick={() => setSel(l)} className={`cursor-pointer rounded-2xl border bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${leadARelancer(l) ? "border-red-200" : "border-slate-200 hover:border-copper/50"}`}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUT_LEAD_COULEURS[l.statut] ?? "bg-slate-100"}`}>{l.statut}</span>
                      {leadARelancer(l) && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">⏰ à relancer</span>}
                    </div>
                    <div className="text-sm font-bold text-navy">{[l.prenom, l.nom].filter(Boolean).join(" ") || "Lead sans nom"}</div>
                    <div className="truncate text-xs text-slate-500">{[l.ville, eur(l.budget)].filter(Boolean).join(" · ")}</div>
                    {l.negociateur && <div className="mt-0.5 text-[11px] text-copper">👤 {l.negociateur}</div>}
                    <div className="mt-2 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <Contacts tel={l.tel} email={l.email} />
                      <button onClick={() => void copier(cle, texte)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100" title="Copier la fiche">{copie === cle ? "✓" : "📋"}</button>
                      <button onClick={() => setSel(l)} className="ml-auto rounded-lg border border-copper px-2 py-1 text-xs font-semibold text-copper hover:bg-copper-soft/40">Ouvrir la fiche</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* MES ACQUÉREURS */}
          {onglet === "acquereurs" && (
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {data.mesAcq.length === 0 && <div className="text-sm text-slate-400">Aucun acquéreur/investisseur attribué à {membre?.nom}.</div>}
              {data.mesAcq.map((c) => (
                <div key={c.id} className="rounded-2xl border border-l-4 border-slate-200 border-l-blue-400 bg-white p-3 shadow-sm">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700">{c.typeClient === "investisseur" ? "📈 Investisseur" : "🔑 Acquéreur"}</span>
                    {c.statut && <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUT_COULEURS[c.statut] ?? "bg-slate-100"}`}>{c.statut}</span>}
                  </div>
                  <div className="text-sm font-bold text-navy">{[c.prenom, c.nom].filter(Boolean).join(" ") || c.nom}</div>
                  <div className="truncate text-xs text-slate-500">{[(c.recherches?.[0]?.villes ?? []).join(", "), eur(c.recherches?.[0]?.budgetMax)].filter(Boolean).join(" · ")}</div>
                  <div className="mt-0.5 text-[11px] text-slate-400">dernier contact {dateFr(c.derniereInteraction ?? c.updatedAt)}</div>
                  <div className="mt-2"><Contacts tel={c.tel} email={c.email} /></div>
                </div>
              ))}
            </div>
          )}

          {/* MES VENTES */}
          {onglet === "ventes" && (
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {data.mesVentes.length === 0 && <div className="text-sm text-slate-400">Aucun dossier vendeur attribué à {membre?.nom}.</div>}
              {data.mesVentes.map((c) => (
                <div key={c.id} className="rounded-2xl border border-l-4 border-slate-200 border-l-amber-400 bg-white p-3 shadow-sm">
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">🏠 Vendeur</span>
                  <div className="mt-1 text-sm font-bold text-navy">{[c.prenom, c.nom].filter(Boolean).join(" ") || c.nom}</div>
                  <div className="truncate text-xs text-slate-500">{c.bien}</div>
                  <div className="mt-0.5 text-[11px] text-slate-400">{c.pieces.length} pièce(s) · maj {dateFr(c.updatedAt)}</div>
                  <div className="mt-2"><Contacts tel={c.tel} email={c.email} /></div>
                </div>
              ))}
            </div>
          )}

          {/* MES ESTIMATIONS */}
          {onglet === "estimations" && (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              {data.mesEstims.length === 0 ? (
                <div className="p-6 text-sm text-slate-400">Aucune estimation réalisée par {membre?.nom}.</div>
              ) : (
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="bg-slate-50 text-left text-[11px] uppercase text-slate-500">
                    <tr><th className="px-3 py-2">Client</th><th className="px-3 py-2">Bien</th><th className="px-3 py-2">Fourchette</th><th className="px-3 py-2">Date</th></tr>
                  </thead>
                  <tbody>
                    {data.mesEstims.sort((a, b) => b.createdAt - a.createdAt).map((e) => (
                      <tr key={e.id} className="border-t border-slate-100">
                        <td className="px-3 py-2 font-semibold text-navy">{e.client || "—"}</td>
                        <td className="px-3 py-2 text-slate-600">{[e.bien, e.ville].filter(Boolean).join(" · ")}</td>
                        <td className="px-3 py-2 text-slate-600">{e.fourchetteBasse ? `${eur(e.fourchetteBasse)} – ${eur(e.fourchetteHaute)}` : "—"}</td>
                        <td className="px-3 py-2 text-xs text-slate-400">{dateFr(e.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          <p className="mt-3 text-xs text-slate-400">
            Cet espace regroupe tout ce qui est attribué à {membre?.nom} pour faciliter les relances. Un client passe dans « À relancer »
            si un rappel est arrivé à échéance, si un lead reste sans contact 2 jours, ou si un dossier n&apos;a pas bougé depuis 7 jours.
            Personnalisez chaque relance pour rester efficace sans être insistant.
          </p>
        </>
      )}

      {sel && (
        <FicheLead
          key={sel.id}
          lead={sel}
          onClose={() => { setSel(null); void recharger(); }}
          onStatut={onStatut}
          onSuivi={onSuivi}
          onPatch={majLead}
          onTransfert={onTransfert}
          onConvert={onConvert}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
