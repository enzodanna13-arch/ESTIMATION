import { garde } from "@/lib/syndic/guard";
import { deleteArchive, updateArchive } from "@/lib/syndic/serverArchive";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await garde(request);
  if ("erreur" in g) return g.erreur;
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  const doc = await updateArchive(id, body);
  if (!doc) return Response.json({ error: "Document introuvable" }, { status: 404 });
  return Response.json({ document: doc });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await garde(request);
  if ("erreur" in g) return g.erreur;
  const { id } = await params;
  await deleteArchive(id);
  return Response.json({ ok: true });
}
