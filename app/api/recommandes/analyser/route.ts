import Anthropic from "@anthropic-ai/sdk";
import { verifierAccesEquipe } from "@/lib/historyAuth";
import { PRIORITES_RECO } from "@/lib/serverRecommandes";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const MAX_OCTETS = 12 * 1024 * 1024;
const texte = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const prioriteValide = (v: unknown) => ((PRIORITES_RECO as readonly string[]).includes(typeof v === "string" ? v : "") ? (v as string) : "");

// JJ/MM/AAAA (ou variantes) -> yyyy-mm-dd
function versIso(s: string): string {
  const m = s.match(/(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})/);
  if (!m) return "";
  const an = m[3].length === 2 ? `20${m[3]}` : m[3];
  const d = new Date(Number(an), Number(m[2]) - 1, Number(m[1]), 12);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

interface Extrait { objet?: string; expediteur?: string; copropriete?: string; dateCourrier?: string; echeance?: string; priorite?: string; resume?: string; }

export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ error: "Service d'analyse indisponible (clé IA absente)." }, { status: 503 });
  let body: { type?: string; data?: string };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  if (!body.data) return Response.json({ error: "Document manquant" }, { status: 400 });
  if (body.data.length * 0.75 > MAX_OCTETS) return Response.json({ error: "Document trop lourd pour l'analyse." }, { status: 413 });

  const estPdf = body.type === "pdf";
  const consigne = [
    "Ce document est un COURRIER RECOMMANDÉ reçu par un syndic de copropriété (CENTURY 21 Icaza Immobilier).",
    "Analyse-le et extrais les informations pour créer la fiche de suivi. Renvoie EXCLUSIVEMENT ce JSON (chaîne vide si l'info est absente) :",
    "{",
    '  "objet": "nature / objet du courrier en quelques mots (ex. « Mise en demeure impayés », « Convocation », « Courrier d\'avocat », « Signalement de désordre », « Relance »)",',
    '  "expediteur": "nom de l\'expéditeur (personne, société, cabinet, étude, administration)",',
    '  "copropriete": "nom ou adresse de la copropriété concernée si mentionnée",',
    '  "dateCourrier": "date du courrier au format JJ/MM/AAAA",',
    '  "echeance": "date limite d\'action / de réponse au format JJ/MM/AAAA si un délai est indiqué (ex. « sous 15 jours », « avant le … »), sinon vide",',
    '  "priorite": "une de ces valeurs selon l\'urgence : « Urgente » (mise en demeure, avocat, huissier, référé, délai court), « Haute » (relance, mise en cause, délai moyen), « Normale » (information, courrier courant)",',
    '  "resume": "résumé en 1 à 2 phrases de ce que demande ou annonce le courrier"',
    "}",
    "N'INVENTE RIEN : laisse vide si l'information ne figure pas clairement.",
  ].join("\n");

  const bloc = estPdf
    ? { type: "document" as const, source: { type: "base64" as const, media_type: "application/pdf" as const, data: body.data } }
    : { type: "image" as const, source: { type: "base64" as const, media_type: "image/jpeg" as const, data: body.data } };

  try {
    const client = new Anthropic();
    let msg: Anthropic.Message | null = null;
    for (let essai = 0; essai < 3; essai++) {
      try {
        msg = await client.messages.create({
          model: process.env.EXTRACT_MODEL ?? "claude-sonnet-5",
          max_tokens: 1024,
          system: "Tu es l'assistant d'un syndic de copropriété. Tu analyses des courriers recommandés et réponds uniquement par du JSON conforme, sans commentaire.",
          messages: [{ role: "user", content: [bloc, { type: "text", text: consigne }] }],
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
    return Response.json({ extrait: {
      objet: texte(ex.objet),
      expediteur: texte(ex.expediteur),
      copropriete: texte(ex.copropriete),
      dateCourrier: texte(ex.dateCourrier),
      echeance: versIso(texte(ex.echeance)),
      priorite: prioriteValide(ex.priorite),
      resume: texte(ex.resume),
    } });
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : "Analyse impossible" }, { status: 500 });
  }
}
