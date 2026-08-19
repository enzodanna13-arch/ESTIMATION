// Service Twilio — UNIQUEMENT côté serveur. Envoie un SMS via l'API REST
// Messages en HTTP Basic (Account SID / Auth Token). Les secrets viennent
// EXCLUSIVEMENT des variables d'environnement Vercel :
//   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
// et, optionnel, TWILIO_STATUS_CALLBACK (URL publique de suivi de statut).
//
// Aucun secret n'est jamais journalisé ni renvoyé au client.
// (Ce module est importé UNIQUEMENT par du code serveur — routes API et
// helpers serverSms — jamais par un composant client.)

export interface TwilioResultat {
  sid: string;
  status: string; // queued | sent | delivered | undelivered | failed …
}

export type TwilioErreurCode =
  | "config_absente"
  | "numero_invalide"
  | "credit_insuffisant"
  | "compte_suspendu"
  | "numero_from_invalide"
  | "rejete"
  | "reseau"
  | "api";

// Erreur maîtrisée : ne contient JAMAIS de credential, seulement un code et un
// message lisible destiné à l'utilisateur.
export class TwilioErreur extends Error {
  code: TwilioErreurCode;
  constructor(code: TwilioErreurCode, message: string) {
    super(message);
    this.name = "TwilioErreur";
    this.code = code;
  }
}

export function twilioConfigure(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM_NUMBER,
  );
}

// Traduit un code d'erreur Twilio en message clair (sans jamais exposer de secret).
function messageDepuisCodeTwilio(code: number | undefined, brut: string): { code: TwilioErreurCode; message: string } {
  switch (code) {
    case 21211:
    case 21214:
    case 21217:
      return { code: "numero_invalide", message: "Le numéro du destinataire est invalide." };
    case 21606:
    case 21659:
      return { code: "numero_from_invalide", message: "Le numéro expéditeur Twilio est invalide ou non autorisé." };
    case 20003:
      return { code: "compte_suspendu", message: "Compte Twilio non autorisé (vérifiez les identifiants ou l'état du compte)." };
    case 21608:
    case 21610:
      return { code: "rejete", message: "SMS rejeté (numéro non vérifié en mode d'essai, ou destinataire désinscrit)." };
    default:
      if (/insufficient funds|balance/i.test(brut)) return { code: "credit_insuffisant", message: "Crédit Twilio insuffisant." };
      return { code: "api", message: "Envoi refusé par Twilio." };
  }
}

// Envoie un SMS. Reçoit uniquement { to (E.164), body }. Lève TwilioErreur en cas d'échec.
export async function envoyerSms(to: string, body: string): Promise<TwilioResultat> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!sid || !token || !from) {
    throw new TwilioErreur("config_absente", "Configuration Twilio absente (variables d'environnement manquantes).");
  }

  const params = new URLSearchParams({ To: to, From: from, Body: body });
  if (process.env.TWILIO_STATUS_CALLBACK) params.set("StatusCallback", process.env.TWILIO_STATUS_CALLBACK);

  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  let res: Response;
  try {
    res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new TwilioErreur("reseau", "Service SMS injoignable (réseau). Réessayez.");
  }

  const data = (await res.json().catch(() => ({}))) as { sid?: string; status?: string; code?: number; message?: string };
  if (!res.ok) {
    const { code, message } = messageDepuisCodeTwilio(data.code, data.message ?? "");
    throw new TwilioErreur(code, message);
  }
  return { sid: data.sid ?? "", status: data.status ?? "queued" };
}
