// Scripts d'appel (phoning) par cible. Contenu « markdown léger » dans les
// lignes : "## " sous-titre, "- " puce, **gras** inline. Pédagogique et
// opérationnel — à adapter à sa voix et au contexte de chaque appel.

export interface BlocScript {
  titre: string;
  lignes: string[];
}
export interface ScriptPhoning {
  id: string;        // = clé de catégorie (table + script)
  titre: string;     // libellé de la cible
  icone: string;
  cible: string;     // description courte
  objectif: string;  // but de l'appel
  blocs: BlocScript[];
}

export const SCRIPTS_PHONING: ScriptPhoning[] = [
  {
    id: "estimation-archivee",
    titre: "Estimations archivées",
    icone: "🗂️",
    cible: "Anciennes estimations restées sans suite (pas de mandat).",
    objectif: "Reprendre contact, savoir où en est le projet et décrocher un RDV de prise de mandat.",
    blocs: [
      { titre: "Accroche (les 20 premières secondes)", lignes: [
        "« Bonjour M./Mme [Nom], **[Prénom] de l'agence CENTURY 21 Icaza** à Martigues. Vous m'accordez **30 secondes** ? »",
        "« Je vous appelle car nous avions **estimé votre bien** [mois/année] et je voulais simplement **prendre de vos nouvelles** sur votre projet. »",
        "**But** : être reconnu, créer un climat de confiance, obtenir l'autorisation de poursuivre.",
      ] },
      { titre: "Découverte (faire parler)", lignes: [
        "- « Où en êtes-vous de votre projet de vente aujourd'hui ? »",
        "- « Vous avez **mis en vente** entre-temps, seul ou avec une autre agence ? »",
        "- « Qu'est-ce qui a fait que ça ne s'est **pas concrétisé** avec nous à l'époque ? »",
        "- « Si c'était à **refaire au bon prix**, vous seriez vendeur dans quel délai ? »",
      ] },
      { titre: "Proposition de valeur", lignes: [
        "« Le marché a **bougé** depuis [année] : je peux vous faire une **réactualisation gratuite** de la valeur, sans engagement. »",
        "« J'ai peut-être déjà des **acquéreurs en portefeuille** pour votre secteur. »",
      ] },
      { titre: "Closing (le RDV)", lignes: [
        "« On se voit **15 minutes** pour refaire le point : plutôt **mardi 18 h ou jeudi 12 h** ? » (**alternative**, jamais oui/non).",
        "Reformuler, **noter le RDV**, confirmer par SMS.",
      ] },
      { titre: "Objections fréquentes", lignes: [
        "- **« J'ai déjà vendu. »** → « Félicitations ! Et pour votre **nouveau projet** (rachat, investissement), je peux vous aider ? »",
        "- **« C'est chez une autre agence. »** → « Très bien. C'est en **exclusivité** ? Si vous n'étiez pas verrouillé, je vous apporte mes acquéreurs. »",
        "- **« Ce n'est plus d'actualité. »** → « Je comprends. Je vous rappelle dans **6 mois** pour faire le point, ça vous va ? » (→ statut Rappel).",
      ] },
    ],
  },
  {
    id: "mandat-archive",
    titre: "Mandats archivés",
    icone: "📁",
    cible: "Mandats échus ou retirés (le bien n'est peut-être pas vendu).",
    objectif: "Vérifier si le bien est toujours à vendre et reprendre un mandat (idéalement exclusif).",
    blocs: [
      { titre: "Accroche", lignes: [
        "« Bonjour M./Mme [Nom], **[Prénom], CENTURY 21 Icaza**. Nous avions un **mandat** sur votre [type de bien] [rue/secteur]. Je fais le point avec vous, vous avez un instant ? »",
      ] },
      { titre: "Découverte", lignes: [
        "- « Le bien est-il **toujours à vendre** ? »",
        "- « Il est **reparti ailleurs**, ou vous avez fait une pause ? »",
        "- « Qu'est-ce qui vous a **manqué** dans l'accompagnement précédent ? »",
        "- « Combien de **visites** avez-vous eues ? » (peu de visites = souvent un **problème de prix**).",
      ] },
      { titre: "Proposition de valeur", lignes: [
        "« Un bien qui **stagne**, c'est presque toujours un **positionnement prix** à revoir. Je vous propose un **nouvel avis de valeur** basé sur les ventes récentes. »",
        "« En **exclusivité**, je déclenche un **plan d'action renforcé** (photos pro, diffusion, acquéreurs ciblés). »",
      ] },
      { titre: "Closing", lignes: [
        "« Je passe **mercredi 17 h ou samedi 10 h** pour revoir le prix et relancer la vente ? »",
      ] },
      { titre: "Objections fréquentes", lignes: [
        "- **« J'ai arrêté de vendre. »** → « Qu'est-ce qui vous ferait **repartir** ? Si je vous trouve le bon acquéreur au bon prix ? »",
        "- **« Je vends seul maintenant. »** → « Combien de **contacts sérieux** avez-vous ? Je peux vous apporter des acquéreurs **déjà financés**. »",
        "- **« Les agences, c'est trop cher. »** → « Ce qui compte, c'est votre **net vendeur** : un bon prix négocié + la sécurité juridique. On en parle 15 min ? »",
      ] },
    ],
  },
  {
    id: "acquereur-archive",
    titre: "Acquéreurs archivés",
    icone: "🔑",
    cible: "Anciens acquéreurs dont le projet a été mis en pause.",
    objectif: "Réactiver le projet d'achat, requalifier le financement et re-matcher avec le stock.",
    blocs: [
      { titre: "Accroche", lignes: [
        "« Bonjour M./Mme [Nom], **[Prénom], CENTURY 21 Icaza**. Vous recherchiez [type de bien] sur [secteur] il y a quelque temps. Toujours d'actualité ? »",
      ] },
      { titre: "Découverte / requalification", lignes: [
        "- « Où en est votre **projet d'achat** ? »",
        "- « Vous avez **trouvé**, ou la recherche est toujours ouverte ? »",
        "- « Votre **budget** et vos **critères** ont-ils évolué ? »",
        "- « Votre **financement** est-il validé (accord de principe, apport) ? »",
      ] },
      { titre: "Proposition de valeur", lignes: [
        "« J'ai des biens qui **ne sont pas encore en ligne** et qui correspondent à votre recherche. »",
        "« Je peux vous mettre en **alerte prioritaire** et vous appeler **avant** la diffusion publique. »",
      ] },
      { titre: "Closing", lignes: [
        "« Je vous propose **une visite cette semaine** sur un bien qui colle à vos critères : plutôt **jeudi ou samedi** ? »",
        "Si pas de bien dispo : **reprogrammer un rappel** et requalifier le besoin.",
      ] },
      { titre: "Objections fréquentes", lignes: [
        "- **« J'ai déjà acheté. »** → « Félicitations ! Vous connaissez quelqu'un qui **cherche ou qui vend** ? » (recommandation).",
        "- **« Je ne cherche plus. »** → « Je vous sors des alertes ? Si **la perle rare** passe, je vous préviens en priorité. »",
        "- **« Les prix sont trop hauts. »** → « Justement, je négocie pour vous. Donnez-moi votre **budget max réel**, je cible ce qui est **négociable**. »",
      ] },
    ],
  },
  {
    id: "estimation-recente",
    titre: "Estimations faites (non archivées)",
    icone: "🔥",
    cible: "Estimations récentes « à chaud », sans mandat encore signé.",
    objectif: "Transformer l'estimation en prise de mandat pendant que le contact est chaud.",
    blocs: [
      { titre: "Accroche", lignes: [
        "« Bonjour M./Mme [Nom], **[Prénom], CENTURY 21 Icaza**. Je reviens vers vous suite à **l'estimation de votre bien** [de la semaine dernière]. Vous avez pu y réfléchir ? »",
      ] },
      { titre: "Découverte", lignes: [
        "- « Qu'avez-vous pensé de la **valeur** que je vous ai présentée ? »",
        "- « Qu'est-ce qui vous **ferait avancer** aujourd'hui ? »",
        "- « Y a-t-il un point qui vous **retient** ? (prix, délai, honoraires…) »",
      ] },
      { titre: "Proposition de valeur", lignes: [
        "« Le bon moment pour vendre, c'est **maintenant**, tant que le bien est **neuf sur le marché** : il attire le plus d'acquéreurs les **3 premières semaines**. »",
        "« En **exclusivité**, je m'engage sur un **plan d'action daté** avec un **retour hebdomadaire**. »",
      ] },
      { titre: "Closing", lignes: [
        "« Je passe **signer le mandat** et lancer la commercialisation : **demain 18 h** ou **samedi matin** ? »",
        "Préparer le **mandat** et les **pièces** à l'avance pour signer au RDV.",
      ] },
      { titre: "Objections fréquentes", lignes: [
        "- **« Je veux réfléchir. »** → « Bien sûr. Sur quel point précis ? » (isoler le vrai frein).",
        "- **« Un ami/une autre agence estime plus cher. »** → « Un prix, ça ne se **promet** pas, ça se **démontre** : je vous montre les **ventes réelles** comparables. Surévaluer, c'est **rester invendu**. »",
        "- **« Je vais essayer seul d'abord. »** → « Testez 3 semaines si vous voulez. Donnez-moi une **exclusivité d'un mois** en parallèle : si je vends mieux et plus vite, vous gagnez. »",
      ] },
    ],
  },
  {
    id: "relance-reseau",
    titre: "Relance réseau & recommandation",
    icone: "🤝",
    cible: "Anciens clients, contacts du réseau, apporteurs d'affaires.",
    objectif: "Entretenir la relation et générer des recommandations (vendeurs/acquéreurs).",
    blocs: [
      { titre: "Accroche", lignes: [
        "« Bonjour M./Mme [Nom], **[Prénom], CENTURY 21 Icaza**. Je prends simplement de vos **nouvelles**, sans rien vous vendre. Tout se passe bien dans votre [bien/quartier] ? »",
      ] },
      { titre: "Entretenir la relation", lignes: [
        "- Prendre des nouvelles **sincères** (emménagement, travaux, voisinage).",
        "- Rappeler que vous restez **disponible** pour toute question immobilière.",
      ] },
      { titre: "Demande de recommandation", lignes: [
        "« Une question : **connaissez-vous quelqu'un** autour de vous qui **vend, achète ou hésite** ? »",
        "« Si vous pensez à moi, je m'occupe de tout — et je vous tiens **au courant**. »",
      ] },
      { titre: "Closing", lignes: [
        "« Je vous laisse mon numéro en **favori** : au moindre projet, un message et je rappelle. »",
        "Noter les **pistes** données → créer des lignes dans la cible correspondante.",
      ] },
      { titre: "Bonnes pratiques", lignes: [
        "- Appeler **sans rien attendre** : la recommandation vient de la **confiance**.",
        "- Toujours **remercier** et **tenir informé** l'apporteur du suivi.",
      ] },
    ],
  },
];

// Statuts d'appel possibles (colonne du tableau).
export const STATUTS_PHONING = [
  "À appeler",
  "Répondeur",
  "Rappel",
  "Injoignable",
  "Pas intéressé",
  "RDV fixé",
  "Mandat / Vente",
] as const;
export type StatutPhoning = (typeof STATUTS_PHONING)[number];
