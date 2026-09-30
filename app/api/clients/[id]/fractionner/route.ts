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

// L'API d'analyse accepte au plus 32 Mo par requête ET 100 pages. Un PDF est
// encodé en base64 pour l'envoi (+33 % de taille), donc on vise ~12 Mo de PDF
// brut par tranche (≈ 16 Mo en base64 : large marge sous 32 Mo). On découpe le
// dossier en tranches respectant CE budget de poids ET le plafond de 100 pages,
// on analyse chaque tranche, puis on recolle en numérotation globale.
const BUDGET_OCTETS = 12 * 1024 * 1024;
const MAX_PAGES_TRANCHE = 100;
const MAX_PAGES_TOTAL = 400;
const MAX_B64_OCTETS = 30 * 1024 * 1024; // garde-fou dur (une tranche au-delà est refusée)

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
    "MÉTHODE — repère le DÉBUT de chaque nouveau document grâce à : un nouveau titre/en-tête, un changement de mise en page ou de logo, une page de garde, une nouvelle numérotation « page 1/x », un changement d'émetteur (notaire, diagnostiqueur, agence, mairie). La dernière page d'un document est celle juste avant le début du suivant.",
    "RÈGLES :",
    "- Les segments doivent couvrir TOUTES les pages de 1 à " + nbPages + ", être CONTIGUS, sans chevauchement ni trou, dans l'ordre.",
    "- Toutes les pages consécutives d'un même document restent ENSEMBLE : un contrat, un rapport ou une attestation de plusieurs pages = UN SEUL segment (ne le découpe jamais page par page).",
    "- Ne FUSIONNE pas deux documents différents qui se suivent : un mandat suivi d'un titre de propriété = DEUX segments distincts, même sans page blanche entre eux.",
    "- Un lot de diagnostics (DPE, amiante, plomb, électricité, gaz, ERP, Carrez, mesurage…) qui se suivent → une seule pièce « Diagnostics », même si c'est plusieurs rapports d'affilée.",
    "- En cas d'hésitation sur la catégorie, choisis la plus probable d'après le contenu ; ne mets « Autre » QUE si aucune catégorie de la liste ne convient vraiment.",
    "- Vérifie avant de répondre : le nombre de segments doit correspondre au nombre de documents RÉELLEMENT distincts que tu as identifiés (ni trop découpé, ni trop regroupé).",
    "PAGES BLANCHES : liste dans « pagesBlanches » les numéros des pages RÉELLEMENT vides (aucun texte, aucune signature, aucun tampon, aucune image utile ; pages de séparation, versos vides). En cas de doute, NE mets PAS la page en blanche. Ces pages restent dans les segments (pour la numérotation) mais seront retirées du document final.",
    'Réponds EXCLUSIVEMENT par un JSON : {"segments":[{"debut":1,"fin":3,"categorie":"Mandat","titre":"…"}],"pagesBlanches":[4]}',
  ].join("\n");

  // Réessais sur les erreurs transitoires (surcharge 529, limite de débit 429,
  // erreurs serveur 5xx, coupures réseau) — cause n°1 des « certains dossiers
  // passent, d'autres non ». Une erreur non transitoire est relancée telle
  // quelle pour être remontée à l'utilisateur.
  let msg: Anthropic.Message | null = null;
  let derniereErreur: unknown = null;
  for (let essai = 0; essai < 3; essai++) {
    try {
      msg = await client.messages.create({
        model: process.env.SPLIT_MODEL ?? "claude-opus-4-8",
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
      break;
    } catch (e) {
      derniereErreur = e;
      const status = (e as { status?: number })?.status;
      const transitoire = status === undefined || status === 429 || status === 529 || (status >= 500 && status < 600);
      if (!transitoire || essai === 2) throw e;
      await new Promise((r) => setTimeout(r, 1500 * (essai + 1))); // 1,5 s puis 3 s
    }
  }
  if (!msg) throw derniereErreur ?? new Error("Analyse IA indisponible");
  const txt = msg.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("");
  const s = txt.indexOf("{"), e = txt.lastIndexOf("}");
  if (s < 0 || e <= s) return null;
  let brut: { segments?: unknown };
  try {
    brut = JSON.parse(txt.slice(s, e + 1));
  } catch {
    return null;
  }
  const brutObj = brut as { segments?: unknown; pagesBlanches?: unknown };
  if (!Array.isArray(brutObj.segments)) return null;
  const segs: Segment[] = [];
  for (const it of brutObj.segments as Record<string, unknown>[]) {
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
  const blanches = Array.isArray(brutObj.pagesBlanches)
    ? (brutObj.pagesBlanches as unknown[])
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

// Recolle un document coupé par une jointure de tranche : deux segments
// adjacents de MÊME catégorie dont la césure tombe pile sur une frontière de
// tranche (fin ∈ seamEnds) sont fusionnés — un même document à cheval sur deux
// tranches n'est pas scindé en deux pièces.
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
    if (nbPages > MAX_PAGES_TOTAL) {
      await deleteClientImport(id, body.fileId);
      return Response.json(
        { error: `Le PDF fait ${nbPages} pages : l'analyse est limitée à ${MAX_PAGES_TOTAL} pages. Scinde-le avant l'import.` },
        { status: 413 },
      );
    }

    // Nombre de pages par tranche pour rester sous le budget de POIDS (un PDF de
    // 25 Mo en 100 pages ≈ 250 Ko/page → ~48 pages/tranche), borné à 100 pages
    // (limite de l'API). C'est le poids, pas le nombre de pages, qui faisait
    // échouer l'analyse d'un gros dossier scanné.
    const octetsParPage = Math.max(1, Math.ceil(buf.byteLength / nbPages));
    const parBudget = Math.max(1, Math.floor(BUDGET_OCTETS / octetsParPage));
    const pagesParTranche = Math.min(MAX_PAGES_TRANCHE, parBudget);

    const tranches: { start: number; len: number }[] = [];
    for (let s = 1; s <= nbPages; s += pagesParTranche) {
      tranches.push({ start: s, len: Math.min(pagesParTranche, nbPages - s + 1) });
    }

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

    // Analyse des tranches EN PARALLÈLE, en CAPTURANT la raison exacte d'un
    // échec (au lieu de l'avaler). Une tranche trop lourde (garde-fou) ou non
    // analysée devient une pièce « Autre » sur ses propres pages : on ne perd
    // aucune page et on n'écrase pas les tranches voisines bien découpées.
    const analyses = await Promise.all(
      tranches.map(async (tr, i): Promise<{ ok: true; segs: Segment[]; blanches: number[] } | { ok: false; raison: string }> => {
        const tailleMo = (b64Tranches[i].length / 1_048_576).toFixed(0);
        if (b64Tranches[i].length > MAX_B64_OCTETS) {
          return { ok: false, raison: `tranche trop lourde (~${tailleMo} Mo une fois encodée, limite 32 Mo)` };
        }
        try {
          const r = await classifierPages(b64Tranches[i], tr.len);
          if (!r || r.segments.length === 0) return { ok: false, raison: "l'IA n'a renvoyé aucun document" };
          return { ok: true, segs: r.segments, blanches: r.blanches };
        } catch (e) {
          const status = (e as { status?: number })?.status;
          const base = e instanceof Error ? e.message : "erreur inconnue";
          return { ok: false, raison: status ? `erreur IA ${status} — ${base}` : base };
        }
      }),
    );

    const allSegs: Segment[] = [];
    const blanches = new Set<number>(); // pages 1-indexées GLOBALES à retirer
    const avertissements: string[] = [];
    tranches.forEach((tr, i) => {
      const decal = tr.start - 1; // page locale → globale
      const trFin = tr.start + tr.len - 1;
      const a = analyses[i];
      if (!a.ok) {
        const etiquette = tranches.length > 1 ? `Pages ${tr.start}–${trFin} : ` : "";
        avertissements.push(`${etiquette}${a.raison}.`);
        allSegs.push({ debut: tr.start, fin: trFin, categorie: "Autre", titre: "Dossier" });
        return;
      }
      for (const sgm of a.segs) {
        allSegs.push({ ...sgm, debut: sgm.debut + decal, fin: sgm.fin + decal });
      }
      for (const b of a.blanches) blanches.add(b + decal);
    });

    let segs = allSegs;
    if (segs.length === 0) {
      segs = [{ debut: 1, fin: nbPages, categorie: "Autre", titre: "Dossier complet" }];
    }
    const seamEnds = new Set(tranches.slice(0, -1).map((tr) => tr.start + tr.len - 1));
    const segments = fusionnerAuxJointures(reparer(segs, nbPages), seamEnds);

    // Découpe : un sous-PDF par segment, en RETIRANT les pages blanches. Un
    // segment intégralement blanc est ignoré (aucune pièce créée).
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
      avertissements,
      blanchesRetirees,
      segments: segments.map((s) => ({ categorie: s.categorie, titre: s.titre, debut: s.debut, fin: s.fin })),
    });
  } catch (err) {
    await deleteClientImport(id, body.fileId).catch(() => {});
    const message = err instanceof Error ? err.message : "Fractionnement impossible";
    return Response.json({ error: message }, { status: 500 });
  }
}
