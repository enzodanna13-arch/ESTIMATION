"use client";

import { useState } from "react";

// Coquille CRM : barre du haut (marque + sélecteur de métier) et barre latérale
// permanente regroupant les outils par compartiment. Purement de la NAVIGATION :
// aucun écran n'est réécrit, aucune donnée touchée. Les éléments sont en position
// fixe pour ne pas modifier l'arborescence des pages existantes.

export type Metier = "transaction" | "syndic" | "gestion";

interface Item {
  v: string; // valeur d'« univers » de l'appli
  t: string; // libellé
  i: string; // icône
  h?: string; // section d'historique éventuelle (pour l'univers "historique")
  tag?: string; // pastille facultative
}
interface Groupe {
  label: string;
  items: Item[];
}

const GROUPES: Groupe[] = [
  { label: "Pilotage", items: [
    { v: "dashboard", t: "Tableau de bord", i: "📊" },
    { v: "negociateurs", t: "Suivi des négociateurs", i: "👔" },
    { v: "espace", t: "Mon espace", i: "👤" },
  ] },
  { label: "Prospection", items: [
    { v: "leads", t: "Leads entrant", i: "📥" },
    { v: "estimations-clients", t: "Estimations clients", i: "🏛️" },
    { v: "registre", t: "Registre des appels", i: "📞" },
  ] },
  { label: "Estimations", items: [
    { v: "estimation", t: "Nouvelle estimation", i: "🏠" },
    { v: "historique", h: "estimations", t: "Historique estimations", i: "📈" },
  ] },
  { label: "Clients & dossiers", items: [
    { v: "clients", t: "Dossiers clients", i: "📁" },
  ] },
  { label: "Marketing & médias", items: [
    { v: "documents", t: "Génération de documents", i: "📄" },
    { v: "visites", t: "Montage vidéo & 360°", i: "🎬" },
  ] },
  { label: "Archives", items: [
    { v: "historique", h: "", t: "Historiques", i: "🗂️" },
    { v: "sauvegarde", t: "Sauvegarde", i: "💾" },
  ] },
];

const METIERS: { id: Metier; label: string; icon: string; soon?: boolean }[] = [
  { id: "transaction", label: "Transaction", icon: "🏠" },
  { id: "syndic", label: "Syndic", icon: "🏢", soon: true },
  { id: "gestion", label: "Gestion locative", icon: "🔑", soon: true },
];

export function CrmChrome({
  univers, histoSection, metier, onMetier, onNavigate, onReset,
}: {
  univers: string;
  histoSection: string;
  metier: Metier;
  onMetier: (m: Metier) => void;
  onNavigate: (v: string, h?: string) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const estActif = (it: Item) =>
    metier === "transaction" &&
    univers === it.v &&
    (it.h === undefined || histoSection === it.h);

  return (
    <>
      {/* Barre du haut */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center gap-3 bg-navy-deep px-3 text-white print:hidden sm:px-4">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-xl md:hidden"
          aria-label="Menu"
        >
          ☰
        </button>
        <button type="button" onClick={onReset} className="flex items-center gap-2.5" title="Accueil">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-copper text-lg font-black">21</span>
          <span className="hidden leading-tight sm:block">
            <b className="block text-sm font-bold tracking-wide">CENTURY 21</b>
            <span className="text-[11px] text-white/60">Icaza Immobilier · Martigues</span>
          </span>
        </button>

        <nav className="ml-2 hidden gap-1 md:flex">
          {METIERS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onMetier(m.id)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13.5px] font-semibold transition ${
                metier === m.id ? "bg-copper text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{m.icon}</span> {m.label}
              {m.soon && (
                <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-white/85">
                  à venir
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2.5 sm:flex">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-navy text-[13px] font-bold">C21</span>
          <span className="hidden leading-tight lg:block">
            <b className="block text-[13px] font-semibold">Équipe Icaza</b>
            <span className="text-[11px] text-white/55">Agence</span>
          </span>
        </div>
      </header>

      {/* Voile mobile */}
      {open && <div onClick={close} className="fixed inset-0 z-20 bg-navy-deep/50 md:hidden print:hidden" />}

      {/* Barre latérale */}
      <aside
        className={`fixed bottom-0 left-0 top-16 z-20 w-[268px] overflow-y-auto bg-navy px-3 pb-8 pt-4 text-white transition-transform duration-200 print:hidden md:translate-x-0 ${
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Sélecteur de métier sur mobile (repris dans le tiroir) */}
        <div className="mb-4 flex flex-col gap-1 md:hidden">
          {METIERS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => { onMetier(m.id); close(); }}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                metier === m.id ? "bg-copper text-white" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <span>{m.icon}</span> {m.label}
              {m.soon && <span className="ml-auto rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] font-bold uppercase">à venir</span>}
            </button>
          ))}
        </div>

        {GROUPES.map((g) => (
          <div key={g.label} className="mb-5">
            <div className="mb-1.5 px-2.5 text-[10.5px] font-bold uppercase tracking-wider text-white/40">{g.label}</div>
            <div className="flex flex-col gap-0.5">
              {g.items.map((it) => (
                <button
                  key={it.v + (it.h ?? "")}
                  type="button"
                  onClick={() => { onNavigate(it.v, it.h); close(); }}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-[13.5px] transition ${
                    estActif(it)
                      ? "bg-copper font-semibold text-white shadow-lg shadow-copper/30"
                      : "font-medium text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="w-5 flex-none text-center text-[15px]">{it.i}</span>
                  <span className="min-w-0 flex-1 truncate">{it.t}</span>
                  {it.tag && <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold">{it.tag}</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </aside>
    </>
  );
}

// Écran « à venir » pour les métiers pas encore construits (Syndic, Gestion).
export function MetierBientot({ metier, onRetour }: { metier: Metier; onRetour: () => void }) {
  const info =
    metier === "syndic"
      ? {
          em: "🏢",
          titre: "Module Syndic",
          txt: "La gestion des demandes des copropriétaires : saisie à l'accueil, attribution automatique au gestionnaire, suivi des délais et tableau de bord. Le module a sa propre connexion (comptes individuels).",
        }
      : {
          em: "🔑",
          titre: "Gestion locative",
          txt: "Le suivi des lots, des locataires et des loyers viendra se loger dans ce compartiment, sur le même modèle que la transaction.",
        };
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="max-w-md rounded-3xl border border-dashed border-slate-300 bg-white p-9 text-center">
        <div className="mb-3 inline-block rounded-full bg-copper-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-copper">
          À venir
        </div>
        <div className="text-5xl">{info.em}</div>
        <h2 className="mt-3 text-2xl font-bold text-navy">{info.titre}</h2>
        <p className="mt-2 text-sm text-slate-500">{info.txt}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {metier === "syndic" && (
            <a
              href="/syndic"
              className="rounded-xl bg-copper px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
            >
              Ouvrir le module Syndic →
            </a>
          )}
          <button
            type="button"
            onClick={onRetour}
            className="rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-deep"
          >
            ← Revenir à la Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
