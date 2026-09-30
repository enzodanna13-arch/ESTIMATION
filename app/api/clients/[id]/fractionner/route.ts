import Anthropic from "@anthropic-ai/sdk";
import { verifierAccesEquipe } from "@/lib/historyAuth";
import {
  addClientPdfsServer,
  deleteClientImport,
  getClientImportBytes,
  CATEGORIES_PIECES,
} from "@/lib/serverHistory";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Fractionnement IA d'un dossier PDF combiné : le négociateur dépose UN PDF
// contenant toutes les pièces d'un client (mandat + diagnostics + titre…),
// l'IA analyse chaque page, détermine à quel document elle appartient, et on
// découpe le PDF en une pièce par document, chacune classée automatiquement.

interface Segment {
  debut: number; // page 1-indexée incluse
  fin: number; // page 1-indexée incluse
  categorie: string;
  titre: string;
}

const CATS = CATEGORIES_PIECES as readonly string[];

function normaliserCategorie(c: unknown): string {
  const v = typeof c === "string" ? c.trim() : "";
  if (CATS.includes(v)) return v;
  // Tolérance sur quelques libellés proches renvoyés par l'IA.
  const bas = v.toLowerCase();
  if (/dpe|diagnostic|amiante|plomb|électric|electric|gaz|carrez|termite|erp|état des risques/.test(bas)) return "Diagnostics";
  if (/mandat/.test(bas)) return "Mandat";
  if (/titre|propriété|propriete|notari/.test(bas)) return "Titre de propriété";
  if (/identité|identite|cni|passeport|carte d'identité/.test(bas)) return "Pièce d'identité";
  if (/tracfin|lcb|blanchiment/.test(bas)) return "Tracfin";
  if (/taxe fonci/.test(bas)) return "Taxe foncière";
  if (/assemblée|assemblee|\bag\b|pv /.test(bas)) return "PV d'AG";
  if (/appel de fonds/.test(bas)) return "Appel de fonds";
  if (/bon de visite/.test(bas)) return "Bon de visite";
  if (/offre/.test(bas)) return "Offre d'achat";
  return "Autre";
}

function nettoyerNom(titre: string, categorie: string, debut: number, fin: number): string {
  let t = (titre || "").replace(/[\\/:*?"<>|\r\n]+/g, " ").trim().slice(0, 120);
  if (!t) t = categorie;
  const pages = debut === fin ? `p.${debut}` : `p.${debut}-${fin}`;
  return `${t} (${pages}).pdf`;
}

async function classifierPages(pdfB64: string, nbPages: number): Promise<{ segments: Segment[]; blanches: number[] } | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  const client = new Anthropic();
  const consigne = [
    `Ce PDF de ${nbPages} page(s) est un dossier de vente immobilière : il CONCATÈNE plusieurs documents distincts d'un même client.`,
    "Analyse CHAQUE page et découpe le dossier en documents individuels.",
    "Pour chaque document, renvoie un segment { debut, fin, categorie, titre } :",
    "- debut / fin : numéros de page 1-indexés INCLUS (première et dernière page du document).",
    "- categorie : STRICTEMENT l'une de cette liste : " + CATS.join(", ") + ".",
    "- titre : intitulé court et lisible du document (ex. « Mandat de vente exclusif », « DPE + diagnostics », « Titre de propriété »).",
    "RÈGLES :",
    "- Les segments doivent couvrir TOUTES les pages de 1 à " + nbPages + ", être CONTIGUS, sans chevauchement ni trou, dans l'ordre.",
    "- Toutes les pages consécutives d'un même document restent ensemble (un rapport de diagnostics de 30 pages = UN seul segment Diagnostics).",
    "- Un lot de diagnostics (DPE, amiante, plomb, électricité, gaz, ERP, Carrez…) → une seule pièce « Diagnostics ».",
    "- Si un type ne correspond à aucune catégorie de la liste, mets « Autre ».",
    "PAGES BLANCHES : liste dans « pagesBlanches » les numéros des pages RÉELLEMENT vides (aucun texte, aucune signature, aucun tampon, aucune image utile ; pages de séparation ou versos vides). En cas de doute, NE mets PAS la page en blanche. Ces pages restent DANS les segments (pour la numérotation) mais seront retirées du document final.",
    'Réponds EXCLUSIVEMENT par un JSON : {"segments":[{"debut":1,"fin":3,"categorie":"Mandat","titre":"…"}],"pagesBlanches":[4]}',
  ].join("\n");

  const msg = await client.messages.create({
    model: process.env.SPLIT_MODEL ?? process.env.EXTRACT_MODEL ?? "claude-opus-4-8",
    max_tokens: 4096,
    system: "Tu es un assistant d'agence immobilière qui trie les pièces d'un dossier de vente. Tu réponds uniquement par du JSON conforme, sans commentaire.",
    messages: [
      {
        role: "user",
        content: [
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: pdfB64 } },
          { type: "text", text: consigne },
        ],
      },
    ],
  });
  const txt = msg.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("");
  const s = txt.indexOf("{"), e = txt.lastIndexOf("}");
  if (s < 0 || e <= s) return null;
  let brut: { segments?: unknown; pagesBlanches?: unknown };
  try {
    brut = JSON.parse(txt.slice(s, e + 1));
  } catch {
    return null;
  }
  if (!Array.isArray(brut.segments)) return null;
  const segs: Segment[] = [];
  for (const it of brut.segments as Record<string, unknown>[]) {
    const debut = Math.round(Number(it.debut));
    const fin = Math.round(Number(it.fin));
    if (!Number.isFinite(debut) || !Number.isFinite(fin)) continue;
    segs.push({
      debut: Math.min(Math.max(1, debut), nbPages),
      fin: Math.min(Math.max(1, fin), nbPages),
      categorie: normaliserCategorie(it.categorie),
      titre: typeof it.titre === "string" ? it.titre : "",
    });
  }
  const blanches = Array.isArray(brut.pagesBlanches)
    ? (brut.pagesBlanches as unknown[])
        .map((n) => Math.round(Number(n)))
        .filter((n) => Number.isFinite(n) && n >= 1 && n <= nbPages)
    : [];
  return { segments: segs, blanches };
}

// Répare la couverture : segments ordonnés, contigus, sans trou ni
// chevauchement (l'IA peut se tromper d'une page ; on ne perd jamais de page).
function reparer(segs: Segment[], nbPages: number): Segment[] {
  const valides = segs.filter((s) => s.debut <= s.fin).sort((a, b) => a.debut - b.debut);
  const out: Segment[] = [];
  let curseur = 1;
  for (const s of valides) {
    const debut = Math.max(curseur, s.debut);
    if (debut > nbPages) break;
    const fin = Math.min(Math.max(debut, s.fin), nbPages);
    if (fin < debut) continue;
    out.push({ ...s, debut, fin });
    curseur = fin + 1;
  }
  // Pages finales non couvertes → rattachées au dernier segment (même document
  // probable) plutôt que perdues.
  if (curseur <= nbPages) {
    if (out.length > 0) out[out.length - 1].fin = nbPages;
    else out.push({ debut: 1, fin: nbPages, categorie: "Autre", titre: "Dossier" });
  }
  return out;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "Service d'analyse indisponible (clé IA absente)." }, { status: 503 });
  }
  const { id } = await params;
  let body: { fileId?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Corps de requête invalide" }, { status: 400 });
  }
  if (!body.fileId) return Response.json({ error: "Fichier importé manquant" }, { status: 400 });

  const buf = await getClientImportBytes(id, body.fileId);
  if (!buf) return Response.json({ error: "PDF importé introuvable — réessaie l'envoi." }, { status: 404 });

  try {
    const { PDFDocument } = await import("pdf-lib");
    const source = await PDFDocument.load(buf, { ignoreEncryption: true });
    const nbPages = source.getPageCount();
    if (nbPages === 0) {
      await deleteClientImport(id, body.fileId);
      return Response.json({ error: "PDF vide." }, { status: 400 });
    }
    if (nbPages > 100) {
      await deleteClientImport(id, body.fileId);
      return Response.json(
        { error: `Le PDF fait ${nbPages} pages : l'analyse est limitée à 100 pages. Scinde-le en deux avant l'import.` },
        { status: 413 },
      );
    }

    const pdfB64 = Buffer.from(buf).toString("base64");
    const analyse = await classifierPages(pdfB64, nbPages).catch(() => null);
    let segs = analyse?.segments ?? [];
    if (segs.length === 0) {
      // L'IA n'a rien renvoyé d'exploitable : on enregistre le dossier entier
      // comme une seule pièce « Autre » plutôt que d'échouer.
      segs = [{ debut: 1, fin: nbPages, categorie: "Autre", titre: "Dossier complet" }];
    }
    const segments = reparer(segs, nbPages);
    const blanches = new Set(analyse?.blanches ?? []); // pages 1-indexées à retirer

    // Découpe : un sous-PDF par segment, en RETIRANT les pages blanches. Un
    // segment intégralement blanc est ignoré.
    const items: { nom: string; categorie: string; bytes: Uint8Array }[] = [];
    let blanchesRetirees = 0;
    for (const seg of segments) {
      const indices: number[] = [];
      for (let p = seg.debut; p <= seg.fin; p++) {
        if (blanches.has(p)) { blanchesRetirees++; continue; }
        indices.push(p - 1);
      }
      if (indices.length === 0) continue; // tout le segment était blanc
      const sousPdf = await PDFDocument.create();
      const pages = await sousPdf.copyPages(source, indices);
      for (const pg of pages) sousPdf.addPage(pg);
      const bytes = await sousPdf.save();
      items.push({ nom: nettoyerNom(seg.titre, seg.categorie, seg.debut, seg.fin), categorie: seg.categorie, bytes });
    }

    const res = await addClientPdfsServer(id, items);
    await deleteClientImport(id, body.fileId);
    if (!res) return Response.json({ error: "Dossier introuvable" }, { status: 404 });

    return Response.json({
      dossier: res.dossier,
      ajoutees: res.ajoutees,
      blanchesRetirees,
      segments: segments.map((s) => ({ categorie: s.categorie, titre: s.titre, debut: s.debut, fin: s.fin })),
    });
  } catch (err) {
    await deleteClientImport(id, body.fileId).catch(() => {});
    const message = err instanceof Error ? err.message : "Fractionnement impossible";
    return Response.json({ error: message }, { status: 500 });
  }
}
