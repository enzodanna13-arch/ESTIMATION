import { checkHistoryPassword } from "@/lib/historyAuth";
import { leadVide, listLeadsServer, saveLeadServer, type Lead } from "@/lib/serverLeads";

export const dynamic = "force-dynamic";

// Normalisation « tolérante » des clés reçues d'une passerelle externe
// (Zapier/Make/Meta) : l'utilisateur peut nommer ses champs librement
// (mail, telephone, ville du bien, type de bien…) — on les rapproche des
// champs attendus sans le forcer à recommencer.
function extraireChamps(body: Record<string, unknown>): Partial<Lead> {
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
  const idx: { k: string; v: string }[] = [];
  for (const [k, v] of Object.entries(body)) {
    if (v == null) continue;
    idx.push({ k: norm(k), v: typeof v === "string" ? v : String(v) });
  }
  const trouver = (...motifs: string[]) => {
    for (const m of motifs) { const f = idx.find((e) => e.k.includes(m)); if (f && f.v.trim()) return f.v.trim(); }
    return "";
  };
  const budgetTxt = trouver("budget", "prix");
  const budgetNum = budgetTxt ? Number(budgetTxt.replace(/[^0-9.]/g, "")) : NaN;
  const message = [trouver("message", "projet", "recherche", "commentaire", "demande"), trouver("typedebien", "typebien")]
    .filter(Boolean).join(" — ");
  return {
    nom: trouver("nom", "fullname", "name", "lastname"),
    prenom: trouver("prenom", "firstname"),
    tel: trouver("tel", "telephone", "phone", "mobile", "portable"),
    email: trouver("email", "mail", "courriel"),
    ville: trouver("villedubien", "ville", "city", "commune", "secteur"),
    budget: Number.isFinite(budgetNum) && budgetNum > 0 ? budgetNum : null,
    campagne: trouver("campagne", "campaign"),
    message,
    typeProjet: trouver("typeprojet") || "acquereur",
    source: trouver("source"),
  };
}

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

  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; } catch { return Response.json({ error: "Requête invalide" }, { status: 400 }); }
  try {
    // Champs explicites (saisie app) prioritaires, sinon détection tolérante
    const auto = extraireChamps(body);
    const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");
    const lead = leadVide({
      source: str("source") || auto.source || (cleFournie ? "site" : "manuel"),
      campagne: str("campagne") || auto.campagne || "",
      nom: str("nom") || auto.nom || "", prenom: str("prenom") || auto.prenom || "",
      tel: str("tel") || auto.tel || "", email: str("email") || auto.email || "",
      ville: str("ville") || auto.ville || "",
      budget: typeof body.budget === "number" ? (body.budget as number) : (auto.budget ?? null),
      typeProjet: str("typeProjet") || auto.typeProjet || "acquereur",
      message: str("message") || auto.message || "",
      statut: str("statut") || "Nouveau", negociateur: str("negociateur"),
    });
    await saveLeadServer(lead);
    return Response.json({ lead });
  } catch {
    return Response.json({ error: "Enregistrement impossible" }, { status: 500 });
  }
}
