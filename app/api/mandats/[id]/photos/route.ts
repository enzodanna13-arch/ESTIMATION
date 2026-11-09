import { verifierAccesEquipe } from "@/lib/historyAuth";
import { addPhotoMandat } from "@/lib/serverMandatsVente";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  let body: { data?: string };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  if (!body.data) return Response.json({ error: "Photo manquante" }, { status: 400 });
  try {
    const mandat = await addPhotoMandat(id, body.data);
    if (!mandat) return Response.json({ error: "Mandat introuvable" }, { status: 404 });
    return Response.json({ mandat });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Enregistrement impossible" }, { status: 500 });
  }
}
