"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { NEGOCIATEURS, photoNegociateur } from "@/lib/equipe";
import {
  ageJours, deleteOpportunite, genererTournees, getConfig, lienItineraireComplet,
  listOpportunites, listTournees, rescorer, saveConfig, supprimerToutesTournees, synchroniser, synchroniserUne,
} from "@/lib/prospection";
import {
  CONFIG_PROSPECTION_DEFAUT, dpeCls, NIVEAUX_PROSPECTION, STATUTS_PROSPECTION, STATUT_PROSPECTION_COULEURS,
  type NiveauProspection, type Opportunite, type ProspectionConfig, type Tournee,
} from "@/lib/prospectionTypes";
import { calculerStats } from "@/lib/prospectionStats";
import type { ResultatSync } from "@/lib/prospectionSync";
import OpportuniteFiche from "@/components/OpportuniteFiche";
import ProspectionReglages from "@/components/ProspectionReglages";
import FlyersTourneeModal from "@/components/prospection/FlyersTourneeModal";

const ProspectionCarte = dynamic(() => import("@/components/ProspectionCarte"), { ssr: false, loading: () => <p className="text-sm text-slate-400">Chargement de la carte…</p> });

const inputCls = "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/20";
const dateFr = (t: number | null | undefined) => (t ? new Date(t).toLocaleDateString("fr-FR") : "—");
const dateIsoFr = (s: string) => (s ? new Date(s).toLocaleDateString("fr-FR") : "—");

type Vue = "liste" | "tournees" | "dashboard" | "carte" | "reglages";

const NIV_CERCLE: Record<string, string> = { emerald: "bg-emerald-500", amber: "bg-amber-500", sky: "bg-sky-500", slate: "bg-slate-400" };

function prenomOuNom(nom: string): string {
  return nom === "Non attribué" ? nom : (nom.trim().split(/\s+/)[0] || nom);
}
function initiales(nom: string): string {
  if (!nom || nom === "Non attribué") return "?";
  return nom.trim().split(/\s+/).slice(0, 2).map((m) => m[0]?.toUpperCase() ?? "").join("");
}
function AvatarNego({ nom, size }: { nom: string; size: number }) {
  const photo = photoNegociateur(nom);
  if (photo) return <img src={photo} alt={nom} className="rounded-full object-cover" style={{ width: size, height: size }} />;
  return <span className="flex items-center justify-center rounded-full bg-copper font-bold text-white" style={{ width: size, height: size, fontSize: size * 0.4 }}>{initiales(nom)}</span>;
}

function ScorePastille({ score, niveau }: { score: number; niveau: NiveauProspection }) {
  const c = NIVEAUX_PROSPECTION[niveau].couleur;
  const bg = c === "emerald" ? "bg-emerald-500" : c === "amber" ? "bg-amber-500" : c === "sky" ? "bg-sky-500" : "bg-slate-400";
  return <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${bg}`}>{score}</span>;
}

interface Filtres {
  commune: string; negociateur: string; niveau: string; type: string; statut: string;
  scoreMin: string; ageMaxDpe: string; prospection: "tous" | "jamais" | "deja"; recherche: string;
}
const FILTRES_VIDE: Filtres = { commune: "", negociateur: "", niveau: "", type: "", statut: "", scoreMin: "", ageMaxDpe: "", prospection: "tous", recherche: "" };

export default function ProspectionPage({ onRetour }: { onRetour: () => void }) {
  const [opps, setOpps] = useState<Opportunite[]>([]);
  const [config, setConfig] = useState<ProspectionConfig | null>(null);
  const [tournees, setTournees] = useState<Tournee[]>([]);
  const [vue, setVue] = useState<Vue>("liste");
  const [selId, setSelId] = useState<string | null>(null);
  const [filtres, setFiltres] = useState<Filtres>(FILTRES_VIDE);
  const [chargement, setChargement] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [syncDetail, setSyncDetail] = useState<ResultatSync | null>(null);
  const [parCommune, setParCommune] = useState(false);
  const [busyCommune, setBusyCommune] = useState<string | null>(null);
  const [flyersTournee, setFlyersTournee] = useState<Tournee | null>(null);

  const recharger = async () => {
    const [o, t] = await Promise.all([listOpportunites(), listTournees()]);
    setOpps(o); setTournees(t);
  };

  useEffect(() => {
    (async () => {
      setChargement(true);
      const [c] = await Promise.all([getConfig()]);
      // Toujours disposer d'une config (défauts si l'API n'a pas répondu) pour
      // que l'écran Réglages ne soit jamais vide.
      setConfig(c ?? CONFIG_PROSPECTION_DEFAUT);
      await recharger();
      setChargement(false);
    })();
  }, []);

  // Rafraîchissement automatique des données (opportunités + tournées) toutes
  // les 3 min : la liste et la carte se mettent à jour toutes seules, y compris
  // après une synchronisation automatique quotidienne. En pause pendant une
  // action en cours ou l'ouverture d'une fiche.
  useEffect(() => {
    const id = setInterval(() => { if (!busy && !selId) void recharger(); }, 180_000);
    return () => clearInterval(id);
  }, [busy, selId]);

  const communes = config?.communes ?? [];
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(null), 4000); };

  const lancerSync = async () => {
    setBusy("sync"); setMsg(null);
    const res = await synchroniser((nom, i, total) => setMsg(`Synchronisation ${nom}… (${i}/${total})`));
    setBusy(null);
    setSyncDetail(res);
    if (!res) { flash("Synchronisation impossible."); return; }
    const totalDpe = res.communes.reduce((s, c) => s + c.dpe, 0);
    if (!res.ok) { flash(res.erreurs[0] ?? "Synchronisation impossible (module inactif ?)."); }
    else flash(`Synchro : ${res.nouveaux} nouveau(x) bien(s), ${res.misAJour} mis à jour — ${totalDpe} DPE analysés.${res.erreurs.length ? " ⚠ " + res.erreurs[0] : ""}`);
    await recharger();
  };
  const lancerSyncCommune = async (code: string, nom: string) => {
    setBusyCommune(code); setMsg(null);
    const res = await synchroniserUne(code);
    setBusyCommune(null);
    if (!res) { flash(`Synchronisation ${nom} impossible.`); return; }
    setSyncDetail(res);
    const dpe = res.communes.reduce((s, c) => s + c.dpe, 0);
    if (!res.ok) flash(res.erreurs[0] ?? `Échec ${nom}.`);
    else flash(`${nom} : ${res.nouveaux} nouveau(x) — ${dpe} DPE analysés.`);
    await recharger();
  };

  const lancerRegen = async () => {
    setBusy("regen"); setMsg(null);
    const res = await genererTournees();
    setBusy(null);
    if (!res) { flash("Génération impossible."); return; }
    if (res.totalBiens === 0) {
      flash(opps.length === 0
        ? "Aucune opportunité : cliquez d'abord sur « ⟳ Synchroniser » pour détecter les biens, puis regénérez."
        : "Aucun bien éligible pour une tournée aujourd'hui (score sous le minimum, biens déjà traités ou à relancer plus tard). Baissez le score minimum dans Réglages si besoin.");
      await recharger(); setVue("tournees"); return;
    }
    flash(`Tournées générées : ${res.totalBiens} bien(s) sur ${res.tournees.length} tournée(s).${res.nonAttribuees ? ` ${res.nonAttribuees} en « non attribué » (configurez les secteurs pour répartir).` : ""}`);
    await recharger();
    setVue("tournees");
  };
  const lancerPurge = async () => {
    if (!confirm("Supprimer toutes les tournées existantes ?")) return;
    setBusy("purge"); setMsg(null);
    const n = await supprimerToutesTournees();
    setBusy(null);
    flash(n != null ? `${n} fichier(s) de tournée supprimé(s).` : "Suppression impossible.");
    await recharger();
  };

  const lancerRescore = async () => {
    setBusy("rescore"); const n = await rescorer(); setBusy(null);
    flash(n != null ? `${n} opportunité(s) recalculée(s).` : "Recalcul impossible.");
    await recharger();
  };

  // Filtrage — hors commune (sert à construire les onglets par commune avec
  // leur compteur), puis on applique l'onglet commune sélectionné par-dessus.
  const oppsHorsCommune = useMemo(() => {
    const rech = filtres.recherche.trim().toLowerCase();
    return opps.filter((o) => {
      if (filtres.negociateur && filtres.negociateur !== "__none__" && o.negociateur !== filtres.negociateur) return false;
      if (filtres.negociateur === "__none__" && o.negociateur) return false;
      if (filtres.niveau && o.niveau !== filtres.niveau) return false;
      if (filtres.type && o.typeBien !== filtres.type) return false;
      if (filtres.statut && o.statut !== filtres.statut) return false;
      if (filtres.scoreMin && o.score < Number(filtres.scoreMin)) return false;
      if (filtres.ageMaxDpe) { const a = ageJours(o.dpeDateEtablissement); if (a == null || a > Number(filtres.ageMaxDpe)) return false; }
      if (filtres.prospection === "jamais" && (o.passages ?? []).length > 0) return false;
      if (filtres.prospection === "deja" && (o.passages ?? []).length === 0) return false;
      if (rech && !`${o.adresse} ${o.ville} ${o.negociateur}`.toLowerCase().includes(rech)) return false;
      return true;
    });
  }, [opps, filtres]);
  const oppsFiltres = useMemo(
    () => (filtres.commune ? oppsHorsCommune.filter((o) => o.codeInsee === filtres.commune) : oppsHorsCommune),
    [oppsHorsCommune, filtres.commune],
  );

  const selOpp = selId ? opps.find((o) => o.id === selId) ?? null : null;

  if (selOpp && config) {
    return (
      <OpportuniteFiche
        opp={selOpp}
        onRetour={() => setSelId(null)}
        onSaved={(maj) => { setOpps((p) => p.map((o) => (o.id === maj.id ? maj : o))); }}
        onSupprime={async () => { await deleteOpportunite(selOpp.id); setSelId(null); await recharger(); }}
      />
    );
  }

  return (
    <div className="pb-16">
      {/* En-tête */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <button onClick={onRetour} className="mb-2 rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">← Retour</button>
          <h2 className="text-2xl font-bold text-navy">🎯 Prospection ciblée <span className="align-middle rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">v24.09-K</span></h2>
          <p className="text-sm text-slate-500">Les signaux Open Data (DPE, DVF…) transformés en tournées terrain prioritaires.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => void lancerSync()} disabled={!!busy} className="rounded-lg bg-navy px-3 py-1.5 text-sm font-bold text-white hover:bg-navy-deep disabled:opacity-50">{busy === "sync" ? "Synchronisation…" : "⟳ Tout synchroniser"}</button>
          <button onClick={() => setParCommune((v) => !v)} disabled={!!busy} className="rounded-lg border border-navy/30 bg-white px-3 py-1.5 text-sm font-semibold text-navy hover:bg-slate-50 disabled:opacity-50">🏙️ Par commune</button>
          <button onClick={() => void lancerRegen()} disabled={!!busy} className="rounded-lg bg-copper px-3 py-1.5 text-sm font-bold text-white hover:brightness-110 disabled:opacity-50">{busy === "regen" ? "Génération…" : "🧭 Regénérer les tournées"}</button>
        </div>
      </div>

      {config && !config.actif && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Module désactivé. Activez-le dans <button onClick={() => setVue("reglages")} className="font-bold underline">Réglages</button> pour lancer la synchronisation Open Data.
        </div>
      )}
      {parCommune && (
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3">
          <div className="mb-2 text-sm font-bold text-navy">Synchroniser une commune à la fois</div>
          <p className="mb-2 text-xs text-slate-500">Lancez les communes une par une pour étaler les requêtes (utile si vous préférez ne pas tout charger d&apos;un coup).</p>
          <div className="flex flex-wrap gap-2">
            {communes.map((c) => (
              <button
                key={c.code}
                onClick={() => void lancerSyncCommune(c.code, c.nom)}
                disabled={busyCommune !== null || !!busy}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-copper hover:text-copper disabled:opacity-50"
              >
                {busyCommune === c.code ? "⏳ " : "⟳ "}{c.nom}
              </button>
            ))}
          </div>
        </div>
      )}
      {msg && <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-navy">{msg}</div>}
      {syncDetail && (
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 text-xs">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-bold text-navy">Détail de la dernière synchronisation</span>
            <button onClick={() => setSyncDetail(null)} className="text-slate-400 hover:text-slate-600">✕</button>
          </div>
          <table className="w-full text-left">
            <thead className="text-[10px] uppercase text-slate-400"><tr><th>Commune</th><th className="text-right">DPE analysés</th><th className="text-right">Nouveaux</th></tr></thead>
            <tbody>{syncDetail.communes.map((c) => (
              <tr key={c.code} className="border-t border-slate-50"><td className="py-0.5 text-slate-600">{c.nom}</td><td className="text-right font-semibold text-slate-700">{c.dpe}</td><td className="text-right font-semibold text-emerald-600">{c.nouveaux}</td></tr>
            ))}</tbody>
          </table>
          {syncDetail.erreurs.length > 0 && <div className="mt-2 text-red-600">⚠ {syncDetail.erreurs.join(" · ")}</div>}
        </div>
      )}

      {/* Onglets */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {([["liste", `Opportunités (${opps.length})`], ["tournees", `Tournées (${tournees.filter((t) => estAujourdhui(t.date)).length})`], ["dashboard", "Dashboard"], ["carte", "Carte"], ["reglages", "Réglages"]] as [Vue, string][]).map(([v, label]) => (
          <button key={v} onClick={() => setVue(v)} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${vue === v ? "bg-navy text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}>{label}</button>
        ))}
      </div>

      {chargement ? (
        <p className="text-sm text-slate-400">Chargement…</p>
      ) : vue === "liste" ? (
        <ListeOpportunites opps={oppsFiltres} oppsTabs={oppsHorsCommune} total={opps.length} communes={communes} filtres={filtres} setFiltres={setFiltres} onOpen={(o) => setSelId(o.id)} onRescore={() => void lancerRescore()} busy={busy} />
      ) : vue === "tournees" ? (
        <TourneesVue tournees={tournees} onRegen={() => void lancerRegen()} onPurge={() => void lancerPurge()} onFlyers={setFlyersTournee} busy={busy} />
      ) : vue === "dashboard" ? (
        <DashboardVue opps={opps} communes={communes} />
      ) : vue === "carte" ? (
        <ProspectionCarte opportunites={oppsFiltres} onOpen={(o) => setSelId(o.id)} />
      ) : (
        config && <ProspectionReglages config={config} onSave={async (patch) => { const c = await saveConfig(patch); if (c) { setConfig(c); flash("Réglages enregistrés."); } }} onRescore={() => void lancerRescore()} busy={busy} />
      )}

      {flyersTournee && <FlyersTourneeModal tournee={flyersTournee} onClose={() => setFlyersTournee(null)} />}
    </div>
  );
}

function estAujourdhui(t: number): boolean {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  return t >= d.getTime();
}

// ---------------------------------------------------------------------------
function ListeOpportunites({
  opps, oppsTabs, total, communes, filtres, setFiltres, onOpen, onRescore, busy,
}: {
  opps: Opportunite[]; oppsTabs: Opportunite[]; total: number; communes: ProspectionConfig["communes"];
  filtres: Filtres; setFiltres: (f: Filtres) => void; onOpen: (o: Opportunite) => void; onRescore: () => void; busy: string | null;
}) {
  const set = (patch: Partial<Filtres>) => setFiltres({ ...filtres, ...patch });

  // Onglets par commune, construits à partir des opportunités (hors filtre
  // commune) : un onglet par commune présente, avec son compteur.
  const parCommune = new Map<string, { nom: string; n: number }>();
  for (const o of oppsTabs) {
    const nom = communes.find((c) => c.code === o.codeInsee)?.nom || o.ville || o.codeInsee || "—";
    const e = parCommune.get(o.codeInsee) ?? { nom, n: 0 };
    e.n += 1; parCommune.set(o.codeInsee, e);
  }
  const onglets = [...parCommune.entries()]
    .map(([code, v]) => ({ code, nom: v.nom, n: v.n }))
    .sort((a, b) => (communes.findIndex((c) => c.code === a.code) - communes.findIndex((c) => c.code === b.code)) || b.n - a.n);

  return (
    <div>
      {/* Onglets par commune */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        <button onClick={() => set({ commune: "" })} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${filtres.commune === "" ? "bg-navy text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}>Toutes <span className="opacity-70">({oppsTabs.length})</span></button>
        {onglets.map((t) => (
          <button key={t.code} onClick={() => set({ commune: t.code })} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${filtres.commune === t.code ? "bg-navy text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}>{t.nom} <span className="opacity-70">({t.n})</span></button>
        ))}
      </div>

      {/* Filtres */}
      <div className="mb-3 grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 sm:grid-cols-2 lg:grid-cols-4">
        <input className={inputCls} placeholder="Rechercher (adresse, ville…)" value={filtres.recherche} onChange={(e) => set({ recherche: e.target.value })} />
        <select className={inputCls} value={filtres.negociateur} onChange={(e) => set({ negociateur: e.target.value })}><option value="">Tous négociateurs</option><option value="__none__">Non attribué</option>{NEGOCIATEURS.map((n) => <option key={n} value={n}>{n}</option>)}</select>
        <select className={inputCls} value={filtres.niveau} onChange={(e) => set({ niveau: e.target.value })}><option value="">Toutes priorités</option>{Object.entries(NIVEAUX_PROSPECTION).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
        <select className={inputCls} value={filtres.type} onChange={(e) => set({ type: e.target.value })}><option value="">Tous types</option><option value="maison">Maison</option><option value="appartement">Appartement</option></select>
        <select className={inputCls} value={filtres.statut} onChange={(e) => set({ statut: e.target.value })}><option value="">Tous statuts</option>{STATUTS_PROSPECTION.map((s) => <option key={s} value={s}>{s}</option>)}</select>
        <select className={inputCls} value={filtres.prospection} onChange={(e) => set({ prospection: e.target.value as Filtres["prospection"] })}><option value="tous">Prospection : tous</option><option value="jamais">Jamais prospecté</option><option value="deja">Déjà prospecté</option></select>
        <div className="flex gap-2">
          <input className={inputCls} type="number" placeholder="Score min" value={filtres.scoreMin} onChange={(e) => set({ scoreMin: e.target.value })} />
          <input className={inputCls} type="number" placeholder="Âge DPE max (j)" value={filtres.ageMaxDpe} onChange={(e) => set({ ageMaxDpe: e.target.value })} />
        </div>
      </div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{opps.length} / {total} opportunité(s)</span>
        <button onClick={onRescore} disabled={!!busy} className="text-xs font-semibold text-copper hover:underline disabled:opacity-50">{busy === "rescore" ? "Recalcul…" : "↻ Recalculer les scores"}</button>
      </div>

      {opps.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">
          Aucune opportunité. Lancez une <b>Synchronisation</b> pour détecter les nouveaux DPE des communes surveillées.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-[11px] uppercase text-slate-400">
              <tr>
                <th className="p-2">Prio.</th><th className="p-2">Adresse</th><th className="p-2">Commune</th><th className="p-2">Type</th>
                <th className="p-2">Surf.</th><th className="p-2">DPE</th><th className="p-2">Âge signal</th><th className="p-2">Dern. vente</th>
                <th className="p-2">Négociateur</th><th className="p-2">Statut</th><th className="p-2">Relance</th>
              </tr>
            </thead>
            <tbody>
              {opps.map((o) => {
                const age = ageJours(o.dpeDateEtablissement);
                return (
                  <tr key={o.id} className="cursor-pointer border-b border-slate-50 hover:bg-slate-50" onClick={() => onOpen(o)}>
                    <td className="p-2"><ScorePastille score={o.score} niveau={o.niveau} /></td>
                    <td className="p-2 font-medium text-navy">{o.adresse || "—"}{o.confiance === "faible" && <span className="ml-1 text-[10px] text-amber-600" title={o.confianceMotif}>⚠</span>}</td>
                    <td className="p-2 text-slate-600">{o.ville}</td>
                    <td className="p-2 capitalize text-slate-600">{o.typeBien}</td>
                    <td className="p-2 text-slate-600">{o.surface ? `${o.surface} m²` : "—"}</td>
                    <td className="p-2"><span className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${dpeCls(o.dpe)}`}>{o.dpe || "—"}</span></td>
                    <td className="p-2 text-slate-600">{age != null ? `${age} j` : "—"}</td>
                    <td className="p-2 text-slate-500">{o.dvfDerniereMutationDate ? dateIsoFr(o.dvfDerniereMutationDate) : "—"}</td>
                    <td className="p-2 text-slate-600">{o.negociateur || <span className="text-slate-400">—</span>}</td>
                    <td className="p-2"><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUT_PROSPECTION_COULEURS[o.statut] ?? "bg-slate-100 text-slate-600"}`}>{o.statut}</span></td>
                    <td className="p-2 text-slate-500">{o.prochaineRelance ? dateFr(o.prochaineRelance) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
function TourneesVue({ tournees, onRegen, onPurge, onFlyers, busy }: { tournees: Tournee[]; onRegen: () => void; onPurge: () => void; onFlyers: (t: Tournee) => void; busy: string | null }) {
  // Un menu (onglet) par négociateur ; à l'intérieur, toutes SES tournées.
  const nomDe = (t: Tournee) => t.negociateur || "Non attribué";
  const negos = [...new Set(tournees.map(nomDe))].sort();
  const [actif, setActif] = useState("");
  const actifValide = negos.includes(actif) ? actif : (negos[0] ?? "");
  const affichees = tournees.filter((t) => nomDe(t) === actifValide).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

  const grpActif = tournees.filter((t) => nomDe(t) === actifValide);
  const biensActif = grpActif.reduce((s, t) => s + t.etapes.length, 0);
  const faitsActif = grpActif.reduce((s, t) => s + t.etapes.filter((e) => e.fait).length, 0);
  const kmActif = Math.round(grpActif.reduce((s, t) => s + t.distanceKm, 0) * 10) / 10;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-navy">🗺️ Espace tournées</h3>
        <div className="flex gap-2">
          <button onClick={onPurge} disabled={!!busy} className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">{busy === "purge" ? "Suppression…" : "🗑 Tout supprimer"}</button>
          <button onClick={onRegen} disabled={!!busy} className="rounded-lg bg-copper px-3 py-1.5 text-sm font-bold text-white hover:brightness-110 disabled:opacity-50">{busy === "regen" ? "Génération…" : "↻ Regénérer"}</button>
        </div>
      </div>

      {tournees.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">Aucune tournée. Synchronisez puis cliquez sur « Regénérer ».</p>
      ) : (
        <>
          {/* Onglets par négociateur (avec avatar) */}
          <div className="flex flex-wrap gap-2">
            {negos.map((n) => {
              const g = tournees.filter((t) => nomDe(t) === n);
              const biens = g.reduce((s, t) => s + t.etapes.length, 0);
              const on = actifValide === n;
              return (
                <button key={n} onClick={() => setActif(n)} className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-semibold transition ${on ? "bg-navy text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}>
                  <AvatarNego nom={n} size={26} />
                  <span>{prenomOuNom(n)}</span>
                  <span className={`rounded-full px-1.5 text-[11px] ${on ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>{g.length}·{biens}</span>
                </button>
              );
            })}
          </div>

          {/* Bandeau récap du négociateur actif */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-gradient-to-r from-navy to-navy-deep p-4 text-white">
            <AvatarNego nom={actifValide} size={44} />
            <div className="mr-auto">
              <div className="font-bold">{actifValide}</div>
              <div className="text-xs text-white/70">{grpActif.length} tournée{grpActif.length > 1 ? "s" : ""} · {biensActif} bien(s) · {kmActif} km</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{faitsActif}/{biensActif}</div>
              <div className="text-[11px] text-white/70">effectués</div>
            </div>
          </div>

          {/* Cartes de tournées */}
          {affichees.map((t) => {
            const faits = t.etapes.filter((e) => e.fait).length;
            return (
              <div key={t.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/60 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-copper text-sm font-black text-white">{t.index ?? "•"}</span>
                    <div>
                      <div className="font-bold text-navy">📍 {t.etapes[0]?.ville || "—"}</div>
                      <div className="text-[11px] text-slate-500">{t.etapes.length} biens · {t.distanceKm} km · ≈ {formatDuree(t.dureeMin)}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onFlyers(t)} className="rounded-lg border border-copper/40 bg-white px-3 py-1.5 text-sm font-semibold text-copper hover:bg-copper/5">🖨️ Flyers</button>
                    <a href={lienItineraireComplet(t.etapes.map((e) => ({ lat: e.lat, lon: e.lon })))} target="_blank" rel="noreferrer" className="rounded-lg border border-navy/30 bg-white px-3 py-1.5 text-sm font-semibold text-navy hover:bg-slate-50">🧭 GPS</a>
                    <a href={`?matournee=${encodeURIComponent(t.id)}`} className="rounded-lg bg-navy px-3 py-1.5 text-sm font-bold text-white hover:bg-navy-deep">Ma tournée →</a>
                  </div>
                </div>
                {t.etapes.length > 0 && (
                  <div className="h-1 bg-slate-100"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${(faits / t.etapes.length) * 100}%` }} /></div>
                )}
                <ol className="divide-y divide-slate-50">
                  {t.etapes.map((e) => (
                    <li key={e.opportuniteId} className="flex items-center gap-3 px-4 py-2">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${e.fait ? "bg-slate-300" : NIV_CERCLE[NIVEAUX_PROSPECTION[e.niveau].couleur]}`}>{e.fait ? "✓" : e.ordre}</span>
                      <div className="min-w-0 flex-1">
                        <div className={`truncate text-sm font-medium ${e.fait ? "text-slate-400 line-through" : "text-slate-800"}`}>{e.adresse || "—"}</div>
                        {e.fait && e.resultat && <div className="text-[11px] font-semibold text-emerald-600">✓ {e.resultat}</div>}
                      </div>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">{e.score}</span>
                      {e.dpe && <span className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-bold ${dpeCls(e.dpe)}`}>{e.dpe}</span>}
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export function formatDuree(min: number): string {
  const h = Math.floor(min / 60); const m = Math.round(min % 60);
  return h > 0 ? `${h} h ${m.toString().padStart(2, "0")}` : `${m} min`;
}

// ---------------------------------------------------------------------------
function DashboardVue({ opps, communes }: { opps: Opportunite[]; communes: ProspectionConfig["communes"] }) {
  const [periode, setPeriode] = useState("");
  const [neg, setNeg] = useState("");
  const [com, setCom] = useState("");
  const stats = useMemo(() => calculerStats(opps, { periodeJours: periode ? Number(periode) : null, negociateur: neg || undefined, codeInsee: com || undefined }), [opps, periode, neg, com]);

  const cartes: [string, number, string][] = [
    ["Détectés", stats.entonnoir.detectees, "bg-slate-100 text-slate-700"],
    ["Prioritaires", stats.entonnoir.prioritaires, "bg-amber-100 text-amber-700"],
    ["Prospectés", stats.entonnoir.prospectees, "bg-blue-100 text-blue-700"],
    ["Contacts", stats.entonnoir.contacts, "bg-indigo-100 text-indigo-700"],
    ["Projets vendeurs", stats.entonnoir.projets, "bg-violet-100 text-violet-700"],
    ["Estimations", stats.entonnoir.estimations, "bg-emerald-100 text-emerald-700"],
    ["Mandats", stats.entonnoir.mandats, "bg-green-100 text-green-700"],
    ["Ventes", stats.entonnoir.ventes, "bg-teal-100 text-teal-700"],
  ];
  const taux: [string, number][] = [
    ["Contact / prospecté", stats.taux.contact], ["Projet / contact", stats.taux.projet],
    ["RDV / projet", stats.taux.rdv], ["Mandat / estimation", stats.taux.mandat], ["Vente / mandat", stats.taux.vente],
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 sm:grid-cols-3">
        <select className={inputCls} value={periode} onChange={(e) => setPeriode(e.target.value)}><option value="">Toute la période</option><option value="7">7 derniers jours</option><option value="30">30 derniers jours</option><option value="90">90 derniers jours</option></select>
        <select className={inputCls} value={neg} onChange={(e) => setNeg(e.target.value)}><option value="">Tous négociateurs</option>{NEGOCIATEURS.map((n) => <option key={n} value={n}>{n}</option>)}</select>
        <select className={inputCls} value={com} onChange={(e) => setCom(e.target.value)}><option value="">Toutes communes</option>{communes.map((c) => <option key={c.code} value={c.code}>{c.nom}</option>)}</select>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {cartes.map(([label, val, cls]) => (
          <div key={label} className={`rounded-2xl p-3 ${cls}`}><div className="text-2xl font-bold">{val}</div><div className="text-xs font-semibold opacity-80">{label}</div></div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h4 className="mb-2 text-sm font-bold text-navy">Taux de conversion</h4>
          {taux.map(([label, v]) => (
            <div key={label} className="mb-1.5">
              <div className="flex justify-between text-xs text-slate-600"><span>{label}</span><span className="font-bold">{v} %</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-copper" style={{ width: `${v}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h4 className="mb-2 text-sm font-bold text-navy">Fraîcheur du signal (DPE → détection)</h4>
          <p className="text-3xl font-bold text-navy">{stats.fraicheur.delaiMedianJours != null ? `${stats.fraicheur.delaiMedianJours} j` : "—"}</p>
          <p className="text-xs text-slate-500">délai médian ({stats.fraicheur.nbMesures} mesures) · moyenne {stats.fraicheur.delaiMoyenJours != null ? `${stats.fraicheur.delaiMoyenJours} j` : "—"}</p>
          <p className="mt-2 text-xs text-slate-400">Mesure si l&apos;on détecte les biens suffisamment tôt avant leur commercialisation.</p>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <TableStat titre="Conversion par priorité" lignes={stats.parNiveau.map((n) => [NIVEAUX_PROSPECTION[n.niveau as NiveauProspection]?.label ?? n.niveau, n.total, n.projets])} colonnes={["Priorité", "Total", "Projets"]} />
        <TableStat titre="Par commune" lignes={stats.parCommune.map((c) => [c.nom, c.total, c.projets])} colonnes={["Commune", "Total", "Projets"]} />
        <TableStat titre="Par âge du DPE" lignes={stats.parAgeDpe.map((a) => [a.tranche, a.total, a.projets])} colonnes={["Âge DPE", "Total", "Projets"]} />
      </div>
      <TableStat titre="Par négociateur" lignes={stats.parNegociateur.map((n) => [n.nom, n.total, n.prospectees, n.contacts, n.projets])} colonnes={["Négociateur", "Total", "Prospectés", "Contacts", "Projets"]} />
    </div>
  );
}

function TableStat({ titre, colonnes, lignes }: { titre: string; colonnes: string[]; lignes: (string | number)[][] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h4 className="mb-2 text-sm font-bold text-navy">{titre}</h4>
      <table className="w-full text-left text-sm">
        <thead className="text-[11px] uppercase text-slate-400"><tr>{colonnes.map((c, i) => <th key={c} className={`py-1 ${i > 0 ? "text-right" : ""}`}>{c}</th>)}</tr></thead>
        <tbody>{lignes.map((l, i) => <tr key={i} className="border-t border-slate-50">{l.map((v, j) => <td key={j} className={`py-1 ${j > 0 ? "text-right font-semibold text-slate-700" : "text-slate-600"}`}>{v}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
