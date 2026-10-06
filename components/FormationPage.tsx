"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { MODULES_FORMATION, NIVEAUX_FORMATION, minutesModule, type ModuleFormation, type NiveauFormation } from "@/lib/formations";
import { genererAttestationFormationPdf, nomFichierAttestation } from "@/lib/attestationFormationPdf";
import { chargerProgresNego, sauverProgresNego } from "@/lib/formationProgres";
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

// Un module est « terminé » quand toutes les leçons sont lues et le quiz passé.
function estTermine(m: ModuleFormation, p: Progres): boolean {
  const e = p[m.id];
  return !!e && (e.lecons?.length ?? 0) >= m.lecons.length && e.quiz !== undefined;
}
// « Validé » = terminé avec un quiz parfait (sert à l'attestation).
function estValide(m: ModuleFormation, p: Progres): boolean {
  const e = p[m.id];
  return !!e && (e.lecons?.length ?? 0) >= m.lecons.length && e.quiz === m.quiz.length;
}

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
    persister({ ...progres, [module.id]: { lecons: progres[module.id]?.lecons ?? [], quiz: score } });
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

  const avancement = (m: ModuleFormation) => {
    const p = progres[m.id];
    const lus = p?.lecons?.length ?? 0;
    const total = m.lecons.length + 1; // +1 pour le quiz
    const faits = lus + (p?.quiz !== undefined ? 1 : 0);
    return Math.round((faits / total) * 100);
  };

  // Statistiques globales
  const stats = useMemo(() => {
    let leconsLues = 0, quizReussis = 0, termines = 0, valides = 0, minutesValidees = 0;
    let avancementTotal = 0;
    for (const m of MODULES_FORMATION) {
      const e = progres[m.id];
      leconsLues += e?.lecons?.length ?? 0;
      if (e?.quiz === m.quiz.length) quizReussis += 1;
      if (estTermine(m, progres)) termines += 1;
      if (estValide(m, progres)) { valides += 1; minutesValidees += minutesModule(m); }
      avancementTotal += avancement(m);
    }
    return {
      leconsLues, quizReussis, termines, valides, minutesValidees,
      globalPct: Math.round(avancementTotal / MODULES_FORMATION.length),
      totalLecons: MODULES_FORMATION.reduce((s, m) => s + m.lecons.length, 0),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progres]);

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
    if (valides.length === 0) { alert("Validez au moins un module (toutes les leçons lues + quiz parfait) pour obtenir une attestation."); return; }
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
            [`${stats.quizReussis}`, "Quiz réussis (100 %)"],
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
