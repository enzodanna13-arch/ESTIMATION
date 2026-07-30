import { checkHistoryPassword } from "@/lib/historyAuth";
import { addVisiteImageServer } from "@/lib/serverHistory";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Ajout d'une scène 360° (une prise de vue par requête, JPEG compressé
// côté client sous la limite serverless ~4,5 Mo) — protégé
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  const { id } = await params;
  let body: { nom?: string; data?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Corps de requête invalide" }, { status: 400 });
  }
  if (!body.data) return Response.json({ error: "Image manquante" }, { status: 400 });
  try {
    const visite = await addVisiteImageServer(id, {
      nom: (body.nom ?? "").trim().slice(0, 80) || "Pièce",
      data: body.data,
    });
    if (!visite) return Response.json({ error: "Visite introuvable" }, { status: 404 });
    return Response.json({ visite });
  } catch {
    return Response.json({ error: "Enregistrement de la prise de vue impossible" }, { status: 500 });
  }
}
