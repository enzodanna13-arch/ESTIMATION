"use client";

import { useEffect, useMemo, useState } from "react";
import { listLeads, type Lead } from "@/lib/leads";
import { listClients, type ClientDossier } from "@/lib/clients";
import { listEstimations, listDocuments, type HistoryMeta, type DocHistoryMeta } from "@/lib/history";
import { listRegistre, type AppelEntry } from "@/lib/registre";
import { EQUIPE, ASSISTANTE, membreDepuisNom, estNonPersonne } from "@/lib/equipe";
import { estDossierVendeurComplet } from "@/lib/docTypes";

const norm = (s?: string) => (s ?? "").trim().toLowerCase().replace(/\s+/g, " ");
const estGenerique = (k: string) => !k || k === "—" || k === "-" || k === "n/a" || k === "na";

interface Row {
  key: string; label: string; role: string;
  estimations: number; documents: number; mandats: number;
  leadsRecus: number; leadsTraites: number; leadsConvertis: number;
  appels: number; rdv: number; dossiers: number;
}
function rowVide(label: string, role = ""): Row {
  return { key: norm(label), label: label.trim(), role, estimations: 0, documents: 0, mandats: 0, leadsRecus: 0, leadsTraites: 0, leadsConvertis: 0, appels: 0, rdv: 0, dossiers: 0 };
}

type ColKey = "estimations" | "leadsRecus" | "leadsTraites" | "leadsConvertis" | "appels" | "rdv" | "mandats" | "dossiers";
const COLONNES: { cle: ColKey; label: string; court: string }[] = [
  { cle: "estimations", label: "Estimations", court: "Estim." },
  { cle: "leadsRecus", label: "Leads reçus", court: "Leads" },
  { cle: "leadsTraites", label: "Leads traités", court: "Traités" },
  { cle: "leadsConvertis", label: "Convertis", court: "Conv." },
  { cle: "appels", label: "Appels", court: "Appels" },
  { cle: "rdv", label: "RDV", court: "RDV" },
  { cle: "mandats", label: "Mandats", court: "Mandats" },
  { cle: "dossiers", label: "Dossiers", court: "Dossiers" },
];
const PERIODES = [
  { id: 7, label: "7 jours" },
  { id: 30, label: "30 jours" },
  { id: 0, label: "Tout" },
];

export default function NegociateursPage({ onRetour }: { onRetour: () => void }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<ClientDossier[]>([]);
  const [estims, setEstims] = useState<HistoryMeta[]>([]);
  const [docs, setDocs] = useState<DocHistoryMeta[]>([]);
  const [appels, setAppels] = useState<AppelEntry[]>([]);
  const [chargement, setChargement] = useState(true);
  const [periode, setPeriode] = useState<number>(30);
  const [tri, setTri] = useState<ColKey>("estimations");

  const recharger = async () => {
    const [l, c, e, d, r] = await Promise.all([
      listLeads(), listClients(),
      listEstimations().catch(() => []), listDocuments().catch(() => []),
      listRegistre().catch(() => ({ entrees: [] as AppelEntry[], mois: [] })),
    ]);
    setLeads(l); setClients(c); setEstims(e); setDocs(d); setAppels(r.entrees);
    setChargement(false);
  };
  useEffect(() => { void recharger(); }, []);

  const rows = useMemo(() => {
    const cutoff = periode > 0 ? Date.now() - periode * 24 * 3600 * 1000 : 0;
    const dansPeriode = (t?: number) => !cutoff || (typeof t === "number" && t >= cutoff);

    const map = new Map<string, Row>();
    // 1) On amorce avec l'équipe de référence : chaque membre apparaît toujours,
    //    même sans activité, avec son rôle. La clé est l'id du membre.
    for (const m of EQUIPE) map.set(m.id, rowVide(m.nom, m.role));

    // Tout nom saisi est ramené à la bonne personne (consolidation des variantes :
    // « FLECHER Emilie », « emilie flecher »… → Émilie Flécher). Les noms inconnus
    // vont dans une seule ligne « Autres » ; les non-personnes (site, facebook…)
    // sont ignorées.
    const obtenir = (label?: string): Row | null => {
      const membre = membreDepuisNom(label);
      if (membre) return map.get(membre.id)!;
      if (estNonPersonne(label) || estGenerique(norm(label))) return null;
      let r = map.get("__autres");
      if (!r) { r = rowVide("Autres", ""); map.set("__autres", r); }
      return r;
    };

    for (const e of estims) if (dansPeriode(e.createdAt)) { const r = obtenir(e.negociateur); if (r) r.estimations++; }
    for (const d of docs) if (dansPeriode(d.createdAt)) { const r = obtenir(d.negociateur); if (r) r.documents++; }

    for (const l of leads) {
      if (dansPeriode(l.createdAt)) {
        const r = obtenir(l.negociateur);
        if (r) { r.leadsRecus++; if (l.statut !== "Nouveau") r.leadsTraites++; if (l.statut === "Converti") r.leadsConvertis++; }
      }
      for (const ev of l.suivi ?? []) if (dansPeriode(ev.date)) {
        const r = obtenir(ev.auteur);
        if (r) { if (ev.type === "appel") r.appels++; if (ev.type === "rdv") r.rdv++; }
      }
    }

    for (const c of clients) {
      if (dansPeriode(c.createdAt)) { const r = obtenir(c.negociateur); if (r) r.dossiers++; }
      // Dossier vendeur complet = mandat, rattaché à son négociateur
      if (estDossierVendeurComplet(c) && dansPeriode(c.updatedAt)) { const r = obtenir(c.negociateur); if (r) r.mandats++; }
      for (const ev of c.timeline ?? []) if (dansPeriode(ev.date)) {
        const r = obtenir(ev.auteur);
        if (r) { if (ev.type === "appel") r.appels++; if (ev.type === "rdv") r.rdv++; }
      }
    }

    // Registre des appels : rattaché à l'assistante (elle consigne les appels).
    // Chaque appel du registre saisi dans la période compte pour elle.
    if (ASSISTANTE) {
      const r = map.get(ASSISTANTE.id);
      if (r) r.appels += appels.filter((a) => dansPeriode(a.createdAt)).length;
    }

    return [...map.values()].sort((x, y) => y[tri] - x[tri] || x.label.localeCompare(y.label));
  }, [estims, docs, leads, clients, appels, periode, tri]);

  const total = useMemo(() => {
    const t = rowVide("TOTAL AGENCE");
    for (const r of rows) for (const c of COLONNES) t[c.cle] += r[c.cle];
    t.documents = rows.reduce((s, r) => s + r.documents, 0);
    return t;
  }, [rows]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Accueil</button>
        <h2 className="text-2xl font-bold text-navy">👔 Suivi des négociateurs</h2>
        <button onClick={() => { setChargement(true); void recharger(); }} className="ml-auto rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100">↻ Rafraîchir</button>
      </div>

      {chargement ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">Chargement de l'activité…</div>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-semibold">
              {PERIODES.map((p) => (
                <button key={p.id} onClick={() => setPeriode(p.id)} className={`rounded-md px-3 py-1 transition ${periode === p.id ? "bg-copper text-white" : "text-slate-600 hover:bg-slate-100"}`}>{p.label}</button>
              ))}
            </div>
            <span className="text-xs text-slate-400">Période appliquée à toute l'activité datée · trié par « {COLONNES.find((c) => c.cle === tri)?.label} »</span>
          </div>

          {rows.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400">Aucune activité de négociateur sur la période.</div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="sticky left-0 z-10 bg-slate-50 px-4 py-2.5 font-bold text-navy">Négociateur</th>
                    {COLONNES.map((c) => (
                      <th key={c.cle} className="px-3 py-2.5 text-center font-semibold text-slate-600">
                        <button onClick={() => setTri(c.cle)} className={`transition hover:text-copper ${tri === c.cle ? "text-copper" : ""}`} title={`Trier par ${c.label}`}>
                          {c.court}{tri === c.cle ? " ▾" : ""}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.key} className="border-b border-slate-100 hover:bg-slate-50/60">
                      <td className="sticky left-0 z-10 bg-white px-4 py-2.5">
                        <div className="font-bold text-navy">{r.label}</div>
                        {r.role && <div className="text-[11px] font-medium text-slate-400">{r.role}</div>}
                      </td>
                      {COLONNES.map((c) => (
                        <td key={c.cle} className={`px-3 py-2.5 text-center ${tri === c.cle ? "font-bold text-copper" : "text-slate-700"}`}>{r[c.cle] || <span className="text-slate-300">0</span>}</td>
                      ))}
                    </tr>
                  ))}
                  <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold text-navy">
                    <td className="sticky left-0 z-10 bg-slate-50 px-4 py-2.5">TOTAL AGENCE</td>
                    {COLONNES.map((c) => (<td key={c.cle} className="px-3 py-2.5 text-center">{total[c.cle]}</td>))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-3 text-xs text-slate-400">
            Interconnecté automatiquement à toutes les sections : les <strong>estimations</strong>, <strong>documents/mandats</strong>,
            <strong> leads</strong> (reçus, traités, convertis + appels/RDV notés dans le suivi), <strong>dossiers clients</strong> (+ appels/RDV
            de la timeline) et les <strong>appels du registre</strong> (par destinataire). Cliquez sur une colonne pour trier. Astuce : saisissez
            toujours le <strong>même nom de négociateur</strong> pour un regroupement parfait.
          </p>
        </>
      )}
    </div>
  );
}
