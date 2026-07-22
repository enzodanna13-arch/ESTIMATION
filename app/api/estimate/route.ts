import { auditLiens, auditUrls, computeFinalReport, extractListingFacts, mergeListingFacts } from "@/lib/ai";
import { fetchDvfContext } from "@/lib/dvf";
import { computeFallbackBienLoue, computeFallbackEstimate, computeFallbackLocatif } from "@/lib/fallback";
import { fetchLoyerIndicateur } from "@/lib/loyers";
import { oll13Indicateur } from "@/lib/oll13";
import { loyerNetAnnuel, prixParRendement, RENDEMENT_NET_BAS, RENDEMENT_NET_HAUT, RENDEMENT_NET_MEDIAN } from "@/lib/rendement";
import { buildDvfReferences, medianeReferences } from "@/lib/references";
import { saveEstimationServer } from "@/lib/serverHistory";
import { surfaceHabitableTotale } from "@/lib/surfaces";
import type { PropertyInput } from "@/lib/types";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

/**
 * Estimation en une seule phase, fondée exclusivement sur les ventes
 * réelles DVF (aucune annonce en ligne) : récupération des ventes autour
 * de l'adresse du bien, puis analyse des photos + rédaction du dossier.
 * Réponse en streaming NDJSON (statuts de progression + résultat).
 */
export async function POST(request: Request) {
  let body: PropertyInput;
  try {
    body = (await request.json()) as PropertyInput;
  } catch {
    return Response.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  // En mission audit avec un lien d'annonce, la fiche du bien (localisation
  // comprise) est extraite de l'annonce par l'IA : la saisie se limite au
  // client + lien. Sinon, code postal et type de bien restent obligatoires.
  const auditParLien = (body.mission ?? "vente") === "audit" && auditUrls(body).length > 0;
  if (!auditParLien && (!body.codePostal || !body.typeBien)) {
    return Response.json(
      { error: "Le code postal et le type de bien sont obligatoires" },
      { status: 400 },
    );
  }
  if (auditParLien && !process.env.ANTHROPIC_API_KEY && !body.codePostal) {
    return Response.json(
      { error: "L'audit par lien d'annonce nécessite le moteur IA (clé non configurée)" },
      { status: 400 },
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      const heartbeat = setInterval(() => send({ type: "ping" }), 8000);
      try {
        const mission = body.mission ?? "vente";
        // Audit par lien : l'IA ouvre l'annonce et en extrait la fiche du
        // bien AVANT tout — l'estimation se déroule ensuite exactement
        // comme une estimation classique (même base de calcul DVF)
        if (auditParLien && process.env.ANTHROPIC_API_KEY) {
          try {
            const facts = await extractListingFacts(auditLiens(body), (label: string) =>
              send({ type: "status", label }),
            );
            body = mergeListingFacts(body, facts);
          } catch (err) {
            console.error("Extraction de l'annonce impossible :", err);
          }
          if (!/^\d{5}$/.test(body.codePostal ?? "")) {
            send({
              type: "error",
              error:
                "Impossible de lire la localisation dans cette annonce (portail bloqué ?). Réessayez, ou vérifiez que le lien est bien public.",
            });
            return;
          }
          send({
            type: "status",
            label: `Bien identifié : ${body.typeBien} ${body.surfaceHabitable ?? "?"} m² à ${body.ville || body.codePostal} — analyse du marché…`,
          });
        }
        send({ type: "status", label: "Récupération des ventes réelles autour du bien (DVF)…" });
        // Loyers de référence : dans les Bouches-du-Rhône, le tableau
        // OFFICIEL de l'observatoire local (OLL 13, zone 5 — Martigues…)
        // fait foi ; ailleurs, la « carte des loyers » nationale
        const [{ sales: dvfSales, subject }, loyer] = await Promise.all([
          fetchDvfContext(body.codePostal, body.typeBien, body.adresse, body.ville),
          mission === "locatif"
            ? (oll13Indicateur(body.codePostal, body.typeBien, body.nbPieces)
                ? Promise.resolve(oll13Indicateur(body.codePostal, body.typeBien, body.nbPieces))
                : fetchLoyerIndicateur(body.codePostal, body.typeBien, body.nbPieces))
            : Promise.resolve(null),
        ]);
        const dvfSource = dvfSales.length > 0 ? "api" : "indisponible";
        if (mission === "locatif") {
          send({
            type: "status",
            label: loyer
              ? `Loyers de référence (${loyer.millesime}) : ${loyer.loyerM2Bas} → ${loyer.loyerM2} €/m² (bas → médian, ${loyer.typologie})…`
              : "Indicateur officiel des loyers indisponible — estimation prudente…",
          });
        }

        let report = null;
        let engine: "ia" | "statistique" = "statistique";
        if (process.env.ANTHROPIC_API_KEY) {
          try {
            report = await computeFinalReport(
              body,
              dvfSales,
              (label: string) => send({ type: "status", label }),
              loyer,
            );
            engine = "ia";
          } catch (err) {
            console.error("Échec de la rédaction IA, bascule sur le moteur statistique :", err);
            send({ type: "status", label: "Rédaction IA indisponible — calcul statistique…" });
          }
        }
        if (!report) {
          report =
            mission === "locatif"
              ? computeFallbackLocatif(body, dvfSales, loyer)
              : mission === "bienloue"
                ? computeFallbackBienLoue(body, dvfSales)
                : computeFallbackEstimate(body, dvfSales);
        }
        // Filet de sécurité : le tableau des comparables DVF ne doit
        // jamais être vide dès que des ventes existent (hors mission
        // locative, qui n'affiche pas de tableau de ventes)
        if (mission !== "locatif" && report.references_dvf.length === 0 && dvfSales.length > 0) {
          const det = buildDvfReferences(dvfSales, body);
          report = {
            ...report,
            references_dvf: det.references,
            base_mediane: report.base_mediane > 0 ? report.base_mediane : det.baseMediane,
          };
        }
        // Cohérence dossier : la base du calcul d'ajustements est TOUJOURS
        // la médiane des prix actés du tableau des comparables. Si l'IA a
        // utilisé une autre base (ex. médiane €/m² transposée à la surface),
        // l'écart devient une ligne d'ajustement explicite — la somme du
        // tableau reste exactement égale au cœur de fourchette.
        const medRefs = mission === "locatif" ? 0 : medianeReferences(report.references_dvf);
        if (medRefs > 0 && report.base_mediane !== medRefs) {
          const diff = report.base_mediane - medRefs;
          const ajustements = [...report.ajustements];
          if (ajustements.length > 0) {
            const i = ajustements.findIndex((a) => /transposition|surface/i.test(a.libelle));
            if (i >= 0) {
              ajustements[i] = { ...ajustements[i], montant: ajustements[i].montant + diff };
            } else if (Math.abs(diff) >= 1000) {
              ajustements.unshift({
                libelle: `Surface du bien (${surfaceHabitableTotale(body) || "?"} m² habitables) vs références`,
                montant: diff,
              });
            } else {
              // écart d'arrondi : absorbé par la première ligne existante
              ajustements[0] = { ...ajustements[0], montant: ajustements[0].montant + diff };
            }
          }
          report = { ...report, base_mediane: medRefs, ajustements };
        }
        // Prix psychologiques : arrondi VERS LE BAS des prix affichés —
        // au millier pour une vente, à la dizaine pour un loyer mensuel
        const step = mission === "locatif" ? 10 : 1000;
        const floorStep = (v: number) => (v > 0 ? Math.floor(v / step) * step : v);
        report = {
          ...report,
          prix_presentation: floorStep(report.prix_presentation),
          scenarios_prix: report.scenarios_prix.map((s) => ({ ...s, prix: floorStep(s.prix) })),
        };
        // Estimation locative : verrou déterministe — la fourchette de
        // loyer va TOUJOURS de la valeur BASSE à la valeur MÉDIANE du
        // tableau officiel des loyers (le médian est le PLAFOND du loyer
        // conseillé ; la valeur haute du tableau n'est qu'informative)
        if (mission === "locatif" && loyer) {
          const surfLoc = surfaceHabitableTotale(body);
          if (surfLoc > 0) {
            const floor10 = (v: number) => Math.floor(v / 10) * 10;
            const basM = floor10(loyer.loyerM2Bas * surfLoc);
            const medM = floor10(loyer.loyerM2 * surfLoc);
            const hautM = floor10(loyer.loyerM2Haut * surfLoc);
            if (basM > 0 && medM > basM) {
              const scen = report.scenarios_prix;
              const keepLoc = (strategie: string, prix: number, delai: string, commentaire: string) => {
                const s = scen.find((x) => x.strategie === strategie);
                return { strategie, prix, delai: s?.delai || delai, commentaire: s?.commentaire || commentaire };
              };
              const estime = Math.min(medM, Math.max(basM, floor10(report.prix_estime) || floor10((basM + medM) / 2)));
              // Cohérence du tableau d'ajustements : base = loyer médian,
              // et la somme des lignes aboutit exactement au loyer retenu
              const somme = report.ajustements.reduce((s, a) => s + a.montant, 0);
              const ajustementsLoc =
                medM + somme === estime
                  ? report.ajustements
                  : estime === medM
                    ? []
                    : [{ libelle: "Positionnement dans la fourchette officielle (atouts et défauts de votre bien)", montant: estime - medM }];
              report = {
                ...report,
                ajustements: ajustementsLoc,
                prix_estime: estime,
                prix_presentation: medM,
                prix_m2: Math.round((estime / surfLoc) * 100) / 100,
                base_mediane: medM,
                scenarios_prix: [
                  keepLoc("Vente rapide", basM, "1 à 3 semaines", "Le bas de la fourchette officielle du secteur : votre bien se loue immédiatement et vous choisissez parmi plusieurs dossiers."),
                  keepLoc("Prix optimal", medM, "2 à 6 semaines", "Le loyer médian officiel du secteur : le juste loyer que nous conseillons pour louer dans de bons délais et sans vacance."),
                ],
                // Fourchette AFFICHÉE : du m² BAS au m² HAUT du tableau
                // officiel — le loyer conseillé reste au MÉDIAN
                fourchette_basse: basM,
                fourchette_haute: hautM > medM ? hautM : medM,
              };
            }
          }
        }
        // Bien vendu loué : verrou déterministe — le prix est TOUJOURS la
        // capitalisation du loyer NET annuel entre 6 et 8 % de rentabilité
        // nette (Vente rapide = ÷8 %, Prix optimal = ÷6 %), quel que soit
        // le résultat rédigé par l'IA
        if (mission === "bienloue") {
          const net = loyerNetAnnuel(body);
          if (net > 0) {
            const pRapide = prixParRendement(net, RENDEMENT_NET_HAUT);
            const pOptimal = prixParRendement(net, RENDEMENT_NET_BAS);
            const pEstime = prixParRendement(net, RENDEMENT_NET_MEDIAN);
            const surfBl = surfaceHabitableTotale(body);
            const scen = report.scenarios_prix;
            const keep = (strategie: string, prix: number, delai: string, commentaire: string) => {
              const s = scen.find((x) => x.strategie === strategie);
              return { strategie, prix, delai: s?.delai || delai, commentaire: s?.commentaire || commentaire };
            };
            report = {
              ...report,
              prix_estime: pEstime,
              prix_presentation: pOptimal,
              prix_m2: surfBl > 0 ? Math.round(pEstime / surfBl) : report.prix_m2,
              ajustements: [],
              scenarios_prix: [
                keep("Vente rapide", pRapide, "4 à 8 semaines", "À ce prix, l'acheteur obtient 8 % de rentabilité nette : votre bien devient une évidence pour les investisseurs du secteur."),
                keep("Prix optimal", pOptimal, "2 à 4 mois", "Le haut de fourchette défendable : 6 % de rentabilité nette pour l'acheteur, le plancher qu'accepte le marché de l'investissement."),
              ],
            };
          }
        }
        // Cohérence de la synthèse : la fourchette de valeur va du prix
        // « Vente rapide » au haut de fourchette. En vente et en audit, le
        // « Prix optimal » (= prix de présentation / de relance) se place
        // TOUJOURS AU MILIEU de la fourchette, arrondi vers le bas à un
        // seuil attractif (ex. 349 000-365 000 → prix optimal 355 000) —
        // en locatif et bien loué, les verrous dédiés ci-dessus font foi
        const scRapide = report.scenarios_prix.find((s) => s.strategie === "Vente rapide")?.prix ?? 0;
        const scOptimal = report.scenarios_prix.find((s) => s.strategie === "Prix optimal")?.prix ?? 0;
        if (scRapide > 0 && scOptimal > scRapide) {
          if (mission === "vente" || mission === "audit") {
            const haut = Math.max(scOptimal, report.fourchette_haute);
            const stepMid = haut >= 200000 ? 5000 : 1000;
            const optimalMid = Math.max(scRapide, Math.floor((scRapide + haut) / 2 / stepMid) * stepMid);
            report = {
              ...report,
              fourchette_basse: scRapide,
              fourchette_haute: haut,
              prix_presentation: optimalMid,
              scenarios_prix: report.scenarios_prix.map((s) =>
                s.strategie === "Prix optimal" ? { ...s, prix: optimalMid } : s,
              ),
            };
          } else if (mission === "bienloue") {
            report = { ...report, fourchette_basse: scRapide, fourchette_haute: scOptimal };
          }
          // locatif : la fourchette (m² bas → m² haut) est déjà verrouillée
          // par le bloc dédié ci-dessus — ne pas la réécrire ici
        }
        // Audit : le prix rendu est TOUJOURS STRICTEMENT INFÉRIEUR au prix
        // affiché actuel — relancer au prix qui ne se vend pas n'aurait
        // aucun effet. Plafond : au moins ~1 % sous le prix affiché.
        if (mission === "audit" && (body.prixAffiche ?? 0) > 0) {
          const affiche = body.prixAffiche!;
          const stepC = affiche >= 200000 ? 5000 : 1000;
          const cap = Math.floor((affiche * 0.99) / stepC) * stepC;
          if (cap > 0 && report.fourchette_haute > cap) {
            const haut = cap;
            let rapide = report.fourchette_basse;
            if (rapide >= haut) rapide = Math.floor((haut * 0.95) / 1000) * 1000;
            const stepMid = haut >= 200000 ? 5000 : 1000;
            const optimalMid = Math.max(rapide, Math.floor((rapide + haut) / 2 / stepMid) * stepMid);
            const estime = Math.min(Math.max(report.prix_estime, rapide), haut);
            // Le tableau d'ajustements reste exact : l'écart d'alignement
            // devient une ligne explicite du calcul
            const diffEstime = estime - report.prix_estime;
            const ajustements =
              diffEstime !== 0 && report.ajustements.length > 0
                ? [...report.ajustements, { libelle: "Alignement sous le prix affiché actuel (bien en échec à ce prix)", montant: diffEstime }]
                : report.ajustements;
            const surfAudit = surfaceHabitableTotale(body);
            report = {
              ...report,
              fourchette_basse: rapide,
              fourchette_haute: haut,
              prix_presentation: optimalMid,
              prix_estime: estime,
              prix_m2: surfAudit > 0 ? Math.round(estime / surfAudit) : report.prix_m2,
              ajustements,
              scenarios_prix: report.scenarios_prix.map((s) =>
                s.strategie === "Prix optimal"
                  ? { ...s, prix: optimalMid }
                  : s.strategie === "Vente rapide"
                    ? { ...s, prix: rapide }
                    : { ...s, prix: Math.min(s.prix, cap) },
              ),
            };
          }
        }
        // Historique PARTAGÉ de l'équipe (Vercel Blob) : sauvegarde
        // automatique du dossier — un échec n'empêche jamais le résultat
        try {
          await saveEstimationServer({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            createdAt: Date.now(),
            client:
              [body.clientCivilite, body.clientPrenom, body.clientNom].filter(Boolean).join(" ") ||
              "Client non renseigné",
            bien: `${mission === "audit" ? "Audit — " : mission === "locatif" ? "Locatif — " : mission === "bienloue" ? "Bien loué — " : ""}${body.typeBien.charAt(0).toUpperCase()}${body.typeBien.slice(1)}${body.nbPieces ? ` ${body.nbPieces} p.` : ""}${surfaceHabitableTotale(body) > 0 ? ` · ${surfaceHabitableTotale(body)} m²` : ""}`,
            ville: `${body.codePostal} ${body.ville ?? ""}`.trim(),
            negociateur: body.negociateur ?? "",
            fourchetteBasse: report.fourchette_basse,
            fourchetteHaute: report.fourchette_haute,
            result: { report, dvfSales, dvfSource, engine, subject },
            input: body,
          });
        } catch (err) {
          console.error("Sauvegarde de l'historique impossible :", err);
        }
        // La fiche renvoyée inclut la saisie ENRICHIE par l'annonce (mission
        // audit par lien) : le dossier affiche ainsi le bien complet
        send({ type: "result", data: { phase: "rapport", report, dvfSales, dvfSource, engine, subject, input: body } });
      } catch (err) {
        send({ type: "error", error: err instanceof Error ? err.message : "Erreur inattendue" });
      } finally {
        clearInterval(heartbeat);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-cache, no-transform",
    },
  });
}
