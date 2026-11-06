import { verifierAccesEquipe } from "@/lib/historyAuth";
import { deletePhoto, getPhotoBytes, updatePhoto } from "@/lib/serverTravaux";

export const dynamic = "force-dynamic";

// Lecture PUBLIQUE de la photo (affichage <img> + embarquement dans le PDF) ;
// modification / suppression protégées par le mot de passe d'équipe.
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
  let body: { nom?: string; piece?: string; etat?: string; legendeAvant?: string; legendeApres?: string };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  const dossier = await updatePhoto(id, photoId, body);
  if (!dossier) return Response.json({ error: "Dossier introuvable" }, { status: 404 });
  return Response.json({ dossier });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string; photoId: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id, photoId } = await params;
  const dossier = await deletePhoto(id, photoId);
  if (!dossier) return Response.json({ error: "Dossier introuvable" }, { status: 404 });
  return Response.json({ dossier });
}
