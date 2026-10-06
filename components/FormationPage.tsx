"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { MODULES_FORMATION, NIVEAUX_FORMATION, minutesModule, type ModuleFormation, type NiveauFormation } from "@/lib/formations";
import { genererAttestationFormationPdf, nomFichierAttestation } from "@/lib/attestationFormationPdf";
import { chargerProgresNego, sauverProgresNego, statsFormation, moduleValide, avancementModule } from "@/lib/formationProgres";
import { EQUIPE } from "@/lib/equipe";

const CLE_PROGRES = "formation:progres:v1";
const CLE_NEGO = "formation:nego:v1";

// Négociateurs qui suivent la formation (transaction + gestion).
const APPRENANTS = EQUIPE.filter((m) => m.sections.some((s) => s === "transaction" || s === "gestion"));

type Progres = Record<string, { lecons: number[]; quiz?: number }>;

const STYLE_NIVEAU: Record<NiveauFormation, string> = {
  "Débutant": "bg-emerald-100 text-emerald-700",
  "Confirmé": "bg-indigo-100 text-indigo-700",
  "Expert": "bg-rose-100 text-rose-700",
};

// Validation d'un module (leçons lues + quiz réussi au seuil) : on réutilise les
// helpers partagés pour rester cohérent avec le Suivi des négociateurs.
const estValide = (m: ModuleFormation, p: Progres) => moduleValide(m, p[m.id]);

// Clé de cache locale : propre à chaque négociateur (ou globale si aucun choisi).
const cleLocale = (negoId: string) => (negoId ? `${CLE_PROGRES}:${negoId}` : CLE_PROGRES);
function lireProgres(negoId: string): Progres {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(cleLocale(negoId)) ?? "{}") as Progres; } catch { return {}; }
}
function ecrireProgres(negoId: string, p: Progres) {
  try { localStorage.setItem(cleLocale(negoId), JSON.stringify(p)); } catch { /* stockage indisponible */ }
}

// Rendu « markdown léger » : "## " sous-titre, "- " puce, **gras** inline.
function inline(texte: string, k: string): ReactNode {
  const bouts = texte.split(/(\*\*[^*]+\*\*)/g);
  return bouts.map((b, i) =>
    b.startsWith("**") && b.endsWith("**")
      ? <strong key={`${k}-${i}`} className="font-semibold text-navy">{b.slice(2, -2)}</strong>
      : <span key={`${k}-${i}`}>{b}</span>,
  );
}
function Contenu({ lignes }: { lignes: string[] }) {
  const blocs: ReactNode[] = [];
  let puces: string[] = [];
  const viderPuces = (k: string) => {
    if (puces.length === 0) return;
    const items = [...puces];
    blocs.push(
      <ul key={`ul-${k}`} className="my-3 space-y-2">
        {items.map((p, i) => (
          <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-slate-700">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
            <span className="flex-1">{inline(p, `li-${k}-${i}`)}</span>
          </li>
        ))}
      </ul>,
    );
    puces = [];
  };
  lignes.forEach((l, i) => {
    if (l.startsWith("- ")) { puces.push(l.slice(2)); return; }
    viderPuces(`${i}`);
    if (l.startsWith("## ")) blocs.push(
      <h4 key={i} className="mt-6 mb-2.5 flex items-center gap-2 border-b border-copper/15 pb-1.5 text-[12.5px] font-bold uppercase tracking-wider text-copper first:mt-1">
        <span className="h-[15px] w-1 shrink-0 rounded-full bg-copper" />{l.slice(3)}
      </h4>,
    );
    else blocs.push(<p key={i} className="my-3 text-[15px] leading-7 text-slate-700">{inline(l, `p-${i}`)}</p>);
  });
  viderPuces("fin");
  return <div>{blocs}</div>;
}

// Quiz d'un module — façon « code de la route » : questions enchaînées, chrono
// par question (mode examen), ou correction immédiate (mode entraînement),
// puis fiche de résultats avec seuil de réussite.
const SECONDES_PAR_Q = 20;
const SEUIL = 0.8;
const lettre = (i: number) => String.fromCharCode(65 + i); // 0 -> A

function Quiz({ module, meilleur, onReussi }: { module: ModuleFormation; meilleur?: number; onReussi: (score: number) => void }) {
  const N = module.quiz.length;
  const seuilN = Math.ceil(N * SEUIL);
  const [etape, setEtape] = useState<"intro" | "run" | "fin">("intro");
  const [mode, setMode] = useState<"examen" | "entrainement">("examen");
  const [idx, setIdx] = useState(0);
  const [, forceRender] = useState(0);
  const [temps, setTemps] = useState(SECONDES_PAR_Q);
  const [choisi, setChoisi] = useState<number | null>(null);
  const repRef = useRef<(number | null)[]>([]);
  const garde = useRef(false);

  const q = module.quiz[idx];

  const demarrer = (m: "examen" | "entrainement") => {
    repRef.current = Array(N).fill(null);
    setMode(m); setIdx(0); setTemps(SECONDES_PAR_Q); setChoisi(null); garde.current = false; setEtape("run");
  };

  const terminer = () => {
    const score = module.quiz.reduce((n, qq, i) => n + (repRef.current[i] === qq.correct ? 1 : 0), 0);
    onReussi(score);
    setEtape("fin");
  };
  const avancer = () => {
    if (garde.current) return;
    garde.current = true;
    if (idx + 1 < N) { setChoisi(null); setIdx(idx + 1); } else terminer();
  };
  const repondre = (oi: number) => {
    if (choisi !== null) return;
    repRef.current[idx] = oi; setChoisi(oi); forceRender((v) => v + 1);
    if (mode === "examen") window.setTimeout(avancer, 420);
  };

  // Compte à rebours (examen uniquement) — relancé à chaque question.
  useEffect(() => {
    if (etape !== "run" || mode !== "examen") return;
    garde.current = false; setChoisi(null); setTemps(SECONDES_PAR_Q);
    const t = window.setInterval(() => {
      setTemps((s) => { if (s <= 1) { window.clearInterval(t); avancer(); return 0; } return s - 1; });
    }, 1000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etape, idx, mode]);
  useEffect(() => { if (mode === "entrainement") { garde.current = false; } }, [idx, mode]);

  // ---- Écran d'intro ----
  if (etape === "intro") {
    return (
      <div className="rounded-2xl border border-copper/30 bg-white p-6 text-center">
        <div className="text-lg font-bold text-navy">🚦 Examen du module</div>
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">Mets-toi en conditions : les questions s'enchaînent, chronométrées. À la fin, ta fiche de résultats et la correction.</p>
        <div className="mx-auto mt-4 grid max-w-md grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-slate-50 px-2 py-3"><div className="text-lg font-bold text-navy">{N}</div><div className="text-[11px] text-slate-500">questions</div></div>
          <div className="rounded-xl bg-slate-50 px-2 py-3"><div className="text-lg font-bold text-navy">{SECONDES_PAR_Q}s</div><div className="text-[11px] text-slate-500">par question</div></div>
          <div className="rounded-xl bg-slate-50 px-2 py-3"><div className="text-lg font-bold text-navy">{seuilN}/{N}</div><div className="text-[11px] text-slate-500">pour réussir</div></div>
        </div>
        {meilleur !== undefined && (
          <div className="mx-auto mt-3 inline-block rounded-full bg-copper/10 px-3 py-1 text-xs font-semibold text-copper">Meilleur score : {meilleur}/{N} ({Math.round((meilleur / N) * 100)}%)</div>
        )}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <button onClick={() => demarrer("examen")} className="rounded-xl bg-navy px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110">🚦 Démarrer l'examen (chronométré)</button>
          <button onClick={() => demarrer("entrainement")} className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50">📚 Mode entraînement</button>
        </div>
      </div>
    );
  }

  // ---- Écran de résultats ----
  if (etape === "fin") {
    const rep = repRef.current;
    const score = module.quiz.reduce((n, qq, i) => n + (rep[i] === qq.correct ? 1 : 0), 0);
    const pct = Math.round((score / N) * 100);
    const reussi = score >= seuilN;
    return (
      <div>
        <div className={`rounded-2xl p-5 text-center ${reussi ? "bg-emerald-50" : "bg-amber-50"}`}>
          <div className={`text-sm font-bold uppercase tracking-wide ${reussi ? "text-emerald-700" : "text-amber-700"}`}>{reussi ? "✅ Réussi" : "❌ À retravailler"}</div>
          <div className="mt-1 text-4xl font-black text-navy">{score}<span className="text-2xl text-slate-400">/{N}</span></div>
          <div className="text-sm font-semibold text-slate-500">{pct}% · seuil de réussite {seuilN}/{N}</div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button onClick={() => demarrer("examen")} className="rounded-xl bg-navy px-4 py-2 text-sm font-bold text-white transition hover:brightness-110">↻ Repasser l'examen</button>
            <button onClick={() => demarrer("entrainement")} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50">📚 Entraînement</button>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="text-sm font-bold text-navy">Correction</div>
          {module.quiz.map((qq, i) => {
            const r = rep[i];
            const bon = r === qq.correct;
            return (
              <div key={i} className={`rounded-xl border p-3 ${bon ? "border-emerald-200 bg-emerald-50/50" : "border-red-200 bg-red-50/50"}`}>
                <div className="flex items-start gap-2 text-sm font-semibold text-navy">
                  <span>{bon ? "✅" : "❌"}</span><span>{i + 1}. {qq.question}</span>
                </div>
                <div className="mt-1 pl-6 text-xs text-slate-600">
                  <div>Bonne réponse : <strong className="text-emerald-700">{lettre(qq.correct)}. {qq.options[qq.correct]}</strong></div>
                  {!bon && <div>Ta réponse : {r === null ? <em className="text-amber-600">⏱️ pas de réponse</em> : <span className="text-red-600">{lettre(r)}. {qq.options[r]}</span>}</div>}
                  <div className="mt-0.5 text-slate-500">{qq.explication}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ---- Écran question (run) ----
  const repondu = choisi !== null;
  const minuteur = Math.round((temps / SECONDES_PAR_Q) * 100);
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-navy">Question {idx + 1} <span className="text-slate-400">/ {N}</span></span>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${mode === "examen" ? "bg-navy text-white" : "bg-slate-100 text-slate-500"}`}>{mode === "examen" ? "🚦 Examen" : "📚 Entraînement"}</span>
      </div>
      {/* barre de progression des questions */}
      <div className="mb-3 flex gap-1">
        {module.quiz.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < idx ? "bg-copper" : i === idx ? "bg-copper/50" : "bg-slate-200"}`} />
        ))}
      </div>
      {/* chrono (examen) */}
      {mode === "examen" && (
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">Temps restant</span>
            <span className={temps <= 5 ? "text-red-600" : "text-navy"}>{temps}s</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className={`h-full rounded-full transition-all duration-1000 ease-linear ${temps <= 5 ? "bg-red-500" : "bg-copper"}`} style={{ width: `${minuteur}%` }} />
          </div>
        </div>
      )}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-3 text-base font-bold text-navy">{q.question}</div>
        <div className="space-y-2">
          {q.options.map((o, oi) => {
            const estChoisi = choisi === oi;
            const montreCorrection = mode === "entrainement" && repondu;
            const bon = montreCorrection && oi === q.correct;
            const faux = montreCorrection && estChoisi && oi !== q.correct;
            const selExamen = mode === "examen" && estChoisi;
            return (
              <button
                key={oi}
                disabled={repondu}
                onClick={() => repondre(oi)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                  bon ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                  : faux ? "border-red-300 bg-red-50 text-red-700"
                  : selExamen ? "border-copper bg-copper/10 text-navy"
                  : "border-slate-200 hover:border-copper/40 hover:bg-slate-50 disabled:opacity-60"}`}
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${bon ? "border-emerald-500 bg-emerald-500 text-white" : faux ? "border-red-400 bg-red-400 text-white" : selExamen ? "border-copper bg-copper text-white" : "border-slate-300 text-slate-500"}`}>{bon ? "✓" : faux ? "✕" : lettre(oi)}</span>
                <span className="flex-1">{o}</span>
              </button>
            );
          })}
        </div>
        {mode === "entrainement" && repondu && (
          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            <strong className={choisi === q.correct ? "text-emerald-700" : "text-red-600"}>{choisi === q.correct ? "Bonne réponse. " : "Mauvaise réponse. "}</strong>
            {q.explication}
            <div className="mt-2 text-right">
              <button onClick={avancer} className="rounded-lg bg-navy px-4 py-1.5 text-xs font-bold text-white transition hover:brightness-110">{idx + 1 < N ? "Question suivante →" : "Voir mes résultats →"}</button>
            </div>
          </div>
        )}
      </div>
      {mode === "examen" && <p className="mt-2 text-center text-[11px] text-slate-400">Sélectionne une réponse — la question suivante s'enchaîne automatiquement. Pas de retour en arrière.</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// « Vidéo » du module : diaporama auto-généré depuis le texte, lu à voix haute
// par la synthèse vocale du navigateur (voix française). Reprend tous les
// points du module (une diapo par section « ## » de chaque leçon).
// ---------------------------------------------------------------------------
type Diapo = { chapitre: string; titre: string; points: string[] };

function construireDiapos(m: ModuleFormation): Diapo[] {
  const slides: Diapo[] = [];
  slides.push({ chapitre: "Introduction", titre: m.titre, points: m.resume ? [m.resume] : ["Synthèse complète du module."] });
  m.lecons.forEach((lec, li) => {
    const chap = `Leçon ${li + 1} · ${lec.titre}`;
    let cur: Diapo | null = null;
    const flush = () => { if (cur && cur.points.length) slides.push(cur); cur = null; };
    for (const l of lec.contenu) {
      if (l.startsWith("## ")) { flush(); cur = { chapitre: chap, titre: l.slice(3), points: [] }; }
      else {
        if (!cur) cur = { chapitre: chap, titre: lec.titre, points: [] };
        cur.points.push(l.startsWith("- ") ? l.slice(2) : l);
      }
    }
    flush();
  });
  slides.push({ chapitre: "Conclusion", titre: "À vous de jouer", points: ["Vous avez parcouru tous les points du module.", "Passez à l'examen pour valider vos acquis, puis à l'action sur le terrain."] });
  return slides;
}

// Nettoie un texte pour une lecture vocale naturelle.
const pourVoix = (s: string) => s
  .replace(/\*\*/g, "")
  .replace(/€/g, " euros")
  .replace(/%/g, " pour cent")
  .replace(/m²/g, " mètres carrés")
  .replace(/n°/gi, "numéro ")
  .replace(/[–—]/g, ", ")
  .replace(/\s+/g, " ")
  .trim();

function DiaporamaModule({ module }: { module: ModuleFormation }) {
  const slides = useMemo(() => construireDiapos(module), [module]);
  const [ouvert, setOuvert] = useState(false);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muet, setMuet] = useState(false);
  const [vitesse, setVitesse] = useState(1);
  const supporte = typeof window !== "undefined" && "speechSynthesis" in window;
  const voixRef = useRef<SpeechSynthesisVoice | null>(null);
  const idxRef = useRef(0); idxRef.current = idx;
  const playRef = useRef(false); playRef.current = playing;

  useEffect(() => {
    if (!supporte) return;
    const charger = () => { const vs = window.speechSynthesis.getVoices(); voixRef.current = vs.find((v) => /fr/i.test(v.lang)) || vs[0] || null; };
    charger();
    window.speechSynthesis.onvoiceschanged = charger;
    return () => { try { window.speechSynthesis.onvoiceschanged = null; } catch { /* ignore */ } };
  }, [supporte]);

  const avancer = () => { if (idxRef.current + 1 < slides.length) setIdx((i) => i + 1); else setPlaying(false); };

  // Lecture de la diapo courante tant qu'on « joue ».
  useEffect(() => {
    if (!ouvert || !playing) return;
    const slide = slides[idx];
    const texte = pourVoix([slide.titre, ...slide.points].join(". "));
    if (muet || !supporte) {
      const mots = texte.split(/\s+/).length;
      const dur = Math.max(3500, Math.min(16000, mots * 360));
      const t = window.setTimeout(() => { if (playRef.current) avancer(); }, dur);
      return () => window.clearTimeout(t);
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const phrases = texte.split(/(?<=[.!?])\s+/).filter((p) => p.trim().length > 0);
    let annule = false;
    const dire = (k: number) => {
      if (annule || !playRef.current) return;
      if (k >= phrases.length) { avancer(); return; }
      const u = new SpeechSynthesisUtterance(phrases[k]);
      if (voixRef.current) u.voice = voixRef.current;
      u.lang = "fr-FR"; u.rate = vitesse;
      u.onend = () => dire(k + 1);
      u.onerror = () => dire(k + 1);
      synth.speak(u);
    };
    dire(0);
    return () => { annule = true; try { synth.cancel(); } catch { /* ignore */ } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ouvert, playing, idx, muet, vitesse, slides]);

  // Coupe la voix quand on ferme / démonte.
  useEffect(() => { if (!ouvert && supporte) { try { window.speechSynthesis.cancel(); } catch { /* ignore */ } } }, [ouvert, supporte]);
  useEffect(() => () => { if (supporte) { try { window.speechSynthesis.cancel(); } catch { /* ignore */ } } }, [supporte]);

  if (!ouvert) {
    return (
      <button
        onClick={() => { setIdx(0); setOuvert(true); setPlaying(true); }}
        className="mb-5 flex w-full items-center gap-4 rounded-2xl border border-navy/15 bg-gradient-to-br from-navy to-navy/90 p-4 text-left text-white shadow-sm transition hover:brightness-110"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-copper text-xl">▶</span>
        <span>
          <span className="block text-sm font-bold">🎬 Regarder la synthèse vidéo du module</span>
          <span className="block text-xs text-white/70">{slides.length} séquences · synthèse audio commentée (voix de synthèse)</span>
        </span>
      </button>
    );
  }

  const slide = slides[idx];
  const pct = Math.round(((idx + 1) / slides.length) * 100);
  return (
    <div className="mb-5 overflow-hidden rounded-2xl border border-navy/15 bg-white shadow-sm">
      {/* écran vidéo */}
      <div className="relative bg-gradient-to-br from-navy to-navy/90 p-6 text-white">
        <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-copper">
          <span>🎬 {slide.chapitre}</span>
          <span className="text-white/60">{idx + 1} / {slides.length}</span>
        </div>
        <h3 className="text-xl font-bold leading-snug">{slide.titre}</h3>
        <ul className="mt-3 space-y-2">
          {slide.points.slice(0, 7).map((p, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-white/90">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
              <span>{inline(p, `d-${idx}-${i}`)}</span>
            </li>
          ))}
        </ul>
        {playing && supporte && !muet && <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-white/60"><span className="h-2 w-2 animate-pulse rounded-full bg-copper" /> Lecture en cours…</div>}
      </div>
      {/* barre de progression */}
      <div className="h-1 bg-slate-200"><div className="h-full bg-copper transition-all" style={{ width: `${pct}%` }} /></div>
      {/* commandes */}
      <div className="flex flex-wrap items-center gap-2 p-3">
        <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40">⏮</button>
        <button onClick={() => setPlaying((p) => !p)} className="rounded-lg bg-navy px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110">{playing ? "⏸ Pause" : "▶ Lire"}</button>
        <button onClick={avancer} disabled={idx + 1 >= slides.length} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40">⏭</button>
        {supporte && (
          <button onClick={() => setMuet((m) => !m)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50" title={muet ? "Activer la voix" : "Couper la voix"}>{muet ? "🔇" : "🔊"}</button>
        )}
        {supporte && !muet && (
          <select value={vitesse} onChange={(e) => setVitesse(Number(e.target.value))} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-semibold text-slate-600" title="Vitesse de lecture">
            <option value={0.85}>0.85×</option><option value={1}>1×</option><option value={1.15}>1.15×</option><option value={1.3}>1.3×</option>
          </select>
        )}
        <button onClick={() => { setPlaying(false); setOuvert(false); }} className="ml-auto rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-50">✕ Fermer</button>
      </div>
      {!supporte && <p className="px-3 pb-3 text-[11px] text-amber-600">Lecture vocale non disponible sur ce navigateur : le diaporama défile automatiquement, sans voix.</p>}
    </div>
  );
}

function VueModule({ module, progres, persister, onRetour }: {
  module: ModuleFormation; progres: Progres; persister: (p: Progres) => void; onRetour: () => void;
}) {
  const lus = progres[module.id]?.lecons ?? [];
  const basculerLu = (i: number) => {
    const set = new Set(lus);
    if (set.has(i)) set.delete(i); else set.add(i);
    persister({ ...progres, [module.id]: { ...progres[module.id], lecons: [...set] } });
  };
  const noterQuiz = (score: number) => {
    const prev = progres[module.id]?.quiz;
    const best = prev === undefined ? score : Math.max(prev, score); // on garde le meilleur score
    persister({ ...progres, [module.id]: { lecons: progres[module.id]?.lecons ?? [], quiz: best } });
  };
  return (
    <div>
      <button onClick={onRetour} className="mb-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Tous les modules</button>
      <div className="mb-5 flex items-start gap-3">
        <span className="text-4xl">{module.icone}</span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold text-navy">{module.titre}</h2>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STYLE_NIVEAU[module.niveau]}`}>{module.niveau}</span>
          </div>
          <p className="text-sm text-slate-500">{module.resume}</p>
        </div>
      </div>

      <DiaporamaModule module={module} />

      <div className="space-y-4">
        {module.lecons.map((lec, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-1 flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-navy">{i + 1}. {lec.titre}</h3>
              <button
                onClick={() => basculerLu(i)}
                className={`shrink-0 rounded-lg px-3 py-1 text-xs font-semibold transition ${lus.includes(i) ? "bg-emerald-100 text-emerald-700" : "border border-slate-300 text-slate-500 hover:bg-slate-50"}`}
              >
                {lus.includes(i) ? "✓ Lu" : "Marquer comme lu"}
              </button>
            </div>
            <Contenu lignes={lec.contenu} />
          </div>
        ))}

        <div className="rounded-2xl border border-copper/30 bg-copper/5 p-5">
          <h3 className="mb-3 text-base font-bold text-navy">🧠 Quiz — {module.titre}</h3>
          <Quiz module={module} meilleur={progres[module.id]?.quiz} onReussi={noterQuiz} />
        </div>
      </div>
    </div>
  );
}

export default function FormationPage({ onRetour }: { onRetour: () => void }) {
  const [negoId, setNegoId] = useState<string>(() => { try { return localStorage.getItem(CLE_NEGO) ?? ""; } catch { return ""; } });
  const [progres, setProgres] = useState<Progres>(() => { try { return lireProgres(localStorage.getItem(CLE_NEGO) ?? ""); } catch { return {}; } });
  const [ouvert, setOuvert] = useState<ModuleFormation | null>(null);
  const [filtre, setFiltre] = useState<"" | "Commercial" | "Transaction" | "Juridique">("");
  const [niveau, setNiveau] = useState<"" | NiveauFormation>("");
  const [genAttest, setGenAttest] = useState(false);
  const [sync, setSync] = useState<"" | "charge" | "ok">("");

  // Enregistre la progression : cache local immédiat + serveur si un négociateur est choisi.
  const persister = (p: Progres) => {
    setProgres(p);
    ecrireProgres(negoId, p);
    if (negoId) { setSync("ok"); void sauverProgresNego(negoId, p); }
  };

  // Changement de négociateur : charge SA progression (le serveur fait foi).
  useEffect(() => {
    try { if (negoId) localStorage.setItem(CLE_NEGO, negoId); else localStorage.removeItem(CLE_NEGO); } catch { /* ignore */ }
    if (!negoId) { setProgres(lireProgres("")); setSync(""); return; }
    setProgres(lireProgres(negoId)); // cache local instantané
    let annule = false;
    setSync("charge");
    void (async () => {
      const serveur = await chargerProgresNego(negoId);
      if (annule) return;
      const local = lireProgres(negoId);
      const vide = (o: Progres) => Object.keys(o).length === 0;
      if (vide(serveur) && !vide(local)) { setProgres(local); void sauverProgresNego(negoId, local); }
      else { setProgres(serveur); ecrireProgres(negoId, serveur); }
      setSync("ok");
    })();
    return () => { annule = true; };
  }, [negoId]);

  const avancement = (m: ModuleFormation) => avancementModule(m, progres[m.id]);

  // Statistiques globales (helper partagé avec le Suivi des négociateurs)
  const stats = useMemo(() => statsFormation(progres), [progres]);

  const heuresValidees = Math.floor(stats.minutesValidees / 60);
  const minValidees = stats.minutesValidees % 60;

  // Prochain module à reprendre : premier entamé mais non terminé, sinon premier non commencé.
  const reprendre = useMemo(() => {
    const entame = MODULES_FORMATION.find((m) => { const p = avancement(m); return p > 0 && p < 100; });
    return entame ?? MODULES_FORMATION.find((m) => avancement(m) === 0) ?? null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progres]);

  const telechargerAttestation = async () => {
    const valides = MODULES_FORMATION.filter((m) => estValide(m, progres));
    if (valides.length === 0) { alert("Validez au moins un module (toutes les leçons lues + examen réussi à 80 %) pour obtenir une attestation."); return; }
    const nom = (window.prompt("Nom du titulaire de l'attestation :", "") ?? "").trim();
    if (!nom) return;
    setGenAttest(true);
    try {
      const bytes = await genererAttestationFormationPdf({
        apprenant: nom,
        modules: valides.map((m) => ({ titre: m.titre, categorie: m.categorie, minutes: minutesModule(m) })),
      });
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = nomFichierAttestation(nom); a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Génération de l'attestation impossible.");
    } finally {
      setGenAttest(false);
    }
  };

  if (ouvert) {
    return <VueModule module={ouvert} progres={progres} persister={persister} onRetour={() => setOuvert(null)} />;
  }

  const modules = MODULES_FORMATION.filter((m) => (!filtre || m.categorie === filtre) && (!niveau || m.niveau === niveau));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Accueil</button>
        <h2 className="text-2xl font-bold text-navy">🎓 Centre de formation</h2>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Je suis</label>
          <select
            value={negoId}
            onChange={(e) => setNegoId(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-navy shadow-sm focus:border-copper focus:outline-none"
          >
            <option value="">— Sélectionner —</option>
            {APPRENANTS.map((m) => (<option key={m.id} value={m.id}>{m.nom}</option>))}
          </select>
          {negoId && <span className="text-[11px] font-semibold text-emerald-600">{sync === "charge" ? "Synchronisation…" : "✓ Suivi enregistré"}</span>}
        </div>
      </div>

      {!negoId && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Sélectionnez votre nom (en haut à droite) pour que <strong>votre progression soit enregistrée et visible par la direction</strong> dans « Suivi des négociateurs ». Sans sélection, elle reste uniquement sur cet appareil.
        </div>
      )}

      <p className="mb-4 text-sm text-slate-500">Montez en compétence sur le métier : techniques commerciales de haut niveau et cadre légal (loi ALUR, Tracfin, compromis, fiscalité…). Chaque module se termine par un quiz. {negoId ? "Votre progression est enregistrée et synchronisée pour le suivi d'équipe." : "Votre progression est enregistrée sur cet appareil."}</p>

      {/* Tableau de bord de progression */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-navy to-navy/90 p-5 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-white/70">Progression globale</div>
            <div className="mt-1 flex items-center gap-3">
              <div className="h-3 w-40 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-copper" style={{ width: `${stats.globalPct}%` }} /></div>
              <span className="text-xl font-bold">{stats.globalPct}%</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {reprendre && (
              <button onClick={() => setOuvert(reprendre)} className="rounded-xl bg-copper px-4 py-2 text-sm font-bold text-white transition hover:brightness-110">
                ▶ Reprendre : {reprendre.titre.length > 24 ? reprendre.titre.slice(0, 23) + "…" : reprendre.titre}
              </button>
            )}
            <button onClick={telechargerAttestation} disabled={genAttest || stats.valides === 0} className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20 disabled:opacity-40">
              {genAttest ? "Génération…" : "📜 Attestation de formation"}
            </button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {([
            [`${stats.valides}/${MODULES_FORMATION.length}`, "Modules validés"],
            [`${stats.leconsLues}/${stats.totalLecons}`, "Leçons lues"],
            [`${stats.quizReussis}`, "Examens réussis (≥ 80 %)"],
            [heuresValidees > 0 ? `${heuresValidees} h${minValidees > 0 ? ` ${String(minValidees).padStart(2, "0")}` : ""}` : `${minValidees} min`, "Heures validées"],
          ] as const).map(([val, lbl]) => (
            <div key={lbl} className="rounded-xl bg-white/10 px-3 py-2">
              <div className="text-lg font-bold">{val}</div>
              <div className="text-[11px] text-white/70">{lbl}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-white/60">Obligation ALUR : 14 h de formation continue par an (42 h sur 3 ans). L'attestation récapitule vos modules validés.</div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-semibold">
          {([["", "Tout"], ["Commercial", "Commercial"], ["Transaction", "Transaction"], ["Juridique", "Juridique"]] as const).map(([val, lbl]) => (
            <button key={val} onClick={() => setFiltre(val)} className={`rounded-md px-3 py-1 transition ${filtre === val ? "bg-copper text-white" : "text-slate-600 hover:bg-slate-100"}`}>{lbl}</button>
          ))}
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-semibold">
          <button onClick={() => setNiveau("")} className={`rounded-md px-3 py-1 transition ${niveau === "" ? "bg-navy text-white" : "text-slate-600 hover:bg-slate-100"}`}>Tous niveaux</button>
          {NIVEAUX_FORMATION.map((n) => (
            <button key={n} onClick={() => setNiveau(n)} className={`rounded-md px-3 py-1 transition ${niveau === n ? "bg-navy text-white" : "text-slate-600 hover:bg-slate-100"}`}>{n}</button>
          ))}
        </div>
        <span className="text-xs text-slate-400">{modules.length} module(s)</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => {
          const pct = avancement(m);
          const valide = estValide(m, progres);
          return (
            <button
              key={m.id}
              onClick={() => setOuvert(m)}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-copper hover:shadow-md"
            >
              <div className="mb-2 flex items-center justify-between gap-1">
                <span className="text-3xl">{m.icone}</span>
                <div className="flex flex-wrap items-center justify-end gap-1">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STYLE_NIVEAU[m.niveau]}`}>{m.niveau}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${m.categorie === "Juridique" ? "bg-violet-100 text-violet-700" : m.categorie === "Transaction" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{m.categorie}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-base font-bold text-navy">{m.titre}{valide && <span title="Module validé">🏅</span>}</div>
              <p className="mt-0.5 text-xs text-slate-500">{m.resume}</p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                <span>📚 {m.lecons.length} leçons</span><span>·</span><span>⏱️ {m.duree}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${pct === 100 ? "bg-emerald-500" : "bg-copper"}`} style={{ width: `${pct}%` }} /></div>
                <span className="text-[11px] font-semibold text-slate-500">{pct === 100 ? "✓" : `${pct}%`}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
