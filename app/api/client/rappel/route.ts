import { getClientEstimationServer, getIdByToken, updateClientEstimationServer } from "@/lib/clientEstimations";

export const dynamic = "force-dynamic";

// CTA « Être rappelé » depuis le dossier client. Marque l'estimation « À appeler »
// et ajoute une note commerciale — remonte dans le back-office. Public (par
// token), aucune donnée sensible renvoyée.
export async function POST(request: Request) {
  let token = "";
  try { token = String(((await request.json()) as { token?: string }).token ?? ""); }
  catch { return Response.json({ error: "Requête invalide." }, { status: 400 }); }

  const id = await getIdByToken(token);
  if (!id) return Response.json({ error: "Dossier introuvable." }, { status: 404 });

  const rec = await getClientEstimationServer(id);
  if (!rec) return Response.json({ error: "Dossier introuvable." }, { status: 404 });

  const notes = [
    ...rec.notes,
    { id: `${Date.now()}`, date: Date.now(), auteur: "Client", texte: "Rappel demandé depuis le dossier en ligne." },
  ];
  const statut = rec.statut === "Mandat obtenu" || rec.statut === "RDV fixé" ? rec.statut : "À appeler";
  await updateClientEstimationServer(id, { notes, statut });
  return Response.json({ ok: true });
}
