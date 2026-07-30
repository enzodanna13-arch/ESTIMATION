import { checkHistoryPassword } from "@/lib/historyAuth";
import { listVisitesServer, saveVisiteServer, type VisiteVirtuelle } from "@/lib/serverHistory";

export const dynamic = "force-dynamic";

// Visites virtuelles : liste et création (protégées — réservées à l'équipe)
export async function GET(request: Request) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  try {
    return Response.json({ visites: await listVisitesServer() });
  } catch {
    return Response.json({ error: "Stockage partagé indisponible" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  let body: { bien?: string; negociateur?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Corps de requête invalide" }, { status: 400 });
  }
  if (!body.bien?.trim()) {
    return Response.json({ error: "La désignation du bien est requise" }, { status: 400 });
  }
  // Id long et aléatoire : il sert de jeton d'accès au lien de partage client
  const visite: VisiteVirtuelle = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    bien: body.bien.trim(),
    negociateur: (body.negociateur ?? "").trim(),
    scenes: [],
  };
  try {
    await saveVisiteServer(visite);
    return Response.json({ visite });
  } catch {
    return Response.json({ error: "Stockage partagé indisponible" }, { status: 500 });
  }
}
