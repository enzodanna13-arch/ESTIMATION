import { checkHistoryPassword } from "@/lib/historyAuth";
import { getLeadServer } from "@/lib/serverLeads";
import { envoyerSmsPourLead } from "@/lib/serverSms";
import { TwilioErreur } from "@/lib/twilio";
import { SMS_TYPES_MANUELS, type SmsType } from "@/lib/smsTemplates";

export const dynamic = "force-dynamic";

// Envoi MANUEL d'un SMS depuis la fiche lead (réservé à l'équipe authentifiée).
// Le backend décide TOUJOURS de l'expéditeur (TWILIO_FROM_NUMBER) : le frontend
// ne fournit jamais de From ni de credentials.
export async function POST(request: Request) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  let body: { leadId?: string; type?: string; custom?: string };
  try { body = (await request.json()) as typeof body; } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }
  const leadId = (body.leadId ?? "").trim();
  const type = body.type as SmsType;
  if (!leadId || !SMS_TYPES_MANUELS.includes(type)) {
    return Response.json({ error: "Type de SMS ou lead invalide" }, { status: 400 });
  }
  const lead = await getLeadServer(leadId);
  if (!lead) return Response.json({ error: "Lead introuvable" }, { status: 404 });
  if (type === "CUSTOM" && !(body.custom ?? "").trim()) {
    return Response.json({ error: "Le message personnalisé est vide" }, { status: 400 });
  }
  try {
    const record = await envoyerSmsPourLead({ lead, type, custom: body.custom });
    return Response.json({ record });
  } catch (err) {
    const message = err instanceof TwilioErreur
      ? err.message
      : "Impossible d'envoyer le SMS. Vérifiez le numéro du prospect ou la configuration Twilio.";
    return Response.json({ error: message }, { status: 422 });
  }
}
