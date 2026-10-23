import { verifierAccesEquipe } from "@/lib/historyAuth";
import { addSuivi } from "@/lib/serverRecommandes";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  let body: { texte?: string; statut?: string };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  if (!body.texte?.trim() && !body.statut) return Response.json({ error: "Entrée vide" }, { status: 400 });
  try {
    const recommande = await addSuivi(id, body.texte ?? "", body.statut);
    if (!recommande) return Response.json({ error: "Recommandé introuvable" }, { status: 404 });
    return Response.json({ recommande });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Enregistrement impossible" }, { status: 500 });
  }
}
