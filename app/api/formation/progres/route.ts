import { verifierAccesEquipe } from "@/lib/historyAuth";
import { listProgresServer } from "@/lib/serverFormation";

export const dynamic = "force-dynamic";

// Liste la progression formation de TOUS les négociateurs (vue manager).
export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  try {
    return Response.json({ progres: await listProgresServer() });
  } catch {
    return Response.json({ progres: [] });
  }
}
