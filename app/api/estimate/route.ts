import { computeAiEstimate } from "@/lib/ai";
import { fetchDvfSales } from "@/lib/dvf";
import { computeFallbackEstimate } from "@/lib/fallback";
import type { EstimateResponse, PropertyInput } from "@/lib/types";

export const maxDuration = 300; // l'analyse IA (recherche web + photos) peut prendre plusieurs minutes
export const dynamic = "force-dynamic";

/**
 * Réponse en streaming NDJSON : la connexion reste active pendant toute
 * l'analyse (évite les 504 de la passerelle sur les requêtes longues) et le
 * client reçoit la progression réelle — puis le résultat final.
 */
export async function POST(request: Request) {
  let input: PropertyInput;
  try {
    input = (await request.json()) as PropertyInput;
  } catch {
    return Response.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  if (!input.codePostal || !input.typeBien) {
    return Response.json(
      { error: "Le code postal et le type de bien sont obligatoires" },
      { status: 400 },
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      const heartbeat = setInterval(() => send({ type: "ping" }), 8000);
      try {
        send({ type: "status", label: "Récupération des ventes réelles (DVF)…" });
        const dvfSales = await fetchDvfSales(input.codePostal, input.typeBien);
        const dvfSource = dvfSales.length > 0 ? "api" : "indisponible";

        let response: EstimateResponse | null = null;
        if (process.env.ANTHROPIC_API_KEY) {
          try {
            const report = await computeAiEstimate(input, dvfSales, (label) =>
              send({ type: "status", label }),
            );
            response = { report, dvfSales, dvfSource, engine: "ia" };
          } catch (err) {
            console.error("Échec du moteur IA, bascule sur le moteur statistique :", err);
            send({ type: "status", label: "Moteur IA indisponible — calcul statistique…" });
          }
        }
        if (!response) {
          const report = computeFallbackEstimate(input, dvfSales);
          response = { report, dvfSales, dvfSource, engine: "statistique" };
        }
        send({ type: "result", data: response });
      } catch (err) {
        send({ type: "error", error: err instanceof Error ? err.message : "Erreur inattendue" });
      } finally {
        clearInterval(heartbeat);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-cache, no-transform",
    },
  });
}
