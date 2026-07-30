import { extraireAnnonce } from "@/lib/extraitAnnonce";
import { checkHistoryPassword } from "@/lib/historyAuth";
import { listConcurrentsServer, saveConcurrentServer, type ConcurrentListing } from "@/lib/serverHistory";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Veille concurrente : liste et ajout d'une annonce par URL (extraction des
// métadonnées publiques de la page ciblée).
export async function GET(request: Request) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  try {
    return Response.json({ concurrents: await listConcurrentsServer() });
  } catch {
    return Response.json({ error: "Stockage indisponible" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  let body: { url?: string; ville?: string; negociateur?: string; note?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Corps de requête invalide" }, { status: 400 });
  }
  const url = (body.url ?? "").trim();
  if (!/^https?:\/\//i.test(url)) {
    return Response.json({ error: "Renseignez une URL d'annonce valide (https://…)" }, { status: 400 });
  }
  const extrait = await extraireAnnonce(url);
  if (!extrait) {
    return Response.json(
      { error: "Impossible de lire cette page (site protégé ou lien invalide). Vous pourrez saisir les infos à la main." },
      { status: 422 },
    );
  }
  const c: ConcurrentListing = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    url,
    titre: extrait.titre,
    prix: extrait.prix,
    image: extrait.image,
    ville: (body.ville ?? extrait.ville ?? "").trim(),
    source: extrait.source,
    negociateur: (body.negociateur ?? "").trim(),
    note: (body.note ?? "").trim(),
    historiquePrix: extrait.prix ? [{ date: Date.now(), prix: extrait.prix }] : [],
  };
  try {
    await saveConcurrentServer(c);
    return Response.json({ concurrent: c });
  } catch {
    return Response.json({ error: "Enregistrement impossible" }, { status: 500 });
  }
}
