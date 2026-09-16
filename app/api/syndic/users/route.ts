import { garde } from "@/lib/syndic/guard";
import { creerUser, listerUsers } from "@/lib/syndic/users";
import { toPublicUser, type SyndicRole } from "@/lib/syndic/types";

export const dynamic = "force-dynamic";
const ROLES: SyndicRole[] = ["accueil", "gestionnaire_syndic", "admin"];

export async function GET(request: Request) {
  const g = await garde(request, "administrer");
  if ("erreur" in g) return g.erreur;
  const users = await listerUsers();
  return Response.json({ users: users.map(toPublicUser) });
}

export async function POST(request: Request) {
  const g = await garde(request, "administrer");
  if ("erreur" in g) return g.erreur;
  let body: { nom?: string; prenom?: string; email?: string; role?: string; telephoneMobile?: string; motDePasse?: string };
  try { body = (await request.json()) as typeof body; } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }
  if (!body.nom || !body.email || !ROLES.includes(body.role as SyndicRole) || (body.motDePasse ?? "").length < 6) {
    return Response.json({ error: "Nom, email, rôle et mot de passe (6+ caractères) requis" }, { status: 400 });
  }
  try {
    const user = await creerUser({
      nom: body.nom, prenom: body.prenom ?? "", email: body.email,
      role: body.role as SyndicRole, telephoneMobile: body.telephoneMobile, motDePasse: body.motDePasse!,
    });
    return Response.json({ user: toPublicUser(user) });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Création impossible" }, { status: 422 });
  }
}
