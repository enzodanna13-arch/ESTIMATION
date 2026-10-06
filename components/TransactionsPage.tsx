"use client";

import { useEffect, useMemo, useState } from "react";
import {
  listTransactions, createTransaction, updateTransaction, deleteTransaction,
  ajouterPieceTransaction, analyserPieceTransaction, telechargerPieceTransaction, supprimerPieceTransaction, renommerPieceTransaction,
  CATEGORIES_TRANSACTION, type Transaction, type PieceTransaction,
} from "@/lib/transactions";
import { listDocuments, getDocument, type DocHistoryMeta } from "@/lib/history";
import { NEGOCIATEURS } from "@/lib/equipe";

const euro = (n: number) => n > 0 ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n) : "—";
const dateFr = (t: number) => t ? new Date(t).toLocaleDateString("fr-FR") : "—";
const toInput = (t: number) => t ? new Date(t).toISOString().slice(0, 10) : "";
const fromInput = (s: string) => s ? new Date(s + "T12:00:00").getTime() : 0;
const inputCls = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-copper focus:outline-none";

const COULEUR_CAT: Record<string, string> = {
  "Attestation notaire": "bg-emerald-100 text-emerald-700",
  "Facture agence": "bg-amber-100 text-amber-700",
  "Compromis": "bg-blue-100 text-blue-700",
  "Acte de vente": "bg-violet-100 text-violet-700",
  "Autre": "bg-slate-100 text-slate-600",
};

export default function TransactionsPage({ onRetour }: { onRetour: () => void }) {
  const [liste, setListe] = useState<Transaction[] | null>(null);
  const [q, setQ] = useState("");
  const [ouvert, setOuvert] = useState<Transaction | null>(null);
  const [creation, setCreation] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  // Création depuis une facture générée
  const [picker, setPicker] = useState(false);
  const [factures, setFactures] = useState<DocHistoryMeta[] | null>(null);
  const [busyFacture, setBusyFacture] = useState(false);
  const [etatIA, setEtatIA] = useState<string | null>(null); // progression analyse attestation

  const recharger = () => listTransactions().then(setListe).catch(() => setListe([]));
  useEffect(() => { void recharger(); }, []);

  const ouvrirPicker = async () => {
    setPicker(true); setFactures(null); setErreur(null);
    try {
      const docs = await listDocuments();
      setFactures(docs.filter((d) => d.docType === "facture"));
    } catch { setFactures([]); }
  };

  // Création par IA depuis une attestation de vente / acte : on crée une
  // transaction, on y attache le PDF, puis l'IA l'analyse et pré-remplit tout.
  const creerDepuisAttestation = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!(file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf")) { setErreur("Choisissez un PDF (l'attestation de vente)."); return; }
    setErreur(null);
    setEtatIA("Création du dossier…");
    try {
      const t = await createTransaction({ bien: "", notes: "" });
      if (!t) throw new Error("Création impossible");
      setEtatIA("Envoi de l'attestation…");
      const avecPiece = await ajouterPieceTransaction(t.id, file, file.name, "Attestation notaire");
      const piece = (avecPiece?.pieces ?? []).find((p) => p.categorie === "Attestation notaire") ?? (avecPiece?.pieces ?? [])[0];
      if (!avecPiece || !piece) throw new Error("Envoi du document impossible");
      setEtatIA("Analyse du document par l'IA…");
      const res = await analyserPieceTransaction(t.id, piece.fileId);
      setEtatIA(null);
      const finale = res?.transaction ?? avecPiece;
      setOuvert(finale);
      void recharger();
      if (res?.analyseIndisponible) setErreur("Document enregistré mais non analysé (crédit IA ?). Complétez la fiche à la main.");
    } catch (e) {
      setEtatIA(null);
      setErreur(e instanceof Error ? e.message : "Création depuis l'attestation impossible");
    }
  };

  const creerDepuisFacture = async (meta: DocHistoryMeta) => {
    setBusyFacture(true); setErreur(null);
    try {
      const full = await getDocument(meta.id);
      const inp = full?.input;
      const notes = [
        inp?.factureNumero ? `Facture n° ${inp.factureNumero}` : "",
        inp?.factureNotaire ? `Notaire : Maître ${inp.factureNotaire}` : "",
        inp?.factureClientAdresse ? `Adresse client : ${inp.factureClientAdresse}` : "",
      ].filter(Boolean).join("\n");
      const t = await createTransaction({
        bien: inp?.factureBien || meta.reference || "",
        honoraires: typeof inp?.commissionTTC === "number" ? inp.commissionTTC : 0,
        dateVente: meta.createdAt,
        vendeur: inp?.factureClientNom || "",
        negociateur: meta.negociateur || "",
        notes,
      });
      if (!t) { setErreur("Création impossible."); return; }
      setPicker(false);
      setOuvert(t);
      void recharger();
    } catch {
      setErreur("Impossible de lire cette facture.");
    } finally { setBusyFacture(false); }
  };

  const resultats = useMemo(() => {
    const base = liste ?? [];
    const s = q.trim().toLowerCase();
    if (!s) return base;
    return base.filter((t) => [t.bien, t.adresse, t.ville, t.vendeur, t.acquereur, t.negociateur].join(" ").toLowerCase().includes(s));
  }, [liste, q]);

  if (ouvert) return <FicheTransaction t={ouvert} onFermer={() => { setOuvert(null); void recharger(); }} onMaj={setOuvert} />;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Accueil</button>
        <h2 className="text-2xl font-bold text-navy">💼 Transactions</h2>
        <label className={`ml-auto cursor-pointer rounded-lg bg-copper px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 ${etatIA ? "pointer-events-none opacity-60" : ""}`}>
          {etatIA ? "Analyse…" : "🪄 Depuis une attestation (IA)"}
          <input type="file" accept="application/pdf" className="hidden" onChange={(e) => { void creerDepuisAttestation(e.target.files); e.target.value = ""; }} />
        </label>
        <button onClick={() => void ouvrirPicker()} className="rounded-lg border border-copper bg-white px-4 py-2 text-sm font-bold text-copper transition hover:bg-copper-soft/40">📄 Depuis une facture</button>
        <button onClick={() => setCreation(true)} className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:brightness-110">➕ Nouvelle transaction</button>
      </div>
      {etatIA && (
        <p className="mb-3 flex items-center gap-2 rounded-lg border border-copper/30 bg-copper/5 p-2.5 text-sm text-copper">
          <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-copper/40 border-t-copper" />{etatIA}
        </p>
      )}
      <p className="mb-4 text-sm text-slate-500">Vos ventes réalisées, avec les pièces de clôture : <strong>attestation du notaire</strong>, <strong>facture d'agence</strong>, acte, compromis… Créez une transaction de zéro, <strong>à partir d'une facture générée</strong>, ou <strong>en déposant l'attestation de vente</strong> : l'IA l'analyse et remplit le dossier toute seule.</p>

      {picker && (
        <div className="mb-4 rounded-2xl border border-copper/40 bg-copper-soft/20 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-bold text-navy">Créer une transaction depuis une facture générée</div>
            <button onClick={() => setPicker(false)} className="text-xs font-semibold text-slate-500 hover:text-slate-700">Fermer</button>
          </div>
          {factures === null ? (
            <p className="text-sm text-slate-500">Chargement des factures…</p>
          ) : factures.length === 0 ? (
            <p className="text-sm text-slate-400">Aucune facture générée pour l'instant (menu « Génération de documents » → Facture de commission).</p>
          ) : (
            <ul className="divide-y divide-copper/20">
              {factures.map((d) => (
                <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-navy">{d.reference || d.titre}</div>
                    <div className="text-xs text-slate-500">{[d.negociateur, dateFr(d.createdAt)].filter(Boolean).join(" · ")}</div>
                  </div>
                  <button disabled={busyFacture} onClick={() => void creerDepuisFacture(d)} className="rounded-lg bg-navy px-3 py-1.5 text-xs font-bold text-white transition hover:brightness-110 disabled:opacity-50">
                    {busyFacture ? "…" : "Créer la transaction"}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-slate-400">La fiche sera pré-remplie (bien, honoraires, date, client, négociateur). Pensez à importer ensuite le PDF de la facture (type « Facture agence ») et l'attestation du notaire.</p>
        </div>
      )}

      {creation && <FormulaireCreation onCree={(t) => { setCreation(false); setOuvert(t); void recharger(); }} onAnnule={() => setCreation(false)} />}

      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher (bien, ville, vendeur, acquéreur…)" className={`${inputCls} mb-4 max-w-md`} />
      {erreur && <p className="mb-3 text-sm text-red-600">{erreur}</p>}

      {liste === null ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400">Chargement…</div>
      ) : resultats.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400">{q ? "Aucune transaction ne correspond." : "Aucune transaction enregistrée — créez la première."}</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {resultats.map((t) => {
            const aAttestation = t.pieces.some((p) => p.categorie === "Attestation notaire");
            const aFacture = t.pieces.some((p) => p.categorie === "Facture agence");
            return (
              <button key={t.id} onClick={() => setOuvert(t)} className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-copper hover:shadow-md">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-bold text-navy">{t.vendeur || t.bien || "Transaction"}</span>
                  <span className="shrink-0 text-xs font-semibold text-copper">{euro(t.prixVente)}</span>
                </div>
                <div className="mt-0.5 truncate text-xs text-slate-500">{[t.bien, t.ville, dateFr(t.dateVente)].filter((x) => x && x !== "—").join(" · ") || "—"}</div>
                {t.acquereur && <div className="mt-1 truncate text-xs text-slate-400">Acquéreur : {t.acquereur}</div>}
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${aAttestation ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>{aAttestation ? "✓" : "✗"} Attestation notaire</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${aFacture ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-400"}`}>{aFacture ? "✓" : "✗"} Facture agence</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FormulaireCreation({ onCree, onAnnule }: { onCree: (t: Transaction) => void; onAnnule: () => void }) {
  const [f, setF] = useState({ bien: "", ville: "", adresse: "", prixVente: "", honoraires: "", dateVente: toInput(Date.now()), vendeur: "", acquereur: "", negociateur: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const creer = async () => {
    if (!f.bien.trim() && !f.ville.trim()) { setErr("Indiquez au moins le bien ou la ville."); return; }
    setBusy(true); setErr(null);
    const t = await createTransaction({
      bien: f.bien, ville: f.ville, adresse: f.adresse,
      prixVente: Number(f.prixVente.replace(/[^0-9.]/g, "")) || 0,
      honoraires: Number(f.honoraires.replace(/[^0-9.]/g, "")) || 0,
      dateVente: fromInput(f.dateVente), vendeur: f.vendeur, acquereur: f.acquereur, negociateur: f.negociateur,
    });
    setBusy(false);
    if (!t) { setErr("Création impossible — réessayez."); return; }
    onCree(t);
  };
  return (
    <div className="mb-4 rounded-2xl border border-copper/40 bg-copper-soft/30 p-4">
      <div className="mb-2 text-sm font-bold text-navy">Nouvelle transaction</div>
      <div className="grid gap-3 sm:grid-cols-3">
        <input className={inputCls} placeholder="Bien (ex. Maison T5)" value={f.bien} onChange={(e) => setF({ ...f, bien: e.target.value })} />
        <input className={inputCls} placeholder="Ville" value={f.ville} onChange={(e) => setF({ ...f, ville: e.target.value })} />
        <input className={inputCls} placeholder="Adresse" value={f.adresse} onChange={(e) => setF({ ...f, adresse: e.target.value })} />
        <input className={inputCls} placeholder="Prix de vente (€)" value={f.prixVente} onChange={(e) => setF({ ...f, prixVente: e.target.value })} />
        <input className={inputCls} placeholder="Honoraires agence (€)" value={f.honoraires} onChange={(e) => setF({ ...f, honoraires: e.target.value })} />
        <label className="text-xs text-slate-500">Date de vente<input type="date" className={inputCls} value={f.dateVente} onChange={(e) => setF({ ...f, dateVente: e.target.value })} /></label>
        <input className={inputCls} placeholder="Vendeur" value={f.vendeur} onChange={(e) => setF({ ...f, vendeur: e.target.value })} />
        <input className={inputCls} placeholder="Acquéreur" value={f.acquereur} onChange={(e) => setF({ ...f, acquereur: e.target.value })} />
        <select className={inputCls} value={f.negociateur} onChange={(e) => setF({ ...f, negociateur: e.target.value })}>
          <option value="">Négociateur…</option>
          {NEGOCIATEURS.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      <div className="mt-3 flex gap-2">
        <button onClick={() => void creer()} disabled={busy} className="rounded-xl bg-navy px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{busy ? "Création…" : "Créer"}</button>
        <button onClick={onAnnule} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">Annuler</button>
      </div>
    </div>
  );
}

function FicheTransaction({ t, onFermer, onMaj }: { t: Transaction; onFermer: () => void; onMaj: (t: Transaction) => void }) {
  const [f, setF] = useState(t);
  const [cat, setCat] = useState<string>("Attestation notaire");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [edit, setEdit] = useState<{ fileId: string; nom: string; categorie: string } | null>(null);

  const champ = <K extends keyof Transaction>(k: K, v: Transaction[K]) => setF((p) => ({ ...p, [k]: v }));

  const enregistrer = async () => {
    setBusy(true); setErr(null);
    const maj = await updateTransaction(f.id, f);
    setBusy(false);
    if (maj) { setF(maj); onMaj(maj); setMsg("Transaction enregistrée"); } else setErr("Enregistrement impossible");
  };
  const supprimer = async () => {
    if (!confirm("Supprimer cette transaction et toutes ses pièces ? Action définitive.")) return;
    await deleteTransaction(f.id); onFermer();
  };
  const importer = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!(file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf")) { setErr("Choisissez un PDF."); return; }
    setBusy(true); setErr(null); setMsg(null);
    try {
      const maj = await ajouterPieceTransaction(f.id, file, file.name, cat);
      if (maj) { setF(maj); onMaj(maj); setMsg(`« ${cat} » ajoutée`); }
    } catch (e) { setErr(e instanceof Error ? e.message : "Import impossible"); }
    finally { setBusy(false); }
  };
  const supprimerPiece = async (p: PieceTransaction) => {
    if (!confirm(`Supprimer « ${p.nom} » ?`)) return;
    const maj = await supprimerPieceTransaction(f.id, p.fileId);
    if (maj) { setF(maj); onMaj(maj); }
  };
  const renommer = async () => {
    if (!edit) return;
    const maj = await renommerPieceTransaction(f.id, edit.fileId, edit.nom.trim(), edit.categorie);
    if (maj) { setF(maj); onMaj(maj); setEdit(null); } else setErr("Renommage impossible");
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button onClick={onFermer} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Toutes les transactions</button>
        <h2 className="text-xl font-bold text-navy">💼 {f.vendeur || f.bien || "Transaction"}</h2>
        <button onClick={() => void supprimer()} className="ml-auto rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50">Supprimer</button>
      </div>

      {msg && <p className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</p>}
      {err && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{err}</p>}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Infos de la vente */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 text-sm font-bold text-navy">Détails de la vente</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-slate-500">Bien<input className={inputCls} value={f.bien} onChange={(e) => champ("bien", e.target.value)} /></label>
            <label className="text-xs text-slate-500">Ville<input className={inputCls} value={f.ville} onChange={(e) => champ("ville", e.target.value)} /></label>
            <label className="text-xs text-slate-500 sm:col-span-2">Adresse<input className={inputCls} value={f.adresse} onChange={(e) => champ("adresse", e.target.value)} /></label>
            <label className="text-xs text-slate-500">Prix de vente (€)<input className={inputCls} value={f.prixVente || ""} onChange={(e) => champ("prixVente", Number(e.target.value.replace(/[^0-9.]/g, "")) || 0)} /></label>
            <label className="text-xs text-slate-500">Honoraires agence (€)<input className={inputCls} value={f.honoraires || ""} onChange={(e) => champ("honoraires", Number(e.target.value.replace(/[^0-9.]/g, "")) || 0)} /></label>
            <label className="text-xs text-slate-500">Date de vente<input type="date" className={inputCls} value={toInput(f.dateVente)} onChange={(e) => champ("dateVente", fromInput(e.target.value))} /></label>
            <label className="text-xs text-slate-500">Négociateur<select className={inputCls} value={f.negociateur} onChange={(e) => champ("negociateur", e.target.value)}><option value="">—</option>{NEGOCIATEURS.map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
            <label className="text-xs text-slate-500">Vendeur<input className={inputCls} value={f.vendeur} onChange={(e) => champ("vendeur", e.target.value)} /></label>
            <label className="text-xs text-slate-500">Acquéreur<input className={inputCls} value={f.acquereur} onChange={(e) => champ("acquereur", e.target.value)} /></label>
            <label className="text-xs text-slate-500 sm:col-span-2">Notes<textarea className={`${inputCls} min-h-[70px]`} value={f.notes} onChange={(e) => champ("notes", e.target.value)} /></label>
          </div>
          <button onClick={() => void enregistrer()} disabled={busy} className="mt-3 rounded-xl bg-navy px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">💾 Enregistrer</button>
        </div>

        {/* Pièces */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 text-sm font-bold text-navy">Pièces de la transaction</h3>
          <div className="mb-3 flex flex-wrap items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <label className="text-xs text-slate-500">Type de pièce
              <select className={inputCls} value={cat} onChange={(e) => setCat(e.target.value)}>{CATEGORIES_TRANSACTION.map((c) => <option key={c} value={c}>{c}</option>)}</select>
            </label>
            <label className={`cursor-pointer rounded-xl bg-copper px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 ${busy ? "pointer-events-none opacity-50" : ""}`}>
              {busy ? "Envoi…" : "+ Importer un PDF"}
              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => { void importer(e.target.files); e.target.value = ""; }} />
            </label>
          </div>
          {f.pieces.length === 0 ? (
            <p className="p-4 text-sm text-slate-400">Aucune pièce — importez l'attestation du notaire et la facture d'agence.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {[...f.pieces].sort((a, b) => b.createdAt - a.createdAt).map((p) => (
                <li key={p.fileId} className="flex flex-wrap items-center gap-2 py-2.5">
                  <span className="text-lg">📄</span>
                  {edit?.fileId === p.fileId ? (
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                      <input autoFocus value={edit.nom} onChange={(e) => setEdit({ ...edit, nom: e.target.value })} className={`${inputCls} min-w-0 flex-1`} />
                      <select value={edit.categorie} onChange={(e) => setEdit({ ...edit, categorie: e.target.value })} className={inputCls + " w-auto"}>{CATEGORIES_TRANSACTION.map((c) => <option key={c} value={c}>{c}</option>)}</select>
                      <button onClick={() => void renommer()} className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white">Enregistrer</button>
                      <button onClick={() => setEdit(null)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600">Annuler</button>
                    </div>
                  ) : (
                    <>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-slate-800">{p.nom}</div>
                        <div className="text-xs text-slate-400">{Math.round((p.taille || 0) / 1024)} Ko · {dateFr(p.createdAt)}</div>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${COULEUR_CAT[p.categorie] ?? COULEUR_CAT.Autre}`}>{p.categorie}</span>
                      <button onClick={() => setEdit({ fileId: p.fileId, nom: p.nom, categorie: p.categorie })} className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100">✎</button>
                      <button onClick={() => void telechargerPieceTransaction(f.id, p.fileId, p.nom).catch((e) => setErr(e instanceof Error ? e.message : "Téléchargement impossible"))} className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100">⬇</button>
                      <button onClick={() => void supprimerPiece(p)} className="rounded-lg border border-red-200 px-2.5 py-1 text-xs text-red-600 transition hover:bg-red-50">✕</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
