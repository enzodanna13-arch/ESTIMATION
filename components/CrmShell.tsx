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
    { v: "prospection", t: "Prospection ciblée", i: "🎯" },
    { v: "ma-tournee", t: "Ma tournée", i: "🧭" },
    { v: "leads", t: "Leads entrant", i: "📥" },
    { v: "chasse", t: "Chasse immobilière", i: "🏹" },
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
    { v: "flyers", t: "Flyers de prospection", i: "🖨️" },
    { v: "visites", t: "Montage vidéo & 360°", i: "🎬" },
  ] },
  { label: "Archives", items: [
    { v: "historique", h: "", t: "Historiques", i: "🗂️" },
    { v: "sauvegarde", t: "Sauvegarde", i: "💾" },
  ] },
  { label: "Réglages", items: [
    { v: "reglages", t: "Mot de passe", i: "⚙️" },
  ] },
];

const METIERS: { id: Metier; label: string; icon: string; soon?: boolean }[] = [
  { id: "transaction", label: "Transaction", icon: "🏠" },
  { id: "syndic", label: "Syndic", icon: "🏢", soon: true },
  { id: "gestion", label: "Gestion locative", icon: "🔑", soon: true },
];

export function CrmChrome({
  univers, histoSection, metier, onMetier, onNavigate, onReset, onPortail,
}: {
  univers: string;
  histoSection: string;
  metier: Metier;
  onMetier: (m: Metier) => void;
  onNavigate: (v: string, h?: string) => void;
  onReset: () => void;
  onPortail?: () => void;
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

        {onPortail && (
          <button type="button" onClick={onPortail} className="ml-auto rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/10" title="Revenir au choix des espaces">⊞ Espaces</button>
        )}
        <div className={`${onPortail ? "" : "ml-auto"} hidden items-center gap-2.5 sm:flex`}>
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

// Portail d'entrée (après le mot de passe d'équipe) : chaque métier accède à son
// espace. La Transaction ouvre l'outil actuel ; le Syndic a sa propre connexion.
export function Portail({ onTransaction }: { onTransaction: () => void }) {
  const cartes: { titre: string; sous: string; desc: string; icon: string; onClick?: () => void; href?: string; soon?: boolean; primaire?: boolean }[] = [
    { titre: "Transaction", sous: "Négociateurs", desc: "Estimations, leads entrants, dossiers clients, documents et pilotage commercial.", icon: "🏠", onClick: onTransaction, primaire: true },
    { titre: "Syndic", sous: "Gestionnaires", desc: "Suivi des demandes des copropriétaires, attribution automatique, rédaction IA.", icon: "🏢", href: "/syndic" },
    { titre: "Accueil", sous: "Saisie des demandes", desc: "Enregistrer rapidement un appel, une visite ou un mail et le transmettre au bon gestionnaire.", icon: "📞", href: "/syndic" },
    { titre: "Gestion locative", sous: "À venir", desc: "Suivi des lots, locataires et loyers — bientôt disponible dans cet espace.", icon: "🔑", soon: true },
  ];
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="bg-navy-deep px-4 py-5 text-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-copper text-lg font-black">21</span>
          <div className="leading-tight">
            <b className="block text-base font-bold tracking-wide">CENTURY 21 · Icaza Immobilier</b>
            <span className="text-xs text-white/60">Martigues — choisissez votre espace</span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-1 text-2xl font-bold text-navy">Bienvenue</h1>
        <p className="mb-8 text-sm text-slate-500">Sélectionnez l&apos;espace correspondant à votre métier.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          {cartes.map((c) => {
            const inner = (
              <>
                <div className="mb-3 text-4xl">{c.icon}</div>
                <div className={`text-xl font-bold ${c.primaire ? "text-white" : "text-navy"}`}>{c.titre}</div>
                <div className={`text-xs font-semibold uppercase tracking-wide ${c.primaire ? "text-white/70" : "text-copper"}`}>{c.sous}</div>
                <p className={`mt-2 text-sm ${c.primaire ? "text-slate-300" : "text-slate-500"}`}>{c.desc}</p>
                {!c.soon && <span className={`mt-4 inline-block rounded-lg px-4 py-2 text-sm font-semibold text-white ${c.primaire ? "bg-copper" : "bg-navy"}`}>Ouvrir →</span>}
                {c.soon && <span className="mt-4 inline-block rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500">Bientôt</span>}
              </>
            );
            const cls = `group block rounded-3xl border-2 p-8 text-left transition ${c.primaire ? "border-navy bg-navy hover:shadow-lg" : c.soon ? "cursor-default border-dashed border-slate-300 bg-white/60" : "border-slate-200 bg-white hover:border-copper hover:shadow-lg"}`;
            if (c.href) return <a key={c.titre} href={c.href} className={cls}>{inner}</a>;
            if (c.onClick) return <button key={c.titre} type="button" onClick={c.onClick} className={`${cls} w-full`}>{inner}</button>;
            return <div key={c.titre} className={cls}>{inner}</div>;
          })}
        </div>
      </main>
    </div>
  );
}
