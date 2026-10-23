import { verifierAccesEquipe } from "@/lib/historyAuth";
import { addScan } from "@/lib/serverRecommandes";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Ajout d'un scan (PDF ou image JPEG), compressé côté client sous ~4,5 Mo.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  let body: { nom?: string; type?: string; data?: string };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  if (!body.data) return Response.json({ error: "Scan manquant" }, { status: 400 });
  const type = body.type === "pdf" ? "pdf" : "image";
  try {
    const recommande = await addScan(id, { nom: body.nom ?? "", type, data: body.data });
    if (!recommande) return Response.json({ error: "Recommandé introuvable" }, { status: 404 });
    return Response.json({ recommande });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Enregistrement impossible" }, { status: 500 });
  }
}
