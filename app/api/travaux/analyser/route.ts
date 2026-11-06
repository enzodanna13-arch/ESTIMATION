import Anthropic from "@anthropic-ai/sdk";
import { verifierAccesEquipe } from "@/lib/historyAuth";
import { POSTES_TRAVAUX } from "@/lib/travauxBareme";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const MAX_OCTETS = 12 * 1024 * 1024;
const texte = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const idsValides = new Set(POSTES_TRAVAUX.map((p) => p.id));

interface TravailIA { posteId?: string; libelle?: string; unite?: string; quantite?: number }
interface AnalyseIA { piece?: string; etat?: string; legendeAvant?: string; legendeApres?: string; travaux?: TravailIA[] }

export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ error: "Service d'analyse indisponible (clé IA absente)." }, { status: 503 });
  let body: { data?: string; contexte?: string };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  if (!body.data) return Response.json({ error: "Photo manquante" }, { status: 400 });
  if (body.data.length * 0.75 > MAX_OCTETS) return Response.json({ error: "Photo trop lourde pour l'analyse." }, { status: 413 });

  // Liste compacte des postes du barème que le modèle peut référencer.
  const catalogue = POSTES_TRAVAUX.map((p) => `${p.id} = ${p.libelle} [${p.unite}]`).join("\n");

  const consigne = [
    "Tu es un métreur / conducteur de travaux expérimenté. On te montre la PHOTO d'une pièce d'un logement à rénover avant mise en vente.",
    body.contexte ? `Contexte du dossier : ${texte(body.contexte)}` : "",
    "Analyse l'état visible et propose les travaux de remise en état / rafraîchissement pertinents.",
    "",
    "Pour chaque travail proposé, utilise OBLIGATOIREMENT un posteId de ce catalogue (ne l'invente pas) :",
    catalogue,
    "",
    "Renvoie EXCLUSIVEMENT ce JSON (chaîne vide ou tableau vide si l'info manque) :",
    "{",
    '  "piece": "nom de la pièce (ex. « Séjour », « Cuisine », « Salle de bain », « Chambre »)",',
    '  "etat": "état constaté en 1-2 phrases (revêtements, vétusté, désordres visibles)",',
    '  "legendeAvant": "légende courte décrivant la photo telle quelle (l\'existant)",',
    '  "legendeApres": "description étayée du rendu APRÈS travaux : ce que donneront les travaux proposés, matériaux/teintes conseillés, effet sur la pièce (3-4 phrases, concret et valorisant)",',
    '  "travaux": [ { "posteId": "id du catalogue", "libelle": "précision libre si utile", "unite": "m²|ml|u|forfait|h|m³", "quantite": nombre estimé d\'après la photo (0 si tu ne peux pas estimer) } ]',
    "}",
    "Estime les quantités avec bon sens (surfaces de murs/sol d'une pièce courante). N'invente pas de poste hors catalogue.",
  ].filter(Boolean).join("\n");

  const bloc = { type: "image" as const, source: { type: "base64" as const, media_type: "image/jpeg" as const, data: body.data } };

  try {
    const client = new Anthropic();
    let msg: Anthropic.Message | null = null;
    for (let essai = 0; essai < 3; essai++) {
      try {
        msg = await client.messages.create({
          model: process.env.EXTRACT_MODEL ?? "claude-sonnet-5",
          max_tokens: 1500,
          system: "Tu es métreur dans le bâtiment. Tu chiffres des travaux de rénovation et réponds uniquement par du JSON conforme, sans commentaire.",
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
    if (!msg) return Response.json({ analyse: null });
    const out = msg.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("");
    const s = out.indexOf("{"), e = out.lastIndexOf("}");
    if (s < 0 || e <= s) return Response.json({ analyse: null });
    const a = JSON.parse(out.slice(s, e + 1)) as AnalyseIA;
    const travaux = (Array.isArray(a.travaux) ? a.travaux : [])
      .filter((t) => idsValides.has(texte(t.posteId)))
      .slice(0, 20)
      .map((t) => ({
        posteId: texte(t.posteId),
        libelle: texte(t.libelle),
        unite: texte(t.unite),
        quantite: Number.isFinite(Number(t.quantite)) && Number(t.quantite) > 0 ? Math.round(Number(t.quantite) * 100) / 100 : 0,
      }));
    return Response.json({ analyse: {
      piece: texte(a.piece),
      etat: texte(a.etat),
      legendeAvant: texte(a.legendeAvant),
      legendeApres: texte(a.legendeApres),
      travaux,
    } });
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : "Analyse impossible" }, { status: 500 });
  }
}
