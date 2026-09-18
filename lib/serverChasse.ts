import { del, list, put } from "@vercel/blob";

// Chasse immobilière : fiches de biens repérés en ligne par les négociateurs.
// Le négociateur colle le lien d'une annonce ; l'IA en extrait les infos et
// les photos, puis il complète (son estimation, notes, statut, contact).
// Stockage PARTAGÉ (Vercel Blob), versionné par updatedAt comme les leads.

export interface FicheChasse {
  id: string;
  createdAt: number;
  updatedAt: number;
  negociateur: string;
  // Source
  url: string; // lien de l'annonce
  source: string; // hôte du site (ex. seloger.com)
  // Infos du bien (extraites puis modifiables)
  titre: string;
  typeBien: string; // Appartement / Maison / Terrain / …
  ville: string;
  codePostal: string;
  prixAffiche: number; // prix demandé dans l'annonce (0 si inconnu)
  surface: number; // m² (0 si inconnu)
  pieces: number;
  chambres: number;
  dpe: string; // classe A..G ou vide
  description: string;
  photos: string[]; // URLs des photos
  // Saisie du négociateur
  estimationNego: number; // montant d'estimation du négociateur (0 si non saisi)
  statut: string;
  notes: string;
  contactProprietaire: string;
  archived?: boolean;
}

export const STATUTS_CHASSE = [
  "À contacter",
  "Contacté",
  "À visiter",
  "Visité",
  "Estimation faite",
  "Mandat en cours",
  "Offre en cours",
  "Écarté",
] as const;

const PREFIX = "chasse/";
const ARCHIVE = "chasse-archive/";

const safe = (id: string) => id.replace(/[^a-z0-9-]/gi, "");

export function ficheVide(partial: Partial<FicheChasse>): FicheChasse {
  const now = Date.now();
  return {
    id: partial.id ?? `ch-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: partial.createdAt ?? now,
    updatedAt: now,
    negociateur: partial.negociateur ?? "",
    url: partial.url ?? "",
    source: partial.source ?? "",
    titre: partial.titre ?? "",
    typeBien: partial.typeBien ?? "",
    ville: partial.ville ?? "",
    codePostal: partial.codePostal ?? "",
    prixAffiche: partial.prixAffiche ?? 0,
    surface: partial.surface ?? 0,
    pieces: partial.pieces ?? 0,
    chambres: partial.chambres ?? 0,
    dpe: partial.dpe ?? "",
    description: partial.description ?? "",
    photos: partial.photos ?? [],
    estimationNego: partial.estimationNego ?? 0,
    statut: partial.statut ?? "À contacter",
    notes: partial.notes ?? "",
    contactProprietaire: partial.contactProprietaire ?? "",
    archived: partial.archived ?? false,
  };
}

// Enregistre une fiche (nouvelle version) et purge les versions plus anciennes.
export async function saveChasseServer(fiche: FicheChasse): Promise<FicheChasse> {
  const complet = ficheVide(fiche); // normalise + met à jour updatedAt
  complet.id = fiche.id || complet.id;
  complet.createdAt = fiche.createdAt || complet.createdAt;
  const nom = `${PREFIX}${safe(complet.id)}~${complet.updatedAt}.json`;
  await put(nom, JSON.stringify(complet), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  // Purge des versions antérieures (on ne garde que la plus récente)
  try {
    const { blobs } = await list({ prefix: `${PREFIX}${safe(complet.id)}~`, limit: 100 });
    const vieux = blobs.filter((b) => !b.pathname.endsWith(`~${complet.updatedAt}.json`)).map((b) => b.url);
    if (vieux.length > 0) await del(vieux);
  } catch {
    /* purge best-effort : la dernière version prime de toute façon */
  }
  return complet;
}

export async function listChasseServer(): Promise<FicheChasse[]> {
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
  // Une fiche peut avoir plusieurs versions ; on ne garde que la plus récente.
  const parId = new Map<string, { updatedAt: number; url: string }>();
  for (const b of blobs) {
    const m = b.pathname.slice(PREFIX.length).match(/^(.+)~(\d+)\.json$/);
    if (!m) continue;
    const id = m[1];
    const updatedAt = Number(m[2]);
    const prev = parId.get(id);
    if (!prev || updatedAt > prev.updatedAt) parId.set(id, { updatedAt, url: b.url });
  }
  const fiches = await Promise.all(
    [...parId.values()].map(async (v) => {
      try {
        const res = await fetch(v.url, { cache: "no-store" });
        return res.ok ? ((await res.json()) as FicheChasse) : null;
      } catch {
        return null;
      }
    }),
  );
  return fiches
    .filter((f): f is FicheChasse => f !== null && !f.archived)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getChasseServer(id: string): Promise<FicheChasse | null> {
  const { blobs } = await list({ prefix: `${PREFIX}${safe(id)}~`, limit: 100 });
  if (blobs.length === 0) return null;
  const dernier = blobs.sort((a, b) => b.pathname.localeCompare(a.pathname))[0];
  try {
    const res = await fetch(dernier.url, { cache: "no-store" });
    return res.ok ? ((await res.json()) as FicheChasse) : null;
  } catch {
    return null;
  }
}

// Suppression = archivage (on garde une trace, jamais de perte sèche).
export async function deleteChasseServer(id: string): Promise<void> {
  const fiche = await getChasseServer(id);
  if (fiche) {
    const archivee = { ...fiche, archived: true, updatedAt: Date.now() };
    await put(`${ARCHIVE}${safe(id)}~${archivee.updatedAt}.json`, JSON.stringify(archivee), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });
  }
  const { blobs } = await list({ prefix: `${PREFIX}${safe(id)}~`, limit: 100 });
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
}
