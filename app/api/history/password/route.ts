import { definirMotDePasseEquipe } from "@/lib/historyAuth";

export const dynamic = "force-dynamic";

// Change le mot de passe d'équipe depuis l'écran « Réglages » (le mot de passe
// actuel est exigé dans le corps ; aucune manipulation Vercel nécessaire).
export async function POST(request: Request) {
  let body: { actuel?: string; nouveau?: string };
  try { body = (await request.json()) as typeof body; } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }
  const r = await definirMotDePasseEquipe(body.actuel ?? "", body.nouveau ?? "");
  if ("erreur" in r) return Response.json({ error: r.erreur }, { status: 422 });
  return Response.json({ ok: true });
}
