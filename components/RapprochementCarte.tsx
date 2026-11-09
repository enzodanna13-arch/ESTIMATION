"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface PointCarte {
  id: string;
  lat: number;
  lon: number;
  titre: string;
  sousTitre?: string;
  couleur: string; // hex
}

// Carte des biens correspondants (OpenStreetMap, sans clé). Pastilles colorées
// par niveau de correspondance + éventuel point de référence (secteur acquéreur).
export default function RapprochementCarte({ points, centre }: { points: PointCarte[]; centre?: { lat: number; lon: number; label: string } | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = L.map(ref.current, { scrollWheelZoom: true }).setView([43.405, 5.055], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 200);
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current, layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    const bounds: [number, number][] = [];

    if (centre) {
      L.marker([centre.lat, centre.lon], {
        icon: L.divIcon({ className: "", html: `<div style="width:16px;height:16px;border-radius:50%;background:#1d4ed8;border:3px solid #fff;box-shadow:0 0 0 2px #1d4ed8"></div>`, iconSize: [16, 16], iconAnchor: [8, 8] }),
      }).addTo(layer).bindPopup(`<b>Secteur recherché</b><br>${centre.label}`);
      bounds.push([centre.lat, centre.lon]);
    }

    for (const p of points) {
      L.circleMarker([p.lat, p.lon], { radius: 9, color: "#fff", weight: 2, fillColor: p.couleur, fillOpacity: 0.95 })
        .addTo(layer)
        .bindPopup(`<b>${p.titre}</b>${p.sousTitre ? `<br>${p.sousTitre}` : ""}`);
      bounds.push([p.lat, p.lon]);
    }

    if (bounds.length === 1) map.setView(bounds[0], 13);
    else if (bounds.length > 1) map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
    setTimeout(() => map.invalidateSize(), 100);
  }, [points, centre]);

  return <div ref={ref} className="h-[340px] w-full overflow-hidden rounded-xl border border-slate-200" />;
}
