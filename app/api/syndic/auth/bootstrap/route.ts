import { checkHistoryPassword } from "@/lib/historyAuth";
import { compterUsers, creerUser } from "@/lib/syndic/users";
import { cookieConnexion, creerJeton } from "@/lib/syndic/session";
import { toPublicUser } from "@/lib/syndic/types";

export const dynamic = "force-dynamic";

// Création du PREMIER responsable (admin) du module Syndic. Autorisée uniquement
// s'il n'existe encore AUCUN utilisateur, et protégée par le mot de passe
// d'équipe (en-tête x-history-key) pour éviter une création par un inconnu.
export async function POST(request: Request) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Mot de passe d'équipe requis" }, { status: 401 });
  }
  if ((await compterUsers()) > 0) {
    return Response.json({ error: "Le module est déjà initialisé" }, { status: 409 });
  }
  let body: { nom?: string; prenom?: string; email?: string; motDePasse?: string };
  try { body = (await request.json()) as typeof body; } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }
  if (!body.nom || !body.email || !body.motDePasse || (body.motDePasse ?? "").length < 6) {
    return Response.json({ error: "Nom, email et mot de passe (6+ caractères) requis" }, { status: 400 });
  }
  const user = await creerUser({
    nom: body.nom, prenom: body.prenom ?? "", email: body.email,
    role: "admin", motDePasse: body.motDePasse,
  });
  const jeton = creerJeton(user.id, user.role);
  return Response.json({ user: toPublicUser(user) }, { headers: { "Set-Cookie": cookieConnexion(jeton) } });
}
