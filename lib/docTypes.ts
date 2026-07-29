// Génération de documents : types partagés client/serveur

export type DocType = "annonce" | "crv" | "prospection" | "preetatdate" | "facture" | "compromis";

export const DOC_LABELS: Record<DocType, { titre: string; icone: string; description: string }> = {
  annonce: {
    titre: "Texte d'annonce",
    icone: "📣",
    description: "Annonce complète du bien : titre accrocheur + texte optimisé portails",
  },
  crv: {
    titre: "Compte rendu de visite",
    icone: "🗒️",
    description: "Retour de visite structuré à envoyer au propriétaire",
  },
  prospection: {
    titre: "Courrier de prospection",
    icone: "✉️",
    description: "Courrier ou e-mail de pige pour rentrer des mandats",
  },
  preetatdate: {
    titre: "Devis pré-état daté",
    icone: "📑",
    description: "Pack documents Art. 54 Loi ALUR — courrier au notaire + devis, papier à en-tête",
  },
  facture: {
    titre: "Facture de commission",
    icone: "🧾",
    description: "Honoraires de transaction — modèle exact de l'agence avec RIB",
  },
  compromis: {
    titre: "Demande de compromis au notaire",
    icone: "📨",
    description: "Courrier + pièces vendeur et acquéreur fusionnés en un seul PDF",
  },
};

export interface DocumentInput {
  docType: DocType;
  // Négociateur (signature du document)
  negociateur: string;
  negociateurTel: string;
  negociateurEmail: string;
  negociateurPhoto?: { mediaType: string; data: string } | null; // portrait (courrier de prospection)
  // Le bien (annonce + compte rendu)
  typeBien?: string;
  surface?: number | null;
  nbPieces?: number | null;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  quartier?: string;
  prix?: number | null; // prix affiché (annonce) — ou loyer si location
  dpe?: string;
  atouts?: string; // atouts et équipements, en vrac
  // Compte rendu de visite
  clientNom?: string; // propriétaire destinataire
  dateVisite?: string;
  profilAcquereur?: string;
  pointsAimes?: string;
  objections?: string;
  avisPrix?: string;
  suite?: string; // suite envisagée (2e visite, offre, abandon…)
  // Courrier de prospection
  cible?: string; // destinataire (propriétaire du 12 rue X, habitants du quartier…)
  contexte?: string; // pige : annonce PAP repérée, vente récente dans la rue…
  // Devis pré-état daté (généré sans IA — modèle fixe du syndic)
  notaireNom?: string;
  notaireAdresse1?: string; // n° et voie
  notaireAdresse2?: string; // code postal + ville
  copropriete?: string;
  vosRef?: string; // ex. FABRES/SCI L'ESTAQUE
  numeroLot?: string; // ex. 81 — ou "81 et 82"
  nomDossier?: string; // ex. FABRES (ligne DOSSIER du devis)
  prixHT?: number | null; // prix de la prestation en € HT
  numeroDevis?: string; // ex. DE27072026 (généré depuis la date si vide)
  // Facture de commission (générée sans IA — modèle fixe de l'agence)
  factureNumero?: string; // ex. T28.2025
  factureClientNom?: string; // ex. Monsieur Garibian Paul
  factureClientAdresse?: string; // adresse complète du client facturé
  factureBien?: string; // désignation du bien vendu (optionnel)
  factureNotaire?: string; // ex. DEGRANDI / KEMLER (affiché « Maitre … »)
  commissionTTC?: number | null; // montant de la commission TTC (€)
  factureRef?: string; // réf. de la ligne (ex. initiales du négociateur)
  // Demande de compromis de vente au notaire (générée sans IA)
  compromisObjetBien?: string; // ex. Résidence Le Canal – 13500 Martigues
  compromisBien?: string; // identification du bien vendu (texte libre, lots…)
  compromisVendeurs?: string; // état civil et coordonnées des vendeurs
  compromisAcquereur?: string; // état civil et coordonnées de l'acquéreur
  compromisNotaireVendeur?: string; // nom, étude, adresse, tél, email
  compromisNotaireAcquereur?: string;
  compromisConditions?: string; // une condition par ligne
  compromisPiecesVendeur?: string; // une pièce par ligne
  compromisPiecesAcquereur?: string;
  // Compromis — champs structurés (saisie classique, pré-remplissables par
  // l'IA à partir des pièces PDF)
  cLot?: string; // n° de lot(s) — ancien champ libre (repli)
  cLots?: { numero: string; nature: string }[]; // lots multiples : appartement, cave, garage…
  cBienDescription?: string; // composition du bien (étage, pièces…)
  cTantiemes?: string; // ex. 46/1000èmes des parties communes
  cVendeurNoms?: string; // ancien champ combiné (repli)
  cVendeurM?: string; // Monsieur — nom complet
  cVendeurMme?: string; // Madame — nom complet
  cVendeurMProfession?: string;
  cVendeurMmeProfession?: string;
  cVendeurMNaissance?: string; // né à … le …
  cVendeurMmeNaissance?: string;
  cVendeurProfessions?: string; // repli
  cVendeurAdresse?: string;
  cVendeurNaissances?: string; // repli
  cVendeurTel?: string;
  cVendeurEmail?: string;
  cAcqNom?: string; // ancien champ combiné (repli)
  cAcqM?: string; // Monsieur — nom complet
  cAcqMme?: string; // Madame — nom complet
  cAcqMProfession?: string;
  cAcqMmeProfession?: string;
  cAcqMNaissance?: string;
  cAcqMmeNaissance?: string;
  cAcqNaissance?: string; // repli
  cAcqProfession?: string; // repli
  cAcqAdresse?: string;
  cAcqTel?: string;
  cAcqEmail?: string;
  cNotVNom?: string; // Maître …
  cNotVEtude?: string;
  cNotVAdresse?: string;
  cNotVTel?: string;
  cNotVEmail?: string;
  cNotANom?: string;
  cNotAEtude?: string;
  cNotAAdresse?: string;
  cNotATel?: string;
  cNotAEmail?: string;
  cPrixVente?: number | null; // € frais d'agence inclus
  cHonoraires?: number | null; // € TTC
  cPaiement?: string; // Paiement comptant / prêt…
  cCondSuspensive?: string;
  // Toutes missions
  instructionsIA?: string;
}

export interface DocumentBloc {
  titre?: string;
  texte?: string; // paragraphes séparés par \n
  items?: string[];
}

export interface DocumentResult {
  titre: string; // titre du document
  objet?: string; // objet (courriers)
  blocs: DocumentBloc[];
}
