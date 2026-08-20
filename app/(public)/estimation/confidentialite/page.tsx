export const metadata = { title: "Politique de confidentialité | Century 21 Icaza Immobilier" };

// Politique de confidentialité / RGPD. La page officielle de l'agence ne
// détaillait pas ce volet : rédigé de façon standard et conforme, avec
// l'identité RÉELLE du responsable de traitement — à faire valider par l'agence
// / son conseil juridique avant l'ouverture publique.
export default function Confidentialite() {
  return (
    <main className="band">
      <div className="wrap-narrow legaltext">
        <p className="eyebrow">Données personnelles</p>
        <h1 style={{ fontSize: "clamp(28px,4vw,40px)", margin: "12px 0 8px" }}>Politique de confidentialité</h1>

        <h2>Responsable du traitement</h2>
        <p>
          CENTURY 21 Icaza Immobilier (ICAZA Immobilier), 32 avenue de la Paix, 13500 Martigues —
          Tél. 04 42 42 80 85.
        </p>

        <h2>Données collectées</h2>
        <p>Dans le cadre de votre demande d&apos;estimation, nous collectons :</p>
        <ul>
          <li>vos coordonnées : prénom, nom, téléphone, email ;</li>
          <li>les informations relatives à votre bien : adresse, caractéristiques, prestations, état ;</li>
          <li>les photos que vous choisissez d&apos;ajouter ;</li>
          <li>votre projet immobilier et votre éventuelle demande de rappel.</li>
        </ul>

        <h2>Finalités & base légale</h2>
        <p>
          Vos données servent uniquement à <b>préparer et vous remettre votre estimation</b>, à
          <b> vous recontacter</b> dans le cadre de votre projet lorsque vous l&apos;avez demandé, et à
          la gestion de la relation commerciale. Le traitement repose sur votre <b>consentement</b>
          et sur l&apos;<b>intérêt légitime</b> de l&apos;agence à répondre à votre demande.
        </p>

        <h2>Destinataires</h2>
        <p>
          Vos données sont destinées aux seuls collaborateurs de CENTURY 21 Icaza Immobilier. Elles
          ne sont <b>jamais revendues</b> ni cédées à des tiers à des fins commerciales.
        </p>

        <h2>Durée de conservation</h2>
        <p>
          Vos données sont conservées le temps nécessaire au traitement de votre demande, puis en
          base prospects pour une durée maximale de 3 ans à compter de notre dernier contact,
          conformément aux recommandations de la CNIL.
        </p>

        <h2>Vos droits</h2>
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, d&apos;opposition, de
          limitation et de portabilité de vos données. Pour les exercer, contactez l&apos;agence
          (32 avenue de la Paix, 13500 Martigues). Vous pouvez également introduire une réclamation
          auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noreferrer">www.cnil.fr</a>).
        </p>

        <h2>Sécurité</h2>
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour
          protéger vos données contre tout accès non autorisé.
        </p>

        <p className="maj">Document susceptible d&apos;être complété — pour toute question, contactez l&apos;agence au 04 42 42 80 85.</p>
      </div>
    </main>
  );
}
