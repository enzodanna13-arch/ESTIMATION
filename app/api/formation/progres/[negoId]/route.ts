import { verifierAccesEquipe } from "@/lib/historyAuth";
import { getProgresServer, saveProgresServer, nettoyerProgres } from "@/lib/serverFormation";

export const dynamic = "force-dynamic";

// Progression formation d'UN négociateur.
export async function GET(request: Request, { params }: { params: Promise<{ negoId: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { negoId } = await params;
  try {
    const p = await getProgresServer(negoId);
    return Response.json({ progres: p?.progres ?? {} });
  } catch {
    return Response.json({ progres: {} });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ negoId: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { negoId } = await params;
  let body: { progres?: unknown };
  try { body = (await request.json()) as { progres?: unknown }; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  const clean = nettoyerProgres(body.progres);
  try {
    const saved = await saveProgresServer(negoId, clean);
    return Response.json({ progres: saved.progres });
  } catch {
    return Response.json({ error: "Enregistrement impossible" }, { status: 500 });
  }
}
