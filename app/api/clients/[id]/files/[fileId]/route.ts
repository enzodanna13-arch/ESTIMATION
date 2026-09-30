import { verifierAccesEquipe } from "@/lib/historyAuth";
import {
  deleteClientFileServer,
  getClientFileServer,
  getClientServer,
  listerCheminsFichiersClient,
  renameClientFileServer,
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
  try {
    // On récupère d'abord la fiche pour connaître l'URL mémorisée du blob
    // (lecture en cohérence forte, fiable juste après création).
    const dossier = await getClientServer(id);
    const piece = dossier?.pieces.find((p) => p.fileId === fileId);
    const octets = await getClientFileServer(id, fileId, piece?.url);
    if (!octets) {
      // Diagnostic détaillé pour comprendre l'échec (remonté à l'écran).
      const chemins = await listerCheminsFichiersClient(id);
      const noms = chemins.map((c) => c.split("/").pop()).join(", ");
      const diag = `fileId=${fileId} · url mémorisée=${piece?.url ? "oui" : "non"} · ${chemins.length} blob(s) dans le dossier${noms ? ` : ${noms}` : ""}`;
      return Response.json({ error: `Pièce introuvable dans le stockage (${diag})` }, { status: 404 });
    }
    const nom = (piece?.nom ?? "piece.pdf").replace(/["\\\r\n]/g, "");
    return new Response(octets, {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${nom}"`,
        "cache-control": "no-store",
      },
    });
  } catch {
    return Response.json({ error: "Téléchargement impossible" }, { status: 500 });
  }
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
