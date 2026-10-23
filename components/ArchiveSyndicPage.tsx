"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  listArchiveApi, analyserArchiveApi, creerArchiveApi, updateArchiveApi, deleteArchiveApi,
  urlArchiveFile, CATEGORIES_ARCHIVE, type DocArchive,
} from "@/lib/syndic/client";
import { compresserDocument } from "@/lib/compressDoc";

const nf = new Intl.NumberFormat("fr-FR");
const dateFr = (iso: string) => { if (!iso) return "—"; const d = new Date(iso + "T12:00:00"); return Number.isFinite(d.getTime()) ? d.toLocaleDateString("fr-FR") : iso; };
const octetsLisible = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} Mo` : `${Math.max(1, Math.round(n / 1024))} Ko`);
const estPdf = (f: File) => f.type === "application/pdf" || /\.pdf$/i.test(f.name);
function u8ToB64(u8: Uint8Array): string { let s = ""; const CH = 0x8000; for (let i = 0; i < u8.length; i += CH) s += String.fromCharCode(...u8.subarray(i, i + CH)); return btoa(s); }
async function pdfVersData(f: File): Promise<string> {
  const buf = await f.arrayBuffer();
  if (!buf || buf.byteLength === 0) throw new Error(`« ${f.name} » est vide.`);
  if (buf.byteLength <= 3_600_000) return u8ToB64(new Uint8Array(buf));
  const piece = await compresserDocument(f, 2800);
  return piece.data;
}

const CAT_ICONE: Record<string, string> = {
  "Procès-verbal d'AG": "📝", "Convocation d'AG": "📣", "Appel de fonds": "💶", "Décompte de charges": "🧾",
  "Budget prévisionnel": "📊", "Contrat": "📜", "Facture": "🧾", "Devis": "📐", "Règlement de copropriété": "📘",
  "Diagnostic technique": "🔍", "Courrier": "✉️", "Sinistre / Assurance": "🌊", "Mutation / État daté": "🔑",
  "Relevé / Comptabilité": "🏦", "Carnet d'entretien": "🛠️", "Autre": "📄",
};

function ZoneDepot({ onFiles, disabled, children }: { onFiles: (f: FileList) => void; disabled?: boolean; children: ReactNode }) {
  const [survol, setSurvol] = useState(false);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setSurvol(true); }}
      onDragLeave={(e) => { e.preventDefault(); setSurvol(false); }}
      onDrop={(e) => { e.preventDefault(); setSurvol(false); if (!disabled && e.dataTransfer.files?.length) onFiles(e.dataTransfer.files); }}
      className={`rounded-xl border-2 border-dashed p-4 transition ${survol ? "border-copper bg-copper/5" : "border-slate-300 bg-slate-50"}`}
    >{children}</div>
  );
}

interface Propose { data: string; nom: string; categorie: string; copropriete: string; date: string; resume: string; etat: "analyse" | "ok" | "ko"; fichier: string }

export default function ArchiveSyndicPage() {
  const [docs, setDocs] = useState<DocArchive[]>([]);
  const [chargement, setChargement] = useState(true);
  const [proposes, setProposes] = useState<Propose[]>([]);
  const [archivage, setArchivage] = useState(false);
  const [q, setQ] = useState("");
  const [fCat, setFCat] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { let a = false; void (async () => { try { const r = await listArchiveApi(); if (!a) setDocs(r.documents); } catch { /* */ } finally { if (!a) setChargement(false); } })(); return () => { a = true; }; }, []);

  const analyser = async (files: FileList | null) => {
    if (!files) return;
    const pdfs = Array.from(files).filter(estPdf);
    if (pdfs.length === 0) { setErr("Seuls les fichiers PDF sont acceptés."); return; }
    setErr(null);
    for (const f of pdfs) {
      const base: Propose = { data: "", nom: f.name.replace(/\.pdf$/i, ""), categorie: "Autre", copropriete: "", date: "", resume: "", etat: "analyse", fichier: f.name };
      setProposes((p) => [...p, base]);
      try {
        const data = await pdfVersData(f);
        const r = await analyserArchiveApi(data).catch(() => ({ extrait: null }));
        setProposes((p) => p.map((x) => x === base ? {
          ...x, data,
          nom: r.extrait?.nom || x.nom, categorie: r.extrait?.categorie || "Autre",
          copropriete: r.extrait?.copropriete || "", date: r.extrait?.date || "", resume: r.extrait?.resume || "",
          etat: r.extrait ? "ok" : "ko",
        } : x));
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Analyse impossible");
        setProposes((p) => p.map((x) => x === base ? { ...x, etat: "ko" } : x));
      }
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const setProp = (i: number, patch: Partial<Propose>) => setProposes((p) => p.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const retirer = (i: number) => setProposes((p) => p.filter((_, j) => j !== i));

  const archiverTout = async () => {
    const prets = proposes.filter((p) => p.data);
    if (prets.length === 0) return;
    setArchivage(true); setErr(null);
    const crees: DocArchive[] = [];
    for (const p of prets) {
      try { const r = await creerArchiveApi({ data: p.data, nom: p.nom, categorie: p.categorie, copropriete: p.copropriete, date: p.date, resume: p.resume }); crees.push(r.document); }
      catch { /* on continue */ }
    }
    setDocs((d) => [...crees, ...d]);
    setProposes([]); setArchivage(false);
  };

  const supprimer = async (id: string) => { if (!confirm("Supprimer ce document de l'archive ?")) return; await deleteArchiveApi(id); setDocs((d) => d.filter((x) => x.id !== id)); };
  const majDoc = async (id: string, patch: Partial<DocArchive>) => { try { const r = await updateArchiveApi(id, patch); setDocs((d) => d.map((x) => (x.id === id ? r.document : x))); } catch { /* */ } };

  const filtres = useMemo(() => {
    const t = q.trim().toLowerCase();
    return docs.filter((d) => (!fCat || d.categorie === fCat) && (!t || `${d.nom} ${d.copropriete} ${d.resume}`.toLowerCase().includes(t)));
  }, [docs, q, fCat]);
  const parCat = useMemo(() => CATEGORIES_ARCHIVE.map((c) => ({ c, n: docs.filter((d) => d.categorie === c).length })).filter((x) => x.n > 0), [docs]);
  const enAnalyse = proposes.some((p) => p.etat === "analyse");

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy">📁 Archive syndic</h2>
      <p className="mb-4 text-sm text-slate-500">Dépose des PDF en nombre : l'IA les <strong>analyse, les nomme</strong> et les <strong>classe</strong> par type. Tu vérifies, puis tout est rangé dans l'archive consultable.</p>

      <input ref={fileRef} type="file" accept="application/pdf" multiple className="hidden" onChange={(e) => void analyser(e.target.files)} />
      <ZoneDepot onFiles={(f) => void analyser(f)} disabled={archivage}>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => fileRef.current?.click()} className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:brightness-110">📄 Ajouter des PDF</button>
          <span className="text-xs text-slate-500">📂 Glisse-dépose plusieurs PDF ici — l'IA s'occupe du nom et du classement.</span>
        </div>
      </ZoneDepot>
      {err && <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{err}</div>}

      {/* Revue avant archivage */}
      {proposes.length > 0 && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-base font-bold text-navy">À archiver ({proposes.length})</h3>
            <button onClick={() => void archiverTout()} disabled={archivage || enAnalyse || !proposes.some((p) => p.data)} className="rounded-lg bg-copper px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{archivage ? "Archivage…" : `✓ Tout archiver`}</button>
          </div>
          <div className="space-y-2">
            {proposes.map((p, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-2.5">
                <div className="mb-1.5 flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="truncate">📎 {p.fichier}</span>
                  {p.etat === "analyse" && <span className="font-bold text-sky-600">✨ analyse…</span>}
                  {p.etat === "ko" && <span className="font-bold text-amber-600">IA indisponible — nomme à la main</span>}
                  <button onClick={() => retirer(i)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <input value={p.nom} onChange={(e) => setProp(i, { nom: e.target.value })} placeholder="Nom du document" className="min-w-[220px] flex-1 rounded-md border border-slate-200 px-2 py-1.5 text-sm font-semibold text-navy focus:border-copper focus:outline-none" />
                  <select value={p.categorie} onChange={(e) => setProp(i, { categorie: e.target.value })} className="rounded-md border border-slate-200 px-2 py-1.5 text-xs font-semibold text-navy focus:border-copper focus:outline-none">
                    {CATEGORIES_ARCHIVE.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input value={p.copropriete} onChange={(e) => setProp(i, { copropriete: e.target.value })} placeholder="Copropriété" className="w-40 rounded-md border border-slate-200 px-2 py-1.5 text-sm focus:border-copper focus:outline-none" />
                  <input type="date" value={p.date} onChange={(e) => setProp(i, { date: e.target.value })} className="rounded-md border border-slate-200 px-2 py-1.5 text-sm focus:border-copper focus:outline-none" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Archive */}
      <div className="mt-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Nom, copropriété, contenu…" className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-copper focus:outline-none" />
          <select value={fCat} onChange={(e) => setFCat(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-semibold text-navy focus:border-copper focus:outline-none">
            <option value="">Toutes catégories ({nf.format(docs.length)})</option>
            {parCat.map(({ c, n }) => <option key={c} value={c}>{c} ({n})</option>)}
          </select>
          <span className="text-xs text-slate-400">{filtres.length} document(s)</span>
        </div>

        {chargement ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400">Chargement…</div>
        ) : filtres.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">{docs.length === 0 ? "Archive vide. Dépose des PDF ci-dessus." : "Aucun document pour ce filtre."}</div>
        ) : (
          <div className="space-y-2">
            {filtres.map((d) => (
              <div key={d.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xl">{CAT_ICONE[d.categorie] ?? "📄"}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-navy">{d.nom}</div>
                  <div className="truncate text-[11px] text-slate-500">
                    <span className="font-semibold text-copper">{d.categorie}</span>{d.copropriete ? ` · ${d.copropriete}` : ""}{d.date ? ` · ${dateFr(d.date)}` : ""} · {octetsLisible(d.taille)}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <select value={d.categorie} onChange={(e) => void majDoc(d.id, { categorie: e.target.value })} className="hidden rounded-md border border-slate-200 px-1.5 py-1 text-[11px] font-semibold text-navy focus:border-copper focus:outline-none sm:block">
                    {CATEGORIES_ARCHIVE.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <a href={urlArchiveFile(d.id)} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-navy transition hover:bg-slate-100">Ouvrir</a>
                  <button onClick={() => void supprimer(d.id)} className="text-[11px] font-semibold text-red-500 hover:underline">Suppr.</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
