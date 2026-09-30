import { verifierAccesEquipe } from "@/lib/historyAuth";
import {
  deleteClientFileServer,
  getClientServer,
  listerCheminsFichiersClient,
  renameClientFileServer,
  resoudreUrlFichierClient,
} from "@/lib/serverHistory";

export const dynamic = "force-dynamic";

// Une pièce PDF du dossier client : téléchargement (via l'API protégée —
// les URL de stockage ne sont jamais exposées) et suppression
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; fileId: string }> },
) {
  if (!(await verifierAccesEquipe(request))) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  const { id, fileId } = await params;

  const dossier = await getClientServer(id).catch(() => null);
  const piece = dossier?.pieces.find((p) => p.fileId === fileId);
  const cible = await resoudreUrlFichierClient(id, fileId, piece?.url);

  if (!cible) {
    // Blob réellement introuvable : diagnostic détaillé (remonté à l'écran).
    const chemins = await listerCheminsFichiersClient(id);
    const noms = chemins.map((c) => c.split("/").pop()).join(", ");
    const diag = `fileId=${fileId} · url mémorisée=${piece?.url ? "oui" : "non"} · ${chemins.length} blob(s) dans le dossier${noms ? ` : ${noms}` : ""}`;
    return Response.json({ error: `Pièce introuvable dans le stockage (${diag})` }, { status: 404 });
  }

  const nom = (piece?.nom ?? "piece.pdf").replace(/["\\\r\n]/g, "");
  // 1) On tente de servir le fichier via le serveur (URL de stockage masquée).
  try {
    const res = await fetch(cible, { cache: "no-store" });
    if (res.ok) {
      return new Response(await res.arrayBuffer(), {
        headers: {
          "content-type": "application/pdf",
          "content-disposition": `attachment; filename="${nom}"`,
          "cache-control": "no-store",
        },
      });
    }
  } catch {
    /* on bascule sur la redirection directe ci-dessous */
  }
  // 2) Repli infaillible : on redirige le navigateur directement vers le blob
  //    public (le fichier se télécharge même si la récupération serveur échoue).
  return Response.redirect(cible, 307);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; fileId: string }> },
) {
  if (!(await verifierAccesEquipe(request))) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  const { id, fileId } = await params;
  try {
    const dossier = await deleteClientFileServer(id, fileId);
    if (!dossier) return Response.json({ error: "Dossier introuvable" }, { status: 404 });
    return Response.json({ dossier });
  } catch {
    return Response.json({ error: "Suppression impossible" }, { status: 500 });
  }
}

// Renomme une pièce (et, si fourni, change sa catégorie).
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; fileId: string }> },
) {
  if (!(await verifierAccesEquipe(request))) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  const { id, fileId } = await params;
  let body: { nom?: string; categorie?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Corps de requête invalide" }, { status: 400 });
  }
  if (!body.nom?.trim()) {
    return Response.json({ error: "Le nom ne peut pas être vide" }, { status: 400 });
  }
  try {
    const dossier = await renameClientFileServer(id, fileId, body.nom, body.categorie);
    if (!dossier) return Response.json({ error: "Pièce introuvable" }, { status: 404 });
    return Response.json({ dossier });
  } catch {
    return Response.json({ error: "Renommage impossible" }, { status: 500 });
  }
}
