import { describe, expect, it } from "vitest";
import { aLeDroit, estAdmin, peutAccederSyndic, type Capacite } from "./permissions";

const CAPS: Capacite[] = ["acceder", "administrer", "creer_ticket", "traiter_ticket", "qualifier"];

describe("permissions par rôle (cloisonnement)", () => {
  it("admin a tous les droits", () => {
    for (const cap of CAPS) expect(aLeDroit("admin", cap)).toBe(true);
  });

  it("accueil : accès, créer et qualifier — mais ni administrer ni traiter", () => {
    expect(aLeDroit("accueil", "acceder")).toBe(true);
    expect(aLeDroit("accueil", "creer_ticket")).toBe(true);
    expect(aLeDroit("accueil", "qualifier")).toBe(true);
    expect(aLeDroit("accueil", "administrer")).toBe(false);
    expect(aLeDroit("accueil", "traiter_ticket")).toBe(false);
  });

  it("gestionnaire : traiter les demandes — mais ni administrer ni qualifier", () => {
    expect(aLeDroit("gestionnaire_syndic", "acceder")).toBe(true);
    expect(aLeDroit("gestionnaire_syndic", "traiter_ticket")).toBe(true);
    expect(aLeDroit("gestionnaire_syndic", "administrer")).toBe(false);
    expect(aLeDroit("gestionnaire_syndic", "qualifier")).toBe(false);
  });

  it("un utilisateur SANS rôle syndic (module estimation) n'a aucun droit", () => {
    expect(peutAccederSyndic(null)).toBe(false);
    expect(peutAccederSyndic(undefined)).toBe(false);
    expect(estAdmin(null)).toBe(false);
    for (const cap of CAPS) expect(aLeDroit(null, cap)).toBe(false);
  });
});
