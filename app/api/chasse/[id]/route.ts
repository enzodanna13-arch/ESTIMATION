import { verifierAccesEquipe } from "@/lib/historyAuth";
import { deleteChasseServer, getChasseServer } from "@/lib/serverChasse";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) {
    return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  }
  const { id } = await params;
  const fiche = await getChasseServer(id);
  if (!fiche) return Response.json({ error: "Fiche introuvable" }, { status: 404 });
  return Response.json({ fiche });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) {
    return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await deleteChasseServer(id);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Suppression de la chasse impossible :", err);
    return Response.json({ error: "Suppression impossible" }, { status: 500 });
  }
}
