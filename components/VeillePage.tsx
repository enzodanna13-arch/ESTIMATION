"use client";

import { useEffect, useMemo, useState } from "react";
import { getVeilleZone, getVentesCommune, type AperçuCommune, type VenteZone } from "@/lib/veille";

// Veille de zone de chalandise : le marché ACTÉ (ventes réelles DVF, open
// data) des 9 communes de l'agence. Les annonces en cours de SeLoger /
// Leboncoin ne sont pas accessibles (aucune API ouverte, scraping bloqué) ;
// cette veille s'appuie sur la donnée officielle des transactions.

const eur = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const dateFr = (s: string) => {
  const [a, m, j] = s.split("-");
  return j && m && a ? `${j}/${m}/${a}` : s;
};

export default function VeillePage({ onRetour }: { onRetour: () => void }) {
  const anneeDefaut = new Date().getFullYear() - 1;
  const [annee, setAnnee] = useState(anneeDefaut);
  const [communes, setCommunes] = useState<AperçuCommune[] | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [ouverte, setOuverte] = useState<AperçuCommune | null>(null);
  const [ventes, setVentes] = useState<VenteZone[] | null>(null);
  const [q, setQ] = useState("");
  const [type, setType] = useState<"" | "Appartement" | "Maison">("");

  useEffect(() => {
    setCommunes(null);
    setErreur(null);
    getVeilleZone(annee)
      .then((r) => {
        if (r) setCommunes(r.communes);
        else setErreur("Données DVF momentanément indisponibles — réessayez dans un instant.");
      })
      .catch(() => setErreur("Données DVF indisponibles."));
  }, [annee]);

  const ouvrir = (c: AperçuCommune) => {
    setOuverte(c);
    setVentes(null);
    setQ("");
    setType("");
    getVentesCommune(c.insee, annee).then(setVentes).catch(() => setVentes([]));
  };

  const ventesFiltrees = useMemo(() => {
    if (!ventes) return [];
    const t = q.trim().toLowerCase();
    return ventes.filter(
      (v) => (!type || v.type === type) && (!t || v.adresse.toLowerCase().includes(t)),
    );
  }, [ventes, q, type]);

  const totalVentes = communes?.reduce((s, c) => s + c.nbTotal, 0) ?? 0;

  // ---------- Détail d'une commune ----------
  if (ouverte) {
    return (
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-navy">📡 {ouverte.nom} <span className="text-base font-normal text-slate-400">· {ouverte.cp}</span></h2>
            <p className="text-sm text-slate-500">
              Ventes réelles DVF {ouverte.annee} — {ouverte.nbTotal} transaction{ouverte.nbTotal > 1 ? "s" : ""}
              {ouverte.medAppartM2 ? ` · appart. médian ${eur.format(ouverte.medAppartM2)} €/m²` : ""}
              {ouverte.medMaisonM2 ? ` · maison médiane ${eur.format(ouverte.medMaisonM2)} €/m²` : ""}
            </p>
          </div>
          <button onClick={() => setOuverte(null)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
            ← Toute la zone
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <input className="w-full max-w-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔎 Rechercher une rue…" />
          {(["", "Appartement", "Maison"] as const).map((t) => (
            <button
              key={t || "tous"}
              onClick={() => setType(t)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${type === t ? "bg-copper text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {t || "Tous types"}
            </button>
          ))}
        </div>

        {ventes === null ? (
          <p className="p-4 text-sm text-slate-400">Chargement des ventes…</p>
        ) : ventesFiltrees.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-400">Aucune vente ne correspond.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Adresse</th>
                  <th className="px-4 py-2.5 text-right">Surface</th>
                  <th className="px-4 py-2.5 text-right">Prix</th>
                  <th className="px-4 py-2.5 text-right">€/m²</th>
                </tr>
              </thead>
              <tbody>
                {ventesFiltrees.map((v, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-2 text-slate-500">{dateFr(v.date)}</td>
                    <td className="px-4 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${v.type === "Appartement" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}`}>{v.type}</span>
                    </td>
                    <td className="px-4 py-2 text-slate-700">{v.adresse || "—"}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-right text-slate-600">{v.surface} m²</td>
                    <td className="whitespace-nowrap px-4 py-2 text-right font-semibold text-navy">{eur.format(v.prix)} €</td>
                    <td className="whitespace-nowrap px-4 py-2 text-right text-copper">{v.prixM2 ? `${eur.format(v.prixM2)}` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 text-xs text-slate-400">Source : DVF (Demandes de Valeurs Foncières), open data Etalab — ventes réellement enregistrées, hors ventes de particulier à particulier non publiées.</p>
      </div>
    );
  }

  // ---------- Tableau de bord de la zone ----------
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-navy">📡 Veille de zone</h2>
          <p className="text-sm text-slate-500">Le marché réel de votre zone de chalandise — ventes actées (DVF), commune par commune.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={annee} onChange={(e) => setAnnee(Number(e.target.value))} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700">
            {[anneeDefaut, anneeDefaut - 1, anneeDefaut - 2, anneeDefaut - 3].map((a) => (
              <option key={a} value={a}>Millésime {a}</option>
            ))}
          </select>
          <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
            ← Accueil
          </button>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-800">
        <b>Pourquoi les ventes actées et non les annonces ?</b> SeLoger et Leboncoin n&apos;offrent aucune API ouverte
        et bloquent le scraping automatique (DataDome). La veille s&apos;appuie donc sur la <b>seule source ouverte
        fiable</b> : les transactions réelles DVF (open data officiel), qui donnent les prix effectivement pratiqués
        dans votre zone — plus solides que des prix affichés.
      </div>

      {erreur ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{erreur}</p>
      ) : communes === null ? (
        <p className="p-4 text-sm text-slate-400">Chargement du marché de la zone (ventes DVF {annee})…</p>
      ) : (
        <>
          <p className="mb-3 text-sm text-slate-500">{totalVentes} ventes réelles sur la zone en {annee}.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {communes.map((c) => (
              <button
                key={c.insee}
                onClick={() => ouvrir(c)}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-copper hover:shadow-md"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-bold text-navy">{c.nom}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{c.nbTotal} ventes</span>
                </div>
                {c.note && <div className="mb-1 text-[11px] text-slate-400">{c.note}</div>}
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <div className="text-[10px] uppercase tracking-wide text-blue-600">Appart. médian</div>
                    <div className="text-sm font-bold text-blue-800">{c.medAppartM2 ? `${eur.format(c.medAppartM2)} €/m²` : "—"}</div>
                    <div className="text-[10px] text-slate-400">{c.nbAppart} vente{c.nbAppart > 1 ? "s" : ""}</div>
                  </div>
                  <div className="rounded-lg bg-green-50 p-2">
                    <div className="text-[10px] uppercase tracking-wide text-green-600">Maison médiane</div>
                    <div className="text-sm font-bold text-green-800">{c.medMaisonM2 ? `${eur.format(c.medMaisonM2)} €/m²` : "—"}</div>
                    <div className="text-[10px] text-slate-400">{c.nbMaison} vente{c.nbMaison > 1 ? "s" : ""}</div>
                  </div>
                </div>
                <div className="mt-2 text-xs font-semibold text-copper">Voir les ventes →</div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
