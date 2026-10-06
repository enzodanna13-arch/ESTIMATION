import { verifierAccesEquipe } from "@/lib/historyAuth";
import { getPhoningServer, savePhoningServer, nettoyerPhoning } from "@/lib/serverPhoning";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ negoId: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { negoId } = await params;
  try {
    const p = await getPhoningServer(negoId);
    return Response.json({ data: p?.data ?? {} });
  } catch {
    return Response.json({ data: {} });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ negoId: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { negoId } = await params;
  let body: { data?: unknown };
  try { body = (await request.json()) as { data?: unknown }; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  const clean = nettoyerPhoning(body.data);
  try {
    const saved = await savePhoningServer(negoId, clean);
    return Response.json({ data: saved.data });
  } catch {
    return Response.json({ error: "Enregistrement impossible" }, { status: 500 });
  }
}
