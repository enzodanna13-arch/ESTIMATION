import Link from "next/link";

// Pied de page public. Les libellés réutilisent l'identité Century 21 Icaza ;
// les mentions juridiques pointent vers des pages dédiées (contenu fourni par
// l'agence — jamais inventé).
export default function FooterPublic() {
  return (
    <footer className="pub-footer">
      <div className="wrap">
        <div className="cols">
          <div>
            <h4>Century 21 Icaza Immobilier</h4>
            <p style={{ color: "#cabf9f", fontSize: 14, maxWidth: "34ch", margin: 0 }}>
              La technologie au service de l&apos;expertise immobilière. Estimation, transaction,
              gestion locative et syndic.
            </p>
          </div>
          <div>
            <h4>Nos services</h4>
            <span style={{ color: "#cabf9f", fontSize: 14, display: "block", marginBottom: 9 }}>Estimation immobilière</span>
            <span style={{ color: "#cabf9f", fontSize: 14, display: "block", marginBottom: 9 }}>Transaction</span>
            <span style={{ color: "#cabf9f", fontSize: 14, display: "block", marginBottom: 9 }}>Gestion locative</span>
            <span style={{ color: "#cabf9f", fontSize: 14, display: "block" }}>Syndic</span>
          </div>
          <div>
            <h4>Informations</h4>
            <Link href="/estimation/mentions-legales">Mentions légales</Link>
            <Link href="/estimation/confidentialite">Politique de confidentialité</Link>
            <Link href="/estimation/confidentialite">Données personnelles</Link>
            <Link href="/estimation/cookies">Cookies</Link>
          </div>
        </div>
        <div className="legal">
          © {new Date().getFullYear()} Century 21 Icaza Immobilier. Chaque agence est juridiquement
          et financièrement indépendante. Estimation indicative, sans valeur d&apos;expertise.
        </div>
      </div>
    </footer>
  );
}
