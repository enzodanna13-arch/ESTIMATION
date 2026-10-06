"use client";

import { useMemo, useState, type ReactNode } from "react";
import { MODULES_FORMATION, type ModuleFormation } from "@/lib/formations";

const CLE_PROGRES = "formation:progres:v1";

type Progres = Record<string, { lecons: number[]; quiz?: number }>;

function lireProgres(): Progres {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(CLE_PROGRES) ?? "{}") as Progres; } catch { return {}; }
}
function ecrireProgres(p: Progres) {
  try { localStorage.setItem(CLE_PROGRES, JSON.stringify(p)); } catch { /* stockage indisponible */ }
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
      <ul key={`ul-${k}`} className="my-2 ml-1 space-y-1">
        {items.map((p, i) => (
          <li key={i} className="flex gap-2 text-sm text-slate-700"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />{inline(p, `li-${k}-${i}`)}</li>
        ))}
      </ul>,
    );
    puces = [];
  };
  lignes.forEach((l, i) => {
    if (l.startsWith("- ")) { puces.push(l.slice(2)); return; }
    viderPuces(`${i}`);
    if (l.startsWith("## ")) blocs.push(<h4 key={i} className="mt-4 mb-1 text-sm font-bold uppercase tracking-wide text-copper">{l.slice(3)}</h4>);
    else blocs.push(<p key={i} className="my-2 text-sm leading-relaxed text-slate-700">{inline(l, `p-${i}`)}</p>);
  });
  viderPuces("fin");
  return <div>{blocs}</div>;
}

// Quiz d'un module.
function Quiz({ module, onReussi }: { module: ModuleFormation; onReussi: (score: number) => void }) {
  const [reponses, setReponses] = useState<Record<number, number>>({});
  const [valide, setValide] = useState(false);
  const score = module.quiz.reduce((n, q, i) => n + (reponses[i] === q.correct ? 1 : 0), 0);
  return (
    <div className="space-y-4">
      {module.quiz.map((q, qi) => (
        <div key={qi} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-2 text-sm font-bold text-navy">{qi + 1}. {q.question}</div>
          <div className="space-y-1.5">
            {q.options.map((o, oi) => {
              const choisi = reponses[qi] === oi;
              const bon = valide && oi === q.correct;
              const faux = valide && choisi && oi !== q.correct;
              return (
                <button
                  key={oi}
                  disabled={valide}
                  onClick={() => setReponses((r) => ({ ...r, [qi]: oi }))}
                  className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                    bon ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                    : faux ? "border-red-300 bg-red-50 text-red-700"
                    : choisi ? "border-copper bg-copper/10 text-navy"
                    : "border-slate-200 hover:bg-slate-50"}`}
                >
                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] ${choisi || bon ? "border-current" : "border-slate-300"}`}>{bon ? "✓" : faux ? "✕" : ""}</span>
                  {o}
                </button>
              );
            })}
          </div>
          {valide && <p className="mt-2 text-xs text-slate-500">{q.explication}</p>}
        </div>
      ))}
      {!valide ? (
        <button
          onClick={() => { setValide(true); onReussi(module.quiz.reduce((n, q, i) => n + (reponses[i] === q.correct ? 1 : 0), 0)); }}
          disabled={Object.keys(reponses).length < module.quiz.length}
          className="rounded-xl bg-navy px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50"
        >
          Valider le quiz
        </button>
      ) : (
        <div className={`rounded-xl p-3 text-sm font-bold ${score === module.quiz.length ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
          Score : {score}/{module.quiz.length}{score === module.quiz.length ? " — parfait ! 🎉" : " — relis les leçons et réessaie."}
          {score !== module.quiz.length && <button onClick={() => { setValide(false); setReponses({}); }} className="ml-3 rounded-lg border border-current px-2 py-0.5 text-xs">Recommencer</button>}
        </div>
      )}
    </div>
  );
}

function VueModule({ module, progres, setProgres, onRetour }: {
  module: ModuleFormation; progres: Progres; setProgres: (p: Progres) => void; onRetour: () => void;
}) {
  const lus = progres[module.id]?.lecons ?? [];
  const basculerLu = (i: number) => {
    const set = new Set(lus);
    if (set.has(i)) set.delete(i); else set.add(i);
    const p = { ...progres, [module.id]: { ...progres[module.id], lecons: [...set] } };
    setProgres(p); ecrireProgres(p);
  };
  const noterQuiz = (score: number) => {
    const p = { ...progres, [module.id]: { lecons: progres[module.id]?.lecons ?? [], quiz: score } };
    setProgres(p); ecrireProgres(p);
  };
  return (
    <div>
      <button onClick={onRetour} className="mb-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Tous les modules</button>
      <div className="mb-5 flex items-start gap-3">
        <span className="text-4xl">{module.icone}</span>
        <div>
          <h2 className="text-2xl font-bold text-navy">{module.titre}</h2>
          <p className="text-sm text-slate-500">{module.resume}</p>
        </div>
      </div>

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
          <Quiz module={module} onReussi={noterQuiz} />
        </div>
      </div>
    </div>
  );
}

export default function FormationPage({ onRetour }: { onRetour: () => void }) {
  const [progres, setProgres] = useState<Progres>(() => lireProgres());
  const [ouvert, setOuvert] = useState<ModuleFormation | null>(null);
  const [filtre, setFiltre] = useState<"" | "Commercial" | "Transaction" | "Juridique">("");

  const avancement = (m: ModuleFormation) => {
    const p = progres[m.id];
    const lus = p?.lecons?.length ?? 0;
    const total = m.lecons.length + 1; // +1 pour le quiz
    const faits = lus + (p?.quiz !== undefined ? 1 : 0);
    return Math.round((faits / total) * 100);
  };
  const globalPct = useMemo(() => {
    const t = MODULES_FORMATION.reduce((s, m) => s + avancement(m), 0);
    return Math.round(t / MODULES_FORMATION.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progres]);

  if (ouvert) {
    return <VueModule module={ouvert} progres={progres} setProgres={setProgres} onRetour={() => setOuvert(null)} />;
  }

  const modules = MODULES_FORMATION.filter((m) => !filtre || m.categorie === filtre);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Accueil</button>
        <h2 className="text-2xl font-bold text-navy">🎓 Formation</h2>
        <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
          <span>Progression globale</span>
          <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-copper" style={{ width: `${globalPct}%` }} /></div>
          <span className="font-bold text-navy">{globalPct}%</span>
        </div>
      </div>

      <p className="mb-4 text-sm text-slate-500">Montez en compétence sur le métier : techniques commerciales et cadre légal (loi ALUR, Tracfin, compromis…). Chaque module se termine par un quiz. Votre progression est enregistrée sur cet appareil.</p>

      <div className="mb-4 inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-semibold">
        {([["", "Tout"], ["Commercial", "Commercial"], ["Transaction", "Transaction"], ["Juridique", "Juridique"]] as const).map(([val, lbl]) => (
          <button key={val} onClick={() => setFiltre(val)} className={`rounded-md px-3 py-1 transition ${filtre === val ? "bg-copper text-white" : "text-slate-600 hover:bg-slate-100"}`}>{lbl}</button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => {
          const pct = avancement(m);
          return (
            <button
              key={m.id}
              onClick={() => setOuvert(m)}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-copper hover:shadow-md"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-3xl">{m.icone}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${m.categorie === "Juridique" ? "bg-violet-100 text-violet-700" : m.categorie === "Transaction" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{m.categorie}</span>
              </div>
              <div className="text-base font-bold text-navy">{m.titre}</div>
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
