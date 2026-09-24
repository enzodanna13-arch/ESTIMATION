import { verifierAccesEquipe } from "@/lib/historyAuth";
import { appliquerScore } from "@/lib/prospectionScoring";
import {
  getConfigProspection, getOpportunite, getTournee, saveOpportunite, saveTournee,
} from "@/lib/serverProspection";
import type { PassageProspection } from "@/lib/prospectionTypes";

export const dynamic = "force-dynamic";

const JOUR = 86_400_000;

interface Corps {
  opportuniteId: string;
  tourneeId?: string;
  resultat: string;     // statut résultat (Absent, Contact établi…)
  note?: string;
  negociateur?: string;
  relanceLe?: number | null; // relance explicite éventuelle
}

// Enregistre un résultat de passage terrain + applique la logique de relance.
export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  let body: Corps;
  try { body = (await request.json()) as Corps; } catch { return Response.json({ error: "Requête invalide" }, { status: 400 }); }
  if (!body.opportuniteId || !body.resultat) return Response.json({ error: "Champs manquants" }, { status: 400 });

  try {
    const opp = await getOpportunite(body.opportuniteId);
    if (!opp) return Response.json({ error: "Opportunité introuvable" }, { status: 404 });
    const config = await getConfigProspection();
    const now = Date.now();
    const negociateur = body.negociateur || opp.negociateur || "";

    // Calcule la relance selon le résultat et la configuration.
    let prochaineRelance: number | null = body.relanceLe ?? null;
    let statut = body.resultat;
    let nbAbsences = opp.nbAbsences;
    let penaliteManuelle = opp.penaliteManuelle;
    let exclu = opp.exclu;
    let exclusMotif = opp.exclusMotif;

    if (body.resultat === "Absent") {
      nbAbsences += 1;
      if (nbAbsences === 1) prochaineRelance = now + config.relances.absent1Jours * JOUR;
      else if (nbAbsences === 2) prochaineRelance = now + config.relances.absent2Jours * JOUR;
      else {
        // 3e absence : archivage ou baisse de score, selon la configuration.
        if (config.relances.absent3Action === "archiver") { statut = "À exclure"; exclu = true; exclusMotif = "3 absences successives"; prochaineRelance = null; }
        else { penaliteManuelle += config.relances.absent3Points; prochaineRelance = now + config.relances.absent2Jours * JOUR; }
      }
    } else if (body.resultat === "À relancer") {
      prochaineRelance = body.relanceLe ?? now + config.relances.aRelancerJours * JOUR;
    } else if (body.resultat === "Refus de prospection") {
      exclu = true; exclusMotif = "Refus de prospection"; prochaineRelance = null;
    } else {
      // Contact établi / Projet identifié / RDV estimation / Pas de projet…
      prochaineRelance = body.relanceLe ?? null;
    }

    const passage: PassageProspection = {
      id: `${now}-${Math.random().toString(36).slice(2, 6)}`,
      date: now, negociateur, resultat: body.resultat, note: (body.note ?? "").trim(), relanceLe: prochaineRelance,
    };

    const maj = appliquerScore({
      ...opp, statut, passages: [passage, ...opp.passages], derniereAction: now,
      prochaineRelance, nbAbsences, penaliteManuelle, exclu, exclusMotif,
    }, config);
    const saved = await saveOpportunite(maj);

    // Met à jour l'étape de la tournée si fournie.
    if (body.tourneeId) {
      const tournee = await getTournee(body.tourneeId);
      if (tournee) {
        const etapes = tournee.etapes.map((e) => e.opportuniteId === opp.id ? { ...e, fait: true, resultat: body.resultat } : e);
        const tousFaits = etapes.every((e) => e.fait);
        await saveTournee({ ...tournee, etapes, statut: tousFaits ? "terminee" : "en_cours" });
      }
    }

    return Response.json({ opportunite: saved });
  } catch (err) {
    console.error("Enregistrement du résultat impossible :", err);
    return Response.json({ error: "Enregistrement impossible" }, { status: 500 });
  }
}
