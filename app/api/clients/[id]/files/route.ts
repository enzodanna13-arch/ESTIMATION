import { checkHistoryPassword } from "@/lib/historyAuth";
import { addClientFileServer, CATEGORIES_PIECES } from "@/lib/serverHistory";

export const dynamic = "force-dynamic";

// Ajout d'une pièce PDF au dossier client (une pièce par requête —
// limite de corps serverless ~4,5 Mo)
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  const { id } = await params;
  let body: { nom?: string; categorie?: string; data?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Corps de requête invalide" }, { status: 400 });
  }
  if (!body.nom?.trim() || !body.data) {
    return Response.json({ error: "Pièce incomplète (nom et contenu requis)" }, { status: 400 });
  }
  const categorie = (CATEGORIES_PIECES as readonly string[]).includes(body.categorie ?? "")
    ? (body.categorie as string)
    : "Autre";
  try {
    const dossier = await addClientFileServer(id, {
      nom: body.nom.trim().slice(0, 200),
      categorie,
      data: body.data,
    });
    if (!dossier) return Response.json({ error: "Dossier introuvable" }, { status: 404 });
    return Response.json({ dossier });
  } catch {
    return Response.json({ error: "Enregistrement de la pièce impossible" }, { status: 500 });
  }
}
