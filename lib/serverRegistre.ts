import { del, list, put } from "@vercel/blob";

// Registre des appels PARTAGÉ (Vercel Blob) : l'assistante et l'équipe
// consignent chaque appel/mail/passage agence. Les entrées historiques
// (import de l'ancien fichier Excel) sont servies en statique
// (public/registre-seed.json) ; les NOUVELLES entrées saisies dans l'outil
// sont stockées ici, un fichier par mois (tableau d'appels).

export interface AppelEntry {
  id: string;
  createdAt: number;
  mois: string; // ex. « AVRIL 2026 » (regroupement, majuscules)
  date?: string; // date réelle de l'appel (AAAA-MM-JJ), facultative
  jour: string; // ex. « lundi 2 »
  origine: string; // appel entrant, mail, passage agence…
  destinataire: string; // négociateur / initiales
  nom: string;
  telephone: string;
  mail: string;
  refBien: string;
  message: string;
  traitement: string; // traitement de la demande
  finalise: string; // finalisé (oui/…)
}

const PREFIX = "registre/mois/";
const safe = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");

interface MoisFile {
  mois: string;
  entrees: AppelEntry[];
}

function versionDe(pathname: string): number {
  const nom = pathname.slice(pathname.lastIndexOf("/") + 1);
  const t = nom.split("~")[1];
  return t ? parseInt(t.replace(/\.json$/, ""), 10) || 0 : 0;
}

// Dernière version du fichier d'un mois (ou null)
async function fichierMois(mois: string): Promise<{ url: string; data: MoisFile } | null> {
  const { blobs } = await list({ prefix: `${PREFIX}${safe(mois)}~`, limit: 100 });
  if (blobs.length === 0) return null;
  const dernier = blobs.reduce((a, b) => (versionDe(b.pathname) > versionDe(a.pathname) ? b : a));
  try {
    const res = await fetch(dernier.url, { cache: "no-store" });
    if (!res.ok) return null;
    return { url: dernier.url, data: (await res.json()) as MoisFile };
  } catch {
    return null;
  }
}

async function ecrireMois(mois: string, entrees: AppelEntry[]): Promise<void> {
  const updatedAt = Math.max(1, ...entrees.map((e) => e.createdAt), Date.now());
  const nom = `${PREFIX}${safe(mois)}~${updatedAt}.json`;
  await put(nom, JSON.stringify({ mois, entrees } satisfies MoisFile), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
  const { blobs } = await list({ prefix: `${PREFIX}${safe(mois)}~`, limit: 100 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
}

// Toutes les nouvelles entrées (saisies dans l'outil), tous mois confondus
export async function listAppelsServer(): Promise<AppelEntry[]> {
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
  const parMois = new Map<string, { url: string; ts: number }>();
  for (const b of blobs) {
    const nom = b.pathname.slice(b.pathname.lastIndexOf("/") + 1);
    const cle = nom.split("~")[0];
    const ts = versionDe(b.pathname);
    const cur = parMois.get(cle);
    if (!cur || ts > cur.ts) parMois.set(cle, { url: b.url, ts });
  }
  const fichiers = await Promise.all(
    [...parMois.values()].map(async ({ url }) => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        return res.ok ? ((await res.json()) as MoisFile) : null;
      } catch {
        return null;
      }
    }),
  );
  return fichiers.filter((f): f is MoisFile => f !== null).flatMap((f) => f.entrees);
}

// Appels + liste des mois connus (y compris les mois créés mais encore vides)
export async function listRegistreServer(): Promise<{ entrees: AppelEntry[]; mois: string[] }> {
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
  const parMois = new Map<string, { url: string; ts: number }>();
  for (const b of blobs) {
    const nom = b.pathname.slice(b.pathname.lastIndexOf("/") + 1);
    const cle = nom.split("~")[0];
    const ts = versionDe(b.pathname);
    const cur = parMois.get(cle);
    if (!cur || ts > cur.ts) parMois.set(cle, { url: b.url, ts });
  }
  const fichiers = (
    await Promise.all(
      [...parMois.values()].map(async ({ url }) => {
        try { const r = await fetch(url, { cache: "no-store" }); return r.ok ? ((await r.json()) as MoisFile) : null; } catch { return null; }
      }),
    )
  ).filter((f): f is MoisFile => f !== null);
  return { entrees: fichiers.flatMap((f) => f.entrees), mois: fichiers.map((f) => f.mois).filter(Boolean) };
}

// Crée un mois vide (persisté) s'il n'existe pas encore
export async function creerMoisServer(mois: string): Promise<void> {
  const courant = await fichierMois(mois);
  if (!courant) await ecrireMois(mois, []);
}

// Ajoute un appel dans le fichier de son mois
export async function addAppelServer(entry: AppelEntry): Promise<void> {
  const courant = await fichierMois(entry.mois);
  const entrees = courant ? [...courant.data.entrees, entry] : [entry];
  await ecrireMois(entry.mois, entrees);
}

// Supprime un appel (uniquement les entrées saisies dans l'outil)
export async function deleteAppelServer(mois: string, id: string): Promise<void> {
  const courant = await fichierMois(mois);
  if (!courant) return;
  const entrees = courant.data.entrees.filter((e) => e.id !== id);
  await ecrireMois(mois, entrees);
}
