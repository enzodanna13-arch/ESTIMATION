import { checkHistoryPassword } from "@/lib/historyAuth";
import { listLeadsServer, saveLeadServer, type Lead } from "@/lib/serverLeads";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Export CSV des leads pour alimenter systeme.io (campagnes mailing).
// RÈGLE : seuls les contacts JAMAIS exportés ressortent — après export, ils
// sont marqués (exporteLe) et n'apparaîtront plus dans les extractions
// suivantes. Colonnes compatibles import systeme.io (Email en tête).

const COLONNES = ["Email", "Prénom", "Nom", "Téléphone", "Ville", "Source", "Type de projet", "Reçu le"];

// Un lead est exportable pour un mailing s'il a un email plausible.
function exportable(l: Lead): boolean {
  return /.+@.+\..+/.test((l.email ?? "").trim()) && !l.exporteLe;
}

const champ = (v: unknown): string => `"${String(v ?? "").replace(/"/g, '""')}"`;

function ligneCsv(l: Lead): string {
  return [
    l.email, l.prenom, l.nom, l.tel, l.ville, l.source, l.typeProjet,
    new Date(l.createdAt).toLocaleDateString("fr-FR"),
  ].map(champ).join(",");
}

// Aperçu : combien de nouveaux contacts sont disponibles à l'export.
export async function GET(request: Request) {
  if (!checkHistoryPassword(request)) return Response.json({ error: "Accès réservé" }, { status: 401 });
  try {
    const leads = await listLeadsServer();
    return Response.json({ disponibles: leads.filter(exportable).length });
  } catch {
    return Response.json({ disponibles: 0 });
  }
}

// Génère le CSV des nouveaux contacts ET les marque comme exportés.
// { reset: true } réinitialise le marquage (pour tout ré-exporter au besoin).
export async function POST(request: Request) {
  if (!checkHistoryPassword(request)) return Response.json({ error: "Accès réservé" }, { status: 401 });
  let body: { reset?: boolean } = {};
  try { body = (await request.json()) as typeof body; } catch { /* corps vide accepté */ }

  const leads = await listLeadsServer();

  if (body.reset === true) {
    let n = 0;
    for (const l of leads) if (l.exporteLe) { await saveLeadServer({ ...l, exporteLe: null }); n++; }
    return Response.json({ reset: n });
  }

  const nouveaux = leads.filter(exportable);
  if (nouveaux.length === 0) return Response.json({ count: 0, csv: "" });

  // BOM UTF-8 + CRLF : accents corrects et compatibilité tableur / systeme.io.
  const csv = "﻿" + [COLONNES.join(","), ...nouveaux.map(ligneCsv)].join("\r\n");

  // Marquage : ces contacts ne ressortiront plus au prochain export.
  const now = Date.now();
  for (const l of nouveaux) await saveLeadServer({ ...l, exporteLe: now });

  return Response.json({ count: nouveaux.length, csv });
}
