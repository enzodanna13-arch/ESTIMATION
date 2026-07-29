import Anthropic from "@anthropic-ai/sdk";
import { checkHistoryPassword } from "@/lib/historyAuth";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

// Pré-remplissage de la demande de compromis : l'IA LIT les pièces PDF
// (pièces d'identité, taxe foncière, offre d'achat, mandat, attestation de
// propriété…) et en extrait les informations du dossier — champs inconnus
// laissés vides, jamais inventés.

const CHAMPS = [
  "compromisObjetBien", "cLot", "cBienDescription", "cTantiemes",
  "cVendeurNoms", "cVendeurProfessions", "cVendeurAdresse", "cVendeurNaissances", "cVendeurTel", "cVendeurEmail",
  "cAcqNom", "cAcqNaissance", "cAcqProfession", "cAcqAdresse", "cAcqTel", "cAcqEmail",
  "cNotVNom", "cNotVEtude", "cNotVAdresse", "cNotVTel", "cNotVEmail",
  "cNotANom", "cNotAEtude", "cNotAAdresse", "cNotATel", "cNotAEmail",
] as const;

const SCHEMA = {
  type: "object",
  properties: {
    compromisObjetBien: { type: "string", description: "Adresse/résidence du bien vendu (ex. Résidence Le Canal – Bâtiment SD4 – 13500 Martigues)" },
    cLot: { type: "string", description: "Numéro(s) de lot" },
    cBienDescription: { type: "string", description: "Composition du bien : étage, pièces, annexes" },
    cTantiemes: { type: "string", description: "Tantièmes des parties communes (ex. 46/1000èmes…)" },
    cVendeurNoms: { type: "string", description: "Nom(s) complet(s) du/des vendeur(s)" },
    cVendeurProfessions: { type: "string" },
    cVendeurAdresse: { type: "string" },
    cVendeurNaissances: { type: "string", description: "Dates et lieux de naissance des vendeurs" },
    cVendeurTel: { type: "string" },
    cVendeurEmail: { type: "string" },
    cAcqNom: { type: "string", description: "Nom complet de l'acquéreur" },
    cAcqNaissance: { type: "string" },
    cAcqProfession: { type: "string", description: "Nationalité et profession" },
    cAcqAdresse: { type: "string" },
    cAcqTel: { type: "string" },
    cAcqEmail: { type: "string" },
    cNotVNom: { type: "string", description: "Notaire du vendeur (Maître …)" },
    cNotVEtude: { type: "string" },
    cNotVAdresse: { type: "string" },
    cNotVTel: { type: "string" },
    cNotVEmail: { type: "string" },
    cNotANom: { type: "string", description: "Notaire de l'acquéreur (Maître …)" },
    cNotAEtude: { type: "string" },
    cNotAAdresse: { type: "string" },
    cNotATel: { type: "string" },
    cNotAEmail: { type: "string" },
    cPrixVente: { type: "number", description: "Prix de vente en euros, frais d'agence inclus (0 si introuvable)" },
    cHonoraires: { type: "number", description: "Honoraires d'agence en euros TTC (0 si introuvable)" },
  },
  required: [...CHAMPS, "cPrixVente", "cHonoraires"],
} as const;

interface FichierIn {
  nom: string;
  data: string; // base64
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
    return Response.json({ error: "Aucune pièce PDF fournie" }, { status: 400 });
  }

  try {
    const client = new Anthropic();
    const content: Anthropic.ContentBlockParam[] = fichiers.map((f) => ({
      type: "document" as const,
      source: { type: "base64" as const, media_type: "application/pdf" as const, data: f.data },
      title: f.nom,
    }));
    content.push({
      type: "text",
      text: `Ces pièces PDF composent le dossier d'une vente immobilière (pièces d'identité, taxe foncière, livret de famille, offre d'achat, mandat, attestation de propriété…).
EXTRAIS-EN les informations pour préparer la demande de compromis de vente au notaire, en remplissant le schéma JSON ci-dessous.
RÈGLES :
- N'INVENTE RIEN : un champ introuvable dans les pièces reste vide ("" ou 0).
- Orthographie les noms EXACTEMENT comme sur les pièces (majuscules des noms de famille).
- cVendeurNaissances : au format « Monsieur X, à VILLE (CP), le JJ mois AAAA — Madame Y, à … ».
- Le prix (cPrixVente) et les honoraires (cHonoraires) viennent de l'offre d'achat ou du mandat s'ils y figurent.
- Réponds EXCLUSIVEMENT par un objet JSON valide conforme au schéma, sans texte autour.

SCHÉMA : ${JSON.stringify(SCHEMA)}`,
    });

    const stream = client.messages.stream({
      model: process.env.ESTIMATION_MODEL ?? "claude-opus-4-8",
      max_tokens: 3000,
      system:
        "Tu extrais des informations de pièces administratives françaises pour un dossier de vente immobilière. Tu réponds exclusivement par un objet JSON valide conforme au schéma fourni. Tu n'inventes jamais une information absente des pièces.",
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
    if (typeof r.cPrixVente === "number" && r.cPrixVente > 0) champs.cPrixVente = r.cPrixVente;
    if (typeof r.cHonoraires === "number" && r.cHonoraires > 0) champs.cHonoraires = r.cHonoraires;
    return Response.json({ champs });
  } catch (err) {
    console.error("Extraction des pièces impossible :", err);
    return Response.json({ error: "Lecture des pièces impossible — réessayez ou remplissez à la main" }, { status: 500 });
  }
}
