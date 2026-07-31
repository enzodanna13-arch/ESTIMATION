"use client";

import { useState } from "react";
import { SelecteurPiecesClient } from "@/components/ClientsPage";
import type { DocumentInput } from "@/lib/docTypes";
import { getHistoryKey } from "@/lib/history";

const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-copper focus:ring-2 focus:ring-copper/30";

type Piece = { nom: string; taille: number; data: string }; // data = base64

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

async function fileToPiece(f: File): Promise<Piece> {
  const buf = await f.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let bin = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  return { nom: f.name, taille: f.size, data: btoa(bin) };
}

const num = (v: string) => (v === "" ? null : +v);

/**
 * Formulaire du mandat simple de vente + DPI. Le modèle est figé (texte légal
 * et coordonnées de l'agence en dur dans MandatVente) ; seuls les champs
 * variables sont saisis ici. Un pré-remplissage IA lit la pièce d'identité, le
 * titre de propriété (ou un mandat déjà rempli) et complète l'état civil du
 * mandant et la désignation du bien — SANS RIEN INVENTER. Les pièces ne sont
 * jamais stockées côté serveur : elles servent uniquement à la lecture.
 */
export default function MandatForm({
  docInput,
  setD,
  setDocInput,
}: {
  docInput: DocumentInput;
  setD: <K extends keyof DocumentInput>(key: K, value: DocumentInput[K]) => void;
  setDocInput: React.Dispatch<React.SetStateAction<DocumentInput>>;
}) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [importOuvert, setImportOuvert] = useState(false);
  const [iaEnCours, setIaEnCours] = useState(false);
  const [iaMessage, setIaMessage] = useState<string | null>(null);

  const ajouterFichiers = async (files: FileList | null) => {
    if (!files) return;
    const nouvelles: Piece[] = [];
    for (const f of Array.from(files)) {
      if (!f.name.toLowerCase().endsWith(".pdf") && !f.type.startsWith("image/")) continue;
      nouvelles.push(await fileToPiece(f));
    }
    setPieces((prev) => [...prev, ...nouvelles]);
  };

  const preRemplir = async () => {
    if (pieces.length === 0) {
      setIaMessage("Ajoutez d'abord la pièce d'identité et le titre de propriété (ou un mandat déjà rempli).");
      return;
    }
    setIaEnCours(true);
    setIaMessage(null);
    try {
      // Limite d'envoi serveur (~4,5 Mo) : les pièces les plus légères d'abord
      const triees = [...pieces].sort((a, b) => a.taille - b.taille);
      let total = 0;
      const retenues: Piece[] = [];
      for (const p of triees) {
        if (total + p.taille > 3_800_000) continue;
        total += p.taille;
        retenues.push(p);
      }
      if (retenues.length === 0) throw new Error("Pièces trop lourdes pour la lecture IA (limite ~4 Mo).");
      const res = await fetch("/api/mandat-extract", {
        method: "POST",
        headers: { "content-type": "application/json", "x-history-key": getHistoryKey() },
        body: JSON.stringify({ fichiers: retenues.map((p) => ({ nom: p.nom, data: p.data })) }),
      });
      const body = (await res.json()) as { champs?: Record<string, string | number>; error?: string };
      if (!res.ok || !body.champs) throw new Error(body.error ?? "Lecture impossible.");
      const champs = body.champs;
      let remplis = 0;
      setDocInput((prev) => {
        const n = { ...prev } as Record<string, unknown>;
        for (const [k, v] of Object.entries(champs)) {
          if (v === null || v === undefined || String(v).trim() === "") continue;
          const actuel = n[k];
          const vide = actuel === null || actuel === undefined || String(actuel).trim() === "" || actuel === 0;
          if (vide) {
            n[k] = v;
            remplis += 1;
          }
        }
        return n as unknown as DocumentInput;
      });
      const ignorees = pieces.length - retenues.length;
      setIaMessage(
        `✓ ${remplis} champ${remplis > 1 ? "s" : ""} pré-rempli${remplis > 1 ? "s" : ""} à partir de ${retenues.length} pièce${retenues.length > 1 ? "s" : ""}${ignorees > 0 ? ` (${ignorees} pièce(s) trop lourde(s) non lue(s))` : ""} — vérifiez et corrigez avant de générer.`,
      );
    } catch (err) {
      setIaMessage(err instanceof Error ? err.message : "Lecture des pièces impossible.");
    } finally {
      setIaEnCours(false);
    }
  };

  return (
    <div className="mb-4">
      {/* ---- Pré-remplissage IA ---- */}
      <div className="mb-5 rounded-2xl border border-copper/40 bg-copper-soft/30 p-4">
        <div className="mb-1 text-sm font-bold text-navy">🪄 Pré-remplissage automatique par l&apos;IA</div>
        <p className="mb-3 text-xs text-slate-600">
          Déposez la <b>pièce d&apos;identité</b> et le <b>titre de propriété</b> du vendeur (ou un <b>mandat déjà
          rempli</b>). L&apos;IA lit les documents et complète l&apos;état civil du mandant et la désignation du bien —
          <b> sans rien inventer</b>. Les pièces ne sont <b>pas conservées</b> : elles servent uniquement à la lecture.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-3 text-center text-xs font-semibold text-slate-500 transition hover:border-copper hover:text-copper">
            + Ajouter des pièces (PDF ou photo)
            <input
              type="file"
              accept="application/pdf,image/*"
              multiple
              className="hidden"
              onChange={(e) => { void ajouterFichiers(e.target.files); e.target.value = ""; }}
            />
          </label>
          <button
            type="button"
            onClick={() => setImportOuvert(!importOuvert)}
            className="rounded-xl border-2 border-dashed border-copper/60 p-3 text-center text-xs font-semibold text-copper transition hover:border-copper hover:bg-copper-soft/40"
          >
            📁 Importer depuis un dossier client
          </button>
        </div>

        {importOuvert && (
          <div className="mt-3">
            <SelecteurPiecesClient
              categorieParDefaut="Titre de propriété"
              precocher={(p) => ["Titre de propriété", "Pièce d'identité", "Mandat"].includes(p.categorie)}
              onAjouter={(nouvelles) => setPieces((prev) => [...prev, ...nouvelles])}
              onFermer={() => setImportOuvert(false)}
            />
          </div>
        )}

        {pieces.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {pieces.map((p, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5 text-xs text-slate-600 shadow-sm">
                <span className="truncate">📄 {p.nom} <span className="text-slate-400">({Math.round(p.taille / 1024)} Ko)</span></span>
                <button type="button" onClick={() => setPieces(pieces.filter((_, j) => j !== i))} className="ml-2 text-slate-400 hover:text-slate-700" aria-label="Retirer">✕</button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void preRemplir()}
            disabled={iaEnCours || pieces.length === 0}
            className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {iaEnCours ? "Lecture en cours…" : "🪄 Pré-remplir avec l'IA"}
          </button>
          {iaMessage && <span className="text-xs text-slate-600">{iaMessage}</span>}
        </div>
      </div>

      {/* ---- Champs variables ---- */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Numéro de mandat">
          <input className={inputCls} value={docInput.mandatNumero ?? ""} onChange={(e) => setD("mandatNumero", e.target.value)} placeholder="4521" />
        </Field>
        <Field label="Lieu de signature">
          <input className={inputCls} value={docInput.mandatLieu ?? ""} onChange={(e) => setD("mandatLieu", e.target.value)} placeholder="Martigues" />
        </Field>
        <Field label="Mandant — état civil complet *" className="sm:col-span-2">
          <textarea
            rows={4}
            className={inputCls}
            value={docInput.mandatMandant ?? ""}
            onChange={(e) => setD("mandatMandant", e.target.value)}
            placeholder={"Monsieur Jean DUPONT, né le 12/03/1970 à Marseille (13),\nde nationalité française, retraité,\net Madame Marie DUPONT née MARTIN, née le 05/07/1972 à Martigues (13),\ndemeurant ensemble 8 rue des Écoles, 13500 Martigues"}
          />
        </Field>
        <Field label="Désignation du bien à vendre *" className="sm:col-span-2">
          <textarea
            rows={4}
            className={inputCls}
            value={docInput.mandatBien ?? ""}
            onChange={(e) => setD("mandatBien", e.target.value)}
            placeholder={"Un appartement de type T3 de 67 m², au 2e étage,\nsis Résidence Le Canal, 12 quai Brescon, 13500 Martigues,\ncadastré section AB n° 245, lot n° 81 (46/1000es des parties communes),\navec une cave (lot n° 82) et un garage (lot n° 83)."}
          />
        </Field>
        <Field label="Prix de présentation (€)">
          <input type="number" className={inputCls} value={docInput.mandatPrix ?? ""} onChange={(e) => setD("mandatPrix", num(e.target.value))} placeholder="239000" />
        </Field>
        <Field label="Honoraires TTC (charge vendeur) (€)">
          <input type="number" className={inputCls} value={docInput.mandatHonoraires ?? ""} onChange={(e) => setD("mandatHonoraires", num(e.target.value))} placeholder="12000" />
        </Field>
        <Field label="Date de signature" className="sm:col-span-2">
          <input className={inputCls} value={docInput.mandatDate ?? ""} onChange={(e) => setD("mandatDate", e.target.value)} placeholder="le 31 juillet 2026 (vide : date du jour)" />
        </Field>
      </div>

      <div className="mt-4 rounded-xl border border-copper/40 bg-copper-soft/40 p-3 text-xs text-slate-600">
        <b className="text-navy">Modèle exact de l&apos;agence.</b> Le document reproduit fidèlement l&apos;Information
        Précontractuelle du Consommateur (DPI), le formulaire de rétractation et le mandat simple de vente CENTURY 21
        Icaza Immobilier. Textes de loi et coordonnées légales de l&apos;agence inclus automatiquement. Généré
        instantanément, sans IA (l&apos;IA n&apos;intervient que pour le pré-remplissage facultatif ci-dessus).
      </div>
    </div>
  );
}
