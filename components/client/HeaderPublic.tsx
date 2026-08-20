import Link from "next/link";

// En-tête du site public Century 21 Icaza (sticky, discret).
export default function HeaderPublic() {
  return (
    <header className="pub-header">
      <div className="wrap inner">
        <Link href="/estimation" className="brand" aria-label="Century 21 Icaza Immobilier — accueil">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/c21/logo-icaza.png" alt="Century 21 Icaza Immobilier" />
        </Link>
        <nav className="nav">
          <a href="#methode">Notre méthode</a>
          <a href="#fonctionnement">Comment ça marche</a>
          <a href="#photos">Pourquoi les photos ?</a>
          <a href="#faq">FAQ</a>
        </nav>
        <Link href="/estimation/commencer" className="btn btn-gold">
          Estimer mon bien <span className="arw">→</span>
        </Link>
      </div>
    </header>
  );
}
