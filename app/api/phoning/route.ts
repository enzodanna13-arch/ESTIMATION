import { verifierAccesEquipe } from "@/lib/historyAuth";
import { listPhoningServer } from "@/lib/serverPhoning";

export const dynamic = "force-dynamic";

// Phoning de TOUS les négociateurs (vue manager).
export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  try {
    return Response.json({ phoning: await listPhoningServer() });
  } catch {
    return Response.json({ phoning: [] });
  }
}
