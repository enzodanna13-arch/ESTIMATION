import { garde } from "@/lib/syndic/guard";
import { appliquerAction, evenementsDuTicket, obtenirTicket, type ActionTicket } from "@/lib/syndic/tickets";
import { obtenirResidence } from "@/lib/syndic/residences";
import { listerUsers } from "@/lib/syndic/users";
import { peutQualifier, peutTraiterTicket } from "@/lib/syndic/permissions";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await garde(request, "acceder");
  if ("erreur" in g) return g.erreur;
  const { id } = await params;
  const ticket = await obtenirTicket(id);
  if (!ticket) return Response.json({ error: "Demande introuvable" }, { status: 404 });
  // Cloisonnement : un gestionnaire n'ouvre que ses demandes.
  if (g.user.role === "gestionnaire_syndic" && ticket.assigneA !== g.user.id) {
    return Response.json({ error: "Cette demande ne vous est pas attribuée" }, { status: 403 });
  }

  const [users, residence] = await Promise.all([
    listerUsers(),
    ticket.residenceId ? obtenirResidence(ticket.residenceId) : Promise.resolve(null),
  ]);
  const unom = new Map(users.map((u) => [u.id, `${u.prenom} ${u.nom}`.trim()] as const));
  let evenements = await evenementsDuTicket(id);
  // L'accueil ne voit pas les commentaires internes.
  if (g.user.role === "accueil") {
    evenements = evenements.filter((e) => e.type !== "commentaire_interne");
  }

  return Response.json({
    ticket,
    residenceNom: residence?.nom ?? "",
    assigneNom: ticket.assigneA ? (unom.get(ticket.assigneA) ?? "") : "",
    creeParNom: ticket.creePar ? (unom.get(ticket.creePar) ?? "") : "",
    evenements: evenements.map((e) => ({ ...e, auteurNom: e.auteurId ? (unom.get(e.auteurId) ?? "") : "Système" })),
  });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await garde(request, "acceder");
  if ("erreur" in g) return g.erreur;
  const { id } = await params;
  const ticket = await obtenirTicket(id);
  if (!ticket) return Response.json({ error: "Demande introuvable" }, { status: 404 });

  let act: ActionTicket;
  try { act = (await request.json()) as ActionTicket; } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }

  // Droits par action.
  if (act.action === "qualifier") {
    if (!peutQualifier(g.user.role)) return Response.json({ error: "Réservé à l'accueil ou au responsable" }, { status: 403 });
  } else {
    if (!peutTraiterTicket(g.user.role)) return Response.json({ error: "Réservé aux gestionnaires" }, { status: 403 });
    if (g.user.role === "gestionnaire_syndic" && ticket.assigneA !== g.user.id) {
      return Response.json({ error: "Cette demande ne vous est pas attribuée" }, { status: 403 });
    }
  }

  const r = await appliquerAction(ticket, act, g.user.id);
  if ("erreur" in r) return Response.json({ error: r.erreur }, { status: 422 });
  return Response.json({ ticket: r.ticket });
}
