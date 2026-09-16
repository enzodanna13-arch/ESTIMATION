import { garde } from "@/lib/syndic/guard";
import { obtenirResidence, sauverResidence, supprimerResidence } from "@/lib/syndic/residences";
import type { Residence } from "@/lib/syndic/types";

export const dynamic = "force-dynamic";

const CHAMPS: (keyof Residence)[] = [
  "nom", "adresse", "codePostal", "commune",
  "gestionnaireTitulaireId", "gestionnaireSuppleantId", "refExterne", "actif",
];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await garde(request, "administrer");
  if ("erreur" in g) return g.erreur;
  const { id } = await params;
  const residence = await obtenirResidence(id);
  if (!residence) return Response.json({ error: "Résidence introuvable" }, { status: 404 });
  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }
  const maj = { ...residence };
  for (const c of CHAMPS) if (c in body) (maj as Record<string, unknown>)[c] = body[c];
  await sauverResidence(maj);
  return Response.json({ residence: maj });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await garde(request, "administrer");
  if ("erreur" in g) return g.erreur;
  const { id } = await params;
  await supprimerResidence(id);
  return Response.json({ ok: true });
}
