import Anthropic from "@anthropic-ai/sdk";
import type { Ticket } from "./types";
import { CATEGORIES_LABELS } from "./types";

// Aide IA au gestionnaire : rédige un BROUILLON d'email de réponse au
// copropriétaire, basé UNIQUEMENT sur la demande et les informations fournies
// par le gestionnaire. L'IA propose, l'humain relit et envoie. Elle n'invente
// jamais une date, un montant ou un prestataire ; toute info absente apparaît
// entre crochets [à compléter].
//
// MINIMISATION DES DONNÉES : on n'envoie à l'IA que le texte utile de la
// demande. Jamais le téléphone, l'email ou l'adresse du demandeur.

const SYSTEME = `Tu es l'assistant d'un gestionnaire de copropriété d'une agence immobilière française (Century 21 Icaza Immobilier, service syndic).
Tu rédiges un email de réponse PROFESSIONNEL, courtois et clair, adressé à un copropriétaire, à partir UNIQUEMENT de la demande fournie et des informations que le gestionnaire te donne pour répondre.

RÈGLES ABSOLUES :
- N'invente JAMAIS une date d'intervention, un montant, un nom de prestataire, un délai ou un fait qui ne figure pas dans les informations fournies.
- Toute information nécessaire mais NON fournie doit apparaître entre crochets, ex. « [à compléter : date d'intervention] ». Ne comble jamais un trou par une supposition.
- Reste factuel, sobre et rassurant. Pas de promesse non étayée.
- Français soigné, sans tiret cadratin.
- Le corps commence par une formule d'appel (« Bonjour, ») et se termine par la signature du gestionnaire puis « Service syndic, Century 21 Icaza Immobilier ».

Réponds STRICTEMENT en JSON, sans texte autour : {"objet": "…", "corps": "…"}. Dans "corps", les sauts de ligne sont des \\n.`;

function parseJson(text: string): { objet: string; corps: string } | null {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    const o = JSON.parse(m[0]) as { objet?: unknown; corps?: unknown };
    return { objet: String(o.objet ?? ""), corps: String(o.corps ?? "") };
  } catch {
    return null;
  }
}

export async function redigerReponseTicket(input: {
  ticket: Ticket;
  gestionnaireNom: string;
  residenceNom: string;
  faits: string;
}): Promise<{ objet: string; corps: string }> {
  const { ticket, gestionnaireNom, residenceNom, faits } = input;
  const client = new Anthropic();
  const model = process.env.SYNDIC_IA_MODEL || "claude-sonnet-5";

  const contexte = `DEMANDE N° ${ticket.numero}
Catégorie : ${CATEGORIES_LABELS[ticket.categorie] ?? ticket.categorie}
Résidence : ${residenceNom || "non précisée"}
Objet : ${ticket.objet || "(non précisé)"}
Description de la demande : ${ticket.description || "(non précisée)"}

INFORMATIONS FOURNIES PAR LE GESTIONNAIRE POUR RÉPONDRE :
${faits.trim() || "(aucune information fournie — signale ce qui manque avec [à compléter])"}

Signature à utiliser : ${gestionnaireNom || "Le gestionnaire"}`;

  const message = await client.messages.create({
    model,
    max_tokens: 1400,
    system: SYSTEME,
    messages: [{ role: "user", content: contexte }],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  const parsed = parseJson(text);
  if (!parsed || !parsed.corps) {
    throw new Error("La rédaction IA n'a pas pu être générée. Réessayez.");
  }
  return parsed;
}
