"use client";

import { useEffect, useMemo, useState } from "react";
import { listLeads, updateLead, STATUTS_LEAD, STATUT_LEAD_COULEURS, type Lead } from "@/lib/leads";
import { listClients, type ClientDossier } from "@/lib/clients";
import { STATUT_COULEURS } from "@/lib/acquereurs";
import { listEstimations, type HistoryMeta } from "@/lib/history";
import { EQUIPE, membreDepuisNom } from "@/lib/equipe";

const int = new Intl.NumberFormat("fr-FR");
const eur = (n?: number | null) => (n != null ? `${int.format(Math.round(n))} €` : "");
const dateFr = (t?: number) => (t ? new Date(t).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "");

// --- utilitaires « à relancer » ---
const JOUR = 86400000;
const joursDepuis = (t: number) => Math.floor((Date.now() - t) / JOUR);
const finJournee = () => { const d = new Date(); d.setHours(23, 59, 59, 999); return d.getTime(); };
const LEAD_TERMINAUX = ["Converti", "Non converti", "Perdu"];
const ACQ_TERMINAUX = ["Projet abandonné", "Projet réalisé"];
const derniereActiviteLead = (l: Lead) => Math.max(l.createdAt, ...(l.suivi ?? []).map((s) => s.date));
function leadARelancer(l: Lead): boolean {
  if (LEAD_TERMINAUX.includes(l.statut)) return false;
  if (l.relanceLe && l.relanceLe <= finJournee()) return true;
  if ((l.statut === "Nouveau" || l.statut === "À appeler") && joursDepuis(derniereActiviteLead(l)) >= 2) return true;
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
  const [chargement, setChargement] = useState(true);
  const [onglet, setOnglet] = useState<"relance" | "leads" | "acquereurs" | "ventes" | "estimations">("relance");
  const [copie, setCopie] = useState<string | null>(null);

  const recharger = async () => {
    const [l, c, e] = await Promise.all([listLeads(), listClients(), listEstimations().catch(() => [])]);
    setLeads(l); setClients(c); setEstims(e); setChargement(false);
  };
  useEffect(() => { void recharger(); }, []);

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

  const Contacts = ({ tel, email }: { tel?: string; email?: string }) => (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      {tel && <a href={`tel:${tel}`} className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100" title={`Appeler ${tel}`}>📞</a>}
      {tel && <a href={`sms:${tel}`} className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100" title="SMS">💬</a>}
      {email && <a href={`mailto:${email}`} className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100" title="Email">✉</a>}
    </div>
  );

  const ONGLETS: { id: typeof onglet; label: string; n: number }[] = [
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
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {[
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
                {o.label} ({o.n})
              </button>
            ))}
          </div>

          {/* À RELANCER */}
          {onglet === "relance" && (
            <div className="space-y-2">
              {data.leadsRelance.length === 0 && data.dossiersRelance.length === 0 && (
                <div className="rounded-2xl border border-green-200 bg-green-50/60 p-8 text-center text-sm text-green-700">✅ Rien à relancer aujourd&apos;hui pour {membre?.nom}. Beau travail !</div>
              )}
              {data.leadsRelance.map((l) => {
                const retard = l.relanceLe && l.relanceLe <= finJournee();
                return (
                  <div key={l.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-white p-3 shadow-sm">
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">LEAD</span>
                    <div className="min-w-[140px]">
                      <div className="text-sm font-bold text-navy">{[l.prenom, l.nom].filter(Boolean).join(" ") || "Lead sans nom"}</div>
                      <div className="text-xs text-slate-500">{[l.ville, eur(l.budget)].filter(Boolean).join(" · ")}</div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUT_LEAD_COULEURS[l.statut] ?? "bg-slate-100"}`}>{l.statut}</span>
                    <span className="text-xs text-red-600">{retard ? `relance prévue le ${dateFr(l.relanceLe!)}` : `sans contact depuis ${joursDepuis(derniereActiviteLead(l))} j`}</span>
                    <div className="ml-auto flex items-center gap-1.5">
                      <Contacts tel={l.tel} email={l.email} />
                      <button onClick={() => void definirRelance(l, 3)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100" title="Reprogrammer dans 3 jours">↻ +3j</button>
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
                  <div key={l.id} className={`rounded-2xl border bg-white p-3 shadow-sm ${leadARelancer(l) ? "border-red-200" : "border-slate-200"}`}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUT_LEAD_COULEURS[l.statut] ?? "bg-slate-100"}`}>{l.statut}</span>
                      {leadARelancer(l) && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">⏰ à relancer</span>}
                    </div>
                    <div className="text-sm font-bold text-navy">{[l.prenom, l.nom].filter(Boolean).join(" ") || "Lead sans nom"}</div>
                    <div className="truncate text-xs text-slate-500">{[l.ville, eur(l.budget)].filter(Boolean).join(" · ")}</div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <Contacts tel={l.tel} email={l.email} />
                      <button onClick={() => void copier(cle, texte)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100" title="Copier la fiche">{copie === cle ? "✓" : "📋"}</button>
                      <button onClick={() => void avancerLead(l)} className="ml-auto rounded-lg bg-navy px-2 py-1 text-xs font-semibold text-white hover:bg-navy-deep">Avancer ›</button>
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
    </div>
  );
}
