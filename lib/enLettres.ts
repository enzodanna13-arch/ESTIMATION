// Conversion d'un montant entier en toutes lettres (français), pour les
// mentions « ...... (montant €) » du mandat de vente.

const UNITES = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
const DIZAINES = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante", "quatre-vingt", "quatre-vingt"];

function centaines(n: number): string {
  if (n === 0) return "";
  if (n < 20) return UNITES[n];
  if (n < 100) {
    const d = Math.floor(n / 10);
    const u = n % 10;
    if (d === 7 || d === 9) {
      const base = DIZAINES[d];
      const reste = 10 + u;
      return (u === 1 && d === 7 ? `${base} et onze` : `${base}-${UNITES[reste]}`).replace("quatre-vingt-dix", "quatre-vingt-dix");
    }
    let mot = DIZAINES[d];
    if (u === 1 && d !== 8) mot += " et un";
    else if (u > 0) mot += `-${UNITES[u]}`;
    if (d === 8 && u === 0) mot += "s";
    return mot;
  }
  const c = Math.floor(n / 100);
  const reste = n % 100;
  let mot = c === 1 ? "cent" : `${UNITES[c]} cent`;
  if (reste === 0 && c > 1) mot += "s";
  if (reste > 0) mot += ` ${centaines(reste)}`;
  return mot;
}

export function montantEnLettres(valeur: number): string {
  const n = Math.floor(Math.abs(valeur));
  if (n === 0) return "zéro euro";
  const parts: string[] = [];
  const millions = Math.floor(n / 1_000_000);
  const milliers = Math.floor((n % 1_000_000) / 1000);
  const reste = n % 1000;
  if (millions > 0) parts.push(millions === 1 ? "un million" : `${centaines(millions)} millions`);
  if (milliers > 0) parts.push(milliers === 1 ? "mille" : `${centaines(milliers)} mille`);
  if (reste > 0) parts.push(centaines(reste));
  const mots = parts.join(" ").trim();
  return `${mots} euro${n > 1 ? "s" : ""}`;
}
