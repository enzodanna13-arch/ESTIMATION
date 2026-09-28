"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient, deleteClient, listClients, type ClientDossier } from "@/lib/clients";
import { completudeDossier, resumeRecherche, STATUT_COULEURS } from "@/lib/acquereurs";
import { NEGOCIATEURS, photoNegociateur } from "@/lib/equipe";
import AcquereurFiche from "@/components/AcquereurFiche";

const int = new Intl.NumberFormat("fr-FR");
const eur = (n: number | null | undefined) => (n != null && n > 0 ? `${int.format(n)} €` : "—");
// Grille FIXE de tranches de 50 000 € : « 400–450 k€ », « 450–500 k€ »…
// `band` = n° de palier (ceil(budgetMax / 50 000)) → tranche [(band-1)·50, band·50] k€.
function bracketLabel(band: number | null): string {
  if (band == null) return "budget libre";
  return `${(band - 1) * 50}–${band * 50} k€`;
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

// ---- Analyse automatique de la DEMANDE ----
// Unité fine = (commune × typologie [type+T] × tranche de budget). On en tire
// (1) le classement des biens les plus demandés, (2) une vue par commune →
// typologie → budget, pour que le négociateur sache quoi chasser et à quel prix.
const PALIER_BUDGET = 50_000;

interface Segment { cle: string; band: number | null; bracket: string; acquereurs: number; surfaceMin: number | null; noms: string[] }
interface DemandeFine {
  cle: string; commune: string; type: string; pieces: number | null; typologie: string;
  band: number | null; bracket: string; acquereurs: number; noms: string[]; surfaceMin: number | null;
}
interface TypoCommune { cle: string; typologie: string; type: string; pieces: number | null; acquereurs: number; segments: Segment[] }
interface CommuneDemande { commune: string; acquereurs: number; typologies: TypoCommune[] }
interface Demande { fines: DemandeFine[]; communes: CommuneDemande[]; totalAcq: number }

function analyserDemande(dossiers: ClientDossier[]): Demande {
  const fin = new Map<string, { commune: string; type: string; pieces: number | null; band: number | null; ids: Set<string>; noms: Set<string>; smin: number[] }>();
  const allIds = new Set<string>();
  for (const d of dossiers) {
    const nom = [d.prenom, d.nom].filter(Boolean).join(" ").trim() || d.nom || "Acquéreur";
    for (const r of (d.recherches ?? []).filter((x) => x.actif !== false)) {
      const types = r.typesBien.length ? r.typesBien : ["indifférent"];
      const villes = r.villes.length ? r.villes : ["Zone non précisée"];
      const pieces = r.piecesMin && r.piecesMin > 0 ? r.piecesMin : null;
      // Tranche fixe de 50 k€ : un plafond de 450 000 € → palier 9 → « 400–450 k€ ».
      const band = r.budgetMax ? Math.ceil(r.budgetMax / PALIER_BUDGET) : null;
      for (const t of types) for (const v of villes) {
        const commune = v.trim();
        const type = capitalise(t.toLowerCase());
        const cle = `${commune.toLowerCase()}|${type.toLowerCase()}|${pieces ?? "?"}|${band ?? "?"}`;
        const g = fin.get(cle) ?? { commune, type, pieces, band, ids: new Set<string>(), noms: new Set<string>(), smin: [] };
        g.ids.add(d.id); g.noms.add(nom); allIds.add(d.id);
        if (r.surfaceMin) g.smin.push(r.surfaceMin);
        fin.set(cle, g);
      }
    }
  }
  // Structures internes avec ids pour compter les acquéreurs distincts.
  interface FineInterne extends DemandeFine { ids: Set<string> }
  const fines: FineInterne[] = [...fin.entries()].map(([cle, g]) => ({
    cle, commune: g.commune, type: g.type, pieces: g.pieces,
    typologie: `${g.type}${g.pieces ? ` T${g.pieces}` : ""}`,
    band: g.band, bracket: bracketLabel(g.band),
    acquereurs: g.ids.size, noms: [...g.noms], surfaceMin: g.smin.length ? Math.min(...g.smin) : null,
    ids: g.ids,
  })).sort((a, b) => b.acquereurs - a.acquereurs || (b.band ?? 0) - (a.band ?? 0));

  // Regroupement commune → typologie → segments budget.
  const communes = new Map<string, { commune: string; ids: Set<string>; typos: Map<string, { typologie: string; type: string; pieces: number | null; ids: Set<string>; segments: Segment[] }> }>();
  for (const f of fines) {
    const cKey = f.commune.toLowerCase();
    const c = communes.get(cKey) ?? { commune: f.commune, ids: new Set<string>(), typos: new Map() };
    for (const id of f.ids) c.ids.add(id);
    const tKey = `${f.type.toLowerCase()}|${f.pieces ?? "?"}`;
    const t = c.typos.get(tKey) ?? { typologie: f.typologie, type: f.type, pieces: f.pieces, ids: new Set<string>(), segments: [] };
    for (const id of f.ids) t.ids.add(id);
    t.segments.push({ cle: f.cle, band: f.band, bracket: f.bracket, acquereurs: f.acquereurs, surfaceMin: f.surfaceMin, noms: f.noms });
    c.typos.set(tKey, t); communes.set(cKey, c);
  }
  const communesList: CommuneDemande[] = [...communes.values()].map((c) => ({
    commune: c.commune, acquereurs: c.ids.size,
    typologies: [...c.typos.entries()].map(([tk, t]) => ({ cle: `${c.commune}|${tk}`, typologie: t.typologie, type: t.type, pieces: t.pieces, acquereurs: t.ids.size, segments: t.segments.sort((a, b) => (a.band ?? 0) - (b.band ?? 0)) }))
      .sort((a, b) => b.acquereurs - a.acquereurs || a.typologie.localeCompare(b.typologie)),
  })).sort((a, b) => b.acquereurs - a.acquereurs || a.commune.localeCompare(b.commune));

  const finesPubliques: DemandeFine[] = fines.map(({ ids: _i, ...f }) => f); // eslint-disable-line @typescript-eslint/no-unused-vars
  return { fines: finesPubliques, communes: communesList, totalAcq: allIds.size };
}

export default function AcquereursPage({ onRetour, onOuvrirEstimation }: { onRetour: () => void; onOuvrirEstimation?: (id: string) => void }) {
  const [dossiers, setDossiers] = useState<ClientDossier[]>([]);
  const [chargement, setChargement] = useState(true);
  const [ouvert, setOuvert] = useState<ClientDossier | null>(null);
  const [actif, setActif] = useState("Tous");
  const [busy, setBusy] = useState(false);
  const [vue, setVue] = useState<"liste" | "besoins">("besoins");
  const [negoBesoins, setNegoBesoins] = useState("Tous");

  const recharger = () => { setChargement(true); listClients().then((c) => { setDossiers(c.filter(estAcq)); setChargement(false); }).catch(() => setChargement(false)); };
  useEffect(() => {
    let annule = false;
    listClients()
      .then((c) => { if (!annule) { setDossiers(c.filter(estAcq)); setChargement(false); } })
      .catch(() => { if (!annule) setChargement(false); });
    return () => { annule = true; };
  }, []);

  const scope = useMemo(() => (actif === "Tous" ? dossiers : dossiers.filter((d) => d.negociateur === actif)), [dossiers, actif]);
  const demandeScope = useMemo(() => (negoBesoins === "Tous" ? dossiers : dossiers.filter((d) => d.negociateur === negoBesoins)), [dossiers, negoBesoins]);
  const demande = useMemo(() => analyserDemande(demandeScope), [demandeScope]);
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

      {/* Bascule Acquéreurs / Besoins */}
      <div className="mb-4 inline-flex rounded-xl border border-slate-200 bg-white p-0.5 text-sm font-semibold">
        <button onClick={() => setVue("besoins")} className={`rounded-lg px-4 py-1.5 ${vue === "besoins" ? "bg-navy text-white" : "text-slate-600"}`}>📊 Besoins</button>
        <button onClick={() => setVue("liste")} className={`rounded-lg px-4 py-1.5 ${vue === "liste" ? "bg-navy text-white" : "text-slate-600"}`}>👥 Acquéreurs</button>
      </div>

      {vue === "besoins" ? (
        <BesoinsVue demande={demande} nego={negoBesoins} setNego={setNegoBesoins} nbAcq={demandeScope.length} />
      ) : (<>
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
      </>)}
    </div>
  );
}

// ================= Onglet BESOINS : quoi chasser, par ville / typologie / budget =================
function BesoinsVue({ demande, nego, setNego, nbAcq }: { demande: Demande; nego: string; setNego: (n: string) => void; nbAcq: number }) {
  const maxFine = Math.max(...demande.fines.map((f) => f.acquereurs), 1);
  return (
    <div className="space-y-5">
      {/* En-tête + filtre négociateur */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600"><b>{nbAcq}</b> acquéreur(s) · <b>{demande.communes.length}</b> commune(s) · les biens à chasser en priorité.</p>
        <select className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm" value={nego} onChange={(e) => setNego(e.target.value)}>
          <option value="Tous">Tous les négociateurs</option>
          {NEGOCIATEURS.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      {demande.fines.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">
          Aucun besoin identifié. Renseignez les recherches des acquéreurs (ville, type, pièces, budget).
        </div>
      ) : (<>
        {/* 🔥 LES PLUS DEMANDÉS */}
        <section className="rounded-2xl border border-copper/30 bg-copper/5 p-4">
          <h3 className="mb-3 text-base font-bold text-navy">🔥 Les biens les plus demandés</h3>
          <div className="space-y-2">
            {demande.fines.slice(0, 6).map((f, i) => (
              <div key={f.cle} className="flex items-center gap-3 rounded-xl bg-white p-2.5 shadow-sm">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white ${i === 0 ? "bg-copper" : i < 3 ? "bg-navy" : "bg-slate-400"}`}>{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold text-navy">{f.typologie} · {f.commune}</div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-copper" style={{ width: `${Math.round((f.acquereurs / maxFine) * 100)}%` }} /></div>
                </div>
                <span className="shrink-0 text-[15px] font-extrabold text-navy">{f.bracket}</span>
                <span className="shrink-0 rounded-full bg-copper px-2 py-0.5 text-xs font-bold text-white" title={f.noms.join(", ")}>{f.acquereurs} acq.</span>
              </div>
            ))}
          </div>
        </section>

        {/* PAR COMMUNE → TYPOLOGIE → BUDGET */}
        <section>
          <h3 className="mb-3 text-base font-bold text-navy">📍 Détail par commune</h3>
          <div className="space-y-3">
            {demande.communes.map((c) => (
              <div key={c.commune} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[15px] font-bold text-navy">📍 {c.commune}</span>
                  <span className="text-xs font-semibold text-slate-500">{c.acquereurs} acquéreur{c.acquereurs > 1 ? "s" : ""}</span>
                </div>
                <div className="space-y-2.5">
                  {c.typologies.map((t) => (
                    <div key={t.cle} className="flex flex-wrap items-center gap-2">
                      <span className="w-32 shrink-0 font-bold text-navy">🏠 {t.typologie}</span>
                      <div className="flex flex-1 flex-wrap gap-1.5">
                        {t.segments.map((s) => (
                          <span key={s.cle} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1" title={[s.surfaceMin ? `≥ ${s.surfaceMin} m²` : "", s.noms.join(", ")].filter(Boolean).join(" · ")}>
                            <span className="text-[15px] font-extrabold text-navy">{s.bracket}</span>
                            <span className="rounded-full bg-copper/15 px-1.5 text-[11px] font-bold text-copper">×{s.acquereurs}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </>)}
    </div>
  );
}
