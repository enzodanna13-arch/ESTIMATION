import { verifierAccesEquipe } from "@/lib/historyAuth";
import { createSinistre, listSinistres } from "@/lib/serverSinistres";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  try {
    return Response.json({ sinistres: await listSinistres() });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Chargement impossible" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  if (!body.coproNom && !body.coproAdresse) return Response.json({ error: "Copropriété requise" }, { status: 400 });
  try {
    return Response.json({ sinistre: await createSinistre(body) });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Création impossible" }, { status: 500 });
  }
}
