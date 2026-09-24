import { EQUIPE } from "./equipe";
import { fetchDpeCommune, SOURCE_DPE, type DpeBrut } from "./ademe";
import { cleDedup, fusionnerSignal } from "./prospectionDedup";
import { enrichirDvf } from "./prospectionEnrich";
import { appliquerScore } from "./prospectionScoring";
import {
  opportuniteVide, type Opportunite, type ProspectionConfig, type SignalDPE,
} from "./prospectionTypes";
import {
  getConfigProspection, getSyncState, listOpportunites, saveOpportunitesBatch, saveSyncState,
} from "./serverProspection";

const JOUR = 86_400_000;

function isoJoursAvant(n: number): string {
  return new Date(Date.now() - n * JOUR).toISOString().slice(0, 10);
}

function confianceDepuisBan(scoreBan: number | null): { confiance: Opportunite["confiance"]; motif: string } {
  if (scoreBan == null) return { confiance: "moyenne", motif: "Géocodage BAN non fourni" };
  if (scoreBan >= 0.8) return { confiance: "haute", motif: "Adresse BAN fiable" };
  if (scoreBan >= 0.5) return { confiance: "moyenne", motif: "Adresse BAN moyennement fiable" };
  return { confiance: "faible", motif: "Rapprochement à vérifier (BAN faible)" };
}

function signalDepuis(d: DpeBrut, now: number): SignalDPE {
  return {
    numeroDpe: d.numeroDpe,
    dateEtablissement: d.dateEtablissement,
    dateReception: d.dateReception,
    dateVisite: d.dateVisite,
    etiquetteDpe: d.etiquetteDpe,
    etiquetteGes: d.etiquetteGes,
    source: SOURCE_DPE,
    detecteLe: now,
    syncLe: now,
  };
}

function nouvelleOpportunite(d: DpeBrut, now: number): Opportunite {
  const { confiance, motif } = confianceDepuisBan(d.scoreBan);
  const base = opportuniteVide({
    cleBien: cleDedup(d),
    identifiantBan: d.identifiantBan,
    adresse: d.adresse,
    numero: d.numero,
    voie: d.voie,
    ville: d.ville,
    codePostal: d.codePostal,
    codeInsee: d.codeInsee,
    lat: d.lat,
    lon: d.lon,
    typeBien: d.typeBien,
    surface: d.surface,
    periodeConstruction: d.periodeConstruction,
    dpe: d.etiquetteDpe,
    ges: d.etiquetteGes,
    dpeNumero: d.numeroDpe,
    dpeDateEtablissement: d.dateEtablissement,
    dpeDateReception: d.dateReception,
    dpeDateVisite: d.dateVisite,
    signaux: [signalDepuis(d, now)],
    detecteLe: now,
    syncLe: now,
    source: SOURCE_DPE,
    ademe: d.details,
    confiance,
    confianceMotif: motif,
  });
  // Signaux figés à la détection (apprentissage par les résultats).
  base.signauxSnapshot = {
    dpe: d.etiquetteDpe,
    ges: d.etiquetteGes,
    typeBien: d.typeBien,
    surface: d.surface,
    periodeConstruction: d.periodeConstruction,
    dpeDateEtablissement: d.dateEtablissement,
    ageDpeJours: d.dateEtablissement ? Math.floor((now - Date.parse(d.dateEtablissement)) / JOUR) : null,
    codeInsee: d.codeInsee,
  };
  return base;
}

// Attribution EXCLUSIVE d'un négociateur selon les secteurs configurés
// (une opportunité n'est jamais attribuée à plusieurs négociateurs). En cas
// de secteurs qui se chevauchent, on choisit le négociateur le moins chargé.
function attribuer(opp: Opportunite, config: ProspectionConfig, charges: Map<string, number>): string {
  if (opp.negociateur) return opp.negociateur; // respecte une attribution existante
  const candidats = Object.entries(config.secteurs)
    .filter(([, s]) => (s.communes ?? []).includes(opp.codeInsee))
    .map(([id]) => id);
  if (candidats.length === 0) return "";
  candidats.sort((a, b) => (charges.get(a) ?? 0) - (charges.get(b) ?? 0));
  const id = candidats[0];
  charges.set(id, (charges.get(id) ?? 0) + 1);
  return EQUIPE.find((m) => m.id === id)?.nom ?? "";
}

export interface ResultatSync {
  ok: boolean;
  nouveaux: number;
  misAJour: number;
  communes: { code: string; nom: string; dpe: number; nouveaux: number }[];
  erreurs: string[];
  duréeMs: number;
}

// Synchronisation incrémentale complète : détection → dédup → attribution →
// enrichissement → scoring → enregistrement. Robuste (une commune en échec
// n'interrompt pas les autres).
export async function synchroniserProspection(): Promise<ResultatSync> {
  const t0 = Date.now();
  const config = await getConfigProspection();
  const res: ResultatSync = { ok: true, nouveaux: 0, misAJour: 0, communes: [], erreurs: [], duréeMs: 0 };

  if (!config.actif) { res.ok = false; res.erreurs.push("Module inactif (voir Réglages)."); res.duréeMs = Date.now() - t0; return res; }
  if (config.communes.length === 0) { res.erreurs.push("Aucune commune surveillée."); res.duréeMs = Date.now() - t0; return res; }

  const [existantes, syncState] = await Promise.all([listOpportunites(), getSyncState()]);
  const parCle = new Map<string, Opportunite>();
  for (const o of existantes) parCle.set(o.cleBien, o);
  // Charge actuelle par négociateur (pour l'équilibrage d'attribution).
  const charges = new Map<string, number>();
  for (const o of existantes) {
    const m = EQUIPE.find((x) => x.nom === o.negociateur);
    if (m) charges.set(m.id, (charges.get(m.id) ?? 0) + 1);
  }

  const now = Date.now();
  const floorGlobal = isoJoursAvant(config.ageMaxDpeJours);
  const aTraiter: Opportunite[] = []; // créées ou fusionnées, à ré-enregistrer

  for (const commune of config.communes) {
    const etat = syncState.communes[commune.code];
    // Point de reprise incrémental : dernier DPE vu (avec petit recouvrement)
    // borné par l'âge maximum configuré.
    const depuis = etat?.dernierEtablissement
      ? [etat.dernierEtablissement, floorGlobal].sort()[1] // = max(dernier, floor) en tri lexico ISO
      : floorGlobal;
    let dpes: DpeBrut[] = [];
    try {
      dpes = await fetchDpeCommune(commune.code, config.typesBien, depuis);
    } catch (e) {
      res.erreurs.push(`ADEME ${commune.nom} : ${e instanceof Error ? e.message : "indisponible"}`);
      continue;
    }
    let nouveauxCommune = 0;
    let maxEtab = etat?.dernierEtablissement ?? "";
    for (const d of dpes) {
      if (d.dateEtablissement > maxEtab) maxEtab = d.dateEtablissement;
      const cle = cleDedup(d);
      const existante = parCle.get(cle);
      if (existante) {
        const fusion = fusionnerSignal(existante, signalDepuis(d, now), {
          surface: d.surface, periodeConstruction: d.periodeConstruction, lat: d.lat, lon: d.lon, ademe: d.details,
        });
        parCle.set(cle, fusion);
        if (!aTraiter.includes(fusion)) aTraiter.push(fusion);
      } else {
        const opp = nouvelleOpportunite(d, now);
        opp.negociateur = attribuer(opp, config, charges);
        parCle.set(cle, opp);
        aTraiter.push(opp);
        nouveauxCommune++;
      }
    }
    res.nouveaux += nouveauxCommune;
    res.communes.push({ code: commune.code, nom: commune.nom, dpe: dpes.length, nouveaux: nouveauxCommune });
    syncState.communes[commune.code] = {
      dernierEtablissement: maxEtab || depuis,
      lastRunAt: now,
      nbConnus: (etat?.nbConnus ?? 0) + nouveauxCommune,
    };
  }

  res.misAJour = aTraiter.length - res.nouveaux;

  // Enrichissement DVF (best-effort) puis scoring de tout ce qui a bougé.
  let enrichies = aTraiter;
  try { enrichies = await enrichirDvf(aTraiter); } catch { /* DVF indispo : on garde tel quel */ }
  const scorees = enrichies.map((o) => appliquerScore(o, config));

  await saveOpportunitesBatch(scorees);
  syncState.lastRunAt = now;
  await saveSyncState(syncState);

  res.duréeMs = Date.now() - t0;
  return res;
}

// Recalcule le score de TOUTES les opportunités (après changement de config).
export async function rescorerToutes(): Promise<number> {
  const config = await getConfigProspection();
  const opps = await listOpportunites();
  const scorees = opps.map((o) => appliquerScore(o, config));
  await saveOpportunitesBatch(scorees);
  return scorees.length;
}
