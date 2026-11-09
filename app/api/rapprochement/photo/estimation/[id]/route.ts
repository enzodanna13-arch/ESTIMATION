import { getEstimationServer } from "@/lib/serverHistory";

export const dynamic = "force-dynamic";

// Sert la 1re photo d'une estimation (pour la vignette de rapprochement).
// Lecture publique (comme les autres photos de biens).
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const full = await getEstimationServer(id);
    const photo = full?.input?.photos?.[0];
    if (!photo?.data) return Response.json({ error: "Aucune photo" }, { status: 404 });
    const octets = Buffer.from(photo.data, "base64");
    return new Response(octets, { headers: { "content-type": photo.mediaType || "image/jpeg", "cache-control": "public, max-age=86400" } });
  } catch {
    return Response.json({ error: "Chargement impossible" }, { status: 500 });
  }
}
