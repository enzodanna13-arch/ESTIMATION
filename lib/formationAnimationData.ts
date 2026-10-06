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
  }
};
