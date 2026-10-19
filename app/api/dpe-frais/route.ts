import { verifierAccesEquipe } from "@/lib/historyAuth";
import { computeDpeFrais, getDpeFraisCache, saveDpeFraisCache } from "@/lib/serverDpeFrais";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const INSEE = "13056";
// Fenêtre de « fraîcheur » : les DPE des 3 derniers mois.
const depuis = () => { const d = new Date(); d.setMonth(d.getMonth() - 3); return d.toISOString().slice(0, 10); };

export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  try {
    const cache = await getDpeFraisCache();
    const perime = !cache || Date.now() - cache.updatedAt > 24 * 3600 * 1000;
    if (perime) {
      try {
        const frais = await computeDpeFrais(INSEE, depuis());
        await saveDpeFraisCache(frais).catch(() => {});
        return Response.json({ dataset: frais });
      } catch (e) { if (cache) return Response.json({ dataset: cache }); throw e; }
    }
    return Response.json({ dataset: cache });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Chargement impossible" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  try {
    const ds = await computeDpeFrais(INSEE, depuis());
    await saveDpeFraisCache(ds).catch(() => {});
    return Response.json({ dataset: ds });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Mise à jour impossible" }, { status: 500 });
  }
}
