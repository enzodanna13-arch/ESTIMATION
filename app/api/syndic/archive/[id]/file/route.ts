import { getArchiveFile } from "@/lib/syndic/serverArchive";

export const dynamic = "force-dynamic";

// Lecture PUBLIQUE du PDF (ouverture / téléchargement).
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const octets = await getArchiveFile(id);
    if (!octets) return Response.json({ error: "Document introuvable" }, { status: 404 });
    return new Response(octets, { headers: { "content-type": "application/pdf", "cache-control": "public, max-age=86400" } });
  } catch { return Response.json({ error: "Chargement impossible" }, { status: 500 }); }
}
