import { userParEmail } from "@/lib/syndic/users";
import { verifyPassword } from "@/lib/syndic/password";
import { cookieConnexion, creerJeton } from "@/lib/syndic/session";
import { toPublicUser } from "@/lib/syndic/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try { body = (await request.json()) as typeof body; } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }
  const email = (body.email ?? "").trim();
  const password = body.password ?? "";
  if (!email || !password) return Response.json({ error: "Email et mot de passe requis" }, { status: 400 });

  const user = await userParEmail(email);
  // Message volontairement identique (compte inexistant / mauvais mot de passe)
  if (!user || !user.actif || !verifyPassword(password, user.passwordSalt, user.passwordHash)) {
    return Response.json({ error: "Identifiants incorrects" }, { status: 401 });
  }
  const jeton = creerJeton(user.id, user.role);
  return Response.json({ user: toPublicUser(user) }, { headers: { "Set-Cookie": cookieConnexion(jeton) } });
}
