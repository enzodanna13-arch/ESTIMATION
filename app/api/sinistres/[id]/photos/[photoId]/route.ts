import { verifierAccesEquipe } from "@/lib/historyAuth";
import { deletePhoto, getPhotoBytes, updatePhotoLegende } from "@/lib/serverSinistres";

export const dynamic = "force-dynamic";

// Lecture PUBLIQUE de la photo (affichage <img> + embarquement dans le PDF de
// déclaration) ; modification / suppression protégées par le mot de passe.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string; photoId: string }> }) {
  const { id, photoId } = await params;
  try {
    const octets = await getPhotoBytes(id, photoId);
    if (!octets) return Response.json({ error: "Photo introuvable" }, { status: 404 });
    return new Response(octets, { headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=86400" } });
  } catch {
    return Response.json({ error: "Chargement impossible" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string; photoId: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id, photoId } = await params;
  let body: { nom?: string; legende?: string };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  const sinistre = await updatePhotoLegende(id, photoId, body.nom ?? "", body.legende ?? "");
  if (!sinistre) return Response.json({ error: "Sinistre introuvable" }, { status: 404 });
  return Response.json({ sinistre });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string; photoId: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id, photoId } = await params;
  const sinistre = await deletePhoto(id, photoId);
  if (!sinistre) return Response.json({ error: "Sinistre introuvable" }, { status: 404 });
  return Response.json({ sinistre });
}
