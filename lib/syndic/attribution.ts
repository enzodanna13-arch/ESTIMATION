import type { Residence, SyndicUser } from "./types";

// Attribution automatique d'une demande (§7 du cahier des charges). Fonction
// PURE, testée unitairement : à résidence connue, la demande va au gestionnaire
// titulaire ; s'il est absent (dates d'absence) ou inactif, au suppléant ; sinon
// la demande tombe dans la file « à attribuer » (et un email part à l'admin).

export type ResultatAttribution =
  | { file: "assigne"; userId: string; via: "titulaire" | "suppleant" }
  | { file: "a_attribuer"; userId: null; raison: string }
  | { file: "a_qualifier"; userId: null; raison: string };

// Un utilisateur est-il indisponible à la date donnée ? (inactif, ou dans sa
// période d'absence, bornes incluses). `aujourdHui` au format YYYY-MM-DD.
export function estIndisponible(user: SyndicUser | undefined | null, aujourdHui: string): boolean {
  if (!user) return true;
  if (!user.actif) return true;
  if (user.absentDu && user.absentAu) {
    return aujourdHui >= user.absentDu && aujourdHui <= user.absentAu;
  }
  return false;
}

export function choisirGestionnaire(
  residence: Residence | null | undefined,
  usersParId: Map<string, SyndicUser>,
  aujourdHui: string,
): ResultatAttribution {
  if (!residence) {
    return { file: "a_qualifier", userId: null, raison: "Résidence inconnue" };
  }
  const titulaire = residence.gestionnaireTitulaireId ? usersParId.get(residence.gestionnaireTitulaireId) : null;
  if (titulaire && !estIndisponible(titulaire, aujourdHui)) {
    return { file: "assigne", userId: titulaire.id, via: "titulaire" };
  }
  const suppleant = residence.gestionnaireSuppleantId ? usersParId.get(residence.gestionnaireSuppleantId) : null;
  if (suppleant && !estIndisponible(suppleant, aujourdHui)) {
    return { file: "assigne", userId: suppleant.id, via: "suppleant" };
  }
  return {
    file: "a_attribuer",
    userId: null,
    raison: titulaire || suppleant
      ? "Titulaire et suppléant indisponibles"
      : "Ni titulaire ni suppléant définis",
  };
}
