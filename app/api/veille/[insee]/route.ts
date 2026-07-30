import { checkHistoryPassword } from "@/lib/historyAuth";
import { ventesCommune } from "@/lib/veilleZone";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Ventes réelles récentes d'une commune (détail de la veille de zone).
export async function GET(request: Request, { params }: { params: Promise<{ insee: string }> }) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  const { insee } = await params;
  const url = new URL(request.url);
  const annee = Number(url.searchParams.get("annee")) || new Date().getFullYear() - 1;
  if (!/^\d{5}[a-z0-9]?$/i.test(insee)) {
    return Response.json({ error: "Code commune invalide" }, { status: 400 });
  }
  try {
    const ventes = await ventesCommune(insee, annee);
    return Response.json({ insee, annee, ventes });
  } catch {
    return Response.json({ error: "Données DVF indisponibles" }, { status: 502 });
  }
}
