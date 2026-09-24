"use client";

import { useState } from "react";
import { EQUIPE } from "@/lib/equipe";
import { CONFIG_PROSPECTION_DEFAUT, type CommuneSurveillee, type ProspectionConfig, type SecteurNegociateur } from "@/lib/prospectionTypes";

const inputCls = "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/20";
const JOURS = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];
const NEGOS = EQUIPE.filter((m) => m.sections.includes("transaction"));

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><h3 className="mb-3 text-sm font-bold text-navy">{titre}</h3>{children}</div>;
}
function Num({ label, value, onChange, suffix }: { label: string; value: number; onChange: (n: number) => void; suffix?: string }) {
  return <label className="block"><span className="text-[11px] uppercase tracking-wide text-slate-400">{label}</span><div className="flex items-center gap-1"><input type="number" className={inputCls} value={value} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} />{suffix && <span className="text-xs text-slate-400">{suffix}</span>}</div></label>;
}

export default function ProspectionReglages({
  config, onSave, onRescore, busy,
}: {
  config: ProspectionConfig; onSave: (patch: Partial<ProspectionConfig>) => Promise<void>; onRescore: () => void; busy: string | null;
}) {
  const [c, setC] = useState<ProspectionConfig>(config);
  const [saving, setSaving] = useState(false);
  const set = (patch: Partial<ProspectionConfig>) => setC((p) => ({ ...p, ...patch }));
  const setCoef = (k: keyof ProspectionConfig["coefficients"], v: number) => setC((p) => ({ ...p, coefficients: { ...p.coefficients, [k]: v } }));
  const setSeuil = (k: keyof ProspectionConfig["seuils"], v: number) => setC((p) => ({ ...p, seuils: { ...p.seuils, [k]: v } }));
  const setTour = (k: keyof ProspectionConfig["tournee"], v: number) => setC((p) => ({ ...p, tournee: { ...p.tournee, [k]: v } }));
  const setRel = (patch: Partial<ProspectionConfig["relances"]>) => setC((p) => ({ ...p, relances: { ...p.relances, ...patch } }));

  const setCommune = (i: number, patch: Partial<CommuneSurveillee>) => setC((p) => ({ ...p, communes: p.communes.map((cm, j) => (j === i ? { ...cm, ...patch } : cm)) }));
  const addCommune = () => setC((p) => ({ ...p, communes: [...p.communes, { code: "", nom: "", codePostal: "" }] }));
  const delCommune = (i: number) => setC((p) => ({ ...p, communes: p.communes.filter((_, j) => j !== i) }));

  const setSecteur = (id: string, patch: Partial<SecteurNegociateur>) => setC((p) => {
    const cur: SecteurNegociateur = p.secteurs[id] ?? { communes: [], zones: "", jours: [], maxAdresses: 0, dureeMinutes: 0 };
    return { ...p, secteurs: { ...p.secteurs, [id]: { ...cur, ...patch } } };
  });

  const enregistrer = async () => { setSaving(true); await onSave(c); setSaving(false); };

  return (
    <div className="space-y-3 pb-24">
      {/* Activation */}
      <Section titre="Module Chasse immobilière">
        <div className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 ${c.actif ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
          <div>
            <div className={`text-sm font-bold ${c.actif ? "text-emerald-700" : "text-slate-600"}`}>{c.actif ? "✅ Module activé" : "⏸️ Module désactivé"}</div>
            <div className="text-xs text-slate-500">Autorise la synchronisation Open Data et la génération de tournées.</div>
          </div>
          <button
            type="button"
            onClick={() => set({ actif: !c.actif })}
            className={`relative h-8 w-14 shrink-0 rounded-full transition ${c.actif ? "bg-emerald-500" : "bg-slate-300"}`}
            aria-label="Activer le module"
          >
            <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${c.actif ? "left-7" : "left-1"}`} />
          </button>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">Pensez à <b>Enregistrer les réglages</b> (bouton en bas) après toute modification.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="block"><span className="text-[11px] uppercase tracking-wide text-slate-400">Types de biens</span>
            <div className="flex flex-wrap gap-2 py-1 text-sm">{["maison", "appartement"].map((t) => (
              <label key={t} className="flex items-center gap-1 capitalize"><input type="checkbox" checked={c.typesBien.includes(t)} onChange={(e) => set({ typesBien: e.target.checked ? [...c.typesBien, t] : c.typesBien.filter((x) => x !== t) })} />{t}</label>
            ))}</div>
          </label>
          <Num label="Âge max du DPE (jours)" value={c.ageMaxDpeJours} onChange={(v) => set({ ageMaxDpeJours: v })} />
          <Num label="Score minimum (tournée)" value={c.scoreMin} onChange={(v) => set({ scoreMin: v })} />
          <label className="block"><span className="text-[11px] uppercase tracking-wide text-slate-400">Fréquence de synchro</span>
            <select className={inputCls} value={c.syncFrequence} onChange={(e) => set({ syncFrequence: e.target.value })}><option>quotidienne</option><option>2×/jour</option><option>hebdomadaire</option><option>manuelle</option></select>
          </label>
          <Num label="Seuil de notification (score)" value={c.seuilNotification} onChange={(v) => set({ seuilNotification: v })} />
        </div>
      </Section>

      {/* Communes */}
      <Section titre="Communes surveillées">
        <div className="space-y-2">
          {c.communes.map((cm, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <input className={`${inputCls} w-28`} placeholder="INSEE" value={cm.code} onChange={(e) => setCommune(i, { code: e.target.value })} />
              <input className={`${inputCls} flex-1 min-w-[140px]`} placeholder="Nom" value={cm.nom} onChange={(e) => setCommune(i, { nom: e.target.value })} />
              <input className={`${inputCls} w-28`} placeholder="CP" value={cm.codePostal} onChange={(e) => setCommune(i, { codePostal: e.target.value })} />
              <label className="flex items-center gap-1 text-xs text-slate-600"><input type="checkbox" checked={!!cm.prioritaire} onChange={(e) => setCommune(i, { prioritaire: e.target.checked })} /> prioritaire</label>
              <button onClick={() => delCommune(i)} className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50">✕</button>
            </div>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <button onClick={addCommune} className="rounded-lg border border-dashed border-copper px-3 py-1 text-xs font-bold text-copper">+ Ajouter une commune</button>
          <button onClick={() => set({ communes: CONFIG_PROSPECTION_DEFAUT.communes.map((cm) => ({ ...cm })) })} className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">↺ Charger ma zone (8 communes)</button>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">Le code INSEE (ex. Martigues = 13056) est la clé de recherche ADEME. « Prioritaire » ajoute le bonus de secteur au score.</p>
      </Section>

      {/* Coefficients de scoring */}
      <Section titre="Coefficients du score « potentiel vendeur »">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <Num label="Nouveau DPE" value={c.coefficients.nouveauDpe} onChange={(v) => setCoef("nouveauDpe", v)} />
          <Num label="DPE < 7 j" value={c.coefficients.dpeMoins7j} onChange={(v) => setCoef("dpeMoins7j", v)} />
          <Num label="DPE 8-30 j" value={c.coefficients.dpe8a30j} onChange={(v) => setCoef("dpe8a30j", v)} />
          <Num label="Maison individuelle" value={c.coefficients.maisonIndividuelle} onChange={(v) => setCoef("maisonIndividuelle", v)} />
          <Num label="Secteur prioritaire" value={c.coefficients.zonePrioritaire} onChange={(v) => setCoef("zonePrioritaire", v)} />
          <Num label="Mutation ancienne (max)" value={c.coefficients.mutationAncienneMax} onChange={(v) => setCoef("mutationAncienneMax", v)} />
          <Num label="Seuil ancienneté" value={c.coefficients.mutationAncienneSeuilAns} onChange={(v) => setCoef("mutationAncienneSeuilAns", v)} suffix="ans" />
          <Num label="DPE F/G" value={c.coefficients.dpeFouG} onChange={(v) => setCoef("dpeFouG", v)} />
          <Num label="Pénalité prospecté" value={c.coefficients.penaliteProspecteRecent} onChange={(v) => setCoef("penaliteProspecteRecent", v)} />
          <Num label="Fenêtre pénalité" value={c.coefficients.penaliteProspecteJours} onChange={(v) => setCoef("penaliteProspecteJours", v)} suffix="j" />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Num label="Seuil Très prioritaire" value={c.seuils.tresPrioritaire} onChange={(v) => setSeuil("tresPrioritaire", v)} />
          <Num label="Seuil Prioritaire" value={c.seuils.prioritaire} onChange={(v) => setSeuil("prioritaire", v)} />
          <Num label="Seuil À travailler" value={c.seuils.aTravailler} onChange={(v) => setSeuil("aTravailler", v)} />
        </div>
        <button onClick={onRescore} disabled={!!busy} className="mt-3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50">{busy === "rescore" ? "Recalcul…" : "↻ Recalculer tous les scores maintenant"}</button>
      </Section>

      {/* Tournées */}
      <Section titre="Paramètres de tournée">
        <div className="grid gap-3 sm:grid-cols-4">
          <Num label="Adresses max / tournée" value={c.tournee.maxAdresses} onChange={(v) => setTour("maxAdresses", v)} />
          <Num label="Durée disponible" value={c.tournee.dureeMinutes} onChange={(v) => setTour("dureeMinutes", v)} suffix="min" />
          <Num label="Temps par arrêt" value={c.tournee.minutesParArret} onChange={(v) => setTour("minutesParArret", v)} suffix="min" />
          <Num label="Vitesse moyenne" value={c.tournee.vitesseKmh} onChange={(v) => setTour("vitesseKmh", v)} suffix="km/h" />
        </div>
      </Section>

      {/* Secteurs des négociateurs */}
      <Section titre="Secteurs des négociateurs">
        <div className="space-y-3">
          {NEGOS.map((m) => {
            const s = c.secteurs[m.id] ?? { communes: [], zones: "", jours: [], maxAdresses: 0, dureeMinutes: 0 };
            return (
              <div key={m.id} className="rounded-xl border border-slate-200 p-3">
                <div className="mb-2 font-semibold text-navy">{m.nom}</div>
                <div className="mb-2 flex flex-wrap gap-2 text-xs">
                  {c.communes.map((cm) => (
                    <label key={cm.code} className="flex items-center gap-1"><input type="checkbox" checked={s.communes.includes(cm.code)} onChange={(e) => setSecteur(m.id, { communes: e.target.checked ? [...s.communes, cm.code] : s.communes.filter((x) => x !== cm.code) })} />{cm.nom || cm.code}</label>
                  ))}
                </div>
                <div className="mb-2 flex flex-wrap gap-2 text-xs">
                  {JOURS.map((j) => (
                    <label key={j} className="flex items-center gap-1 capitalize"><input type="checkbox" checked={s.jours.includes(j)} onChange={(e) => setSecteur(m.id, { jours: e.target.checked ? [...s.jours, j] : s.jours.filter((x) => x !== j) })} />{j}</label>
                  ))}
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <input className={inputCls} placeholder="Zones / quartiers" value={s.zones} onChange={(e) => setSecteur(m.id, { zones: e.target.value })} />
                  <Num label="Adresses max" value={s.maxAdresses} onChange={(v) => setSecteur(m.id, { maxAdresses: v })} />
                  <Num label="Durée dispo (min)" value={s.dureeMinutes} onChange={(v) => setSecteur(m.id, { dureeMinutes: v })} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-slate-400">L&apos;attribution est exclusive : chaque opportunité va à un seul négociateur (le moins chargé en cas de chevauchement).</p>
      </Section>

      {/* Relances */}
      <Section titre="Règles de relance">
        <div className="grid gap-3 sm:grid-cols-3">
          <Num label="Absent #1 → dans" value={c.relances.absent1Jours} onChange={(v) => setRel({ absent1Jours: v })} suffix="j" />
          <Num label="Absent #2 → dans" value={c.relances.absent2Jours} onChange={(v) => setRel({ absent2Jours: v })} suffix="j" />
          <Num label="« À relancer » → dans" value={c.relances.aRelancerJours} onChange={(v) => setRel({ aRelancerJours: v })} suffix="j" />
          <label className="block"><span className="text-[11px] uppercase tracking-wide text-slate-400">Absent #3</span>
            <select className={inputCls} value={c.relances.absent3Action} onChange={(e) => setRel({ absent3Action: e.target.value as "archiver" | "baisser_score" })}><option value="baisser_score">Baisser le score</option><option value="archiver">Archiver / exclure</option></select>
          </label>
          <Num label="Baisse de score (#3)" value={c.relances.absent3Points} onChange={(v) => setRel({ absent3Points: v })} />
        </div>
      </Section>

      {/* Barre d'enregistrement */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-end gap-3">
          <button onClick={() => void enregistrer()} disabled={saving} className="rounded-lg bg-copper px-6 py-2 text-sm font-bold text-white hover:brightness-110 disabled:opacity-50">{saving ? "Enregistrement…" : "Enregistrer les réglages"}</button>
        </div>
      </div>
    </div>
  );
}
