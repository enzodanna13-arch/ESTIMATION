"use client";

import { useEffect, useRef, useState } from "react";
import { assistantApi } from "@/lib/syndic/client";

interface Msg { role: "user" | "assistant"; content: string }

const ACCUEIL =
  "Bonjour 👋 Je suis votre assistant de gestion de copropriété. Collez ici l'email ou le message que vous avez reçu (copropriétaire, conseil syndical, notaire, prestataire…), quel que soit le sujet : je vous aide à y répondre, je vous indique les documents ou informations nécessaires, et je vous propose un brouillon de réponse. Je peux aussi expliquer des notions (appels de fonds, répartition des charges, majorités en AG, impayés, sinistres, mutations…).";

const SUGGESTIONS = [
  "Explique-moi le fonctionnement d'un appel de fonds pour un copropriétaire qui ne comprend pas.",
  "Un copropriétaire conteste sa quote-part de charges : que lui répondre et quels documents vérifier ?",
  "Quelles sont les majorités en assemblée générale (articles 24, 25, 26) ?",
  "Rédige une relance pour un appel de fonds impayé.",
];

export default function AssistantSyndicPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [copie, setCopie] = useState(-1);
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => { finRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);

  const envoyer = async (texte?: string) => {
    const contenu = (texte ?? input).trim();
    if (!contenu || busy) return;
    const suite: Msg[] = [...messages, { role: "user", content: contenu }];
    setMessages(suite); setInput(""); setErr(null); setBusy(true);
    try {
      const { reply } = await assistantApi(suite);
      setMessages((m) => [...m, { role: "assistant", content: reply || "(réponse vide)" }]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "L'assistant n'a pas pu répondre.");
    }
    setBusy(false);
  };

  const copier = async (i: number, t: string) => { try { await navigator.clipboard.writeText(t); setCopie(i); setTimeout(() => setCopie(-1), 2000); } catch { /* ignore */ } };

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-3xl flex-col">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-navy">🤖 Assistant gestionnaire</h2>
        <p className="text-sm text-slate-500">Spécialisé gestion de copropriété et comptabilité de syndic. Les réponses sont des brouillons à relire et adapter.</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4">
        {/* Accueil */}
        <div className="flex gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm">🤖</span>
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-100 px-3.5 py-2.5 text-[14px] leading-relaxed text-slate-700">{ACCUEIL}</div>
        </div>

        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 pl-10">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => void envoyer(s)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-left text-xs font-medium text-slate-600 transition hover:border-copper hover:text-navy">{s}</button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          m.role === "user" ? (
            <div key={i} className="flex justify-end gap-2">
              <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-copper px-3.5 py-2.5 text-[14px] leading-relaxed text-white">{m.content}</div>
            </div>
          ) : (
            <div key={i} className="flex gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm">🤖</span>
              <div className="group max-w-[85%]">
                <div className="whitespace-pre-wrap rounded-2xl rounded-tl-sm bg-slate-100 px-3.5 py-2.5 text-[14px] leading-relaxed text-slate-800">{m.content}</div>
                <button onClick={() => void copier(i, m.content)} className="mt-1 text-[11px] font-semibold text-slate-400 transition hover:text-copper">{copie === i ? "✓ Copié" : "📋 Copier"}</button>
              </div>
            </div>
          )
        ))}

        {busy && (
          <div className="flex gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm">🤖</span>
            <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-3.5 py-2.5 text-sm text-slate-400">L'assistant réfléchit…</div>
          </div>
        )}
        <div ref={finRef} />
      </div>

      {err && <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{err}</div>}

      <div className="mt-2 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void envoyer(); } }}
          rows={2}
          placeholder="Collez l'email reçu, ou posez votre question… (Entrée pour envoyer, Maj+Entrée pour un retour à la ligne)"
          className="flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-copper focus:outline-none"
        />
        <button onClick={() => void envoyer()} disabled={busy || !input.trim()} className="shrink-0 rounded-xl bg-navy px-5 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">Envoyer</button>
      </div>
      {messages.length > 0 && <button onClick={() => { setMessages([]); setErr(null); }} className="mt-1 self-start text-[11px] font-semibold text-slate-400 hover:text-copper">↺ Nouvelle conversation</button>}
    </div>
  );
}
