import { verifierAccesEquipe } from "@/lib/historyAuth";
import { getTournee } from "@/lib/serverProspection";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  const { id } = await params;
  const tournee = await getTournee(id);
  if (!tournee) return Response.json({ error: "Tournée introuvable" }, { status: 404 });
  return Response.json({ tournee });
}
