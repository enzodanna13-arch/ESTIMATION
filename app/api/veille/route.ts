import { checkHistoryPassword } from "@/lib/historyAuth";
import { apercuCommune, COMMUNES_ZONE } from "@/lib/veilleZone";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

// Veille de zone : aperçu marché (volumes + médianes €/m²) de chaque commune
// de la zone de chalandise, pour un millésime DVF donné.
export async function GET(request: Request) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  const url = new URL(request.url);
  const annee = Number(url.searchParams.get("annee")) || new Date().getFullYear() - 1;
  try {
    const communes = await Promise.all(COMMUNES_ZONE.map((c) => apercuCommune(c, annee)));
    return Response.json({ annee, communes });
  } catch {
    return Response.json({ error: "Données DVF indisponibles — réessayez" }, { status: 502 });
  }
}
