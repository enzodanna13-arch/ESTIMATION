import { EQUIPE } from "./equipe";
import { construireTournee, type PointTournee } from "./tournee";
import {
  STATUTS_HORS_TOURNEE, type EtapeTournee, type Opportunite, type ProspectionConfig, type Tournee,
} from "./prospectionTypes";
import {
  getConfigProspection, listOpportunites, saveOpportunitesBatch, saveTournee,
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
function valeurTournee(o: Opportunite, finJour: number): number {
  const age = joursDepuis(o.dpeDateEtablissement);
  const fraicheur = age == null ? 0 : Math.max(0, 15 - age / 3); // ~15 à 0 j, 0 à ~45 j
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

  // Cibles = négociateurs ayant un secteur configuré. À défaut, on répartit par
  // attribution déjà présente sur les opportunités.
  const idsAvecSecteur = Object.keys(config.secteurs);
  const nomsCibles = idsAvecSecteur.length > 0
    ? idsAvecSecteur.map((id) => EQUIPE.find((m) => m.id === id)?.nom ?? "").filter(Boolean)
    : [...new Set(opps.map((o) => o.negociateur).filter(Boolean))];

  const modifs = new Map<string, Opportunite>();
  const majStatut = (o: Opportunite, statut: string) => {
    const ref = modifs.get(o.id) ?? o;
    modifs.set(o.id, { ...ref, statut, updatedAt: Date.now() });
  };

  // Remise à plat : toute opportunité « Tournée planifiée » redevient « À
  // prospecter » (on reconstruit les tournées ci-dessous).
  for (const o of opps) if (o.statut === "Tournée planifiée") majStatut(o, "À prospecter");

  const resultat: ResultatGeneration = { tournees: [], totalBiens: 0, nonAttribuees: 0 };

  for (const nom of nomsCibles) {
    const membre = EQUIPE.find((m) => m.nom === nom);
    const secteur = membre ? config.secteurs[membre.id] : undefined;
    const maxAdresses = secteur?.maxAdresses || config.tournee.maxAdresses;
    const dureeMinutes = secteur?.dureeMinutes || config.tournee.dureeMinutes;

    const candidats = opps
      .filter((o) => o.negociateur === nom && eligible(o, config, finJour))
      .map<PointTournee>((o) => ({ id: o.id, lat: o.lat as number, lon: o.lon as number, valeur: valeurTournee(o, finJour) }));

    if (candidats.length === 0) continue;

    const opt = construireTournee(candidats, {
      maxAdresses, dureeMinutes,
      minutesParArret: config.tournee.minutesParArret,
      vitesseKmh: config.tournee.vitesseKmh,
    });
    if (opt.ordre.length === 0) continue;

    const etapes: EtapeTournee[] = opt.ordre.map((oppId, i) => {
      const o = opps.find((x) => x.id === oppId)!;
      majStatut(o, "Tournée planifiée");
      return {
        opportuniteId: o.id, ordre: i + 1, adresse: o.adresse, ville: o.ville,
        lat: o.lat, lon: o.lon, typeBien: o.typeBien, surface: o.surface, dpe: o.dpe,
        score: o.score, niveau: o.niveau, fait: false, resultat: "",
      };
    });

    const tournee: Tournee = {
      id: `tour-${jour}-${membre ? membre.id : slug(nom)}`,
      createdAt: Date.now(), updatedAt: Date.now(), date: jour, negociateur: nom,
      etapes, distanceKm: opt.distanceKm, dureeMin: opt.dureeMin, statut: "planifiee",
    };
    await saveTournee(tournee);
    resultat.tournees.push({ negociateur: nom, biens: etapes.length, distanceKm: opt.distanceKm, dureeMin: opt.dureeMin });
    resultat.totalBiens += etapes.length;
  }

  resultat.nonAttribuees = opps.filter((o) => !o.negociateur && eligible(o, config, finJour)).length;

  if (modifs.size > 0) await saveOpportunitesBatch([...modifs.values()]);
  return resultat;
}
