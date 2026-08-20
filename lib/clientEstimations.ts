import { del, list, put } from "@vercel/blob";
import type {
  ClientEstimationMeta,
  ClientEstimationRecord,
  DossierClientPublic,
  PhotoMeta,
} from "./clientTypes";

// Persistance des ESTIMATIONS CLIENTS (IA Estimation Client) sur Vercel Blob,
// avec des préfixes DÉDIÉS, totalement séparés des dossiers Pro
// (`estimations/*`) : aucune estimation négociateur n'est jamais touchée.
//
// - meta/full : versionnés « {id}~{updatedAt}.json » (le back-office met à jour
//   statut et notes) — même motif anti-cache que les leads/clients.
// - public/{token}.json : projection CLIENT du dossier, écrite une fois, lue
//   par un token secret (un visiteur ne voit QUE son dossier).
// - photos/{id}/{idx} : binaires des photos, servis via l'API par token.

const META = "estimations-clients/meta/";
const FULL = "estimations-clients/full/";
const PUBLIC = "estimations-clients/public/";
const PHOTOS = "estimations-clients/photos/";
const TOKENIDX = "estimations-clients/tokenidx/"; // token → id (pour l'action « être rappelé »)

const safeId = (s: string) => s.replace(/[^a-z0-9-]/gi, "");
const version = (pathname: string) => {
  const m = pathname.match(/~(\d+)\.json$/);
  return m ? Number(m[1]) : 0;
};

function metaDe(r: ClientEstimationRecord): ClientEstimationMeta {
  return {
    id: r.id, createdAt: r.createdAt, updatedAt: r.updatedAt, statut: r.statut,
    prenom: r.input.prenom, nom: r.input.nom, tel: r.input.tel, email: r.input.email,
    ville: r.input.ville, typeBien: r.input.typeBien, surfaceHabitable: r.input.surfaceHabitable,
    prixEstime: r.report.prix_estime, projet: r.input.projet, souhaiteRappel: r.input.souhaiteRappel,
    origin: r.marketing?.origin, utm_campaign: r.marketing?.utm_campaign,
  };
}

function dossierPublicDe(r: ClientEstimationRecord): DossierClientPublic {
  return {
    token: r.token,
    createdAt: r.createdAt,
    transmis: r.transmisAuClient === true,
    bien: {
      adresse: r.input.adresse, ville: r.input.ville, typeBien: r.input.typeBien,
      surfaceHabitable: r.input.surfaceHabitable, surfaceTerrain: r.input.surfaceTerrain ?? null,
      nbPieces: r.input.nbPieces, nbChambres: r.input.nbChambres,
      etat: r.input.etat, prestations: r.input.prestations,
    },
    proprietaire: { prenom: r.input.prenom, nom: r.input.nom },
    report: r.report,
    completude: r.completude,
    confiance: r.confiance,
    photos: r.photos,
  };
}

async function putMeta(r: ClientEstimationRecord): Promise<void> {
  const nom = `${META}${r.id}~${r.updatedAt}.json`;
  await put(nom, JSON.stringify(metaDe(r)), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: `${META}${r.id}~`, limit: 100 });
  const vieilles = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (vieilles.length > 0) await del(vieilles);
}

async function putFull(r: ClientEstimationRecord): Promise<void> {
  const nom = `${FULL}${r.id}~${r.updatedAt}.json`;
  await put(nom, JSON.stringify(r), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: `${FULL}${r.id}~`, limit: 100 });
  const vieilles = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (vieilles.length > 0) await del(vieilles);
}

/** Enregistre l'estimation (meta + full) et (re)génère la projection publique. */
export async function saveClientEstimation(r: ClientEstimationRecord): Promise<void> {
  r.updatedAt = Date.now();
  await Promise.all([
    putMeta(r),
    putFull(r),
    put(`${PUBLIC}${safeId(r.token)}.json`, JSON.stringify(dossierPublicDe(r)), {
      access: "public", addRandomSuffix: false, contentType: "application/json",
    }),
    put(`${TOKENIDX}${safeId(r.token)}.json`, JSON.stringify({ id: r.id }), {
      access: "public", addRandomSuffix: false, contentType: "application/json",
    }),
  ]);
}

/** Résout l'id interne à partir du token secret (usage serveur uniquement). */
export async function getIdByToken(token: string): Promise<string | null> {
  const { blobs } = await list({ prefix: `${TOKENIDX}${safeId(token)}.json`, limit: 1 });
  if (blobs.length === 0) return null;
  try {
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    return res.ok ? (((await res.json()) as { id?: string }).id ?? null) : null;
  } catch { return null; }
}

/** Liste back-office (métas), plus récentes d'abord. */
export async function listClientEstimationsServer(): Promise<ClientEstimationMeta[]> {
  const { blobs } = await list({ prefix: META, limit: 1000 });
  const parId = new Map<string, { url: string; ts: number }>();
  for (const b of blobs) {
    const nom = b.pathname.slice(b.pathname.lastIndexOf("/") + 1);
    const id = nom.split("~")[0];
    const ts = version(b.pathname);
    const cur = parId.get(id);
    if (!cur || ts > cur.ts) parId.set(id, { url: b.url, ts });
  }
  const metas = await Promise.all(
    [...parId.values()].map(async ({ url }) => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        return res.ok ? ((await res.json()) as ClientEstimationMeta) : null;
      } catch { return null; }
    }),
  );
  return metas.filter((m): m is ClientEstimationMeta => m !== null).sort((a, b) => b.createdAt - a.createdAt);
}

/** Enregistrement complet (back-office). */
export async function getClientEstimationServer(id: string): Promise<ClientEstimationRecord | null> {
  const { blobs } = await list({ prefix: `${FULL}${safeId(id)}~`, limit: 100 });
  if (blobs.length === 0) return null;
  const dernier = blobs.reduce((a, b) => (version(b.pathname) > version(a.pathname) ? b : a));
  try {
    const res = await fetch(dernier.url, { cache: "no-store" });
    return res.ok ? ((await res.json()) as ClientEstimationRecord) : null;
  } catch { return null; }
}

/** Dossier CLIENT par token secret (un visiteur ne voit que le sien). */
export async function getDossierPublic(token: string): Promise<DossierClientPublic | null> {
  const { blobs } = await list({ prefix: `${PUBLIC}${safeId(token)}.json`, limit: 1 });
  if (blobs.length === 0) return null;
  try {
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    return res.ok ? ((await res.json()) as DossierClientPublic) : null;
  } catch { return null; }
}

/** Met à jour le suivi commercial (statut, notes, lien lead) — back-office. */
export async function updateClientEstimationServer(
  id: string,
  patch: Partial<Pick<ClientEstimationRecord, "statut" | "notes" | "leadId" | "transmisAuClient" | "envoyeLe">>,
): Promise<ClientEstimationRecord | null> {
  const r = await getClientEstimationServer(id);
  if (!r) return null;
  if (patch.statut !== undefined) r.statut = patch.statut;
  if (patch.notes !== undefined) r.notes = patch.notes;
  if (patch.leadId !== undefined) r.leadId = patch.leadId;
  if (patch.transmisAuClient !== undefined) r.transmisAuClient = patch.transmisAuClient;
  if (patch.envoyeLe !== undefined) r.envoyeLe = patch.envoyeLe;
  await saveClientEstimation(r);
  return r;
}

// --- Photos ----------------------------------------------------------------
// Clés par le TOKEN secret (jamais l'id interne) : le dossier public peut ainsi
// servir ses photos par token, sans exposer d'identifiant devinable.
export async function addClientEstimationPhoto(
  tokenRef: string, idx: number, base64: string, mediaType: string,
): Promise<void> {
  await put(`${PHOTOS}${safeId(tokenRef)}/${idx}`, Buffer.from(base64, "base64"), {
    access: "public", addRandomSuffix: false, contentType: mediaType || "image/jpeg",
  });
}

export async function getClientEstimationPhoto(tokenRef: string, idx: number): Promise<ArrayBuffer | null> {
  const { blobs } = await list({ prefix: `${PHOTOS}${safeId(tokenRef)}/${idx}`, limit: 1 });
  if (blobs.length === 0) return null;
  try {
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    return res.ok ? await res.arrayBuffer() : null;
  } catch { return null; }
}

// --- Garde-fou de dépense : nombre d'estimations créées aujourd'hui ---------
// Compté par lecture des métas (pas de compteur mutable → pas de course).
export async function countEstimationsToday(): Promise<number> {
  const debut = new Date(); debut.setHours(0, 0, 0, 0);
  const seuil = debut.getTime();
  const metas = await listClientEstimationsServer();
  return metas.filter((m) => m.createdAt >= seuil).length;
}
