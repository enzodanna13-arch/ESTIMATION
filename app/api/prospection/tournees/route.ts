import { verifierAccesEquipe } from "@/lib/historyAuth";
import { listTournees } from "@/lib/serverProspection";
import { genererTournees } from "@/lib/prospectionTournees";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  try {
    return Response.json({ tournees: await listTournees() });
  } catch {
    return Response.json({ tournees: [] });
  }
}

// POST → (re)génère les tournées du jour pour tous les négociateurs.
export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  try {
    const res = await genererTournees();
    return Response.json({ ok: true, ...res });
  } catch (err) {
    console.error("Génération de tournées impossible :", err);
    return Response.json({ ok: false, error: "Génération impossible" }, { status: 500 });
  }
}
