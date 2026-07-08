import Anthropic from "@anthropic-ai/sdk";
import { buildDvfReferences } from "./references";
import type {
  AuditConcurrentiel,
  CompetitorAd,
  DvfSale,
  EstimationReport,
  MarketStudy,
  PropertyInput,
  ReferenceDvf,
} from "./types";

// L'analyse est découpée en 2 phases pour tenir dans le budget d'exécution
// serverless (~5 min par requête) : 1) audit du marché (recherche web),
// 2) analyse des photos + rédaction du dossier (sans outils, donc rapide).

const MARKET_SCHEMA = {
  type: "object",
  properties: {
    analyse_dvf: { type: "string", description: "Analyse des ventes réelles DVF fournies" },
    analyse_concurrence: { type: "string", description: "Analyse chiffrée de la concurrence active (cite prix au m² et sources)" },
    analyse_invendus: { type: "string", description: "Analyse des annonces qui stagnent et du plafond de marché" },
    annonces_concurrentes: {
      type: "array",
      description: "Les 6 à 8 annonces concurrentes les plus pertinentes",
      items: {
        type: "object",
        properties: {
          titre: { type: "string" },
          url_annonce: { type: "string", description: "URL réelle de l'annonce, sinon chaîne vide — ne JAMAIS inventer" },
          url_photo: { type: "string", description: "URL de la photo principale (og:image via web_fetch), sinon chaîne vide — ne JAMAIS inventer" },
          prix: { type: "number", description: "0 si inconnu" },
          surface: { type: "number", description: "0 si inconnue" },
          prix_m2: { type: "number", description: "0 si non calculable" },
          caracteristiques: { type: "string" },
          anciennete: { type: "string", description: "Fraîcheur de l'annonce si détectable" },
          source: { type: "string", description: "Portail ou agence" },
          comparaison: { type: "string", description: "1 phrase vs le bien estimé" },
          positionnement: { type: "string", enum: ["supérieur", "équivalent", "inférieur"] },
        },
        required: ["titre", "url_annonce", "url_photo", "prix", "surface", "prix_m2", "caracteristiques", "anciennete", "source", "comparaison", "positionnement"],
      },
    },
    audit_concurrentiel: {
      type: "object",
      properties: {
        nb_annonces_analysees: { type: "number" },
        prix_m2_min: { type: "number" },
        prix_m2_median: { type: "number" },
        prix_m2_max: { type: "number" },
        tension_marche: { type: "string" },
        synthese: { type: "string", description: "Zone de prix gagnante et pourquoi" },
      },
      required: ["nb_annonces_analysees", "prix_m2_min", "prix_m2_median", "prix_m2_max", "tension_marche", "synthese"],
    },
    references_dvf: {
      type: "array",
      description: "4 à 6 références DVF choisies dans la liste fournie — ne JAMAIS inventer une transaction",
      items: {
        type: "object",
        properties: {
          localisation: { type: "string" },
          detail: { type: "string" },
          surface: { type: "number" },
          date: { type: "string", description: "MM/AAAA" },
          prix: { type: "number" },
          prix_m2: { type: "number" },
        },
        required: ["localisation", "detail", "surface", "date", "prix", "prix_m2"],
      },
    },
    base_mediane: { type: "number", description: "Valeur de base médiane des références comparables ramenée à la surface du bien, en euros (0 si non calculable)" },
  },
  required: ["analyse_dvf", "analyse_concurrence", "analyse_invendus", "annonces_concurrentes", "audit_concurrentiel", "references_dvf", "base_mediane"],
} as const;

const FINAL_SCHEMA = {
  type: "object",
  properties: {
    analyse_dvf: { type: "string", description: "Analyse des ventes réelles DVF fournies (2-4 phrases chiffrées)" },
    references_dvf: {
      type: "array",
      description: "4 à 6 ventes choisies EXCLUSIVEMENT dans la liste DVF fournie — ne JAMAIS inventer une transaction. Ne doit JAMAIS être vide si la liste DVF ne l'est pas (reprends celles de l'étude de marché si elle en contient).",
      items: {
        type: "object",
        properties: {
          localisation: { type: "string" },
          detail: { type: "string" },
          surface: { type: "number" },
          date: { type: "string", description: "MM/AAAA" },
          prix: { type: "number" },
          prix_m2: { type: "number" },
        },
        required: ["localisation", "detail", "surface", "date", "prix", "prix_m2"],
      },
    },
    base_mediane: { type: "number", description: "Valeur médiane des références DVF ramenée à la surface du bien, en euros (0 si non calculable)" },
    prix_estime: { type: "number", description: "Cœur de fourchette en euros" },
    fourchette_basse: { type: "number" },
    fourchette_haute: { type: "number" },
    prix_m2: { type: "number" },
    prix_presentation: { type: "number", description: "Prix affiché conseillé (= scénario Prix optimal)" },
    description_bien: { type: "string", description: "2 paragraphes professionnels et valorisants" },
    indice_confiance: { type: "number", description: "0 à 100" },
    delai_vente_estime: { type: "string" },
    positionnement_marche: { type: "string", description: "Synthèse : justifie les DEUX bornes de la fourchette" },
    analyse_photos: { type: "string", description: "Synthèse de l'analyse visuelle" },
    analyse_par_photo: {
      type: "array",
      description: "Une entrée par photo fournie, dans l'ordre (1 = première)",
      items: {
        type: "object",
        properties: {
          photo: { type: "integer" },
          titre: { type: "string" },
          bons_points: { type: "array", items: { type: "string" } },
          defauts: { type: "array", items: { type: "string" } },
        },
        required: ["photo", "titre", "bons_points", "defauts"],
      },
    },
    etat_notes: {
      type: "array",
      description: "Notes 1-5 par catégorie (État général, Luminosité, Cuisine, Salle de bain, Sols & murs, Extérieur) — vide sans photo",
      items: {
        type: "object",
        properties: { categorie: { type: "string" }, note: { type: "number" } },
        required: ["categorie", "note"],
      },
    },
    coefficient_etat: { type: "string" },
    impact_etat: { type: "number", description: "Impact de l'état en euros signés" },
    scenarios_prix: {
      type: "array",
      description: "Exactement 3 : Vente rapide, Prix optimal, Prix plafond",
      items: {
        type: "object",
        properties: {
          strategie: { type: "string", enum: ["Vente rapide", "Prix optimal", "Prix plafond"] },
          prix: { type: "number" },
          delai: { type: "string" },
          commentaire: { type: "string" },
        },
        required: ["strategie", "prix", "delai", "commentaire"],
      },
    },
    ajustements: {
      type: "array",
      description: "Lignes signées appliquées à la base médiane pour aboutir à prix_estime",
      items: {
        type: "object",
        properties: { libelle: { type: "string" }, montant: { type: "number" } },
        required: ["libelle", "montant"],
      },
    },
    etapes_commercialisation: { type: "array", items: { type: "string" }, description: "4-5 actions « Titre — détail »" },
    points_forts: { type: "array", items: { type: "string" } },
    points_faibles: { type: "array", items: { type: "string" } },
    strategie_commercialisation: { type: "string" },
    argumentaire_vendeur: { type: "string" },
  },
  required: [
    "analyse_dvf", "references_dvf", "base_mediane",
    "prix_estime", "fourchette_basse", "fourchette_haute", "prix_m2", "prix_presentation",
    "description_bien", "indice_confiance", "delai_vente_estime", "positionnement_marche",
    "analyse_photos", "analyse_par_photo", "etat_notes", "coefficient_etat", "impact_etat",
    "scenarios_prix", "ajustements", "etapes_commercialisation",
    "points_forts", "points_faibles", "strategie_commercialisation", "argumentaire_vendeur",
  ],
} as const;

const JSON_RULE = `FORMAT DE SORTIE (impératif) : réponds EXCLUSIVEMENT par un objet JSON valide — aucun texte avant ou après, aucune balise markdown — conforme exactement au schéma JSON fourni dans le message utilisateur.`;

const MARKET_SYSTEM = `Tu es un analyste pricing immobilier. Tu conduis un AUDIT CONCURRENTIEL complet du marché local pour préparer un avis de valeur.

PROTOCOLE (obligatoire, exhaustif) :
1. RECENSEMENT — balaie le marché actif sous plusieurs angles avec web_search (ville + quartier, type + surface, baromètres multiples, annonces récentes vs anciennes) : vise 6 à 10 annonces comparables examinées — sois EFFICACE : requêtes larges et bien choisies plutôt que nombreuses ; restitue les 6 à 8 plus pertinentes, chacune classée supérieur / équivalent / inférieur vs le bien.
2. VÉRIFICATION — pour chaque annonce retenue, essaie d'ouvrir la page avec web_fetch pour vérifier prix/surface et récupérer l'URL de la photo principale (og:image) et de l'annonce. Champ vide si introuvable — n'invente JAMAIS une URL, un prix ou une annonce.
3. CARTOGRAPHIE — min / médiane / max des €/m² observés, tension du marché (volume d'offre, vitesse de rotation, seuils où les annonces stagnent). Les annonces anciennes/re-publiées/baissées jouent le rôle d'invendus : elles révèlent le plafond que le marché refuse.
4. ZONE GAGNANTE — détermine la zone de prix où le bien est objectivement le meilleur choix de sa catégorie et explique pourquoi dans audit_concurrentiel.synthese.
5. DVF — la liste fournie couvre la COMMUNE ENTIÈRE du code postal : sélectionne les 4 à 6 ventes réelles les plus comparables (privilégie le quartier, élargis à la commune si besoin — dès que la liste n'est pas vide, references_dvf ne doit JAMAIS être vide). Calcule base_mediane : la valeur médiane de ces références ramenée à la surface du bien.

Cite les prix au m² et leurs sources (portail/baromètre, sans URL) dans les analyses. Réponds intégralement en français.

${JSON_RULE}`;

const FINAL_SYSTEM = `Tu es un expert en estimation immobilière d'une agence haut de gamme. Tu disposes d'une ÉTUDE DE MARCHÉ complète (audit concurrentiel + ventes réelles DVF) fournie dans le message. Tu produis l'avis de valeur final.

RÈGLES :
- Analyse CHAQUE photo fournie (numérotées dans l'ordre : 1 = première) : pièce/vue identifiée, bons points, défauts visibles concrets — ces fiches figurent dans le dossier remis au vendeur. Note l'état par catégorie (etat_notes, 1 à 5) et chiffre impact_etat en euros signés. Signale tout écart avec l'état déclaré. Sans photo : analyse_par_photo et etat_notes vides, impact_etat 0.
- FOURCHETTE D'ABORD : le résultat principal est fourchette_basse → fourchette_haute, resserrée au maximum justifiable (5 à 8 % d'écart quand les données concordent). prix_estime est le cœur de fourchette. Justifie les deux bornes dans positionnement_marche.
- L'estimation reste SOUS le plafond révélé par les invendus de l'étude de marché, à prestations comparables. Les prix affichés de la concurrence se pondèrent d'une marge de négociation (3 à 7 %).
- references_dvf : sélectionne 4 à 6 ventes réelles dans la liste DVF fournie (reprends celles de l'étude de marché si elle en contient) — dès que la liste DVF n'est pas vide, references_dvf ne doit JAMAIS être vide. Calcule base_mediane (médiane de ces références ramenée à la surface du bien) et rédige analyse_dvf.
- ajustements : pars de base_mediane et détaille les lignes signées (localisation, étage, extérieur, énergie/DPE, état issu des photos, stationnement…) dont la somme aboutit exactement à prix_estime.
- scenarios_prix : exactement 3 scénarios chiffrés — « Vente rapide » (sous la zone gagnante, délai court), « Prix optimal » (= prix_presentation, juste sous la concurrence équivalente, meilleur ratio prix/délai), « Prix plafond » (à ne pas dépasser sous peine de rejoindre les invendus).
- Si le prix souhaité du vendeur est renseigné, positionne-le et fournis dans argumentaire_vendeur les arguments chiffrés prêts à l'emploi pour recadrer si nécessaire.
- description_bien : 2 paragraphes factuels et valorisants, style avis de valeur d'agence.
- indice_confiance : reflète la quantité et la cohérence des données (DVF, annonces, photos).
- Réponds intégralement en français.

${JSON_RULE}`;

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

function buildPropertyText(input: PropertyInput): string {
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
${input.commentaires ? `- Commentaires du négociateur : ${input.commentaires}` : ""}`;
}

function dvfBlock(dvfSales: DvfSale[]): string {
  return dvfSales.length > 0
    ? dvfSales
        .slice(0, 40)
        .map((s) => `- ${s.date} | ${s.typeLocal} | ${s.surface ?? "?"} m² | ${s.valeurFonciere} € | ${s.prixM2 ?? "?"} €/m² | ${s.commune}`)
        .join("\n")
    : "(données DVF indisponibles pour ce secteur — baisse l'indice de confiance en conséquence)";
}

function modelConfig() {
  return {
    model: process.env.ESTIMATION_MODEL ?? "claude-opus-4-8",
    effort: (process.env.ESTIMATION_EFFORT ?? "high") as "low" | "medium" | "high",
  };
}

/** Extrait l'objet JSON de la réponse (tolère balises markdown et texte parasite). */
function parseJsonLoose(text: string): Record<string, unknown> {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Réponse IA sans objet JSON");
  return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
}

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
const str = (v: unknown) => (typeof v === "string" ? v : "");
const arr = <T,>(v: unknown) => (Array.isArray(v) ? (v as T[]) : []);

function normalizeMarket(r: Record<string, unknown>): MarketStudy {
  const audit = (r.audit_concurrentiel ?? {}) as Record<string, unknown>;
  return {
    analyse_dvf: str(r.analyse_dvf),
    analyse_concurrence: str(r.analyse_concurrence),
    analyse_invendus: str(r.analyse_invendus),
    annonces_concurrentes: arr<CompetitorAd>(r.annonces_concurrentes).map((a) => ({
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
    } as AuditConcurrentiel,
    references_dvf: arr(r.references_dvf),
    base_mediane: num(r.base_mediane),
  };
}

/** Phase 1 — audit du marché (recherche web + DVF), sans photos. */
export async function computeMarketStudy(
  input: PropertyInput,
  dvfSales: DvfSale[],
  onProgress: (label: string) => void = () => {},
): Promise<MarketStudy> {
  const client = new Anthropic();
  const { model, effort } = modelConfig();

  const text = `${buildPropertyText(input)}

# DONNÉES DE MARCHÉ

## Transactions DVF (ventes réelles actées — COMMUNE ENTIÈRE du code postal ${input.codePostal})
${dvfBlock(dvfSales)}

## Concurrence saisie par le commercial (complément facultatif à ta recherche web)
${fmtComparables(input.concurrence)}

## Invendus saisis par le commercial (complément facultatif à ta recherche web)
${fmtComparables(input.invendus)}

# SCHÉMA JSON DE LA RÉPONSE (respecte-le exactement)
${JSON.stringify(MARKET_SCHEMA)}`;

  let messages: Anthropic.MessageParam[] = [{ role: "user", content: text }];
  let message: Anthropic.Message;
  const MAX_CONTINUATIONS = 4;
  // Budget temps : la fonction serverless est tuée à 300 s — au-delà de ce
  // seuil on force la conclusion (sans outils) plutôt que de tout perdre.
  const DEADLINE_MS = 195_000;
  const t0 = Date.now();
  let continuations = 0;
  let wrapUp = false;
  onProgress("Audit du marché : recherche des annonces concurrentes sur le web…");
  for (;;) {
    const stream = client.messages.stream({
      model,
      max_tokens: 12000,
      thinking: { type: "adaptive" },
      system: MARKET_SYSTEM,
      ...(wrapUp
        ? {}
        : {
            tools: [
              { type: "web_search_20260209" as const, name: "web_search" as const, max_uses: 6 },
              { type: "web_fetch_20260209" as const, name: "web_fetch" as const, max_uses: 4 },
            ],
          }),
      output_config: { effort },
      messages,
    });
    message = await stream.finalMessage();
    if (message.stop_reason === "pause_turn" && continuations < MAX_CONTINUATIONS) {
      continuations += 1;
      messages = [...messages, { role: "assistant", content: message.content }];
      if (Date.now() - t0 > DEADLINE_MS && !wrapUp) {
        // Trop long : dernière passe sans outils, conclusion immédiate
        wrapUp = true;
        onProgress("Audit du marché : synthèse des données collectées…");
        messages = [
          ...messages,
          { role: "user", content: "Temps écoulé : arrête les recherches et réponds MAINTENANT, uniquement l'objet JSON final conforme au schéma, à partir des éléments déjà collectés." },
        ];
      } else {
        onProgress(`Audit du marché : croisement des sources (passe ${continuations + 1})…`);
      }
      continue;
    }
    break;
  }
  if (message.stop_reason === "refusal") throw new Error("Requête refusée par les garde-fous du modèle");

  const finalText = (msg: Anthropic.Message) =>
    msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

  try {
    return normalizeMarket(parseJsonLoose(finalText(message)));
  } catch {
    // La réponse ne contient pas le JSON attendu : une relance de
    // récupération (sans outils, donc rapide) plutôt que de perdre l'audit.
    onProgress("Audit du marché : mise en forme des résultats…");
    const retry = await client.messages
      .stream({
        model,
        max_tokens: 12000,
        thinking: { type: "adaptive" },
        system: MARKET_SYSTEM,
        output_config: { effort: "low" },
        messages: [
          ...messages,
          { role: "assistant", content: message.content },
          { role: "user", content: "Ta réponse précédente n'était pas un JSON exploitable. Réponds MAINTENANT uniquement l'objet JSON final conforme au schéma, à partir des éléments déjà collectés." },
        ],
      })
      .finalMessage();
    return normalizeMarket(parseJsonLoose(finalText(retry)));
  }
}

/** Phase 2 — analyse des photos + rédaction du dossier final (sans outils). */
export async function computeFinalReport(
  input: PropertyInput,
  dvfSales: DvfSale[],
  marche: MarketStudy | null,
  onProgress: (label: string) => void = () => {},
): Promise<EstimationReport> {
  const client = new Anthropic();
  const { model, effort } = modelConfig();

  const content: Anthropic.ContentBlockParam[] = [];
  for (const photo of input.photos.slice(0, 20)) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: photo.mediaType, data: photo.data },
    });
  }
  content.push({
    type: "text",
    text: `${buildPropertyText(input)}

# ÉTUDE DE MARCHÉ (réalisée en phase 1 — appuie-toi dessus)
${marche ? JSON.stringify(marche) : "(étude de marché indisponible — appuie-toi sur les données DVF ci-dessous et baisse l'indice de confiance)"}

# TRANSACTIONS DVF (commune entière du code postal ${input.codePostal})
${dvfBlock(dvfSales)}

# TA MISSION
Produis l'avis de valeur final : analyse chaque photo, fixe la fourchette (5-8 % d'écart justifié), les 3 scénarios de prix, les ajustements depuis la base médiane (${marche?.base_mediane || "à estimer"} €), et l'argumentaire vendeur.

# SCHÉMA JSON DE LA RÉPONSE (respecte-le exactement)
${JSON.stringify(FINAL_SCHEMA)}`,
  });

  onProgress(
    input.photos.length > 0
      ? `Analyse des ${Math.min(input.photos.length, 20)} photos et rédaction de l'avis de valeur…`
      : "Rédaction de l'avis de valeur…",
  );

  const stream = client.messages.stream({
    model,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: FINAL_SYSTEM,
    output_config: { effort },
    messages: [{ role: "user", content }],
  });
  const message = await stream.finalMessage();
  if (message.stop_reason === "refusal") throw new Error("Requête refusée par les garde-fous du modèle");

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  const r = parseJsonLoose(text);

  const emptyMarket: MarketStudy = {
    analyse_dvf: "",
    analyse_concurrence: "",
    analyse_invendus: "",
    annonces_concurrentes: [],
    audit_concurrentiel: {
      nb_annonces_analysees: 0, prix_m2_min: 0, prix_m2_median: 0, prix_m2_max: 0,
      tension_marche: "", synthese: "",
    },
    references_dvf: [],
    base_mediane: 0,
  };
  const m = marche ?? emptyMarket;

  // Références DVF : priorité à l'étude de marché, sinon la sélection du
  // rédacteur final, sinon la sélection déterministe — jamais de tableau
  // vide tant que des ventes DVF existent.
  const deterministic = buildDvfReferences(dvfSales, input);
  const referencesDvf =
    m.references_dvf.length > 0
      ? m.references_dvf
      : arr<ReferenceDvf>(r.references_dvf).length > 0
        ? arr<ReferenceDvf>(r.references_dvf)
        : deterministic.references;
  const baseMediane = m.base_mediane || num(r.base_mediane) || deterministic.baseMediane;

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
    analyse_dvf: m.analyse_dvf || str(r.analyse_dvf),
    analyse_concurrence: m.analyse_concurrence,
    analyse_invendus: m.analyse_invendus,
    analyse_photos: str(r.analyse_photos),
    analyse_par_photo: arr(r.analyse_par_photo),
    etat_notes: arr(r.etat_notes),
    coefficient_etat: str(r.coefficient_etat),
    impact_etat: num(r.impact_etat),
    annonces_concurrentes: m.annonces_concurrentes,
    audit_concurrentiel: m.audit_concurrentiel,
    scenarios_prix: arr(r.scenarios_prix),
    references_dvf: referencesDvf,
    base_mediane: baseMediane,
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
