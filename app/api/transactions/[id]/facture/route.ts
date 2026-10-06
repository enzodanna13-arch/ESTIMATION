import { verifierAccesEquipe } from "@/lib/historyAuth";
import { getDocumentServer } from "@/lib/serverHistory";
import { addTransactionPdfServer, getTransactionServer } from "@/lib/serverTransactions";
import { genererFactureAgencePdf, nomFichierFacture, type DonneesFactureAgence } from "@/lib/factureAgencePdf";

export const dynamic = "force-dynamic";

// Génère la facture d'agence (PDF) et l'attache à la transaction.
// Corps : { docId } pour reprendre une facture déjà générée (historique des
// documents), ou { data } pour générer à partir de valeurs fournies.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  let body: { docId?: string; data?: DonneesFactureAgence };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }

  const t = await getTransactionServer(id);
  if (!t) return Response.json({ error: "Transaction introuvable" }, { status: 404 });

  let data: DonneesFactureAgence | null = body.data ?? null;
  if (!data && body.docId) {
    const doc = await getDocumentServer(body.docId);
    if (!doc || doc.docType !== "facture") return Response.json({ error: "Facture générée introuvable" }, { status: 404 });
    const inp = doc.input;
    data = {
      numero: inp.factureNumero, clientNom: inp.factureClientNom, clientAdresse: inp.factureClientAdresse,
      bien: inp.factureBien, notaire: inp.factureNotaire, ref: inp.factureRef,
      commissionTTC: typeof inp.commissionTTC === "number" ? inp.commissionTTC : 0,
      date: doc.createdAt,
    };
  }
  // Repli : générer depuis les données de la transaction elle-même.
  if (!data) {
    data = { clientNom: t.vendeur, bien: t.bien, commissionTTC: t.honoraires, date: t.dateVente || Date.now() };
  }

  try {
    const bytes = await genererFactureAgencePdf(data);
    const maj = await addTransactionPdfServer(id, nomFichierFacture(data.numero, data.clientNom), "Facture agence", bytes);
    if (!maj) return Response.json({ error: "Transaction introuvable" }, { status: 404 });
    return Response.json({ transaction: maj });
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : "Génération de la facture impossible" }, { status: 500 });
  }
}
