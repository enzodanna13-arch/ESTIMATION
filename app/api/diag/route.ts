import { list } from "@vercel/blob";
import { verifierAccesEquipe } from "@/lib/historyAuth";

// Diagnostic LECTURE SEULE de l'accès au stockage (Vercel Blob). Aucun secret
// n'est renvoyé : seulement des indicateurs (jeton présent ou non, nombre de
// fichiers réellement lisibles, quelques noms). Sert à comprendre pourquoi
// l'interface s'affiche vide (données inaccessibles ≠ données supprimées).

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
    // On ne renvoie JAMAIS la valeur — seulement un aperçu masqué pour repérer
    // un changement de store (le préfixe du jeton identifie le store Blob).
    jetonApercu: process.env.BLOB_READ_WRITE_TOKEN
      ? process.env.BLOB_READ_WRITE_TOKEN.slice(0, 22) + "…"
      : null,
  };

  // Liste globale (tous préfixes) pour connaître le nombre TOTAL de fichiers.
  try {
    const tout = await list({ limit: 1000 });
    rapport.totalFichiers = tout.blobs.length;
    rapport.aTronque = tout.hasMore ?? false;
    rapport.exemplesGlobaux = tout.blobs.slice(0, 5).map((b) => b.pathname);
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
      parPrefixe[p] = {
        nombre: r.blobs.length,
        exemples: r.blobs.slice(0, 3).map((b) => b.pathname),
      };
    } catch (err) {
      parPrefixe[p] = {
        erreur: (err as Error)?.message ?? String(err),
      };
    }
  }
  rapport.parPrefixe = parPrefixe;

  return Response.json(rapport);
}
