import { createSinistre, listSinistres, updateSinistre, addDocument, type Sinistre } from "@/lib/serverSinistres";
export const dynamic = "force-dynamic";
export const maxDuration = 120;
const JETON = "seed-sinistres-19-20-oct-2026";
export async function POST(request: Request) {
  if (request.headers.get("x-seed") !== JETON) return Response.json({ error: "Interdit" }, { status: 403 });
  let body: { items?: { champs?: Partial<Sinistre>; pdfBase64?: string; pdfNom?: string }[] };
  try { body = (await request.json()) as typeof body; } catch { return Response.json({ error: "Corps invalide" }, { status: 400 }); }
  const items = body.items ?? [];
  const existants = await listSinistres();
  const parRef = new Map(existants.map((s) => [s.reference, s]));
  const resultats: { reference?: string; action: string; doc: boolean }[] = [];
  for (const it of items) {
    const champs = it.champs ?? {};
    const exist = champs.reference ? parRef.get(champs.reference) : undefined;
    let id: string, action: string;
    if (exist) { await updateSinistre(exist.id, champs); id = exist.id; action = "maj"; }
    else { const s = await createSinistre(champs); id = s.id; action = "créé"; }
    let doc = false;
    if (it.pdfBase64) { try { await addDocument(id, { nom: it.pdfNom ?? "Déclaration.pdf", data: it.pdfBase64 }); doc = true; } catch { /* ignore */ } }
    resultats.push({ reference: champs.reference, action, doc });
  }
  return Response.json({ ok: true, resultats });
}
