import { createSinistre, listSinistres, updateSinistre, type Sinistre } from "@/lib/serverSinistres";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

// ROUTE TEMPORAIRE d'amorçage / mise à jour. À SUPPRIMER après usage.
const JETON = "seed-sinistres-19-20-oct-2026";

export async function POST(request: Request) {
  if (request.headers.get("x-seed") !== JETON) return Response.json({ error: "Interdit" }, { status: 403 });
  let body: { items?: { champs?: Partial<Sinistre> }[] };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  const items = body.items ?? [];
  const existants = await listSinistres();
  const parRef = new Map(existants.map((s) => [s.reference, s]));
  const resultats: { reference?: string; action: string }[] = [];
  for (const it of items) {
    const champs = it.champs ?? {};
    const exist = champs.reference ? parRef.get(champs.reference) : undefined;
    if (exist) { await updateSinistre(exist.id, champs); resultats.push({ reference: champs.reference, action: "maj" }); }
    else { const s = await createSinistre(champs); resultats.push({ reference: s.reference, action: "créé" }); }
  }
  return Response.json({ ok: true, resultats });
}
