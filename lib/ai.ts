import Anthropic from "@anthropic-ai/sdk";
import type { DvfSale, EstimationReport, PropertyInput } from "./types";

const REPORT_SCHEMA = {
  type: "object",
  properties: {
    prix_estime: { type: "number", description: "Prix de vente recommandé en euros" },
    fourchette_basse: { type: "number" },
    fourchette_haute: { type: "number" },
    prix_m2: { type: "number", description: "Prix au m² retenu" },
    indice_confiance: { type: "number", description: "Confiance de 0 à 100 selon la qualité des données" },
    delai_vente_estime: { type: "string" },
    positionnement_marche: { type: "string", description: "Synthèse du positionnement prix vs marché" },
    analyse_dvf: { type: "string" },
    analyse_concurrence: { type: "string" },
    analyse_invendus: { type: "string" },
    analyse_photos: { type: "string" },
    points_forts: { type: "array", items: { type: "string" } },
    points_faibles: { type: "array", items: { type: "string" } },
    strategie_commercialisation: { type: "string" },
    argumentaire_vendeur: { type: "string", description: "Argumentaire prêt à l'emploi pour défendre le prix face au vendeur" },
  },
  required: [
    "prix_estime", "fourchette_basse", "fourchette_haute", "prix_m2",
    "indice_confiance", "delai_vente_estime", "positionnement_marche",
    "analyse_dvf", "analyse_concurrence", "analyse_invendus", "analyse_photos",
    "points_forts", "points_faibles", "strategie_commercialisation", "argumentaire_vendeur",
  ],
  additionalProperties: false,
} as const;

const SYSTEM_PROMPT = `Tu es un expert en estimation immobilière travaillant pour une équipe commerciale d'agence.
Tu produis des avis de valeur rigoureux en croisant trois sources, par ordre de fiabilité :
1. Les transactions DVF (prix de vente RÉELS actés) — la référence factuelle.
2. Les biens actuellement en vente (concurrence) — des prix AFFICHÉS, donc à pondérer d'une marge de négociation (généralement 3 à 7 %).
3. Les biens invendus depuis plus de 90 jours — ils révèlent le plafond de prix que le marché REFUSE : l'estimation doit impérativement rester sous ce niveau à prestations comparables.

Règles :
- Analyse les photos fournies pour évaluer l'état réel, la luminosité, les prestations et la qualité perçue ; signale tout écart avec l'état déclaré.
- Applique des ajustements explicites (DPE, étage, extérieur, stationnement, travaux).
- Si le prix souhaité par le vendeur est renseigné, positionne-le par rapport à ton estimation et donne au commercial les arguments chiffrés pour recadrer si nécessaire.
- Sois précis et chiffré : cite les prix au m² que tu utilises et d'où ils viennent.
- L'indice de confiance reflète la quantité et la cohérence des données (DVF absent ou peu de comparables → confiance basse).
- Réponds intégralement en français.`;

function fmtComparables(list: PropertyInput["concurrence"]): string {
  if (list.length === 0) return "(aucun renseigné)";
  return list
    .map((c) => {
      const pm2 = c.prix && c.surface ? ` soit ${Math.round(c.prix / c.surface)} €/m²` : "";
      const jours = c.joursEnLigne != null ? ` — en ligne depuis ${c.joursEnLigne} jours` : "";
      return `- ${c.description || "bien"} : ${c.surface ?? "?"} m², ${c.prix ?? "?"} €${pm2}${jours}`;
    })
    .join("\n");
}

function buildUserText(input: PropertyInput, dvfSales: DvfSale[]): string {
  const dvfBlock =
    dvfSales.length > 0
      ? dvfSales
          .slice(0, 40)
          .map((s) => `- ${s.date} | ${s.typeLocal} | ${s.surface ?? "?"} m² | ${s.valeurFonciere} € | ${s.prixM2 ?? "?"} €/m² | ${s.commune}`)
          .join("\n")
      : "(données DVF indisponibles pour ce secteur — baisse l'indice de confiance en conséquence)";

  return `# BIEN À ESTIMER

## Localisation
Adresse : ${input.adresse}, ${input.codePostal} ${input.ville}${input.quartier ? ` — quartier : ${input.quartier}` : ""}

## Caractéristiques
- Type : ${input.typeBien}
- Surface habitable : ${input.surfaceHabitable ?? "?"} m²${input.surfaceTerrain ? ` | Terrain : ${input.surfaceTerrain} m²` : ""}
- Pièces : ${input.nbPieces ?? "?"} | Chambres : ${input.nbChambres ?? "?"} | Salles de bain : ${input.nbSallesDeBain ?? "?"}
- Étage : ${input.etage || "n.c."} | Ascenseur : ${input.ascenseur ? "oui" : "non"}
- Année de construction : ${input.anneeConstruction || "n.c."}
- DPE : ${input.dpe || "n.c."} | GES : ${input.ges || "n.c."}
- État général : ${input.etatGeneral || "n.c."}${input.travauxAPrevoir ? ` | Travaux à prévoir : ${input.travauxAPrevoir}` : ""}
- Chauffage : ${input.chauffage || "n.c."} | Exposition : ${input.exposition || "n.c."}
- Extérieur : ${input.exterieur.length ? input.exterieur.join(", ") : "aucun"}
- Stationnement : ${input.stationnement || "aucun"} | Cave : ${input.cave ? "oui" : "non"}
- Charges copro : ${input.chargesCopro ?? "n.c."} €/mois | Taxe foncière : ${input.taxeFonciere ?? "n.c."} €/an

## Contexte de vente
- Prix souhaité par le vendeur : ${input.prixSouhaiteVendeur ? `${input.prixSouhaiteVendeur} €` : "non communiqué"}
- Contexte : ${input.contexteVente || "n.c."}
${input.commentaires ? `- Commentaires du commercial : ${input.commentaires}` : ""}

# DONNÉES DE MARCHÉ

## 1. Transactions DVF (ventes réelles actées, code postal ${input.codePostal})
${dvfBlock}

## 2. Concurrence actuellement en vente
${fmtComparables(input.concurrence)}

## 3. Invendus (+90 jours de commercialisation)
${fmtComparables(input.invendus)}

Produis l'avis de valeur complet au format JSON demandé.`;
}

/**
 * Appelle Claude pour produire l'avis de valeur. Lance une exception en cas
 * d'échec — l'appelant bascule alors sur le moteur statistique.
 */
export async function computeAiEstimate(
  input: PropertyInput,
  dvfSales: DvfSale[],
): Promise<EstimationReport> {
  const client = new Anthropic();

  const content: Anthropic.ContentBlockParam[] = [];
  for (const photo of input.photos.slice(0, 8)) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: photo.mediaType, data: photo.data },
    });
  }
  content.push({ type: "text", text: buildUserText(input, dvfSales) });

  const stream = client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: SYSTEM_PROMPT,
    output_config: { format: { type: "json_schema", schema: REPORT_SCHEMA } },
    messages: [{ role: "user", content }],
  });

  const message = await stream.finalMessage();

  if (message.stop_reason === "refusal") {
    throw new Error("Requête refusée par les garde-fous du modèle");
  }

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  return JSON.parse(text) as EstimationReport;
}
