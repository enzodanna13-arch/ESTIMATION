import { garde } from "@/lib/syndic/guard";
import { listerLots, listerResidences, residenceVide, sauverResidence } from "@/lib/syndic/residences";
import type { Residence } from "@/lib/syndic/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const g = await garde(request, "acceder");
  if ("erreur" in g) return g.erreur;
  const [residences, lots] = await Promise.all([listerResidences(), listerLots()]);
  const nbLots = new Map<string, number>();
  for (const l of lots) nbLots.set(l.residenceId, (nbLots.get(l.residenceId) ?? 0) + 1);
  return Response.json({
    residences: residences.map((r) => ({ ...r, nbLots: nbLots.get(r.id) ?? 0 })),
  });
}

export async function POST(request: Request) {
  const g = await garde(request, "administrer");
  if ("erreur" in g) return g.erreur;
  let body: Partial<Residence>;
  try { body = (await request.json()) as Partial<Residence>; } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }
  if (!body.nom) return Response.json({ error: "Le nom de la résidence est requis" }, { status: 400 });
  const residence = residenceVide({
    nom: body.nom, adresse: body.adresse ?? "", codePostal: body.codePostal ?? "", commune: body.commune ?? "",
    gestionnaireTitulaireId: body.gestionnaireTitulaireId ?? null,
    gestionnaireSuppleantId: body.gestionnaireSuppleantId ?? null,
    refExterne: body.refExterne ?? "", actif: body.actif ?? true,
  });
  await sauverResidence(residence);
  return Response.json({ residence });
}
