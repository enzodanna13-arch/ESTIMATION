import Link from "next/link";

// Landing publique : explique la démarche AVANT de lancer l'estimation.
// Positionnement « nouvelle génération », sans promesse invérifiable.

const FACTEURS = [
  "Étage", "Exposition", "Vue", "État", "Rénovation", "Prestations", "Terrasse",
  "Jardin", "Terrain", "Garage", "Parking", "Piscine", "Luminosité", "Nuisances", "Configuration",
];

const ETAPES = [
  { t: "Localisez votre bien", d: "L'adresse précise conditionne la recherche des ventes de référence les plus proches." },
  { t: "Décrivez votre logement", d: "Surface, pièces, chambres, terrain, prestations, équipements, état." },
  { t: "Ajoutez vos photos", d: "Elles améliorent considérablement la compréhension de votre logement." },
  { t: "Nous analysons les données", d: "Marché, transactions et références réellement disponibles autour de vous." },
  { t: "Analyse de votre bien", d: "Croisement de ses caractéristiques et de vos photos." },
  { t: "Recevez votre dossier", d: "Une estimation complète et personnalisée, à consulter et télécharger." },
];

const FAQ = [
  ["L'estimation est-elle gratuite ?", "Oui, totalement gratuite et sans engagement."],
  ["Suis-je obligé de vendre ?", "Non. Vous êtes libre : l'outil vous donne la valeur de votre bien, rien de plus."],
  ["Pourquoi avez-vous besoin de photos ?", "Les photos permettent d'apprécier l'état, la luminosité et le standing réels de votre logement — deux biens identiques sur le papier n'ont pas la même valeur."],
  ["Combien de photos dois-je envoyer ?", "Quelques photos nettes et représentatives suffisent. Plus votre dossier est complet, plus l'analyse est pertinente."],
  ["Comment est calculée l'estimation ?", "Nous partons des ventes réelles proches de chez vous (données publiques DVF), corrigées de la surface et actualisées au marché actuel, puis nous analysons les caractéristiques et les photos de votre bien."],
  ["Quelle différence avec un simulateur en ligne classique ?", "Un simulateur applique un simple prix au m² moyen. Ici, nous privilégions les ventes les plus proches et intégrons l'état et les prestations de votre bien."],
  ["Puis-je demander l'avis d'un conseiller ?", "Oui. À la fin de votre dossier, vous pouvez être rappelé par un conseiller Century 21 Icaza."],
  ["Mes données sont-elles protégées ?", "Vos informations servent uniquement à traiter votre demande d'estimation et, si vous le souhaitez, à vous recontacter."],
];

export default function LandingEstimation() {
  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="wrap inner">
          <p className="eyebrow">Century 21 Icaza Immobilier</p>
          <h1>Votre bien mérite plus qu&apos;un simple <span className="it">prix au m²</span>.</h1>
          <p className="sub">Découvrez sa valeur grâce à notre outil d&apos;estimation immobilière nouvelle génération.</p>
          <p className="lede">
            Notre outil analyse les informations détaillées de votre logement, sa localisation, les
            données immobilières disponibles et les photos de votre bien afin de produire une
            estimation personnalisée accompagnée d&apos;un dossier complet.
          </p>
          <div className="cta-row">
            <Link href="/estimation/commencer" className="btn btn-gold btn-lg">
              Commencer mon estimation <span className="arw">→</span>
            </Link>
          </div>
          <p className="reassure"><b>Gratuit</b> • Sans engagement • Dossier personnalisé</p>
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

      {/* COMMENT ÇA FONCTIONNE */}
      <section className="band dark" id="fonctionnement">
        <div className="wrap">
          <div className="sec-head">
            <p className="eyebrow">Comment ça marche</p>
            <h2>Six étapes vers la valeur de votre bien</h2>
          </div>
          <div className="steps">
            {ETAPES.map((e) => (
              <div className="step" key={e.t}>
                <div className="no">{String(ETAPES.indexOf(e) + 1).padStart(2, "0")}</div>
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
            <h2>Les photos sont essentielles à votre estimation</h2>
            <p className="muted">
              Elles permettent à notre système de mieux comprendre votre logement : état général,
              niveau de rénovation, qualité des prestations, luminosité, standing, extérieurs et
              potentiel du bien.
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
            lumineuses et représentatives. <b style={{ color: "var(--pub-gold-deep,#8c7233)" }}>Ajoutez-en plusieurs pour un dossier le plus complet possible.</b>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="band" id="faq">
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
          <h2 style={{ fontSize: "clamp(28px,4.4vw,44px)", maxWidth: "18ch", margin: "0 auto 18px", color: "#f5efe1" }}>
            Prêt à découvrir la valeur de votre bien ?
          </h2>
          <p className="muted" style={{ maxWidth: "52ch", margin: "0 auto 30px", color: "#bcb096" }}>
            Prenez quelques minutes pour décrire précisément votre logement. Plus votre dossier est
            complet, plus notre analyse pourra être pertinente.
          </p>
          <Link href="/estimation/commencer" className="btn btn-gold btn-lg">Commencer mon estimation <span className="arw">→</span></Link>
          <p className="reassure" style={{ color: "#8a805f" }}>Gratuit • Sans engagement</p>
        </div>
      </section>
    </main>
  );
}
