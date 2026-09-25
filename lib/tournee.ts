// Optimisation de TOURNÉE — sélection géographiquement cohérente + ordre de
// passage optimisé. On n'utilise PAS un simple tri par score : le système
// arbitre entre potentiel commercial, fraîcheur du signal et distance/détour.
//
// Pipeline : candidats → sélection (valeur − détour) → clustering implicite
// (proximité) → ordre (plus proche voisin + amélioration 2-opt) → tournée.
//
// Distances à vol d'oiseau (haversine) : suffisant et robuste pour ordonner
// des arrêts urbains, sans dépendre d'une API de routing externe (compatible
// avec la stack, sans clé). Le point 14 gère la navigation réelle via une app
// externe (Google/Apple/Waze) au clic.

export interface PointTournee {
  id: string;
  lat: number;
  lon: number;
  valeur: number; // potentiel (score + fraîcheur) — sert à la sélection
}

export interface OptionsTournee {
  maxAdresses: number;
  dureeMinutes: number;    // budget temps
  minutesParArret: number; // temps passé à chaque adresse
  vitesseKmh: number;      // vitesse moyenne de déplacement
  depart?: { lat: number; lon: number } | null; // point de départ (agence)
  beta?: number;           // pénalité de détour (points/km) — défaut 6
  // Compacité : un bien ne rejoint la tournée que s'il est à ≤ rayonKm du bien
  // sélectionné le plus proche ET à ≤ diametreKm de la graine. Empêche les
  // grands trajets : chaque tournée reste un petit paquet géographique.
  rayonKm?: number;        // saut max au voisin le plus proche — défaut ∞
  diametreKm?: number;     // éloignement max à la graine — défaut 2,4·rayonKm
}

export interface ResultatTournee {
  ordre: string[];      // ids dans l'ordre de passage
  distanceKm: number;   // distance totale estimée
  dureeMin: number;     // durée totale estimée (trajet + arrêts)
}

export function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function longueur(order: PointTournee[], depart?: { lat: number; lon: number } | null): number {
  let d = 0;
  let prev = depart ?? order[0];
  const start = depart ? 0 : 1;
  for (let i = start; i < order.length; i++) { d += haversineKm(prev, order[i]); prev = order[i]; }
  return d;
}

// Ordre « plus proche voisin » depuis le départ.
function plusProcheVoisin(points: PointTournee[], depart?: { lat: number; lon: number } | null): PointTournee[] {
  if (points.length <= 2) return [...points];
  const reste = [...points];
  const ordre: PointTournee[] = [];
  let courant: { lat: number; lon: number } = depart ?? reste[0];
  if (!depart) { ordre.push(reste.shift()!); courant = ordre[0]; }
  while (reste.length) {
    let best = 0;
    let bd = Infinity;
    for (let i = 0; i < reste.length; i++) {
      const dd = haversineKm(courant, reste[i]);
      if (dd < bd) { bd = dd; best = i; }
    }
    const p = reste.splice(best, 1)[0];
    ordre.push(p);
    courant = p;
  }
  return ordre;
}

// Amélioration 2-opt (supprime les croisements d'itinéraire).
function deuxOpt(order: PointTournee[], depart?: { lat: number; lon: number } | null): PointTournee[] {
  if (order.length < 4) return order;
  let best = order;
  let bestLen = longueur(best, depart);
  let ameliore = true;
  let gardeFou = 0;
  while (ameliore && gardeFou++ < 60) {
    ameliore = false;
    for (let i = 0; i < best.length - 1; i++) {
      for (let k = i + 1; k < best.length; k++) {
        const candidat = [...best.slice(0, i), ...best.slice(i, k + 1).reverse(), ...best.slice(k + 1)];
        const len = longueur(candidat, depart);
        if (len + 1e-9 < bestLen) { best = candidat; bestLen = len; ameliore = true; }
      }
    }
  }
  return best;
}

function dureeDe(order: PointTournee[], opts: OptionsTournee): { distanceKm: number; dureeMin: number } {
  const distanceKm = longueur(order, opts.depart);
  const trajetMin = opts.vitesseKmh > 0 ? (distanceKm / opts.vitesseKmh) * 60 : 0;
  const dureeMin = trajetMin + order.length * opts.minutesParArret;
  return { distanceKm, dureeMin };
}

/**
 * Construit une tournée cohérente à partir de candidats géolocalisés.
 * Sélection gloutonne : on part du meilleur potentiel, puis on agrège les
 * biens qui maximisent (valeur − β·distance au groupe), dans la limite du
 * nombre d'adresses et du budget temps. L'ordre final est optimisé (PPV+2-opt).
 */
export function construireTournee(candidats: PointTournee[], opts: OptionsTournee): ResultatTournee {
  const geoloc = candidats.filter((c) => Number.isFinite(c.lat) && Number.isFinite(c.lon));
  if (geoloc.length === 0) return { ordre: [], distanceKm: 0, dureeMin: 0 };

  const beta = opts.beta ?? 6;
  const rayonKm = opts.rayonKm ?? Infinity;              // saut max au voisin proche
  const diametreKm = opts.diametreKm ?? rayonKm * 2.4;   // étalement max autour de la graine
  // On borne le vivier au meilleur potentiel pour rester performant.
  const pool = [...geoloc].sort((a, b) => b.valeur - a.valeur).slice(0, Math.max(opts.maxAdresses * 4, 40));

  const graine = pool.shift()!;
  const selection: PointTournee[] = [graine];           // graine = meilleur potentiel
  const distMin = (c: PointTournee) => Math.min(...selection.map((s) => haversineKm(s, c)));

  while (selection.length < opts.maxAdresses && pool.length) {
    // Meilleur compromis potentiel / détour, DANS le rayon de compacité.
    let best = -1;
    let bestGain = -Infinity;
    for (let i = 0; i < pool.length; i++) {
      const proche = distMin(pool[i]);
      // Compacité : jamais de long saut, jamais trop loin de la graine.
      if (proche > rayonKm || haversineKm(graine, pool[i]) > diametreKm) continue;
      const gain = pool[i].valeur - beta * proche;
      if (gain > bestGain) { bestGain = gain; best = i; }
    }
    if (best < 0) break; // plus aucun bien assez proche → la tournée s'arrête là
    const candidat = pool[best];
    const essai = deuxOpt(plusProcheVoisin([...selection, candidat], opts.depart), opts.depart);
    const { dureeMin } = dureeDe(essai, opts);
    if (dureeMin > opts.dureeMinutes && selection.length >= 1) {
      // Ne rentre pas dans le budget temps : on retire ce candidat du vivier.
      pool.splice(best, 1);
      continue;
    }
    selection.push(candidat);
    pool.splice(best, 1);
  }

  const ordre = deuxOpt(plusProcheVoisin(selection, opts.depart), opts.depart);
  const { distanceKm, dureeMin } = dureeDe(ordre, opts);
  return {
    ordre: ordre.map((p) => p.id),
    distanceKm: Math.round(distanceKm * 10) / 10,
    dureeMin: Math.round(dureeMin),
  };
}
