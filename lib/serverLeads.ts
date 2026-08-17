import { del, list, put } from "@vercel/blob";

// Leads entrants PARTAGÉS (Vercel Blob) — issus des campagnes marketing
// (Facebook/Instagram Lead Ads, formulaires site…) et suivis par l'équipe.
// Un fichier versionné par lead : « leads/{id}~{updatedAt}.json ».

export interface SuiviLead {
  id: string;
  date: number;
  type: string; // creation | appel | email | transfert | rdv | statut | note | conversion
  texte: string;
  auteur: string;
}

export interface Lead {
  id: string;
  createdAt: number;
  updatedAt: number;
  source: string; // facebook | instagram | site | manuel | autre
  campagne: string;
  nom: string;
  prenom: string;
  tel: string;
  email: string;
  ville: string;
  budget: number | null;
  typeProjet: string; // acquereur | vendeur | investisseur | estimation | autre
  message: string;
  statut: string; // Nouveau | À appeler | Transféré | RDV fixé | En cours | Converti | Non converti | Perdu
  negociateur: string; // transféré à
  notes: string;
  dossierId: string; // dossier client créé depuis ce lead
  relanceLe?: number | null; // date de prochaine relance (rappel), facultative
  suivi: SuiviLead[];
}

const PREFIX = "leads/";
const safe = (s: string) => s.replace(/[^a-z0-9-]/gi, "");
const versionDe = (p: string) => { const m = p.match(/~(\d+)\.json$/); return m ? Number(m[1]) : 0; };

export function leadVide(partial: Partial<Lead>): Lead {
  const now = Date.now();
  return {
    id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now, updatedAt: now,
    source: "manuel", campagne: "", nom: "", prenom: "", tel: "", email: "",
    ville: "", budget: null, typeProjet: "acquereur", message: "",
    statut: "Nouveau", negociateur: "", notes: "", dossierId: "", relanceLe: null,
    suivi: [{ id: `${now}`, date: now, type: "creation", texte: "Lead reçu", auteur: partial.source ?? "" }],
    ...partial,
  };
}

async function putLead(lead: Lead): Promise<void> {
  const nom = `${PREFIX}${safe(lead.id)}~${lead.updatedAt}.json`;
  await put(nom, JSON.stringify(lead), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: `${PREFIX}${safe(lead.id)}~`, limit: 100 });
  // Ne supprimer que les versions STRICTEMENT plus anciennes : si deux
  // enregistrements du même lead se produisent en même temps (ex. réattribution
  // qui écrit le négociateur ET le suivi), aucun n'efface la version fraîche de
  // l'autre — le lead ne peut plus disparaître.
  const anciennes = blobs.filter((b) => b.pathname !== nom && versionDe(b.pathname) < lead.updatedAt).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
}

// Archive IMMUABLE : à chaque enregistrement, une copie du lead est écrite
// sous « leads-archive/{id}~{ts}.json » et n'est JAMAIS supprimée par le
// nettoyage de versions. Même si le fichier « vivant » est perdu (bug, aléa),
// le lead reste récupérable → un lead ne peut plus disparaître définitivement.
const ARCHIVE = "leads-archive/";
async function archiveLead(lead: Lead): Promise<void> {
  const nom = `${ARCHIVE}${safe(lead.id)}~${lead.updatedAt}.json`;
  try {
    await put(nom, JSON.stringify(lead), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  } catch { /* l'archive est un filet de sécurité : ne bloque jamais l'enregistrement principal */ }
}

export async function saveLeadServer(lead: Lead): Promise<Lead> {
  lead.updatedAt = Date.now();
  await putLead(lead);
  await archiveLead(lead);
  return lead;
}

// Restaure les leads présents dans l'archive mais absents de la liste vivante
// (ex. perdus par un ancien bug). Renvoie le nombre de leads restaurés.
export async function restaurerArchivesServer(): Promise<{ restaures: number; ids: string[] }> {
  const vivantsLeads = await listLeadsServer();
  const vivants = new Set(vivantsLeads.map((l) => l.id));
  const { blobs } = await list({ prefix: ARCHIVE, limit: 1000 });
  const parId = new Map<string, { url: string; ts: number }>();
  for (const b of blobs) {
    const nom = b.pathname.slice(b.pathname.lastIndexOf("/") + 1);
    const id = nom.split("~")[0];
    const ts = versionDe(b.pathname);
    const cur = parId.get(id);
    if (!cur || ts > cur.ts) parId.set(id, { url: b.url, ts });
  }
  // Backfill : archive les leads vivants pas encore archivés (protège l'existant)
  for (const l of vivantsLeads) if (!parId.has(l.id)) await archiveLead(l);
  const restaures: string[] = [];
  for (const [id, { url }] of parId) {
    if (vivants.has(id)) continue;
    try {
      const r = await fetch(url, { cache: "no-store" });
      if (!r.ok) continue;
      const lead = (await r.json()) as Lead;
      await putLead(lead); // recrée le fichier vivant
      restaures.push(id);
    } catch { /* on continue */ }
  }
  return { restaures: restaures.length, ids: restaures };
}

export async function listLeadsServer(): Promise<Lead[]> {
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
  const parId = new Map<string, { url: string; ts: number }>();
  for (const b of blobs) {
    const nom = b.pathname.slice(b.pathname.lastIndexOf("/") + 1);
    const id = nom.split("~")[0];
    const ts = versionDe(b.pathname);
    const cur = parId.get(id);
    if (!cur || ts > cur.ts) parId.set(id, { url: b.url, ts });
  }
  // Chargement avec 2 tentatives : un aléa réseau/CDN ne doit jamais faire
  // « disparaître » un lead de la liste.
  const charger = async (url: string): Promise<Lead | null> => {
    for (let essai = 0; essai < 3; essai++) {
      try { const r = await fetch(url, { cache: "no-store" }); if (r.ok) return (await r.json()) as Lead; } catch { /* on réessaie */ }
    }
    return null;
  };
  const leads = await Promise.all([...parId.values()].map(({ url }) => charger(url)));
  return leads.filter((l): l is Lead => l !== null).sort((a, b) => b.createdAt - a.createdAt);
}

// Rapprochement automatique : relie un lead existant à un dossier client
// nouvellement créé (par tél / email / nom) et met son statut à jour. Renvoie
// l'id du lead rapproché, ou null si aucun ne correspond.
export async function rapprocherLeadServer(params: { tel?: string; email?: string; nom?: string; prenom?: string; dossierId: string; statut: string }): Promise<string | null> {
  const digits = (s?: string) => (s ?? "").replace(/\D/g, "");
  const tail = (s?: string) => { const d = digits(s); return d.length >= 9 ? d.slice(-9) : ""; };
  const norm = (s?: string) => (s ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
  const telP = tail(params.tel);
  const emailP = norm(params.email);
  const nomP = norm(`${params.prenom ?? ""}${params.nom ?? ""}`);
  if (!telP && !emailP && nomP.length < 5) return null;

  const leads = await listLeadsServer();
  const candidat = leads.find((l) => {
    if (l.dossierId) return false; // déjà rattaché à un dossier
    if (telP && tail(l.tel) && tail(l.tel) === telP) return true;
    if (emailP && norm(l.email) && norm(l.email) === emailP) return true;
    if (nomP.length >= 5 && norm(`${l.prenom ?? ""}${l.nom ?? ""}`) === nomP) return true;
    return false;
  });
  if (!candidat) return null;

  const texte = params.statut === "Prise de mandat"
    ? "Prise de mandat — dossier vendeur créé (rapprochement automatique)"
    : "Converti en dossier client (rapprochement automatique)";
  const suivi = [{ id: `${Date.now()}`, date: Date.now(), type: "conversion", texte, auteur: candidat.negociateur || "—" }, ...(candidat.suivi ?? [])];
  await saveLeadServer({ ...candidat, dossierId: params.dossierId, statut: params.statut, relanceLe: null, suivi });
  return candidat.id;
}

export async function getLeadServer(id: string): Promise<Lead | null> {
  const { blobs } = await list({ prefix: `${PREFIX}${safe(id)}~`, limit: 100 });
  if (blobs.length === 0) return null;
  const dernier = blobs.reduce((a, b) => (versionDe(b.pathname) > versionDe(a.pathname) ? b : a));
  try { const r = await fetch(dernier.url, { cache: "no-store" }); return r.ok ? ((await r.json()) as Lead) : null; } catch { return null; }
}

export async function deleteLeadServer(id: string): Promise<void> {
  // Suppression VOLONTAIRE : on retire le fichier vivant ET l'archive, pour
  // qu'un lead sciemment supprimé ne « revienne » pas à la restauration.
  const [vivants, archives] = await Promise.all([
    list({ prefix: `${PREFIX}${safe(id)}~`, limit: 100 }),
    list({ prefix: `${ARCHIVE}${safe(id)}~`, limit: 100 }),
  ]);
  const urls = [...vivants.blobs, ...archives.blobs].map((b) => b.url);
  if (urls.length > 0) await del(urls);
}
