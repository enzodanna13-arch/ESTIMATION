import { addDocument, createSinistre, listSinistres, type Sinistre } from "@/lib/serverSinistres";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

// ROUTE TEMPORAIRE d'amorçage. À SUPPRIMER immédiatement après usage.
const JETON = "seed-sinistres-19-20-oct-2026";

export async function POST(request: Request) {
  if (request.headers.get("x-seed") !== JETON) return Response.json({ error: "Interdit" }, { status: 403 });
  let body: { items?: { champs?: Partial<Sinistre>; pdfBase64?: string; pdfNom?: string }[] };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  const items = body.items ?? [];
  const existants = await listSinistres();
  const refs = new Set(existants.map((s) => s.reference));
  const resultats: { reference?: string; coproNom?: string; cree: boolean; doc: boolean }[] = [];
  for (const it of items) {
    const champs = it.champs ?? {};
    if (champs.reference && refs.has(champs.reference)) { resultats.push({ reference: champs.reference, coproNom: champs.coproNom, cree: false, doc: false }); continue; }
    const s = await createSinistre(champs);
    let doc = false;
    if (it.pdfBase64) { try { await addDocument(s.id, { nom: it.pdfNom ?? "Ouverture sinistre.pdf", data: it.pdfBase64 }); doc = true; } catch { /* ignore */ } }
    if (s.reference) refs.add(s.reference);
    resultats.push({ reference: s.reference, coproNom: s.coproNom, cree: true, doc });
  }
  return Response.json({ ok: true, resultats });
}
