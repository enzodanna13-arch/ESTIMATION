import { garde } from "@/lib/syndic/guard";
import { createArchive, listArchive } from "@/lib/syndic/serverArchive";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const g = await garde(request);
  if ("erreur" in g) return g.erreur;
  try { return Response.json({ documents: await listArchive() }); }
  catch (e) { return Response.json({ error: e instanceof Error ? e.message : "Chargement impossible" }, { status: 500 }); }
}

export async function POST(request: Request) {
  const g = await garde(request);
  if ("erreur" in g) return g.erreur;
  let body: { data?: string; nom?: string; categorie?: string; copropriete?: string; date?: string; resume?: string };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  if (!body.data) return Response.json({ error: "Document manquant" }, { status: 400 });
  try {
    const doc = await createArchive({ nom: body.nom, categorie: body.categorie, copropriete: body.copropriete, date: body.date, resume: body.resume }, body.data);
    return Response.json({ document: doc });
  } catch (e) { return Response.json({ error: e instanceof Error ? e.message : "Archivage impossible" }, { status: 500 }); }
}
