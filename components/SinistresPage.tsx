"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  listSinistres, createSinistre, updateSinistre, deleteSinistre,
  ajouterSuivi, ajouterPhoto, modifierPhoto, supprimerPhoto,
  ajouterDocument, supprimerDocument,
  compresserPhoto, urlPhotoSinistre, urlDocumentSinistre,
  STATUTS_SINISTRE, MOTIFS_SINISTRE, type Sinistre,
} from "@/lib/sinistres";
import { compresserDocument } from "@/lib/compressDoc";
import { TARIFS_RECO, TARIF_AR, NIVEAUX_RECO, affranchissement, coutEnvoi, euros as eurosP, type NiveauReco } from "@/lib/tarifsPostaux";
import { analyserPdfOuvertures, type SinistreImporte } from "@/lib/importSinistresPdf";
import { genererDeclarationSinistrePdf, type PhotoBytes } from "@/lib/declarationSinistrePdf";

const estImage = (f: File) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|heic|heif)$/i.test(f.name);
const estPdf = (f: File) => f.type === "application/pdf" || /\.pdf$/i.test(f.name);
const octetsLisible = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} Mo` : `${Math.max(1, Math.round(n / 1024))} Ko`);

function u8ToB64(u8: Uint8Array): string {
  let s = ""; const CH = 0x8000;
  for (let i = 0; i < u8.length; i += CH) s += String.fromCharCode(...u8.subarray(i, i + CH));
  return btoa(s);
}

// Prépare un PDF pour l'envoi : tel quel s'il tient sous la limite serverless,
// sinon compressé. Lève une erreur claire si le fichier est vide (cas fréquent
// d'un fichier cloud pas encore téléchargé sur mobile).
async function pdfVersData(f: File): Promise<string> {
  const buf = await f.arrayBuffer();
  if (!buf || buf.byteLength === 0) {
    throw new Error(`« ${f.name} » est vide ou pas encore téléchargé sur l'appareil. Ouvre-le une fois (ou enregistre-le localement) puis réessaie.`);
  }
  if (buf.byteLength <= 3_600_000) return u8ToB64(new Uint8Array(buf));
  const piece = await compresserDocument(f, 2800);
  if (!piece.data) throw new Error(`Compression de « ${f.name} » impossible.`);
  return piece.data;
}

// Téléverse une liste de fichiers vers un sinistre : images → photos (JPEG),
// PDF → documents. Renvoie le dernier état du sinistre.
async function televerserFichiers(
  id: string,
  fichiers: File[],
  onProgress?: (fait: number, total: number) => void,
): Promise<Sinistre | null> {
  let dernier: Sinistre | null = null;
  let fait = 0;
  for (const f of fichiers) {
    if (estImage(f)) {
      const data = await compresserPhoto(f);
      dernier = await ajouterPhoto(id, { nom: f.name.replace(/\.[^.]+$/, "").slice(0, 60), legende: "", data });
    } else if (estPdf(f)) {
      const data = await pdfVersData(f);
      dernier = await ajouterDocument(id, { nom: f.name.slice(0, 120), data });
    }
    onProgress?.(++fait, fichiers.length);
  }
  return dernier;
}

const nf = new Intl.NumberFormat("fr-FR");
const euros = (n: number | null) => (n && n > 0 ? `${nf.format(n)} €` : "—");
const dateFr = (iso: string) => { if (!iso) return "—"; const d = new Date(iso + "T12:00:00"); return Number.isFinite(d.getTime()) ? d.toLocaleDateString("fr-FR") : iso; };
const dateHeure = (ts: number) => new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

// Couleur de badge par statut (progression gauche → droite).
const STATUT_COULEUR: Record<string, string> = {
  "Déclaré": "bg-slate-200 text-slate-700",
  "Déclaration envoyée": "bg-sky-100 text-sky-700",
  "Expertise en attente": "bg-amber-100 text-amber-700",
  "Expertise réalisée": "bg-violet-100 text-violet-700",
  "Travaux en cours": "bg-orange-100 text-orange-700",
  "Indemnisé": "bg-emerald-100 text-emerald-700",
  "Clôturé": "bg-slate-800 text-white",
};
const badgeStatut = (s: string) => STATUT_COULEUR[s] ?? "bg-slate-200 text-slate-700";

const MOTIF_ICONE: Record<string, string> = {
  "Inondation": "🌊", "Catastrophe naturelle": "⚠️", "Dégât des eaux": "💧",
  "Incendie": "🔥", "Tempête / Grêle": "🌪️", "Bris de glace": "🪟", "Vandalisme": "🔨", "Autre": "📍",
};

function telechargerPdf(octets: Uint8Array, nom: string) {
  const blob = new Blob([new Uint8Array(octets)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = nom; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const champ = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-copper focus:outline-none";
const labelCls = "mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500";

// Zone de glisser-déposer réutilisable (photos / PDF). Surligne au survol.
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

export default function SinistresPage({ onRetour }: { onRetour: () => void }) {
  const [sinistres, setSinistres] = useState<Sinistre[]>([]);
  const [chargement, setChargement] = useState(true);
  const [selId, setSelId] = useState<string | null>(null);
  const [nouveau, setNouveau] = useState(false);
  const [importer, setImporter] = useState(false);
  const [couts, setCouts] = useState(false);
  const [q, setQ] = useState("");
  const [fStatut, setFStatut] = useState("");
  const [fMotif, setFMotif] = useState("");

  useEffect(() => { let a = false; void (async () => { const l = await listSinistres(); if (!a) { setSinistres(l); setChargement(false); } })(); return () => { a = true; }; }, []);

  const majLocal = (s: Sinistre) => setSinistres((prev) => { const i = prev.findIndex((x) => x.id === s.id); const cp = [...prev]; if (i >= 0) cp[i] = s; else cp.unshift(s); return cp; });

  const filtrees = useMemo(() => {
    const t = q.trim().toLowerCase();
    return sinistres.filter((s) => {
      if (fStatut && s.statut !== fStatut) return false;
      if (fMotif && s.motif !== fMotif) return false;
      if (t && !`${s.coproNom} ${s.coproAdresse} ${s.reference} ${s.motif} ${s.assureur}`.toLowerCase().includes(t)) return false;
      return true;
    });
  }, [sinistres, q, fStatut, fMotif]);

  const stats = useMemo(() => {
    const ouverts = sinistres.filter((s) => s.statut !== "Clôturé").length;
    const expertise = sinistres.filter((s) => s.statut === "Expertise en attente" || s.statut === "Expertise réalisée").length;
    const montant = sinistres.reduce((acc, s) => acc + (s.montantEstime ?? 0), 0);
    return { total: sinistres.length, ouverts, expertise, montant };
  }, [sinistres]);

  const selected = selId ? sinistres.find((s) => s.id === selId) ?? null : null;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Accueil</button>
        <h2 className="text-2xl font-bold text-navy">🌊 Sinistres &amp; assurances</h2>
        {!nouveau && !importer && !couts && !selected && (
          <div className="ml-auto flex flex-wrap gap-2">
            <button onClick={() => setCouts(true)} className="rounded-lg border border-emerald-600 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">💰 Coûts postaux</button>
            <button onClick={() => setImporter(true)} className="rounded-lg border border-navy bg-white px-4 py-2 text-sm font-bold text-navy transition hover:bg-slate-50">📥 Importer un PDF</button>
            <button onClick={() => setNouveau(true)} className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:brightness-110">+ Nouveau sinistre</button>
          </div>
        )}
      </div>

      {couts ? (
        <CoutsPostaux sinistres={sinistres} onChange={majLocal} onRetour={() => setCouts(false)} />
      ) : importer ? (
        <ImportPdf
          onCancel={() => setImporter(false)}
          onImported={(crees) => { crees.forEach(majLocal); setImporter(false); }}
        />
      ) : nouveau ? (
        <FormSinistre
          onCancel={() => setNouveau(false)}
          onSaved={(s) => { majLocal(s); setNouveau(false); setSelId(s.id); }}
        />
      ) : selected ? (
        <FicheSinistre
          s={selected}
          onRetour={() => setSelId(null)}
          onChange={majLocal}
          onDelete={async () => { await deleteSinistre(selected.id); setSinistres((p) => p.filter((x) => x.id !== selected.id)); setSelId(null); }}
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500">Référencez chaque sinistre de vos copropriétés (inondations, catastrophes naturelles…), suivez son avancement et générez la déclaration d'assurance pré-remplie avec photos légendées.</p>

          <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[["Sinistres", nf.format(stats.total)], ["En cours", nf.format(stats.ouverts)], ["En expertise", nf.format(stats.expertise)], ["Dommages estimés", euros(stats.montant)]].map(([l, v]) => (
              <div key={l} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center"><div className="text-lg font-bold text-navy">{v}</div><div className="text-[10px] text-slate-500">{l}</div></div>
            ))}
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Copropriété, référence, assureur…" className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-copper focus:outline-none" />
            <select value={fMotif} onChange={(e) => setFMotif(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-semibold text-navy focus:border-copper focus:outline-none">
              <option value="">Tous motifs</option>
              {MOTIFS_SINISTRE.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={fStatut} onChange={(e) => setFStatut(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-semibold text-navy focus:border-copper focus:outline-none">
              <option value="">Tous statuts</option>
              {STATUTS_SINISTRE.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="text-xs text-slate-400">{filtrees.length} sinistre(s)</span>
          </div>

          {chargement ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400">Chargement…</div>
          ) : filtrees.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">Aucun sinistre. Clique sur « + Nouveau sinistre » pour en référencer un.</div>
          ) : (
            <div className="space-y-2.5">
              {filtrees.map((s) => (
                <button key={s.id} onClick={() => setSelId(s.id)} className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl">{MOTIF_ICONE[s.motif] ?? "📍"}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-navy">{s.coproNom || "Copropriété"} <span className="text-[11px] font-medium text-slate-400">· {s.reference}</span></div>
                    <div className="truncate text-xs text-slate-500">{s.motif} · {dateFr(s.dateSinistre)}{s.coproAdresse ? ` · ${s.coproAdresse}` : ""}</div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeStatut(s.statut)}`}>{s.statut}</span>
                    {s.photos.length > 0 && <span className="text-[10px] text-slate-400">📷 {s.photos.length}</span>}
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

// ------- Espace « Coûts postaux » (affranchissement LRAR + AR) -------
function CoutsPostaux({ sinistres, onChange, onRetour }: { sinistres: Sinistre[]; onChange: (s: Sinistre) => void; onRetour: () => void }) {
  const [refGrille, setRefGrille] = useState(false);
  const niv = (s: Sinistre): NiveauReco => (NIVEAUX_RECO.includes(s.niveauReco as NiveauReco) ? (s.niveauReco as NiveauReco) : "R1");

  const save = async (id: string, patch: Partial<Sinistre>) => { const maj = await updateSinistre(id, patch); if (maj) onChange(maj); };
  const toutNiveau = async (n: NiveauReco) => { for (const s of sinistres) if (niv(s) !== n) { const maj = await updateSinistre(s.id, { niveauReco: n }); if (maj) onChange(maj); } };

  // Totaux (sur les sinistres dont le poids est renseigné et dans la grille).
  const chiffres = sinistres.filter((s) => s.poidsEnvoi && coutEnvoi(s.poidsEnvoi, niv(s), true) != null);
  const totalAff = chiffres.reduce((a, s) => a + (affranchissement(s.poidsEnvoi!, niv(s)) ?? 0), 0);
  const totalAR = chiffres.length * TARIF_AR;
  const totalGen = totalAff + totalAR;
  const horsGrille = sinistres.filter((s) => s.poidsEnvoi && coutEnvoi(s.poidsEnvoi, niv(s), true) == null).length;
  const sansPoids = sinistres.filter((s) => !s.poidsEnvoi).length;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Sinistres</button>
        <h3 className="text-lg font-bold text-navy">💰 Coûts postaux</h3>
      </div>
      <p className="mb-3 text-sm text-slate-500">Saisis le <strong>poids de chaque envoi</strong> ; le coût est calculé automatiquement (grille LRAR Entreprise 2026) avec l'<strong>avis de réception (+{eurosP(TARIF_AR)})</strong> inclus sur chaque lettre.</p>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">Appliquer un niveau à tous :</span>
        {NIVEAUX_RECO.map((n) => <button key={n} onClick={() => void toutNiveau(n)} className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-navy transition hover:bg-slate-100">{n}</button>)}
        <button onClick={() => setRefGrille((v) => !v)} className="ml-auto text-xs font-semibold text-copper hover:underline">{refGrille ? "Masquer la grille" : "Voir la grille des tarifs"}</button>
      </div>

      {refGrille && (
        <div className="mb-3 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead><tr className="bg-amber-100 text-navy"><th className="px-3 py-2 text-left font-bold">Recommandé</th><th className="px-3 py-2 font-bold">R1</th><th className="px-3 py-2 font-bold">R2</th><th className="px-3 py-2 font-bold">R3</th></tr></thead>
            <tbody>
              {TARIFS_RECO.map((p, i) => <tr key={p.max} className={i % 2 ? "bg-slate-50" : "bg-white"}><td className="px-3 py-1.5">{p.libelle}</td><td className="px-3 py-1.5 text-center">{eurosP(p.R1)}</td><td className="px-3 py-1.5 text-center">{eurosP(p.R2)}</td><td className="px-3 py-1.5 text-center">{eurosP(p.R3)}</td></tr>)}
              <tr className="bg-white"><td className="px-3 py-1.5 font-semibold">Avis de réception</td><td colSpan={3} className="px-3 py-1.5 text-center">{eurosP(TARIF_AR)}</td></tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2 text-left">Copropriété</th>
              <th className="px-3 py-2 text-right">Poids (g)</th>
              <th className="px-3 py-2 text-center">Niveau</th>
              <th className="px-3 py-2 text-right">Affranchiss.</th>
              <th className="px-3 py-2 text-right">AR</th>
              <th className="px-3 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {sinistres.length === 0 ? (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-slate-400">Aucun sinistre.</td></tr>
            ) : sinistres.map((s) => <LigneCout key={s.id} s={s} niveau={niv(s)} onSave={(patch) => void save(s.id, patch)} />)}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold text-navy">
              <td className="px-3 py-2">Total ({chiffres.length} lettre{chiffres.length > 1 ? "s" : ""})</td>
              <td />
              <td />
              <td className="px-3 py-2 text-right">{eurosP(Math.round(totalAff * 100) / 100)}</td>
              <td className="px-3 py-2 text-right">{eurosP(Math.round(totalAR * 100) / 100)}</td>
              <td className="px-3 py-2 text-right text-emerald-700">{eurosP(Math.round(totalGen * 100) / 100)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        {sansPoids > 0 && `${sansPoids} sinistre(s) sans poids saisi. `}
        {horsGrille > 0 && `${horsGrille} envoi(s) hors grille (> 2 kg). `}
        AR (+{eurosP(TARIF_AR)}) inclus sur chaque lettre chiffrée.
      </p>
    </div>
  );
}

function LigneCout({ s, niveau, onSave }: { s: Sinistre; niveau: NiveauReco; onSave: (patch: Partial<Sinistre>) => void }) {
  const [poids, setPoids] = useState(s.poidsEnvoi != null ? String(s.poidsEnvoi) : "");
  useEffect(() => { setPoids(s.poidsEnvoi != null ? String(s.poidsEnvoi) : ""); }, [s.poidsEnvoi]);
  const p = poids ? Number(poids) : 0;
  const aff = p > 0 ? affranchissement(p, niveau) : null;
  const total = p > 0 ? coutEnvoi(p, niveau, true) : null;
  const horsGrille = p > 0 && aff == null;

  const enregistrer = () => {
    const val = poids ? Math.max(0, Math.round(Number(poids))) : null;
    if ((val ?? null) !== (s.poidsEnvoi ?? null)) onSave({ poidsEnvoi: val });
  };

  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-3 py-2">
        <div className="font-semibold text-navy">{s.coproNom || "Copropriété"}</div>
        <div className="text-[11px] text-slate-400">{s.reference}</div>
      </td>
      <td className="px-3 py-2 text-right">
        <input type="number" inputMode="numeric" value={poids} onChange={(e) => setPoids(e.target.value)} onBlur={enregistrer} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()} placeholder="—" className="w-20 rounded-md border border-slate-200 px-2 py-1 text-right text-sm focus:border-copper focus:outline-none" />
      </td>
      <td className="px-3 py-2 text-center">
        <select value={niveau} onChange={(e) => onSave({ niveauReco: e.target.value })} className="rounded-md border border-slate-200 px-2 py-1 text-sm font-semibold text-navy focus:border-copper focus:outline-none">
          {NIVEAUX_RECO.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </td>
      <td className="px-3 py-2 text-right text-slate-600">{horsGrille ? <span className="text-amber-600">&gt; 2 kg</span> : aff != null ? eurosP(aff) : "—"}</td>
      <td className="px-3 py-2 text-right text-slate-500">{total != null ? eurosP(TARIF_AR) : "—"}</td>
      <td className="px-3 py-2 text-right font-bold text-navy">{total != null ? eurosP(total) : "—"}</td>
    </tr>
  );
}

// ------- Formulaire de création -------
function FormSinistre({ onCancel, onSaved }: { onCancel: () => void; onSaved: (s: Sinistre) => void }) {
  const [f, setF] = useState<Partial<Sinistre>>({ motif: "Inondation", statut: "Déclaré", dateSinistre: new Date().toISOString().slice(0, 10), qualite: "Syndic de copropriété", signataire: "CENTURY 21 ICAZA Immobilier" });
  const [fichiers, setFichiers] = useState<File[]>([]);
  const [enreg, setEnreg] = useState(false);
  const [progres, setProgres] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [survol, setSurvol] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (k: keyof Sinistre, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  const ajouterFichiers = (liste: FileList | null) => {
    if (!liste) return;
    const valides = Array.from(liste).filter((x) => estImage(x) || estPdf(x));
    setFichiers((p) => [...p, ...valides]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const soumettre = async () => {
    if (!f.coproNom?.trim() && !f.coproAdresse?.trim()) { setErr("Indique au moins la copropriété."); return; }
    setEnreg(true); setErr(null);
    const s = await createSinistre(f);
    if (!s) { setEnreg(false); setErr("Enregistrement impossible (réessaie)."); return; }
    let final = s;
    if (fichiers.length > 0) {
      try {
        const maj = await televerserFichiers(s.id, fichiers, (fait, total) => setProgres(`Envoi des pièces… ${fait}/${total}`));
        if (maj) final = maj;
      } catch (e) { setErr(`Sinistre créé, mais une pièce n'a pas pu être envoyée : ${e instanceof Error ? e.message : ""} (tu peux la rajouter dans la fiche).`); }
    }
    setEnreg(false); setProgres("");
    onSaved(final);
  };

  const nbPhotos = fichiers.filter(estImage).length;
  const nbDocs = fichiers.filter(estPdf).length;

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-navy">Nouveau sinistre</h3>
      {err && <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{err}</div>}
      <ChampsSinistre f={f} set={set} />

      <div
        onDragOver={(e) => { e.preventDefault(); setSurvol(true); }}
        onDragLeave={(e) => { e.preventDefault(); setSurvol(false); }}
        onDrop={(e) => { e.preventDefault(); setSurvol(false); ajouterFichiers(e.dataTransfer.files); }}
        className={`mt-4 rounded-xl border-2 border-dashed p-3 transition ${survol ? "border-copper bg-copper/5" : "border-slate-300 bg-slate-50"}`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Pièces jointes (photos &amp; PDF)</span>
          <button type="button" onClick={() => fileRef.current?.click()} className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-navy shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100">+ Ajouter</button>
        </div>
        <input ref={fileRef} type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={(e) => ajouterFichiers(e.target.files)} />
        {fichiers.length === 0 ? (
          <p className="text-xs text-slate-400">📂 Glisse-dépose ici (ou clique « + Ajouter ») les photos des dégâts et les documents PDF (constat, devis, rapport…). Les photos iront aussi en annexe de la déclaration.</p>
        ) : (
          <>
            <p className="mb-2 text-[11px] text-slate-500">{nbPhotos} photo(s) · {nbDocs} PDF</p>
            <ul className="space-y-1">
              {fichiers.map((file, i) => (
                <li key={i} className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 text-xs ring-1 ring-slate-100">
                  <span>{estPdf(file) ? "📄" : "🖼️"}</span>
                  <span className="min-w-0 flex-1 truncate text-slate-600">{file.name}</span>
                  <span className="shrink-0 text-slate-400">{octetsLisible(file.size)}</span>
                  <button type="button" onClick={() => setFichiers((p) => p.filter((_, j) => j !== i))} className="shrink-0 text-red-400 hover:text-red-600">✕</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button onClick={() => void soumettre()} disabled={enreg} className="rounded-lg bg-navy px-5 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{enreg ? (progres || "Enregistrement…") : "Enregistrer"}</button>
        <button onClick={onCancel} disabled={enreg} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50">Annuler</button>
      </div>
    </div>
  );
}

// ------- Import d'un PDF « Ouvertures de sinistres » -------
function ImportPdf({ onCancel, onImported }: { onCancel: () => void; onImported: (crees: Sinistre[]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<"choix" | "analyse" | "revue" | "creation">("choix");
  const [items, setItems] = useState<SinistreImporte[]>([]);
  const [progres, setProgres] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const analyser = async (file: File | null) => {
    if (!file) return;
    setPhase("analyse"); setErr(null); setProgres("Lecture du PDF…");
    try {
      const res = await analyserPdfOuvertures(file, (fait, total) => setProgres(`Découpage… ${fait}/${total}`));
      if (res.length === 0) { setErr("Aucune lettre de déclaration détectée dans ce PDF."); setPhase("choix"); return; }
      setItems(res); setPhase("revue");
    } catch (e) { setErr(e instanceof Error ? e.message : "Analyse impossible"); setPhase("choix"); }
    if (fileRef.current) fileRef.current.value = "";
  };

  const setItem = (i: number, patch: Partial<SinistreImporte> | { champs: Partial<Sinistre> }) =>
    setItems((p) => p.map((it, j) => (j === i ? { ...it, ...patch } : it)));

  const creer = async () => {
    const aCreer = items.filter((it) => it.garder);
    if (aCreer.length === 0) return;
    setPhase("creation"); setErr(null);
    const crees: Sinistre[] = [];
    let fait = 0;
    for (const it of aCreer) {
      fait += 1;
      setProgres(`Création ${fait}/${aCreer.length} — ${it.champs.coproNom || "copropriété"}…`);
      try {
        const s = await createSinistre(it.champs);
        if (!s) continue;
        const nom = `Ouverture sinistre - ${(it.champs.coproNom || "copropriété").replace(/[\\/:*?"<>|]/g, "-")}.pdf`;
        const maj = await ajouterDocument(s.id, { nom, data: it.pdfBase64 }).catch(() => null);
        crees.push(maj ?? s);
      } catch { /* on continue avec les suivants */ }
    }
    setPhase("revue");
    onImported(crees);
  };

  const nbGardes = items.filter((it) => it.garder).length;

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-navy">📥 Importer un PDF d'ouvertures de sinistres</h3>
        <button onClick={onCancel} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">Fermer</button>
      </div>
      {err && <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{err}</div>}

      {phase === "choix" && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="mb-3 text-sm text-slate-600">Dépose le PDF récapitulatif (lettres de déclaration + annexes photos). L'outil détecte chaque copropriété, découpe un PDF par sinistre et pré-remplit les fiches.</p>
          <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => void analyser(e.target.files?.[0] ?? null)} />
          <button onClick={() => fileRef.current?.click()} className="rounded-lg bg-navy px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110">Choisir le PDF</button>
        </div>
      )}

      {phase === "analyse" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">{progres || "Analyse…"}</div>
      )}

      {(phase === "revue" || phase === "creation") && (
        <>
          <p className="mb-3 text-sm text-slate-500">{items.length} sinistre(s) détecté(s). Vérifie et ajuste si besoin, puis crée-les. Chaque fiche recevra son PDF (lettre + photos) en pièce jointe.</p>
          <div className="space-y-2">
            {items.map((it, i) => (
              <div key={i} className={`rounded-xl border p-3 ${it.garder ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-60"}`}>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={it.garder} onChange={(e) => setItem(i, { garder: e.target.checked })} className="h-4 w-4" />
                  <input value={it.champs.coproNom ?? ""} onChange={(e) => setItem(i, { champs: { ...it.champs, coproNom: e.target.value } })} className="min-w-0 flex-1 rounded-md border border-slate-200 px-2 py-1 text-sm font-bold text-navy focus:border-copper focus:outline-none" />
                  <select value={it.champs.motif ?? "Autre"} onChange={(e) => setItem(i, { champs: { ...it.champs, motif: e.target.value } })} className="shrink-0 rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-navy focus:border-copper focus:outline-none">
                    {MOTIFS_SINISTRE.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 pl-6 text-[11px] text-slate-500">
                  {it.champs.coproAdresse && <span>📍 {it.champs.coproAdresse}</span>}
                  {it.champs.assureur && <span>🏢 {it.champs.assureur}</span>}
                  {it.champs.assurancePolice && <span>N° {it.champs.assurancePolice}</span>}
                  <span>📄 {it.pages.length} page(s) · {octetsLisible(it.taille)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={() => void creer()} disabled={phase === "creation" || nbGardes === 0} className="rounded-lg bg-copper px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{phase === "creation" ? (progres || "Création…") : `Créer ${nbGardes} sinistre(s)`}</button>
            {phase !== "creation" && <button onClick={() => { setPhase("choix"); setItems([]); }} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">Changer de PDF</button>}
          </div>
        </>
      )}
    </div>
  );
}

// Champs partagés création / édition.
function ChampsSinistre({ f, set }: { f: Partial<Sinistre>; set: (k: keyof Sinistre, v: unknown) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className={labelCls}>Copropriété</label><input value={f.coproNom ?? ""} onChange={(e) => set("coproNom", e.target.value)} placeholder="Nom de la copropriété" className={champ} /></div>
        <div><label className={labelCls}>Adresse</label><input value={f.coproAdresse ?? ""} onChange={(e) => set("coproAdresse", e.target.value)} placeholder="Adresse du bâtiment" className={champ} /></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div><label className={labelCls}>Motif</label><select value={f.motif ?? "Inondation"} onChange={(e) => set("motif", e.target.value)} className={champ}>{MOTIFS_SINISTRE.map((m) => <option key={m} value={m}>{m}</option>)}</select></div>
        <div><label className={labelCls}>Date du sinistre</label><input type="date" value={f.dateSinistre ?? ""} onChange={(e) => set("dateSinistre", e.target.value)} className={champ} /></div>
        <div><label className={labelCls}>Gravité</label><select value={f.gravite ?? ""} onChange={(e) => set("gravite", e.target.value)} className={champ}><option value="">—</option><option>Léger</option><option>Modéré</option><option>Grave</option></select></div>
      </div>
      <div><label className={labelCls}>Description / circonstances</label><textarea value={f.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Ce qui s'est passé, les parties touchées…" className={champ} /></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className={labelCls}>Statut</label><select value={f.statut ?? "Déclaré"} onChange={(e) => set("statut", e.target.value)} className={champ}>{STATUTS_SINISTRE.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
        <div><label className={labelCls}>Montant estimé (€)</label><input type="number" value={f.montantEstime ?? ""} onChange={(e) => set("montantEstime", e.target.value ? Number(e.target.value) : null)} placeholder="0" className={champ} /></div>
      </div>
      <div className="rounded-xl bg-slate-50 p-3">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Assurance</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className={labelCls}>Assureur</label><input value={f.assureur ?? ""} onChange={(e) => set("assureur", e.target.value)} placeholder="Compagnie d'assurance" className={champ} /></div>
          <div><label className={labelCls}>N° contrat / police</label><input value={f.assurancePolice ?? ""} onChange={(e) => set("assurancePolice", e.target.value)} className={champ} /></div>
          <div><label className={labelCls}>Adresse de l'assurance</label><textarea value={f.assuranceAdresse ?? ""} onChange={(e) => set("assuranceAdresse", e.target.value)} rows={2} placeholder="Service sinistres, adresse postale…" className={champ} /></div>
          <div><label className={labelCls}>Contact (tél. / email)</label><textarea value={f.assuranceContact ?? ""} onChange={(e) => set("assuranceContact", e.target.value)} rows={2} className={champ} /></div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className={labelCls}>Signataire</label><input value={f.signataire ?? ""} onChange={(e) => set("signataire", e.target.value)} className={champ} /></div>
        <div><label className={labelCls}>Qualité du signataire</label><input value={f.qualite ?? ""} onChange={(e) => set("qualite", e.target.value)} placeholder="Syndic de copropriété" className={champ} /></div>
      </div>
    </div>
  );
}

// ------- Fiche détaillée -------
function FicheSinistre({ s, onRetour, onChange, onDelete }: { s: Sinistre; onRetour: () => void; onChange: (s: Sinistre) => void; onDelete: () => void }) {
  const [f, setF] = useState<Partial<Sinistre>>(s);
  const [enreg, setEnreg] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [onglet, setOnglet] = useState<"infos" | "photos" | "documents" | "suivi" | "declaration">("infos");
  const set = (k: keyof Sinistre, v: unknown) => { setF((p) => ({ ...p, [k]: v })); setDirty(true); };

  useEffect(() => { setF(s); setDirty(false); }, [s.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const enregistrer = async () => {
    setEnreg(true);
    const maj = await updateSinistre(s.id, f);
    setEnreg(false);
    if (maj) { onChange(maj); setDirty(false); }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Tous les sinistres</button>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeStatut(s.statut)}`}>{s.statut}</span>
        <span className="text-xs text-slate-400">{s.reference}</span>
        {dirty && <button onClick={() => void enregistrer()} disabled={enreg} className="ml-auto rounded-lg bg-copper px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{enreg ? "Enregistrement…" : "💾 Enregistrer"}</button>}
      </div>

      <div className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-l-4 border-copper bg-slate-50/70 p-4">
          <div className="text-xl font-black text-navy">{MOTIF_ICONE[s.motif] ?? "📍"} {s.coproNom || "Copropriété"}</div>
          <div className="text-sm text-slate-600">{s.motif} · {dateFr(s.dateSinistre)}{s.coproAdresse ? ` · ${s.coproAdresse}` : ""}</div>
        </div>
        <div className="flex flex-wrap gap-1 border-b border-slate-100 p-2">
          {([["infos", "📋 Infos"], ["photos", `📷 Photos (${s.photos.length})`], ["documents", `📎 Documents (${s.documents.length})`], ["suivi", `📈 Suivi (${s.suivi.length})`], ["declaration", "📄 Déclaration"]] as const).map(([v, t]) => (
            <button key={v} onClick={() => setOnglet(v)} className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${onglet === v ? "bg-navy text-white" : "text-slate-500 hover:text-navy"}`}>{t}</button>
          ))}
        </div>

        <div className="p-4">
          {onglet === "infos" && (
            <>
              <ChampsSinistre f={f} set={set} />
              <div className="mt-5 flex gap-2">
                <button onClick={() => void enregistrer()} disabled={enreg || !dirty} className="rounded-lg bg-navy px-5 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-40">{enreg ? "Enregistrement…" : "Enregistrer"}</button>
                <button onClick={() => { if (confirm("Supprimer définitivement ce sinistre et ses photos ?")) onDelete(); }} className="ml-auto rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100">Supprimer</button>
              </div>
            </>
          )}
          {onglet === "photos" && <OngletPhotos s={s} onChange={onChange} />}
          {onglet === "documents" && <OngletDocuments s={s} onChange={onChange} />}
          {onglet === "suivi" && <OngletSuivi s={s} onChange={onChange} />}
          {onglet === "declaration" && <OngletDeclaration s={s} />}
        </div>
      </div>
    </div>
  );
}

// ------- Onglet photos -------
function OngletPhotos({ s, onChange }: { s: Sinistre; onChange: (s: Sinistre) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [envoi, setEnvoi] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const ajouter = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setEnvoi(true); setErr(null);
    let dernier: Sinistre | null = null;
    try {
      for (const file of Array.from(files)) {
        const data = await compresserPhoto(file);
        dernier = await ajouterPhoto(s.id, { nom: file.name.replace(/\.[^.]+$/, "").slice(0, 60), legende: "", data });
      }
      if (dernier) onChange(dernier);
    } catch (e) { setErr(e instanceof Error ? e.message : "Envoi impossible"); }
    setEnvoi(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const majLegende = async (photoId: string, nom: string, legende: string) => { const maj = await modifierPhoto(s.id, photoId, nom, legende); if (maj) onChange(maj); };
  const supprimer = async (photoId: string) => { const maj = await supprimerPhoto(s.id, photoId); if (maj) onChange(maj); };

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => void ajouter(e.target.files)} />
      <ZoneDepot onFiles={(f) => void ajouter(f)} disabled={envoi}>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => fileRef.current?.click()} disabled={envoi} className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{envoi ? "Envoi…" : "+ Ajouter des photos"}</button>
          <span className="text-xs text-slate-500">📂 Glisse-dépose tes photos ici, ou clique. Chaque photo peut être légendée (l'explication apparaît sous la photo dans la déclaration).</span>
        </div>
      </ZoneDepot>
      <div className="mb-3" />
      {err && <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{err}</div>}
      {s.photos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">Aucune photo pour l'instant.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {s.photos.map((p, i) => (
            <div key={p.id} className="overflow-hidden rounded-xl border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={urlPhotoSinistre(s.id, p.id)} alt={p.nom} className="h-44 w-full bg-slate-100 object-cover" />
              <div className="space-y-1.5 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">Photo {i + 1}</span>
                  <button onClick={() => void supprimer(p.id)} className="text-[11px] font-semibold text-red-500 hover:underline">Supprimer</button>
                </div>
                <input defaultValue={p.nom} onBlur={(e) => { if (e.target.value !== p.nom) void majLegende(p.id, e.target.value, p.legende); }} placeholder="Titre (ex. Hall d'entrée)" className="w-full rounded-md border border-slate-200 px-2 py-1 text-xs focus:border-copper focus:outline-none" />
                <textarea defaultValue={p.legende} onBlur={(e) => { if (e.target.value !== p.legende) void majLegende(p.id, p.nom, e.target.value); }} rows={2} placeholder="Explication (apparaît sous la photo)…" className="w-full rounded-md border border-slate-200 px-2 py-1 text-xs focus:border-copper focus:outline-none" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ------- Onglet documents (PDF) -------
function OngletDocuments({ s, onChange }: { s: Sinistre; onChange: (s: Sinistre) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [envoi, setEnvoi] = useState(false);
  const [progres, setProgres] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const ajouter = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const liste = Array.from(files).filter(estPdf);
    if (liste.length === 0) { setErr("Seuls les fichiers PDF sont acceptés ici (les photos se mettent dans l'onglet « Photos »)."); if (fileRef.current) fileRef.current.value = ""; return; }
    setEnvoi(true); setErr(null);
    try {
      const maj = await televerserFichiers(s.id, liste, (fait, total) => setProgres(`${fait}/${total}`));
      if (maj) onChange(maj);
    } catch (e) { setErr(e instanceof Error ? e.message : "Envoi impossible"); }
    setEnvoi(false); setProgres("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const supprimer = async (docId: string) => { const maj = await supprimerDocument(s.id, docId); if (maj) onChange(maj); };

  return (
    <div>
      <input ref={fileRef} type="file" accept="application/pdf" multiple className="hidden" onChange={(e) => void ajouter(e.target.files)} />
      <ZoneDepot onFiles={(f) => void ajouter(f)} disabled={envoi}>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => fileRef.current?.click()} disabled={envoi} className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{envoi ? `Envoi… ${progres}` : "+ Ajouter des PDF"}</button>
          <span className="text-xs text-slate-500">📂 Glisse-dépose tes PDF ici, ou clique. Constat, devis, rapport d'expertise, courriers…</span>
        </div>
      </ZoneDepot>
      <div className="mb-3" />
      {err && <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{err}</div>}
      {s.documents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">Aucun document PDF pour l'instant.</div>
      ) : (
        <ul className="space-y-2">
          {s.documents.map((d) => (
            <li key={d.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-lg">📄</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-navy">{d.nom}</div>
                <div className="text-[11px] text-slate-400">{octetsLisible(d.taille)} · {dateFr(new Date(d.addedAt).toISOString().slice(0, 10))}</div>
              </div>
              <a href={urlDocumentSinistre(s.id, d.id)} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-navy transition hover:bg-slate-100">Ouvrir</a>
              <button onClick={() => void supprimer(d.id)} className="shrink-0 text-[11px] font-semibold text-red-500 hover:underline">Supprimer</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ------- Onglet suivi -------
function OngletSuivi({ s, onChange }: { s: Sinistre; onChange: (s: Sinistre) => void }) {
  const [texte, setTexte] = useState("");
  const [statut, setStatut] = useState("");
  const [envoi, setEnvoi] = useState(false);

  const ajouter = async () => {
    if (!texte.trim() && !statut) return;
    setEnvoi(true);
    const maj = await ajouterSuivi(s.id, texte, statut || undefined);
    setEnvoi(false);
    if (maj) { onChange(maj); setTexte(""); setStatut(""); }
  };

  const entrees = [...s.suivi].sort((a, b) => b.date - a.date);

  return (
    <div>
      <div className="mb-4 rounded-xl bg-slate-50 p-3">
        <label className={labelCls}>Ajouter une étape</label>
        <textarea value={texte} onChange={(e) => setTexte(e.target.value)} rows={2} placeholder="Ex. Expert mandaté, passage prévu le…" className={champ} />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <select value={statut} onChange={(e) => setStatut(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-semibold text-navy focus:border-copper focus:outline-none">
            <option value="">(ne pas changer le statut)</option>
            {STATUTS_SINISTRE.map((x) => <option key={x} value={x}>Passer à : {x}</option>)}
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

// ------- Onglet déclaration d'assurance -------
function OngletDeclaration({ s }: { s: Sinistre }) {
  const [lieu, setLieu] = useState("Martigues");
  const [circonstances, setCirconstances] = useState("");
  const [dommages, setDommages] = useState("");
  const [recommande, setRecommande] = useState(true);
  const [gen, setGen] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const generer = async () => {
    setGen(true); setErr(null);
    try {
      const photos: PhotoBytes[] = [];
      for (const p of s.photos) {
        try {
          const r = await fetch(urlPhotoSinistre(s.id, p.id), { cache: "no-store" });
          if (r.ok) photos.push({ nom: p.nom, legende: p.legende, bytes: new Uint8Array(await r.arrayBuffer()) });
        } catch { /* on ignore une photo illisible */ }
      }
      const octets = await genererDeclarationSinistrePdf(s, photos, { lieu, circonstances, dommages, recommande });
      const nomFichier = `Declaration ${s.reference || s.coproNom || "sinistre"}`.replace(/[\\/:*?"<>|]/g, "-") + ".pdf";
      telechargerPdf(octets, nomFichier);
    } catch (e) { setErr(e instanceof Error ? e.message : "Génération impossible"); }
    setGen(false);
  };

  const manque: string[] = [];
  if (!s.assureur) manque.push("l'assureur");
  if (!s.assuranceAdresse && !s.assuranceContact) manque.push("les coordonnées de l'assurance");

  return (
    <div>
      <p className="mb-3 text-sm text-slate-500">Génère une <strong>lettre de déclaration de sinistre</strong> pré-remplie (copropriété, motif, assurance) avec en annexe toutes les photos et leur explication. Complète si besoin les champs ci-dessous.</p>
      {manque.length > 0 && <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">Pense à renseigner {manque.join(" et ")} dans l'onglet « Infos » pour une déclaration complète.</div>}
      {err && <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}

      <div className="space-y-3 rounded-xl bg-slate-50 p-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className={labelCls}>Lieu de rédaction</label><input value={lieu} onChange={(e) => setLieu(e.target.value)} className={champ} /></div>
          <label className="flex items-end gap-2 pb-2 text-sm font-semibold text-slate-600"><input type="checkbox" checked={recommande} onChange={(e) => setRecommande(e.target.checked)} /> Mention « recommandé avec AR »</label>
        </div>
        <div><label className={labelCls}>Circonstances complémentaires (optionnel)</label><textarea value={circonstances} onChange={(e) => setCirconstances(e.target.value)} rows={2} placeholder="Précisions sur l'origine, l'étendue…" className={champ} /></div>
        <div><label className={labelCls}>Dommages constatés (une ligne par dommage, optionnel)</label><textarea value={dommages} onChange={(e) => setDommages(e.target.value)} rows={3} placeholder={"Sous-sol inondé\nHall d'entrée dégradé\nTableau électrique HS"} className={champ} /></div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button onClick={() => void generer()} disabled={gen} className="rounded-lg bg-copper px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{gen ? "Génération…" : "📄 Générer la déclaration (PDF)"}</button>
        <span className="text-xs text-slate-400">{s.photos.length} photo(s) en annexe</span>
      </div>
    </div>
  );
}
