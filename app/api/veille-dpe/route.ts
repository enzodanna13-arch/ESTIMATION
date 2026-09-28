import { verifierAccesEquipe } from "@/lib/historyAuth";
import { analyserVeilleDpe, listAlertesDpe, majStatutAlerteDpe, type AlerteDpe } from "@/lib/veilleDpe";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Liste les alertes « mise en vente » détectées.
export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  try {
    return Response.json({ alertes: await listAlertesDpe() });
  } catch {
    return Response.json({ alertes: [] });
  }
}

// Lance l'analyse (croisement estimations ⇄ ADEME).
export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  try {
    const res = await analyserVeilleDpe();
    const alertes = await listAlertesDpe();
    return Response.json({ ok: true, ...res, alertes });
  } catch (err) {
    console.error("Veille DPE — analyse impossible :", err);
    return Response.json({ ok: false, error: "Analyse impossible" }, { status: 500 });
  }
}

// Met à jour le statut d'une alerte (vu / contacté / écarté).
export async function PATCH(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  let body: { id?: string; statut?: AlerteDpe["statut"] };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Requête invalide" }, { status: 400 }); }
  if (!body.id || !body.statut) return Response.json({ error: "Champs manquants" }, { status: 400 });
  try {
    const alertes = await majStatutAlerteDpe(body.id, body.statut);
    return Response.json({ ok: true, alertes });
  } catch {
    return Response.json({ ok: false, error: "Mise à jour impossible" }, { status: 500 });
  }
}
