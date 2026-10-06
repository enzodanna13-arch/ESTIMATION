import { verifierAccesEquipe } from "@/lib/historyAuth";
import {
  deleteTransactionFileServer,
  getTransactionServer,
  renameTransactionFileServer,
  resoudreUrlPieceTransaction,
} from "@/lib/serverTransactions";

export const dynamic = "force-dynamic";

// Téléchargement d'une pièce de transaction (URL de stockage jamais exposée).
export async function GET(request: Request, { params }: { params: Promise<{ id: string; fileId: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id, fileId } = await params;
  const t = await getTransactionServer(id).catch(() => null);
  const piece = t?.pieces.find((p) => p.fileId === fileId);
  const cible = await resoudreUrlPieceTransaction(id, fileId, piece?.url);
  if (!cible) return Response.json({ error: "Pièce introuvable dans le stockage" }, { status: 404 });

  const nom = piece?.nom ?? "piece.pdf";
  const nomAscii = nom.replace(/["\\\r\n]/g, "").replace(/[^\x20-\x7E]/g, "-");
  const nomUtf8 = encodeURIComponent(nom.replace(/["\\\r\n]/g, ""));
  try {
    const res = await fetch(cible, { cache: "no-store" });
    if (!res.ok) return Response.json({ error: `Le stockage a refusé le fichier (HTTP ${res.status})` }, { status: 502 });
    return new Response(await res.arrayBuffer(), {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${nomAscii}"; filename*=UTF-8''${nomUtf8}`,
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    return Response.json({ error: `Récupération impossible (${err instanceof Error ? err.message : "erreur"})` }, { status: 502 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string; fileId: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id, fileId } = await params;
  try {
    const t = await deleteTransactionFileServer(id, fileId);
    if (!t) return Response.json({ error: "Transaction introuvable" }, { status: 404 });
    return Response.json({ transaction: t });
  } catch { return Response.json({ error: "Suppression impossible" }, { status: 500 }); }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; fileId: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id, fileId } = await params;
  let body: { nom?: string; categorie?: string };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  if (!body.nom?.trim()) return Response.json({ error: "Nom vide" }, { status: 400 });
  try {
    const t = await renameTransactionFileServer(id, fileId, body.nom, body.categorie);
    if (!t) return Response.json({ error: "Pièce introuvable" }, { status: 404 });
    return Response.json({ transaction: t });
  } catch { return Response.json({ error: "Renommage impossible" }, { status: 500 }); }
}
