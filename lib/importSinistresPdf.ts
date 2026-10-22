import { PDFDocument } from "pdf-lib";
import { compresserDocument } from "./compressDoc";
import type { Sinistre } from "./serverSinistres";

// IMPORT d'un PDF « Ouvertures de sinistres » (modèle Service Syndic Icaza) :
// on détecte chaque lettre de déclaration, on regroupe ses pages (lettre +
// annexe photos), on en extrait les champs et on découpe un PDF par
// copropriété. Tout se fait côté navigateur (aucune donnée client en dépôt).

export interface SinistreImporte {
  champs: Partial<Sinistre>;
  pages: number[];      // pages source (1-based)
  pdfBase64: string;    // tranche PDF compressée (base64, sans préfixe)
  taille: number;       // octets de la tranche
  garder: boolean;      // coché dans l'écran de revue
}

// ---- pdf.js (extraction de texte) ----
let pdfjsP: Promise<typeof import("pdfjs-dist")> | null = null;
async function pdfjs() {
  if (!pdfjsP) pdfjsP = (async () => {
    const m = await import("pdfjs-dist");
    const cdn = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${m.version}/pdf.worker.min.mjs`;
    try { m.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString(); }
    catch { m.GlobalWorkerOptions.workerSrc = cdn; }
    return m;
  })();
  return pdfjsP;
}

// Reconstruit les lignes de texte d'une page à partir des positions pdf.js.
async function lignesPage(doc: Awaited<ReturnType<Awaited<ReturnType<typeof pdfjs>>["getDocument"]>["promise"]>, n: number): Promise<string[]> {
  const page = await doc.getPage(n);
  const tc = await page.getTextContent();
  const items = (tc.items as Array<{ str: string; transform: number[] }>).filter((it) => it.str !== undefined);
  const brut = items.map((it) => ({ x: it.transform[4], y: it.transform[5], s: it.str }));
  brut.sort((a, b) => b.y - a.y || a.x - b.x);
  const lignes: string[] = [];
  let curY: number | null = null; let cur = "";
  for (const it of brut) {
    if (curY === null || Math.abs(it.y - curY) <= 3) { cur += (cur ? " " : "") + it.s; curY = curY ?? it.y; }
    else { lignes.push(cur.replace(/\s+/g, " ").trim()); cur = it.s; curY = it.y; }
  }
  if (cur) lignes.push(cur.replace(/\s+/g, " ").trim());
  return lignes.filter((l) => l.length > 0);
}

const u8ToB64 = (u8: Uint8Array): string => {
  let bin = ""; const CH = 0x8000;
  for (let i = 0; i < u8.length; i += CH) bin += String.fromCharCode(...u8.subarray(i, i + CH));
  return btoa(bin);
};

// Coordonnées publiques des principaux assureurs/courtiers du modèle (adresses
// professionnelles — aucune donnée personnelle). Permet de pré-remplir le bloc
// « assurance » proprement à l'import.
const ASSUREURS: { cle: RegExp; nom: string; adresse: string }[] = [
  { cle: /GALIAN|SMABTP/i, nom: "Galian SMABTP", adresse: "89 rue La Boétie\n75008 Paris" },
  { cle: /SET ASSURANCES/i, nom: "SET Assurances", adresse: "20-24 avenue de Canteranne\n33608 Pessac Cedex" },
  { cle: /AREAS/i, nom: "Areas", adresse: "30 boulevard Mongin\n13500 Martigues" },
  { cle: /SATEC/i, nom: "SATEC", adresse: "Immeuble Le Hub\n4 place du 8 mai 1945 – CS 90168\n92532 Levallois Perret Cedex" },
  { cle: /GENERALI|LF COURTAGE/i, nom: "Generali (LF Courtage)", adresse: "c/o LF Courtage\n22 impasse Henri Dunant\n13920 Saint-Mitre-les-Remparts" },
];

function motifDepuis(texte: string): string {
  const t = texte.toLowerCase();
  if (/coul[ée]e de boue|[ée]boulement|glissement de terrain|mur de sout[èe]nement/.test(t)) return "Catastrophe naturelle";
  if (/inondation/.test(t)) return "Inondation";
  if (/d[ée]g[âa]ts? des eaux|infiltration/.test(t)) return "Dégât des eaux";
  return "Catastrophe naturelle";
}

const MOIS: Record<string, string> = { janvier: "01", février: "02", fevrier: "02", mars: "03", avril: "04", mai: "05", juin: "06", juillet: "07", août: "08", aout: "08", septembre: "09", octobre: "10", novembre: "11", décembre: "12", decembre: "12" };
function dateEvenement(texte: string): string {
  const m = texte.match(/pluies\s+(?:survenues\s+)?(?:du\s+)?(\d{1,2})\s+([A-Za-zéûô]+)\s+(\d{4})/i);
  if (m && MOIS[m[2].toLowerCase()]) return `${m[3]}-${MOIS[m[2].toLowerCase()]}-${m[1].padStart(2, "0")}`;
  return "";
}

// Analyse le texte d'une lettre et en déduit les champs du sinistre.
function champsDepuisLettre(lignes: string[]): Partial<Sinistre> {
  const texte = lignes.join("\n");
  const champs: Partial<Sinistre> = { statut: "Déclaration envoyée", qualite: "Syndic de copropriété", signataire: "CENTURY 21 ICAZA Immobilier" };

  const lrar = texte.match(/LRAR\s+([A-Za-z0-9]{6,})/);
  if (lrar) champs.reference = lrar[1];

  // Bloc copropriété : lignes entre « Copropriété : » et « Contrat »
  const iCop = lignes.findIndex((l) => /^Copropri[ée]t[ée]\s*:?/i.test(l));
  if (iCop >= 0) {
    const bloc: string[] = [];
    for (let i = iCop + 1; i < lignes.length; i++) {
      if (/^Contrat/i.test(lignes[i]) || /^Objet/i.test(lignes[i])) break;
      // Ligne « Copropriété : NOM » collée ?
      bloc.push(lignes[i]);
      if (bloc.length >= 3) break;
    }
    // Cas « Copropriété : NOM » sur la même ligne
    const inline = lignes[iCop].replace(/^Copropri[ée]t[ée]\s*:?\s*/i, "").trim();
    if (inline && bloc.length === 0) bloc.push(inline);
    else if (inline) bloc.unshift(inline);
    if (bloc.length) {
      const premiere = bloc[0];
      const sep = premiere.split(/\s+[–-]\s+/);
      champs.coproNom = sep[0].trim();
      const rue = sep.slice(1).join(" - ").trim();
      const reste = bloc.slice(1).map((x) => x.trim()).filter(Boolean);
      champs.coproAdresse = [rue, ...reste].filter(Boolean).join(", ");
    }
  }

  const contrat = texte.match(/Contrat\b([^\n]*?)n[°º]\s*:?\s*([A-Za-z0-9/]+)/i);
  if (contrat) champs.assurancePolice = contrat[2].trim();

  // Assureur : d'abord l'indice « Contrat <Assureur> n° », sinon le bloc
  // destinataire (en-tête, AVANT « Martigues, le ») — on exclut ainsi le pied
  // de page agence (« Garantie financière GALIAN… ») présent partout.
  let assureur: typeof ASSUREURS[number] | null = null;
  const hint = contrat?.[1]?.trim();
  if (hint) assureur = ASSUREURS.find((a) => a.cle.test(hint)) ?? null;
  if (!assureur) {
    const iDate = lignes.findIndex((l) => /Martigues,\s*le\s/i.test(l));
    const entete = (iDate > 0 ? lignes.slice(0, iDate) : lignes.slice(0, 12)).join("\n");
    assureur = ASSUREURS.find((a) => a.cle.test(entete)) ?? null;
  }
  if (assureur) { champs.assureur = assureur.nom; champs.assuranceAdresse = assureur.adresse; }

  const objet = texte.match(/Objet\s*:\s*([^\n]+)/i);
  const objetTxt = objet ? objet[1].replace(/^D[ée]claration\s+(de sinistre\s*[–-]?\s*)?/i, "").trim() : "";
  champs.motif = motifDepuis(`${objetTxt} ${texte}`);
  if (objetTxt) champs.description = objetTxt.charAt(0).toUpperCase() + objetTxt.slice(1);

  const d = dateEvenement(texte);
  if (d) champs.dateSinistre = d;

  const sign = texte.match(/gestionnaire de copropri[ée]t[ée]\s+([A-ZÉÈÀ][\wéèàûô'’-]+\s+[A-ZÉÈÀ][\wéèàûô'’-]+)/);
  if (sign) champs.signataire = sign[1].trim();

  return champs;
}

// Point d'entrée : analyse le PDF complet et renvoie un sinistre par lettre.
export async function analyserPdfOuvertures(file: File, onEtape?: (fait: number, total: number) => void): Promise<SinistreImporte[]> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const m = await pdfjs();
  const doc = await m.getDocument({ data: bytes.slice() }).promise;
  const nb = doc.numPages;

  // 1) Lire le texte de chaque page + repérer les débuts de lettre.
  const lignesParPage: string[][] = [];
  const estDebut: boolean[] = [];
  for (let n = 1; n <= nb; n++) {
    const lignes = await lignesPage(doc, n);
    const t = lignes.join("\n");
    lignesParPage.push(lignes);
    estDebut.push(/LRAR\s+[A-Za-z0-9]{6,}/.test(t) && /Objet\s*:/i.test(t));
  }
  await doc.destroy();

  // 2) Regrouper les pages par lettre.
  const groupes: number[][] = [];
  for (let n = 1; n <= nb; n++) {
    if (estDebut[n - 1]) groupes.push([n]);
    else if (groupes.length) groupes[groupes.length - 1].push(n);
  }

  // 3) Découper le PDF + extraire les champs.
  const estAnnexe = (lignes: string[]) => /ANNEXE|PHOTOS DU SINISTRE/i.test(lignes.join("\n"));
  const src = await PDFDocument.load(bytes);
  const out: SinistreImporte[] = [];
  let fait = 0;
  for (const pages of groupes) {
    // Champs extraits des pages « lettre » du groupe (hors annexes photos).
    const lignesLettre = pages.filter((p) => !estAnnexe(lignesParPage[p - 1])).flatMap((p) => lignesParPage[p - 1]);
    const champs = champsDepuisLettre(lignesLettre.length ? lignesLettre : lignesParPage[pages[0] - 1]);
    const slice = await PDFDocument.create();
    const copies = await slice.copyPages(src, pages.map((p) => p - 1));
    copies.forEach((pg) => slice.addPage(pg));
    let octets = await slice.save({ useObjectStreams: true });
    let b64 = u8ToB64(octets);
    // Si la tranche est trop lourde pour l'upload, on la recompresse.
    if (b64.length > 3_600_000) {
      const f = new File([new Uint8Array(octets)], "tranche.pdf", { type: "application/pdf" });
      const piece = await compresserDocument(f, 2800);
      b64 = piece.data; octets = new Uint8Array(0);
    }
    out.push({ champs, pages, pdfBase64: b64, taille: Math.round((b64.length * 3) / 4), garder: true });
    onEtape?.(++fait, groupes.length);
  }
  return out;
}
