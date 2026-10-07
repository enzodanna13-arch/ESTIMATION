import { verifierAccesEquipe } from "@/lib/historyAuth";
import { verifierAdmin } from "@/lib/adminAuth";
import { getBaseServer, saveBaseServer } from "@/lib/serverPhoningBase";

export const dynamic = "force-dynamic";

// GET : base partagée d'une cible (tout membre de l'équipe).
export async function GET(request: Request, { params }: { params: Promise<{ cibleId: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { cibleId } = await params;
  try {
    const b = await getBaseServer(cibleId);
    return Response.json({ contacts: b?.contacts ?? [], updatedAt: b?.updatedAt ?? 0 });
  } catch {
    return Response.json({ contacts: [], updatedAt: 0 });
  }
}

// PUT : remplace la base (réservé à l'admin — code admin dans x-admin-key).
export async function PUT(request: Request, { params }: { params: Promise<{ cibleId: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  if (!(await verifierAdmin(request.headers.get("x-admin-key") ?? ""))) return Response.json({ error: "Accès admin requis" }, { status: 403 });
  const { cibleId } = await params;
  let body: { contacts?: unknown };
  try { body = (await request.json()) as { contacts?: unknown }; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  try {
    const b = await saveBaseServer(cibleId, body.contacts);
    return Response.json({ contacts: b.contacts, updatedAt: b.updatedAt });
  } catch {
    return Response.json({ error: "Enregistrement impossible" }, { status: 500 });
  }
}
