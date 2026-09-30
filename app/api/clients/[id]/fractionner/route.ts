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

// L'API d'analyse PDF est limitée à 100 pages par requête : au-delà, on
// découpe le dossier en tranches de 100 pages, on analyse chacune, puis on
// recolle (un document coupé par une jointure est réassemblé). MAX_PAGES borne
// le nombre total de tranches pour rester dans la durée d'exécution.
const CHUNK = 100;
const MAX_PAGES = 300;

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

// Parse la réponse de l'IA. Tente d'abord le JSON complet ; si celui-ci est
// tronqué (réponse coupée par la limite de tokens), récupère au mieux les
// objets segment individuels et le tableau pagesBlanches — mieux vaut un
// découpage partiel qu'une tranche entièrement perdue.
function parserReponse(txt: string): { segments: unknown[]; pagesBlanches: unknown[] } | null {
  const s = txt.indexOf("{"), e = txt.lastIndexOf("}");
  if (s >= 0 && e > s) {
    try {
      const obj = JSON.parse(txt.slice(s, e + 1)) as { segments?: unknown; pagesBlanches?: unknown };
      if (Array.isArray(obj.segments)) {
        return { segments: obj.segments, pagesBlanches: Array.isArray(obj.pagesBlanches) ? obj.pagesBlanches : [] };
      }
    } catch {
      /* JSON tronqué : on passe à la récupération objet par objet ci-dessous. */
    }
  }
  // Récupération tolérante : chaque objet segment complet { ... } est isolé et
  // parsé indépendamment ; les objets incomplets (fin de réponse coupée) sont
  // ignorés sans faire échouer toute la tranche.
  const segments: unknown[] = [];
  const zoneSeg = txt.slice(txt.indexOf("[") + 1);
  for (const m of zoneSeg.matchAll(/\{[^{}]*\}/g)) {
    try {
      const o = JSON.parse(m[0]);
      if (o && typeof o === "object" && "debut" in o && "fin" in o) segments.push(o);
    } catch {
      /* objet incomplet, ignoré */
    }
  }
  if (segments.length === 0) return null;
  const blanchesMatch = txt.match(/"pagesBlanches"\s*:\s*\[([^\]]*)\]/);
  const pagesBlanches = blanchesMatch
    ? blanchesMatch[1].split(",").map((x) => Number(x.trim())).filter((n) => Number.isFinite(n))
    : [];
  return { segments, pagesBlanches };
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
    // Une tranche de 100 pages peut contenir des dizaines de documents : il faut
    // assez de tokens pour que le JSON de segments ne soit PAS tronqué (un JSON
    // tronqué = parse impossible = tranche perdue).
    max_tokens: 8192,
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
  const brut = parserReponse(txt);
  if (!brut || !Array.isArray(brut.segments)) return null;
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
    if (curseur > nbPages) break;
    // On accroche chaque segment à la fin du précédent (debut = curseur) : la
    // couverture reste contiguë depuis la page 1, sans trou ni page perdue,
    // même si l'IA a sauté une page en début de document.
    const debut = curseur;
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

// Recolle les segments coupés par une jointure de tranche : deux segments
// adjacents de MÊME catégorie dont la césure tombe pile sur une frontière de
// tranche (fin === multiple de CHUNK) sont fusionnés — un même document à
// cheval sur deux tranches n'est pas scindé en deux pièces.
function fusionnerAuxJointures(segs: Segment[], seamEnds: Set<number>): Segment[] {
  if (segs.length <= 1) return segs;
  const out: Segment[] = [{ ...segs[0] }];
  for (let i = 1; i < segs.length; i++) {
    const prev = out[out.length - 1];
    const cur = segs[i];
    if (seamEnds.has(prev.fin) && cur.debut === prev.fin + 1 && cur.categorie === prev.categorie) {
      prev.fin = cur.fin; // on prolonge, on garde le titre du premier
    } else {
      out.push({ ...cur });
    }
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
    if (nbPages > MAX_PAGES) {
      await deleteClientImport(id, body.fileId);
      return Response.json(
        { error: `Le PDF fait ${nbPages} pages : l'analyse est limitée à ${MAX_PAGES} pages. Scinde-le avant l'import.` },
        { status: 413 },
      );
    }

    // Tranches de CHUNK pages (une seule si ≤ 100). On analyse chaque tranche
    // séparément puis on recolle en numérotation globale.
    const tranches: { start: number; len: number }[] = [];
    for (let s = 1; s <= nbPages; s += CHUNK) tranches.push({ start: s, len: Math.min(CHUNK, nbPages - s + 1) });

    // Base64 de chaque tranche (le PDF entier si une seule tranche).
    const b64Tranches = await Promise.all(
      tranches.map(async (tr) => {
        if (tranches.length === 1) return Buffer.from(buf).toString("base64");
        const sub = await PDFDocument.create();
        const idx: number[] = [];
        for (let p = 0; p < tr.len; p++) idx.push(tr.start - 1 + p);
        const pages = await sub.copyPages(source, idx);
        for (const pg of pages) sub.addPage(pg);
        return Buffer.from(await sub.save()).toString("base64");
      }),
    );

    // Analyse des tranches EN PARALLÈLE (chacune ≤ 100 pages) : bien plus rapide
    // qu'en séquentiel, et on reste dans la durée d'exécution.
    const analyses = await Promise.all(
      tranches.map((tr, i) => classifierPages(b64Tranches[i], tr.len).catch(() => null)),
    );

    const allSegs: Segment[] = [];
    const blanches = new Set<number>(); // pages 1-indexées globales à retirer
    tranches.forEach((tr, i) => {
      const analyse = analyses[i];
      const decal = tr.start - 1; // page locale → globale
      const trFin = tr.start + tr.len - 1;
      if (!analyse || analyse.segments.length === 0) {
        // Tranche non analysée : repli LOCAL (une pièce « Autre » sur ses pages)
        // — on ne perd aucune page et on n'écrase pas les autres tranches.
        allSegs.push({ debut: tr.start, fin: trFin, categorie: "Autre", titre: `Dossier (p.${tr.start}-${trFin})` });
        return;
      }
      for (const sgm of analyse.segments) {
        allSegs.push({ ...sgm, debut: sgm.debut + decal, fin: sgm.fin + decal });
      }
      for (const b of analyse.blanches) blanches.add(b + decal);
    });

    let segs = allSegs;
    if (segs.length === 0) {
      // Aucune tranche exploitable : dossier entier en une seule pièce « Autre ».
      segs = [{ debut: 1, fin: nbPages, categorie: "Autre", titre: "Dossier complet" }];
    }
    const seamEnds = new Set(tranches.slice(0, -1).map((tr) => tr.start + tr.len - 1));
    const segments = fusionnerAuxJointures(reparer(segs, nbPages), seamEnds);

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
