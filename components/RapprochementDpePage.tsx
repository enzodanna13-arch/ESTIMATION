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

export default function RapprochementDpePage({ onRetour }: { onRetour: () => void }) {
  const [clients, setClients] = useState<ClientDossier[]>([]);
  const [ds, setDs] = useState<DpeFraisDataset | null>(null);
  const [chargement, setChargement] = useState(true);
  const [maj, setMaj] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [niveauMin, setNiveauMin] = useState<"forte" | "interessante" | "possible">("interessante");
  const [q, setQ] = useState("");
  const [limite, setLimite] = useState(30);

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
      ) : (
        <>
          <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {[["Opportunités", nf.format(opportunites.length)], ["Acquéreurs actifs", nf.format(acquereurs.length)], ["DPE frais (3 mois)", nf.format(ds.dpes.length)], ["Mis à jour", new Date(ds.updatedAt).toLocaleDateString("fr-FR")]].map(([l, v]) => (
              <div key={l} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center"><div className="text-lg font-bold text-navy">{v}</div><div className="text-[10px] text-slate-500">{l}</div></div>
            ))}
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
          ) : (
            <div className="space-y-2.5">
              {filtrees.slice(0, limite).map((o) => <CarteOpp key={o.dpe.numeroDpe} o={o} />)}
            </div>
          )}
          {filtrees.length > limite && (
            <button onClick={() => setLimite((n) => n + 30)} className="mt-3 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50">Afficher plus ({filtrees.length - limite} restant(s))</button>
          )}
        </>
      )}
    </div>
  );
}

function CarteOpp({ o }: { o: OpportuniteDpe }) {
  const d = o.dpe;
  const localise = d.etage !== "" || d.residence;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-copper/15 px-2 py-0.5 text-[11px] font-bold text-copper">DPE {dateFr(d.date)}</span>
            <span className={`rounded-md px-2 py-0.5 text-xs font-black ${badgeDpe(d.etiquetteDpe)}`}>{d.etiquetteDpe || "?"}</span>
            <h3 className="text-base font-bold text-navy">{d.typeBien}{d.surface ? ` · ${d.surface} m²` : ""}</h3>
          </div>
          <div className="text-sm text-slate-600">{d.adresse}{d.ville ? ` · ${d.ville}` : ""}</div>
          {localise && <div className="mt-0.5 text-[13px] font-semibold text-copper">📍 {d.etage !== "" ? `Étage ${d.etage === "0" ? "RDC" : d.etage}` : d.residence}</div>}
        </div>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">{o.acqs.length} acquéreur(s)</span>
      </div>
      <div className="mt-2 space-y-1.5 border-t border-slate-100 pt-2">
        {o.acqs.map((a) => {
          const badge = a.niveau === "forte" ? "bg-emerald-100 text-emerald-700" : a.niveau === "interessante" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600";
          return (
            <div key={a.dossier.id} className="flex flex-wrap items-center gap-2 text-sm">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badge}`}>{a.score}%</span>
              <span className="font-bold text-navy">{[a.dossier.prenom, a.dossier.nom].filter(Boolean).join(" ") || a.dossier.nom}</span>
              <span className="text-xs text-slate-500">{resumeRecherche(a.dossier)}</span>
              {a.dossier.negociateur && <span className="text-[11px] text-slate-400">· 👤 {a.dossier.negociateur}</span>}
              <span className="ml-auto flex items-center gap-1">
                {a.dossier.tel && <a href={`tel:${a.dossier.tel}`} className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100" title="Appeler">📞</a>}
                {a.dossier.email && <a href={`mailto:${a.dossier.email}`} className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100" title="Email">✉</a>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
