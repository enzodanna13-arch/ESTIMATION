import { verifierAccesEquipe } from "@/lib/historyAuth";
import { verifierAdmin } from "@/lib/adminAuth";
import { getObjectifsServer, saveObjectifServer } from "@/lib/serverObjectifs";

export const dynamic = "force-dynamic";

// Objectifs de CA par année. Lecture pour l'équipe, écriture réservée à l'admin.
export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  try { return Response.json({ objectifs: await getObjectifsServer() }); }
  catch { return Response.json({ objectifs: {} }); }
}

export async function PUT(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  if (!(await verifierAdmin(request.headers.get("x-admin-key") ?? ""))) return Response.json({ error: "Accès admin requis" }, { status: 403 });
  let body: { annee?: unknown; montant?: unknown };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  const annee = Number(body.annee);
  if (!Number.isInteger(annee) || annee < 2000 || annee > 2100) return Response.json({ error: "Année invalide" }, { status: 400 });
  try { return Response.json({ objectifs: await saveObjectifServer(annee, Number(body.montant)) }); }
  catch { return Response.json({ error: "Enregistrement impossible" }, { status: 500 }); }
}
