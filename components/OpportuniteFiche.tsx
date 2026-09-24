"use client";

import { useEffect, useState } from "react";
import { NEGOCIATEURS } from "@/lib/equipe";
import { enregistrerResultat, getOpportunite, lienNavigation, updateOpportunite } from "@/lib/prospection";
import {
  dpeCls, LABELS_ADEME, lienDpeOfficiel, NIVEAUX_PROSPECTION, RESULTATS_PASSAGE,
  STATUTS_PROSPECTION, STATUT_PROSPECTION_COULEURS, int,
  type Opportunite,
} from "@/lib/prospectionTypes";

const inputCls = "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/20";
const eur = (n: number | null | undefined) => (n != null && n > 0 ? `${int.format(n)} €` : "—");
const dateFr = (t: number | null | undefined) => (t ? new Date(t).toLocaleDateString("fr-FR") : "—");
const dateIsoFr = (s: string) => (s ? new Date(s).toLocaleDateString("fr-FR") : "—");

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-bold text-navy">{titre}</h3>
      {children}
    </div>
  );
}
function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><div className="text-[11px] uppercase tracking-wide text-slate-400">{label}</div><div className="text-sm font-medium text-slate-800">{children}</div></div>;
}

// Mise en forme d'une valeur ADEME (date / nombre / texte).
function fmtAdeme(cle: string, v: string | number | null): string {
  if (v == null || v === "") return "—";
  if (cle.startsWith("date_")) return dateIsoFr(String(v));
  if (typeof v === "number") return cle.includes("cout") ? `${int.format(Math.round(v))} €` : int.format(v);
  const s = String(v);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const CONFIANCE_LABEL: Record<string, { txt: string; cls: string }> = {
  haute: { txt: "Rapprochement fiable", cls: "bg-emerald-100 text-emerald-700" },
  moyenne: { txt: "Rapprochement moyen", cls: "bg-amber-100 text-amber-700" },
  faible: { txt: "Rapprochement à vérifier", cls: "bg-red-100 text-red-600" },
  aucune: { txt: "Non rapproché", cls: "bg-slate-100 text-slate-500" },
};

export default function OpportuniteFiche({
  opp, onRetour, onSaved, onSupprime,
}: {
  opp: Opportunite; onRetour: () => void;
  onSaved: (o: Opportunite) => void; onSupprime: () => void;
}) {
  const [o, setO] = useState<Opportunite>(opp);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const niveau = NIVEAUX_PROSPECTION[o.niveau];

  // Enrichissement DVF paresseux : à la 1re ouverture, on recharge la fiche via
  // l'API qui va chercher la dernière mutation DVF puis re-scorer (best-effort).
  useEffect(() => {
    if (opp.enrichiLe) return;
    let annule = false;
    (async () => {
      const enrichie = await getOpportunite(opp.id);
      if (!annule && enrichie) { setO(enrichie); onSaved(enrichie); }
    })();
    return () => { annule = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opp.id]);

  const patch = async (p: Partial<Opportunite>, flash?: string) => {
    setBusy(true);
    const maj = await updateOpportunite(o.id, p);
    setBusy(false);
    if (maj) { setO(maj); onSaved(maj); if (flash) { setMsg(flash); setTimeout(() => setMsg(null), 2500); } }
    else { setMsg("Enregistrement impossible"); }
  };

  const resultat = async (statut: string) => {
    setBusy(true); setMsg(null);
    const maj = await enregistrerResultat({ opportuniteId: o.id, resultat: statut, note: note.trim() || undefined, negociateur: o.negociateur || undefined });
    setBusy(false);
    if (maj) { setO(maj); onSaved(maj); setNote(""); setMsg(`Résultat enregistré : ${statut}`); setTimeout(() => setMsg(null), 2500); }
    else setMsg("Enregistrement impossible");
  };

  const conf = CONFIANCE_LABEL[o.confiance] ?? CONFIANCE_LABEL.moyenne;

  return (
    <div className="space-y-3 pb-16">
      {/* En-tête */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button onClick={onRetour} className="mb-2 rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">← Toutes les opportunités</button>
          <h2 className="text-xl font-bold text-navy">{o.adresse || "Bien détecté"}</h2>
          <p className="text-sm text-slate-500">{[o.ville, o.codePostal].filter(Boolean).join(" ")}</p>
        </div>
        <div className="flex items-center gap-2">
          <a href={lienNavigation(o)} target="_blank" rel="noreferrer" className="rounded-lg bg-navy px-3 py-1.5 text-sm font-bold text-white hover:bg-navy-deep">🧭 Navigation</a>
          <button onClick={() => { if (confirm("Supprimer cette opportunité ?")) onSupprime(); }} className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">🗑</button>
        </div>
      </div>
      {msg && <div className="rounded-xl border border-copper/30 bg-copper/5 p-2 text-sm font-semibold text-copper">{msg}</div>}

      {/* Score + explication */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">Potentiel vendeur</div>
            <div className="text-3xl font-bold text-navy">{o.score}<span className="text-lg text-slate-400">/100</span></div>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-bold ${niveau.badge}`}>{niveau.label}</span>
        </div>
        <div className="mt-3 space-y-1">
          {o.scoreDetail.length === 0 ? <p className="text-xs text-slate-400">Score non détaillé.</p> : o.scoreDetail.map((d) => (
            <div key={d.cle} className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{d.label}</span>
              <span className={`font-bold ${d.points >= 0 ? "text-emerald-600" : "text-red-500"}`}>{d.points >= 0 ? "+" : ""}{d.points}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-slate-400">Un DPE récent est un <b>signal</b> de projet possible, jamais une preuve de mise en vente.</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {/* Bien */}
        <Bloc titre="🏠 Le bien">
          <div className="grid grid-cols-2 gap-3">
            <Info label="Type"><span className="capitalize">{o.typeBien || "—"}</span></Info>
            <Info label="Surface">{o.surface ? `${o.surface} m²` : "—"}</Info>
            <Info label="Construction">{o.periodeConstruction || "—"}</Info>
            <Info label="DPE"><span className={`rounded px-1.5 py-0.5 text-xs font-bold ${dpeCls(o.dpe)}`}>{o.dpe || "—"}</span> <span className="ml-1 text-xs text-slate-400">GES {o.ges || "—"}</span></Info>
            <Info label="Détecté le">{dateFr(o.detecteLe)}</Info>
            <Info label="Localisation">{o.lat != null ? `${o.lat.toFixed(5)}, ${o.lon?.toFixed(5)}` : "Non géolocalisé"}</Info>
          </div>
        </Bloc>

        {/* Historique DVF */}
        <Bloc titre="📜 Historique DVF (dernière mutation)">
          {o.dvfDerniereMutationDate ? (
            <div className="grid grid-cols-2 gap-3">
              <Info label="Dernière vente">{dateIsoFr(o.dvfDerniereMutationDate)}</Info>
              <Info label="Prix">{eur(o.dvfDerniereMutationPrix)}</Info>
              <Info label="Nature">{o.dvfNature || "—"}</Info>
              <Info label="Surface DVF">{o.dvfSurface ? `${o.dvfSurface} m²` : "—"}</Info>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Aucune mutation DVF rapprochée. {o.enrichiLe ? "" : "Enrichissement non encore effectué."}</p>
          )}
          <p className="mt-2 text-[11px] text-slate-400">Une absence de mutation DVF n&apos;indique pas avec certitude le propriétaire actuel.</p>
        </Bloc>

        {/* Sources & fiabilité */}
        <Bloc titre="🔗 Sources & fiabilité">
          <div className="grid grid-cols-2 gap-3">
            <Info label="Source du signal">{o.source || "—"}</Info>
            <Info label="N° DPE">{o.dpeNumero || "—"}</Info>
            <Info label="DPE réalisé le">{dateIsoFr(o.dpeDateEtablissement)}</Info>
            <Info label="DPE publié le">{dateIsoFr(o.dpeDateReception)}</Info>
            <Info label="Dernière synchro">{dateFr(o.syncLe)}</Info>
            <Info label="Signaux reçus">{o.signaux.length}</Info>
          </div>
          <div className="mt-2"><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${conf.cls}`}>{conf.txt}</span> <span className="text-[11px] text-slate-400">{o.confianceMotif}</span></div>
        </Bloc>

        {/* Prospection */}
        <Bloc titre="🚶 Prospection">
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="text-[11px] uppercase tracking-wide text-slate-400">Négociateur</span>
              <select className={inputCls} value={o.negociateur} onChange={(e) => void patch({ negociateur: e.target.value }, "Attribué")}><option value="">Non attribué</option>{NEGOCIATEURS.map((n) => <option key={n} value={n}>{n}</option>)}</select>
            </label>
            <label className="block"><span className="text-[11px] uppercase tracking-wide text-slate-400">Statut</span>
              <select className={inputCls} value={o.statut} onChange={(e) => void patch({ statut: e.target.value }, "Statut mis à jour")}>{STATUTS_PROSPECTION.map((s) => <option key={s} value={s}>{s}</option>)}</select>
            </label>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className={`rounded-full px-2 py-0.5 font-semibold ${STATUT_PROSPECTION_COULEURS[o.statut] ?? "bg-slate-100"}`}>{o.statut}</span>
            {o.nbAbsences > 0 && <span>· {o.nbAbsences} absence(s)</span>}
            {o.prochaineRelance && <span>· relance le {dateFr(o.prochaineRelance)}</span>}
            {o.derniereAction && <span>· dernier passage {dateFr(o.derniereAction)}</span>}
          </div>

          {/* Résultat rapide */}
          <div className="mt-3 border-t border-slate-100 pt-3">
            <div className="mb-1 text-[11px] uppercase tracking-wide text-slate-400">Enregistrer un résultat de passage</div>
            <div className="flex flex-wrap gap-1.5">
              {RESULTATS_PASSAGE.map((r) => (
                <button key={r.statut} disabled={busy} onClick={() => void resultat(r.statut)} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-navy hover:text-white disabled:opacity-50">{r.label}</button>
              ))}
            </div>
            <input className={`${inputCls} mt-2`} placeholder="Note (facultatif)" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </Bloc>
      </div>

      {/* Conversion CRM */}
      <Bloc titre="🔁 Conversion (prospect → estimation → mandat → vente)">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => void patch({ statut: "Projet identifié" }, "Marqué : projet identifié")} className="rounded-lg bg-violet-100 px-3 py-1.5 text-sm font-semibold text-violet-700 hover:bg-violet-200">Projet vendeur identifié</button>
          <button onClick={() => void patch({ statut: "RDV estimation" }, "Marqué : RDV estimation")} className="rounded-lg bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-200">RDV estimation pris</button>
          <button onClick={() => void patch({ statut: "Mandat obtenu", mandat: true }, "Mandat obtenu 🎉")} className="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-700 hover:bg-green-200">Mandat obtenu</button>
          <button onClick={() => void patch({ vente: true }, "Vente enregistrée 🎉")} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${o.vente ? "bg-teal-200 text-teal-800" : "bg-teal-100 text-teal-700 hover:bg-teal-200"}`}>{o.vente ? "✓ Vendu" : "Marquer vendu"}</button>
          <button onClick={() => void patch({ statut: "Déjà client" }, "Marqué : déjà client")} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-200">Déjà client / suivi</button>
          <button onClick={() => void patch({ exclu: !o.exclu, exclusMotif: o.exclu ? "" : "Exclu manuellement", statut: o.exclu ? o.statut : "À exclure" }, o.exclu ? "Réintégré" : "Exclu de la prospection")} className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100">{o.exclu ? "Réintégrer" : "Exclure (refus)"}</button>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <label className="block"><span className="text-[11px] uppercase tracking-wide text-slate-400">Dossier client lié (id)</span><input className={inputCls} value={o.dossierId} onChange={(e) => setO({ ...o, dossierId: e.target.value })} onBlur={() => void patch({ dossierId: o.dossierId })} placeholder="id du dossier CRM" /></label>
          <label className="block"><span className="text-[11px] uppercase tracking-wide text-slate-400">Estimation liée (id)</span><input className={inputCls} value={o.estimationId} onChange={(e) => setO({ ...o, estimationId: e.target.value })} onBlur={() => void patch({ estimationId: o.estimationId })} placeholder="id de l'estimation" /></label>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">Ces liens permettent de mesurer la conversion réelle (opportunité → mandat → vente) dans le dashboard.</p>
      </Bloc>

      {/* Données ADEME complètes */}
      <Bloc titre="📋 Données DPE (ADEME)">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {o.dpeNumero && <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">N° DPE {o.dpeNumero}</span>}
          {o.dpeNumero && <a href={lienDpeOfficiel(o.dpeNumero)} target="_blank" rel="noreferrer" className="rounded-lg bg-navy px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-deep">Voir le DPE officiel ↗</a>}
        </div>
        {Object.keys(o.ademe ?? {}).length === 0 ? (
          <p className="text-sm text-slate-400">Détails ADEME non disponibles pour ce bien (resynchronisez pour les récupérer).</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 lg:grid-cols-3">
            {Object.entries(o.ademe).map(([cle, val]) => (
              <div key={cle}>
                <div className="text-[11px] uppercase tracking-wide text-slate-400">{LABELS_ADEME[cle] ?? cle}</div>
                <div className="text-sm font-medium text-slate-800">{fmtAdeme(cle, val)}</div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-3 text-[11px] text-slate-400">Source : ADEME — Observatoire DPE. Ces données publiques décrivent le logement, jamais son occupant.</p>
      </Bloc>

      {/* Passages */}
      {o.passages.length > 0 && (
        <Bloc titre={`🕒 Historique des passages (${o.passages.length})`}>
          <ul className="space-y-2">
            {o.passages.map((p) => (
              <li key={p.id} className="flex gap-2 text-sm">
                <span className={`mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold ${STATUT_PROSPECTION_COULEURS[p.resultat] ?? "bg-slate-100 text-slate-600"}`}>{p.resultat}</span>
                <div><div className="text-slate-700">{p.note || "—"}</div><div className="text-xs text-slate-400">{dateFr(p.date)}{p.negociateur ? ` · ${p.negociateur}` : ""}{p.relanceLe ? ` · relance ${dateFr(p.relanceLe)}` : ""}</div></div>
              </li>
            ))}
          </ul>
        </Bloc>
      )}
    </div>
  );
}
