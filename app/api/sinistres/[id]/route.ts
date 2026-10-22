import { verifierAccesEquipe } from "@/lib/historyAuth";
import { deleteSinistre, getSinistre, updateSinistre } from "@/lib/serverSinistres";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  const sinistre = await getSinistre(id);
  if (!sinistre) return Response.json({ error: "Sinistre introuvable" }, { status: 404 });
  return Response.json({ sinistre });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  try {
    const sinistre = await updateSinistre(id, body);
    if (!sinistre) return Response.json({ error: "Sinistre introuvable" }, { status: 404 });
    return Response.json({ sinistre });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Mise à jour impossible" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  await deleteSinistre(id);
  return Response.json({ ok: true });
}
