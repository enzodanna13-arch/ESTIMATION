import { verifierAccesEquipe } from "@/lib/historyAuth";
import { listOrgServer } from "@/lib/serverOrganisation";

export const dynamic = "force-dynamic";

// Organisation de TOUS les négociateurs (vue manager).
export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  try {
    return Response.json({ org: await listOrgServer() });
  } catch {
    return Response.json({ org: [] });
  }
}
