import { userCourant } from "./users";
import { aLeDroit, type Capacite } from "./permissions";
import type { SyndicUser } from "./types";

// Garde d'accès serveur pour les routes /api/syndic/*. Renvoie l'utilisateur si
// la session est valide ET (si `cap` fourni) que son rôle possède le droit ;
// sinon une réponse d'erreur prête à retourner. Le cloisonnement est ainsi
// TOUJOURS appliqué côté serveur, jamais seulement masqué dans l'interface.

export async function garde(
  request: Request,
  cap?: Capacite,
): Promise<{ user: SyndicUser } | { erreur: Response }> {
  const user = await userCourant(request);
  if (!user) {
    return { erreur: Response.json({ error: "Connexion requise" }, { status: 401 }) };
  }
  if (cap && !aLeDroit(user.role, cap)) {
    return { erreur: Response.json({ error: "Accès non autorisé pour votre rôle" }, { status: 403 }) };
  }
  return { user };
}
