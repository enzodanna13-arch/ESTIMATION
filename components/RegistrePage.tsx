"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addAppel,
  chargerSeed,
  deleteAppel,
  listAppels,
  REGISTRE_COLONNES,
  type AppelEntry,
} from "@/lib/registre";

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-copper focus:ring-2 focus:ring-copper/30";

// Entrée affichée : soit historique (seed, non modifiable), soit saisie (news)
type Ligne = AppelEntry & { _seed?: boolean; _key: string };

const champsVides = {
  date: "", jour: "", origine: "appel entrant", destinataire: "", nom: "", telephone: "",
  mail: "", refBien: "", message: "", traitement: "", finalise: "",
};

// AAAA-MM-JJ → JJ/MM/AAAA (pour l'affichage), sinon renvoie tel quel
function formatDate(d?: string): string {
  if (!d) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : d;
}

// Ordre chronologique des mois pour le tri (le plus récent en premier)
const MOIS_ORDRE = ["JANVIER", "FEVRIER", "FÉVRIER", "MARS", "AVRIL", "MAI", "JUIN", "JUILLET", "AOUT", "AOÛT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DECEMBRE", "DÉCEMBRE"];
// Noms « propres » des 12 mois pour créer un nouveau mois
const MOIS_NOMS = ["JANVIER", "FEVRIER", "MARS", "AVRIL", "MAI", "JUIN", "JUILLET", "AOUT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DECEMBRE"];
function rangMois(m: string): number {
  const up = m.toUpperCase();
  const annee = parseInt((up.match(/20\d\d/) ?? ["0"])[0], 10);
  const idx = MOIS_ORDRE.findIndex((x) => up.startsWith(x));
  return annee * 100 + (idx < 0 ? 0 : idx);
}

function csvEchappe(v: string): string {
  return /[";\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export default function RegistrePage({ onRetour }: { onRetour: () => void }) {
  const [seed, setSeed] = useState<Omit<AppelEntry, "id" | "createdAt">[]>([]);
  const [news, setNews] = useState<AppelEntry[]>([]);
  const [chargement, setChargement] = useState(true);
  const [moisActif, setMoisActif] = useState<string>("");
  const [q, setQ] = useState("");
  const [aTraiter, setATraiter] = useState(false);
  const [form, setForm] = useState({ ...champsVides });
  const [envoi, setEnvoi] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formOuvert, setFormOuvert] = useState(false);
  const [apercu, setApercu] = useState<Ligne | null>(null); // fiche détail (notes complètes)
  const [copie, setCopie] = useState<string | null>(null); // clé de la ligne copiée
  const [page, setPage] = useState(1); // pagination du tableau
  const [moisAjoutes, setMoisAjoutes] = useState<string[]>([]); // mois créés à la main
  const [ajoutMoisOuvert, setAjoutMoisOuvert] = useState(false);
  const [nouveauMoisNom, setNouveauMoisNom] = useState("");
  const [nouveauMoisAnnee, setNouveauMoisAnnee] = useState("");

  useEffect(() => {
    (async () => {
      const [s, n] = await Promise.all([chargerSeed(), listAppels()]);
      setSeed(s.entrees);
      setNews(n);
      setChargement(false);
    })();
  }, []);

  // Toutes les lignes (historique + saisies) normalisées
  const toutes: Ligne[] = useMemo(() => {
    const a: Ligne[] = seed.map((e, i) => ({ ...(e as AppelEntry), _seed: true, _key: `s${i}` }));
    const b: Ligne[] = news.map((e) => ({ ...e, _key: e.id }));
    return [...a, ...b];
  }, [seed, news]);

  // Liste des mois (récent → ancien), incluant les mois ajoutés à la main
  const mois = useMemo(() => {
    const set = new Set<string>();
    for (const l of toutes) if (l.mois) set.add(l.mois.toUpperCase());
    for (const m of moisAjoutes) set.add(m.toUpperCase());
    return [...set].sort((x, y) => rangMois(y) - rangMois(x));
  }, [toutes, moisAjoutes]);

  // Mois actif par défaut = le plus récent
  useEffect(() => {
    if (!moisActif && mois.length) setMoisActif(mois[0]);
  }, [mois, moisActif]);

  const recherche = q.trim().toLowerCase();
  const lignesAffichees = useMemo(() => {
    let base = toutes;
    if (recherche) {
      base = base.filter((l) =>
        [l.nom, l.telephone, l.mail, l.refBien, l.message, l.destinataire, l.origine, l.traitement, l.jour, l.mois]
          .join(" ")
          .toLowerCase()
          .includes(recherche),
      );
    } else {
      base = base.filter((l) => l.mois?.toUpperCase() === moisActif);
    }
    if (aTraiter) base = base.filter((l) => !l.traitement.trim() && !l.finalise.trim());
    // Les appels les plus récents (les derniers consignés) remontent en haut :
    // le fichier est en ordre chronologique croissant, donc on l'inverse.
    return [...base].reverse();
  }, [toutes, recherche, moisActif, aTraiter]);

  // Pagination : 50 appels par page pour ne pas avoir une page interminable
  const PAR_PAGE = 50;
  const totalPages = Math.max(1, Math.ceil(lignesAffichees.length / PAR_PAGE));
  const pageSure = Math.min(page, totalPages);
  const visibles = lignesAffichees.slice((pageSure - 1) * PAR_PAGE, pageSure * PAR_PAGE);
  // Revenir à la page 1 quand on change de mois / recherche / filtre
  useEffect(() => {
    setPage(1);
  }, [moisActif, recherche, aTraiter]);

  const set = (k: keyof typeof champsVides, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const enregistrer = async () => {
    if (!form.nom.trim() && !form.message.trim() && !form.telephone.trim()) {
      setMessage("Renseignez au moins le nom, le téléphone ou le message.");
      return;
    }
    setEnvoi(true);
    setMessage(null);
    const entry: AppelEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      mois: moisActif || mois[0] || "",
      ...form,
    };
    const ok = await addAppel(entry);
    setEnvoi(false);
    if (ok) {
      setNews((p) => [...p, entry]);
      setForm({ ...champsVides });
      setMessage("✓ Appel enregistré.");
      setTimeout(() => setMessage(null), 2500);
    } else {
      setMessage("Enregistrement impossible — réessayez.");
    }
  };

  const supprimer = async (l: Ligne) => {
    if (l._seed) return;
    if (!confirm("Supprimer cet appel ?")) return;
    const ok = await deleteAppel(l.mois, l.id);
    if (ok) setNews((p) => p.filter((e) => e.id !== l.id));
  };

  // Créer un nouveau mois (onglet) et s'y positionner
  const ajouterMois = () => {
    const nom = nouveauMoisNom.trim().toUpperCase();
    const annee = nouveauMoisAnnee.trim();
    if (!nom || !/^\d{4}$/.test(annee)) return;
    const cle = `${nom} ${annee}`;
    if (!mois.includes(cle)) setMoisAjoutes((p) => [...p, cle]);
    setMoisActif(cle);
    setAjoutMoisOuvert(false);
    setNouveauMoisNom("");
    setNouveauMoisAnnee("");
    setFormOuvert(true); // ouvrir directement la saisie d'un appel
  };

  // Texte lisible d'un appel (pour copier une ligne en un clic)
  const ligneEnTexte = (l: Ligne): string =>
    [
      ["Date", formatDate(l.date) || l.jour],
      ["Mois", l.mois],
      ["Origine", l.origine],
      ["Destinataire", l.destinataire],
      ["Nom", l.nom],
      ["Téléphone", l.telephone],
      ["Mail", l.mail],
      ["Réf. bien", l.refBien],
      ["Message", l.message],
      ["Traitement", l.traitement],
      ["Finalisé", l.finalise],
    ]
      .filter(([, v]) => v && v.trim())
      .map(([k, v]) => `${k} : ${v}`)
      .join("\n");

  const copierLigne = async (l: Ligne) => {
    try {
      await navigator.clipboard.writeText(ligneEnTexte(l));
      setCopie(l._key);
      setTimeout(() => setCopie((c) => (c === l._key ? null : c)), 1800);
    } catch {
      /* presse-papiers indisponible */
    }
  };

  const exporter = (portee: "mois" | "tout") => {
    const lignes = portee === "tout" ? toutes : toutes.filter((l) => l.mois?.toUpperCase() === moisActif);
    const enTete = ["Mois", ...REGISTRE_COLONNES.map((c) => c.label)];
    const corps = lignes.map((l) =>
      [l.mois, ...REGISTRE_COLONNES.map((c) => String(l[c.cle] ?? ""))].map(csvEchappe).join(";"),
    );
    const csv = "﻿" + [enTete.join(";"), ...corps].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = portee === "tout" ? "registre-des-appels.csv" : `registre-${moisActif.replace(/\s+/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3 print:hidden">
        <button
          type="button"
          onClick={onRetour}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          ← Accueil
        </button>
        <h2 className="text-2xl font-bold text-navy">📞 Registre des appels</h2>
      </div>

      {chargement ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">Chargement du registre…</div>
      ) : (
        <>
          {/* Barre d'outils */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <input
              className={`${inputCls} max-w-xs flex-1`}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="🔍 Rechercher (nom, tél, réf, message…)"
            />
            <label className="flex items-center gap-1.5 text-sm text-slate-600">
              <input type="checkbox" checked={aTraiter} onChange={(e) => setATraiter(e.target.checked)} />
              À traiter uniquement
            </label>
            <div className="ml-auto flex items-center gap-2">
              <button type="button" onClick={() => exporter("mois")} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100">
                ⬇ Exporter ce mois
              </button>
              <button type="button" onClick={() => exporter("tout")} className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-navy-deep">
                ⬇ Exporter tout (Excel/CSV)
              </button>
            </div>
          </div>

          {/* Onglets mois (masqués en recherche) */}
          {!recherche && (
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              {mois.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMoisActif(m)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${m === moisActif ? "bg-copper text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`}
                >
                  {m}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAjoutMoisOuvert(!ajoutMoisOuvert)}
                className="rounded-full border border-dashed border-copper px-3 py-1 text-xs font-bold text-copper transition hover:bg-copper-soft/40"
                title="Créer un nouveau mois"
              >
                + Mois
              </button>
            </div>
          )}

          {/* Sélecteur de nouveau mois */}
          {!recherche && ajoutMoisOuvert && (
            <div className="mb-3 flex flex-wrap items-end gap-2 rounded-xl border border-copper/40 bg-copper-soft/30 p-3">
              <label className="text-xs font-semibold text-slate-600">
                Mois
                <select className={`${inputCls} mt-1`} value={nouveauMoisNom} onChange={(e) => setNouveauMoisNom(e.target.value)}>
                  <option value="">— choisir —</option>
                  {MOIS_NOMS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Année
                <input type="number" min="2020" max="2100" className={`${inputCls} mt-1 w-28`} value={nouveauMoisAnnee} onChange={(e) => setNouveauMoisAnnee(e.target.value)} placeholder="2026" />
              </label>
              <button type="button" onClick={ajouterMois} disabled={!nouveauMoisNom || !/^\d{4}$/.test(nouveauMoisAnnee.trim())} className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-navy-deep disabled:opacity-50">
                Créer le mois
              </button>
              <button type="button" onClick={() => setAjoutMoisOuvert(false)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 hover:bg-slate-100">Annuler</button>
            </div>
          )}

          {/* Bouton nouvel appel */}
          <div className="mb-3">
            <button
              type="button"
              onClick={() => setFormOuvert(!formOuvert)}
              className="rounded-lg bg-copper px-4 py-2 text-sm font-bold text-white transition hover:brightness-110"
            >
              {formOuvert ? "× Fermer" : "+ Nouvel appel"}
            </button>
          </div>

          {/* Formulaire d'ajout */}
          {formOuvert && (
            <div className="mb-4 rounded-2xl border border-copper/40 bg-copper-soft/30 p-4">
              <div className="mb-2 text-sm font-bold text-navy">
                Nouvel appel — enregistré dans <span className="uppercase">{moisActif || mois[0]}</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <input type="date" className={inputCls} value={form.date} onChange={(e) => set("date", e.target.value)} title="Date de l'appel" />
                <input className={inputCls} value={form.jour} onChange={(e) => set("jour", e.target.value)} placeholder="Jour (ex. lundi 3)" />
                <select className={inputCls} value={form.origine} onChange={(e) => set("origine", e.target.value)}>
                  {["appel entrant", "appel sortant", "mail", "passage agence", "sms", "autre"].map((o) => <option key={o}>{o}</option>)}
                </select>
                <input className={inputCls} value={form.destinataire} onChange={(e) => set("destinataire", e.target.value)} placeholder="Destinataire (négociateur)" />
                <input className={inputCls} value={form.nom} onChange={(e) => set("nom", e.target.value)} placeholder="Nom de l'appelant" />
                <input className={inputCls} value={form.telephone} onChange={(e) => set("telephone", e.target.value)} placeholder="Téléphone" />
                <input className={inputCls} value={form.mail} onChange={(e) => set("mail", e.target.value)} placeholder="Mail" />
                <input className={inputCls} value={form.refBien} onChange={(e) => set("refBien", e.target.value)} placeholder="Réf. bien" />
                <input className={inputCls} value={form.finalise} onChange={(e) => set("finalise", e.target.value)} placeholder="Finalisé (oui / …)" />
                <textarea className={`${inputCls} sm:col-span-2 lg:col-span-2`} rows={2} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Message / objet de l'appel" />
                <textarea className={`${inputCls} sm:col-span-2 lg:col-span-2`} rows={2} value={form.traitement} onChange={(e) => set("traitement", e.target.value)} placeholder="Traitement de la demande (transmis, rappelé…)" />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button type="button" onClick={enregistrer} disabled={envoi} className="rounded-lg bg-navy px-5 py-2 text-sm font-bold text-white transition hover:bg-navy-deep disabled:opacity-50">
                  {envoi ? "Enregistrement…" : "Enregistrer l'appel"}
                </button>
                {message && <span className="text-xs text-slate-600">{message}</span>}
              </div>
            </div>
          )}

          {/* Compteur + pagination (haut) */}
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-slate-500">
              {recherche ? `${lignesAffichees.length} résultat(s) pour « ${q} »` : `${lignesAffichees.length} appel(s) — ${moisActif}`}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5 text-xs">
                <button type="button" disabled={pageSure <= 1} onClick={() => setPage(1)} className="rounded border border-slate-200 px-2 py-1 text-slate-600 hover:bg-slate-100 disabled:opacity-40" title="Première page">«</button>
                <button type="button" disabled={pageSure <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded border border-slate-200 px-2.5 py-1 font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40">‹ Précédent</button>
                <span className="px-1 font-semibold text-navy">Page {pageSure} / {totalPages}</span>
                <button type="button" disabled={pageSure >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded border border-slate-200 px-2.5 py-1 font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40">Suivant ›</button>
                <button type="button" disabled={pageSure >= totalPages} onClick={() => setPage(totalPages)} className="rounded border border-slate-200 px-2 py-1 text-slate-600 hover:bg-slate-100 disabled:opacity-40" title="Dernière page">»</button>
              </div>
            )}
          </div>

          {/* Tableau (hauteur limitée + en-tête collant : plus besoin de scroller toute la page) */}
          <div className="space-y-2">
            {visibles.map((l) => {
              const aTraiterLigne = !l.traitement.trim() && !l.finalise.trim();
              return (
                <div key={l._key} className={`rounded-xl border p-3 shadow-sm transition hover:shadow-md ${l._seed ? "border-slate-200 bg-white" : "border-copper/40 bg-copper-soft/20"}`}>
                  {/* Ligne 1 : date / origine / négociateur + actions */}
                  <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-md bg-navy px-2 py-0.5 font-semibold text-white">{formatDate(l.date) || l.jour || "—"}</span>
                    {recherche && <span className="rounded-md bg-slate-100 px-2 py-0.5 font-semibold uppercase text-slate-500">{l.mois}</span>}
                    {l.origine && <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">{l.origine}</span>}
                    {l.destinataire && <span className="rounded-md bg-copper-soft px-2 py-0.5 font-semibold text-copper">👤 {l.destinataire}</span>}
                    {aTraiterLigne ? (
                      <span className="rounded-md bg-amber-100 px-2 py-0.5 font-semibold text-amber-700">À traiter</span>
                    ) : l.finalise.trim() ? (
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700">✓ {l.finalise}</span>
                    ) : null}
                    <div className="ml-auto flex items-center gap-1">
                      <button type="button" onClick={() => setApercu(l)} className="rounded px-1.5 py-0.5 text-slate-400 hover:bg-slate-100 hover:text-navy" title="Voir la fiche complète">👁</button>
                      <button type="button" onClick={() => copierLigne(l)} className="rounded px-1.5 py-0.5 text-slate-400 hover:bg-slate-100 hover:text-copper" title="Copier la ligne">{copie === l._key ? "✓" : "📋"}</button>
                      {!l._seed && <button type="button" onClick={() => supprimer(l)} className="rounded px-1.5 py-0.5 text-slate-300 hover:bg-red-50 hover:text-red-600" title="Supprimer">✕</button>}
                    </div>
                  </div>
                  {/* Ligne 2 : nom + coordonnées */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm">
                    {l.nom && <span className="font-bold text-navy">{l.nom}</span>}
                    {l.telephone && <a href={`tel:${l.telephone.replace(/[^0-9+]/g, "")}`} className="text-slate-600 hover:text-copper">📞 {l.telephone}</a>}
                    {l.mail && <a href={`mailto:${l.mail}`} className="text-slate-600 hover:text-copper">✉ {l.mail}</a>}
                    {l.refBien && <span className="text-slate-500">🏠 {l.refBien}</span>}
                  </div>
                  {/* Ligne 3 : message */}
                  {l.message && (
                    <button type="button" onClick={() => setApercu(l)} className="mt-1 line-clamp-2 w-full text-left text-sm text-slate-700 hover:text-copper" title="Voir la note complète">
                      💬 {l.message}
                    </button>
                  )}
                  {/* Ligne 4 : traitement */}
                  {l.traitement.trim() && (
                    <div className="mt-1 line-clamp-1 text-xs text-slate-500">↳ <span className="font-semibold">Traitement :</span> {l.traitement}</div>
                  )}
                </div>
              );
            })}
            {visibles.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center text-slate-400">Aucun appel.</div>
            )}
          </div>

          {/* Pagination (bas) */}
          {totalPages > 1 && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs">
              <button type="button" disabled={pageSure <= 1} onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40">‹ Précédent</button>
              <span className="px-2 font-semibold text-navy">Page {pageSure} / {totalPages}</span>
              <button type="button" disabled={pageSure >= totalPages} onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40">Suivant ›</button>
            </div>
          )}

          <p className="mt-2 text-xs text-slate-400">
            Astuce : {totalPages > 1 ? "naviguez par pages (50 appels/page), " : ""}cliquez sur un message ou sur 👁 pour lire la note complète, et sur 📋 pour copier la ligne. Les
            lignes sur fond cuivré sont les appels saisis dans l&apos;outil (modifiables) ; les autres proviennent de
            l&apos;import de votre registre Excel (lecture seule).
          </p>
        </>
      )}

      {/* Fiche détail d'un appel (notes complètes) */}
      {apercu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/70 p-4 backdrop-blur-sm" onClick={() => setApercu(null)}>
          <div className="max-h-[85vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-bold text-navy">{apercu.nom || "Appel"}</div>
                <div className="text-xs text-slate-500">{[formatDate(apercu.date) || apercu.jour, apercu.mois, apercu.origine].filter(Boolean).join(" · ")}</div>
              </div>
              <button type="button" onClick={() => setApercu(null)} className="rounded-lg border border-slate-200 px-2.5 py-1 text-sm text-slate-500 hover:bg-slate-100">✕</button>
            </div>
            <dl className="space-y-2 text-sm">
              {([
                ["Destinataire", apercu.destinataire],
                ["Téléphone", apercu.telephone],
                ["Mail", apercu.mail],
                ["Réf. bien", apercu.refBien],
                ["Message", apercu.message],
                ["Traitement de la demande", apercu.traitement],
                ["Finalisé", apercu.finalise],
              ] as [string, string][])
                .filter(([, v]) => v && v.trim())
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{k}</dt>
                    <dd className="whitespace-pre-wrap text-slate-800">{v}</dd>
                  </div>
                ))}
            </dl>
            <div className="mt-4 flex items-center gap-2">
              <button type="button" onClick={() => copierLigne(apercu)} className="rounded-lg bg-copper px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110">
                {copie === apercu._key ? "✓ Copié" : "📋 Copier la fiche"}
              </button>
              <button type="button" onClick={() => setApercu(null)} className="rounded-lg border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
