import { verifierAccesEquipe } from "@/lib/historyAuth";
import { deleteTransactionServer, getTransactionServer, saveTransactionServer, type Transaction } from "@/lib/serverTransactions";

export const dynamic = "force-dynamic";

const txt = (v: unknown, def: string) => (typeof v === "string" ? v.trim().slice(0, 300) : def);
const num = (v: unknown, def: number) => { const n = Number(v); return Number.isFinite(n) && n >= 0 ? n : def; };

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  const t = await getTransactionServer(id);
  if (!t) return Response.json({ error: "Transaction introuvable" }, { status: 404 });
  return Response.json({ transaction: t });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  let patch: Partial<Transaction>;
  try { patch = (await request.json()) as Partial<Transaction>; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  const t = await getTransactionServer(id);
  if (!t) return Response.json({ error: "Transaction introuvable" }, { status: 404 });
  const maj: Transaction = {
    ...t,
    bien: txt(patch.bien, t.bien), adresse: txt(patch.adresse, t.adresse), ville: txt(patch.ville, t.ville),
    prixVente: num(patch.prixVente, t.prixVente), honoraires: num(patch.honoraires, t.honoraires),
    dateVente: Number.isFinite(Number(patch.dateVente)) ? Number(patch.dateVente) : t.dateVente,
    vendeur: txt(patch.vendeur, t.vendeur), acquereur: txt(patch.acquereur, t.acquereur), negociateur: txt(patch.negociateur, t.negociateur),
    notes: typeof patch.notes === "string" ? patch.notes.slice(0, 2000) : t.notes,
    updatedAt: Date.now(),
  };
  try { await saveTransactionServer(maj); return Response.json({ transaction: maj }); }
  catch { return Response.json({ error: "Enregistrement impossible" }, { status: 500 }); }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  try { await deleteTransactionServer(id); return Response.json({ ok: true }); }
  catch { return Response.json({ error: "Suppression impossible" }, { status: 500 }); }
}
