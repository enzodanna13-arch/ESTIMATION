export const metadata = { title: "Mentions légales | Century 21 Icaza Immobilier" };

// Mentions légales — informations officielles de l'agence
// (source : century21-icaza-martigues.com).
export default function MentionsLegales() {
  return (
    <main className="band">
      <div className="wrap-narrow legaltext">
        <p className="eyebrow">Informations</p>
        <h1 style={{ fontSize: "clamp(28px,4vw,40px)", margin: "12px 0 8px" }}>Mentions légales</h1>

        <h2>Éditeur du site</h2>
        <p>
          <b>CENTURY 21 Icaza Immobilier</b> — Raison sociale : ICAZA Immobilier.<br />
          SAS au capital de 25 000 €.<br />
          Siège social : 32 avenue de la Paix, 13500 Martigues.<br />
          Téléphone : 04 42 42 80 85.<br />
          RCS Aix-en-Provence — SIREN 830 042 354 00027.
        </p>

        <h2>Activité réglementée</h2>
        <p>
          Carte professionnelle « Transaction sur immeubles et fonds de commerce »
          n° 13102017000020086, délivrée par la CCI Marseille Provence (Palais de la Bourse,
          CS 21856, 13221 Marseille cedex 01).<br />
          Garantie financière : GALIAN, 89 rue de la Boétie, 75008 Paris.<br />
          Activité exercée conformément à la loi n° 70-9 du 2 janvier 1970 et au décret
          n° 72-678 du 20 juillet 1972.
        </p>

        <h2>Direction de la publication</h2>
        <p>
          Directeur de la publication et responsable de la rédaction : Jean-Baptiste Cazaruc.
        </p>

        <h2>Hébergeur</h2>
        <p>
          Naxos SAS, 59 rue Pernety, 75014 Paris — SIREN 392 913 661 RCS Nanterre —
          Tél. 01 55 95 45 00.
        </p>

        <h2>Médiation de la consommation</h2>
        <p>
          Conformément à l&apos;article L.612-1 du Code de la consommation, le client peut recourir
          gratuitement au médiateur de la consommation : Association MEDIMMOCONSO,
          1 allée du Parc de Mesemena, Bât. A, CS 25222, 44505 La Baule cedex.<br />
          Email : <a href="mailto:contact@medimmoconso.fr">contact@medimmoconso.fr</a> —
          Site : <a href="https://medimmoconso.fr/adresser-une-reclamation/" target="_blank" rel="noreferrer">medimmoconso.fr</a>.
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des éléments de ce site (textes, marques, logos, visuels) est la propriété
          de CENTURY 21 Icaza Immobilier ou de ses partenaires. Toute reproduction sans
          autorisation est interdite.
        </p>

        <p className="maj">Pour toute question, contactez l&apos;agence au 04 42 42 80 85.</p>
      </div>
    </main>
  );
}
