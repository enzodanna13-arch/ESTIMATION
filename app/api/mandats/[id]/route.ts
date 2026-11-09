import { verifierAccesEquipe } from "@/lib/historyAuth";
import { deleteMandatServer, getMandatServer, updateMandatServer } from "@/lib/serverMandatsVente";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  const mandat = await getMandatServer(id);
  if (!mandat) return Response.json({ error: "Mandat introuvable" }, { status: 404 });
  return Response.json({ mandat });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  const mandat = await updateMandatServer(id, body);
  if (!mandat) return Response.json({ error: "Mandat introuvable" }, { status: 404 });
  return Response.json({ mandat });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  const ok = await deleteMandatServer(id);
  if (!ok) return Response.json({ error: "Mandat introuvable" }, { status: 404 });
  return Response.json({ ok: true });
}
