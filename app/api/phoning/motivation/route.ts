import { verifierAccesEquipe } from "@/lib/historyAuth";
import { getMotivationServer, saveMotivationServer } from "@/lib/serverPhoning";
import { PHRASES_MOTIVATION_DEFAUT } from "@/lib/phoningScripts";

export const dynamic = "force-dynamic";

// Phrases de remotivation (config globale, personnalisée par le manager).
export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  try {
    const p = await getMotivationServer();
    return Response.json({ phrases: p && p.length ? p : PHRASES_MOTIVATION_DEFAUT });
  } catch {
    return Response.json({ phrases: PHRASES_MOTIVATION_DEFAUT });
  }
}

export async function PUT(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  let body: { phrases?: unknown };
  try { body = (await request.json()) as { phrases?: unknown }; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  try {
    const saved = await saveMotivationServer(body.phrases);
    return Response.json({ phrases: saved.length ? saved : PHRASES_MOTIVATION_DEFAUT });
  } catch {
    return Response.json({ error: "Enregistrement impossible" }, { status: 500 });
  }
}
