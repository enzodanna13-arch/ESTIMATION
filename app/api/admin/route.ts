import { verifierAccesEquipe } from "@/lib/historyAuth";
import { adminConfigure, verifierAdmin, definirCodeAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// Gestion du CODE ADMIN. Protégé par le mot de passe d'équipe (x-history-key) :
// seul quelqu'un déjà entré dans l'outil peut interroger / déverrouiller l'admin.
export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  let body: { action?: string; code?: string; actuel?: string; nouveau?: string };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }

  if (body.action === "etat") {
    return Response.json({ configure: await adminConfigure() });
  }
  if (body.action === "verifier") {
    return Response.json({ ok: await verifierAdmin(String(body.code ?? "")) });
  }
  if (body.action === "definir") {
    const r = await definirCodeAdmin(String(body.actuel ?? ""), String(body.nouveau ?? ""));
    if ("ok" in r) return Response.json({ ok: true });
    return Response.json({ error: r.erreur }, { status: 400 });
  }
  return Response.json({ error: "Action inconnue" }, { status: 400 });
}
