import { AGENCE, emailNegociateur, membreDepuisNom, photoNegociateur, telNegociateurFormate } from "./equipe";
import type { Opportunite } from "./prospectionTypes";

// Flyers de prospection (module Prospection UNIQUEMENT). Template graphique fixe
// + champs dynamiques par bien. Deux A5 portrait par A4 paysage, recto-verso
// aligné pour une impression duplex « retournement sur le bord court ».

export interface FlyerData {
  numero: number;          // 1..N (numéro d'étape dans la tournée)
  total: number;           // nombre de biens de la tournée
  adresse: string;
  commune: string;
  codePostal: string;
  typeBien: string;        // libellé (« Maison individuelle »…)
  surface: number | null;
  dpe: string;             // A..G
  ges: string;             // A..G
  conso: number | null;    // kWh/m².an (énergie primaire)
  emissionGes: number | null; // kg CO2/m².an
  dateDiag: string;        // « 12 mars 2024 » (vide si inconnue)
  negoPrenom: string;
  negoNom: string;
  negoRole: string;
  negoTel: string;
  negoEmail: string;
  negoPhoto: string;
  qr: string;              // data URL du QR code
}

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
export function formatDateFr(iso: string): string {
  if (!iso) return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return "";
  const [, y, mo, d] = m;
  return `${Number(d)} ${MOIS[Number(mo) - 1] ?? ""} ${y}`.trim();
}

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? Math.round(n) : null;
}

function libelleType(t: string): string {
  const s = (t || "").toLowerCase();
  if (s === "maison") return "Maison individuelle";
  if (s === "appartement") return "Appartement";
  if (s === "immeuble") return "Immeuble";
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : "Bien";
}

// Construit les données d'un flyer à partir d'une opportunité + son négociateur.
export function flyerDepuisOpportunite(o: Opportunite, numero: number, total: number, negociateurNom: string, qr: string): FlyerData {
  const m = membreDepuisNom(negociateurNom);
  return {
    numero, total,
    adresse: o.adresse || `${o.numero} ${o.voie}`.trim(),
    commune: o.ville,
    codePostal: o.codePostal,
    typeBien: libelleType(o.typeBien),
    surface: o.surface,
    dpe: (o.dpe || "").toUpperCase().slice(0, 1),
    ges: (o.ges || "").toUpperCase().slice(0, 1),
    conso: num(o.ademe?.conso_5_usages_par_m2_ep) ?? num(o.ademe?.conso_5_usages_par_m2_ef),
    emissionGes: num(o.ademe?.emission_ges_5_usages_par_m2),
    dateDiag: formatDateFr(o.dpeDateEtablissement),
    negoPrenom: m?.prenom || (negociateurNom || "").split(/\s+/)[0] || "",
    negoNom: m?.nom || negociateurNom || "",
    negoRole: m?.role || "Conseiller immobilier",
    negoTel: telNegociateurFormate(negociateurNom) || AGENCE.tel,
    negoEmail: emailNegociateur(negociateurNom) || "",
    negoPhoto: photoNegociateur(negociateurNom) || "",
    qr,
  };
}

// Génère un vrai QR code (PNG data URL haute résolution) vers l'URL d'estimation.
export async function genererQrEstimation(): Promise<string> {
  const QR = (await import("qrcode")).default;
  return QR.toDataURL(AGENCE.estimationUrl, { width: 512, margin: 1, errorCorrectionLevel: "M", color: { dark: "#1a1a1a", light: "#ffffff" } });
}

// ---------------------------------------------------------------------------
// IMPOSITION : agencement des flyers sur les pages A4 (2 A5 portrait par A4
// paysage). Impression duplex « bord court » → le verso est en miroir
// gauche/droite du recto, pour que recto et verso d'un même flyer se
// superposent physiquement après retournement et découpe au centre.
export interface PageComposee {
  face: "recto" | "verso";
  gauche: number | null; // index du flyer (0-based) ou null (moitié blanche)
  droite: number | null;
}

export function composerPagesFlyers(nbBiens: number): PageComposee[] {
  const pages: PageComposee[] = [];
  for (let i = 0; i < nbBiens; i += 2) {
    const a = i;
    const b = i + 1 < nbBiens ? i + 1 : null;
    pages.push({ face: "recto", gauche: a, droite: b });
    // Verso : miroir gauche/droite (retournement bord court).
    pages.push({ face: "verso", gauche: b, droite: a });
  }
  return pages;
}

// Couleurs officielles des étiquettes DPE/GES A→G.
export const COULEURS_DPE: Record<string, string> = {
  A: "#319834", B: "#33cc33", C: "#cbe935", D: "#fcea36", E: "#fbba36", F: "#ee8235", G: "#e30613",
};

export function nomFichierFlyers(negociateur: string): string {
  const slug = (negociateur || "tournee").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
  const d = new Date();
  const jj = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `Tournee_Prospection_${slug}_${jj}-${mm}-${d.getFullYear()}.pdf`;
}
