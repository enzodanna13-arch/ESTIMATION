import { computeFinalReport, computeMarketStudy } from "@/lib/ai";
import { fetchDvfSales } from "@/lib/dvf";
import { computeFallbackEstimate } from "@/lib/fallback";
import { buildDvfReferences } from "@/lib/references";
import type { DvfSale, MarketStudy, PropertyInput } from "@/lib/types";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

interface EstimateRequest extends PropertyInput {
  phase?: "marche" | "rapport";
  marche?: MarketStudy | null;
  dvfSales?: DvfSale[];
}

/**
 * Analyse en 2 phases, orchestrées par le client, pour tenir dans le budget
 * d'exécution serverless (~5 min par requête) :
 *  - phase "marche"  : DVF + audit concurrentiel web (sans photos)
 *  - phase "rapport" : analyse des photos + rédaction du dossier final
 * Réponses en streaming NDJSON (statuts de progression + résultat).
 */
export async function POST(request: Request) {
  let body: EstimateRequest;
  try {
    body = (await request.json()) as EstimateRequest;
  } catch {
    return Response.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  if (!body.codePostal || !body.typeBien) {
    return Response.json(
      { error: "Le code postal et le type de bien sont obligatoires" },
      { status: 400 },
    );
  }

  const phase = body.phase === "rapport" ? "rapport" : "marche";
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      const heartbeat = setInterval(() => send({ type: "ping" }), 8000);
      try {
        if (phase === "marche") {
          send({ type: "status", label: "Récupération des ventes réelles (DVF)…" });
          const dvfSales = await fetchDvfSales(body.codePostal, body.typeBien);
          const dvfSource = dvfSales.length > 0 ? "api" : "indisponible";

          let marche: MarketStudy | null = null;
          if (process.env.ANTHROPIC_API_KEY) {
            try {
              marche = await computeMarketStudy(body, dvfSales, (label) => send({ type: "status", label }));
            } catch (err) {
              console.error("Échec de l'audit de marché IA :", err);
              send({ type: "status", label: "Audit web indisponible — poursuite avec les données DVF…" });
            }
          }
          send({ type: "result", data: { phase: "marche", marche, dvfSales, dvfSource } });
        } else {
          const dvfSales = body.dvfSales ?? (await fetchDvfSales(body.codePostal, body.typeBien));
          const dvfSource = dvfSales.length > 0 ? "api" : "indisponible";
          const marche = body.marche ?? null;

          let report = null;
          let engine: "ia" | "statistique" = "statistique";
          if (process.env.ANTHROPIC_API_KEY) {
            try {
              report = await computeFinalReport(body, dvfSales, marche, (label) =>
                send({ type: "status", label }),
              );
              engine = "ia";
            } catch (err) {
              console.error("Échec de la rédaction IA, bascule sur le moteur statistique :", err);
              send({ type: "status", label: "Rédaction IA indisponible — calcul statistique…" });
            }
          }
          if (!report) {
            report = computeFallbackEstimate(body, dvfSales);
            if (marche) {
              // L'audit de marché a réussi : on le conserve dans le dossier
              report = { ...report, ...marche };
              engine = "ia";
            }
          }
          // Filet de sécurité : le tableau des comparables DVF ne doit
          // jamais être vide dès que des ventes existent
          if (report.references_dvf.length === 0 && dvfSales.length > 0) {
            const det = buildDvfReferences(dvfSales, body);
            report = {
              ...report,
              references_dvf: det.references,
              base_mediane: report.base_mediane > 0 ? report.base_mediane : det.baseMediane,
            };
          }
          send({ type: "result", data: { phase: "rapport", report, dvfSales, dvfSource, engine } });
        }
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
