import Anthropic from "@anthropic-ai/sdk";
import type { DvfSale, EstimationReport, PropertyInput } from "./types";

const REPORT_SCHEMA = {
  type: "object",
  properties: {
    prix_estime: { type: "number", description: "Prix de vente recommandé en euros" },
    fourchette_basse: { type: "number" },
    fourchette_haute: { type: "number" },
    prix_m2: { type: "number", description: "Prix au m² retenu" },
    prix_presentation: { type: "number", description: "Prix de présentation conseillé (prix affiché), avec marge de négociation de 2 à 4 % au-dessus du prix estimé" },
    description_bien: { type: "string", description: "Description professionnelle et vendeuse du bien en 2 paragraphes (style avis de valeur d'agence)" },
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
    etat_notes: {
      type: "array",
      description: "Notation de l'état à partir des photos (1 à 5) — vide si aucune photo",
      items: {
        type: "object",
        properties: {
          categorie: { type: "string", description: "Ex : État général, Luminosité, Cuisine, Salle de bain, Sols & murs, Extérieur" },
          note: { type: "number", description: "1 (à rénover) à 5 (excellent)" },
        },
        required: ["categorie", "note"],
        additionalProperties: false,
      },
    },
    coefficient_etat: { type: "string", description: "Synthèse de l'état retenu, ex : « Bon état d'usage »" },
    impact_etat: { type: "number", description: "Impact net de l'état sur la valeur, en euros signés (ex : -6000)" },
    annonces_concurrentes: {
      type: "array",
      description: "Annonces concurrentes trouvées via la recherche web (4 à 8)",
      items: {
        type: "object",
        properties: {
          titre: { type: "string", description: "Ex : T3 65 m² rue Mercière" },
          url_annonce: { type: "string", description: "URL de l'annonce si connue avec certitude, sinon chaîne vide. Ne JAMAIS inventer une URL." },
          url_photo: { type: "string", description: "URL directe de la photo principale de l'annonce (og:image récupérée via web_fetch), sinon chaîne vide. Ne JAMAIS inventer une URL." },
          prix: { type: "number", description: "Prix affiché en euros (0 si inconnu)" },
          surface: { type: "number", description: "Surface en m² (0 si inconnue)" },
          prix_m2: { type: "number", description: "Prix au m² (0 si non calculable)" },
          caracteristiques: { type: "string", description: "Étage, état, extérieur, DPE… tel que trouvé" },
          anciennete: { type: "string", description: "Fraîcheur de l'annonce si détectable (ex : « en ligne depuis 3 mois », « prix baissé », « récente »)" },
          source: { type: "string", description: "Portail ou agence (SeLoger, Leboncoin, agence X…)" },
          comparaison: { type: "string", description: "Positionnement en 1 phrase vs le bien estimé" },
          positionnement: { type: "string", enum: ["supérieur", "équivalent", "inférieur"], description: "Niveau de prestations global vs le bien estimé" },
        },
        required: ["titre", "url_annonce", "url_photo", "prix", "surface", "prix_m2", "caracteristiques", "anciennete", "source", "comparaison", "positionnement"],
        additionalProperties: false,
      },
    },
    audit_concurrentiel: {
      type: "object",
      description: "Synthèse chiffrée de l'audit du marché concurrent",
      properties: {
        nb_annonces_analysees: { type: "number", description: "Nombre total d'annonces examinées pendant la recherche (pas seulement celles restituées)" },
        prix_m2_min: { type: "number", description: "€/m² le plus bas observé sur les comparables (0 si inconnu)" },
        prix_m2_median: { type: "number", description: "€/m² médian observé (0 si inconnu)" },
        prix_m2_max: { type: "number", description: "€/m² le plus haut observé (0 si inconnu)" },
        tension_marche: { type: "string", description: "Lecture de la tension : ex « Offre abondante, rotation lente au-dessus de 3 300 €/m² »" },
        synthese: { type: "string", description: "Conclusion de l'audit : où se situe la zone de prix gagnante et pourquoi" },
      },
      required: ["nb_annonces_analysees", "prix_m2_min", "prix_m2_median", "prix_m2_max", "tension_marche", "synthese"],
      additionalProperties: false,
    },
    scenarios_prix: {
      type: "array",
      description: "Exactement 3 scénarios de positionnement prix, dans cet ordre : Vente rapide, Prix optimal, Prix plafond",
      items: {
        type: "object",
        properties: {
          strategie: { type: "string", enum: ["Vente rapide", "Prix optimal", "Prix plafond"] },
          prix: { type: "number", description: "Prix affiché du scénario en euros" },
          delai: { type: "string", description: "Délai de vente attendu, ex « 4 à 6 semaines »" },
          commentaire: { type: "string", description: "Pour qui / quel risque / quel bénéfice, en 1-2 phrases" },
        },
        required: ["strategie", "prix", "delai", "commentaire"],
        additionalProperties: false,
      },
    },
    references_dvf: {
      type: "array",
      description: "4 à 6 références DVF les plus comparables, choisies dans la liste fournie",
      items: {
        type: "object",
        properties: {
          localisation: { type: "string", description: "Commune / secteur" },
          detail: { type: "string", description: "Ex : T4 · terrasse · étage élevé" },
          surface: { type: "number" },
          date: { type: "string", description: "MM/AAAA" },
          prix: { type: "number", description: "Prix acté en euros" },
          prix_m2: { type: "number" },
        },
        required: ["localisation", "detail", "surface", "date", "prix", "prix_m2"],
        additionalProperties: false,
      },
    },
    base_mediane: { type: "number", description: "Valeur de base issue de la médiane des références comparables, en euros (0 si non calculable)" },
    ajustements: {
      type: "array",
      description: "Ajustements chiffrés appliqués à la base médiane pour aboutir au prix estimé (2 à 6 lignes)",
      items: {
        type: "object",
        properties: {
          libelle: { type: "string", description: "Ex : Terrasse 12 m² + vue dégagée" },
          montant: { type: "number", description: "Montant signé en euros (ex : 9000 ou -6000)" },
        },
        required: ["libelle", "montant"],
        additionalProperties: false,
      },
    },
    etapes_commercialisation: {
      type: "array",
      description: "4 à 5 actions concrètes de mise en marché, format « Titre — détail »",
      items: { type: "string" },
    },
    points_forts: { type: "array", items: { type: "string" } },
    points_faibles: { type: "array", items: { type: "string" } },
    strategie_commercialisation: { type: "string" },
    argumentaire_vendeur: { type: "string", description: "Argumentaire prêt à l'emploi pour défendre le prix face au vendeur" },
  },
  required: [
    "prix_estime", "fourchette_basse", "fourchette_haute", "prix_m2",
    "prix_presentation", "description_bien",
    "indice_confiance", "delai_vente_estime", "positionnement_marche",
    "analyse_dvf", "analyse_concurrence", "analyse_invendus", "analyse_photos",
    "analyse_par_photo", "etat_notes", "coefficient_etat", "impact_etat",
    "annonces_concurrentes", "audit_concurrentiel", "scenarios_prix",
    "references_dvf", "base_mediane", "ajustements",
    "etapes_commercialisation",
    "points_forts", "points_faibles", "strategie_commercialisation", "argumentaire_vendeur",
  ],
  additionalProperties: false,
} as const;

const SYSTEM_PROMPT = `Tu es un expert en estimation immobilière travaillant pour une équipe commerciale d'agence.
Tu produis des avis de valeur rigoureux en croisant trois sources, par ordre de fiabilité :
1. Les transactions DVF (prix de vente RÉELS actés) — la référence factuelle.
2. Les biens actuellement en vente (concurrence) — des prix AFFICHÉS, donc à pondérer d'une marge de négociation (généralement 3 à 7 %).
3. Les biens invendus depuis plus de 90 jours — ils révèlent le plafond de prix que le marché REFUSE : l'estimation doit impérativement rester sous ce niveau à prestations comparables.

AUDIT CONCURRENTIEL (obligatoire, protocole complet) :
Tu conduis un véritable audit de positionnement prix, comme un pricing analyst :
1. RECENSEMENT — balaie le marché actif du secteur sous plusieurs angles et vise 8 à 12 annonces comparables examinées ; restitue les 6 à 8 plus pertinentes dans annonces_concurrentes, chacune classée « supérieur / équivalent / inférieur » vs le bien.
2. CARTOGRAPHIE — calcule min / médiane / max des €/m² observés et qualifie la tension du marché (volume d'offre, vitesse de rotation, seuils où les annonces stagnent) dans audit_concurrentiel.
3. ZONE GAGNANTE — détermine la zone de prix où le bien est OBJECTIVEMENT le meilleur choix de sa catégorie pour un acheteur (meilleures prestations au même prix, ou même prestations moins cher) ; explique-la dans audit_concurrentiel.synthese.
4. SCÉNARIOS — restitue exactement 3 scénarios chiffrés dans scenarios_prix : « Vente rapide » (sous la zone, délai court), « Prix optimal » (= prix_presentation, le meilleur ratio prix/délai, positionné juste sous la concurrence équivalente), « Prix plafond » (haut de zone, à ne pas dépasser — au-delà le bien rejoint les invendus). Chaque scénario : prix, délai attendu, commentaire.

ANALYSE AUTOMATIQUE DU MARCHÉ LOCAL (obligatoire, EXHAUSTIVE) :
Mène l'analyse la plus poussée possible — multiplie les recherches web sous plusieurs angles (ville + quartier précis, type de bien + surface, baromètres de prix multiples, annonces récentes vs anciennes) avant d'estimer :
- Recherche les annonces de biens comparables actuellement en vente dans la ville/le secteur (portails immobiliers, agences locales) : relève prix affichés, surfaces, prix au m².
- Repère les annonces manifestement anciennes ou re-publiées (mention d'ancienneté, baisse de prix, présence sur plusieurs portails) : elles jouent le rôle d'invendus et fixent le plafond de marché.
- Recherche le prix moyen au m² du secteur (baromètres type MeilleursAgents/SeLoger) pour recouper.
- Cite dans tes analyses les prix et sources que tu as trouvés (nom du portail/baromètre, sans URL).
Les biens éventuellement saisis manuellement par le commercial sont un COMPLÉMENT à ta recherche, pas un substitut.

Règles :
- Analyse les photos fournies pour évaluer l'état réel, la luminosité, les prestations et la qualité perçue ; signale tout écart avec l'état déclaré.
- Pour CHAQUE photo fournie (numérotées dans l'ordre : 1 = première), remplis une entrée de analyse_par_photo : identifie la pièce/vue, liste ses bons points et ses défauts visibles. Sois concret (« joints de carrelage noircis », « belle hauteur sous plafond ») — ces annotations apparaissent dans le dossier remis au vendeur.
- Remplis annonces_concurrentes avec 4 à 8 annonces concrètes issues de ta recherche web : titre, prix, surface, prix/m², caractéristiques, fraîcheur de l'annonce si détectable, portail source, et une phrase de comparaison avec le bien estimé. Mets 0 pour un chiffre introuvable — n'invente jamais un prix.
- Pour chaque annonce concurrente identifiée, essaie d'ouvrir la page de l'annonce avec web_fetch pour : (a) vérifier prix/surface/caractéristiques, (b) récupérer l'URL de la photo principale (balise og:image ou première image de galerie) dans url_photo et l'URL de la page dans url_annonce. Si la page est inaccessible ou la photo introuvable, mets une chaîne vide — n'invente JAMAIS une URL.
- PRÉCISION DE LA FOURCHETTE : le résultat principal est la FOURCHETTE fourchette_basse → fourchette_haute, pas un prix unique. Resserre-la au maximum justifiable (écart de 5 à 8 % entre basse et haute quand les données concordent) en recoupant au moins deux baromètres de prix et les annonces relevées. prix_estime est le cœur de fourchette (sert aux calculs d'ajustements). Justifie les deux bornes dans positionnement_marche (ce qui tire vers la borne basse, ce qui permet la borne haute).
- Applique des ajustements explicites (DPE, étage, extérieur, stationnement, travaux) et RESTITUE-LES dans le champ ajustements : base_mediane (médiane des références comparables) + lignes d'ajustement signées dont la somme aboutit exactement à prix_estime.
- Rédige description_bien comme dans un avis de valeur d'agence haut de gamme : 2 paragraphes factuels et valorisants (distribution, expositions, prestations, état).
- Fixe prix_presentation : le prix affiché conseillé (marge de négociation 2 à 4 % au-dessus de prix_estime), cohérent avec le positionnement sous la concurrence active.
- Si des photos sont fournies, note l'état par catégorie dans etat_notes (1 à 5 : État général, Luminosité, Cuisine, Salle de bain, Sols & murs, Extérieur si visible), synthétise dans coefficient_etat et chiffre impact_etat en euros signés. Sans photo : etat_notes vide, impact_etat 0, coefficient_etat basé sur l'état déclaré.
- Sélectionne dans la liste DVF fournie les 4 à 6 références les plus comparables et restitue-les dans references_dvf. La liste couvre la COMMUNE ENTIÈRE du code postal : privilégie les ventes du quartier si identifiables, mais ÉLARGIS toujours à l'ensemble du code postal pour garantir des références — dès que la liste n'est pas vide, references_dvf ne doit JAMAIS être vide (applique une pondération de localisation dans les ajustements si le comparable vient d'un autre secteur de la commune). Si la liste DVF est vide, restitue un tableau vide — n'invente JAMAIS une transaction.
- Remplis etapes_commercialisation avec 4 à 5 actions concrètes (« Reportage professionnel — photos grand-angle… »).
- Si le prix souhaité par le vendeur est renseigné, positionne-le par rapport à ton estimation et donne au commercial les arguments chiffrés pour recadrer si nécessaire.
- Sois précis et chiffré : cite les prix au m² que tu utilises et d'où ils viennent.
- L'indice de confiance reflète la quantité et la cohérence des données (DVF absent ou peu de comparables → confiance basse).
- Réponds intégralement en français.

FORMAT DE SORTIE (impératif) : réponds EXCLUSIVEMENT par un objet JSON valide — aucun texte avant ou après, aucune balise markdown — conforme exactement au schéma JSON fourni dans le message utilisateur (mêmes noms de champs, mêmes types, tous les champs requis présents).`;

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

## Vendeur & contexte commercial
- Vendeur : ${[input.clientCivilite, input.clientPrenom, input.clientNom].filter(Boolean).join(" ") || "n.c."}
- Horizon de vente : ${input.horizonVente || "n.c."}
- Négociateur en charge : ${input.negociateur || "n.c."}

## Localisation
Adresse : ${input.adresse}, ${input.codePostal} ${input.ville}${input.quartier ? ` — quartier : ${input.quartier}` : ""}

## Caractéristiques
- Type : ${input.typeBien}
- Surface habitable : ${input.surfaceHabitable ?? "?"} m²${input.surfaceTerrain ? ` | Terrain : ${input.surfaceTerrain} m²` : ""}
- Pièces : ${input.nbPieces ?? "?"} | Chambres : ${input.nbChambres ?? "?"} | Salles de bain : ${input.nbSallesDeBain ?? "?"}
- Étage : ${input.etage || "n.c."} | Ascenseur : ${input.ascenseur ? "oui" : "non"}
- Année de construction : ${input.anneeConstruction || "n.c."}
- DPE : ${input.dpe || "n.c."} | GES : ${input.ges || "n.c."}
- État général : ${input.etatGeneral || "n.c."}${input.travauxAPrevoir.length ? ` | Travaux à prévoir : ${input.travauxAPrevoir.join(", ")}` : ""}
- Chauffage : ${input.chauffage || "n.c."} | Exposition : ${input.exposition.length ? input.exposition.join(", ") : "n.c."}
- Luminosité : ${input.luminosite || "n.c."} | Vue : ${input.vue || "n.c."} | Environnement : ${input.environnement || "n.c."}
- Cuisine : ${input.cuisine || "n.c."} | Menuiseries : ${input.menuiseries || "n.c."}${input.mitoyennete ? ` | Mitoyenneté : ${input.mitoyennete}` : ""}
- Équipements : ${input.equipements.length ? input.equipements.join(", ") : "aucun"}
- Extérieur : ${input.exterieur.length ? input.exterieur.join(", ") : "aucun"}
- Stationnement : ${input.stationnement || "aucun"} | Cave : ${input.cave ? "oui" : "non"}
- Charges copro : ${input.chargesCopro ?? "n.c."} €/mois | Taxe foncière : ${input.taxeFonciere ?? "n.c."} €/an

## Contexte de vente
- Prix souhaité par le vendeur : ${input.prixSouhaiteVendeur ? `${input.prixSouhaiteVendeur} €` : "non communiqué"}
- Contexte : ${input.contexteVente || "n.c."}
${input.commentaires ? `- Commentaires du commercial : ${input.commentaires}` : ""}

# DONNÉES DE MARCHÉ

## 1. Transactions DVF (ventes réelles actées — COMMUNE ENTIÈRE du code postal ${input.codePostal})
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
  onProgress: (label: string) => void = () => {},
): Promise<EstimationReport> {
  const client = new Anthropic();

  const content: Anthropic.ContentBlockParam[] = [];
  for (const photo of input.photos.slice(0, 20)) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: photo.mediaType, data: photo.data },
    });
  }
  content.push({ type: "text", text: buildUserText(input, dvfSales) });
  content.push({
    type: "text",
    text: "# SCHÉMA JSON DE LA RÉPONSE (respecte-le exactement)\n" + JSON.stringify(REPORT_SCHEMA),
  });

  // Configuration "analyse maximale" par défaut : Opus 4.8 + effort high.
  // Pour réduire coût/latence : ESTIMATION_MODEL=claude-sonnet-5 et/ou
  // ESTIMATION_EFFORT=medium (variables Vercel, sans redéploiement).
  const model = process.env.ESTIMATION_MODEL ?? "claude-opus-4-8";
  const effort = (process.env.ESTIMATION_EFFORT ?? "high") as "low" | "medium" | "high";

  let messages: Anthropic.MessageParam[] = [{ role: "user", content }];
  let message: Anthropic.Message;

  // La recherche web est un outil serveur : l'API peut rendre la main avec
  // stop_reason "pause_turn" au milieu de sa boucle — on relance pour continuer.
  const MAX_CONTINUATIONS = 6;
  let continuations = 0;
  onProgress(
    input.photos.length > 0
      ? "Analyse des photos et recherche du marché local sur le web…"
      : "Recherche du marché local sur le web (concurrence, invendus, prix au m²)…",
  );
  for (;;) {
    const stream = client.messages.stream({
      model,
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      tools: [
        { type: "web_search_20260209", name: "web_search", max_uses: 8 },
        { type: "web_fetch_20260209", name: "web_fetch", max_uses: 6 },
      ],
      output_config: { effort },
      messages,
    });
    message = await stream.finalMessage();
    if (message.stop_reason === "pause_turn" && continuations < MAX_CONTINUATIONS) {
      continuations += 1;
      onProgress(`Croisement des sources de marché (passe ${continuations + 1})…`);
      messages = [...messages, { role: "assistant", content: message.content }];
      continue;
    }
    onProgress("Rédaction de l'avis de valeur…");
    break;
  }

  if (message.stop_reason === "refusal") {
    throw new Error("Requête refusée par les garde-fous du modèle");
  }

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  return normalizeReport(parseJsonLoose(text));
}

/** Extrait l'objet JSON de la réponse (tolère balises markdown et texte parasite). */
function parseJsonLoose(text: string): Record<string, unknown> {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Réponse IA sans objet JSON");
  return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
}

/** Complète les champs manquants pour garantir la forme attendue par l'interface. */
function normalizeReport(r: Record<string, unknown>): EstimationReport {
  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const arr = <T>(v: unknown) => (Array.isArray(v) ? (v as T[]) : []);
  const audit = (r.audit_concurrentiel ?? {}) as Record<string, unknown>;
  const report: EstimationReport = {
    prix_estime: num(r.prix_estime),
    fourchette_basse: num(r.fourchette_basse),
    fourchette_haute: num(r.fourchette_haute),
    prix_m2: num(r.prix_m2),
    prix_presentation: num(r.prix_presentation),
    description_bien: str(r.description_bien),
    indice_confiance: num(r.indice_confiance),
    delai_vente_estime: str(r.delai_vente_estime),
    positionnement_marche: str(r.positionnement_marche),
    analyse_dvf: str(r.analyse_dvf),
    analyse_concurrence: str(r.analyse_concurrence),
    analyse_invendus: str(r.analyse_invendus),
    analyse_photos: str(r.analyse_photos),
    analyse_par_photo: arr(r.analyse_par_photo),
    etat_notes: arr(r.etat_notes),
    coefficient_etat: str(r.coefficient_etat),
    impact_etat: num(r.impact_etat),
    annonces_concurrentes: arr<EstimationReport["annonces_concurrentes"][number]>(r.annonces_concurrentes).map((a) => ({
      titre: str(a?.titre),
      url_annonce: str(a?.url_annonce),
      url_photo: str(a?.url_photo),
      prix: num(a?.prix),
      surface: num(a?.surface),
      prix_m2: num(a?.prix_m2),
      caracteristiques: str(a?.caracteristiques),
      anciennete: str(a?.anciennete),
      source: str(a?.source),
      comparaison: str(a?.comparaison),
      positionnement: str(a?.positionnement),
    })),
    audit_concurrentiel: {
      nb_annonces_analysees: num(audit.nb_annonces_analysees),
      prix_m2_min: num(audit.prix_m2_min),
      prix_m2_median: num(audit.prix_m2_median),
      prix_m2_max: num(audit.prix_m2_max),
      tension_marche: str(audit.tension_marche),
      synthese: str(audit.synthese),
    },
    scenarios_prix: arr(r.scenarios_prix),
    references_dvf: arr(r.references_dvf),
    base_mediane: num(r.base_mediane),
    ajustements: arr(r.ajustements),
    etapes_commercialisation: arr(r.etapes_commercialisation),
    points_forts: arr(r.points_forts),
    points_faibles: arr(r.points_faibles),
    strategie_commercialisation: str(r.strategie_commercialisation),
    argumentaire_vendeur: str(r.argumentaire_vendeur),
  };
  if (report.prix_estime <= 0 || report.fourchette_basse <= 0) {
    throw new Error("Réponse IA incomplète (prix manquants)");
  }
  return report;
}
