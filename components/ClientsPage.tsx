"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addClientFile,
  CATEGORIES_PIECES,
  createClient,
  deleteClient,
  deleteClientFile,
  getClientFileB64,
  listClients,
  telechargerClientFile,
  type ClientDossier,
  type PieceClient,
} from "@/lib/clients";

// Dossiers clients partagés : chaque négociateur y range toutes les pièces
// PDF d'un client (comptes rendus de visite, mandat, diagnostics…), les
// retrouve par la recherche, et peut les réinjecter ailleurs dans l'outil
// (ex. comptes rendus → bilan de commercialisation).

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/20";

const dateFr = (t: number) => new Date(t).toLocaleDateString("fr-FR");

const CATEGORIE_COULEURS: Record<string, string> = {
  "Compte rendu de visite": "bg-copper-soft/60 text-copper",
  Mandat: "bg-blue-50 text-blue-700",
  "Pièce d'identité": "bg-violet-50 text-violet-700",
  Diagnostics: "bg-green-50 text-green-700",
  "Taxe foncière": "bg-amber-50 text-amber-700",
  "Offre d'achat": "bg-rose-50 text-rose-700",
  Autre: "bg-slate-100 text-slate-600",
};

function Badge({ categorie }: { categorie: string }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${CATEGORIE_COULEURS[categorie] ?? CATEGORIE_COULEURS.Autre}`}>
      {categorie}
    </span>
  );
}

function filtrer(dossiers: ClientDossier[], q: string): ClientDossier[] {
  const t = q.trim().toLowerCase();
  if (!t) return dossiers;
  return dossiers.filter((d) =>
    [d.nom, d.bien, d.negociateur, ...d.pieces.map((p) => p.nom)].join(" ").toLowerCase().includes(t),
  );
}

async function fichierEnB64(f: File): Promise<string> {
  const buf = new Uint8Array(await f.arrayBuffer());
  let bin = "";
  for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(bin);
}

// ---------------------------------------------------------------------------
// Sélecteur de pièces : réutilisé par le bilan de commercialisation pour
// importer les comptes rendus de visite depuis un dossier client.
// ---------------------------------------------------------------------------
export function SelecteurPiecesClient({
  categorieParDefaut,
  onAjouter,
  onFermer,
}: {
  categorieParDefaut: string;
  onAjouter: (pieces: { nom: string; taille: number; data: string }[]) => void;
  onFermer: () => void;
}) {
  const [dossiers, setDossiers] = useState<ClientDossier[] | null>(null);
  const [q, setQ] = useState("");
  const [dossier, setDossier] = useState<ClientDossier | null>(null);
  const [coches, setCoches] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    listClients().then(setDossiers).catch(() => setDossiers([]));
  }, []);

  const ouvrir = (d: ClientDossier) => {
    setDossier(d);
    setCoches(new Set(d.pieces.filter((p) => p.categorie === categorieParDefaut).map((p) => p.fileId)));
  };

  const importer = async () => {
    if (!dossier || coches.size === 0) return;
    setBusy(true);
    setErreur(null);
    try {
      const pieces: { nom: string; taille: number; data: string }[] = [];
      for (const p of dossier.pieces.filter((x) => coches.has(x.fileId))) {
        pieces.push({ nom: p.nom, taille: p.taille, data: await getClientFileB64(dossier.id, p.fileId) });
      }
      onAjouter(pieces);
      onFermer();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Import impossible");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-copper/50 bg-white p-4 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-bold text-navy">
          📁 {dossier ? `Pièces de « ${dossier.nom} »` : "Choisissez le dossier client"}
        </h4>
        <button type="button" onClick={onFermer} className="text-slate-400 hover:text-red-600">✕</button>
      </div>

      {!dossier ? (
        <>
          <input className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔎 Rechercher un client, un bien…" />
          <div className="mt-2 max-h-56 space-y-1 overflow-y-auto">
            {dossiers === null ? (
              <p className="p-2 text-xs text-slate-400">Chargement…</p>
            ) : filtrer(dossiers, q).length === 0 ? (
              <p className="p-2 text-xs text-slate-400">Aucun dossier client — créez-le dans l&apos;univers « Dossiers clients ».</p>
            ) : (
              filtrer(dossiers, q).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => ouvrir(d)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left text-sm transition hover:border-copper hover:bg-copper-soft/30"
                >
                  <span className="font-semibold text-navy">{d.nom}</span>
                  <span className="text-xs text-slate-500">{d.pieces.length} pièce{d.pieces.length > 1 ? "s" : ""}</span>
                </button>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          <div className="max-h-56 space-y-1 overflow-y-auto">
            {dossier.pieces.length === 0 && <p className="p-2 text-xs text-slate-400">Ce dossier ne contient aucune pièce.</p>}
            {dossier.pieces.map((p) => (
              <label key={p.fileId} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={coches.has(p.fileId)}
                  onChange={(e) => {
                    const n = new Set(coches);
                    if (e.target.checked) n.add(p.fileId);
                    else n.delete(p.fileId);
                    setCoches(n);
                  }}
                />
                <span className="flex-1 truncate">{p.nom}</span>
                <Badge categorie={p.categorie} />
              </label>
            ))}
          </div>
          {erreur && <p className="mt-2 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">{erreur}</p>}
          <div className="mt-3 flex items-center justify-between">
            <button type="button" onClick={() => setDossier(null)} className="text-xs font-semibold text-slate-500 hover:text-copper">← Autre dossier</button>
            <button
              type="button"
              onClick={() => void importer()}
              disabled={busy || coches.size === 0}
              className="rounded-lg bg-copper px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {busy ? "Import…" : `Ajouter ${coches.size} pièce${coches.size > 1 ? "s" : ""}`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// L'univers « Dossiers clients »
// ---------------------------------------------------------------------------
export default function ClientsPage({ onRetour }: { onRetour: () => void }) {
  const [dossiers, setDossiers] = useState<ClientDossier[] | null>(null);
  const [q, setQ] = useState("");
  const [ouvert, setOuvert] = useState<ClientDossier | null>(null);
  const [creation, setCreation] = useState(false);
  const [nom, setNom] = useState("");
  const [bien, setBien] = useState("");
  const [nego, setNego] = useState("");
  const [categorie, setCategorie] = useState<string>(CATEGORIES_PIECES[0]);
  const [busy, setBusy] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const recharger = () => listClients().then(setDossiers).catch(() => setDossiers([]));
  useEffect(() => {
    void recharger();
  }, []);

  const resultats = useMemo(() => filtrer(dossiers ?? [], q), [dossiers, q]);

  const creer = async () => {
    if (!nom.trim()) return setErreur("Le nom du client est requis.");
    setBusy(true);
    setErreur(null);
    const d = await createClient({ nom, bien, negociateur: nego });
    setBusy(false);
    if (!d) return setErreur("Création impossible — réessayez.");
    setCreation(false);
    setNom(""); setBien(""); setNego("");
    setOuvert(d);
    void recharger();
  };

  const televerser = async (files: FileList | null) => {
    if (!files || !ouvert) return;
    setBusy(true);
    setErreur(null);
    try {
      let dossier: ClientDossier | null = ouvert;
      for (const f of Array.from(files)) {
        if (!f.name.toLowerCase().endsWith(".pdf")) continue;
        if (f.size > 4_000_000) throw new Error(`« ${f.name} » dépasse 4 Mo — compressez-le avant l'envoi.`);
        dossier = await addClientFile(ouvert.id, { nom: f.name, categorie, data: await fichierEnB64(f) });
      }
      if (dossier) setOuvert(dossier);
      void recharger();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Téléversement impossible");
    } finally {
      setBusy(false);
    }
  };

  const supprimerPiece = async (p: PieceClient) => {
    if (!ouvert) return;
    if (!confirm(`Supprimer « ${p.nom} » du dossier ?`)) return;
    const d = await deleteClientFile(ouvert.id, p.fileId);
    if (d) setOuvert(d);
    void recharger();
  };

  const supprimerDossier = async () => {
    if (!ouvert) return;
    if (!confirm(`Supprimer le dossier « ${ouvert.nom} » et TOUTES ses pièces ? Cette action est définitive.`)) return;
    await deleteClient(ouvert.id);
    setOuvert(null);
    void recharger();
  };

  // ---------- Vue dossier ouvert ----------
  if (ouvert) {
    return (
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-navy">📁 {ouvert.nom}</h2>
            <p className="text-sm text-slate-500">
              {[ouvert.bien, ouvert.negociateur && `Négociateur : ${ouvert.negociateur}`, `créé le ${dateFr(ouvert.createdAt)}`]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setOuvert(null)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
              ← Tous les dossiers
            </button>
            <button onClick={() => void supprimerDossier()} className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50">
              Supprimer le dossier
            </button>
          </div>
        </div>

        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-end gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Catégorie des pièces ajoutées</span>
              <select className={inputCls} value={categorie} onChange={(e) => setCategorie(e.target.value)}>
                {CATEGORIES_PIECES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className={`cursor-pointer rounded-xl border-2 border-dashed border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-500 transition hover:border-copper hover:text-copper ${busy ? "pointer-events-none opacity-50" : ""}`}>
              {busy ? "Envoi en cours…" : "+ Ajouter des PDF au dossier"}
              <input type="file" accept="application/pdf" multiple className="hidden" onChange={(e) => { void televerser(e.target.files); e.target.value = ""; }} />
            </label>
            <p className="text-xs text-slate-400">PDF uniquement · 4 Mo max par pièce · stockage partagé de l&apos;équipe, accès protégé par le mot de passe.</p>
          </div>
          {erreur && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">{erreur}</p>}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {ouvert.pieces.length === 0 ? (
            <p className="p-6 text-sm text-slate-400">Aucune pièce pour l&apos;instant — ajoutez les PDF du client ci-dessus.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {[...ouvert.pieces].sort((a, b) => b.createdAt - a.createdAt).map((p) => (
                <li key={p.fileId} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <span className="text-lg">📄</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-slate-800">{p.nom}</div>
                    <div className="text-xs text-slate-400">{Math.round(p.taille / 1024)} Ko · ajouté le {dateFr(p.createdAt)}</div>
                  </div>
                  <Badge categorie={p.categorie} />
                  <button
                    onClick={() => void telechargerClientFile(ouvert.id, p.fileId, p.nom).catch(() => setErreur("Téléchargement impossible"))}
                    className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                  >
                    ⬇ Télécharger
                  </button>
                  <button onClick={() => void supprimerPiece(p)} className="rounded-lg border border-red-200 px-2.5 py-1 text-xs text-red-600 transition hover:bg-red-50">
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // ---------- Vue liste + recherche ----------
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-navy">📁 Dossiers clients</h2>
          <p className="text-sm text-slate-500">Toutes les pièces PDF de vos clients, partagées avec l&apos;équipe et réutilisables dans les documents.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
            ← Accueil
          </button>
          <button onClick={() => setCreation(!creation)} className="rounded-lg bg-copper px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110">
            + Nouveau dossier client
          </button>
        </div>
      </div>

      {creation && (
        <div className="mb-4 grid gap-3 rounded-2xl border border-copper/40 bg-copper-soft/30 p-4 sm:grid-cols-4">
          <input className={inputCls} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom du client * (M. et Mme Dupont)" />
          <input className={inputCls} value={bien} onChange={(e) => setBien(e.target.value)} placeholder="Bien (T3, 12 quai Brescon, Martigues)" />
          <input className={inputCls} value={nego} onChange={(e) => setNego(e.target.value)} placeholder="Négociateur" />
          <button onClick={() => void creer()} disabled={busy} className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-navy-deep disabled:opacity-50">
            {busy ? "Création…" : "Créer le dossier"}
          </button>
          {erreur && <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700 sm:col-span-4">{erreur}</p>}
        </div>
      )}

      <input className={`${inputCls} mb-4`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔎 Rechercher un dossier : nom du client, bien, négociateur, nom d'une pièce…" />

      {dossiers === null ? (
        <p className="p-4 text-sm text-slate-400">Chargement des dossiers…</p>
      ) : resultats.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-400">
          {q ? "Aucun dossier ne correspond à cette recherche." : "Aucun dossier client pour l'instant — créez le premier."}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {resultats.map((d) => (
            <button
              key={d.id}
              onClick={() => setOuvert(d)}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-copper hover:shadow-md"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-lg">📁</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                  {d.pieces.length} pièce{d.pieces.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="text-sm font-bold text-navy">{d.nom}</div>
              {d.bien && <div className="mt-0.5 truncate text-xs text-slate-500">{d.bien}</div>}
              <div className="mt-1 text-xs text-slate-400">
                {[d.negociateur, `mis à jour le ${dateFr(d.updatedAt)}`].filter(Boolean).join(" · ")}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
