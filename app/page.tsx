"use client";

import { useEffect, useState } from "react";
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
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/20";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
        active
          ? "border-navy bg-navy text-white shadow-sm"
          : "border-slate-300 bg-white text-slate-600 hover:border-navy/50 hover:text-navy"
      }`}
    >
      {children}
    </button>
  );
}

const STEPS = ["Localisation", "Le bien", "Photos", "Marché", "Contexte"] as const;

const EXTERIEUR_OPTIONS = ["Balcon", "Terrasse", "Jardin", "Loggia", "Cour"];
const DPE_COLORS: Record<string, string> = {
  A: "#1d9d51", B: "#52b153", C: "#a5c93b", D: "#f2e211", E: "#f0b418", F: "#e97f24", G: "#e3282a",
};

const LOADING_PHASES = [
  "Récupération des ventes réelles (DVF)…",
  "Recherche des biens en concurrence sur le web…",
  "Détection des annonces invendues (+90 jours)…",
  "Analyse des photos du bien…",
  "Croisement des trois sources de marché…",
  "Rédaction de l'avis de valeur…",
];

function LoadingOverlay() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase((p) => Math.min(p + 1, LOADING_PHASES.length - 1)), 9000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/85 p-4 backdrop-blur-sm">
      <div className="rise-in w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-xl font-bold text-white">
          IA
        </div>
        <h2 className="text-lg font-bold text-navy">Analyse en cours</h2>
        <p className="mt-2 min-h-10 text-sm text-slate-600">{LOADING_PHASES[phase]}</p>
        <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="scan-bar relative h-full rounded-full bg-copper transition-all duration-1000"
            style={{ width: `${((phase + 1) / LOADING_PHASES.length) * 100}%` }}
          />
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Recherche web + photos + DVF : l&apos;analyse complète peut prendre 1 à 3 minutes.
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [input, setInput] = useState<PropertyInput>(initialInput);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EstimateResponse | null>(null);

  const set = <K extends keyof PropertyInput>(key: K, value: PropertyInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const num = (v: string) => (v === "" ? null : +v);

  const stepValid = (s: number): boolean => {
    if (s === 0) return input.adresse.trim() !== "" && /^\d{5}$/.test(input.codePostal) && input.ville.trim() !== "";
    if (s === 1) return input.surfaceHabitable !== null && input.surfaceHabitable > 0;
    return true;
  };

  const goTo = (target: number) => {
    if (target <= step || [...Array(target).keys()].every(stepValid)) {
      setStep(target);
      setError(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const next = () => {
    if (!stepValid(step)) {
      setError(
        step === 0
          ? "Renseignez l'adresse, un code postal à 5 chiffres et la ville."
          : "Renseignez la surface habitable.",
      );
      return;
    }
    goTo(step + 1);
  };

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

  const submit = async () => {
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
    <div className="min-h-screen">
      {loading && <LoadingOverlay />}

      <header className="bg-navy-deep text-white print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-copper text-lg font-black">
              E
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Estimation IA</h1>
              <p className="text-xs text-slate-300">Avis de valeur pour l&apos;équipe commerciale</p>
            </div>
          </div>
          <div className="hidden gap-2 sm:flex">
            {["Ventes réelles DVF", "Concurrence web", "Invendus +90 j"].map((s) => (
              <span key={s} className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-200">
                {s}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {result ? (
          <Report result={result} sellerPrice={input.prixSouhaiteVendeur} onReset={() => { setResult(null); setStep(0); }} />
        ) : (
          <>
            {/* Barre d'étapes */}
            <nav className="mb-8 print:hidden">
              <div className="flex items-center">
                {STEPS.map((label, i) => (
                  <div key={label} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      className="group flex flex-col items-center gap-1.5"
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
                          i === step
                            ? "bg-copper text-white shadow-md shadow-copper/40"
                            : i < step
                              ? "bg-navy text-white"
                              : "border-2 border-slate-300 bg-white text-slate-400 group-hover:border-navy/40"
                        }`}
                      >
                        {i < step ? "✓" : i + 1}
                      </span>
                      <span
                        className={`hidden text-xs font-medium sm:block ${
                          i === step ? "text-copper" : i < step ? "text-navy" : "text-slate-400"
                        }`}
                      >
                        {label}
                      </span>
                    </button>
                    {i < STEPS.length - 1 && (
                      <div className={`mx-2 mb-5 h-0.5 flex-1 rounded sm:mb-5 ${i < step ? "bg-navy" : "bg-slate-300"}`} />
                    )}
                  </div>
                ))}
              </div>
            </nav>

            <div key={step} className="rise-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {step === 0 && (
                <>
                  <h2 className="mb-1 text-xl font-bold text-navy">Où se situe le bien ?</h2>
                  <p className="mb-6 text-sm text-slate-500">
                    Le code postal déclenche la récupération automatique des ventes réelles DVF et la
                    recherche web du marché local.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Adresse *" className="sm:col-span-2">
                      <input className={inputCls} value={input.adresse} onChange={(e) => set("adresse", e.target.value)} placeholder="12 rue de la République" />
                    </Field>
                    <Field label="Code postal *">
                      <input className={inputCls} inputMode="numeric" maxLength={5} value={input.codePostal} onChange={(e) => set("codePostal", e.target.value.replace(/\D/g, ""))} placeholder="69001" />
                    </Field>
                    <Field label="Ville *">
                      <input className={inputCls} value={input.ville} onChange={(e) => set("ville", e.target.value)} placeholder="Lyon" />
                    </Field>
                    <Field label="Quartier / secteur" className="sm:col-span-2">
                      <input className={inputCls} value={input.quartier} onChange={(e) => set("quartier", e.target.value)} placeholder="Presqu'île, proche métro" />
                    </Field>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="mb-1 text-xl font-bold text-navy">Décrivez le bien</h2>
                  <p className="mb-6 text-sm text-slate-500">
                    Plus la fiche est complète, plus l&apos;estimation est précise.
                  </p>
                  <div className="mb-5 flex flex-wrap gap-2">
                    {(["appartement", "maison", "terrain", "immeuble", "local"] as const).map((t) => (
                      <Chip key={t} active={input.typeBien === t} onClick={() => set("typeBien", t)}>
                        {t === "local" ? "Local commercial" : t.charAt(0).toUpperCase() + t.slice(1)}
                      </Chip>
                    ))}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Surface habitable (m²) *">
                      <input type="number" min={1} className={inputCls} value={input.surfaceHabitable ?? ""} onChange={(e) => set("surfaceHabitable", num(e.target.value))} />
                    </Field>
                    <Field label="Surface terrain (m²)">
                      <input type="number" className={inputCls} value={input.surfaceTerrain ?? ""} onChange={(e) => set("surfaceTerrain", num(e.target.value))} />
                    </Field>
                    <Field label="Année de construction">
                      <input className={inputCls} value={input.anneeConstruction} onChange={(e) => set("anneeConstruction", e.target.value)} placeholder="1975" />
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
                      <input className={inputCls} value={input.etage} onChange={(e) => set("etage", e.target.value)} placeholder="3e / RDC" />
                    </Field>
                    <Field label="Chauffage">
                      <input className={inputCls} value={input.chauffage} onChange={(e) => set("chauffage", e.target.value)} placeholder="Gaz individuel" />
                    </Field>
                    <Field label="Exposition">
                      <input className={inputCls} value={input.exposition} onChange={(e) => set("exposition", e.target.value)} placeholder="Sud-Ouest, traversant" />
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
                    <Field label="Travaux à prévoir">
                      <input className={inputCls} value={input.travauxAPrevoir} onChange={(e) => set("travauxAPrevoir", e.target.value)} placeholder="Électricité, toiture…" />
                    </Field>
                    <Field label="Stationnement">
                      <input className={inputCls} value={input.stationnement} onChange={(e) => set("stationnement", e.target.value)} placeholder="Garage, place privée…" />
                    </Field>
                    <Field label="Charges copro (€/mois)">
                      <input type="number" className={inputCls} value={input.chargesCopro ?? ""} onChange={(e) => set("chargesCopro", num(e.target.value))} />
                    </Field>
                    <Field label="Taxe foncière (€/an)">
                      <input type="number" className={inputCls} value={input.taxeFonciere ?? ""} onChange={(e) => set("taxeFonciere", num(e.target.value))} />
                    </Field>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">DPE</span>
                      {["A", "B", "C", "D", "E", "F", "G"].map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => set("dpe", input.dpe === l ? "" : l)}
                          className={`h-9 w-9 rounded-lg text-sm font-bold text-white transition ${
                            input.dpe === l ? "scale-110 ring-2 ring-navy ring-offset-2" : "opacity-60 hover:opacity-100"
                          }`}
                          style={{ background: DPE_COLORS[l] }}
                        >
                          {l}
                        </button>
                      ))}
                      <span className="ml-4 mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">GES</span>
                      {["A", "B", "C", "D", "E", "F", "G"].map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => set("ges", input.ges === l ? "" : l)}
                          className={`h-7 w-7 rounded-md text-xs font-bold transition ${
                            input.ges === l
                              ? "bg-navy text-white ring-2 ring-navy ring-offset-2"
                              : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {EXTERIEUR_OPTIONS.map((opt) => (
                        <Chip
                          key={opt}
                          active={input.exterieur.includes(opt)}
                          onClick={() =>
                            set(
                              "exterieur",
                              input.exterieur.includes(opt)
                                ? input.exterieur.filter((o) => o !== opt)
                                : [...input.exterieur, opt],
                            )
                          }
                        >
                          {opt}
                        </Chip>
                      ))}
                      <Chip active={input.ascenseur} onClick={() => set("ascenseur", !input.ascenseur)}>Ascenseur</Chip>
                      <Chip active={input.cave} onClick={() => set("cave", !input.cave)}>Cave</Chip>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="mb-1 text-xl font-bold text-navy">Photos du bien</h2>
                  <p className="mb-6 text-sm text-slate-500">
                    L&apos;IA évalue l&apos;état réel, la luminosité et les prestations — et signale tout
                    écart avec l&apos;état déclaré. Jusqu&apos;à 8 photos.
                  </p>
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-10 transition hover:border-copper hover:bg-copper-soft/40">
                    <span className="mb-1 text-3xl">📷</span>
                    <span className="text-sm font-semibold text-navy">Ajouter des photos</span>
                    <span className="text-xs text-slate-400">Compressées automatiquement avant envoi</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handlePhotos(e.target.files)} />
                  </label>
                  {input.photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                      {input.photos.map((photo, i) => (
                        <div key={i} className="group relative aspect-square overflow-hidden rounded-xl">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={`data:${photo.mediaType};base64,${photo.data}`} alt={photo.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                          <button
                            type="button"
                            onClick={() => set("photos", input.photos.filter((_, j) => j !== i))}
                            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition group-hover:opacity-100"
                            aria-label="Supprimer la photo"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="mb-1 text-xl font-bold text-navy">Marché local</h2>
                  <p className="mb-6 text-sm text-slate-500">Analysé automatiquement — rien à saisir.</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { icon: "🏛️", title: "Ventes réelles DVF", text: "Transactions actées récupérées via le code postal (data.gouv.fr)." },
                      { icon: "🔎", title: "Concurrence en vente", text: "L'IA recherche sur le web les biens comparables actuellement affichés." },
                      { icon: "⏳", title: "Invendus +90 jours", text: "Les annonces qui traînent fixent le plafond que le marché refuse." },
                    ].map((c) => (
                      <div key={c.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-2 text-2xl">{c.icon}</div>
                        <h3 className="text-sm font-bold text-navy">{c.title}</h3>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">{c.text}</p>
                      </div>
                    ))}
                  </div>
                  <details className="mt-6 rounded-xl border border-slate-200 p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-slate-600">
                      Compléter manuellement (facultatif) — biens que l&apos;IA pourrait manquer
                    </summary>
                    <div className="mt-5 space-y-6">
                      <ComparablesEditor
                        title="Biens en vente actuellement (concurrence)"
                        hint="Mandats confidentiels, biens hors portails…"
                        items={input.concurrence}
                        onChange={(items) => set("concurrence", items)}
                        showDays
                      />
                      <ComparablesEditor
                        title="Invendus (+90 jours de commercialisation)"
                        hint="Biens comparables qui ne se vendent pas."
                        items={input.invendus}
                        onChange={(items) => set("invendus", items)}
                        showDays
                      />
                    </div>
                  </details>
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className="mb-1 text-xl font-bold text-navy">Contexte de vente</h2>
                  <p className="mb-6 text-sm text-slate-500">
                    Si le vendeur a un prix en tête, l&apos;IA le positionnera face au marché et vous
                    fournira l&apos;argumentaire pour recadrer si besoin.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Prix souhaité par le vendeur (€)">
                      <input type="number" className={inputCls} value={input.prixSouhaiteVendeur ?? ""} onChange={(e) => set("prixSouhaiteVendeur", num(e.target.value))} placeholder="320000" />
                    </Field>
                    <Field label="Contexte (mutation, succession, divorce…)">
                      <input className={inputCls} value={input.contexteVente} onChange={(e) => set("contexteVente", e.target.value)} />
                    </Field>
                    <Field label="Commentaires du commercial" className="sm:col-span-2">
                      <textarea rows={4} className={inputCls} value={input.commentaires} onChange={(e) => set("commentaires", e.target.value)} placeholder="Nuisances, copropriété, éléments non visibles sur les photos…" />
                    </Field>
                  </div>
                  <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                    <span className="font-semibold text-navy">Récapitulatif :</span>{" "}
                    {input.typeBien} {input.surfaceHabitable ?? "?"} m², {input.adresse || "adresse n.c."},{" "}
                    {input.codePostal} {input.ville} — {input.photos.length} photo{input.photos.length > 1 ? "s" : ""},{" "}
                    DPE {input.dpe || "n.c."}
                  </div>
                </>
              )}

              {error && (
                <p className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
              )}

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => goTo(step - 1)}
                  disabled={step === 0}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:invisible"
                >
                  ← Retour
                </button>
                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="rounded-xl bg-navy px-7 py-2.5 text-sm font-semibold text-white shadow-md shadow-navy/25 transition hover:bg-navy-deep"
                  >
                    Continuer →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submit}
                    disabled={loading}
                    className="rounded-xl bg-copper px-7 py-2.5 text-sm font-bold text-white shadow-md shadow-copper/30 transition hover:brightness-110 disabled:opacity-60"
                  >
                    ✦ Générer l&apos;avis de valeur
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="pb-8 text-center text-xs text-slate-400 print:hidden">
        Estimation indicative fondée sur DVF, le marché actif et l&apos;analyse IA — ne remplace pas un
        avis de valeur signé.
      </footer>
    </div>
  );
}
