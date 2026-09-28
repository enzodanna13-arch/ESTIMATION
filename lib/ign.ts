// Liens et imagerie IGN / Géoplateforme (open data, sans clé) + liens externes
// pour la confirmation VISUELLE humaine de l'adresse (Street View, Maps).
// Fonctions pures : utilisables côté client comme serveur.

// Orthophoto IGN (vue aérienne haute résolution) centrée sur un point, en
// image statique JPEG via le service WMS de la Géoplateforme. Idéal pour un
// <img> (pas de clé, pas de CORS requis pour une balise image).
export function orthophotoUrl(
  lat: number,
  lon: number,
  opts: { half?: number; width?: number; height?: number } = {},
): string {
  const half = opts.half ?? 55; // demi-côté visible, en mètres (~110 m de côté)
  const w = opts.width ?? 420;
  const h = opts.height ?? 300;
  const dLat = half / 111_320;
  const dLon = half / (111_320 * Math.cos((lat * Math.PI) / 180));
  const params = new URLSearchParams({
    SERVICE: "WMS",
    VERSION: "1.3.0",
    REQUEST: "GetMap",
    LAYERS: "HR.ORTHOIMAGERY.ORTHOPHOTOS",
    STYLES: "",
    CRS: "EPSG:4326",
    // WMS 1.3.0 + EPSG:4326 → ordre des axes lat,lon.
    BBOX: `${lat - dLat},${lon - dLon},${lat + dLat},${lon + dLon}`,
    WIDTH: String(w),
    HEIGHT: String(h),
    FORMAT: "image/jpeg",
  });
  return `https://data.geopf.fr/wms-r/wms?${params.toString()}`;
}

// Ouvre le Géoportail sur l'adresse en vue aérienne (confirmation humaine).
export function geoportailUrl(lat: number, lon: number): string {
  return `https://www.geoportail.gouv.fr/carte?c=${lon},${lat}&z=19&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&permalink=yes`;
}

// Google Street View au point (usage humain normal, gratuit).
export function streetViewUrl(lat: number, lon: number): string {
  return `https://www.google.com/maps?q&layer=c&cbll=${lat},${lon}`;
}

// Google Maps (vue satellite / plan) au point.
export function googleMapsUrl(lat: number, lon: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
}
