import { verifierAccesEquipe } from "@/lib/historyAuth";
import { createTravaux, listTravaux } from "@/lib/serverTravaux";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  try {
    return Response.json({ dossiers: await listTravaux() });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Chargement impossible" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  if (!body.adresse && !body.clientNom) return Response.json({ error: "Adresse ou client requis" }, { status: 400 });
  try {
    return Response.json({ dossier: await createTravaux(body) });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Création impossible" }, { status: 500 });
  }
}
