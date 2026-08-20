import { checkHistoryPassword } from "@/lib/historyAuth";
import { getClientEstimationPhoto, getClientEstimationServer } from "@/lib/clientEstimations";

export const dynamic = "force-dynamic";

// Sert une photo d'une estimation client au back-office (protégé). Les photos
// sont stockées sous le token du dossier ; on le récupère via l'enregistrement.
export async function GET(request: Request, { params }: { params: Promise<{ id: string; idx: string }> }) {
  if (!checkHistoryPassword(request)) return new Response("Accès réservé", { status: 401 });
  const { id, idx } = await params;
  const n = Number(idx);
  if (!Number.isInteger(n) || n < 0) return new Response("Introuvable", { status: 404 });

  const rec = await getClientEstimationServer(id);
  if (!rec) return new Response("Introuvable", { status: 404 });
  const buf = await getClientEstimationPhoto(rec.token, n);
  if (!buf) return new Response("Introuvable", { status: 404 });

  const meta = rec.photos.find((p) => p.idx === n);
  return new Response(buf, { headers: { "content-type": meta?.mediaType || "image/jpeg", "cache-control": "private, max-age=3600" } });
}
