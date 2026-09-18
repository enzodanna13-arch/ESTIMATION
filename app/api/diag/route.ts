import { list } from "@vercel/blob";
import { verifierAccesEquipe } from "@/lib/historyAuth";
import { listEstimationsServer } from "@/lib/serverHistory";

// Diagnostic LECTURE SEULE de l'accès au stockage (Vercel Blob), protégé par le
// mot de passe d'équipe. Aucun secret n'est renvoyé : seulement des indicateurs
// (jeton présent, nombre de fichiers réellement lisibles). Sert à comprendre
// pourquoi une liste s'afficherait vide (données inaccessibles ≠ supprimées).

export const dynamic = "force-dynamic";

const PREFIXES = [
  "estimations/meta/",
  "estimations/full/",
  "documents/meta/",
  "clients/",
  "leads/",
  "visites/",
  "config/",
];

export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) {
    return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  }

  const rapport: Record<string, unknown> = {
    date: new Date().toISOString(),
    jetonBlobPresent: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  };

  try {
    const tout = await list({ limit: 1000 });
    rapport.totalFichiers = tout.blobs.length;
    rapport.aTronque = tout.hasMore ?? false;
  } catch (err) {
    rapport.erreurListeGlobale = {
      nom: (err as Error)?.name ?? "Error",
      message: (err as Error)?.message ?? String(err),
    };
  }

  const parPrefixe: Record<string, unknown> = {};
  for (const p of PREFIXES) {
    try {
      const r = await list({ prefix: p, limit: 1000 });
      parPrefixe[p] = r.blobs.length;
    } catch (err) {
      parPrefixe[p] = "ERREUR: " + ((err as Error)?.message ?? "?");
    }
  }
  rapport.comptesParPrefixe = parPrefixe;

  try {
    const rows = await listEstimationsServer();
    rapport.lectureReelleEstimations = rows.length;
  } catch (err) {
    rapport.lectureReelleEstimations = "ERREUR: " + ((err as Error)?.message ?? "?");
  }

  return Response.json(rapport);
}
