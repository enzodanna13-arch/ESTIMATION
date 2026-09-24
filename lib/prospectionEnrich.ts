import { fetchOfficialDvf } from "./dvf";
import type { DvfSale } from "./types";
import { haversineKm } from "./tournee";
import { normVoie } from "./prospectionDedup";
import type { Opportunite } from "./prospectionTypes";

// Enrichissement DVF : pour chaque opportunité, retrouver la DERNIÈRE mutation
// connue du bien (bâtiment) afin d'alimenter le scoring (ancienneté) et la
// fiche. On charge les ventes d'une commune UNE seule fois puis on rapproche
// localement (économie d'appels réseau). Best-effort : toute erreur ⇒ on
// n'enrichit pas (l'indisponibilité DVF ne bloque jamais la prospection).
//
// PRUDENCE : une absence de mutation DVF n'est jamais une certitude sur le
// propriétaire actuel. On qualifie donc la confiance du rapprochement.

const anneeCourante = new Date().getFullYear();

async function ventesCommune(insee: string, typeBien: string): Promise<DvfSale[]> {
  const typeLocal = typeBien === "maison" ? "Maison" : typeBien === "appartement" ? "Appartement" : "";
  const sales: DvfSale[] = [];
  for (let y = anneeCourante; y >= anneeCourante - 7 && sales.length < 4000; y--) {
    try { sales.push(...(await fetchOfficialDvf(insee, y, typeLocal))); } catch { /* millésime indispo */ }
  }
  return sales;
}

function numeroDe(adresse: string): string { return (adresse.match(/^\s*(\d+)/)?.[1] ?? "").trim(); }

// Rapproche une opportunité avec la meilleure vente DVF (bâtiment).
function rapprocher(opp: Opportunite, ventes: DvfSale[]): { vente: DvfSale | null; confiance: Opportunite["confiance"]; motif: string } {
  const voieOpp = normVoie(opp.voie || opp.adresse);
  const numOpp = opp.numero || numeroDe(opp.adresse);
  let best: { v: DvfSale; dist: number; memeVoie: boolean; memeNum: boolean } | null = null;

  for (const v of ventes) {
    const dist = opp.lat != null && opp.lon != null && v.lat != null && v.lon != null
      ? haversineKm({ lat: opp.lat, lon: opp.lon }, { lat: v.lat, lon: v.lon }) * 1000
      : Infinity;
    const voieV = normVoie((v.adresse ?? "").replace(/^\d+\s*/, ""));
    const memeVoie = voieOpp.length > 2 && voieV.includes(voieOpp);
    const memeNum = !!numOpp && numeroDe(v.adresse ?? "") === numOpp;
    // Candidat plausible : même adresse OU très proche.
    const plausible = (memeVoie && memeNum) || dist <= 60;
    if (!plausible) continue;
    // On préfère la vente la plus récente parmi les candidats plausibles.
    if (!best || v.date > best.v.date) best = { v, dist, memeVoie, memeNum };
  }

  if (!best) return { vente: null, confiance: opp.confiance, motif: opp.confianceMotif };
  let confiance: Opportunite["confiance"] = "faible";
  let motif = "Mutation DVF approchée (secteur)";
  if (best.memeVoie && best.memeNum) { confiance = "haute"; motif = "Adresse DVF concordante"; }
  else if (best.dist <= 25) { confiance = "haute"; motif = "Vente DVF au même point"; }
  else if (best.dist <= 60) { confiance = "moyenne"; motif = "Vente DVF à proximité immédiate"; }
  return { vente: best.v, confiance, motif };
}

// Enrichit UNE opportunité (à l'ouverture d'une fiche) — coût borné : quelques
// millésimes DVF récents de sa commune. Best-effort : renvoie l'opportunité
// inchangée en cas d'indisponibilité.
export async function enrichirOpportuniteDvf(opp: Opportunite): Promise<Opportunite> {
  if (!opp.codeInsee) return { ...opp, enrichiLe: Date.now() };
  let ventes: DvfSale[] = [];
  try {
    const typeLocal = opp.typeBien === "maison" ? "Maison" : opp.typeBien === "appartement" ? "Appartement" : "";
    for (let y = anneeCourante; y >= anneeCourante - 4 && ventes.length < 3000; y--) {
      try { ventes.push(...(await fetchOfficialDvf(opp.codeInsee, y, typeLocal))); } catch { /* millésime indispo */ }
    }
  } catch { ventes = []; }
  if (ventes.length === 0) return { ...opp, enrichiLe: Date.now() };
  const { vente, confiance, motif } = rapprocher(opp, ventes);
  return {
    ...opp,
    dvfDerniereMutationDate: vente?.date ?? opp.dvfDerniereMutationDate,
    dvfDerniereMutationPrix: vente?.valeurFonciere ?? opp.dvfDerniereMutationPrix,
    dvfNature: vente?.typeLocal ?? opp.dvfNature,
    dvfSurface: vente?.surface ?? opp.dvfSurface,
    confiance: vente ? confiance : opp.confiance,
    confianceMotif: vente ? motif : opp.confianceMotif,
    enrichiLe: Date.now(),
  };
}

// Enrichit un lot d'opportunités (groupées par commune pour mutualiser DVF).
export async function enrichirDvf(opps: Opportunite[]): Promise<Opportunite[]> {
  const parInsee = new Map<string, Opportunite[]>();
  for (const o of opps) {
    if (!o.codeInsee) continue;
    const cle = `${o.codeInsee}|${o.typeBien}`;
    (parInsee.get(cle) ?? parInsee.set(cle, []).get(cle)!).push(o);
  }
  const out: Opportunite[] = [];
  for (const [cle, lot] of parInsee) {
    const [insee, typeBien] = cle.split("|");
    let ventes: DvfSale[] = [];
    try { ventes = await ventesCommune(insee, typeBien); } catch { ventes = []; }
    for (const o of lot) {
      if (ventes.length === 0) { out.push({ ...o, enrichiLe: Date.now() }); continue; }
      const { vente, confiance, motif } = rapprocher(o, ventes);
      out.push({
        ...o,
        dvfDerniereMutationDate: vente?.date ?? o.dvfDerniereMutationDate,
        dvfDerniereMutationPrix: vente?.valeurFonciere ?? o.dvfDerniereMutationPrix,
        dvfNature: vente?.typeLocal ?? o.dvfNature,
        dvfSurface: vente?.surface ?? o.dvfSurface,
        confiance: vente ? confiance : o.confiance,
        confianceMotif: vente ? motif : o.confianceMotif,
        enrichiLe: Date.now(),
      });
    }
  }
  // Opportunités sans code INSEE : renvoyées telles quelles.
  const traitees = new Set(out.map((o) => o.id));
  for (const o of opps) if (!traitees.has(o.id)) out.push(o);
  return out;
}
