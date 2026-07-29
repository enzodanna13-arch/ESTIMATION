import { generateDocument } from "@/lib/documents";
import { checkHistoryPassword } from "@/lib/historyAuth";
import type { DocumentInput } from "@/lib/docTypes";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

/**
 * Génération de documents d'agence (annonce, compte rendu de visite,
 * courrier de prospection). Réponse en streaming NDJSON, comme
 * l'estimation (statuts de progression + résultat).
 */
export async function POST(request: Request) {
  // Accès réservé à l'équipe : même mot de passe que l'ensemble de l'outil
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  let body: DocumentInput & { crPdfs?: { nom: string; data: string }[] };
  try {
    body = (await request.json()) as DocumentInput & { crPdfs?: { nom: string; data: string }[] };
  } catch {
    return Response.json({ error: "Corps de requête invalide" }, { status: 400 });
  }
  if (!body.docType || !["annonce", "crv", "prospection", "bilan"].includes(body.docType)) {
    return Response.json({ error: "Type de document inconnu" }, { status: 400 });
  }
  // Comptes rendus de visite téléversés en PDF (bilan) : transmis à l'IA
  // pour analyse, jamais stockés côté serveur
  const crPdfs = (body.crPdfs ?? []).slice(0, 10);
  delete body.crPdfs;
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "La génération de documents nécessite le moteur IA (clé non configurée)" },
      { status: 400 },
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      const heartbeat = setInterval(() => send({ type: "ping" }), 8000);
      try {
        const doc = await generateDocument(body, (label: string) => send({ type: "status", label }), crPdfs);
        send({ type: "result", data: { doc } });
      } catch (err) {
        send({ type: "error", error: err instanceof Error ? err.message : "Erreur inattendue" });
      } finally {
        clearInterval(heartbeat);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-cache, no-transform",
    },
  });
}
