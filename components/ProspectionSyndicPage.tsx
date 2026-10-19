"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { chargerCopros, type Copro } from "@/lib/copros";
import { chargerSyndicProspect, sauverSyndicProspect, STATUTS_SYNDIC, type SyndicProspectMap } from "@/lib/syndicProspect";

const nf = new Intl.NumberFormat("fr-FR");
const COULEUR_STATUT: Record<string, string> = {
  "À contacter": "bg-slate-100 text-slate-600",
  "Courrier envoyé": "bg-amber-100 text-amber-700",
  "Contact établi": "bg-blue-100 text-blue-700",
  "RDV / AG visée": "bg-violet-100 text-violet-700",
  "Gagné": "bg-emerald-100 text-emerald-700",
  "Perdu": "bg-red-100 text-red-600",
  "Écarté": "bg-slate-200 text-slate-500",
};
const parseD = (s: string): number => {
  if (!s) return Infinity;
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/); if (iso) return new Date(`${iso[1]}-${iso[2]}-${iso[3]}T12:00`).getTime();
  const fr = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/); if (fr) return new Date(Number(fr[3]), Number(fr[2]) - 1, Number(fr[1]), 12).getTime();
  return Infinity;
};
const dateFr = (s: string) => { const t = parseD(s); return Number.isFinite(t) ? new Date(t).toLocaleDateString("fr-FR") : s || "—"; };
async function copier(t: string): Promise<boolean> { try { await navigator.clipboard.writeText(t); return true; } catch { return false; } }
function courrierSyndic(c: Copro): string {
  return [
    "Mesdames, Messieurs les membres du conseil syndical,",
    "",
    `Votre copropriété « ${c.nom} » (${c.adresse}) représente ${c.lotsTotal} lots.`,
    "CENTURY 21 Icaza Immobilier, agence implantée à Martigues, assure la gestion de copropriétés de proximité : syndic réactif, transparence des comptes, suivi des travaux et accompagnement du conseil syndical.",
    "",
    "Nous serions honorés de vous présenter une offre de gestion et de nous positionner lors de votre prochaine assemblée générale (mise en concurrence du syndic).",
    "N'hésitez pas à nous contacter pour un rendez-vous sans engagement.",
    "",
    "CENTURY 21 Icaza Immobilier — 32 avenue de la Paix, 13500 Martigues",
  ].join("\n");
}

function CarteSyndic({ c, suivi, onSave }: { c: Copro; suivi: { statut: string; notes: string }; onSave: (statut: string, notes: string) => void }) {
  const [statut, setStatut] = useState(suivi.statut);
  const [notes, setNotes] = useState(suivi.notes);
  const [demarch, setDemarch] = useState(false);
  const [copie, setCopie] = useState("");
  const timer = useRef<number | null>(null);
  useEffect(() => { setStatut(suivi.statut); setNotes(suivi.notes); }, [suivi.statut, suivi.notes]);
  const changerStatut = (v: string) => { setStatut(v); onSave(v, notes); };
  const changerNotes = (v: string) => { setNotes(v); if (timer.current) window.clearTimeout(timer.current); timer.current = window.setTimeout(() => onSave(statut, v), 700); };
  const faireCopie = async (cle: string, t: string) => { if (await copier(t)) { setCopie(cle); setTimeout(() => setCopie(""), 2000); } };
  const adressePostale = `Conseil syndical – Copropriété ${c.nom}\n${c.adresse}`;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-navy">{c.nom}</h3>
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-bold text-violet-700">🎯 {c.motifSyndic}</span>
          </div>
          <div className="text-sm text-slate-500">{c.adresse}</div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[12px] text-slate-600">
            <span><strong className="text-navy">{nf.format(c.lotsTotal)}</strong> lots</span>
            <span>· Syndic {c.typeSyndic || "—"}{c.syndic ? ` · ${c.syndic}` : ""}</span>
            {c.dateFinMandat && <span>· fin de mandat {dateFr(c.dateFinMandat)}</span>}
          </div>
        </div>
        <select value={statut} onChange={(e) => changerStatut(e.target.value)} className={`rounded-lg border-0 px-2 py-1 text-xs font-bold ${COULEUR_STATUT[statut] ?? "bg-slate-100 text-slate-600"}`}>
          {STATUTS_SYNDIC.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <textarea value={notes} onChange={(e) => changerNotes(e.target.value)} rows={2} placeholder="Notes (interlocuteur, date d'AG, retour…)" className="mt-2 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-copper focus:outline-none" />

      <div className="mt-1">
        <button onClick={() => setDemarch((d) => !d)} className="text-xs font-semibold text-violet-700 hover:underline">{demarch ? "Masquer le démarchage ▾" : "✉️ Démarcher le conseil syndical ▸"}</button>
        {demarch && (
          <div className="mt-2 rounded-xl border border-violet-200 bg-violet-50/50 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-violet-700">Adresse postale</div>
            <pre className="mt-1 whitespace-pre-wrap font-sans text-[13px] text-navy">{adressePostale}</pre>
            <button onClick={() => void faireCopie("adr", adressePostale)} className="mt-1 rounded-lg border border-violet-300 bg-white px-3 py-1 text-xs font-bold text-violet-700 hover:bg-violet-100">{copie === "adr" ? "✓ Copiée" : "📋 Copier l'adresse"}</button>
            <div className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-violet-700">Courrier type</div>
            <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-2 font-sans text-[12px] leading-relaxed text-slate-700">{courrierSyndic(c)}</pre>
            <button onClick={() => void faireCopie("lettre", courrierSyndic(c))} className="mt-1 rounded-lg border border-violet-300 bg-white px-3 py-1 text-xs font-bold text-violet-700 hover:bg-violet-100">{copie === "lettre" ? "✓ Copié" : "📋 Copier le courrier"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProspectionSyndicPage({ onRetour }: { onRetour: () => void }) {
  const [copros, setCopros] = useState<Copro[] | null>(null);
  const [prospect, setProspect] = useState<SyndicProspectMap>({});
  const [erreur, setErreur] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [motif, setMotif] = useState("");
  const [statutF, setStatutF] = useState("");
  const [limite, setLimite] = useState(30);

  useEffect(() => {
    let a = false;
    void (async () => {
      const [ds, pr] = await Promise.all([chargerCopros(), chargerSyndicProspect()]);
      if (a) return;
      if (!ds) setErreur("Chargement impossible — ouvre d'abord « Copropriétés » et lance une mise à jour.");
      setCopros(ds?.copros ?? []); setProspect(pr);
    })();
    return () => { a = true; };
  }, []);

  const enregistrer = async (coproId: string, statut: string, notes: string) => {
    setProspect((p) => ({ ...p, [coproId]: { statut, notes, updatedAt: Date.now() } }));
    const maj = await sauverSyndicProspect(coproId, statut, notes);
    if (maj) setProspect(maj);
  };

  const cibles = useMemo(() => (copros ?? []).filter((c) => c.cibleSyndic), [copros]);
  const motifs = useMemo(() => [...new Set(cibles.map((c) => c.motifSyndic))].sort(), [cibles]);
  const suiviDe = (c: Copro) => prospect[c.id] ?? { statut: "À contacter", notes: "" };

  const filtrees = useMemo(() => {
    const s = q.trim().toLowerCase();
    return cibles.filter((c) => {
      if (motif && c.motifSyndic !== motif) return false;
      if (statutF && suiviDe(c).statut !== statutF) return false;
      if (s && !`${c.nom} ${c.adresse} ${c.syndic}`.toLowerCase().includes(s)) return false;
      return true;
    }).sort((a, b) => parseD(a.dateFinMandat) - parseD(b.dateFinMandat) || b.lotsTotal - a.lotsTotal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cibles, prospect, q, motif, statutF]);

  const parStatut = (st: string) => cibles.filter((c) => suiviDe(c).statut === st).length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Accueil</button>
        <h2 className="text-2xl font-bold text-navy">🤝 Prospection syndic</h2>
      </div>
      <p className="mb-4 text-sm text-slate-500">Les copropriétés de Martigues (&gt; 10 lots) à travailler pour décrocher le <strong>mandat de syndic</strong> : syndic bénévole/coopératif, fin de mandat proche, sans mandat. Suivi de prospection partagé (statut + notes) et démarchage du conseil syndical prêt à l'emploi.</p>

      {erreur && <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{erreur}</div>}

      {copros === null ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400">Chargement…</div>
      ) : (
        <>
          <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {[["Cibles", cibles.length], ["À contacter", parStatut("À contacter")], ["Courrier envoyé", parStatut("Courrier envoyé")], ["Contact", parStatut("Contact établi")], ["RDV / AG", parStatut("RDV / AG visée")], ["Gagnés", parStatut("Gagné")]].map(([l, v]) => (
              <div key={l} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center"><div className="text-lg font-bold text-navy">{nf.format(v as number)}</div><div className="text-[10px] text-slate-500">{l}</div></div>
            ))}
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Rechercher (nom, adresse, syndic…)" className="min-w-[180px] flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-copper focus:outline-none" />
            <select value={motif} onChange={(e) => setMotif(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-semibold text-navy focus:border-copper focus:outline-none">
              <option value="">Tous les motifs</option>
              {motifs.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={statutF} onChange={(e) => setStatutF(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-semibold text-navy focus:border-copper focus:outline-none">
              <option value="">Tous les statuts</option>
              {STATUTS_SYNDIC.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="text-xs text-slate-400">{filtrees.length} résultat(s)</span>
          </div>

          {filtrees.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">Aucune cible syndic pour ces critères.</div>
          ) : (
            <div className="space-y-2.5">
              {filtrees.slice(0, limite).map((c) => <CarteSyndic key={c.id} c={c} suivi={suiviDe(c)} onSave={(st, no) => void enregistrer(c.id, st, no)} />)}
            </div>
          )}
          {filtrees.length > limite && (
            <button onClick={() => setLimite((n) => n + 30)} className="mt-3 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50">Afficher plus ({filtrees.length - limite} restante(s))</button>
          )}
          <p className="mt-3 text-[11px] text-slate-400">Les noms des membres du conseil syndical ne sont pas publics (RGPD) : le démarchage se fait par courrier au « Conseil syndical » à l&apos;adresse de l&apos;immeuble, ou à l&apos;AG via un copropriétaire. Données copros : mises à jour dans « Copropriétés ».</p>
        </>
      )}
    </div>
  );
}
