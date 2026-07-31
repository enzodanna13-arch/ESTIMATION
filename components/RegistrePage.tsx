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

  // Liste des mois (récent → ancien)
  const mois = useMemo(() => {
    const set = new Set<string>();
    for (const l of toutes) if (l.mois) set.add(l.mois.toUpperCase());
    return [...set].sort((x, y) => rangMois(y) - rangMois(x));
  }, [toutes]);

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
    return base;
  }, [toutes, recherche, moisActif, aTraiter]);

  const PLAFOND = 600;
  const tronque = lignesAffichees.length > PLAFOND;
  const visibles = tronque ? lignesAffichees.slice(0, PLAFOND) : lignesAffichees;

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
            <div className="mb-3 flex flex-wrap gap-1.5">
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

          {/* Compteur */}
          <div className="mb-2 text-xs text-slate-500">
            {recherche ? `${lignesAffichees.length} résultat(s) pour « ${q} »` : `${lignesAffichees.length} appel(s) — ${moisActif}`}
            {tronque && ` (affichage des ${PLAFOND} premiers — affinez la recherche ou exportez pour tout voir)`}
          </div>

          {/* Tableau */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  {recherche && <th className="px-2 py-2 font-semibold">Mois</th>}
                  {REGISTRE_COLONNES.map((c) => (
                    <th key={c.cle} className="px-2 py-2 font-semibold">{c.label}</th>
                  ))}
                  <th className="px-2 py-2" />
                </tr>
              </thead>
              <tbody>
                {visibles.map((l) => (
                  <tr key={l._key} className={`border-t border-slate-100 align-top ${l._seed ? "" : "bg-copper-soft/20"}`}>
                    {recherche && <td className="px-2 py-1.5 whitespace-nowrap text-[10px] uppercase text-slate-400">{l.mois}</td>}
                    <td className="px-2 py-1.5 whitespace-nowrap">{formatDate(l.date)}</td>
                    <td className="px-2 py-1.5 whitespace-nowrap">{l.jour}</td>
                    <td className="px-2 py-1.5 whitespace-nowrap">{l.origine}</td>
                    <td className="px-2 py-1.5 whitespace-nowrap font-medium">{l.destinataire}</td>
                    <td className="px-2 py-1.5">{l.nom}</td>
                    <td className="px-2 py-1.5 whitespace-nowrap">{l.telephone}</td>
                    <td className="px-2 py-1.5">{l.mail}</td>
                    <td className="px-2 py-1.5">{l.refBien}</td>
                    <td className="px-2 py-1.5 min-w-[220px] max-w-[340px]">
                      {l.message ? (
                        <button type="button" onClick={() => setApercu(l)} className="line-clamp-2 text-left text-slate-700 hover:text-copper" title="Voir la note complète">
                          {l.message}
                        </button>
                      ) : null}
                    </td>
                    <td className="px-2 py-1.5 min-w-[140px] max-w-[240px]"><span className="line-clamp-2">{l.traitement}</span></td>
                    <td className="px-2 py-1.5 whitespace-nowrap">{l.finalise}</td>
                    <td className="px-2 py-1.5">
                      <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                        <button type="button" onClick={() => setApercu(l)} className="rounded px-1.5 py-0.5 text-slate-400 hover:bg-slate-100 hover:text-navy" title="Voir la fiche complète">👁</button>
                        <button type="button" onClick={() => copierLigne(l)} className="rounded px-1.5 py-0.5 text-slate-400 hover:bg-slate-100 hover:text-copper" title="Copier la ligne">
                          {copie === l._key ? "✓" : "📋"}
                        </button>
                        {!l._seed && (
                          <button type="button" onClick={() => supprimer(l)} className="rounded px-1.5 py-0.5 text-slate-300 hover:bg-red-50 hover:text-red-600" title="Supprimer">✕</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {visibles.length === 0 && (
                  <tr><td colSpan={13} className="px-4 py-8 text-center text-slate-400">Aucun appel.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Astuce : cliquez sur un message ou sur 👁 pour lire la note complète, et sur 📋 pour copier la ligne. Les
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
