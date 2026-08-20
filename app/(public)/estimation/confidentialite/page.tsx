export const metadata = { title: "Politique de confidentialité | Century 21 Icaza Immobilier" };

// Contenu RGPD à fournir par l'agence — volontairement NON inventé.
export default function Confidentialite() {
  return (
    <main className="band">
      <div className="wrap-narrow">
        <p className="eyebrow">Données personnelles</p>
        <h1 style={{ fontSize: "clamp(28px,4vw,40px)", margin: "12px 0 20px" }}>Politique de confidentialité</h1>
        <p className="muted">
          La politique de protection des données personnelles (finalités, base légale, durée de
          conservation, destinataires, droits d&apos;accès, de rectification et d&apos;effacement,
          coordonnées du DPO) sera publiée ici. Vos informations sont utilisées uniquement pour
          traiter votre demande d&apos;estimation et, lorsque vous le demandez, vous recontacter
          dans le cadre de votre projet immobilier.
        </p>
      </div>
    </main>
  );
}
