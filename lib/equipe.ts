// Équipe de l'agence — liste de référence des négociateurs et de l'assistante.
// Centralisée ici pour que TOUS les formulaires proposent les mêmes noms
// (saisie cohérente) et que le suivi d'activité regroupe correctement, même
// quand un nom a été saisi de plusieurs façons (« FLECHER Emilie », « emilie
// flecher », « Émilie Flécher »… → une seule et même personne).

export interface Membre {
  id: string;
  nom: string; // libellé affiché ET saisi partout (cohérence de regroupement)
  role: string;
  sections: ("transaction" | "gestion" | "registre")[];
  alias: string[]; // fragments reconnus (sans accents, minuscules) pour consolider les variantes
  prenom?: string; // prénom court (signatures SMS)
  tel?: string; // téléphone du négociateur au format E.164 (+33…), pour les SMS de relance signés
}

export const EQUIPE: Membre[] = [
  { id: "kevin", nom: "Kevin", role: "Gestion locative", sections: ["gestion"], alias: ["kevin"], prenom: "Kevin" },
  { id: "emilie", nom: "Émilie Flécher", role: "Transaction", sections: ["transaction"], alias: ["flecher", "emilie"], prenom: "Émilie", tel: "+33658711643" },
  { id: "lea", nom: "Léa Roussel", role: "Transaction", sections: ["transaction"], alias: ["roussel", "lea"], prenom: "Léa", tel: "+33768267735" },
  { id: "enzo", nom: "Enzo D'anna", role: "Responsable commercial", sections: ["transaction"], alias: ["enzo", "anna", "danna"], prenom: "Enzo" },
  { id: "assistante", nom: "Assistante", role: "Registre des appels", sections: ["registre"], alias: ["assistant"] },
];

// Négociateurs proposés dans les formulaires (transaction + gestion + resp.).
export const NEGOCIATEURS = EQUIPE.filter((m) => m.sections.some((s) => s === "transaction" || s === "gestion")).map((m) => m.nom);

// La personne rattachée au registre des appels
export const ASSISTANTE = EQUIPE.find((m) => m.sections.includes("registre")) ?? null;

// Enlève les accents et normalise (pour comparer les noms saisis)
const strip = (s: string) =>
  (s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// Étiquettes qui ne sont PAS des personnes (sources de leads, valeurs vides…)
const NON_PERSONNES = new Set(["", "-", "n a", "na", "site", "facebook", "instagram", "manuel", "autre", "source", "web", "mail", "email"]);

// Retrouve le membre d'équipe correspondant à un nom saisi (ou null)
export function membreDepuisNom(label?: string): Membre | null {
  const s = strip(label ?? "");
  if (!s) return null;
  for (const m of EQUIPE) if (m.alias.some((a) => s.includes(strip(a)))) return m;
  return null;
}

// true si l'étiquette est une non-personne à ignorer dans le suivi
export function estNonPersonne(label?: string): boolean {
  return NON_PERSONNES.has(strip(label ?? ""));
}

// Téléphone d'un négociateur (E.164, +33…) à partir d'un nom saisi, ou null.
export function telNegociateur(nom?: string): string | null {
  return membreDepuisNom(nom)?.tel ?? null;
}

// Téléphone formaté « 07 68 26 77 35 » (affichage / signature SMS).
export function telNegociateurFormate(nom?: string): string | null {
  const tel = telNegociateur(nom);
  if (!tel) return null;
  const national = tel.startsWith("+33") ? "0" + tel.slice(3) : tel;
  return /^0\d{9}$/.test(national) ? national.replace(/(\d{2})(?=\d)/g, "$1 ").trim() : tel;
}

// Prénom court d'un négociateur pour la signature (ex. « Léa », « Émilie »).
export function prenomNegociateur(nom?: string): string {
  const m = membreDepuisNom(nom);
  return m?.prenom || (nom ?? "").trim().split(/\s+/)[0] || "";
}
