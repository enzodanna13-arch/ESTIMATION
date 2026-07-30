import { checkHistoryPassword } from "@/lib/historyAuth";
import { deleteClientServer, getClientServer } from "@/lib/serverHistory";

export const dynamic = "force-dynamic";

// Un dossier client : détail et suppression (dossier + toutes ses pièces)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const dossier = await getClientServer(id);
    if (!dossier) return Response.json({ error: "Dossier introuvable" }, { status: 404 });
    return Response.json({ dossier });
  } catch {
    return Response.json({ error: "Stockage partagé indisponible" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await deleteClientServer(id);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Suppression impossible" }, { status: 500 });
  }
}
