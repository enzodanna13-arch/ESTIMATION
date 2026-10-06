import Anthropic from "@anthropic-ai/sdk";
import { verifierAccesEquipe } from "@/lib/historyAuth";
import { getTransactionFileServer, getTransactionServer, saveTransactionServer, type Transaction } from "@/lib/serverTransactions";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const MAX_DOC_OCTETS = 12 * 1024 * 1024;

function texte(v: unknown): string { return typeof v === "string" ? v.trim() : ""; }
function nombre(v: unknown): number { const n = Number(String(v).replace(/[^0-9.]/g, "")); return Number.isFinite(n) && n > 0 ? n : 0; }
function dateEnTs(s: string): number {
  const m = s.match(/(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})/);
  if (m) { const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), 12); return Number.isNaN(d.getTime()) ? 0 : d.getTime(); }
  const m2 = s.match(/(\d{4})/); // année seule
  if (m2) { const d = new Date(Number(m2[1]), 0, 1, 12); return d.getTime(); }
  return 0;
}

interface ExtraitVente {
  bien?: string; adresse?: string; ville?: string; prixVente?: unknown;
  vendeur?: string; acquereur?: string; dateVente?: string; notaire?: string;
}

async function extraire(b64: string): Promise<ExtraitVente | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  const client = new Anthropic();
  const consigne = [
    "Ce document est une attestation de propriété / attestation de vente notariée (ou l'acte de vente).",
    "Extrais les informations de la TRANSACTION IMMOBILIÈRE pour créer un dossier de vente.",
    "Renvoie EXCLUSIVEMENT ce JSON (chaîne vide si l'info est absente) :",
    "{",
    '  "bien": "type et désignation courte du bien (ex. « Maison individuelle », « Appartement T3 »)",',
    '  "adresse": "rue / voie du bien",',
    '  "ville": "commune du bien",',
    '  "prixVente": "prix de vente en euros (nombre uniquement)",',
    '  "vendeur": "nom et prénom du ou des VENDEURS (séparés par « , »)",',
    '  "acquereur": "nom et prénom du ou des ACQUÉREURS (séparés par « , »)",',
    '  "dateVente": "date de l\'acte / de la vente au format JJ/MM/AAAA",',
    '  "notaire": "nom du notaire ou de l\'étude"',
    "}",
    "N'INVENTE RIEN : laisse vide si l'information ne figure pas clairement.",
  ].join("\n");

  let msg: Anthropic.Message | null = null;
  for (let essai = 0; essai < 3; essai++) {
    try {
      msg = await client.messages.create({
        model: process.env.EXTRACT_MODEL ?? "claude-sonnet-5",
        max_tokens: 1024,
        system: "Tu es un assistant d'agence immobilière. Tu extrais des données d'actes et réponds uniquement par du JSON conforme, sans commentaire.",
        messages: [{ role: "user", content: [
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } },
          { type: "text", text: consigne },
        ] }],
      });
      break;
    } catch (e) {
      const status = (e as { status?: number })?.status;
      const transitoire = status === undefined || status === 429 || status === 529 || (status >= 500 && status < 600);
      if (!transitoire || essai === 2) throw e;
      await new Promise((r) => setTimeout(r, 1500 * (essai + 1)));
    }
  }
  if (!msg) return null;
  const txt = msg.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("");
  const s = txt.indexOf("{"), e = txt.lastIndexOf("}");
  if (s < 0 || e <= s) return null;
  try { return JSON.parse(txt.slice(s, e + 1)) as ExtraitVente; } catch { return null; }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ error: "Service d'analyse indisponible (clé IA absente)." }, { status: 503 });
  const { id } = await params;
  let body: { fileId?: string };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  if (!body.fileId) return Response.json({ error: "Pièce à analyser manquante" }, { status: 400 });

  const t = await getTransactionServer(id);
  if (!t) return Response.json({ error: "Transaction introuvable" }, { status: 404 });
  const piece = t.pieces.find((p) => p.fileId === body.fileId);

  try {
    const buf = await getTransactionFileServer(id, body.fileId, piece?.url);
    if (!buf) return Response.json({ error: "Document introuvable" }, { status: 404 });
    if (buf.byteLength > MAX_DOC_OCTETS) return Response.json({ error: "Document trop lourd pour l'analyse." }, { status: 413 });

    const extrait = await extraire(Buffer.from(buf).toString("base64")).catch(() => null);
    if (!extrait) {
      return Response.json({ transaction: t, analyseIndisponible: true });
    }

    const maj: Transaction = {
      ...t,
      bien: texte(extrait.bien) || t.bien,
      adresse: texte(extrait.adresse) || t.adresse,
      ville: texte(extrait.ville) || t.ville,
      prixVente: nombre(extrait.prixVente) || t.prixVente,
      vendeur: texte(extrait.vendeur) || t.vendeur,
      acquereur: texte(extrait.acquereur) || t.acquereur,
      dateVente: dateEnTs(texte(extrait.dateVente)) || t.dateVente,
      notes: [t.notes, texte(extrait.notaire) ? `Notaire : ${texte(extrait.notaire)}` : ""].filter(Boolean).join("\n"),
      updatedAt: Date.now(),
    };
    await saveTransactionServer(maj);
    return Response.json({ transaction: maj, analyseIndisponible: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analyse impossible";
    return Response.json({ error: message }, { status: 500 });
  }
}
