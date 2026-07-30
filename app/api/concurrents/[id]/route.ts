import { extraireAnnonce } from "@/lib/extraitAnnonce";
import { checkHistoryPassword } from "@/lib/historyAuth";
import { deleteConcurrentServer, getConcurrentServer, saveConcurrentServer } from "@/lib/serverHistory";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Rafraîchir le prix d'une annonce suivie (relit la page) ou corriger ses
// champs à la main ; suppression du suivi.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  const { id } = await params;
  const c = await getConcurrentServer(id);
  if (!c) return Response.json({ error: "Suivi introuvable" }, { status: 404 });

  let body: { action?: string; titre?: string; prix?: number | null; ville?: string; note?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    body = {};
  }

  if (body.action === "refresh") {
    const extrait = await extraireAnnonce(c.url);
    if (extrait?.prix && extrait.prix !== c.prix) {
      c.prix = extrait.prix;
      c.historiquePrix.push({ date: Date.now(), prix: extrait.prix });
    }
    if (extrait?.titre) c.titre = extrait.titre;
    if (extrait?.image) c.image = extrait.image;
  } else {
    // Correction manuelle
    if (typeof body.titre === "string") c.titre = body.titre.trim();
    if (typeof body.ville === "string") c.ville = body.ville.trim();
    if (typeof body.note === "string") c.note = body.note.trim();
    if (typeof body.prix === "number" && body.prix > 0 && body.prix !== c.prix) {
      c.prix = Math.round(body.prix);
      c.historiquePrix.push({ date: Date.now(), prix: c.prix });
    }
  }
  c.updatedAt = Date.now();
  try {
    await saveConcurrentServer(c);
    return Response.json({ concurrent: c });
  } catch {
    return Response.json({ error: "Enregistrement impossible" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await deleteConcurrentServer(id);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Suppression impossible" }, { status: 500 });
  }
}
