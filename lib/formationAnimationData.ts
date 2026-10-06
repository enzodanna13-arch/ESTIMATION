import type { AnimationModule } from "./formationAnimation";

// Données des kits d'animation (générées). Clé = id du module.
export const ANIMATIONS_DATA: Record<string, AnimationModule> = {
  "prospection": {
    "id": "prospection",
    "sousTitre": "Remplir son pipeline de mandats : pige, phoning, terrain, digital et acquéreurs — en toute conformité 2026",
    "objectifs": [
      "Comprendre pourquoi la prospection est l'activité n°1 du négociateur et appliquer la règle des 3 tiers du temps ainsi que la loi des grands nombres.",
      "Maîtriser la pige : détecter, qualifier et prioriser les bons vendeurs (PAP, mandats échus, baisses de prix) dès les premières 48 h.",
      "Être capable de dérouler un appel de pige avec la méthode CROC et de décrocher un RDV d'estimation sans donner de prix au téléphone.",
      "Connaître et appliquer le cadre légal 2026 du démarchage (opt-in depuis le 11/08/2026, horaires, RGPD, carte T loi Hoguet) pour prospecter sans risque.",
      "Savoir activer tous les canaux complémentaires (phoning base, recommandation, terrain, digital, fichier acquéreurs) et piloter son tunnel par des KPI hebdomadaires.",
      "Développer le mental du prospecteur : régularité, résilience face au refus et discipline du créneau bloqué."
    ],
    "agenda": [
      {
        "titre": "Accueil, cadrage des objectifs et brise-glace « Le mur des mandats »",
        "duree": "10 min"
      },
      {
        "titre": "Apport 1 — Pourquoi prospecter : règle des 3 tiers, loi des grands nombres et prospection en différé",
        "duree": "15 min"
      },
      {
        "titre": "Jeu 1 — Quiz-battle en équipes « Prospection Challenge »",
        "duree": "15 min"
      },
      {
        "titre": "Apport 2 — La pige & l'appel de pige (méthode CROC, qualification du vendeur)",
        "duree": "15 min"
      },
      {
        "titre": "Jeu 2 — Vrai/Faux « Conformité 2026 : démarcher sans se tromper »",
        "duree": "15 min"
      },
      {
        "titre": "Jeu 3 — Défi chrono « Pige express : repère et qualifie »",
        "duree": "10 min"
      },
      {
        "titre": "Jeu de rôle — Mises en situation téléphoniques (pige, lead entrant, recommandation)",
        "duree": "20 min"
      },
      {
        "titre": "Apport 3 — Multicanal & pilotage : phoning, recommandation, terrain, digital, acquéreurs, KPI",
        "duree": "10 min"
      },
      {
        "titre": "Jeu 4 — Brainstorm « 30 nouveaux contacts d'ici demain »",
        "duree": "10 min"
      },
      {
        "titre": "Synthèse des points-clés, plan d'action individuel et clôture",
        "duree": "10 min"
      }
    ],
    "briseGlace": {
      "titre": "Le mur des mandats : d'où viennent vraiment nos affaires ?",
      "consignes": [
        "Distribuer un post-it à chacun : chaque négociateur y inscrit le canal d'où provient son DERNIER mandat signé (pige PAP, mandat échu, recommandation, ancien client, lead web, terrain…) puis le colle sur un paperboard divisé en colonnes par canal.",
        "En 2 minutes, le groupe observe la répartition à voix haute : quel canal rapporte le plus ? Lequel personne n'exploite ?",
        "Le formateur entoure en rouge les colonnes vides ou faibles : ces canaux « oubliés » deviennent le fil rouge de la séance et reviendront au brainstorm final.",
        "Transition : « Aujourd'hui, l'objectif n'est pas de prospecter plus fort, mais de remplir ces colonnes vides de façon régulière et légale. »"
      ]
    },
    "jeux": [
      {
        "titre": "Prospection Challenge",
        "type": "Quiz-battle en équipes",
        "duree": "15 min",
        "consignes": [
          "Constituer 2 ou 3 équipes ; chacune choisit un nom et un porte-parole, et reçoit des pancartes A / B / C / D.",
          "Le formateur projette une question à choix multiple (8 à 10 questions tirées du quiz du module) ; l'équipe se concerte 20 secondes puis le porte-parole lève sa pancarte.",
          "1 point par bonne réponse, +1 point bonus si l'équipe justifie correctement sa réponse ; le formateur commente et ancre le message-clé avant de passer à la suivante.",
          "L'équipe en tête à la fin remporte un petit lot (déjeuner offert, priorité sur le prochain secteur de boîtage, café offert par les perdants…)."
        ],
        "animation": [
          "Rythmer : chrono visible, musique entre les questions, faire répondre debout pour l'énergie.",
          "Valoriser la justification plus que la vitesse ; ne jamais humilier une équipe en retard.",
          "Placer les questions « droit 2026 » en fin de jeu pour enchaîner naturellement sur le Vrai/Faux conformité."
        ],
        "corrige": [
          "La mission n°1 du négociateur = rentrer des mandats (pas vendre ni faire visiter).",
          "L'objectif d'un appel de pige = obtenir un rendez-vous (jamais donner un prix au téléphone).",
          "La cible n°1 de la pige = les particuliers qui vendent seuls (PAP).",
          "On pige en priorité les annonces de moins de 48 h.",
          "La plupart des mandats se signent après plusieurs relances (J+7 / J+30 / J+90), pas au premier contact.",
          "Un lead entrant se rappelle en quelques minutes (règle des 5 minutes).",
          "Le meilleur ouvre-porte vendeur = « j'ai un acquéreur qui cherche exactement ce type de bien ».",
          "Règle des 3 tiers = 1/3 prospection, 1/3 découverte-estimations, 1/3 vente-suivi.",
          "Pour plus de mandats, augmenter d'abord le volume de contacts en haut du tunnel.",
          "Avant une visite acquéreur, valider en priorité sa finançabilité."
        ]
      },
      {
        "titre": "Conformité 2026 : démarcher sans se tromper",
        "type": "Vrai/Faux (physique, debout/assis)",
        "duree": "15 min",
        "consignes": [
          "Le formateur énonce une affirmation sur le cadre légal ; pour « Vrai » chacun se lève (ou pouce levé), pour « Faux » reste assis (pouce baissé).",
          "Avant de donner la réponse, interroger un participant qui s'est trompé ET un qui a bon pour qu'ils justifient : le débat ancre la règle.",
          "Révéler la bonne réponse et sa source (loi, décret, article), en insistant sur ce qui a CHANGÉ depuis le 11 août 2026.",
          "Distribuer en fin de jeu une fiche mémo « opt-in + horaires + sanctions » à garder dans le téléphone."
        ],
        "animation": [
          "Faire bouger physiquement les gens réveille et ancre mieux qu'un simple QCM assis.",
          "Illustrer chaque règle par un cas concret de l'agence (« le PAP de Croix-Sainte mardi à 11 h : feu vert ou pas ? »).",
          "Rappeler que l'enjeu n'est pas théorique : l'amende engage l'agence, donc tout le monde."
        ],
        "corrige": [
          "« Depuis le 11/08/2026, on peut appeler un particulier tant qu'il n'est pas sur Bloctel » → FAUX : Bloctel a été supprimé ; il faut le consentement préalable (opt-in), loi n° 2025-594 du 30/06/2025.",
          "« Appeler un PAP au sujet de son annonce, numéro en clair » → VRAI : il sollicite publiquement pour ce bien ; rester strictement sur le sujet de l'annonce.",
          "« On peut prospecter par téléphone le samedi matin » → FAUX : samedi, dimanche et jours fériés interdits ; appels lun-ven 10 h-13 h / 14 h-20 h.",
          "« Je peux envoyer un SMS ou un mail commercial sans accord » → FAUX : email/SMS exigent l'opt-in (art. L.34-5 CPCE), avec désinscription possible.",
          "« La preuve du consentement, c'est au consommateur de la fournir » → FAUX : c'est au professionnel d'en apporter la preuve ; consentement valable 1 an maximum.",
          "« On peut garder les données de prospection indéfiniment » → FAUX : 3 ans maximum après le dernier contact (RGPD / CNIL).",
          "« L'amende peut atteindre 375 000 € » → VRAI : jusqu'à 75 000 € (personne physique) / 375 000 € (personne morale), + nullité des contrats.",
          "« Le porte-à-porte en face-à-face est soumis à l'opt-in » → FAUX : ce n'est pas du démarchage téléphonique ; rester courtois et accepter un refus.",
          "« On peut solliciter le même particulier autant de fois qu'on veut » → FAUX : 4 sollicitations maximum par mois (30 jours glissants).",
          "« Prendre un mandat exige d'agir sous la carte T (loi Hoguet) » → VRAI : le négociateur agit via attestation de collaborateur."
        ]
      },
      {
        "titre": "Pige express : repère et qualifie en 90 secondes",
        "type": "Défi chrono / étude de cas",
        "duree": "10 min",
        "consignes": [
          "Projeter ou distribuer 4 à 5 fiches-annonces fictives du secteur (Jonquières, Ferrières, Croix-Sainte, La Couronne) avec prix, prix/m², ancienneté, baisses, qualité des photos, mentions type « agences s'abstenir ».",
          "En binôme et en 90 secondes par annonce, classer chaque bien : PRIORITAIRE / À TRAVAILLER / À LAISSER, et noter les 2 questions de qualification à poser au vendeur (motif, délai, prix vs marché, projet derrière la vente).",
          "Mise en commun : un binôme défend chaque classement, le formateur tranche et donne le corrigé."
        ],
        "animation": [
          "Chrono strict et visible : on entraîne le réflexe de tri rapide de la pige du matin, pas l'analyse parfaite.",
          "Utiliser de vraies configurations du secteur Martigues pour l'ancrage et la crédibilité.",
          "Faire verbaliser le « pourquoi » du classement : c'est là qu'est l'apprentissage, pas dans la bonne réponse."
        ],
        "corrige": [
          "PAP, 75 jours, 2 baisses, « agences s'abstenir », prix cohérent DVF → PRIORITAIRE : vendeur réaliste à bout de souffle ; appeler le jour même, viser un RDV sous 72 h.",
          "Mandat échu (bien disparu des portails sans vente) → PRIORITAIRE : vendeur déçu encore motivé, parmi les plus faciles à convertir.",
          "Annonce surévaluée parue il y a 3 jours → À TRAVAILLER : piger vite mais prévoir un travail de pédagogie sur le prix (raisonner net vendeur).",
          "Bien déjà sous compromis → À LAISSER sur la vente, mais qualifier le projet de rachat : le vendeur devient un acquéreur à suivre.",
          "Annonce au prix, PAP, parue depuis 20 j → À TRAVAILLER : positionner l'argument « acquéreur en plus », sans heurter."
        ]
      },
      {
        "titre": "Remonter le tunnel : pourquoi zéro mandat ce mois-ci ?",
        "type": "Étude de cas en sous-groupes",
        "duree": "15 min",
        "consignes": [
          "Présenter le cas : un négociateur d'Icaza a pigé 12 biens, passé 40 appels, obtenu 6 RDV d'estimation et signé 0 mandat ce mois-ci ; il se décourage et se dit « nul au téléphone ».",
          "En sous-groupes de 3, poser le diagnostic : à quelle(s) étape(s) le tunnel casse-t-il ? Est-ce le volume d'entrée, le script, le RDV ou le prix ?",
          "Chaque sous-groupe propose 2 actions concrètes et chiffrées ; restitution puis corrigé du formateur."
        ],
        "animation": [
          "Laisser les groupes se tromper de diagnostic d'abord : la confrontation des avis est formatrice.",
          "Ramener à la loi des grands nombres : 12 biens pigés, c'est d'abord un problème de volume, pas de talent.",
          "Conclure sur « ce qui ne se mesure pas ne s'améliore pas » et introduire les KPI hebdomadaires."
        ],
        "corrige": [
          "Deux problèmes cumulés : un volume d'entrée trop faible ET un blocage en rendez-vous.",
          "Priorité 1 : 12 biens pigés au lieu de ~80 → objectif 5 biens pigés + 10 appels par jour, sur un créneau bloqué.",
          "Priorité 2 : 6 RDV pour 0 mandat → le blocage est en rendez-vous (découverte / estimation / closing), pas au téléphone.",
          "Conclusion : il n'est PAS « nul au téléphone » (le phone convertit, 6 RDV) ; c'est le R1/R2 et le volume qu'il faut travailler. Seuls les ratios mesurés permettent de trancher."
        ]
      },
      {
        "titre": "30 nouveaux contacts d'ici demain midi",
        "type": "Brainstorm collectif & engagement",
        "duree": "10 min",
        "consignes": [
          "Au paperboard, le groupe liste en 5 minutes, sans filtre, toutes les sources de contacts vendeurs mobilisables DÈS DEMAIN (PAP du jour, mandats échus, anciens clients, recommandations, sphère d'influence, leads web, terrain…).",
          "Chacun s'engage ensuite à voix haute sur un chiffre : « demain, je crée X nouveaux contacts, dont Y via [le canal oublié repéré au brise-glace] ».",
          "Le formateur additionne les engagements au tableau : le groupe visualise le volume total réinjecté en haut du tunnel."
        ],
        "animation": [
          "Accepter toutes les idées d'abord, trier ensuite : la quantité libère la créativité.",
          "Relier explicitement au brise-glace : viser les colonnes vides du « mur des mandats ».",
          "Photographier le tableau des engagements pour le suivi de la semaine (Suivi des négociateurs)."
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "L'appel de pige CROC sur un PAP fatigué",
        "contexte": "PAP, T3 de 65 m² à Jonquières (Martigues) affiché 210 000 € (≈ 3 230 €/m²) depuis 75 jours, deux baisses de prix, mention « agences s'abstenir ». Mardi 11 h, horaire autorisé.",
        "roleA": "Le négociateur Icaza : il appelle AU SUJET de l'annonce, applique la méthode CROC (Contact, Raison, Objectif, Conclusion), qualifie le vendeur (motif, délai, prix vs marché, projet derrière) et vise un RDV d'estimation avec une alternative de créneaux (« jeudi 18 h ou samedi 10 h ? »).",
        "roleB": "Le vendeur PAP : fatigué, un peu méfiant, enchaîne les objections classiques — « je vends seul », « les agences c'est trop cher », « envoyez-moi un mail », « je n'ai pas le temps », « je réfléchis encore ».",
        "objectif": "Décrocher un RDV daté sans donner de prix au téléphone ni argumenter sur la commission, en restant dans le cadre légal (appel sur le sujet de l'annonce, horaire autorisé, échange tracé).",
        "debrief": [
          "A-t-il cité l'annonce dès l'accroche, posé UNE question à la fois puis laissé le silence faire parler le vendeur ?",
          "A-t-il traité l'objection « trop cher » par le net vendeur dans la poche, et proposé une alternative de créneaux plutôt qu'une question fermée oui/non ?",
          "A-t-il raccroché avec un RDV daté (ou une relance programmée), sans jamais lâcher une fourchette de prix ?",
          "A-t-il respecté le cadre (sujet de l'annonce, horaire, pas de SMS/mail sans accord) ? Une chose qui a marché, une à améliorer au prochain appel."
        ]
      },
      {
        "titre": "Le lead entrant rappelé « dans les 5 minutes »",
        "contexte": "Un propriétaire de Saint-Mitre a rempli dimanche le formulaire d'estimation en ligne du site de l'agence (lead chaud et consentant). On est lundi 10 h 05 : le négociateur le rappelle immédiatement, dans les horaires légaux.",
        "roleA": "Le négociateur : rappelle sur-le-champ en s'appuyant sur la réactivité, qualifie (budget/projet/délai/décideurs), vérifie et note le consentement avant d'évoquer toute relance SMS ou mail, et décroche un RDV d'estimation.",
        "roleB": "Le propriétaire : curieux mais « il regardait juste », pas pressé, a déjà vu passer deux confrères ces derniers mois.",
        "objectif": "Transformer un lead chaud et consentant en RDV grâce à la vitesse de rappel (règle des 5 minutes), tout en sécurisant la preuve du consentement.",
        "debrief": [
          "A-t-il utilisé la réactivité comme atout dès l'ouverture (« je vous rappelle tout de suite suite à votre demande d'estimation ») ?",
          "A-t-il qualifié sans « vendre » au téléphone et verrouillé un RDV plutôt qu'un simple envoi de mail ?",
          "A-t-il bien vérifié/noté le consentement (opt-in) avant de parler d'une relance SMS ou mail, et respecté les horaires ?"
        ]
      },
      {
        "titre": "La demande de recommandation après une vente réussie",
        "contexte": "Un client vient de signer l'acte de vente chez le notaire, visiblement satisfait du travail du négociateur. Le moment est idéal pour activer le levier de prospection le plus rentable qui existe.",
        "roleA": "Le négociateur : remercie, puis demande EXPLICITEMENT une recommandation et surtout l'introduction (« un simple message de votre part change tout »), en s'appuyant sur le script du parrainage.",
        "roleB": "Le client satisfait : bienveillant, prêt à aider, mais ne pense à personne spontanément (« oui oui, j'y penserai… »).",
        "objectif": "Repartir avec un nom précis ET une introduction portée par le client, pas un vague « je penserai à vous ».",
        "debrief": [
          "A-t-il demandé au bon moment (après la satisfaction exprimée) et de façon explicite, sans tourner autour du pot ?",
          "A-t-il demandé l'INTRODUCTION (un message du client à son contact) et pas seulement un numéro à appeler à froid ?",
          "A-t-il laissé le silence travailler pour que le client cherche réellement un nom dans son entourage ?"
        ]
      }
    ],
    "pointsCles": [
      "On n'est pas payé pour vendre mais pour RENTRER DES MANDATS : la prospection est l'activité n°1, bloquée en premier dans l'agenda (au moins 2 h par jour), avant les mails et l'administratif.",
      "Règle des 3 tiers (prospection / découverte-estimations / vente-suivi) + loi des grands nombres : pour obtenir plus de mandats, augmentez d'abord le VOLUME d'entrée en haut du tunnel, pas votre talent.",
      "La prospection paie en différé (3 à 9 mois) : prospecter tous les jours, même le stock plein, c'est ce qui lisse le revenu et supprime les montagnes russes.",
      "La pige vise d'abord les PAP, les mandats échus et les baisses de prix ; piger sous 48 h, et qualifier dès l'appel (motif, délai, prix vs marché, projet derrière la vente).",
      "L'appel de pige (méthode CROC) a UN SEUL but : décrocher un RDV — jamais de prix ni de débat sur la commission au téléphone, et toujours une alternative de créneaux pour verrouiller.",
      "Cadre légal 2026 : opt-in obligatoire depuis le 11/08/2026, Bloctel supprimé, appels lun-ven 10 h-13 h / 14 h-20 h, 4 sollicitations/mois max, preuve du consentement à la charge du pro, données 3 ans max, carte T (loi Hoguet) — amendes jusqu'à 75 000 € / 375 000 €.",
      "Le PAP qui affiche son numéro : l'appeler AU SUJET de son annonce reste permis ; le porte-à-porte en face-à-face échappe à l'opt-in (rester courtois).",
      "Le multicanal démultiplie : phoning base & mandats échus, recommandation (canal n°1), terrain par la répétition/pilonnage, digital (avis Google + règle des 5 minutes), et le fichier acquéreurs — « j'ai un acquéreur » fait tomber les objections.",
      "Ce qui ne se mesure pas ne s'améliore pas : piloter le tunnel par des KPI hebdomadaires et relancer selon un séquençage tenu (J+7 / J+30 / J+90) — la plupart des mandats se signent en relance.",
      "Le mental fait la différence : se juger sur l'ACTION (contacts, appels, RDV) qu'on contrôle, dédramatiser le « non » (un ratio, pas un jugement) et adopter l'identité de « celui qui prospecte tous les jours »."
    ],
    "planAction": [
      "Bloquer dès demain un créneau SACRÉ 9 h-11 h « prospection » dans l'agenda, tous les jours — mails et administratif seulement après.",
      "Piger 5 biens et passer 10 appels par jour (PAP de moins de 48 h + mandats échus du secteur), chaque bien enregistré dans la Chasse immobilière avec prix/m² et positionnement marché.",
      "Appliquer le script CROC à chaque appel : citer l'annonce, qualifier, viser le RDV avec une alternative de créneaux, et raccrocher toujours avec un RDV daté ou une relance programmée (J+7 / J+30 / J+90).",
      "Rappeler tout lead entrant sous 5 minutes et vérifier/noter le consentement (opt-in) avant toute relance SMS ou mail ; appeler uniquement dans les horaires légaux.",
      "Demander une recommandation (un nom + une introduction portée) et un avis Google après chaque vente ou chaque client satisfait cette semaine.",
      "Afficher au mur un seul chiffre suivi chaque jour — le nombre de nouveaux contacts vendeurs créés — et le reporter dans Suivi des négociateurs pour le point hebdo."
    ],
    "notesFormateur": [
      "Gérer le temps : annoncer l'agenda minuté dès le départ, garder un chrono visible à chaque jeu et tenir les horaires ; réserver impérativement les 10 dernières minutes au plan d'action, c'est là que se joue l'ancrage.",
      "Faire participer tout le monde : alterner apports courts (15 min max) et jeux, faire bouger physiquement (Vrai/Faux debout/assis), interroger nommément les plus discrets et valoriser chaque prise de parole.",
      "Ancrer les acquis : relier systématiquement chaque jeu à un cas réel du secteur Martigues (Jonquières, Ferrières, La Couronne, Croix-Sainte…) et à un chiffre, puis faire reformuler le message-clé par un participant plutôt que de le répéter soi-même.",
      "Rendre actionnable : clore chaque séquence par un « concrètement, demain, je… » et consigner les engagements CHIFFRÉS au paperboard pour le suivi de la semaine.",
      "Donner l'exemple et le droit à l'erreur : jouer soi-même un appel de pige devant le groupe (y compris un raté), dédramatiser le « non » et faire des jeux de rôle un terrain d'entraînement bienveillant, jamais un examen.",
      "Préparer le matériel en amont : pancartes A/B/C/D, paperboard et feutres, chrono/minuteur, fiches-annonces fictives du secteur, fiche mémo « conformité 2026 », et un petit lot pour le quiz-battle."
    ]
  },
  "decouverte": {
    "id": "decouverte",
    "sousTitre": "Faire parler avant de convaincre : questionner, écouter et qualifier pour ne plus jamais vendre à l'aveugle.",
    "objectifs": [
      "Maîtriser les 5 familles de questions et la technique de l'entonnoir pour faire parler le client plus de 70 % du temps.",
      "Être capable de qualifier un vendeur avec la méthode M.D.P.P. (Motivation, Délai, Prix, Pouvoir) et de prioriser ses mandats en A, B ou C.",
      "Savoir qualifier un acquéreur en validant d'abord son financement (règles HCSF : 35 %, 25-27 ans) et en raisonnant en enveloppe totale.",
      "Détecter le levier de décision dominant de chaque client grâce à la grille SONCASE et y brancher son discours.",
      "Conduire un R1 structuré en 5 temps et le verrouiller par la prise du R2, sans jamais lâcher de prix.",
      "Transformer la découverte en synthèse qui fait vendre (mnémonique C.R.A.N.) tout en respectant la fiche de qualification, le RGPD et la LCB-FT."
    ],
    "agenda": [
      {
        "titre": "Accueil & brise-glace « Mon pire RDV de découverte »",
        "duree": "8 min"
      },
      {
        "titre": "Cadrage, objectifs de la séance & la règle d'or 70/30",
        "duree": "8 min"
      },
      {
        "titre": "Jeu 1 — Quiz-battle en équipes « Découverte express »",
        "duree": "15 min"
      },
      {
        "titre": "Apport-flash : méthode M.D.P.P. & grille de priorisation A/B/C",
        "duree": "8 min"
      },
      {
        "titre": "Jeu 2 — Défi chrono « L'entonnoir : d'ouverte à fermée »",
        "duree": "8 min"
      },
      {
        "titre": "Jeu 3 — Vrai/Faux « Financement & droit 2025-2026 »",
        "duree": "12 min"
      },
      {
        "titre": "Apport-flash : grille SONCASE & détection du levier dominant",
        "duree": "7 min"
      },
      {
        "titre": "Jeu 4 — Photolangage « Un bien, quatre discours »",
        "duree": "12 min"
      },
      {
        "titre": "Jeu de rôle — « Du premier appel à la synthèse » (binômes)",
        "duree": "22 min"
      },
      {
        "titre": "Jeu 5 — Étude de cas « Priorise tes mandats »",
        "duree": "10 min"
      },
      {
        "titre": "Synthèse C.R.A.N. & messages-clés à retenir",
        "duree": "5 min"
      },
      {
        "titre": "Plan d'action individuel & clôture du module",
        "duree": "7 min"
      }
    ],
    "briseGlace": {
      "titre": "Mon pire rendez-vous de découverte",
      "consignes": [
        "Chaque négociateur note en 1 minute, sur un post-it, un rendez-vous (vendeur ou acquéreur) où il a eu le sentiment d'avoir « parlé dans le vide » ou d'être passé à côté du vrai besoin.",
        "Tour de table express, 30 secondes par personne : on partage la situation en une phrase, sans se justifier ni chercher d'excuse.",
        "L'animateur colle les post-it au tableau en les regroupant dans 3 colonnes : « j'ai trop parlé », « j'ai argumenté trop tôt », « je n'ai pas qualifié ».",
        "Conclusion en une phrase : « Ces trois colonnes sont exactement le programme d'aujourd'hui — on y reviendra à la fin pour voir ce qu'on aurait fait autrement. » On garde le mur affiché toute la séance."
      ]
    },
    "jeux": [
      {
        "titre": "Découverte express",
        "type": "Quiz-battle en équipes",
        "duree": "15 min",
        "consignes": [
          "Constituer 2 ou 3 équipes mixtes (juniors + expérimentés) ; chaque équipe choisit un nom et un porte-parole.",
          "L'animateur projette 10 questions tirées du module, une à la fois, 20 secondes de réflexion par question.",
          "Chaque équipe écrit sa réponse sur une ardoise ou une feuille ; révélation simultanée au top, pour éviter la copie.",
          "1 point par bonne réponse, +1 point bonus si l'équipe sait justifier « pourquoi » (la règle derrière la réponse).",
          "Après chaque question, l'animateur commente à chaud avec l'explication exacte avant de passer à la suivante.",
          "L'équipe gagnante remporte un lot symbolique (café offert, priorité sur le prochain lead entrant…)."
        ],
        "animation": [
          "Alterner questions faciles et questions pièges pour tenir le suspense ; garder les 2 plus clivantes pour la fin.",
          "Ne jamais se contenter de donner la bonne réponse : faire reformuler la règle par un membre de l'équipe qui s'est trompée, pour ancrer.",
          "Tenir un rythme vif (20 s par question) ; un quiz qui traîne perd l'énergie du groupe."
        ],
        "corrige": [
          "Quelle répartition de parole viser en découverte ? → Écouter 70 %, parler 30 % : celui qui pose les questions dirige l'entretien.",
          "Que qualifie-t-on EN PRIORITÉ chez un acquéreur ? → Son financement validé : un acquéreur finançable vaut dix curieux.",
          "Dans SONCAS, le « A » correspond à… → Argent : bonne affaire, rentabilité, négociation, plus-value.",
          "Taux d'endettement maximal fixé par le HCSF ? → 35 % des revenus nets, assurance emprunteur comprise (depuis 2022).",
          "Pour qualifier le budget d'un acquéreur, on raisonne en… → Enveloppe totale : prix + frais de notaire + honoraires.",
          "Pour vendre un bien en indivision, le mandat doit être signé par… → Tous les indivisaires (ou leur représentant dûment mandaté).",
          "La technique de l'entonnoir consiste à… → Partir de questions ouvertes et larges pour finir par des questions fermées et précises.",
          "Que désigne le second P de M.D.P.P. ? → Le Pouvoir : qui décide et qui signe.",
          "Objectif principal du R1 de découverte ? → Comprendre le projet, créer la confiance et obtenir le R2 (ni signer, ni donner de prix).",
          "LCB-FT : à qui l'agent déclare-t-il un soupçon de blanchiment ? → À Tracfin (la CNIL, c'est le RGPD)."
        ]
      },
      {
        "titre": "L'entonnoir : d'ouverte à fermée",
        "type": "Défi chrono",
        "duree": "8 min",
        "consignes": [
          "Manche 1 : l'animateur projette une question « maladroite » (fermée, prématurée ou d'interrogatoire), par exemple « Quel est votre budget ? » posée d'entrée de jeu.",
          "En binômes, 30 secondes pour la reformuler en question OUVERTE qui fait parler sans braquer ; chaque binôme propose à voix haute.",
          "L'animateur garde la meilleure formulation au tableau et enchaîne 3 ou 4 exemples.",
          "Manche 2 : l'animateur donne 5 questions en vrac (motivation, projection, délai, prix et sa logique, qui signe) ; les binômes les remettent dans l'ordre de l'entonnoir, du large au précis, en 60 secondes.",
          "Le binôme le plus rapide ET juste marque le point."
        ],
        "animation": [
          "Marteler la règle : on ne commence JAMAIS par « quel est votre budget / votre prix », on y arrive progressivement.",
          "Faire remarquer qu'une question fermée bien placée (en fin d'entonnoir) sert à verrouiller un fait : ce n'est pas interdit, c'est une question de moment.",
          "Valoriser les reformulations qui justifient la question : « pour mieux vous conseiller, puis-je vous demander… »"
        ],
        "corrige": [
          "« Quel est votre budget ? » (d'entrée) → « Parlez-moi de votre projet : qu'est-ce qui vous amène à chercher aujourd'hui ? », puis plus tard « pour ne vous montrer que des biens dans vos moyens, parlons budget quelques minutes ».",
          "« C'est trop cher pour le quartier. » (argument prématuré) → « 320 000 €, d'accord — comment êtes-vous arrivé à ce chiffre ? »",
          "Ordre type de l'entonnoir : 1) Projet / motivation (ouverte) → 2) Projection (« imaginons que ce soit vendu dans 3 mois… ») → 3) Délai et son enjeu → 4) Prix espéré et sa logique → 5) Qui décide / qui signe (fermée de verrouillage)."
        ]
      },
      {
        "titre": "Financement & droit 2025-2026",
        "type": "Vrai/Faux (cartons)",
        "duree": "12 min",
        "consignes": [
          "Distribuer à chacun deux cartons : VRAI (vert) et FAUX (rouge).",
          "L'animateur énonce une affirmation ; au signal, chacun lève son carton en même temps.",
          "On compte la salle, puis on dévoile la réponse et on énonce la règle exacte (chiffre, date).",
          "Pour chaque affirmation FAUSSE, un volontaire doit donner la bonne version.",
          "Enchaîner 10 affirmations à bon rythme, en gardant les plus techniques pour piquer l'attention."
        ],
        "animation": [
          "C'est le moment « technique » de la séance : rester précis sur les chiffres et les dates, car c'est cette précision qui crée la crédibilité face au client.",
          "Rappeler que le négociateur REPÈRE ces éléments mais oriente vers le notaire ou le courtier pour le calcul précis : on ne s'improvise pas conseiller fiscal ou bancaire.",
          "Faire noter aux participants les 2 ou 3 chiffres qu'ils confondaient encore."
        ],
        "corrige": [
          "« Le taux d'endettement maximal du HCSF est de 35 %, assurance comprise. » → VRAI.",
          "« Dans l'ancien, les frais de notaire tournent autour de 2 à 3 %. » → FAUX : 7 à 8 % dans l'ancien, 2 à 3 % seulement dans le neuf.",
          "« La durée maximale d'emprunt HCSF est de 25 ans, jusqu'à 27 ans dans le neuf ou avec travaux significatifs. » → VRAI.",
          "« Les logements classés G sont interdits à la location depuis 2025. » → VRAI (F interdit en 2028, E en 2034).",
          "« On peut donner un prix « à la louche » dès le R1 si le vendeur insiste. » → FAUX : le prix se présente au R2, comparables à l'appui.",
          "« Pour vendre un bien en indivision, la signature de l'aîné des héritiers suffit. » → FAUX : tous les indivisaires doivent signer le mandat.",
          "« En métropole, la déclaration de succession et le paiement des droits se font en principe dans les 6 mois du décès. » → VRAI.",
          "« La loi Carrez s'applique aussi à la maison individuelle hors copropriété. » → FAUX : Carrez vise les lots en copropriété ; pour une maison on indique la surface habitable.",
          "« En cas de soupçon de blanchiment, l'agent déclare à la CNIL. » → FAUX : à Tracfin (LCB-FT) ; la CNIL relève du RGPD.",
          "« La résidence principale est exonérée de plus-value à la revente. » → VRAI (un autre bien est taxé à 19 % + 17,2 %, avec abattements pour durée de détention)."
        ]
      },
      {
        "titre": "Un bien, quatre discours",
        "type": "Photolangage / mise en situation",
        "duree": "12 min",
        "consignes": [
          "L'animateur affiche la fiche d'UN seul bien, par exemple une villa rénovée à Saint-Julien (Martigues) : tout de plain-pied, DPE C, isolation 2021, toiture refaite en 2022, affichée 3 % sous les dernières ventes du secteur.",
          "Il distribue à chaque binôme une « carte profil » client : Sécurité, Orgueil, Confort, Argent, Sympathie ou Écologie.",
          "En 3 minutes, chaque binôme rédige l'accroche (2 ou 3 phrases) qui parle À SON profil, en s'appuyant uniquement sur les atouts réels du bien.",
          "Restitution : chaque binôme lit son accroche à voix haute ; le reste de la salle devine le levier ciblé.",
          "Variante photolangage : étaler des photos d'ambiances (famille, chiffres/rendement, belle adresse, nature/énergie) ; chacun choisit celle qui représente son client type et explique son choix en une phrase."
        ],
        "animation": [
          "Montrer qu'on vend le MÊME bien avec des mots différents : on cible le levier dominant, on ne déroule pas tous les arguments (sinon le message se dilue).",
          "Pointer le piège classique : projeter son propre levier (toi « Argent », le client « Sympathie »).",
          "Faire le lien avec le couple aux leviers opposés (lui demande le rendement = Argent, elle s'extasie sur la vue = Orgueil/Sympathie) : on mène deux discours en parallèle, sans en ignorer aucun."
        ],
        "corrige": [
          "Argent : « 3 % sous les dernières ventes du secteur, une très bonne revente assurée. »",
          "Confort : « tout de plain-pied, à 5 minutes des écoles et des commerces, rien à refaire. »",
          "Sécurité : « diagnostics récents, toiture refaite en 2022, quartier résidentiel calme. »",
          "Écologie : « DPE C, isolation 2021, pompe à chaleur : des charges maîtrisées. »",
          "Orgueil : « une adresse recherchée à Saint-Julien, vous serez chez vous dans LE quartier. »",
          "Sympathie : « une maison pleine d'histoire, un vrai coup de cœur que ses propriétaires vous transmettent. »"
        ]
      },
      {
        "titre": "Priorise tes mandats",
        "type": "Étude de cas en équipes",
        "duree": "10 min",
        "consignes": [
          "L'animateur distribue 3 fiches mandats fictives inspirées du secteur de Martigues (une par situation).",
          "En équipes, qualifier chaque mandat selon la méthode M.D.P.P. (Motivation, Délai, Prix, Pouvoir) et le classer A, B ou C.",
          "Chaque équipe justifie son classement ET propose la PROCHAINE action concrète pour chacun des 3 mandats.",
          "Confrontation : l'animateur fait débattre les classements divergents avant de livrer le corrigé."
        ],
        "animation": [
          "Pousser les équipes à repérer le piège du « Pouvoir » : un mandat A sur le papier peut être bloqué par un décideur absent (le frère à l'étranger qui n'a rien signé).",
          "Rappeler qu'un mandat C ne se refuse pas forcément, mais ne se sur-investit pas : on qualifie honnêtement et on pose une relance datée.",
          "Insister sur « la prochaine action » : un classement sans action concrète ne sert à rien sur le terrain."
        ],
        "corrige": [
          "Succession à Ferrières, 3 frères, veulent vendre « vite et net », prix aligné sur le marché, mais un frère vit à l'étranger et n'a rien signé → Mandat A conditionnel : sécuriser le POUVOIR d'abord (faire signer les 3 frères ou passer par le notaire de la succession) avant d'investir du temps.",
          "Couple à Carro : « on vend si on a 500 000 €, sinon on garde », aucun délai → Mandat C chronophage : qualifier honnêtement, poser une relance datée, ne pas sur-investir.",
          "Vendeur muté à Lyon dans 4 mois, secteur Saint-Julien, décide avec son épouse présente, prix encore à caler → Mandat A prioritaire : viser l'exclusivité et verrouiller le R2."
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "Du premier appel à la synthèse qui fait vendre",
        "contexte": "Un appel entrant arrive sur l'annonce d'un T4 à Martigues centre, puis le rendez-vous se transforme en R1 de découverte vendeur. Le négociateur doit qualifier au téléphone sans donner de prix, décrocher le RDV, mener la découverte (entonnoir, silence, reformulation) et conclure par une synthèse validée suivie d'une prise de R2 par alternative.",
        "roleA": "Le négociateur (celui qui s'entraîne) : il mène l'appel puis la découverte, respecte le 70/30, applique l'entonnoir, utilise le silence après sa question clé, requalifie un « prix besoin » et verrouille le R2 en s'assurant de la présence des deux décideurs.",
        "roleB": "Le vendeur « muté à Lyon dans 4 mois », joué par un collègue muni d'une fiche cachée : motivation forte mais prix adossé à un besoin (« il me faut 320 000 € pour financer mon achat »), décide avec son épouse absente ce jour-là, et a déjà contacté une autre agence. Il ne livre ses vraies informations QUE si on le questionne correctement.",
        "objectif": "S'entraîner à faire parler le client 70 % du temps, à ne lâcher aucun prix (ni au téléphone, ni au R1), à requalifier un « prix besoin » en découvrant le « pourquoi derrière le pourquoi », et à verrouiller un R2 daté avec tous les décideurs présents.",
        "debrief": [
          "Qui a parlé le plus ? Le négociateur a-t-il réellement tenu le ratio 70/30 ?",
          "A-t-il résisté à la tentation de donner un prix, aussi bien au téléphone qu'au R1 ?",
          "A-t-il découvert le « pourquoi derrière le pourquoi » (par exemple les nets réellement attendus derrière le chiffre de 320 000 €) ?",
          "A-t-il identifié le POUVOIR et prévu la présence de l'épouse au R2 ?",
          "La synthèse finale a-t-elle fait dire « oui » au vendeur et débouché sur un R2 daté par alternative ?"
        ]
      },
      {
        "titre": "Parler argent sans gêne (qualification acquéreur)",
        "contexte": "Un acquéreur enthousiaste veut absolument visiter un bien affiché à 290 000 € à Martigues. Le négociateur doit valider le financement AVANT de faire visiter, avec tact, pour ne pas faire perdre de temps ni bloquer inutilement le bien d'un vendeur.",
        "roleA": "Le négociateur : il cadre la question du budget comme un service rendu, calcule l'enveloppe totale (capacité ≈ 35 % des revenus, frais ≈ 7-8 % dans l'ancien, apport), et réoriente vers un bien réaliste si le projet est hors budget.",
        "roleB": "L'acquéreur réticent à parler argent : 3 800 € nets par mois, aucun crédit en cours, 15 000 € d'apport, n'a pas encore vu de banque ni de courtier, un peu « touriste » sur les bords et pressé de visiter.",
        "objectif": "Oser aborder le budget sans braquer, raisonner en enveloppe totale, repérer un acquéreur non finançable sur le bien visé et proposer une alternative utile plutôt qu'une visite dans le vide.",
        "debrief": [
          "La question du budget a-t-elle été amenée comme un service rendu, ou de façon brutale… ou jamais posée ?",
          "Le calcul d'enveloppe (capacité ≈ 35 %, frais ≈ 8 %, apport) a-t-il été fait et expliqué simplement au client ?",
          "Le négociateur a-t-il su dire « ce bien est hors budget » et proposer une alternative, au lieu de faire visiter pour faire plaisir ?",
          "A-t-il orienté vers un courtier ou une banque, sans s'improviser conseiller bancaire ?"
        ]
      }
    ],
    "pointsCles": [
      "La découverte précède TOUJOURS l'argumentation : on ne convainc jamais sans avoir d'abord compris.",
      "Règle d'or 70/30 : le client parle plus des deux tiers du temps ; celui qui pose les questions dirige, celui qui parle se livre.",
      "L'entonnoir : du large (questions ouvertes, motivation) vers le précis (questions fermées, prix, délai, pouvoir) — jamais le budget en premier.",
      "Le silence et la reformulation sont des outils : ils font préciser le besoin et « font dire oui ».",
      "Qualifier le vendeur = M.D.P.P. (Motivation, Délai, Prix, Pouvoir), pour en déduire un mandat A (foncer), B (à travailler) ou C (ne pas sur-investir).",
      "Qualifier l'acquéreur = valider le FINANCEMENT d'abord, en enveloppe totale (HCSF 35 %, 25-27 ans, frais ≈ 7-8 % dans l'ancien).",
      "SONCASE : détecter le levier dominant dans les mots du client et y brancher le discours, sans dérouler tous les arguments.",
      "Au R1, on ne signe pas et on ne donne pas de prix : on comprend, on crée la confiance, on verrouille le R2.",
      "Tout se note : la fiche de qualification est le socle du CRM, dans le respect du RGPD et de la LCB-FT (identité, origine des fonds, déclaration à Tracfin).",
      "Avant d'argumenter, vérifier son C.R.A.N. : Compris (motivation), Reformulé (synthèse validée), Aligné (décideurs, prix, délai), Noté (fiche à jour)."
    ],
    "planAction": [
      "Dès mon prochain RDV, j'ouvre par le « contrat d'entretien » (annoncer le déroulé) et je me fixe l'objectif « comprendre + obtenir le R2 », sans lâcher de prix.",
      "Je remplis ma fiche de qualification à chaque contact (M.D.P.P. côté vendeur, financement + BANT côté acquéreur) et je la saisis dans le CRM le jour même.",
      "Je m'impose de poser au moins 3 questions ouvertes et de tenir un vrai silence après ma question clé avant toute relance.",
      "Avant toute visite acquéreur, je valide l'enveloppe totale (capacité + apport − frais) : pas de visite sans budget qualifié.",
      "Sur chaque RDV, j'identifie le levier SONCASE dominant du client et j'adapte au moins un argument dessus.",
      "Je termine chaque découverte par une synthèse reformulée validée (« c'est bien ça ? ») et une prochaine étape DATÉE (R2, visite ou relance)."
    ],
    "notesFormateur": [
      "Gérer le temps : annoncez le minutage, nommez un gardien du temps, et sacrifiez un apport théorique plutôt qu'un jeu — c'est en jouant qu'ils retiennent.",
      "Faire participer tout le monde : composez des binômes et équipes mixtes (juniors + expérimentés) et faites tourner les porte-parole pour que les plus discrets prennent la parole.",
      "Partir du vécu : rattachez chaque règle à un cas réel de l'agence sur le secteur de Martigues et aux situations que vos négociateurs vivent cette semaine.",
      "Ancrer les acquis : après chaque jeu, faites reformuler la règle par un participant plutôt que par vous — ce qu'ils disent eux-mêmes reste.",
      "Soigner le débrief des jeux de rôle : commentez les comportements observés (qui a parlé le plus ? a-t-on donné un prix ?), jamais la personne, et valorisez d'abord ce qui a marché.",
      "Clôturer sur l'action : revenez au mur de post-it du brise-glace et faites écrire à chacun ses 2 ou 3 engagements du lendemain — le plan d'action est le vrai livrable de la séance."
    ]
  },
  "estimation": {
    "id": "estimation",
    "sousTitre": "Fixer le juste prix et savoir le démontrer : la méthode qui rentre des mandats au bon prix, preuves à l'appui.",
    "objectifs": [
      "Distinguer avis de valeur, expertise et évaluation fiscale, et manier sans faute le vocabulaire du prix (valeur vénale, prix FAI, net vendeur, honoraires affichés TTC).",
      "Choisir et croiser la bonne méthode d'évaluation selon le bien : comparaison en résidentiel, capitalisation du revenu pour le locatif, coût de remplacement pour l'atypique, surface pondérée pour les annexes.",
      "Construire un dossier de comparables solide à partir des ventes DVF et savoir recadrer un vendeur qui brandit un prix affiché ou un estimateur en ligne.",
      "Être capable de calculer une surface pondérée et de formaliser une grille d'ajustement chiffrée (plus-values / moins-values), DPE et valeur verte compris.",
      "Oser le juste prix et désamorcer la surévaluation en s'appuyant sur la courbe d'intérêt des 3-4 premières semaines.",
      "Conduire un rendez-vous d'estimation en deux temps (R1 découverte / R2 présentation) et présenter un avis de valeur qui démontre avant d'annoncer le chiffre."
    ],
    "agenda": [
      {
        "titre": "Accueil, cadrage des objectifs et brise-glace « Le prix dans ma tête »",
        "duree": "10 min"
      },
      {
        "titre": "Apport 1 — Trois mots, trois réalités : avis de valeur, expertise, évaluation fiscale ; valeur vénale, FAI et net vendeur",
        "duree": "15 min"
      },
      {
        "titre": "Jeu 1 — Quiz-battle en équipes (vocabulaire, méthodes, cadre légal)",
        "duree": "15 min"
      },
      {
        "titre": "Apport 2 — Méthodes d'évaluation, sources DVF/Patrim et surface pondérée",
        "duree": "15 min"
      },
      {
        "titre": "Jeu 2 — Défi chrono : calcul de surface pondérée et de valeur (étude de cas Martigues)",
        "duree": "15 min"
      },
      {
        "titre": "Jeu 3 — Vrai/Faux : les pièges juridiques (Carrez, DPE, honoraires, DVF)",
        "duree": "10 min"
      },
      {
        "titre": "Apport 3 — Le piège mortel de la surévaluation et la courbe d'intérêt des 3-4 semaines",
        "duree": "10 min"
      },
      {
        "titre": "Jeu de rôle — R2 face au vendeur qui veut 290 000 € (jouer + débriefer)",
        "duree": "20 min"
      },
      {
        "titre": "Synthèse des points clés et engagement sur le plan d'action",
        "duree": "10 min"
      }
    ],
    "briseGlace": {
      "titre": "Le prix dans ma tête : qui dit juste ?",
      "consignes": [
        "Avant tout apport, projetez la fiche d'un bien réel du secteur (un T3 à Martigues, photos + surface Carrez + DPE, SANS le prix). Chaque négociateur écrit en 60 secondes, sur un post-it, SON estimation au feeling et la colle au tableau.",
        "Affichez l'éventail des réponses (souvent 30 000 à 50 000 € d'écart entre collègues sur le même bien !) et faites réagir : « Comment un même bien peut-il valoir si différemment selon nous ? »",
        "Révélez le prix de vente DVF réel du bien. Celui qui tombe le plus près gagne un point d'honneur. Concluez : « Le feeling nous divise ; la méthode et les preuves nous mettront d'accord, et surtout mettront le vendeur d'accord. C'est tout l'objet de la séance. »",
        "Durée cible 10 minutes : l'objectif est de créer le besoin, pas de débattre du prix exact."
      ]
    },
    "jeux": [
      {
        "titre": "Quiz-battle « Estimation : le juste mot, la juste méthode »",
        "type": "Quiz-battle en équipes",
        "duree": "15 min",
        "consignes": [
          "Constituez 2 équipes (ou 3 si le groupe est grand). Chaque équipe choisit un nom d'agence fictif concurrent et un porte-parole qui lève la main pour répondre.",
          "Posez les 8 questions ci-dessous à l'oral, une par une. La première équipe qui lève la main répond ; bonne réponse = 1 point, et +1 point bonus si elle justifie correctement (le « pourquoi »).",
          "Si l'équipe qui buzze se trompe, l'autre équipe peut voler la main et marquer le point.",
          "Q1 : Avis de valeur ou expertise — lequel engage la responsabilité devant un tribunal ? Q2 : Citez les trois prix à ne jamais confondre. Q3 : Que recense exactement la base DVF, et sur combien d'années ? Q4 : Quelle méthode est la reine en résidentiel ? Q5 : Un studio loué 600 €/mois à 6 % de rendement attendu vaut combien par capitalisation ? Q6 : Les honoraires d'agence suivent-ils un barème légal ? Q7 : En loi Carrez, à partir de quel écart de surface l'acquéreur peut-il demander une baisse de prix, et dans quel délai ? Q8 : Depuis quand un audit énergétique est-il obligatoire pour vendre une maison classée F ou G ?",
          "Tenez le score au tableau. L'équipe gagnante choisit son ordre de passage au jeu de rôle final."
        ],
        "animation": [
          "Rythme rapide, ambiance compétition bon enfant : c'est un échauffement, pas un examen. Ne laissez pas s'installer de longs silences, relancez.",
          "Après chaque bonne réponse, reformulez le message clé en une phrase pour l'ancrer (« Donc on retient que... »).",
          "Notez discrètement les questions où les deux équipes hésitent : ce sont vos points à re-travailler dans l'apport qui suit."
        ],
        "corrige": [
          "Q1 : l'expertise immobilière (rapport normé selon la Charte, engage la responsabilité de l'expert) ; l'avis de valeur n'est qu'une opinion motivée, sans valeur juridique probante.",
          "Q2 : la valeur vénale (vérité du marché), le prix de présentation FAI (affiché, frais d'agence inclus) et le net vendeur (FAI moins honoraires).",
          "Q3 : les mutations à titre onéreux réellement enregistrées, sur les 5 dernières années, mise à jour 2 fois par an (avril et octobre) ; ne couvre pas l'Alsace-Moselle ni Mayotte.",
          "Q4 : la méthode par comparaison (biens similaires réellement vendus, pas affichés).",
          "Q5 : 7 200 € de loyer annuel ÷ 0,06 = 120 000 €.",
          "Q6 : non, aucun barème légal ; librement fixés mais affichés TTC et de façon lisible (arrêté du 10 janvier 2017).",
          "Q7 : au-delà de 5 % d'erreur en moins, baisse de prix proportionnelle, par action dans l'année suivant l'acte authentique.",
          "Q8 : depuis le 1er avril 2023 pour les classes F et G (le 1er janvier 2025 pour les E, le 1er janvier 2034 pour les D)."
        ]
      },
      {
        "titre": "Défi chrono « Surface pondérée, vraie valeur »",
        "type": "Défi chrono / étude de cas",
        "duree": "15 min",
        "consignes": [
          "Distribuez à chaque binôme la fiche du bien : appartement à Martigues, 68 m² Carrez + terrasse plein sud 20 m² + cave 6 m² + un parking ; prix/m² de référence du secteur 3 200 €/m² ; forfait parking 12 000 €.",
          "Donnez les coefficients de pondération de référence : habitable 1 ; terrasse 0,45 (PACA) ; cave 0,2 ; parking au forfait.",
          "Chrono 7 minutes : chaque binôme calcule la surface pondérée, puis la valeur, et rédige en une phrase comment il présenterait ce chiffre au vendeur.",
          "Chaque binôme annonce son résultat ; on confronte les méthodes au tableau avant de donner le corrigé.",
          "Bonus (si le temps le permet) : « Que devient la valeur si on OUBLIE de pondérer la terrasse et la cave ? » pour mesurer l'erreur évitée."
        ],
        "animation": [
          "Circulez entre les binômes pendant le chrono : repérez ceux qui additionnent les surfaces brutes sans pondérer, c'est l'erreur classique à faire verbaliser.",
          "Insistez sur le sens commercial : le calcul ne sert à rien s'il ne devient pas une démonstration pour le vendeur (« votre terrasse plein sud vaut concrètement... »).",
          "Valorisez la bonne formulation vendeur autant que le bon chiffre : c'est là que se joue la crédibilité."
        ],
        "corrige": [
          "Surface pondérée = 68 + (20 × 0,45) + (6 × 0,2) = 68 + 9 + 1,2 = 78,2 m².",
          "Valeur du bâti = 78,2 × 3 200 ≈ 250 240 €, + 12 000 € de parking = ≈ 262 000 €.",
          "Sans pondérer la terrasse et la cave (on ne compterait que 68 m² à 3 200 € = 217 600 € + parking), on sous-évaluerait d'environ 33 000 € : l'extérieur en PACA est un véritable multiplicateur de valeur.",
          "Message vendeur modèle : « Votre bien ne fait pas 68 m² à vendre, il fait 78 m² “utiles” grâce à cette terrasse plein sud et à la cave : voilà pourquoi je le valorise à 262 000 € et pas à 217 000 €. »"
        ]
      },
      {
        "titre": "Vrai/Faux « Les pièges qui coûtent cher »",
        "type": "Vrai/Faux debout-assis",
        "duree": "10 min",
        "consignes": [
          "Tout le monde se lève. Énoncez une affirmation : les négociateurs restent DEBOUT s'ils pensent VRAI, s'ASSOIENT s'ils pensent FAUX. On ne copie pas sur le voisin.",
          "Après chaque affirmation, interrogez une personne de chaque camp pour qu'elle justifie, puis tranchez et donnez l'explication.",
          "Affirmation 1 : « Une maison individuelle est soumise à la loi Carrez. » Affirmation 2 : « On peut annoncer un prix fiable au téléphone sans avoir vu le bien. » Affirmation 3 : « Le DPE est opposable depuis le 1er juillet 2021. » Affirmation 4 : « Les frais de notaire dans l'ancien tournent autour de 7 à 8 %. » Affirmation 5 : « Un logement classé G ne peut plus être loué depuis le 1er janvier 2025. » Affirmation 6 : « Sous-évaluer un bien n'est pas une faute, au pire le vendeur gagne du temps. » Affirmation 7 : « On estime sur la surface Carrez et on communique la surface pondérée à la vente. »",
          "Comptez les erreurs collectives : les affirmations où la moitié de la salle se trompe deviennent vos piqûres de rappel du mois."
        ],
        "animation": [
          "Format physique et rapide, parfait après un temps assis : ça réveille et ça dédoute. Gardez un ton léger.",
          "Ne corrigez jamais sèchement : faites expliciter le raisonnement faux, c'est là que l'apprentissage se fait.",
          "Reliez chaque piège à un risque concret (responsabilité, recours, perte de crédibilité) pour marquer les esprits."
        ],
        "corrige": [
          "1 FAUX : la loi Carrez ne concerne que les lots de copropriété ; la maison individuelle n'y est pas soumise (mais la surface annoncée doit rester exacte, sous peine de dol).",
          "2 FAUX : donner un prix par téléphone sans avoir vu le bien est impossible à ajuster et destructeur de crédibilité.",
          "3 VRAI : le DPE est opposable depuis le 1er juillet 2021 et valable 10 ans.",
          "4 VRAI : de l'ordre de 7 à 8 % dans l'ancien, 2 à 3 % dans le neuf (en hausse dans plus de 70 départements depuis avril 2025, sauf primo-accédants).",
          "5 VRAI : interdiction de louer les G depuis le 1er janvier 2025 (F au 1er janvier 2028, E au 1er janvier 2034).",
          "6 FAUX : sous-évaluer fait perdre de l'argent au vendeur, expose à un recours et décrédibilise quand le bien part en 48 h au-dessus du prix ; c'est bien une faute professionnelle.",
          "7 FAUX : on estime en général sur la surface PONDÉRÉE, mais on communique la surface CARREZ à la vente (et la Boutin au bail)."
        ]
      },
      {
        "titre": "Mise en situation téléphonique « Donnez-moi juste un prix au téléphone »",
        "type": "Mise en situation téléphonique",
        "duree": "10 min",
        "consignes": [
          "Deux chaises dos à dos (on ne se voit pas, comme au téléphone). Un volontaire joue le négociateur, l'animateur ou un pair joue le vendeur pressé.",
          "Script du vendeur : « Bonjour, j'ai vu votre agence, je vends mon T3 au centre de Martigues, 65 m² avec balcon. Donnez-moi juste une fourchette là, au téléphone, histoire de savoir si ça vaut le coup. » Le vendeur insiste 2 fois pour obtenir un chiffre.",
          "Objectif du négociateur : NE PAS lâcher de prix à l'aveugle, mais décrocher un rendez-vous (R1) tout en valorisant son sérieux et sa gratuité.",
          "Rejouez la scène avec un 2e volontaire qui tente une autre formulation. Le groupe vote pour l'accroche la plus convaincante."
        ],
        "animation": [
          "Le dos à dos crée une vraie sensation de téléphone et oblige à travailler la voix et le débit, pas le langage corporel.",
          "Si le négociateur craque et donne un chiffre, laissez le vendeur enchaîner « super, merci, je rappelle si besoin » et raccrocher : la démonstration par l'échec est puissante.",
          "Capitalisez les meilleures phrases d'accroche entendues pour en faire un petit script commun d'agence."
        ],
        "corrige": [
          "Réponse modèle : « Je pourrais vous lancer un chiffre, mais ce serait vous mentir : deux T3 de 65 m² dans la même rue peuvent avoir 40 000 € d'écart selon l'étage, l'exposition, l'état et le DPE. Je vous propose de passer 30 minutes sur place cette semaine ; je repars avec vos mesures et je reviens avec un avis de valeur documenté, comparables à l'appui, et c'est offert. Mardi 18 h ou jeudi 12 h ? »",
          "Points gagnants : ne pas humilier le vendeur, expliquer POURQUOI le téléphone est impossible, transformer le refus en preuve de sérieux, et proposer un choix de créneaux (double option) plutôt qu'une question ouverte."
        ]
      },
      {
        "titre": "Atelier chiffrage « Une passoire à Martigues »",
        "type": "Brainstorm / étude de cas DPE",
        "duree": "15 min",
        "consignes": [
          "En 2 groupes : une maison à Martigues vaudrait 310 000 € en classe D comparable. Elle est en réalité classée G, avec un audit chiffrant 45 000 € de travaux.",
          "Chaque groupe liste au paperboard TOUS les impacts à intégrer dans la valeur et dans l'argumentaire vendeur : décote de valeur verte, coût des travaux, allongement du délai, effet « investisseur » (interdiction de louer, loyers gelés), impact psychologique.",
          "Chaque groupe propose une FOURCHETTE de valeur réaliste et UN conseil stratégique au vendeur (vendre en l'état à prix ajusté, ou rénover avant mise en vente ?).",
          "Mise en commun : on confronte les deux fourchettes et on vote le meilleur argumentaire pour l'annoncer au vendeur sans le braquer."
        ],
        "animation": [
          "Laissez les groupes débattre : l'objectif est de montrer qu'une passoire ne se décote pas « au feeling » mais par un empilement de facteurs objectivables.",
          "Rappelez le réflexe « petites surfaces » : si c'était un studio ≤ 40 m² avec un DPE d'avant le 1er juillet 2024, vérifier une nouvelle étiquette sur l'observatoire ADEME avant de décoter.",
          "Terminez sur le double discours possible : vendre maintenant en l'état, ou transformer la contrainte en projet (rénovation ciblée qui fait gagner une ou deux classes)."
        ],
        "corrige": [
          "Valeur réaliste de l'ordre de 270 000 à 280 000 € : on part de 310 000 €, on intègre la décote de valeur verte (plus modérée en PACA mais réelle), le poids des 45 000 € de travaux majoré du coût psychologique, et l'allongement du délai de vente.",
          "Effet investisseur : un G subit une double peine (travaux à prévoir + interdiction de louer depuis 2025 et loyers gelés depuis août 2022), ce qui rétrécit la cible d'acquéreurs.",
          "Conseil stratégique souvent gagnant : proposer au vendeur une rénovation ciblée AVANT la mise en vente pour gagner une ou deux classes et réduire fortement la décote, sinon afficher au juste prix dès le départ, preuves et audit à l'appui."
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "R2 : défendre le juste prix face au vendeur qui veut 290 000 €",
        "contexte": "Rendez-vous R2 au domicile d'un vendeur à Martigues. Le négociateur a fait son travail entre R1 et R2 : quatre ventes comparables DVF, une grille d'ajustement et une fourchette de valeur de 245 000 à 255 000 € (prix FAI conseillé 259 000 €). Le vendeur, lui, a en tête 290 000 € : son voisin « affiche » à ce prix, il a refait la cuisine il y a cinq ans et il a acheté au plus haut en 2021. Une agence concurrente lui aurait “promis” 285 000 € pour rentrer le mandat.",
        "roleA": "Le négociateur : il doit présenter la MÉTHODE et les PREUVES avant le prix, expliquer les ajustements de façon factuelle, distinguer FAI et net vendeur, utiliser la double option (259 000 € avec plan de vente vs 290 000 € avec scénario du bien qui se grille), et finir par la stratégie — sans jamais dire « votre prix est trop élevé ».",
        "roleB": "Le vendeur : affectif et un peu méfiant, il oppose le prix du voisin, ses travaux, son prix d'achat de 2021 et la promesse du concurrent à 285 000 €. Il n'est pas de mauvaise foi : il veut juste être rassuré et ne pas « brader ». Il cède si la démonstration est solide et respectueuse.",
        "objectif": "Rentrer le mandat au juste prix (ou avec un point d'étape daté à 4 semaines) sans se griller sur un prix intenable, en faisant adhérer le vendeur à une démonstration et à un plan plutôt qu'à un chiffre.",
        "debrief": [
          "Le négociateur a-t-il bien présenté les comparables AVANT d'annoncer le prix (démontrer avant d'annoncer) ?",
          "A-t-il ramené le débat du prix AFFICHÉ du voisin au prix réellement VENDU, sans attaquer le vendeur ?",
          "A-t-il utilisé la courbe d'intérêt (fenêtre des 3-4 semaines) et le coût chiffré de la surévaluation pour illustrer, plutôt que d'affirmer ?",
          "A-t-il proposé une porte de sortie élégante (prix de départ encadré + point d'étape daté) plutôt que de refuser ou de céder ?",
          "A-t-il conclu sur la STRATÉGIE (diffusion, photos, reporting, délai) et non sur le seul chiffre, en annonçant le net vendeur et pas que le FAI ?"
        ]
      },
      {
        "titre": "Estimer pour partager : la succession entre deux héritiers",
        "contexte": "Deux frère et sœur héritent d'un appartement à Martigues et vous demandent un avis de valeur pour le partage et la déclaration de succession. L'un veut une valeur « basse » pour payer moins de droits et éventuellement racheter la part de l'autre ; l'autre veut une valeur « haute » car il pense vendre. L'ambiance familiale est tendue.",
        "roleA": "Le négociateur : il doit rester strictement neutre et documenté, expliquer qu'il estime la valeur vénale (ni haute ni basse, celle du marché), alerter sur le risque de redressement fiscal en cas de sous-évaluation, et s'appuyer sur des comparables que CHAQUE indivisaire peut vérifier.",
        "roleB": "Les deux héritiers (joués par deux participants) : ils poussent chacun dans leur sens et tentent d'obtenir un avis « arrangé ». Ils se calment si le négociateur reste factuel et pédagogue.",
        "objectif": "Produire un avis de valeur neutre et incontestable qui désamorce le conflit de famille et protège toutes les parties du risque fiscal, sans se laisser entraîner dans l'affect.",
        "debrief": [
          "Le négociateur a-t-il tenu la ligne de la valeur vénale sans « arranger » personne ?",
          "A-t-il expliqué concrètement le risque de redressement (intérêts de retard + pénalités) d'une sous-évaluation ?",
          "A-t-il transformé ses comparables en preuve partagée, acceptable par les deux héritiers, plutôt qu'en opinion ?",
          "A-t-il su rester dans son rôle (avis de valeur) et renvoyer vers le notaire pour le volet fiscal et le partage ?"
        ]
      }
    ],
    "pointsCles": [
      "L'estimation est le socle de la transaction : un prix juste dès le départ conditionne le délai, le prix final et la confiance du vendeur ; tout le reste ne fait que corriger à la marge une estimation réussie ou ratée.",
      "Trois mots, trois réalités : l'avis de valeur est une opinion motivée sans valeur juridique, l'expertise un rapport normé qui engage un expert, l'évaluation fiscale vise la valeur vénale de l'administration. On ne vend jamais un avis de valeur comme une « expertise ».",
      "On annonce toujours au vendeur son NET vendeur, pas seulement le prix FAI ; les honoraires d'agence sont librement fixés mais doivent être affichés TTC (arrêté du 10 janvier 2017).",
      "La méthode par comparaison est la reine en résidentiel ; capitalisation du revenu pour le locatif et les murs commerciaux, coût de remplacement pour l'atypique, bilan promoteur pour le terrain — et on croise toujours au moins deux approches.",
      "On travaille sur des ventes réellement réalisées (DVF, 5 ans, maj avril et octobre, hors Alsace-Moselle et Mayotte), jamais sur les prix affichés des concurrents, et on corrige les estimateurs en ligne par la connaissance terrain.",
      "On estime sur une surface PONDÉRÉE (annexes affectées d'un coefficient, extérieur très valorisé en PACA), mais on communique la surface CARREZ à la vente en copropriété et la Boutin au bail.",
      "Le prix final n'est pas une opinion mais le résultat d'un calcul : on formalise une grille d'ajustement chiffrée (plus-values / moins-values) que le vendeur peut suivre, et on intègre le coût psychologique des travaux (20 000 € réels ≈ 30 000 à 40 000 € de décote).",
      "Le DPE conditionne le prix ET la capacité à louer : une passoire F/G se décote (plus modérément en PACA mais réellement), audit obligatoire depuis 2023 pour F/G, interdiction de louer les G depuis 2025 — et on vérifie la réforme des ≤ 40 m² avant de décoter un studio.",
      "La surévaluation est le piège mortel : elle gâche la fenêtre d'intérêt des 3-4 premières semaines, « grille » le bien et aboutit à une vente plus longue ET moins chère ; sous-évaluer est aussi une faute. On ose le juste prix, preuves à l'appui.",
      "En R2, on démontre avant d'annoncer : méthode et comparables d'abord, prix ensuite, puis la stratégie — le vendeur n'achète pas un prix, il achète un résultat dans le délai qui l'arrange."
    ],
    "planAction": [
      "Dès demain, préparer chaque RDV d'estimation avec un dossier de 3 à 6 comparables DVF du secteur IMPRIMÉS, et ne plus jamais partir estimer les mains vides.",
      "Ne plus donner de prix à chaud en fin de visite ni au téléphone : systématiser la méthode en deux temps R1 (découverte + relevé) puis R2 (avis documenté), et verrouiller le R2 avant de quitter le R1.",
      "Pour chaque bien estimé cette semaine, calculer la surface pondérée et rédiger une grille d'ajustement chiffrée (plus-values / moins-values), puis annoncer au vendeur son NET vendeur et pas seulement le FAI.",
      "Vérifier le DPE de chaque bien, chiffrer l'impact valeur verte des F/G, et contrôler la nouvelle étiquette sur l'observatoire ADEME pour tout studio ≤ 40 m² dont le DPE date d'avant le 1er juillet 2024.",
      "Sur tout mandat « tenté » au-dessus du marché, inscrire dès la signature un point d'étape daté à 4 semaines avec baisse prévue, pour profiter de la courbe d'intérêt et ne pas griller le bien.",
      "Construire d'ici la prochaine réunion un modèle d'avis de valeur commun à l'agence (identité du bien, mention « avis de valeur ≠ expertise », comparables, ajustements, fourchette, FAI, net vendeur, stratégie et délai)."
    ],
    "notesFormateur": [
      "Alternez systématiquement apport court (15 min max) et activité : sur ce module technique, c'est la pratique (calculs, jeux de rôle) qui ancre, pas le discours. Gardez vos apports denses et illustrés de cas Martigues.",
      "Faites manipuler de VRAIS chiffres du secteur : sortez des ventes DVF réelles de Martigues avant la séance et servez-vous-en dans le brise-glace, le défi chrono et les jeux de rôle — le concret du terrain crée l'adhésion.",
      "Tenez le temps avec un chrono visible : annoncez chaque durée, protégez les 20 minutes du jeu de rôle final (c'est le cœur de la séance) et n'empiétez pas dessus si les apports débordent.",
      "Faites participer les plus silencieux via les binômes et les formats « debout/assis » où chacun doit se positionner : personne ne se cache. Valorisez autant la bonne formulation vendeur que le bon chiffre.",
      "Au débriefing des jeux de rôle, faites d'abord parler l'acteur (« qu'est-ce que tu as bien fait, que ferais-tu autrement ? »), puis le groupe, et finissez TOUJOURS par du positif et une phrase modèle réutilisable.",
      "Clôturez en faisant écrire à chacun ses propres engagements du plan d'action sur sa fiche, et prévoyez un point de suivi à la prochaine réunion commerciale : un acquis non réactivé sous 15 jours s'oublie."
    ]
  },
  "negociation": {
    "id": "negociation",
    "sousTitre": "Préparer, ancrer, échanger : conduire la négociation des deux côtés et verrouiller un accord qui tient jusqu'à l'acte",
    "objectifs": [
      "Savoir préparer une négociation avant le premier échange : identifier la motivation, le délai, la ZOPA et la MESORE de chaque partie",
      "Maîtriser les leviers de la négociation gagnant-gagnant (méthode de Harvard) : raisonner intérêts plutôt que positions et créer de la valeur par les variables non financières",
      "Être capable d'utiliser l'ancrage et les biais de prix (effet de dotation, aversion à la perte) avec honnêteté pour faire bouger une position",
      "Maîtriser la règle d'or des concessions : ne jamais concéder sans contrepartie et lâcher par paliers décroissants",
      "Savoir sécuriser juridiquement l'accord : offre d'achat écrite, obligation de transmettre les offres, délais de rétractation et condition suspensive de prêt",
      "Être capable de défendre le prix et les honoraires par la valeur, et de verrouiller l'accord par écrit dès qu'il est obtenu"
    ],
    "agenda": [
      {
        "titre": "Accueil et brise-glace « La négo qui m'a marqué »",
        "duree": "10 min"
      },
      {
        "titre": "Objectifs de la séance et règle du jeu (on apprend en jouant)",
        "duree": "5 min"
      },
      {
        "titre": "Apport 1 — La négociation se gagne avant de commencer : préparation, ZOPA, MESORE, posture de tiers de confiance",
        "duree": "12 min"
      },
      {
        "titre": "Jeu 1 — Quiz-battle en équipes « Les fondamentaux de la négo »",
        "duree": "15 min"
      },
      {
        "titre": "Apport 2 — Gagnant-gagnant, ancrage et psychologie du prix, concessions et contreparties",
        "duree": "13 min"
      },
      {
        "titre": "Jeu 2 — Vrai / Faux juridique chrono (offre d'achat, délais, plus-value, DPE)",
        "duree": "10 min"
      },
      {
        "titre": "Jeu 3 — Brainstorm « La boîte à contreparties » + défi chrono « Ré-ancrage express »",
        "duree": "15 min"
      },
      {
        "titre": "Jeu de rôle — Mise en situation téléphonique côté acquéreur puis côté vendeur",
        "duree": "22 min"
      },
      {
        "titre": "Jeu 4 — Étude de cas « Les deux offres » (offres multiples et surenchère)",
        "duree": "10 min"
      },
      {
        "titre": "Synthèse des points clés, plan d'action individuel et clôture",
        "duree": "8 min"
      }
    ],
    "briseGlace": {
      "titre": "La négo qui m'a marqué (et le moment où ça a basculé)",
      "consignes": [
        "Distribuez un post-it à chaque négociateur. Chacun écrit en 2 minutes une négociation récente marquante — une belle réussite OU une affaire qui lui a échappé — avec trois chiffres : le prix affiché au départ, le prix final (ou « perdu »), et en un mot LE moment où tout a basculé.",
        "Tour de table express : 1 minute par personne. On annonce le bien, les chiffres, et surtout le moment-clé (« le vendeur s'est braqué », « j'ai lâché 10 000 € trop vite », « j'avais oublié de valider le financement »…).",
        "Pendant les prises de parole, l'animateur note au paperboard tous les « moments de bascule » cités et les regroupe en familles : préparation, émotion/ego, concession mal menée, délai, financement, écrit manquant.",
        "Conclusion de l'animateur (1 min) : « Regardez ce tableau — c'est exactement le programme d'aujourd'hui. Presque tout ce qui fait gagner ou perdre une négo est là, et presque tout se joue AVANT le premier échange. »"
      ]
    },
    "jeux": [
      {
        "titre": "Quiz-battle « Les fondamentaux de la négo »",
        "type": "Quiz-battle en équipes",
        "duree": "15 min",
        "consignes": [
          "Constituez 2 à 3 équipes (idéalement 2-3 personnes chacune). Chaque équipe choisit un nom et désigne un porte-parole.",
          "L'animateur lit une question à voix haute avec ses 4 options (A/B/C/D) projetées au support. Les équipes se concertent 20 secondes maximum, puis le porte-parole lève un carton A, B, C ou D (à préparer à l'avance) tous en même temps, au top.",
          "Bonne réponse = 1 point. Bonus de 1 point si l'équipe explique correctement POURQUOI (le « parce que » qui ancre la notion).",
          "Jouez 8 à 10 questions tirées du quiz du module. Tenez le score au paperboard. L'équipe gagnante choisit son café ou repart avec un petit lot symbolique.",
          "Après chaque question, l'animateur développe 30 secondes la notion : c'est le vrai apport pédagogique, le jeu n'est que le déclencheur."
        ],
        "animation": [
          "Variez le rythme : alternez une question « notion » (ZOPA, MESORE, ancrage) et une question « réflexe terrain » (que répond-on à une offre très basse ?).",
          "Ne laissez jamais une mauvaise réponse sans reformulation positive : « Presque — l'idée juste derrière, c'est… ». On ne cherche pas à piéger, on cherche à ancrer.",
          "Gardez les questions juridiques (délai de rétractation, condition de prêt) pour le Vrai/Faux du Jeu 2 afin de ne pas tout dévoiler ici.",
          "Si une équipe domine, donnez-lui des questions plus pointues et offrez un « joker moitié-moitié » à l'équipe en retard pour garder tout le monde dans la course."
        ],
        "corrige": [
          "La négociation réussie se joue d'abord DANS LA PRÉPARATION (motivation, marges, comparables) — environ 80 % se gagne avant le premier échange.",
          "La ZOPA = l'espace entre le prix plancher du vendeur et le plafond de l'acquéreur ; sans recouvrement, aucune technique ne crée l'accord.",
          "La MESORE (BATNA) = la meilleure solution de repli si la négociation échoue ; une MESORE forte donne une position haute.",
          "Raisonner « intérêts plutôt que positions » = chercher le besoin réel (« il me faut 300 000 € net ») derrière la position affichée (« pas en dessous de 320 000 € »).",
          "La règle d'or des concessions = ne jamais concéder sans contrepartie, par paliers DÉCROISSANTS (6 000, puis 2 500, puis 1 000 €).",
          "L'effet d'ancrage = le premier chiffre énoncé fixe le cadre ; face à une offre basse, on RÉ-ANCRE sur les comparables DVF.",
          "L'effet de dotation = le propriétaire surévalue son bien parce qu'il lui appartient ; on le recentre sur les faits.",
          "En 2025, la marge de négociation moyenne nationale tourne autour de 8 à 10 % (davantage sur les maisons), contre environ 5 % historiquement.",
          "Une négociation intégrative = ajouter des variables (délai, meubles, date de libération, travaux) pour créer de la valeur des deux côtés.",
          "Entre deux offres, on privilégie souvent la plus SÛRE et financée, même un peu plus basse, plutôt que la plus haute mais fragile."
        ]
      },
      {
        "titre": "Vrai / Faux juridique chrono",
        "type": "Vrai/Faux (défi chrono)",
        "duree": "10 min",
        "consignes": [
          "Chacun joue individuellement, debout. Côté droit de la pièce = VRAI, côté gauche = FAUX. À chaque affirmation, on se déplace physiquement vers le côté choisi en moins de 5 secondes.",
          "L'animateur énonce une affirmation juridique (voir corrigé). Chrono de 5 secondes, puis révélation et explication de 30 secondes.",
          "Qui se trompe est éliminé (ou prend un gage léger) ; le ou les derniers debout gagnent. Variante sans élimination : 1 point par bonne position.",
          "Enchaînez vite, c'est un jeu d'énergie : 8 à 10 affirmations en moins de 10 minutes, sur l'offre d'achat, les délais et la fiscalité."
        ],
        "animation": [
          "Insistez sur les points qui protègent VRAIMENT le négociateur : interdiction d'encaisser au stade de l'offre, obligation de transmettre toutes les offres, mention manuscrite de renonciation au prêt. Ce sont des fautes professionnelles évitables.",
          "Faites reformuler le « pourquoi » par un participant plutôt que de tout dire vous-même : « Nadia, pourquoi le vendeur n'a-t-il pas de délai de rétractation, lui ? »",
          "Le mouvement physique réveille le groupe après les apports : exploitez-le, gardez le rythme, félicitez les prises de risque même fausses."
        ],
        "corrige": [
          "« Une offre d'achat orale a la même valeur qu'une offre écrite. » → FAUX : l'offre orale n'a aucune valeur probante, on fait toujours rédiger une offre écrite.",
          "« L'agent doit transmettre au vendeur toutes les offres écrites, même celles qu'il juge trop basses. » → VRAI : trier ou dissimuler une offre est une faute professionnelle.",
          "« Au stade de l'offre d'achat, l'agent peut encaisser un acompte de 5 000 € pour bloquer le bien. » → FAUX : aucune somme au stade de l'offre ; le dépôt de garantie se verse chez le notaire, au compromis.",
          "« Le délai de rétractation de l'acquéreur non professionnel est de 10 jours (art. L271-1 du CCH). » → VRAI : 10 jours sans motif, à compter du lendemain de la 1re présentation de la notification.",
          "« Le vendeur bénéficie lui aussi d'un délai de rétractation de 10 jours. » → FAUX : seul l'acquéreur non professionnel en dispose, pas le vendeur.",
          "« La durée minimale légale de la condition suspensive de prêt (loi Scrivener) est d'un mois. » → VRAI : art. L313-41 du Code de la consommation, en pratique 45 à 60 jours.",
          "« Un acquéreur qui achète comptant doit porter une mention manuscrite s'il renonce à la condition de prêt. » → VRAI : sans elle (art. L313-42), la condition de prêt est réputée s'appliquer.",
          "« Sous mandat simple, une offre au prix oblige le vendeur à vendre. » → FAUX : l'agent est chargé de trouver un acquéreur, pas de vendre ; le vendeur reste libre d'accepter ou non.",
          "« La vente de la résidence principale est totalement exonérée de plus-value des particuliers. » → VRAI : la taxation (19 % + 17,2 %) ne concerne que les autres biens.",
          "« Un logement classé G ne peut plus être vendu depuis 2025. » → FAUX : il ne peut plus être mis en LOCATION depuis le 1er janvier 2025, mais il se VEND librement."
        ]
      },
      {
        "titre": "La boîte à contreparties (brainstorm collectif)",
        "type": "Brainstorm",
        "duree": "7 min",
        "consignes": [
          "Posez la règle d'or au tableau : « Jamais de concession sans contrepartie ». Objectif du brainstorm : remplir une « boîte à contreparties » que chacun pourra ressortir sur le terrain.",
          "En 3 minutes, en mode tir de barrage et sans filtre, le groupe lance toutes les variables non financières échangeables dans une négo. L'animateur écrit tout au paperboard, même les idées farfelues.",
          "Puis on structure 2 minutes : on classe les idées en familles (délai, date de libération, meubles/équipements, travaux, conditions suspensives…) et on formule chacune en phrase « si… alors… ».",
          "On termine par 2 minutes : chacun choisit LA contrepartie qu'il utilise le moins aujourd'hui et s'engage à la tester cette semaine."
        ],
        "animation": [
          "Interdiction de critiquer une idée pendant la phase de lancer : la quantité d'abord, le tri ensuite. C'est la règle du brainstorm.",
          "Relancez si ça sèche : « Et sur le CALENDRIER, qu'est-ce qu'on peut offrir ou demander ? Et sur les MEUBLES ? Et sur les CONDITIONS SUSPENSIVES ? »",
          "Reliez systématiquement à la formulation « Si vous signez le compromis sous 8 jours, alors je défends votre offre » : la contrepartie se formule comme un effort négocié, jamais un cadeau."
        ],
        "corrige": [
          "Délai de signature raccourci ou allongé selon le besoin de chacun.",
          "Date de libération : jouissance anticipée ou différée.",
          "Meubles et équipements (cuisine équipée, électroménager, abri de jardin) laissés ou repris.",
          "Petits travaux ou reprise de désordres pris en charge par le vendeur.",
          "Conditions suspensives allégées côté acquéreur (financement déjà bouclé, délai d'obtention du prêt raccourci).",
          "Bascule honoraires charge vendeur / charge acquéreur pour débloquer un accord sur le net vendeur."
        ]
      },
      {
        "titre": "Ré-ancrage express (défi chrono)",
        "type": "Défi chrono",
        "duree": "8 min",
        "consignes": [
          "Jeu en binômes face à face. L'un joue un acquéreur qui balance une ancre basse ou une objection prix sèche ; l'autre a 30 secondes chrono pour accueillir SANS juger puis RÉ-ANCRER sur les faits (comparables DVF).",
          "L'animateur lance une situation (voir corrigé). Top chrono : 30 secondes pour produire une réponse qui (1) accueille l'offre, (2) ramène au marché réel, (3) cherche le mouvement (« jusqu'où pouvez-vous aller si le vendeur fait un geste ? »).",
          "On tourne : 3 à 4 situations, les rôles s'inversent à chaque manche. Les meilleures formulations sont relevées et affichées.",
          "Interdiction absolue de dire « votre offre est ridicule » ou « c'est trop cher / pas assez » : toute réponse qui attaque la personne au lieu du problème fait perdre la manche."
        ],
        "animation": [
          "Le défi est court et nerveux : c'est fait exprès, on entraîne le réflexe, pas le discours parfait. Félicitez la vitesse autant que la justesse.",
          "Faites remarquer les meilleures tournures : « Je transmets, c'est mon devoir — mais regardons d'abord le marché » ; « 6 000 € sur un prêt de 20 ans, c'est quelques euros par mois ».",
          "Rappelez la nuance FOMO honnête : on peut rappeler une rareté RÉELLE (« une autre visite samedi »), jamais inventée — une fausse urgence détruit la confiance dès qu'elle est éventée."
        ],
        "corrige": [
          "Situation 1 — Acquéreur : « J'offre 290 000 € sur votre bien à 329 000 €. » Réponse modèle : « Je transmets votre offre, c'est mon devoir. Avant cela, regardons le marché : des biens comparables se sont vendus 315 à 322 000 € (DVF). Sur quelle base sérieuse pouvez-vous repartir ? »",
          "Situation 2 — Acquéreur : « C'est trop cher. » Réponse modèle : « Trop cher par rapport à quoi ? Voici trois ventes récentes du secteur. Où pouvons-nous nous retrouver ? »",
          "Situation 3 — Acquéreur : « Il y a 40 000 € de travaux. » Réponse modèle : « Qu'avez-vous chiffré précisément ? L'audit énergétique estime la rénovation à 22 000 € ; un équivalent déjà rénové se vend 345 000 €. À 319 000 € + 22 000 €, vous êtes à 341 000 € et vous choisissez vos matériaux. »",
          "Situation 4 — Acquéreur : « Le vendeur ne descendra jamais, inutile de faire une offre. » Réponse modèle : « Laissez-moi le travailler avec votre offre écrite ; sans offre formelle, je n'ai rien à défendre. »"
        ]
      },
      {
        "titre": "Les deux offres (étude de cas)",
        "type": "Étude de cas",
        "duree": "10 min",
        "consignes": [
          "Projetez le cas : T3 à Martigues affiché 215 000 €. Deux offres écrites arrivent le même jour. Offre A : 219 000 €, prêt « à monter » (financement non bouclé), deux conditions suspensives, signature dans 8 à 10 semaines. Offre B : 214 000 € comptant, aucune condition suspensive, signature sous 3 semaines.",
          "En sous-groupes de 2-3, 4 minutes : « Vous êtes le négociateur, le vendeur vous appelle. Que lui présentez-vous et que lui recommandez-vous ? » Chaque groupe note son raisonnement.",
          "Restitution 4 minutes : chaque groupe défend son choix. L'animateur fait émerger les critères au-delà du seul prix (solidité du financement, conditions suspensives, délai, risque d'estimation bancaire).",
          "Débrief 2 minutes : on relie à la loyauté (transmettre les deux offres), au rôle souverain du vendeur et au risque de la surenchère qui bute sur l'estimation de la banque."
        ],
        "animation": [
          "Résistez à la tentation de donner tout de suite la « bonne » réponse : laissez le débat créer la prise de conscience que la plus haute n'est pas la plus sûre.",
          "Introduisez un twist si le groupe tranche trop vite : « Et si le vendeur est muté et doit absolument signer dans 4 semaines ? Et s'il a tout son temps ? » Le meilleur choix dépend du besoin réel du vendeur.",
          "Rappelez la limite déontologique : on peut organiser une consultation loyale (meilleure offre écrite pour une date donnée), jamais inventer une offre ou un acquéreur."
        ],
        "corrige": [
          "On transmet OBLIGATOIREMENT les deux offres écrites au vendeur : c'est une obligation de loyauté, le tri est une faute.",
          "On présente chaque offre avec son contexte, pas seulement son montant : solidité du financement, nombre de conditions suspensives, délai de signature.",
          "L'offre B (214 000 € comptant, sans condition, 3 semaines) est souvent la plus sûre : 5 000 € de moins, mais certaine et rapide ; l'offre A risque de tomber au financement ou de buter sur l'estimation de la banque.",
          "Le choix final appartient au vendeur (souverain, surtout sous mandat simple) ; le rôle du négociateur est de l'éclairer, en expliquant que la plus solide vaut souvent mieux que la plus haute.",
          "Attention à la surenchère : pousser le prix au-delà de la valeur de marché peut faire capoter le compromis à l'estimation bancaire et faire perdre des semaines, parfois le bien."
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "Faire monter une offre basse (côté acquéreur, au téléphone)",
        "contexte": "Un couple a eu un coup de cœur sur un T4 à Martigues affiché 239 000 €. Son financement est validé par la banque jusqu'à 235 000 € (le négociateur le sait, pas l'acquéreur qui l'ignore avoir dit). Le couple vient de transmettre une offre orale à 220 000 €. Les comparables DVF situent les T4 équivalents du secteur entre 232 000 et 240 000 €. Aucune autre visite sérieuse pour l'instant : la rareté réelle existe mais reste modérée. Le but de l'appel : transformer une intention à 220 000 € en offre ÉCRITE ferme autour de 232 000 €.",
        "roleA": "Le négociateur (CENTURY 21) : il doit accueillir l'offre sans juger, ré-ancrer sur les DVF, reconnaître le coup de cœur, relativiser l'écart (« quelques euros par mois sur un prêt de 20 ans »), chercher le mouvement par une contrepartie (signature rapide) et verrouiller une offre écrite le soir même — sans jamais brandir une fausse urgence.",
        "roleB": "L'acquéreur : enthousiaste mais qui joue la montre, répète « 220, c'est mon maximum », évoque un autre bien vu ailleurs (bluff léger) et hésite à s'engager par écrit. Il cédera si le négociateur reconnaît son coup de cœur et lui montre, chiffres à l'appui, qu'à 232 000 € il reste dans un marché juste.",
        "objectif": "Entraîner le réflexe « accueillir → ré-ancrer sur les faits → relativiser l'écart → chercher la contrepartie → verrouiller l'offre écrite » sans céder à l'ancre basse ni mentir sur la rareté.",
        "debrief": [
          "Le négociateur a-t-il ré-ancré sur les DVF AVANT de discuter du chiffre de 220 000 €, ou a-t-il laissé l'ancre basse piloter la conversation ?",
          "A-t-il validé/rappelé le financement et raisonné en coût total (prix + frais de notaire ~7-8 % dans l'ancien) ?",
          "La rareté évoquée était-elle réelle et honnête, ou une fausse urgence qui se retournerait contre lui ?",
          "A-t-il obtenu un engagement CONCRET (offre écrite signée le soir même) ou s'est-il contenté d'un accord oral qui s'évapore ?",
          "Quelle formulation du groupe a le mieux « relativisé l'écart » sans braquer l'acquéreur ? On la garde comme phrase type."
        ]
      },
      {
        "titre": "Présenter une offre et défendre le prix (côté vendeur)",
        "contexte": "Vendeur muté à Lyon, compromis de son futur achat déjà signé (délai = motivation forte). Maison affichée 329 000 € FAI, en vente depuis 7 semaines : 9 visites, 1 seule offre sérieuse et financée à 316 000 € (primo-accédant, accord de principe bancaire validé, signature rapide possible, peu de conditions suspensives). Le vendeur est attaché à sa maison (effet de dotation) et campe mentalement sur « au moins 325 000 € ». Le négociateur veut faire accepter une contre-offre à 320 000 € avec libération immédiate, et viser un accord autour de 319 000 €.",
        "roleA": "Le négociateur : il présente l'offre AVEC son contexte (acquéreur solide, dossier finançable, retours de visites, comparables DVF, délai du vendeur), combat l'effet de dotation en recentrant sur les faits, et propose une contre-offre argumentée avec contrepartie (libération immédiate). Il raisonne « net dans la poche » et rappelle le risque d'une offre haute mais non financée.",
        "roleB": "Le vendeur : attaché à son bien (« j'ai refait la cuisine il y a deux ans »), vexé par une offre « trop basse », tenté d'attendre « mieux », mais pressé par son calendrier lyonnais. Il accepte de bouger quand le négociateur reconnaît son attachement puis lui montre, chiffres et délai à l'appui, qu'une offre finançable sécurise son projet.",
        "objectif": "Entraîner la présentation d'une offre jamais « à sec » (toujours avec contexte et acquéreur), le traitement de l'effet de dotation par les faits, et la contre-proposition avec contrepartie plutôt qu'un « non » sec.",
        "debrief": [
          "Le négociateur a-t-il présenté l'ACQUÉREUR et la solidité du dossier, ou seulement annoncé le chiffre de 316 000 € ?",
          "A-t-il reconnu l'attachement du vendeur (« je comprends ») AVANT de recentrer sur les faits (9 visites, 1 offre, comparables) ?",
          "A-t-il raisonné en net réel pour le vendeur et relié l'accord à son intérêt vrai (sécuriser le calendrier lyonnais) ?",
          "La contre-offre était-elle argumentée et assortie d'une contrepartie (libération immédiate), ou une simple coupe arithmétique de la poire en deux ?",
          "A-t-il évité d'accepter mentalement une hypothétique offre plus haute mais non financée qui ferait perdre des semaines ?"
        ]
      },
      {
        "titre": "Défendre ses honoraires sans les brader",
        "contexte": "Lors de la prise de mandat, un vendeur déclare : « Vos honoraires à 5 %, c'est trop. L'agence d'à côté me fait 3 %, sinon je pars chez elle. » Le bien est correctement estimé et le vendeur est pressé de vendre. Le négociateur sait qu'un mandat exclusif bien défendu se vend souvent mieux et plus vite.",
        "roleA": "Le négociateur : il ne baisse pas d'emblée. Il rappelle ce que les honoraires financent (estimation juste, diffusion, visites qualifiées, négociation, sécurisation juridique, suivi jusqu'à l'acte), explique que son travail fait gagner sur le prix bien plus que le montant des honoraires, et — s'il doit concéder — échange le geste contre un mandat exclusif de trois mois.",
        "roleB": "Le vendeur : sûr de lui, compare uniquement sur le pourcentage, agite la concurrence. Il se laisse convaincre si le négociateur vend une VALEUR de service et transforme la remise en échange (exclusivité, durée, prix de départ réaliste) plutôt qu'en capitulation.",
        "objectif": "Entraîner la défense de la commission par la valeur et non par la remise, et appliquer la règle d'or (jamais de concession sans contrepartie) à ses propres honoraires.",
        "debrief": [
          "Le négociateur a-t-il résisté au réflexe de baisser dès la première objection ?",
          "A-t-il rappelé concrètement ce que financent les honoraires, plutôt que de se justifier sur le seul pourcentage ?",
          "La remise éventuelle a-t-elle été ÉCHANGÉE contre une contrepartie réelle (mandat exclusif, durée, prix réaliste) ?",
          "A-t-il rappelé le cadre légal (honoraires libres mais affichés) sans en faire un argument défensif ?",
          "Le vendeur est-il reparti avec le sentiment d'un partenaire de valeur, ou d'un prestataire interchangeable au rabais ?"
        ]
      }
    ],
    "pointsCles": [
      "80 % d'une négociation se gagne AVANT le premier échange : motivation, délai, valeur de marché (DVF), financement et marges de chaque partie se préparent par écrit.",
      "ZOPA et MESORE sont vos deux boussoles : la zone d'accord possible est l'espace entre le plancher du vendeur et le plafond de l'acquéreur ; la MESORE est ce que fera chaque partie si la négo échoue.",
      "Vous êtes un tiers de confiance : vous défendez l'ACCORD, pas une partie contre l'autre. C'est ce qui vous rend crédible auprès des deux.",
      "Raisonnez intérêts, pas positions : derrière « pas en dessous de 320 000 € » se cache souvent « il me faut 300 000 € net ». Et agrandissez le gâteau (négo intégrative) en jouant sur délai, meubles, travaux, conditions.",
      "L'ancrage pilote la perception : le premier chiffre fixe le cadre. Face à une offre basse, on RÉ-ANCRE aussitôt sur les comparables DVF — en 2025 la marge de négociation tourne autour de 8 à 10 %, davantage sur les maisons.",
      "Jamais de concession sans contrepartie, et toujours par paliers décroissants (6 000, puis 2 500, puis 1 000 €) : on signale qu'on approche de la limite. Gardez une réserve pour le geste final.",
      "Tout passe par l'écrit : l'offre orale ne vaut rien. L'offre d'achat écrite distingue net vendeur et FAI, précise la validité et les conditions ; aucune somme ne s'encaisse au stade de l'offre.",
      "Les délais clés : 10 jours de rétractation pour l'acquéreur non professionnel (art. L271-1 CCH, pas pour le vendeur), condition suspensive de prêt d'un mois minimum (loi Scrivener), 2,5 à 3 mois jusqu'à l'acte.",
      "Les faits font bouger les prix sans bras de fer : comparables DVF, DPE opposable (location interdite en G depuis 2025, F en 2028, E en 2034), audit énergétique et chiffrage réel des travaux.",
      "Un accord gagnant-gagnant TIENT jusqu'à l'acte : on verrouille par écrit immédiatement, on acte les contreparties, et on soigne l'entre-deux compromis → acte, zone à risque."
    ],
    "planAction": [
      "Dès demain, avant chaque négociation, j'écris mes trois chiffres : prix plancher net estimé du vendeur, plafond probable de l'acquéreur et point d'accord visé — je ne négocie plus au ressenti.",
      "Sur ma prochaine offre basse reçue, j'applique le réflexe « accueillir sans juger → ré-ancrer sur les DVF → chercher le mouvement » au lieu de transmettre un chiffre brut ou de me braquer.",
      "Je ne lâche plus un euro sans contrepartie : je prépare ma « boîte à contreparties » (délai, date de libération, meubles, travaux, conditions) et je formule chaque geste en « si… alors… ».",
      "Je verrouille tout accord par une offre d'achat ÉCRITE le jour même, en distinguant net vendeur et FAI, et je cale le rendez-vous notaire sous 10 jours — je ne laisse plus « reposer » un accord oral.",
      "Je présente désormais chaque offre à mon vendeur AVEC son contexte (acquéreur, financement, retours de visites, comparables), jamais un simple montant.",
      "À la prochaine objection sur mes honoraires, je défends ma valeur avant tout et, si je concède, j'échange contre un mandat exclusif ou une durée — jamais une remise sèche."
    ],
    "notesFormateur": [
      "Alternez systématiquement apport court (10-13 min max) et jeu : l'attention décroche au-delà d'un quart d'heure d'exposé. Chaque notion théorique doit être immédiatement rejouée dans une activité.",
      "Faites parler le terrain avant de donner la réponse : partez des cas réels de vos négociateurs (ceux du brise-glace), ils ancreront mieux une leçon qu'ils ont eux-mêmes formulée. Votre rôle est de révéler, pas de réciter.",
      "Gérez le temps avec un chrono visible et tenez-vous-y, surtout sur les jeux de rôle : mieux vaut écourter un débriefing que sauter la synthèse finale et le plan d'action, qui sont le vrai transfert sur le terrain.",
      "Sur les jeux de rôle, cadrez le débrief par du factuel et du bienveillant : on commente le COMPORTEMENT (« tu as ré-ancré avant de parler chiffre »), jamais la personne. Demandez d'abord à l'acteur ce qu'il a ressenti, puis au groupe deux réussites et un axe d'amélioration.",
      "Ancrez les acquis par la répétition active : faites reformuler les points clés PAR les participants en fin de séance (pas par vous), et exigez un engagement écrit concret et daté de chacun — un acquis non appliqué sous 48 h est un acquis perdu.",
      "Soignez l'énergie : utilisez les jeux debout (Vrai/Faux, défi chrono) après les temps assis, variez les binômes et les équipes, et récompensez la prise de risque autant que la bonne réponse pour que personne n'ait peur de se tromper devant les collègues."
    ]
  },
  "mandat": {
    "id": "mandat",
    "sousTitre": "Décrocher l'exclusivité, rédiger un mandat sans faille et sécuriser le dossier : l'atelier qui transforme vos R2 en mandats signés.",
    "objectifs": [
      "Distinguer les différents types de mandats (simple, exclusif, semi-exclusif, AMEPI) et argumenter l'exclusivité comme un engagement de résultat au service du vendeur, jamais comme une faveur.",
      "Maîtriser le déroulé d'un entretien de prise de mandat (R2) qui convertit : créer la valeur (avis de valeur, stratégie) AVANT d'annoncer les honoraires et de proposer l'exclusivité.",
      "Être capable de rédiger un mandat conforme (loi Hoguet, décret de 1972, loi ALUR) sans mention manquante, sans risque de nullité et correctement inscrit au registre.",
      "Vérifier systématiquement la qualité et le pouvoir du mandant (couples, indivision/succession, SCI, démembrement, majeurs protégés) avant toute signature, en repartant du titre de propriété.",
      "Sécuriser le droit de rétractation (14 jours hors établissement) et constituer un dossier vendeur complet et conforme à la LCB-FT (Tracfin).",
      "Traiter les objections à l'exclusivité et closer la signature grâce à des scripts éprouvés, sans pression ni dénigrement des confrères."
    ],
    "agenda": [
      {
        "titre": "Accueil & brise-glace « Mon meilleur / mon pire mandat » (détente + émergence des freins réels)",
        "duree": "10 min"
      },
      {
        "titre": "Apport flash + Quiz-battle « Mandat Master » : types de mandat, cadre Hoguet/ALUR, pourquoi l'exclusivité",
        "duree": "20 min"
      },
      {
        "titre": "Vrai/Faux debout « Le mandat sans faille » : la conformité qui protège votre commission",
        "duree": "12 min"
      },
      {
        "titre": "Apport flash : le R2 qui convertit (l'ordre valeur → stratégie → honoraires) et l'annonce des honoraires",
        "duree": "13 min"
      },
      {
        "titre": "Jeux de rôle en binômes tournants : décrocher le R2 au téléphone, puis closer l'exclusivité",
        "duree": "25 min"
      },
      {
        "titre": "Défi chrono « Qui peut signer ? » : capacité, qualité et pouvoirs du mandant",
        "duree": "12 min"
      },
      {
        "titre": "Étude de cas « Dossier à Martigues : prêt pour le compromis ? » : rétractation, pièces et diagnostics",
        "duree": "13 min"
      },
      {
        "titre": "Synthèse des points-clés & rédaction du plan d'action du lendemain (2-3 engagements par négociateur)",
        "duree": "10 min"
      }
    ],
    "briseGlace": {
      "titre": "Mon meilleur / mon pire mandat",
      "consignes": [
        "Chaque négociateur raconte en 1 minute chrono son meilleur mandat rentré (celui dont il est fier) ET son pire souvenir de prise de mandat (celui qui lui a échappé ou s'est mal passé).",
        "Le formateur note au paperboard les mots-clés qui reviennent (exclusivité perdue, prix trop haut, « je vais réfléchir », décideur absent, dossier incomplet…) : ces freins deviennent le fil rouge de la séance et seront tous traités dans un jeu ou un apport.",
        "Chacun termine par la phrase « Si je pouvais refaire ce mandat, je changerais… » : on ancre d'emblée l'idée que la prise de mandat est une compétence qui se travaille, pas une question de chance."
      ]
    },
    "jeux": [
      {
        "titre": "Mandat Master (quiz-battle en équipes)",
        "type": "Quiz-battle en équipes",
        "duree": "20 min (apport flash inclus)",
        "consignes": [
          "Constituer 2 ou 3 équipes mélangées (juniors + confirmés). Chaque équipe choisit un nom et un porte-parole tournant.",
          "Le formateur projette une question (diapo), la lit à voix haute. 20 secondes de concertation, puis chaque équipe inscrit A, B, C ou D sur une ardoise/feuille et la lève au top.",
          "Barème : 1 point par bonne réponse, bonus +1 si le porte-parole justifie avec l'argument juridique ou commercial exact.",
          "Deux manches de 5 questions : manche 1 « fondamentaux » (types de mandat, Hoguet, durée, carte T), manche 2 « pièges » (semi-exclusif, prix FAI, délai de 12 mois, qui signe une indivision).",
          "L'équipe gagnante choisit l'ordre de passage des jeux de rôle : un petit enjeu ludique qui maintient la tension."
        ],
        "animation": [
          "Projeter un chrono de 20 s visible de tous et tenir le rythme : couper les débats interminables.",
          "Après chaque question, faire reformuler l'explication par une AUTRE équipe que celle qui a répondu : l'ancrage se fait par la répétition active.",
          "Choisir volontairement 2-3 questions sur lesquelles les négociateurs se trompent souvent (prix FAI, délai de 12 mois, semi-exclusif) pour provoquer le déclic.",
          "Relier chaque bonne réponse à une situation de terrain vécue à l'agence."
        ],
        "corrige": [
          "Quel mandat engage l'agence sur un résultat et se vend plus vite et plus près du prix ? → le mandat EXCLUSIF.",
          "Un mandat exclusif se dénonce… → après 3 mois, par LRAR avec 15 jours de préavis (décret du 20 juillet 1972, art. 78).",
          "Sans mandat écrit préalable, l'agent… → ne peut percevoir AUCUNE rémunération (loi Hoguet).",
          "Signé au domicile du vendeur, le droit de rétractation est de… → 14 jours (art. L221-18 C. conso) ; 12 mois sans bordereau d'information.",
          "Prix net vendeur 330 000 € + 5 % (16 500 € TTC) à charge acquéreur → prix FAI = 346 500 € (net vendeur + honoraires).",
          "Bien en indivision (succession) → TOUS les indivisaires signent, ou donnent procuration (art. 815-3 C. civ.).",
          "Formation continue ALUR → 14 h/an, soit 42 h sur 3 ans, condition du renouvellement de la carte T.",
          "Honoraires « à charge acquéreur » → les droits de mutation se calculent sur le PRIX NET VENDEUR.",
          "Dans le semi-exclusif, le vendeur → garde le droit de vendre lui-même à un acquéreur qu'il trouve seul.",
          "Le bon de visite → prouve seulement qu'une visite a eu lieu, n'ouvre AUCUN droit à commission."
        ]
      },
      {
        "titre": "Le mandat sans faille (Vrai/Faux debout)",
        "type": "Vrai/Faux dynamique (en mouvement)",
        "duree": "12 min",
        "consignes": [
          "Désigner un côté de la salle « VRAI », l'autre « FAUX ». À chaque affirmation projetée, chacun se déplace physiquement du côté de sa réponse.",
          "Le formateur lit l'affirmation ; 5 secondes pour se positionner ; il interroge 1 ou 2 personnes de chaque camp pour justifier AVANT de donner la réponse.",
          "Enchaîner 8 à 10 affirmations sur la conformité (Hoguet, ALUR, registre, exemplaires, durée, avenant).",
          "Celui qui s'est trompé explique, avec l'aide du groupe, pourquoi l'affirmation est fausse : on transforme l'erreur en point d'ancrage."
        ],
        "animation": [
          "Le mouvement physique réveille le groupe après l'apport : ne pas le faire assis.",
          "Garder un rythme rapide mais s'arrêter sur les 2-3 affirmations les plus contre-intuitives (antidatage, commission due à la signature, oral vs avenant).",
          "Valoriser ceux qui se trompent courageusement : « parfait, c'est exactement le piège qu'on voulait lever ensemble. »"
        ],
        "corrige": [
          "« Un bon de visite signé suffit à toucher la commission. » → FAUX : seul le mandat écrit du vendeur fonde la rémunération.",
          "« Un mandat peut être conclu pour une durée illimitée. » → FAUX : la durée déterminée est obligatoire.",
          "« Le numéro de mandat doit figurer sur l'exemplaire remis au mandant. » → VRAI (registre coté, numéroté sans discontinuité).",
          "« On peut faire visiter le bien avant d'avoir le mandat signé. » → FAUX : le mandat écrit doit précéder toute démarche (Hoguet).",
          "« Le mandat est établi en autant d'originaux que de parties, un exemplaire remis immédiatement au mandant. » → VRAI.",
          "« Antidater un mandat est toléré si la vente est réelle. » → FAUX : c'est un faux, interdiction absolue.",
          "« Modifier le prix se fait à l'oral avec l'accord du vendeur. » → FAUX : avenant écrit signé obligatoire.",
          "« La commission est due dès la signature du mandat. » → FAUX : elle n'est acquise qu'à la vente réalisée.",
          "« Le mandat exclusif doit prévoir des modalités de reddition de comptes. » → VRAI (loi ALUR).",
          "« Exercer sans carte T ou sans mandat écrit expose à 6 mois de prison et 7 500 € d'amende. » → VRAI (art. 16 loi Hoguet)."
        ]
      },
      {
        "titre": "Qui peut signer ? (défi chrono en équipes)",
        "type": "Défi chrono en équipes (cartes-situations)",
        "duree": "12 min",
        "consignes": [
          "Préparer 8 cartes « situation » (une par cas ci-dessous), les battre et les poser face cachée au centre.",
          "Chaque équipe tire une carte à tour de rôle : 60 secondes pour répondre à « Qui doit signer le mandat ? » ET « Quel justificatif récupérer ? ».",
          "Barème : 2 points si la réponse est complète (qui signe + justificatif), 1 point si partielle, 0 si fausse. Les autres équipes peuvent « voler » le point en cas d'erreur.",
          "Enchaîner jusqu'à épuisement des cartes ; l'équipe avec le plus de points remporte le défi."
        ],
        "animation": [
          "Chrono visible et strict (60 s) : c'est le temps réel qu'on a en rendez-vous pour flairer un problème de pouvoir.",
          "Marteler à chaque carte le réflexe « je repars toujours du titre de propriété ».",
          "Rebondir sur les cas réellement vécus par les négociateurs (succession bloquée, SCI familiale, logement de famille)."
        ],
        "corrige": [
          "Couple marié sans contrat, bien acquis pendant le mariage → les DEUX époux (bien commun, art. 1424 C. civ.). Justif. : livret de famille / contrat de mariage + titre.",
          "Maison héritée par 3 enfants, partage non fait → les 3 héritiers (indivision successorale, unanimité art. 815-3) ou procurations. Justif. : attestation notariée / dévolution.",
          "Bien détenu par une SCI → le gérant, sous réserve des statuts (PV d'AG des associés si exigé). Justif. : Kbis récent + statuts + éventuel PV.",
          "Appartement en usufruit (parent) / nue-propriété (enfants) → usufruitier ET nus-propriétaires. Justif. : titre mentionnant le démembrement.",
          "Vendeur sous tutelle → autorisation du juge des contentieux de la protection (acte de disposition) ; en curatelle, le majeur signe assisté de son curateur.",
          "Époux vendant seul un bien propre servant de logement de la famille → accord de l'autre époux obligatoire (art. 215 al. 3 C. civ.).",
          "Bien occupé par un locataire, vente « libre » → le ou les propriétaires signent, mais attention au droit de préemption du locataire (congé pour vendre, loi du 6 juillet 1989).",
          "Un seul indivisaire qui « se fait fort » des autres → mandat fragile : exiger la signature de tous ou des procurations écrites."
        ]
      },
      {
        "titre": "Le mur d'objections « Je préfère mettre plusieurs agences » (brainstorm & tri collectif)",
        "type": "Brainstorm et construction collective (mur de post-it)",
        "duree": "15 min (module modulable, à insérer si le temps le permet ou en séance de suivi)",
        "consignes": [
          "Phase 1 (5 min) : en binômes, lister sur des post-it TOUTES les objections entendues contre l'exclusivité (« plus d'agences = plus de chances », « je ne veux pas m'engager », « et si vous ne faites rien ? », « mon voisin l'a mise partout »…). Un post-it = une objection.",
          "Phase 2 (5 min) : coller les post-it au paperboard, regrouper par familles (peur de l'engagement, croyance « plus = mieux », méfiance envers l'agent, honoraires).",
          "Phase 3 (5 min) : pour chaque famille, le groupe construit LA meilleure réponse (mêmes acquéreurs vus 3 fois, banalisation/grillage, engagement écrit, filet des 3 mois, AMEPI). Le formateur fige la réponse « officielle » de l'agence.",
          "Livrable : une fiche « top 5 des objections / top 5 des réponses » que chacun photographie et emporte."
        ],
        "animation": [
          "Ne jamais juger une objection : plus le mur est rempli, plus la séance est utile.",
          "Faire formuler les réponses à voix haute, en « je » (comme face au vendeur), pour travailler le ton autant que le fond.",
          "Rappeler le principe directeur : on défend l'exclusivité « pour LUI » (sa vente), jamais « pour moi » (l'agent)."
        ],
        "corrige": [
          "« Plus d'agences = plus d'acheteurs » → « Ce sont les mêmes acquéreurs du secteur qui verront votre bien 3 fois, à 3 prix parfois différents : il paraît partout, donc suspect. »",
          "« Je ne veux pas m'engager » → « L'exclusivité vous engage 3 mois ; passé ce délai, si je n'ai pas tenu mes promesses, vous êtes libre (LRAR, 15 jours). Le risque est pour moi, pas pour vous. »",
          "« Et si vous ne faites rien ? » → « Je m'engage par écrit : reportage photo, home-staging, diffusion premium, compte rendu après chaque visite et bilan de commercialisation à 4 semaines. »"
        ]
      },
      {
        "titre": "Dossier à Martigues : prêt pour le compromis ? (étude de cas en sous-groupes)",
        "type": "Étude de cas en sous-groupes",
        "duree": "13 min",
        "consignes": [
          "Distribuer la fiche d'un dossier fictif : T3 à Martigues, 228 000 €, mandat exclusif signé AU DOMICILE il y a 2 jours ; vendeurs = couple marié sans contrat ; immeuble de 1985 ; copropriété.",
          "Mission des sous-groupes (8 min) : lister (1) ce qui est conforme/non conforme dans la prise de mandat, (2) le risque lié au lieu de signature, (3) la liste complète des pièces et diagnostics à récupérer avant le compromis.",
          "Restitution (5 min) : chaque groupe présente 1 point, le formateur complète avec la check-list officielle.",
          "Variante avancée : glisser une « bombe » dans l'énoncé (un seul époux présent à la signature) pour tester la vigilance sur la qualité du mandant."
        ],
        "animation": [
          "Laisser les groupes chercher avant de donner la réponse : l'effort de rappel ancre mieux que l'exposé.",
          "Relier chaque pièce manquante à une conséquence concrète (« sans PV d'AG, le notaire bloque le compromis »).",
          "Faire le pont avec l'application de l'agence : dossier client (pièces manquantes), fiche Tracfin, fractionnement IA du PDF."
        ],
        "corrige": [
          "Lieu de signature : hors établissement → 14 jours de rétractation ; vérifier la remise du bordereau (sinon 12 mois) et la demande expresse de démarrage recueillie avant toute diffusion.",
          "Qui signe : couple marié, bien commun → les DEUX époux (art. 1424) ; si un seul a signé, mandat fragile à régulariser.",
          "Diagnostics (bâti 1985, copro) : DPE (opposable, classe + GES dès l'annonce, 10 ans), amiante (avant 1997, illimité si négatif), électricité & gaz si installation > 15 ans (3 ans chacun), ERP (6 mois), termites si arrêté préfectoral PACA (6 mois), loi Carrez (copro). Audit énergétique si F/G (depuis le 1er avril 2023) ou E (depuis le 1er janvier 2025).",
          "Copropriété : règlement + état descriptif de division, PV des 3 dernières AG, montant des charges, carnet d'entretien, pré-état daté, fonds de travaux.",
          "LCB-FT : KYC dès l'entrée en relation, fiche Tracfin générée, pièces de vigilance conservées 5 ans."
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "Décrocher le R2 au téléphone (avec tous les décideurs présents)",
        "contexte": "Un vendeur rappelle après une estimation en ligne. Il veut « juste une estimation rapide » et précise que sa femme n'est pas souvent disponible. Appel téléphonique, 3 minutes.",
        "roleA": "Le négociateur : il doit obtenir un rendez-vous dédié (R2) à une DATE précise, avec les DEUX conjoints présents, et préparer le vendeur à sortir ses documents (titre, diagnostics éventuels). Il valorise le rendez-vous au lieu de le brader en « simple estimation ».",
        "roleB": "Le vendeur « pressé » : pense qu'une estimation suffit, minimise la présence de sa femme (« je lui transmettrai »), veut aller vite et surtout ne pas s'engager.",
        "objectif": "S'entraîner à verrouiller la présence de tous les décideurs et à poser un rendez-vous daté, plutôt qu'un vague « je vous rappelle » qui tue le R2.",
        "debrief": [
          "Le négociateur a-t-il obtenu une DATE précise ET la présence des deux conjoints ?",
          "A-t-il expliqué POURQUOI les deux doivent être là (« pour qu'on puisse décider ensemble ») sans braquer le vendeur ?",
          "A-t-il évité le piège du « je passe juste faire une estimation » qui dévalorise le R2 ?",
          "Son ton était-il assuré et au service du vendeur, ou quémandeur ?"
        ]
      },
      {
        "titre": "Closer l'exclusivité au R2 (objection « plusieurs agences »)",
        "contexte": "R2 au domicile, maison de ville à Martigues estimée 345 000 € (le vendeur espérait 380 000 €). L'avis de valeur et la stratégie ont déjà été présentés. Le vendeur lâche : « C'est intéressant, mais je préfère vous mettre en concurrence avec deux autres agences. »",
        "roleA": "Le négociateur : traite l'objection « plusieurs agences », propose l'exclusivité comme un engagement de résultat avec contrepartie écrite (plan daté, reporting, bilan à 4 semaines, filet des 3 mois), puis close la signature ou verrouille la suite datée.",
        "roleB": "Le vendeur : attaché à l'idée « plus d'agences = plus de chances », un peu méfiant, pas prêt à « s'engager » mais vendable dès que la peur est levée.",
        "objectif": "Transformer l'objection concurrence en signature d'exclusivité en démontrant la valeur « pour le vendeur », pas « pour l'agent ».",
        "debrief": [
          "A-t-il démonté le réflexe « plus d'agences = plus d'acheteurs » (mêmes acquéreurs, banalisation, grillage) ?",
          "A-t-il proposé une contrepartie ÉCRITE (plan d'action daté, compte rendu après chaque visite, bilan à 4 semaines, filet des 3 mois) ?",
          "A-t-il utilisé une technique de closing (alternative « 3 ou 4 mois ? », dernière objection) sans forcer ni mettre la pression ?",
          "A-t-il dénigré les confrères (à proscrire, contraire à la déontologie) ou vendu SA valeur ?"
        ]
      },
      {
        "titre": "La succession qui veut aller vite",
        "contexte": "Un des trois enfants héritiers d'une maison à Martigues vous reçoit seul et veut signer « pour tout le monde », pressé de vendre pour régler la succession. Ses deux frères vivent loin et « sont d'accord ».",
        "roleA": "Le négociateur : explique pédagogiquement qu'il faut la signature des trois (ou leurs procurations) sans décourager, et propose une solution concrète (R2 à trois, visio, récupération de 2 procurations) pour ne pas perdre le mandat ni l'élan.",
        "roleB": "L'héritier pressé : « je m'occupe de mes frères, on peut signer là », agacé par la « paperasse » et tenté d'aller voir une autre agence si on le freine.",
        "objectif": "Sécuriser la qualité du mandant (indivision successorale, unanimité art. 815-3) tout en préservant la relation et la dynamique de vente.",
        "debrief": [
          "A-t-il expliqué le risque (mandat inefficace, vente impossible) sans jargon décourageant ?",
          "A-t-il proposé une solution opérationnelle (procurations, R2 à trois, visio) plutôt qu'un simple « non » ?",
          "A-t-il gardé la main sur le dossier en fixant une prochaine étape datée ?",
          "A-t-il pensé à récupérer l'attestation notariée / la dévolution pour vérifier qui sont réellement les héritiers ?"
        ]
      }
    ],
    "pointsCles": [
      "Pas de mandat écrit préalable = aucune commission, même si la vente se fait grâce à vous (loi Hoguet). Le bon de visite ne remplace jamais le mandat.",
      "L'exclusivité n'est pas une faveur qu'on demande, c'est un engagement de résultat qu'on offre : elle se vend « pour le vendeur » et s'accompagne toujours d'une contrepartie écrite.",
      "Dans le R2, on crée la valeur AVANT de parler argent : avis de valeur (preuves DVF) → stratégie de commercialisation → honoraires → exclusivité → signature.",
      "Un mandat conforme = durée déterminée, mentions obligatoires, numéro de registre reporté sur l'exemplaire remis au mandant, autant d'originaux que de parties. Une mention manquante = nullité possible, donc commission perdue.",
      "Toujours vérifier QUI peut signer en repartant du titre de propriété : couples (art. 1424 et 215), indivision/succession (unanimité, art. 815-3), SCI (gérant + statuts), démembrement (usufruitier + nus-propriétaires), majeurs protégés (juge).",
      "Signé hors établissement (domicile) = 14 jours de rétractation ; sans bordereau d'information, le délai passe à 12 mois. Pour diffuser plus tôt, recueillir l'accord exprès sur support durable.",
      "Honoraires libres mais affichés en TTC (vitrine, site, annonces) ; « à charge acquéreur » = droits de mutation calculés sur le prix net vendeur (argument acheteur). Prix FAI = prix net vendeur + honoraires.",
      "Dès l'entrée en relation : KYC / LCB-FT (fiche Tracfin), pièces de vigilance conservées 5 ans. Constituer le dossier vendeur complet dès le jour du mandat (titre, taxe foncière, DDT, copropriété).",
      "Le mandat exclusif impose la reddition de comptes (loi ALUR) : un reporting régulier fidélise le vendeur, prépare en douceur l'ajustement de prix et protège de la résiliation à 3 mois.",
      "Déontologie et devoir de conseil : ne jamais survendre un prix, refuser toute consigne discriminatoire (délit), garder confidentiel le motif de vente et respecter le RGPD pour les données et les photos."
    ],
    "planAction": [
      "Préparer dès demain ma « pochette de prise de mandat » prête à l'emploi : avis de valeur avec 3 à 5 comparables DVF, plan marketing écrit, engagement de reporting, mandat pré-rempli, preuves (panneaux Vendu, avis Google), 2 stylos et 2 exemplaires papier.",
      "Sur mon prochain appel de prise de rendez-vous, verrouiller systématiquement la présence de TOUS les décideurs et poser une DATE de R2 précise (jamais « je vous rappelle »).",
      "À mon prochain R2, dérouler l'ordre qui convertit (valeur → stratégie → honoraires → exclusivité → signature) et proposer l'exclusivité avec une contrepartie écrite (plan daté, reporting, bilan à 4 semaines).",
      "Avant chaque signature, dérouler ma check-list « Qui peut signer ? » à partir du titre de propriété et ne signer qu'avec tous les titulaires de droits (ou leurs procurations).",
      "Pour tout mandat signé hors établissement, remettre le bordereau de rétractation, informer par écrit, et recueillir la demande expresse de démarrage avant toute diffusion dans les 14 jours.",
      "Générer la fiche Tracfin et compléter le dossier vendeur (pièces manquantes) dès le jour du mandat dans l'application, puis programmer mon premier compte rendu hebdomadaire."
    ],
    "notesFormateur": [
      "Gérer le temps : annoncer l'agenda au départ, afficher un chrono pour les jeux et tenir les durées. Mieux vaut couper un débat et le renvoyer en fin de séance que déborder sur la pratique, qui est le cœur de l'apprentissage.",
      "Faire participer tout le monde : alterner binômes, équipes et prises de parole individuelles, interroger nommément les plus discrets sur les cas concrets, et valoriser les erreurs (« c'est exactement le piège qu'on voulait lever ») pour libérer la parole.",
      "Ancrer les acquis par le rappel actif : après chaque apport, faire reformuler les messages-clés par les négociateurs plutôt que de les répéter soi-même. Le quiz-battle et les jeux de rôle servent cet ancrage, pas seulement l'ambiance.",
      "Rendre tout concret et local : ramener chaque notion à un cas de Martigues / étang de Berre, à l'application de l'agence (dossier client, fiche Tracfin, bilan de commercialisation) et à des chiffres réels (barème, prix FAI, délais légaux).",
      "Soigner l'ouverture et la clôture : le brise-glace détend et fait émerger les freins réels ; la synthèse et le plan d'action du lendemain transforment la séance en comportements de terrain. Faire écrire à chacun ses 2-3 engagements avant de quitter la salle.",
      "Préparer le matériel la veille : support PowerPoint avec le chrono et les questions, ardoises/feuilles pour le quiz, cartes « Qui peut signer ? » imprimées, post-it et paperboard, fiches d'étude de cas et scripts de jeux de rôle en double exemplaire."
    ]
  },
  "vente-elite": {
    "id": "vente-elite",
    "sousTitre": "Transformer chaque argument en adhésion : émotion, méthode et éthique au service de vos ventes à Martigues",
    "objectifs": [
      "Comprendre et appliquer la séquence « émotion d'abord, preuve ensuite » pour faire naître le désir avant de rassurer la raison du client.",
      "Maîtriser la méthode CAP (Caractéristique → Avantage → Preuve) et savoir la brancher sur le bon levier SONCASE(E) de chaque client.",
      "Être capable de construire et dérouler un argumentaire de valeur hiérarchisé : ouvrir fort, finir plus fort, garder une cartouche en réserve (BPIIHQS).",
      "Savoir activer les 6 + 1 principes de persuasion de Cialdini avec éthique, sans jamais basculer dans la manipulation.",
      "Renforcer sa congruence (voix, regard, posture, silence) pour rendre chaque argument réellement crédible.",
      "Persuader dans le strict respect du cadre légal 2024-2026 : loi Hoguet, DPE opposable, pratiques commerciales trompeuses, dol."
    ],
    "agenda": [
      {
        "titre": "Accueil & brise-glace « Le dernier coup de cœur »",
        "duree": "10 min"
      },
      {
        "titre": "Apport 1 : Vendre de l'émotion, pas des caractéristiques (« émotion d'abord, preuve ensuite ») + démo du formateur",
        "duree": "8 min"
      },
      {
        "titre": "Jeu 1 : Atelier « Traduis-moi ça » — transformer une caractéristique en image mentale puis en CAP",
        "duree": "18 min"
      },
      {
        "titre": "Apport 2 : La méthode CAP, les leviers SONCASE(E) et les 7 règles d'or (BPIIHQS)",
        "duree": "12 min"
      },
      {
        "titre": "Jeu 2 : Quiz-battle en équipes « Les réflexes du vendeur d'élite »",
        "duree": "12 min"
      },
      {
        "titre": "Pause express",
        "duree": "5 min"
      },
      {
        "titre": "Apport 3 : Cialdini 6 + 1, storytelling et congruence (voix & non-verbal)",
        "duree": "10 min"
      },
      {
        "titre": "Jeu 3 : Vrai / Faux « Persuasion ou manipulation ? » — cadre légal & déontologie",
        "duree": "10 min"
      },
      {
        "titre": "Jeux de rôle : « La visite qui fait basculer » (1 à 2 mises en situation jouées devant le groupe)",
        "duree": "22 min"
      },
      {
        "titre": "Jeu 4 : Brainstorm « Le mur des preuves » — constituer notre capital de preuve sociale local",
        "duree": "8 min"
      },
      {
        "titre": "Synthèse, points clés à retenir & plan d'action du lendemain (engagement écrit)",
        "duree": "10 min"
      }
    ],
    "briseGlace": {
      "titre": "Le dernier coup de cœur (émotion vs fiche technique)",
      "consignes": [
        "Chaque négociateur repense à sa dernière vente « coup de cœur », celle où l'acheteur a eu le déclic. On garde le bien en tête.",
        "Tour de table : en 30 secondes chrono, chacun présente ce bien UNIQUEMENT en fiche technique (surface, nombre de pièces, exposition, prix). Ton neutre, comme une annonce.",
        "Puis, en 30 secondes, le même négociateur re-présente le même bien en « projet de vie » : il fait ressentir, il projette (« imaginez… »), il raconte. Interdiction de citer un seul chiffre.",
        "Après chaque passage, le groupe lève la main pour la version qui « donne envie ». Le formateur note au tableau le score Fiche technique / Projet de vie.",
        "Débrief en 1 phrase : « On vient tous de sentir la différence — c'est exactement ce qu'on va travailler aujourd'hui : on vend un projet de vie, pas des mètres carrés. »"
      ]
    },
    "jeux": [
      {
        "titre": "Atelier « Traduis-moi ça »",
        "type": "Défi chrono / atelier de reformulation en équipes",
        "duree": "18 min",
        "consignes": [
          "Constituer 2 ou 3 binômes/trinômes. Distribuer à chaque équipe 4 cartes-caractéristiques tirées de biens RÉELS du portefeuille de l'agence (ex. : « exposition plein sud », « cuisine ouverte 25 m² », « à 5 min du port », « pompe à chaleur installée en 2022, DPE C »).",
          "Manche 1 (6 min) — L'ÉMOTION : pour chaque carte, l'équipe écrit une phrase de projection sensorielle au présent et au « vous », sans aucun chiffre (ex. : « vous prendrez votre café au soleil toute l'année, même en plein hiver »).",
          "Manche 2 (7 min) — LE CAP COMPLET : pour 2 cartes au choix, l'équipe construit un argument CAP avec la phrase de liaison obligatoire « … ce qui veut dire pour vous que… » et une preuve concrète (facture, DPE, comparable DVF, attestation).",
          "Restitution (5 min) : chaque équipe lit à voix haute sa meilleure transformation ÉMOTION et son meilleur CAP ; le groupe vote la formule la plus percutante. Chrono visible, ambiance tonique."
        ],
        "animation": [
          "Préparez les cartes AVANT la séance avec de vrais biens du mandat en cours : le concret accroche dix fois plus que des exemples génériques.",
          "Circulez entre les équipes, relancez celles qui restent sur la caractéristique : « D'accord, et concrètement, qu'est-ce que ça change pour le client ? »",
          "Traquez la phrase de liaison : tant qu'elle n'est pas prononcée, l'avantage n'est pas vraiment traduit. C'est le cœur de l'exercice.",
          "Valorisez les mots sensoriels (lumineux, cocon, au calme, sans vis-à-vis) et bannissez le jargon froid (surface, prestations, configuration)."
        ],
        "corrige": [
          "« Exposition plein sud » → émotion : « vous prendrez votre café au soleil toute l'année, même en hiver ».",
          "« Cuisine ouverte 25 m² » → émotion : « vous cuisinez tout en restant avec vos invités, personne n'est isolé dans son coin ».",
          "« À 5 min du port de Martigues » → émotion : « l'apéritif les pieds dans l'eau le vendredi soir, sans reprendre la voiture ».",
          "CAP modèle : « Pompe à chaleur installée en 2022 (C), ce qui veut dire pour vous des factures nettement réduites et un vrai confort été comme hiver (A), et voici les trois dernières factures ainsi que le DPE classe B qui le prouvent (P). »"
        ]
      },
      {
        "titre": "Quiz-battle « Les réflexes du vendeur d'élite »",
        "type": "Quiz-battle en équipes (buzzer)",
        "duree": "12 min",
        "consignes": [
          "Former 2 équipes. Le formateur lit une question à choix multiple ; la première équipe qui lève la main (ou frappe sur la table en guise de buzzer) répond. Bonne réponse = 2 points ; mauvaise = la main passe à l'équipe adverse pour 1 point.",
          "Enchaîner 8 à 10 questions tirées du quiz du module (séquence émotion/raison, méthode CAP et liaison, SONCASE-E, silence, preuve sociale, Cialdini, congruence, cadre légal).",
          "Règle bonus « justification » : pour empocher le point, l'équipe doit non seulement donner la bonne option mais aussi la justifier en une phrase. Pas de justification = pas de point.",
          "Tenir le score au tableau. L'équipe gagnante choisit l'ordre de passage des jeux de rôle qui suivent (petit enjeu ludique)."
        ],
        "animation": [
          "Rythmez : une question doit se jouer en moins d'une minute, sinon l'énergie retombe. Ayez vos questions imprimées, numérotées.",
          "Après chaque bonne réponse, reformulez la règle en une phrase-clé et faites-la noter : c'est le moment d'ancrage pédagogique.",
          "Sur les questions « piège » (fausse rareté, dol), prenez 20 secondes de plus pour insister : ce sont des réflexes métier ET juridiques.",
          "Gérez l'équité : alternez qui parle dans chaque équipe pour qu'aucun négociateur ne reste spectateur."
        ],
        "corrige": [
          "Dans la séquence de persuasion, on fait appel EN PREMIER à l'émotion, puis on justifie avec la raison.",
          "Dans CAP, l'Avantage doit toujours être formulé comme un bénéfice concret pour CE client ; la liaison « ce qui veut dire pour vous que… » fait le lien.",
          "Le E de SONCASE(E) = Écologie (DPE, charges, calendrier des passoires thermiques) ; la P de CAP = Preuve.",
          "Après un argument fort ou une question d'engagement : on se TAIT et on laisse le silence agir.",
          "Le 7e levier ajouté par Cialdini est l'Unité (le sentiment d'appartenir au même groupe, le « nous »).",
          "Annoncer une fausse rareté ou taire sciemment un défaut déterminant peut constituer une pratique commerciale trompeuse ou un dol, sanctionné par la loi (vente annulable, dommages-intérêts).",
          "Effet de récence : on termine son argumentation par son argument le plus fort, car c'est ce qui reste le plus en tête."
        ]
      },
      {
        "titre": "Vrai / Faux « Persuasion ou manipulation ? »",
        "type": "Vrai / Faux dynamique (debout / assis)",
        "duree": "10 min",
        "consignes": [
          "Tout le monde se lève. Le formateur énonce une affirmation métier/juridique. Les participants restent DEBOUT s'ils pensent « Vrai / c'est de la persuasion éthique », s'ASSOIENT s'ils pensent « Faux / c'est de la manipulation ou c'est illégal ».",
          "Après chaque position, interroger une personne « debout » et une « assise » pour justifier, puis donner la réponse et la règle.",
          "Enchaîner 6 à 8 affirmations (voir corrigé). Mélanger du vrai franc, du faux franc et un ou deux cas gris pour faire débattre.",
          "Clore sur la règle d'or : « Est-ce vrai ? Puis-je le prouver ? Le client ne le regrettera-t-il pas ? » — trois oui = persuasion, un seul non = manipulation."
        ],
        "animation": [
          "Le format debout/assis réveille le groupe après la pause et rend visible qui hésite : concentrez l'explication sur les cas où le groupe s'est divisé.",
          "Ne jugez jamais une mauvaise réponse : « c'est justement le piège, voilà pourquoi… ». On veut qu'ils osent se tromper ici plutôt que sur le terrain.",
          "Reliez systématiquement au risque réel : réputation, avis Google négatifs, recours, nullité de la vente. L'éthique est aussi un calcul de pro.",
          "Rappelez que ces techniques sont au service de l'intérêt du client : un manager qui tolère la manipulation fabrique des litiges."
        ],
        "corrige": [
          "« Offrir une étude de marché argumentée avant de demander le mandat » → VRAI (réciprocité, persuasion éthique).",
          "« Dire ‘j'ai déjà deux acquéreurs sur ce bien' alors que c'est faux pour accélérer » → FAUX (fausse rareté = pratique commerciale trompeuse).",
          "« Annoncer ‘DPE classe C' sans vérifier le diagnostic » → FAUX / risqué (le DPE est opposable depuis le 01/07/2021 : l'acquéreur peut se retourner).",
          "« Taire un bar de nuit à 300 m connu, pour ne pas casser la vente » → FAUX (réticence dolosive : vente annulable, dommages-intérêts).",
          "« Afficher son expertise du secteur avec des chiffres précis et datés » → VRAI (autorité, Cialdini).",
          "« Promettre à l'acquéreur que son prêt ‘sera' accordé » → FAUX (ne jamais promettre ce qui ne dépend pas de vous ; formuler en probabilités étayées).",
          "« Montrer de vrais avis Google et ses ventes récentes dans la rue » → VRAI (preuve sociale réelle)."
        ]
      },
      {
        "titre": "Brainstorm « Le mur des preuves »",
        "type": "Brainstorm collectif / production d'outils",
        "duree": "8 min",
        "consignes": [
          "Sur un paperboard divisé en 4 colonnes : Ventes récentes par quartier | Avis & témoignages clients | Comparables DVF datés | Chiffres de l'agence (délai moyen, % vendu au prix).",
          "En 5 minutes, le groupe remplit le mur à voix haute avec de VRAIES munitions de l'agence (ventes 2025-2026 sur Martigues : Jonquières, Croix-Sainte, centre, etc.).",
          "Chaque négociateur repart avec la consigne de photographier le mur et de recopier dans son téléphone/classeur les 3 preuves les plus fortes et les plus locales.",
          "Terminer en désignant 1 responsable « preuve sociale » qui tiendra à jour le tableau des ventes par quartier pour toute l'équipe."
        ],
        "animation": [
          "Préférez toujours le précis au vague : « 12 ventes à Martigues sur l'année » ou « vendu rue de la Résistance en mars, 3 150 €/m² » battent « le secteur est demandé ».",
          "Insistez : une preuve datée, locale et chiffrée vaut dix affirmations. Chassez les formules floues du type « on est les meilleurs ».",
          "Rappelez la règle légale : aucune preuve inventée. Le mur ne contient que du réel et du vérifiable, c'est aussi une protection juridique.",
          "Faites de ce mur un outil vivant : il nourrira les prochains R0 et visites, ce n'est pas qu'un exercice de séance."
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "La visite qui fait basculer",
        "contexte": "Maison à Martigues (quartier de Jonquières), affichée 380 000 €. Couple avec deux enfants en visite. Toiture refaite en 2023, DPE classe C, pompe à chaleur récente, diagnostics à jour, jardin arboré. Levier dominant du couple : Sécurité (quartier calme, zéro travaux) ; levier secondaire : Écologie (charges, pérennité à la location/revente). Objectif de la séquence : créer l'adhésion, pas forcer la signature (le closing est traité dans un autre module).",
        "roleA": "Le négociateur. Il doit dérouler la séquence complète : 1) créer l'émotion par la projection (« imaginez… samedi matin… ») ; 2) raconter l'histoire du bien (famille qui y a vécu 15 ans, chaque arbre planté à une naissance) ; 3) argumenter en CAP sur la Sécurité (toiture 2023 + diagnostics → aucun gros travaux → factures/dossier) ; 4) renforcer en CAP sur l'Écologie (DPE C + PAC → charges maîtrisées et bien qui reste louable/vendable → factures) ; 5) activer Cialdini (preuve sociale, autorité, rareté RÉELLE) ; 6) impliquer puis SE TAIRE.",
        "roleB": "Le couple acquéreur. Un conjoint est séduit et se projette facilement ; l'autre est méfiant et rationnel, il coupe avec des questions concrètes : « Combien de travaux à prévoir ? », « Les charges, ça monte à combien ? », « Pourquoi ils vendent, au juste ? ». Il cherche à ramener la conversation sur les chiffres trop tôt.",
        "objectif": "Faire vivre « émotion d'abord, preuve ensuite » : créer le désir AVANT de dérouler les preuves, brancher chaque argument sur le levier Sécurité puis Écologie, et tenir le silence après la question d'implication finale sans combler le vide.",
        "debrief": [
          "L'émotion a-t-elle été créée AVANT le premier chiffre ? Ou le négociateur est-il tombé dans la fiche technique sous la pression du conjoint méfiant ?",
          "Chaque argument était-il un CAP complet, avec la phrase de liaison et une preuve concrète nommée (facture, DPE, comparable) ?",
          "Le négociateur a-t-il tenu le SILENCE après « vous la voyez, votre famille, ici ? », ou a-t-il parlé pour meubler ?",
          "La rareté avancée était-elle RÉELLE et prouvable, ou une facilité de vendeur ? Le groupe valide l'éthique.",
          "Qu'est-ce qui, concrètement, a fait basculer (ou raté) l'adhésion ? Le groupe propose une reformulation d'une phrase à améliorer."
        ]
      },
      {
        "titre": "La prise de mandat face au vendeur « Argent »",
        "contexte": "Rendez-vous de prise de contact (R0) chez un propriétaire d'un T4 à Martigues qui souhaite vendre. Il est très sensible au prix et au montant des honoraires, compare plusieurs agences et menace de vendre seul (de particulier à particulier). Levier SONCASE dominant : Argent.",
        "roleA": "Le négociateur. Il active une persuasion éthique construite sur CAP orienté Argent : réciprocité (étude de marché de la rue offerte, à lui quoi qu'il arrive), autorité (suivi hebdo des prix quartier par quartier, chiffres précis), preuve sociale (ventes récentes dans le secteur au prix ou au-dessus de l'estimation), engagement (« vous êtes d'accord qu'un seul interlocuteur, c'est plus clair ? »), unité (« entre Martégaux, on se comprend »). Il ne brade pas les honoraires et ne sur-promet aucun prix.",
        "roleB": "Le propriétaire « Argent ». Il pousse sur les honoraires (« vous prenez trop cher »), surévalue son bien, et brandit le PAP (« je peux le faire moi-même et économiser votre commission »). Il teste la conviction du négociateur.",
        "objectif": "Obtenir la confiance du vendeur par la valeur prouvée et non par la baisse des honoraires ou une promesse de prix intenable ; démontrer que persuasion éthique + preuves locales valent mieux qu'un rabais.",
        "debrief": [
          "Le négociateur a-t-il OFFERT avant de demander (réciprocité), ou a-t-il quémandé le mandat d'entrée ?",
          "L'expertise a-t-elle été affichée avec des chiffres précis et datés, sans arrogance (autorité) ? La preuve sociale était-elle locale et réelle ?",
          "Face à la pression sur les honoraires, a-t-il défendu la valeur ou cédé au rabais ? A-t-il évité de sur-promettre le prix (risque juridique et déception) ?",
          "La congruence était-elle au rendez-vous : voix posée, regard franc, conviction sincère sur le prix conseillé ?",
          "Le groupe identifie la meilleure phrase entendue et la pire réflexe à corriger."
        ]
      },
      {
        "titre": "L'appel acquéreur : décrocher la visite (mise en situation téléphonique)",
        "contexte": "Un acquéreur appelle à l'agence suite à une annonce d'un bien à Martigues. Il est pressé, un peu méfiant, et veut « juste savoir si c'est encore dispo et si le prix est négociable ». Les deux interlocuteurs jouent dos à dos (sans se voir) pour travailler uniquement la voix.",
        "roleA": "Le négociateur au téléphone. Objectif : transformer l'appel en RDV de visite sans brader ni mentir. Il travaille le PARAVERBAL (débit posé, intonation, pauses, baisser la voix sur l'argument-clé), crée une amorce d'émotion/projection, active une rareté RÉELLE et une preuve sociale honnête, et propose deux créneaux de visite (question fermée d'engagement).",
        "roleB": "L'acquéreur pressé. Il reste évasif, pose des questions fermées sur le prix, tente d'obtenir toutes les infos par téléphone pour « réfléchir » et raccrocher sans s'engager.",
        "objectif": "Prouver que, privé du non-verbal, c'est la congruence VOCALE (ton, rythme, silence) et une rareté honnête qui font accepter le rendez-vous ; ne jamais inventer de pénurie pour forcer la visite.",
        "debrief": [
          "Le débit et les pauses étaient-ils maîtrisés, ou l'acquéreur a-t-il senti un vendeur en survitesse qui ‘fourgue' ?",
          "Le négociateur a-t-il gardé une carte (ne pas tout dire au téléphone) pour créer une vraie raison de se déplacer ?",
          "La rareté et la preuve sociale utilisées étaient-elles réelles et vérifiables ?",
          "A-t-il conclu par une question fermée proposant deux créneaux (engagement), ou laissé l'acquéreur ‘réfléchir' dans le vague ?"
        ]
      }
    ],
    "pointsCles": [
      "On achète avec l'émotion, puis on justifie avec la raison : créez le désir AVANT de dérouler les preuves (émotion d'abord, preuve ensuite).",
      "Une caractéristique ne vend pas : seul l'avantage PROUVÉ déclenche l'adhésion. Passez toujours par la liaison « … ce qui veut dire pour vous que… » (méthode CAP).",
      "Le même bien s'argumente selon le levier dominant du client — SONCASE(E) — et l'Écologie (DPE, charges, passoires thermiques) est devenue un levier majeur.",
      "BPIIHQS, à relire avant chaque RDV : Bénéfices, Prouver, Impliquer, Images mentales, Hiérarchiser, Questions d'engagement, Silence.",
      "Un argument fort vaut mieux que dix faibles : ouvrez fort (primauté), terminez par le plus fort (récence), et gardez toujours une cartouche en réserve.",
      "Cialdini 6 + 1 : réciprocité, engagement/cohérence, preuve sociale, autorité, sympathie, rareté — et l'unité (le « nous »). Toujours avec éthique.",
      "La meilleure preuve est datée, locale et chiffrée ; la preuve sociale et la recommandation se PROVOQUENT (avis Google à chaud, tableau des ventes par quartier).",
      "La congruence (le fond, la voix et le corps disent la même chose) + le silence rendent l'argument crédible ; on n'est congruent que sur ce qu'on croit vraiment.",
      "Le storytelling fait du CLIENT le héros, crée des images mentales et ancre l'émotion — en une à deux minutes, jamais plus.",
      "Persuader n'est pas tromper : loi Hoguet, DPE opposable, pratiques commerciales trompeuses, dol. Le test des 3 questions : est-ce vrai ? puis-je le prouver ? le client ne le regrettera-t-il pas ?"
    ],
    "planAction": [
      "Dès demain, préparer avant chaque R0 et chaque visite une fiche CAP à 3 colonnes (Caractéristique / Avantage / Preuve) avec les 3 arguments les plus forts, chacun relié à une preuve datée et locale.",
      "Sur chaque visite de la semaine, OUVRIR par une phrase de projection au présent et au « vous » (« imaginez… ») avant d'énoncer le moindre chiffre, puis noter la réaction du client.",
      "Identifier et nommer à voix haute le levier SONCASE(E) dominant de chaque client en reformulant : « si je comprends bien, ce qui compte avant tout pour vous, c'est… », puis brancher l'argumentaire dessus.",
      "Après chaque argument fort ou question d'engagement, s'imposer 3 secondes de SILENCE (les compter dans sa tête) au lieu d'enchaîner.",
      "Solliciter systématiquement un avis Google à chaque signature, tant que l'émotion est fraîche, et alimenter le tableau partagé des ventes par quartier (« mur des preuves »).",
      "Avant tout argument sensible, passer le test d'éthique en 3 questions (vrai ? prouvable ? sans regret pour le client ?) : un seul « non » = on reformule ou on renonce."
    ],
    "notesFormateur": [
      "Gérer le temps : affichez l'agenda au mur, utilisez un chrono visible pour les jeux, et nommez un « gardien du temps » parmi les négociateurs. Si un jeu de rôle déborde, coupez et débriefez : la valeur est dans le débrief, pas dans la longueur.",
      "Faire participer : visez 70 % de pratique pour 30 % d'apport. Faites tourner les rôles pour que personne ne reste spectateur, et valorisez chaque prise de parole, surtout les tentatives imparfaites.",
      "Ancrer les acquis : après chaque jeu, faites REFORMULER la règle par un participant (pas par vous), notez-la au paperboard, et reliez-la à un cas réel de l'agence. On retient ce qu'on a dit soi-même.",
      "Incarner l'exemple : vous êtes le modèle de congruence. Parlez posément, tenez vos silences, regardez vos négociateurs. Faites une vraie démo « émotion » en ouverture pour poser le niveau.",
      "Rendre concret : remplacez systématiquement les exemples génériques par de VRAIS biens du portefeuille et de VRAIS chiffres DVF/Martigues (Jonquières, Croix-Sainte, centre). Préparez cartes et questions avant la séance.",
      "Cadrer l'éthique sans relâche : rappelez que ces techniques servent l'intérêt du client. Insistez sur le risque réel (avis négatifs, recours, nullité de la vente) — un manager qui tolère la manipulation fabrique des litiges."
    ]
  },
  "objections": {
    "id": "objections",
    "sousTitre": "Transformer chaque « oui, mais… » en « oui, on signe » : la méthode ACRAC et la boîte à outils des négociateurs Icaza",
    "objectifs": [
      "Distinguer un refus, une objection sincère, un prétexte (« fausse barbe ») et une objection muette, pour adapter sa réponse plutôt que de répondre à côté.",
      "Maîtriser la méthode ACRAC (Accueillir, Creuser, Reformuler/Isoler, Argumenter, Contrôler) et l'appliquer à n'importe quelle objection, vendeur comme acquéreur.",
      "Être capable de traiter l'objection prix (« c'est trop cher ») par les comparables DVF et la division en mensualité, sans jamais baisser par réflexe.",
      "Savoir désamorcer « je vais réfléchir » et les temporisations en faisant préciser le frein, en l'isolant et en fixant une échéance datée.",
      "Utiliser les garde-fous juridiques 2024-2026 (rétractation de 10 jours L271-1 CCH, condition suspensive de prêt, DPE opposable) comme véritables arguments de réassurance et de closing.",
      "Gérer les objections spécifiques à la prise de mandat (vendeur), à la visite et à l'offre (acquéreur) ainsi qu'à la prospection téléphonique."
    ],
    "agenda": [
      {
        "titre": "Accueil, cadre et objectifs de la séance (règle du jeu : on apprend en pratiquant)",
        "duree": "5 min"
      },
      {
        "titre": "Brise-glace « Le mur des objections » : chacun pose ses objections qui fâchent",
        "duree": "10 min"
      },
      {
        "titre": "Apport flash n°1 — Objection n'est pas refus : typologie (sincère / prétexte / muette) et posture d'allié",
        "duree": "10 min"
      },
      {
        "titre": "Jeu n°1 — Vrai/Faux battle : les idées reçues sur l'objection",
        "duree": "8 min"
      },
      {
        "titre": "Apport flash n°2 — La méthode ACRAC et la boîte à outils (édredon, miroir, division, boomerang, isolement…)",
        "duree": "15 min"
      },
      {
        "titre": "Jeu n°2 — CRAC Académie : le quiz-battle en équipes",
        "duree": "12 min"
      },
      {
        "titre": "Jeu n°3 — Défi chrono : la bonne technique, vite !",
        "duree": "10 min"
      },
      {
        "titre": "Apport flash n°3 — Prix, « je réfléchis », catalogues vendeur/acquéreur/téléphone et garde-fous juridiques",
        "duree": "12 min"
      },
      {
        "titre": "Jeu n°4 — Étude de cas en sous-groupes : le mandat gonflé de Saint-Pierre",
        "duree": "12 min"
      },
      {
        "titre": "Jeux de rôle — Mises en situation téléphone, visite et prise de mandat (débrief sur images)",
        "duree": "15 min"
      },
      {
        "titre": "Synthèse des points clés et plan d'action individuel écrit et daté",
        "duree": "8 min"
      }
    ],
    "briseGlace": {
      "titre": "« L'objection qui me hérisse » — le mur des objections",
      "consignes": [
        "Distribuez à chaque négociateur 3 post-it. En 3 minutes, chacun note les objections clients (vendeur ou acquéreur) qui l'agacent ou le bloquent le plus en ce moment sur le secteur de Martigues — une objection par post-it, telle qu'elle est dite par le client.",
        "Chacun vient coller ses post-it au tableau en lisant son objection à voix haute en une seule phrase, sans la commenter ni y répondre.",
        "Regroupez ensemble les post-it par famille devant le groupe : Prix, « Je réfléchis » / temporisation, Travaux / DPE, Concurrence / mandat, Téléphone / prospection. Ce « mur des objections » devient le fil rouge de la séance.",
        "Annoncez la promesse du jour : « À la fin de cette séance, chacune de ces objections repartira avec sa réponse prête à l'emploi. » Revenez au mur à chaque apport pour cocher les objections traitées."
      ]
    },
    "jeux": [
      {
        "titre": "Vrai ou Faux : les idées reçues sur l'objection",
        "type": "Vrai/Faux (battle debout / assis)",
        "duree": "8 min",
        "consignes": [
          "Tout le monde debout. Lisez une affirmation à voix haute : les négociateurs restent debout s'ils pensent VRAI, s'assoient s'ils pensent FAUX. Pas d'hésitation : on tranche.",
          "Après chaque affirmation, interrogez un « debout » et un « assis » pour justifier en une phrase, puis donnez la bonne réponse et le pourquoi.",
          "Enchaînez les 10 affirmations sur un rythme rapide ; c'est un échauffement, pas un cours. Celui qui se trompe revient au tour suivant, personne n'est éliminé pour de bon.",
          "Reliez chaque réponse au « mur des objections » du brise-glace quand c'est possible."
        ],
        "animation": [
          "Gardez un tempo vif : 40 secondes maximum par affirmation, l'énergie prime sur l'exhaustivité.",
          "Rebondissez surtout sur les justifications fausses mais crédibles : ce sont elles qui révèlent les mauvais réflexes à corriger.",
          "Valorisez à voix haute les bonnes intuitions pour mettre le groupe en confiance avant les jeux plus exigeants."
        ],
        "corrige": [
          "1. « Une objection est un refus déguisé. » → FAUX : l'objection laisse la porte ouverte, c'est un signal d'intérêt et une demande de réassurance.",
          "2. « Il faut répondre immédiatement à une objection pour montrer qu'on maîtrise. » → FAUX : on ne traite jamais une objection qu'on n'a pas comprise ; on creuse d'abord.",
          "3. « Baisser le prix dès le premier “c'est trop cher” rassure le client. » → FAUX : cela avoue que le prix était gonflé et invite le client à pousser encore.",
          "4. « Le prix affiché des concurrents prouve la valeur d'un bien. » → FAUX : seul le prix réellement vendu (base DVF) fait référence.",
          "5. « L'acquéreur non-professionnel dispose de 10 jours pour se rétracter sans motif ni pénalité. » → VRAI : article L271-1 du Code de la construction et de l'habitation.",
          "6. « Plus on confie à d'agences, plus on touche d'acheteurs. » → FAUX : ce sont les mêmes acquéreurs du secteur, et le bien se banalise.",
          "7. « Un logement classé G est interdit à la location depuis 2025. » → VRAI (F à partir de 2028, E à partir de 2034 ; gel des loyers F/G depuis 2022).",
          "8. « Le “oui, mais” est préférable au “oui, et” pour cadrer le client. » → FAUX : le “mais” annule ce qui précède et braque ; le “oui, et” garde l'alliance.",
          "9. « Après avoir argumenté, il faut meubler le silence. » → FAUX : le silence est votre arme n°1, le premier qui parle rouvre la discussion.",
          "10. « Les honoraires d'agence ont un tarif imposé par la loi. » → FAUX : ils sont librement fixés, mais le barème doit être affiché."
        ]
      },
      {
        "titre": "CRAC Académie — le quiz-battle en équipes",
        "type": "Quiz-battle en équipes",
        "duree": "12 min",
        "consignes": [
          "Constituez 2 à 3 équipes de niveaux mélangés. Chaque équipe se choisit un nom et un porte-parole : lui seul annonce la réponse finale.",
          "Posez les 10 questions à choix multiple ci-dessous. L'équipe se concerte 15 secondes à voix basse, puis le porte-parole annonce la lettre/la réponse.",
          "1 point par bonne réponse ; 1 point bonus si l'équipe cite la technique ou l'article de loi qui justifie la réponse.",
          "Tenez le score au tableau. L'équipe gagnante choisit l'ordre de passage des jeux de rôle (petit privilège qui motive)."
        ],
        "animation": [
          "Après chaque question, faites expliciter le « pourquoi » par l'équipe : c'est l'explication qui ancre, pas le point gagné.",
          "Variez les thèmes (méthode, prix, juridique, prospection) pour que tout le quiz du module soit balayé.",
          "Si une équipe domine, donnez une question « piège » à double technique valable pour rééquilibrer et relancer le débat."
        ],
        "corrige": [
          "Une objection est le plus souvent le signe que… → le client s'intéresse et cherche à être rassuré.",
          "Avant de répondre à une objection, le premier réflexe est… → la creuser pour identifier le vrai frein (« c'est-à-dire ? », « par rapport à quoi ? »).",
          "Dans la méthode CRAC, les 4 temps sont… → Creuser, Reformuler, Argumenter, Contrôler (précédés du temps 0 : Accueillir).",
          "La technique dite de « l'édredon » consiste à… → amortir l'objection sans la contredire pour rester allié.",
          "Pour prouver qu'un prix est dans le marché, on s'appuie en priorité sur… → les prix réellement signés (base DVF), pas les prix affichés.",
          "La technique de « la division » consiste à… → ramener l'écart de prix à un coût mensuel sur la durée du prêt.",
          "Pour rassurer un acquéreur qui a peur de s'engager, on peut citer… → le délai de rétractation de 10 jours (article L271-1 du CCH).",
          "Au vendeur qui veut confier à plusieurs agences, l'argument-clé est… → « plus d'agences n'est pas plus d'acheteurs ».",
          "Transformer « il y a trop de travaux » en raison d'acheter relève de la technique… → du boomerang.",
          "En prospection téléphonique face à une objection, l'objectif unique est… → d'obtenir le rendez-vous d'estimation (on ne vend pas au téléphone)."
        ]
      },
      {
        "titre": "Défi chrono : la bonne technique, vite !",
        "type": "Défi chrono (association objection → technique)",
        "duree": "10 min",
        "consignes": [
          "Formez des binômes, chacun avec une ardoise ou une feuille. Lisez une objection réelle : en moins de 10 secondes, chaque binôme écrit LA technique à employer (édredon, miroir/écho, creusage, division, différentiel, boomerang, recadrage, compensation, isolement…).",
          "À votre top, les binômes lèvent leur réponse. Validez la ou les techniques pertinentes, puis faites formuler à voix haute la phrase-réponse complète par un binôme.",
          "Enchaînez les 10 objections ci-dessous : 1 point par technique juste, 1 point bonus pour la plus belle formulation terrain.",
          "Piochez en priorité dans les objections du « mur » du brise-glace pour coller à leur quotidien."
        ],
        "animation": [
          "Acceptez plusieurs techniques valables pour une même objection : ce qui compte, c'est la justification, pas une réponse unique.",
          "Imposez le chrono : l'enjeu est de rendre le réflexe automatique, comme sur le terrain.",
          "Gardez les meilleures formulations : notez-les au tableau pour alimenter la « fiche riposte » du plan d'action."
        ],
        "corrige": [
          "« C'est trop cher » → Creusage (« trop cher par rapport à quoi ? ») puis Division en mensualité + comparables DVF.",
          "« Il y a trop de travaux » → Boomerang / recadrage : les travaux sont déjà dans le prix, occasion de créer de la valeur à son goût.",
          "« Je vais réfléchir » → Creuser le frein caché + Isolement (« à part ce point… ») + échéance datée.",
          "« La piscine, c'est un gouffre d'entretien » → Boomerang / recadrage (au sel, récente, peu énergivore : quelques centaines d'euros par an pour des étés à la maison).",
          "« Pas d'ascenseur » → Compensation (charges basses, dernier étage lumineux et au calme).",
          "« Je préfère confier à plusieurs agences » → Recadrage : « plus d'agences n'est pas plus d'acheteurs » + valeur de l'exclusivité (reporting, plan marketing).",
          "« Une autre agence m'a annoncé un prix plus élevé » → Riposte factuelle DVF (piège du mandat gonflé) + recadrage « le prix qui fait signer ».",
          "« C'est petit » → Question miroir / creusage (« petit par rapport à quoi, à vos besoins ou à ce que vous avez visité ? »).",
          "« Le DPE est mauvais (F ou G) » → Transparence + chiffrage + recadrage (négociable, finançable, MaPrimeRénov', gain de classes et de valeur).",
          "« J'en parle à mon conjoint » → Isolement (« si votre conjoint est d'accord, vous l'êtes ? ») + 2e rendez-vous avec les deux décideurs présents."
        ]
      },
      {
        "titre": "Étude de cas : le mandat gonflé de Saint-Pierre",
        "type": "Étude de cas en sous-groupes",
        "duree": "12 min",
        "consignes": [
          "Répartissez en sous-groupes de 2 à 3. Distribuez le cas : « À Saint-Pierre (Martigues), un propriétaire veut mettre sa villa à 580 000 € parce qu'une agence concurrente le lui a “promis” ; vos comparables DVF situent la valeur à 545 000 €. Il hésite en plus à confier le bien à plusieurs agences et trouve vos honoraires élevés. »",
          "En 6 minutes, chaque sous-groupe prépare par écrit : (1) la trame ACRAC complète, (2) la riposte au mandat gonflé, (3) l'argument contre les mandats multiples, (4) une proposition concrète pour sécuriser le mandat sans valider la surévaluation.",
          "Chaque sous-groupe présente sa stratégie en 90 secondes ; le reste du groupe vote pour la plus convaincante et la plus professionnelle.",
          "Terminez en construisant collectivement la « meilleure version » à partir des idées de chacun."
        ],
        "animation": [
          "Laissez-les chercher avant de donner la solution ; circulez pour relancer ceux qui bloquent avec une question (« sur quelles ventes réelles s'appuie le prix du concurrent ? »).",
          "Valorisez systématiquement l'idée de clause de revoyure / mandat au juste prix : c'est la sortie professionnelle du piège.",
          "Rappelez la ligne rouge : ne jamais surenchérir sur le prix gonflé pour emporter le mandat, sous peine d'hériter d'un bien invendable."
        ],
        "corrige": [
          "Accueillir sans dénigrer le confrère : « C'est normal de comparer, et c'est bon signe : ça veut dire que vous êtes vraiment vendeur. »",
          "Creuser / riposter par les faits : « Sur quelles ventes RÉELLES s'appuie ce prix ? Voici 3 ventes DVF comparables de votre quartier. Un prix trop haut grille le bien les 3-4 premières semaines, là où l'intérêt est maximal, et il se vend finalement plus long et moins cher. »",
          "Recadrer : « Je ne vous vends pas le prix qui vous fait plaisir, je vous vends le prix qui vous fait signer. »",
          "Mandats multiples : « Plus d'agences n'est pas plus d'acheteurs : ce sont les mêmes acquéreurs qui verront le bien partout ; à prix et photos différents, il se banalise. L'exclusivité, c'est mon engagement de résultat, avec un vrai plan marketing et un reporting régulier. »",
          "Honoraires : ne pas se justifier en s'excusant, montrer la valeur (meilleur prix net vendeur, sécurité juridique, tri des acquéreurs, temps gagné) ; rappeler que le barème est librement fixé mais affiché. « Mes honoraires ne vous coûtent pas, ils vous rapportent. »",
          "Sortie professionnelle : proposer un mandat exclusif au juste prix (545 000 €) avec clause de revoyure à 4 semaines : « Donnez-moi un mois pour vous le prouver en exclusivité ; si le marché me donne tort, je m'aligne. » On sécurise le mandat sans valider la surévaluation."
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "Mise en situation téléphonique : « Pas d'agence, merci »",
        "contexte": "Vous appelez un propriétaire qui diffuse une annonce « de particulier à particulier » pour sa maison à La Couronne (Martigues). L'objectif réaliste de l'appel n'est pas de vendre, mais de décrocher un rendez-vous d'estimation. Sans visuel ni bien à montrer, le négociateur n'a que sa voix, son écoute et sa méthode.",
        "roleA": "Le négociateur : il se présente clairement, accueille chaque objection AVANT d'y répondre, ne dénigre pas, et vise un seul but — un rendez-vous daté, proposé en alternative fermée (« mardi ou jeudi ? »), appuyé sur un bénéfice concret (ex. : deux acquéreurs déjà en recherche active sur La Couronne).",
        "roleB": "Le propriétaire : pressé et un peu agacé, il sert les objections téléphoniques classiques — « pas d'agence », « envoyez-moi plutôt un mail / une plaquette », « je n'ai pas le temps », « je me débrouille très bien seul ».",
        "objectif": "Obtenir un rendez-vous d'estimation daté en traitant au moins deux objections téléphoniques, avec un ton posé, un débit calme et un bénéfice concret, sans jamais tenter de « vendre » au téléphone.",
        "debrief": [
          "Le négociateur a-t-il gardé un seul objectif (le RDV) sans tomber dans le piège de convaincre à distance ?",
          "A-t-il accueilli chaque objection avant d'y répondre, avec un ton posé (le sourire s'entend) et sans dénigrer un éventuel confrère ?",
          "A-t-il proposé une date fermée en alternative (« mardi ou jeudi ? ») plutôt qu'un vague « quand vous voulez » ?",
          "Quelle phrase a le mieux fait tomber l'objection de principe ? Faites-la noter par tout le groupe."
        ]
      },
      {
        "titre": "Mise en situation en visite : « C'est trop cher… on va réfléchir »",
        "contexte": "Un couple visite une maison de ville à L'Île (Martigues) affichée 315 000 €. Elle leur plaît visiblement, mais ils la trouvent « trop chère » et annoncent vouloir « réfléchir ». Leur budget réel plafonne autour de 300 000 € : le frein est le financement, pas la valeur du bien.",
        "roleA": "Le négociateur : il creuse (« trop cher par rapport à quoi : le marché, votre budget, un autre bien ? »), isole le vrai frein, ramène l'écart à une mensualité, mobilise les garde-fous juridiques pour rassurer et vise une offre écrite assumée.",
        "roleB": "Le couple acquéreur : séduit mais prudent, il enchaîne « c'est trop cher », « on va réfléchir », puis « il faut qu'on valide avec la banque ».",
        "objectif": "Identifier que le frein réel est le financement (et non la valeur), isoler l'objection, et faire poser une offre écrite sous condition suspensive de prêt plutôt que de laisser le couple partir « réfléchir » et refroidir.",
        "debrief": [
          "Le négociateur a-t-il creusé avant d'argumenter, ou a-t-il défendu le prix trop vite au risque de créer un doute ?",
          "A-t-il isolé (« à part le prix, tout le reste vous convient ? ») et transformé le « je réfléchis » en action datée ?",
          "A-t-il utilisé la division en mensualité et les garde-fous (10 jours de rétractation, condition suspensive de prêt) pour lever la peur de s'engager ?",
          "A-t-il tenu le silence après sa question de closing, ou a-t-il « rouvert » la discussion en parlant le premier ?"
        ]
      },
      {
        "titre": "Mise en situation en prise de mandat : le prix du concurrent",
        "contexte": "Rendez-vous d'estimation d'une villa à Saint-Pierre (Martigues). Le propriétaire a reçu une autre agence qui lui a « annoncé » 580 000 € ; vos comparables DVF situent le juste prix à 545 000 €. Il envisage aussi de confier le bien à plusieurs agences et juge vos honoraires élevés.",
        "roleA": "Le négociateur : il tient le juste prix avec des faits (ventes DVF réelles), explique le piège du mandat gonflé sans dénigrer le confrère, défend l'exclusivité par la valeur et propose une sortie (clause de revoyure à 4 semaines).",
        "roleB": "Le propriétaire : séduit par le prix haut du concurrent et méfiant, il pousse « l'autre agence m'a dit plus », « je préfère plusieurs agences », « vos honoraires sont trop élevés ».",
        "objectif": "Sécuriser un mandat, idéalement exclusif, au juste prix (545 000 €) sans surenchérir sur le prix gonflé, en traitant les objections mandats multiples et honoraires par la valeur et la preuve.",
        "debrief": [
          "Le négociateur a-t-il résisté à la tentation de surenchérir pour emporter le mandat (et hériter d'un bien invendable) ?",
          "A-t-il opposé des ventes RÉELLES (DVF) au prix « promis » par le concurrent, sans dénigrer le confrère ?",
          "A-t-il défendu ses honoraires par la valeur (prix net vendeur, sécurité, tri des acquéreurs, temps gagné) sans se justifier ni s'excuser ?",
          "La clause de revoyure / le mandat au juste prix a-t-elle permis de sortir du bras de fer sur le prix tout en engageant le vendeur ?"
        ]
      }
    ],
    "pointsCles": [
      "Une objection n'est pas un refus : c'est un signal d'intérêt et une demande de réassurance. On l'accueille (technique de l'édredon), on ne la craint pas et on ne la prend jamais personnellement.",
      "On ne traite JAMAIS une objection qu'on n'a pas comprise : creuser (« c'est-à-dire ? », « par rapport à quoi ? ») avant d'argumenter. 80 % du travail est fait quand le vrai frein est identifié.",
      "La trame universelle est ACRAC : Accueillir, Creuser, Reformuler, Argumenter, Contrôler — applicable à toute objection, côté vendeur comme acquéreur.",
      "Isoler avec « à part ce point, tout le reste vous convient ? » coupe net le jeu des objections en chaîne : un obstacle nommé est à moitié levé.",
      "Sur le prix : ne jamais baisser par réflexe. On prouve par 3 à 5 comparables DVF (prix VENDUS, pas affichés) et on divise l'écart en mensualité pour le dédramatiser.",
      "« Je vais réfléchir » cache presque toujours un frein non exprimé : faire préciser, isoler, et fixer une échéance datée — on ne repart jamais sans date de relance.",
      "Un seul argument fort et prouvé vaut mieux que dix arguments faibles ; et après l'argument, on se tait : le silence est l'arme n°1, le premier qui parle rouvre la discussion.",
      "« Oui, et… » remplace « oui, mais… » : on reste allié et jamais adversaire, et l'anticipation désamorce un défaut avant qu'il ne devienne une objection.",
      "La loi française est un argument de closing : 10 jours de rétractation (L271-1 CCH), condition suspensive de prêt (loi Scrivener), DPE opposable, frais d'acquisition ~7-8 % dans l'ancien / 2-3 % dans le neuf. Sécurité = sérénité.",
      "Côté vendeur : « plus d'agences n'est pas plus d'acheteurs », méfiance du mandat gonflé (on s'appuie sur les ventes réelles), et honoraires librement fixés mais à barème affiché, toujours défendus par la valeur jamais par l'excuse."
    ],
    "planAction": [
      "Préparer sa « fiche riposte » des 10 objections les plus fréquentes du secteur et, pour chacune, noter la trame ACRAC et sa meilleure preuve (comparable, chiffre, document, garde-fou juridique).",
      "À chaque « c'est trop cher », sortir 3 à 5 comparables DVF du quartier et ramener l'écart à une mensualité AVANT toute discussion de baisse de prix.",
      "Ne plus jamais laisser partir un « je vais réfléchir » sans avoir fait préciser le frein, isolé l'objection et fixé une date de relance notée dans l'agenda.",
      "Systématiser la question d'isolement « à part ce point, tout le reste vous convient ? » dans chaque visite et chaque prise de mandat.",
      "Intégrer dès cette semaine les garde-fous juridiques (10 jours de rétractation, condition suspensive de prêt) dans son discours de réassurance et de closing.",
      "Au téléphone, viser un seul objectif — le rendez-vous — accueillir chaque objection avant d'y répondre, et s'auto-enregistrer une fois dans la semaine pour s'écouter et s'ajuster."
    ],
    "notesFormateur": [
      "Tenez le minutage avec un chrono visible : les apports sont des « flash » de 10 à 15 minutes, l'essentiel du temps va à la pratique. Si un jeu déborde, coupez un apport, jamais un jeu de rôle.",
      "Faites parler tout le monde : nommez les plus silencieux sur des questions faciles, valorisez chaque bonne réponse, et interdisez la moquerie pendant les mises en situation — on apprend en se trompant.",
      "Ancrez avec du concret local : remplacez les exemples par de vrais biens et de vraies objections rencontrés cette semaine à Martigues, et faites noter par chacun « sa » phrase-réponse à réutiliser dès demain.",
      "Filmez (ou enregistrez au téléphone), avec l'accord des participants, les jeux de rôle : le débrief sur images est deux fois plus efficace. Commencez toujours par ce qui a marché avant de corriger.",
      "En débrief, donnez le beau rôle au groupe : demandez d'abord à l'équipe ce qu'elle aurait fait, puis complétez — on ancre mieux en faisant trouver qu'en assénant la réponse.",
      "Terminez par un engagement écrit et daté de chacun (plan d'action) et fixez un point de suivi à 15 jours pour vérifier l'application terrain et célébrer les premières réussites."
    ]
  },
  "mots-vente": {
    "id": "mots-vente",
    "sousTitre": "Le vocabulaire qui déclenche l'adhésion : transformer chaque mot en levier de vente, avec sincérité.",
    "objectifs": [
      "Identifier et bannir les « mots noirs » qui activent peur, méfiance ou doute chez le client, et les remplacer par un lexique qui rassure et valorise (prix → investissement, commission → honoraires, problème → point à regarder).",
      "Maîtriser l'arsenal des mots-force (vous, parce que, imaginez, garanti) et savoir traduire chaque caractéristique d'un bien en bénéfice concret grâce à la formule « ce qui veut dire pour vous… ».",
      "Être capable de construire un storytelling de bien sincère (lieu, vie possible, détail qui ancre) et de donner du sens à un chiffre par l'ancrage, le fractionnement et l'aversion à la perte.",
      "Savoir utiliser la voix, le rythme et surtout le silence — « qui parle en premier après le prix, perd » — au téléphone comme en rendez-vous.",
      "Adapter son vocabulaire au profil du client (analytique, affectif, pragmatique, prudent) et à l'étape de la vente (pige, estimation, visite, négociation, closing).",
      "Distinguer clairement persuader et manipuler, et rester conforme au droit français (pratiques commerciales trompeuses, loi Hoguet, DPE obligatoire en annonce) pour sécuriser chaque transaction."
    ],
    "agenda": [
      {
        "titre": "Accueil, cadre de la séance & brise-glace « le mot qui vend / le mot qui tue »",
        "duree": "10 min"
      },
      {
        "titre": "Apport 1 — Les mots noirs à bannir & la boîte à outils du vocabulaire persuasif (mots-force, bénéfices, VAKOG)",
        "duree": "15 min"
      },
      {
        "titre": "Jeu — Le grand Quiz-Battle des mots (en équipes)",
        "duree": "15 min"
      },
      {
        "titre": "Jeu — La chasse aux mots noirs (défi chrono de traduction)",
        "duree": "10 min"
      },
      {
        "titre": "Apport 2 — Storytelling immobilier, cadrage des chiffres, voix & silence",
        "duree": "12 min"
      },
      {
        "titre": "Jeu — De la donnée à l'émotion (atelier storytelling en binômes)",
        "duree": "12 min"
      },
      {
        "titre": "Jeu — Le pouvoir du silence (drill voix & para-verbal)",
        "duree": "7 min"
      },
      {
        "titre": "Jeu — Le juste prix, les bons mots (étude de cas cadrage & ancrage)",
        "duree": "10 min"
      },
      {
        "titre": "Jeux de rôle tournants — Pige au téléphone, négociation du prix & visite vérité",
        "duree": "20 min"
      },
      {
        "titre": "Apport 3 — Les mots à l'écrit (AIDA, mentions légales) & l'éthique / conformité",
        "duree": "8 min"
      },
      {
        "titre": "Synthèse des points clés, plan d'action individuel & clôture",
        "duree": "11 min"
      }
    ],
    "briseGlace": {
      "titre": "Le mot qui vend / le mot qui tue",
      "consignes": [
        "Distribuez à chacun deux post-it de couleurs différentes. Sur le vert, chacun écrit UN mot qui, selon lui, fait vendre (« lumineux », « serein », « investissement »…) ; sur le rouge, UN mot qui fait fuir un client (« cher », « commission », « problème »…).",
        "Chacun vient coller ses deux post-it au tableau en 15 secondes, en justifiant son choix en une seule phrase : on construit collectivement le premier « mur des mots » de la séance.",
        "En tant qu'animateur, regroupez à voix haute les mots rouges récurrents : « voilà nos mots noirs du quotidien ; l'objectif d'aujourd'hui, c'est de ne plus jamais les lâcher par réflexe ».",
        "Comptez 10 minutes maximum (1 minute par personne). Laissez le mur affiché toute la séance : on y reviendra au moment du plan d'action pour mesurer le chemin parcouru."
      ]
    },
    "jeux": [
      {
        "titre": "Le grand Quiz-Battle des mots",
        "type": "Quiz-battle en équipes",
        "duree": "15 min",
        "consignes": [
          "Constituez 2 ou 3 équipes (« Les mots d'or », « Les closers »…), chacune avec un porte-parole et un buzzer symbolique (clochette, objet à lever, ou main levée).",
          "Posez les questions du quiz du module (20 QCM). La première équipe qui répond juste marque 1 point ; une erreur laisse la main aux autres pour un point bonus.",
          "Avant de valider une bonne réponse, exigez une JUSTIFICATION en une phrase : c'est elle qui ancre l'apprentissage, pas seulement la bonne lettre.",
          "Lisez l'explication après chaque question, puis illustrez par un exemple terrain (un bien réel de l'agence à Martigues).",
          "Transformez les 3 dernières questions en « manche à haut risque » (3 points) pour un suspense jusqu'au bout ; petite récompense symbolique à l'équipe gagnante."
        ],
        "animation": [
          "Rythmez : 30 à 45 secondes par question maximum. L'énergie du quiz vient de la cadence.",
          "Ne laissez jamais une bonne réponse sans son explication reformulée avec vos propres mots : c'est là que le savoir se transmet.",
          "Faites tourner les porte-parole pour que les plus discrets s'expriment aussi."
        ],
        "corrige": [
          "« Ne vous inquiétez pas » est à éviter → la négation fait d'abord entendre le mot « inquiétude » ; on formule au positif.",
          "« Parce que » est puissant → une justification, même simple, augmente fortement l'acceptation.",
          "Le storytelling → faire vivre une émotion et une projection à partir de détails VRAIS (jamais inventés).",
          "Fractionnement d'un montant → le ramener à une petite échelle (par mois, ou comparé à une économie), sans jamais le dissimuler.",
          "Juste après l'annonce d'un prix au téléphone → se taire et laisser le client réagir (« qui parle en premier, perd »).",
          "Affirmer un faux atout → c'est une pratique commerciale trompeuse, un délit (L121-2 à L121-4 du Code de la consommation, contrôle DGCCRF).",
          "Mot préféré du client à privilégier → « vous / votre » (ratio très supérieur à « je »).",
          "« Commission » → à remplacer par « honoraires » (professionnel réglementé, pas démarchage).",
          "« Honnêtement / franchement / pour être sincère » → à éviter : sous-entend que le reste ne l'était pas.",
          "« Ce qui veut dire pour vous » → transforme une caractéristique en bénéfice concret pour le client.",
          "Client qui dit « je le sens / c'est du concret » → répondre « vous allez vous sentir bien ici » (canal kinesthésique, VAKOG).",
          "Trois ingrédients de l'histoire d'un bien → le lieu, la vie possible et le détail qui ancre.",
          "Révéler que le vendeur divorce et doit vendre vite → trahit le devoir de loyauté et affaiblit sa position en négociation.",
          "« Quand vous serez installés… » → présupposé positif qui installe la projection.",
          "« Des biens comme celui-ci se négocient autour de 320 000 € » avant « ici à 299 000 € » → effet d'ancrage.",
          "« Chaque mois de retard, c'est un crédit relais qui court » → aversion à la perte.",
          "Pour crédibiliser une estimation → annoncer « 297 500 € » (chiffre précis) plutôt qu'« environ 300 000 € ».",
          "Phrase importante qui sonne comme une affirmation sûre → se termine sur un ton descendant.",
          "Méthode AIDA → Attention, Intérêt, Désir, Action.",
          "Taire une servitude ou nuisance connue → peut faire annuler la vente pour dol (article 1137 du Code civil)."
        ]
      },
      {
        "titre": "La chasse aux mots noirs",
        "type": "Défi chrono — traduction en équipes",
        "duree": "10 min",
        "consignes": [
          "Affichez (ou distribuez) 10 phrases « polluées » de mots noirs, tirées du quotidien de l'agence. Ex. : « Ne vous inquiétez pas, le prix n'est pas si cher, et la paperasse, c'est pas un problème. »",
          "Chaque équipe a 4 minutes chrono pour réécrire un maximum de phrases en version « mots qui vendent », à l'écrit.",
          "Correction collective : 1 point par phrase correctement reformulée ; 2 points si la reformulation est plus percutante que celle du corrigé (vous arbitrez).",
          "Faites lire les meilleures reformulations à voix haute : on entend la différence immédiatement."
        ],
        "animation": [
          "Mettez un vrai minuteur visible : le chrono crée l'adrénaline et simule la pression du terrain.",
          "Valorisez la créativité : plusieurs bonnes reformulations existent, l'essentiel est de supprimer la négation, le mot anxiogène et le mot faible.",
          "Reliez chaque correction au tableau des substitutions : prix → investissement/budget, commission → honoraires, problème → point à regarder, paperasse → formalités."
        ],
        "corrige": [
          "« Ne vous inquiétez pas, ce n'est pas si cher. » → « Vous pouvez être serein : c'est un bien de qualité, qui tient son prix. »",
          "« Votre commission est un peu élevée. » → « Mes honoraires correspondent à un résultat : vendre au juste prix, en sécurité, dans les délais. »",
          "« Il faut qu'on signe le contrat. » → « On va pouvoir officialiser notre accord et valider le document ensemble. »",
          "« Il y a un petit problème avec le dossier. » → « Il reste un point à regarder ensemble ; je m'occupe de tout. »",
          "« C'est un vieil appartement un peu petit. » → « C'est un bien de caractère, fonctionnel et optimisé, à rafraîchir à votre goût. »",
          "« Honnêtement, ça ne se vend pas, le marché est bloqué. » → « Le marché est sélectif en ce moment : il faut viser juste, et c'est exactement ce qu'on va faire. »",
          "« Je pense qu'on va peut-être essayer de le vendre vite. » → « On va le vendre au juste prix et dans les délais : sur ce secteur, c'est le cas quand on vise juste. »",
          "« Je ne vais pas vous mentir, il y a de la paperasse. » → « Je m'occupe de toutes les formalités, vous n'avez rien à gérer. »",
          "« Normalement, ça devrait partir. » → « Ce secteur part vite : nous avons déjà des acquéreurs positionnés. » (uniquement si c'est vrai)",
          "« C'est votre objection habituelle. » → « C'est une très bonne question, regardons-la ensemble. »"
        ]
      },
      {
        "titre": "De la donnée à l'émotion",
        "type": "Atelier créatif / Brainstorm en binômes",
        "duree": "12 min",
        "consignes": [
          "Distribuez à chaque binôme une fiche « bien » plate et technique (voir corrigé). Ex. : « T2 42 m², 3e étage, DPE D, proche port, à rafraîchir. »",
          "En 6 minutes, chaque binôme réécrit l'annonce en appliquant les 3 ingrédients du storytelling : le lieu (le décor), la vie possible (la projection), le détail qui ancre (un élément vrai et unique).",
          "Contrainte imposée : au moins une phrase sensorielle (vue, ouïe, toucher ou odorat) et une formule « ce qui veut dire pour vous… » reliant une caractéristique à un bénéfice.",
          "Chaque binôme lit sa version « avant / après ». Le groupe vote pour l'annonce la plus incarnée ; on en fait un modèle affiché."
        ],
        "animation": [
          "Insistez sur la règle d'or : on embellit par des détails VRAIS, on n'invente jamais — sinon la visite démolit le discours, et c'est juridiquement risqué (pratique trompeuse).",
          "Si un binôme bloque, soufflez une accroche sensorielle (« la lumière de fin d'après-midi », « le silence de l'impasse loin de la circulation »).",
          "Reliez à l'outil de génération d'annonce de l'application : il donne une trame, le négociateur y réinjecte l'émotion vraie que seul le passage sur place révèle."
        ],
        "corrige": [
          "Avant : « T2 42 m², 3e étage, DPE D, proche port, à rafraîchir. » → Après : « À deux pas du port de Martigues, un pied-à-terre plein de charme, baigné de lumière en fin de journée. Il n'attend que votre touche personnelle — ce qui veut dire pour vous un premier achat à votre goût, ou un investissement qui se reloue vite. (DPE : D) »",
          "Avant : « Maison 95 m², jardin 400 m², garage, quartier Jonquières, DPE C. » → Après : « Dans une rue calme de Jonquières où chantent les cigales l'été, une maison familiale de 95 m² ouverte sur un jardin de 400 m². Imaginez les dîners sous la pergola pendant que les enfants jouent en sécurité — ce qui veut dire pour vous des week-ends entiers à la maison. Garage fermé. (DPE : C) »"
        ]
      },
      {
        "titre": "Le pouvoir du silence",
        "type": "Défi chrono — mise en situation téléphonique courte",
        "duree": "7 min",
        "consignes": [
          "En binômes installés dos à dos (pour simuler le téléphone, sans se voir). Le négociateur A annonce un prix ou des honoraires puis SE TAIT ; le client B a pour consigne secrète de rester silencieux le plus longtemps possible.",
          "Règle : « qui parle en premier après le prix, perd ». A doit tenir le silence 3 à 5 secondes minimum après sa phrase ; on chronomètre.",
          "Phrase imposée, ton neutre et descendant, puis stop : « Pour ce mandat exclusif, mes honoraires sont de 5 %. » — silence total.",
          "On inverse les rôles, puis débrief flash : qu'avez-vous ressenti dans le silence ? Qui a craqué en premier, et pourquoi ?"
        ],
        "animation": [
          "Commencez par 3 respirations ventrales collectives pour poser les voix dans les graves : le drill démarre par le corps, pas par les mots.",
          "Exagérez volontairement le silence au début (5-6 secondes) pour désensibiliser à l'inconfort ; l'objectif est de rendre le silence confortable.",
          "Rappelez le sourire qui s'entend au téléphone et le ton descendant en fin de phrase (= affirmation, et non question hésitante)."
        ]
      },
      {
        "titre": "Le juste prix, les bons mots",
        "type": "Étude de cas en équipes",
        "duree": "10 min",
        "consignes": [
          "Présentez le cas : « Un vendeur est accroché à 330 000 € sur un bien que vous avez estimé 300 000 €. Il trouve en plus vos honoraires (6 000 €) trop élevés. »",
          "Chaque équipe a 5 minutes pour préparer une réponse mobilisant AU MOINS trois techniques vues : ancrage par les mots, fractionnement, recadrage par comparaison, aversion à la perte, chiffre précis.",
          "Chaque équipe joue sa réponse face à vous (dans le rôle du vendeur). Le groupe identifie les techniques utilisées.",
          "On liste au tableau les meilleures formules et on garde la « réplique d'agence » la plus efficace pour le terrain."
        ],
        "animation": [
          "Rappelez la limite éthique et légale : on cadre un chiffre VRAI, on n'invente jamais de faux prix de référence ni de fausse remise (pratique commerciale trompeuse, L121-2 à L121-4 du Code de la consommation).",
          "Poussez les équipes à conclure par une question d'engagement plutôt que par une justification (« combien vous coûtent réellement ces 4 mois de plus ? »), puis à se taire."
        ],
        "corrige": [
          "Ancrage : « Des biens rénovés comme vous les visez se négocient autour de 320 000 € ; à 299 000 €, vous êtes déjà le meilleur rapport du secteur. »",
          "Fractionnement des honoraires : « 6 000 €, c'est moins qu'un mois de crédit relais que vous économisez en vendant vite. »",
          "Aversion à la perte : « Chaque mois de retard, c'est un crédit relais qui court et un bien qui fatigue sur le marché. »",
          "Chiffre précis : « estimé à 297 500 € sur la base de 8 ventes comparables de votre rue » inspire plus confiance qu'« environ 300 000 € ».",
          "Clôture par engagement : « À 299 000 €, vous vendez en 6 semaines au lieu de 6 mois. Combien vous coûtent réellement ces 4 mois de plus ? » — puis silence."
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "La pige : annoncer ses honoraires sans ciller",
        "contexte": "Vous appelez un propriétaire qui vend son bien en direct (pige) à Martigues. Il est pressé, un peu méfiant, et lâche très vite : « Votre commission, c'est pas un peu cher pour juste des photos et une annonce ? »",
        "roleA": "Le négociateur : décrocher un rendez-vous d'estimation. Il doit employer le bon lexique (honoraires et non commission, formalités et non paperasse), valoriser le résultat plutôt que ses tâches, et surtout annoncer ses honoraires sur un ton descendant PUIS se taire.",
        "roleB": "Le vendeur en direct : méfiant, focalisé sur le prix de la prestation, il teste la solidité du négociateur. Consigne secrète : faire une objection sur le « cher », puis laisser un silence après l'annonce pour voir si A craque et se met à se justifier.",
        "objectif": "Transformer une objection prix en rendez-vous, en remplaçant les mots noirs par des mots-force et en tenant le silence après l'annonce des honoraires.",
        "debrief": [
          "A a-t-il dit « commission » ou « honoraires » ? A-t-il glissé un mot noir (cher, problème, paperasse) sans s'en rendre compte ?",
          "A-t-il tenu le silence après l'annonce des honoraires, ou l'a-t-il meublé par une justification anxieuse qui en annule le poids ?",
          "Le « vous » a-t-il dominé le « je » ? A-t-il parlé du résultat pour le vendeur (vendre au bon prix, en sécurité) plutôt que de ses propres tâches ?",
          "Le groupe propose UNE formule d'amélioration concrète, réutilisable dès demain en pige."
        ]
      },
      {
        "titre": "Le vendeur accroché à son prix",
        "contexte": "Rendez-vous à l'agence avec un vendeur qui veut afficher son bien à 330 000 €, alors que votre estimation argumentée est à 300 000 €. Il est attaché à sa maison (« on y a élevé nos enfants ») et cite un voisin qui « a vendu plus cher ».",
        "roleA": "Le négociateur : amener le vendeur vers le juste prix avec l'ancrage, le fractionnement, l'aversion à la perte et l'alliance (« voyons ensemble »), sans jamais prononcer « c'est trop cher ».",
        "roleB": "Le vendeur : profil affectif, attaché émotionnellement, convaincu que sa maison « vaut plus ». Sensible à la relation et aux histoires, il se braque si on le contredit frontalement.",
        "objectif": "Faire accepter un prix réaliste par le cadrage des chiffres et l'alliance, en adaptant le vocabulaire au profil affectif du vendeur (projet de vie, sécurité, accompagnement — pas rendement).",
        "debrief": [
          "A a-t-il cadré le chiffre (ancrage, comparables réels, aversion à la perte) plutôt que de contredire frontalement le vendeur ?",
          "A-t-il adapté ses mots au profil affectif (sécurité, accompagnement, « je sécurise votre vente ») plutôt que de parler rendement ?",
          "A-t-il reformulé positivement les objections et créé l'alliance avec le « nous » (« voyons ensemble », « notre objectif commun ») ?",
          "A-t-il respecté la sincérité : chiffres vrais, comparables réels, aucune promesse intenable ?"
        ]
      },
      {
        "titre": "La visite vérité : dire le défaut, garder la confiance",
        "contexte": "Visite d'un T3 situé à 100 m d'un bar animé le week-end. L'acquéreur, visuel et prudent, demande : « C'est calme, le quartier, la nuit ? » Vous connaissez l'existence du bar.",
        "roleA": "Le négociateur : faire vivre le bien par un storytelling sensoriel et une projection, MAIS répondre avec sincérité sur le bar — en recadrant honnêtement (double vitrage récent, calme en semaine) plutôt qu'en niant.",
        "roleB": "L'acquéreur : prudent, demande des garanties et de la réassurance ; profil visuel (« montrez-moi, je vois… »). Il pose la question du bruit et observe si le négociateur esquive ou minimise.",
        "objectif": "Combiner storytelling incarné et sincérité : révéler un défaut avant qu'il ne se voie renforce la crédibilité sur tout le reste, et protège juridiquement (devoir de conseil, absence de pratique trompeuse).",
        "debrief": [
          "A a-t-il menti ou minimisé (« non, c'est très calme »), ou dit le vrai en le recadrant honnêtement ?",
          "A-t-il repris le canal visuel de l'acquéreur et nourri sa projection dans le bien ?",
          "A-t-il mesuré l'enjeu : dire le défaut fait perdre un acheteur mal ciblé, mais gagne la confiance du bon — et couvre l'agent (devoir de conseil loi Hoguet, pratique trompeuse L121-2, dol article 1137 du Code civil) ?",
          "Le groupe formule ensemble la « phrase vérité » idéale à réutiliser en visite."
        ]
      }
    ],
    "pointsCles": [
      "Le cerveau traite mal la négation : « ne vous inquiétez pas » fait d'abord entendre « inquiétude ». On formule toujours au positif.",
      "Bannir les mots noirs (cher, commission, problème, paperasse, essayer, objection) et les remplacer par des mots-force (investissement, honoraires, point à regarder, formalités, vous allez).",
      "Le mot préféré du client, c'est « vous ». On parle de lui, pas de soi, et on traduit chaque caractéristique en bénéfice avec « ce qui veut dire pour vous… ».",
      "On vend une histoire et une projection, pas des m² : lieu + vie possible + détail qui ancre — à partir de détails toujours VRAIS, jamais inventés.",
      "Un chiffre prend son sens dans les mots qui l'entourent : ancrage (une valeur haute et vraie d'abord), fractionnement, aversion à la perte, et un chiffre précis plutôt que rond.",
      "La voix vend autant que les mots : ton descendant = affirmation, ralentir sur les mots-clés, et après le prix… se taire. « Qui parle en premier après le prix, perd. »",
      "À l'écrit, l'accroche fait tout (le bénéfice n°1 dès la première ligne) et la structure AIDA guide le texte ; jamais d'annonce sans DPE/GES ni mention des honoraires, c'est une obligation légale.",
      "Pas de script universel : on adapte ses mots au profil (analytique, affectif, pragmatique, prudent) et à l'étape (pige, estimation, visite, négociation, closing).",
      "Persuader n'est pas manipuler : la sincérité est la technique la plus rentable. Dire un défaut avant qu'il se voie augmente la crédibilité sur tout le reste.",
      "Les mots engagent juridiquement : pratique commerciale trompeuse (L121-2 à L121-4 du Code de la consommation, jusqu'à 2 ans et 300 000 €, contrôle DGCCRF), devoir de conseil (loi Hoguet), dol (article 1137 du Code civil)."
    ],
    "planAction": [
      "Dès demain, m'enregistrer sur un appel de pige et repérer mes 3 « mots noirs » récurrents, pour les remplacer dès l'appel suivant.",
      "Remplacer définitivement « commission » par « honoraires » et « problème » par « point à regarder » dans tous mes échanges, à l'oral comme à l'écrit.",
      "Sur chaque nouvelle annonce, appliquer la structure AIDA avec une accroche sensorielle en première ligne, et vérifier systématiquement la présence du DPE/GES et de la mention des honoraires.",
      "À la prochaine annonce d'un prix ou d'honoraires, tenir le silence 3 secondes minimum et laisser le client réagir le premier.",
      "Pour chaque bien pris en mandat cette semaine, écrire son storytelling en 3 phrases (lieu, vie possible, détail vrai) avant de rédiger l'annonce.",
      "Reformuler au moins une caractéristique en bénéfice avec « ce qui veut dire pour vous… » sur chaque visite, pendant une semaine."
    ],
    "notesFormateur": [
      "Gérer le temps : annoncez le minutage dès le départ et gardez un chrono visible pendant les jeux. Si le temps manque, sacrifiez un apport théorique, jamais un jeu ni le plan d'action — c'est la pratique qui ancre.",
      "Faire participer tout le monde : faites tourner les porte-parole et les rôles, sollicitez nommément les plus discrets, et valorisez chaque tentative avant de corriger.",
      "Ancrer les acquis : après chaque jeu, faites formuler par le groupe UNE phrase réutilisable dès demain. C'est la verbalisation qui fixe l'apprentissage.",
      "Montrer l'exemple : soignez VOTRE propre vocabulaire pendant l'animation (vous, honoraires, point à regarder). Les négociateurs calquent les mots qu'ils entendent de leur manager.",
      "Partir du terrain : illustrez chaque principe avec un bien réel de l'agence en portefeuille à Martigues — c'est bien plus marquant qu'un exemple abstrait.",
      "Clore par l'engagement : faites remplir puis lire à voix haute le plan d'action individuel. Un engagement verbalisé devant le groupe pèse bien plus qu'une bonne intention gardée pour soi."
    ]
  },
  "closing": {
    "id": "closing",
    "sousTitre": "Oser demander, se taire, sécuriser le oui jusqu'à l'acte : l'atelier terrain du closing immobilier",
    "objectifs": [
      "Être capable de repérer en temps réel les signaux d'achat (verbaux, non verbaux et côté vendeur) et d'identifier le point de maturité pour arrêter d'argumenter au bon moment",
      "Maîtriser au moins cinq techniques de conclusion (alternative, bilan, dernière objection, présomption, projection) et savoir les adapter au profil SONCAS du client",
      "Savoir poser une question de conclusion fermée et engageante, puis tenir le silence sans combler ni brader",
      "Être capable de sécuriser l'après-oui : verrouiller par écrit, prévenir le remords de l'acheteur et piloter le tunnel compromis-acte",
      "Maîtriser le cadre juridique du closing (loi Hoguet, art. 1589-1 et 1583 du Code civil, délais SRU et Scrivener, LCB-FT) au moment précis où l'on conclut",
      "Dépasser la peur du non et assumer de demander la décision comme un service rendu au client"
    ],
    "agenda": [
      {
        "titre": "Accueil et brise-glace : « Le oui qui m'a échappé »",
        "duree": "10 min"
      },
      {
        "titre": "Apport 1 : l'état d'esprit du closeur et la peur du non (mnémonique OSER)",
        "duree": "10 min"
      },
      {
        "titre": "Jeu 1 — Vrai/Faux déontologie et closing (buzzer)",
        "duree": "10 min"
      },
      {
        "titre": "Apport 2 : repérer les signaux d'achat et le point de maturité",
        "duree": "10 min"
      },
      {
        "titre": "Jeu 2 — Défi chrono « Signal ou pas signal ? »",
        "duree": "10 min"
      },
      {
        "titre": "Apport 3 : les grandes techniques de conclusion et le pouvoir du silence",
        "duree": "10 min"
      },
      {
        "titre": "Jeu 3 — Quiz-battle en équipes (techniques et cadre juridique)",
        "duree": "15 min"
      },
      {
        "titre": "Jeu 4 — Étude de cas « Le couple de La Couronne »",
        "duree": "10 min"
      },
      {
        "titre": "Jeu de rôle 1 — Faire accepter l'offre au vendeur, au téléphone",
        "duree": "15 min"
      },
      {
        "titre": "Jeu de rôle 2 — Conclure la prise de mandat face à « je veux comparer »",
        "duree": "15 min"
      },
      {
        "titre": "Synthèse : points-clés et plan d'action individuel",
        "duree": "15 min"
      }
    ],
    "briseGlace": {
      "titre": "« Le oui qui m'a échappé » : chacun raconte sa vente ratée au moment de conclure",
      "consignes": [
        "En cercle, chaque négociateur raconte en 60 secondes maximum une vente (mandat ou transaction) qu'il sentait gagnée et qui lui a filé entre les doigts au moment de conclure : le couple qui repart « réfléchir », le vendeur qui signe ailleurs, l'acquéreur jamais rappelé.",
        "Consigne unique pour l'auditoire : à la fin de chaque histoire, dire en un mot l'erreur commise selon eux (« pas osé », « trop parlé », « pas écrit », « lâché trop vite »).",
        "L'animateur note les mots-clés au paperboard, sans juger ni corriger : ils serviront de fil rouge et seront repris en synthèse.",
        "Conclure l'exercice par la phrase d'accroche du module : « Le pire closing est celui qu'on ne tente pas. » Aujourd'hui, on apprend à oser, puis à sécuriser."
      ]
    },
    "jeux": [
      {
        "titre": "Vrai / Faux : les réflexes du closeur légal",
        "type": "Vrai/Faux (buzzer)",
        "duree": "10 min",
        "consignes": [
          "L'animateur lit à voix haute une affirmation. Les participants lèvent un carton VRAI (vert) ou FAUX (rouge) distribués au départ, ou se lèvent pour VRAI / restent assis pour FAUX afin de dynamiser.",
          "Après chaque vote, l'animateur demande à un participant « pourquoi ? » avant de donner la réponse et la règle sous-jacente.",
          "Enchaîner vite, une affirmation toutes les 30 à 40 secondes, pour maintenir le rythme.",
          "Affirmations à lire : 1) « Dès qu'un signal d'achat clair apparaît, je rajoute deux ou trois arguments pour être sûr. » 2) « Au stade de l'offre d'achat, je peux demander un chèque de 5 000 € pour bloquer le bien. » 3) « Une offre au prix du mandat acceptée par le vendeur rend la vente parfaite. » 4) « Je peux négocier sérieusement un bien sans mandat écrit signé, on régularisera après. » 5) « Après ma question de conclusion, c'est à moi de reparler le premier pour rassurer. » 6) « Inventer une deuxième visite inexistante pour accélérer, c'est de bonne guerre. » 7) « Toute offre écrite reçue doit être transmise au vendeur, même si je la trouve trop basse. » 8) « Le dépôt de garantie se verse au compromis, séquestré, pas à l'offre. »"
        ],
        "animation": [
          "Valoriser les bonnes justifications plutôt que la simple bonne couleur : c'est le raisonnement qui ancre l'acquis.",
          "Sur les items juridiques (2, 4, 6, 7, 8), citer la référence à l'oral : « article 1589-1 », « loi Hoguet », « pratique commerciale trompeuse » : la répétition fixe le réflexe.",
          "Repérer les désaccords dans la salle et les faire débattre 20 secondes avant de trancher : l'erreur assumée s'oublie moins."
        ],
        "corrige": [
          "1) FAUX : c'est la survente, qui réveille des objections ; dès le signal, on conclut.",
          "2) FAUX : l'article 1589-1 du Code civil frappe de nullité tout versement exigé à l'offre ; ni chèque, ni acompte.",
          "3) VRAI : art. 1583 du Code civil, accord sur la chose et le prix ; le vendeur reste libre tant qu'il n'a pas accepté.",
          "4) FAUX : pas de mandat écrit, pas de closing (loi Hoguet) ; sans mandat valable, aucun honoraire n'est dû.",
          "5) FAUX : le premier qui parle « perd » ; on tient le silence et on laisse le client décider.",
          "6) FAUX : fausse urgence = pratique commerciale trompeuse, interdite et sanctionnée ; l'urgence ne s'emploie que si elle est réelle.",
          "7) VRAI : obligation de transmission de toute offre écrite, on ne filtre jamais selon son intérêt.",
          "8) VRAI : rien à l'offre (art. 1589-1), dépôt séquestré au compromis chez le notaire ou l'agent garanti."
        ]
      },
      {
        "titre": "Défi chrono : « Signal ou pas signal ? »",
        "type": "Défi chrono en équipes",
        "duree": "10 min",
        "consignes": [
          "Diviser le groupe en deux équipes. L'animateur projette ou lit une série de 12 phrases prononcées par un client en visite ; chaque équipe a 90 secondes pour trier : SIGNAL D'ACHAT, OBJECTION/FREIN, ou NEUTRE.",
          "Une équipe répond, l'autre peut contester (vol de point si la contestation est juste).",
          "Pour chaque SIGNAL identifié, bonus d'un point si l'équipe propose en 10 secondes une conclusion d'essai ou une question de conclusion adaptée.",
          "Phrases à trier : a) « Les enfants seraient dans quelle école ? » b) « Il faut vraiment que j'en parle à mon frère. » c) « La cuisine reste, c'est bien ça ? » d) « On serait bien, là, le matin, avec le café sur le balcon. » e) « C'est un peu cher quand même. » f) « Et ensuite, comment ça se passe, il faut déjà un acompte ? » g) « Je regarde encore deux-trois biens avant de me décider. » h) « Notre chambre, on la mettrait côté jardin. » i) « Les charges sont bien de 120 € par mois ? » j) « Je ne suis pas sûr pour le quartier. » k) « Quand on sera installés, on repeindra le séjour. » l) « Vous me laissez votre carte, je vous rappelle. »"
        ],
        "animation": [
          "Tenir le chrono visiblement (téléphone ou sablier projeté) : la pression de temps reproduit l'énergie de la visite.",
          "Insister sur le réflexe-clé : un signal détecté = on arrête d'argumenter et on enchaîne une conclusion d'essai, on ne commente pas.",
          "Faire remarquer que les signaux faibles (d, h, k) sont les plus rentables car les moins repérés par les négociateurs."
        ],
        "corrige": [
          "Signaux d'achat : a, c, d, f, h, i, k (projection, questions de détail concret, demande de l'après, confirmation, futur de possession).",
          "Objections/freins : b, e, g, j (temporisation, prix, comparaison, doute quartier) : à traiter avant de conclure.",
          "Neutre tendance report : l (« je vous rappelle » = report à transformer en offre écrite sur-le-champ)."
        ]
      },
      {
        "titre": "Quiz-battle : techniques de closing et cadre légal",
        "type": "Quiz-battle en équipes",
        "duree": "15 min",
        "consignes": [
          "Former 2 ou 3 équipes avec un nom. L'animateur pose les questions à l'oral ; la première équipe qui lève la main (ou buzze) répond. Bonne réponse = 2 points ; si faux, la main passe à l'équipe suivante pour 1 point.",
          "Trois manches : Manche 1 « Techniques » (questions 1 à 4), Manche 2 « Le silence et la question » (5 et 6), Manche 3 « Le droit » (7 à 10).",
          "Questions : 1) Nommer la technique : « Vous préférez signer mardi matin ou jeudi en fin de journée ? » 2) Comment s'appelle la technique qui oppose une longue liste d'avantages à de courtes réserves ? 3) « Si je règle la question du parking, on y va ? » : quelle technique ? 4) Sur quel principe psychologique repose la technique des petits oui ? 5) Juste après la question de conclusion, que fait le bon closeur ? 6) Citer une vraie question de conclusion et une fausse (molle). 7) Quel texte impose le mandat écrit avant toute négociation ? 8) Quel article du Code civil interdit d'exiger une somme de l'acquéreur à l'offre ? 9) Combien de jours de rétractation SRU pour l'acquéreur non professionnel d'un logement ? 10) Que doit faire l'agent de toute offre écrite reçue ?",
          "Classement final affiché, petit lot symbolique à l'équipe gagnante (café offert, premier choix sur un créneau de visite…)."
        ],
        "animation": [
          "Garder un rythme télé-crochet : annoncer les scores entre chaque manche pour entretenir la compétition.",
          "Pour chaque bonne réponse, redonner en une phrase le « pourquoi terrain » : la technique ne vaut que si on comprend quand l'utiliser.",
          "Si une équipe domine trop, inverser l'ordre des buzz ou donner une question bonus à l'équipe en retard pour garder tout le monde mobilisé."
        ],
        "corrige": [
          "1) L'alternative (choix dirigé entre deux oui). 2) Le bilan / la balance de Benjamin Franklin. 3) La dernière objection (conclusion conditionnelle). 4) Le principe de cohérence (rester en accord avec ses engagements). 5) Il se tait et laisse le silence agir (le premier qui parle perd). 6) Vraie : « Je rédige l'offre ? » / « On signe le mandat maintenant ? » ; molle : « Vous voulez réfléchir ? », « Je vous laisse mon numéro ? ». 7) La loi Hoguet (loi n° 70-9 du 2 janvier 1970). 8) L'article 1589-1 du Code civil. 9) 10 jours (art. L271-1 du CCH). 10) La transmettre au vendeur, sans jamais la filtrer selon son intérêt."
        ]
      },
      {
        "titre": "Étude de cas : « Le couple de La Couronne »",
        "type": "Étude de cas",
        "duree": "10 min",
        "consignes": [
          "Projeter ou distribuer le cas : « Un couple visite pour la deuxième fois un T4 à La Couronne (Martigues). Ils sont enthousiastes : madame dit ‘notre chambre, on la mettrait côté jardin', monsieur demande ‘et ensuite, comment ça se passe ?'. Le négociateur, mal à l'aise, enchaîne dix minutes d'arguments sur le quartier. Le couple repart ‘pour réfléchir' et achète ailleurs le lendemain. »",
          "En binômes, 4 minutes pour répondre à trois questions : 1) Quels signaux d'achat le négociateur a-t-il ratés ? 2) Quelle erreur de closing a-t-il commise et comment s'appelle-t-elle ? 3) Rejouer la scène : qu'aurait-il dû dire, mot pour mot, au lieu des dix minutes d'arguments ?",
          "Restitution : 2 ou 3 binômes partagent leur reformulation à l'oral ; le groupe vote pour la conclusion la plus naturelle.",
          "L'animateur conclut sur la règle d'or : dès le signal, on arrête d'argumenter et on engage la conclusion, sous peine de survente."
        ],
        "animation": [
          "Laisser les binômes buter sur la question 3 : c'est en cherchant les mots exacts qu'ils progressent. Circuler et souffler des amorces (« notre chambre côté jardin, vous disiez… donc je prépare l'offre ? »).",
          "Faire nommer la survente et la peur du non : relier au brise-glace du début.",
          "Valoriser les reformulations courtes : une bonne conclusion tient en une phrase + un silence."
        ],
        "corrige": [
          "Signaux ratés : le futur de possession (« notre chambre »), la projection d'aménagement, la question de l'après (« comment ça se passe ensuite ? ») : le bien était vendu dans leur tête.",
          "Erreur : la survente par peur du non ; en continuant d'argumenter, il a réveillé le doute et laissé l'émotion retomber.",
          "Reformulation type : « Je vous arrête : ‘notre chambre côté jardin', vous y êtes déjà. On est d'accord, l'emplacement, le budget, les chambres, tout vous convient ? (oui) Alors on ne laisse pas filer : je prépare votre offre maintenant, elle est valable 7 jours, sans aucun versement. » Puis silence."
        ]
      },
      {
        "titre": "Brainstorm mural : « Nos vraies raisons d'urgence »",
        "type": "Brainstorm",
        "duree": "10 min",
        "consignes": [
          "L'animateur pose la question centrale au paperboard : « Quelles urgences RÉELLES et HONNÊTES pouvons-nous utiliser pour aider un client à décider, sans jamais mentir ? »",
          "Chaque négociateur écrit ses idées sur des post-it (une idée par post-it), 3 minutes, puis vient les coller au mur en les lisant.",
          "L'animateur regroupe les post-it par thèmes (autres visites réelles, tension du marché local, taux, saisonnalité, rareté du bien…) et barre en rouge toute idée qui frôle la fausse urgence ou l'invention.",
          "Co-construire une courte liste d'arguments d'urgence déontologiques réutilisables sur le terrain à Martigues, photographiée et envoyée au groupe après la séance."
        ],
        "animation": [
          "Accueillir toutes les idées d'abord, trier ensuite : la phase de production ne se censure pas.",
          "Dès qu'une idée flirte avec le mensonge (« dire qu'on a déjà une offre quand c'est faux »), s'en servir comme contre-exemple pédagogique : illégal, art. pratiques trompeuses, et un cas vécu qui coûte dix recommandations.",
          "Terminer sur la règle : l'urgence est un moteur légitime seulement si elle est vraie et vérifiable."
        ],
        "corrige": [
          "Urgences légitimes : d'autres visites ou offres réellement programmées, un bien rare sur le secteur, une fenêtre de taux ou de saison, un vendeur pressé par un projet daté, la priorité qu'offre une offre écrite immédiate.",
          "Interdits (barrés) : faux acquéreur, fausse offre, fausse deuxième visite, délai inventé : pratique commerciale trompeuse, responsabilité de l'agent engagée."
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "Faire accepter l'offre au vendeur, au téléphone",
        "contexte": "Transaction à Martigues. Un acquéreur financé, sans bien à vendre au préalable, a signé une offre écrite à 305 000 € sur un bien mandaté 319 000 €. Le négociateur appelle le vendeur pour présenter l'offre et obtenir son accord. Mise en situation réellement téléphonique : les deux joueurs sont dos à dos pour ne travailler qu'à la voix.",
        "roleA": "Le négociateur : présente l'offre avec son contexte (acquéreur sérieux, financé, rapide), pose une vraie question de conclusion (« On l'accepte ? »), puis TIENT LE SILENCE. Il ne doit ni baisser spontanément les honoraires ni rouvrir la négociation du prix par malaise.",
        "roleB": "Le vendeur : espérait le prix du mandat, reste silencieux quelques secondes après la question, puis lâche une objection (« c'est 14 000 € de moins, je ne sais pas… »). Il signera si le négociateur tient le silence, valorise la solidité du dossier et re-pose la question après avoir traité l'objection.",
        "objectif": "S'entraîner à présenter une offre par son contexte (pas seulement un chiffre), à poser une question de conclusion fermée et à tenir physiquement le silence de 5 à 15 secondes sans le combler.",
        "debrief": [
          "Le négociateur a-t-il tenu le silence après sa question, ou l'a-t-il comblé par un argument ou une baisse ?",
          "A-t-il présenté le contexte (financement, rapidité, solidité) ou seulement le montant ?",
          "A-t-il re-posé la question de conclusion après avoir traité l'objection, plutôt que d'abandonner ?",
          "Le vendeur s'est-il senti conseillé et respecté (gagnant-gagnant) ou mis sous pression ?",
          "Chronométrer le silence réel tenu et le comparer au ressenti du négociateur (« ça m'a paru une éternité ») pour dédramatiser."
        ]
      },
      {
        "titre": "Conclure la prise de mandat face à « je veux comparer »",
        "contexte": "Chez CENTURY 21 Icaza Immobilier à Martigues, après un avis de valeur à 320 000 € sur une maison, le vendeur est convaincu de la valeur mais veut « réfléchir et voir deux autres agences avant de signer ». Le négociateur veut conclure le mandat aujourd'hui, idéalement en exclusivité 3 mois, sans brader ses honoraires.",
        "roleA": "Le négociateur : enchaîne juste après l'avis de valeur, lève la dernière objection (« qu'est-ce qui vous empêcherait de me confier la vente aujourd'hui ? »), valorise l'exclusivité en une phrase, utilise alternative + présomption, et a son mandat prêt à signer. Il ne rouvre pas le débat des honoraires dans la précipitation.",
        "roleB": "Le vendeur : poli mais prudent, veut comparer, teste la réaction du négociateur (« les autres sont peut-être moins chers »). Il acceptera de démarrer aujourd'hui si le négociateur prouve son résultat (ventes récentes dans le quartier), s'engage sur un suivi écrit et répond sans se braquer sur le prix.",
        "objectif": "S'entraîner à conclure un mandat sans laisser repartir le vendeur « pour réfléchir », en faisant sortir le vrai frein et en défendant l'exclusivité et les honoraires avec sérénité.",
        "debrief": [
          "Le négociateur a-t-il fait exprimer le vrai frein (prix du service ? confiance ? comparaison de principe ?) avant de répondre ?",
          "A-t-il valorisé l'exclusivité par le bénéfice (interlocuteur unique, plan marketing, vente plus rapide) sans la survendre ?",
          "A-t-il tenu ses honoraires sans les brader sous la pression de conclure ?",
          "A-t-il proposé une date de mise en marché et un engagement de suivi concret ?",
          "A-t-il pensé au délai de rétractation de 14 jours du vendeur-consommateur si le mandat est signé hors établissement (à domicile) ?"
        ]
      }
    ],
    "pointsCles": [
      "Le pire closing est celui qu'on ne tente pas : une vente non demandée est perdue à coup sûr. Oser demander la décision fait partie du service rendu au client.",
      "Dès qu'un signal d'achat apparaît (projection, question de détail, futur de possession, demande de l'après), on arrête d'argumenter : trop vendre quand c'est gagné réveille des objections (la survente).",
      "Le closing se prépare en amont : conclusions d'essai, escalier de petits oui et pré-cadrage font que la décision est déjà largement prise au moment de la question finale.",
      "On adapte la technique au profil et au moment : alternative, bilan, dernière objection, présomption, projection : jamais « oui ou non », toujours deux modalités d'un même oui.",
      "Poser une question de conclusion fermée et claire, une seule fois, puis se taire : le premier qui parle perd. Ne jamais combler le silence ni baisser le prix par malaise.",
      "On retente après chaque objection traitée : la majorité des ventes se signent après une ou plusieurs objections levées, rarement du premier coup.",
      "Pas de mandat écrit, pas de closing (loi Hoguet) ; à l'offre, aucune somme exigée de l'acquéreur (art. 1589-1 du Code civil) ; une offre au prix acceptée rend la vente parfaite (art. 1583).",
      "Jamais de fausse urgence ni de faux acquéreur : c'est une pratique commerciale trompeuse, illégale, qui engage la responsabilité de l'agent et ruine la relation.",
      "Le oui n'est pas la fin : on verrouille par écrit immédiatement, on prévient le remords de l'acheteur (délai SRU de 10 jours) en restant présent et en ré-ancrant les raisons d'achat.",
      "La vente se perd souvent entre le compromis et l'acte : rétroplanning partagé, relances de chaque acteur et gagnant-gagnant pour que l'accord tienne jusqu'à la signature."
    ],
    "planAction": [
      "Dès demain, à chaque visite ou rendez-vous, poser au moins une conclusion d'essai dès le premier signal d'achat, puis enchaîner la question de conclusion sans ajouter d'argument.",
      "Pré-cadrer systématiquement en début de rendez-vous : annoncer qu'on pourra poser une offre ou signer le mandat le jour même si tout convient.",
      "S'imposer la règle du silence : après la question de conclusion, compter mentalement jusqu'à 10 avant de reparler, sans jamais combler ni baisser le prix.",
      "Ne plus jamais laisser repartir un acquéreur « chaud » sans offre écrite : faire écrire sur-le-champ, en rappelant qu'aucune somme n'est exigée à ce stade (art. 1589-1).",
      "Vérifier avant chaque closing que le mandat écrit est signé et prêt, et annoncer clairement les délais protecteurs (SRU 10 jours, condition suspensive de prêt) pour sécuriser la vente.",
      "Rappeler chaque acquéreur dans les 24 heures suivant le oui pour conforter son choix, verrouiller par un mail récapitulatif et prévenir le remords pendant le délai de rétractation."
    ],
    "notesFormateur": [
      "Alterner strictement apport court (10 min max) et jeu : le module est dense (droit + technique + posture), le rythme soutenu évite le cours magistral et ancre par la pratique.",
      "Faire reposer l'ancrage sur le vécu : relier en permanence les jeux aux histoires du brise-glace (« le oui qui a échappé ») et aux secteurs réels (La Couronne, Jonquières, Martigues) pour que rien ne paraisse théorique.",
      "Soigner le temps : afficher l'agenda minuté, nommer un gardien du temps dans la salle, et tenir le chrono visible sur les défis. Si on déborde, sacrifier le brainstorm (jeu 5) plutôt qu'un jeu de rôle.",
      "Sur les jeux de rôle, filmer ou faire chronométrer le silence : c'est l'exercice le plus inconfortable et le plus formateur ; dédramatiser en montrant que 8 secondes paraissent interminables mais passent très bien côté client.",
      "Faire participer tout le monde : constituer les équipes en mélangeant anciens et juniors, donner la parole aux plus silencieux sur les débriefs, valoriser les justifications plutôt que les bonnes réponses.",
      "En synthèse, exiger un plan d'action écrit et individuel (pas collectif) : chaque négociateur repart avec 2 ou 3 engagements datés, que le manager ré-abordera en point individuel la semaine suivante pour transformer l'acquis en habitude."
    ]
  },
  "defendre-prix": {
    "id": "defendre-prix",
    "sousTitre": "Assumer sa commission, prouver sa valeur et n'échanger une concession que contre un avantage : 1h45 pour transformer chaque négo d'honoraires en net gagné.",
    "objectifs": [
      "Savoir annoncer ses honoraires en euros et en TTC, avec aplomb, au bon moment de la prise de mandat.",
      "Maîtriser les 4 raisons chiffrées de ne jamais brader (dévalorisation, marge, précédent, ancrage) et les restituer en situation.",
      "Être capable de traiter les 6 objections les plus fréquentes avec la méthode A.C.R.E. et des scripts rodés.",
      "Savoir démontrer la valeur apportée face au PAP, aux mandataires et au discount, sans jamais dénigrer un confrère.",
      "Maîtriser la négociation d'une concession par la formule « si… alors… » : aucun geste sans contrepartie écrite.",
      "Être capable de citer sans hésiter le cadre juridique (honoraires libres depuis l'ordonnance de 1986, commission due seulement à l'acte — loi Hoguet, affichage TTC loi ALUR)."
    ],
    "agenda": [
      {
        "titre": "Accueil, objectifs et règle du jeu de la séance",
        "duree": "5 min"
      },
      {
        "titre": "Brise-glace : « Le dernier point lâché » (tour de table chiffré)",
        "duree": "10 min"
      },
      {
        "titre": "Apport 1 : pourquoi ne jamais brader — les maths de la concession et l'ancrage",
        "duree": "15 min"
      },
      {
        "titre": "Jeu 1 : Quiz-battle en équipes « Défends ton prix »",
        "duree": "15 min"
      },
      {
        "titre": "Apport 2 : ce que financent vos honoraires + cadre juridique (1986 / Hoguet / ALUR)",
        "duree": "10 min"
      },
      {
        "titre": "Jeu 2 : Vrai/Faux debout « Droit & honoraires »",
        "duree": "10 min"
      },
      {
        "titre": "Apport 3 : annoncer avec aplomb + méthode A.C.R.E.",
        "duree": "10 min"
      },
      {
        "titre": "Jeu 3 : Défi chrono des objections (cartes-objections)",
        "duree": "10 min"
      },
      {
        "titre": "Jeu de rôle : prise de mandat à 350 000 € + débrief collectif",
        "duree": "20 min"
      },
      {
        "titre": "Synthèse : les points-clés + plan d'action individuel du lendemain",
        "duree": "10 min"
      }
    ],
    "briseGlace": {
      "titre": "Le dernier point lâché",
      "consignes": [
        "Demandez à chacun, en tour de table rapide, de citer de mémoire la dernière fois où il a baissé ses honoraires : à quel pourcentage il est descendu, et surtout combien d'euros cela représentait sur le dossier (montant perdu, pas le pourcentage).",
        "Notez les montants au paperboard, colonne « € lâchés ». Faites additionner le total de l'équipe à voix haute : l'effet de masse crée le déclic.",
        "Reliez immédiatement au thème : « Ce total, c'est du net qui ne reviendra jamais. Aujourd'hui, on apprend à ne plus le lâcher — ou à l'échanger. » Enchaînez sur les objectifs.",
        "Variante si l'équipe est gênée de parler argent : faites écrire le montant sur un post-it anonyme, collez-les, puis commentez le total."
      ]
    },
    "jeux": [
      {
        "titre": "Quiz-battle « Défends ton prix »",
        "type": "Quiz-battle en équipes",
        "duree": "15 min",
        "consignes": [
          "Constituez 2 à 3 équipes. Chaque équipe choisit un nom et désigne un porte-parole qui seul donne la réponse finale (évite qu'un seul leader monopolise).",
          "Posez 8 questions tirées du quiz du module, projetées une par une au PowerPoint. Laissez 20 secondes de concertation à voix basse par question.",
          "Au top, les porte-parole lèvent un carton numéroté (1 à 4) correspondant à l'option choisie. 1 point par bonne réponse, 2 points si l'équipe sait citer le texte de loi ou le chiffre exact (ex. « ordonnance de 1986 », « 3 500 € perdus »).",
          "Après chaque question, l'animateur lit l'explication et illustre par un exemple local (Martigues, Port-de-Bouc, Istres).",
          "Tenez le score au paperboard. L'équipe gagnante choisit en premier son rôle dans le jeu de rôle final (motivation)."
        ],
        "animation": [
          "Rythmez : un buzzer sonore ou un simple « top ! » maintient l'énergie. Ne laissez pas débattre plus de 20 secondes.",
          "Valorisez la précision juridique : le bonus « cite le texte » ancre durablement l'ordonnance de 1986 et la loi Hoguet.",
          "Si une équipe se trompe, demandez à une autre de corriger avant de donner la réponse : la correction par les pairs marque plus."
        ],
        "corrige": [
          "Brader au premier doute → dévalorise la prestation et entame directement la marge (pas de coût variable à amortir).",
          "« Vos honoraires sont élevés » → démontrer la valeur (meilleur net, sécurité, temps gagné), ne jamais se justifier.",
          "Honoraires libres depuis l'ordonnance n° 86-1243 du 1er décembre 1986 ; barème affiché TTC, négociable à la baisse.",
          "Commission due seulement une fois la vente conclue — art. 6 loi Hoguet ; payé le jour de l'acte authentique.",
          "Passer de 5 % à 4 % sur 350 000 € = 3 500 € perdus, soit 20 % de la rémunération du dossier.",
          "A.C.R.E. = Accueillir, Creuser, Recadrer, Engager.",
          "Barème dégressif = le taux diminue quand le prix du bien augmente.",
          "5 % TTC ≈ 4,17 % HT (TVA 20 %)."
        ]
      },
      {
        "titre": "Vrai / Faux debout « Droit & honoraires »",
        "type": "Vrai/Faux dynamique",
        "duree": "10 min",
        "consignes": [
          "Tout le monde se lève. L'animateur annonce une affirmation. « Vrai » = on reste debout ; « Faux » = on s'assoit. Pas de carton, c'est le corps qui répond — personne ne se cache derrière le voisin.",
          "Marquez un temps après chaque affirmation, regardez la salle, puis donnez la réponse et la justification.",
          "Celui qui se trompe gagne le droit… d'argumenter : demandez-lui d'expliquer pourquoi il pensait l'inverse. On transforme l'erreur en apprentissage.",
          "Enchaînez 8 à 10 affirmations rapides, en alternant évidences et pièges."
        ],
        "animation": [
          "Glissez volontairement des pièges de vocabulaire (ex. « les honoraires s'annoncent HT ») pour corriger les réflexes de langage.",
          "Gardez le rythme vif : c'est un jeu d'énergie post-apport, pas un cours.",
          "Reliez chaque réponse à une phrase à réemployer sur le terrain."
        ],
        "corrige": [
          "« L'État fixe un tarif maximum d'honoraires » → FAUX : honoraires libres depuis 1986, le barème de l'agence fait foi (plafond propre, négociable à la baisse).",
          "« Je peux dépasser mon barème affiché si le client est d'accord » → FAUX : le barème affiché est un plafond, jamais un plancher.",
          "« Les honoraires s'annoncent toujours en TTC » → VRAI : TVA 20 % incluse (loi ALUR / arrêté du 10 janvier 2017) ; 5 % TTC ≈ 4,17 % HT.",
          "« Je touche ma commission dès la signature du mandat » → FAUX : rien n'est dû avant l'acte authentique (loi Hoguet, art. 6).",
          "« Prix FAI = net vendeur + honoraires » → VRAI.",
          "« Honoraires à la charge de l'acquéreur distinctement mentionnés = droits de mutation calculés hors honoraires » → VRAI : léger gain pour l'acquéreur.",
          "« Dénigrer le mandataire d'à côté est autorisé si c'est vrai » → FAUX : contraire à la déontologie (décret n° 2015-1090).",
          "« Un barème dégressif augmente avec le prix du bien » → FAUX : il diminue."
        ]
      },
      {
        "titre": "Défi chrono des objections",
        "type": "Défi chrono / cartes-objections",
        "duree": "10 min",
        "consignes": [
          "Préparez un jeu de cartes, une objection par carte (voir corrigé). Chaque participant tire une carte au hasard et a 30 secondes de préparation.",
          "Au top, il répond à voix haute, debout, face au groupe, comme s'il avait le vendeur en face. Chrono visible : 45 secondes maximum pour dérouler A.C.R.E.",
          "Le groupe évalue à main levée : la réponse tenait-elle le prix sans dénigrer ni s'excuser ? L'animateur relève un point fort et un axe d'amélioration.",
          "Faites tourner jusqu'à ce que chacun soit passé au moins une fois ; gardez les objections les plus dures pour les profils les plus à l'aise."
        ],
        "animation": [
          "Imposez la contrainte « une phrase calme vaut mieux qu'un plaidoyer » : coupez les réponses qui partent en justification bavarde.",
          "Traquez le langage perdant : « petite commission », « seulement », « désolé », « normalement » — faites reformuler sur-le-champ.",
          "Rappelez le silence stratégique : après le recadrage, on se tait. Chronométrez-le, c'est le plus dur à tenir."
        ],
        "corrige": [
          "« C'est trop cher. » → « Élevé par rapport à quoi ? À ce que vous allez gagner et sécuriser, c'est un très bon placement. Ce qui compte, c'est votre net, pas le pourcentage. »",
          "« Le mandataire d'à côté prend 3 %. » → Jamais de dénigrement : « C'est possible. La vraie question n'est pas qui est le moins cher, mais qui vous vend le mieux. Un bien qui traîne 5 % moins cher coûte plus cher qu'un point de commission. »",
          "« Autant d'argent pour quelques visites ? » → « Les visites sont la partie visible. Vous payez l'estimation juste, la mise en valeur, la diffusion, la sélection d'acquéreurs financés, la négociation, la sécurité juridique, le suivi jusqu'à l'acte — et seulement si ça aboutit. »",
          "« Je vais d'abord essayer de vendre seul. » → « C'est votre droit. Donnons-nous deux semaines : je vous montre ce que je fais que vous ne pouvez pas faire seul, sans griller le bien à un prix mal calibré. »",
          "« J'ai déjà un acheteur / c'est pour un proche. » → « Intégrons-le au mandat : même avec un acquéreur connu, il vous faut un prix juste, un avant-contrat sécurisé et le suivi jusqu'à l'acte. On adapte la mission, pas le risque juridique. »",
          "« Baissez et je signe tout de suite. » → On n'échange jamais sans contrepartie : « Avec plaisir si on avance ensemble : partons en exclusivité et au juste prix, et j'étudie un geste car je me rattrape sur l'efficacité. »"
        ]
      },
      {
        "titre": "Brainstorm « preuves de valeur »",
        "type": "Brainstorm minuté",
        "duree": "10 min",
        "consignes": [
          "Au paperboard, tracez deux colonnes : « Ce que je fais que le PAP ne peut pas faire » et « Mes preuves chiffrées à sortir en rendez-vous ».",
          "En 5 minutes chrono, chacun lance des idées sans filtre, l'animateur note tout. Visez la quantité (objectif : 20 items).",
          "En 3 minutes, le groupe sélectionne les 5 preuves les plus percutantes et locales (délai de vente moyen, taux de concrétisation, ventes comparables récentes à Martigues via la base DVF, réseau d'acquéreurs CENTURY 21, avis clients).",
          "Chaque négociateur repart avec sa « liste de 5 preuves » notée sur sa fiche : c'est son argumentaire de valeur personnalisé."
        ],
        "animation": [
          "Interdisez la critique pendant la phase de production d'idées : on trie après, pas pendant.",
          "Poussez vers le concret et le local : un chiffre réel du secteur vaut dix généralités.",
          "Faites verbaliser la bascule « je chiffre la valeur, pas l'effort » : 3 à 5 % de prix de vente gagnés sur 300 000 € = 9 000 à 15 000 €, souvent plus que les honoraires."
        ],
        "corrige": [
          "Preuves attendues : délai de vente moyen de l'agence, taux de concrétisation, ventes comparables récentes (DVF, références notariales), réseau d'acquéreurs en portefeuille, notoriété de l'enseigne, avis clients et recommandations.",
          "Argument acquéreur concret : honoraires à sa charge = ~6 % du montant des honoraires économisés sur les frais de notaire (≈ 900 € sur 15 000 € d'honoraires)."
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "La prise de mandat à 350 000 €",
        "contexte": "Maison à Martigues, 350 000 € net vendeur, barème agence 5 % TTC (17 500 €). Le vendeur a reçu un mandataire qui propose 3 %. Rendez-vous de prise de mandat au domicile du vendeur. Le négociateur a déroulé son plan de commercialisation et doit maintenant annoncer puis défendre ses honoraires.",
        "roleA": "Le négociateur CENTURY 21 : il annonce 17 500 € / 5 % TTC en euros et avec aplomb, se tait après l'annonce, traite les objections par A.C.R.E., et n'accorde un geste (jusqu'à 4,7 % = 16 450 €) qu'en échange d'une exclusivité et d'un prix calé au juste niveau.",
        "roleB": "Le vendeur : sympathique mais pingre, il enchaîne « c'est cher », « le mandataire prend 3 % », « faites un geste et je signe ». Il teste la fermeté du négociateur et guette la moindre hésitation de langage.",
        "objectif": "Obtenir le mandat sans brader : soit à 5 % assumé, soit au maximum à 4,7 % contre exclusivité + juste prix, avec un geste présenté comme final et formalisé par écrit.",
        "debrief": [
          "Le montant a-t-il été annoncé en euros et en TTC, puis suivi d'un silence tenu ? Repérer le premier qui a parlé après le chiffre.",
          "A-t-on entendu un mot perdant (« petite », « seulement », « désolé ») ou une justification défensive bavarde ?",
          "La concession a-t-elle été échangée (si… alors… exclusivité + juste prix) et annoncée comme finale, ou donnée pour faire plaisir ?",
          "Le confrère a-t-il été dénigré ? Rappeler la déontologie (décret 2015-1090) et la bascule sur « qui vend le mieux ».",
          "Chiffrer le résultat : 4,7 % = 1 050 € cédés au lieu de 3 500 €, et l'exclusivité gagnée. Faire sentir la différence au groupe.",
          "Recueillir une phrase que chacun garde pour demain."
        ]
      },
      {
        "titre": "L'objection téléphonique « vos frais »",
        "contexte": "Appel entrant : un propriétaire à Port-de-Bouc a vu l'annonce d'un bien et demande une estimation. En fin d'appel, il lâche : « Et vous prenez combien, vous ? J'ai vu qu'on pouvait vendre sans frais sur Le Bon Coin. » Le négociateur doit cadrer sans dérouler toute la négo au téléphone.",
        "roleA": "Le négociateur : il reste ferme et chaleureux, ne donne pas de remise au téléphone, repousse la discussion du prix après la démonstration de valeur et décroche un rendez-vous physique.",
        "roleB": "Le propriétaire : pressé, un peu méfiant, tenté par le PAP, il veut un chiffre tout de suite et cherche à faire dire « c'est négociable ».",
        "objectif": "Ne pas s'engager sur un pourcentage au téléphone, valoriser le résultat (net + sécurité), et obtenir un rendez-vous en face à face.",
        "debrief": [
          "Le négociateur a-t-il évité de brader ou de dire « c'est négociable » au téléphone ?",
          "A-t-il su repousser la négociation après la démonstration de valeur (« on en reparle quand je vous aurai montré comment j'y arrive ») ?",
          "Le PAP a-t-il été traité sans mépris, en recentrant sur le net final et le risque juridique ?",
          "A-t-il obtenu le rendez-vous — le seul vrai objectif de l'appel ?"
        ]
      }
    ],
    "pointsCles": [
      "On ne défend pas un tarif, on assume une valeur : les honoraires ne coûtent pas au client, ils lui rapportent (meilleur net + sécurité + temps gagné).",
      "Les maths de la concession : sur 350 000 €, passer de 5 % à 4 % = 3 500 € perdus, soit 20 % de la rémunération du dossier — et surtout de votre propre paie.",
      "Annoncer tôt, en euros et en TTC, avec aplomb, puis se taire : le silence après le chiffre est votre meilleur allié.",
      "Technique du sandwich : valeur → prix → valeur. Bannir « petite », « seulement », « désolé », « normalement ».",
      "Traiter l'objection avec A.C.R.E. : Accueillir, Creuser, Recadrer (sur le net, pas le pourcentage), Engager.",
      "Jamais de concession sans contrepartie : formule « si… alors… » (exclusivité, durée ferme, juste prix, recommandation, souplesse visites), geste petit, final et écrit.",
      "Ne jamais dénigrer un confrère (déontologie, décret 2015-1090) : on montre sa différence, on recentre sur « qui vend le mieux et le plus sûrement ».",
      "Le cadre juridique est un atout : honoraires libres depuis l'ordonnance du 1er décembre 1986, affichés TTC (loi ALUR), dus seulement à l'acte authentique (loi Hoguet, art. 6) — vous prenez tout le risque à la place du client.",
      "Face au discount et au PAP : moins d'honoraires = souvent moins de moyens ; l'économie est mangée par la décote du bien qui traîne.",
      "Défendre le juste prix du bien = défendre sa crédibilité : qui tient le prix du bien inspire confiance pour tenir le sien."
    ],
    "planAction": [
      "Dès demain, annoncer mes honoraires en euros et en TTC (pas en pourcentage abstrait), puis tenir le silence 3 secondes avant toute relance.",
      "Préparer avant chaque rendez-vous de mandat mon montant en euros pour ce bien + mes 5 preuves de valeur locales (délai moyen, taux de concrétisation, ventes comparables DVF, réseau d'acquéreurs, avis clients).",
      "Lister et garder sur moi ma grille de contreparties (exclusivité, durée ferme, juste prix, recommandation, souplesse visites) : décider à l'avance jusqu'où je peux descendre et contre quoi.",
      "Appliquer A.C.R.E. sur la prochaine objection « c'est cher » et me forcer à poser la question « élevé par rapport à quoi ? » avant toute réponse.",
      "Ne formaliser aucune remise sans l'écrire dans le mandat ou un avenant, avec la contrepartie obtenue et le nouveau montant.",
      "Chasser de mon vocabulaire « petite commission », « seulement », « désolé » et toute justification bavarde pendant une semaine, et le vérifier après chaque rendez-vous."
    ],
    "notesFormateur": [
      "Gérez le temps avec un minuteur visible à chaque jeu : les activités débordent vite, mieux vaut couper net un défi chrono que rogner sur le jeu de rôle final, qui est le cœur de la séance.",
      "Faites parler ceux qui bradent le plus : repérez-les au brise-glace (gros montants lâchés) et confiez-leur le rôle du négociateur au jeu de rôle, pas celui du vendeur, pour qu'ils pratiquent la fermeté.",
      "Ancrez par la répétition active : faites redire à voix haute les 3 mnémoniques (A.C.R.E. / valeur-prix-valeur / si… alors…) à plusieurs moments, pas une seule fois en synthèse.",
      "Incarnez le vendeur difficile vous-même lors du premier jeu de rôle pour donner le niveau, puis laissez les binômes jouer : votre exemple vaut dix consignes.",
      "Reliez systématiquement au terrain local (Martigues, Port-de-Bouc, Istres) et à des montants réels : le concret chiffré marque bien plus que la théorie.",
      "Terminez sur l'engagement individuel : chaque négociateur énonce à voix haute son action du lendemain devant le groupe — l'engagement public multiplie le passage à l'acte."
    ]
  },
  "transaction-notaire": {
    "id": "transaction-notaire",
    "sousTitre": "De l'offre acceptée à la remise des clés : devenez le chef d'orchestre de vos ventes",
    "objectifs": [
      "Être capable de dérouler oralement les 6 étapes d'une transaction (du mandat à l'acte) et d'annoncer un calendrier réaliste de 3 à 4 mois à ses clients.",
      "Savoir expliquer en termes simples le rôle du notaire, ses trois super-pouvoirs (authenticité, date certaine, force exécutoire) et rassurer sur le coût identique de deux notaires.",
      "Maîtriser les règles du séquestre et du dépôt de garantie (5 à 10 %, séquestre chez le notaire, restitution sous 21 jours) et les scénarios de sort du dépôt.",
      "Être capable de détecter en amont les droits de préemption (commune, locataire, SAFER, indivision) et les signataires obligatoires (indivision, couples, succession, SCI, personnes protégées) avant de prendre un mandat.",
      "Savoir décomposer et expliquer les frais d'acquisition (~7 à 8 % dans l'ancien, ~2 à 3 % dans le neuf) pour sécuriser le budget réel de l'acquéreur.",
      "Maîtriser la préparation du jour de l'acte authentique (dossier complet, conditions purgées, fonds virés) pour éviter tout report de signature."
    ],
    "agenda": [
      {
        "titre": "Accueil et brise-glace « Vrai ou intox ? » (lancement du groupe, mise en énergie)",
        "duree": "10 min"
      },
      {
        "titre": "Apport 1 : le déroulé complet d'une transaction (les 6 étapes, les délais clés, M-V-O-A-S-A)",
        "duree": "15 min"
      },
      {
        "titre": "Jeu 1 : Quiz-battle en équipes « Les champions de la transaction »",
        "duree": "15 min"
      },
      {
        "titre": "Apport 2 : le notaire, le séquestre et le dépôt de garantie (rôle, fonds, LCB-FT)",
        "duree": "15 min"
      },
      {
        "titre": "Jeu 2 : Vrai/Faux debout « Le mur des idées reçues »",
        "duree": "10 min"
      },
      {
        "titre": "Apport 3 : qui peut vendre ? préemptions, frais d'acquisition, titre de propriété",
        "duree": "15 min"
      },
      {
        "titre": "Jeu 3 : Défi chrono « Le bon séquençage » + Jeu 4 : Étude de cas « Le dossier qui coince »",
        "duree": "20 min"
      },
      {
        "titre": "Jeu de rôle : mise en situation téléphonique / face client (rassurer, expliquer, sécuriser)",
        "duree": "20 min"
      },
      {
        "titre": "Synthèse : les points-clés à retenir et questions",
        "duree": "10 min"
      },
      {
        "titre": "Plan d'action individuel : chacun note ses 3 engagements pour le terrain",
        "duree": "10 min"
      }
    ],
    "briseGlace": {
      "titre": "Vrai ou intox ? Le mythe des « frais de notaire »",
      "consignes": [
        "Projetez une seule phrase à l'écran : « Le notaire garde l'intégralité des frais de notaire. » Demandez à chacun de se positionner physiquement : à droite de la salle si « Vrai », à gauche si « Intox ».",
        "Interrogez 2 ou 3 personnes de chaque côté : « Pourquoi vous êtes-vous placé là ? » Laissez le débat s'installer 2 minutes sans trancher.",
        "Révélez : c'est une INTOX. Le notaire ne garde qu'une petite part (ses émoluments ≈ 1,1 % du prix) ; l'essentiel, ce sont les droits de mutation (impôts). Annoncez que la séance va justement outiller chacun pour ne plus jamais être pris au dépourvu sur ces sujets face à un client.",
        "Enchaînez sur la promesse de la séance : « À la fin, vous saurez expliquer, chiffrer et rassurer sur tout le parcours, de l'offre acceptée à la remise des clés. »"
      ]
    },
    "jeux": [
      {
        "titre": "Les champions de la transaction",
        "type": "Quiz-battle en équipes",
        "duree": "15 min",
        "consignes": [
          "Constituez 2 à 3 équipes de niveau mixte (mélangez juniors et confirmés). Chaque équipe choisit un nom et désigne un porte-parole.",
          "Posez 10 questions tirées du quiz du module, à l'oral, en affichant les 4 options au PowerPoint. L'équipe se concerte 15 secondes puis le porte-parole annonce la réponse (A, B, C ou D).",
          "1 point par bonne réponse. Bonus de 1 point si l'équipe justifie correctement sa réponse (ex : « 2 mois pour la préemption car silence = renonciation »).",
          "Questions recommandées : rôle du notaire, attestation provisoire après vente, coût de deux notaires, délai de rétractation (10 j), indivision/unanimité, plus grosse part des frais (droits de mutation), durée moyenne (3-4 mois), 1re cause d'échec (condition de prêt), opposabilité aux tiers (publicité foncière), origine de propriété (30 ans).",
          "Tenez le score au tableau. L'équipe gagnante est applaudie ; distribuez un petit lot symbolique (café offert, premier choix sur un prochain mandat entrant…)."
        ],
        "animation": [
          "Rythmez : chrono visible, musique courte pendant la concertation pour l'énergie.",
          "Après chaque réponse, redonnez l'explication en une phrase et reliez-la à une situation terrain concrète du secteur (Martigues, étang de Berre).",
          "Veillez à ce que le porte-parole tourne entre les manches pour que chacun s'exprime."
        ],
        "corrige": [
          "Le notaire = officier public qui authentifie les actes.",
          "Attestation après vente = provisoire, en attendant la copie authentique.",
          "Deux notaires = même prix (partage des émoluments).",
          "Délai de rétractation = 10 jours calendaires.",
          "Indivision = unanimité (art. 815-3 du Code civil).",
          "Plus grosse part des frais = droits de mutation (DMTO).",
          "Durée moyenne accord → clés = 3 à 4 mois.",
          "1re cause d'échec = condition suspensive de prêt non réalisée.",
          "Opposabilité aux tiers = publication au service de la publicité foncière.",
          "Origine de propriété = 30 ans (prescription acquisitive)."
        ]
      },
      {
        "titre": "Le mur des idées reçues",
        "type": "Vrai/Faux debout",
        "duree": "10 min",
        "consignes": [
          "Tout le monde se lève. Annoncez : « Je lis une affirmation. Si c'est VRAI, vous restez debout ; si c'est FAUX, vous vous asseyez. »",
          "Lisez les affirmations une à une, laissez 3 secondes, puis demandez à une personne « mal positionnée » (ou bien positionnée) de justifier avant de donner la réponse.",
          "Affirmations à lire : (1) « On peut annoncer au vendeur que c'est vendu dès l'offre acceptée. » (2) « L'agence peut toujours encaisser le dépôt de garantie sur son compte. » (3) « Un bien loué vendu occupé déclenche un droit de préemption du locataire. » (4) « Le dépôt de garantie s'ajoute au prix de vente. » (5) « Le logement familial, bien propre d'un seul époux, peut être vendu sans l'accord du conjoint. » (6) « Les frais d'acquisition dans le neuf sont plus faibles que dans l'ancien. »",
          "Comptez les « survivants » debout à la fin pour désigner les plus affûtés."
        ],
        "animation": [
          "Le format debout/assis réveille physiquement le groupe : idéal en milieu de séance.",
          "Jouez la surprise sur les réponses contre-intuitives (2, 3, 5) pour marquer les esprits.",
          "Reformulez systématiquement la bonne pratique après chaque item."
        ],
        "corrige": [
          "(1) FAUX : tant que rétractation et conditions ne sont pas purgées, on parle d'offre acceptée puis de compromis signé, jamais de « vendu ».",
          "(2) FAUX : seulement avec une garantie financière couvrant le maniement de fonds et un compte séquestre dédié ; dans le doute, séquestre chez le notaire.",
          "(3) FAUX : vendu occupé = l'acquéreur reprend le bail, pas de droit de préemption du locataire.",
          "(4) FAUX : il s'impute sur le prix, il n'est pas « en plus ».",
          "(5) FAUX : le logement de la famille exige le consentement des deux conjoints (art. 215 du Code civil), même si le bien est propre.",
          "(6) VRAI : ~2 à 3 % dans le neuf/VEFA contre ~7 à 8 % dans l'ancien (droits de mutation réduits)."
        ]
      },
      {
        "titre": "Le bon séquençage",
        "type": "Défi chrono",
        "duree": "8 min",
        "consignes": [
          "Préparez 6 cartons (ou post-it géants) portant chacun une étape dans le désordre : Mandat, Mise en vente, Offre d'achat, Avant-contrat (compromis), Période suspensive (délais), Acte authentique.",
          "Donnez un jeu de cartons à chaque équipe (2 à 3 équipes). Top chrono : la première équipe à afficher les 6 étapes dans le bon ordre au mur gagne.",
          "L'équipe gagnante doit ensuite citer, pour chaque étape, UN délai ou point de vigilance (ex : rétractation 10 j, préemption 2 mois, condition de prêt 45-60 j).",
          "Faites le lien avec le moyen mnémotechnique du module : M-V-O-A-S-A."
        ],
        "animation": [
          "Préparez les cartons à l'avance (ou 2 jeux A4 plastifiés réutilisables).",
          "Si une seule équipe, jouez contre le chrono (objectif < 60 secondes) et l'animateur tient le temps.",
          "Insistez sur le message central : la vente se perd souvent entre compromis et acte, faute de suivi des jalons."
        ],
        "corrige": [
          "Ordre correct : 1. Mandat → 2. Mise en vente → 3. Offre d'achat → 4. Avant-contrat (compromis) → 5. Période suspensive (rétractation 10 j, préemption 2 mois, condition de prêt 45-60 j) → 6. Acte authentique.",
          "Mnémonique : M-V-O-A-S-A."
        ]
      },
      {
        "titre": "Le dossier qui coince",
        "type": "Étude de cas",
        "duree": "12 min",
        "consignes": [
          "Projetez ou distribuez 3 mini-situations de mandats « piégés », une par sous-groupe de 2-3 personnes. Chaque groupe dispose de 5 minutes pour répondre à : « Peut-on vendre tout de suite ? Qui doit signer ? Quelle pièce ou quel délai anticiper ? »",
          "Cas A : « La maison de la grand-mère décédée l'an dernier, les 3 petits-enfants veulent vendre. » Cas B : « Un appartement loué vide, le propriétaire veut le vendre libre. » Cas C : « Une villa achetée par un couple marié sous la communauté ; seul le mari se présente au RDV mandat. »",
          "Chaque groupe restitue en 1 minute. L'animateur complète et valide.",
          "Reliez chaque cas à l'erreur fréquente correspondante du module (bien invendable, préemption non anticipée, signataire manquant)."
        ],
        "animation": [
          "Circulez entre les groupes pour relancer sans donner la réponse.",
          "Valorisez les bons réflexes « questions à poser dès la prise de mandat ».",
          "Terminez par la règle d'or : pas de mandat complet = pas de vente possible."
        ],
        "corrige": [
          "Cas A (succession) : NON, pas tant que la succession n'est pas réglée. Il faut l'acte de notoriété (qui hérite) + l'attestation immobilière publiée (dans les 6 mois du décès). Les 3 héritiers doivent tous consentir (indivision successorale). Orienter d'abord vers le notaire.",
          "Cas B (locataire) : il faut d'abord donner congé pour vendre (6 mois avant l'échéance du bail). Le congé vaut offre de vente au locataire, prioritaire pendant 2 mois (4 mois s'il recourt à un prêt). Anticiper ce droit dès le mandat.",
          "Cas C (couple communauté) : bien commun → accord des DEUX époux obligatoire (art. 1424). Faire signer le mandat par les deux, ou obtenir une procuration de l'épouse. Signer avec un seul = travailler pour rien."
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "« Rassurez-moi sur les frais de notaire »",
        "contexte": "Un acquéreur primo-accédant appelle (ou est en rendez-vous) pour un appartement affiché 250 000 € dans l'ancien à Martigues. Il est inquiet : « On m'a dit qu'il faut ajouter 8 % de frais de notaire, c'est énorme, c'est le notaire qui empoche tout ça ? Et mon budget max c'est 250 000 €… »",
        "roleA": "Le négociateur, qui doit expliquer la composition des frais d'acquisition (droits de mutation ≈ 4/5, émoluments du notaire ≈ 1,1 %, débours, contribution de sécurité immobilière 0,10 %), déconstruire le mythe, chiffrer (~18 000 à 20 000 €, ~7,5 %) et recadrer le pouvoir d'achat réel (~232 000 € de prix de bien).",
        "roleB": "L'acquéreur primo-accédant, méfiant, qui pose des questions pièges : « Le notaire garde tout ? », « Je peux l'intégrer dans mon prêt ? », « Ça baisse pas depuis 2025 ? » (occasion d'évoquer le régime primo-accédant et le relèvement départemental).",
        "objectif": "S'entraîner à vulgariser les frais d'acquisition, à rassurer sans jargon et à sécuriser le budget total pour ne pas faire visiter hors budget.",
        "debrief": [
          "Le négociateur a-t-il clairement distingué les 4 blocs de frais et insisté sur la faible part réelle du notaire ?",
          "A-t-il pensé à intégrer les frais au budget total (pouvoir d'achat réel) et mentionné qu'ils sont rarement couverts par le prêt ?",
          "A-t-il abordé le régime primo-accédant / le relèvement départemental 2025 avec justesse, sans promettre ce qui dépend du département ?",
          "Le ton était-il pédagogique et rassurant plutôt que technique ?"
        ]
      },
      {
        "titre": "« Deux notaires et un prêt qui tarde »",
        "contexte": "Entre le compromis et l'acte. Le vendeur (notaire de famille à Martigues) et l'acquéreur (qui veut son notaire à Lyon) se crispent ; de plus, l'offre de prêt de l'acquéreur traîne et le vendeur s'impatiente : « Deux notaires, ça va coûter plus cher et ralentir ! Et cet acheteur est-il seulement sérieux ? »",
        "roleA": "Le négociateur, chef d'orchestre, qui doit rassurer sur le coût identique de deux notaires (partage des émoluments), expliquer la possibilité de signer à distance (procuration/visio), et piloter le jalon de la condition suspensive de prêt (relancer le dépôt bancaire, surveiller le délai 45-60 j).",
        "roleB": "Le vendeur stressé et pressé, qui veut une date d'acte ferme tout de suite et doute de l'acquéreur.",
        "objectif": "S'entraîner à tenir le rôle de pilote entre compromis et acte : rassurer, cadrer les délais réalistes, et ne jamais promettre une date d'acte avant que les conditions soient purgées.",
        "debrief": [
          "Le négociateur a-t-il bien dit que deux notaires ne coûtent pas plus cher et évoqué la signature à distance ?",
          "A-t-il expliqué pourquoi la condition de prêt est le jalon n°1 à surveiller, sans alarmer inutilement ?",
          "A-t-il évité de s'engager sur une date d'acte prématurée tout en rassurant le vendeur par un suivi concret ?",
          "A-t-il reformulé le calendrier réaliste (compromis → acte : 2,5 à 4 mois) ?"
        ]
      }
    ],
    "pointsCles": [
      "Le négociateur est le chef d'orchestre de la vente : elle se perd rarement à l'offre, mais entre le compromis et l'acte, faute de suivi des jalons (M-V-O-A-S-A).",
      "Compter 3 à 4 mois entre l'accord et les clés : l'annoncer d'emblée aux deux parties évite les tensions. On dit « offre acceptée », puis « compromis signé », et seulement à l'acte « vente réalisée ».",
      "Le notaire est un officier public ministériel : il authentifie (foi jusqu'à inscription de faux), donne date certaine et force exécutoire. Deux notaires ne coûtent pas plus cher (partage des émoluments).",
      "Dépôt de garantie : usage de 5 à 10 % du prix, imputé sur le prix, séquestré chez le notaire. L'agence ne séquestre que si elle a une garantie financière dédiée. Jamais d'espèces (LCB-FT, Tracfin).",
      "Délais à connaître par cœur : rétractation SRU 10 jours, condition de prêt 45-60 jours, purge de préemption 2 mois, restitution du dépôt sous 21 jours en cas de rétractation.",
      "La condition suspensive de prêt est la 1re cause d'échec des ventes : c'est le jalon à surveiller plus que tout autre.",
      "Détecter tôt les droits de préemption (commune/DPU, locataire, SAFER, indivisaires) : ils peuvent rallonger le calendrier de 2 mois. Ne jamais promettre une date d'acte avant leur purge.",
      "Avant de prendre un mandat, toujours se demander QUI doit signer : indivision = unanimité, couple en communauté = les deux époux, logement familial = les deux conjoints, succession = tous les héritiers (notoriété + attestation publiée), SCI = selon les statuts.",
      "Frais d'acquisition : ~7 à 8 % dans l'ancien, ~2 à 3 % dans le neuf. La plus grosse part = les droits de mutation (impôts), pas le notaire. À intégrer dans le budget réel de l'acquéreur.",
      "Le jour de l'acte se gagne avant : dossier complet transmis au notaire, conditions purgées, fonds virés. Un dossier incomplet = signature reportée. La publication au service de la publicité foncière rend la vente opposable aux tiers."
    ],
    "planAction": [
      "Dès demain, à chaque offre acceptée, j'annonce oralement aux deux parties le calendrier réaliste de 3 à 4 mois et je bannis le mot « vendu » tant que les conditions ne sont pas purgées.",
      "Avant toute signature de mandat, je pose systématiquement la question « qui doit signer pour vendre ? » et je vérifie la situation du bien (loué ? indivision ? succession réglée ? SCI ? couple marié ?) avant de commercialiser.",
      "Je crée (ou mets à jour) une check-list de suivi par dossier avec les 4 jalons critiques : rétractation 10 j, purge de préemption, obtention du prêt, fonds virés — et je la relance chaque semaine.",
      "Je prépare une explication simple et chiffrée des frais d'acquisition (les 4 blocs, la faible part du notaire, ~7,5 % dans l'ancien) pour l'utiliser dès la qualification de chaque acquéreur.",
      "Je noue ou renforce une relation avec 2 à 3 études notariales de mon secteur et je m'engage à leur transmettre des dossiers propres et complets pour gagner des semaines.",
      "Pour tout bien issu d'une succession, j'exige l'attestation immobilière publiée (et l'acte de notoriété) AVANT la première photo, et je vérifie le séquestre du dépôt chez le notaire plutôt qu'à l'agence."
    ],
    "notesFormateur": [
      "Gérez le temps avec un chrono visible : les jeux (quiz-battle, défi chrono) sont minutés, ne laissez pas déborder l'apport théorique au détriment de la pratique, qui ancre vraiment les acquis.",
      "Faites participer tout le monde : alternez formats assis (apports, études de cas) et debout (Vrai/Faux, défi chrono), faites tourner les porte-parole d'équipe et sollicitez nommément les plus discrets sur des questions faciles.",
      "Ancrez chaque notion dans le terrain local (Martigues, Saint-Mitre, étang de Berre, parcelles agricoles SAFER) : les clients, les biens et les situations que vos négociateurs rencontrent réellement rendent le contenu mémorable.",
      "Transformez chaque erreur de quiz en apprentissage : ne jugez jamais une mauvaise réponse, reformulez la bonne pratique en une phrase et reliez-la à un cas vécu par l'équipe.",
      "Faites verbaliser les engagements : à la fin, chacun écrit 3 actions concrètes sur sa fiche et en annonce une à voix haute au groupe — l'engagement public augmente le passage à l'acte sur le terrain.",
      "Prévoyez le matériel à l'avance : cartons plastifiés des 6 étapes pour le défi chrono, fiches des 3 études de cas, un petit lot pour l'équipe gagnante, et planifiez un point de suivi à J+30 pour vérifier l'application du plan d'action."
    ]
  },
  "loi-alur": {
    "id": "loi-alur",
    "sousTitre": "ALUR sans jargon : l'atelier qui transforme la loi en réflexes de terrain, de la vitrine au compromis",
    "objectifs": [
      "Savoir situer la loi ALUR (24 mars 2014) dans la chaîne Hoguet / Macron / ELAN / Climat et distinguer ce qui relève vraiment d'ALUR de ce qui n'en relève pas (passoires thermiques = loi Climat).",
      "Maîtriser les règles d'affichage et de publicité des honoraires : barème-plafond TTC, vitrine + accueil + site en 2 clics, et rédaction d'annonce selon que les honoraires sont charge vendeur ou charge acquéreur.",
      "Être capable de rédiger une annonce de vente et de location 100 % conforme (prix/honoraires, mentions copropriété, les 4 mentions DPE).",
      "Maîtriser le contenu obligatoire du mandat post-ALUR (moyens mis en œuvre + reddition de comptes) et en faire un argument pour décrocher l'exclusivité.",
      "Être capable de constituer le dossier de copropriété L721-2 complet avant le compromis pour sécuriser le délai de rétractation de 10 jours de l'acquéreur.",
      "Savoir calculer le plafond des honoraires de location au m² et appliquer la liste limitative des pièces exigibles du candidat locataire."
    ],
    "agenda": [
      {
        "titre": "Accueil et cadrage : « ALUR, pourquoi ça nous concerne tous »",
        "duree": "0:00 - 0:10 (10 min)"
      },
      {
        "titre": "Brise-glace : le mur des idées reçues sur ALUR",
        "duree": "0:10 - 0:25 (15 min)"
      },
      {
        "titre": "Apport 1 : repères ALUR + honoraires et affichage (barème-plafond, vitrine/site, annonce)",
        "duree": "0:25 - 0:45 (20 min)"
      },
      {
        "titre": "Jeu 1 : Vrai / Faux express « ALUR ou pas ALUR »",
        "duree": "0:45 - 0:55 (10 min)"
      },
      {
        "titre": "Jeu 2 : Défi chrono annonce conforme (atelier en binômes)",
        "duree": "0:55 - 1:10 (15 min)"
      },
      {
        "titre": "Apport 2 : mandat post-ALUR, copropriété L721-2, volet location",
        "duree": "1:10 - 1:25 (15 min)"
      },
      {
        "titre": "Jeu 3 : Quiz-battle en équipes « Les Experts ALUR »",
        "duree": "1:25 - 1:40 (15 min)"
      },
      {
        "titre": "Jeu de rôle : mise en situation téléphonique « Le vendeur qui conteste l'affichage des honoraires »",
        "duree": "1:40 - 1:55 (15 min)"
      },
      {
        "titre": "Synthèse HAMCLoF, plan d'action du lendemain et clôture",
        "duree": "1:55 - 2:05 (10 min)"
      }
    ],
    "briseGlace": {
      "titre": "Le mur des idées reçues : « ALUR, vrai ou intox ? »",
      "consignes": [
        "Avant toute explication, distribuez à chaque négociateur 3 Post-it et demandez-leur d'écrire, en une phrase chacun, ce qu'ils croient savoir (ou ce qu'un client leur a dit) sur la loi ALUR : une par Post-it, sans se censurer.",
        "Chacun vient coller ses Post-it au tableau et lit l'un d'eux à voix haute en 10 secondes (ex. « ALUR, c'est surtout pour les locations », « c'est ALUR qui interdit de louer les passoires thermiques »).",
        "L'animateur regroupe les Post-it en 2 colonnes au feutre : VRAI et À VÉRIFIER (ne tranchez pas encore, créez le suspense).",
        "Annoncez la règle du jeu de la séance : « À la fin de l'atelier, on revient à ce mur et chacun déplace ses propres Post-it dans la bonne colonne. Vous allez voir que la moitié des idées reçues sont fausses. »",
        "Gardez le mur visible toute la séance : il sert de fil rouge et de mesure des acquis en clôture."
      ]
    },
    "jeux": [
      {
        "titre": "Vrai / Faux express « ALUR ou pas ALUR »",
        "type": "Vrai/Faux debout-assis",
        "duree": "10 min",
        "consignes": [
          "Tout le monde se lève. L'animateur lit une affirmation : les négociateurs restent DEBOUT s'ils pensent VRAI, s'ASSOIENT s'ils pensent FAUX. Pas d'abstention, on tranche.",
          "Lire une à une les 10 affirmations ci-dessous en laissant 3 secondes de décision, puis donnez la réponse et la justification en une phrase.",
          "Affirmation 1 : « Le barème d'honoraires affiché est un prix maximum, on peut négocier à la baisse. » (VRAI)",
          "Affirmation 2 : « C'est la loi ALUR qui interdit de louer les logements classés G. » (FAUX - c'est la loi Climat et résilience 2021.)",
          "Affirmation 3 : « Une annonce de vente doit afficher 4 mentions liées au DPE. » (VRAI)",
          "Affirmation 4 : « On peut faire visiter avant la signature du mandat tant qu'on le signe le jour de l'offre. » (FAUX - pas de mandat écrit préalable = aucune rémunération, art. 6 Hoguet.)",
          "Affirmation 5 : « La carte professionnelle est valable 10 ans et délivrée par la préfecture. » (FAUX - 3 ans, délivrée par la CCI depuis 2015.)",
          "Affirmation 6 : « En transaction, les honoraires d'agence sont plafonnés par la loi au m². » (FAUX - ils sont libres, bornés par le barème affiché ; le plafond au m² ne concerne que la LOCATION.)",
          "Affirmation 7 : « Si le dossier de copropriété L721-2 n'est pas annexé au compromis, le délai de rétractation de 10 jours de l'acquéreur ne démarre pas. » (VRAI)",
          "Affirmation 8 : « Le barème doit être affiché en TTC en vitrine, à l'accueil ET sur le site internet. » (VRAI)",
          "Affirmation 9 : « Un mandat exclusif ne peut jamais être dénoncé avant son terme. » (FAUX - dénonciation possible après 3 mois, par LRAR, préavis 15 jours.)",
          "Affirmation 10 : « ALUR a supprimé le COS et la taille minimale des terrains. » (VRAI)"
        ],
        "animation": [
          "Rythmez vite : l'énergie du jeu vient du corps qui bouge, pas de la réflexion longue.",
          "Après chaque réponse, demandez à UN négociateur qui s'est trompé « qu'est-ce qui t'a fait hésiter ? » : l'erreur verbalisée s'ancre mieux que la bonne réponse.",
          "Insistez sur les pièges 2 et 6, qui sont les confusions les plus fréquentes et les plus coûteuses en clientèle."
        ],
        "corrige": [
          "1 VRAI",
          "2 FAUX (loi Climat 2021)",
          "3 VRAI (classe énergie, classe climat/GES, estimation des coûts annuels, mention « consommation énergétique excessive » si F ou G)",
          "4 FAUX",
          "5 FAUX (3 ans, CCI)",
          "6 FAUX (libres dans la limite du barème ; plafond au m² = location uniquement)",
          "7 VRAI",
          "8 VRAI",
          "9 FAUX (dénonçable après 3 mois, LRAR, préavis 15 jours)",
          "10 VRAI"
        ]
      },
      {
        "titre": "Défi chrono : l'annonce conforme en 5 minutes",
        "type": "Défi chrono / atelier en binômes",
        "duree": "15 min",
        "consignes": [
          "Formez des binômes. Distribuez à chaque binôme la même fiche « bien à vendre » (voir corrigé) : un T3 de 72 m² à Martigues, 280 000 € net vendeur, honoraires 4 % TTC à la charge de l'acquéreur, copropriété de 48 lots, charges ≈ 1 320 €/an, DPE D / GES D, coûts énergie 980-1 330 € (réf. 2023), pas de procédure en cours.",
          "Objectif : rédiger en 5 minutes chrono le texte d'une annonce de vente 100 % conforme ALUR. Lancez un vrai minuteur visible de tous.",
          "À la fin du chrono, chaque binôme lit son annonce. Les autres jouent les « contrôleurs DGCCRF » et lèvent la main dès qu'il manque une mention obligatoire.",
          "Comptez 1 point par mention obligatoire correctement présente, -1 par mention oubliée ou erronée (prix FAI, prix hors honoraires, taux TTC, qui paie, lots de copropriété, charges moyennes, classe énergie, classe climat GES, estimation des coûts, absence de procédure).",
          "Affichez au tableau l'annonce-corrigé et faites recalculer à voix haute le prix FAI pour verrouiller le calcul."
        ],
        "animation": [
          "Circulez pendant le chrono pour repérer les binômes qui oublient la classe climat (GES) ou l'estimation des coûts : ce sont les oublis n°1 sur le terrain.",
          "Valorisez le binôme qui a pensé à l'astuce commerciale : frais de notaire calculés sur 280 000 € (hors honoraires), pas sur le FAI — argument d'économie réelle à mettre en avant côté acquéreur.",
          "Terminez en projetant l'exemple d'annonce conforme du support pour que chacun reparte avec un modèle réutilisable."
        ],
        "corrige": [
          "Calcul : honoraires = 280 000 x 4 % = 11 200 €. Prix FAI = 291 200 €. Prix hors honoraires (net vendeur) = 280 000 €.",
          "Annonce conforme type : « Appartement T3, Martigues, 72 m², 291 200 € honoraires inclus dont 4 % (11 200 €) à la charge de l'acquéreur, soit 280 000 € hors honoraires. Copropriété de 48 lots, charges courantes ≈ 1 320 €/an, pas de procédure en cours. DPE : classe D / GES D. Coûts annuels d'énergie estimés entre 980 € et 1 330 € (réf. 2023). »",
          "Mentions obligatoires attendues : prix FAI + prix hors honoraires + taux/montant TTC des honoraires + qui paie ; statut copropriété ; nombre de lots (48) ; charges courantes moyennes ; absence/existence de procédure ; les 4 mentions DPE (classe énergie, classe climat GES, estimation des coûts annuels avec année de référence, mention « consommation énergétique excessive » uniquement si F ou G — ici inutile car D)."
        ]
      },
      {
        "titre": "Quiz-battle « Les Experts ALUR »",
        "type": "Quiz-battle en équipes",
        "duree": "15 min",
        "consignes": [
          "Constituez 2 ou 3 équipes et faites-leur choisir un nom (ex. « Les Barèmes », « Les Mandats d'acier »). Désignez un porte-parole par équipe pour éviter le brouhaha.",
          "L'animateur lit une question à choix multiples ; les équipes se concertent 15 secondes puis le porte-parole annonce la réponse (ou écrit A/B/C/D sur une ardoise levée simultanément pour éviter le copiage).",
          "10 questions, 1 point par bonne réponse. Après chaque question, l'animateur donne l'explication : c'est là que se fait l'apprentissage.",
          "Posez les questions suivantes, tirées du quiz du module : 1) Le barème d'honoraires affiché est… (R : un prix maximum TTC, négociable à la baisse). 2) Combien de mentions DPE obligatoires dans une annonce de vente ? (R : 4). 3) Les honoraires de location à la charge du locataire sont… (R : plafonnés au m² selon la zone, 8/10/12 €). 4) Quelle formation continue pour renouveler la carte ? (R : 14 h/an soit 42 h sur 3 ans). 5) Si le dossier L721-2 n'est pas annexé à la promesse ? (R : le délai de rétractation de 10 jours ne commence pas à courir).",
          "Suite : 6) Un mandat exclusif peut être dénoncé… (R : après 3 mois, par LRAR, préavis 15 jours). 7) Qu'a supprimé ALUR en urbanisme ? (R : le COS et la taille minimale des terrains). 8) Honoraires du syndic pour l'état daté ? (R : plafonnés à 380 € TTC). 9) Le fonds de travaux obligatoire représente au moins… (R : 5 % du budget prévisionnel). 10) Compte bancaire séparé du syndicat : dispense possible dans les copropriétés de… (R : 15 lots ou moins).",
          "Bonus « question piège » valant 2 points pour départager en cas d'égalité : « C'est ALUR qui a créé l'obligation d'audit énergétique pour les passoires thermiques, vrai ou faux ? » (R : FAUX, c'est la loi Climat 2021)."
        ],
        "animation": [
          "Tenez le score au tableau, visible : la compétition d'équipe booste l'attention de ceux qui décrochent en formation descendante.",
          "Accordez un « droit de défi » : une équipe peut contester une réponse si elle argumente juridiquement — cela crée du débat et révèle les zones floues.",
          "Gardez les questions 3, 8, 9 et 10 (les chiffres) pour la fin : ce sont les plus oubliées, mettez-les en avant dans la synthèse."
        ],
        "corrige": [
          "1 : prix maximum TTC, négociable à la baisse.",
          "2 : 4 mentions.",
          "3 : plafonnées au m² (8 €/m² hors zone tendue, 10 € en zone tendue, 12 € en zone très tendue, + 3 €/m² état des lieux).",
          "4 : 14 h/an soit 42 h sur 3 ans, dont 2 h déontologie + 2 h non-discrimination.",
          "5 : le délai de rétractation de 10 jours de l'acquéreur ne démarre pas.",
          "6 : après 3 mois, LRAR, préavis 15 jours.",
          "7 : le COS et la taille minimale des terrains.",
          "8 : 380 € TTC.",
          "9 : 5 % du budget prévisionnel annuel.",
          "10 : 15 lots ou moins.",
          "Bonus : FAUX (loi Climat et résilience 2021)."
        ]
      },
      {
        "titre": "Brainstorm éclair : « Tous les moyens qu'on inscrit au mandat »",
        "type": "Brainstorm / défi collectif",
        "duree": "10 min",
        "consignes": [
          "Rappel express : depuis ALUR, le mandat doit écrire noir sur blanc les moyens mis en œuvre par l'agence ET les modalités de reddition de comptes. C'est une obligation… et un argument massue pour décrocher l'exclusivité.",
          "Au tableau, tracez deux colonnes : « MOYENS DE COMMERCIALISATION » et « REDDITION DE COMPTES ». En mode pop-corn, chacun lance une idée concrète que l'agence peut réellement inscrire et tenir.",
          "Objectif chrono : remplir au moins 12 moyens + 4 modalités de reporting en 5 minutes. L'animateur note tout sans filtrer.",
          "Deuxième temps (3 min) : l'équipe surligne les 5 moyens les plus différenciants face à un concurrent, et formule LA phrase d'accroche à dire au vendeur pour vendre l'exclusivité.",
          "Chacun repart avec la liste photographiée : elle devient l'argumentaire-mandat de l'agence."
        ],
        "animation": [
          "Poussez vers du concret et du tenable : « reportage photo pro » oui, « on fait de la pub partout » non. Ce qui est écrit au mandat doit être réellement fait (reddition de comptes oblige).",
          "Reliez systématiquement un moyen à sa preuve de reporting : ex. « diffusion portails » → « capture des statistiques de vues envoyée tous les 15 jours ».",
          "Si le groupe sèche, amorcez avec le script du module : reportage photo, diffusion grands portails, vitrine, home-staging, visites, compte rendu après chaque visite + point tous les 15 jours."
        ],
        "corrige": [
          "Moyens typiques : reportage photo professionnel, vidéo / visite virtuelle, home-staging, diffusion sur les grands portails, mise en vitrine, panneau, mailing fichier acquéreurs, journées portes ouvertes, remontée aux agences du réseau C21, publication réseaux sociaux.",
          "Reddition de comptes : compte rendu écrit après chaque visite, point téléphonique ou mail tous les 15 jours, transmission des statistiques de diffusion, bilan mi-mandat avec recommandation (prix, supports).",
          "Phrase d'accroche type : « Mon mandat précise noir sur blanc ce que je mets en œuvre et comment je vous rends compte. Vous ne me donnez pas un blanc-seing : vous avez un engagement écrit et vérifiable. »"
        ]
      },
      {
        "titre": "Étude de cas : l'audit « 5 minutes » des annonces de l'agence",
        "type": "Étude de cas en sous-groupes",
        "duree": "12 min",
        "consignes": [
          "Répartissez 3 ou 4 annonces (réelles et anonymisées, issues du portefeuille de l'agence, ou les cartons-exemples fournis dans le support) entre les sous-groupes.",
          "Chaque sous-groupe passe son annonce au crible de la check-list HAMCLoF en 6 minutes : Honoraires affichés correctement ? Annonce complète (4 DPE, copropriété) ? Mandat cohérent sur qui paie ? Copropriété documentée ? Location plafonnée (si location) ? Formation/carte à jour ?",
          "Le sous-groupe liste les non-conformités repérées et le coût potentiel en cas de contrôle (amende jusqu'à 3 000 € personne physique / 15 000 € personne morale pour affichage/annonce).",
          "Restitution : chaque sous-groupe présente en 1 minute « ce qui cloche et comment on corrige dès cet après-midi ».",
          "Clôturez sur le mini-cas du module : 12 annonces auditées, 3 sans classe climat (GES), 1 sans estimation des coûts, 2 sans charges de copropriété — 20 minutes de correction contre des milliers d'euros d'amende."
        ],
        "animation": [
          "Faites-en un exercice utile et non punitif : l'objectif est de repartir avec des annonces corrigées, pas de pointer un coupable.",
          "Les oublis les plus fréquents à traquer : classe climat (GES) absente alors que l'étiquette énergie est là ; estimation des coûts annuels oubliée ; charges de copropriété non indiquées ; mention « DPE non communiqué » recopiée d'un particulier (interdit depuis juillet 2021).",
          "Notez les corrections sur un tableau partagé et assignez un responsable + une date pour chaque correction : c'est le pont direct vers le plan d'action."
        ],
        "corrige": [
          "Grille de contrôle d'une annonce de vente : prix + qui paie les honoraires (si charge acquéreur : prix hors honoraires + taux/montant TTC + FAI) ; statut copropriété + nombre de lots + charges courantes moyennes + procédure éventuelle ; 4 mentions DPE (classe énergie, classe climat/GES, estimation des coûts annuels + année de réf., mention « consommation énergétique excessive » si F ou G).",
          "Un seul oubli parmi les 4 mentions DPE rend l'annonce entière non conforme.",
          "Le DPE vierge (« non communiqué ») est interdit depuis le 1er juillet 2021 et le DPE est désormais opposable."
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "Mise en situation téléphonique : le vendeur qui conteste l'affichage des honoraires",
        "contexte": "Un vendeur a repéré sur le site et en vitrine de CENTURY 21 Icaza Immobilier le barème d'honoraires. Il appelle, agacé : « Pourquoi vous affichez vos commissions comme ça à la vue de tous ? Les clients vont croire que c'est cher. Vous pouvez pas juste m'en parler de vive voix ? » Le négociateur doit tenir le téléphone, expliquer le cadre ALUR sans se mettre en position de faiblesse, et transformer l'obligation en argument de confiance.",
        "roleA": "Le négociateur de l'agence : il reçoit l'appel, garde son calme, explique que l'affichage du barème (vitrine, accueil, site, en TTC) est une obligation légale ALUR et une marque de transparence, rappelle que le barème est un plafond négociable à la baisse et non un tarif imposé, et réoriente vers la valeur du service.",
        "roleB": "Le vendeur méfiant : il pense que l'affichage dessert l'agence, soupçonne que « tout est négociable donc pourquoi payer le plein tarif », et teste la fermeté du négociateur. Il peut glisser un piège : « donc je peux exiger moitié prix ? ».",
        "objectif": "S'entraîner à transformer une contrainte légale (l'affichage obligatoire du barème-plafond TTC) en argument commercial de transparence, sans brader ses honoraires ni mentir sur la règle. Bien distinguer « plafond opposable, négociable à la baisse » de « tarif libre à discuter sans limite ».",
        "debrief": [
          "Le négociateur a-t-il nommé clairement l'obligation ALUR (affichage vitrine + accueil + site, TTC) plutôt que de s'en excuser ?",
          "A-t-il tenu la ligne « le barème est un plafond, je peux négocier à la baisse mais je ne facture jamais au-delà, et c'est le même tarif pour tous » sans promettre une remise réflexe ?",
          "A-t-il réussi à basculer de la commission vers la valeur (moyens inscrits au mandat, reporting, sécurisation du dossier) ?",
          "Qu'est-ce qui a convaincu / crispé le vendeur ? Faire rejouer la séquence d'ouverture par un autre binôme avec la meilleure formulation entendue."
        ]
      },
      {
        "titre": "Prise de mandat : vendre l'exclusivité par les moyens et la reddition de comptes",
        "contexte": "Rendez-vous de prise de mandat au domicile d'un propriétaire à Martigues (un mardi). Le vendeur hésite entre un mandat simple confié à trois agences et l'exclusivité proposée par le négociateur. Il faut à la fois convaincre par le contenu ALUR du mandat (moyens + reporting) et gérer proprement le formalisme (signature hors établissement = rétractation 14 jours, bordereau à remettre).",
        "roleA": "Le négociateur : il déroule son argumentaire-mandat (moyens de commercialisation concrets, compte rendu après chaque visite + point tous les 15 jours), explique la faculté de dénonciation après 3 mois (LRAR, préavis 15 jours) pour rassurer, et n'oublie pas de remettre le bordereau de rétractation de 14 jours puisqu'on signe au domicile.",
        "roleB": "Le vendeur : « l'exclusivité, c'est trop risqué, je me sens prisonnier ». Il veut garder la main, craint de mal choisir et demande « et si je ne suis pas content de vous dans un mois ? ».",
        "objectif": "Transformer les apports ALUR du mandat (moyens mis en œuvre inscrits noir sur blanc + reddition de comptes + dénonciation après 3 mois) en leviers pour lever l'objection de l'exclusivité, tout en respectant le formalisme de la signature hors établissement (rétractation 14 jours + bordereau).",
        "debrief": [
          "Le négociateur a-t-il utilisé l'engagement écrit (moyens + reporting) comme preuve de sérieux plutôt que comme simple obligation ?",
          "A-t-il rassuré sur la sortie possible (dénonciation après 3 mois, LRAR, préavis 15 jours) pour désamorcer la peur d'être « prisonnier » ?",
          "A-t-il pensé à remettre le bordereau de rétractation (14 jours) et à bien dater le point de départ, signature au domicile oblige ?",
          "A-t-il évité le piège fatal : faire visiter ou publier avant la signature du mandat (aucune rémunération due, art. 6 Hoguet) ?"
        ]
      }
    ],
    "pointsCles": [
      "ALUR (loi du 24 mars 2014) complète et durcit la loi Hoguet : elle vise la transparence pour le consommateur et la professionnalisation des agents. Elle touche d'abord la TRANSACTION, pas seulement la location.",
      "Ne pas confondre ALUR et loi Climat : l'interdiction progressive de louer les passoires thermiques et l'audit énergétique viennent de la loi Climat et résilience 2021, pas d'ALUR.",
      "Le barème d'honoraires est un PLAFOND TTC, négociable à la baisse, jamais dépassable, identique pour tous. Il s'affiche en vitrine, à l'accueil ET sur le site (en 2 clics), toujours en TTC.",
      "Dans l'annonce, qui paie change tout : honoraires charge acquéreur = afficher prix hors honoraires + taux/montant TTC + prix FAI. En transaction les honoraires sont libres (bornés par le barème) ; en location ils sont plafonnés par la loi au m².",
      "Toute annonce exige 4 mentions DPE : classe énergie, classe climat (GES), estimation des coûts annuels d'énergie (+ année de réf.), et la mention « consommation énergétique excessive » pour un F ou G. Un seul oubli = annonce non conforme. Le DPE vierge est interdit depuis juillet 2021.",
      "Pas de mandat écrit préalable = aucune rémunération (art. 6 Hoguet). Le mandat post-ALUR doit inscrire les moyens mis en œuvre et la reddition de comptes : c'est une obligation ET le meilleur argument d'exclusivité.",
      "Un mandat exclusif se dénonce après 3 mois, par LRAR, avec préavis de 15 jours ; signé hors établissement (au domicile), il ouvre 14 jours de rétractation avec bordereau à remettre.",
      "Pour un lot de copropriété, le dossier L721-2 complet (fiche synthétique, règlement + EDD, PV d'AG des 3 ans, carnet d'entretien, charges, fonds de travaux, Carrez…) doit être annexé à la promesse : sinon le délai de rétractation de 10 jours de l'acquéreur NE COMMENCE PAS à courir. État daté du syndic plafonné à 380 € TTC.",
      "Honoraires de location à la charge du locataire : 4 prestations seulement, plafonnées au m² (8 / 10 / 12 €/m² selon la zone + 3 €/m² pour l'état des lieux), part locataire jamais supérieure à celle du bailleur, et liste limitative des pièces exigibles (une pièce hors liste = amende).",
      "Carte professionnelle T/G/S valable 3 ans, délivrée par la CCI, conditionnée à 42 h de formation continue sur le cycle (14 h/an) dont 2 h de déontologie et 2 h de non-discrimination. Mémo de clôture : HAMCLoF (Honoraires affichés, Annonces complètes, Mandat conforme, Copropriété documentée, Location plafonnée, Formation à jour)."
    ],
    "planAction": [
      "Dès demain matin, auditer mes annonces en ligne avec la grille HAMCLoF et corriger sous 24 h toute annonce où manque une des 4 mentions DPE (en priorité la classe climat/GES souvent oubliée), les charges de copropriété ou le détail des honoraires.",
      "Vérifier aujourd'hui que le barème de l'agence est bien accessible sur le site en 2 clics maximum et à jour en TTC, aussi sérieusement que la vitrine (c'est le point faible classique en cas de contrôle DGCCRF).",
      "Sur mon prochain rendez-vous de prise de mandat, inscrire noir sur blanc les moyens mis en œuvre + la reddition de comptes (compte rendu après chaque visite, point tous les 15 jours) et m'en servir comme argument d'exclusivité.",
      "Ne plus jamais faire visiter ni publier un bien avant la signature du mandat écrit, numéroté et reporté au registre ; remettre systématiquement le bordereau de rétractation quand je signe au domicile du vendeur.",
      "Dès la prise de mandat sur un lot de copropriété, demander au syndic le dossier L721-2 complet (fiche synthétique, PV d'AG des 3 ans, carnet d'entretien, fonds de travaux, Carrez…) pour qu'il soit prêt à annexer au compromis et sécuriser les 10 jours de rétractation.",
      "Avant toute facturation d'honoraires de location, calculer le plafond au m² (zone x surface habitable) et vérifier que je ne réclame au candidat que des pièces de la liste limitative."
    ],
    "notesFormateur": [
      "Gérer le temps : la séance est dense (2 h). Affichez l'agenda minuté au mur et nommez un « gardien du temps » dans le groupe. Si vous débordez, sacrifiez le brainstorm ou l'étude de cas (jeux 4 et 5, optionnels) plutôt que les apports et le quiz-battle.",
      "Alternez systématiquement apport descendant (max 15-20 min) et activité : l'attention d'un adulte décroche après 20 minutes de monologue. Les jeux ne sont pas de la récréation, ce sont les moments où le savoir s'ancre.",
      "Faire participer tout le monde : utilisez le porte-parole tournant dans le quiz-battle et la règle « pop-corn » dans le brainstorm pour que les plus discrets s'expriment. Valorisez les erreurs (« bonne erreur, c'est exactement le piège du terrain ») plutôt que de les sanctionner.",
      "Ancrer les acquis : revenez au mur des idées reçues du brise-glace en clôture et faites déplacer les Post-it. Ce bouclage visuel matérialise la progression et marque les esprits.",
      "Rendre concret et local : chaque fois que possible, raccrochez à Martigues et au portefeuille réel de l'agence (annonces réelles anonymisées, cas vécus). Rappelez que Martigues n'est pas en zone d'encadrement du niveau des loyers mais à vérifier en zone tendue.",
      "Conclure par l'action, pas par la théorie : réservez vraiment les 10 dernières minutes au plan d'action individuel. Faites écrire à chaque négociateur ses 2 engagements prioritaires pour le lendemain et proposez un point de suivi à J+15 pour vérifier leur mise en œuvre."
    ]
  },
  "cadre-legal": {
    "id": "cadre-legal",
    "sousTitre": "Cadre légal & conformité : 2 heures pour transformer des contraintes juridiques en réflexes terrain qui protègent chaque négociateur et toute l'agence.",
    "objectifs": [
      "Savoir citer les piliers de la loi Hoguet (carte T/G/S, habilitation CCI, garantie financière, RCP) et expliquer pourquoi un négociateur engage toujours la responsabilité du titulaire de la carte.",
      "Maîtriser le formalisme du mandat écrit préalable (mentions obligatoires, numéro au registre, bon de visite) comme condition de perception des honoraires.",
      "Être capable d'afficher et d'annoncer des honoraires conformes (prix, montant TTC, qui paie, DPE/GES) en vitrine, en agence et sur le web.",
      "Appliquer les trois réflexes LCB-FT (identifier le client, comprendre le bénéficiaire effectif et le risque, vérifier l'origine des fonds) et savoir quand et comment déclarer un soupçon à Tracfin via Ermes, dans la confidentialité absolue.",
      "Être capable de prospecter dans le nouveau régime opt-in 2026 (consentement préalable, horaires, preuve 3 ans) et de recourir à la pige en conformité.",
      "Repérer et refuser toute consigne discriminatoire, et sécuriser son devoir de conseil pour limiter les trois responsabilités (civile, pénale, disciplinaire)."
    ],
    "agenda": [
      {
        "titre": "Accueil & brise-glace « Vrai ou intox juridique »",
        "duree": "10 min"
      },
      {
        "titre": "Apport 1 — Loi Hoguet, carte pro & habilitation : qui fait quoi et sous quelle responsabilité",
        "duree": "15 min"
      },
      {
        "titre": "Jeu 1 — Quiz-battle en équipes « Les gardiens de la carte »",
        "duree": "15 min"
      },
      {
        "titre": "Apport 2 — Mandat écrit, honoraires & affichage : le nerf de la rémunération",
        "duree": "15 min"
      },
      {
        "titre": "Jeu 2 — Vrai/Faux chrono « Mandat & honoraires »",
        "duree": "10 min"
      },
      {
        "titre": "Apport 3 — LCB-FT / Tracfin & RGPD : vigilance et données",
        "duree": "15 min"
      },
      {
        "titre": "Jeu 3 — Étude de cas « Les clignotants rouges » (détection LCB-FT)",
        "duree": "15 min"
      },
      {
        "titre": "Jeu 4 — Mise en situation téléphonique « Prospection opt-in 2026 »",
        "duree": "10 min"
      },
      {
        "titre": "Jeu de rôle — « Le propriétaire qui discrimine »",
        "duree": "15 min"
      },
      {
        "titre": "Synthèse : les messages-clés & plan d'action du lendemain",
        "duree": "15 min"
      },
      {
        "titre": "Clôture & engagements individuels (tour de table)",
        "duree": "5 min"
      }
    ],
    "briseGlace": {
      "titre": "Vrai ou intox juridique : 5 affirmations pour réveiller le groupe",
      "consignes": [
        "Avant tout apport, projetez 5 affirmations une par une et demandez à chacun de se lever (Vrai) ou de rester assis (Faux), sans réfléchir plus de 3 secondes.",
        "Affirmation 1 : « La carte professionnelle est délivrée à vie. » (Faux : elle est valable 3 ans et se renouvelle auprès de la CCI.)",
        "Affirmation 2 : « Un bon de visite signé suffit à me garantir ma commission. » (Faux : il prouve la présentation, mais c'est le mandat écrit et sa clause pénale qui ouvrent le droit aux honoraires.)",
        "Affirmation 3 : « Depuis août 2026, je peux encore appeler un particulier tant qu'il n'est pas sur Bloctel. » (Faux : Bloctel a disparu, le régime est l'opt-in, consentement préalable obligatoire.)",
        "Affirmation 4 : « Si un client me demande si son dossier pose problème, je peux lui dire qu'une déclaration Tracfin a été faite. » (Faux : no tipping-off, interdiction absolue d'informer le client.)",
        "Affirmation 5 : « Un propriétaire a le droit de choisir son locataire selon son origine, c'est son bien. » (Faux : c'est un délit, et le négociateur qui relaie la consigne en est co-responsable.)",
        "Comptez le nombre d'erreurs collectives : annoncez que la séance va précisément transformer ces intox en réflexes sûrs. Gardez le score affiché pour le comparer en fin de séance."
      ]
    },
    "jeux": [
      {
        "titre": "Quiz-battle en équipes « Les gardiens de la carte »",
        "type": "Quiz-battle en équipes",
        "duree": "15 min",
        "consignes": [
          "Constituez 2 à 3 équipes de négociateurs, chacune se choisit un nom d'agence fictive.",
          "Posez 8 questions à l'oral, l'équipe la plus rapide à lever la main répond ; bonne réponse = 2 points, réponse argumentée (citer le texte ou le chiffre) = 1 point bonus, erreur = la main passe à l'équipe suivante.",
          "Q1 : Que couvrent les mentions T, G et S ? (T transaction, G gestion, S syndic.)",
          "Q2 : Qui délivre la carte depuis la loi ALUR de 2014, et pour quelle durée ? (La CCI, 3 ans.)",
          "Q3 : À partir de quand la garantie financière est-elle obligatoire et à quel montant minimum ? (Dès qu'on manie des fonds, 110 000 €, réduit à 30 000 € les 2 premières années.)",
          "Q4 : Un négociateur a-t-il sa propre carte ? Avec quel document agit-il ? (Non : attestation d'habilitation délivrée par la CCI à la demande du titulaire.)",
          "Q5 : Citez trois choses qu'un négociateur ne peut PAS faire seul. (Manier des fonds à titre personnel, donner des consultations juridiques habituelles, agir hors du périmètre de la carte du titulaire.)",
          "Q6 : Quelle est la différence de statut entre un agent commercial et un salarié ? (Indépendant immatriculé au RSAC à la commission vs lien de subordination ; mêmes obligations de conformité pour les deux.)",
          "Q7 : Quel registre reçoit le numéro de chaque mandat ? (Le registre des mandats, à pages numérotées, sans blanc ni rature.)",
          "Q8 : Un agent commercial engage-t-il la responsabilité de l'agence ? (Oui, il engage la responsabilité du titulaire de la carte.)",
          "Totalisez les points et désignez l'équipe « Gardienne de la carte »."
        ],
        "animation": [
          "Préparez les questions sur des slides masquées et révélez la réponse après chaque manche pour ancrer immédiatement.",
          "Valorisez l'argumentation (le bonus) plutôt que la seule vitesse, pour éviter que le quiz ne récompense que les plus impulsifs.",
          "Reliez chaque réponse à un exemple Icaza (« à Martigues, concrètement, ça veut dire… ») pour éviter l'abstraction.",
          "Si une équipe domine trop, inversez l'ordre de passage pour relancer la dynamique."
        ],
        "corrige": [
          "T = transaction, G = gestion, S = syndic.",
          "CCI depuis 2014 (avant : préfecture), carte valable 3 ans.",
          "Garantie financière dès qu'on manie des fonds : 110 000 € minimum, 30 000 € les deux premières années ; sinon statut « non détenteur de fonds ».",
          "Le négociateur agit via l'attestation d'habilitation CCI (ex-carte blanche), à jour, restituée au départ.",
          "Interdits : manier des fonds en propre, consultations juridiques habituelles, agir hors périmètre de la carte.",
          "Agent commercial = indépendant RSAC à la commission ; salarié = subordination ; mêmes obligations déontologiques.",
          "Registre des mandats, numéroté, sans discontinuité ; registre-répertoire pour les fonds.",
          "Oui : le négociateur engage toujours la responsabilité du titulaire de la carte."
        ]
      },
      {
        "titre": "Vrai/Faux chrono « Mandat & honoraires »",
        "type": "Vrai/Faux défi chrono",
        "duree": "10 min",
        "consignes": [
          "Distribuez à chacun deux cartons : un VRAI (vert) et un FAUX (rouge).",
          "Énoncez 8 affirmations, chacun lève son carton en moins de 5 secondes ; comptez à voix haute « 5, 4, 3… ».",
          "A1 : « Je peux réclamer mes honoraires dès que j'ai trouvé l'acquéreur, même sans mandat écrit. » (FAUX : pas de mandat écrit préalable conforme = pas d'honoraires, article 6 d'ordre public.)",
          "A2 : « L'oubli du numéro de mandat au registre peut entraîner la nullité et la perte de commission. » (VRAI.)",
          "A3 : « Un mandat exclusif peut être verrouillé 12 mois sans possibilité de sortie. » (FAUX : passé 3 mois, dénonciation possible par LRAR avec préavis de 15 jours.)",
          "A4 : « En vente, l'annonce doit indiquer le prix, le montant TTC des honoraires et qui les paie. » (VRAI, décret 2016-173 + arrêté du 10 janvier 2017.)",
          "A5 : « Le barème des honoraires doit être affiché en agence, en vitrine, mais pas forcément sur le site internet. » (FAUX : le web obéit aux mêmes règles.)",
          "A6 : « En location, la part payée par le locataire peut dépasser celle du bailleur. » (FAUX : elle ne peut jamais la dépasser, et reste plafonnée 8/10/12 €/m² + 3 €/m² état des lieux.)",
          "A7 : « Le bon de visite ouvre à lui seul un droit à commission. » (FAUX : il prouve la présentation, pas le droit à commission.)",
          "A8 : « Les mentions DPE et GES sont obligatoires dans l'annonce de vente. » (VRAI.)",
          "À chaque affirmation, demandez à une personne qui s'est trompée d'expliquer pourquoi la bonne réponse est la bonne : c'est l'ancrage."
        ],
        "animation": [
          "Le chrono crée l'énergie : tenez le rythme et ne laissez pas le débat s'installer avant d'avoir montré la réponse.",
          "Repérez les cartons hésitants : ce sont les points à re-expliquer en synthèse.",
          "Ramenez chaque item au terrain : « combien de mandats avez-vous signés cette semaine sans reporter le numéro ? »"
        ],
        "corrige": [
          "A1 FAUX — article 6 loi Hoguet, mandat écrit préalable d'ordre public.",
          "A2 VRAI — numéro au registre, sinon nullité possible (jurisprudence Cour de cassation).",
          "A3 FAUX — dénonciation possible après 3 mois, préavis 15 jours par LRAR.",
          "A4 VRAI — prix + honoraires TTC + qui les paie.",
          "A5 FAUX — le site internet obéit aux mêmes règles que la vitrine.",
          "A6 FAUX — jamais plus que le bailleur, plafonds 8/10/12 €/m² + 3 €/m².",
          "A7 FAUX — le bon de visite prouve la présentation, il ne crée pas le droit à commission.",
          "A8 VRAI — DPE et GES obligatoires dans l'annonce."
        ]
      },
      {
        "titre": "Étude de cas « Les clignotants rouges » (détection LCB-FT)",
        "type": "Étude de cas en sous-groupes",
        "duree": "15 min",
        "consignes": [
          "Répartissez les participants en binômes ou trinômes et distribuez la fiche-dossier suivante : « Un acquéreur se présente pour un studio à Martigues à 180 000 €. Il propose de régler une partie en espèces, achète via une SCI dont il refuse de nommer l'associé majoritaire, veut conclure en urgence sous 8 jours, et se désintéresse totalement de la visite du bien. »",
          "Consigne 1 : en 5 minutes, chaque groupe liste tous les clignotants LCB-FT qu'il repère.",
          "Consigne 2 : le groupe classe le risque (faible / standard / élevé) et justifie.",
          "Consigne 3 : le groupe décide de la suite : vigilance renforcée ? déclaration de soupçon ? Et par quel canal se fait-elle ?",
          "Consigne 4 : question piège — le client demande « y a-t-il un souci avec mon dossier ? » : que répondez-vous ? (Rien sur la déclaration : no tipping-off.)",
          "Chaque groupe restitue en 1 minute ; vous complétez avec le mnémo C.I.O. (Client identifié, Intentions comprises, Origine des fonds vérifiée)."
        ],
        "animation": [
          "Laissez les groupes trouver eux-mêmes les signaux avant de donner la grille : la découverte ancre mieux que la liste magistrale.",
          "Insistez sur le fait qu'on déclare un soupçon, pas une preuve, et que ne pas déclarer malgré des indices est un manquement sanctionnable.",
          "Rappelez la confidentialité absolue : révéler une déclaration est une infraction en soi.",
          "Reliez à l'outil : la fiche d'identification Tracfin (KYC) se génère depuis le dossier vendeur, mais la notation des risques reste l'appréciation du négociateur, sous sa responsabilité."
        ],
        "corrige": [
          "Clignotants : paiement en espèces, SCI opaque, bénéficiaire effectif masqué (plus de 25 % non identifié), urgence anormale, désintérêt pour le bien lui-même.",
          "Risque : élevé — plusieurs signaux atypiques concordants.",
          "Suite : vigilance renforcée obligatoire ; selon l'analyse, déclaration de soupçon via la téléprocédure sécurisée Ermes de Tracfin (ni courrier ni téléphone).",
          "Conservation des justificatifs : 5 ans après la fin de la relation d'affaires (art. L.561-12 CMF).",
          "Question piège : ne rien révéler de la déclaration, répondre sur le plan administratif, poursuivre normalement — principe du no tipping-off."
        ]
      },
      {
        "titre": "Mise en situation téléphonique « Prospection opt-in 2026 »",
        "type": "Mise en situation téléphonique",
        "duree": "10 min",
        "consignes": [
          "Formez des binômes dos à dos (pour simuler le téléphone, sans contact visuel) : l'un est le négociateur, l'autre le particulier.",
          "Scénario A : le négociateur veut rappeler un prospect dont il n'a AUCUNE trace de consentement. Objectif : le négociateur doit reconnaître qu'il ne peut pas appeler et proposer une alternative conforme (pige, ou obtenir un opt-in).",
          "Scénario B : le négociateur appelle un particulier qui a publié lui-même son annonce (pige) — un dimanche à 18 h. Piège : le jour est interdit. Le négociateur doit identifier qu'on ne démarche pas le dimanche.",
          "Scénario C : un prospect dit « ne me rappelez plus ». Le négociateur doit honorer l'opposition immédiatement et le noter.",
          "Après chaque scénario, le « particulier » donne un retour de 30 secondes : me suis-je senti respecté ? La règle a-t-elle été tenue ?",
          "Clôturez avec le mnémo C.H.O. : Consentement obtenu et prouvé, Horaires respectés, Opposition honorée immédiatement."
        ],
        "animation": [
          "Faites tourner les rôles pour que chacun vive la position du prospect : c'est ce qui fait tomber les mauvaises habitudes.",
          "Rappelez les horaires exacts : lundi-vendredi, 10 h-13 h et 14 h-20 h ; interdit samedi, dimanche, jours fériés ; 4 sollicitations/mois maximum.",
          "Insistez : la pige (annonce publiée par le vendeur lui-même) reste parfaitement légitime et doit devenir le cœur de la prospection, aux côtés des contacts opt-in.",
          "Rappelez la preuve du consentement à conserver au moins 3 ans et l'amende jusqu'à 375 000 € pour une personne morale."
        ],
        "corrige": [
          "Scénario A : pas de consentement = pas d'appel depuis le 11 août 2026 ; alternative = pige ou recueil d'un opt-in libre, spécifique, éclairé, univoque, révocable (valable 1 an max).",
          "Scénario B : appel interdit le dimanche, même en pige ; reporter l'appel à un créneau autorisé.",
          "Scénario C : opposition honorée sur-le-champ, contact retiré de la campagne et tracé."
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "Le propriétaire qui discrimine",
        "contexte": "Un propriétaire bailleur de Martigues confie la mise en location de son appartement à Icaza Immobilier. En rendez-vous, il glisse au négociateur : « Je préfère un couple français sans enfants, et surtout écartez-moi les dossiers d'un certain quartier. » Le négociateur doit tenir la relation commerciale tout en refusant fermement la consigne.",
        "roleA": "Le négociateur Icaza : il doit refuser clairement la consigne, expliquer le cadre légal (sélection sur la solvabilité et pièces autorisées uniquement), et proposer une méthode de sélection conforme sans braquer le client.",
        "roleB": "Le propriétaire bailleur : convaincu que « c'est son bien, donc son choix », il insiste, minimise (« c'est juste une préférence »), teste la fermeté du négociateur.",
        "objectif": "S'entraîner à dire non à une consigne discriminatoire sans perdre le mandat, en reformulant le refus comme une protection du client lui-même (co-responsabilité pénale).",
        "debrief": [
          "Le négociateur a-t-il nommé le cadre (articles 225-1 et 225-2 du Code pénal, jusqu'à 3 ans et 45 000 € d'amende, testing possible, saisine du Défenseur des droits) ?",
          "A-t-il proposé une alternative concrète : sélection sur solvabilité et liste limitative de pièces (décret 2015-1437), refus des pièces hors liste ?",
          "A-t-il rappelé que relayer la consigne ferait de lui un co-auteur du délit ?",
          "La phrase-type « Je sélectionne sur la solvabilité, pas sur l'origine ni le lieu de résidence ; la loi me l'interdit et vous expose aussi » a-t-elle été formulée ?",
          "A-t-il tracé par écrit son conseil et son refus, preuve du devoir de conseil respecté ?",
          "Le mandat a-t-il pu être préservé malgré le refus ? Qu'est-ce qui, dans le ton, a aidé ou braqué ?"
        ]
      },
      {
        "titre": "Pas de mandat, pas d'honoraires",
        "contexte": "Un vendeur de Martigues a signé un mandat exclusif avec Icaza, bon de visite signé à l'appui pour un couple visité. Quelques semaines plus tard, il appelle : « Finalement l'acheteur est un ami, on se passe de l'agence, je ne vois pas pourquoi je vous paierais. » Le négociateur doit défendre ses honoraires sans agressivité.",
        "roleA": "Le négociateur Icaza : il s'appuie sur les écrits (mandat exclusif + clause pénale + bon de visite signé prouvant la présentation) pour expliquer calmement que les honoraires sont dus.",
        "roleB": "Le vendeur : il tente l'esquive (« c'est un ami », « vous n'avez rien fait de plus »), espère que le négociateur lâchera.",
        "objectif": "Montrer concrètement que l'écrit (mandat + bon de visite) fait toute la différence entre percevoir et ne rien percevoir, et s'entraîner à l'invoquer sereinement.",
        "debrief": [
          "Le négociateur a-t-il relié le droit aux honoraires à la présentation prouvée par le bon de visite et à la clause pénale du mandat ?",
          "A-t-il évité l'erreur classique (faire visiter avant d'avoir le mandat signé) dans la reconstitution du dossier ?",
          "A-t-il rappelé, sans l'opposer frontalement, que la loi protège aussi la relation de confiance ?",
          "Quelles preuves ont été décisives, et qu'est-ce qui aurait manqué sans bon de visite signé ?"
        ]
      }
    ],
    "pointsCles": [
      "La loi Hoguet (1970) fait de vous un professionnel de confiance : carte T/G/S délivrée par la CCI valable 3 ans, garantie financière dès qu'on manie des fonds, RCP et honorabilité.",
      "Le négociateur n'a pas de carte : il agit via une attestation d'habilitation CCI à jour, et il engage toujours la responsabilité du titulaire de la carte.",
      "Pas de mandat écrit préalable conforme, numéroté au registre = pas d'honoraires (article 6, d'ordre public) ; le bon de visite prouve la présentation mais ne crée pas le droit à commission.",
      "Les honoraires sont libres mais leur affichage est encadré : prix, montant TTC, qui les paie, DPE/GES, en agence, en vitrine ET sur le site internet.",
      "LCB-FT, les trois réflexes : identifier le client (KYC), comprendre le bénéficiaire effectif (plus de 25 %) et le risque, vérifier l'origine des fonds — mnémo C.I.O.",
      "On déclare un soupçon, pas une preuve, via Ermes, dans la confidentialité absolue (no tipping-off) ; ne pas déclarer malgré des indices est sanctionnable ; justificatifs conservés 5 ans.",
      "RGPD : finalité, minimisation, base légale, transparence ; prospects non convertis effacés après 3 ans ; sanctions CNIL jusqu'à 20 M€ ou 4 % du CA mondial.",
      "Depuis le 11 août 2026, la prospection d'un particulier exige son consentement préalable (opt-in) : Bloctel a disparu, preuve conservée 3 ans, horaires lundi-vendredi 10 h-13 h / 14 h-20 h — mnémo C.H.O.",
      "La non-discrimination est une obligation pénale (jusqu'à 3 ans et 45 000 € d'amende) : on sélectionne sur la solvabilité et des pièces autorisées, jamais sur un critère prohibé ; relayer une consigne discriminatoire fait de vous un co-auteur.",
      "Trois responsabilités à l'esprit en permanence : civile (couverte par la RCP), pénale (exercice sans carte, discrimination, escroquerie) et disciplinaire (commission de contrôle)."
    ],
    "planAction": [
      "Dès demain, ne faire visiter aucun bien sans mandat écrit signé au préalable, et reporter systématiquement le numéro du mandat au registre.",
      "Faire signer un bon de visite à chaque visite, sans exception, et le classer au dossier comme preuve de présentation.",
      "Vérifier l'identité de chaque client dès l'entrée en relation (pièce officielle en cours de validité) et renseigner la fiche de vigilance LCB-FT du dossier.",
      "Auditer ses annonces en cours cette semaine : prix, montant TTC des honoraires, qui les paie, DPE et GES ; corriger toute annonce non conforme sous 48 h.",
      "N'appeler, SMS ou e-mailer un particulier qu'avec une preuve de consentement opt-in, dans les horaires autorisés, et honorer immédiatement toute opposition ; privilégier la pige.",
      "Reformuler et refuser par écrit toute consigne discriminatoire d'un propriétaire, en traçant son conseil, et ne sélectionner que sur la solvabilité et les pièces légalement autorisées."
    ],
    "notesFormateur": [
      "Tenez le minutage avec un chrono visible : chaque jeu a un rôle précis, mieux vaut écourter un débat que sacrifier la synthèse finale qui ancre les acquis.",
      "Faites participer tout le monde en variant les formats (équipes, binômes, cartons levés, téléphone) : le débutant juridique apprend par le faire, pas par l'écoute passive.",
      "Ramenez chaque règle à un exemple Icaza Immobilier à Martigues : « concrètement, pour vous, lundi matin, ça veut dire… » ; le droit abstrait ne s'ancre pas.",
      "Valorisez l'erreur comme matière première : demandez à ceux qui se trompent d'expliquer la bonne réponse, c'est le meilleur ancrage mémoriel.",
      "Distinguez clairement l'obligatoire du recommandé (ex. DPO pas toujours obligatoire, pige toujours légitime) pour éviter la peur paralysante autant que la fausse sécurité.",
      "Terminez par un tour de table d'engagement : chaque négociateur énonce à voix haute UN réflexe qu'il applique dès le lendemain, et comparez le score de fin avec celui du brise-glace pour mesurer le chemin parcouru."
    ]
  },
  "compromis": {
    "id": "compromis",
    "sousTitre": "De l'offre acceptée à la remise des clés : sécuriser chaque compromis et ne plus jamais perdre une vente entre l'avant-contrat et l'acte.",
    "objectifs": [
      "Maîtriser la différence entre compromis de vente et promesse unilatérale (PUV), et savoir recommander la bonne forme selon le profil du dossier.",
      "Être capable de constituer un compromis complet et bien annexé (DDT, documents loi ALUR, urbanisme) qui ne bloque pas chez le notaire.",
      "Savoir décompter sans erreur le délai de rétractation SRU de 10 jours et sécuriser sa notification pour qu'il ne se rouvre jamais.",
      "Rédiger et suivre des conditions suspensives précises (prêt loi Scrivener, préemption) qui tiennent juridiquement.",
      "Être capable d'expliquer à l'acquéreur le dépôt de garantie, le séquestre, la clause pénale et les obligations LCB-FT/Tracfin.",
      "Piloter la période compromis vers acte (2 à 3 mois) avec une checklist et un rétroplanning pour ne plus perdre de vente après signature."
    ],
    "agenda": [
      {
        "titre": "Accueil, café et brise-glace « Le mur des ventes perdues »",
        "duree": "0:00 - 0:15 (15 min)"
      },
      {
        "titre": "Apport 1 : les deux avant-contrats (compromis vs PUV) + contenu et annexes du compromis",
        "duree": "0:15 - 0:35 (20 min)"
      },
      {
        "titre": "Jeu 1 : Quiz-battle en équipes « Les 10 jours et les chiffres qui tuent »",
        "duree": "0:35 - 0:50 (15 min)"
      },
      {
        "titre": "Apport 2 : rétractation SRU, dépôt/séquestre/clause pénale, conditions suspensives et prêt Scrivener",
        "duree": "0:50 - 1:10 (20 min)"
      },
      {
        "titre": "Jeu 2 : Vrai/Faux debout « Mythes du compromis » + Jeu 3 : Défi chrono « Checklist des annexes »",
        "duree": "1:10 - 1:30 (20 min)"
      },
      {
        "titre": "Jeu de rôle : mise en situation téléphonique « L'acquéreur qui veut se rétracter » + étude de cas",
        "duree": "1:30 - 1:55 (25 min)"
      },
      {
        "titre": "Synthèse points-clés, plan d'action individuel « 3 engagements pour demain » et clôture",
        "duree": "1:55 - 2:10 (15 min)"
      }
    ],
    "briseGlace": {
      "titre": "Le mur des ventes perdues",
      "consignes": [
        "Distribuer à chaque négociateur 2 post-it. Consigne : noter sur chacun une vente (réelle ou redoutée) qui a capoté ou failli capoter ENTRE le compromis et l'acte — en une phrase, avec la cause (financement, préemption, rétractation, pièce manquante, mésentente de dernière minute…).",
        "Chacun vient coller ses post-it au tableau en disant une phrase : « Ma vente a failli tomber à cause de… ». Le formateur regroupe les post-it par famille de causes au fur et à mesure.",
        "Faire constater à voix haute quelle famille domine (souvent le financement et les pièces manquantes). Conclure : « Tout ce qui est sur ce mur, on va apprendre aujourd'hui à l'éviter. On garde le mur affiché toute la séance, on cochera ce qu'on sait désormais neutraliser. »",
        "Durée cible : 12-15 min. Objectif : ancrer la séance dans le vécu du terrain et créer l'enjeu émotionnel (personne n'aime perdre une vente déjà signée)."
      ]
    },
    "jeux": [
      {
        "titre": "Quiz-battle « Les 10 jours et les chiffres qui tuent »",
        "type": "Quiz-battle en équipes",
        "duree": "15 min",
        "consignes": [
          "Constituer 2 ou 3 équipes de niveau mélangé. Chaque équipe choisit un nom et désigne un porte-parole qui seul donne la réponse finale.",
          "Le formateur projette une question à la fois (slide). Les équipes se concertent 20 secondes à voix basse, puis lèvent un carton A/B/C/D (ou ardoise). Révélation simultanée au top : pas de réponse soufflée après le top.",
          "1 point par bonne réponse, +1 point bonus si le porte-parole justifie correctement (article ou raison). Tenir le score au tableau.",
          "Enchaîner 8 à 10 questions tirées du quiz du module : délai SRU (10 j calendaires), durée mini condition de prêt (1 mois), acceptation de l'offre de prêt (après 10 j de réflexion), clause pénale (10 %), taux d'effort HCSF (35 % assurance comprise), frais de notaire (7-8 % ancien / 2-3 % neuf), enregistrement PUV sous seing privé (10 j), restitution dépôt après rétractation (21 j), VEFA mise hors d'eau (70 %), DMTO 2025 (5 %).",
          "L'équipe gagnante est applaudie ; distribuer un petit lot symbolique (viennoiserie, café offert)."
        ],
        "animation": [
          "Imposez le top de révélation simultanée, sinon la première équipe qui parle donne la réponse aux autres.",
          "Après chaque question, ne vous contentez pas de « bonne réponse » : faites reformuler le POURQUOI par l'équipe, c'est là que l'apprentissage s'ancre.",
          "Glissez volontairement les pièges classiques du module (jours calendaires vs ouvrés, assurance comprise dans les 35 %) pour créer le débat.",
          "Gardez un rythme vif : 60-80 secondes par question maximum."
        ],
        "corrige": [
          "Rétractation SRU : 10 jours calendaires, à compter du lendemain de la 1re présentation de la notification (report au 1er jour ouvrable si le 10e tombe un samedi/dimanche/férié).",
          "Condition suspensive de prêt : minimum légal 1 mois (loi Scrivener, art. L313-41), en pratique 45-60 jours.",
          "Offre de prêt : acceptable au plus tôt le 11e jour (10 jours de réflexion, art. L313-34) ; offre maintenue 30 jours minimum (art. L313-24).",
          "Clause pénale : environ 10 % du prix, joue dans les deux sens, modérable par le juge (art. 1231-5).",
          "HCSF : taux d'effort max 35 % assurance comprise, durée ≤ 25 ans (27 ans avec différé dans le neuf), marge de flexibilité de 20 % des dossiers.",
          "Frais de notaire : 7-8 % dans l'ancien, 2-3 % dans le neuf.",
          "PUV sous seing privé : à enregistrer aux impôts dans les 10 jours sous peine de nullité (art. 1589-2).",
          "Restitution du dépôt après rétractation SRU : 21 jours maximum.",
          "VEFA : 35 % aux fondations, 70 % à la mise hors d'eau, 95 % à l'achèvement, 5 % à la livraison (art. R261-14).",
          "DMTO 2025 : relèvement possible de la part départementale de 4,50 % à 5 % (actes du 1er avril 2025 au 31 mars 2028)."
        ]
      },
      {
        "titre": "Vrai/Faux debout « Les mythes du compromis »",
        "type": "Vrai/Faux dynamique",
        "duree": "10 min",
        "consignes": [
          "Tout le monde se lève au centre de la salle. Un côté = VRAI, l'autre côté = FAUX. À chaque affirmation, chacun se déplace physiquement du côté de sa réponse.",
          "Le formateur lit une affirmation, laisse 5 secondes de déplacement, puis interroge une personne de chaque camp : « Pourquoi es-tu de ce côté ? » avant de donner la réponse et l'explication.",
          "Celui qui s'est trompé revient au centre ; on continue. Pas d'élimination, l'intérêt est le débat et le mouvement.",
          "Enchaîner 8 affirmations (voir corrigé). Terminer sur une affirmation qui fait débat pour relancer l'énergie."
        ],
        "animation": [
          "Le format debout casse la torpeur de l'après-apport : utilisez-le juste après un temps théorique.",
          "Choisissez d'interroger quelqu'un de sûr de lui qui s'est trompé : l'erreur assumée marque les esprits mieux qu'une bonne réponse.",
          "Reliez chaque réponse au « mur des ventes perdues » du brise-glace quand c'est possible."
        ],
        "corrige": [
          "« Le vendeur aussi a 10 jours pour se rétracter. » → FAUX : seul l'acquéreur non professionnel bénéficie du droit SRU ; le vendeur est engagé dès la signature.",
          "« On peut signer le compromis même s'il manque un PV d'AG, on complétera après. » → FAUX : sans les documents de copropriété remis, le délai de rétractation ne court pas valablement et peut se rouvrir des mois plus tard.",
          "« Le dépôt de garantie, c'est la commission de l'agence. » → FAUX : il appartient à l'acquéreur jusqu'à l'acte (ou revient au vendeur si défaillance fautive), il s'impute sur le prix.",
          "« Un refus de prêt, quel qu'il soit, libère toujours l'acquéreur. » → FAUX : seul un refus conforme aux caractéristiques de la clause (montant, durée, taux) vaut réalisation de la condition.",
          "« La clause pénale ne protège que le vendeur. » → FAUX : elle joue dans les deux sens, le vendeur défaillant peut la devoir à l'acquéreur.",
          "« La plus-value sur la résidence principale est totalement exonérée. » → VRAI.",
          "« Une PUV sous seing privé est valable sans formalité. » → FAUX : enregistrement aux impôts dans les 10 jours sous peine de nullité.",
          "« On peut faire payer des droits de mutation sur la cuisine équipée. » → FAUX (évitable) : le mobilier chiffré à part n'est pas soumis aux droits de mutation."
        ]
      },
      {
        "titre": "Défi chrono « La checklist des annexes »",
        "type": "Défi chrono / brainstorm",
        "duree": "10 min",
        "consignes": [
          "En binômes ou petites équipes, distribuer une feuille vierge. Top chrono : 3 minutes pour lister le maximum de pièces et annexes obligatoires d'un compromis (diagnostics + documents loi ALUR + urbanisme).",
          "Au top final, chaque équipe compte ses items. Tour de table : on additionne au tableau la liste collective, chaque équipe apporte un item que les autres n'ont pas (1 point par item valide et unique).",
          "Le formateur complète avec les pièces oubliées et annonce le piège : les validités courtes (termites 6 mois, ERP 6 mois) qu'il faut vérifier AVANT la notification.",
          "Variante express si le temps manque : le faire à l'oral en pop-corn, chacun lance une pièce à tour de rôle sans répéter."
        ],
        "animation": [
          "Le chrono crée l'urgence et révèle vite qui connaît son DDT par cœur.",
          "Insistez sur le lien avec la rétractation : une annexe manquante = délai SRU qui ne démarre pas = risque de vente qui tombe tardivement.",
          "Faites de la liste collective un support à photographier : les négociateurs la ré-utiliseront sur le terrain."
        ],
        "corrige": [
          "Diagnostics (DDT, art. L271-4 CCH) : DPE (10 ans), amiante (permis avant 01/07/1997), plomb/CREP (avant 1949), termites (zone arrêtée, 6 mois), gaz et électricité (installation > 15 ans, 3 ans), ERP/état des risques (6 mois, crucial en PACA : sismique, inondation, feux), loi Carrez (surface privative en copro), assainissement non collectif/SPANC (3 ans).",
          "Copropriété (loi ALUR) : pré-état daté du syndic, règlement de copropriété + état descriptif de division, PV des 3 dernières AG, montant des charges, carnet d'entretien (et DTG le cas échéant), montant du fonds de travaux et quote-part du vendeur.",
          "Urbanisme : note/certificat d'urbanisme, servitudes, zonage PLU, alignements.",
          "Piège validité : termites 6 mois et ERP 6 mois à revérifier avant la signature, pas après."
        ]
      },
      {
        "titre": "Étude de cas « Le dossier à aiguiller : compromis ou PUV ? »",
        "type": "Étude de cas en sous-groupes",
        "duree": "12 min",
        "consignes": [
          "Projeter/distribuer 3 mini-dossiers (voir corrigé). Chaque sous-groupe traite les 3 : pour chacun, choisir compromis OU PUV, justifier, et citer la ou les clauses/précautions à prévoir.",
          "Laisser 6-7 minutes de travail en groupe, puis restitution : un rapporteur différent par dossier.",
          "Débattre des écarts entre groupes : souvent le dossier « acquéreur qui doit revendre + SCI » divise. C'est l'occasion d'ancrer la logique PUV + clause de substitution.",
          "Le formateur tranche avec le corrigé et relie au cas pratique du module (villa de Jonquières à 320 000 €)."
        ],
        "animation": [
          "Ne donnez pas la réponse trop vite : laissez le désaccord s'exprimer, c'est lui qui fait réfléchir.",
          "Reliez systématiquement au profil réel de vos acquéreurs martégaux (primo-accédants, investisseurs en SCI, acquéreurs devant revendre).",
          "Valorisez la justification plus que le bon choix : un compromis défendu avec de bons arguments vaut mieux qu'une PUV choisie au hasard."
        ],
        "corrige": [
          "Dossier A — Couple primo-accédant, apport de 10 %, prêt à monter, achat de leur résidence principale à Martigues. → COMPROMIS classique, condition suspensive de prêt précise (montant, durée, taux max, 2 banques, délai 60 j), date butoir 3 mois. Acquéreur décidé qui veut avancer.",
          "Dossier B — Investisseur qui achètera via une SCI familiale encore à constituer et doit d'abord revendre son appartement. → PUV de 3 mois avec indemnité d'immobilisation (~10 %) et CLAUSE DE SUBSTITUTION au profit de la SCI. Le vendeur immobilise le bien contre indemnité, l'acquéreur garde la main sur son montage.",
          "Dossier C — Vendeur pressé, acquéreur comptant (pas de prêt) et déterminé. → COMPROMIS, renonciation à la condition de prêt possible MAIS avec mention manuscrite (art. L313-42) rappelant la perte de la protection Scrivener ; vigilance LCB-FT sur l'origine des fonds."
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "L'acquéreur qui veut se rétracter (mise en situation téléphonique)",
        "contexte": "Compromis signé en agence il y a 6 jours pour un T3 à Martigues (quartier de L'Île), prix 210 000 €, dépôt de 5 % séquestré chez le notaire, notification SRU partie par le notaire il y a 5 jours. L'acquéreur appelle, paniqué : son beau-frère lui a dit qu'il avait « trouvé mieux ailleurs » et il veut savoir s'il peut annuler et récupérer son argent.",
        "roleA": "Le négociateur de l'agence (reçoit l'appel). Il doit rester factuel, exact juridiquement et professionnel : expliquer où en est le délai de rétractation, ce que l'acquéreur peut faire, dans quelles conditions et sous quelle forme, sans jamais donner de conseil faux ni de fausse promesse.",
        "roleB": "L'acquéreur stressé et pressé, qui coupe la parole, confond rétractation et condition suspensive, demande si « un coup de fil suffit » pour annuler et s'il récupère tout tout de suite.",
        "objectif": "Savoir expliquer clairement le droit de rétractation SRU (10 jours calendaires à compter du lendemain de la 1re présentation, donc encore possible ici), la nécessité d'un écrit, la restitution intégrale sous 21 jours, et distinguer rétractation et condition suspensive — tout en gardant une relation de confiance.",
        "debrief": [
          "Le négociateur a-t-il donné la bonne information sur le point de départ et la fin du délai (jours calendaires, report si le 10e jour tombe un week-end/férié) ?",
          "A-t-il exigé un écrit et expliqué pourquoi (traçabilité, sécurité de la restitution) plutôt que d'accepter un simple appel ?",
          "A-t-il bien distingué « se rétracter » (droit libre dans les 10 jours) de « faire jouer une condition suspensive » (hors délai, autre logique) ?",
          "Le ton : a-t-il rassuré sans mentir ni sur-promettre (ne pas dire « vous récupérez tout de toute façon » sans nuance) ? Qu'aurait-on pu dire de mieux pour préserver la relation si l'acquéreur maintient la vente ?"
        ]
      },
      {
        "titre": "Le vendeur qui veut un acquéreur « sans condition de prêt »",
        "contexte": "Rendez-vous à l'agence. Le vendeur d'une maison à 320 000 € a reçu deux offres au prix : l'une d'un acquéreur à crédit (avec condition suspensive de prêt), l'autre d'un acquéreur qui dit « acheter comptant ». Le vendeur veut absolument écarter la condition de prêt « parce que c'est trop risqué » et pousse le négociateur à retirer la clause pour tous.",
        "roleA": "Le négociateur, qui doit expliquer au vendeur le cadre de la loi Scrivener (condition de prêt obligatoire dès que l'acquéreur recourt au crédit), ce qu'implique une renonciation (mention manuscrite, perte de protection) et pourquoi « supprimer la clause » n'est ni légal ni dans l'intérêt bien compris du vendeur.",
        "roleB": "Le vendeur impatient, un peu méfiant, qui a entendu des histoires de ventes qui tombent à cause du financement et veut « du solide », quitte à prendre l'offre la plus basse si elle est « sûre ».",
        "objectif": "Être capable de défendre une clause de prêt bien rédigée comme un facteur de sécurité (et non de fragilité), d'expliquer la renonciation encadrée pour l'acquéreur comptant, et d'orienter le vendeur vers le meilleur dossier réel plutôt que vers une fausse sécurité.",
        "debrief": [
          "Le négociateur a-t-il expliqué que la condition de prêt est obligatoire dès qu'il y a recours au crédit, et qu'on ne peut pas simplement la « retirer » ?",
          "A-t-il valorisé une clause PRÉCISE (montant, durée, taux max, nombre de banques, délai) comme protection pour les deux parties plutôt que comme un risque ?",
          "A-t-il abordé la qualification du financement en amont (apport, taux d'effort HCSF 35 %) pour rassurer le vendeur sur le sérieux de l'acquéreur à crédit ?",
          "A-t-il su recadrer l'idée reçue « comptant = sûr » (origine des fonds, LCB-FT) sans braquer le vendeur ?"
        ]
      }
    ],
    "pointsCles": [
      "Rien n'est « vendu » au compromis : la vente se gagne ou se perd dans les 2 à 3 mois qui suivent. Le suivi de l'agent fait la différence.",
      "Compromis = engagement des deux parties (art. 1589, « la promesse de vente vaut vente ») ; PUV = seul le vendeur s'engage, l'acquéreur verse une indemnité d'immobilisation. PUV sous seing privé : enregistrement aux impôts sous 10 jours ou nullité.",
      "Un compromis complet et bien annexé (DDT, documents loi ALUR, urbanisme) = un acte rapide. Chaque pièce manquante = un délai et un risque de blocage.",
      "Rétractation SRU = 10 jours calendaires, à compter du lendemain de la 1re présentation de la notification ; report au 1er jour ouvrable si le 10e tombe un samedi/dimanche/férié. Elle ne démarre valablement que si TOUTES les annexes (dont copro) sont remises.",
      "Le dépôt de garantie (5 à 10 %) doit être séquestré (notaire, ou agent avec garantie financière et compte dédié), jamais versé au vendeur. Il s'impute sur le prix.",
      "La clause pénale (≈10 %) forfaitise les dommages, joue dans les deux sens et peut être modérée par le juge. L'expliquer en amont évite la majorité des désistements de confort.",
      "Une condition suspensive doit être PRÉCISE et datée. Pour le prêt : montant, durée, taux maximal, nombre de banques, délai. Une clause vague fait tomber des ventes.",
      "Condition de prêt (loi Scrivener) : obligatoire dès recours au crédit, minimum 1 mois. Seul un refus CONFORME aux caractéristiques de la clause libère l'acquéreur. L'offre s'accepte au plus tôt le 11e jour (10 j de réflexion).",
      "Obligations LCB-FT / Tracfin : identifier le client et s'interroger sur l'origine des fonds. Un dépôt en espèces hors plafond ou versé par un tiers est un signal d'alerte.",
      "Piloter la phase compromis vers acte avec une checklist (J+1 banque, J+10 rétractation purgée, J+21 accord de principe, J+45 offre, J+60 date d'acte) et purger les droits de préemption (DPU : 2 mois, silence = renonciation)."
    ],
    "planAction": [
      "Dès demain, ouvrir un rétroplanning daté pour chaque compromis en cours (J+1 banque, J+10 rétractation, J+21 accord de principe, J+45 offre, J+60 date d'acte) et le suivre comme un tableau de bord.",
      "Avant toute notification SRU, vérifier que TOUTES les annexes sont réunies (DDT à jour — attention termites et ERP à 6 mois — + documents loi ALUR de copropriété) et laisser le notaire notifier pour sécuriser la date de départ du délai.",
      "Pour chaque nouvelle offre, qualifier le financement en amont (apport, taux d'effort 35 % assurance comprise, endettement) avant même de rédiger le compromis, et orienter l'acquéreur vers banque/courtier dès le lendemain de la signature.",
      "Rédiger systématiquement des clauses de prêt complètes : montant, durée, taux maximal hors assurance, nombre de banques à solliciter, délai — et proscrire les formulations vagues type « sous réserve de financement ».",
      "Expliquer oralement et noter au compromis les conséquences de la clause pénale et du séquestre à chaque acquéreur, pour prévenir les désistements de confort, et chiffrer le mobilier à part quand c'est pertinent.",
      "Appliquer le réflexe LCB-FT sur chaque dossier : vérifier l'identité et s'interroger sur l'origine des fonds, et signaler toute opération atypique à son responsable."
    ],
    "notesFormateur": [
      "Affichez le « mur des ventes perdues » du brise-glace pendant toute la séance et revenez-y : à chaque point maîtrisé, cochez la cause correspondante. C'est le fil rouge qui donne du sens et de la fierté en fin de séance.",
      "Alternez strictement apport court (20 min max) et activité : le module est dense et juridique, l'attention décroche vite si vous enchaînez les slides. Le format debout (Vrai/Faux) est votre bouée après chaque temps théorique.",
      "Pour ancrer les chiffres qui comptent (10 jours, 35 %, 21 jours, 5 %…), faites-les REFORMULER par les participants plutôt que de les énoncer vous-même ; le quiz-battle sert exactement à ça.",
      "Ramenez chaque notion au terrain martégal (biens à 210-320 K€, risque sismique et inondation ERP en PACA, acquéreurs en SCI) : le contenu générique glisse, l'exemple local reste.",
      "Gérez le temps avec un chrono visible et un co-animateur ou un participant « gardien du temps ». Les jeux de rôle débordent toujours : fixez 5-6 min de jeu + 4-5 min de débrief et tenez-le.",
      "Terminez par le plan d'action individuel écrit : chacun note 3 engagements concrets qu'il applique dès demain, les lit à voix haute, et vous les reprenez en point d'étape à la prochaine réunion commerciale pour ancrer durablement."
    ]
  },
  "dpe-energie": {
    "id": "dpe-energie",
    "sousTitre": "DPE opposable, passoires thermiques et valeur verte : transformer la contrainte énergétique en argument de vente",
    "objectifs": [
      "Savoir lire les deux étiquettes d'un DPE (énergie et climat) et appliquer le principe du double seuil pour annoncer la bonne classe",
      "Maîtriser le calendrier réglementaire 2023-2034 : interdictions de louer (G-F-E = 25-28-34), gel des loyers F/G et audit énergétique de vente",
      "Être capable de sécuriser chaque mandat en déroulant la checklist DPE (validité, numéro ADEME, cohérence, réforme petites surfaces 2024)",
      "Savoir distinguer les trois documents énergétiques : DPE, audit réglementaire de vente et DPE collectif en copropriété",
      "Être capable de transformer une passoire thermique en projet chiffré et aidé grâce à la valeur verte et aux dispositifs 2024-2026",
      "Maîtriser les mentions obligatoires de l'annonce et du DDT pour éviter toute sanction de la DGCCRF"
    ],
    "agenda": [
      {
        "titre": "Accueil et brise-glace « La pire des deux lettres »",
        "duree": "0-10 min (10 min)"
      },
      {
        "titre": "Apport 1 : le DPE opposable, les deux étiquettes et le double seuil (mini-cours interactif au paperboard)",
        "duree": "10-25 min (15 min)"
      },
      {
        "titre": "Jeu 1 : Quiz-battle en équipes sur les seuils, dates et sanctions",
        "duree": "25-45 min (20 min)"
      },
      {
        "titre": "Apport 2 : calendrier des interdictions de louer, gel des loyers et audit de vente",
        "duree": "45-55 min (10 min)"
      },
      {
        "titre": "Jeu 2 : Vrai/Faux debout « Louable ou pas ? » + Jeu 3 : Défi chrono « Classe-moi ce bien »",
        "duree": "55-75 min (20 min)"
      },
      {
        "titre": "Jeu 4 : Étude de cas « Le mandat piégé » en sous-groupes",
        "duree": "75-95 min (20 min)"
      },
      {
        "titre": "Jeu de rôle : mise en situation téléphonique vendeur de passoire",
        "duree": "95-110 min (15 min)"
      },
      {
        "titre": "Synthèse : points-clés, plan d'action du lendemain et clôture",
        "duree": "110-120 min (10 min)"
      }
    ],
    "briseGlace": {
      "titre": "« La pire des deux lettres » - sondage à main levée",
      "consignes": [
        "Projetez au tableau trois mini-fiches de biens (préparées sur une slide) : Bien 1 = 150 kWh énergie / 45 kg CO2 climat ; Bien 2 = 90 kWh / 8 kg CO2 ; Bien 3 = 200 kWh / 60 kg CO2 (fioul).",
        "Pour chaque bien, demandez au groupe d'annoncer à voix haute la classe finale en levant le nombre de doigts correspondant (A=1 ... G=7), sans calculatrice, en 10 secondes chrono.",
        "Révélez les réponses : Bien 1 = D (climat), Bien 2 = B, Bien 3 = E (climat). Insistez : on retient toujours la plus mauvaise des deux étiquettes.",
        "Terminez par la question ouverte : « Qui, parmi vous, a déjà diffusé ou failli diffuser une annonce avec la seule étiquette énergie ? » - laissez 2-3 témoignages pour installer les enjeux concrets.",
        "Annoncez le fil rouge de la séance : « Aujourd'hui, le DPE n'est plus une formalité, c'est un argument de vente et un risque juridique - on va apprendre à en faire un atout. »"
      ]
    },
    "jeux": [
      {
        "titre": "Quiz-battle DPE : « Les énergivores contre les performants »",
        "type": "Quiz-battle en équipes",
        "duree": "20 min",
        "consignes": [
          "Divisez le groupe en 2 à 4 équipes de 2-4 personnes ; chaque équipe choisit un nom de classe (ex : « Les A », « Les G »).",
          "Posez 10 questions à l'oral ou au vidéoprojecteur (voir corrigé), une par une. Chaque équipe écrit sa réponse sur une ardoise/feuille et la retourne au top.",
          "Bonne réponse = 1 point ; bonne réponse ET justification correcte donnée par l'équipe = 2 points (le formateur désigne au hasard un membre pour justifier).",
          "Question bonus « chrono » en fin de partie : la première équipe à citer de mémoire le calendrier G-F-E (2025-2028-2034) remporte 3 points.",
          "Tenez le score au paperboard ; l'équipe gagnante est applaudie et peut, par exemple, choisir le prochain café offert."
        ],
        "animation": [
          "Rythmez : 30 secondes par question, pas plus, pour maintenir la tension.",
          "Reformulez systématiquement la bonne réponse avec la règle sous-jacente avant de passer à la suivante - c'est là que l'ancrage se fait, pas dans le score.",
          "Valorisez la justification autant que la réponse : un négociateur doit savoir EXPLIQUER au client, pas seulement cocher.",
          "Variez les membres interrogés pour éviter que le plus à l'aise réponde tout le temps."
        ],
        "corrige": [
          "Q1. Validité d'un DPE méthode 2021 ? -> 10 ans (ceux d'avant juillet 2021 sont périmés depuis le 1er janvier 2025).",
          "Q2. Classe retenue = meilleure ou pire des deux étiquettes ? -> la pire des deux (double seuil).",
          "Q3. Depuis quand le DPE est-il opposable ? -> 1er juillet 2021.",
          "Q4. Quelle classe est interdite à la location depuis 2025 ? -> G.",
          "Q5. Depuis quand l'audit de vente vise-t-il aussi la classe E ? -> 1er janvier 2025 (F/G depuis le 1er avril 2023).",
          "Q6. Qu'a corrigé la réforme du 1er juillet 2024 ? -> le calcul des logements de 40 m² ou moins (~140 000 sortis du statut de passoire).",
          "Q7. Le seuil de 450 kWh/m²/an de 2023 est en énergie primaire ou finale ? -> finale.",
          "Q8. Parmi MaPrimeRénov', éco-PTZ, CEE : lequel est un prêt à 0 % ? -> l'éco-PTZ.",
          "Q9. Peut-on augmenter le loyer d'un F/G déjà loué ? -> non, gel des loyers depuis le 24 août 2022.",
          "Q10. Seuils de la classe A ? -> au plus 70 kWh/m²/an ET au plus 6 kg CO2/m²/an."
        ]
      },
      {
        "titre": "Vrai/Faux debout : « Louable ou pas ? »",
        "type": "Vrai/Faux dynamique (déplacement physique)",
        "duree": "10 min",
        "consignes": [
          "Désignez un côté de la salle « VRAI » et l'autre « FAUX ». Tout le monde se lève au centre.",
          "Énoncez une affirmation ; au top, chacun se déplace du côté qu'il croit juste. Ceux qui hésitent restent au milieu (ils devront argumenter).",
          "Après chaque affirmation, interrogez une personne de chaque camp : « Pourquoi es-tu de ce côté ? » puis révélez la réponse et la règle.",
          "Enchaînez 8 à 10 affirmations sur un rythme soutenu (voir corrigé).",
          "Finissez par une affirmation « piège » pour rire et marquer les esprits."
        ],
        "animation": [
          "Le mouvement réveille le groupe après un apport : placez ce jeu juste après un temps assis.",
          "Ne laissez jamais passer une erreur collective sans la nommer : si la majorité se trompe, c'est le point à re-expliquer absolument.",
          "Utilisez l'humour sur les pièges (énergie finale vs primaire) pour désamorcer la complexité."
        ],
        "corrige": [
          "« Un G peut être mis en location en 2026. » -> FAUX (G interdit depuis le 1er janvier 2025).",
          "« L'interdiction de louer casse les baux déjà en cours. » -> FAUX (elle joue au nouveau bail, renouvellement ou reconduction tacite).",
          "« On peut augmenter le loyer d'un F après travaux s'il reste classé F. » -> FAUX (gel total tant que F/G).",
          "« Un DPE de mars 2019 est encore valable aujourd'hui. » -> FAUX (périmé depuis le 31 décembre 2024).",
          "« Les recommandations de travaux du DPE sont opposables. » -> FAUX (seules étiquettes et consommations le sont).",
          "« Un studio de 28 m² classé F en 2022 peut être reclassé E grâce à la réforme 2024. » -> VRAI.",
          "« L'audit énergétique de vente est obligatoire pour vendre un lot de copropriété classé F. » -> FAUX (c'est le DPE ; l'audit vise maisons et immeubles en mono-propriété).",
          "« Le seuil de 450 kWh de 2023 est exprimé en énergie finale. » -> VRAI.",
          "« Un monument historique classé est dispensé de DPE. » -> VRAI.",
          "« Un logement neuf RE2020 ressort généralement en A ou B. » -> VRAI."
        ]
      },
      {
        "titre": "Défi chrono : « Classe-moi ce bien »",
        "type": "Défi chrono (calcul express du double seuil)",
        "duree": "10 min",
        "consignes": [
          "Projetez successivement 6 fiches de biens, chacune avec une valeur énergie (kWh/m²/an) ET une valeur climat (kg CO2/m²/an).",
          "Individuellement ou en binôme, chacun note la classe finale sur sa feuille en moins de 20 secondes par fiche.",
          "Rappelez au tableau l'aide-mémoire des seuils (A 70/6, B 110/11, C 180/30, D 250/50, E 330/70, F 420/100, G au-delà).",
          "Correction immédiate après chaque fiche : on retient toujours la pire des deux étiquettes.",
          "Celui qui a le plus de bonnes réponses sur 6 est désigné « expert étiquette » du jour."
        ],
        "animation": [
          "Insistez sur le réflexe : lire les DEUX valeurs avant d'annoncer, jamais l'énergie seule.",
          "Glissez volontairement des cas où le climat dégrade la classe (chauffage fioul/gaz) pour ancrer le double seuil.",
          "Rappelez le contexte local : Martigues est en zone H3, hivers doux, donc souvent de meilleurs DPE côté chauffage mais vigilance sur le confort d'été."
        ],
        "corrige": [
          "Fiche 1 : 100 kWh / 9 kg CO2 -> B (les deux sous les seuils B).",
          "Fiche 2 : 160 kWh / 45 kg CO2 -> D (le climat à 45 dépasse C=30, donc D).",
          "Fiche 3 : 200 kWh / 60 kg CO2 (fioul) -> E (climat 60 dépasse D=50).",
          "Fiche 4 : 60 kWh / 5 kg CO2 -> A.",
          "Fiche 5 : 300 kWh / 65 kg CO2 -> E (énergie 300 et climat 65 tous deux en E).",
          "Fiche 6 : 240 kWh / 105 kg CO2 -> G (climat dépasse 100, bascule en G malgré une énergie en D)."
        ]
      },
      {
        "titre": "Étude de cas : « Le mandat piégé »",
        "type": "Étude de cas en sous-groupes",
        "duree": "20 min",
        "consignes": [
          "Répartissez en sous-groupes de 2-3. Distribuez la fiche du bien : studio de 32 m² à Martigues, DPE daté de février 2022 affichant F, vendeur pressé, en copropriété de 60 lots construite en 2008, bailleur qui veut relouer vite.",
          "Mission (10 min) : chaque sous-groupe liste les réflexes à dérouler avant de rentrer le mandat et de diffuser l'annonce, et identifie les pièges.",
          "Chaque sous-groupe restitue en 2 min ; le formateur complète au paperboard.",
          "Validez la solution complète (voir corrigé) et faites verbaliser l'argumentaire à tenir au vendeur.",
          "Variante express si le temps manque : traiter le cas en grand groupe à l'oral."
        ],
        "animation": [
          "Laissez les sous-groupes buter sur les pièges avant de donner la réponse : l'erreur vécue s'ancre mieux.",
          "Reliez le cas à la checklist mémo de l'agent vue en synthèse pour montrer qu'elle se déroule en 20 minutes réelles.",
          "Faites ressortir l'enjeu commercial : un réflexe oublié = annonce non conforme + mandat fragilisé."
        ],
        "corrige": [
          "Vérifier la date du DPE : février 2022 = méthode 2021, encore valable 10 ans, OK.",
          "Piège n°1 : studio de 32 m² (40 m² ou moins) classé F AVANT le 1er juillet 2024 -> vérifier la réforme petites surfaces : rééditer l'attestation ADEME, le bien peut ressortir E et redevenir louable.",
          "Contrôler le numéro ADEME et la cohérence de la classe avec l'état réel.",
          "Louabilité : si le bien reste F, interdiction de louer en 2028 seulement (F), pas en 2026 ; mais gel des loyers immédiat car F/G. S'il passe E après recalcul, louable mais E interdit en 2034.",
          "Copropriété de 60 lots (50 à 200 lots) : DPE collectif obligatoire depuis le 1er janvier 2025 - en parler avec le syndic.",
          "Annonce : afficher les deux étiquettes + coût annuel théorique d'énergie ; mention « logement à consommation énergétique excessive » si F/G.",
          "Argumentaire vendeur : transparence, recalcul 2024, prix net intégrant d'éventuels travaux et aides, orientation France Rénov'."
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "Le coup de fil du vendeur de passoire",
        "contexte": "Un propriétaire appelle l'agence : il veut vendre sa maison individuelle de 95 m² à Martigues, classée F au DPE. Il est persuadé que « le DPE, c'est juste indicatif » et refuse d'entendre parler de travaux ou d'audit. Il fixe un prix de 300 000 €, aligné sur une maison D voisine vendue l'an dernier.",
        "roleA": "Le négociateur : il reçoit l'appel, doit expliquer le caractère opposable du DPE, l'obligation d'audit énergétique de vente (maison F depuis le 1er avril 2023, remis dès la première visite), la valeur verte / décote des passoires, et positionner un prix net réaliste sans braquer le vendeur. Objectif : décrocher un rendez-vous d'estimation.",
        "roleB": "Le vendeur : méfiant, pressé, convaincu que son bien vaut autant que le D voisin, agacé à l'idée de dépenser pour un audit. Il teste la solidité du négociateur (« pourquoi je paierais un audit ? », « le DPE ça ne veut rien dire »).",
        "objectif": "S'entraîner à transformer une objection « le DPE c'est indicatif » en argument de transparence et d'anticipation, tout en restant exact sur le droit (opposabilité depuis juillet 2021, audit obligatoire, à charge du vendeur, valable 5 ans) et en sécurisant un rendez-vous.",
        "debrief": [
          "Le négociateur a-t-il corrigé en douceur l'idée fausse « le DPE est indicatif » en expliquant l'opposabilité depuis le 1er juillet 2021 ?",
          "A-t-il bien présenté l'audit comme un outil qui désamorce la peur des travaux (deux scénarios, aides, viser au moins la classe E) plutôt que comme une contrainte ?",
          "A-t-il tenu la ligne sur le prix net (valeur verte, décote d'une passoire) sans braquer ni survaloriser ?",
          "Quels mots ont fait baisser la tension ? Lesquels ont crispé le vendeur ?",
          "A-t-il obtenu le rendez-vous d'estimation ? Sinon, qu'aurait-il fallu dire différemment ?"
        ]
      },
      {
        "titre": "Face à l'investisseur qui veut louer un G",
        "contexte": "En rendez-vous, un investisseur veut acheter un appartement classé G à Martigues pour le mettre en location dès 2026. Il n'a pas en tête les interdictions de louer et croit faire une bonne affaire au prix affiché.",
        "roleA": "Le négociateur : il doit annoncer franchement qu'un G est non louable depuis le 1er janvier 2025, puis retourner la contrainte en opportunité (décote à l'achat, aides, DPE projeté, plus-value après rénovation) et orienter vers France Rénov' sans promettre de montant d'aide précis.",
        "roleB": "L'investisseur : rentabilité avant tout, un peu pressé, prêt à renoncer s'il pense s'être trompé. Il demande des chiffres précis sur les aides et un rendement rapide.",
        "objectif": "Savoir délivrer une mauvaise nouvelle réglementaire (G non louable) tout en gardant le client, en reconstruisant un projet chiffré et aidé et en restant prudent sur les montants (fourchettes, renvoi au conseiller).",
        "debrief": [
          "Le négociateur a-t-il annoncé clairement l'interdiction de louer un G sans la minimiser ni dramatiser ?",
          "A-t-il su transformer la contrainte en projet (prix d'entrée bas, DPE projeté, objectif classe E/D, valeur après rénovation) ?",
          "Est-il resté prudent sur les aides (fourchettes, cumul MaPrimeRénov' / éco-PTZ / CEE, renvoi à France Rénov') sans chiffre promis à tort ?",
          "A-t-il préservé la relation et la confiance malgré la nouvelle défavorable ?"
        ]
      }
    ],
    "pointsCles": [
      "On retient toujours la PIRE des deux étiquettes (énergie primaire ET climat GES) : c'est le principe du double seuil.",
      "Le DPE est OPPOSABLE depuis le 1er juillet 2021 : vendeur, bailleur et diagnostiqueur engagent leur responsabilité sur les étiquettes et les consommations (les recommandations de travaux restent indicatives).",
      "Un DPE méthode 2021 est valable 10 ans ; tout DPE établi avant juillet 2021 est périmé depuis le 1er janvier 2025 - toujours vérifier la date et le numéro ADEME.",
      "Calendrier des interdictions de louer, à connaître par coeur : G-F-E = 2025-2028-2034 (plus le seuil 450 kWh d'énergie FINALE depuis 2023).",
      "Les loyers des passoires F et G sont GELÉS depuis le 24 août 2022 : pas d'IRL, pas de réévaluation, pas de hausse après travaux tant que le bien reste F/G.",
      "Réforme du 1er juillet 2024 : les logements de 40 m² ou moins ont été recalculés (~140 000 sortis du statut de passoire) - rééditer l'attestation ADEME avant de dire « non louable ».",
      "Audit énergétique de vente : maisons individuelles et immeubles en mono-propriété F/G (depuis le 1er avril 2023) et E (depuis le 1er janvier 2025), remis dès la première visite, à la charge du vendeur, valable 5 ans - pas pour un lot de copropriété.",
      "Toute annonce doit afficher les DEUX étiquettes + le coût annuel théorique d'énergie, et la mention « logement à consommation énergétique excessive » pour un F ou G - sinon amende jusqu'à 3 000 € (personne physique) / 15 000 € (personne morale).",
      "La valeur verte est un levier de négociation : une passoire se vend décotée, un A/B avec surcote - on vend au bon prix MAINTENANT, avant le prochain durcissement du calendrier.",
      "Les aides se cumulent sous conditions (MaPrimeRénov' subvention, éco-PTZ prêt à 0 %, CEE primes privées) : on oriente vers France Rénov' et on parle en fourchettes, jamais de montant promis."
    ],
    "planAction": [
      "Dès demain, avant toute nouvelle diffusion, dérouler la checklist DPE : date du diagnostic, numéro ADEME, cohérence de la classe, présence des deux étiquettes et du coût annuel d'énergie.",
      "Reprendre les mandats en cours de petits logements (40 m² ou moins) classés F/G sur un DPE antérieur à juillet 2024 et vérifier systématiquement le recalcul réforme 2024 (réédition gratuite de l'attestation ADEME).",
      "Pour chaque bien F, G ou E (maison ou immeuble en mono-propriété), anticiper l'audit énergétique de vente et l'avoir disponible dès la première visite.",
      "Intégrer à chaque estimation de passoire un argumentaire « valeur verte » chiffré : décote, coût des travaux, aides mobilisables et DPE projeté après rénovation.",
      "Mémoriser et réutiliser dans les rendez-vous le calendrier G-F-E = 25-28-34 et le gel des loyers F/G depuis le 24 août 2022 pour conseiller justement les bailleurs.",
      "Constituer un réflexe de renvoi vers France Rénov' et des artisans RGE partenaires, en parlant toujours en fourchettes d'aides et jamais en montant promis."
    ],
    "notesFormateur": [
      "Gérez le temps avec un minuteur visible : les jeux ont tendance à déborder. Prévoyez de pouvoir sacrifier le Défi chrono si le Quiz-battle s'est prolongé, pour préserver le jeu de rôle qui est le plus structurant.",
      "Alternez systématiquement assis (apports) et debout (Vrai/Faux, Défi chrono) : le module est dense en dates et seuils, le mouvement maintient l'attention.",
      "Faites participer les plus silencieux en les désignant pour justifier une bonne réponse d'équipe plutôt qu'en posant une question frontale - c'est moins intimidant et ça ancre mieux.",
      "Ancrez chaque acquis par un moyen mnémotechnique répété : « la pire des deux lettres », « G-F-E = 25-28-34 », « l'audit descend l'échelle F/G puis E puis D ». Faites-les répéter à voix haute.",
      "Rattachez en permanence le contenu au terrain de Martigues (zone H3, confort d'été, copropriétés anciennes du centre) pour que ce soit concret et non du droit abstrait.",
      "Rappelez la posture déontologique : ne jamais arranger une classe (DPE opposable), ne jamais promettre un montant d'aide précis - renvoyer à France Rénov' et au diagnostiqueur certifié. Clôturez en faisant formuler à chacun un engagement concret du plan d'action."
    ]
  },
  "mental-performance": {
    "id": "mental-performance",
    "sousTitre": "Le mental qui fait la différence : de l'état d'esprit gagnant aux habitudes durables du top négociateur",
    "objectifs": [
      "Adopter un état d'esprit de croissance et un locus de contrôle interne : se concentrer sur ce que l'on maîtrise (actions, préparation, attitude) plutôt que sur le marché ou les taux.",
      "Dédramatiser et exploiter le refus : dissocier le « non » de soi, lui donner une valeur monétaire et appliquer la règle SW-SW-SW-N pour enchaîner sans ruminer.",
      "Maîtriser des routines concrètes de préparation mentale et de régulation du stress (méthode CAP, cohérence cardiaque 3-6-5, méthode STOP) mobilisables avant un RDV de mandat.",
      "Garder la main mentalement en négociation : tenir sa posture de non-besoin, utiliser le silence et l'ancrage, fixer son point de rupture avant l'entretien.",
      "Piloter son activité plutôt que ses résultats (objectifs SMART, ratios, rituels non négociables) et installer des habitudes gagnantes durables.",
      "Repérer les signaux de burnout et protéger son énergie pour tenir la performance dans la durée."
    ],
    "agenda": [
      {
        "titre": "Accueil & brise-glace « Simple au triple » : lancer le groupe sur l'idée que le mental sépare les meilleurs",
        "duree": "10 min"
      },
      {
        "titre": "Apport 1 — État d'esprit gagnant : 3 piliers, locus interne, mentalité de croissance (« pas encore »)",
        "duree": "15 min"
      },
      {
        "titre": "Jeu 1 — Quiz-battle en équipes sur les lois et méthodes du module",
        "duree": "15 min"
      },
      {
        "titre": "Apport 2 — Encaisser le refus et garder la main : valeur du « non », silence, ancrage, point de rupture",
        "duree": "15 min"
      },
      {
        "titre": "Jeu 2 — Vrai/Faux debout « Mental ou mythe ? » (idées reçues du métier)",
        "duree": "10 min"
      },
      {
        "titre": "Jeu de rôle — Négociation d'honoraires téléphonique / présentielle avec observateurs",
        "duree": "20 min"
      },
      {
        "titre": "Jeu 3 — Défi chrono « Ma valeur du non » + atelier ratios personnels",
        "duree": "10 min"
      },
      {
        "titre": "Apport 3 — Routines, discipline, habitudes (1 %, 66 jours, ne jamais manquer deux fois)",
        "duree": "10 min"
      },
      {
        "titre": "Synthèse — Points-clés & plan d'action individuel (engagements pour demain matin)",
        "duree": "10 min"
      }
    ],
    "briseGlace": {
      "titre": "« Du simple au triple » — ce qui se joue dans la tête",
      "consignes": [
        "En ouverture, posez la situation au groupe : « Deux négociateurs de cette agence ont le même secteur, le même fichier, les mêmes outils. L'un fait trois fois le chiffre de l'autre. Où se joue la différence ? »",
        "Faites un tour de table express (1 phrase par personne, 20 secondes max) : chacun donne LE mot ou LA qualité mentale qui, selon lui, fait la différence (confiance, régularité, encaisser le non, discipline…).",
        "Notez tous les mots au paperboard sans commenter. Reliez-les ensuite aux grands thèmes de la séance (état d'esprit, refus, stress, négociation, habitudes) : « Tout ce que vous venez de citer, c'est exactement le programme d'aujourd'hui. »",
        "Variante énergisante : demandez à chacun de se positionner physiquement sur une ligne imaginaire au sol entre « Ma réussite dépend surtout de moi » (locus interne) et « Elle dépend surtout du marché et des taux » (locus externe), puis questionnez 2-3 personnes sur leur place."
      ]
    },
    "jeux": [
      {
        "titre": "Quiz-battle « Les lois du mental »",
        "type": "Quiz-battle en équipes",
        "duree": "15 min",
        "consignes": [
          "Constituez 2 ou 3 équipes et demandez à chacune de se choisir un nom de code (ex. « les Locus Internes », « SW-SW-SW-N »).",
          "Posez les questions une à une à l'oral (issues du quiz du module). Chaque équipe écrit sa réponse sur une ardoise ou une feuille et la lève à votre « top », pour éviter que la plus rapide monopolise.",
          "1 point par bonne réponse. Après chaque question, l'équipe qui a bon explique POURQUOI en une phrase : c'est l'explication qui ancre, pas juste le point.",
          "Gardez les 2 dernières questions pour un « money time » à double points afin de maintenir le suspense jusqu'au bout.",
          "Proclamez l'équipe gagnante et remettez un petit trophée symbolique (le droit de choisir la musique du prochain brief, par ex.)."
        ],
        "animation": [
          "Rythmez : 20-25 secondes par question, chrono visible. L'énergie du jeu vient de la cadence.",
          "Ne validez jamais une bonne réponse sans faire reformuler le principe par l'équipe : l'objectif est pédagogique, pas compétitif.",
          "Piochez en priorité les questions à fort impact métier : loi de Pareto, objectifs d'activité, valeur du non, silence après l'annonce d'honoraires, 66 jours."
        ],
        "corrige": [
          "Résultats en baisse → le top performer AUGMENTE son activité (la vente est un jeu de nombres).",
          "Un « non » = une étape statistique qui rapproche du oui (règle SW-SW-SW-N), jamais un échec personnel.",
          "On pilote les objectifs d'ACTIVITÉ (contacts, estimations), pas les objectifs de résultat qu'on ne contrôle pas.",
          "Quadrant des top performers dans la matrice d'Eisenhower = Important mais NON urgent (à planifier : prospection, formation).",
          "Après avoir annoncé ses honoraires : SE TAIRE et laisser l'autre réagir (celui qui parle le premier concède).",
          "Ancrer une habitude = environ 66 jours (et non 21) ; tenir bon les deux premiers mois.",
          "Pareto : 80 % des résultats viennent de 20 % des actions (prospection, prise de mandat, relances acquéreurs).",
          "Parkinson : le travail s'étale jusqu'à occuper tout le temps disponible → délais courts et fermes.",
          "SMART, le T = Temporel (daté). Mentalité de croissance = ajouter « pas encore ». Règle d'or des habitudes = ne jamais manquer deux fois de suite."
        ]
      },
      {
        "titre": "Vrai / Faux debout « Mental ou mythe ? »",
        "type": "Vrai/Faux dynamique",
        "duree": "10 min",
        "consignes": [
          "Tout le monde se lève. Désignez un côté de la salle « VRAI » et l'autre « FAUX ».",
          "Énoncez une affirmation : les participants se déplacent physiquement du côté qu'ils pensent correct. On ne reste pas assis, on s'engage avec le corps.",
          "Avant de donner la réponse, interrogez 1 personne de chaque camp : « Pourquoi es-tu de ce côté ? » Cela fait débattre et révèle les croyances du groupe.",
          "Donnez la bonne réponse, l'explication, et enchaînez. 6 à 8 affirmations suffisent."
        ],
        "animation": [
          "L'intérêt est de faire sortir les idées reçues du métier (« prendre un non personnellement », « travailler plus d'heures = plus de résultats »). Laissez le débat vivre 20-30 secondes avant de trancher.",
          "Félicitez ceux qui changent d'avis en cours de route : c'est exactement la mentalité de croissance.",
          "Reliez chaque réponse à une situation concrète de l'agence pour ancrer."
        ],
        "corrige": [
          "« Un non en prospection est un échec personnel » → FAUX : on rejette une proposition à un instant, pas la personne ; c'est une étape statistique.",
          "« Travailler 12h par jour en continu garantit plus de résultats » → FAUX : à moyen terme c'est l'inverse, cela mène au burnout.",
          "« Il faut attendre d'être motivé pour agir » → FAUX : c'est l'action qui crée la motivation, pas l'inverse.",
          "« Baisser le volume d'appels après une série de non est le bon réflexe » → FAUX : il faut l'augmenter.",
          "« Le silence après l'annonce des honoraires est une faute » → FAUX : c'est un outil, celui qui parle le premier concède.",
          "« On ancre une habitude en 21 jours » → FAUX : en moyenne 66 jours (étude Lally, 2009).",
          "« Le trac avant un RDV est forcément nuisible » → FAUX : le stress aigu bref est sain, il mobilise ; c'est de l'énergie à rediriger.",
          "« Un non est souvent définitif » → FAUX : beaucoup de non sont des « pas maintenant » datés, à replacer en relance."
        ]
      },
      {
        "titre": "Défi chrono « Ma valeur du non » + mes ratios",
        "type": "Défi chrono / atelier chiffré",
        "duree": "10 min",
        "consignes": [
          "Chaque négociateur prend 3 minutes, chrono lancé, pour calculer SA propre valeur du contact : honoraires moyens d'un mandat vendu ÷ nombre de contacts nécessaires pour un mandat = valeur d'un contact (donc aussi d'un « non »).",
          "Exemple affiché au paperboard : 5 000 € d'honoraires, 1 mandat tous les 10 contacts → chaque contact (oui comme non) vaut 500 €.",
          "Chacun écrit le chiffre obtenu en GROS sur une feuille et l'affiche. Tour de salle rapide : « Mon non vaut … € ».",
          "Deuxième manche (3 min) : chacun note ses 3 ratios-clés (contacts → RDV, RDV → mandat, mandat → vente) à partir de son suivi d'activité, ou une estimation s'il ne les connaît pas encore.",
          "Clôturez : « À partir de maintenant, un refus n'est plus une claque, c'est un acompte encaissé sur votre prochain mandat. »"
        ],
        "animation": [
          "Ayez une calculatrice de secours et un exemple pré-rempli au tableau pour ceux qui bloquent.",
          "Pour ceux qui ne connaissent pas leurs ratios : c'est le signal qu'il faut activer le suivi d'activité de l'application — notez-le comme action.",
          "Insistez sur l'effet mental : chiffrer le non le transforme en donnée neutre, on arrête de le subir."
        ],
        "corrige": [
          "Formule : valeur d'un contact = honoraires moyens par vente × (ventes ÷ contacts). Repère métier : autour de 400 à 600 € le contact est fréquent.",
          "On ne juge jamais sa performance sur une matinée (résultats erratiques sur petit nombre) mais sur plusieurs centaines de contacts (loi des grands nombres).",
          "Connaître ses ratios transforme un objectif de ventes en nombre d'appels à passer : le flou disparaît."
        ]
      },
      {
        "titre": "Photolangage « Mon mental en ce moment »",
        "type": "Photolangage / brainstorm",
        "duree": "10 min",
        "consignes": [
          "Étalez sur la table une quinzaine d'images variées imprimées (une tempête, un sommet de montagne, un marathon, un funambule, une batterie déchargée, une mer calme, un ressort, un phare…).",
          "Chacun choisit en silence l'image qui représente le mieux son état mental actuel dans le métier.",
          "Tour de table : chacun montre son image et explique en 30 secondes pourquoi. Aucun jugement, aucune réaction du groupe, juste de l'écoute.",
          "Notez discrètement les thèmes qui reviennent (fatigue, pression du variable, perte de motivation, besoin de régularité…) : ils orienteront vos apports et le suivi managérial.",
          "Reliez les états exprimés aux outils de la séance : à une « batterie déchargée » répond l'hygiène de vie et la prévention du burnout ; à une « tempête » la méthode STOP et la cohérence cardiaque."
        ],
        "animation": [
          "Donnez l'exemple en premier en choisissant votre propre image : cela libère la parole et montre que le manager est aussi concerné.",
          "Posez un cadre de confidentialité clair : ce qui se dit ici reste ici. C'est ce qui permet l'authenticité.",
          "Ne cherchez pas à régler les problèmes pendant l'exercice : accueillez, reformulez, et renvoyez vers les outils ou vers un point individuel ultérieur."
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "La négociation d'honoraires qui déstabilise",
        "contexte": "RDV de prise de mandat à Martigues. Le vendeur annonce d'emblée : « L'agence d'à côté me prend 3 %, vous êtes à 5 %. Alignez-vous ou je signe ailleurs. » Le bien est correctement estimé et il y a des acquéreurs potentiels en fichier.",
        "roleA": "Le négociateur : doit tenir sa posture de non-besoin, utiliser le silence après l'annonce de ses honoraires, justifier sa valeur par les faits (délai de vente, acquéreurs déjà en portefeuille, accompagnement), et ne concéder, s'il le fait, qu'en échange de quelque chose (ex. exclusivité).",
        "roleB": "Le vendeur : joue la pression, la comparaison avec le concurrent et une légère impatience, sans être caricatural. Il cède si le négociateur reste calme, factuel et ne se justifie pas de façon défensive.",
        "objectif": "S'entraîner à garder le contrôle émotionnel et la posture de non-besoin face à une attaque sur le prix, et à utiliser le silence et l'ancrage plutôt que de brader dans la seconde.",
        "debrief": [
          "Le négociateur a-t-il marqué un silence après avoir annoncé/maintenu ses honoraires, ou s'est-il justifié aussitôt ?",
          "A-t-il ramené l'échange aux faits et à la valeur (délai, acquéreurs, résultat) plutôt qu'à une guerre de pourcentages ?",
          "Quand il a concédé, l'a-t-il fait gratuitement ou en échange (exclusivité, exclusivité de durée) ?",
          "Comment a-t-il vécu la pression ? Quel signal corporel l'a trahi (débit qui s'accélère, posture qui se referme) ?",
          "Les observateurs : qu'est-ce qu'ils retiennent de transposable dès demain dans leurs propres RDV de mandat ?"
        ]
      },
      {
        "titre": "Encaisser le refus au téléphone en pige",
        "contexte": "Séance de pige téléphonique. Le négociateur appelle un propriétaire qui vend seul. Le propriétaire est sec : « Pas d'agence, je me débrouille, au revoir. » C'est le 8e refus de la matinée.",
        "roleA": "Le négociateur : doit appliquer la règle SW-SW-SW-N (ne pas ruminer, enchaîner), garder un ton souriant et debout, tenter de dissocier le refus de lui-même, et surtout garder la porte ouverte (« Je comprends, je vous rappelle dans deux mois pour faire le point ? ») plutôt que de rayer le contact.",
        "roleB": "Le propriétaire : refuse fermement mais n'est pas agressif ; c'est en réalité un « pas maintenant » (il veut d'abord essayer seul). Il accepte un rappel ultérieur si le négociateur reste courtois et sans pression.",
        "objectif": "Travailler le réflexe mental face au non : ne pas le prendre personnellement, enchaîner immédiatement, et transformer un refus en relance programmée au lieu d'une porte définitivement fermée.",
        "debrief": [
          "Le négociateur a-t-il pris le non personnellement (ton qui change, découragement audible) ou l'a-t-il traité comme une donnée ?",
          "A-t-il tenté de garder la porte ouverte avec une proposition de rappel datée ?",
          "Comment s'est-il remis dans l'énergie pour l'appel suivant ? A-t-il rappelé mentalement une phrase d'ancrage (« je contrôle mon effort, pas sa réponse ») ?",
          "Qu'est-ce qui, dans sa voix et sa posture (debout, sourire), a changé la qualité de l'échange ?"
        ]
      }
    ],
    "pointsCles": [
      "À compétences égales, c'est le mental qui sépare les meilleurs des moyens : la différence se joue dans la tête, pas dans le marché.",
      "Locus interne : concentrer son énergie sur ce qu'on maîtrise (actions, préparation, attitude) et lâcher prise sur le reste (taux, conjoncture, décision du client).",
      "Mentalité de croissance : ajouter « pas encore » à chaque limite ; l'échec est une information, pas un verdict.",
      "Un « non » n'est ni un échec ni personnel : c'est une étape statistique qui a une valeur monétaire et rapproche du prochain oui (SW-SW-SW-N).",
      "On pilote l'activité, pas le résultat : objectifs SMART, ratios connus, rituels non négociables (bloc prospection matinal, revue hebdo).",
      "80/20 (Pareto) : protéger les 20 % d'actions à forte valeur (prospection, prise de mandat, relances) ; time-blocking et 3 MIT avant les mails.",
      "La confiance se prépare : méthode CAP (Corps, Ancrage, Projection), objections répétées à l'avance, sourire et posture debout au téléphone.",
      "Garder la main en négociation : posture de non-besoin, point de rupture fixé à froid, pouvoir du silence, ancrage, concessions échangées jamais offertes.",
      "Réguler le stress, pas le supprimer : cohérence cardiaque 3-6-5 et méthode STOP ; ne jamais répondre à chaud à un message agressif.",
      "La performance tient aux systèmes : 1 % mieux chaque jour, environ 66 jours pour ancrer une habitude, ne jamais manquer deux fois de suite, et protéger son énergie pour éviter le burnout."
    ],
    "planAction": [
      "Dès demain 9h : instaurer un bloc prospection sacré 9h-11h, téléphone en mode avion et mails fermés, debout pour appeler.",
      "Écrire et afficher ses 3 objectifs d'activité quotidiens (ex. 20 contacts, suivis dans le suivi d'activité de l'app) et les relire chaque matin.",
      "Calculer et noter sa valeur du contact (« mon non vaut X € ») et la garder en vue pour encaisser les refus comme des acomptes.",
      "Appliquer la méthode CAP (2 min de posture haute + ancrage + visualisation) avant chaque RDV de mandat, dans la voiture, au lieu de consulter ses mails.",
      "Après l'annonce de ses honoraires : se taire et compter jusqu'à laisser l'autre réagir — tester le silence sur le prochain RDV.",
      "Choisir UNE seule nouvelle habitude à installer (ex. empiler 10 appels après le café de 9h), cocher chaque jour et s'engager à ne jamais manquer deux fois de suite pendant 66 jours."
    ],
    "notesFormateur": [
      "Alternez systématiquement apport court (10-15 min max) et activité : sur un thème « mental », le présentiel vaut par le vécu et le jeu, pas par le discours descendant.",
      "Montrez l'exemple en vous exposant le premier (votre image au photolangage, un de vos propres « non » marquants, un ratio réel) : l'authenticité du manager autorise celle de l'équipe.",
      "Tenez le temps avec un chrono visible et annoncez les durées : c'est cohérent avec le contenu (lois de Parkinson et Pomodoro) et crédibilise la séance.",
      "Faites participer tout le monde : utilisez les déplacements physiques (ligne locus, Vrai/Faux debout) pour que personne ne reste spectateur, et interrogez nommément les plus discrets avec bienveillance.",
      "Ancrez par la reformulation : après chaque jeu, faites dire au groupe « ce que je retiens pour demain » plutôt que de conclure vous-même ; une idée formulée par le participant est retenue.",
      "Posez un cadre de confidentialité sur les parties émotionnelles (photolangage, stress, burnout) et prévoyez un point individuel de suivi pour les signaux de fatigue chronique repérés — ne traitez pas le cas personnel en groupe."
    ]
  },
  "marketing-bien": {
    "id": "marketing-bien",
    "sousTitre": "Transformer chaque mandat en coup de cœur : home-staging, photo et diffusion qui font vendre vite, bien et au bon prix",
    "objectifs": [
      "Maîtriser la logique du plan marketing d'un bien (entonnoir Attirer-Séduire-Convertir, AIDA, capital nouveauté des 15 premiers jours) et savoir le présenter comme argument de prise de mandat exclusif.",
      "Être capable de préparer un bien par le home-staging (désencombrer, dépersonnaliser, réparer, neutraliser) et de convaincre un vendeur réticent avec le bon script.",
      "Savoir produire des visuels qui vendent : photo de couverture, lumière naturelle, cadrage, 15 à 25 photos en format paysage, et connaître les apports et limites de la vidéo, du 360° et du drone.",
      "Rédiger une annonce qui convertit, avec un titre orienté bénéfice et une structure gagnante, dans le respect strict des mentions légales 2024-2026.",
      "Maîtriser la conformité de la communication immobilière (loi Hoguet, honoraires TTC, DPE/GES, loi ALUR, RGPD) et identifier la ligne rouge de la pratique commerciale trompeuse.",
      "Être capable d'orchestrer un lancement commercial (teasing, fichier, portes ouvertes) et de piloter la performance par les KPIs pour tenir un bilan vendeur argumenté."
    ],
    "agenda": [
      {
        "titre": "Accueil, cadre de la séance et objectifs - puis brise-glace \"Mon dernier coup de cœur\"",
        "duree": "10 min"
      },
      {
        "titre": "Apport 1 - Le plan marketing : entonnoir, AIDA, capital nouveauté et argument de mandat exclusif",
        "duree": "15 min"
      },
      {
        "titre": "Jeu 1 - Photolangage \"Clic ou pas clic ?\" (analyse de photos de couverture)",
        "duree": "15 min"
      },
      {
        "titre": "Apport 2 - Home-staging et photo qui vend (règles d'or, check-list avant déclenchement)",
        "duree": "15 min"
      },
      {
        "titre": "Jeu 2 - Défi chrono \"Home-staging express\" en équipes",
        "duree": "12 min"
      },
      {
        "titre": "Apport 3 - Annonce, conformité légale et diffusion",
        "duree": "15 min"
      },
      {
        "titre": "Jeu 3 - Vrai/Faux juridique \"La ligne rouge\" + Jeu 4 - Quiz-battle en équipes",
        "duree": "18 min"
      },
      {
        "titre": "Mise en situation - Jeu de rôle \"Vendre le home-staging\" / \"Teasing au fichier\"",
        "duree": "15 min"
      },
      {
        "titre": "Synthèse des points-clés, plan d'action individuel et clôture",
        "duree": "10 min"
      }
    ],
    "briseGlace": {
      "titre": "Mon dernier coup de cœur (et pourquoi j'ai cliqué)",
      "consignes": [
        "Demandez à chaque participant de sortir son smartphone et d'ouvrir Leboncoin ou SeLoger sur une recherche immobilière à Martigues ou alentour (90 secondes de navigation libre).",
        "Chacun choisit UNE annonce sur laquelle il a eu envie de cliquer, et UNE qu'il a scrollée sans s'arrêter.",
        "Tour de table minuté (45 secondes par personne) : \"J'ai cliqué sur celle-ci à cause de..., et j'ai ignoré celle-là parce que...\"",
        "Le formateur note au paperboard les mots qui reviennent (lumière, vue, terrasse, prix, première photo, titre).",
        "Rebond du formateur : \"Vous venez de vivre, en tant qu'acheteurs, exactement ce que vivent VOS acquéreurs. Le clic se joue en une seconde. C'est tout l'enjeu de la séance.\""
      ]
    },
    "jeux": [
      {
        "titre": "Photolangage \"Clic ou pas clic ?\"",
        "type": "Photolangage / analyse visuelle en groupe",
        "duree": "15 min",
        "consignes": [
          "Préparez en amont 6 à 8 photos de couverture projetées au PowerPoint : des vraies photos de biens (idéalement du secteur de l'agence, anonymisées) mêlant réussites et ratés classiques - salon sombre shooté le soir, photo penchée, format portrait recadré, reflet du photographe dans le miroir, cuvette de WC ouverte, mais aussi une belle couverture lumineuse sur une vue ou une terrasse dressée.",
          "Pour chaque photo, affichez-la 10 secondes puis demandez au groupe de voter à main levée : \"Clic ou pas clic ?\"",
          "Après le vote, un volontaire argumente : qu'est-ce qui marche ou ne marche pas ?",
          "Le formateur révèle le ou les défauts techniques et rattache chacun à une règle du module (lumière naturelle, format paysage, hauteur de prise de vue 1,50 m, verticales droites, ouvrir sur l'atout fort jamais sur une pièce technique).",
          "Terminez sur la meilleure et la pire : \"Même bien, même prix - seule la mise en image a changé.\""
        ],
        "animation": [
          "Imposez le vote AVANT tout commentaire : on veut la réaction instinctive d'un acheteur sur smartphone, pas l'analyse d'un pro.",
          "Valorisez les désaccords : ils révèlent que le ressenti visuel est subjectif, d'où l'importance des règles objectives.",
          "Gardez le rythme : 10 secondes d'affichage maximum, comme sur un vrai fil de portail."
        ],
        "corrige": [
          "Photo gagnante : lumière naturelle de jour, volets ouverts, format paysage, prise de vue à hauteur de poitrine, verticales droites, ouverture sur l'atout le plus fort (vue, terrasse, plus belle pièce).",
          "Défauts rédhibitoires : contre-jour / photo du soir (salon sombre), format portrait (recadré et amputé par le portail), appareil penché (verticales non droites, aspect amateur), reflet du photographe, cuvette de WC ouverte / serviette qui traîne / gamelle visible, couverture posée sur une pièce technique (salle de bains, garage).",
          "Règle à ancrer : 90 % des recherches commencent en ligne, la première photo décide du clic ; 15 à 25 photos nettes valent mieux que 50 médiocres."
        ]
      },
      {
        "titre": "Défi chrono \"Home-staging express\"",
        "type": "Défi chrono en équipes",
        "duree": "12 min",
        "consignes": [
          "Projetez la photo d'une pièce encombrée et mal présentée (séjour ou cuisine surchargée, objets personnels partout, câbles apparents, mur de couleur criarde).",
          "Divisez le groupe en 2 ou 3 équipes. Chrono de 4 minutes : chaque équipe liste sur une feuille le MAXIMUM d'actions de home-staging concrètes à mener sur cette pièce avant le shooting.",
          "À l'issue du chrono, chaque équipe lit sa liste à tour de rôle ; une action déjà citée par une autre équipe ne compte pas (on ne répète pas).",
          "1 point par action pertinente et non redondante ; l'équipe avec le plus de points gagne.",
          "Le formateur complète avec les actions oubliées et rattache aux 5 règles d'or (désencombrer/dépersonnaliser, réparer les petits défauts, nettoyer/désodoriser/éclairer, neutraliser, désaturer les volumes)."
        ],
        "animation": [
          "Chronométrez visiblement (timer projeté) : la pression du temps libère les idées et dynamise.",
          "Interdisez les téléphones pendant le chrono : on veut la connaissance du groupe, pas une recherche Google.",
          "Si une équipe propose une action limite (effacer un défaut sur la photo), saisissez-la pour amener la ligne rouge : home-staging oui, tromperie non."
        ],
        "corrige": [
          "Désencombrer 30 à 50 % des bibelots, retirer photos de famille, aimants de frigo, objets religieux ou politiques.",
          "Réparer les petits défauts (poignée cassée, joint noirci, ampoule grillée) qui donnent une impression de négligence.",
          "Plans de travail et tables vidés, câbles rangés, poubelle et gamelles hors champ.",
          "Nettoyer, désodoriser (tabac, animal, friture), éclairer : toutes ampoules fonctionnelles et de même température de couleur.",
          "Neutraliser un mur trop marqué (rouge/violet fait fuir), ambiance chaleureuse mais consensuelle.",
          "Désaturer les volumes : un meuble sur deux dans une pièce surchargée pour dégager les circulations.",
          "Créer un point focal dans le séjour (canapé face à la vue ou à la cheminée).",
          "À ne JAMAIS faire : effacer un défaut permanent ou meubler virtuellement sans la mention \"image non contractuelle\"."
        ]
      },
      {
        "titre": "Vrai/Faux juridique \"La ligne rouge\"",
        "type": "Vrai/Faux",
        "duree": "8 min",
        "consignes": [
          "Distribuez à chacun deux cartons (VRAI / FAUX) ou faites lever le pouce haut/bas.",
          "Le formateur lit une affirmation ; au top, tout le monde répond simultanément.",
          "Après chaque vote, le formateur donne la réponse et la justification légale en une phrase.",
          "Enchaînez les 8 affirmations à un rythme soutenu."
        ],
        "animation": [
          "Imposez le vote simultané pour éviter le mimétisme ; personne ne se cache derrière le voisin.",
          "Insistez sur les sanctions réelles (jusqu'à 2 ans de prison et 300 000 € d'amende) pour marquer les esprits sur la pratique trompeuse.",
          "Reliez chaque point à un réflexe terrain : \"Avant de publier, je vérifie DPE, GES, honoraires, mandat.\""
        ],
        "corrige": [
          "\"Je peux diffuser une annonce dès l'accord verbal du vendeur\" - FAUX : la loi Hoguet (loi n°70-9 du 2 janvier 1970) exige un mandat écrit autorisant expressément la publicité.",
          "\"L'étiquette DPE suffit, le GES est facultatif\" - FAUX : DPE ET GES sont obligatoires, plus l'estimation des coûts annuels d'énergie (loi Climat et Résilience, depuis 2022).",
          "\"Pour un logement classé F ou G, la mention 'consommation énergétique excessive' est obligatoire\" - VRAI.",
          "\"Je peux éclaircir une photo trop sombre et redresser les perspectives\" - VRAI : retouche cosmétique autorisée (luminosité, perspectives, netteté, ciel).",
          "\"Je peux effacer numériquement un pylône gênant à côté de la maison\" - FAUX : effacer un défaut permanent est une pratique commerciale trompeuse (articles L.121-2 et L.121-3 du Code de la consommation).",
          "\"Le home-staging virtuel est interdit\" - FAUX : il est légal mais doit porter la mention \"image non contractuelle / home-staging virtuel\" et ne jamais masquer un défaut permanent.",
          "\"Les honoraires s'affichent TTC avec l'indication de qui les paie\" - VRAI (arrêté du 10 janvier 2017).",
          "\"Je peux donner l'adresse exacte du bien pour rassurer les acheteurs\" - FAUX : jamais d'adresse exacte (protection du vendeur, démarchage, visites sauvages, sécurité)."
        ]
      },
      {
        "titre": "Quiz-battle \"Les pros du marketing du bien\"",
        "type": "Quiz-battle en équipes",
        "duree": "10 min",
        "consignes": [
          "Formez 2 ou 3 équipes et laissez-les se trouver un nom d'agence fictive.",
          "Posez 10 questions (adaptées du quiz du module) à l'oral ou au PowerPoint. Chaque équipe écrit sa réponse sur une ardoise ou un papier et la révèle au top, pas de réponse criée.",
          "1 point par bonne réponse ; bonus d'1 point si l'équipe cite correctement la règle ou le texte de loi associé.",
          "Le formateur commente chaque réponse à l'aide de l'explication, puis tient le score au paperboard.",
          "L'équipe gagnante est désignée \"Référente marketing de la semaine\"."
        ],
        "animation": [
          "Alternez questions faciles et pièges pour maintenir le suspense et laisser une chance à chaque équipe.",
          "Utilisez les mauvaises réponses comme matière pédagogique, sans jamais stigmatiser.",
          "Gardez de l'énergie : un quiz-battle doit être un moment de jeu, tenez un rythme vif et annoncez le score à voix haute."
        ],
        "corrige": [
          "Le home-staging sert à déclencher le coup de cœur et la projection de l'acheteur (pas à masquer un vice).",
          "La photo de couverture = la plus belle pièce ou la façade la plus flatteuse, jamais une pièce technique.",
          "Photo réussie = lumière naturelle, volets ouverts, de jour, sans contre-jour, format paysage, hauteur 1,50 m.",
          "Drone : exploitant enregistré sur AlphaTango (même sous 250 g avec caméra), altitude 120 m maxi, pas de survol de personnes, télépilote déclaré et assuré.",
          "En exclusivité, on présente d'abord le bien à ses acquéreurs qualifiés du fichier (teasing / off-market).",
          "Beaucoup de vues, peu de contacts = prix perçu trop élevé au regard des photos, ou annonce peu engageante.",
          "Honoraires à charge acquéreur : afficher prix honoraires inclus + % ou montant TTC + prix net vendeur (arrêté du 10/01/2017).",
          "Capital nouveauté = les 15 premiers jours ; home-staging léger = 1 à 3 % du prix ; 15 à 25 photos en format paysage.",
          "Beaucoup de visites mais aucune offre = problème de prix réel ou d'état perçu, réajustement à documenter.",
          "Pas de vues = problème d'emballage (titre, photo de couverture, diffusion) : on relance, boost, nouvelle accroche."
        ]
      },
      {
        "titre": "Brainstorm \"Le plan marketing d'exclu en 2 minutes\"",
        "type": "Brainstorm / co-construction",
        "duree": "10 min",
        "consignes": [
          "Annoncez le contexte : \"Vous êtes en rendez-vous de mandat pour une maison de pêcheur dans le quartier de l'Île à Martigues. Le vendeur hésite entre vous et deux confrères et trouve vos honoraires chers.\"",
          "En plénière ou en binômes, le groupe liste au paperboard tout ce que contiendrait un plan marketing ECRIT remis au vendeur, calé sur un calendrier (J+2, J+4, J+5, J+7, J+14...).",
          "Le formateur structure les idées sur une ligne de temps : préparation/home-staging, shooting photo et vidéo, teasing au fichier, mise en ligne multiportails, portes ouvertes, premier bilan.",
          "Concluez : \"Ce plan écrit justifie vos honoraires et fait la différence face au confrère - il transforme une dépense en investissement sur le prix de vente.\""
        ],
        "animation": [
          "Relancez par le \"pourquoi\" : pourquoi l'exclusivité permet-elle d'investir (photographe, drone, diffusion payante) ?",
          "Faites le lien avec le capital nouveauté : on ne lance jamais tant que le bien n'est pas prêt à être photographié au meilleur niveau.",
          "Notez tout sans filtrer d'abord, puis ordonnez : la ligne de temps donne un livrable réutilisable dès le lendemain."
        ],
        "corrige": [
          "Plan type : préparation du bien en J+2, shooting en J+4, teasing au fichier en J+5, mise en ligne multiportails en J+7, premier bilan vendeur en J+14.",
          "L'exclusivité justifie d'investir et permet un lancement maîtrisé ; la multidiffusion sauvage dévalorise le bien (prix et photos incohérents = bien jugé \"invendable\")."
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "\"Vendre le home-staging à un vendeur réticent\"",
        "contexte": "Monsieur Martin possède un T3 à Martigues, occupé, qu'il juge \"très bien comme il est\". Il est fumeur, la déco est datée, les murs jaunis, les bibelots et photos de famille partout. Il refuse de \"tout chambouler\" et redoute une dépense inutile. Le négociateur doit obtenir son accord pour préparer le bien avant le shooting.",
        "roleA": "Le négociateur CENTURY 21 : il doit expliquer l'intérêt du home-staging, rassurer (on dé-décore, on ne juge pas les goûts), chiffrer le retour sur investissement et obtenir un engagement concret (désencombrement, grand ménage/désodorisation, peinture blanche, rangement le jour des visites).",
        "roleB": "Monsieur Martin, vendeur attaché à son intérieur, sensible aux arguments économiques mais vexé par toute critique de ses goûts ; il lâche prise si on le respecte et si on lui parle chiffres et délais.",
        "objectif": "S'entraîner au script de persuasion : \"L'acheteur décide en moins de 90 secondes. Pour quelques centaines d'euros et un week-end de rangement, on gagne des milliers d'euros et plusieurs semaines. On ne dépense pas, on investit sur votre prix.\" Et savoir désamorcer la résistance : \"Gardez vos meubles préférés, juste présenter le bien sous son meilleur jour le jour des photos et des visites.\"",
        "debrief": [
          "Le négociateur a-t-il parlé investissement (et non dépense) et chiffré le retour (1 à 3 % du prix, délais raccourcis, moins de négociation) ?",
          "A-t-il respecté le vendeur (dé-décoration, pas de jugement des goûts) sans se laisser déstabiliser par la susceptibilité ?",
          "A-t-il obtenu un engagement CONCRET et daté (quoi, qui, quand), ou s'est-il arrêté à l'accord de principe ?",
          "Rappel du mini cas : peinture ~600 €, ménage/désodo ~250 €, désencombrement gratuit = 5 visites la première semaine contre 0 en deux mois, offre à -2 % au lieu de -8 %."
        ]
      },
      {
        "titre": "\"Le teasing au fichier : l'appel off-market\"",
        "contexte": "En exclusivité sur une maison avec jardin à Martigues, le bien n'est pas encore en ligne. Le négociateur active son fichier d'acquéreurs qualifiés. Il appelle Madame Robert, acquéreuse financée qui cherche exactement ce profil, pour lui proposer le bien en avant-première avant la diffusion publique.",
        "roleA": "Le négociateur : il doit créer le sentiment de rareté et de privilège, qualifier (financement, délai, réelle motivation), proposer une visite rapide et éventuellement l'inviter aux portes ouvertes, sans donner l'adresse exacte au téléphone.",
        "roleB": "Madame Robert, acquéreuse sérieuse mais prudente : elle a déjà \"raté\" des biens, veut des détails, teste la disponibilité du bien et le sérieux du conseiller.",
        "objectif": "Maîtriser l'appel de teasing / off-market : \"Madame Robert, j'ai LE bien que vous cherchiez. Il n'est pas encore en ligne, je vous le propose en avant-première.\" Montrer la puissance du fichier (rapprochement), privilégier l'appel au simple mail, et transformer l'appel en rendez-vous de visite.",
        "debrief": [
          "Le négociateur a-t-il appelé (et non seulement mailé) et créé l'effet de rareté / avant-première ?",
          "A-t-il qualifié l'acquéreur (financement, projet, délai) avant de s'engager sur une visite ?",
          "A-t-il protégé le vendeur (pas d'adresse exacte livrée brute au téléphone) et su conclure sur un créneau concret ?",
          "Lien avec le capital nouveauté et l'exclusivité : un bien vendu avant diffusion publique prouve la puissance du fichier et valorise l'exclusivité auprès du vendeur."
        ]
      }
    ],
    "pointsCles": [
      "Commercialiser, c'est dérouler un plan marketing pensé, daté et mesurable - pas \"mettre une annonce\". Objectif : vendre vite, bien et sécurisé.",
      "L'entonnoir Attirer-Séduire-Convertir et le modèle AIDA : la photo de couverture et le titre captent l'Attention en une seconde (90 % des recherches commencent en ligne).",
      "Le capital nouveauté se joue dans les 15 premiers jours et ne revient jamais : on ne lance JAMAIS un bien tant qu'il n'est pas prêt à être photographié au meilleur niveau.",
      "Home-staging = dé-décoration : désencombrer, dépersonnaliser, réparer, nettoyer/désodoriser/éclairer, neutraliser, désaturer les volumes. Budget 1 à 3 % du prix, retour en milliers d'euros et en délai.",
      "La photo qui vend : lumière naturelle de jour sans contre-jour, format paysage, hauteur 1,50 m, verticales droites, 15 à 25 photos nettes ; on ouvre sur l'atout fort, jamais sur une pièce technique.",
      "Vidéo, 360° et drone différencient l'annonce : le drone est strictement réglementé (exploitant enregistré sur AlphaTango même sous 250 g avec caméra, 120 m maxi, pas de survol de personnes) - on sous-traite à un télépilote déclaré et assuré.",
      "L'annonce qui convertit : titre orienté bénéfice, structure gagnante (accroche, parcours, atouts factuels, environnement, appel à l'action), ton court, positif, sincère, sans jamais l'adresse exacte.",
      "Conformité obligatoire : mandat écrit autorisant la publicité (loi Hoguet), honoraires TTC avec qui les paie (arrêté 10/01/2017), DPE + GES + coûts annuels d'énergie, mentions copropriété/loi ALUR, RGPD.",
      "La ligne rouge : la retouche cosmétique est permise, mais effacer un défaut permanent ou meubler virtuellement sans mention \"image non contractuelle\" est une pratique commerciale trompeuse (L.121-2 et s., jusqu'à 2 ans de prison et 300 000 € d'amende).",
      "On pilote par les chiffres : pas de vues = emballage/diffusion ; vues sans contacts = prix perçu ; visites sans offres = prix réel ou état. Bilan vendeur écrit chaque semaine, ajustement argumenté à J+7 et J+21."
    ],
    "planAction": [
      "Dès le prochain mandat, remettre au vendeur un plan marketing ECRIT et daté (préparation, shooting, teasing, mise en ligne, portes ouvertes, bilan) pour justifier mes honoraires et viser l'exclusivité.",
      "Avant chaque shooting, dérouler la check-list home-staging + photo : désencombrer, volets ouverts et toutes lumières de même teinte allumées, objectif propre, appareil de niveau, format paysage, 15 à 25 photos, couverture sur l'atout fort.",
      "Refaire une passe de conformité sur mes annonces en ligne cette semaine : mandat autorisant la publicité, honoraires TTC, étiquettes DPE et GES + coûts annuels d'énergie, mentions copropriété, aucune adresse exacte, aucune retouche trompeuse.",
      "Sur mon prochain lancement en exclusivité, activer le fichier acquéreurs par un teasing téléphonique (off-market) avant toute diffusion publique, et programmer une demi-journée de portes ouvertes qualifiées.",
      "Mettre en place un bilan vendeur hebdomadaire chiffré (vues, contacts, visites, offres) avec interprétation et recommandation, et planifier les points d'ajustement à J+7 et J+21.",
      "Produire au moins une vidéo verticale sous-titrée par beau bien pour les réseaux (Reel/Marketplace), avec appel à l'action clair, et répondre à tout message privé sous l'heure."
    ],
    "notesFormateur": [
      "Gérez le temps avec un timer visible : les jeux chronométrés (home-staging express, quiz-battle) tiennent le rythme, mais prévoyez un \"stop net\" pour ne pas déborder sur la synthèse, moment où les acquis s'ancrent.",
      "Faites participer tout le monde : alternez votes simultanés (Vrai/Faux, photolangage), travail en équipes et prise de parole individuelle ; interrogez nommément les plus discrets sur des questions accessibles.",
      "Ancrez les acquis par le concret : ramenez systématiquement chaque notion à un bien réel du secteur de Martigues et au \"dès demain je fais quoi ?\" plutôt qu'à la théorie.",
      "Utilisez les erreurs comme matière, jamais pour stigmatiser : une mauvaise réponse au quiz ou une photo ratée du groupe est la meilleure porte d'entrée vers la bonne pratique.",
      "Préparez votre matériel en amont : 6 à 8 photos de couverture (réussites + ratés) pour le photolangage, une photo de pièce encombrée pour le défi chrono, ardoises et cartons Vrai/Faux, paperboard pour les scores et la ligne de temps.",
      "Sur les points juridiques (drone/AlphaTango, honoraires, DPE/GES, pratique trompeuse), restez précis et factuel : c'est là que votre crédibilité de manager se joue et que les négociateurs retiennent les réflexes qui les protègent."
    ]
  },
  "investissement-locatif": {
    "id": "investissement-locatif",
    "sousTitre": "Parler le langage des chiffres pour transformer l'investisseur en client à vie",
    "objectifs": [
      "Être capable de qualifier un investisseur en identifiant sa motivation (rendement, patrimoine, défiscalisation, retraite, transmission), sa TMI et son horizon avant toute proposition de bien",
      "Maîtriser le calcul des 3 rendements (brut, net de charges, net-net) et du cash-flow pour chiffrer un bien en moins de 30 secondes devant le client",
      "Savoir distinguer les régimes fiscaux location nue (foncier, déficit) et meublée (LMNP/LMP, amortissement) et orienter vers le bon régime sans se substituer à l'expert-comptable",
      "Connaître les règles de financement HCSF 2024-2026 et les dispositifs fiscaux en vigueur (Denormandie, Loc'Avantages) comme ceux supprimés (Pinel, Censi-Bouvard) pour ne jamais vendre un dispositif périmé",
      "Être capable d'analyser un bien à l'investissement avec la grille ELECT et de détecter les pièges qui détruisent la rentabilité nette (DPE, PV d'AG, vacance)",
      "Savoir accompagner et fidéliser l'investisseur pour générer du chiffre d'affaires récurrent (gestion, revente, recommandation) tout en restant dans le cadre légal (mandat, LCB-FT, délais)"
    ],
    "agenda": [
      {
        "titre": "Accueil & brise-glace « Mon meilleur / pire investisseur »",
        "duree": "0h00 - 0h10 (10 min)"
      },
      {
        "titre": "Séquence 1 — Comprendre et qualifier l'investisseur (apport + jeu photolangage des 5 motivations)",
        "duree": "0h10 - 0h30 (20 min)"
      },
      {
        "titre": "Séquence 2 — Les chiffres qui font vendre : les 3 rendements & le cash-flow (apport + défi chrono calculette)",
        "duree": "0h30 - 0h55 (25 min)"
      },
      {
        "titre": "Séquence 3 — Fiscalité, financement & dispositifs (apport flash + quiz-battle en équipes)",
        "duree": "0h55 - 1h20 (25 min)"
      },
      {
        "titre": "Pause active",
        "duree": "1h20 - 1h30 (10 min)"
      },
      {
        "titre": "Séquence 4 — Mise en pratique : étude de cas Martigues + jeu de rôle découverte investisseur",
        "duree": "1h30 - 2h05 (35 min)"
      },
      {
        "titre": "Synthèse ELECT, points-clés & plan d'action terrain",
        "duree": "2h05 - 2h20 (15 min)"
      },
      {
        "titre": "Clôture & engagements individuels",
        "duree": "2h20 - 2h25 (5 min)"
      }
    ],
    "briseGlace": {
      "titre": "« Mon meilleur / mon pire dossier investisseur »",
      "consignes": [
        "Chaque négociateur dispose de 60 secondes pour raconter au groupe un souvenir : soit la plus belle vente faite à un investisseur, soit un dossier investisseur qui lui a filé entre les doigts (ou qu'il a loupé faute de savoir parler chiffres).",
        "Le formateur note au paperboard deux colonnes : « Ce qui a marché » / « Ce qui a coincé ». Objectif : faire émerger que l'investisseur achète un tableur, pas un coup de cœur.",
        "Celui qui n'a jamais vendu à un investisseur dit simplement ce qui l'intimide dans cette clientèle (le jargon, les chiffres, la fiscalité…).",
        "Le formateur conclut en 1 minute : « Aujourd'hui, on fait de l'investisseur votre meilleur client : il achète vite, revient tous les 2-3 ans et vous recommande. Encore faut-il parler son langage. »"
      ]
    },
    "jeux": [
      {
        "titre": "Photolangage « Qu'est-ce qui le fait acheter ? »",
        "type": "Photolangage / Brainstorm",
        "duree": "12 min",
        "consignes": [
          "Afficher au mur (ou projeter) 8 à 10 visuels variés : un tableur Excel, une plage de Martigues/vue mer, une feuille d'impôt, un couple de retraités, un arbre généalogique, une calculette, un immeuble du centre ancien, une famille avec enfants, un portefeuille d'actions, un chantier de rénovation.",
          "Chaque négociateur choisit en silence LA photo qui représente selon lui la motivation n°1 d'un investisseur, puis l'explique en 30 secondes.",
          "Le formateur regroupe les réponses pour reconstituer au tableau les 5 motivations : rendement/cash-flow, patrimoine/plus-value, défiscalisation, revenu de retraite, transmission.",
          "Débat flash : « Pourquoi est-il interdit de proposer un bien avant d'avoir identifié le MOTEUR ? » → parce qu'il oriente le bien, le régime fiscal ET le montage.",
          "Clôturer sur le script de découverte : s'autofinancer / patrimonial / réduire ses impôts."
        ],
        "animation": [
          "Imprimer les visuels en A5 la veille, ou créer une slide planche-contact ; prévoir un jeu par demi-groupe si l'équipe est nombreuse.",
          "Ne pas chercher LA bonne réponse : l'intérêt est la diversité des interprétations, qui prouve qu'un même bien parle à des motivations différentes.",
          "Rebondir sur le cas du chef de poste de Lavéra (TMI 41 %) pour ancrer : à une motivation « défisc », on ne répond jamais par un studio à 6 % brut."
        ],
        "corrige": [
          "Les 5 motivations à faire émerger : Rendement/cash-flow — Patrimoine/plus-value — Défiscalisation (TMI 30-45 %) — Revenu de retraite (horizon 15-20 ans) — Transmission (SCI, démembrement, donation de parts).",
          "Informations à recueillir d'emblée : TMI, capacité d'endettement et apport, horizon de détention et sortie, appétence à la gestion (gère seul ou délègue)."
        ]
      },
      {
        "titre": "Défi chrono « Le bon chiffre en 3 minutes » (T2 de Martigues)",
        "type": "Défi chrono / calcul en binômes",
        "duree": "15 min",
        "consignes": [
          "Distribuer la fiche du T2 : acheté 145 000 € frais de notaire inclus, loué 640 €/mois (7 680 €/an). Charges annuelles : taxe foncière 950 €, copro non récupérable 600 €, PNO 150 €, gestion 8 % (614 €), GLI 3 % (230 €), provision vacance/travaux 400 €.",
          "En binômes, calculette en main, 3 minutes chrono pour sortir : 1) le rendement brut, 2) le total des charges, 3) le rendement net de charges.",
          "Deuxième manche, 2 minutes : crédit sur 20 ans à 3,8 % → mensualité ≈ 865 €. Calculer le cash-flow mensuel et dire si le bien s'autofinance.",
          "Chaque binôme annonce ses résultats ; le formateur corrige au tableau et fait reformuler la différence brut / net / net-net.",
          "Conclure sur le mnémonique « Le BRUT ment, le NET informe, le NET-NET décide »."
        ],
        "animation": [
          "Imposer le chrono visible (téléphone au mur) : le but est de muscler le réflexe calcul rapide devant un client, pas la précision comptable absolue.",
          "Circuler pour repérer l'erreur classique : oublier les frais d'acquisition au dénominateur → rendement surévalué.",
          "Valoriser le binôme le plus rapide ET juste, puis insister : devant le client, on sort le brut en 30 s pour accrocher, mais on décide sur le net-net."
        ],
        "corrige": [
          "Rendement brut = 7 680 ÷ 145 000 × 100 = 5,3 %.",
          "Total charges ≈ 2 944 €/an.",
          "Rendement net de charges = (7 680 − 2 944) ÷ 145 000 = 3,3 %.",
          "Cash-flow mensuel = 640 € loyer − 865 € crédit − 245 € charges mensualisées = −470 €/mois → le bien NE s'autofinance PAS : c'est un investissement patrimonial, pas un placement à rendement immédiat.",
          "Leviers pour passer en cash-flow positif : négocier le prix, passer en meublé (+15 à 25 % de loyer), allonger la durée / optimiser le taux, changer de régime fiscal (LMNP au réel)."
        ]
      },
      {
        "titre": "Quiz-battle fiscalité & financement en équipes",
        "type": "Quiz-battle en équipes",
        "duree": "18 min",
        "consignes": [
          "Constituer 2 ou 3 équipes avec un nom (ex. « Les Amortisseurs », « Team Cash-flow »). Chaque équipe désigne un porte-parole qui lève une ardoise ou un carton A/B/C/D.",
          "Le formateur projette 12 questions tirées du quiz du module (une slide par question). 15 secondes de concertation à voix basse, puis l'ardoise se lève tous en même temps.",
          "1 point par bonne réponse, +1 point bonus si l'équipe justifie correctement. Le formateur lit l'explication après chaque question.",
          "Questions-pièges à inclure absolument : le Pinel supprimé depuis le 01/01/2025, le déficit foncier à 10 700 € (21 400 € rénovation énergétique), l'endettement HCSF à 35 % assurance comprise, l'abattement micro-BIC à 50 %, les 70 % de loyers retenus par la banque.",
          "Décompter les points au tableau en direct ; l'équipe gagnante choisit… le thème de la pause café."
        ],
        "animation": [
          "Rythme rapide, ambiance compétition bon enfant : le quiz-battle sert à ancrer les règles 2024-2026 sans cours magistral.",
          "Sur chaque question ratée, faire reformuler la règle par un membre d'une autre équipe plutôt que de la donner soi-même.",
          "Marteler les 3 pièges mortels du métier : ne JAMAIS proposer le Pinel ou le Censi-Bouvard (supprimés), ne pas confondre meublé (BIC/amortissement) et nu (foncier/déficit), ne pas laisser un investisseur avec travaux au micro-foncier."
        ],
        "corrige": [
          "Rendement brut = (loyer annuel ÷ prix frais inclus) × 100. Atout réel LMNP = l'amortissement du bien (hors terrain) et du mobilier. Cash-flow positif = loyers > crédit + charges + impôts.",
          "Déficit foncier (hors intérêts) : imputable sur le revenu global jusqu'à 10 700 €/an, porté à 21 400 € pour une sortie de passoire énergétique (dépenses 2023-2027), excédent reportable 10 ans. Les intérêts d'emprunt ne s'imputent QUE sur les revenus fonciers.",
          "Pinel : supprimé pour tout nouvel investissement depuis le 01/01/2025. Denormandie : court jusqu'au 31/12/2027. Censi-Bouvard : supprimé fin 2022.",
          "Micro-BIC meublé longue durée : abattement 50 %, plafond 77 700 €. Micro-foncier nu : 30 %, plafond 15 000 €. Meublé de tourisme non classé (loi Le Meur, revenus 2025) : 30 %, plafond 15 000 €.",
          "HCSF : endettement max 35 % assurance comprise, durée max 25 ans (27 ans avec différé neuf/gros travaux), banques retenant ≈ 70 % des loyers, dérogation sur 20 % des dossiers. Loi Scrivener : délai de réflexion de 10 jours sur l'offre de prêt.",
          "LMNP : statut par défaut tant que recettes ≤ 23 000 €/an OU inférieures aux autres revenus d'activité. Déclaration P0i sous 15 jours sur le guichet unique INPI pour le SIRET. Déficit foncier et amortissement LMNP = hors plafonnement global des niches à 10 000 €."
        ]
      },
      {
        "titre": "Étude de cas « Studio à 8 % brut : pépite ou piège ? »",
        "type": "Étude de cas en sous-groupes",
        "duree": "15 min",
        "consignes": [
          "Projeter l'annonce : studio affiché à 8 % de rendement brut, « idéal investisseur ». Distribuer à chaque sous-groupe un dossier contenant des pièges : PV d'AG mentionnant un ravalement voté à 9 000 €, DPE classé F, vacance locative élevée dans le secteur.",
          "Chaque sous-groupe applique la grille ELECT (Emplacement, Loyer de marché, État et travaux, Charges et copropriété, Tension locative) et liste les points au rouge.",
          "Chaque sous-groupe rend un verdict : on propose, on négocie, ou on écarte ? Et avec quel argumentaire face au client ?",
          "Restitution croisée : un rapporteur par sous-groupe, 2 minutes. Le formateur révèle que le net réel tombe sous 3 % : le brut mentait.",
          "Faire verbaliser l'usage du DPE F/G comme levier de négociation sur le prix et rappeler le calendrier d'interdiction (G interdit depuis 2025, F en 2028, E en 2034)."
        ],
        "animation": [
          "Préparer un vrai faux dossier (1 page de PV d'AG, une étiquette DPE, un relevé de charges) pour rendre l'exercice concret et crédible.",
          "Accepter plusieurs verdicts valables : l'essentiel est que la décision soit justifiée par ELECT, pas par l'intuition.",
          "Ancrer le message : l'analyse protège la crédibilité du négociateur ET le portefeuille du client ; un rendement sur le papier n'est jamais un rendement net réel."
        ],
        "corrige": [
          "Grille ELECT appliquée : E = emplacement/demande à vérifier (proximité transports, emploi, zones industrielles Lavéra) ; L = loyer de marché à confronter au prix au m² ; É = ravalement 9 000 € à provisionner + DPE F (gel du loyer depuis 2022, travaux avant 2028) ; C = fonds travaux ALUR, impayés de copro à vérifier dans les PV ; T = vacance élevée = au moins 1 mois/an à provisionner.",
          "Verdict attendu : net réel sous 3 %, loin des 8 % affichés → écarter OU négocier fortement le prix en s'appuyant sur le DPE F et le ravalement voté. « Le brut ment ».",
          "Opposabilité du DPE depuis 2021 : erreur = recours possible du locataire contre le bailleur."
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "Découverte investisseur : le chef de poste de Lavéra",
        "contexte": "Un cadre de la pétrochimie de Lavéra, TMI 41 %, déjà propriétaire de sa résidence principale, pousse la porte de l'agence et lance d'emblée : « Je veux défiscaliser, vous avez quoi ? ». Il a de l'apport et un bon dossier bancaire, mais confond tout (il a entendu parler de Pinel par un collègue).",
        "roleA": "Le négociateur : il doit résister à la tentation de sortir un bien tout de suite, mener la découverte avec le script (motivation réelle, apport et effort d'épargne mensuel, meublé ou nu, biens déjà détenus et régime), recueillir la TMI et l'horizon, puis orienter sans survendre ni se substituer au fiscaliste.",
        "roleB": "L'investisseur « chef de poste » : pressé, sûr de lui, parle de Pinel, veut du concret vite, teste le négociateur avec des questions chiffres. Il décroche si on lui parle déco ou coup de cœur.",
        "objectif": "S'entraîner à qualifier avant de proposer : identifier le vrai moteur derrière le mot « défiscaliser », récupérer les infos clés (TMI, apport, horizon, appétence gestion) et orienter vers la bonne piste (nu au réel avec travaux / déficit foncier, LMNP au réel, ou Denormandie dans l'ancien du centre) en annonçant le renvoi vers l'expert-comptable.",
        "debrief": [
          "Le négociateur a-t-il recueilli les 4 infos clés (TMI, capacité d'endettement/apport, horizon et sortie, appétence à la gestion) AVANT de parler d'un bien ?",
          "A-t-il évité le piège mortel de proposer du Pinel (supprimé depuis le 01/01/2025) ? A-t-il reformulé la motivation réelle plutôt que de prendre « défiscaliser » au pied de la lettre ?",
          "A-t-il parlé le langage chiffres (rendement, net-net, déficit foncier, amortissement) sans jargon excessif, et bien marqué la frontière conseil immobilier / conseil fiscal (renvoi expert-comptable) ?",
          "Qu'est-ce qui a fait décrocher ou au contraire embarquer l'investisseur ? Noter 2 bonnes pratiques à réutiliser sur le terrain."
        ]
      },
      {
        "titre": "Pitch du bien « boudé » à l'investisseur du vivier",
        "contexte": "Une pépite vient de rentrer : un T2 vendu loué, à petits travaux, délaissé par les primo-accédants, vendeur pressé, prix négociable. Le négociateur appelle un investisseur aguerri de son vivier pour le placer en 48 h, avant diffusion.",
        "roleA": "Le négociateur : il doit pitcher le bien en langage investisseur (couple prix/loyer, rendement, bail en cours et décote éventuelle, potentiel meublé), expliquer le double argument du bien vendu loué (rendement immédiat mais loyer parfois sous le marché) et créer l'urgence sans forcer.",
        "roleB": "L'investisseur aguerri : connaît ses ratios, ne veut pas perdre de temps, demande tout de suite les chiffres, les PV d'AG et le bail en cours. Il décide seul et vite si le dossier tient.",
        "objectif": "S'entraîner à sourcer et placer un bien auprès d'un investisseur qualifié, pitcher en 2 minutes avec les bons chiffres, et manier l'argument du bien déjà loué dans les deux sens (atout rendement immédiat / limite loyer plafonné par le bail).",
        "debrief": [
          "Le pitch allait-il droit aux chiffres (rendement, prix/loyer, décote) sans perdre l'aguerri avec de la pédagogie inutile ?",
          "Le négociateur a-t-il su expliquer honnêtement les deux faces du bien vendu loué (sécurité du rendement vs loyer en cours sous le marché, bail qui s'impose à l'acquéreur) ?",
          "L'urgence créée était-elle crédible (vendeur pressé, pépite rare) sans mensonge ni pression déloyale ?",
          "Le réflexe fidélisation a-t-il été posé (proposition de gestion locative, point patrimonial, demande de recommandation) ?"
        ]
      }
    ],
    "pointsCles": [
      "L'investisseur est le meilleur client de l'agence : rationnel, rapide, récurrent (rachat tous les 2-3 ans), prescripteur et solvable. On parle chiffres, jamais déco ni coup de cœur.",
      "Qualifier AVANT de proposer : identifier la motivation (rendement, patrimoine, défisc, retraite, transmission), la TMI, l'apport, l'horizon et l'appétence à la gestion. Le moteur oriente le bien, le régime et le montage.",
      "« Le BRUT ment, le NET informe, le NET-NET décide. » Trois rendements + le cash-flow : ne jamais laisser décider sur le seul brut, toujours inclure les frais d'acquisition au dénominateur.",
      "L'effet de levier est le cœur de la performance : on investit avec l'argent de la banque et on rembourse avec les loyers. Règles HCSF 2024-2026 : endettement 35 % assurance comprise, 25 ans (27 avec différé), 70 % des loyers retenus, dérogation sur 20 % des dossiers.",
      "Deux mondes fiscaux à ne jamais confondre : location NUE = revenus fonciers (micro 30 % ou réel + déficit foncier jusqu'à 10 700 €, 21 400 € en rénovation énergétique) ; location MEUBLÉE = BIC (micro 50 % ou réel LMNP avec amortissement, impôt souvent proche de zéro).",
      "Nouveautés 2025 à maîtriser : Pinel supprimé (ne JAMAIS le proposer), amortissements LMNP réintégrés dans la plus-value de revente (sauf résidences services gérées), loi Le Meur durcissant le meublé de tourisme (30 %/15 000 € non classé).",
      "Un dispositif ne rend jamais bon un mauvais bien : l'investissement doit tenir debout SANS l'avantage fiscal. L'emplacement et le rendement priment toujours sur la carotte fiscale.",
      "La grille ELECT (Emplacement, Loyer de marché, État/travaux, Charges/copropriété, Tension locative) et le DPE (G interdit depuis 2025, F en 2028, E en 2034) filtrent les pièges qui détruisent la rentabilité nette.",
      "Le montage répond à un objectif : nom propre (simple, LMNP facile), SCI à l'IR (gérer/transmettre, pas de meublé), SCI à l'IS (capitaliser, lourd à revendre), démembrement (transmission, IFI). Ne jamais créer une SCI par réflexe.",
      "La vente n'est que le début : accompagner (gestion locative, courtier, notaire, expert-comptable) et fidéliser (point annuel, recommandation) fait de l'investisseur une rente. On oriente, chiffre et alerte, mais on ne se substitue jamais au conseil fiscal (ce qui protège sa responsabilité)."
    ],
    "planAction": [
      "Dès demain, ouvrir ou enrichir un VIVIER INVESTISSEURS qualifié (nom, budget, apport, TMI estimée, régime visé, secteurs ciblés) pour placer toute pépite en 48 h.",
      "Intégrer systématiquement le SCRIPT DE DÉCOUVERTE investisseur à chaque contact acheteur : motivation réelle, apport/effort d'épargne, meublé ou nu, biens déjà détenus et régime fiscal, AVANT de montrer un bien.",
      "Préparer une FICHE RENDEMENT type (brut, net de charges, cash-flow) et la remplir pour au moins un bien du portefeuille cette semaine, pour s'entraîner à chiffrer en 30 secondes devant le client.",
      "Sur chaque mandat à l'entrée, réflexe DPE + PV d'AG + fonds travaux : repérer les biens « boudés par l'occupant mais parfaits pour l'investisseur » et les passoires F/G comme leviers de négociation.",
      "Se constituer un RÉSEAU DE PARTENAIRES à citer (courtier, expert-comptable, notaire) pour orienter sans se substituer au conseil fiscal, et renvoyer tout montage (SCI, démembrement, LMNP au réel) vers le bon spécialiste.",
      "Mettre en place une RELANCE ANNUELLE de chaque investisseur du portefeuille (point patrimonial, évolution du marché de Martigues, seconde acquisition, demande de recommandation) pour déclencher le rachat tous les 2-3 ans."
    ],
    "notesFormateur": [
      "Gérer le temps avec le chrono visible : les séquences 2 (calcul) et 3 (quiz) sont les plus riches en savoir — tenir le minutage pour préserver la mise en pratique de la séquence 4, qui ancre réellement les acquis.",
      "Faire parler avant d'exposer : sur chaque notion (motivations, rendements, pièges), lancer d'abord le jeu ou une question au groupe, puis apporter la règle. On retient ce qu'on a cherché, pas ce qu'on a subi.",
      "Ancrer par les mnémoniques et les cas de Martigues : répéter « le BRUT ment, le NET informe, le NET-NET décide » et la grille ELECT à chaque occasion, et toujours ramener au terrain local (Lavéra, centre ancien, étang) pour que ce soit concret.",
      "Verrouiller les 3 pièges mortels du métier avant de se quitter : ne JAMAIS proposer un dispositif supprimé (Pinel, Censi-Bouvard), ne pas confondre nu et meublé, ne jamais faire visiter sans avoir dégrossi la capacité de financement.",
      "Faire participer les timides via les binômes et sous-groupes (défi chrono, étude de cas) : le petit groupe libère la parole mieux que le grand. Équilibrer primo et aguerris en mélangeant les niveaux dans chaque équipe.",
      "Clôturer par un engagement individuel écrit : chaque négociateur annonce à voix haute UNE action du plan qu'il applique dès le lendemain, à reprendre en point d'équipe la semaine suivante pour transformer la formation en résultats."
    ]
  },
  "vefa-neuf": {
    "id": "vefa-neuf",
    "sousTitre": "VEFA & neuf : devenir l'expert qui sécurise l'achat sur plan, du contrat de réservation à la remise des clés",
    "objectifs": [
      "Maîtriser le mécanisme de la VEFA et ses deux contrats (réservation puis acte authentique) pour l'expliquer clairement à un acquéreur",
      "Savoir citer et appliquer les trois barèmes chiffrés du neuf : dépôt de garantie « 5-2-0 », appels de fonds « 35-70-95-5 » et garanties « 1-2-10 »",
      "Être capable de sécuriser le parcours client sur les délais clés (rétractation SRU 10 jours, réflexion Scrivener 10 jours, projet d'acte à J-1 mois)",
      "Maîtriser les arguments fiscaux du neuf (frais de notaire réduits, TVA 20 %/5,5 %, exonération de taxe foncière 2 ans, PTZ 2025) et savoir les chiffrer",
      "Être capable de conseiller juste sur les dispositifs 2025-2026 (fin du Pinel, LMNP, PSLA, BRS) sans jouer au fiscaliste",
      "Savoir transformer la vigilance (intérêts intercalaires, réserves à la livraison, retards) en service à forte valeur qui fidélise et génère de la recommandation"
    ],
    "agenda": [
      {
        "titre": "Accueil & brise-glace « Neuf ou ancien ? » : lancer le groupe et sonder les représentations",
        "duree": "0-10 min (10 min)"
      },
      {
        "titre": "Apport 1 — La VEFA et ses deux contrats : propriété progressive, prix ferme/révisable, points de vigilance",
        "duree": "10-25 min (15 min)"
      },
      {
        "titre": "Jeu 1 — Quiz-battle en équipes « Les chiffres du neuf » (barèmes 5-2-0, 35-70-95-5, 1-2-10)",
        "duree": "25-40 min (15 min)"
      },
      {
        "titre": "Apport 2 — Contrat de réservation, délais SRU/Scrivener, financement et appels de fonds",
        "duree": "40-52 min (12 min)"
      },
      {
        "titre": "Jeu 2 — Vrai/Faux debout « Les pièges du neuf » (idées reçues et erreurs à éviter)",
        "duree": "52-62 min (10 min)"
      },
      {
        "titre": "Apport 3 — Garanties, fiscalité et dispositifs 2025-2026 (TVA, taxe foncière, PTZ, BRS, fin du Pinel)",
        "duree": "62-74 min (12 min)"
      },
      {
        "titre": "Jeu 3 — Défi chrono « Chiffre le projet T3 Martigues » (frais, appels de fonds, économies fiscales)",
        "duree": "74-86 min (12 min)"
      },
      {
        "titre": "Jeu de rôle — Mise en situation téléphonique « Direct promoteur vs agence » + débrief",
        "duree": "86-108 min (22 min)"
      },
      {
        "titre": "Synthèse — Points-clés, plan d'action individuel et clôture",
        "duree": "108-120 min (12 min)"
      }
    ],
    "briseGlace": {
      "titre": "« Neuf ou ancien ? » — le baromètre des idées reçues",
      "consignes": [
        "Tracez une ligne imaginaire au sol d'un bout à l'autre de la salle : à gauche « plutôt l'ancien », à droite « plutôt le neuf ». Annoncez que vous allez lire des affirmations et que chacun se positionne physiquement sur la ligne.",
        "Lisez 4 affirmations rythmées : « Dans le neuf, l'acheteur paie moins de frais de notaire » / « Acheter sur plan, c'est risqué » / « Le neuf est toujours plus cher au m² » / « Avec la fin du Pinel, le neuf ne se vend plus ».",
        "Après chaque affirmation, interrogez 2 personnes aux positions opposées : « Pourquoi là ? » Notez au paperboard les mots qui reviennent, sans corriger pour l'instant.",
        "Concluez en 1 minute : « Ces représentations, ce sont exactement celles de vos clients. À la fin de la séance, vous saurez les démonter avec des chiffres et du droit. » Annoncez le programme et l'objectif : devenir l'expert du neuf de l'agence."
      ]
    },
    "jeux": [
      {
        "titre": "Quiz-battle « Les chiffres du neuf »",
        "type": "Quiz-battle en équipes",
        "duree": "15 min",
        "consignes": [
          "Constituez 2 à 3 équipes de niveau mélangé. Chaque équipe choisit un nom et un porte-parole qui donnera la réponse finale.",
          "Expliquez la règle : vous posez une question, les équipes ont 30 secondes pour se concerter à voix basse, puis le porte-parole annonce la réponse. Bonne réponse = 1 point ; bonne réponse + justification juste (article de loi ou mnémonique) = 2 points.",
          "Posez les 8 questions dans l'ordre (voir corrigé). Après chaque réponse, faites reformuler la justification par une autre équipe pour ancrer.",
          "Tenez le score au paperboard. En cas d'égalité, posez la question bonus « Que signifie le mnémonique 5-2-0 ? » en mort subite.",
          "Félicitez l'équipe gagnante et distribuez un petit symbole (stylo agence, café offert)."
        ],
        "animation": [
          "Imposez le chuchotement pendant la concertation : sinon les équipes rapides soufflent la réponse.",
          "Valorisez systématiquement la citation d'un article (L271-1, R261-28, R261-14) : c'est ce qui fera la différence en clientèle.",
          "Si une équipe bloque, donnez l'indice mnémonique (« pensez 5-2-0 », « pensez 35-70-95-5 ») plutôt que la réponse.",
          "Gardez le rythme : 1 minute maximum par question, sinon l'énergie retombe."
        ],
        "corrige": [
          "Dépôt de garantie si acte signé dans moins d'un an : 5 % maximum (barème 5-2-0, art. R261-28 CCH).",
          "Délai de rétractation après le contrat de réservation : 10 jours sans motif ni pénalité (loi SRU, art. L271-1 CCH), dès le lendemain de la première présentation de la notification.",
          "Pourcentage cumulé des appels de fonds à la mise hors d'eau : 70 % (barème 35-70-95-5, art. R261-14 CCH).",
          "Durée de la garantie biennale de bon fonctionnement (volets, robinetterie, VMC) : 2 ans (art. 1792-3 du Code civil).",
          "Durée de la garantie décennale (solidité de l'ouvrage) : 10 ans (art. 1792 du Code civil).",
          "Frais de notaire dans le neuf : 2 à 3 % (taxe de publicité foncière 0,715 %), contre 7-8 % dans l'ancien.",
          "Durée de l'exonération de taxe foncière d'une construction neuve : 2 ans (art. 1383 CGI), à condition de déclarer l'achèvement dans les 90 jours.",
          "À partir de quand accepter l'offre de prêt (loi Scrivener) : le 11e jour, après un délai de réflexion incompressible de 10 jours (art. L313-34 Code conso)."
        ]
      },
      {
        "titre": "Vrai/Faux debout « Les pièges du neuf »",
        "type": "Vrai/Faux",
        "duree": "10 min",
        "consignes": [
          "Demandez à tout le monde de se lever. Règle du corps : « Vrai » = bras croisés sur la poitrine, « Faux » = bras en X au-dessus de la tête. Personne ne reste neutre.",
          "Lisez les 8 affirmations une à une (voir corrigé). À chaque fois, tout le monde se positionne en même temps, au top.",
          "Interrogez d'abord une personne qui s'est trompée : « Qu'est-ce qui t'a fait penser ça ? », puis une personne qui a bon pour la correction. Validez avec l'article ou le chiffre exact.",
          "Ces affirmations sont les erreurs à éviter du métier : insistez sur le réflexe commercial correct à chaque fois."
        ],
        "animation": [
          "Le format debout réveille le groupe après un apport : utilisez-le juste après un temps assis.",
          "Ne corrigez jamais vous-même en premier : faites produire la bonne réponse par le groupe, c'est ce qui ancre.",
          "Dramatisez les pièges à conséquence juridique (encaissement hors séquestre, acceptation du prêt avant le 11e jour) : ce sont des fautes graves."
        ],
        "corrige": [
          "« La réservation, c'est déjà l'achat du logement. » → FAUX : c'est un contrat préliminaire ; l'achat définitif est l'acte authentique chez le notaire.",
          "« On peut encaisser le dépôt de garantie directement pour le promoteur. » → FAUX : le dépôt est séquestré et bloqué (notaire ou banque), l'encaissement hors séquestre est strictement interdit.",
          "« Un volet qui casse 18 mois après la livraison, c'est la décennale. » → FAUX : c'est la biennale (2 ans), la décennale couvre la solidité de l'ouvrage.",
          "« Le Pinel est toujours un bon argument pour vendre un investissement neuf. » → FAUX : le Pinel a pris fin le 31 décembre 2024, aucun nouvel investissement n'est possible.",
          "« Dans le neuf, les frais de notaire sont réduits à 2-3 %. » → VRAI : la vente est soumise à TVA, les droits se limitent à la taxe de publicité foncière de 0,715 %.",
          "« On peut annoncer une date de livraison ferme au jour près. » → FAUX : on parle toujours par trimestre, les délais sont indicatifs et peuvent glisser.",
          "« L'acquéreur peut accepter son offre de prêt dès qu'il la reçoit. » → FAUX : délai Scrivener de 10 jours, acceptation possible seulement à partir du 11e jour, sinon acceptation nulle.",
          "« En cas de réserves à la livraison, l'acquéreur peut consigner les 5 % de solde. » → VRAI : c'est un levier de pression légitime jusqu'à la levée des réserves."
        ]
      },
      {
        "titre": "Défi chrono « Chiffre le projet T3 Martigues »",
        "type": "Défi chrono",
        "duree": "12 min",
        "consignes": [
          "Distribuez à chaque binôme une fiche avec le cas : programme « Les Terrasses de Ferrières » à Martigues, T3 de 63 m² à 265 000 € TTC, livraison T3 2026, acte prévu dans moins d'un an.",
          "Lancez le chrono : 6 minutes pour répondre par écrit aux 5 calculs (voir corrigé). Annoncez que le premier binôme juste sur les 5 gagne.",
          "Au top final, échangez les fiches entre binômes pour une correction croisée pendant que vous donnez les réponses au paperboard.",
          "Faites réagir : « Lequel de ces chiffres marque le plus un acquéreur ? » Le but est qu'ils retiennent les ordres de grandeur pour les ressortir en rendez-vous."
        ],
        "animation": [
          "Autorisez la calculatrice du téléphone : l'objectif est la méthode et l'ordre de grandeur, pas le calcul mental.",
          "Circulez entre les binômes et relancez ceux qui confondent appel « par tranche » et appel « cumulé » : c'est le piège classique.",
          "Reliez chaque chiffre à une phrase client : « 13 000 € d'économie sur les frais, c'est la cuisine équipée financée. »",
          "S'il reste du temps, demandez de verbaliser la double charge (loyer + intérêts intercalaires) pendant le chantier."
        ],
        "corrige": [
          "Dépôt de garantie (acte dans moins d'un an, 5 %) : 13 250 € — bloqué sur compte séquestre chez le notaire.",
          "Appels de fonds par tranche : fondations 35 % = 92 750 € ; mise hors d'eau (cumul 70 %) = +92 750 € ; achèvement (cumul 95 %) = +66 250 € ; solde livraison 5 % = 13 250 €.",
          "Frais de notaire dans le neuf (~2,5 %) : environ 6 600 €, contre ~19 900 € dans l'ancien (~7,5 %), soit environ 13 000 € d'économie.",
          "Économie si TVA à 5,5 % au lieu de 20 % (résidence principale en zone éligible / BRS / PSLA) : environ 32 000 €.",
          "Avantage taxe foncière : exonération pendant 2 ans (art. 1383 CGI), à condition de déclarer l'achèvement dans les 90 jours."
        ]
      },
      {
        "titre": "Brainstorm « 10 arguments pour vendre le neuf en 2026 »",
        "type": "Brainstorm",
        "duree": "8 min",
        "consignes": [
          "Posez la question au groupe : « Face à un client qui hésite entre neuf et ancien en 2026, quels sont tous les arguments du neuf ? » Objectif affiché : atteindre 10 arguments.",
          "Chacun note ses idées 1 minute en silence sur un post-it (un argument par post-it), puis vient les coller au paperboard en les annonçant à voix haute.",
          "Regroupez en direct par familles : fiscalité/financement, confort/qualité, sécurité juridique, personnalisation.",
          "Complétez les manques à partir de la liste (voir corrigé) et surlignez les 3 arguments les plus différenciants face au « direct promoteur »."
        ],
        "animation": [
          "Interdisez la critique pendant la phase de production : toute idée est bonne, on trie après.",
          "Le silence initial d'écriture évite que les plus bavards monopolisent et fait participer les introvertis.",
          "Gardez le paperboard visible jusqu'à la fin de la séance : il sert de support au jeu de rôle qui suit."
        ],
        "corrige": [
          "Frais de notaire réduits (2-3 %).",
          "Exonération de taxe foncière pendant 2 ans.",
          "TVA parfois réduite à 5,5 % (zone éligible, BRS, PSLA) et PTZ élargi depuis le 1er avril 2025.",
          "Zéro travaux, logement jamais habité.",
          "Normes RE2020 : factures d'énergie basses, confort d'été, pas de passoire thermique.",
          "Garanties longues et protectrices : parfait achèvement 1 an, biennale 2 ans, décennale 10 ans, dommages-ouvrage.",
          "Personnalisation via les TMA (cloisons, carrelage, prises).",
          "GFA : l'immeuble sera achevé même si le promoteur fait faillite.",
          "Accompagnement agence qui sécurise tout le parcours (vs direct promoteur).",
          "Pour l'investisseur : LMNP au réel (en rappelant la réintégration des amortissements en plus-value depuis la LF 2025)."
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "« Direct promoteur ou agence ? » — l'appel du prospect hésitant",
        "contexte": "Un prospect a visité le bureau de vente du programme « Les Terrasses de Ferrières » à Martigues et hésite à acheter en direct auprès du promoteur pour « économiser les honoraires ». Il appelle l'agence CENTURY 21 Icaza Immobilier pour comprendre ce que l'agence apporte de plus. L'échange se fait au téléphone, en binôme, assis dos à dos pour travailler la voix.",
        "roleA": "Le négociateur de l'agence : il reçoit l'appel, découvre le besoin, puis démontre la valeur de l'accompagnement (sécurisation du parcours, vérification des garanties GFA/DO, chiffrage fiscal, présence à la livraison, levier des réserves) sans dénigrer le promoteur. Il doit rassurer sur le fait que la réservation n'est pas l'achat, rappeler les 10 jours de rétractation et le dépôt bloqué en séquestre.",
        "roleB": "Le prospect primo-accédant : sympathique mais méfiant, budget serré, persuadé qu'en direct il paiera moins cher. Il objecte « le promoteur me fait déjà un bon prix », « à quoi sert l'agence si le programme est le même ? », « j'ai peur d'acheter sur plan ».",
        "objectif": "S'entraîner à verbaliser la valeur ajoutée de l'agence sur le neuf et à transformer l'objection prix en argument de sécurité, en mobilisant des chiffres et des garanties concrètes plutôt que des généralités.",
        "debrief": [
          "Le négociateur a-t-il distingué clairement réservation et acte définitif, et rassuré sur les 10 jours + le séquestre ?",
          "A-t-il sorti au moins 3 chiffres concrets (frais réduits ~13 000 €, barème 5-2-0, économie TVA, taxe foncière 2 ans) pour crédibiliser ?",
          "A-t-il valorisé la présence à la livraison et le levier des réserves (consignation des 5 %), service que le client ne trouve pas en direct ?",
          "A-t-il évité de dénigrer le promoteur et gardé une posture d'expert-partenaire ?",
          "Quelle formulation a le mieux « fait mouche » sur le prospect ? À réutiliser et à partager au groupe."
        ]
      },
      {
        "titre": "Le rendez-vous de signature du contrat de réservation",
        "contexte": "Un couple vient à l'agence signer le contrat de réservation du T3 à 265 000 €. Avant la signature, le négociateur doit expliquer ce qu'ils signent, le dépôt de garantie, les délais et vérifier que le prêt et les conditions suspensives sont bien au contrat. Mise en situation en face-à-face, autour d'une table, avec un contrat fictif ou une notice descriptive comme accessoire.",
        "roleA": "Le négociateur : il déroule pédagogiquement le contrat de réservation (dépôt 5 % = 13 250 € sur séquestre, délai de rétractation 10 jours, prix prévisionnel ferme/révisable, délai Scrivener à venir sur le prêt, conditions suspensives). Il vérifie que le prêt souhaité est bien inscrit.",
        "roleB": "Le couple acquéreur : l'un est enthousiaste et pressé de signer, l'autre est inquiet (« et si on change d'avis ? », « et si la banque refuse ? », « et si la surface n'est pas la bonne ? »). Ils posent des questions concrètes et parfois contradictoires.",
        "objectif": "Travailler la pédagogie du contrat de réservation et la réassurance, en s'assurant que le client comprend ses protections (rétractation, condition suspensive de prêt, tolérance de surface 5 %) avant de signer sereinement.",
        "debrief": [
          "Le négociateur a-t-il bien fait comprendre que le dépôt est bloqué et restituable (rétractation, prêt refusé, prix +5 %, livraison dégradée) ?",
          "A-t-il pensé à faire inscrire le prêt au contrat pour activer la condition suspensive de financement ?",
          "A-t-il géré les deux tempéraments du couple (rassurer l'inquiet sans freiner l'enthousiaste) ?",
          "A-t-il annoncé la suite du parcours (offre de prêt, délai Scrivener, appels de fonds, livraison) pour projeter le couple ?",
          "Y a-t-il eu une information oubliée ou mal formulée à corriger collectivement ?"
        ]
      }
    ],
    "pointsCles": [
      "La VEFA, c'est l'achat sur plan avec propriété progressive : deux contrats, réservation préliminaire puis acte authentique chez le notaire ; notre rôle est de sécuriser le parcours, pas seulement de « vendre un plan ».",
      "Trois barèmes à savoir par cœur : dépôt de garantie « 5-2-0 » (moins d'1 an / 1 à 2 ans / plus de 2 ans), appels de fonds « 35-70-95-5 » (fondations, hors d'eau, achèvement, livraison), garanties « 1-2-10 » (parfait achèvement, biennale, décennale).",
      "Deux délais de 10 jours à ne jamais confondre : la rétractation SRU (art. L271-1 CCH) après le contrat de réservation, et la réflexion Scrivener sur l'offre de prêt, acceptable seulement à partir du 11e jour.",
      "Le dépôt de garantie est toujours bloqué sur compte séquestre (notaire ou banque) : l'encaisser hors séquestre est strictement interdit ; il est restituable en cas de rétractation, de prêt refusé, de prix +5 % ou de livraison dégradée.",
      "Le neuf est l'achat le mieux protégé : GFA extrinsèque (achèvement garanti même en cas de faillite du promoteur, depuis 2015) et assurance dommages-ouvrage (préfinancement des réparations décennales sans procès, transmissible 10 ans).",
      "La fiscalité du neuf est un argument chiffrable : frais de notaire 2-3 % au lieu de 7-8 %, TVA 20 % ou 5,5 % en zone éligible, exonération de taxe foncière 2 ans (déclaration sous 90 jours), PTZ élargi partout depuis le 1er avril 2025.",
      "Toujours anticiper la double charge pendant le chantier : loyer actuel + intérêts intercalaires (calculés sur les seules sommes débloquées), la mensualité pleine ne démarrant qu'à la livraison.",
      "À la livraison, on note tout dans le procès-verbal (réserves) et on peut consigner les 5 % de solde jusqu'à leur levée : être présent ce jour-là est un service à forte valeur qui génère la recommandation.",
      "Parler juste sur les dispositifs 2025-2026 : le Pinel est fermé depuis le 31/12/2024, le LMNP au réel reste pertinent (mais amortissements réintégrés en plus-value), PSLA et BRS (TVA 5,5 %, -30 à -40 % sur le BRS) sont des leviers forts pour les primo-accédants en secteur tendu.",
      "On ne joue jamais au fiscaliste ni au notaire : on pose les chiffres et les repères, et on oriente vers l'expert-comptable ou le notaire pour les situations personnelles complexes."
    ],
    "planAction": [
      "Mémoriser et réciter les trois mnémoniques (5-2-0, 35-70-95-5, 1-2-10) jusqu'à les sortir sans hésiter en rendez-vous dès cette semaine.",
      "Créer un tableau de bord des échéances par client VEFA (J0 réservation, J+10 rétractation, obtention prêt, projet d'acte à J-1 mois, appels de fonds, livraison) et le tenir à jour pour chaque dossier neuf.",
      "Préparer une fiche de chiffrage type « avantage neuf » réutilisable (frais de notaire, économie TVA, taxe foncière, PTZ, intérêts intercalaires) à présenter noir sur blanc à chaque prospect.",
      "Systématiser, à chaque réservation, le script de réassurance : « réservation ≠ achat, 10 jours pour changer d'avis, dépôt bloqué en séquestre » et vérifier que le prêt est bien inscrit au contrat.",
      "Proposer et bloquer sa présence à la livraison de chaque client (tour pièce par pièce, réserves, consignation des 5 %) pour en faire un rendez-vous de recommandation.",
      "Mettre à jour son discours sur les dispositifs : retirer définitivement le Pinel des arguments et identifier dans le portefeuille local (Martigues, Istres, Port-de-Bouc) les programmes éligibles BRS, PSLA, TVA 5,5 % et PTZ."
    ],
    "notesFormateur": [
      "Alternez systématiquement apport court (10-15 min) et activité : le module est dense en chiffres, un format uniquement descendant perd le groupe. Gardez le rythme annoncé à l'agenda et affichez le minutage.",
      "Pour ancrer les trois barèmes, revenez-y dans chaque activité (quiz, vrai/faux, défi chrono) : la répétition espacée est ce qui fait retenir les chiffres durablement.",
      "Faites toujours produire la bonne réponse par les participants avant de la valider vous-même, et faites reformuler par une autre personne : on retient ce qu'on dit, pas ce qu'on entend.",
      "Reliez chaque notion au terrain local (programme fictif « Les Terrasses de Ferrières » à Martigues, T3 à 265 000 €) : un chiffre incarné sur un vrai type de bien marque plus qu'une règle abstraite.",
      "Gérez les niveaux : mélangez les équipes pour que les plus expérimentés tirent les juniors, et sollicitez nommément les plus silencieux pendant les vrai/faux et brainstorms.",
      "Terminez impérativement par le plan d'action individuel écrit : demandez à chacun de verbaliser à voix haute UN engagement concret pour le lendemain ; c'est le transfert sur le terrain qui justifie la séance."
    ]
  },
  "plus-value": {
    "id": "plus-value",
    "sousTitre": "Détecter, alerter, sécuriser : faire de la plus-value immobilière un argument de confiance, pas une bombe à retardement le jour de l'acte.",
    "objectifs": [
      "Être capable de détecter dès la découverte (R1) un bien à risque de plus-value grâce aux cinq questions-clés : nature du bien, date et mode d'acquisition, mode de détention, factures de travaux.",
      "Maîtriser la logique du calcul : plus-value brute = prix de cession corrigé − prix d'acquisition corrigé, avec les forfaits 7,5 % (frais) et 15 % (travaux).",
      "Savoir expliquer à un vendeur la règle « 22 / 30 » : exonération d'impôt sur le revenu à 22 ans, exonération totale (prélèvements sociaux inclus) à 30 ans.",
      "Savoir repérer les principales exonérations (résidence principale, petites cessions ≤ 15 000 €, première cession hors RP avec remploi) et les pièges (surtaxe > 50 000 €, SCI à l'IS, LMNP depuis 2025).",
      "Être capable de raisonner en « net vendeur réel » et de l'estimer avant de fixer le prix de mise en vente.",
      "Savoir alerter sans jamais calculer : tenir le triptyque détecter / chiffrer avec le notaire / sécuriser, et transmettre au notaire les bons justificatifs dès le compromis."
    ],
    "agenda": [
      {
        "titre": "Accueil, cadrage des objectifs et brise-glace « la facture surprise »",
        "duree": "0:00 – 0:15 (15 min)"
      },
      {
        "titre": "Apport 1 — Champ, acteurs et calcul : qui paie, qui prélève, prix corrigés et forfaits (7,5 % / 15 %)",
        "duree": "0:15 – 0:35 (20 min)"
      },
      {
        "titre": "Jeu 1 — Quiz-battle en équipes « Les fondamentaux de la plus-value »",
        "duree": "0:35 – 0:50 (15 min)"
      },
      {
        "titre": "Apport 2 — Abattements « 22 / 30 », taux 36,2 % et surtaxe au-delà de 50 000 €",
        "duree": "0:50 – 1:05 (15 min)"
      },
      {
        "titre": "Jeu 2 — Vrai/Faux chrono « Démontez les idées reçues » + Jeu 3 — Défi chrono « Exonéré ou pas ? »",
        "duree": "1:05 – 1:25 (20 min)"
      },
      {
        "titre": "Apport 3 — Exonérations, cas experts (SCI, LMNP 2025, donation-cession) et net vendeur réel",
        "duree": "1:25 – 1:40 (15 min)"
      },
      {
        "titre": "Jeu 4 — Étude de cas chiffrée en sous-groupes « Le dossier Mme Roux »",
        "duree": "1:40 – 1:55 (15 min)"
      },
      {
        "titre": "Jeu de rôle — Mise en situation téléphonique « L'alerte au vendeur »",
        "duree": "1:55 – 2:10 (15 min)"
      },
      {
        "titre": "Synthèse, points-clés, plan d'action et engagements individuels",
        "duree": "2:10 – 2:20 (10 min)"
      }
    ],
    "briseGlace": {
      "titre": "La facture surprise",
      "consignes": [
        "Projetez un seul chiffre au tableau : « 77 000 € ». Laissez le silence s'installer 10 secondes, puis demandez au groupe : « À votre avis, qu'est-ce que c'est que ce chiffre ? »",
        "Révélez : c'est l'impôt de plus-value réellement prélevé par le notaire sur une résidence secondaire de Martigues achetée 200 000 € et revendue 500 000 € (le mini-cas du module). Le vendeur ne l'avait pas anticipé.",
        "Faites circuler la parole : chacun raconte en une phrase une fois où un vendeur a découvert une mauvaise surprise fiscale ou financière le jour de l'acte (ou en a eu peur). Notez les mots qui reviennent au paperboard (furieux, bloqué, vente annulée…).",
        "Concluez en reliant au fil rouge de la séance : « Aujourd'hui, on apprend à faire en sorte que ce chiffre ne soit JAMAIS une surprise. Notre métier : détecter, alerter, sécuriser — pas calculer. »"
      ]
    },
    "jeux": [
      {
        "titre": "Quiz-battle « Les fondamentaux de la plus-value »",
        "type": "Quiz-battle en équipes",
        "duree": "15 min",
        "consignes": [
          "Constituez 2 ou 3 équipes et faites-leur choisir un nom d'agence fictif. Chaque équipe désigne un porte-parole.",
          "Posez 8 questions à l'oral (une diapo par question, 4 options A/B/C/D). Chaque équipe écrit sa réponse sur une ardoise/feuille et la lève simultanément au top, pour éviter le copiage.",
          "Bonne réponse = 1 point ; bonne réponse AVEC justification correcte donnée par le porte-parole = 2 points (c'est la justification qui ancre l'apprentissage).",
          "Questions à poser dans l'ordre : (1) La vente de la résidence principale est… ? (2) L'exonération TOTALE est atteinte après combien d'années ? (3) Taux global quand la PV est pleinement taxée ? (4) La surtaxe s'applique au-delà de quel montant de PV imposable ? (5) Qui calcule et prélève la plus-value ? (6) Forfait frais d'acquisition sans justificatif ? (7) Pour un bien hérité, la durée court à partir de quand ? (8) Depuis 2025, les amortissements LMNP… ?",
          "Tenez le score au tableau. L'équipe gagnante est félicitée ; prévoyez un petit lot symbolique (café offert, premier choix du prochain mandat tournant…)."
        ],
        "animation": [
          "Ne validez jamais une réponse sans faire reformuler la règle : c'est le moment pédagogique. Rebondissez sur chaque erreur avec le « pourquoi ».",
          "Gardez un rythme vif : 1 min max par question. Si une équipe sèche, passez la main à une autre pour un point bonus.",
          "Valorisez autant la bonne attitude (« je ne sais pas, je renvoie au notaire ») que la bonne réponse technique."
        ],
        "corrige": [
          "Q1 : Exonérée totalement, sans condition de durée (art. 150 U CGI).",
          "Q2 : 30 ans (à 22 ans seul l'impôt sur le revenu disparaît).",
          "Q3 : 36,2 % (19 % IR + 17,2 % prélèvements sociaux).",
          "Q4 : 50 000 € de plus-value imposable, par vendeur.",
          "Q5 : Le notaire, le jour de la vente, via le formulaire 2048-IMM (prélèvement libératoire).",
          "Q6 : 7,5 % du prix d'achat (titre onéreux uniquement).",
          "Q7 : La date du décès / de la donation, pas l'achat initial par le défunt.",
          "Q8 : Sont réintégrés : ils diminuent le prix d'acquisition et augmentent la plus-value imposable (cessions après le 15/02/2025)."
        ]
      },
      {
        "titre": "Vrai/Faux chrono « Démontez les idées reçues »",
        "type": "Vrai/Faux",
        "duree": "10 min",
        "consignes": [
          "Tout le monde debout. Désignez un côté de la salle « VRAI » et l'autre « FAUX ». À chaque affirmation, les participants se déplacent physiquement du côté qu'ils choisissent (5 secondes pour trancher).",
          "Lisez 8 affirmations. Après chaque déplacement, interrogez une personne de chaque camp : « Pourquoi es-tu là ? » avant de donner la réponse.",
          "Affirmations : (1) « À 22 ans de détention, tout est exonéré. » (2) « La commission d'agence à la charge du vendeur réduit le prix de cession. » (3) « Les travaux que j'ai faits moi-même comptent dans le prix d'acquisition. » (4) « La résidence secondaire peut être exonérée si on l'occupe souvent. » (5) « Une vente à 14 000 € est exonérée de plus-value. » (6) « En SCI à l'IS, on bénéficie des abattements 22/30 ans. » (7) « Le négociateur peut calculer la plus-value pour rassurer le vendeur. » (8) « Un bien loué jusqu'à la veille de la vente peut être vendu comme résidence principale. »",
          "Celui qui se trompe explique ensuite la bonne réponse avec ses mots : l'erreur devient apprentissage."
        ],
        "animation": [
          "Le mouvement physique réveille le groupe après l'apport théorique : jouez sur l'énergie, mettez un minuteur visible.",
          "Insistez sur les pièges 1 et 6 : ce sont les plus coûteux en vrai sur le terrain.",
          "Si tout le groupe se trompe sur une question, prenez 2 minutes pour re-expliquer au tableau : c'est un signal d'alerte pédagogique."
        ],
        "corrige": [
          "(1) FAUX — à 22 ans seul l'impôt sur le revenu est exonéré, les prélèvements sociaux courent jusqu'à 30 ans.",
          "(2) VRAI — si le mandat met la commission à la charge du vendeur, elle vient en diminution du prix de cession.",
          "(3) FAUX — seuls les travaux facturés par une entreprise comptent ; le « fait soi-même » et le matériel seul sont exclus.",
          "(4) FAUX — la résidence secondaire n'est jamais exonérée au titre de la RP, quelle que soit la fréquence d'occupation.",
          "(5) VRAI — prix de cession ≤ 15 000 €, apprécié par bien et par vendeur = exonération.",
          "(6) FAUX — SCI à l'IS = régime des plus-values professionnelles : pas d'abattement pour durée, amortissements réintégrés.",
          "(7) FAUX — le négociateur détecte et alerte, il ne calcule jamais officiellement : c'est le notaire.",
          "(8) FAUX — un bien loué n'est pas une résidence principale ; la requalification coûte cher."
        ]
      },
      {
        "titre": "Défi chrono « Exonéré ou pas ? »",
        "type": "Défi chrono",
        "duree": "10 min",
        "consignes": [
          "Projetez 6 situations une par une. Le groupe doit, en 30 secondes max par carte, classer la situation en trois catégories affichées : EXONÉRÉ / TAXÉ / ÇA DÉPEND (à faire chiffrer par le notaire).",
          "Les participants répondent à main levée ou à l'ardoise, en équipes ou individuellement selon l'effectif.",
          "Situations : (A) M. et Mme vendent la maison où ils vivent depuis 8 ans. (B) Studio locatif détenu 12 ans à Martigues. (C) Garage vendu seul 9 000 €. (D) Résidence secondaire vendue avec 300 000 € de plus-value. (E) Appartement en LMNP très amorti, vendu en 2026. (F) Ancienne résidence principale, déménagée il y a 6 mois, pas louée, mandat déjà signé.",
          "Chronométrez à voix haute (« 10… 5… stop ! ») pour créer la pression positive. On corrige immédiatement après chaque carte."
        ],
        "animation": [
          "Le but n'est pas la réponse chiffrée mais le bon réflexe de tri : féliciter un « ça dépend, je fais chiffrer » est aussi juste qu'un « exonéré ».",
          "Reliez chaque carte à une question de découverte R1 : « Quelle question aurait révélé ce cas ? »",
          "Enchaînez vite : l'adrénaline du chrono fixe la mémoire."
        ],
        "corrige": [
          "(A) EXONÉRÉ — résidence principale au jour de la vente (art. 150 U CGI).",
          "(B) TAXÉ — bien locatif détenu 12 ans : abattements partiels seulement, plus-value à payer.",
          "(C) EXONÉRÉ — petite cession ≤ 15 000 €, appréciée par bien et par vendeur.",
          "(D) TAXÉ + SURTAXE — résidence secondaire, PV > 50 000 € donc surtaxe progressive 2 % à 6 %.",
          "(E) TAXÉ, base alourdie — réforme LMNP 2025 : amortissements réintégrés, plus-value supérieure à ce que le vendeur imagine, à faire chiffrer.",
          "(F) EXONÉRÉ sous conditions (ÇA DÉPEND) — délai normal de vente (environ 1 an), bien non loué, démarches entreprises sans tarder : à valider par le notaire."
        ]
      },
      {
        "titre": "Étude de cas chiffrée « Le dossier Mme Roux »",
        "type": "Étude de cas",
        "duree": "15 min",
        "consignes": [
          "Distribuez une fiche par sous-groupe (3-4 personnes) avec les données : studio locatif à Martigues, acheté 150 000 € il y a 18 ans, mis en vente 250 000 €. Diagnostics + mainlevée : 1 300 €. Pas de factures de travaux retrouvées.",
          "Mission 1 (5 min) : reconstituer la plus-value brute en appliquant les corrections. Donnez les forfaits comme indices : 7,5 % sur le prix d'achat (frais) et 15 % (travaux, bien détenu > 5 ans).",
          "Mission 2 (5 min) : expliquer, sans calcul précis, pourquoi le vendeur ne touchera PAS 250 000 € net, et formuler la phrase d'alerte qu'ils diraient à Mme Roux.",
          "Mise en commun (5 min) : un rapporteur par groupe présente son chiffrage et sa phrase d'alerte. Comparez avec le corrigé."
        ],
        "animation": [
          "Circulez entre les groupes, ne donnez pas la réponse : posez des questions (« avez-vous majoré le prix d'achat ? »).",
          "L'objectif n'est pas d'être notaire mais de comprendre la MÉCANIQUE et de savoir l'expliquer simplement. Valorisez la clarté de l'alerte autant que l'exactitude du chiffre.",
          "Rappelez que sur le terrain, c'est le notaire qui produit le chiffre officiel : ici on s'entraîne à anticiper l'ordre de grandeur."
        ],
        "corrige": [
          "Prix de cession corrigé : 250 000 − 1 300 = 248 700 €.",
          "Prix d'acquisition corrigé : 150 000 + 7,5 % (11 250 €) + 15 % travaux (22 500 €) = 183 750 €.",
          "Plus-value brute : 248 700 − 183 750 = 64 950 €.",
          "Après 18 ans (13 années d'abattement) : impôt sur le revenu ≈ 2 715 € et prélèvements sociaux ≈ 8 775 €, soit environ 11 490 € prélevés par le notaire.",
          "Phrase d'alerte attendue : « Sur ce studio locatif détenu 18 ans, il restera de la plus-value à régler chez le notaire, de l'ordre de 11 000 €. Faisons chiffrer votre net réel avant de fixer le prix. »"
        ]
      },
      {
        "titre": "Brainstorm « La carte des 5 questions de découverte »",
        "type": "Brainstorm",
        "duree": "8 min",
        "consignes": [
          "Au paperboard, posez la question centrale : « Quelles questions poser en R1 pour détecter un risque de plus-value ? » Chaque participant note ses idées sur des post-it (1 idée par post-it), en silence, pendant 2 minutes.",
          "Chacun vient coller ses post-it au tableau et les lit à voix haute ; regroupez les doublons.",
          "Ensemble, réduisez le mur de post-it aux 5 questions essentielles à intégrer dans la trame de découverte de l'agence.",
          "Photographiez le résultat et engagez le groupe à ajouter ces 5 questions dans leur fiche découverte dès demain."
        ],
        "animation": [
          "Laissez le silence du temps d'écriture individuelle : il garantit que chacun contribue, pas seulement les plus bavards.",
          "Guidez vers les 5 questions du module si elles n'émergent pas spontanément, sans les imposer d'emblée.",
          "Terminez par un vote à main levée sur « la question qu'on oublie le plus souvent » : souvent le mode d'acquisition (donation/succession) ou le mode de détention (SCI)."
        ],
        "corrige": [
          "Nature du bien : résidence principale, secondaire ou bien loué ?",
          "Depuis quelle année êtes-vous propriétaire ?",
          "Bien acheté, ou reçu par donation / succession ?",
          "Détention en direct, en indivision ou via une SCI ?",
          "Avez-vous conservé les factures de travaux réalisés par des entreprises ?"
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "L'alerte au vendeur (mise en situation téléphonique)",
        "contexte": "Appel entrant à l'agence Icaza Immobilier. M. Bernardi veut mettre en vente « vite » un appartement à Martigues qu'il loue depuis 16 ans, acheté 140 000 €, espéré à 260 000 €. Il annonce d'emblée : « Je compte sur ce prix net pour racheter une maison, c'est bouclé avec ma banque. » Il ne sait rien de la plus-value.",
        "roleA": "Le négociateur Icaza Immobilier : il mène la découverte au téléphone, détecte le risque de plus-value (bien locatif, 16 ans), alerte avec tact sans calculer, et propose de faire chiffrer le net réel par le notaire AVANT de fixer le prix.",
        "roleB": "M. Bernardi, vendeur pressé et sûr de lui, un peu agacé qu'on « complique les choses ». Il résiste : « Mais je l'ai depuis 16 ans, c'est exonéré non ? » et « Je ne veux pas payer un notaire pour rien. »",
        "objectif": "S'entraîner à détecter et alerter sans affoler ni promettre, à corriger l'idée reçue des 22 ans, et à transformer l'alerte en argument de confiance plutôt qu'en frein à la signature du mandat.",
        "debrief": [
          "Le négociateur a-t-il posé les bonnes questions de découverte (date, mode d'acquisition, nature du bien, détention) ?",
          "A-t-il résisté à la tentation de donner un chiffre ou de promettre une exonération ? A-t-il bien renvoyé au notaire ?",
          "A-t-il corrigé l'idée reçue « 16 ans donc exonéré » en expliquant la règle 22/30 simplement, sans jargon ?",
          "La posture : l'alerte a-t-elle rassuré (« je protège votre projet de rachat ») ou inquiété le vendeur ?",
          "Que retenir pour le prochain appel réel : quelle phrase a le mieux fonctionné ?"
        ]
      },
      {
        "titre": "Le vendeur en SCI qui croit tout savoir",
        "contexte": "En rendez-vous d'estimation, un couple de Martigues détient un petit immeuble de rapport via une SCI. Ils affirment : « Pas d'inquiétude, on a la SCI depuis 25 ans, donc avec les abattements on est quasiment exonérés. » Le négociateur ignore encore si la SCI est à l'IR ou à l'IS.",
        "roleA": "Le négociateur : il doit faire préciser le régime fiscal de la SCI (IR ou IS) sans se faire passer pour un fiscaliste, expliquer que l'enjeu change tout, et orienter vers l'expert-comptable / le notaire avant de fixer le prix.",
        "roleB": "Le couple d'associés, confiants et persuadés de maîtriser leur dossier. L'un des deux finit par lâcher : « De toute façon la SCI est à l'IS, c'est mon comptable qui gère. »",
        "objectif": "Savoir repérer le piège SCI à l'IS (pas d'abattement pour durée, amortissements réintégrés) et poser la bonne question révélatrice, tout en restant dans son rôle de détection.",
        "debrief": [
          "Le négociateur a-t-il identifié la question décisive (IR ou IS) et su pourquoi elle est décisive ?",
          "A-t-il évité d'affirmer un résultat fiscal à la place de l'expert-comptable ?",
          "Comment a-t-il annoncé la mauvaise nouvelle potentielle sans braquer des clients sûrs d'eux ?",
          "Quel réflexe retenir : faire chiffrer le net réel avec l'expert-comptable AVANT la mise en vente."
        ]
      }
    ],
    "pointsCles": [
      "Le négociateur ne calcule JAMAIS la plus-value : il la détecte, alerte et renvoie au notaire. C'est ce triptyque qui crédibilise son conseil et sécurise la vente.",
      "Résidence principale effective au jour de la vente = exonération totale, sans condition de durée ni de montant (art. 150 U CGI). C'est l'exonération reine.",
      "Règle « 22 / 30 » : exonération d'impôt sur le revenu (19 %) à 22 ans, exonération TOTALE (prélèvements sociaux 17,2 % inclus) seulement à 30 ans. Le piège classique est de croire qu'à 22 ans tout est fini.",
      "Taux plein = 36,2 % (19 % + 17,2 %) ; les 5 premières années ne donnent aucun abattement. Au-delà, impôt et prélèvements sociaux s'abattent à des rythmes différents.",
      "Plus-value brute = prix de cession corrigé − prix d'acquisition corrigé. On majore le prix d'achat : forfait frais 7,5 % et forfait travaux 15 % (bien bâti détenu > 5 ans), ou le réel sur factures d'entreprise — toujours le plus avantageux.",
      "Surtaxe progressive de 2 % à 6 % au-delà de 50 000 € de plus-value imposable par vendeur ; résidence principale et terrains à bâtir en sont exclus. L'indivision et le couple peuvent diviser le seuil.",
      "Exonérations à repérer : petite cession ≤ 15 000 € (par bien et par vendeur), première cession hors RP avec remploi sous 24 mois, retraités/invalides modestes, non-résidents UE/EEE sous plafond.",
      "Réforme LMNP depuis le 15/02/2025 : les amortissements déduits sont réintégrés (ils baissent le prix d'acquisition), donc la plus-value grimpe. Un vendeur en meublé ayant beaucoup amorti doit faire chiffrer impérativement.",
      "Attention aux pièges experts : SCI à l'IS = plus-values professionnelles (pas d'abattement durée, amortissements réintégrés) ; bien hérité = durée comptée depuis le décès, pas l'achat initial.",
      "Raisonner en net vendeur réel (prix − honoraires − capital restant dû − plus-value estimée) AVANT de fixer le prix : c'est ce qui protège le projet de rachat et évite le blocage le jour de l'acte."
    ],
    "planAction": [
      "Intégrer dès demain les 5 questions de détection dans ma trame de découverte R1 : nature du bien, date d'acquisition, mode (achat/donation/succession), mode de détention (direct/indivision/SCI), factures de travaux d'entreprise.",
      "Sur tout bien qui n'est pas une résidence principale (locatif, résidence secondaire, LMNP, SCI), déclencher systématiquement l'alerte plus-value et proposer un chiffrage du net réel par le notaire AVANT de fixer le prix de mise en vente.",
      "Adopter et utiliser le script d'alerte type : « Je ne suis pas fiscaliste, je préfère qu'on fasse chiffrer précisément par votre notaire, pour fixer votre prix sur votre net réel, sans mauvaise surprise le jour de la signature. »",
      "Transmettre au notaire, dès le compromis, le trio de justificatifs : année et mode d'acquisition, valeur d'origine, factures de travaux d'entreprise — et pour une résidence principale, les preuves d'occupation.",
      "Vérifier la date d'anniversaire d'acquisition sur les biens proches d'un palier (6, 22 ou 30 ans) et, si le projet le permet, en parler au vendeur et au notaire pour décaler utilement la signature.",
      "Ne jamais promettre d'exonération ni annoncer de chiffre définitif : signaler la piste, renvoyer au notaire (ou à l'expert-comptable pour les SCI/LMNP) qui valide et sécurise."
    ],
    "notesFormateur": [
      "Gérez le temps avec un minuteur visible pendant les jeux chronométrés : l'énergie du chrono est pédagogique, mais ne laissez aucun jeu déborder au détriment du jeu de rôle, cœur du transfert terrain.",
      "Alternez systématiquement apport court (15-20 min max) et activité : le niveau Expert ne veut pas un cours magistral mais des cas concrets et du débat. Coupez tout monologue de plus de 20 minutes.",
      "Faites participer les silencieux en nommant les porte-parole par rotation et en utilisant le mouvement physique (Vrai/Faux debout) : personne ne doit rester spectateur pendant 2 heures.",
      "Ancrez chaque acquis en faisant TOUJOURS reformuler la règle par un participant plutôt qu'en la donnant vous-même : la justification orale fixe mieux que la bonne case cochée.",
      "Ramenez chaque notion à Martigues et à des biens réels du portefeuille de l'agence : plus l'exemple est local et incarné, plus l'alerte deviendra un réflexe sur le terrain.",
      "Rappelez sans cesse la ligne rouge déontologique : on détecte et on alerte, on ne calcule ni ne promet jamais. Terminez par le tour de table des engagements individuels du plan d'action pour verrouiller le passage à l'action dès le lendemain."
    ]
  },
  "location-baux": {
    "id": "location-baux",
    "sousTitre": "Louer juste, louer vite, louer sans contentieux : maîtriser le bail d'habitation de A à Z",
    "objectifs": [
      "Maîtriser le cadre d'ordre public de la loi du 6 juillet 1989 et choisir le bon bail (vide 3/6 ans, meublé 1 an, étudiant 9 mois, bail mobilité, colocation) selon le bien et la cible locative",
      "Être capable de constituer un dossier locataire 100 % conforme (pièces autorisées / interdites, règle anti-discrimination, taux d'effort 33 %) et de proposer la garantie adaptée (caution solidaire, GLI, Visale)",
      "Savoir fixer, réviser via l'IRL et encadrer un loyer en zone tendue, distinguer loyer et charges, et appliquer le gel des loyers des passoires F et G",
      "Maîtriser l'état des lieux contradictoire et la restitution du dépôt de garantie dans les plafonds (1 mois vide / 2 mois meublé) et les délais légaux",
      "Être capable de délivrer un congé valide (préavis, motifs, protection du locataire âgé) et de réagir à un impayé dans les règles, sans jamais se faire justice soi-même",
      "Savoir vérifier la décence et la décence énergétique (calendrier DPE : G interdit depuis 2025, F en 2028, E en 2034) avant toute mise en location"
    ],
    "agenda": [
      {
        "titre": "Accueil café + brise-glace « Le bail le plus douloureux »",
        "duree": "0h00 - 0h15 (15 min)"
      },
      {
        "titre": "Cadrage : objectifs de la séance et règle du jeu (points d'équipe à gagner)",
        "duree": "0h15 - 0h20 (5 min)"
      },
      {
        "titre": "Apport flash 1 : baux, durées, mentions et annexes obligatoires (loi 89)",
        "duree": "0h20 - 0h35 (15 min)"
      },
      {
        "titre": "Jeu 1 : Vrai / Faux « clauses & durées » à main levée",
        "duree": "0h35 - 0h47 (12 min)"
      },
      {
        "titre": "Jeu 2 : Quiz-battle en équipes (dossier, garanties, encadrement, DPE)",
        "duree": "0h47 - 1h05 (18 min)"
      },
      {
        "titre": "Apport flash 2 : loyer / charges / IRL / encadrement + décence énergétique",
        "duree": "1h05 - 1h17 (12 min)"
      },
      {
        "titre": "Jeu 3 : Défi chrono « calculs du négociateur » (honoraires, IRL, dépôt, pénalité)",
        "duree": "1h17 - 1h30 (13 min)"
      },
      {
        "titre": "Jeu 4 : Étude de cas en binômes « le mandat piégé »",
        "duree": "1h30 - 1h42 (12 min)"
      },
      {
        "titre": "Jeu de rôle : mise en situation téléphonique (passoire G / candidat au-dessus du taux d'effort)",
        "duree": "1h42 - 2h02 (20 min)"
      },
      {
        "titre": "Synthèse : points-clés, plan d'action du lendemain et clôture",
        "duree": "2h02 - 2h15 (13 min)"
      }
    ],
    "briseGlace": {
      "titre": "Le bail le plus douloureux",
      "consignes": [
        "Formez un cercle. Chacun raconte en 45 secondes maximum le litige locatif le plus pénible qu'il a vécu ou entendu à l'agence (dépôt non rendu, DPE oublié, congé contesté, impayé qui traîne...).",
        "Enzo note au paperboard un mot-clé par témoignage (ex. « DPE », « état des lieux », « caution »). On obtient en 5 minutes la carte des vrais points de douleur du groupe.",
        "Enzo clôt en annonçant : « Tous ces litiges, on va les désamorcer aujourd'hui. À la fin de la séance, repérez lequel de ces cas vous sauriez régler les yeux fermés. »",
        "Objectif caché : rendre visible que le contentieux locatif naît presque toujours d'une négligence de forme évitable, et créer l'envie d'y remédier."
      ]
    },
    "jeux": [
      {
        "titre": "Vrai / Faux « clauses & durées » à main levée",
        "type": "Vrai/Faux",
        "duree": "12 min",
        "consignes": [
          "Enzo projette une affirmation sur une slide. Les négociateurs lèvent un carton VERT (vrai) ou ROUGE (faux) en même temps, au top.",
          "Pour chaque item, Enzo interroge un négociateur ayant la bonne réponse pour qu'il justifie, puis corrige et ancre la règle.",
          "Enchaînez les 10 affirmations ci-dessous à bon rythme (une par minute environ).",
          "Affirmation 1 : « Un bail vide signé par un propriétaire particulier dure 6 ans. » / A2 : « Le bail meublé étudiant de 9 mois se reconduit tacitement. » / A3 : « Une clause interdisant au locataire d'avoir un chat est réputée non écrite. » / A4 : « On peut exiger du candidat un relevé de compte bancaire. » / A5 : « Le dépôt de garantie en meublé est plafonné à 2 mois de loyer hors charges. » / A6 : « Le bail mobilité autorise un dépôt d'un mois. » / A7 : « La surface qui fait foi dans un bail est la surface Carrez. » / A8 : « Le DPE doit être annexé au bail. » / A9 : « En zone tendue, le préavis du locataire en logement vide est de 1 mois. » / A10 : « On peut imposer le prélèvement automatique comme seul mode de paiement. »"
        ],
        "animation": [
          "Imposez le « top » simultané : cela évite que les lents copient les rapides et révèle les vraies croyances du groupe.",
          "Valorisez la justification plus que la bonne réponse : « Pourquoi c'est faux ? » ancre mieux que « Bravo ».",
          "Gardez un rythme vif ; si un débat s'installe sur une question, tranchez avec le texte et notez le point pour le reprendre à la synthèse."
        ],
        "corrige": [
          "A1 : FAUX - 3 ans pour un bailleur personne physique ou SCI familiale ; 6 ans réservé aux personnes morales.",
          "A2 : FAUX - le bail étudiant de 9 mois est non reconductible tacitement ; il faut signer un nouveau bail.",
          "A3 : VRAI - interdire un animal familier est une clause réputée non écrite (sauf chien de 1re catégorie).",
          "A4 : FAUX - le relevé de compte est une pièce interdite (décret du 5 novembre 2015) ; amende jusqu'à 3 000 € / 15 000 €.",
          "A5 : VRAI - 2 mois hors charges en meublé, contre 1 mois en vide.",
          "A6 : FAUX - en bail mobilité, aucun dépôt de garantie n'est autorisé ; on sécurise via Visale.",
          "A7 : FAUX - en location c'est la surface habitable (loi Boutin) qui fait foi, pas la surface Carrez (réservée à la vente en copropriété).",
          "A8 : VRAI - le DPE fait partie du dossier de diagnostics techniques annexé ; l'oublier rend le bail contestable.",
          "A9 : VRAI - préavis réduit à 1 mois en zone tendue, en meublé, ou pour motif légal.",
          "A10 : FAUX - imposer le prélèvement comme seul mode de paiement est une clause réputée non écrite."
        ]
      },
      {
        "titre": "Quiz-battle en équipes",
        "type": "Quiz-battle",
        "duree": "18 min",
        "consignes": [
          "Constituez 2 ou 3 équipes de négociateurs, chacune avec un nom (ex. « Les Baux de Martigues », « Team Loi 89 »). Chaque équipe nomme un porte-parole.",
          "Enzo pose une question à choix multiple (banque ci-dessous). Les équipes disposent de 30 secondes de concertation à voix basse, puis le porte-parole annonce la lettre choisie.",
          "Bonne réponse = 2 points ; bonne réponse ARGUMENTÉE (l'équipe cite la règle ou le texte) = 3 points. Le formateur arbitre.",
          "Question 1 : Dépôt de garantie max en vide ? (a) 1 mois HC (b) 2 mois HC (c) 3 mois HC. / Q2 : GLI et caution se cumulent ? (a) jamais (b) toujours (c) non, sauf étudiant ou apprenti. / Q3 : Honoraires locataire en zone tendue ? (a) 8 €/m² (b) 10 €/m² + 3 €/m² état des lieux (c) 1 mois de loyer. / Q4 : Classe DPE interdite à la location depuis le 1er janvier 2025 ? (a) F (b) G (c) E. / Q5 : Taux d'effort prudent exigé par les GLI ? (a) 33 % (b) 50 % (c) 25 %. / Q6 : Après commandement de payer (loi du 27 juillet 2023), délai pour régulariser ? (a) 2 mois (b) 6 semaines (c) 3 mois. / Q7 : Trêve hivernale ? (a) 1er nov - 31 mars (b) 1er déc - 1er mars (c) 15 oct - 15 avril. / Q8 : Congé du bailleur en location vide, préavis ? (a) 3 mois (b) 6 mois (c) 1 mois.",
          "Le porte-parole tourne à chaque question pour que tout le monde s'exprime. L'équipe gagnante remporte un gage positif (choisit l'ordre des pauses, un café offert...)."
        ],
        "animation": [
          "Tenez le score visible au paperboard : la compétition dope l'attention bien plus qu'un QCM individuel.",
          "La prime à l'argumentation est votre meilleur levier pédagogique : elle force les équipes à verbaliser la règle, ce qui l'ancre durablement.",
          "En cas d'égalité, posez une question subsidiaire de calcul (ex. honoraires d'un T3 de 65 m² en zone tendue : réponse 845 €) pour départager."
        ],
        "corrige": [
          "Q1 : a (1 mois HC en vide). / Q2 : c (pas de cumul, sauf étudiant ou apprenti). / Q3 : b (10 €/m² + 3 €/m² état des lieux en zone tendue ; 12 €/m² en très tendue, 8 €/m² ailleurs). / Q4 : b (classe G interdite depuis le 1er janvier 2025).",
          "Q5 : a (33 % des revenus nets). / Q6 : b (6 semaines depuis la loi du 27 juillet 2023). / Q7 : a (1er novembre au 31 mars). / Q8 : b (6 mois en vide, 3 mois en meublé, à l'échéance uniquement)."
        ]
      },
      {
        "titre": "Défi chrono « les calculs du négociateur »",
        "type": "Défi chrono",
        "duree": "13 min",
        "consignes": [
          "Chaque négociateur reçoit une feuille avec 4 mini-calculs. Enzo lance un chrono de 6 minutes projeté à l'écran. Calculatrice du téléphone autorisée.",
          "Calcul 1 (Honoraires) : un T3 de 65 m² en zone tendue. Quels honoraires locataire (hors état des lieux) puis avec état des lieux ?",
          "Calcul 2 (Révision IRL) : loyer actuel 700 €, l'IRL passe de 140,00 à 143,50. Quel nouveau loyer ?",
          "Calcul 3 (Dépôt) : studio meublé loué 600 € HC + 50 € de charges. Dépôt de garantie maximum ?",
          "Calcul 4 (Restitution) : loyer 800 € HC, retenue justifiée de 250 € (devis peinture), mais le bailleur rend le dépôt avec 2 mois de retard injustifié. Que doit-il verser au total au locataire ?",
          "À la fin du chrono, correction collective : Enzo interroge pour chaque calcul un négociateur différent qui explique sa démarche au tableau."
        ],
        "animation": [
          "Le chrono crée une saine pression : annoncez « plus que 2 minutes » pour relancer l'énergie.",
          "Insistez sur la MÉTHODE, pas seulement le résultat : un négociateur qui sait poser le calcul devant un propriétaire inspire confiance et évite les trop-perçus.",
          "Rappelez que le piège classique est de calculer le dépôt meublé sur le loyer charges comprises : c'est toujours sur le loyer HORS charges."
        ],
        "corrige": [
          "Calcul 1 : 65 × 10 = 650 € d'honoraires + 65 × 3 = 195 € pour l'état des lieux, soit 845 € au total (sans jamais dépasser la part payée par le bailleur).",
          "Calcul 2 : 700 × 143,50 / 140,00 = 717,50 € (hausse de +2,5 %).",
          "Calcul 3 : dépôt meublé = 2 mois de loyer HORS charges = 2 × 600 = 1 200 € (les 50 € de charges ne comptent pas).",
          "Calcul 4 : 800 − 250 = 550 € de dépôt résiduel, + pénalité de retard de 10 % du loyer mensuel HC par mois entamé = 2 × 80 = 160 €, soit 710 € dus au locataire."
        ]
      },
      {
        "titre": "Étude de cas en binômes « le mandat piégé »",
        "type": "Étude de cas",
        "duree": "12 min",
        "consignes": [
          "Enzo distribue (ou projette) le cas suivant aux binômes : « Mme R. confie à l'agence un T2 de 38 m² à Martigues, classé G au DPE. Elle veut le relouer meublé début 2025, à un loyer identique au précédent locataire parti il y a 8 mois. Elle propose un candidat : son neveu, étudiant, qu'elle voudrait voir loger sans trop de paperasse. »",
          "Chaque binôme a 6 minutes pour lister par écrit tous les problèmes juridiques du dossier et les solutions concrètes à proposer à Mme R.",
          "Restitution : chaque binôme donne UN problème repéré, sans répéter ceux déjà cités. Enzo complète et structure au tableau.",
          "Objectif : montrer qu'un seul mandat peut cumuler plusieurs pièges (DPE, encadrement de l'évolution, meublé, dossier) et qu'on doit tout vérifier AVANT de signer."
        ],
        "animation": [
          "Laissez les binômes chercher sans souffler : l'inconfort initial est pédagogique, les solutions trouvées par eux s'ancrent mieux.",
          "Faites tourner la parole pour que chaque binôme apporte un élément : cela valorise tout le monde et évite qu'une seule personne réponde.",
          "Reliez le cas au terrain de Martigues : « Combien de mandats classés F ou G avez-vous en portefeuille ? » pour rendre l'enjeu concret."
        ],
        "corrige": [
          "Passoire G : interdiction de signer un nouveau bail depuis le 1er janvier 2025. Vérifier d'abord si le bien (< 40 m²) bénéficie du nouveau calcul du DPE (arrêté du 25 mars 2024, attestation ADEME) ; sinon orienter vers des travaux pour atteindre E/D.",
          "Loyer gelé : logement F/G, loyer gelé depuis le 24 août 2022 (ni révision IRL, ni réévaluation à la relocation) tant que le bien reste F ou G.",
          "Meublé : vérifier que le logement comporte les 11 éléments obligatoires (décret du 31 juillet 2015), sinon risque de requalification en vide.",
          "Dossier du neveu : pas de passe-droit familial. Constituer un dossier conforme (pièces autorisées uniquement), vérifier solvabilité / taux d'effort ; pour un étudiant, caution solidaire ou Visale possible (cumul GLI + caution autorisé pour un étudiant).",
          "Conclusion à présenter à Mme R. : tant que le bien reste G, il est non relouable et le loyer est gelé ; la bonne stratégie est rénovation d'abord, relocation ensuite."
        ]
      }
    ],
    "jeuxRole": [
      {
        "titre": "« Je veux relouer ma passoire » - téléphone avec un propriétaire pressé",
        "contexte": "M. B., propriétaire d'un T3 classé G à Martigues, appelle l'agence en février 2025. Son locataire est parti, il veut relouer vite, au même loyer, et s'agace des 'nouvelles contraintes'. Le négociateur doit lui expliquer l'interdiction de location et le gel du loyer sans le braquer, tout en sécurisant le mandat (travaux, relocation future).",
        "roleA": "Le propriétaire M. B. : pressé, veut du revenu locatif tout de suite, pense que 'ces histoires de DPE, c'est bon pour les autres', menace à demi-mot de confier le bien à une autre agence.",
        "roleB": "Le négociateur : doit annoncer une mauvaise nouvelle (bien non relouable + loyer gelé), rester factuel et pédagogue, transformer la contrainte en opportunité (valorisation du bien après travaux, pérennité locative) pour garder le mandat.",
        "objectif": "S'entraîner à annoncer une contrainte légale bloquante à un client mécontent, en restant ferme sur le droit et constructif sur la solution, sans perdre la relation commerciale.",
        "debrief": [
          "Le négociateur a-t-il été clair et exact sur l'interdiction (classe G depuis le 1er janvier 2025) et le gel du loyer (depuis le 24 août 2022) ?",
          "A-t-il pensé à vérifier le nouveau calcul DPE pour les < 40 m² (attestation ADEME) avant d'envoyer le propriétaire en travaux ?",
          "Comment a-t-il transformé une mauvaise nouvelle en proposition de valeur (rénovation = déblocage du loyer + bien louable + valorisation) ?",
          "Le ton : a-t-il tenu la ligne juridique sans agressivité ni excuse de faiblesse ? Qu'aurait-on pu dire autrement pour sécuriser le mandat ?"
        ]
      },
      {
        "titre": "« Mon dossier est un peu juste » - visite et candidature au-dessus du taux d'effort",
        "contexte": "En fin de visite d'un appartement, une candidate très motivée gagne 2 000 € net pour un loyer CC de 780 € (taux d'effort de 39 %, au-delà du seuil GLI). Elle insiste pour déposer son dossier et propose spontanément 'd'apporter son relevé de compte et une attestation de non-crédit pour rassurer'. Le négociateur doit gérer sans discriminer, sans réclamer de pièce interdite, et proposer une garantie adaptée.",
        "roleA": "La candidate : sympathique et insistante, veut absolument le logement, propose d'elle-même des pièces interdites, se dit prête 'à tout' pour prouver sa bonne foi.",
        "roleB": "Le négociateur : doit refuser poliment les pièces interdites, expliquer qu'on ne juge que la solvabilité (jamais l'origine, la situation de famille...), et proposer une solution de garantie (caution solidaire d'un parent, ou Visale si < 31 ans).",
        "objectif": "Savoir sécuriser un dossier limite sans commettre d'infraction (pièce interdite, discrimination) et orienter vers la bonne garantie plutôt que de 'bricoler' le dossier.",
        "debrief": [
          "Le négociateur a-t-il refusé les pièces interdites (relevé bancaire, attestation de non-crédit) en expliquant le cadre, sans vexer la candidate ?",
          "A-t-il correctement calculé et nommé le taux d'effort (780 / 2000 = 39 %) et expliqué pourquoi la GLI ne suivra pas en l'état ?",
          "A-t-il proposé une solution concrète et légale (caution solidaire justifiant de revenus suffisants, ou Visale si moins de 31 ans) ?",
          "A-t-il évité tout propos pouvant ressembler à une sélection sur un critère prohibé ? Comment a-t-il gardé la candidate en confiance tout en protégeant le bailleur ?"
        ]
      }
    ],
    "pointsCles": [
      "La loi du 6 juillet 1989 est d'ordre public : toute clause défavorable au locataire qui y déroge est réputée non écrite. Un bail au modèle type, complet et bien annexé, c'est 90 % du contentieux évité.",
      "Les durées : vide 3 ans (personne physique / SCI familiale) ou 6 ans (personne morale), meublé 1 an, étudiant 9 mois non reconductible, bail mobilité 1 à 10 mois sans dépôt.",
      "Dossier locataire : liste limitative de pièces autorisées (décret du 5 novembre 2015), zéro pièce interdite, sélection sur la seule solvabilité (taux d'effort ~33 %), jamais sur un critère discriminatoire. Amende jusqu'à 3 000 € / 15 000 €.",
      "Garanties : caution simple ou solidaire, GLI (2,5 à 4 % du loyer CC), Visale (gratuite, 18-30 ans). GLI et caution ne se cumulent pas, sauf étudiant ou apprenti.",
      "Honoraires locataire plafonnés au m² de surface habitable : 12 €/m² (très tendue), 10 €/m² (tendue), 8 €/m² (reste), + 3 €/m² pour l'état des lieux, sans dépasser la part du bailleur.",
      "Révision du loyer : uniquement s'il existe une clause, une fois par an, via l'IRL, non rétroactive. En zone tendue, encadrement de l'évolution ; dans certaines villes, encadrement du niveau (loyer de référence majoré).",
      "Décence énergétique : loyers F/G gelés depuis le 24 août 2022 ; interdiction de louer les G depuis le 1er janvier 2025, les F en 2028, les E en 2034. On vérifie le DPE AVANT de prendre le mandat.",
      "État des lieux contradictoire précis (photos, compteurs, clés) = la meilleure assurance de fin de bail. Pas de retenue sur la vétusté, uniquement sur les dégradations justifiées par devis ou factures.",
      "Dépôt de garantie : 1 mois HC en vide, 2 mois HC en meublé, interdit en bail mobilité. Restitution sous 1 mois (ou 2 avec retenues), pénalité de 10 % du loyer mensuel HC par mois de retard.",
      "Congé du bailleur : à l'échéance uniquement, préavis 6 mois (vide) / 3 mois (meublé), pour vente, reprise (bénéficiaire nommé) ou motif légitime et sérieux. Impayé : on agit dès le 1er retard, on respecte la procédure et on ne se fait JAMAIS justice soi-même (expulsion sauvage = délit)."
    ],
    "planAction": [
      "Dès demain, créer et utiliser systématiquement une CHECK-LIST d'annexes au bail (DDT avec DPE, notice d'information, état des lieux, extraits du règlement de copropriété, inventaire si meublé), cosignée à la signature.",
      "Avant de prendre tout nouveau mandat de gestion, vérifier la classe DPE : si F ou G, alerter le propriétaire sur le gel du loyer et le calendrier d'interdiction, et vérifier l'éligibilité au nouveau calcul pour les logements de moins de 40 m².",
      "Remettre à plat la grille de constitution des dossiers : ne réclamer QUE les pièces autorisées, afficher la règle anti-discrimination, et calculer le taux d'effort (objectif ≤ 33 %) pour chaque candidat.",
      "Systématiser l'état des lieux d'entrée rigoureux : photos datées, relevés de compteurs, nombre et état des clés, et proposer une grille de vétusté annexée au bail.",
      "Mettre en place une alerte de suivi des loyers : appliquer la révision IRL chaque année à la date du bail (si clause présente) pour ne jamais 'perdre' une révision, et réagir dès le premier jour de retard de paiement.",
      "Pour chaque bien, proposer au propriétaire la garantie la plus adaptée (GLI, caution solidaire ou Visale) et vérifier le respect des plafonds d'honoraires et de dépôt de garantie avant la signature."
    ],
    "notesFormateur": [
      "Tenez le minutage : chaque jeu a une durée affichée, utilisez un chrono projeté. Si un échange déborde, notez le point sur un 'parking' au paperboard et reprenez-le à la synthèse plutôt que de sacrifier un jeu.",
      "Faites participer tout le monde : imposez la rotation des porte-parole au quiz-battle et interrogez nommément les plus discrets sur les corrections, en valorisant toujours la tentative.",
      "Ancrez par le concret de Martigues : ramenez chaque règle à un bien réel du portefeuille (le studio près de Lavéra, le T2 classé G...) ; les acquis abstraits ne tiennent pas, les cas vécus oui.",
      "Privilégiez la verbalisation de la règle : demandez 'pourquoi ?' plus souvent que 'quelle est la réponse ?'. C'est la justification qui fixe la connaissance en mémoire.",
      "Reliez le plan d'action à la séance suivante : annoncez qu'au prochain point d'équipe, chacun partagera un cas où il a appliqué la check-list d'annexes ou refusé une pièce interdite. L'engagement public augmente le passage à l'acte.",
      "Gérez l'émotion sur les sujets sensibles (impayés, expulsion, discrimination) : rappelez que la rigueur juridique protège AUSSI le négociateur et l'agence, pas seulement le locataire ou le bailleur."
    ]
  }
};
