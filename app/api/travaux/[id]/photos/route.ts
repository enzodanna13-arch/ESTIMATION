import { verifierAccesEquipe } from "@/lib/historyAuth";
import { addPhoto } from "@/lib/serverTravaux";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Ajout d'une photo (une par requête, JPEG compressé côté client sous ~4,5 Mo).
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  let body: { nom?: string; piece?: string; etat?: string; legendeAvant?: string; legendeApres?: string; data?: string };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  if (!body.data) return Response.json({ error: "Photo manquante" }, { status: 400 });
  try {
    const dossier = await addPhoto(id, {
      nom: body.nom ?? "", piece: body.piece ?? "", etat: body.etat ?? "",
      legendeAvant: body.legendeAvant ?? "", legendeApres: body.legendeApres ?? "", data: body.data,
    });
    if (!dossier) return Response.json({ error: "Dossier introuvable" }, { status: 404 });
    return Response.json({ dossier });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Enregistrement impossible" }, { status: 500 });
  }
}
