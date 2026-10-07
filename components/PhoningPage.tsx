"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { EQUIPE } from "@/lib/equipe";
import { SCRIPTS_PHONING, STATUTS_PHONING, PALIER_REMOTIVATION, type ScriptPhoning } from "@/lib/phoningScripts";
import { chargerPhoning, sauverPhoning, listerPhoning, chargerMotivation, sauverMotivation, chargerBasePhoning, remplacerBasePhoning, statsLignes, statsData, type LignePhoning, type PhoningData, type BaseContact } from "@/lib/phoning";

// Actions rapides (un clic = résultat d'appel pointé). « neg » = non / non décroché.
type TypeAction = "neg" | "neutre" | "pos";
const ACTIONS: { label: string; icone: string; statut: string; type: TypeAction; cls: string }[] = [
  { label: "Non", icone: "❌", statut: "Pas intéressé", type: "neg", cls: "border-red-200 text-red-600 hover:bg-red-50" },
  { label: "Pas décroché", icone: "📵", statut: "Répondeur", type: "neg", cls: "border-amber-200 text-amber-700 hover:bg-amber-50" },
  { label: "Rappel", icone: "🔁", statut: "Rappel", type: "neutre", cls: "border-blue-200 text-blue-700 hover:bg-blue-50" },
  { label: "RDV", icone: "✅", statut: "RDV fixé", type: "pos", cls: "border-emerald-300 text-emerald-700 hover:bg-emerald-50" },
  { label: "Mandat", icone: "🏆", statut: "Mandat / Vente", type: "pos", cls: "border-copper/40 text-copper hover:bg-copper/10" },
];

const CLE_NEGO = "phoning:nego:v1";
const APPRENANTS = EQUIPE.filter((m) => m.sections.some((s) => s === "transaction" || s === "gestion"));

const STYLE_STATUT: Record<string, string> = {
  "À appeler": "bg-slate-100 text-slate-600",
  "Répondeur": "bg-amber-100 text-amber-700",
  "Rappel": "bg-blue-100 text-blue-700",
  "Injoignable": "bg-slate-200 text-slate-500",
  "Pas intéressé": "bg-red-100 text-red-600",
  "RDV fixé": "bg-emerald-100 text-emerald-700",
  "Mandat / Vente": "bg-copper/15 text-copper",
};

// --- markdown léger pour les scripts : "## ", "- ", **gras** ---
function inline(t: string, k: string): ReactNode {
  return t.split(/(\*\*[^*]+\*\*)/g).map((b, i) =>
    b.startsWith("**") && b.endsWith("**")
      ? <strong key={`${k}-${i}`} className="font-semibold text-navy">{b.slice(2, -2)}</strong>
      : <span key={`${k}-${i}`}>{b}</span>,
  );
}
function LigneScript({ l, k }: { l: string; k: string }) {
  if (l.startsWith("- ")) return <li className="flex gap-2 text-sm leading-relaxed text-slate-700"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" /><span className="flex-1">{inline(l.slice(2), k)}</span></li>;
  return <p className="my-1.5 text-sm leading-relaxed text-slate-700">{inline(l, k)}</p>;
}

// --- dates ---
const toInput = (ts?: number) => { if (!ts) return ""; const d = new Date(ts); const p = (n: number) => String(n).padStart(2, "0"); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; };
const fromInput = (s: string) => { if (!s) return undefined; const t = new Date(`${s}T12:00:00`).getTime(); return Number.isFinite(t) ? t : undefined; };
const nouvelId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// --- Import CSV ---
// Analyse un CSV (détecte le séparateur , ; ou tabulation ; gère les guillemets).
function parseCSV(texte: string): { headers: string[]; rows: string[][] } {
  const t = texte.replace(/^﻿/, "");
  const premiere = t.slice(0, t.indexOf("\n") >= 0 ? t.indexOf("\n") : t.length);
  const c: Record<string, number> = { ",": 0, ";": 0, "\t": 0 };
  for (const ch of premiere) if (ch in c) c[ch]++;
  const delim = c[";"] >= c[","] && c[";"] >= c["\t"] ? ";" : c["\t"] > c[","] ? "\t" : ",";
  const rows: string[][] = []; let row: string[] = []; let champ = ""; let q = false;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (q) {
      if (ch === '"') { if (t[i + 1] === '"') { champ += '"'; i++; } else q = false; }
      else champ += ch;
    } else if (ch === '"') q = true;
    else if (ch === delim) { row.push(champ); champ = ""; }
    else if (ch === "\n") { row.push(champ); rows.push(row); row = []; champ = ""; }
    else if (ch !== "\r") champ += ch;
  }
  if (champ.length || row.length) { row.push(champ); rows.push(row); }
  const clean = rows.filter((r) => r.some((x) => x.trim() !== ""));
  if (!clean.length) return { headers: [], rows: [] };
  return { headers: clean[0].map((h) => h.trim()), rows: clean.slice(1) };
}
// Les notes importées sont de la forme "Label : valeur · Label : valeur …".
// On les éclate pour un affichage propre (puces label/valeur).
function parseInfos(notes: string): { label: string; value: string }[] {
  if (!notes) return [];
  return notes.split(" · ").map((seg) => {
    const i = seg.indexOf(" : ");
    return i > 0 ? { label: seg.slice(0, i).trim(), value: seg.slice(i + 3).trim() } : { label: "", value: seg.trim() };
  }).filter((x) => x.value);
}

function guessCol(headers: string[], mots: string[], exclure: string[] = []): number {
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i].toLowerCase();
    if (exclure.some((e) => h.includes(e))) continue;
    if (mots.some((m) => h.includes(m))) return i;
  }
  return -1;
}

function ScriptPanneau({ script }: { script: ScriptPhoning }) {
  const [ouvert, setOuvert] = useState(true);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button onClick={() => setOuvert((o) => !o)} className="flex w-full items-center justify-between gap-2 p-4 text-left">
        <span className="flex items-center gap-2 text-base font-bold text-navy"><span className="text-xl">{script.icone}</span> Script d'appel — {script.titre}</span>
        <span className="text-slate-400">{ouvert ? "▾" : "▸"}</span>
      </button>
      {ouvert && (
        <div className="border-t border-slate-100 p-4 pt-3">
          <div className="mb-3 rounded-xl bg-copper/5 p-3 text-sm text-slate-700"><strong className="text-copper">🎯 Objectif : </strong>{script.objectif}</div>
          <div className="space-y-4">
            {script.blocs.map((b, bi) => (
              <div key={bi}>
                <h4 className="mb-1 text-[12.5px] font-bold uppercase tracking-wider text-copper">{b.titre}</h4>
                <ul className="space-y-1">{b.lignes.map((l, li) => <LigneScript key={li} l={l} k={`${bi}-${li}`} />)}</ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ImportCSV({ cibleDefaut, estAdmin, onImporter, onBase, onFermer }: { cibleDefaut: string; estAdmin: boolean; onImporter: (cible: string, lignes: LignePhoning[]) => void; onBase: (cible: string, contacts: BaseContact[], mode: "ajouter" | "remplacer") => Promise<boolean>; onFermer: () => void }) {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [map, setMap] = useState({ prenom: -1, nom: -1, tel: -1 });
  const [cible, setCible] = useState(cibleDefaut);
  const [dest, setDest] = useState<"table" | "base">("table");
  const [modeBase, setModeBase] = useState<"ajouter" | "remplacer">("ajouter");
  const [colle, setColle] = useState("");
  const [erreur, setErreur] = useState("");
  const [occupe, setOccupe] = useState(false);

  const traiter = (texte: string) => {
    const r = parseCSV(texte);
    if (!r.headers.length) { setErreur("Fichier/texte vide ou illisible."); setHeaders([]); setRows([]); return; }
    setErreur(""); setHeaders(r.headers); setRows(r.rows);
    setMap({
      prenom: guessCol(r.headers, ["prénom", "prenom", "first"]),
      nom: guessCol(r.headers, ["nom", "contact", "client", "propriétaire", "proprietaire", "vendeur", "bailleur", "acquéreur", "acquereur", "name"], ["prénom", "prenom"]),
      tel: guessCol(r.headers, ["téléphone", "telephone", "tél", "tel", "mobile", "portable", "gsm", "phone"]),
    });
  };
  // Accepte le CSV mais aussi directement un fichier Excel (.xlsx/.xls).
  const onFichier = async (f: File | null) => {
    if (!f) return;
    const nom = f.name.toLowerCase();
    try {
      if (nom.endsWith(".xlsx") || nom.endsWith(".xls")) {
        const buf = await f.arrayBuffer();
        const XLSX = await import("xlsx");
        const wb = XLSX.read(buf, { type: "array", cellDates: true });
        const ws = wb.Sheets[wb.SheetNames[0]];
        traiter(XLSX.utils.sheet_to_csv(ws));
      } else {
        const rd = new FileReader(); rd.onload = () => traiter(String(rd.result || "")); rd.readAsText(f);
      }
    } catch { setErreur("Lecture du fichier impossible."); }
  };

  const val = (r: string[], i: number) => (i >= 0 ? (r[i] ?? "").trim() : "");
  // Les colonnes non identifiantes (ville, type, date, prix, email, adresse…)
  // sont regroupées dans les notes, pour donner tout le contexte au négociateur.
  const idsIdentite = new Set([map.prenom, map.nom, map.tel].filter((i) => i >= 0));
  const composerNotes = (r: string[]) => headers.map((h, i) => (idsIdentite.has(i) ? "" : (val(r, i) ? `${h} : ${val(r, i)}` : ""))).filter(Boolean).join(" · ").slice(0, 2000);
  const construire = (): LignePhoning[] => rows.map((r) => ({
    id: nouvelId(),
    contact: [val(r, map.prenom), val(r, map.nom)].filter(Boolean).join(" ") || val(r, 0),
    tel: val(r, map.tel),
    statut: "À appeler",
    notes: composerNotes(r),
    createdAt: Date.now(),
  })).filter((l) => l.contact || l.tel).slice(0, 20000);
  const apercu = headers.length ? construire() : [];
  const validerImport = async () => {
    if (dest === "base") {
      setOccupe(true);
      const ok = await onBase(cible, construire().map((l) => ({ contact: l.contact, tel: l.tel, notes: l.notes })), modeBase);
      setOccupe(false);
      if (ok) onFermer(); else setErreur("Enregistrement de la base impossible (accès admin requis).");
    } else {
      onImporter(cible, construire()); onFermer();
    }
  };

  const sel = (valeur: number, onCh: (n: number) => void) => (
    <select value={valeur} onChange={(e) => onCh(Number(e.target.value))} className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm focus:border-copper focus:outline-none">
      <option value={-1}>— aucune —</option>
      {headers.map((h, i) => <option key={i} value={i}>{h || `Colonne ${i + 1}`}</option>)}
    </select>
  );

  return (
    <div className="mb-4 rounded-2xl border border-copper/30 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-bold text-navy">📥 Importer des contacts (Excel ou CSV)</h3>
        <button onClick={onFermer} className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-50">✕ Fermer</button>
      </div>
      <p className="mb-3 text-xs text-slate-500">Chargez directement votre fichier <strong>Excel (.xlsx)</strong> ou un CSV (avec une ligne d'en-têtes). Les colonnes sont détectées automatiquement — ajustez si besoin. Toutes les colonnes non identifiantes (ville, type, date, prix, email…) sont regroupées dans les notes.</p>

      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:brightness-110">
          Choisir un fichier Excel / CSV
          <input type="file" accept=".xlsx,.xls,.csv,text/csv,text/plain" className="hidden" onChange={(e) => void onFichier(e.target.files?.[0] ?? null)} />
        </label>
        <span className="text-xs text-slate-400">ou collez vos lignes ci-dessous</span>
      </div>
      <div className="mt-2 flex gap-2">
        <textarea value={colle} onChange={(e) => setColle(e.target.value)} rows={3} placeholder="Nom;Téléphone;Notes&#10;M. Durand;0612345678;Estimation 2024" className="flex-1 rounded-lg border border-slate-200 p-2 font-mono text-xs focus:border-copper focus:outline-none" />
        <button onClick={() => traiter(colle)} disabled={!colle.trim()} className="shrink-0 self-start rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40">Analyser</button>
      </div>

      {erreur && <p className="mt-2 text-sm text-red-600">{erreur}</p>}

      {headers.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div><label className="text-xs font-semibold text-slate-500">Prénom (option.)</label>{sel(map.prenom, (n) => setMap((m) => ({ ...m, prenom: n })))}</div>
            <div><label className="text-xs font-semibold text-slate-500">Nom / Contact</label>{sel(map.nom, (n) => setMap((m) => ({ ...m, nom: n })))}</div>
            <div><label className="text-xs font-semibold text-slate-500">Téléphone</label>{sel(map.tel, (n) => setMap((m) => ({ ...m, tel: n })))}</div>
          </div>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <div><label className="text-xs font-semibold text-slate-500">Cible</label>
              <select value={cible} onChange={(e) => setCible(e.target.value)} className="block w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm font-semibold text-navy focus:border-copper focus:outline-none">
                {SCRIPTS_PHONING.map((s) => <option key={s.id} value={s.id}>{s.icone} {s.titre}</option>)}
              </select>
            </div>
            {estAdmin && (
              <div><label className="text-xs font-semibold text-slate-500">Destination</label>
                <select value={dest} onChange={(e) => setDest(e.target.value as "table" | "base")} className="block w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm font-semibold text-navy focus:border-copper focus:outline-none">
                  <option value="table">Mon tableau (perso)</option>
                  <option value="base">Base partagée (toute l&apos;équipe)</option>
                </select>
              </div>
            )}
            {estAdmin && dest === "base" && (
              <div><label className="text-xs font-semibold text-slate-500">Mode</label>
                <select value={modeBase} onChange={(e) => setModeBase(e.target.value as "ajouter" | "remplacer")} className="block w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm font-semibold text-navy focus:border-copper focus:outline-none">
                  <option value="ajouter">Ajouter à la base (sans doublon)</option>
                  <option value="remplacer">Remplacer toute la base</option>
                </select>
              </div>
            )}
            <button onClick={() => void validerImport()} disabled={apercu.length === 0 || occupe} className="rounded-lg bg-copper px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-40">
              {occupe ? "Enregistrement…" : dest === "base" ? (modeBase === "ajouter" ? `Ajouter ${apercu.length} contact(s) à la base` : `Remplacer la base par ${apercu.length} contact(s)`) : `Importer ${apercu.length} contact(s)`}
            </button>
          </div>
          {estAdmin && dest === "base" && (
            <p className="mt-2 text-[11px] text-amber-700">
              {modeBase === "ajouter"
                ? "➕ Les contacts seront ajoutés à la base partagée existante (les doublons par téléphone/nom sont ignorés)."
                : "⚠️ Attention : « Remplacer » efface toute la base partagée actuelle de cette cible avant d'enregistrer la nouvelle liste."}
            </p>
          )}
          {apercu.length > 0 && (
            <div className="mt-3">
              <div className="text-xs font-semibold text-slate-500">Aperçu ({apercu.length} ligne(s)) :</div>
              <div className="mt-1 overflow-x-auto rounded-lg border border-slate-100">
                <table className="w-full text-xs"><tbody>
                  {apercu.slice(0, 4).map((l) => (
                    <tr key={l.id} className="border-b border-slate-50 last:border-0"><td className="px-2 py-1 font-semibold text-navy">{l.contact || "—"}</td><td className="px-2 py-1 text-slate-600">{l.tel || "—"}</td><td className="px-2 py-1 text-slate-400">{l.notes}</td></tr>
                  ))}
                </tbody></table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PhoningPage({ onRetour, estAdmin = false }: { onRetour: () => void; estAdmin?: boolean }) {
  const [negoId, setNegoId] = useState<string>(() => { try { return localStorage.getItem(CLE_NEGO) ?? ""; } catch { return ""; } });
  const [data, setData] = useState<PhoningData>({});
  const [cible, setCible] = useState<string>(SCRIPTS_PHONING[0].id);
  const [base, setBase] = useState<BaseContact[]>([]); // base partagée de la cible courante
  const [chargement, setChargement] = useState(false);
  const [sauve, setSauve] = useState<"" | "en" | "ok">("");
  const [vueEquipe, setVueEquipe] = useState(false);
  const [equipe, setEquipe] = useState<Record<string, PhoningData>>({});
  const timerRef = useRef<number | null>(null);
  const dataRef = useRef<PhoningData>({});
  dataRef.current = data;

  // Session en cours (compteurs live + remotivation).
  const [sessAppels, setSessAppels] = useState(0);
  const [sessRdv, setSessRdv] = useState(0);
  const [streak, setStreak] = useState(0); // série négative (non + non décroché)
  const [phrases, setPhrases] = useState<string[]>([]);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [remotiv, setRemotiv] = useState<string | null>(null);
  const [celebr, setCelebr] = useState<string | null>(null);
  const [editeur, setEditeur] = useState(false);
  const [importOuvert, setImportOuvert] = useState(false);
  // Affichage de la liste : recherche, filtre « à appeler », pagination, édition note.
  const [q, setQ] = useState("");
  const [aAppelerSeul, setAAppelerSeul] = useState(false);
  const [limite, setLimite] = useState(40);
  const [noteOuverte, setNoteOuverte] = useState<string | null>(null);

  const estManager = (EQUIPE.find((m) => m.id === negoId)?.role ?? "").toLowerCase().includes("responsable");

  // Charge les phrases de remotivation (personnalisées par le manager).
  useEffect(() => { void (async () => setPhrases(await chargerMotivation()))(); }, []);

  // Pointage rapide d'un résultat d'appel (le cœur « interactif »).
  const pointer = (id: string, action: typeof ACTIONS[number]) => {
    modifier(id, { statut: action.statut });
    setSessAppels((a) => a + 1);
    if (action.type === "neg") {
      const n = streak + 1;
      setStreak(n);
      if (n % PALIER_REMOTIVATION === 0 && phrases.length) {
        setRemotiv(phrases[phraseIdx % phrases.length]);
        setPhraseIdx((i) => i + 1);
        setCelebr(null);
      }
    } else if (action.type === "pos") {
      setStreak(0);
      setRemotiv(null);
      if (action.statut === "RDV fixé") setSessRdv((r) => r + 1);
      setCelebr(action.statut === "Mandat / Vente" ? "🏆 Un mandat / une vente — énorme, continue sur ta lancée !" : "🎉 RDV décroché — bravo, c'est exactement pour ça qu'on appelle !");
    }
  };
  const resetSession = () => { setSessAppels(0); setSessRdv(0); setStreak(0); setRemotiv(null); setCelebr(null); };

  // Masque la félicitation après quelques secondes.
  useEffect(() => { if (!celebr) return; const t = window.setTimeout(() => setCelebr(null), 5000); return () => window.clearTimeout(t); }, [celebr]);

  // Chargement de la progression du négociateur choisi.
  useEffect(() => {
    try { if (negoId) localStorage.setItem(CLE_NEGO, negoId); else localStorage.removeItem(CLE_NEGO); } catch { /* ignore */ }
    if (!negoId) { setData({}); return; }
    let annule = false;
    setChargement(true);
    void (async () => {
      const d = await chargerPhoning(negoId);
      if (!annule) { setData(d); setChargement(false); }
    })();
    return () => { annule = true; };
  }, [negoId]);

  // Enregistrement différé (auto-save) après chaque modification.
  const maj = (d: PhoningData) => {
    setData(d); dataRef.current = d;
    if (!negoId) return;
    setSauve("en");
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(async () => {
      const ok = await sauverPhoning(negoId, dataRef.current);
      setSauve(ok ? "ok" : "");
    }, 700);
  };

  const lignes = data[cible] ?? [];
  const majLignes = (nouv: LignePhoning[]) => maj({ ...data, [cible]: nouv });

  const ajouter = () => majLignes([...lignes, { id: nouvelId(), contact: "", tel: "", statut: "À appeler", notes: "", createdAt: Date.now() }]);
  const modifier = (id: string, patch: Partial<LignePhoning>) => majLignes(lignes.map((l) => {
    if (l.id !== id) return l;
    const n = { ...l, ...patch };
    // si on passe « à appeler » → appelé et pas de date, on date du jour.
    if (patch.statut && patch.statut !== "À appeler" && !n.date) n.date = Date.now();
    return n;
  }));
  const supprimer = (id: string) => majLignes(lignes.filter((l) => l.id !== id));
  const importer = (cibleCible: string, nouvelles: LignePhoning[]) => {
    if (!nouvelles.length) return;
    maj({ ...data, [cibleCible]: [...(data[cibleCible] ?? []), ...nouvelles] });
    setCible(cibleCible);
  };

  // Base partagée de la cible courante (chargée à chaque changement de cible).
  useEffect(() => {
    let annule = false;
    void (async () => { const b = await chargerBasePhoning(cible); if (!annule) setBase(b); })();
    return () => { annule = true; };
  }, [cible]);

  // Admin : enregistre la base partagée d'une cible (ajout ou remplacement).
  const enregistrerBase = async (cibleCible: string, contacts: BaseContact[], mode: "ajouter" | "remplacer"): Promise<boolean> => {
    const r = await remplacerBasePhoning(cibleCible, contacts, mode);
    if (!r) return false;
    if (cibleCible === cible) setBase(r);
    return true;
  };

  // Charge la base partagée dans le tableau perso (sans doublon de téléphone).
  const telNorm = (t: string) => (t || "").replace(/\D/g, "");
  const chargerLaBase = () => {
    if (!base.length) return;
    const dejaTel = new Set(lignes.map((l) => telNorm(l.tel)).filter(Boolean));
    const dejaNom = new Set(lignes.map((l) => l.contact.trim().toLowerCase()).filter(Boolean));
    const nouvelles: LignePhoning[] = base
      .filter((c) => { const t = telNorm(c.tel); const n = c.contact.trim().toLowerCase(); return (t ? !dejaTel.has(t) : true) && (t || (n ? !dejaNom.has(n) : true)); })
      .map((c) => ({ id: nouvelId(), contact: c.contact, tel: c.tel, statut: "À appeler", notes: c.notes, createdAt: Date.now() }));
    if (nouvelles.length) majLignes([...lignes, ...nouvelles]);
  };

  const stCible = useMemo(() => statsLignes(lignes), [lignes]);
  const stGlobal = useMemo(() => statsData(data), [data]);

  // Liste filtrée (recherche + « à appeler ») et paginée pour rester fluide.
  const lignesFiltrees = useMemo(() => {
    const s = q.trim().toLowerCase();
    return lignes.filter((l) => {
      if (aAppelerSeul && l.statut && l.statut !== "À appeler") return false;
      if (s && !`${l.contact} ${l.tel} ${l.notes}`.toLowerCase().includes(s)) return false;
      return true;
    });
  }, [lignes, q, aAppelerSeul]);
  const visibles = lignesFiltrees.slice(0, limite);
  // Repart du haut quand la recherche, le filtre ou la cible changent.
  useEffect(() => { setLimite(40); }, [q, aAppelerSeul, cible]);

  // Vue équipe (manager)
  useEffect(() => {
    if (!vueEquipe) return;
    let annule = false;
    void (async () => { const e = await listerPhoning(); if (!annule) setEquipe(e); })();
    return () => { annule = true; };
  }, [vueEquipe]);

  const scriptCourant = SCRIPTS_PHONING.find((s) => s.id === cible)!;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Accueil</button>
        <h2 className="text-2xl font-bold text-navy">📞 Phoning</h2>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setVueEquipe((v) => !v)} className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${vueEquipe ? "border-copper bg-copper text-white" : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"}`}>👔 Vue équipe</button>
          <label className="text-xs font-semibold text-slate-500">Je suis</label>
          <select value={negoId} onChange={(e) => setNegoId(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-navy shadow-sm focus:border-copper focus:outline-none">
            <option value="">— Sélectionner —</option>
            {APPRENANTS.map((m) => <option key={m.id} value={m.id}>{m.nom}</option>)}
          </select>
          {negoId && <span className="text-[11px] font-semibold text-emerald-600">{sauve === "en" ? "Enregistrement…" : sauve === "ok" ? "✓ Enregistré" : ""}</span>}
        </div>
      </div>

      {vueEquipe ? (
        <VueEquipe equipe={equipe} onFermer={() => setVueEquipe(false)} />
      ) : !negoId ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
          Sélectionnez votre nom (en haut à droite) pour remplir vos tableaux de phoning. Votre activité est enregistrée et <strong>visible par la direction</strong> (bouton « Vue équipe »).
        </div>
      ) : (
        <>
          {/* onglets de cible */}
          <div className="mb-4 flex flex-wrap gap-2">
            {SCRIPTS_PHONING.map((s) => {
              const n = (data[s.id] ?? []).length;
              return (
                <button key={s.id} onClick={() => setCible(s.id)} className={`rounded-xl border px-3 py-2 text-left text-sm font-semibold transition ${cible === s.id ? "border-copper bg-copper/10 text-navy" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
                  <span className="mr-1">{s.icone}</span>{s.titre}{n > 0 && <span className="ml-1.5 rounded-full bg-navy/10 px-1.5 py-0.5 text-[10px] font-bold text-navy">{n}</span>}
                </button>
              );
            })}
          </div>

          {/* stats globales du négociateur */}
          <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {([["Contacts", stGlobal.total], ["À appeler", stGlobal.aAppeler], ["Appelés", stGlobal.appeles], ["RDV", stGlobal.rdv], ["Mandats/Ventes", stGlobal.mandats], ["Rappels", stGlobal.rappels]] as const).map(([lbl, v]) => (
              <div key={lbl} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center"><div className="text-lg font-bold text-navy">{v}</div><div className="text-[10px] text-slate-500">{lbl}</div></div>
            ))}
          </div>

          {/* Barre de session : compteurs en direct + série négative vers la prochaine remotivation */}
          <div className="mb-3 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="text-sm font-bold text-navy">🎧 Session en cours</div>
            <div className="flex items-center gap-4 text-sm">
              <span><strong className="text-navy">{sessAppels}</strong> <span className="text-slate-500">appels</span></span>
              <span><strong className="text-emerald-600">{sessRdv}</strong> <span className="text-slate-500">RDV</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Série négative</span>
              <div className="flex gap-1">
                {Array.from({ length: PALIER_REMOTIVATION }).map((_, i) => (
                  <span key={i} className={`h-2.5 w-2.5 rounded-full ${i < streak % PALIER_REMOTIVATION || (streak > 0 && streak % PALIER_REMOTIVATION === 0) ? "bg-copper" : "bg-slate-200"}`} />
                ))}
              </div>
              <span className="text-xs font-bold text-copper">{streak}</span>
            </div>
            <button onClick={resetSession} className="ml-auto rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-50">↺ Nouvelle session</button>
          </div>

          {/* Bannière de remotivation (toutes les 5 réponses négatives) */}
          {remotiv && (
            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-copper/30 bg-gradient-to-br from-copper to-copper/80 p-4 text-white shadow-md">
              <span className="text-2xl">💬</span>
              <div className="flex-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/80">Message de ton manager</div>
                <p className="mt-0.5 text-[15px] font-semibold leading-snug">« {remotiv} »</p>
                <div className="mt-1 text-xs text-white/80">— Enzo</div>
              </div>
              <button onClick={() => setRemotiv(null)} className="shrink-0 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-bold transition hover:bg-white/25">Je repars ! 💪</button>
            </div>
          )}
          {celebr && (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 shadow-sm">
              <p className="text-[15px] font-bold">{celebr}</p>
              <button onClick={() => setCelebr(null)} className="shrink-0 rounded-lg border border-emerald-300 px-3 py-1.5 text-sm font-semibold transition hover:bg-emerald-100">Suivant →</button>
            </div>
          )}

          {/* Éditeur de phrases (manager) */}
          {estManager && (
            <div className="mb-4">
              <button onClick={() => setEditeur((e) => !e)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">✏️ Mes phrases de remotivation ({phrases.length}) {editeur ? "▾" : "▸"}</button>
              {editeur && <EditeurPhrases phrases={phrases} onEnregistrer={(p) => { setPhrases(p); void sauverMotivation(p); }} />}
            </div>
          )}

          {importOuvert && <ImportCSV cibleDefaut={cible} estAdmin={estAdmin} onImporter={importer} onBase={enregistrerBase} onFermer={() => setImportOuvert(false)} />}

          <div className="grid gap-4 lg:grid-cols-[1fr_minmax(320px,380px)]">
            {/* tableau interactif */}
            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="font-bold text-navy">{scriptCourant.icone} {scriptCourant.titre}</span>
                  <span>· {stCible.total} contact(s) · {stCible.appeles} appelé(s) · {stCible.rdv} RDV</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {base.length > 0 && <button onClick={chargerLaBase} className="rounded-lg border border-copper/40 bg-copper/10 px-3 py-1.5 text-sm font-bold text-copper transition hover:bg-copper/20" title="Ajoute les contacts de la base partagée de l'agence à ton tableau (sans doublon)">🗂️ Charger la base partagée ({base.length})</button>}
                  <button onClick={() => setImportOuvert((o) => !o)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50">📥 Importer Excel/CSV</button>
                  <button onClick={ajouter} className="rounded-lg bg-navy px-3 py-1.5 text-sm font-bold text-white transition hover:brightness-110">+ Ajouter un contact</button>
                </div>
              </div>
              {/* Recherche + filtre (centaines de contacts) */}
              {!chargement && lignes.length > 0 && (
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Rechercher (nom, téléphone, ville, email…)" className="min-w-[180px] flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-copper focus:outline-none" />
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600"><input type="checkbox" checked={aAppelerSeul} onChange={(e) => setAAppelerSeul(e.target.checked)} /> À appeler uniquement</label>
                  <span className="text-xs text-slate-400">{lignesFiltrees.length} / {lignes.length}</span>
                </div>
              )}
              {chargement ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">Chargement…</div>
              ) : lignes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">Aucun contact pour cette cible. {base.length > 0 ? "Cliquez sur « 🗂️ Charger la base partagée » ou « + Ajouter un contact »." : "Cliquez sur « + Ajouter un contact » ou importez un fichier Excel/CSV."}</div>
              ) : lignesFiltrees.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">Aucun contact ne correspond à « {q} ».</div>
              ) : (
                <>
                  <div className="space-y-2">
                    {visibles.map((l) => {
                      const infos = parseInfos(l.notes);
                      const sty = STYLE_STATUT[l.statut] ?? "bg-slate-100 text-slate-600";
                      return (
                        <div key={l.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                          {/* En-tête : nom + téléphone + appel */}
                          <div className="flex flex-wrap items-center gap-2">
                            <input value={l.contact} onChange={(e) => modifier(l.id, { contact: e.target.value })} placeholder="Nom" className="min-w-[140px] flex-1 rounded-md border border-transparent bg-transparent px-1 py-0.5 text-[15px] font-bold text-navy hover:border-slate-200 focus:border-copper focus:outline-none" />
                            <input value={l.tel} onChange={(e) => modifier(l.id, { tel: e.target.value })} placeholder="Téléphone" className="w-36 rounded-md border border-slate-200 px-2 py-1 text-sm focus:border-copper focus:outline-none" />
                            {l.tel && <a href={`tel:${l.tel.replace(/\s+/g, "")}`} title="Appeler" className="shrink-0 rounded-md bg-emerald-500 px-2.5 py-1.5 text-sm text-white transition hover:brightness-110">📞</a>}
                            <button onClick={() => supprimer(l.id)} title="Supprimer" className="shrink-0 rounded-md px-1.5 py-1 text-slate-300 transition hover:bg-red-50 hover:text-red-500">🗑</button>
                          </div>
                          {/* Infos contextuelles du bien (lecture) */}
                          {infos.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[12px] leading-snug">
                              {infos.map((it, i) => (
                                <span key={i}>{it.label && <span className="text-slate-400">{it.label} : </span>}<span className="font-medium text-slate-700">{it.value}</span></span>
                              ))}
                            </div>
                          )}
                          {/* Actions : pointage rapide + statut + dates */}
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <div className="flex gap-1">
                              {ACTIONS.map((a) => (
                                <button key={a.label} onClick={() => pointer(l.id, a)} title={`Pointer : ${a.label}`} className={`flex h-8 w-8 items-center justify-center rounded-md border text-base transition ${a.cls} ${l.statut === a.statut ? "ring-2 ring-copper ring-offset-1" : ""}`}>{a.icone}</button>
                              ))}
                            </div>
                            <select value={l.statut} onChange={(e) => modifier(l.id, { statut: e.target.value })} className={`rounded-md border-0 px-2 py-1 text-[11px] font-semibold ${sty}`}>
                              {STATUTS_PHONING.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <label className="flex items-center gap-1 text-[11px] text-slate-400">Appelé <input type="date" value={toInput(l.date)} onChange={(e) => modifier(l.id, { date: fromInput(e.target.value) })} className="rounded-md border border-slate-200 px-1.5 py-1 text-xs text-slate-600 focus:border-copper focus:outline-none" /></label>
                            <label className="flex items-center gap-1 text-[11px] text-slate-400">Rappel <input type="date" value={toInput(l.rappel)} onChange={(e) => modifier(l.id, { rappel: fromInput(e.target.value) })} className="rounded-md border border-slate-200 px-1.5 py-1 text-xs text-slate-600 focus:border-copper focus:outline-none" /></label>
                            <button onClick={() => setNoteOuverte((x) => (x === l.id ? null : l.id))} className="ml-auto rounded-md border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-500 transition hover:bg-slate-50">✎ Note</button>
                          </div>
                          {noteOuverte === l.id && (
                            <textarea value={l.notes} onChange={(e) => modifier(l.id, { notes: e.target.value })} rows={3} placeholder="Notes libres / infos du bien…" className="mt-2 w-full rounded-md border border-slate-200 p-2 text-xs leading-relaxed focus:border-copper focus:outline-none" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {lignesFiltrees.length > visibles.length && (
                    <button onClick={() => setLimite((n) => n + 40)} className="mt-3 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50">Afficher plus ({lignesFiltrees.length - visibles.length} restant(s))</button>
                  )}
                </>
              )}
              <p className="mt-2 text-[11px] text-slate-400">Enregistrement automatique. Pointe le résultat d'appel (❌ / 📵 / ✅…) : tout est consolidé dans la « Vue équipe » pour la direction.</p>
            </div>

            {/* script à côté */}
            <div className="lg:sticky lg:top-4 lg:self-start"><ScriptPanneau script={scriptCourant} /></div>
          </div>
        </>
      )}
    </div>
  );
}

function EditeurPhrases({ phrases, onEnregistrer }: { phrases: string[]; onEnregistrer: (p: string[]) => void }) {
  const [txt, setTxt] = useState(phrases.join("\n"));
  const [sauve, setSauve] = useState(false);
  useEffect(() => { setTxt(phrases.join("\n")); }, [phrases]);
  const enregistrer = () => {
    const lignes = txt.split("\n").map((s) => s.trim()).filter(Boolean);
    onEnregistrer(lignes); setSauve(true); window.setTimeout(() => setSauve(false), 2500);
  };
  return (
    <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-2 text-xs text-slate-500">Une phrase par ligne. Elles s'affichent à ton équipe toutes les {PALIER_REMOTIVATION} réponses négatives (non + non décroché), en tournant à chaque palier. Signées « Enzo ».</p>
      <textarea value={txt} onChange={(e) => setTxt(e.target.value)} rows={8} className="w-full rounded-lg border border-slate-200 p-3 text-sm leading-relaxed focus:border-copper focus:outline-none" placeholder="Chaque non te rapproche du prochain oui…" />
      <div className="mt-2 flex items-center gap-2">
        <button onClick={enregistrer} className="rounded-lg bg-navy px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110">Enregistrer</button>
        {sauve && <span className="text-xs font-semibold text-emerald-600">✓ Enregistré pour toute l'équipe</span>}
      </div>
    </div>
  );
}

function VueEquipe({ equipe, onFermer }: { equipe: Record<string, PhoningData>; onFermer: () => void }) {
  const rows = useMemo(() => {
    const ids = new Set(APPRENANTS.map((m) => m.id));
    for (const id of Object.keys(equipe)) ids.add(id);
    return [...ids].map((id) => {
      const membre = EQUIPE.find((m) => m.id === id);
      return { id, nom: membre?.nom ?? id, role: membre?.role ?? "", st: statsData(equipe[id] ?? {}) };
    }).sort((a, b) => b.st.appeles - a.st.appeles || b.st.total - a.st.total);
  }, [equipe]);

  const totaux = useMemo(() => rows.reduce((t, r) => ({
    total: t.total + r.st.total, appeles: t.appeles + r.st.appeles, rdv: t.rdv + r.st.rdv, mandats: t.mandats + r.st.mandats, rappels: t.rappels + r.st.rappels,
  }), { total: 0, appeles: 0, rdv: 0, mandats: 0, rappels: 0 }), [rows]);

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-lg font-bold text-navy">👔 Phoning — vue équipe</h3>
        <button onClick={onFermer} className="ml-auto rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">← Revenir à mon phoning</button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-500">
              <th className="px-4 py-2.5">Négociateur</th>
              <th className="px-3 py-2.5 text-center">Contacts</th>
              <th className="px-3 py-2.5 text-center">Appelés</th>
              <th className="px-3 py-2.5 text-center">RDV</th>
              <th className="px-3 py-2.5 text-center">Mandats/Ventes</th>
              <th className="px-3 py-2.5 text-center">Rappels</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                <td className="px-4 py-2.5"><div className="font-bold text-navy">{r.nom}</div>{r.role && <div className="text-[11px] text-slate-400">{r.role}</div>}</td>
                <td className="px-3 py-2.5 text-center text-slate-700">{r.st.total || <span className="text-slate-300">0</span>}</td>
                <td className="px-3 py-2.5 text-center font-bold text-copper">{r.st.appeles || <span className="text-slate-300">0</span>}</td>
                <td className="px-3 py-2.5 text-center text-emerald-700">{r.st.rdv || <span className="text-slate-300">0</span>}</td>
                <td className="px-3 py-2.5 text-center text-navy">{r.st.mandats || <span className="text-slate-300">0</span>}</td>
                <td className="px-3 py-2.5 text-center text-blue-700">{r.st.rappels || <span className="text-slate-300">0</span>}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold text-navy">
              <td className="px-4 py-2.5">TOTAL ÉQUIPE</td>
              <td className="px-3 py-2.5 text-center">{totaux.total}</td>
              <td className="px-3 py-2.5 text-center">{totaux.appeles}</td>
              <td className="px-3 py-2.5 text-center">{totaux.rdv}</td>
              <td className="px-3 py-2.5 text-center">{totaux.mandats}</td>
              <td className="px-3 py-2.5 text-center">{totaux.rappels}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-400">Consolidé en temps réel à partir des tableaux remplis par chaque négociateur (toutes cibles confondues).</p>
    </div>
  );
}
