"use client";

import { useEffect, useMemo, useState } from "react";
import { analyserVeille, listAlertesVeille, majStatutVeille, type AlerteDpe } from "@/lib/veilleDpeClient";

const dateFr = (t: number) => new Date(t).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
const dateIsoFr = (s: string) => { const m = s?.match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[3]}/${m[2]}/${m[1]}` : "—"; };
const joursDepuis = (s: string) => { const t = Date.parse(s); return Number.isFinite(t) ? Math.max(0, Math.floor((Date.now() - t) / 86_400_000)) : null; };

const STATUT_COUL: Record<AlerteDpe["statut"], string> = {
  nouveau: "bg-red-100 text-red-700",
  vu: "bg-amber-100 text-amber-700",
  "contacté": "bg-emerald-100 text-emerald-700",
  "écarté": "bg-slate-100 text-slate-500",
};

export default function VeilleDpePage({ onRetour, onOuvrirEstimation }: { onRetour: () => void; onOuvrirEstimation?: (id: string) => void }) {
  const [alertes, setAlertes] = useState<AlerteDpe[]>([]);
  const [chargement, setChargement] = useState(true);
  const [analyse, setAnalyse] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [nego, setNego] = useState("");
  const [voirEcartees, setVoirEcartees] = useState(false);

  useEffect(() => { listAlertesVeille().then((a) => { setAlertes(a); setChargement(false); }).catch(() => setChargement(false)); }, []);

  const lancer = async () => {
    setAnalyse(true); setErr(null); setMsg(null);
    try {
      const r = await analyserVeille();
      if (!r) { setErr("Analyse impossible (historique des estimations déverrouillé ?)."); return; }
      setAlertes(r.alertes);
      setMsg(`${r.analysees} estimation(s) analysée(s) · ${r.nouvelles} nouvelle(s) alerte(s) · ${r.total} au total.`);
    } catch { setErr("Analyse impossible."); }
    finally { setAnalyse(false); }
  };

  const setStatut = async (id: string, statut: AlerteDpe["statut"]) => {
    const a = await majStatutVeille(id, statut);
    if (a.length) setAlertes(a);
  };

  const negos = useMemo(() => [...new Set(alertes.map((a) => a.negociateur).filter(Boolean))].sort(), [alertes]);
  const filtrees = useMemo(() => alertes
    .filter((a) => (voirEcartees ? true : a.statut !== "écarté"))
    .filter((a) => (nego ? a.negociateur === nego : true))
    .sort((a, b) => Date.parse(b.dpeDate) - Date.parse(a.dpeDate)), [alertes, nego, voirEcartees]);
  const nbNouvelles = alertes.filter((a) => a.statut === "nouveau").length;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <button onClick={onRetour} className="mb-2 rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">← Retour</button>
          <h2 className="text-2xl font-bold text-navy">🔔 Veille mise en vente {nbNouvelles > 0 && <span className="align-middle rounded-full bg-red-100 px-2 py-0.5 text-[12px] font-bold text-red-700">{nbNouvelles} nouvelle{nbNouvelles > 1 ? "s" : ""}</span>}</h2>
          <p className="text-sm text-slate-500">Un DPE réalisé <b>après</b> votre estimation = le propriétaire prépare la vente. On croise vos estimations avec l&apos;ADEME pour vous prévenir à temps.</p>
        </div>
        <button onClick={() => void lancer()} disabled={analyse} className="rounded-lg bg-copper px-4 py-2 text-sm font-bold text-white hover:brightness-110 disabled:opacity-50">
          {analyse ? "Analyse en cours…" : "🔄 Analyser maintenant"}
        </button>
      </div>

      {msg && <p className="mb-3 rounded-lg bg-emerald-50 p-2.5 text-sm text-emerald-700">{msg}</p>}
      {err && <p className="mb-3 rounded-lg bg-red-50 p-2.5 text-sm text-red-600">{err}</p>}

      {/* Filtres */}
      {alertes.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
          <select className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5" value={nego} onChange={(e) => setNego(e.target.value)}>
            <option value="">Tous les négociateurs</option>
            {negos.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <label className="flex items-center gap-1.5 text-slate-600"><input type="checkbox" checked={voirEcartees} onChange={(e) => setVoirEcartees(e.target.checked)} /> Voir les écartées</label>
          <span className="ml-auto text-xs text-slate-400">{filtrees.length} alerte(s)</span>
        </div>
      )}

      {chargement ? (
        <p className="text-sm text-slate-400">Chargement…</p>
      ) : filtrees.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">
          {alertes.length === 0
            ? "Aucune alerte pour l'instant. Cliquez sur « Analyser maintenant » pour croiser vos estimations avec l'ADEME (l'historique des estimations doit être déverrouillé)."
            : "Aucune alerte pour ce filtre."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtrees.map((a) => {
            const jours = joursDepuis(a.dpeDate);
            return (
              <div key={a.id} className={`rounded-2xl border bg-white p-4 ${a.statut === "nouveau" ? "border-red-200" : "border-slate-200"}`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-navy">📍 {a.adresse || "Adresse"}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUT_COUL[a.statut]}`}>{a.statut}</span>
                    </div>
                    <div className="text-xs text-slate-500">{[a.codePostal, a.ville].filter(Boolean).join(" ")} · Client : {a.client || "—"} · Négo : {a.negociateur || "—"}</div>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    Estimé le {dateFr(a.dateEstimation)}
                  </div>
                </div>

                <div className="mt-2 rounded-xl bg-red-50/70 px-3 py-2 text-sm text-red-800">
                  🔔 <b>DPE réalisé le {dateIsoFr(a.dpeDate)}</b>{jours != null ? ` (il y a ${jours} j)` : ""} — classe <b>{a.dpeClasse || "?"}</b>{a.dpeSurface != null ? ` · ${a.dpeSurface} m²` : ""}. Le propriétaire prépare vraisemblablement la vente : <b>à rappeler en priorité.</b>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {onOuvrirEstimation && <button onClick={() => onOuvrirEstimation(a.estimationId)} className="rounded-lg bg-navy px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-deep">📄 Ouvrir l&apos;estimation</button>}
                  {a.statut !== "contacté" && <button onClick={() => void setStatut(a.id, "contacté")} className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">✓ Marquer contacté</button>}
                  {a.statut === "nouveau" && <button onClick={() => void setStatut(a.id, "vu")} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">👁️ Vu</button>}
                  {a.statut !== "écarté"
                    ? <button onClick={() => void setStatut(a.id, "écarté")} className="ml-auto rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-50">Écarter</button>
                    : <button onClick={() => void setStatut(a.id, "nouveau")} className="ml-auto rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50">Rétablir</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-4 text-[11px] text-slate-400">Croisement des adresses de vos estimations avec la base ADEME (open data). Une correspondance repose sur l&apos;adresse géocodée ; vérifiez avant de conclure. Analyse relancée automatiquement chaque jour.</p>
    </div>
  );
}
