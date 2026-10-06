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

export type NiveauFormation = "Débutant" | "Confirmé" | "Expert";

export interface ModuleFormation {
  id: string;
  titre: string;
  icone: string;
  categorie: "Commercial" | "Transaction" | "Juridique";
  niveau: NiveauFormation; // assigné automatiquement (voir NIVEAUX)
  resume: string;
  duree: string; // durée de lecture estimée
  lecons: Lecon[];
  quiz: QuizItem[];
}

// Niveau pédagogique par module (clé = id). Les fondamentaux du métier et le
// socle juridique sont « Débutant » ; les techniques avancées de vente/closing
// et l'ingénierie (investissement, VEFA, fiscalité) sont « Expert ».
const NIVEAUX: Record<string, NiveauFormation> = {
  prospection: "Débutant", decouverte: "Débutant", estimation: "Débutant",
  "transaction-notaire": "Débutant", "loi-alur": "Débutant", "cadre-legal": "Débutant",
  mandat: "Confirmé", negociation: "Confirmé", "mots-vente": "Confirmé",
  "defendre-prix": "Confirmé", compromis: "Confirmé", "dpe-energie": "Confirmé",
  "marketing-bien": "Confirmé", "location-baux": "Confirmé",
  "vente-elite": "Expert", objections: "Expert", closing: "Expert",
  "mental-performance": "Expert", "investissement-locatif": "Expert",
  "vefa-neuf": "Expert", "plus-value": "Expert",
};

const MODULES_BRUTS: Omit<ModuleFormation, "niveau">[] = [
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
    id: "vente-elite",
    titre: "Vente d'élite : argumenter & persuader",
    icone: "🏆",
    categorie: "Commercial",
    resume: "Techniques de persuasion des meilleurs vendeurs (inspirées de Michaël Aguilar), appliquées à l'immobilier.",
    duree: "22 min",
    lecons: [
      {
        titre: "Vendre de l'émotion, pas des caractéristiques",
        contenu: [
          "Les meilleurs vendeurs ne vendent pas un produit : ils font **naître une envie**. En immobilier, on n'achète pas 90 m² et 3 chambres — on achète **un projet de vie**, une émotion, un statut, une sécurité.",
          "## Les trois leviers des vendeurs d'élite",
          "- **Vendre une émotion** : faites *ressentir* le bien (« imaginez vos enfants jouer dans ce jardin le dimanche »), pas seulement décrire.",
          "- **Raconter une histoire** : l'histoire du quartier, de la maison, des précédents propriétaires heureux — le cerveau retient une histoire, pas une fiche technique.",
          "- **Vendre de l'espoir / une projection** : montrez le *après*, la vie meilleure que ce bien permet.",
          "## La conviction est contagieuse",
          "Un vendeur qui **croit** à son bien et à son prix transmet cette conviction. Si vous doutez (d'un prix, d'un argument), le client le sent. L'enthousiasme sincère est votre premier outil de persuasion.",
          "## En pratique",
          "Avant une visite ou un R2, préparez **l'émotion** que vous voulez créer et **l'histoire** que vous allez raconter — pas seulement les chiffres.",
        ],
      },
      {
        titre: "La méthode CAP/SONCAS",
        contenu: [
          "Un argument qui porte suit la structure **CAP** et vise le **bon levier SONCAS** du client (voir module Découverte).",
          "## CAP : Caractéristique → Avantage → Preuve",
          "- **C — Caractéristique** : le fait objectif (« double vitrage, isolation 2021 »).",
          "- **A — Avantage** : ce que ça apporte AU CLIENT (« vous économisez sur le chauffage et c'est silencieux »).",
          "- **P — Preuve** : ce qui rend l'avantage crédible (DPE classe C, factures, attestation, témoignage).",
          "Une caractéristique seule n'a aucune valeur : c'est l'**avantage prouvé** qui vend.",
          "## Brancher sur le levier du client (SONCAS)",
          "Le même bien s'argumente différemment selon la motivation dominante :",
          "- **Sécurité** → « quartier calme, diagnostics OK, pas de travaux » + preuve.",
          "- **Argent** → « 3 % sous le prix du marché, forte revente » + comparables.",
          "- **Confort** → « plain-pied, tout à pied » ; **Orgueil** → « adresse prisée »…",
          "## En immobilier",
          "Pour défendre un **prix** ou décrocher un **mandat exclusif**, construisez chaque argument en CAP, orienté sur le levier dominant du vendeur/acquéreur.",
        ],
      },
      {
        titre: "Les 7 règles de l'argumentation persuasive",
        contenu: [
          "Inspirées des techniques des vendeurs d'élite :",
          "- **1. Parler bénéfices, pas fonctions** : traduisez toujours en avantage concret pour CE client.",
          "- **2. Prouver** : chiffres, comparables DVF, témoignages, documents. Une affirmation non prouvée est suspecte.",
          "- **3. Impliquer** : faites participer (« projetez-vous : où mettriez-vous le canapé ? »). On adhère à ce qu'on a contribué à construire.",
          "- **4. Créer des images** : le cerveau achète des images mentales (« un cocon », « une bulle de calme »).",
          "- **5. Un argument fort vaut mieux que dix faibles** : hiérarchisez, gardez votre meilleur pour la fin.",
          "- **6. Poser des questions d'engagement** : « c'est important pour vous, la luminosité ? » → des petits « oui » qui préparent le grand oui.",
          "- **7. Maîtriser le rythme et le silence** : après un argument fort ou une question de closing, **taisez-vous**. Le premier qui parle « perd ».",
        ],
      },
      {
        titre: "La preuve sociale & la recommandation",
        contenu: [
          "On se fie à ce que font les autres. La **preuve sociale** est un accélérateur puissant.",
          "- **Références locales** : « j'ai vendu 3 biens dans cette rue cette année » ; panneaux « Vendu ».",
          "- **Témoignages & avis** : avis Google, mots de clients satisfaits — montrez-les.",
          "- **Effet de rareté / file d'attente** : « j'ai déjà deux acquéreurs à qui je dois le présenter » (si c'est vrai).",
          "## La recommandation : votre meilleure source",
          "Un client satisfait vaut dix prospects froids. **Demandez explicitement** : « Si vous êtes content de mon travail, connaissez-vous quelqu'un qui envisage de vendre ou d'acheter ? » La recommandation se **provoque**, elle ne tombe pas du ciel.",
        ],
      },
    ],
    quiz: [
      { question: "En immobilier, le client achète d'abord…", options: ["Des m² et des chambres", "Un projet de vie / une émotion", "Un DPE", "Une adresse IP"], correct: 1, explication: "On vend une projection, une émotion, un statut — pas une fiche technique." },
      { question: "Dans CAP, le « A » signifie…", options: ["Argument", "Avantage pour le client", "Affirmation", "Accroche"], correct: 1, explication: "Caractéristique → Avantage (bénéfice client) → Preuve." },
      { question: "Après une question de conclusion, le vendeur d'élite…", options: ["Enchaîne un autre argument", "Se tait et laisse le silence agir", "Baisse le prix", "Récapitule tout"], correct: 1, explication: "Le silence met le client en situation de décider ; le premier qui parle affaiblit sa position." },
      { question: "La preuve sociale, c'est par exemple…", options: ["Baisser sa commission", "Montrer ses ventes récentes et avis clients", "Parler plus fort", "Cacher les défauts"], correct: 1, explication: "On s'appuie sur ce que d'autres ont fait (ventes, témoignages) pour rassurer et convaincre." },
    ],
  },

  {
    id: "objections",
    titre: "Vaincre les objections",
    icone: "🛡️",
    categorie: "Commercial",
    resume: "Transformer chaque objection (prix, « je vais réfléchir »…) en pas vers la signature.",
    duree: "20 min",
    lecons: [
      {
        titre: "Comprendre l'objection",
        contenu: [
          "Une objection n'est pas un « non » : c'est une **demande d'information ou de réassurance**, souvent le **signe que le client s'intéresse**. Un client indifférent n'objecte pas.",
          "## Sincère ou prétexte ?",
          "- **Objection sincère** : un vrai frein (prix, financement, un défaut du bien). → à traiter.",
          "- **Prétexte / fausse barbe** : « je vais réfléchir » qui cache autre chose. → à faire préciser.",
          "## La règle d'or",
          "On ne traite **jamais** une objection qu'on n'a pas **comprise**. Avant de répondre, on **creuse** : « Qu'est-ce qui vous fait dire cela ? », « C'est-à-dire ? ».",
          "Ne la prenez pas comme une attaque : accueillez-la (« bonne question », « je comprends ») pour rester allié du client.",
        ],
      },
      {
        titre: "La méthode en 4 temps (Creuser · Reformuler · Argumenter · Contrôler)",
        contenu: [
          "Une trame simple et redoutable pour toute objection :",
          "- **1. Creuser** : faire préciser pour isoler le vrai frein. « Qu'entendez-vous par trop cher ? », « Par rapport à quoi ? ».",
          "- **2. Reformuler / isoler** : « Donc si je comprends bien, à part le prix, tout vous convient ? » → on **isole** l'objection (technique du « sauf ça ? »). S'il dit oui, il ne reste qu'un obstacle à lever.",
          "- **3. Argumenter** : répondre avec une **preuve** (comparables, chiffres, démonstration), en CAP, pas une opinion.",
          "- **4. Contrôler / verrouiller** : vérifier que c'est réglé. « Ce point est clair pour vous ? On peut avancer ? »",
          "## Pourquoi isoler est décisif",
          "Isoler évite le **jeu des objections infinies** (« oui mais… oui mais… »). Une fois l'unique frein identifié et levé, il n'y a plus de raison de ne pas conclure.",
        ],
      },
      {
        titre: "« C'est trop cher »",
        contenu: [
          "L'objection prix est la plus fréquente — côté acquéreur (prix du bien) comme côté vendeur (vos honoraires).",
          "## Techniques",
          "- **Creuser** : « Trop cher par rapport à quoi ? » (au marché ? à son budget ? à un autre bien ?).",
          "- **Comparer au marché réel** : sortez vos **ventes DVF comparables** — le prix juste n'est pas une opinion.",
          "- **Décomposer / relativiser** : ramener l'écart à sa juste proportion (« 5 000 € sur 300 000 €, c'est 1,6 %, et sur 20 ans de prêt c'est quelques euros par mois »).",
          "- **Valoriser** : rappeler ce qui justifie le prix (emplacement, état, rareté, absence de travaux).",
          "## Côté honoraires d'agence",
          "Ne vous **justifiez pas en vous excusant**. Montrez la **valeur** : meilleur prix de vente obtenu, sécurité juridique, temps gagné, acquéreurs qualifiés. « Mes honoraires ne vous coûtent pas : ils vous rapportent. » (Voir module Défendre ses honoraires.)",
        ],
      },
      {
        titre: "« Je vais réfléchir »",
        contenu: [
          "La reine des fausses objections : elle cache presque toujours un **frein non exprimé** (prix, doute, conjoint à convaincre, financement).",
          "## Ne jamais lâcher sur un « je vais réfléchir » nu",
          "- **Accueillir** : « Vous avez raison de bien réfléchir, c'est une décision importante. »",
          "- **Faire préciser** : « Pour vous aider, qu'est-ce qui vous retient encore ? Le prix, le bien, le timing ? »",
          "- **Isoler** : « À part ce point, tout le reste vous convient ? »",
          "- **Fixer une échéance** : jamais « rappelez-moi quand vous voulez ». Toujours « on se refait un point **jeudi 18 h**, ça vous va ? ».",
          "## En immobilier",
          "Sur un bien qui plaît, rappelez le **risque de perte** (rareté, autres acquéreurs) sans bluffer : « ce type de bien part vite sur le secteur ». La peur de rater (FOMO) est un moteur de décision puissant et légitime quand elle est réelle.",
        ],
      },
    ],
    quiz: [
      { question: "Une objection est le plus souvent le signe que…", options: ["Le client n'est pas intéressé", "Le client s'intéresse et veut être rassuré", "Il faut baisser le prix", "La vente est perdue"], correct: 1, explication: "Un client indifférent n'objecte pas : l'objection traduit un intérêt + un frein à lever." },
      { question: "Avant de répondre à une objection, il faut d'abord…", options: ["Baisser le prix", "La creuser pour comprendre le vrai frein", "Changer de sujet", "Conclure vite"], correct: 1, explication: "On ne traite jamais une objection qu'on n'a pas comprise : creuser puis isoler." },
      { question: "Face à « je vais réfléchir », la meilleure réaction est…", options: ["« Rappelez-moi quand vous voulez »", "Faire préciser le frein et fixer une échéance", "Insister lourdement", "Abandonner"], correct: 1, explication: "On fait exprimer le vrai frein, on l'isole, et on fixe un rendez-vous daté de suivi." },
      { question: "« À part ce point, tout vous convient ? » sert à…", options: ["Vendre plus cher", "Isoler l'objection pour éviter les objections en chaîne", "Gagner du temps", "Changer de bien"], correct: 1, explication: "Isoler l'objection : une fois l'unique frein levé, il n'y a plus de raison de ne pas avancer." },
    ],
  },

  {
    id: "closing",
    titre: "Conclure la vente (closing)",
    icone: "✍️",
    categorie: "Commercial",
    resume: "Repérer les signaux d'achat, oser conclure et maîtriser les grandes techniques de conclusion.",
    duree: "20 min",
    lecons: [
      {
        titre: "Les signaux d'achat : quand conclure",
        contenu: [
          "La première erreur en conclusion : **ne pas oser**, ou conclure **trop tard**. Il faut repérer le moment où le client est mûr.",
          "## Signaux verbaux",
          "- Il se projette : « et si on mettait le bureau ici ? », « les travaux coûteraient combien ? ».",
          "- Il pose des questions de **détail concret** : disponibilité, date d'entrée, modalités, financement.",
          "- Il demande une **confirmation** : « donc les charges sont bien de… ? ».",
          "## Signaux non verbaux",
          "- Il relit les documents, reprend les photos, revient sur une pièce.",
          "- Changement d'attitude : il se détend, sourit, se montre plus chaleureux, interroge son conjoint du regard.",
          "## La règle",
          "Dès qu'un signal apparaît, **arrêtez d'argumenter** et **engagez la conclusion**. Continuer à vendre quand c'est gagné, c'est risquer de **re-créer** des objections.",
        ],
      },
      {
        titre: "Les grandes techniques de conclusion",
        contenu: [
          "Adaptez la technique au client et au moment :",
          "- **L'alternative** : proposer un choix entre deux « oui ». « On part sur le mandat 3 ou 4 mois ? », « Signature mardi ou jeudi ? ».",
          "- **Le bilan (balance)** : récapituler les avantages (nombreux) face aux réserves (peu) pour faire pencher la décision.",
          "- **La dernière objection** : « Si je règle ce point, on y va ? » — on transforme le dernier frein en condition de signature.",
          "- **La présomption / l'affaire conclue** : agir comme si c'était fait (« je prépare l'offre, vous me confirmez l'adresse pour le compromis »).",
          "- **L'urgence / la rareté** (réelle) : « ce bien a déjà deux visites prévues ce week-end ».",
          "- **La projection** : faire visualiser la vie *après* la décision.",
          "- **Le petit oui** : enchaîner des accords partiels jusqu'au oui final.",
          "## Oser demander",
          "La technique ne remplace pas le courage de **poser la question de conclusion** et de **se taire** ensuite.",
        ],
      },
      {
        titre: "Conclure en immobilier : mandat & offre",
        contenu: [
          "## Conclure la prise de mandat",
          "- Après l'avis de valeur, **enchaînez** : « On est d'accord sur le prix et la stratégie — je prépare le mandat, exclusivité 3 mois, on signe maintenant ? » (alternative + présomption).",
          "- Levez la dernière objection : « Qu'est-ce qui vous empêcherait de me confier la vente aujourd'hui ? ».",
          "## Conclure une offre d'achat",
          "- Dès les signaux d'achat de l'acquéreur : « À ce prix, vous la prenez ? Je rédige l'offre tout de suite. »",
          "- **Faites écrire l'offre** sans attendre : une intention orale ne vaut rien, une offre écrite engage et accélère.",
          "- Côté vendeur, présentez l'offre avec son contexte et **concluez l'acceptation** : « c'est un acquéreur financé et sérieux, on accepte ? ».",
          "## Après le oui",
          "On **verrouille par écrit** et on **enchaîne** immédiatement vers le compromis : le temps est l'ennemi de la vente conclue.",
        ],
      },
    ],
    quiz: [
      { question: "Dès qu'un signal d'achat apparaît, il faut…", options: ["Ajouter des arguments", "Engager la conclusion", "Baisser le prix", "Reporter"], correct: 1, explication: "Continuer d'argumenter quand c'est gagné risque de recréer des objections : on conclut." },
      { question: "La technique de « l'alternative » consiste à…", options: ["Proposer un choix entre deux oui", "Laisser le client décider seul", "Donner une seule option", "Baisser la commission"], correct: 0, explication: "« Mardi ou jeudi ? », « 3 ou 4 mois ? » : le client choisit, mais dans tous les cas il dit oui." },
      { question: "Face à une intention d'achat orale, le bon réflexe est…", options: ["Attendre quelques jours", "Faire rédiger l'offre écrite tout de suite", "Augmenter le prix", "Ne rien faire"], correct: 1, explication: "Une offre écrite engage et accélère ; l'oral ne vaut rien et laisse le temps au doute." },
    ],
  },

  {
    id: "mots-vente",
    titre: "Les mots qui font vendre",
    icone: "💬",
    categorie: "Commercial",
    resume: "Le bon vocabulaire persuasif, les « mots noirs » à bannir et le pouvoir du storytelling.",
    duree: "14 min",
    lecons: [
      {
        titre: "Les mots noirs à bannir",
        contenu: [
          "Certains mots **activent la peur ou la méfiance**. Les vendeurs d'élite les remplacent systématiquement.",
          "## À éviter → à dire",
          "- **Prix / coût / dépense** → **investissement**, **budget**, **montant**.",
          "- **Contrat / signature** (anxiogènes) → **accord**, **on officialise**, **on valide ensemble**.",
          "- **Problème** → **point à regarder**, **sujet**.",
          "- **Cher** → **une valeur**, **un bien de qualité**.",
          "- **Essayer / peut-être / j'espère** (faibles) → **vous allez**, **vous obtiendrez**.",
          "- **Objection** (ne jamais la nommer) ; **« ne vous inquiétez pas »** (installe l'inquiétude) → « vous êtes serein, car… ».",
          "## Pourquoi",
          "Le cerveau ne traite pas bien la négation et retient les mots chargés. Choisir ses mots, c'est **orienter la perception** du client.",
        ],
      },
      {
        titre: "Le storytelling immobilier",
        contenu: [
          "Une annonce et une visite marquent quand elles **racontent une histoire**, pas quand elles listent des m².",
          "## Construire l'histoire d'un bien",
          "- **Le lieu** : « une rue calme où l'on entend les oiseaux le matin ».",
          "- **La vie possible** : « les étés sur cette terrasse plein sud, les repas de famille ».",
          "- **Le détail qui ancre** : la cheminée d'origine, l'arbre centenaire, l'atelier du grand-père.",
          "## Faire vivre, pas décrire",
          "« Séjour de 35 m² exposé sud » → « Un séjour baigné de lumière toute la journée, où l'on se voit déjà recevoir ses amis. » On passe de la **donnée** à l'**émotion**.",
          "Dans l'application, la **génération d'annonce** peut produire ce type de texte ; à vous d'y ajouter l'émotion vraie du terrain.",
        ],
      },
      {
        titre: "Questions et formulations d'engagement",
        contenu: [
          "Les bonnes formulations **font avancer** vers la décision sans forcer.",
          "- **Présupposés positifs** : « Quand vous serez installés… », « Lorsque nous aurons signé… » — on parle déjà de l'après.",
          "- **Questions d'engagement** : « C'est important pour vous, un extérieur ? » → accumuler des oui.",
          "- **La reformulation valorisante** : reprendre les mots du client en les positivant.",
          "- **Le « nous »** : « voyons ensemble », « on va trouver » — on crée l'alliance.",
          "## Attention à la cohérence",
          "Les mots ne remplacent pas la **sincérité** : un storytelling creux ou des formules plaquées se repèrent. La technique sert une relation honnête, elle ne la simule pas.",
        ],
      },
    ],
    quiz: [
      { question: "Au lieu de « prix / dépense », mieux vaut dire…", options: ["« coût »", "« investissement / budget »", "« facture »", "« addition »"], correct: 1, explication: "On remplace les mots anxiogènes par des termes valorisants : investissement, budget, montant." },
      { question: "« Ne vous inquiétez pas » est à éviter car…", options: ["C'est trop long", "La négation installe l'idée d'inquiétude", "C'est impoli", "Ça fait vendeur"], correct: 1, explication: "Le cerveau retient « inquiétude » ; on formule au positif (« vous êtes serein, car… »)." },
      { question: "Le storytelling consiste à…", options: ["Lister les m² et équipements", "Faire vivre une émotion et une projection", "Cacher les défauts", "Parler du prix d'abord"], correct: 1, explication: "On passe de la donnée à l'émotion : le client achète une histoire et une projection." },
    ],
  },

  {
    id: "defendre-prix",
    titre: "Défendre ses honoraires",
    icone: "💶",
    categorie: "Commercial",
    resume: "Ne plus brader sa commission : assumer sa valeur et négocier toute concession.",
    duree: "14 min",
    lecons: [
      {
        titre: "Pourquoi ne pas brader",
        contenu: [
          "Baisser ses honoraires au premier froncement de sourcil est une erreur stratégique et financière.",
          "- **Ça dévalorise** : un professionnel qui casse son prix sans raison envoie le message qu'il ne vaut pas son tarif — et le doute s'étend au reste de sa prestation.",
          "- **Ça entame directement la marge** : en honoraires, chaque euro lâché est un euro de résultat en moins (pas de coût variable à amortir).",
          "- **Ça ouvre la négociation à l'infini** : qui baisse une fois baissera encore.",
          "## Le bon état d'esprit",
          "Vos honoraires ne sont pas un **coût** pour le client, ce sont le **prix d'un résultat** : vendre plus vite, plus cher et en sécurité qu'en direct. Assumez-le avec calme et conviction.",
        ],
      },
      {
        titre: "Justifier la valeur",
        contenu: [
          "Face à « vos honoraires sont élevés », on ne se justifie pas : on **démontre la valeur**.",
          "## Ce que l'agent apporte (vs vente PAP)",
          "- **Un meilleur prix net** : un bien bien commercialisé se vend souvent plus cher que par un particulier qui le brade ou se fait négocier.",
          "- **Des acquéreurs qualifiés et financés** : pas de visites inutiles, pas de ventes qui capotent faute de prêt.",
          "- **La sécurité juridique** : diagnostics, mentions, conformité, LCB-FT — zéro faute qui coûte cher.",
          "- **Le temps et la tranquillité** : visites, négociation, suivi notaire — tout géré.",
          "## La phrase-clé",
          "« Mes honoraires ne vous coûtent pas, ils vous rapportent : entre un bon et un mauvais pilotage de la vente, l'écart dépasse largement ma commission. »",
        ],
      },
      {
        titre: "Négocier toute concession",
        contenu: [
          "Si une remise doit se discuter, elle ne se **donne jamais** : elle s'**échange**.",
          "## Règles d'or",
          "- **Jamais de baisse sans contrepartie** : exclusivité, mandat plus long, bien au juste prix, recommandation, délai de réflexion supprimé.",
          "- **Concéder petit et à regret** : une concession facile n'a aucune valeur et en appelle d'autres.",
          "- **Reconditionner** : « Je peux étudier un geste si nous partons en exclusivité : là je mets tous les moyens et je me rattrape sur le volume. »",
          "- **Défendre le prix du bien = défendre sa crédibilité** : un agent qui tient le juste prix du bien inspire confiance pour tenir le sien.",
          "## Garder la relation",
          "On négocie **fermement mais chaleureusement** : l'objectif est un accord où le client se sent gagnant, pas une victoire à l'arraché qui laisse un goût amer.",
        ],
      },
    ],
    quiz: [
      { question: "Brader ses honoraires au premier doute…", options: ["Rassure le client", "Dévalorise la prestation et entame la marge", "Accélère toujours la vente", "N'a aucun effet"], correct: 1, explication: "Casser son prix sans raison dévalorise l'agent et ampute directement le résultat." },
      { question: "La meilleure réponse à « vos honoraires sont élevés » est…", options: ["Baisser tout de suite", "Démontrer la valeur apportée (prix net, sécurité, temps)", "Se justifier en s'excusant", "Changer de sujet"], correct: 1, explication: "On montre que les honoraires rapportent plus qu'ils ne coûtent, preuves à l'appui." },
      { question: "Une remise doit toujours être…", options: ["Donnée pour faire plaisir", "Échangée contre une contrepartie", "Automatique", "Maximale"], correct: 1, explication: "Jamais de concession sans contrepartie (exclusivité, durée, juste prix, recommandation…)." },
    ],
  },

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

  {
    id: "mental-performance",
    titre: "Mental & performance du négociateur",
    icone: "🧠",
    categorie: "Commercial",
    resume: "Discipline, gestion du refus et état d'esprit gagnant : le mental qui fait la différence.",
    duree: "16 min",
    lecons: [
      {
        titre: "L'état d'esprit des top performers",
        contenu: [
          "À compétences égales, c'est le **mental** qui sépare les meilleurs des moyens.",
          "- **Responsabilité** : le top performer ne cherche pas d'excuses (marché, prix, conjoncture). Il se demande « que puis-je faire, moi ? ».",
          "- **Optimisme réaliste** : il croit au résultat tout en agissant sur les faits.",
          "- **Orientation action** : il préfère un appel imparfait à une préparation parfaite jamais lancée.",
          "## L'activité crée le résultat",
          "La vente est un **jeu de nombres** : plus de contacts → plus de RDV → plus de mandats. Quand le résultat baisse, on augmente **l'activité**, on ne la réduit pas.",
        ],
      },
      {
        titre: "Gérer le refus et la pression",
        contenu: [
          "Le refus fait partie du métier : un « non » n'est pas un échec, c'est une **étape statistique**.",
          "- **Dissocier** : on rejette votre proposition, pas votre personne.",
          "- **Le ratio** : si 1 mandat se signe tous les 10 contacts, chaque « non » vous **rapproche** du prochain « oui » — et a donc une valeur.",
          "- **Apprendre de chaque non** : qu'est-ce qui a manqué ? découverte ? preuve ? closing ?",
          "## Gérer le stress",
          "Préparation + routine + respiration avant un R2 difficile. La confiance vient de la **compétence préparée**, pas de l'improvisation.",
        ],
      },
      {
        titre: "Objectifs, discipline & routines",
        contenu: [
          "- **Objectifs SMART** : spécifiques, mesurables, datés (ex. « 20 contacts/jour », « 2 mandats/mois »).",
          "- **Objectifs d'activité > objectifs de résultat** : vous ne contrôlez pas un mandat, mais vous contrôlez vos 20 appels. Pilotez l'amont.",
          "- **Les rituels** : bloc prospection non négociable chaque matin, revue hebdomadaire des chiffres, relances programmées.",
          "- **L'effet cumulé** : de petites actions répétées chaque jour battent les coups d'éclat irréguliers.",
          "Dans l'application, le **Suivi des négociateurs** mesure votre activité (contacts, RDV, mandats, chasses, tournées) : servez-vous-en pour piloter votre discipline.",
        ],
      },
    ],
    quiz: [
      { question: "Quand les résultats baissent, le top performer…", options: ["Réduit son activité", "Augmente son activité", "Attend que ça passe", "Baisse ses prix"], correct: 1, explication: "La vente est un jeu de nombres : on agit sur l'amont (le volume d'activité)." },
      { question: "Un « non » en prospection, c'est…", options: ["Un échec personnel", "Une étape statistique qui rapproche du oui", "Une raison d'arrêter", "Un signe de mauvais marché"], correct: 1, explication: "On dissocie le refus de soi ; chaque non rapproche du prochain oui." },
      { question: "Le plus efficace à piloter, ce sont les objectifs…", options: ["De résultat uniquement", "D'activité (ce qu'on contrôle)", "Des autres", "Du marché"], correct: 1, explication: "On ne contrôle pas un mandat, mais on contrôle ses contacts : on pilote l'amont." },
    ],
  },

  {
    id: "marketing-bien",
    titre: "Marketing du bien : home-staging, photo & diffusion",
    icone: "📸",
    categorie: "Commercial",
    resume: "Valoriser un bien, le photographier et le diffuser pour vendre plus vite et plus cher.",
    duree: "16 min",
    lecons: [
      {
        titre: "Home-staging : préparer le bien",
        contenu: [
          "Un bien **préparé** se vend plus vite et plus cher : l'acquéreur achète un **coup de cœur**, pas des murs.",
          "- **Désencombrer & dépersonnaliser** : moins d'objets, moins de photos personnelles → l'acheteur se projette.",
          "- **Réparer les petits défauts** : une poignée cassée, un joint noirci créent une impression de négligence.",
          "- **Nettoyer, désodoriser, éclairer** : propreté et lumière sont décisives.",
          "- **Neutraliser** : couleurs sobres, ambiance chaleureuse mais neutre.",
          "## Le retour sur investissement",
          "Quelques centaines d'euros de home-staging rapportent souvent plusieurs milliers d'euros sur le prix et des semaines de délai gagnées.",
        ],
      },
      {
        titre: "La photo qui vend",
        contenu: [
          "90 % des recherches commencent en ligne : la **première photo décide** du clic.",
          "- **Lumière naturelle** : volets ouverts, en journée, jamais à contre-jour.",
          "- **Rangé & cadré** : grand angle (sans déformer), à hauteur de poitrine, lignes droites.",
          "- **Ordre des photos** : commencer par la plus belle pièce / la façade la plus flatteuse.",
          "- **Quantité & qualité** : 15-25 photos nettes valent mieux que 50 médiocres ; ajoutez un **plan** et, si possible, une **visite 360°**.",
          "Dans l'application, le module **Montage vidéo & 360°** aide à produire des visites immersives.",
        ],
      },
      {
        titre: "Annonce & diffusion",
        contenu: [
          "## Rédiger une annonce qui convertit",
          "- **Titre accrocheur** orienté bénéfice, pas uniquement technique.",
          "- **Storytelling** (voir module Les mots qui font vendre) + informations clés (surface, pièces, DPE, charges).",
          "- **Mentions légales** obligatoires (honoraires, DPE, copropriété) — voir module Loi ALUR.",
          "## Diffuser largement",
          "- Portails (SeLoger, Leboncoin, Bien'ici…), site agence, **vitrine**, **réseaux sociaux**.",
          "- **Fichier acquéreurs** : en exclusivité, présentez d'abord à vos acquéreurs qualifiés (le rapprochement automatique de l'app vous les sort).",
          "- **Teasing** : « bientôt disponible » crée de l'attente avant la mise en ligne.",
        ],
      },
    ],
    quiz: [
      { question: "Le home-staging sert surtout à…", options: ["Augmenter la surface", "Déclencher le coup de cœur et la projection", "Masquer des vices cachés", "Gagner du temps au notaire"], correct: 1, explication: "Désencombrer, neutraliser et soigner l'ambiance aide l'acheteur à se projeter." },
      { question: "La première photo d'une annonce doit être…", options: ["La salle de bain", "La plus belle / la plus flatteuse", "Un plan cadastral", "Le local poubelles"], correct: 1, explication: "Elle décide du clic : on commence par la pièce ou la façade la plus séduisante." },
      { question: "En exclusivité, à qui présenter le bien en priorité ?", options: ["À personne", "À ses acquéreurs qualifiés du fichier", "Aux agences concurrentes", "Au voisinage uniquement"], correct: 1, explication: "On active d'abord son fichier d'acquéreurs qualifiés (rapprochement automatique dans l'app)." },
    ],
  },

  {
    id: "investissement-locatif",
    titre: "Investissement locatif & rentabilité",
    icone: "📈",
    categorie: "Transaction",
    resume: "Conseiller l'investisseur : rendement, cash-flow et régimes fiscaux (LMNP, foncier).",
    duree: "18 min",
    lecons: [
      {
        titre: "Calculer la rentabilité",
        contenu: [
          "Savoir chiffrer un investissement, c'est parler le langage de l'investisseur et **gagner sa confiance**.",
          "## Les trois niveaux de rendement",
          "- **Rendement brut** = (loyer annuel ÷ prix d'achat) × 100. Ex. 8 400 €/an sur 140 000 € = **6 %**.",
          "- **Rendement net de charges** : on déduit taxe foncière, charges non récupérables, assurance, gestion, vacance.",
          "- **Rendement net-net (après impôt)** : on intègre la **fiscalité** (régime choisi).",
          "## Le cash-flow",
          "Cash-flow = loyers − (mensualité de crédit + charges + impôts). Un cash-flow **positif** signifie que le bien s'autofinance ; négatif, l'investisseur **complète** chaque mois. C'est souvent le vrai critère de décision.",
        ],
      },
      {
        titre: "Les régimes fiscaux clés",
        contenu: [
          "## Location nue → revenus fonciers",
          "- **Micro-foncier** : abattement forfaitaire de 30 % (si revenus fonciers ≤ 15 000 €/an).",
          "- **Régime réel** : déduction des charges réelles (intérêts d'emprunt, travaux, taxe foncière…) et **déficit foncier** imputable sur le revenu (plafonné).",
          "## Location meublée → LMNP (BIC)",
          "- **Micro-BIC** : abattement forfaitaire (50 % en meublé classique).",
          "- **Réel LMNP** : déduction des charges + **amortissement** du bien et du mobilier → souvent **peu ou pas d'impôt** sur les loyers pendant des années. Régime très prisé des investisseurs.",
          "## Rôle du négociateur",
          "Vous n'êtes pas conseiller fiscal, mais savoir **orienter** (micro vs réel, nu vs meublé, LMNP) et renvoyer vers un expert-comptable fait de vous un interlocuteur crédible.",
        ],
      },
      {
        titre: "Analyser un bien pour investir",
        contenu: [
          "- **Emplacement & demande locative** : tension locative, proximité transports/emploi/écoles, type de locataires visés.",
          "- **Prix au m² vs loyers** : certains secteurs offrent un meilleur **couple prix/loyer** (rendement) que d'autres plus patrimoniaux (plus-value).",
          "- **Charges & copropriété** : des charges élevées ou des travaux votés plombent la rentabilité nette.",
          "- **DPE** : un bien F/G est **interdit à la location** (G depuis 2025, F en 2028) → travaux à budgéter, mais **levier de négociation** (voir module DPE).",
          "- **Stratégie** : rendement (cash-flow) vs patrimoine (plus-value) vs défiscalisation — clarifiez l'objectif de l'investisseur avant de proposer.",
        ],
      },
    ],
    quiz: [
      { question: "Le rendement brut se calcule…", options: ["Loyer mensuel ÷ prix", "(Loyer annuel ÷ prix d'achat) × 100", "Prix ÷ loyer", "Loyer − charges"], correct: 1, explication: "Rendement brut = loyer annuel rapporté au prix d'achat, en %." },
      { question: "L'atout fiscal majeur du réel en LMNP est…", options: ["L'abattement de 30 %", "L'amortissement du bien et du mobilier", "L'exonération totale", "La TVA"], correct: 1, explication: "L'amortissement réduit fortement, voire annule, l'impôt sur les loyers pendant des années." },
      { question: "Un cash-flow positif signifie que…", options: ["Le bien coûte chaque mois", "Le bien s'autofinance", "Il n'y a pas d'impôt", "Le loyer est trop bas"], correct: 1, explication: "Loyers supérieurs à (crédit + charges + impôts) : l'investissement se finance seul." },
    ],
  },

  {
    id: "vefa-neuf",
    titre: "Le neuf & la VEFA",
    icone: "🏗️",
    categorie: "Transaction",
    resume: "Vendre sur plan : contrat VEFA, garanties, échéancier des appels de fonds et frais réduits.",
    duree: "16 min",
    lecons: [
      {
        titre: "La VEFA : vendre sur plan",
        contenu: [
          "La **VEFA (Vente en l'État Futur d'Achèvement)** est l'achat d'un bien **neuf sur plan** : l'acquéreur devient propriétaire au fur et à mesure de la construction.",
          "- **Contrat de réservation** d'abord (dépôt de garantie plafonné, ~2-5 % selon le délai de livraison).",
          "- Puis **acte authentique de vente** chez le notaire, qui transfère la propriété du sol et de l'existant, puis des ouvrages à mesure de leur réalisation.",
          "- **Prix définitif** encadré, parfois révisable selon index BT01 dans les limites du contrat.",
          "## Avantages pour l'acquéreur",
          "Bien aux dernières normes (RE2020), **frais de notaire réduits**, garanties fortes, personnalisation (TMA — travaux modificatifs acquéreur), parfois TVA réduite en zones éligibles.",
        ],
      },
      {
        titre: "Les garanties du neuf",
        contenu: [
          "Le neuf est très protecteur. À connaître pour rassurer l'acquéreur :",
          "- **Garantie Financière d'Achèvement (GFA)** : garantit que l'immeuble sera **achevé** même si le promoteur défaille.",
          "- **Garantie de parfait achèvement (1 an)** : le promoteur répare tous les désordres signalés la 1re année.",
          "- **Garantie biennale (2 ans)** : bon fonctionnement des **équipements** dissociables (volets, robinetterie…).",
          "- **Garantie décennale (10 ans)** : dommages compromettant la **solidité** de l'ouvrage ou le rendant impropre à sa destination.",
          "- **Garantie des vices apparents** : réserves à la livraison, levées par le promoteur.",
        ],
      },
      {
        titre: "Échéancier & frais",
        contenu: [
          "## L'échéancier des appels de fonds (plafonds légaux)",
          "Le paiement suit l'avancement, dans ces limites maximales :",
          "- **35 %** à l'achèvement des **fondations**,",
          "- **70 %** à la **mise hors d'eau** (toiture posée),",
          "- **95 %** à l'**achevement** des travaux,",
          "- **5 %** (solde) à la **livraison** (consignable en cas de réserves).",
          "## Frais réduits",
          "Les **frais de notaire** en VEFA sont de l'ordre de **2 à 3 %** (contre 7-8 % dans l'ancien). La **TVA à 20 %** est incluse dans le prix (réduite à 5,5 % dans certaines zones ANRU/PSLA).",
          "## Rôle du négociateur",
          "Expliquer clairement garanties, échéancier et délais de livraison **rassure** et différencie du simple « vendeur de plans ».",
        ],
      },
    ],
    quiz: [
      { question: "La GFA en VEFA garantit…", options: ["Le prix le plus bas", "L'achèvement de l'immeuble si le promoteur défaille", "La rentabilité", "Les frais de notaire"], correct: 1, explication: "La Garantie Financière d'Achèvement assure la finition de l'ouvrage malgré une défaillance." },
      { question: "La garantie décennale couvre…", options: ["Les volets 2 ans", "Les désordres compromettant la solidité, pendant 10 ans", "Le parfait achèvement 1 an", "La peinture"], correct: 1, explication: "Décennale = dommages affectant la solidité ou rendant l'ouvrage impropre, 10 ans." },
      { question: "Les frais de notaire dans le neuf (VEFA) sont d'environ…", options: ["7-8 %", "2-3 %", "10 %", "0 %"], correct: 1, explication: "Frais réduits de 2 à 3 % du prix, contre 7-8 % dans l'ancien." },
    ],
  },

  {
    id: "plus-value",
    titre: "Fiscalité : la plus-value immobilière",
    icone: "🧾",
    categorie: "Juridique",
    resume: "Calcul, abattements pour durée, exonérations et surtaxe de la plus-value des particuliers.",
    duree: "16 min",
    lecons: [
      {
        titre: "Principe et calcul",
        contenu: [
          "La **plus-value immobilière** est le gain réalisé entre le **prix d'achat** et le **prix de vente** d'un bien par un particulier. Elle peut être **imposée**… ou **exonérée**.",
          "## La plus-value brute",
          "Plus-value = **prix de cession** (diminué des frais de vente, diagnostics, mainlevée…) − **prix d'acquisition** (majoré des frais d'acquisition et de certains travaux).",
          "- **Forfait frais d'acquisition** : +7,5 % si justificatifs absents.",
          "- **Forfait travaux** : +15 % du prix d'achat si le bien est détenu depuis plus de 5 ans (sans justificatifs).",
          "## Le taux d'imposition",
          "La plus-value imposable est taxée à **19 % d'impôt sur le revenu** + **17,2 % de prélèvements sociaux** = **36,2 %** avant abattements.",
        ],
      },
      {
        titre: "Abattements pour durée de détention",
        contenu: [
          "Plus on détient longtemps, moins on est taxé — jusqu'à l'exonération totale.",
          "## Impôt sur le revenu (19 %)",
          "- Abattement de **6 % par an** de la **6e à la 21e année**, puis **4 % la 22e année**.",
          "- → **Exonération totale d'IR à partir de 22 ans** de détention.",
          "## Prélèvements sociaux (17,2 %)",
          "- Abattement plus lent : faible jusqu'à la 21e année, puis accéléré.",
          "- → **Exonération totale des prélèvements sociaux à 30 ans** de détention.",
          "## À retenir",
          "Un bien détenu **22 ans** n'a plus d'IR mais encore des prélèvements sociaux ; il faut **30 ans** pour être totalement exonéré.",
        ],
      },
      {
        titre: "Exonérations & surtaxe",
        contenu: [
          "## Les exonérations",
          "- **Résidence principale** : exonération **totale**, sans condition de durée (c'est le cas le plus fréquent).",
          "- **Première cession d'un logement autre que la RP**, sous conditions (remploi dans l'achat d'une RP dans les 24 mois, ne pas avoir été propriétaire de sa RP les 4 années précédentes).",
          "- **Petites cessions** ≤ 15 000 €, certains retraités/invalides sous conditions de ressources, biens détenus > 22/30 ans, expropriations…",
          "## La surtaxe",
          "Sur une plus-value **imposable supérieure à 50 000 €**, une **taxe additionnelle** de **2 % à 6 %** s'applique (progressivement selon le montant).",
          "## Rôle du négociateur",
          "Vous n'êtes pas fiscaliste, mais **alerter** le vendeur (bien secondaire, locatif) sur la plus-value et le renvoyer vers son **notaire** (qui la calcule et la prélève) évite de mauvaises surprises et crédibilise votre conseil.",
        ],
      },
    ],
    quiz: [
      { question: "La vente de la résidence principale est…", options: ["Taxée à 36,2 %", "Exonérée totalement", "Taxée après 22 ans", "Soumise à surtaxe"], correct: 1, explication: "La résidence principale est exonérée de plus-value, sans condition de durée." },
      { question: "L'exonération totale d'impôt sur le revenu est atteinte après…", options: ["5 ans", "22 ans", "30 ans", "Jamais"], correct: 1, explication: "Exonération d'IR à 22 ans ; les prélèvements sociaux, eux, à 30 ans." },
      { question: "Le taux global de la plus-value (avant abattement) est de…", options: ["19 %", "17,2 %", "36,2 %", "50 %"], correct: 2, explication: "19 % d'IR + 17,2 % de prélèvements sociaux = 36,2 %." },
      { question: "La surtaxe s'applique quand la plus-value imposable dépasse…", options: ["10 000 €", "50 000 €", "100 000 €", "Elle n'existe pas"], correct: 1, explication: "Au-delà de 50 000 € de plus-value imposable, surtaxe de 2 à 6 %." },
    ],
  },

  {
    id: "location-baux",
    titre: "Location & baux d'habitation",
    icone: "🔑",
    categorie: "Juridique",
    resume: "Bail loi 89, état des lieux, dépôt de garantie, préavis, encadrement et DPE en location.",
    duree: "18 min",
    lecons: [
      {
        titre: "Le bail d'habitation (loi du 6 juillet 1989)",
        contenu: [
          "La location d'une résidence principale est régie par la **loi du 6 juillet 1989** (bail type, mentions obligatoires).",
          "## Durées",
          "- **Vide** : bail de **3 ans** (bailleur personne physique), 6 ans (personne morale), reconduit tacitement.",
          "- **Meublé** : bail de **1 an** (ou 9 mois pour un étudiant, non reconductible tacitement).",
          "## Préavis",
          "- **Locataire** : 3 mois (vide), réduit à **1 mois** en zone tendue, meublé ou motifs légaux (mutation, perte d'emploi, santé…).",
          "- **Bailleur** : 6 mois avant l'échéance (vide), 3 mois (meublé), et **uniquement** pour vente, reprise ou motif légitime et sérieux.",
          "## Pièces jointes",
          "DDT (dont **DPE**), notice d'information, règlement de copropriété (extraits), état des lieux.",
        ],
      },
      {
        titre: "État des lieux & dépôt de garantie",
        contenu: [
          "## État des lieux",
          "Établi **contradictoirement** à l'entrée et à la sortie, annexé au bail. C'est la **pièce maîtresse** en cas de litige : il faut être précis (pièce par pièce, photos datées).",
          "## Dépôt de garantie",
          "- **Vide** : **1 mois** de loyer hors charges maximum.",
          "- **Meublé** : **2 mois** de loyer hors charges maximum.",
          "- **Restitution** : 1 mois après remise des clés si l'état des lieux de sortie est conforme, **2 mois** sinon (retenues justifiées).",
          "## Loyers impayés",
          "Prévention : solvabilité du locataire (garant, caution, assurance loyers impayés — GLI). Les retenues doivent toujours être **justifiées** (devis, factures).",
        ],
      },
      {
        titre: "Encadrement, DPE & location interdite",
        contenu: [
          "## Encadrement des loyers",
          "Dans certaines zones tendues (Paris, Lille, Lyon, Montpellier, Bordeaux… selon arrêtés), le loyer est **plafonné** (loyer de référence majoré) ; un **complément de loyer** n'est possible que pour des caractéristiques exceptionnelles.",
          "## DPE en location (loi Climat)",
          "- **Gel des loyers** des passoires **F/G** depuis août 2022 (interdiction d'augmenter).",
          "- **Interdiction de louer** : **classe G depuis 2025**, **F en 2028**, **E en 2034** (critère de décence énergétique).",
          "- Le DPE est **opposable** et obligatoire dans l'annonce (4 mentions, voir module Loi ALUR).",
          "## Rôle du négociateur / gestionnaire",
          "Vérifier la **décence** (dont énergétique), respecter l'**encadrement**, soigner le **bail et l'état des lieux** : la rigueur évite les contentieux coûteux.",
        ],
      },
    ],
    quiz: [
      { question: "La durée d'un bail vide (bailleur personne physique) est de…", options: ["1 an", "3 ans", "6 ans", "9 ans"], correct: 1, explication: "3 ans en vide (6 ans pour une personne morale) ; 1 an en meublé." },
      { question: "Le dépôt de garantie maximum en meublé est de…", options: ["1 mois", "2 mois", "3 mois", "Aucun"], correct: 1, explication: "2 mois de loyer hors charges en meublé (1 mois en location vide)." },
      { question: "Depuis 2025, la classe DPE interdite à la location est…", options: ["E", "F", "G", "D"], correct: 2, explication: "G interdite depuis 2025, F en 2028, E en 2034 (décence énergétique)." },
      { question: "L'état des lieux doit être établi…", options: ["Par le seul bailleur", "Contradictoirement (entrée et sortie)", "Facultativement", "Par le notaire"], correct: 1, explication: "Contradictoire, à l'entrée et à la sortie : pièce maîtresse en cas de litige." },
    ],
  },
];

// Liste finale : le niveau est injecté depuis la table NIVEAUX.
export const MODULES_FORMATION: ModuleFormation[] = MODULES_BRUTS.map((m) => ({
  ...m,
  niveau: NIVEAUX[m.id] ?? "Confirmé",
}));

export const NIVEAUX_FORMATION: NiveauFormation[] = ["Débutant", "Confirmé", "Expert"];

// Durée d'un module convertie en minutes (ex. "20 min" → 20). Sert au calcul
// des heures validées (attestation ALUR).
export function minutesModule(m: ModuleFormation): number {
  const n = parseInt((m.duree.match(/\d+/) ?? ["0"])[0], 10);
  return Number.isFinite(n) ? n : 0;
}
