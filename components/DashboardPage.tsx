"use client";

import { useEffect, useMemo, useState } from "react";
import { listLeads, updateLead, STATUTS_LEAD, STATUT_LEAD_COULEURS, type Lead } from "@/lib/leads";
import { listClients, updateClient, type ClientDossier } from "@/lib/clients";
import { STATUTS_RECHERCHE, STATUT_COULEURS } from "@/lib/acquereurs";
import { listEstimations, listDocuments, type HistoryMeta, type DocHistoryMeta } from "@/lib/history";
import { listRegistre } from "@/lib/registre";
import { estDossierVendeurComplet } from "@/lib/docTypes";

const int = new Intl.NumberFormat("fr-FR");
const eur = (n: number) => `${int.format(Math.round(n))} €`;
const TAUX_HONORAIRES = 0.04; // hypothèse d'honoraires pour le CA potentiel

function KPI({ valeur, label, sous, accent }: { valeur: string; label: string; sous?: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`text-2xl font-extrabold ${accent ?? "text-navy"}`}>{valeur}</div>
      <div className="mt-0.5 text-sm font-semibold text-slate-700">{label}</div>
      {sous && <div className="text-xs text-slate-400">{sous}</div>}
    </div>
  );
}

export default function DashboardPage({ onRetour }: { onRetour: () => void }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<ClientDossier[]>([]);
  const [estims, setEstims] = useState<HistoryMeta[]>([]);
  const [docs, setDocs] = useState<DocHistoryMeta[]>([]);
  const [nbAppels, setNbAppels] = useState(0);
  const [chargement, setChargement] = useState(true);
  const [vue, setVue] = useState<"leads" | "acquereurs">("leads");

  const recharger = async () => {
    const [l, c, e, d, r] = await Promise.all([
      listLeads(), listClients(), listEstimations().catch(() => []), listDocuments().catch(() => []), listRegistre().catch(() => ({ entrees: [], mois: [] })),
    ]);
    setLeads(l); setClients(c); setEstims(e); setDocs(d); setNbAppels(r.entrees.length);
    setChargement(false);
  };
  useEffect(() => { void recharger(); }, []);

  const stats = useMemo(() => {
    const parStatutLead: Record<string, number> = {};
    for (const s of STATUTS_LEAD) parStatutLead[s] = 0;
    for (const l of leads) parStatutLead[l.statut] = (parStatutLead[l.statut] ?? 0) + 1;
    const convertis = parStatutLead["Converti"] ?? 0;
    const traites = leads.filter((l) => l.statut !== "Nouveau").length;
    const tauxConv = leads.length ? Math.round((convertis / leads.length) * 100) : 0;
    const nouveaux = (parStatutLead["Nouveau"] ?? 0) + (parStatutLead["À appeler"] ?? 0);

    const vendeurs = clients.filter((c) => (c.typeClient ?? "vendeur") === "vendeur").length;
    const acq = clients.filter((c) => c.typeClient === "acquereur").length;
    const inv = clients.filter((c) => c.typeClient === "investisseur").length;

    const budgets = clients.filter((c) => c.typeClient === "acquereur" || c.typeClient === "investisseur")
      .map((c) => c.recherches?.[0]?.budgetMax ?? 0).filter((n) => n > 0);
    const budgetTotal = budgets.reduce((a, b) => a + b, 0);

    const valeurEstimee = estims.reduce((s, e) => s + ((e.fourchetteBasse + e.fourchetteHaute) / 2 || 0), 0);
    // Un mandat = un dossier VENDEUR complet (toutes les pièces obligatoires).
    const nbMandats = clients.filter((c) => estDossierVendeurComplet(c)).length;

    return { parStatutLead, convertis, traites, tauxConv, nouveaux, vendeurs, acq, inv, budgetTotal, valeurEstimee, nbMandats };
  }, [leads, clients, estims, docs]);

  // Déplacement d'une carte dans le pipeline (statut précédent / suivant)
  const bougerLead = async (l: Lead, sens: 1 | -1) => {
    const i = STATUTS_LEAD.indexOf(l.statut);
    const j = i + sens;
    if (j < 0 || j >= STATUTS_LEAD.length) return;
    const statut = STATUTS_LEAD[j];
    setLeads((p) => p.map((x) => (x.id === l.id ? { ...x, statut } : x)));
    await updateLead(l.id, { statut });
  };
  const bougerAcq = async (c: ClientDossier, sens: 1 | -1) => {
    const cur = c.statut ?? "Nouveau";
    const i = STATUTS_RECHERCHE.indexOf(cur);
    const j = i + sens;
    if (j < 0 || j >= STATUTS_RECHERCHE.length) return;
    const statut = STATUTS_RECHERCHE[j];
    setClients((p) => p.map((x) => (x.id === c.id ? { ...x, statut } : x)));
    await updateClient(c.id, { statut });
  };

  const acquereurs = useMemo(() => clients.filter((c) => c.typeClient === "acquereur" || c.typeClient === "investisseur"), [clients]);
  const colonnes = vue === "leads" ? STATUTS_LEAD : STATUTS_RECHERCHE;
  const couleurs = vue === "leads" ? STATUT_LEAD_COULEURS : STATUT_COULEURS;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Accueil</button>
        <h2 className="text-2xl font-bold text-navy">📊 Tableau de bord</h2>
        <button onClick={() => { setChargement(true); void recharger(); }} className="ml-auto rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100">↻ Rafraîchir</button>
      </div>

      {chargement ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">Chargement des statistiques…</div>
      ) : (
        <>
          {/* KPIs */}
          <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <KPI valeur={String(leads.length)} label="Leads reçus" sous={`${stats.nouveaux} à traiter`} accent="text-copper" />
            <KPI valeur={`${stats.tauxConv} %`} label="Taux de conversion" sous={`${stats.convertis} converti(s)`} accent="text-emerald-600" />
            <KPI valeur={String(clients.length)} label="Dossiers clients" sous={`${stats.vendeurs} vendeur · ${stats.acq} acq. · ${stats.inv} invest.`} />
            <KPI valeur={String(stats.nbMandats)} label="Mandats (dossiers vendeur complets)" sous={`${stats.vendeurs} dossier(s) vendeur · ${docs.length} document(s)`} accent="text-emerald-600" />
            <KPI valeur={String(estims.length)} label="Estimations réalisées" />
            <KPI valeur={eur(stats.valeurEstimee)} label="Valeur estimée cumulée" sous={`≈ ${eur(stats.valeurEstimee * TAUX_HONORAIRES)} d'honoraires potentiels`} accent="text-navy" />
            <KPI valeur={eur(stats.budgetTotal)} label="Budget portefeuille acquéreurs" />
            <KPI valeur={String(nbAppels)} label="Appels enregistrés (saisis)" />
          </div>

          {/* Répartition leads par statut */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 text-sm font-bold text-navy">Répartition des leads</div>
            <div className="space-y-1.5">
              {STATUTS_LEAD.map((s) => {
                const n = stats.parStatutLead[s] ?? 0;
                const pct = leads.length ? Math.round((n / leads.length) * 100) : 0;
                return (
                  <div key={s} className="flex items-center gap-2 text-xs">
                    <span className="w-28 shrink-0 text-slate-600">{s}</span>
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-copper" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-10 shrink-0 text-right font-semibold text-slate-700">{n}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pipeline visuel (kanban) */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-navy">🗂️ Pipeline commercial</h3>
            <div className="ml-2 inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-semibold">
              <button onClick={() => setVue("leads")} className={`rounded-md px-3 py-1 transition ${vue === "leads" ? "bg-copper text-white" : "text-slate-600 hover:bg-slate-100"}`}>Leads ({leads.length})</button>
              <button onClick={() => setVue("acquereurs")} className={`rounded-md px-3 py-1 transition ${vue === "acquereurs" ? "bg-copper text-white" : "text-slate-600 hover:bg-slate-100"}`}>Acquéreurs ({acquereurs.length})</button>
            </div>
            <span className="text-xs text-slate-400">Utilisez ‹ › sur chaque fiche pour la faire avancer dans le pipeline.</span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-3">
            {colonnes.map((col) => {
              const cartesLeads = vue === "leads" ? leads.filter((l) => l.statut === col) : [];
              const cartesAcq = vue === "acquereurs" ? acquereurs.filter((c) => (c.statut ?? "Nouveau") === col) : [];
              const total = vue === "leads" ? cartesLeads.length : cartesAcq.length;
              return (
                <div key={col} className="flex w-64 shrink-0 flex-col rounded-2xl bg-slate-50 p-2">
                  <div className="mb-2 flex items-center justify-between px-1">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${couleurs[col] ?? "bg-slate-100 text-slate-600"}`}>{col}</span>
                    <span className="text-xs font-semibold text-slate-400">{total}</span>
                  </div>
                  <div className="space-y-2">
                    {vue === "leads" && cartesLeads.map((l) => {
                      const i = STATUTS_LEAD.indexOf(l.statut);
                      return (
                        <div key={l.id} className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
                          <div className="text-sm font-bold text-navy">{[l.prenom, l.nom].filter(Boolean).join(" ") || "Lead"}</div>
                          <div className="text-xs text-slate-500">{[l.ville, l.budget ? eur(l.budget) : "", l.typeProjet].filter(Boolean).join(" · ")}</div>
                          {l.negociateur && <div className="mt-0.5 text-[11px] text-copper">👤 {l.negociateur}</div>}
                          <div className="mt-1.5 flex items-center justify-between">
                            <button onClick={() => void bougerLead(l, -1)} disabled={i <= 0} className="rounded px-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy disabled:opacity-30" title="Reculer">‹</button>
                            <button onClick={() => void bougerLead(l, 1)} disabled={i >= STATUTS_LEAD.length - 1} className="rounded px-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy disabled:opacity-30" title="Avancer">›</button>
                          </div>
                        </div>
                      );
                    })}
                    {vue === "acquereurs" && cartesAcq.map((c) => {
                      const cur = c.statut ?? "Nouveau";
                      const i = STATUTS_RECHERCHE.indexOf(cur);
                      const r = c.recherches?.[0];
                      return (
                        <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
                          <div className="text-sm font-bold text-navy">{[c.prenom, c.nom].filter(Boolean).join(" ") || c.nom}</div>
                          <div className="text-xs text-slate-500">{[r?.villes?.join(", "), r?.budgetMax ? eur(r.budgetMax) : "", c.typeClient].filter(Boolean).join(" · ")}</div>
                          {c.negociateur && <div className="mt-0.5 text-[11px] text-copper">👤 {c.negociateur}</div>}
                          <div className="mt-1.5 flex items-center justify-between">
                            <button onClick={() => void bougerAcq(c, -1)} disabled={i <= 0} className="rounded px-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy disabled:opacity-30" title="Reculer">‹</button>
                            <button onClick={() => void bougerAcq(c, 1)} disabled={i >= STATUTS_RECHERCHE.length - 1} className="rounded px-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy disabled:opacity-30" title="Avancer">›</button>
                          </div>
                        </div>
                      );
                    })}
                    {total === 0 && <div className="rounded-lg border border-dashed border-slate-200 px-2 py-4 text-center text-[11px] text-slate-300">—</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
