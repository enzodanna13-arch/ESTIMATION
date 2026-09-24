"use client";

import { useEffect, useMemo, useState } from "react";
import { enregistrerResultat, getTournee, lienNavigation, listTournees } from "@/lib/prospection";
import {
  dpeCls, NIVEAUX_PROSPECTION, RESULTATS_PASSAGE, type EtapeTournee, type Tournee,
} from "@/lib/prospectionTypes";

const dateLongue = (t: number) => new Date(t).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
function formatDuree(min: number): string { const h = Math.floor(min / 60), m = Math.round(min % 60); return h > 0 ? `${h} h ${m.toString().padStart(2, "0")}` : `${m} min`; }
const estAujourdhui = (t: number) => { const d = new Date(); d.setHours(0, 0, 0, 0); return t >= d.getTime(); };

export default function MaTourneePage({ tourneeId, onRetour }: { tourneeId?: string; onRetour: () => void }) {
  const [tournee, setTournee] = useState<Tournee | null>(null);
  const [choix, setChoix] = useState<Tournee[]>([]);
  const [chargement, setChargement] = useState(true);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [ouvertResultat, setOuvertResultat] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setChargement(true);
      if (tourneeId) {
        setTournee(await getTournee(tourneeId));
      } else {
        const ts = (await listTournees()).filter((t) => estAujourdhui(t.date) && t.etapes.length > 0);
        if (ts.length === 1) setTournee(ts[0]);
        else setChoix(ts);
      }
      setChargement(false);
    })();
  }, [tourneeId]);

  const etapesTriees = useMemo(() => (tournee ? [...tournee.etapes].sort((a, b) => a.ordre - b.ordre) : []), [tournee]);
  const restantes = etapesTriees.filter((e) => !e.fait);
  const courante = restantes[0] ?? null;

  const enregistrer = async (etape: EtapeTournee, statut: string) => {
    if (!tournee) return;
    setBusy(true);
    const maj = await enregistrerResultat({ opportuniteId: etape.opportuniteId, tourneeId: tournee.id, resultat: statut, note: note.trim() || undefined, negociateur: tournee.negociateur || undefined });
    setBusy(false);
    if (maj) {
      setTournee((t) => t ? { ...t, etapes: t.etapes.map((e) => e.opportuniteId === etape.opportuniteId ? { ...e, fait: true, resultat: statut } : e) } : t);
      setNote(""); setOuvertResultat(null);
    }
  };

  if (chargement) return <p className="p-4 text-sm text-slate-400">Chargement de la tournée…</p>;

  if (!tournee) {
    return (
      <div className="mx-auto max-w-md p-4">
        <button onClick={onRetour} className="mb-3 rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600">← Retour</button>
        <h2 className="mb-3 text-xl font-bold text-navy">Ma tournée</h2>
        {choix.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-400">Aucune tournée aujourd&apos;hui. Demandez la génération des tournées depuis « Prospection ciblée ».</p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-slate-500">Choisissez votre tournée :</p>
            {choix.map((t) => (
              <button key={t.id} onClick={() => setTournee(t)} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left hover:border-copper">
                <div><div className="font-bold text-navy">{t.negociateur || "Non attribué"}{t.index ? ` — Tournée ${t.index}` : ""}</div><div className="text-xs text-slate-500">{t.etapes.length} biens · {t.distanceKm} km · ≈ {formatDuree(t.dureeMin)}</div></div>
                <span className="text-copper">→</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const faites = etapesTriees.length - restantes.length;

  return (
    <div className="mx-auto max-w-md p-4 pb-24">
      <button onClick={onRetour} className="mb-3 rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600">← Retour</button>

      {/* Résumé */}
      <div className="mb-4 rounded-2xl bg-navy p-4 text-white">
        <div className="text-xs uppercase tracking-wide text-white/60">Ma tournée — {tournee.negociateur || "Non attribué"}{tournee.index ? ` (n° ${tournee.index})` : ""}</div>
        <div className="text-lg font-bold capitalize">{dateLongue(tournee.date)}</div>
        <div className="mt-1 flex gap-4 text-sm text-white/90">
          <span><b>{tournee.etapes.length}</b> biens</span>
          <span><b>{tournee.distanceKm}</b> km</span>
          <span>≈ <b>{formatDuree(tournee.dureeMin)}</b></span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-copper transition-all" style={{ width: `${etapesTriees.length ? (faites / etapesTriees.length) * 100 : 0}%` }} /></div>
        <div className="mt-1 text-xs text-white/70">{faites} / {etapesTriees.length} effectués</div>
      </div>

      {courante ? (
        <div className="mb-4 rounded-2xl border-2 border-copper bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-copper text-sm font-bold text-white">{courante.ordre}</span>
            <span className="text-xs font-semibold uppercase text-copper">Prochaine adresse</span>
          </div>
          <h3 className="mt-2 text-lg font-bold text-navy">{courante.adresse}</h3>
          <p className="text-sm text-slate-500">{courante.ville}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">Score {courante.score}/100</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${NIVEAUX_PROSPECTION[courante.niveau].badge}`}>{NIVEAUX_PROSPECTION[courante.niveau].label}</span>
            {courante.typeBien && <span className="text-slate-500 capitalize">{courante.typeBien}{courante.surface ? ` • ${courante.surface} m²` : ""}</span>}
            {courante.dpe && <span className={`rounded px-1.5 py-0.5 text-xs font-bold ${dpeCls(courante.dpe)}`}>DPE {courante.dpe}</span>}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <a href={lienNavigation(courante)} target="_blank" rel="noreferrer" className="rounded-xl bg-navy py-3 text-center text-sm font-bold text-white">🧭 NAVIGATION</a>
            <button onClick={() => setOuvertResultat(ouvertResultat === courante.opportuniteId ? null : courante.opportuniteId)} className="rounded-xl bg-copper py-3 text-center text-sm font-bold text-white">RÉSULTAT DU PASSAGE</button>
          </div>

          {ouvertResultat === courante.opportuniteId && (
            <div className="mt-3 rounded-xl bg-slate-50 p-3">
              <div className="grid grid-cols-2 gap-2">
                {RESULTATS_PASSAGE.map((r) => (
                  <button key={r.statut} disabled={busy} onClick={() => void enregistrer(courante, r.statut)} className="rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-navy hover:text-white disabled:opacity-50">{r.label}</button>
                ))}
              </div>
              <input className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm" placeholder="Note (facultatif)" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          )}
        </div>
      ) : (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <div className="text-3xl">✅</div>
          <p className="mt-2 font-bold text-emerald-800">Tournée terminée !</p>
          <p className="text-sm text-emerald-700">Tous les biens ont été traités.</p>
        </div>
      )}

      {/* Étapes suivantes / historique */}
      <div className="space-y-1.5">
        {etapesTriees.map((e) => (
          <div key={e.opportuniteId} className={`flex items-center gap-2 rounded-xl border p-2.5 text-sm ${e.fait ? "border-slate-100 bg-slate-50 text-slate-400" : e === courante ? "border-copper/40 bg-white" : "border-slate-200 bg-white"}`}>
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${e.fait ? "bg-slate-200 text-slate-500" : "bg-navy text-white"}`}>{e.fait ? "✓" : e.ordre}</span>
            <div className="min-w-0 flex-1">
              <div className={`truncate font-medium ${e.fait ? "line-through" : "text-navy"}`}>{e.adresse}</div>
              <div className="truncate text-xs text-slate-400">{e.ville} · {e.score}/100{e.fait && e.resultat ? ` · ${e.resultat}` : ""}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
