import { verifierAccesEquipe } from "@/lib/historyAuth";
import { getProcessOverrides, saveProcessOverride } from "@/lib/serverProcess";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  try {
    return Response.json({ overrides: await getProcessOverrides() });
  } catch {
    return Response.json({ overrides: {} });
  }
}

export async function PUT(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  let body: { id?: string; contenu?: unknown };
  try { body = (await request.json()) as { id?: string; contenu?: unknown }; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  if (!body.id) return Response.json({ error: "id manquant" }, { status: 400 });
  try {
    const overrides = await saveProcessOverride(body.id, body.contenu);
    return Response.json({ overrides });
  } catch {
    return Response.json({ error: "Enregistrement impossible" }, { status: 500 });
  }
}
