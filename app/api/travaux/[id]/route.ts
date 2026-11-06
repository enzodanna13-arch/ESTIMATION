import { verifierAccesEquipe } from "@/lib/historyAuth";
import { deleteTravaux, getTravaux, updateTravaux } from "@/lib/serverTravaux";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  const dossier = await getTravaux(id);
  if (!dossier) return Response.json({ error: "Dossier introuvable" }, { status: 404 });
  return Response.json({ dossier });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  const dossier = await updateTravaux(id, body);
  if (!dossier) return Response.json({ error: "Dossier introuvable" }, { status: 404 });
  return Response.json({ dossier });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  const ok = await deleteTravaux(id);
  if (!ok) return Response.json({ error: "Dossier introuvable" }, { status: 404 });
  return Response.json({ ok: true });
}
