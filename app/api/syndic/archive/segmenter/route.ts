import Anthropic from "@anthropic-ai/sdk";
import { garde } from "@/lib/syndic/guard";
import { CATEGORIES_ARCHIVE } from "@/lib/syndic/serverArchive";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const MAX_OCTETS = 12 * 1024 * 1024;
const texte = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const nombre = (v: unknown) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? n : 0; };
const categorieValide = (v: unknown) => ((CATEGORIES_ARCHIVE as readonly string[]).includes(typeof v === "string" ? v : "") ? (v as string) : "Autre");
function iso(s: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})/);
  if (!m) return "";
  const an = m[3].length === 2 ? `20${m[3]}` : m[3];
  const d = new Date(Number(an), Number(m[2]) - 1, Number(m[1]), 12);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}
const nettoyerNom = (s: string) => s.replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, " ").trim().slice(0, 180);

interface DocSeg { pageDebut?: unknown; pageFin?: unknown; continuation?: unknown; categorie?: unknown; copropriete?: unknown; date?: unknown; nom?: unknown; resume?: unknown }

export async function POST(request: Request) {
  const g = await garde(request);
  if ("erreur" in g) return g.erreur;
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ error: "Analyse indisponible (clé IA absente)." }, { status: 503 });
  let body: { data?: string; offset?: number; contexte?: string };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  if (!body.data) return Response.json({ error: "Document manquant" }, { status: 400 });
  if (body.data.length * 0.75 > MAX_OCTETS) return Response.json({ error: "Tranche trop lourde." }, { status: 413 });
  const offset = Math.max(1, nombre(body.offset) || 1);

  const consigne = [
    `Ce PDF est un EXTRAIT d'un gros scan papier où PLUSIEURS documents de copropriété différents se suivent. Les pages de cet extrait portent les numéros ABSOLUS de ${offset} à ${offset + 999} (la 1re page de l'extrait = page ${offset}, la suivante ${offset + 1}, etc.).`,
    body.contexte ? `IMPORTANT : la page juste avant cet extrait appartenait à un document EN COURS : « ${body.contexte} ». Si la 1re page de l'extrait est la SUITE de ce document, mets "continuation": true sur le premier élément.` : "",
    "Découpe l'extrait en documents DISTINCTS (un relevé, un PV, une facture, un courrier… = un document). Un document peut faire une ou plusieurs pages.",
    "Renvoie EXCLUSIVEMENT ce JSON :",
    '{ "documents": [ {',
    '  "pageDebut": numéro de page ABSOLU de début,',
    '  "pageFin": numéro de page ABSOLU de fin,',
    '  "continuation": true uniquement si ce document est la SUITE du document en cours d\'avant l\'extrait (possible seulement pour le 1er élément), sinon false,',
    `  "categorie": "une valeur EXACTEMENT parmi : ${CATEGORIES_ARCHIVE.join(" | ")}",`,
    '  "copropriete": "copropriété/résidence concernée si identifiable",',
    '  "date": "date du document AAAA-MM-JJ si identifiable, sinon vide",',
    '  "nom": "nom de fichier normalisé SANS extension, format : AAAA-MM-JJ - Type - Copropriété - précision",',
    '  "resume": "résumé en une phrase"',
    "} ] }",
    "Couvre TOUTES les pages de l'extrait, sans trou ni chevauchement. N'invente rien : laisse vide ce qui n'est pas lisible.",
  ].filter(Boolean).join("\n");

  try {
    const client = new Anthropic();
    let msg: Anthropic.Message | null = null;
    for (let essai = 0; essai < 3; essai++) {
      try {
        msg = await client.messages.create({
          model: process.env.EXTRACT_MODEL ?? "claude-sonnet-5",
          max_tokens: 3000,
          system: "Tu es l'assistant d'un syndic de copropriété. Tu segmentes des lots de documents scannés et réponds uniquement par du JSON conforme.",
          messages: [{ role: "user", content: [
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: body.data! } },
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
    if (!msg) return Response.json({ documents: [] });
    const out = msg.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("");
    const s = out.indexOf("{"), e = out.lastIndexOf("}");
    if (s < 0 || e <= s) return Response.json({ documents: [] });
    const parsed = JSON.parse(out.slice(s, e + 1)) as { documents?: DocSeg[] };
    const documents = (Array.isArray(parsed.documents) ? parsed.documents : []).map((d) => {
      const categorie = categorieValide(d.categorie);
      const copropriete = texte(d.copropriete);
      const nom = nettoyerNom(texte(d.nom)) || `${categorie}${copropriete ? ` - ${copropriete}` : ""}`;
      return { pageDebut: nombre(d.pageDebut), pageFin: nombre(d.pageFin), continuation: d.continuation === true, categorie, copropriete, date: iso(texte(d.date)), nom, resume: texte(d.resume) };
    }).filter((d) => d.pageDebut > 0 && d.pageFin >= d.pageDebut);
    return Response.json({ documents });
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : "Analyse impossible" }, { status: 500 });
  }
}
