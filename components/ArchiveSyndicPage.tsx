"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { PDFDocument } from "pdf-lib";
import {
  listArchiveApi, analyserArchiveApi, segmenterArchiveApi, creerArchiveApi, updateArchiveApi, deleteArchiveApi,
  urlArchiveFile, CATEGORIES_ARCHIVE, type DocArchive, type SegmentArchive,
} from "@/lib/syndic/client";
import { compresserPhoto } from "@/lib/sinistres";
import { compresserDocument } from "@/lib/compressDoc";

const nf = new Intl.NumberFormat("fr-FR");
const dateFr = (iso: string) => { if (!iso) return "—"; const d = new Date(iso + "T12:00:00"); return Number.isFinite(d.getTime()) ? d.toLocaleDateString("fr-FR") : iso; };
const octetsLisible = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} Mo` : `${Math.max(1, Math.round(n / 1024))} Ko`);
const estImage = (f: File) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|heic|heif)$/i.test(f.name);
const estPdf = (f: File) => f.type === "application/pdf" || /\.pdf$/i.test(f.name);
function u8ToB64(u8: Uint8Array): string { let s = ""; const CH = 0x8000; for (let i = 0; i < u8.length; i += CH) s += String.fromCharCode(...u8.subarray(i, i + CH)); return btoa(s); }
const rangeIdx = (a: number, b: number) => Array.from({ length: Math.max(0, b - a) }, (_, i) => a + i);
const toFile = (bytes: Uint8Array, nom: string) => new File([new Uint8Array(bytes)], nom, { type: "application/pdf" });

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

interface Trait { actif: boolean; label: string; pct: number; erreurs: number }
type Courant = SegmentArchive;

export default function ArchiveSyndicPage() {
  const [docs, setDocs] = useState<DocArchive[]>([]);
  const [chargement, setChargement] = useState(true);
  const [trait, setTrait] = useState<Trait>({ actif: false, label: "", pct: 0, erreurs: 0 });
  const [q, setQ] = useState("");
  const [fCat, setFCat] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [edit, setEdit] = useState<Partial<DocArchive>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { let a = false; void (async () => { try { const r = await listArchiveApi(); if (!a) setDocs(r.documents); } catch { /* */ } finally { if (!a) setChargement(false); } })(); return () => { a = true; }; }, []);

  const archiverSegment = async (bytes: Uint8Array, seg: SegmentArchive) => {
    let data = u8ToB64(bytes);
    if (data.length > 3_600_000) data = (await compresserDocument(toFile(bytes, "d.pdf"), 2800)).data;
    const res = await creerArchiveApi({ data, type: "pdf", nom: seg.nom, categorie: seg.categorie, copropriete: seg.copropriete, date: seg.date, resume: seg.resume });
    setDocs((d) => [res.document, ...d]);
  };

  // Un PDF = plusieurs documents : on l'analyse par tranches pour trouver les
  // frontières, puis on découpe et on archive chaque document.
  const segmenterPdf = async (f: File) => {
    const src = await PDFDocument.load(new Uint8Array(await f.arrayBuffer()));
    const nb = src.getPageCount();
    const TAILLE = 8;
    let courant: Courant | null = null;
    const finaux: SegmentArchive[] = [];
    for (let start = 0; start < nb; start += TAILLE) {
      const idxs = rangeIdx(start, Math.min(start + TAILLE, nb));
      const finPage = start + idxs.length;
      setTrait((t) => ({ ...t, label: `Découpage de « ${f.name} » — ${finPage}/${nb} pages`, pct: Math.round((finPage / nb) * 50) }));
      // Tranche compressée pour l'analyse IA.
      const chunk = await PDFDocument.create();
      (await chunk.copyPages(src, idxs)).forEach((p) => chunk.addPage(p));
      const comp = await compresserDocument(toFile(await chunk.save({ useObjectStreams: true }), "c.pdf"), 2600);
      let segs: SegmentArchive[] = [];
      try { segs = (await segmenterArchiveApi(comp.data, start + 1, courant ? `${courant.categorie} — ${courant.nom}` : "")).documents; } catch { /* repli */ }
      if (segs.length === 0) segs = [{ pageDebut: start + 1, pageFin: finPage, continuation: !!courant, categorie: "Autre", copropriete: courant?.copropriete ?? "", date: "", nom: `Scan pages ${start + 1}-${finPage}`, resume: "" }];
      segs = segs
        .map((d) => ({ ...d, pageDebut: Math.max(start + 1, Math.min(d.pageDebut, finPage)), pageFin: Math.max(start + 1, Math.min(d.pageFin, finPage)) }))
        .filter((d) => d.pageFin >= d.pageDebut)
        .sort((a, b) => a.pageDebut - b.pageDebut);
      for (let di = 0; di < segs.length; di++) {
        const d = segs[di];
        if (di === 0 && d.continuation && courant) courant.pageFin = Math.max(courant.pageFin, d.pageFin);
        else { if (courant) finaux.push(courant); courant = { ...d }; }
      }
    }
    if (courant) finaux.push(courant);
    // Découpe + archivage de chaque document détecté.
    for (let i = 0; i < finaux.length; i++) {
      const d = finaux[i];
      setTrait((t) => ({ ...t, label: `Archivage ${i + 1}/${finaux.length} document(s)`, pct: 50 + Math.round(((i + 1) / finaux.length) * 50) }));
      try {
        const sub = await PDFDocument.create();
        (await sub.copyPages(src, rangeIdx(d.pageDebut - 1, Math.min(d.pageFin, nb)))).forEach((p) => sub.addPage(p));
        await archiverSegment(await sub.save({ useObjectStreams: true }), d);
      } catch { setTrait((t) => ({ ...t, erreurs: t.erreurs + 1 })); }
    }
  };

  const archiverImage = async (f: File) => {
    setTrait((t) => ({ ...t, label: `Analyse de « ${f.name} »`, pct: 50 }));
    try {
      const data = await compresserPhoto(f);
      const r = await analyserArchiveApi(data, "image").catch(() => ({ extrait: null }));
      const ex = r.extrait ?? { nom: f.name.replace(/\.[^.]+$/, ""), categorie: "Autre", copropriete: "", date: "", resume: "" };
      const res = await creerArchiveApi({ data, type: "image", nom: ex.nom, categorie: ex.categorie, copropriete: ex.copropriete, date: ex.date, resume: ex.resume });
      setDocs((d) => [res.document, ...d]);
    } catch { setTrait((t) => ({ ...t, erreurs: t.erreurs + 1 })); }
  };

  const traiter = async (files: FileList | null) => {
    if (!files) return;
    const liste = Array.from(files).filter((f) => estImage(f) || estPdf(f));
    if (liste.length === 0) { setErr("Dépose un PDF (scan) ou des images."); return; }
    setErr(null);
    setTrait({ actif: true, label: "Préparation…", pct: 0, erreurs: 0 });
    for (let k = 0; k < liste.length; k++) {
      const f = liste[k];
      if (liste.length > 1) setTrait((t) => ({ ...t, label: `Fichier ${k + 1}/${liste.length} : ${f.name}` }));
      try { if (estPdf(f)) await segmenterPdf(f); else await archiverImage(f); }
      catch (e) { setErr(e instanceof Error ? e.message : "Traitement impossible"); setTrait((t) => ({ ...t, erreurs: t.erreurs + 1 })); }
    }
    setTrait((t) => ({ ...t, actif: false, label: "Terminé", pct: 100 }));
    if (fileRef.current) fileRef.current.value = "";
  };

  const supprimer = async (id: string) => { if (!confirm("Supprimer ce document de l'archive ?")) return; await deleteArchiveApi(id); setDocs((d) => d.filter((x) => x.id !== id)); };
  const ouvrirEdit = (d: DocArchive) => { setEditId(d.id); setEdit({ nom: d.nom, categorie: d.categorie, copropriete: d.copropriete, date: d.date }); };
  const enregistrerEdit = async (id: string) => { try { const r = await updateArchiveApi(id, edit); setDocs((d) => d.map((x) => (x.id === id ? r.document : x))); } catch { /* */ } setEditId(null); };
  const reclasser = async (id: string, categorie: string) => { try { const r = await updateArchiveApi(id, { categorie }); setDocs((d) => d.map((x) => (x.id === id ? r.document : x))); } catch { /* */ } };

  const filtres = useMemo(() => {
    const t = q.trim().toLowerCase();
    return docs.filter((d) => (!fCat || d.categorie === fCat) && (!t || `${d.nom} ${d.copropriete} ${d.resume}`.toLowerCase().includes(t)));
  }, [docs, q, fCat]);
  const parCat = useMemo(() => CATEGORIES_ARCHIVE.map((c) => ({ c, n: docs.filter((d) => d.categorie === c).length })).filter((x) => x.n > 0), [docs]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy">📁 Archive syndic</h2>
      <p className="mb-4 text-sm text-slate-500">Scanne tes archives papier en <strong>un seul PDF</strong> (plein de documents à la suite) et dépose-le ici. L'IA <strong>repère chaque document, le découpe, le nomme et le classe</strong> automatiquement. (Tu peux aussi déposer des photos : une photo = un document.)</p>

      <input ref={fileRef} type="file" accept="image/*,application/pdf" multiple capture="environment" className="hidden" onChange={(e) => void traiter(e.target.files)} />
      <ZoneDepot onFiles={(f) => void traiter(f)} disabled={trait.actif}>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => fileRef.current?.click()} disabled={trait.actif} className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">📄 Déposer le scan (PDF) ou des photos</button>
          <span className="text-xs text-slate-500">📂 Un gros PDF multi-documents → l'IA le découpe tout seul.</span>
        </div>
      </ZoneDepot>
      {err && <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{err}</div>}

      {trait.actif && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
          <div className="mb-1 flex items-center justify-between text-sm font-semibold text-navy">
            <span>{trait.label}</span>
            {trait.erreurs > 0 && <span className="text-amber-600">{trait.erreurs} erreur(s)</span>}
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-copper transition-all" style={{ width: `${trait.pct}%` }} /></div>
          <p className="mt-1 text-[11px] text-slate-400">Laisse tourner : chaque document découpé s'ajoute à l'archive au fur et à mesure.</p>
        </div>
      )}

      <div className="mt-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Nom, copropriété, contenu…" className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-copper focus:outline-none" />
          <select value={fCat} onChange={(e) => setFCat(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-semibold text-navy focus:border-copper focus:outline-none">
            <option value="">Toutes catégories ({nf.format(docs.length)})</option>
            {parCat.map(({ c, n }) => <option key={c} value={c}>{c} ({n})</option>)}
          </select>
          <span className="text-xs text-slate-400">{nf.format(filtres.length)} document(s)</span>
        </div>

        {chargement ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400">Chargement…</div>
        ) : filtres.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">{docs.length === 0 ? "Archive vide. Dépose ton scan ci-dessus." : "Aucun document pour ce filtre."}</div>
        ) : (
          <div className="space-y-2">
            {filtres.map((d) => (
              <div key={d.id} className="rounded-xl border border-slate-200 bg-white p-2.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xl">{CAT_ICONE[d.categorie] ?? "📄"}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-navy">{d.nom}</div>
                    <div className="truncate text-[11px] text-slate-500"><span className="font-semibold text-copper">{d.categorie}</span>{d.copropriete ? ` · ${d.copropriete}` : ""}{d.date ? ` · ${dateFr(d.date)}` : ""} · {d.type === "image" ? "🖼️" : "📄"} {octetsLisible(d.taille)}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <a href={urlArchiveFile(d.id)} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-navy transition hover:bg-slate-100">Ouvrir</a>
                    <button onClick={() => (editId === d.id ? setEditId(null) : ouvrirEdit(d))} className="text-[11px] font-semibold text-slate-500 hover:text-copper">{editId === d.id ? "Fermer" : "✏️ Modifier"}</button>
                    <button onClick={() => void supprimer(d.id)} className="text-[11px] font-semibold text-red-500 hover:underline">Suppr.</button>
                  </div>
                </div>
                {editId === d.id && (
                  <div className="mt-2 flex flex-wrap gap-2 border-t border-slate-100 pt-2">
                    <input value={edit.nom ?? ""} onChange={(e) => setEdit((x) => ({ ...x, nom: e.target.value }))} placeholder="Nom" className="min-w-[200px] flex-1 rounded-md border border-slate-200 px-2 py-1.5 text-sm font-semibold text-navy focus:border-copper focus:outline-none" />
                    <select value={edit.categorie ?? "Autre"} onChange={(e) => setEdit((x) => ({ ...x, categorie: e.target.value }))} className="rounded-md border border-slate-200 px-2 py-1.5 text-xs font-semibold text-navy focus:border-copper focus:outline-none">
                      {CATEGORIES_ARCHIVE.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input value={edit.copropriete ?? ""} onChange={(e) => setEdit((x) => ({ ...x, copropriete: e.target.value }))} placeholder="Copropriété" className="w-40 rounded-md border border-slate-200 px-2 py-1.5 text-sm focus:border-copper focus:outline-none" />
                    <input type="date" value={edit.date ?? ""} onChange={(e) => setEdit((x) => ({ ...x, date: e.target.value }))} className="rounded-md border border-slate-200 px-2 py-1.5 text-sm focus:border-copper focus:outline-none" />
                    <button onClick={() => void enregistrerEdit(d.id)} className="rounded-md bg-navy px-3 py-1.5 text-xs font-bold text-white transition hover:brightness-110">Enregistrer</button>
                  </div>
                )}
                {!editId && d.categorie === "Autre" && (
                  <div className="mt-1.5 flex items-center gap-1.5 pl-[52px] text-[11px] text-slate-400">
                    <span>Reclasser :</span>
                    <select onChange={(e) => e.target.value && void reclasser(d.id, e.target.value)} value="" className="rounded-md border border-slate-200 px-1.5 py-0.5 text-[11px] font-semibold text-navy focus:border-copper focus:outline-none">
                      <option value="">catégorie…</option>
                      {CATEGORIES_ARCHIVE.filter((c) => c !== "Autre").map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
