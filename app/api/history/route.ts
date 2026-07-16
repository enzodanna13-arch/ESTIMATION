import { checkHistoryPassword } from "@/lib/historyAuth";
import { listEstimationsServer } from "@/lib/serverHistory";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  }
  try {
    const entries = await listEstimationsServer();
    return Response.json({ entries });
  } catch (err) {
    console.error("Lecture de l'historique impossible :", err);
    return Response.json({ entries: [] });
  }
}
