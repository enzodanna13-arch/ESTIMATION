import { checkHistoryPassword } from "@/lib/historyAuth";
import { deleteVisiteServer, getVisiteServer } from "@/lib/serverHistory";

export const dynamic = "force-dynamic";

// Une visite virtuelle. La LECTURE est publique : l'id long et aléatoire
// sert de jeton, c'est le lien envoyé aux clients. La suppression reste
// protégée par le mot de passe d'équipe.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const visite = await getVisiteServer(id);
    if (!visite) return Response.json({ error: "Visite introuvable" }, { status: 404 });
    return Response.json({ visite });
  } catch {
    return Response.json({ error: "Stockage indisponible" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await deleteVisiteServer(id);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Suppression impossible" }, { status: 500 });
  }
}
