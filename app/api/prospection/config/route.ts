import { verifierAccesEquipe } from "@/lib/historyAuth";
import { getConfigProspection, saveConfigProspection } from "@/lib/serverProspection";
import type { ProspectionConfig } from "@/lib/prospectionTypes";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  try {
    return Response.json({ config: await getConfigProspection() });
  } catch {
    return Response.json({ error: "Lecture impossible" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  let patch: Partial<ProspectionConfig>;
  try { patch = (await request.json()) as Partial<ProspectionConfig>; } catch { return Response.json({ error: "Requête invalide" }, { status: 400 }); }
  try {
    const config = await saveConfigProspection(patch);
    return Response.json({ config });
  } catch {
    return Response.json({ error: "Enregistrement impossible" }, { status: 500 });
  }
}
