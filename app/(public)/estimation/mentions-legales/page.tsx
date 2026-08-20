export const metadata = { title: "Mentions légales | Century 21 Icaza Immobilier" };

// Contenu juridique à fournir par l'agence — volontairement NON inventé.
export default function MentionsLegales() {
  return (
    <main className="band">
      <div className="wrap-narrow">
        <p className="eyebrow">Informations</p>
        <h1 style={{ fontSize: "clamp(28px,4vw,40px)", margin: "12px 0 20px" }}>Mentions légales</h1>
        <p className="muted">
          Les mentions légales de Century 21 Icaza Immobilier (éditeur, SIRET, hébergeur,
          directeur de la publication) seront publiées ici. Pour toute demande, contactez votre
          agence Century 21 Icaza Immobilier.
        </p>
      </div>
    </main>
  );
}
