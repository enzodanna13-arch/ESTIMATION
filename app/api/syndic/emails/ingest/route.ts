import { garde } from "@/lib/syndic/guard";
import { ingererEmail, type EmailEntrant } from "@/lib/syndic/emailIngest";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Transforme un email en ticket (Phase 1 : le gestionnaire colle un mail ;
// Phase 2 : la passerelle Outlook postera ici). Réservé aux comptes syndic.
export async function POST(request: Request) {
  const g = await garde(request, "creer_ticket");
  if ("erreur" in g) return g.erreur;
  let b: Partial<EmailEntrant>;
  try { b = (await request.json()) as Partial<EmailEntrant>; } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }
  const email: EmailEntrant = {
    from: (b.from ?? "").trim(),
    fromName: (b.fromName ?? "").trim(),
    subject: (b.subject ?? "").trim(),
    body: (b.body ?? "").trim(),
  };
  if (!email.subject && !email.body) {
    return Response.json({ error: "Collez au moins le sujet ou le corps du mail" }, { status: 400 });
  }
  try {
    const resultat = await ingererEmail(email, g.user.id);
    return Response.json({ resultat });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Analyse impossible" }, { status: 422 });
  }
}
