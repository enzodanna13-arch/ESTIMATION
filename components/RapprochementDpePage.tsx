"use client";

import { useEffect, useMemo, useState } from "react";
import { listClients, type ClientDossier } from "@/lib/clients";
import { chargerDpeFrais, rafraichirDpeFrais, type FreshDpe, type DpeFraisDataset } from "@/lib/dpeFrais";
import { scorerRecherche, NIVEAUX, type BienCriteres, type NiveauMatch } from "@/lib/matching";
import { resumeRecherche } from "@/lib/acquereurs";
import { badgeDpe } from "@/components/CoproprietesPage";

const nf = new Intl.NumberFormat("fr-FR");
const jours = (iso: string) => { const t = new Date(iso + "T12:00:00").getTime(); return Number.isFinite(t) ? Math.max(0, Math.round((Date.now() - t) / 86400000)) : null; };
const dateFr = (s: string) => { const j = jours(s); return j === null ? s : j === 0 ? "aujourd'hui" : j === 1 ? "hier" : `il y a ${j} j`; };

function bienDepuisFresh(d: FreshDpe): BienCriteres {
  const et = d.etage !== "" && Number.isFinite(Number(d.etage)) ? Number(d.etage) : null;
  return { ville: d.ville, codePostal: d.codePostal, quartier: d.residence, typeBien: d.typeBien, prix: null, surface: d.surface, nbPieces: null, nbChambres: null, etage: et, ascenseur: false, exterieurs: [], garage: false, stationnement: false, cave: false, dpe: d.etiquetteDpe, travaux: false };
}

interface MatchAcq { dossier: ClientDossier; score: number; niveau: NiveauMatch; libelle: string; }
interface OpportuniteDpe { dpe: FreshDpe; acqs: MatchAcq[]; }
interface Tournee { etapes: OpportuniteDpe[]; dureeMin: number; distKm: number; }

// Distance haversine (mètres) entre deux DPE géolocalisés.
function distM(a: FreshDpe, b: FreshDpe): number {
  if (a.lat == null || a.lon == null || b.lat == null || b.lon == null) return Infinity;
  const R = 6371000, toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLon = toRad(b.lon - a.lon);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

const DUREE_MAX = 180; // 3 h par tournée
const ARRET_MIN = 12;  // temps passé par bien (repérage / contact gardien…)
const V_KMH = 22;      // vitesse moyenne de déplacement en ville

// Construit des tournées terrain d'~3 h : plus proche voisin (nearest-neighbour)
// en partant du bien le plus frais, puis on coupe dès qu'on atteint ~3 h.
function genererTournees(opps: OpportuniteDpe[]): Tournee[] {
  const reste = opps.filter((o) => o.dpe.lat != null && o.dpe.lon != null);
  reste.sort((a, b) => b.dpe.date.localeCompare(a.dpe.date) || b.acqs[0].score - a.acqs[0].score);
  const tournees: Tournee[] = [];
  while (reste.length) {
    const etapes: OpportuniteDpe[] = [reste.shift()!];
    let duree = ARRET_MIN, dist = 0;
    while (reste.length) {
      const dernier = etapes[etapes.length - 1].dpe;
      let iMin = -1, dMin = Infinity;
      for (let i = 0; i < reste.length; i++) { const d = distM(dernier, reste[i].dpe); if (d < dMin) { dMin = d; iMin = i; } }
      if (iMin < 0 || !Number.isFinite(dMin)) break;
      const trajet = (dMin / 1000 / V_KMH) * 60;
      if (duree + trajet + ARRET_MIN > DUREE_MAX && etapes.length >= 1) break;
      duree += trajet + ARRET_MIN; dist += dMin;
      etapes.push(reste.splice(iMin, 1)[0]);
    }
    tournees.push({ etapes, dureeMin: Math.round(duree), distKm: Math.round((dist / 1000) * 10) / 10 });
  }
  return tournees;
}

// Lien Google Maps multi-étapes (origine → waypoints → destination), plafonné à 10 points.
function itineraire(etapes: OpportuniteDpe[]): string {
  const pts = etapes.map((e) => e.dpe).filter((d) => d.lat != null && d.lon != null).slice(0, 10).map((d) => `${d.lat},${d.lon}`);
  if (pts.length < 2) {
    const d = etapes[0].dpe;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${d.adresse} ${d.ville}`)}`;
  }
  const origin = pts[0], destination = pts[pts.length - 1], waypoints = pts.slice(1, -1).join("|");
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ""}&travelmode=driving`;
}

export default function RapprochementDpePage({ onRetour }: { onRetour: () => void }) {
  const [clients, setClients] = useState<ClientDossier[]>([]);
  const [ds, setDs] = useState<DpeFraisDataset | null>(null);
  const [chargement, setChargement] = useState(true);
  const [maj, setMaj] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [niveauMin, setNiveauMin] = useState<"forte" | "interessante" | "possible">("interessante");
  const [q, setQ] = useState("");
  const [limite, setLimite] = useState(24);
  const [selId, setSelId] = useState<string | null>(null);
  const [vue, setVue] = useState<"annonces" | "tournees">("annonces");

  useEffect(() => { let a = false; void (async () => { const [c, d] = await Promise.all([listClients().catch(() => []), chargerDpeFrais()]); if (a) return; if (!d) setErreur("Chargement des DPE impossible — réessaie la mise à jour."); setClients(c); setDs(d); setChargement(false); })(); return () => { a = true; }; }, []);

  const mettreAJour = async () => { setMaj(true); setErreur(null); const d = await rafraichirDpeFrais(); setMaj(false); if (d) setDs(d); else setErreur("Mise à jour impossible (source indisponible)."); };

  const seuil = NIVEAUX[niveauMin].min;
  const acquereurs = useMemo(() => clients.filter((c) => (c.typeClient === "acquereur" || c.typeClient === "investisseur") && (c.recherches ?? []).some((r) => r.actif !== false)), [clients]);

  const opportunites = useMemo(() => {
    if (!ds) return [] as OpportuniteDpe[];
    const out: OpportuniteDpe[] = [];
    for (const d of ds.dpes) {
      const bien = bienDepuisFresh(d);
      const acqs: MatchAcq[] = [];
      for (const dossier of acquereurs) {
        let best: MatchAcq | null = null;
        for (const r of (dossier.recherches ?? []).filter((x) => x.actif !== false)) {
          const res = scorerRecherche(bien, r);
          if (res.niveau && res.score >= seuil && (!best || res.score > best.score)) best = { dossier, score: res.score, niveau: res.niveau, libelle: r.libelle || "Recherche" };
        }
        if (best) acqs.push(best);
      }
      if (acqs.length) { acqs.sort((a, b) => b.score - a.score); out.push({ dpe: d, acqs }); }
    }
    return out.sort((a, b) => b.dpe.date.localeCompare(a.dpe.date) || b.acqs[0].score - a.acqs[0].score);
  }, [ds, acquereurs, seuil]);

  const filtrees = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return opportunites;
    return opportunites.filter((o) => `${o.dpe.adresse} ${o.dpe.typeBien} ${o.acqs.map((a) => `${a.dossier.prenom} ${a.dossier.nom}`).join(" ")}`.toLowerCase().includes(s));
  }, [opportunites, q]);

  const tournees = useMemo(() => genererTournees(filtrees), [filtrees]);
  const sansGeo = useMemo(() => filtrees.filter((o) => o.dpe.lat == null || o.dpe.lon == null).length, [filtrees]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Accueil</button>
        <h2 className="text-2xl font-bold text-navy">🎯 Acquéreurs ↔ DPE frais <span className="rounded-full bg-navy px-2 py-0.5 text-[11px] font-bold text-white align-middle">privé</span></h2>
        <button onClick={() => void mettreAJour()} disabled={maj} className="ml-auto rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{maj ? "Mise à jour…" : "↻ Mettre à jour"}</button>
      </div>
      <p className="mb-4 text-sm text-slate-500">Les <strong>recherches des acquéreurs de toute l'équipe</strong> croisées avec les <strong>DPE réalisés ces 3 derniers mois</strong> (un DPE = un bien qui se prépare à la vente). Quand un bien frais colle à un acquéreur : <strong>va chercher le mandat</strong> à cette adresse et place l'acquéreur. Écran réservé à la direction.</p>

      {erreur && <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{erreur}</div>}

      {chargement ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400">Chargement…</div>
      ) : !ds ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">Aucune donnée DPE. Clique sur « ↻ Mettre à jour ».</div>
      ) : selId && opportunites.find((o) => o.dpe.numeroDpe === selId) ? (
        <FicheDpe o={opportunites.find((o) => o.dpe.numeroDpe === selId)!} onRetour={() => setSelId(null)} />
      ) : (
        <>
          <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {[["Biens (annonces)", nf.format(opportunites.length)], ["Acquéreurs actifs", nf.format(acquereurs.length)], ["DPE frais (3 mois)", nf.format(ds.dpes.length)], ["Mis à jour", new Date(ds.updatedAt).toLocaleDateString("fr-FR")]].map(([l, v]) => (
              <div key={l} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center"><div className="text-lg font-bold text-navy">{v}</div><div className="text-[10px] text-slate-500">{l}</div></div>
            ))}
          </div>

          <div className="mb-3 inline-flex rounded-xl border border-slate-200 bg-white p-1">
            <button onClick={() => setVue("annonces")} className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${vue === "annonces" ? "bg-navy text-white" : "text-slate-500 hover:text-navy"}`}>🏠 Annonces</button>
            <button onClick={() => setVue("tournees")} className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${vue === "tournees" ? "bg-navy text-white" : "text-slate-500 hover:text-navy"}`}>🚗 Tournées 3h</button>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Rechercher (adresse, acquéreur…)" className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-copper focus:outline-none" />
            <select value={niveauMin} onChange={(e) => setNiveauMin(e.target.value as typeof niveauMin)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-semibold text-navy focus:border-copper focus:outline-none">
              <option value="forte">Correspondance forte</option>
              <option value="interessante">Intéressante et +</option>
              <option value="possible">Toutes (possible et +)</option>
            </select>
            <span className="text-xs text-slate-400">{filtrees.length} bien(s)</span>
          </div>

          {filtrees.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">Aucun rapprochement pour l'instant. Dès qu'un DPE frais colle à un acquéreur de l'équipe, il apparaît ici.</div>
          ) : vue === "tournees" ? (
            <>
              <p className="mb-3 text-xs text-slate-500">Tournées terrain d'environ <strong>3 h</strong> construites par proximité géographique (plus proche voisin), biens les plus frais en premier. Suis l'ordre et ouvre l'itinéraire Google Maps.</p>
              {tournees.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">Aucun bien géolocalisé à mettre en tournée.</div>
              ) : (
                <div className="space-y-4">
                  {tournees.map((t, i) => <CarteTournee key={i} index={i + 1} t={t} onOuvrir={(id) => setSelId(id)} />)}
                </div>
              )}
              {sansGeo > 0 && <p className="mt-3 text-xs text-slate-400">{sansGeo} bien(s) sans coordonnées GPS ne sont pas inclus dans les tournées (visibles dans « Annonces »).</p>}
            </>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filtrees.slice(0, limite).map((o) => <CarteAnnonce key={o.dpe.numeroDpe} o={o} onOuvrir={() => setSelId(o.dpe.numeroDpe)} />)}
              </div>
              {filtrees.length > limite && (
                <button onClick={() => setLimite((n) => n + 24)} className="mt-3 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50">Afficher plus ({filtrees.length - limite} restant(s))</button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

// Carte « annonce » compacte (grille) — on clique pour voir les acquéreurs.
function CarteAnnonce({ o, onOuvrir }: { o: OpportuniteDpe; onOuvrir: () => void }) {
  const d = o.dpe;
  const recent = (jours(d.date) ?? 99) <= 21;
  const fortes = o.acqs.filter((a) => a.niveau === "forte").length;
  return (
    <button onClick={onOuvrir} className={`flex flex-col overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${recent ? "border-copper/40" : "border-slate-200"}`}>
      <div className="flex items-center justify-between bg-slate-50/80 px-3 py-2">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${recent ? "bg-copper text-white" : "bg-slate-200 text-slate-600"}`}>📅 DPE {dateFr(d.date)}</span>
        <div className="flex gap-1">
          <span className={`rounded px-1.5 py-0.5 text-[11px] font-black ${badgeDpe(d.etiquetteDpe)}`}>{d.etiquetteDpe || "?"}</span>
          {d.etiquetteGes && <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${badgeDpe(d.etiquetteGes)}`}>{d.etiquetteGes}</span>}
        </div>
      </div>
      <div className="flex-1 p-3">
        <div className="text-base font-black text-navy">{d.typeBien}{d.surface ? ` · ${d.surface} m²` : ""}</div>
        <div className="mt-0.5 line-clamp-2 text-[13px] text-slate-600">{d.adresse}{d.ville ? ` · ${d.ville}` : ""}</div>
        {(d.etage !== "" || d.residence) && <div className="mt-1 text-[12px] font-semibold text-copper">📍 {d.etage !== "" ? `Étage ${d.etage === "0" ? "RDC" : d.etage}` : d.residence}</div>}
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2">
        <span className="text-[13px] font-bold text-navy">👥 {o.acqs.length} acquéreur{o.acqs.length > 1 ? "s" : ""}{fortes > 0 ? <span className="ml-1 text-[11px] font-bold text-emerald-600">· {fortes} fort{fortes > 1 ? "s" : ""}</span> : null}</span>
        <span className="text-xs font-bold text-copper">Voir →</span>
      </div>
    </button>
  );
}

// Carte d'une tournée terrain (~3 h) : étapes ordonnées + itinéraire Maps.
function CarteTournee({ index, t, onOuvrir }: { index: number; t: Tournee; onOuvrir: (id: string) => void }) {
  const h = Math.floor(t.dureeMin / 60), m = t.dureeMin % 60;
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-l-4 border-copper bg-slate-50/70 px-4 py-3">
        <div>
          <div className="text-base font-black text-navy">🚗 Tournée {index}</div>
          <div className="text-[12px] text-slate-500">{t.etapes.length} bien{t.etapes.length > 1 ? "s" : ""} · ~{h > 0 ? `${h} h${m ? ` ${m}` : ""}` : `${m} min`} · {t.distKm} km</div>
        </div>
        <a href={itineraire(t.etapes)} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-navy px-3 py-1.5 text-sm font-bold text-white transition hover:brightness-110">🗺️ Itinéraire</a>
      </div>
      <ol className="divide-y divide-slate-100">
        {t.etapes.map((o, i) => {
          const d = o.dpe;
          const fortes = o.acqs.filter((a) => a.niveau === "forte").length;
          return (
            <li key={d.numeroDpe}>
              <button onClick={() => onOuvrir(d.numeroDpe)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-slate-50">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-copper/10 text-xs font-black text-copper">{i + 1}</span>
                <span className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-black ${badgeDpe(d.etiquetteDpe)}`}>{d.etiquetteDpe || "?"}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-navy">{d.typeBien}{d.surface ? ` · ${d.surface} m²` : ""}{d.etage !== "" ? ` · ét. ${d.etage === "0" ? "RDC" : d.etage}` : ""}</div>
                  <div className="truncate text-xs text-slate-500">{d.adresse}{d.ville ? ` · ${d.ville}` : ""}</div>
                </div>
                <span className="shrink-0 text-[12px] font-bold text-navy">👥 {o.acqs.length}{fortes > 0 ? <span className="ml-0.5 text-emerald-600">·{fortes}★</span> : null}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// Fiche détaillée d'un bien (DPE) : le bien + les acquéreurs à placer.
function FicheDpe({ o, onRetour }: { o: OpportuniteDpe; onRetour: () => void }) {
  const d = o.dpe;
  const recent = (jours(d.date) ?? 99) <= 21;
  const [lim, setLim] = useState(40);
  const [ouvert, setOuvert] = useState(false);
  const fortes = o.acqs.filter((a) => a.niveau === "forte").length;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${d.adresse} ${d.ville}`)}`;
  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={onRetour} className="mb-3 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Tous les biens</button>

      <div className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${recent ? "border-copper/40" : "border-slate-200"}`}>
        <div className="border-l-4 border-copper bg-slate-50/70 p-5">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${recent ? "bg-copper text-white" : "bg-slate-200 text-slate-600"}`}>📅 DPE {dateFr(d.date)}</span>
            <span className={`rounded-md px-2 py-0.5 text-sm font-black ${badgeDpe(d.etiquetteDpe)}`}>DPE {d.etiquetteDpe || "?"}</span>
            {d.etiquetteGes && <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${badgeDpe(d.etiquetteGes)}`}>GES {d.etiquetteGes}</span>}
          </div>
          <div className="text-xl font-black text-navy">{d.typeBien}{d.surface ? ` · ${d.surface} m²` : ""}</div>
          <div className="text-sm text-slate-600">{d.adresse}{d.ville ? ` · ${d.ville}` : ""}</div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {(d.etage !== "" || d.residence) && <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-0.5 text-[13px] font-semibold text-copper shadow-sm">📍 {d.etage !== "" ? `Étage ${d.etage === "0" ? "RDC" : d.etage}` : d.residence}</span>}
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[12px] font-semibold text-slate-600 hover:bg-slate-50">🗺️ Itinéraire</a>
          </div>
        </div>

        <div className="p-4">
          <button onClick={() => setOuvert((v) => !v)} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-left transition hover:bg-slate-100">
            <span className="text-sm font-bold text-navy">👥 {o.acqs.length} acquéreur{o.acqs.length > 1 ? "s" : ""} à placer{fortes > 0 ? <span className="ml-1 text-[12px] font-bold text-emerald-600">· {fortes} fort{fortes > 1 ? "s" : ""}</span> : null}</span>
            <span className={`text-sm font-bold text-copper transition ${ouvert ? "rotate-180" : ""}`}>▾</span>
          </button>
          {ouvert && (
          <div className="mt-3 space-y-2">
            {o.acqs.slice(0, lim).map((a) => {
              const badge = a.niveau === "forte" ? "bg-emerald-500 text-white" : a.niveau === "interessante" ? "bg-amber-400 text-white" : "bg-slate-300 text-slate-700";
              return (
                <div key={a.dossier.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-2.5">
                  <span className={`flex h-10 w-12 shrink-0 flex-col items-center justify-center rounded-lg text-xs font-black leading-none ${badge}`}>{a.score}<span className="text-[8px] font-semibold opacity-80">%</span></span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-navy">{[a.dossier.prenom, a.dossier.nom].filter(Boolean).join(" ") || a.dossier.nom}{a.dossier.negociateur && <span className="ml-1 text-[11px] font-medium text-slate-400">· géré par {a.dossier.negociateur}</span>}</div>
                    <div className="truncate text-xs text-slate-500">🔎 {resumeRecherche(a.dossier)}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {a.dossier.tel && <a href={`tel:${a.dossier.tel}`} className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-bold text-white transition hover:brightness-110" title={`Appeler ${a.dossier.tel}`}>📞</a>}
                    {a.dossier.email && <a href={`mailto:${a.dossier.email}`} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-500 transition hover:bg-slate-100" title="Email">✉</a>}
                  </div>
                </div>
              );
            })}
            {o.acqs.length > lim && <button onClick={() => setLim((n) => n + 40)} className="mt-3 w-full rounded-xl border border-slate-200 bg-white py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">Afficher plus ({o.acqs.length - lim})</button>}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
