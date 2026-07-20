"use client";

import { useEffect, useState } from "react";
import ComparablesEditor from "@/components/ComparablesEditor";
import Report from "@/components/Report";
import { deleteEstimation, getEstimation, getHistoryKey, HistoryLockedError, listEstimations, setHistoryKey, type HistoryMeta } from "@/lib/history";
import { loyerNetAnnuel, prixParRendement, RENDEMENT_NET_BAS, RENDEMENT_NET_HAUT } from "@/lib/rendement";
import { surfaceDependancesHabitables, surfaceHabitableTotale } from "@/lib/surfaces";
import { compressImage } from "@/lib/compressImage";
import type { EstimateResponse, PhotoInput, PropertyInput } from "@/lib/types";

const initialInput: PropertyInput = {
  clientCivilite: "",
  clientNom: "",
  clientPrenom: "",
  clientTel: "",
  clientEmail: "",
  horizonVente: "",
  negociateur: "",
  negociateurTel: "",
  negociateurEmail: "",
  negociateurPhoto: null,
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
  travauxAPrevoir: [],
  chauffage: "",
  exposition: [],
  exterieur: [],
  stationnement: "",
  cave: false,
  vue: "",
  environnement: "",
  luminosite: "",
  cuisine: "",
  menuiseries: "",
  mitoyennete: "",
  equipements: [],
  dependances: [],
  chargesCopro: null,
  taxeFonciere: null,
  mission: "vente" as const,
  prixAffiche: null,
  moisEnVente: null,
  nbVisites: null,
  nbOffres: null,
  baissesPrix: "",
  urlAnnonce: "",
  urlsAnnonce: [],
  meuble: "Vide",
  loyerSouhaite: null,
  loyerActuel: null,
  chargesNonRecuperables: null,
  prixAcquisition: null,
  anneeAcquisition: null,
  fraisAcquisitionReels: null,
  travauxRealises: null,
  prixSouhaiteVendeur: null,
  contexteVente: "",
  commentaires: "",
  concurrence: [],
  invendus: [],
  photos: [],
};

const int = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

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

function Select({
  label,
  value,
  onChange,
  options,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
}) {
  return (
    <Field label={label} className={className}>
      <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">— Sélectionner —</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </Field>
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

function ChipGroup({
  label,
  options,
  values,
  onChange,
}: {
  label: string;
  options: string[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <Chip
            key={opt}
            active={values.includes(opt)}
            onClick={() => onChange(values.includes(opt) ? values.filter((v) => v !== opt) : [...values, opt])}
          >
            {opt}
          </Chip>
        ))}
      </div>
    </div>
  );
}

const STEPS = ["Client", "Localisation", "Le bien", "Photos", "Contexte"] as const;

const OPT = {
  civilite: ["M.", "Mme", "M. et Mme", "Indivision", "Société"],
  horizon: ["Dès que possible", "Moins de 3 mois", "3 à 6 mois", "6 à 12 mois", "Plus de 12 mois", "Simple curiosité"],
  pieces: ["1", "2", "3", "4", "5", "6", "7", "8 et +"],
  etage: ["Rez-de-chaussée", "Rez-de-jardin", "1er", "2e", "3e", "4e", "5e", "6e et +", "Dernier étage", "Plain-pied", "Sur 2 niveaux", "Sur 3 niveaux"],
  annee: ["Avant 1900", "1900 - 1948", "1949 - 1974", "1975 - 1990", "1991 - 2005", "2006 - 2012", "Après 2012", "Neuf / VEFA"],
  etat: ["Neuf", "Refait à neuf", "Bon état", "Rafraîchissement à prévoir", "Travaux importants", "À rénover entièrement"],
  travaux: ["Peintures / rafraîchissement", "Cuisine", "Salle de bain", "Électricité", "Plomberie", "Menuiseries", "Isolation", "Toiture", "Façade", "Chauffage"],
  chauffage: ["Gaz individuel", "Gaz collectif", "Électrique", "Pompe à chaleur", "Fioul", "Bois / poêle", "Réseau urbain", "Climatisation réversible"],
  exposition: ["Nord", "Sud", "Est", "Ouest", "Traversant"],
  luminosite: ["Très lumineux", "Lumineux", "Correcte", "Sombre"],
  vue: ["Dégagée", "Sur jardin / verdure", "Sur rue", "Sur cour", "Vis-à-vis important", "Panoramique", "Vue mer / exception"],
  environnement: ["Très calme", "Calme", "Animé", "Rue passante", "Nuisances (route, rail, aéroport)"],
  cuisine: ["Indépendante équipée", "Ouverte équipée", "Américaine", "À équiper", "À créer"],
  menuiseries: ["Double vitrage récent", "Double vitrage ancien", "Partiellement double vitrage", "Simple vitrage", "Triple vitrage"],
  mitoyennete: ["Indépendante", "Mitoyenne 1 côté", "Mitoyenne 2 côtés"],
  stationnement: ["Aucun", "Place extérieure", "Place couverte", "Garage", "Garage double", "Plusieurs stationnements"],
  exterieur: ["Balcon", "Terrasse", "Jardin", "Loggia", "Cour"],
  dependance: ["Studio indépendant", "T2 indépendant", "T3 indépendant", "T4 indépendant", "Maison d'amis", "Garage indépendant", "Atelier", "Pool house", "Abri de jardin", "Grange", "Cabanon", "Bureau / local pro"],
  equipements: ["Climatisation", "Piscine", "Cheminée / poêle", "Volets roulants électriques", "Alarme", "Portail motorisé", "Panneaux solaires", "Fibre", "Interphone / visiophone", "Adapté PMR"],
};

const DPE_COLORS: Record<string, string> = {
  A: "#1d9d51", B: "#52b153", C: "#a5c93b", D: "#f2e211", E: "#f0b418", F: "#e97f24", G: "#e3282a",
};

function LoadingOverlay({ status }: { status: string }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = Math.floor(elapsed / 60);
  const ss = String(elapsed % 60).padStart(2, "0");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/85 p-4 backdrop-blur-sm">
      <div className="rise-in w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-xl font-bold text-white">
          IA
        </div>
        <h2 className="text-lg font-bold text-navy">Analyse en cours</h2>
        <p className="mt-2 min-h-10 text-sm text-slate-600">{status || "Préparation de l'analyse…"}</p>
        <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="scan-bar relative h-full w-full rounded-full bg-copper" />
        </div>
        <p className="mt-4 text-xs text-slate-400">
          {mm}:{ss} écoulées — analyse des ventes réelles et des photos, comptez 1 à 3 minutes.
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [input, setInput] = useState<PropertyInput>(initialInput);
  const [step, setStep] = useState(0);
  // Mission audit : la saisie se limite au client + lien de l'annonce —
  // l'IA extrait la fiche du bien depuis l'annonce elle-même
  const auditMode = (input.mission ?? "vente") === "audit";
  const steps = auditMode ? (["Client", "Annonce à auditer"] as const) : STEPS;
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EstimateResponse | null>(null);
  const [history, setHistory] = useState<HistoryMeta[]>([]);
  const [historyLocked, setHistoryLocked] = useState(true);
  const [historyPwd, setHistoryPwd] = useState("");
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [printOnOpen, setPrintOnOpen] = useState(false);

  const refreshHistory = () => {
    listEstimations()
      .then((rows) => {
        setHistory(rows);
        setHistoryLocked(false);
      })
      .catch((err) => {
        if (err instanceof HistoryLockedError) setHistoryLocked(true);
      });
  };
  // Au chargement : si le mot de passe de la session est encore valide,
  // l'historique s'ouvre directement
  useEffect(refreshHistory, []);

  const unlockHistory = async () => {
    setHistoryError(null);
    setHistoryKey(historyPwd);
    try {
      const rows = await listEstimations();
      setHistory(rows);
      setHistoryLocked(false);
      setHistoryPwd("");
    } catch {
      setHistoryKey("");
      setHistoryError("Mot de passe incorrect.");
    }
  };
  // Téléchargement direct depuis l'historique : ouvre le dossier puis
  // déclenche l'impression PDF une fois la page rendue
  useEffect(() => {
    if (result && printOnOpen) {
      setPrintOnOpen(false);
      const t = setTimeout(() => window.print(), 900);
      return () => clearTimeout(t);
    }
  }, [result, printOnOpen]);

  const openEntry = async (id: string, print: boolean) => {
    const full = await getEstimation(id).catch(() => null);
    if (!full) return;
    setInput(full.input);
    setPrintOnOpen(print);
    setResult(full.result);
    window.scrollTo({ top: 0 });
  };

  const removeEntry = async (id: string) => {
    await deleteEstimation(id).catch(() => {});
    refreshHistory();
  };

  const set = <K extends keyof PropertyInput>(key: K, value: PropertyInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const num = (v: string) => (v === "" ? null : +v);
  const numFromLabel = (v: string) => (v === "" ? null : parseInt(v, 10));

  const stepValid = (s: number): boolean => {
    if (s === 0) return input.clientNom.trim() !== "";
    if (auditMode) return s !== 1 || /^https?:\/\/\S+/.test((input.urlAnnonce ?? "").trim());
    if (s === 1) return input.adresse.trim() !== "" && /^\d{5}$/.test(input.codePostal) && input.ville.trim() !== "";
    if (s === 2) return input.surfaceHabitable !== null && input.surfaceHabitable > 0;
    return true;
  };

  const stepError = (s: number): string =>
    s === 0
      ? "Renseignez au minimum le nom du client vendeur."
      : auditMode
        ? "Collez le lien complet de l'annonce à auditer (https://…)."
        : s === 1
          ? "Renseignez l'adresse, un code postal à 5 chiffres et la ville."
          : "Renseignez la surface habitable.";

  const goTo = (target: number) => {
    if (target <= step || [...Array(target).keys()].every(stepValid)) {
      setStep(target);
      setError(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const next = () => {
    if (!stepValid(step)) {
      setError(stepError(step));
      return;
    }
    goTo(step + 1);
  };

  const handlePhotos = async (files: FileList | null) => {
    if (!files) return;
    setError(null);
    try {
      const compressed: PhotoInput[] = [];
      for (const file of Array.from(files).slice(0, 20 - input.photos.length)) {
        compressed.push(await compressImage(file));
      }
      set("photos", [...input.photos, ...compressed]);
    } catch {
      setError("Impossible de traiter une des photos.");
    }
  };

  // Appelle une phase de l'analyse et lit le flux NDJSON (statuts + résultat)
  const streamPhase = async (payload: Record<string, unknown>): Promise<Record<string, unknown>> => {
    const res = await fetch("/api/estimate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok || !res.body) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error ?? `Erreur serveur (${res.status})`);
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let result: Record<string, unknown> | null = null;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim()) continue;
        const msg = JSON.parse(line);
        if (msg.type === "status") setLoadingStatus(msg.label);
        else if (msg.type === "result") result = msg.data as Record<string, unknown>;
        else if (msg.type === "error") throw new Error(msg.error);
      }
    }
    if (!result) throw new Error("Analyse interrompue avant la fin — réessayez.");
    return result;
  };

  const submit = async () => {
    // La dernière étape se valide aussi (en audit, c'est l'URL de l'annonce)
    if (!stepValid(step)) {
      setError(stepError(step));
      return;
    }
    setLoading(true);
    setLoadingStatus("");
    setError(null);
    try {
      // Une seule phase : ventes réelles DVF autour de l'adresse du bien
      // + analyse des photos + rédaction du dossier
      const rapportPhase = await streamPhase({ ...input });
      const estimation = {
        report: rapportPhase.report,
        dvfSales: rapportPhase.dvfSales,
        dvfSource: rapportPhase.dvfSource,
        engine: rapportPhase.engine,
        subject: rapportPhase.subject ?? null,
      } as unknown as EstimateResponse;
      // Mission audit par lien : le serveur renvoie la fiche ENRICHIE par
      // l'annonce (localisation, surface, DPE…) — le dossier l'affiche
      if (rapportPhase.input) setInput(rapportPhase.input as PropertyInput);
      setResult(estimation);
      window.scrollTo({ top: 0, behavior: "smooth" });
      // La sauvegarde dans l'historique partagé est faite par le serveur
      refreshHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  const numLabel = (v: number | null) => (v === null ? "" : v >= 8 ? "8 et +" : String(v));

  return (
    <div className="min-h-screen">
      {loading && <LoadingOverlay status={loadingStatus} />}

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
          <Report result={result} input={input} onReset={() => { setResult(null); setStep(0); }} />
        ) : (
          <>
            <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 print:hidden">
              {(
                [
                  ["vente", "💶", "Estimation vente", "Avis de valeur pour vendre le bien"],
                  ["audit", "🔍", "Audit de commercialisation", "Collez le lien de l'annonce : l'IA fait le reste"],
                  ["locatif", "🔑", "Estimation locative", "Loyer conseillé + rendement locatif"],
                  ["bienloue", "🏢", "Bien vendu loué", "Prix par la rentabilité nette 6 à 8 %"],
                ] as const
              ).map(([m, icon, titre, texte]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { set("mission", m); setStep(0); }}
                  className={`rounded-2xl border-2 p-4 text-left transition ${
                    (input.mission ?? "vente") === m
                      ? "border-copper bg-copper-soft/50 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="mb-1 text-2xl">{icon}</div>
                  <div className="text-sm font-bold text-navy">{titre}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{texte}</div>
                </button>
              ))}
            </div>

            <nav className="mb-8 print:hidden">
              <div className="flex items-center">
                {steps.map((label, i) => (
                  <div key={label} className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`}>
                    <button type="button" onClick={() => goTo(i)} className="group flex flex-col items-center gap-1.5">
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
                    {i < steps.length - 1 && (
                      <div className={`mx-2 mb-5 h-0.5 flex-1 rounded ${i < step ? "bg-navy" : "bg-slate-300"}`} />
                    )}
                  </div>
                ))}
              </div>
            </nav>

            <div key={step} className="rise-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {step === 0 && (
                <>
                  <h2 className="mb-1 text-xl font-bold text-navy">Le client vendeur</h2>
                  <p className="mb-6 text-sm text-slate-500">
                    Ces informations figurent sur la page de garde du dossier remis au client.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Select label="Civilité" value={input.clientCivilite} onChange={(v) => set("clientCivilite", v)} options={OPT.civilite} />
                    <Field label="Nom *">
                      <input className={inputCls} value={input.clientNom} onChange={(e) => set("clientNom", e.target.value)} placeholder="Dupont" />
                    </Field>
                    <Field label="Prénom">
                      <input className={inputCls} value={input.clientPrenom} onChange={(e) => set("clientPrenom", e.target.value)} placeholder="Marie" />
                    </Field>
                    <Field label="Téléphone">
                      <input className={inputCls} inputMode="tel" value={input.clientTel} onChange={(e) => set("clientTel", e.target.value)} placeholder="06 12 34 56 78" />
                    </Field>
                    <Field label="Email">
                      <input className={inputCls} inputMode="email" value={input.clientEmail} onChange={(e) => set("clientEmail", e.target.value)} placeholder="marie.dupont@mail.fr" />
                    </Field>
                    <Select label="Horizon de vente" value={input.horizonVente} onChange={(v) => set("horizonVente", v)} options={OPT.horizon} />
                    <Field label="Négociateur en charge">
                      <input className={inputCls} value={input.negociateur} onChange={(e) => set("negociateur", e.target.value)} placeholder="Votre nom (affiché sur le dossier)" />
                    </Field>
                    <Field label="Téléphone du négociateur">
                      <input className={inputCls} inputMode="tel" value={input.negociateurTel} onChange={(e) => set("negociateurTel", e.target.value)} placeholder="06 12 34 56 78" />
                    </Field>
                    <Field label="Email du négociateur">
                      <input className={inputCls} inputMode="email" value={input.negociateurEmail} onChange={(e) => set("negociateurEmail", e.target.value)} placeholder="prenom.nom@century21.fr" />
                    </Field>
                    <Field label="Photo du négociateur (affichée sur le dossier)" className="sm:col-span-3">
                      <div className="flex items-center gap-3">
                        {input.negociateurPhoto ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`data:${input.negociateurPhoto.mediaType};base64,${input.negociateurPhoto.data}`}
                              alt="Photo du négociateur"
                              className="h-14 w-14 rounded-full border-2 border-copper object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => set("negociateurPhoto", null)}
                              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                            >
                              Retirer
                            </button>
                          </>
                        ) : (
                          <label className="cursor-pointer rounded-lg border border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:border-copper hover:text-copper">
                            📷 Ajouter ma photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                try {
                                  set("negociateurPhoto", await compressImage(f));
                                } catch {
                                  setError("Impossible de traiter la photo.");
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </Field>
                  </div>
                </>
              )}

              {step === 1 && !auditMode && (
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

              {step === 2 && !auditMode && (
                <>
                  <h2 className="mb-1 text-xl font-bold text-navy">Décrivez le bien</h2>
                  <p className="mb-6 text-sm text-slate-500">
                    Tout se sélectionne — seule la surface se saisit. Plus la fiche est complète, plus
                    l&apos;estimation est précise.
                  </p>
                  <div className="mb-5 flex flex-wrap gap-2">
                    {(["appartement", "maison", "terrain", "immeuble", "local"] as const).map((t) => (
                      <Chip key={t} active={input.typeBien === t} onClick={() => set("typeBien", t)}>
                        {t === "local" ? "Local commercial" : t.charAt(0).toUpperCase() + t.slice(1)}
                      </Chip>
                    ))}
                  </div>

                  <h3 className="mb-3 mt-6 text-xs font-bold uppercase tracking-widest text-copper">Dimensions</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label={input.typeBien === "maison" ? "Surface habitable du logement principal (m²) *" : "Surface habitable (m²) *"}>
                      <input type="number" min={1} className={inputCls} value={input.surfaceHabitable ?? ""} onChange={(e) => set("surfaceHabitable", num(e.target.value))} placeholder="65" />
                    </Field>
                    <Field label="Surface terrain (m²)">
                      <input type="number" className={inputCls} value={input.surfaceTerrain ?? ""} onChange={(e) => set("surfaceTerrain", num(e.target.value))} placeholder="—" />
                    </Field>
                    <Select label="Pièces" value={numLabel(input.nbPieces)} onChange={(v) => set("nbPieces", numFromLabel(v))} options={OPT.pieces} />
                    <Select label="Chambres" value={numLabel(input.nbChambres)} onChange={(v) => set("nbChambres", numFromLabel(v))} options={OPT.pieces} />
                    <Select label="Salles de bain / d'eau" value={numLabel(input.nbSallesDeBain)} onChange={(v) => set("nbSallesDeBain", numFromLabel(v))} options={OPT.pieces} />
                    <Select label="Étage / niveaux" value={input.etage} onChange={(v) => set("etage", v)} options={OPT.etage} />
                  </div>

                  <h3 className="mb-3 mt-6 text-xs font-bold uppercase tracking-widest text-copper">Construction & état</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Select label="Année de construction" value={input.anneeConstruction} onChange={(v) => set("anneeConstruction", v)} options={OPT.annee} />
                    <Select label="État général" value={input.etatGeneral} onChange={(v) => set("etatGeneral", v)} options={OPT.etat} />
                    <Select label="Chauffage" value={input.chauffage} onChange={(v) => set("chauffage", v)} options={OPT.chauffage} />
                    <Select label="Menuiseries / vitrage" value={input.menuiseries} onChange={(v) => set("menuiseries", v)} options={OPT.menuiseries} />
                    <Select label="Cuisine" value={input.cuisine} onChange={(v) => set("cuisine", v)} options={OPT.cuisine} />
                    {input.typeBien === "maison" && (
                      <Select label="Mitoyenneté" value={input.mitoyennete} onChange={(v) => set("mitoyennete", v)} options={OPT.mitoyennete} />
                    )}
                  </div>
                  <div className="mt-4">
                    <ChipGroup label="Travaux à prévoir" options={OPT.travaux} values={input.travauxAPrevoir} onChange={(v) => set("travauxAPrevoir", v)} />
                  </div>

                  <h3 className="mb-3 mt-6 text-xs font-bold uppercase tracking-widest text-copper">Diagnostics énergie</h3>
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

                  <h3 className="mb-3 mt-6 text-xs font-bold uppercase tracking-widest text-copper">Cadre de vie</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Select label="Luminosité" value={input.luminosite} onChange={(v) => set("luminosite", v)} options={OPT.luminosite} />
                    <Select label="Vue" value={input.vue} onChange={(v) => set("vue", v)} options={OPT.vue} />
                    <Select label="Environnement sonore" value={input.environnement} onChange={(v) => set("environnement", v)} options={OPT.environnement} />
                  </div>
                  <div className="mt-4 space-y-4">
                    <ChipGroup label="Exposition" options={OPT.exposition} values={input.exposition} onChange={(v) => set("exposition", v)} />
                    <ChipGroup label="Extérieurs" options={OPT.exterieur} values={input.exterieur} onChange={(v) => set("exterieur", v)} />
                    <ChipGroup label="Équipements & options" options={OPT.equipements} values={input.equipements} onChange={(v) => set("equipements", v)} />
                    <div className="flex flex-wrap gap-2">
                      <Chip active={input.ascenseur} onClick={() => set("ascenseur", !input.ascenseur)}>Ascenseur</Chip>
                      <Chip active={input.cave} onClick={() => set("cave", !input.cave)}>Cave</Chip>
                    </div>
                  </div>

                  <h3 className="mb-3 mt-6 text-xs font-bold uppercase tracking-widest text-copper">Stationnement & charges</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Select label="Stationnement" value={input.stationnement} onChange={(v) => set("stationnement", v)} options={OPT.stationnement} />
                    <Field label="Charges copro (€/mois)">
                      <input type="number" className={inputCls} value={input.chargesCopro ?? ""} onChange={(e) => set("chargesCopro", num(e.target.value))} placeholder="—" />
                    </Field>
                    <Field label="Taxe foncière (€/an)">
                      <input type="number" className={inputCls} value={input.taxeFonciere ?? ""} onChange={(e) => set("taxeFonciere", num(e.target.value))} placeholder="—" />
                    </Field>
                  </div>

                  {input.typeBien === "maison" && (
                    <>
                      <h3 className="mb-3 mt-6 text-xs font-bold uppercase tracking-widest text-copper">Dépendances</h3>
                      <div className="space-y-2">
                        {input.dependances.map((d, i) => (
                          <div key={i} className="flex flex-wrap items-center gap-2">
                            <select
                              className={`${inputCls} w-auto flex-1`}
                              value={d.type}
                              onChange={(e) => {
                                const next = [...input.dependances];
                                next[i] = { ...next[i], type: e.target.value };
                                set("dependances", next);
                              }}
                            >
                              {OPT.dependance.map((o) => (
                                <option key={o}>{o}</option>
                              ))}
                            </select>
                            <input
                              type="number"
                              className={`${inputCls} w-32`}
                              placeholder="Surface m²"
                              value={d.surface ?? ""}
                              onChange={(e) => {
                                const next = [...input.dependances];
                                next[i] = { ...next[i], surface: num(e.target.value) };
                                set("dependances", next);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => set("dependances", input.dependances.filter((_, j) => j !== i))}
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => set("dependances", [...input.dependances, { type: OPT.dependance[0], surface: null }])}
                          className="rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-copper hover:text-copper"
                        >
                          + Ajouter une dépendance (studio, T2/T3/T4, garage…)
                        </button>
                        {surfaceDependancesHabitables(input) > 0 && (
                          <p className="rounded-lg bg-copper-soft/50 px-3 py-2 text-sm font-semibold text-navy">
                            Surface habitable totale du dossier :{" "}
                            {surfaceHabitableTotale(input)} m²{" "}
                            <span className="font-normal text-slate-500">
                              (logement principal {input.surfaceHabitable ?? 0} m² + dépendances
                              habitables {surfaceDependancesHabitables(input)} m² — calcul
                              automatique)
                            </span>
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}

              {step === 3 && !auditMode && (
                <>
                  <h2 className="mb-1 text-xl font-bold text-navy">Photos du bien</h2>
                  <p className="mb-6 text-sm text-slate-500">
                    L&apos;IA évalue l&apos;état réel, la luminosité et les prestations — et annote chaque
                    photo (bons points / défauts) dans le dossier. Jusqu&apos;à 20 photos.
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

              {(auditMode ? step === 1 : step === 4) && (
                <>
                  <h2 className="mb-1 text-xl font-bold text-navy">
                    {input.mission === "audit"
                      ? "L'annonce à auditer"
                      : input.mission === "locatif"
                        ? "Projet locatif"
                        : input.mission === "bienloue"
                          ? "Location en place"
                          : "Contexte de vente"}
                  </h2>
                  <p className="mb-6 text-sm text-slate-500">
                    {input.mission === "audit"
                      ? "Collez simplement le lien de l'annonce : l'IA lit l'annonce, en extrait la fiche du bien et son historique, estime la valeur réelle sur la même base de calcul que l'estimation classique, puis établit le diagnostic et les axes d'amélioration."
                      : input.mission === "locatif"
                        ? "L'IA fixe le loyer conseillé à partir des indicateurs officiels de loyers et calcule le rendement brut."
                        : input.mission === "bienloue"
                          ? "Le bien est vendu loué : son prix est établi par capitalisation du loyer NET (loyer − charges non récupérables − taxe foncière) à une rentabilité nette de 6 à 8 %."
                          : "Si le vendeur a un prix en tête, l'IA le positionnera face au marché et vous fournira l'argumentaire pour recadrer si besoin."}
                  </p>

                  {input.mission === "audit" && (() => {
                    // Multidiffusion : la même annonce peut être fournie via
                    // plusieurs liens, chacun ANNOTÉ de sa source (notre
                    // agence, agence concurrente, portail…) — si un site
                    // bloque, l'IA ouvre le suivant
                    const SOURCES = ["Site de notre agence", "Agence concurrente", "SeLoger", "Leboncoin", "Bien'ici", "Autre portail"];
                    const links = input.urlsAnnonce?.length ? input.urlsAnnonce : [input.urlAnnonce ?? ""];
                    const srcs = links.map((_, i) => input.sourcesAnnonce?.[i] ?? SOURCES[Math.min(i, 1)]);
                    const setLinks = (nextLinks: string[], nextSrcs: string[]) =>
                      setInput((prev) => ({
                        ...prev,
                        urlsAnnonce: nextLinks,
                        sourcesAnnonce: nextSrcs,
                        urlAnnonce: nextLinks.find((u) => u.trim())?.trim() ?? "",
                      }));
                    return (
                      <div className="mb-4">
                        {links.map((u, i) => (
                          <div key={i} className="mb-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                            <div className="mb-2 flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Lien {i + 1}{i === 0 ? " — annonce à auditer *" : " — la même annonce sur un autre site"}
                              </span>
                              {i > 0 && (
                                <button
                                  type="button"
                                  onClick={() => setLinks(links.filter((_, j) => j !== i), srcs.filter((_, j) => j !== i))}
                                  className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs text-slate-500 transition hover:bg-slate-100"
                                  aria-label="Retirer ce lien"
                                >
                                  ✕ Retirer
                                </button>
                              )}
                            </div>
                            <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
                              <Field label="Source du lien">
                                <select
                                  className={inputCls}
                                  value={srcs[i]}
                                  onChange={(e) => setLinks(links, srcs.map((x, j) => (j === i ? e.target.value : x)))}
                                >
                                  {SOURCES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </Field>
                              <Field label="Adresse du lien (URL)">
                                <input
                                  className={inputCls}
                                  inputMode="url"
                                  value={u}
                                  onChange={(e) => setLinks(links.map((x, j) => (j === i ? e.target.value : x)), srcs)}
                                  placeholder={i === 0 ? "https://www.votre-agence.fr/annonce/… (site d'agence de préférence)" : "https://www.seloger.com/annonces/…"}
                                />
                              </Field>
                            </div>
                          </div>
                        ))}
                        {links.length < 4 && (
                          <button
                            type="button"
                            onClick={() => setLinks([...links, ""], [...srcs, links.length === 0 ? SOURCES[0] : SOURCES[2]])}
                            className="rounded-lg border border-dashed border-copper px-4 py-2 text-sm font-semibold text-copper transition hover:bg-copper-soft/40"
                          >
                            + Ajouter un autre lien de la même annonce (autre site)
                          </button>
                        )}
                        <div className="mt-4 rounded-xl border border-copper/40 bg-copper-soft/40 p-4 text-sm text-slate-700">
                          <span className="font-semibold text-navy">C&apos;est tout ce qu&apos;il faut.</span>{" "}
                          L&apos;IA ouvre l&apos;annonce et fait le reste : fiche du bien (localisation,
                          surface, pièces, DPE, prix affiché), historique de diffusion (ancienneté,
                          baisses de prix), estimation de la valeur réelle sur les ventes DVF du
                          secteur — la même base de calcul que l&apos;estimation classique — puis prix
                          de relance et recommandations (prix, texte, photos, diffusion).{" "}
                          <b>Astuce :</b> mettez le lien du site de l&apos;agence en premier, ajoutez
                          les liens des portails (SeLoger, Leboncoin…) et annotez la source de chacun —
                          si un site bloque la lecture, l&apos;IA passe au suivant et croise les versions.
                          Si le bien est diffusé par plusieurs agences (mandat simple), l&apos;IA le
                          relève : prix divergents entre agences = constat d&apos;audit à part entière.
                        </div>
                      </div>
                    );
                  })()}

                  {input.mission === "locatif" && (
                    <div className="mb-4 grid gap-4 sm:grid-cols-2">
                      <Select label="Type de location" value={input.meuble ?? "Vide"} onChange={(v) => set("meuble", v)} options={["Vide", "Meublé"]} />
                      <Field label="Loyer envisagé par le propriétaire (€/mois)">
                        <input type="number" className={inputCls} value={input.loyerSouhaite ?? ""} onChange={(e) => set("loyerSouhaite", num(e.target.value))} placeholder="1200" />
                      </Field>
                    </div>
                  )}

                  {input.mission === "bienloue" && (
                    <>
                      <div className="mb-4 grid gap-4 sm:grid-cols-2">
                        <Field label="Loyer actuellement perçu (€/mois hors charges) *">
                          <input type="number" className={inputCls} value={input.loyerActuel ?? ""} onChange={(e) => set("loyerActuel", num(e.target.value))} placeholder="850" />
                        </Field>
                        <Field label="Charges non récupérables du propriétaire (€/an)">
                          <input type="number" className={inputCls} value={input.chargesNonRecuperables ?? ""} onChange={(e) => set("chargesNonRecuperables", num(e.target.value))} placeholder="600" />
                        </Field>
                        <Field label="Taxe foncière (€/an)">
                          <input type="number" className={inputCls} value={input.taxeFonciere ?? ""} onChange={(e) => set("taxeFonciere", num(e.target.value))} placeholder="1100" />
                        </Field>
                        <Select label="Type de location en place" value={input.meuble ?? "Vide"} onChange={(v) => set("meuble", v)} options={["Vide", "Meublé"]} />
                      </div>
                      {loyerNetAnnuel(input) > 0 && (
                        <div className="mb-4 rounded-xl border border-copper/40 bg-copper-soft/40 p-4 text-sm text-slate-700">
                          <span className="font-semibold text-navy">Aperçu du calcul :</span>{" "}
                          loyer net annuel <b>{int.format(loyerNetAnnuel(input))} €</b> → fourchette de prix{" "}
                          <b>
                            {int.format(prixParRendement(loyerNetAnnuel(input), RENDEMENT_NET_HAUT))} € (8 % net) —{" "}
                            {int.format(prixParRendement(loyerNetAnnuel(input), RENDEMENT_NET_BAS))} € (6 % net)
                          </b>
                        </div>
                      )}
                      <h3 className="mb-1 mt-6 text-sm font-bold uppercase tracking-wide text-navy">Plus-value immobilière (facultatif)</h3>
                      <p className="mb-4 text-xs text-slate-500">
                        Renseignez l&apos;acquisition pour ajouter au dossier le calcul complet de la plus-value :
                        durée de détention, abattements fiscaux, impôt (19 % + 17,2 %) et net vendeur.
                      </p>
                      <div className="mb-4 grid gap-4 sm:grid-cols-2">
                        <Field label="Prix d'acquisition du bien (€)">
                          <input type="number" className={inputCls} value={input.prixAcquisition ?? ""} onChange={(e) => set("prixAcquisition", num(e.target.value))} placeholder="95000" />
                        </Field>
                        <Field label="Année d'acquisition">
                          <input type="number" className={inputCls} value={input.anneeAcquisition ?? ""} onChange={(e) => set("anneeAcquisition", num(e.target.value))} placeholder="2015" />
                        </Field>
                        <Field label="Frais d'acquisition réels (€ — sinon forfait 7,5 %)">
                          <input type="number" className={inputCls} value={input.fraisAcquisitionReels ?? ""} onChange={(e) => set("fraisAcquisitionReels", num(e.target.value))} placeholder="laisser vide = forfait" />
                        </Field>
                        <Field label="Travaux justifiés (€ — sinon forfait 15 % si +5 ans)">
                          <input type="number" className={inputCls} value={input.travauxRealises ?? ""} onChange={(e) => set("travauxRealises", num(e.target.value))} placeholder="laisser vide = forfait" />
                        </Field>
                      </div>
                    </>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    {(input.mission ?? "vente") === "vente" && (
                      <Field label="Prix souhaité par le vendeur (€)">
                        <input type="number" className={inputCls} value={input.prixSouhaiteVendeur ?? ""} onChange={(e) => set("prixSouhaiteVendeur", num(e.target.value))} placeholder="320000" />
                      </Field>
                    )}
                    <Field label="Contexte (mutation, succession, divorce…)">
                      <input className={inputCls} value={input.contexteVente} onChange={(e) => set("contexteVente", e.target.value)} />
                    </Field>
                    <Field label="Commentaires du négociateur" className="sm:col-span-2">
                      <textarea rows={4} className={inputCls} value={input.commentaires} onChange={(e) => set("commentaires", e.target.value)} placeholder="Nuisances, copropriété, éléments non visibles sur les photos…" />
                    </Field>
                  </div>
                  <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                    <span className="font-semibold text-navy">Récapitulatif :</span>{" "}
                    {[input.clientCivilite, input.clientPrenom, input.clientNom].filter(Boolean).join(" ") || "client n.c."} —{" "}
                    {auditMode
                      ? (input.urlAnnonce?.trim()
                          ? `annonce à auditer : ${input.urlAnnonce.trim()}${(input.urlsAnnonce ?? []).filter((u) => u.trim()).length > 1 ? ` (+ ${(input.urlsAnnonce ?? []).filter((u) => u.trim()).length - 1} autre(s) diffusion(s))` : ""}`
                          : "lien d'annonce à renseigner")
                      : `${input.typeBien} ${input.surfaceHabitable ?? "?"} m², ${input.adresse || "adresse n.c."}, ${input.codePostal} ${input.ville} — ${input.photos.length} photo${input.photos.length > 1 ? "s" : ""}, DPE ${input.dpe || "n.c."}`}
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
                {step < steps.length - 1 ? (
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

            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 print:hidden">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-navy">🔒 Historique des estimations</h2>
                    <p className="text-xs text-slate-500">
                      Partagé avec toute l'équipe — accès protégé par le mot de passe de l'agence.
                    </p>
                  </div>
                  {!historyLocked && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {history.length} dossier{history.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {historyLocked ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="password"
                      className={`${inputCls} w-64`}
                      placeholder="Mot de passe de l'agence"
                      value={historyPwd}
                      onChange={(e) => setHistoryPwd(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && unlockHistory()}
                    />
                    <button
                      type="button"
                      onClick={unlockHistory}
                      className="rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-deep"
                    >
                      Déverrouiller
                    </button>
                    {historyError && <span className="text-sm text-red-600">{historyError}</span>}
                  </div>
                ) : history.length === 0 ? (
                  <p className="text-sm text-slate-500">Aucune estimation enregistrée pour le moment.</p>
                ) : (
                  <>
                <ul className="divide-y divide-slate-100">
                  {history.map((h) => (
                    <li key={h.id} className="flex flex-wrap items-center gap-3 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-navy">
                          {h.client} <span className="font-normal text-slate-400">·</span> {h.bien}
                        </p>
                        <p className="text-xs text-slate-500">
                          {h.ville} — {new Date(h.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                          {h.fourchetteBasse > 0 && (
                            <>
                              {" · "}
                              <b className="text-copper">
                                {int.format(h.fourchetteBasse)} € – {int.format(h.fourchetteHaute)} €
                              </b>
                            </>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEntry(h.id, false)}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                        >
                          Consulter
                        </button>
                        <button
                          type="button"
                          onClick={() => openEntry(h.id, true)}
                          className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-navy-deep"
                        >
                          📄 Télécharger
                        </button>
                        <button
                          type="button"
                          onClick={() => removeEntry(h.id)}
                          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          title="Supprimer de l'historique"
                        >
                          🗑
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                  </>
                )}
              </section>
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
