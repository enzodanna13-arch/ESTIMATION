import { checkHistoryPassword } from "@/lib/historyAuth";
import { leadVide, listLeadsServer, restaurerArchivesServer, saveLeadServer, type Lead } from "@/lib/serverLeads";
import { declencherNewLead } from "@/lib/serverSms";

export const dynamic = "force-dynamic";

// Normalisation « tolérante » des clés reçues d'une passerelle externe
// (Zapier/Make/Meta) : l'utilisateur peut nommer ses champs librement
// (mail, telephone, ville du bien, type de bien…) — on les rapproche des
// champs attendus sans le forcer à recommencer.
// Déduit le type de projet d'après les mots-clés (campagne + message)
function deduireTypeProjet(texte: string): string {
  const t = texte.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (/(investiss|locatif|rendement|defiscal|pinel|lmnp)/.test(t)) return "investisseur";
  if (/(vendeur|vendre|vente|proprietaire|estimation|estimer|delai de vente|delais de vente|succession)/.test(t)) return "vendeur";
  if (/(acquereur|acheteur|achat|acheter|recherche un|budget)/.test(t)) return "acquereur";
  return "acquereur";
}

function extraireChamps(body: Record<string, unknown>): Partial<Lead> {
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
  const idx: { k: string; orig: string; v: string }[] = [];
  for (const [k, v] of Object.entries(body)) {
    if (v == null) continue;
    idx.push({ k: norm(k), orig: k, v: typeof v === "string" ? v : String(v) });
  }
  // trouver() consomme la clé trouvée ; ce qui reste (non consommé) est
  // conservé et ajouté au message → aucun champ mappé n'est perdu.
  const consumed = new Set<string>();
  const trouver = (...motifs: string[]) => {
    for (const m of motifs) {
      const f = idx.find((e) => !consumed.has(e.k) && e.k.includes(m));
      if (f && f.v.trim()) { consumed.add(f.k); return f.v.trim(); }
    }
    return "";
  };
  const budgetTxt = trouver("budget", "prix");
  const budgetNum = budgetTxt ? Number(budgetTxt.replace(/[^0-9.]/g, "")) : NaN;
  // Nom / prénom — Facebook & Zapier utilisent des libellés variés :
  // first_name / last_name, full_name, ou une question personnalisée
  // (« Votre nom », « Nom complet »…). On capture le prénom d'abord (pour ne
  // pas le confondre avec le nom), puis le nom ; si on ne récupère qu'un nom
  // complet (avec espace), on le découpe en prénom + nom.
  let prenom = trouver("prenom", "firstname", "givenname");
  let nom = trouver("nomdefamille", "lastname", "familyname", "surname", "nom", "fullname", "nomcomplet", "nomprenom", "votrenom", "contactname");
  if (!prenom && nom && /\s/.test(nom.trim())) {
    const parts = nom.trim().split(/\s+/);
    prenom = parts.shift() ?? "";
    nom = parts.join(" ");
  }
  const tel = trouver("tel", "telephone", "phone", "mobile", "portable");
  const email = trouver("email", "mail", "courriel");
  const ville = trouver("villedubien", "ville", "city", "commune", "secteur");
  const campagne = trouver("campagne", "campaign");
  const source = trouver("source");
  const typeExplicite = trouver("typeprojet");
  const messageDirect = trouver("message", "projet", "recherche", "commentaire", "demande");
  // Créneau de rappel demandé par le client (question « Quand souhaitez-vous
  // être rappelé ? ») : on le sort du lot, on le met en clair et — si c'est une
  // date — on préremplit la « Prochaine relance » de la fiche.
  const rappelTxt = trouver("souhaitezvousetrerappele", "etrerappele", "quandrappel", "creneauderappel", "rappelle", "rappel");
  let relanceLe: number | null = null;
  let creneau = "";
  if (rappelTxt) {
    const t = Date.parse(rappelTxt);
    if (Number.isFinite(t)) {
      relanceLe = t;
      const d = new Date(t);
      const jour = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
      const heure = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
      creneau = `Créneau de rappel souhaité : ${jour} à ${heure}`;
    } else {
      creneau = `Créneau de rappel souhaité : ${rappelTxt}`;
    }
  }
  // Tous les autres champs mappés (type de bien, délai de vente, DPE…) sont
  // conservés dans le message, avec leur libellé d'origine.
  const extras = idx
    .filter((e) => !consumed.has(e.k) && e.v.trim() && !/dummydata/i.test(e.v))
    .map((e) => `${e.orig} : ${e.v.trim()}`);
  const message = [messageDirect, creneau, ...extras].filter(Boolean).join(" · ");
  // Type de projet : explicite si fourni, sinon déduit des mots-clés de la
  // campagne / du message (une campagne « propriétaires vendeurs » ou « délais
  // de vente » = un VENDEUR, pas un acquéreur).
  const typeProjet = typeExplicite || deduireTypeProjet(`${campagne} ${message}`);
  return {
    nom, prenom, tel, email, ville,
    budget: Number.isFinite(budgetNum) && budgetNum > 0 ? budgetNum : null,
    campagne, message, typeProjet, source, relanceLe,
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
  // Restauration des leads archivés (réservée à l'équipe, pas à la passerelle)
  if (body.restaurer === true) {
    if (!checkHistoryPassword(request)) return Response.json({ error: "Accès réservé" }, { status: 401 });
    try { return Response.json(await restaurerArchivesServer()); }
    catch { return Response.json({ error: "Restauration impossible" }, { status: 500 }); }
  }
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
      relanceLe: typeof body.relanceLe === "number" ? (body.relanceLe as number) : (auto.relanceLe ?? null),
    });
    await saveLeadServer(lead);
    // SMS générique NEW_LEAD automatique — pour les leads ENTRANTS (passerelle
    // Zapier/Make/site ou source campagne). Pas d'envoi auto pour une saisie
    // manuelle dans l'app (le négociateur peut l'envoyer à la main si besoin).
    const viaPasserelle = Boolean(secret && cleFournie === secret);
    if (viaPasserelle || ["facebook", "instagram", "site"].includes(lead.source)) {
      await declencherNewLead(lead);
    }
    return Response.json({ lead });
  } catch {
    return Response.json({ error: "Enregistrement impossible" }, { status: 500 });
  }
}
