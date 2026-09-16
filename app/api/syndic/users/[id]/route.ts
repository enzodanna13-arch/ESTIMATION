import { garde } from "@/lib/syndic/guard";
import { majUser, supprimerUser } from "@/lib/syndic/users";
import { toPublicUser } from "@/lib/syndic/types";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await garde(request, "administrer");
  if ("erreur" in g) return g.erreur;
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }
  try {
    const user = await majUser(id, body);
    if (!user) return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });
    return Response.json({ user: toPublicUser(user) });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Mise à jour impossible" }, { status: 422 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await garde(request, "administrer");
  if ("erreur" in g) return g.erreur;
  const { id } = await params;
  if (g.user.id === id) {
    return Response.json({ error: "Vous ne pouvez pas supprimer votre propre compte" }, { status: 422 });
  }
  await supprimerUser(id);
  return Response.json({ ok: true });
}
