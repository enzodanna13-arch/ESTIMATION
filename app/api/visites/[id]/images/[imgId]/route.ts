import { checkHistoryPassword } from "@/lib/historyAuth";
import { deleteVisiteImageServer, getVisiteImageServer } from "@/lib/serverHistory";

export const dynamic = "force-dynamic";

// Une prise de vue 360° : lecture PUBLIQUE (le viewer du lien client charge
// les images), suppression protégée.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; imgId: string }> },
) {
  const { id, imgId } = await params;
  try {
    const octets = await getVisiteImageServer(id, imgId);
    if (!octets) return Response.json({ error: "Prise de vue introuvable" }, { status: 404 });
    return new Response(octets, {
      headers: {
        "content-type": "image/jpeg",
        // Les images d'une visite sont immuables : cache long côté client
        "cache-control": "public, max-age=86400",
      },
    });
  } catch {
    return Response.json({ error: "Chargement impossible" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; imgId: string }> },
) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  const { id, imgId } = await params;
  try {
    const visite = await deleteVisiteImageServer(id, imgId);
    if (!visite) return Response.json({ error: "Visite introuvable" }, { status: 404 });
    return Response.json({ visite });
  } catch {
    return Response.json({ error: "Suppression impossible" }, { status: 500 });
  }
}
