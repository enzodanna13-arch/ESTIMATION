import { getDossierPublic } from "@/lib/clientEstimations";

export const dynamic = "force-dynamic";

// Dossier CLIENT par TOKEN secret (URL /estimation/resultat/[token]).
// Aucun mot de passe : le token non devinable EST l'autorisation. Ne renvoie
// que la projection publique (aucune note, aucun lead, aucune donnée interne).
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const dossier = await getDossierPublic(token);
  if (!dossier) return Response.json({ error: "Dossier introuvable." }, { status: 404 });
  return Response.json({ dossier });
}
