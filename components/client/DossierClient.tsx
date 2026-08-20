"use client";

import { useState } from "react";
import { demanderRappel, urlPhoto } from "@/lib/clientApi";
import type { DossierClientPublic } from "@/lib/clientTypes";

const euro = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " €";
const dateFr = (t: number) => new Date(t).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default function DossierClient({ dossier }: { dossier: DossierClientPublic }) {
  const r = dossier.report;
  const b = dossier.bien;
  const nomComplet = `${dossier.proprietaire.prenom} ${dossier.proprietaire.nom}`.trim();
  const [rappel, setRappel] = useState<"idle" | "envoi" | "ok">("idle");

  const rappeler = async () => {
    if (rappel !== "idle") return;
    setRappel("envoi");
    const ok = await demanderRappel(dossier.token);
    setRappel(ok ? "ok" : "idle");
  };

  return (
    <main className="tunnel">
      <div className="wrap-narrow">

        {/* En-tête résultat */}
        <div className="dc-result fade-in">
          <p className="eyebrow">Votre estimation est prête</p>
          <div className="dc-value">
            <div className="dc-value-main money">{euro(r.prix_estime)}</div>
            <div className="dc-value-range money">
              Fourchette estimative : {euro(r.fourchette_basse)} — {euro(r.fourchette_haute)}
            </div>
            {r.prix_m2 > 0 && <div className="dc-value-m2 money">Soit environ {euro(r.prix_m2)} / m²</div>}
          </div>
          <div className="dc-badges">
            <span className="dc-badge">Confiance {dossier.confiance}/100</span>
            <span className="dc-badge">Dossier complet à {dossier.completude} %</span>
            {r.fiabilite && <span className="dc-badge">Fiabilité des références : {r.fiabilite}</span>}
          </div>
        </div>

        {/* Couverture / bien */}
        <section className="dc-sec">
          <h2 className="dc-h2">Votre bien</h2>
          <div className="dc-bien">
            <div><span>Adresse</span><b>{b.adresse ? `${b.adresse}, ${b.ville}` : b.ville}</b></div>
            <div><span>Type</span><b>{b.typeBien === "maison" ? "Maison" : "Appartement"}</b></div>
            <div><span>Surface habitable</span><b>{b.surfaceHabitable ?? "—"} m²</b></div>
            {b.surfaceTerrain ? <div><span>Terrain</span><b>{b.surfaceTerrain} m²</b></div> : null}
            <div><span>Pièces</span><b>{b.nbPieces ?? "—"}</b></div>
            <div><span>Chambres</span><b>{b.nbChambres ?? "—"}</b></div>
            <div><span>État</span><b>{b.etat || "—"}</b></div>
          </div>
          {b.prestations.length > 0 && (
            <div className="facteurs" style={{ marginTop: 18 }}>
              {b.prestations.map((p) => <span key={p} className="facteur">{p}</span>)}
            </div>
          )}
        </section>

        {/* Photos */}
        {dossier.photos.length > 0 && (
          <section className="dc-sec">
            <h2 className="dc-h2">Vos photos</h2>
            <div className="thumbs">
              {dossier.photos.map((p) => (
                <div className="thumb" key={p.idx}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={urlPhoto(dossier.token, p.idx)} alt={`Photo ${p.idx + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Analyse du bien */}
        {r.description_bien && (
          <section className="dc-sec">
            <h2 className="dc-h2">Analyse de votre bien</h2>
            {r.description_bien.split("\n").filter(Boolean).map((p, i) => <p key={i} className="dc-p">{p}</p>)}
            <div className="grid cols-2" style={{ marginTop: 18 }}>
              {r.points_forts.length > 0 && (
                <div className="dc-list dc-forts"><h4>Points forts</h4><ul>{r.points_forts.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
              )}
              {r.points_faibles.length > 0 && (
                <div className="dc-list dc-faibles"><h4>Points de vigilance</h4><ul>{r.points_faibles.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
              )}
            </div>
          </section>
        )}

        {/* Analyse du marché */}
        {(r.analyse_dvf || r.positionnement_marche) && (
          <section className="dc-sec">
            <h2 className="dc-h2">Analyse du marché</h2>
            {r.analyse_dvf && <p className="dc-p">{r.analyse_dvf}</p>}
            {r.positionnement_marche && <p className="dc-p">{r.positionnement_marche}</p>}
            {(r.secteur_m2_bas ?? 0) > 0 && (
              <p className="dc-p dc-secteur">Autour de chez vous, les biens se vendent entre <b>{euro(r.secteur_m2_bas!)}</b> et <b>{euro(r.secteur_m2_haut!)}</b> le m² (avant correction de surface).</p>
            )}
          </section>
        )}

        {/* Références comparables */}
        {r.references_dvf.length > 0 && (
          <section className="dc-sec">
            <h2 className="dc-h2">Références comparables (ventes réelles)</h2>
            <div className="dc-refs">
              {r.references_dvf.map((ref, i) => (
                <div className="dc-ref" key={i}>
                  <div className="dc-ref-top"><b>{ref.localisation}</b><span className="money">{euro(ref.prix)}</span></div>
                  <div className="dc-ref-meta">{ref.detail} · {ref.date} · <span className="money">{new Intl.NumberFormat("fr-FR").format(ref.prix_m2)} €/m²</span></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Synthèse */}
        {r.argumentaire_vendeur && (
          <section className="dc-sec dc-synthese">
            <h2 className="dc-h2">Synthèse</h2>
            {r.argumentaire_vendeur.split("\n").filter(Boolean).map((p, i) => <p key={i} className="dc-p">{p}</p>)}
          </section>
        )}

        {/* Avertissement */}
        <section className="dc-sec dc-avert">
          <h4>Une estimation reste une estimation</h4>
          <p>Cette analyse constitue une indication de valeur fondée sur les informations que vous avez fournies et les données disponibles. Certaines caractéristiques particulières peuvent nécessiter l&apos;intervention d&apos;un professionnel afin d&apos;affiner la valeur de votre bien.</p>
        </section>

        {/* CTA */}
        <section className="dc-cta">
          <h3>Vous souhaitez affiner votre estimation ?</h3>
          <p>Un conseiller Century 21 Icaza peut confirmer cette valeur et vous accompagner dans votre projet.</p>
          <div className="cta-row" style={{ justifyContent: "center", marginTop: 20 }}>
            <button type="button" className="btn btn-gold btn-lg dc-noprint" onClick={rappeler} disabled={rappel !== "idle"}>
              {rappel === "ok" ? "✓ Nous vous rappelons" : rappel === "envoi" ? "Envoi…" : "Être rappelé par un conseiller"}
            </button>
            <button type="button" className="btn btn-ghost dc-noprint" onClick={() => window.print()}>Télécharger mon dossier (PDF)</button>
          </div>
        </section>

        <p className="dc-foot dc-noprint">Dossier établi le {dateFr(dossier.createdAt)} pour {nomComplet} — Century 21 Icaza Immobilier</p>
      </div>
    </main>
  );
}
