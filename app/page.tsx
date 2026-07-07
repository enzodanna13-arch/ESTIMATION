"use client";

import { useState } from "react";
import ComparablesEditor from "@/components/ComparablesEditor";
import Report from "@/components/Report";
import { compressImage } from "@/lib/compressImage";
import type { EstimateResponse, PhotoInput, PropertyInput } from "@/lib/types";

const initialInput: PropertyInput = {
  adresse: "",
  codePostal: "",
  ville: "",
  quartier: "",
  typeBien: "appartement",
  surfaceHabitable: null,
  surfaceTerrain: null,
  nbPieces: null,
  nbChambres: null,
  nbSallesDeBain: null,
  etage: "",
  ascenseur: false,
  anneeConstruction: "",
  dpe: "",
  ges: "",
  etatGeneral: "",
  travauxAPrevoir: "",
  chauffage: "",
  exposition: "",
  exterieur: [],
  stationnement: "",
  cave: false,
  chargesCopro: null,
  taxeFonciere: null,
  prixSouhaiteVendeur: null,
  contexteVente: "",
  commentaires: "",
  concurrence: [],
  invendus: [],
  photos: [],
};

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function Card({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-800">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

const EXTERIEUR_OPTIONS = ["Balcon", "Terrasse", "Jardin", "Loggia", "Cour"];

export default function Home() {
  const [input, setInput] = useState<PropertyInput>(initialInput);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EstimateResponse | null>(null);

  const set = <K extends keyof PropertyInput>(key: K, value: PropertyInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const num = (v: string) => (v === "" ? null : +v);

  const handlePhotos = async (files: FileList | null) => {
    if (!files) return;
    setError(null);
    try {
      const compressed: PhotoInput[] = [];
      for (const file of Array.from(files).slice(0, 8 - input.photos.length)) {
        compressed.push(await compressImage(file));
      }
      set("photos", [...input.photos, ...compressed]);
    } catch {
      setError("Impossible de traiter une des photos.");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Erreur serveur (${res.status})`);
      }
      setResult((await res.json()) as EstimateResponse);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <header className="mb-8 print:hidden">
        <h1 className="text-3xl font-bold text-slate-900">Estimation IA</h1>
        <p className="mt-1 text-sm text-slate-500">
          Avis de valeur croisant les ventes réelles (DVF), la concurrence en vente et les
          invendus +90 jours — avec analyse des photos par IA.
        </p>
      </header>

      {result ? (
        <Report result={result} onReset={() => setResult(null)} />
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <Card step={1} title="Localisation">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Adresse *">
                  <input required className={inputCls} value={input.adresse} onChange={(e) => set("adresse", e.target.value)} placeholder="12 rue de la République" />
                </Field>
              </div>
              <Field label="Code postal *">
                <input required pattern="\d{5}" className={inputCls} value={input.codePostal} onChange={(e) => set("codePostal", e.target.value)} placeholder="69001" />
              </Field>
              <Field label="Ville *">
                <input required className={inputCls} value={input.ville} onChange={(e) => set("ville", e.target.value)} placeholder="Lyon" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Quartier / secteur">
                  <input className={inputCls} value={input.quartier} onChange={(e) => set("quartier", e.target.value)} placeholder="Presqu'île, proche métro" />
                </Field>
              </div>
            </div>
          </Card>

          <Card step={2} title="Caractéristiques du bien">
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Type de bien *">
                <select className={inputCls} value={input.typeBien} onChange={(e) => set("typeBien", e.target.value as PropertyInput["typeBien"])}>
                  <option value="appartement">Appartement</option>
                  <option value="maison">Maison</option>
                  <option value="terrain">Terrain</option>
                  <option value="immeuble">Immeuble</option>
                  <option value="local">Local commercial</option>
                </select>
              </Field>
              <Field label="Surface habitable (m²) *">
                <input required type="number" min={1} className={inputCls} value={input.surfaceHabitable ?? ""} onChange={(e) => set("surfaceHabitable", num(e.target.value))} />
              </Field>
              <Field label="Surface terrain (m²)">
                <input type="number" className={inputCls} value={input.surfaceTerrain ?? ""} onChange={(e) => set("surfaceTerrain", num(e.target.value))} />
              </Field>
              <Field label="Pièces">
                <input type="number" className={inputCls} value={input.nbPieces ?? ""} onChange={(e) => set("nbPieces", num(e.target.value))} />
              </Field>
              <Field label="Chambres">
                <input type="number" className={inputCls} value={input.nbChambres ?? ""} onChange={(e) => set("nbChambres", num(e.target.value))} />
              </Field>
              <Field label="Salles de bain">
                <input type="number" className={inputCls} value={input.nbSallesDeBain ?? ""} onChange={(e) => set("nbSallesDeBain", num(e.target.value))} />
              </Field>
              <Field label="Étage">
                <input className={inputCls} value={input.etage} onChange={(e) => set("etage", e.target.value)} placeholder="3e / rez-de-chaussée" />
              </Field>
              <Field label="Année de construction">
                <input className={inputCls} value={input.anneeConstruction} onChange={(e) => set("anneeConstruction", e.target.value)} placeholder="1975" />
              </Field>
              <Field label="Chauffage">
                <input className={inputCls} value={input.chauffage} onChange={(e) => set("chauffage", e.target.value)} placeholder="Gaz individuel" />
              </Field>
              <Field label="DPE">
                <select className={inputCls} value={input.dpe} onChange={(e) => set("dpe", e.target.value)}>
                  <option value="">—</option>
                  {["A", "B", "C", "D", "E", "F", "G"].map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </Field>
              <Field label="GES">
                <select className={inputCls} value={input.ges} onChange={(e) => set("ges", e.target.value)}>
                  <option value="">—</option>
                  {["A", "B", "C", "D", "E", "F", "G"].map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </Field>
              <Field label="État général">
                <select className={inputCls} value={input.etatGeneral} onChange={(e) => set("etatGeneral", e.target.value)}>
                  <option value="">—</option>
                  <option>Neuf</option>
                  <option>Refait à neuf</option>
                  <option>Bon état</option>
                  <option>Rafraîchissement à prévoir</option>
                  <option>Travaux importants</option>
                </select>
              </Field>
              <Field label="Exposition">
                <input className={inputCls} value={input.exposition} onChange={(e) => set("exposition", e.target.value)} placeholder="Sud-Ouest, traversant" />
              </Field>
              <Field label="Stationnement">
                <input className={inputCls} value={input.stationnement} onChange={(e) => set("stationnement", e.target.value)} placeholder="Garage, place privée…" />
              </Field>
              <Field label="Travaux à prévoir">
                <input className={inputCls} value={input.travauxAPrevoir} onChange={(e) => set("travauxAPrevoir", e.target.value)} placeholder="Électricité, toiture…" />
              </Field>
              <Field label="Charges copro (€/mois)">
                <input type="number" className={inputCls} value={input.chargesCopro ?? ""} onChange={(e) => set("chargesCopro", num(e.target.value))} />
              </Field>
              <Field label="Taxe foncière (€/an)">
                <input type="number" className={inputCls} value={input.taxeFonciere ?? ""} onChange={(e) => set("taxeFonciere", num(e.target.value))} />
              </Field>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="text-xs font-medium text-slate-600">Extérieur :</span>
              {EXTERIEUR_OPTIONS.map((opt) => (
                <label key={opt} className="flex items-center gap-1.5 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={input.exterieur.includes(opt)}
                    onChange={(e) =>
                      set(
                        "exterieur",
                        e.target.checked
                          ? [...input.exterieur, opt]
                          : input.exterieur.filter((o) => o !== opt),
                      )
                    }
                  />
                  {opt}
                </label>
              ))}
              <label className="flex items-center gap-1.5 text-sm text-slate-700">
                <input type="checkbox" checked={input.ascenseur} onChange={(e) => set("ascenseur", e.target.checked)} />
                Ascenseur
              </label>
              <label className="flex items-center gap-1.5 text-sm text-slate-700">
                <input type="checkbox" checked={input.cave} onChange={(e) => set("cave", e.target.checked)} />
                Cave
              </label>
            </div>
          </Card>

          <Card step={3} title="Photos du bien">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handlePhotos(e.target.files)}
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-700"
            />
            <p className="mt-1 text-xs text-slate-400">
              Jusqu&apos;à 8 photos — elles sont analysées par l&apos;IA (état réel, luminosité, prestations).
            </p>
            {input.photos.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {input.photos.map((photo, i) => (
                  <div key={i} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:${photo.mediaType};base64,${photo.data}`}
                      alt={photo.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => set("photos", input.photos.filter((_, j) => j !== i))}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                      aria-label="Supprimer la photo"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card step={4} title="Marché local (saisie commercial)">
            <div className="space-y-6">
              <ComparablesEditor
                title="Biens en vente actuellement (concurrence)"
                hint="Biens comparables affichés sur les portails — la vitrine à laquelle votre bien sera comparé."
                items={input.concurrence}
                onChange={(items) => set("concurrence", items)}
                showDays
              />
              <ComparablesEditor
                title="Invendus (+90 jours de commercialisation)"
                hint="Biens comparables qui ne se vendent pas : ils révèlent le prix que le marché refuse."
                items={input.invendus}
                onChange={(items) => set("invendus", items)}
                showDays
              />
              <p className="text-xs text-slate-400">
                Les transactions réelles DVF (data.gouv.fr) sont récupérées automatiquement à partir
                du code postal.
              </p>
            </div>
          </Card>

          <Card step={5} title="Contexte de vente">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Prix souhaité par le vendeur (€)">
                <input type="number" className={inputCls} value={input.prixSouhaiteVendeur ?? ""} onChange={(e) => set("prixSouhaiteVendeur", num(e.target.value))} />
              </Field>
              <Field label="Contexte (mutation, succession, divorce…)">
                <input className={inputCls} value={input.contexteVente} onChange={(e) => set("contexteVente", e.target.value)} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Commentaires du commercial">
                  <textarea rows={3} className={inputCls} value={input.commentaires} onChange={(e) => set("commentaires", e.target.value)} placeholder="Nuisances, copropriété, éléments non visibles sur les photos…" />
                </Field>
              </div>
            </div>
          </Card>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3.5 text-base font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Analyse en cours… (DVF + concurrence + photos, jusqu'à 2-3 min)" : "Générer l'avis de valeur"}
          </button>
        </form>
      )}
    </main>
  );
}
