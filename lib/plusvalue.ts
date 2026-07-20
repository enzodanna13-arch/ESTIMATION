/**
 * Calcul de la plus-value immobilière (résidence NON principale, régime des
 * particuliers) — calcul indicatif conforme aux règles fiscales en vigueur :
 *   - plus-value brute = prix de vente − prix d'acquisition corrigé
 *     (prix d'achat + frais d'acquisition réels ou forfait 7,5 % + travaux
 *     réels ou forfait 15 % si détention ≥ 5 ans)
 *   - abattements pour durée de détention :
 *       IR (19 %)  : 6 %/an de la 6e à la 21e année, +4 % la 22e
 *                    → exonération totale à 22 ans
 *       PS (17,2 %): 1,65 %/an de la 6e à la 21e, +1,60 % la 22e,
 *                    +9 %/an de la 23e à la 30e → exonération à 30 ans
 *   - surtaxe progressive (2 à 6 %) sur la plus-value imposable IR > 50 000 €
 */

export interface PlusValueDetail {
  prixVente: number;
  prixAcquisition: number;
  fraisAcquisition: number;
  forfaitFrais: boolean; // frais retenus au forfait de 7,5 %
  travaux: number;
  forfaitTravaux: boolean; // travaux retenus au forfait de 15 %
  prixAcquisitionCorrige: number;
  dureeDetention: number; // années pleines
  plusValueBrute: number;
  abattementIRPct: number;
  abattementPSPct: number;
  baseIR: number; // plus-value imposable à l'IR après abattement
  basePS: number; // plus-value imposable aux PS après abattement
  impotIR: number; // 19 %
  impotPS: number; // 17,2 %
  surtaxe: number; // taxe sur les plus-values élevées (> 50 000 €)
  impotTotal: number;
  netVendeur: number;
  exonereIR: boolean;
  exonerePS: boolean;
}

function abattementIR(d: number): number {
  if (d < 6) return 0;
  if (d >= 22) return 100;
  return 6 * (d - 5);
}

function abattementPS(d: number): number {
  if (d < 6) return 0;
  if (d >= 30) return 100;
  let a = 1.65 * (Math.min(d, 21) - 5);
  if (d >= 22) a += 1.6;
  if (d > 22) a += 9 * (Math.min(d, 30) - 22);
  return Math.min(a, 100);
}

/** Barème officiel (avec lissage) de la taxe sur les plus-values > 50 000 €. */
function surtaxePlusValue(pv: number): number {
  if (pv <= 50000) return 0;
  if (pv <= 60000) return Math.max(0, 0.02 * pv - (60000 - pv) * (1 / 20));
  if (pv <= 100000) return 0.02 * pv;
  if (pv <= 110000) return 0.03 * pv - (110000 - pv) * (1 / 10);
  if (pv <= 150000) return 0.03 * pv;
  if (pv <= 160000) return 0.04 * pv - (160000 - pv) * (15 / 100);
  if (pv <= 200000) return 0.04 * pv;
  if (pv <= 210000) return 0.05 * pv - (210000 - pv) * (20 / 100);
  if (pv <= 250000) return 0.05 * pv;
  if (pv <= 260000) return 0.06 * pv - (260000 - pv) * (25 / 100);
  return 0.06 * pv;
}

export function calculPlusValue(
  prixVente: number,
  prixAcquisition: number,
  anneeAcquisition: number,
  fraisReels: number | null | undefined,
  travauxReels: number | null | undefined,
  anneeVente: number,
): PlusValueDetail | null {
  if (prixVente <= 0 || prixAcquisition <= 0 || anneeAcquisition <= 1900) return null;
  const duree = Math.max(0, anneeVente - anneeAcquisition);

  // Frais d'acquisition : réels s'ils sont renseignés, sinon forfait 7,5 %
  const forfaitFrais = !(fraisReels && fraisReels > 0);
  const frais = forfaitFrais ? Math.round(prixAcquisition * 0.075) : Math.round(fraisReels!);
  // Travaux : réels s'ils sont renseignés ; forfait 15 % possible dès 5 ans
  // de détention (on retient le plus favorable au vendeur)
  const forfait15 = duree >= 5 ? Math.round(prixAcquisition * 0.15) : 0;
  const travauxSaisis = travauxReels && travauxReels > 0 ? Math.round(travauxReels) : 0;
  const travaux = Math.max(forfait15, travauxSaisis);
  const forfaitTravaux = travaux === forfait15 && forfait15 > 0 && forfait15 >= travauxSaisis;

  const prixCorrige = prixAcquisition + frais + travaux;
  const pvBrute = Math.max(0, Math.round(prixVente - prixCorrige));

  const abIR = abattementIR(duree);
  const abPS = abattementPS(duree);
  const baseIR = Math.round(pvBrute * (1 - abIR / 100));
  const basePS = Math.round(pvBrute * (1 - abPS / 100));
  const impotIR = Math.round(baseIR * 0.19);
  const impotPS = Math.round(basePS * 0.172);
  const surtaxe = Math.round(surtaxePlusValue(baseIR));
  const impotTotal = impotIR + impotPS + surtaxe;

  return {
    prixVente,
    prixAcquisition,
    fraisAcquisition: frais,
    forfaitFrais,
    travaux,
    forfaitTravaux,
    prixAcquisitionCorrige: prixCorrige,
    dureeDetention: duree,
    plusValueBrute: pvBrute,
    abattementIRPct: Math.round(abIR * 100) / 100,
    abattementPSPct: Math.round(abPS * 100) / 100,
    baseIR,
    basePS,
    impotIR,
    impotPS,
    surtaxe,
    impotTotal,
    netVendeur: prixVente - impotTotal,
    exonereIR: abIR >= 100,
    exonerePS: abPS >= 100,
  };
}
