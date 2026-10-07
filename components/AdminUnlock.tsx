"use client";

import { useEffect, useState } from "react";
import { adminConfigure, verifierCodeAdmin, definirCodeAdmin } from "@/lib/admin";
import { getHistoryKey } from "@/lib/history";

// Fenêtre de déverrouillage de l'accès admin. Deux cas :
//  - un code admin existe déjà → on le saisit pour déverrouiller ;
//  - aucun code n'existe encore → on en crée un (autorisé par le mot de passe
//    d'équipe déjà connu, récupéré en localStorage : pas besoin de le ressaisir).
export default function AdminUnlock({ onClose, onSuccess }: { onClose: () => void; onSuccess: (code: string) => void }) {
  const [configure, setConfigure] = useState<boolean | null>(null);
  const [code, setCode] = useState("");
  const [code2, setCode2] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [occupe, setOccupe] = useState(false);

  useEffect(() => { adminConfigure().then(setConfigure).catch(() => setConfigure(false)); }, []);

  const deverrouiller = async () => {
    setErreur(null); setOccupe(true);
    const ok = await verifierCodeAdmin(code);
    setOccupe(false);
    if (ok) onSuccess(code);
    else setErreur("Code admin incorrect.");
  };

  const creer = async () => {
    setErreur(null);
    if (code.length < 4) { setErreur("Le code doit faire au moins 4 caractères."); return; }
    if (code !== code2) { setErreur("Les deux codes ne correspondent pas."); return; }
    setOccupe(true);
    // Amorçage autorisé par le mot de passe d'équipe déjà en mémoire.
    const r = await definirCodeAdmin(getHistoryKey(), code);
    setOccupe(false);
    if ("ok" in r) onSuccess(code);
    else setErreur(r.erreur);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-navy-deep/60 p-4 print:hidden" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 text-3xl">🔒</div>
        <h2 className="text-lg font-bold text-navy">Espace admin</h2>
        {configure === null ? (
          <p className="mt-3 text-sm text-slate-500">Chargement…</p>
        ) : configure ? (
          <>
            <p className="mt-1 text-sm text-slate-500">Saisissez le code admin pour accéder au pilotage (suivi des négociateurs, tableau de bord, transactions, sauvegarde, réglages).</p>
            <input
              type="password" value={code} autoFocus
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void deverrouiller()}
              placeholder="Code admin"
              className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-copper focus:outline-none"
            />
            <button type="button" disabled={occupe} onClick={() => void deverrouiller()} className="mt-3 w-full rounded-xl bg-navy px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-deep disabled:opacity-50">{occupe ? "Vérification…" : "Déverrouiller"}</button>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-slate-500">Aucun code admin n&apos;est encore défini. Créez-en un : il protégera les sections de pilotage. Les négociateurs n&apos;y auront pas accès.</p>
            <input
              type="password" value={code} autoFocus
              onChange={(e) => setCode(e.target.value)}
              placeholder="Nouveau code admin (min. 4 caractères)"
              className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-copper focus:outline-none"
            />
            <input
              type="password" value={code2}
              onChange={(e) => setCode2(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void creer()}
              placeholder="Confirmer le code"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-copper focus:outline-none"
            />
            <button type="button" disabled={occupe} onClick={() => void creer()} className="mt-3 w-full rounded-xl bg-navy px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-deep disabled:opacity-50">{occupe ? "Enregistrement…" : "Créer le code admin"}</button>
          </>
        )}
        {erreur && <p className="mt-3 text-sm text-red-600">{erreur}</p>}
        <button type="button" onClick={onClose} className="mt-3 w-full rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-50">Annuler</button>
      </div>
    </div>
  );
}
