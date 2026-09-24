"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { NIVEAUX_PROSPECTION, type Opportunite } from "@/lib/prospectionTypes";

// Couleur du point selon le niveau de priorité.
const COULEUR_NIVEAU: Record<string, string> = {
  tres_prioritaire: "#059669",
  prioritaire: "#d97706",
  a_travailler: "#0284c7",
  faible: "#94a3b8",
};

export default function ProspectionCarte({
  opportunites, ordre, onOpen,
}: {
  opportunites: Opportunite[];
  ordre?: Record<string, number>; // id → n° d'étape (tournée) pour numéroter
  onOpen: (o: Opportunite) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = L.map(ref.current, { scrollWheelZoom: true }).setView([43.405, 5.055], 12);
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
    const pts: L.LatLngExpression[] = [];
    const ligne: L.LatLngExpression[] = [];
    // Trace l'ordre de tournée si fourni.
    const parOrdre = ordre ? opportunites.filter((o) => ordre[o.id]).sort((a, b) => ordre[a.id] - ordre[b.id]) : [];
    for (const o of parOrdre) if (o.lat != null && o.lon != null) ligne.push([o.lat, o.lon]);
    if (ligne.length > 1) L.polyline(ligne, { color: "#1e293b", weight: 2, dashArray: "4 6", opacity: 0.7 }).addTo(layer);

    for (const o of opportunites) {
      if (o.lat == null || o.lon == null) continue;
      const num = ordre?.[o.id];
      const c = COULEUR_NIVEAU[o.niveau] ?? "#94a3b8";
      const m = num
        ? L.marker([o.lat, o.lon], {
            icon: L.divIcon({
              className: "",
              html: `<div style="background:${c};color:#fff;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)">${num}</div>`,
              iconSize: [26, 26], iconAnchor: [13, 13],
            }),
          })
        : L.circleMarker([o.lat, o.lon], { radius: 8, color: "#fff", weight: 2, fillColor: c, fillOpacity: 1 });
      const lignes = [
        `<b>${o.adresse || o.typeBien || "Bien"}</b>`,
        [o.ville, o.typeBien, o.surface ? `${o.surface} m²` : ""].filter(Boolean).join(" · "),
        `Score : <b>${o.score}/100</b> — ${NIVEAUX_PROSPECTION[o.niveau].label}`,
        o.negociateur ? `Négociateur : ${o.negociateur}` : "",
      ].filter(Boolean).join("<br>");
      m.bindTooltip(lignes, { direction: "top", offset: [0, -6] });
      m.on("click", () => onOpen(o));
      m.addTo(layer);
      pts.push([o.lat, o.lon]);
    }
    if (pts.length > 0) { try { map.fitBounds(L.latLngBounds(pts).pad(0.2), { maxZoom: 15 }); } catch { /* ignore */ } }
  }, [opportunites, ordre, onOpen]);

  return <div ref={ref} style={{ width: "100%", height: "70vh", minHeight: 420, borderRadius: 16, overflow: "hidden", zIndex: 0 }} />;
}
