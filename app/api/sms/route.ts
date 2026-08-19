import { checkHistoryPassword } from "@/lib/historyAuth";
import { listSmsForLead } from "@/lib/serverSms";

export const dynamic = "force-dynamic";

// Historique SMS d'un lead (réservé à l'équipe authentifiée) : /api/sms?leadId=…
export async function GET(request: Request) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé" }, { status: 401 });
  }
  const leadId = new URL(request.url).searchParams.get("leadId")?.trim();
  if (!leadId) return Response.json({ sms: [] });
  try {
    return Response.json({ sms: await listSmsForLead(leadId) });
  } catch {
    return Response.json({ sms: [] });
  }
}
