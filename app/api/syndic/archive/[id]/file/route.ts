import { getArchiveFile } from "@/lib/syndic/serverArchive";

export const dynamic = "force-dynamic";

// Lecture PUBLIQUE du fichier (PDF ou image) : ouverture / téléchargement.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const res = await getArchiveFile(id);
    if (!res) return Response.json({ error: "Document introuvable" }, { status: 404 });
    return new Response(res.bytes, { headers: { "content-type": res.contentType, "cache-control": "public, max-age=86400" } });
  } catch { return Response.json({ error: "Chargement impossible" }, { status: 500 }); }
}
