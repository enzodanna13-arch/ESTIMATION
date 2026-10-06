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
  {
    "id": "prospection",
    "titre": "Prospection & pige",
    "icone": "🎯",
    "categorie": "Commercial",
    "resume": "Bâtir un flux régulier de mandats : pige, cadre légal 2026, phoning, terrain, digital, acquéreurs, mental et pilotage.",
    "duree": "48 min",
    "lecons": [
      {
        "titre": "Pourquoi la prospection est votre métier n°1",
        "contenu": [
          "Un négociateur n'est pas payé pour vendre des biens : il est payé pour **rentrer des mandats**. Sans stock de biens au juste prix, il n'y a rien à vendre, rien à faire visiter, rien à négocier. La prospection est l'activité la plus rentable de votre semaine, et la **première à bloquer** dans votre agenda — avant les mails, avant l'administratif.",
          "## La règle des 3 tiers du temps",
          "- **1/3 prospection** (pige, terrain, phoning, suivi des contacts) : l'investissement qui remplit le pipeline.",
          "- **1/3 découverte & estimations** (R1/R2, prises de mandat) : la transformation des contacts en mandats.",
          "- **1/3 vente & suivi** (visites, offres, compromis, SAV) : la récolte du chiffre d'affaires.",
          "En pratique, un négociateur qui ne consacre pas au moins **2 heures par jour** à la prospection pure finit toujours par subir des trous de stock.",
          "## La prospection paie en différé",
          "Un vendeur contacté aujourd'hui signe rarement demain : le délai entre le premier contact et la signature du mandat s'étale souvent sur **3 à 9 mois** (ordre de grandeur, à mesurer sur votre secteur). Celui qui ne prospecte que lorsque son stock est vide creuse des **trous de chiffre d'affaires** permanents, décalés de plusieurs mois.",
          "La bonne discipline : **prospecter tous les jours, même quand on croule sous les mandats**. C'est ce qui lisse l'activité et supprime les montagnes russes du revenu.",
          "## La loi des grands nombres : votre tunnel de prospection",
          "La prospection est un jeu de **ratios**, pas de chance. À titre d'ordre de grandeur sur un secteur travaillé (mesurez toujours les vôtres) :",
          "- 100 biens pigés donnent environ **30 vendeurs réellement joignables et qualifiés**.",
          "- Ces 30 contacts donnent environ **10 rendez-vous d'estimation**.",
          "- Ces 10 rendez-vous donnent environ **3 à 4 mandats**.",
          "- Ces mandats donnent **2 à 3 ventes**.",
          "Conséquence : si vous voulez plus de mandats, ne cherchez pas à être « meilleur » avant d'être **plus nombreux en haut du tunnel**. Au démarrage, le volume d'activité prime sur le talent.",
          "## Le réflexe à retenir : la réactivité",
          "Le vendeur retient très souvent le **premier professionnel** qui le contacte sérieusement et qui le relance avec constance. Piger un bien dans les **24 à 48 h** de sa parution, puis relancer sans faillir, bat presque toujours le talent brut : l'**assiduité** est votre premier avantage concurrentiel.",
          "## Activité contre agitation",
          "- Prospecter, c'est créer du **contact nouveau** avec des vendeurs potentiels : piger, appeler, aller sur le terrain, relancer.",
          "- Répondre à ses mails, classer ses dossiers, « peaufiner » une annonce ne sont **pas** de la prospection : c'est de l'administratif utile, mais qui ne remplit pas le pipeline.",
          "- Mesurez votre journée à un seul chiffre : combien de **nouveaux contacts vendeurs** avez-vous créés aujourd'hui ?",
          "## Les erreurs fréquentes",
          "- Attendre d'avoir « le temps » : le temps de prospection ne se trouve pas, il se **bloque**.",
          "- Confondre activité et agitation : répondre à ses mails n'est pas prospecter.",
          "- Arrêter dès que le stock remonte, puis subir un creux 4 mois plus tard.",
          "- Ne pas noter ses contacts : un vendeur non tracé est un vendeur perdu.",
          "## Mini cas pratique",
          "À l'agence CENTURY 21 Icaza Immobilier (Martigues), un négociateur se plaint de n'avoir « aucun mandat ce mois-ci ». En remontant son tunnel, on constate qu'il a pigé 12 biens en 30 jours au lieu des ~80 nécessaires. Le problème n'est pas sa technique : c'est son **volume d'entrée**. On fixe un objectif simple : **5 biens pigés et 10 appels par jour**, bloqués de 9 h à 11 h. Le résultat tombera sous 60 à 90 jours, pas le lendemain : c'est le différé."
        ]
      },
      {
        "titre": "La pige : détecter les vendeurs à vendre",
        "contenu": [
          "La **pige** consiste à détecter et à contacter les propriétaires dont le bien est à vendre, pour leur proposer vos services. C'est le gisement de mandats le plus prévisible : il suffit d'être **régulier et réactif**.",
          "## Les 4 gisements de la pige",
          "- **Les PAP** (particuliers qui vendent seuls) : la cible n°1. Ils cherchent à économiser la commission, pas à fuir les agences.",
          "- **Les mandats simples chez des confrères** : vous pouvez apporter vos acquéreurs ; le vendeur n'est pas « verrouillé » en exclusivité.",
          "- **Les mandats échus ou retirés** : un bien qui disparaît des portails sans être vendu, c'est un vendeur déçu de son agence, mûr pour changer.",
          "- **Les baisses de prix** : une annonce dont le prix chute signale un vendeur qui doute et qui a peu de visites — donc réceptif.",
          "## Où piger",
          "- Les portails d'annonces (SeLoger, Leboncoin, PAP, Bien'ici, Figaro Immo) filtrés sur votre secteur et vos critères.",
          "- Les réseaux sociaux : groupes Facebook locaux « Vends/Achète à Martigues », Marketplace, Leboncoin immobilier.",
          "- Le terrain : panneaux « À vendre par le propriétaire », vitrines de commerçants, bouche-à-oreille.",
          "## Quand piger : le timing fait la différence",
          "- Pigez **tous les jours, à heure fixe** : un bien PAP fraîchement paru reçoit ses premiers appels d'agences dans les heures qui suivent.",
          "- Visez les annonces de **moins de 48 h** : c'est là que le vendeur est le plus ouvert et le moins sollicité.",
          "- Repassez sur les annonces **de 60 jours et plus** : le vendeur fatigué devient négociable sur le mandat.",
          "## Repérer le bon bien à piger",
          "- Prix cohérent avec le marché (DVF) : un vendeur réaliste est un futur bon mandat.",
          "- Photos amateurs, description pauvre, mention « agences s'abstenir » : paradoxalement un excellent signal — le vendeur se débrouille seul et galère souvent.",
          "- Un bien qui cumule **ancienneté + baisses successives** : le fruit mûr de la pige.",
          "## Qualifier le vendeur dès la pige",
          "- **Le motif de vente** : mutation, succession, divorce, agrandissement… il dicte l'urgence et la marge de négociation.",
          "- **Le délai** : un vendeur pressé (achat déjà engagé, mutation datée) passe en priorité.",
          "- **Le prix affiché face au marché** : surévalué = futur travail de pédagogie ; au prix = mandat à prendre vite.",
          "- **Le projet derrière la vente** : « et après, vous rachetez ? » — un vendeur qui rachète est aussi un acquéreur à capter.",
          "## Démontrer le net vendeur, pas la commission",
          "- Un PAP raisonne en **prix affiché** ; vous devez le faire raisonner en **net dans sa poche**, à la fin, une fois la vente réellement conclue.",
          "- Le bon prix négocié par un pro, le tri des acquéreurs finançables et la sécurité juridique compensent souvent, et au-delà, le coût des honoraires.",
          "- Préparez ce raisonnement **avant** le rendez-vous : c'est votre meilleure réponse au « les agences, c'est trop cher ».",
          "## L'outil : la Chasse immobilière",
          "- Enregistrez chaque bien pigé dans l'application (**Chasse immobilière**) : prix affiché, prix/m², date de parution, coordonnées, historique des relances.",
          "- Suivez le **positionnement marché** du bien pour préparer votre argumentaire d'estimation.",
          "- Mesurez votre tunnel : biens pigés → appels → RDV → mandats.",
          "## Le bon état d'esprit",
          "Un vendeur PAP n'est pas « anti-agence » : il veut **maximiser son net vendeur**. Votre rôle n'est pas de défendre votre commission mais de démontrer que vous lui rapportez **plus net, plus vite et plus sûr** que la vente en solo (meilleur prix négocié, sécurité juridique, tri des acquéreurs finançables, temps gagné).",
          "## Les erreurs fréquentes",
          "- Piger « quand on y pense » au lieu d'un créneau quotidien fixe.",
          "- Appeler sans avoir noté le prix/m² et le positionnement : on perd en crédibilité.",
          "- Abandonner un PAP après un seul refus : la grande majorité des PAP finissent en agence.",
          "- Négliger les mandats échus, qui sont pourtant les plus faciles à convertir.",
          "## Mini cas pratique",
          "Sur Jonquières (Martigues), un T3 de 65 m² est affiché par un PAP à 210 000 € (soit ~3 230 €/m²) depuis 75 jours, avec deux baisses de prix et une mention « agences s'abstenir ». Traduction : vendeur réaliste sur le prix mais à bout de souffle. C'est une **cible prioritaire** : on l'appelle le jour même, on note l'historique dans la Chasse, et on vise un RDV d'estimation sous 72 h."
        ]
      },
      {
        "titre": "Le cadre légal de la prospection",
        "contenu": [
          "Prospecter est votre métier, mais la loi encadre strictement le **démarchage**, surtout téléphonique — et les règles ont profondément changé en 2026. Un négociateur qui les ignore expose l'agence à de lourdes **amendes administratives**. Connaître le cadre à jour, c'est prospecter sereinement.",
          "## Depuis le 11 août 2026 : le consentement préalable (opt-in)",
          "La loi n° 2025-594 du 30 juin 2025 a renversé la logique du démarchage téléphonique en France : on passe d'un régime d'opposition (opt-out) à un régime de **consentement préalable** (opt-in).",
          "- Depuis le **11 août 2026**, il est interdit de démarcher par téléphone un particulier **sans son consentement préalable**.",
          "- Ce consentement doit être **libre, spécifique, éclairé, univoque et révocable** ; il n'est valable **qu'un an au maximum**, et c'est au **professionnel d'en apporter la preuve**.",
          "- Le dispositif **Bloctel** (l'ancienne liste d'opposition) a été **supprimé** le même jour : s'y référer n'a plus de sens.",
          "- Deux exceptions limitées subsistent : l'appel portant sur un **contrat en cours** (et sur son objet) et la vente d'abonnements à la presse.",
          "## Construire une base de contacts consentants",
          "Votre valeur se déplace vers une base de prospects qui ont **accepté** d'être contactés : c'est elle qui alimente désormais votre phoning légal.",
          "- Sources de consentement : **demandes d'estimation en ligne**, leads entrants, recommandations, formulaires où le prospect coche librement une case (jamais pré-cochée).",
          "- Conservez la **preuve** de chaque consentement : date, canal, formulation exacte — en cas de contrôle, c'est à vous de la produire.",
          "- Un vendeur qui demande une estimation lève la main : c'est un contact **consentant**, précieux à l'heure de l'opt-in.",
          "## Le cas particulier du vendeur PAP",
          "Un PAP qui publie une annonce **avec son numéro** sollicite publiquement des contacts pour ce bien précis. L'appeler **au sujet de cette annonce**, c'est répondre à sa sollicitation, pas faire du démarchage à froid : cela reste le socle de la pige.",
          "- Citez toujours l'annonce : « je vous appelle pour votre maison publiée sur Leboncoin… ».",
          "- Restez **strictement sur le sujet de ce bien** : ne basculez pas vers d'autres offres de services sans son accord.",
          "- Respectez les horaires légaux et **tracez** l'échange dans votre outil.",
          "- En cas de doute, prudence et traçabilité priment ; un vendeur qui refuse le contact ne doit plus être relancé.",
          "## Les horaires et la fréquence des appels",
          "Les appels que vous êtes autorisé à passer restent encadrés par le décret n° 2022-1313 du 13 octobre 2022 (en vigueur depuis le **1er mars 2023**), adapté au nouveau régime par le décret n° 2026-662 du 23 juillet 2026 :",
          "- Appels autorisés **du lundi au vendredi, de 10 h à 13 h et de 14 h à 20 h**.",
          "- **Interdits** le samedi, le dimanche et les jours fériés.",
          "- Pas plus de **4 sollicitations par mois** (sur 30 jours glissants) pour un même consommateur, par le même professionnel.",
          "## Email & SMS : l'opt-in RGPD",
          "- La prospection par **email ou SMS** vers un particulier exige elle aussi son **consentement préalable** (article L.34-5 du Code des postes et des communications électroniques) : pas de case pré-cochée, un accord libre et éclairé.",
          "- Chaque message doit permettre une **désinscription** simple et rappeler l'identité de l'expéditeur.",
          "- Côté RGPD / CNIL : les données de prospection se conservent **3 ans maximum après le dernier contact** ; informez la personne et respectez son droit d'opposition.",
          "## Les sanctions",
          "- Démarcher sans consentement ou hors des règles expose à une **amende administrative** jusqu'à **75 000 €** pour une personne physique et **375 000 €** pour une personne morale.",
          "- Les **contrats** conclus en violation de l'interdiction encourent la **nullité**.",
          "- La réputation souffre aussi : un particulier harcelé laisse un avis négatif qui coûte des mandats bien au-delà de l'amende.",
          "## Rappel : la carte T (loi Hoguet)",
          "- Prendre un mandat suppose d'exercer sous la **carte professionnelle « Transactions » (carte T)**, instaurée par la loi Hoguet (n° 70-9 du 2 janvier 1970).",
          "- Le négociateur agit sous la carte du titulaire via une **attestation de collaborateur** : prospectez, mais faites signer le mandat dans ce cadre légal (voir le module « Cadre légal & conformité »).",
          "## Les erreurs fréquentes",
          "- Appeler un particulier à froid, sans consentement : c'est désormais interdit et sanctionnable.",
          "- Croire que Bloctel existe encore : le dispositif a disparu le 11 août 2026.",
          "- Envoyer un SMS ou un mail de prospection sans opt-in préalable.",
          "- Relancer un vendeur qui a clairement dit non, ou prospecter le samedi « parce que les gens sont chez eux » : interdit.",
          "## Mini cas pratique",
          "Vous repérez un PAP à Croix-Sainte, numéro en clair sur l'annonce Leboncoin, un mardi à 11 h. Feu vert : vous l'appelez **au sujet de son annonce**, dans les horaires, en citant le bien. S'il refuse tout contact, vous le notez et ne le relancez plus. Et vous ne lui envoyez **pas** de SMS ni de mail commercial ensuite sans son consentement explicite."
        ]
      },
      {
        "titre": "L'appel de pige : le script qui décroche le RDV",
        "contenu": [
          "L'objectif de l'appel de pige n'est **pas** de vendre vos services, ni de donner une estimation au téléphone : c'est d'obtenir un **rendez-vous** (visite du bien, estimation). Tout le reste se joue en face-à-face.",
          "## Avant d'appeler : la préparation",
          "- Ayez sous les yeux l'annonce : prix affiché, prix/m², surface, ancienneté, nombre de photos.",
          "- Vérifiez le positionnement marché (DVF) pour parler juste.",
          "- Préparez **deux créneaux de RDV précis** à proposer.",
          "- Debout, le sourire « audible », un verre d'eau : la voix porte votre énergie.",
          "## La méthode CROC",
          "- **C — Contact** : saluer, se présenter, créer le lien.",
          "- **R — Raison** : dire pourquoi vous appelez (son annonce).",
          "- **O — Objectif** : décrocher le rendez-vous.",
          "- **C — Conclusion** : verrouiller la date et remercier.",
          "## Le script mot pour mot",
          "- **Accroche** : « Bonjour, [prénom/nom] ? Je vous appelle pour votre maison à [quartier], que j'ai vue en vente. Elle est toujours disponible ? »",
          "- **Permission** : « Je peux vous poser deux ou trois questions rapides, ça vous va ? »",
          "- **Découverte** : « Depuis combien de temps est-elle en vente ? Combien de visites avez-vous eues ? Qu'est-ce qui vous a décidé à vendre par vous-même ? Et derrière cette vente, quel est votre projet ? »",
          "- **Création de valeur** : « Je travaille le secteur de [ville] au quotidien et j'ai des acquéreurs en recherche active sur votre type de bien. »",
          "- **Verrouillage** : « Le plus simple, c'est que je passe voir le bien pour vous donner un avis de valeur précis : vous préférez **jeudi à 18 h ou samedi à 10 h** ? » — toujours une **alternative**, jamais une question fermée oui/non.",
          "## Franchir le barrage et la messagerie",
          "- Barrage du conjoint : « Je comprends, c'est une décision à deux. Le mieux, c'est que je passe quand vous êtes **tous les deux présents** : plutôt en semaine ou le week-end ? »",
          "- Messagerie vocale : laissez un message **court et intrigant** : « Bonjour [nom], c'est [vous] de CENTURY 21 Icaza à Martigues, au sujet de votre bien en vente — j'ai peut-être un acquéreur. Rappelez-moi au [numéro], merci ! »",
          "## Traiter les objections (mot pour mot)",
          "- « Je vends seul. » → « Beaucoup de vendeurs commencent ainsi, c'est normal. Acceptez juste que je passe estimer, sans engagement : vous aurez un avis de pro gratuit et vous resterez libre. »",
          "- « J'ai déjà une agence. » → « En simple ou en exclusivité ? Si c'est en simple, je peux vous apporter mes acquéreurs **en plus**, sans rien vous coûter de plus. »",
          "- « Envoyez-moi un mail. » → « Avec plaisir, mais un mail ne vaut pas une vraie estimation : pour être utile, il faut que je voie le bien. On dit jeudi 18 h ? »",
          "- « Les agences, c'est trop cher. » → « Je comprends. La vraie question, c'est votre **prix net dans la poche** : souvent on vend mieux, et vous gagnez du temps et de la sécurité. Laissez-moi vous le démontrer sur place. »",
          "- « Je n'ai pas le temps. » → « Justement, c'est mon métier de vous en faire gagner. 20 minutes suffisent : jeudi ou samedi ? »",
          "- « Je réfléchis encore, ce n'est pas pressé. » → « Parfait, raison de plus pour partir sur une bonne estimation dès maintenant : vous déciderez ensuite, en toute connaissance de cause. Jeudi 18 h ? »",
          "- « C'est déjà sous compromis. » → « Félicitations ! Et pour votre prochain projet, vous rachetez dans le secteur ? » — un vendeur qui rachète devient un acquéreur à suivre.",
          "## Les règles d'or",
          "- **Une question à la fois**, puis on se tait : le silence fait parler le vendeur.",
          "- Débit **posé**, ton chaleureux, jamais pressé ni récité.",
          "- On raccroche **avec un RDV daté** ou une **relance programmée** — jamais « je vous rappellerai un jour ».",
          "## Les erreurs fréquentes",
          "- Donner une fourchette de prix au téléphone : vous perdez le motif du RDV.",
          "- Argumenter sur la commission dès l'appel : ça se traite en face-à-face.",
          "- Parler plus que le vendeur.",
          "- Proposer « quand vous voulez » au lieu de deux créneaux précis.",
          "## Mini cas pratique",
          "Vendeur d'un T3 à Ferrières, en vente depuis 70 jours : « J'ai déjà une agence. » Réponse : « En simple ou en exclusivité ? » — « En simple. » — « Parfait, je peux donc vous apporter mes acquéreurs en plus, ça ne vous engage à rien. Je passe voir le bien jeudi 18 h ou samedi 10 h ? » RDV obtenu : le motif « acquéreur en plus » lève l'objection sans heurter l'agence en place."
        ]
      },
      {
        "titre": "Phoning offensif : anciens clients, recommandation & sphère d'influence",
        "contenu": [
          "La pige n'est qu'une partie du phoning. Vos appels les plus **rentables** visent des gens qui vous connaissent déjà ou qui vous sont recommandés : le taux de transformation y est bien supérieur à l'appel à froid — et, depuis l'opt-in, ce sont souvent des contacts avec qui le lien est déjà établi.",
          "## Votre or dormant : la base de contacts",
          "- Anciens clients (vendeurs et acquéreurs) : ils reviennent, déménagent, investissent, parrainent.",
          "- Prospects passés, estimations non converties, contacts de visites.",
          "- Un fichier non relancé, c'est de l'**or qui dort** : une base de 200 contacts bien entretenue génère des mandats chaque année.",
          "## La recommandation (parrainage) : le levier n°1",
          "- Demandez **explicitement**, au bon moment (après une vente réussie, un bon avis) : « Qui, autour de vous, a un projet immobilier dans les mois qui viennent ? »",
          "- Script : « Mon métier vit de la recommandation. Si vous avez été satisfait, le plus beau cadeau que vous puissiez me faire, c'est de me présenter une personne de votre entourage qui vend ou achète. »",
          "- Une recommandation se transforme bien mieux qu'un appel à froid : c'est la prospection la plus rentable qui existe.",
          "- Demandez aussi l'**introduction** : « Un simple message de votre part change tout » — une recommandation portée vaut dix numéros.",
          "## La sphère d'influence et le farming relationnel",
          "- Commerçants, gardiens, syndics, notaires, artisans, assureurs, coiffeurs : ce sont vos **capteurs** de projets.",
          "- Entretenez le lien : passez les voir, informez-les de vos ventes, remerciez les apporteurs.",
          "- Objectif : devenir **le réflexe** immobilier de votre quartier.",
          "## Les mandats échus : le phoning à forte valeur",
          "- Un bien retiré des portails sans vente = un vendeur déçu, encore motivé, qui connaît déjà l'intérêt d'un pro.",
          "- Script : « Bonjour, j'ai vu que votre bien n'est plus en ligne — il est vendu, ou vous avez changé d'avis ? » puis « Qu'est-ce qui n'a pas marché, selon vous ? » (la porte s'ouvre souvent sur le prix ou le manque de visites).",
          "## Organiser une session de phoning",
          "- Travaillez par **blocs** (batching) : 1 à 2 h d'appels d'affilée, sans interruption, mails fermés.",
          "- Debout, liste prête, objectif chiffré (« 20 appels, 2 RDV »).",
          "- Respectez les horaires légaux (lundi-vendredi, 10 h-13 h / 14 h-20 h).",
          "- Enchaînez : un « non » doit déclencher l'appel suivant dans les 10 secondes.",
          "## Gérer le non et le refus",
          "- Le refus n'est pas personnel : c'est un **ratio**, pas un jugement. Sur 20 appels, beaucoup de « non » sont normaux.",
          "- Tenez un **tableau de bord des ratios** : voir le « non » comme une étape vers le « oui » dédramatise.",
          "- Fixez-vous un objectif de **nombre d'appels**, pas de nombre de « oui » : seule l'action est sous votre contrôle.",
          "## Les erreurs fréquentes",
          "- Ne jamais relancer sa base « parce qu'ils me connaissent déjà ».",
          "- Attendre la recommandation au lieu de la demander.",
          "- Mélanger phoning et mails : on perd le rythme et les ratios s'effondrent.",
          "## Mini cas pratique",
          "Une négociatrice d'Icaza Immobilier bloque 1 h chaque matin pour appeler 5 anciens clients et 5 mandats échus du secteur. En un trimestre, deux recommandations et un mandat échu reconquis débouchent sur trois ventes — sans un seul appel à froid supplémentaire."
        ]
      },
      {
        "titre": "La prospection terrain : porte-à-porte, boîtage, pige physique",
        "contenu": [
          "La prospection physique crée la **notoriété locale** qui, à terme, fait venir les vendeurs **à vous**. C'est un investissement lent mais très défendable : un secteur « travaillé » au terrain devient votre territoire.",
          "## Le porte-à-porte",
          "- Prétexte utile : « Bonjour, je viens de vendre dans votre rue et j'ai des acquéreurs qui cherchent ici. Connaissez-vous quelqu'un qui vend, ou qui pense à vendre ? »",
          "- Objectif : **collecter de l'information et des contacts**, pas signer sur le pas de la porte.",
          "- Laissez toujours une trace : carte, flyer, « estimation offerte ».",
          "- Le porte-à-porte en face-à-face n'est **pas** du démarchage téléphonique : il n'est pas soumis à l'opt-in, mais restez courtois et acceptez un « non » sans insister.",
          "## Le boîtage et le pilonnage",
          "- Ciblez un secteur et **repassez régulièrement** (pilonnage) : la répétition crée la mémorisation — on retient l'agent qu'on voit plusieurs fois.",
          "- Messages à forte valeur : « VENDU dans votre quartier », « estimation offerte », « acquéreur recherche un T4 dans votre rue ».",
          "- L'application **Flyers de prospection** génère des supports personnalisés et datés.",
          "## La pige physique",
          "- Repérez sur le terrain les **panneaux « À vendre par le propriétaire »**, souvent absents des portails.",
          "- Notez l'adresse, recoupez pour retrouver le contact, et traitez-le comme une pige prioritaire.",
          "## Repérer les événements de vie",
          "- Les vraies ventes naissent d'événements : **succession, divorce, mutation professionnelle, naissance, départ en maison de retraite, agrandissement**.",
          "- Signaux repérables : maisons visiblement vides, boîtes aux lettres pleines, permis de construire affichés (projet de déménagement), panneaux d'un lotissement neuf.",
          "- Soyez le premier informé via votre **sphère d'influence** (gardiens, notaires, commerçants), dans le respect des personnes.",
          "## Devenir l'agent du quartier",
          "- Un **avis Google** après chaque vente nourrit votre réputation et votre pige entrante.",
          "- Vitrine, panneaux « Vendu », présence aux événements locaux : vous devenez le réflexe du secteur.",
          "- Les outils **Prospection ciblée** et **Ma tournée** organisent vos passages par zone et évitent les trous de couverture.",
          "## Les erreurs fréquentes",
          "- Boîter une seule fois puis conclure que « ça ne marche pas » : le terrain paie à la répétition.",
          "- Des flyers sans message de valeur (juste un logo) : personne ne les garde.",
          "- Ne pas noter ses passages : on repasse au hasard, on oublie les contacts chauds.",
          "## Mini cas pratique",
          "Secteur La Couronne / Carro (Martigues) : un négociateur boîte le même quartier tous les mois avec un flyer « VENDU » différent et une estimation offerte. Au 4ᵉ passage, une propriétaire en instance de mutation l'appelle « parce qu'elle le voit partout ». Mandat exclusif signé : c'est la **répétition** qui a fait le travail, pas un coup de chance."
        ]
      },
      {
        "titre": "La prospection digitale : personal branding & leads entrants",
        "contenu": [
          "Aujourd'hui, un vendeur tape votre nom sur Google avant de vous recevoir, et publie parfois son projet sur les réseaux avant d'appeler une agence. La **prospection digitale** attire des vendeurs **vers vous** (inbound) et crédibilise chaque contact sortant — un atout majeur depuis l'opt-in, où les leads entrants consentants deviennent précieux.",
          "## Votre vitrine : la fiche Google Business + les avis",
          "- Une fiche **Google Business Profile** complète (photos, horaires, zone) est votre première vitrine : la majorité des vendeurs vous « vérifient » dessus.",
          "- Les **avis clients** sont décisifs : demandez-en un **après chaque vente**, répondez à tous (même les négatifs, posément).",
          "- Un agent bien noté, avec de nombreux avis, inspire plus confiance que n'importe quelle annonce.",
          "## Les réseaux sociaux",
          "- **Facebook local** (groupes de quartier, Marketplace) : idéal pour piger et diffuser vos biens.",
          "- **Instagram** : la vitrine visuelle des biens, des coulisses et des « VENDU ».",
          "- **LinkedIn** : utile pour capter les mutations professionnelles et l'investisseur.",
          "- Règle d'or : **la régularité** (quelques publications par semaine) plutôt que la perfection ponctuelle.",
          "## Un calendrier de contenu simple",
          "- **Lundi** : un conseil utile (prix du m², DPE, home-staging, fiscalité de base).",
          "- **Mercredi** : un bien à vendre ou une coulisse de votre métier.",
          "- **Vendredi** : une preuve — « VENDU en X jours », un avis client, un chiffre du marché local.",
          "- Tenez ce rythme sur la durée : l'algorithme et la mémoire récompensent la **constance**, pas l'intensité d'une seule semaine.",
          "## Le contenu qui attire les vendeurs",
          "- « VENDU en X jours » : la preuve sociale qui donne envie de vous confier son bien.",
          "- Conseils pratiques (prix du m², home-staging, fiscalité) : vous devenez l'expert du secteur.",
          "- La **vidéo** (visite, portrait, conseil) génère le plus d'engagement et vous humanise.",
          "- Mettez en avant votre connaissance hyperlocale : « le marché de Martigues en 2026 ».",
          "## L'estimation en ligne : un aimant à vendeurs",
          "- Un outil d'**estimation en ligne** sur votre site capte des vendeurs **en amont** de leur décision.",
          "- Une demande d'estimation = un vendeur qui lève la main : c'est un **lead chaud et consentant**, précieux à l'heure de l'opt-in.",
          "## Les leads entrants : la règle des 5 minutes",
          "- Un lead web rappelé **dans les 5 minutes** se convertit bien mieux que rappelé à 24 h : la réactivité est l'arme n°1 du digital.",
          "- Organisez-vous pour ne **jamais laisser dormir** un formulaire ou un message.",
          "- Appelez toujours dans les horaires légaux ; si le lead a coché le consentement, vous pouvez aussi le relancer par SMS ou mail.",
          "## Les erreurs fréquentes",
          "- Publier trois fois puis abandonner : l'algorithme et la mémoire récompensent la régularité.",
          "- Négliger les avis Google.",
          "- Laisser un lead entrant attendre une journée : il a déjà appelé trois confrères.",
          "- Ajouter un contact web à ses relances SMS/email sans son consentement.",
          "## Mini cas pratique",
          "Un négociateur publie chaque vente en « VENDU » sur Facebook et Instagram et répond à ses avis Google sous 24 h. Un propriétaire de Saint-Mitre, qui le suit depuis des mois sans jamais l'avoir contacté, demande une estimation en ligne un dimanche. Rappelé le lundi à 10 h (horaires respectés), il signe un mandat : l'inbound a fait mûrir le contact avant le premier appel."
        ]
      },
      {
        "titre": "Prospecter les acquéreurs : le levier « j'ai un acquéreur »",
        "contenu": [
          "La pige cible les vendeurs, mais un fichier d'**acquéreurs qualifiés** est l'autre moitié de votre prospection — et votre meilleur ouvre-porte. « J'ai un acquéreur qui cherche exactement ce type de bien » est la phrase qui fait tomber les objections d'un vendeur.",
          "## Pourquoi un fichier acquéreurs change tout",
          "- Il **crédibilise** instantanément votre appel de pige : vous n'appelez pas pour « prendre un mandat », mais parce que vous avez un acheteur.",
          "- Il **accélère** les ventes : un bien rentré le matin peut être proposé l'après-midi à un acquéreur en attente.",
          "- Il nourrit la **recommandation** : un acquéreur satisfait parle de vous autour de lui.",
          "## Qualifier un acquéreur : les 4 questions clés",
          "- **Budget et finançabilité** : enveloppe réaliste, apport, et surtout capacité d'emprunt (simulation ou accord de principe bancaire).",
          "- **Besoin** : type de bien, surface, secteur, critères non négociables face aux simples souhaits.",
          "- **Décideurs** : qui décide vraiment ? (couple, co-investisseur, parents) — les réunir évite de « vendre deux fois ».",
          "- **Timing** : projet à 3 mois ou « on regarde » ? L'urgence dicte votre priorité de suivi.",
          "## Où capter des acquéreurs",
          "- Les **demandes entrantes** sur vos annonces et votre site (leads consentants).",
          "- Les **visites** : chaque visiteur qui n'achète pas ce bien est un acquéreur pour un autre.",
          "- Les acquéreurs **recalés** sur un bien déjà vendu : relancez-les dès qu'un bien correspond.",
          "- Les **vendeurs qui rachètent** : presque tout vendeur est aussi un futur acheteur.",
          "## Activer le fichier : la pige inversée",
          "- Repérez un bien pigé qui colle à un acquéreur en attente, puis appelez le vendeur : « j'ai un acquéreur pour votre bien ».",
          "- Communiquez vos recherches actives : « acquéreur recherche un T4 avec jardin à Martigues » (flyer, réseaux, bouche-à-oreille).",
          "- Tenez chaque acquéreur informé : un suivi régulier transforme un simple contact en client fidèle.",
          "## Rester dans le cadre légal",
          "- Un acquéreur qui vous sollicite ou dépose une demande **consent** au contact : conservez-en la preuve.",
          "- Pour le relancer par SMS ou mail, il faut son **opt-in** ; respectez les horaires légaux pour les appels.",
          "- Faites signer un **bon de visite** et, le cas échéant, un mandat de recherche : cela sécurise votre rémunération.",
          "## Les erreurs fréquentes",
          "- Faire visiter sans avoir vérifié la **finançabilité** : on perd des semaines sur un acquéreur non solvable.",
          "- Ne pas rappeler les acquéreurs « en stock » quand un bien correspond enfin.",
          "- Oublier que le vendeur d'aujourd'hui est l'acheteur de demain.",
          "## Mini cas pratique",
          "Un acquéreur, recalé sur un T3 déjà vendu à Martigues, est noté dans le fichier : budget validé par sa banque, recherche un T3 avec extérieur. Trois semaines plus tard, un PAP pige un bien correspondant. L'appel de pige devient imparable : « j'ai un acquéreur finançable qui cherche exactement votre bien ». RDV le soir même, mandat signé — l'acquéreur a ouvert la porte du vendeur."
        ]
      },
      {
        "titre": "Organisation, pilotage et indicateurs",
        "contenu": [
          "Ce qui ne se mesure pas ne s'améliore pas. La prospection est un **système** à piloter avec des indicateurs, un rythme et de la discipline — pas un effort d'humeur.",
          "## Le tunnel de prospection",
          "- Chaque étape a un **taux de passage** : contacts → RDV → mandats → ventes.",
          "- Si le résultat final manque, remontez le tunnel : le problème est presque toujours un **volume d'entrée** insuffisant, pas la technique.",
          "## Vos KPI hebdomadaires",
          "- Nombre de **contacts** (pige + terrain + phoning + digital).",
          "- Nombre de **RDV d'estimation** obtenus.",
          "- Nombre de **mandats** rentrés, dont **exclusifs**.",
          "- **Taux de transformation** à chaque étape, suivi dans le temps.",
          "## Remonter le tunnel quand ça coince",
          "- Peu de RDV malgré beaucoup d'appels ? Travaillez votre **script** et votre ciblage.",
          "- Des RDV mais peu de mandats ? Le blocage est en **rendez-vous** (découverte, estimation, closing).",
          "- Des mandats mais peu de ventes ? Revoyez le **prix** et la qualité des mandats pris.",
          "## La relance : là où tout se joue",
          "- La majorité des mandats se signent à la **2ᵉ, 3ᵉ ou 4ᵉ relance**, pas au premier contact.",
          "- Programmez un **séquençage** : J+7, J+30, J+90 — et tenez-le dans l'outil.",
          "- Un contact sans relance datée est un contact perdu : « je rappellerai un jour » n'existe pas.",
          "## Bloquer le temps (time-blocking)",
          "- Réservez un **créneau fixe quotidien** (ex. 9 h-11 h) dédié à la prospection, sacré et non négociable.",
          "- Mails et administratif **après**, jamais avant : l'urgent chasse toujours l'important.",
          "## Le CRM et l'application",
          "- **Chasse immobilière** : chaque bien PAP, son prix, son positionnement marché et ses relances.",
          "- **Prospection ciblée** et **Ma tournée** : vos passages terrain organisés par secteur.",
          "- **Suivi des négociateurs** : votre activité (chasses, tournées, appels, RDV) consolidée pour le pilotage managérial.",
          "## La discipline quotidienne",
          "- Un **rituel** simple bat la motivation : mêmes heures, mêmes gestes, chaque jour.",
          "- Auto-évaluation en fin de journée : « Combien de contacts ? Combien de RDV ? »",
          "- Le secret n'est pas l'intensité d'un jour, mais la **constance** sur des mois.",
          "## Les erreurs fréquentes",
          "- Piloter « au feeling », sans chiffres.",
          "- Ne relancer qu'une seule fois.",
          "- Laisser l'administratif grignoter le créneau de prospection.",
          "## Mini cas pratique : un plan de semaine type",
          "Du lundi au vendredi, 9 h-11 h : prospection bloquée (pige + phoning). Objectif : **25 contacts/semaine**, **5 RDV d'estimation**, **1 à 2 mandats/mois**. Relances programmées à J+7/J+30/J+90 dans la Chasse. Un mercredi après-midi de terrain (boîtage + porte-à-porte) sur le secteur du mois. Résultat : un pipeline qui ne se vide jamais, et un chiffre d'affaires lissé sur l'année."
        ]
      },
      {
        "titre": "Le mental du prospecteur : résilience, régularité et motivation",
        "contenu": [
          "La prospection est d'abord un **sport mental**. Les techniques se maîtrisent en quelques semaines ; ce qui sépare les meilleurs, c'est la capacité à **tenir dans la durée** malgré les refus et l'absence de résultat immédiat.",
          "## Le différé émotionnel",
          "- Vous semez aujourd'hui et récoltez dans 3 à 9 mois : apprenez à travailler **sans récompense immédiate**.",
          "- Jugez votre journée sur l'**action réalisée** (contacts, appels, RDV), pas sur le résultat du jour, que vous ne contrôlez pas.",
          "- Célébrez les **victoires de process** : « j'ai fait mes 20 appels » est une réussite en soi.",
          "## Dédramatiser le « non »",
          "- Un refus porte sur un **moment**, pas sur vous : le vendeur qui dit non aujourd'hui peut signer dans six mois.",
          "- Transformez le « non » en donnée : chaque refus vous rapproche statistiquement du prochain « oui ».",
          "- Préparez vos réponses aux objections **à froid** : on encaisse mieux ce qu'on a anticipé.",
          "## Adopter l'identité du prospecteur",
          "- Ne dites pas « je dois prospecter » mais « je **suis** quelqu'un qui prospecte tous les jours » : l'habitude suit l'identité.",
          "- Les professionnels qui durent ne sont pas les plus doués, mais les plus **réguliers**.",
          "## Les routines qui protègent la régularité",
          "- Un **rituel de démarrage** fixe (même heure, liste prête, debout) enclenche l'action sans négocier avec soi-même.",
          "- Un **partenaire de responsabilité** (binôme, manager) à qui annoncer ses chiffres du jour.",
          "- Une **récompense** après le bloc de prospection : le cerveau associe l'effort à du positif.",
          "## Éviter l'épuisement",
          "- Alternez les canaux (phoning, terrain, digital) pour casser la monotonie.",
          "- Fixez des objectifs **atteignables** : mieux vaut 15 appels tous les jours que 100 un lundi puis plus rien.",
          "- Soignez votre énergie (sommeil, pauses) : la voix et l'enthousiasme s'entendent au téléphone.",
          "## Les erreurs fréquentes",
          "- Prospecter seulement « quand on est motivé » : la motivation suit l'action, pas l'inverse.",
          "- Prendre les refus personnellement et se décourager après une mauvaise série.",
          "- Vouloir tout changer d'un coup : une seule habitude tenue vaut mieux que dix abandonnées.",
          "## Mini cas pratique",
          "Un négociateur débutant vit mal ses premières semaines « sans résultat ». Son manager lui fait suivre un seul chiffre : le **nombre de contacts créés par jour**, affiché au mur. En se concentrant sur l'action plutôt que sur le résultat, il tient la régularité ; deux mois plus tard, le différé joue et les premiers mandats tombent. Le déclic n'était pas technique, il était **mental**."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Quelle est la mission première d'un négociateur ?",
        "options": [
          "Rentrer des mandats",
          "Faire visiter les biens",
          "Rédiger de belles annonces",
          "Encaisser les commissions"
        ],
        "correct": 0,
        "explication": "Sans mandats au juste prix, il n'y a rien à vendre : rentrer des mandats (la prospection) est l'activité n°1."
      },
      {
        "question": "L'objectif d'un appel de pige est de…",
        "options": [
          "Donner le prix du bien au téléphone",
          "Négocier la commission",
          "Obtenir un rendez-vous",
          "Vendre le mandat en un seul appel"
        ],
        "correct": 2,
        "explication": "On décroche le RDV ; l'estimation et la vente des services se font en face-à-face."
      },
      {
        "question": "Les appels de démarchage vers les particuliers sont autorisés…",
        "options": [
          "7j/7 de 8 h à 21 h",
          "Du lundi au vendredi, de 10 h à 13 h et de 14 h à 20 h",
          "Uniquement le week-end",
          "À toute heure si le numéro est public"
        ],
        "correct": 1,
        "explication": "Le décret n° 2022-1313 du 13 octobre 2022 (en vigueur depuis le 1er mars 2023) limite les appels au lundi-vendredi, 10 h-13 h / 14 h-20 h ; samedi, dimanche et jours fériés sont interdits, avec un maximum de 4 sollicitations par mois."
      },
      {
        "question": "Depuis le 11 août 2026, avant d'appeler un particulier à des fins commerciales, le professionnel doit…",
        "options": [
          "Vérifier qu'il n'est pas inscrit sur Bloctel",
          "Lui envoyer d'abord un SMS d'information",
          "S'assurer d'avoir recueilli son consentement préalable (opt-in)",
          "Rien : c'est au consommateur de s'y opposer"
        ],
        "correct": 2,
        "explication": "La loi n° 2025-594 du 30 juin 2025 instaure l'opt-in depuis le 11 août 2026 : plus d'appel sans consentement préalable (libre, spécifique, éclairé, univoque, révocable), dont la preuve incombe au professionnel ; Bloctel a été supprimé. Sanctions jusqu'à 75 000 € (personne physique) / 375 000 € (personne morale) et nullité des contrats."
      },
      {
        "question": "La plupart des mandats se signent…",
        "options": [
          "Au premier contact",
          "Après plusieurs relances (J+7 / J+30 / J+90)",
          "Sans jamais relancer",
          "Uniquement par hasard"
        ],
        "correct": 1,
        "explication": "La relance régulière transforme bien plus que le premier appel : la plupart des mandats tombent à la 2ᵉ, 3ᵉ ou 4ᵉ relance, d'où l'importance d'un séquençage tenu dans l'outil."
      },
      {
        "question": "Face à un lead entrant (formulaire, estimation en ligne), la bonne pratique est de…",
        "options": [
          "Attendre qu'il relance",
          "Lui envoyer seulement un mail",
          "Le rappeler sous 48 h",
          "Le rappeler le plus vite possible, en quelques minutes"
        ],
        "correct": 3,
        "explication": "La « règle des 5 minutes » : un lead web rappelé immédiatement se convertit bien mieux ; au-delà, il a souvent déjà contacté des confrères."
      },
      {
        "question": "En pige, le meilleur ouvre-porte auprès d'un vendeur est souvent…",
        "options": [
          "Annoncer le montant de votre commission",
          "Dire « j'ai un acquéreur qui cherche exactement ce type de bien »",
          "Critiquer l'agence déjà en place",
          "Proposer une simple estimation par mail"
        ],
        "correct": 1,
        "explication": "Un fichier d'acquéreurs qualifiés et finançables crédibilise l'appel : « j'ai un acquéreur » fait tomber les objections bien mieux qu'un discours sur vos services."
      },
      {
        "question": "Pour tenir dans la durée, sur quoi le prospecteur doit-il d'abord se juger ?",
        "options": [
          "Le nombre de mandats signés le jour même",
          "Le chiffre d'affaires du jour",
          "L'action réalisée (contacts, appels, RDV), qu'il contrôle",
          "La chance du moment"
        ],
        "correct": 2,
        "explication": "La prospection paie en différé : on se juge sur l'action du jour, sous son contrôle, pas sur un résultat immédiat. La régularité bat le talent."
      },
      {
        "question": "Comment la « règle des 3 tiers du temps » répartit-elle idéalement la semaine d'un négociateur ?",
        "options": [
          "Un tiers prospection, un tiers découverte et estimations, un tiers vente et suivi",
          "Un tiers administratif, un tiers visites, un tiers publicité",
          "La moitié en prospection et la moitié en visites",
          "Un tiers formation, un tiers prospection, un tiers congés"
        ],
        "correct": 0,
        "explication": "La règle des 3 tiers équilibre la prospection, la transformation (découverte et estimations) et la récolte (vente et suivi) pour un pipeline régulier."
      },
      {
        "question": "Selon la loi des grands nombres en prospection, que faut-il augmenter en priorité pour obtenir davantage de mandats ?",
        "options": [
          "La qualité de ses annonces avant tout",
          "Le volume de contacts en haut du tunnel",
          "Le montant de ses honoraires",
          "Le nombre de ses jours de congé"
        ],
        "correct": 1,
        "explication": "La prospection étant un jeu de ratios, c'est d'abord le volume d'entrée (biens pigés, appels) qui détermine le nombre final de mandats."
      },
      {
        "question": "Parmi les gisements de la pige, quelle cible est considérée comme la n°1 ?",
        "options": [
          "Les mandats exclusifs des confrères",
          "Les particuliers qui vendent seuls (PAP)",
          "Les biens déjà sous compromis",
          "Les logements neufs vendus par un promoteur"
        ],
        "correct": 1,
        "explication": "Le PAP cherche à économiser la commission, pas à fuir les agences, ce qui en fait la cible prioritaire de la pige."
      },
      {
        "question": "Pour être le plus efficace, sur quelles annonces le négociateur pige-t-il en priorité ?",
        "options": [
          "Les annonces parues depuis moins de 48 heures",
          "Les annonces de plus de six mois uniquement",
          "Les annonces sans photo exclusivement",
          "Les annonces de biens déjà vendus"
        ],
        "correct": 0,
        "explication": "Un bien fraîchement paru reçoit vite ses premiers appels : piger sous 48 h permet d'être le premier professionnel sérieux à contacter le vendeur."
      },
      {
        "question": "Depuis le 11 août 2026, qu'est devenu le dispositif Bloctel (ancienne liste d'opposition au démarchage) ?",
        "options": [
          "Il a été renforcé et rendu obligatoire",
          "Il a été supprimé",
          "Il est devenu payant pour les professionnels",
          "Il a été étendu aux e-mails"
        ],
        "correct": 1,
        "explication": "Avec le passage au consentement préalable le 11 août 2026, Bloctel a été supprimé : s'y référer n'a plus aucun sens."
      },
      {
        "question": "Quelle situation échappe à l'interdiction de démarchage téléphonique sans consentement préalable ?",
        "options": [
          "Un appel à froid pour proposer une estimation",
          "Un appel portant sur un contrat en cours avec le client",
          "Un SMS commercial envoyé le dimanche",
          "Un appel à un numéro trouvé dans l'annuaire"
        ],
        "correct": 1,
        "explication": "L'appel relatif à un contrat en cours, et à son objet, fait partie des rares exceptions au régime du consentement préalable."
      },
      {
        "question": "Combien de temps au maximum peut-on conserver des données de prospection après le dernier contact avec la personne ?",
        "options": [
          "Un an",
          "Trois ans",
          "Dix ans",
          "Sans limite"
        ],
        "correct": 1,
        "explication": "Le RGPD et la CNIL fixent une conservation des données de prospection à trois ans maximum après le dernier contact."
      },
      {
        "question": "Pour prospecter un particulier par e-mail ou SMS, de quoi a-t-on besoin au préalable ?",
        "options": [
          "De rien, c'est libre pour les professionnels",
          "De son consentement préalable (opt-in)",
          "D'une inscription sur Bloctel",
          "D'un simple avis de la CNIL"
        ],
        "correct": 1,
        "explication": "La prospection par e-mail ou SMS vers un particulier exige son consentement préalable au titre de l'article L.34-5 du Code des postes et des communications électroniques."
      },
      {
        "question": "Dans la méthode CROC de l'appel de pige, que désigne la lettre O ?",
        "options": [
          "L'Observation du marché",
          "L'Objectif, c'est-à-dire décrocher le rendez-vous",
          "L'Offre de prix au téléphone",
          "L'Organisation de l'agenda"
        ],
        "correct": 1,
        "explication": "Dans CROC (Contact, Raison, Objectif, Conclusion), le O rappelle que le but de l'appel est d'obtenir le rendez-vous, pas de vendre au téléphone."
      },
      {
        "question": "Face à un vendeur qui répond « j'ai déjà une agence », quelle est la bonne relance ?",
        "options": [
          "Raccrocher poliment",
          "Demander si c'est en mandat simple ou en exclusivité",
          "Critiquer l'agence concurrente",
          "Proposer une baisse de commission immédiate"
        ],
        "correct": 1,
        "explication": "Savoir si le mandat est simple ou exclusif permet, en mandat simple, de proposer ses propres acquéreurs en plus sans heurter l'agence en place."
      },
      {
        "question": "La prospection en porte-à-porte, en face-à-face, est-elle soumise au régime du consentement préalable (opt-in) ?",
        "options": [
          "Oui, exactement comme le téléphone",
          "Non, car ce n'est pas du démarchage téléphonique",
          "Oui, mais seulement le week-end",
          "Non, car elle est totalement interdite"
        ],
        "correct": 1,
        "explication": "Le porte-à-porte n'est pas du démarchage téléphonique : il échappe à l'opt-in, à condition de rester courtois et d'accepter un refus."
      },
      {
        "question": "Quel canal de prospection affiche le meilleur taux de transformation ?",
        "options": [
          "L'appel à froid à des inconnus",
          "La recommandation (parrainage)",
          "Le boîtage anonyme",
          "L'envoi massif d'e-mails"
        ],
        "correct": 1,
        "explication": "Une recommandation se transforme bien mieux qu'un appel à froid : c'est la prospection la plus rentable qui existe."
      },
      {
        "question": "Pour un négociateur, quel est le rôle d'une fiche Google Business Profile bien tenue et d'avis clients nombreux ?",
        "options": [
          "Ils remplacent totalement la prospection terrain",
          "Ils constituent une vitrine qui inspire confiance et attire des vendeurs",
          "Ils sont interdits par la loi Hoguet",
          "Ils dispensent de prendre un mandat"
        ],
        "correct": 1,
        "explication": "La majorité des vendeurs vérifient l'agent en ligne : une fiche complète et de bons avis crédibilisent et génèrent de la pige entrante."
      },
      {
        "question": "Avant de faire visiter un bien à un acquéreur, quel point faut-il valider en priorité ?",
        "options": [
          "Sa disponibilité le week-end",
          "Sa finançabilité, c'est-à-dire sa capacité d'achat",
          "Sa couleur préférée",
          "Le nombre de biens déjà visités ailleurs"
        ],
        "correct": 1,
        "explication": "Faire visiter sans avoir vérifié la finançabilité fait perdre du temps et bloque inutilement le bien du vendeur."
      }
    ]
  },
  {
    "id": "decouverte",
    "titre": "Découverte & qualification",
    "icone": "🔎",
    "categorie": "Commercial",
    "resume": "Questionner, écouter et qualifier le vendeur, l'acquéreur et le bien (motivation, délai, prix, financement, SONCAS) avant d'argumenter.",
    "duree": "51 min",
    "lecons": [
      {
        "titre": "L'art du questionnement et de l'écoute active",
        "contenu": [
          "On ne convainc jamais sans avoir d'abord **compris**. La découverte précède toujours l'argumentation : c'est la phase la plus négligée du métier, et pourtant la plus décisive. Un négociateur qui argumente avant d'avoir questionné parle dans le vide — il vante des atouts dont le client n'a que faire et passe à côté du vrai besoin.",
          "## La règle d'or : écouter 70 %, parler 30 %",
          "Pendant la découverte, le client doit parler **plus des deux tiers du temps**. Votre travail n'est pas de briller, c'est de **faire parler**. Celui qui pose les questions **dirige** l'entretien ; celui qui parle croit diriger mais se livre.",
          "- Chaque minute passée à écouter vous donne un argument que vous ressortirez plus tard.",
          "- Chaque minute passée à argumenter trop tôt vous fait perdre une information et un peu de crédit.",
          "## Les 5 familles de questions",
          "- **Questions ouvertes** (« comment… », « pourquoi… », « parlez-moi de… ») : elles ouvrent, font parler, révèlent la motivation. Ce sont vos questions reines en début d'entretien.",
          "- **Questions fermées** (« avez-vous un prêt en cours ? », « êtes-vous propriétaire ? ») : elles valident un fait précis. On les garde pour la fin, pour verrouiller.",
          "- **Questions alternatives** (« plutôt jeudi 18 h ou samedi 10 h ? ») : elles orientent vers une décision en proposant deux « oui ».",
          "- **Questions ricochet / relais** (« c'est-à-dire ? », « par exemple ? », « et encore ? ») : elles relancent sans orienter et font approfondir.",
          "- **Questions miroir** : on répète le dernier mot du client sur un ton interrogatif (« trop cher ? ») pour le faire préciser sans le braquer.",
          "## La technique de l'entonnoir",
          "Structurez vos questions du **large vers le précis** : on part de questions **ouvertes** (le projet, la motivation, le contexte) pour finir par des questions **fermées** qui valident les faits (prix, délai, financement). On ne commence jamais par « quel est votre budget ? » : on y arrive progressivement.",
          "## Faire projeter le client",
          "Au-delà des faits, faites **se projeter** le client : il vit la situation par anticipation, et c'est là que naît la décision.",
          "- « Imaginons que votre bien soit vendu dans trois mois : qu'est-ce que ça change concrètement pour vous ? »",
          "- « Quand vous vous imaginez dans votre futur logement, qu'est-ce qui compte le plus ? »",
          "La projection révèle la **motivation profonde** et crée l'**envie**, bien plus qu'un argument asséné.",
          "## Le silence est un outil",
          "Après une question importante, **taisez-vous**. Le silence est inconfortable : le client le comble en précisant sa pensée, souvent en livrant l'information clé. L'erreur du débutant est de reposer aussitôt une deuxième question ou de répondre à la place du client.",
          "## L'écoute active : prouver qu'on écoute",
          "- **Accusé de réception** : « je comprends », « d'accord », hochements — on montre qu'on suit.",
          "- **Reformulation** : « Si je comprends bien, vous voulez vendre avant l'été pour financer votre achat à Sausset, c'est bien ça ? » La reformulation prouve l'écoute, corrige les malentendus et **fait dire oui**.",
          "- **Prise de notes** : notez devant le client (avec son accord). Cela valorise sa parole et vous sert de mémoire pour l'argumentation et le suivi.",
          "- **Synchronisation** : adoptez un débit et un vocabulaire proches des siens ; reprenez ses propres mots (« votre cocon », « un vrai coup de cœur »).",
          "## Erreurs fréquentes à éviter",
          "- Transformer la découverte en **interrogatoire** : alternez questions et moments de respiration, et justifiez vos questions (« pour mieux vous conseiller, puis-je vous demander… »).",
          "- **Argumenter trop tôt** : tant que vous n'avez pas le besoin, vous vendez à l'aveugle.",
          "- **Couper la parole** ou finir les phrases du client.",
          "- Enchaîner les **questions fermées en rafale**, qui donnent l'impression d'un formulaire administratif.",
          "## Mini cas pratique",
          "Un vendeur à Jonquières (Martigues) vous dit : « Je veux 320 000 €, c'est le prix. » Le débutant répond : « C'est trop cher pour le quartier. » (argument prématuré, conflit immédiat). Le pro questionne : « 320 000 €, d'accord — comment êtes-vous arrivé à ce chiffre ? » puis « et qu'allez-vous faire après la vente ? ». Il découvre que le vendeur doit **solder un prêt de 180 000 € et apporter 120 000 € à un achat à Istres** : le vrai sujet n'est pas 320 000 €, c'est **110 000 € nets dans sa poche**. On ne négocie plus du tout le même chiffre."
        ]
      },
      {
        "titre": "Préparer et conduire le rendez-vous de découverte (R1)",
        "contenu": [
          "La découverte ne s'improvise pas. Un R1 préparé et cadré inspire confiance et double votre taux de transformation. On vend souvent en **deux rendez-vous** : le **R1** (découverte + visite du bien) et le **R2** (avis de valeur + prise de mandat, traités dans les modules Estimation et Prise de mandat). Cette leçon se concentre sur le R1.",
          "## Préparer le rendez-vous (avant même de sonner)",
          "- Étudiez le **secteur** : prix/m² médian, ventes récentes comparables (base DVF), ambiance du quartier.",
          "- Repérez le bien sur **plan et vue satellite** : exposition, nuisances, accès, environnement immédiat.",
          "- Recherchez l'**historique** : le bien est-il déjà passé en vente ? à quel prix ? depuis combien de temps ?",
          "- Préparez votre **mallette** : book agence, références de ventes locales, avis clients, supports, et de quoi prendre des notes.",
          "- Fixez-vous un **objectif clair** : au R1, le but n'est pas de signer le mandat, c'est de **comprendre, créer la confiance et obtenir le R2**.",
          "## Les 4 premières minutes : créer le lien",
          "- **Ponctualité et tenue** : arriver à l'heure et soigné, c'est déjà un premier argument de sérieux.",
          "- **Sourire et regard** : un bonjour chaleureux et sincère vaut mieux que mille techniques.",
          "- **Trouver un point commun honnête** (le quartier, un détail de la maison), sans flagornerie.",
          "- **Observer le non-verbal** : le vendeur est-il tendu, pressé, fier de son bien ? Adaptez votre rythme au sien.",
          "On n'a jamais deux fois l'occasion de faire une première impression : le lien se crée avant le premier argument.",
          "## La structure d'un R1 en 5 temps",
          "- **1. Accueil & rapport** : briser la glace, mettre à l'aise, créer un lien sincère (2 minutes, pas 20).",
          "- **2. Cadrage (contrat d'entretien)** : annoncez le déroulé. « Voici comment je vous propose qu'on procède : d'abord vous me parlez de votre projet, ensuite vous me faites visiter, et je vous explique comment je travaille. Ça vous va ? »",
          "- **3. Découverte** : vos questions ouvertes (projet, motivation, délai, situation), **avant** de visiter.",
          "- **4. Visite commentée** : le client vous fait visiter — une mine d'informations (ce qu'il valorise, ce qu'il minimise, l'état réel, les travaux).",
          "- **5. Conclusion & prise de date** : reformulez, remerciez, et **fixez le R2** par alternative (« je reviens avec mon analyse de prix : mardi 18 h ou jeudi 18 h ? »).",
          "## Le « contrat de début d'entretien »",
          "Annoncer le cadre dès le départ **sécurise** le client et vous donne le fil directeur. Il sait ce qui va se passer, vous avez l'autorisation de poser vos questions, et vous reprenez la main à chaque étape. C'est la différence entre un entretien **dirigé** et une discussion qui part dans tous les sens.",
          "## La visite comme outil de découverte",
          "- Laissez le vendeur **raconter sa maison** : il vous livre son attachement, son histoire et ses motivations profondes.",
          "- Observez sans juger : état réel, travaux cachés, signaux de départ (cartons, pièce déjà vidée).",
          "- Repérez les **leviers SONCAS** (voir leçon dédiée) à travers ce qu'il met spontanément en avant.",
          "## Prendre des notes et structurer",
          "Tenez une **fiche de qualification** (voir leçon dédiée) : identité, situation, projet, motivation, délai, prix espéré, financement, concurrence (autres agences), décideurs. Une information non notée est une information perdue.",
          "## Erreurs fréquentes à éviter",
          "- Arriver **sans préparation** et découvrir le secteur devant le client.",
          "- **Donner un prix au R1** « à la louche » : le meilleur moyen de se décrédibiliser ou de se piéger. Le prix se présente au R2, preuves à l'appui (module Estimation).",
          "- Passer directement à la visite sans découverte : on visite **après** avoir compris le projet.",
          "- Oublier de **verrouiller le R2** avant de partir.",
          "## Mini cas pratique",
          "RDV chez un couple à Saint-Julien (Martigues). Vous arrivez 10 minutes en avance, vous avez noté 3 ventes comparables dans le quartier. Vous cadrez : « On fait le tour de votre projet, vous me montrez la maison, et je reviens jeudi avec une vraie analyse de prix. » Vous découvrez une **mutation professionnelle à Lyon dans 4 mois** : motivation forte, délai réel. Vous repartez avec le R2 fixé, **sans avoir lâché un seul chiffre**. Le concurrent qui a glissé « ça vaut dans les 400 000 » en partant a déjà perdu la main."
        ]
      },
      {
        "titre": "Qualifier le vendeur : la méthode M.D.P.P.",
        "contenu": [
          "Tous les mandats ne se valent pas. Qualifier un vendeur, c'est mesurer la **valeur réelle** d'un mandat avant d'y investir votre temps. Quatre axes la déterminent — retenez le mnémonique **M.D.P.P.** : **M**otivation, **D**élai, **P**rix, **P**ouvoir.",
          "## M — La Motivation",
          "Pourquoi vend-il, **vraiment** ? Plus la motivation est forte et concrète, plus le bien se vendra vite et au juste prix.",
          "- Motivations **fortes** : mutation professionnelle, divorce/séparation, succession, regroupement familial, difficultés financières, départ en maison de retraite, achat déjà engagé.",
          "- Motivations **faibles** : « pour voir », « si j'ai le prix », « on teste le marché ». → vendeur peu mûr, qui surévalue presque toujours.",
          "La question du **« pourquoi derrière le pourquoi »** : « Vous vendez pour acheter plus grand — et si vous ne trouviez pas à vendre, qu'est-ce que ça changerait pour vous ? » La réponse révèle la motivation profonde qui guidera toute la négociation.",
          "## D — Le Délai",
          "Y a-t-il une **échéance réelle** ? Un vendeur avec une date (rentrée scolaire, compromis d'achat signé, mutation) est un vendeur qui écoute le marché.",
          "- « À quelle date idéale aimeriez-vous avoir vendu ? »",
          "- « Et qu'est-ce qui se passe si ce n'est pas vendu à cette date ? »",
          "Un vendeur **sans délai** surévalue : il n'a rien à perdre à attendre. À l'inverse, un délai contraint est votre meilleur allié pour poser le juste prix.",
          "## P — Le Prix",
          "Quel prix a-t-il en tête, et surtout **comment l'a-t-il fixé** ?",
          "- « Avez-vous un prix en tête ? Comment êtes-vous arrivé à ce chiffre ? » (le voisin ? une annonce ? un besoin financier ?).",
          "- Distinguez le **prix rêvé** (ce qu'il aimerait), le **prix besoin** (ce dont il a besoin pour son projet) et le **prix marché** (ce que les ventes DVF démontrent).",
          "- Méfiez-vous du prix **adossé à une contrainte** : « il me faut 300 000 € pour solder mon prêt et financer mon achat ». Ce n'est pas un prix de marché, c'est un besoin — à requalifier.",
          "La présentation et la défense du prix relèvent du module **Estimation** ; ici, on **recueille** le prix espéré et sa logique.",
          "## P — Le Pouvoir (qui décide, qui signe)",
          "Erreur classique : argumenter des heures devant quelqu'un qui **ne peut pas décider seul**.",
          "- **Qui est propriétaire ?** Une personne, un couple, une indivision, une SCI ?",
          "- **Tous les décideurs sont-ils présents ?** On ne prend pas un mandat sans l'accord de tous ceux qui devront signer.",
          "- Cas **indivision / succession** : la vente exige l'accord de **tous les indivisaires** ; le mandat doit être signé par **chacun** (ou leur représentant dûment mandaté). Identifiez-les dès le R1.",
          "- Cas **divorce** : les deux ex-époux doivent consentir ; repérez le niveau de conflit, qui peut bloquer la vente.",
          "- Cas **SCI** : vérifiez qui a le pouvoir d'engager la société (le gérant seul, ou l'accord des associés selon les statuts).",
          "Qualifier le pouvoir vous évite de devoir **tout re-vendre** à un décideur absent au moment de signer.",
          "## La grille de priorisation des mandats",
          "- **Mandat A (prioritaire)** : motivation forte + délai réel + prix réaliste + décideurs alignés → foncez, visez l'exclusivité.",
          "- **Mandat B (à travailler)** : bonne motivation mais prix encore trop haut → prenez-le, avec un plan de réajustement.",
          "- **Mandat C (chronophage)** : pas de motivation, pas de délai, prix fantaisiste, décideur absent → à ne pas sur-investir, voire à refuser.",
          "## Script de qualification vendeur",
          "« Pour vous conseiller au mieux, j'ai besoin de bien comprendre votre projet. Qu'est-ce qui vous amène à vendre aujourd'hui ? … Et après la vente, quel est le projet ? … À quelle date aimeriez-vous idéalement avoir conclu ? … Avez-vous un prix en tête, et comment l'avez-vous estimé ? … La décision, vous la prenez à deux, ou êtes-vous le seul concerné ? »",
          "## Erreurs fréquentes à éviter",
          "- Prendre le **prix annoncé pour argent comptant** sans en chercher la logique.",
          "- Confondre **envie de vendre** et **vraie motivation**.",
          "- Oublier d'identifier **tous les décideurs**.",
          "- Sur-investir sur un mandat C par peur de perdre le contact.",
          "## Mini cas pratique",
          "Deux mandats le même jour. Mandat 1 : héritiers d'une maison à Ferrières, 3 frères, succession à régler, veulent vendre « vite et net », prix aligné sur le marché, mais **un frère vit à l'étranger et n'a rien signé**. Mandat 2 : couple à Carro, « on vend si on a 500 000 €, sinon on garde », aucun délai. Le mandat 1 est un **A… à condition de sécuriser le pouvoir** (faire signer les 3 frères, ou passer par le notaire chargé de la succession) ; le mandat 2 est un **C** chronophage. Priorité absolue : sécuriser le 1."
        ]
      },
      {
        "titre": "Les grandes situations de vente et leur psychologie",
        "contenu": [
          "Chaque vendeur arrive avec une **histoire** qui conditionne sa motivation, son délai, sa sensibilité au prix et son rapport à vous. Reconnaître la situation, c'est adapter sa posture et anticiper les blocages.",
          "## La mutation professionnelle",
          "- **Profil** : délai contraint (prise de poste), double charge possible (ancien + nouveau logement), motivation forte.",
          "- **Levier** : la rapidité et la sérénité. « On sécurise la vente pour que vous partiez l'esprit tranquille. »",
          "- **Piège** : vouloir « récupérer son prix » coûte que coûte malgré l'urgence. Rappelez le coût réel d'un bien qui traîne.",
          "## La succession",
          "- **Profil** : plusieurs héritiers, charge émotionnelle, parfois des désaccords, besoin de liquidités pour les droits.",
          "- **Levier** : le rôle de **tiers neutre** qui apaise et organise ; la rapidité pour solder l'indivision.",
          "- **Piège** : le **pouvoir** (tous les indivisaires doivent signer) et les conflits familiaux. Travaillez souvent **main dans la main avec le notaire** chargé de la succession.",
          "- **Rappel délai** : la déclaration de succession et le paiement des **droits** interviennent en principe dans les **6 mois** du décès (en France métropolitaine) — une vraie pression vers la vente.",
          "## Le divorce / la séparation",
          "- **Profil** : envie de « tourner la page », tension entre ex-conjoints, parfois l'un veut vendre et l'autre non.",
          "- **Levier** : neutralité absolue, discrétion, communication écrite et strictement égale aux deux parties.",
          "- **Piège** : prendre parti. Vous perdez le mandat si l'un se sent lésé. Les **deux** doivent consentir et signer.",
          "## L'agrandissement et la vente liée (achat-revente)",
          "- **Profil** : le vendeur achète en même temps qu'il vend ; sa vente finance son achat.",
          "- **Levier** : coordonner les deux opérations (le **chaînage**), rassurer sur le timing, parfois évoquer un **prêt-relais** ou une **clause de prorogation**.",
          "- **Piège** : il bloque son prix sur le besoin de son futur achat. Requalifiez : c'est un **besoin**, pas une valeur de marché. Vérifiez s'il a déjà **signé un compromis à l'achat** (urgence maximale).",
          "## L'investisseur qui revend",
          "- **Profil** : décision **rationnelle**, peu d'émotion ; il raisonne rendement, fiscalité, arbitrage de patrimoine.",
          "- **Levier** : les chiffres (prix/m², rendement, marché), le professionnalisme, l'efficacité.",
          "- **Piège** : il vous teste sur votre maîtrise du marché. Soyez précis, sinon il prend le dessus. Sa fiscalité (plus-value) relève d'un module dédié : ne vous improvisez pas conseiller fiscal.",
          "## Le propriétaire d'une passoire thermique (F/G)",
          "- **Profil** : bailleur ou propriétaire d'un logement classé **F ou G**, rattrapé par le calendrier de décence énergétique et le **gel des loyers**.",
          "- **Levier** : l'anticipation. Vendre avant que la contrainte ne s'alourdisse (location des logements **F interdite en 2028**) ou avant d'engager des travaux coûteux.",
          "- **Piège** : il raisonne encore au prix « d'avant », sans intégrer la **décote énergétique**. Requalifiez avec les faits : audit énergétique, coût réel des travaux, interdiction progressive de louer.",
          "## Les difficultés financières",
          "- **Profil** : vente contrainte (impayés, surendettement, divorce), parfois dans l'urgence, avec pudeur à l'avouer.",
          "- **Levier** : discrétion, humanité, efficacité, solution concrète.",
          "- **Piège** : le manque de tact. Et vérifiez l'existence d'une **hypothèque / inscription** : le prix de vente doit couvrir le capital restant dû (à anticiper avec le notaire).",
          "## Le vendeur « testeur » (sans vraie motivation)",
          "- **Profil** : « on regarde », pas de délai, prix fantaisiste.",
          "- **Levier** : aucun à court terme. **Qualifiez honnêtement**, ne sur-investissez pas, et gardez le contact (relance datée) pour le jour où la motivation apparaîtra.",
          "## Mnémonique",
          "Pour chaque vendeur, demandez-vous : **« Pourquoi — Quand — Pour quoi faire — Qui signe ? »**. La situation donne la réponse aux quatre.",
          "## Mini cas pratique",
          "Mme D., 74 ans, quitte sa villa de La Couronne pour une résidence senior à Martigues. Situation = **départ en établissement**. Motivation forte, délai réel (place réservée), émotion importante (maison de 40 ans). Les **enfants** sont décideurs de fait. Votre posture : respecter le rythme émotionnel, mais rester ferme sur le prix de marché pour financer la résidence. Vous identifiez tôt **qui signera** (la mère ? un enfant sous procuration ? une mesure de protection ?) pour ne pas bloquer au compromis."
        ]
      },
      {
        "titre": "Qualifier le bien : les informations à collecter sur le logement",
        "contenu": [
          "Qualifier, ce n'est pas seulement comprendre le vendeur et l'acquéreur : c'est aussi **connaître le bien** à fond. Un négociateur qui maîtrise le produit inspire confiance, fixe le juste prix et évite les mauvaises surprises au compromis. Beaucoup d'informations se collectent dès le R1, au fil de la visite et des questions.",
          "## La surface : Carrez et surface habitable",
          "- La **loi Carrez** mesure la superficie privative des **lots en copropriété** (on exclut notamment les surfaces dont la hauteur sous plafond est inférieure à 1,80 m) ; elle doit figurer dans le mandat et le compromis.",
          "- Une erreur de plus de **5 %** en défaveur de l'acquéreur ouvre droit à une **réduction du prix** : un mesurage sérieux protège tout le monde.",
          "- La **surface habitable (loi Boutin)** sert surtout pour la **location** : ne confondez pas les deux.",
          "- Une **maison individuelle** (hors copropriété) n'est pas soumise à la loi Carrez, mais on indique sa surface habitable pour informer l'acquéreur.",
          "## Les diagnostics (le DDT)",
          "Le **dossier de diagnostic technique** est annexé au compromis. Selon le bien, il peut comprendre :",
          "- Le **DPE**, l'**amiante** (permis de construire avant juillet 1997), le **plomb/CREP** (logement d'avant 1949).",
          "- L'**état des installations gaz et électricité** (de plus de 15 ans), l'**état des risques (ERP)**, les **termites** (zones sous arrêté) et l'**assainissement non collectif** le cas échéant.",
          "Vérifiez leur **validité** : des diagnostics à jour accélèrent la vente et rassurent (levier **Sécurité**).",
          "## Le DPE et la décence énergétique",
          "- Le **DPE est opposable** depuis juillet 2021 (le propriétaire engage sa responsabilité sur le classement affiché) et reste valable **10 ans**.",
          "- Calendrier de **décence énergétique** en métropole : logements classés **G interdits à la location depuis 2025**, **F à partir de 2028**, **E à partir de 2034**.",
          "- Les loyers des logements classés **F et G sont gelés** (aucune augmentation) depuis août 2022.",
          "- Un **audit énergétique** est obligatoire à la **vente** d'une maison individuelle ou d'un immeuble en monopropriété classé **F ou G** (depuis 2023), étendu au **E** depuis 2025.",
          "- Conséquence commerciale : un bien **F ou G** se négocie plus difficilement et sa valeur intègre une **décote travaux** ; pour un bailleur, c'est souvent le **déclencheur de la vente**.",
          "## La copropriété",
          "- Collectez le **montant des charges** annuelles, les **travaux votés** ou à venir, le **fonds de travaux**, les **procédures en cours** et l'état du **carnet d'entretien**.",
          "- Le vendeur devra fournir les documents de copropriété (dont l'**état daté**) : des charges lourdes ou un ravalement voté en assemblée pèsent directement sur la négociation.",
          "## La situation juridique et fiscale",
          "- Vérifiez le **titre de propriété**, l'existence d'une **hypothèque ou d'un privilège** (le prix doit couvrir le **capital restant dû** ; la mainlevée se règle avec le notaire), les **servitudes** et les règles d'**urbanisme (PLU)**.",
          "- Côté fiscalité du vendeur : la **résidence principale est exonérée** de plus-value.",
          "- Pour un autre bien, la plus-value des particuliers est taxée à **19 % au titre de l'impôt sur le revenu** et **17,2 % de prélèvements sociaux**, avec des **abattements pour durée de détention** (exonération d'impôt sur le revenu à **22 ans**, de prélèvements sociaux à **30 ans**) et une **surtaxe** au-delà de **50 000 € de plus-value imposable**.",
          "- Vous **repérez** ces éléments en découverte ; le calcul précis relève du **notaire** et du module dédié. Ne vous improvisez pas conseiller fiscal.",
          "## Les charges et taxes du quotidien",
          "Notez la **taxe foncière**, les charges de copropriété, le mode de **chauffage** et son coût : autant d'arguments, ou d'objections à anticiper, pour l'acquéreur.",
          "## Erreurs fréquentes à éviter",
          "- Prendre une **surface** au mot du vendeur sans mesurage sérieux.",
          "- Oublier le **DPE** et la contrainte de **décence énergétique**, qui pèsent sur le prix et sur la possibilité de louer.",
          "- Négliger les **travaux votés** en copropriété, découverts trop tard au compromis.",
          "- Ignorer une **hypothèque** que le prix de vente ne couvrirait pas.",
          "## Mini cas pratique",
          "Un appartement à Martigues, classé **F**, loué actuellement. Le propriétaire veut « garder son locataire et vendre au prix du quartier ». En qualifiant le bien, vous identifiez : **loyer gelé depuis 2022**, **interdiction de relouer en l'état dès 2028**, **audit énergétique obligatoire** et des **travaux de ravalement votés** en assemblée. Le vrai sujet n'est plus le prix affiché : c'est une **décote travaux** et une **urgence à vendre** avant que la contrainte ne pèse davantage. Vous reposez la discussion sur des bases réalistes."
        ]
      },
      {
        "titre": "Qualifier l'acquéreur : le financement d'abord",
        "contenu": [
          "Un acquéreur non qualifié coûte cher à tout le monde : visites inutiles, faux espoirs du vendeur, offres qui s'effondrent au financement. **Le premier réflexe n'est pas de montrer un bien, c'est de valider la capacité d'achat.** Un acquéreur réellement finançable vaut dix curieux.",
          "## Les 5 validations d'un acquéreur",
          "- **Financement** : apport, revenus, charges, crédits en cours, capacité d'emprunt, accord de principe bancaire éventuel.",
          "- **Projet** : résidence principale, secondaire, ou investissement locatif ? Primo-accédant ?",
          "- **Critères réels** : secteur, surface, nombre de chambres, extérieur — et surtout les incontournables vs les simples souhaits.",
          "- **Délai** : cherche depuis quand ? doit-il vendre avant (vente liée) ? a-t-il un bail qui se termine ?",
          "- **Motivation & pouvoir** : achète-t-il seul ou en couple ? les deux décideurs sont-ils présents aux visites ?",
          "## Parler argent sans gêne",
          "Beaucoup de débutants n'osent pas aborder le budget. C'est une erreur : **cadrez-le comme un service rendu**.",
          "- « Pour ne vous faire visiter que des biens réellement dans vos moyens, et ne pas vous faire perdre de temps, parlons budget quelques minutes. »",
          "- « Avez-vous déjà rencontré une banque ou un courtier ? Avez-vous une idée de votre capacité ? »",
          "- « Disposez-vous d'un apport ? » (sans apport, le financement est aujourd'hui plus difficile à obtenir).",
          "## Le calcul de capacité (règles HCSF en vigueur)",
          "- **Taux d'endettement maximal : 35 %** des revenus nets, **assurance emprunteur comprise**. Règle du **HCSF**, contraignante pour les banques depuis 2022.",
          "- **Durée maximale : 25 ans**, pouvant aller jusqu'à **27 ans** en cas d'achat dans le neuf ou de travaux significatifs (avec un différé d'amortissement de 2 ans maximum).",
          "- Les banques disposent d'une **marge de flexibilité de 20 %** de leur production trimestrielle pour déroger, en priorité pour la **résidence principale** et les **primo-accédants**.",
          "- Au-delà du taux d'endettement, la banque regarde le **reste à vivre** et le **saut de charge** (écart entre le loyer actuel et la future mensualité).",
          "## Méthode de calcul rapide",
          "- **Mensualité maximale** ≈ 35 % des revenus nets mensuels − les crédits en cours.",
          "- **Capacité d'emprunt** ≈ cette mensualité maximale, rapportée à la durée et au taux du moment.",
          "- **Budget total** = capacité d'emprunt + apport − frais.",
          "## Exemple chiffré (hypothèse pédagogique)",
          "- Couple, **4 500 € de revenus nets/mois**, un crédit auto de **300 €/mois**.",
          "- Mensualité max = 35 % × 4 500 = **1 575 €**, moins 300 € = **1 275 €** disponibles.",
          "- Sur **25 ans**, à un taux d'environ **3,5 % assurance comprise** : capacité d'emprunt ≈ **255 000 €**.",
          "- Avec **30 000 € d'apport** : budget d'achat ≈ **285 000 € frais compris**, soit un prix de bien d'environ **263 000 €**. Inutile de leur présenter un bien affiché à 320 000 €.",
          "## Raisonner en enveloppe TOTALE",
          "L'acquéreur doit financer **le prix + les frais de notaire + les honoraires** (si charge acquéreur). Qualifiez toujours le **budget tout compris**, puis déduisez la fourchette de prix.",
          "- **Frais de notaire** : environ **7 à 8 % du prix dans l'ancien**. Depuis le **1er avril 2025** et jusqu'en 2028, les départements peuvent relever les droits de mutation de **0,5 point** (jusqu'à environ 8 %), avec une **exonération possible pour les primo-accédants**.",
          "- Dans le **neuf**, les frais sont réduits à environ **2 à 3 % du prix**.",
          "- Exemple : budget 265 000 € tout compris, frais ~8 % → prix d'achat maximal ≈ **245 000 €**.",
          "## Le DPE entre dans le budget de l'acquéreur",
          "- Un bien **F ou G** suppose souvent des **travaux énergétiques** à financer en plus du prix : intégrez-les au plan de financement.",
          "- Pour un **investisseur**, rappelez la contrainte de **décence énergétique** (interdiction progressive de louer) et le **gel des loyers F/G** : c'est un vrai levier de négociation.",
          "## Les aides à connaître (pour orienter, pas pour conseiller)",
          "- **PTZ (prêt à taux zéro)** : réservé aux **primo-accédants** sous conditions de ressources. Depuis le **1er avril 2025** et pour trois ans, il est de nouveau ouvert au **neuf sur tout le territoire**, maison individuelle comprise.",
          "- La **quotité** finançable dépend du bien et des revenus : jusqu'à **50 % pour un appartement neuf** et **30 % pour une maison individuelle neuve** pour les ménages les plus modestes ; les tranches de revenus supérieures ont des quotités plus faibles.",
          "- Dans l'**ancien**, le PTZ reste surtout possible en **zones détendues**, sous condition de travaux d'amélioration importants.",
          "- Renvoyez toujours vers un **courtier ou la banque** pour le chiffrage précis : vous qualifiez, vous ne montez pas le prêt.",
          "## Reconnaître un acquéreur sérieux",
          "- Il connaît sa capacité, a vu une banque ou un courtier, a un apport, un projet clair et un délai.",
          "- Il se déplace, pose des questions concrètes, revient avec son conjoint décideur.",
          "- **Signaux de « touriste »** : refuse de parler budget, visite tout et n'importe quoi, jamais disponible, aucun financement engagé.",
          "## Dans l'application",
          "La fiche **Acquéreurs** centralise secteur, budget et critères, et permet le **rapprochement automatique** avec vos biens en chasse : sous l'annonce d'une fiche de chasse, les acquéreurs correspondants s'affichent pour la relance.",
          "## Erreurs fréquentes à éviter",
          "- Faire visiter **avant** d'avoir qualifié le budget.",
          "- Raisonner en **prix affiché** et non en **enveloppe totale**.",
          "- Prendre une **offre non financée** au sérieux et bloquer ainsi le bien du vendeur.",
          "- Se poser en **conseiller bancaire ou fiscal** : on oriente vers le courtier.",
          "## Mini cas pratique",
          "Un acquéreur veut visiter un T4 à 290 000 € à Martigues centre. Vous qualifiez : **3 800 € nets, 0 crédit, 15 000 € d'apport**. Capacité ≈ 1 330 €/mois → environ **265 000 € sur 25 ans**. Enveloppe ~280 000 € dont ~8 % de frais → **prix max ≈ 260 000 €**, et l'apport ne couvre même pas la totalité des frais. Le bien à 290 000 € est **hors budget**. Vous lui proposez plutôt un T3 à 235 000 € à Croix-Sainte : visite utile, pas de temps perdu, vendeur préservé."
        ]
      },
      {
        "titre": "Lire les motivations : la méthode SONCAS(E)",
        "contenu": [
          "Deux acquéreurs peuvent vouloir le **même bien** pour des raisons **opposées**. La grille **SONCAS** (enrichie en **SONCASE**) identifie le **levier de décision dominant** d'un client pour brancher votre discours dessus. On ne vend pas un pavillon « confort » comme un loft « nouveauté ».",
          "## Les 7 leviers",
          "- **S — Sécurité** : besoin d'être rassuré, pas de mauvaise surprise, un cadre carré. → Diagnostics en règle, process clair, garanties, quartier calme.",
          "- **O — Orgueil** : image, standing, reconnaissance sociale, « la belle adresse ». → Exclusivité, prestige, rareté, « vous serez chez vous dans LE quartier recherché ».",
          "- **N — Nouveauté** : attrait du neuf, de l'atypique, de la tendance. → Rénovation récente, bien original, domotique, « rare sur le marché ».",
          "- **C — Confort** : praticité, facilité du quotidien, zéro contrainte. → Plain-pied, proximité commerces/écoles, sans travaux, bien agencé.",
          "- **A — Argent** : bonne affaire, rentabilité, négociation, plus-value. → Prix/m² attractif, potentiel, revente facile, rendement locatif.",
          "- **S — Sympathie** : relation, confiance, feeling, « j'achète aussi la personne ». → Authenticité, disponibilité, écoute, chaleur.",
          "- **E — Écologie** : performance énergétique, faibles charges, confort thermique, sens. → Bon **DPE** (A/B/C), isolation, chauffage performant, « factures maîtrisées » (l'énergie relève du module DPE).",
          "## Détecter le levier dominant",
          "Le levier se repère **dans les mots du client** et dans ce qu'il met spontanément en avant :",
          "- « Est-ce que c'est un quartier sûr ? » → **Sécurité**.",
          "- « Combien ça peut se revendre ? », « il y a de la marge ? » → **Argent**.",
          "- « C'est quand même une adresse… » → **Orgueil**.",
          "- « Je ne veux aucun travaux » → **Confort**.",
          "- « Les charges, le chauffage, ça donne quoi ? » → **Écologie**.",
          "Posez franchement la question : « **Qu'est-ce qui est le plus important pour vous dans ce projet ?** » — la réponse donne souvent le levier n°1.",
          "## Un même bien, plusieurs discours",
          "Une villa rénovée à Saint-Julien (Martigues) :",
          "- Au profil **Argent** : « 3 % sous les dernières ventes du secteur, très bonne revente. »",
          "- Au profil **Confort** : « tout de plain-pied, à 5 minutes des écoles et des commerces, rien à refaire. »",
          "- Au profil **Sécurité** : « diagnostics tout récents, toiture refaite en 2022, quartier résidentiel calme. »",
          "- Au profil **Écologie** : « DPE C, isolation 2021, pompe à chaleur — des charges maîtrisées. »",
          "## Mnémonique",
          "**S.O.N.C.A.S.E.** : Sécurité, Orgueil, Nouveauté, Confort, Argent, Sympathie, Écologie. Un client a généralement **1 ou 2 leviers dominants** : identifiez-les en découverte, exploitez-les en argumentation (voir module Vente d'élite, méthode CAP/SONCAS).",
          "## Erreurs fréquentes à éviter",
          "- Projeter **son propre levier** (vous êtes « Argent », le client est « Sympathie »).",
          "- Dérouler **tous** les arguments : on cible le levier dominant, le reste dilue le message.",
          "- Oublier que le levier **change selon le projet** : un même client peut être « Argent » en investissement et « Confort » en résidence principale.",
          "## Mini cas pratique",
          "Un couple visite un appartement avec terrasse à L'Île, le centre historique de Martigues (« la Venise provençale »). Lui demande sans cesse le **rendement locatif** et « la marge à la revente » (**Argent**) ; elle s'extasie sur la **vue sur les canaux** et « s'y voit recevoir » (**Orgueil/Sympathie**). Deux discours menés en parallèle : à lui les chiffres et le potentiel, à elle l'émotion et le cadre de vie. Ignorer l'un des deux, c'est perdre la vente."
        ]
      },
      {
        "titre": "Qualifier au téléphone & la fiche de qualification (BANT immobilier)",
        "contenu": [
          "Avant d'investir une heure en rendez-vous ou en visite, **l'appel de qualification** vous fait gagner un temps précieux. L'enjeu : qualifier assez pour trier, sans sur-filtrer au point de perdre un bon contact. Et tout ce que vous recueillez doit **se noter** dans une fiche structurée.",
          "## Qualifier un acquéreur au téléphone",
          "Objectif : valider que le projet est réel et dans vos moyens, **sans faire fuir**.",
          "- « Pour quel type de projet recherchez-vous ? Résidence principale, investissement ? »",
          "- « Sur quel secteur, quelle surface, combien de chambres ? »",
          "- « Quel budget vous êtes-vous fixé, tout compris ? »",
          "- « Avez-vous déjà vu une banque ou un courtier pour votre financement ? »",
          "- « Vous cherchez depuis combien de temps ? Avez-vous un bien à vendre d'abord ? »",
          "Puis **décrochez le RDV** : « J'ai peut-être ce qu'il vous faut. Le mieux, c'est qu'on se voie : jeudi 18 h ou samedi 10 h ? »",
          "## Qualifier un vendeur au téléphone",
          "Objectif : obtenir le **RDV d'estimation**, et non tout qualifier au téléphone.",
          "- « Depuis quand pensez-vous à vendre ? Qu'est-ce qui motive ce projet ? »",
          "- « À quelle échéance aimeriez-vous avoir vendu ? »",
          "- « Avez-vous déjà une idée du prix ? »",
          "- « Vous décidez seul ou à plusieurs ? »",
          "On ne **donne jamais de prix au téléphone** : « Justement, pour être juste et sérieux, il faut que je voie le bien. On dit mardi 18 h ? »",
          "## Le bon dosage",
          "- Sur-filtrer tue des opportunités : un contact tiède peut devenir chaud. En cas de doute **favorable**, prenez le RDV.",
          "- Sous-qualifier vous noie sous les visites inutiles. Le budget et le financement, côté acquéreur, sont **non négociables** à valider.",
          "## La fiche de qualification (le socle du CRM)",
          "Tout ce qui est recueilli doit être **tracé**. Une fiche type comporte :",
          "- **Identité & contact** : nom, téléphone, e-mail.",
          "- **Projet** : vendre / acheter, type de bien, résidence principale / investissement.",
          "- **Motivation & délai** : pourquoi, pour quand.",
          "- **Prix / budget** : prix espéré (vendeur) ou enveloppe totale (acquéreur).",
          "- **Financement** (acquéreur) : apport, capacité, accord bancaire.",
          "- **Critères** : secteur, surface, chambres, incontournables.",
          "- **Pouvoir** : qui décide, qui signe.",
          "- **Concurrence** : autres agences mandatées, bien déjà en vente ?",
          "- **Historique & relances** : dates de contact, prochaine relance datée.",
          "## Le BANT immobilier",
          "Pour scorer un contact en un coup d'œil, retenez le **BANT** adapté à l'immobilier :",
          "- **B — Budget** : la capacité est-elle validée ?",
          "- **A — Authority (pouvoir)** : parle-t-on au décideur ?",
          "- **N — Need (besoin/motivation)** : la motivation est-elle réelle et datée ?",
          "- **T — Timing (délai)** : y a-t-il une échéance ?",
          "Quatre « oui » = contact **chaud, prioritaire**. Deux « oui » = à travailler. Zéro = à garder au chaud, sans sur-investir.",
          "## RGPD : une note de rigueur",
          "Vous collectez des **données personnelles** : informez la personne de l'usage qui en sera fait, ne conservez que l'utile, et respectez son droit d'accès et de suppression. La fiche de qualification sert le conseil, pas le fichage sauvage.",
          "## LCB-FT : une vigilance obligatoire",
          "L'agent immobilier est **assujetti** à la lutte contre le blanchiment et le financement du terrorisme (LCB-FT). Dès l'entrée en relation, il doit **identifier** son client, **comprendre** la nature de l'opération et l'**origine des fonds**, et déclarer tout soupçon à **Tracfin**.",
          "- Concrètement, en qualification : recueillir une **pièce d'identité**, comprendre **comment l'achat est financé**, et rester attentif aux **incohérences** (fonds sans origine claire, empressement anormal).",
          "- Ce n'est pas de la méfiance : c'est une **obligation légale** qui protège l'agence et sécurise la transaction.",
          "## Erreurs fréquentes à éviter",
          "- **Tout vouloir qualifier au téléphone** et perdre le RDV.",
          "- Donner un **prix au téléphone** (côté vendeur).",
          "- Ne **rien noter** : l'information s'évapore en 24 heures.",
          "- Ne pas fixer de **relance datée** : « je vous rappellerai » ne se fait jamais.",
          "## Mini cas pratique",
          "Un appel entrant sur une annonce à Martigues. En 4 minutes : résidence principale, budget 250 000 € tout compris, **apport 25 000 €, rendez-vous courtier déjà pris**, cherche depuis 3 mois, décide en couple, doit déménager avant septembre. BANT = **4/4 → contact chaud**. Vous fixez une visite groupée de 3 biens dans son budget samedi matin, et vous créez sa fiche immédiatement. Le même appel mal traité (« je vous envoie les annonces par mail ») se serait éteint le soir même."
        ]
      },
      {
        "titre": "Les pièges de la découverte & la synthèse qui fait vendre",
        "contenu": [
          "La découverte rate rarement par manque de questions : elle rate par **excès de parole**, par **argumentation prématurée** et par **absence de synthèse**. Cette leçon rassemble les pièges à éviter et organise la transition vers l'argumentation.",
          "## Les 8 pièges classiques",
          "- **Parler trop** : si vous parlez plus que le client, vous avez perdu la découverte.",
          "- **Argumenter avant d'avoir compris** : vous vantez des atouts dont le client n'a que faire.",
          "- **L'interrogatoire** : des questions fermées en rafale, sans lien ni chaleur — le client se ferme.",
          "- **Prendre le prix annoncé pour argent comptant** sans en chercher la logique.",
          "- **Oublier le délai** : sans échéance, pas de levier pour poser le juste prix.",
          "- **Zapper le financement** (acquéreur) : la plus belle visite ne vaut rien sans capacité d'achat.",
          "- **Ignorer le décideur absent** : vous devrez tout re-vendre à celui qui n'était pas là.",
          "- **Ne rien noter** : l'information non tracée est perdue, et le suivi s'effondre.",
          "## La synthèse : le pont vers l'argumentation",
          "Avant de passer à l'avis de valeur ou à l'argumentation, **reformulez l'ensemble** pour verrouiller l'accord sur le besoin :",
          "« Si je résume : vous vendez parce que vous êtes muté à Lyon, vous voulez avoir vendu d'ici 4 mois, l'important pour vous c'est la **sérénité** et un prix cohérent, et vous décidez avec votre épouse. C'est bien ça ? »",
          "Cette synthèse **fait dire oui**, prouve votre écoute et vous donne le **mandat d'argumenter** : « Dans ce cas, voici ce que je vous propose… »",
          "## La règle du lien découverte → argumentation",
          "Chaque argument que vous présenterez ensuite doit **répondre à un élément de la découverte**. Un argument qui ne sert pas un besoin identifié est un argument inutile. La découverte est votre **réservoir de munitions** : ce que le client vous a confié, vous le lui resservez transformé en bénéfice (voir module Vente d'élite, méthode CAP).",
          "## Checklist de fin de découverte",
          "- Je connais la **motivation réelle** (le « pourquoi derrière le pourquoi »).",
          "- Je connais le **délai** et son enjeu.",
          "- Je connais le **prix espéré / le budget total** et sa logique.",
          "- J'ai identifié **tous les décideurs**.",
          "- Côté acquéreur : le **financement** est qualifié.",
          "- J'ai **qualifié le bien** (surface, DPE, diagnostics, copropriété, situation juridique).",
          "- J'ai repéré le **levier SONCAS(E)** dominant.",
          "- J'ai une **fiche à jour** et une **prochaine étape datée** (R2, visite, relance).",
          "## Mnémonique de clôture",
          "Avant d'argumenter, vérifiez votre **« C.R.A.N. »** : **C**ompris (motivation), **R**eformulé (synthèse validée), **A**ligné (décideurs + prix + délai), **N**oté (fiche à jour). Pas de CRAN, pas d'argumentation.",
          "## Mini cas pratique",
          "Fin de R1 à Jonquières. Vous reformulez : départ en retraite, souhait de vendre d'ici 6 mois, levier **Sécurité** (ils veulent un acheteur solide et une vente sans accroc), prix à caler au R2, décision du couple. Les deux acquiescent. Vous enchaînez : « Parfait. Je reviens jeudi avec mon analyse de prix et mon plan pour vous vendre sereinement. » Vous avez le **CRAN** : la suite (estimation, mandat) coule de source."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Quelle répartition de parole viser en découverte ?",
        "options": [
          "Parler 70 %",
          "Écouter 70 %",
          "50/50",
          "Peu importe"
        ],
        "correct": 1,
        "explication": "La découverte repose sur l'écoute active : on laisse le client exprimer sa motivation réelle. Celui qui pose les questions dirige l'entretien."
      },
      {
        "question": "Quel critère qualifie en priorité un acquéreur ?",
        "options": [
          "Sa sympathie",
          "Son financement validé",
          "Le nombre de visites",
          "Son ancienneté"
        ],
        "correct": 1,
        "explication": "Un financement validé prouve la capacité réelle d'acheter. Un acquéreur finançable vaut dix curieux : on qualifie le budget avant de faire visiter."
      },
      {
        "question": "Dans SONCAS, le « A » correspond à…",
        "options": [
          "Ambiance",
          "Argent",
          "Attente",
          "Adresse"
        ],
        "correct": 1,
        "explication": "A = Argent : bonne affaire, rentabilité, négociation, plus-value. On lui parle prix/m², potentiel et revente."
      },
      {
        "question": "Le taux d'endettement maximal fixé par le HCSF est d'environ…",
        "options": [
          "20 %",
          "35 %",
          "50 %",
          "70 %"
        ],
        "correct": 1,
        "explication": "35 % des revenus nets, assurance comprise, règle contraignante depuis 2022, sur une durée généralement de 25 ans maximum (jusqu'à 27 ans dans le neuf ou avec travaux)."
      },
      {
        "question": "Pour qualifier le budget d'un acquéreur, il faut raisonner en…",
        "options": [
          "Prix affiché uniquement",
          "Enveloppe totale : prix + frais de notaire + honoraires",
          "Montant du prêt seulement",
          "Apport disponible"
        ],
        "correct": 1,
        "explication": "L'acquéreur finance le prix + les frais de notaire (environ 7-8 % dans l'ancien, 2-3 % dans le neuf) + les honoraires. On qualifie le budget tout compris, puis on en déduit la fourchette de prix."
      },
      {
        "question": "Pour vendre un bien détenu en indivision (succession), le mandat doit être signé par…",
        "options": [
          "L'aîné des héritiers",
          "Tous les indivisaires (ou leur représentant dûment mandaté)",
          "Le notaire seul",
          "N'importe lequel des héritiers"
        ],
        "correct": 1,
        "explication": "La vente d'un bien indivis exige l'accord de tous les indivisaires : chacun doit signer le mandat. Identifier ce « pouvoir de décision » dès le R1 évite un blocage au moment de signer."
      },
      {
        "question": "En quoi consiste la technique de l'entonnoir en découverte ?",
        "options": [
          "Partir de questions fermées pour finir par des questions ouvertes",
          "Partir de questions ouvertes et larges pour finir par des questions fermées et précises",
          "Ne poser que des questions fermées",
          "Commencer directement par la question du budget"
        ],
        "correct": 1,
        "explication": "L'entonnoir structure l'échange du large vers le précis : on ouvre sur le projet et la motivation, puis on valide les faits comme le prix, le délai et le financement."
      },
      {
        "question": "À quoi sert une question « ricochet » du type « c'est-à-dire ? » ou « par exemple ? » ?",
        "options": [
          "À conclure l'entretien",
          "À relancer et faire approfondir sans orienter la réponse",
          "À imposer un prix au client",
          "À changer de sujet"
        ],
        "correct": 1,
        "explication": "La question ricochet, ou relais, relance le client et le fait préciser sa pensée sans orienter sa réponse."
      },
      {
        "question": "Après avoir posé une question importante au client, quelle est la bonne attitude ?",
        "options": [
          "Enchaîner aussitôt une deuxième question",
          "Répondre soi-même à la place du client",
          "Se taire et laisser le silence faire parler le client",
          "Changer immédiatement de sujet"
        ],
        "correct": 2,
        "explication": "Le silence est inconfortable : le client le comble en précisant sa pensée, livrant souvent l'information clé."
      },
      {
        "question": "Dans la méthode M.D.P.P. de qualification du vendeur, que désigne le second P ?",
        "options": [
          "La Publicité",
          "Le Prix",
          "Le Pouvoir, c'est-à-dire qui décide et qui signe",
          "La Présentation du bien"
        ],
        "correct": 2,
        "explication": "M.D.P.P. signifie Motivation, Délai, Prix, Pouvoir : le dernier P vise l'identification de tous les décideurs qui devront signer."
      },
      {
        "question": "Parmi ces motifs de vente, lequel traduit une motivation FORTE ?",
        "options": [
          "« On teste le marché pour voir »",
          "Une mutation professionnelle",
          "« On vend seulement si on a notre prix »",
          "« Rien ne presse, on a le temps »"
        ],
        "correct": 1,
        "explication": "Une mutation professionnelle impose un délai réel et une motivation concrète, contrairement aux vendeurs « testeurs » qui surévaluent presque toujours."
      },
      {
        "question": "Quel est l'objectif principal du premier rendez-vous (R1) de découverte ?",
        "options": [
          "Faire signer le mandat à tout prix",
          "Annoncer le prix de vente définitif",
          "Comprendre le projet, créer la confiance et obtenir le R2",
          "Encaisser un acompte"
        ],
        "correct": 2,
        "explication": "Au R1, le but n'est pas de signer : c'est de comprendre, d'instaurer la confiance et de verrouiller le rendez-vous d'avis de valeur (R2)."
      },
      {
        "question": "À quoi sert le « contrat de début d'entretien » annoncé au R1 ?",
        "options": [
          "À fixer le montant des honoraires",
          "À annoncer le déroulé de l'entretien pour sécuriser le client et garder la main",
          "À engager juridiquement le vendeur",
          "À remplacer le mandat de vente"
        ],
        "correct": 1,
        "explication": "Annoncer le cadre dès le départ sécurise le client, autorise vos questions et transforme la discussion en entretien dirigé."
      },
      {
        "question": "Pourquoi ne faut-il pas donner de prix « à la louche » dès le R1 ?",
        "options": [
          "Parce que c'est interdit par la loi",
          "Parce qu'on risque de se décrédibiliser ou de se piéger sans preuves",
          "Parce que le vendeur n'a pas le droit de le connaître",
          "Parce que seul le notaire peut estimer"
        ],
        "correct": 1,
        "explication": "Le prix se présente au R2, comparables à l'appui : un chiffre lâché à chaud, sans analyse, décrédibilise ou enferme le négociateur."
      },
      {
        "question": "Dans une succession, dans quel délai interviennent en principe la déclaration et le paiement des droits en métropole ?",
        "options": [
          "Dans le mois du décès",
          "Dans les six mois du décès",
          "Dans les deux ans du décès",
          "Il n'y a aucun délai"
        ],
        "correct": 1,
        "explication": "La déclaration de succession et le paiement des droits se font en principe dans les six mois du décès en métropole, ce qui crée une vraie pression vers la vente."
      },
      {
        "question": "Dans la grille SONCASE, que désigne le E ajouté à SONCAS ?",
        "options": [
          "L'Épargne",
          "L'Écologie : performance énergétique, charges et confort thermique",
          "L'Exclusivité",
          "L'Esthétique"
        ],
        "correct": 1,
        "explication": "Le E de SONCASE correspond à l'Écologie : bon DPE, isolation, chauffage performant et factures maîtrisées."
      },
      {
        "question": "Un acquéreur qui demande sans cesse « est-ce un quartier sûr ? » révèle quel levier SONCAS dominant ?",
        "options": [
          "Orgueil",
          "Sécurité",
          "Argent",
          "Nouveauté"
        ],
        "correct": 1,
        "explication": "Le besoin d'être rassuré et de ne pas avoir de mauvaise surprise trahit le levier Sécurité."
      },
      {
        "question": "Quelle est la durée maximale d'emprunt fixée par les règles du HCSF ?",
        "options": [
          "15 ans",
          "20 ans",
          "25 ans, pouvant aller jusqu'à 27 ans dans le neuf ou avec travaux significatifs",
          "35 ans"
        ],
        "correct": 2,
        "explication": "Le HCSF plafonne la durée à 25 ans, étendue à 27 ans en cas d'achat dans le neuf ou de travaux importants avec différé d'amortissement."
      },
      {
        "question": "À combien s'élèvent approximativement les frais de notaire pour un bien ancien ?",
        "options": [
          "2 à 3 % du prix",
          "7 à 8 % du prix",
          "15 % du prix",
          "20 % du prix"
        ],
        "correct": 1,
        "explication": "Dans l'ancien, les frais de notaire représentent environ 7 à 8 % du prix, contre 2 à 3 % dans le neuf."
      },
      {
        "question": "Dans le BANT immobilier, que vérifie la lettre A (Authority) ?",
        "options": [
          "Le montant de l'apport",
          "Si l'on parle bien au décideur, à celui qui signera",
          "L'ancienneté de l'annonce",
          "L'adresse exacte du bien"
        ],
        "correct": 1,
        "explication": "Le A de BANT (Budget, Authority, Need, Timing) vérifie que l'on s'adresse au véritable décideur."
      },
      {
        "question": "Au titre de la LCB-FT, à quel organisme l'agent immobilier doit-il déclarer un soupçon de blanchiment ?",
        "options": [
          "À la CNIL",
          "À Tracfin",
          "À la mairie",
          "À la chambre des notaires"
        ],
        "correct": 1,
        "explication": "L'agent immobilier, assujetti à la LCB-FT, doit identifier son client, comprendre l'origine des fonds et déclarer tout soupçon à Tracfin."
      },
      {
        "question": "Que vérifie le mnémonique C.R.A.N. avant de passer à l'argumentation ?",
        "options": [
          "Le Compromis, le Règlement, l'Acte, le Notaire",
          "Compris, Reformulé, Aligné, Noté",
          "Le Contact, la Relance, l'Appel, la Négociation",
          "La Commission, le Rabais, l'Avance, le Net"
        ],
        "correct": 1,
        "explication": "Le C.R.A.N. valide que le besoin est Compris, Reformulé par une synthèse validée, Aligné sur les décideurs, le prix et le délai, et Noté avant d'argumenter."
      }
    ]
  },
  {
    "id": "estimation",
    "titre": "Estimation & avis de valeur",
    "icone": "📐",
    "categorie": "Commercial",
    "resume": "Fixer le juste prix : méthodes, données DVF, mesurage Carrez, valeur verte, cas particuliers et présentation de l'avis de valeur.",
    "duree": "48 min",
    "lecons": [
      {
        "titre": "Avis de valeur, estimation, expertise : bien nommer pour bien vendre",
        "contenu": [
          "L'estimation est le **socle de toute la transaction** : un prix juste dès le départ conditionne le délai de vente, le prix final obtenu et la confiance du vendeur. Tout le reste (marketing, visites, négociation) ne fait que corriger, à la marge, une estimation réussie ou ratée.",
          "## Trois mots, trois réalités juridiques",
          "- L'**avis de valeur** (ou « estimation ») est l'**opinion motivée** d'un professionnel de la transaction sur le prix de marché d'un bien. Il n'a pas de valeur juridique probante et ne peut pas être produit comme une expertise devant un tribunal. C'est ce que vous réalisez au quotidien.",
          "- L'**expertise immobilière** est un rapport normé, réalisé par un **expert** selon la Charte de l'expertise en évaluation immobilière, et engageant sa responsabilité. Elle est requise pour un contentieux, un partage judiciaire ou une garantie bancaire importante.",
          "- L'**évaluation fiscale** vise la **valeur vénale** retenue par l'administration (succession, donation, IFI). Une sous-évaluation expose à un redressement.",
          "Ne vendez jamais votre avis de valeur comme une « expertise » : le mot est juridiquement faux et vous expose.",
          "## La valeur vénale : notre boussole",
          "La **valeur vénale** est le prix auquel un bien pourrait raisonnablement se vendre dans des conditions normales de marché : vendeur et acquéreur de bonne foi, ni pressés ni contraints, bien correctement présenté sur un délai raisonnable.",
          "- Ce n'est **pas** le prix rêvé du vendeur.",
          "- Ce n'est **pas** le prix payé en 2021, au plus haut du marché.",
          "- Ce n'est **pas** le prix affiché par le voisin qui ne vend pas depuis huit mois.",
          "C'est le prix que le **marché a réellement payé** pour des biens comparables, récemment.",
          "## Les trois prix à ne jamais confondre",
          "- La **valeur vénale** : l'estimation technique, la vérité du marché.",
          "- Le **prix de présentation (FAI)** : le prix affiché, frais d'agence inclus ; on conserve une légère marge de négociation sans jamais sortir du marché.",
          "- Le **prix net vendeur** : ce que touche réellement le vendeur, soit prix FAI moins honoraires d'agence.",
          "Exemple : le vendeur veut toucher **250 000 € net**. Avec des honoraires de **12 000 € TTC** à la charge de l'acquéreur, le **prix FAI affiché** est de **262 000 €**. Annoncez toujours au vendeur son **net**, pas seulement le FAI.",
          "## Honoraires et frais de notaire : ce qui se cache derrière le prix",
          "- Les **honoraires d'agence** sont **librement fixés** : il n'existe aucun barème légal imposé. Mais ils doivent être **affichés TTC** et de façon lisible (arrêté du 10 janvier 2017) — en vitrine, sur votre site et dans chaque annonce.",
          "- Qui paie les honoraires change la fiscalité : lorsqu'ils sont **à la charge de l'acquéreur**, les **frais de notaire** se calculent sur le **net vendeur** (hors honoraires), ce qui les allège légèrement. C'est un argument de présentation utile.",
          "- Les **frais de notaire** sont payés par l'**acquéreur** : de l'ordre de **7 à 8 % dans l'ancien** et **2 à 3 % dans le neuf**. Depuis avril 2025, plus de 70 départements ont relevé leurs droits de mutation (+0,5 point, plafond 5 %), sauf pour les **primo-accédants** : comptez un peu plus dans l'ancien.",
          "Attention : le net vendeur n'est pas encore ce que le vendeur **empoche** ; il reste à déduire le remboursement éventuel du crédit et, le cas échéant, l'impôt sur la **plus-value** (traité dans le module dédié).",
          "## L'estimation, premier acte commercial",
          "Le rendez-vous d'estimation est souvent votre **première rencontre** avec un vendeur. C'est là que se joue la relation : un avis de valeur crédible, documenté et honnête inspire confiance ; une estimation « au doigt mouillé » ou flatteuse vous décrédibilise.",
          "Une estimation offerte et sérieuse est aussi un **outil de prospection** : même sans mandat immédiat, vous restez le professionnel de référence le jour où le vendeur se décide. La technique de prise de mandat elle-même est traitée dans le module La prise de mandat ; ici, on se concentre sur la **valeur** et sa **démonstration**.",
          "## Erreurs fréquentes",
          "- Confondre avis de valeur et expertise (faute de vocabulaire… et de droit).",
          "- Annoncer un prix FAI sans jamais préciser le net vendeur.",
          "- Donner un prix « par téléphone » sans avoir vu le bien : impossible d'ajuster, et destructeur de crédibilité.",
          "- Estimer pour « faire plaisir » plutôt que pour vendre.",
          "## Mini cas pratique",
          "Un vendeur à Martigues vous dit : « Mon voisin a mis son T3 à 230 000 €, je veux le même prix. » Réflexe : « Votre voisin l'**affiche** à 230 000 €, mais depuis combien de temps ? S'est-il **vendu** ? Je vais vous montrer ce que des T3 comparables se sont réellement vendus ces douze derniers mois. » On ramène toujours le débat du **prix affiché** au **prix réellement payé**."
        ]
      },
      {
        "titre": "Les méthodes d'évaluation",
        "contenu": [
          "Évaluer un bien, c'est choisir la **bonne méthode** selon sa nature, puis la **croiser** avec une autre pour sécuriser le résultat. Un bon avis de valeur ne repose jamais sur une seule approche.",
          "## La méthode par comparaison (la reine en résidentiel)",
          "On compare le bien à des biens **similaires réellement vendus** (et non affichés) sur le même secteur, puis on ajuste les écarts. C'est la méthode de référence pour un appartement ou une maison d'habitation.",
          "- Sélectionner 3 à 6 **ventes comparables** récentes (moins de douze mois idéalement).",
          "- Ramener chaque vente à un **prix au m²** exploitable.",
          "- Ajuster selon les différences (étage, état, extérieur, DPE…).",
          "- En déduire une **fourchette** de valeur, puis un prix central.",
          "C'est la méthode à privilégier et à savoir **démontrer**, preuve à l'appui.",
          "## La méthode par capitalisation du revenu (rendement)",
          "Pour un bien destiné à l'**investissement locatif** (ou déjà loué), la valeur se déduit du revenu qu'il génère.",
          "La formule de base : **valeur ≈ loyer annuel ÷ taux de rendement attendu** sur le secteur.",
          "Le **rendement brut** se calcule ainsi : (loyer mensuel × 12) ÷ prix × 100.",
          "Exemple : un studio loué 600 €/mois, soit 7 200 €/an. Si le marché attend un rendement brut de 6 %, la valeur ≈ 7 200 ÷ 0,06 = **120 000 €**. À 5 % attendu, elle monterait à 144 000 €.",
          "Retenez la logique : **rendement et prix évoluent en sens inverse**. Plus le rendement exigé par le marché est élevé, plus la valeur baisse à loyer donné.",
          "Le **rendement net** (après charges, taxe foncière, gestion, vacance) affine le raisonnement ; la rentabilité nette-nette et la stratégie d'investissement relèvent du module Investissement locatif.",
          "## La méthode par le coût de remplacement (ou de reconstruction)",
          "Le principe : **valeur ≈ valeur du terrain + coût de reconstruction à neuf − vétusté** (dépréciation physique, fonctionnelle et économique).",
          "- Utile pour les **biens atypiques** (sans comparable), le **neuf**, ou pour objectiver la part « bâti » d'une maison.",
          "- Attention : le coût de reconstruction n'est **pas** le prix de marché. Un bien peut coûter cher à reconstruire et valoir peu s'il est mal situé.",
          "## Le bilan promoteur (compte à rebours)",
          "Pour un **terrain constructible** ou un bien à démolir ou diviser, la valeur du foncier se calcule à rebours : **prix de vente prévisionnel du programme − coûts de construction − frais − marge du promoteur = charge foncière** (ce que le promoteur peut payer le terrain).",
          "C'est une méthode d'**expert**, à manier avec prudence ; en secteur PACA tendu, la pression foncière peut fortement valoriser un terrain à bâtir.",
          "## La méthode de la surface pondérée",
          "Toutes les surfaces n'ont pas la même valeur. On **pondère** chaque espace par un coefficient avant de le valoriser (voir la leçon sur le mesurage).",
          "- Surface habitable principale : coefficient **1**.",
          "- Terrasse, balcon : **0,3 à 0,5** (davantage en PACA, où l'extérieur est très prisé).",
          "- Cave, sous-sol : **0,1 à 0,3**.",
          "- Garage, parking : souvent valorisé **au forfait** (ordre de 10 000 à 25 000 € selon le secteur).",
          "On obtient une **surface pondérée** à laquelle on applique un prix/m² de référence.",
          "## Quelle méthode, quand ?",
          "- Appartement ou maison d'habitation : **comparaison** (+ pondération des annexes).",
          "- Immeuble de rapport, bien loué, local commercial : **capitalisation du revenu**.",
          "- Bien atypique, neuf, sans comparable : **coût de remplacement**.",
          "- Terrain à bâtir, division : **bilan promoteur**.",
          "Pour tout bien résidentiel, **croisez** au moins deux approches : elles doivent converger.",
          "## Mini cas pratique",
          "Un local loué à Martigues rapporte 9 600 €/an de loyer. Le marché des murs commerciaux du secteur attend un rendement de 7 %. Valeur par capitalisation ≈ 9 600 ÷ 0,07 = **137 000 €**. On confronte ensuite ce chiffre au prix/m² des locaux comparables vendus : si les deux convergent, l'avis de valeur est solide."
        ]
      },
      {
        "titre": "Les sources de données : DVF, Patrim et les limites des estimateurs en ligne",
        "contenu": [
          "Un avis de valeur crédible repose sur des **données objectives**, pas sur des impressions. Savoir où chercher — et jusqu'où faire confiance — est une compétence à part entière.",
          "## DVF : la vérité des ventes notariées",
          "La base **DVF (Demandes de Valeurs Foncières)**, publiée en open data par la **DGFiP**, recense les **mutations à titre onéreux** réellement enregistrées. C'est la source objective du prix de marché, bien plus fiable que les prix affichés des concurrents.",
          "- Elle couvre les ventes des **cinq dernières années**.",
          "- Elle est **mise à jour deux fois par an** (en avril et en octobre).",
          "- Elle **ne couvre pas** l'Alsace-Moselle (Bas-Rhin, Haut-Rhin, Moselle) ni Mayotte, qui relèvent du livre foncier.",
          "- Accès public et gratuit via le portail Etalab (explore.data.gouv.fr, app.dvf.etalab.gouv.fr).",
          "Limite : DVF donne le prix et la surface mais **peu de détails qualitatifs** (état, étage, DPE). À vous d'apporter la connaissance terrain.",
          "## Patrim : l'accès « particulier »",
          "Le service **Patrim** (« Rechercher des transactions immobilières »), dans l'espace particulier d'impots.gouv.fr, donne accès aux transactions pour un **besoin déclaré** (vente, succession, donation, IFI, expropriation). Les données sont plus détaillées que DVF, mais l'usage est encadré par la loi.",
          "## Les bases notariales et observatoires",
          "- **BIEN** (Île-de-France) et **PERVAL** (province) : bases alimentées par les notaires.",
          "- **Indices Notaires-INSEE**, observatoires locaux, données des réseaux : pour la **tendance** (hausse ou baisse, délais de vente).",
          "Croiser plusieurs sources évite de se tromper sur un marché qui bouge vite.",
          "## Les estimateurs en ligne (AVM) : utiles mais à corriger",
          "Les estimateurs automatiques (modèles statistiques) donnent un ordre de grandeur, mais ils **ignorent l'essentiel** : l'état réel, l'exposition, le vis-à-vis, les nuisances, la qualité de la copropriété, le DPE précis.",
          "- Ils raisonnent sur des **moyennes** : un bien atypique, ou très bien ou très mal placé dans sa rue, sera mal estimé.",
          "- Votre **valeur ajoutée** est justement de corriger la machine par la connaissance fine du terrain.",
          "Ne laissez jamais un vendeur opposer « le site m'a dit 280 000 € » à votre avis sans lui expliquer ces limites.",
          "## Prix affiché ≠ prix vendu",
          "Un bien se vend presque toujours **en dessous** de son prix d'affichage. La **marge de négociation** moyenne se situe de l'ordre de **4 à 7 %** selon les périodes et les secteurs, et grimpe fortement pour les biens **surévalués** ou **énergivores**.",
          "Travaillez donc toujours sur des **ventes réalisées**, jamais sur les annonces concurrentes encore en ligne.",
          "## Construire un dossier de comparables solide",
          "- Sélectionnez **3 à 6 ventes** réellement comparables (type, surface, secteur, période).",
          "- Écartez les cas atypiques (vente entre proches, succession bradée, prix hors marché).",
          "- Notez pour chacune : prix, prix/m², date, points forts et points faibles.",
          "- Présentez-les au vendeur **sous forme de preuve**, pas d'opinion.",
          "## Dans l'application",
          "L'outil de **positionnement marché** calcule, à partir des ventes DVF du secteur, le **prix/m² médian**, une **valeur estimée** et l'**écart avec le prix affiché**. Il vous donne une base objective à affiner avec votre connaissance terrain.",
          "## Erreurs fréquentes",
          "- S'appuyer sur les **prix affichés** des concurrents plutôt que sur les ventes DVF.",
          "- Oublier que DVF a plusieurs mois de **décalage** : sur un marché qui tourne, recoupez avec la tendance récente.",
          "- Prendre un estimateur en ligne pour argent comptant.",
          "## Mini cas pratique",
          "Pour un T3 à Martigues, DVF vous donne cinq ventes de T3 du secteur sur douze mois : prix/m² de 3 050 à 3 400 €, médiane 3 200 €. Vous retenez 3 200 €/m² comme référence, puis vous ajustez selon l'étage, la terrasse et le DPE du bien à estimer. L'avis n'est plus une opinion : c'est une **démonstration**."
        ]
      },
      {
        "titre": "Mesurer et pondérer les surfaces : Carrez, Boutin, annexes",
        "contenu": [
          "Une estimation juste commence par un **mesurage juste**. Se tromper de surface, ou de type de surface, fausse tout le prix/m² — et peut engager la responsabilité du vendeur.",
          "## Loi Carrez : la surface privative en copropriété",
          "La **loi Carrez** (loi du 18 décembre 1996) impose de mentionner la **surface privative** de tout lot de copropriété vendu.",
          "- On compte les planchers des **locaux clos et couverts**, après déduction des murs, cloisons, marches, cages d'escalier, gaines et embrasures.",
          "- On **ne compte pas** les surfaces dont la **hauteur sous plafond est inférieure à 1,80 m**.",
          "- Sont **exclus** : caves, garages, emplacements de stationnement, ainsi que tout **lot ou fraction de lot inférieur à 8 m²**.",
          "- En cas d'**erreur de plus de 5 %** (surface réelle inférieure à l'annoncée), l'acquéreur peut demander une **diminution du prix proportionnelle**, par action dans **l'année** suivant l'acte authentique.",
          "La maison individuelle (hors copropriété) n'est **pas** soumise à la loi Carrez.",
          "## Loi Boutin : la surface habitable pour la location",
          "La **surface habitable « loi Boutin »** figure dans les **baux d'habitation** (location vide). Elle correspond à la surface de plancher des pièces, déduction faite des murs, cloisons et des parties de hauteur inférieure à 1,80 m.",
          "- Elle **exclut** caves, sous-sols, garages, terrasses, balcons, loggias, vérandas non chauffées et combles non aménagés.",
          "- Elle est donc souvent **inférieure** à la surface Carrez.",
          "## Carrez, Boutin, surface utile, surface pondérée : ne pas confondre",
          "- **Carrez** : vente en copropriété (surface privative).",
          "- **Boutin** : location (surface habitable).",
          "- **Surface utile** : surface habitable + la moitié des annexes (usage fiscal et logement social).",
          "- **Surface pondérée** : surface « commerciale » reconstituée pour l'estimation, annexes pondérées par des coefficients.",
          "Ces surfaces ne sont **pas interchangeables** : on estime en général sur une **surface pondérée**, mais on communique la **Carrez** à la vente et la **Boutin** au bail.",
          "## Pondérer les surfaces annexes",
          "On applique un coefficient à chaque espace selon sa valeur d'usage (coefficients indicatifs, à adapter au marché local) :",
          "- Habitable principale : **1**.",
          "- Terrasse ou balcon : **0,3 à 0,5**.",
          "- Combles aménageables : **0,3 à 0,6**.",
          "- Cave, cellier, sous-sol : **0,1 à 0,3**.",
          "- Garage ou parking : souvent **au forfait** (ordre de 10 000 à 25 000 € selon le secteur).",
          "- Jardin : valorisé à part selon surface, exposition et constructibilité.",
          "## En PACA : l'extérieur, un multiplicateur de valeur",
          "À Martigues, et plus largement en PACA, un **extérieur** (terrasse, loggia, jardin, vue mer ou étang) pèse bien plus lourd que la moyenne nationale. Une terrasse plein sud peut se pondérer jusqu'à **0,5**, voire davantage sur un bien avec vue.",
          "Un T3 de 65 m² Carrez **avec** grande terrasse plein sud ne se compare pas à un T3 de 65 m² sans extérieur : la pondération fait la différence de prix.",
          "## Erreurs fréquentes",
          "- Confondre Carrez (vente en copropriété) et surface habitable Boutin (bail).",
          "- Compter une surface de hauteur inférieure à 1,80 m dans le Carrez.",
          "- Oublier qu'une maison individuelle n'est pas soumise au Carrez (mais la surface annoncée doit rester exacte, sous peine de dol).",
          "- Négliger la pondération des annexes et sous-estimer un bien à fort extérieur.",
          "## Mini cas pratique",
          "Appartement à Martigues : 68 m² Carrez + terrasse 20 m² (coefficient 0,45) + cave 6 m² (coefficient 0,2) + un parking (forfait 12 000 €). Surface pondérée = 68 + (20 × 0,45) + (6 × 0,2) = 68 + 9 + 1,2 = **78,2 m²**. À 3 200 €/m², cela donne ≈ 250 000 €, **plus** 12 000 € de parking = **262 000 €** environ. Sans pondérer la terrasse et la cave, on aurait sous-évalué de près de 33 000 €."
        ]
      },
      {
        "titre": "Les critères d'ajustement : de la référence au prix du bien",
        "contenu": [
          "Partant d'un **prix/m² de référence** issu des comparables, on ajuste à la hausse ou à la baisse selon les caractéristiques réelles du bien. C'est le cœur du métier d'estimateur.",
          "## Les critères qui font bouger le prix",
          "- **Localisation fine** : rue, calme ou nuisances (voie passante, voie ferrée, école bruyante), vue, commerces, écoles, transports.",
          "- **Étage et exposition** : présence d'un ascenseur, dernier étage, plein sud valorisant (surtout en PACA), rez-de-chaussée souvent décoté.",
          "- **État et travaux** : refait à neuf contre à rénover ; le coût des travaux se déduit, souvent **majoré** d'un « coût psychologique ».",
          "- **Prestations** : balcon, terrasse, parking, cave, extérieur, piscine, climatisation (très recherchée en PACA).",
          "- **Surface et agencement** : un bon plan vaut mieux que des m² mal distribués ; attention aux pièces aveugles et aux chambres en enfilade.",
          "- **DPE** : une étiquette F ou G décote (travaux, restrictions de location) ; A ou B valorise (voir la leçon dédiée).",
          "- **Servitudes, vis-à-vis, mitoyenneté, droit de passage** : autant de moins-values potentielles.",
          "## La grille d'ajustement : plus-values et moins-values",
          "Formalisez vos ajustements sous forme de **plus-values** et **moins-values** chiffrées, pour les expliquer au vendeur :",
          "- Terrasse plein sud : **+ 15 000 €**.",
          "- Travaux de rafraîchissement à prévoir : **− 20 000 €**.",
          "- Absence d'ascenseur au 4ᵉ étage : **− 8 000 €**.",
          "- Place de parking en centre-ville : **+ 12 000 €**.",
          "Le prix final n'est alors plus une opinion mais le **résultat d'un calcul** que le vendeur peut suivre.",
          "## Le poids de la copropriété",
          "En copropriété, l'estimation doit intégrer la **santé de l'immeuble** :",
          "- Montant des **charges** (des charges élevées décotent).",
          "- **Travaux votés** ou à venir (ravalement, toiture, ascenseur) : le coût pèse sur l'acquéreur.",
          "- **Procédures**, impayés, syndic défaillant : facteurs de décote.",
          "- À l'inverse, un immeuble **bien tenu** et sans gros travaux rassure et valorise.",
          "## Le coût psychologique des travaux",
          "Un acquéreur ne déduit pas seulement le **coût réel** des travaux : il déduit aussi le **temps, le risque et l'effort**. 20 000 € de travaux réels peuvent se traduire par **30 000 à 40 000 €** de décote dans la tête de l'acheteur.",
          "D'où l'intérêt, pour un vendeur, de **rafraîchir avant de vendre** quand c'est possible : le home-staging et les petits travaux se traitent dans le module Marketing du bien.",
          "## Les seuils de recherche psychologiques",
          "Les acquéreurs recherchent par **tranches de budget** sur les portails (« jusqu'à 200 000 € », « jusqu'à 250 000 € »). Un bien affiché à **205 000 €** n'apparaît **pas** dans la recherche « ≤ 200 000 € » : on prive le bien d'une partie de son audience.",
          "Positionnez le prix FAI **juste sous un seuil** quand c'est possible (199 000 € plutôt que 205 000 €) : plus de contacts, donc plus de concurrence entre acquéreurs.",
          "## Erreurs fréquentes",
          "- Ajuster « au feeling » sans chiffrer les plus-values et moins-values.",
          "- Oublier d'intégrer les charges et travaux de copropriété.",
          "- Sous-estimer le coût psychologique des travaux.",
          "- Afficher juste au-dessus d'un seuil de recherche et perdre en visibilité.",
          "## Mini cas pratique",
          "Référence secteur : 3 200 €/m² pour un T4 de 80 m², soit 256 000 €. Le bien a une belle terrasse (+ 15 000 €) mais nécessite une cuisine et une salle de bains (− 22 000 € de coût psychologique) et se situe au 3ᵉ sans ascenseur (− 8 000 €). Valeur ajustée ≈ 256 000 + 15 000 − 22 000 − 8 000 = **241 000 €**. Affichage FAI conseillé : **249 000 €** (sous le seuil des 250 000 €), avec un net vendeur cohérent."
        ]
      },
      {
        "titre": "DPE et valeur verte : l'impact énergétique sur le prix",
        "contenu": [
          "Depuis la loi Climat et résilience, la **performance énergétique** est devenue un **critère de prix majeur**, surtout pour les étiquettes F et G (« passoires thermiques »). L'ignorer, c'est surévaluer. Le détail technique du DPE relève du module DPE & performance énergétique ; ici, on raisonne **impact sur la valeur**.",
          "## Le DPE est opposable : un argument de prix, pas un détail",
          "Depuis le **1er juillet 2021**, le DPE est **opposable** : l'acquéreur peut se retourner si la classe affichée est erronée. Un DPE est valable **dix ans**.",
          "Le DPE indique aussi une **estimation des coûts annuels d'énergie** : un chiffre concret qui parle immédiatement à l'acquéreur, et un levier de négociation sur un bien énergivore.",
          "Le DPE n'est plus seulement informatif : il **conditionne le prix** et la **capacité à louer**. C'est un argument, pas une ligne du dossier.",
          "## La valeur verte : combien décote une passoire ?",
          "Les études des **Notaires de France** sur la « valeur verte » montrent qu'à bien comparable, une maison classée **F ou G** se vend avec une **décote** par rapport à une classe D : de quelques pour cent à **plus de 15 %** selon les régions et le type de bien.",
          "- En **PACA**, marché tendu et attractif, la décote est généralement **plus modérée** qu'ailleurs, mais elle existe et s'accentue.",
          "- À l'inverse, une étiquette **A ou B** constitue désormais une **plus-value** et un argument de vente fort.",
          "## L'audit énergétique obligatoire à la vente (calendrier)",
          "Pour la vente d'une **maison individuelle** ou d'un **immeuble en monopropriété**, un **audit énergétique** (plus complet que le DPE) est obligatoire selon un calendrier :",
          "- Classes **F et G** : depuis le **1er avril 2023**.",
          "- Classe **E** : depuis le **1er janvier 2025**.",
          "- Classe **D** : à compter du **1er janvier 2034**.",
          "L'audit propose des scénarios de travaux chiffrés : il **objective** le coût de rénovation… et donc la marge de négociation de l'acquéreur.",
          "## Les interdictions de location : ce qui effraie les investisseurs",
          "Un acquéreur investisseur regarde la **capacité à louer**. Le calendrier d'interdiction (logement considéré indécent) pèse directement sur la valeur :",
          "- Depuis le **1er janvier 2025** : les logements classés **G** ne peuvent plus être loués (nouveaux baux et renouvellements).",
          "- **1er janvier 2028** : interdiction pour les logements **F**.",
          "- **1er janvier 2034** : interdiction pour les logements **E**.",
          "- Depuis le **24 août 2022**, les loyers des logements **F et G** sont **gelés** (aucune augmentation ni indexation possible).",
          "Un bien G vendu à un investisseur subit donc une **double décote** : travaux à prévoir et perte de rendement locatif.",
          "## Réforme 2024 des petites surfaces",
          "Depuis le **1er juillet 2024**, la méthode de calcul du DPE a été **corrigée pour les logements de 40 m² ou moins**, jusque-là injustement pénalisés. Environ **140 000 logements** sont ainsi sortis du statut de passoire.",
          "Pour un DPE réalisé **avant** cette date sur un petit logement, une **nouvelle étiquette** peut être générée sur l'observatoire DPE-Audit de l'ADEME, sans refaire le diagnostic. Vérifiez-le : un studio « G » peut être redevenu « F » ou « E », ce qui change l'estimation.",
          "## Intégrer l'énergie dans l'estimation",
          "- **Chiffrez** le coût des travaux de rénovation (ou reprenez l'audit).",
          "- Appliquez la **décote de valeur verte** du secteur.",
          "- Ajoutez l'**impact commercial** : un bien énergivore met **plus longtemps** à se vendre et se négocie davantage.",
          "- Pour un vendeur, une **rénovation ciblée avant vente** peut faire gagner une ou deux classes et réduire fortement la décote.",
          "## Erreurs fréquentes",
          "- Estimer un F ou G comme un D « pour ne pas fâcher le vendeur ».",
          "- Ignorer l'audit énergétique obligatoire et ses chiffrages.",
          "- Oublier la réforme des petites surfaces et surévaluer la décote d'un studio.",
          "- Négliger l'effet « investisseur » du calendrier d'interdiction de location.",
          "## Mini cas pratique",
          "Maison à Martigues, estimée **310 000 €** en classe D comparable. Le bien est classé **G** : audit chiffrant 45 000 € de travaux, décote de valeur verte et allongement du délai. On aboutit à une valeur réaliste de l'ordre de **270 000 à 280 000 €**, à expliquer au vendeur preuves à l'appui — ou à l'inciter à engager des travaux avant la mise en vente."
        ]
      },
      {
        "titre": "Estimer les cas particuliers : bien loué, viager, indivision, atypique",
        "contenu": [
          "Certains biens échappent à la simple comparaison. Savoir les estimer — ou savoir quand passer la main à un spécialiste — fait la différence entre un amateur et un professionnel.",
          "## Le bien occupé ou loué : la décote d'occupation",
          "Un logement **vendu loué** vaut **moins** qu'un logement libre : l'acquéreur hérite du locataire, du loyer en place et de l'impossibilité d'occuper immédiatement.",
          "- Décote courante de l'ordre de **10 à 20 %** selon la durée de bail restante, le niveau du loyer (sous-évalué ou non) et le profil du locataire.",
          "- Un loyer **en place élevé** réduit la décote (le bien intéresse un investisseur) ; un loyer **faible et bloqué** l'accentue.",
          "Les règles du bail et du congé pour vente relèvent du module Location & baux d'habitation.",
          "## Le viager : bouquet, rente et droit d'usage",
          "En viager occupé, la **valeur vénale** du bien est transformée en **bouquet** (somme versée à la signature) **+ rente** viagère, après **décote d'occupation** (le vendeur, le crédirentier, conserve l'usage du bien).",
          "- La décote d'occupation reflète la **valeur du droit d'usage et d'habitation** (DUH) ou de l'usufruit conservé.",
          "- Sur le plan **fiscal**, l'usufruit se valorise selon le **barème de l'article 669 du CGI** (par tranche d'âge) ; pour la valeur **vénale**, les professionnels utilisent un **barème économique** (espérance de vie, taux de rendement).",
          "- La **rente viagère** est partiellement imposable pour le crédirentier selon un **abattement lié à son âge** à l'entrée en jouissance (par exemple, seulement 30 % de la rente imposable à partir de 70 ans) : à signaler, mais à chiffrer avec le notaire.",
          "Le viager est un domaine **spécialisé** : établissez l'avis de valeur du bien libre, puis faites valider le montage par un spécialiste ou le notaire.",
          "## Indivision et succession : estimer pour partager",
          "En **indivision** ou en **succession**, l'estimation sert à **partager équitablement** et à déclarer la **valeur vénale** à l'administration.",
          "- Une **sous-évaluation** pour « payer moins de droits » expose à un **redressement fiscal** (intérêts de retard et pénalités).",
          "- Soyez **neutre et documenté** : chaque indivisaire doit pouvoir s'appuyer sur vos comparables. Un avis flou nourrit les conflits de famille.",
          "## Le bien atypique : quand il n'y a pas de comparable",
          "Loft, bien d'exception, mas provençal, bien avec vue mer rare… la comparaison atteint ses limites.",
          "- Croisez **coût de remplacement** et **capitalisation** si le bien peut être loué.",
          "- Élargissez la zone de comparaison et raisonnez en **segments** (le haut de gamme a sa propre logique, plus émotionnelle et moins liée au prix/m²).",
          "- Assumez une **fourchette plus large** et expliquez-la au vendeur.",
          "## Le local commercial ou mixte",
          "Les **murs commerciaux** s'estiment surtout par **capitalisation du loyer** (rendement attendu plus élevé qu'en habitation). L'emplacement (numéro 1, rue passante) et l'état du bail (loyer, échéance, locataire) sont déterminants.",
          "## Erreurs fréquentes",
          "- Estimer un bien loué comme s'il était libre.",
          "- Se lancer seul sur un montage viager sans spécialiste.",
          "- Sous-évaluer une succession « pour arranger » la famille (risque fiscal réel).",
          "- Forcer une comparaison inadaptée sur un bien atypique.",
          "## Mini cas pratique",
          "Un T3 à Martigues vaut **220 000 €** libre. Il est loué 700 €/mois avec un bail récent. Vendu occupé, on applique une décote d'occupation d'environ 15 %, soit une valeur de l'ordre de **185 000 à 190 000 €** : cible privilégiée d'un investisseur cherchant du rendement immédiat."
        ]
      },
      {
        "titre": "Le piège mortel : la surévaluation (et la sous-évaluation)",
        "contenu": [
          "Accepter un mandat à un prix trop élevé pour « faire plaisir » ou « prendre le mandat » est l'erreur la plus coûteuse du métier — pour le vendeur comme pour vous.",
          "## Le cercle vicieux du bien surévalué",
          "- Peu ou pas de visites les premières semaines, là où l'intérêt est pourtant maximal.",
          "- Le bien **« se grille »** : les acquéreurs du secteur l'ont vu, l'écartent, et pensent « il ne se vend pas, il doit y avoir un problème ».",
          "- **Baisses de prix successives** qui installent le doute et donnent le sentiment d'une affaire « à problème ».",
          "- Résultat : une vente finale **plus longue ET moins chère** qu'au juste prix d'entrée.",
          "## La courbe d'intérêt : la fenêtre des 3-4 semaines",
          "L'intérêt pour un bien neuf sur le marché est **maximal dans les 3 à 4 premières semaines** : les acquéreurs en veille reçoivent l'alerte et se positionnent vite.",
          "Un prix juste dès le départ **capte cette fenêtre** et crée une **concurrence** entre acquéreurs (parfois une surenchère). Un prix trop haut la **gâche définitivement** : passé ce pic, le bien devient un « vieux stock ».",
          "## Pourquoi on surévalue (les vraies causes)",
          "- **Prendre le mandat à tout prix** : on cède au prix du vendeur pour ne pas rentrer bredouille.",
          "- La **surenchère concurrentielle** : une autre agence a « promis » plus cher pour rentrer le mandat.",
          "- L'**affect du vendeur** : souvenirs, travaux payés cher, prix d'achat au plus haut.",
          "- La **méconnaissance du marché** : estimation « au feeling », sans comparables.",
          "## La sous-évaluation, l'autre piège",
          "Surévaluer n'est pas la seule erreur. **Sous-évaluer**, c'est :",
          "- Faire **perdre de l'argent** au vendeur (parfois des dizaines de milliers d'euros).",
          "- Risquer un **recours** du vendeur qui s'estime lésé.",
          "- Se **décrédibiliser** quand le bien part en 48 h bien au-dessus du prix affiché (preuve qu'il était bradé).",
          "Le bon prix n'est ni le plus haut ni le plus bas : c'est le **juste**, démontré par les comparables.",
          "## Le coût chiffré de la surévaluation",
          "Comparez deux scénarios pour un bien dont la valeur de marché est **250 000 €** :",
          "- **Juste prix** : affiché 259 000 € FAI, vendu en six semaines à ≈ 250 000 €.",
          "- **Surévalué** : affiché 290 000 € FAI, trois baisses sur neuf mois, vendu à ≈ 238 000 € — soit **12 000 € de moins** et **sept mois de plus**.",
          "Le vendeur pressé de « ne rien lâcher » perd sur les deux tableaux.",
          "## Oser le juste prix",
          "Un professionnel **ose dire le juste prix**, preuves à l'appui. C'est un **service rendu** au vendeur, pas un manque d'ambition.",
          "Script : « Je peux afficher votre bien à 290 000 €, mais voici concrètement ce qui va se passer. Ou je l'affiche au bon prix, et voici mon plan pour le vendre vite et au mieux. Lequel sert vraiment votre projet ? »",
          "## Erreurs fréquentes",
          "- Accepter le prix du vendeur sans comparables, juste pour signer.",
          "- S'aligner sur l'estimation flatteuse d'un concurrent.",
          "- Ne prévoir aucune stratégie de **baisse datée** si le prix est tenu « pour essayer ».",
          "- Oublier que sous-évaluer est aussi une faute professionnelle.",
          "## Mini cas pratique",
          "Un vendeur à Martigues veut 290 000 € ; vos comparables donnent 250 000 €. Plutôt que de refuser ou de céder, proposez un **prix de départ encadré avec un point d'étape à quatre semaines** : « Si en un mois nous n'avons pas de visite sérieuse, nous ajustons à ce que le marché dit. » Vous rentrez le mandat **sans** vous griller sur un prix intenable."
        ]
      },
      {
        "titre": "Conduire le RDV d'estimation et présenter l'avis de valeur (R1 / R2)",
        "contenu": [
          "On estime rarement bien en un seul passage. La méthode la plus efficace enchaîne **deux rendez-vous** : R1 (découverte + visite), R2 (présentation de l'avis de valeur). La prise de mandat elle-même est détaillée dans le module La prise de mandat ; ici, on prépare et on **présente la valeur**.",
          "## Préparer le rendez-vous",
          "- Sortez vos **comparables DVF** et les annonces du secteur **avant** d'y aller.",
          "- Préparez un **dossier** : références, courbe d'intérêt, votre plan d'action.",
          "- Renseignez-vous sur le **vendeur** et sa **motivation** (voir module Découverte & qualification).",
          "## R1 : découverte, visite et relevé",
          "- **Découverte** : projet, motivation, délai, prix en tête du vendeur.",
          "- **Visite détaillée** : état, exposition, nuisances, vis-à-vis, prestations.",
          "- **Relevé** : mesures (pour la surface pondérée), photos, DPE, charges de copropriété, travaux votés.",
          "- Ne **donnez pas** le prix à chaud : « Je vais analyser tout cela sérieusement et je reviens vers vous avec un avis documenté. »",
          "## Entre R1 et R2 : construire l'avis",
          "- Sélectionnez 3 à 6 **comparables** solides.",
          "- Calculez la **surface pondérée** et appliquez le prix/m² de référence.",
          "- Posez votre **grille d'ajustement** (plus-values et moins-values chiffrées).",
          "- Déduisez une **fourchette**, un **prix de présentation FAI** et le **net vendeur**.",
          "## R2 : présenter l'avis de valeur",
          "- Présentez d'abord la **méthode** et les **preuves** (comparables), puis **seulement ensuite** le prix : la valeur se démontre avant de s'annoncer.",
          "- Donnez une **fourchette** réaliste + un **prix de mise en vente** cohérent avec le délai souhaité.",
          "- Expliquez les **ajustements** de façon factuelle (plus-values et moins-values).",
          "## La structure de l'avis de valeur (document)",
          "- Identité du bien et du vendeur, date.",
          "- Rappel : il s'agit d'un **avis de valeur**, pas d'une expertise.",
          "- Description et caractéristiques (surfaces, DPE, atouts et faiblesses).",
          "- **Comparables** utilisés et prix/m² de référence.",
          "- **Ajustements** (plus-values et moins-values).",
          "- **Fourchette de valeur**, prix de présentation **FAI** et **net vendeur**.",
          "- **Stratégie** de commercialisation et délai estimé.",
          "## Gérer l'écart avec le prix rêvé du vendeur",
          "Ne dites **jamais** « votre prix est trop élevé ». Dites : « Voici ce que le marché a réellement payé pour des biens comparables. »",
          "Script : « À 250 000 €, voici mon plan pour vous vendre vite et au mieux. À 290 000 €, voici ce qui risque de se passer. » Laissez les **faits** parler, pas votre opinion.",
          "Technique de la **double option** : laissez le vendeur **choisir** entre deux scénarios documentés plutôt que de lui imposer un chiffre.",
          "## Finir par la stratégie, pas par le prix",
          "Le vendeur n'achète pas un prix, il achète un **résultat**. Terminez toujours par le **plan** : diffusion, photos, home-staging (module Marketing du bien), reporting, délai estimé.",
          "« Mon rôle n'est pas de vous donner le prix que vous voulez entendre, mais de vous faire **toucher le maximum que le marché accepte**, dans le délai qui vous arrange. »",
          "## Erreurs fréquentes",
          "- Donner le prix « à chaud » en fin de visite, sans preuve.",
          "- Annoncer le prix **avant** d'avoir présenté les comparables.",
          "- Oublier de distinguer FAI et net vendeur.",
          "- Conclure sur un chiffre sans dérouler la **stratégie**.",
          "## Mini cas pratique",
          "À Martigues, R1 le mardi (visite + relevé), R2 le samedi avec un avis documenté. Vous présentez quatre ventes comparables, votre grille d'ajustement, une fourchette 245 000–255 000 €, un prix FAI de 259 000 € et le net vendeur correspondant, puis votre plan de commercialisation sur huit semaines. Le vendeur ne discute plus un chiffre : il adhère à une **démonstration** et à un **plan**."
        ]
      }
    ],
    "quiz": [
      {
        "question": "L'avis de valeur réalisé par un agent immobilier…",
        "options": [
          "a la même valeur juridique qu'une expertise",
          "est une opinion motivée, sans valeur juridique probante",
          "est obligatoire pour toute vente",
          "remplace le DPE"
        ],
        "correct": 1,
        "explication": "L'avis de valeur est l'opinion motivée d'un professionnel ; l'expertise, elle, suit une charte et engage la responsabilité de l'expert devant un tribunal."
      },
      {
        "question": "La base DVF (Demandes de Valeurs Foncières)…",
        "options": [
          "recense les prix affichés des annonces en cours",
          "recense les ventes réellement enregistrées et couvre cinq ans",
          "est réservée aux notaires",
          "couvre toute la France, y compris l'Alsace-Moselle"
        ],
        "correct": 1,
        "explication": "DVF (open data DGFiP) recense les mutations réelles des cinq dernières années, mise à jour deux fois par an (avril et octobre), mais ne couvre pas l'Alsace-Moselle ni Mayotte."
      },
      {
        "question": "En loi Carrez, si la surface réelle est inférieure de plus de 5 % à celle annoncée, l'acquéreur peut…",
        "options": [
          "annuler la vente immédiatement",
          "demander une diminution du prix proportionnelle, dans l'année de l'acte",
          "exiger des dommages et intérêts triplés",
          "ne rien faire, la mention est purement informative"
        ],
        "correct": 1,
        "explication": "Au-delà de 5 % d'erreur en moins, l'acquéreur peut demander une réduction de prix proportionnelle, par action dans l'année suivant l'acte authentique."
      },
      {
        "question": "Quand l'intérêt pour un bien mis en vente est-il maximal ?",
        "options": [
          "après la première baisse de prix",
          "dans les 3 à 4 premières semaines",
          "après six mois de diffusion",
          "à la publication de nouvelles photos"
        ],
        "correct": 1,
        "explication": "La fenêtre d'intérêt est au lancement : un prix juste dès le départ la capte et crée la concurrence entre acquéreurs ; un prix trop haut la gâche définitivement."
      },
      {
        "question": "Depuis quelle date un audit énergétique est-il obligatoire pour vendre une maison individuelle classée F ou G ?",
        "options": [
          "1er juillet 2021",
          "1er avril 2023",
          "1er janvier 2025",
          "1er janvier 2034"
        ],
        "correct": 1,
        "explication": "L'audit énergétique est obligatoire pour les classes F et G depuis le 1er avril 2023, pour les E depuis le 1er janvier 2025, et pour les D à partir du 1er janvier 2034."
      },
      {
        "question": "Un studio loué 600 €/mois, avec un rendement brut attendu de 6 %, se valorise par capitalisation à environ…",
        "options": [
          "72 000 €",
          "120 000 €",
          "144 000 €",
          "216 000 €"
        ],
        "correct": 1,
        "explication": "Loyer annuel 7 200 € divisé par 0,06 = 120 000 €. La valeur par le revenu se déduit du loyer et du rendement attendu sur le secteur."
      },
      {
        "question": "Quel type d'évaluation est requis en cas de contentieux, de partage judiciaire ou de garantie bancaire importante ?",
        "options": [
          "L'avis de valeur de l'agent",
          "L'expertise immobilière réalisée par un expert",
          "L'estimation automatique en ligne",
          "Le prix affiché par le voisin"
        ],
        "correct": 1,
        "explication": "Seule l'expertise immobilière, rapport normé engageant la responsabilité de l'expert, a la valeur probante requise devant un tribunal."
      },
      {
        "question": "À quoi correspond le prix net vendeur ?",
        "options": [
          "Au prix affiché frais d'agence inclus",
          "Au prix FAI moins les honoraires d'agence",
          "Au prix payé par le voisin en 2021",
          "Au prix augmenté des frais de notaire"
        ],
        "correct": 1,
        "explication": "Le net vendeur est ce que touche réellement le vendeur, soit le prix FAI diminué des honoraires d'agence."
      },
      {
        "question": "Comment sont fixés les honoraires d'une agence immobilière en France ?",
        "options": [
          "Selon un barème légal imposé par l'État",
          "Librement, mais ils doivent être affichés TTC et de façon lisible",
          "Par le notaire lors du compromis",
          "Au maximum à 3 % par la loi Hoguet"
        ],
        "correct": 1,
        "explication": "Aucun barème légal ne s'impose : les honoraires sont librement fixés mais doivent être affichés TTC, selon l'arrêté du 10 janvier 2017."
      },
      {
        "question": "Quelle méthode d'évaluation est la référence pour un appartement ou une maison d'habitation ?",
        "options": [
          "Le bilan promoteur",
          "La méthode par comparaison",
          "Le coût de remplacement",
          "La capitalisation du revenu"
        ],
        "correct": 1,
        "explication": "La méthode par comparaison, fondée sur des biens similaires réellement vendus, est la reine en résidentiel."
      },
      {
        "question": "Dans la méthode par capitalisation, que devient la valeur d'un bien si le rendement exigé par le marché augmente, à loyer constant ?",
        "options": [
          "Elle augmente",
          "Elle baisse",
          "Elle reste identique",
          "Elle double"
        ],
        "correct": 1,
        "explication": "Valeur égale loyer annuel divisé par le taux de rendement : rendement et prix évoluent en sens inverse, donc un rendement plus élevé fait baisser la valeur."
      },
      {
        "question": "Quelle méthode est la mieux adaptée à un bien atypique, neuf ou sans comparable ?",
        "options": [
          "La méthode par comparaison",
          "Le coût de remplacement ou de reconstruction",
          "La surface pondérée seule",
          "Les prix affichés des concurrents"
        ],
        "correct": 1,
        "explication": "Faute de comparables, le coût de remplacement (terrain plus reconstruction à neuf moins vétusté) permet d'objectiver la valeur d'un bien atypique."
      },
      {
        "question": "Dans le calcul d'une surface pondérée, quel coefficient applique-t-on généralement à une terrasse ou un balcon ?",
        "options": [
          "1",
          "De l'ordre de 0,3 à 0,5",
          "2",
          "0, car on ne compte jamais l'extérieur"
        ],
        "correct": 1,
        "explication": "Un extérieur se pondère de l'ordre de 0,3 à 0,5, davantage en PACA où la terrasse est très prisée."
      },
      {
        "question": "À quelle fréquence la base DVF des valeurs foncières est-elle mise à jour ?",
        "options": [
          "Tous les jours",
          "Deux fois par an, en avril et en octobre",
          "Une fois tous les cinq ans",
          "Jamais, elle est figée"
        ],
        "correct": 1,
        "explication": "DVF, publiée en open data par la DGFiP, couvre les cinq dernières années et est mise à jour deux fois par an, en avril et en octobre."
      },
      {
        "question": "Quels territoires la base DVF ne couvre-t-elle pas ?",
        "options": [
          "La région PACA",
          "L'Alsace-Moselle (Bas-Rhin, Haut-Rhin, Moselle) et Mayotte",
          "Toute l'Île-de-France",
          "Les communes de moins de 2 000 habitants"
        ],
        "correct": 1,
        "explication": "DVF ne couvre pas l'Alsace-Moselle ni Mayotte, qui relèvent du livre foncier."
      },
      {
        "question": "Quel est l'ordre de grandeur de la marge de négociation moyenne entre prix affiché et prix vendu ?",
        "options": [
          "De l'ordre de 4 à 7 %",
          "Environ 25 %",
          "0 %, le prix affiché est toujours le prix vendu",
          "Environ 50 %"
        ],
        "correct": 0,
        "explication": "Un bien se vend presque toujours sous son prix d'affichage, avec une marge de négociation moyenne de l'ordre de 4 à 7 %, plus forte pour les biens surévalués ou énergivores."
      },
      {
        "question": "À quoi sert la surface « loi Boutin » ?",
        "options": [
          "À la vente d'un lot en copropriété",
          "Aux baux d'habitation, en location vide",
          "Au calcul des frais de notaire",
          "À l'estimation d'un terrain à bâtir"
        ],
        "correct": 1,
        "explication": "La surface habitable loi Boutin figure dans les baux d'habitation, alors que la loi Carrez concerne la vente d'un lot en copropriété."
      },
      {
        "question": "Pourquoi afficher un bien à 199 000 € plutôt qu'à 205 000 € peut-il être judicieux ?",
        "options": [
          "Pour payer moins de frais de notaire",
          "Pour apparaître dans les recherches « jusqu'à 200 000 € » et toucher plus d'acquéreurs",
          "Parce que la loi l'impose",
          "Pour réduire la commission de l'agence"
        ],
        "correct": 1,
        "explication": "Les acquéreurs cherchent par tranches de budget : un bien à 205 000 € est exclu de la recherche « jusqu'à 200 000 € », ce qui le prive d'une partie de son audience."
      },
      {
        "question": "À quelle décote, dans la tête de l'acheteur, correspondent souvent 20 000 € de travaux réels ?",
        "options": [
          "À 5 000 € seulement",
          "À exactement 20 000 €",
          "À 30 000 à 40 000 €, à cause du coût psychologique (temps, risque, effort)",
          "À aucune décote"
        ],
        "correct": 2,
        "explication": "L'acquéreur déduit le coût des travaux mais aussi le temps, le risque et l'effort : 20 000 € réels pèsent souvent 30 000 à 40 000 € dans sa tête."
      },
      {
        "question": "Qu'a changé la réforme du DPE entrée en vigueur le 1er juillet 2024 ?",
        "options": [
          "Elle a supprimé le DPE",
          "Elle a corrigé le calcul pour les logements de 40 m² ou moins, sortant environ 140 000 logements du statut de passoire",
          "Elle a rendu le DPE valable 20 ans",
          "Elle a interdit la vente des biens classés A"
        ],
        "correct": 1,
        "explication": "Depuis le 1er juillet 2024, le calcul du DPE a été corrigé pour les petits logements de 40 m² ou moins, jusque-là pénalisés, faisant sortir environ 140 000 logements du statut de passoire."
      },
      {
        "question": "De quel ordre est la décote d'un logement vendu occupé (loué) par rapport au même bien vendu libre ?",
        "options": [
          "Il n'y a aucune décote",
          "De l'ordre de 10 à 20 %",
          "Environ 50 %",
          "Une plus-value de 20 %"
        ],
        "correct": 1,
        "explication": "L'acquéreur hérite du locataire et ne peut occuper le bien : la décote d'occupation est couramment de l'ordre de 10 à 20 % selon le bail et le loyer."
      },
      {
        "question": "En viager occupé, en quoi se transforme la valeur vénale du bien ?",
        "options": [
          "En un loyer mensuel unique",
          "En un bouquet versé à la signature plus une rente viagère, après décote d'occupation",
          "En frais de notaire majorés",
          "En une simple donation"
        ],
        "correct": 1,
        "explication": "La valeur vénale se transforme en bouquet versé à la signature et en rente viagère, après une décote reflétant le droit d'usage conservé par le crédirentier."
      },
      {
        "question": "Que se passe-t-il quand un bien reste trop longtemps surévalué sur le marché ?",
        "options": [
          "Il prend de la valeur avec le temps",
          "Il « se grille » : les acquéreurs l'écartent et le soupçonnent d'avoir un problème",
          "Il se vend plus vite et plus cher",
          "Il devient exonéré de plus-value"
        ],
        "correct": 1,
        "explication": "Passé le pic d'intérêt, un bien surévalué devient du « vieux stock » que les acquéreurs écartent, aboutissant à une vente plus longue et moins chère."
      },
      {
        "question": "Lors de la présentation de l'avis de valeur en R2, dans quel ordre faut-il procéder ?",
        "options": [
          "Annoncer le prix d'abord, puis éventuellement les preuves",
          "Présenter la méthode et les comparables, puis seulement ensuite le prix",
          "Ne jamais montrer les comparables au vendeur",
          "Laisser le vendeur fixer seul le prix"
        ],
        "correct": 1,
        "explication": "La valeur se démontre avant de s'annoncer : on présente d'abord la méthode et les preuves (comparables), puis le prix qui en découle."
      }
    ]
  },
  {
    "id": "mandat",
    "titre": "La prise de mandat",
    "icone": "📝",
    "categorie": "Commercial",
    "resume": "Décrocher l'exclusivité, rédiger un mandat sans faille (Hoguet, ALUR), vérifier qui peut signer et sécuriser le dossier jusqu'à la commercialisation.",
    "duree": "51 min",
    "lecons": [
      {
        "titre": "Panorama des mandats : simple, exclusif, semi-exclusif (et les autres)",
        "contenu": [
          "Le **mandat** est le contrat écrit par lequel le vendeur (le **mandant**) vous donne pouvoir de commercialiser son bien. C'est l'acte fondateur de toute la mission : pas de mandat, pas de mission, pas d'honoraires. Un négociateur confirmé sait distinguer chaque type de mandat et **orienter le vendeur vers celui qui sert le mieux la vente** : l'exclusivité.",
          "Un principe à graver : le mandat **n'est pas une formalité administrative**, c'est l'outil qui organise votre travail, fixe votre rémunération et protège le vendeur. Sa nature (simple ou exclusif) détermine à elle seule la vitesse et le prix de vente.",
          "## Le mandat simple",
          "Le vendeur confie son bien à **plusieurs agences en même temps** et conserve le droit de **vendre lui-même** (de particulier à particulier).",
          "- **Avantage apparent pour le vendeur** : multiplier les agences, « ratisser large ».",
          "- **Réalité** : diffusion dispersée, prix et photos différents selon les vitrines, guerre des agences, et un agent qui **n'investit pas** (pourquoi payer home-staging et photos pro si un confrère ou le vendeur peut encaisser à sa place ?).",
          "- **Engagement de l'agence** : faible. Le bien devient un numéro parmi d'autres.",
          "- **Risque de double commission** : si deux agences revendiquent le même acquéreur, le litige est fréquent et c'est souvent l'agent qui perd.",
          "## Le mandat exclusif",
          "Une **seule agence** est mandatée pour une **durée déterminée** ; pendant cette période, le vendeur ne peut vendre ni par une autre agence, ni (selon la clause) par lui-même.",
          "- **Contrepartie** : l'agent engage tous ses moyens (reportage photo, home-staging, visite virtuelle, diffusion premium) car il est **certain d'être rémunéré de son travail**.",
          "- **Maîtrise du prix** : un seul prix, un seul discours, une seule stratégie.",
          "- **Reporting** : compte rendu régulier au vendeur, obligation légale renforcée par la loi ALUR (voir la leçon sur la rédaction).",
          "- **Un seul interlocuteur** : le vendeur n'est pas harcelé par cinq agences, il a un référent unique et responsable.",
          "- **Posture** : l'exclusivité n'est pas une faveur que l'on demande au vendeur, c'est un **engagement de résultat** que vous lui offrez.",
          "## Le semi-exclusif (exclusif aménagé)",
          "Variante intermédiaire : **exclusivité vis-à-vis des autres agences**, mais le vendeur **garde le droit de vendre lui-même**. S'il trouve son acquéreur seul, il ne doit pas (ou réduit) les honoraires.",
          "- Utile pour **rassurer un vendeur hésitant** qui n'ose pas « tout confier ».",
          "- Vous gardez l'essentiel des bénéfices de l'exclusivité (un seul interlocuteur agence, pas de guerre des prix) tout en levant la peur de l'engagement.",
          "- Point de vigilance : la clause doit préciser **très clairement** ce qui se passe si le vendeur trouve seul, pour éviter tout litige sur les honoraires.",
          "## Les autres mandats que vous croiserez",
          "- **Mandat de recherche** : signé côté **acquéreur**, il vous missionne pour trouver un bien correspondant à ses critères (approfondi dans le module Découverte & qualification).",
          "- **Co-mandat / délégation de mandat** : deux agences collaborent sur un même bien et **partagent les honoraires** ; utile pour élargir le vivier d'acquéreurs sans multiplier les mandats simples.",
          "- **Fichier commun AMEPI** : réseau de mandats **exclusifs partagés** entre agences adhérentes. Argument massue : le vendeur a l'exclusivité **et** la force de frappe de plusieurs agences.",
          "- **Mandat de location / de gestion** : hors sujet ici (voir le module Location & baux d'habitation).",
          "## Attention : le mandat n'est pas le bon de visite",
          "Ne confondez jamais les deux. Le **bon de visite** prouve seulement que vous avez fait visiter le bien à un acquéreur donné ; il **ne vous donne aucun droit à commission** et ne remplace pas le mandat. Seul le **mandat écrit** signé par le vendeur fonde votre rémunération.",
          "## Ce que disent les chiffres",
          "Les biens en **exclusivité se vendent statistiquement plus vite et plus près du prix** affiché que les mandats simples. La raison est mécanique : moyens engagés, prix unique, acquéreurs non « brûlés » par la multidiffusion.",
          "- Ordre de grandeur souvent cité dans la profession : une vente en exclusivité se conclut en **deux fois moins de temps** qu'en mandat simple, avec une **décote finale plus faible**.",
          "- À Martigues et sur le pourtour de l'étang de Berre, un **T3 autour de 220 000 €** mal diffusé en 3 mandats simples finit souvent bradé après plusieurs baisses ; le même bien en exclusivité, lancé au juste prix avec un vrai plan, capte la demande des premières semaines.",
          "## Cas pratique",
          "Un vendeur de Martigues vous dit : « Je vais le mettre dans trois agences, comme ça j'ai trois fois plus de chances. » Vous répondez : « Trois agences, ce sont les **mêmes acquéreurs** du secteur qui verront votre bien trois fois, à trois prix parfois différents. Résultat : il paraît partout, donc **suspect**. En exclusivité, je concentre tous mes moyens dessus et je vous rends des comptes chaque semaine. »",
          "## Mémo express",
          "- **Mandat simple** = plusieurs agences, faible engagement, risque de banalisation.",
          "- **Mandat exclusif** = une agence, engagement de moyens maximal, vente plus rapide et plus chère.",
          "- **Semi-exclusif** = exclusivité agences, vendeur libre de vendre seul.",
          "- **Bon de visite** = preuve de visite, jamais un droit à commission.",
          "## Les pièges à éviter",
          "- **Prendre un mandat simple par facilité** « pour ne pas perdre le vendeur » : vous rentrez un bien que vous ne défendrez pas.",
          "- **Confondre exclusif et semi-exclusif** dans le discours : soyez limpide sur ce que le vendeur signe.",
          "- **Promettre l'exclusivité sans contrepartie** : l'exclusivité se mérite par un plan d'action écrit.",
          "- **Croire qu'un bon de visite sécurise votre commission** : seul le mandat écrit le fait."
        ]
      },
      {
        "titre": "L'entretien de prise de mandat : réussir le R2",
        "contenu": [
          "On rentre rarement un mandat par hasard. La prise de mandat se joue lors d'un **rendez-vous dédié**, le **R2**, qui suit le R1 (découverte + visite du bien). Sa réussite tient à **90 % à la préparation** et à l'ordre dans lequel vous déroulez l'entretien.",
          "Le principe mental à adopter : vous ne venez pas **quémander** un mandat, vous venez **proposer une solution** à un problème (vendre vite, au bon prix, sans stress). Ce renversement de posture change tout votre langage.",
          "## Préparer son book de mandat",
          "Ne venez jamais « les mains vides ». Préparez une **pochette de prise de mandat** complète :",
          "- L'**avis de valeur documenté** : 3 à 5 **ventes comparables DVF** récentes (la méthode d'estimation est détaillée dans le module Estimation & avis de valeur).",
          "- Le **plan marketing écrit** : reportage photo, home-staging, visite virtuelle, diffusion portails, dates de lancement.",
          "- L'**engagement de reporting** : compte rendu après chaque visite, point hebdomadaire.",
          "- Le **mandat pré-rempli** (identité, bien, prix, honoraires) et la liste des **pièces à récupérer**.",
          "- Vos **preuves** : panneaux « Vendu » du secteur, avis clients Google, biens vendus récemment à Martigues.",
          "- Deux **stylos** et deux exemplaires papier du mandat (un par partie) : un détail, mais repartir chercher une imprimante tue l'élan de la signature.",
          "## L'ordre qui convertit",
          "Un R2 se déroule dans un ordre précis : on **crée la valeur avant de parler engagement et honoraires**.",
          "- **Étape 1, reconnecter** : rappeler le projet et la motivation du vendeur (« vous vendez pour vous rapprocher de vos petits-enfants, c'est bien ça ? »).",
          "- **Étape 2, présenter l'avis de valeur** : les faits, les comparables, la fourchette, le prix de mise en vente. On laisse parler la preuve.",
          "- **Étape 3, dérouler la stratégie** : le plan d'action concret qui va vendre le bien. Le vendeur n'achète pas un prix, il achète un **résultat**.",
          "- **Étape 4, annoncer les honoraires** avec naturel, sans s'excuser, comme la contrepartie logique de ce plan.",
          "- **Étape 5, proposer l'exclusivité** comme l'accélérateur du résultat.",
          "- **Étape 6, faire signer** : présumer la décision, sortir le mandat, remplir ensemble.",
          "## Scripts d'enchaînement",
          "- Transition vers le prix : « Voici ce que des biens comparables se sont réellement vendus ces douze derniers mois dans votre secteur. »",
          "- Transition vers la stratégie : « Maintenant que nous sommes d'accord sur le prix, voici exactement comment je vais le vendre. »",
          "- Transition vers la signature : « On est alignés sur le prix et le plan, je remplis le mandat, on part sur une exclusivité de 3 mois, d'accord ? »",
          "## Qui doit être présent",
          "Ne faites **jamais un R2 décisif s'il manque un décideur**. Pour un couple, les **deux conjoints** ; pour une indivision ou une succession, **tous les indivisaires** (voir la leçon sur la qualité du mandant).",
          "- Un « je dois en parler à mon épouse » en fin de R2 = un R2 raté : vous devrez tout recommencer, et l'absent n'entendra que la version déformée du présent.",
          "- Vérifiez ce point **au téléphone avant** de fixer le R2 : « Pour qu'on puisse décider ensemble, c'est important que vous soyez tous les deux là. »",
          "## Gérer le vendeur qui veut « réfléchir »",
          "- Un vendeur qui veut réfléchir n'a pas eu assez de **valeur** ou pas assez de **preuve** : c'est un signal, pas un refus.",
          "- Faites ressortir le coût de l'attente : « Chaque semaine sans diffusion, ce sont des acquéreurs actifs qui achètent ailleurs. »",
          "- Verrouillez toujours un **prochain rendez-vous daté**, jamais un vague « je vous rappelle ».",
          "## Cas pratique",
          "À Martigues, R2 pour une maison de ville estimée 345 000 €. Le vendeur espérait 380 000 €. Vous ne dites pas « c'est trop cher » : vous posez les 4 ventes comparables de la rue et des rues voisines, toutes entre 330 000 € et 350 000 €. Puis : « À 345 000 €, voici mon plan pour vous vendre en 8 semaines. À 380 000 €, voici ce qui se passe : pas de visite, puis des baisses, et une vente finale plus basse et plus tardive. Vous préférez quelle histoire ? »",
          "## Les pièges à éviter",
          "- **Parler honoraires trop tôt**, avant d'avoir créé la valeur.",
          "- **Négocier le prix du vendeur sans preuve** : on oppose des faits, jamais une opinion.",
          "- **Repartir sans mandat signé ni rendez-vous daté** : « je vous rappelle » tue le dossier.",
          "- **Oublier de faire signer tous les décideurs** présents.",
          "- **Improviser sans book** : sans preuves ni plan écrit, vous n'avez que votre parole face à celle du confrère."
        ]
      },
      {
        "titre": "Argumenter et closer l'exclusivité",
        "contenu": [
          "L'exclusivité ne s'arrache pas, elle se **démontre**. Votre rôle : prouver au vendeur que **concentrer ses moyens sur une seule agence engagée** lui rapporte plus que de se disperser.",
          "La règle d'or : on ne défend jamais l'exclusivité « pour vous », mais « pour lui ». Tant que le vendeur croit que l'exclusivité sert l'agent, il résiste ; dès qu'il comprend qu'elle sert **sa** vente, il signe.",
          "## Objection « je préfère mettre plusieurs agences »",
          "- **Démonter le réflexe « plus d'agences = plus d'acheteurs »** : ce sont les **mêmes acquéreurs** du secteur qui cherchent un bien comme le vôtre. Les mettre dans 3 agences, c'est leur montrer le bien **3 fois**, pas en trouver 3 fois plus.",
          "- **La banalisation** : panneaux multiples, photos différentes, prix qui varient d'une vitrine à l'autre, le bien paraît **partout**, donc « il ne se vend pas, il y a un problème ».",
          "- **Le grillage** : une fois que les acquéreurs actifs du secteur ont écarté le bien (vu partout, jugé trop cher), il est **brûlé**, même après une baisse de prix.",
          "## « Plus d'agences » dilue aussi l'effort",
          "En mandat simple, aucune agence n'investit vraiment : pourquoi payer un reportage photo pro et du home-staging si le vendeur ou un confrère peut encaisser à votre place ? **L'exclusivité est ce qui déclenche l'investissement.**",
          "## La contrepartie qui rassure",
          "N'exigez jamais l'exclusivité sans **donner une garantie en échange**. Proposez un **engagement écrit** :",
          "- Un **plan d'action daté** (photos, home-staging, diffusion, portes ouvertes).",
          "- Un **compte rendu après chaque visite** et un **point hebdomadaire**.",
          "- Un **bilan de commercialisation** à échéance (par exemple à 4 semaines). Dans l'application, le **bilan de commercialisation** sert exactement à formaliser cet engagement.",
          "- Rappelez le filet de sécurité légal : passé **3 mois**, le vendeur peut de toute façon **dénoncer** l'exclusivité (LRAR, préavis de 15 jours). Il ne se « marie » pas à vie avec vous.",
          "## L'argument AMEPI",
          "Si votre agence adhère à un **fichier commun de mandats exclusifs partagés (AMEPI)**, vous offrez le meilleur des deux mondes : « Vous avez **l'exclusivité** (un seul interlocuteur, un seul prix) **et** la force de frappe de toutes les agences du réseau qui pourront présenter leurs acquéreurs. »",
          "## Techniques de closing de l'exclusivité",
          "- **L'alternative** : « On part sur 3 ou 4 mois d'exclusivité ? » (jamais une question oui/non).",
          "- **La projection** : « Imaginez : dans 8 semaines, c'est vendu au bon prix, et vous enchaînez votre achat sereinement. »",
          "- **L'engagement réciproque** : « Je m'engage par écrit sur le reporting et le plan ; vous me donnez la visibilité pour performer. »",
          "- **La dernière objection** : « Si je lève ce dernier point, on signe l'exclusivité aujourd'hui ? »",
          "## Scripts mot pour mot",
          "- « Vous ne me confiez pas votre bien, vous me confiez un **objectif** : le vendre vite et au meilleur prix. L'exclusivité, c'est l'outil qui me permet de tenir cet objectif. »",
          "- « En exclusivité, je mets le paquet dès le premier jour, parce que je sais que mon travail sera récompensé. En simple, honnêtement, je ne peux pas investir autant, et vous le perdriez. »",
          "- « L'exclusivité vous engage trois mois ; passé ce délai, si je n'ai pas tenu mes promesses, vous êtes libre. Le risque est pour moi, pas pour vous. »",
          "## Cas pratique",
          "Vendeur d'un T4 à Martigues, tenté par 2 agences. Vous : « Confiez-le moi 12 semaines en exclusivité. Je m'engage par écrit : reportage photo pro et home-staging cette semaine, diffusion premium, et un **compte rendu après chaque visite**. Si à 4 semaines le plan n'a rien donné, on fait le point ensemble, en toute transparence. Vous risquez quoi ? »",
          "## Les pièges à éviter",
          "- **Dénigrer les confrères** : on vend sa valeur, on n'attaque pas les autres (c'est aussi contraire à la déontologie).",
          "- **Promettre sans écrire** : l'engagement non formalisé ne vaut rien et vous dessert au premier retard.",
          "- **Céder un mandat simple « en attendant »** : vous installez le vendeur dans le mauvais choix.",
          "- **Forcer l'exclusivité par la pression** : un vendeur contraint résilie à 3 mois et parle de vous en mal."
        ]
      },
      {
        "titre": "La rémunération dans le mandat : honoraires, barème et affichage",
        "contenu": [
          "Les honoraires sont au cœur du mandat : leur **expression correcte** conditionne votre droit à commission et la conformité de l'agence. À noter : **défendre le montant** face à une objection fait l'objet du module « Défendre ses honoraires » ; ici, on traite la dimension **contractuelle, légale et d'affichage**.",
          "## Des honoraires libres, mais affichés",
          "- Les honoraires d'agence sont **libres** (déréglementés par l'ordonnance du 1er décembre 1986) : chaque agence fixe son **barème**.",
          "- Mais l'affichage est **obligatoire** (arrêté du 10 janvier 2017, applicable depuis le 1er avril 2017) : barème **TTC** affiché en **vitrine**, sur le **site internet**, et rappelé dans les **annonces**.",
          "- Les barèmes sont souvent **dégressifs** : le pourcentage baisse quand le prix monte.",
          "## Exemple de barème (illustratif)",
          "Chaque agence fixe le sien ; à titre d'exemple de structure dégressive TTC :",
          "- **Jusqu'à 100 000 €** : taux élevé, souvent 6 à 8 %, ou un forfait.",
          "- **De 100 000 à 250 000 €** : de l'ordre de 5 %.",
          "- **Au-delà de 250 000 €** : de l'ordre de 4 % ou moins.",
          "- Souvent un **forfait minimum** (par exemple 5 000 à 9 000 € TTC) sur les petits prix.",
          "## Exprimer les honoraires dans le mandat",
          "Le mandat doit préciser **sans ambiguïté** :",
          "- Le **montant TTC** (TVA à 20 %).",
          "- **Qui les paie** : honoraires **à la charge du vendeur** ou **à la charge de l'acquéreur**.",
          "- Le cas échéant, le **pourcentage** et l'**assiette** (le prix auquel il s'applique).",
          "- Le **fait générateur** : la commission n'est due qu'une fois la vente **effectivement conclue** (acte authentique, ou selon la rédaction, compromis parfait), jamais à la simple signature du mandat.",
          "## Prix net vendeur, honoraires, prix FAI",
          "- **Prix net vendeur** : ce que le vendeur touche réellement.",
          "- **Honoraires** : votre rémunération TTC.",
          "- **Prix FAI (Frais d'Agence Inclus)** : prix net vendeur + honoraires = le prix affiché à l'acquéreur.",
          "- Exemple à Martigues : prix net vendeur **330 000 €**, honoraires **5 % = 16 500 € TTC**, donc **prix FAI = 346 500 €**.",
          "## À la charge de l'acquéreur : l'argument fiscal",
          "Quand les honoraires sont **à la charge de l'acquéreur** (et mentionnés comme tels), ils sont **exclus de l'assiette des droits de mutation** (les « frais de notaire ») : ceux-ci se calculent sur le **prix net vendeur**, pas sur le prix FAI.",
          "- Les droits de mutation dans l'ancien représentent de l'ordre de **5,8 % à 6,3 %** du prix selon le département (le taux départemental a pu être relevé jusqu'à 5 % pour les ventes conclues depuis le 1er avril 2025, loi de finances pour 2025).",
          "- Sur l'exemple : taxer 330 000 € au lieu de 346 500 € fait **économiser à l'acquéreur environ 1 000 à 1 250 €** de frais, un argument de vente concret.",
          "- Nuance à connaître : côté **plus-value du vendeur**, les honoraires d'agence réglés par le vendeur viennent au contraire **majorer le prix d'acquisition ou minorer le prix de cession** et réduisent donc sa plus-value imposable. Le choix « à charge vendeur / acquéreur » n'est jamais neutre fiscalement.",
          "## Afficher les honoraires dans l'annonce",
          "Règles issues de l'arrêté de 2017 :",
          "- **Honoraires à la charge de l'acquéreur** : on affiche le **prix FAI**, le **montant des honoraires en % du prix net vendeur**, et la mention **« honoraires à la charge de l'acquéreur »**.",
          "- **Honoraires à la charge du vendeur** : on affiche le prix **honoraires inclus**.",
          "- Le **barème** doit rester consultable par le client.",
          "- Un affichage non conforme est une **pratique commerciale trompeuse** sanctionnable par la DGCCRF (amende administrative).",
          "## Les pièges à éviter",
          "- **Oublier le TTC** ou l'assiette dans le mandat : source de litige et de perte de commission.",
          "- **Mal afficher dans l'annonce** (pas de mention de qui paie, pas de %) : pratique commerciale sanctionnable.",
          "- **Modifier les honoraires en cours de route** sans avenant signé.",
          "- **Laisser croire que la commission est due dès la signature du mandat** : elle n'est acquise qu'à la vente réalisée."
        ]
      },
      {
        "titre": "Rédiger un mandat conforme (loi Hoguet, décret de 1972, ALUR)",
        "contenu": [
          "Un mandat mal rédigé est un mandat **nul** : pas de commission, même si la vente se fait grâce à vous. La conformité n'est pas de la paperasse, c'est la **condition de votre rémunération**.",
          "## Le cadre : carte T, garantie, assurance",
          "- L'agence doit détenir la **carte professionnelle « Transactions sur immeubles et fonds de commerce » (carte T)**, délivrée par la **CCI**, valable **3 ans** et renouvelable.",
          "- Le négociateur agit sous **attestation d'habilitation** (ex-« carte blanche ») rattachée au titulaire de la carte.",
          "- **Garantie financière** obligatoire en cas de **maniement de fonds** (séquestre) ; l'agence qui ne manie pas de fonds le déclare expressément.",
          "- **Assurance responsabilité civile professionnelle** obligatoire.",
          "- **Formation continue obligatoire** : 14 heures par an ou 42 heures sur 3 ans (loi ALUR, décret n°2016-173 du 18 février 2016), condition du renouvellement de la carte.",
          "## Les mentions obligatoires du mandat",
          "- **Identité et adresse du titulaire** de la carte T, et **numéro de carte**.",
          "- **Identité complète du mandant** et sa **qualité à vendre** (pleine propriété, indivision, succession, pouvoir du conjoint).",
          "- **Désignation précise du bien** et **prix**.",
          "- **Rémunération** : montant **TTC** et **qui la paie**.",
          "- **Durée** du mandat et de l'**exclusivité** éventuelle, et **conditions de résiliation**.",
          "- **Moyens employés** et, pour l'exclusif, **modalités de reddition de comptes** (compte rendu périodique), apport de la **loi ALUR**.",
          "- **Numéro de mandat** reporté sur l'exemplaire remis au client.",
          "- Mention de la **garantie financière** si maniement de fonds.",
          "## Le registre des mandats",
          "- Tout mandat est inscrit sur un **registre des mandats** coté et **numéroté sans discontinuité**, par **ordre chronologique** de signature.",
          "- Le registre peut être tenu sous **forme électronique**.",
          "- Le **numéro** attribué doit figurer sur l'**exemplaire du mandat remis au mandant**. Un mandat non inscrit ou non numéroté est **irrégulier**.",
          "## Nombre d'exemplaires et remise",
          "Le mandat est établi en **autant d'originaux qu'il y a de parties**, et **un exemplaire est remis immédiatement au mandant**. À défaut, le mandat peut être annulé.",
          "## Durée, exclusivité et résiliation",
          "- Le mandat a une **durée déterminée** (obligatoire) : pas de mandat « à durée illimitée ».",
          "- **Clause d'exclusivité ou clause pénale** : elle peut être **dénoncée à tout moment passé un délai de 3 mois** à compter de la signature, par **lettre recommandée AR** avec un **préavis de 15 jours** (article 78 du décret du 20 juillet 1972).",
          "- **Tacite reconduction** : encadrée ; le professionnel doit **informer le mandant** de la possibilité de ne pas renouveler (loi Chatel, article L215-1 du Code de la consommation). À défaut d'information, le client peut résilier gratuitement après reconduction.",
          "## La règle d'or Hoguet",
          "**Pas de mandat écrit préalable = aucune rémunération**, même si la vente se réalise grâce à vous (loi n°70-9 du 2 janvier 1970). Le mandat écrit doit **précéder** toute démarche.",
          "## Les sanctions",
          "- Exercer sans carte T ou percevoir une rémunération sans mandat écrit régulier expose à des **sanctions pénales** (jusqu'à 6 mois d'emprisonnement et 7 500 € d'amende, article 16 de la loi Hoguet).",
          "- Au civil, le manquement entraîne surtout la **perte pure et simple de la commission**.",
          "## Les pièges à éviter",
          "- **Antidater** un mandat : c'est un faux, interdiction absolue.",
          "- **Oublier une mention obligatoire** (TTC, durée, n° de mandat, reddition de comptes) : nullité possible.",
          "- **Ne pas remettre son exemplaire au client** le jour de la signature.",
          "- **Démarcher ou faire visiter avant** d'avoir le mandat écrit signé.",
          "- **Prévoir une durée indéterminée** ou une reconduction tacite sans information Chatel."
        ]
      },
      {
        "titre": "Qui peut signer ? Capacité, qualité et pouvoirs du mandant",
        "contenu": [
          "Un mandat signé par la mauvaise personne, ou par une seule alors qu'il en fallait plusieurs, est **inefficace** : vous commercialisez un bien que votre « vendeur » ne peut pas vendre seul. **Vérifiez toujours la qualité et le pouvoir du mandant** avant de signer.",
          "Deux questions à vous poser systématiquement : cette personne est-elle **propriétaire** (capacité et titre) et a-t-elle le **pouvoir de vendre seule** ? Si un doute subsiste, on réunit tous les titulaires de droits ou on obtient leurs procurations.",
          "## Partir du titre de propriété",
          "Le **titre de propriété** (acte notarié) dit **qui possède le bien et à quel titre** : nom(s), quote-part, pleine propriété ou démembrement. C'est votre point de départ systématique.",
          "## Les couples",
          "- **Bien commun** (époux mariés sans contrat, communauté) : la vente exige le **consentement des deux époux** (article 1424 du Code civil). Les deux signent.",
          "- **Logement de la famille** : même si le bien est le **bien propre d'un seul époux**, on **ne peut pas le vendre sans l'accord de l'autre** tant qu'il sert de résidence à la famille (article 215, alinéa 3 du Code civil).",
          "- **PACS / concubins** : s'ils ont acheté ensemble, ils sont **indivisaires**, donc tous signent.",
          "## L'indivision",
          "- La vente d'un bien indivis requiert en principe l'**unanimité des indivisaires** (article 815-3 du Code civil). **Tous** signent le mandat.",
          "- **Succession** : tant que le partage n'est pas fait, les héritiers sont en **indivision successorale**, donc **tous les héritiers** signent (vérifier la dévolution et l'attestation notariée).",
          "- Un mandat signé par un seul indivisaire « qui se fait fort » des autres est **fragile** : exigez la signature de tous, ou une **procuration**.",
          "## La SCI",
          "- C'est la **société** qui vend, représentée par son **gérant**. Vérifiez les **statuts** : le gérant peut-il vendre seul, ou faut-il une **décision collective des associés** (PV d'assemblée) ?",
          "- Récupérez un **extrait Kbis** récent et le **PV d'AG** autorisant la vente si les statuts l'exigent.",
          "## Le démembrement (usufruit / nue-propriété)",
          "La vente de la **pleine propriété** suppose l'accord de **l'usufruitier ET du (des) nu(s)-propriétaire(s)**. Tous signent le mandat.",
          "## Majeurs protégés et mineurs",
          "- **Tutelle** : la vente est un acte de disposition qui requiert l'**autorisation du juge** (juge des contentieux de la protection) ou du conseil de famille.",
          "- **Curatelle** : le majeur signe **assisté de son curateur**.",
          "- **Habilitation familiale** : la personne habilitée agit dans la limite de l'habilitation.",
          "- **Mineur** : représenté par ses parents (administration légale), avec **autorisation du juge** pour un acte de disposition.",
          "## Le cas du bien loué",
          "Si le bien est vendu **occupé par un locataire**, vérifiez le bail : une vente **libre** (congé pour vendre) peut déclencher un **droit de préemption du locataire** (loi du 6 juillet 1989). Cela n'empêche pas de prendre le mandat, mais conditionne la commercialisation.",
          "## La procuration",
          "Un mandant peut signer **par mandataire muni d'une procuration** (pouvoir). Vérifiez son étendue, sa date et l'identité du signataire. Pour un couple ou une indivision, une procuration de l'absent évite de reporter la signature.",
          "## Cas pratique",
          "Succession à Martigues : une maison appartient à **trois enfants héritiers**. L'un d'eux vous contacte et veut signer « pour tout le monde ». Vous expliquez qu'il faut la **signature des trois** (ou leurs procurations), faute de quoi aucune vente ne pourra aboutir. Vous organisez un R2 avec les trois, ou récupérez deux procurations.",
          "## Les pièges à éviter",
          "- **Signer avec un seul époux** sur le logement de famille ou un bien commun.",
          "- **Oublier un indivisaire** (par exemple un héritier éloigné).",
          "- **Faire confiance à un « je me charge des autres »** sans écrit.",
          "- **Négliger de vérifier les statuts** d'une SCI ou l'autorisation du juge pour un majeur protégé.",
          "- **Ignorer le droit de préemption** d'un locataire en place."
        ]
      },
      {
        "titre": "Le droit de rétractation et la mise en commercialisation",
        "contenu": [
          "Depuis l'extension du droit de la consommation aux mandats immobiliers, **le lieu de signature change tout**. Un mandat signé au domicile du vendeur ouvre un **droit de rétractation**, qui peut vous priver de commission si vous l'ignorez.",
          "Ce droit protège le vendeur **consommateur** (un particulier). Il ne s'applique pas lorsque le mandant agit pour des besoins professionnels dans certaines conditions, mais dans le doute, traitez tout particulier comme un consommateur protégé.",
          "## En agence ou hors établissement ?",
          "- **Signé dans l'agence** (« dans l'établissement ») : **pas de droit de rétractation** légal de 14 jours.",
          "- **Signé hors établissement** (au **domicile** du vendeur, sur le lieu du bien, lors d'un rendez-vous à l'extérieur) : le vendeur **consommateur** bénéficie d'un **délai de rétractation de 14 jours** (articles L221-18 et suivants du Code de la consommation).",
          "## Le point de départ et la forme",
          "- Le délai de **14 jours** court **à compter de la signature** du mandat (contrat de prestation de service).",
          "- Vous devez remettre au vendeur un **formulaire type de rétractation** (bordereau) et l'**informer** clairement de ce droit, sur **support durable** (papier remis, ou e-mail / document conservable).",
          "## La sanction d'un défaut d'information",
          "Si vous n'informez pas correctement le vendeur de son droit de rétractation, le délai est **prolongé jusqu'à 12 mois** (article L221-20 du Code de la consommation), et vous vous exposez à des **sanctions**. Un mandat annulable pendant un an, c'est une commission suspendue en l'air.",
          "## Commercialiser avant la fin des 14 jours",
          "- En principe, vous **ne devez pas commencer à exécuter** la prestation (diffuser, faire visiter) **avant la fin du délai** de rétractation.",
          "- Pour démarrer plus tôt, recueillez la **demande expresse** du vendeur sur **support durable** (article L221-25 du Code de la consommation).",
          "- Attention : si le vendeur se rétracte **après** avoir demandé l'exécution anticipée, il peut rester **redevable d'un montant proportionnel** au travail déjà accompli, mais encaisser une véritable commission dans ce cas reste rarement simple.",
          "## La stratégie prudente",
          "- **Quand c'est possible, faites signer le mandat en agence** : vous évitez tout le risque de rétractation.",
          "- Si vous signez au domicile, **remettez le bordereau**, informez par écrit, et **recueillez l'accord exprès** si vous voulez diffuser tout de suite.",
          "- Beaucoup d'agences préfèrent **attendre les 14 jours** ou faire **revenir le vendeur en agence** pour sécuriser.",
          "## Cas pratique",
          "R2 au domicile d'un vendeur à Martigues, mandat exclusif signé sur place. Vous remettez le **bordereau de rétractation**, expliquez les **14 jours**, et faites signer une **demande expresse de démarrage immédiat** pour lancer le reportage photo dès le lendemain. Tout est tracé : vous êtes couvert.",
          "## Ne pas confondre avec les délais de l'acquéreur",
          "Le délai de 14 jours vise le **vendeur qui signe un mandat**. Côté acquéreur, dans la vente, s'appliquent d'autres délais : la **rétractation SRU de 10 jours** après le compromis, et le **délai de réflexion de 10 jours** sur l'offre de prêt (loi Scrivener). Ce sont trois dispositifs distincts.",
          "## Les pièges à éviter",
          "- **Oublier le bordereau** : le délai de rétractation passe à 12 mois.",
          "- **Diffuser sans accord exprès** après une signature au domicile.",
          "- **Confondre** signature en agence (pas de rétractation) et hors établissement (14 jours).",
          "- **Confondre** la rétractation du mandat (14 jours) avec celle du compromis (10 jours, SRU)."
        ]
      },
      {
        "titre": "Sécuriser le dossier & conformité LCB-FT / Tracfin",
        "contenu": [
          "La prise de mandat ouvre un **dossier vendeur** complet. Un dossier carré accélère la vente, rassure l'acquéreur et le notaire, et vous met en **conformité** avec vos obligations légales.",
          "Un bon réflexe : récupérer un maximum de pièces **le jour même du mandat**, pendant que le vendeur est mobilisé. Un dossier incomplet est la première cause de retard au compromis.",
          "## Les pièces de base du dossier vendeur",
          "- **Titre de propriété** et **pièce(s) d'identité** du ou des vendeurs.",
          "- **Dernier avis de taxe foncière**.",
          "- Documents d'**urbanisme** utiles (permis, déclarations de travaux, conformité).",
          "## Les diagnostics (DDT)",
          "Le **Dossier de Diagnostic Technique (DDT)** regroupe, selon le bien :",
          "- **DPE** : valable **10 ans** (pour ceux réalisés depuis le 1er juillet 2021).",
          "- **Amiante** (bâti avant le 1er juillet 1997) : durée **illimitée** si négatif et réalisé selon la réglementation récente.",
          "- **Plomb / CREP** (bâti avant le 1er janvier 1949) : **1 an** si positif, **illimité** si négatif.",
          "- **Électricité** et **gaz** (installations de plus de 15 ans) : **3 ans** chacun.",
          "- **État des risques (ERP)** : **6 mois**.",
          "- **Termites** (zones concernées par arrêté préfectoral, fréquent en PACA) : **6 mois**.",
          "- **Loi Carrez** (copropriété) : pas de durée légale, valable tant que le bien n'est pas modifié.",
          "- **Assainissement non collectif** : **3 ans**.",
          "- **Audit énergétique** : obligatoire à la vente des logements classés **F ou G depuis le 1er avril 2023**, étendu à la classe **E depuis le 1er janvier 2025** (voir le module DPE & performance énergétique).",
          "## Le DPE, un sujet à part",
          "- Le **DPE est opposable** depuis le 1er juillet 2021 : ses conclusions engagent, l'acquéreur peut s'en prévaloir.",
          "- La **classe énergie et la classe GES doivent figurer dès l'annonce**, avec une **estimation des coûts annuels d'énergie**.",
          "- Calendrier de décence énergétique en location : les **G sont interdits à la location depuis 2025**, les **F le seront en 2028** et les **E en 2034**, avec **gel des loyers des F et G**. C'est un argument de négociation du prix à la vente d'une passoire.",
          "## En copropriété",
          "- **Règlement de copropriété** et état descriptif de division.",
          "- **PV des assemblées générales** (les 3 dernières années), montant des **charges**, **carnet d'entretien**, **pré-état daté** et **fonds de travaux**.",
          "## Conformité LCB-FT (Tracfin)",
          "L'agent immobilier est **assujetti à la lutte contre le blanchiment et le financement du terrorisme (LCB-FT)**. Dès l'**entrée en relation**, vous devez **identifier et vérifier** l'identité du client (**KYC**) et apprécier le **risque**.",
          "- La **fiche d'identification Tracfin** se génère automatiquement dans l'application à partir du dossier vendeur (pièce d'identité + titre de propriété).",
          "- La **notation du risque** et, le cas échéant, la **déclaration de soupçon** à Tracfin restent de votre responsabilité.",
          "- Les **documents d'identification et de vigilance** doivent être **conservés 5 ans** (article L561-12 du Code monétaire et financier).",
          "## Dans l'application",
          "- Le **dossier client** affiche d'un coup d'œil les **pièces manquantes**.",
          "- Le **fractionnement IA** découpe un PDF unique en pièces classées.",
          "- La **fiche Tracfin** se génère en un clic.",
          "## Les pièges à éviter",
          "- **Lancer la vente sans diagnostics** : le DPE (classe + GES) doit même figurer dès l'annonce.",
          "- **Négliger le KYC** à l'entrée en relation.",
          "- **Oublier les documents de copropriété** : ils bloquent le compromis.",
          "- **Jeter les pièces de vigilance** avant 5 ans."
        ]
      },
      {
        "titre": "Déontologie, devoir de conseil et protection des données",
        "contenu": [
          "Au-delà de la loi Hoguet, le négociateur est tenu par un **code de déontologie** et par un **devoir de conseil** dont le non-respect engage sa responsabilité. Une prise de mandat irréprochable est aussi une prise de mandat **éthique**.",
          "## Le code de déontologie",
          "- Les professionnels de l'immobilier sont soumis à un **code de déontologie** fixé par le **décret n°2015-1090 du 28 août 2015**.",
          "- Il impose notamment : **compétence**, **transparence**, **confidentialité**, **respect des intérêts du client**, prévention des **conflits d'intérêts** et **confraternité**.",
          "- Le respect de ces règles est contrôlé par la **commission de contrôle** rattachée au **CNTGI** (Conseil national de la transaction et de la gestion immobilières), qui peut prononcer des **sanctions disciplinaires**.",
          "## Le devoir d'information et de conseil",
          "- Vous devez une **information loyale** sur le bien, le marché et le prix : taire un défaut connu ou survendre un prix irréaliste engage votre responsabilité.",
          "- Le **devoir de conseil** impose d'alerter le vendeur quand son prix est hors marché, preuves à l'appui : c'est votre protection autant que la sienne.",
          "- Vérifiez la **faisabilité** de l'opération (qualité à vendre, servitudes, urbanisme) avant d'engager la commercialisation.",
          "## Non-discrimination : une obligation absolue",
          "- Vous **ne pouvez pas** sélectionner les acquéreurs sur un critère discriminatoire (origine, situation de famille, handicap, etc.) : c'est un **délit** (articles 225-1 et suivants du Code pénal).",
          "- Un vendeur qui vous demande d'écarter une catégorie d'acquéreurs vous place dans l'illégalité : vous **refusez** et l'expliquez.",
          "## Protection des données (RGPD)",
          "- Les données du vendeur et des acquéreurs (identité, revenus, situation) sont des **données personnelles** protégées par le **RGPD** (règlement UE 2016/679).",
          "- Principes : **finalité** (ne collecter que pour la transaction), **minimisation**, **sécurité** et **durée de conservation limitée**.",
          "- Informez le mandant de l'usage de ses données et recueillez son accord pour la **diffusion** de l'annonce et des photos.",
          "## Le secret et la discrétion",
          "- Le motif de vente (divorce, difficultés financières, succession) est **confidentiel** : il ne doit jamais apparaître dans l'annonce ni être divulgué aux acquéreurs.",
          "- La discrétion est un argument commercial : un vendeur sait qu'avec vous, sa situation personnelle est protégée.",
          "## Cas pratique",
          "Un vendeur à Martigues vous glisse : « Je ne veux pas vendre à des gens d'un certain quartier. » Vous répondez calmement que la loi vous l'interdit formellement, que vous sélectionnez les acquéreurs **sur leur solvabilité et leur sérieux**, jamais sur leur origine, et que c'est aussi la garantie d'une vente sécurisée pour lui.",
          "## Les pièges à éviter",
          "- **Survendre un prix** pour rentrer le mandat : c'est un manquement au devoir de conseil.",
          "- **Divulguer le motif de vente** ou des informations confidentielles.",
          "- **Accepter une consigne discriminatoire** du vendeur.",
          "- **Diffuser photos et données** sans l'accord du mandant."
        ]
      },
      {
        "titre": "Piloter le mandat après la signature",
        "contenu": [
          "Signer le mandat n'est pas la fin, c'est le **début de votre engagement**. Un mandat bien piloté se transforme en vente ; un mandat « signé puis oublié » se perd, et, en exclusif, vous expose à la résiliation après 3 mois.",
          "## La reddition de comptes (obligation légale)",
          "- Pour le mandat **exclusif**, la loi ALUR impose d'indiquer et de tenir les **modalités de reddition de comptes** : un **compte rendu périodique** de vos actions au vendeur.",
          "- Concrètement : **compte rendu après chaque visite** (retours des acquéreurs) et **point régulier** (hebdomadaire ou bimensuel).",
          "- Dans l'application, le **bilan de commercialisation** formalise ce reporting : nombre de contacts, visites, retours, positionnement prix.",
          "## Le reporting qui fidélise (et prépare la baisse)",
          "Un vendeur **informé** reste un vendeur **confiant**. Le reporting régulier :",
          "- Prouve que vous travaillez : il ne vous reprochera pas « l'inaction ».",
          "- **Prépare en douceur un ajustement de prix** : les retours factuels des acquéreurs (« trop cher pour l'état », « DPE F rédhibitoire ») valent mieux qu'un « il faut baisser » abrupt.",
          "## L'avenant de prix",
          "- Toute **modification du prix** (ou des honoraires) se fait par **avenant écrit signé** par le mandant, jamais à l'oral.",
          "- Présentez la baisse **avec les preuves** (statistiques de visites, retours, comparables), comme une **décision stratégique** et non un aveu d'échec.",
          "- Script : « En 5 semaines, 9 contacts, 3 visites, zéro offre : le marché nous dit que nous sommes 5 % au-dessus. On ajuste à [prix] pour capter une nouvelle vague d'acquéreurs ? »",
          "## Renouvellement et résiliation",
          "- À l'approche du terme, **faites le point** et proposez un **renouvellement** si la relation est bonne.",
          "- Si le mandat est en **tacite reconduction**, respectez l'**obligation d'information** du vendeur (loi Chatel, article L215-1 du Code de la consommation).",
          "- En exclusif, rappelez-vous que le vendeur peut **dénoncer après 3 mois** (LRAR, 15 jours de préavis) : la meilleure protection contre la résiliation, c'est un **reporting irréprochable**.",
          "## Le lien avec le compromis",
          "- Dès qu'une offre est acceptée, le pilotage ne s'arrête pas : vous enchaînez sur la **sécurisation de l'acquéreur** (financement, délai SRU de 10 jours) et la préparation du **compromis** (voir le module dédié).",
          "- Un mandat bien tenu, avec un dossier vendeur complet, fait gagner des semaines à cette étape.",
          "## Cas pratique",
          "Mandat exclusif de 3 mois sur un T3 à Martigues, lancé à 228 000 €. À 5 semaines : beaucoup de vues en ligne mais peu de visites. Vous présentez le **bilan de commercialisation** chiffré, les retours (« la cuisine est à refaire »), et proposez un **avenant** à 219 000 €. Le vendeur, informé semaine après semaine, accepte sans friction : vous vendez à 215 000 € trois semaines plus tard.",
          "## Les pièges à éviter",
          "- **Disparaître après la signature** : première cause de résiliation et de mauvaise réputation.",
          "- **Modifier le prix à l'oral** sans avenant.",
          "- **Attendre le dernier moment** pour proposer une baisse, quand le bien est déjà grillé.",
          "- **Oublier l'information Chatel** avant la reconduction tacite."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Quel type de mandat engage l'agence sur un résultat et se vend statistiquement plus vite et plus près du prix ?",
        "options": [
          "Le mandat simple",
          "Le mandat exclusif",
          "Le bon de visite",
          "Le mandat de recherche"
        ],
        "correct": 1,
        "explication": "L'exclusivité déclenche l'investissement de l'agent (photos pro, home-staging, diffusion premium) et évite la banalisation : le bien se vend plus vite et plus près du prix."
      },
      {
        "question": "Un mandat exclusif peut être dénoncé par le vendeur…",
        "options": [
          "À tout moment, sans préavis",
          "Jamais avant son terme",
          "Après 3 mois, par lettre recommandée AR avec 15 jours de préavis",
          "Uniquement par l'agence"
        ],
        "correct": 2,
        "explication": "Article 78 du décret du 20 juillet 1972 : passé 3 mois, la clause d'exclusivité est dénonçable à tout moment par LRAR, avec un préavis de 15 jours."
      },
      {
        "question": "Sans mandat écrit préalable, l'agent immobilier…",
        "options": [
          "Touche la moitié de la commission",
          "Ne peut percevoir aucune rémunération",
          "Est payé si la vente aboutit",
          "Peut réclamer des dommages et intérêts"
        ],
        "correct": 1,
        "explication": "La loi Hoguet impose un mandat écrit préalable : à défaut, aucune commission n'est due, même si la vente se fait grâce à l'agent."
      },
      {
        "question": "Un mandat signé au domicile du vendeur (hors établissement) ouvre un droit de rétractation de…",
        "options": [
          "48 heures",
          "7 jours",
          "14 jours",
          "aucun délai"
        ],
        "correct": 2,
        "explication": "Hors établissement, le vendeur consommateur dispose de 14 jours de rétractation (art. L221-18 du Code de la consommation). À défaut de bordereau d'information, le délai passe à 12 mois."
      },
      {
        "question": "Pour vendre un bien détenu en indivision (par exemple une succession), le mandat doit être signé par…",
        "options": [
          "L'indivisaire le plus âgé",
          "Tous les indivisaires (ou leurs procurations)",
          "L'indivisaire majoritaire seul",
          "Un seul, avec l'accord oral des autres"
        ],
        "correct": 1,
        "explication": "La vente d'un bien indivis exige l'unanimité (art. 815-3 du Code civil) : tous les indivisaires signent, ou donnent procuration."
      },
      {
        "question": "Lorsque les honoraires sont « à la charge de l'acquéreur », les droits de mutation (frais de notaire) se calculent sur…",
        "options": [
          "Le prix FAI, honoraires inclus",
          "Le prix net vendeur, hors honoraires",
          "Le double des honoraires",
          "Un forfait fixe"
        ],
        "correct": 1,
        "explication": "Honoraires à charge acquéreur et mentionnés comme tels : ils sortent de l'assiette des droits de mutation, calculés sur le prix net vendeur. C'est une économie pour l'acheteur et un argument de vente."
      },
      {
        "question": "Le numéro attribué par le registre des mandats doit obligatoirement figurer…",
        "options": [
          "Uniquement dans les archives internes de l'agence",
          "Sur l'exemplaire du mandat remis au mandant",
          "Sur le panneau « À vendre »",
          "Nulle part, c'est une formalité facultative"
        ],
        "correct": 1,
        "explication": "Les mandats sont inscrits par ordre chronologique et numérotés sans discontinuité sur le registre ; le numéro doit être reporté sur l'exemplaire remis au mandant, sous peine d'irrégularité."
      },
      {
        "question": "Pour un mandat exclusif, la loi ALUR impose de prévoir dans le contrat…",
        "options": [
          "Un prix de vente fixé librement par l'agence",
          "Des modalités de reddition de comptes (compte rendu périodique au vendeur)",
          "Une commission plafonnée à 3 %",
          "La gratuité des diagnostics"
        ],
        "correct": 1,
        "explication": "La loi ALUR a renforcé l'obligation d'information : le mandat exclusif doit préciser les modalités de reddition de comptes, c'est-à-dire un compte rendu périodique des actions menées."
      },
      {
        "question": "Au titre de la LCB-FT (Tracfin), à quel moment l'agent doit-il identifier et vérifier l'identité du client (KYC) ?",
        "options": [
          "Seulement au moment du compromis",
          "Dès l'entrée en relation, à la prise de mandat",
          "Jamais, c'est le notaire qui s'en charge",
          "Uniquement après la signature de l'acte authentique"
        ],
        "correct": 1,
        "explication": "L'agent immobilier est assujetti à la LCB-FT : dès l'entrée en relation, il identifie et vérifie l'identité du client (KYC), apprécie le risque, et conserve les pièces de vigilance pendant 5 ans."
      },
      {
        "question": "Dans un mandat semi-exclusif, par rapport au mandat exclusif classique, le vendeur...",
        "options": [
          "garde le droit de vendre lui-même son bien a un acquereur qu'il trouve seul",
          "peut confier le bien a autant d'agences qu'il le souhaite",
          "ne peut plus resilier avant le terme du mandat",
          "double automatiquement les honoraires de l'agence"
        ],
        "correct": 0,
        "explication": "Le semi-exclusif reserve l'exclusivite vis-a-vis des autres agences tout en laissant le vendeur libre de vendre lui-meme."
      },
      {
        "question": "Le bon de visite signe par un acquereur...",
        "options": [
          "fonde a lui seul le droit de l'agence a percevoir sa commission",
          "remplace le mandat lorsque le vendeur est presse",
          "prouve seulement qu'une visite a eu lieu et n'ouvre aucun droit a commission",
          "oblige l'acquereur a faire une offre d'achat"
        ],
        "correct": 2,
        "explication": "Seul le mandat ecrit signe par le vendeur fonde la remuneration ; le bon de visite n'est qu'une preuve de visite."
      },
      {
        "question": "Le fichier commun AMEPI permet a un vendeur de beneficier...",
        "options": [
          "d'une baisse automatique des frais de notaire",
          "de l'exclusivite tout en profitant de la force de frappe de plusieurs agences adherentes",
          "d'un mandat sans duree determinee",
          "d'une dispense de diagnostics techniques"
        ],
        "correct": 1,
        "explication": "L'AMEPI est un reseau de mandats exclusifs partages : un seul interlocuteur, mais plusieurs agences qui presentent leurs acquereurs."
      },
      {
        "question": "Dans le deroule d'un entretien de prise de mandat (R2), les honoraires s'annoncent...",
        "options": [
          "des les premieres minutes, avant tout autre sujet",
          "apres avoir presente l'avis de valeur et la strategie de commercialisation",
          "uniquement par ecrit, jamais a l'oral",
          "seulement une fois le compromis signe"
        ],
        "correct": 1,
        "explication": "On cree d'abord la valeur (avis de valeur, plan d'action) avant d'annoncer les honoraires comme la contrepartie logique du resultat."
      },
      {
        "question": "Depuis l'arrete du 10 janvier 2017, le bareme d'honoraires de l'agence doit etre affiche...",
        "options": [
          "uniquement sur demande ecrite du client",
          "en vitrine, sur le site internet et rappele dans les annonces, en TTC",
          "seulement au siege de la CCI",
          "exclusivement en hors taxes"
        ],
        "correct": 1,
        "explication": "Le bareme TTC doit etre affiche en vitrine, sur le site et rappele dans les annonces ; un affichage non conforme est une pratique commerciale trompeuse."
      },
      {
        "question": "Pour un prix net vendeur de 330 000 euros et des honoraires de 5 % (16 500 euros TTC) a la charge de l'acquereur, le prix FAI affiche est de...",
        "options": [
          "313 500 euros",
          "330 000 euros",
          "346 500 euros",
          "363 000 euros"
        ],
        "correct": 2,
        "explication": "Le prix FAI (frais d'agence inclus) = prix net vendeur + honoraires, soit 330 000 + 16 500 = 346 500 euros."
      },
      {
        "question": "La carte professionnelle Transactions sur immeubles (carte T)...",
        "options": [
          "est delivree par la CCI, valable 3 ans et renouvelable",
          "est delivree a vie par le notaire",
          "est delivree par la prefecture pour 10 ans",
          "n'est pas necessaire si l'agence ne manie pas de fonds"
        ],
        "correct": 0,
        "explication": "La carte T est delivree par la CCI, valable 3 ans et renouvelable, notamment sous condition de formation continue."
      },
      {
        "question": "La formation continue obligatoire imposee par la loi ALUR pour renouveler la carte T est de...",
        "options": [
          "7 heures par an",
          "14 heures par an, soit 42 heures sur 3 ans",
          "20 heures tous les 5 ans",
          "100 heures en une seule fois"
        ],
        "correct": 1,
        "explication": "La loi ALUR impose 14 heures de formation par an ou 42 heures sur 3 ans, condition du renouvellement de la carte."
      },
      {
        "question": "Un mandat de vente doit obligatoirement...",
        "options": [
          "etre conclu pour une duree determinee",
          "prevoir une duree illimitee pour securiser l'agence",
          "etre renouvele chaque mois par le vendeur",
          "etre signe devant notaire"
        ],
        "correct": 0,
        "explication": "La duree determinee est obligatoire : un mandat a duree illimitee est irregulier."
      },
      {
        "question": "Le registre des mandats doit etre tenu...",
        "options": [
          "par ordre alphabetique des vendeurs",
          "cote et numerote sans discontinuite, par ordre chronologique de signature",
          "uniquement sur support papier, jamais electronique",
          "sans numerotation, pour preserver la confidentialite"
        ],
        "correct": 1,
        "explication": "Le registre est numerote sans discontinuite et par ordre chronologique ; un mandat non inscrit ou non numerote est irregulier."
      },
      {
        "question": "Pour vendre un bien appartenant a une SCI, le mandat doit etre signe par...",
        "options": [
          "n'importe quel associe minoritaire",
          "le gerant, sous reserve de ce que prevoient les statuts (decision des associes eventuelle)",
          "le locataire du bien",
          "la CCI qui delivre la carte T"
        ],
        "correct": 1,
        "explication": "C'est la societe qui vend, representee par son gerant ; il faut verifier les statuts et, le cas echeant, obtenir une decision collective des associes."
      },
      {
        "question": "Si l'agent omet d'informer le vendeur de son droit de retractation pour un mandat signe hors etablissement, ce delai...",
        "options": [
          "reste bloque a 14 jours",
          "est supprime",
          "est prolonge jusqu'a 12 mois",
          "passe a 48 heures"
        ],
        "correct": 2,
        "explication": "A defaut d'information correcte, le delai de retractation est prolonge jusqu'a 12 mois (art. L221-20 du Code de la consommation)."
      },
      {
        "question": "Au titre de la lutte anti-blanchiment (LCB-FT), les documents d'identification et de vigilance du client doivent etre conserves pendant...",
        "options": [
          "6 mois",
          "2 ans",
          "5 ans",
          "30 ans"
        ],
        "correct": 2,
        "explication": "L'article L561-12 du Code monetaire et financier impose une conservation de 5 ans des documents d'identification et de vigilance."
      }
    ]
  },
  {
    "id": "negociation",
    "titre": "La négociation",
    "icone": "🤝",
    "categorie": "Commercial",
    "resume": "Préparer, ancrer le prix, échanger concessions et contreparties, négocier des deux côtés et verrouiller un accord qui tient jusqu'à l'acte.",
    "duree": "48 min",
    "lecons": [
      {
        "titre": "La négociation se gagne avant de commencer",
        "contenu": [
          "**80 % d'une négociation réussie se joue avant le premier échange**, dans la préparation. Le négociateur qui improvise subit le rythme de l'autre ; celui qui a préparé ses informations, ses marges et ses arguments conduit la danse et reste calme quand la discussion se tend.",
          "## Les quatre informations indispensables",
          "- La **motivation** et le **délai** de chaque partie, vendeur ET acquéreur : mutation, succession, séparation, achat déjà engagé, bien devenu trop grand… Une partie pressée par le temps a mécaniquement une marge de négociation plus large.",
          "- La **valeur de marché réelle** : vos comparables **DVF** (ventes notariées réellement signées) sont votre point d'ancrage factuel, pas une opinion ni le prix d'affichage des concurrents.",
          "- Le **financement de l'acquéreur** : apport, accord de principe bancaire, prêt relais éventuel, taux d'endettement. Une offre financée pèse dix fois plus qu'une simple intention.",
          "- Les **marges de manœuvre** : jusqu'où le vendeur peut réellement descendre (son **prix plancher net**), jusqu'où l'acquéreur peut monter (son **plafond réel**, presque toujours supérieur à sa première offre).",
          "## La ZOPA : la zone d'accord possible",
          "La **ZOPA** (zone d'accord possible) est l'espace entre le prix plancher du vendeur et le plafond de l'acquéreur. Si ces deux limites se recouvrent, un accord existe : votre travail est de le faire émerger. Si elles ne se recouvrent pas, aucune technique ne créera l'accord — il faudra d'abord faire bouger une motivation, un délai ou un prix.",
          "Exemple : un vendeur prêt à descendre à **305 000 €** net et un acquéreur prêt à monter à **315 000 €**. La ZOPA est la fourchette **305 000 – 315 000 €** : tout accord conclu dans cette zone est gagnant pour les deux.",
          "## Votre MESORE : la meilleure solution de repli",
          "La **MESORE** (meilleure solution de rechange, **BATNA** en anglais) est ce que chaque partie fera **si la négociation échoue**. Un vendeur qui a d'autres acquéreurs en réserve, ou un acquéreur qui a repéré un autre bien équivalent, dispose d'une MESORE forte et négocie en position haute.",
          "Votre rôle : **évaluer la MESORE de chacun** (le vendeur a-t-il vraiment d'autres offres ? l'acquéreur, d'autres biens disponibles ?) et, avec honnêteté, la rappeler à celui qui surestime la sienne.",
          "## Votre posture : tiers de confiance",
          "Vous n'êtes l'avocat de personne : vous **rapprochez deux intérêts**. Les deux parties doivent sentir que vous défendez **l'accord**, et non l'une contre l'autre — c'est précisément ce qui vous rend crédible auprès des deux et désamorce la méfiance.",
          "## Préparer, c'est aussi écrire",
          "Avant chaque échange décisif, posez par écrit vos trois chiffres clés : le prix plancher net estimé du vendeur, le plafond probable de l'acquéreur et le point d'accord que vous visez. Vous négociez alors avec une cible, pas au ressenti.",
          "## Mini cas pratique",
          "Maison à Martigues affichée **329 000 € FAI**. Vendeurs mutés à Lyon, compromis de leur futur achat déjà signé (délai = **motivation forte**). Acquéreur primo-accédant, accord de principe à **310 000 €** net acheteur, aucun autre bien en vue (**MESORE faible**). Votre préparation révèle une ZOPA réelle autour de **315 000 – 320 000 €** : la négociation est jouable, à condition de ne pas brader et de travailler les contreparties.",
          "## Erreurs fréquentes",
          "- Négocier sans connaître le prix plancher réel du vendeur : vous découvrez trop tard qu'il ne descendra jamais au niveau annoncé.",
          "- Prendre la première offre de l'acquéreur pour son plafond.",
          "- Entrer en négociation sans comparables DVF sous la main : vous argumentez alors au ressenti, pas à la preuve."
        ]
      },
      {
        "titre": "Les principes de la négociation gagnant-gagnant",
        "contenu": [
          "Une bonne négociation immobilière ne fabrique pas un gagnant et un perdant : elle produit **un accord que les deux parties défendront jusqu'à l'acte**. Un vendeur ou un acquéreur qui se sent floué cherchera la faille pour se rétracter ou renégocier au dernier moment.",
          "## Négociation distributive ou intégrative ?",
          "- **Distributive** (« le gâteau est fixe ») : tout ce que l'un gagne, l'autre le perd. C'est le bras de fer sur le seul prix. Inévitable en partie, mais appauvrissant s'il devient le seul registre.",
          "- **Intégrative** (« agrandir le gâteau ») : on ajoute des variables — délai, meubles, date de libération, conditions, travaux — pour créer de la valeur des deux côtés. C'est là que le professionnel fait réellement la différence.",
          "## Les quatre principes de la méthode de Harvard",
          "Issus de l'ouvrage de référence de Roger Fisher et William Ury, « Comment réussir une négociation » :",
          "- **Dissocier les personnes du problème** : on est dur avec le problème (le prix, les conditions), doux avec les personnes. On ne laisse jamais la négociation glisser vers un conflit d'ego.",
          "- **Raisonner intérêts, pas positions** : derrière une position (« je ne descends pas sous 320 000 € ») se cache un intérêt (« il me faut 300 000 € net pour mon prochain achat »). On négocie l'intérêt, pas la position affichée.",
          "- **Imaginer des options à bénéfice mutuel** : explorer plusieurs pistes avant de trancher (prix + date, prix + meubles, prix + travaux pris en charge).",
          "- **S'appuyer sur des critères objectifs** : prix au m² issus de la DVF, coût réel des travaux chiffré par un professionnel, taux du marché — des faits que personne ne conteste, jamais des opinions.",
          "## Position contre intérêt : l'exemple clé",
          "Un vendeur campe sur **320 000 €**. En creusant, son intérêt réel est de **disposer de 300 000 € net** pour acheter ailleurs. Si les honoraires sont à sa charge, plusieurs solutions existent (passage en honoraires charge acquéreur, ajustement du net vendeur) pour atteindre son objectif **sans** rester bloqué sur le chiffre affiché.",
          "## Pourquoi viser le gagnant-gagnant",
          "Un accord déséquilibré est fragile : la partie lésée exploitera le délai de rétractation, une condition suspensive ou une renégociation de dernière minute avant l'acte. Un accord choisi par les deux **tient** et traverse sans casse les trois mois jusqu'à la signature.",
          "## Mini cas pratique",
          "Acquéreur bloqué à **312 000 €**, vendeur à **322 000 €** : 10 000 € d'écart, blocage distributif. En intégratif, on débloque : le vendeur laisse la cuisine équipée et l'abri de jardin (valeur ~4 000 €) et accepte **318 000 €** ; l'acquéreur, qui n'aura pas à racheter ces équipements, monte à 318 000 €. Accord trouvé en **créant de la valeur**, pas en coupant mécaniquement la poire en deux.",
          "## Erreurs fréquentes",
          "- Rester arc-bouté sur le seul prix alors que d'autres variables permettraient de débloquer.",
          "- Laisser l'affrontement devenir personnel (« il est de mauvaise foi ») : on attaque le problème, jamais la personne.",
          "- Couper machinalement la poire en deux : ce n'est pas négocier, c'est renoncer à créer de la valeur."
        ]
      },
      {
        "titre": "L'ancrage et la psychologie du prix",
        "contenu": [
          "Le prix n'est pas qu'un chiffre : c'est une **perception**. Comprendre les biais cognitifs qui pilotent vendeurs et acquéreurs vous donne une longueur d'avance à chaque échange.",
          "## L'effet d'ancrage",
          "Le **premier chiffre énoncé** fixe le cadre de toute la discussion : c'est l'**ancre**. Une offre très basse « ancre » le vendeur vers le bas ; un prix d'affichage crédible ancre l'acquéreur vers le haut.",
          "- Côté affichage : un prix **juste mais légèrement au-dessus** du plancher ménage une marge de négociation sans « griller » le bien (voir le module Estimation).",
          "- Côté offre basse : ne la rejetez pas en bloc, mais **ré-ancrez** aussitôt sur les comparables DVF, pour que la discussion reparte du marché réel et non de l'ancre basse de l'acquéreur.",
          "## La marge de négociation en France",
          "La **marge de négociation** est l'écart entre le prix affiché à la prise de mandat et le prix finalement signé. Après s'être longtemps tenue autour de **5 %** en moyenne, elle s'est **nettement élargie** avec le repli des prix et le resserrement du crédit de 2023-2024 : en **2025**, les baromètres de marché la situent autour de **8 à 10 %** au niveau national.",
          "- Elle est structurellement plus forte sur les **maisons** (souvent plus de 10 %) que sur les **appartements** (autour de 8 %).",
          "- Elle dépend surtout de la **tension du secteur**, du **type de bien** et de sa **justesse de prix** : un bien au juste prix dans un secteur tendu se négocie peu, parfois au prix ; un bien surévalué « absorbe » toute la marge et davantage encore.",
          "- À Martigues et dans le bassin de l'étang de Berre, raisonnez toujours sur vos **DVF locales**, jamais sur une moyenne nationale qui ne dit rien de votre rue.",
          "## L'effet de dotation (côté vendeur)",
          "L'**effet de dotation** pousse un propriétaire à **surévaluer** son bien du simple fait qu'il lui appartient : il y projette ses souvenirs, ses travaux, son vécu. D'où l'écart fréquent entre « prix affectif » et prix de marché.",
          "- On ne combat pas l'affect par l'affect : on **recentre sur les faits** (comparables, délai de vente, retours de visites).",
          "- Phrase utile : « Je comprends l'attachement que vous avez à cette maison. Le marché, lui, raisonne en comparables : voici ce que des biens équivalents ont réellement obtenu. »",
          "## Trois autres biais à exploiter avec honnêteté",
          "- L'**aversion à la perte** : on souffre plus de perdre que l'on ne jouit de gagner. Un acquéreur qui a projeté sa vie dans le bien craint de le perdre ; rappelez-lui la rareté réelle, jamais inventée.",
          "- La **preuve sociale** : « neuf visites en deux semaines, deux retours sérieux » rassure autant le vendeur sur son prix que l'acquéreur sur son choix.",
          "- L'**engagement et la cohérence** : un acquéreur qui a dit oui à de petites étapes (offre écrite, rendez-vous notaire) tient plus facilement son engagement final.",
          "## Gérer l'écart prix affiché / offre",
          "Ne dites jamais « votre offre est ridicule » ni « votre prix est trop haut ». Opposez les **faits** et cherchez le **mouvement** : « À 305 000 €, voici trois ventes comparables qui situent le marché à 318 000 €. Où pouvons-nous nous retrouver ? »",
          "## Mini cas pratique",
          "Un acquéreur ouvre à **290 000 €** sur un bien affiché **329 000 €** (ancre très basse). Erreur : négocier à partir de 290 000 €. Bonne pratique : « Je transmets votre offre, c'est mon devoir. Mais regardons d'abord le marché : les biens comparables se sont vendus 315 à 322 000 €. Sur quelle base sérieuse pouvez-vous repartir ? » On **ré-ancre** avant de négocier.",
          "## Erreurs fréquentes",
          "- Laisser l'acquéreur imposer son ancre basse comme point de départ de la discussion.",
          "- Confondre marge de négociation sur un prix juste et décote d'un bien surévalué.",
          "- Attaquer de front l'attachement du vendeur au lieu de le reconnaître puis de recentrer sur les faits."
        ]
      },
      {
        "titre": "La technique des concessions et des contreparties",
        "contenu": [
          "Savoir **concéder** est le cœur du métier de négociateur. Mal mené, chaque geste affaiblit votre position ; bien mené, chaque geste construit l'accord.",
          "## Règle d'or : jamais de concession sans contrepartie",
          "Toute concession s'échange : « Je peux demander au vendeur un effort sur le prix, **si** de votre côté vous raccourcissez le délai et signez vite. » Une concession donnée gratuitement est perçue comme l'aveu que le prix était gonflé — et appelle aussitôt la concession suivante.",
          "## Les concessions décroissantes",
          "Lâchez par **paliers de plus en plus petits** : 6 000 €, puis 2 500 €, puis 1 000 €. Le message implicite est clair : on **approche de la limite**. Des concessions égales ou croissantes, au contraire, signalent qu'il reste de la marge et relancent la surenchère.",
          "## Garder une réserve",
          "Ne dévoilez jamais d'emblée le prix plancher du vendeur ni le plafond de l'acquéreur. Gardez une **petite réserve** pour le geste final qui emporte la décision (« je retourne défendre ça auprès du vendeur une dernière fois »).",
          "## Les contreparties non financières",
          "Quand le prix bloque, jouez sur les **autres variables**, souvent plus faciles à accorder que des euros :",
          "- **Délai de signature** raccourci ou allongé selon le besoin de chacun.",
          "- **Date de libération** : jouissance anticipée ou différée.",
          "- **Meubles et équipements** (cuisine, électroménager, abri de jardin) laissés ou repris.",
          "- **Petits travaux** ou reprise de désordres pris en charge par le vendeur.",
          "- **Conditions suspensives** allégées côté acquéreur (dossier de financement déjà bouclé, délai d'obtention du prêt raccourci).",
          "## Le vocabulaire de l'échange",
          "- « Si… alors… » : « **Si** vous signez le compromis sous dix jours, **alors** je défends votre offre auprès du vendeur. »",
          "- Formulez toujours une concession comme un **effort négocié**, jamais comme un cadeau : « j'ai bataillé pour obtenir ça ».",
          "## Mini cas pratique",
          "Acquéreur campé à **315 000 €**, vendeur à **320 000 €**. Plutôt que de couper à 317 500 €, vous obtenez : vendeur à **318 000 €** contre **signature du compromis sous 8 jours** et **libération immédiate** (le vendeur étant déjà parti à Lyon). Chacun a gagné une contrepartie qui compte vraiment pour lui : l'accord tient mieux qu'un simple compromis arithmétique.",
          "## Erreurs fréquentes",
          "- Lâcher du prix sans rien demander en retour.",
          "- Faire des concessions de taille constante (« encore 5 000, encore 5 000 ») : vous entretenez la surenchère.",
          "- Tout jouer sur le prix en oubliant les variables qui débloquent sans rien coûter."
        ]
      },
      {
        "titre": "L'offre d'achat : cadre juridique et recueil",
        "contenu": [
          "La négociation se matérialise par l'**offre d'achat**. Bien la recueillir et la sécuriser juridiquement évite qu'un accord durement obtenu ne s'effondre.",
          "## Toujours par écrit",
          "Une offre **orale n'a aucune valeur** probante. Faites rédiger une **offre d'achat écrite**, qui doit préciser :",
          "- Le **prix proposé**, en distinguant clairement le **net vendeur** et le **prix FAI** (frais d'agence inclus).",
          "- La **désignation du bien** et l'**identité** de l'acquéreur.",
          "- La **durée de validité** de l'offre (en pratique **5 à 10 jours**).",
          "- Les **conditions** envisagées, au premier rang desquelles le **financement** (prêt, apport).",
          "## Obligation de transmettre les offres",
          "L'agent, mandaté par le vendeur, lui doit loyauté : il doit lui **transmettre toutes les offres écrites** reçues, y compris celles qu'il juge trop basses. Trier les offres selon son propre jugement, ou en dissimuler une, est une faute professionnelle qui engage sa responsabilité.",
          "## Aucune somme à l'appui de l'offre",
          "Au stade de l'offre d'achat, **ne recevez aucun versement** de l'acquéreur. Le **dépôt de garantie** (séquestre), généralement de **5 à 10 % du prix**, n'intervient qu'à la signature du compromis et doit être détenu par le **notaire**, ou par un professionnel disposant d'une **garantie financière** et habilité au maniement de fonds (loi Hoguet).",
          "## L'offre « au prix » : la nuance juridique essentielle",
          "Lorsqu'un acquéreur offre **exactement le prix et aux conditions du mandat**, l'article **1583 du Code civil** rappelle que la vente est « parfaite » dès l'accord sur la chose et sur le prix. Mais attention : cette perfection suppose le **consentement du vendeur**.",
          "- Sous un **mandat simple**, l'agent est seulement chargé de **trouver un acquéreur**, pas de vendre à la place du propriétaire : une offre au prix **ne force pas** la vente, le vendeur reste libre de l'accepter ou non.",
          "- Refuser une offre au prix peut toutefois, selon les clauses du mandat, exposer le vendeur à devoir la **commission** à l'agence. D'où l'importance de bien lui présenter l'offre et de **sécuriser l'accord par écrit**.",
          "## Les conditions suspensives",
          "L'offre acceptée débouche sur un **compromis** (voir le module dédié). Deux mécanismes structurent la négociation :",
          "- **Condition suspensive de prêt** (loi Scrivener, art. **L313-41** du Code de la consommation) : elle protège l'acquéreur qui finance à crédit ; sa **durée minimale légale est d'un mois** (en pratique 45 à 60 jours). Si le prêt est refusé dans les règles, l'acquéreur récupère son dépôt de garantie.",
          "- **Renonciation au prêt** : un acquéreur qui achète comptant doit porter une **mention manuscrite** de renonciation au bénéfice de cette condition (art. **L313-42**), sans quoi la condition de prêt est réputée s'appliquer.",
          "## Les délais à connaître",
          "- **Délai de rétractation de l'acquéreur** : **10 jours** (art. **L271-1** du Code de la construction et de l'habitation), à compter du lendemain de la première présentation de la notification de l'avant-contrat. L'acquéreur non professionnel se rétracte **sans motif** ni pénalité ; le **vendeur**, lui, ne dispose pas de ce droit.",
          "- **Délai compromis → acte authentique** : en moyenne **2,5 à 3 mois**, le temps de purger les conditions suspensives et le droit de préemption, et d'obtenir le prêt.",
          "## Mini cas pratique",
          "Un acquéreur veut « bloquer » le bien et propose de verser 5 000 € à l'agence « pour prouver son sérieux ». Réponse : « C'est interdit, et c'est aussi votre protection. Votre sérieux se prouve par une **offre écrite** et votre **accord de principe bancaire** ; le dépôt de garantie se versera chez le notaire, au compromis. »",
          "## Erreurs fréquentes",
          "- Se contenter d'un accord oral : « on est d'accord à 318 » qui s'évapore le lendemain.",
          "- Oublier de distinguer **net vendeur** et **FAI** : on se croit d'accord, mais pas sur le même chiffre.",
          "- Encaisser une somme au stade de l'offre : faute grave."
        ]
      },
      {
        "titre": "Mener la négociation côté acquéreur",
        "contenu": [
          "L'acquéreur annonce rarement d'emblée son vrai budget. Votre travail : faire émerger son **plafond réel** et transformer une intention en **offre écrite ferme**.",
          "## Qualifier avant de négocier",
          "- Validez le **financement** (apport, accord de principe, mensualité supportable, taux d'endettement) : on ne négocie pas durement pour un acquéreur qui ne suivra pas à la banque.",
          "- Cernez sa **motivation** et son **délai** : un acquéreur avec un préavis de location, un prêt relais ou un coup de cœur a une marge plus large qu'il ne le dit.",
          "## Intégrer les frais au budget réel",
          "Le plafond réel de l'acquéreur, c'est le prix **plus les frais de notaire** : de l'ordre de **7 à 8 % dans l'ancien** (un peu plus depuis 2025 dans les départements ayant relevé les droits de mutation) contre **2 à 3 % dans le neuf**. Aider l'acquéreur à raisonner en coût total évite les mauvaises surprises et crédibilise votre conseil.",
          "## Faire monter une offre basse",
          "- **Accueillir sans juger** : « Merci, je transmets. Avant cela, regardons ensemble le marché. »",
          "- **Ré-ancrer sur les DVF** : les faits, pas l'affichage ni l'ancre basse.",
          "- **Chercher le mouvement par la contrepartie** : « Si le vendeur fait un geste, jusqu'où pouvez-vous aller ? » — la question ouvre presque toujours une marge.",
          "- **Relativiser l'écart** : « Ce bien vous plaît vraiment. 6 000 € de plus sur un prêt de 20 ans, c'est quelques euros par mois — et c'est le bien que vous voulez. »",
          "## La peur de perdre (FOMO), mais honnête",
          "Sur un bien qui plaît, rappelez la **rareté réelle** sans jamais bluffer : « Ce type de bien part vite sur le secteur, et une autre visite est prévue samedi. » La peur de rater est un moteur puissant **quand elle est vraie** ; une rareté inventée se retourne contre vous dès qu'elle est éventée.",
          "## Verrouiller l'offre écrite",
          "Dès l'accord de principe : « Je rédige votre offre au prix convenu, avec votre condition de prêt. Vous la signez, je la défends ce soir auprès du vendeur. » Une intention orale ne vaut rien ; une **offre écrite** engage et accélère.",
          "## Mini cas pratique",
          "Couple en coup de cœur sur un T4 à Martigues affiché **239 000 €**, qui ouvre à **220 000 €**. Financement validé jusqu'à 235 000 €. Vous ré-ancrez sur les DVF (T4 comparables à 232-240 000 €), reconnaissez le coup de cœur, puis : « Le vendeur n'ira pas à 220. À **232 000 €**, avec une signature rapide, je pense pouvoir conclure. On part là-dessus ? » Offre écrite à 232 000 € signée le soir même.",
          "## Erreurs fréquentes",
          "- Négocier avant d'avoir validé le financement.",
          "- Prendre la première offre pour le plafond.",
          "- Brandir une fausse urgence : elle détruit la confiance dès qu'elle est éventée."
        ]
      },
      {
        "titre": "Mener la négociation côté vendeur",
        "contenu": [
          "Côté vendeur, l'enjeu est de **présenter l'offre avec son contexte** et de faire accepter un prix de marché malgré l'attachement et les attentes.",
          "## Présenter une offre, jamais un simple chiffre",
          "Une offre ne se résume pas à un montant. Présentez systématiquement :",
          "- L'**acquéreur** : financé, sérieux, motivé, avec son délai.",
          "- La **solidité du dossier** : accord de principe bancaire, apport, peu de conditions suspensives.",
          "- Le **contexte marché** : retours de visites, comparables DVF, durée de mise en vente.",
          "Une offre un peu plus basse mais **sûre et rapide** vaut souvent mieux qu'une offre haute et fragile qui s'effondrera au financement.",
          "## Le vrai prix plancher : raisonner net dans la poche",
          "Le plancher du vendeur n'est pas le prix affiché, c'est ce qu'il **touche réellement**. De son prix, on déduit les honoraires s'ils sont à sa charge, le capital restant dû d'un prêt, et, si le bien n'est **pas sa résidence principale**, la **plus-value des particuliers**.",
          "- La résidence principale est **totalement exonérée** de plus-value.",
          "- Pour un investissement ou une résidence secondaire, la plus-value est taxée à **19 % d'impôt sur le revenu + 17,2 % de prélèvements sociaux**, avec des abattements pour durée de détention (exonération d'impôt sur le revenu à **22 ans**, de prélèvements sociaux à **30 ans**) et une surtaxe au-delà de **50 000 €** de plus-value imposable.",
          "- Connaître ce net réel vous évite de négocier dans le vide : un vendeur peut refuser 300 000 € non par déraison, mais parce qu'il ne lui resterait pas assez net pour son projet.",
          "## Combattre l'effet de dotation",
          "Le vendeur surévalue souvent son bien (voir la leçon sur la psychologie du prix). Recentrez sur les faits : « Depuis 7 semaines, 9 visites et 1 offre sérieuse. Le marché vous dit quelque chose. Cette offre finançable sécurise votre projet lyonnais dans les délais. »",
          "## La contre-proposition",
          "Face à un écart, ne répondez jamais « non » sec. Proposez une **contre-offre argumentée** et cherchez les contreparties : « Le vendeur ne peut pas descendre à 310, mais à **318 000 €** il laisse la cuisine équipée et libère sous 30 jours. »",
          "## La révision de prix sur un bien qui stagne",
          "Un bien sans offre après **4 à 6 semaines** (passé le pic d'intérêt des premières semaines, voir le module Estimation) appelle une **révision de prix**, pas une énième baisse symbolique :",
          "- Appuyez-vous sur les **chiffres de commercialisation** : nombre de vues, de visites, de retours. Dans l'application, le **bilan de commercialisation** matérialise ces données face au vendeur.",
          "- Visez un **ajustement significatif** qui repasse un seuil de recherche (de 329 000 € à **319 000 €** pour capter les acquéreurs qui plafonnent à 320 000 €), plutôt que trois baisses de 3 000 € qui installent le doute.",
          "## Mini cas pratique",
          "Vendeur muté à Lyon, bien affiché **329 000 €**, offre sérieuse et financée à **316 000 €**. Vous présentez l'acquéreur (primo-accédant, prêt validé, signature rapide), rappelez le délai du vendeur et proposez une contre-offre à **320 000 €** avec libération immédiate. Accord à **319 000 €**. Le vendeur sécurise son calendrier ; l'agence a défendu le prix sans casser la vente.",
          "## Erreurs fréquentes",
          "- Transmettre une offre « à sec », sans contexte ni présentation de l'acquéreur : le vendeur ne voit qu'un chiffre décevant.",
          "- Multiplier les micro-baisses de prix au lieu d'un repositionnement net et argumenté.",
          "- Accepter une offre haute mais non financée qui fera perdre des semaines, parfois le bien."
        ]
      },
      {
        "titre": "Les leviers factuels : DPE, diagnostics et travaux",
        "contenu": [
          "Les meilleurs arguments de négociation ne sont pas des opinions : ce sont des **faits opposables**. Le DPE, les diagnostics et le chiffrage des travaux sont les critères objectifs qui font bouger un prix sans bras de fer.",
          "## Le DPE, désormais opposable",
          "Depuis le **1er juillet 2021**, le **DPE** (diagnostic de performance énergétique) est **opposable** : l'acquéreur ou le locataire peut se retourner contre le vendeur ou le bailleur si le classement est erroné. Son étiquette (de A à G) est devenue un vrai critère de prix.",
          "## Le calendrier de la décence énergétique",
          "La loi Climat et Résilience interdit progressivement la **location** des logements les plus énergivores (France métropolitaine) :",
          "- Les logements classés **G** sont interdits à la location depuis le **1er janvier 2025**.",
          "- Les logements classés **F** le seront au **1er janvier 2028**.",
          "- Les logements classés **E** le seront au **1er janvier 2034**.",
          "- Depuis le **24 août 2022**, les loyers des logements classés **F et G sont gelés** : le bailleur ne peut plus les augmenter ni les réviser.",
          "## Ce que cela change dans la négociation",
          "- Face à un **investisseur**, un bien classé F ou G est un levier de baisse légitime : il devra financer des travaux pour pouvoir louer, et un bien G ne peut déjà plus être mis en location.",
          "- Chiffrez l'argument plutôt que de le subir : « Oui, le DPE est en F. Le coût de rénovation pour atteindre la classe E est estimé à X € ; le prix en tient déjà compte. »",
          "- Pour la **vente** d'une maison classée **F ou G**, un **audit énergétique** réglementaire est obligatoire depuis le **1er avril 2023** (étendu à la classe E au 1er janvier 2025) : il chiffre les travaux et sert de base factuelle à la discussion.",
          "## Les travaux : chiffrer, ne jamais estimer à la louche",
          "Un acquéreur gonfle presque toujours le coût des travaux pour négocier. Opposez un **chiffrage réel** (devis, coût au m²) et comparez au prix d'un bien équivalent déjà rénové : souvent, le bien à rénover reste gagnant une fois les travaux intégrés.",
          "## Les diagnostics comme base objective",
          "Le dossier de diagnostics (amiante, plomb, électricité, gaz, termites selon les zones, état des risques) révèle parfois des points réels. Traités en amont, ils deviennent des faits maîtrisés ; découverts en cours de négociation, ils cassent la confiance et le prix.",
          "## Mini cas pratique",
          "Maison à Martigues classée **F**, affichée **329 000 €**. L'acquéreur annonce « 40 000 € de travaux » pour négocier. L'audit énergétique chiffre la rénovation réelle à **22 000 €**. Vous recadrez : « Le marché d'un équivalent rénové est à 345 000 €. À 319 000 € plus 22 000 € d'audit, vous êtes à 341 000 € et vous choisissez vos matériaux. » L'argument travaux, chiffré, redevient gérable.",
          "## Erreurs fréquentes",
          "- Subir l'argument travaux sans le chiffrer : l'acquéreur fixe seul le montant de la décote.",
          "- Ignorer le DPE face à un investisseur : vous passez à côté du vrai sujet, la capacité à louer le bien.",
          "- Confondre interdiction de **location** et interdiction de **vente** : un bien classé G se **vend** librement, il ne se **loue** plus."
        ]
      },
      {
        "titre": "Gérer les offres multiples et la surenchère",
        "contenu": [
          "Sur un bien au juste prix dans un secteur tendu, vous recevrez parfois **plusieurs offres en même temps**. Bien gérée, cette situation sécurise le meilleur accord ; mal gérée, elle détruit la confiance et expose l'agence.",
          "## Transparence et loyauté avant tout",
          "Toutes les offres écrites se transmettent au vendeur. Vous pouvez organiser la concurrence, mais **sans mentir** : pas de fausse offre, pas de faux acquéreur, pas de montant inventé pour faire monter les enchères. Le bluff découvert fait tomber la vente et engage votre responsabilité.",
          "## Comparer les offres sur plus que le prix",
          "La meilleure offre n'est pas toujours la plus haute. Comparez :",
          "- Le **prix** net vendeur.",
          "- La **solidité du financement** (apport, accord de principe, achat comptant).",
          "- Les **conditions suspensives** et leur nombre.",
          "- Le **délai** de signature et la souplesse sur la date de libération.",
          "## Organiser une consultation loyale",
          "Quand plusieurs acquéreurs se positionnent, une pratique saine consiste à leur demander à chacun leur **meilleure offre écrite pour une date donnée**, puis à les présenter toutes au vendeur, qui choisit. Chacun sait qu'il y a de la concurrence, personne n'est trompé.",
          "## Attention à la fausse bonne affaire pour le vendeur",
          "Pousser le prix trop haut par la surenchère peut se retourner contre le vendeur : une offre gonflée au-delà de la valeur risque de **buter sur l'estimation de la banque** de l'acquéreur, qui ne financera pas au-dessus du marché. Le compromis tombe, et des semaines sont perdues.",
          "## Le rôle du vendeur reste souverain",
          "Même avec une offre au prix, sous mandat simple, c'est le vendeur qui tranche (voir la leçon sur l'offre d'achat). Votre rôle est de l'éclairer : la plus solide, et pas seulement la plus haute, est souvent la plus sûre.",
          "## Mini cas pratique",
          "Deux offres sur un T3 à Martigues affiché **215 000 €** : l'une à **219 000 €** avec prêt à monter et deux conditions suspensives, l'autre à **214 000 €** comptant, sans condition, signature sous trois semaines. Vous présentez les deux au vendeur en explicitant le risque de la première. Il retient l'offre comptant : moins haute de 5 000 €, mais **certaine et rapide**.",
          "## Erreurs fréquentes",
          "- Inventer une offre concurrente pour faire monter un acquéreur : faute grave et vente fragilisée.",
          "- Ne retenir que le montant le plus élevé sans regarder le financement.",
          "- Laisser filer une surenchère au-delà de la valeur bancaire, puis voir le compromis s'effondrer."
        ]
      },
      {
        "titre": "Défendre ses honoraires sans les brader",
        "contenu": [
          "La négociation la plus mal préparée de l'agent est souvent celle de ses **propres honoraires**. Un professionnel qui brade sa commission à la première pression a mal vendu sa valeur en amont.",
          "## Un cadre légal précis",
          "Les honoraires sont **libres** (il n'existe pas de barème imposé par la loi), mais ils doivent être **affichés** et portés à la connaissance du public : barème en agence, sur le site et dans les annonces (loi Hoguet, affichage encadré par le **décret n° 2016-173**). Le mandat précise qui les supporte (charge vendeur ou charge acquéreur) et leur montant.",
          "## La commission se défend par la valeur, pas par la remise",
          "Face à « vos honoraires sont trop élevés », on ne baisse pas d'emblée : on **rappelle ce qu'ils financent** — estimation juste, diffusion, visites qualifiées, négociation, sécurisation juridique, suivi jusqu'à l'acte.",
          "- « Mon travail, c'est justement de vous faire gagner, sur le prix de vente, bien plus que le montant de mes honoraires. »",
          "- « Un mandat **exclusif** bien défendu se vend souvent plus cher et plus vite qu'un bien dispersé sur dix vitrines. »",
          "## Si vous devez concéder, échangez",
          "Une remise d'honoraires suit la même règle d'or que toute concession : **jamais sans contrepartie**. En échange d'un geste, obtenez un **mandat exclusif**, une **durée d'exclusivité** suffisante ou un **prix de départ réaliste**.",
          "## Honoraires charge vendeur ou charge acquéreur ?",
          "Le choix a un effet concret sur la négociation : en charge acquéreur, les honoraires s'ajoutent au prix net et pèsent sur les frais de notaire de l'acquéreur ; en charge vendeur, ils se déduisent de son net. Savoir basculer de l'un à l'autre est parfois la clé qui débloque un accord sur le net vendeur.",
          "## Mini cas pratique",
          "Un vendeur demande de passer les honoraires de 5 % à 3 % « sinon il part à la concurrence ». Réponse : « Je comprends. Mes honoraires financent une vente sécurisée au meilleur prix. Si vous me confiez un **mandat exclusif de trois mois**, je peux revoir ma rémunération et concentrer tous mes moyens sur votre bien. » La concession devient un échange, pas une capitulation.",
          "## Erreurs fréquentes",
          "- Baisser ses honoraires dès la première objection, sans rien obtenir en retour.",
          "- Ne pas afficher clairement son barème : au-delà du risque de sanction, c'est un aveu de fragilité.",
          "- Vendre un prix de mandat plutôt qu'une valeur de service : on se fait alors comparer sur le seul pourcentage."
        ]
      },
      {
        "titre": "Traiter les objections et blocages en négociation",
        "contenu": [
          "En négociation, une objection n'est pas un refus : c'est un **signal d'intérêt** et une demande de réassurance. Un client indifférent ne négocie pas. (Pour la maîtrise complète de la méthode, voir le module **Vaincre les objections**.)",
          "## La trame : écouter, reformuler, répondre, vérifier",
          "- **Écouter** sans couper : laissez l'objection s'exprimer entièrement.",
          "- **Reformuler et creuser** : « Qu'est-ce qui vous fait dire cela ? », « Trop cher par rapport à quoi ? » — on isole le **vrai frein**.",
          "- **Répondre par la preuve** : comparables DVF, chiffrage des travaux, retours de visites — jamais une opinion.",
          "- **Vérifier** : « Ce point est clair ? On peut avancer ? »",
          "## Les objections de négociation les plus fréquentes",
          "- « **C'est trop cher.** » : creuser, ré-ancrer sur le marché réel, puis relativiser l'écart (« 6 000 € sur un prêt de 20 ans, c'est quelques euros par mois »).",
          "- « **Il y a des travaux.** » : chiffrer factuellement et comparer au prix d'un bien équivalent déjà rénové ; souvent le bien à rénover reste gagnant.",
          "- « **Je vais réfléchir.** » : identifier le frein caché (prix ? financement ? conjoint ? doute sur le bien ?) et **fixer une échéance datée**, jamais « rappelez-moi quand vous voulez ».",
          "- « **Le vendeur ne descendra jamais.** » (côté acquéreur) : « Laissez-moi le travailler avec votre offre écrite ; sans offre formelle, je n'ai rien à défendre. »",
          "## La règle cardinale",
          "Ne **contredisez jamais frontalement**. Accueillez (« je comprends », « bonne question »), puis apportez la preuve. On ne gagne pas une négociation en ayant raison **contre** le client, mais en l'amenant à la **bonne décision**.",
          "## Mini cas pratique",
          "Acquéreur : « C'est trop cher, et il y a la salle de bains à refaire. » Vous : « Qu'avez-vous chiffré pour la salle de bains ? » — « Environ 8 000 €. » — « Un bien équivalent déjà rénové dans le secteur se vend 335 000 €. Ici, à 319 000 € plus 8 000 € de travaux, vous êtes à 327 000 € et vous choisissez vos matériaux. Sur quelle base pouvons-nous avancer ? » L'objection devient un **argument de valeur**.",
          "## Erreurs fréquentes",
          "- Traiter une objection qu'on n'a pas comprise : on répond à côté.",
          "- Contredire le client au lieu d'opposer des faits.",
          "- Lâcher du prix dès la première objection, par réflexe, au lieu de creuser."
        ]
      },
      {
        "titre": "Conclure, verrouiller et sécuriser l'accord",
        "contenu": [
          "Un accord obtenu oralement et laissé « reposer » est un accord qui meurt. La dernière phase consiste à **verrouiller** vite et proprement. (Pour les techniques de conclusion, voir le module **Conclure la vente**.)",
          "## Repérer le moment de conclure",
          "Dès les **signaux d'accord** — l'acquéreur se projette (« où mettrait-on le canapé ? »), demande les modalités ou la date d'entrée ; le vendeur interroge le délai de signature — **arrêtez d'argumenter** et engagez la conclusion. Continuer à vendre quand c'est gagné recrée des objections.",
          "## Verrouiller par écrit, immédiatement",
          "- Récapitulez **par écrit** : prix (net vendeur ET FAI), conditions, calendrier, contreparties négociées (meubles, date de libération).",
          "- Transformez l'accord en **offre d'achat signée**, puis enchaînez sur le **compromis** sans laisser passer les jours : le temps est l'ennemi de la vente conclue.",
          "## Sécuriser juridiquement",
          "- Vérifiez la **condition suspensive de prêt** et son délai (voir la leçon sur l'offre d'achat).",
          "- Informez l'acquéreur de son **délai de rétractation de 10 jours** : le lui expliquer, loin de l'inquiéter, le rassure et crédibilise votre process.",
          "- Rappelez que le **dépôt de garantie** (5 à 10 %) se verse chez le notaire, au compromis.",
          "## Viser un accord qui tient",
          "Un accord **gagnant-gagnant** résiste jusqu'à l'acte : les deux parties l'ont choisi et le défendent. Un vendeur ou un acquéreur qui se sent perdant cherchera la faille (rétractation, condition non levée, renégociation de dernière minute avant l'acte).",
          "## Soigner l'entre-deux (compromis → acte)",
          "Les 2,5 à 3 mois jusqu'à l'acte sont une zone à risque. **Gardez le lien** avec les deux parties, suivez l'**obtention du prêt**, anticipez les points de blocage (purge du droit de préemption urbain, levée des conditions). Un accord n'est définitif qu'à la **signature chez le notaire**.",
          "## Mini cas pratique",
          "Accord verbal à **319 000 €** un vendredi soir. Erreur : « on signera le compromis la semaine prochaine ». Bonne pratique : offre écrite signée **le soir même**, récapitulatif adressé aux deux parties, rendez-vous notaire **calé sous 10 jours**. L'acquéreur, informé de ses 10 jours de rétractation, se sent respecté. L'accord est verrouillé avant que le doute du week-end ne s'installe.",
          "## Erreurs fréquentes",
          "- Laisser « reposer » un accord oral : il s'évapore.",
          "- Négliger le suivi entre compromis et acte : une condition non suivie fait tomber la vente.",
          "- Oublier d'acter par écrit les contreparties (meubles, date de libération) : elles deviennent des litiges."
        ]
      }
    ],
    "quiz": [
      {
        "question": "La négociation réussie se joue d'abord…",
        "options": [
          "Au moment de présenter l'offre",
          "Dans la préparation (motivation, marges, comparables)",
          "Sur le prix uniquement",
          "Chez le notaire"
        ],
        "correct": 1,
        "explication": "Environ 80 % d'une négociation se gagne avant le premier échange : informations sur chaque partie, ZOPA, marges de manœuvre et MESORE préparées, comparables DVF en main."
      },
      {
        "question": "Raisonner « intérêts plutôt que positions » (méthode de Harvard) signifie…",
        "options": [
          "Camper sur son chiffre",
          "Chercher le besoin réel derrière la position affichée",
          "Couper systématiquement la poire en deux",
          "Imposer un critère au client"
        ],
        "correct": 1,
        "explication": "Derrière « je ne descends pas sous 320 000 € » se cache souvent un intérêt (« il me faut 300 000 € net ») que l'on peut satisfaire autrement, sans bloquer sur le chiffre affiché."
      },
      {
        "question": "La règle d'or des concessions est…",
        "options": [
          "Concéder vite pour rassurer",
          "Ne jamais concéder sans obtenir une contrepartie",
          "Faire des concessions de taille toujours égale",
          "Annoncer d'emblée son prix plancher"
        ],
        "correct": 1,
        "explication": "Une concession gratuite affaiblit la position et appelle la suivante. On échange toujours (« si… alors… »), par paliers décroissants qui signalent qu'on approche de la limite."
      },
      {
        "question": "Toute offre d'achat écrite reçue doit être…",
        "options": [
          "Filtrée selon son montant",
          "Transmise au vendeur",
          "Écartée si elle est jugée trop basse",
          "Accompagnée d'un versement de l'acquéreur"
        ],
        "correct": 1,
        "explication": "L'agent, mandaté par le vendeur, doit lui transmettre toutes les offres écrites, même basses. Et aucune somme ne peut être perçue de l'acquéreur au stade de l'offre."
      },
      {
        "question": "Entre deux offres, le professionnel privilégie souvent…",
        "options": [
          "La plus haute, toujours",
          "La plus sûre et financée, même un peu plus basse",
          "La plus rapide sans vérifier le financement",
          "Peu importe le dossier"
        ],
        "correct": 1,
        "explication": "Une offre financée et solide sécurise la vente ; une offre haute mais fragile tombe souvent au financement, ou bute sur l'estimation de la banque, et fait perdre des semaines, parfois le bien."
      },
      {
        "question": "Le délai de rétractation de l'acquéreur non professionnel (art. L271-1 du CCH) est de…",
        "options": [
          "48 heures",
          "7 jours",
          "10 jours",
          "1 mois"
        ],
        "correct": 2,
        "explication": "L'acquéreur dispose de 10 jours pour se rétracter sans motif, à compter du lendemain de la 1re présentation de la notification de l'avant-contrat. Le vendeur, lui, n'a pas ce droit."
      },
      {
        "question": "La ZOPA (zone d'accord possible) correspond...",
        "options": [
          "au montant des honoraires de l'agence",
          "a l'espace compris entre le prix plancher du vendeur et le plafond de l'acquereur",
          "au delai legal de retractation de l'acquereur",
          "a la marge de l'agence sur une vente"
        ],
        "correct": 1,
        "explication": "La ZOPA est la zone de recouvrement entre le plancher du vendeur et le plafond de l'acquereur ; sans recouvrement, aucune technique ne cree l'accord."
      },
      {
        "question": "La MESORE (ou BATNA) d'une partie designe...",
        "options": [
          "sa meilleure solution de repli si la negociation echoue",
          "la commission minimale de l'agent",
          "le prix affiche dans l'annonce",
          "la duree de validite de l'offre d'achat"
        ],
        "correct": 0,
        "explication": "La MESORE est ce que chaque partie fera si la negociation n'aboutit pas ; une MESORE forte donne une position de negociation haute."
      },
      {
        "question": "L'effet d'ancrage, en negociation, signifie que...",
        "options": [
          "le dernier chiffre enonce est toujours ignore",
          "le premier chiffre enonce fixe le cadre de toute la discussion",
          "le prix ne peut jamais evoluer apres l'affichage",
          "l'acquereur doit toujours parler en premier"
        ],
        "correct": 1,
        "explication": "Le premier chiffre sert d'ancre ; face a une offre tres basse, on re-ancre aussitot sur les comparables DVF."
      },
      {
        "question": "L'effet de dotation explique pourquoi...",
        "options": [
          "un acquereur sous-evalue systematiquement un bien",
          "les frais de notaire baissent dans le neuf",
          "un proprietaire a tendance a surevaluer son bien parce qu'il lui appartient",
          "la banque refuse de financer un bien"
        ],
        "correct": 2,
        "explication": "L'effet de dotation pousse le vendeur a surevaluer son bien ; on le recentre sur les faits (comparables, retours de visites)."
      },
      {
        "question": "En 2025, la marge de negociation moyenne au niveau national se situe autour de...",
        "options": [
          "1 a 2 %",
          "8 a 10 %",
          "20 a 25 %",
          "0 %, les biens se vendant au prix"
        ],
        "correct": 1,
        "explication": "Longtemps autour de 5 %, la marge s'est elargie a environ 8 a 10 % en 2025, davantage sur les maisons que sur les appartements."
      },
      {
        "question": "Pour signaler qu'on approche de sa limite, les concessions doivent etre accordees...",
        "options": [
          "par paliers de plus en plus petits (decroissants)",
          "par paliers egaux a chaque fois",
          "par paliers de plus en plus grands",
          "toutes en une seule fois"
        ],
        "correct": 0,
        "explication": "Des concessions decroissantes (6 000, puis 2 500, puis 1 000 euros) signalent qu'on approche de la limite ; des paliers egaux ou croissants relancent la surenchere."
      },
      {
        "question": "Au stade de l'offre d'achat, l'agent immobilier...",
        "options": [
          "encaisse un acompte de 10 % pour bloquer le bien",
          "ne doit recevoir aucun versement de l'acquereur",
          "verse lui-meme le depot de garantie",
          "exige un cheque de caution encaisse immediatement"
        ],
        "correct": 1,
        "explication": "Aucune somme ne se verse au stade de l'offre ; le depot de garantie n'intervient qu'au compromis et se detient chez le notaire."
      },
      {
        "question": "Lorsqu'un acquereur offre exactement le prix et les conditions du mandat, sous un mandat simple...",
        "options": [
          "la vente est automatiquement conclue sans l'accord du vendeur",
          "le vendeur reste libre d'accepter ou non l'offre",
          "l'agent peut signer le compromis a la place du vendeur",
          "l'acquereur devient immediatement proprietaire"
        ],
        "correct": 1,
        "explication": "Sous mandat simple, l'agent est charge de trouver un acquereur, pas de vendre ; une offre au prix ne force pas la vente, le vendeur garde son consentement."
      },
      {
        "question": "La duree minimale legale de la condition suspensive d'obtention de pret (loi Scrivener) est de...",
        "options": [
          "8 jours",
          "un mois",
          "six mois",
          "un an"
        ],
        "correct": 1,
        "explication": "La duree minimale legale est d'un mois (art. L313-41 du Code de la consommation), en pratique 45 a 60 jours."
      },
      {
        "question": "Un acquereur qui achete comptant et renonce a la condition suspensive de pret doit...",
        "options": [
          "obtenir l'accord ecrit de la banque",
          "porter une mention manuscrite de renonciation (art. L313-42)",
          "verser 20 % du prix a l'agence",
          "attendre 10 jours supplementaires"
        ],
        "correct": 1,
        "explication": "Sans mention manuscrite de renonciation, la condition suspensive de pret est reputee s'appliquer malgre un achat comptant."
      },
      {
        "question": "Les frais de notaire (droits de mutation et frais) representent, dans l'ancien, de l'ordre de...",
        "options": [
          "1 a 2 % du prix",
          "7 a 8 % du prix, contre 2 a 3 % dans le neuf",
          "15 % du prix",
          "le meme taux que dans le neuf"
        ],
        "correct": 1,
        "explication": "Dans l'ancien, les frais tournent autour de 7 a 8 % (un peu plus depuis 2025 dans les departements ayant releve les droits), contre 2 a 3 % dans le neuf."
      },
      {
        "question": "La vente de la residence principale du vendeur est, au titre de la plus-value des particuliers...",
        "options": [
          "taxee a 36,2 %",
          "totalement exoneree",
          "taxee uniquement apres 22 ans de detention",
          "soumise a une surtaxe automatique"
        ],
        "correct": 1,
        "explication": "La residence principale est totalement exoneree de plus-value ; la taxation (19 % + 17,2 %) ne concerne que les autres biens."
      },
      {
        "question": "Une negociation integrative consiste a...",
        "options": [
          "se battre uniquement sur le prix, variable fixe",
          "ajouter des variables (delai, meubles, date de liberation, travaux) pour creer de la valeur des deux cotes",
          "imposer son prix sans discuter",
          "refuser toute concession"
        ],
        "correct": 1,
        "explication": "La negociation integrative agrandit le gateau en jouant sur d'autres variables que le seul prix, la ou le professionnel fait la difference."
      }
    ]
  },
  {
    "id": "vente-elite",
    "titre": "Vente d'élite : argumenter & persuader",
    "icone": "🏆",
    "categorie": "Commercial",
    "resume": "Persuasion et argumentation des vendeurs d'élite : émotion, CAP/SONCASE, principes de Cialdini, storytelling, congruence et persuasion éthique.",
    "duree": "39 min",
    "lecons": [
      {
        "titre": "Vendre de l'émotion, pas des caractéristiques",
        "contenu": [
          "Les meilleurs vendeurs ne vendent pas un produit : ils font **naître une envie**. En immobilier, on n'achète pas 90 m² et 3 chambres — on achète **un projet de vie**, une émotion, un statut, une sécurité.",
          "L'achat immobilier engage le plus gros budget d'une vie, et pourtant la décision se prend d'abord dans le **cerveau émotionnel**. La règle est universelle : **on achète avec l'émotion, puis on justifie avec la raison**. Votre métier n'est pas d'informer, c'est de **faire ressentir**, puis de fournir les preuves qui légitiment l'envie.",
          "## Les trois leviers des vendeurs d'élite",
          "- **Vendre une émotion** : faites ressentir le bien (« imaginez vos enfants qui jouent dans ce jardin le dimanche pendant que le barbecue chauffe »), au lieu de simplement décrire.",
          "- **Raconter une histoire** : l'histoire du quartier, de la maison, des anciens propriétaires heureux — le cerveau mémorise une histoire, jamais une fiche technique.",
          "- **Vendre de l'espoir, une projection** : montrez le **après**, la vie meilleure que ce bien rend possible.",
          "## Émotion d'abord, preuve ensuite",
          "La séquence gagnante est toujours la même : créer le **désir** (émotion, projection), puis seulement dérouler les **preuves** (DPE, factures, comparables) qui rassurent la partie rationnelle du cerveau.",
          "- Trop de chiffres avant l'émotion = un client qui compare froidement, pièce par pièce, euro par euro.",
          "- L'émotion crée l'adhésion ; la preuve la **sécurise** et prévient le remords de l'acheteur.",
          "## Transformer une caractéristique en émotion",
          "- « Exposition plein sud » devient « vous prendrez votre café au soleil toute l'année, même en plein hiver ».",
          "- « Cuisine ouverte de 25 m² » devient « vous cuisinez tout en restant avec vos invités, personne n'est isolé dans son coin ».",
          "- « À 5 minutes du port de Martigues » devient « l'apéritif les pieds dans l'eau le vendredi soir, sans reprendre la voiture ».",
          "## La conviction est contagieuse",
          "Un négociateur qui **croit** à son bien et à son prix transmet cette conviction. Si vous doutez d'un prix ou d'un argument, le client le ressent instantanément. L'enthousiasme sincère est votre premier outil de persuasion : il ne se simule pas, il se **prépare**.",
          "## Les mots qui font naître l'image mentale",
          "- Bannissez le jargon froid : « surface », « prestations », « configuration », « bien ».",
          "- Préférez les mots sensoriels et chaleureux : « lumineux », « cocon », « au calme », « plain-pied », « sans vis-à-vis ».",
          "- Parlez au présent et au « vous » : « vous recevez vos amis ici », « vous vous garez devant chez vous », jamais « on peut ».",
          "## Erreurs fréquentes à éviter",
          "- Réciter la fiche technique comme un inventaire (« alors : séjour, cuisine, trois chambres, garage… »).",
          "- Parler de soi ou de l'agence au lieu de parler du **projet du client**.",
          "- Noyer le client sous les chiffres avant d'avoir créé la moindre envie.",
          "- Servir le même argument à tout le monde, sans écouter ce qui fait vibrer CE client.",
          "## Mini cas pratique",
          "Un couple visite un T4 à Martigues, quartier de Jonquières. Au lieu d'annoncer « 85 m², trois chambres, balcon exposé ouest », dites : « Voici la chambre de votre fille, avec cette vue dégagée ; ici, votre bureau pour le télétravail ; et ce balcon à l'ouest, c'est votre coucher de soleil tous les soirs en rentrant. » Vous venez de vendre **une vie**, pas des mètres carrés."
        ]
      },
      {
        "titre": "La méthode CAP/SONCAS : l'argument qui porte",
        "contenu": [
          "Un argument qui porte suit la structure **CAP** et vise le **bon levier SONCAS** du client (levier identifié en phase de découverte, voir module Découverte & qualification).",
          "## CAP : Caractéristique → Avantage → Preuve",
          "- **C — Caractéristique** : le fait objectif, vérifiable (« double vitrage, isolation refaite en 2021 »).",
          "- **A — Avantage** : ce que ce fait apporte **au client** (« vous économisez sur le chauffage et la rue ne s'entend plus »).",
          "- **P — Preuve** : ce qui rend l'avantage crédible (DPE classe C, factures d'énergie, attestation d'artisan, témoignage, comparable DVF).",
          "Une caractéristique seule n'a aucune valeur commerciale : c'est l'**avantage prouvé** qui déclenche l'adhésion.",
          "## Le chaînon qui fait tout : la liaison",
          "Entre la caractéristique et l'avantage, glissez une **phrase de liaison** qui oblige à traduire le fait en bénéfice :",
          "- « … ce qui veut dire pour vous que… »",
          "- « … ce qui vous permet concrètement de… »",
          "- « … l'intérêt pour vous, c'est… »",
          "## SONCASE : brancher l'argument sur la motivation dominante",
          "Le même bien s'argumente différemment selon le moteur d'achat. Retenez le moyen mnémotechnique **SONCASE** :",
          "- **S — Sécurité** : « quartier calme, diagnostics à jour, aucun gros travaux à prévoir » + preuves.",
          "- **O — Orgueil** : « une adresse recherchée, un bien dont on est fier de donner l'adresse ».",
          "- **N — Nouveauté** : « cuisine refaite cette année, rien à toucher, vous êtes les premiers à en profiter ».",
          "- **C — Confort** : « plain-pied, tout accessible à pied, pas une marche ».",
          "- **A — Argent** : « sous le prix moyen du secteur, forte demande à la revente » + comparables DVF.",
          "- **S — Sympathie** : la relation, votre disponibilité, un interlocuteur de confiance.",
          "- **E — Écologie** : « DPE classe C, faibles charges, pas une passoire thermique » — levier devenu majeur depuis l'interdiction de louer les logements classés G (le 1er janvier 2025), étendue aux F le 1er janvier 2028 puis aux E le 1er janvier 2034.",
          "## Détecter le levier dominant",
          "- Écoutez les mots que le client répète : « tranquille » (Sécurité), « charges » (Argent / Écologie), « standing » (Orgueil).",
          "- Reformulez pour confirmer : « Si je comprends bien, ce qui compte avant tout pour vous, c'est de ne plus avoir de travaux, c'est bien ça ? »",
          "- Un bien a souvent deux leviers : visez le dominant, renforcez avec le secondaire.",
          "## Script CAP complet",
          "« Le chauffage est une pompe à chaleur installée en 2022 (caractéristique), ce qui veut dire pour vous des factures nettement réduites et un vrai confort été comme hiver (avantage), et voici les trois dernières factures ainsi que le DPE classe B qui le prouvent (preuve). »",
          "## Erreurs fréquentes à éviter",
          "- Enchaîner des caractéristiques sans jamais les traduire en avantages.",
          "- Avancer un avantage sans preuve : il sonne comme une promesse de vendeur.",
          "- Servir le même argumentaire SONCASE à tout le monde.",
          "## Mini cas pratique",
          "Un vendeur très « Argent » hésite à confier sa maison à Martigues. Construisez en CAP orienté Argent : « Nous diffusons sur les principaux portails et sur notre fichier d'acquéreurs locaux (C), ce qui vous permet de toucher très vite les acheteurs déjà prêts dans votre quartier, et donc de vendre au meilleur prix (A) ; voici nos ventes récentes dans ce secteur au prix ou au-dessus de l'estimation (P). »"
        ]
      },
      {
        "titre": "Les règles d'or de l'argumentation persuasive",
        "contenu": [
          "Inspirées des techniques des vendeurs d'élite, ces règles transforment une simple présentation en argumentation qui emporte la décision.",
          "## Les 7 règles",
          "- **1. Parler bénéfices, pas fonctions** : traduisez toujours une donnée en avantage concret pour CE client (méthode CAP).",
          "- **2. Prouver, toujours** : chiffres, comparables DVF, témoignages, documents. Une affirmation non prouvée est, pour le client, une affirmation suspecte.",
          "- **3. Impliquer le client** : faites-le participer (« projetez-vous : où mettriez-vous le canapé ? »). On adhère à ce qu'on a contribué à construire.",
          "- **4. Créer des images mentales** : le cerveau achète des images (« un cocon », « une bulle de calme en plein centre »).",
          "- **5. Un argument fort vaut mieux que dix faibles** : hiérarchisez, et gardez votre meilleur argument pour la fin.",
          "- **6. Poser des questions d'engagement** : « la luminosité, c'est important pour vous ? » → des petits « oui » qui préparent le grand oui.",
          "- **7. Maîtriser le rythme et le silence** : après un argument fort ou une question d'engagement, **taisez-vous**. Laissez l'argument infuser.",
          "## Le moyen mnémotechnique",
          "Pensez **BPIIHQS** : Bénéfices, Prouver, Impliquer, Images, Hiérarchiser, Questions, Silence. À relire avant chaque rendez-vous important.",
          "## Approfondir la règle de la preuve",
          "- Ayez toujours une **preuve à portée de main** : classeur DVF, captures d'avis Google, attestations, factures du vendeur.",
          "- La meilleure preuve est **datée, locale et chiffrée** : « vendu rue de la Résistance en mars, 3 150 €/m² » pèse bien plus que « le secteur est demandé ».",
          "## Approfondir l'implication",
          "- Transformez chaque monologue en dialogue : une question toutes les deux ou trois phrases.",
          "- Questions ouvertes pour faire parler, questions fermées pour faire valider.",
          "## Approfondir la hiérarchie des arguments",
          "- Ouvrez avec un argument fort (effet de primauté), placez les arguments secondaires au milieu, et **terminez par le plus fort** (effet de récence).",
          "- Ne videz jamais votre sac d'un coup : gardez une cartouche pour relancer si l'intérêt faiblit.",
          "## Erreurs fréquentes à éviter",
          "- Aligner dix arguments de force égale : le client ne retient rien.",
          "- Parler sans respirer, par peur du silence.",
          "- Argumenter sans jamais vérifier que le client suit et adhère.",
          "## Mini cas pratique",
          "Pour présenter une villa à Martigues à des acquéreurs hésitants : ouvrez par un argument fort (« emplacement rare, au calme et pourtant à 5 min des commerces »), impliquez (« vous voyez la terrasse d'ici ? »), prouvez (comparable DVF récent), puis **gardez le silence**. Terminez, au bon moment, par votre meilleure cartouche (« et surtout, zéro travaux : vous posez vos valises »)."
        ]
      },
      {
        "titre": "Les 6 principes de persuasion de Cialdini",
        "contenu": [
          "Le psychologue Robert Cialdini a identifié six leviers universels qui déclenchent le « oui ». Les vendeurs d'élite les activent — **avec éthique** : on persuade un client vers une bonne décision, on ne le manipule pas vers une mauvaise.",
          "## 1. La réciprocité",
          "On se sent redevable envers qui nous a donné quelque chose.",
          "- Offrez **avant** de demander : une estimation offerte et argumentée, des conseils de valorisation, une vraie disponibilité.",
          "- « Je vous ai préparé une étude de marché complète de votre rue, elle est pour vous quoi qu'il arrive. » → le vendeur se sentira naturellement enclin à vous confier son projet.",
          "## 2. L'engagement et la cohérence",
          "Nous aimons rester cohérents avec ce que nous avons dit ou fait.",
          "- Faites verbaliser de petits accords : « vous êtes d'accord qu'un bien bien présenté se vend mieux et plus vite ? ».",
          "- Un client qui a dit « oui » à vos principes aura du mal à dire « non » à leur conséquence logique.",
          "## 3. La preuve sociale",
          "On se fie à ce que font les autres, surtout nos semblables.",
          "- « Trois familles comme la vôtre ont acheté dans cette résidence cette année. »",
          "- Levier développé en détail dans la leçon suivante.",
          "## 4. L'autorité",
          "On suit l'avis de l'expert crédible.",
          "- Affichez votre expertise **sans arrogance** : connaissance fine du secteur, chiffres précis, carte professionnelle, enseigne reconnue.",
          "- « Sur Martigues, nous suivons chaque semaine l'évolution des prix quartier par quartier. » L'expertise démontrée rassure et fait autorité.",
          "## 5. La sympathie",
          "On dit oui plus facilement à qui l'on apprécie.",
          "- Créez un lien sincère : écoute, points communs, sourire, respect des engagements.",
          "- La sympathie ne se feint pas : elle naît d'un intérêt réel pour le projet du client.",
          "## 6. La rareté",
          "Ce qui est rare a plus de valeur ; la peur de perdre est plus forte que l'envie de gagner.",
          "- Soulignez ce qui rend le bien unique (vue, emplacement, absence d'équivalent sur le marché).",
          "- La rareté doit être **réelle** : annoncer une fausse pénurie détruit la confiance et peut constituer une pratique commerciale trompeuse sanctionnée par la loi.",
          "## Le 7e principe : l'unité",
          "Cialdini a ajouté l'**unité** : le sentiment d'appartenir au même groupe (« nous, gens du coin », « nous, parents »). Le « nous » crée une alliance qui désarme la méfiance.",
          "## Persuasion n'est pas manipulation",
          "- La persuasion éthique sert une décision que le client ne regrettera pas.",
          "- Si un principe vous sert à faire signer quelque chose de contraire à l'intérêt du client, vous manipulez — et vous détruisez votre réputation, votre bien le plus précieux.",
          "## Mini cas pratique",
          "Pour convaincre un propriétaire de vous confier son projet : réciprocité (étude offerte), autorité (vos chiffres du secteur), preuve sociale (vos ventes récentes dans la rue), engagement (« vous êtes d'accord qu'un seul interlocuteur, c'est plus clair ? »), sympathie (lien sincère) et unité (« entre Martégaux, on se comprend »). Six leviers, une adhésion."
        ]
      },
      {
        "titre": "Preuve sociale, témoignages & recommandation",
        "contenu": [
          "On se fie à ce que font les autres : la **preuve sociale** est l'un des accélérateurs de décision les plus puissants, côté vendeur comme côté acquéreur.",
          "## Les formes de preuve sociale",
          "- **Références locales** : « j'ai vendu trois biens dans cette rue cette année » ; les panneaux « Vendu » parlent pour vous.",
          "- **Témoignages et avis** : avis Google de l'agence, mots de clients satisfaits, captures d'écran — montrez-les, ne les racontez pas seulement.",
          "- **Chiffres de l'agence** : nombre de ventes, délai moyen de vente, part des biens vendus au prix sur le secteur.",
          "- **Effet de file d'attente** : « j'ai déjà deux acquéreurs à qui je dois présenter ce bien » — uniquement si c'est vrai.",
          "## Rendre la preuve crédible",
          "- Préférez le **précis au vague** : « 12 ventes à Martigues sur l'année » bat « nous vendons beaucoup » (utilisez vos chiffres réels).",
          "- Choisissez des témoins **semblables** au client : un primo-accédant est rassuré par l'histoire d'un autre primo-accédant.",
          "- Ayez vos preuves **physiquement sous la main** : classeur, tablette, book de l'agence.",
          "## La recommandation : votre meilleure source",
          "Un client satisfait vaut dix prospects froids. La recommandation se **provoque**, elle ne tombe pas du ciel.",
          "- **Demandez explicitement, au bon moment** (juste après un compromis signé, un client ravi) : « Si vous êtes content de mon travail, connaissez-vous quelqu'un qui envisage de vendre ou d'acheter ? »",
          "- **Facilitez le passage à l'acte** : « Transmettez simplement ma carte, ou donnez-moi un prénom et je prends contact avec délicatesse. »",
          "- **Remerciez et tenez informé** le recommandeur : il recommandera de nouveau.",
          "## Construire son capital de preuve sociale",
          "- Sollicitez un avis Google **systématiquement** après chaque vente réussie, tant que l'émotion est fraîche.",
          "- Demandez l'autorisation d'utiliser un témoignage écrit ou vidéo.",
          "- Tenez à jour un tableau de vos ventes par quartier : c'est votre munition de preuve.",
          "## Erreurs fréquentes à éviter",
          "- Inventer une rareté ou une file d'attente : mensonge vite démasqué, confiance détruite, et pratique commerciale trompeuse au regard de la loi.",
          "- Rester vague (« on est les meilleurs ») au lieu de prouver.",
          "- Oublier de demander la recommandation par peur de déranger.",
          "## Mini cas pratique",
          "Après la signature du compromis d'un T3 à Martigues, le client est aux anges. C'est l'instant : « Je suis ravi que tout se soit si bien passé. Un service : auriez-vous deux minutes pour laisser un avis Google ? Et si autour de vous quelqu'un pense à vendre, parlez-lui de moi — je m'en occuperai aussi bien que pour vous. » Preuve sociale et recommandation, en une phrase."
        ]
      },
      {
        "titre": "Le storytelling : raconter pour faire acheter",
        "contenu": [
          "Le cerveau est câblé pour les histoires : il oublie une liste d'arguments, il retient un récit. Raconter, c'est **faire vivre** le bien et **ancrer** l'émotion.",
          "## Pourquoi une histoire convainc",
          "- Une histoire crée des **images mentales** et de l'émotion, les deux moteurs de la décision.",
          "- Elle fait **baisser la garde** : on n'argumente pas contre une histoire comme contre un argument.",
          "- Elle rend le propos **mémorable** : le client la re-racontera à son conjoint le soir même.",
          "## La structure d'une bonne histoire",
          "- **Un héros** : ce n'est pas vous, c'est le **client** (ou un client qui lui ressemble).",
          "- **Une situation de départ** : un besoin, un rêve, un problème.",
          "- **Une péripétie** : la recherche, les doutes, le moment-clé.",
          "- **Une résolution heureuse** : la vie meilleure après l'achat.",
          "## Les trois histoires du négociateur",
          "- **L'histoire du bien** : « cette maison, un couple l'a construite en 1985, y a élevé trois enfants ; chaque arbre du jardin a été planté à une naissance. »",
          "- **Le cas client** : « j'ai accompagné l'an dernier une famille dans votre situation exacte ; voici comment ça s'est terminé. » — la preuve par l'histoire.",
          "- **Votre histoire, celle de l'agence** : pourquoi vous faites ce métier, votre attachement au secteur — elle crée la sympathie et l'unité.",
          "## Le cas client : preuve et récit réunis",
          "- Choisissez un cas **réellement comparable** au client (même profil, même peur).",
          "- Déroulez : la situation initiale, l'obstacle, ce que vous avez fait, le résultat concret.",
          "- Terminez par le lien : « et c'est exactement ce que je vous propose de faire. »",
          "## Scripts de transition vers l'histoire",
          "- « Ça me rappelle un couple que j'ai accompagné juste à côté… »",
          "- « Laissez-moi vous raconter l'histoire de cette maison… »",
          "## Erreurs fréquentes à éviter",
          "- **Mentir ou enjoliver** : une histoire fausse qui se découvre ruine tout, et une allégation mensongère peut relever de la pratique commerciale trompeuse.",
          "- Faire de **soi** le héros au lieu du client.",
          "- Une histoire trop longue qui perd son auditeur : une bonne histoire tient en une à deux minutes.",
          "## Mini cas pratique",
          "Des acquéreurs craignent d'acheter leur première maison à Martigues. Racontez : « L'an dernier, un jeune couple comme vous hésitait sur un bien à Croix-Sainte, exactement les mêmes doutes. On a sécurisé le financement et les diagnostics ensemble ; ils ont signé, et ils m'ont envoyé une photo de leur premier Noël dans le salon. Voilà ce qu'on va faire pour vous. » L'histoire a réussi là où aucun tableau de chiffres n'y serait parvenu."
        ]
      },
      {
        "titre": "Communiquer pour persuader : voix, non-verbal & congruence",
        "contenu": [
          "Ce n'est pas seulement **ce que** vous dites qui persuade, c'est **comment** vous le dites. Le fond sans la forme ne convainc personne.",
          "## Les trois canaux de la communication",
          "Les travaux d'Albert Mehrabian sur la communication des émotions montrent que, **lorsque le verbal et le non-verbal se contredisent**, l'interlocuteur se fie bien davantage à la voix et au non-verbal qu'aux mots eux-mêmes. Attention : ce constat vaut pour l'expression des émotions et des attitudes, pas pour la transmission d'une information factuelle.",
          "- **Le verbal** : les mots, le fond, les arguments.",
          "- **Le vocal (paraverbal)** : le ton, le débit, le volume, les pauses.",
          "- **Le visuel (non-verbal)** : la posture, le regard, le sourire, les gestes.",
          "La leçon pratique : un excellent argument dit d'une voix hésitante et les yeux fuyants ne persuade pas.",
          "## Maîtriser le paraverbal",
          "- **Le débit** : ralentissez sur les points importants ; la lenteur maîtrisée signale la confiance.",
          "- **Le volume** : baissez la voix sur l'argument-clé, l'auditeur se penche et écoute.",
          "- **L'intonation** : variez, bannissez le ton plat et récité.",
          "- **La pause** : un silence avant un chiffre important le met en valeur.",
          "## Le non-verbal qui inspire confiance",
          "- **Le regard** : ancré, franc, sans fixer ; il porte l'essentiel de la sincérité perçue.",
          "- **Le sourire** : sincère, il déclenche la sympathie (principe de Cialdini).",
          "- **La posture** : droite, ouverte, épaules relâchées ; pas de bras croisés.",
          "- **Les gestes** : ouverts, paumes visibles ; ils rassurent, alors que le doigt pointé agresse.",
          "## La synchronisation (mirroring)",
          "- Adaptez-vous discrètement au rythme et au vocabulaire du client : un client posé n'aime pas un vendeur en survitesse.",
          "- Reprenez ses propres mots : s'il dit « tranquille », parlez de « tranquillité », pas de « calme ».",
          "## La congruence : l'arme absolue",
          "- **Congruence** = le fond, la voix et le corps disent la même chose. C'est elle qui rend crédible.",
          "- Vous ne pouvez être congruent que sur ce que vous **croyez vraiment** : d'où l'importance de la conviction sincère.",
          "## Le silence, allié paraverbal",
          "- Après une question d'engagement ou un argument fort, **taisez-vous**. Le silence pousse l'autre à réagir et à s'approprier l'idée.",
          "- Résistez à l'envie de combler le vide : c'est souvent là que le client se convainc lui-même.",
          "## Erreurs fréquentes à éviter",
          "- Débit en mitraillette sous l'effet du stress : donne l'impression de vouloir « fourguer ».",
          "- Regard fuyant ou rivé sur le téléphone et les documents.",
          "- Un discours enthousiaste sur un ton éteint : l'incongruence tue le message.",
          "## Mini cas pratique",
          "Vous annoncez le prix de vente conseillé à un propriétaire. Dites-le **lentement, en le regardant, d'une voix posée**, puis **taisez-vous** : « Le prix juste pour votre bien, c'est 315 000 €. » … silence. La congruence et le silence valent ici tous les arguments : vous affichez une certitude d'expert."
        ]
      },
      {
        "titre": "Construire & délivrer son argumentaire de valeur",
        "contenu": [
          "La persuasion ne s'improvise pas : les vendeurs d'élite **préparent** leur argumentaire comme un plaidoyer. Un argument trouvé sur le moment pèse dix fois moins qu'un argument préparé, prouvé et bien placé.",
          "## Étape 1 : collecter la matière",
          "- Listez **toutes** les caractéristiques du bien (ou de votre offre d'agence).",
          "- Pour chacune, écrivez l'**avantage client** et la **preuve** associée (méthode CAP).",
          "- Classez par levier SONCASE pour pouvoir piocher selon le profil du client.",
          "## Étape 2 : la fiche argumentaire",
          "- Construisez un tableau mental à trois colonnes : Caractéristique, Avantage, Preuve.",
          "- Surlignez vos **trois arguments les plus forts** : ce sont vos munitions principales.",
          "- Préparez une **réponse aux deux objections les plus probables** (le traitement complet est vu dans le module Vaincre les objections).",
          "## Étape 3 : hiérarchiser pour l'impact",
          "- **Ouvrez fort** (effet de primauté) : votre deuxième meilleur argument.",
          "- Placez les arguments secondaires au **milieu**.",
          "- **Finissez par le plus fort** (effet de récence) : c'est ce qui restera en tête.",
          "- Ne déballez jamais tout : gardez une cartouche en réserve pour relancer.",
          "## Le pitch de valeur en 90 secondes",
          "Que ce soit pour présenter votre agence ou convaincre un acquéreur, sachez résumer votre valeur en 90 secondes :",
          "- **Qui** : « CENTURY 21 Icaza Immobilier, agence de référence à Martigues. »",
          "- **Ce que vous faites de différent** : diffusion multi-portails, fichier d'acquéreurs qualifiés, accompagnement de A à Z.",
          "- **La preuve** : vos chiffres, vos ventes locales, vos avis.",
          "- **Le bénéfice final** : « vous vendez au meilleur prix, en toute sécurité, sans y passer vos week-ends ».",
          "## La règle d'or du dosage",
          "- **Un argument fort vaut mieux que dix faibles** : un argumentaire dilué n'ancre rien.",
          "- Impliquez entre chaque argument : « ça, c'est important pour vous, non ? ».",
          "## Erreurs fréquentes à éviter",
          "- Arriver sans préparation et argumenter « au feeling ».",
          "- Réciter l'argumentaire complet sans écouter ni l'adapter au levier du client.",
          "- Garder son meilleur argument… pour ne jamais le sortir.",
          "## Mini cas pratique",
          "Avant un rendez-vous de prise de contact avec un propriétaire à Martigues, préparez votre fiche : trois arguments forts (connaissance du secteur, fichier d'acquéreurs, délai de vente moyen), chacun en CAP avec sa preuve. Ouvrez sur l'un d'eux, gardez le meilleur — par exemple votre taux réel de biens vendus pendant la durée du mandat, avec VOS chiffres — pour la fin. Vous entrez armé, pas improvisé."
        ]
      },
      {
        "titre": "Persuader sans jamais tromper : cadre légal & déontologie",
        "contenu": [
          "La persuasion d'élite s'exerce dans un cadre légal strict. Le négociateur est un professionnel soumis à un **devoir d'information et de conseil** : convaincre, oui ; tromper, jamais. Une vente arrachée par un mensonge est une vente fragile — et parfois annulable.",
          "## Le devoir d'information et de conseil",
          "- Le professionnel de l'immobilier (encadré par la loi Hoguet, titulaire d'une carte professionnelle) doit une information **loyale, exacte et complète** à ses clients, vendeur comme acquéreur.",
          "- Taire ou déformer une information déterminante (servitude, procédure en cours, sinistre, défaut majeur) engage sa responsabilité.",
          "- Persuader ne dispense jamais de dire la vérité : un argument doit être **vrai ET prouvé**.",
          "## Le DPE est opposable",
          "- Depuis le 1er juillet 2021, le DPE est **opposable** : l'acquéreur ou le locataire peut se retourner contre le vendeur ou le bailleur si la performance réelle ne correspond pas à celle annoncée.",
          "- Argumenter « bien économe, DPE classe C » engage : le diagnostic doit être valide et exact.",
          "- Depuis le 1er janvier 2025, les logements classés G sont interdits à la location (puis F au 1er janvier 2028, E au 1er janvier 2034) : ne promettez jamais un bien « louable » sans vérifier sa classe énergétique.",
          "## Les pratiques commerciales trompeuses sont sanctionnées",
          "- Le Code de la consommation interdit les **pratiques commerciales trompeuses** : fausse rareté (« j'ai déjà deux acheteurs » quand c'est faux), faux comparables, chiffre inventé, caractéristique mensongère.",
          "- La sanction peut être lourde (amende, voire peine) et ruine la réputation, le capital le plus précieux du négociateur.",
          "- La preuve sociale et la rareté (principes de Cialdini) ne persuadent durablement que si elles sont **réelles**.",
          "## Le dol et la réticence dolosive",
          "- Taire sciemment un défaut déterminant pour arracher la signature, c'est un **dol** (ou une réticence dolosive) : la vente peut être annulée et des dommages-intérêts prononcés.",
          "- Le vice caché connu et dissimulé engage également la responsabilité du vendeur.",
          "- Mieux vaut traiter honnêtement un défaut, et l'argumenter, que le cacher et tout perdre ensuite.",
          "## Ne jamais promettre ce qui ne dépend pas de vous",
          "- N'affirmez jamais qu'un prêt « sera » accordé, qu'un permis « passera » ou qu'un bien « prendra forcément de la valeur » : ce sont des promesses hors de votre maîtrise.",
          "- Formulez en probabilités étayées, jamais en certitudes : « au vu du marché local, la demande reste forte », preuves à l'appui.",
          "## Persuasion éthique : la règle d'or",
          "- Avant chaque argument, posez-vous trois questions : « Est-ce vrai ? Puis-je le prouver ? Sert-il une décision que le client ne regrettera pas ? »",
          "- Trois « oui » = persuasion. Un seul « non » = manipulation, à proscrire.",
          "- La persuasion éthique construit des clients qui recommandent ; la manipulation fabrique des litiges et des avis négatifs.",
          "## Erreurs fréquentes à éviter",
          "- Minimiser ou cacher un défaut connu pour « ne pas casser la vente ».",
          "- Avancer un chiffre ou un comparable que l'on ne peut pas justifier.",
          "- Transformer un espoir (plus-value, financement) en promesse ferme.",
          "## Mini cas pratique",
          "Un acquéreur vous demande si le quartier est bruyant la nuit, et vous savez qu'un établissement de nuit est proche. Ne minimisez pas : « Il y a un bar de nuit à 300 m ; le week-end, on l'entend un peu côté rue, pas côté jardin — c'est d'ailleurs pourquoi les chambres sont à l'arrière. » Vous transformez une vérité gênante en argument de confiance, et vous vous protégez de tout recours."
        ]
      },
      {
        "titre": "Cas pratique complet : de l'émotion à l'adhésion",
        "contenu": [
          "Voici un déroulé qui **combine tous les leviers** du module sur une situation réelle : convaincre un couple d'acquéreurs, en visite d'une maison à Martigues affichée 380 000 €.",
          "## Le contexte",
          "- Profil : couple avec deux enfants, levier dominant **Sécurité** (quartier, travaux), levier secondaire **Écologie** (charges, DPE).",
          "- Objectif : créer l'adhésion, pas forcer la signature (le closing est traité dans son propre module).",
          "## Étape 1 — Créer l'émotion (projection)",
          "« Entrez… Imaginez : c'est samedi matin, les enfants prennent leur petit-déjeuner ici pendant que le soleil entre par cette baie. Vous voyez le jardin d'ici ? »",
          "## Étape 2 — Raconter (storytelling)",
          "« Cette maison a été entretenue avec soin par une famille qui y a vécu quinze ans ; ils partent le cœur lourd. Chaque arbre du jardin a son histoire. »",
          "## Étape 3 — Argumenter en CAP sur le levier Sécurité",
          "« Toiture refaite en 2023 et diagnostics tous à jour (C), ce qui veut dire aucun gros travaux ni mauvaise surprise pour vous pendant des années (A) ; voici les factures et le dossier de diagnostics complet (P). »",
          "## Étape 4 — Renforcer sur le levier Écologie",
          "« DPE classe C et pompe à chaleur récente (C), donc des charges maîtrisées et un bien qui restera louable et vendable quelle que soit l'évolution de la réglementation énergétique (A) ; regardez les montants sur ces factures (P). »",
          "## Étape 5 — Activer les principes de Cialdini",
          "- **Preuve sociale** : « deux familles comme la vôtre ont acheté dans cette rue cette année ».",
          "- **Autorité** : « on suit ce quartier de près, c'est l'un des plus recherchés de Martigues ».",
          "- **Rareté réelle** : « des maisons avec ce jardin et sans travaux, il en sort très peu par an sur le secteur ».",
          "## Étape 6 — Impliquer puis se taire",
          "« Vous la voyez, votre famille, ici ? » … puis **silence**. Laissez-les se projeter et se répondre à eux-mêmes.",
          "## Étape 7 — Sécuriser l'adhésion par la preuve",
          "Une fois l'émotion installée, remettez le dossier complet (diagnostics, factures, comparables DVF) : vous donnez à la raison de quoi **justifier** le coup de cœur et éviter le remords.",
          "## Ce qu'il ne faut PAS faire",
          "- Dérouler les chiffres **avant** d'avoir créé l'émotion.",
          "- Continuer à argumenter une fois l'adhésion obtenue : on recrée des objections.",
          "- Inventer une rareté ou un argument : la confiance ne se récupère pas, et le mensonge expose à un recours.",
          "## La synthèse à retenir",
          "- **Émotion** d'abord, **preuve** ensuite.",
          "- Chaque argument en **CAP**, branché sur le **levier SONCASE** du client.",
          "- **Histoire** + **preuve sociale** + **congruence** + **silence** = adhésion.",
          "- La persuasion d'élite sert une décision que le client ne regrettera jamais, dans le respect du cadre légal."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Dans la séquence de persuasion d'élite, à quoi fait-on appel en premier ?",
        "options": [
          "La raison et les preuves chiffrées",
          "L'émotion, puis on justifie avec la raison",
          "Le prix",
          "Le DPE"
        ],
        "correct": 1,
        "explication": "On décide avec l'émotion puis on justifie avec la raison : créez d'abord le désir, apportez ensuite les preuves qui le sécurisent."
      },
      {
        "question": "Dans la méthode CAP, l'avantage doit toujours être…",
        "options": [
          "Objectif et purement technique",
          "Formulé comme un bénéfice concret pour CE client",
          "Le moins cher possible",
          "Prouvé avant même d'être énoncé"
        ],
        "correct": 1,
        "explication": "Caractéristique → Avantage (bénéfice pour le client) → Preuve. Une caractéristique sans avantage traduit ne vend pas."
      },
      {
        "question": "Quel principe de Cialdini repose sur l'idée que « nous disons oui à ce qui est rare » ?",
        "options": [
          "La réciprocité",
          "L'autorité",
          "La rareté",
          "La sympathie"
        ],
        "correct": 2,
        "explication": "La rareté (bien recherché, sans équivalent) augmente la valeur perçue et accélère la décision — à condition d'être réelle, sous peine de pratique commerciale trompeuse."
      },
      {
        "question": "Après avoir posé un argument fort ou une question d'engagement, le vendeur d'élite…",
        "options": [
          "Enchaîne immédiatement un autre argument",
          "Se tait et laisse le silence agir",
          "Baisse le prix",
          "Récapitule toute la visite"
        ],
        "correct": 1,
        "explication": "Le silence met le client en situation de réfléchir et de s'approprier l'argument ; parler trop vite affaiblit l'impact."
      },
      {
        "question": "La preuve sociale la plus puissante pour un négociateur est…",
        "options": [
          "Parler plus fort que le client",
          "Ses ventes récentes dans le secteur, ses avis et témoignages clients",
          "Cacher les défauts du bien",
          "Promettre systématiquement le prix le plus bas"
        ],
        "correct": 1,
        "explication": "On se fie à ce que font les autres : ventes locales, panneaux « Vendu », avis Google et témoignages de clients semblables rassurent et crédibilisent — à condition d'être réels."
      },
      {
        "question": "Annoncer une fausse rareté (« j'ai déjà deux acheteurs ») alors que c'est faux, ou taire un défaut connu pour faire signer…",
        "options": [
          "Est une technique recommandée pour accélérer la vente",
          "Peut constituer une pratique commerciale trompeuse ou un dol, sanctionné par la loi",
          "N'a aucune conséquence tant que le bien se vend",
          "Relève du principe de réciprocité de Cialdini"
        ],
        "correct": 1,
        "explication": "La rareté et la preuve sociale ne persuadent que si elles sont réelles : une fausse rareté relève des pratiques commerciales trompeuses (Code de la consommation), et taire sciemment un vice déterminant constitue un dol pouvant faire annuler la vente. La persuasion éthique sert une décision que le client ne regrettera pas."
      },
      {
        "question": "Dans la methode CAP, la lettre P designe...",
        "options": [
          "la Projection",
          "le Prix",
          "la Preuve",
          "la Promesse"
        ],
        "correct": 2,
        "explication": "CAP = Caracteristique, Avantage, Preuve ; c'est l'avantage prouve qui declenche l'adhesion."
      },
      {
        "question": "La phrase de liaison (ce qui veut dire pour vous que...) sert a...",
        "options": [
          "conclure la vente immediatement",
          "traduire une caracteristique en avantage concret pour le client",
          "annoncer le prix",
          "demander une recommandation"
        ],
        "correct": 1,
        "explication": "La liaison oblige a passer du fait (caracteristique) au benefice client (avantage), chainon central de la methode CAP."
      },
      {
        "question": "Dans le moyen mnemotechnique SONCASE, la lettre E correspond a...",
        "options": [
          "l'Economie de temps",
          "l'Emotion",
          "l'Ecologie",
          "l'Engagement"
        ],
        "correct": 2,
        "explication": "Le E de SONCASE correspond a l'Ecologie, levier devenu majeur avec le calendrier d'interdiction de location des passoires thermiques."
      },
      {
        "question": "Selon la regle d'or du dosage de l'argumentation, il vaut mieux...",
        "options": [
          "aligner dix arguments de force egale",
          "un seul argument fort que dix arguments faibles",
          "ne donner aucun argument et laisser le bien parler",
          "repeter le meme argument sans cesse"
        ],
        "correct": 1,
        "explication": "Un argument fort ancre la decision ; dix arguments dilues ne laissent rien en memoire."
      },
      {
        "question": "Le principe de reciprocite de Cialdini invite le negociateur a...",
        "options": [
          "demander avant de donner quoi que ce soit",
          "offrir quelque chose (etude de marche, conseils) avant de demander l'engagement du client",
          "exiger un acompte pour prouver le serieux",
          "ne jamais rendre service gratuitement"
        ],
        "correct": 1,
        "explication": "On se sent redevable envers qui nous a donne : offrir une estimation argumentee avant de demander le mandat active la reciprocite."
      },
      {
        "question": "Le principe d'autorite de Cialdini se traduit, chez le negociateur, par...",
        "options": [
          "l'arrogance et la pression",
          "l'affichage d'une expertise credible (chiffres precis, connaissance fine du secteur)",
          "le fait de parler fort et vite",
          "la multiplication des promesses"
        ],
        "correct": 1,
        "explication": "On suit l'avis de l'expert credible : une expertise demontree, sans arrogance, rassure et fait autorite."
      },
      {
        "question": "Au-dela des six principes historiques, le 7e levier ajoute par Cialdini est...",
        "options": [
          "la peur",
          "l'unite (le sentiment d'appartenir au meme groupe)",
          "la repetition",
          "la flatterie"
        ],
        "correct": 1,
        "explication": "L'unite repose sur le nous (memes origines, meme situation), une alliance qui desarme la mefiance."
      },
      {
        "question": "Les travaux d'Albert Mehrabian etablissent que, lorsque le verbal et le non-verbal se contredisent dans l'expression d'une emotion, l'interlocuteur se fie surtout...",
        "options": [
          "aux mots eux-memes",
          "au contrat ecrit",
          "a la voix et au non-verbal (ton, regard, posture)",
          "au prix affiche"
        ],
        "correct": 2,
        "explication": "En cas de contradiction sur une emotion ou une attitude, c'est le paraverbal et le non-verbal qui priment sur les mots ; d'ou l'importance de la congruence."
      },
      {
        "question": "La congruence, en communication persuasive, signifie que...",
        "options": [
          "le fond, la voix et le corps disent la meme chose",
          "on parle le plus vite possible",
          "on evite tout silence",
          "on recite un argumentaire par coeur"
        ],
        "correct": 0,
        "explication": "La congruence rend credible : on ne peut l'atteindre que sur ce qu'on croit vraiment, d'ou la necessite d'une conviction sincere."
      },
      {
        "question": "Dans une bonne histoire de vente (storytelling), le heros doit etre...",
        "options": [
          "l'agent lui-meme",
          "le client (ou un client qui lui ressemble)",
          "le directeur de l'agence",
          "le concurrent"
        ],
        "correct": 1,
        "explication": "Le heros est le client : faire de soi le heros est une erreur frequente qui affaiblit le recit."
      },
      {
        "question": "Le meilleur moment pour solliciter une recommandation est...",
        "options": [
          "au premier contact telephonique",
          "juste apres un compromis signe, quand le client est satisfait",
          "des annees apres la vente",
          "jamais, pour ne pas deranger"
        ],
        "correct": 1,
        "explication": "La recommandation se provoque a chaud, lorsque le client est ravi : juste apres un compromis signe est l'instant ideal."
      },
      {
        "question": "Taire sciemment un defaut determinant pour arracher la signature constitue...",
        "options": [
          "une technique de closing recommandee",
          "un simple argument de rarete",
          "un dol (ou reticence dolosive) pouvant entrainer l'annulation de la vente",
          "une pratique legale si le defaut est mineur"
        ],
        "correct": 2,
        "explication": "Le dol ou la reticence dolosive peut faire annuler la vente et donner lieu a des dommages-interets : mieux vaut traiter honnetement un defaut."
      },
      {
        "question": "L'effet de recence recommande au negociateur de...",
        "options": [
          "donner son meilleur argument au tout debut puis l'oublier",
          "terminer son argumentation par son argument le plus fort",
          "ne jamais conclure",
          "placer tous ses arguments au milieu"
        ],
        "correct": 1,
        "explication": "On ouvre fort (primaute) et on termine par le plus fort (recence), car c'est ce qui reste le plus en tete du client."
      }
    ]
  },
  {
    "id": "objections",
    "titre": "Vaincre les objections",
    "icone": "🛡️",
    "categorie": "Commercial",
    "resume": "Accueillir, creuser, isoler et lever chaque objection (prix, « je réfléchis »…), côté vendeur comme acquéreur, jusqu'à la signature.",
    "duree": "43 min",
    "lecons": [
      {
        "titre": "Comprendre l'objection : nature, typologie et posture",
        "contenu": [
          "Une objection n'est pas un « non » : c'est une **demande d'information ou de réassurance**. C'est souvent le **signe que le client s'intéresse** — un prospect totalement indifférent ne prend pas la peine d'objecter. Apprendre à aimer les objections, c'est apprendre à repérer les vrais acheteurs et les vrais vendeurs.",
          "## Une objection n'est pas un refus",
          "- Un **refus** est définitif et sans discussion (« je ne vends pas, je n'achète pas, point »).",
          "- Une **objection** laisse la porte ouverte : le client dialogue encore, donc il peut être convaincu.",
          "- Les ventes se concluent presque toujours après avoir **levé plusieurs objections** : les attendre et les accueillir fait partie du métier, ce n'est pas un accident de parcours.",
          "## Les trois moments où surgit l'objection",
          "- À la **prospection et à l'estimation** : « je ne vends pas par agence », « votre prix est trop bas ».",
          "- En **visite** : « c'est petit », « il y a trop de travaux », « le DPE est mauvais ».",
          "- À l'**offre et à la négociation** : « c'est trop cher », « je vais réfléchir », « j'en parle à mon conjoint ».",
          "## La typologie : savoir à qui on a affaire",
          "- **Objection fondée (sincère)** : un vrai frein réel (budget, financement, un défaut objectif du bien). Elle se traite par la preuve.",
          "- **Objection non fondée** : un malentendu ou une information manquante (« c'est humide » alors qu'aucun désordre n'existe). Elle se traite par la démonstration et le document.",
          "- **Prétexte (la « fausse barbe »)** : « je vais réfléchir », « c'est trop loin » — l'objection de façade qui en cache une autre. Elle se fait préciser avant tout.",
          "- **Objection tactique** : le client objecte pour **négocier** (prix, honoraires) alors qu'il est décidé. Elle se traite avec fermeté et contreparties.",
          "- **Objection muette** : le frein non exprimé, visible dans l'attitude (recul, silence, regard vers le conjoint). Elle se fait **sortir** (« je vous sens hésitant, qu'est-ce qui vous retient ? »).",
          "## Objection sincère ou prétexte ?",
          "- Le test infaillible : **« Si je règle ce point, on avance ? »**. S'il dit oui, l'objection était sincère et unique. S'il enchaîne un autre frein, le premier n'était qu'un prétexte.",
          "- Autre repère : une objection **précise et argumentée** est en général sincère ; une objection **vague et répétée** (« il faut voir », « on verra ») est souvent un prétexte.",
          "## La posture : allié, jamais adversaire",
          "- Ne prenez **jamais** une objection comme une attaque personnelle. Le client n'est pas contre vous, il est inquiet.",
          "- **Accueillez** systématiquement avant de répondre : « Bonne question », « Je comprends très bien », « Vous avez raison de soulever ce point ». On fait baisser la garde avant d'argumenter.",
          "- Gardez un **ton calme et une posture ouverte** : se raidir ou couper la parole transforme l'objection en conflit.",
          "## La règle d'or : comprendre avant de répondre",
          "On ne traite **jamais** une objection qu'on n'a pas comprise. Répondre trop vite, c'est répondre à côté — et parfois **créer** un doute qui n'existait pas. Avant d'argumenter, on creuse :",
          "- « Qu'est-ce qui vous fait dire cela ? »",
          "- « C'est-à-dire ? »",
          "- « Par rapport à quoi ? »",
          "- « Qu'est-ce qui vous ferait changer d'avis ? »",
          "## Les erreurs fréquentes",
          "- **Contredire frontalement** (« non, vous avez tort ») : on gagne le point, on perd la vente.",
          "- **Répondre avant d'avoir creusé** : on traite une objection fantôme.",
          "- **Argumenter dans le vide** : empiler dix arguments faibles au lieu d'une preuve forte.",
          "- **Se justifier en s'excusant**, surtout sur le prix ou les honoraires : cela avoue une faiblesse.",
          "- **Le prendre personnellement** et se braquer.",
          "## Mini cas pratique",
          "En visite d'un T3 à Jonquières (Martigues) affiché 189 000 €, l'acquéreur lâche : « C'est petit pour le prix. » Ne défendez pas tout de suite la surface. Creusez : « Petit par rapport à quoi, à vos besoins ou à ce que vous avez visité ? ». Vous découvrez qu'il compare à un T3 vu 10 m² plus grand, mais au 4ᵉ sans ascenseur et à rénover. L'objection n'était pas la surface : c'était le **rapport qualité/prix**, que vous pouvez maintenant traiter avec des faits."
        ]
      },
      {
        "titre": "La méthode CRAC en 4 temps : Creuser, Reformuler, Argumenter, Contrôler",
        "contenu": [
          "Une trame simple et redoutable s'applique à **n'importe quelle objection**. Retenez le mnémonique **CRAC** : **C**reuser, **R**eformuler, **A**rgumenter, **C**ontrôler — précédé d'un temps zéro, **A**ccueillir (soit **ACRAC**).",
          "## Temps 0 — Accueillir (amortir le choc)",
          "- Avant toute chose, on **amortit** l'objection sans la contredire, pour rester allié : « Je comprends », « C'est une très bonne question », « Beaucoup de clients se posent la question ».",
          "- Cette technique dite de **l'édredon** désamorce l'agressivité et prouve l'écoute. On ne répond jamais tac au tac.",
          "## Étape 1 — Creuser",
          "- On fait **préciser** pour isoler le vrai frein : « Qu'entendez-vous exactement par trop cher ? », « Par rapport à quoi ? », « C'est-à-dire ? ».",
          "- Objectif : ne pas traiter l'objection apparente, mais l'objection **réelle**. 80 % du travail est fait quand le **frein** est correctement identifié.",
          "## Étape 2 — Reformuler et isoler",
          "- On **reformule** pour valider : « Donc si je comprends bien, le bien vous plaît, mais le budget vous paraît élevé, c'est ça ? ».",
          "- On **isole** avec la question-clé : **« À part ce point, est-ce que tout le reste vous convient ? »**. S'il dit oui, il ne reste **qu'un seul** obstacle à lever.",
          "## Étape 3 — Argumenter avec une preuve",
          "- On répond avec un **fait**, pas une opinion : comparables DVF, chiffres, document, démonstration, témoignage.",
          "- On structure en **CAP** (Caractéristique, Avantage pour le client, Preuve — voir module Vente d'élite) : c'est l'avantage prouvé, pas la caractéristique brute, qui lève l'objection.",
          "- **Un argument fort vaut mieux que dix faibles** : on sort sa meilleure preuve, pas un inventaire.",
          "## Étape 4 — Contrôler et verrouiller",
          "- On **vérifie** que c'est réglé : « Ce point est clair pour vous ? », « Je vous ai rassuré sur ce sujet ? ».",
          "- On **verrouille vers l'avant** : « Donc on peut avancer ? », « On part là-dessus ? ». Une objection levée doit déboucher sur un pas concret, pas sur le vide.",
          "## Pourquoi isoler change tout",
          "Sans isolement, on tombe dans le **jeu des objections infinies** (« oui mais… oui mais… ») : chaque réponse en déclenche une nouvelle, le client se protège, on s'épuise. En isolant, on transforme un brouillard de réserves en **un seul obstacle nommé** — et un obstacle nommé est à moitié levé.",
          "## Le silence, votre arme n°1",
          "Après avoir argumenté et posé votre question de contrôle, **taisez-vous**. Le silence met le client en situation de répondre et de décider. Le premier qui parle « rouvre » la discussion et affaiblit sa position. Supportez le blanc : il travaille pour vous.",
          "## Erreurs fréquentes",
          "- Sauter l'étape « creuser » et argumenter dans le vide.",
          "- Oublier d'isoler, et enchaîner les objections sans fin.",
          "- Ne pas contrôler : on croit avoir convaincu, le client repart avec son doute.",
          "## Mini cas pratique",
          "Lors d'un second rendez-vous de prise de mandat à Ferrières, la vendeuse objecte : « Votre estimation est plus basse que celle de l'agence d'à côté. » Accueillez (« c'est normal de comparer »), creusez (« ils se sont appuyés sur quelles ventes réelles ? »), reformulez et isolez (« à part l'écart de prix, ma stratégie et mon reporting vous conviennent ? »), argumentez (3 ventes DVF comparables du quartier), puis contrôlez (« sur ces chiffres, on part sur ce prix de mise en vente ? »)."
        ]
      },
      {
        "titre": "La boîte à outils : les techniques pour désamorcer",
        "contenu": [
          "Au-delà de la trame CRAC, voici les **techniques** à piocher selon l'objection et le client. Les meilleurs négociateurs les enchaînent naturellement, sans réciter.",
          "## L'accusé de réception (l'édredon)",
          "- Amortir sans contredire : « Je comprends », « Vous avez raison de le soulever ». On reconnaît l'émotion avant de traiter le fond.",
          "## La question miroir (l'écho)",
          "- Répéter le dernier mot sur un ton interrogatif pour faire préciser : le client dit « c'est trop cher », vous répondez simplement « Trop cher ? ». Il développe et livre le vrai frein.",
          "## Le creusage",
          "- Les questions qui ouvrent : « C'est-à-dire ? », « Par rapport à quoi ? », « Qu'est-ce qui vous fait dire cela ? ». Jamais de réponse avant d'avoir creusé.",
          "## Le recadrage (changer de perspective)",
          "- Déplacer le point de vue : « Ce n'est pas cher, c'est **rare** » ; « Ce ne sont pas des travaux, c'est l'occasion de faire le bien **à votre goût** et de créer de la valeur ».",
          "## La division (ramener à l'unité)",
          "- Fractionner l'écart pour le dédramatiser : « 6 000 € de plus, sur un prêt de 20 ans, c'est environ **30 € par mois** — le prix d'un abonnement, pour la maison de vos enfants ».",
          "## Le différentiel (ne négocier que l'écart)",
          "- Ne jamais rediscuter le prix total : « Nous sommes d'accord sur 295 000 €, il reste **5 000 € d'écart** entre vous. C'est cela, et seulement cela, qu'on doit résoudre. » On réduit mentalement l'enjeu.",
          "## L'addition / le bilan",
          "- Cumuler les avantages face à la réserve unique : « Emplacement, exposition sud, aucun travaux, garage, école à 200 m… en face, il y a ce seul point de prix. De quel côté penche la balance ? ».",
          "## Le boomerang (retournement)",
          "- Transformer l'objection en raison d'acheter : « Justement parce que le quartier est recherché, ce type de bien se revend vite et ne se négocie pas » ; « C'est précisément parce qu'il y a des travaux que le prix est déjà attractif ».",
          "## La preuve sociale / la référence",
          "- S'appuyer sur les autres : « Un acquéreur me disait la même chose la semaine dernière sur ce secteur ; après avoir vu les prix réellement signés, il a fait une offre le lendemain. »",
          "## Le « oui, et » plutôt que le « oui, mais »",
          "- Le « mais » **annule** tout ce qui précède et braque le client. Remplacez-le : « Oui, **et** c'est justement pour cela que… ». On relie l'objection à votre argument au lieu de l'opposer.",
          "## L'anticipation (désamorcer avant que ça surgisse)",
          "- Évoquer soi-même l'objection prévisible pour lui couper l'herbe sous le pied : « Vous allez voir, la cuisine est à rafraîchir — c'est d'ailleurs pris en compte dans le prix. » Dit par vous, le défaut perd son pouvoir.",
          "## La compensation",
          "- Reconnaître un point faible et le compenser aussitôt par un point fort : « Oui, pas d'ascenseur — en contrepartie, des charges très basses et un dernier étage lumineux et au calme. »",
          "## Mini cas pratique",
          "Sur une villa avec piscine aux Laurons (Martigues) affichée 549 000 €, l'acquéreur dit : « La piscine, c'est un gouffre d'entretien. » Boomerang et recadrage : « C'est justement pour ça qu'elle est au sel, récente et peu énergivore : comptez quelques centaines d'euros par an, pour des étés entiers à la maison plutôt qu'en vacances payantes. »"
        ]
      },
      {
        "titre": "« C'est trop cher » : l'objection prix côté acquéreur",
        "contenu": [
          "L'objection prix est la **plus fréquente** du métier. Côté acquéreur, elle porte sur le prix du bien ; côté vendeur, sur vos honoraires (traité au module Défendre ses honoraires). Ici, on traite le **prix du bien**.",
          "## Règle n°1 : ne jamais baisser le prix par réflexe",
          "- Baisser dès la première objection, c'est avouer que le prix était gonflé et **inviter** le client à pousser encore. On traite d'abord, on ne cède pas.",
          "- Le prix juste n'est pas une opinion : c'est un **fait de marché** qu'on démontre.",
          "## Étape 1 — Creuser : « trop cher par rapport à quoi ? »",
          "- Par rapport au **marché** ? On sort les comparables.",
          "- Par rapport à son **budget** ? C'est un sujet de financement, pas de valeur du bien.",
          "- Par rapport à un **autre bien visité** ? On compare objectivement (surface, état, étage, extérieur, DPE).",
          "## Étape 2 — Comparer au marché réel (DVF)",
          "- Sortez **3 à 5 ventes réellement signées** (base DVF, consultable par tous) de biens comparables sur le secteur. Le prix affiché des concurrents ne prouve rien ; le prix **payé** prouve tout.",
          "- Exemple : « Les trois derniers T4 vendus à Saint-Julien, surface et état équivalents, sont partis entre 3 100 et 3 250 €/m². Ce bien est à 3 150 €/m². Nous sommes dans le marché. »",
          "## Étape 3 — La division : ramener l'écart à un coût mensuel",
          "- Ne raisonnez pas en capital, mais en **mensualité** : « 5 000 € d'écart, c'est 1,7 % du prix — et sur un prêt de 20 ans, **moins de 30 € par mois**. Allez-vous laisser passer la maison qui vous plaît pour 30 € ? ».",
          "## Étape 4 — Valoriser et recadrer",
          "- Rappelez ce qui **justifie** le prix : emplacement, exposition, absence de travaux, rareté du bien sur le secteur, prestations.",
          "- Recadrez : « Ce n'est pas cher, c'est bien placé et sans travaux — vous emménagez, vous ne sortez plus un euro. »",
          "## Ne pas oublier le budget total de l'acquéreur",
          "- Au prix du bien s'ajoutent les **frais d'acquisition** (dits « frais de notaire ») : environ **7 à 8 % dans l'ancien** et **2 à 3 % dans le neuf (VEFA)**. Intégrez-les tôt pour que l'offre soit réaliste et éviter une mauvaise surprise au compromis.",
          "## Quand la négociation est légitime",
          "- Si l'écart est réel, passez en **contre-offre argumentée** : ne répondez jamais « non » sec, cherchez des **contreparties** (délai de libération, mobilier, date de signature, levée rapide des conditions).",
          "- Côté vendeur, présentez une offre financée et sérieuse avec son contexte : une offre un peu basse mais **sûre** vaut souvent mieux qu'une offre haute et fragile (voir module La négociation).",
          "## Pièges à éviter",
          "- Céder au premier « c'est cher » sans creuser.",
          "- Se justifier (« je sais, c'est un peu élevé… ») : vous démolissez vous-même le prix.",
          "- Comparer à un prix **affiché** au lieu d'un prix **vendu**.",
          "- Entrer dans un bras de fer d'ego : on reste factuel.",
          "## Scripts mot pour mot",
          "- Creuser : « Quand vous dites trop cher, c'est par rapport au marché, à votre budget, ou à un autre bien ? »",
          "- Diviser : « Entre les deux, il y a 5 000 € : moins de 30 € par mois sur votre prêt. »",
          "- Isoler : « Si le vendeur acceptait une offre raisonnable, vous seriez acheteur ? »",
          "- Verrouiller : « Posons une offre écrite à un prix que vous assumez : c'est elle qui fera réfléchir le vendeur. »",
          "## Mini cas pratique",
          "Un couple visite une maison de ville à L'Île (Martigues) affichée 315 000 € et trouve « que ça fait beaucoup ». Vous creusez : leur budget maximum est 300 000 €. Ce n'est pas la valeur qui coince, c'est le financement. Vous recadrez sur l'écart (15 000 €, moins de 90 €/mois sur 20 ans), proposez une offre à 305 000 € assortie d'une libération rapide, et transformez un « trop cher » en négociation concrète."
        ]
      },
      {
        "titre": "« Je vais réfléchir » et les objections de temporisation",
        "contenu": [
          "« Je vais réfléchir » est la **reine des fausses objections**. Dans l'immense majorité des cas, elle cache un **frein non exprimé** : le prix, un doute sur le bien, un financement incertain, ou une tierce personne à convaincre.",
          "## Pourquoi on ne lâche jamais sur un « je réfléchis » nu",
          "- Un client qui part « réfléchir » sans cadre, c'est un client qui **refroidit** : l'émotion de la visite retombe, les doutes grandissent, un autre bien capte son attention.",
          "- « Réfléchir » à quoi, exactement ? Tant que vous ne le savez pas, vous ne pouvez rien traiter.",
          "## La trame anti-« je réfléchis »",
          "- **Accueillir** : « Vous avez raison, c'est une décision importante, il faut être sûr. »",
          "- **Faire préciser** : « Pour vous aider à y voir clair, qu'est-ce qui vous retient encore : le prix, le bien lui-même, ou le timing ? »",
          "- **Isoler** : « À part ce point, tout le reste vous convient ? »",
          "- **Fixer une échéance datée** : jamais « rappelez-moi quand vous voulez », toujours « on se refait un point **jeudi à 18 h**, d'accord ? ».",
          "## « Il faut que j'en parle à… » (conjoint, banquier, famille)",
          "- Si un **décideur** manque, c'est une erreur de découverte : on s'assure que toutes les parties prenantes sont présentes **avant** la visite décisive.",
          "- Conjoint : « Très bien. Si votre conjoint est d'accord, vous l'êtes vous ? » (on isole votre propre oui), puis « Quand le voyez-vous ? Organisons une seconde visite ensemble ce week-end. »",
          "- Banquier : « Un accord de principe peut s'obtenir rapidement. Bloquons le bien avec une offre, je vous mets en relation avec un courtier dès cet après-midi. »",
          "## « Je ne suis pas pressé »",
          "- Souvent un paravent. Creusez le **projet derrière** : « Rien ne presse, bien sûr — mais si le bien idéal se présente demain, vous le laissez passer ? ».",
          "## La peur de rater (FOMO) — honnête, jamais du bluff",
          "- Sur un bien qui plaît, rappelez le **risque réel** de le perdre : « Ce type de bien, sur ce secteur, part en quelques jours ; j'ai déjà une visite programmée demain. » Ne l'affirmez **que si c'est vrai** : un bluff découvert détruit votre crédibilité et manque à votre déontologie.",
          "## L'avantage caché : la rétractation protège l'acquéreur",
          "- Rassurez : « Signer un compromis ne vous enferme pas : la loi vous accorde un **délai de rétractation de 10 jours**, à compter du lendemain de la notification du compromis signé (article L271-1 du Code de la construction et de l'habitation). Pendant ce délai, vous pouvez renoncer **sans motif ni pénalité** et récupérer votre dépôt. » C'est un argument puissant contre le « je réfléchis » (voir la leçon sur les garde-fous juridiques).",
          "## Pièges à éviter",
          "- Laisser partir sans date de relance.",
          "- Accepter le « je réfléchis » comme une vraie réponse et ranger son dossier.",
          "- Harceler : on fixe un cadre, on n'étouffe pas.",
          "## Scripts mot pour mot",
          "- « Bien sûr. Juste pour que je vous aide : qu'est-ce qui vous ferait dire oui aujourd'hui ? »",
          "- « À part ce point, êtes-vous convaincu par le bien ? »",
          "- « On se cale un point jeudi 18 h ; d'ici là, je vous envoie les comparables. »",
          "## Mini cas pratique",
          "Après la visite d'un T3 à Croix-Sainte (Martigues), l'acquéreur dit « on va réfléchir ». Vous faites préciser : le bien plaît, mais ils veulent valider la mensualité avec leur banque. Le vrai frein est le financement, pas le bien. Vous les orientez vers un courtier le jour même, fixez une relance à 48 h, et sécurisez leur intérêt avant qu'un autre acquéreur ne passe."
        ]
      },
      {
        "titre": "Le catalogue des objections VENDEUR (prise de mandat)",
        "contenu": [
          "Côté vendeur, les objections surgissent surtout à la **prise de mandat**. Les lever, c'est sécuriser un mandat au juste prix, idéalement en exclusivité (voir module La prise de mandat pour le cadre juridique complet).",
          "## « Je veux d'abord essayer de vendre seul »",
          "- Accueillir sans dénigrer : « Beaucoup de vendeurs commencent ainsi, c'est légitime de vouloir économiser la commission. »",
          "- Argumenter : « Un vendeur seul s'expose à recevoir surtout des **curieux** et des acheteurs non financés, à mal filtrer, à négocier sans recul, et souvent à vendre **moins cher** faute d'acquéreurs mis en concurrence. »",
          "- Fermer : « Laissez-moi simplement estimer, sans engagement. Vous aurez un avis de professionnel gratuit, et vous déciderez ensuite. »",
          "## « Je préfère confier à plusieurs agences »",
          "- Argument-clé : **« plus d'agences n'est pas plus d'acheteurs »**. Ce sont les **mêmes** acquéreurs du secteur qui voient le bien partout ; à prix et photos différents, il se **banalise** et paraît invendable.",
          "- En exclusivité : un seul interlocuteur, un vrai plan marketing (photos pro, home-staging, diffusion premium), un **reporting** régulier. « L'exclusivité, c'est mon engagement de résultat. »",
          "## « Un autre agent m'a annoncé un prix plus élevé »",
          "- C'est le piège du **mandat gonflé** : certains surestiment pour emporter le mandat, quitte à matraquer des baisses de prix ensuite.",
          "- Riposte factuelle : « Sur quelles **ventes réelles** s'appuie ce prix ? Voici les trois dernières ventes signées, comparables, sur votre quartier. Un prix trop haut grille le bien pendant les 3-4 premières semaines, là où l'intérêt est maximal — et il se vend au final plus **long** et moins **cher**. »",
          "- Recadrer : « Je ne vous vends pas le prix qui vous fait plaisir, je vous vends le prix qui vous fait **signer**. »",
          "## « Vos honoraires sont trop élevés »",
          "- Ne vous justifiez pas en vous excusant. Montrez la **valeur** : meilleur prix net vendeur obtenu, sécurité juridique, tri des acquéreurs, temps gagné. « Mes honoraires ne vous coûtent pas, ils vous rapportent. »",
          "- Rappel de cadre : la loi n'impose aucun tarif, les honoraires sont **librement fixés**, mais votre **barème doit être affiché** (agence, vitrine, annonces). Jouez la transparence, jamais la justification gênée. (Argumentaire complet au module Défendre ses honoraires.)",
          "## « Je ne suis pas pressé, je teste le marché »",
          "- Un bien « pour voir », trop cher, s'use. Script : « Tester trop haut, c'est brûler vos meilleures semaines. Posons le juste prix maintenant ; si vous n'êtes pas pressé, autant vendre **au mieux**, pas **au plus long**. »",
          "## « Je vais en parler à mon conjoint / je vais réfléchir »",
          "- Même méthode qu'en vente : faire préciser le frein, isoler, et **fixer un second rendez-vous** avec les deux décideurs présents. Ne repartez jamais sans date.",
          "## Pièges à éviter",
          "- Surenchérir sur le prix d'un concurrent pour emporter le mandat : vous héritez d'un bien invendable.",
          "- Prendre un mandat simple sans conviction : peu d'engagement, peu de résultat.",
          "## Mini cas pratique",
          "À Saint-Pierre (Martigues), un propriétaire veut mettre sa villa à 580 000 € parce qu'une agence lui a « promis » ce prix, contre 545 000 € selon vos comparables DVF. Plutôt que de surenchérir ou d'abandonner, proposez un mandat au juste prix avec une **clause de revoyure à 4 semaines** : « Si le marché me donne tort, je m'aligne ; donnez-moi un mois pour vous le prouver en exclusivité. » Vous sécurisez le mandat sans valider la surévaluation."
        ]
      },
      {
        "titre": "Le catalogue des objections ACQUÉREUR (visite et offre)",
        "contenu": [
          "Côté acquéreur, les objections jaillissent en **visite** et au moment de l'**offre**. Les traiter transforme un visiteur hésitant en acheteur décidé.",
          "## « Il y a trop de travaux »",
          "- Chiffrer factuellement : « Comptons ensemble : cuisine, peintures, sol — autour de 25 000 €. Le bien est à 3 000 €/m² contre 3 600 €/m² pour un équivalent rénové : les travaux sont **déjà dans le prix**, et vous le faites **à votre goût**. »",
          "- Recadrer (boomerang) : « Les travaux, c'est l'occasion de créer de la **valeur** et de personnaliser — un bien refait aux goûts d'un autre, vous le repayez sans l'aimer. »",
          "## « C'est au-dessus de mon budget »",
          "- Distinguer budget et valeur : si le bien plaît mais dépasse, travaillez le **financement** (allongement de durée, apport, courtier) et l'**écart réel** (division en mensualité).",
          "- Pensez au **budget net acheteur** : rappelez l'ordre de grandeur des frais d'acquisition (environ 7 à 8 % dans l'ancien, 2 à 3 % dans le neuf) pour que l'offre soit réaliste dès le départ.",
          "## « Je veux voir d'autres biens avant de décider »",
          "- Légitime, mais dangereux sur un coup de cœur : « Comparer, c'est sain. Mais ce bien-là coche tous vos critères et il est rare sur le secteur : voulez-vous vraiment prendre le risque qu'il parte pendant que vous comparez ? »",
          "- Reprendre la main : « Faisons une offre à un prix que vous assumez, sous conditions : vous gardez votre comparaison, et vous sécurisez le bien. »",
          "## « Le DPE est mauvais (F ou G) »",
          "- Transparence : une étiquette F ou G implique des travaux énergétiques et, en location, un calendrier d'interdiction progressif — **G interdit à la location depuis 2025, F à partir de 2028, E à partir de 2034**, avec gel des loyers F/G depuis 2022 (voir module DPE et performance énergétique).",
          "- Traiter : « C'est **négociable et finançable** : le prix en tient compte, des aides existent (MaPrimeRénov'), et une rénovation fait gagner des classes **et** de la valeur à la revente. »",
          "## « Il y a du bruit / pas d'extérieur / étage élevé sans ascenseur »",
          "- Compensation : reconnaître puis compenser. « Pas d'extérieur, c'est vrai — en échange, un parc à 100 m, un prix inférieur de 8 % au marché et zéro entretien. »",
          "- Ne jamais nier un défaut objectif : le client le voit, le nier vous décrédibilise.",
          "## « Je dois d'abord valider mon prêt »",
          "- Transformer l'attente en action : « Parfait, c'est exactement ce qu'il faut sécuriser. Faisons une offre **sous condition suspensive de prêt** — c'est votre protection légale — et lançons le financement dès aujourd'hui avec un courtier. »",
          "## Pièges à éviter",
          "- Laisser l'acquéreur « comparer » sans lui faire poser d'offre : il se refroidit.",
          "- Minimiser un défaut au lieu de le compenser.",
          "## Mini cas pratique",
          "Devant un T4 à rénover à Ferrières (Martigues) affiché 215 000 €, l'acquéreur bloque sur les travaux. Vous chiffrez (30 000 €), comparez à un T4 rénové du quartier vendu 280 000 €, et démontrez qu'après travaux le bien crée environ 35 000 € de valeur. Le « trop de travaux » devient un **argument d'achat**, et vous enchaînez sur une offre."
        ]
      },
      {
        "titre": "Les objections en prospection et au téléphone",
        "contenu": [
          "La prospection et le téléphone ont leurs objections propres : sans visuel, sans bien à montrer, vous n'avez que votre **voix, votre écoute et votre méthode**. L'objectif d'un appel n'est jamais de vendre, mais d'**obtenir le rendez-vous**.",
          "## Les règles du jeu au téléphone",
          "- Un seul but par appel : **décrocher le rendez-vous d'estimation**, pas convaincre à distance.",
          "- Le sourire s'entend : **ton posé, débit calme**, on ne récite pas, on dialogue.",
          "- On accueille toujours l'objection avant d'y répondre, exactement comme en face-à-face.",
          "## « Je ne vends pas par agence / je me débrouille seul »",
          "- Accueillir : « Je comprends, beaucoup commencent ainsi. »",
          "- Ouvrir : « Justement, un avis de valeur gratuit et sans engagement vous servira, que vous passiez par une agence ou non. Quand puis-je passer, mardi ou jeudi ? »",
          "## « J'ai déjà une (ou plusieurs) agence(s) »",
          "- Ne dénigrez pas le confrère : « Très bien, c'est que vous êtes vendeur. »",
          "- Différenciez : « Un deuxième regard, un autre fichier d'acquéreurs, une autre stratégie — ça ne coûte rien et ça peut tout changer. On se voit 20 minutes ? »",
          "## « Envoyez-moi un mail / votre plaquette »",
          "- C'est souvent un congé poli. Reprenez la main : « Je peux le faire, mais une plaquette n'estime pas votre bien. Donnons-nous 20 minutes sur place, c'est bien plus utile — mercredi 18 h ? »",
          "## « Je passe par le notaire / entre particuliers »",
          "- Valorisez votre complémentarité : « Le notaire sécurise l'acte, c'est son métier ; moi, je trouve et je sélectionne les acquéreurs, je négocie et je vends. Les deux ne s'opposent pas. »",
          "## « Je n'ai pas le temps »",
          "- Prenez acte et cadrez court : « Justement, je prends tout en charge pour vous en faire gagner. 15 minutes suffisent pour démarrer — quel créneau vous arrange le moins mal cette semaine ? »",
          "## Le barrage du standard ou de la secrétaire",
          "- Soyez courtois, clair et assumé : « Bonjour, je souhaite joindre M. Durand au sujet de la vente de son bien, c'est de la part de l'agence. »",
          "- Pas de ruse : la franchise passe mieux et respecte votre déontologie.",
          "## Scripts mot pour mot",
          "- « Je comprends ; donnons-nous simplement 20 minutes, sans engagement. Mardi ou jeudi ? »",
          "- « Une estimation gratuite vous servira quoi que vous décidiez ensuite. »",
          "- « Plutôt un mail ou un vrai rendez-vous qui vous donne un chiffre fiable ? »",
          "## Mini cas pratique",
          "Vous appelez un propriétaire d'une annonce « de particulier » à La Couronne (Martigues). Il lâche : « Pas d'agence, merci. » Vous accueillez, puis : « Aucun souci. Juste pour info, j'ai deux acquéreurs en recherche active sur La Couronne ; si l'un d'eux correspond, ce serait dommage de passer à côté. Je peux passer vous voir jeudi, sans engagement ? » L'objection de principe tombe devant un bénéfice concret et daté."
        ]
      },
      {
        "titre": "Les garde-fous juridiques : vos meilleurs arguments de réassurance",
        "contenu": [
          "Beaucoup d'objections ne sont que l'expression d'une **peur de s'engager**. Or la loi française protège fortement l'acquéreur. Connaître ces garde-fous, c'est transformer l'angoisse du client en **sérénité** — et faire de la loi votre meilleur argument de closing.",
          "## Les 10 jours de rétractation (loi SRU)",
          "- L'acquéreur **non-professionnel** d'un logement dispose d'un **délai de rétractation de 10 jours** (article L271-1 du Code de la construction et de l'habitation).",
          "- Le délai court **à compter du lendemain de la première présentation de la notification** du compromis signé (lettre recommandée, remise en main propre ou voie électronique).",
          "- Pendant ces 10 jours, l'acquéreur peut renoncer **sans motif ni pénalité** et récupérer l'intégralité de son dépôt. « Vous réservez le bien sans vous enfermer. »",
          "## La condition suspensive de prêt (loi Scrivener)",
          "- Dès que l'acquéreur finance par un **emprunt**, le compromis doit comporter une **condition suspensive d'obtention de prêt** (protection d'ordre public, loi Scrivener, Code de la consommation), d'une durée **d'au moins un mois**.",
          "- Si le prêt est **refusé**, la vente est annulée de plein droit et le dépôt de garantie est **restitué**. « Vous ne risquez pas de perdre votre argent si la banque dit non. »",
          "## Le délai de réflexion sur l'offre de prêt",
          "- Une fois l'offre de prêt reçue, elle doit être **maintenue 30 jours minimum** par la banque, et l'emprunteur bénéficie d'un **délai de réflexion de 10 jours** : il ne peut l'accepter qu'à partir du 11ᵉ jour (loi Scrivener).",
          "- Autrement dit, l'acquéreur n'est **jamais pris de vitesse** sur son financement : un argument fort contre le « je n'ai pas le temps de décider ».",
          "## Le DPE opposable : la transparence rassure",
          "- Le **DPE est opposable** : l'acquéreur peut se fier légalement à ses résultats. Loin d'être un risque, c'est une **garantie de transparence** que vous mettez en avant plutôt que de la subir.",
          "## Les autres conditions suspensives qui sécurisent",
          "- On peut conditionner la vente à l'obtention d'un **certificat d'urbanisme**, à l'**absence de servitude** ou de préemption gênante, voire à la **vente d'un bien** de l'acquéreur.",
          "- Chaque condition suspensive est un **filet de sécurité** : présentée comme telle, elle lève la peur de l'irréversible.",
          "## Comment transformer ces protections en arguments",
          "- Nommez la protection au bon moment : « La loi vous laisse 10 jours pour changer d'avis, et votre prêt est une condition de la vente. »",
          "- Reliez-la au closing : « Posons l'offre aujourd'hui ; vous êtes protégé à chaque étape, et vous sécurisez le bien avant qu'un autre ne passe. »",
          "## Pièges à éviter",
          "- Ne présentez jamais la rétractation comme une raison de signer « pour voir » : vous perdez des compromis et fragilisez le vendeur.",
          "- Respectez scrupuleusement le **formalisme** (notification, délais, mentions) : un vice de forme peut rouvrir les délais ou annuler l'engagement.",
          "- Ne donnez jamais de conseil juridique définitif à la place du notaire : vous informez, il sécurise l'acte.",
          "## Mini cas pratique",
          "Un primo-accédant à Saint-Julien (Martigues) hésite : « Et si je me trompe, si la banque refuse ? » Vous déroulez les garde-fous : 10 jours pour se rétracter sans frais, condition suspensive de prêt qui restitue le dépôt en cas de refus, délai de réflexion sur l'offre bancaire. La peur de l'irréversible disparaît, et vous obtenez l'offre écrite le jour même."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Une objection est le plus souvent le signe que…",
        "options": [
          "Le client n'est pas intéressé",
          "Le client s'intéresse et cherche à être rassuré",
          "Il faut baisser le prix",
          "La vente est perdue"
        ],
        "correct": 1,
        "explication": "Un client indifférent n'objecte pas : l'objection traduit un intérêt assorti d'un frein à lever."
      },
      {
        "question": "Avant de répondre à une objection, le premier réflexe est…",
        "options": [
          "Baisser le prix",
          "La creuser pour identifier le vrai frein",
          "Changer de sujet",
          "Conclure immédiatement"
        ],
        "correct": 1,
        "explication": "On ne traite jamais une objection qu'on n'a pas comprise : on creuse (« c'est-à-dire ? », « par rapport à quoi ? ») avant d'argumenter."
      },
      {
        "question": "Face à « je vais réfléchir », la meilleure réaction est…",
        "options": [
          "« Rappelez-moi quand vous voulez »",
          "Faire préciser le frein, l'isoler et fixer une échéance datée",
          "Insister lourdement jusqu'au oui",
          "Abandonner la vente"
        ],
        "correct": 1,
        "explication": "On fait exprimer le vrai frein caché, on l'isole, et on fixe un rendez-vous de suivi daté plutôt que de laisser le client refroidir."
      },
      {
        "question": "La question « À part ce point, tout le reste vous convient ? » sert à…",
        "options": [
          "Vendre plus cher",
          "Isoler l'objection pour éviter les objections en chaîne",
          "Gagner du temps",
          "Faire baisser le vendeur"
        ],
        "correct": 1,
        "explication": "Isoler ramène un brouillard de réserves à un seul obstacle nommé : une fois cet unique frein levé, il n'y a plus de raison de ne pas avancer."
      },
      {
        "question": "Pour traiter une objection sans braquer le client, on remplace le « oui, mais… » par…",
        "options": [
          "« non, car… »",
          "« oui, et c'est justement pour cela que… »",
          "« vous vous trompez »",
          "un silence gêné"
        ],
        "correct": 1,
        "explication": "Le « mais » annule ce qui précède et oppose ; le « oui, et » relie l'objection à votre argument et maintient l'alliance avec le client."
      },
      {
        "question": "Pour rassurer un acquéreur qui a peur de s'engager, quel garde-fou juridique pouvez-vous citer ?",
        "options": [
          "Un délai de rétractation de 10 jours après notification du compromis (article L271-1 du CCH)",
          "Un délai de rétractation de 30 jours",
          "Aucune protection : la signature est définitive",
          "Une garantie décennale sur le prix"
        ],
        "correct": 0,
        "explication": "L'acquéreur non-professionnel dispose de 10 jours de rétractation à compter du lendemain de la notification du compromis signé, sans motif ni pénalité (L271-1 CCH) ; combiné à la condition suspensive de prêt, c'est un argument de réassurance décisif."
      },
      {
        "question": "Une objection vague et répétée comme « il faut voir, on verra » est le plus souvent...",
        "options": [
          "une objection sincère et unique",
          "un prétexte qui cache un autre frein",
          "un refus définitif et sans appel",
          "une objection purement tactique de négociation"
        ],
        "correct": 1,
        "explication": "Une objection vague et répétée trahit généralement un prétexte, alors qu'une objection précise et argumentée est plutôt sincère."
      },
      {
        "question": "Pour vérifier si une objection est sincère ou n'est qu'un prétexte, la question-test la plus fiable est...",
        "options": [
          "« Si je règle ce point, on avance ? »",
          "« Vous avez d'autres questions ? »",
          "« Vous voulez réfléchir ? »",
          "« C'est votre dernier mot ? »"
        ],
        "correct": 0,
        "explication": "S'il dit oui, l'objection était sincère et unique ; s'il enchaîne un autre frein, le premier n'était qu'un prétexte."
      },
      {
        "question": "Dans la méthode CRAC, les quatre temps sont, dans l'ordre...",
        "options": [
          "Convaincre, Rassurer, Argumenter, Conclure",
          "Comprendre, Répondre, Accueillir, Clore",
          "Creuser, Reformuler, Argumenter, Contrôler",
          "Creuser, Répondre, Accepter, Céder"
        ],
        "correct": 2,
        "explication": "CRAC signifie Creuser, Reformuler, Argumenter, Contrôler, souvent précédé d'un temps zéro : Accueillir."
      },
      {
        "question": "La technique dite de « l'édredon » consiste à...",
        "options": [
          "répondre aussitôt par un argument fort",
          "contredire fermement le client",
          "ignorer l'objection et changer de sujet",
          "amortir l'objection sans la contredire pour rester allié"
        ],
        "correct": 3,
        "explication": "L'édredon amortit le choc (« je comprends », « bonne question ») et désamorce l'agressivité avant d'argumenter."
      },
      {
        "question": "Pour argumenter efficacement face à une objection, il vaut mieux...",
        "options": [
          "empiler le plus d'arguments possible",
          "sortir une seule preuve forte",
          "répéter plusieurs fois le même argument",
          "parler plus fort que le client"
        ],
        "correct": 1,
        "explication": "Un argument fort et prouvé vaut mieux que dix arguments faibles qui diluent le message."
      },
      {
        "question": "Face à un acquéreur qui lance « c'est trop cher » d'emblée, le réflexe à éviter absolument est...",
        "options": [
          "baisser le prix immédiatement",
          "creuser « par rapport à quoi ? »",
          "sortir des comparables DVF",
          "ramener l'écart à une mensualité"
        ],
        "correct": 0,
        "explication": "Baisser dès la première objection avoue que le prix était gonflé et invite le client à pousser encore."
      },
      {
        "question": "Pour prouver qu'un prix est dans le marché, l'agent s'appuie en priorité sur...",
        "options": [
          "les prix réellement signés (base DVF)",
          "les prix affichés des concurrents",
          "sa seule intuition de professionnel",
          "le prix souhaité par le vendeur"
        ],
        "correct": 0,
        "explication": "Le prix affiché ne prouve rien ; seul le prix réellement payé, consultable sur la base DVF, fait référence."
      },
      {
        "question": "La technique de « la division » pour traiter un écart de prix consiste à...",
        "options": [
          "diviser le bien en plusieurs lots",
          "partager la commission avec l'acquéreur",
          "ramener l'écart à un coût mensuel sur la durée du prêt",
          "proposer deux biens au choix"
        ],
        "correct": 2,
        "explication": "Fractionner l'écart en mensualité (« 5 000 €, c'est moins de 30 € par mois sur 20 ans ») dédramatise le montant."
      },
      {
        "question": "Au vendeur qui veut confier son bien à plusieurs agences, l'argument-clé est...",
        "options": [
          "« c'est interdit par la loi »",
          "« vous paierez plusieurs commissions »",
          "« aucune agence n'acceptera »",
          "« plus d'agences n'est pas plus d'acheteurs »"
        ],
        "correct": 3,
        "explication": "Ce sont les mêmes acquéreurs du secteur qui voient le bien partout ; à prix et photos différents, il se banalise."
      },
      {
        "question": "Quand un concurrent a annoncé au vendeur un prix nettement plus élevé que le vôtre, il s'agit souvent...",
        "options": [
          "d'un mandat gonflé pour emporter la signature",
          "d'une meilleure connaissance du marché",
          "d'une simple erreur de calcul",
          "d'un prix imposé par la loi"
        ],
        "correct": 0,
        "explication": "Un prix trop haut grille le bien les premières semaines, et le bien se vend finalement plus long et moins cher."
      },
      {
        "question": "Un client qui recule, se tait et interroge son conjoint du regard exprime...",
        "options": [
          "un signal d'achat immédiat",
          "une objection muette à faire sortir",
          "un refus définitif",
          "une objection tactique de négociation"
        ],
        "correct": 1,
        "explication": "L'objection muette est un frein non exprimé qu'il faut faire verbaliser (« je vous sens hésitant, qu'est-ce qui vous retient ? »)."
      },
      {
        "question": "Transformer « il y a trop de travaux » en « c'est justement pour ça que le prix est déjà attractif et que vous personnalisez » relève de la technique...",
        "options": [
          "du boomerang",
          "de la division",
          "de l'alternative",
          "de l'édredon"
        ],
        "correct": 0,
        "explication": "Le boomerang retourne l'objection pour en faire une raison d'acheter."
      },
      {
        "question": "En prospection téléphonique, l'objectif unique d'un appel confronté à une objection est...",
        "options": [
          "de conclure la vente à distance",
          "de convaincre le propriétaire de baisser son prix",
          "d'obtenir le rendez-vous d'estimation",
          "d'envoyer une plaquette par mail"
        ],
        "correct": 2,
        "explication": "On ne vend pas au téléphone ; le seul but est de décrocher le rendez-vous, sans visuel ni bien à montrer."
      }
    ]
  },
  {
    "id": "closing",
    "titre": "Conclure la vente (closing)",
    "icone": "✍️",
    "categorie": "Commercial",
    "resume": "Repérer les signaux, oser la question de conclusion, maîtriser les techniques, respecter le cadre légal et sécuriser le oui jusqu'à l'acte.",
    "duree": "42 min",
    "lecons": [
      {
        "titre": "Oser conclure : l'état d'esprit du closeur",
        "contenu": [
          "La conclusion est le moment où tout le travail de prospection, de découverte, de visite et de négociation se transforme (ou non) en signature. Beaucoup de négociateurs excellents sur le reste du parcours **échouent au closing**, non par manque de compétence, mais par peur du « non ».",
          "## Le closing n'est pas un instant, c'est un aboutissement",
          "- On ne referme bien que ce qu'on a bien ouvert : un closing facile est le fruit d'une **découverte** sérieuse et d'une **argumentation** adaptée (voir modules Découverte et Vente d'élite).",
          "- Conclure, ce n'est pas **forcer** une décision : c'est **aider** le client à prendre celle qu'il a déjà envie de prendre.",
          "- Le client **attend** souvent qu'on l'aide à franchir le pas. Ne pas conclure, c'est le laisser seul face à son doute et risquer qu'il reporte, puis renonce.",
          "- Le closing se prépare dès le premier contact : chaque étape bien menée rend la suivante plus facile à demander.",
          "## La posture : un conseiller qui assume de décider avec le client",
          "- Le bon closeur n'est ni un vendeur sous pression, ni un accompagnateur passif : c'est un **conseiller qui ose prendre la main** au bon moment.",
          "- Il porte une **conviction** : s'il est persuadé que le bien correspond au besoin, il considère qu'il serait malhonnête de ne pas pousser à la décision.",
          "- La conviction est **contagieuse** : un négociateur serein et affirmé rassure ; un négociateur qui hésite installe le doute.",
          "## La peur du non : l'ennemi numéro un",
          "- On n'ose pas poser la question de conclusion de peur d'entendre « non ». Résultat : on continue d'argumenter, on noie le poisson, et on **laisse filer** le moment mûr.",
          "- Un « non » n'est presque jamais définitif : c'est le plus souvent une **objection déguisée** (voir module Vaincre les objections). Il ouvre un dialogue, il ne le ferme pas.",
          "- Règle : **le pire closing est celui qu'on ne tente pas**. Une vente non demandée est une vente perdue à coup sûr.",
          "## L'esprit « ABC » adapté à l'immobilier",
          "L'adage américain « Always Be Closing » (toujours être en train de conclure) se traduit chez nous par une chaîne d'engagements : on conclut le rendez-vous de découverte pour décrocher la visite, la visite pour obtenir l'offre, l'offre pour obtenir le compromis. Chaque étape **prépare et verrouille** la suivante.",
          "## Mnémonique : OSER à conclure",
          "- **O — Observer** les signaux d'achat.",
          "- **S — Synthétiser** : récapituler les oui obtenus et faire le bilan.",
          "- **E — Engager** la question de conclusion, puis **se taire**.",
          "- **R — Reverrouiller** immédiatement par écrit.",
          "## Cas pratique",
          "À Martigues, un couple visite pour la deuxième fois un T4 à La Couronne. Ils sont enthousiastes, mais le négociateur, mal à l'aise, enchaîne dix minutes d'arguments supplémentaires sur le quartier. Le couple repart « pour réfléchir » et achète ailleurs le lendemain. Le bien était vendu dans leur tête ; il ne restait qu'à le leur faire dire.",
          "## Erreurs fréquentes",
          "- Attendre « le bon moment » parfait, qui ne vient jamais.",
          "- Confondre conclure et faire pression.",
          "- Interpréter un « non » comme une fin plutôt que comme une étape.",
          "- Se dévaloriser (« je ne veux pas insister ») alors que demander la décision fait partie du service rendu au client."
        ]
      },
      {
        "titre": "Repérer les signaux d'achat : quand conclure",
        "contenu": [
          "La première erreur en conclusion : **ne pas oser** ; la deuxième : conclure **trop tard**. Le closeur repère le moment où le client est **mûr** — ce qu'on appelle le point de maturité — et saisit l'instant.",
          "## Signaux verbaux",
          "- Il **se projette** : « et si on mettait le bureau ici ? », « les enfants seraient dans quelle école ? ».",
          "- Il pose des questions de **détail concret** : disponibilité, date d'entrée, charges, taxe foncière, travaux, modalités de financement.",
          "- Il demande une **confirmation** : « donc les charges sont bien de 120 € par mois ? », « la cuisine reste, c'est ça ? ».",
          "- Il **parle au présent ou au futur de possession** : « notre chambre », « quand on sera installés ».",
          "- Il demande ce qui se passe **après** : « et ensuite, comment ça se passe ? », « il faut déjà un acompte ? ».",
          "- Il **négocie un détail** (date de remise des clés, un meuble, une finition) : on ne négocie que ce qu'on envisage d'acheter.",
          "## Signaux non verbaux",
          "- Il **relit** les documents, reprend les photos, revient dans une pièce, refait un tour.",
          "- **Changement de posture** : il se détend, s'assoit, sourit, ralentit, touche les matériaux (le plan de travail, une poignée, la cheminée).",
          "- Il **interroge son conjoint du regard**, cherche son approbation, ils échangent à voix basse.",
          "- Il **reste** plus longtemps que prévu et ne regarde plus sa montre.",
          "## Signaux côté vendeur (prise de mandat)",
          "- Le vendeur demande **comment vous allez vous y prendre**, sur quels supports, en combien de temps : il se projette avec vous.",
          "- Il évoque **l'après-vente** : son déménagement, son prochain achat, le calendrier. Autant de signes qu'il est prêt à confier le bien.",
          "## Provoquer et tester les signaux : la question-test",
          "Si les signaux tardent, on peut les **provoquer** par une question-test (une conclusion d'essai), sans risque : une réponse positive fait avancer, une réponse négative révèle le frein à traiter.",
          "- « Vous vous verriez vivre ici ? »",
          "- « Sur une échelle de 1 à 10, où situez-vous ce bien ? » — s'il dit 8, enchaînez « qu'est-ce qui manque pour arriver à 10 ? » et vous isolez le dernier frein.",
          "- « Qu'est-ce qui vous plaît le plus dans cette maison ? » — s'il répond spontanément et avec chaleur, il a déjà acheté dans sa tête.",
          "## La règle d'or",
          "Dès qu'un signal apparaît, **arrêtez d'argumenter** et **engagez la conclusion**. Continuer à vendre quand c'est gagné, c'est risquer de **réveiller** des objections et de faire douter un client déjà convaincu : c'est la **survente**, et trop d'arguments tuent la vente.",
          "## Cas pratique",
          "En visite d'un T3 à Jonquières, l'acquéreuse dit simplement « on serait bien, là, le matin, avec le café sur le balcon ». Signal faible mais net : le négociateur enchaîne aussitôt une conclusion d'essai — « vous vous voyez déjà y prendre vos petits-déjeuners ? » — puis bascule sur l'offre. S'il avait répondu par un énième argument sur la copropriété, il aurait laissé l'émotion retomber.",
          "## Erreurs fréquentes",
          "- Parler tellement qu'on n'entend pas le signal.",
          "- Rater un signal faible (un simple « c'est agréable, ici ») qui méritait une conclusion d'essai immédiate.",
          "- Prendre un signal pour argent comptant sans le vérifier : une question-test confirme la maturité avant de conclure pour de bon."
        ]
      },
      {
        "titre": "Le pré-closing : conclusions d'essai et verrouillages",
        "contenu": [
          "Les meilleurs closings ne commencent pas à la fin : ils se **préparent tout au long** du parcours par une série de petits verrouillages. C'est le **pré-closing** : quand arrive la question finale, la décision est déjà largement prise.",
          "## Les conclusions d'essai (trial close)",
          "Une conclusion d'essai est une question qui **teste le niveau d'engagement** sans demander encore la décision finale. Elle est sans risque : réponse positive, on avance ; réponse négative, on a identifié un frein à traiter avant de conclure pour de bon.",
          "- « Si tout vous convient, vous seriez prêts à vous positionner rapidement ? »",
          "- « Entre ce bien et celui de ce matin, lequel vous correspond le mieux ? »",
          "- « Imaginons que le vendeur accepte votre budget : on y va ? »",
          "## La technique des petits oui (l'escalier d'engagement)",
          "On enchaîne des questions dont la réponse est **oui** pour installer une dynamique d'accord. Le principe psychologique de **cohérence** — rester cohérent avec ses engagements précédents — fait le reste : il est difficile de dire « non » au bout d'une série de « oui ».",
          "- « L'emplacement vous convient ? » — Oui.",
          "- « Le nombre de chambres correspond à votre besoin ? » — Oui.",
          "- « Le budget est dans votre enveloppe ? » — Oui.",
          "- « Alors il n'y a plus de raison d'attendre : on prépare l'offre ? »",
          "## Le pré-cadrage : annoncer la suite dès le départ",
          "Dès le début du rendez-vous, on **annonce le processus** pour que la conclusion paraisse naturelle :",
          "- « Aujourd'hui, si le bien vous plaît comme je le pense, on pourra poser une offre dès ce soir pour sécuriser votre place. »",
          "- Le client arrive ainsi préparé à décider : conclure n'est plus une surprise, mais une **étape prévue** et annoncée.",
          "## Verrouiller chaque étape",
          "- À chaque fin de rendez-vous, obtenez un **micro-engagement daté** : « On se revoit jeudi 18 h pour la deuxième visite. »",
          "- Reformulez et faites **valider** les besoins à voix haute : un besoin confirmé par le client devient un argument de conclusion imparable.",
          "- Un parcours jalonné de petits oui aboutit à un grand oui **sans rupture**.",
          "## Cas pratique",
          "Sur une prise de mandat à Martigues, le négociateur pré-cadre dès l'entrée : « À la fin de notre échange, si on est d'accord sur le prix et la stratégie, je vous propose qu'on signe le mandat pour ne pas perdre la saison. » Au moment de conclure, la signature est déjà **anticipée** : le vendeur l'attend.",
          "## Erreurs fréquentes",
          "- Sauter directement à la conclusion finale sans aucun verrouillage intermédiaire.",
          "- Poser une conclusion d'essai, puis ne pas écouter ni traiter le frein qu'elle a révélé.",
          "- Enchaîner des « petits oui » artificiels et évidents qui sonnent faux : les questions doivent rester sincères et utiles."
        ]
      },
      {
        "titre": "Les grandes techniques de conclusion",
        "contenu": [
          "Il n'existe pas une seule « bonne » technique : on **adapte** au profil du client (voir SONCAS, module Vente d'élite), au moment et au canal. Voici les grandes techniques, chacune avec son script.",
          "## L'alternative (le choix dirigé)",
          "- Principe : proposer un choix entre **deux « oui »**. Quelle que soit la réponse, le client a dit oui au principe.",
          "- Script mandat : « On part sur une exclusivité de 3 ou de 4 mois ? »",
          "- Script signature : « Vous préférez signer mardi matin ou jeudi en fin de journée ? »",
          "- Piège : ne jamais proposer « oui ou non » comme alternative — on propose deux modalités d'un même oui.",
          "## Le bilan (la balance de Benjamin Franklin)",
          "- Principe : récapituler une colonne d'**avantages** longue (construite avec le client) face à des **réserves** courtes, pour faire **pencher** la décision.",
          "- Script : « Reprenons : emplacement idéal, lumineux, sans travaux, dans votre budget, école à 300 m. En face, il reste la question du parking. Franchement, est-ce que ce seul point doit vous priver de tout le reste ? »",
          "- Astuce : faites lister les avantages **par le client** (il y adhère mieux) et minimisez les réserves.",
          "## La dernière objection (la conclusion conditionnelle)",
          "- Principe : transformer le dernier frein en **condition de signature**.",
          "- Script : « Si je règle la question du parking, on y va ? » — s'il dit oui, le frein n'est plus qu'un détail à traiter : la vente est faite.",
          "- C'est la jonction entre le traitement d'objection (module dédié) et le closing : on **isole** puis on **ferme**.",
          "## La présomption (l'affaire conclue)",
          "- Principe : agir **comme si** la décision était déjà prise, en douceur et sans arrogance.",
          "- Script : « Je prépare l'offre ; vous me confirmez l'orthographe exacte de vos noms pour le compromis ? »",
          "- Attention : à réserver aux signaux d'achat clairs. Sur un client hésitant, la présomption est perçue comme de la pression.",
          "## L'urgence et la rareté (réelles)",
          "- Principe : la peur de **rater** (le FOMO) est un moteur de décision légitime — à condition d'être vraie.",
          "- Script : « Ce bien a deux autres visites prévues ce week-end ; si vous le voulez, le plus sûr est de vous positionner par écrit dès ce soir. »",
          "- Règle déontologique **impérative** : ne **jamais inventer** un faux acquéreur ni une fausse visite. Le mensonge est une pratique trompeuse qui se retourne contre vous et engage votre responsabilité (voir la leçon sur le cadre juridique).",
          "## La projection (le futur possédé)",
          "- Principe : faire **vivre** la décision déjà prise, en parlant au futur de possession.",
          "- Script : « Vous vous voyez déjà recevoir pour les fêtes dans ce séjour ? On fait en sorte que ce soit chez vous à Noël ? »",
          "## La reformulation-récapitulatif",
          "- Principe : résumer en une phrase tout ce qui a été validé, puis enchaîner sur la décision.",
          "- Script : « Donc on est d'accord : le bien vous plaît, le budget est bon, le délai vous convient. Je lance l'offre ? »",
          "## Le petit oui (accords partiels)",
          "- Principe : enchaîner des accords partiels jusqu'au oui global (voir la leçon sur le pré-closing).",
          "## Le « qu'est-ce qui vous empêche de décider maintenant ? »",
          "- Principe : face à un « il faut que j'y réfléchisse » mou, demander calmement et directement ce qui retient le client.",
          "- On fait ainsi **exprimer le vrai frein** au lieu de le laisser partir avec son doute.",
          "## Adapter la technique au profil SONCAS",
          "- **Sécurité** : rassurez (garanties, diagnostics, accompagnement) avant de conclure.",
          "- **Orgueil** : valorisez le choix (« un bien rare, pour quelqu'un qui sait reconnaître la qualité »).",
          "- **Nouveauté, Confort, Argent, Sympathie** : appuyez la conclusion sur le moteur dominant identifié en découverte.",
          "## Cas pratique",
          "Un acquéreur hésite sur un T3 à Jonquières (Martigues). Les signaux d'achat sont nets, mais il dit « je dois en parler à ma femme ». Le négociateur combine **dernière objection** et **alternative** : « Si votre épouse est d'accord, vous êtes prêt à vous positionner ? (oui) Parfait : appelez-la maintenant, et selon sa réponse on pose l'offre ce soir ou demain matin — vous préférez quoi ? »",
          "## Erreurs fréquentes",
          "- Empiler les techniques jusqu'à ce que la manipulation devienne visible.",
          "- Utiliser l'urgence sans qu'elle soit réelle.",
          "- Choisir une technique qui ne correspond pas au profil du client."
        ]
      },
      {
        "titre": "La question de conclusion et le pouvoir du silence",
        "contenu": [
          "Toutes les techniques du monde ne servent à rien sans le geste central : **poser la question de conclusion**, clairement, puis **se taire**.",
          "## Poser une question fermée, claire, engageante",
          "- Une vraie question de conclusion appelle une décision : « On signe le mandat maintenant ? », « Vous la prenez à ce prix ? », « Je rédige l'offre ? ».",
          "- Évitez les formulations molles : « Vous voulez réfléchir ? », « Je vous laisse mon numéro ? » — elles **invitent au report**.",
          "- Dites-la avec **calme et assurance** : la voix ne doit ni trembler ni monter. La conviction est contagieuse (module Vente d'élite).",
          "- Posez-la **une fois**, nettement, sans l'enrober de précautions qui en diluent la force.",
          "## Le silence qui conclut",
          "Après la question de conclusion, **le premier qui parle « perd »**. Le silence met le client en situation de **décider**. Un silence de 5 à 15 secondes paraît une éternité au vendeur : tenez-le.",
          "- Ne **comblez pas** le silence par un nouvel argument : vous rouvririez la discussion et offririez une porte de sortie.",
          "- Ne **baissez pas le prix** dans le silence par malaise : c'est l'erreur classique qui coûte des milliers d'euros.",
          "- Regardez le client calmement, le stylo et le document prêts. Votre langage corporel doit dire « c'est le moment ».",
          "## Gérer la réponse",
          "- **Oui** : on **ne surjoue pas**, on remercie sobrement et on enchaîne immédiatement sur la formalisation écrite.",
          "- **Objection** : on la traite (module dédié), puis on **re-pose** la question de conclusion. On peut re-tenter plusieurs fois.",
          "- **Non franc** : on cherche à comprendre (« qu'est-ce qui vous retient vraiment ? ») et on préserve la relation : un non aujourd'hui n'est pas un non pour toujours.",
          "## Combien de fois retenter ?",
          "Les meilleurs closeurs **retentent** la conclusion après chaque objection levée. Abandonner à la première résistance, c'est passer à côté de la majorité des ventes : la plupart se signent **après** qu'une ou plusieurs objections ont été traitées, rarement du premier coup.",
          "## Cas pratique",
          "Après avoir présenté une offre à un vendeur martégal, le négociateur dit : « C'est un acquéreur financé, sans bien à vendre au préalable, qui peut signer le compromis sous dix jours. Je pense que c'est une belle opportunité. On l'accepte ? » — puis **il se tait**. Le vendeur réfléchit huit secondes et dit oui. S'il avait enchaîné « mais bon, vous faites comme vous voulez », il aurait tout cassé.",
          "## Erreurs fréquentes",
          "- Parler pour meubler le silence.",
          "- Poser une question ouverte (« alors, qu'en pensez-vous ? ») au lieu d'une question de décision.",
          "- Abandonner au premier « non ».",
          "- Poser la question de conclusion puis la répéter nerveusement sans laisser le temps de répondre."
        ]
      },
      {
        "titre": "Le cadre juridique et déontologique du closing",
        "contenu": [
          "Conclure vite et bien ne dispense jamais de respecter le droit : un closing non conforme peut rendre la vente ou les honoraires **nuls** et engager la responsabilité de l'agent. Voici les règles à tenir **au moment précis** où l'on conclut (le fond est détaillé dans les modules La prise de mandat et Compromis & financement).",
          "## Pas de mandat écrit, pas de closing (loi Hoguet)",
          "- La loi n° 70-9 du 2 janvier 1970 (loi Hoguet) impose un **mandat écrit** avant toute négociation : on ne conclut jamais une transaction sans mandat signé en bonne et due forme.",
          "- Les **honoraires** ne sont dus que si un mandat valable existe et désigne la partie qui les paie. Un closing brillant sur un mandat irrégulier ne rapporte **rien**.",
          "- Les honoraires doivent être **affichés TTC** (loi ALUR et décret n° 2016-173) ; on ne les improvise pas au moment de signer.",
          "## Aucune somme exigée de l'acquéreur au stade de l'offre",
          "- L'**article 1589-1 du Code civil** frappe de **nullité** tout versement exigé de celui qui s'engage à acquérir dans un engagement unilatéral : au stade de l'**offre d'achat**, on ne demande **ni chèque, ni acompte, ni dépôt**.",
          "- Le **dépôt de garantie** (souvent 5 à 10 % en pratique) n'intervient qu'au **compromis** et il est **séquestré** chez le notaire ou chez l'agent titulaire d'une garantie financière.",
          "## Transmettre toute offre écrite",
          "- L'agent a l'obligation de **transmettre au vendeur toute offre écrite** reçue : on ne filtre jamais les offres selon son propre intérêt.",
          "- Une **offre au prix du mandat, acceptée par le vendeur, rend la vente parfaite** dès l'accord sur la chose et le prix (**article 1583 du Code civil**). Le vendeur reste toutefois libre d'accepter ou non tant qu'il n'a pas donné son accord.",
          "## Les délais protecteurs à annoncer",
          "- **Rétractation SRU** : l'acquéreur non professionnel d'un logement dispose de **10 jours** pour se rétracter sans frais après notification de l'avant-contrat (**article L271-1 du Code de la construction et de l'habitation**).",
          "- **Loi Scrivener** : l'offre de prêt ne peut être acceptée qu'après un **délai de réflexion de 10 jours**, et la **condition suspensive d'obtention de prêt** (durée minimale d'un mois) protège l'acquéreur qui finance par emprunt.",
          "- Annoncer clairement ces délais **sécurise** la vente : un client informé se rétracte moins qu'un client surpris.",
          "## Loyauté, information et lutte anti-blanchiment",
          "- **Devoir de loyauté et d'information** : pas de **fausse urgence**, pas de faux acquéreur, pas d'affirmation trompeuse. Une pratique commerciale trompeuse est sanctionnée et ruine la relation.",
          "- **LCB-FT / Tracfin** : l'agent est assujetti à la lutte contre le blanchiment (Code monétaire et financier). Au moment de concrétiser, il **vérifie l'identité** des parties, **s'interroge sur l'origine des fonds** et **déclare** à Tracfin toute opération suspecte.",
          "## Cas pratique",
          "Un acquéreur pressé propose de verser « un acompte de 5 000 € tout de suite pour bloquer le bien » dès l'offre. Le négociateur refuse poliment : « La loi l'interdit au stade de l'offre (article 1589-1 du Code civil). Votre offre écrite suffit à vous réserver la priorité ; le dépôt de garantie se fera au compromis, séquestré et sécurisé. » Il protège ainsi le client et l'agence.",
          "## Erreurs fréquentes",
          "- Négocier ou conclure sans mandat écrit valable.",
          "- Réclamer ou encaisser une somme auprès de l'acquéreur au stade de l'offre.",
          "- « Oublier » de transmettre une offre jugée trop basse.",
          "- Créer une fausse urgence (faux acquéreur, fausse offre) : illégal et dévastateur pour la réputation."
        ]
      },
      {
        "titre": "Conclure la prise de mandat",
        "contenu": [
          "La prise de mandat est un closing à part entière — souvent le plus décisif, car **sans mandat, pas de vente**. Pour le fond (durée, exclusivité, clauses, honoraires), voir le module La prise de mandat ; rappel juridique : le mandat doit être **écrit** et signé avant toute action (loi Hoguet).",
          "## Enchaîner juste après l'avis de valeur",
          "- Ne laissez aucun blanc entre l'estimation et la proposition de mandat : **enchaînez**.",
          "- Script : « On est d'accord sur le prix et sur la stratégie. Je vous prépare le mandat — je recommande l'**exclusivité** pour une mise en marché efficace. On signe maintenant ? » (alternative + présomption).",
          "## Valoriser l'exclusivité au moment de conclure",
          "- Rappelez le bénéfice en une phrase : « L'exclusivité, c'est un interlocuteur unique, un plan marketing complet et, statistiquement, une vente plus rapide et au meilleur prix. »",
          "- Pour défendre la durée et les **honoraires**, renvoyez aux modules La prise de mandat et Défendre ses honoraires : ne les rouvrez pas au moment du closing.",
          "## Lever la dernière objection du vendeur",
          "- Script : « Qu'est-ce qui vous empêcherait de me confier la vente **aujourd'hui** ? » — on fait sortir le vrai frein (prix, délai de réflexion, autre agence) et on le traite.",
          "- Face à « je veux comparer avec deux autres agences » : « Très bien. Qu'attendez-vous d'une agence ? (écoute) Si je vous démontre que je coche tout, on gagne du temps à tous les deux en démarrant tout de suite, non ? »",
          "## Sécuriser la signature",
          "- Ayez le **mandat prêt** et pré-rempli : un document qu'on va « juste imprimer » se signe plus facilement qu'un document à aller chercher.",
          "- Datez la **mise en marché** : « Je lance les photos et la diffusion dès demain. »",
          "- Pensez au **délai de rétractation de 14 jours** du vendeur-consommateur quand le mandat est signé **hors établissement** (à son domicile) : il faut l'en informer et, pour lancer la vente aussitôt, recueillir sa demande expresse d'exécution immédiate.",
          "## Cas pratique",
          "Chez CENTURY 21 Icaza Immobilier à Martigues, après un avis de valeur à 320 000 €, le vendeur dit « je vais réfléchir et voir une autre agence ». Le négociateur : « C'est légitime. Concrètement, qu'est-ce qui vous ferait choisir une agence plutôt qu'une autre ? (le résultat et la confiance) Sur le résultat, voici mes trois dernières ventes dans le quartier, au prix ; sur la confiance, je m'engage sur un point mensuel écrit. Si je coche vos deux critères, on démarre aujourd'hui en exclusivité 3 mois ? »",
          "## Erreurs fréquentes",
          "- Repartir « pour laisser réfléchir » sans date de rappel ni frein identifié.",
          "- Ne pas avoir le mandat sous la main au moment de conclure.",
          "- Négocier les honoraires dans la précipitation du closing au lieu de les avoir défendus en amont."
        ]
      },
      {
        "titre": "Conclure l'offre d'achat : faire écrire et faire accepter",
        "contenu": [
          "Côté transaction, conclure se joue en deux temps : **faire écrire l'offre** par l'acquéreur, puis **faire accepter** par le vendeur.",
          "## Côté acquéreur : transformer l'intention en offre écrite",
          "- Dès les signaux d'achat : « À ce prix, vous la prenez ? Je rédige votre offre tout de suite. »",
          "- Une **intention orale ne vaut rien** : seule l'**offre écrite** engage et fait avancer. Faites écrire **sur-le-champ**, tant que l'émotion est présente.",
          "- Rappel légal : au stade de l'offre d'achat, **aucune somme ne peut être exigée** de l'acquéreur, ni chèque ni acompte (**article 1589-1 du Code civil**). Le dépôt de garantie séquestré n'intervient qu'au compromis (voir module Compromis & financement).",
          "- Une **offre au prix** du mandat, acceptée par le vendeur, rend la vente **parfaite** dès l'accord sur la chose et le prix (**article 1583 du Code civil**). Expliquez-le à l'acquéreur : cela donne du poids à son geste et le responsabilise.",
          "## Soigner le contenu de l'offre",
          "- Précisez le **montant**, la **durée de validité** (souvent 5 à 10 jours), les **conditions** (prêt, montant financé, apport) et le **délai** souhaité pour le compromis.",
          "- Mentionnez la **condition suspensive d'obtention de prêt** quand l'acquéreur emprunte : elle le protège et témoigne du sérieux du dossier.",
          "- Joignez les éléments qui **rassurent le vendeur** : simulation de financement, accord de principe bancaire, situation de l'acquéreur.",
          "## Côté vendeur : présenter et faire accepter l'offre",
          "- Obligation : **toute offre écrite** reçue doit être **transmise** au vendeur (déontologie et mandat). On ne filtre jamais selon son propre intérêt.",
          "- Présentez l'offre avec son **contexte**, pas seulement un montant : qui est l'acquéreur, son financement, sa rapidité, la solidité du dossier.",
          "- Script de closing côté vendeur : « C'est un acquéreur financé, sérieux, qui peut signer vite. On l'accepte ? » — puis **silence**.",
          "- Rappelez l'intérêt d'une offre **sûre** : « Mieux vaut une offre solide à 305 000 € qu'une offre fragile à 312 000 € qui tombe dans deux mois. » La dynamique de négociation du prix est traitée dans le module Négociation.",
          "## Formaliser l'acceptation",
          "- Faites **dater et signer** l'acceptation par le vendeur (ou rédigez une contre-offre écrite) : l'accord doit être **tracé**.",
          "- Enchaînez immédiatement vers le rendez-vous de **compromis** (contenu juridique : module Compromis & financement).",
          "## Cas pratique",
          "À La Couronne, un acquéreur dit « je pense que c'est bon, je vous rappelle demain ». Le négociateur : « Je vous comprends, mais ce bien plaît et une intention orale ne vous protège pas. Posons votre offre par écrit maintenant : elle est valable 7 jours, sans aucun versement de votre part, et elle vous réserve la priorité le temps que le vendeur se décide. » L'offre est signée le soir même ; le lendemain, une autre visite confirme qu'il a bien fait.",
          "## Erreurs fréquentes",
          "- Laisser repartir un acquéreur « chaud » sans offre écrite.",
          "- Réclamer un chèque au stade de l'offre (interdit par l'article 1589-1 du Code civil).",
          "- Présenter une offre au vendeur en « filtreur » plutôt qu'en conseil.",
          "- Oublier la condition suspensive de prêt, exposant l'acquéreur qui finance par emprunt."
        ]
      },
      {
        "titre": "Après le oui : verrouiller, sécuriser, prévenir le remords",
        "contenu": [
          "Le closing ne s'arrête pas au « oui ». **Le temps est l'ennemi de la vente conclue** : entre l'accord et l'acte, tout peut encore s'effondrer. Le closeur **sécurise**.",
          "## Verrouiller par écrit, immédiatement",
          "- Un accord oral ne tient pas : **formalisez tout de suite** (offre signée, acceptation datée, récapitulatif écrit du prix, des conditions et du calendrier).",
          "- Envoyez un **écrit de confirmation** le jour même (un mail récapitulatif) : cela ancre la décision et fait courir le planning.",
          "## Prévenir le remords de l'acheteur (buyer's remorse)",
          "Après une grosse décision, le client doute : c'est la dissonance post-décision. C'est normal, et c'est dangereux, car le **délai de rétractation SRU de 10 jours** (article L271-1 du CCH, voir module Compromis & financement) permet à l'acquéreur de revenir en arrière sans frais.",
          "- **Rassurer après le oui** : félicitez, confortez le choix (« vous avez fait un excellent choix, et voici pourquoi… »).",
          "- **Rester présent** : un appel le lendemain, un point régulier. Le silence de l'agent nourrit le doute.",
          "- **Ré-ancrer les raisons d'achat** : rappelez les bénéfices que le client lui-même avait cités pendant la visite.",
          "## Piloter le tunnel compromis vers acte",
          "- Dressez un **rétroplanning partagé** : notification SRU (départ des 10 jours), dépôt du dossier bancaire, délai de réflexion Scrivener sur l'offre de prêt, levée des conditions suspensives, date d'acte (fond juridique : module Compromis & financement).",
          "- **Relancez** chaque acteur (acquéreur, banque ou courtier, notaire) : une vente se **perd souvent entre le compromis et l'acte**, faute de suivi.",
          "## Soigner les deux parties",
          "- Visez un **gagnant-gagnant** : les deux doivent se sentir respectées pour que la vente **tienne**. Un vendeur ou un acquéreur qui se sent lésé cherche une porte de sortie.",
          "## Cas pratique",
          "Offre acceptée le vendredi. Le négociateur appelle l'acquéreur le samedi matin : « Je voulais vous redire que vous avez fait un très bon choix : emplacement rare, prix cohérent. Je m'occupe de tout, on avance ensemble. » Le lundi, l'acquéreur, qui avait passé une nuit d'angoisse, est reconforté et ne se rétracte pas.",
          "## Erreurs fréquentes",
          "- Disparaître après le oui (« ouf, c'est signé ») : c'est précisément là que le doute s'installe.",
          "- Négliger un délai (SRU, réflexion Scrivener, condition de prêt) et laisser la vente s'effondrer.",
          "- Humilier le perdant d'une négociation : il se vengera en bloquant le dossier."
        ]
      },
      {
        "titre": "Les pièges et erreurs du closing",
        "contenu": [
          "Connaître les pièges, c'est déjà la moitié du travail. Voici les erreurs qui coûtent le plus de ventes.",
          "## Conclure trop tôt ou trop tard",
          "- **Trop tôt** : on demande la décision avant d'avoir créé le désir ou levé les freins — on provoque un « non » prématuré.",
          "- **Trop tard** : on dépasse le point de maturité, l'émotion retombe et le doute revient.",
          "## La survente (en faire trop)",
          "- Continuer d'argumenter après le signal d'achat **réveille** des objections. Quand c'est gagné, **on arrête de vendre**.",
          "## La pression excessive",
          "- Forcer, répéter, culpabiliser : le client se braque, ou dit oui puis se rétracte. Conclure, c'est aider à décider, pas contraindre.",
          "## Le mensonge et la fausse urgence",
          "- Inventer un faux acquéreur ou une fausse offre : un gain à court terme, mais la réputation et la responsabilité en jeu, et une pratique commerciale trompeuse sanctionnée. **Interdit.**",
          "## Oublier d'écrire",
          "- Se contenter d'un accord oral : sans écrit, rien n'est acquis.",
          "## Baisser le prix dans le silence",
          "- Céder par malaise pendant le silence de conclusion, c'est brader par inconfort et non par stratégie.",
          "## Réclamer un versement au mauvais moment",
          "- Exiger un chèque ou un acompte dès l'offre : interdit (article 1589-1 du Code civil) et destructeur de confiance.",
          "## Ne pas demander la décision",
          "- L'erreur reine : espérer que le client conclura tout seul. **Si vous ne demandez pas, la réponse est non.**",
          "## Lâcher au premier « non »",
          "- La majorité des ventes se concluent après une ou plusieurs objections traitées : on **retente**.",
          "## Mnémonique : les 3 interdits et le juste geste",
          "- **Ne pas mentir** (pas de fausse urgence, pas de faux acquéreur).",
          "- **Ne pas forcer** (pas de pression excessive).",
          "- **Ne rien encaisser** à l'offre (article 1589-1 du Code civil).",
          "- **Oser demander** la décision, puis **se taire** juste après.",
          "## Cas pratique",
          "Un négociateur, pressé par son objectif de fin de mois, invente « j'ai déjà une offre » pour pousser un acquéreur. Celui-ci demande à la voir, découvre le bluff, perd confiance et s'en va. Une seule vente forcée peut coûter dix recommandations."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Dès qu'un signal d'achat clair apparaît, le closeur doit…",
        "options": [
          "Ajouter trois arguments de plus pour être sûr",
          "Engager la conclusion",
          "Baisser le prix pour accélérer",
          "Reporter la décision au lendemain"
        ],
        "correct": 1,
        "explication": "Continuer d'argumenter quand c'est gagné (la survente) réveille des objections : dès le signal, on conclut."
      },
      {
        "question": "La technique de « l'alternative » consiste à…",
        "options": [
          "Proposer un choix entre deux « oui »",
          "Laisser le client seul avec sa décision",
          "Ne donner qu'une seule option à prendre ou à laisser",
          "Baisser la commission pour emporter l'accord"
        ],
        "correct": 0,
        "explication": "« Mardi ou jeudi ? », « 3 ou 4 mois ? » : le client choisit, mais dans tous les cas il dit oui au principe."
      },
      {
        "question": "Juste après avoir posé la question de conclusion, le bon réflexe est…",
        "options": [
          "D'enchaîner aussitôt un nouvel argument",
          "De se taire et de laisser le silence agir",
          "De baisser le prix pour rassurer",
          "De reformuler toute l'offre depuis le début"
        ],
        "correct": 1,
        "explication": "Le premier qui parle « perd » : le silence met le client en situation de décider ; combler ce silence rouvre la discussion."
      },
      {
        "question": "Au stade de l'offre d'achat, l'acquéreur…",
        "options": [
          "Ne doit verser aucune somme ni chèque (article 1589-1 du Code civil)",
          "Doit verser 10 % du prix immédiatement",
          "Doit régler les honoraires d'agence",
          "Verse déjà le dépôt de garantie séquestré"
        ],
        "correct": 0,
        "explication": "L'article 1589-1 du Code civil frappe de nullité tout versement exigé à l'offre ; le dépôt séquestré n'intervient qu'au compromis."
      },
      {
        "question": "Une offre au prix du mandat, acceptée par le vendeur…",
        "options": [
          "Rend la vente parfaite (accord sur la chose et le prix, art. 1583 du Code civil)",
          "N'a aucune valeur juridique tant qu'il n'y a pas d'acte",
          "Oblige l'agent à réduire ses honoraires",
          "Peut être ignorée par l'agent si elle l'arrange"
        ],
        "correct": 0,
        "explication": "Selon l'article 1583 du Code civil, la vente est parfaite dès l'accord sur la chose et le prix ; l'agent doit transmettre toute offre écrite."
      },
      {
        "question": "Juste après le « oui » du client, le closeur doit avant tout…",
        "options": [
          "Verrouiller par écrit et conforter la décision",
          "Disparaître, puisque c'est signé",
          "Attendre tranquillement la fin du délai de rétractation",
          "Tenter de renégocier le prix à la hausse"
        ],
        "correct": 0,
        "explication": "On formalise tout de suite et on prévient le remords de l'acheteur : le délai SRU de 10 jours permet de revenir en arrière, et le temps est l'ennemi de la vente conclue."
      },
      {
        "question": "Avant de conclure une transaction, l'agent immobilier doit impérativement disposer…",
        "options": [
          "D'un mandat écrit et signé (loi Hoguet)",
          "D'un simple accord verbal du vendeur",
          "Uniquement d'une carte de visite",
          "De l'autorisation de la mairie"
        ],
        "correct": 0,
        "explication": "La loi Hoguet (loi n° 70-9 du 2 janvier 1970) impose un mandat écrit avant toute négociation ; sans mandat valable, les honoraires ne sont pas dus."
      },
      {
        "question": "Selon le module, le pire closing est...",
        "options": [
          "celui qu'on ne tente pas",
          "celui qu'on tente trop tôt",
          "celui qui dure trop longtemps",
          "celui qu'on formalise par écrit"
        ],
        "correct": 0,
        "explication": "Une vente non demandée est perdue à coup sûr : ne pas oser poser la question de conclusion est l'erreur reine."
      },
      {
        "question": "Un acquéreur qui demande « les enfants seraient dans quelle école ? » émet...",
        "options": [
          "un signal d'achat : il se projette",
          "une objection de temporisation",
          "un refus poli",
          "une question piège à éviter"
        ],
        "correct": 0,
        "explication": "Se projeter dans le bien (école, aménagement, date d'entrée) est un signal d'achat clair."
      },
      {
        "question": "Continuer à argumenter alors que le client a déjà donné des signaux d'achat s'appelle...",
        "options": [
          "la survente, qui réveille des objections",
          "le pré-closing, qui verrouille",
          "l'ancrage, qui rassure",
          "le calibrage, qui synchronise"
        ],
        "correct": 0,
        "explication": "Quand c'est gagné, on arrête de vendre : trop d'arguments réveillent le doute et tuent la vente."
      },
      {
        "question": "Une « conclusion d'essai » (trial close) sert à...",
        "options": [
          "tester le niveau d'engagement sans demander encore la décision finale",
          "signer immédiatement le compromis",
          "fixer le prix du mandat",
          "encaisser le dépôt de garantie"
        ],
        "correct": 0,
        "explication": "Elle est sans risque : une réponse positive fait avancer, une réponse négative révèle un frein à traiter."
      },
      {
        "question": "La technique des « petits oui » repose sur le principe psychologique...",
        "options": [
          "de cohérence : rester en accord avec ses engagements précédents",
          "de rareté",
          "d'aversion à la perte",
          "d'ancrage"
        ],
        "correct": 0,
        "explication": "Enchaîner des oui installe une dynamique d'accord qu'il devient difficile de rompre par un « non » final."
      },
      {
        "question": "La technique du « bilan » (balance de Benjamin Franklin) consiste à...",
        "options": [
          "opposer une longue liste d'avantages à de courtes réserves",
          "proposer deux dates de signature",
          "verser un acompte symbolique",
          "baisser le prix progressivement"
        ],
        "correct": 0,
        "explication": "On fait pencher la décision en récapitulant les avantages (idéalement listés par le client) face aux réserves minimisées."
      },
      {
        "question": "Préparer l'offre et demander l'orthographe des noms « pour le compromis » avant même le oui formel relève de la technique...",
        "options": [
          "de la présomption, réservée aux signaux d'achat clairs",
          "de l'édredon",
          "du différentiel",
          "de la preuve sociale"
        ],
        "correct": 0,
        "explication": "La présomption agit comme si la décision était prise ; elle ne s'emploie que sur des signaux nets, sans arrogance."
      },
      {
        "question": "Parmi ces formulations, laquelle est une vraie question de conclusion ?",
        "options": [
          "« Je rédige l'offre ? »",
          "« Vous voulez réfléchir ? »",
          "« Je vous laisse mon numéro ? »",
          "« Alors, qu'en pensez-vous ? »"
        ],
        "correct": 0,
        "explication": "Une question de conclusion est fermée et engageante ; les formulations molles invitent au report."
      },
      {
        "question": "Tenir un long silence juste après la question de conclusion est utile car...",
        "options": [
          "le premier qui parle « perd » et le client est mis en situation de décider",
          "cela montre qu'on doute de son bien",
          "il faut se laisser le temps de baisser le prix",
          "le silence culpabilise le client et le force à signer"
        ],
        "correct": 0,
        "explication": "Combler le silence rouvre la discussion et offre une porte de sortie ; le tenir met le client face à sa décision."
      },
      {
        "question": "Selon la loi Hoguet, avant toute négociation l'agent doit impérativement disposer...",
        "options": [
          "d'un mandat écrit et signé",
          "d'un chèque de l'acquéreur",
          "d'un simple accord oral du vendeur",
          "d'une estimation notariale"
        ],
        "correct": 0,
        "explication": "Pas de mandat écrit, pas de closing : les honoraires ne sont dus que si un mandat valable existe."
      },
      {
        "question": "Le dépôt de garantie versé par l'acquéreur intervient...",
        "options": [
          "au compromis, séquestré chez le notaire ou l'agent garanti",
          "dès la signature de l'offre d'achat",
          "dès la première visite",
          "au moment de l'avis de valeur"
        ],
        "correct": 0,
        "explication": "Au stade de l'offre, aucune somme ne peut être exigée (article 1589-1 du Code civil) ; le dépôt n'intervient qu'au compromis."
      },
      {
        "question": "Pour prévenir le remords de l'acheteur (buyer's remorse) après le oui, le négociateur doit...",
        "options": [
          "rappeler, féliciter et rester présent les jours suivants",
          "disparaître une fois l'accord obtenu",
          "minimiser le délai de rétractation",
          "éviter tout contact pour ne pas raviver le doute"
        ],
        "correct": 0,
        "explication": "Le silence de l'agent nourrit le doute ; rassurer et ré-ancrer les raisons d'achat protège la vente pendant les 10 jours SRU."
      },
      {
        "question": "Face à un acquéreur « chaud » qui dit « je vous rappelle demain », le bon réflexe est...",
        "options": [
          "de faire écrire l'offre sur-le-champ",
          "d'accepter et d'attendre son appel",
          "de demander un acompte pour bloquer le bien",
          "de baisser le prix pour le décider"
        ],
        "correct": 0,
        "explication": "Une intention orale n'engage pas ; seule l'offre écrite fait avancer, tant que l'émotion de la visite est présente."
      },
      {
        "question": "Inventer un faux acquéreur ou une fausse visite pour accélérer la décision est...",
        "options": [
          "une pratique commerciale trompeuse interdite",
          "une technique de rareté admise",
          "recommandé dès que le bien plaît",
          "sans aucune conséquence juridique"
        ],
        "correct": 0,
        "explication": "La fausse urgence engage la responsabilité de l'agent et ruine sa crédibilité ; l'urgence ne s'emploie que si elle est réelle."
      }
    ]
  },
  {
    "id": "mots-vente",
    "titre": "Les mots qui font vendre",
    "icone": "💬",
    "categorie": "Commercial",
    "resume": "Mots à bannir, lexique persuasif, storytelling, chiffres, voix et silence, écrit, sur-mesure client et éthique : tout l'arsenal des mots qui vendent.",
    "duree": "39 min",
    "lecons": [
      {
        "titre": "Les mots noirs à bannir",
        "contenu": [
          "Certains mots **activent la peur, la méfiance ou le doute** chez le client, souvent sans qu'il en ait conscience. Les négociateurs d'élite les traquent et les remplacent systématiquement : c'est l'hygiène de base du vocabulaire commercial.",
          "## Le principe neurolinguistique",
          "Le cerveau **ne traite pas correctement la négation** : « ne vous inquiétez pas » fait d'abord entendre « inquiétude ». Il **retient les mots chargés** émotionnellement et **colore la perception** de tout l'échange. Choisir ses mots, c'est orienter ce que le client ressent.",
          "Un mot noir ne se remarque pas toujours consciemment, mais il **laisse une trace** : le client repart avec une sensation diffuse de malaise qu'il attribuera au bien ou à vous. D'où l'enjeu.",
          "## Le tableau des substitutions (à éviter → à dire)",
          "- **Prix / coût / dépense** → **investissement**, **budget**, **montant** : on transforme une sortie d'argent en placement.",
          "- **Commission** → **honoraires**, **rémunération au résultat** : « commission » évoque le démarchage, « honoraires » le professionnel réglementé.",
          "- **Contrat / signature** (anxiogènes, « je m'engage à vie ») → **accord**, **document**, « on officialise », « on valide ensemble ».",
          "- **Problème / souci / litige** → **point à regarder**, **sujet**, **détail à caler**.",
          "- **Cher** → **une vraie valeur**, **un bien de qualité**, « un bien qui tient son prix ».",
          "- **Brader / vendre vite** → **vendre au juste prix**, **vendre dans les délais** : on vend vite parce qu'on vend bien, pas parce qu'on casse le prix.",
          "- **Paperasse / dossier** → **les formalités**, « je m'occupe de tout » : on efface la corvée.",
          "- **Essayer / peut-être / j'espère / je pense que** (mots faibles) → **vous allez**, **vous obtiendrez**, **c'est le cas** : la certitude rassure.",
          "- **Objection** : ne la nommez jamais à voix haute ; parlez de « votre question », « votre remarque ».",
          "- **Ça ne se vend pas / le marché est bloqué** → « le marché est sélectif », « il faut viser juste ».",
          "- **Petit** (petit appartement, petit budget) → **optimisé**, **fonctionnel**, **maîtrisé**.",
          "- **Vieux / défraîchi** → **avec du cachet**, **à rafraîchir**, **de caractère**.",
          "## Les tics qui détruisent la crédibilité",
          "- **« Honnêtement, franchement, pour être sincère »** : sous-entend que le reste ne l'était pas.",
          "- **« Je ne vais pas vous mentir »** : installe l'idée même du mensonge.",
          "- **« C'est pas faux, c'est pas bête »** : la double négation affaiblit le propos.",
          "- **« Petit souci, petite visite, petite signature »** : le diminutif infantilise et dévalorise votre travail.",
          "- **« Normalement, en principe, a priori »** : jettent le doute juste là où le client attend une certitude.",
          "## Erreur fréquente",
          "Vouloir **tout corriger en direct** et parler de façon artificielle. L'objectif n'est pas de réciter un lexique, mais d'**entraîner l'oreille** jusqu'à ce que le bon mot vienne naturellement. Enregistrez-vous sur un appel de pige : vous repérerez vos « mots noirs » récurrents.",
          "## Mini cas pratique",
          "Un vendeur à Martigues : « Votre commission, c'est pas un peu cher pour juste des photos ? » Mauvaise réponse : « Non, ce n'est pas cher, ne vous inquiétez pas. » (trois mots noirs en une phrase). Bonne réponse : « Ce sont des **honoraires**, et ils correspondent à un **résultat** : vendre au bon prix, en sécurité, sans perte de temps. Regardons ensemble ce qu'ils comprennent. »"
        ]
      },
      {
        "titre": "La boîte à outils du vocabulaire persuasif",
        "contenu": [
          "Au-delà des mots à bannir, il existe un **arsenal de mots qui déclenchent l'adhésion**. Les connaître, c'est disposer d'une palette où puiser selon le moment de la vente.",
          "## Les mots-force (power words)",
          "- **Vous / votre** : le mot préféré du client ; parlez de lui, pas de vous. Visez un ratio **« vous » très supérieur à « je »**.",
          "- **Parce que** : une justification, même simple, augmente fortement l'acceptation. « Signons maintenant **parce que** ce taux est garanti jusqu'à vendredi. »",
          "- **Imaginez / projetez-vous** : ouvre la visualisation mentale, moteur réel de la décision.",
          "- **Exclusif, rare, unique, dernière opportunité** : activent la **rareté** — à condition de ne jamais mentir.",
          "- **Simple, clair, serein, sécurisé, accompagné** : rassurent l'acheteur comme le vendeur.",
          "- **Garanti, concret, prouvé, chiffré** : ancrent la crédibilité.",
          "- **Maintenant, aujourd'hui, dès ce week-end** : inscrivent l'action dans le présent plutôt que dans un « plus tard » qui ne vient jamais.",
          "## Les mots de la preuve sociale",
          "Les gens font ce que font les autres. Sans jamais inventer, appuyez-vous sur le réel :",
          "- « Ce secteur part **très vite** en ce moment. »",
          "- « Nous avons **déjà trois visites** programmées ce week-end. »",
          "- « D'autres acquéreurs **sont positionnés** sur ce type de bien. »",
          "La preuve sociale doit être **vraie et vérifiable** : une fausse file d'attente est une pratique trompeuse (voir dernière leçon).",
          "## Le vocabulaire sensoriel",
          "Un bon vendeur parle aux **cinq sens** pour faire « voir » le bien avant même la visite :",
          "- **Vue** : « la lumière qui inonde le séjour en fin d'après-midi ».",
          "- **Ouïe** : « le silence d'une impasse, loin du bruit de la circulation ».",
          "- **Toucher / confort** : « la fraîcheur des pièces l'été, le parquet chaleureux l'hiver ».",
          "- **Odorat / goût** : « les apéritifs sur la terrasse face au coucher de soleil sur l'étang de Berre ».",
          "## Adapter au canal dominant du client (VAKOG)",
          "Repérez le **canal dominant** dans ses mots : un **visuel** dit « je vois, c'est clair, montrez-moi » ; un **auditif** dit « ça me parle, dites-m'en plus » ; un **kinesthésique** dit « je le sens / je ne le sens pas, c'est du concret ». Reprenez son canal : à un visuel, « vous **voyez** le potentiel » ; à un kinesthésique, « vous allez vous **sentir** bien ici ».",
          "## Vendre des bénéfices, pas des caractéristiques",
          "Une **caractéristique** décrit le bien ; un **bénéfice** décrit la vie du client. Reliez-les par la formule « **ce qui veut dire pour vous** » :",
          "- « Double vitrage, **ce qui veut dire pour vous** des factures de chauffage allégées et le calme. »",
          "- « Mandat exclusif, **ce qui veut dire pour vous** un seul interlocuteur et une vente mieux pilotée. »",
          "## Mémo",
          "Mnémonique **CABO** : chaque argument enchaîne **C**aractéristique, puis **A**vantage, puis **B**énéfice pour le client, puis **O**uverture (« c'est important pour vous, ça ? »).",
          "## Erreur fréquente",
          "Noyer le client sous les **superlatifs** (« magnifique, exceptionnel, superbe ») : trop qualifié, plus personne n'y croit. Préférez **montrer** par un détail concret et vrai plutôt que **clamer** par un adjectif.",
          "## Mini cas pratique",
          "Pour une maison avec jardin : ne dites pas « grand jardin de 400 m² ». Dites « un jardin de 400 m² où les enfants jouent en sécurité pendant que vous recevez sous la pergola — **ce qui veut dire pour vous** des week-ends entiers à la maison ». La donnée devient une vie."
        ]
      },
      {
        "titre": "Le storytelling immobilier",
        "contenu": [
          "Une annonce, une visite ou une présentation marquent quand elles **racontent une histoire**, pas quand elles énumèrent des m². Une histoire se retient durablement là où une donnée brute s'oublie en quelques secondes.",
          "## Pourquoi l'histoire bat la donnée",
          "Le cerveau **mémorise les récits** et **décide d'abord avec l'émotion**, puis justifie après coup avec la raison. Une histoire crée des images, et les images donnent envie ; les chiffres, eux, ne font que rassurer une envie déjà née.",
          "## Les trois ingrédients d'une histoire de bien",
          "- **Le lieu** : plantez le décor. « Une rue calme de Jonquières, où l'on entend les cigales l'été. »",
          "- **La vie possible** : projetez le futur propriétaire. « Les dîners d'été sur cette terrasse plein sud, les enfants qui jouent dans le patio. »",
          "- **Le détail qui ancre** : un élément unique et vrai. La cheminée d'origine, l'olivier centenaire, l'atelier du grand-père.",
          "## Faire vivre, ne pas décrire",
          "- Avant : « Séjour de 35 m² exposé sud. »",
          "- Après : « Un séjour baigné de lumière toute la journée, où l'on se voit déjà recevoir ses amis. »",
          "On passe de la **donnée** à l'**émotion** : la donnée informe, l'émotion décide.",
          "## La structure narrative en visite",
          "- **Ouverture** : une accroche sensorielle dès l'entrée (« sentez comme c'est calme ici »).",
          "- **Montée** : gardez le meilleur atout pour un moment fort (la terrasse, la vue, la belle pièce).",
          "- **Projection** : faites se projeter (« votre bureau pourrait être ici, face à la fenêtre »).",
          "- **Chute** : terminez sur une image forte, celle dont le client repartira avec le souvenir.",
          "## Le storytelling de l'agence",
          "Racontez aussi **votre histoire** et celle de l'agence : « Chez CENTURY 21 Icaza Immobilier à Martigues, on connaît chaque quartier, de L'Île à Ferrières. » La preuve par l'ancrage local rassure plus que n'importe quel argument générique.",
          "## L'histoire du vendeur, un atout à manier avec prudence",
          "L'histoire du bien (« une maison de famille transmise sur trois générations ») touche l'acheteur — mais ne révélez jamais une information **confidentielle ou déterminante** sur la situation du vendeur (divorce, difficultés financières, urgence de vendre) : elle affaiblirait sa position en négociation et trahirait votre devoir de loyauté envers lui.",
          "## L'outil d'annonce",
          "La **génération d'annonce** de l'application peut produire une première trame narrative ; votre rôle est d'y réinjecter l'**émotion vraie du terrain**, ces détails que seul le passage sur place révèle.",
          "## Erreur fréquente",
          "Le storytelling **creux ou mensonger** : inventer une « rue au calme » sur un axe passant se retourne contre vous dès la visite. L'histoire doit être **vraie** — on sélectionne les détails réels les plus parlants, on n'en invente pas.",
          "## Mini cas pratique",
          "Un T2 à rafraîchir se vend mal décrit « studio ancien à rénover ». Reformulé : « Un pied-à-terre plein de charme, à deux pas du port, idéal pour un premier achat ou un investissement locatif — à personnaliser à votre goût. » Même bien, autre perception, autre prix."
        ]
      },
      {
        "titre": "Questions, présupposés et formulations d'engagement",
        "contenu": [
          "Les bonnes formulations **font avancer vers la décision sans jamais forcer**. Elles travaillent en douceur, par accumulation de petits accords successifs.",
          "## Les présupposés positifs",
          "On parle de l'après comme s'il était acquis, ce qui installe la projection :",
          "- « **Quand** vous serez installés… » (et non « si vous achetez »).",
          "- « **Lorsque** nous aurons signé, le notaire s'occupera de… »",
          "- « Vous préférez emménager plutôt au printemps ou avant l'été ? » (la question « oui/non » est sautée).",
          "## Les questions d'engagement (la technique du oui)",
          "Enchaîner des questions dont la réponse est « oui » met le client dans une dynamique d'accord :",
          "- « C'est important pour vous, un extérieur ? » — « Oui. »",
          "- « Et la proximité des écoles ? » — « Oui. »",
          "- « Ce bien coche ces deux points, c'est bien ça ? » — « Oui. »",
          "## La question alternative (le double oui)",
          "Proposez un **choix entre deux oui**, jamais entre oui et non : « On se cale plutôt mardi 18 h ou mercredi midi ? » Les deux réponses font avancer le dossier.",
          "## Les questions ouvertes qui font parler",
          "Avant de convaincre, faites **parler le client** : il se vend à lui-même. « Qu'est-ce qui vous plairait vraiment dans votre prochain logement ? », « Qu'est-ce qui vous a donné envie de visiter celui-ci ? ». Vous récoltez ses mots pour les lui rendre ensuite.",
          "## La reformulation valorisante",
          "Reprenez les mots du client en les **positivant**, pour qu'il s'entende approuver :",
          "- Client : « C'est un peu loin du centre. » → « Donc ce que vous cherchez, c'est le calme tout en restant accessible — c'est exactement ce que ce secteur offre. »",
          "## Le « nous » qui crée l'alliance",
          "- « **Voyons ensemble**… », « **on va trouver**… », « **notre objectif commun**… ». On passe d'un rapport vendeur/client à une équipe face à un projet.",
          "## Le pré-closing (prendre la température)",
          "Avant de conclure, testez sans engager : « Sur une échelle de 1 à 10, où situez-vous ce bien ? » Une réponse à 7 ou 8 ouvre la vraie question : « Qu'est-ce qui manque pour arriver à 10 ? » — et le client vous livre lui-même le dernier frein à lever.",
          "## L'engagement verbalisé",
          "Faites **exprimer l'accord par le client lui-même** : « Si je vous trouve ce bien au bon prix, vous êtes prêts à avancer ? » Un oui prononcé engage bien plus qu'un oui pensé.",
          "## Erreur fréquente",
          "**Manipuler au lieu d'accompagner** : empiler des oui sur des sujets sans lien, ou forcer un présupposé sur un client qui n'est pas prêt, provoque un **effet de réactance** (le client se braque). Les formulations servent à **révéler une décision mûre**, pas à la fabriquer de force.",
          "## Mini cas pratique",
          "Au lieu de « Vous voulez réfléchir ? » (qui invite au report), dites : « Qu'est-ce qui vous ferait dire oui aujourd'hui ? » On transforme une porte de sortie en question de clôture."
        ]
      },
      {
        "titre": "Cadrage et ancrage : donner du sens aux chiffres",
        "contenu": [
          "Un même chiffre peut être vécu comme énorme ou dérisoire **selon les mots qui l'entourent**. Le cadrage (framing) et l'ancrage sont les outils linguistiques pour donner du sens aux montants.",
          "## L'effet d'ancrage par les mots",
          "Le premier chiffre énoncé devient la **référence** à laquelle tout le reste se compare. Annoncez d'abord une valeur haute et **vraie**, puis positionnez le prix en dessous : « Des biens comme celui-ci se négocient autour de 320 000 € ; ici, à 299 000 €, vous êtes déjà très bien placé. »",
          "## Le fractionnement (ramener à l'unité)",
          "Un gros montant devient acceptable une fois **ramené à une petite échelle** :",
          "- « 6 000 € d'honoraires, c'est moins qu'un mois de crédit relais que vous économisez en vendant vite. »",
          "- « 15 000 € de travaux, lissés sur 20 ans de prêt, représentent quelques dizaines d'euros par mois. »",
          "## Le recadrage par comparaison",
          "Reliez le montant à un **repère concret et favorable** : « 299 000 €, c'est le prix d'un appartement neuf plus petit et sans terrasse dans le même secteur. »",
          "## L'effet de contraste",
          "Présenté après une option plus chère ou moins bien dotée, un bien paraît avantageux : « À 340 000 €, le bien d'à côté n'a ni le jardin ni le garage ; à 299 000 €, vous avez les deux. » Le contraste doit reposer sur des **comparables réels**, jamais sur un faux prix inventé.",
          "## L'aversion à la perte",
          "Les gens détestent **perdre** plus qu'ils n'aiment gagner. Formulez donc en perte évitée :",
          "- « Chaque mois de retard, c'est un crédit relais qui court et un bien qui fatigue sur le marché. »",
          "- « En refusant cette offre aujourd'hui, vous risquez de revendre plus bas dans trois mois. »",
          "## Les mots qui adoucissent un chiffre",
          "- « **seulement / à peine** 299 000 € » (plutôt que « quand même »).",
          "- « un **budget** de… » plutôt qu'« un **prix** de… ».",
          "- « **à partir de**… » qui ouvre, plutôt que « ça fait… » qui ferme.",
          "## Les mots qui crédibilisent un chiffre",
          "Un chiffre **précis** paraît plus vrai qu'un chiffre rond : « estimé à 297 500 € » inspire davantage confiance qu'« environ 300 000 € », car il semble issu d'un vrai calcul.",
          "## Erreur fréquente",
          "Jouer sur les chiffres pour **tromper** (faux prix de référence, fausse remise) : c'est contre-productif à la visite, et c'est juridiquement une **pratique commerciale trompeuse** sanctionnée (voir dernière leçon). Le cadrage éclaire un chiffre vrai, il n'en fabrique pas un faux.",
          "## Mini cas pratique",
          "Vendeur accroché à 330 000 € sur un bien estimé 300 000 €. Plutôt que « c'est trop cher », cadrez : « À 330 000 €, vous vous comparez aux biens rénovés du secteur ; à 299 000 €, vous êtes le meilleur rapport et vous vendez en 6 semaines au lieu de 6 mois. Combien vous coûtent réellement ces 4 mois de plus ? »"
        ]
      },
      {
        "titre": "La voix qui vend : ton, rythme, silence",
        "contenu": [
          "Ce n'est pas seulement **ce que vous dites**, c'est **comment vous le dites**. Le para-verbal — ton, débit, volume, silence — pèse souvent davantage que les mots eux-mêmes, au téléphone comme en rendez-vous.",
          "## Les quatre leviers de la voix",
          "- **Le ton** : descendant en fin de phrase = affirmation, autorité ; montant = question, hésitation. Terminez vos phrases importantes **vers le bas**.",
          "- **Le débit** : ralentir sur les mots-clés et les chiffres leur donne du poids ; accélérer légèrement sur l'accessoire garde le rythme.",
          "- **Le volume** : baisser la voix sur un point important fait **tendre l'oreille** — contre-intuitif, mais puissant.",
          "- **L'articulation** : un mot clairement détaché est perçu comme plus sûr et plus professionnel.",
          "## Le pouvoir du silence",
          "Le silence est **un mot à part entière**. Après une question de closing ou l'annonce d'un prix, **taisez-vous**.",
          "- Règle d'or : « **qui parle en premier après le prix, perd** ». Laissez le client remplir le vide.",
          "- Un silence de 3 à 5 secondes paraît interminable à celui qui doit le combler : c'est souvent lui qui lâche l'information ou l'accord.",
          "## La respiration, socle de la voix",
          "Une voix qui porte vient d'une **respiration basse, ventrale**. Avant un appel de pige ou une annonce de prix, trois respirations lentes posent la voix dans les graves et effacent le tremblement du stress.",
          "## Le sourire s'entend",
          "Au téléphone, **souriez physiquement** : la voix se timbre autrement, le client le perçoit. À l'agence de Martigues, un miroir près du poste de pige rappelle de sourire pendant les appels.",
          "## Le calibrage (se mettre au diapason)",
          "**Alignez votre rythme sur celui du client** : un client lent et posé se méfie d'un vendeur qui mitraille ; un client rapide s'agace d'un vendeur mou. On se synchronise d'abord, puis on guide doucement vers le rythme de la décision.",
          "## Phrases-types et diction",
          "- Annonce d'un prix : ton **neutre et descendant**, puis silence. « Ce bien est à 299 000 €. » (stop).",
          "- Argument fort : on **ralentit** — « Ce bien… se vend… en six semaines. »",
          "## Erreur fréquente",
          "- **Meubler le silence** par peur du vide : « …enfin voilà, après c'est vous qui voyez, hein ». On annule tout le poids de ce qui précède.",
          "- **Monter dans les aigus** sous le stress : respirez, posez la voix dans les graves, ralentissez — l'assurance s'entend.",
          "## Mini cas pratique",
          "Au téléphone, après « Pour ce mandat exclusif, mes honoraires sont de 5 %. » — silence total. Le vendeur finit par répondre : « …Bon, d'accord, et vous le mettez en ligne quand ? » Le silence a mieux porté le prix que n'importe quelle justification."
        ]
      },
      {
        "titre": "Les mots à l'écrit : annonce, email, SMS, répondeur",
        "contenu": [
          "À l'écrit, vous n'avez ni voix ni sourire : **seuls les mots travaillent**. Une annonce, un email ou un SMS se jouent en quelques secondes d'attention. Le copywriting immobilier est un savoir-faire à part entière.",
          "## L'annonce : la règle de l'accroche",
          "- La **première ligne** décide de tout : elle doit contenir le **bénéfice n°1**, pas une liste. « Terrasse plein sud et vue dégagée à deux pas du port. »",
          "- **Un atout par phrase**, phrases courtes : l'œil scanne, il ne lit pas en entier.",
          "- Terminez par un **appel à l'action** : « Les visites démarrent ce week-end, contactez-nous pour réserver votre créneau. »",
          "## La structure AIDA",
          "Mnémonique **AIDA** pour tout texte de vente :",
          "- **A** comme Attention : l'accroche sensorielle ou le bénéfice fort.",
          "- **I** comme Intérêt : les atouts concrets, traduits en bénéfices client.",
          "- **D** comme Désir : la projection (« imaginez vos étés ici »).",
          "- **A** comme Action : le pas à faire maintenant (appeler, visiter).",
          "## Les mots-clés qui font remonter l'annonce",
          "Les portails et moteurs valorisent les termes que les acheteurs tapent. Intégrez **naturellement** « terrasse », « garage », « lumineux », « sans vis-à-vis » et le nom du quartier : un bon texte sert à la fois l'humain et le référencement, sans bourrage de mots-clés.",
          "## L'email qui obtient une réponse",
          "- **L'objet** fait 80 % du travail : court, personnalisé, bénéfice clair. « Votre estimation rue des Cordeliers + 2 acquéreurs en attente ».",
          "- **Une seule demande** par email : un email = une action attendue.",
          "- **La relance** : « Je reviens vers vous **parce que** j'ai du nouveau sur votre secteur » — une raison, jamais « je me permets de vous relancer ».",
          "## Le SMS (à manier avec tact)",
          "- Court, utile, signé. « Bonjour M. Durand, 3 visites ce week-end sur votre bien, je vous fais le point lundi. B. / C21 Icaza. »",
          "- Jamais de SMS pour une mauvaise nouvelle ou une négociation : le téléphone ou le face-à-face s'imposent.",
          "- La prospection par SMS ou email suppose le **consentement** (ou un intérêt légitime) et un moyen simple de se désinscrire : le RGPD et la réglementation du démarchage encadrent strictement l'écrit non sollicité.",
          "## Le message sur répondeur",
          "- Objectif : **donner envie de rappeler**, pas tout dire. « Bonjour, j'ai une info importante concernant votre recherche sur Martigues, rappelez-moi, c'est [votre nom], CENTURY 21 Icaza. »",
          "## Les mentions obligatoires (ne jamais les oublier)",
          "Une annonce doit comporter des **mentions légales** : le prix et qui paie les honoraires (ainsi que leur taux si à la charge de l'acquéreur), la **classe DPE et GES**, et depuis 2022 une **estimation des dépenses annuelles d'énergie**. Le détail est traité dans les modules **Cadre légal & conformité** et **DPE & performance énergétique** — mais retenez qu'une annonce sans DPE ni mention d'honoraires est **hors-la-loi** et sanctionnable.",
          "## Erreur fréquente",
          "- Le **copier-coller** d'annonce (« beau T3 lumineux, idéalement situé ») : générique, donc invisible. Chaque bien mérite ses propres mots.",
          "- Les **ABRÉVIATIONS et MAJUSCULES** à outrance (« T3 RDC GDE TERR CC ») : elles découragent l'acheteur grand public.",
          "## Mini cas pratique",
          "Annonce fade : « Appartement T3 68 m², 2e étage, proche commerces, DPE D. » Réécriture : « T3 lumineux de 68 m² avec balcon plein sud, au calme et pourtant à 5 min à pied du centre de Martigues. Idéal premier achat. Visites ce samedi. (DPE : D). » Même bien, nettement plus d'appels."
        ]
      },
      {
        "titre": "Adapter ses mots : profil du client et moment de la vente",
        "contenu": [
          "Il n'existe pas de discours universel : les mêmes mots qui emballent un acquéreur peuvent braquer un vendeur, et une formule parfaite en visite tombe à plat au téléphone. Le vendeur d'élite **ajuste son vocabulaire** à l'interlocuteur et au moment.",
          "## Vendeur ou acquéreur : deux mondes de mots",
          "- Face au **vendeur** : les mots de la **sécurité, du juste prix et de l'accompagnement**. « Je sécurise votre vente », « on vise le bon prix, pas le prix rêvé », « je m'occupe de tout ».",
          "- Face à l'**acquéreur** : les mots de la **projection, du coup de cœur et de l'opportunité**. « Imaginez-vous ici », « ce bien ne restera pas », « c'est rare sur ce secteur ».",
          "## Les mots selon l'étape de la vente",
          "- **Pige / prospection** : accroche et bénéfice, pas de pression. « J'ai peut-être un acquéreur pour votre bien. »",
          "- **Estimation / rendez-vous vendeur** : expertise et preuve. « Voici ce que disent les ventes réelles de votre rue. »",
          "- **Visite** : sensoriel et projection. « Sentez le calme », « votre bureau serait ici ».",
          "- **Négociation** : cadrage et alliance. « Voyons ensemble comment rapprocher les positions. »",
          "- **Closing** : présupposé et engagement. « Quand signons-nous chez le notaire ? »",
          "## Lire le profil psychologique",
          "Repérez vite à qui vous parlez et calez vos mots dessus :",
          "- **L'analytique** veut des **chiffres, des preuves, du cadre** : « estimé à 297 500 €, sur la base de 8 ventes comparables ».",
          "- **L'affectif** veut de la **relation et des histoires** : parlez-lui projet de vie, pas rendement.",
          "- **Le pragmatique** veut du **résultat et du temps gagné** : allez droit au but, pas de bavardage.",
          "- **Le prudent** veut des **garanties et de la réassurance** : « vous disposez de 10 jours de rétractation, rien n'est figé ce soir ».",
          "## Adapter le registre de langue",
          "Bannissez le **jargon** avec un primo-accédant (« compromis », « séquestre », « condition suspensive » s'expliquent avec des mots simples) ; soyez au contraire **précis et technique** avec un investisseur aguerri qui parle rendement, VEFA et fiscalité. Parler au mauvais niveau vous disqualifie dans les deux sens.",
          "## Le non-verbal suit le profil",
          "Un prudent a besoin de **lenteur et de pauses** ; un pragmatique, de **rythme et de concision**. Le calibrage vu dans la leçon sur la voix s'applique au choix des mots autant qu'au débit.",
          "## Erreur fréquente",
          "Dérouler le **même script** à tout le monde. Un script rassure le débutant mais s'entend comme une récitation : la vraie maîtrise, c'est d'avoir intégré les principes au point d'**improviser juste** selon la personne en face.",
          "## Mini cas pratique",
          "Même T3, deux acheteurs. Au primo-accédant : « Un premier chez-vous lumineux, au calme, où vous poser sans travaux. » À l'investisseur : « 68 m² au calme, DPE D, qui se reloue vite sur ce secteur tendu — un bon rapport loyer / prix. » Même bien, deux langues."
        ]
      },
      {
        "titre": "Sincérité, éthique et conformité des mots",
        "contenu": [
          "Les mots sont puissants — ce qui en fait aussi une responsabilité. Un vocabulaire persuasif sert une **relation honnête** ; il ne la **simule** jamais. Et la loi encadre strictement ce que vous pouvez affirmer.",
          "## La cohérence : les mots doivent tenir à la visite",
          "Un storytelling creux ou des formules plaquées se **repèrent en quelques minutes**. Pire, un écart entre vos mots et la réalité détruit la confiance pour toute la suite de la transaction.",
          "- Promettre « au calme absolu » sur un axe passant : la visite vous décrédibilise.",
          "- Annoncer « rénové récemment » pour un simple coup de peinture : le client se sent trompé.",
          "## La sincérité comme technique la plus rentable",
          "Le vendeur d'élite n'est pas celui qui **embellit le plus**, c'est celui à qui l'on **fait confiance**. Dire un défaut avant qu'il ne se voie (« le vis-à-vis est réel, en contrepartie le prix en tient compte ») **augmente** votre crédibilité sur tout le reste.",
          "## Le cadre légal : la pratique commerciale trompeuse",
          "Affirmer du faux pour vendre n'est pas une « technique », c'est un **délit**. Les articles **L121-2 à L121-4 du Code de la consommation** interdisent les **pratiques commerciales trompeuses** : allégations fausses ou de nature à induire en erreur sur les caractéristiques, le prix ou la disponibilité d'un bien.",
          "- Sanctions (article **L132-2** du Code de la consommation) : jusqu'à **2 ans d'emprisonnement** et **300 000 € d'amende** pour une personne physique.",
          "- L'amende peut être portée à **10 % du chiffre d'affaires annuel moyen** ou à **50 % des dépenses** engagées pour la pratique.",
          "- La **DGCCRF** contrôle et sanctionne : un faux « bien très demandé, dépêchez-vous » ou une fausse offre concurrente entrent dans ce champ.",
          "## Le devoir de conseil et d'information",
          "L'agent relevant de la **loi Hoguet (loi n° 70-9 du 2 janvier 1970)** est tenu à un **devoir de conseil et d'information loyale**. Taire sciemment une information déterminante (servitude, procédure, nuisance connue) peut engager votre **responsabilité** et faire **annuler la vente pour dol** (article 1137 du Code civil).",
          "## Les mots écrits engagent : le mandat",
          "La loi Hoguet impose un **mandat écrit** : ce que vous promettez à l'oral (délai, prix, services, taux d'honoraires) a vocation à s'y retrouver noir sur blanc. Des mots flous dans un mandat créent des litiges ; des mots précis vous protègent autant qu'ils protègent le client.",
          "## La charte déontologique",
          "Depuis la **loi ALUR**, les professionnels sont soumis à un **code de déontologie** (décret n° 2015-1090 du 28 août 2015) : probité, information sincère, respect du client. Vos mots engagent votre **carte professionnelle**.",
          "## Erreur fréquente",
          "Confondre **persuader** et **manipuler**. Persuader, c'est aider une bonne décision à se prendre avec des mots justes ; manipuler, c'est obtenir par la tromperie un accord que le client regrettera — et qui se retournera contre vous (rétractation, litige, réputation, sanction).",
          "## Mini cas pratique",
          "Un acquéreur demande si le quartier est bruyant la nuit (un bar à proximité). Mauvais réflexe : « Non, c'est très calme. » (faux, trompeur, risqué). Bon réflexe : « Il y a un bar à 100 m, animé le week-end ; en semaine c'est calme, et les fenêtres sont en double vitrage récent. » Vous perdez peut-être un acheteur mal ciblé, vous gagnez la confiance du bon — et vous êtes **couvert**."
        ]
      }
    ],
    "quiz": [
      {
        "question": "« Ne vous inquiétez pas » est à éviter car…",
        "options": [
          "C'est une formule trop familière",
          "La négation fait d'abord entendre le mot « inquiétude »",
          "C'est une phrase trop longue",
          "Ça fait trop commercial"
        ],
        "correct": 1,
        "explication": "Le cerveau traite mal la négation et retient le mot chargé : on formule au positif (« vous êtes serein, car… »)."
      },
      {
        "question": "Le mot « parce que » est particulièrement puissant car…",
        "options": [
          "Il rend la phrase plus polie",
          "Une justification, même simple, augmente fortement l'acceptation",
          "Il raccourcit le discours",
          "Il crée un sentiment d'urgence"
        ],
        "correct": 1,
        "explication": "Donner une raison (« parce que… ») lève la résistance : l'esprit accepte beaucoup mieux une demande justifiée."
      },
      {
        "question": "Le storytelling immobilier consiste à…",
        "options": [
          "Lister les m² et les équipements",
          "Faire vivre une émotion et une projection à partir de détails vrais",
          "Embellir le bien en inventant des atouts",
          "Parler du prix en premier"
        ],
        "correct": 1,
        "explication": "On passe de la donnée à l'émotion, mais à partir de détails réels : le client achète une histoire et une projection, jamais un mensonge."
      },
      {
        "question": "Pour rendre un montant d'honoraires plus acceptable, la technique du fractionnement consiste à…",
        "options": [
          "Arrondir le montant au millier supérieur",
          "Le ramener à une petite échelle (par mois, ou comparé à une économie)",
          "Le cacher jusqu'à la signature",
          "L'augmenter pour pouvoir le négocier ensuite"
        ],
        "correct": 1,
        "explication": "Ramener un gros montant à l'unité (« quelques dizaines d'euros par mois », « moins qu'un mois de crédit relais économisé ») le rend acceptable, sans jamais le dissimuler."
      },
      {
        "question": "Au téléphone, juste après avoir annoncé un prix, le bon réflexe est…",
        "options": [
          "De justifier aussitôt le montant",
          "De se taire et laisser le client réagir",
          "De proposer tout de suite une remise",
          "De réénumérer les atouts du bien"
        ],
        "correct": 1,
        "explication": "« Qui parle en premier après le prix, perd. » Le silence porte le montant ; c'est souvent le client qui lâche l'accord."
      },
      {
        "question": "Affirmer un faux atout pour déclencher la vente…",
        "options": [
          "Est une technique de closing avancée",
          "Est sans risque tant que le client ne vérifie pas",
          "Est une pratique commerciale trompeuse, un délit sanctionné par la loi",
          "Est une pratique tolérée en immobilier"
        ],
        "correct": 2,
        "explication": "Les articles L121-2 à L121-4 du Code de la consommation l'interdisent : jusqu'à 2 ans de prison et 300 000 € d'amende, contrôlé par la DGCCRF."
      },
      {
        "question": "Dans le discours commercial, le mot préféré du client, à privilégier largement, est...",
        "options": [
          "« vous / votre »",
          "« je / mon »",
          "« nous / notre »",
          "« on »"
        ],
        "correct": 0,
        "explication": "Parlez du client, pas de vous : visez un ratio de « vous » très supérieur à « je »."
      },
      {
        "question": "Le mot « commission » gagne à être remplacé par...",
        "options": [
          "« honoraires »",
          "« marge »",
          "« pourcentage »",
          "« forfait »"
        ],
        "correct": 0,
        "explication": "« Commission » évoque le démarchage ; « honoraires » renvoie au professionnel réglementé."
      },
      {
        "question": "Commencer une phrase par « honnêtement, franchement, pour être sincère » est à éviter car...",
        "options": [
          "cela sous-entend que le reste du propos ne l'était pas",
          "c'est trop familier",
          "cela allonge inutilement la phrase",
          "c'est interdit par la loi Hoguet"
        ],
        "correct": 0,
        "explication": "Ces tics de langage installent paradoxalement le doute sur la sincérité du reste du discours."
      },
      {
        "question": "La formule « ce qui veut dire pour vous » sert à...",
        "options": [
          "transformer une caractéristique du bien en bénéfice concret pour le client",
          "annoncer le prix en douceur",
          "conclure la vente",
          "clôturer un email de relance"
        ],
        "correct": 0,
        "explication": "« Double vitrage, ce qui veut dire pour vous des factures allégées et le calme » : on relie la donnée à la vie du client."
      },
      {
        "question": "À un client qui dit « je le sens / c'est du concret », on répond plutôt...",
        "options": [
          "« vous allez vous sentir bien ici »",
          "« vous voyez le potentiel »",
          "« ça vous parle, non ? »",
          "« sentez cette bonne odeur »"
        ],
        "correct": 0,
        "explication": "On reprend son canal dominant (VAKOG) : ce client est kinesthésique, on emploie le registre du ressenti et du concret."
      },
      {
        "question": "Les trois ingrédients d'une bonne histoire de bien sont...",
        "options": [
          "le lieu, la vie possible et le détail qui ancre",
          "le prix, la surface et le DPE",
          "l'accroche, l'intérêt et l'action",
          "le ton, le rythme et le silence"
        ],
        "correct": 0,
        "explication": "On plante le décor, on projette le futur propriétaire, puis on ancre avec un détail unique et vrai."
      },
      {
        "question": "Dans le storytelling d'un bien, révéler que le vendeur divorce et doit vendre vite...",
        "options": [
          "trahit le devoir de loyauté et affaiblit sa position en négociation",
          "est un bon gage d'authenticité",
          "rassure l'acquéreur hésitant",
          "est une mention obligatoire"
        ],
        "correct": 0,
        "explication": "Une information confidentielle ou déterminante sur le vendeur ne se divulgue jamais : elle le fragiliserait."
      },
      {
        "question": "Dire « quand vous serez installés... » plutôt que « si vous achetez... » est...",
        "options": [
          "un présupposé positif qui installe la projection",
          "une manipulation interdite",
          "une faute de grammaire",
          "une formule réservée au vendeur"
        ],
        "correct": 0,
        "explication": "Le présupposé parle de l'après comme acquis et fait naturellement se projeter le client."
      },
      {
        "question": "Annoncer d'abord « des biens comme celui-ci se négocient autour de 320 000 € » avant de dire « ici, à 299 000 € » exploite...",
        "options": [
          "l'effet d'ancrage",
          "l'aversion à la perte",
          "le fractionnement",
          "la preuve sociale"
        ],
        "correct": 0,
        "explication": "Le premier chiffre énoncé devient la référence ; à condition d'être vrai, il valorise le prix annoncé ensuite."
      },
      {
        "question": "Formuler « chaque mois de retard, c'est un crédit relais qui court et un bien qui fatigue » joue sur...",
        "options": [
          "l'aversion à la perte",
          "l'effet d'ancrage",
          "la preuve sociale",
          "le vocabulaire sensoriel"
        ],
        "correct": 0,
        "explication": "Les gens détestent perdre plus qu'ils n'aiment gagner ; on formule l'enjeu en perte évitée."
      },
      {
        "question": "Pour crédibiliser une estimation, il vaut mieux annoncer...",
        "options": [
          "« estimé à 297 500 € »",
          "« environ 300 000 € »",
          "« dans les 300 000 € »",
          "« autour de 300 000 € »"
        ],
        "correct": 0,
        "explication": "Un chiffre précis paraît issu d'un vrai calcul et inspire plus confiance qu'un chiffre rond."
      },
      {
        "question": "Pour qu'une phrase importante sonne comme une affirmation sûre, on la termine...",
        "options": [
          "sur un ton descendant",
          "sur un ton montant",
          "en accélérant le débit",
          "en haussant le volume"
        ],
        "correct": 0,
        "explication": "Le ton descendant marque l'autorité et l'affirmation ; le ton montant évoque la question ou l'hésitation."
      },
      {
        "question": "Dans un texte de vente, la méthode AIDA enchaîne...",
        "options": [
          "Attention, Intérêt, Désir, Action",
          "Accroche, Information, Détail, Appel",
          "Annonce, Image, Données, Adresse",
          "Attirer, Informer, Décrire, Afficher"
        ],
        "correct": 0,
        "explication": "AIDA structure une annonce : capter l'Attention, susciter l'Intérêt, créer le Désir, déclencher l'Action."
      },
      {
        "question": "Taire sciemment une servitude ou une nuisance connue à l'acquéreur peut...",
        "options": [
          "faire annuler la vente pour dol",
          "accélérer la signature sans aucun risque",
          "relever du simple argumentaire commercial",
          "être entièrement couvert par le mandat"
        ],
        "correct": 0,
        "explication": "Le manquement au devoir de conseil engage la responsabilité de l'agent et peut annuler la vente pour dol (article 1137 du Code civil)."
      }
    ]
  },
  {
    "id": "defendre-prix",
    "titre": "Défendre ses honoraires",
    "icone": "💶",
    "categorie": "Commercial",
    "resume": "Honoraires libres, barème, valeur vs PAP, objections et concessions : assumer et défendre sa commission sans jamais la brader.",
    "duree": "30 min",
    "lecons": [
      {
        "titre": "Pourquoi ne jamais brader ses honoraires",
        "contenu": [
          "Baisser ses honoraires au premier froncement de sourcil est une erreur à la fois **stratégique**, **financière** et **psychologique**. Avant même de savoir répondre aux objections, il faut être convaincu, soi-même, qu'on ne brade pas : un agent qui doute de son prix ne le défendra jamais.",
          "## Trois raisons de tenir son prix",
          "- **Ça vous dévalorise** : un professionnel qui casse son tarif sans raison envoie le message qu'il ne le valait pas. Le doute s'étend aussitôt au reste de la prestation — « s'il cède si vite sur sa commission, cédera-t-il aussi sur mon prix de vente ? ».",
          "- **Ça ampute directement la marge** : les honoraires n'ont quasiment pas de coût variable. Chaque euro lâché est un euro de **résultat net** en moins, pas un euro de chiffre d'affaires qu'on récupère sur le volume.",
          "- **Ça ouvre une négociation sans fin** : qui baisse une fois baissera encore. Vous créez un **précédent** et apprenez au client que votre prix est élastique.",
          "## Les maths de la concession",
          "Un point de commission lâché pèse beaucoup plus lourd qu'il n'y paraît, parce qu'il se calcule sur le prix du bien, pas sur votre marge.",
          "- Maison à Martigues, **350 000 € net vendeur**, barème à **5 % TTC** = **17 500 €** d'honoraires.",
          "- Vous « arrondissez » à **4 %** = 14 000 € : vous venez de perdre **3 500 €**, soit **20 % de votre rémunération** sur ce dossier, en une seule phrase.",
          "- Et comme le négociateur ne touche qu'une **fraction** de la commission d'agence, cette concession ampute surtout **votre propre paie**.",
          "## L'effet d'ancrage",
          "Le premier chiffre posé sert de **point d'ancrage** à toute la discussion. Si vous annoncez un prix ferme et argumenté, le client négocie autour de ce point. Si vous le présentez comme flottant (« dans les 5 %, on verra »), vous ancrez le doute et vous invitez vous-même la baisse.",
          "## Le bon état d'esprit",
          "Vos honoraires ne sont pas un **coût** pour le client : ce sont le **prix d'un résultat** — vendre plus vite, plus cher et en sécurité qu'en direct. On ne défend pas un tarif, on **assume une valeur**. Le client ne paie pas vos heures, il paie le **net dans sa poche** et sa tranquillité.",
          "## Erreurs fréquentes",
          "- **Baisser avant même l'objection**, « pour faire bonne impression » : vous bradez un prix que personne n'avait contesté.",
          "- **S'excuser du montant** (« c'est ma petite commission… ») : le langage trahit le doute.",
          "- **Confondre geste commercial et faiblesse** : un geste se prépare et s'échange, il ne se lâche pas sous la pression.",
          "## Cas pratique",
          "Un vendeur vous lance d'entrée : « De toute façon, vous allez me faire un prix sur la commission ? ». Mauvaise réponse : « On verra, c'est négociable. » Bonne réponse : « Mes honoraires sont clairs et affichés ; ce qui compte, c'est combien vous repartez net et en combien de temps. On en reparle quand je vous aurai montré comment j'y arrive. » Vous repoussez la négociation du prix **après** la démonstration de valeur."
        ]
      },
      {
        "titre": "Ce que valent vraiment vos honoraires",
        "contenu": [
          "Pour défendre un prix, il faut d'abord le **comprendre** : d'où vient la liberté de le fixer, comment il s'exprime, ce qu'il finance réellement et ce que la loi impose.",
          "## Des honoraires libres",
          "Les honoraires d'agence sont **libres** depuis l'**ordonnance n° 86-1243 du 1er décembre 1986** sur la liberté des prix et de la concurrence. **Aucun tarif n'est imposé par l'État** : chaque agence fixe son propre **barème**.",
          "- Ce barème doit être **affiché** — à l'agence (lieu de réception de la clientèle) et sur le **site internet** — et s'entend **TTC**, en application de l'arrêté du 10 janvier 2017 pris pour la loi ALUR (voir le module **Loi ALUR**).",
          "- Le barème affiché est un **plafond** : on peut négocier **à la baisse**, jamais au-dessus.",
          "- Le barème est souvent **dégressif** : le pourcentage diminue à mesure que le prix du bien augmente.",
          "## Toujours en TTC",
          "Les honoraires supportent la **TVA à 20 %**. Un barème annoncé « 5 % » est **5 % TTC** : l'agence n'encaisse en réalité que ~**4,17 % HT**. Annoncez toujours vos honoraires **TTC**, sinon le client découvrira la TVA et se sentira trompé.",
          "## Prix net vendeur, honoraires et prix FAI",
          "- **Prix net vendeur** : ce que le vendeur touche réellement.",
          "- **Honoraires** : votre rémunération.",
          "- **Prix FAI** (frais d'agence inclus) = net vendeur **+** honoraires : c'est le prix affiché dans l'annonce.",
          "Exemple : 180 000 € net + 10 000 € d'honoraires = **190 000 € FAI**.",
          "## Qui paie les honoraires",
          "Le **mandat** doit préciser le **montant** des honoraires et **qui les supporte**, **vendeur** ou **acquéreur** — l'information doit rester cohérente entre mandat, annonce et compromis.",
          "- Petit avantage technique quand ils sont **à la charge de l'acquéreur** et distinctement mentionnés : les **droits de mutation** (la part principale des « frais de notaire », ~**5,8 à 6,3 %** du prix selon le département depuis le relèvement du taux départemental en 2025) se calculent alors sur le **prix hors honoraires**, ce qui **réduit un peu** les frais de l'acquéreur. Un point à valider avec le notaire (voir module Transaction & notaire).",
          "## Ce que finance votre commission",
          "L'honoraire n'est pas du bénéfice pur. Il couvre : la **diffusion** sur les portails (SeLoger, Le Bon Coin… postes coûteux), les **redevances d'enseigne**, les **charges** de l'agence (local, vitrine, assurance RCP, garantie financière), la **TVA**, et la **commission du négociateur** — qui n'en garde souvent qu'une **fraction** (parfois moins de la moitié en début de carrière).",
          "## Payé seulement si ça aboutit",
          "La **loi Hoguet** (loi n° 70-9 du 2 janvier 1970, art. 6) l'impose : **aucune commission n'est due tant que l'opération n'est pas effectivement conclue** et constatée par écrit. Vous êtes payé **le jour de l'acte authentique**, pas avant. Estimation, photos, diffusion, visites, négociation, suivi notaire : tout est **avancé à vos risques**. Si la vente capote, vous ne touchez rien.",
          "## Cas pratique",
          "Un vendeur : « 5 %, c'est beaucoup d'argent pour vous. » Réponse : « Regardons ce qu'il en reste : enlevez la TVA, la diffusion, les charges de l'agence et la part de l'enseigne. Surtout, je ne suis payé **que si je vends** — pas une heure n'est facturée avant l'acte. Je prends tout le risque à votre place. »"
        ]
      },
      {
        "titre": "Démontrer la valeur face à la vente entre particuliers",
        "contenu": [
          "Face à « vos honoraires sont élevés », on ne se **justifie** pas et on ne s'**excuse** pas : on **démontre**, preuves à l'appui, que la prestation **rapporte plus qu'elle ne coûte**.",
          "## Ce que l'agent apporte (vs vente PAP)",
          "- **Un meilleur prix net** : un bien correctement estimé, mis en valeur et exposé à **tout le marché** attire plus d'acquéreurs et se négocie au plus près de sa valeur — là où un particulier sur-estime (bien qui traîne) ou brade par méconnaissance.",
          "- **Des acquéreurs qualifiés et financés** : capacité d'emprunt vérifiée, projet sérieux. Pas de visites « touristiques », pas de ventes qui capotent faute de prêt.",
          "- **La sécurité juridique** : diagnostics, mentions obligatoires, conformité, vigilance **LCB-FT / Tracfin**. Une erreur sur un avant-contrat coûte bien plus cher que la commission.",
          "- **Le temps et la tranquillité** : estimation, photos, home-staging, diffusion multi-supports, visites, négociation, montage du dossier, suivi notaire — tout est géré, de bout en bout.",
          "## Chiffrer la valeur, pas l'effort",
          "Le client ne doit pas payer pour vos **heures** mais pour un **résultat**. Déplacez la discussion du « combien vous prenez » vers le « combien je vous fais gagner ».",
          "- Un écart de prix de vente de **3 à 5 %** obtenu par une bonne commercialisation sur un bien à 300 000 € représente **9 000 à 15 000 €** : souvent **plus que vos honoraires**.",
          "- Une vente qui capote chez un particulier (prêt refusé, vice de forme) fait **reperdre des mois** et parfois **des milliers d'euros** de négociation.",
          "## Apportez des preuves",
          "- Votre **délai de vente moyen** et votre **taux de concrétisation**.",
          "- Des **ventes comparables** récentes dans le secteur (Martigues, Port-de-Bouc, Istres…), appuyées sur les **prix réels** (base DVF, références notariales).",
          "- Le **réseau d'acquéreurs** déjà en portefeuille et la **force de l'enseigne** CENTURY 21.",
          "- Des **avis clients** et recommandations, qui prouvent le résultat au-delà de vos mots.",
          "## L'avantage « frais de notaire »",
          "Quand les honoraires sont **à la charge de l'acquéreur**, ils peuvent **sortir de l'assiette** des droits de mutation : l'acquéreur économise, selon le département, ~**6 %** du montant des honoraires sur ses frais de notaire. Sur 15 000 € d'honoraires, c'est près de **900 €** — un argument concret côté acheteur.",
          "## La phrase-clé",
          "« Mes honoraires ne vous **coûtent** pas, ils vous **rapportent** : entre un bon et un mauvais pilotage de la vente, l'écart dépasse largement ma commission — et je ne suis payé que si j'y arrive. »",
          "## Cas pratique",
          "Vendeur hésitant entre agence et vente seul. Vous : « Faisons le test. Vendu seul, à quel prix pensez-vous partir, et en combien de temps ? Maintenant, si je vous obtiens 4 % de plus et une vente sécurisée en deux mois, mes honoraires sont déjà remboursés — le reste, c'est du gagné et de la tranquillité. »"
        ]
      },
      {
        "titre": "Poser le cadre : annoncer ses honoraires avec assurance",
        "contenu": [
          "La manière dont vous **annoncez** vos honoraires détermine 80 % de la discussion qui suit. On ne subit pas le sujet, on le **cadre**.",
          "## Au bon moment : tôt, jamais caché",
          "- Abordez les honoraires **pendant la prise de mandat**, après avoir démontré votre valeur, **pas** glissés à la dernière minute dans le contrat.",
          "- Un honoraire **caché puis découvert** détruit la confiance ; un honoraire **annoncé avec aplomb** la renforce.",
          "## Annoncer comme une évidence",
          "Dites le chiffre **clairement, en TTC et en euros**, puis **taisez-vous**. Le silence après l'annonce est votre meilleur allié : c'est à l'autre de parler.",
          "- **Oui** : « Mes honoraires sont de **17 500 €**, soit **5 % TTC**, intégralement liés au résultat. »",
          "- **Non** : « Alors… ma petite commission serait, disons… dans les 5 %, enfin on peut voir… ».",
          "## Le langage qui tient le prix",
          "- Bannissez **« petite »**, **« seulement »**, **« désolé »**, **« normalement »** : ils trahissent le doute.",
          "- Dites **« mes honoraires »** (assumé), pas **« les frais d'agence »** (subi).",
          "- Reliez toujours le prix à un **résultat** : « … pour vous vendre au meilleur prix et en sécurité. »",
          "## La technique du sandwich",
          "Encadrez le prix de **valeur** : **valeur → prix → valeur**. « Je mets tous les moyens de l'agence et de l'enseigne (valeur). Mes honoraires sont de 5 % TTC (prix). Et je ne suis payé que si je vous vends au bon prix (valeur). »",
          "## Erreurs fréquentes",
          "- Annoncer le **pourcentage seul**, abstrait, au lieu du **montant en euros** relié au service.",
          "- **Enchaîner** nerveusement après le chiffre : on comble le silence par une justification… ou une baisse.",
          "- Présenter les honoraires comme une **contrainte** (« c'est le tarif de la maison ») plutôt que comme une **valeur**.",
          "## Cas pratique",
          "Prise de mandat à Martigues, maison à 350 000 €. « Voici ce que je déploie pour vous (vous déroulez le plan). Mes honoraires sont de **17 500 €, 5 % TTC**, et je ne les perçois **que le jour de la vente**. » — Puis silence, regard calme. Vous laissez le vendeur réagir."
        ]
      },
      {
        "titre": "Traiter les objections sur les honoraires",
        "contenu": [
          "Une objection sur les honoraires n'est pas un refus : c'est une **demande de réassurance**. On ne contre pas, on **traite** — avec méthode et des scripts rodés.",
          "## La méthode A.C.R.E.",
          "- **A — Accueillir** : accuser réception sans se crisper. « Je comprends, c'est une vraie question. »",
          "- **C — Creuser** : questionner pour isoler la vraie objection. « Par rapport à quoi trouvez-vous que c'est élevé ? »",
          "- **R — Recadrer** : ramener à la valeur et au résultat, pas au pourcentage.",
          "- **E — Engager** : reconclure. « Si c'est clair pour vous, on part là-dessus ? »",
          "## « C'est trop cher / trop élevé »",
          "« Élevé par rapport à quoi ? À ce que vous allez **gagner** ou **sécuriser**, c'est au contraire un très bon placement. Ce qui doit vous intéresser, c'est le **net dans votre poche**, pas le pourcentage. »",
          "## « L'agence / le mandataire d'à côté prend 3 % »",
          "Ne **dénigrez jamais** un confrère (déontologie, et ça vous rabaisse). « C'est possible. La vraie question n'est pas qui est le moins cher, mais qui vous **vend le mieux**. Un honoraire plus bas avec moins de moyens et un bien qui traîne vous coûte, au final, bien plus cher. »",
          "## « Autant d'argent pour quelques visites ? »",
          "« Les visites, c'est la partie visible. Vous payez l'**estimation juste**, la **mise en valeur**, la **diffusion**, la **sélection** d'acquéreurs financés, la **négociation**, la **sécurité juridique** et le **suivi jusqu'à l'acte** — et seulement **si ça aboutit**. »",
          "## « Je vais d'abord essayer de vendre seul »",
          "« C'est votre droit. Beaucoup essaient, puis nous confient le bien après l'avoir « grillé » à un prix mal calibré. Donnons-nous un cadre clair : je vous montre en deux semaines ce que je sais faire que vous ne pouvez pas faire seul. »",
          "## « J'ai déjà un acheteur / c'est pour un proche »",
          "« Très bien, intégrons-le au mandat : même avec un acquéreur connu, vous avez besoin d'un **prix juste**, d'un **avant-contrat sécurisé** et du **suivi jusqu'à l'acte**. On peut adapter la mission, pas supprimer le risque juridique. »",
          "## « Baissez et je signe tout de suite »",
          "Ne lâchez pas pour lâcher : **transformez-le en échange**. « Avec plaisir si on avance ensemble : partons en **exclusivité**, et je peux étudier un geste car je me rattrape sur l'efficacité. » (voir leçon suivante).",
          "## Pièges à éviter",
          "- Répondre **trop vite** : laissez l'objection se poser, respirez.",
          "- **Baisser** à la première objection « réflexe » qui n'en est pas vraiment une.",
          "- Partir dans une **justification défensive** et bavarde : une phrase calme vaut mieux qu'un plaidoyer.",
          "## Cas pratique",
          "« Franchement, 5 %, c'est cher. » — « Je comprends (A). Cher par rapport à quoi, exactement ? (C) … Je vois. En réalité, ce qui compte c'est que vous repartiez avec le meilleur net possible, en sécurité et sans y passer vos week-ends (R). Si on est d'accord là-dessus, on signe et je lance la commercialisation dès demain (E). »"
        ]
      },
      {
        "titre": "Négocier toute concession sans se dévaloriser",
        "contenu": [
          "Si une remise doit se discuter, elle ne se **donne** jamais : elle s'**échange**. Une concession offerte perd toute valeur et en appelle d'autres.",
          "## Règles d'or",
          "- **Jamais de baisse sans contrepartie** : chaque geste s'achète.",
          "- **Concéder petit, à regret, et par paliers** : une concession facile n'a aucune valeur.",
          "- **Une seule fois** : annoncez votre geste comme **final**, pas comme la première marche d'un escalier.",
          "- **Ne proposez jamais le premier chiffre rond** : laissez l'autre s'avancer.",
          "## La grille des contreparties",
          "Ayez toujours en tête ce que vous pouvez **demander en échange** :",
          "- Le passage en **mandat exclusif**.",
          "- Un **mandat plus long** (durée ferme).",
          "- Un **prix de mise en vente au juste niveau** (bien estimé, pas surcoté).",
          "- La **recommandation** à l'entourage, un **avis client**.",
          "- La **souplesse sur les visites** et la mise en valeur (home-staging, désencombrement).",
          "## La formule conditionnelle « si… alors… »",
          "« **Si** nous partons en exclusivité **et** que nous calons le prix au juste niveau, **alors** je peux étudier un geste sur mes honoraires : là je mets tous les moyens et je me rattrape sur l'efficacité. »",
          "## Verrouiller et tracer",
          "- Toute concession acceptée se **formalise par écrit** (mandat ou avenant) : contrepartie **et** nouveau montant.",
          "- Défendre le **juste prix du bien** = défendre sa **crédibilité** : un agent qui tient le prix du bien inspire confiance pour tenir le sien.",
          "## Garder la relation",
          "On négocie **fermement mais chaleureusement**. L'objectif est un accord où le client se sent **gagnant**, pas une victoire à l'arraché qui laisse un goût amer et compromet les recommandations.",
          "## Cas pratique chiffré",
          "Vendeur : « À 5 %, non. À 4 %, je signe. » Vous (maison 350 000 €) : « Je ne peux pas lâcher un point comme ça — ce serait 3 500 € en moins pour le même travail. En revanche, **en exclusivité**, où je concentre tous mes moyens, je peux descendre à **4,7 %** (16 450 €). On gagne tous les deux : vous, un geste et un engagement total ; moi, les conditions pour vous vendre vite et bien. » Vous avez cédé **1 050 €** au lieu de **3 500 €**, et gagné l'exclusivité."
        ]
      },
      {
        "titre": "Face au discount, aux mandataires et au PAP",
        "contenu": [
          "La concurrence par les prix est réelle : réseaux de **mandataires**, **forfaits fixes**, plateformes **entre particuliers**. On ne la combat pas sur le **pourcentage**, mais sur la **valeur**.",
          "## Le paysage",
          "- **Agences traditionnelles** : pignon sur rue, barème dégressif, accompagnement complet.",
          "- **Réseaux de mandataires** : honoraires souvent plus bas, mais agent isolé, sans vitrine physique ni toujours le même niveau de moyens.",
          "- **Forfaits fixes / discount** : prix d'appel, prestations parfois réduites (diffusion, visites, suivi).",
          "- **Vente entre particuliers (PAP)** : zéro honoraire affiché, mais risque juridique et prix souvent mal calibré.",
          "## Règle d'or : ne jamais dénigrer",
          "Dénigrer un concurrent est contraire à la **déontologie** (décret n° 2015-1090 fixant les règles de déontologie des professionnels de l'immobilier) et vous **rabaisse**. On ne dit jamais de mal : on **montre** sa différence.",
          "## Différencier par la valeur",
          "- La **présence locale** : une vitrine à Martigues, un interlocuteur que l'on rencontre, qui connaît le secteur et ses prix réels.",
          "- La **force de l'enseigne** : notoriété CENTURY 21, portefeuille d'acquéreurs, outils, diffusion.",
          "- L'**accompagnement physique** de la prise de mandat jusqu'à l'acte, visites comprises.",
          "- La **sécurité** : conformité, LCB-FT, montage de dossier, suivi notaire.",
          "## Le vrai coût du « pas cher »",
          "Moins d'honoraires signifie souvent **moins de moyens** : diffusion limitée, moins de présence, bien qui **traîne** et finit par **baisser de prix**. L'économie sur la commission est alors **mangée** par la décote du bien.",
          "## Recentrer sur le net",
          "« Ne comparez pas des pourcentages, comparez des **résultats**. Ce qui compte, c'est le **net dans votre poche à la fin** et la **sécurité** du parcours — pas la ligne « honoraires » prise isolément. »",
          "## Cas pratique",
          "« Un mandataire me propose 3 %. » — « C'est une option. Posez-vous une question simple : avec qui allez-vous **vendre au meilleur prix, le plus vite et le plus sereinement** ? Moi, j'ai pignon sur rue à Martigues, le réseau d'acquéreurs de l'enseigne, et je vous accompagne physiquement de A à Z. Un point de commission en moins ne sert à rien si le bien se vend 5 % moins cher ou met six mois de plus. »"
        ]
      },
      {
        "titre": "Boîte à outils : mnémoniques, scripts et cas complet",
        "contenu": [
          "De quoi **passer à l'action** : mémos, phrases à connaître par cœur, et un dialogue complet de la prise de mandat à l'accord.",
          "## Les mnémoniques à retenir",
          "- **A.C.R.E.** pour traiter une objection : **A**ccueillir, **C**reuser, **R**ecadrer, **E**ngager.",
          "- **Valeur → Prix → Valeur** : toujours encadrer le chiffre.",
          "- **Si… alors…** : aucune concession sans contrepartie.",
          "## Phrases-types à mémoriser",
          "- « Mes honoraires ne vous **coûtent** pas, ils vous **rapportent**. »",
          "- « Ce qui compte, c'est le **net dans votre poche**, pas le pourcentage. »",
          "- « Je ne suis payé **que si je vends** : je prends le risque à votre place. »",
          "- « Élevé par rapport à quoi ? »",
          "- « Je peux étudier un geste **si** nous partons en exclusivité. »",
          "## Les 5 contreparties à avoir en tête",
          "- L'**exclusivité**.",
          "- La **durée ferme** du mandat.",
          "- Le **juste prix** de mise en vente.",
          "- La **recommandation** ou un avis client.",
          "- La **souplesse** sur les visites et la mise en valeur.",
          "## Check-list avant un rendez-vous de mandat",
          "- Barème **affiché** et connu par cœur, montant **en euros** préparé pour ce bien.",
          "- Preuves prêtes : **ventes comparables**, **délai moyen**, **taux de concrétisation**.",
          "- Plan de commercialisation **écrit** à dérouler avant d'annoncer le prix.",
          "- Grille de **contreparties** décidée à l'avance (jusqu'où, contre quoi).",
          "## Cas pratique complet",
          "Maison à Martigues, 350 000 € net vendeur. — Vendeur : « Vous prenez combien ? » — Vous : « Avant le chiffre, voici comment je vais vous vendre (vous déroulez le plan : estimation, photos, home-staging, diffusion enseigne, acquéreurs financés, suivi notaire). Mes honoraires sont de **17 500 €, 5 % TTC**, payés **seulement le jour de la vente**. » — Vendeur : « C'est cher, le mandataire prend 3 %. » — Vous : « Je comprends (A). Cher par rapport à quoi ? (C) En réalité, ce qui compte, c'est votre **net** et la **sécurité** : un point de moins ne sert à rien si le bien se vend moins cher ou met des mois (R). » — Vendeur : « Faites un geste. » — Vous : « **Si** on part en **exclusivité** et au **juste prix**, **alors** je descends à **4,7 %** — tous les moyens, et je me rattrape sur l'efficacité (E + échange). On signe et je lance demain ? »",
          "## À retenir",
          "Défendre ses honoraires, ce n'est pas être rigide : c'est **assumer sa valeur**, **prouver le résultat** et **n'échanger** une concession que contre un avantage. Le prix se tient avec **calme**, jamais avec **crispation**."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Brader ses honoraires au premier doute…",
        "options": [
          "Rassure le client",
          "Dévalorise la prestation et entame directement la marge",
          "Accélère toujours la vente",
          "N'a aucun effet"
        ],
        "correct": 1,
        "explication": "Casser son prix sans raison dévalorise l'agent, crée un précédent et ampute directement le résultat net — les honoraires n'ont quasiment pas de coût variable à amortir."
      },
      {
        "question": "La meilleure réponse à « vos honoraires sont élevés » est…",
        "options": [
          "Baisser tout de suite",
          "Démontrer la valeur apportée (meilleur prix net, sécurité, temps gagné)",
          "Se justifier en s'excusant",
          "Changer de sujet"
        ],
        "correct": 1,
        "explication": "On ne se justifie pas, on démontre, preuves à l'appui, que les honoraires rapportent plus qu'ils ne coûtent : prix net, sécurité juridique et tranquillité."
      },
      {
        "question": "Une remise sur les honoraires doit toujours être…",
        "options": [
          "Donnée pour faire plaisir",
          "Échangée contre une contrepartie (exclusivité, juste prix…)",
          "Accordée automatiquement",
          "La plus large possible"
        ],
        "correct": 1,
        "explication": "Jamais de concession sans contrepartie : exclusivité, durée ferme, juste prix de mise en vente, recommandation ou souplesse sur les visites — une baisse offerte perd toute valeur et en appelle d'autres."
      },
      {
        "question": "Les honoraires d'agence sont, en droit français…",
        "options": [
          "Fixés par l'État",
          "Libres depuis l'ordonnance du 1er décembre 1986",
          "Plafonnés par la loi ALUR à 5 %",
          "Fixés par la chambre des notaires"
        ],
        "correct": 1,
        "explication": "Ils sont libres depuis l'ordonnance n° 86-1243 du 1er décembre 1986 ; chaque agence fixe son barème, qui doit être affiché TTC et reste négociable à la baisse (c'est un plafond, pas un plancher)."
      },
      {
        "question": "Quand les honoraires d'agence sont-ils dus ?",
        "options": [
          "Dès la signature du mandat",
          "Après la première visite",
          "Seulement une fois la vente conclue (loi Hoguet)",
          "Chaque mois de commercialisation"
        ],
        "correct": 2,
        "explication": "L'article 6 de la loi Hoguet impose qu'aucune commission ne soit due tant que l'opération n'est pas effectivement conclue : l'agent est payé le jour de l'acte authentique et avance tout à ses risques."
      },
      {
        "question": "La méthode A.C.R.E. pour traiter une objection signifie…",
        "options": [
          "Accueillir, Creuser, Recadrer, Engager",
          "Attaquer, Convaincre, Rabaisser, Exiger",
          "Accepter, Céder, Réduire, Encaisser",
          "Analyser, Comparer, Résister, Éviter"
        ],
        "correct": 0,
        "explication": "On accueille l'objection sans se crisper, on creuse pour isoler la vraie question, on recadre sur la valeur et le net, puis on engage vers l'accord."
      },
      {
        "question": "Un barème d'honoraires dit « dégressif » signifie que le pourcentage appliqué...",
        "options": [
          "Augmente à mesure que le prix du bien monte",
          "Diminue à mesure que le prix du bien augmente",
          "Reste identique quel que soit le prix",
          "Change selon le profil du client"
        ],
        "correct": 1,
        "explication": "Dans un barème dégressif, le taux baisse quand le prix du bien augmente."
      },
      {
        "question": "Sur une maison à 350 000 € net vendeur, passer du barème de 5 % à 4 % fait perdre à l'agence...",
        "options": [
          "1 000 €",
          "3 500 €",
          "7 000 €",
          "17 500 €"
        ],
        "correct": 1,
        "explication": "17 500 € moins 14 000 € font 3 500 € perdus, soit 20 % de la rémunération du dossier."
      },
      {
        "question": "La technique du « sandwich » pour annoncer ses honoraires consiste à...",
        "options": [
          "Annoncer trois tarifs différents",
          "Encadrer le prix par de la valeur : valeur, prix, valeur",
          "Diviser les honoraires en trois versements",
          "Répéter le montant trois fois de suite"
        ],
        "correct": 1,
        "explication": "On encadre le chiffre de valeur : valeur, puis prix, puis valeur à nouveau."
      },
      {
        "question": "Depuis quel texte les honoraires d'agence sont-ils librement fixés en France ?",
        "options": [
          "La loi Hoguet du 2 janvier 1970",
          "L'ordonnance du 1er décembre 1986 sur la liberté des prix",
          "La loi ALUR du 24 mars 2014",
          "La loi Macron du 6 août 2015"
        ],
        "correct": 1,
        "explication": "L'ordonnance n° 86-1243 du 1er décembre 1986 a libéré les prix, dont les honoraires d'agence."
      },
      {
        "question": "Un barème annoncé « 5 % TTC » correspond, hors taxe, à environ...",
        "options": [
          "3 % HT",
          "4,17 % HT",
          "5 % HT",
          "6 % HT"
        ],
        "correct": 1,
        "explication": "Avec une TVA à 20 %, 5 % TTC équivalent à environ 4,17 % HT."
      },
      {
        "question": "Le prix FAI (frais d'agence inclus) affiché dans l'annonce correspond à...",
        "options": [
          "Le prix net vendeur seul",
          "Les honoraires seuls",
          "Le prix net vendeur plus les honoraires",
          "Le prix hors TVA"
        ],
        "correct": 2,
        "explication": "Le prix FAI est la somme du net vendeur et des honoraires d'agence."
      },
      {
        "question": "Face à « l'agence d'à côté ne prend que 3 % », la bonne attitude est de...",
        "options": [
          "Dénigrer la concurrence",
          "S'aligner immédiatement sur son tarif",
          "Ne jamais dénigrer et recentrer sur qui vend le mieux et le plus sûrement",
          "Refuser le mandat"
        ],
        "correct": 2,
        "explication": "On ne dénigre pas un confrère ; on recentre sur le net final et la sécurité de la vente."
      },
      {
        "question": "Selon la règle d'or de la négociation, une concession sur les honoraires doit...",
        "options": [
          "Être accordée dès la première objection",
          "S'échanger contre une contrepartie, jamais se donner",
          "Être proposée spontanément pour rassurer",
          "Être offerte pour conclure plus vite"
        ],
        "correct": 1,
        "explication": "Une concession ne se donne jamais : elle s'échange contre une contrepartie comme l'exclusivité."
      },
      {
        "question": "Quand les honoraires sont mis à la charge de l'acquéreur et distinctement mentionnés, les droits de mutation se calculent...",
        "options": [
          "Sur le prix FAI",
          "Sur le prix hors honoraires",
          "Sur les honoraires seuls",
          "Sur le net vendeur majoré d'une taxe"
        ],
        "correct": 1,
        "explication": "L'assiette des droits de mutation est alors le prix hors honoraires, ce qui réduit un peu les frais de l'acquéreur."
      },
      {
        "question": "Juste après avoir annoncé clairement le montant de ses honoraires, l'agent doit...",
        "options": [
          "Enchaîner par une justification détaillée",
          "Se taire et laisser le client réagir",
          "Proposer aussitôt une remise",
          "Changer de sujet"
        ],
        "correct": 1,
        "explication": "Le silence après l'annonce est l'allié de l'agent : c'est à l'autre de parler."
      },
      {
        "question": "Les honoraires d'agence financent notamment...",
        "options": [
          "Uniquement le salaire du négociateur",
          "Seulement la publicité en vitrine",
          "La diffusion sur les portails, les charges de l'agence, la TVA et la part du négociateur",
          "Les frais de notaire de l'acquéreur"
        ],
        "correct": 2,
        "explication": "L'honoraire couvre la diffusion, les charges, l'enseigne, la TVA et la part du négociateur."
      },
      {
        "question": "La formule conditionnelle « si... alors... » sert, en négociation, à...",
        "options": [
          "Menacer le client de retirer le bien",
          "Ne consentir un geste qu'en échange d'une contrepartie",
          "Reporter indéfiniment la signature",
          "Justifier le montant par les heures passées"
        ],
        "correct": 1,
        "explication": "Elle conditionne tout geste sur les honoraires à une contrepartie, par exemple l'exclusivité."
      }
    ]
  },
  {
    "id": "transaction-notaire",
    "titre": "La transaction & le notaire",
    "icone": "🏛️",
    "categorie": "Transaction",
    "resume": "Piloter une vente de A à Z : le notaire, le séquestre, les préemptions, les frais d'acquisition, qui peut vendre, l'attestation et le titre.",
    "duree": "35 min",
    "lecons": [
      {
        "titre": "Le déroulé complet d'une transaction",
        "contenu": [
          "Une vente immobilière est une **chaîne d'étapes** qui s'étale sur **3 à 4 mois** entre l'accord et la remise des clés. Le négociateur n'est pas un simple intermédiaire : il est le **chef d'orchestre** qui pilote chaque maillon et surveille chaque délai. Une vente ne se perd presque jamais au moment de l'offre — elle se perd **entre le compromis et l'acte**, faute de suivi.",
          "## Les 6 grandes étapes",
          "- **1. Le mandat** : accord écrit vendeur ↔ agence, préalable obligatoire (loi Hoguet). Voir le module Prise de mandat.",
          "- **2. La mise en vente** : avis de valeur, diffusion, visites, reporting régulier au vendeur.",
          "- **3. L'offre d'achat** : écrite, datée, transmise au vendeur, puis négociée jusqu'à l'accord sur le prix et les conditions.",
          "- **4. L'avant-contrat** : compromis de vente (ou promesse unilatérale), signé à l'agence ou chez le notaire — c'est le véritable **engagement juridique** des parties.",
          "- **5. La période suspensive** : délai de rétractation de **10 jours** (loi SRU), purge des **droits de préemption**, obtention du **prêt** (condition suspensive), levée des conditions.",
          "- **6. L'acte authentique** : signature chez le notaire, versement du prix, remise des clés, puis publication au service de la publicité foncière.",
          "## Compromis ou promesse : deux avant-contrats",
          "- Le **compromis (promesse synallagmatique)** engage **les deux parties** : le vendeur s'oblige à vendre et l'acquéreur à acheter. C'est la forme la plus courante.",
          "- La **promesse unilatérale de vente** n'engage d'abord que le **vendeur**, qui réserve le bien pendant un délai d'option ; l'acquéreur verse une **indemnité d'immobilisation** et lève l'option s'il confirme.",
          "- Dans les deux cas, l'acquéreur non professionnel bénéficie du **délai de rétractation de 10 jours**. Le détail est traité dans le module Compromis & financement.",
          "## Les délais à connaître par cœur",
          "- Entre l'**offre acceptée** et le **compromis** : 1 à 3 semaines, le temps de réunir les pièces.",
          "- **Délai de rétractation SRU** de l'acquéreur : **10 jours** calendaires à compter du lendemain de la notification du compromis.",
          "- **Condition suspensive de prêt** : en général **45 à 60 jours** (minimum légal 1 mois). Détail dans le module Compromis & financement.",
          "- **Purge du droit de préemption** de la commune : **2 mois** après réception de la déclaration d'intention d'aliéner (DIA).",
          "- Entre **compromis et acte** : **2,5 à 4 mois** en moyenne.",
          "## Le rôle de l'agent entre compromis et acte",
          "Votre travail ne s'arrête pas à la signature du compromis — il **commence vraiment**. Vous devez :",
          "- Transmettre un **dossier complet** au notaire (titre, diagnostics, pièces de copropriété…).",
          "- Relancer l'acquéreur sur son **dépôt de dossier bancaire** : une offre de prêt met environ 6 semaines à sortir.",
          "- Faire le **lien** entre les deux notaires, la banque, le vendeur et l'acquéreur.",
          "- Vérifier chaque jalon : rétractation purgée, préemption purgée, prêt obtenu, date d'acte fixée.",
          "La **condition suspensive de prêt** est la **première cause** de ventes qui échouent : surveillez ce jalon plus que tout autre.",
          "## Mnémonique",
          "Retenez **« M-V-O-A-S-A »** : Mandat, Vente (mise en), Offre, Avant-contrat, Suspensif (délais), Acte. Si vous savez à tout moment où en est chaque dossier sur cette ligne, rien ne vous échappe.",
          "## Mini cas pratique",
          "Compromis signé le **6 octobre** pour un T3 à Martigues. Notification à l'acquéreur le 8 octobre → fin de rétractation le **18 octobre**. DIA envoyée à la mairie → réponse attendue au plus tard le **8 décembre**. Offre de prêt obtenue le 20 novembre, acceptée après le **délai de réflexion incompressible de 10 jours** (acceptation au plus tôt le 11ᵉ jour). Acte authentique calé pour la **mi-janvier** : environ **3 mois et demi**, un calendrier parfaitement normal à annoncer dès le départ aux deux parties.",
          "## Erreur fréquente",
          "Annoncer « c'est vendu » au vendeur dès l'offre acceptée. Tant que le délai de rétractation n'est pas purgé et les conditions levées, **rien n'est acquis**. Parlez d'**offre acceptée**, puis de **compromis signé**, et seulement à l'acte de **vente réalisée**."
        ]
      },
      {
        "titre": "Le notaire : officier public ministériel",
        "contenu": [
          "Le **notaire** est un **officier public ministériel** : nommé par l'État (garde des Sceaux), il exerce une profession libérale mais détient une **délégation de puissance publique**. Quand il appose son sceau, il engage l'État.",
          "## Les trois super-pouvoirs de l'acte notarié",
          "- **L'authenticité** : l'acte fait **foi jusqu'à inscription de faux** (une procédure exceptionnelle). Ce qui y est écrit est réputé vrai.",
          "- **La date certaine** : la date de l'acte est incontestable et opposable à tous.",
          "- **La force exécutoire** : l'acte vaut jugement, sans passer par un tribunal (utile pour recouvrer une créance, saisir…).",
          "## Ses missions dans une vente",
          "- **Vérifier** la situation juridique : titre de propriété, origine de propriété sur **30 ans**, hypothèques, servitudes, situation d'urbanisme, capacité des parties à vendre.",
          "- **Purger** les droits : délai de rétractation, conditions suspensives, **droits de préemption** (commune, locataire, SAFER, coïndivisaires).",
          "- **Rédiger et recevoir** l'acte authentique de vente.",
          "- **Séquestrer** les fonds (dépôt de garantie puis prix) sur son compte à la Caisse des dépôts, puis les **répartir** : vendeur, banque qui lève l'hypothèque, Trésor public, honoraires d'agence.",
          "- **Publier** la vente au **service de la publicité foncière** (ex-conservation des hypothèques) : c'est cette publication qui rend la vente **opposable aux tiers**.",
          "- **Collecter et reverser** les impôts : les **droits de mutation** réglés par l'acquéreur, et l'éventuelle **plus-value** du vendeur — imposée à **19 % (impôt sur le revenu) + 17,2 % (prélèvements sociaux)**, sauf exonération (résidence principale notamment). Détail dans le module Fiscalité : la plus-value immobilière.",
          "## Le devoir de conseil",
          "- Le notaire a une obligation d'**information et de conseil** envers **toutes** les parties, qu'il soit choisi par le vendeur ou par l'acquéreur : il doit les éclairer sur la portée et les risques de l'acte.",
          "- Sa **responsabilité** peut être engagée s'il manque à ce devoir — raison de plus pour lui transmettre un dossier **complet et sincère**, sans rien dissimuler.",
          "## Un ou deux notaires ?",
          "Acquéreur et vendeur peuvent prendre **chacun leur notaire** : cela **ne coûte pas un centime de plus**. Les deux notaires se **partagent les émoluments** (règle du partage) et travaillent ensemble, l'un étant le « notaire rédacteur ». Rassurez vos clients : « Avoir votre propre notaire ne change rien au coût, et vous êtes conseillé par quelqu'un qui défend vos intérêts. »",
          "## Choisir et travailler avec son notaire",
          "- Le choix du notaire est **libre** ; en pratique chacun garde volontiers le sien (notaire de famille).",
          "- Un notaire **réactif** est un allié : nouez une relation de confiance avec deux ou trois études de votre secteur.",
          "- Transmettez-leur des **dossiers propres et complets** : vous gagnez des semaines, et une étude satisfaite vous recommande des clients.",
          "## Erreurs fréquentes",
          "- Présenter le notaire au client comme un simple « frais » : il est d'abord un **sécurisateur juridique** et ne perçoit qu'une faible part des « frais de notaire ».",
          "- Laisser le dossier « vivre sa vie » chez le notaire sans relancer : **personne ne pilote les délais à votre place**.",
          "## Mini cas pratique",
          "Vos vendeurs à Martigues veulent garder maître X, leur notaire de famille ; l'acquéreur, lyonnais, veut le sien à Lyon. Vous détendez tout le monde : « Chacun garde son notaire, le coût est identique, et la signature peut même se faire **à distance par procuration ou en visio** entre les deux études. » La vente avance sans crispation."
        ]
      },
      {
        "titre": "Le séquestre et le dépôt de garantie",
        "contenu": [
          "Entre l'avant-contrat et l'acte, l'acquéreur verse une somme d'avance : le **dépôt de garantie** (dans un compromis) ou l'**indemnité d'immobilisation** (dans une promesse unilatérale). C'est un signal d'engagement — et un sujet de vigilance majeur pour l'agent.",
          "## Combien et pourquoi",
          "- Usage courant : **5 à 10 %** du prix de vente (par exemple **15 000 €** pour un bien à **200 000 €**).",
          "- Ce n'est **pas une obligation légale** : c'est un **usage** qui sécurise le vendeur et prouve le sérieux de l'acquéreur.",
          "- Cette somme s'**impute sur le prix** le jour de l'acte : elle n'est pas « en plus ».",
          "## Qui détient les fonds (le séquestre) ?",
          "- Le plus souvent, le **notaire** : les fonds sont déposés sur son compte à la **Caisse des dépôts et consignations**, totalement sécurisés.",
          "- L'**agence** ne peut séquestrer **que si** elle détient une **garantie financière couvrant le maniement de fonds** et qu'un **compte séquestre** dédié est prévu. Sans cette garantie, l'agent **ne doit jamais** encaisser le dépôt.",
          "- Règle d'or : dans le doute, **on fait séquestrer chez le notaire**. On ne mélange **jamais** ces fonds avec la trésorerie de l'agence.",
          "## Que devient le dépôt selon les scénarios",
          "- **La vente se réalise** : le dépôt est imputé sur le prix, l'acquéreur verse le solde.",
          "- **L'acquéreur se rétracte dans les 10 jours (SRU)** : il récupère **l'intégralité** de son dépôt, sous **21 jours** maximum.",
          "- **Une condition suspensive échoue** (prêt refusé de bonne foi, préemption exercée…) : le dépôt est **restitué** à l'acquéreur.",
          "- **L'acquéreur renonce sans motif valable après les délais** : le vendeur peut **conserver** le dépôt au titre de la clause pénale, ou poursuivre l'exécution forcée de la vente.",
          "## La répartition des fonds le jour de l'acte",
          "Le notaire reçoit le **prix total** (apport de l'acquéreur + prêt viré par la banque), puis **répartit** :",
          "- Remboursement du **crédit du vendeur** et **mainlevée d'hypothèque** s'il y a lieu.",
          "- Paiement des **droits de mutation** et taxes au Trésor public.",
          "- Versement des **honoraires d'agence** : le notaire paie directement l'agence, sur présentation du mandat et de la facture.",
          "- Versement du **solde (prix net vendeur)** au vendeur, généralement sous quelques jours ouvrés.",
          "## Vigilance anti-blanchiment (LCB-FT)",
          "- Le notaire — **comme l'agent immobilier** — est un professionnel **assujetti à la lutte contre le blanchiment** (LCB-FT) : il doit vérifier l'**identité** des parties et l'**origine des fonds**.",
          "- En cas de doute (fonds d'origine inexpliquée, montage inhabituel, paiement par un tiers…), il adresse une **déclaration de soupçon à Tracfin**, sans en informer le client.",
          "- Les règlements passent par **virement tracé** ; le paiement en **espèces** est interdit au-delà des plafonds légaux. Une raison de plus de faire **séquestrer chez le notaire**.",
          "## Erreurs fréquentes",
          "- Encaisser un chèque de dépôt à l'agence sans garantie financière adaptée : **faute grave** au regard de la loi Hoguet.",
          "- Promettre au vendeur qu'il touchera son argent « le jour même » : le virement au vendeur part souvent **sous 2 à 3 jours ouvrés** après la signature.",
          "## Mini cas pratique",
          "Pour une maison vendue **320 000 €** à Saint-Mitre-les-Remparts, l'acquéreur verse **16 000 €** (5 %) séquestrés chez le notaire. Le prêt est finalement refusé, attestation de refus à l'appui : la condition suspensive joue, l'acquéreur **récupère ses 16 000 €**, et le vendeur ne peut rien retenir. Vous l'aviez expliqué dès le compromis : aucune mauvaise surprise, aucune tension."
        ]
      },
      {
        "titre": "Les droits de préemption",
        "contenu": [
          "Avant de vendre, il faut parfois **proposer d'abord le bien à un tiers prioritaire** : c'est le **droit de préemption**. Le notaire le purge via une **déclaration d'intention d'aliéner (DIA)**. Un agent averti les anticipe, car ils rallongent le calendrier de plusieurs semaines.",
          "## Le droit de préemption urbain (DPU) de la commune",
          "- Dans les zones où la mairie l'a institué, la **commune** peut acheter en priorité, au prix et aux conditions de la vente.",
          "- Le notaire envoie une **DIA** ; la mairie dispose de **2 mois** pour répondre. **Silence = renonciation.**",
          "- La commune peut **préempter au prix**, **renoncer**, ou **contester le prix** (le juge de l'expropriation fixe alors la valeur) — ce dernier cas est rare mais rallonge fortement le délai.",
          "- Elle ne préempte que pour un projet d'intérêt général (logement, équipement). C'est rare en pratique, mais le **délai de 2 mois** s'impose dans tous les cas.",
          "## Le droit de préemption du locataire",
          "- **Vente d'un logement loué vide avec congé pour vendre** (bail loi du 6 juillet 1989) : le congé donné pour la fin du bail **vaut offre de vente** au locataire, qui a **2 mois** pour se décider (**4 mois** s'il recourt à un prêt).",
          "- **Première vente après division d'un immeuble** (loi du 31 décembre 1975) : le locataire en place bénéficie aussi d'un droit de préemption.",
          "- Si le bien est vendu **occupé** (l'acquéreur reprend le bail en cours), il n'y a **pas** de droit de préemption du locataire.",
          "## Le droit de préemption de la SAFER",
          "- Sur les **biens agricoles, ruraux ou les terres** (vignes, parcelles, parfois maison avec terrain agricole), la **SAFER** peut préempter.",
          "- Délai : **2 mois** après notification. Fréquent autour de l'étang de Berre et dans l'arrière-pays provençal sur des parcelles agricoles.",
          "## Les coïndivisaires et autres cas",
          "- En **indivision**, un indivisaire qui vend sa quote-part à un tiers doit d'abord la **proposer aux autres indivisaires** (droit de préemption, art. 815-14 du Code civil).",
          "- Autres cas : préemption au titre des **Monuments historiques**, des **espaces naturels sensibles (ENS)** du département…",
          "## Ce que l'agent doit faire",
          "- **Détecter tôt** : le bien est-il loué ? issu d'une division récente ? un terrain agricole ? en indivision ?",
          "- **Prévenir les parties** du délai supplémentaire (jusqu'à 2 mois) à intégrer dans le calendrier.",
          "- Ne **jamais** promettre une date d'acte **avant** d'avoir intégré la purge de préemption.",
          "## Mini cas pratique",
          "Un appartement loué vide à Martigues ; le propriétaire veut le vendre **libre**. Il faut d'abord **donner congé pour vendre** au locataire (6 mois avant l'échéance du bail), lequel devient **prioritaire pour acheter** aux conditions proposées pendant **2 mois**. Mal anticipé, ce droit peut décaler la vente de plusieurs mois : annoncez-le au vendeur **dès la prise de mandat**."
        ]
      },
      {
        "titre": "Les frais d'acquisition (« frais de notaire »)",
        "contenu": [
          "L'expression « frais de notaire » est **trompeuse** : ce sont des **frais d'acquisition**, et le notaire n'en garde qu'une **petite part**. Savoir les expliquer rassure l'acquéreur et évite les blocages de dernière minute sur le budget.",
          "## Leur composition (4 blocs)",
          "- **Les droits de mutation (DMTO)** : impôts versés au département, à la commune et à l'État. C'est **de loin la plus grosse part**, environ les 4/5 du total dans l'ancien.",
          "- **Les émoluments du notaire** : sa rémunération, **réglementée** par l'État et **dégressive** selon le prix.",
          "- **Les débours et formalités** : sommes avancées par le notaire (documents d'urbanisme, géomètre, état hypothécaire, publication…).",
          "- **La contribution de sécurité immobilière** : **0,10 %** du prix, versée à l'État pour la publicité foncière.",
          "## Les droits de mutation en détail (ancien)",
          "- Part **départementale** : **4,50 %** (taux de droit commun).",
          "- Part **communale** : **1,20 %**.",
          "- **Frais d'assiette et de recouvrement** (2,37 % de la part départementale) : environ **0,11 %**.",
          "- Total standard ≈ **5,80 %** du prix.",
          "- **Depuis le 1ᵉʳ avril 2025**, la loi de finances autorise les départements à relever leur part de 4,50 % jusqu'à **5,00 %** (pour les actes conclus jusqu'au 31 mars 2028). Là où c'est appliqué — plus de 70 départements —, le total DMTO atteint environ **6,3 %**. **Vérifiez le taux de votre département.**",
          "- **Primo-accédants** : pour un premier achat de **résidence principale**, la hausse ne s'applique pas, et de nombreux départements votent en plus un **taux réduit, voire une exonération** de leur part.",
          "- Conditions types du régime primo-accédant : ne pas avoir été **propriétaire de sa résidence principale au cours des 2 dernières années** et s'**engager à occuper le bien 5 ans**. À vérifier localement.",
          "## Le barème des émoluments (en vigueur)",
          "Émoluments proportionnels **hors taxes**, calculés par tranches du prix — ajouter la **TVA à 20 %** :",
          "- De 0 à 6 500 € : **3,870 %**.",
          "- De 6 500 à 17 000 € : **1,596 %**.",
          "- De 17 000 à 60 000 € : **1,064 %**.",
          "- Au-delà de 60 000 € : **0,799 %**.",
          "- Le notaire peut consentir une **remise allant jusqu'à 20 %** sur la part du prix **supérieure à 100 000 €** (remise facultative, mais identique pour tous ses clients).",
          "## Les ordres de grandeur à retenir",
          "- **Ancien** : environ **7 à 8 %** du prix, frais d'acquisition tout compris.",
          "- **Neuf / VEFA** : environ **2 à 3 %** (droits de mutation réduits ; détail dans le module Le neuf & la VEFA).",
          "## Qui paie quoi — ne pas confondre",
          "- Les **frais d'acquisition** sont **à la charge de l'acquéreur** et versés au notaire.",
          "- Les **honoraires d'agence** sont distincts : à la charge du **vendeur** ou de l'**acquéreur** selon le mandat.",
          "- Quand ils sont « à la charge acquéreur » (mention FAI), ils peuvent **réduire l'assiette** des droits de mutation — un point à verrouiller avec le notaire pour optimiser le budget.",
          "## Mini cas pratique",
          "Appartement à **250 000 €** dans l'ancien à Martigues, honoraires à la charge du vendeur :",
          "- Émoluments du notaire ≈ **2 870 € TTC**, soit environ **1,1 %** du prix.",
          "- Droits de mutation ≈ **14 500 à 15 800 €** selon le taux départemental appliqué.",
          "- Débours + contribution de sécurité immobilière ≈ **1 000 à 1 400 €**.",
          "- Total frais d'acquisition ≈ **18 000 à 20 000 €**, soit **~7,5 %**. L'acquéreur doit les **financer en plus** du prix, car ils sont rarement couverts par le prêt.",
          "## Erreur fréquente",
          "Oublier d'intégrer les frais d'acquisition dans le **budget total** de l'acquéreur : un primo-accédant qui a « 250 000 € » dispose en réalité d'un pouvoir d'achat immobilier d'environ **232 000 €** une fois les frais déduits. Clarifiez-le dès la qualification pour ne pas faire visiter hors budget."
        ]
      },
      {
        "titre": "L'attestation de propriété, le titre et l'origine de propriété",
        "contenu": [
          "Pour vendre, il faut **prouver qu'on est propriétaire**. Trois notions voisines, souvent confondues par les clients, que vous devez savoir distinguer : le **titre de propriété**, l'**attestation de propriété** et l'**origine de propriété**.",
          "## Le titre de propriété",
          "- C'est le document qui **prouve la propriété** : **copie authentique** de l'acte de vente antérieur, **attestation immobilière** (succession/donation) ou acte de partage.",
          "- Le vendeur en remet une copie dès le mandat. S'il l'a **égaré**, le notaire en redemande une copie à l'étude qui a reçu l'acte : prévoir de **quelques jours à quelques semaines**.",
          "## L'attestation de propriété : deux cas, deux natures",
          "- **Après une VENTE** : le jour de la signature, le notaire remet à l'acquéreur une **attestation de propriété** (dite « attestation de vente »). Elle est **provisoire** : elle prouve immédiatement la qualité de propriétaire (pour EDF, l'assurance, la banque, le syndic…) en attendant la **copie authentique** définitive, délivrée **quelques mois** plus tard après publication.",
          "- **Après un DÉCÈS ou une DONATION** : le notaire établit une **attestation immobilière** qui constate le transfert du bien aux héritiers. Elle est ici **définitive** et constitue leur **titre de propriété**.",
          "## Les délais en succession",
          "- L'attestation immobilière doit être **établie et publiée** au service de la publicité foncière dans les **6 mois** suivant le décès — le même délai que la **déclaration de succession** et le paiement des droits.",
          "- Exception : si un **acte de partage** des biens est dressé et publié **dans les 10 mois** du décès, l'attestation n'est pas nécessaire, le partage tenant lieu de titre.",
          "- **Sans attestation (ou partage) publié, un bien issu d'une succession ne peut pas être vendu** : exigez la pièce avant même de commercialiser.",
          "## Ne pas confondre : l'acte de notoriété",
          "- L'**acte de notoriété** **identifie les héritiers** et leurs droits : qui hérite, et dans quelles proportions.",
          "- L'**attestation immobilière** **transfère et publie** la propriété des biens.",
          "- Les deux sont souvent établis **ensemble** dans une succession.",
          "## L'origine de propriété (la règle des 30 ans)",
          "- Le notaire doit **remonter la chaîne des propriétaires** sur au moins **30 ans** (durée de la prescription acquisitive), pour garantir que le vendeur détient un titre incontestable.",
          "- C'est l'une des vérifications les plus longues sur un bien ancien, un bien de famille ou une succession complexe.",
          "## Où ça se classe dans le dossier",
          "- Dans l'application, ces pièces se rangent dans **« Titre de propriété »** du dossier vendeur ; le **dossier client** signale d'un coup d'œil si la pièce manque.",
          "## Erreur fréquente",
          "Prendre un mandat sur un bien « de la grand-mère décédée » sans vérifier que la **succession est réglée** et l'**attestation publiée**. Vous risquez de commercialiser un bien **invendable en l'état** et de perdre des mois.",
          "## Mini cas pratique",
          "Une fratrie veut vendre la maison familiale à Martigues après le décès du père. Avant toute photo, vous demandez : « La succession est-elle réglée chez le notaire ? Avez-vous l'**attestation immobilière** à vos noms ? » La réponse est non → vous orientez d'abord vers le notaire. Deux mois plus tard, titre en main, vous commercialisez **sereinement**, sans blocage à l'acte."
        ]
      },
      {
        "titre": "Qui peut vendre ? indivision, couples, succession, SCI",
        "contenu": [
          "Avant de signer un mandat, posez-vous **la** question qui évite les ventes qui s'effondrent : **qui doit signer pour vendre ?** Un seul signataire manquant et l'acte devient **impossible**, même après des mois de travail.",
          "## L'indivision : l'unanimité",
          "- Un bien **en indivision** (plusieurs propriétaires sans parts matérialisées) ne peut être vendu qu'à l'**unanimité** des indivisaires (art. 815-3 du Code civil).",
          "- Cas typiques : **succession** non partagée, **couple non marié** ayant acheté ensemble, ex-époux après divorce non liquidé.",
          "- Il **suffit d'un seul opposant** pour tout bloquer. Depuis la loi du 12 mai 2009, les indivisaires détenant au moins **2/3 des droits** peuvent demander au **tribunal** d'autoriser la vente, mais c'est une voie longue et judiciaire.",
          "- Faites signer le mandat par **tous les indivisaires**, ou par un mandataire muni de leurs **procurations**.",
          "## Les couples : attention au régime et au logement familial",
          "- **Mariés sous la communauté** : la vente d'un **bien commun** exige l'accord des **deux époux** (art. 1424 du Code civil).",
          "- **Logement de la famille** : même si le bien est un **bien propre** d'un seul époux, l'autre doit **consentir** à la vente (art. 215 du Code civil). Règle protectrice souvent ignorée.",
          "- À l'inverse, un **bien propre** qui n'est **pas** le logement de la famille peut être vendu par son **seul propriétaire**.",
          "- **Pacsés et concubins** : ils vendent selon leur **titre**, le plus souvent l'indivision — donc à l'unanimité.",
          "## La succession",
          "- Tous les **héritiers** doivent consentir : c'est une indivision successorale.",
          "- Pièces indispensables : **acte de notoriété** (qui sont les héritiers) + **attestation immobilière** publiée (le bien est bien à leur nom).",
          "- Méfiez-vous des héritiers **à l'étranger**, **mineurs** ou **sous protection** : délais et autorisations supplémentaires.",
          "## La SCI",
          "- C'est la **société** qui est propriétaire. Le **gérant** signe, mais **dans les limites des statuts** : beaucoup de statuts imposent une **décision collective des associés** pour vendre.",
          "- Demandez les **statuts** et, le cas échéant, le **procès-verbal d'assemblée** autorisant la vente et désignant le signataire.",
          "## Les personnes protégées et les mineurs",
          "- Vente d'un bien appartenant à un **majeur sous tutelle ou curatelle**, ou à un **mineur** : **autorisation du juge** (juge des contentieux de la protection) obligatoire. Délai à anticiper largement.",
          "## La procuration, pour signer à distance",
          "- Un vendeur empêché peut donner **procuration** à un tiers (souvent un clerc de l'étude) pour signer l'acte à sa place.",
          "- Pour un acte authentique, on utilise en pratique une **procuration notariée**. Prévoyez-la **en amont** si un vendeur réside à l'étranger.",
          "## Erreur fréquente",
          "Signer un mandat avec **un seul** des deux indivisaires « qui se fait fort » de convaincre l'autre. Tant que **tous** n'ont pas signé, vous travaillez pour rien. **Pas de mandat complet = pas de vente possible.**",
          "## Mini cas pratique",
          "Un vendeur se présente seul pour la maison du couple à Martigues : « Ma femme est d'accord, elle travaille, signez avec moi. » Le bien est **commun**. Vous répondez : « Pour que la vente soit **valable**, j'ai besoin de la signature de vous deux sur le mandat — on cale 15 minutes avec votre épouse, ou elle me donne une procuration. » Vous sécurisez l'opération dès le premier rendez-vous."
        ]
      },
      {
        "titre": "Le jour de l'acte authentique",
        "contenu": [
          "L'**acte authentique de vente**, le « rendez-vous de signature », est l'aboutissement de la transaction : c'est **là que la propriété est transférée** et que le prix est payé. Bien préparé, c'est une formalité sereine ; mal préparé, c'est le lieu de tous les blocages de dernière minute.",
          "## Avant le jour J : le dossier à transmettre au notaire",
          "- **Titre de propriété** (ou attestation immobilière) et **pièces d'identité** des parties.",
          "- **Dossier de diagnostics techniques (DDT)** complet et à jour.",
          "- En **copropriété** : règlement, PV d'AG des 3 dernières années, montant des charges, carnet d'entretien, **pré-état daté**.",
          "- **Taxe foncière**, documents d'urbanisme, éléments sur d'éventuelles **servitudes** ou litiges.",
          "- Plus le dossier est **complet et classé**, plus la vente va vite : chaque pièce manquante **retarde** l'acte.",
          "## Les conditions remplies avant de signer",
          "- Délai de **rétractation (10 jours)** purgé.",
          "- **Droits de préemption** purgés.",
          "- **Offre de prêt** acceptée, après le **délai de réflexion incompressible de 10 jours**.",
          "- **Fonds disponibles chez le notaire** : apport de l'acquéreur **et** déblocage du prêt **virés avant** le rendez-vous (un chèque de banque ne suffit souvent plus).",
          "## Ce qui se passe le jour de la signature",
          "- Le notaire **lit l'acte** intégralement et répond aux questions des parties.",
          "- Vérification des **relevés de compteurs** (eau, électricité, gaz) et de l'état du bien.",
          "- Signature, de plus en plus **électronique** sur tablette, puis **versement du prix** depuis le compte du notaire.",
          "- C'est à cet instant que la **propriété et les risques** passent à l'acquéreur : il doit avoir **assuré** le bien dès la signature.",
          "- Remise des **clés** à l'acquéreur et de l'**attestation de propriété** provisoire.",
          "- Le vendeur transmet les documents utiles : notices, garanties, badges, télécommandes.",
          "## Le rôle de l'agent ce jour-là",
          "- **Être présent** (ou joignable) : vous rassurez, vous fluidifiez, vous gérez les derniers détails (mobilier laissé, date de libération).",
          "- Vérifier que vos **honoraires** figurent bien au décompte du notaire, qui vous règle directement.",
          "- Solliciter un **avis Google** et préparer le **SAV** : une vente bien finie, c'est de la recommandation pour demain.",
          "## Après l'acte",
          "- Le notaire **publie** la vente au service de la publicité foncière ; la **copie authentique** arrive **plusieurs mois** plus tard.",
          "- Pensez à rappeler les **démarches** aux parties : changement d'adresse, assurance habitation, transfert ou résiliation des contrats, mise à jour des taxes.",
          "## Erreurs fréquentes",
          "- Arriver avec un **dossier incomplet** : le notaire **reporte** purement et simplement la signature.",
          "- Croire que la **remise des clés** peut se faire avant l'acte : jamais sans accord écrit (prêt à usage, convention d'occupation), sous peine de créer un occupant sans titre.",
          "## Mini cas pratique",
          "Signature prévue un vendredi à 15 h pour une villa à Martigues. La veille, vous vérifiez avec le notaire : fonds reçus, préemption purgée, relevés de compteurs organisés. Le vendeur apporte les **deux jeux de clés**, le badge du portail et la notice de la pompe à chaleur. Lecture, signature électronique, virement lancé, clés remises : **45 minutes**, zéro imprévu. C'est le résultat d'un pilotage sans faille."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Le notaire est…",
        "options": [
          "Un commercial de l'agence",
          "Un officier public qui authentifie les actes",
          "Un agent des impôts",
          "L'avocat du vendeur"
        ],
        "correct": 1,
        "explication": "Officier public ministériel, il authentifie les actes et leur donne force exécutoire et date certaine."
      },
      {
        "question": "Après une VENTE, l'attestation de propriété remise à l'acquéreur est…",
        "options": [
          "Définitive",
          "Provisoire, en attendant la copie authentique",
          "Inutile",
          "Un acte de notoriété"
        ],
        "correct": 1,
        "explication": "C'est une attestation provisoire qui prouve la qualité de propriétaire en attendant la copie authentique, délivrée après publication."
      },
      {
        "question": "Prendre deux notaires (un pour chaque partie) coûte…",
        "options": [
          "Deux fois plus cher",
          "Un peu plus cher",
          "Le même prix : ils se partagent les émoluments",
          "Cela dépend du prix du bien"
        ],
        "correct": 2,
        "explication": "Avoir chacun son notaire ne coûte rien de plus : les deux études se partagent les émoluments prévus par le barème."
      },
      {
        "question": "Le délai de rétractation de l'acquéreur non professionnel, après notification du compromis, est de…",
        "options": [
          "7 jours",
          "10 jours",
          "14 jours",
          "1 mois"
        ],
        "correct": 1,
        "explication": "Depuis la loi Macron (2015), le délai de rétractation de l'acquéreur non professionnel est de 10 jours calendaires, à compter du lendemain de la notification."
      },
      {
        "question": "Un bien en indivision ne peut être vendu que…",
        "options": [
          "Par l'indivisaire le plus âgé",
          "À l'unanimité des indivisaires",
          "À la majorité simple",
          "Par le notaire seul"
        ],
        "correct": 1,
        "explication": "La vente d'un bien indivis requiert l'unanimité (art. 815-3 du Code civil) ; un seul opposant bloque la vente."
      },
      {
        "question": "Dans les frais d'acquisition de l'ancien, la plus grosse part correspond à…",
        "options": [
          "Les émoluments du notaire",
          "Les droits de mutation (impôts)",
          "Les honoraires d'agence",
          "Les débours et formalités"
        ],
        "correct": 1,
        "explication": "Les droits de mutation (DMTO), versés au département, à la commune et à l'État, représentent l'essentiel des ~7 à 8 % de frais dans l'ancien."
      },
      {
        "question": "La durée moyenne entre l'accord sur le prix et la remise des clés est d'environ...",
        "options": [
          "2 à 3 semaines",
          "1 mois",
          "3 à 4 mois",
          "1 an"
        ],
        "correct": 2,
        "explication": "Une vente immobilière s'étale en moyenne sur 3 à 4 mois entre l'accord et l'acte."
      },
      {
        "question": "La première cause de ventes qui échouent entre le compromis et l'acte est...",
        "options": [
          "Le droit de préemption de la commune",
          "La condition suspensive de prêt non réalisée",
          "Le délai de rétractation",
          "Le refus du notaire de signer"
        ],
        "correct": 1,
        "explication": "La condition suspensive d'obtention du prêt est le jalon le plus risqué à surveiller."
      },
      {
        "question": "Ce qui rend la vente opposable aux tiers est...",
        "options": [
          "La signature du compromis",
          "La publication de l'acte au service de la publicité foncière",
          "L'offre d'achat acceptée",
          "La remise de l'attestation de propriété"
        ],
        "correct": 1,
        "explication": "C'est la publication au service de la publicité foncière qui rend la vente opposable aux tiers."
      },
      {
        "question": "Le notaire doit vérifier l'origine de propriété d'un bien sur au moins...",
        "options": [
          "10 ans",
          "20 ans",
          "30 ans",
          "50 ans"
        ],
        "correct": 2,
        "explication": "La règle des 30 ans correspond à la prescription acquisitive et garantit un titre incontestable."
      },
      {
        "question": "Le dépôt de garantie versé par l'acquéreur au compromis représente usuellement...",
        "options": [
          "1 à 2 % du prix",
          "5 à 10 % du prix",
          "20 % du prix",
          "50 % du prix"
        ],
        "correct": 1,
        "explication": "L'usage est un dépôt de 5 à 10 % du prix, imputé ensuite sur le prix à l'acte."
      },
      {
        "question": "En cas de rétractation de l'acquéreur dans le délai SRU de 10 jours, son dépôt lui est restitué sous...",
        "options": [
          "7 jours maximum",
          "21 jours maximum",
          "1 mois maximum",
          "3 mois maximum"
        ],
        "correct": 1,
        "explication": "Le dépôt est intégralement restitué à l'acquéreur sous 21 jours maximum en cas de rétractation."
      },
      {
        "question": "L'agence ne peut détenir elle-même le dépôt de garantie (séquestre) que si...",
        "options": [
          "Le vendeur donne son accord oral",
          "Elle dispose d'une garantie financière couvrant le maniement de fonds et d'un compte séquestre dédié",
          "Le montant est inférieur à 10 000 €",
          "Le notaire l'y autorise par écrit"
        ],
        "correct": 1,
        "explication": "Sans garantie financière couvrant le maniement de fonds, l'agent ne doit jamais encaisser le dépôt."
      },
      {
        "question": "Après réception de la déclaration d'intention d'aliéner (DIA), la commune dispose, pour exercer son droit de préemption urbain, de...",
        "options": [
          "15 jours",
          "1 mois",
          "2 mois",
          "6 mois"
        ],
        "correct": 2,
        "explication": "La mairie a 2 mois pour répondre ; son silence vaut renonciation."
      },
      {
        "question": "Les frais d'acquisition (« frais de notaire ») dans l'ancien représentent environ...",
        "options": [
          "2 à 3 % du prix",
          "5 % du prix",
          "7 à 8 % du prix",
          "10 à 12 % du prix"
        ],
        "correct": 2,
        "explication": "Tout compris, les frais d'acquisition dans l'ancien tournent autour de 7 à 8 % du prix."
      },
      {
        "question": "Depuis le 1er avril 2025, les départements peuvent relever leur part des droits de mutation jusqu'à...",
        "options": [
          "4,50 %",
          "5,00 %",
          "6,00 %",
          "7,00 %"
        ],
        "correct": 1,
        "explication": "La loi de finances 2025 autorise un relèvement de 4,50 % à 5,00 %, portant le total DMTO à environ 6,3 %."
      },
      {
        "question": "Pour vendre un bien commun d'un couple marié sous le régime de la communauté, il faut...",
        "options": [
          "La signature d'un seul époux",
          "L'accord des deux époux",
          "L'autorisation préalable du juge",
          "L'accord du seul notaire"
        ],
        "correct": 1,
        "explication": "La vente d'un bien commun exige l'accord des deux époux (art. 1424 du Code civil)."
      },
      {
        "question": "L'acte de notoriété, dans une succession, sert à...",
        "options": [
          "Transférer et publier la propriété du bien",
          "Identifier les héritiers et leurs droits",
          "Fixer le prix de vente du bien",
          "Purger le droit de préemption"
        ],
        "correct": 1,
        "explication": "L'acte de notoriété identifie les héritiers ; c'est l'attestation immobilière qui transfère et publie la propriété."
      },
      {
        "question": "L'attestation immobilière d'un bien issu d'une succession doit être établie et publiée dans le délai de...",
        "options": [
          "1 mois",
          "3 mois",
          "6 mois après le décès",
          "2 ans"
        ],
        "correct": 2,
        "explication": "Elle doit être publiée dans les 6 mois suivant le décès, comme la déclaration de succession."
      }
    ]
  },
  {
    "id": "loi-alur",
    "titre": "Loi ALUR",
    "icone": "⚖️",
    "categorie": "Juridique",
    "resume": "Honoraires, annonces, mandats, copropriété, location, urbanisme et formation : le vrai mode d'emploi de la loi ALUR, à jour 2024-2026.",
    "duree": "43 min",
    "lecons": [
      {
        "titre": "Ce qu'a changé la loi ALUR (2014)",
        "contenu": [
          "La **loi ALUR** (loi n° 2014-366 du 24 mars 2014 pour l'**A**ccès au **L**ogement et un **U**rbanisme **R**énové) est le texte qui a le plus transformé le quotidien de l'agent immobilier depuis la **loi Hoguet** de 1970. Elle ne remplace pas Hoguet : elle la complète et la durcit.",
          "## Contexte et philosophie",
          "ALUR poursuit deux objectifs : **protéger le consommateur** (vendeur, acquéreur, locataire) par plus de transparence, et **professionnaliser** les agents (formation, déontologie, contrôle). Pour l'agence, cela se traduit par des **obligations concrètes** à chaque étape : affichage, annonce, mandat, dossier de copropriété, location.",
          "## Les 6 grands chantiers d'ALUR",
          "- **Honoraires & transparence** : affichage obligatoire du barème, barème = plafond, information dans l'annonce.",
          "- **Annonces & mandats** : mentions obligatoires renforcées, moyens mis en œuvre et reddition de comptes inscrits au mandat.",
          "- **Copropriété** : information renforcée de l'acquéreur, fonds de travaux obligatoire, immatriculation des copropriétés, fiche synthétique, DTG, compte bancaire séparé.",
          "- **Location** : contrat de bail type, encadrement des loyers en zone tendue, plafonnement des honoraires de location à la charge du locataire, liste limitative des pièces justificatives.",
          "- **Profession** : carte professionnelle ramenée à **3 ans**, délivrée par la **CCI**, **formation continue obligatoire**, **code de déontologie**.",
          "- **Urbanisme** : généralisation du **PLU intercommunal (PLUi)**, suppression du **COS** et de la taille minimale des terrains pour densifier.",
          "## Des outils entièrement nouveaux créés par ALUR",
          "- L'**organisme de foncier solidaire (OFS)** et le **bail réel solidaire (BRS)** : ils dissocient le foncier du bâti pour vendre les murs d'un logement moins cher à des ménages sous plafonds de ressources, l'OFS conservant le terrain.",
          "- Les **observatoires locaux des loyers** : ils mesurent les loyers réellement pratiqués sur un territoire et servent de base à l'encadrement.",
          "- Le **registre national d'immatriculation des copropriétés**, tenu par l'ANAH.",
          "- La **Garantie universelle des loyers (GUL)**, jamais appliquée et remplacée depuis par le dispositif **Visale** d'Action Logement.",
          "## ALUR, Hoguet, ELAN : la chaîne des textes",
          "- **Loi Hoguet (2 janvier 1970)** : le socle — carte professionnelle, mandat écrit préalable, garantie financière, registres. Toujours en vigueur.",
          "- **Loi ALUR (24 mars 2014)** : la grande réforme de la transparence et de la protection du consommateur.",
          "- **Loi Macron (6 août 2015)** : porte le délai de rétractation de l'acquéreur de 7 à **10 jours**.",
          "- **Loi ELAN (23 novembre 2018)** : ajuste ALUR — relance l'encadrement des loyers à titre **expérimental**, recentre le **CNTGI** sur un rôle consultatif, crée le **bail mobilité**.",
          "- **Loi Climat et résilience (22 août 2021)** : greffe sur ce cadre les obligations énergétiques (audit, interdiction progressive de louer les passoires) — à ne pas confondre avec ALUR (voir module DPE).",
          "## Mnémonique de terrain",
          "Retenez les quatre réflexes ALUR du quotidien : **A**ffichage (honoraires), **L**oyers (encadrement), **U**sage du mandat (moyens + reporting), **R**enseignement de l'acquéreur (copropriété). L'intitulé officiel reste, lui, « Accès au Logement et Urbanisme Rénové ».",
          "## Qui est concerné",
          "Toutes les personnes exerçant sous la **loi Hoguet** : agences de transaction, administrateurs de biens, syndics, ainsi que leurs **négociateurs salariés** et **agents commerciaux** habilités. Les obligations de transparence et de déontologie s'appliquent de la même façon, quelle que soit la taille de l'agence.",
          "## Erreurs fréquentes",
          "- Croire qu'ALUR « c'est surtout pour les locations » : non, elle touche d'abord la **transaction** (affichage, annonces, mandats, copropriété).",
          "- Attribuer à ALUR les règles sur les **passoires thermiques** : l'encadrement énergétique vient de la **loi Climat 2021**, pas d'ALUR.",
          "## Mini cas pratique",
          "À l'agence CENTURY 21 Icaza Immobilier de Martigues, un vendeur demande : « En quoi ça me concerne, votre loi ALUR ? » Réponse type : « Elle vous protège. Je dois vous remettre un mandat qui précise exactement ce que je fais pour vendre et un bilan régulier, afficher mes honoraires au centime près, et garantir que l'acquéreur reçoive tout le dossier de copropriété. Vous savez à quoi vous vous engagez, et avec qui. »"
        ]
      },
      {
        "titre": "Honoraires : affichage et publicité",
        "contenu": [
          "La transparence des honoraires est l'un des apports phares d'ALUR. Les règles d'affichage résultent de deux arrêtés qu'il faut connaître par cœur.",
          "## Les deux arrêtés qui fixent la règle",
          "- **Arrêté du 10 janvier 2017** (en vigueur au 1ᵉʳ avril 2017) : socle de l'information du consommateur sur les honoraires.",
          "- **Arrêté du 26 janvier 2022** (en vigueur au 1ᵉʳ avril 2022) : modernise l'affichage, impose les montants **TTC** et la présence du barème sur le **site internet**.",
          "## Le barème est un PLAFOND, pas un tarif",
          "- Le barème affiché est un **prix maximum TTC** : vous pouvez négocier **à la baisse**, jamais facturer au-delà.",
          "- Il s'applique à **tous les clients** dans les mêmes conditions : pas de tarif « à la tête du client ».",
          "- Il se présente le plus souvent **par tranches de prix** (ex. jusqu'à 100 000 € ; de 100 001 à 200 000 € ; au-delà) ou en pourcentage dégressif.",
          "- Les honoraires d'agence sont soumis à la **TVA (20 %)** : le barème s'exprime donc toujours **TTC**, jamais HT.",
          "## Transaction et location : deux régimes à ne pas confondre",
          "- En **transaction**, les honoraires sont **librement fixés** par l'agence ; la seule limite est le **barème affiché**, qui fait office de plafond opposable.",
          "- En **location**, la part payée par le locataire est **plafonnée par la loi au m²** (voir la leçon sur le volet location) : ce n'est pas la même logique.",
          "- Dans les deux cas, les honoraires ne sont dus qu'une fois l'opération **effectivement conclue** : à l'**acte authentique** pour une vente, à la **signature du bail** pour une location.",
          "## Où et comment afficher",
          "- **En vitrine** : barème lisible **depuis l'extérieur**, sans avoir à entrer dans l'agence.",
          "- **À l'accueil** de l'agence, visible de la clientèle.",
          "- **Sur le site internet** : barème **aisément accessible** (règle pratique largement admise : en **2 clics** maximum depuis la page d'accueil, rubrique « Honoraires » / « Barème »).",
          "- Tous les montants exprimés en **TTC**.",
          "## Dans l'annonce : qui paie change tout",
          "- **Honoraires à la charge du vendeur** : l'annonce affiche le **prix de vente** et la mention « honoraires charge vendeur » — le prix affiché est celui que règle l'acquéreur.",
          "- **Honoraires à la charge de l'acquéreur** : l'annonce doit faire apparaître le **prix hors honoraires** (net vendeur), le **taux ou le montant TTC** des honoraires, et le **prix honoraires inclus (FAI)**.",
          "- Le taux est exprimé en **% TTC de la valeur du bien hors honoraires**.",
          "## Exemple chiffré",
          "Un appartement à Martigues négocié **280 000 € net vendeur**, barème **4 % TTC** à la charge de l'acquéreur. Honoraires = 280 000 × 4 % = **11 200 €**. L'annonce indique : **291 200 € FAI**, dont **11 200 € (4 %) à la charge de l'acquéreur**, soit **280 000 € hors honoraires**.",
          "Astuce : quand les honoraires sont à la charge de l'acquéreur, les **droits de mutation** (frais de notaire) se calculent sur les **280 000 €** et non sur le prix FAI — c'est une **économie réelle** pour l'acquéreur, à mettre en avant.",
          "## Script : défendre l'affichage, pas s'en excuser",
          "« Nos honoraires sont affichés clairement, c'est la loi et c'est surtout une marque de transparence : vous savez exactement ce que vous payez, et pour quoi. » (La défense argumentée du montant est traitée dans le module Défendre ses honoraires.)",
          "## Erreurs fréquentes (et sanctions)",
          "- Barème absent de la vitrine ou du site : **amende administrative** jusqu'à **3 000 €** (personne physique) / **15 000 €** (personne morale).",
          "- Annonce « honoraires charge acquéreur » sans le prix hors honoraires ni le taux : non conforme.",
          "- Afficher un barème **HT** : interdit, tout est **TTC**.",
          "- Facturer **plus** que le barème : interdit, même avec l'accord écrit du client.",
          "## Mini cas pratique",
          "Contrôle DGCCRF dans une agence : la vitrine affiche bien le barème, mais le site renvoie vers un PDF introuvable en moins de deux clics. Résultat : mise en demeure de régularisation et risque d'amende. **Vérifiez votre site aussi sérieusement que votre vitrine.**"
        ]
      },
      {
        "titre": "Les mentions obligatoires des annonces (dont DPE)",
        "contenu": [
          "Une annonce non conforme engage la responsabilité de l'agence et peut être sanctionnée. ALUR, complétée par la loi Climat, a multiplié les mentions obligatoires, en vente comme en location.",
          "## Le socle : prix et honoraires",
          "- Le **prix** de vente, avec la mention « honoraires charge vendeur » OU, si charge acquéreur, le **prix hors honoraires + le taux/montant TTC** des honoraires (voir leçon précédente).",
          "- L'annonce doit émaner d'un **professionnel clairement identifié** (l'agence doit pouvoir justifier à tout moment de sa carte professionnelle).",
          "## Les mentions copropriété",
          "- L'indication que le bien est soumis au **statut de la copropriété**.",
          "- Le **nombre de lots** de la copropriété.",
          "- Le **montant moyen annuel de la quote-part des charges courantes** du lot vendu.",
          "- L'existence éventuelle d'une **procédure** (administration provisoire, mandataire ad hoc).",
          "## Les 4 mentions DPE obligatoires",
          "- **Classe énergie** (A à G) — obligatoire dans l'annonce depuis le 1ᵉʳ juillet 2021 (nouveau DPE).",
          "- **Classe climat** (émissions de GES, A à G) — depuis le 1ᵉʳ juillet 2021 : les **deux étiquettes** apparaissent côte à côte.",
          "- **Estimation des coûts annuels d'énergie** (fourchette en € + année de référence) — depuis le 1ᵉʳ janvier 2022.",
          "- Pour un logement classé **F ou G** : la mention **« Logement à consommation énergétique excessive »** — depuis le 1ᵉʳ janvier 2022.",
          "## Le DPE est opposable",
          "Depuis le 1ᵉʳ juillet 2021, le **DPE est opposable** : ses résultats engagent la responsabilité du vendeur. Une classe erronée affichée peut fonder une action de l'acquéreur. Le **DPE vierge** (« non communiqué ») n'est **plus admis**. Le détail du DPE est traité dans le module dédié.",
          "## Et pour une annonce de location ?",
          "- Le **loyer mensuel** charges comprises, en précisant le **montant des charges** et leur mode de règlement (provision ou forfait).",
          "- Le **dépôt de garantie** exigé.",
          "- La **commune** (et l'arrondissement en zone concernée) et la **surface habitable** en m².",
          "- Le **caractère meublé ou vide** du logement.",
          "- Les **honoraires à la charge du locataire** en montant TTC, dont la part « état des lieux ».",
          "- En **zone d'encadrement**, le **loyer de référence majoré** et, le cas échéant, le **complément de loyer** et sa justification.",
          "- Les **mêmes 4 mentions DPE** que pour la vente.",
          "## Exemple d'annonce de vente conforme (extrait)",
          "« Appartement T3, Martigues, 72 m², **291 200 € honoraires inclus** dont **4 % (11 200 €) à la charge de l'acquéreur**, soit **280 000 € hors honoraires**. Copropriété de **48 lots**, charges courantes ≈ **1 320 €/an**, pas de procédure en cours. DPE : classe **D** / GES **D**. Coûts annuels d'énergie estimés entre **980 € et 1 330 €** (réf. 2023). »",
          "## Erreurs fréquentes",
          "- Oublier **une seule** des 4 mentions DPE : l'annonce entière devient non conforme.",
          "- Afficher l'étiquette énergie mais **oublier la classe climat (GES)** : les deux sont obligatoires.",
          "- Ne pas indiquer les **charges de copropriété** moyennes.",
          "- Laisser une mention **« DPE non communiqué »** sur une annonce recopiée d'un particulier.",
          "## Mini cas pratique",
          "Un négociateur recopie une ancienne annonce PAP avec « DPE : non communiqué ». Depuis juillet 2021, le DPE vierge est interdit : il faut un DPE réalisé et ses deux étiquettes. Faites réaliser le DPE **avant diffusion**, sinon l'annonce est hors la loi et la responsabilité de l'agence est engagée."
        ]
      },
      {
        "titre": "Le mandat de vente après ALUR",
        "contenu": [
          "ALUR a enrichi le contenu obligatoire du mandat et l'a transformé, de simple formalité, en véritable **engagement de services** écrit.",
          "## Les mentions imposées au mandat",
          "- L'**identité des mandants** et leur **qualité** pour vendre (pleine propriété, indivision, succession, accord du conjoint).",
          "- La **désignation du bien** et le **prix** de vente.",
          "- La **rémunération** : montant **TTC** et **à qui** elle incombe (vendeur ou acquéreur).",
          "- La **durée** du mandat et, le cas échéant, celle de l'**exclusivité**.",
          "- Les **moyens mis en œuvre** par l'agence pour commercialiser le bien (apport ALUR).",
          "- Les **modalités de reddition de comptes** au mandant (apport ALUR).",
          "- Un **numéro**, reporté sur le **registre des mandats** tenu de façon continue et sans blanc (Hoguet).",
          "## Les trois grands types de mandat",
          "- Le **mandat simple** : le vendeur confie le bien à **plusieurs agences** et peut vendre lui-même ; l'agence n'est payée que si c'est elle qui conclut.",
          "- Le **mandat exclusif** : une **seule agence** est mandatée ; selon la clause, le vendeur ne peut ni mandater une autre agence ni vendre seul sans l'intermédiaire.",
          "- Le **mandat semi-exclusif** (exclusif aménagé) : l'agence est la seule professionnelle mandatée, mais le vendeur **conserve le droit de vendre par lui-même** sans honoraires.",
          "- La **clause pénale** prévoit une **indemnité** due par le mandant qui vend en violation de l'exclusivité ; elle doit rester **proportionnée**.",
          "## Moyens + reddition de comptes : l'apport ALUR",
          "Avant ALUR, un mandat pouvait rester vague. Désormais il doit **écrire ce que vous faites** (reportage photo, diffusion portails, vitrine, home-staging, visites) et **comment vous rendez compte** (compte rendu après visite, point régulier). C'est une obligation, mais aussi un puissant **argument** pour décrocher l'exclusivité.",
          "## Durée, exclusivité et sortie",
          "- Le mandat est à **durée déterminée** (souvent 3 mois, avec une durée totale encadrée par une clause de reconduction).",
          "- Un mandat **exclusif** (ou comportant une **clause pénale**) doit prévoir une **faculté de dénonciation après 3 mois** : à tout moment ensuite, par **lettre recommandée AR**, avec **préavis de 15 jours**.",
          "- **Rétractation de 14 jours** si le mandat est signé **hors établissement** (au domicile du vendeur) ou **à distance** (art. L221-18 du Code de la consommation).",
          "## Modifier ou renouveler le mandat",
          "- Tout changement (baisse de prix, prolongation) se formalise par un **avenant écrit** signé des deux parties, jamais par un simple accord verbal.",
          "- La **reconduction** doit être expressément prévue et bornée dans le temps : un mandat ne peut pas se prolonger indéfiniment de façon tacite.",
          "- Il existe aussi un **mandat de recherche**, signé côté **acquéreur**, par lequel l'agence s'engage à trouver un bien : lui aussi doit être écrit, numéroté et préciser la rémunération.",
          "## La règle d'or Hoguet (rappel)",
          "**Pas de mandat écrit préalable = aucune rémunération**, même si la vente se fait grâce à vous (art. 6 loi Hoguet). On signe le mandat **avant** d'agir, jamais après.",
          "## Script : vendre les moyens et le reporting",
          "« Mon mandat précise noir sur blanc ce que je mets en œuvre : reportage photo pro, diffusion sur les grands portails, home-staging, et un **compte rendu après chaque visite** plus un **point tous les 15 jours**. Vous ne me donnez pas un blanc-seing : vous avez un engagement écrit. »",
          "## Erreurs fréquentes",
          "- Faire visiter ou publier **avant** la signature du mandat : aucune rémunération due.",
          "- Oublier de **numéroter** le mandat ou de le reporter au registre.",
          "- Omettre la clause de **dénonciation après 3 mois** dans un exclusif : exclusivité fragilisée.",
          "- Ne pas remettre le **bordereau de rétractation** quand le mandat est signé chez le vendeur.",
          "## Mini cas pratique",
          "Signature d'un mandat exclusif au domicile d'un vendeur à Martigues, un mardi. Le vendeur dispose de **14 jours** pour se rétracter. Bonne pratique : remettre le **bordereau de rétractation**, dater précisément le point de départ, et attendre la fin du délai (sauf demande expresse d'exécution anticipée) avant d'engager des frais de home-staging."
        ]
      },
      {
        "titre": "Copropriété : informer l'acquéreur & réformes ALUR",
        "contenu": [
          "ALUR a imposé une information renforcée de l'acquéreur d'un **lot de copropriété** et réformé en profondeur la gestion des copropriétés.",
          "## Les documents à annexer à la promesse (art. L721-2 CCH)",
          "Pour la vente d'un lot de copropriété, ALUR impose d'annexer à la promesse ou au compromis, à défaut de quoi le **délai de rétractation de 10 jours** de l'acquéreur **ne commence pas à courir** :",
          "- La **fiche synthétique** de la copropriété.",
          "- Le **règlement de copropriété** et l'**état descriptif de division** + leurs actes modificatifs publiés.",
          "- Les **PV des assemblées générales** des **3 dernières années**.",
          "- Le **carnet d'entretien** de l'immeuble.",
          "- La **notice d'information** sur les droits et obligations des copropriétaires.",
          "- Le **DTG** (diagnostic technique global) s'il a été réalisé.",
          "- Le **montant des charges courantes** et hors budget supportées par le vendeur, ainsi que les **sommes dues** au syndicat.",
          "- L'**état global des impayés** de charges et de la **dette** du syndicat envers ses fournisseurs.",
          "- Le **montant du fonds de travaux** et la quote-part rattachée au lot.",
          "- L'attestation de **surface Carrez** (une erreur supérieure à **5 %** ouvre à l'acquéreur une action en réduction du prix).",
          "## Le bon timing de l'information",
          "- **Dès l'annonce** : statut de copropriété, nombre de lots, charges courantes moyennes, procédure éventuelle.",
          "- **À la promesse** : le dossier L721-2 complet ci-dessus.",
          "- **À l'acte** : l'**état daté** établi par le syndic (situation financière exacte vendeur / syndicat).",
          "## Pré-état daté et état daté : ne pas confondre",
          "- Le **pré-état daté** est un document **commercial** (non obligatoire) préparé pour le compromis : il donne une première photo des charges et de la situation.",
          "- L'**état daté** est le document **officiel** établi par le **syndic** pour l'acte authentique ; ses honoraires sont **plafonnés à 380 € TTC**.",
          "## Les réformes de copropriété portées par ALUR",
          "- **Fonds de travaux obligatoire** (art. 14-2 de la loi de 1965) : cotisation annuelle d'au moins **5 % du budget prévisionnel** et, depuis la loi Climat, d'au moins **2,5 % du montant des travaux** du plan pluriannuel. Les sommes versées **restent acquises au syndicat** et ne sont pas remboursées au vendeur.",
          "- Sont **dispensés** de fonds de travaux les immeubles **neufs** (moins de 5 ans) et ceux dont le **DTG** ne prévoit aucun travaux sur 10 ans.",
          "- **Plan pluriannuel de travaux (PPT)** : programmation des travaux sur 10 ans, généralisée par la loi Climat sur la base posée par ALUR pour les immeubles de plus de 15 ans.",
          "- **Immatriculation des copropriétés** au **registre national** tenu par l'ANAH.",
          "- **Fiche synthétique** de la copropriété, tenue à jour par le syndic.",
          "- **DTG** : diagnostic technique global, pour évaluer l'état de l'immeuble et planifier les travaux.",
          "## La gouvernance du syndic réformée",
          "- **Contrat type de syndic** et **mise en concurrence** périodique du syndic, pour plus de transparence sur les honoraires.",
          "- **Forfait** de gestion courante assorti d'une **liste limitative** des prestations particulières facturables en sus.",
          "- **Compte bancaire séparé** obligatoire pour le syndicat (sauf dispense votée dans les copropriétés de **15 lots ou moins**).",
          "- **Espace en ligne sécurisé (extranet)** mis à la disposition des copropriétaires pour accéder aux documents de la copropriété.",
          "## Erreurs fréquentes",
          "- Signer le compromis **sans le dossier L721-2 complet** : le délai de rétractation de l'acquéreur **ne démarre pas** et la vente est fragilisée.",
          "- Oublier les **PV d'AG des 3 ans** (ils révèlent travaux votés, litiges et impayés).",
          "- Ignorer le **fonds de travaux** : la quote-part versée **reste acquise au syndicat**, le vendeur ne la récupère pas.",
          "- Confondre **pré-état daté** (commercial) et **état daté** (syndic, obligatoire à l'acte, plafonné à 380 € TTC).",
          "## Mini cas pratique",
          "Vente d'un T2 dans une copropriété de Martigues : les PV d'AG mentionnent un **ravalement voté à 420 000 €** réparti sur l'immeuble, quote-part du lot ≈ **9 500 €**. En l'annonçant **dès le compromis** et en clarifiant **qui paie** (vendeur si l'appel de fonds est antérieur à l'acte, sinon acquéreur), vous évitez un litige post-vente et sécurisez le dossier."
        ]
      },
      {
        "titre": "Le volet location d'ALUR",
        "contenu": [
          "ALUR a profondément modifié la **loi n° 89-462 du 6 juillet 1989** sur les rapports locatifs. Voici ce qui concerne directement l'agent qui loue ou gère (la pratique opérationnelle du bail est approfondie dans le module Location & baux).",
          "## Le bail type et ses annexes",
          "- **Contrat de bail type** obligatoire (décret du 29 mai 2015) : un modèle réglementaire pour les locations vides et meublées.",
          "- **Notice d'information** annexée au bail (droits et obligations des parties).",
          "- **État des lieux type** d'entrée et de sortie.",
          "- **Dossier de diagnostic technique** (DPE, plomb, électricité/gaz selon le cas, ERP) annexé au bail.",
          "- Le **bail mobilité** (créé par la loi ELAN) : bail meublé de **1 à 10 mois**, non renouvelable, **sans dépôt de garantie**, réservé à certains publics (études, mission temporaire, formation).",
          "## Honoraires de location : plafonnés et partagés",
          "Depuis ALUR, le **locataire** ne peut payer que **4 prestations** (organisation des visites, constitution du dossier, rédaction du bail, état des lieux), et sa part est **plafonnée au m² de surface habitable** (décret du 1ᵉʳ août 2014) :",
          "- Zone **très tendue** : **12 €/m²** maximum.",
          "- Zone **tendue** : **10 €/m²** maximum.",
          "- **Reste du territoire** : **8 €/m²** maximum.",
          "- **État des lieux** : plafond spécifique de **3 €/m²** pour chacune des deux parties.",
          "- La part payée par le **locataire ne peut jamais dépasser** celle payée par le **bailleur**.",
          "## Encadrement des loyers : deux mécanismes à ne pas confondre",
          "- **Encadrement de l'évolution à la relocation** (zone tendue) : le nouveau loyer ne peut en principe pas dépasser l'ancien réévalué de l'**IRL**, sauf travaux importants ou loyer manifestement sous-évalué.",
          "- **Encadrement du niveau des loyers** (expérimental, relancé par la loi ELAN) : dans certaines villes volontaires, le loyer ne peut dépasser un **loyer de référence majoré** fixé par arrêté préfectoral ; un **complément de loyer** reste possible pour des caractéristiques exceptionnelles.",
          "## Le complément de loyer et l'IRL",
          "- L'**IRL** (indice de référence des loyers publié par l'INSEE) est le seul indice qui permet de **réviser** le loyer en cours de bail, une fois par an si le bail le prévoit.",
          "- En zone encadrée, un **complément de loyer** peut s'ajouter au loyer de référence majoré pour des **caractéristiques exceptionnelles** (terrasse, vue, prestations haut de gamme) ; il doit être **justifié** et peut être contesté par le locataire.",
          "- Les **observatoires locaux des loyers**, créés par ALUR, fournissent les loyers de référence servant de base à l'encadrement.",
          "## Où s'applique l'encadrement du niveau des loyers",
          "- Villes concernées (sur candidature) : **Paris**, **Lille**, **Lyon et Villeurbanne**, **Montpellier**, **Bordeaux**, **Est Ensemble** et **Plaine Commune** (Seine-Saint-Denis), **Pays Basque**, **Grenoble-Alpes Métropole**, parmi d'autres agglomérations volontaires.",
          "- Le secteur de **Martigues n'est pas concerné par l'encadrement du niveau des loyers** ; vérifiez en revanche son classement en **zone tendue** (préavis réduit, encadrement de l'évolution, taxe sur les logements vacants).",
          "## Dépôt de garantie et préavis",
          "- **Dépôt de garantie** : **1 mois** de loyer hors charges (location **vide**), **2 mois** (location **meublée**).",
          "- **Restitution** : sous **1 mois** si l'état des lieux de sortie est conforme, sinon **2 mois** ; au-delà, majoration de **10 % du loyer** mensuel par mois de retard entamé.",
          "- **Préavis du locataire** réduit à **1 mois** (au lieu de 3) en **zone tendue** et dans certains cas (mutation, perte d'emploi, santé, RSA…).",
          "## La liste limitative des pièces",
          "ALUR a fixé une **liste limitative** des documents exigibles du candidat locataire et de sa caution (décret du 5 novembre 2015). Réclamer une pièce **hors liste** (RIB, photo, attestation d'absence de crédit, dossier médical…) est **sanctionné** par une amende jusqu'à **3 000 €** / **15 000 €**.",
          "## La GUL et son remplaçant",
          "ALUR avait créé la **Garantie universelle des loyers (GUL)**, jamais mise en œuvre. Elle a été remplacée par **Visale** (Action Logement), une caution gratuite ouverte à certains locataires.",
          "## Erreurs fréquentes",
          "- Facturer au locataire des honoraires **au-delà du plafond** au m².",
          "- Lui faire payer des prestations **autres** que les 4 autorisées.",
          "- Exiger une **pièce interdite** par la liste limitative.",
          "- Appliquer un loyer **supérieur** au loyer de référence majoré dans une ville encadrée.",
          "## Mini cas pratique",
          "Un candidat conteste les honoraires d'un studio de **30 m²** facturés **600 €**. En zone tendue, le plafond est 30 × 10 € = **300 €** pour les prestations partagées + 30 × 3 € = **90 €** pour l'état des lieux, soit **390 € maximum**. La facturation est **illégale** : régularisation et risque d'amende. **Calculez toujours le plafond au m² avant de facturer.**"
        ]
      },
      {
        "titre": "Carte professionnelle, formation continue & déontologie",
        "contenu": [
          "ALUR a professionnalisé le métier : carte raccourcie, formation obligatoire, code de déontologie et instance de régulation.",
          "## La carte professionnelle",
          "- Trois mentions : carte « **T** » (transaction), « **G** » (gestion), « **S** » (syndic).",
          "- Délivrée par la **CCI** depuis le 1ᵉʳ juillet 2015 (auparavant par la préfecture).",
          "- **Valable 3 ans** : ALUR l'a ramenée de 10 à 3 ans.",
          "- Conditions : **aptitude professionnelle**, **garantie financière** si maniement de fonds, **assurance responsabilité civile professionnelle**, **honorabilité**.",
          "## L'aptitude professionnelle : comment l'obtenir",
          "- Par le **diplôme** : un diplôme de niveau **bac+3** à dominante juridique, économique ou commerciale, ou un **BTS Professions immobilières**.",
          "- Par l'**expérience** : par exemple **3 ans** comme cadre salarié d'un titulaire de carte (ou **10 ans** comme non-cadre), même sans diplôme.",
          "- La **garantie financière** est obligatoire dès qu'il y a **maniement de fonds** (acomptes, loyers) ; sans elle, la carte porte la mention « ne peut recevoir aucun fonds ».",
          "- L'**assurance responsabilité civile professionnelle** couvre les fautes commises dans l'exercice.",
          "## La formation continue obligatoire",
          "- Instaurée par ALUR, précisée par le **décret du 18 février 2016**.",
          "- **14 heures par an**, soit **42 heures sur 3 ans** (le cycle de la carte).",
          "- Sur le cycle : au moins **2 heures de déontologie** et **2 heures de non-discrimination** à l'accès au logement (apport de la loi ELAN).",
          "- Concerne le **titulaire** de la carte **et** ses **collaborateurs** (salariés, agents commerciaux).",
          "- Sans justificatif de formation, **pas de renouvellement** de la carte : plus de droit d'exercer.",
          "## Le code de déontologie",
          "Créé par ALUR et fixé par le **décret du 28 août 2015**, il impose notamment :",
          "- Le **respect des lois** et la probité.",
          "- La **compétence** et la mise à jour des connaissances.",
          "- La **transparence** (honoraires, information du client).",
          "- La **confidentialité** des informations recueillies.",
          "- La **défense des intérêts** du client et la gestion des **conflits d'intérêts**.",
          "- La **non-discrimination** à l'accès au logement.",
          "- La **confraternité** entre professionnels.",
          "## Le CNTGI",
          "ALUR a créé le **CNTGI** (Conseil national de la transaction et de la gestion immobilières). La **loi ELAN (2018)** l'a recentré sur un rôle **consultatif** (avis sur la déontologie et la formation) : la commission de contrôle disciplinaire initialement prévue n'a pas été mise en place.",
          "## Les collaborateurs",
          "Négociateurs salariés et agents commerciaux agissent **sous la carte du titulaire**, via une **attestation d'habilitation** délivrée par la CCI. Ils sont tenus aux **mêmes obligations** de déontologie et de formation.",
          "## Sanctions",
          "- **Exercer sans carte** : jusqu'à **6 mois d'emprisonnement et 7 500 € d'amende** (loi Hoguet).",
          "- Manquement déontologique : sanctions pouvant aller jusqu'au **retrait de la carte**.",
          "## Erreurs fréquentes",
          "- Laisser la carte **expirer** faute d'avoir cumulé ses 42 heures de formation.",
          "- Faire travailler un collaborateur **sans attestation** d'habilitation à jour.",
          "- Négliger les **2 h de non-discrimination** et **2 h de déontologie** obligatoires du cycle.",
          "## Mini cas pratique",
          "Un négociateur de l'agence n'a validé que **28 heures** de formation sur son cycle de 3 ans : il lui en manque **14** (dont la non-discrimination) pour sécuriser le renouvellement de la carte. **Planifiez la formation tout au long du cycle**, pas en catastrophe la dernière année."
        ]
      },
      {
        "titre": "L'urbanisme rénové : PLUi, fin du COS et densification",
        "contenu": [
          "Le « **U** » et le « **R** » d'ALUR — **U**rbanisme **R**énové — forment un volet moins connu des agents de transaction, mais structurant : il change la façon de construire et de densifier. Le maîtriser, c'est mieux conseiller un vendeur de terrain ou un acquéreur qui veut agrandir.",
          "## Le transfert du PLU aux intercommunalités",
          "ALUR généralise le **PLU intercommunal (PLUi)** : la compétence d'élaboration du plan local d'urbanisme passe en principe des communes aux **intercommunalités (EPCI)**, pour une planification cohérente à l'échelle d'un bassin de vie.",
          "- Le transfert est en principe **automatique**, sauf **minorité de blocage** (au moins 25 % des communes représentant 20 % de la population).",
          "- Le PLUi articule **habitat, déplacements et commerce** sur tout le territoire intercommunal.",
          "## La fin du COS et de la taille minimale des terrains",
          "- ALUR **supprime le coefficient d'occupation des sols (COS)**, qui plafonnait la surface constructible en fonction de la taille du terrain.",
          "- Elle supprime aussi la **superficie minimale** des terrains constructibles qui pouvait figurer dans les PLU.",
          "- Objectif affiché : **densifier** les zones déjà urbanisées et **lutter contre l'étalement urbain** et la consommation de terres agricoles.",
          "## La caducité des anciens POS",
          "Les anciens **plans d'occupation des sols (POS)** non transformés en PLU sont devenus **caducs** : les communes concernées retombent sous le **règlement national d'urbanisme (RNU)**, plus restrictif. Vérifiez toujours quel document régit réellement la commune du bien.",
          "## La lutte contre l'habitat indigne",
          "- Renforcement des **polices de l'habitat** et des sanctions contre les **marchands de sommeil**.",
          "- Encadrement des **divisions de logements** et des **ventes à la découpe** pour éviter la création de logements insalubres.",
          "## Ce que l'agent doit en retenir au quotidien",
          "- Avant de vendre un **terrain** ou de promettre une extension, consulter le **PLU/PLUi** en vigueur et demander un **certificat d'urbanisme**.",
          "- La **constructibilité** d'un terrain ne dépend plus du COS mais des **règles de hauteur, d'emprise au sol et de recul** du PLU.",
          "- Ne jamais affirmer qu'un terrain est constructible sans **document à l'appui** : c'est un terrain miné pour la responsabilité de l'agence.",
          "## Erreurs fréquentes",
          "- Confondre **surface du terrain** et **droit à construire** : depuis ALUR, il n'y a plus de ratio automatique.",
          "- Se fier à un **ancien POS** encore cité localement alors qu'il est **caduc**.",
          "- Promettre une **division** ou une surélévation sans vérifier le règlement de la zone.",
          "## Mini cas pratique",
          "Un propriétaire de Martigues veut vendre son pavillon « avec un terrain divisible pour construire ». Avant de l'écrire dans l'annonce, l'agent demande un **certificat d'urbanisme opérationnel** : il révèle une servitude et une hauteur limitée qui rendent la seconde construction irréaliste. En vérifiant **avant** la diffusion, l'agence évite une annonce trompeuse et un litige."
        ]
      },
      {
        "titre": "Check-list conformité ALUR & erreurs fréquentes",
        "contenu": [
          "Cette leçon synthétise tout le module en outil de terrain : un audit rapide pour vérifier que votre agence est en règle à chaque étape.",
          "## L'audit « 5 minutes » de votre conformité ALUR",
          "- **Vitrine** : barème d'honoraires lisible de l'extérieur, en TTC ?",
          "- **Site internet** : barème accessible en 2 clics et à jour ?",
          "- **Annonces** : prix + mention honoraires (qui paie / taux), mentions copropriété, **4 mentions DPE** ?",
          "- **Mandats** : moyens mis en œuvre, reddition de comptes, numéro + registre, clause de dénonciation (exclusif), rétractation si signé hors établissement ?",
          "- **Copropriété** : dossier L721-2 complet avant le compromis ?",
          "- **Location** : honoraires au m² respectés, liste limitative des pièces, bail type et annexes ?",
          "- **Terrain / constructible** : toute mention de constructibilité ou de division appuyée par un **certificat d'urbanisme** ?",
          "- **Profession** : cartes et attestations à jour, 42 h de formation sur le cycle suivies ?",
          "## Le top des manquements sanctionnés",
          "- Barème absent ou erroné (vitrine ou site).",
          "- Annonce incomplète (DPE, copropriété, honoraires).",
          "- Honoraires de location au-delà du plafond au m².",
          "- Pièces exigées du locataire hors liste limitative.",
          "- Mandat non numéroté ou non inscrit au registre.",
          "- Dossier de copropriété incomplet au compromis.",
          "## Les sanctions en un coup d'œil",
          "- **Affichage, annonces, pièces locataires** : amende administrative jusqu'à **3 000 €** (personne physique) / **15 000 €** (personne morale).",
          "- **Exercice sans carte** : **6 mois** d'emprisonnement et **7 500 €** d'amende (Hoguet).",
          "- **Manquement déontologique** : jusqu'au **retrait de la carte**.",
          "## La check-list avant chaque mise en vente",
          "- DPE réalisé (jamais vierge) et 4 mentions prêtes pour l'annonce.",
          "- « Qui paie les honoraires » tranché et **cohérent** entre mandat, annonce et compromis.",
          "- Pièces de copropriété demandées au syndic dès la prise de mandat.",
          "- Mandat signé **avant** toute action, numéroté, avec moyens + reporting.",
          "- Si le bien est un terrain ou se vend « constructible / divisible » : **certificat d'urbanisme** vérifié et PLU/PLUi consulté.",
          "## Mnémonique de clôture",
          "Pour ne rien oublier, pensez **« HAMCLoF »** : **H**onoraires affichés, **A**nnonces complètes, **M**andat conforme, **C**opropriété documentée, **Lo**cation plafonnée, **F**ormation à jour.",
          "## Mini cas pratique d'audit",
          "Avant une réunion d'équipe chez CENTURY 21 Icaza Immobilier, le directeur passe les 12 annonces en ligne au crible : 3 n'affichent pas la **classe climat (GES)**, 1 oublie l'**estimation des coûts d'énergie**, 2 ne précisent pas les **charges de copropriété**. Vingt minutes de correction évitent une non-conformité qui, en cas de contrôle, se chiffrerait en milliers d'euros d'amende — et renforcent la confiance des clients."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Le barème d'honoraires affiché par l'agence est…",
        "options": [
          "Un prix minimum à respecter",
          "Un prix maximum TTC, négociable à la baisse",
          "Un simple tarif indicatif sans valeur",
          "Un tarif fixé par l'État"
        ],
        "correct": 1,
        "explication": "Depuis les arrêtés de 2017 et 2022, le barème est un plafond TTC : on peut négocier à la baisse, jamais facturer au-delà, et il s'affiche en vitrine comme sur le site."
      },
      {
        "question": "Combien de mentions liées au DPE sont obligatoires dans une annonce de vente ?",
        "options": [
          "1",
          "2",
          "4",
          "6"
        ],
        "correct": 2,
        "explication": "Quatre : classe énergie, classe climat (GES), estimation des coûts annuels d'énergie, et la mention « consommation énergétique excessive » pour un logement F ou G."
      },
      {
        "question": "Les honoraires de location à la charge du locataire sont…",
        "options": [
          "Libres et négociés sans limite",
          "Plafonnés au m² de surface habitable selon la zone (8/10/12 €)",
          "Interdits depuis la loi ALUR",
          "Toujours payés uniquement par le bailleur"
        ],
        "correct": 1,
        "explication": "ALUR plafonne la part locataire (4 prestations) au m² : 8 €/m² hors zone tendue, 10 € en zone tendue, 12 € en zone très tendue, plus 3 €/m² pour l'état des lieux ; elle ne peut dépasser la part du bailleur."
      },
      {
        "question": "Quelle formation continue faut-il justifier pour renouveler la carte professionnelle ?",
        "options": [
          "Aucune formation requise",
          "14 heures par an, soit 42 heures sur 3 ans",
          "100 heures par an",
          "Un examen national annuel"
        ],
        "correct": 1,
        "explication": "14 heures par an (42 h sur le cycle de 3 ans), dont au moins 2 h de déontologie et 2 h de non-discrimination ; sans justificatif, pas de renouvellement de carte."
      },
      {
        "question": "Si les documents de copropriété (art. L721-2) ne sont pas annexés à la promesse, que se passe-t-il ?",
        "options": [
          "La vente est automatiquement annulée",
          "Le délai de rétractation de 10 jours de l'acquéreur ne commence pas à courir",
          "Le syndic est sanctionné",
          "Rien, ces documents sont facultatifs"
        ],
        "correct": 1,
        "explication": "ALUR impose d'annexer le dossier de copropriété ; à défaut, le délai de rétractation de 10 jours de l'acquéreur ne démarre pas, ce qui fragilise toute la vente."
      },
      {
        "question": "Un mandat exclusif peut être dénoncé…",
        "options": [
          "À tout moment, sans préavis",
          "Après 3 mois, par lettre recommandée AR avec un préavis de 15 jours",
          "Jamais pendant toute sa durée",
          "Uniquement à l'initiative de l'agence"
        ],
        "correct": 1,
        "explication": "Un mandat exclusif (ou avec clause pénale) doit prévoir une faculté de dénonciation passés 3 mois, à tout moment ensuite, par LRAR avec un préavis de 15 jours."
      },
      {
        "question": "Qu'a supprimé la loi ALUR en matière d'urbanisme ?",
        "options": [
          "L'obligation de permis de construire",
          "Le coefficient d'occupation des sols (COS) et la taille minimale des terrains",
          "Le plan local d'urbanisme (PLU)",
          "Les certificats d'urbanisme"
        ],
        "correct": 1,
        "explication": "ALUR a supprimé le COS et la superficie minimale des terrains pour favoriser la densification ; le droit à construire dépend désormais des règles de hauteur, d'emprise et de recul du PLU/PLUi."
      },
      {
        "question": "En transaction, les honoraires de l'agence sont…",
        "options": [
          "Plafonnés par la loi au m²",
          "Librement fixés, dans la limite du barème affiché, et dus seulement à l'acte authentique",
          "Interdits en cas de mandat simple",
          "Fixés par la chambre des notaires"
        ],
        "correct": 1,
        "explication": "En transaction, les honoraires sont libres mais bornés par le barème affiché (plafond opposable) ; ils ne sont dus qu'une fois la vente conclue par acte authentique (règle Hoguet). Le plafonnement légal au m² ne concerne que la location."
      },
      {
        "question": "Que signifie l'acronyme ALUR ?",
        "options": [
          "Aménagement du Logement Urbain Rénové",
          "Accès au Logement et Urbanisme Rénové",
          "Autorité du Logement et de l'Urbanisme Réglementé",
          "Accord Locatif et Urbanisme Régional"
        ],
        "correct": 1,
        "explication": "ALUR signifie « Accès au Logement et un Urbanisme Rénové » (loi du 24 mars 2014)."
      },
      {
        "question": "La loi ALUR a été promulguée le...",
        "options": [
          "2 janvier 1970",
          "24 mars 2014",
          "6 août 2015",
          "23 novembre 2018"
        ],
        "correct": 1,
        "explication": "La loi n° 2014-366 ALUR date du 24 mars 2014."
      },
      {
        "question": "Depuis ALUR, la carte professionnelle d'agent immobilier est...",
        "options": [
          "Valable 10 ans et délivrée par la préfecture",
          "Valable 3 ans et délivrée par la CCI",
          "Valable 5 ans et délivrée par la mairie",
          "Valable à vie"
        ],
        "correct": 1,
        "explication": "ALUR a ramené la carte de 10 à 3 ans, désormais délivrée par la CCI."
      },
      {
        "question": "Sur le cycle de 3 ans de la carte, la formation continue doit comprendre au minimum...",
        "options": [
          "2 heures de déontologie et 2 heures de non-discrimination",
          "10 heures de déontologie",
          "Aucune thématique imposée",
          "5 heures de droit fiscal"
        ],
        "correct": 0,
        "explication": "Sur les 42 heures du cycle, au moins 2 h de déontologie et 2 h de non-discrimination sont exigées."
      },
      {
        "question": "Le barème d'honoraires doit être affiché...",
        "options": [
          "Uniquement à l'accueil de l'agence",
          "En vitrine, à l'accueil et sur le site internet, en TTC",
          "Seulement sur demande du client",
          "Uniquement en HT"
        ],
        "correct": 1,
        "explication": "Le barème s'affiche en vitrine, à l'accueil et sur le site internet, toujours en TTC."
      },
      {
        "question": "Les honoraires de location à la charge du locataire sont plafonnés, en zone très tendue, à...",
        "options": [
          "8 €/m²",
          "10 €/m²",
          "12 €/m²",
          "15 €/m²"
        ],
        "correct": 2,
        "explication": "Le plafond est de 12 €/m² en zone très tendue, auquel s'ajoute 3 €/m² pour l'état des lieux."
      },
      {
        "question": "Les honoraires du syndic pour l'établissement de l'état daté sont plafonnés à...",
        "options": [
          "180 € TTC",
          "380 € TTC",
          "500 € TTC",
          "non plafonnés"
        ],
        "correct": 1,
        "explication": "L'état daté, obligatoire à l'acte, est plafonné à 380 € TTC."
      },
      {
        "question": "Le fonds de travaux obligatoire des copropriétés représente une cotisation annuelle d'au moins...",
        "options": [
          "2 % du budget prévisionnel",
          "5 % du budget prévisionnel",
          "10 % des charges courantes",
          "Un mois de charges"
        ],
        "correct": 1,
        "explication": "Le fonds de travaux est alimenté d'au moins 5 % du budget prévisionnel annuel."
      },
      {
        "question": "Le compte bancaire séparé du syndicat de copropriété est obligatoire, sauf dispense votée dans les copropriétés de...",
        "options": [
          "5 lots ou moins",
          "10 lots ou moins",
          "15 lots ou moins",
          "50 lots ou moins"
        ],
        "correct": 2,
        "explication": "La dispense de compte séparé ne peut être votée que dans les copropriétés de 15 lots ou moins."
      },
      {
        "question": "Pour un logement classé F ou G, l'annonce doit obligatoirement porter la mention...",
        "options": [
          "« Passoire thermique »",
          "« Logement à consommation énergétique excessive »",
          "« Bien à rénover »",
          "« Interdit à la location »"
        ],
        "correct": 1,
        "explication": "Depuis le 1er janvier 2022, les logements F ou G portent la mention « Logement à consommation énergétique excessive »."
      },
      {
        "question": "Le bail mobilité, créé par la loi ELAN, est un bail meublé...",
        "options": [
          "De 1 à 10 mois, non renouvelable et sans dépôt de garantie",
          "De 3 ans minimum",
          "D'un an renouvelable avec dépôt de garantie",
          "De 6 ans"
        ],
        "correct": 0,
        "explication": "Le bail mobilité dure de 1 à 10 mois, n'est pas renouvelable et n'exige aucun dépôt de garantie."
      },
      {
        "question": "Exercer l'activité d'agent immobilier sans carte professionnelle est passible de...",
        "options": [
          "Une simple amende de 1 500 €",
          "6 mois d'emprisonnement et 7 500 € d'amende",
          "2 ans d'emprisonnement et 30 000 € d'amende",
          "Aucune sanction pénale"
        ],
        "correct": 1,
        "explication": "La loi Hoguet punit l'exercice sans carte de 6 mois d'emprisonnement et 7 500 € d'amende."
      },
      {
        "question": "En matière d'urbanisme, ALUR a notamment généralisé...",
        "options": [
          "Le coefficient d'occupation des sols (COS)",
          "Le PLU intercommunal (PLUi)",
          "Le permis de construire tacite",
          "Les plans d'occupation des sols (POS)"
        ],
        "correct": 1,
        "explication": "ALUR généralise le PLU intercommunal, transférant la compétence aux intercommunalités."
      },
      {
        "question": "La Garantie universelle des loyers (GUL) créée par ALUR a été...",
        "options": [
          "Généralisée à tous les baux",
          "Jamais appliquée, puis remplacée par le dispositif Visale",
          "Rendue obligatoire en 2020",
          "Fusionnée avec le DPE"
        ],
        "correct": 1,
        "explication": "La GUL n'a jamais été mise en œuvre ; elle a été remplacée par Visale d'Action Logement."
      }
    ]
  },
  {
    "id": "cadre-legal",
    "titre": "Cadre légal & conformité",
    "icone": "🛡️",
    "categorie": "Juridique",
    "resume": "Loi Hoguet, carte pro, mandat et honoraires, LCB-FT/Tracfin, RGPD, démarchage opt-in 2026 et non-discrimination : toutes vos obligations.",
    "duree": "31 min",
    "lecons": [
      {
        "titre": "Loi Hoguet : le socle du métier",
        "contenu": [
          "La **loi Hoguet** (loi n° 70-9 du 2 janvier 1970) et son décret d'application n° 72-678 du 20 juillet 1972 encadrent l'exercice de toutes les professions de l'entremise et de la gestion immobilières. C'est le texte fondateur du métier : sans lui, pas d'agent immobilier.",
          "## Pourquoi cette loi existe",
          "Avant 1970, n'importe qui pouvait manier l'argent d'autrui en se disant « agent immobilier ». La loi Hoguet a créé une profession **réglementée** pour **protéger le public** : carte obligatoire, garanties financières, contrôle. En clair, elle fait de vous un professionnel de confiance.",
          "## Les conditions pour exercer",
          "- **Carte professionnelle** (mentions **T** transaction, **G** gestion, **S** syndic) délivrée par la **CCI** depuis la loi ALUR de 2014 (auparavant la préfecture), **valable 3 ans**.",
          "- **Aptitude professionnelle** : diplôme (BTS professions immobilières, licence juridique, économique ou commerciale…) **ou** expérience (par exemple **10 ans** comme salarié d'un titulaire de carte, **4 ans** si vous aviez le statut de cadre).",
          "- **Garantie financière** obligatoire dès que l'on manie des fonds (dépôts, séquestres, loyers) : minimum **110 000 €**, réduit à **30 000 €** les deux premières années d'exercice. Qui ne manie aucun fonds se déclare « **non détenteur de fonds** » et en est dispensé.",
          "- **Assurance responsabilité civile professionnelle (RCP)** obligatoire.",
          "- **Honorabilité** : absence de condamnations incompatibles avec l'exercice (vérification du casier judiciaire).",
          "## Les documents qui vous suivent partout",
          "- **Mandat écrit préalable** : obligatoire pour agir **et** pour être payé (détaillé dans une leçon dédiée).",
          "- **Registre des mandats** : registre unique, à pages numérotées sans discontinuité, sans blanc ni rature ; chaque mandat y reçoit un **numéro**.",
          "- **Registre-répertoire** : il consigne les versements et les remises de fonds.",
          "- Mention de la **carte** (numéro et CCI de délivrance) sur vos documents et supports professionnels.",
          "## Mini cas pratique",
          "Un nouveau négociateur de CENTURY 21 Icaza Immobilier (Martigues, 13500) veut « prendre un chèque de réservation » auprès d'un acquéreur, sans passer par le séquestre du notaire ni par la garantie financière. **Refusez** : manier ces fonds sans garantie financière vous met hors-la-loi. On fait séquestrer chez le notaire.",
          "## Erreurs fréquentes à éviter",
          "- Croire que la carte est « à vie » : elle se **renouvelle tous les 3 ans**, dans les délais, auprès de la CCI.",
          "- Encaisser un acompte « pour rendre service » sans garantie financière.",
          "- Travailler alors que votre habilitation n'est pas à jour auprès de la CCI."
        ]
      },
      {
        "titre": "Carte professionnelle & habilitation des collaborateurs",
        "contenu": [
          "La carte professionnelle est délivrée au **titulaire** (le dirigeant ou l'entreprise). Les **négociateurs** travaillent sous cette carte : comprendre ce cadre évite les fautes qui engagent toute l'agence.",
          "## Les trois mentions de carte",
          "- **T — Transaction** : entremise et négociation sur les immeubles et les fonds de commerce (vente, recherche d'acquéreur). C'est la carte du négociateur en transaction.",
          "- **G — Gestion** : gestion immobilière pour le compte d'autrui (administration de biens, gestion locative).",
          "- **S — Syndic** : administration de copropriétés.",
          "Une agence peut cumuler plusieurs mentions. Vérifiez toujours quelle mention couvre l'acte que vous réalisez.",
          "## L'habilitation du négociateur",
          "Un négociateur (salarié **ou** agent commercial) ne détient pas de carte : il agit grâce à une **attestation d'habilitation** (ex-« carte blanche ») délivrée par la **CCI** à la demande du titulaire. Elle prouve que vous êtes **rattaché** à une agence et **habilité** à agir en son nom.",
          "- Elle mentionne votre identité, l'agence, et le fait que vous êtes habilité.",
          "- Elle doit être **à jour** : un négociateur non habilité qui prend un mandat fait courir un risque de **nullité**.",
          "- Elle se **restitue** et se radie quand vous quittez l'agence.",
          "## Ce que le négociateur ne peut PAS faire seul",
          "- **Manier des fonds** à titre personnel : les fonds transitent par l'agence (sous garantie financière) ou par le notaire.",
          "- **Donner des consultations juridiques** indépendantes ou rédiger des actes pour autrui à titre habituel.",
          "- Agir **hors du périmètre** de la carte du titulaire (par exemple faire de la gestion locative pour une agence qui n'a que la mention T).",
          "## Agent commercial ou salarié ?",
          "- **Agent commercial** : indépendant, immatriculé au **RSAC**, rémunéré à la **commission**, mais toujours **habilité** par le titulaire et soumis aux mêmes règles déontologiques.",
          "- **Salarié** : lien de subordination, bulletin de paie, mais **mêmes obligations** de conformité sur le terrain.",
          "## Mini cas pratique",
          "À Icaza Immobilier, un agent commercial fraîchement arrivé signe un mandat avant que son habilitation CCI ne soit enregistrée. Le mandat est **fragile** : faites enregistrer l'habilitation **avant** la première prise de mandat, puis reportez le numéro du mandat au registre.",
          "## Erreur fréquente",
          "- Penser que « agent commercial = je fais ce que je veux » : non, vous engagez la **responsabilité du titulaire** de la carte."
        ]
      },
      {
        "titre": "Le mandat écrit : le formalisme qui conditionne vos honoraires",
        "contenu": [
          "Pour la loi Hoguet, le **mandat écrit préalable** n'est pas une formalité administrative : c'est la **condition de votre rémunération**. Pas de mandat écrit conforme = **pas d'honoraires**, même si vous avez trouvé l'acquéreur.",
          "## Ce que dit la loi (article 6 de la loi Hoguet)",
          "- Vous ne pouvez **réclamer aucune somme** avant qu'une opération ait été **effectivement conclue** et **constatée dans un acte**.",
          "- Vous devez détenir un **mandat écrit préalable** vous autorisant à agir.",
          "- Ces règles sont d'**ordre public** : le client peut les invoquer même après coup. C'est une **protection du consommateur**, pas une option négociable.",
          "## Les mentions qui valident le mandat",
          "- **Identité** des parties et **désignation** du bien.",
          "- **Objet** et étendue des pouvoirs (vendre, rechercher un acquéreur…).",
          "- **Durée** et conditions de reconduction ou de résiliation.",
          "- **Prix**, **montant des honoraires** et **qui les paie** (vendeur ou acquéreur).",
          "- Un **numéro** reporté au **registre des mandats** : son absence peut entraîner la **nullité** et la perte de la commission (jurisprudence constante de la Cour de cassation).",
          "## Mandat simple, exclusif ou semi-exclusif",
          "- **Mandat simple** : le vendeur peut confier son bien à plusieurs agences et vendre lui-même. Plus souple pour lui, moins engageant pour vous.",
          "- **Mandat exclusif** : vous êtes la seule agence ; en contrepartie, vous investissez davantage. Il peut prévoir une **clause pénale** si le vendeur traite en direct avec un acquéreur que vous avez présenté.",
          "- **Mandat semi-exclusif** : exclusivité à l'agence, mais le vendeur garde le droit de vendre par lui-même sans vous devoir d'honoraires.",
          "- Un **mandat exclusif** ne peut être « verrouillé » indéfiniment : passé un délai de **3 mois**, chaque partie peut le **dénoncer** à tout moment par lettre recommandée, avec un **préavis de 15 jours** (décret du 20 juillet 1972).",
          "## Le piège de « l'acheteur direct »",
          "Phrase type du vendeur : « Finalement l'acheteur est un ami, on se passe de l'agence. » Si l'acquéreur vous a été présenté **par vous**, une **clause pénale** bien rédigée (mandat + bon de visite signé) protège vos honoraires. Sans écrit ni preuve de présentation, vous **ne percevez rien**.",
          "## Le bon de visite",
          "Le **bon de visite** ne crée pas à lui seul un droit à commission, mais il **prouve** que c'est vous qui avez présenté le bien à cet acquéreur : faites-le signer **à chaque visite**, c'est votre filet de sécurité en cas de litige.",
          "## Mini cas pratique",
          "Un vendeur de Martigues signe un mandat exclusif avec Icaza, puis vend « seul » à un couple que vous aviez fait visiter (bon de visite signé). La **clause pénale** du mandat, combinée au bon de visite, vous permet de réclamer vos honoraires : l'écrit a tout changé.",
          "## Erreurs fréquentes",
          "- Faire visiter **avant** d'avoir le mandat signé.",
          "- Oublier de **reporter le numéro** du mandat au registre.",
          "- Négliger le **bon de visite** : sans lui, pas de preuve de présentation."
        ]
      },
      {
        "titre": "Affichage et information sur les honoraires",
        "contenu": [
          "Vos honoraires de transaction sont **libres**, mais leur **affichage** et leur mention dans les annonces sont **strictement encadrés** par le décret n° 2016-173 du 18 février 2016 et l'arrêté du 10 janvier 2017 (en vigueur depuis le 1er avril 2017). La **DGCCRF** contrôle ce point de près.",
          "## Afficher son barème, partout",
          "- Le **barème des honoraires TTC** doit être affiché de façon **lisible et visible** à l'intérieur de l'agence, dans la **vitrine** si elle existe, et sur votre **site internet**.",
          "- La publicité en ligne obéit aux **mêmes règles** que la vitrine : pas d'exception pour le web.",
          "- Les honoraires de transaction s'expriment en **pourcentage TTC**, souvent par tranches de prix.",
          "## Ce que doit indiquer chaque annonce de vente",
          "- Le **prix de vente** du bien.",
          "- Le **montant TTC des honoraires** (en pourcentage lorsqu'ils sont à la charge de l'acquéreur) et **qui les paie** (vendeur ou acquéreur).",
          "- Lorsque les honoraires sont **à la charge de l'acquéreur**, on affiche le **prix hors honoraires**, puis le montant des honoraires et le **prix honoraires inclus**.",
          "- Les mentions du **DPE** et du **GES** (classes énergie et climat) sont également obligatoires dans l'annonce.",
          "## Le cas particulier de la location (loi ALUR)",
          "- En location d'habitation, les honoraires sont en principe **à la charge du bailleur**, sauf **quatre prestations partagées** avec le locataire : organisation de la visite, constitution du dossier, rédaction du bail et état des lieux.",
          "- La part payée par le locataire est **plafonnée** : **12 €/m²** en zone très tendue, **10 €/m²** en zone tendue, **8 €/m²** ailleurs, plus **3 €/m²** pour l'état des lieux.",
          "- La part demandée au locataire ne peut **jamais dépasser** celle payée par le bailleur.",
          "## Mini cas pratique",
          "Une annonce d'Icaza affiche « 250 000 € » sans préciser si les honoraires sont inclus ni qui les paie. **Corrigez** : indiquez le prix, le pourcentage TTC des honoraires et la mention « honoraires à la charge du vendeur » (ou de l'acquéreur), sinon l'annonce est **non conforme** et exposée à une amende.",
          "## Erreurs fréquentes",
          "- Afficher un barème en vitrine mais **l'oublier sur le site** internet.",
          "- Annoncer un prix « net vendeur » sans dire qui supporte les honoraires.",
          "- Dépasser le **plafond** des honoraires de location à la charge du locataire."
        ]
      },
      {
        "titre": "LCB-FT / Tracfin : vos obligations de vigilance",
        "contenu": [
          "Les agents immobiliers — **transaction ET gestion ou location** — sont des **professionnels assujettis** à la **lutte contre le blanchiment de capitaux et le financement du terrorisme (LCB-FT)**, au titre du **Code monétaire et financier** (articles L.561-2 et suivants). **Tracfin** est la cellule de renseignement financier rattachée à Bercy.",
          "Depuis la transposition de la 5e directive (ordonnance du 12 février 2020), la **location** entre aussi dans le champ dès que le **loyer mensuel atteint 10 000 €** (surtout locations commerciales et saisonnières haut de gamme) : la vigilance ne concerne plus la seule vente.",
          "## Réflexe 1 : identifier le client (KYC)",
          "- **Vérifier l'identité** du client sur une **pièce officielle en cours de validité** (CNI, passeport), dès l'**entrée en relation**.",
          "- Conserver une **copie** et les éléments de la vérification.",
          "- Pour une **société** : extrait Kbis, statuts, et identification du **bénéficiaire effectif**.",
          "## Réflexe 2 : comprendre (bénéficiaire effectif et risque)",
          "- Le **bénéficiaire effectif** est la **personne physique** qui détient, directement ou indirectement, **plus de 25 %** du capital ou des droits de vote, **ou** qui exerce un **contrôle** par d'autres moyens. On le vérifie sur **sources fiables** (dont le registre des bénéficiaires effectifs), pas sur simple déclaration.",
          "- **Classer le risque** du dossier : **faible, standard ou élevé**, et adapter la vigilance en conséquence.",
          "- **Vigilance renforcée** pour les **personnes politiquement exposées (PPE)**, les montages avec sociétés écrans, les clients non présents physiquement, ou les pays à risque.",
          "## Réflexe 3 : surveiller (origine des fonds et opérations atypiques)",
          "- Vérifier l'**origine des fonds** (épargne, donation, vente, prêt) et sa **cohérence** avec le profil du client.",
          "- Repérer les **signaux atypiques** : paiement en **espèces** ou en **crypto-actifs**, prix très au-dessus ou en dessous du marché, urgence anormale, interposition de sociétés, acheteur qui se désintéresse du bien lui-même.",
          "## Conservation",
          "Conservez les justificatifs et pièces de vigilance **5 ans** après la fin de la relation d'affaires (article L.561-12 du Code monétaire et financier).",
          "## Mnémo : « C.I.O. »",
          "**C**lient identifié, **I**ntentions comprises (bénéficiaire effectif, risque), **O**rigine des fonds vérifiée. Si l'un des trois cloche, la vigilance monte d'un cran.",
          "## Mini cas pratique",
          "Un acquéreur propose de régler un studio à Martigues **en partie en espèces**, via une SCI dont il refuse de nommer l'associé majoritaire. Trois clignotants : espèces, société opaque, bénéficiaire effectif masqué. **Vigilance renforcée** et, selon l'analyse, **déclaration de soupçon** (voir leçon suivante)."
        ]
      },
      {
        "titre": "Tracfin : déclaration de soupçon & dispositif interne",
        "contenu": [
          "Savoir **quand** et **comment** déclarer est le cœur de la LCB-FT. Une erreur ici expose l'agence à des **sanctions lourdes**.",
          "## Le déclencheur : le soupçon, pas la preuve",
          "- On ne déclare **pas** une infraction prouvée : on déclare un **soupçon**. Dès qu'il existe des **indices concordants** laissant penser à un blanchiment ou à un financement du terrorisme, la déclaration s'impose (article L.561-15 du Code monétaire et financier).",
          "- **Ne pas déclarer** malgré des indices est en soi un **manquement sanctionnable**.",
          "## La confidentialité absolue",
          "- La déclaration est **secrète** : il est **interdit d'informer le client** (ou un tiers) qu'une déclaration a été ou va être faite. C'est le principe du « **no tipping-off** ».",
          "- Révéler l'existence d'une déclaration est une **infraction** à part entière.",
          "## Le dispositif interne de l'agence",
          "- **Désigner** un **déclarant** et un **correspondant** Tracfin (souvent le dirigeant dans une petite agence).",
          "- Des **procédures internes écrites** et une **classification des risques** formalisée.",
          "- Une **fiche de vigilance par dossier** : identité, bénéficiaire effectif, origine des fonds, niveau de risque, conclusion.",
          "- La **formation LCB-FT** du personnel est une **obligation** que l'agence doit pouvoir **justifier** (dirigeants, négociateurs, agents commerciaux, gestionnaires). Le dispositif s'est nettement **durci sur 2024-2026**, avec des **contrôles** accrus de la DGCCRF.",
          "## La déclaration se fait en ligne",
          "La déclaration de soupçon s'effectue par la téléprocédure sécurisée **Ermes** de Tracfin, et non par courrier ni par téléphone.",
          "## Les sanctions",
          "- Contrôles de la **DGCCRF** ; sanctions prononcées par la **Commission nationale des sanctions (CNS)** : avertissement, blâme, **interdiction temporaire d'exercer**, **sanctions pécuniaires**.",
          "- Risque **pénal** en cas de participation au blanchiment.",
          "## Dans l'application",
          "La **fiche d'identification Tracfin (KYC)** se génère automatiquement depuis le dossier vendeur (pièce d'identité et titre de propriété), **une fiche par vendeur**. La partie **notation des risques** reste à remplir et à signer par vous : c'est **votre appréciation**, sous votre responsabilité.",
          "## Mini cas pratique",
          "Vous décidez de déclarer un dossier suspect. Le client, inquiet, vous demande « s'il y a un problème avec son dossier ». **Ne révélez rien** de la déclaration : répondez sur le plan administratif, poursuivez le traitement normalement, et laissez Tracfin agir."
        ]
      },
      {
        "titre": "RGPD & protection des données personnelles",
        "contenu": [
          "Vous collectez en permanence des **données personnelles** (vendeurs, acquéreurs, prospects, locataires) : le **RGPD** (règlement UE 2016/679) et la **loi Informatique et Libertés** s'appliquent pleinement à l'agence.",
          "## Les principes à respecter",
          "- **Finalité** : chaque donnée est collectée pour un **usage défini** (estimer, commercialiser, gérer un bail…).",
          "- **Minimisation** : on ne collecte **que l'utile**. Pas de pièce d'identité « au cas où » sans raison.",
          "- **Base légale** : contrat, **intérêt légitime**, obligation légale, ou **consentement** (indispensable pour la prospection).",
          "- **Transparence** : informer les personnes (qui traite, pourquoi, combien de temps, quels droits).",
          "## Les droits des personnes",
          "- Droit d'**accès**, de **rectification**, d'**effacement**, d'**opposition**, de **limitation** et de **portabilité**.",
          "- Vous devez pouvoir répondre à une demande **dans un délai d'un mois**.",
          "## Durées de conservation (repères)",
          "- **Prospects non convertis** : la CNIL recommande **3 ans** à compter du dernier contact, puis suppression ou anonymisation.",
          "- **Clients et dossiers de vente** : conservation alignée sur les obligations légales (dont **5 ans** au titre de la LCB-FT), puis archivage ou suppression.",
          "- Ne gardez pas des fichiers de prospection « à vie » : c'est un **manquement**.",
          "## Vos obligations d'organisation",
          "- Tenir un **registre des traitements**.",
          "- Garantir la **sécurité** (accès protégés, mots de passe, pas de données clients sur un cloud personnel non sécurisé).",
          "- Désigner un **DPO** (délégué à la protection des données) si vos traitements le justifient : pas toujours obligatoire pour une petite agence, mais recommandé.",
          "## Les sanctions CNIL",
          "La CNIL peut prononcer des amendes jusqu'à **20 millions d'euros** ou **4 % du chiffre d'affaires annuel mondial** (le montant le plus élevé étant retenu), sans compter l'atteinte à la réputation.",
          "## Mini cas pratique",
          "Un prospect estimé il y a 4 ans vous écrit : « Supprimez mes données. » Vous devez **effacer** sa fiche (droit à l'effacement) et le confirmer sous **un mois** — et de toute façon, après 3 ans sans contact, elle n'avait plus à figurer en base active.",
          "## Erreurs fréquentes",
          "- Revendre ou partager un fichier de prospects sans base légale.",
          "- Conserver des CNI scannées sans nécessité ni sécurité.",
          "- Prospecter par e-mail sans **consentement** préalable (voir leçon suivante)."
        ]
      },
      {
        "titre": "Démarchage & prospection conforme (opt-in 2026)",
        "contenu": [
          "La prospection est vitale, mais **très encadrée** — et le cadre a **changé en 2026**. Un démarchage non conforme expose à des **sanctions** et abîme l'image de l'agence.",
          "## Le nouveau régime depuis le 11 août 2026 : le consentement préalable (opt-in)",
          "- La **loi n° 2025-594 du 30 juin 2025** a basculé le démarchage téléphonique d'un régime d'**opposition** (l'ancien **Bloctel**) vers un régime de **consentement préalable (opt-in)**.",
          "- Depuis le **11 août 2026**, **aucun appel commercial** vers un particulier n'est possible **sans son accord exprès et préalable**. L'ancienne liste **Bloctel disparaît** avec ce basculement.",
          "- Le consentement doit être **libre, spécifique, éclairé, univoque et révocable**, et n'est valable qu'**un an maximum**.",
          "- Vous devez **conserver la preuve** du consentement **au moins 3 ans** et la fournir au consommateur sur demande.",
          "## Jours et horaires toujours applicables",
          "- Même avec un consentement, le démarchage reste cantonné : **du lundi au vendredi**, de **10 h à 13 h** et de **14 h à 20 h** (décret d'octobre 2022).",
          "- **Interdit** le **samedi**, le **dimanche** et les **jours fériés**.",
          "- Pas plus de **4 sollicitations** par mois pour un même consommateur.",
          "## SMS et e-mails : opt-in aussi",
          "- La prospection par **SMS ou e-mail** vers un particulier exige son **consentement préalable** (sauf client existant, pour des biens ou services analogues).",
          "- Chaque message doit offrir un moyen de **se désinscrire** simple et gratuit.",
          "## La pige : toujours possible",
          "- Appeler un particulier qui a publié **lui-même** une annonce de vente (**pige**) reste légitime : il sollicite le marché et s'expose au contact de professionnels. Restez professionnel, respectez les horaires, et **cessez à la première opposition**.",
          "- La pige demeure le **cœur** d'une prospection conforme, aux côtés de vos contacts **opt-in**.",
          "## Les sanctions",
          "- Le non-respect du régime expose à une **amende administrative** pouvant atteindre **375 000 € pour une personne morale**, et peut entraîner la **nullité** des contrats conclus.",
          "## Mnémo : « C.H.O. »",
          "**C**onsentement obtenu et prouvé, **H**oraires respectés, **O**pposition honorée immédiatement. Trois cases à cocher avant toute campagne.",
          "## Mini cas pratique",
          "Un négociateur d'Icaza veut envoyer un SMS groupé « Vendez avec nous » à 300 numéros **achetés**. **Stop** : aucun consentement préalable, donc illégal depuis août 2026. On privilégie la **pige** (annonces publiées par les vendeurs eux-mêmes) et un fichier **opt-in** dont on garde la preuve.",
          "## Erreurs fréquentes",
          "- Croire que « Bloctel suffit » : le régime est désormais l'**opt-in**, plus l'opposition.",
          "- Appeler le **dimanche** ou après 20 h, même avec consentement.",
          "- Ne pas **conserver la preuve** du consentement (exigée au moins 3 ans)."
        ]
      },
      {
        "titre": "Non-discrimination, devoir de conseil & responsabilité",
        "contenu": [
          "Au-delà des procédures, deux obligations engagent votre responsabilité au quotidien : **ne jamais discriminer**, et **conseiller loyalement**.",
          "## La non-discrimination : une obligation pénale",
          "- La loi (articles **225-1 et 225-2 du Code pénal**) interdit toute discrimination fondée sur une longue liste de **critères prohibés** : **origine, sexe, situation de famille, grossesse, apparence physique, patronyme, lieu de résidence, état de santé, handicap, âge, orientation sexuelle, opinions, activité syndicale**… (environ **25 critères**).",
          "- Refuser un candidat locataire ou un acquéreur **à cause** de l'un de ces critères est un **délit**.",
          "## Les sanctions",
          "- Discrimination dans la fourniture d'un bien ou d'un service : jusqu'à **3 ans d'emprisonnement et 45 000 € d'amende** (davantage dans certains cas aggravés).",
          "- La preuve peut se faire par **testing** (candidats de test). Le **Défenseur des droits** peut être saisi.",
          "## En pratique : sélectionner sans discriminer",
          "- On sélectionne un candidat locataire sur sa **solvabilité** et des **pièces autorisées**, pas sur son nom ou son origine.",
          "- Ne demandez **que** les pièces légalement autorisées : la liste est **limitative** (décret n° 2015-1437) ; exiger une pièce interdite est fautif.",
          "- Phrase type à bannir : « Le propriétaire préfère un couple français sans enfants. » **Jamais.** C'est une discrimination caractérisée, et vous en êtes **co-responsable**.",
          "## Le devoir de conseil et d'information",
          "- L'agent est tenu d'un **devoir d'information, de conseil et de mise en garde** envers ses clients (jurisprudence constante).",
          "- Informer sur l'état du marché, les diagnostics, les servitudes, les risques d'une opération : un **silence** fautif engage votre **responsabilité civile** (d'où l'importance de la **RCP**).",
          "## Les trois niveaux de responsabilité",
          "- **Civile** : réparation du préjudice causé au client (couverte par la **RCP**).",
          "- **Pénale** : par exemple l'**exercice sans carte** (article 14 de la loi Hoguet : **6 mois d'emprisonnement et 7 500 € d'amende**), l'escroquerie ou la discrimination.",
          "- **Disciplinaire** : la **commission de contrôle** des activités de transaction et de gestion peut prononcer **avertissement, blâme, interdiction temporaire voire définitive** d'exercer, pour manquement au **code de déontologie** (décret du 28 août 2015).",
          "## Mini cas pratique",
          "Un propriétaire bailleur de Martigues vous demande d'« écarter les dossiers d'un certain quartier ». **Refusez clairement** : « Je sélectionne sur la solvabilité, pas sur le lieu de résidence ni l'origine ; la loi me l'interdit et vous expose aussi. » Vous protégez le client **et** l'agence.",
          "## Erreurs fréquentes",
          "- Relayer une consigne discriminatoire d'un propriétaire : vous devenez **co-auteur** du délit.",
          "- Demander des pièces **hors liste** autorisée à un candidat locataire.",
          "- Oublier de **tracer** vos conseils (un écrit prouve que vous avez informé)."
        ]
      }
    ],
    "quiz": [
      {
        "question": "La carte « T » autorise…",
        "options": [
          "La seule gestion locative",
          "La transaction immobilière",
          "Le syndic uniquement",
          "Le crédit immobilier"
        ],
        "correct": 1,
        "explication": "La carte T (transaction) autorise l'entremise et la négociation immobilière (loi Hoguet) ; la G vise la gestion et la S le syndic."
      },
      {
        "question": "La garantie financière est…",
        "options": [
          "Obligatoire pour tout agent en toutes circonstances",
          "Obligatoire dès que le professionnel manie des fonds",
          "Jamais obligatoire",
          "Réservée aux seuls syndics"
        ],
        "correct": 1,
        "explication": "Elle est obligatoire dès qu'on manie des fonds (minimum 110 000 €, réduit à 30 000 € les deux premières années). Sinon on se déclare « non détenteur de fonds »."
      },
      {
        "question": "Dans une annonce de vente, le professionnel doit indiquer…",
        "options": [
          "Uniquement le prix du bien",
          "Le prix, le montant TTC des honoraires et qui les paie",
          "Rien, les honoraires sont libres donc confidentiels",
          "Seulement le nom de l'agence"
        ],
        "correct": 1,
        "explication": "Le décret 2016-173 et l'arrêté du 10 janvier 2017 imposent d'indiquer le prix, le montant TTC des honoraires et qui les supporte (vendeur ou acquéreur) ; le barème doit aussi être affiché en agence, en vitrine et sur le site internet."
      },
      {
        "question": "Un bénéficiaire effectif, c'est une personne physique détenant…",
        "options": [
          "Plus de 10 %",
          "Plus de 25 % ou exerçant un contrôle",
          "100 % du capital",
          "N'importe quelle part"
        ],
        "correct": 1,
        "explication": "Détention directe ou indirecte de plus de 25 % du capital ou des droits de vote, ou contrôle effectif par d'autres moyens."
      },
      {
        "question": "Quand déclarer à Tracfin ?",
        "options": [
          "Seulement si l'infraction est prouvée",
          "Dès la simple suspicion (indices concordants)",
          "Jamais, c'est le rôle de la banque",
          "Après la vente seulement"
        ],
        "correct": 1,
        "explication": "Le déclencheur est le soupçon, pas la preuve ; ne pas déclarer malgré des indices est un manquement sanctionnable, et la déclaration reste confidentielle (interdiction d'en informer le client)."
      },
      {
        "question": "Depuis le 11 août 2026, démarcher un particulier par téléphone suppose…",
        "options": [
          "Qu'il ne soit pas inscrit sur Bloctel",
          "Son consentement préalable (opt-in)",
          "Rien, c'est libre en semaine",
          "Un simple SMS d'information"
        ],
        "correct": 1,
        "explication": "La loi du 30 juin 2025 a basculé vers le consentement préalable (opt-in) : Bloctel disparaît, la preuve du consentement se conserve au moins 3 ans et le manquement expose à une amende administrative jusqu'à 375 000 € pour une personne morale."
      },
      {
        "question": "Refuser un locataire en raison de son origine expose à…",
        "options": [
          "Aucune sanction, c'est au propriétaire de choisir",
          "Un simple rappel déontologique",
          "Jusqu'à 3 ans d'emprisonnement et 45 000 € d'amende",
          "Une amende forfaitaire de 135 €"
        ],
        "correct": 2,
        "explication": "La discrimination (articles 225-1 et 225-2 du Code pénal) est un délit puni jusqu'à 3 ans de prison et 45 000 € d'amende ; l'agent qui relaie la consigne du propriétaire en est co-responsable."
      },
      {
        "question": "Quelle est la durée de validité de la carte professionnelle d'agent immobilier ?",
        "options": [
          "1 an",
          "3 ans",
          "5 ans",
          "À vie"
        ],
        "correct": 1,
        "explication": "La carte professionnelle est valable 3 ans et se renouvelle auprès de la CCI dans les délais."
      },
      {
        "question": "Depuis la loi ALUR de 2014, qui délivre la carte professionnelle d'agent immobilier ?",
        "options": [
          "La préfecture",
          "La CCI (chambre de commerce et d'industrie)",
          "Le tribunal de commerce",
          "La mairie"
        ],
        "correct": 1,
        "explication": "Depuis la loi ALUR de 2014, la carte est délivrée par la CCI, et non plus par la préfecture."
      },
      {
        "question": "La garantie financière, minimum 110 000 €, est réduite à quel montant durant les deux premières années d'exercice ?",
        "options": [
          "10 000 €",
          "30 000 €",
          "55 000 €",
          "75 000 €"
        ],
        "correct": 1,
        "explication": "La garantie financière minimale de 110 000 € est ramenée à 30 000 € les deux premières années d'exercice."
      },
      {
        "question": "Que couvre la mention « S » de la carte professionnelle ?",
        "options": [
          "La transaction",
          "La gestion locative",
          "L'activité de syndic de copropriété",
          "Le service d'estimation"
        ],
        "correct": 2,
        "explication": "La mention S autorise l'administration de copropriétés, c'est-à-dire l'activité de syndic."
      },
      {
        "question": "Un négociateur (salarié ou agent commercial) agit grâce à quel document ?",
        "options": [
          "Sa propre carte professionnelle T",
          "Une attestation d'habilitation délivrée par la CCI",
          "Un simple contrat de travail",
          "Une inscription au barreau"
        ],
        "correct": 1,
        "explication": "Le négociateur ne détient pas de carte : il agit via une attestation d'habilitation (ex-carte blanche) délivrée par la CCI à la demande du titulaire."
      },
      {
        "question": "Selon l'article 6 de la loi Hoguet, sans mandat écrit préalable conforme, l'agent immobilier…",
        "options": [
          "Peut quand même percevoir ses honoraires s'il a trouvé l'acquéreur",
          "Ne peut réclamer aucun honoraire",
          "Perçoit la moitié de ses honoraires",
          "Doit saisir le juge pour être payé"
        ],
        "correct": 1,
        "explication": "Le mandat écrit préalable est d'ordre public : sans lui, l'agent ne peut réclamer aucun honoraire, même s'il a trouvé l'acquéreur."
      },
      {
        "question": "Passé un délai de 3 mois, un mandat exclusif peut être dénoncé par chaque partie moyennant un préavis de…",
        "options": [
          "48 heures",
          "8 jours",
          "15 jours",
          "1 mois"
        ],
        "correct": 2,
        "explication": "Au-delà de 3 mois, chaque partie peut dénoncer le mandat exclusif à tout moment par lettre recommandée, avec un préavis de 15 jours."
      },
      {
        "question": "En location d'habitation, le plafond d'honoraires à la charge du locataire en zone tendue (hors état des lieux) est de…",
        "options": [
          "8 €/m²",
          "10 €/m²",
          "12 €/m²",
          "15 €/m²"
        ],
        "correct": 1,
        "explication": "Les honoraires du locataire sont plafonnés à 10 €/m² en zone tendue (12 € en zone très tendue, 8 € ailleurs), plus 3 €/m² pour l'état des lieux."
      },
      {
        "question": "Depuis l'ordonnance de 2020, la location entre dans le champ de la LCB-FT dès que le loyer mensuel atteint…",
        "options": [
          "1 000 €",
          "5 000 €",
          "10 000 €",
          "25 000 €"
        ],
        "correct": 2,
        "explication": "La location est assujettie à la vigilance LCB-FT dès que le loyer mensuel atteint 10 000 €."
      },
      {
        "question": "Combien de temps faut-il conserver les justificatifs de vigilance LCB-FT après la fin de la relation d'affaires ?",
        "options": [
          "1 an",
          "3 ans",
          "5 ans",
          "10 ans"
        ],
        "correct": 2,
        "explication": "L'article L.561-12 du Code monétaire et financier impose une conservation de 5 ans après la fin de la relation d'affaires."
      },
      {
        "question": "Par quel canal s'effectue une déclaration de soupçon à Tracfin ?",
        "options": [
          "Par courrier recommandé",
          "Par téléphone au commissariat",
          "Par la téléprocédure sécurisée Ermes",
          "Par e-mail au procureur"
        ],
        "correct": 2,
        "explication": "La déclaration de soupçon se fait exclusivement via la téléprocédure sécurisée Ermes de Tracfin."
      },
      {
        "question": "Même avec le consentement du prospect, le démarchage téléphonique est autorisé…",
        "options": [
          "7 jours sur 7 de 8 h à 22 h",
          "Du lundi au vendredi, de 10 h à 13 h et de 14 h à 20 h",
          "Uniquement le week-end",
          "À toute heure sans restriction"
        ],
        "correct": 1,
        "explication": "Le démarchage reste cantonné du lundi au vendredi, de 10 h à 13 h et de 14 h à 20 h, interdit samedi, dimanche et jours fériés."
      }
    ]
  },
  {
    "id": "compromis",
    "titre": "Compromis & financement",
    "icone": "🏦",
    "categorie": "Juridique",
    "resume": "De l'offre acceptée à la signature : avant-contrat, rétractation SRU, conditions suspensives, prêt, VEFA, frais et pilotage jusqu'à l'acte.",
    "duree": "45 min",
    "lecons": [
      {
        "titre": "Compromis ou promesse unilatérale ?",
        "contenu": [
          "Une fois l'offre d'achat acceptée par le vendeur, on ne file pas directement chez le notaire : on signe d'abord un **avant-contrat**. C'est LE document qui fige l'accord, verrouille le prix et organise les conditions de la vente. L'essentiel de la sécurité juridique d'une transaction se joue à ce stade.",
          "## Les deux grandes formes d'avant-contrat",
          "- **Le compromis de vente (promesse synallagmatique)** : il engage **les deux parties** — le vendeur à vendre, l'acquéreur à acheter — à un prix fixé, sous conditions suspensives. C'est la forme la plus répandue en France (plus de 90 % des avant-contrats).",
          "- **La promesse unilatérale de vente (PUV)** : seul le **vendeur** s'engage à vendre pendant une durée déterminée (l'option, souvent 2 à 3 mois). L'acquéreur, lui, reste libre : il « lève l'option » s'il confirme, et verse en contrepartie une **indemnité d'immobilisation** (environ 10 % du prix).",
          "## Le compromis « vaut vente »",
          "- Article 1589 du Code civil : « la promesse de vente vaut vente lorsqu'il y a consentement réciproque des deux parties sur la chose et sur le prix ». Autrement dit, le compromis engage fermement les deux camps.",
          "- Si l'acquéreur se désiste sans motif légitime (hors rétractation SRU et hors condition suspensive non réalisée), le vendeur peut conserver le dépôt de garantie au titre de la **clause pénale**, voire demander la vente forcée en justice.",
          "- Avantage : sécurité maximale pour le vendeur. Inconvénient : moins de souplesse pour l'acquéreur hésitant.",
          "## La PUV : souplesse et indemnité d'immobilisation",
          "- L'acquéreur dispose d'un **droit d'option** : il peut acheter, ou renoncer en abandonnant l'indemnité d'immobilisation (sauf si une condition suspensive échoue, auquel cas elle lui est restituée).",
          "- **Piège à connaître** : une PUV signée sous seing privé (sans notaire) doit être **enregistrée au service des impôts dans les 10 jours** de son acceptation (article 1589-2 du Code civil), sous peine de **nullité**. Pour cette raison, la PUV est le plus souvent signée chez le notaire.",
          "## Compromis ou PUV : comment choisir ?",
          "- **Compromis** : vente « classique », acquéreur décidé et déjà financé, vendeur qui veut un engagement ferme et réciproque.",
          "- **PUV** : projet avec aléa (acquéreur qui doit d'abord revendre, montage en SCI, obtention d'un permis), ou vendeur qui accepte de « réserver » le bien un temps contre indemnité.",
          "## Qui signe, et sous quelle forme ?",
          "- L'avant-contrat peut être signé **sous seing privé** (à l'agence, c'est le cas le plus fréquent) ou **par acte authentique** (chez le notaire).",
          "- **Tous les propriétaires** doivent signer : les deux époux pour un bien commun ou pour le logement de la famille (article 215 du Code civil), **tous les indivisaires** en indivision, tous les héritiers en cas de succession.",
          "- Vérifiez la **capacité et le pouvoir de vendre** dès le mandat : un seul indivisaire manquant et la vente est bloquée.",
          "## La clause de faculté de substitution",
          "- Elle permet à l'acquéreur de **se substituer une autre personne** (son conjoint, ses enfants, une SCI à constituer) avant l'acte, sans refaire le compromis. Très utile pour un investisseur qui achètera via une société.",
          "- Attention : la substitution ne doit pas masquer une opération spéculative d'achat-revente déguisée, qui pourrait être requalifiée fiscalement.",
          "## Le dépôt de garantie, en bref",
          "- Au compromis, l'acquéreur verse en général **5 à 10 %** du prix, **séquestrés** (chez le notaire ou chez l'agent disposant d'une garantie financière). Cette somme s'impute sur le prix le jour de l'acte. Le détail du séquestre et de la clause pénale fait l'objet d'une leçon dédiée.",
          "## Le délai compromis vers acte",
          "- Comptez en moyenne **2 à 3 mois** entre la signature de l'avant-contrat et l'acte authentique : purge du droit de rétractation, obtention du prêt, levée des conditions suspensives, purge des droits de préemption, rédaction par le notaire.",
          "## Erreurs fréquentes",
          "- Oublier un signataire (époux, indivisaire) : l'avant-contrat est fragilisé, voire inopposable.",
          "- Signer une PUV sous seing privé sans l'enregistrer dans les 10 jours : nullité.",
          "- Confondre offre d'achat et compromis : l'offre n'est qu'une étape, c'est l'avant-contrat qui structure réellement la vente.",
          "## Cas pratique",
          "Un couple achète une villa à Martigues (quartier de Jonquières) à **320 000 €**. L'acquéreur doit d'abord revendre son appartement et veut créer une SCI familiale. Solution recommandée : **PUV de 3 mois** avec indemnité d'immobilisation de 32 000 € et **clause de substitution** au profit de la SCI. Le vendeur immobilise son bien contre indemnité, l'acquéreur garde la main sur son montage."
        ]
      },
      {
        "titre": "Le contenu du compromis et ses annexes",
        "contenu": [
          "Un bon compromis ne se résume pas à un prix et deux signatures. C'est un dossier complet : plus il est précis et bien annexé, moins la vente risque de capoter ou de finir en contentieux. Le notaire rédigera l'acte à partir de ce que vous avez sécurisé en amont.",
          "## Les mentions essentielles",
          "- **Identité complète des parties** : état civil, régime matrimonial, adresse (et pour une société : forme, siège, RCS, représentant).",
          "- **Désignation du bien** : adresse, références cadastrales, lots de copropriété, désignation des annexes (cave, parking, garage).",
          "- **Origine de propriété** : comment et quand le vendeur est devenu propriétaire (le notaire la contrôle).",
          "- **Le prix** et ses modalités : prix net vendeur, honoraires d'agence (montant, qui les paie), répartition des frais.",
          "- **La date limite de signature** de l'acte authentique (date « butoir »).",
          "- **Les conditions suspensives** (prêt, préemption, urbanisme).",
          "- **Les biens mobiliers inclus** (cuisine équipée, meubles) : à chiffrer à part, car ils ne supportent pas les droits de mutation.",
          "## Le dossier de diagnostics techniques (DDT)",
          "- Il doit être **annexé au compromis** (article L271-4 du Code de la construction et de l'habitation). Un DDT incomplet engage la responsabilité du vendeur et le prive du bénéfice de la clause d'exonération des vices cachés sur le point concerné.",
          "- **DPE** : valable 10 ans, obligatoire pour tout logement (voir le module dédié au DPE).",
          "- **Amiante** : logements dont le permis de construire est antérieur au 1er juillet 1997.",
          "- **Plomb (CREP)** : logements construits avant le 1er janvier 1949.",
          "- **Termites** : dans les zones délimitées par arrêté préfectoral, validité 6 mois.",
          "- **Gaz et électricité** : installations de plus de 15 ans, validité 3 ans.",
          "- **État des risques (ERP)** : risques naturels, miniers, technologiques, sismiques, radon, recul du trait de côte — validité 6 mois ; point crucial en PACA (risque sismique, inondation, feux de forêt autour de l'étang de Berre).",
          "- **Loi Carrez** : mesurage de la superficie privative en copropriété (pas de délai de validité, sauf travaux modifiant la surface).",
          "- **Assainissement non collectif** : contrôle du SPANC, validité 3 ans.",
          "## Les annexes spécifiques à la copropriété (loi ALUR)",
          "- **Pré-état daté** établi par le syndic : situation des charges, procédures en cours.",
          "- **Règlement de copropriété** et **état descriptif de division**.",
          "- **Procès-verbaux des 3 dernières assemblées générales**.",
          "- **Montant des charges courantes** du budget prévisionnel et des charges hors budget.",
          "- **Carnet d'entretien de l'immeuble** et, le cas échéant, **diagnostic technique global (DTG)**.",
          "- **Montant du fonds de travaux** (fonds obligatoire : la cotisation annuelle ne peut être inférieure à 5 % du budget prévisionnel, ou 2,5 % du montant des travaux du plan pluriannuel) et quote-part du vendeur.",
          "## Documents d'urbanisme et servitudes",
          "- Note ou certificat d'urbanisme, servitudes éventuelles (passage, vue, canalisation), alignements, zonage PLU. Un bien grevé d'une servitude non déclarée est une source classique de litige.",
          "## Pourquoi un dossier complet sécurise la vente",
          "- Chaque pièce manquante, c'est un délai supplémentaire chez le notaire et un risque de blocage. Un compromis bien annexé = un acte rapide et une vente qui tient.",
          "## Erreurs fréquentes",
          "- Diagnostics périmés (termites à 6 mois, ERP à 6 mois) : à vérifier avant la signature, pas après.",
          "- Oublier de chiffrer le mobilier à part et faire payer inutilement des droits de mutation à l'acquéreur.",
          "- Compromis signé sans les documents de copropriété : le délai de rétractation de l'acquéreur ne démarre pas valablement tant que ces pièces ne lui sont pas remises.",
          "## Cas pratique",
          "Appartement en copropriété à Martigues (quartier de L'Île), vendu **210 000 €** mobilier compris. L'agent ventile : **200 000 € le bien** + **10 000 € de cuisine et dressing**. Résultat : l'acquéreur économise les droits de mutation (environ 7,5 %) sur les 10 000 € de mobilier, soit **~750 €** — un argument commercial concret pour conclure."
        ]
      },
      {
        "titre": "Le délai de rétractation SRU (10 jours)",
        "contenu": [
          "L'acquéreur **non professionnel** d'un bien à usage d'habitation bénéficie d'un **délai de rétractation de 10 jours** (article L271-1 du Code de la construction et de l'habitation). Ce délai a été porté de 7 à 10 jours par la **loi Macron du 6 août 2015**.",
          "## Les points clés",
          "- **10 jours calendaires** (et non ouvrés) : on compte les week-ends et jours fériés.",
          "- Le délai court **à compter du lendemain** de la **première présentation** de la notification de l'avant-contrat signé à l'acquéreur.",
          "- **Aucune justification** n'est requise et **aucune pénalité** n'est due : le dépôt de garantie est **intégralement restitué**, dans un délai maximal de **21 jours**.",
          "- Ce droit bénéficie à l'**acquéreur** uniquement. Le **vendeur**, lui, est engagé dès la signature : il ne peut pas se rétracter.",
          "## Comment se décompte précisément le délai",
          "- Jour de départ : le **lendemain** de la première présentation de la lettre recommandée (ou de la remise en main propre / notification électronique).",
          "- Si le dernier jour tombe un **samedi, un dimanche ou un jour férié**, le délai est **reporté au premier jour ouvrable suivant**.",
          "- **Exemple** : notification présentée le vendredi 3. Le délai démarre le samedi 4, et le 10e jour tombe le lundi 13. S'il était tombé un dimanche, il aurait été reporté au lundi.",
          "## Les modes de notification",
          "- **Lettre recommandée avec accusé de réception** : le mode le plus courant (souvent assuré par le notaire).",
          "- **Remise en main propre contre émargement** : possible lorsque l'acte est signé avec l'assistance d'un professionnel (notaire).",
          "- **Voie électronique** (lettre recommandée électronique) : admise, avec preuve de réception.",
          "## Qui en bénéficie, qui en est exclu",
          "- Bénéficie à l'**acquéreur personne physique non professionnel** d'un bien à usage d'**habitation**. La jurisprudence l'étend à une **SCI familiale** qui n'agit pas à titre professionnel.",
          "- **Hors champ** : l'acquéreur professionnel de l'immobilier, et les biens qui ne sont pas à usage d'habitation (local commercial pur, terrain non destiné à l'habitation).",
          "## Rétractation (10 j) n'est pas réflexion (10 j)",
          "- **Rétractation** : il existe un avant-contrat ; l'acquéreur peut revenir sur son engagement pendant 10 jours.",
          "- **Réflexion** : s'il n'y a **pas d'avant-contrat** et que l'on signe directement l'acte, l'acquéreur dispose d'un **délai de réflexion de 10 jours** pendant lequel l'acte **ne peut pas être signé**. Les deux délais ne se cumulent pas.",
          "## Vigilance pratique",
          "- Soignez la **preuve de notification** : c'est elle qui fait démarrer et fige le délai. En cas de doute, c'est le notaire qui notifie, pour sécuriser la date.",
          "## Erreurs fréquentes",
          "- **Notifier avant d'avoir annexé tous les documents de copropriété** : le délai ne court pas valablement, ce qui peut le **rouvrir** des mois plus tard.",
          "- Compter en jours ouvrés au lieu de jours calendaires.",
          "- Accepter une rétractation par simple SMS ou appel : exigez un écrit pour sécuriser la restitution du dépôt et la traçabilité.",
          "## Cas pratique",
          "Vente d'un T3 à Martigues. Le compromis est signé en agence le mardi, mais il manque un procès-verbal d'assemblée générale. L'agent attend d'avoir **toutes** les annexes avant la notification par le notaire : le délai de 10 jours ne démarre proprement qu'une fois le dossier complet remis. On évite ainsi une rétractation tardive qui ferait tomber la vente après deux mois de démarches."
        ]
      },
      {
        "titre": "Dépôt de garantie, séquestre et clause pénale",
        "contenu": [
          "Le **dépôt de garantie** (parfois appelé acompte ou indemnité d'immobilisation selon l'avant-contrat) est la somme que l'acquéreur verse à la signature du compromis pour matérialiser son engagement. Bien manié, c'est un puissant facteur de sérieux ; mal géré, c'est une source de litige.",
          "## Montant et imputation",
          "- Montant **librement fixé**, en pratique **5 à 10 %** du prix de vente. Il peut être réduit, voire nul, pour un acquéreur très fiable (mais c'est plus risqué pour le vendeur).",
          "- Il s'**impute sur le prix** : le jour de l'acte, l'acquéreur ne paie que le solde.",
          "- Ce n'est **pas** la commission de l'agence : le dépôt appartient à l'acquéreur jusqu'à l'acte (ou revient au vendeur en cas de défaillance fautive).",
          "## Qui séquestre les fonds ?",
          "- Le **notaire** : solution la plus sûre et la plus neutre.",
          "- L'**agent immobilier**, uniquement s'il dispose d'une **garantie financière suffisante** et d'un **compte séquestre** dédié. Jamais sur un compte personnel ou sur le compte courant de l'agence.",
          "- La **loi Hoguet** encadre strictement la détention de fonds par l'agent : sans garantie financière adaptée, l'agent ne peut pas séquestrer.",
          "## LCB-FT et Tracfin : la vigilance obligatoire",
          "- L'agent immobilier et le notaire sont des **professionnels assujettis** à la lutte contre le blanchiment et le financement du terrorisme (LCB-FT).",
          "- Ils doivent **identifier le client**, vérifier son identité et **s'interroger sur l'origine des fonds** (apport, provenance du virement), avec une vigilance renforcée en cas d'opération atypique.",
          "- En cas de soupçon, une **déclaration à Tracfin** est obligatoire, sans en informer le client. Un dépôt payé en espèces au-delà du plafond légal, ou par un tiers non identifié, est un signal d'alerte.",
          "## La restitution du dépôt",
          "- **Rétractation SRU** (dans les 10 jours) : restitué intégralement sous 21 jours.",
          "- **Condition suspensive non réalisée** sans faute de l'acquéreur (prêt refusé, préemption exercée) : restitué intégralement.",
          "- **Défaillance fautive de l'acquéreur** après le délai SRU et toutes conditions levées : le vendeur peut le **conserver** au titre de la clause pénale.",
          "## La clause pénale",
          "- Elle **forfaitise à l'avance les dommages et intérêts** dus par la partie défaillante, en général **10 % du prix**.",
          "- Elle joue **dans les deux sens** : si c'est le vendeur qui se dérobe, il peut devoir cette somme à l'acquéreur.",
          "- Le **juge peut la modérer** (ou l'augmenter) si elle est manifestement excessive ou dérisoire (article 1231-5 du Code civil).",
          "## La clause de dédit (à ne pas confondre)",
          "- Une **clause de dédit** autorise une partie à **se dégager** de la vente en abandonnant une somme convenue. C'est un droit de renoncer « acheté » d'avance, alors que la clause pénale sanctionne un **manquement**.",
          "## L'indemnité d'immobilisation (en cas de PUV)",
          "- Dans une promesse unilatérale, l'acquéreur verse une **indemnité d'immobilisation** (environ 10 %), définitivement **perdue** s'il ne lève pas l'option sans motif légitime — c'est le prix de la « réservation » du bien.",
          "## Erreurs fréquentes",
          "- Verser le dépôt directement au vendeur : à proscrire, il doit être séquestré.",
          "- Promettre à un acquéreur qu'il récupérera son dépôt « de toute façon » : faux s'il est fautif après le délai SRU.",
          "- Négliger les obligations LCB-FT sur l'origine des fonds : la responsabilité de l'agent est engagée.",
          "## Cas pratique",
          "Maison à Martigues vendue **320 000 €**. Dépôt de garantie de **5 %** = **16 000 €**, séquestrés chez le notaire. L'acquéreur obtient son prêt, puis change d'avis sans motif deux semaines avant l'acte : la **clause pénale de 10 %** (32 000 €) est due. Le vendeur conserve les 16 000 € séquestrés et peut réclamer le solde. La leçon pour l'agent : bien expliquer ces conséquences en amont évite la grande majorité des désistements de confort."
        ]
      },
      {
        "titre": "Les conditions suspensives",
        "contenu": [
          "Une **condition suspensive** suspend la formation définitive de la vente à la réalisation d'un événement futur et incertain (article 1304 du Code civil). Tant qu'elle n'est pas réalisée, la vente est « en attente » ; si elle échoue, la vente est **caduque** et le dépôt **restitué**.",
          "## Les conditions suspensives les plus fréquentes",
          "- **Obtention du prêt** : la plus courante et la plus protectrice (elle fait l'objet d'une leçon dédiée).",
          "- **Absence de préemption** : la mairie (droit de préemption urbain), la SAFER ou un locataire ne se portent pas acquéreurs.",
          "- **Absence de servitude grave** d'urbanisme, et **état hypothécaire** permettant de vendre libre de toute inscription après remboursement.",
          "- **Certificat d'urbanisme** ou **permis** conforme au projet de l'acquéreur, selon le cas.",
          "- Plus rarement : **vente préalable** du bien de l'acquéreur, ou obtention d'une autorisation administrative.",
          "## Chaque condition a une date de réalisation",
          "- On fixe un **délai** pour chaque condition. Passé ce délai sans réalisation, la partie protégée peut constater la **caducité** du compromis — ou les parties peuvent convenir d'une **prorogation** par avenant.",
          "## Rédaction = sécurité",
          "- Une condition mal rédigée fait **tomber des ventes** ou crée du contentieux.",
          "- Pour le prêt : préciser **montant, durée maximale, taux maximal, nombre de banques à solliciter, délai**.",
          "- Fuyez les formulations vagues (« sous réserve d'obtention du financement ») : elles se retournent contre tout le monde.",
          "## La faute d'une partie : la condition réputée accomplie",
          "- Article 1304-3 du Code civil : la condition suspensive est **réputée accomplie** si celui qui avait intérêt à ce qu'elle défaille **en a empêché la réalisation**.",
          "- Concrètement : un acquéreur qui **ne dépose aucune demande de prêt conforme**, ou qui la sabote, est considéré comme fautif — il **perd son dépôt** et ne peut pas invoquer le refus de prêt.",
          "## Qui prouve quoi",
          "- L'acquéreur doit **justifier ses démarches** : dépôt d'une demande conforme aux caractéristiques de la clause, et **attestation(s) de refus** correspondant à ces caractéristiques.",
          "- Un refus obtenu pour un prêt **différent** (montant, durée ou taux ne correspondant pas à la clause) ne vaut pas réalisation de la condition suspensive.",
          "## Attention aux conditions interdites",
          "- La **condition potestative** (qui dépend de la seule volonté de celui qui s'engage : « j'achète si je le décide ») est **nulle**. La condition doit dépendre d'un événement extérieur à la volonté des parties.",
          "## Erreurs fréquentes",
          "- Clause de prêt sans taux maximal : l'acquéreur peut alors invoquer n'importe quel refus.",
          "- Oublier la condition d'absence de préemption en zone urbaine.",
          "- Ne pas fixer de date de réalisation, ce qui laisse la vente dans un flou indéfini.",
          "## Cas pratique",
          "Compromis à Martigues, condition de prêt : **250 000 €**, durée **25 ans**, taux maximal **4 %** (hors assurance), à obtenir sous **60 jours**. L'acquéreur ne sollicite qu'une seule banque qui refuse, mais ne produit aucune autre démarche alors que la clause imposait de solliciter **deux établissements**. La condition peut être jugée défaillie par la faute de l'acquéreur — d'où l'importance d'une clause précise et d'un suivi documenté des démarches."
        ]
      },
      {
        "titre": "La condition suspensive de prêt (loi Scrivener)",
        "contenu": [
          "Le financement est la **première cause d'échec** d'une vente. La **condition suspensive de prêt** protège l'acquéreur qui achète à crédit : si la banque refuse, il récupère son dépôt. La maîtriser, c'est sécuriser le compromis.",
          "## Le cadre : la loi Scrivener (article L313-41 du Code de la consommation)",
          "- La condition suspensive de prêt est **obligatoire** dès que l'acquéreur déclare recourir à un crédit pour financer un bien à usage d'habitation.",
          "- **Durée minimale légale : 1 mois** à compter de la signature. En pratique, on prévoit **45 à 60 jours** pour tenir compte des délais bancaires réels.",
          "- Si le prêt est **refusé** dans les conditions prévues au contrat, la vente est **annulée** et le dépôt **restitué** intégralement.",
          "## Ce que la clause doit obligatoirement préciser",
          "- Le **montant** du ou des prêts sollicités.",
          "- La **durée** de remboursement.",
          "- Le **taux d'intérêt maximal** (hors assurance).",
          "- Le **délai** d'obtention et, idéalement, le **nombre d'établissements** à solliciter.",
          "## Refus de prêt : une attestation conforme",
          "- L'acquéreur doit produire une **attestation de refus correspondant exactement aux caractéristiques** de la clause.",
          "- Un refus obtenu pour un prêt **plus cher, plus court ou d'un montant différent** de ce que prévoit le compromis **ne vaut pas** réalisation de la condition : le vendeur peut alors conserver le dépôt.",
          "## La renonciation à la condition de prêt",
          "- Un acquéreur qui achète **comptant** peut renoncer à la condition de prêt, mais la loi l'encadre : il doit apposer une **mention manuscrite** (article L313-42) reconnaissant que, s'il recourt néanmoins à un prêt, il ne pourra pas se prévaloir de la protection Scrivener.",
          "- C'est **risqué** : sans cette protection, un financement qui échoue n'annule pas la vente. À manier avec prudence.",
          "## L'offre de prêt : les délais légaux à connaître",
          "- L'**offre de prêt** émise par la banque doit être **maintenue 30 jours minimum** : l'emprunteur dispose d'au moins ce délai pour l'accepter (article L313-24).",
          "- Elle ne peut être **acceptée qu'après un délai de réflexion de 10 jours** : l'emprunteur **ne peut pas accepter avant le 11e jour** suivant sa réception (article L313-34).",
          "- L'acceptation se fait par retour postal daté ; les fonds sont ensuite débloqués, souvent le jour de l'acte.",
          "## Votre rôle d'agent",
          "- **Qualifier le financement en amont** (apport, endettement, durée) avant même l'offre d'achat.",
          "- Orienter l'acquéreur vers une **banque ou un courtier dès le lendemain** du compromis : chaque jour compte.",
          "- **Suivre les délais** de la condition et relancer : « Avez-vous déposé votre dossier ? Reçu l'accord de principe ? L'offre éditée ? » Un dossier bancaire qui traîne, c'est une vente en danger.",
          "## Erreurs fréquentes",
          "- Laisser l'acquéreur « gérer seul » son financement sans aucun suivi.",
          "- Rédiger une clause sans taux maximal : la protection devient alors incontrôlable.",
          "- Oublier le délai de réflexion de 10 jours et promettre une signature d'acte trop tôt.",
          "## Cas pratique",
          "Acquéreur d'une maison à Martigues, compromis signé le 1er du mois. L'agent fixe un rétroplanning : dépôt du dossier à J+5, accord de principe visé à J+21, offre de prêt reçue vers J+40. En comptant les **10 jours de réflexion** obligatoires puis le déblocage des fonds, l'acte ne peut raisonnablement se tenir avant **J+55 à J+60**. D'où une date butoir réaliste fixée à **3 mois** dans le compromis."
        ]
      },
      {
        "titre": "Comprendre le crédit immobilier",
        "contenu": [
          "Un agent qui comprend le crédit vend mieux : il qualifie les acquéreurs sérieux, fixe des clauses de prêt réalistes et pilote la période compromis vers acte sans mauvaise surprise. Voici les mécanismes à maîtriser (le conseil financier détaillé reste du ressort de la banque et du courtier).",
          "## La capacité d'emprunt",
          "- Elle dépend des **revenus nets**, des **charges et crédits en cours**, de l'**apport**, de la **durée** et du **taux**.",
          "- Règle simple : **mensualité maximale ≈ 35 % des revenus nets**, assurance comprise, diminuée des crédits déjà en cours.",
          "## Les règles du HCSF (contraignantes depuis 2022)",
          "- **Taux d'effort maximal : 35 %** des revenus, **assurance emprunteur comprise**.",
          "- **Durée maximale : 25 ans** (27 ans avec un différé d'amortissement de 2 ans dans le neuf / VEFA, ou en cas de travaux représentant au moins 10 % de l'opération).",
          "- Les banques disposent d'une **marge de flexibilité de 20 %** de leur production trimestrielle de crédits pour déroger à ces plafonds, en priorité au profit de la **résidence principale** et des **primo-accédants**.",
          "## Le taux d'usure",
          "- C'est le **TAEG maximal légal** au-delà duquel une banque ne peut pas prêter. Il protège l'emprunteur des taux abusifs.",
          "- Mensualisé en 2023 pour s'adapter à la hausse des taux, il est **redevenu trimestriel depuis début 2024**. Il est publié par la **Banque de France**.",
          "- Attention : un dossier peut être refusé non à cause de l'emprunteur, mais parce que **TAEG + assurance + frais dépassent l'usure**.",
          "## L'apport personnel",
          "- En pratique, les banques demandent souvent **au moins 10 % d'apport** pour couvrir les **frais de notaire** et de garantie.",
          "- Plus l'apport est élevé, meilleur est le taux obtenu et plus le dossier passe facilement.",
          "## Les frais à anticiper",
          "- **Frais de notaire** : environ **7 à 8 %** dans l'ancien, **2 à 3 %** dans le neuf (leur détail et la fiscalité font l'objet d'une leçon dédiée).",
          "- **Garantie** : hypothèque, privilège de prêteur de deniers ou **caution** (type Crédit Logement), **frais de dossier** bancaires, et éventuels **frais de courtier**.",
          "## L'assurance emprunteur (loi Lemoine, 2022)",
          "- **Résiliation à tout moment** du contrat d'assurance, sans frais ni obligation d'attendre une date anniversaire.",
          "- **Suppression du questionnaire de santé** pour les prêts dont la part assurée est **≤ 200 000 € par emprunteur** et dont le terme intervient **avant les 60 ans** de l'assuré.",
          "- **Droit à l'oubli** ramené à **5 ans** pour certaines pathologies (cancers, hépatite C).",
          "- L'assurance pèse lourd dans le coût total : c'est un **levier d'économie** à rappeler à l'acquéreur.",
          "## Le rôle du courtier",
          "- Il met les banques en concurrence, optimise le taux et l'assurance, et **accélère** le montage. Pour une vente sous condition de prêt, c'est souvent un allié précieux de l'agent.",
          "## Erreurs fréquentes",
          "- Oublier l'assurance dans le calcul du taux d'effort (le HCSF la compte).",
          "- Annoncer des « frais de notaire » du neuf pour un bien ancien.",
          "- Négliger l'apport minimal nécessaire pour couvrir les frais.",
          "## Cas pratique",
          "Couple avec **4 500 € nets/mois** à Martigues, sans crédit en cours. Taux d'effort 35 % → **~1 575 €/mois** de mensualité (assurance comprise). Sur **25 ans** à un taux d'environ 3,5 %, cela finance **~280 000 €** de capital. Avec **30 000 € d'apport** (pour les frais), leur budget d'achat tourne autour de **~310 000 €** — soit précisément une villa de secteur. L'agent peut ainsi cibler les biens réellement accessibles et ne pas perdre de temps."
        ]
      },
      {
        "titre": "L'achat dans le neuf : contrat de réservation et VEFA",
        "contenu": [
          "Acheter dans le **neuf** ne passe pas par un compromis classique mais par un **contrat de réservation** (ou contrat préliminaire), suivi d'un acte de **vente en l'état futur d'achèvement (VEFA)**. L'agent qui commercialise du neuf doit en maîtriser les règles propres, très protectrices pour l'acquéreur.",
          "## Le contrat de réservation",
          "- Il est régi par l'**article L261-15 du Code de la construction et de l'habitation**. Le promoteur « réserve » un logement à construire à l'acquéreur, en décrivant le bien, le prix prévisionnel et la date de livraison.",
          "- Le **dépôt de garantie de réservation** est **plafonné** : au maximum **5 %** du prix si l'acte de vente intervient dans l'année de la réservation, **2 %** s'il intervient dans un à deux ans, **0 %** au-delà de deux ans.",
          "- Ce dépôt est versé sur un **compte bloqué** au nom du réservataire (banque ou notaire).",
          "## La rétractation s'applique aussi",
          "- L'acquéreur non professionnel bénéficie du **même délai de rétractation de 10 jours** (article L271-1) à compter du lendemain de la notification du contrat de réservation.",
          "- Son dépôt lui est restitué s'il se rétracte dans ce délai, ou si la vente ne se réalise pas du fait du promoteur.",
          "## L'échéancier de paiement encadré",
          "- Le paiement suit l'avancement du chantier, dans les **plafonds légaux** de l'article R261-14 du CCH :",
          "- **35 %** du prix à l'**achèvement des fondations**.",
          "- **70 %** à la **mise hors d'eau** (toiture posée).",
          "- **95 %** à l'**achèvement de l'immeuble**.",
          "- **5 %** à la **livraison** (ce solde peut être consigné en cas de réserves).",
          "## Les garanties de la VEFA",
          "- **Garantie financière d'achèvement (GFA)** : garantit que l'immeuble sera terminé même en cas de défaillance du promoteur. Elle est **obligatoire**.",
          "- **Garantie de parfait achèvement** : le constructeur répare les désordres signalés pendant **1 an** après la réception.",
          "- **Garantie biennale** (de bon fonctionnement) : couvre les équipements dissociables pendant **2 ans**.",
          "- **Garantie décennale** : couvre les dommages compromettant la solidité ou rendant l'ouvrage impropre à sa destination pendant **10 ans**.",
          "## Des frais réduits dans le neuf",
          "- Les **frais de notaire** sont réduits (**2 à 3 %**) car les droits de mutation sont allégés dans le neuf.",
          "- Le prix s'entend **TVA incluse** (20 %). Certains dispositifs (zones ANRU, logement social) ouvrent droit à une **TVA réduite**.",
          "- Selon ses revenus et la zone, l'acquéreur peut mobiliser un **prêt à taux zéro (PTZ)**.",
          "## Erreurs fréquentes",
          "- Confondre le contrat de réservation avec un compromis : les règles de dépôt et de paiement diffèrent.",
          "- Réclamer un dépôt de réservation supérieur au plafond légal.",
          "- Oublier de vérifier la présence de la GFA avant de faire signer.",
          "## Cas pratique",
          "Programme neuf à Martigues, appartement réservé **250 000 €** TVA comprise. L'acte de vente chez le notaire est prévu 4 mois après la réservation (la livraison, elle, interviendra en fin de chantier). Comme l'acte intervient dans l'année, le dépôt de réservation peut atteindre **5 %** (12 500 €), versé sur compte bloqué. L'acquéreur dispose de ses 10 jours de rétractation, paiera ensuite selon l'échéancier légal au fil du chantier et bénéficiera de frais de notaire réduits (~2,5 %)."
        ]
      },
      {
        "titre": "Frais, fiscalité et plus-value de l'opération",
        "contenu": [
          "Au-delà du prix affiché, une opération immobilière génère des **frais** pour l'acquéreur et une **fiscalité** pour le vendeur. L'agent doit savoir les expliquer : un acquéreur qui découvre les frais trop tard, ou un vendeur qui surestime son net, c'est une vente qui se grippe.",
          "## Les frais de notaire (frais d'acquisition)",
          "- Mal nommés : le notaire n'en garde qu'une petite part (ses **émoluments**, tarifés). L'essentiel va à l'État et aux collectivités.",
          "- Ils se composent des **droits de mutation (DMTO)**, des **émoluments du notaire**, des **débours** (pièces, géomètre) et de la **contribution de sécurité immobilière**.",
          "- Ordre de grandeur : environ **7 à 8 %** du prix dans l'**ancien**, **2 à 3 %** dans le **neuf**.",
          "## La hausse des DMTO (depuis 2025)",
          "- La loi de finances pour 2025 autorise les départements à relever la part départementale des droits de **4,50 % à 5 %**, pour les actes signés entre le **1er avril 2025 et le 31 mars 2028**.",
          "- La grande majorité des départements ont appliqué cette hausse : vérifiez le taux réellement en vigueur dans le département du bien.",
          "- **Exonération pour les primo-accédants** : sous conditions (ne pas avoir été propriétaire de sa résidence principale au cours des deux années précédentes et s'engager à y habiter au moins 5 ans), ils échappent à la hausse, indépendamment du recours ou non à un PTZ.",
          "## La plus-value immobilière du vendeur",
          "- La **résidence principale** est **totalement exonérée** de plus-value : c'est la règle à connaître en premier.",
          "- Pour une **résidence secondaire** ou un **investissement locatif**, la plus-value est taxée à **19 % au titre de l'impôt sur le revenu** et **17,2 % de prélèvements sociaux**, soit **36,2 %** de la plus-value imposable.",
          "- Le **prix d'acquisition** peut être majoré forfaitairement (frais d'acquisition, travaux) pour **réduire** la plus-value imposable.",
          "## Les abattements pour durée de détention",
          "- **Impôt sur le revenu** : abattement de 6 % par an de la 6e à la 21e année, puis 4 % la 22e → **exonération totale d'IR au bout de 22 ans**.",
          "- **Prélèvements sociaux** : abattement plus lent → **exonération totale au bout de 30 ans**.",
          "- Une **surtaxe** de 2 % à 6 % s'ajoute lorsque la plus-value imposable dépasse **50 000 €**.",
          "- Une réforme de ce régime (indexation du prix d'acquisition sur l'inflation) a été évoquée dans les débats budgétaires récents : vérifiez toujours le régime applicable à la date de la vente.",
          "## Le rôle de l'agent",
          "- **Informer et orienter**, sans se substituer au notaire ni à l'expert-comptable, qui chiffrent précisément.",
          "- Présenter un **net vendeur réaliste** au vendeur et un **budget tout compris** à l'acquéreur : c'est ce qui sécurise la négociation.",
          "## Erreurs fréquentes",
          "- Annoncer un net vendeur en oubliant la plus-value sur une résidence secondaire.",
          "- Appliquer des frais de notaire du neuf à un bien ancien (ou l'inverse).",
          "- Oublier de vérifier le taux de DMTO réellement appliqué dans le département.",
          "## Cas pratique",
          "Un vendeur cède à Martigues une résidence secondaire achetée 180 000 € il y a 12 ans, revendue **260 000 €**. La plus-value brute est de **80 000 €**. Après 12 ans de détention, les abattements ne sont que partiels : la plus-value reste imposable à 36,2 % sur une base réduite. À l'inverse, s'il s'agissait de sa **résidence principale**, elle serait **totalement exonérée**. L'agent explique cet écart au vendeur avant même de fixer le prix."
        ]
      },
      {
        "titre": "Du compromis à l'acte : piloter et sécuriser",
        "contenu": [
          "Entre l'avant-contrat et la signature chez le notaire s'écoulent 2 à 3 mois pendant lesquels tout peut encore capoter. C'est là que le professionnalisme de l'agent fait la différence : une vente se **perd souvent entre le compromis et l'acte**, faute de suivi.",
          "## La chronologie type (2 à 3 mois)",
          "- **Jours 1 à 10** : purge du **droit de rétractation SRU** de l'acquéreur.",
          "- **Dès le départ** : dépôt du **dossier de prêt**, puis accord de principe, puis offre.",
          "- **En parallèle** : purge des **droits de préemption** (déclaration d'intention d'aliéner).",
          "- **Vers J+40 / J+50** : offre de prêt, puis **10 jours de réflexion** obligatoires.",
          "- **J+60 à J+90** : convocation et **signature de l'acte authentique**.",
          "## Les droits de préemption à purger",
          "- **Droit de préemption urbain (DPU)** : dans les zones définies par la commune, le notaire adresse une **déclaration d'intention d'aliéner (DIA)** ; la mairie a **2 mois** pour se porter acquéreur ou renoncer (le silence vaut renonciation).",
          "- **SAFER** : préemption possible sur les biens à vocation agricole, délai de 2 mois.",
          "- **Locataire en place** : dans certains cas de vente d'un logement loué (congé pour vente, vente par lots), le locataire bénéficie d'un **droit de préemption** à purger.",
          "## Le rôle du notaire pendant cette phase",
          "- Il contrôle le **titre de propriété** et l'origine de propriété, demande l'**état hypothécaire**, les pièces d'**urbanisme** et l'**état civil**, puis rédige l'acte. (Le détail du rôle du notaire est traité dans le module dédié à la transaction.)",
          "## La signature de l'acte authentique",
          "- Paiement du **solde du prix** et des **frais**, **remise des clés**, **publication au service de la publicité foncière** qui rend la vente opposable aux tiers.",
          "- Les **honoraires d'agence** sont réglés conformément au mandat, le plus souvent par le notaire sur les fonds de la vente.",
          "- Une **procuration** permet de signer à distance ; l'**acte authentique électronique** est désormais courant.",
          "## La répartition de la taxe foncière",
          "- Le redevable légal est le **propriétaire au 1er janvier** (le vendeur). En pratique, le compromis prévoit presque toujours une **répartition au prorata temporis** : l'acquéreur rembourse au vendeur la part correspondant à sa période de propriété sur l'année.",
          "## Checklist de suivi de l'agent",
          "- **J+1** : lancer l'acquéreur vers la banque / le courtier, remettre le dossier complet au notaire.",
          "- **J+10** : confirmer que le délai de rétractation est purgé.",
          "- **J+21** : vérifier l'accord de principe bancaire.",
          "- **J+45** : offre de prêt éditée ? Lancer le compte à rebours des 10 jours de réflexion.",
          "- **J+60** : caler la date de l'acte avec le notaire, le vendeur et l'acquéreur.",
          "## Les causes d'échec les plus fréquentes",
          "- **Financement** non obtenu (mauvaise qualification en amont).",
          "- **Préemption** exercée par la commune.",
          "- **Pièces manquantes** qui retardent l'acte et laissent le doute s'installer.",
          "- **Mésentente** de dernière minute sur une date ou un meuble : à désamorcer vite.",
          "## Erreurs fréquentes",
          "- Considérer que « c'est vendu » dès le compromis et relâcher le suivi.",
          "- Ne pas anticiper les 10 jours de réflexion de l'offre de prêt dans la date butoir.",
          "- Laisser les parties négocier en direct les points sensibles sans arbitrage de l'agent.",
          "## Cas pratique",
          "Vente à Martigues, compromis signé début mars, date butoir fin mai. L'agent tient sa checklist : prêt déposé à J+4, DIA envoyée par le notaire (mairie silencieuse à 2 mois = renonciation), offre de prêt reçue mi-avril, acte signé le 28 mai. La taxe foncière de l'année est répartie au prorata : le vendeur ayant été propriétaire environ 5 mois, l'acquéreur ne rembourse que **~7/12** de la taxe. Suivi serré = vente qui tient jusqu'au bout."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Délai de rétractation SRU de l'acquéreur non professionnel ?",
        "options": [
          "48 h",
          "7 jours",
          "10 jours calendaires",
          "1 mois"
        ],
        "correct": 2,
        "explication": "10 jours calendaires (loi Macron 2015), à compter du lendemain de la première présentation de la notification ; report au jour ouvrable suivant si le dernier jour est un samedi, un dimanche ou un jour férié."
      },
      {
        "question": "La condition suspensive de prêt a une durée minimale légale de…",
        "options": [
          "10 jours",
          "1 mois",
          "3 mois",
          "6 mois"
        ],
        "correct": 1,
        "explication": "Minimum légal d'un mois (art. L313-41 du Code de la consommation, loi Scrivener) ; en pratique on prévoit 45 à 60 jours pour tenir compte des délais bancaires."
      },
      {
        "question": "Une offre de prêt peut être acceptée par l'emprunteur…",
        "options": [
          "Immédiatement",
          "Après un délai de réflexion de 10 jours",
          "Au bout de 30 jours obligatoires",
          "Sans aucun délai"
        ],
        "correct": 1,
        "explication": "Délai de réflexion de 10 jours : acceptation possible au plus tôt le 11e jour ; l'offre doit par ailleurs être maintenue 30 jours minimum (art. L313-24 et L313-34)."
      },
      {
        "question": "La clause pénale d'un compromis est généralement de…",
        "options": [
          "10 % du prix",
          "1 % du prix",
          "5 % du prix",
          "Interdite par la loi"
        ],
        "correct": 0,
        "explication": "Elle forfaitise les dommages et intérêts (environ 10 % du prix), joue dans les deux sens et peut être modérée par le juge (art. 1231-5 du Code civil)."
      },
      {
        "question": "Les règles du HCSF plafonnent le taux d'effort de l'emprunteur à…",
        "options": [
          "Aucun plafond légal",
          "35 % des revenus, assurance comprise",
          "50 % des revenus",
          "15 % des revenus"
        ],
        "correct": 1,
        "explication": "Taux d'effort maximal de 35 % (assurance comprise) et durée ≤ 25 ans (27 ans avec différé dans le neuf), avec une marge de flexibilité de 20 % des dossiers trimestriels."
      },
      {
        "question": "Les frais de notaire (frais d'acquisition) représentent environ…",
        "options": [
          "7 à 8 % du prix dans l'ancien et 2 à 3 % dans le neuf",
          "2 à 3 % du prix dans tous les cas",
          "15 % du prix quel que soit le bien",
          "rien : ils sont à la charge du vendeur"
        ],
        "correct": 0,
        "explication": "Environ 7 à 8 % dans l'ancien, 2 à 3 % dans le neuf (droits de mutation allégés). Ils sont composés surtout de taxes ; le notaire n'en conserve qu'une faible part (ses émoluments)."
      },
      {
        "question": "Le compromis de vente (promesse synallagmatique) engage…",
        "options": [
          "Seulement le vendeur",
          "Seulement l'acquéreur",
          "Les deux parties, vendeur et acquéreur",
          "Ni l'une ni l'autre tant que le notaire n'a pas signé"
        ],
        "correct": 2,
        "explication": "Selon l'article 1589 du Code civil, « la promesse de vente vaut vente » : le compromis engage fermement les deux parties."
      },
      {
        "question": "Une promesse unilatérale de vente signée sous seing privé doit être enregistrée au service des impôts dans un délai de…",
        "options": [
          "3 jours",
          "10 jours",
          "1 mois",
          "3 mois"
        ],
        "correct": 1,
        "explication": "L'article 1589-2 impose l'enregistrement dans les 10 jours de l'acceptation, sous peine de nullité."
      },
      {
        "question": "Après exercice de son droit de rétractation SRU, le dépôt de garantie de l'acquéreur doit être restitué dans un délai maximal de…",
        "options": [
          "7 jours",
          "14 jours",
          "21 jours",
          "2 mois"
        ],
        "correct": 2,
        "explication": "Le dépôt est restitué intégralement, sans pénalité, dans un délai maximal de 21 jours."
      },
      {
        "question": "Le délai de rétractation SRU de 10 jours commence à courir…",
        "options": [
          "Le jour même de la signature du compromis",
          "Le lendemain de la première présentation de la notification à l'acquéreur",
          "À la signature de l'acte authentique",
          "Dès l'acceptation de l'offre d'achat"
        ],
        "correct": 1,
        "explication": "Le délai court à compter du lendemain de la première présentation de la notification de l'avant-contrat signé."
      },
      {
        "question": "Une condition suspensive est « réputée accomplie » lorsque…",
        "options": [
          "Le délai de réalisation est dépassé",
          "La partie qui avait intérêt à sa défaillance en a empêché la réalisation",
          "Le notaire le décide",
          "L'acquéreur change d'avis"
        ],
        "correct": 1,
        "explication": "L'article 1304-3 du Code civil répute la condition accomplie si celui qui avait intérêt à sa défaillance en a empêché la réalisation."
      },
      {
        "question": "Une condition potestative, qui dépend de la seule volonté de celui qui s'engage, est…",
        "options": [
          "Valable",
          "Nulle",
          "Valable seulement chez le notaire",
          "Valable si écrite à la main"
        ],
        "correct": 1,
        "explication": "La condition potestative (« j'achète si je le décide ») est nulle : la condition doit dépendre d'un événement extérieur à la volonté des parties."
      },
      {
        "question": "L'agent immobilier peut séquestrer le dépôt de garantie uniquement s'il dispose…",
        "options": [
          "D'un simple compte courant d'agence",
          "D'une garantie financière suffisante et d'un compte séquestre dédié",
          "De l'accord verbal du vendeur",
          "D'une carte G"
        ],
        "correct": 1,
        "explication": "Sans garantie financière adaptée et compte séquestre dédié, l'agent ne peut pas détenir les fonds ; sinon, le notaire séquestre."
      },
      {
        "question": "La cotisation annuelle au fonds de travaux d'une copropriété ne peut être inférieure à…",
        "options": [
          "1 % du budget prévisionnel",
          "5 % du budget prévisionnel",
          "10 % du budget prévisionnel",
          "25 % du budget prévisionnel"
        ],
        "correct": 1,
        "explication": "Le fonds de travaux obligatoire impose une cotisation d'au moins 5 % du budget prévisionnel (ou 2,5 % du plan pluriannuel)."
      },
      {
        "question": "Dans l'échéancier de paiement d'une VEFA, quel pourcentage du prix est atteint à la mise hors d'eau (toiture posée) ?",
        "options": [
          "35 %",
          "70 %",
          "95 %",
          "100 %"
        ],
        "correct": 1,
        "explication": "L'article R261-14 du CCH plafonne le paiement à 35 % aux fondations, 70 % à la mise hors d'eau, 95 % à l'achèvement et 5 % à la livraison."
      },
      {
        "question": "La loi de finances pour 2025 autorise les départements à relever la part départementale des droits de mutation de 4,50 % à…",
        "options": [
          "4,80 %",
          "5 %",
          "5,50 %",
          "6 %"
        ],
        "correct": 1,
        "explication": "Les départements peuvent relever la part départementale des DMTO à 5 % pour les actes signés entre le 1er avril 2025 et le 31 mars 2028."
      },
      {
        "question": "La plus-value réalisée lors de la vente de sa résidence principale est…",
        "options": [
          "Taxée à 36,2 %",
          "Taxée à 19 %",
          "Totalement exonérée",
          "Taxée seulement au-delà de 50 000 €"
        ],
        "correct": 2,
        "explication": "La plus-value de la résidence principale est totalement exonérée d'impôt et de prélèvements sociaux."
      },
      {
        "question": "En zone de droit de préemption urbain, de quel délai dispose la mairie pour se porter acquéreur après la déclaration d'intention d'aliéner ?",
        "options": [
          "15 jours",
          "1 mois",
          "2 mois",
          "6 mois"
        ],
        "correct": 2,
        "explication": "La mairie dispose de 2 mois pour préempter ou renoncer ; son silence vaut renonciation."
      }
    ]
  },
  {
    "id": "dpe-energie",
    "titre": "DPE & performance énergétique",
    "icone": "🌡️",
    "categorie": "Juridique",
    "resume": "DPE opposable, seuils & double étiquette, réforme 2024, DPE collectif, audit de vente, interdictions de louer, RE2020 et aides.",
    "duree": "35 min",
    "lecons": [
      {
        "titre": "Le DPE : définition, contenu et valeur juridique",
        "contenu": [
          "Le **Diagnostic de Performance Énergétique (DPE)** classe un logement de **A** (très performant) à **G** (très énergivore). C'est aujourd'hui le diagnostic le plus scruté par les acquéreurs et les locataires : il pèse directement sur la **valeur**, la **louabilité** et parfois la **vendabilité** d'un bien.",
          "## Les deux étiquettes",
          "- L'**étiquette énergie** mesure la consommation d'énergie **primaire** (chauffage, eau chaude sanitaire, refroidissement, éclairage, auxiliaires) en **kWh/m²/an**.",
          "- L'**étiquette climat** mesure les émissions de gaz à effet de serre (**GES**) en **kg CO2/m²/an**.",
          "- La classe finale retient **la plus mauvaise des deux** : un logement bien isolé mais chauffé au fioul est pénalisé par ses émissions. On parle de **double seuil**.",
          "## Ce que contient un DPE",
          "- Les **consommations** et le **coût annuel théorique** d'énergie (fourchette en euros, avec l'année de référence des prix).",
          "- Les deux **étiquettes** (énergie et climat) et le détail des postes de consommation.",
          "- Les **caractéristiques du bâti** : isolation, menuiseries, système de chauffage, ventilation.",
          "- Une estimation du **confort d'été** (capacité à rester frais sans climatisation), critère clé en PACA.",
          "- Des **recommandations de travaux** chiffrées pour gagner des classes.",
          "- Un **numéro d'identification ADEME** unique, qui permet de vérifier le diagnostic en ligne.",
          "## Un diagnostic strictement encadré",
          "- Il doit être réalisé par un **diagnostiqueur certifié**, assuré et **indépendant** : aucun lien possible avec l'agence ni l'entreprise de travaux.",
          "- La méthode de calcul est **unifiée (3CL-DPE 2021)** et repose sur les **caractéristiques physiques du bâtiment**, non plus sur les factures : le **DPE « vierge » a disparu** depuis juillet 2021.",
          "- Le coefficient de conversion de l'électricité en énergie primaire est passé de 2,58 à **2,3**, ce qui a amélioré le classement de nombreux logements chauffés à l'électricité.",
          "## Validité : 10 ans, mais attention aux anciens DPE",
          "- Un DPE réalisé selon la méthode **2021 est valable 10 ans**.",
          "- Les DPE réalisés entre 2013 et 2017 ont expiré le **31 décembre 2022** ; ceux de 2018 à juin 2021, le **31 décembre 2024**.",
          "- Conséquence pratique : **depuis le 1er janvier 2025, tout DPE doit être un DPE « nouvelle méthode »**. Un DPE établi avant juillet 2021 et présenté aujourd'hui est **périmé**.",
          "## À retenir",
          "- Moyen mnémotechnique : **« la pire des deux lettres gagne »** — on ne regarde jamais l'énergie sans le climat.",
          "## Erreurs fréquentes",
          "- Diffuser une annonce avec un **DPE périmé** ou sans étiquette : c'est sanctionnable.",
          "- Confondre la **classe** (opposable) et les **recommandations de travaux** (indicatives).",
          "- Oublier de vérifier la **date** et le **numéro ADEME** du DPE avant de publier.",
          "## Mini cas pratique",
          "Un vendeur de Martigues vous remet un DPE daté de mars 2019. Vous vérifiez : réalisé avant juillet 2021, il est **périmé depuis le 31 décembre 2024**. Impossible de diffuser l'annonce avec. Réflexe : **commander un nouveau DPE** avant toute mise en vente, et en profiter pour bâtir l'argumentaire."
        ]
      },
      {
        "titre": "Lire les étiquettes : seuils, énergie primaire et double seuil",
        "contenu": [
          "Savoir **lire et expliquer** un DPE vous crédibilise face au client et vous évite les erreurs d'argumentaire. Voici les repères indispensables.",
          "## Les seuils des 7 classes (énergie primaire ET GES)",
          "- **A** : au plus 70 kWh/m²/an **et** au plus 6 kg CO2/m²/an.",
          "- **B** : au plus 110 kWh **et** au plus 11 kg CO2.",
          "- **C** : au plus 180 kWh **et** au plus 30 kg CO2.",
          "- **D** : au plus 250 kWh **et** au plus 50 kg CO2.",
          "- **E** : au plus 330 kWh **et** au plus 70 kg CO2.",
          "- **F** : au plus 420 kWh **et** au plus 100 kg CO2.",
          "- **G** : au-delà de 420 kWh **ou** de 100 kg CO2.",
          "## Le principe du double seuil",
          "Pour chaque classe, le logement doit respecter **les deux plafonds**. S'il dépasse l'un des deux, il **bascule dans la classe inférieure**. On retient toujours **la pire des deux étiquettes**.",
          "## Énergie primaire n'est pas énergie finale",
          "- L'**énergie finale** est celle que vous payez, celle qui entre dans le logement (le compteur).",
          "- L'**énergie primaire** ajoute les pertes de production et de transport : c'est elle qui sert à déterminer les **classes A à G**.",
          "- Piège : le seuil d'interdiction de louer de **2023 (450 kWh/m²/an) est exprimé en énergie FINALE**, pas primaire. Ne mélangez jamais les deux.",
          "## Les facteurs qui font bouger la note",
          "- La **zone climatique** et l'**altitude** : Martigues est en zone **H3 (climat méditerranéen, hivers doux)**, ce qui allège la part chauffage et produit souvent de meilleurs DPE qu'en zone froide.",
          "- En contrepartie, le **confort d'été** et la climatisation pèsent davantage dans notre région.",
          "- La **surface** du logement, le **type d'énergie**, la **qualité de l'isolation** et le **mode de production d'eau chaude**.",
          "## Mini cas pratique",
          "Un appartement affiche **200 kWh/m²/an** (zone C côté énergie) mais **60 kg CO2/m²/an** côté climat (chauffage au fioul). Le climat le classe **E**. Verdict : c'est un **E**, pas un **C**. Argument : « En remplaçant la chaudière fioul par une pompe à chaleur, on vise un gain de deux classes. »",
          "## Erreur fréquente",
          "- Annoncer la classe énergie en oubliant le climat : vous publiez alors une **classe erronée** dans l'annonce."
        ]
      },
      {
        "titre": "Le DPE opposable : responsabilité, litiges et sanctions",
        "contenu": [
          "Depuis le **1er juillet 2021** (loi ELAN / loi Climat), le DPE est **opposable**, au même titre que les autres diagnostics. Avant cette date, il n'avait qu'une **valeur informative**.",
          "## Ce que « opposable » change",
          "- Le **vendeur** (ou le bailleur) **engage sa responsabilité** sur les résultats du DPE.",
          "- Un acquéreur qui constate un **écart manifeste** entre le DPE annoncé et la réalité peut agir en justice.",
          "- Recours possibles : **dommages-intérêts**, voire **réduction du prix** de vente.",
          "## Qui est responsable",
          "- Le **diagnostiqueur certifié** engage sa responsabilité professionnelle : il est **assuré** pour cela.",
          "- Le **vendeur** ou le **bailleur** reste responsable vis-à-vis de l'acquéreur ou du locataire.",
          "- En pratique, c'est souvent le diagnostiqueur, via son assurance, qui indemnise une erreur de calcul.",
          "## Ce qui reste indicatif",
          "- Seules les **étiquettes et les consommations** sont opposables.",
          "- Les **recommandations de travaux** gardent une valeur de **simple conseil** : elles ne sont pas opposables.",
          "## Le rôle de l'agent : vigilance",
          "- Vérifier la **validité** (DPE nouvelle méthode, non périmé) et la présence du **numéro ADEME**.",
          "- S'assurer de la **cohérence** : une maison ancienne non isolée classée B doit vous alerter.",
          "- Ne jamais diffuser une annonce avec une **classe fausse ou absente**.",
          "## Deux niveaux de sanction à ne pas confondre",
          "- **Annonce non conforme** (DPE manquant, périmé ou classe non affichée) : **amende administrative** de la DGCCRF pouvant atteindre **3 000 € pour une personne physique** et **15 000 € pour une personne morale**.",
          "- **DPE délibérément faux ou trompeur** présenté à l'acquéreur ou au locataire : cela relève de la **pratique commerciale trompeuse**, passible de sanctions **pénales** lourdes (jusqu'à **2 ans d'emprisonnement** et une amende pouvant atteindre **300 000 €**, montant pouvant être porté à un pourcentage du chiffre d'affaires).",
          "## Mini cas pratique",
          "Deux mois après l'achat, un acquéreur fait refaire le DPE : la maison ressort en **F** au lieu du **D** annoncé. Il peut se retourner contre le vendeur et le diagnostiqueur. Réflexe agent : **conserver la preuve** d'un DPE réalisé par un professionnel certifié et ne jamais « arranger » une classe pour vendre.",
          "## Erreur fréquente",
          "- Croire qu'un DPE « c'est juste indicatif » : depuis 2021, c'est **juridiquement engageant**."
        ]
      },
      {
        "titre": "Réforme 2024 des petites surfaces & DPE collectif en copropriété",
        "contenu": [
          "Deux évolutions récentes doivent être maîtrisées : la **réforme des petits logements (2024)** et l'arrivée du **DPE collectif** en copropriété.",
          "## La réforme des petites surfaces (1er juillet 2024)",
          "- La méthode 3CL **pénalisait injustement les logements de 40 m² ou moins** : le poids de l'eau chaude sanitaire était surévalué dans le calcul.",
          "- Depuis le **1er juillet 2024**, un **coefficient correcteur** a été appliqué : environ **140 000 logements** sont **sortis du statut de passoire** (F/G).",
          "- Pour un DPE de petit logement réalisé **avant** cette date, une **nouvelle attestation** peut être éditée gratuitement (générateur de l'ADEME) **sans refaire le diagnostic**, lorsque le recalcul le permet.",
          "## Pourquoi c'est un argument",
          "- Un studio classé **F** avant juillet 2024 peut être **reclassé E** et redevenir **louable** : vérifiez toujours si le DPE est antérieur à la réforme.",
          "## Le DPE collectif en copropriété",
          "- Obligatoire pour les **copropriétés à usage principal d'habitation** dont le permis de construire est antérieur au **1er janvier 2013**.",
          "- Il porte sur **l'immeuble entier** et nourrit les décisions de travaux, notamment le **projet de plan pluriannuel de travaux (PPT)**.",
          "## Le calendrier du DPE collectif",
          "- **Immeubles en mono-propriété et copropriétés de plus de 200 lots** : depuis le **1er janvier 2024**.",
          "- **Copropriétés de 50 à 200 lots** : depuis le **1er janvier 2025**.",
          "- **Copropriétés de 50 lots ou moins** : depuis le **1er janvier 2026**.",
          "- Il est **renouvelé ou mis à jour tous les 10 ans**, sauf si un DPE postérieur à juillet 2021 établit que l'immeuble est classé **A, B ou C**.",
          "## DPE collectif n'est pas DPE individuel",
          "- Le **DPE collectif** porte sur l'immeuble ; le **DPE individuel** reste obligatoire pour **vendre ou louer un lot**.",
          "- Le DPE collectif peut toutefois **faciliter et fiabiliser** le DPE d'un lot grâce aux données communes du bâti.",
          "## Mini cas pratique",
          "Vous rentrez un studio de 28 m² à Martigues classé **F** sur un DPE de 2022. Avant de le présenter comme « non louable », vous vérifiez la **réforme 2024** : réédition de l'attestation, le studio ressort en **E**. Il redevient **louable** et vous ajustez immédiatement l'argumentaire et le prix.",
          "## Erreur fréquente",
          "- Appliquer les interdictions de louer à un **petit logement** sans avoir vérifié s'il bénéficie du **recalcul 2024**."
        ]
      },
      {
        "titre": "Mentions obligatoires : l'annonce et le dossier de diagnostics (DDT)",
        "contenu": [
          "Le DPE n'est pas qu'une formalité de signature : il doit apparaître **dès l'annonce**, sous peine de sanction, et s'intègre au **dossier de diagnostics techniques (DDT)**.",
          "## Ce que l'annonce doit afficher",
          "- Les **deux étiquettes** : classe **énergie** et classe **climat** (les deux lettres).",
          "- L'estimation du **coût annuel théorique d'énergie** (fourchette min–max, avec l'année de référence des prix), **obligatoire depuis le 1er janvier 2022**.",
          "- Pour un bien classé **F ou G** : la mention **« logement à consommation énergétique excessive »**.",
          "## Le format imposé de l'étiquette",
          "- Dans une **annonce en ligne**, l'étiquette doit être **lisible, en couleur** et d'une taille au moins équivalente à **180 x 180 pixels**.",
          "- En **vitrine d'agence**, elle doit représenter **au moins 5 %** de la surface du support.",
          "- En **presse écrite**, à défaut d'étiquette, la **classe énergie (A à G)** précédée de la mention « classe énergie » suffit.",
          "## Pour une annonce de location",
          "- Les mêmes étiquettes, plus les conséquences du **gel des loyers** pour les F/G.",
          "- Un **G est non louable** depuis 2025 : l'annonce de location d'un G est juridiquement sans objet.",
          "## Le dossier de diagnostics techniques (DDT)",
          "- Il regroupe, selon le bien : **DPE**, **amiante**, **plomb (CREP)**, état des installations **gaz** et **électricité** (si plus de 15 ans), **ERP** (état des risques), **termites** (en zone), **assainissement non collectif**, mesurage **loi Carrez** (copropriété), état parasitaire, et l'**audit énergétique** si le bien y est soumis.",
          "- Le DDT est **annexé au compromis** puis à l'**acte authentique**.",
          "## Sanction en cas d'annonce non conforme",
          "- DPE manquant, périmé ou classe erronée dans l'annonce : **amende administrative jusqu'à 3 000 € (personne physique) / 15 000 € (personne morale)**, voire des poursuites pour **pratique trompeuse** en cas d'information mensongère.",
          "## Script agent face au vendeur",
          "« Avant même la première photo, la loi m'oblige à afficher vos deux étiquettes et le coût énergétique annuel. C'est aussi un **argument de transparence** : un acquéreur rassuré fait une offre plus vite. »",
          "## Mini cas pratique",
          "Un confrère diffuse un bien **sans l'étiquette climat** et sans le coût annuel. En plus du **risque d'amende**, l'annonce **convertit moins** : l'acquéreur se méfie. Vous, vous publiez une annonce **complète** dès le départ.",
          "## Erreur fréquente",
          "- Afficher la classe énergie en **oubliant la classe climat** ou le **coût annuel d'énergie**."
        ]
      },
      {
        "titre": "L'audit énergétique de vente",
        "contenu": [
          "À ne pas confondre avec le DPE : l'**audit énergétique réglementaire** est exigé pour **vendre** les logements les plus énergivores. Il est **plus détaillé** et oriente vers une rénovation.",
          "## Qui est concerné",
          "- La **vente** d'une **maison individuelle** ou d'un **immeuble entier en mono-propriété** à usage d'habitation.",
          "- Classé parmi les plus énergivores (voir le calendrier).",
          "- **Non concerné** : la vente d'un **lot de copropriété** — c'est le DPE, pas l'audit, qui s'applique au lot.",
          "## Calendrier d'entrée en vigueur",
          "- **Classes F et G** : depuis le **1er avril 2023**.",
          "- **Classe E** : depuis le **1er janvier 2025**.",
          "- **Classe D** : à compter du **1er janvier 2034**.",
          "- Mnémotechnique : l'audit **descend l'échelle** des classes au fil du temps (F/G, puis E, puis D).",
          "## Quand et comment le remettre",
          "- Remis à l'acquéreur **dès la première visite**, puis **annexé au compromis** et à l'**acte**.",
          "- Réalisé par un **professionnel qualifié** ; **valable 5 ans**.",
          "- En général **à la charge du vendeur**.",
          "## Ce que contient l'audit",
          "- Un **état des lieux** énergétique du bien.",
          "- Au moins **deux scénarios de travaux** : une **première étape** permettant d'atteindre au moins la **classe E**, puis un parcours complet visant **la classe B** (voire A).",
          "- L'estimation des **coûts**, des **économies d'énergie** et des **aides** mobilisables.",
          "- Il **informe** l'acquéreur **sans l'obliger** à réaliser les travaux.",
          "## Ne pas confondre trois documents",
          "- Le **DPE** (tous les biens, valable 10 ans).",
          "- L'**audit réglementaire de vente** (maisons et immeubles F/G/E, valable 5 ans).",
          "- L'**audit MaPrimeRénov'** exigé pour une **rénovation d'ampleur** subventionnée.",
          "## Mini cas pratique",
          "Vous rentrez une maison classée **F** à Martigues. Vous **anticipez l'audit** avant la première visite : l'acquéreur découvre qu'avec environ **35 000 €** de travaux (isolation + pompe à chaleur), le bien peut viser le **D**, aides déduites. L'audit **désamorce la peur** des travaux et **sécurise** l'offre.",
          "## Erreur fréquente",
          "- Attendre le compromis pour produire l'audit : il doit être **disponible dès la première visite**."
        ]
      },
      {
        "titre": "Passoires thermiques : calendrier location & décence énergétique",
        "contenu": [
          "La **loi Climat et résilience (2021)** fait du DPE un **critère de décence** du logement : les plus énergivores deviennent progressivement **interdits à la location**.",
          "## Le calendrier des interdictions de louer",
          "- **Depuis le 1er janvier 2023** : les logements consommant plus de **450 kWh/m²/an d'énergie finale** (les pires des G).",
          "- **Depuis le 1er janvier 2025** : **classe G**.",
          "- **1er janvier 2028** : **classe F**.",
          "- **1er janvier 2034** : **classe E**.",
          "- Mnémotechnique : **G–F–E = 25–28–34**.",
          "## À qui s'applique l'interdiction",
          "- Aux **nouveaux baux**, aux **renouvellements** et aux **reconductions tacites** à compter de chaque date.",
          "- Les **baux en cours ne sont pas rompus**, mais le logement doit être **décent au renouvellement**.",
          "- Elle concerne la **résidence principale** (location nue ou meublée) en **France métropolitaine**.",
          "## Outre-mer : un calendrier décalé",
          "- Dans les **DROM**, l'interdiction démarre plus tard (**G en 2028, F en 2031**), avec des seuils adaptés au climat tropical.",
          "## Le gel des loyers des passoires",
          "- Depuis le **24 août 2022**, il est **interdit d'augmenter le loyer** d'un logement **F ou G** : pas de révision par l'**IRL**, pas de réévaluation au renouvellement, pas de hausse après travaux tant que le bien reste F/G.",
          "## Location n'est pas vente",
          "- Ces règles **n'interdisent pas de vendre** une passoire : elles pèsent sur sa **valeur** et sur l'argumentaire (« non louable en l'état »).",
          "## Le cas de la copropriété",
          "- Un propriétaire bailleur en copropriété dépend souvent de **travaux en parties communes** qu'il ne décide pas seul : c'est un vrai frein, à anticiper avec le syndic et le **DPE collectif**.",
          "## Mini cas pratique",
          "Un investisseur veut louer un **G** à Martigues en 2026 : impossible, le bien est **non louable**. Deux options : **rénover** pour viser au moins **E** avant de louer, ou **acheter décoté** pour transformer. Vous l'orientez vers les aides et un **DPE projeté**.",
          "## Erreurs fréquentes",
          "- Croire que l'interdiction de louer **casse les baux en cours** : non, elle joue au **renouvellement** et aux **nouveaux contrats**.",
          "- Confondre le seuil **450 kWh (énergie finale)** de 2023 avec les seuils de classes (énergie primaire)."
        ]
      },
      {
        "titre": "Valeur verte & argumentaire commercial",
        "contenu": [
          "Le DPE est devenu un **levier de prix** et de négociation. La **« valeur verte »** mesure l'effet du DPE sur le prix d'un bien — un argument à manier avec des faits.",
          "## Ce que dit la valeur verte",
          "- Selon les études des **Notaires de France**, un logement **F ou G** se vend **décoté** par rapport à un **D** équivalent ; un **A/B** bénéficie d'une **surcote**.",
          "- L'écart varie fortement selon la région : de l'ordre de **quelques pour-cent à plus de 15 %** de décote pour les passoires.",
          "- En **PACA / zone H3**, l'effet chauffage est plus modéré qu'au nord, mais la pression monte à mesure que les interdictions avancent.",
          "## Argumentaire face à un vendeur de passoire",
          "- Jouer la **transparence et l'anticipation** : « Le marché intègre déjà le coût des travaux. Au bon prix, on vend **avant** le prochain durcissement du calendrier. »",
          "- Éviter la **surévaluation** : un F/G surévalué **ne se vend pas** et cumule les baisses (voir module Estimation).",
          "- Positionner le **prix net** en tenant compte du **coût des travaux** et des **aides**.",
          "## Argumentaire face à un acquéreur ou investisseur",
          "- Transformer la passoire en **opportunité** : prix d'entrée plus bas, **négociation** sur les travaux, **aides** mobilisables, **plus-value** après rénovation.",
          "- Présenter un **DPE projeté** (simulation de la classe **après travaux**) pour matérialiser le potentiel.",
          "## Scripts utiles",
          "- Au vendeur : « Votre bien est classé **F**. Deux chemins : on le vend **au prix du marché d'aujourd'hui**, ou on attend que le calendrier le rende plus difficile à céder. Mon rôle, c'est de le vendre **maintenant**, au mieux. »",
          "- À l'acquéreur : « Oui, il y a des travaux. Mais entre la **décote** à l'achat, les **aides** et la **valeur après rénovation**, c'est souvent **l'affaire la plus rentable** du secteur. »",
          "## Mini cas pratique",
          "Maison **G** affichée 300 000 €. Travaux estimés 40 000 € (audit), aides d'environ 15 000 €. Vous négociez un prix d'achat à **270 000 €** : l'acquéreur rénove pour un reste à charge d'environ 25 000 €, vise la classe **D** et une maison qui vaudra bien plus qu'un **G** à la revente. Tout le monde y gagne.",
          "## Erreur fréquente",
          "- Parler des travaux comme d'un **problème** plutôt que comme d'un **projet chiffré et aidé**."
        ]
      },
      {
        "titre": "Aides à la rénovation & accompagner le client",
        "contenu": [
          "Savoir **orienter** vers les bonnes aides fait de vous un conseiller, pas seulement un vendeur. Vous ne vous **substituez pas** à un conseiller France Rénov' ni à un expert fiscal, mais vous **ouvrez les bonnes portes**.",
          "## Le guichet unique : France Rénov'",
          "- Service public **gratuit** d'information et de conseil, avec des **conseillers** locaux.",
          "- Depuis 2025, un **rendez-vous préalable avec un conseiller France Rénov'** est **obligatoire** avant une demande de rénovation d'ampleur.",
          "- Pour une rénovation d'ampleur, le recours à **Mon Accompagnateur Rénov' (MAR)** agréé est **obligatoire**.",
          "## Les principales aides (2024-2026)",
          "- **MaPrimeRénov'** : aide de l'État, en deux parcours — **par geste** (un ou plusieurs travaux) et **parcours accompagné** pour une **rénovation d'ampleur**.",
          "- Le **parcours accompagné** est désormais réservé aux logements classés **E, F ou G**, vise un gain d'au moins **2 classes** DPE et impose **audit** et **MAR**.",
          "- **Éco-PTZ** : prêt à **0 %** jusqu'à **50 000 €** pour une rénovation performante, remboursable sur **20 ans**, **prolongé jusqu'au 31 décembre 2027**.",
          "- **Certificats d'économie d'énergie (CEE)** : primes versées par les fournisseurs d'énergie.",
          "- **TVA à 5,5 %** sur les travaux d'amélioration de la performance énergétique.",
          "- **Exonération possible de taxe foncière** (jusqu'à 3 ans) votée par certaines communes pour les travaux d'économie d'énergie.",
          "- Pour l'investisseur : le dispositif **Denormandie** (réduction d'impôt de **12 %, 18 % ou 21 %** selon la durée de location, pour l'ancien rénové avec des travaux d'au moins **25 % du coût total**), **prolongé jusqu'au 31 décembre 2027**.",
          "## Attention aux barèmes",
          "- Les **montants et conditions de MaPrimeRénov' évoluent chaque année** (loi de finances) et ont connu des **ajustements en 2025-2026** : vérifiez toujours le **barème en vigueur** sur France Rénov' avant d'annoncer un chiffre à un client.",
          "## Le DPE après travaux",
          "- Après rénovation, un **nouveau DPE** (ou une attestation) matérialise le **gain de classes** : c'est un argument de **revente** et, pour le bailleur, la **sortie du statut de passoire**.",
          "## Le rôle de l'agent",
          "- **Identifier** le potentiel (DPE projeté), **orienter** vers France Rénov' et des **artisans RGE** partenaires, **chiffrer** l'opération dans l'argumentaire.",
          "- Ne jamais **promettre un montant d'aide précis** sans vérification : on parle de **fourchettes** et on renvoie au conseiller.",
          "## Mini cas pratique",
          "Maison classée **G** à Martigues, 90 m². Scénario d'audit : isolation + pompe à chaleur + ventilation, environ **38 000 €**. Entre **MaPrimeRénov' parcours accompagné**, **CEE** et **éco-PTZ**, le reste à charge est fortement réduit et étalé à **0 %**. Objectif : passer de **G à D**, rendre le bien **louable** et **revalorisé**.",
          "## Erreur fréquente",
          "- Confondre les aides : **MaPrimeRénov'** (subvention) n'est ni l'**éco-PTZ** (prêt) ni les **CEE** (primes privées) — elles se **cumulent** sous conditions."
        ]
      },
      {
        "titre": "Cas particuliers, exemptions et performance du neuf (RE2020)",
        "contenu": [
          "Tous les biens ne sont pas logés à la même enseigne face au DPE. Connaître les **exemptions** et les règles du **neuf** évite des erreurs de conseil.",
          "## Les biens non soumis au DPE",
          "- Les **constructions provisoires** prévues pour une durée d'utilisation de **moins de 2 ans**.",
          "- Les **bâtiments indépendants** dont la surface de plancher est **inférieure à 50 m²**.",
          "- Les **lieux de culte** et les **monuments historiques** classés ou inscrits.",
          "- Les **bâtiments agricoles, artisanaux ou industriels** à faible besoin énergétique.",
          "- Les logements **chauffés moins de 4 mois par an** ou **sans système de chauffage fixe** (cas rare, à faire confirmer par le diagnostiqueur).",
          "## Le DPE n'est pas une estimation de consommation réelle",
          "- Le DPE repose sur un **usage standardisé** (température, occupation, climat de référence).",
          "- La **consommation réelle** d'un foyer peut donc différer : on explique au client que le DPE est un **repère de comparaison**, pas sa future facture exacte.",
          "## La performance du neuf : la RE2020",
          "- Depuis le **1er janvier 2022**, la **Réglementation Environnementale 2020 (RE2020)** remplace la RT2012 pour les **constructions neuves**.",
          "- Elle vise trois objectifs : **sobriété énergétique**, réduction de l'**empreinte carbone** (matériaux et énergie) et amélioration du **confort d'été**.",
          "- Un logement neuf conforme ressort en général en classe **A ou B** au DPE.",
          "## Vendre dans le neuf",
          "- En **VEFA**, le logement est livré conforme à la RE2020 ; le **DPE** est établi **à la livraison** du bien achevé.",
          "- Argument acquéreur : un bien neuf **très performant** échappe aux contraintes des passoires et affiche des **charges énergétiques faibles**.",
          "## Mini cas pratique",
          "Un client hésite entre une maison ancienne classée **F** à rénover et une **VEFA** classée **A** un peu plus chère. Vous posez les deux équations : coût des travaux et aides pour l'ancien, charges quasi nulles et zéro contrainte passoire pour le neuf. Le choix devient **rationnel**, pas émotionnel.",
          "## Erreur fréquente",
          "- Promettre une **exemption de DPE** sans vérifier : les cas sont **limitativement listés** et doivent être confirmés par le diagnostiqueur."
        ]
      },
      {
        "titre": "Mémo de l'agent : sécuriser chaque mandat avec le DPE",
        "contenu": [
          "Voici la **synthèse opérationnelle** : les réflexes à dérouler à chaque étape pour transformer le DPE en **atout** et éviter tout litige.",
          "## À la rentrée du mandat",
          "- Récupérer le **DPE** et vérifier sa **date** : antérieur à juillet 2021 = **périmé**, à refaire.",
          "- Contrôler le **numéro ADEME** et la **cohérence** de la classe avec l'état réel du bien.",
          "- Pour un **petit logement (40 m² ou moins)** classé F/G avant juillet 2024 : vérifier le **recalcul 2024**.",
          "- Pour une maison ou un immeuble **F, G ou E** : prévoir l'**audit énergétique** de vente.",
          "## Avant de diffuser l'annonce",
          "- Afficher les **deux étiquettes** (énergie **et** climat) et le **coût annuel d'énergie**.",
          "- Ajouter la mention **« logement à consommation énergétique excessive »** si **F ou G**.",
          "- Respecter le **format** de l'étiquette (couleur, taille minimale).",
          "## En location",
          "- Vérifier que le bien n'est **pas interdit à la location** à la date du bail (**G depuis 2025**).",
          "- Rappeler le **gel des loyers** pour les **F et G**.",
          "## Avant le compromis",
          "- Intégrer le **DPE** et, le cas échéant, l'**audit** au **dossier de diagnostics techniques (DDT)**.",
          "- S'assurer que le **DDT complet** est annexé au compromis puis à l'acte.",
          "## Les 5 réflexes anti-litige",
          "- Toujours un **DPE valide** et **cohérent** avant publication.",
          "- Ne **jamais arranger** une classe : le DPE est **opposable**.",
          "- **Tracer** l'intervention d'un diagnostiqueur **certifié et assuré**.",
          "- **Informer** le client sur les interdictions de louer et le calendrier.",
          "- Renvoyer vers **France Rénov'** pour les aides, sans promettre de montant précis.",
          "## Script de synthèse au client",
          "« Le DPE n'est plus une formalité : il fixe la **valeur**, la **louabilité** et le **calendrier** de votre bien. Mon travail, c'est de partir d'un **diagnostic fiable** et d'en faire un **argument de vente**, pas un frein. »",
          "## Mini cas pratique",
          "Nouveau mandat sur un appartement à Martigues : en 20 minutes, vous déroulez la **checklist** — DPE 2023 valide, numéro ADEME vérifié, classe **D** cohérente, étiquettes et coût annuel prêts pour l'annonce. Le mandat est **sécurisé** avant la première photo.",
          "## Erreur fréquente",
          "- Lancer la commercialisation **sans avoir déroulé la checklist** : c'est là que naissent les litiges et les annonces non conformes."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Durée de validité d'un DPE récent (méthode 2021) ?",
        "options": [
          "3 ans",
          "5 ans",
          "10 ans",
          "À vie"
        ],
        "correct": 2,
        "explication": "10 ans pour un DPE réalisé selon la méthode 2021 ; les DPE établis avant juillet 2021 sont tous périmés depuis le 1er janvier 2025."
      },
      {
        "question": "La classe DPE finalement retenue correspond à…",
        "options": [
          "La meilleure des deux étiquettes",
          "La plus mauvaise des deux étiquettes (énergie et climat)",
          "Uniquement l'énergie",
          "Uniquement le climat"
        ],
        "correct": 1,
        "explication": "Principe du double seuil : on retient la pire des deux étiquettes (énergie primaire et GES). Un bien peut être classé E par le climat même s'il est C en énergie."
      },
      {
        "question": "Depuis quand le DPE est-il opposable ?",
        "options": [
          "2011",
          "1er juillet 2021",
          "2024",
          "Il ne l'est pas"
        ],
        "correct": 1,
        "explication": "Opposable depuis le 1er juillet 2021 : la responsabilité du vendeur/bailleur et du diagnostiqueur est engagée sur les étiquettes et consommations ; les recommandations de travaux restent indicatives."
      },
      {
        "question": "Depuis 2025, quelle classe est interdite à la location ?",
        "options": [
          "E",
          "F",
          "G",
          "D"
        ],
        "correct": 2,
        "explication": "Classe G interdite à la location depuis le 1er janvier 2025 (après les plus de 450 kWh/m²/an d'énergie finale depuis 2023) ; F en 2028, E en 2034."
      },
      {
        "question": "L'audit énergétique réglementaire de vente concerne, depuis le 1er janvier 2025…",
        "options": [
          "Les classes A et B",
          "Les classes F et G uniquement",
          "La classe E, en plus des F et G",
          "Tous les logements"
        ],
        "correct": 2,
        "explication": "F/G depuis le 1er avril 2023, E depuis le 1er janvier 2025, D à compter de 2034. Il vise les maisons individuelles et immeubles entiers en mono-propriété, pas les lots de copropriété."
      },
      {
        "question": "Qu'a changé la réforme du 1er juillet 2024 ?",
        "options": [
          "Elle a supprimé le DPE",
          "Elle a porté sa validité à 15 ans",
          "Elle a corrigé le calcul des logements de 40 m² ou moins, reclassant environ 140 000 d'entre eux",
          "Elle a rendu le DPE facultatif"
        ],
        "correct": 2,
        "explication": "Le recalcul des petites surfaces (40 m² ou moins) a sorti environ 140 000 logements du statut de passoire ; une attestation peut être rééditée sans refaire le diagnostic."
      },
      {
        "question": "Le seuil d'interdiction de louer de 2023 (450 kWh/m²/an) est exprimé en…",
        "options": [
          "Énergie primaire",
          "Énergie finale",
          "Kilogrammes de CO2",
          "Euros par an"
        ],
        "correct": 1,
        "explication": "Ce seuil de 2023 s'exprime en énergie FINALE, alors que les classes A à G du DPE reposent sur l'énergie PRIMAIRE. Ne jamais confondre les deux unités."
      },
      {
        "question": "Parmi ces aides, laquelle est un prêt à taux zéro, et non une subvention ?",
        "options": [
          "MaPrimeRénov'",
          "L'éco-PTZ",
          "Les CEE",
          "La TVA à 5,5 %"
        ],
        "correct": 1,
        "explication": "L'éco-PTZ est un prêt à 0 % (jusqu'à 50 000 €, sur 20 ans, prolongé jusqu'au 31 décembre 2027). MaPrimeRénov' est une subvention, les CEE des primes privées et la TVA à 5,5 % un taux réduit ; ces aides se cumulent sous conditions."
      },
      {
        "question": "Pour un logement classé F ou G déjà loué, le propriétaire peut-il augmenter le loyer ?",
        "options": [
          "Oui, normalement via l'IRL",
          "Non, les loyers des passoires F/G sont gelés depuis le 24 août 2022",
          "Oui, seulement après travaux",
          "Oui, uniquement au renouvellement du bail"
        ],
        "correct": 1,
        "explication": "Depuis le 24 août 2022, les loyers des passoires F et G sont gelés : pas de révision par l'IRL, pas de réévaluation au renouvellement, pas de hausse après travaux tant que le bien reste F ou G."
      },
      {
        "question": "L'étiquette énergie du DPE mesure la consommation en…",
        "options": [
          "Kilowattheures d'énergie primaire par m² et par an",
          "Kilogrammes de CO2 par m² et par an",
          "Euros par mois",
          "Litres de fioul par an"
        ],
        "correct": 0,
        "explication": "L'étiquette énergie exprime la consommation d'énergie primaire en kWh/m²/an ; l'étiquette climat, elle, mesure les émissions de GES."
      },
      {
        "question": "Depuis juillet 2021, avec la méthode 3CL-DPE 2021, le DPE « vierge » (établi à partir des factures)…",
        "options": [
          "Est devenu la norme",
          "A disparu",
          "N'est autorisé qu'en copropriété",
          "Reste valable 10 ans"
        ],
        "correct": 1,
        "explication": "La méthode unifiée 3CL-DPE 2021 repose sur les caractéristiques physiques du bâtiment : le DPE vierge a disparu."
      },
      {
        "question": "Le coefficient de conversion de l'électricité en énergie primaire est passé de 2,58 à…",
        "options": [
          "1,0",
          "2,3",
          "2,5",
          "3,0"
        ],
        "correct": 1,
        "explication": "Le passage de 2,58 à 2,3 a amélioré le classement de nombreux logements chauffés à l'électricité."
      },
      {
        "question": "Pour être classé A, un logement doit respecter au plus…",
        "options": [
          "110 kWh/m²/an et 11 kg CO2/m²/an",
          "70 kWh/m²/an et 6 kg CO2/m²/an",
          "180 kWh/m²/an et 30 kg CO2/m²/an",
          "70 kWh/m²/an seulement"
        ],
        "correct": 1,
        "explication": "La classe A exige au plus 70 kWh/m²/an ET au plus 6 kg CO2/m²/an : les deux seuils doivent être respectés."
      },
      {
        "question": "À quelle date la classe F sera-t-elle interdite à la location (résidence principale, métropole) ?",
        "options": [
          "1er janvier 2025",
          "1er janvier 2028",
          "1er janvier 2031",
          "1er janvier 2034"
        ],
        "correct": 1,
        "explication": "Le calendrier des interdictions est G en 2025, F en 2028 et E en 2034 (mnémo G-F-E = 25-28-34)."
      },
      {
        "question": "Depuis le 24 août 2022, pour un logement classé F ou G, le bailleur…",
        "options": [
          "Peut augmenter le loyer avec l'IRL",
          "Ne peut plus augmenter le loyer (gel des loyers)",
          "Peut le louer sans restriction",
          "Doit doubler le dépôt de garantie"
        ],
        "correct": 1,
        "explication": "Les loyers des passoires F et G sont gelés : ni révision IRL, ni réévaluation au renouvellement, ni hausse après travaux tant que le bien reste F/G."
      },
      {
        "question": "Le DPE collectif est obligatoire pour les copropriétés à usage principal d'habitation dont le permis de construire est antérieur au…",
        "options": [
          "1er janvier 1997",
          "1er janvier 2005",
          "1er janvier 2013",
          "1er juillet 2021"
        ],
        "correct": 2,
        "explication": "Le DPE collectif concerne les copropriétés d'habitation dont le permis est antérieur au 1er janvier 2013."
      },
      {
        "question": "Depuis le 1er janvier 2022, toute annonce doit afficher, outre les deux étiquettes…",
        "options": [
          "Le nom du diagnostiqueur",
          "L'estimation du coût annuel théorique d'énergie",
          "La taxe foncière du bien",
          "Le montant des charges de copropriété"
        ],
        "correct": 1,
        "explication": "Depuis le 1er janvier 2022, l'annonce doit indiquer l'estimation du coût annuel théorique d'énergie (fourchette min-max)."
      },
      {
        "question": "Un logement classé F ou G doit porter dans l'annonce la mention…",
        "options": [
          "« Bien à rénover »",
          "« Logement à consommation énergétique excessive »",
          "« Logement non conforme »",
          "« Passoire thermique »"
        ],
        "correct": 1,
        "explication": "La mention obligatoire pour un F ou un G est « logement à consommation énergétique excessive »."
      },
      {
        "question": "L'audit énergétique réglementaire de vente concerne…",
        "options": [
          "Tout lot de copropriété vendu",
          "Les maisons individuelles et immeubles entiers en mono-propriété les plus énergivores",
          "Uniquement les biens neufs",
          "Tous les logements, comme le DPE"
        ],
        "correct": 1,
        "explication": "L'audit de vente vise les maisons individuelles et immeubles en mono-propriété énergivores ; la vente d'un lot de copropriété relève du DPE, pas de l'audit."
      },
      {
        "question": "La réforme du 1er juillet 2024 a appliqué un coefficient correcteur aux logements de…",
        "options": [
          "40 m² ou moins",
          "50 à 100 m²",
          "Plus de 100 m²",
          "Toutes surfaces"
        ],
        "correct": 0,
        "explication": "La méthode pénalisait injustement les petits logements de 40 m² ou moins ; un coefficient correcteur a sorti environ 140 000 d'entre eux du statut de passoire."
      },
      {
        "question": "Depuis le 1er janvier 2022, un logement neuf construit selon la RE2020 ressort en général au DPE en classe…",
        "options": [
          "A ou B",
          "C ou D",
          "E",
          "F ou G"
        ],
        "correct": 0,
        "explication": "La RE2020, qui remplace la RT2012 pour le neuf, conduit généralement à un classement A ou B au DPE."
      }
    ]
  },
  {
    "id": "mental-performance",
    "titre": "Mental & performance du négociateur",
    "icone": "🧠",
    "categorie": "Commercial",
    "resume": "Mindset, gestion du refus, du stress et du temps, confiance, négociation et habitudes durables : le mental qui fait la différence.",
    "duree": "43 min",
    "lecons": [
      {
        "titre": "L'état d'esprit des top performers",
        "contenu": [
          "À compétences égales, c'est le **mental** qui sépare les meilleurs des moyens. Dans une même agence, deux négociateurs avec les mêmes outils, le même secteur et le même fichier peuvent faire du simple au triple : la différence se joue dans la tête, pas dans le marché.",
          "## Les 3 piliers de l'état d'esprit gagnant",
          "- **Responsabilité** : le top performer ne cherche pas d'excuses (marché, prix, conjoncture, concurrence, taux). Il se demande « Que puis-je faire, moi, dès aujourd'hui ? » plutôt que « À qui la faute ? ».",
          "- **Optimisme réaliste** : il croit au résultat tout en agissant sur les faits. Il ne se ment pas sur un bien surévalué, mais reste convaincu qu'il trouvera une solution.",
          "- **Orientation action** : il préfère un appel imparfait lancé à une préparation parfaite jamais aboutie. « Fait » vaut mieux que « parfait ».",
          "## Locus de contrôle interne",
          "On distingue deux profils : ceux qui pensent que leur réussite dépend d'eux (**locus interne**) et ceux qui l'attribuent aux circonstances (**locus externe**). Les top performers ont un locus interne : ils se concentrent sur ce qu'ils **maîtrisent** (leurs actions, leur préparation, leur attitude) et lâchent prise sur le reste (les taux de crédit, la météo économique, la décision finale du client).",
          "## Le cercle d'influence",
          "Stephen Covey distingue le **cercle des préoccupations** (tout ce qui nous inquiète) et le **cercle d'influence** (ce sur quoi on peut vraiment agir). Le médiocre s'épuise dans le premier ; le top performer investit son énergie dans le second, et son cercle d'influence s'élargit avec le temps.",
          "## Mentalité de croissance vs mentalité figée",
          "La psychologue **Carol Dweck** a montré la différence entre la **mentalité figée** (« je suis mauvais au téléphone, c'est comme ça ») et la **mentalité de croissance** (« je ne suis **pas encore** bon au téléphone, je progresse »). Ajoutez systématiquement « pas encore » à vos limites : c'est le levier de la progression.",
          "## L'échec vu comme un retour d'information",
          "Dans une mentalité de croissance, un entretien raté n'est pas un verdict sur votre valeur, mais une **information** : il vous dit précisément quoi travailler. L'erreur n'est pas l'ennemie de la réussite, elle en est un ingrédient.",
          "## L'activité crée le résultat",
          "La vente est un **jeu de nombres** : plus de contacts donnent plus de RDV, donc plus de mandats, donc plus de ventes. Quand le résultat baisse, le réflexe du médiocre est de **réduire** l'activité (par découragement) ; celui du top performer est de l'**augmenter**.",
          "## Protéger son mental des parasites",
          "Le mental se nourrit de ce qu'on lui donne. Limitez les sources de négativité (collègues défaitistes, actualités anxiogènes à longueur de journée, ruminations du soir) et entourez-vous de personnes qui tirent vers le haut. Votre niveau, c'est souvent la moyenne des personnes que vous côtoyez le plus.",
          "## Erreurs fréquentes",
          "- Se comparer aux autres plutôt qu'à soi-même d'hier.",
          "- Confondre une mauvaise journée avec une mauvaise carrière.",
          "- Attendre la motivation pour agir, alors que c'est l'action qui crée la motivation.",
          "## Cas pratique",
          "Dans une agence de Martigues, Julie enchaîne 3 estimations sans mandat signé. Mentalité figée : « Je ne suis pas faite pour ça. » Mentalité de croissance : « Qu'ai-je raté dans ces 3 RDV ? La découverte ? La preuve de prix ? » Elle rejoue ses entretiens, identifie qu'elle n'a jamais traité l'objection prix, s'entraîne, et signe le 4e. Même situation, deux issues : tout s'est joué dans l'interprétation."
        ]
      },
      {
        "titre": "Gérer le refus, le « non » et la pression",
        "contenu": [
          "Le refus fait partie du métier : sur 10 contacts de prospection, 8 ou 9 diront « non ». Un « non » n'est pas un échec, c'est une **étape statistique** inévitable sur le chemin du « oui ».",
          "## Dissocier le refus de soi",
          "Quand un prospect raccroche ou refuse un RDV, il **rejette votre proposition à cet instant**, pas votre personne — il ne vous connaît même pas. Prendre le non personnellement est la première cause d'abandon dans le métier.",
          "- Reformulation mentale : « On ne rejette pas Julie, on rejette un appel reçu au mauvais moment. »",
          "## La valeur monétaire du « non »",
          "Si vous signez 1 mandat tous les 10 contacts et qu'un mandat rapporte en moyenne 5 000 € d'honoraires, alors **chaque contact vaut 500 €** — y compris les 9 « non ». Chaque refus vous **rapproche** mathématiquement du prochain « oui » et a donc une valeur. On ne subit plus le non : on l'encaisse comme un acompte sur le prochain mandat.",
          "## La loi des grands nombres",
          "Sur un petit nombre d'appels, les résultats sont erratiques : une matinée sans aucun oui n'a rien d'anormal. Sur un grand nombre, votre taux de transformation se stabilise et devient **prévisible**. C'est pourquoi on ne juge jamais sa performance sur une seule journée, mais sur plusieurs centaines de contacts.",
          "## La règle SW-SW-SW-N",
          "Mnémonique à retenir : « **Some Will, Some Won't, So What, Next** » (certains diront oui, d'autres non, et alors, au suivant). On ne s'attarde pas sur un refus : on **passe au contact suivant** immédiatement, sans ruminer.",
          "## Un « non » n'est souvent qu'un « pas maintenant »",
          "Beaucoup de refus sont **datés**, pas définitifs : le vendeur veut d'abord tester seul, l'acquéreur n'a pas encore vendu son bien. Un non bien encaissé, suivi d'une relance régulière et sans pression des semaines plus tard, se transforme fréquemment en mandat. Gardez la porte ouverte : « Je comprends. Je vous rappelle dans deux mois pour faire le point ? »",
          "## Apprendre de chaque refus",
          "Un non subi est perdu ; un non analysé est un investissement. Après chaque refus marquant, posez-vous :",
          "- La **découverte** était-elle suffisante ? Ai-je compris le vrai besoin et la vraie motivation ?",
          "- Ai-je apporté une **preuve** (références, chiffres, avis de valeur documenté) ?",
          "- Ai-je **demandé l'engagement** clairement, ou laissé l'entretien se terminer dans le flou ?",
          "## Gérer la pression d'avant-RDV",
          "La confiance vient de la **compétence préparée**, pas de l'improvisation. Avant un R2 difficile ou une signature de mandat exclusif, appliquez une routine courte : relecture du dossier, 3 respirations profondes, rappel de votre objectif minimal pour ne pas repartir les mains vides.",
          "## Phrases d'ancrage",
          "- « Ce n'est pas un échec, c'est une donnée. »",
          "- « Je contrôle mon effort, pas sa réponse. »",
          "- « Le prochain appel est une nouvelle chance, intacte. »",
          "## Erreurs fréquentes",
          "- Ruminer un refus pendant des heures et saboter, par contagion, les appels suivants.",
          "- Baisser le volume d'appels après une série de non, alors que c'est l'inverse qu'il faut faire.",
          "- Chercher le RDV ou le prospect « parfait » au lieu d'accepter le jeu des probabilités.",
          "- Rayer définitivement un prospect qui a dit non, au lieu de le replacer dans un cycle de relance.",
          "## Cas pratique",
          "Karim, négociateur à Martigues, encaisse 12 refus un lundi matin de pige. Au lieu de s'arrêter, il se dit : « 12 non à 500 € pièce, je viens de gagner 6 000 € de probabilité de mandat. » Il enchaîne, décroche 2 RDV estimation l'après-midi. Le mental a transformé une matinée « ratée » en moteur."
        ]
      },
      {
        "titre": "Objectifs, discipline & routines",
        "contenu": [
          "Le talent sans discipline s'essouffle ; la discipline sans talent finit par gagner. Dans un métier **sans horaires imposés**, c'est votre organisation personnelle qui fait tout.",
          "## Fixer des objectifs SMART",
          "- **S**pécifiques, **M**esurables, **A**tteignables, **R**éalistes, **T**emporels (datés).",
          "- Objectif flou : « faire plus de prospection ». Objectif SMART : « **20 contacts téléphoniques par jour** et **2 mandats signés par mois** ».",
          "## Écrire ses objectifs",
          "Un objectif qui reste dans la tête n'est qu'un vœu. **Écrit** et **affiché** (sur le bureau, en fond d'écran), il devient un engagement. Relisez-le chaque matin : ce simple geste réoriente l'attention vers ce qui compte vraiment.",
          "## Objectifs d'activité > objectifs de résultat",
          "Vous ne **contrôlez pas** directement un mandat (c'est la décision du client), mais vous contrôlez vos **20 appels**, vos **5 estimations**, vos **2 tournées de pige**. Pilotez l'**amont** (l'activité) : le résultat (l'aval) suivra mécaniquement.",
          "## La cascade d'objectifs",
          "Déclinez votre objectif annuel jusqu'au quotidien pour le rendre concret :",
          "- Annuel : 24 mandats.",
          "- Mensuel : 2 mandats.",
          "- Hebdomadaire : au moins 1 mandat, soit environ 5 estimations.",
          "- Quotidien : 20 contacts, pour obtenir en moyenne 1 RDV estimation.",
          "## Connaître ses ratios",
          "Vos propres chiffres sont votre boussole : combien de contacts pour un RDV ? combien de RDV pour un mandat ? combien de mandats pour une vente ? Dès que vous connaissez vos ratios, un objectif de ventes se traduit immédiatement en nombre d'appels à passer — et le flou disparaît.",
          "## Les rituels non négociables",
          "- **Bloc prospection matinal** : 9h-11h, téléphone, porte fermée, aucun mail. C'est sacré.",
          "- **Revue hebdomadaire** des chiffres le vendredi : combien de contacts, RDV, mandats, ventes ?",
          "- **Relances programmées** : aucun contact chaud ne doit tomber dans l'oubli.",
          "## L'effet cumulé",
          "De petites actions répétées chaque jour battent les coups d'éclat irréguliers. 20 appels par jour, c'est environ **4 400 contacts par an**. C'est cette régularité, invisible au jour le jour, qui construit un portefeuille.",
          "## Erreurs fréquentes",
          "- Se fixer uniquement des objectifs de résultat et se décourager quand ils tardent à venir.",
          "- Entamer le bloc prospection par les mails, voleur de temps numéro un de la matinée.",
          "- Ne jamais mesurer : on ne pilote pas ce qu'on ne mesure pas.",
          "Dans l'application, le **suivi d'activité** mesure vos contacts, RDV, mandats, chasses et tournées : servez-vous-en comme tableau de bord de votre discipline.",
          "## Cas pratique",
          "Thomas se fixait « faire du chiffre » et se décourageait dès qu'un mois démarrait lentement. Son manager lui fait piloter l'activité : 20 contacts par jour, 5 estimations par semaine, suivis dans l'app. En 3 mois, sans « penser » aux mandats, il en signe 7 : le résultat a suivi l'activité."
        ]
      },
      {
        "titre": "Gérer son temps et son énergie",
        "contenu": [
          "Un négociateur n'est pas payé à l'heure mais au résultat : la question n'est pas « combien d'heures je travaille ? » mais « sur quoi je passe mes **meilleures heures** ? ».",
          "## La loi de Pareto (80/20)",
          "**80 % de vos résultats viennent de 20 % de vos actions.** Pour un négociateur, ces 20 % sont presque toujours : la **prospection**, la **prise de mandat** et les **relances acquéreurs**. Identifiez ces tâches à forte valeur et protégez-les coûte que coûte.",
          "## La loi de Parkinson",
          "« Le travail s'étale jusqu'à occuper tout le temps disponible. » Une estimation à préparer prendra une journée si vous lui donnez une journée, une heure si vous lui donnez une heure. Fixez-vous des **délais courts et fermes** pour chaque tâche : la contrainte de temps crée l'efficacité.",
          "## La matrice d'Eisenhower",
          "Classez chaque tâche selon deux axes, urgent et important :",
          "- **Important + urgent** : à faire tout de suite (une offre à transmettre, un compromis à boucler).",
          "- **Important + non urgent** : à **planifier** (prospection, formation, suivi de portefeuille) — c'est le quadrant des top performers.",
          "- **Urgent + non important** : à **déléguer** si possible (certains mails, administratif).",
          "- **Ni l'un ni l'autre** : à **éliminer** (scroll, réunions sans objet).",
          "## Le time-blocking",
          "Réservez des **créneaux dédiés** dans l'agenda, comme des RDV avec vous-même : prospection 9h-11h, visites l'après-midi, administratif en fin de journée. Une tâche sans créneau ne se fait jamais.",
          "## Planifier la veille",
          "La journée se gagne la veille au soir. Avant de quitter l'agence, posez par écrit le plan du lendemain : vos 3 priorités, vos RDV, votre liste d'appels. Vous démarrez ainsi la matinée dans l'action, sans gaspiller la première heure — la plus précieuse — à vous demander par quoi commencer.",
          "## Travailler avec son énergie (rythmes ultradiens)",
          "Le cerveau fonctionne par cycles d'environ **90 minutes** de concentration, suivis d'une baisse. Placez vos tâches difficiles (prospection, négociation) sur votre **pic d'énergie** — souvent le matin — et les tâches mécaniques (saisie, mails) sur les creux de l'après-midi.",
          "## La règle des 3 MIT",
          "Chaque matin, définissez vos **3 Most Important Tasks** (tâches les plus importantes). Si vous ne faisiez que ces 3 choses aujourd'hui, la journée serait réussie. Mnémonique : « Mes 3 MIT **avant** mes mails. »",
          "## La méthode Pomodoro",
          "Pour les tâches qu'on repousse (la pige, la mise à jour du fichier), travaillez par blocs de **25 minutes** minutées, suivies de 5 minutes de pause. Ça désamorce la procrastination : on ne se dit pas « je dois faire 2h de pige » mais « juste 25 minutes ».",
          "## Les voleurs de temps à éliminer",
          "- Les **notifications** : téléphone en mode avion pendant le bloc prospection.",
          "- Les **mails consultés en continu** : traitez-les en 2 ou 3 plages fixes par jour.",
          "- Le **faux travail** : ranger son bureau, peaufiner une annonce une heure durant… qui donne l'impression d'avancer sans générer un seul mandat.",
          "- Le **multitâche** : passer sans cesse d'une tâche à l'autre fait perdre, à chaque bascule, plusieurs minutes de reconcentration.",
          "## Erreurs fréquentes",
          "- Commencer la journée par les tâches faciles et agréables plutôt que par les plus rentables.",
          "- Confondre « être occupé » et « être efficace ».",
          "## Cas pratique",
          "Sonia passait ses matinées sur les mails et les annonces, et sa prospection sautait « faute de temps ». Elle bascule : bloc prospection 9h-11h, téléphone en avion, mails à 11h30, 14h et 17h. Même nombre d'heures travaillées, mais ses 3 MIT sont faits avant midi. Résultat : +40 % de contacts en un mois."
        ]
      },
      {
        "titre": "Concentration, focus & état de flow",
        "contenu": [
          "La performance ne dépend pas seulement du temps passé, mais de la **qualité de l'attention** pendant ce temps. Une heure de concentration pleine vaut une demi-journée de travail haché par les interruptions.",
          "## L'attention, ressource rare",
          "Chaque interruption a un coût caché : après une notification ou un collègue qui passe, il faut en moyenne plusieurs minutes pour retrouver le fil. Multipliées par dizaines dans une journée, ces reprises grignotent l'essentiel de votre énergie mentale sans que vous le voyiez.",
          "## Le travail en profondeur",
          "Les tâches à forte valeur (préparer un avis de valeur solide, mener un entretien de découverte, bâtir un argumentaire) exigent un **travail en profondeur** : une plage sans interruption où l'on ne fait qu'une seule chose. À l'inverse, le travail « en surface » (mails, saisie) tolère le morcellement.",
          "## L'état de flow",
          "Décrit par le psychologue **Mihaly Csikszentmihalyi**, le **flow** est cet état où l'on est totalement absorbé par une tâche, performant et sans voir le temps passer. C'est là que l'on travaille le mieux et avec le moins de fatigue.",
          "## Les conditions pour entrer en flow",
          "- Un **objectif clair** pour la session (« 15 appels de pige », pas « faire de la prospection »).",
          "- Un **retour immédiat** sur ce qu'on fait (le téléphone décroché ou non, le RDV pris ou non).",
          "- Un **équilibre défi/compétence** : une tâche ni trop facile (ennui) ni trop dure (angoisse).",
          "- **Zéro distraction** : notifications coupées, une seule tâche à l'écran.",
          "## Créer son rituel de concentration",
          "Associez toujours la concentration aux **mêmes signaux** : même créneau, même place, téléphone en mode avion, casque sur les oreilles. À force, le cerveau bascule en mode focus dès que le rituel démarre, comme un réflexe.",
          "## Mono-tâche plutôt que multitâche",
          "Le cerveau ne fait pas vraiment deux choses à la fois : il **bascule** très vite entre elles, en payant à chaque fois le prix de la reconcentration. Faire une seule chose à fond, puis la suivante, est plus rapide et moins fatigant que tout mener de front.",
          "## Erreurs fréquentes",
          "- Garder ses mails et messageries ouverts « au cas où » pendant une tâche qui demande du focus.",
          "- Enchaîner les tâches sans aucune pause, jusqu'à ce que la concentration s'effondre d'elle-même.",
          "## Cas pratique",
          "Rachid prospectait en consultant ses mails entre chaque appel : 2 heures pour 10 contacts épuisants. Il teste le flow : objectif clair (20 appels), téléphone en avion, debout, casque, aucune autre fenêtre ouverte. En 1h15, il a passé ses 20 appels, pris 2 RDV, et se sent moins fatigué qu'avant. Même tâche, attention différente."
        ]
      },
      {
        "titre": "Confiance en soi & préparation mentale",
        "contenu": [
          "La confiance n'est pas un don : c'est un **état qu'on prépare**. Un sportif de haut niveau ne monte jamais sur le terrain sans routine mentale ; un négociateur ne devrait pas davantage entrer en RDV de mandat « à froid ».",
          "## La confiance naît de la préparation",
          "L'essentiel de la confiance vient de la **compétence préparée** : connaître son marché, ses chiffres, ses arguments, les objections probables. Avant un RDV, révisez votre **avis de valeur**, vos **références de ventes comparables** sur le secteur et votre **argumentaire d'honoraires**.",
          "## Préparer ses objections",
          "Rien n'entame la confiance comme une objection qui prend au dépourvu. Or les objections sont presque toujours les mêmes : « c'est trop cher en honoraires », « je veux essayer seul d'abord », « l'agence d'à côté me prend moins ». Préparez et répétez vos réponses : une objection anticipée n'est plus une menace, c'est un passage attendu.",
          "## La routine d'avant-RDV (méthode CAP)",
          "- **C**orps : posture droite, épaules ouvertes, sourire. Quelques minutes de posture haute avant d'entrer envoient au cerveau un signal d'assurance.",
          "- **A**ncrage : un geste déclencheur associé à vos meilleurs moments (poing serré, phrase-clé) pour rappeler l'état de réussite.",
          "- **P**rojection : visualisez l'entretien qui se passe bien, la signature, la poignée de main. Le cerveau distingue mal le vécu d'un scénario visualisé intensément.",
          "## Le sourire et la voix au téléphone",
          "En prospection, l'autre ne perçoit que votre **voix**. Un sourire, même invisible, s'entend : il détend le timbre et rend l'échange chaleureux. Tenez-vous **debout** pour appeler : la voix porte mieux, le souffle est plus ample, l'énergie passe dans le combiné.",
          "## Le dialogue intérieur (self-talk)",
          "Votre interlocuteur le plus dur, c'est souvent **vous-même**. Remplacez le discours saboteur par un discours de performance :",
          "- Au lieu de « je vais encore me faire jeter », dites-vous « j'apporte une vraie valeur à ce vendeur ».",
          "- Au lieu de « je déteste annoncer mes honoraires », dites-vous « mes honoraires sont justifiés par mon résultat ».",
          "## Le syndrome de l'imposteur",
          "Très fréquent chez les jeunes négociateurs, surtout face à des vendeurs plus âgés ou fortunés : « De quel droit je conseille cette personne ? ». Trois antidotes : s'appuyer sur les **faits** (vous avez les données du marché, pas lui), sur la **force de votre réseau et de votre enseigne** (vous n'êtes pas seul), et sur vos **réussites passées** (gardez une trace écrite de vos succès à relire).",
          "## Tenir un journal de réussites",
          "Le cerveau retient mieux les échecs que les succès. Contre ce biais, notez chaque semaine vos victoires, même petites (un mandat, un merci de client, une objection bien traitée). Les jours de doute, cette liste est un rappel concret que vous êtes compétent.",
          "## Le langage du corps",
          "- Contact visuel franc, poignée de main assurée, voix posée et légèrement plus grave.",
          "- Ne pas se recroqueviller ni croiser les bras : le corps trahit — ou, à l'inverse, crée — l'état mental.",
          "## Erreurs fréquentes",
          "- Arriver en RDV en consultant ses mails dans la voiture au lieu de se préparer mentalement.",
          "- Laisser le client sentir qu'on « a besoin » de ce mandat : la posture de demandeur fait fuir et fait brader les honoraires.",
          "## Cas pratique",
          "Avant chaque RDV de mandat, Léa restait dans sa voiture à répondre aux mails, puis entrait stressée. Elle adopte la méthode CAP : 2 minutes de posture haute, un geste d'ancrage, visualisation de la signature. Son taux de transformation en mandat exclusif passe de 1 sur 4 à 1 sur 2."
        ]
      },
      {
        "titre": "Le mental en négociation : garder la main",
        "contenu": [
          "La négociation — des honoraires avec un vendeur, du prix avec un acquéreur, d'une baisse avec un propriétaire — se joue autant sur le **mental** que sur les arguments. Celui qui garde son calme et sa posture garde la main.",
          "## La posture de non-besoin",
          "Le négociateur qui **a besoin** de cette vente la brade : il cède sur les honoraires, accepte un prix surévalué, court après le client. Celui qui a un portefeuille d'affaires derrière lui négocie détendu, parce qu'aucun dossier n'est vital. Cultivez cette posture : un pipeline rempli est votre meilleure arme mentale.",
          "## Connaître sa solution de repli",
          "Avant toute négociation, sachez ce que vous ferez si elle échoue : votre **solution de rechange** (d'autres acquéreurs sur le bien, d'autres mandats à signer). Plus votre repli est solide, plus vous négociez sereinement — et plus vous êtes prêt, si nécessaire, à dire non et à vous lever de la table.",
          "## Le point de rupture",
          "Fixez **à l'avance**, à froid, votre limite : le taux d'honoraires plancher, le prix en dessous duquel une offre n'a plus de sens. Décidée avant l'entretien, cette limite vous protège des concessions prises sous la pression émotionnelle du moment.",
          "## Le pouvoir du silence",
          "Après avoir annoncé vos honoraires ou transmis une offre, **taisez-vous**. Le silence est inconfortable, et beaucoup le comblent en se justifiant ou en baissant aussitôt leur prix — c'est l'erreur. Laissez l'autre réagir : celui qui parle le premier après une annonce de prix est souvent celui qui concède.",
          "## L'ancrage",
          "Le premier chiffre énoncé sert de **point d'ancrage** à toute la discussion. D'où l'importance d'annoncer ses honoraires avec assurance et de les justifier par la valeur, plutôt que de laisser le client poser lui-même un chiffre bas qui tirerait toute la négociation vers le bas.",
          "## Concéder intelligemment",
          "Si vous devez lâcher du terrain, ne le faites jamais gratuitement : une concession s'**échange** (« j'accepte ce point d'honoraires si nous passons en mandat exclusif »). Cédez par petits pas, de plus en plus petits, pour signaler que vous approchez de votre limite.",
          "## Garder le contrôle émotionnel",
          "Un acquéreur ou un vendeur peut jouer la colère, l'urgence ou le mépris pour vous déstabiliser. Ne mordez pas à l'hameçon : restez factuel, parlez lentement, revenez aux chiffres. Celui qui garde son sang-froid pendant que l'autre s'emporte mène l'échange.",
          "## La patience et le temps long",
          "La précipitation est l'ennemie du bon accord. Savoir laisser « mûrir » une décision, ne pas relancer dix fois en deux jours, accepter qu'une négociation prenne du temps : cette patience maîtrisée est elle aussi une force mentale.",
          "## Erreurs fréquentes",
          "- Combler le silence en baissant ses honoraires avant même que le client n'ait répondu.",
          "- Négocier sans limite fixée à l'avance et céder « pour ne pas perdre l'affaire ».",
          "- Laisser une pique émotionnelle du client dicter sa propre réponse.",
          "## Cas pratique",
          "Face à Inès, un vendeur exige d'emblée une baisse d'honoraires « sinon il signe ailleurs ». Elle ne cède pas dans la seconde : elle rappelle calmement sa valeur (délai de vente, acquéreurs déjà en fichier), puis se tait. Le vendeur, qui s'attendait à un bras de fer, finit par signer au taux affiché — et en mandat exclusif. La tenue mentale a préservé la rémunération."
        ]
      },
      {
        "titre": "Résilience, stress & gestion des émotions",
        "contenu": [
          "Le métier expose à une forte charge émotionnelle : refus, ventes qui capotent la veille de la signature, clients agressifs, compromis annulés pendant le délai de rétractation. La **résilience** — la capacité à encaisser et rebondir — est une compétence qui s'entraîne.",
          "## Comprendre le stress",
          "Le stress est une réaction physiologique (adrénaline, cortisol) utile à petite dose (vigilance, énergie) mais nuisible en excès (jugement altéré, voix qui tremble, décisions précipitées). L'objectif n'est pas de le supprimer mais de le **réguler**.",
          "## Stress aigu et stress chronique",
          "Le stress **aigu** (le trac avant un RDV) est bref et sain : il mobilise. Le stress **chronique** (une pression permanente, mois après mois) use l'organisme et mène à l'épuisement. L'un se gère par une routine de calme ponctuelle ; l'autre impose de revoir sa charge et son hygiène de vie.",
          "## Changer de regard sur le stress",
          "La façon dont on **interprète** son stress change ses effets : voir son cœur qui s'accélère comme « mon corps se prépare à être performant » plutôt que comme « je panique » améliore la lucidité. Le trac n'est pas l'ennemi, c'est de l'énergie disponible à rediriger.",
          "## La cohérence cardiaque (3-6-5)",
          "Technique de respiration simple pour faire retomber le stress en quelques minutes :",
          "- **3** fois par jour,",
          "- **6** respirations par minute (inspirez 5 secondes, expirez 5 secondes),",
          "- pendant **5** minutes.",
          "À pratiquer dans la voiture avant un RDV tendu ou après un appel difficile.",
          "## La méthode STOP",
          "Face à une émotion forte (un client qui s'énerve, l'annonce d'un refus) :",
          "- **S** : Stop, on ne réagit pas à chaud.",
          "- **T** : prendre une respiration (Take a breath).",
          "- **O** : Observer la situation et ses propres émotions avec recul.",
          "- **P** : Procéder, en répondant de façon choisie et non subie.",
          "## Dissocier l'émotion de l'action",
          "On a le droit de **ressentir** de la déception, de la colère ou du stress ; on n'a pas le droit de **laisser l'émotion piloter** la réponse au client. Entre le stimulus et la réaction, il existe toujours un espace : c'est là que se joue le professionnalisme.",
          "## Gérer un client agressif ou en détresse",
          "Un vendeur en plein divorce, une succession conflictuelle, un acquéreur dont le prêt vient d'être refusé : l'émotion est à vif. Trois réflexes :",
          "- **Ne pas prendre l'agressivité pour soi** : elle vise la situation, pas vous.",
          "- **Valider l'émotion** : « Je comprends que cette situation soit éprouvante. »",
          "- **Baisser le ton et le rythme** : on apaise l'autre en étant soi-même calme (effet miroir).",
          "## Rebondir après un coup dur",
          "Une vente qui s'effondre à la dernière minute est un choc normal. Accordez-vous un temps court pour encaisser, puis repassez vite à l'action : relancer un acquéreur, remettre le bien en avant. L'action est le meilleur antidote à la rumination ; rester inactif ne fait qu'amplifier le coup.",
          "## Intelligence émotionnelle",
          "Savoir **nommer** ses émotions et lire celles des autres est un avantage décisif. Un négociateur qui reste lucide quand l'autre perd ses moyens prend naturellement l'ascendant dans l'échange.",
          "## Erreurs fréquentes",
          "- Répondre à un mail ou un SMS agressif à chaud (règle : jamais dans les 10 minutes qui suivent).",
          "- Confondre empathie et absorption : prendre sur soi les émotions du client jusqu'à s'épuiser.",
          "## Cas pratique",
          "Un vendeur appelle, furieux, parce qu'une visite a été annulée au dernier moment. Réflexe à chaud : se justifier et monter dans les tours. Méthode STOP : Mehdi respire, valide (« Je comprends votre agacement, vous aviez préparé la maison »), baisse le ton. Le client se calme, la relation est sauvée — et le mandat aussi."
        ]
      },
      {
        "titre": "Motivation durable & prévention du burnout",
        "contenu": [
          "La motivation « coup de fouet » retombe vite. Ce qui tient sur la durée, c'est un **système** : un pourquoi clair, une hygiène de vie et des garde-fous contre l'épuisement.",
          "## Motivation intrinsèque vs extrinsèque",
          "- **Extrinsèque** : l'argent, le challenge, le classement de l'agence. Puissante mais volatile.",
          "- **Intrinsèque** : le plaisir du métier, le sens, la relation client, la progression personnelle. Plus durable.",
          "- Les négociateurs qui durent cultivent les **deux**, mais s'appuient sur l'intrinsèque dans les périodes creuses.",
          "## Clarifier son « pourquoi »",
          "Derrière l'objectif de chiffre, il y a toujours un **pourquoi** personnel : financer un projet, offrir une sécurité à sa famille, se prouver quelque chose, gagner en liberté. Écrivez-le et relisez-le les jours difficiles : « Je ne passe pas ce 15e appel pour le plaisir, je le passe pour mon pourquoi. »",
          "## Gérer la pression du revenu variable",
          "La rémunération largement variable (commissions, honoraires) est un stress propre au métier : un mois creux inquiète, et l'inquiétude dégrade la performance — un cercle vicieux. Deux garde-fous : se constituer un **matelas de trésorerie** de quelques mois pour dédramatiser les creux, et **piloter l'activité** plutôt que de fixer le compte en banque, car c'est l'activité d'aujourd'hui qui paiera dans deux mois.",
          "## Célébrer les victoires",
          "On se fixe un objectif, on l'atteint… et on enchaîne aussitôt sans savourer. Cette course sans pause épuise. Marquez le coup à chaque étape (un mandat exclusif signé, un premier compromis) : la reconnaissance, même donnée à soi-même, recharge la motivation.",
          "## Gérer les périodes creuses",
          "Le métier est **cyclique** (saisonnalité, marché, séries de « non »). Dans un creux :",
          "- Revenez aux **fondamentaux** (activité, prospection) plutôt que d'attendre que ça passe.",
          "- Fractionnez les objectifs pour retrouver des **petites victoires** et de l'élan.",
          "- Entourez-vous (équipe, manager) : l'isolement aggrave tout.",
          "## Reconnaître le burnout",
          "L'épuisement professionnel se construit sur 3 dimensions (modèle de Maslach) :",
          "- **Épuisement émotionnel** : vidé, à plat en permanence.",
          "- **Cynisme / dépersonnalisation** : désintérêt, dureté envers les clients.",
          "- **Perte du sentiment d'accomplissement** : le « à quoi bon ? ».",
          "Ces signaux ne se négocient pas : ils imposent de lever le pied et, si besoin, de consulter.",
          "## L'hygiène de vie, carburant de la performance",
          "- **Sommeil** : 7 à 8 heures ; un négociateur en dette de sommeil prospecte mal et négocie mal.",
          "- **Activité physique** : le sport évacue le cortisol et recharge l'énergie.",
          "- **Coupure** : de vraies plages sans téléphone, sinon l'épuisement guette à moyen terme.",
          "## Erreurs fréquentes",
          "- Croire que travailler 12h par jour en continu est un gage de performance : c'est l'inverse qui se produit à moyen terme.",
          "- Ignorer les premiers signaux de fatigue chronique jusqu'à la rupture.",
          "- Ne jamais couper vraiment, mails et appels compris, même en congés.",
          "## Cas pratique",
          "Après un trimestre à 60h par semaine sans coupure, Nadia se surprend à être sèche au téléphone et à ne plus avoir envie de décrocher : cynisme et épuisement, deux signaux de burnout. Elle réinstaure un jour off complet, du sport et un sommeil régulier. En 3 semaines, son énergie — et ses résultats — repartent."
        ]
      },
      {
        "titre": "Habitudes gagnantes & amélioration continue",
        "contenu": [
          "On ne s'élève jamais durablement au niveau de ses objectifs ; on retombe au niveau de ses **systèmes** (ses habitudes). Un top performer n'est pas plus discipliné par nature : il a installé des **habitudes** qui rendent la discipline automatique.",
          "## La boucle de l'habitude",
          "Toute habitude suit 3 temps : déclencheur, routine, récompense.",
          "- **Déclencheur** : 9h, j'arrive, je m'assois à mon poste.",
          "- **Routine** : je décroche le téléphone et j'enchaîne mes appels de pige.",
          "- **Récompense** : je coche mon bloc prospection et je m'autorise un café.",
          "Pour installer une habitude, rendez le déclencheur **évident** et la première action **facile**.",
          "## Agir sur son environnement",
          "La volonté est une ressource limitée ; l'environnement, lui, agit en permanence. Rendez la bonne habitude **facile** (fichier de pige ouvert et prêt la veille) et la mauvaise **difficile** (téléphone personnel hors de vue, réseaux sociaux déconnectés). On ne résiste pas à une tentation absente.",
          "## La règle des 1 %",
          "S'améliorer de **1 % par jour**, c'est devenir environ **37 fois meilleur en un an** (1,01 puissance 365 vaut environ 37,8). À l'inverse, se dégrader de 1 % par jour (0,99 puissance 365 vaut environ 0,03) ramène presque à zéro. La performance n'est pas un bond spectaculaire, c'est une **accumulation** de micro-progrès. Mnémonique : « 1 % mieux chaque jour. »",
          "## Le délai de formation d'une habitude",
          "Contrairement au mythe des « 21 jours », il faut en moyenne **66 jours** pour qu'un comportement devienne automatique (étude Lally et coll., 2009), avec de fortes variations selon les personnes et la difficulté. Conclusion : **tenez bon** les deux premiers mois, c'est là que tout se joue.",
          "## Empiler les habitudes (habit stacking)",
          "Accrochez une nouvelle habitude à une habitude déjà en place : « Après avoir allumé mon ordinateur (existant), je revois mes 3 MIT du jour (nouveau). » Le geste connu sert de déclencheur au nouveau comportement.",
          "## Ne jamais rompre la chaîne",
          "Marquez d'une croix chaque jour où vous tenez votre habitude (vos 20 appels, par exemple). Au bout de quelques semaines, la **chaîne** de croix devient elle-même une motivation : on ne veut pas la briser. L'objectif du jour n'est plus de performer, mais simplement de « ne pas casser la chaîne ».",
          "## Le débrief systématique",
          "Chaque RDV important mérite 2 minutes d'analyse : qu'est-ce qui a marché ? qu'est-ce que je refais ? qu'est-ce que je change ? Tenez un **journal de bord** : les schémas récurrents apparaissent et les erreurs se corrigent.",
          "## Apprendre des meilleurs",
          "- **Modélisez** : repérez le meilleur négociateur de l'agence et observez ses routines, ses phrases, son organisation.",
          "- **Mentorat** : demandez à être accompagné sur vos RDV difficiles.",
          "- **Formation continue** : lecture, réécoute de vos appels, jeux de rôle en équipe.",
          "## Erreurs fréquentes",
          "- Vouloir tout changer d'un coup : 5 nouvelles habitudes en même temps, c'est l'échec garanti ; installez-en **une** à la fois.",
          "- Abandonner au premier jour manqué. Rater une fois n'est pas grave ; rater **deux fois de suite** installe la rechute. Règle d'or : « ne jamais manquer deux fois ».",
          "## Cas pratique",
          "Pour installer la prospection matinale, Yanis empile l'habitude : « après mon café de 9h, je passe 10 appels ». Le café (habitude existante) déclenche les appels. Les deux premiers mois sont durs, mais au-delà des 66 jours environ le geste devient automatique : il ne « décide » plus de prospecter, il prospecte."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Quand les résultats baissent, le top performer…",
        "options": [
          "Réduit son activité",
          "Augmente son activité",
          "Attend que ça passe",
          "Baisse ses honoraires"
        ],
        "correct": 1,
        "explication": "La vente est un jeu de nombres : on agit sur l'amont (le volume d'activité), on ne le réduit surtout pas."
      },
      {
        "question": "Un « non » en prospection, c'est…",
        "options": [
          "Un échec personnel",
          "Une étape statistique qui rapproche du oui",
          "Une raison d'arrêter",
          "La preuve d'un mauvais marché"
        ],
        "correct": 1,
        "explication": "On dissocie le refus de soi : chaque non a une valeur et rapproche mathématiquement du prochain oui (règle SW-SW-SW-N)."
      },
      {
        "question": "Le plus efficace à piloter, ce sont les objectifs…",
        "options": [
          "De résultat uniquement",
          "D'activité, ce qu'on contrôle vraiment",
          "Des autres négociateurs",
          "Du marché"
        ],
        "correct": 1,
        "explication": "On ne contrôle pas un mandat, mais on contrôle ses contacts et ses estimations : on pilote l'amont, le résultat suit."
      },
      {
        "question": "Dans la matrice d'Eisenhower, le quadrant des top performers est…",
        "options": [
          "Urgent et important",
          "Important mais non urgent (à planifier)",
          "Urgent mais non important (à déléguer)",
          "Ni urgent ni important (à éliminer)"
        ],
        "correct": 1,
        "explication": "La prospection et la formation sont importantes mais rarement urgentes : les planifier, c'est agir avant la crise plutôt que de la subir."
      },
      {
        "question": "Après avoir annoncé vos honoraires en négociation, le bon réflexe est de…",
        "options": [
          "Vous justifier aussitôt",
          "Baisser le chiffre pour rassurer",
          "Vous taire et laisser l'autre réagir",
          "Changer de sujet"
        ],
        "correct": 2,
        "explication": "Le silence est un outil : celui qui parle le premier après une annonce de prix est souvent celui qui concède. On laisse l'autre réagir."
      },
      {
        "question": "En moyenne, combien de temps faut-il pour ancrer une nouvelle habitude ?",
        "options": [
          "21 jours",
          "Environ 66 jours",
          "Un jour suffit",
          "Il n'y a pas de délai"
        ],
        "correct": 1,
        "explication": "Contrairement au mythe des 21 jours, l'étude Lally (2009) situe la moyenne autour de 66 jours : il faut tenir bon les deux premiers mois."
      },
      {
        "question": "La loi de Pareto appliquée au négociateur signifie que…",
        "options": [
          "20 % des résultats viennent de 80 % des actions",
          "80 % des résultats viennent de 20 % des actions",
          "Tout se vaut en termes d'effort",
          "Il faut travailler 80 heures par semaine"
        ],
        "correct": 1,
        "explication": "80 % des résultats proviennent de 20 % des actions : prospection, prise de mandat et relances acquéreurs, à protéger en priorité."
      },
      {
        "question": "La loi de Parkinson énonce que…",
        "options": [
          "Le travail s'étale jusqu'à occuper tout le temps disponible",
          "Il faut toujours en faire plus",
          "On travaille mieux sous la contrainte d'autrui",
          "Les tâches difficiles doivent être reportées"
        ],
        "correct": 0,
        "explication": "Le travail s'étale jusqu'à occuper le temps disponible : fixer des délais courts et fermes crée l'efficacité."
      },
      {
        "question": "Dans un objectif SMART, le « T » signifie…",
        "options": [
          "Technique",
          "Temporel (daté)",
          "Théorique",
          "Transversal"
        ],
        "correct": 1,
        "explication": "SMART = Spécifique, Mesurable, Atteignable, Réaliste et Temporel (daté)."
      },
      {
        "question": "Selon la mentalité de croissance de Carol Dweck, face à une limite il faut ajouter le mot…",
        "options": [
          "« jamais »",
          "« pas encore »",
          "« peut-être »",
          "« toujours »"
        ],
        "correct": 1,
        "explication": "Dire « je ne suis pas encore bon au téléphone » plutôt que « je suis mauvais » est le levier de la progression."
      },
      {
        "question": "Un négociateur à locus de contrôle interne considère que sa réussite dépend avant tout…",
        "options": [
          "Des taux de crédit et de la conjoncture",
          "De la chance",
          "De ses propres actions et de son attitude",
          "De la décision finale du client"
        ],
        "correct": 2,
        "explication": "Le locus interne concentre l'énergie sur ce qu'on maîtrise (actions, préparation, attitude) et lâche prise sur le reste."
      },
      {
        "question": "La « règle des 1 % » (s'améliorer de 1 % par jour) conduit en un an à être environ…",
        "options": [
          "2 fois meilleur",
          "10 fois meilleur",
          "37 fois meilleur",
          "100 fois meilleur"
        ],
        "correct": 2,
        "explication": "1,01 puissance 365 vaut environ 37,8 : la performance est une accumulation de micro-progrès, pas un bond spectaculaire."
      },
      {
        "question": "La technique de respiration dite de cohérence cardiaque 3-6-5 consiste à pratiquer…",
        "options": [
          "3 fois par jour, 6 respirations par minute, pendant 5 minutes",
          "3 minutes, 6 fois par jour, 5 jours par semaine",
          "365 respirations d'affilée",
          "6 fois par jour, 3 minutes, 5 respirations"
        ],
        "correct": 0,
        "explication": "La cohérence cardiaque 3-6-5 : 3 fois par jour, 6 respirations par minute (inspirer 5 s / expirer 5 s), pendant 5 minutes."
      },
      {
        "question": "Dans la méthode STOP de gestion des émotions, que représente le « O » ?",
        "options": [
          "Oublier l'incident",
          "Observer la situation et ses émotions avec recul",
          "Ordonner au client de se calmer",
          "Opposer un argument"
        ],
        "correct": 1,
        "explication": "STOP = Stop (ne pas réagir à chaud), Take a breath (respirer), Observer avec recul, Procéder de façon choisie."
      },
      {
        "question": "La « posture de non-besoin » en négociation repose sur…",
        "options": [
          "Le fait d'avoir absolument besoin de cette vente",
          "Un portefeuille d'affaires rempli qui permet de négocier détendu",
          "L'agressivité envers le client",
          "La baisse immédiate des honoraires"
        ],
        "correct": 1,
        "explication": "Un pipeline rempli est la meilleure arme mentale : qui n'a pas besoin de cette vente ne brade ni ses honoraires ni le prix."
      },
      {
        "question": "La méthode CAP de préparation d'avant-RDV correspond à…",
        "options": [
          "Calme, Attention, Patience",
          "Corps, Ancrage, Projection",
          "Confiance, Argument, Prix",
          "Contact, Accueil, Proposition"
        ],
        "correct": 1,
        "explication": "CAP = Corps (posture haute), Ancrage (geste déclencheur) et Projection (visualiser l'entretien réussi)."
      },
      {
        "question": "Selon le modèle de Maslach, le burnout se construit sur trois dimensions : épuisement émotionnel, cynisme/dépersonnalisation et…",
        "options": [
          "Excès de confiance",
          "Perte du sentiment d'accomplissement",
          "Hyperactivité",
          "Perfectionnisme"
        ],
        "correct": 1,
        "explication": "Les trois dimensions du burnout sont l'épuisement émotionnel, le cynisme/dépersonnalisation et la perte du sentiment d'accomplissement."
      },
      {
        "question": "La règle d'or pour ne pas abandonner une habitude en cours d'installation est…",
        "options": [
          "Ne jamais manquer une seule fois",
          "Ne jamais manquer deux fois de suite",
          "Tout changer d'un coup",
          "Attendre la motivation"
        ],
        "correct": 1,
        "explication": "Rater une fois n'est pas grave ; rater deux fois de suite installe la rechute : « ne jamais manquer deux fois »."
      }
    ]
  },
  {
    "id": "marketing-bien",
    "titre": "Marketing du bien : home-staging, photo & diffusion",
    "icone": "📸",
    "categorie": "Commercial",
    "resume": "Construire et piloter le plan marketing d'un bien : home-staging, photo, vidéo, annonce, diffusion, conformité légale et pilotage de la performance.",
    "duree": "54 min",
    "lecons": [
      {
        "titre": "Le plan marketing : penser comme un stratège",
        "contenu": [
          "Commercialiser un bien, ce n'est pas « mettre une annonce » : c'est dérouler un **plan marketing** pensé, daté et mesurable.",
          "Le vendeur ne vous confie pas des murs, il vous confie un **projet de vie** et une **échéance**. Votre marketing doit créer de la **demande**, vite et au bon prix.",
          "Un bon plan poursuit trois objectifs simultanés : **vendre vite** (limiter le temps de commercialisation), **vendre bien** (au meilleur prix de marché) et **sécuriser** (un acquéreur solide, financé, qui ira jusqu'à l'acte).",
          "## L'entonnoir de commercialisation",
          "- **Attirer** : être vu par le maximum d'acquéreurs potentiels (diffusion, titre, photo de couverture).",
          "- **Séduire** : donner envie de visiter (home-staging, photos, vidéo, visite 360°, annonce).",
          "- **Convertir** : transformer le clic en contact, le contact en visite, la visite en **offre**.",
          "Chaque étape a sa fuite : un bien très vu mais jamais contacté a un problème de **séduction** ou de **prix perçu** ; un bien jamais vu a un problème de **diffusion**.",
          "## AIDA appliqué à l'immobilier",
          "- **A**ttention : la photo de couverture et le titre (90 % des recherches commencent en ligne, le clic se joue en une seconde).",
          "- **I**ntérêt : les 3 premières photos et les 2 premières lignes de l'annonce.",
          "- **D**ésir : le home-staging, la vidéo, la visite immersive, le storytelling du quartier.",
          "- **A**ction : un appel à visiter clair et une réponse rapide aux contacts.",
          "## Les « 4 P » revisités pour un bien",
          "- **Produit** : le bien préparé (home-staging, diagnostics prêts, atouts mis en avant).",
          "- **Prix** : le juste prix de marché, nerf de la guerre — un prix trop haut annule tous les autres efforts.",
          "- **Promotion** : photos, vidéo, annonce, réseaux, portes ouvertes.",
          "- **Place** : les canaux de diffusion (portails, vitrine, fichier, réseaux) là où sont les acheteurs.",
          "## Le plan marketing, un outil de prise de mandat",
          "Présenter votre **plan marketing écrit** au rendez-vous de mandat justifie vos **honoraires** et fait souvent la différence face à un confrère. Détaillez noir sur blanc : préparation du bien, shooting photo et vidéo, diffusion, lancement, reporting hebdomadaire.",
          "Chez CENTURY 21 Icaza Immobilier à Martigues, un plan type s'écrit par exemple ainsi : préparation du bien en J+2, shooting en J+4, teasing au fichier acquéreurs en J+5, mise en ligne multiportails en J+7, premier bilan au vendeur en J+14.",
          "## Pourquoi l'exclusivité démultiplie le marketing",
          "- Un **mandat exclusif** justifie d'**investir** (photographe, vidéo, drone, diffusion payante) : vous savez que l'effort ne profitera pas à un concurrent.",
          "- Il permet un **lancement maîtrisé** (teasing, fichier, portes ouvertes) impossible quand quatre agences diffusent le même bien en désordre.",
          "- La **multidiffusion sauvage** d'un même bien, avec des prix et des photos différents sur six vitrines, le **dévalorise** : l'acquéreur le croit « invendable ».",
          "## Le capital « nouveauté »",
          "Un bien n'est jamais aussi désirable que dans ses **15 premiers jours**. Ce capital de nouveauté ne revient pas : on ne lance donc jamais un bien tant qu'il n'est pas prêt à être photographié et diffusé au meilleur niveau.",
          "## Erreurs fréquentes",
          "- Dégainer l'annonce **avant** d'avoir préparé et photographié le bien : on brûle l'irremplaçable effet de nouveauté.",
          "- Ne pas écrire le plan : un plan non formalisé n'est ni vendu au propriétaire, ni tenu dans le temps.",
          "- Confondre **activité** (« j'ai mis l'annonce ») et **résultat** (contacts, visites, offres).",
          "- Compenser un **prix trop élevé** par « plus de marketing » : aucun visuel ne rattrape un prix hors marché.",
          "## Mini cas pratique",
          "Maison de pêcheur dans le quartier de l'Île à Martigues. Le vendeur a « essayé seul » sur Leboncoin pendant trois mois, sans une seule visite. Diagnostic : photos sombres, titre purement technique, prix calé sur l'espoir. Votre plan (préparation, shooting lumineux, teasing au fichier, mise en avant du cachet « Venise provençale ») transforme un bien grillé en bien désirable. L'argument au vendeur : « Le problème n'était pas votre bien, c'était sa **mise en marché**. »"
        ]
      },
      {
        "titre": "Home-staging : préparer le bien",
        "contenu": [
          "Un bien **préparé** se vend plus vite et plus cher : l'acquéreur achète un **coup de cœur**, pas des murs.",
          "Le **home-staging** est l'art de **mettre en scène** le bien pour qu'un maximum d'acheteurs s'y projette. Le mot d'ordre : **dépersonnaliser** pour que chacun imagine SA vie, pas celle du vendeur.",
          "Objectif mesurable : un bien préparé se vend en moyenne plus vite et avec **moins de négociation**, car l'acheteur a moins de « défauts » à monnayer.",
          "## Les 5 règles d'or",
          "- **Désencombrer & dépersonnaliser** : moins d'objets, moins de photos personnelles → l'acheteur se projette. Videz 30 à 50 % des bibelots, retirez photos de famille, aimants de frigo, objets religieux ou politiques.",
          "- **Réparer les petits défauts** : une poignée cassée, un joint noirci, une ampoule grillée créent une impression de négligence qui fait douter de l'entretien du bien tout entier.",
          "- **Nettoyer, désodoriser, éclairer** : propreté irréprochable, odeurs neutres (attention aux animaux, au tabac, à la friture), toutes les ampoules fonctionnelles et de **même température de couleur**.",
          "- **Neutraliser** : couleurs sobres sur les murs trop marqués (un mur rouge ou violet fait fuir), ambiance chaleureuse mais consensuelle.",
          "- **Désaturer les volumes** : un meuble sur deux dans une pièce surchargée ; on dégage les circulations pour agrandir visuellement l'espace.",
          "## Les cinq sens de l'acheteur",
          "- **La vue** : lumière, rangement, harmonie des couleurs — ce qui se photographie et se voit en visite.",
          "- **L'odorat** : c'est le premier réflexe inconscient en franchissant la porte ; aérez, bannissez tabac, animal et friture.",
          "- **L'ouïe** : du calme (coupez la télévision), voire une musique douce et discrète le jour des visites.",
          "- **Le toucher et la température** : une maison à bonne température, ni glaciale ni étouffante, rassure sur le confort et l'isolation.",
          "## Pièce par pièce",
          "- **Entrée** : première impression ; dégagée, un miroir, une lumière chaude.",
          "- **Séjour** : créez un **point focal** (canapé face à la cheminée ou à la vue), rangez les câbles.",
          "- **Cuisine** : plans de travail **vides**, électroménager propre, torchons neufs.",
          "- **Chambre** : linge de lit uni et repassé, tables de nuit dégagées, rien qui traîne sous le lit.",
          "- **Salle de bains** : ambiance « hôtel » — serviettes claires pliées, aucun produit personnel visible, joints blancs.",
          "- **Extérieur** : façade et seuil propres, pelouse tondue, terrasse dressée (en PACA, une table dressée à l'ombre d'un olivier « vend » l'art de vivre).",
          "## Home-staging d'un bien occupé",
          "- Le vendeur vit encore sur place : on ne vide pas la maison, on la **range et la neutralise** pour le jour des photos et des visites.",
          "- Prévoyez des **caisses de rangement** pour faire disparaître le superflu avant chaque visite, et une **check-list** (lits faits, volets ouverts, plans de travail nets).",
          "- Respectez le vendeur : on **dé-décore**, on ne juge pas ses goûts.",
          "## Le home-staging virtuel",
          "Quand le bien est **vide** ou **très daté**, le **home-staging virtuel** (meubles ajoutés numériquement) aide l'acheteur à se projeter.",
          "- Il est **légal** mais doit rester **honnête** : toute photo meublée numériquement porte la mention **« image non contractuelle / home-staging virtuel »**.",
          "- Ne jamais effacer un défaut permanent (fissure, vis-à-vis, poteau) : ce serait une **pratique commerciale trompeuse** (articles L.121-2 et L.121-3 du Code de la consommation), lourde de conséquences.",
          "## Le retour sur investissement",
          "Quelques centaines d'euros de home-staging rapportent souvent plusieurs milliers d'euros sur le prix et des semaines de délai gagnées.",
          "- Budget courant : de **1 à 3 %** du prix de vente pour un home-staging léger (petits travaux, peinture, désencombrement, quelques accessoires).",
          "- Priorisez les pièces à fort impact : **entrée, séjour, cuisine, salle de bains** — là où se joue la décision.",
          "- Les professionnels observent des **délais de vente nettement raccourcis** et **moins de négociation** sur un bien préparé.",
          "## Le script pour convaincre le vendeur",
          "« Monsieur Martin, l'acheteur décide en moins de **90 secondes**. Pour quelques centaines d'euros et un week-end de rangement, nous allons faire gagner à votre bien des milliers d'euros et plusieurs semaines. On ne dépense pas, on **investit** sur votre prix de vente. »",
          "Si le vendeur résiste : « Gardez vos meubles préférés, je ne vous demande pas de vivre dans un musée — juste de présenter le bien sous son meilleur jour **le jour des photos et des visites**. »",
          "## Erreurs fréquentes",
          "- **Photographier avant de préparer** : les photos sont éternelles sur Internet, le désordre aussi.",
          "- Sur-décorer : le home-staging n'est pas de la décoration, c'est de la **dé-décoration**.",
          "- Laisser les **animaux**, la litière et les gamelles pendant les visites.",
          "- Négliger les **odeurs** : c'est le premier réflexe inconscient de l'acheteur en franchissant la porte.",
          "## Mini cas pratique",
          "Appartement T3 à Martigues occupé par un fumeur, encombré, murs jaunis. Coût du home-staging : peinture blanche (environ 600 €), grand ménage et désodorisation (environ 250 €), désencombrement (gratuit). Résultat : des photos lumineuses, 5 visites la première semaine contre 0 en deux mois, et une offre à **−2 %** du prix affiché au lieu des **−8 %** que les acheteurs réclamaient sur le bien « négligé »."
        ]
      },
      {
        "titre": "La photo qui vend",
        "contenu": [
          "90 % des recherches commencent en ligne : la **première photo décide** du clic. Sans clic, pas de visite ; sans visite, pas d'offre.",
          "Votre annonce est en concurrence avec des dizaines d'autres sur un écran de smartphone : la **photo de couverture** est votre **affiche de cinéma**.",
          "## La lumière, reine de la photo immobilière",
          "- **Lumière naturelle** : volets et rideaux ouverts, en journée, jamais à contre-jour (ne shootez pas une fenêtre de face en plein midi).",
          "- **Heure idéale** : milieu de journée pour les intérieurs ; pour une façade plein sud en PACA, préférez le matin ou la fin d'après-midi (lumière douce, ombres longues).",
          "- **Toutes les lumières allumées** en complément, ampoules de même teinte, pour chasser les zones sombres.",
          "- **Le mode HDR** du smartphone équilibre en une prise les intérieurs sombres et les fenêtres surexposées.",
          "## Le cadrage",
          "- **Grand angle** mais sans déformer : un objectif trop large courbe les murs et **ment** sur les volumes (gare à la déception en visite).",
          "- **Hauteur de prise de vue** : à hauteur de poitrine (environ 1,50 m), ni au niveau des yeux, ni au sol.",
          "- **Lignes droites** : verticales parfaitement droites (tenez l'appareil de niveau) ; une photo « penchée » fait amateur.",
          "- **Profondeur** : shootez depuis un angle de la pièce pour montrer le volume, pas depuis la porte face au mur.",
          "- **Format paysage** (horizontal) : c'est le format attendu par les portails, qui recadrent les photos verticales.",
          "## Le matériel utile",
          "- Un **trépied** (ou un appui stable) pour des photos nettes en basse lumière et des verticales droites.",
          "- Un **chiffon** pour nettoyer l'objectif : une trace invisible gâche une photo sur deux.",
          "- De quoi **dégager le champ** : on retire ce qui traîne avant de déclencher, on ne corrigera pas tout après.",
          "## Quantité et ordre",
          "- **15 à 25 photos** nettes valent mieux que 50 médiocres : chaque pièce, les extérieurs, les atouts (vue, cheminée, terrasse).",
          "- **Ordre** : commencez par la plus belle pièce ou la façade la plus flatteuse, finissez par les pièces techniques (jamais la couverture sur la salle de bains ou le garage).",
          "- Ajoutez un **plan 2D** coté : il rassure et réduit les visites inutiles.",
          "- Ne cachez aucune pièce : une annonce sans photo de cuisine ou de salle de bains fait **suspecter le pire**.",
          "## Smartphone ou photographe professionnel ?",
          "- Un **smartphone récent** bien utilisé (pied, mode HDR, lumière maîtrisée) suffit pour un bien standard.",
          "- Pour un **bien d'exception** ou haut de gamme, le **photographe professionnel** (objectifs dédiés, flash déporté, retouche) est un investissement rentable : il « premiumise » le bien et valorise vos honoraires.",
          "## Retouche : la ligne rouge",
          "- Retouche **autorisée** : luminosité, redressement des perspectives, ciel grisé rééclairci, netteté.",
          "- Retouche **interdite** : effacer une ligne électrique, un vis-à-vis, une fissure, ou agrandir une pièce. C'est une **pratique commerciale trompeuse** (article L.121-2 du Code de la consommation), et la déception en visite **tue** la vente.",
          "## Droit à l'image et vie privée",
          "- Sur les photos d'un intérieur occupé : retirez ou masquez **photos de famille, documents, objets de valeur** (respect de la vie privée et sécurité).",
          "- Évitez de rendre identifiables des **personnes** ou des **plaques d'immatriculation**.",
          "## La check-list avant de déclencher",
          "- Volets ouverts, toutes lumières allumées, ampoules de même teinte.",
          "- Lits faits, plans de travail vides, cuvettes des WC fermées.",
          "- Câbles rangés, poubelles et gamelles hors champ, objets personnels retirés.",
          "- Objectif propre, appareil tenu de niveau, format paysage.",
          "## Erreurs fréquentes",
          "- Photos en **format portrait** au lieu du paysage : le portail recadre et ampute le visuel.",
          "- Reflet du **photographe** dans un miroir ou une fenêtre.",
          "- Cuvette de WC **ouverte**, serviette qui traîne, poubelle ou gamelle visibles.",
          "- Photos prises **un jour de pluie**, ciel blanc, luminaires éteints.",
          "## Mini cas pratique",
          "Villa avec vue sur l'étang de Berre. Premier jet du propriétaire : photos prises à 18 h en hiver, salon sombre, couverture sur le portail d'entrée. Zéro contact en trois semaines. Reshoot : matin lumineux, terrasse dressée, couverture sur la **vue** → +600 vues la première semaine et 4 demandes de visite. Même bien, même prix : seule la **mise en image** a changé."
        ]
      },
      {
        "titre": "Vidéo, visite 360° & drone",
        "contenu": [
          "Après la photo, la **vidéo** et la **visite immersive** sont les armes qui différencient une annonce et retiennent l'acheteur plus longtemps.",
          "Plus un internaute reste sur votre annonce, mieux elle **remonte** dans les portails et plus la **projection** est forte.",
          "## La visite vidéo",
          "- Une **visite guidée filmée** (60 à 120 secondes) raconte le **parcours** du bien : entrée, séjour, cuisine, chambres, extérieur, dans l'ordre d'une vraie visite.",
          "- Filmez des **mouvements lents et fluides** (stabilisateur ou appui), à l'horizontale, en suivant la lumière.",
          "- Ajoutez un **sous-titrage** des atouts (surface, exposition, « à 450 m de la plage ») : la majorité des vidéos sociales se regardent **sans le son**.",
          "- Terminez par un **appel à l'action** : « Visite sur rendez-vous, contactez CENTURY 21 Icaza Immobilier. »",
          "## La visite virtuelle 360°",
          "- La **visite 360°** permet à l'acheteur de « se promener » dans le bien à toute heure, depuis son canapé : elle **filtre** les visiteurs et attire les acquéreurs **éloignés** (mutations, expatriés, résidence secondaire).",
          "- Elle est particulièrement rentable sur les biens recherchés à distance : le littoral PACA attire des acheteurs de toute la France.",
          "- Dans l'application, le module **Montage vidéo & 360°** aide à produire des visites immersives.",
          "## Le drone : spectaculaire mais réglementé",
          "La **prise de vue par drone** sublime une villa, un terrain, une situation (proximité mer, port, pinède). Mais le vol est **strictement encadré** par la réglementation européenne appliquée en France sous le contrôle de la **DGAC**.",
          "- Tout drone équipé d'une **caméra** impose d'**enregistrer l'exploitant** sur le portail **AlphaTango** — même un appareil de **moins de 250 g** (type DJI Mini), car il capte des **données personnelles**. Le numéro d'exploitant doit être apposé sur l'appareil.",
          "- Le **télépilote** doit suivre la **formation en ligne** et détenir l'attestation correspondant à la catégorie de vol (exigée dès 250 g).",
          "- Règles de vol : **interdiction de survoler des personnes**, altitude limitée à **120 m**, et vol très restreint en **agglomération** (dérogation préfectorale souvent nécessaire).",
          "- Respect du **droit à l'image** et du **RGPD** : ne pas rendre identifiables les propriétés voisines, les personnes ou les plaques.",
          "- En pratique : **sous-traitez à un télépilote professionnel déclaré et assuré**. Le coût (souvent 150 à 350 € la prestation) est vite amorti sur un beau bien, et vous êtes couvert juridiquement.",
          "## Le home-staging virtuel en vidéo",
          "- Sur un bien vide, certains outils meublent numériquement une visite : même règle que pour la photo, mention **« projection, non contractuel »** obligatoire.",
          "## Quand investir dans la vidéo et le drone",
          "- **Vidéo** : utile sur presque tous les biens, indispensable sur ceux à fort pouvoir émotionnel (vue, extérieur, cachet).",
          "- **Drone** : réservé aux biens dont la **situation** ou le **terrain** est un atout (villa, mas, terrain, proximité mer).",
          "- **360°** : prioritaire quand les acheteurs sont **à distance** ou pour filtrer les visites d'un bien très demandé.",
          "## Erreurs fréquentes",
          "- Vidéo **trop longue** et nombriliste : au-delà de deux minutes, on décroche.",
          "- Vol de drone **sauvage** au-dessus du voisinage : risque juridique et conflit de voisinage assurés.",
          "- Qualité vidéo **inférieure** aux photos : la vidéo doit rehausser le bien, jamais le dégrader.",
          "- Confier un vol à un prestataire **non déclaré et non assuré** : en cas d'incident, la responsabilité remonte jusqu'à l'agence.",
          "## Mini cas pratique",
          "Mas provençal avec piscine à l'écart de Martigues. Les photos au sol ne montrent ni le terrain ni le calme environnant. Une **prise de drone** (prestataire certifié) révèle 2 500 m² de terrain arboré et l'absence totale de vis-à-vis. La séquence drone en ouverture de la vidéo génère un afflux de contacts d'acheteurs en quête de résidence secondaire."
        ]
      },
      {
        "titre": "Rédiger l'annonce qui convertit",
        "contenu": [
          "La photo donne le **clic**, l'annonce donne le **contact**. Une annonce se lit en **diagonale** : chaque ligne doit mériter la suivante.",
          "## Le titre : votre accroche",
          "- Orienté **bénéfice**, pas seulement technique : « T3 avec terrasse plein sud et vue sur l'étang » plutôt que « Appartement 3 pièces 65 m² ».",
          "- Intégrez un **mot déclencheur** vrai : « rare », « coup de cœur », « sans vis-à-vis », « au calme », « lumineux » — jamais mensonger.",
          "- Mentionnez la **localisation désirable** quand elle est vendeuse (quartier de l'Île à Martigues, Côte Bleue, proximité du port).",
          "## La structure gagnante",
          "- **Phrase d'accroche** : plantez le décor et l'émotion en une ligne.",
          "- **Description du parcours** : faites visiter par les mots, dans l'ordre d'une vraie visite.",
          "- **Les atouts factuels** : surface, nombre de pièces, exposition, étage, extérieur, stationnement, chauffage, travaux récents.",
          "- **L'environnement** : commerces, écoles, transports, plage, axes (A55 vers Marseille).",
          "- **L'appel à l'action** : « Visite sur rendez-vous, contactez votre conseiller CENTURY 21 Icaza Immobilier. »",
          "Pour l'écriture émotionnelle et le choix des mots, appuyez-vous sur le module **Les mots qui font vendre**.",
          "## Les informations clés attendues",
          "- Surface (**loi Carrez** en copropriété), nombre et type de pièces, étage, exposition.",
          "- **Classe énergie (DPE)** et **GES** : ils sont **obligatoires** dans toute annonce.",
          "- Charges de copropriété et honoraires d'agence.",
          "## Les mentions légales obligatoires (rappel)",
          "Une annonce non conforme est un **risque juridique** et peut être sanctionnée. La liste complète est détaillée dans la leçon **Conformité & mentions légales** de ce module et dans les modules **Loi ALUR** et **DPE**. En synthèse doivent figurer : les **honoraires** (montant ou pourcentage TTC et qui les paie), l'**étiquette DPE et GES** avec l'estimation des coûts annuels d'énergie, les mentions de **copropriété** et l'identité de l'agence.",
          "## Le ton juste",
          "- Écrivez **court** : des phrases simples, un vocabulaire concret, zéro jargon.",
          "- Soyez **positif et sincère** : on valorise sans survendre ; une promesse non tenue se retourne en visite.",
          "- Parlez à **une personne** : « vous » plutôt que « le visiteur ».",
          "## Être trouvé dans les recherches",
          "- Reprenez les **mots que tapent les acheteurs** : « maison de pêcheur Martigues », « T2 avec parking », « villa piscine ».",
          "- Renseignez **tous les critères** du portail (filtres) : un bien mal catégorisé n'apparaît pas dans les recherches filtrées.",
          "## Erreurs fréquentes",
          "- Annonce **tout en majuscules** ou pleine de fautes : perte de crédibilité immédiate.",
          "- **Abréviations** cryptiques (« gd séj, cuis am, 2 ch, sdb ») : illisible et froid.",
          "- Copier-coller une annonce **passe-partout**, sans âme ni localisation.",
          "- Oublier une **mention obligatoire** (DPE, honoraires) : c'est illégal.",
          "- Donner l'**adresse exacte** : on protège le vendeur (démarchage, sécurité, visites sauvages).",
          "## Mini cas pratique",
          "Avant : « Appt T3 65 m² 2e ét, cuis, séj, 2 ch, sdb, bon état, DPE D. » Après : « Coup de cœur plein sud — Dans un quartier calme de Martigues, ce T3 de 65 m² baigné de lumière vous ouvre sa terrasse avec vue sur l'étang. Séjour chaleureux, cuisine ouverte, deux vraies chambres, à deux pas des commerces et de l'A55. DPE D. Honoraires 4,5 % TTC à la charge du vendeur. Visite sur rendez-vous. » Même bien : la seconde version génère trois fois plus de contacts."
        ]
      },
      {
        "titre": "Conformité & mentions légales de la communication immobilière",
        "contenu": [
          "Communiquer sur un bien engage votre **responsabilité professionnelle**. Une annonce non conforme expose à des **sanctions administratives et pénales** et fragilise la vente. La conformité n'est pas une contrainte : c'est un **gage de sérieux** qui rassure vendeurs et acquéreurs.",
          "## Pas de publicité sans mandat (loi Hoguet)",
          "- La **loi Hoguet** (loi n°70-9 du 2 janvier 1970) interdit de diffuser une annonce sur un bien pour lequel vous ne détenez pas de **mandat écrit**.",
          "- Le mandat doit vous **autoriser expressément la publicité** et préciser les supports.",
          "- Exercer suppose une **carte professionnelle** (carte T « Transactions ») en cours de validité, délivrée par la CCI.",
          "## L'affichage des honoraires (arrêté du 10 janvier 2017)",
          "- Les honoraires s'affichent **toutes taxes comprises (TTC)**, avec l'indication de **qui les paie** (vendeur ou acquéreur).",
          "- Quand ils sont à la **charge de l'acquéreur**, l'annonce indique le **prix honoraires inclus**, le **pourcentage ou montant TTC** des honoraires et le **prix hors honoraires** (prix net vendeur) servant de base de calcul.",
          "- Quand ils sont à la **charge du vendeur**, on affiche le **prix honoraires inclus** payé par l'acquéreur.",
          "- Le **barème** des honoraires doit être affiché en agence et sur le site de l'agence.",
          "## DPE, GES et coût de l'énergie dans l'annonce",
          "- Depuis le **1er juillet 2021**, le **DPE est opposable** : ses informations engagent celui qui les communique.",
          "- Toute annonce affiche l'**étiquette énergie (DPE)** et l'**étiquette climat (GES)**.",
          "- Depuis le **1er janvier 2022** (loi Climat et Résilience), elle indique aussi l'**estimation des coûts annuels d'énergie** (fourchette en euros et année de référence).",
          "- Pour une **passoire énergétique (classe F ou G)**, la mention **« logement à consommation énergétique excessive »** est obligatoire.",
          "- Rappel transaction : un **audit énergétique** est exigé à la vente des logements classés **F et G** (depuis avril 2023) et **E** (depuis le 1er janvier 2025).",
          "## Les mentions propres à la copropriété (loi ALUR)",
          "- Préciser que le bien est en **copropriété** et le **nombre de lots** de la copropriété.",
          "- Indiquer le **montant des charges courantes annuelles** (quote-part du budget prévisionnel).",
          "- Signaler toute **procédure** en cours (administration provisoire, plan de sauvegarde).",
          "- Mentionner la **surface loi Carrez** pour les lots concernés.",
          "## La pratique commerciale trompeuse : la ligne rouge",
          "- Effacer un défaut permanent (fissure, vis-à-vis), gonfler une surface, inventer un atout : c'est une **pratique commerciale trompeuse** (articles L.121-2 à L.121-4 du Code de la consommation).",
          "- Les sanctions sont lourdes : jusqu'à **2 ans d'emprisonnement** et **300 000 € d'amende**, montant pouvant être porté à un pourcentage du chiffre d'affaires.",
          "- La règle d'or : on **valorise sans jamais tromper** ; tout ce qui est affiché doit être vrai et vérifiable en visite.",
          "## Données personnelles et droit à l'image (RGPD)",
          "- Les **contacts** collectés (annonces, portes ouvertes, publicités ciblées) sont des données personnelles : finalité claire, **consentement**, durée de conservation limitée, droit d'accès et d'effacement.",
          "- Sur les **visuels** : pas de personnes ni de plaques identifiables, pas d'objets de valeur ou de documents privés visibles.",
          "- La **feuille d'émargement** des portes ouvertes est un fichier à protéger comme tel.",
          "## Le panneau « À vendre » et les supports print",
          "- Le panneau exige l'**autorisation écrite du vendeur** (via le mandat) et, en copropriété, souvent l'accord du **syndic ou de l'assemblée** pour une pose en façade.",
          "- Il doit respecter le **règlement local de publicité** de la commune.",
          "- On **retire** le panneau dès le compromis signé.",
          "## Erreurs fréquentes",
          "- Diffuser un bien **sans mandat** ou sans autorisation de publicité.",
          "- Oublier le **DPE, le GES** ou l'affichage correct des **honoraires**.",
          "- Retoucher une photo au point de **tromper** l'acquéreur.",
          "- Conserver et réutiliser des **contacts** sans base légale.",
          "## Mini cas pratique",
          "Un conseiller diffuse un T4 avec une photo dont il a numériquement effacé un pylône électrique proche. En visite, l'acquéreur découvre le pylône, se sent trompé et renonce — puis laisse un avis négatif public. La leçon : la retouche « cosmétique » est permise, l'effacement d'un **défaut permanent** est une **pratique trompeuse** qui coûte la vente et la réputation."
        ]
      },
      {
        "titre": "La diffusion : portails, site & vitrine",
        "contenu": [
          "Le meilleur home-staging et la plus belle annonce ne servent à rien s'ils ne sont pas **vus par les bons acheteurs**. La diffusion, c'est la **puissance de feu**.",
          "## La multidiffusion maîtrisée",
          "- Depuis votre **logiciel de transaction**, publiez **simultanément** sur les grands portails : **Leboncoin** (la plus grosse audience), **SeLoger**, **Bien'ici**, le **site century21.fr** et le **site de l'agence**.",
          "- Une **annonce cohérente partout** (même prix, mêmes photos, même texte) : un bien affiché à des prix différents selon les sites **détruit la confiance**.",
          "- La diffusion suppose une **autorisation de publicité** inscrite dans le mandat (loi Hoguet).",
          "## Le prix d'affichage et les seuils de recherche",
          "- Les acheteurs filtrent par **tranches de prix** : un bien à 305 000 € n'apparaît pas dans la recherche « jusqu'à 300 000 € ».",
          "- Positionner le prix **juste sous un seuil rond** (299 000 plutôt que 305 000) élargit l'audience visible.",
          "- Un prix affiché **au-dessus du marché** réduit mécaniquement le nombre de vues, quel que soit le budget de diffusion.",
          "## Les leviers de visibilité payants",
          "- **Remontées et boost** : remettre l'annonce en tête de liste relance les vues (utile vers J+10, quand le flux naturel retombe).",
          "- **Mise en avant** (annonce « à la une », « premium ») sur les portails : à réserver aux biens stratégiques ou qui s'essoufflent.",
          "- Un budget de diffusion payant se **justifie en exclusivité** et se **présente au vendeur** dans le plan marketing.",
          "## La vitrine de l'agence",
          "- La **vitrine** reste un média puissant **localement** : à Martigues, une vitrine bien placée capte les passants et les acheteurs du secteur.",
          "- Fiches **lumineuses, à jour, soignées** ; retirez les biens vendus (une vitrine datée fait fuir).",
          "- La vitrine valorise aussi **l'agence et le conseiller**, pas uniquement les biens.",
          "## Le site et la marque réseau",
          "- Appartenir à un **réseau national** (CENTURY 21) offre une **notoriété** et une **audience** qu'une agence isolée n'a pas : c'est un argument de prise de mandat.",
          "- Le **fichier commun** du réseau permet le **rapprochement** entre vos biens et les acquéreurs des autres agences du groupe.",
          "## L'inter-agences",
          "- En exclusivité, pensez à la **délégation de mandat** avec des confrères de confiance pour élargir la diffusion sans multidiffuser « sauvagement ».",
          "- La commission se **partage** selon un accord écrit : la diffusion gagne en portée, le vendeur n'y voit qu'un interlocuteur unique.",
          "## Rafraîchir sans « cramer » l'annonce",
          "- Variez la **photo de couverture** pour relancer la courbe des vues sans republier à neuf.",
          "- Mettez à jour le **titre** et les premières lignes selon les retours.",
          "- Évitez de **supprimer puis republier** sans cesse : les portails et les acheteurs réguliers repèrent le manège.",
          "## Erreurs fréquentes",
          "- **Multidiffusion sauvage** par le propriétaire sur six agences : prix et photos incohérents, le bien paraît « brûlé ».",
          "- Laisser une annonce **dormir** sans jamais la relancer ni la rafraîchir.",
          "- Oublier de **retirer** l'annonce (et la vitrine) après le compromis : contacts inutiles et faux espoirs.",
          "- Diffuser des **photos différentes** d'un portail à l'autre : incohérence qui brouille le message.",
          "## Mini cas pratique",
          "Un bien correctement diffusé sur Leboncoin, SeLoger, Bien'ici, century21.fr et en vitrine génère l'essentiel de ses contacts dès la première semaine. Passé J+10, les vues chutent : une **remontée** programmée et une photo de couverture alternée relancent la courbe. Suivre ces chiffres (voir la dernière leçon) permet d'agir **avant** que le bien ne « vieillisse »."
        ]
      },
      {
        "titre": "Signalétique, print & marketing local",
        "contenu": [
          "Internet capte les acheteurs qui **cherchent**. Le marketing **local et physique** touche ceux qui ne cherchent pas encore, dans le quartier même du bien — souvent les acquéreurs les plus **motivés** (proximité, attachement au secteur).",
          "## Le panneau « À vendre »",
          "- C'est une **publicité quasi gratuite 24 h/24** qui travaille pour vous, et un signal de **dynamisme** pour le voisinage (futurs vendeurs compris).",
          "- Il déclenche des contacts d'acheteurs qui veulent **rester dans le quartier** : des prospects très qualifiés.",
          "- Conditions légales : **autorisation écrite du vendeur**, accord du syndic en copropriété, respect du règlement local de publicité (voir la leçon **Conformité & mentions légales**).",
          "- On le veut **propre, droit, lisible** et on le **retire dès le compromis**.",
          "## Les flyers et l'information de quartier",
          "- Un flyer **« Nouveau bien en vente dans votre quartier »** distribué autour du bien peut révéler un voisin acheteur ou un futur vendeur.",
          "- Le flyer **« Vendu »** après la vente est un formidable outil de **prise de mandat** : il prouve votre efficacité, chiffres de délai à l'appui.",
          "- Soignez le visuel : une **belle photo**, un message court, le logo du réseau, un seul **appel à l'action** (un numéro, un QR code).",
          "## Le phoning et la prospection ciblée",
          "- Autour d'un nouveau bien, informer son **fichier** et son secteur par téléphone reste le canal le plus **direct**.",
          "- Respect des règles : opposition au démarchage (**Bloctel**), horaires encadrés, consentement RGPD pour la réutilisation des données.",
          "## La presse et les supports locaux",
          "- Un encart dans un **journal local** ou un magazine de quartier touche une cible **plus âgée** ou peu connectée, parfois décisive sur certains biens.",
          "- Les **vitrines partenaires**, commerces et panneaux d'affichage municipaux complètent la présence locale.",
          "## La cohérence de marque",
          "- Tous vos supports (panneau, flyer, vitrine, annonce) doivent partager la **même charte** : logo du réseau, couleurs, ton.",
          "- Une communication **homogène** installe la **notoriété** : à force de vous voir, le secteur pense à vous le jour où il vend.",
          "## Erreurs fréquentes",
          "- Poser un panneau **sans l'accord écrit** du vendeur ou du syndic.",
          "- Oublier de **retirer** le panneau ou les flyers après la vente.",
          "- Un support **daté ou négligé** (photo floue, numéro effacé) qui dessert l'image de l'agence.",
          "- Du phoning **hors cadre** (Bloctel, horaires) qui expose à des sanctions.",
          "## Mini cas pratique",
          "Une maison du quartier de Ferrières à Martigues reçoit un simple panneau soigné et un flyer dans les boîtes voisines. Trois jours plus tard, un couple déjà locataire à 200 mètres, qui ne consultait aucun portail, appelle pour visiter : il voulait rester dans le quartier. Offre en une semaine. Le **marketing local** a touché un acheteur que le digital seul n'aurait jamais atteint."
        ]
      },
      {
        "titre": "Réseaux sociaux & marketing digital",
        "contenu": [
          "Les acheteurs ne cherchent pas tous activement : beaucoup **tombent** sur le bien parfait dans leur fil d'actualité. Les réseaux sociaux **créent** de la demande là où les portails captent la demande **existante**.",
          "## Les plateformes et leurs usages",
          "- **Facebook** : la **Marketplace** (très consultée en local), votre **page agence**, et surtout les **groupes locaux** (« J'achète / je vends à Martigues », groupes de mutations professionnelles).",
          "- **Instagram** : le visuel roi — **Reels** (vidéos courtes), **stories** (coulisses, « nouveau bien »), **carrousels** de photos. Idéal pour les beaux biens.",
          "- **TikTok** : les **visites immersives** courtes et rythmées touchent un public jeune de primo-accédants.",
          "- **YouTube** : héberge vos **visites vidéo** longues (lien repris dans l'annonce).",
          "- **LinkedIn** : pertinent pour l'**investisseur** et les biens professionnels ou tertiaires.",
          "## La publicité ciblée",
          "- Les **publicités Meta** (Facebook, Instagram) permettent de **cibler** par zone, âge et centres d'intérêt, et de récolter des **contacts** via un formulaire intégré.",
          "- Budget modeste (quelques dizaines d'euros) pour un **test** ; à réserver aux biens où l'on cherche un profil précis (investisseur, résidence secondaire).",
          "- Respect du **RGPD** : les contacts collectés doivent être traités avec **consentement** et dans une finalité claire.",
          "## Le format qui marche",
          "- **Vidéo verticale** (plein écran mobile), avec les **3 premières secondes** choc (le meilleur atout d'abord).",
          "- **Sous-titres** systématiques (lecture sans le son).",
          "- Un **appel à l'action** clair : « Message privé pour visiter ».",
          "- Publiez aux **heures de forte audience** (midi, soirée, dimanche soir).",
          "## Le personal branding du conseiller",
          "- Les gens achètent **à quelqu'un** : montrez le **conseiller**, le secteur, les ventes réalisées (avec l'accord des clients), les avis.",
          "- Tenez un **calendrier éditorial** simple : nouveau bien, bien vendu, conseil, portrait de quartier (« Vivre à Martigues »).",
          "- La **régularité** prime sur la perfection : deux à trois publications par semaine ancrent votre notoriété locale.",
          "## Mesurer ce qui compte",
          "- Les **vrais indicateurs** sont les **messages**, les **contacts** et les **visites**, pas le nombre de « likes ».",
          "- Des milliers de vues sans un seul message, c'est de la **vanité** : ajustez le bien montré, l'accroche ou l'appel à l'action.",
          "## Erreurs fréquentes",
          "- Publier l'annonce brute **sans adapter** le format (photo horizontale sur un Reel vertical).",
          "- **Négliger les messages privés** : un contact social qui attend 24 heures est perdu.",
          "- Diffuser **sans accord du vendeur** ou en révélant l'adresse.",
          "- Acheter des **abonnés** ou gonfler les chiffres : de la vanité sans conversion.",
          "## Mini cas pratique",
          "Un Reel de 20 secondes (drone, terrasse, vue sur l'étang, sous-titré, publié un dimanche soir) sur un T3 à Martigues génère 8 messages privés en 48 heures, dont 2 visites. Coût : 0 €, juste 15 minutes de montage. Le réseau social a **créé** une demande qu'aucun portail n'aurait révélée."
        ]
      },
      {
        "titre": "Lancement commercial : teasing, fichier & portes ouvertes",
        "contenu": [
          "Un bien ne se « met pas en ligne », il se **lance**. Un lancement orchestré crée de la **rareté** et de la **compétition** dès le premier jour — là où un bien qui traîne perd de la valeur.",
          "## La règle d'or : l'effet de nouveauté",
          "Un bien est le plus désirable dans ses **15 premiers jours**. Au-delà, l'acheteur régulier le voit « encore là » et suppose un **problème** (prix, défaut). On ne gâche donc **jamais** ce capital avec des photos bâclées ou une mise en ligne prématurée.",
          "## Étape 1 — Le teasing",
          "- Avant la mise en ligne, annoncez **« bientôt disponible »** à votre fichier et sur vos réseaux : une photo d'ambiance, pas l'adresse, pas tout.",
          "- Le teasing **crée l'attente** et concentre la demande sur le jour J.",
          "## Étape 2 — Le fichier acquéreurs (off-market)",
          "- En **exclusivité**, présentez d'abord le bien à vos **acquéreurs qualifiés** : le **rapprochement automatique** de l'application vous les sort instantanément.",
          "- Un bien vendu **avant diffusion publique** (« off-market ») prouve au vendeur la **puissance de votre fichier** et valorise l'exclusivité.",
          "- Appelez, ne vous contentez pas d'un mail : « Madame Robert, j'ai LE bien que vous cherchiez. Il n'est pas encore en ligne, je vous le propose en avant-première. »",
          "## Étape 3 — La mise en ligne multicanale",
          "- Le jour J : publication **simultanée** sur tous les canaux, au **meilleur niveau** (photos, vidéo, annonce finalisée).",
          "- On vérifie la **conformité** de chaque annonce avant publication (DPE, honoraires, mentions) : voir la leçon dédiée.",
          "## Étape 4 — Les portes ouvertes",
          "- Concentrer les visites sur une **demi-journée** crée une **émulation** : les acheteurs se croisent, sentent la concurrence et passent à l'offre plus vite.",
          "- Préparez : accord écrit du vendeur, **bien sans ses occupants** le jour J, signalétique, fiche à remettre, feuille d'**émargement** (traçabilité et RGPD), home-staging impeccable.",
          "- **Qualifiez** en amont : on invite des acheteurs **financés** et réellement intéressés, pas des curieux.",
          "- Sécurité : ne jamais laisser un visiteur **seul**, rangez objets de valeur et papiers.",
          "- Débrief le soir même : relancez chaque visiteur à chaud pour recueillir le ressenti et les **offres**.",
          "## Le calendrier type",
          "- J−5 : préparation et shooting ; J−3 : teasing fichier et réseaux ; J : mise en ligne et appels au fichier ; J+5 à J+7 : portes ouvertes ; J+7 : **premier bilan** au vendeur.",
          "## Erreurs fréquentes",
          "- Diffuser **avant** d'avoir préparé et photographié (nouveauté gâchée).",
          "- Négliger le **fichier** et aller directement au « tout public ».",
          "- Portes ouvertes **sans qualification préalable** : on fait défiler des curieux.",
          "- Ne pas **débriefer** : les signaux les plus précieux (objections, perception du prix) se perdent.",
          "## Mini cas pratique",
          "Maison avec jardin à Martigues, lancée un mardi par teasing au fichier, 6 acquéreurs qualifiés appelés le mercredi, portes ouvertes le samedi : 5 groupes en 3 heures, 2 offres le soir même dont une au prix. Vendue en **9 jours**, sans jamais « traîner » publiquement. L'orchestration a remplacé des mois d'attente."
        ]
      },
      {
        "titre": "Piloter la performance : KPIs & bilan vendeur",
        "contenu": [
          "Le marketing n'est pas une **croyance**, c'est une **mesure**. Ce qui se mesure se pilote : suivre les bons indicateurs permet de **corriger vite** et de garder le vendeur **aligné**.",
          "## L'entonnoir chiffré",
          "- **Vues / impressions** : combien de fois l'annonce est apparue, par portail.",
          "- **Contacts (leads)** : appels, mails, messages — l'annonce donne-t-elle envie d'en savoir plus ?",
          "- **Visites** : combien de contacts se transforment en visite réelle.",
          "- **Offres** : l'aboutissement. On raisonne en **ratios** : combien de visites pour une offre ?",
          "## Les ratios repères",
          "- Un bien bien positionné génère l'essentiel de ses contacts dans la **première semaine**.",
          "- En rythme de croisière, on vise grossièrement **une visite pour quelques contacts** et **une offre pour quelques visites** : si un maillon décroche nettement, il désigne le problème.",
          "## La grille de diagnostic (le thermomètre)",
          "- **Peu de vues** → problème de **diffusion**, de **titre** ou de **photo de couverture**. On relance (remontée, boost), on change l'accroche et la photo n°1.",
          "- **Beaucoup de vues, peu de contacts** → le **prix perçu** paraît trop élevé au regard des photos, ou l'annonce n'engage pas. On retravaille visuels et texte, et on questionne le prix.",
          "- **Des contacts mais peu de visites** → problème de qualification ou de disponibilité ; on fluidifie la prise de rendez-vous.",
          "- **Beaucoup de visites, aucune offre** → le **prix** ne correspond pas à l'**état réel** perçu, ou un défaut rédhibitoire ressort. C'est le signal le plus clair d'un **réajustement**.",
          "## Le bilan hebdomadaire au vendeur",
          "- Un **point écrit chaque semaine** (le « bilan marché ») : vues, contacts, visites, retours des acheteurs, actions menées et actions à venir.",
          "- Il **prouve votre travail** (surtout en exclusivité), maintient la confiance et **prépare**, chiffres à l'appui, la discussion sur le prix si le marché ne répond pas.",
          "- Script : « Voici vos chiffres : 850 vues, 6 contacts, 4 visites, 0 offre. Le bien **plaît en photo** mais, en visite, les acheteurs positionnent le prix 5 % plus bas. Le marché nous **parle** : regardons ensemble. »",
          "- La discussion de prix elle-même relève des modules **Négociation** et **Défendre ses honoraires** ; ici, vous apportez la **donnée** qui la rend indiscutable.",
          "## Le rythme d'action",
          "- **J+7** : premier bilan et ajustement marketing (photos, titre, boost).",
          "- **J+21** : si peu de visites malgré une bonne diffusion, le **prix** est en cause ; on documente et on en parle.",
          "- Mieux vaut **un ajustement rapide et argumenté** qu'un bien qui s'enlise et se dévalorise semaine après semaine.",
          "## Les mnémoniques utiles",
          "- **Pas de vues** = problème d'**emballage** (titre, photo, diffusion).",
          "- **Pas de visites** malgré des vues = problème de **prix affiché**.",
          "- **Pas d'offres** malgré des visites = problème de **prix réel ou d'état**.",
          "## Erreurs fréquentes",
          "- Piloter « au feeling » sans jamais regarder les statistiques des portails.",
          "- Attendre **deux mois** avant le premier bilan : le bien a déjà vieilli.",
          "- Noyer le vendeur sous les chiffres sans **interprétation** ni recommandation.",
          "## Mini cas pratique",
          "T2 à Martigues : à J+7, 1 100 vues mais seulement 2 contacts. Diagnostic : l'emballage attire (bonne photo), mais le **prix perçu** freine. On ne touche pas aux visuels, on prépare le vendeur avec les chiffres. À J+21, après un réajustement de 4 %, 5 visites en une semaine et une offre. Le pilotage a transformé un bien bloqué en vente — **sans** le brader, juste en lisant le marché."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Le home-staging sert surtout à…",
        "options": [
          "Masquer des vices cachés",
          "Augmenter la surface habitable",
          "Déclencher le coup de cœur et la projection de l'acheteur",
          "Gagner du temps chez le notaire"
        ],
        "correct": 2,
        "explication": "Désencombrer, dépersonnaliser, neutraliser et soigner l'ambiance aident un maximum d'acheteurs à se projeter, ce qui accélère la vente et réduit la négociation. Le home-staging ne masque jamais un vice : ce serait trompeur."
      },
      {
        "question": "La photo de couverture d'une annonce doit être…",
        "options": [
          "La plus belle pièce ou la façade la plus flatteuse",
          "La salle de bains",
          "Le local poubelles",
          "Un plan cadastral"
        ],
        "correct": 0,
        "explication": "90 % des recherches commencent en ligne : la première photo décide du clic. On ouvre donc sur l'atout le plus séduisant (plus belle pièce, vue, façade), jamais sur une pièce technique."
      },
      {
        "question": "Pour une photo immobilière réussie, on privilégie…",
        "options": [
          "Un objectif ultra-large qui courbe les murs",
          "Le flash en pleine nuit",
          "Le format portrait vertical",
          "La lumière naturelle, volets ouverts, de jour et sans contre-jour"
        ],
        "correct": 3,
        "explication": "La lumière naturelle met en valeur les volumes ; le contre-jour, le format portrait et un grand angle déformant trahissent les volumes et font amateur."
      },
      {
        "question": "Pour filmer une villa au drone, la bonne pratique est de…",
        "options": [
          "Voler librement au-dessus du voisinage",
          "Monter à 300 m pour un plan plus large",
          "Confier le vol à un télépilote déclaré sur AlphaTango (tout drone à caméra s'enregistre, 120 m maxi, sans survol de personnes, dans le respect du droit à l'image)",
          "Survoler les passants pour obtenir un bel angle"
        ],
        "correct": 2,
        "explication": "Le vol est encadré : tout drone équipé d'une caméra impose d'enregistrer l'exploitant sur AlphaTango, même sous 250 g, car il capte des données personnelles ; altitude 120 m maxi, pas de survol de personnes, restrictions en agglomération, respect du droit à l'image et du RGPD. En pratique, on sous-traite à un télépilote déclaré et assuré."
      },
      {
        "question": "En exclusivité, à qui présenter le bien en priorité ?",
        "options": [
          "Aux agences concurrentes d'abord",
          "À ses acquéreurs qualifiés du fichier, en teasing ou en off-market",
          "À personne avant la mise en ligne publique",
          "Au voisinage uniquement"
        ],
        "correct": 1,
        "explication": "On active d'abord son fichier d'acquéreurs qualifiés (rapprochement automatique de l'application), parfois en off-market : cela prouve la puissance du fichier et valorise l'exclusivité."
      },
      {
        "question": "Une annonce a beaucoup de vues mais très peu de contacts. Cela signale surtout…",
        "options": [
          "Un problème de diffusion",
          "Qu'il faut réduire le nombre de photos",
          "Que le notaire est trop lent",
          "Un prix perçu trop élevé au regard des photos, ou une annonce peu engageante"
        ],
        "correct": 3,
        "explication": "Beaucoup de vues prouvent que la diffusion fonctionne ; l'absence de contacts vient du prix perçu ou d'une annonce qui n'engage pas. On retravaille visuels et texte, et on questionne le prix."
      },
      {
        "question": "Lorsque les honoraires sont à la charge de l'acquéreur, l'annonce doit afficher…",
        "options": [
          "Le prix honoraires inclus, le pourcentage ou montant TTC des honoraires et le prix hors honoraires (net vendeur)",
          "Uniquement le prix global, sans détailler les honoraires",
          "Seulement le pourcentage d'honoraires",
          "Rien : l'affichage des honoraires est facultatif"
        ],
        "correct": 0,
        "explication": "Arrêté du 10 janvier 2017 : quand les honoraires sont à la charge de l'acquéreur, l'annonce affiche le prix honoraires inclus, le pourcentage ou montant TTC des honoraires et le prix hors honoraires (net vendeur) qui sert de base de calcul. Les honoraires sont toujours indiqués TTC, avec la mention de qui les paie."
      },
      {
        "question": "Pour un logement classé F ou G, l'annonce doit obligatoirement…",
        "options": [
          "Masquer la classe énergie pour ne pas faire fuir l'acheteur",
          "Afficher le DPE, le GES, l'estimation des coûts annuels d'énergie et la mention « consommation énergétique excessive »",
          "Indiquer seulement l'année de construction",
          "Promettre une rénovation future"
        ],
        "correct": 1,
        "explication": "Depuis la loi Climat et Résilience (2022), toute annonce affiche DPE, GES et estimation des coûts annuels d'énergie ; pour une passoire F ou G, la mention « logement à consommation énergétique excessive » est obligatoire. Le DPE est opposable depuis le 1er juillet 2021."
      },
      {
        "question": "Le home-staging virtuel et la retouche photo sont permis à condition de…",
        "options": [
          "Effacer les défauts gênants comme un vis-à-vis ou une fissure",
          "Agrandir visuellement les pièces pour les rendre plus vendeuses",
          "Rester honnêtes, sans supprimer de défaut permanent, et d'indiquer « image non contractuelle »",
          "Ne jamais le signaler à l'acheteur"
        ],
        "correct": 2,
        "explication": "La retouche cosmétique (luminosité, perspectives) et le home-staging virtuel sont autorisés à condition de rester honnêtes : on ne supprime aucun défaut permanent et on mentionne « image non contractuelle ». Effacer un vis-à-vis ou une fissure est une pratique commerciale trompeuse (articles L.121-2 et L.121-3 du Code de la consommation)."
      },
      {
        "question": "Beaucoup de visites mais aucune offre : c'est le plus souvent le signe que…",
        "options": [
          "La diffusion est insuffisante",
          "Le prix réel, ou l'état perçu du bien, ne correspond pas aux attentes et un réajustement s'impose",
          "Les photos sont trop belles",
          "Le titre de l'annonce est trop long"
        ],
        "correct": 1,
        "explication": "Des visites nombreuses sans offre signifient que le bien plaît mais que le prix réel, ou l'état perçu en visite, ne suit pas : c'est le signal le plus clair d'un réajustement, documenté par le bilan vendeur."
      },
      {
        "question": "Dans le modèle AIDA appliqué à l'immobilier, qu'est-ce qui capte en premier l'Attention de l'acheteur ?",
        "options": [
          "La photo de couverture et le titre de l'annonce",
          "La visite virtuelle 360°",
          "Le prix net vendeur",
          "Le dossier de diagnostics techniques"
        ],
        "correct": 0,
        "explication": "L'Attention se joue en une seconde sur la photo de couverture et le titre, car 90 % des recherches commencent en ligne."
      },
      {
        "question": "Pendant combien de temps un bien bénéficie-t-il de son capital maximal de nouveauté aux yeux des acheteurs ?",
        "options": [
          "Ses 15 premiers jours de commercialisation",
          "Ses 6 premiers mois",
          "Toute la durée du mandat",
          "Sa première année en ligne"
        ],
        "correct": 0,
        "explication": "Un bien n'est jamais aussi désirable que dans ses 15 premiers jours, un capital de nouveauté qui ne revient pas."
      },
      {
        "question": "Un home-staging léger (désencombrement, peinture, quelques accessoires) représente généralement quel budget ?",
        "options": [
          "De 1 à 3 % du prix de vente",
          "Environ 10 % du prix de vente",
          "Au moins 15 % du prix de vente",
          "Le montant des honoraires d'agence"
        ],
        "correct": 0,
        "explication": "Quelques centaines d'euros, soit 1 à 3 % du prix, suffisent souvent à gagner des milliers d'euros et des semaines de délai."
      },
      {
        "question": "Combien de photos nettes et soignées constituent une bonne annonce immobilière ?",
        "options": [
          "Entre 15 et 25 photos",
          "Exactement 3 photos",
          "Au moins 50 photos",
          "Une seule, la photo de couverture"
        ],
        "correct": 0,
        "explication": "15 à 25 photos nettes valent mieux que 50 médiocres, en couvrant chaque pièce, les extérieurs et les atouts."
      },
      {
        "question": "Dans quel format faut-il prendre les photos destinées aux portails immobiliers ?",
        "options": [
          "Format paysage (horizontal)",
          "Format portrait (vertical)",
          "Format carré uniquement",
          "Peu importe, le portail s'adapte toujours"
        ],
        "correct": 0,
        "explication": "Les portails attendent le format paysage et recadrent les photos verticales, qui se trouvent amputées."
      },
      {
        "question": "Pour filmer un bien avec un drone équipé d'une caméra, même de moins de 250 g, l'exploitant doit obligatoirement…",
        "options": [
          "S'enregistrer sur le portail AlphaTango",
          "Ne rien faire en dessous de 250 g",
          "Obtenir un permis de construire",
          "Déclarer le vol au syndic de copropriété"
        ],
        "correct": 0,
        "explication": "Tout drone avec caméra impose l'enregistrement de l'exploitant sur AlphaTango, même un appareil de moins de 250 g, car il capte des données personnelles."
      },
      {
        "question": "À quelle altitude maximale un drone de prise de vue peut-il voler en règle générale ?",
        "options": [
          "120 mètres",
          "50 mètres",
          "300 mètres",
          "Aucune limite hors agglomération"
        ],
        "correct": 0,
        "explication": "La réglementation limite l'altitude à 120 mètres et interdit le survol de personnes, avec de fortes restrictions en agglomération."
      },
      {
        "question": "Dans toute annonce immobilière, quelles étiquettes doivent obligatoirement figurer ?",
        "options": [
          "Les étiquettes énergie (DPE) et climat (GES)",
          "Uniquement l'étiquette DPE",
          "Uniquement la surface loi Carrez",
          "Le numéro de mandat"
        ],
        "correct": 0,
        "explication": "Toute annonce doit afficher les étiquettes DPE et GES, ainsi que l'estimation des coûts annuels d'énergie."
      },
      {
        "question": "Que ne faut-il jamais indiquer dans une annonce diffusée au public ?",
        "options": [
          "L'adresse exacte du bien",
          "La classe énergétique du bien",
          "Le montant des honoraires",
          "La surface habitable"
        ],
        "correct": 0,
        "explication": "On ne donne jamais l'adresse exacte pour protéger le vendeur du démarchage, des risques de sécurité et des visites sauvages."
      },
      {
        "question": "Que faut-il obligatoirement détenir avant de diffuser une annonce sur un bien (loi Hoguet) ?",
        "options": [
          "Un mandat écrit autorisant expressément la publicité",
          "Un simple accord verbal du vendeur",
          "L'avis favorable du syndic",
          "Un compromis de vente signé"
        ],
        "correct": 0,
        "explication": "La loi Hoguet interdit toute publicité sans mandat écrit autorisant expressément la diffusion sur les supports choisis."
      },
      {
        "question": "Effacer numériquement un défaut permanent (fissure, pylône) sur une photo constitue une pratique commerciale trompeuse passible de…",
        "options": [
          "2 ans d'emprisonnement et 300 000 € d'amende",
          "Un simple avertissement",
          "Une amende de 1 500 € maximum",
          "Aucune sanction si le bien se vend"
        ],
        "correct": 0,
        "explication": "L'effacement d'un défaut permanent est une pratique commerciale trompeuse (articles L.121-2 et suivants) punie jusqu'à 2 ans de prison et 300 000 € d'amende."
      },
      {
        "question": "Quand retire-t-on le panneau « À vendre » posé devant le bien ?",
        "options": [
          "Dès la signature du compromis",
          "Seulement le jour de l'acte authentique",
          "Un an après la vente",
          "Jamais, c'est de la publicité pour l'agence"
        ],
        "correct": 0,
        "explication": "On retire le panneau dès le compromis signé pour éviter les contacts inutiles et les faux espoirs."
      },
      {
        "question": "Une annonce ne génère quasiment aucune vue : sur quel levier agir en priorité ?",
        "options": [
          "L'emballage : titre, photo de couverture et diffusion",
          "Baisser aussitôt le prix de 10 %",
          "Attendre deux mois sans rien changer",
          "Retirer les diagnostics de l'annonce"
        ],
        "correct": 0,
        "explication": "Peu de vues signale un problème d'emballage ou de diffusion : on relance, on change l'accroche et la première photo."
      }
    ]
  },
  {
    "id": "investissement-locatif",
    "titre": "Investissement locatif & rentabilité",
    "icone": "📈",
    "categorie": "Transaction",
    "resume": "Conseiller l'investisseur de A à Z : rendement, cash-flow, effet de levier, LMNP, foncier, défiscalisation, montages et revente.",
    "duree": "37 min",
    "lecons": [
      {
        "titre": "L'investisseur : une clientèle en or à comprendre",
        "contenu": [
          "L'investisseur locatif est **le meilleur client d'une agence** : il achète vite, sans affect, revient tous les 2-3 ans et recommande. Savoir lui parler, c'est sécuriser un **chiffre d'affaires récurrent** et des mandats de qualité.",
          "## Pourquoi l'investisseur vaut de l'or",
          "- **Pas d'émotion** : il achète un tableur, pas un coup de cœur. La décision est rationnelle, donc **rapide** quand les chiffres sont bons.",
          "- **Récurrent** : il construit un patrimoine sur 10 à 20 ans. Fidélisé, il repasse par vous à chaque opération.",
          "- **Prescripteur** : il fréquente d'autres investisseurs (clubs, forums, famille). Un client content vous **amène les suivants**.",
          "- **Moins regardant sur le bien, plus sur le rendement** : un logement qui ne séduit pas un occupant peut être une **pépite** pour lui. Vous écoulez un stock parfois difficile.",
          "- **Acheteur solvable** : souvent déjà propriétaire, avec de l'apport et un bon dossier bancaire. La condition suspensive de prêt saute plus rarement.",
          "## Les cinq motivations de l'investisseur",
          "Identifiez toujours le **moteur** avant de proposer quoi que ce soit : il oriente le bien, le régime fiscal et le montage.",
          "- **Rendement / cash-flow** : il veut que le bien s'autofinance, voire dégage un revenu. Priorité au couple prix/loyer.",
          "- **Patrimoine / plus-value** : il vise un beau bien dans un secteur qui prend de la valeur, quitte à accepter un rendement faible.",
          "- **Défiscalisation** : fortement imposé (TMI 30 à 45 %), il cherche à réduire son impôt sur le revenu.",
          "- **Revenu de retraite** : il prépare un complément à 15-20 ans, une fois le crédit remboursé.",
          "- **Transmission** : il pense SCI, démembrement, donation de parts aux enfants.",
          "## Primo-investisseur ou investisseur aguerri",
          "- Le **primo-investisseur** a besoin de pédagogie : expliquez les rendements, le cash-flow, les régimes. Rassurez, cadrez, ne noyez pas sous le jargon.",
          "- L'**investisseur aguerri** connaît déjà ses ratios. Ne lui faites pas perdre son temps : donnez-lui vite les chiffres et les PV d'AG, il décide seul.",
          "## Le script de découverte investisseur",
          "« Pour vous orienter vers le bon bien, j'ai besoin de comprendre votre **stratégie**. Cherchez-vous d'abord un bien qui **s'autofinance**, un bien **patrimonial** qui prendra de la valeur, ou un moyen de **réduire vos impôts** ? »",
          "Puis : « Quelle est votre **capacité d'apport** et votre effort d'épargne mensuel possible ? Visez-vous le **meublé** ou le **nu** ? Détenez-vous déjà des biens, et sous quel régime fiscal ? »",
          "## Les informations à recueillir d'emblée",
          "- **Tranche marginale d'imposition (TMI)** : elle conditionne tout le raisonnement fiscal.",
          "- **Capacité d'endettement** et apport disponible.",
          "- **Horizon de détention** et objectif de sortie (revente, retraite, transmission).",
          "- **Appétence à la gestion** : prêt à gérer lui-même, ou veut tout déléguer ?",
          "## Erreur fréquente",
          "Parler déco, luminosité ou coup de cœur à un investisseur. Il veut des **chiffres** : loyer de marché, rendement, charges, fiscalité. Parlez son langage, ou il ira voir ailleurs.",
          "## Cas pratique — Martigues",
          "Un chef de poste de la zone de Lavéra, TMI 41 %, vous dit « je veux défiscaliser ». Mauvaise réponse : lui sortir un studio à 6 % brut. Bonne réponse : qualifier (nu au réel avec travaux ? LMNP ? Denormandie dans l'ancien du centre ?), puis orienter, chiffres et expert-comptable à l'appui."
        ]
      },
      {
        "titre": "Calculer la rentabilité : les 3 rendements + le cash-flow",
        "contenu": [
          "Savoir chiffrer un investissement, c'est parler le langage de l'investisseur et **gagner sa confiance** en trente secondes. Maîtrisez ces formules par cœur.",
          "## Les trois niveaux de rendement",
          "- **Rendement brut** = (loyer annuel ÷ prix d'achat frais inclus) × 100. Rapide, mais trompeur : il ignore les charges.",
          "- **Rendement net de charges** : on déduit taxe foncière, charges de copropriété non récupérables, assurance PNO, frais de gestion, GLI, provision pour vacance et pour travaux.",
          "- **Rendement net-net (après impôt)** : on intègre la **fiscalité** (régime et TMI). C'est le seul chiffre qui compte vraiment pour l'investisseur.",
          "## Cas chiffré — un T2 à Martigues",
          "Bien : T2 de 50 m², acheté **145 000 €** frais de notaire inclus, loué **640 €/mois** soit **7 680 €/an**.",
          "- **Brut** = 7 680 ÷ 145 000 = **5,3 %**.",
          "- Charges annuelles : taxe foncière 950 €, charges de copropriété non récupérables 600 €, assurance PNO 150 €, gestion 8 % (614 €), GLI 3 % (230 €), provision vacance et travaux 400 € → **≈ 2 944 €**.",
          "- **Net de charges** = (7 680 − 2 944) ÷ 145 000 = **3,3 %**.",
          "## Le cash-flow : le vrai juge de paix",
          "Cash-flow = loyers − (mensualité de crédit + charges + impôts). Un cash-flow **positif** : le bien s'autofinance et enrichit sans effort. **Négatif** : l'investisseur **complète** chaque mois (effort d'épargne).",
          "Reprenons le T2 : emprunté sur 20 ans à 3,8 %, la mensualité est d'environ **865 €**. Soit 640 € de loyer − 865 € de crédit − 245 € de charges mensualisées = **cash-flow de −470 €/mois**. C'est un **investissement patrimonial** (on se constitue un capital), pas un placement à rendement immédiat.",
          "## Les leviers pour passer en cash-flow positif",
          "- **Négocier le prix** : chaque 10 000 € gagnés améliore directement le rendement.",
          "- **Augmenter le loyer** : meublé (+15 à 25 %), colocation, courte durée là où c'est autorisé.",
          "- **Allonger la durée** du crédit ou optimiser le **taux**.",
          "- **Changer de régime fiscal** pour supprimer l'impôt (LMNP au réel).",
          "## Deux ratios de professionnel",
          "- **Rendement sur fonds propres** = (cash-flow annuel + capital remboursé) rapporté à l'**apport** réellement mobilisé. Grâce au crédit, il dépasse largement le rendement brut : c'est l'**effet de levier**.",
          "- **TRI (taux de rendement interne)** : intègre dans le temps l'apport, les loyers, les impôts et la **revente**. L'indicateur le plus complet, calculé sur tableur.",
          "## À ne jamais oublier dans le calcul",
          "- Les **frais d'acquisition** au dénominateur : notaire, honoraires d'agence, travaux de départ, mobilier.",
          "- La **revalorisation du loyer** (indice de référence des loyers, IRL) et l'inflation des charges sur la durée.",
          "- La **fiscalité à la revente** (plus-value), qui peut effacer une partie du gain.",
          "## Mnémonique",
          "**« Le BRUT ment, le NET informe, le NET-NET décide. »** Ne laissez jamais un investisseur décider sur le seul rendement brut.",
          "## Erreur fréquente",
          "Oublier les **frais d'acquisition** au dénominateur. Un rendement calculé sur le seul prix affiché est toujours surévalué."
        ]
      },
      {
        "titre": "L'effet de levier & le financement",
        "contenu": [
          "L'immobilier est le seul placement qu'une banque finance à crédit pour un particulier. Ce **levier** est le cœur de la performance : bien utilisé, il démultiplie le rendement des fonds propres.",
          "## Le principe de l'effet de levier",
          "On investit avec l'**argent de la banque** et on rembourse avec les **loyers du locataire**. Tant que le rendement du bien dépasse le coût du crédit, chaque euro emprunté **crée de la richesse**.",
          "## Cas chiffré — le levier",
          "Bien à 145 000 €, rendement net 3,3 %.",
          "- **Scénario A, achat comptant** : le capital de 145 000 € travaille à 3,3 %. Simple, mais aucun effet de levier.",
          "- **Scénario B, apport de 20 000 € + crédit** : les loyers remboursent l'essentiel de la mensualité. Au terme, l'investisseur détient un bien de 145 000 € pour un effort de départ de 20 000 € : le **rendement sur fonds propres** est bien supérieur.",
          "## Les règles du financement (HCSF, 2024-2026)",
          "- **Taux d'endettement maximal 35 %** des revenus, **assurance emprunteur comprise**.",
          "- **Durée maximale 25 ans**, jusqu'à **27 ans** avec différé pour le neuf ou des travaux représentant au moins 10 % de l'opération.",
          "- Les banques retiennent en général **70 % des loyers** attendus comme revenu (marge pour vacance et charges).",
          "- Les banques peuvent déroger à ces règles pour une **marge de 20 % de leurs dossiers**, prioritairement en faveur de la résidence principale.",
          "## Trois notions que la banque regarde",
          "- Le **reste à vivre** : ce qui reste au foyer une fois toutes les mensualités payées.",
          "- Le **saut de charges** : l'écart entre la charge de logement actuelle de l'emprunteur et sa future charge de crédit, nette des loyers perçus.",
          "- Le **taux d'usure** : le taux maximal légal (TAEG, assurance comprise) au-delà duquel une banque ne peut pas prêter ; il est réactualisé régulièrement.",
          "## Amortissable ou in fine ?",
          "- **Crédit amortissable** : on rembourse capital + intérêts ; c'est le standard, le capital se constitue progressivement.",
          "- **Crédit in fine** : on ne paie que les intérêts, le capital est remboursé en une fois à la fin. Intérêts plus élevés mais déductibles plus longtemps → utile au **réel foncier** pour un investisseur très imposé, adossé à une épargne nantie.",
          "## Les postes à ne pas oublier",
          "- **Assurance emprunteur** : la délégation (loi Lemoine, résiliation à tout moment) coûte souvent 2 à 3 fois moins cher que le contrat bancaire.",
          "- **Frais de dossier** et **frais de garantie** (hypothèque, privilège de prêteur de deniers ou caution type Crédit Logement).",
          "- **Apport** : les banques demandent souvent 10 % pour couvrir les frais, mais un bon dossier investisseur peut obtenir un financement à 110 %.",
          "## Rôle du négociateur",
          "Vous n'êtes pas courtier, mais savoir **dégrossir la capacité d'emprunt** (revenus × 35 % − charges actuelles) et renvoyer vers un **courtier partenaire** accélère la vente. Un acheteur pré-validé est un acheteur sérieux.",
          "## Erreur fréquente",
          "Faire visiter sans avoir vérifié la **capacité de financement** : on perd du temps et on risque un compromis qui s'effondre à la condition suspensive de prêt. Rappelez que la loi Scrivener impose un **délai de réflexion de 10 jours** : l'emprunteur ne peut accepter l'offre de prêt qu'après ce délai."
        ]
      },
      {
        "titre": "La fiscalité de la location nue (revenus fonciers)",
        "contenu": [
          "La location **nue** (vide) relève des **revenus fonciers**, imposés au **barème de l'impôt sur le revenu** (votre TMI) auxquels s'ajoutent **17,2 % de prélèvements sociaux**. Deux régimes au choix.",
          "## Le micro-foncier",
          "- Accessible si les **revenus fonciers bruts ≤ 15 000 €/an**.",
          "- **Abattement forfaitaire de 30 %** : on n'est imposé que sur 70 % des loyers, sans justificatif.",
          "- Simple, mais **pénalisant** dès que les charges réelles dépassent 30 % des loyers (fréquent avec un crédit et des travaux).",
          "## Le régime réel",
          "- Obligatoire au-delà de 15 000 €, **optionnel** en dessous (option irrévocable **3 ans**, puis reconductible tacitement).",
          "- On déduit les **charges réelles** : intérêts d'emprunt, assurance, taxe foncière, charges de copropriété, frais de gestion, primes GLI, et surtout les **travaux** d'entretien, de réparation et d'amélioration.",
          "- Attention : les **travaux de construction, reconstruction ou agrandissement** ne sont **pas** déductibles.",
          "- La **CSG** payée sur les revenus fonciers est partiellement déductible (6,8 %) du revenu global de l'année suivante.",
          "## Le déficit foncier : l'arme fiscale du nu",
          "Quand les charges dépassent les loyers, on crée un **déficit foncier**.",
          "- La part de déficit **hors intérêts d'emprunt** s'impute sur le **revenu global** jusqu'à **10 700 €/an** ; l'excédent est reportable **10 ans** sur les seuls revenus fonciers.",
          "- Les **intérêts d'emprunt** ne s'imputent que sur les revenus fonciers, jamais sur le revenu global ; leur excédent se reporte aussi 10 ans.",
          "- **Bonus rénovation énergétique** : le plafond est **doublé à 21 400 €** pour les travaux faisant sortir un logement du statut de passoire (de E, F ou G vers A, B, C ou D). Mesure prolongée : elle vise les dépenses payées **de 2023 à 2027**.",
          "## Cas pratique — Martigues",
          "Un investisseur TMI 41 % achète un ancien à 160 000 € et engage **40 000 € de travaux**. Au réel, ces travaux créent un déficit : la part imputée sur le revenu global (jusqu'à **10 700 €**) lui fait économiser plus de **4 000 € d'impôt** la première année, et le reste se reporte sur les loyers à venir. Au micro-foncier, il aurait perdu tout cet avantage.",
          "## Erreur fréquente",
          "Laisser un investisseur avec travaux au **micro-foncier** « parce que c'est plus simple » : il paie l'impôt plein. Orientez vers le réel et **l'expert-comptable**."
        ]
      },
      {
        "titre": "La location meublée : LMNP & LMP",
        "contenu": [
          "La location **meublée** relève des **BIC** (bénéfices industriels et commerciaux), et non des revenus fonciers. C'est le régime **préféré des investisseurs** pour sa souplesse et sa fiscalité douce.",
          "## LMNP ou LMP ? La frontière",
          "- **LMNP (non professionnel)** : statut par défaut tant que les recettes meublées sont **≤ 23 000 €/an** OU **inférieures aux autres revenus d'activité** du foyer.",
          "- **LMP (professionnel)** : recettes **> 23 000 €/an ET** supérieures aux revenus d'activité du foyer. Régime plus lourd (cotisations sociales) mais imputation des déficits sur le revenu global et régime de plus-value professionnelle à la revente.",
          "## Les obligations à connaître",
          "- **Déclaration de début d'activité** (formulaire P0i) sur le guichet unique de l'INPI dans les **15 jours**, pour obtenir un **numéro SIRET**.",
          "- **Cotisation foncière des entreprises (CFE)** due chaque année, sauf exonération la première année et sous certains seuils de recettes.",
          "- Un **mobilier conforme** à la liste réglementaire (décret n° 2015-981) : literie, plaques de cuisson, réfrigérateur, vaisselle, table et sièges, rangements, luminaires, matériel d'entretien.",
          "## Le micro-BIC",
          "- Abattement forfaitaire de **50 %** pour la location meublée de longue durée, plafond **77 700 €/an** de recettes.",
          "- Plus généreux que le micro-foncier (30 %) : un premier avantage du meublé sur le nu.",
          "## Le réel LMNP : le graal fiscal",
          "- Déduction de **toutes les charges réelles** + **amortissement** du bien (hors valeur du terrain) et du **mobilier**.",
          "- L'amortissement est une charge « comptable » sans décaissement : il **efface tout ou partie de l'impôt** sur les loyers, souvent pendant 10 à 20 ans.",
          "- Résultat fréquent : **impôt proche de zéro** sur des loyers plus élevés qu'en nu. D'où son succès massif.",
          "## Les changements récents à connaître (2024-2026)",
          "- **Plus-value LMNP (loi de finances 2025)** : les amortissements déduits sont désormais **réintégrés** dans le calcul de la plus-value de revente (ils diminuent le prix d'acquisition retenu, donc augmentent la plus-value imposable). Exception : les **résidences services gérées** (étudiantes, seniors, EHPAD), non concernées. Calcul détaillé → module « Fiscalité : la plus-value ».",
          "- **Meublés de tourisme / type Airbnb (loi « Le Meur » du 19 novembre 2024)** : abattement micro-BIC ramené à **30 % (plafond 15 000 €)** pour les meublés de tourisme **non classés**, et **50 % (plafond 77 700 €)** pour les **classés**, à compter des revenus 2025.",
          "## Le bail meublé : les règles clés",
          "- Bail meublé de résidence principale : **1 an** (ou 9 mois non reconductible pour un étudiant), contre 3 ans en nu.",
          "- **Dépôt de garantie : 2 mois** de loyer hors charges en meublé (1 mois en nu).",
          "## Cas pratique — Martigues",
          "Même T2 à 145 000 €, meublé et loué **760 €/mois** au lieu de 640 € en nu → **9 120 €/an**. Au **réel LMNP**, l'amortissement (≈ 4 500 €/an sur le bâti et le mobilier) et les charges couvrent les loyers : **impôt proche de 0** pendant une quinzaine d'années. Le meublé transforme le rendement net-net.",
          "## Erreur fréquente",
          "Confondre meublé (BIC, amortissement) et nu (foncier, déficit) : ce sont **deux mondes fiscaux**. Et un meublé loué sans **mobilier conforme** à la liste réglementaire peut être **requalifié** en location nue."
        ]
      },
      {
        "titre": "Les dispositifs de défiscalisation",
        "contenu": [
          "Au-delà des régimes de droit commun, l'État propose des **dispositifs d'incitation**. Attention : plusieurs ont **disparu** ; ne vendez jamais un dispositif périmé.",
          "## Pinel : c'est terminé",
          "- Le **Pinel est supprimé depuis le 1er janvier 2025**. Plus aucun nouvel investissement possible. Les engagements pris jusqu'à fin 2024 courent jusqu'à leur terme.",
          "- Ne le proposez plus : c'est une **erreur grave** et un risque de mise en cause de votre responsabilité.",
          "## Denormandie : l'ancien à rénover",
          "- Prolongé jusqu'au **31 décembre 2027**. Logement **ancien** avec **travaux ≥ 25 %** du coût total de l'opération, dans certaines villes (programme **Action Cœur de Ville**, centres anciens dégradés).",
          "- Réduction d'impôt de **12 % (6 ans), 18 % (9 ans) ou 21 % (12 ans)** du montant investi (plafonné à 300 000 €), en contrepartie de plafonds de loyer et de ressources du locataire.",
          "## Loc'Avantages (ex-Cosse)",
          "- **Conventionnement avec l'Anah** : l'investisseur loue sous les plafonds de loyer en échange d'une **réduction d'impôt de 15 % à 65 %** selon la décote de loyer consentie et le recours à l'intermédiation locative.",
          "## Les niches patrimoniales",
          "- **Déficit foncier** (vu à la leçon précédente), **Malraux** (immeubles en site patrimonial remarquable, réduction calculée sur les travaux), **Monuments historiques** (déduction des charges sans plafond) : réservés aux investisseurs très imposés et avertis.",
          "- **Censi-Bouvard** : **supprimé fin 2022**, ne plus proposer.",
          "## Le plafonnement global des niches fiscales",
          "- La plupart des réductions d'impôt (Denormandie, Loc'Avantages) entrent dans le **plafonnement global des niches fiscales à 10 000 €/an**.",
          "- Le **déficit foncier** et l'**amortissement LMNP** n'y entrent **pas** : ce sont des charges déductibles, pas des réductions d'impôt. D'où leur puissance.",
          "## Rôle du négociateur",
          "Connaître ces dispositifs permet de **détecter une opportunité** (un bien éligible Denormandie dans le centre ancien de Martigues, par exemple) et d'**orienter**, sans jamais se substituer au conseil fiscal.",
          "## Erreur fréquente",
          "Survendre la « défisc ». Un dispositif ne rend pas bon un mauvais bien. Règle d'or : **l'investissement doit tenir debout sans l'avantage fiscal**. La carotte fiscale ne doit jamais faire oublier l'emplacement et le rendement."
        ]
      },
      {
        "titre": "Analyser un bien pour investir",
        "contenu": [
          "Avant de proposer un bien à un investisseur, passez-le au crible d'une **grille d'analyse**. Un bon rendement sur le papier cache parfois des pièges qui détruisent la rentabilité nette.",
          "## Emplacement & demande locative",
          "- **Tension locative** : plus la demande dépasse l'offre, plus la vacance est faible et le loyer soutenu. Regardez la proximité **transports, emploi, écoles, commerces**.",
          "- À Martigues : la proximité des **zones industrielles (Lavéra, pétrochimie)** et de l'étang soutient une demande salariale régulière. Ciblez le type de locataire visé (salarié, famille, étudiant).",
          "## Le couple prix/loyer",
          "- Comparez le **prix au m²** aux **loyers de marché**. Un secteur patrimonial (vue mer, centre prisé) offre peu de rendement mais de la plus-value ; un secteur plus populaire, un meilleur rendement.",
          "- Vérifiez s'il existe un **encadrement des loyers** (zones tendues) qui plafonnerait le loyer à la relocation.",
          "## Charges & copropriété",
          "- Lisez les **PV d'assemblée générale** : travaux votés ou à venir (ravalement, toiture, ascenseur) plombent la rentabilité nette. Vérifiez le **fonds travaux** (loi ALUR) et les **impayés de copropriété**.",
          "- Distinguez les charges **récupérables** (sur le locataire) des charges **non récupérables** (à la charge du bailleur).",
          "## Le DPE, filtre éliminatoire",
          "- Un logement classé **G est interdit à la location depuis le 1er janvier 2025**, **F à partir de 2028**, **E à partir de 2034**. Les loyers des passoires F et G sont par ailleurs **gelés** depuis 2022.",
          "- Le **DPE est opposable** depuis 2021 : un locataire peut se retourner contre le bailleur en cas d'erreur. Une passoire = **travaux à budgéter**, mais aussi un **levier de négociation** sur le prix. Détail → module « DPE & performance énergétique ».",
          "## Vérifier le bien lui-même",
          "- **Surface loi Carrez** et cohérence avec l'annonce.",
          "- État réel : **CAPEX / gros entretien** (chaudière, toiture, menuiseries, électricité) à provisionner.",
          "- Si le bien est **vendu loué** : lire le bail en cours (loyer, échéance, état des lieux, dépôt de garantie).",
          "## Les postes qui tuent le rendement",
          "- **Vacance locative** : provisionner au moins 1 mois par an selon le secteur.",
          "- **Impayés** : d'où l'intérêt d'une **GLI** ou d'un dossier locataire solide.",
          "## La grille mnémonique « ELECT »",
          "**E**mplacement, **L**oyer de marché, **É**tat et travaux, **C**harges et copropriété, **T**ension locative. Si un critère est au rouge, creusez avant de proposer.",
          "## Cas pratique",
          "Studio affiché à **8 % brut** : alléchant. Mais les PV d'AG révèlent un ravalement voté à 9 000 €, le DPE est **F** (gel du loyer et travaux à prévoir avant 2028) et la vacance est élevée. Net réel : sous les 3 %. **Le brut ment** : l'analyse protège votre crédibilité et votre client."
        ]
      },
      {
        "titre": "Stratégies & montages juridiques",
        "contenu": [
          "À bien égal, le **montage** change tout : fiscalité, protection, transmission. Savoir en parler fait de vous un **conseiller patrimonial**, pas un simple vendeur.",
          "## Nom propre, le plus simple",
          "- Détention directe : simplicité, accès au micro-foncier et au micro-BIC, LMNP facile. Idéal pour un premier investissement.",
          "- Pensez aux conséquences du **régime matrimonial** et de l'**indivision** entre concubins (qui pousse souvent à préférer la SCI).",
          "## La SCI (société civile immobilière)",
          "- **SCI à l'IR** : transparence fiscale (chaque associé déclare sa quote-part en revenus fonciers), idéale pour **gérer à plusieurs** et **transmettre** (donation de parts avec abattements renouvelables tous les 15 ans). Elle ne permet **pas** la location meublée de façon habituelle.",
          "- **SCI à l'IS** : amortissement du bien comme en entreprise, mais **plus-value professionnelle** à la revente (pas d'abattement pour durée de détention). Puissant pour capitaliser, lourd pour revendre.",
          "## Le démembrement de propriété",
          "- Séparer l'**usufruit** (jouissance et loyers) de la **nue-propriété** (les murs). Acheter la nue-propriété décotée (−30 à −40 %), sans gestion ni fiscalité pendant le démembrement, puis récupérer la pleine propriété au terme.",
          "- Outil de **transmission** et d'optimisation **IFI** : la nue-propriété échappe en principe à l'IFI, c'est l'usufruitier qui est imposable.",
          "## Les stratégies d'exploitation",
          "- **Location nue** : stable, peu de gestion, fiscalité foncière, bail de 3 ans.",
          "- **Meublé longue durée (LMNP)** : loyers +15 à 25 %, fiscalité douce, bail d'1 an, turnover plus élevé.",
          "- **Colocation** : optimise le loyer au m², demande étudiante et jeunes actifs ; attention à la clause de solidarité et au type de bail choisi.",
          "- **Courte durée / saisonnier** : rendement élevé en zone touristique (littoral PACA), mais **encadrement croissant** (loi Le Meur, autorisation de changement d'usage en mairie, règlement de copropriété, numéro d'enregistrement, fiscalité durcie).",
          "## L'IFI, à surveiller",
          "- Au-delà de **1,3 M€ de patrimoine immobilier net taxable**, l'investisseur entre dans l'**IFI** (barème de 0,5 % à 1,5 %). Le passif déductible (crédits en cours) et certains montages réduisent l'assiette.",
          "## Mnémonique",
          "**« Un bien, trois questions : qui détient (nom propre ou SCI), comment on loue (nu, meublé ou colocation), pour qui à la fin (revente, retraite ou transmission) ? »**",
          "## Erreur fréquente",
          "Créer une **SCI par réflexe** : inutile voire contre-productif pour un investisseur seul en meublé (la SCI à l'IR ne permet pas le meublé habituel, et la bascule à l'IS est lourde à la revente). Chaque montage répond à un **objectif précis** : renvoyez vers le **notaire** et l'**expert-comptable** pour l'acter."
        ]
      },
      {
        "titre": "La sortie : revente, plus-value et arbitrage",
        "contenu": [
          "On parle toujours de l'achat, rarement de la **sortie**. Pourtant, le gain final d'un investissement dépend autant de la **revente** que de l'exploitation. Savoir en parler distingue le conseiller du simple vendeur.",
          "## La plus-value des particuliers en bref",
          "- Base : **prix de vente − prix d'acquisition** (majoré des frais d'acquisition et de certains travaux).",
          "- Imposition : **19 % d'impôt sur le revenu + 17,2 % de prélèvements sociaux**, soit 36,2 % avant abattements.",
          "- **Abattements pour durée de détention** : exonération d'**impôt sur le revenu à 22 ans** de détention, et de **prélèvements sociaux à 30 ans**.",
          "- **Surtaxe** pour les plus-values imposables **supérieures à 50 000 €** (taxe additionnelle de 2 % à 6 % par tranche).",
          "- La **résidence principale** est **totalement exonérée** — mais un bien locatif, lui, ne l'est pas.",
          "- Détail complet et simulateur → module « Fiscalité : la plus-value ».",
          "## Le cas particulier du LMNP depuis 2025",
          "- Depuis la loi de finances 2025, les **amortissements déduits sont réintégrés** dans le calcul de la plus-value : la base imposable augmente à la revente.",
          "- Exception : les **résidences services gérées** (étudiantes, seniors, EHPAD) restent hors de cette réintégration.",
          "- À anticiper très en amont avec l'expert-comptable : l'économie d'impôt pendant l'exploitation se paie en partie à la sortie.",
          "## Quand revendre ?",
          "- **Franchir un cap d'abattement** (22 ans pour l'IR, 30 ans pour les prélèvements sociaux) peut justifier d'attendre.",
          "- **Marché haut, taux attractifs** : conditions favorables pour vendre ou arbitrer.",
          "- **Gros CAPEX à venir** (ravalement, toiture) : parfois mieux vaut vendre avant de les subir.",
          "## L'arbitrage patrimonial",
          "- Revendre un bien peu rentable pour **réinvestir** dans un bien à meilleur rendement, ou pour **désendetter** le reste du patrimoine.",
          "- Le **remploi** du capital peut relancer un nouvel **effet de levier** et de nouveaux amortissements.",
          "## Rôle du négociateur",
          "Suivre la valeur du bien dans le temps (estimations DVF), **alerter** l'investisseur au bon moment et **capter le mandat de revente**. La sortie d'un bien, c'est souvent l'achat du suivant : une **double transaction**.",
          "## Erreur fréquente",
          "Vendre sans avoir chiffré la **plus-value nette** : l'investisseur découvre l'impôt après coup et vous le reproche. Annoncez l'ordre de grandeur et renvoyez au **notaire**, qui liquide et prélève la plus-value directement à l'acte."
        ]
      },
      {
        "titre": "Sourcer, accompagner et fidéliser l'investisseur",
        "contenu": [
          "Un investisseur bien accompagné est une **rente** pour l'agence. La vente n'est pas la fin : c'est le début d'une relation de long terme.",
          "## Sourcer les bonnes affaires pour eux",
          "- Constituez un **vivier d'investisseurs** qualifiés (budget, régime visé, secteurs). Quand une **pépite** rentre (prix négociable, bon rendement, vendeur pressé), vous la placez **en 48 h**, parfois avant diffusion.",
          "- Les biens **sans attrait pour l'occupant** (petit, à travaux, vendu loué) sont souvent **boudés par les primo-accédants** mais parfaits pour l'investisseur.",
          "## Le bien déjà loué : un double argument",
          "- Un bien **vendu loué** rassure (rendement immédiat, pas de vacance) mais se négocie souvent avec **décote** : le bail en cours s'impose à l'acquéreur, parfois avec un loyer sous le marché. Sachez l'expliquer dans les deux sens.",
          "## Rester dans le cadre légal",
          "- Rappelez les fondamentaux du métier : **mandat écrit** obligatoire (loi Hoguet), **mandat de recherche** possible côté acquéreur, et vigilance **LCB-FT / Tracfin** (vérification d'identité et de l'origine des fonds, surtout pour les apports importants).",
          "- Le compromis ouvre à l'acquéreur non professionnel le **délai de rétractation de 10 jours** (loi SRU) ; rappelez-le pour sécuriser et rassurer.",
          "## Accompagner après la vente",
          "- Proposer la **gestion locative** de l'agence (mandat de gestion ~6 à 8 % TTC des loyers) : revenu récurrent pour l'agence, tranquillité pour l'investisseur.",
          "- Mettre en relation avec **courtier, expert-comptable, notaire, artisans** : vous devenez le **chef d'orchestre** de son projet.",
          "## Fidéliser pour le réinvestissement",
          "- Un investisseur satisfait **rachète tous les 2-3 ans**. Gardez le contact : point annuel sur son bien, évolutions fiscales, nouvelles opportunités.",
          "- Demandez la recommandation : « Connaissez-vous d'autres personnes qui souhaitent investir ? »",
          "## Script de relance annuelle",
          "« Bonjour M. X, cela fait un an que vous avez acquis votre T2. Le marché de Martigues a évolué et votre bien a pris de la valeur. Souhaitez-vous faire un **point patrimonial** et envisager une **seconde acquisition** ? »",
          "## Posture : conseiller, pas conseil fiscal",
          "- Vous **orientez, chiffrez, alertez et mettez en relation**. Vous ne vous substituez **jamais** au fiscaliste, au notaire ou à l'expert-comptable. Cette humilité **protège** votre responsabilité et **renforce** votre crédibilité.",
          "## Erreur fréquente",
          "Vendre puis **disparaître**. L'investisseur que vous ne revoyez pas rachètera avec une autre agence. Le suivi, c'est 80 % de la valeur client sur 10 ans."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Le rendement brut se calcule…",
        "options": [
          "Loyer mensuel ÷ prix",
          "(Loyer annuel ÷ prix d'achat frais inclus) × 100",
          "Prix ÷ loyer",
          "Loyer − charges"
        ],
        "correct": 1,
        "explication": "Rendement brut = loyer annuel rapporté au prix d'achat (frais inclus), exprimé en %. Il ignore les charges : utile pour un premier tri, jamais pour décider."
      },
      {
        "question": "L'atout fiscal majeur du réel en LMNP est…",
        "options": [
          "L'abattement de 30 %",
          "L'amortissement du bien (hors terrain) et du mobilier",
          "L'exonération totale et définitive d'impôt",
          "La récupération systématique de la TVA"
        ],
        "correct": 1,
        "explication": "L'amortissement, charge comptable sans décaissement, réduit fortement voire annule l'impôt sur les loyers pendant 10 à 20 ans. Depuis la loi de finances 2025, ces amortissements sont toutefois réintégrés dans le calcul de la plus-value à la revente (sauf résidences services gérées)."
      },
      {
        "question": "Un cash-flow positif signifie que…",
        "options": [
          "Le bien coûte chaque mois à l'investisseur",
          "Le bien s'autofinance (loyers > crédit + charges + impôts)",
          "Il n'y a aucun impôt à payer",
          "Le loyer est inférieur au marché"
        ],
        "correct": 1,
        "explication": "Cash-flow = loyers − (mensualité de crédit + charges + impôts). Positif, le bien se finance seul ; négatif, l'investisseur complète chaque mois (effort d'épargne)."
      },
      {
        "question": "Le déficit foncier (hors intérêts d'emprunt) s'impute sur le revenu global jusqu'à…",
        "options": [
          "4 600 €/an",
          "10 700 €/an (21 400 € pour une rénovation énergétique, dépenses 2023-2027)",
          "15 000 €/an",
          "Sans aucune limite"
        ],
        "correct": 1,
        "explication": "Plafond de 10 700 €/an sur le revenu global, doublé à 21 400 € pour les travaux faisant sortir le logement du statut de passoire (de E, F ou G vers A, B, C ou D). Cette mesure a été prolongée pour les dépenses payées de 2023 à 2027. L'excédent se reporte 10 ans sur les revenus fonciers."
      },
      {
        "question": "En 2026, le dispositif Pinel…",
        "options": [
          "offre encore 21 % de réduction d'impôt",
          "est supprimé pour tout nouvel investissement depuis le 1er janvier 2025",
          "est désormais réservé à la VEFA",
          "a remplacé le Denormandie"
        ],
        "correct": 1,
        "explication": "Le Pinel est supprimé depuis le 1er janvier 2025 : aucun nouvel investissement possible. Le proposer est une erreur. Le Denormandie (ancien à rénover) court, lui, jusqu'au 31 décembre 2027."
      },
      {
        "question": "En location meublée de longue durée, l'abattement du micro-BIC est de…",
        "options": [
          "30 %",
          "50 % (plafond 77 700 €/an de recettes)",
          "71 %",
          "0 %"
        ],
        "correct": 1,
        "explication": "Micro-BIC meublé longue durée : abattement de 50 % jusqu'à 77 700 € de recettes, plus avantageux que le micro-foncier du nu (30 %). Attention : pour les meublés de tourisme, la loi Le Meur a abaissé ces seuils depuis les revenus 2025."
      },
      {
        "question": "Quel rendement intègre la fiscalité (régime et TMI) et constitue le seul chiffre vraiment décisif pour l'investisseur ?",
        "options": [
          "Le rendement net-net (après impôt)",
          "Le rendement brut",
          "Le rendement net de charges",
          "Le taux d'usure"
        ],
        "correct": 0,
        "explication": "Le rendement net-net intègre l'impôt : c'est le seul chiffre qui compte réellement, d'où le repère « le brut ment, le net informe, le net-net décide »."
      },
      {
        "question": "Pour ne pas surévaluer un rendement, que doit-on toujours inclure au dénominateur du calcul ?",
        "options": [
          "Les frais d'acquisition (notaire, agence, travaux, mobilier)",
          "Uniquement le prix affiché",
          "Les loyers des années suivantes",
          "La taxe d'habitation du locataire"
        ],
        "correct": 0,
        "explication": "Un rendement calculé sur le seul prix affiché, sans les frais d'acquisition, est toujours surévalué."
      },
      {
        "question": "Selon les règles du HCSF (2024-2026), le taux d'endettement maximal d'un emprunteur est de…",
        "options": [
          "35 % des revenus, assurance emprunteur comprise",
          "50 % des revenus",
          "33 % hors assurance",
          "25 % des revenus"
        ],
        "correct": 0,
        "explication": "Le HCSF plafonne l'endettement à 35 % des revenus, assurance comprise, avec une marge de dérogation de 20 % des dossiers."
      },
      {
        "question": "La durée maximale d'un crédit immobilier fixée par le HCSF est en principe de…",
        "options": [
          "25 ans, portée à 27 ans avec différé dans le neuf ou gros travaux",
          "30 ans",
          "20 ans",
          "15 ans"
        ],
        "correct": 0,
        "explication": "La durée maximale est de 25 ans, jusqu'à 27 ans avec différé pour le neuf ou des travaux représentant au moins 10 % de l'opération."
      },
      {
        "question": "Pour calculer la capacité d'emprunt d'un investisseur, les banques retiennent généralement quelle part des loyers attendus ?",
        "options": [
          "Environ 70 %",
          "100 %",
          "50 %",
          "30 %"
        ],
        "correct": 0,
        "explication": "Les banques ne retiennent en général que 70 % des loyers attendus, par prudence face à la vacance et aux charges."
      },
      {
        "question": "Le régime du micro-foncier (location nue) est accessible jusqu'à 15 000 € de revenus bruts et applique un abattement forfaitaire de…",
        "options": [
          "30 %",
          "50 %",
          "10 %",
          "71 %"
        ],
        "correct": 0,
        "explication": "Le micro-foncier applique un abattement de 30 %, moins généreux que le micro-BIC du meublé (50 %)."
      },
      {
        "question": "L'option pour le régime réel en revenus fonciers est irrévocable pendant…",
        "options": [
          "3 ans, puis reconductible tacitement",
          "1 an",
          "9 ans",
          "5 ans"
        ],
        "correct": 0,
        "explication": "Optionnel sous 15 000 €, le régime réel engage pour 3 ans irrévocables, puis se reconduit tacitement."
      },
      {
        "question": "Les intérêts d'emprunt qui génèrent un déficit foncier s'imputent…",
        "options": [
          "Uniquement sur les revenus fonciers",
          "Sur le revenu global sans limite",
          "Sur le revenu global jusqu'à 10 700 €",
          "Sur la plus-value de revente"
        ],
        "correct": 0,
        "explication": "Les intérêts d'emprunt ne s'imputent que sur les revenus fonciers ; seule la part de déficit hors intérêts frappe le revenu global jusqu'à 10 700 €."
      },
      {
        "question": "Pour des travaux faisant sortir un logement du statut de passoire énergétique, le plafond d'imputation du déficit foncier sur le revenu global est porté à…",
        "options": [
          "21 400 €",
          "10 700 €",
          "15 300 €",
          "30 000 €"
        ],
        "correct": 0,
        "explication": "Le plafond est doublé à 21 400 € pour les travaux faisant passer un logement de E, F ou G vers A, B, C ou D, pour les dépenses payées de 2023 à 2027."
      },
      {
        "question": "On reste loueur en meublé non professionnel (LMNP) tant que les recettes meublées sont…",
        "options": [
          "Inférieures ou égales à 23 000 €/an, ou inférieures aux autres revenus d'activité",
          "Inférieures à 15 000 €/an",
          "Inférieures à 77 700 €/an",
          "Inférieures à 72 600 €/an"
        ],
        "correct": 0,
        "explication": "Le statut LMNP vaut par défaut tant que les recettes ne dépassent pas 23 000 €/an ou restent inférieures aux autres revenus d'activité du foyer."
      },
      {
        "question": "Pour obtenir un numéro SIRET en LMNP, l'activité doit être déclarée (formulaire P0i) sur le guichet unique de l'INPI dans un délai de…",
        "options": [
          "15 jours",
          "3 mois",
          "1 an",
          "30 jours"
        ],
        "correct": 0,
        "explication": "La déclaration de début d'activité (P0i) se fait dans les 15 jours sur le guichet unique de l'INPI pour obtenir le SIRET."
      },
      {
        "question": "Depuis la loi Le Meur (revenus 2025), l'abattement micro-BIC d'un meublé de tourisme non classé est ramené à…",
        "options": [
          "30 %, plafond 15 000 €",
          "50 %, plafond 77 700 €",
          "71 %",
          "0 %"
        ],
        "correct": 0,
        "explication": "La loi Le Meur ramène l'abattement à 30 % (plafond 15 000 €) pour les meublés de tourisme non classés, contre 50 % (77 700 €) pour les classés."
      },
      {
        "question": "Lequel de ces mécanismes n'entre PAS dans le plafonnement global des niches fiscales à 10 000 €/an ?",
        "options": [
          "Le déficit foncier et l'amortissement LMNP",
          "La réduction d'impôt Denormandie",
          "La réduction d'impôt Loc'Avantages",
          "Les réductions pour investissement locatif neuf"
        ],
        "correct": 0,
        "explication": "Le déficit foncier et l'amortissement LMNP sont des charges déductibles, pas des réductions d'impôt : ils échappent au plafonnement des niches, d'où leur puissance."
      }
    ]
  },
  {
    "id": "vefa-neuf",
    "titre": "Le neuf & la VEFA",
    "icone": "🏗️",
    "categorie": "Transaction",
    "resume": "Vendre et sécuriser l'achat sur plan : contrat de réservation, 10 jours SRU, garanties, appels de fonds, TVA, frais réduits et dispositifs.",
    "duree": "30 min",
    "lecons": [
      {
        "titre": "La VEFA : acheter et vendre sur plan",
        "contenu": [
          "La **VEFA (Vente en l'État Futur d'Achèvement)** est l'achat d'un bien **neuf sur plan** : l'acquéreur devient propriétaire du sol dès la signature, puis des constructions **au fur et à mesure de leur réalisation**. Cadre légal : articles **L261-1 et suivants du Code de la construction (CCH)** et **1601-3 du Code civil**.",
          "## Les deux contrats de la VEFA",
          "- Le **contrat de réservation** (ou contrat préliminaire) : il réserve le lot, fixe le prix prévisionnel et déclenche un **dépôt de garantie** plafonné. Il n'est pas obligatoire mais quasi systématique.",
          "- L'**acte authentique de vente** chez le **notaire** : il transfère la propriété et rend le prix exigible selon l'avancement du chantier.",
          "## Le prix : ferme ou révisable",
          "- La plupart des promoteurs affichent aujourd'hui un **prix ferme et définitif** : rien n'augmente entre la réservation et la livraison.",
          "- Quand le contrat prévoit une **clause de révision**, elle est **indexée sur l'indice BT01** (bâtiment tous corps d'état) et **encadrée** par la loi (art. L261-11-1 CCH).",
          "- Dans ce cas, **chaque révision est limitée à 70 % de la variation de l'indice BT01** entre la signature et l'exigibilité de chaque versement. Vérifiez toujours ce point : un acquéreur déteste les mauvaises surprises.",
          "## Ce que la VEFA change pour l'acquéreur",
          "- Un logement aux **dernières normes RE2020** (applicable depuis le 1er janvier 2022) : basse consommation, confort d'été, faible empreinte carbone.",
          "- Des **frais de notaire réduits** (2 à 3 % contre 7 à 8 % dans l'ancien).",
          "- Des **garanties** très protectrices (achèvement, parfait achèvement, biennale, décennale).",
          "- La **personnalisation** via les **TMA (travaux modificatifs acquéreur)** : choix des finitions, cloisons, carrelage.",
          "- Zéro travaux, **exonération de taxe foncière pendant 2 ans**, et parfois une **TVA réduite à 5,5 %** en zone éligible.",
          "## Les points de vigilance à expliquer",
          "- On **achète sur plan** : il faut se projeter (maquette, perspectives 3D, logement témoin, notice descriptive).",
          "- Les **délais** sont donnés par trimestre (ex. « livraison T3 2026 ») et peuvent **glisser**.",
          "- Une **tolérance de surface** d'environ 5 % existe : si la surface livrée est inférieure de plus de 5 % à celle du contrat, l'acquéreur peut demander une **diminution du prix**.",
          "## Mini cas pratique",
          "Programme « Les Terrasses de Ferrières » à Martigues : un **T3 de 63 m²** affiché **265 000 € TTC**, livraison prévue au 3e trimestre 2026. Votre rôle n'est pas de « vendre un plan » : c'est de **sécuriser le parcours** de l'acquéreur, du contrat de réservation à la remise des clés. C'est cette expertise qui justifie l'accompagnement d'une agence comme CENTURY 21 Icaza Immobilier face à l'achat « direct promoteur »."
        ]
      },
      {
        "titre": "Le contrat de réservation (contrat préliminaire)",
        "contenu": [
          "Le **contrat de réservation** engage le promoteur à réserver un lot à l'acquéreur, et l'acquéreur à verser un **dépôt de garantie**. Il est encadré par l'**article L261-15 du CCH**. C'est un préliminaire, **pas** l'achat définitif.",
          "## Le dépôt de garantie : un barème strict",
          "Le dépôt est **plafonné** selon le délai prévu de signature de l'acte de vente (art. R261-28 CCH) :",
          "- **5 %** maximum du prix si l'acte est signé dans **moins d'un an**.",
          "- **2 %** maximum si l'acte est signé **entre 1 et 2 ans**.",
          "- **Aucun dépôt** autorisé si le délai dépasse **2 ans**.",
          "Mnémonique : **« 5 – 2 – 0 »** (moins d'1 an, 1 à 2 ans, plus de 2 ans).",
          "Le dépôt est versé sur un **compte séquestre** (notaire ou banque), bloqué : il n'est **pas encaissé** par le promoteur.",
          "## Les mentions et documents obligatoires",
          "- La **description du logement** : surface habitable, nombre de pièces, situation dans l'immeuble, matériaux, équipements collectifs — détaillée dans la **notice descriptive** annexée.",
          "- Le **prix prévisionnel** et ses conditions éventuelles de révision.",
          "- La **date prévisionnelle** de signature de l'acte et le **délai d'exécution** des travaux.",
          "- Les **conditions de restitution** du dépôt de garantie.",
          "- Le **prêt** que l'acquéreur déclare vouloir obtenir (montant, taux plafond, durée) : clé de la condition suspensive.",
          "- Les **plans** du logement et, le plus souvent, un **projet de règlement de copropriété** pour comprendre parties communes et charges.",
          "## Le délai de rétractation de 10 jours (loi SRU)",
          "Après signature du contrat de réservation, l'acquéreur non professionnel dispose d'un **délai de rétractation de 10 jours** (art. L271-1 CCH), **sans motif ni pénalité**. Le délai court à compter du **lendemain de la première présentation** de la notification du contrat (lettre recommandée, remise en main propre contre récépissé ou voie électronique).",
          "## Quand le dépôt est intégralement restitué",
          "Le dépôt revient **en totalité** à l'acquéreur, en principe sous **3 mois**, notamment si :",
          "- Il **se rétracte** dans les 10 jours.",
          "- Le **prêt n'est pas obtenu** (condition suspensive).",
          "- Le prix de vente dépasse de **plus de 5 %** le prix prévisionnel.",
          "- La **date de livraison** ou la **consistance** du bien sont dégradées par rapport au contrat.",
          "## Script de réassurance",
          "« Vous signez aujourd'hui une **réservation**, pas l'achat définitif. Vous avez **10 jours pour changer d'avis** sans aucune justification, et votre dépôt de **13 250 €** (5 % de 265 000 €) est **bloqué chez le notaire**, pas dans la poche du promoteur. Vous ne prenez aucun risque. »",
          "## Erreurs à éviter",
          "- Laisser croire que la réservation est « l'achat » : c'est un contrat préliminaire.",
          "- Oublier d'inscrire le **prêt** au contrat : sans cette mention, la **condition suspensive de financement** protège mal l'acquéreur.",
          "- Encaisser un dépôt **hors séquestre** : c'est strictement interdit."
        ]
      },
      {
        "titre": "De la réservation à l'acte authentique",
        "contenu": [
          "Entre la réservation et la remise des clés, le parcours VEFA s'étale souvent sur **18 à 30 mois**. Le négociateur qui balise ces étapes **rassure et fidélise**.",
          "## Les grandes étapes",
          "- **J0** : signature du **contrat de réservation** et versement du dépôt de garantie.",
          "- **J+10** : fin du **délai de rétractation**.",
          "- **1 à 4 mois** : recherche et obtention du **prêt**, puis envoi du **projet d'acte** par le notaire (au moins **1 mois avant** la signature).",
          "- **Signature de l'acte authentique** chez le notaire : le prix devient exigible selon l'avancement.",
          "- **Phase de construction** : **appels de fonds** successifs.",
          "- **Livraison** : remise des clés, procès-verbal, levée des réserves.",
          "## Le financement et l'offre de prêt",
          "- L'acquéreur dispose d'un délai (souvent **3 à 4 mois**, indiqué au contrat) pour obtenir son prêt ; c'est une **condition suspensive**.",
          "- L'**offre de prêt** comporte un **délai de réflexion incompressible de 10 jours** (loi Scrivener, art. L313-34 du Code de la consommation) : elle ne peut être acceptée **qu'à partir du 11e jour**.",
          "- Particularité VEFA : le crédit se **débloque progressivement**, au rythme des appels de fonds.",
          "## Le rôle du notaire",
          "- Il rédige l'**acte authentique** et vérifie la **GFA**, l'**assurance dommages-ouvrage**, l'état du foncier et la régularité du permis de construire.",
          "- Il **notifie le projet d'acte au moins un mois avant** la signature, pour que l'acquéreur en prenne pleinement connaissance.",
          "- Il **séquestre** le dépôt et **appelle les fonds** selon l'avancement certifié par l'architecte ou le maître d'œuvre.",
          "## Anticiper les charges de copropriété",
          "- Dès l'entrée dans les lieux, l'acquéreur paie des **charges de copropriété prévisionnelles** (entretien, gardien, espaces verts, ascenseur).",
          "- Rappelez-les dans le plan de budget : elles s'ajoutent à la mensualité de crédit et à l'assurance.",
          "## Les conditions suspensives à surveiller",
          "- **Obtention du prêt** (la plus fréquente).",
          "- Obtention de la **GFA** par le promoteur.",
          "- Parfois, **vente préalable** d'un bien de l'acquéreur.",
          "## Mini cas pratique",
          "Un couple réserve le T3 à Martigues en janvier : rétractation possible jusqu'au 11 janvier, prêt accordé fin mars, acte signé en avril, livraison T3 2026. Votre **tableau de bord des échéances** (suivi client) évite oublis et relances de dernière minute.",
          "## Erreur à éviter",
          "Laisser l'acquéreur **accepter l'offre de prêt avant le 11e jour** : l'acceptation serait **nulle**. Rappelez systématiquement le **délai Scrivener de 10 jours**."
        ]
      },
      {
        "titre": "Les garanties du neuf",
        "contenu": [
          "Le neuf est l'un des achats immobiliers les **mieux protégés**. Savoir expliquer chaque garantie est un **argument de vente majeur** et un repère d'expertise.",
          "## La Garantie Financière d'Achèvement (GFA)",
          "- Elle garantit que l'immeuble sera **achevé** même si le **promoteur fait faillite** : un garant (banque, assureur) finance la fin des travaux.",
          "- Depuis le **1er janvier 2015**, seule la **GFA extrinsèque** (délivrée par un établissement tiers) est admise ; la garantie « intrinsèque » a disparu.",
          "- C'est **la** garantie contre le pire scénario : le notaire en vérifie la présence **avant l'acte**.",
          "## L'assurance dommages-ouvrage (DO)",
          "- Souscrite par le promoteur **avant l'ouverture du chantier** (obligation art. L242-1 du Code des assurances).",
          "- Elle **préfinance** les réparations relevant de la décennale **sans attendre** une décision de justice ni la recherche du responsable.",
          "- Elle se **transmet** aux acquéreurs successifs pendant 10 ans : un vrai argument de **revente**.",
          "## Les garanties dans le temps : « 1 – 2 – 10 »",
          "- **Parfait achèvement — 1 an** (art. 1792-6 du Code civil) : le promoteur répare **tous les désordres** signalés la première année, même mineurs.",
          "- **Biennale / bon fonctionnement — 2 ans** (art. 1792-3) : les **équipements dissociables** (volets, robinetterie, chaudière, VMC).",
          "- **Décennale — 10 ans** (art. 1792) : les dommages **compromettant la solidité** de l'ouvrage ou le rendant **impropre à sa destination** (fissures graves, infiltrations, toiture).",
          "## Deux garanties à ne pas oublier",
          "- **Isolation phonique — 1 an** après la prise de possession (art. L111-11 du CCH) : si l'acoustique ne respecte pas la réglementation.",
          "- **Vices apparents** : défauts visibles consignés en **réserves** le jour de la livraison, ou dénoncés dans le **mois** qui suit ; le promoteur doit les lever.",
          "## Script de réassurance",
          "« Dans le neuf, pendant **1 an tout est repris**, pendant **2 ans les équipements** sont couverts, et pendant **10 ans la structure** est garantie — avec une assurance qui vous **indemnise sans procès**. C'est une sécurité que l'ancien n'offre pas. »",
          "## Erreur à éviter",
          "Confondre les garanties : un volet qui ne ferme plus relève de la **biennale (2 ans)**, pas de la décennale. Citer la **bonne garantie**, c'est paraître expert."
        ]
      },
      {
        "titre": "L'échéancier des appels de fonds & les intérêts intercalaires",
        "contenu": [
          "En VEFA, on ne paie pas tout d'un coup : le prix est appelé **au rythme du chantier**, dans des **plafonds légaux** (art. R261-14 du CCH).",
          "## Le barème maximal des appels de fonds",
          "- **35 %** du prix à l'achèvement des **fondations**.",
          "- **70 %** (cumulés) à la **mise hors d'eau** (toiture posée, bâtiment hors d'eau).",
          "- **95 %** (cumulés) à l'**achèvement** de l'immeuble.",
          "- **5 %** de solde à la **livraison** (remise des clés).",
          "Mnémonique : **« 35 aux fondations, 70 hors d'eau, 95 achevé, 5 à la clé »**.",
          "## Exemple chiffré (T3 à 265 000 €)",
          "- Fondations (35 %) : **92 750 €** appelés.",
          "- Mise hors d'eau (cumul 70 %) : nouvel appel de **92 750 €**.",
          "- Achèvement (cumul 95 %) : nouvel appel de **66 250 €**.",
          "- Livraison (solde 5 %) : **13 250 €**.",
          "## Les intérêts intercalaires",
          "- Le prêt se **débloque par tranches**, au rythme des appels de fonds.",
          "- Tant que la totalité n'est pas débloquée, l'emprunteur paie des **intérêts intercalaires** : des intérêts calculés **uniquement sur les sommes déjà libérées**, sans rembourser encore le capital.",
          "- La **mensualité pleine** (capital + intérêts) ne démarre généralement **qu'à la livraison**. Prévenez : pendant la construction, l'acquéreur paie souvent **un loyer + des intérêts intercalaires** — une **double charge temporaire** à anticiper.",
          "## Le solde de 5 % et la consignation",
          "- Le solde de **5 %** n'est dû qu'à la **livraison**.",
          "- En cas de **réserves**, l'acquéreur peut **consigner** ce solde (le bloquer chez un tiers) jusqu'à leur levée : c'est un **levier de pression** légitime sur le promoteur.",
          "## Erreurs à éviter",
          "- Accepter un échéancier qui **dépasse les plafonds** légaux (ex. 50 % aux fondations) : c'est illégal.",
          "- Oublier de chiffrer les **intérêts intercalaires** dans le plan de financement : l'acquéreur se croit à l'aise, puis découvre la double charge au mauvais moment."
        ]
      },
      {
        "titre": "Frais de notaire, TVA et fiscalité du neuf",
        "contenu": [
          "Le neuf a une fiscalité à part, globalement **avantageuse**. C'est un argument commercial puissant… quand on sait le **chiffrer**.",
          "## Pourquoi les frais de notaire sont réduits",
          "- Dans l'**ancien**, les « frais de notaire » (7 à 8 %) sont surtout des **droits de mutation (DMTO)** d'environ **5,80 %** perçus par les collectivités — jusqu'à **6,3 %** dans les départements ayant relevé le taux depuis 2025.",
          "- Dans le **neuf**, la vente est soumise à **TVA** : les droits tombent à la **taxe de publicité foncière de 0,715 %**. Résultat : des **frais de l'ordre de 2 à 3 %**.",
          "## Exemple chiffré (T3 à 265 000 €)",
          "- Neuf, frais ~2,5 % : environ **6 600 €**.",
          "- Ancien, frais ~7,5 % : environ **19 900 €**.",
          "- **Économie : ~13 000 €** — de quoi financer la cuisine équipée.",
          "## La TVA : 20 % ou 5,5 %",
          "- Le prix VEFA est affiché **TTC**, **TVA à 20 %** incluse.",
          "- Elle tombe à **5,5 %** pour une **résidence principale** en zone **QPV** (quartier prioritaire) ou à moins de **300 m**, et en **ANRU**, sous **plafonds de ressources** ; c'est aussi le taux du **PSLA** et du **BRS**.",
          "- Sur notre T3, passer de 20 % à 5,5 % représente environ **32 000 €** d'économie : un véritable changement de catégorie de budget.",
          "## L'exonération de taxe foncière (2 ans)",
          "- Toute **construction neuve** est **exonérée de taxe foncière pendant 2 ans** (art. 1383 du CGI), à compter du 1er janvier qui suit l'achèvement.",
          "- Condition : **déclarer l'achèvement au fisc dans les 90 jours** (déclaration en ligne « Gérer mes biens immobiliers », ex-formulaires H1 / H2).",
          "- Attention : la **commune peut supprimer sa part** de cette exonération par délibération pour les logements non aidés. À vérifier localement (Martigues, Istres, Port-de-Bouc).",
          "## Le PTZ, élargi depuis 2025",
          "- Depuis le **1er avril 2025** et jusqu'au **31 décembre 2027**, le **PTZ** dans le neuf est ouvert sur **tout le territoire** et à **tous les logements neufs**, y compris les **maisons individuelles** (il était auparavant réservé au collectif en zone tendue).",
          "- Il finance une **quotité** du projet **sans intérêt**, sous plafonds de ressources : jusqu'à **50 %** du coût pour un **appartement** (habitat collectif, ménages les plus modestes), une quotité plus faible (jusqu'à ~30 %) pour une **maison individuelle**.",
          "- Il est réservé aux **primo-accédants** qui en font leur **résidence principale**.",
          "## Mini cas pratique",
          "Un primo-accédant modeste vise le T3 à 265 000 €. En cumulant **frais réduits**, **exonération de taxe foncière** et un éventuel **PTZ**, son effort réel est très inférieur à ce qu'il croyait : votre travail est de **poser ces chiffres** noir sur blanc. Un acheteur qui comprend l'avantage fiscal signe plus vite."
        ]
      },
      {
        "titre": "La livraison : réception, réserves et vie du contrat",
        "contenu": [
          "La **livraison** est le moment clé : remise des clés, vérification du logement et déclenchement des garanties. Un négociateur présent et compétent ce jour-là **marque durablement** son client.",
          "## La convocation à la livraison",
          "- Le promoteur convoque l'acquéreur, souvent par lettre recommandée, à une **date de livraison**.",
          "- L'acquéreur vient avec le **plan**, la **notice descriptive** et, idéalement, un œil exercé (le vôtre, un expert, un professionnel du bâtiment).",
          "## Le procès-verbal de livraison",
          "- On parcourt le logement **pièce par pièce** et on consigne tout défaut dans le **procès-verbal de livraison** : c'est le document qui fait foi.",
          "- Les **réserves** = tous les défauts, malfaçons ou non-conformités constatés (carrelage fêlé, peinture, menuiserie, équipement manquant).",
          "- Le promoteur a un **délai** pour **lever les réserves**.",
          "## Réserves et consignation du solde",
          "- En présence de réserves, l'acquéreur peut **consigner les 5 %** de solde chez un tiers (notaire, Caisse des dépôts) jusqu'à leur levée.",
          "- Ne jamais signer un PV « sans réserve » **sous pression** : une fois le solde versé sans réserve, le **levier de négociation disparaît**.",
          "## Les TMA (travaux modificatifs acquéreur)",
          "- Pendant la construction, l'acquéreur peut demander des **modifications** (supprimer une cloison, choisir un carrelage, ajouter une prise), dans les limites techniques et de délai fixées par le promoteur.",
          "- Les TMA se décident **tôt** (avant certains stades de chantier) et sont **chiffrés** : prévenez votre client pour éviter la frustration et le hors-budget.",
          "## Le retard de livraison",
          "- Les dates sont souvent données **par trimestre** et assorties de causes légitimes de suspension (intempéries, défaillance d'entreprise, recours).",
          "- Le contrat prévoit en général des **pénalités de retard** (par exemple de l'ordre de **1/3000e du prix par jour** de retard). Vérifiez la clause et sa **réciprocité**.",
          "## Script",
          "« Le jour de la livraison, on fait le tour ensemble, **on note tout** ce qui ne va pas sur le procès-verbal, et si besoin on **garde les 5 % de solde** jusqu'à ce que tout soit corrigé. Vous gardez la main de bout en bout. »",
          "## Erreur à éviter",
          "Banaliser la livraison (« une simple formalité ») : c'est au contraire le moment où l'on **protège l'acquéreur**. Être présent ce jour-là est un service à **forte valeur** qui nourrit la recommandation."
        ]
      },
      {
        "titre": "Investir et vendre dans le neuf : dispositifs et technique commerciale",
        "contenu": [
          "Le neuf attire autant les **accédants** que les **investisseurs**. Depuis 2025, le paysage des aides a changé : il faut **parler juste**, sous peine de perdre toute crédibilité.",
          "## La fin du Pinel",
          "- Le dispositif **Pinel** (réduction d'impôt pour l'investissement locatif neuf) a **pris fin le 31 décembre 2024**. **Aucun nouvel** investissement Pinel n'est possible après cette date.",
          "- Ne le proposez **plus** comme argument : les engagements en cours se poursuivent, mais le produit est **fermé** aux nouveaux acquéreurs.",
          "## Le LMNP dans le neuf",
          "- La **location meublée non professionnelle (LMNP)** reste un classique du neuf (résidences services ou logement meublé).",
          "- Au **régime réel**, elle permet d'**amortir** le bien et le mobilier et de réduire fortement la fiscalité des loyers.",
          "- Nouveauté : depuis la **loi de finances 2025**, les **amortissements déduits sont réintégrés** dans le calcul de la **plus-value** à la revente (hors certaines résidences services). À signaler à l'investisseur, sans jouer au fiscaliste : on l'oriente vers son expert-comptable ou son notaire.",
          "## L'accession aidée : PSLA et BRS",
          "- **PSLA (Prêt Social Location-Accession)** : on **loue puis on achète**, avec **TVA à 5,5 %** et exonération de taxe foncière prolongée, sous plafonds de ressources.",
          "- **BRS (Bail Réel Solidaire)** : on achète les **murs** mais pas le **terrain** (détenu par un Organisme de Foncier Solidaire, moyennant une redevance mensuelle), d'où un **prix nettement réduit** (souvent -30 à -40 %) et une **TVA à 5,5 %**. Idéal pour les primo-accédants en secteur tendu.",
          "## Vos arguments pour vendre le neuf",
          "- **Frais de notaire réduits**, **2 ans sans taxe foncière**, parfois **TVA 5,5 %** et **PTZ**.",
          "- **Zéro travaux**, **garanties** longues, **RE2020** (factures d'énergie basses, confort d'été, pas de passoire thermique).",
          "- **Personnalisation** (TMA) et logement « jamais habité ».",
          "## Les pièges à éviter côté commercial",
          "- Promettre une **date de livraison ferme** : parlez toujours de **trimestre** et de délais indicatifs.",
          "- Vendre un **rendement** sur la base du **Pinel disparu**, ou vanter l'amortissement LMNP **sans** rappeler la réintégration en plus-value.",
          "- Négliger les **intérêts intercalaires** et la **double charge** pendant la construction.",
          "## Mini cas pratique",
          "À Martigues, un primo-accédant au budget serré bloque sur un T3 ancien à rénover. En lui présentant un **BRS** neuf équivalent (terrain porté par l'OFS, TVA 5,5 %, zéro travaux, PTZ possible), vous transformez un « c'est trop cher pour moi » en **projet réalisable**. Le bon dispositif, c'est parfois **toute la vente**."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Dans un contrat de réservation VEFA, à combien est plafonné le dépôt de garantie si l'acte de vente est signé dans moins d'un an ?",
        "options": [
          "5 %",
          "2 %",
          "10 %",
          "Aucun plafond"
        ],
        "correct": 0,
        "explication": "Barème « 5 – 2 – 0 » (art. R261-28 CCH) : 5 % si l'acte est signé dans moins d'un an, 2 % entre 1 et 2 ans, et aucun dépôt possible au-delà de 2 ans."
      },
      {
        "question": "Après la signature du contrat de réservation, de quel délai de rétractation dispose l'acquéreur non professionnel ?",
        "options": [
          "7 jours",
          "10 jours",
          "14 jours",
          "30 jours"
        ],
        "correct": 1,
        "explication": "La loi SRU (art. L271-1 CCH) accorde 10 jours de rétractation, sans motif ni pénalité, à compter du lendemain de la première présentation de la notification du contrat."
      },
      {
        "question": "Dans l'échéancier légal des appels de fonds, quel pourcentage cumulé est atteint au stade de la mise hors d'eau ?",
        "options": [
          "35 %",
          "70 %",
          "95 %",
          "100 %"
        ],
        "correct": 1,
        "explication": "Plafonds légaux (art. R261-14 CCH) : 35 % aux fondations, 70 % à la mise hors d'eau, 95 % à l'achèvement, et 5 % de solde à la livraison."
      },
      {
        "question": "La Garantie Financière d'Achèvement (GFA) sert à garantir…",
        "options": [
          "Le meilleur prix du marché",
          "L'achèvement de l'immeuble même si le promoteur défaille",
          "La rentabilité locative",
          "La baisse des frais de notaire"
        ],
        "correct": 1,
        "explication": "La GFA (obligatoirement extrinsèque depuis le 1er janvier 2015) assure que l'immeuble sera achevé même en cas de défaillance du promoteur ; le notaire en vérifie la présence avant l'acte."
      },
      {
        "question": "Les frais de notaire dans le neuf (VEFA) représentent environ…",
        "options": [
          "2 à 3 %",
          "7 à 8 %",
          "10 %",
          "0 %"
        ],
        "correct": 0,
        "explication": "La vente étant soumise à TVA, les droits sont réduits à la taxe de publicité foncière de 0,715 % : les frais tombent à 2-3 %, contre 7-8 % dans l'ancien où les DMTO atteignent environ 5,80 %."
      },
      {
        "question": "Pendant combien de temps une construction neuve est-elle exonérée de taxe foncière ?",
        "options": [
          "1 an",
          "2 ans",
          "5 ans",
          "Elle ne l'est jamais"
        ],
        "correct": 1,
        "explication": "Exonération de 2 ans (art. 1383 du CGI), sous réserve de déclarer l'achèvement dans les 90 jours ; la commune peut toutefois supprimer sa part par délibération pour les logements non aidés."
      },
      {
        "question": "En vertu de la loi Scrivener, à partir de quand l'acquéreur peut-il accepter son offre de prêt ?",
        "options": [
          "Dès sa réception",
          "Le 8e jour",
          "Le 11e jour",
          "Le 30e jour"
        ],
        "correct": 2,
        "explication": "La loi Scrivener (art. L313-34 du Code de la consommation) impose un délai de réflexion incompressible de 10 jours : l'offre ne peut être acceptée qu'à partir du 11e jour, sinon l'acceptation est nulle."
      },
      {
        "question": "Un volet roulant tombe en panne 18 mois après la livraison. De quelle garantie relève cette réparation ?",
        "options": [
          "La garantie décennale (10 ans)",
          "La garantie biennale de bon fonctionnement (2 ans)",
          "La garantie de parfait achèvement (1 an)",
          "Aucune garantie"
        ],
        "correct": 1,
        "explication": "À 18 mois, la garantie de parfait achèvement (1 an) est expirée ; un équipement dissociable comme un volet relève de la garantie biennale de bon fonctionnement (2 ans, art. 1792-3 du Code civil)."
      },
      {
        "question": "Si l'acte de vente VEFA doit être signé entre 1 et 2 ans après la réservation, le dépôt de garantie est plafonné à…",
        "options": [
          "2 % du prix",
          "5 % du prix",
          "10 % du prix",
          "Aucun plafond légal"
        ],
        "correct": 0,
        "explication": "Le barème « 5 – 2 – 0 » fixe le dépôt à 2 % maximum pour une signature prévue entre 1 et 2 ans."
      },
      {
        "question": "Quand le délai prévu de signature de l'acte VEFA dépasse 2 ans, le dépôt de garantie autorisé est…",
        "options": [
          "Aucun dépôt",
          "2 % du prix",
          "5 % du prix",
          "1 % du prix"
        ],
        "correct": 0,
        "explication": "Au-delà de 2 ans, aucun dépôt de garantie n'est autorisé (règle « 5 – 2 – 0 »)."
      },
      {
        "question": "Où est versé le dépôt de garantie d'un contrat de réservation VEFA ?",
        "options": [
          "Sur un compte séquestre bloqué chez le notaire ou en banque",
          "Directement sur le compte du promoteur",
          "En espèces à l'agence",
          "Sur un compte d'épargne de l'acquéreur"
        ],
        "correct": 0,
        "explication": "Le dépôt est séquestré et bloqué : il n'est pas encaissé par le promoteur, encaisser hors séquestre est strictement interdit."
      },
      {
        "question": "Lorsqu'un prix VEFA est révisable, la révision est indexée sur l'indice BT01 et limitée à…",
        "options": [
          "70 % de la variation de l'indice",
          "100 % de la variation",
          "35 % de la variation",
          "50 % de la variation"
        ],
        "correct": 0,
        "explication": "La loi encadre la clause de révision : chaque révision est plafonnée à 70 % de la variation de l'indice BT01."
      },
      {
        "question": "Si la surface réellement livrée est inférieure de plus de 5 % à celle du contrat, l'acquéreur peut…",
        "options": [
          "Demander une diminution du prix",
          "Rien exiger, c'est toléré",
          "Annuler la vente dès 2 % d'écart",
          "Exiger un autre logement d'office"
        ],
        "correct": 0,
        "explication": "Une tolérance d'environ 5 % existe ; au-delà, l'acquéreur peut demander une diminution proportionnelle du prix."
      },
      {
        "question": "Dans l'échéancier légal des appels de fonds, quel pourcentage est atteint à l'achèvement des fondations ?",
        "options": [
          "35 %",
          "70 %",
          "50 %",
          "95 %"
        ],
        "correct": 0,
        "explication": "Le barème maximal est « 35 aux fondations, 70 hors d'eau, 95 achevé, 5 à la clé »."
      },
      {
        "question": "Quel pourcentage cumulé du prix est appelé à l'achèvement de l'immeuble, avant livraison ?",
        "options": [
          "95 %",
          "70 %",
          "100 %",
          "90 %"
        ],
        "correct": 0,
        "explication": "À l'achèvement, 95 % du prix est appelé au maximum ; le solde de 5 % n'est dû qu'à la livraison."
      },
      {
        "question": "Le solde de 5 % en VEFA est dû à la livraison ; en cas de réserves, l'acquéreur peut…",
        "options": [
          "Le consigner chez un tiers jusqu'à la levée des réserves",
          "En exiger le remboursement total",
          "Le verser sans condition",
          "Le réduire de moitié définitivement"
        ],
        "correct": 0,
        "explication": "En présence de réserves, consigner les 5 % de solde est un levier de pression légitime jusqu'à leur levée."
      },
      {
        "question": "Pendant la construction, les intérêts que l'emprunteur paie uniquement sur les sommes déjà débloquées s'appellent…",
        "options": [
          "Les intérêts intercalaires",
          "Les intérêts de retard",
          "Les intérêts composés",
          "Les frais de garantie"
        ],
        "correct": 0,
        "explication": "Les intérêts intercalaires portent sur les seules sommes libérées ; la mensualité pleine ne démarre généralement qu'à la livraison, d'où une double charge à anticiper."
      },
      {
        "question": "Depuis le 1er janvier 2015, quelle forme de Garantie Financière d'Achèvement est seule admise en VEFA ?",
        "options": [
          "La GFA extrinsèque, délivrée par un établissement tiers",
          "La GFA intrinsèque",
          "La caution personnelle du promoteur",
          "L'assurance dommages-ouvrage"
        ],
        "correct": 0,
        "explication": "Depuis 2015, seule la GFA extrinsèque (banque ou assureur) est admise ; la garantie intrinsèque a disparu."
      },
      {
        "question": "À quoi sert l'assurance dommages-ouvrage souscrite par le promoteur avant le chantier ?",
        "options": [
          "Préfinancer les réparations décennales sans attendre une décision de justice",
          "Garantir l'achèvement en cas de faillite du promoteur",
          "Couvrir les loyers impayés du futur locataire",
          "Rembourser le dépôt de garantie"
        ],
        "correct": 0,
        "explication": "La dommages-ouvrage préfinance les réparations relevant de la décennale sans attendre un procès, et se transmet aux acquéreurs successifs pendant 10 ans."
      },
      {
        "question": "Dans le neuf, pendant la première année suivant la réception, quelle garantie couvre tous les désordres signalés, même mineurs ?",
        "options": [
          "La garantie de parfait achèvement",
          "La garantie biennale",
          "La garantie décennale",
          "La garantie d'isolation phonique"
        ],
        "correct": 0,
        "explication": "La garantie de parfait achèvement (article 1792-6) oblige le promoteur à réparer tous les désordres signalés la première année."
      },
      {
        "question": "Depuis le 1er avril 2025, le prêt à taux zéro (PTZ) dans le neuf est…",
        "options": [
          "Ouvert sur tout le territoire et à tous les logements neufs, maisons individuelles incluses",
          "Réservé au collectif en zone tendue",
          "Supprimé",
          "Réservé aux résidences secondaires"
        ],
        "correct": 0,
        "explication": "Depuis le 1er avril 2025 et jusqu'au 31 décembre 2027, le PTZ neuf est ouvert partout et à tous les logements neufs, y compris les maisons individuelles."
      },
      {
        "question": "Pour bénéficier de l'exonération de taxe foncière de 2 ans dans le neuf, il faut déclarer l'achèvement au fisc dans un délai de…",
        "options": [
          "90 jours",
          "30 jours",
          "6 mois",
          "1 an"
        ],
        "correct": 0,
        "explication": "La construction neuve est exonérée de taxe foncière 2 ans, à condition de déclarer l'achèvement dans les 90 jours via « Gérer mes biens immobiliers »."
      }
    ]
  },
  {
    "id": "plus-value",
    "titre": "Fiscalité : la plus-value immobilière",
    "icone": "🧾",
    "categorie": "Juridique",
    "resume": "Calcul, abattements 22/30 ans, exonérations, surtaxe, SCI, réforme LMNP 2025 et rôle du négociateur sur la plus-value immobilière des particuliers.",
    "duree": "38 min",
    "lecons": [
      {
        "titre": "Comprendre la plus-value : champ, acteurs et enjeux",
        "contenu": [
          "La **plus-value immobilière des particuliers** est le gain réalisé entre le **prix d'achat** et le **prix de vente** d'un bien par un particulier. C'est un impôt à part, prélevé **le jour de la vente** chez le notaire : il peut être **lourd**… ou **totalement exonéré**. Savoir le repérer fait partie du conseil d'un bon négociateur.",
          "## Le vocabulaire à maîtriser",
          "- La **plus-value brute** : la différence entre le prix de cession corrigé et le prix d'acquisition corrigé, avant tout abattement.",
          "- La **plus-value nette imposable** : ce qui reste après application des abattements pour durée de détention. C'est elle qui sert de base à l'impôt.",
          "- Le **prélèvement libératoire** : l'impôt est retenu une fois pour toutes par le notaire ; le vendeur n'a rien à régulariser ensuite.",
          "## Qui et quoi est concerné",
          "- Les **particuliers** (personnes physiques) qui vendent un bien immobilier de leur patrimoine privé.",
          "- Les **SCI à l'impôt sur le revenu** et les indivisions : chaque associé ou indivisaire est imposé sur **sa quote-part**, selon le régime des particuliers.",
          "- La **cession de parts** d'une société à prépondérance immobilière (SCI familiale) relève aussi de ce régime.",
          "- Sont visés : résidence secondaire, bien **locatif**, terrain, garage, cave, terrain à bâtir — et la résidence principale, mais celle-ci est exonérée (voir plus loin).",
          "- Sont aussi concernés l'**échange** de biens (traité comme une double vente) et la cession d'un **droit démembré** (usufruit ou nue-propriété).",
          "## Ce qui n'est PAS une plus-value des particuliers",
          "- Les ventes relevant d'une **activité professionnelle** (marchand de biens, loueur en meublé professionnel, SCI à l'IS) : régime des plus-values **professionnelles**, totalement différent (amortissements réintégrés, pas d'abattement pour durée).",
          "- Une **moins-value** immobilière n'est en principe **ni déductible ni reportable** : si vous vendez à perte, vous ne récupérez rien fiscalement.",
          "## Qui calcule et qui paie",
          "Le **notaire** est le pivot : il calcule la plus-value, rédige la déclaration (**formulaire 2048-IMM** pour un immeuble, 2048-M pour des parts de société), **prélève l'impôt directement sur le prix de vente** et le reverse à l'administration. Le vendeur n'a aucune démarche à faire a posteriori : c'est un **prélèvement libératoire**.",
          "## L'impact sur le revenu fiscal de référence",
          "La plus-value est libératoire, mais la **plus-value nette imposable** s'ajoute au **revenu fiscal de référence (RFR)** de l'année. Un RFR gonflé peut faire perdre des avantages : exonérations locales de taxe, bénéfice de certaines aides, franchissement d'un seuil. À signaler au vendeur sur les grosses opérations.",
          "## Mini-cas",
          "Mme Roux vend à **Martigues** un studio **locatif** acheté il y a 12 ans. Elle pense « encaisser tout le prix ». Le négociateur l'alerte : « Sur un bien locatif détenu 12 ans, il restera de la plus-value à payer chez le notaire — faisons chiffrer votre **net réel** avant de fixer votre prix. » Ce réflexe évite une déconvenue le jour de l'acte.",
          "## À retenir",
          "Le négociateur ne calcule jamais officiellement la plus-value : il la **détecte**, **alerte** et **renvoie au notaire**. C'est ce triptyque qui crédibilise son conseil et sécurise la vente."
        ]
      },
      {
        "titre": "Le calcul : prix de cession et prix d'acquisition",
        "contenu": [
          "La plus-value **brute** se calcule simplement : **prix de cession corrigé − prix d'acquisition corrigé**. Toute la finesse est dans les **corrections**, qui réduisent légalement la base imposable.",
          "## Le prix de cession (ce que vous vendez)",
          "On part du prix réel figurant dans l'acte, puis on le **diminue** des frais supportés par le vendeur, sur justificatifs :",
          "- Frais des **diagnostics obligatoires** (DPE, amiante, plomb, termites, gaz, électricité, ERP, mesurage Carrez…).",
          "- Frais de **mainlevée d'hypothèque**.",
          "- **Commission d'agence** si elle est à la charge du **vendeur** (le mandat le précise). Si elle est à la charge de l'acquéreur, elle ne vient pas en diminution.",
          "- Le prix peut aussi être **majoré** de certaines sommes versées par l'acquéreur (par exemple une indemnité d'éviction remboursée au vendeur).",
          "## Le prix d'acquisition (ce que vous aviez payé)",
          "On part du prix d'achat d'origine, puis on le **majore** pour réduire la plus-value :",
          "- **Frais d'acquisition** (droits d'enregistrement, émoluments du notaire) : au **réel** sur justificatifs, ou **forfait de 7,5 %** du prix d'achat si vous ne retrouvez pas les justificatifs. Ce forfait ne vaut que pour une acquisition à **titre onéreux**.",
          "- **Travaux** : montant **réel** des travaux de construction, reconstruction, agrandissement ou amélioration **facturés par une entreprise**, OU **forfait de 15 %** du prix d'achat si le bien bâti est détenu **depuis plus de 5 ans**.",
          "- **Frais de voirie, réseaux et distribution** supportés sur un terrain, ajoutés au prix d'acquisition.",
          "## Pièges sur les travaux",
          "- Les travaux d'**entretien et de réparation** (peinture, moquette, chaudière remplacée à l'identique) ne sont **pas** déductibles.",
          "- Les travaux déjà **déduits des revenus fonciers** ne peuvent pas être repris (pas de double emploi).",
          "- Les travaux réalisés **soi-même**, ou le matériel acheté seul sans pose par une entreprise, ne comptent **pas** : conservez les **factures d'entreprise**.",
          "- On choisit toujours le **plus avantageux** entre le réel et le forfait de 15 %.",
          "## Acquisition reçue par donation ou succession",
          "Pas de prix d'achat : on retient la **valeur vénale déclarée** dans l'acte de donation ou de succession, **majorée des droits de mutation** payés et des frais d'acte réels. Le forfait de 7,5 % ne s'applique pas dans ce cas.",
          "Point crucial : la **durée de détention** se compte à partir de la **date de la donation ou du décès**, et non de la date d'achat initiale par le donateur ou le défunt. Un bien hérité puis revendu rapidement peut donc générer une forte plus-value, même s'il était dans la famille depuis longtemps.",
          "## Mini-cas chiffré",
          "Appartement **locatif** à Martigues, acheté **150 000 €** il y a 18 ans, vendu **250 000 €** :",
          "- Prix de cession corrigé : 250 000 − 1 300 € (diagnostics + mainlevée) = **248 700 €**.",
          "- Prix d'acquisition corrigé : 150 000 + 7,5 % (11 250 €) + forfait travaux 15 % (22 500 €) = **183 750 €**.",
          "- **Plus-value brute = 248 700 − 183 750 = 64 950 €**. C'est cette base qui subira ensuite les abattements pour durée.",
          "## Erreur fréquente",
          "Oublier de majorer le prix d'acquisition : beaucoup de vendeurs calculent « prix de vente − prix d'achat » brut et surestiment leur impôt. Rappeler l'existence des forfaits (7,5 % + 15 %) rassure immédiatement."
        ]
      },
      {
        "titre": "Les abattements pour durée de détention",
        "contenu": [
          "C'est le mécanisme central : **plus on détient longtemps, moins on paie**, jusqu'à l'exonération totale. Attention, l'impôt sur le revenu (19 %) et les prélèvements sociaux (17,2 %) n'ont **pas le même rythme** d'abattement.",
          "## Point de départ du compteur",
          "La durée se compte **de date à date**, par **années pleines de détention**, entre l'acte d'achat et l'acte de vente (ou la promesse valant vente). Les **5 premières années** ne donnent **aucun** abattement.",
          "Pour un bien reçu par **donation ou succession**, le compteur démarre à la date de la **donation ou du décès**, pas à l'achat initial par le donateur ou le défunt.",
          "## Abattement sur l'impôt sur le revenu (19 %)",
          "- **6 % par an** de la **6e à la 21e année** de détention.",
          "- **4 % la 22e année**.",
          "- Soit **exonération totale d'impôt sur le revenu à 22 ans** de détention.",
          "## Abattement sur les prélèvements sociaux (17,2 %)",
          "- **1,65 % par an** de la 6e à la 21e année.",
          "- **1,60 % la 22e année**.",
          "- **9 % par an** de la 23e à la 30e année.",
          "- Soit **exonération totale des prélèvements sociaux à 30 ans** de détention.",
          "## Le piège classique",
          "Beaucoup de vendeurs croient qu'à **22 ans tout est exonéré**. Faux : à 22 ans, l'**impôt sur le revenu** disparaît, mais il reste **8 années** de prélèvements sociaux à courir. L'exonération **complète** n'est acquise qu'à **30 ans**.",
          "## Repères mémoire",
          "- **« 22 / 30 »** : 22 ans pour l'impôt, 30 ans pour le social.",
          "- Entre 22 et 30 ans, il ne reste **que** les prélèvements sociaux — mais leur abattement s'accélère fortement (9 %/an).",
          "- Les **5 premières années** : aucune réduction, la plus-value est pleinement taxée.",
          "## Mini-cas (suite de la leçon précédente)",
          "Plus-value brute de **64 950 €**, bien détenu **18 ans** (donc 13 années d'abattement, de la 6e à la 18e) :",
          "- **Impôt sur le revenu** : abattement 13 × 6 % = **78 %** → base imposable = 64 950 × 22 % = **14 289 €**, impôt = 19 % = **2 715 €**.",
          "- **Prélèvements sociaux** : abattement 13 × 1,65 % = **21,45 %** → base = 64 950 × 78,55 % = **51 018 €**, soit 17,2 % = **8 775 €**.",
          "- **Total ≈ 11 490 €** prélevés par le notaire. La différence de rythme explique que le « social » pèse bien plus lourd que l'impôt sur le revenu.",
          "## L'astuce du calendrier",
          "Quand un vendeur approche d'un **palier** (la 6e année, la 22e, la 30e), quelques semaines peuvent changer la facture. Repérer la **date d'anniversaire** de l'acquisition et, si le projet le permet, décaler légèrement la signature peut faire gagner une année pleine d'abattement. À valider toujours avec le notaire."
        ]
      },
      {
        "titre": "Taux d'imposition, prélèvements sociaux et surtaxe",
        "contenu": [
          "Une fois la base imposable obtenue (après abattements), on applique le taux, puis éventuellement une **surtaxe** sur les très grosses plus-values.",
          "## Le taux de base",
          "- **19 %** d'impôt sur le revenu.",
          "- **17,2 %** de prélèvements sociaux.",
          "- Soit **36,2 %** au total lorsque la plus-value est pleinement taxée (sans abattement) ; au-delà de 5 ans, l'impôt et le social se calculent sur des **bases différentes** du fait de leurs abattements distincts.",
          "## Le détail des 17,2 % de prélèvements sociaux",
          "- **CSG** : 9,2 %.",
          "- **CRDS** : 0,5 %.",
          "- **Prélèvement de solidarité** : 7,5 %.",
          "- Contrairement aux revenus fonciers, la CSG sur plus-value immobilière n'est **pas déductible** du revenu imposable.",
          "## La surtaxe (taxe sur les plus-values immobilières élevées)",
          "Elle frappe les plus-values **imposables supérieures à 50 000 €** (base retenue pour l'impôt sur le revenu, appréciée **par vendeur**). Taux **progressif de 2 % à 6 %** :",
          "- Jusqu'à **50 000 €** : **pas** de surtaxe.",
          "- De 50 001 à 100 000 € : **2 %**.",
          "- De 100 001 à 150 000 € : **3 %**.",
          "- De 150 001 à 200 000 € : **4 %**.",
          "- De 200 001 à 250 000 € : **5 %**.",
          "- Au-delà de 250 000 € : **6 %**.",
          "Le taux s'applique à la **totalité** de la plus-value imposable (et non à la seule fraction qui dépasse le seuil). Un **mécanisme de lissage** atténue l'effet de seuil sur les **premiers 10 000 €** de chaque tranche.",
          "## Deux exclusions importantes",
          "- La **résidence principale** n'est jamais concernée (elle est déjà exonérée).",
          "- Les **terrains à bâtir** sont **exclus** de la surtaxe.",
          "## Cas des indivisions et des couples",
          "Le seuil de 50 000 € s'apprécie **par vendeur** (quote-part). Deux indivisaires à 50/50, ou deux époux vendant un bien commun, peuvent chacun rester sous le seuil et **échapper à la surtaxe** alors qu'une vente faite par une seule personne y serait soumise.",
          "## Mini-cas chiffré",
          "Résidence **secondaire** achetée **200 000 €** en 2015, vendue **500 000 €** en 2026 (détention 11 ans) :",
          "- Prix d'acquisition corrigé : 200 000 + 7,5 % + 15 % = **245 000 €** ; plus-value brute = **255 000 €**.",
          "- Abattement 6 ans (6e à 11e) : impôt sur le revenu 36 %, prélèvements sociaux 9,9 %.",
          "- Base **impôt sur le revenu** = 255 000 × 64 % = **163 200 €** → surtaxe au palier 150 001-200 000 (4 %) ≈ **6 530 €**, plus impôt 19 % ≈ **31 000 €**.",
          "- Base **prélèvements sociaux** = 255 000 × 90,1 % ≈ 229 755 € → 17,2 % ≈ **39 500 €**.",
          "- **Addition ≈ 77 000 €** : sur une résidence secondaire, la facture peut être très lourde. D'où l'intérêt d'alerter **avant** de signer."
        ]
      },
      {
        "titre": "L'exonération reine : la résidence principale",
        "contenu": [
          "C'est l'exonération la plus fréquente et la plus puissante : la vente de la **résidence principale** (et de ses dépendances) est **totalement exonérée**, **sans condition de durée** ni de montant (article 150 U du Code général des impôts).",
          "## Les conditions",
          "- Le logement doit être la **résidence principale effective et habituelle** du vendeur **au jour de la vente** (ou au jour où il l'a quittée, voir ci-dessous).",
          "- La résidence principale est celle où le vendeur réside **la majeure partie de l'année** : ce n'est pas une simple adresse déclarée. L'administration peut demander des **preuves** (factures d'énergie, taxe d'habitation, assurance habitation, courrier, adresse fiscale).",
          "## Le « délai normal de vente »",
          "Si le vendeur a **déménagé avant** d'avoir vendu, l'exonération reste acquise à condition que le bien soit vendu dans un **délai normal** — en pratique **un an** — qu'il n'ait pas été **loué** ni occupé gratuitement entre-temps, et que le vendeur ait entrepris les démarches de vente **sans tarder** (mandat, annonces, prix de marché).",
          "## Séparation, divorce et concubinage",
          "- En cas de **divorce ou de séparation**, l'exonération est maintenue pour l'ex-conjoint qui a dû quitter le logement, même s'il n'y habite plus au jour de la vente, à condition que le bien ait été occupé par l'autre membre du couple jusqu'à la mise en vente et que la cession intervienne dans un **délai normal**.",
          "- Les **couples non mariés** (concubins, pacsés) sont chacun appréciés selon leur propre situation.",
          "## Les dépendances",
          "Les **dépendances immédiates et nécessaires** vendues **en même temps** que la résidence principale sont exonérées : cave, garage, place de parking (en pratique si située à moins de **1 km** du logement), cour, chambre de service, jardin — y compris la fraction de terrain considérée comme dépendance.",
          "## Cas particuliers",
          "- **Personne en EHPAD ou maison de retraite** : l'ancienne résidence principale reste exonérée si elle est vendue dans les **2 ans** suivant l'entrée en établissement, sous conditions de **ressources** (RFR) et de non-assujettissement à l'IFI, et à condition que le logement soit resté **inoccupé** depuis le départ.",
          "- **Logement en cours de construction** destiné à devenir la résidence principale : des tolérances existent lorsque le vendeur ne possède pas encore sa résidence principale, à valider avec le notaire.",
          "- **Usage mixte** (habitation + professionnel) : seule la fraction affectée à l'habitation principale est exonérée ; la partie professionnelle suit son propre régime.",
          "## Pièges à éviter",
          "- La **résidence secondaire** ne bénéficie jamais de cette exonération, même occupée très régulièrement.",
          "- Un bien **loué** jusqu'à la veille de la vente n'est **pas** une résidence principale : la requalification coûte cher.",
          "- Vendre « sa résidence principale » tout en vivant ailleurs depuis deux ans : l'administration contrôle, et le redressement est possible.",
          "## Script d'alerte",
          "« Ce bien est bien votre **résidence principale aujourd'hui** ? Parfait, dans ce cas la plus-value est **exonérée**. Mais si vous aviez déménagé depuis plus d'un an, ou si le bien est loué, parlons-en : cela change tout, et votre notaire devra regarder de près. »"
        ]
      },
      {
        "titre": "Les autres exonérations",
        "contenu": [
          "En dehors de la résidence principale, plusieurs situations exonèrent tout ou partie de la plus-value. Les connaître permet de **rassurer un vendeur** ou de **détecter un risque**.",
          "## Première cession d'un logement autre que la résidence principale",
          "Exonération sous trois conditions cumulatives (article 150 U, II-1° bis) :",
          "- Le vendeur **n'a pas été propriétaire de sa résidence principale** au cours des **4 années** précédant la vente.",
          "- Il **remploie** le prix de vente dans l'achat ou la construction de sa **résidence principale** dans un délai de **24 mois**.",
          "- L'exonération est **proportionnelle** à la part du prix effectivement remployée.",
          "## Petites cessions",
          "- Vente dont le **prix de cession est inférieur ou égal à 15 000 €** : exonération totale. Le seuil s'apprécie **par bien et par vendeur** (utile pour un garage, une cave, une petite parcelle).",
          "## Retraités et personnes invalides modestes",
          "- Exonération pour les titulaires d'une **pension de retraite** ou d'une **carte mobilité inclusion mention invalidité**, sous conditions de **ressources** (revenu fiscal de référence) et de non-assujettissement à l'IFI.",
          "## Durée de détention",
          "- Exonération d'**impôt sur le revenu à 22 ans**, **totale à 30 ans** (voir leçon sur les abattements).",
          "## Expropriation",
          "- Plus-value exonérée en cas d'**expropriation** si l'indemnité est **remployée** dans les **12 mois** suivant sa perception, pour au moins 90 % de son montant.",
          "## Non-résidents",
          "- Un **non-résident** ressortissant de l'UE/EEE (ou d'un État lié par convention d'assistance) peut être exonéré sur la cession d'un **logement situé en France**, dans la limite de **150 000 € de plus-value nette par cédant**, pour **une seule** cession, sous conditions (notamment avoir été fiscalement domicilié en France au moins deux ans à un moment quelconque).",
          "- Pour un cédant **hors UE/EEE**, un **représentant fiscal accrédité** peut être exigé lorsque le **prix de cession dépasse 150 000 €**. Dispense si le prix n'excède pas 150 000 € ou si la plus-value est **totalement exonérée** du fait de la durée de détention (plus de 30 ans).",
          "## Cession au profit du logement social",
          "- Des exonérations ou abattements spécifiques existent pour les ventes destinées au **logement social** (article 150 U, II-7° et 8°), lorsque l'acquéreur est un organisme HLM ou s'engage à réaliser des logements sociaux.",
          "## Partage et licitation familiale",
          "- Le **partage** d'un bien indivis entre membres d'une même famille (succession, communauté conjugale) n'est pas, en principe, considéré comme une cession taxable : il n'y a pas de plus-value, même si l'un des indivisaires verse une **soulte** aux autres.",
          "## Attention",
          "Ces régimes ont des conditions **strictes** et **cumulatives**. Le négociateur **signale** une piste d'exonération, mais c'est le **notaire** qui tranche et sécurise. Ne jamais promettre une exonération sans validation."
        ]
      },
      {
        "titre": "Cas particuliers et stratégies légales",
        "contenu": [
          "Au niveau Expert, certains montages et situations reviennent souvent. Objectif : **savoir en parler** et renvoyer au bon interlocuteur, jamais conseiller un montage à la place du notaire ou du fiscaliste.",
          "## SCI à l'IR ou SCI à l'IS",
          "- **SCI à l'impôt sur le revenu** : régime des plus-values des **particuliers** (abattements pour durée, exonérations). C'est le cas des SCI familiales classiques.",
          "- **SCI à l'impôt sur les sociétés** : régime des plus-values **professionnelles**. Les amortissements pratiqués sont **réintégrés** et il n'y a **pas d'abattement pour durée** : la plus-value peut être bien plus lourde. Un piège fréquent pour des vendeurs qui l'ignorent.",
          "## Cession de parts de SCI",
          "- Vendre les **parts** d'une SCI à l'IR relève du régime de la plus-value immobilière (société à prépondérance immobilière), avec les mêmes abattements pour durée. La déclaration se fait sur le **formulaire 2048-M**.",
          "## La réforme LMNP depuis 2025",
          "- Depuis la loi de finances 2025 (pour les cessions postérieures au **15 février 2025**), les **amortissements** déduits par un **loueur en meublé non professionnel (LMNP)** sont désormais **réintégrés** dans le calcul de la plus-value : ils viennent **diminuer le prix d'acquisition**, donc **augmenter** la plus-value imposable.",
          "- La plus-value reste calculée selon le **régime des particuliers** (abattements 22/30 ans), mais la base de départ est plus élevée qu'avant. Les amortissements correspondant à des **travaux** (construction, agrandissement, amélioration) déjà pris en compte échappent à la réintégration.",
          "- Conséquence pour le négociateur : un vendeur LMNP ayant beaucoup amorti peut avoir une plus-value nettement supérieure à ce qu'il imagine. À faire chiffrer impérativement.",
          "## Démembrement : usufruit et nue-propriété",
          "- La vente d'un **usufruit** ou d'une **nue-propriété** génère une plus-value, calculée sur la quote-part de valeur correspondante (barème de l'article 669 du CGI selon l'âge de l'usufruitier).",
          "- La réunion de l'usufruit et de la nue-propriété suit des règles précises : à confier au notaire.",
          "## Vente en viager",
          "- En **viager**, la plus-value se calcule sur le **prix total** (bouquet + valeur capitalisée de la rente) à la date de la vente, selon le régime des particuliers. Le vendeur (crédirentier) est imposé l'année de la cession, même si la rente sera versée ensuite.",
          "## Terrain à bâtir",
          "- Même régime d'abattement que le bâti depuis 2014, mais **pas** de forfait travaux de 15 % et **exclusion de la surtaxe**.",
          "## La donation avant cession (purge de plus-value)",
          "- Donner un bien à ses enfants **avant** la vente **purge** la plus-value : la valeur retenue devient celle de la **donation récente**, proche du prix de vente, donc **peu ou pas** de plus-value pour les donataires.",
          "- Outil **légal** et puissant, mais encadré : la donation doit être **réelle** (le donateur ne doit pas récupérer le prix), sinon **abus de droit** (article L64 du Livre des procédures fiscales). À monter **exclusivement** avec le notaire.",
          "## Abattement exceptionnel zones tendues (loi de finances 2024)",
          "- Pour les cessions de biens bâtis ou de terrains en **zone tendue** (A, A bis, B1) destinés à la **démolition-reconstruction** de logements collectifs, un **abattement exceptionnel de 60 %** s'applique, porté à **75 % voire 85 %** lorsque l'acquéreur s'engage à affecter au moins **50 % de la surface habitable** à du **logement social ou intermédiaire**.",
          "- Conditions : promesse de vente signée entre le **1er janvier 2024 et le 31 décembre 2025**, acte authentique dans les **deux ans**, et densification du bâti. Dispositif de niche, à vérifier au cas par cas.",
          "## Mini-cas",
          "Un couple de **Martigues** détient un immeuble de rapport via une **SCI à l'IS**. Ils croient bénéficier de l'abattement 22/30 ans : le négociateur alerte — « En SCI à l'IS, pas d'abattement pour durée et réintégration des amortissements ; voyons le **net réel** avec votre expert-comptable **avant** de fixer le prix. »"
        ]
      },
      {
        "titre": "Déclaration, paiement et circuit chez le notaire",
        "contenu": [
          "Comprendre le **circuit déclaratif** permet au négociateur d'anticiper les documents à réunir et de fluidifier la vente. Tout passe par le notaire, mais une préparation en amont évite les blocages de dernière minute.",
          "## La déclaration",
          "- Pour la cession d'un **immeuble** : formulaire **2048-IMM**, établi par le notaire.",
          "- Pour la cession de **parts** de société à prépondérance immobilière : formulaire **2048-M**.",
          "- La déclaration est **déposée au service de publicité foncière** en même temps que l'acte, accompagnée du paiement.",
          "## Le paiement",
          "- L'impôt (19 %) et les prélèvements sociaux (17,2 %) sont **prélevés sur le prix** par le notaire le **jour de la signature de l'acte authentique**, puis reversés à l'administration.",
          "- C'est un **prélèvement libératoire** : le vendeur n'a **aucune régularisation** à faire l'année suivante sur cette plus-value.",
          "- Seule la **plus-value nette imposable** est à reporter, pour information, dans la déclaration de revenus (case dédiée), car elle entre dans le **revenu fiscal de référence**.",
          "## Les justificatifs à réunir",
          "- Titre de propriété (acte d'achat, de donation ou attestation de succession).",
          "- **Factures d'entreprise** des travaux, pour les déduire au réel.",
          "- Justificatifs des frais d'acquisition si l'on renonce au forfait de 7,5 %.",
          "- Preuves d'occupation pour une résidence principale (factures, taxes, courriers).",
          "## Le représentant fiscal",
          "- Pour certains vendeurs **non-résidents hors UE/EEE**, lorsque le prix dépasse **150 000 €**, le notaire exige la désignation d'un **représentant fiscal accrédité** qui garantit le paiement de l'impôt.",
          "## Contrôle et rectification",
          "- L'administration dispose d'un **délai de reprise** pour contrôler la déclaration (en général jusqu'à la fin de la **3e année** suivant la vente).",
          "- Une **requalification** (fausse résidence principale, travaux non justifiés, donation fictive) entraîne un redressement avec **intérêts de retard** et éventuellement des **pénalités**.",
          "## Le réflexe négociateur",
          "Réunir tôt les justificatifs (année et mode d'acquisition, factures de travaux, preuves d'occupation) et les transmettre au notaire dès le compromis : c'est le meilleur moyen d'obtenir un **chiffrage fiable** du net vendeur et d'éviter une surprise à l'acte."
        ]
      },
      {
        "titre": "Le rôle du négociateur : détecter, chiffrer, sécuriser",
        "contenu": [
          "Vous n'êtes **ni notaire ni fiscaliste**, et vous ne devez jamais calculer officiellement une plus-value. Mais la **détecter** et en **parler au bon moment** fait partie d'un conseil d'élite — et protège votre vente.",
          "## Détecter dès la découverte",
          "Posez systématiquement, en R1, les questions qui révèlent un risque de plus-value :",
          "- « Ce bien est-il votre **résidence principale**, une résidence secondaire ou un **bien loué** ? »",
          "- « Depuis quelle année en êtes-vous **propriétaire** ? »",
          "- « L'avez-vous **acheté**, ou reçu par **donation / succession** ? »",
          "- « Détenez-vous le bien en **direct**, en **indivision** ou via une **SCI** ? »",
          "- « Avez-vous conservé les **factures de travaux** réalisés par des entreprises ? »",
          "## Pourquoi c'est décisif",
          "- Un vendeur qui découvre la plus-value **le jour de l'acte** est un vendeur **furieux**, parfois au point de faire capoter la vente. L'alerte précoce **sécurise** la transaction et votre honoraire.",
          "- Le **net vendeur** réel conditionne souvent le projet suivant (le rachat) : un net surestimé fait acheter un bien que le vendeur ne pourra pas financer.",
          "## Raisonner en « net vendeur réel »",
          "- Net vendeur = prix de vente − honoraires (si à sa charge) − **capital restant dû** au prêt − **plus-value estimée**.",
          "- Faites toujours l'estimation du net **avant** de fixer le prix de mise en vente, surtout sur un bien locatif, une résidence secondaire ancienne ou un bien détenu en **LMNP**.",
          "## Le bon script d'alerte",
          "« Sur un bien qui n'est pas votre résidence principale, il peut rester de la **plus-value** à régler chez le notaire. Je ne suis pas fiscaliste, donc je préfère qu'on fasse **chiffrer précisément** par votre notaire : comme ça, on fixe votre prix sur votre **net réel**, sans mauvaise surprise le jour de la signature. »",
          "## Articuler avec le notaire",
          "- Transmettez tôt au notaire : **année et mode d'acquisition**, **valeur d'origine**, **factures de travaux d'entreprise**, **nature du bien** (résidence principale, locatif…).",
          "- Le notaire établit la déclaration **2048-IMM** et prélève l'impôt sur le prix : le vendeur **repart net**.",
          "## Erreurs fréquentes à éviter",
          "- Promettre « vous êtes exonéré » sans vérifier : seul le notaire valide.",
          "- Oublier d'alerter sur un **bien loué** vendu comme « ancienne résidence ».",
          "- Confondre **22 ans** (impôt sur le revenu) et **exonération totale** (30 ans).",
          "- Ignorer la **surtaxe** sur une grosse plus-value de résidence secondaire.",
          "- Oublier l'impact de la **réforme LMNP 2025** sur un vendeur en meublé.",
          "## Mini-cas de synthèse",
          "À **Martigues**, un vendeur veut mettre en vente à 320 000 € un appartement **locatif** acheté 180 000 € il y a 14 ans, pour racheter une maison à 300 000 €. Le négociateur fait chiffrer la plus-value par le notaire (environ 15 000 € restant dus), ajuste le **net vendeur** et sécurise le financement du rachat **avant** la mise en vente. Résultat : pas de blocage à l'acte, un client confiant, une recommandation à la clé."
        ]
      }
    ],
    "quiz": [
      {
        "question": "La vente de la résidence principale est…",
        "options": [
          "Taxée à 36,2 %",
          "Exonérée totalement, sans condition de durée",
          "Exonérée seulement après 22 ans de détention",
          "Soumise à la surtaxe"
        ],
        "correct": 1,
        "explication": "La résidence principale effective au jour de la vente est exonérée de plus-value, sans condition de durée ni de montant (article 150 U du CGI)."
      },
      {
        "question": "L'exonération TOTALE de la plus-value (impôt sur le revenu + prélèvements sociaux) est atteinte après…",
        "options": [
          "5 ans",
          "22 ans",
          "30 ans",
          "Jamais"
        ],
        "correct": 2,
        "explication": "À 22 ans, seul l'impôt sur le revenu (19 %) est exonéré ; il faut atteindre 30 ans de détention pour exonérer aussi les prélèvements sociaux (17,2 %)."
      },
      {
        "question": "Le taux global de la plus-value, quand elle est pleinement taxée (sans abattement), est de…",
        "options": [
          "19 %",
          "17,2 %",
          "36,2 %",
          "50 %"
        ],
        "correct": 2,
        "explication": "19 % d'impôt sur le revenu + 17,2 % de prélèvements sociaux = 36,2 %. Au-delà de 5 ans, l'impôt et le social se calculent ensuite sur des bases différentes du fait de leurs abattements distincts."
      },
      {
        "question": "La surtaxe sur les plus-values élevées s'applique lorsque la plus-value imposable dépasse…",
        "options": [
          "15 000 €",
          "50 000 €",
          "100 000 €",
          "150 000 €"
        ],
        "correct": 1,
        "explication": "Au-delà de 50 000 € de plus-value imposable (par vendeur), une surtaxe progressive de 2 % à 6 % s'ajoute. La résidence principale et les terrains à bâtir en sont exclus."
      },
      {
        "question": "Le forfait travaux de 15 % du prix d'achat (sans justificatifs) est utilisable…",
        "options": [
          "Toujours, quel que soit le bien",
          "Si le bien bâti est détenu depuis plus de 5 ans",
          "Uniquement avec les factures d'entreprise",
          "Jamais pour un bien locatif"
        ],
        "correct": 1,
        "explication": "Le forfait de 15 % s'applique aux immeubles bâtis détenus depuis plus de 5 ans ; sinon on retient les travaux réels facturés par une entreprise. On garde le plus avantageux."
      },
      {
        "question": "Qui calcule et prélève la plus-value immobilière du particulier ?",
        "options": [
          "Le vendeur, dans sa déclaration de revenus l'année suivante",
          "Le notaire, le jour de la vente (déclaration 2048-IMM)",
          "L'agent immobilier",
          "Le service des impôts, un an après l'acte"
        ],
        "correct": 1,
        "explication": "Le notaire calcule la plus-value, établit le formulaire 2048-IMM et prélève l'impôt directement sur le prix de vente : c'est un prélèvement libératoire, le vendeur n'a aucune démarche à faire ensuite."
      },
      {
        "question": "Pour un bien reçu par succession puis revendu, la durée de détention court à partir…",
        "options": [
          "De la date d'achat initiale par le défunt",
          "De la date du décès (ouverture de la succession)",
          "De la première mise en location du bien",
          "Il n'y a jamais d'abattement sur un bien hérité"
        ],
        "correct": 1,
        "explication": "Pour un bien reçu par donation ou succession, le compteur de la durée de détention démarre à la date de la donation ou du décès, et non à la date d'achat par le donateur ou le défunt. Un bien hérité revendu vite peut donc être fortement taxé."
      },
      {
        "question": "Depuis 2025, pour un vendeur en LMNP (loueur en meublé non professionnel), les amortissements déduits…",
        "options": [
          "Restent sans effet sur la plus-value, comme avant",
          "Sont réintégrés et augmentent la plus-value imposable",
          "Font automatiquement basculer la vente au régime professionnel",
          "Donnent droit à un abattement supplémentaire"
        ],
        "correct": 1,
        "explication": "La loi de finances 2025 réintègre les amortissements dans le calcul de la plus-value LMNP (cessions postérieures au 15 février 2025) : ils diminuent le prix d'acquisition et augmentent donc la base imposable, tout en restant dans le régime des particuliers (abattements 22/30 ans)."
      },
      {
        "question": "La plus-value brute d'un particulier correspond à…",
        "options": [
          "Le prix de cession corrigé moins le prix d'acquisition corrigé",
          "Le prix de vente moins les frais d'agence",
          "Les loyers perçus moins les charges",
          "Le prix d'achat moins les travaux"
        ],
        "correct": 0,
        "explication": "La plus-value brute est la différence entre le prix de cession corrigé et le prix d'acquisition corrigé, avant tout abattement."
      },
      {
        "question": "L'impôt de plus-value immobilière prélevé par le notaire le jour de l'acte est…",
        "options": [
          "Libératoire : aucune régularisation ultérieure sur cette plus-value",
          "À régulariser l'année suivante",
          "Remboursable à 100 %",
          "Reportable sur 10 ans"
        ],
        "correct": 0,
        "explication": "Le prélèvement est libératoire : le vendeur n'a aucune démarche à faire a posteriori, seule la plus-value nette entre dans le revenu fiscal de référence."
      },
      {
        "question": "À défaut de justificatifs, les frais d'acquisition majorant le prix d'achat sont évalués au forfait de…",
        "options": [
          "7,5 % du prix d'achat",
          "15 % du prix d'achat",
          "30 % du prix d'achat",
          "10 % du prix d'achat"
        ],
        "correct": 0,
        "explication": "Le forfait de frais d'acquisition est de 7,5 % du prix d'achat, applicable uniquement pour une acquisition à titre onéreux."
      },
      {
        "question": "L'exonération d'impôt sur le revenu (19 %) sur la plus-value immobilière est acquise après…",
        "options": [
          "22 ans de détention",
          "30 ans de détention",
          "15 ans de détention",
          "5 ans de détention"
        ],
        "correct": 0,
        "explication": "L'abattement de 6 %/an de la 6e à la 21e année, plus 4 % la 22e, aboutit à l'exonération d'impôt sur le revenu à 22 ans."
      },
      {
        "question": "Après 22 ans de détention d'un bien locatif, que reste-t-il à payer en cas de vente ?",
        "options": [
          "Les prélèvements sociaux, jusqu'à 30 ans de détention",
          "Rien, tout est exonéré",
          "L'impôt sur le revenu seul",
          "La surtaxe uniquement"
        ],
        "correct": 0,
        "explication": "À 22 ans l'impôt sur le revenu disparaît, mais les prélèvements sociaux courent jusqu'à l'exonération totale à 30 ans."
      },
      {
        "question": "La plus-value immobilière pleinement taxée (sans abattement) supporte…",
        "options": [
          "19 % d'impôt sur le revenu et 17,2 % de prélèvements sociaux, soit 36,2 %",
          "30 % de flat tax",
          "19 % en tout",
          "36,2 % d'impôt sur le revenu seul"
        ],
        "correct": 0,
        "explication": "Le taux global est de 36,2 % : 19 % d'impôt sur le revenu et 17,2 % de prélèvements sociaux."
      },
      {
        "question": "Les 17,2 % de prélèvements sociaux sur la plus-value se décomposent en…",
        "options": [
          "CSG 9,2 %, CRDS 0,5 % et prélèvement de solidarité 7,5 %",
          "17,2 % de CSG seule",
          "CSG 8 % et CRDS 9,2 %",
          "TVA 5,5 % et CSG 11,7 %"
        ],
        "correct": 0,
        "explication": "Les prélèvements sociaux se répartissent en CSG 9,2 %, CRDS 0,5 % et prélèvement de solidarité 7,5 %, non déductibles sur la plus-value."
      },
      {
        "question": "La surtaxe sur les plus-values imposables supérieures à 50 000 € est progressive de…",
        "options": [
          "2 % à 6 %",
          "1 % à 3 %",
          "5 % à 10 %",
          "0,5 % à 1,5 %"
        ],
        "correct": 0,
        "explication": "La surtaxe va de 2 % à 6 % par tranche et s'applique à la totalité de la plus-value imposable au-delà de 50 000 €."
      },
      {
        "question": "Lequel de ces biens est exclu de la surtaxe sur les plus-values élevées ?",
        "options": [
          "Les terrains à bâtir",
          "Les résidences secondaires",
          "Les biens locatifs",
          "Les parts de SCI à l'IR"
        ],
        "correct": 0,
        "explication": "Les terrains à bâtir sont exclus de la surtaxe, tout comme la résidence principale, déjà exonérée."
      },
      {
        "question": "L'exonération de la plus-value de la résidence principale est soumise à…",
        "options": [
          "Aucune condition de durée de détention ni de montant",
          "Une détention minimale de 5 ans",
          "Un plafond de 150 000 €",
          "Une détention de 22 ans"
        ],
        "correct": 0,
        "explication": "La vente de la résidence principale est totalement exonérée (article 150 U du CGI), sans condition de durée ni de montant."
      },
      {
        "question": "Un vendeur ayant déménagé avant de vendre conserve l'exonération de résidence principale si le bien est vendu dans un délai normal, en pratique de…",
        "options": [
          "Un an, sans que le bien ait été loué entre-temps",
          "Cinq ans",
          "Trois mois",
          "Deux ans dans tous les cas"
        ],
        "correct": 0,
        "explication": "Le délai normal de vente est d'environ un an, à condition que le bien n'ait pas été loué ni occupé gratuitement et que les démarches aient été entreprises sans tarder."
      },
      {
        "question": "Une cession immobilière dont le prix est inférieur ou égal à 15 000 € est…",
        "options": [
          "Totalement exonérée de plus-value",
          "Taxée au taux plein de 36,2 %",
          "Soumise à la surtaxe",
          "Exonérée seulement après 22 ans"
        ],
        "correct": 0,
        "explication": "Les petites cessions à 15 000 € ou moins sont exonérées ; le seuil s'apprécie par bien et par vendeur (utile pour un garage ou une cave)."
      },
      {
        "question": "Donner un bien à ses enfants avant la vente permet, lorsque la donation est réelle, de…",
        "options": [
          "Purger la plus-value, la valeur retenue devenant celle de la donation récente",
          "Doubler l'abattement pour durée",
          "Éviter uniquement les droits de succession",
          "Reporter l'impôt sur 10 ans"
        ],
        "correct": 0,
        "explication": "La donation avant cession purge la plus-value, mais la donation doit être réelle sous peine d'abus de droit : à monter exclusivement avec le notaire."
      },
      {
        "question": "Quel formulaire le notaire établit-il pour déclarer la plus-value sur la cession d'un immeuble ?",
        "options": [
          "Le formulaire 2048-IMM",
          "Le formulaire 2044",
          "Le formulaire P0i",
          "Le formulaire 2042"
        ],
        "correct": 0,
        "explication": "La cession d'un immeuble se déclare sur le 2048-IMM, celle de parts de société à prépondérance immobilière sur le 2048-M."
      }
    ]
  },
  {
    "id": "location-baux",
    "titre": "Location & baux d'habitation",
    "icone": "🔑",
    "categorie": "Juridique",
    "resume": "Bail loi 89, baux spécifiques, dossier et garanties, loyer et encadrement, état des lieux, congé, impayés et décence énergétique.",
    "duree": "43 min",
    "lecons": [
      {
        "titre": "Le bail loi 89 : cadre, durées, contrat type & mentions obligatoires",
        "contenu": [
          "La location d'une résidence principale, vide ou meublée, est régie par la **loi n°89-462 du 6 juillet 1989**. C'est un texte d'**ordre public** : toute clause qui y déroge au détriment du locataire est **réputée non écrite**. À Martigues comme partout en France, un bail bâclé ou incomplet reste la première source de contentieux en gestion locative.",
          "## Le champ d'application",
          "- La loi de 1989 s'applique au logement loué comme **résidence principale** du locataire (occupation au moins 8 mois par an), qu'il soit **vide** ou **meublé**.",
          "- Elle ne s'applique **pas** aux locations saisonnières, aux meublés de tourisme, aux résidences secondaires ni aux logements de fonction.",
          "- Textes clés à connaître : **loi ALUR** du 24 mars 2014 (modèle de bail, encadrement, honoraires), **loi ELAN** du 23 novembre 2018 (bail mobilité, encadrement expérimental), **loi Climat et résilience** du 22 août 2021 (décence énergétique).",
          "## Le contrat type obligatoire",
          "- Depuis la **loi ALUR**, le bail doit respecter le **modèle type** fixé par le **décret n°2015-587 du 29 mai 2015** : la forme n'est pas négociable.",
          "- Le bail est **écrit**, établi en autant d'exemplaires originaux que de parties ; la **signature électronique** est admise.",
          "- Une **notice d'information** (droits et obligations des parties, fonctionnement de la copropriété) doit être annexée.",
          "## Les durées selon le type de location",
          "- **Location vide, bailleur personne physique (ou SCI familiale)** : **3 ans**, reconduit tacitement.",
          "- **Location vide, bailleur personne morale** (hors SCI familiale) : **6 ans**.",
          "- **Meublé** : **1 an**, reconductible tacitement.",
          "- **Meublé étudiant** : **9 mois**, **non reconductible tacitement** (le bail prend fin automatiquement, sans congé).",
          "- **Bail mobilité** : **1 à 10 mois** (voir leçon suivante).",
          "## Les mentions obligatoires du bail",
          "- **Identité et domicile** du bailleur (et du mandataire gestionnaire le cas échéant) et du ou des locataires.",
          "- Date de **prise d'effet** et **durée** du bail.",
          "- **Consistance, destination (habitation), surface habitable** et nombre de pièces.",
          "- Désignation des **locaux et équipements** à usage privatif et des parties communes.",
          "- Montant du **loyer**, modalités de paiement et règle de **révision** (indice IRL).",
          "- Montant du **dépôt de garantie**.",
          "- Montant et nature des **honoraires** à la charge du locataire.",
          "- En zone d'encadrement : **loyer de référence**, **loyer de référence majoré**, et **dernier loyer** appliqué si le précédent locataire est parti depuis moins de **18 mois**.",
          "## Les annexes obligatoires",
          "- Le **dossier de diagnostics techniques (DDT)** : DPE, CREP plomb (logement construit avant 1949), amiante, état des installations électricité et gaz de plus de 15 ans, ERP (état des risques), et diagnostic bruit en zone aéroportuaire.",
          "- La **notice d'information**.",
          "- L'**état des lieux** d'entrée.",
          "- Les **extraits du règlement de copropriété** relatifs à la jouissance et à l'usage des parties privatives et communes.",
          "- En meublé : un **inventaire du mobilier** détaillé.",
          "## Les clauses interdites (réputées non écrites)",
          "- Imposer le **prélèvement automatique** ou la domiciliation comme seul mode de paiement.",
          "- Faire supporter au locataire des **frais de relance** ou des honoraires non prévus par la loi.",
          "- Interdire au locataire d'**héberger des proches** ou de **détenir un animal familier** (sauf chien de 1re catégorie).",
          "- Prévoir une **résiliation automatique** pour un motif autre que l'impayé, le non-versement du dépôt, le défaut d'assurance ou un trouble de voisinage constaté par décision de justice.",
          "- Autoriser le bailleur à percevoir des **amendes** ou à engager la **responsabilité collective** des locataires.",
          "## Erreurs fréquentes à éviter",
          "- Oublier d'annexer le **DPE** : le bail devient contestable et engage la responsabilité du bailleur et de l'agence.",
          "- Confondre **surface habitable** (bail, loi Boutin) et **surface Carrez** (vente en copropriété) : en location, c'est la surface **habitable** qui fait foi.",
          "- Reconduire oralement un **meublé étudiant** : à son terme, il faut signer un **nouveau bail**.",
          "## Mnémonique : les 4 D du bail conforme",
          "- **D**urée correcte selon le type, **D**iagnostics annexés, **D**épôt dans le plafond, **D**escription précise (surface, loyer, charges).",
          "## Mini cas pratique",
          "Un propriétaire de Martigues loue un T3 vide via un mandat de gestion. Vous établissez un bail de **3 ans** (bailleur personne physique), au modèle type, avec DDT complet et état des lieux contradictoire. Six mois plus tard, le locataire conteste l'absence des extraits du règlement de copropriété : annexe oubliée. La leçon : une **check-list d'annexes** cosignée à la signature évite la grande majorité des litiges."
        ]
      },
      {
        "titre": "Meublé, bail mobilité, colocation & meublé de tourisme : les baux spécifiques",
        "contenu": [
          "Au-delà du bail vide classique, plusieurs régimes dérogatoires existent. Les maîtriser permet de proposer au propriétaire la formule la plus adaptée à son bien et à sa cible locative.",
          "## La location meublée : le mobilier obligatoire",
          "Un logement est **meublé** s'il permet au locataire d'y **dormir, manger et vivre** avec ses seuls effets personnels.",
          "Le **décret n°2015-981 du 31 juillet 2015** fixe une **liste de 11 éléments minimum** :",
          "- Literie avec **couette ou couverture**.",
          "- Dispositif d'**occultation des fenêtres** dans les chambres (volets, rideaux).",
          "- **Plaques de cuisson**.",
          "- **Four ou four à micro-ondes**.",
          "- **Réfrigérateur** et **congélateur** (ou compartiment à -6 °C).",
          "- **Vaisselle** en nombre suffisant.",
          "- **Ustensiles de cuisine**.",
          "- **Table et sièges**.",
          "- **Étagères** de rangement.",
          "- **Luminaires**.",
          "- **Matériel d'entretien ménager** adapté au logement.",
          "## Les avantages du meublé",
          "- Loyer souvent **10 à 30 % plus élevé** qu'en vide.",
          "- Charges possibles au **forfait** (ni régularisation ni révision en cours de bail).",
          "- Dépôt de garantie jusqu'à **2 mois** de loyer hors charges.",
          "- Fiscalité **BIC** souvent plus favorable que les revenus fonciers (voir le module Fiscalité immobilière).",
          "## Le bail étudiant (9 mois)",
          "- Meublé d'une durée de **9 mois non reconductible tacitement** : il prend fin automatiquement, sans congé à donner.",
          "- Parfait pour viser les étudiants d'Aix-Marseille, bassin proche de Martigues.",
          "## Le bail mobilité (loi ELAN du 23 novembre 2018)",
          "- Location **meublée** de **1 à 10 mois**, **non renouvelable** et **non reconductible**.",
          "- Réservé à un **public précis** justifiant de sa situation : formation professionnelle, études supérieures, contrat d'apprentissage, stage, engagement de service civique, **mutation professionnelle** ou **mission temporaire**.",
          "- **Aucun dépôt de garantie** n'est autorisé.",
          "- Charges au **forfait** ; la garantie **Visale** (Action Logement) peut couvrir le bailleur.",
          "- Préavis locataire : **1 mois** ; le bailleur ne peut pas donner congé avant le terme.",
          "## La colocation",
          "- Plusieurs locataires partagent le même logement, résidence principale de chacun.",
          "- Deux montages : **bail unique** (avec clause de solidarité) ou **baux individuels** (chacun loue sa chambre).",
          "- **Clause de solidarité** : chaque colocataire répond de **toute** la dette locative. Depuis la **loi ALUR**, le colocataire qui donne congé reste solidaire **jusqu'à l'arrivée d'un remplaçant au bail**, et **au plus tard 6 mois** après la date d'effet de son congé.",
          "- L'assurance habitation doit couvrir **tous** les colocataires.",
          "## Meublé de tourisme & location saisonnière",
          "- Attention à ne pas confondre le **meublé de résidence principale** (loi de 1989) et le **meublé de tourisme** (location de courte durée à une clientèle de passage), qui relève d'un autre régime.",
          "- La résidence principale peut être louée en courte durée **120 jours par an maximum** ; la commune peut abaisser ce plafond à **90 jours** depuis la **loi Le Meur du 19 novembre 2024**.",
          "- Dans de nombreuses communes, une **déclaration en mairie** avec **numéro d'enregistrement** est obligatoire, et un **changement d'usage** (avec compensation) peut être exigé pour les résidences secondaires.",
          "- La loi Le Meur impose aussi un **DPE** aux meublés de tourisme dans les zones tendues et a durci la **fiscalité** du micro-BIC (voir les modules Fiscalité et Location saisonnière).",
          "## Pièges à éviter",
          "- Louer en meublé un logement **incomplet** (ex. sans vaisselle ni plaques) : le juge peut **requalifier** en location vide (bail 3 ans, dépôt limité à 1 mois).",
          "- Signer un **bail mobilité** avec un locataire hors public éligible : le régime dérogatoire tombe et le bail peut être requalifié.",
          "## Mini cas pratique",
          "Un investisseur veut louer un studio meublé près de la zone industrielle de Lavéra à des salariés en mission de 6 mois. Le **bail mobilité** est idéal : pas de dépôt, durée calée sur la mission, **Visale** en garantie. Vous vérifiez le **justificatif de mission temporaire** et calez la durée exacte à 6 mois."
        ]
      },
      {
        "titre": "Le dossier locataire, les garanties & les honoraires de location",
        "contenu": [
          "Sélectionner un locataire solvable sans demander de pièce interdite ni discriminer : c'est tout l'enjeu de la constitution du dossier. La loi encadre strictement ce que vous pouvez exiger.",
          "## Les pièces que vous pouvez (et ne pouvez pas) demander",
          "Le **décret n°2015-1437 du 5 novembre 2015** fixe une **liste limitative** : tout document qui n'y figure pas est **interdit**.",
          "- **Autorisé** : une pièce d'identité, un justificatif de domicile, des justificatifs d'activité professionnelle, des justificatifs de ressources (les **3 derniers bulletins de salaire**, le dernier avis d'imposition, etc.).",
          "- **Interdit** : photographie d'identité, carte Vitale, copie de relevé de compte bancaire, attestation d'absence de crédit, autorisation de prélèvement automatique, dossier médical, extrait de casier judiciaire, contrat de mariage ou certificat de concubinage.",
          "- Sanction : amende administrative jusqu'à **3 000 €** (personne physique) et **15 000 €** (personne morale).",
          "## La règle anti-discrimination",
          "On sélectionne sur la **solvabilité** uniquement, jamais sur l'origine, le sexe, la situation de famille, l'âge, l'état de santé ou l'un des **autres critères prohibés** par la loi. Un refus fondé sur l'un de ces critères est une **faute lourde**, pénalement sanctionnée.",
          "## Le taux d'effort",
          "- Règle de prudence courante : loyer **charges comprises inférieur ou égal à 33 %** des revenus nets du foyer. La plupart des assurances GLI l'exigent.",
          "- Exemple : un loyer CC de **750 €** suppose des revenus nets d'environ **2 250 €/mois**.",
          "## Les garanties contre l'impayé",
          "- **La caution (acte de cautionnement)** : un tiers s'engage à payer en cas de défaillance. **Simple** (le bailleur doit d'abord poursuivre le locataire) ou **solidaire** (il peut poursuivre directement la caution).",
          "- **La GLI (garantie loyers impayés)** : assurance souscrite par le bailleur, d'un coût d'environ **2,5 à 4 % du loyer charges comprises**. Elle couvre les impayés, souvent les dégradations et les frais de procédure.",
          "- La GLI n'est **pas cumulable** avec une caution, **sauf** locataire **étudiant ou apprenti**.",
          "- **Visale** (Action Logement) : caution **gratuite** pour les **jeunes de 18 à 30 ans** et les salariés en situation précaire ; couvre les loyers impayés et les dégradations.",
          "## L'acte de cautionnement en détail",
          "- Depuis la réforme du droit des sûretés du **1er janvier 2022**, la lourde **mention manuscrite** n'est plus imposée, mais l'acte doit indiquer clairement le **montant garanti** et la **durée** de l'engagement.",
          "- Caution à **durée déterminée** : la caution ne peut pas se rétracter avant le terme. Caution à **durée indéterminée** : elle peut résilier, l'engagement courant jusqu'à la fin du bail en cours.",
          "- Le bailleur doit remettre à la caution un **exemplaire du bail**.",
          "## Les honoraires de location (loi ALUR)",
          "La part à la charge du **locataire** est **plafonnée au m² de surface habitable** selon la zone (arrêté du 1er août 2014) :",
          "- **12 €/m²** en zone très tendue (ex. Paris, communes très prisées).",
          "- **10 €/m²** en zone tendue.",
          "- **8 €/m²** sur le reste du territoire.",
          "- **Plus 3 €/m² maximum** pour l'**état des lieux**.",
          "- La part payée par le locataire ne peut **jamais dépasser** celle payée par le bailleur.",
          "Exemple : un T3 de **65 m²** en zone tendue donne des honoraires locataire de 65 × 10 = **650 €**, plus 65 × 3 = **195 €** d'état des lieux, soit **845 €** au total.",
          "## Erreurs fréquentes à éviter",
          "- Facturer des honoraires sans calcul au m² : remboursement et sanction à la clé.",
          "- Réclamer une pièce interdite pour se rassurer : c'est l'infraction la plus facile à prouver pour un candidat écarté.",
          "## Mini cas pratique",
          "Un candidat gagne **2 000 € net** pour un loyer CC de **780 €**, soit un taux d'effort de **39 %** (au-delà du seuil GLI). Solution : demander une **caution solidaire** d'un parent justifiant de revenus suffisants, ou orienter vers **Visale** si le candidat a moins de 31 ans. On ne bricole pas le dossier, on sécurise la garantie."
        ]
      },
      {
        "titre": "Loyer, charges & révision du loyer (IRL)",
        "contenu": [
          "Fixer le loyer, distinguer le loyer des charges et appliquer correctement la révision annuelle : trois gestes techniques qui, mal maîtrisés, génèrent des trop-perçus et des contentieux.",
          "## Fixer le loyer initial",
          "- Hors zone d'encadrement, le loyer est **libre** à la **première** mise en location.",
          "- En **relocation** en zone tendue, le loyer ne peut en principe **pas dépasser** celui du locataire précédent, réévalué de l'IRL (sauf **travaux** ou loyer **manifestement sous-évalué**).",
          "- En zone d'**encadrement du niveau**, il est plafonné au **loyer de référence majoré** (voir leçon suivante).",
          "## Loyer, charges et le charges comprises",
          "On distingue le **loyer hors charges** des **charges locatives récupérables**.",
          "- Les charges récupérables sont listées par le **décret n°87-713 du 26 août 1987** : eau, chauffage collectif, entretien des parties communes, ascenseur, taxe d'enlèvement des ordures ménagères, etc.",
          "- Deux modes : **provisions sur charges** (avec **régularisation annuelle** obligatoire) ou, en meublé, **forfait de charges** (ni régularisé ni révisé en cours de bail).",
          "## La régularisation annuelle des charges",
          "- Au moins **une fois par an**, on compare les provisions versées aux dépenses réelles, ce qui donne lieu à un complément ou à un remboursement.",
          "- Le bailleur communique un **décompte par nature de charges** et tient les **justificatifs à disposition** du locataire pendant **6 mois**.",
          "- Le rattrapage des charges oubliées est limité par la **prescription de 3 ans**.",
          "## La révision annuelle par l'IRL",
          "- La révision n'est possible **que si le bail contient une clause** de révision, **une fois par an**, à la date convenue.",
          "- On applique l'**Indice de Référence des Loyers (IRL)** publié chaque trimestre par l'**INSEE**.",
          "- Formule : nouveau loyer égale loyer en cours multiplié par le rapport entre l'IRL de référence du trimestre et l'IRL du même trimestre un an plus tôt.",
          "- Exemple : loyer de **700 €**, IRL passant de 140,00 à 143,50 (soit +2,5 %), donne un nouveau loyer de 700 × 143,50 / 140,00 = **717,50 €**.",
          "- La révision n'est **pas rétroactive** : oubliée plus d'un an, elle est **perdue** pour la période écoulée.",
          "## Le bouclier loyer (2022-2024)",
          "- La **loi du 16 août 2022** a **plafonné la hausse de l'IRL à +3,5 %** en métropole, du **troisième trimestre 2022 au deuxième trimestre 2024**, pour protéger le pouvoir d'achat (plafonds spécifiques outre-mer et en Corse).",
          "- Depuis la mi-2024, l'IRL a retrouvé son évolution normale.",
          "## Le gel des loyers des passoires énergétiques",
          "Depuis le **24 août 2022**, les loyers des logements classés **F ou G** sont **gelés** : ni révision IRL, ni réévaluation à la relocation, ni hausse pour travaux tant que le logement reste F ou G.",
          "## Pièges à éviter",
          "- Appliquer une révision alors qu'aucune **clause** ne la prévoit : illégal.",
          "- Oublier plusieurs années la régularisation des charges : le rattrapage est plafonné par la prescription de **3 ans**.",
          "## Mini cas pratique",
          "Un bailleur de Martigues veut augmenter le loyer de son appartement classé **F**. Impossible : le loyer est **gelé** jusqu'à ce que le bien atteigne au moins la classe **E** après travaux. Vous l'orientez vers une rénovation (isolation, changement de chauffage) qui débloquera à la fois la **révision** du loyer et la **pérennité** de la location."
        ]
      },
      {
        "titre": "L'encadrement des loyers en zone tendue",
        "contenu": [
          "Deux dispositifs portent le nom d'encadrement et sont souvent confondus : l'encadrement de l'**évolution** (large) et l'encadrement du **niveau** (ciblé). Les distinguer évite les erreurs de fixation de loyer.",
          "## Zone tendue : de quoi parle-t-on ?",
          "- La **zone tendue** regroupe les communes où l'offre de logements est insuffisante, définies par le **décret n°2013-392** puis fortement **élargies par le décret n°2023-822 du 25 août 2023** (environ 2 200 communes ajoutées).",
          "- Au total, près de **3 700 communes** sont désormais classées en zone tendue ; en PACA, de nombreuses communes du pourtour marseillais et de la Côte d'Azur en font partie.",
          "## Dispositif 1 : l'encadrement de l'évolution des loyers",
          "- S'applique dans **toutes** les zones tendues, à la **relocation** et au **renouvellement**.",
          "- Le loyer ne peut pas augmenter au-delà de l'IRL, **sauf** travaux d'amélioration (représentant au moins la moitié d'une année de loyer) ou loyer **manifestement sous-évalué**.",
          "- En zone tendue, le **préavis du locataire** est par ailleurs réduit à **1 mois** quel que soit le type de logement.",
          "## Dispositif 2 : l'encadrement du niveau des loyers (loi ELAN)",
          "- Dispositif **expérimental** mis en place sur demande des collectivités, prolongé **jusqu'en novembre 2026**.",
          "- Communes concernées : **Paris**, **Lille** (avec Hellemmes et Lomme), **Lyon-Villeurbanne**, **Montpellier**, **Bordeaux**, **Plaine Commune** et **Est Ensemble** (Île-de-France), **Pays basque** et, depuis janvier 2025, **Grenoble-Alpes Métropole**.",
          "- D'autres territoires sont candidats (Marseille, Rennes, Grand-Orly Seine Bièvre, Annemasse).",
          "- Un **arrêté préfectoral** fixe, par secteur et par type de bien, un **loyer de référence**, un **loyer de référence majoré** (+20 %) et un **loyer de référence minoré** (-30 %), exprimés en **euros par m²**.",
          "- Le loyer de base ne peut **pas dépasser** le loyer de référence **majoré**.",
          "## Le complément de loyer",
          "- Au-delà du plafond, un **complément de loyer** n'est possible que pour des **caractéristiques exceptionnelles** de localisation ou de confort (grande terrasse, vue remarquable, hauteur sous plafond, prestations de luxe), non déjà prises en compte dans le loyer de référence.",
          "- Il doit être **justifié et mentionné au bail** ; le locataire peut le **contester** dans les **3 mois** suivant la signature.",
          "## Mentions obligatoires au bail en zone d'encadrement",
          "- Le **loyer de référence** et le **loyer de référence majoré**.",
          "- Le **dernier loyer** appliqué si le précédent locataire est parti depuis moins de **18 mois**.",
          "## Sanctions en cas de dépassement",
          "- Le locataire peut exiger la **mise en conformité** du loyer et le **remboursement du trop-perçu**.",
          "- Amende administrative jusqu'à **5 000 €** (personne physique) et **15 000 €** (personne morale).",
          "## Mini cas pratique",
          "À Paris, avec un loyer de référence majoré de **32 €/m²** pour un studio, un 25 m² se loue au maximum **800 €** hors complément. Pour facturer 900 €, il faudrait un **complément de loyer** justifié (par exemple une grande terrasse) et mentionné au bail ; à défaut, le locataire obtiendra le **remboursement** de la différence."
        ]
      },
      {
        "titre": "L'état des lieux & le dépôt de garantie",
        "contenu": [
          "L'état des lieux et le dépôt de garantie concentrent l'essentiel des litiges de fin de bail. La rigueur à l'entrée protège les deux parties à la sortie.",
          "## L'état des lieux : la pièce maîtresse",
          "- Établi **contradictoirement** (bailleur ou mandataire et locataire) à l'**entrée** et à la **sortie**, par écrit, en autant d'exemplaires que de parties, et **annexé au bail**.",
          "- Il décrit l'état **pièce par pièce**, équipement par équipement : la précision est la meilleure protection.",
          "- Bonnes pratiques : **photos datées**, relevés de **compteurs** (eau, gaz, électricité), mention du **nombre et de l'état des clés**.",
          "- Le locataire peut **compléter** l'état des lieux d'entrée dans les **10 premiers jours**, et pour le **chauffage** durant le **premier mois de chauffe**.",
          "## À défaut d'accord",
          "- Si une partie refuse ou si l'état des lieux ne peut être fait à l'amiable, il est établi par un **commissaire de justice** à l'initiative de la partie la plus diligente ; les **frais sont partagés par moitié** et plafonnés.",
          "- Sans état des lieux d'entrée, le logement est **présumé reçu en bon état**, ce qui dessert le bailleur.",
          "## La comparaison entrée / sortie et la vétusté",
          "- Les dégradations s'apprécient par **différence** entre l'entrée et la sortie.",
          "- On ne peut pas facturer la **vétusté** (usure normale liée au temps et à l'usage) : seules les **dégradations imputables** au locataire sont retenues.",
          "- Une **grille de vétusté** annexée au bail sécurise ce point (abattements par année d'usage sur peintures, moquettes, etc.).",
          "## Le dépôt de garantie : montant",
          "- **Location vide** : **1 mois** de loyer hors charges maximum.",
          "- **Meublé** : **2 mois** de loyer hors charges maximum.",
          "- **Bail mobilité** : **interdit** (aucun dépôt).",
          "- Il ne peut **pas être révisé** en cours de bail.",
          "## La restitution du dépôt",
          "- Délai : **1 mois** après remise des clés si l'état des lieux de sortie est **conforme** à celui d'entrée ; **2 mois** s'il existe des **différences** justifiant des retenues.",
          "- En copropriété, le bailleur peut conserver une **provision (jusqu'à 20 %)** jusqu'à l'arrêté annuel des comptes de charges.",
          "- **Pénalité de retard** : à défaut de restitution dans les délais, la somme due est majorée de **10 % du loyer mensuel hors charges par mois de retard** entamé.",
          "## Justifier les retenues",
          "- Toute retenue doit être **justifiée** : états des lieux comparés, **photos**, **devis** ou **factures**.",
          "- On ne retient jamais un montant **forfaitaire** par précaution.",
          "## Erreurs fréquentes à éviter",
          "- État des lieux d'entrée bâclé (bon état global) : impossible de prouver une dégradation à la sortie.",
          "- Retenir au titre de la **vétusté** : le locataire gagne systématiquement devant le juge.",
          "## Mini cas pratique",
          "Loyer de **800 €** hors charges, état des lieux de sortie révélant un mur dégradé (devis peinture **250 €**). Vous restituez dans le **mois** : 800 moins 250 égale **550 €**, la retenue étant justifiée par devis. Si vous aviez tardé de 2 mois sans raison, il faudrait ajouter une pénalité de 2 × 80 égale **160 €**."
        ]
      },
      {
        "titre": "La vie du bail : obligations, entretien, réparations & assurance",
        "contenu": [
          "Entre la signature et le départ, le bail vit : qui entretient, qui répare, qui assure, qui autorise quoi ? Clarifier la répartition des obligations désamorce la plupart des conflits du quotidien.",
          "## Les obligations du bailleur",
          "- Délivrer un logement **décent** et en **bon état d'usage**.",
          "- Assurer la **jouissance paisible** du logement et garantir les **vices** qui en empêchent l'usage.",
          "- Entretenir les locaux et réaliser les **réparations autres que locatives** (toiture, chaudière vétuste, mise aux normes, gros œuvre).",
          "- Remettre **gratuitement** une **quittance** sur demande du locataire.",
          "## Les obligations du locataire",
          "- Payer le **loyer et les charges** aux termes convenus.",
          "- User **paisiblement** du logement et assurer son **entretien courant** et les **menues réparations**.",
          "- **Assurer** le logement contre les risques locatifs et en justifier **chaque année**.",
          "- Ne pas **transformer** les lieux sans accord écrit du bailleur.",
          "- Laisser exécuter les **travaux** nécessaires décidés par le bailleur.",
          "## Réparations : qui paie quoi ?",
          "- **À la charge du locataire** (réparations locatives, décret n°87-712 du 26 août 1987) : entretien courant, joints, petites fuites, remplacement des joints de robinet, ramonage, entretien de la chaudière individuelle, entretien des menuiseries, vitre cassée de son fait.",
          "- **À la charge du bailleur** : vétusté, force majeure, vice de construction, remplacement des gros équipements (chaudière usée, toiture, ravalement, remise aux normes électriques).",
          "- Règle simple : l'**entretien** est au locataire, le **remplacement dû à l'usure** est au bailleur.",
          "## Les travaux du bailleur en cours de bail",
          "- Le locataire doit **supporter** les travaux d'amélioration ou de mise aux normes décidés par le bailleur.",
          "- Si les travaux durent plus de **21 jours**, le locataire a droit à une **réduction de loyer** proportionnelle à leur durée et à la partie du logement concernée.",
          "- Les travaux ne peuvent pas rendre le logement **inhabitable** ni porter atteinte de façon abusive à la vie privée du locataire.",
          "## L'assurance habitation",
          "- Obligatoire pour le locataire (**risques locatifs** : incendie, dégât des eaux, explosion).",
          "- À défaut, après **mise en demeure** restée **1 mois** sans effet, le bailleur peut **souscrire pour le compte** du locataire et récupérer la prime, majorée de **10 %** maximum.",
          "## La sous-location",
          "- **Interdite** sauf **accord écrit** du bailleur, y compris sur le prix ; le sous-loyer ne peut **pas dépasser** le loyer principal.",
          "- La sous-location non autorisée, notamment via les plateformes touristiques, est un **motif de résiliation**.",
          "## Animaux, troubles de voisinage & usage",
          "- Le locataire a le **droit de détenir un animal familier** ; seuls les chiens de 1re catégorie peuvent être interdits.",
          "- Le bailleur doit faire cesser les **troubles graves** causés par son locataire ; un trouble répété peut fonder un **congé pour motif légitime et sérieux**.",
          "## Mini cas pratique",
          "Un locataire signale une chaudière en panne. Diagnostic : **vétusté**, remplacement **1 800 €**, à la charge du **bailleur**. En revanche, l'**entretien annuel** de cette même chaudière (environ 120 €) reste à la charge du **locataire**. Poser cette distinction d'entrée de jeu évite le conflit."
        ]
      },
      {
        "titre": "Donner congé : préavis, vente, reprise & protection du locataire",
        "contenu": [
          "Le congé est un acte encadré : qui peut le donner, quand, pour quel motif et avec quel préavis ? Une erreur de forme rend le congé nul et peut coûter cher au bailleur.",
          "## Le congé donné par le locataire",
          "- Le locataire peut partir **à tout moment**, en respectant un **préavis**.",
          "- Préavis en **vide** : **3 mois**, réduit à **1 mois** en **zone tendue**, en **meublé**, ou pour un motif légal.",
          "- Motifs de **préavis réduit à 1 mois** (vide, hors zone tendue) : **mutation professionnelle**, **perte d'emploi**, nouvel emploi consécutif à une perte d'emploi, **premier emploi**, état de **santé** justifiant un déménagement, bénéficiaire du **RSA ou de l'AAH**, attribution d'un **logement social**, **violences** conjugales ou familiales.",
          "- Forme : **lettre recommandée avec accusé de réception**, acte de **commissaire de justice**, ou remise en main propre contre récépissé. Le préavis court à **réception**.",
          "## Le congé donné par le bailleur",
          "Le bailleur ne peut donner congé qu'**à l'échéance** du bail, avec un préavis de **6 mois** (vide) ou **3 mois** (meublé), et pour **l'un des trois motifs** suivants :",
          "- **Congé pour vente** : le locataire bénéficie d'un **droit de préemption**. Le congé vaut **offre de vente** aux prix et conditions indiqués ; le locataire peut l'accepter dans un **délai de 2 mois**.",
          "- **Congé pour reprise** : pour loger le bailleur ou un proche (**conjoint, partenaire de PACS, concubin notoire** depuis au moins 1 an, **ascendants ou descendants** du bailleur ou du conjoint). Le bénéficiaire doit être **nommé** et le motif **réel**.",
          "- **Motif légitime et sérieux** : impayés répétés, troubles de voisinage, non-respect du bail.",
          "## La protection du locataire âgé",
          "- Le bailleur ne peut pas donner congé à un locataire de **plus de 65 ans** dont les **ressources** sont inférieures à un plafond, sans lui proposer un **relogement** adapté.",
          "- Exception : si le **bailleur** est lui-même **âgé de plus de 65 ans** ou dispose de **ressources modestes**.",
          "## Reconduction et renouvellement",
          "- À défaut de congé, le bail vide se **reconduit tacitement** pour 3 ans (ou 6 ans), le meublé pour 1 an.",
          "- Au renouvellement, le bailleur peut proposer une **réévaluation du loyer** s'il est **manifestement sous-évalué** (preuves à l'appui, procédure encadrée).",
          "## Pièges à éviter",
          "- Donner un congé pour vente **fictif** pour évincer un locataire : le locataire peut obtenir des dommages-intérêts.",
          "- Donner congé **hors échéance** du bail : nul.",
          "- Oublier de **nommer** le bénéficiaire de la reprise : congé contestable.",
          "## Mini cas pratique",
          "Un propriétaire veut récupérer son T2 à Martigues pour y loger son fils étudiant. Vous préparez un **congé pour reprise**, délivré **6 mois** avant l'échéance par lettre recommandée, en **nommant** le fils (descendant) et en précisant le motif. Vous vérifiez au préalable que la locataire n'est pas une **personne âgée protégée**."
        ]
      },
      {
        "titre": "Impayés, procédure & expulsion",
        "contenu": [
          "Face à un impayé, la rapidité et le respect de la procédure font toute la différence. Agir dès le premier retard, dans les règles, protège le bailleur comme le locataire.",
          "## Prévenir l'impayé",
          "- Un **dossier solide**, une **GLI** ou une **caution / Visale**, un **prélèvement automatique** et un suivi dès le **premier retard** réduisent fortement le risque.",
          "- Dès un retard, **relance amiable** immédiate, puis **mise en demeure**, et information du garant ou de l'assureur GLI.",
          "## La clause résolutoire",
          "- Quasi systématique au bail, elle permet la **résiliation automatique** du bail en cas d'impayé de loyer ou de charges, de non-versement du dépôt ou de défaut d'assurance.",
          "- Elle ne joue qu'après un **commandement de payer** resté infructueux.",
          "## La procédure en cas d'impayé persistant",
          "- **Commandement de payer** délivré par **commissaire de justice** : le locataire dispose de **6 semaines** pour régulariser (délai ramené de 2 mois à 6 semaines par la **loi du 27 juillet 2023**).",
          "- À défaut de régularisation, **assignation** devant le **juge des contentieux de la protection**.",
          "- Le juge peut accorder des **délais de paiement** (jusqu'à **3 ans**) et suspendre la clause résolutoire si le locataire reprend ses paiements.",
          "- Signalement obligatoire à la **CCAPEX** (commission de coordination des actions de prévention des expulsions) et information de la **CAF**.",
          "## L'expulsion",
          "- Une fois la résiliation acquise, un **commandement de quitter les lieux** est délivré ; à défaut de départ, le concours de la **force publique** est demandé au préfet.",
          "- Aucune expulsion ne peut être exécutée pendant la **trêve hivernale**, du **1er novembre au 31 mars**, sauf relogement assuré ou cas de squat.",
          "## Erreurs fréquentes à éviter",
          "- Couper l'électricité, changer la serrure ou expulser soi-même : l'**expulsion sans décision de justice** est un **délit**.",
          "- Attendre plusieurs mois avant de réagir : la dette devient irrécouvrable et la procédure s'allonge.",
          "## Mini cas pratique",
          "Un locataire cumule 2 mois d'impayés. Vous informez immédiatement l'assureur **GLI**, faites délivrer un **commandement de payer** par commissaire de justice et suivez le délai de **6 semaines**. Faute de régularisation, vous engagez l'**assignation**. Grâce à la réactivité, la GLI indemnise le bailleur et la dette reste maîtrisée."
        ]
      },
      {
        "titre": "Logement décent & décence énergétique (DPE en location)",
        "contenu": [
          "On ne met en location qu'un logement **décent**, y compris sur le plan énergétique. Le DPE est devenu un critère juridique majeur qui conditionne le droit même de louer.",
          "## Le logement décent",
          "- Le **décret n°2002-120 du 30 janvier 2002** impose une surface habitable **d'au moins 9 m²** et une hauteur sous plafond **d'au moins 2,20 m** (ou un volume habitable d'au moins **20 m³**).",
          "- Le logement doit être **exempt de risques** pour la sécurité et la santé et comporter les **équipements de confort** (eau potable, chauffage, électricité, cuisine, sanitaires).",
          "- Pour un logement indécent, le locataire peut exiger la **mise en conformité**, voire obtenir une **réduction de loyer**.",
          "## La décence énergétique (loi Climat et résilience du 22 août 2021)",
          "Le **DPE** est devenu un **critère de décence** : un logement trop énergivore ne peut **plus être mis en location**. Calendrier d'interdiction en France métropolitaine :",
          "- Depuis le **1er janvier 2023** : logements consommant plus de **450 kWh/m²/an** d'énergie finale (les pires G).",
          "- Depuis le **1er janvier 2025** : classe **G** (environ 567 000 logements concernés).",
          "- **1er janvier 2028** : classe **F**.",
          "- **1er janvier 2034** : classe **E**.",
          "- Ces interdictions visent les **nouveaux baux et renouvellements** ; un bail en cours se poursuit, mais le logement devient non relouable en l'état à son terme.",
          "## Deux ajustements récents à connaître",
          "- Depuis le **1er juillet 2024**, un nouveau mode de calcul du DPE (arrêté du 25 mars 2024) favorise les **logements de moins de 40 m²** : environ **140 000** petits logements sortent des classes F et G, via une attestation téléchargeable sur le site de l'**ADEME**.",
          "- La proposition de loi visant à **assouplir** le calendrier pour les logements en **copropriété** a été **rejetée** début 2025 : le calendrier reste donc applicable.",
          "## Le gel des loyers des passoires",
          "- Depuis le **24 août 2022**, les loyers des logements **F et G** sont **gelés** : ni révision par l'IRL, ni hausse à la relocation.",
          "## Le DPE : opposabilité et annonce",
          "- Le DPE est **opposable** : il engage la responsabilité du bailleur en cas d'erreur.",
          "- Il doit figurer dans l'**annonce** (classe énergie et climat, estimation des dépenses). Le détail des mentions et de l'audit énergétique est traité dans les modules **Loi ALUR** et **DPE & performance énergétique**.",
          "## Le rôle du négociateur / gestionnaire",
          "- Vérifier la **décence**, y compris énergétique, **avant** toute mise en location.",
          "- Alerter le propriétaire d'une **passoire** sur le calendrier d'interdiction et sur l'intérêt d'une **rénovation** (déblocage du loyer, pérennité et valorisation du bien).",
          "- Soigner **bail, annexes et état des lieux** : la rigueur évite des contentieux coûteux.",
          "## Mini cas pratique",
          "Un propriétaire veut relouer début 2025 un appartement classé **G** à Martigues. **Interdiction** depuis le 1er janvier 2025 : impossible de signer un nouveau bail. Vous vérifiez d'abord si le bien, s'il fait moins de 40 m², bénéficie du **nouveau calcul du DPE** ; sinon, vous l'orientez vers des travaux (isolation, menuiseries, chauffage) pour atteindre au moins **E ou D**, ce qui rend le bien louable et **débloque** la révision du loyer."
        ]
      }
    ],
    "quiz": [
      {
        "question": "La durée d'un bail de location vide, bailleur personne physique, est de…",
        "options": [
          "1 an",
          "3 ans",
          "6 ans",
          "9 mois"
        ],
        "correct": 1,
        "explication": "3 ans en location vide pour un bailleur personne physique (ou SCI familiale), contre 6 ans pour une personne morale ; 1 an en meublé et 9 mois pour un bail étudiant."
      },
      {
        "question": "Le dépôt de garantie maximum en location meublée est de…",
        "options": [
          "1 mois de loyer hors charges",
          "2 mois de loyer hors charges",
          "3 mois de loyer hors charges",
          "Aucun plafond"
        ],
        "correct": 1,
        "explication": "2 mois de loyer hors charges en meublé, contre 1 mois en location vide. En bail mobilité, aucun dépôt n'est autorisé."
      },
      {
        "question": "Depuis le 1er janvier 2025, quelle classe DPE est interdite à la location ?",
        "options": [
          "E",
          "F",
          "G",
          "D"
        ],
        "correct": 2,
        "explication": "La classe G est interdite depuis le 1er janvier 2025, la F le sera en 2028 et la E en 2034 (critère de décence énergétique, loi Climat et résilience)."
      },
      {
        "question": "Dans un bail mobilité, le dépôt de garantie est…",
        "options": [
          "Plafonné à 1 mois",
          "Plafonné à 2 mois",
          "Interdit (aucun dépôt)",
          "Librement fixé"
        ],
        "correct": 2,
        "explication": "Le bail mobilité (loi ELAN, 1 à 10 mois) interdit tout dépôt de garantie ; le bailleur se couvre plutôt via la garantie Visale."
      },
      {
        "question": "En zone tendue, le préavis du locataire d'un logement vide est réduit à…",
        "options": [
          "3 mois",
          "2 mois",
          "1 mois",
          "Aucun préavis"
        ],
        "correct": 2,
        "explication": "Le préavis passe de 3 mois à 1 mois en zone tendue, en meublé, ou pour un motif légal (mutation, perte d'emploi, RSA/AAH, santé, etc.)."
      },
      {
        "question": "Une assurance GLI (garantie loyers impayés) et une caution…",
        "options": [
          "Se cumulent systématiquement",
          "Ne peuvent pas se cumuler, sauf locataire étudiant ou apprenti",
          "Sont toutes deux interdites",
          "Sont obligatoires ensemble"
        ],
        "correct": 1,
        "explication": "Le bailleur ne peut pas cumuler une GLI et un cautionnement, sauf si le logement est loué à un étudiant ou un apprenti."
      },
      {
        "question": "En zone tendue, les honoraires de location à la charge du locataire sont plafonnés à…",
        "options": [
          "8 €/m² de surface habitable, état des lieux compris",
          "10 €/m² de surface habitable, plus 3 €/m² maximum pour l'état des lieux",
          "12 €/m² sur tout le territoire",
          "Un mois de loyer, quelle que soit la surface"
        ],
        "correct": 1,
        "explication": "En zone tendue, la part locataire est plafonnée à 10 €/m² de surface habitable (12 €/m² en zone très tendue, 8 €/m² ailleurs), plus 3 €/m² maximum pour l'état des lieux, sans jamais dépasser la part payée par le bailleur."
      },
      {
        "question": "Dans un bail d'habitation régi par la loi de 1989, une clause défavorable au locataire qui déroge à la loi est…",
        "options": [
          "Réputée non écrite",
          "Valable dès lors qu'elle est signée",
          "Valable pendant un an",
          "Soumise à la validation du juge"
        ],
        "correct": 0,
        "explication": "La loi de 1989 est d'ordre public : toute clause dérogeant à son détriment au locataire est réputée non écrite."
      },
      {
        "question": "La durée d'un bail meublé de résidence principale (hors étudiant) est de…",
        "options": [
          "1 an reconductible tacitement",
          "3 ans",
          "6 ans",
          "9 mois"
        ],
        "correct": 0,
        "explication": "Le bail meublé de résidence principale est d'1 an reconductible, contre 3 ans en location vide."
      },
      {
        "question": "Le bail meublé étudiant a une durée de 9 mois…",
        "options": [
          "Non reconductible tacitement, il faut signer un nouveau bail",
          "Reconductible pour 9 mois",
          "Reconductible pour 1 an",
          "Reconductible pour 3 ans"
        ],
        "correct": 0,
        "explication": "Le bail étudiant de 9 mois prend fin automatiquement sans congé ; le reconduire oralement est une erreur, il faut un nouveau bail."
      },
      {
        "question": "La durée d'un bail vide consenti par un bailleur personne morale (hors SCI familiale) est de…",
        "options": [
          "6 ans",
          "3 ans",
          "1 an",
          "9 ans"
        ],
        "correct": 0,
        "explication": "Le bail vide dure 3 ans pour un bailleur personne physique ou SCI familiale, mais 6 ans pour une personne morale."
      },
      {
        "question": "Le dépôt de garantie maximal en location vide est de…",
        "options": [
          "1 mois de loyer hors charges",
          "2 mois de loyer hors charges",
          "3 mois de loyer hors charges",
          "Interdit"
        ],
        "correct": 0,
        "explication": "Le dépôt est limité à 1 mois de loyer hors charges en vide, contre 2 mois en meublé et aucun en bail mobilité."
      },
      {
        "question": "Le mobilier obligatoire d'un logement loué meublé est fixé par décret et comporte au minimum…",
        "options": [
          "11 éléments (literie, plaques de cuisson, réfrigérateur, vaisselle…)",
          "5 éléments",
          "Aucune liste précise",
          "20 éléments"
        ],
        "correct": 0,
        "explication": "Le décret n°2015-981 fixe une liste de 11 éléments minimum ; un meublé incomplet peut être requalifié en location vide."
      },
      {
        "question": "Réclamer une pièce interdite au candidat locataire (relevé bancaire, carte Vitale…) expose à une amende administrative pouvant atteindre…",
        "options": [
          "3 000 € pour une personne physique",
          "300 €",
          "50 €",
          "Aucune sanction"
        ],
        "correct": 0,
        "explication": "Le décret du 5 novembre 2015 fixe une liste limitative ; exiger une pièce hors liste est passible de 3 000 € (personne physique) et 15 000 € (personne morale)."
      },
      {
        "question": "La règle de prudence courante pour la solvabilité fixe un loyer charges comprises inférieur ou égal à…",
        "options": [
          "33 % des revenus nets du foyer",
          "50 % des revenus nets",
          "10 % des revenus nets",
          "75 % des revenus nets"
        ],
        "correct": 0,
        "explication": "Le taux d'effort prudent est de 33 % des revenus nets, seuil exigé par la plupart des assurances GLI."
      },
      {
        "question": "Depuis la loi ALUR, un colocataire qui donne congé reste solidaire de la dette jusqu'à l'arrivée d'un remplaçant, et au plus tard…",
        "options": [
          "6 mois après la date d'effet de son congé",
          "3 mois après",
          "1 an après",
          "Jusqu'à la fin du bail en cours"
        ],
        "correct": 0,
        "explication": "La loi ALUR limite la solidarité du colocataire partant à l'arrivée d'un remplaçant, et au plus tard 6 mois après l'effet de son congé."
      },
      {
        "question": "Une résidence principale peut être louée en meublé de tourisme au maximum 120 jours par an, plafond que la commune peut abaisser à…",
        "options": [
          "90 jours (loi Le Meur du 19 novembre 2024)",
          "60 jours",
          "30 jours",
          "180 jours"
        ],
        "correct": 0,
        "explication": "Depuis la loi Le Meur, la commune peut ramener le plafond de location de 120 à 90 jours par an pour une résidence principale."
      },
      {
        "question": "La révision annuelle du loyer par l'indice de référence des loyers (IRL) n'est possible que si…",
        "options": [
          "Le bail contient une clause de révision",
          "Le locataire l'accepte chaque année",
          "Le loyer est manifestement sous-évalué",
          "Le logement est classé A ou B"
        ],
        "correct": 0,
        "explication": "La révision IRL n'est possible qu'en présence d'une clause de révision, une fois par an, et n'est pas rétroactive si on l'oublie."
      },
      {
        "question": "Depuis le 24 août 2022, les loyers des logements classés F ou G sont…",
        "options": [
          "Gelés : ni révision IRL, ni hausse à la relocation",
          "Plafonnés à +3,5 %",
          "Entièrement libres",
          "Majorés de l'IRL chaque année"
        ],
        "correct": 0,
        "explication": "Les loyers des passoires F et G sont gelés : aucune révision ni réévaluation tant que le bien reste F ou G."
      },
      {
        "question": "Le bailleur ne peut donner congé qu'à l'échéance du bail, avec un préavis de…",
        "options": [
          "6 mois en location vide, 3 mois en meublé",
          "3 mois en vide, 1 mois en meublé",
          "1 mois dans tous les cas",
          "2 mois en vide, 1 mois en meublé"
        ],
        "correct": 0,
        "explication": "Le congé du bailleur, à l'échéance et pour un motif légal (vente, reprise, motif légitime et sérieux), respecte un préavis de 6 mois en vide et 3 mois en meublé."
      },
      {
        "question": "Depuis la loi du 27 juillet 2023, après un commandement de payer, le locataire dispose pour régulariser sa dette d'un délai de…",
        "options": [
          "6 semaines",
          "2 mois",
          "1 mois",
          "3 mois"
        ],
        "correct": 0,
        "explication": "La loi du 27 juillet 2023 a ramené ce délai de 2 mois à 6 semaines, à défaut de quoi l'assignation devant le juge peut suivre."
      },
      {
        "question": "Aucune expulsion locative ne peut être exécutée pendant la trêve hivernale, du…",
        "options": [
          "1er novembre au 31 mars",
          "1er décembre au 1er mars",
          "15 octobre au 15 avril",
          "1er novembre au 15 mars"
        ],
        "correct": 0,
        "explication": "La trêve hivernale court du 1er novembre au 31 mars, sauf relogement assuré ou cas de squat."
      }
    ]
  }
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
