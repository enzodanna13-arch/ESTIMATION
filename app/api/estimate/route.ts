import { NextResponse } from "next/server";
import { computeAiEstimate } from "@/lib/ai";
import { fetchDvfSales } from "@/lib/dvf";
import { computeFallbackEstimate } from "@/lib/fallback";
import type { EstimateResponse, PropertyInput } from "@/lib/types";

export const maxDuration = 300; // l'analyse IA (photos + marché) peut prendre plusieurs minutes
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let input: PropertyInput;
  try {
    input = (await request.json()) as PropertyInput;
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  if (!input.codePostal || !input.typeBien) {
    return NextResponse.json(
      { error: "Le code postal et le type de bien sont obligatoires" },
      { status: 400 },
    );
  }

  const dvfSales = await fetchDvfSales(input.codePostal, input.typeBien);
  const dvfSource = dvfSales.length > 0 ? "api" : "indisponible";

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const report = await computeAiEstimate(input, dvfSales);
      const response: EstimateResponse = { report, dvfSales, dvfSource, engine: "ia" };
      return NextResponse.json(response);
    } catch (err) {
      console.error("Échec du moteur IA, bascule sur le moteur statistique :", err);
    }
  }

  const report = computeFallbackEstimate(input, dvfSales);
  const response: EstimateResponse = { report, dvfSales, dvfSource, engine: "statistique" };
  return NextResponse.json(response);
}
