import Anthropic from "@anthropic-ai/sdk";
import { checkHistoryPassword } from "@/lib/historyAuth";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

// Pré-remplissage du mandat de vente : l'IA LIT la pièce d'identité, le titre
// de propriété (ou un mandat déjà rempli) et en extrait l'état civil du/des
// mandant(s) et la désignation du bien — champs inconnus laissés vides, jamais
// inventés. Les pièces ne sont pas conservées : elles ne servent qu'à la
// lecture, le temps de la requête.

const CHAMPS = ["mandatMandant", "mandatBien", "mandatNumero"] as const;

const SCHEMA = {
  type: "object",
  properties: {
    mandatMandant: {
      type: "string",
      description:
        "État civil COMPLET du/des propriétaire(s)-mandant(s), tel qu'il figurerait dans un mandat : civilité, prénoms + NOM (majuscules), nom de naissance le cas échéant, date et lieu de naissance, nationalité, profession, adresse du domicile. Un mandant par phrase ; s'il y a un couple, les deux séparés par « et ». Sauts de ligne (\\n) autorisés pour aérer. Vide si introuvable.",
    },
    mandatBien: {
      type: "string",
      description:
        "Désignation COMPLÈTE du bien à vendre telle qu'elle figurerait au mandat : nature (appartement/maison…), type/nombre de pièces, surface, étage, adresse complète, références cadastrales (section + numéro), numéro(s) de lot de copropriété et tantièmes, annexes (cave, garage, parking). Sauts de ligne (\\n) autorisés. Vide si introuvable.",
    },
    mandatPrix: { type: "number", description: "Prix de vente en euros si mentionné dans les pièces (ex. mandat déjà rempli), sinon 0" },
    mandatHonoraires: { type: "number", description: "Honoraires d'agence en euros TTC si mentionnés, sinon 0" },
    mandatNumero: { type: "string", description: "Numéro de mandat s'il figure sur un mandat déjà rempli, sinon vide" },
  },
  required: [...CHAMPS, "mandatPrix", "mandatHonoraires"],
} as const;

interface FichierIn {
  nom: string;
  data: string; // base64
}

// Détection du type de média à partir des premiers octets encodés en base64
function mediaTypeDe(data: string): "application/pdf" | "image/jpeg" | "image/png" | "image/webp" | null {
  if (data.startsWith("JVBERi")) return "application/pdf"; // %PDF
  if (data.startsWith("/9j/")) return "image/jpeg";
  if (data.startsWith("iVBORw0KGgo")) return "image/png";
  if (data.startsWith("UklGR")) return "image/webp";
  return null;
}

export async function POST(request: Request) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "Le pré-remplissage nécessite le moteur IA" }, { status: 400 });
  }
  let fichiers: FichierIn[];
  try {
    const body = (await request.json()) as { fichiers?: FichierIn[] };
    fichiers = (body.fichiers ?? []).slice(0, 10);
  } catch {
    return Response.json({ error: "Corps de requête invalide" }, { status: 400 });
  }
  if (fichiers.length === 0) {
    return Response.json({ error: "Aucune pièce fournie" }, { status: 400 });
  }

  try {
    const client = new Anthropic();
    const content: Anthropic.ContentBlockParam[] = [];
    for (const f of fichiers) {
      const media = mediaTypeDe(f.data);
      if (media === "application/pdf") {
        content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: f.data }, title: f.nom });
      } else if (media) {
        content.push({ type: "image", source: { type: "base64", media_type: media, data: f.data } });
      }
      // Type inconnu : ignoré silencieusement (ni PDF ni image reconnue)
    }
    if (content.length === 0) {
      return Response.json({ error: "Aucune pièce lisible (PDF ou image attendue)" }, { status: 400 });
    }
    content.push({
      type: "text",
      text: `Ces pièces (pièce d'identité, titre de propriété, ou un mandat de vente déjà rempli) concernent une vente immobilière confiée à une agence.
EXTRAIS-EN les informations pour PRÉ-REMPLIR un mandat simple de vente, en remplissant le schéma JSON ci-dessous.
RÈGLES STRICTES :
- N'INVENTE RIEN : un champ introuvable dans les pièces reste vide ("" ou 0). Ne déduis pas, ne complète pas au hasard.
- Orthographie les noms, prénoms et adresses EXACTEMENT comme sur les pièces (majuscules des noms de famille).
- mandatMandant : c'est le PROPRIÉTAIRE-VENDEUR (titulaire du titre de propriété / porteur de la pièce d'identité), jamais l'agence. En cas de couple ou d'indivision, mentionne toutes les personnes.
- mandatBien : reprends la désignation du bien telle qu'au titre de propriété (nature, surface, adresse, cadastre, lots, annexes).
- mandatPrix / mandatHonoraires / mandatNumero : seulement s'ils figurent sur un mandat déjà rempli fourni.
- Réponds EXCLUSIVEMENT par un objet JSON valide conforme au schéma, sans texte autour.

SCHÉMA : ${JSON.stringify(SCHEMA)}`,
    });

    const stream = client.messages.stream({
      model: process.env.ESTIMATION_MODEL ?? "claude-opus-4-8",
      max_tokens: 2500,
      system:
        "Tu extrais des informations de pièces administratives françaises (pièce d'identité, titre de propriété, mandat) pour pré-remplir un mandat de vente immobilière. Tu réponds exclusivement par un objet JSON valide conforme au schéma fourni. Tu n'inventes jamais une information absente des pièces.",
      output_config: { effort: "medium" },
      messages: [{ role: "user", content }],
    });
    const message = await stream.finalMessage();
    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
    const cleaned = text.replace(/```json/gi, "").replace(/```/g, "");
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start < 0 || end <= start) throw new Error("Réponse IA sans objet JSON");
    const r = JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
    const champs: Record<string, string | number> = {};
    for (const k of CHAMPS) {
      if (typeof r[k] === "string" && (r[k] as string).trim()) champs[k] = (r[k] as string).trim();
    }
    if (typeof r.mandatPrix === "number" && r.mandatPrix > 0) champs.mandatPrix = r.mandatPrix;
    if (typeof r.mandatHonoraires === "number" && r.mandatHonoraires > 0) champs.mandatHonoraires = r.mandatHonoraires;
    return Response.json({ champs });
  } catch (err) {
    console.error("Extraction du mandat impossible :", err);
    return Response.json({ error: "Lecture des pièces impossible — réessayez ou remplissez à la main" }, { status: 500 });
  }
}
