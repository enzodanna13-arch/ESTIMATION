import { createHmac, timingSafeEqual } from "crypto";
import { majStatutDepuisSid } from "@/lib/serverSms";

export const dynamic = "force-dynamic";

// Callback de statut Twilio (StatusCallback) : Twilio POST les mises à jour de
// livraison (sent/delivered/undelivered/failed) en x-www-form-urlencoded.
// On met à jour le SMS correspondant en base (par Message SID).
//
// Vérification d'origine (si possible) : la signature X-Twilio-Signature est
// validée avec TWILIO_AUTH_TOKEN et l'URL exacte de callback (TWILIO_STATUS_CALLBACK).

function signatureValide(url: string, params: Record<string, string>, signature: string, token: string): boolean {
  // Algorithme Twilio : URL + concat(clé+valeur) triés par clé, HMAC-SHA1, base64.
  const data = url + Object.keys(params).sort().map((k) => k + params[k]).join("");
  const attendu = createHmac("sha1", token).update(Buffer.from(data, "utf-8")).digest("base64");
  try {
    const a = Buffer.from(attendu);
    const b = Buffer.from(signature);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch { return false; }
}

export async function POST(request: Request) {
  let form: URLSearchParams;
  try {
    form = new URLSearchParams(await request.text());
  } catch {
    return new Response("ok", { status: 200 });
  }
  const params: Record<string, string> = {};
  form.forEach((v, k) => { params[k] = v; });

  // Validation d'origine seulement si l'URL exacte de callback est connue.
  const token = process.env.TWILIO_AUTH_TOKEN;
  const callbackUrl = process.env.TWILIO_STATUS_CALLBACK;
  const signature = request.headers.get("x-twilio-signature");
  if (token && callbackUrl && signature) {
    if (!signatureValide(callbackUrl, params, signature, token)) {
      return new Response("forbidden", { status: 403 });
    }
  }

  const sid = params["MessageSid"] || params["SmsSid"] || "";
  const statut = params["MessageStatus"] || params["SmsStatus"] || "";
  if (sid && statut) {
    try { await majStatutDepuisSid(sid, statut); } catch { /* on renvoie 200 quand même */ }
  }
  return new Response("ok", { status: 200 });
}
