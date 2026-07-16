import { computeFinalReport } from "@/lib/ai";
import { fetchDvfSales } from "@/lib/dvf";
import { computeFallbackEstimate } from "@/lib/fallback";
import { buildDvfReferences, medianeReferences } from "@/lib/references";
import { saveEstimationServer } from "@/lib/serverHistory";
import type { PropertyInput } from "@/lib/types";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

/**
 * Estimation en une seule phase, fondée exclusivement sur les ventes
 * réelles DVF (aucune annonce en ligne) : récupération des ventes autour
 * de l'adresse du bien, puis analyse des photos + rédaction du dossier.
 * Réponse en streaming NDJSON (statuts de progression + résultat).
 */
export async function POST(request: Request) {
  let body: PropertyInput;
  try {
    body = (await request.json()) as PropertyInput;
  } catch {
    return Response.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  if (!body.codePostal || !body.typeBien) {
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
        send({ type: "status", label: "Récupération des ventes réelles autour du bien (DVF)…" });
        const dvfSales = await fetchDvfSales(body.codePostal, body.typeBien, body.adresse, body.ville);
        const dvfSource = dvfSales.length > 0 ? "api" : "indisponible";

        let report = null;
        let engine: "ia" | "statistique" = "statistique";
        if (process.env.ANTHROPIC_API_KEY) {
          try {
            report = await computeFinalReport(body, dvfSales, (label: string) =>
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
        // Cohérence dossier : la base du calcul d'ajustements est TOUJOURS
        // la médiane des prix actés du tableau des comparables. Si l'IA a
        // utilisé une autre base (ex. médiane €/m² transposée à la surface),
        // l'écart devient une ligne d'ajustement explicite — la somme du
        // tableau reste exactement égale au cœur de fourchette.
        const medRefs = medianeReferences(report.references_dvf);
        if (medRefs > 0 && report.base_mediane !== medRefs) {
          const diff = report.base_mediane - medRefs;
          const ajustements = [...report.ajustements];
          if (ajustements.length > 0) {
            const i = ajustements.findIndex((a) => /transposition|surface/i.test(a.libelle));
            if (i >= 0) {
              ajustements[i] = { ...ajustements[i], montant: ajustements[i].montant + diff };
            } else if (Math.abs(diff) >= 1000) {
              ajustements.unshift({
                libelle: `Surface du bien (${body.surfaceHabitable ?? "?"} m²) vs références`,
                montant: diff,
              });
            } else {
              // écart d'arrondi : absorbé par la première ligne existante
              ajustements[0] = { ...ajustements[0], montant: ajustements[0].montant + diff };
            }
          }
          report = { ...report, base_mediane: medRefs, ajustements };
        }
        // Historique PARTAGÉ de l'équipe (Vercel Blob) : sauvegarde
        // automatique du dossier — un échec n'empêche jamais le résultat
        try {
          await saveEstimationServer({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            createdAt: Date.now(),
            client:
              [body.clientCivilite, body.clientPrenom, body.clientNom].filter(Boolean).join(" ") ||
              "Client non renseigné",
            bien: `${body.typeBien.charAt(0).toUpperCase()}${body.typeBien.slice(1)}${body.nbPieces ? ` ${body.nbPieces} p.` : ""}${body.surfaceHabitable ? ` · ${body.surfaceHabitable} m²` : ""}`,
            ville: `${body.codePostal} ${body.ville ?? ""}`.trim(),
            negociateur: body.negociateur ?? "",
            fourchetteBasse: report.fourchette_basse,
            fourchetteHaute: report.fourchette_haute,
            result: { report, dvfSales, dvfSource, engine },
            input: body,
          });
        } catch (err) {
          console.error("Sauvegarde de l'historique impossible :", err);
        }
        send({ type: "result", data: { phase: "rapport", report, dvfSales, dvfSource, engine } });
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
