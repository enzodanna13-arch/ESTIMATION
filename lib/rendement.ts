import type { PropertyInput } from "./types";

/**
 * Mission « bien loué » : le prix est fixé par capitalisation du loyer NET
 * annuel à une rentabilité nette comprise entre 6 et 8 %.
 *   - Vente rapide  = loyer net ÷ 8 %  (le prix qui attire immédiatement
 *     les investisseurs)
 *   - Prix optimal  = loyer net ÷ 6 %  (le haut de fourchette défendable)
 */
export const RENDEMENT_NET_HAUT = 0.08; // borne basse de prix
export const RENDEMENT_NET_MEDIAN = 0.07;
export const RENDEMENT_NET_BAS = 0.06; // borne haute de prix

/** Loyer net annuel = loyer × 12 − charges non récupérables − taxe foncière. */
export function loyerNetAnnuel(input: PropertyInput): number {
  const brut = (input.loyerActuel ?? 0) * 12;
  if (brut <= 0) return 0;
  const charges = (input.chargesNonRecuperables ?? 0) + (input.taxeFonciere ?? 0);
  return Math.max(0, Math.round(brut - charges));
}

/** Prix par capitalisation du loyer net, arrondi VERS LE BAS au millier. */
export function prixParRendement(net: number, taux: number): number {
  if (net <= 0 || taux <= 0) return 0;
  return Math.floor(net / taux / 1000) * 1000;
}
