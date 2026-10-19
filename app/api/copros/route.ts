import { verifierAccesEquipe } from "@/lib/historyAuth";
import { computeCoproDataset, getCoprosCache, saveCoprosCache } from "@/lib/serverCopros";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const INSEE_MARTIGUES = "13056";
const MIN_LOTS = 10; // > 10 lots
const depuis5ans = () => { const d = new Date(); d.setFullYear(d.getFullYear() - 5); return d.toISOString().slice(0, 10); };

// GET : renvoie le jeu de données en cache ; le calcule si absent.
export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  try {
    let ds = await getCoprosCache(INSEE_MARTIGUES);
    if (!ds) {
      ds = await computeCoproDataset(INSEE_MARTIGUES, MIN_LOTS, depuis5ans());
      await saveCoprosCache(ds).catch(() => {});
    }
    return Response.json({ dataset: ds });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Chargement impossible" }, { status: 500 });
  }
}

// POST : force le recalcul (mise à jour RNC + DPE). Réservé à l'équipe.
export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  try {
    const ds = await computeCoproDataset(INSEE_MARTIGUES, MIN_LOTS, depuis5ans());
    await saveCoprosCache(ds).catch(() => {});
    return Response.json({ dataset: ds });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Mise à jour impossible" }, { status: 500 });
  }
}
