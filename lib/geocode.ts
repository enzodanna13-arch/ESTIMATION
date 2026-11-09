// Géocodage serveur via la Base Adresse Nationale (gratuit, sans clé).
// Repli sur la commune si l'adresse précise n'est pas trouvée.

export async function geocodeBAN(adresse: string, ville: string, codePostal: string): Promise<{ lat: number; lon: number } | null> {
  const cp = /^\d{5}$/.test(codePostal) ? codePostal : (ville.match(/\b(\d{5})\b/)?.[1] ?? "");
  const essais = [adresse && `${adresse} ${ville}`.trim(), ville].filter(Boolean) as string[];
  for (const q of essais) {
    try {
      const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}${cp ? `&postcode=${cp}` : ""}&limit=1`;
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 7000);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) continue;
      const body = (await res.json()) as { features?: { geometry?: { coordinates?: number[] } }[] };
      const c = body.features?.[0]?.geometry?.coordinates;
      if (c && typeof c[0] === "number" && typeof c[1] === "number") return { lon: c[0], lat: c[1] };
    } catch { /* essai suivant */ }
  }
  return null;
}

// Distance haversine en mètres entre deux points.
export function distanceM(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180, la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
