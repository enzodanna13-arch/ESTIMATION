// Normalisation des numéros de téléphone français au format E.164 (+33…),
// exigé par Twilio. Tolère les espaces, points, tirets, parenthèses et les
// préfixes 0033 / +33 / 33. Renvoie null si le numéro est invalide.

export function normaliserTelFr(brut: string | null | undefined): string | null {
  if (!brut) return null;
  // Nettoyage : espaces, points, tirets, parenthèses, séparateurs divers.
  let s = String(brut).trim().replace(/[\s.\-()/]/g, "");
  if (!s) return null;

  if (s.startsWith("+")) {
    // Déjà international : on valide simplement la longueur E.164.
    return /^\+[1-9]\d{7,14}$/.test(s) ? s : null;
  }
  if (s.startsWith("0033")) s = "+" + s.slice(2); // 0033… → +33…
  else if (/^33[1-9]\d{8}$/.test(s)) s = "+" + s; // 33 6 … (sans +)
  else if (/^0[1-9]\d{8}$/.test(s)) s = "+33" + s.slice(1); // 0X XX XX XX XX → +33…
  else return null;

  return /^\+33[1-9]\d{8}$/.test(s) ? s : null;
}

// true si le numéro est un numéro FR valide (mobile ou fixe).
export function estTelValide(brut: string | null | undefined): boolean {
  return normaliserTelFr(brut) !== null;
}

// Affichage lisible « 07 68 39 29 05 » à partir d'un E.164 +33…
export function telAffichage(e164: string | null | undefined): string {
  if (!e164) return "";
  const national = e164.startsWith("+33") ? "0" + e164.slice(3) : e164;
  return /^0\d{9}$/.test(national) ? national.replace(/(\d{2})(?=\d)/g, "$1 ").trim() : e164;
}
