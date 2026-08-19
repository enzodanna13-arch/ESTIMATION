import { checkHistoryPassword } from "@/lib/historyAuth";
import { deleteLeadServer, getLeadServer, saveLeadServer, type Lead } from "@/lib/serverLeads";
import { deleteSmsForLead } from "@/lib/serverSms";

export const dynamic = "force-dynamic";

const CHAMPS: (keyof Lead)[] = [
  "source", "campagne", "nom", "prenom", "tel", "email", "ville", "budget",
  "typeProjet", "message", "statut", "negociateur", "notes", "dossierId", "relanceLe", "suivi",
];

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkHistoryPassword(request)) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  let patch: Partial<Lead>;
  try { patch = (await request.json()) as Partial<Lead>; } catch { return Response.json({ error: "Requête invalide" }, { status: 400 }); }
  try {
    const lead = await getLeadServer(id);
    if (!lead) return Response.json({ error: "Lead introuvable" }, { status: 404 });
    const maj = { ...lead } as unknown as Record<string, unknown>;
    for (const c of CHAMPS) if (c in patch && patch[c] !== undefined) maj[c as string] = (patch as Record<string, unknown>)[c as string];
    const saved = await saveLeadServer(maj as unknown as Lead);
    return Response.json({ lead: saved });
  } catch {
    return Response.json({ error: "Enregistrement impossible" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkHistoryPassword(request)) return Response.json({ error: "Accès réservé" }, { status: 401 });
  const { id } = await params;
  try { await deleteLeadServer(id); await deleteSmsForLead(id).catch(() => {}); return Response.json({ ok: true }); }
  catch { return Response.json({ error: "Suppression impossible" }, { status: 500 }); }
}
