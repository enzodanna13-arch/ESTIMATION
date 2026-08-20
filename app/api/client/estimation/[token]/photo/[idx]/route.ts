import { getClientEstimationPhoto, getDossierPublic } from "@/lib/clientEstimations";

export const dynamic = "force-dynamic";

// Sert une photo du dossier client par TOKEN + index. On vérifie d'abord que le
// dossier existe (token valide) et que l'index fait partie de ses photos, puis
// on renvoie le binaire. Les photos sont stockées sous le token, jamais sous
// l'id interne — rien de devinable n'est exposé.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string; idx: string }> },
) {
  const { token, idx } = await params;
  const n = Number(idx);
  if (!Number.isInteger(n) || n < 0) return new Response("Introuvable", { status: 404 });

  const dossier = await getDossierPublic(token);
  if (!dossier || !dossier.photos.some((p) => p.idx === n)) {
    return new Response("Introuvable", { status: 404 });
  }
  const buf = await getClientEstimationPhoto(token, n);
  if (!buf) return new Response("Introuvable", { status: 404 });

  const meta = dossier.photos.find((p) => p.idx === n);
  return new Response(buf, {
    headers: {
      "content-type": meta?.mediaType || "image/jpeg",
      "cache-control": "private, max-age=3600",
    },
  });
}
