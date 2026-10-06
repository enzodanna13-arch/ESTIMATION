import { verifierAccesEquipe } from "@/lib/historyAuth";
import { getOrgServer, saveJourServer } from "@/lib/serverOrganisation";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ negoId: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { negoId } = await params;
  try {
    const o = await getOrgServer(negoId);
    return Response.json({ jours: o?.jours ?? {} });
  } catch {
    return Response.json({ jours: {} });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ negoId: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { negoId } = await params;
  let body: { date?: string; plan?: unknown };
  try { body = (await request.json()) as { date?: string; plan?: unknown }; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  try {
    const plan = await saveJourServer(negoId, String(body.date ?? ""), body.plan);
    return Response.json({ plan });
  } catch {
    return Response.json({ error: "Enregistrement impossible" }, { status: 500 });
  }
}
