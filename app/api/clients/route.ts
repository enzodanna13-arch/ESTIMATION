import { checkHistoryPassword } from "@/lib/historyAuth";
import { listClientsServer, saveClientServer, type ClientDossier } from "@/lib/serverHistory";
import { rapprocherLeadServer } from "@/lib/serverLeads";

export const dynamic = "force-dynamic";

// Dossiers clients partagés : liste et création
export async function GET(request: Request) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  try {
    return Response.json({ dossiers: await listClientsServer() });
  } catch {
    return Response.json({ error: "Stockage partagé indisponible" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  let body: { nom?: string; bien?: string; negociateur?: string; typeClient?: string; prenom?: string; tel?: string; email?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Corps de requête invalide" }, { status: 400 });
  }
  if (!body.nom?.trim()) {
    return Response.json({ error: "Le nom du client est requis" }, { status: 400 });
  }
  const type = body.typeClient === "acquereur" || body.typeClient === "investisseur" ? body.typeClient : "vendeur";
  const dossier: ClientDossier = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    nom: body.nom.trim(),
    bien: (body.bien ?? "").trim(),
    negociateur: (body.negociateur ?? "").trim(),
    pieces: [],
    typeClient: type,
    // Coordonnées conservées pour TOUS les types (contact + rapprochement lead)
    prenom: (body.prenom ?? "").trim(),
    tel: (body.tel ?? "").trim(),
    email: (body.email ?? "").trim(),
    ...(type !== "vendeur"
      ? {
          statut: "Nouveau",
          recherches: [],
          timeline: [{ id: `${Date.now()}`, date: Date.now(), type: "statut", texte: "Dossier créé", auteur: (body.negociateur ?? "").trim() || "—" }],
        }
      : {}),
  };
  try {
    await saveClientServer(dossier);
    // Rapprochement automatique : si un lead correspond à ce nouveau dossier
    // (tél / email / nom), on le relie et on met son statut à jour (vendeur →
    // « Prise de mandat », acquéreur/investisseur → « Converti »).
    try {
      const statutLead = type === "vendeur" ? "Prise de mandat" : "Converti";
      await rapprocherLeadServer({ tel: dossier.tel, email: dossier.email, nom: dossier.nom, prenom: dossier.prenom, dossierId: dossier.id, statut: statutLead });
    } catch { /* le rapprochement ne doit jamais bloquer la création du dossier */ }
    return Response.json({ dossier });
  } catch {
    return Response.json({ error: "Stockage partagé indisponible" }, { status: 500 });
  }
}
