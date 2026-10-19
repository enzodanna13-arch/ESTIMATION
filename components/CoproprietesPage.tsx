"use client";

import { useEffect, useMemo, useState } from "react";
import { chargerCopros, rafraichirCopros, type Copro, type DpeCopro, type CoproDataset } from "@/lib/copros";
import { LABELS_ADEME } from "@/lib/prospectionTypes";

const COULEUR_DPE: Record<string, string> = {
  A: "bg-emerald-500 text-white", B: "bg-green-500 text-white", C: "bg-lime-500 text-white",
  D: "bg-yellow-400 text-navy", E: "bg-orange-400 text-white", F: "bg-orange-600 text-white", G: "bg-red-600 text-white",
};
const badgeDpe = (c: string) => COULEUR_DPE[c] ?? "bg-slate-200 text-slate-600";
const dateFr = (s: string) => { if (!s) return "—"; try { return new Date(s + "T12:00:00").toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }); } catch { return s; } };
const nf = new Intl.NumberFormat("fr-FR");
const CLASSES = ["A", "B", "C", "D", "E", "F", "G"];

async function copier(t: string): Promise<boolean> { try { await navigator.clipboard.writeText(t); return true; } catch { return false; } }
// Courrier type de démarchage syndic (adressé au conseil syndical, à l'adresse de l'immeuble).
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
// Ordre d'affichage des infos du diag.
const ORDRE_DETAILS = [
  "annee_construction", "conso_5_usages_par_m2_ep", "conso_5_usages_par_m2_ef", "emission_ges_5_usages_par_m2", "cout_total_5_usages",
  "type_energie_principale_chauffage", "type_generateur_chauffage_principal", "type_installation_chauffage",
  "type_energie_principale_ecs", "type_generateur_chauffage_principal_ecs", "type_ventilation",
  "qualite_isolation_murs", "qualite_isolation_menuiseries", "qualite_isolation_plancher_bas",
  "hauteur_sous_plafond", "nombre_niveau_logement", "classe_inertie_batiment",
  "date_fin_validite_dpe", "version_dpe", "modele_dpe",
];

function DiagInfos({ d }: { d: DpeCopro }) {
  const entrees = ORDRE_DETAILS.filter((k) => d.details[k] !== undefined && d.details[k] !== null && d.details[k] !== "");
  const autres = Object.keys(d.details).filter((k) => !ORDRE_DETAILS.includes(k) && d.details[k] !== "" && d.details[k] != null);
  const tout = [...entrees, ...autres];
  return (
    <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
      <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs">
        <span className={`rounded-md px-2 py-1 text-sm font-black ${badgeDpe(d.etiquetteDpe)}`}>DPE {d.etiquetteDpe || "?"}</span>
        <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${badgeDpe(d.etiquetteGes)}`}>GES {d.etiquetteGes || "?"}</span>
        <span className="text-slate-500">{d.typeBien}{d.surface ? ` · ${d.surface} m²` : ""} · établi le {dateFr(d.date)}</span>
        {d.numeroDpe && <span className="text-[10px] text-slate-400">N° {d.numeroDpe}</span>}
      </div>
      {(d.etage !== "" || d.residence) && (
        <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[12px]">
          <span className="rounded-full bg-copper/15 px-2 py-0.5 font-bold text-copper">📍 Localisé</span>
          {d.etage !== "" && <span className="font-semibold text-navy">Étage {d.etage === "0" ? "RDC" : d.etage}</span>}
          {d.residence && <span className="text-slate-600">· {d.residence}</span>}
        </div>
      )}
      <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
        {tout.map((k) => (
          <div key={k} className="flex justify-between gap-2 border-b border-slate-100 py-0.5 text-[12px] last:border-0">
            <span className="text-slate-500">{LABELS_ADEME[k] ?? k}</span>
            <span className="text-right font-medium text-navy">{String(d.details[k])}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CarteCopro({ c }: { c: Copro }) {
  const [ouvert, setOuvert] = useState(false);
  const [demarch, setDemarch] = useState(false);
  const [copie, setCopie] = useState("");
  const dpe = c.dernierDpe;
  const faireCopie = async (cle: string, t: string) => { if (await copier(t)) { setCopie(cle); setTimeout(() => setCopie(""), 2000); } };
  const adressePostale = `Conseil syndical – Copropriété ${c.nom}\n${c.adresse}`;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-navy">{c.nom}</h3>
            {dpe && <span className={`rounded-md px-2 py-0.5 text-xs font-black ${badgeDpe(dpe.etiquetteDpe)}`}>{dpe.etiquetteDpe || "?"}</span>}
            {c.dpeCount > 0 && <span className="rounded-full bg-copper/10 px-2 py-0.5 text-[11px] font-bold text-copper">{c.dpeCount} DPE croisé(s)</span>}
            {c.dpeCountPrecis > 0 && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">📍 {c.dpeCountPrecis} localisé(s)</span>}
            {c.cibleSyndic && <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-bold text-violet-700" title="Opportunité de prospection syndic">🎯 Cible syndic — {c.motifSyndic}</span>}
          </div>
          <div className="text-sm text-slate-500">{c.adresse}</div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[12px] text-slate-600">
            <span><strong className="text-navy">{nf.format(c.lotsTotal)}</strong> lots{c.lotsHabitation ? ` · ${nf.format(c.lotsHabitation)} habitation` : ""}</span>
            {c.periodeConstruction && <span>· {c.periodeConstruction}</span>}
            {c.syndic ? <span>· Syndic : {c.syndic}{c.typeSyndic ? ` (${c.typeSyndic})` : ""}</span> : c.typeSyndic && <span>· Syndic {c.typeSyndic}</span>}
            {c.dateFinMandat && <span>· fin de mandat {dateFr(c.dateFinMandat)}</span>}
          </div>
        </div>
        <div className="text-right">
          {dpe ? (
            <div className="text-[11px] text-slate-400">dernier diag<br /><strong className="text-slate-600">{dateFr(dpe.date)}</strong>{(dpe.etage !== "" || dpe.residence) && <><br /><span className="font-semibold text-copper">📍 {dpe.etage !== "" ? `Étage ${dpe.etage === "0" ? "RDC" : dpe.etage}` : dpe.residence}</span></>}</div>
          ) : <span className="text-[11px] text-slate-300">aucun DPE croisé</span>}
        </div>
      </div>
      {dpe && (
        <button onClick={() => setOuvert((o) => !o)} className="mt-2 text-xs font-semibold text-copper hover:underline">{ouvert ? "Masquer les diagnostics ▾" : `Voir les diagnostics (${c.dpeCount}) ▸`}</button>
      )}
      {ouvert && dpe && (
        <div>
          <DiagInfos d={dpe} />
          {c.dpes.length > 1 && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs font-semibold text-slate-500">Autres diagnostics du bâtiment ({c.dpes.length - 1})</summary>
              <div className="mt-2 space-y-2">{c.dpes.slice(1).map((d) => <DiagInfos key={d.numeroDpe} d={d} />)}</div>
            </details>
          )}
        </div>
      )}

      {/* Démarchage syndic : courrier au conseil syndical (à l'adresse de l'immeuble) */}
      <div className="mt-2 border-t border-slate-100 pt-2">
        <button onClick={() => setDemarch((d) => !d)} className="text-xs font-semibold text-violet-700 hover:underline">{demarch ? "Masquer le démarchage syndic ▾" : "✉️ Démarcher le conseil syndical (syndic) ▸"}</button>
        {demarch && (
          <div className="mt-2 rounded-xl border border-violet-200 bg-violet-50/50 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-violet-700">Adresse postale</div>
            <pre className="mt-1 whitespace-pre-wrap font-sans text-[13px] text-navy">{adressePostale}</pre>
            <button onClick={() => void faireCopie("adr", adressePostale)} className="mt-1 rounded-lg border border-violet-300 bg-white px-3 py-1 text-xs font-bold text-violet-700 hover:bg-violet-100">{copie === "adr" ? "✓ Copiée" : "📋 Copier l'adresse"}</button>
            <div className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-violet-700">Courrier type</div>
            <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-2 font-sans text-[12px] leading-relaxed text-slate-700">{courrierSyndic(c)}</pre>
            <button onClick={() => void faireCopie("lettre", courrierSyndic(c))} className="mt-1 rounded-lg border border-violet-300 bg-white px-3 py-1 text-xs font-bold text-violet-700 hover:bg-violet-100">{copie === "lettre" ? "✓ Copié" : "📋 Copier le courrier"}</button>
            <p className="mt-2 text-[11px] text-slate-500">Les noms des membres du conseil syndical ne sont pas publics (RGPD). On adresse le courrier au <strong>« Conseil syndical »</strong> à l&apos;adresse de l&apos;immeuble — légal et efficace.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CoproprietesPage({ onRetour }: { onRetour: () => void }) {
  const [ds, setDs] = useState<CoproDataset | null>(null);
  const [chargement, setChargement] = useState(true);
  const [maj, setMaj] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [classe, setClasse] = useState("");
  const [avecDpe, setAvecDpe] = useState(true);
  const [precisSeul, setPrecisSeul] = useState(false);
  const [ciblesSyndic, setCiblesSyndic] = useState(false);
  const [limite, setLimite] = useState(30);

  // Fenêtre glissante : on ne garde que les diagnostics de 2 mois maximum.
  // Calculé à chaque rendu → un diag qui dépasse 2 mois disparaît automatiquement.
  const cutoff = useMemo(() => { const d = new Date(); d.setMonth(d.getMonth() - 2); return d.toISOString().slice(0, 10); }, []);
  const coprosRecents = useMemo(() => {
    if (!ds) return [] as Copro[];
    return ds.copros.map((c) => {
      const dpes = c.dpes.filter((d) => d.date && d.date >= cutoff);
      const dpeCountPrecis = dpes.filter((d) => d.precis).length;
      return { ...c, dpes, dpeCount: dpes.length, dpeCountPrecis, dernierDpe: dpes[0] ?? null };
    }).sort((a, b) =>
      Number(b.dpeCountPrecis > 0) - Number(a.dpeCountPrecis > 0)
      || (b.dernierDpe?.date ?? "").localeCompare(a.dernierDpe?.date ?? "")
      || b.lotsTotal - a.lotsTotal);
  }, [ds, cutoff]);

  useEffect(() => { let a = false; void (async () => { const d = await chargerCopros(); if (!a) { if (!d) setErreur("Chargement impossible (réessaie la mise à jour)."); setDs(d); setChargement(false); } })(); return () => { a = true; }; }, []);

  const mettreAJour = async () => {
    setMaj(true); setErreur(null);
    const d = await rafraichirCopros();
    setMaj(false);
    if (d) setDs(d); else setErreur("Mise à jour impossible (source indisponible). Réessaie dans un instant.");
  };

  const filtrees = useMemo(() => {
    if (!ds) return [] as Copro[];
    const s = q.trim().toLowerCase();
    return coprosRecents.filter((c) => {
      if (ciblesSyndic && !c.cibleSyndic) return false;
      if (avecDpe && !ciblesSyndic && !c.dernierDpe) return false;
      if (precisSeul && c.dpeCountPrecis === 0) return false;
      if (classe && c.dernierDpe?.etiquetteDpe !== classe) return false;
      if (s && !`${c.nom} ${c.adresse} ${c.syndic}`.toLowerCase().includes(s)) return false;
      return true;
    });
  }, [ds, coprosRecents, q, classe, avecDpe, precisSeul, ciblesSyndic]);

  const avecDiag = coprosRecents.filter((c) => c.dernierDpe).length;
  const nbCibles = coprosRecents.filter((c) => c.cibleSyndic).length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Accueil</button>
        <h2 className="text-2xl font-bold text-navy">🏢 Copropriétés</h2>
        <button onClick={() => void mettreAJour()} disabled={maj} className="ml-auto rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{maj ? "Mise à jour… (30–90 s)" : "↻ Mettre à jour"}</button>
      </div>
      <p className="mb-4 text-sm text-slate-500">Les copropriétés de Martigues de <strong>plus de 10 lots</strong> (Registre National des Copropriétés), croisées avec les DPE réalisés <strong>dans les 2 derniers mois</strong> (ADEME) par proximité du bâtiment. Un diagnostic de moins de 2 mois = signal fort de mise en vente. Les diags qui dépassent 2 mois disparaissent automatiquement de la liste.</p>

      {erreur && <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{erreur}</div>}

      {chargement ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400">Chargement des copropriétés…</div>
      ) : !ds ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">Aucune donnée. Clique sur « ↻ Mettre à jour » pour lancer la récupération (RNC + DPE).</div>
      ) : (
        <>
          <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {[["Copropriétés", nf.format(ds.copros.length)], ["Diag < 2 mois", nf.format(avecDiag)], ["🎯 Cibles syndic", nf.format(nbCibles)], ["Mis à jour", dateFr(new Date(ds.updatedAt).toISOString().slice(0, 10))]].map(([l, v]) => (
              <div key={l} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center"><div className="text-lg font-bold text-navy">{v}</div><div className="text-[10px] text-slate-500">{l}</div></div>
            ))}
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Rechercher (nom, adresse, syndic…)" className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-copper focus:outline-none" />
            <select value={classe} onChange={(e) => setClasse(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-semibold text-navy focus:border-copper focus:outline-none">
              <option value="">Toutes classes DPE</option>
              {CLASSES.map((c) => <option key={c} value={c}>DPE {c}</option>)}
            </select>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600"><input type="checkbox" checked={avecDpe} onChange={(e) => setAvecDpe(e.target.checked)} /> Avec diagnostic</label>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700"><input type="checkbox" checked={precisSeul} onChange={(e) => setPrecisSeul(e.target.checked)} /> 📍 Localisé (étage / entrée)</label>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-violet-700"><input type="checkbox" checked={ciblesSyndic} onChange={(e) => setCiblesSyndic(e.target.checked)} /> 🎯 Cibles syndic</label>
            <span className="text-xs text-slate-400">{filtrees.length} résultat(s)</span>
          </div>

          <div className="space-y-2.5">
            {filtrees.slice(0, limite).map((c) => <CarteCopro key={c.id} c={c} />)}
          </div>
          {filtrees.length > limite && (
            <button onClick={() => setLimite((n) => n + 30)} className="mt-3 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50">Afficher plus ({filtrees.length - limite} restante(s))</button>
          )}
        </>
      )}
    </div>
  );
}
