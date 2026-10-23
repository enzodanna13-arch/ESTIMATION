import { garde } from "@/lib/syndic/guard";
import { repondreAssistant, type MsgAssistant } from "@/lib/syndic/assistantIa";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(request: Request) {
  const g = await garde(request);
  if ("erreur" in g) return g.erreur;
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ error: "Assistant indisponible (clé IA absente)." }, { status: 503 });

  let body: { messages?: { role?: string; content?: string; pieces?: { type?: string; data?: string; nom?: string }[] }[] };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  const bruts = Array.isArray(body.messages) ? body.messages : [];
  const MAX_PIECE = 10 * 1024 * 1024; // ~10 Mo (base64) par pièce
  // On garde les derniers échanges, chaque message plafonné. Pièces jointes
  // (PDF/image) acceptées sur les messages utilisateur.
  const messages: MsgAssistant[] = bruts
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .filter((m) => (m.content as string).trim() || (Array.isArray(m.pieces) && m.pieces.length > 0))
    .slice(-16)
    .map((m) => {
      const pieces = (m.role === "user" && Array.isArray(m.pieces))
        ? m.pieces
            .filter((p) => typeof p.data === "string" && p.data.length > 0 && p.data.length < MAX_PIECE)
            .slice(0, 4)
            .map((p) => ({ type: (p.type === "pdf" ? "pdf" : "image") as "pdf" | "image", data: p.data as string, nom: typeof p.nom === "string" ? p.nom : undefined }))
        : undefined;
      return { role: m.role as "user" | "assistant", content: (m.content as string).slice(0, 12000), ...(pieces && pieces.length ? { pieces } : {}) };
    });
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "Message vide" }, { status: 400 });
  }

  try {
    const reply = await repondreAssistant(messages);
    return Response.json({ reply });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Analyse impossible" }, { status: 500 });
  }
}
