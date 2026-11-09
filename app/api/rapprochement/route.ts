import { verifierAccesEquipe } from "@/lib/historyAuth";
import { listEstimationsServer, getEstimationServer } from "@/lib/serverHistory";
import { listChasseServer } from "@/lib/serverChasse";
import { listMandatsServer } from "@/lib/serverMandatsVente";
import { bienDepuisEstimation, bienDepuisChasse } from "@/lib/matching";
import { bienDepuisMandat, mandatRapprochable } from "@/lib/mandatsVenteTypes";
import { motifRapprochable, motifLabel } from "@/lib/types";
import type { BienNormalise } from "@/lib/rapprochement";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

// Agrège et normalise TOUS les biens à vendre des 3 sources structurées :
// estimations (motif vente), chasse (biens repérés), mandats de vente.
export async function GET(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  try {
    const [metas, chasse, mandats] = await Promise.all([
      listEstimationsServer(),
      listChasseServer(),
      listMandatsServer(),
    ]);

    const biens: BienNormalise[] = [];

    // --- Estimations (motif vente uniquement) : on va chercher l'input complet ---
    const rapprochables = metas.filter((m) => motifRapprochable(m.motif));
    const fulls = await Promise.all(rapprochables.map((m) => getEstimationServer(m.id).catch(() => null)));
    fulls.forEach((f, i) => {
      if (!f) return;
      const input = f.input;
      const report = f.result?.report ?? null;
      biens.push({
        id: f.id,
        source: "estimation",
        ref: rapprochables[i].client || f.bien || "Estimation",
        titre: [input.adresse, input.ville].filter(Boolean).join(", ") || f.bien || "Bien estimé",
        ville: input.ville ?? "",
        codePostal: input.codePostal ?? "",
        quartier: input.quartier ?? "",
        typeBien: input.typeBien ?? "",
        prix: report?.prix_presentation || report?.prix_estime || input.prixSouhaiteVendeur || null,
        surface: input.surfaceHabitable ?? null,
        nbPieces: input.nbPieces ?? null,
        negociateur: input.negociateur || f.negociateur || "",
        vendeur: [input.clientPrenom, input.clientNom].filter(Boolean).join(" ") || f.client || "",
        statut: motifLabel(input.motif),
        dateMs: f.createdAt,
        lat: f.result?.subject?.lat ?? null,
        lon: f.result?.subject?.lon ?? null,
        photo: (input.photos && input.photos.length > 0) ? `/api/rapprochement/photo/estimation/${f.id}` : "",
        lien: "",
        criteres: bienDepuisEstimation(input, report),
      });
    });

    // --- Chasse (biens repérés, non archivés) ---
    for (const c of chasse) {
      if (c.archived) continue;
      biens.push({
        id: c.id,
        source: "chasse",
        ref: c.source || "Chasse",
        titre: c.titre || [c.adresse, c.ville].filter(Boolean).join(", ") || "Bien repéré",
        ville: c.ville ?? "",
        codePostal: c.codePostal ?? "",
        quartier: "",
        typeBien: c.typeBien ?? "",
        prix: c.prixAffiche > 0 ? c.prixAffiche : null,
        surface: c.surface > 0 ? c.surface : null,
        nbPieces: c.pieces > 0 ? c.pieces : null,
        negociateur: c.negociateur || "",
        vendeur: c.contactProprietaire || "",
        statut: c.statut || "",
        dateMs: c.createdAt,
        lat: typeof c.lat === "number" ? c.lat : null,
        lon: typeof c.lon === "number" ? c.lon : null,
        photo: Array.isArray(c.photos) && c.photos.length > 0 ? c.photos[0] : "",
        lien: c.url || "",
        criteres: bienDepuisChasse(c),
      });
    }

    // --- Mandats de vente (actifs / sous compromis) ---
    for (const m of mandats) {
      if (!mandatRapprochable(m)) continue;
      biens.push({
        id: m.id,
        source: "mandat",
        ref: m.reference || "Mandat",
        titre: [m.adresse, m.ville].filter(Boolean).join(", ") || m.vendeurNom || "Bien en mandat",
        ville: m.ville ?? "",
        codePostal: m.codePostal ?? "",
        quartier: m.quartier ?? "",
        typeBien: m.typeBien ?? "",
        prix: m.prix,
        surface: m.surface,
        nbPieces: m.nbPieces,
        negociateur: m.negociateur || "",
        vendeur: m.vendeurNom || "",
        statut: m.statut || "",
        dateMs: m.createdAt,
        lat: typeof m.lat === "number" ? m.lat : null,
        lon: typeof m.lon === "number" ? m.lon : null,
        photo: Array.isArray(m.photos) && m.photos.length > 0 ? `/api/mandats/${m.id}/photos/${m.photos[0].id}` : "",
        lien: "",
        criteres: bienDepuisMandat(m),
      });
    }

    biens.sort((a, b) => b.dateMs - a.dateMs);
    return Response.json({ biens });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Chargement impossible" }, { status: 500 });
  }
}
