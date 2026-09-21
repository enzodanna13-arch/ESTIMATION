import { verifierAccesEquipe } from "@/lib/historyAuth";
import { fetchDvfContext, medianPrixM2 } from "@/lib/dvf";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Positionnement marché d'un bien chassé, à partir des ventes réelles DVF de la
// commune (données publiques). Renvoie le €/m² médian, la valeur estimée pour
// la surface, et l'écart avec le prix affiché (+ = au-dessus du marché).

function typeLocalDe(t: string): string {
  const s = (t || "").toLowerCase();
  if (s.includes("maison") || s.includes("villa")) return "maison";
  if (s.includes("appart") || s.includes("studio") || s.includes("t1") || s.includes("t2") || s.includes("t3") || s.includes("t4") || s.includes("t5")) return "appartement";
  return "";
}

export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });

  let codePostal = "", ville = "", surface = 0, typeBien = "", prixAffiche = 0;
  try {
    const b = (await request.json()) as { codePostal?: string; ville?: string; surface?: number; typeBien?: string; prixAffiche?: number };
    codePostal = (b.codePostal ?? "").trim();
    ville = (b.ville ?? "").trim();
    surface = Number(b.surface) || 0;
    typeBien = (b.typeBien ?? "").trim();
    prixAffiche = Number(b.prixAffiche) || 0;
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }

  // Code postal : soit fourni, soit extrait de la ville (« 13500 Martigues »).
  if (!/^\d{5}$/.test(codePostal)) {
    const m = ville.match(/\b(\d{5})\b/);
    if (m) codePostal = m[1];
  }
  if (!/^\d{5}$/.test(codePostal)) {
    return Response.json({ error: "Code postal manquant — renseignez le code postal du bien." }, { status: 400 });
  }
  if (surface <= 0) {
    return Response.json({ error: "Surface manquante — renseignez la surface pour estimer le marché." }, { status: 400 });
  }

  try {
    const { sales } = await fetchDvfContext(codePostal, typeLocalDe(typeBien), "", ville);
    const median = medianPrixM2(sales);
    if (!median || sales.length === 0) {
      return Response.json({ trouve: false, message: "Pas assez de ventes DVF pour ce secteur/type." });
    }
    const valeur = Math.round(median * surface);
    const basse = Math.round(valeur * 0.92);
    const haute = Math.round(valeur * 1.08);
    const ecartPct = prixAffiche > 0 ? Math.round(((prixAffiche - valeur) / valeur) * 100) : null;
    return Response.json({
      trouve: true,
      marcheM2: median,
      valeur, basse, haute,
      ecartPct,
      nbVentes: sales.length,
    });
  } catch (err) {
    console.error("Estimation marché chasse impossible :", err);
    return Response.json({ error: "Estimation marché impossible — réessayez." }, { status: 500 });
  }
}
