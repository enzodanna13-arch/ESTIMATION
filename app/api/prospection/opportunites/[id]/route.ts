import { verifierAccesEquipe } from "@/lib/historyAuth";
import { deleteOpportunite, getConfigProspection, getOpportunite, saveOpportunite } from "@/lib/serverProspection";
import { appliquerScore } from "@/lib/prospectionScoring";
import type { Opportunite } from "@/lib/prospectionTypes";

export const dynamic = "force-dynamic";

// Champs modifiables depuis la fiche (jamais l'identité/dédup ni l'historique brut).
const CHAMPS: (keyof Opportunite)[] = [
  "adresse", "numero", "voie", "ville", "codePostal", "codeInsee", "lat", "lon",
  "typeBien", "surface", "periodeConstruction", "dpe", "ges",
  "negociateur", "statut", "passages", "derniereAction", "prochaineRelance", "nbAbsences",
  "dossierId", "estimationId", "leadId", "mandat", "vente", "exclu", "exclusMotif",
];

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  const { id } = await params;
  const opp = await getOpportunite(id);
  if (!opp) return Response.json({ error: "Opportunité introuvable" }, { status: 404 });
  return Response.json({ opportunite: opp });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  const { id } = await params;
  let patch: Partial<Opportunite>;
  try { patch = (await request.json()) as Partial<Opportunite>; } catch { return Response.json({ error: "Requête invalide" }, { status: 400 }); }
  try {
    const opp = await getOpportunite(id);
    if (!opp) return Response.json({ error: "Opportunité introuvable" }, { status: 404 });
    const maj = { ...opp } as unknown as Record<string, unknown>;
    for (const c of CHAMPS) if (c in patch && patch[c] !== undefined) maj[c as string] = (patch as Record<string, unknown>)[c as string];
    const config = await getConfigProspection();
    // Un changement de statut/passage peut modifier le score (pénalité prospecté).
    const scoree = appliquerScore(maj as unknown as Opportunite, config);
    const saved = await saveOpportunite(scoree);
    return Response.json({ opportunite: saved });
  } catch (err) {
    console.error("Mise à jour d'opportunité impossible :", err);
    return Response.json({ error: "Enregistrement impossible" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  const { id } = await params;
  try { await deleteOpportunite(id); return Response.json({ ok: true }); }
  catch { return Response.json({ error: "Suppression impossible" }, { status: 500 }); }
}
