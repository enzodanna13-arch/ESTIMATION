import { enregistrer, lister, nouvelId, obtenir, supprimer } from "./store";
import { hashPassword } from "./password";
import { lireCookieSession } from "./session";
import type { SyndicRole, SyndicUser } from "./types";

const COLL = "utilisateurs";
export const normEmail = (s: string) => (s ?? "").trim().toLowerCase();

export async function listerUsers(): Promise<SyndicUser[]> {
  const users = await lister<SyndicUser>(COLL);
  return users.sort((a, b) => a.nom.localeCompare(b.nom));
}

export async function obtenirUser(id: string): Promise<SyndicUser | null> {
  return obtenir<SyndicUser>(COLL, id);
}

export async function userParEmail(email: string): Promise<SyndicUser | null> {
  const cible = normEmail(email);
  const users = await lister<SyndicUser>(COLL);
  return users.find((u) => normEmail(u.email) === cible) ?? null;
}

export async function compterUsers(): Promise<number> {
  const users = await lister<SyndicUser>(COLL);
  return users.length;
}

export async function creerUser(data: {
  nom: string; prenom: string; email: string; role: SyndicRole;
  telephoneMobile?: string; motDePasse: string;
}): Promise<SyndicUser> {
  const existe = await userParEmail(data.email);
  if (existe) throw new Error("Un utilisateur avec cet email existe déjà");
  const { salt, hash } = hashPassword(data.motDePasse);
  const now = Date.now();
  const user: SyndicUser = {
    id: nouvelId(),
    nom: data.nom.trim(),
    prenom: data.prenom.trim(),
    email: normEmail(data.email),
    role: data.role,
    telephoneMobile: (data.telephoneMobile ?? "").trim(),
    actif: true,
    absentDu: null,
    absentAu: null,
    passwordHash: hash,
    passwordSalt: salt,
    createdAt: now,
    updatedAt: now,
  };
  return enregistrer(COLL, user);
}

export async function majUser(id: string, patch: Partial<Omit<SyndicUser, "id" | "passwordHash" | "passwordSalt">> & { motDePasse?: string }): Promise<SyndicUser | null> {
  const user = await obtenirUser(id);
  if (!user) return null;
  const { motDePasse, email, ...reste } = patch;
  const maj: SyndicUser = { ...user, ...reste };
  if (email !== undefined) {
    const cible = normEmail(email);
    const autre = await userParEmail(cible);
    if (autre && autre.id !== id) throw new Error("Un autre utilisateur utilise déjà cet email");
    maj.email = cible;
  }
  if (motDePasse) {
    const { salt, hash } = hashPassword(motDePasse);
    maj.passwordHash = hash;
    maj.passwordSalt = salt;
  }
  return enregistrer(COLL, maj);
}

export async function supprimerUser(id: string): Promise<void> {
  await supprimer(COLL, id);
}

// Utilisateur courant à partir du cookie de session (ou null). Vérifie que le
// compte existe toujours ET qu'il est actif.
export async function userCourant(request: Request): Promise<SyndicUser | null> {
  const session = lireCookieSession(request);
  if (!session) return null;
  const user = await obtenirUser(session.userId);
  if (!user || !user.actif) return null;
  return user;
}
