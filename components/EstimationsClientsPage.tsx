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

const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Génère le dossier d'estimation complet en un document imprimable (→ « Enregistrer
// en PDF ») et l'ouvre en un clic. Les photos passent par l'URL PUBLIQUE par token
// (pas d'en-tête d'authentification, donc affichables dans la fenêtre d'impression).
function telechargerDossier(record: ClientEstimationRecord) {
  const r = record.report;
  const b = record.input;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const para = (t: string) => esc(t).split("\n").filter(Boolean).map((p) => `<p>${p}</p>`).join("");
  const photos = record.photos.length
    ? `<h2>Photographies du bien</h2><div class="ph">${record.photos.map((p) => `<img src="${origin}/api/client/estimation/${encodeURIComponent(record.token)}/photo/${p.idx}" alt="">`).join("")}</div>`
    : "";
  const refs = r.references_dvf.length
    ? `<h2>Références comparables (ventes réelles DVF)</h2><table><thead><tr><th>Localisation</th><th>Détail</th><th>Date</th><th>Prix</th><th>€/m²</th></tr></thead><tbody>${r.references_dvf.map((x) => `<tr><td>${esc(x.localisation)}</td><td>${esc(x.detail)}</td><td>${esc(x.date)}</td><td class="num">${euro(x.prix)}</td><td class="num">${new Intl.NumberFormat("fr-FR").format(x.prix_m2)}</td></tr>`).join("")}</tbody></table>`
    : "";
  const forts = r.points_forts.length ? `<div class="col"><h3>Points forts</h3><ul>${r.points_forts.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>` : "";
  const faibles = r.points_faibles.length ? `<div class="col"><h3>Points de vigilance</h3><ul>${r.points_faibles.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>` : "";

  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>Dossier d'estimation — ${esc(b.prenom)} ${esc(b.nom)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root{--gold:#8c7233;--ink:#17130d;--soft:#4c463b;--line:#e3dac6;--paper:#f7f4ec}
  *{box-sizing:border-box}body{margin:0;font-family:"Manrope",system-ui,sans-serif;color:var(--ink);background:#fff;line-height:1.6}
  .page{max-width:820px;margin:0 auto;padding:44px 48px}
  h1,h2,h3,.serif{font-family:"Fraunces",Georgia,serif;font-weight:400}
  .cover{background:var(--paper);border:1px solid var(--line);border-radius:8px;padding:40px;margin-bottom:30px;text-align:center}
  .cover .c21{letter-spacing:.12em;color:var(--gold);font-size:15px;font-family:"Fraunces",serif}
  .cover h1{font-size:34px;margin:14px 0 8px}
  .cover .sub{color:var(--soft);font-size:15px}
  .val{text-align:center;margin:26px 0}
  .val .big{font-family:"Fraunces",serif;font-size:52px;line-height:1}
  .val .rng{color:var(--soft);margin-top:10px;font-size:16px}
  .val .m2{color:var(--gold);font-size:14px;margin-top:2px}
  h2{font-size:20px;border-bottom:1px solid var(--line);padding-bottom:8px;margin:30px 0 14px}
  h3{font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--gold);margin:0 0 8px}
  p{margin:0 0 10px;color:var(--soft)}
  table{width:100%;border-collapse:collapse;font-size:13px;margin-top:6px}
  th{text-align:left;color:#8a7f66;font-size:11px;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--line);padding:6px 8px}
  td{padding:7px 8px;border-bottom:1px solid var(--line)}.num{text-align:right;font-variant-numeric:tabular-nums}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:24px}
  .bien{display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:14px}
  .bien div{border-bottom:1px solid var(--line);padding:6px 0;display:flex;justify-content:space-between}
  .bien span{color:#8a7f66}
  ul{margin:0;padding-left:18px}li{color:var(--soft);font-size:14px;margin-bottom:4px}
  .ph{display:grid;grid-template-columns:1fr 1fr;gap:10px}.ph img{width:100%;border-radius:6px;border:1px solid var(--line)}
  .avert{border:1px dashed var(--line);border-radius:8px;padding:16px 18px;margin-top:26px;font-size:12.5px;color:#8a7f66}
  .foot{text-align:center;color:#8a7f66;font-size:12px;margin-top:26px}
  @media print{.page{padding:0}.cover,h2,table,.ph,.avert{break-inside:avoid}}
</style></head><body onload="setTimeout(function(){window.print()},400)">
<div class="page">
  <div class="cover"><div class="c21">CENTURY 21 · Icaza Immobilier</div><h1>Dossier d'estimation</h1>
    <div class="sub">${esc(b.adresse ? b.adresse + ", " : "")}${esc(b.ville)} — ${b.typeBien === "maison" ? "Maison" : "Appartement"} · ${b.surfaceHabitable ?? "?"} m²<br>Établi pour ${esc(b.prenom)} ${esc(b.nom)} · ${new Date(record.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</div>
  </div>
  <div class="val"><div class="big">${euro(r.prix_estime)}</div><div class="rng">Fourchette : ${euro(r.fourchette_basse)} — ${euro(r.fourchette_haute)}</div>${r.prix_m2 > 0 ? `<div class="m2">≈ ${euro(r.prix_m2)} / m²${r.fiabilite ? ` · fiabilité ${esc(r.fiabilite)}` : ""}</div>` : ""}</div>
  <h2>Votre bien</h2>
  <div class="bien">
    <div><span>Adresse</span><b>${esc(b.adresse ? b.adresse + ", " + b.ville : b.ville)}</b></div>
    <div><span>Type</span><b>${b.typeBien === "maison" ? "Maison" : "Appartement"}</b></div>
    <div><span>Surface</span><b>${b.surfaceHabitable ?? "—"} m²</b></div>
    ${b.surfaceTerrain ? `<div><span>Terrain</span><b>${b.surfaceTerrain} m²</b></div>` : ""}
    <div><span>Pièces / chambres</span><b>${b.nbPieces ?? "—"} / ${b.nbChambres ?? "—"}</b></div>
    <div><span>État</span><b>${esc(b.etat) || "—"}</b></div>
  </div>
  ${r.description_bien ? `<h2>Analyse de votre bien</h2>${para(r.description_bien)}` : ""}
  ${forts || faibles ? `<div class="grid2">${forts}${faibles}</div>` : ""}
  ${r.analyse_dvf || r.positionnement_marche ? `<h2>Analyse du marché</h2>${para(r.analyse_dvf)}${para(r.positionnement_marche)}` : ""}
  ${refs}
  ${r.argumentaire_vendeur ? `<h2>Synthèse</h2>${para(r.argumentaire_vendeur)}` : ""}
  ${photos}
  <div class="avert"><b>Une estimation reste une estimation.</b> Cette analyse constitue une indication de valeur fondée sur les informations fournies et les données disponibles. Certaines caractéristiques particulières peuvent nécessiter l'avis d'un professionnel.</div>
  <div class="foot">CENTURY 21 Icaza Immobilier · 32 avenue de la Paix, 13500 Martigues · 04 42 42 80 85</div>
</div></body></html>`;

  const w = window.open("", "_blank");
  if (!w) { alert("Autorisez les fenêtres pop-up pour télécharger le dossier."); return; }
  w.document.open();
  w.document.write(html);
  w.document.close();
}

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
                  <button onClick={() => telechargerDossier(record)} className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-deep">📄 Télécharger le dossier (PDF)</button>
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
