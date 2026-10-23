import { verifierAccesEquipe } from "@/lib/historyAuth";
import { createRecommande, listRecommandes } from "@/lib/serverRecommandes";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  try {
    return Response.json({ recommandes: await listRecommandes() });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Chargement impossible" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  if (!body.objet && !body.expediteur) return Response.json({ error: "Objet ou expéditeur requis" }, { status: 400 });
  try {
    return Response.json({ recommande: await createRecommande(body) });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Création impossible" }, { status: 500 });
  }
}
