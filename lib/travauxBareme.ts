// Barème de coûts travaux « France 2025 » + types du dossier travaux.
// Fichier PARTAGÉ client/serveur : aucune dépendance Vercel Blob ici, pour
// qu'il puisse être importé aussi bien dans les composants que dans les routes.
//
// Les prix sont des ORDRES DE GRANDEUR fourniture + pose, TTC, observés en
// France en 2024-2025 pour de la rénovation de logement. Ils servent de point
// de départ : le négociateur ajuste chaque ligne (quantité ET prix unitaire)
// sur le dossier, ou saisit ses propres prix artisans.

export type UniteTravaux = "m²" | "ml" | "u" | "forfait" | "h" | "m³";

export interface PosteBareme {
  id: string;
  categorie: string;
  libelle: string;
  unite: UniteTravaux;
  bas: number; // €/unité (bas de fourchette)
  moyen: number; // €/unité (valeur conseillée par défaut)
  haut: number; // €/unité (haut de fourchette)
  aide?: string; // ce que couvre le poste
}

// ~55 postes couvrant la rénovation courante d'un logement.
export const POSTES_TRAVAUX: PosteBareme[] = [
  // Préparation / démolition
  { id: "demo-cloison", categorie: "Préparation & dépose", libelle: "Dépose de cloison", unite: "m²", bas: 30, moyen: 55, haut: 90, aide: "Démolition + évacuation d'une cloison non porteuse" },
  { id: "depose-sol", categorie: "Préparation & dépose", libelle: "Dépose de revêtement de sol", unite: "m²", bas: 10, moyen: 18, haut: 30 },
  { id: "depose-cuisine", categorie: "Préparation & dépose", libelle: "Dépose d'une cuisine existante", unite: "forfait", bas: 300, moyen: 600, haut: 1000 },
  { id: "depose-sdb", categorie: "Préparation & dépose", libelle: "Dépose d'une salle de bain existante", unite: "forfait", bas: 400, moyen: 800, haut: 1400 },
  { id: "benne", categorie: "Préparation & dépose", libelle: "Évacuation gravats (benne)", unite: "forfait", bas: 180, moyen: 350, haut: 600 },

  // Plâtrerie / isolation
  { id: "cloison-placo", categorie: "Plâtrerie & isolation", libelle: "Cloison placo (fourni + posé)", unite: "m²", bas: 45, moyen: 65, haut: 95 },
  { id: "doublage", categorie: "Plâtrerie & isolation", libelle: "Doublage isolant de mur", unite: "m²", bas: 45, moyen: 70, haut: 100 },
  { id: "faux-plafond", categorie: "Plâtrerie & isolation", libelle: "Faux plafond placo", unite: "m²", bas: 40, moyen: 60, haut: 90 },
  { id: "iso-combles", categorie: "Plâtrerie & isolation", libelle: "Isolation des combles", unite: "m²", bas: 25, moyen: 42, haut: 65 },
  { id: "iso-iti", categorie: "Plâtrerie & isolation", libelle: "Isolation murs par l'intérieur (ITI)", unite: "m²", bas: 50, moyen: 75, haut: 110 },
  { id: "iso-ite", categorie: "Plâtrerie & isolation", libelle: "Isolation murs par l'extérieur (ITE)", unite: "m²", bas: 120, moyen: 180, haut: 260 },

  // Peinture & revêtements muraux
  { id: "enduit-lissage", categorie: "Peinture & murs", libelle: "Enduit de lissage / rebouchage", unite: "m²", bas: 10, moyen: 18, haut: 28 },
  { id: "peinture-mp", categorie: "Peinture & murs", libelle: "Peinture murs + plafonds (2 couches)", unite: "m²", bas: 25, moyen: 35, haut: 48, aide: "Surface peinte (murs + plafond), préparation légère incluse" },
  { id: "peinture-mur", categorie: "Peinture & murs", libelle: "Peinture murs seuls", unite: "m²", bas: 18, moyen: 28, haut: 40 },
  { id: "papier-peint", categorie: "Peinture & murs", libelle: "Pose papier peint / toile de verre", unite: "m²", bas: 20, moyen: 32, haut: 48 },
  { id: "peinture-boiserie", categorie: "Peinture & murs", libelle: "Peinture boiseries / portes", unite: "u", bas: 40, moyen: 70, haut: 120 },

  // Sols
  { id: "ragreage", categorie: "Sols", libelle: "Ragréage / préparation support", unite: "m²", bas: 18, moyen: 28, haut: 40 },
  { id: "sol-stratifie", categorie: "Sols", libelle: "Parquet stratifié (fourni + posé)", unite: "m²", bas: 35, moyen: 55, haut: 80 },
  { id: "sol-contrecolle", categorie: "Sols", libelle: "Parquet contrecollé (fourni + posé)", unite: "m²", bas: 70, moyen: 100, haut: 140 },
  { id: "sol-carrelage", categorie: "Sols", libelle: "Carrelage sol (fourni + posé)", unite: "m²", bas: 55, moyen: 85, haut: 130 },
  { id: "sol-pvc", categorie: "Sols", libelle: "Sol PVC / lino (fourni + posé)", unite: "m²", bas: 28, moyen: 45, haut: 65 },
  { id: "sol-moquette", categorie: "Sols", libelle: "Moquette (fournie + posée)", unite: "m²", bas: 25, moyen: 40, haut: 60 },

  // Cuisine
  { id: "cuisine-eco", categorie: "Cuisine", libelle: "Cuisine équipée entrée de gamme", unite: "forfait", bas: 3500, moyen: 5000, haut: 7000, aide: "Meubles + pose, hors électroménager haut de gamme" },
  { id: "cuisine-moyen", categorie: "Cuisine", libelle: "Cuisine équipée milieu de gamme", unite: "forfait", bas: 7000, moyen: 10000, haut: 14000 },
  { id: "cuisine-haut", categorie: "Cuisine", libelle: "Cuisine équipée haut de gamme", unite: "forfait", bas: 14000, moyen: 20000, haut: 30000 },
  { id: "plan-travail", categorie: "Cuisine", libelle: "Plan de travail (fourni + posé)", unite: "ml", bas: 150, moyen: 320, haut: 650 },

  // Salle de bain / sanitaires
  { id: "sdb-complete", categorie: "Salle de bain", libelle: "Rénovation complète salle de bain", unite: "forfait", bas: 6000, moyen: 9000, haut: 13000, aide: "Plomberie + faïence + sanitaires + meuble, pièce standard" },
  { id: "douche-italienne", categorie: "Salle de bain", libelle: "Douche à l'italienne (fournie + posée)", unite: "forfait", bas: 2500, moyen: 3800, haut: 5500 },
  { id: "baignoire", categorie: "Salle de bain", libelle: "Baignoire + pose", unite: "u", bas: 1000, moyen: 1800, haut: 3000 },
  { id: "meuble-vasque", categorie: "Salle de bain", libelle: "Meuble vasque (fourni + posé)", unite: "u", bas: 400, moyen: 900, haut: 1600 },
  { id: "wc", categorie: "Salle de bain", libelle: "WC (fourni + posé)", unite: "u", bas: 300, moyen: 550, haut: 900 },
  { id: "wc-suspendu", categorie: "Salle de bain", libelle: "WC suspendu + bâti-support", unite: "u", bas: 600, moyen: 1000, haut: 1600 },
  { id: "faience", categorie: "Salle de bain", libelle: "Faïence murale (fournie + posée)", unite: "m²", bas: 50, moyen: 80, haut: 120 },

  // Électricité
  { id: "elec-complete", categorie: "Électricité", libelle: "Rénovation électrique complète (mise aux normes)", unite: "m²", bas: 90, moyen: 110, haut: 140, aide: "Par m² habitable, tableau + réseau + appareillage" },
  { id: "tableau-elec", categorie: "Électricité", libelle: "Tableau électrique (remplacement)", unite: "forfait", bas: 800, moyen: 1300, haut: 2000 },
  { id: "point-elec", categorie: "Électricité", libelle: "Point lumineux / prise supplémentaire", unite: "u", bas: 80, moyen: 120, haut: 180 },

  // Plomberie / chauffage
  { id: "plomberie-reno", categorie: "Plomberie & chauffage", libelle: "Rénovation réseau plomberie", unite: "m²", bas: 55, moyen: 80, haut: 110, aide: "Par m² habitable concerné" },
  { id: "chauffe-eau", categorie: "Plomberie & chauffage", libelle: "Chauffe-eau électrique (fourni + posé)", unite: "u", bas: 600, moyen: 1000, haut: 1600 },
  { id: "radiateur-elec", categorie: "Plomberie & chauffage", libelle: "Radiateur électrique (fourni + posé)", unite: "u", bas: 300, moyen: 550, haut: 900 },
  { id: "radiateur-eau", categorie: "Plomberie & chauffage", libelle: "Radiateur à eau (fourni + posé)", unite: "u", bas: 400, moyen: 700, haut: 1100 },
  { id: "chaudiere-gaz", categorie: "Plomberie & chauffage", libelle: "Chaudière gaz à condensation", unite: "forfait", bas: 3500, moyen: 5000, haut: 7000 },
  { id: "pac", categorie: "Plomberie & chauffage", libelle: "Pompe à chaleur air/eau", unite: "forfait", bas: 10000, moyen: 13000, haut: 17000 },
  { id: "plancher-chauffant", categorie: "Plomberie & chauffage", libelle: "Plancher chauffant", unite: "m²", bas: 60, moyen: 85, haut: 115 },

  // Menuiseries
  { id: "fenetre-pvc", categorie: "Menuiseries", libelle: "Fenêtre PVC double vitrage (fournie + posée)", unite: "u", bas: 400, moyen: 650, haut: 950 },
  { id: "fenetre-alu", categorie: "Menuiseries", libelle: "Fenêtre alu double vitrage (fournie + posée)", unite: "u", bas: 600, moyen: 950, haut: 1400 },
  { id: "baie", categorie: "Menuiseries", libelle: "Baie vitrée / porte-fenêtre", unite: "u", bas: 900, moyen: 1600, haut: 2600 },
  { id: "porte-entree", categorie: "Menuiseries", libelle: "Porte d'entrée (fournie + posée)", unite: "u", bas: 1200, moyen: 2200, haut: 3800 },
  { id: "porte-interieure", categorie: "Menuiseries", libelle: "Porte intérieure (fournie + posée)", unite: "u", bas: 200, moyen: 380, haut: 650 },
  { id: "volet-roulant", categorie: "Menuiseries", libelle: "Volet roulant (fourni + posé)", unite: "u", bas: 400, moyen: 650, haut: 1000 },

  // Extérieur / gros œuvre (maison)
  { id: "toiture", categorie: "Extérieur & gros œuvre", libelle: "Réfection de toiture", unite: "m²", bas: 120, moyen: 180, haut: 260 },
  { id: "ravalement", categorie: "Extérieur & gros œuvre", libelle: "Ravalement de façade", unite: "m²", bas: 40, moyen: 75, haut: 120 },
  { id: "terrasse", categorie: "Extérieur & gros œuvre", libelle: "Terrasse (dalle / carrelage extérieur)", unite: "m²", bas: 60, moyen: 110, haut: 180 },

  // Divers
  { id: "mo-generale", categorie: "Divers", libelle: "Main d'œuvre générale", unite: "h", bas: 35, moyen: 45, haut: 60 },
  { id: "nettoyage", categorie: "Divers", libelle: "Nettoyage de fin de chantier", unite: "forfait", bas: 200, moyen: 400, haut: 800 },
];

export const CATEGORIES_TRAVAUX: string[] = Array.from(new Set(POSTES_TRAVAUX.map((p) => p.categorie)));

export const posteParId = (id: string): PosteBareme | undefined => POSTES_TRAVAUX.find((p) => p.id === id);

// ---- Types du dossier travaux ----

export interface PhotoTravaux {
  id: string;
  nom: string;
  piece: string; // pièce concernée (ex. « Séjour », « Cuisine »)
  etat: string; // état constaté (saisi ou proposé par l'IA)
  legendeAvant: string; // légende de la photo d'origine
  legendeApres: string; // description étayée de l'état APRÈS travaux (projection texte)
  addedAt: number;
}

export interface LigneTravaux {
  id: string;
  piece: string; // pièce / zone concernée
  posteId: string; // réf. barème, "" si ligne libre
  libelle: string; // descriptif de la ligne
  unite: UniteTravaux;
  quantite: number;
  prixUnitaire: number; // €/unité (pré-rempli au barème, ajustable)
}

export interface DossierTravaux {
  id: string;
  reference: string;
  // Bien concerné
  adresse: string;
  codePostal: string;
  ville: string;
  typeBien: string;
  surface: number | null;
  nbPieces: number | null;
  // Interlocuteurs
  clientNom: string;
  negociateur: string;
  // Contenu du dossier
  contexte: string; // objectif (remise en état avant vente, valorisation, mise aux normes…)
  syntheseIA: string; // synthèse générale des travaux
  photos: PhotoTravaux[];
  lignes: LigneTravaux[];
  margeAlea: number; // % d'imprévus/aléas ajouté au sous-total
  createdAt: number;
  updatedAt: number;
}

// Total d'une ligne, arrondi à l'euro.
export const totalLigne = (l: { quantite: number; prixUnitaire: number }): number =>
  Math.round((Number(l.quantite) || 0) * (Number(l.prixUnitaire) || 0));

// Sous-total, aléas et total TTC d'un ensemble de lignes.
export function chiffrage(lignes: LigneTravaux[], margeAlea = 0): { sousTotal: number; aleas: number; total: number } {
  const sousTotal = lignes.reduce((s, l) => s + totalLigne(l), 0);
  const aleas = Math.round((sousTotal * (Number(margeAlea) || 0)) / 100);
  return { sousTotal, aleas, total: sousTotal + aleas };
}
