"use client";

import type { EstimateResponse } from "@/lib/types";

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

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
    <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
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
  sellerPrice,
  onReset,
}: {
  result: EstimateResponse;
  sellerPrice: number | null;
  onReset: () => void;
}) {
  const { report, dvfSales, engine } = result;

  return (
    <div className="rise-in space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h2 className="text-2xl font-bold text-navy">Avis de valeur</h2>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              engine === "ia" ? "bg-navy text-white" : "bg-amber-100 text-amber-700"
            }`}
          >
            {engine === "ia" ? "✦ Moteur IA + recherche web" : "Moteur statistique (clé IA non configurée)"}
          </span>
          <button onClick={() => window.print()} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
            Imprimer / PDF
          </button>
          <button onClick={onReset} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
            Nouvelle estimation
          </button>
        </div>
      </div>

      {/* Bandeau prix */}
      <div className="rounded-2xl bg-navy-deep p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-copper">Prix de vente recommandé</p>
            <p className="mt-1 text-4xl font-black tracking-tight sm:text-5xl">{euro.format(report.prix_estime)}</p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-300">
              <span>{euro.format(report.prix_m2)} / m²</span>
              <span>Délai estimé : {report.delai_vente_estime}</span>
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

      <Section icon="🎯" title="Positionnement marché">{report.positionnement_marche}</Section>

      <div className="grid gap-4 md:grid-cols-3">
        <Section icon="🏛️" title="Ventes réelles (DVF)">{report.analyse_dvf}</Section>
        <Section icon="🔎" title="Concurrence en vente">{report.analyse_concurrence}</Section>
        <Section icon="⏳" title="Invendus +90 jours">{report.analyse_invendus}</Section>
      </div>

      <Section icon="📷" title="Analyse des photos">{report.analyse_photos}</Section>

      {(report.points_forts.length > 0 || report.points_faibles.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <h3 className="mb-2.5 text-sm font-bold text-emerald-800">✚ Points forts</h3>
            <ul className="space-y-1.5 text-sm text-emerald-900">
              {report.points_forts.map((p, i) => (
                <li key={i} className="flex gap-2"><span className="text-emerald-500">•</span>{p}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
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
        <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
    </div>
  );
}
