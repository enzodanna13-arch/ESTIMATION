"use client";

import { useState } from "react";
import { genererDossierPdf } from "@/lib/genererDossierPdf";
import { chiffrage, posteParId, totalLigne, urlPhotoTravaux, type DossierTravaux } from "@/lib/travaux";

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

const AGENCE = {
  nom: process.env.NEXT_PUBLIC_AGENCE_NOM ?? "CENTURY 21",
  enseigne: process.env.NEXT_PUBLIC_AGENCE_ENSEIGNE ?? "Icaza Immobilier",
  adresse: process.env.NEXT_PUBLIC_AGENCE_ADRESSE ?? "32 avenue de la Paix, 13500 Martigues",
  tel: process.env.NEXT_PUBLIC_AGENCE_TEL ?? "04 42 42 80 85",
};

function Head({ page }: { page: number }) {
  return (
    <div className="head">
      <span className="c21">{AGENCE.nom}</span>
      <span className="pg">Dossier travaux · {String(page).padStart(2, "0")}</span>
    </div>
  );
}
function Foot({ left, right }: { left: string; right: string }) {
  return <div className="foot"><span>{left}</span><span>{right}</span></div>;
}

export default function TravauxDossier({ dossier }: { dossier: DossierTravaux }) {
  const [pdfProg, setPdfProg] = useState<{ fait: number; total: number } | null>(null);
  const [editMode, setEditMode] = useState(false);

  const { sousTotal, aleas, total } = chiffrage(dossier.lignes, dossier.margeAlea);
  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const footLeft = `${AGENCE.nom} ${AGENCE.enseigne} — ${AGENCE.adresse} · ${AGENCE.tel}`;
  const bien = [dossier.typeBien, dossier.surface ? `${dossier.surface} m²` : "", dossier.nbPieces ? `${dossier.nbPieces} pièces` : ""].filter(Boolean).join(" · ");
  const lieu = [dossier.adresse, [dossier.codePostal, dossier.ville].filter(Boolean).join(" ")].filter(Boolean).join(", ");

  // Regroupement des lignes par pièce pour le détail.
  const parPiece = new Map<string, typeof dossier.lignes>();
  for (const l of dossier.lignes) {
    const k = l.piece || "Travaux généraux";
    if (!parPiece.has(k)) parPiece.set(k, []);
    parPiece.get(k)!.push(l);
  }

  const sortirEdition = async () => {
    if (typeof document !== "undefined") (document.activeElement as HTMLElement | null)?.blur?.();
    setEditMode(false);
    await new Promise<void>((r) =>
      typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame(() => requestAnimationFrame(() => r())) : setTimeout(r, 30));
  };
  const telechargerPdf = async () => {
    await sortirEdition();
    setPdfProg({ fait: 0, total: 0 });
    try {
      const base = [dossier.reference, dossier.ville].filter(Boolean).join("-").replace(/[^a-z0-9-]/gi, "_");
      const ok = await genererDossierPdf(`${base || "travaux"}.pdf`, (fait, total) => setPdfProg({ fait, total }));
      if (!ok) throw new Error("Dossier introuvable");
    } catch {
      alert("La génération directe a échoué — on bascule sur l'impression du navigateur. Choisissez « Enregistrer au format PDF », orientation Portrait.");
      window.print();
    } finally { setPdfProg(null); }
  };
  const pdfLabel = !pdfProg ? "📄 Télécharger le PDF" : pdfProg.total === 0 ? "⏳ Préparation…" : `⏳ Génération… ${pdfProg.fait}/${pdfProg.total}`;

  let pageNo = 1;
  const P = () => pageNo++;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-end gap-2 print:hidden">
        <button
          onClick={() => setEditMode((v) => !v)}
          className={`rounded-lg px-4 py-1.5 text-sm font-bold transition ${editMode ? "bg-emerald-600 text-white hover:brightness-110" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"}`}
          title="Corriger n'importe quel texte du dossier directement à l'écran avant export"
        >
          {editMode ? "✓ Terminer les modifications" : "✏️ Modifier le dossier"}
        </button>
        <button onClick={telechargerPdf} disabled={pdfProg !== null} className="rounded-lg bg-copper px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60">
          {pdfLabel}
        </button>
        <button onClick={async () => { await sortirEdition(); window.print(); }} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
          🖨️ Imprimer
        </button>
      </div>

      {editMode && (
        <div className="mb-3 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-800 print:hidden">
          <b>Mode modification activé.</b> Cliquez sur n&apos;importe quel texte (titres, descriptions, légendes, montants…) pour le corriger. Vos retouches sont conservées dans le PDF et à l&apos;impression.
        </div>
      )}

      <div className={`dossier${editMode ? " editing" : ""}`} contentEditable={editMode} suppressContentEditableWarning spellCheck={editMode}>
        {/* ======== COUVERTURE ======== */}
        <section className="page cover">
          <div className="frame" />
          <div className="cover-top">
            <div className="eyebrow">{AGENCE.nom} {AGENCE.enseigne}</div>
            <h1 style={{ fontSize: "30pt", marginTop: "8mm" }}>Dossier de travaux</h1>
            <div className="rule-gold" style={{ marginTop: "6mm" }} />
          </div>
          <div className="cover-mid">
            <div style={{ fontSize: "15pt", marginBottom: "3mm" }}>{bien || "Bien à rénover"}</div>
            {lieu && <div style={{ fontSize: "12pt", color: "var(--paper)" }}>{lieu}</div>}
            {dossier.clientNom && <div style={{ marginTop: "8mm", fontSize: "11pt" }}>Pour : {dossier.clientNom}</div>}
          </div>
          <div className="cover-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: "9pt", opacity: 0.7 }}>Estimation des travaux</div>
              <div className="big" style={{ fontSize: "26pt" }}>{euro.format(total)}</div>
              <div style={{ fontSize: "8.5pt", opacity: 0.7 }}>TTC, fourniture et pose — ordre de grandeur</div>
            </div>
            <div style={{ textAlign: "right", fontSize: "9pt", opacity: 0.8 }}>
              {dossier.negociateur && <div>{dossier.negociateur}</div>}
              <div>{today}</div>
              <div>Réf. {dossier.reference}</div>
            </div>
          </div>
        </section>

        {/* ======== SYNTHÈSE ======== */}
        <section className="page">
          <Head page={P()} />
          <div className="section-title"><span className="idx">I</span><h2>Synthèse des travaux</h2></div>
          <hr className="rule-gold" />
          {dossier.contexte && <p className="section-lead">{dossier.contexte}</p>}
          {dossier.syntheseIA && <p style={{ whiteSpace: "pre-wrap" }}>{dossier.syntheseIA}</p>}

          <div className="valuation" style={{ marginTop: "8mm" }}>
            <div className="cell"><div className="lbl">Sous-total travaux</div><div className="amt">{euro.format(sousTotal)}</div></div>
            <div className="cell center"><div className="lbl">Aléas / imprévus ({dossier.margeAlea} %)</div><div className="amt" style={{ fontSize: "18pt" }}>{euro.format(aleas)}</div></div>
            <div className="cell"><div className="lbl">Estimation totale TTC</div><div className="amt">{euro.format(total)}</div></div>
          </div>

          <div className="callout" style={{ marginTop: "8mm" }}>
            <b>Estimation indicative : {euro.format(total)} TTC.</b> Ce chiffrage repose sur des prix moyens fourniture + pose observés en France (2025) et sur l&apos;état constaté. Il ne vaut pas devis : seuls les devis d&apos;entreprises engagent un montant ferme.
          </div>
          <Foot left={footLeft} right={`Réf. ${dossier.reference}`} />
        </section>

        {/* ======== PIÈCES & PHOTOS (avant / après) ======== */}
        {dossier.photos.length > 0 && (
          <section className="page">
            <Head page={P()} />
            <div className="section-title"><span className="idx">II</span><h2>État des lieux & projection</h2></div>
            <hr className="rule-gold" />
            <p className="section-lead">Pour chaque pièce : la photo de l&apos;existant et la description du rendu après travaux.</p>
            {dossier.photos.map((ph) => (
              <div key={ph.id} className="box" style={{ marginTop: "6mm", pageBreakInside: "avoid" }}>
                <h4>{ph.piece || ph.nom}{ph.etat ? ` — ${ph.etat}` : ""}</h4>
                <div style={{ display: "flex", gap: "5mm", marginTop: "3mm", alignItems: "flex-start" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={urlPhotoTravaux(dossier.id, ph.id)} alt={ph.nom} style={{ width: "48%", borderRadius: 4, objectFit: "cover" }} />
                  <div style={{ width: "52%", fontSize: "10pt" }}>
                    {ph.legendeAvant && <p style={{ margin: 0 }}><b>Avant :</b> {ph.legendeAvant}</p>}
                    {ph.legendeApres && <p style={{ marginTop: "3mm" }}><b>Après travaux :</b> {ph.legendeApres}</p>}
                  </div>
                </div>
              </div>
            ))}
            <Foot left={footLeft} right={`Réf. ${dossier.reference}`} />
          </section>
        )}

        {/* ======== DÉTAIL DU CHIFFRAGE ======== */}
        <section className="page">
          <Head page={P()} />
          <div className="section-title"><span className="idx">{dossier.photos.length > 0 ? "III" : "II"}</span><h2>Détail du chiffrage</h2></div>
          <hr className="rule-gold" />
          {dossier.lignes.length === 0 ? (
            <p className="section-lead">Aucune ligne de travaux saisie.</p>
          ) : (
            [...parPiece.entries()].map(([piece, lignes]) => (
              <div key={piece} style={{ marginTop: "5mm" }}>
                <h4 style={{ marginBottom: "2mm" }}>{piece}</h4>
                <table style={{ width: "100%", fontSize: "9.5pt" }}>
                  <thead>
                    <tr><th style={{ textAlign: "left" }}>Poste</th><th>Qté</th><th>Unité</th><th style={{ textAlign: "right" }}>P.U.</th><th style={{ textAlign: "right" }}>Total</th></tr>
                  </thead>
                  <tbody>
                    {lignes.map((l) => (
                      <tr key={l.id}>
                        <td style={{ textAlign: "left" }}>{l.libelle || posteParId(l.posteId)?.libelle || "Travaux"}</td>
                        <td style={{ textAlign: "center" }}>{l.quantite}</td>
                        <td style={{ textAlign: "center" }}>{l.unite}</td>
                        <td style={{ textAlign: "right" }}>{euro.format(l.prixUnitaire)}</td>
                        <td style={{ textAlign: "right" }}>{euro.format(totalLigne(l))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
          <table style={{ width: "100%", marginTop: "6mm", fontSize: "10pt" }}>
            <tbody>
              <tr><td style={{ textAlign: "right" }}>Sous-total</td><td style={{ textAlign: "right", width: "35mm" }}>{euro.format(sousTotal)}</td></tr>
              <tr><td style={{ textAlign: "right" }}>Aléas / imprévus ({dossier.margeAlea} %)</td><td style={{ textAlign: "right" }}>{euro.format(aleas)}</td></tr>
              <tr style={{ fontWeight: 700 }}><td style={{ textAlign: "right" }}>Estimation totale TTC</td><td style={{ textAlign: "right" }}>{euro.format(total)}</td></tr>
            </tbody>
          </table>
          <p style={{ fontSize: "8.5pt", color: "var(--ink-45)", marginTop: "6mm" }}>
            Document établi par {AGENCE.nom} {AGENCE.enseigne} à titre indicatif pour aider à la décision. Prix moyens fourniture + pose (France, 2025), à confirmer par devis d&apos;entreprises.
          </p>
          <Foot left={footLeft} right={`Réf. ${dossier.reference}`} />
        </section>
      </div>
    </div>
  );
}
