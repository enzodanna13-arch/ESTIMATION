import { del, list, put } from "@vercel/blob";
import type { DocumentInput, DocumentResult } from "./docTypes";
import type { EstimateResponse, PropertyInput } from "./types";

// Historique PARTAGÉ des estimations (Vercel Blob) : chaque négociateur de
// l'équipe voit et télécharge tous les dossiers, depuis n'importe quel
// poste. Deux familles de fichiers : « meta » (liste légère de l'accueil)
// et « full » (dossier complet avec photos, chargé à l'ouverture).

export interface HistoryMeta {
  id: string;
  createdAt: number;
  client: string;
  bien: string;
  ville: string;
  negociateur: string;
  fourchetteBasse: number;
  fourchetteHaute: number;
}

export interface HistoryFull extends HistoryMeta {
  result: EstimateResponse;
  input: PropertyInput;
}

const META_PREFIX = "estimations/meta/";
const FULL_PREFIX = "estimations/full/";

export async function saveEstimationServer(entry: HistoryFull): Promise<void> {
  const { result: _r, input: _i, ...meta } = entry;
  await Promise.all([
    put(`${META_PREFIX}${entry.id}.json`, JSON.stringify(meta), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    }),
    put(`${FULL_PREFIX}${entry.id}.json`, JSON.stringify(entry), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    }),
  ]);
}

export async function listEstimationsServer(): Promise<HistoryMeta[]> {
  const { blobs } = await list({ prefix: META_PREFIX, limit: 500 });
  const metas = await Promise.all(
    blobs.map(async (b) => {
      try {
        const res = await fetch(b.url, { cache: "no-store" });
        return res.ok ? ((await res.json()) as HistoryMeta) : null;
      } catch {
        return null;
      }
    }),
  );
  return metas
    .filter((m): m is HistoryMeta => m !== null)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getEstimationServer(id: string): Promise<HistoryFull | null> {
  const safe = id.replace(/[^a-z0-9-]/gi, "");
  const { blobs } = await list({ prefix: `${FULL_PREFIX}${safe}.json`, limit: 1 });
  if (blobs.length === 0) return null;
  try {
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    return res.ok ? ((await res.json()) as HistoryFull) : null;
  } catch {
    return null;
  }
}

export async function deleteEstimationServer(id: string): Promise<void> {
  const safe = id.replace(/[^a-z0-9-]/gi, "");
  const [meta, full] = await Promise.all([
    list({ prefix: `${META_PREFIX}${safe}.json`, limit: 1 }),
    list({ prefix: `${FULL_PREFIX}${safe}.json`, limit: 1 }),
  ]);
  const urls = [...meta.blobs, ...full.blobs].map((b) => b.url);
  if (urls.length > 0) await del(urls);
}


// ---------------------------------------------------------------------------
// Historique PARTAGÉ des documents générés (annonce, courriers, devis,
// facture, compromis) — même principe que les estimations : meta légère
// pour la liste, full pour la réouverture. Les pièces PDF téléversées du
// compromis ne sont PAS conservées (confidentialité) : seule la saisie l'est.
// ---------------------------------------------------------------------------

export interface DocHistoryMeta {
  id: string;
  createdAt: number;
  docType: string;
  titre: string; // libellé du type de document
  reference: string; // client / dossier / bien concerné
  negociateur: string;
}

export interface DocHistoryFull extends DocHistoryMeta {
  doc: DocumentResult;
  input: DocumentInput;
}

const DOC_META_PREFIX = "documents/meta/";
const DOC_FULL_PREFIX = "documents/full/";

export async function saveDocumentServer(entry: DocHistoryFull): Promise<void> {
  const { doc: _d, input: _i, ...meta } = entry;
  await Promise.all([
    put(`${DOC_META_PREFIX}${entry.id}.json`, JSON.stringify(meta), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    }),
    put(`${DOC_FULL_PREFIX}${entry.id}.json`, JSON.stringify(entry), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    }),
  ]);
}

export async function listDocumentsServer(): Promise<DocHistoryMeta[]> {
  const { blobs } = await list({ prefix: DOC_META_PREFIX, limit: 500 });
  const metas = await Promise.all(
    blobs.map(async (b) => {
      try {
        const res = await fetch(b.url, { cache: "no-store" });
        return res.ok ? ((await res.json()) as DocHistoryMeta) : null;
      } catch {
        return null;
      }
    }),
  );
  return metas
    .filter((m): m is DocHistoryMeta => m !== null)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getDocumentServer(id: string): Promise<DocHistoryFull | null> {
  const safe = id.replace(/[^a-z0-9-]/gi, "");
  const { blobs } = await list({ prefix: `${DOC_FULL_PREFIX}${safe}.json`, limit: 1 });
  if (blobs.length === 0) return null;
  try {
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    return res.ok ? ((await res.json()) as DocHistoryFull) : null;
  } catch {
    return null;
  }
}

export async function deleteDocumentServer(id: string): Promise<void> {
  const safe = id.replace(/[^a-z0-9-]/gi, "");
  const [meta, full] = await Promise.all([
    list({ prefix: `${DOC_META_PREFIX}${safe}.json`, limit: 1 }),
    list({ prefix: `${DOC_FULL_PREFIX}${safe}.json`, limit: 1 }),
  ]);
  const urls = [...meta.blobs, ...full.blobs].map((b) => b.url);
  if (urls.length > 0) await del(urls);
}


// ---------------------------------------------------------------------------
// DOSSIERS CLIENTS partagés : un dossier par client, dans lequel les
// négociateurs déposent toutes les pièces PDF (comptes rendus de visite,
// mandat, diagnostics…). Les PDF sont stockés en binaire sur le Blob ; leur
// téléchargement passe TOUJOURS par l'API protégée par mot de passe — les
// URL de stockage ne sont jamais exposées au navigateur.
// ---------------------------------------------------------------------------

export { CATEGORIES_PIECES } from "./docTypes";

export interface PieceClient {
  fileId: string;
  nom: string;
  taille: number;
  categorie: string;
  createdAt: number;
}

export type TypeClient = "vendeur" | "acquereur" | "investisseur";

// Une recherche immobilière (un même client peut en avoir plusieurs :
// résidence principale + investissement locatif, par exemple).
export interface RechercheImmo {
  id: string;
  libelle: string;
  actif: boolean;
  villes: string[];
  secteurs: string;
  rayonKm: number | null;
  typesBien: string[]; // appartement | maison | immeuble | terrain | local | garage | autre
  budgetMin: number | null;
  budgetMax: number | null;
  surfaceMin: number | null;
  surfaceIdeale: number | null;
  piecesMin: number | null;
  chambresMin: number | null;
  etage: string;
  ascenseur: "oui" | "non" | "indiff";
  exterieurs: string[]; // terrasse | balcon | jardin
  garage: boolean;
  stationnement: boolean;
  cave: boolean;
  piscine: boolean;
  travaux: "oui" | "non" | "indiff"; // travaux acceptés ?
  etatRecherche: string[]; // ancien | recent | neuf
  dpeMin: string;
  indispensables: string;
  secondaires: string;
  redhibitoires: string;
  commentaires: string;
}

export interface FinancementClient {
  budgetMax: number | null;
  apport: number | null;
  montantFinancement: number | null;
  financementValide: "oui" | "non" | "encours";
  banque: string;
  courtier: string;
  accordPrincipe: boolean;
  dateAccord: string;
  capaciteEmprunt: number | null;
  mensualiteMax: number | null;
}

export interface InvestissementClient {
  objectifs: string[]; // locative | deficit_foncier | meublee | lmnp | immeuble_rapport | achat_revente | autre
  rendementMin: number | null;
  loyerCible: number | null;
  rentabiliteBrute: number | null;
  cashflowMin: number | null;
  typeLocation: string;
  dureeProjet: string;
}

export interface TimelineEvent {
  id: string;
  date: number;
  type: string; // appel | email | rdv | visite | bien_propose | retour | offre | criteres | document | statut | note
  texte: string;
  auteur: string;
}

export interface ClientDossier {
  id: string;
  createdAt: number;
  updatedAt: number;
  nom: string; // nom du client
  bien: string; // bien concerné (vendeur) / résumé du projet (acquéreur)
  negociateur: string;
  pieces: PieceClient[];
  // --- CRM acquéreur / investisseur (tous facultatifs : les dossiers
  // vendeurs existants restent valides sans ces champs) ---
  typeClient?: TypeClient; // absent = vendeur (rétrocompatibilité)
  prenom?: string;
  tel?: string;
  email?: string;
  adresseActuelle?: string;
  statut?: string; // Nouveau | À qualifier | Recherche active | …
  derniereInteraction?: number;
  notes?: string;
  recherches?: RechercheImmo[];
  financement?: FinancementClient;
  investissement?: InvestissementClient;
  timeline?: TimelineEvent[];
}

const CLIENT_META_PREFIX = "clients/meta/";
const CLIENT_FILE_PREFIX = "clients/files/";

const safeId = (s: string) => s.replace(/[^a-z0-9-]/gi, "");

// Les métas sont VERSIONNÉS (« <id>~<updatedAt>.json ») : écraser un blob au
// même chemin laisse le CDN servir l'ancienne version pendant ~1 minute —
// un nouveau chemin à chaque mise à jour garantit une lecture toujours
// fraîche ; les anciennes versions sont supprimées dans la foulée.
async function putClientMeta(dossier: ClientDossier): Promise<void> {
  const nom = `${CLIENT_META_PREFIX}${dossier.id}~${dossier.updatedAt}.json`;
  await put(nom, JSON.stringify(dossier), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
  const { blobs } = await list({ prefix: `${CLIENT_META_PREFIX}${dossier.id}~`, limit: 100 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
}

/** Dernière version d'un méta parmi des blobs « <id>~<ts>.json ». */
function derniereVersion(pathname: string): number {
  const m = pathname.match(/~(\d+)\.json$/);
  return m ? Number(m[1]) : 0;
}

export async function saveClientServer(dossier: ClientDossier): Promise<void> {
  await putClientMeta(dossier);
}

export async function listClientsServer(): Promise<ClientDossier[]> {
  const { blobs } = await list({ prefix: CLIENT_META_PREFIX, limit: 1000 });
  // Une seule version (la plus récente) par dossier
  const parId = new Map<string, { url: string; ts: number }>();
  for (const b of blobs) {
    const nom = b.pathname.slice(b.pathname.lastIndexOf("/") + 1);
    const id = nom.split("~")[0];
    const ts = derniereVersion(b.pathname);
    const cur = parId.get(id);
    if (!cur || ts > cur.ts) parId.set(id, { url: b.url, ts });
  }
  const metas = await Promise.all(
    [...parId.values()].map(async ({ url }) => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        return res.ok ? ((await res.json()) as ClientDossier) : null;
      } catch {
        return null;
      }
    }),
  );
  return metas
    .filter((m): m is ClientDossier => m !== null)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getClientServer(id: string): Promise<ClientDossier | null> {
  const { blobs } = await list({ prefix: `${CLIENT_META_PREFIX}${safeId(id)}~`, limit: 100 });
  if (blobs.length === 0) return null;
  const dernier = blobs.reduce((a, b) => (derniereVersion(b.pathname) > derniereVersion(a.pathname) ? b : a));
  try {
    const res = await fetch(dernier.url, { cache: "no-store" });
    return res.ok ? ((await res.json()) as ClientDossier) : null;
  } catch {
    return null;
  }
}

export async function deleteClientServer(id: string): Promise<void> {
  const safe = safeId(id);
  const [meta, files] = await Promise.all([
    list({ prefix: `${CLIENT_META_PREFIX}${safe}~`, limit: 100 }),
    list({ prefix: `${CLIENT_FILE_PREFIX}${safe}/`, limit: 1000 }),
  ]);
  const urls = [...meta.blobs, ...files.blobs].map((b) => b.url);
  if (urls.length > 0) await del(urls);
}

export async function addClientFileServer(
  id: string,
  piece: { nom: string; categorie: string; data: string },
): Promise<ClientDossier | null> {
  const dossier = await getClientServer(id);
  if (!dossier) return null;
  const fileId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const octets = Buffer.from(piece.data, "base64");
  await put(`${CLIENT_FILE_PREFIX}${dossier.id}/${fileId}.pdf`, octets, {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/pdf",
  });
  dossier.pieces.push({
    fileId,
    nom: piece.nom,
    taille: octets.length,
    categorie: piece.categorie,
    createdAt: Date.now(),
  });
  dossier.updatedAt = Date.now();
  await putClientMeta(dossier);
  return dossier;
}

// Enregistre une pièce dont le PDF a DÉJÀ été téléversé directement sur le
// Blob (upload navigateur → Blob, sans passer par le corps serverless, pour
// les gros fichiers > 4,5 Mo). On vérifie que le blob existe bien au chemin
// attendu et on lit sa VRAIE taille sur le Blob (jamais la taille annoncée
// par le client). Aucun octet ne transite par cette requête.
export async function addClientFilePreuploadedServer(
  id: string,
  piece: { fileId: string; nom: string; categorie: string },
): Promise<ClientDossier | null> {
  const dossier = await getClientServer(id);
  if (!dossier) return null;
  const fileId = safeId(piece.fileId);
  if (!fileId) return null;
  const { blobs } = await list({
    prefix: `${CLIENT_FILE_PREFIX}${dossier.id}/${fileId}.pdf`,
    limit: 1,
  });
  if (blobs.length === 0) return null; // aucun fichier téléversé à ce chemin
  dossier.pieces.push({
    fileId,
    nom: piece.nom,
    taille: blobs[0].size ?? 0,
    categorie: piece.categorie,
    createdAt: Date.now(),
  });
  dossier.updatedAt = Date.now();
  await putClientMeta(dossier);
  return dossier;
}

export async function getClientFileServer(id: string, fileId: string): Promise<ArrayBuffer | null> {
  const { blobs } = await list({
    prefix: `${CLIENT_FILE_PREFIX}${safeId(id)}/${safeId(fileId)}.pdf`,
    limit: 1,
  });
  if (blobs.length === 0) return null;
  try {
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// VISITES VIRTUELLES 360° : prises de vue équirectangulaires (Insta360…)
// déposées par les négociateurs — une scène par pièce. La LECTURE d'une
// visite est publique (lien de partage client, id aléatoire non devinable) ;
// création, ajout de scènes et suppression restent protégées par le mot de
// passe d'équipe. Métas versionnés comme les dossiers clients.
// ---------------------------------------------------------------------------

export interface SceneVisite {
  imgId: string;
  nom: string; // nom de la pièce (Séjour, Cuisine…)
  createdAt: number;
}

export interface VisiteVirtuelle {
  id: string;
  createdAt: number;
  updatedAt: number;
  bien: string; // désignation du bien
  negociateur: string;
  scenes: SceneVisite[];
}

const VISITE_META_PREFIX = "visites/meta/";
const VISITE_IMG_PREFIX = "visites/img/";

async function putVisiteMeta(v: VisiteVirtuelle): Promise<void> {
  const nom = `${VISITE_META_PREFIX}${v.id}~${v.updatedAt}.json`;
  await put(nom, JSON.stringify(v), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
  const { blobs } = await list({ prefix: `${VISITE_META_PREFIX}${v.id}~`, limit: 100 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
}

export async function saveVisiteServer(v: VisiteVirtuelle): Promise<void> {
  await putVisiteMeta(v);
}

export async function listVisitesServer(): Promise<VisiteVirtuelle[]> {
  const { blobs } = await list({ prefix: VISITE_META_PREFIX, limit: 1000 });
  const parId = new Map<string, { url: string; ts: number }>();
  for (const b of blobs) {
    const nom = b.pathname.slice(b.pathname.lastIndexOf("/") + 1);
    const id = nom.split("~")[0];
    const ts = derniereVersion(b.pathname);
    const cur = parId.get(id);
    if (!cur || ts > cur.ts) parId.set(id, { url: b.url, ts });
  }
  const metas = await Promise.all(
    [...parId.values()].map(async ({ url }) => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        return res.ok ? ((await res.json()) as VisiteVirtuelle) : null;
      } catch {
        return null;
      }
    }),
  );
  return metas
    .filter((m): m is VisiteVirtuelle => m !== null)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getVisiteServer(id: string): Promise<VisiteVirtuelle | null> {
  const { blobs } = await list({ prefix: `${VISITE_META_PREFIX}${safeId(id)}~`, limit: 100 });
  if (blobs.length === 0) return null;
  const dernier = blobs.reduce((a, b) => (derniereVersion(b.pathname) > derniereVersion(a.pathname) ? b : a));
  try {
    const res = await fetch(dernier.url, { cache: "no-store" });
    return res.ok ? ((await res.json()) as VisiteVirtuelle) : null;
  } catch {
    return null;
  }
}

export async function deleteVisiteServer(id: string): Promise<void> {
  const safe = safeId(id);
  const [meta, imgs] = await Promise.all([
    list({ prefix: `${VISITE_META_PREFIX}${safe}~`, limit: 100 }),
    list({ prefix: `${VISITE_IMG_PREFIX}${safe}/`, limit: 1000 }),
  ]);
  const urls = [...meta.blobs, ...imgs.blobs].map((b) => b.url);
  if (urls.length > 0) await del(urls);
}

export async function addVisiteImageServer(
  id: string,
  scene: { nom: string; data: string },
): Promise<VisiteVirtuelle | null> {
  const v = await getVisiteServer(id);
  if (!v) return null;
  const imgId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await put(`${VISITE_IMG_PREFIX}${v.id}/${imgId}.jpg`, Buffer.from(scene.data, "base64"), {
    access: "public",
    addRandomSuffix: false,
    contentType: "image/jpeg",
  });
  v.scenes.push({ imgId, nom: scene.nom, createdAt: Date.now() });
  v.updatedAt = Date.now();
  await putVisiteMeta(v);
  return v;
}

export async function getVisiteImageServer(id: string, imgId: string): Promise<ArrayBuffer | null> {
  const { blobs } = await list({
    prefix: `${VISITE_IMG_PREFIX}${safeId(id)}/${safeId(imgId)}.jpg`,
    limit: 1,
  });
  if (blobs.length === 0) return null;
  try {
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// VEILLE CONCURRENTE PAR LIEN : le négociateur colle l'URL d'UNE annonce
// d'agence concurrente ; on en extrait titre/prix/photo (métadonnées
// publiques de la page) et on suit la baisse de prix dans le temps. Ciblé
// (annonce par annonce), pas de moissonnage de catalogue. Protégé par mot
// de passe. Métas versionnés comme les dossiers clients.
// ---------------------------------------------------------------------------

export interface ConcurrentListing {
  id: string;
  createdAt: number;
  updatedAt: number;
  url: string;
  titre: string;
  prix: number | null;
  image: string; // URL og:image distante (référencée, non stockée)
  ville: string;
  source: string; // nom de domaine (agence)
  negociateur: string;
  note: string;
  historiquePrix: { date: number; prix: number }[];
}

const CONC_META_PREFIX = "concurrents/meta/";

async function putConcurrent(c: ConcurrentListing): Promise<void> {
  const nom = `${CONC_META_PREFIX}${c.id}~${c.updatedAt}.json`;
  await put(nom, JSON.stringify(c), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: `${CONC_META_PREFIX}${c.id}~`, limit: 100 });
  const vieilles = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (vieilles.length > 0) await del(vieilles);
}

export async function saveConcurrentServer(c: ConcurrentListing): Promise<void> {
  await putConcurrent(c);
}

export async function listConcurrentsServer(): Promise<ConcurrentListing[]> {
  const { blobs } = await list({ prefix: CONC_META_PREFIX, limit: 1000 });
  const parId = new Map<string, { url: string; ts: number }>();
  for (const b of blobs) {
    const nom = b.pathname.slice(b.pathname.lastIndexOf("/") + 1);
    const id = nom.split("~")[0];
    const ts = derniereVersion(b.pathname);
    const cur = parId.get(id);
    if (!cur || ts > cur.ts) parId.set(id, { url: b.url, ts });
  }
  const metas = await Promise.all(
    [...parId.values()].map(async ({ url }) => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        return res.ok ? ((await res.json()) as ConcurrentListing) : null;
      } catch {
        return null;
      }
    }),
  );
  return metas.filter((m): m is ConcurrentListing => m !== null).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getConcurrentServer(id: string): Promise<ConcurrentListing | null> {
  const { blobs } = await list({ prefix: `${CONC_META_PREFIX}${safeId(id)}~`, limit: 100 });
  if (blobs.length === 0) return null;
  const dernier = blobs.reduce((a, b) => (derniereVersion(b.pathname) > derniereVersion(a.pathname) ? b : a));
  try {
    const res = await fetch(dernier.url, { cache: "no-store" });
    return res.ok ? ((await res.json()) as ConcurrentListing) : null;
  } catch {
    return null;
  }
}

export async function deleteConcurrentServer(id: string): Promise<void> {
  const { blobs } = await list({ prefix: `${CONC_META_PREFIX}${safeId(id)}~`, limit: 100 });
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
}

export async function deleteVisiteImageServer(id: string, imgId: string): Promise<VisiteVirtuelle | null> {
  const v = await getVisiteServer(id);
  if (!v) return null;
  const { blobs } = await list({ prefix: `${VISITE_IMG_PREFIX}${v.id}/${safeId(imgId)}.jpg`, limit: 1 });
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
  v.scenes = v.scenes.filter((s) => s.imgId !== imgId);
  v.updatedAt = Date.now();
  await putVisiteMeta(v);
  return v;
}

export async function deleteClientFileServer(id: string, fileId: string): Promise<ClientDossier | null> {
  const dossier = await getClientServer(id);
  if (!dossier) return null;
  const { blobs } = await list({
    prefix: `${CLIENT_FILE_PREFIX}${dossier.id}/${safeId(fileId)}.pdf`,
    limit: 1,
  });
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
  dossier.pieces = dossier.pieces.filter((p) => p.fileId !== fileId);
  dossier.updatedAt = Date.now();
  await putClientMeta(dossier);
  return dossier;
}
