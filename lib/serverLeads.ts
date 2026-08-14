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
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
}

export async function saveLeadServer(lead: Lead): Promise<Lead> {
  lead.updatedAt = Date.now();
  await putLead(lead);
  return lead;
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
  const leads = await Promise.all([...parId.values()].map(async ({ url }) => {
    try { const r = await fetch(url, { cache: "no-store" }); return r.ok ? ((await r.json()) as Lead) : null; } catch { return null; }
  }));
  return leads.filter((l): l is Lead => l !== null).sort((a, b) => b.createdAt - a.createdAt);
}

export async function getLeadServer(id: string): Promise<Lead | null> {
  const { blobs } = await list({ prefix: `${PREFIX}${safe(id)}~`, limit: 100 });
  if (blobs.length === 0) return null;
  const dernier = blobs.reduce((a, b) => (versionDe(b.pathname) > versionDe(a.pathname) ? b : a));
  try { const r = await fetch(dernier.url, { cache: "no-store" }); return r.ok ? ((await r.json()) as Lead) : null; } catch { return null; }
}

export async function deleteLeadServer(id: string): Promise<void> {
  const { blobs } = await list({ prefix: `${PREFIX}${safe(id)}~`, limit: 100 });
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
}
