import { verifierAccesEquipe } from "@/lib/historyAuth";
import { listLeadsServer } from "@/lib/serverLeads";

export const dynamic = "force-dynamic";

// Rapprochement d'un bien chassé avec les leads ACQUÉREURS : on remonte les
// acquéreurs/investisseurs en cours qui cherchent dans le même secteur et dont
// le budget couvre (à peu près) le prix affiché.

const norm = (s: string) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, " ").trim();

// Statuts « morts » : ces leads ne sont plus à rapprocher.
const STATUTS_MORTS = ["converti", "pas interesse", "pas intéressé", "perdu", "prise de mandat", "estimation sans projet"];

export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });

  let ville = "", codePostal = "", prixAffiche = 0;
  try {
    const b = (await request.json()) as { ville?: string; codePostal?: string; prixAffiche?: number };
    ville = (b.ville ?? "").trim();
    codePostal = (b.codePostal ?? "").trim();
    prixAffiche = Number(b.prixAffiche) || 0;
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }

  // Jeton de commune (sans le code postal) pour un rapprochement souple.
  const cpBien = codePostal || (ville.match(/\b(\d{5})\b/)?.[1] ?? "");
  const communeBien = norm(ville.replace(/\b\d{5}\b/, ""));

  try {
    const leads = await listLeadsServer();
    const matches = leads
      .filter((l) => ["acquereur", "investisseur"].includes((l.typeProjet || "").toLowerCase()))
      .filter((l) => !STATUTS_MORTS.includes(norm(l.statut)))
      .filter((l) => {
        const lv = norm(l.ville);
        const lcp = l.ville.match(/\b(\d{5})\b/)?.[1] ?? "";
        const memeSecteur =
          (cpBien && lcp && cpBien === lcp) ||
          (communeBien.length > 2 && (lv.includes(communeBien) || communeBien.includes(lv)));
        return memeSecteur;
      })
      .filter((l) => l.budget == null || prixAffiche <= 0 || l.budget >= prixAffiche * 0.9)
      .map((l) => ({
        id: l.id, nom: l.nom, prenom: l.prenom, tel: l.tel, email: l.email,
        budget: l.budget, ville: l.ville, negociateur: l.negociateur, statut: l.statut, typeProjet: l.typeProjet,
      }))
      .sort((a, b) => (b.budget ?? 0) - (a.budget ?? 0));

    return Response.json({ acquereurs: matches });
  } catch (err) {
    console.error("Rapprochement acquéreurs impossible :", err);
    return Response.json({ acquereurs: [] });
  }
}
