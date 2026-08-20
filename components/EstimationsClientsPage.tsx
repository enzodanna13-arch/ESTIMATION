"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getClientEstimation, listClientEstimations, majClientEstimation, urlPhotoBackoffice,
} from "@/lib/backofficeEstimations";
import { PROJETS_CLIENT, STATUTS_ESTIMATION_CLIENT, type ClientEstimationMeta, type ClientEstimationRecord } from "@/lib/clientTypes";

const euro = (n: number) => (n > 0 ? new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " €" : "—");
const dateFr = (t: number) => new Date(t).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" });
const dateLong = (t: number) => new Date(t).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });

const STATUT_CLS: Record<string, string> = {
  "Nouveau lead": "bg-blue-100 text-blue-700",
  "À appeler": "bg-amber-100 text-amber-700",
  "Appelé": "bg-cyan-100 text-cyan-700",
  "Pas répondu": "bg-orange-100 text-orange-700",
  "À relancer": "bg-yellow-100 text-yellow-700",
  "RDV fixé": "bg-violet-100 text-violet-700",
  "Estimation terrain": "bg-teal-100 text-teal-700",
  "Mandat obtenu": "bg-green-100 text-green-700",
  "Perdu": "bg-red-100 text-red-600",
};
const badge = (s: string) => STATUT_CLS[s] ?? "bg-slate-100 text-slate-600";

export default function EstimationsClientsPage({ onRetour }: { onRetour: () => void }) {
  const [liste, setListe] = useState<ClientEstimationMeta[]>([]);
  const [chargement, setChargement] = useState(true);
  const [q, setQ] = useState("");
  const [fStatut, setFStatut] = useState("");
  const [fProjet, setFProjet] = useState("");
  const [ouvert, setOuvert] = useState<ClientEstimationRecord | null>(null);
  const [ouvertLoading, setOuvertLoading] = useState(false);

  const recharger = async () => {
    setChargement(true);
    setListe(await listClientEstimations());
    setChargement(false);
  };
  useEffect(() => { void recharger(); }, []);

  const ouvrir = async (id: string) => {
    setOuvertLoading(true);
    const rec = await getClientEstimation(id);
    setOuvert(rec);
    setOuvertLoading(false);
  };

  const filtres = useMemo(() => {
    const t = q.trim().toLowerCase();
    return liste.filter((e) => {
      if (fStatut && e.statut !== fStatut) return false;
      if (fProjet && e.projet !== fProjet) return false;
      if (t && ![e.prenom, e.nom, e.ville, e.tel, e.email].some((v) => (v ?? "").toLowerCase().includes(t))) return false;
      return true;
    });
  }, [liste, q, fStatut, fProjet]);

  const kpi = useMemo(() => {
    const now = Date.now();
    const jour = now - 24 * 3600 * 1000, sem = now - 7 * 24 * 3600 * 1000, mois = now - 30 * 24 * 3600 * 1000;
    const dep = (t: number) => liste.filter((e) => e.createdAt >= t);
    const jJour = dep(jour), jSem = dep(sem), jMois = dep(mois);
    const st = (arr: ClientEstimationMeta[], s: string) => arr.filter((e) => e.statut === s).length;
    const rdvMois = st(jMois, "RDV fixé"), mandatMois = st(jMois, "Mandat obtenu");
    return {
      jourNb: jJour.length,
      aAppeler: liste.filter((e) => e.statut === "À appeler" || e.statut === "Nouveau lead").length,
      semNb: jSem.length,
      moisNb: jMois.length,
      rdvMois, mandatMois,
      tauxRdv: jMois.length ? Math.round((rdvMois / jMois.length) * 100) : 0,
      tauxMandat: jMois.length ? Math.round((mandatMois / jMois.length) * 100) : 0,
    };
  }, [liste]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button onClick={onRetour} className="mb-2 text-sm text-slate-500 hover:text-navy">← Accueil</button>
          <h1 className="text-2xl font-bold text-navy">Estimations clients</h1>
          <p className="text-sm text-slate-500">Les estimations réalisées par les particuliers sur le site public.</p>
        </div>
        <button onClick={recharger} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:border-copper">↻ Actualiser</button>
      </div>

      {/* KPI */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Aujourd'hui" value={kpi.jourNb} sub="nouvelles estimations" />
        <Kpi label="À appeler" value={kpi.aAppeler} sub="leads en attente" accent />
        <Kpi label="30 jours — RDV" value={kpi.rdvMois} sub={`${kpi.tauxRdv}% des estimations`} />
        <Kpi label="30 jours — Mandats" value={kpi.mandatMois} sub={`${kpi.tauxMandat}% des estimations`} />
      </div>

      {/* Filtres */}
      <div className="mb-4 flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher (nom, ville, téléphone…)" className="min-w-[220px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={fStatut} onChange={(e) => setFStatut(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">Tous les statuts</option>
          {STATUTS_ESTIMATION_CLIENT.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={fProjet} onChange={(e) => setFProjet(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">Tous les projets</option>
          {PROJETS_CLIENT.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Date</th><th className="px-4 py-3">Client</th><th className="px-4 py-3">Téléphone</th>
              <th className="px-4 py-3">Ville</th><th className="px-4 py-3">Bien</th><th className="px-4 py-3">Estimation</th>
              <th className="px-4 py-3">Projet</th><th className="px-4 py-3">Statut</th><th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {chargement ? (
              <tr><td colSpan={9} className="px-4 py-10 text-center text-slate-400">Chargement…</td></tr>
            ) : filtres.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-10 text-center text-slate-400">Aucune estimation client pour le moment.</td></tr>
            ) : filtres.map((e) => (
              <tr key={e.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-500">{dateFr(e.createdAt)}</td>
                <td className="px-4 py-3 font-medium text-navy">{e.prenom} {e.nom}{e.souhaiteRappel && <span title="Souhaite être rappelé" className="ml-1 text-copper">●</span>}</td>
                <td className="px-4 py-3">{e.tel}</td>
                <td className="px-4 py-3">{e.ville}</td>
                <td className="px-4 py-3 text-slate-600">{e.typeBien === "maison" ? "Maison" : "Appart."} {e.surfaceHabitable ? `${e.surfaceHabitable} m²` : ""}</td>
                <td className="px-4 py-3 font-semibold text-navy">{euro(e.prixEstime)}</td>
                <td className="px-4 py-3 text-slate-600">{e.projet || "—"}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge(e.statut)}`}>{e.statut}</span></td>
                <td className="px-4 py-3"><button onClick={() => ouvrir(e.id)} className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-deep">Ouvrir</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(ouvert || ouvertLoading) && (
        <Fiche
          record={ouvert}
          loading={ouvertLoading}
          onClose={() => setOuvert(null)}
          onChange={(rec) => { setOuvert(rec); void recharger(); }}
        />
      )}
    </div>
  );
}

function Kpi({ label, value, sub, accent }: { label: string; value: number; sub: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? "border-copper/40 bg-copper/5" : "border-slate-200 bg-white"}`}>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-3xl font-bold text-navy">{value}</div>
      <div className="text-xs text-slate-400">{sub}</div>
    </div>
  );
}

function Fiche({ record, loading, onClose, onChange }: {
  record: ClientEstimationRecord | null; loading: boolean; onClose: () => void; onChange: (r: ClientEstimationRecord) => void;
}) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [copie, setCopie] = useState(false);

  const lienDossier = record ? `${typeof window !== "undefined" ? window.location.origin : ""}/estimation/resultat/${record.token}` : "";
  const copierLien = async () => {
    try { await navigator.clipboard.writeText(lienDossier); setCopie(true); setTimeout(() => setCopie(false), 2000); } catch { /* ignore */ }
  };
  const transmettre = async () => {
    if (!record) return;
    setBusy(true);
    const r = await majClientEstimation(record.id, { transmettre: true });
    if (r) onChange(r);
    setBusy(false);
  };

  const changerStatut = async (statut: string) => {
    if (!record) return;
    setBusy(true);
    const r = await majClientEstimation(record.id, { statut });
    if (r) onChange(r);
    setBusy(false);
  };
  const ajouterNote = async () => {
    if (!record || !note.trim()) return;
    setBusy(true);
    const r = await majClientEstimation(record.id, { ajouterNote: note });
    if (r) { onChange(r); setNote(""); }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div className="h-full w-full max-w-2xl overflow-y-auto bg-slate-50 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {loading || !record ? (
          <div className="p-10 text-center text-slate-400">Chargement de la fiche…</div>
        ) : (
          <div className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-navy">{record.input.prenom} {record.input.nom}</h2>
                <p className="text-sm text-slate-500">{record.input.tel} · {record.input.email}</p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-navy">✕</button>
            </div>

            {/* Statut */}
            <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">Statut commercial</div>
              <div className="flex flex-wrap gap-2">
                {STATUTS_ESTIMATION_CLIENT.map((s) => (
                  <button key={s} disabled={busy} onClick={() => changerStatut(s)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${record.statut === s ? badge(s) + " ring-2 ring-navy/30" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                    {s}
                  </button>
                ))}
              </div>
              {record.input.souhaiteRappel && <p className="mt-3 text-sm font-medium text-copper">● Le client souhaite être rappelé.</p>}
            </div>

            {/* Projet & bien */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              <Info label="Projet" value={record.input.projet || "—"} />
              <Info label="Source" value={record.marketing?.utm_campaign || record.marketing?.origin || "Site — Estimation en ligne"} />
              <Info label="Bien" value={`${record.input.typeBien === "maison" ? "Maison" : "Appartement"} · ${record.input.surfaceHabitable ?? "?"} m²`} />
              <Info label="Localisation" value={`${record.input.adresse ? record.input.adresse + ", " : ""}${record.input.ville}`} />
              <Info label="Pièces / chambres" value={`${record.input.nbPieces ?? "?"} / ${record.input.nbChambres ?? "?"}`} />
              <Info label="État" value={record.input.etat || "—"} />
            </div>

            {/* Estimation */}
            <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="text-xs uppercase tracking-wide text-slate-500">Estimation (dossier IA)</div>
                {record.report.prix_estime > 0 && (
                  <a href={`/estimations-clients/dossier/${record.id}`} className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-deep">📄 Ouvrir le dossier (PDF)</a>
                )}
              </div>
              {record.report.prix_estime > 0 ? (
                <>
                  <div className="text-3xl font-bold text-navy">{euro(record.report.prix_estime)}</div>
                  <div className="text-sm text-slate-500">Fourchette {euro(record.report.fourchette_basse)} — {euro(record.report.fourchette_haute)}{record.report.prix_m2 > 0 ? ` · ${euro(record.report.prix_m2)}/m²` : ""}</div>
                  <div className="mt-2 flex gap-3 text-xs text-slate-500">
                    <span>Confiance {record.report.indice_confiance}/100</span>
                    <span>Complétude {record.completude}%</span>
                    {record.report.fiabilite && <span>Fiabilité {record.report.fiabilite}</span>}
                  </div>
                </>
              ) : (
                <p className="text-sm text-amber-700">Analyse automatique indisponible — à traiter manuellement.</p>
              )}
            </div>

            {/* Transmission au client */}
            <div className={`mb-4 rounded-xl border p-4 ${record.transmisAuClient ? "border-green-300 bg-green-50" : "border-copper/40 bg-copper/5"}`}>
              <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">Remise du dossier</div>
              {record.transmisAuClient ? (
                <p className="text-sm font-medium text-green-700">✓ Dossier transmis au client{record.envoyeLe ? ` le ${dateLong(record.envoyeLe)}` : ""}.</p>
              ) : (
                <>
                  <p className="mb-3 text-sm text-slate-600">Le client attend son estimation sous 3h. <b>Appelez-le</b>, puis envoyez-lui le dossier par mail.</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <a href={`tel:${record.input.tel}`} className="rounded-lg bg-navy px-3 py-2 text-sm font-semibold text-white hover:bg-navy-deep">📞 Appeler {record.input.tel}</a>
                    <a href={`mailto:${record.input.email}?subject=${encodeURIComponent("Votre estimation — Century 21 Icaza")}&body=${encodeURIComponent(`Bonjour ${record.input.prenom},\n\nSuite à votre demande, voici votre dossier d'estimation :\n${lienDossier}\n\nJe reste à votre disposition.\nCentury 21 Icaza Immobilier`)}`} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:border-copper">📩 Écrire à {record.input.email}</a>
                    <button onClick={copierLien} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:border-copper">{copie ? "✓ Lien copié" : "Copier le lien du dossier"}</button>
                  </div>
                  <button disabled={busy} onClick={transmettre} className="mt-3 w-full rounded-lg bg-copper px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-40">
                    Marquer comme transmis (le client pourra consulter son dossier en ligne)
                  </button>
                </>
              )}
            </div>

            {/* Photos */}
            {record.photos.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">Photos ({record.photos.length})</div>
                <div className="grid grid-cols-4 gap-2">
                  {record.photos.map((p) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={p.idx} src={urlPhotoBackoffice(record.id, p.idx)} alt="" className="aspect-square w-full rounded-lg object-cover" loading="lazy" />
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">Notes commerciales</div>
              <div className="mb-3 flex gap-2">
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ajouter une note…" className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" onKeyDown={(e) => { if (e.key === "Enter") void ajouterNote(); }} />
                <button disabled={busy || !note.trim()} onClick={ajouterNote} className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">Ajouter</button>
              </div>
              <div className="space-y-2">
                {[...record.notes].reverse().map((n) => (
                  <div key={n.id} className="rounded-lg bg-slate-50 p-2 text-sm">
                    <div className="text-slate-700">{n.texte}</div>
                    <div className="text-xs text-slate-400">{n.auteur} · {dateLong(n.date)}</div>
                  </div>
                ))}
                {record.notes.length === 0 && <p className="text-sm text-slate-400">Aucune note.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-slate-700">{value}</div>
    </div>
  );
}
