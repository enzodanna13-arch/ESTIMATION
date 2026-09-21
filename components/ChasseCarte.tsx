"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { FicheChasse } from "@/lib/chasse";

const int = new Intl.NumberFormat("fr-FR");
const euro = (n: number) => (n > 0 ? `${int.format(n)} €` : "—");

// Couleur du point selon le positionnement marché (opportunité) sinon statut.
function couleur(f: FicheChasse): string {
  if (typeof f.marcheEcartPct === "number") {
    if (f.marcheEcartPct <= -5) return "#059669"; // vert = sous le marché
    if (f.marcheEcartPct >= 5) return "#dc2626"; // rouge = au-dessus
  }
  return "#b8935a"; // or par défaut
}

export default function ChasseCarte({ fiches, onOpen }: { fiches: FicheChasse[]; onOpen: (f: FicheChasse) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  // Init de la carte (une seule fois)
  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = L.map(ref.current, { scrollWheelZoom: true }).setView([43.405, 5.055], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    // La carte peut être créée avant son dimensionnement final
    setTimeout(() => map.invalidateSize(), 200);
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // (Re)placement des points à chaque changement des fiches
  useEffect(() => {
    const map = mapRef.current, layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    const pts: L.LatLngExpression[] = [];
    for (const f of fiches) {
      if (typeof f.lat !== "number" || typeof f.lon !== "number") continue;
      const c = couleur(f);
      const m = L.circleMarker([f.lat, f.lon], {
        radius: 9, color: "#fff", weight: 2, fillColor: c, fillOpacity: 1,
      });
      const titre = f.titre || f.typeBien || "Bien";
      const lignes = [
        `<b>${titre}</b>`,
        [f.adresse, f.ville].filter(Boolean).join(", "),
        `Annonce : <b>${euro(f.prixAffiche)}</b>${f.estimationNego ? ` · Estim. : <b>${euro(f.estimationNego)}</b>` : ""}`,
        typeof f.marcheEcartPct === "number" ? `Marché : ${f.marcheEcartPct <= 0 ? "" : "+"}${f.marcheEcartPct}%` : "",
      ].filter(Boolean).join("<br>");
      m.bindTooltip(lignes, { direction: "top", offset: [0, -6] });
      m.on("click", () => onOpen(f));
      m.addTo(layer);
      pts.push([f.lat, f.lon]);
    }
    if (pts.length > 0) {
      try { map.fitBounds(L.latLngBounds(pts).pad(0.2), { maxZoom: 15 }); } catch { /* ignore */ }
    }
  }, [fiches, onOpen]);

  return <div ref={ref} style={{ width: "100%", height: "70vh", minHeight: 420, borderRadius: 16, overflow: "hidden", zIndex: 0 }} />;
}
