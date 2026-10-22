import { verifierAccesEquipe } from "@/lib/historyAuth";
import { addDocument } from "@/lib/serverSinistres";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Ajout d'un document (PDF compressé côté client sous ~4,5 Mo).
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  let body: { nom?: string; data?: string };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  if (!body.data) return Response.json({ error: "Document manquant" }, { status: 400 });
  try {
    const sinistre = await addDocument(id, { nom: body.nom ?? "", data: body.data });
    if (!sinistre) return Response.json({ error: "Sinistre introuvable" }, { status: 404 });
    return Response.json({ sinistre });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Enregistrement impossible" }, { status: 500 });
  }
}
