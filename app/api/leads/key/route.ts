import { verifierAccesEquipe } from "@/lib/historyAuth";
import { definirCleLeads, lireCleLeads } from "@/lib/serverLeadsKey";

export const dynamic = "force-dynamic";

// Clé de la passerelle leads (Zapier), gérée depuis l'écran Réglages du CRM.
// GET : renvoie la clé actuelle (vide si aucune). POST : (re)génère une clé.
// Réservé à l'équipe (mot de passe).

export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  return Response.json({ key: await lireCleLeads() });
}

export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  try {
    return Response.json({ key: await definirCleLeads() });
  } catch (err) {
    console.error("Génération de la clé leads impossible :", err);
    return Response.json({ error: "Génération impossible" }, { status: 500 });
  }
}
