import { verifierAccesEquipe } from "@/lib/historyAuth";
import { deleteDocument, getDocBytes } from "@/lib/serverSinistres";

export const dynamic = "force-dynamic";

// Lecture PUBLIQUE du document (ouverture dans un onglet) ; suppression protégée.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string; docId: string }> }) {
  const { id, docId } = await params;
  try {
    const octets = await getDocBytes(id, docId);
    if (!octets) return Response.json({ error: "Document introuvable" }, { status: 404 });
    return new Response(octets, { headers: { "content-type": "application/pdf", "cache-control": "public, max-age=86400" } });
  } catch {
    return Response.json({ error: "Chargement impossible" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string; docId: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id, docId } = await params;
  const sinistre = await deleteDocument(id, docId);
  if (!sinistre) return Response.json({ error: "Sinistre introuvable" }, { status: 404 });
  return Response.json({ sinistre });
}
