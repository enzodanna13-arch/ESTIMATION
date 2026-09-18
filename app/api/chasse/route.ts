import { verifierAccesEquipe } from "@/lib/historyAuth";
import { ficheVide, listChasseServer, saveChasseServer, type FicheChasse } from "@/lib/serverChasse";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) {
    return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  }
  try {
    const fiches = await listChasseServer();
    return Response.json({ fiches });
  } catch (err) {
    console.error("Lecture de la chasse impossible :", err);
    return Response.json({ fiches: [] });
  }
}

export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) {
    return Response.json({ error: "Mot de passe requis" }, { status: 401 });
  }
  let fiche: FicheChasse;
  try {
    const body = (await request.json()) as { fiche?: Partial<FicheChasse> };
    if (!body.fiche) throw new Error("fiche manquante");
    fiche = ficheVide(body.fiche);
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }
  try {
    const enregistree = await saveChasseServer(fiche);
    return Response.json({ fiche: enregistree });
  } catch (err) {
    console.error("Enregistrement de la chasse impossible :", err);
    return Response.json({ error: "Enregistrement impossible — réessayez" }, { status: 500 });
  }
}
