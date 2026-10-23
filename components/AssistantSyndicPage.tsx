"use client";

import { useEffect, useRef, useState } from "react";
import { assistantApi } from "@/lib/syndic/client";
import { compresserPhoto } from "@/lib/sinistres";
import { compresserDocument } from "@/lib/compressDoc";

interface Piece { type: "pdf" | "image"; data: string; nom?: string }
interface Msg { role: "user" | "assistant"; content: string; pieces?: Piece[] }

const estImage = (f: File) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|heic|heif)$/i.test(f.name);
const estPdf = (f: File) => f.type === "application/pdf" || /\.pdf$/i.test(f.name);
function u8ToB64(u8: Uint8Array): string { let s = ""; const CH = 0x8000; for (let i = 0; i < u8.length; i += CH) s += String.fromCharCode(...u8.subarray(i, i + CH)); return btoa(s); }

async function fichierVersPiece(f: File): Promise<Piece> {
  if (estImage(f)) return { type: "image", data: await compresserPhoto(f), nom: f.name };
  const buf = await f.arrayBuffer();
  if (!buf || buf.byteLength === 0) throw new Error(`« ${f.name} » est vide ou pas encore téléchargé.`);
  if (buf.byteLength <= 3_600_000) return { type: "pdf", data: u8ToB64(new Uint8Array(buf)), nom: f.name };
  const piece = await compresserDocument(f, 2800);
  return { type: "pdf", data: piece.data, nom: f.name };
}

const ACCUEIL =
  "Bonjour 👋 Je suis votre assistant de gestion de copropriété. Collez ici l'email ou le message reçu (copropriétaire, conseil syndical, notaire, prestataire…) et joignez les documents utiles avec le 📎 (appel de fonds, PV d'AG, décompte de charges, contrat…). Je vous aide à répondre, j'indique les informations manquantes et je vous propose un brouillon de réponse. Je peux aussi expliquer des notions (appels de fonds, répartition des charges, majorités en AG, impayés, sinistres, mutations…).";

const SUGGESTIONS = [
  "Explique-moi le fonctionnement d'un appel de fonds pour un copropriétaire qui ne comprend pas.",
  "Un copropriétaire conteste sa quote-part de charges : que lui répondre et quels documents vérifier ?",
  "Quelles sont les majorités en assemblée générale (articles 24, 25, 26) ?",
  "Rédige une relance pour un appel de fonds impayé.",
];

export default function AssistantSyndicPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [prepare, setPrepare] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [copie, setCopie] = useState(-1);
  const finRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { finRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);

  const joindre = async (liste: FileList | null) => {
    if (!liste) return;
    const valides = Array.from(liste).filter((f) => estImage(f) || estPdf(f));
    if (valides.length === 0) return;
    setPrepare(true); setErr(null);
    try { for (const f of valides) { const p = await fichierVersPiece(f); setPieces((prev) => [...prev, p]); } }
    catch (e) { setErr(e instanceof Error ? e.message : "Pièce jointe impossible"); }
    setPrepare(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const envoyer = async (texte?: string) => {
    const contenu = (texte ?? input).trim();
    if ((!contenu && pieces.length === 0) || busy || prepare) return;
    const msgUser: Msg = { role: "user", content: contenu, ...(pieces.length ? { pieces } : {}) };
    const suite: Msg[] = [...messages, msgUser];
    setMessages(suite); setInput(""); setPieces([]); setErr(null); setBusy(true);
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
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-copper px-3.5 py-2.5 text-white">
                {m.pieces && m.pieces.length > 0 && (
                  <div className="mb-1.5 flex flex-wrap gap-1.5">
                    {m.pieces.map((p, k) => <span key={k} className="inline-flex items-center gap-1 rounded-lg bg-white/20 px-2 py-0.5 text-[11px] font-semibold">{p.type === "pdf" ? "📄" : "🖼️"} {p.nom ?? (p.type === "pdf" ? "document.pdf" : "image")}</span>)}
                  </div>
                )}
                {m.content && <div className="whitespace-pre-wrap text-[14px] leading-relaxed">{m.content}</div>}
              </div>
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

      {/* Pièces jointes en attente */}
      {(pieces.length > 0 || prepare) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {pieces.map((p, k) => (
            <span key={k} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600">
              {p.type === "pdf" ? "📄" : "🖼️"} <span className="max-w-[160px] truncate">{p.nom ?? "pièce"}</span>
              <button onClick={() => setPieces((prev) => prev.filter((_, j) => j !== k))} className="text-red-400 hover:text-red-600">✕</button>
            </span>
          ))}
          {prepare && <span className="text-[11px] text-slate-400">Préparation…</span>}
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*,application/pdf" multiple capture="environment" className="hidden" onChange={(e) => void joindre(e.target.files)} />
      <div className="mt-2 flex items-end gap-2">
        <button onClick={() => fileRef.current?.click()} disabled={busy} title="Joindre un PDF ou une photo (appel de fonds, PV d'AG, décompte…)" className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-lg transition hover:bg-slate-50 disabled:opacity-50">📎</button>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void envoyer(); } }}
          rows={2}
          placeholder="Collez l'email reçu, joignez l'appel de fonds (📎), ou posez votre question… (Entrée pour envoyer)"
          className="flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-copper focus:outline-none"
        />
        <button onClick={() => void envoyer()} disabled={busy || prepare || (!input.trim() && pieces.length === 0)} className="shrink-0 rounded-xl bg-navy px-5 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">Envoyer</button>
      </div>
      {messages.length > 0 && <button onClick={() => { setMessages([]); setErr(null); }} className="mt-1 self-start text-[11px] font-semibold text-slate-400 hover:text-copper">↺ Nouvelle conversation</button>}
    </div>
  );
}
