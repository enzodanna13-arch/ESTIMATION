// Centre de formation interne (transaction immobilière) — contenu approfondi.
// Chaque module regroupe des leçons et un quiz. Contenu en « markdown léger » :
// "## " = sous-titre, "- " = puce, **gras** inline.
// Les éléments juridiques sont à jour des règles en vigueur (loi Hoguet, loi
// ALUR, arrêtés honoraires 2017/2022, LCB-FT/Tracfin, loi Climat & résilience,
// Code de la consommation). Ils ont une valeur pédagogique : pour un cas réel,
// se référer au texte officiel et, au besoin, au service juridique / notaire.

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
  categorie: "Commercial" | "Transaction" | "Juridique";
  resume: string;
  duree: string; // durée de lecture estimée
  lecons: Lecon[];
  quiz: QuizItem[];
}

export const MODULES_FORMATION: ModuleFormation[] = [
  // ======================================================================
  {
    id: "prospection",
    titre: "Prospection & pige",
    icone: "🎯",
    categorie: "Commercial",
    resume: "Bâtir un flux régulier de mandats : pige, terrain, réseau, phoning et organisation.",
    duree: "20 min",
    lecons: [
      {
        titre: "Pourquoi la prospection est votre métier n°1",
        contenu: [
          "Un négociateur n'est pas payé pour vendre des biens : il est payé pour **rentrer des mandats**. Sans stock de biens au juste prix, il n'y a rien à vendre. La prospection est donc l'activité la plus rentable de votre semaine, et la première à bloquer dans votre agenda.",
          "## La règle des 3 tiers du temps",
          "- **1/3 prospection** (pige, terrain, phoning, suivi) — l'investissement.",
          "- **1/3 découverte & R1/R2** (estimations, prises de mandat) — la transformation.",
          "- **1/3 vente & suivi** (visites, offres, compromis, SAV) — la récolte.",
          "## Le principe de régularité",
          "La prospection paie **en différé** : un vendeur contacté aujourd'hui signe souvent dans 3 à 9 mois. Celui qui prospecte seulement quand son stock est vide subit des creux de chiffre d'affaires permanents. **Prospecter tous les jours, même quand on a des mandats**, c'est lisser son activité.",
          "## Un chiffre à retenir",
          "Statistiquement, un bien sur deux revient au **premier professionnel qui contacte le vendeur**. La réactivité et l'assiduité battent le talent.",
        ],
      },
      {
        titre: "La pige : repérer les vendeurs particuliers",
        contenu: [
          "La **pige** consiste à détecter et contacter les particuliers qui vendent seuls (PAP) ou via d'autres agences, pour leur proposer vos services.",
          "## Où piger",
          "- Portails d'annonces (SeLoger, Leboncoin, PAP, Bien'ici…) filtrés sur votre secteur.",
          "- Réseaux sociaux (groupes Facebook locaux, Marketplace).",
          "- Panneaux « À vendre » de particuliers repérés sur le terrain.",
          "## Organiser sa pige",
          "- Pigez **tous les jours à heure fixe** : les biens neufs partent vite.",
          "- Notez chaque bien pigé dans l'outil (**Chasse immobilière** dans l'application) : prix, date de parution, coordonnées, relances.",
          "- Mesurez : nb de biens pigés → nb d'appels → nb de RDV → nb de mandats. C'est votre **tunnel de prospection**.",
          "## Le bon état d'esprit",
          "Un vendeur PAP n'est pas « contre les agences » : il essaie d'économiser la commission. Votre rôle est de démontrer que **vous lui faites gagner plus que vous ne lui coûtez** (meilleur prix net, sécurité juridique, temps gagné).",
        ],
      },
      {
        titre: "Réussir l'appel de pige (script)",
        contenu: [
          "L'objectif de l'appel n'est pas de vendre vos services : c'est d'obtenir un **rendez-vous** (estimation, visite du bien).",
          "## Structure d'appel",
          "- **Accroche** : « Bonjour, je vous appelle pour votre maison à [ville], elle est toujours à la vente ? »",
          "- **Permission** : « Je peux vous poser deux questions rapides ? »",
          "- **Découverte** : depuis quand en vente ? combien de visites ? pourquoi vendez-vous seul ? quel est votre projet derrière ?",
          "- **Création de valeur** : « Je travaille le secteur, j'ai des acquéreurs en recherche active. »",
          "- **Fermeture** : « Le mieux, c'est que je passe voir le bien : jeudi 18 h ou samedi 10 h ? » (**alternative**, jamais oui/non).",
          "## Traiter les objections courantes",
          "- « Je vends seul. » → « Beaucoup de vendeurs commencent ainsi. Acceptez juste que je passe estimer, sans engagement : vous aurez un avis de pro gratuit. »",
          "- « J'ai déjà une agence. » → « En simple ou en exclusivité ? Je peux apporter mes acquéreurs en plus, ça ne vous coûte rien de plus. »",
          "- « Envoyez-moi un mail. » → « Avec plaisir, mais pour être utile il faut que je voie le bien. On dit jeudi ? »",
          "## Règles d'or",
          "Sourire audible, débit posé, **une question à la fois**, et on raccroche **avec un RDV** ou une relance datée — jamais « je vous rappellerai un jour ».",
        ],
      },
      {
        titre: "Terrain : porte-à-porte, boîtage, réseau",
        contenu: [
          "La prospection physique crée la **notoriété locale** qui fait venir les vendeurs à vous.",
          "## Porte-à-porte",
          "- Prétexte utile : « Je viens de vendre dans votre rue, j'ai des acquéreurs qui cherchent ici, connaissez-vous quelqu'un qui vend ? »",
          "- Objectif : collecter de l'information et des contacts, pas signer sur le pas de la porte.",
          "## Boîtage & flyers",
          "- Ciblez un secteur et **repassez régulièrement** (pilonnage) : la répétition crée la mémorisation.",
          "- Messages à forte valeur : « estimation offerte », « vendu dans votre quartier », « acquéreur recherche ».",
          "- L'application **Flyers de prospection** génère des supports personnalisés.",
          "## Réseau & recommandation",
          "- Votre meilleure source : anciens clients satisfaits. **Demandez explicitement** des recommandations.",
          "- Entretenez une base « chaude » : commerçants, gardiens, notaires, artisans, syndics.",
          "- Un **avis Google** après chaque vente nourrit votre réputation et votre pige entrante.",
        ],
      },
      {
        titre: "Organisation, suivi et indicateurs",
        contenu: [
          "Ce qui ne se mesure pas ne s'améliore pas. Pilotez votre prospection avec des **indicateurs**.",
          "## Vos KPI hebdomadaires",
          "- Nombre de **contacts** (pige + terrain + phoning).",
          "- Nombre de **RDV d'estimation** obtenus.",
          "- Nombre de **mandats** rentrés (dont exclusifs).",
          "- Taux de transformation à chaque étape.",
          "## La relance, là où tout se joue",
          "La majorité des mandats se signent à partir de la **2ᵉ, 3ᵉ ou 4ᵉ relance**, pas au premier contact. Programmez vos relances (J+7, J+30, J+90) et tenez-les.",
          "## Dans l'application",
          "- **Chasse immobilière** : suivez chaque bien PAP, son prix, son positionnement marché et vos relances.",
          "- **Prospection ciblée** + **Ma tournée** : organisez vos passages terrain par secteur.",
          "- **Suivi des négociateurs** : votre activité (chasses, tournées, appels, RDV) est consolidée pour le pilotage.",
        ],
      },
    ],
    quiz: [
      { question: "Quelle est la mission première d'un négociateur ?", options: ["Vendre des biens", "Rentrer des mandats", "Faire visiter", "Rédiger des annonces"], correct: 1, explication: "Sans mandats au juste prix, il n'y a rien à vendre : la prospection (entrée de mandats) est l'activité n°1." },
      { question: "L'objectif d'un appel de pige est de…", options: ["Vendre le mandat au téléphone", "Obtenir un rendez-vous", "Donner le prix du bien", "Négocier la commission"], correct: 1, explication: "On décroche le RDV ; la vente des services se fait en face-à-face." },
      { question: "La plupart des mandats se signent…", options: ["Au premier contact", "Après plusieurs relances", "Sans relance", "Uniquement par recommandation"], correct: 1, explication: "La relance régulière (J+7/J+30/J+90) transforme bien plus que le premier appel." },
    ],
  },

  // ======================================================================
  {
    id: "decouverte",
    titre: "Découverte & qualification",
    icone: "🔎",
    categorie: "Commercial",
    resume: "Comprendre le projet, la motivation et la capacité réelle du client avant d'argumenter.",
    duree: "16 min",
    lecons: [
      {
        titre: "L'art du questionnement",
        contenu: [
          "On ne convainc jamais sans avoir d'abord **compris**. La découverte précède toujours l'argumentation — c'est la phase la plus négligée et la plus décisive.",
          "## Écouter 70 %, parler 30 %",
          "Utilisez des **questions ouvertes** (« comment… », « pourquoi… », « parlez-moi de… ») et acceptez le **silence** : il pousse l'autre à préciser.",
          "- « Parlez-moi de votre projet. »",
          "- « Qu'est-ce qui vous amène à vendre / acheter **aujourd'hui** ? »",
          "- « Quel serait votre calendrier idéal ? »",
          "- « Qu'est-ce qui est le plus important pour vous dans cette opération ? »",
          "## Reformuler pour valider",
          "« Si je comprends bien, vous souhaitez vendre avant l'été pour financer votre nouvel achat, c'est bien ça ? » La reformulation prouve l'écoute et sécurise l'information.",
        ],
      },
      {
        titre: "Qualifier un vendeur : projet / délai / prix",
        contenu: [
          "Trois axes déterminent la valeur d'un mandat :",
          "- **Motivation** : mutation, succession, séparation, agrandissement, revente d'investissement… Plus la motivation est forte et datée, plus le bien se vendra au juste prix.",
          "- **Délai** : urgence réelle ou « pour voir » ? Un vendeur sans délai surévalue presque toujours.",
          "- **Prix** : a-t-il un prix en tête ? Est-il réaliste vs marché DVF ? Comment l'a-t-il fixé ?",
          "## Détecter la vraie motivation",
          "Posez la question du **« pourquoi derrière le pourquoi »** : « Vous vendez pour acheter plus grand — et si vous ne vendiez pas, qu'est-ce que ça changerait pour vous ? » La motivation profonde guide toute la négociation.",
          "## Signaux d'un bon mandat",
          "Motivation forte + délai réel + prix réaliste = **mandat prioritaire**, idéalement en exclusivité.",
        ],
      },
      {
        titre: "Qualifier un acquéreur : le financement d'abord",
        contenu: [
          "Un acquéreur non qualifié fait perdre du temps à tout le monde (vendeur, agent, visites inutiles).",
          "## Les 3 validations",
          "- **Financement** : apport, revenus, charges, **capacité d'emprunt**, accord de principe bancaire. Un acquéreur « finançable » vaut dix curieux.",
          "- **Projet** : résidence principale, secondaire, investissement locatif ? Primo-accédant ?",
          "- **Critères réels** : secteur, surface, nb de chambres, budget **net acheteur** (hors frais de notaire et honoraires).",
          "## Calcul rapide de capacité",
          "Règle du **taux d'endettement ~35 %** (assurance comprise) recommandé par le HCSF, sur une durée généralement **≤ 25 ans**. Mensualité maximale ≈ 35 % des revenus nets, moins les crédits en cours.",
          "## Dans l'application",
          "La fiche **Acquéreurs** centralise secteur, budget et critères, et permet le **rapprochement automatique** avec vos biens en chasse : sous l'annonce d'une fiche de chasse, les acquéreurs correspondants s'affichent pour la relance.",
        ],
      },
      {
        titre: "Lire les motivations : la méthode SONCAS",
        contenu: [
          "**SONCAS** est une grille simple pour identifier le **levier de décision** dominant d'un client et adapter votre discours :",
          "- **S**écurité : garanties, cadre légal, pas de mauvaise surprise. → Rassurez (diagnostics, juridique, process).",
          "- **O**rgueil : standing, image, « le beau quartier ». → Valorisez l'exclusivité, le prestige.",
          "- **N**ouveauté : bien atypique, rénové, dernière tendance. → Mettez en avant l'originalité.",
          "- **C**onfort : praticité, plain-pied, proximité, zéro travaux. → Insistez sur le quotidien facilité.",
          "- **A**rgent : bonne affaire, rentabilité, négociation. → Parlez prix/m², potentiel, plus-value.",
          "- **S**ympathie : relation, confiance, feeling. → Soyez authentique et disponible.",
          "Un même bien se présente différemment selon le profil : vous ne vendez pas un pavillon « confort » comme un loft « nouveauté ».",
        ],
      },
    ],
    quiz: [
      { question: "Quelle répartition de parole en découverte ?", options: ["Parler 70 %", "Écouter 70 %", "50/50", "Peu importe"], correct: 1, explication: "La découverte repose sur l'écoute active : on laisse le client exprimer sa motivation réelle." },
      { question: "Quel critère qualifie en priorité un acquéreur ?", options: ["Sa sympathie", "Son financement validé", "Le nombre de visites", "Son ancienneté"], correct: 1, explication: "Un financement validé prouve la capacité réelle d'acheter." },
      { question: "Dans SONCAS, le « A » correspond à…", options: ["Ambiance", "Argent", "Attente", "Adresse"], correct: 1, explication: "A = Argent (bonne affaire, rentabilité, négociation)." },
      { question: "Le taux d'endettement recommandé (HCSF) est d'environ…", options: ["20 %", "35 %", "50 %", "70 %"], correct: 1, explication: "~35 % d'endettement assurance comprise, sur une durée généralement ≤ 25 ans." },
    ],
  },

  // ======================================================================
  {
    id: "estimation",
    titre: "Estimation & avis de valeur",
    icone: "📐",
    categorie: "Commercial",
    resume: "Fixer le juste prix par comparaison (DVF), l'argumenter par la preuve et éviter la surévaluation.",
    duree: "18 min",
    lecons: [
      {
        titre: "Les méthodes d'évaluation",
        contenu: [
          "## Méthode par comparaison (la référence en résidentiel)",
          "On compare le bien à des biens **similaires réellement vendus** (pas affichés) sur le secteur, puis on ajuste. C'est la méthode reine pour un logement.",
          "## Autres méthodes",
          "- **Par le revenu / rendement** : pour l'investissement locatif (valeur = loyer annuel ÷ taux de rendement attendu).",
          "- **Par le coût de remplacement** : terrain + reconstruction - vétusté (biens atypiques, neuf).",
          "- **Méthode du promoteur** : pour le foncier constructible.",
          "## La donnée clé : DVF",
          "La base **DVF (Demandes de Valeurs Foncières)** recense les ventes notariées réelles. C'est la source objective du prix de marché, bien plus fiable que les prix affichés des concurrents.",
          "L'application calcule le **positionnement marché** d'un bien à partir des ventes DVF du secteur (prix/m² médian, valeur estimée, écart vs prix affiché).",
        ],
      },
      {
        titre: "Les critères d'ajustement",
        contenu: [
          "Partant d'un prix/m² de référence, on ajuste selon les caractéristiques réelles :",
          "- **Localisation fine** : rue, nuisances, vue, calme, commerces, écoles, transports.",
          "- **Étage & exposition** : ascenseur, luminosité, plein sud valorisant.",
          "- **État & travaux** : refait à neuf vs à rénover (le coût des travaux se déduit, souvent majoré du « coût psychologique »).",
          "- **Prestations** : balcon, terrasse, parking, cave, extérieur, piscine.",
          "- **Surface & agencement** : un bon plan vaut mieux que des m² mal distribués ; attention à la **surface Carrez** en copropriété.",
          "- **DPE** : une étiquette F/G décote (travaux à prévoir, restrictions de location) ; A/B valorise.",
          "## Attention",
          "Prix **affiché ≠ prix de vente** : un bien se négocie en moyenne **en dessous** de son affichage. Travaillez toujours sur des **ventes réalisées**.",
        ],
      },
      {
        titre: "Le piège mortel : la surévaluation",
        contenu: [
          "Accepter un mandat à un prix trop élevé pour « faire plaisir » ou « prendre le mandat » est l'erreur la plus coûteuse du métier.",
          "## Le cercle vicieux du bien surévalué",
          "- Peu ou pas de visites les premières semaines (là où l'intérêt est maximal).",
          "- Le bien **« se grille »** : les acquéreurs du secteur l'ont vu, l'écartent, et pensent « il ne se vend pas, il y a un problème ».",
          "- Baisses de prix successives qui installent le doute.",
          "- **Résultat** : vente finale **plus longue ET moins chère** qu'au juste prix d'entrée.",
          "## La courbe d'intérêt",
          "L'intérêt pour un bien est **maximal dans les 3-4 premières semaines** de mise en vente. Un prix juste dès le départ capte cette fenêtre ; un prix trop haut la gâche définitivement.",
          "## Mieux vaut un bon prix qu'un mauvais mandat",
          "Un professionnel **ose dire le juste prix**, preuves à l'appui. C'est un service rendu au vendeur, pas un manque d'ambition.",
        ],
      },
      {
        titre: "Présenter l'avis de valeur (R1 / R2)",
        contenu: [
          "On vend souvent en **deux rendez-vous** : R1 (découverte + visite du bien), R2 (présentation de l'avis de valeur + prise de mandat).",
          "## Un avis se défend par la preuve",
          "- Présentez **3 à 5 ventes comparables** récentes et documentées.",
          "- Expliquez les **ajustements** de façon factuelle (plus-values / moins-values).",
          "- Donnez une **fourchette** réaliste + un **prix de mise en vente** cohérent avec le délai souhaité.",
          "## Gérer l'écart avec le prix rêvé du vendeur",
          "Ne dites jamais « votre prix est trop élevé ». Dites : « Voici ce que le marché a payé pour des biens comparables. À [prix juste], voici mon plan pour vous vendre vite et au mieux ; à [prix élevé], voici ce qui risque de se passer. » Laissez les **faits** parler.",
          "## Toujours finir par la stratégie",
          "Prix + plan de diffusion + home-staging + reporting + délai estimé. Le vendeur n'achète pas un prix, il achète un **résultat**.",
        ],
      },
    ],
    quiz: [
      { question: "Quelle méthode domine en résidentiel ?", options: ["Par le revenu", "Par comparaison (ventes réelles)", "Par le coût", "Au feeling"], correct: 1, explication: "La comparaison à des biens vendus comparables (DVF) est la référence." },
      { question: "Quand l'intérêt pour un bien est-il maximal ?", options: ["Après 6 mois", "Les 3-4 premières semaines", "Après la 1re baisse", "À la publication du 2e lot de photos"], correct: 1, explication: "La fenêtre d'intérêt est au lancement : un prix juste dès le départ la capte." },
      { question: "Conséquence d'un bien surévalué ?", options: ["Vente plus rapide", "Vente plus longue et au final moins chère", "Plus de visites", "Aucun impact"], correct: 1, explication: "Le bien se grille, cumule les baisses et se vend sous le juste prix." },
    ],
  },

  // ======================================================================
  {
    id: "mandat",
    titre: "La prise de mandat",
    icone: "📝",
    categorie: "Commercial",
    resume: "Décrocher le mandat (idéalement exclusif), le rédiger dans les règles et sécuriser le dossier.",
    duree: "18 min",
    lecons: [
      {
        titre: "Simple, exclusif, semi-exclusif",
        contenu: [
          "- **Mandat simple** : le vendeur confie le bien à plusieurs agences ET peut vendre lui-même. Faible engagement, diffusion dispersée, guerre des prix, moins d'investissement de l'agent.",
          "- **Mandat exclusif** : une seule agence pendant une durée définie ; le vendeur ne peut pas vendre par une autre agence. En contrepartie : plus de moyens, meilleure maîtrise du prix, reporting.",
          "- **Semi-exclusif (exclusif co-mandat)** : exclusivité agence mais le vendeur garde le droit de vendre lui-même ; variante rassurante pour un vendeur hésitant.",
          "## Ce que disent les chiffres",
          "Les biens en **exclusivité se vendent statistiquement plus vite et plus près du prix** : l'agent y investit (home-staging, photos pro, diffusion premium) car il est sûr d'être rémunéré de son travail.",
          "L'exclusivité n'est pas une contrainte : c'est un **engagement de résultat** de votre part.",
        ],
      },
      {
        titre: "Argumenter et « closer » l'exclusivité",
        contenu: [
          "## Objection « je préfère plusieurs agences »",
          "- **« Plus d'agences ≠ plus d'acheteurs »** : ce sont les **mêmes** acquéreurs du secteur qui voient le bien partout → il se **banalise**, et paraît « invendable ».",
          "- Panneau multiple, photos différentes, prix qui varient : cela **dévalorise** le bien et inquiète l'acheteur.",
          "- En exclusivité, **un seul interlocuteur** pour le vendeur, un **reporting** régulier, un vrai plan marketing.",
          "## La contrepartie qui rassure",
          "Proposez un **engagement écrit** : nombre de visites garanties ou bilan sous X semaines, compte rendu après chaque visite, point hebdomadaire. Dans l'application, le **bilan de commercialisation** sert exactement à cela.",
          "## Techniques de closing",
          "- **Alternative** : « On part sur 3 ou 4 mois d'exclusivité ? »",
          "- **Projection** : « Imaginez : dans 8 semaines, c'est vendu au bon prix, vous enchaînez votre achat. »",
          "- **Engagement réciproque** : « Je m'engage sur le reporting, vous me donnez la visibilité pour performer. »",
        ],
      },
      {
        titre: "Rédiger un mandat conforme (loi Hoguet + ALUR)",
        contenu: [
          "Un mandat de vente doit notamment comporter :",
          "- L'**identité** complète des mandants (et la qualité à vendre : pleine propriété, indivision, succession, pouvoir du conjoint).",
          "- La **désignation précise du bien** et le **prix**.",
          "- La **rémunération** (montant TTC, qui la paie : vendeur ou acquéreur).",
          "- La **durée** du mandat et de l'**exclusivité** éventuelle.",
          "- Les **moyens mis en œuvre** et les **modalités de reddition de comptes** (apport ALUR).",
          "- Un **numéro de mandat** reporté sur le **registre des mandats** (obligatoire).",
          "## Durée & résiliation",
          "- Un mandat **exclusif** (ou avec clause pénale) peut être **dénoncé après 3 mois**, à tout moment, par **lettre recommandée AR** avec **préavis de 15 jours**.",
          "- Si le mandat est signé **à distance ou hors établissement** (hors agence), le vendeur dispose d'un **délai de rétractation de 14 jours**.",
          "## Règle d'or Hoguet",
          "**Pas de mandat écrit préalable = aucune rémunération**, même si la vente se fait grâce à vous.",
        ],
      },
      {
        titre: "Sécuriser le dossier & la conformité",
        contenu: [
          "La prise de mandat, c'est aussi l'ouverture d'un **dossier vendeur** complet.",
          "## Pièces à réunir",
          "- **Titre de propriété**, **pièce d'identité** des vendeurs.",
          "- **Diagnostics (DDT)** : DPE, amiante, plomb, électricité, gaz, ERP, Carrez/Boutin selon le cas.",
          "- En **copropriété** : règlement, PV d'AG (3 ans), charges, carnet d'entretien, pré-état daté.",
          "- **Taxe foncière**, éventuels documents d'urbanisme.",
          "## Conformité LCB-FT / Tracfin",
          "Dès l'entrée en relation, vous devez **identifier et vérifier** l'identité du client (**KYC**). La **fiche d'identification Tracfin** se génère automatiquement dans l'application à partir du dossier vendeur (pièce d'identité + titre de propriété). La **notation des risques** reste de votre responsabilité.",
          "## Dans l'application",
          "Le **dossier client** affiche les **pièces manquantes** d'un coup d'œil, le **fractionnement IA** trie un PDF unique en pièces classées, et la **fiche Tracfin** se génère en un clic.",
        ],
      },
    ],
    quiz: [
      { question: "Pourquoi « plus d'agences » n'aide pas la vente ?", options: ["Ça coûte plus cher", "Les mêmes acquéreurs voient le bien partout → banalisation", "C'est interdit", "Ça accélère toujours"], correct: 1, explication: "La multidiffusion présente le bien aux mêmes acquéreurs ; il paraît partout et « invendable »." },
      { question: "Un mandat exclusif peut être dénoncé…", options: ["À tout moment sans préavis", "Après 3 mois, par LRAR avec 15 jours de préavis", "Jamais", "Seulement par l'agence"], correct: 1, explication: "Après 3 mois, résiliation possible par lettre recommandée AR avec préavis de 15 jours." },
      { question: "Sans mandat écrit préalable, l'agent…", options: ["Est payé quand même", "Ne peut percevoir aucune rémunération (loi Hoguet)", "Touche la moitié", "Est payé si le vendeur accepte"], correct: 1, explication: "La loi Hoguet impose un mandat écrit préalable ; à défaut aucune commission n'est due." },
      { question: "Mandat signé hors établissement : délai de rétractation ?", options: ["0", "48 h", "14 jours", "1 mois"], correct: 2, explication: "Hors établissement / à distance, le vendeur dispose de 14 jours de rétractation." },
    ],
  },

  // ======================================================================
  {
    id: "negociation",
    titre: "La négociation",
    icone: "🤝",
    categorie: "Commercial",
    resume: "Préparer, traiter les objections, présenter l'offre et conclure un accord qui tient jusqu'à l'acte.",
    duree: "16 min",
    lecons: [
      {
        titre: "La négociation se gagne avant de commencer",
        contenu: [
          "80 % d'une négociation réussie, c'est la **préparation**.",
          "## Ce que vous devez savoir avant de négocier",
          "- La **motivation** et le **délai** de chaque partie (vendeur ET acquéreur).",
          "- La **valeur de marché** réelle (vos comparables DVF) — votre point d'ancrage factuel.",
          "- Le **financement** de l'acquéreur : une offre financée a dix fois plus de poids qu'une intention.",
          "- Les **marges de manœuvre** : jusqu'où le vendeur peut descendre, jusqu'où l'acquéreur peut monter.",
          "## Votre posture : tiers de confiance",
          "Vous n'êtes l'avocat de personne : vous **rapprochez** deux intérêts. Les deux parties doivent sentir que vous défendez l'**accord**, pas l'une contre l'autre.",
        ],
      },
      {
        titre: "Traiter les objections",
        contenu: [
          "Une objection est un **signal d'intérêt**, pas un refus. Méthode **« ÉCOUTER → REFORMULER → RÉPONDRE → VÉRIFIER »**.",
          "## Exemples",
          "- « C'est trop cher. » → « Qu'est-ce qui vous fait dire cela ? » (creuser) puis comparer au marché réel. → « Si on était dans le prix du marché, le bien vous conviendrait ? »",
          "- « Je vais réfléchir. » → identifier le **vrai frein** : prix ? financement ? doute sur le bien ? conjoint à convaincre ? On ne traite pas une objection qu'on n'a pas identifiée.",
          "- « Il y a des travaux. » → chiffrer factuellement et comparer au prix d'un bien équivalent rénové.",
          "## Règle",
          "Ne **contredisez jamais frontalement** : accueillez (« je comprends »), puis apportez la **preuve**. On ne gagne pas une négociation en ayant raison contre le client, mais en l'amenant à la bonne décision.",
        ],
      },
      {
        titre: "Présenter une offre et conclure",
        contenu: [
          "## Transmettre les offres",
          "Toute **offre d'achat écrite** doit être **transmise au vendeur** : c'est une obligation déontologique et légale.",
          "## Présenter avec le contexte",
          "Une offre ne se résume pas à un montant : présentez l'**acquéreur** (financé, sérieux, délai), la **solidité** du dossier, les **conditions**. Une offre un peu plus basse mais **sûre et rapide** vaut souvent mieux qu'une offre haute et fragile.",
          "## Travailler la contre-proposition",
          "Face à un écart, ne répondez pas « non » : proposez une **contre-offre** argumentée, cherchez les **contreparties** (délai, meubles, date de libération, conditions).",
          "## Conclure (closing)",
          "- **Verrouiller l'accord** : récapitulez par écrit prix, conditions, calendrier.",
          "- **Enchaîner vite** sur le compromis : un accord qui traîne est un accord qui meurt.",
          "- Viser un **gagnant-gagnant** : les deux parties doivent se sentir respectées pour que la vente **tienne jusqu'à l'acte**.",
        ],
      },
    ],
    quiz: [
      { question: "Une objection, c'est…", options: ["Un refus définitif", "Un signal d'intérêt à traiter", "Une attaque", "Une perte de temps"], correct: 1, explication: "Elle exprime un intérêt + un frein : accueillir, reformuler, répondre avec preuve." },
      { question: "Que faire de toute offre d'achat écrite ?", options: ["La filtrer selon le montant", "La transmettre au vendeur", "La garder si trop basse", "Attendre mieux"], correct: 1, explication: "L'agent doit transmettre au vendeur toutes les offres écrites reçues." },
      { question: "Entre deux offres, laquelle privilégier souvent ?", options: ["La plus haute, toujours", "La plus sûre et financée, même un peu plus basse", "La plus rapide à signer sans vérifier", "Peu importe"], correct: 1, explication: "Une offre financée et solide sécurise la vente ; une offre haute mais fragile tombe souvent." },
    ],
  },

  // ======================================================================
  {
    id: "transaction-notaire",
    titre: "La transaction & le notaire",
    icone: "🏛️",
    categorie: "Transaction",
    resume: "Le déroulé d'une vente, le rôle du notaire, l'attestation de propriété, les frais et le titre.",
    duree: "20 min",
    lecons: [
      {
        titre: "Le déroulé d'une transaction",
        contenu: [
          "Une vente immobilière suit une chaîne d'étapes que le négociateur doit **piloter de bout en bout** :",
          "- **1. Mandat** : accord écrit vendeur ↔ agence (voir module Prise de mandat).",
          "- **2. Mise en vente** : estimation, diffusion, visites, reporting.",
          "- **3. Offre d'achat** : écrite, transmise au vendeur, négociée.",
          "- **4. Avant-contrat** : compromis ou promesse, signé (souvent) chez le notaire ou à l'agence.",
          "- **5. Rétractation & conditions** : 10 jours SRU, condition suspensive de prêt, préemption, diagnostics.",
          "- **6. Acte authentique** : signature chez le notaire, paiement, remise des clés, publication.",
          "## Le fil rouge : le notaire",
          "Dès l'avant-contrat, le **notaire** entre dans la boucle. L'agent fait le **lien** entre vendeur, acquéreur, banque et notaire, et surveille les **délais** : c'est souvent là, entre compromis et acte, qu'une vente se perd faute de suivi.",
        ],
      },
      {
        titre: "Le rôle du notaire",
        contenu: [
          "Le **notaire** est un **officier public ministériel** : il agit au nom de l'État pour **authentifier** les actes et leur donner **force exécutoire** et **date certaine**.",
          "## Ses missions dans une vente",
          "- **Vérifier** la situation juridique du bien : titre de propriété, origine de propriété (30 ans), hypothèques, servitudes, urbanisme.",
          "- **Purger** les droits : droit de rétractation, conditions suspensives, **droit de préemption** (commune, locataire, SAFER…).",
          "- **Rédiger** et recevoir l'**acte authentique** de vente.",
          "- **Séquestrer** les fonds (dépôt de garantie puis prix), puis **répartir** (vendeur, créanciers, trésor public, honoraires d'agence).",
          "- **Publier** la vente au **service de publicité foncière** (ex-conservation des hypothèques) : c'est la publication qui rend la vente **opposable aux tiers**.",
          "## Notaire unique ou deux notaires",
          "Acquéreur et vendeur peuvent avoir **chacun leur notaire** : cela **ne coûte pas plus cher** (les notaires se partagent les émoluments). Un seul notaire est également possible.",
        ],
      },
      {
        titre: "L'attestation notariée de propriété",
        contenu: [
          "L'**attestation de propriété** (ou **attestation immobilière**) est un document **établi par le notaire** qui **certifie qu'une personne est propriétaire** d'un bien et **constate le transfert** de propriété. Attention à ne pas la confondre avec la **copie authentique de l'acte** (le titre complet).",
          "## Deux grands cas d'usage",
          "- **Après une VENTE** : le jour de la signature, le notaire remet une **attestation de propriété** (dite *attestation de vente*) à l'acquéreur. Elle est **provisoire** : elle prouve immédiatement la qualité de propriétaire (pour EDF, assurance, banque…) en attendant la **copie authentique** définitive, délivrée quelques mois plus tard après publication.",
          "- **Après un DÉCÈS (succession) ou une DONATION** : le notaire établit une **attestation immobilière** qui constate le transfert du bien aux **héritiers**. Elle est ici **définitive** et constitue leur **titre de propriété**.",
          "## Délais en succession",
          "- L'attestation doit être établie dans un **délai de 6 mois** après le décès.",
          "- Elle est **publiée au service de publicité foncière** dans les **2 mois** suivant sa signature.",
          "## À distinguer : l'acte de notoriété",
          "L'**acte de notoriété** **identifie les héritiers** et leurs droits ; l'**attestation immobilière** **transfère et publie** la propriété des biens. Les deux sont souvent établis ensemble dans une succession.",
          "## Pourquoi ça vous concerne",
          "Pour vendre, le propriétaire doit **justifier de son titre**. Sur un bien **issu d'une succession**, exigez l'**attestation immobilière** publiée : sans elle, la vente ne peut pas aboutir chez le notaire. Dans l'application, cette pièce se classe en **« Titre de propriété »** dans le dossier vendeur.",
        ],
      },
      {
        titre: "Les frais de notaire (frais d'acquisition)",
        contenu: [
          "Mal nommés : les « frais de notaire » sont en réalité des **frais d'acquisition**, dont le notaire ne garde qu'une petite part.",
          "## Leur composition",
          "- **Droits de mutation (DMTO)** : impôts versés à l'État et aux collectivités — la **plus grosse part** (environ **5,8 %** du prix dans l'ancien, selon les départements).",
          "- **Émoluments du notaire** : sa rémunération, **réglementée** et dégressive selon le prix.",
          "- **Débours & formalités** : sommes avancées par le notaire (documents, publication, géomètre…).",
          "## Ordre de grandeur",
          "- **Ancien** : environ **7 à 8 %** du prix de vente.",
          "- **Neuf / VEFA** : environ **2 à 3 %** (droits réduits).",
          "## Qui paie",
          "Les frais d'acquisition sont **à la charge de l'acquéreur**. À distinguer des **honoraires d'agence**, qui peuvent être à la charge du vendeur ou de l'acquéreur selon le mandat — un point à **clarifier tôt** car il impacte le calcul du budget et l'assiette des droits.",
        ],
      },
      {
        titre: "Titre de propriété & pièces à réunir",
        contenu: [
          "## Le titre de propriété",
          "C'est le document qui prouve que le vendeur est bien propriétaire : **copie authentique** de l'acte de vente antérieur, **attestation immobilière** (succession/donation), ou acte de partage. L'**origine de propriété** doit en principe être justifiée sur **30 ans**.",
          "## Ce que vous collectez dès le mandat",
          "- **Titre de propriété** (ou attestation notariée) et **pièce d'identité** des vendeurs.",
          "- **Dossier de diagnostics techniques (DDT)** complet.",
          "- En **copropriété** : règlement, PV d'AG, charges, carnet d'entretien, pré-état daté.",
          "- **Taxe foncière**, documents d'urbanisme, et tout élément sur d'éventuelles **servitudes** ou litiges.",
          "## Transmettre un dossier propre au notaire",
          "Plus le dossier remis au notaire est **complet et classé**, plus la vente va vite. Dans l'application, le **dossier vendeur** liste les **pièces manquantes**, le **fractionnement IA** trie un PDF unique en pièces classées, et vous générez la **fiche Tracfin** en un clic — autant de temps gagné jusqu'à l'acte.",
        ],
      },
    ],
    quiz: [
      { question: "Le notaire est…", options: ["Un commercial de l'agence", "Un officier public qui authentifie les actes", "Un agent de l'État des impôts", "Un avocat du vendeur"], correct: 1, explication: "Officier public ministériel, il authentifie les actes et leur donne force exécutoire et date certaine." },
      { question: "Après une VENTE, l'attestation de propriété remise à l'acquéreur est…", options: ["Définitive", "Provisoire, en attendant la copie authentique", "Inutile", "Un acte de notoriété"], correct: 1, explication: "C'est une attestation provisoire prouvant la qualité de propriétaire en attendant la copie authentique." },
      { question: "En succession, l'attestation immobilière doit être établie dans un délai de…", options: ["1 mois", "6 mois après le décès", "2 ans", "Aucun délai"], correct: 1, explication: "Dans les 6 mois après le décès, puis publiée au service de publicité foncière dans les 2 mois suivant sa signature." },
      { question: "Les « frais de notaire » dans l'ancien représentent surtout…", options: ["La rémunération du notaire", "Les droits de mutation (impôts) ~5,8 %", "Les honoraires d'agence", "Les frais bancaires"], correct: 1, explication: "La plus grosse part est constituée des droits de mutation (DMTO) versés à l'État et aux collectivités." },
      { question: "Quel document identifie les héritiers (≠ transfert du bien) ?", options: ["L'attestation immobilière", "L'acte de notoriété", "Le compromis", "Le DPE"], correct: 1, explication: "L'acte de notoriété identifie les héritiers ; l'attestation immobilière transfère et publie la propriété." },
    ],
  },

  {
    id: "loi-alur",
    titre: "Loi ALUR",
    icone: "⚖️",
    categorie: "Juridique",
    resume: "Honoraires, annonces, mandats, copropriété, DPE et formation : l'essentiel à jour de la loi ALUR.",
    duree: "24 min",
    lecons: [
      {
        titre: "Ce qu'a changé la loi ALUR (2014)",
        contenu: [
          "La **loi ALUR** (Accès au Logement et un Urbanisme Rénové, 24 mars 2014) a renforcé l'encadrement des professionnels de l'immobilier et la protection des consommateurs, en complément de la **loi Hoguet** (1970).",
          "## Principaux apports pour l'agent",
          "- **Transparence des honoraires** : affichage obligatoire, encadrement.",
          "- Renforcement des **mentions obligatoires** des annonces et des mandats.",
          "- **Formation continue obligatoire** pour renouveler la carte professionnelle.",
          "- **Code de déontologie** des professionnels et création du **CNTGI** (Conseil national de la transaction et de la gestion immobilières).",
          "- Information renforcée de l'acquéreur en **copropriété** (pré-état daté, PV d'AG, carnet d'entretien…).",
          "- Encadrement des **rapports locatifs** (bail type, encadrement des loyers dans certaines zones, plafonnement des honoraires de location à la charge du locataire).",
        ],
      },
      {
        titre: "Honoraires : affichage et publicité",
        contenu: [
          "Les règles d'affichage résultent notamment de l'**arrêté du 10 janvier 2017**, complété par l'**arrêté du 26 janvier 2022** (applicable depuis le 1ᵉʳ avril 2022).",
          "## Barème = plafond",
          "Le barème affiché est un **prix MAXIMUM TTC** : le professionnel peut négocier **à la baisse**, jamais dépasser. Il doit être **affiché en vitrine** (lisible depuis l'extérieur) **et** sur le site internet (accessible **en 2 clics** depuis l'accueil, onglet « honoraires »/« tarifs »).",
          "## Honoraires à la charge de l'acquéreur",
          "Quand les honoraires sont à la charge de l'acquéreur, ils doivent être exprimés en **pourcentage TTC de la valeur du bien hors honoraires**, et l'annonce doit faire apparaître le **prix hors honoraires** et le **montant/taux** des honoraires.",
          "## Qui paie ?",
          "Le mandat précise qui supporte les honoraires (vendeur ou acquéreur). L'information doit être **cohérente** entre mandat, annonce et compromis.",
        ],
      },
      {
        titre: "Mentions obligatoires des annonces (dont DPE)",
        contenu: [
          "Toute annonce de vente doit comporter des mentions précises :",
          "- Le **prix** et la mention « honoraires à la charge du vendeur » ou, si acquéreur, le **prix hors honoraires + le taux/montant** des honoraires.",
          "- Pour un bien en **copropriété** : le **statut de copropriété**, le **nombre de lots**, le **montant moyen des charges courantes**, et l'indication d'une éventuelle **procédure** (administration provisoire).",
          "## Les 4 mentions DPE obligatoires",
          "- **Classe énergie** (A à G) — depuis le 1ᵉʳ juillet 2021.",
          "- **Classe climat** (A à G, émissions de GES) — depuis le 1ᵉʳ juillet 2021.",
          "- **Estimation des coûts annuels d'énergie** (fourchette en € + année de référence) — depuis le 1ᵉʳ janvier 2022.",
          "- Pour un logement **F ou G** : la mention **« Logement à consommation énergétique excessive »** — depuis le 1ᵉʳ janvier 2022.",
          "Le **DPE est opposable** depuis juillet 2021 (le vendeur/bailleur engage sa responsabilité sur ses résultats).",
        ],
      },
      {
        titre: "Le mandat après ALUR",
        contenu: [
          "ALUR a renforcé le contenu du mandat. Il doit notamment préciser :",
          "- Les **moyens mis en œuvre** par l'agence pour diffuser le bien.",
          "- Les **modalités de reddition de comptes** au mandant (reporting des visites et actions).",
          "- La **durée**, l'**exclusivité** éventuelle et ses conditions de dénonciation.",
          "- Un **numéro** reporté au **registre des mandats**.",
          "## Rappels de durée / résiliation",
          "- Dénonciation d'un **mandat exclusif** possible **après 3 mois**, par **LRAR**, **préavis 15 jours**.",
          "- **14 jours** de rétractation si le mandat est conclu **hors établissement / à distance**.",
          "La **reddition de comptes** (bilan de commercialisation) n'est pas qu'une obligation : c'est un **outil commercial** qui rassure le vendeur et facilite les ajustements de prix.",
        ],
      },
      {
        titre: "Copropriété : informer l'acquéreur",
        contenu: [
          "ALUR a imposé une information renforcée de l'acquéreur d'un **lot de copropriété**, à communiquer selon l'avancement (dès l'annonce, puis à la promesse, puis à l'acte) :",
          "- **Règlement de copropriété** et état descriptif de division.",
          "- **PV des assemblées générales** (généralement les **3 dernières années**).",
          "- **Montant des charges** courantes et des **travaux votés**, fonds de travaux (loi ALUR : fonds de travaux obligatoire).",
          "- **Carnet d'entretien** de l'immeuble.",
          "- **Pré-état daté / état daté** (situation financière du vendeur vis-à-vis du syndicat).",
          "- **Diagnostic technique global (DTG)** s'il existe, et le cas échéant **surface Carrez**.",
          "Dans l'application, ces pièces sont suivies dans le **dossier vendeur** (pièces attendues) et le module **Pré-état daté** aide à les réunir.",
        ],
      },
      {
        titre: "Formation continue & déontologie",
        contenu: [
          "## Carte professionnelle",
          "La **carte professionnelle** (transaction « T », gestion « G », syndic « S ») est délivrée par la **CCI**, **valable 3 ans**, et renouvelable sous conditions (dont garantie financière, assurance RCP, honorabilité).",
          "## Obligation de formation",
          "Pour renouveler la carte, il faut justifier d'une **formation continue de 14 heures par an**, soit **42 heures sur 3 ans**. Le décret prévoit d'y consacrer notamment **2 heures à la non-discrimination** à l'accès au logement et **2 heures à la déontologie**.",
          "La formation couvre aussi, de plus en plus, la **LCB-FT (Tracfin)** — désormais une obligation à pouvoir justifier.",
          "## Déontologie",
          "Le **code de déontologie** impose notamment : respect des lois, compétence, transparence, confidentialité, défense des intérêts du client, non-discrimination. Un manquement peut entraîner des **sanctions** (jusqu'au retrait de carte).",
        ],
      },
    ],
    quiz: [
      { question: "Le barème d'honoraires affiché est…", options: ["Un prix minimum", "Un prix maximum TTC négociable à la baisse", "Indicatif sans valeur", "Fixé par l'État"], correct: 1, explication: "Depuis l'arrêté de 2022, c'est un plafond TTC : négociable à la baisse, jamais dépassable." },
      { question: "Combien de mentions DPE obligatoires dans une annonce ?", options: ["1", "2", "4", "6"], correct: 2, explication: "Classe énergie, classe climat, estimation des coûts annuels, et mention « consommation excessive » si F/G." },
      { question: "Formation continue pour renouveler la carte ?", options: ["Aucune", "14 h/an (42 h/3 ans)", "100 h/an", "Un examen annuel"], correct: 1, explication: "14 heures par an, soit 42 heures sur 3 ans, dont 2 h non-discrimination et 2 h déontologie." },
      { question: "Durée de validité de la carte professionnelle ?", options: ["1 an", "3 ans", "5 ans", "À vie"], correct: 1, explication: "La carte est valable 3 ans, renouvelable sous conditions (dont formation continue)." },
      { question: "Mention obligatoire pour un logement classé G ?", options: ["« Rénové »", "« Logement à consommation énergétique excessive »", "« Prix ferme »", "Aucune"], correct: 1, explication: "Depuis 2022, les logements F et G portent cette mention dans l'annonce." },
    ],
  },

  // ======================================================================
  {
    id: "cadre-legal",
    titre: "Cadre légal & conformité",
    icone: "🛡️",
    categorie: "Juridique",
    resume: "Loi Hoguet, vigilance Tracfin (LCB-FT) à jour 2026, RGPD et démarchage : vos obligations.",
    duree: "20 min",
    lecons: [
      {
        titre: "Loi Hoguet : le socle du métier",
        contenu: [
          "La **loi Hoguet** (2 janvier 1970) et son décret d'application encadrent l'exercice des professions immobilières.",
          "## Conditions d'exercice",
          "- **Carte professionnelle** (T, G, S) délivrée par la CCI, **valable 3 ans**.",
          "- **Garantie financière** (si maniement de fonds) et **assurance responsabilité civile professionnelle**.",
          "- **Mandat écrit préalable** obligatoire pour agir et être rémunéré.",
          "- Tenue d'un **registre des mandats** et d'un **registre-répertoire** des opérations.",
          "- **Aptitude professionnelle** (diplôme ou expérience) pour le titulaire de la carte.",
          "## Les collaborateurs",
          "Les négociateurs salariés ou agents commerciaux agissent sous la carte du titulaire, via une **attestation** (carte blanche / attestation d'habilitation). Ils sont soumis aux mêmes obligations déontologiques.",
        ],
      },
      {
        titre: "LCB-FT / Tracfin : vos obligations de vigilance",
        contenu: [
          "Les agents immobiliers (transaction ET gestion/location) sont des **professionnels assujettis** à la lutte contre le blanchiment de capitaux et le financement du terrorisme (**LCB-FT**). **Tracfin** est la cellule de renseignement financier du ministère de l'Économie.",
          "## Vos obligations opérationnelles",
          "- **Identifier et vérifier** l'identité du client (**KYC**) sur pièce officielle, dès l'entrée en relation.",
          "- Identifier le **bénéficiaire effectif** (personne physique détenant directement/indirectement **plus de 25 %** ou exerçant un contrôle), sur sources **vérifiables**, pas sur simple déclaration.",
          "- Évaluer et **classer le risque** (faible / standard / élevé) et adapter la vigilance.",
          "- Vérifier l'**origine des fonds** et surveiller les opérations **atypiques** (paiements en espèces/crypto, montages, prix incohérents, interposition de sociétés, urgence anormale).",
          "- **Conserver** les justificatifs (généralement 5 ans).",
          "## La déclaration de soupçon",
          "Le seuil n'est **pas l'infraction prouvée** mais la **simple suspicion**. En présence d'indices concordants, l'**absence de déclaration** à Tracfin est elle-même un **manquement sanctionnable**. La déclaration est **confidentielle** (interdiction d'informer le client).",
        ],
      },
      {
        titre: "Tracfin : ce qui a changé récemment",
        contenu: [
          "Le dispositif LCB-FT s'est **durci** pour l'immobilier.",
          "- La **formation LCB-FT** est désormais une obligation que les professionnels doivent pouvoir **justifier** (décret de 2026) : dirigeants, négociateurs, agents commerciaux, gestionnaires sont tous concernés.",
          "- Les **contrôles** (DGCCRF, autorités) se multiplient, avec des **sanctions** possibles (administratives et pénales).",
          "## En pratique dans l'agence",
          "- Procédures internes écrites, **nomination d'un responsable/déclarant** LCB-FT, traçabilité des vérifications.",
          "- Une **fiche de vigilance par dossier** (identité, bénéficiaire effectif, origine des fonds, niveau de risque, conclusion).",
          "## Dans l'application",
          "La **fiche d'identification Tracfin (KYC)** se génère automatiquement à partir du dossier vendeur (pièce d'identité + titre de propriété), une **fiche par vendeur**. La partie **notation des risques** reste à remplir et signer par vous : c'est **votre appréciation**, sous votre responsabilité.",
        ],
      },
      {
        titre: "RGPD & démarchage",
        contenu: [
          "Vous collectez et traitez des **données personnelles** (vendeurs, acquéreurs, prospects) : le **RGPD** et la loi Informatique et Libertés s'appliquent.",
          "## Principes clés",
          "- **Finalité & minimisation** : ne collectez que les données utiles, pour un usage défini.",
          "- **Base légale** : contrat, intérêt légitime, ou **consentement** (notamment pour la prospection).",
          "- **Information des personnes** et respect des droits : accès, rectification, **effacement**, opposition.",
          "- **Sécurité** et **durée de conservation limitée** (ex. prospects non convertis : durée raisonnable puis suppression).",
          "## Démarchage téléphonique : Bloctel",
          "Il est **interdit de démarcher** par téléphone un particulier inscrit sur **Bloctel** (liste d'opposition), sauf relation contractuelle en cours. Le non-respect est sanctionné. Respectez aussi les plages horaires et les règles d'opposition SMS/e-mail.",
        ],
      },
    ],
    quiz: [
      { question: "La carte « T » autorise…", options: ["La seule gestion locative", "La transaction immobilière", "Le syndic uniquement", "Le crédit"], correct: 1, explication: "La carte T (transaction) autorise l'entremise et la négociation immobilière (loi Hoguet)." },
      { question: "Un bénéficiaire effectif, c'est une personne physique détenant…", options: ["Plus de 10 %", "Plus de 25 % ou exerçant un contrôle", "100 %", "N'importe quelle part"], correct: 1, explication: "Détention directe/indirecte de plus de 25 % du capital/droits de vote, ou contrôle effectif." },
      { question: "Quand déclarer à Tracfin ?", options: ["Seulement si l'infraction est prouvée", "Dès la simple suspicion", "Jamais", "Après la vente seulement"], correct: 1, explication: "Le déclencheur est le soupçon ; ne pas déclarer malgré des indices est un manquement." },
      { question: "Peut-on démarcher un particulier inscrit sur Bloctel ?", options: ["Oui librement", "Non, sauf relation contractuelle en cours", "Oui le week-end", "Oui par SMS"], correct: 1, explication: "Le démarchage d'un inscrit Bloctel est interdit hors relation contractuelle existante." },
    ],
  },

  // ======================================================================
  {
    id: "compromis",
    titre: "Compromis & financement",
    icone: "🏦",
    categorie: "Juridique",
    resume: "De l'offre acceptée à l'acte : avant-contrat, rétractation SRU, conditions suspensives, prêt.",
    duree: "20 min",
    lecons: [
      {
        titre: "Promesse unilatérale ou compromis ?",
        contenu: [
          "Après accord sur le prix, on signe un **avant-contrat**. Deux formes principales :",
          "- **Compromis (promesse synallagmatique)** : engage **les deux parties** (vendeur à vendre, acquéreur à acheter), sous conditions suspensives. La forme la plus courante.",
          "- **Promesse unilatérale de vente (PUV)** : seul le **vendeur** s'engage à vendre ; l'acquéreur dispose d'une **option** (souvent 2-3 mois) moyennant une **indemnité d'immobilisation** (~10 %). S'il ne lève pas l'option, il perd l'indemnité (sauf condition suspensive non réalisée).",
          "## Dépôt de garantie",
          "Au compromis, l'acquéreur verse souvent **5 à 10 %** du prix, **séquestré** chez le notaire ou l'agent (si garantie financière). Il s'impute sur le prix à l'acte.",
          "## Délai compromis → acte",
          "Généralement **2 à 3 mois** : purge du droit de rétractation, obtention du prêt, levée des conditions, droit de préemption, rédaction notariée.",
        ],
      },
      {
        titre: "Le délai de rétractation SRU (10 jours)",
        contenu: [
          "L'acquéreur **non professionnel** d'un bien à usage d'habitation bénéficie d'un **délai de rétractation de 10 jours** (loi SRU, article L.271-1 du Code de la construction et de l'habitation).",
          "## Points clés",
          "- **10 jours calendaires** (et non ouvrés).",
          "- Le délai court **à compter du lendemain** de la **première présentation** de la notification de l'avant-contrat signé (LRAR, remise en main propre contre émargement, ou voie électronique).",
          "- **Aucune justification** n'est requise, et **aucune pénalité** : le dépôt de garantie est intégralement **restitué** (sous ~21 jours).",
          "- Ce droit bénéficie à l'**acquéreur**, pas au vendeur, qui est engagé dès la signature.",
          "## Vigilance pratique",
          "Soignez la **notification** : une notification mal faite peut rouvrir ou décaler le délai. C'est souvent le notaire qui notifie.",
        ],
      },
      {
        titre: "Les conditions suspensives",
        contenu: [
          "Une **condition suspensive** suspend la vente à la réalisation d'un événement futur. Si elle ne se réalise pas, la vente est **annulée** et le dépôt **restitué**.",
          "## Les plus fréquentes",
          "- **Obtention du prêt** (condition protectrice légale — voir leçon suivante).",
          "- **Absence de servitude** d'urbanisme grave, de préemption exercée (mairie…), ou d'hypothèque supérieure au prix.",
          "- Obtention d'une **autorisation** (permis, etc.) selon le projet.",
          "## Rédaction = sécurité",
          "Une condition mal rédigée fait **tomber des ventes** ou crée du contentieux. Pour le prêt, la clause doit préciser : **montant**, **durée maximale**, **taux maximal**, **délai** d'obtention. Un acquéreur qui ne respecte pas ses obligations (ne dépose pas de demande conforme) peut être considéré comme ayant **fait échouer** la condition à ses torts.",
        ],
      },
      {
        titre: "Financer l'acquéreur : loi Scrivener",
        contenu: [
          "Le financement est la **première cause d'échec** d'une vente. L'accompagner, c'est sécuriser le compromis.",
          "## Condition suspensive de prêt (art. L.313-41 C. conso, ex-loi Scrivener)",
          "- **Obligatoire** dès que l'acquéreur recourt à un crédit (sauf renonciation manuscrite encadrée).",
          "- **Durée minimale légale : 1 mois** ; en pratique on prévoit **45 à 60 jours**.",
          "- Si le prêt est **refusé** dans les conditions prévues, la vente est **annulée** et le dépôt **restitué**.",
          "## Délais de réflexion / acceptation (offre de prêt)",
          "- L'**offre de prêt** est **valable 30 jours** et ne peut être **acceptée qu'après un délai de réflexion de 10 jours** (l'emprunteur ne peut pas signer avant le 11ᵉ jour).",
          "## Votre rôle",
          "- **Qualifier le financement en amont** (apport, endettement ~35 %, durée ≤ 25 ans).",
          "- Orienter rapidement vers **banque/courtier** dès le compromis.",
          "- **Suivre les délais** de la condition suspensive et relancer l'acquéreur : un dossier bancaire qui traîne, c'est une vente en danger.",
        ],
      },
      {
        titre: "Du compromis à l'acte authentique",
        contenu: [
          "Entre l'avant-contrat et la signature chez le notaire, plusieurs étapes se purgent :",
          "- **Droit de rétractation** (10 jours) de l'acquéreur.",
          "- **Conditions suspensives** (prêt, urbanisme…) à lever.",
          "- **Droit de préemption** éventuel (commune, SAFER en zone agricole, locataire en place…).",
          "- Constitution du dossier par le **notaire** (titre, diagnostics, état hypothécaire, syndic…).",
          "## Signature de l'acte",
          "À l'acte authentique : paiement du prix et des frais, remise des clés, publication au **service de publicité foncière**. Les **honoraires** d'agence sont réglés conformément au mandat.",
          "## Rôle de l'agent jusqu'au bout",
          "Vous **pilotez** les délais, relancez les parties, faites le lien avec le notaire et la banque. Une vente se **perd souvent entre le compromis et l'acte** faute de suivi : c'est là que le professionnalisme fait la différence.",
        ],
      },
    ],
    quiz: [
      { question: "Délai de rétractation SRU de l'acquéreur non pro ?", options: ["48 h", "7 jours", "10 jours calendaires", "1 mois"], correct: 2, explication: "10 jours calendaires, à compter du lendemain de la 1re présentation de la notification." },
      { question: "La condition suspensive de prêt a une durée minimale légale de…", options: ["10 jours", "1 mois", "3 mois", "6 mois"], correct: 1, explication: "Minimum légal 1 mois (art. L.313-41 C. conso) ; en pratique 45-60 jours." },
      { question: "L'offre de prêt peut être acceptée…", options: ["Immédiatement", "Après un délai de réflexion de 10 jours", "Après 30 jours obligatoires", "Sans délai"], correct: 1, explication: "Délai de réflexion de 10 jours : acceptation possible au plus tôt le 11e jour ; offre valable 30 jours." },
      { question: "En cas de rétractation dans les 10 jours, le dépôt de garantie est…", options: ["Conservé par le vendeur", "Restitué intégralement à l'acquéreur", "Partagé", "Versé à l'agence"], correct: 1, explication: "Rétractation sans motif ni pénalité : le dépôt est restitué (sous ~21 jours)." },
    ],
  },

  // ======================================================================
  {
    id: "dpe-energie",
    titre: "DPE & performance énergétique",
    icone: "🌡️",
    categorie: "Juridique",
    resume: "DPE opposable, mentions, audit énergétique et calendrier des passoires thermiques.",
    duree: "16 min",
    lecons: [
      {
        titre: "Le DPE : définition et valeur",
        contenu: [
          "Le **Diagnostic de Performance Énergétique (DPE)** classe un logement de **A à G** sur sa consommation d'énergie (classe énergie) et ses émissions de gaz à effet de serre (classe climat).",
          "## Points essentiels",
          "- **Validité : 10 ans** (sauf DPE anciens dont la validité a été écourtée par la réforme).",
          "- **Opposable depuis le 1ᵉʳ juillet 2021** : le vendeur/bailleur engage sa **responsabilité** sur ses résultats (un DPE erroné peut être contesté).",
          "- Méthode de calcul unifiée (**3CL**) depuis la réforme 2021.",
          "- Obligatoire dans le **dossier de diagnostics techniques (DDT)** annexé au compromis puis à l'acte.",
          "## Pourquoi c'est devenu central",
          "Le DPE conditionne désormais la **valeur**, la **louabilité** et parfois la **vendabilité** d'un bien : c'est un argument commercial majeur et un point de vigilance juridique.",
        ],
      },
      {
        titre: "Audit énergétique obligatoire (vente)",
        contenu: [
          "Pour la **vente** d'une **maison individuelle** ou d'un **immeuble entier en mono-propriété** classé parmi les plus énergivores, un **audit énergétique** doit être remis dès la première visite et annexé au compromis.",
          "## Calendrier d'entrée en vigueur",
          "- **Classes F et G** : depuis le **1ᵉʳ avril 2023**.",
          "- **Classe E** : depuis le **1ᵉʳ janvier 2025**.",
          "- **Classe D** : à compter du **1ᵉʳ janvier 2034**.",
          "## Contenu de l'audit",
          "Il propose des **scénarios de travaux** (dont un pour atteindre au moins la classe **E**, puis **B** à terme), avec estimation des coûts, des économies d'énergie et des aides mobilisables. Il **informe l'acquéreur** sans l'obliger à réaliser les travaux.",
          "## À ne pas confondre",
          "L'**audit énergétique** (vente de passoires/maisons) ≠ le **DPE** (tous les biens). L'audit est plus détaillé et oriente vers une rénovation.",
        ],
      },
      {
        titre: "Passoires thermiques : le calendrier location",
        contenu: [
          "La **loi Climat et résilience** interdit progressivement la **mise en location** des logements les plus énergivores (critère de **décence énergétique**).",
          "## Calendrier des interdictions de louer",
          "- **Depuis le 1ᵉʳ janvier 2023** : logements consommant plus de **450 kWh/m²/an** (partie des G).",
          "- **Depuis le 1ᵉʳ janvier 2025** : **classe G**.",
          "- **1ᵉʳ janvier 2028** : **classe F**.",
          "- **1ᵉʳ janvier 2034** : **classe E**.",
          "## Autres mesures",
          "- **Gel des loyers** des passoires (F/G) : interdiction d'augmenter le loyer depuis le 24 août 2022.",
          "- Ces règles concernent la **location** ; elles n'interdisent pas la **vente**, mais pèsent fortement sur la **valeur** et l'argumentaire (bien non louable en l'état).",
          "## Opportunité commerciale",
          "Une passoire thermique est aussi une **opportunité** : acquéreur investisseur/rénovateur, négociation sur le coût des travaux, mobilisation des aides (MaPrimeRénov', éco-PTZ).",
        ],
      },
    ],
    quiz: [
      { question: "Durée de validité d'un DPE récent ?", options: ["3 ans", "5 ans", "10 ans", "À vie"], correct: 2, explication: "10 ans (sauf anciens DPE dont la validité a été écourtée par la réforme)." },
      { question: "Depuis quand le DPE est-il opposable ?", options: ["2011", "1er juillet 2021", "2024", "Il ne l'est pas"], correct: 1, explication: "Opposable depuis le 1er juillet 2021 : responsabilité engagée sur ses résultats." },
      { question: "Depuis 2025, quelle classe est interdite à la location ?", options: ["E", "F", "G", "D"], correct: 2, explication: "Classe G interdite à la location depuis le 1er janvier 2025 (F en 2028, E en 2034)." },
      { question: "L'audit énergétique de vente concerne depuis 2025 les classes…", options: ["A et B", "F et G seulement", "E (en plus de F et G)", "Toutes"], correct: 2, explication: "F/G depuis avril 2023, E depuis janvier 2025, D à partir de 2034." },
    ],
  },
];
