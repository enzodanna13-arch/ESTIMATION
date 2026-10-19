import { verifierAccesEquipe } from "@/lib/historyAuth";
import { getSyndicProspect, setSyndicProspect } from "@/lib/serverSyndicProspect";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  try { return Response.json({ prospect: await getSyndicProspect() }); }
  catch { return Response.json({ prospect: {} }); }
}

export async function PUT(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  let body: { coproId?: string; statut?: string; notes?: string };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  try {
    const prospect = await setSyndicProspect(String(body.coproId ?? ""), String(body.statut ?? ""), String(body.notes ?? ""));
    return Response.json({ prospect });
  } catch {
    return Response.json({ error: "Enregistrement impossible" }, { status: 500 });
  }
}
