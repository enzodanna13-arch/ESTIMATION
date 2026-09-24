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
  email?: string; // email pro (flyers de prospection)
  photo?: string; // portrait recadré (visage) pour estimations, flyers…
  photoFull?: string; // visuel de marque complet (portrait entier CENTURY 21)
}

export const EQUIPE: Membre[] = [
  { id: "kevin", nom: "Kevin", role: "Gestion locative", sections: ["gestion"], alias: ["kevin"], prenom: "Kevin" },
  { id: "emilie", nom: "Émilie Flécher", role: "Transaction", sections: ["transaction"], alias: ["flecher", "emilie"], prenom: "Émilie", tel: "+33658711643", email: "emilie.flecher@century21.fr", photo: "/negociateurs/emilie.jpg", photoFull: "/negociateurs/emilie-full.jpg" },
  { id: "lea", nom: "Léa Roussel", role: "Transaction", sections: ["transaction"], alias: ["roussel", "lea"], prenom: "Léa", tel: "+33768267735", email: "lea.roussel@century21.fr", photo: "/negociateurs/lea.jpg", photoFull: "/negociateurs/lea-full.jpg" },
  { id: "anthony", nom: "Anthony Voilliard", role: "Transaction", sections: ["transaction"], alias: ["voilliard", "anthony"], prenom: "Anthony", tel: "+33614335947", email: "anthony.voilliard@century21.fr", photo: "/negociateurs/anthony.jpg", photoFull: "/negociateurs/anthony-full.jpg" },
  { id: "lucie", nom: "Lucie Borja", role: "Transaction", sections: ["transaction"], alias: ["borja", "lucie"], prenom: "Lucie", tel: "+33628943868", email: "lucie.borja@century21.fr", photo: "/negociateurs/lucie.jpg", photoFull: "/negociateurs/lucie-full.jpg" },
  { id: "enzo", nom: "Enzo D'anna", role: "Responsable commercial", sections: ["transaction"], alias: ["enzo", "anna", "danna"], prenom: "Enzo", tel: "+33442428085", email: "enzo.danna@century21.fr" },
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

// Portrait (visage recadré) d'un négociateur à partir d'un nom saisi, ou "".
export function photoNegociateur(nom?: string): string {
  return membreDepuisNom(nom)?.photo ?? "";
}

// Email pro d'un négociateur à partir d'un nom saisi, ou "".
export function emailNegociateur(nom?: string): string {
  return membreDepuisNom(nom)?.email ?? "";
}

// Coordonnées communes de l'agence (flyers, pieds de page).
export const AGENCE = {
  nom: "CENTURY 21 Icaza Immobilier",
  ville: "Martigues",
  tel: "04 42 42 80 85",
  adresse: "32 avenue de la Paix, 13500 Martigues",
  site: "century21icazaimmobilier.fr",
  estimationUrl: "https://www.century21icazaimmobilier.fr/estimation",
} as const;
