"use client";

import type { EstimateResponse } from "@/lib/types";

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{children}</div>
    </section>
  );
}

export default function Report({ result, onReset }: { result: EstimateResponse; onReset: () => void }) {
  const { report, dvfSales, engine } = result;
  const confidence = Math.max(0, Math.min(100, report.indice_confiance));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Avis de valeur</h2>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              engine === "ia" ? "bg-indigo-100 text-indigo-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            {engine === "ia" ? "Moteur IA" : "Moteur statistique (clé IA non configurée)"}
          </span>
          <button
            onClick={() => window.print()}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 print:hidden"
          >
            Imprimer / PDF
          </button>
          <button
            onClick={onReset}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 print:hidden"
          >
            Nouvelle estimation
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 p-6 text-white">
        <p className="text-sm text-slate-300">Prix de vente recommandé</p>
        <p className="text-4xl font-bold">{euro.format(report.prix_estime)}</p>
        <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-300">
          <span>
            Fourchette : <strong className="text-white">{euro.format(report.fourchette_basse)}</strong> —{" "}
            <strong className="text-white">{euro.format(report.fourchette_haute)}</strong>
          </span>
          <span>
            Prix au m² : <strong className="text-white">{euro.format(report.prix_m2)}</strong>
          </span>
          <span>
            Délai estimé : <strong className="text-white">{report.delai_vente_estime}</strong>
          </span>
        </div>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-slate-400">
            <span>Indice de confiance</span>
            <span>{confidence}/100</span>
          </div>
          <div className="h-2 rounded-full bg-slate-700">
            <div
              className={`h-2 rounded-full ${confidence >= 70 ? "bg-emerald-400" : confidence >= 40 ? "bg-amber-400" : "bg-red-400"}`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      </div>

      <Section title="Positionnement marché">{report.positionnement_marche}</Section>

      <div className="grid gap-4 md:grid-cols-3">
        <Section title="Ventes réelles (DVF)">{report.analyse_dvf}</Section>
        <Section title="Concurrence en vente">{report.analyse_concurrence}</Section>
        <Section title="Invendus +90 jours">{report.analyse_invendus}</Section>
      </div>

      <Section title="Analyse des photos">{report.analyse_photos}</Section>

      {(report.points_forts.length > 0 || report.points_faibles.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Points forts
            </h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-emerald-900">
              {report.points_forts.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-xl border border-red-200 bg-red-50 p-5">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-700">
              Points faibles
            </h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-red-900">
              {report.points_faibles.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </section>
        </div>
      )}

      <Section title="Stratégie de commercialisation">{report.strategie_commercialisation}</Section>
      <Section title="Argumentaire vendeur (prêt à l'emploi)">{report.argumentaire_vendeur}</Section>

      {dvfSales.length > 0 && (
        <details className="rounded-xl border border-slate-200 bg-white p-5">
          <summary className="cursor-pointer text-sm font-semibold text-slate-600">
            Détail des {dvfSales.length} transactions DVF utilisées
          </summary>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-1.5 pr-4">Date</th>
                  <th className="py-1.5 pr-4">Type</th>
                  <th className="py-1.5 pr-4">Surface</th>
                  <th className="py-1.5 pr-4">Prix</th>
                  <th className="py-1.5 pr-4">€/m²</th>
                  <th className="py-1.5">Commune</th>
                </tr>
              </thead>
              <tbody>
                {dvfSales.map((s, i) => (
                  <tr key={i} className="border-b border-slate-100">
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
