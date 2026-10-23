import { verifierAccesEquipe } from "@/lib/historyAuth";
import { deleteRecommande, getRecommande, updateRecommande } from "@/lib/serverRecommandes";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  const recommande = await getRecommande(id);
  if (!recommande) return Response.json({ error: "Recommandé introuvable" }, { status: 404 });
  return Response.json({ recommande });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  try {
    const recommande = await updateRecommande(id, body);
    if (!recommande) return Response.json({ error: "Recommandé introuvable" }, { status: 404 });
    return Response.json({ recommande });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Mise à jour impossible" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  await deleteRecommande(id);
  return Response.json({ ok: true });
}
