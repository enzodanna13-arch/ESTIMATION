import { verifierAccesEquipe } from "@/lib/historyAuth";
import { listTransactionsServer, saveTransactionServer, type Transaction } from "@/lib/serverTransactions";

export const dynamic = "force-dynamic";

const txt = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, 300) : "");
const num = (v: unknown) => { const n = Number(v); return Number.isFinite(n) && n >= 0 ? n : 0; };

export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  try {
    return Response.json({ transactions: await listTransactionsServer() });
  } catch {
    return Response.json({ transactions: [] });
  }
}

export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  let body: Partial<Transaction>;
  try { body = (await request.json()) as Partial<Transaction>; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  const now = Date.now();
  const t: Transaction = {
    id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now, updatedAt: now,
    bien: txt(body.bien), adresse: txt(body.adresse), ville: txt(body.ville),
    prixVente: num(body.prixVente), honoraires: num(body.honoraires),
    dateVente: Number.isFinite(Number(body.dateVente)) ? Number(body.dateVente) : 0,
    vendeur: txt(body.vendeur), acquereur: txt(body.acquereur), negociateur: txt(body.negociateur),
    notes: typeof body.notes === "string" ? body.notes.slice(0, 2000) : "",
    pieces: [],
  };
  try { await saveTransactionServer(t); return Response.json({ transaction: t }); }
  catch { return Response.json({ error: "Création impossible" }, { status: 500 }); }
}
