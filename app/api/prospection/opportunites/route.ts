import { verifierAccesEquipe } from "@/lib/historyAuth";
import { listOpportunites, saveOpportunite } from "@/lib/serverProspection";
import { appliquerScore } from "@/lib/prospectionScoring";
import { cleDedup } from "@/lib/prospectionDedup";
import { getConfigProspection } from "@/lib/serverProspection";
import { opportuniteVide, type Opportunite } from "@/lib/prospectionTypes";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  try {
    return Response.json({ opportunites: await listOpportunites() });
  } catch (err) {
    console.error("Lecture des opportunités impossible :", err);
    return Response.json({ opportunites: [] });
  }
}

// Création manuelle d'une opportunité (saisie terrain), scorée immédiatement.
export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  let opp: Opportunite;
  try {
    const body = (await request.json()) as { opportunite?: Partial<Opportunite> };
    if (!body.opportunite) throw new Error("opportunite manquante");
    opp = opportuniteVide({ ...body.opportunite, source: body.opportunite.source || "saisie-manuelle" });
    if (!opp.cleBien) opp.cleBien = cleDedup(opp);
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }
  try {
    const config = await getConfigProspection();
    const enregistree = await saveOpportunite(appliquerScore(opp, config));
    return Response.json({ opportunite: enregistree });
  } catch (err) {
    console.error("Création d'opportunité impossible :", err);
    return Response.json({ error: "Enregistrement impossible" }, { status: 500 });
  }
}
