import { checkHistoryPassword } from "@/lib/historyAuth";
import { deleteEstimationServer, getEstimationServer } from "@/lib/serverHistory";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const entry = await getEstimationServer(id);
    if (!entry) return Response.json({ error: "Dossier introuvable" }, { status: 404 });
    return Response.json(entry);
  } catch (err) {
    console.error("Lecture du dossier impossible :", err);
    return Response.json({ error: "Lecture impossible" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await deleteEstimationServer(id);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Suppression impossible :", err);
    return Response.json({ error: "Suppression impossible" }, { status: 500 });
  }
}
