import { deleteEstimationServer, getEstimationServer } from "@/lib/serverHistory";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
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

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await deleteEstimationServer(id);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Suppression impossible :", err);
    return Response.json({ error: "Suppression impossible" }, { status: 500 });
  }
}
