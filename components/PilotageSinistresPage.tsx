"use client";

import { useEffect, useMemo, useState } from "react";
import { listSinistres, STATUTS_SINISTRE, type Sinistre } from "@/lib/sinistres";
import { listRecommandes, STATUTS_RECO, type Recommande } from "@/lib/recommandes";

const nf = new Intl.NumberFormat("fr-FR");
const todayISO = () => new Date().toISOString().slice(0, 10);
const dateFr = (iso: string) => { if (!iso) return "—"; const d = new Date(iso + "T12:00:00"); return Number.isFinite(d.getTime()) ? d.toLocaleDateString("fr-FR") : iso; };

const SIN_DONE = ["Indemnisé", "Clôturé"];
const REC_DONE = ["Traité", "Clôturé"];
const sinFait = (s: Sinistre) => SIN_DONE.includes(s.statut);
const recFait = (r: Recommande) => REC_DONE.includes(r.statut);
const recEnRetard = (r: Recommande) => !!r.echeance && r.echeance < todayISO() && !recFait(r);

const STATUT_SIN_COULEUR: Record<string, string> = {
  "Déclaré": "bg-slate-200 text-slate-700", "Déclaration envoyée": "bg-sky-100 text-sky-700",
  "Expertise en attente": "bg-amber-100 text-amber-700", "Expertise réalisée": "bg-violet-100 text-violet-700",
  "Travaux en cours": "bg-orange-100 text-orange-700", "Indemnisé": "bg-emerald-100 text-emerald-700", "Clôturé": "bg-slate-800 text-white",
};
const STATUT_REC_COULEUR: Record<string, string> = {
  "À traiter": "bg-amber-100 text-amber-700", "En cours": "bg-sky-100 text-sky-700",
  "En attente de réponse": "bg-violet-100 text-violet-700", "Traité": "bg-emerald-100 text-emerald-700", "Clôturé": "bg-slate-800 text-white",
};

function Barre({ fait, total }: { fait: number; total: number }) {
  const pct = total > 0 ? Math.round((fait / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} /></div>
      <span className="shrink-0 text-xs font-bold text-slate-600">{pct}%</span>
    </div>
  );
}

export default function PilotageSinistresPage({ onRetour, onOuvrirSinistres, onOuvrirRecommandes }: { onRetour: () => void; onOuvrirSinistres: () => void; onOuvrirRecommandes: () => void }) {
  const [sinistres, setSinistres] = useState<Sinistre[]>([]);
  const [recommandes, setRecommandes] = useState<Recommande[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => { let a = false; void (async () => { const [s, r] = await Promise.all([listSinistres(), listRecommandes()]); if (!a) { setSinistres(s); setRecommandes(r); setChargement(false); } })(); return () => { a = true; }; }, []);

  const sinParStatut = useMemo(() => STATUTS_SINISTRE.map((st) => ({ st, n: sinistres.filter((s) => s.statut === st).length })).filter((x) => x.n > 0), [sinistres]);
  const recParStatut = useMemo(() => STATUTS_RECO.map((st) => ({ st, n: recommandes.filter((r) => r.statut === st).length })).filter((x) => x.n > 0), [recommandes]);
  const sinFaits = sinistres.filter(sinFait).length;
  const recFaits = recommandes.filter(recFait).length;
  const recRetard = recommandes.filter(recEnRetard);

  const parGest = useMemo(() => {
    const map = new Map<string, { gest: string; total: number; aFaire: number; retard: number; done: number }>();
    for (const r of recommandes) {
      const g = r.gestionnaire?.trim() || "Non attribué";
      const e = map.get(g) ?? { gest: g, total: 0, aFaire: 0, retard: 0, done: 0 };
      e.total += 1;
      if (recFait(r)) e.done += 1; else e.aFaire += 1;
      if (recEnRetard(r)) e.retard += 1;
      map.set(g, e);
    }
    return Array.from(map.values()).sort((a, b) => b.retard - a.retard || b.aFaire - a.aFaire || b.total - a.total);
  }, [recommandes]);

  const recAFaire = useMemo(() => recommandes.filter((r) => !recFait(r)).sort((a, b) => Number(recEnRetard(b)) - Number(recEnRetard(a)) || (a.echeance || "9999").localeCompare(b.echeance || "9999")), [recommandes]);
  const sinAFaire = useMemo(() => sinistres.filter((s) => !sinFait(s)), [sinistres]);

  if (chargement) return <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400">Chargement…</div>;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Accueil</button>
        <h2 className="text-2xl font-bold text-navy">🗂️ Suivi sinistres &amp; recommandés</h2>
      </div>
      <p className="mb-4 text-sm text-slate-500">Vue d'ensemble du <strong>traité</strong> et du <strong>reste à faire</strong> par tes gestionnaires.</p>

      {/* KPI */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {[
          ["Sinistres", nf.format(sinistres.length), "text-navy"],
          ["Sinistres à faire", nf.format(sinistres.length - sinFaits), "text-amber-600"],
          ["Sinistres clôturés", nf.format(sinFaits), "text-emerald-600"],
          ["Recommandés", nf.format(recommandes.length), "text-navy"],
          ["Recom. à traiter", nf.format(recommandes.length - recFaits), "text-amber-600"],
          ["Recom. en retard", nf.format(recRetard.length), "text-red-600"],
        ].map(([l, v, c]) => (
          <div key={l} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center"><div className={`text-xl font-black ${c}`}>{v}</div><div className="text-[10px] text-slate-500">{l}</div></div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Sinistres */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-base font-bold text-navy">🌊 Sinistres</h3>
            <button onClick={onOuvrirSinistres} className="text-xs font-bold text-copper hover:underline">Ouvrir →</button>
          </div>
          <div className="mb-3"><Barre fait={sinFaits} total={sinistres.length} /><div className="mt-1 text-[11px] text-slate-400">{sinFaits}/{sinistres.length} clôturés ou indemnisés</div></div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {sinParStatut.map(({ st, n }) => <span key={st} className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUT_SIN_COULEUR[st] ?? "bg-slate-200 text-slate-700"}`}>{st} · {n}</span>)}
          </div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Reste à faire ({sinAFaire.length})</div>
          <ul className="mt-1 max-h-60 space-y-1 overflow-y-auto">
            {sinAFaire.length === 0 ? <li className="py-2 text-center text-xs text-emerald-600">Tout est traité ✓</li> : sinAFaire.map((s) => (
              <li key={s.id} className="flex items-center gap-2 rounded-lg border border-slate-100 px-2 py-1.5 text-xs">
                <span className="min-w-0 flex-1 truncate font-semibold text-navy">{s.coproNom}</span>
                <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${STATUT_SIN_COULEUR[s.statut] ?? "bg-slate-200 text-slate-700"}`}>{s.statut}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommandés */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-base font-bold text-navy">📬 Recommandés</h3>
            <button onClick={onOuvrirRecommandes} className="text-xs font-bold text-copper hover:underline">Ouvrir →</button>
          </div>
          <div className="mb-3"><Barre fait={recFaits} total={recommandes.length} /><div className="mt-1 text-[11px] text-slate-400">{recFaits}/{recommandes.length} traités ou clôturés</div></div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {recParStatut.map(({ st, n }) => <span key={st} className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUT_REC_COULEUR[st] ?? "bg-slate-200 text-slate-700"}`}>{st} · {n}</span>)}
          </div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Reste à traiter ({recAFaire.length})</div>
          <ul className="mt-1 max-h-60 space-y-1 overflow-y-auto">
            {recAFaire.length === 0 ? <li className="py-2 text-center text-xs text-emerald-600">Tout est traité ✓</li> : recAFaire.map((r) => (
              <li key={r.id} className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs ${recEnRetard(r) ? "border-red-200 bg-red-50/50" : "border-slate-100"}`}>
                <span className="min-w-0 flex-1 truncate"><span className="font-semibold text-navy">{r.objet || "Recommandé"}</span>{r.gestionnaire ? <span className="text-slate-400"> · {r.gestionnaire}</span> : null}</span>
                {recEnRetard(r) && <span className="shrink-0 text-[10px] font-bold text-red-600">⏰ {dateFr(r.echeance)}</span>}
                <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${STATUT_REC_COULEUR[r.statut] ?? "bg-slate-200 text-slate-700"}`}>{r.statut}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Par gestionnaire (recommandés) */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-4"><h3 className="text-base font-bold text-navy">👔 Recommandés par gestionnaire</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2 text-left">Gestionnaire</th>
                <th className="px-3 py-2 text-right">Total</th>
                <th className="px-3 py-2 text-right">À traiter</th>
                <th className="px-3 py-2 text-right">En retard</th>
                <th className="px-3 py-2 text-right">Traités</th>
                <th className="px-3 py-2 text-left">Avancement</th>
              </tr>
            </thead>
            <tbody>
              {parGest.length === 0 ? <tr><td colSpan={6} className="px-3 py-6 text-center text-slate-400">Aucun recommandé.</td></tr> : parGest.map((g) => (
                <tr key={g.gest} className="border-b border-slate-100 last:border-0">
                  <td className="px-3 py-2 font-semibold text-navy">{g.gest}</td>
                  <td className="px-3 py-2 text-right text-slate-600">{g.total}</td>
                  <td className="px-3 py-2 text-right font-bold text-amber-600">{g.aFaire}</td>
                  <td className="px-3 py-2 text-right font-bold text-red-600">{g.retard || "—"}</td>
                  <td className="px-3 py-2 text-right font-bold text-emerald-600">{g.done}</td>
                  <td className="px-3 py-2"><div className="min-w-[120px]"><Barre fait={g.done} total={g.total} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
