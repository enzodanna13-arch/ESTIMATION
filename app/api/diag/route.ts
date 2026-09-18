import { list } from "@vercel/blob";
import { verifierAccesEquipe } from "@/lib/historyAuth";
import { listEstimationsServer } from "@/lib/serverHistory";

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
  // Sonde TEMPORAIRE (?probe=etat) : accessible sans mot de passe mais ne
  // renvoie QUE des compteurs et des booléens — jamais de contenu, de nom de
  // fichier, ni de secret. Sert à diagnostiquer une disparition d'affichage.
  // À RETIRER une fois le diagnostic fait.
  const url = new URL(request.url);
  const probe = url.searchParams.get("probe") === "etat";

  if (!probe && !(await verifierAccesEquipe(request))) {
    return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  }

  if (probe) {
    const out: Record<string, unknown> = {
      jetonBlobPresent: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      historyPasswordEnvPresent: Boolean(process.env.HISTORY_PASSWORD),
    };
    try {
      const tout = await list({ limit: 1000 });
      out.totalFichiers = tout.blobs.length;
      out.aTronque = tout.hasMore ?? false;
    } catch (err) {
      out.erreurListe = { nom: (err as Error)?.name, message: (err as Error)?.message };
    }
    const counts: Record<string, number | string> = {};
    for (const p of PREFIXES) {
      try {
        const r = await list({ prefix: p, limit: 1000 });
        counts[p] = r.blobs.length;
      } catch (err) {
        counts[p] = "ERREUR: " + ((err as Error)?.message ?? "?");
      }
    }
    out.comptesParPrefixe = counts;

    // Test DÉCISIF : la vraie fonction de lecture (list + fetch de chaque URL).
    // Si list() donne 120 mais ceci renvoie 0, alors le fetch des URLs échoue.
    try {
      const t0 = Date.now();
      const rows = await listEstimationsServer();
      out.lectureReelleEstimations = {
        nombre: rows.length,
        ms: Date.now() - t0,
        premier: rows[0] ? { client: rows[0].client, ville: rows[0].ville } : null,
      };
    } catch (err) {
      out.lectureReelleEstimations = { erreur: (err as Error)?.message ?? String(err) };
    }

    // Test d'accès à UNE URL de blob (le fetch peut échouer même si list() marche).
    try {
      const one = await list({ prefix: "estimations/meta/", limit: 1 });
      if (one.blobs[0]) {
        const b = one.blobs[0];
        const r = await fetch(b.url, { cache: "no-store" });
        out.testFetchBlob = {
          hote: new URL(b.url).host,
          statut: r.status,
          ok: r.ok,
          jsonOk: r.ok ? (await r.json().then(() => true).catch(() => false)) : false,
        };
      } else {
        out.testFetchBlob = "aucun blob meta";
      }
    } catch (err) {
      out.testFetchBlob = { erreur: (err as Error)?.message ?? String(err) };
    }

    return Response.json(out);
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
