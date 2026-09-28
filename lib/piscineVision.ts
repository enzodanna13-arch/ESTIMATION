import Anthropic from "@anthropic-ai/sdk";

// Détection de PISCINE sur une orthophoto IGN (open data) par analyse visuelle.
// Légal : imagerie IGN + notre propre modèle (on n'analyse pas Street View).
// Renvoie true/false, ou null si indisponible (pas de clé, réseau, etc.).
export async function detecterPiscine(orthophotoUrl: string): Promise<boolean | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  try {
    const img = await fetch(orthophotoUrl, { signal: AbortSignal.timeout(12_000) });
    if (!img.ok) return null;
    const b64 = Buffer.from(await img.arrayBuffer()).toString("base64");
    const client = new Anthropic();
    const msg = await client.messages.create({
      model: process.env.PISCINE_MODEL ?? "claude-haiku-4-5-20251001",
      max_tokens: 60,
      system:
        "Tu analyses une vue aérienne (orthophoto) centrée sur une parcelle. Tu réponds STRICTEMENT en JSON {\"piscine\": true|false}. Mets true UNIQUEMENT si une piscine (bassin d'eau, souvent bleu/turquoise, forme rectangulaire, ovale ou libre) est clairement visible près du centre de l'image.",
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/jpeg", data: b64 } },
          { type: "text", text: "Y a-t-il une piscine sur cette parcelle ? Réponds en JSON {\"piscine\": true|false}." },
        ],
      }],
    });
    const txt = msg.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("");
    const m = txt.match(/true|false/i);
    return m ? /true/i.test(m[0]) : null;
  } catch {
    return null;
  }
}
