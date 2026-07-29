import Anthropic from "@anthropic-ai/sdk";
import type { DocumentBloc, DocumentInput, DocumentResult, DocType } from "./docTypes";

// Génération de documents d'agence (annonce, compte rendu de visite,
// courrier de prospection) — même moteur IA que les estimations, rendu
// dans la charte Century 21 du dossier.

const DOC_SCHEMA = {
  type: "object",
  properties: {
    titre: { type: "string", description: "Titre du document (affiché en tête de page)" },
    objet: { type: "string", description: "Objet du courrier (vide pour une annonce)" },
    blocs: {
      type: "array",
      description: "Contenu du document, dans l'ordre d'affichage",
      items: {
        type: "object",
        properties: {
          titre: { type: "string", description: "Intertitre du bloc (vide si non nécessaire)" },
          texte: { type: "string", description: "Paragraphes séparés par \\n (vide si le bloc est une liste)" },
          items: { type: "array", items: { type: "string" }, description: "Liste à puces (vide si le bloc est un texte)" },
        },
        required: ["titre", "texte", "items"],
      },
    },
  },
  required: ["titre", "objet", "blocs"],
} as const;

const STYLE_COMMUN = `STYLE : français impeccable, professionnel et chaleureux — l'image d'une agence CENTURY 21 haut de gamme. Phrases courtes, aucune faute, aucun superlatif creux (« magnifique », « coup de cœur assuré »), aucune promesse irréaliste. Le document doit tenir sur UNE page A4 : sois dense et précis, pas bavard.
FORMAT DE SORTIE (impératif) : réponds EXCLUSIVEMENT par un objet JSON valide conforme au schéma fourni — aucun texte autour.`;

const BILAN_SYSTEM = `Tu es un négociateur immobilier expérimenté d'une agence CENTURY 21. Tu rédiges le BILAN DE COMMERCIALISATION remis au PROPRIÉTAIRE toutes les 3 semaines — un point d'étape CONCRET et honnête sur ce qui s'est passé, pour décider ensemble de la suite.
STRUCTURE IMPOSÉE des blocs :
1. { texte: formule d'appel (« Madame, Monsieur [nom], ») + 1 paragraphe : rappel du bien, du prix de présentation actuel et de la période couverte par ce bilan }
2. { titre: "L'activité de la période", items: les chiffres et actions FOURNIS dans la fiche (visites réalisées, contacts / demandes, diffusion et actions menées) — un item par fait, rien d'inventé }
3. { titre: "Ce que disent les visites", items: la synthèse des comptes rendus fournis (texte de la fiche ET/OU pièces PDF jointes) — les points qui séduisent d'un côté, les objections RÉCURRENTES de l'autre, formulées avec tact mais sans les édulcorer }
4. { titre: "Notre analyse", texte: 1 à 2 paragraphes — ce que ce niveau d'activité et ces retours signifient par rapport au marché (rythme de visites, positionnement prix perçu) }
5. { titre: "Nos recommandations", items: recommandations concrètes et hiérarchisées (dont l'ajustement de prix si un prix conseillé est fourni) }
6. { titre: "La suite", texte: proposition d'un point ensemble + formule de politesse }
RÈGLE PRIX (impérative) : le prix conseillé est décidé par le NÉGOCIATEUR et fourni dans la fiche. S'il est fourni, recommande ce chiffre EXACT et argumente-le à partir des retours de visites — ne propose JAMAIS un autre montant. S'il n'est PAS fourni, ne recommande AUCUN chiffre : parle du positionnement sans montant.
- N'invente RIEN : uniquement les chiffres, actions et retours fournis.
- titre = "Bilan de commercialisation — [adresse ou bien]" ; objet = "Point de commercialisation [période]".
${STYLE_COMMUN}`;

const SYSTEMS: Partial<Record<DocType, string>> = {
  annonce: `Tu es le meilleur rédacteur d'annonces immobilières de France. Tu rédiges l'ANNONCE COMPLÈTE d'un bien à partir de sa fiche.
STRUCTURE IMPOSÉE des blocs :
1. { titre: "Titre de l'annonce", texte: le titre accrocheur, 60 à 80 caractères, qui donne envie de cliquer — commence par l'atout n°1 du bien, pas par « À vendre » }
2. { titre: "Votre annonce", texte: le corps de l'annonce en 3 paragraphes séparés par \\n — accroche qui plante le décor et l'atout majeur ; description factuelle et vendeuse (pièces, surfaces, état, équipements) ; cadre de vie, quartier et commodités + appel à l'action (contact) }
3. { titre: "Version courte (portails & réseaux)", texte: la même annonce condensée en 300 caractères maximum }
4. { titre: "Points clés à afficher", items: 5 à 6 caractéristiques courtes (surface, pièces, extérieur, stationnement, DPE…) }
RÈGLES LÉGALES : mentionne le DPE dans l'annonce (obligatoire) ; si DPE F ou G, mentionne « logement à consommation énergétique excessive » ; aucun critère discriminatoire ; prix affiché tel que fourni.
- titre (du document) = "Annonce — [type de bien] [surface] m² à [ville]" ; objet = "".
${STYLE_COMMUN}`,

  crv: `Tu es un négociateur immobilier expérimenté d'une agence CENTURY 21. Tu rédiges le COMPTE RENDU DE VISITE envoyé au PROPRIÉTAIRE après une visite de son bien — un courrier professionnel qui l'informe fidèlement et fait avancer la vente.
STRUCTURE IMPOSÉE des blocs :
1. { texte: formule d'appel (« Madame, Monsieur [nom], ») + 1 paragraphe d'introduction : rappel de la visite (date, bien, profil de l'acquéreur — sans données personnelles du visiteur) }
2. { titre: "Ce qui a séduit", items: les points positifs relevés par le visiteur, factuels }
3. { titre: "Les réserves exprimées", items: les objections et freins, formulés avec tact mais SANS les édulcorer — le propriétaire doit entendre le retour du marché }
4. { titre: "Notre lecture", texte: 1 à 2 paragraphes — ce que ce retour signifie (dont l'avis sur le prix s'il a été exprimé), et la suite envisagée par l'acquéreur }
5. { titre: "La prochaine étape", texte: la recommandation concrète du négociateur + formule de politesse et signature morale (« Nous restons à votre disposition… ») }
- titre = "Compte rendu de visite — [adresse ou bien]" ; objet = "Visite de votre bien du [date]".
- N'invente RIEN : uniquement les éléments fournis dans la fiche.
${STYLE_COMMUN}`,

  prospection: `Tu es un négociateur immobilier CENTURY 21 qui prospecte avec élégance. Tu rédiges un COURRIER DE PROSPECTION (pige) adressé à un propriétaire pour obtenir un rendez-vous d'estimation — jamais agressif, toujours utile et personnalisé au contexte fourni.
STRUCTURE IMPOSÉE des blocs :
1. { texte: formule d'appel (« Madame, Monsieur, ») + paragraphe d'accroche PERSONNALISÉ au contexte fourni (bien repéré en vente, vente récente dans le quartier, recherche active d'acquéreurs…) — c'est lui qui fait ouvrir la lettre }
2. { titre: "Ce que nous vous apportons", items: 3 à 4 arguments concrets de l'agence (connaissance du secteur de Martigues, acquéreurs en recherche active, estimation offerte fondée sur les ventes réelles, diffusion et accompagnement) }
3. { texte: paragraphe de proposition claire : une estimation offerte, sans engagement, au moment qui convient + formule de politesse }
- titre = "Courrier de prospection — [cible]" ; objet = accroche courte du courrier (ex. « Et si vous connaissiez la vraie valeur de votre bien ? »).
- Ton : confraternel si le bien est en vente par une autre agence, jamais de dénigrement.
${STYLE_COMMUN}`,

  bilan: BILAN_SYSTEM,
};

function buildDocText(input: DocumentInput): string {
  const l: string[] = [];
  const p = (label: string, v: unknown) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") l.push(`- ${label} : ${String(v).trim()}`);
  };
  p("Négociateur", input.negociateur);
  p("Téléphone", input.negociateurTel);
  p("Email", input.negociateurEmail);
  p("Type de bien", input.typeBien);
  p("Surface habitable", input.surface ? `${input.surface} m²` : "");
  p("Pièces", input.nbPieces);
  p("Adresse", input.adresse);
  p("Localisation", `${input.codePostal ?? ""} ${input.ville ?? ""}`.trim());
  p("Quartier", input.quartier);
  p("Prix affiché", input.prix ? `${input.prix} €` : "");
  p("DPE", input.dpe);
  p("Atouts & équipements", input.atouts);
  p("Propriétaire destinataire", input.clientNom);
  p("Date de la visite", input.dateVisite);
  p("Profil de l'acquéreur", input.profilAcquereur);
  p("Ce que le visiteur a aimé", input.pointsAimes);
  p("Objections / réserves du visiteur", input.objections);
  p("Avis du visiteur sur le prix", input.avisPrix);
  p("Suite envisagée", input.suite);
  p("Destinataire de la prospection", input.cible);
  p("Contexte de la prospection", input.contexte);
  p("En commercialisation depuis", input.bilanDebut);
  p("Période couverte par ce bilan", input.bilanPeriode);
  p("Visites réalisées sur la période", input.bilanNbVisites);
  p("Contacts / demandes de renseignements", input.bilanNbContacts);
  p("Actions de commercialisation menées", input.bilanActions);
  p(
    "PRIX CONSEILLÉ PAR LE NÉGOCIATEUR (à recommander tel quel, sans le modifier)",
    input.bilanPrixRecommande ? `${input.bilanPrixRecommande} €` : "",
  );
  if (input.bilanComptesRendus?.trim()) {
    l.push(`\nCOMPTES RENDUS DES VISITES DE LA PÉRIODE (à synthétiser) :\n${input.bilanComptesRendus.trim()}`);
  }
  if (input.instructionsIA?.trim()) {
    l.push(`\nINSTRUCTIONS PARTICULIÈRES DU NÉGOCIATEUR (à respecter) :\n${input.instructionsIA.trim()}`);
  }
  return l.join("\n");
}

function parseJsonLoose(text: string): Record<string, unknown> {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Réponse IA sans objet JSON");
  return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
}

export async function generateDocument(
  input: DocumentInput,
  onProgress: (label: string) => void = () => {},
  crPdfs: { nom: string; data: string }[] = [],
): Promise<DocumentResult> {
  const client = new Anthropic();
  const model = process.env.ESTIMATION_MODEL ?? "claude-opus-4-8";
  onProgress(crPdfs.length ? "Lecture des comptes rendus PDF…" : "Rédaction du document par l'IA…");
  // Comptes rendus de visite téléversés (bilan) : joints en pièces PDF que
  // l'IA lit directement avant de rédiger sa synthèse
  const content: Anthropic.ContentBlockParam[] = crPdfs.map((f) => ({
    type: "document" as const,
    source: { type: "base64" as const, media_type: "application/pdf" as const, data: f.data },
    title: f.nom,
  }));
  content.push({
    type: "text",
    text: `# FICHE DU DOCUMENT À RÉDIGER\n${buildDocText(input)}${
      crPdfs.length
        ? `\n\nLes ${crPdfs.length} pièce(s) PDF jointe(s) sont les COMPTES RENDUS DES VISITES de la période : lis-les et synthétise-les (points qui séduisent / objections récurrentes) — n'invente aucune visite.`
        : ""
    }\n\n# SCHÉMA JSON DE LA RÉPONSE (respecte-le exactement)\n${JSON.stringify(DOC_SCHEMA)}`,
  });
  const stream = client.messages.stream({
    model,
    max_tokens: 4000,
    system: SYSTEMS[input.docType] ?? SYSTEMS.annonce!,
    output_config: { effort: "medium" },
    messages: [{ role: "user", content }],
  });
  const message = await stream.finalMessage();
  if (message.stop_reason === "refusal") throw new Error("Requête refusée par les garde-fous du modèle");
  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  const r = parseJsonLoose(text);
  const blocs = Array.isArray(r.blocs)
    ? (r.blocs as DocumentBloc[]).map((b) => ({
        titre: typeof b.titre === "string" ? b.titre : "",
        texte: typeof b.texte === "string" ? b.texte : "",
        items: Array.isArray(b.items) ? b.items.filter((i): i is string => typeof i === "string" && i.trim() !== "") : [],
      })).filter((b) => b.titre || b.texte || (b.items?.length ?? 0) > 0)
    : [];
  if (blocs.length === 0) throw new Error("Document vide — réessayez");
  return {
    titre: typeof r.titre === "string" && r.titre ? r.titre : "Document",
    objet: typeof r.objet === "string" ? r.objet : "",
    blocs,
  };
}

// Ré-export pour le composant de rendu et la route API
export type { DocumentBloc, DocumentInput, DocumentResult } from "./docTypes";
