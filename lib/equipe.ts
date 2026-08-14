// Équipe de l'agence — liste de référence des négociateurs et de l'assistante.
// Centralisée ici pour que TOUS les formulaires proposent les mêmes noms
// (saisie cohérente) et que le suivi d'activité regroupe correctement.

export interface Membre {
  id: string;
  nom: string; // libellé affiché ET saisi partout (cohérence de regroupement)
  role: string;
  // Sections où la personne intervient
  sections: ("transaction" | "gestion" | "registre")[];
}

export const EQUIPE: Membre[] = [
  { id: "kevin", nom: "Kevin", role: "Gestion locative", sections: ["gestion"] },
  { id: "emilie", nom: "Émilie Flécher", role: "Transaction", sections: ["transaction"] },
  { id: "lea", nom: "Léa Roussel", role: "Transaction", sections: ["transaction"] },
  { id: "assistante", nom: "Assistante", role: "Registre des appels", sections: ["registre"] },
];

// Négociateurs (transaction + gestion) — proposés dans les formulaires
// (estimations, documents, leads, dossiers, destinataire d'un appel…).
export const NEGOCIATEURS = EQUIPE.filter((m) => m.sections.some((s) => s === "transaction" || s === "gestion")).map((m) => m.nom);

// La personne rattachée au registre des appels
export const ASSISTANTE = EQUIPE.find((m) => m.sections.includes("registre")) ?? null;
