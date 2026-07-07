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
    analyse_par_photo: {
      type: "array",
      description: "Analyse individuelle de chaque photo fournie, dans l'ordre",
      items: {
        type: "object",
        properties: {
          photo: { type: "integer", description: "Numéro de la photo (1 = première fournie)" },
          titre: { type: "string", description: "Ce que montre la photo (ex : Séjour, Cuisine, Façade)" },
          bons_points: { type: "array", items: { type: "string" } },
          defauts: { type: "array", items: { type: "string" } },
        },
        required: ["photo", "titre", "bons_points", "defauts"],
        additionalProperties: false,
      },
    },
    annonces_concurrentes: {
      type: "array",
      description: "Annonces concurrentes trouvées via la recherche web (4 à 8)",
      items: {
        type: "object",
        properties: {
          titre: { type: "string", description: "Ex : T3 65 m² rue Mercière" },
          prix: { type: "number", description: "Prix affiché en euros (0 si inconnu)" },
          surface: { type: "number", description: "Surface en m² (0 si inconnue)" },
          prix_m2: { type: "number", description: "Prix au m² (0 si non calculable)" },
          caracteristiques: { type: "string", description: "Étage, état, extérieur, DPE… tel que trouvé" },
          anciennete: { type: "string", description: "Fraîcheur de l'annonce si détectable (ex : « en ligne depuis 3 mois », « prix baissé », « récente »)" },
          source: { type: "string", description: "Portail ou agence (SeLoger, Leboncoin, agence X…)" },
          comparaison: { type: "string", description: "Positionnement en 1 phrase vs le bien estimé" },
        },
        required: ["titre", "prix", "surface", "prix_m2", "caracteristiques", "anciennete", "source", "comparaison"],
        additionalProperties: false,
      },
    },
    points_forts: { type: "array", items: { type: "string" } },
    points_faibles: { type: "array", items: { type: "string" } },
    strategie_commercialisation: { type: "string" },
    argumentaire_vendeur: { type: "string", description: "Argumentaire prêt à l'emploi pour défendre le prix face au vendeur" },
  },
  required: [
    "prix_estime", "fourchette_basse", "fourchette_haute", "prix_m2",
    "indice_confiance", "delai_vente_estime", "positionnement_marche",
    "analyse_dvf", "analyse_concurrence", "analyse_invendus", "analyse_photos",
    "analyse_par_photo", "annonces_concurrentes",
    "points_forts", "points_faibles", "strategie_commercialisation", "argumentaire_vendeur",
  ],
  additionalProperties: false,
} as const;

const SYSTEM_PROMPT = `Tu es un expert en estimation immobilière travaillant pour une équipe commerciale d'agence.
Tu produis des avis de valeur rigoureux en croisant trois sources, par ordre de fiabilité :
1. Les transactions DVF (prix de vente RÉELS actés) — la référence factuelle.
2. Les biens actuellement en vente (concurrence) — des prix AFFICHÉS, donc à pondérer d'une marge de négociation (généralement 3 à 7 %).
3. Les biens invendus depuis plus de 90 jours — ils révèlent le plafond de prix que le marché REFUSE : l'estimation doit impérativement rester sous ce niveau à prestations comparables.

ANALYSE AUTOMATIQUE DU MARCHÉ LOCAL (obligatoire) :
Tu recherches TOI-MÊME le marché local avec l'outil web_search avant d'estimer :
- Recherche les annonces de biens comparables actuellement en vente dans la ville/le secteur (portails immobiliers, agences locales) : relève prix affichés, surfaces, prix au m².
- Repère les annonces manifestement anciennes ou re-publiées (mention d'ancienneté, baisse de prix, présence sur plusieurs portails) : elles jouent le rôle d'invendus et fixent le plafond de marché.
- Recherche le prix moyen au m² du secteur (baromètres type MeilleursAgents/SeLoger) pour recouper.
- Cite dans tes analyses les prix et sources que tu as trouvés (nom du portail/baromètre, sans URL).
Les biens éventuellement saisis manuellement par le commercial sont un COMPLÉMENT à ta recherche, pas un substitut.

Règles :
- Analyse les photos fournies pour évaluer l'état réel, la luminosité, les prestations et la qualité perçue ; signale tout écart avec l'état déclaré.
- Pour CHAQUE photo fournie (numérotées dans l'ordre : 1 = première), remplis une entrée de analyse_par_photo : identifie la pièce/vue, liste ses bons points et ses défauts visibles. Sois concret (« joints de carrelage noircis », « belle hauteur sous plafond ») — ces annotations apparaissent dans le dossier remis au vendeur.
- Remplis annonces_concurrentes avec 4 à 8 annonces concrètes issues de ta recherche web : titre, prix, surface, prix/m², caractéristiques, fraîcheur de l'annonce si détectable, portail source, et une phrase de comparaison avec le bien estimé. Mets 0 pour un chiffre introuvable — n'invente jamais un prix.
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

## 2. Concurrence saisie par le commercial (complément facultatif à ta recherche web)
${fmtComparables(input.concurrence)}

## 3. Invendus saisis par le commercial (complément facultatif à ta recherche web)
${fmtComparables(input.invendus)}

# TA MISSION
1. Recherche sur le web les biens comparables actuellement en vente à ${input.ville} (${input.codePostal})${input.quartier ? `, secteur ${input.quartier}` : ""} et le prix au m² du secteur.
2. Repère les annonces qui traînent (anciennes, re-publiées, prix baissés) : elles fixent le plafond de marché.
3. Croise avec les données DVF et les saisies du commercial ci-dessus.
4. Produis l'avis de valeur complet au format JSON demandé.`;
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

  // Modèle et effort configurables : Sonnet 5 par défaut (≈ 60-75 % moins cher
  // qu'Opus pour une qualité proche sur ce type d'analyse). Pour un dossier
  // premium : ESTIMATION_MODEL=claude-opus-4-8 et ESTIMATION_EFFORT=high.
  const model = process.env.ESTIMATION_MODEL ?? "claude-sonnet-5";
  const effort = (process.env.ESTIMATION_EFFORT ?? "medium") as "low" | "medium" | "high";

  let messages: Anthropic.MessageParam[] = [{ role: "user", content }];
  let message: Anthropic.Message;

  // La recherche web est un outil serveur : l'API peut rendre la main avec
  // stop_reason "pause_turn" au milieu de sa boucle — on relance pour continuer.
  const MAX_CONTINUATIONS = 6;
  let continuations = 0;
  for (;;) {
    const stream = client.messages.stream({
      model,
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 6 }],
      output_config: { effort, format: { type: "json_schema", schema: REPORT_SCHEMA } },
      messages,
    });
    message = await stream.finalMessage();
    if (message.stop_reason === "pause_turn" && continuations < MAX_CONTINUATIONS) {
      continuations += 1;
      messages = [...messages, { role: "assistant", content: message.content }];
      continue;
    }
    break;
  }

  if (message.stop_reason === "refusal") {
    throw new Error("Requête refusée par les garde-fous du modèle");
  }

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  return JSON.parse(text) as EstimationReport;
}
