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

  // Nettoyage des tournées du jour (on les reconstruit entièrement, y compris
  // le nombre de tournées qui peut varier selon les biens disponibles).
  const dejaLa = await listTournees();
  for (const t of dejaLa) if (t.date === jour) await deleteTournee(t.id);

  // Remise à plat : toute opportunité « Tournée planifiée » redevient « À
  // prospecter » (on reconstruit les tournées ci-dessous).
  for (const o of opps) if (o.statut === "Tournée planifiée") majStatut(o, "À prospecter");

  const resultat: ResultatGeneration = { tournees: [], totalBiens: 0, nonAttribuees: 0 };

  // On regroupe TOUTES les opportunités prospectables par négociateur. Les biens
  // sans négociateur (aucun secteur configuré) forment un groupe « non
  // attribué » : une tournée est quand même créée pour qu'elle soit visible
  // dans « Ma tournée ». L'attribution par secteur reste prioritaire si définie.
  const NON_ATTRIBUE = "__non_attribue__";
  const groupes = new Map<string, Opportunite[]>();
  for (const o of opps) {
    if (!eligible(o, config, finJour)) continue;
    const cle = o.negociateur || NON_ATTRIBUE;
    (groupes.get(cle) ?? groupes.set(cle, []).get(cle)!).push(o);
  }

  for (const [cle, lot] of groupes) {
    const nom = cle === NON_ATTRIBUE ? "" : cle;
    const membre = nom ? EQUIPE.find((m) => m.nom === nom) : undefined;
    const secteur = membre ? config.secteurs[membre.id] : undefined;
    const maxAdresses = secteur?.maxAdresses || config.tournee.maxAdresses;
    const dureeMinutes = secteur?.dureeMinutes || config.tournee.dureeMinutes;
    const baseId = `tour-${jour}-${membre ? membre.id : nom ? slug(nom) : "non-attribue"}`;

    // On découpe TOUS les biens éligibles du négociateur en PLUSIEURS tournées
    // successives (chacune ≤ maxAdresses, géographiquement cohérente), jusqu'à
    // épuisement. Chaque tour retire ses biens du vivier restant.
    let restants = lot.map<PointTournee>((o) => ({ id: o.id, lat: o.lat as number, lon: o.lon as number, valeur: valeurTournee(o, finJour) }));
    let index = 0;
    const MAX_TOURNEES = 40; // garde-fou
    while (restants.length > 0 && index < MAX_TOURNEES) {
      const opt = construireTournee(restants, {
        maxAdresses, dureeMinutes,
        minutesParArret: config.tournee.minutesParArret,
        vitesseKmh: config.tournee.vitesseKmh,
      });
      if (opt.ordre.length === 0) break; // plus aucun bien géolocalisable
      index++;
      const pris = new Set(opt.ordre);
      const etapes: EtapeTournee[] = opt.ordre.map((oppId, i) => {
        const o = lot.find((x) => x.id === oppId)!;
        majStatut(o, "Tournée planifiée");
        return {
          opportuniteId: o.id, ordre: i + 1, adresse: o.adresse, ville: o.ville,
          lat: o.lat, lon: o.lon, typeBien: o.typeBien, surface: o.surface, dpe: o.dpe,
          score: o.score, niveau: o.niveau, fait: false, resultat: "",
        };
      });
      const tournee: Tournee = {
        id: `${baseId}-${index}`,
        createdAt: Date.now(), updatedAt: Date.now(), date: jour, negociateur: nom, index,
        etapes, distanceKm: opt.distanceKm, dureeMin: opt.dureeMin, statut: "planifiee",
      };
      await saveTournee(tournee);
      resultat.tournees.push({ negociateur: `${nom || "Non attribué"} — Tournée ${index}`, biens: etapes.length, distanceKm: opt.distanceKm, dureeMin: opt.dureeMin });
      resultat.totalBiens += etapes.length;
      if (!nom) resultat.nonAttribuees += etapes.length;
      restants = restants.filter((r) => !pris.has(r.id));
    }
  }

  if (modifs.size > 0) await saveOpportunitesBatch([...modifs.values()]);
  return resultat;
}
