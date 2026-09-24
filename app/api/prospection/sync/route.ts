import { verifierAccesEquipe } from "@/lib/historyAuth";
import { synchroniserProspection, rescorerToutes } from "@/lib/prospectionSync";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // synchronisation Open Data potentiellement longue

// POST { rescore?: true } → recalcule seulement les scores.
// POST {}               → synchronisation incrémentale complète.
export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  let body: { rescore?: boolean } = {};
  try { body = (await request.json().catch(() => ({}))) as { rescore?: boolean }; } catch { /* corps vide accepté */ }
  try {
    if (body.rescore) {
      const n = await rescorerToutes();
      return Response.json({ ok: true, rescored: n });
    }
    const res = await synchroniserProspection();
    return Response.json(res);
  } catch (err) {
    console.error("Synchronisation prospection impossible :", err);
    return Response.json({ ok: false, error: "Synchronisation impossible" }, { status: 500 });
  }
}
