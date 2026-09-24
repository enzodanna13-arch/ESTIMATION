"use client";

import { useEffect, useRef, useState } from "react";
import { listOpportunites } from "@/lib/prospection";
import type { Opportunite, Tournee } from "@/lib/prospectionTypes";
import {
  composerPagesFlyers, flyerDepuisOpportunite, nomFichierFlyers, type FlyerData,
} from "@/lib/prospectionFlyers";
import { FlyerRecto, FlyerVerso } from "@/components/prospection/FlyerTemplate";

const PREVIEW = 0.62; // échelle d'aperçu

// Face vide (moitié blanche pour un nombre impair de biens).
function FaceVide() { return <div style={{ width: "100%", height: "100%", background: "#fff" }} />; }

export default function FlyersTourneeModal({ tournee, onClose }: { tournee: Tournee; onClose: () => void }) {
  const [flyers, setFlyers] = useState<FlyerData[] | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [gen, setGen] = useState<{ fait: number; total: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const opps = await listOpportunites();
        const parId = new Map<string, Opportunite>(opps.map((o) => [o.id, o]));
        const etapes = [...tournee.etapes].sort((a, b) => a.ordre - b.ordre);
        const total = etapes.length;
        const data = etapes.map((e, i) => {
          const o = parId.get(e.opportuniteId);
          if (o) return flyerDepuisOpportunite(o, i + 1, total, tournee.negociateur, "");
          // Repli minimal si l'opportunité n'est plus disponible.
          return flyerDepuisOpportunite(
            { adresse: e.adresse, ville: e.ville, codePostal: "", numero: "", voie: "", typeBien: e.typeBien, surface: e.surface, dpe: e.dpe, ges: "", dpeDateEtablissement: "", ademe: {} } as unknown as Opportunite,
            i + 1, total, tournee.negociateur, "",
          );
        });
        setFlyers(data);
      } catch {
        setErreur("Impossible de préparer les flyers.");
      }
    })();
  }, [tournee]);

  const pages = flyers ? composerPagesFlyers(flyers.length) : [];

  const face = (idx: number | null, f: "recto" | "verso") => {
    if (idx == null || !flyers) return <FaceVide />;
    return f === "recto" ? <FlyerRecto d={flyers[idx]} /> : <FlyerVerso d={flyers[idx]} />;
  };

  const telecharger = async () => {
    const container = ref.current;
    if (!container || !flyers) return;
    setGen({ fait: 0, total: pages.length });
    try {
      // Attendre le chargement des images (photo négociateur, QR).
      await Promise.all(Array.from(container.querySelectorAll("img")).map((img) => img.complete ? Promise.resolve() : new Promise((r) => { img.onload = img.onerror = () => r(null); })));
      const [{ jsPDF }, h2cMod] = await Promise.all([import("jspdf"), import("html2canvas-pro")]);
      const html2canvas = (h2cMod as unknown as { default: typeof import("html2canvas-pro").default }).default;
      const a4s = Array.from(container.querySelectorAll<HTMLElement>(".flyer-a4"));
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape", compress: true });
      const STYLE = ".flyer-a4{ transform:none !important; } .flyer-a4-wrap{ height:auto !important; width:auto !important; overflow:visible !important; }";
      for (let i = 0; i < a4s.length; i++) {
        setGen({ fait: i, total: a4s.length });
        const canvas = await html2canvas(a4s[i], {
          scale: 4, useCORS: true, backgroundColor: "#ffffff", logging: false, windowWidth: 1123, windowHeight: 794,
          imageTimeout: 0,
          onclone: (doc: Document) => { const s = doc.createElement("style"); s.textContent = STYLE; doc.head.appendChild(s); },
        });
        const img = canvas.toDataURL("image/jpeg", 0.96);
        if (i > 0) pdf.addPage();
        pdf.addImage(img, "JPEG", 0, 0, 297, 210);
      }
      pdf.save(nomFichierFlyers(tournee.negociateur));
    } catch {
      setErreur("Génération du PDF impossible.");
    } finally {
      setGen(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/60 p-2 sm:p-4">
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-slate-100">
        {/* En-tête */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-3">
          <div>
            <div className="font-bold text-navy">Flyers de la tournée — {tournee.negociateur || "Non attribué"}</div>
            <div className="text-xs text-slate-500">{flyers ? `${flyers.length} bien(s) · ${pages.length} page(s) A4` : "Préparation…"}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => void telecharger()} disabled={!flyers || !!gen} className="rounded-lg bg-copper px-4 py-2 text-sm font-bold text-white hover:brightness-110 disabled:opacity-50">
              {gen ? `Génération… ${gen.fait}/${gen.total}` : "⬇ Télécharger le PDF"}
            </button>
            <button onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Fermer</button>
          </div>
        </div>

        {/* Consigne d'impression */}
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
          🖨️ Impression recommandée : <b>A4 · recto-verso · taille réelle (100 %)</b> · retournement <b>sur le bord court</b>. Découpez chaque feuille au centre pour obtenir 2 flyers A5.
        </div>

        {/* Aperçu (vraies pages A4) */}
        <div className="flex-1 overflow-auto p-4">
          {erreur && <p className="text-sm text-red-600">{erreur}</p>}
          {!flyers ? (
            <p className="text-sm text-slate-400">Préparation des flyers…</p>
          ) : (
            <div ref={ref}>
              {pages.map((pg, i) => (
                <div key={i} className="mx-auto mb-4" style={{ width: `calc(297mm * ${PREVIEW})` }}>
                  <div className="mb-1 text-center text-[11px] font-semibold text-slate-500">Page A4 {i + 1} — {pg.face === "recto" ? "RECTO" : "VERSO"}</div>
                  <div className="flyer-a4-wrap overflow-hidden rounded bg-white shadow" style={{ width: `calc(297mm * ${PREVIEW})`, height: `calc(210mm * ${PREVIEW})` }}>
                    <div className="flyer-a4" style={{ width: "297mm", height: "210mm", display: "flex", transform: `scale(${PREVIEW})`, transformOrigin: "top left", background: "#fff" }}>
                      <div style={{ width: "148.5mm", height: "210mm", boxSizing: "border-box", position: "relative" }}>{face(pg.gauche, pg.face)}</div>
                      {/* Repères de découpe discrets */}
                      <div style={{ position: "absolute", left: "148.5mm", top: 0, height: "4mm", borderLeft: "0.3mm solid #b0b0b0" }} />
                      <div style={{ position: "absolute", left: "148.5mm", bottom: 0, height: "4mm", borderLeft: "0.3mm solid #b0b0b0" }} />
                      <div style={{ width: "148.5mm", height: "210mm", boxSizing: "border-box", position: "relative" }}>{face(pg.droite, pg.face)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
