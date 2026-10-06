"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EQUIPE } from "@/lib/equipe";
import { chargerOrg, sauverJour, listerOrg, construirePlan, niveauDe, totalRdv, LABEL_NIVEAU, dateJour, type JoursOrg, type PlanJour, type RdvJour, type TacheOrg, type OrgNego } from "@/lib/organisation";

const CLE_NEGO = "organisation:nego:v1";
const APPRENANTS = EQUIPE.filter((m) => m.sections.some((s) => s === "transaction" || s === "gestion"));

const CAT_STYLE: Record<string, string> = {
  Socle: "bg-slate-200 text-slate-600",
  Prospection: "bg-blue-100 text-blue-700",
  Chasse: "bg-amber-100 text-amber-700",
  Phoning: "bg-emerald-100 text-emerald-700",
  Suivi: "bg-violet-100 text-violet-700",
  Formation: "bg-copper/15 text-copper",
};
const ORDRE_CAT = ["Socle", "Prospection", "Chasse", "Phoning", "Suivi", "Formation"];

const fmtJour = (iso: string) => { try { return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }); } catch { return iso; } };

export default function OrganisationPage({ onRetour }: { onRetour: () => void }) {
  const [negoId, setNegoId] = useState<string>(() => { try { return localStorage.getItem(CLE_NEGO) ?? ""; } catch { return ""; } });
  const [jours, setJours] = useState<JoursOrg>({});
  const [rdv, setRdv] = useState<RdvJour>({ visites: 0, r1: 0, r2: 0 });
  const [saisie, setSaisie] = useState(false);
  const [sauve, setSauve] = useState<"" | "en" | "ok">("");
  const [vueEquipe, setVueEquipe] = useState(false);
  const [equipe, setEquipe] = useState<OrgNego[]>([]);
  const timer = useRef<number | null>(null);
  const aujd = dateJour();
  const plan = jours[aujd] ?? null;

  useEffect(() => {
    try { if (negoId) localStorage.setItem(CLE_NEGO, negoId); else localStorage.removeItem(CLE_NEGO); } catch { /* ignore */ }
    if (!negoId) { setJours({}); return; }
    let annule = false;
    void (async () => { const j = await chargerOrg(negoId); if (!annule) { setJours(j); setSaisie(false); } })();
    return () => { annule = true; };
  }, [negoId]);

  const sauvegarder = (p: PlanJour) => {
    if (!negoId) return;
    setSauve("en");
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => { const ok = await sauverJour(negoId, p); setSauve(ok ? "ok" : ""); }, 600);
  };

  const genererJournee = () => {
    const nouveau = construirePlan(aujd, rdv);
    // Préserver les cases déjà cochées (si on réajuste les RDV).
    const ancien = jours[aujd];
    if (ancien) for (const t of nouveau.taches) { const a = ancien.taches.find((x) => x.libelle === t.libelle); if (a?.fait) t.fait = true; }
    const j = { ...jours, [aujd]: nouveau };
    setJours(j); setSaisie(false); sauvegarder(nouveau);
  };

  const basculer = (id: string) => {
    if (!plan) return;
    const maj = { ...plan, taches: plan.taches.map((t) => (t.id === id ? { ...t, fait: !t.fait } : t)) };
    setJours({ ...jours, [aujd]: maj }); sauvegarder(maj);
  };

  useEffect(() => {
    if (!vueEquipe) return;
    let annule = false;
    void (async () => { const e = await listerOrg(); if (!annule) setEquipe(e); })();
    return () => { annule = true; };
  }, [vueEquipe]);

  const stats = useMemo(() => {
    if (!plan) return { faites: 0, total: 0, pct: 0 };
    const faites = plan.taches.filter((t) => t.fait).length;
    return { faites, total: plan.taches.length, pct: plan.taches.length ? Math.round((faites / plan.taches.length) * 100) : 0 };
  }, [plan]);

  const inputRdv = (lbl: string, k: keyof RdvJour) => (
    <label className="flex flex-col items-center gap-1">
      <span className="text-xs font-semibold text-slate-500">{lbl}</span>
      <input type="number" min={0} value={rdv[k] || 0} onChange={(e) => setRdv((r) => ({ ...r, [k]: Math.max(0, Number(e.target.value) || 0) }))} className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-center text-lg font-bold text-navy focus:border-copper focus:outline-none" />
    </label>
  );

  const groupes = useMemo(() => {
    if (!plan) return [] as { cat: string; taches: TacheOrg[] }[];
    const map = new Map<string, TacheOrg[]>();
    for (const t of plan.taches) { if (!map.has(t.categorie)) map.set(t.categorie, []); map.get(t.categorie)!.push(t); }
    return [...map.entries()].sort((a, b) => ORDRE_CAT.indexOf(a[0]) - ORDRE_CAT.indexOf(b[0])).map(([cat, taches]) => ({ cat, taches }));
  }, [plan]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Accueil</button>
        <h2 className="text-2xl font-bold text-navy">🗓️ Mon organisation</h2>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setVueEquipe((v) => !v)} className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${vueEquipe ? "border-copper bg-copper text-white" : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"}`}>👔 Vue équipe</button>
          <label className="text-xs font-semibold text-slate-500">Je suis</label>
          <select value={negoId} onChange={(e) => setNegoId(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-navy shadow-sm focus:border-copper focus:outline-none">
            <option value="">— Sélectionner —</option>
            {APPRENANTS.map((m) => <option key={m.id} value={m.id}>{m.nom}</option>)}
          </select>
          {negoId && <span className="text-[11px] font-semibold text-emerald-600">{sauve === "en" ? "…" : sauve === "ok" ? "✓" : ""}</span>}
        </div>
      </div>

      {vueEquipe ? (
        <VueEquipe equipe={equipe} aujd={aujd} onFermer={() => setVueEquipe(false)} />
      ) : !negoId ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">Sélectionnez votre nom pour organiser votre journée. Votre plan est enregistré et visible par la direction.</div>
      ) : (
        <>
          <p className="mb-4 text-sm capitalize text-slate-500">{fmtJour(aujd)}</p>

          {(!plan || saisie) ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <div className="text-base font-bold text-navy">Combien de RDV as-tu aujourd'hui ?</div>
              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">On adapte tes tâches du jour en fonction : plus tu as de RDV, plus ta journée est allégée pour te laisser le temps.</p>
              <div className="mt-5 flex items-end justify-center gap-5">
                {inputRdv("Visites", "visites")}
                {inputRdv("Estim. R1", "r1")}
                {inputRdv("Estim. R2", "r2")}
              </div>
              <div className="mt-4 text-xs font-semibold text-copper">{totalRdv(rdv)} RDV · {LABEL_NIVEAU[niveauDe(rdv)]}</div>
              <button onClick={genererJournee} className="mt-5 rounded-xl bg-navy px-6 py-2.5 text-sm font-bold text-white transition hover:brightness-110">Générer ma journée →</button>
            </div>
          ) : (
            <>
              <div className="mb-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-navy to-navy/90 p-5 text-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-copper">{LABEL_NIVEAU[plan.niveau as keyof typeof LABEL_NIVEAU] ?? plan.niveau}</div>
                    <div className="mt-1 text-sm text-white/80">{plan.rdv.visites} visite(s) · {plan.rdv.r1} R1 · {plan.rdv.r2} R2 — <strong className="text-white">{totalRdv(plan.rdv)} RDV</strong></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right"><div className="text-2xl font-black">{stats.pct}%</div><div className="text-[11px] text-white/70">{stats.faites}/{stats.total} tâches</div></div>
                    <button onClick={() => { setRdv(plan.rdv); setSaisie(true); }} className="rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-xs font-bold transition hover:bg-white/20">Modifier mes RDV</button>
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-copper transition-all" style={{ width: `${stats.pct}%` }} /></div>
              </div>

              <div className="space-y-4">
                {groupes.map(({ cat, taches }) => (
                  <div key={cat}>
                    <div className="mb-1.5 flex items-center gap-2"><span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${CAT_STYLE[cat] ?? "bg-slate-100 text-slate-600"}`}>{cat}</span></div>
                    <div className="space-y-1.5">
                      {taches.map((t) => (
                        <button key={t.id} onClick={() => basculer(t.id)} className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition ${t.fait ? "border-emerald-200 bg-emerald-50 text-slate-500 line-through" : "border-slate-200 bg-white text-slate-700 hover:border-copper/40 hover:bg-slate-50"}`}>
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs ${t.fait ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300"}`}>{t.fait ? "✓" : ""}</span>
                          <span className="flex-1 font-medium">{t.libelle}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {stats.pct === 100 && <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-center text-sm font-bold text-emerald-700">🎉 Journée bouclée — bravo !</div>}
              <p className="mt-3 text-[11px] text-slate-400">Le socle est à faire tous les jours. Les tâches de prospection/formation sont dosées selon tes RDV pour ne pas te surcharger.</p>
            </>
          )}
        </>
      )}
    </div>
  );
}

function VueEquipe({ equipe, aujd, onFermer }: { equipe: OrgNego[]; aujd: string; onFermer: () => void }) {
  const rows = useMemo(() => {
    const parId = new Map(equipe.map((o) => [o.negoId, o]));
    const ids = new Set(APPRENANTS.map((m) => m.id)); for (const o of equipe) ids.add(o.negoId);
    return [...ids].map((id) => {
      const membre = EQUIPE.find((m) => m.id === id);
      const plan = parId.get(id)?.jours?.[aujd];
      const faites = plan ? plan.taches.filter((t) => t.fait).length : 0;
      const total = plan ? plan.taches.length : 0;
      return { id, nom: membre?.nom ?? id, plan, faites, total, pct: total ? Math.round((faites / total) * 100) : 0 };
    }).sort((a, b) => b.pct - a.pct || a.nom.localeCompare(b.nom));
  }, [equipe, aujd]);

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-lg font-bold text-navy">👔 Organisation du jour — équipe</h3>
        <button onClick={onFermer} className="ml-auto rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">← Mon organisation</button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead><tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-500">
            <th className="px-4 py-2.5">Négociateur</th><th className="px-3 py-2.5 text-center">RDV (V/R1/R2)</th><th className="px-3 py-2.5 text-left">Tâches du jour</th><th className="px-3 py-2.5 text-center">Avancement</th>
          </tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                <td className="px-4 py-2.5 font-bold text-navy">{r.nom}</td>
                <td className="px-3 py-2.5 text-center text-slate-700">{r.plan ? `${r.plan.rdv.visites}/${r.plan.rdv.r1}/${r.plan.rdv.r2}` : <span className="text-slate-300">—</span>}</td>
                <td className="px-3 py-2.5">
                  {r.plan ? (
                    <div className="flex items-center gap-2"><div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-copper" style={{ width: `${r.pct}%` }} /></div><span className="text-xs font-semibold text-slate-500">{r.faites}/{r.total}</span></div>
                  ) : <span className="text-xs text-slate-400">journée non démarrée</span>}
                </td>
                <td className="px-3 py-2.5 text-center font-bold text-copper">{r.plan ? `${r.pct}%` : <span className="text-slate-300">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-400">Avancement des tâches du jour par négociateur (mis à jour en temps réel).</p>
    </div>
  );
}
