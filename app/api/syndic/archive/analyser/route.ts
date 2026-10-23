import Anthropic from "@anthropic-ai/sdk";
import { garde } from "@/lib/syndic/guard";
import { CATEGORIES_ARCHIVE } from "@/lib/syndic/serverArchive";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const MAX_OCTETS = 12 * 1024 * 1024;
const texte = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const categorieValide = (v: unknown) => ((CATEGORIES_ARCHIVE as readonly string[]).includes(typeof v === "string" ? v : "") ? (v as string) : "Autre");
function iso(s: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})/);
  if (!m) return "";
  const an = m[3].length === 2 ? `20${m[3]}` : m[3];
  const d = new Date(Number(an), Number(m[2]) - 1, Number(m[1]), 12);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}
// Nettoie un nom de fichier (pas de caractères interdits).
const nettoyerNom = (s: string) => s.replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, " ").trim().slice(0, 180);

interface Extrait { nom?: string; categorie?: string; copropriete?: string; date?: string; resume?: string }

export async function POST(request: Request) {
  const g = await garde(request);
  if ("erreur" in g) return g.erreur;
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ error: "Analyse indisponible (clé IA absente)." }, { status: 503 });
  let body: { data?: string };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  if (!body.data) return Response.json({ error: "Document manquant" }, { status: 400 });
  if (body.data.length * 0.75 > MAX_OCTETS) return Response.json({ error: "Document trop lourd." }, { status: 413 });

  const consigne = [
    "Ce document est une pièce de GESTION DE COPROPRIÉTÉ (syndic). Analyse-le pour l'archiver et le nommer proprement.",
    "Renvoie EXCLUSIVEMENT ce JSON (chaîne vide si l'info est absente) :",
    "{",
    `  "categorie": "une valeur EXACTEMENT parmi : ${CATEGORIES_ARCHIVE.join(" | ")}",`,
    '  "copropriete": "nom de la copropriété / résidence concernée si identifiable",',
    '  "date": "date principale du document au format AAAA-MM-JJ si identifiable, sinon vide",',
    '  "nom": "nom de fichier clair et normalisé SANS extension, au format : AAAA-MM-JJ - Type - Copropriété - précision. Exemple : « 2026-03-14 - PV AG - Les Jardins - assemblée générale ordinaire ». Si la date est inconnue, commence par le Type.",',
    '  "resume": "résumé du document en une phrase"',
    "}",
    "N'INVENTE RIEN : laisse vide ce qui ne figure pas clairement.",
  ].join("\n");

  try {
    const client = new Anthropic();
    let msg: Anthropic.Message | null = null;
    for (let essai = 0; essai < 3; essai++) {
      try {
        msg = await client.messages.create({
          model: process.env.EXTRACT_MODEL ?? "claude-sonnet-5",
          max_tokens: 1024,
          system: "Tu es l'assistant d'un syndic de copropriété. Tu classes et nommes des documents et réponds uniquement par du JSON conforme.",
          messages: [{ role: "user", content: [
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: body.data } },
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
    if (!msg) return Response.json({ extrait: null });
    const out = msg.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("");
    const s = out.indexOf("{"), e = out.lastIndexOf("}");
    if (s < 0 || e <= s) return Response.json({ extrait: null });
    const ex = JSON.parse(out.slice(s, e + 1)) as Extrait;
    const categorie = categorieValide(ex.categorie);
    const nom = nettoyerNom(texte(ex.nom)) || `${categorie}${ex.copropriete ? ` - ${texte(ex.copropriete)}` : ""}`;
    return Response.json({ extrait: { nom, categorie, copropriete: texte(ex.copropriete), date: iso(texte(ex.date)), resume: texte(ex.resume) } });
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : "Analyse impossible" }, { status: 500 });
  }
}
