import { checkHistoryPassword } from "@/lib/historyAuth";
import { deleteClientFileServer, getClientFileServer, getClientServer } from "@/lib/serverHistory";

export const dynamic = "force-dynamic";

// Une pièce PDF du dossier client : téléchargement (via l'API protégée —
// les URL de stockage ne sont jamais exposées) et suppression
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; fileId: string }> },
) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  const { id, fileId } = await params;
  try {
    const [octets, dossier] = await Promise.all([getClientFileServer(id, fileId), getClientServer(id)]);
    if (!octets) return Response.json({ error: "Pièce introuvable" }, { status: 404 });
    const piece = dossier?.pieces.find((p) => p.fileId === fileId);
    const nom = (piece?.nom ?? "piece.pdf").replace(/["\\\r\n]/g, "");
    return new Response(octets, {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${nom}"`,
        "cache-control": "no-store",
      },
    });
  } catch {
    return Response.json({ error: "Téléchargement impossible" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; fileId: string }> },
) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  const { id, fileId } = await params;
  try {
    const dossier = await deleteClientFileServer(id, fileId);
    if (!dossier) return Response.json({ error: "Dossier introuvable" }, { status: 404 });
    return Response.json({ dossier });
  } catch {
    return Response.json({ error: "Suppression impossible" }, { status: 500 });
  }
}
