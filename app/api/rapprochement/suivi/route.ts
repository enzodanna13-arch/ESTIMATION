import { verifierAccesEquipe } from "@/lib/historyAuth";
import { getSuiviServer, setSuiviServer } from "@/lib/serverRapprochementSuivi";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  try {
    return Response.json({ suivi: await getSuiviServer() });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Chargement impossible" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  let body: { cle?: string; statut?: string; note?: string };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  if (!body.cle) return Response.json({ error: "Clé requise" }, { status: 400 });
  try {
    const suivi = await setSuiviServer(body.cle, body.statut ?? "Nouveau", body.note);
    return Response.json({ suivi });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Enregistrement impossible" }, { status: 500 });
  }
}
