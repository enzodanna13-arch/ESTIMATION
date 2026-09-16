import { enregistrer, lister, nouvelId, obtenir, supprimer } from "./store";
import type { ContactSyndic, LotSyndic, Residence } from "./types";

const R = "residences";
const L = "lots";
const C = "contacts";

// --- Résidences -------------------------------------------------------------
export async function listerResidences(): Promise<Residence[]> {
  const rs = await lister<Residence>(R);
  return rs.sort((a, b) => a.nom.localeCompare(b.nom));
}
export const obtenirResidence = (id: string) => obtenir<Residence>(R, id);
export async function residenceParRef(ref: string): Promise<Residence | null> {
  const r = (ref ?? "").trim();
  if (!r) return null;
  return (await lister<Residence>(R)).find((x) => x.refExterne === r) ?? null;
}
export function residenceVide(partial: Partial<Residence>): Residence {
  const now = Date.now();
  return {
    id: nouvelId(), nom: "", adresse: "", codePostal: "", commune: "",
    gestionnaireTitulaireId: null, gestionnaireSuppleantId: null,
    refExterne: "", actif: true, createdAt: now, updatedAt: now, ...partial,
  };
}
export const sauverResidence = (r: Residence) => enregistrer(R, r);
export const supprimerResidence = (id: string) => supprimer(R, id);

// --- Lots -------------------------------------------------------------------
export async function listerLots(residenceId?: string): Promise<LotSyndic[]> {
  const lots = await lister<LotSyndic>(L);
  return residenceId ? lots.filter((l) => l.residenceId === residenceId) : lots;
}
export async function lotParRef(ref: string): Promise<LotSyndic | null> {
  const r = (ref ?? "").trim();
  if (!r) return null;
  return (await lister<LotSyndic>(L)).find((x) => x.refExterne === r) ?? null;
}
export function lotVide(partial: Partial<LotSyndic>): LotSyndic {
  const now = Date.now();
  return {
    id: nouvelId(), residenceId: "", numero: "", batiment: "", etage: "", type: "",
    refExterne: "", createdAt: now, updatedAt: now, ...partial,
  };
}
export const sauverLot = (l: LotSyndic) => enregistrer(L, l);
export const supprimerLot = (id: string) => supprimer(L, id);

// --- Contacts ---------------------------------------------------------------
export async function listerContacts(): Promise<ContactSyndic[]> {
  return lister<ContactSyndic>(C);
}
export async function contactParRef(ref: string): Promise<ContactSyndic | null> {
  const r = (ref ?? "").trim();
  if (!r) return null;
  return (await lister<ContactSyndic>(C)).find((x) => x.refExterne === r) ?? null;
}
export function contactVide(partial: Partial<ContactSyndic>): ContactSyndic {
  const now = Date.now();
  return {
    id: nouvelId(), nom: "", prenom: "", telephone: "", email: "", refExterne: "",
    emailVerifie: false, liens: [], createdAt: now, updatedAt: now, ...partial,
  };
}
export const sauverContact = (c: ContactSyndic) => enregistrer(C, c);
export const supprimerContact = (id: string) => supprimer(C, id);
