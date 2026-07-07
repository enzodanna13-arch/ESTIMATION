"use client";

import type { EstimateResponse, PropertyInput } from "@/lib/types";

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const DPE_COLORS: Record<string, string> = {
  A: "#1d9d51", B: "#52b153", C: "#a5c93b", D: "#f2e211", E: "#f0b418", F: "#e97f24", G: "#e3282a",
};

function ConfidenceGauge({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  const color = v >= 70 ? "#34d399" : v >= 40 ? "#fbbf24" : "#f87171";
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-24 w-24">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
        <circle
          cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white">{v}</span>
        <span className="text-[10px] uppercase tracking-wide text-slate-300">confiance</span>
      </div>
    </div>
  );
}

function RangeBar({ basse, estime, haute, vendeur }: { basse: number; estime: number; haute: number; vendeur: number | null }) {
  const min = Math.min(basse, vendeur ?? basse) * 0.97;
  const max = Math.max(haute, vendeur ?? haute) * 1.03;
  const pos = (v: number) => `${((v - min) / (max - min)) * 100}%`;
  return (
    <div className="mt-6">
      <div className="relative h-3 rounded-full bg-white/10">
        <div
          className="absolute h-3 rounded-full bg-emerald-400/50"
          style={{ left: pos(basse), width: `calc(${pos(haute)} - ${pos(basse)})` }}
        />
        <div className="absolute -top-1 h-5 w-1.5 -translate-x-1/2 rounded bg-white" style={{ left: pos(estime) }} />
        {vendeur !== null && (
          <div className="absolute -top-1 h-5 w-1.5 -translate-x-1/2 rounded bg-red-400" style={{ left: pos(vendeur) }} />
        )}
      </div>
      <div className="relative mt-2 h-8 text-[11px] text-slate-300">
        <span className="absolute -translate-x-1/2" style={{ left: pos(basse) }}>{euro.format(basse)}</span>
        <span className="absolute -translate-x-1/2 font-bold text-white" style={{ left: pos(estime) }}>{euro.format(estime)}</span>
        <span className="absolute -translate-x-1/2" style={{ left: pos(haute) }}>{euro.format(haute)}</span>
      </div>
      {vendeur !== null && (
        <p className="mt-1 text-xs text-slate-300">
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-red-400" />
          Prix vendeur : <strong className="text-white">{euro.format(vendeur)}</strong>{" "}
          ({vendeur > estime ? "+" : ""}{(((vendeur - estime) / estime) * 100).toFixed(1)} % vs estimation)
        </p>
      )}
    </div>
  );
}

function Section({ icon, title, children, className = "" }: { icon: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`break-inside-avoid rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <h3 className="mb-2.5 flex items-center gap-2 text-sm font-bold text-navy">
        <span aria-hidden>{icon}</span>
        {title}
      </h3>
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

export default function Report({
  result,
  input,
  onReset,
}: {
  result: EstimateResponse;
  input: PropertyInput;
  onReset: () => void;
}) {
  const { report, dvfSales, engine } = result;
  const sellerPrice = input.prixSouhaiteVendeur;
  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const photoAnalyses = report.analyse_par_photo.filter((pa) => input.photos[pa.photo - 1]);
  const annotatedIndexes = new Set(photoAnalyses.map((pa) => pa.photo - 1));
  const otherPhotos = input.photos.map((p, i) => ({ p, i })).filter(({ i }) => !annotatedIndexes.has(i));
  const competitors = report.annonces_concurrentes;

  return (
    <div className="rise-in space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h2 className="text-2xl font-bold text-navy">Dossier d&apos;estimation</h2>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              engine === "ia" ? "bg-navy text-white" : "bg-amber-100 text-amber-700"
            }`}
          >
            {engine === "ia" ? "✦ Moteur IA + recherche web" : "Moteur statistique (clé IA non configurée)"}
          </span>
          <button onClick={() => window.print()} className="rounded-lg bg-copper px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110">
            📄 Exporter le dossier PDF
          </button>
          <button onClick={onReset} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
            Nouvelle estimation
          </button>
        </div>
      </div>

      {/* Page de garde du dossier */}
      <div className="break-inside-avoid rounded-2xl bg-navy-deep p-6 text-white shadow-lg sm:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-copper text-base font-black">E</div>
            <div>
              <p className="text-sm font-bold leading-tight">Avis de valeur</p>
              <p className="text-xs text-slate-300">Édité le {today}</p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-300">
            <p className="text-sm font-semibold text-white">{input.adresse}</p>
            <p>{input.codePostal} {input.ville}{input.quartier ? ` — ${input.quartier}` : ""}</p>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2 text-xs">
          {[
            `${input.typeBien.charAt(0).toUpperCase()}${input.typeBien.slice(1)}`,
            `${input.surfaceHabitable ?? "?"} m²`,
            input.nbPieces ? `${input.nbPieces} pièces` : null,
            input.nbChambres ? `${input.nbChambres} ch.` : null,
            input.etage ? `Étage ${input.etage}` : null,
            input.anneeConstruction ? `Constr. ${input.anneeConstruction}` : null,
            ...(input.exterieur.length ? input.exterieur : []),
            input.ascenseur ? "Ascenseur" : null,
            input.cave ? "Cave" : null,
            input.stationnement || null,
          ]
            .filter(Boolean)
            .map((tag, i) => (
              <span key={i} className="rounded-full border border-white/20 px-2.5 py-1 text-slate-200">{tag}</span>
            ))}
          {input.dpe && (
            <span className="rounded-full px-2.5 py-1 font-bold text-white" style={{ background: DPE_COLORS[input.dpe] ?? "#64748b" }}>
              DPE {input.dpe}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-copper">Prix de vente recommandé</p>
            <p className="mt-1 text-4xl font-black tracking-tight sm:text-5xl">{euro.format(report.prix_estime)}</p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-300">
              <span>{euro.format(report.prix_m2)} / m²</span>
              <span>⏱ Délai de vente estimé : <strong className="text-white">{report.delai_vente_estime}</strong></span>
            </div>
          </div>
          <ConfidenceGauge value={report.indice_confiance} />
        </div>
        <RangeBar
          basse={report.fourchette_basse}
          estime={report.prix_estime}
          haute={report.fourchette_haute}
          vendeur={sellerPrice}
        />
      </div>

      <Section icon="🎯" title="Positionnement stratégique">{report.positionnement_marche}</Section>

      {/* Analyse photo par photo */}
      {(photoAnalyses.length > 0 || otherPhotos.length > 0) && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-navy">
            <span aria-hidden>📷</span> Le bien en images — bons points & défauts
          </h3>
          {report.analyse_photos && (
            <p className="mb-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{report.analyse_photos}</p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {photoAnalyses.map((pa) => {
              const photo = input.photos[pa.photo - 1];
              return (
                <div key={pa.photo} className="break-inside-avoid overflow-hidden rounded-xl border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`data:${photo.mediaType};base64,${photo.data}`}
                    alt={pa.titre}
                    className="h-44 w-full object-cover"
                  />
                  <div className="p-3.5">
                    <p className="mb-2 text-sm font-bold text-navy">{pa.titre}</p>
                    <ul className="space-y-1 text-xs">
                      {pa.bons_points.map((b, i) => (
                        <li key={`b${i}`} className="flex gap-1.5 text-emerald-700">
                          <span className="mt-px font-bold">✚</span>{b}
                        </li>
                      ))}
                      {pa.defauts.map((d, i) => (
                        <li key={`d${i}`} className="flex gap-1.5 text-red-600">
                          <span className="mt-px font-bold">−</span>{d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
            {otherPhotos.map(({ p, i }) => (
              <div key={`o${i}`} className="overflow-hidden rounded-xl border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`data:${p.mediaType};base64,${p.data}`} alt={p.name} className="h-44 w-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Section icon="🏛️" title="Ventes réelles (DVF)">{report.analyse_dvf}</Section>
        <Section icon="🔎" title="Concurrence en vente">{report.analyse_concurrence}</Section>
        <Section icon="⏳" title="Invendus +90 jours">{report.analyse_invendus}</Section>
      </div>

      {/* Annonces concurrentes trouvées par l'IA */}
      {competitors.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-1 flex items-center gap-2 text-sm font-bold text-navy">
            <span aria-hidden>🏘️</span> Annonces concurrentes sur le marché
          </h3>
          <p className="mb-4 text-xs text-slate-400">
            Relevées automatiquement sur le web au moment de l&apos;estimation — la vitrine face à laquelle le bien sera comparé.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {competitors.map((ad, i) => (
              <div key={i} className="break-inside-avoid rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-navy">{ad.titre}</p>
                  {ad.anciennete && (
                    <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      {ad.anciennete}
                    </span>
                  )}
                </div>
                <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  {ad.prix > 0 && <span className="text-lg font-black text-navy">{euro.format(ad.prix)}</span>}
                  {ad.surface > 0 && <span className="text-xs text-slate-500">{ad.surface} m²</span>}
                  {ad.prix_m2 > 0 && <span className="text-xs font-semibold text-copper">{euro.format(ad.prix_m2)}/m²</span>}
                </div>
                {ad.caracteristiques && <p className="text-xs text-slate-600">{ad.caracteristiques}</p>}
                {ad.comparaison && <p className="mt-1.5 text-xs italic text-slate-500">→ {ad.comparaison}</p>}
                {ad.source && <p className="mt-1.5 text-[10px] uppercase tracking-wide text-slate-400">Source : {ad.source}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {(report.points_forts.length > 0 || report.points_faibles.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          <section className="break-inside-avoid rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <h3 className="mb-2.5 text-sm font-bold text-emerald-800">✚ Points forts</h3>
            <ul className="space-y-1.5 text-sm text-emerald-900">
              {report.points_forts.map((p, i) => (
                <li key={i} className="flex gap-2"><span className="text-emerald-500">•</span>{p}</li>
              ))}
            </ul>
          </section>
          <section className="break-inside-avoid rounded-2xl border border-red-200 bg-red-50 p-5">
            <h3 className="mb-2.5 text-sm font-bold text-red-800">− Points faibles</h3>
            <ul className="space-y-1.5 text-sm text-red-900">
              {report.points_faibles.map((p, i) => (
                <li key={i} className="flex gap-2"><span className="text-red-400">•</span>{p}</li>
              ))}
            </ul>
          </section>
        </div>
      )}

      <Section icon="🧭" title="Stratégie de commercialisation">{report.strategie_commercialisation}</Section>
      <Section icon="💬" title="Argumentaire vendeur (prêt à l'emploi)" className="border-copper/40 bg-copper-soft/30">
        {report.argumentaire_vendeur}
      </Section>

      {dvfSales.length > 0 && (
        <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
          <summary className="cursor-pointer text-sm font-bold text-navy">
            Détail des {dvfSales.length} transactions DVF utilisées
          </summary>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400">
                  <th className="py-2 pr-4 font-semibold">Date</th>
                  <th className="py-2 pr-4 font-semibold">Type</th>
                  <th className="py-2 pr-4 font-semibold">Surface</th>
                  <th className="py-2 pr-4 font-semibold">Prix</th>
                  <th className="py-2 pr-4 font-semibold">€/m²</th>
                  <th className="py-2 font-semibold">Commune</th>
                </tr>
              </thead>
              <tbody>
                {dvfSales.map((s, i) => (
                  <tr key={i} className="border-b border-slate-100 text-slate-600">
                    <td className="py-1.5 pr-4">{s.date}</td>
                    <td className="py-1.5 pr-4">{s.typeLocal}</td>
                    <td className="py-1.5 pr-4">{s.surface ?? "—"} m²</td>
                    <td className="py-1.5 pr-4">{euro.format(s.valeurFonciere)}</td>
                    <td className="py-1.5 pr-4">{s.prixM2 ? euro.format(s.prixM2) : "—"}</td>
                    <td className="py-1.5">{s.commune}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}

      <p className="hidden pt-2 text-center text-[10px] text-slate-400 print:block">
        Dossier d&apos;estimation édité le {today} — {input.adresse}, {input.codePostal} {input.ville}. Estimation
        indicative fondée sur les données DVF, le marché actif et l&apos;analyse IA ; ne remplace pas un avis de valeur signé.
      </p>
    </div>
  );
}
