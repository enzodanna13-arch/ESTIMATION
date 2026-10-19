"use client";

import { useEffect, useMemo, useState } from "react";
import { chargerNosCopros, rafraichirNosCopros, type NosCopro, type NosCoprosDataset } from "@/lib/nosCopros";
import { badgeDpe, DiagInfos } from "@/components/CoproprietesPage";

const nf = new Intl.NumberFormat("fr-FR");
const dateFr = (s: string) => { if (!s) return "—"; try { return new Date(s + "T12:00:00").toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }); } catch { return s; } };

function CarteNosCopro({ c }: { c: NosCopro }) {
  const [ouvert, setOuvert] = useState(false);
  const dpe = c.dernierDpe;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-navy">{c.nom}</h3>
            {dpe && <span className={`rounded-md px-2 py-0.5 text-xs font-black ${badgeDpe(dpe.etiquetteDpe)}`}>{dpe.etiquetteDpe || "?"}</span>}
            {c.dpeCount > 0 && <span className="rounded-full bg-copper/10 px-2 py-0.5 text-[11px] font-bold text-copper">{c.dpeCount} DPE récent(s)</span>}
            {c.dpeCountPrecis > 0 && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">📍 {c.dpeCountPrecis} localisé(s)</span>}
          </div>
          <div className="text-sm text-slate-500">{c.adresse}{c.commune ? ` · ${c.commune}` : ""}</div>
          {dpe && (dpe.etage !== "" || dpe.residence) && (
            <div className="mt-1 text-[13px] font-semibold text-copper">📍 Dernier diag : {dpe.etage !== "" ? `Étage ${dpe.etage === "0" ? "RDC" : dpe.etage}` : dpe.residence}{dpe.surface ? ` · ${dpe.surface} m²` : ""} · {dateFr(dpe.date)}</div>
          )}
        </div>
        <div className="text-right">
          {dpe ? <div className="text-[11px] text-slate-400">dernier diag<br /><strong className="text-slate-600">{dateFr(dpe.date)}</strong></div> : <span className="text-[11px] text-slate-300">aucun DPE récent</span>}
        </div>
      </div>
      {c.dpeCount > 0 && (
        <button onClick={() => setOuvert((o) => !o)} className="mt-2 text-xs font-semibold text-copper hover:underline">{ouvert ? "Masquer les diagnostics ▾" : `Voir les diagnostics (${c.dpeCount}) ▸`}</button>
      )}
      {ouvert && dpe && (
        <div>
          <DiagInfos d={dpe} />
          {c.dpes.length > 1 && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs font-semibold text-slate-500">Autres diagnostics ({c.dpes.length - 1})</summary>
              <div className="mt-2 space-y-2">{c.dpes.slice(1).map((d) => <DiagInfos key={d.numeroDpe} d={d} />)}</div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

export default function NosCoprosPage({ onRetour }: { onRetour: () => void }) {
  const [ds, setDs] = useState<NosCoprosDataset | null>(null);
  const [chargement, setChargement] = useState(true);
  const [maj, setMaj] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [avecDpe, setAvecDpe] = useState(true);
  const [limite, setLimite] = useState(30);

  // Fenêtre glissante : on met en avant les diags de 3 mois max (signaux chauds),
  // mais on garde l'historique récent consultable.
  const cutoff = useMemo(() => { const d = new Date(); d.setMonth(d.getMonth() - 3); return d.toISOString().slice(0, 10); }, []);

  useEffect(() => { let a = false; void (async () => { const d = await chargerNosCopros(); if (!a) { if (!d) setErreur("Chargement impossible — réessaie la mise à jour."); setDs(d); setChargement(false); } })(); return () => { a = true; }; }, []);

  const mettreAJour = async () => { setMaj(true); setErreur(null); const d = await rafraichirNosCopros(); setMaj(false); if (d) setDs(d); else setErreur("Mise à jour impossible (source indisponible). Réessaie dans un instant."); };

  const filtrees = useMemo(() => {
    if (!ds) return [] as NosCopro[];
    const s = q.trim().toLowerCase();
    return ds.copros.filter((c) => {
      if (avecDpe && !(c.dernierDpe && c.dernierDpe.date >= cutoff)) return false;
      if (s && !`${c.nom} ${c.adresse}`.toLowerCase().includes(s)) return false;
      return true;
    });
  }, [ds, q, avecDpe, cutoff]);

  const nbRecent = ds ? ds.copros.filter((c) => c.dernierDpe && c.dernierDpe.date >= cutoff).length : 0;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Accueil</button>
        <h2 className="text-2xl font-bold text-navy">🏢 Nos copros — DPE</h2>
        <button onClick={() => void mettreAJour()} disabled={maj} className="ml-auto rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{maj ? "Mise à jour…" : "↻ Mettre à jour"}</button>
      </div>
      <p className="mb-4 text-sm text-slate-500">Les copropriétés que <strong>nous gérons en syndic</strong>, croisées avec les DPE récents. Un diagnostic dans un de nos immeubles = un propriétaire qui prépare souvent une vente : repère l&apos;<strong>étage / l&apos;appartement</strong>, retrouve le propriétaire dans ton logiciel de syndic et <strong>appelle-le directement</strong> pour lui proposer la vente.</p>

      {erreur && <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{erreur}</div>}

      {chargement ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400">Chargement…</div>
      ) : !ds || ds.nbResidences === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">Aucune résidence gérée trouvée. Ajoute tes copropriétés dans le module Syndic (résidences), puis clique « ↻ Mettre à jour ».</div>
      ) : (
        <>
          <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {[["Nos copros", nf.format(ds.nbResidences)], ["Diag < 3 mois", nf.format(nbRecent)], ["DPE indexés", nf.format(ds.nbDpeIndexes)], ["Mis à jour", dateFr(new Date(ds.updatedAt).toISOString().slice(0, 10))]].map(([l, v]) => (
              <div key={l} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center"><div className="text-lg font-bold text-navy">{v}</div><div className="text-[10px] text-slate-500">{l}</div></div>
            ))}
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Rechercher (résidence, adresse…)" className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-copper focus:outline-none" />
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600"><input type="checkbox" checked={avecDpe} onChange={(e) => setAvecDpe(e.target.checked)} /> Diag récent uniquement (&lt; 3 mois)</label>
            <span className="text-xs text-slate-400">{filtrees.length} résultat(s)</span>
          </div>

          {filtrees.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">Aucune de nos copros n&apos;a de diagnostic récent pour ces critères.</div>
          ) : (
            <div className="space-y-2.5">{filtrees.slice(0, limite).map((c) => <CarteNosCopro key={c.id} c={c} />)}</div>
          )}
          {filtrees.length > limite && (
            <button onClick={() => setLimite((n) => n + 30)} className="mt-3 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50">Afficher plus ({filtrees.length - limite} restante(s))</button>
          )}
        </>
      )}
    </div>
  );
}
