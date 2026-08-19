import { leadVide, saveLeadServer } from "@/lib/serverLeads";
import { declencherNewLead } from "@/lib/serverSms";

export const dynamic = "force-dynamic";

// Passerelle Meta Lead Ads (Facebook / Instagram).
// GET  : vérification du webhook (Meta envoie hub.challenge à l'abonnement).
// POST : notification « leadgen » → on récupère les données du lead via la
//        Graph API (si META_PAGE_TOKEN est défini) puis on crée le lead.
// Variables : META_VERIFY_TOKEN, META_PAGE_TOKEN.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  if (mode === "subscribe" && token && token === process.env.META_VERIFY_TOKEN) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

interface FieldDatum { name: string; values: string[] }

function mapChamps(fields: FieldDatum[]) {
  const get = (...clefs: string[]) => {
    for (const f of fields) {
      const n = f.name.toLowerCase();
      if (clefs.some((c) => n.includes(c))) return (f.values?.[0] ?? "").trim();
    }
    return "";
  };
  return {
    nom: get("last_name", "nom") || get("full_name", "name"),
    prenom: get("first_name", "prenom"),
    tel: get("phone", "tel"),
    email: get("email", "mail"),
    ville: get("city", "ville", "secteur"),
    message: get("message", "projet", "recherche"),
  };
}

export async function POST(request: Request) {
  let body: { entry?: { changes?: { value?: { leadgen_id?: string; form_id?: string; ad_id?: string } }[] }[] };
  try { body = await request.json(); } catch { return new Response("ok", { status: 200 }); }
  const pageToken = process.env.META_PAGE_TOKEN;

  try {
    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const leadgenId = change.value?.leadgen_id;
        if (!leadgenId) continue;
        let champs = { nom: "", prenom: "", tel: "", email: "", ville: "", message: "" };
        let campagne = change.value?.form_id ? `form ${change.value.form_id}` : "";
        // Récupération des données réelles du lead via la Graph API
        if (pageToken) {
          try {
            const r = await fetch(`https://graph.facebook.com/v19.0/${leadgenId}?access_token=${pageToken}`);
            if (r.ok) {
              const data = (await r.json()) as { field_data?: FieldDatum[]; campaign_name?: string };
              if (data.field_data) champs = { ...champs, ...mapChamps(data.field_data) };
              if (data.campaign_name) campagne = data.campaign_name;
            }
          } catch { /* on crée quand même le lead avec ce qu'on a */ }
        }
        const lead = leadVide({ source: "facebook", campagne, ...champs, typeProjet: "acquereur", statut: "Nouveau" });
        lead.suivi[0].texte = `Lead Facebook Ads reçu${campagne ? ` (${campagne})` : ""}`;
        await saveLeadServer(lead);
        // SMS générique CENTURY 21 Icaza immédiat (idempotent, ne bloque jamais).
        await declencherNewLead(lead);
      }
    }
  } catch { /* Meta réessaie si on renvoie une erreur ; on absorbe */ }
  return new Response("ok", { status: 200 }); // toujours 200 pour Meta
}
