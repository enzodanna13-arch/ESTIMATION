import { verifierAccesEquipe } from "@/lib/historyAuth";
import { traiterRelances } from "@/lib/relancesAuto";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Tâche quotidienne (Vercel Cron) : envoie les relances SMS dues aux clients
// non joints. Sécurisée par CRON_SECRET si défini ; sinon ouverte (l'action est
// idempotente : elle n'envoie que les relances réellement dues ce jour-là).
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  const autorise = (!!secret && auth === `Bearer ${secret}`) || (await verifierAccesEquipe(request)) || !secret;
  if (!autorise) return Response.json({ error: "Accès réservé" }, { status: 401 });

  const resume = await traiterRelances();
  return Response.json(resume);
}
