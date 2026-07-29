import { checkHistoryPassword } from "@/lib/historyAuth";
import { listDocumentsServer, saveDocumentServer, type DocHistoryFull } from "@/lib/serverHistory";

export const dynamic = "force-dynamic";

/** Liste des documents générés (protégée par le mot de passe d'équipe). */
export async function GET(request: Request) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  }
  try {
    return Response.json({ entries: await listDocumentsServer() });
  } catch {
    return Response.json({ entries: [] });
  }
}

/** Sauvegarde d'un document généré (appelée par le client après génération). */
export async function POST(request: Request) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  }
  try {
    const entry = (await request.json()) as DocHistoryFull;
    if (!entry?.id || !entry?.docType || !entry?.doc) {
      return Response.json({ error: "Entrée invalide" }, { status: 400 });
    }
    await saveDocumentServer(entry);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Sauvegarde impossible" }, { status: 500 });
  }
}
