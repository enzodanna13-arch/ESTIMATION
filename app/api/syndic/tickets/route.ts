import { garde } from "@/lib/syndic/guard";
import { creerTicket, listerTickets } from "@/lib/syndic/tickets";
import { listerResidences } from "@/lib/syndic/residences";
import { listerUsers } from "@/lib/syndic/users";
import {
  CATEGORIES_LABELS, ORIGINES_LABELS, PRIORITES_LABELS,
  type TicketCategorie, type TicketOrigine, type TicketPriorite, type QualiteContact,
} from "@/lib/syndic/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const g = await garde(request, "acceder");
  if ("erreur" in g) return g.erreur;

  let tickets = await listerTickets();
  // Cloisonnement : un gestionnaire ne voit QUE ses demandes.
  if (g.user.role === "gestionnaire_syndic") {
    tickets = tickets.filter((t) => t.assigneA === g.user.id);
  }
  const [residences, users] = await Promise.all([listerResidences(), listerUsers()]);
  const rnom = new Map(residences.map((r) => [r.id, r.nom] as const));
  const unom = new Map(users.map((u) => [u.id, `${u.prenom} ${u.nom}`.trim()] as const));

  const resume = tickets.map((t) => ({
    id: t.id, numero: t.numero, objet: t.objet, categorie: t.categorie,
    priorite: t.priorite, statut: t.statut, creeLe: t.creeLe, creneauRappel: t.creneauRappel,
    residenceNom: t.residenceId ? (rnom.get(t.residenceId) ?? "—") : "",
    assigneNom: t.assigneA ? (unom.get(t.assigneA) ?? "—") : "",
    aQualifier: !t.residenceId, aAttribuer: Boolean(t.residenceId) && !t.assigneA,
    aValider: t.aValider, origine: t.origine,
  }));
  return Response.json({ tickets: resume, role: g.user.role });
}

const CATS = Object.keys(CATEGORIES_LABELS);
const PRIOS = Object.keys(PRIORITES_LABELS);
const ORIS = Object.keys(ORIGINES_LABELS);

export async function POST(request: Request) {
  const g = await garde(request, "creer_ticket");
  if ("erreur" in g) return g.erreur;
  let b: Record<string, unknown>;
  try { b = (await request.json()) as Record<string, unknown>; } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }
  const s = (k: string) => String(b[k] ?? "").trim();
  // Champs obligatoires (§9) : nom du demandeur, téléphone, catégorie, description.
  if (!s("demandeurNom") || !s("demandeurTelephone") || !CATS.includes(s("categorie")) || !s("description")) {
    return Response.json({ error: "Nom, téléphone, catégorie et description sont obligatoires" }, { status: 400 });
  }
  const origine = ORIS.includes(s("origine")) ? (s("origine") as TicketOrigine) : "accueil_telephone";
  const priorite = PRIOS.includes(s("priorite")) ? (s("priorite") as TicketPriorite) : "normale";

  const ticket = await creerTicket({
    origine,
    categorie: s("categorie") as TicketCategorie,
    priorite,
    residenceId: s("residenceId") || null,
    lotId: s("lotId") || null,
    contactId: s("contactId") || null,
    demandeurNom: s("demandeurNom"),
    demandeurTelephone: s("demandeurTelephone"),
    demandeurEmail: s("demandeurEmail"),
    demandeurQualite: (s("demandeurQualite") as QualiteContact) || "",
    objet: s("objet"),
    description: s("description"),
    creneauRappel: s("creneauRappel"),
  }, g.user.id);

  return Response.json({ ticket });
}
