import { del, list, put } from "@vercel/blob";

// ARCHIVE SYNDIC : documents PDF analysés par l'IA (nom normalisé + catégorie),
// rangés et consultables. Métadonnées JSON versionné + PDF sur Blob. Partagé.

export const CATEGORIES_ARCHIVE = [
  "Procès-verbal d'AG",
  "Convocation d'AG",
  "Appel de fonds",
  "Décompte de charges",
  "Budget prévisionnel",
  "Contrat",
  "Facture",
  "Devis",
  "Règlement de copropriété",
  "Diagnostic technique",
  "Courrier",
  "Sinistre / Assurance",
  "Mutation / État daté",
  "Relevé / Comptabilité",
  "Carnet d'entretien",
  "Autre",
] as const;

export interface DocArchive {
  id: string;
  nom: string;
  categorie: string;
  copropriete: string;
  date: string; // yyyy-mm-dd ou ""
  resume: string;
  taille: number;
  createdAt: number;
  updatedAt: number;
}

const META_PREFIX = "syndic/archive/meta/";
const FILE_PREFIX = "syndic/archive/files/";

const safeId = (s: string) => (s || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
const version = (p: string) => { const m = p.match(/~(\d+)\.json$/); return m ? Number(m[1]) : 0; };
const txt = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
const rid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
const categorieValide = (v: unknown) => ((CATEGORIES_ARCHIVE as readonly string[]).includes(typeof v === "string" ? v : "") ? (v as string) : "Autre");

function normaliser(input: Partial<DocArchive>, base?: DocArchive): DocArchive {
  const now = Date.now();
  return {
    id: base?.id ?? (safeId(input.id || "") || rid()),
    nom: txt(input.nom, 200) || "Document",
    categorie: categorieValide(input.categorie),
    copropriete: txt(input.copropriete, 200),
    date: txt(input.date, 10),
    resume: txt(input.resume, 1000),
    taille: typeof input.taille === "number" ? input.taille : base?.taille ?? 0,
    createdAt: base?.createdAt ?? now,
    updatedAt: now,
  };
}

async function putMeta(d: DocArchive): Promise<void> {
  const nom = `${META_PREFIX}${d.id}~${d.updatedAt}.json`;
  await put(nom, JSON.stringify(d), { access: "public", addRandomSuffix: false, contentType: "application/json" });
  const { blobs } = await list({ prefix: `${META_PREFIX}${d.id}~`, limit: 100 });
  const anciennes = blobs.filter((b) => b.pathname !== nom).map((b) => b.url);
  if (anciennes.length > 0) await del(anciennes);
}

export async function listArchive(): Promise<DocArchive[]> {
  const { blobs } = await list({ prefix: META_PREFIX, limit: 1000 });
  const parId = new Map<string, { url: string; v: number }>();
  for (const b of blobs) {
    const m = b.pathname.slice(META_PREFIX.length).match(/^(.+)~(\d+)\.json$/);
    if (!m) continue;
    const id = m[1], v = Number(m[2]);
    const cur = parId.get(id);
    if (!cur || v > cur.v) parId.set(id, { url: b.url, v });
  }
  const out: DocArchive[] = [];
  await Promise.all([...parId.values()].map(async ({ url }) => {
    try { const r = await fetch(url, { cache: "no-store" }); if (r.ok) out.push((await r.json()) as DocArchive); } catch { /* ignore */ }
  }));
  out.sort((a, b) => (b.date || "").localeCompare(a.date || "") || b.createdAt - a.createdAt);
  return out;
}

export async function getArchive(id: string): Promise<DocArchive | null> {
  const { blobs } = await list({ prefix: `${META_PREFIX}${safeId(id)}~`, limit: 100 });
  if (blobs.length === 0) return null;
  const best = blobs.reduce((a, b) => (version(b.pathname) > version(a.pathname) ? b : a));
  try { const r = await fetch(best.url, { cache: "no-store" }); return r.ok ? ((await r.json()) as DocArchive) : null; } catch { return null; }
}

export async function createArchive(input: Partial<DocArchive>, data: string): Promise<DocArchive> {
  const d = normaliser(input);
  const octets = Buffer.from(data, "base64");
  d.taille = octets.length;
  await put(`${FILE_PREFIX}${d.id}.pdf`, octets, { access: "public", addRandomSuffix: false, contentType: "application/pdf" });
  await putMeta(d);
  return d;
}

export async function updateArchive(id: string, input: Partial<DocArchive>): Promise<DocArchive | null> {
  const base = await getArchive(id);
  if (!base) return null;
  const d = normaliser({ ...base, ...input, id: base.id }, base);
  await putMeta(d);
  return d;
}

export async function deleteArchive(id: string): Promise<boolean> {
  const safe = safeId(id);
  const [meta, files] = await Promise.all([
    list({ prefix: `${META_PREFIX}${safe}~`, limit: 100 }),
    list({ prefix: `${FILE_PREFIX}${safe}.pdf`, limit: 2 }),
  ]);
  const urls = [...meta.blobs, ...files.blobs].map((b) => b.url);
  if (urls.length > 0) await del(urls);
  return urls.length > 0;
}

export async function getArchiveFile(id: string): Promise<ArrayBuffer | null> {
  const { blobs } = await list({ prefix: `${FILE_PREFIX}${safeId(id)}.pdf`, limit: 2 });
  if (blobs.length === 0) return null;
  try { const r = await fetch(blobs[0].url, { cache: "no-store" }); return r.ok ? await r.arrayBuffer() : null; } catch { return null; }
}
