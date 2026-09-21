import { verifierAccesEquipe } from "@/lib/historyAuth";
import { ecrireRelancesConfig, lireRelancesConfig } from "@/lib/relancesConfig";
import { traiterRelances } from "@/lib/relancesAuto";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Pilotage de la relance SMS automatique depuis l'écran Réglages (activation,
// état, déclenchement manuel pour tester). Réservé à l'équipe.
export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  return Response.json({ config: await lireRelancesConfig() });
}

export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  let body: { actif?: boolean; run?: boolean };
  try { body = (await request.json()) as { actif?: boolean; run?: boolean }; } catch { return Response.json({ error: "Requête invalide" }, { status: 400 }); }

  if (typeof body.actif === "boolean") {
    const config = await ecrireRelancesConfig({ actif: body.actif });
    return Response.json({ config });
  }
  if (body.run) {
    const resume = await traiterRelances();
    return Response.json({ resume, config: await lireRelancesConfig() });
  }
  return Response.json({ error: "Rien à faire" }, { status: 400 });
}
