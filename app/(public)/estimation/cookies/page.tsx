export const metadata = { title: "Cookies | Century 21 Icaza Immobilier" };

// Contenu à fournir par l'agence — volontairement NON inventé.
export default function Cookies() {
  return (
    <main className="band">
      <div className="wrap-narrow">
        <p className="eyebrow">Informations</p>
        <h1 style={{ fontSize: "clamp(28px,4vw,40px)", margin: "12px 0 20px" }}>Gestion des cookies</h1>
        <p className="muted">
          La politique d&apos;utilisation des cookies (mesure d&apos;audience, cookies techniques et
          publicitaires, gestion du consentement) sera publiée ici.
        </p>
      </div>
    </main>
  );
}
