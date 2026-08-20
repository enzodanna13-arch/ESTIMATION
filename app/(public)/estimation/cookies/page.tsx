export const metadata = { title: "Cookies | Century 21 Icaza Immobilier" };

// Politique cookies. Non détaillée sur le site officiel : version standard,
// à ajuster selon les traceurs réellement déployés (mesure d'audience,
// publicité Meta/Google…).
export default function Cookies() {
  return (
    <main className="band">
      <div className="wrap-narrow legaltext">
        <p className="eyebrow">Informations</p>
        <h1 style={{ fontSize: "clamp(28px,4vw,40px)", margin: "12px 0 8px" }}>Gestion des cookies</h1>

        <h2>Qu&apos;est-ce qu&apos;un cookie ?</h2>
        <p>
          Un cookie est un petit fichier déposé sur votre appareil lors de la consultation d&apos;un
          site. Il permet notamment d&apos;assurer le bon fonctionnement du site et, le cas échéant,
          de mesurer l&apos;audience.
        </p>

        <h2>Cookies utilisés</h2>
        <ul>
          <li><b>Cookies strictement nécessaires</b> : indispensables au fonctionnement du service (sécurité, protection anti-robot). Ils ne nécessitent pas votre consentement.</li>
          <li><b>Cookies de mesure d&apos;audience et publicitaires</b> : le cas échéant, pour comprendre la fréquentation et l&apos;efficacité de nos campagnes. Ils ne sont déposés qu&apos;avec votre consentement.</li>
        </ul>

        <h2>Votre choix</h2>
        <p>
          Vous pouvez à tout moment configurer votre navigateur pour accepter, bloquer ou supprimer
          les cookies. Le blocage de certains cookies peut affecter le fonctionnement du site.
        </p>

        <p className="maj">Document susceptible d&apos;être complété selon les traceurs réellement déployés.</p>
      </div>
    </main>
  );
}
