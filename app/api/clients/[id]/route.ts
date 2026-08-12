import { checkHistoryPassword } from "@/lib/historyAuth";
import { deleteClientServer, getClientServer, saveClientServer, type ClientDossier } from "@/lib/serverHistory";

export const dynamic = "force-dynamic";

// Champs du dossier modifiables via PUT (les pièces passent par /files)
const CHAMPS_MODIFIABLES: (keyof ClientDossier)[] = [
  "nom", "bien", "negociateur", "typeClient", "prenom", "tel", "email",
  "adresseActuelle", "statut", "derniereInteraction", "notes", "recherches",
  "financement", "investissement", "timeline",
];

// Mise à jour d'un dossier client (fiche acquéreur / investisseur)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  const { id } = await params;
  let patch: Partial<ClientDossier>;
  try {
    patch = (await request.json()) as Partial<ClientDossier>;
  } catch {
    return Response.json({ error: "Corps de requête invalide" }, { status: 400 });
  }
  try {
    const existant = await getClientServer(id);
    if (!existant) return Response.json({ error: "Dossier introuvable" }, { status: 404 });
    const maj = { ...existant } as unknown as Record<string, unknown>;
    for (const cle of CHAMPS_MODIFIABLES) {
      if (cle in patch && patch[cle] !== undefined) {
        maj[cle as string] = (patch as Record<string, unknown>)[cle as string];
      }
    }
    (maj as unknown as ClientDossier).updatedAt = Date.now();
    await saveClientServer(maj as unknown as ClientDossier);
    return Response.json({ dossier: maj });
  } catch {
    return Response.json({ error: "Enregistrement impossible" }, { status: 500 });
  }
}

// Un dossier client : détail et suppression (dossier + toutes ses pièces)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const dossier = await getClientServer(id);
    if (!dossier) return Response.json({ error: "Dossier introuvable" }, { status: 404 });
    return Response.json({ dossier });
  } catch {
    return Response.json({ error: "Stockage partagé indisponible" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await deleteClientServer(id);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Suppression impossible" }, { status: 500 });
  }
}
