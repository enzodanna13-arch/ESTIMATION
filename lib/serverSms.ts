import { del, list, put } from "@vercel/blob";
import { envoyerSms, TwilioErreur, twilioConfigure } from "./twilio";
import { buildSmsTemplate, type SmsType } from "./smsTemplates";
import { normaliserTelFr } from "./telephone";
import type { Lead } from "./serverLeads";

// Persistance des SMS liés aux leads — stockage Vercel Blob (pas de SQL) :
// un fichier par SMS sous « sms/{leadId}/{id}.json ». Le SMS NEW_LEAD utilise
// un id DÉTERMINISTE (« NEW_LEAD ») : son chemin est unique par lead, ce qui
// garantit l'idempotence (un seul NEW_LEAD par lead, quels que soient les
// doublons de webhook / rechargements).

export type SmsStatut = "queued" | "sent" | "delivered" | "undelivered" | "failed" | "error";

export interface SmsRecord {
  id: string;
  leadId: string;
  agent: string | null; // négociatrice (null pour le SMS générique NEW_LEAD)
  twilioSid: string;
  type: SmsType;
  recipient: string; // E.164
  body: string;
  status: SmsStatut;
  errorMessage: string;
  createdAt: number;
  sentAt: number | null;
  deliveredAt: number | null;
  updatedAt: number;
}

const PREFIX = "sms/";
const safe = (s: string) => (s || "").replace(/[^a-z0-9-]/gi, "");
const NEW_LEAD_ID = "NEW_LEAD";

// Journalise sans JAMAIS exposer de secret ni le corps complet.
function logSms(evt: string, detail: Record<string, unknown> = {}) {
  try { console.log(`[sms] ${evt}`, JSON.stringify(detail)); } catch { /* noop */ }
}

async function putSmsRecord(rec: SmsRecord): Promise<SmsRecord> {
  const nom = `${PREFIX}${safe(rec.leadId)}/${safe(rec.id)}.json`;
  await put(nom, JSON.stringify(rec), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  return rec;
}

export async function listSmsForLead(leadId: string): Promise<SmsRecord[]> {
  const { blobs } = await list({ prefix: `${PREFIX}${safe(leadId)}/`, limit: 200 });
  const charger = async (url: string): Promise<SmsRecord | null> => {
    for (let i = 0; i < 2; i++) {
      try { const r = await fetch(url, { cache: "no-store" }); if (r.ok) return (await r.json()) as SmsRecord; } catch { /* retry */ }
    }
    return null;
  };
  const recs = await Promise.all(blobs.map((b) => charger(b.url)));
  return recs.filter((r): r is SmsRecord => r !== null).sort((a, b) => b.createdAt - a.createdAt);
}

export async function aDejaNewLead(leadId: string): Promise<boolean> {
  const { blobs } = await list({ prefix: `${PREFIX}${safe(leadId)}/${NEW_LEAD_ID}.json`, limit: 1 });
  return blobs.length > 0;
}

// Envoie un SMS pour un lead et enregistre le résultat. En cas d'erreur Twilio,
// enregistre un record en statut « error » ET relance l'erreur (l'appelant
// décide de l'afficher). `id` fixe = idempotence (NEW_LEAD).
async function envoyerEtEnregistrer(params: {
  leadId: string;
  agent: string | null;
  type: SmsType;
  telBrut: string;
  body: string;
  id?: string;
}): Promise<SmsRecord> {
  const now = Date.now();
  const id = params.id ?? `${now}-${Math.random().toString(36).slice(2, 8)}`;
  const to = normaliserTelFr(params.telBrut);
  const base: SmsRecord = {
    id, leadId: params.leadId, agent: params.agent, twilioSid: "", type: params.type,
    recipient: to ?? params.telBrut, body: params.body, status: "queued", errorMessage: "",
    createdAt: now, sentAt: null, deliveredAt: null, updatedAt: now,
  };
  if (!to) {
    logSms("numero_invalide", { leadId: params.leadId, type: params.type });
    throw new TwilioErreur("numero_invalide", "Numéro de téléphone du prospect absent ou invalide.");
  }
  try {
    const res = await envoyerSms(to, params.body);
    const rec: SmsRecord = { ...base, twilioSid: res.sid, status: (res.status as SmsStatut) || "sent", sentAt: Date.now(), updatedAt: Date.now() };
    await putSmsRecord(rec);
    logSms("envoye", { leadId: params.leadId, type: params.type, sid: res.sid, status: rec.status });
    return rec;
  } catch (err) {
    const message = err instanceof TwilioErreur ? err.message : "Envoi impossible.";
    await putSmsRecord({ ...base, status: "error", errorMessage: message, updatedAt: Date.now() });
    logSms("echec", { leadId: params.leadId, type: params.type, code: err instanceof TwilioErreur ? err.code : "inconnu" });
    throw err;
  }
}

// Orchestrateur d'envoi manuel/relance (NO_ANSWER, NOT_INTERESTED, CUSTOM…).
export async function envoyerSmsPourLead(params: {
  lead: Lead;
  type: SmsType;
  custom?: string;
}): Promise<SmsRecord> {
  const agentNom = params.lead.negociateur?.trim() || "";
  const tpl = buildSmsTemplate(params.type, params.lead, agentNom || undefined, params.custom);
  if (tpl.requiresAgent && !agentNom) {
    throw new TwilioErreur("api", "Attribuez d'abord ce lead à une négociatrice avant d'envoyer cette relance.");
  }
  return envoyerEtEnregistrer({
    leadId: params.lead.id,
    agent: tpl.requiresAgent || agentNom ? agentNom || null : null,
    type: params.type,
    telBrut: params.lead.tel,
    body: tpl.body,
  });
}

// SMS NEW_LEAD automatique à la création d'un lead — IDEMPOTENT.
// Ne fait rien (silencieusement) si : Twilio non configuré, numéro absent,
// ou un NEW_LEAD a déjà été envoyé pour ce lead.
export async function declencherNewLead(lead: Lead): Promise<SmsRecord | null> {
  try {
    if (!twilioConfigure()) { logSms("config_absente", { leadId: lead.id }); return null; }
    if (!normaliserTelFr(lead.tel)) { logSms("ignore_sans_numero", { leadId: lead.id }); return null; }
    if (await aDejaNewLead(lead.id)) { logSms("ignore_doublon", { leadId: lead.id }); return null; }
    const tpl = buildSmsTemplate("NEW_LEAD", lead);
    return await envoyerEtEnregistrer({
      leadId: lead.id, agent: null, type: "NEW_LEAD", telBrut: lead.tel, body: tpl.body, id: NEW_LEAD_ID,
    });
  } catch (err) {
    // Un échec d'envoi NEW_LEAD ne doit JAMAIS bloquer la création du lead.
    logSms("new_lead_echec", { leadId: lead.id, code: err instanceof TwilioErreur ? err.code : "inconnu" });
    return null;
  }
}

// Mise à jour du statut depuis le webhook Twilio (StatusCallback).
const MAP_STATUT: Record<string, SmsStatut> = {
  queued: "queued", sending: "queued", sent: "sent",
  delivered: "delivered", undelivered: "undelivered", failed: "failed",
};

export async function majStatutDepuisSid(sid: string, statutTwilio: string): Promise<boolean> {
  if (!sid) return false;
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
  for (const b of blobs) {
    try {
      const r = await fetch(b.url, { cache: "no-store" });
      if (!r.ok) continue;
      const rec = (await r.json()) as SmsRecord;
      if (rec.twilioSid !== sid) continue;
      const statut = MAP_STATUT[statutTwilio.toLowerCase()] ?? rec.status;
      const maj: SmsRecord = {
        ...rec, status: statut, updatedAt: Date.now(),
        deliveredAt: statut === "delivered" ? Date.now() : rec.deliveredAt,
      };
      await putSmsRecord(maj);
      logSms("statut_maj", { leadId: rec.leadId, sid, statut });
      return true;
    } catch { /* on continue */ }
  }
  return false;
}

// Suppression des SMS d'un lead (utilisée à la suppression d'un lead).
export async function deleteSmsForLead(leadId: string): Promise<void> {
  const { blobs } = await list({ prefix: `${PREFIX}${safe(leadId)}/`, limit: 200 });
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
}
