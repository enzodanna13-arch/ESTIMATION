"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  listRecommandes, createRecommande, updateRecommande, deleteRecommande,
  ajouterSuiviReco, ajouterScan, supprimerScan, urlScanReco, analyserRecommande,
  STATUTS_RECO, PRIORITES_RECO, type Recommande,
} from "@/lib/recommandes";
import { compresserPhoto } from "@/lib/sinistres";
import { compresserDocument } from "@/lib/compressDoc";

const nf = new Intl.NumberFormat("fr-FR");
const todayISO = () => new Date().toISOString().slice(0, 10);
const dateFr = (iso: string) => { if (!iso) return "—"; const d = new Date(iso + "T12:00:00"); return Number.isFinite(d.getTime()) ? d.toLocaleDateString("fr-FR") : iso; };
const dateHeure = (ts: number) => new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const STATUT_COULEUR: Record<string, string> = {
  "À traiter": "bg-amber-100 text-amber-700",
  "En cours": "bg-sky-100 text-sky-700",
  "En attente de réponse": "bg-violet-100 text-violet-700",
  "Traité": "bg-emerald-100 text-emerald-700",
  "Clôturé": "bg-slate-800 text-white",
};
const badgeStatut = (s: string) => STATUT_COULEUR[s] ?? "bg-slate-200 text-slate-700";
const PRIORITE_COULEUR: Record<string, string> = { "Normale": "bg-slate-100 text-slate-600", "Haute": "bg-orange-100 text-orange-700", "Urgente": "bg-red-100 text-red-700" };
const estClos = (s: Recommande) => s.statut === "Traité" || s.statut === "Clôturé";
const enRetard = (s: Recommande) => !!s.echeance && s.echeance < todayISO() && !estClos(s);

const estImage = (f: File) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|heic|heif)$/i.test(f.name);
const estPdf = (f: File) => f.type === "application/pdf" || /\.pdf$/i.test(f.name);
function u8ToB64(u8: Uint8Array): string { let s = ""; const CH = 0x8000; for (let i = 0; i < u8.length; i += CH) s += String.fromCharCode(...u8.subarray(i, i + CH)); return btoa(s); }

async function scanVersData(f: File): Promise<{ type: "pdf" | "image"; data: string }> {
  if (estImage(f)) return { type: "image", data: await compresserPhoto(f) };
  const buf = await f.arrayBuffer();
  if (!buf || buf.byteLength === 0) throw new Error(`« ${f.name} » est vide ou pas encore téléchargé sur l'appareil.`);
  if (buf.byteLength <= 3_600_000) return { type: "pdf", data: u8ToB64(new Uint8Array(buf)) };
  const piece = await compresserDocument(f, 2800);
  if (!piece.data) throw new Error(`Compression de « ${f.name} » impossible.`);
  return { type: "pdf", data: piece.data };
}

const champ = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-copper focus:outline-none";
const labelCls = "mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500";

function ZoneDepot({ onFiles, disabled, children }: { onFiles: (f: FileList) => void; disabled?: boolean; children: ReactNode }) {
  const [survol, setSurvol] = useState(false);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setSurvol(true); }}
      onDragLeave={(e) => { e.preventDefault(); setSurvol(false); }}
      onDrop={(e) => { e.preventDefault(); setSurvol(false); if (!disabled && e.dataTransfer.files?.length) onFiles(e.dataTransfer.files); }}
      className={`rounded-xl border-2 border-dashed p-3 transition ${survol ? "border-copper bg-copper/5" : "border-slate-300 bg-slate-50"}`}
    >
      {children}
    </div>
  );
}

export default function RecommandesPage({ onRetour }: { onRetour: () => void }) {
  const [recommandes, setRecommandes] = useState<Recommande[]>([]);
  const [chargement, setChargement] = useState(true);
  const [selId, setSelId] = useState<string | null>(null);
  const [nouveau, setNouveau] = useState(false);
  const [q, setQ] = useState("");
  const [fStatut, setFStatut] = useState("");
  const [fGest, setFGest] = useState("");

  useEffect(() => { let a = false; void (async () => { const l = await listRecommandes(); if (!a) { setRecommandes(l); setChargement(false); } })(); return () => { a = true; }; }, []);
  const majLocal = (r: Recommande) => setRecommandes((prev) => { const i = prev.findIndex((x) => x.id === r.id); const cp = [...prev]; if (i >= 0) cp[i] = r; else cp.unshift(r); return cp; });

  const gestionnaires = useMemo(() => Array.from(new Set(recommandes.map((r) => r.gestionnaire).filter(Boolean))).sort(), [recommandes]);

  const filtrees = useMemo(() => {
    const t = q.trim().toLowerCase();
    return recommandes.filter((r) => {
      if (fStatut && r.statut !== fStatut) return false;
      if (fGest && r.gestionnaire !== fGest) return false;
      if (t && !`${r.objet} ${r.expediteur} ${r.gestionnaire} ${r.copropriete} ${r.reference}`.toLowerCase().includes(t)) return false;
      return true;
    });
  }, [recommandes, q, fStatut, fGest]);

  const stats = useMemo(() => ({
    total: recommandes.length,
    aTraiter: recommandes.filter((r) => !estClos(r)).length,
    retard: recommandes.filter(enRetard).length,
    urgents: recommandes.filter((r) => r.priorite === "Urgente" && !estClos(r)).length,
  }), [recommandes]);

  const selected = selId ? recommandes.find((r) => r.id === selId) ?? null : null;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Accueil</button>
        <h2 className="text-2xl font-bold text-navy">📬 Recommandés reçus</h2>
        {!nouveau && !selected && <button onClick={() => setNouveau(true)} className="ml-auto rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:brightness-110">+ Nouveau recommandé</button>}
      </div>

      {nouveau ? (
        <FormRecommande onCancel={() => setNouveau(false)} onSaved={(r) => { majLocal(r); setNouveau(false); setSelId(r.id); }} />
      ) : selected ? (
        <FicheRecommande r={selected} onRetour={() => setSelId(null)} onChange={majLocal} onDelete={async () => { await deleteRecommande(selected.id); setRecommandes((p) => p.filter((x) => x.id !== selected.id)); setSelId(null); }} />
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500">Les gestionnaires <strong>scannent chaque recommandé reçu</strong> et l'enregistrent ici : une <strong>tâche</strong> est créée par recommandé, avec son statut et son suivi jusqu'au traitement.</p>

          <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[["Recommandés", nf.format(stats.total)], ["À traiter", nf.format(stats.aTraiter)], ["En retard", nf.format(stats.retard)], ["Urgents", nf.format(stats.urgents)]].map(([l, v]) => (
              <div key={l} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center"><div className="text-lg font-bold text-navy">{v}</div><div className="text-[10px] text-slate-500">{l}</div></div>
            ))}
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Objet, expéditeur, copropriété…" className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-copper focus:outline-none" />
            {gestionnaires.length > 0 && (
              <select value={fGest} onChange={(e) => setFGest(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-semibold text-navy focus:border-copper focus:outline-none">
                <option value="">Tous gestionnaires</option>
                {gestionnaires.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            )}
            <select value={fStatut} onChange={(e) => setFStatut(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-semibold text-navy focus:border-copper focus:outline-none">
              <option value="">Tous statuts</option>
              {STATUTS_RECO.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="text-xs text-slate-400">{filtrees.length} recommandé(s)</span>
          </div>

          {chargement ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400">Chargement…</div>
          ) : filtrees.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">Aucun recommandé. Clique sur « + Nouveau recommandé » pour en scanner un.</div>
          ) : (
            <div className="space-y-2.5">
              {filtrees.map((r) => (
                <button key={r.id} onClick={() => setSelId(r.id)} className={`flex w-full items-center gap-3 rounded-2xl border bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${enRetard(r) ? "border-red-200" : "border-slate-200"}`}>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl">✉️</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-navy">{r.objet || "Recommandé"} <span className="text-[11px] font-medium text-slate-400">· {r.reference}</span></div>
                    <div className="truncate text-xs text-slate-500">{r.expediteur || "Expéditeur ?"}{r.copropriete ? ` · ${r.copropriete}` : ""} · reçu le {dateFr(r.dateReception)}{r.gestionnaire ? ` · ${r.gestionnaire}` : ""}</div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeStatut(r.statut)}`}>{r.statut}</span>
                    {enRetard(r) ? <span className="text-[10px] font-bold text-red-600">⏰ échéance {dateFr(r.echeance)}</span> : r.priorite !== "Normale" ? <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${PRIORITE_COULEUR[r.priorite]}`}>{r.priorite}</span> : r.scans.length > 0 ? <span className="text-[10px] text-slate-400">📄 {r.scans.length}</span> : null}
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ChampsRecommande({ f, set }: { f: Partial<Recommande>; set: (k: keyof Recommande, v: unknown) => void }) {
  return (
    <div className="space-y-4">
      <div><label className={labelCls}>Objet du recommandé</label><input value={f.objet ?? ""} onChange={(e) => set("objet", e.target.value)} placeholder="Ex. Mise en demeure, convocation, courrier d'avocat…" className={champ} /></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className={labelCls}>Expéditeur</label><input value={f.expediteur ?? ""} onChange={(e) => set("expediteur", e.target.value)} placeholder="Qui l'envoie" className={champ} /></div>
        <div><label className={labelCls}>Copropriété concernée</label><input value={f.copropriete ?? ""} onChange={(e) => set("copropriete", e.target.value)} className={champ} /></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className={labelCls}>Gestionnaire</label><input value={f.gestionnaire ?? ""} onChange={(e) => set("gestionnaire", e.target.value)} placeholder="Qui l'a reçu / le traite" className={champ} /></div>
        <div><label className={labelCls}>Priorité</label><select value={f.priorite ?? "Normale"} onChange={(e) => set("priorite", e.target.value)} className={champ}>{PRIORITES_RECO.map((p) => <option key={p} value={p}>{p}</option>)}</select></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div><label className={labelCls}>Date de réception</label><input type="date" value={f.dateReception ?? ""} onChange={(e) => set("dateReception", e.target.value)} className={champ} /></div>
        <div><label className={labelCls}>Échéance / à traiter avant</label><input type="date" value={f.echeance ?? ""} onChange={(e) => set("echeance", e.target.value)} className={champ} /></div>
        <div><label className={labelCls}>Statut</label><select value={f.statut ?? "À traiter"} onChange={(e) => set("statut", e.target.value)} className={champ}>{STATUTS_RECO.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
      </div>
      <div><label className={labelCls}>Notes</label><textarea value={f.notes ?? ""} onChange={(e) => set("notes", e.target.value)} rows={2} placeholder="Observations, action à mener…" className={champ} /></div>
    </div>
  );
}

function FormRecommande({ onCancel, onSaved }: { onCancel: () => void; onSaved: (r: Recommande) => void }) {
  const [f, setF] = useState<Partial<Recommande>>({ priorite: "Normale", statut: "À traiter", dateReception: todayISO() });
  const [fichiers, setFichiers] = useState<File[]>([]);
  const [enreg, setEnreg] = useState(false);
  const [progres, setProgres] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [survol, setSurvol] = useState(false);
  const [analyse, setAnalyse] = useState<"" | "cours" | "ok" | "ko">("");
  const analyseFaite = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (k: keyof Recommande, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  // Analyse IA : lit le document et pré-remplit les champs encore vides.
  const analyser = async (file: File) => {
    setAnalyse("cours"); setErr(null);
    try {
      const { type, data } = await scanVersData(file);
      const ex = await analyserRecommande({ type, data });
      if (ex) {
        setF((p) => ({
          ...p,
          objet: p.objet?.trim() ? p.objet : ex.objet,
          expediteur: p.expediteur?.trim() ? p.expediteur : ex.expediteur,
          copropriete: p.copropriete?.trim() ? p.copropriete : ex.copropriete,
          echeance: p.echeance?.trim() ? p.echeance : ex.echeance,
          priorite: ex.priorite || p.priorite,
          notes: [p.notes, ex.resume, ex.dateCourrier ? `Courrier daté du ${ex.dateCourrier}` : ""].filter(Boolean).join("\n"),
        }));
        setAnalyse("ok");
      } else setAnalyse("ko");
    } catch (e) { setAnalyse("ko"); setErr(e instanceof Error ? e.message : "Analyse IA indisponible"); }
  };

  const ajouterFichiers = (liste: FileList | null) => {
    if (!liste) return;
    const valides = Array.from(liste).filter((x) => estImage(x) || estPdf(x));
    setFichiers((p) => [...p, ...valides]);
    if (fileRef.current) fileRef.current.value = "";
    // Analyse automatique du premier document ajouté.
    if (!analyseFaite.current && valides.length > 0) { analyseFaite.current = true; void analyser(valides[0]); }
  };

  const soumettre = async () => {
    if (!f.objet?.trim() && !f.expediteur?.trim()) { setErr("Indique au moins l'objet ou l'expéditeur."); return; }
    setEnreg(true); setErr(null);
    const r = await createRecommande(f);
    if (!r) { setEnreg(false); setErr("Enregistrement impossible (réessaie)."); return; }
    let final = r;
    for (let i = 0; i < fichiers.length; i++) {
      setProgres(`Envoi du scan ${i + 1}/${fichiers.length}…`);
      try { const { type, data } = await scanVersData(fichiers[i]); const maj = await ajouterScan(r.id, { nom: fichiers[i].name.slice(0, 120), type, data }); if (maj) final = maj; }
      catch (e) { setErr(`Recommandé créé, mais un scan n'a pas pu être envoyé : ${e instanceof Error ? e.message : ""}`); }
    }
    setEnreg(false); setProgres("");
    onSaved(final);
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-navy">Nouveau recommandé</h3>
      {err && <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{err}</div>}
      <ChampsRecommande f={f} set={set} />

      <div
        onDragOver={(e) => { e.preventDefault(); setSurvol(true); }}
        onDragLeave={(e) => { e.preventDefault(); setSurvol(false); }}
        onDrop={(e) => { e.preventDefault(); setSurvol(false); ajouterFichiers(e.dataTransfer.files); }}
        className={`mt-4 rounded-xl border-2 border-dashed p-3 transition ${survol ? "border-copper bg-copper/5" : "border-slate-300 bg-slate-50"}`}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Scan du recommandé (photo ou PDF)</span>
          <div className="flex items-center gap-2">
            {analyse === "cours" && <span className="text-[11px] font-bold text-sky-600">✨ Analyse IA en cours…</span>}
            {analyse === "ok" && <span className="text-[11px] font-bold text-emerald-600">✓ Champs pré-remplis par l'IA</span>}
            {analyse === "ko" && <span className="text-[11px] font-bold text-amber-600">IA indisponible — saisis à la main</span>}
            {fichiers.length > 0 && <button type="button" onClick={() => void analyser(fichiers[0])} disabled={analyse === "cours"} className="rounded-lg border border-sky-200 bg-white px-2.5 py-1 text-[11px] font-bold text-sky-700 transition hover:bg-sky-50 disabled:opacity-50">✨ {analyse === "ok" ? "Ré-analyser" : "Analyser"}</button>}
            <button type="button" onClick={() => fileRef.current?.click()} className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-navy shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100">+ Ajouter</button>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*,application/pdf" multiple capture="environment" className="hidden" onChange={(e) => ajouterFichiers(e.target.files)} />
        {fichiers.length === 0 ? (
          <p className="text-xs text-slate-400">📷 Dépose le PDF (ou prends-le en photo) : l'<strong>IA analyse le courrier</strong> et remplit l'objet, l'expéditeur, la copropriété, l'échéance et la priorité automatiquement.</p>
        ) : (
          <ul className="space-y-1">
            {fichiers.map((file, i) => (
              <li key={i} className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 text-xs ring-1 ring-slate-100">
                <span>{estPdf(file) ? "📄" : "🖼️"}</span>
                <span className="min-w-0 flex-1 truncate text-slate-600">{file.name}</span>
                <button type="button" onClick={() => setFichiers((p) => p.filter((_, j) => j !== i))} className="shrink-0 text-red-400 hover:text-red-600">✕</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button onClick={() => void soumettre()} disabled={enreg} className="rounded-lg bg-navy px-5 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{enreg ? (progres || "Enregistrement…") : "Enregistrer"}</button>
        <button onClick={onCancel} disabled={enreg} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50">Annuler</button>
      </div>
    </div>
  );
}

function FicheRecommande({ r, onRetour, onChange, onDelete }: { r: Recommande; onRetour: () => void; onChange: (r: Recommande) => void; onDelete: () => void }) {
  const [f, setF] = useState<Partial<Recommande>>(r);
  const [enreg, setEnreg] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [onglet, setOnglet] = useState<"infos" | "scans" | "suivi">("infos");
  const set = (k: keyof Recommande, v: unknown) => { setF((p) => ({ ...p, [k]: v })); setDirty(true); };
  useEffect(() => { setF(r); setDirty(false); }, [r.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const enregistrer = async () => { setEnreg(true); const maj = await updateRecommande(r.id, f); setEnreg(false); if (maj) { onChange(maj); setDirty(false); } };
  const changerStatut = async (statut: string) => { const maj = await updateRecommande(r.id, { statut }); if (maj) onChange(maj); };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Tous les recommandés</button>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeStatut(r.statut)}`}>{r.statut}</span>
        {enRetard(r) && <span className="rounded-full bg-red-100 px-2 py-1 text-[11px] font-bold text-red-700">⏰ en retard</span>}
        <span className="text-xs text-slate-400">{r.reference}</span>
        {dirty && <button onClick={() => void enregistrer()} disabled={enreg} className="ml-auto rounded-lg bg-copper px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{enreg ? "Enregistrement…" : "💾 Enregistrer"}</button>}
      </div>

      <div className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-l-4 border-copper bg-slate-50/70 p-4">
          <div className="text-xl font-black text-navy">✉️ {r.objet || "Recommandé"}</div>
          <div className="text-sm text-slate-600">{r.expediteur || "Expéditeur ?"}{r.copropriete ? ` · ${r.copropriete}` : ""} · reçu le {dateFr(r.dateReception)}{r.gestionnaire ? ` · ${r.gestionnaire}` : ""}</div>
        </div>

        {/* Changement de statut rapide */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 bg-white p-3">
          {STATUTS_RECO.map((s) => (
            <button key={s} onClick={() => void changerStatut(s)} className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${r.statut === s ? badgeStatut(s) : "border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>{s}</button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1 border-b border-slate-100 p-2">
          {([["infos", "📋 Infos"], ["scans", `📄 Scans (${r.scans.length})`], ["suivi", `📈 Suivi (${r.suivi.length})`]] as const).map(([v, t]) => (
            <button key={v} onClick={() => setOnglet(v)} className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${onglet === v ? "bg-navy text-white" : "text-slate-500 hover:text-navy"}`}>{t}</button>
          ))}
        </div>

        <div className="p-4">
          {onglet === "infos" && (
            <>
              <ChampsRecommande f={f} set={set} />
              <div className="mt-5 flex gap-2">
                <button onClick={() => void enregistrer()} disabled={enreg || !dirty} className="rounded-lg bg-navy px-5 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-40">{enreg ? "Enregistrement…" : "Enregistrer"}</button>
                <button onClick={() => { if (confirm("Supprimer définitivement ce recommandé et ses scans ?")) onDelete(); }} className="ml-auto rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100">Supprimer</button>
              </div>
            </>
          )}
          {onglet === "scans" && <OngletScans r={r} onChange={onChange} />}
          {onglet === "suivi" && <OngletSuiviReco r={r} onChange={onChange} />}
        </div>
      </div>
    </div>
  );
}

function OngletScans({ r, onChange }: { r: Recommande; onChange: (r: Recommande) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [envoi, setEnvoi] = useState(false);
  const [progres, setProgres] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const ajouter = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const liste = Array.from(files).filter((f) => estImage(f) || estPdf(f));
    if (liste.length === 0) return;
    setEnvoi(true); setErr(null);
    let dernier: Recommande | null = null;
    try {
      for (let i = 0; i < liste.length; i++) { setProgres(`${i + 1}/${liste.length}`); const { type, data } = await scanVersData(liste[i]); dernier = await ajouterScan(r.id, { nom: liste[i].name.slice(0, 120), type, data }); }
      if (dernier) onChange(dernier);
    } catch (e) { setErr(e instanceof Error ? e.message : "Envoi impossible"); }
    setEnvoi(false); setProgres("");
    if (fileRef.current) fileRef.current.value = "";
  };
  const supprimer = async (fileId: string) => { const maj = await supprimerScan(r.id, fileId); if (maj) onChange(maj); };

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*,application/pdf" multiple capture="environment" className="hidden" onChange={(e) => void ajouter(e.target.files)} />
      <ZoneDepot onFiles={(f) => void ajouter(f)} disabled={envoi}>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => fileRef.current?.click()} disabled={envoi} className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{envoi ? `Envoi… ${progres}` : "📷 Ajouter un scan"}</button>
          <span className="text-xs text-slate-500">📂 Photo ou PDF — glisse-dépose ou clique (plusieurs pages possibles).</span>
        </div>
      </ZoneDepot>
      {err && <div className="my-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{err}</div>}
      {r.scans.length === 0 ? (
        <div className="mt-3 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">Aucun scan pour l'instant.</div>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {r.scans.map((sc, i) => (
            <div key={sc.id} className="overflow-hidden rounded-xl border border-slate-200">
              {sc.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={urlScanReco(r.id, sc.id)} alt={sc.nom} className="h-48 w-full bg-slate-100 object-cover" />
              ) : (
                <a href={urlScanReco(r.id, sc.id)} target="_blank" rel="noopener noreferrer" className="flex h-48 w-full flex-col items-center justify-center gap-2 bg-slate-50 text-slate-500 transition hover:bg-slate-100"><span className="text-4xl">📄</span><span className="text-xs font-semibold">Ouvrir le PDF</span></a>
              )}
              <div className="flex items-center justify-between p-2.5">
                <span className="truncate text-xs font-semibold text-navy">Page {i + 1} · {sc.nom}</span>
                <div className="flex shrink-0 gap-2">
                  <a href={urlScanReco(r.id, sc.id)} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-sky-700 hover:underline">Ouvrir</a>
                  <button onClick={() => void supprimer(sc.id)} className="text-[11px] font-semibold text-red-500 hover:underline">Suppr.</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OngletSuiviReco({ r, onChange }: { r: Recommande; onChange: (r: Recommande) => void }) {
  const [texte, setTexte] = useState("");
  const [statut, setStatut] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const ajouter = async () => {
    if (!texte.trim() && !statut) return;
    setEnvoi(true);
    const maj = await ajouterSuiviReco(r.id, texte, statut || undefined);
    setEnvoi(false);
    if (maj) { onChange(maj); setTexte(""); setStatut(""); }
  };
  const entrees = [...r.suivi].sort((a, b) => b.date - a.date);
  return (
    <div>
      <div className="mb-4 rounded-xl bg-slate-50 p-3">
        <label className={labelCls}>Ajouter une étape</label>
        <textarea value={texte} onChange={(e) => setTexte(e.target.value)} rows={2} placeholder="Ex. Transmis à l'avocat, réponse envoyée le…" className={champ} />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <select value={statut} onChange={(e) => setStatut(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-semibold text-navy focus:border-copper focus:outline-none">
            <option value="">(ne pas changer le statut)</option>
            {STATUTS_RECO.map((x) => <option key={x} value={x}>Passer à : {x}</option>)}
          </select>
          <button onClick={() => void ajouter()} disabled={envoi} className="rounded-lg bg-navy px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{envoi ? "…" : "Ajouter"}</button>
        </div>
      </div>
      <div className="relative space-y-3 pl-5">
        <div className="absolute bottom-1 left-[7px] top-1 w-px bg-slate-200" />
        {entrees.map((e) => (
          <div key={e.id} className="relative">
            <span className="absolute -left-5 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-copper shadow" />
            <div className="text-[11px] font-semibold text-slate-400">{dateHeure(e.date)}</div>
            <div className="text-sm text-navy">{e.texte}{e.statut && <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeStatut(e.statut)}`}>{e.statut}</span>}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
