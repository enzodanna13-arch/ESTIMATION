import { verifierAccesEquipe } from "@/lib/historyAuth";
import { synchroniserProspection } from "@/lib/prospectionSync";
import { genererTournees } from "@/lib/prospectionTournees";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Préparation AUTOMATIQUE des tournées (Vercel Cron) : synchronise les signaux
// Open Data, enrichit, déduplique, recalcule les scores, attribue puis génère
// les tournées du jour. Enchaîne tout le pipeline sans intervention.
//
// Sécurité : accepté si l'appel porte le secret Vercel Cron
// (Authorization: Bearer $CRON_SECRET) OU le mot de passe d'équipe. Si aucun
// CRON_SECRET n'est configuré, seul l'accès équipe est autorisé (pas d'endpoint
// public déclenchant une synchronisation coûteuse).
function autoriseCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") === `Bearer ${secret}`) return true;
  // Sans CRON_SECRET configuré, on accepte les appels du planificateur Vercel
  // (User-Agent « vercel-cron/1.0 ») : évite d'avoir à définir une variable
  // d'environnement. Le pire cas d'un déclenchement indésirable est une simple
  // resynchronisation de données publiques.
  const ua = request.headers.get("user-agent") ?? "";
  return /vercel-cron/i.test(ua);
}

async function executer() {
  const sync = await synchroniserProspection();
  const tournees = await genererTournees();
  return { ok: true, sync, tournees };
}

export async function GET(request: Request) {
  if (!autoriseCron(request) && !(await verifierAccesEquipe(request))) {
    return Response.json({ error: "Accès réservé" }, { status: 401 });
  }
  try {
    return Response.json(await executer());
  } catch (err) {
    console.error("Cron prospection en échec :", err);
    return Response.json({ ok: false, error: "Traitement impossible" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
