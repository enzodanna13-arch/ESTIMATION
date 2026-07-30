"use client";

import { useRef, useState } from "react";
import { EnTete, PiedC21 } from "@/components/PreEtatDate";
import type { DocumentInput } from "@/lib/docTypes";

// Bon de visite — reconnaissance de visite signée par l'acquéreur, sur
// papier à en-tête CENTURY 21. Document fixe généré SANS IA : seules les
// informations du dossier changent, les textes légaux sont inclus
// automatiquement (loi Hoguet, article 1240 du Code civil).
// Signature électronique SIMPLE (manuscrite numérisée) directement à l'écran.

const SANS = 'Arial, "Helvetica Neue", sans-serif';

/** Pad de signature manuscrite : on signe à la souris/au doigt, l'image est
 *  remontée au parent. Masqué à l'impression une fois signé (seule l'image
 *  du trait reste). */
function PadSignature({ label, image, onSign }: { label: string; image: string | null; onSign: (dataUrl: string | null) => void }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const dessine = useRef(false);
  const vide = useRef(true);

  const pos = (e: React.PointerEvent) => {
    const c = ref.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height };
  };
  const down = (e: React.PointerEvent) => {
    const ctx = ref.current!.getContext("2d")!;
    dessine.current = true;
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    if (!dessine.current) return;
    const ctx = ref.current!.getContext("2d")!;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0c1b2a";
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    vide.current = false;
  };
  const up = () => {
    if (!dessine.current) return;
    dessine.current = false;
    if (!vide.current) onSign(ref.current!.toDataURL("image/png"));
  };
  const effacer = () => {
    const c = ref.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    vide.current = true;
    onSign(null);
  };

  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 2 }}>{label}</div>
      {image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="Signature" style={{ height: "46px", marginTop: 5, display: "block" }} />
          <button type="button" onClick={effacer} className="mt-1 text-[11px] text-slate-400 hover:text-red-600 print:hidden">Effacer</button>
        </>
      ) : (
        <div className="print:hidden">
          <div style={{ fontSize: "8.5pt", color: "#555" }}>Signez ci-dessous</div>
          <canvas
            ref={ref}
            width={360}
            height={90}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerLeave={up}
            style={{ width: "100%", height: 60, border: "1px dashed #b4975b", borderRadius: 6, marginTop: 5, touchAction: "none", cursor: "crosshair" }}
          />
        </div>
      )}
      {/* Emplacement papier si non signé */}
      {!image && <div className="hidden print:block" style={{ border: "1px solid #999", height: 46, marginTop: 5 }} />}
    </div>
  );
}

export default function BonVisite({ input, onReset }: { input: DocumentInput; onReset: () => void }) {
  const [sigAcq, setSigAcq] = useState<string | null>(null);
  const [sigNego, setSigNego] = useState<string | null>(null);
  const [signeLe, setSigneLe] = useState<string | null>(null);
  const marquerSignature = (setter: (v: string | null) => void) => (v: string | null) => {
    setter(v);
    if (v) setSigneLe(new Date().toLocaleString("fr-FR"));
  };
  const dateStr = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const dateVisite = input.dateVisite?.trim() || `le ${dateStr}`;
  const acquereur = input.bvAcquereur || "……………………………………";
  const vendeur = input.bvVendeur || "……………………………………";
  const mandat = input.bvMandat || "…………";
  const bien = input.bvBien || "……………………………………………………";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h2 className="text-2xl font-bold text-navy">Bon de visite</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => window.print()} className="rounded-lg bg-copper px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110">
            📄 Imprimer / PDF
          </button>
          <button onClick={onReset} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
            Nouveau document
          </button>
        </div>
      </div>

      <div className="dossier">
        <section className="page page-c21">
          <EnTete />

          <div style={{ textAlign: "center", marginTop: 2 }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: "17pt", letterSpacing: "0.08em" }}>BON DE VISITE</div>
            <div style={{ fontSize: "10pt", color: "#555", marginTop: 2 }}>Reconnaissance de visite — Martigues, le {dateStr}</div>
          </div>

          {/* Cadre récapitulatif */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10, fontFamily: SANS, fontSize: "10.5pt" }}>
            <tbody>
              {[
                ["Bien concerné", bien],
                ["Mandat", `N° ${mandat}`],
                ["Vendeur", vendeur],
                ["Client acquéreur (visiteur)", acquereur],
                ["Date de la visite", dateVisite],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td style={{ border: "1px solid #000", padding: "4px 10px", width: "38%", fontWeight: 700 }}>{k}</td>
                  <td style={{ border: "1px solid #000", padding: "4px 10px" }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Engagement du visiteur */}
          <div style={{ marginTop: 10, textAlign: "justify" }}>
            <p style={{ marginBottom: 8 }}>
              Je soussigné(e) <b>{acquereur}</b>, reconnais avoir visité {dateVisite}, par l&rsquo;intermédiaire du
              cabinet <b>CENTURY 21 Icaza Immobilier</b>, le bien désigné ci-dessus, proposé à la vente en vertu du
              mandat n°&nbsp;<b>{mandat}</b> confié par <b>{vendeur}</b>.
            </p>
            <p style={{ marginBottom: 6 }}>
              Je reconnais que ce bien m&rsquo;a été présenté par l&rsquo;entremise du cabinet CENTURY 21 Icaza
              Immobilier et je m&rsquo;engage en conséquence :
            </p>
            <ul style={{ paddingLeft: 20, marginBottom: 8 }}>
              <li style={{ marginBottom: 3 }}>
                à ne pas entrer en relation, directement ou indirectement, avec le propriétaire vendeur en vue de
                conclure l&rsquo;acquisition de ce bien sans l&rsquo;intermédiaire du cabinet ;
              </li>
              <li style={{ marginBottom: 3 }}>
                à ne pas traiter cette acquisition par l&rsquo;intermédiaire d&rsquo;un autre professionnel de
                l&rsquo;immobilier ;
              </li>
              <li style={{ marginBottom: 3 }}>
                à informer le cabinet de toute proposition ou négociation qui me serait faite concernant ce bien.
              </li>
            </ul>
            <p style={{ marginBottom: 8 }}>
              À défaut, je reconnais que la conclusion de la vente en privant le cabinet de sa rémunération, après
              avoir bénéficié de son entremise, serait constitutive d&rsquo;une faute susceptible d&rsquo;engager ma
              responsabilité et d&rsquo;ouvrir droit à des dommages-intérêts sur le fondement de
              l&rsquo;article&nbsp;1240 du Code civil.
            </p>
          </div>

          {/* Références légales automatiques */}
          <div style={{ marginTop: 10, border: "1px solid #b4975b", padding: "8px 12px", fontSize: "8.5pt", lineHeight: 1.45, color: "#333" }}>
            <b style={{ color: "#b4975b" }}>Références légales</b>
            <br />— Loi n° 70-9 du 2 janvier 1970 (« loi Hoguet ») réglementant les conditions d&rsquo;exercice des
            activités relatives à certaines opérations portant sur les immeubles et les fonds de commerce, notamment
            son article 6 ;
            <br />— Décret n° 72-678 du 20 juillet 1972 fixant les conditions d&rsquo;application de la loi précitée ;
            <br />— Article 1240 du Code civil : «&nbsp;Tout fait quelconque de l&rsquo;homme, qui cause à autrui un
            dommage, oblige celui par la faute duquel il est arrivé à le réparer.&nbsp;»
            <br />Le présent bon de visite constitue une reconnaissance de visite. Il ne constitue pas un mandat au
            sens de l&rsquo;article 6 de la loi du 2 janvier 1970, n&rsquo;emporte aucune obligation d&rsquo;acquérir
            et n&rsquo;ouvre pas droit, à lui seul, à rémunération du cabinet.
          </div>

          {/* Signatures électroniques (manuscrites numérisées) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 10, fontFamily: SANS, fontSize: "10pt" }}>
            <div>
              <div style={{ fontSize: "8.5pt", color: "#555", marginBottom: 2 }}>« Lu et approuvé »</div>
              <PadSignature label="Le client acquéreur" image={sigAcq} onSign={marquerSignature(setSigAcq)} />
            </div>
            <div>
              <div style={{ fontSize: "8.5pt", color: "#555", marginBottom: 2 }}>{input.negociateur || "Le négociateur"}{input.negociateurTel ? ` · ${input.negociateurTel}` : ""}</div>
              <PadSignature label="Pour CENTURY 21 Icaza Immobilier" image={sigNego} onSign={marquerSignature(setSigNego)} />
            </div>
          </div>
          {signeLe && (
            <div style={{ marginTop: 8, fontSize: "7.5pt", color: "#666", fontFamily: SANS }}>
              Signé électroniquement le {signeLe} — signature manuscrite numérisée valant preuve du consentement des parties.
            </div>
          )}

          <PiedC21 />
        </section>
      </div>
    </div>
  );
}
