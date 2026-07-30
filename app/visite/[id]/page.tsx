"use client";

import { use, useEffect, useState } from "react";
import Visite360 from "@/components/Visite360";
import { getVisite, urlImageVisite, type VisiteVirtuelle } from "@/lib/visites";

// Page PUBLIQUE de la visite virtuelle : c'est le lien envoyé aux clients.
// L'identifiant long et aléatoire de la visite sert de jeton d'accès —
// aucune autre donnée de l'outil n'est accessible depuis cette page.

export default function PageVisite({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [visite, setVisite] = useState<VisiteVirtuelle | null>(null);
  const [etat, setEtat] = useState<"chargement" | "ok" | "introuvable">("chargement");

  useEffect(() => {
    getVisite(id).then((v) => {
      if (v) {
        setVisite(v);
        setEtat("ok");
      } else setEtat("introuvable");
    });
  }, [id]);

  return (
    <main className="min-h-screen bg-navy-deep text-white">
      <header className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-copper text-lg font-black">21</div>
        <div>
          <h1 className="text-lg font-bold leading-tight">CENTURY 21 Icaza Immobilier</h1>
          <p className="text-xs text-slate-300">
            {etat === "ok" && visite ? `Visite virtuelle — ${visite.bien}` : "Visite virtuelle"}
          </p>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 pb-10">
        {etat === "chargement" && <p className="p-8 text-center text-sm text-slate-300">Chargement de la visite…</p>}
        {etat === "introuvable" && (
          <p className="p-8 text-center text-sm text-slate-300">
            Cette visite n&apos;existe plus. Contactez votre négociateur CENTURY 21 Icaza Immobilier — 04 42 42 80 85.
          </p>
        )}
        {etat === "ok" && visite && (
          <>
            {visite.scenes.length === 0 ? (
              <p className="p-8 text-center text-sm text-slate-300">Les prises de vue arrivent bientôt.</p>
            ) : (
              <Visite360 scenes={visite.scenes} urlImage={urlImageVisite(visite.id)} hauteur="78vh" />
            )}
            <p className="mt-4 text-center text-xs text-slate-400">
              CENTURY 21 Icaza Immobilier — 32 avenue de la Paix, 13500 Martigues · 04 42 42 80 85
              {visite.negociateur ? ` · Votre négociateur : ${visite.negociateur}` : ""}
            </p>
          </>
        )}
      </div>
    </main>
  );
}
