import { garde } from "@/lib/syndic/guard";
import { repondreAssistant, type MsgAssistant } from "@/lib/syndic/assistantIa";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(request: Request) {
  const g = await garde(request);
  if ("erreur" in g) return g.erreur;
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ error: "Assistant indisponible (clé IA absente)." }, { status: 503 });

  let body: { messages?: { role?: string; content?: string }[] };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  const bruts = Array.isArray(body.messages) ? body.messages : [];
  // On garde les derniers échanges, chaque message plafonné.
  const messages: MsgAssistant[] = bruts
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-20)
    .map((m) => ({ role: m.role as "user" | "assistant", content: (m.content as string).slice(0, 12000) }));
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
