import { checkHistoryPassword } from "@/lib/historyAuth";
import { addAppelServer, deleteAppelServer, listAppelsServer, type AppelEntry } from "@/lib/serverRegistre";

export const dynamic = "force-dynamic";

function nettoyer(v: unknown): string {
  return typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, 2000) : "";
}

export async function GET(request: Request) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé" }, { status: 401 });
  }
  try {
    const entries = await listAppelsServer();
    return Response.json({ entries });
  } catch (err) {
    console.error("Registre — lecture impossible :", err);
    return Response.json({ entries: [] });
  }
}

export async function POST(request: Request) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé" }, { status: 401 });
  }
  try {
    const b = (await request.json()) as Partial<AppelEntry>;
    const mois = nettoyer(b.mois).toUpperCase();
    if (!mois) return Response.json({ error: "Mois manquant" }, { status: 400 });
    const entry: AppelEntry = {
      id: nettoyer(b.id) || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: typeof b.createdAt === "number" ? b.createdAt : Date.now(),
      mois,
      jour: nettoyer(b.jour),
      origine: nettoyer(b.origine),
      destinataire: nettoyer(b.destinataire),
      nom: nettoyer(b.nom),
      telephone: nettoyer(b.telephone),
      mail: nettoyer(b.mail),
      refBien: nettoyer(b.refBien),
      message: nettoyer(b.message),
      traitement: nettoyer(b.traitement),
      finalise: nettoyer(b.finalise),
    };
    await addAppelServer(entry);
    return Response.json({ ok: true, entry });
  } catch (err) {
    console.error("Registre — ajout impossible :", err);
    return Response.json({ error: "Enregistrement impossible" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const mois = (searchParams.get("mois") ?? "").toUpperCase();
  const id = searchParams.get("id") ?? "";
  if (!mois || !id) return Response.json({ error: "Paramètres manquants" }, { status: 400 });
  try {
    await deleteAppelServer(mois, id);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Registre — suppression impossible :", err);
    return Response.json({ error: "Suppression impossible" }, { status: 500 });
  }
}
