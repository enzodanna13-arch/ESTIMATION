import { checkHistoryPassword } from "@/lib/historyAuth";
import { listLeadsServer, saveLeadServer, type Lead } from "@/lib/serverLeads";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Export CSV des leads pour alimenter systeme.io (campagnes mailing/SMS).
// Filtres : par STATUT (Répondeur, Perdu, Pas intéressé…), avec/ sans email,
// et « nouveaux uniquement » (jamais exportés). Après export, les contacts
// sont marqués (exporteLe) et ne ressortent plus si « nouveaux uniquement ».

const COLONNES = ["Email", "Prénom", "Nom", "Téléphone", "Ville", "Statut", "Source", "Type de projet", "Reçu le"];
const aEmail = (l: Lead) => /.+@.+\..+/.test((l.email ?? "").trim());
const champ = (v: unknown): string => `"${String(v ?? "").replace(/"/g, '""')}"`;

function ligneCsv(l: Lead): string {
  return [
    l.email, l.prenom, l.nom, l.tel, l.ville, l.statut, l.source, l.typeProjet,
    new Date(l.createdAt).toLocaleDateString("fr-FR"),
  ].map(champ).join(",");
}

interface Options {
  statuts?: string[]; // vide/absent = tous les statuts
  avecEmail?: boolean; // défaut true (mailing)
  nouveauxUniquement?: boolean; // défaut true (anti-doublon)
  reset?: boolean;
}

function selectionner(leads: Lead[], o: Options): Lead[] {
  const statuts = (o.statuts ?? []).filter(Boolean);
  return leads.filter((l) => {
    if (statuts.length > 0 && !statuts.includes(l.statut)) return false;
    if (o.avecEmail !== false && !aEmail(l)) return false;
    if (o.nouveauxUniquement !== false && l.exporteLe) return false;
    return true;
  });
}

// Aperçu : nombre de contacts par statut (avec email) restant à exporter.
export async function GET(request: Request) {
  if (!checkHistoryPassword(request)) return Response.json({ error: "Accès réservé" }, { status: 401 });
  try {
    const leads = await listLeadsServer();
    const parStatut: Record<string, number> = {};
    for (const l of leads) if (aEmail(l) && !l.exporteLe) parStatut[l.statut] = (parStatut[l.statut] ?? 0) + 1;
    return Response.json({ parStatut });
  } catch {
    return Response.json({ parStatut: {} });
  }
}

export async function POST(request: Request) {
  if (!checkHistoryPassword(request)) return Response.json({ error: "Accès réservé" }, { status: 401 });
  let o: Options = {};
  try { o = (await request.json()) as Options; } catch { /* corps vide accepté */ }

  const leads = await listLeadsServer();

  if (o.reset === true) {
    let n = 0;
    for (const l of leads) if (l.exporteLe) { await saveLeadServer({ ...l, exporteLe: null }); n++; }
    return Response.json({ reset: n });
  }

  const selection = selectionner(leads, o);
  if (selection.length === 0) return Response.json({ count: 0, csv: "" });

  const csv = "﻿" + [COLONNES.join(","), ...selection.map(ligneCsv)].join("\r\n");

  // Marquage anti-doublon (uniquement en mode « nouveaux uniquement »).
  if (o.nouveauxUniquement !== false) {
    const now = Date.now();
    for (const l of selection) await saveLeadServer({ ...l, exporteLe: now });
  }

  return Response.json({ count: selection.length, csv });
}
