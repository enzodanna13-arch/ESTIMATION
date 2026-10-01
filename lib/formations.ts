// Contenu du centre de formation interne (transaction immobilière).
// Chaque module regroupe des leçons et un quiz. Le contenu est rédigé en
// « markdown léger » : "## " = sous-titre, "- " = puce, **gras** inline.
// Objectif : montée en compétence des négociateurs (commercial + cadre légal).

export interface QuizItem {
  question: string;
  options: string[];
  correct: number; // index de la bonne réponse
  explication: string;
}

export interface Lecon {
  titre: string;
  contenu: string[]; // paragraphes (markdown léger)
}

export interface ModuleFormation {
  id: string;
  titre: string;
  icone: string;
  categorie: "Commercial" | "Juridique";
  resume: string;
  duree: string; // durée de lecture estimée
  lecons: Lecon[];
  quiz: QuizItem[];
}

export const MODULES_FORMATION: ModuleFormation[] = [
  {
    id: "prospection",
    titre: "Prospection & pige",
    icone: "🎯",
    categorie: "Commercial",
    resume: "Construire un flux régulier de mandats : pige, phoning, terrain et suivi.",
    duree: "12 min",
    lecons: [
      {
        titre: "Les piliers de la prospection",
        contenu: [
          "La prospection est le moteur de l'activité : **pas de prospection, pas de mandats**. Un négociateur performant y consacre un temps fixe et non négociable chaque jour.",
          "## Les 4 sources de biens",
          "- **La pige** : repérer les annonces de particuliers (PAP) et d'agences sur votre secteur.",
          "- **Le terrain** : porte-à-porte, boîtage, contact des commerçants et gardiens.",
          "- **Votre réseau** : anciens clients, recommandations, votre « base de données chaude ».",
          "- **Les leads entrants** : estimations en ligne, demandes web — à rappeler **dans l'heure**.",
          "## La règle d'or",
          "Un bien sur deux se vend grâce au premier agent qui appelle le vendeur. La **vitesse de réaction** prime sur tout le reste.",
        ],
      },
      {
        titre: "Réussir sa pige téléphonique",
        contenu: [
          "La pige consiste à appeler les particuliers qui vendent seuls pour décrocher un rendez-vous d'estimation.",
          "## Structure d'un appel de pige",
          "- **Accroche** : « Bonjour, je vous appelle au sujet de votre maison à Martigues, elle est toujours disponible ? »",
          "- **Questionnement** : depuis quand est-elle en vente ? Avez-vous déjà des visites ? Pourquoi vendez-vous seul ?",
          "- **Création de valeur** : « J'ai peut-être déjà des acquéreurs sur votre secteur. »",
          "- **Objectif unique** : obtenir le **rendez-vous**, pas vendre vos services au téléphone.",
          "## Gérer les objections",
          "« Je vends seul » → « Beaucoup de vendeurs commencent ainsi ; acceptez juste que je passe estimer, sans engagement. » L'objectif est le **pied dans la porte**.",
        ],
      },
      {
        titre: "Travailler son secteur",
        contenu: [
          "Un négociateur qui **domine un secteur** devient la référence : les vendeurs l'appellent spontanément.",
          "- **Pilonnage** : repassez régulièrement sur la même zone (boîtage, flyers, visites de courtoisie).",
          "- **Notoriété** : panneaux « Vendu », avis de valeur offerts, présence locale.",
          "- **Suivi** : notez chaque contact dans l'outil (fiche de chasse, prospection ciblée) et **relancez** : un projet de vente mûrit souvent sur plusieurs mois.",
          "Dans l'application, utilisez **Chasse immobilière** pour suivre les biens PAP et **Prospection ciblée** pour organiser vos tournées terrain.",
        ],
      },
    ],
    quiz: [
      {
        question: "Quel est l'objectif principal d'un appel de pige ?",
        options: ["Vendre le mandat au téléphone", "Obtenir un rendez-vous d'estimation", "Négocier le prix", "Faire signer en ligne"],
        correct: 1,
        explication: "L'appel sert à décrocher le rendez-vous. La vente des services et du mandat se fait en face-à-face.",
      },
      {
        question: "Dans quel délai idéal rappeler un lead entrant (estimation en ligne) ?",
        options: ["Dans la semaine", "Dans les 48 h", "Dans l'heure", "Quand on a le temps"],
        correct: 2,
        explication: "La réactivité est décisive : le premier agent à rappeler capte le plus souvent le mandat.",
      },
    ],
  },
  {
    id: "decouverte",
    titre: "Découverte & qualification",
    icone: "🔎",
    categorie: "Commercial",
    resume: "Comprendre le projet et la motivation réelle du client avant de vendre quoi que ce soit.",
    duree: "10 min",
    lecons: [
      {
        titre: "Découvrir avant de proposer",
        contenu: [
          "On ne peut pas convaincre sans avoir **compris**. La découverte précède toujours l'argumentation.",
          "## La méthode : écouter 70 %, parler 30 %",
          "Posez des **questions ouvertes** et laissez le silence travailler.",
          "- « Parlez-moi de votre projet. »",
          "- « Qu'est-ce qui vous amène à vendre / acheter aujourd'hui ? »",
          "- « Quel est votre calendrier idéal ? »",
          "Notez tout : ces informations nourrissent votre argumentaire et votre suivi.",
        ],
      },
      {
        titre: "Qualifier un vendeur",
        contenu: [
          "Un vendeur se qualifie sur trois axes — la méthode **« projet / délai / prix »** :",
          "- **Motivation** : mutation, succession, divorce, agrandissement… Plus la motivation est forte, plus le bien se vendra au juste prix.",
          "- **Délai** : vend-il dans l'urgence ou « pour voir » ? Un vendeur sans délai surévalue souvent.",
          "- **Prix** : a-t-il un prix en tête ? Est-il réaliste par rapport au marché ?",
          "Un vendeur **motivé + réaliste** est un mandat prioritaire.",
        ],
      },
      {
        titre: "Qualifier un acquéreur",
        contenu: [
          "Un acquéreur non qualifié fait perdre du temps à tout le monde. Validez systématiquement :",
          "- **Le financement** : apport, capacité d'emprunt, accord de principe bancaire. Un acquéreur « finançable » vaut dix curieux.",
          "- **Le projet** : résidence principale, secondaire, investissement locatif ?",
          "- **Les critères réels** : secteur, surface, budget **net acheteur** (hors frais).",
          "Dans l'application, la fiche **Acquéreurs** centralise ces critères et permet le rapprochement automatique avec vos biens en chasse.",
        ],
      },
    ],
    quiz: [
      {
        question: "Quelle est la bonne répartition de parole en découverte ?",
        options: ["Parler 70 %, écouter 30 %", "Écouter 70 %, parler 30 %", "Parler 100 %", "Peu importe"],
        correct: 1,
        explication: "La découverte repose sur l'écoute active : on laisse le client s'exprimer pour comprendre sa motivation réelle.",
      },
      {
        question: "Qu'est-ce qui qualifie en priorité un acquéreur ?",
        options: ["Sa sympathie", "Son financement validé", "Le nombre de visites demandées", "Son adresse actuelle"],
        correct: 1,
        explication: "Un acquéreur dont le financement est validé est réellement en mesure d'acheter : c'est le critère clé.",
      },
    ],
  },
  {
    id: "estimation",
    titre: "Estimation & avis de valeur",
    icone: "📐",
    categorie: "Commercial",
    resume: "Fixer le juste prix, l'argumenter avec des preuves et éviter la surévaluation.",
    duree: "11 min",
    lecons: [
      {
        titre: "Les méthodes d'estimation",
        contenu: [
          "L'estimation d'un bien résidentiel repose principalement sur la **méthode par comparaison** : on compare à des biens similaires réellement **vendus** (et non affichés) sur le secteur.",
          "- **DVF (Demandes de Valeurs Foncières)** : la base publique des ventes notariées — la référence objective du prix de marché.",
          "- **Ajustements** : état, étage, exposition, travaux, prestations, DPE.",
          "- **Prix affiché ≠ prix de vente** : un bien se négocie en moyenne en dessous de son prix d'affichage.",
          "Dans l'application, l'outil d'estimation et le **positionnement marché** d'une fiche de chasse s'appuient sur les ventes DVF réelles du secteur.",
        ],
      },
      {
        titre: "Le piège de la surévaluation",
        contenu: [
          "Accepter un mandat à un prix trop élevé pour « faire plaisir » au vendeur est une **erreur coûteuse** :",
          "- Le bien ne reçoit pas de visites, **s'use** sur le marché et finira par se vendre MOINS cher qu'au juste prix.",
          "- Vous mobilisez du temps et de la publicité pour rien.",
          "## Mieux vaut un bon prix qu'un mandat",
          "Un négociateur professionnel **ose dire le juste prix**, preuves à l'appui. Un vendeur bien conseillé vend plus vite et au bon prix.",
        ],
      },
      {
        titre: "Présenter son avis de valeur",
        contenu: [
          "L'avis de valeur se **défend avec des preuves**, pas avec une opinion.",
          "- Montrez 3 à 5 **ventes comparables** récentes.",
          "- Expliquez les **ajustements** (plus/moins-values) de façon factuelle.",
          "- Donnez une **fourchette** réaliste et un prix de mise en vente cohérent.",
          "Terminez toujours par la **stratégie commerciale** : à ce prix, voici le plan de diffusion et le délai de vente estimé.",
        ],
      },
    ],
    quiz: [
      {
        question: "Sur quoi repose principalement l'estimation d'un logement ?",
        options: ["Le prix d'achat initial du vendeur", "Les biens vendus comparables (DVF)", "Les annonces affichées des concurrents", "L'avis du vendeur"],
        correct: 1,
        explication: "La méthode par comparaison s'appuie sur les ventes réelles (DVF), pas sur les prix affichés ni sur une opinion.",
      },
      {
        question: "Quel est le risque d'un mandat surévalué ?",
        options: ["Vendre trop vite", "Le bien s'use et se vend finalement moins cher", "Trop de visites", "Rien, c'est sans risque"],
        correct: 1,
        explication: "Un bien surévalué ne reçoit pas de visites, se « grille » sur le marché et se vend au final en dessous du juste prix.",
      },
    ],
  },
  {
    id: "mandat",
    titre: "La prise de mandat",
    icone: "📝",
    categorie: "Commercial",
    resume: "Décrocher le mandat, idéalement exclusif, et sécuriser la relation vendeur.",
    duree: "10 min",
    lecons: [
      {
        titre: "Mandat simple ou exclusif ?",
        contenu: [
          "- **Mandat simple** : le vendeur peut confier le bien à plusieurs agences et vendre lui-même. Moins d'engagement, diffusion dispersée, guerre des prix.",
          "- **Mandat exclusif** : une seule agence pendant une durée définie. **Plus d'implication, plus de moyens, meilleure maîtrise du prix** et, statistiquement, une vente **plus rapide et plus proche du prix**.",
          "L'exclusivité n'est pas une contrainte pour le vendeur : c'est un **engagement de résultat** de votre part.",
        ],
      },
      {
        titre: "Argumenter l'exclusivité",
        contenu: [
          "Face au « je préfère plusieurs agences », rassurez et démontrez :",
          "- **Plus d'agences ≠ plus d'acheteurs** : ce sont les mêmes acquéreurs qui voient le bien partout, ce qui le **banalise** et laisse croire qu'il « ne se vend pas ».",
          "- En exclusivité, vous investissez : home-staging, photos pro, diffusion premium, reporting régulier.",
          "- Proposez un **engagement de reporting** (compte rendu de visites, bilan hebdomadaire) pour rassurer.",
          "Dans l'application, le **bilan de commercialisation** permet justement de rendre compte au vendeur de façon professionnelle.",
        ],
      },
      {
        titre: "Sécuriser la signature",
        contenu: [
          "- Vérifiez l'**identité** des mandants et leur qualité à vendre (titre de propriété, indivision, succession).",
          "- Remplissez le **mandat** avec soin : prix, honoraires, durée, mentions obligatoires (voir module Loi ALUR).",
          "- Collectez immédiatement les **pièces du dossier vendeur** (titre, diagnostics, identité) — l'application vous guide sur les pièces manquantes.",
          "- N'oubliez pas la **fiche d'identification Tracfin (KYC)** : obligatoire, générée automatiquement depuis le dossier vendeur.",
        ],
      },
    ],
    quiz: [
      {
        question: "Pourquoi « plus d'agences » n'aide généralement pas la vente ?",
        options: ["Ça coûte plus cher au vendeur", "Les mêmes acquéreurs voient le bien partout, ce qui le banalise", "C'est interdit", "Ça accélère toujours la vente"],
        correct: 1,
        explication: "La multidiffusion présente le même bien aux mêmes acquéreurs ; il paraît « partout » et donne l'impression de ne pas se vendre.",
      },
      {
        question: "Quelle pièce KYC est obligatoire à la prise de mandat ?",
        options: ["Le DPE", "La fiche d'identification Tracfin", "Le plan cadastral", "L'assurance habitation"],
        correct: 1,
        explication: "La fiche d'identification du client (Tracfin / LCB-FT) fait partie des obligations de vigilance de l'agent immobilier.",
      },
    ],
  },
  {
    id: "negociation",
    titre: "La négociation",
    icone: "🤝",
    categorie: "Commercial",
    resume: "Conduire l'offre, traiter les objections et rapprocher vendeur et acquéreur.",
    duree: "10 min",
    lecons: [
      {
        titre: "Préparer la négociation",
        contenu: [
          "La négociation se gagne **avant** de commencer, par la préparation :",
          "- Connaître la **motivation** et le **délai** de chaque partie.",
          "- Connaître la **valeur de marché** réelle (vos comparables DVF).",
          "- Avoir **qualifié le financement** de l'acquéreur : une offre financée a du poids.",
          "Vous êtes un **tiers de confiance** entre deux parties, pas l'avocat de l'une contre l'autre.",
        ],
      },
      {
        titre: "Traiter les objections",
        contenu: [
          "Une objection est un **signal d'intérêt**, pas un refus. Méthode **« écouter – reformuler – répondre »** :",
          "- « C'est trop cher. » → « Qu'est-ce qui vous fait dire cela ? » puis comparez au marché réel.",
          "- « Je vais réfléchir. » → identifiez le **vrai frein** (prix, financement, doute sur le bien).",
          "Ne jamais contredire frontalement : **accueillez** l'objection, puis apportez la preuve.",
        ],
      },
      {
        titre: "Présenter une offre",
        contenu: [
          "- Transmettez toute offre écrite au vendeur : c'est une **obligation**.",
          "- Présentez l'offre avec son **contexte** : acquéreur financé, projet sérieux, délai.",
          "- En cas d'écart, travaillez la **contre-proposition** plutôt que le simple « non ».",
          "- Objectif : un **accord gagnant-gagnant** qui tient jusqu'à l'acte — une offre acceptée trop basse ou mal cadrée se retourne souvent en compromis.",
        ],
      },
    ],
    quiz: [
      {
        question: "Comment considérer une objection client ?",
        options: ["Comme un refus définitif", "Comme un signal d'intérêt à traiter", "Comme une attaque", "Comme une perte de temps"],
        correct: 1,
        explication: "Une objection exprime un intérêt et un frein à lever : on l'accueille, on reformule, puis on répond avec des preuves.",
      },
      {
        question: "Que faire de toute offre d'achat écrite reçue ?",
        options: ["La filtrer selon son montant", "La transmettre au vendeur", "La garder si elle est trop basse", "Attendre une meilleure offre"],
        correct: 1,
        explication: "L'agent a l'obligation de transmettre au vendeur toutes les offres écrites qu'il reçoit.",
      },
    ],
  },
  {
    id: "loi-alur",
    titre: "Loi ALUR",
    icone: "⚖️",
    categorie: "Juridique",
    resume: "Mandats, honoraires, mentions obligatoires et copropriété : l'essentiel de la loi ALUR.",
    duree: "14 min",
    lecons: [
      {
        titre: "Ce qu'a changé la loi ALUR",
        contenu: [
          "La **loi ALUR** (Accès au Logement et un Urbanisme Rénové, 2014) a renforcé l'encadrement des professionnels de l'immobilier et la protection des consommateurs.",
          "## Principaux apports pour l'agent",
          "- Encadrement et **transparence des honoraires** (affichage obligatoire).",
          "- Renforcement des **mentions obligatoires** des mandats et annonces.",
          "- Obligation de **formation continue** (14 h/an ou 42 h sur 3 ans) pour le renouvellement de la carte professionnelle.",
          "- Information renforcée de l'acquéreur en **copropriété**.",
          "- Création du **Conseil national de la transaction et de la gestion immobilières (CNTGI)** et d'un code de déontologie.",
        ],
      },
      {
        titre: "Honoraires et annonces",
        contenu: [
          "## Affichage des honoraires",
          "Les honoraires TTC doivent être **affichés** (vitrine, site, annonces). Toute annonce doit indiquer le **prix de vente**, préciser si les honoraires sont **à la charge du vendeur ou de l'acquéreur**, et, s'ils sont à la charge de l'acquéreur, le prix **hors honoraires** et le **taux/montant** des honoraires.",
          "## Mentions des annonces",
          "- Montant des honoraires et partie qui les paie.",
          "- Pour un bien en copropriété : **nombre de lots**, montant des **charges courantes**, et information sur les **procédures** en cours le cas échéant.",
          "- Le **DPE** avec son étiquette énergie/climat est obligatoire dans l'annonce.",
        ],
      },
      {
        titre: "Le mandat après ALUR",
        contenu: [
          "Un mandat doit notamment comporter :",
          "- L'**identité** des parties et la désignation du bien.",
          "- Le **prix** et la **rémunération** (montant, qui la paie).",
          "- La **durée** et les conditions de résiliation (un mandat avec clause d'exclusivité ou de pénalité est résiliable, après 3 mois, par lettre recommandée avec 15 jours de préavis).",
          "- Un **numéro de mandat** reporté sur un registre des mandats.",
          "- Les **conditions de reddition de comptes**.",
          "Sans mandat écrit préalable, **aucune rémunération** n'est due (loi Hoguet).",
        ],
      },
      {
        titre: "Copropriété : informer l'acquéreur",
        contenu: [
          "ALUR a renforcé l'information de l'acquéreur d'un lot de copropriété. Doivent lui être communiqués, selon l'avancement :",
          "- Le **règlement de copropriété** et l'état descriptif de division.",
          "- Les **PV des assemblées générales** (généralement des 3 dernières années).",
          "- Le **montant des charges** courantes et travaux votés.",
          "- Le **carnet d'entretien** de l'immeuble et, le cas échéant, le **pré-état daté / état daté**.",
          "- Le **diagnostic technique global (DTG)** s'il existe.",
          "Dans l'application, ces pièces sont suivies dans le **dossier vendeur** (pièces attendues) et le module **Pré-état daté** aide à les réunir.",
        ],
      },
    ],
    quiz: [
      {
        question: "Que doit préciser une annonce dont les honoraires sont à la charge de l'acquéreur ?",
        options: ["Rien de particulier", "Le prix hors honoraires et le montant/taux des honoraires", "Uniquement le prix total", "Seulement le nom de l'agence"],
        correct: 1,
        explication: "Quand les honoraires sont à la charge de l'acquéreur, l'annonce indique le prix hors honoraires et le montant (ou taux) des honoraires.",
      },
      {
        question: "Quelle obligation de formation ALUR conditionne le renouvellement de la carte pro ?",
        options: ["Aucune", "14 h par an (ou 42 h sur 3 ans)", "100 h par an", "Un examen national annuel"],
        correct: 1,
        explication: "La formation continue est de 14 h par an, soit 42 h sur trois ans, pour renouveler la carte professionnelle.",
      },
      {
        question: "Sans mandat écrit préalable, l'agent peut-il percevoir une rémunération ?",
        options: ["Oui toujours", "Non (loi Hoguet)", "Oui si le vendeur est d'accord à l'oral", "Oui après la vente"],
        correct: 1,
        explication: "La loi Hoguet impose un mandat écrit préalable : à défaut, aucune commission n'est due.",
      },
    ],
  },
  {
    id: "cadre-legal",
    titre: "Cadre légal & conformité",
    icone: "🛡️",
    categorie: "Juridique",
    resume: "Loi Hoguet, vigilance Tracfin (LCB-FT) et RGPD : les obligations à ne pas négliger.",
    duree: "12 min",
    lecons: [
      {
        titre: "Loi Hoguet : le socle",
        contenu: [
          "La **loi Hoguet** (1970) encadre l'exercice des professions immobilières :",
          "- **Carte professionnelle** obligatoire (transaction « T », gestion « G »), délivrée par la CCI.",
          "- **Garantie financière** et **assurance responsabilité civile professionnelle**.",
          "- **Mandat écrit préalable** obligatoire pour agir et être rémunéré.",
          "- Tenue d'un **registre des mandats** et d'un **registre répertoire**.",
        ],
      },
      {
        titre: "LCB-FT / Tracfin : la vigilance",
        contenu: [
          "Les agents immobiliers sont **assujettis** à la lutte contre le blanchiment et le financement du terrorisme (**LCB-FT**).",
          "## Vos obligations",
          "- **Identifier et vérifier** l'identité du client (KYC) et, le cas échéant, du **bénéficiaire effectif**.",
          "- Évaluer le **risque** et conserver les justificatifs.",
          "- Faire preuve de **vigilance** sur l'origine des fonds et les opérations atypiques.",
          "- En cas de soupçon, effectuer une **déclaration à Tracfin**.",
          "Dans l'application, la **fiche d'identification Tracfin (KYC)** se génère automatiquement à partir du dossier vendeur ; la **notation des risques** reste à votre appréciation et sous votre responsabilité.",
        ],
      },
      {
        titre: "RGPD & démarchage",
        contenu: [
          "Vous manipulez des **données personnelles** (vendeurs, acquéreurs) : le **RGPD** s'applique.",
          "- **Finalité et minimisation** : ne collectez que l'utile, pour un usage défini.",
          "- **Information et consentement** des personnes ; droit d'accès, de rectification et d'effacement.",
          "- **Sécurité et durée de conservation** limitées.",
          "## Démarchage téléphonique",
          "Respectez **Bloctel** : il est interdit de démarcher un particulier inscrit sur la liste d'opposition (hors relation contractuelle existante).",
        ],
      },
    ],
    quiz: [
      {
        question: "Que délivre l'obtention de la carte professionnelle « T » ?",
        options: ["Le droit de syndic", "Le droit d'exercer la transaction immobilière", "Une exonération d'assurance", "Un agrément bancaire"],
        correct: 1,
        explication: "La carte « T » (transaction) autorise l'activité d'entremise et de négociation immobilière (loi Hoguet).",
      },
      {
        question: "Que faire en cas de soupçon de blanchiment sur une opération ?",
        options: ["Annuler la vente sans explication", "Effectuer une déclaration à Tracfin", "Prévenir seulement le vendeur", "Ne rien faire"],
        correct: 1,
        explication: "L'agent assujetti LCB-FT doit, en cas de soupçon, adresser une déclaration à Tracfin.",
      },
    ],
  },
  {
    id: "compromis",
    titre: "Compromis & financement",
    icone: "🏦",
    categorie: "Juridique",
    resume: "De l'offre acceptée à l'acte : compromis, conditions suspensives, délais et financement.",
    duree: "11 min",
    lecons: [
      {
        titre: "Le compromis de vente",
        contenu: [
          "Le **compromis** (ou promesse synallagmatique) engage **les deux parties** : vendeur à vendre, acquéreur à acheter, sous conditions.",
          "- **Dépôt de garantie** : souvent 5 à 10 % du prix, séquestré.",
          "- **Délai de rétractation SRU** : l'acquéreur non professionnel dispose de **10 jours** pour se rétracter sans motif ni pénalité.",
          "- Entre compromis et acte notarié : généralement **2 à 3 mois** (purge des conditions, financement, droit de préemption).",
        ],
      },
      {
        titre: "Les conditions suspensives",
        contenu: [
          "Une **condition suspensive** suspend la vente à la réalisation d'un événement. Les plus courantes :",
          "- **Obtention du prêt** (condition légale protectrice de l'acquéreur emprunteur) : si le prêt est refusé dans les conditions prévues, la vente est annulée et le dépôt restitué.",
          "- Absence de **servitude** ou d'urbanisme bloquant, **droit de préemption** non exercé.",
          "- Soignez la **rédaction** : montant, taux maximal, durée, délai d'obtention. Une clause mal rédigée fait tomber des ventes.",
        ],
      },
      {
        titre: "Accompagner le financement",
        contenu: [
          "Un dossier qui n'aboutit pas est presque toujours un **financement** mal cadré.",
          "- Vérifiez en amont la **capacité d'emprunt** et l'**apport**.",
          "- Orientez vers un **courtier** ou la banque rapidement après le compromis.",
          "- Suivez les **délais** de la condition suspensive de prêt et relancez l'acquéreur.",
          "Un acquéreur bien accompagné sur son financement, c'est une vente qui **tient** jusqu'à l'acte.",
        ],
      },
    ],
    quiz: [
      {
        question: "Quel est le délai de rétractation SRU de l'acquéreur non professionnel ?",
        options: ["48 heures", "7 jours", "10 jours", "1 mois"],
        correct: 2,
        explication: "L'acquéreur dispose d'un délai légal de rétractation de 10 jours après la signature du compromis.",
      },
      {
        question: "À quoi sert la condition suspensive d'obtention de prêt ?",
        options: ["À augmenter le prix", "À protéger l'acquéreur si son prêt est refusé", "À accélérer l'acte", "À dispenser du compromis"],
        correct: 1,
        explication: "Si le prêt est refusé dans les conditions prévues, la vente est annulée et le dépôt de garantie restitué à l'acquéreur.",
      },
    ],
  },
];
