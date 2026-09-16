import { describe, expect, it } from "vitest";
import { choisirGestionnaire, estIndisponible } from "./attribution";
import type { Residence, SyndicUser } from "./types";

const user = (id: string, over: Partial<SyndicUser> = {}): SyndicUser => ({
  id, nom: id, prenom: "", email: `${id}@x`, role: "gestionnaire_syndic", telephoneMobile: "",
  actif: true, absentDu: null, absentAu: null, passwordHash: "", passwordSalt: "",
  createdAt: 0, updatedAt: 0, ...over,
});
const resid = (over: Partial<Residence> = {}): Residence => ({
  id: "r1", nom: "R", adresse: "", codePostal: "", commune: "",
  gestionnaireTitulaireId: null, gestionnaireSuppleantId: null, refExterne: "",
  actif: true, createdAt: 0, updatedAt: 0, ...over,
});
const JOUR = "2026-09-16";

describe("attribution automatique", () => {
  it("va au titulaire disponible", () => {
    const map = new Map([["t", user("t")]]);
    expect(choisirGestionnaire(resid({ gestionnaireTitulaireId: "t" }), map, JOUR))
      .toEqual({ file: "assigne", userId: "t", via: "titulaire" });
  });

  it("bascule sur le suppléant si le titulaire est en absence", () => {
    const t = user("t", { absentDu: "2026-09-10", absentAu: "2026-09-20" });
    const map = new Map([["t", t], ["s", user("s")]]);
    expect(choisirGestionnaire(resid({ gestionnaireTitulaireId: "t", gestionnaireSuppleantId: "s" }), map, JOUR))
      .toEqual({ file: "assigne", userId: "s", via: "suppleant" });
  });

  it("bascule sur le suppléant si le titulaire est inactif", () => {
    const map = new Map([["t", user("t", { actif: false })], ["s", user("s")]]);
    const r = choisirGestionnaire(resid({ gestionnaireTitulaireId: "t", gestionnaireSuppleantId: "s" }), map, JOUR);
    expect(r).toEqual({ file: "assigne", userId: "s", via: "suppleant" });
  });

  it("file « à attribuer » si personne n'est disponible", () => {
    const map = new Map([["t", user("t", { actif: false })]]);
    expect(choisirGestionnaire(resid({ gestionnaireTitulaireId: "t" }), map, JOUR).file).toBe("a_attribuer");
  });

  it("file « à qualifier » si la résidence est inconnue", () => {
    expect(choisirGestionnaire(null, new Map(), JOUR).file).toBe("a_qualifier");
  });

  it("estIndisponible respecte les bornes d'absence (incluses)", () => {
    const u = user("u", { absentDu: "2026-09-10", absentAu: "2026-09-20" });
    expect(estIndisponible(u, "2026-09-09")).toBe(false);
    expect(estIndisponible(u, "2026-09-10")).toBe(true);
    expect(estIndisponible(u, "2026-09-20")).toBe(true);
    expect(estIndisponible(u, "2026-09-21")).toBe(false);
  });
});
