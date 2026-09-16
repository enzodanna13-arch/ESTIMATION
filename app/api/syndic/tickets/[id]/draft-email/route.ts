import { garde } from "@/lib/syndic/guard";
import { obtenirTicket } from "@/lib/syndic/tickets";
import { obtenirResidence } from "@/lib/syndic/residences";
import { redigerReponseTicket } from "@/lib/syndic/ia";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Brouillon d'email de réponse rédigé par l'IA (l'humain relit et envoie).
// Réservé aux gestionnaires. Minimisation : seuls l'objet, la description, la
// catégorie et les informations saisies par le gestionnaire partent à l'IA.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await garde(request, "traiter_ticket");
  if ("erreur" in g) return g.erreur;
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "La rédaction IA n'est pas configurée (clé API manquante)." }, { status: 400 });
  }
  const { id } = await params;
  const ticket = await obtenirTicket(id);
  if (!ticket) return Response.json({ error: "Demande introuvable" }, { status: 404 });
  if (g.user.role === "gestionnaire_syndic" && ticket.assigneA !== g.user.id) {
    return Response.json({ error: "Cette demande ne vous est pas attribuée" }, { status: 403 });
  }

  let body: { faits?: string };
  try { body = (await request.json()) as typeof body; } catch { body = {}; }

  const residence = ticket.residenceId ? await obtenirResidence(ticket.residenceId) : null;
  try {
    const brouillon = await redigerReponseTicket({
      ticket,
      gestionnaireNom: `${g.user.prenom} ${g.user.nom}`.trim(),
      residenceNom: residence?.nom ?? "",
      faits: body.faits ?? "",
    });
    return Response.json({ brouillon });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Rédaction impossible" }, { status: 422 });
  }
}
