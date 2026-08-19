import { checkHistoryPassword } from "@/lib/historyAuth";
import {
  addClientFileServer,
  addClientFilePreuploadedServer,
  CATEGORIES_PIECES,
} from "@/lib/serverHistory";

export const dynamic = "force-dynamic";

// Ajout d'une pièce au dossier client. Deux modes :
//   • `data` (base64) : petit fichier envoyé dans le corps de la requête
//     (limite serverless ~4,5 Mo) ;
//   • `fileId` : pièce lourde DÉJÀ téléversée directement sur le Blob
//     (upload navigateur → Blob) ; on n'enregistre ici que la fiche.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  const { id } = await params;
  let body: { nom?: string; categorie?: string; data?: string; fileId?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Corps de requête invalide" }, { status: 400 });
  }
  if (!body.nom?.trim() || (!body.data && !body.fileId)) {
    return Response.json({ error: "Pièce incomplète (nom et contenu requis)" }, { status: 400 });
  }
  const categorie = (CATEGORIES_PIECES as readonly string[]).includes(body.categorie ?? "")
    ? (body.categorie as string)
    : "Autre";
  const nom = body.nom.trim().slice(0, 200);
  try {
    const dossier = body.fileId
      ? await addClientFilePreuploadedServer(id, { fileId: body.fileId, nom, categorie })
      : await addClientFileServer(id, { nom, categorie, data: body.data! });
    if (!dossier) {
      // fileId fourni mais aucun blob à ce chemin → upload direct incomplet.
      const msg = body.fileId ? "Fichier téléversé introuvable — réessaie l'envoi" : "Dossier introuvable";
      return Response.json({ error: msg }, { status: 404 });
    }
    return Response.json({ dossier });
  } catch {
    return Response.json({ error: "Enregistrement de la pièce impossible" }, { status: 500 });
  }
}
