import { checkHistoryPassword } from "@/lib/historyAuth";
import { getClientEstimationServer, updateClientEstimationServer } from "@/lib/clientEstimations";
import { STATUTS_ESTIMATION_CLIENT, type NoteCommerciale } from "@/lib/clientTypes";

export const dynamic = "force-dynamic";

// Fiche complète d'une estimation client + mise à jour du suivi commercial
// (statut, notes). Protégé par le mot de passe d'équipe.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkHistoryPassword(request)) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  const rec = await getClientEstimationServer(id);
  if (!rec) return Response.json({ error: "Introuvable" }, { status: 404 });
  return Response.json({ estimation: rec });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkHistoryPassword(request)) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  let body: { statut?: string; ajouterNote?: string; auteur?: string };
  try { body = (await request.json()) as typeof body; }
  catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }

  const rec = await getClientEstimationServer(id);
  if (!rec) return Response.json({ error: "Introuvable" }, { status: 404 });

  const patch: { statut?: string; notes?: NoteCommerciale[] } = {};
  if (body.statut && (STATUTS_ESTIMATION_CLIENT as readonly string[]).includes(body.statut)) {
    patch.statut = body.statut;
  }
  if (body.ajouterNote?.trim()) {
    patch.notes = [
      ...rec.notes,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, date: Date.now(), auteur: (body.auteur ?? "Équipe").slice(0, 40), texte: body.ajouterNote.trim().slice(0, 1000) },
    ];
  }
  const updated = await updateClientEstimationServer(id, patch);
  return Response.json({ estimation: updated });
}
