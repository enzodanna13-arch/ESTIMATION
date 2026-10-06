"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { getHistoryKey } from "@/lib/history";
import { PROCESS_DEFAUT, type ProcessDef } from "@/lib/process";

type Overrides = Record<string, string[]>;

// --- rendu « markdown léger » : "## " titre, "- " puce, "> " vigilance, **gras** ---
function inline(texte: string, k: string): ReactNode {
  return texte.split(/(\*\*[^*]+\*\*)/g).map((b, i) =>
    b.startsWith("**") && b.endsWith("**")
      ? <strong key={`${k}-${i}`} className="font-semibold text-navy">{b.slice(2, -2)}</strong>
      : <span key={`${k}-${i}`}>{b}</span>,
  );
}
function Contenu({ lignes }: { lignes: string[] }) {
  const blocs: ReactNode[] = [];
  let puces: string[] = [];
  const viderPuces = (k: string) => {
    if (!puces.length) return;
    const items = [...puces];
    blocs.push(
      <ul key={`ul-${k}`} className="my-2 space-y-1.5">
        {items.map((p, i) => (
          <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-slate-700">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" /><span className="flex-1">{inline(p, `li-${k}-${i}`)}</span>
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
      <h4 key={i} className="mt-5 mb-2 flex items-center gap-2 border-b border-copper/15 pb-1.5 text-sm font-bold uppercase tracking-wider text-copper first:mt-1">
        <span className="h-4 w-1 shrink-0 rounded-full bg-copper" />{l.slice(3)}
      </h4>,
    );
    else if (l.startsWith("> ")) blocs.push(
      <div key={i} className="my-2 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[14px] text-amber-800"><span>⚠️</span><span className="flex-1">{inline(l.slice(2), `v-${i}`)}</span></div>,
    );
    else blocs.push(<p key={i} className="my-2 text-[15px] leading-relaxed text-slate-700">{inline(l, `p-${i}`)}</p>);
  });
  viderPuces("fin");
  return <div>{blocs}</div>;
}

export default function ProcessPage({ onRetour }: { onRetour: () => void }) {
  const [overrides, setOverrides] = useState<Overrides>({});
  const [ouvert, setOuvert] = useState<ProcessDef | null>(null);
  const [edition, setEdition] = useState(false);
  const [texte, setTexte] = useState("");
  const [sauve, setSauve] = useState<"" | "en" | "ok">("");

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/process", { cache: "no-store", headers: { "x-history-key": getHistoryKey() } });
        if (res.ok) setOverrides(((await res.json()) as { overrides?: Overrides }).overrides ?? {});
      } catch { /* ignore */ }
    })();
  }, []);

  const contenuDe = (p: ProcessDef) => (overrides[p.id]?.length ? overrides[p.id] : p.contenu);

  const ouvrir = (p: ProcessDef) => { setOuvert(p); setEdition(false); setSauve(""); };
  const lancerEdition = () => { if (!ouvert) return; setTexte(contenuDe(ouvert).join("\n")); setEdition(true); };
  const enregistrer = async () => {
    if (!ouvert) return;
    const contenu = texte.split("\n").map((s) => s.replace(/\s+$/, "")).filter((s, i, a) => s.trim() !== "" || (a[i - 1] && a[i - 1].trim() !== ""));
    setSauve("en");
    try {
      const res = await fetch("/api/process", { method: "PUT", headers: { "content-type": "application/json", "x-history-key": getHistoryKey() }, body: JSON.stringify({ id: ouvert.id, contenu }) });
      if (res.ok) { setOverrides(((await res.json()) as { overrides?: Overrides }).overrides ?? {}); setEdition(false); setSauve("ok"); }
      else setSauve("");
    } catch { setSauve(""); }
  };

  const liste = useMemo(() => PROCESS_DEFAUT, []);

  if (ouvert) {
    const perso = !!overrides[ouvert.id]?.length;
    return (
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button onClick={() => setOuvert(null)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Tous les process</button>
          {!edition && <button onClick={lancerEdition} className="ml-auto rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:brightness-110">✏️ Modifier</button>}
          {sauve === "ok" && !edition && <span className="text-xs font-semibold text-emerald-600">✓ Enregistré</span>}
        </div>

        <div className="mb-4 flex items-start gap-3">
          <span className="text-4xl">{ouvert.icone}</span>
          <div>
            <h2 className="text-2xl font-bold text-navy">{ouvert.titre}</h2>
            <p className="text-sm text-slate-500">{ouvert.resume}{perso && <span className="ml-2 rounded-full bg-copper/10 px-2 py-0.5 text-[11px] font-semibold text-copper">personnalisé</span>}</p>
          </div>
        </div>

        {edition ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-2 text-xs text-slate-500">Mise en forme : <strong>## Titre d'étape</strong> · <strong>- puce</strong> · <strong>&gt; point de vigilance</strong> · <strong>**gras**</strong>. Une ligne = un élément.</p>
            <textarea value={texte} onChange={(e) => setTexte(e.target.value)} rows={22} className="w-full rounded-lg border border-slate-200 p-3 font-mono text-[13px] leading-relaxed focus:border-copper focus:outline-none" />
            <div className="mt-2 flex items-center gap-2">
              <button onClick={enregistrer} disabled={sauve === "en"} className="rounded-lg bg-copper px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{sauve === "en" ? "Enregistrement…" : "Enregistrer"}</button>
              <button onClick={() => setEdition(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Annuler</button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Contenu lignes={contenuDe(ouvert)} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Accueil</button>
        <h2 className="text-2xl font-bold text-navy">⚙️ Process & procédures</h2>
      </div>
      <p className="mb-4 text-sm text-slate-500">Les procédures internes de l'agence, étape par étape. Cliquez pour consulter ; <strong>« Modifier »</strong> pour les personnaliser (enregistrées pour toute l'équipe).</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {liste.map((p) => (
          <button key={p.id} onClick={() => ouvrir(p)} className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-copper hover:shadow-md">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-3xl">{p.icone}</span>
              {overrides[p.id]?.length ? <span className="rounded-full bg-copper/10 px-2 py-0.5 text-[11px] font-bold text-copper">personnalisé</span> : null}
            </div>
            <div className="text-base font-bold text-navy">{p.titre}</div>
            <p className="mt-0.5 text-xs text-slate-500">{p.resume}</p>
            <div className="mt-3 text-[11px] font-semibold text-copper">Consulter →</div>
          </button>
        ))}
      </div>
    </div>
  );
}
