import { verifierAccesEquipe } from "@/lib/historyAuth";
import { listClientEstimationsServer } from "@/lib/clientEstimations";

export const dynamic = "force-dynamic";

// Liste back-office des ESTIMATIONS CLIENTS (rubrique « Estimations clients »).
// Protégée par le mot de passe d'équipe, comme le reste du back-office.
export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  try {
    return Response.json({ estimations: await listClientEstimationsServer() });
  } catch {
    return Response.json({ estimations: [] });
  }
}
