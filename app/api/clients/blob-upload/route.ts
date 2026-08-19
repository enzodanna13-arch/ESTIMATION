import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { checkHistoryKeyValue } from "@/lib/historyAuth";

export const dynamic = "force-dynamic";

// Génère un jeton d'upload DIRECT navigateur → Vercel Blob pour les pièces
// lourdes des dossiers clients (diagnostics, DPE… > 4,5 Mo) qui ne peuvent
// pas transiter par le corps d'une fonction serverless. Le fichier ne passe
// jamais par ce serveur : il est envoyé directement au Blob avec un jeton à
// usage unique, restreint à un seul chemin `clients/files/…`.
//
// Sécurité : le mot de passe d'équipe est transmis via `clientPayload`
// (l'en-tête x-history-key n'est pas relayé par la lib) et vérifié en temps
// constant. Le jeton n'autorise QUE le préfixe des pièces clients et un
// PDF/image de taille bornée.
export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!checkHistoryKeyValue(clientPayload ?? "")) {
          throw new Error("Accès réservé");
        }
        if (!pathname.startsWith("clients/files/") || !pathname.endsWith(".pdf")) {
          throw new Error("Chemin non autorisé");
        }
        return {
          allowedContentTypes: ["application/pdf"],
          addRandomSuffix: false,
          maximumSizeInBytes: 25_000_000,
        };
      },
      // Pas de onUploadCompleted : la fiche est enregistrée par un appel
      // explicite du client après l'upload (le webhook Blob n'atteint pas les
      // environnements sans URL publique stable).
    });
    return Response.json(json);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload refusé";
    return Response.json({ error: message }, { status: 400 });
  }
}
