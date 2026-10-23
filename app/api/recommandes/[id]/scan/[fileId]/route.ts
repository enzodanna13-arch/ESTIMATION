import { verifierAccesEquipe } from "@/lib/historyAuth";
import { deleteScan, getScanBytes } from "@/lib/serverRecommandes";

export const dynamic = "force-dynamic";

// Lecture PUBLIQUE du scan (affichage / ouverture) ; suppression protégée.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string; fileId: string }> }) {
  const { id, fileId } = await params;
  try {
    const res = await getScanBytes(id, fileId);
    if (!res) return Response.json({ error: "Scan introuvable" }, { status: 404 });
    return new Response(res.bytes, { headers: { "content-type": res.contentType, "cache-control": "public, max-age=86400" } });
  } catch {
    return Response.json({ error: "Chargement impossible" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string; fileId: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id, fileId } = await params;
  const recommande = await deleteScan(id, fileId);
  if (!recommande) return Response.json({ error: "Recommandé introuvable" }, { status: 404 });
  return Response.json({ recommande });
}
