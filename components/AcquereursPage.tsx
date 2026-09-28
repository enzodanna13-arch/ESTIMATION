"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient, deleteClient, listClients, type ClientDossier } from "@/lib/clients";
import { completudeDossier, resumeRecherche, STATUT_COULEURS } from "@/lib/acquereurs";
import { NEGOCIATEURS, photoNegociateur } from "@/lib/equipe";
import AcquereurFiche from "@/components/AcquereurFiche";

const int = new Intl.NumberFormat("fr-FR");
const eur = (n: number | null | undefined) => (n != null && n > 0 ? `${int.format(n)} €` : "—");
// Budget compact et lisible : « 400 k€ », « 1,2 M€ ».
const kEur = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} M€` : `${Math.round(n / 1000)} k€`);
function budgetCourt(min: number | null, max: number | null): string {
  if (!min && !max) return "budget libre";
  if (min && max) return max < 1_000_000 && min < 1_000_000 ? `${Math.round(min / 1000)}–${Math.round(max / 1000)} k€` : `${kEur(min)} – ${kEur(max)}`;
  return kEur((max ?? min) as number);
}

function prenomOuNom(nom: string): string { return (nom || "").trim().split(/\s+/)[0] || nom; }
function initiales(nom: string): string { return !nom ? "?" : nom.trim().split(/\s+/).slice(0, 2).map((m) => m[0]?.toUpperCase() ?? "").join(""); }
function AvatarNego({ nom, size }: { nom: string; size: number }) {
  const photo = photoNegociateur(nom);
  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photo} alt={nom} className="rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  return <span className="flex items-center justify-center rounded-full bg-copper font-bold text-white" style={{ width: size, height: size, fontSize: size * 0.4 }}>{initiales(nom)}</span>;
}

const estAcq = (d: ClientDossier) => d.typeClient === "acquereur" || d.typeClient === "investisseur";
const capitalise = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
function mediane(vals: number[]): number | null {
  const v = vals.filter((x) => x > 0).sort((a, b) => a - b);
  if (v.length === 0) return null;
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : Math.round((v[m - 1] + v[m]) / 2);
}

// ---- Analyse automatique des BESOINS (agrégation de la demande) ----
// Deux niveaux : 1) la TYPOLOGIE (type + nombre de pièces « T », ex. Maison T4)
// puis 2) à l'intérieur, les BUDGETS séparés par tranche (ex. 400-450 k€ vs
// 500-600 k€ sont deux segments distincts sous « Maison T4 »).
const PALIER_BUDGET = 50_000; // finesse des tranches de budget
interface SegmentBesoin {
  cle: string;
  budgetMin: number | null; budgetMax: number | null; budgetMedian: number | null;
  acquereurs: number; noms: string[]; communes: string[]; surfaceMin: number | null;
}
interface BesoinTypologie {
  cle: string; typologie: string; type: string; pieces: number | null;
  acquereurs: number; segments: SegmentBesoin[];
}
function analyserBesoins(dossiers: ClientDossier[]): BesoinTypologie[] {
  // Un segment = (type + pièces + tranche de budget).
  const segs = new Map<string, { type: string; pieces: number | null; ids: Set<string>; noms: Set<string>; communes: Set<string>; bmin: number[]; bmax: number[]; smin: number[] }>();
  for (const d of dossiers) {
    const nom = [d.prenom, d.nom].filter(Boolean).join(" ").trim() || d.nom || "Acquéreur";
    for (const r of (d.recherches ?? []).filter((x) => x.actif !== false)) {
      const types = r.typesBien.length ? r.typesBien : ["indifférent"];
      const pieces = r.piecesMin && r.piecesMin > 0 ? r.piecesMin : null;
      const tranche = r.budgetMax ? String(Math.floor(r.budgetMax / PALIER_BUDGET)) : "?";
      for (const t of types) {
        const type = capitalise(t.toLowerCase());
        const cle = `${type.toLowerCase()}|${pieces ?? "?"}|${tranche}`;
        const g = segs.get(cle) ?? { type, pieces, ids: new Set<string>(), noms: new Set<string>(), communes: new Set<string>(), bmin: [], bmax: [], smin: [] };
        g.ids.add(d.id); g.noms.add(nom);
        if (r.budgetMin) g.bmin.push(r.budgetMin);
        if (r.budgetMax) g.bmax.push(r.budgetMax);
        if (r.surfaceMin) g.smin.push(r.surfaceMin);
        for (const v of r.villes) if (v.trim()) g.communes.add(v.trim());
        segs.set(cle, g);
      }
    }
  }
  // Regroupe les segments par typologie (type + pièces).
  const typos = new Map<string, { type: string; pieces: number | null; ids: Set<string>; segments: SegmentBesoin[] }>();
  for (const [cle, g] of segs) {
    const segment: SegmentBesoin = {
      cle,
      budgetMin: g.bmin.length ? Math.min(...g.bmin) : (g.bmax.length ? Math.min(...g.bmax) : null),
      budgetMax: g.bmax.length ? Math.max(...g.bmax) : null,
      budgetMedian: mediane(g.bmax),
      acquereurs: g.ids.size, noms: [...g.noms], communes: [...g.communes],
      surfaceMin: g.smin.length ? Math.min(...g.smin) : null,
    };
    const typoKey = `${g.type.toLowerCase()}|${g.pieces ?? "?"}`;
    const tg = typos.get(typoKey) ?? { type: g.type, pieces: g.pieces, ids: new Set<string>(), segments: [] };
    for (const id of g.ids) tg.ids.add(id);
    tg.segments.push(segment);
    typos.set(typoKey, tg);
  }
  return [...typos.entries()].map(([cle, tg]) => ({
    cle, type: tg.type, pieces: tg.pieces,
    typologie: `${tg.type}${tg.pieces ? ` T${tg.pieces}` : ""}`,
    acquereurs: tg.ids.size,
    segments: tg.segments.sort((a, b) => (a.budgetMax ?? 0) - (b.budgetMax ?? 0)),
  })).sort((a, b) => b.acquereurs - a.acquereurs || a.typologie.localeCompare(b.typologie));
}

export default function AcquereursPage({ onRetour, onOuvrirEstimation }: { onRetour: () => void; onOuvrirEstimation?: (id: string) => void }) {
  const [dossiers, setDossiers] = useState<ClientDossier[]>([]);
  const [chargement, setChargement] = useState(true);
  const [ouvert, setOuvert] = useState<ClientDossier | null>(null);
  const [actif, setActif] = useState("Tous");
  const [busy, setBusy] = useState(false);

  const recharger = () => { setChargement(true); listClients().then((c) => { setDossiers(c.filter(estAcq)); setChargement(false); }).catch(() => setChargement(false)); };
  useEffect(() => {
    let annule = false;
    listClients()
      .then((c) => { if (!annule) { setDossiers(c.filter(estAcq)); setChargement(false); } })
      .catch(() => { if (!annule) setChargement(false); });
    return () => { annule = true; };
  }, []);

  const scope = useMemo(() => (actif === "Tous" ? dossiers : dossiers.filter((d) => d.negociateur === actif)), [dossiers, actif]);
  const besoins = useMemo(() => analyserBesoins(scope), [scope]);
  const parNego = useMemo(() => { const m = new Map<string, number>(); for (const d of dossiers) m.set(d.negociateur || "Non attribué", (m.get(d.negociateur || "Non attribué") ?? 0) + 1); return m; }, [dossiers]);
  const tabs = useMemo(() => ["Tous", ...NEGOCIATEURS], []);

  const nouvel = async () => {
    setBusy(true);
    try {
      const nego = actif !== "Tous" ? actif : (NEGOCIATEURS[0] ?? "");
      const d = await createClient({ nom: "Nouvel acquéreur", bien: "", negociateur: nego, typeClient: "acquereur" });
      if (d) { setDossiers((p) => [d, ...p]); setOuvert(d); }
    } finally { setBusy(false); }
  };

  const supprimer = async (id: string) => { await deleteClient(id).catch(() => {}); setOuvert(null); recharger(); };

  // ---- Fiche ouverte ----
  if (ouvert) {
    return (
      <div className="mx-auto max-w-5xl">
        <AcquereurFiche
          dossier={ouvert}
          onRetour={() => { setOuvert(null); recharger(); }}
          onSaved={(d) => { setOuvert(d); setDossiers((p) => p.map((x) => (x.id === d.id ? d : x))); }}
          onSupprime={() => void supprimer(ouvert.id)}
          onOuvrirEstimation={onOuvrirEstimation}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <button onClick={onRetour} className="mb-2 rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">← Retour</button>
          <h2 className="text-2xl font-bold text-navy">🔑 Acquéreurs</h2>
          <p className="text-sm text-slate-500">L&apos;espace acquéreurs de l&apos;agence, par négociateur, avec l&apos;analyse automatique des besoins en biens.</p>
        </div>
        <button onClick={() => void nouvel()} disabled={busy} className="rounded-lg bg-copper px-4 py-2 text-sm font-bold text-white hover:brightness-110 disabled:opacity-50">➕ Nouvel acquéreur</button>
      </div>

      {/* Onglets négociateurs (avatars) */}
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((n) => {
          const on = actif === n;
          const nb = n === "Tous" ? dossiers.length : (parNego.get(n) ?? 0);
          return (
            <button key={n} onClick={() => setActif(n)} className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-semibold transition ${on ? "bg-navy text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}>
              {n === "Tous" ? <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-slate-200 text-slate-600">👥</span> : <AvatarNego nom={n} size={26} />}
              <span>{n === "Tous" ? "Tous" : prenomOuNom(n)}</span>
              <span className={`rounded-full px-1.5 text-[11px] ${on ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>{nb}</span>
            </button>
          );
        })}
      </div>

      {/* ANALYSE DES BESOINS */}
      <section className="mb-5 rounded-2xl border border-copper/25 bg-copper/5 p-4">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-base font-bold text-navy">📊 Besoins {actif === "Tous" ? "du portefeuille" : `de ${prenomOuNom(actif)}`}</h3>
          <span className="text-xs text-slate-500">{scope.length} acquéreur(s) · {besoins.length} besoin(s) identifié(s)</span>
        </div>
        <p className="mb-3 text-xs text-slate-500">Ce que vos acquéreurs recherchent, agrégé automatiquement — les biens à prospecter en priorité.</p>
        {besoins.length === 0 ? (
          <p className="text-sm text-slate-400">Renseignez les recherches des acquéreurs (type, pièces, budget) pour voir apparaître les besoins.</p>
        ) : (() => {
          const maxAcq = Math.max(...besoins.map((b) => b.acquereurs), 1);
          return (
            <div className="grid gap-2.5 md:grid-cols-2">
              {besoins.map((b) => (
                <div key={b.cle} className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[15px] font-bold text-navy">🏠 {b.typologie}</span>
                    <span className="shrink-0 text-xs font-semibold text-slate-500">{b.acquereurs} acquéreur{b.acquereurs > 1 ? "s" : ""}</span>
                  </div>
                  {/* Barre de demande (priorité en un coup d'œil) */}
                  <div className="my-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-copper" style={{ width: `${Math.round((b.acquereurs / maxAcq) * 100)}%` }} />
                  </div>
                  {/* Budgets : gros et lisibles */}
                  <div className="flex flex-wrap gap-1.5">
                    {b.segments.map((s) => (
                      <span key={s.cle} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1" title={[s.surfaceMin ? `≥ ${s.surfaceMin} m²` : "", s.communes.length ? s.communes.join(", ") : "", s.noms.join(", ")].filter(Boolean).join(" · ")}>
                        <span className="text-[15px] font-extrabold text-navy">{budgetCourt(s.budgetMin, s.budgetMax)}</span>
                        <span className="rounded-full bg-copper/15 px-1.5 text-[11px] font-bold text-copper">×{s.acquereurs}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </section>

      {/* LISTE DES ACQUÉREURS */}
      {chargement ? (
        <p className="text-sm text-slate-400">Chargement…</p>
      ) : scope.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">
          {actif === "Tous" ? "Aucun acquéreur pour l'instant. Cliquez sur « Nouvel acquéreur »." : `Aucun acquéreur pour ${prenomOuNom(actif)}.`}
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {scope.slice().sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0)).map((d) => {
            const comp = completudeDossier(d);
            const nom = [d.prenom, d.nom].filter(Boolean).join(" ").trim() || d.nom || "Acquéreur";
            const invest = d.typeClient === "investisseur";
            const budgetMax = Math.max(0, ...(d.recherches ?? []).map((r) => r.budgetMax ?? 0));
            return (
              <button key={d.id} onClick={() => setOuvert(d)} className="rounded-2xl border border-slate-200 bg-white p-3 text-left transition hover:border-copper/40 hover:shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-navy">{invest ? "📈" : "🔑"} {nom}</span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUT_COULEURS[d.statut ?? "Nouveau"] ?? "bg-slate-100 text-slate-600"}`}>{d.statut ?? "Nouveau"}</span>
                </div>
                <div className="mt-0.5 truncate text-xs text-slate-500">{resumeRecherche(d) || "Projet à renseigner"}</div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{budgetMax > 0 ? `Budget ≤ ${eur(budgetMax)}` : "Budget à préciser"}{d.negociateur ? ` · ${prenomOuNom(d.negociateur)}` : ""}</span>
                  <span className={comp.pct >= 70 ? "text-emerald-600" : comp.pct >= 40 ? "text-amber-600" : "text-slate-400"}>{comp.pct}%</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
