import { checkHistoryPassword } from "@/lib/historyAuth";
import { deleteDocumentServer, getDocumentServer } from "@/lib/serverHistory";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  }
  const { id } = await params;
  const entry = await getDocumentServer(id);
  if (!entry) return Response.json({ error: "Introuvable" }, { status: 404 });
  return Response.json(entry);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  }
  const { id } = await params;
  await deleteDocumentServer(id);
  return Response.json({ ok: true });
}
