// Génération de documents : types partagés client/serveur

export type DocType = "annonce" | "crv" | "prospection" | "preetatdate";

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
};

export interface DocumentInput {
  docType: DocType;
  // Négociateur (signature du document)
  negociateur: string;
  negociateurTel: string;
  negociateurEmail: string;
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
