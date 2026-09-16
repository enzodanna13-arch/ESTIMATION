import type { SyndicRole } from "./types";

// Permissions par rôle — vérifiées CÔTÉ SERVEUR sur chaque route. Fonctions
// pures (testées unitairement). Un utilisateur du module Estimation n'a pas de
// session Syndic : il n'obtient donc aucun de ces droits.

export const estAdmin = (role: SyndicRole | null | undefined): boolean => role === "admin";

// Accès en lecture au module Syndic (n'importe quel rôle syndic authentifié).
export const peutAccederSyndic = (role: SyndicRole | null | undefined): boolean =>
  role === "accueil" || role === "gestionnaire_syndic" || role === "admin";

// Administration (utilisateurs, résidences, import CSV, paramètres) : admin seul.
export const peutAdministrer = (role: SyndicRole | null | undefined): boolean => estAdmin(role);

// Créer une demande (ticket) : accueil, gestionnaire ou admin.
export const peutCreerTicket = (role: SyndicRole | null | undefined): boolean => peutAccederSyndic(role);

// Traiter/commenter/clore une demande : gestionnaire ou admin (pas l'accueil).
export const peutTraiterTicket = (role: SyndicRole | null | undefined): boolean =>
  role === "gestionnaire_syndic" || role === "admin";

// Voir la file « à qualifier » (résidence inconnue) : accueil et admin.
export const peutQualifier = (role: SyndicRole | null | undefined): boolean =>
  role === "accueil" || role === "admin";

// Un rôle a-t-il le droit demandé ? (table centrale, pratique pour les tests)
export type Capacite =
  | "acceder" | "administrer" | "creer_ticket" | "traiter_ticket" | "qualifier";

export function aLeDroit(role: SyndicRole | null | undefined, cap: Capacite): boolean {
  switch (cap) {
    case "acceder": return peutAccederSyndic(role);
    case "administrer": return peutAdministrer(role);
    case "creer_ticket": return peutCreerTicket(role);
    case "traiter_ticket": return peutTraiterTicket(role);
    case "qualifier": return peutQualifier(role);
    default: return false;
  }
}
