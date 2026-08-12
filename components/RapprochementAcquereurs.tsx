"use client";

import { useEffect, useMemo, useState } from "react";
import { listClients, type ClientDossier } from "@/lib/clients";
import { resumeRecherche } from "@/lib/acquereurs";
import { bienDepuisEstimation, NIVEAUX, rapprocherAcquereurs, type AcquereurMatch } from "@/lib/matching";
import type { EstimationReport, PropertyInput } from "@/lib/types";

const int = new Intl.NumberFormat("fr-FR");
const eur = (n: number | null | undefined) => (n != null ? `${int.format(n)} €` : "—");

type Anonymisation = "complet" | "initiale" | "anonyme";

function nomAffiche(d: ClientDossier, mode: Anonymisation, index: number): string {
  if (mode === "anonyme") return `${d.typeClient === "investisseur" ? "Investisseur" : "Acquéreur"} ${index + 1}`;
  const prenom = d.prenom ?? "";
  const nom = d.nom ?? "";
  if (mode === "initiale") return `${prenom} ${nom.slice(0, 1).toUpperCase()}${nom ? "." : ""}`.trim() || `Acquéreur ${index + 1}`;
  return [prenom, nom].filter(Boolean).join(" ") || `Acquéreur ${index + 1}`;
}

const COUL: Record<string, string> = { emerald: "bg-emerald-100 text-emerald-700", amber: "bg-amber-100 text-amber-700", slate: "bg-slate-100 text-slate-600" };

/**
 * Section « Rapprochement acquéreurs » affichée dans le dossier d'estimation
 * (et donc dans le PDF imprimé). Analyse les dossiers acquéreurs/investisseurs
 * de la base et fait ressortir les profils susceptibles d'être intéressés.
 * Le négociateur choisit le niveau d'anonymisation (RGPD : anonyme par défaut).
 */
export default function RapprochementAcquereurs({ input, report }: { input: PropertyInput; report: EstimationReport | null }) {
  const [dossiers, setDossiers] = useState<ClientDossier[] | null>(null);
  const [mode, setMode] = useState<Anonymisation>("anonyme");

  useEffect(() => { listClients().then(setDossiers).catch(() => setDossiers([])); }, []);

  const matches: AcquereurMatch[] = useMemo(() => {
    if (!dossiers) return [];
    const bien = bienDepuisEstimation(input, report);
    return rapprocherAcquereurs(bien, dossiers);
  }, [dossiers, input, report]);

  if (dossiers === null) return null;
  if (matches.length === 0) {
    return (
      <div className="print:hidden">
        <p className="text-sm text-slate-400">Aucun acquéreur du fichier ne correspond pour l&apos;instant à ce bien. Créez des dossiers Acquéreur/Investisseur pour activer le rapprochement.</p>
      </div>
    );
  }

  return (
    <div className="rapprochement">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 print:block">
        <p className="text-sm font-semibold text-navy">
          <b>{matches.length} acquéreur{matches.length > 1 ? "s" : ""}</b> actuellement en recherche pouvant correspondre à ce bien.
        </p>
        <div className="flex items-center gap-1 text-xs print:hidden">
          <span className="text-slate-400">Affichage :</span>
          {([["anonyme", "Anonyme"], ["initiale", "Prénom + initiale"], ["complet", "Noms complets"]] as const).map(([m, l]) => (
            <button key={m} type="button" onClick={() => setMode(m)} className={`rounded px-2 py-0.5 font-semibold ${mode === m ? "bg-navy text-white" : "border border-slate-200 text-slate-600"}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {matches.slice(0, 8).map((m, i) => {
          const d = m.dossier;
          const r = m.recherche;
          const niv = m.resultat.niveau ? NIVEAUX[m.resultat.niveau] : null;
          return (
            <div key={d.id} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-navy">{nomAffiche(d, mode, i)}</div>
                  <div className="text-[11px] font-semibold uppercase text-slate-400">{d.typeClient === "investisseur" ? "Investisseur" : "Acquéreur"}{d.statut ? ` · ${d.statut}` : ""}</div>
                </div>
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">{m.resultat.score}%</span>
              </div>
              <div className="mt-1.5 space-y-0.5 text-xs text-slate-600">
                <div>Budget : {eur(r.budgetMin)} – {eur(r.budgetMax)}</div>
                <div>Recherche : {resumeRecherche(d)}</div>
                {(r.surfaceMin || r.chambresMin) && <div>Min : {r.chambresMin ? `${r.chambresMin} ch.` : ""}{r.surfaceMin ? ` ${r.surfaceMin} m²` : ""}{r.exterieurs.length ? " · extérieur" : ""}</div>}
                <div>Financement : {d.financement?.financementValide === "oui" ? "validé ✓" : d.financement?.financementValide === "encours" ? "en cours" : "à confirmer"}</div>
              </div>
              {niv && <div className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${COUL[niv.couleur]}`}>{niv.label}</div>}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-slate-400 print:hidden">
        Rapprochement automatique — score de compatibilité pondéré (localisation, budget, type, surface, pièces, critères). Présentation respectueuse des données personnelles (anonyme par défaut).
      </p>
    </div>
  );
}
