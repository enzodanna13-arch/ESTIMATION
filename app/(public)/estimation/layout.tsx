import type { Metadata } from "next";
import "./estimation.css";
import HeaderPublic from "@/components/client/HeaderPublic";
import FooterPublic from "@/components/client/FooterPublic";

// Route group PUBLIC, isolé de l'app négociateur : accès libre (aucun mot de
// passe d'équipe), univers graphique Century 21 Icaza. Ne partage avec le Pro
// que les polices chargées globalement dans le RootLayout.
export const metadata: Metadata = {
  title: "Estimez votre bien | Century 21 Icaza Immobilier",
  description:
    "Estimation immobilière nouvelle génération : nous croisons les caractéristiques de votre logement, les données du marché et vos photos pour un dossier complet et personnalisé.",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="c21pub">
      <HeaderPublic />
      {children}
      <FooterPublic />
    </div>
  );
}
