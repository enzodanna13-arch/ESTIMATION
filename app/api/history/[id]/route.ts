import { verifierAccesEquipe } from "@/lib/historyAuth";
import { deleteEstimationServer, getEstimationServer, updateMotifServer } from "@/lib/serverHistory";

export const dynamic = "force-dynamic";

// Reclasser une estimation (changer son motif) — met à jour le filtre des rapprochements.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  const { id } = await params;
  let body: { motif?: string };
  try { body = (await request.json()) as { motif?: string }; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  try {
    const ok = await updateMotifServer(id, String(body.motif ?? "vente"));
    return ok ? Response.json({ ok: true }) : Response.json({ error: "Dossier introuvable" }, { status: 404 });
  } catch {
    return Response.json({ error: "Mise à jour impossible" }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) {
    return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const entry = await getEstimationServer(id);
    if (!entry) return Response.json({ error: "Dossier introuvable" }, { status: 404 });
    return Response.json(entry);
  } catch (err) {
    console.error("Lecture du dossier impossible :", err);
    return Response.json({ error: "Lecture impossible" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) {
    return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await deleteEstimationServer(id);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Suppression impossible :", err);
    return Response.json({ error: "Suppression impossible" }, { status: 500 });
  }
}
