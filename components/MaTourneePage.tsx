"use client";

import { useEffect, useMemo, useState } from "react";
import { enregistrerResultat, getTournee, lienItineraireComplet, lienNavigation, listTournees } from "@/lib/prospection";
import { photoNegociateur } from "@/lib/equipe";
import {
  dpeCls, NIVEAUX_PROSPECTION, RESULTATS_PASSAGE, type EtapeTournee, type Tournee,
} from "@/lib/prospectionTypes";

const dateLongue = (t: number) => new Date(t).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
function formatDuree(min: number): string { const h = Math.floor(min / 60), m = Math.round(min % 60); return h > 0 ? `${h} h ${m.toString().padStart(2, "0")}` : `${m} min`; }
const estAujourdhui = (t: number) => { const d = new Date(); d.setHours(0, 0, 0, 0); return t >= d.getTime(); };
function initiales(nom: string): string {
  if (!nom || nom === "Non attribué") return "?";
  return nom.trim().split(/\s+/).slice(0, 2).map((m) => m[0]?.toUpperCase() ?? "").join("");
}
function AvatarNego({ nom, size }: { nom: string; size: number }) {
  const photo = photoNegociateur(nom);
  if (photo) return <img src={photo} alt={nom} className="rounded-full object-cover" style={{ width: size, height: size }} />;
  return <span className="flex items-center justify-center rounded-full bg-copper font-bold text-white" style={{ width: size, height: size, fontSize: size * 0.38 }}>{initiales(nom)}</span>;
}

export default function MaTourneePage({ tourneeId, onRetour }: { tourneeId?: string; onRetour: () => void }) {
  const [tournee, setTournee] = useState<Tournee | null>(null);
  const [choix, setChoix] = useState<Tournee[]>([]);
  const [chargement, setChargement] = useState(true);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [ouvertResultat, setOuvertResultat] = useState<string | null>(null);
  const [negoSel, setNegoSel] = useState<string | null>(null);

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
    const negoDe = (t: Tournee) => t.negociateur || "Non attribué";
    const parNego = new Map<string, Tournee[]>();
    for (const t of choix) (parNego.get(negoDe(t)) ?? parNego.set(negoDe(t), []).get(negoDe(t))!).push(t);
    const negos = [...parNego.keys()].sort();
    const negoActif = negoSel && parNego.has(negoSel) ? negoSel : null;

    return (
      <div className="mx-auto max-w-md p-4">
        <button onClick={onRetour} className="mb-3 rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600">← Retour</button>
        <h2 className="mb-3 text-xl font-bold text-navy">🧭 Ma tournée</h2>

        {choix.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-400">Aucune tournée aujourd&apos;hui. Demandez la génération des tournées depuis « Prospection ciblée ».</p>
        ) : !negoActif ? (
          /* Étape 1 : choisir le négociateur */
          <div>
            <p className="mb-3 text-sm text-slate-500">Qui prospecte aujourd&apos;hui ?</p>
            <div className="grid grid-cols-2 gap-3">
              {negos.map((n) => {
                const g = parNego.get(n)!;
                const biens = g.reduce((s, t) => s + t.etapes.length, 0);
                const faits = g.reduce((s, t) => s + t.etapes.filter((e) => e.fait).length, 0);
                return (
                  <button key={n} onClick={() => setNegoSel(n)} className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center transition hover:border-copper hover:shadow">
                    <AvatarNego nom={n} size={56} />
                    <div className="font-bold text-navy leading-tight">{n}</div>
                    <div className="text-[11px] text-slate-500">{g.length} tournée{g.length > 1 ? "s" : ""} · {biens} biens</div>
                    {faits > 0 && <div className="text-[11px] font-semibold text-emerald-600">{faits}/{biens} faits</div>}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Étape 2 : choisir la tournée du négociateur */
          <div>
            <button onClick={() => setNegoSel(null)} className="mb-3 text-sm font-semibold text-copper">← Changer de négociateur</button>
            <div className="mb-3 flex items-center gap-3 rounded-2xl bg-navy p-3 text-white">
              <AvatarNego nom={negoActif} size={42} />
              <div>
                <div className="font-bold">{negoActif}</div>
                <div className="text-xs text-white/70">{parNego.get(negoActif)!.length} tournée(s) aujourd&apos;hui</div>
              </div>
            </div>
            <div className="space-y-2">
              {parNego.get(negoActif)!.slice().sort((a, b) => (a.index ?? 0) - (b.index ?? 0)).map((t) => {
                const faits = t.etapes.filter((e) => e.fait).length;
                return (
                  <button key={t.id} onClick={() => setTournee(t)} className="flex w-full items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-left hover:border-copper">
                    <div className="min-w-0">
                      <div className="font-bold text-navy">Tournée {t.index ?? "•"} · 📍 {t.etapes[0]?.ville || "—"}</div>
                      <div className="text-xs text-slate-500">{t.etapes.length} biens · {t.distanceKm} km · ≈ {formatDuree(t.dureeMin)}{faits > 0 ? ` · ${faits} faits` : ""}</div>
                    </div>
                    <span className="text-copper">→</span>
                  </button>
                );
              })}
            </div>
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
        {(() => {
          const aFaire = etapesTriees.filter((e) => !e.fait);
          const lien = lienItineraireComplet((aFaire.length ? aFaire : etapesTriees).map((e) => ({ lat: e.lat, lon: e.lon })));
          return lien ? (
            <a href={lien} target="_blank" rel="noreferrer" className="mt-3 block rounded-xl bg-copper py-2.5 text-center text-sm font-bold text-white">🧭 Itinéraire complet dans le GPS ({(aFaire.length ? aFaire : etapesTriees).length} arrêts)</a>
          ) : null;
        })()}
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
            <a href={lienNavigation(courante)} target="_blank" rel="noreferrer" className="rounded-xl bg-navy py-3 text-center text-sm font-bold text-white">🧭 Y ALLER</a>
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
