import { verifierAccesEquipe } from "@/lib/historyAuth";
import { addTransactionPiecesServer, CATEGORIES_TRANSACTION } from "@/lib/serverTransactions";

export const dynamic = "force-dynamic";

function categorieValide(c: unknown): string {
  return (CATEGORIES_TRANSACTION as readonly string[]).includes(typeof c === "string" ? c : "") ? (c as string) : "Autre";
}

// Enregistre une pièce déjà téléversée sur le Blob (upload direct navigateur).
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  let body: { fileId?: string; nom?: string; categorie?: string };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  if (!body.fileId || !body.nom?.trim()) return Response.json({ error: "Pièce incomplète" }, { status: 400 });
  try {
    const t = await addTransactionPiecesServer(id, [{ fileId: body.fileId, nom: body.nom.trim().slice(0, 200), categorie: categorieValide(body.categorie) }]);
    if (!t) return Response.json({ error: "Transaction introuvable" }, { status: 404 });
    return Response.json({ transaction: t });
  } catch {
    return Response.json({ error: "Enregistrement impossible" }, { status: 500 });
  }
}
