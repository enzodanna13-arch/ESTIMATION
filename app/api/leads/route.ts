import { checkHistoryPassword } from "@/lib/historyAuth";
import { leadVide, listLeadsServer, saveLeadServer, type Lead } from "@/lib/serverLeads";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!checkHistoryPassword(request)) return Response.json({ error: "Accès réservé" }, { status: 401 });
  try {
    return Response.json({ leads: await listLeadsServer() });
  } catch {
    return Response.json({ leads: [] });
  }
}

// Création d'un lead — depuis l'app (mot de passe équipe) OU depuis une
// passerelle externe autorisée par le secret LEADS_INBOUND_SECRET (header
// x-leads-key), pour brancher Zapier/Make/Meta sans le mot de passe d'équipe.
export async function POST(request: Request) {
  const secret = process.env.LEADS_INBOUND_SECRET;
  const cleFournie = request.headers.get("x-leads-key");
  const autorise = checkHistoryPassword(request) || (secret && cleFournie === secret);
  if (!autorise) return Response.json({ error: "Accès réservé" }, { status: 401 });

  let body: Partial<Lead>;
  try { body = (await request.json()) as Partial<Lead>; } catch { return Response.json({ error: "Requête invalide" }, { status: 400 }); }
  try {
    const lead = leadVide({
      source: body.source || (cleFournie ? "site" : "manuel"),
      campagne: body.campagne || "",
      nom: (body.nom || "").trim(), prenom: (body.prenom || "").trim(),
      tel: (body.tel || "").trim(), email: (body.email || "").trim(),
      ville: (body.ville || "").trim(), budget: typeof body.budget === "number" ? body.budget : null,
      typeProjet: body.typeProjet || "acquereur", message: (body.message || "").trim(),
      statut: body.statut || "Nouveau", negociateur: (body.negociateur || "").trim(),
    });
    await saveLeadServer(lead);
    return Response.json({ lead });
  } catch {
    return Response.json({ error: "Enregistrement impossible" }, { status: 500 });
  }
}
