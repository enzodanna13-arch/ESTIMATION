import Link from "next/link";

// Landing publique DÉVELOPPÉE — argumentaire complet + process détaillé,
// inspirée de la LP century21icazaimmobilier.fr/estimation, adaptée à l'outil
// (dossier automatique immédiat + conseiller Century 21 Icaza en renfort).
// Les chiffres de crédibilité et témoignages proviennent du site officiel de
// l'agence : à confirmer / tenir à jour par l'agence.

const STATS = [
  { n: "18 ans", l: "d'expertise sur la Côte Bleue" },
  { n: "+450", l: "biens vendus" },
  { n: "1 200", l: "estimations remises" },
  { n: "4,9/5", l: "satisfaction client" },
];

const FACTEURS = [
  "Étage", "Exposition", "Vue", "État", "Rénovation", "Prestations", "Terrasse",
  "Jardin", "Terrain", "Garage", "Parking", "Piscine", "Luminosité", "Nuisances", "Configuration",
];

const ETAPES = [
  { t: "Localisez votre bien", d: "L'adresse exacte est la clé : elle permet à votre négociateur de retrouver les ventes réellement signées chez le notaire dans votre rue et à proximité immédiate — pas une moyenne de commune." },
  { t: "Décrivez votre logement", d: "Surface, pièces, chambres, terrain, prestations, état. Chaque détail compte : deux biens identiques sur le papier n'ont pas la même valeur sur le terrain." },
  { t: "Photographiez chaque pièce", d: "Une photo par pièce, c'est ce qui remplace la visite : votre négociateur voit l'état réel, la luminosité, le standing et les prestations — et peut estimer votre bien sans se déplacer chez vous." },
  { t: "Votre négociateur analyse et référence votre bien", d: "Il croise vos informations et vos photos avec les ventes réelles (DVF) de votre secteur, corrigées de la surface et actualisées au marché d'aujourd'hui — pour une valeur juste, ni gonflée, ni sous-évaluée." },
  { t: "Il vous appelle", d: "Un échange personnalisé : votre négociateur vous explique la valeur retenue et répond à vos questions. Sans pression, sans forcing." },
  { t: "Vous recevez votre dossier par mail", d: "Un avis de valeur complet et argumenté : fourchette justifiée, comparables détaillés, synthèse claire. Livré sous 3h, à consulter et conserver." },
];

const RECOIT = [
  ["Un appel personnalisé", "Votre négociateur vous explique de vive voix la valeur de votre bien et son positionnement."],
  ["Votre dossier complet par mail", "Fourchette justifiée, comparables réels, synthèse claire — un vrai avis de valeur, pas un simple chiffre."],
  ["Sans déplacement chez vous", "Tout se fait à distance : vos photos suffisent au négociateur pour référencer votre bien."],
  ["Aucune obligation", "Le dossier est à vous, librement. Vous restez libre de vendre… ou pas."],
];

const COMPARABLES = [
  ["Chemin des Tamaris", "02/2025", "118 m²", "419 000 €"],
  ["Avenue de la Mer", "09/2024", "131 m²", "441 000 €"],
  ["Rue des Pins", "12/2024", "120 m²", "408 000 €"],
];

const TEMOIGNAGES = [
  { n: "Laurent G.", l: "Martigues · Maison T5", t: "Enfin une estimation expliquée, avec les ventes réelles à l'appui. On comprend d'où vient le prix." },
  { n: "Sophie M.", l: "Sausset-les-Pins · Appartement T3", t: "Zéro pression, dossier clair et rappel rapide quand je l'ai demandé. Exactement ce que je cherchais." },
  { n: "Karim B.", l: "Port-de-Bouc · Maison T4", t: "Un dossier béton : chaque chiffre est justifié. Ça change des estimations au doigt mouillé." },
  { n: "Nathalie R.", l: "Saint-Mitre-les-Remparts · Villa", t: "Un conseil honnête, aucun forcing. Je leur ai confié la vente en confiance." },
];

const FAQ: [string, string][] = [
  ["Quand vais-je recevoir mon estimation ?", "Votre négociateur prépare votre dossier, vous appelle et vous l'envoie par mail — en général sous 3h, en journée. Vous n'attendez pas des jours."],
  ["Un agent doit-il se déplacer chez moi ?", "Non. Vos informations et vos photos de chaque pièce suffisent à votre négociateur pour référencer votre bien et l'estimer, sans aucune visite à domicile."],
  ["L'estimation est-elle vraiment gratuite ?", "Oui, totalement gratuite et sans engagement. Votre dossier est à vous, vous en faites ce que vous voulez."],
  ["Vais-je être harcelé d'appels ?", "Non. Un seul appel, pour vous présenter votre estimation. Et si nous ne pouvons pas vous aider, nous vous le disons franchement."],
  ["Suis-je obligé de vendre ensuite ?", "Absolument pas. Beaucoup de propriétaires estiment leur bien par curiosité ou pour un projet à deux ans."],
  ["Pourquoi une photo de chaque pièce ?", "Parce que c'est ce qui remplace la visite : les photos permettent à votre négociateur d'apprécier l'état, la luminosité, le standing et les prestations réels — ce qui fait vraiment la valeur d'un bien."],
  ["Comment est calculée l'estimation ?", "Votre négociateur part des ventes réelles proches de chez vous (données DVF, enregistrées chez le notaire), corrigées de la surface et actualisées au marché actuel, puis intègre les caractéristiques et les photos de votre bien."],
  ["Mes données sont-elles protégées ?", "Vos informations servent uniquement à préparer votre estimation et à vous recontacter. Elles ne sont jamais revendues."],
];

export default function LandingEstimation() {
  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="wrap inner">
          <p className="eyebrow">Century 21 Icaza Immobilier · Estimation offerte</p>
          <h1>Votre estimation, préparée par un négociateur — <span className="it">sans qu&apos;il se déplace</span>.</h1>
          <p className="sub">Combien vaut réellement votre bien, dans votre rue ?</p>
          <p className="lede">
            Renseignez votre logement et ajoutez une photo de chaque pièce : cela suffit à votre
            négociateur Century 21 Icaza pour <b>analyser et référencer votre bien sans se déplacer
            chez vous</b>. Il vous <b>appelle</b> et vous <b>envoie votre estimation complète par
            mail</b> — un dossier argumenté, fondé sur les ventes réelles de votre secteur.
          </p>
          <div className="cta-row">
            <Link href="/estimation/commencer" className="btn btn-gold btn-lg">
              Estimer mon bien gratuitement <span className="arw">→</span>
            </Link>
          </div>
          <p className="reassure"><b>Sans déplacement</b> • Appel + dossier par mail sous 3h • Gratuit et sans engagement</p>
        </div>
      </section>

      {/* STATS / CRÉDIBILITÉ */}
      <section className="statband">
        <div className="wrap stats">
          {STATS.map((s) => (
            <div className="stat" key={s.l}><div className="stat-n">{s.n}</div><div className="stat-l">{s.l}</div></div>
          ))}
        </div>
      </section>

      {/* PLUS QU'UN PRIX AU M² */}
      <section className="band" id="methode">
        <div className="wrap">
          <div className="sec-head">
            <p className="eyebrow">Notre méthode</p>
            <h2>Bien plus qu&apos;un simple prix au m²</h2>
            <p className="muted">
              Deux logements à la même adresse, de même surface et avec le même nombre de pièces
              peuvent avoir des valeurs très différentes. Notre analyse prend en compte ce qui fait
              vraiment la valeur de votre bien.
            </p>
          </div>
          <div className="facteurs">
            {FACTEURS.map((f) => <span key={f} className="facteur">{f}</span>)}
          </div>
        </div>
      </section>

      {/* LA BASE DVF */}
      <section className="band" style={{ background: "var(--pub-surface-2)" }}>
        <div className="wrap">
          <div className="grid cols-2" style={{ alignItems: "center" }}>
            <div>
              <p className="eyebrow">Des chiffres, pas des promesses</p>
              <h2 style={{ fontSize: "clamp(26px,3.6vw,38px)", margin: "14px 0 16px" }}>La base officielle des ventes réelles (DVF)</h2>
              <p className="muted">
                Le fichier DVF recense l&apos;intégralité des ventes immobilières <b>réellement
                enregistrées chez le notaire</b>. Ce sont de vrais prix de transaction — pas une
                estimation d&apos;algorithme, pas une annonce affichée qui ne s&apos;est peut-être jamais vendue.
              </p>
              <p className="muted" style={{ marginTop: 12 }}>
                Nous privilégions les ventes de <b>votre rue</b>, puis de votre secteur immédiat, en
                les corrigeant de la surface et en les actualisant au marché d&apos;aujourd&apos;hui.
              </p>
            </div>
            <div className="card">
              <div className="ic">✓</div>
              <h3>Prix réels signés</h3>
              <p style={{ marginBottom: 14 }}>Les transactions actées chez le notaire, pas des prix d&apos;annonce.</p>
              <h3>Priorité à la proximité</h3>
              <p style={{ marginBottom: 14 }}>Votre rue d&apos;abord, puis les environs immédiats.</p>
              <h3>Actualisation marché</h3>
              <p>Les ventes anciennes sont réajustées au marché actuel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA FONCTIONNE */}
      <section className="band dark" id="fonctionnement">
        <div className="wrap">
          <div className="sec-head">
            <p className="eyebrow">Comment ça marche</p>
            <h2>Votre estimation, sans quitter votre canapé</h2>
            <p className="muted">Quelques minutes pour vous, tout le travail pour votre négociateur — sans déplacement.</p>
          </div>
          <div className="steps">
            {ETAPES.map((e, i) => (
              <div className="step" key={e.t}>
                <div className="no">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <h3 style={{ color: "#f5efe1" }}>{e.t}</h3>
                  <p style={{ color: "#bcb096" }}>{e.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 44 }}>
            <Link href="/estimation/commencer" className="btn btn-gold btn-lg">Commencer mon estimation <span className="arw">→</span></Link>
          </div>
        </div>
      </section>

      {/* CE QUE VOUS RECEVEZ */}
      <section className="band">
        <div className="wrap">
          <div className="sec-head">
            <p className="eyebrow">Votre dossier</p>
            <h2>Ce que vous recevez, sous 3h</h2>
          </div>
          <div className="grid cols-2">
            {RECOIT.map(([t, d]) => (
              <div className="card" key={t}><h3>{t}</h3><p>{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* EXEMPLE DE DOSSIER */}
      <section className="band" style={{ background: "var(--pub-surface-2)" }}>
        <div className="wrap-narrow">
          <div className="sec-head" style={{ marginBottom: 26 }}>
            <p className="eyebrow">À quoi ça ressemble</p>
            <h2>Un exemple d&apos;avis de valeur</h2>
          </div>
          <div className="sample">
            <div className="sample-top">
              <div>
                <div className="sample-bien">Maison T5 · 124 m² · Sausset-les-Pins</div>
                <div className="sample-range money">412 000 € — 438 000 €</div>
                <div className="sample-ref money">Valeur retenue : 425 000 €</div>
              </div>
              <div className="sample-seal">C21</div>
            </div>
            <div className="sample-refs">
              <div className="sample-refs-h">Comparables — ventes réelles (DVF)</div>
              {COMPARABLES.map(([loc, d, s, p]) => (
                <div className="sample-ref-row" key={loc}>
                  <span>{loc}</span><span className="sample-muted">{d}</span><span className="sample-muted">{s}</span><span className="money" style={{ fontWeight: 600 }}>{p}</span>
                </div>
              ))}
            </div>
            <p className="sample-note">Exemple illustratif. Votre dossier est personnalisé selon votre bien et les ventes réelles de votre secteur.</p>
          </div>
        </div>
      </section>

      {/* IMPORTANCE DES INFORMATIONS */}
      <section className="band">
        <div className="wrap">
          <div className="grid cols-2" style={{ alignItems: "center" }}>
            <div>
              <p className="eyebrow">Précision</p>
              <h2 style={{ fontSize: "clamp(26px,3.6vw,36px)", margin: "14px 0 16px" }}>La précision commence par vos informations</h2>
              <p className="muted">
                Pour obtenir le dossier le plus complet possible, il est essentiel de renseigner
                précisément toutes les informations demandées.
              </p>
            </div>
            <div className="card">
              <p style={{ margin: 0, fontFamily: "var(--font-display), serif", fontSize: 18 }}>
                Appartement 80 m² rénové, terrasse, garage, belle exposition
              </p>
              <p style={{ textAlign: "center", color: "var(--pub-gold)", fontFamily: "var(--font-display), serif", fontSize: 22, margin: "12px 0" }}>≠</p>
              <p style={{ margin: 0, fontFamily: "var(--font-display), serif", fontSize: 18 }}>
                Appartement 80 m² à rénover, sans extérieur ni stationnement
              </p>
              <p style={{ margin: "16px 0 0", color: "var(--pub-ink-faint)", fontSize: 14 }}>
                Même adresse. Même surface. Mais pas la même valeur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IMPORTANCE DES PHOTOS */}
      <section className="band" id="photos" style={{ background: "var(--pub-surface-2)" }}>
        <div className="wrap">
          <div className="sec-head">
            <p className="eyebrow">Vos photos</p>
            <h2>Une photo de chaque pièce remplace la visite</h2>
            <p className="muted">
              C&apos;est le cœur de la méthode : vos photos permettent à votre négociateur d&apos;apprécier,
              à distance, l&apos;état général, le niveau de rénovation, la qualité des prestations, la
              luminosité, le standing, les extérieurs et le potentiel de votre bien — comme s&apos;il y était.
            </p>
          </div>
          <div className="grid cols-2">
            <div className="card">
              <div className="ic">◱</div>
              <h3>Appartement</h3>
              <p>Séjour, cuisine, chambres, salle de bains, balcon ou terrasse, vue, et parties communes si pertinentes.</p>
            </div>
            <div className="card">
              <div className="ic">⌂</div>
              <h3>Maison</h3>
              <p>Façade, séjour, cuisine, chambres, salle de bains, jardin, terrasse, piscine, dépendances et vue.</p>
            </div>
          </div>
          <p className="muted" style={{ marginTop: 22, fontSize: 15 }}>
            Pas besoin de photos professionnelles — simplement des photos nettes, suffisamment
            lumineuses et représentatives. <b style={{ color: "var(--pub-gold-deep,#8c7233)" }}>Idéalement, une photo de chaque pièce : c&apos;est ce qui évite la visite.</b>
          </p>
        </div>
      </section>

      {/* L'ERREUR QUI COÛTE LE PLUS CHER */}
      <section className="band dark">
        <div className="wrap-narrow">
          <div className="sec-head" style={{ marginBottom: 34 }}>
            <p className="eyebrow">À éviter absolument</p>
            <h2>L&apos;erreur qui coûte le plus cher : surévaluer</h2>
            <p className="muted">Un prix de départ trop élevé fait perdre du temps… et de l&apos;argent.</p>
          </div>
          <div className="timeline">
            <div className="tl-row"><div className="tl-when">Mois 1</div><div className="tl-what"><b>Affiché trop cher</b> → très peu de visites, le bien est ignoré des acheteurs.</div></div>
            <div className="tl-row"><div className="tl-when">Mois 2–3</div><div className="tl-what"><b>Baisse de prix urgente</b> → signal négatif : « pourquoi ne se vend-il pas ? »</div></div>
            <div className="tl-row"><div className="tl-when">Mois 4 +</div><div className="tl-what"><b>Vente sous le prix du marché</b> → le bien a « brûlé », les acheteurs négocient à la baisse.</div></div>
          </div>
          <p className="muted" style={{ textAlign: "center", marginTop: 30, fontFamily: "var(--font-display), serif", fontSize: 20, color: "#f5efe1" }}>
            Le bon prix, dès le départ, vend plus vite — et plus cher.
          </p>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="band">
        <div className="wrap">
          <div className="sec-head" style={{ maxWidth: 720 }}>
            <p className="eyebrow">Ils nous ont fait confiance</p>
            <h2>4,9 / 5 <span style={{ color: "var(--pub-gold)" }}>★★★★★</span></h2>
            <p className="muted">D&apos;après les avis clients vérifiés de l&apos;agence.</p>
          </div>
          <div className="grid cols-2">
            {TEMOIGNAGES.map((t) => (
              <div className="temoin" key={t.n}>
                <div className="temoin-stars">★★★★★</div>
                <p className="temoin-txt">« {t.t} »</p>
                <div className="temoin-who"><b>{t.n}</b> — {t.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="band" id="faq" style={{ background: "var(--pub-surface-2)" }}>
        <div className="wrap-narrow">
          <div className="sec-head" style={{ marginBottom: 30 }}>
            <p className="eyebrow">Questions fréquentes</p>
            <h2>Tout ce que vous devez savoir</h2>
          </div>
          <div className="faq">
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION FINALE */}
      <section className="band dark">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(28px,4.4vw,44px)", maxWidth: "20ch", margin: "0 auto 18px", color: "#f5efe1" }}>
            Prêt à découvrir la vraie valeur de votre bien ?
          </h2>
          <p className="muted" style={{ maxWidth: "54ch", margin: "0 auto 20px", color: "#bcb096" }}>
            Prenez quelques minutes pour décrire précisément votre logement. Plus votre dossier est
            complet, plus notre analyse est pertinente.
          </p>
          <div className="engagements">
            <span>Zéro pression commerciale</span><span>Données sécurisées</span><span>Sans engagement</span>
          </div>
          <Link href="/estimation/commencer" className="btn btn-gold btn-lg" style={{ marginTop: 26 }}>Commencer mon estimation <span className="arw">→</span></Link>
          <p className="reassure" style={{ color: "#8a805f" }}>Rejoignez les 1 200 propriétaires déjà estimés sur la Côte Bleue.</p>
        </div>
      </section>
    </main>
  );
}
