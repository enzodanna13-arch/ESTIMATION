import { verifierAccesEquipe } from "@/lib/historyAuth";
import { deletePhotoMandat, getPhotoMandatBytes } from "@/lib/serverMandatsVente";

export const dynamic = "force-dynamic";

// Lecture PUBLIQUE de la photo (affichage <img>) ; suppression protégée.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string; photoId: string }> }) {
  const { id, photoId } = await params;
  try {
    const octets = await getPhotoMandatBytes(id, photoId);
    if (!octets) return Response.json({ error: "Photo introuvable" }, { status: 404 });
    return new Response(octets, { headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=86400" } });
  } catch {
    return Response.json({ error: "Chargement impossible" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string; photoId: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id, photoId } = await params;
  const mandat = await deletePhotoMandat(id, photoId);
  if (!mandat) return Response.json({ error: "Mandat introuvable" }, { status: 404 });
  return Response.json({ mandat });
}
