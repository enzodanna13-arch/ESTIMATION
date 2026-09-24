import { EQUIPE } from "./equipe";
import { construireTournee, type PointTournee } from "./tournee";
import {
  STATUTS_HORS_TOURNEE, type EtapeTournee, type Opportunite, type ProspectionConfig, type Tournee,
} from "./prospectionTypes";
import {
  deleteTournee, getConfigProspection, listOpportunites, listTournees, saveOpportunitesBatch, saveTournee,
} from "./serverProspection";

const JOUR = 86_400_000;
const minuitAujourdhui = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };

function joursDepuis(dateIso: string): number | null {
  if (!dateIso) return null;
  const t = Date.parse(dateIso);
  return Number.isFinite(t) ? Math.floor((Date.now() - t) / JOUR) : null;
}

// Potentiel d'un bien pour la sélection de tournée : score + fraîcheur du
// signal + urgence de relance. La distance est arbitrée ensuite par le moteur.
// PRIORITÉ FORTE aux DPE de la semaine écoulée (≤ 7 j) : gros bonus, pour que
// les biens tout juste détectés passent devant lors de la génération.
function valeurTournee(o: Opportunite, finJour: number): number {
  const age = joursDepuis(o.dpeDateEtablissement);
  let fraicheur = 0;
  if (age != null) {
    if (age <= 7) fraicheur = 45;             // DPE de la semaine → priorité forte
    else if (age <= 14) fraicheur = 25;
    else if (age <= 30) fraicheur = 12;
    else fraicheur = Math.max(0, 8 - age / 20);
  }
  const relanceDue = o.prochaineRelance != null && o.prochaineRelance <= finJour ? 12 : 0;
  return o.score + fraicheur + relanceDue;
}

function slug(nom: string): string {
  return nom.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "equipe";
}

// Une opportunité est-elle prospectable aujourd'hui ?
function eligible(o: Opportunite, config: ProspectionConfig, finJour: number): boolean {
  if (o.exclu || o.archived) return false;
  if (STATUTS_HORS_TOURNEE.has(o.statut)) return false;
  if (o.lat == null || o.lon == null) return false;
  if (o.score < config.scoreMin) return false;
  // Une relance programmée dans le futur n'est pas encore due.
  if (o.prochaineRelance != null && o.prochaineRelance > finJour) return false;
  return true;
}

export interface ResultatGeneration {
  tournees: { negociateur: string; biens: number; distanceKm: number; dureeMin: number }[];
  totalBiens: number;
  nonAttribuees: number;
}

// Génère les tournées du jour pour chaque négociateur ayant un secteur.
// Idempotent par (jour, négociateur) : relancer la génération remplace la
// tournée du jour et remet à plat les statuts « Tournée planifiée » périmés.
export async function genererTournees(): Promise<ResultatGeneration> {
  const config = await getConfigProspection();
  const jour = minuitAujourdhui();
  const finJour = jour + JOUR - 1;
  const opps = await listOpportunites();

  const modifs = new Map<string, Opportunite>();
  const majStatut = (o: Opportunite, statut: string) => {
    const ref = modifs.get(o.id) ?? o;
    modifs.set(o.id, { ...ref, statut, updatedAt: Date.now() });
  };

  // Nettoyage : on supprime TOUTES les anciennes tournées pour laisser place à
  // la nouvelle génération (l'historique de prospection est conservé sur les
  // opportunités elles-mêmes, pas sur les tournées).
  const dejaLa = await listTournees();
  for (const t of dejaLa) await deleteTournee(t.id);

  // Remise à plat : toute opportunité « Tournée planifiée » redevient « À
  // prospecter » (on reconstruit les tournées ci-dessous).
  for (const o of opps) if (o.statut === "Tournée planifiée") majStatut(o, "À prospecter");

  const resultat: ResultatGeneration = { tournees: [], totalBiens: 0, nonAttribuees: 0 };

  const maxAdresses = config.tournee.maxAdresses;
  const dureeMinutes = config.tournee.dureeMinutes;

  // Négociateurs pour la répartition ÉQUITABLE : l'équipe transaction. À
  // défaut, on retombe sur les négociateurs déjà présents sur les biens.
  const pool = EQUIPE.filter((m) => m.role === "Transaction").map((m) => m.nom);
  const negos = pool.length > 0 ? pool : [...new Set(opps.map((o) => o.negociateur).filter(Boolean))];
  const charges = new Map<string, number>(negos.map((n) => [n, 0]));

  // 1) Regrouper les biens éligibles PAR COMMUNE : une tournée ne mélange
  //    JAMAIS deux communes (une tournée Martigues n'inclut pas Châteauneuf).
  const parCommune = new Map<string, Opportunite[]>();
  for (const o of opps) {
    if (!eligible(o, config, finJour)) continue;
    (parCommune.get(o.codeInsee) ?? parCommune.set(o.codeInsee, []).get(o.codeInsee)!).push(o);
  }

  // 2) Découper chaque commune en tournées (≤ maxAdresses, cohérentes).
  interface TourBrut { ordreIds: string[]; distanceKm: number; dureeMin: number; taille: number }
  const toursBruts: TourBrut[] = [];
  for (const [, lot] of parCommune) {
    let restants = lot.map<PointTournee>((o) => ({ id: o.id, lat: o.lat as number, lon: o.lon as number, valeur: valeurTournee(o, finJour) }));
    let g = 0;
    while (restants.length > 0 && g++ < 40) {
      const opt = construireTournee(restants, { maxAdresses, dureeMinutes, minutesParArret: config.tournee.minutesParArret, vitesseKmh: config.tournee.vitesseKmh });
      if (opt.ordre.length === 0) break;
      toursBruts.push({ ordreIds: opt.ordre, distanceKm: opt.distanceKm, dureeMin: opt.dureeMin, taille: opt.ordre.length });
      const pris = new Set(opt.ordre);
      restants = restants.filter((r) => !pris.has(r.id));
    }
  }

  // 3) Attribution ÉQUITABLE : chaque tournée va au négociateur le moins chargé
  //    (en nombre de biens) ; les plus grosses tournées d'abord pour équilibrer.
  toursBruts.sort((a, b) => b.taille - a.taille);
  const oppById = new Map(opps.map((o) => [o.id, o]));
  const indexParNego = new Map<string, number>();

  for (const tb of toursBruts) {
    let nego = "";
    if (negos.length > 0) {
      nego = negos.reduce((min, n) => ((charges.get(n) ?? 0) < (charges.get(min) ?? 0) ? n : min), negos[0]);
      charges.set(nego, (charges.get(nego) ?? 0) + tb.taille);
    }
    const membre = nego ? EQUIPE.find((m) => m.nom === nego) : undefined;
    const index = (indexParNego.get(nego) ?? 0) + 1;
    indexParNego.set(nego, index);

    const etapes: EtapeTournee[] = tb.ordreIds.map((oppId, i) => {
      const o = oppById.get(oppId)!;
      // Le bien suit l'attribution de sa tournée et passe « planifié ».
      const ref = modifs.get(o.id) ?? o;
      modifs.set(o.id, { ...ref, negociateur: nego, statut: "Tournée planifiée", updatedAt: Date.now() });
      return {
        opportuniteId: o.id, ordre: i + 1, adresse: o.adresse, ville: o.ville,
        lat: o.lat, lon: o.lon, typeBien: o.typeBien, surface: o.surface, dpe: o.dpe,
        score: o.score, niveau: o.niveau, fait: false, resultat: "",
      };
    });
    const ville = etapes[0]?.ville || "";
    const baseId = `tour-${jour}-${membre ? membre.id : nego ? slug(nego) : "non-attribue"}`;
    const tournee: Tournee = {
      id: `${baseId}-${index}`,
      createdAt: Date.now(), updatedAt: Date.now(), date: jour, negociateur: nego, index,
      etapes, distanceKm: tb.distanceKm, dureeMin: tb.dureeMin, statut: "planifiee",
    };
    await saveTournee(tournee);
    resultat.tournees.push({ negociateur: `${nego || "Non attribué"} · ${ville} (Tournée ${index})`, biens: etapes.length, distanceKm: tb.distanceKm, dureeMin: tb.dureeMin });
    resultat.totalBiens += etapes.length;
    if (!nego) resultat.nonAttribuees += etapes.length;
  }

  if (modifs.size > 0) await saveOpportunitesBatch([...modifs.values()]);
  return resultat;
}
