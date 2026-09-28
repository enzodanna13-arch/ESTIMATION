import { verifierAccesEquipe } from "@/lib/historyAuth";
import { analyserVeilleDpe } from "@/lib/veilleDpe";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Veille AUTOMATIQUE (Vercel Cron) : recroise chaque jour les estimations avec
// l'ADEME pour détecter les nouveaux DPE (signaux de mise en vente).
function autoriseCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") === `Bearer ${secret}`) return true;
  const ua = request.headers.get("user-agent") ?? "";
  return /vercel-cron/i.test(ua);
}

export async function GET(request: Request) {
  if (!autoriseCron(request) && !(await verifierAccesEquipe(request))) {
    return Response.json({ error: "Accès réservé" }, { status: 401 });
  }
  try {
    const res = await analyserVeilleDpe();
    return Response.json({ ok: true, ...res });
  } catch (err) {
    console.error("Cron veille DPE en échec :", err);
    return Response.json({ ok: false, error: "Traitement impossible" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
