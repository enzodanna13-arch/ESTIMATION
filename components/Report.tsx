"use client";

import { useMemo } from "react";
import type { EstimateResponse, PropertyInput } from "@/lib/types";

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const int = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

const AGENCE = {
  nom: process.env.NEXT_PUBLIC_AGENCE_NOM ?? "CENTURY 21",
  sceau: process.env.NEXT_PUBLIC_AGENCE_SCEAU ?? "21",
  enseigne: process.env.NEXT_PUBLIC_AGENCE_ENSEIGNE ?? "Icaza Immobilier",
  adresse: process.env.NEXT_PUBLIC_AGENCE_ADRESSE ?? "32 avenue de la Paix, 13500 Martigues",
  tel: process.env.NEXT_PUBLIC_AGENCE_TEL ?? "04 30 22 03 94",
  site: process.env.NEXT_PUBLIC_AGENCE_SITE ?? "icazaimmobilier.com",
};

function PageHead({ page }: { page: number }) {
  return (
    <div className="head">
      <span className="c21">{AGENCE.nom}</span>
      <span className="pg">Avis de valeur · {String(page).padStart(2, "0")}</span>
    </div>
  );
}

function SectionTitle({ idx, title }: { idx: string; title: string }) {
  return (
    <>
      <div className="section-title">
        <span className="idx">{idx}</span>
        <h2>{title}</h2>
      </div>
      <hr className="rule-gold" />
    </>
  );
}

function Foot({ left, right }: { left: string; right: string }) {
  return (
    <div className="foot">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

function Dots({ note }: { note: number }) {
  const n = Math.max(0, Math.min(5, Math.round(note)));
  return (
    <span className="dots">
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={i <= n ? "on" : ""} />
      ))}
    </span>
  );
}

const ROMANS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

export default function Report({
  result,
  input,
  onReset,
}: {
  result: EstimateResponse;
  input: PropertyInput;
  onReset: () => void;
}) {
  const { report, engine } = result;
  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const year = new Date().getFullYear();
  const refDossier = useMemo(
    () => `EST-${year}-${String(((report.prix_estime % 9973) + (input.surfaceHabitable ?? 0)) % 10000).padStart(4, "0")}`,
    [year, report.prix_estime, input.surfaceHabitable],
  );

  const clientName = [input.clientCivilite, input.clientPrenom, input.clientNom].filter(Boolean).join(" ");
  const typeLabel =
    input.typeBien === "appartement" && input.nbPieces
      ? `Appartement T${input.nbPieces}`
      : input.typeBien.charAt(0).toUpperCase() + input.typeBien.slice(1) + (input.nbPieces ? ` ${input.nbPieces} pièces` : "");

  const prixPresentation = report.prix_presentation > 0 ? report.prix_presentation : report.prix_estime;
  const surface = input.surfaceHabitable ?? 0;
  const margeNego = report.prix_estime > 0 ? (((prixPresentation - report.prix_estime) / report.prix_estime) * 100).toFixed(1) : "0";

  const photoAnalyses = report.analyse_par_photo.filter((pa) => input.photos[pa.photo - 1]);

  // Concurrence : barre de positionnement en €/m²
  const competitors = report.annonces_concurrentes;
  const compM2 = competitors.map((c) => c.prix_m2).filter((v) => v > 0);
  const ourM2 = surface > 0 ? Math.round(prixPresentation / surface) : report.prix_m2;
  const posMin = compM2.length ? Math.min(...compM2, ourM2) : 0;
  const posMax = compM2.length ? Math.max(...compM2, ourM2) : 0;
  const posPct = (v: number) =>
    posMax > posMin ? `${Math.round(((v - posMin) / (posMax - posMin)) * 92 + 4)}%` : "50%";
  const isStale = (a: (typeof competitors)[number]) =>
    /invendu|ancien|baiss|mois|re-?publi/i.test(`${a.anciennete} ${a.comparaison}`);

  // Références DVF + médiane
  const refs = report.references_dvf;
  const medPrix = refs.length
    ? [...refs.map((r) => r.prix)].sort((a, b) => a - b)[Math.floor(refs.length / 2)]
    : 0;
  const medM2 = refs.length
    ? [...refs.map((r) => r.prix_m2)].sort((a, b) => a - b)[Math.floor(refs.length / 2)]
    : 0;

  const tags = [
    ...(input.exterieur.length ? input.exterieur : []),
    input.vue && input.vue !== "Vis-à-vis important" ? `Vue ${input.vue.toLowerCase()}` : null,
    input.ascenseur ? "Ascenseur" : null,
    input.stationnement && input.stationnement !== "Aucun" ? input.stationnement : null,
    ...(input.exposition.length ? [input.exposition.join("-")] : []),
    input.cave ? "Cave" : null,
    ...input.equipements.slice(0, 3),
  ].filter(Boolean) as string[];

  const specs: [string, string][] = (
    [
      ["Type", typeLabel],
      ["Surface habitable", `${surface} m²`],
      input.surfaceTerrain ? ["Terrain", `${input.surfaceTerrain} m²`] : null,
      input.etage ? ["Étage / niveaux", input.etage + (input.ascenseur ? " (avec asc.)" : "")] : null,
      input.anneeConstruction ? ["Année", input.anneeConstruction] : null,
      input.nbChambres ? ["Chambres", String(input.nbChambres)] : null,
      input.stationnement ? ["Stationnement", input.stationnement] : null,
      input.dpe ? ["DPE / GES", `${input.dpe}${input.ges ? ` / ${input.ges}` : ""}`] : null,
      input.chauffage ? ["Chauffage", input.chauffage] : null,
      input.chargesCopro ? ["Charges copro", `${int.format(input.chargesCopro * 12)} € / an`] : null,
      input.taxeFonciere ? ["Taxe foncière", `${int.format(input.taxeFonciere)} €`] : null,
      input.etatGeneral ? ["État général", input.etatGeneral] : null,
    ] as ([string, string] | null)[]
  ).filter(Boolean) as [string, string][];

  // Découpage des fiches photo : 4 max par page (au-delà la grille dépasse
  // la hauteur A4), réparties équitablement pour éviter une dernière page
  // quasi vide (13 photos → 4+3+3+3 plutôt que 4+4+4+1)
  const photoPages: (typeof photoAnalyses)[] = [];
  if (photoAnalyses.length > 0) {
    const nPages = Math.ceil(photoAnalyses.length / 4);
    const base = Math.floor(photoAnalyses.length / nPages);
    let extra = photoAnalyses.length % nPages;
    let cursor = 0;
    for (let p = 0; p < nPages; p++) {
      const size = base + (extra-- > 0 ? 1 : 0);
      photoPages.push(photoAnalyses.slice(cursor, cursor + size));
      cursor += size;
    }
  }

  // Numérotation des sections — certaines pages sont conditionnelles
  const hasPhotoPage = photoPages.length > 0;
  const hasVisuel = report.etat_notes.length > 0;
  const hasAjust = report.ajustements.length > 0 && report.base_mediane > 0;
  const hasLecture = Boolean(
    report.audit_concurrentiel.nb_annonces_analysees > 0 ||
      report.audit_concurrentiel.synthese ||
      report.analyse_concurrence ||
      report.analyse_invendus,
  );
  let sec = 0;
  const S = () => ROMANS[sec++];
  const secSynthese = S();
  const secBien = S();
  const secVisuel = hasVisuel ? S() : "";
  const secConcur = S();
  const secLecture = hasLecture ? S() : "";
  const secPhotos = hasPhotoPage ? S() : "";
  const secMethode = S();
  const secAjust = hasAjust ? S() : "";
  const secReco = S();
  const secSign = S();
  let pageNo = 1;
  const P = () => ++pageNo;
  const pgSynthese = P();
  const pgBien = P();
  const pgVisuel = hasVisuel ? P() : 0;
  const pgConcur = P();
  const pgLecture = hasLecture ? P() : 0;
  const pgPhotos = hasPhotoPage ? P() : 0;
  for (let i = 1; i < photoPages.length; i++) P(); // pages photo supplémentaires
  const pgMethode = P();
  const pgAjust = hasAjust ? P() : 0;
  const pgReco = P();
  const pgSign = P();

  const footLeft = `${AGENCE.nom} ${AGENCE.enseigne} — ${AGENCE.adresse} · ${AGENCE.tel}`;

  return (
    <div>
      {/* Barre d'actions (écran uniquement) */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h2 className="text-2xl font-bold text-navy">Dossier d&apos;estimation</h2>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              engine === "ia" ? "bg-navy text-white" : "bg-amber-100 text-amber-700"
            }`}
          >
            {engine === "ia" ? "✦ Moteur IA + recherche web" : "Moteur statistique (clé IA non configurée)"}
          </span>
          <button onClick={() => window.print()} className="rounded-lg bg-copper px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110">
            📄 Exporter le dossier PDF
          </button>
          <button onClick={onReset} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
            Nouvelle estimation
          </button>
        </div>
      </div>

      <div className="dossier">
        {/* ============ COUVERTURE ============ */}
        <section className="page cover">
          <div className="frame" />
          <div className="cover-top">
            <div className="brand-seal">
              <div className="seal-mark">{AGENCE.sceau}</div>
              <div className="txt">
                <span className="c21">{AGENCE.nom}</span>
                <span className="sub">{AGENCE.enseigne} · {input.ville}</span>
              </div>
            </div>
            <div className="cover-ref">Réf. dossier<br />{refDossier}</div>
          </div>
          <div className="cover-center">
            <div className="eyebrow">Estimation confidentielle</div>
            <div className="cover-title">Avis<br />de Valeur</div>
            <div className="cover-addr">
              {typeLabel} — {surface} m²
              <span>
                {input.quartier ? `${input.quartier} · ` : `${input.adresse} · `}
                {input.codePostal} {input.ville}
              </span>
            </div>
          </div>
          <div className="cover-bottom">
            <div>
              <div className="lbl">Établi pour</div>
              <div className="val">{clientName || "—"}</div>
            </div>
            <div>
              <div className="lbl">Par</div>
              <div className="val">{input.negociateur || AGENCE.enseigne}</div>
            </div>
            <div>
              <div className="lbl">Date</div>
              <div className="val">{today}</div>
            </div>
          </div>
        </section>

        {/* ============ SYNTHÈSE ============ */}
        <section className="page">
          <PageHead page={pgSynthese} />
          <SectionTitle idx={secSynthese} title="Synthèse de l'estimation" />
          <p className="section-lead">{report.positionnement_marche}</p>

          <div className="valuation">
            <div className="cell">
              <div className="lbl">Prix moyen au m²</div>
              <div className="amt">{int.format(report.prix_m2)} €</div>
            </div>
            <div className="cell center">
              <div className="lbl">Fourchette de valeur</div>
              <div className="amt" style={{ fontSize: "21pt" }}>
                {euro.format(report.fourchette_basse)} — {euro.format(report.fourchette_haute)}
              </div>
            </div>
            <div className="cell">
              <div className="lbl">Prix de présentation</div>
              <div className="amt">{euro.format(prixPresentation)}</div>
            </div>
          </div>

          <div className="kpi-row">
            <div className="kpi"><div className="k">Surface</div><div className="v">{surface} <small>m²</small></div></div>
            <div className="kpi"><div className="k">Fourchette / m²</div><div className="v" style={{ fontSize: "12pt" }}>{surface > 0 ? `${int.format(Math.round(report.fourchette_basse / surface))} – ${int.format(Math.round(report.fourchette_haute / surface))}` : int.format(report.prix_m2)} <small>€/m²</small></div></div>
            <div className="kpi"><div className="k">DPE</div><div className="v">{input.dpe || "—"}</div></div>
            <div className="kpi"><div className="k">Délai de vente estimé</div><div className="v" style={{ fontSize: "11pt", lineHeight: 1.3 }}>{report.delai_vente_estime}</div></div>
          </div>

          <div className="callout">
            <b>Fourchette de valeur : {euro.format(report.fourchette_basse)} à {euro.format(report.fourchette_haute)}.
            Prix de présentation conseillé : {euro.format(prixPresentation)}.</b>{" "}
            Ce positionnement conserve une marge de négociation d&apos;environ {margeNego} % tout en
            restant cohérent avec les références de vente et la concurrence active du secteur.
            {input.prixSouhaiteVendeur ? (
              <>
                {" "}Prix envisagé par le vendeur : <b>{euro.format(input.prixSouhaiteVendeur)}</b>{" "}
                ({input.prixSouhaiteVendeur > report.prix_estime ? "+" : ""}
                {(((input.prixSouhaiteVendeur - report.prix_estime) / report.prix_estime) * 100).toFixed(1)} % vs valeur retenue).
              </>
            ) : null}
          </div>

          <Foot left={footLeft} right="Document confidentiel · sans valeur d'expertise judiciaire" />
        </section>

        {/* ============ LE BIEN ============ */}
        <section className="page">
          <PageHead page={pgBien} />
          <SectionTitle idx={secBien} title="Le bien" />
          <div style={{ height: 22 }} />
          <div className="split">
            <div className="prose">
              <h3>Description</h3>
              {report.description_bien ? (
                <p>{report.description_bien}</p>
              ) : (
                <p>
                  {typeLabel} de {surface} m² situé {input.adresse}, {input.codePostal} {input.ville}
                  {input.quartier ? ` (${input.quartier})` : ""}.{" "}
                  {input.etatGeneral ? `État général : ${input.etatGeneral.toLowerCase()}. ` : ""}
                  {input.commentaires}
                </p>
              )}
              <div className="tags">
                {tags.map((t, i) => (
                  <span key={i} className="tag">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="specs">
                {specs.map(([k, v]) => (
                  <div key={k} className="row"><span className="k">{k}</span><span className="v">{v}</span></div>
                ))}
              </div>
            </div>
          </div>

          {(report.points_forts.length > 0 || report.points_faibles.length > 0) && (
            <div className="pol">
              <div className="box">
                <h4>Points valorisants</h4>
                <ul>
                  {report.points_forts.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="box neg">
                <h4>Points de vigilance</h4>
                <ul>
                  {report.points_faibles.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <Foot left={`${AGENCE.nom} ${AGENCE.enseigne}`} right={`Réf. ${refDossier}`} />
        </section>

        {/* ============ ANALYSE VISUELLE (état du bien) ============ */}
        {hasVisuel && (
          <section className="page">
            <PageHead page={pgVisuel} />
            <SectionTitle idx={secVisuel} title="Analyse visuelle du bien" />
            <p className="section-lead">
              L&apos;état du bien est évalué à partir des photographies fournies : chaque catégorie est
              notée, puis traduite en un coefficient d&apos;état chiffré, intégré aux ajustements de
              valeur de la section « Méthodologie &amp; comparables ».
            </p>

            <div className="eyebrow" style={{ color: "var(--ink-45)" }}>État du bien — lecture des photographies</div>
            <hr className="rule" style={{ margin: "8px 0 2px" }} />
            <div className="cond">
              {report.etat_notes.map((n, i) => (
                <div key={i} className="cr">
                  <span className="lab">{n.categorie}</span>
                  <Dots note={n.note} />
                </div>
              ))}
            </div>
            <div className="cond-synth">
              <span className="l">Coefficient d&apos;état retenu</span>
              <span className="r">
                {report.coefficient_etat || "—"}
                {report.impact_etat !== 0
                  ? ` · impact net ${report.impact_etat > 0 ? "+" : "−"} ${int.format(Math.abs(report.impact_etat))} €`
                  : ""}
              </span>
            </div>
            <p className="photo-note">
              Analyse indicative issue des visuels transmis ; ne se substitue pas au constat sur place
              effectué lors du rendez-vous d&apos;estimation.
            </p>

            {report.analyse_photos && (
              <>
                <div style={{ height: 14 }} />
                <div className="eyebrow" style={{ color: "var(--ink-45)" }}>Synthèse du reportage photo</div>
                <hr className="rule" style={{ margin: "8px 0 6px" }} />
                <p style={{ fontSize: "9.5pt", color: "var(--ink-70)" }}>{report.analyse_photos}</p>
              </>
            )}

            <Foot left={`${AGENCE.nom} ${AGENCE.enseigne}`} right={`Réf. ${refDossier}`} />
          </section>
        )}

        {/* ============ CONCURRENCE & POSITIONNEMENT ============ */}
        <section className="page">
          <PageHead page={pgConcur} />
          <SectionTitle idx={secConcur} title="Concurrence & positionnement" />
          <p className="section-lead" style={{ marginBottom: 12 }}>
            Les biens concurrents affichés sur le marché — relevés automatiquement sur le web —
            servent au positionnement commercial ; ils ne fondent jamais la valeur, établie par les
            mutations réelles.
          </p>

          {competitors.length === 0 && (
            <>
              <div className="eyebrow" style={{ color: "var(--ink-45)" }}>
                Concurrence directe — annonces vives équivalentes (prix affichés)
              </div>
              <hr className="rule" style={{ margin: "8px 0 4px" }} />
              <p style={{ fontSize: "9.5pt", color: "var(--ink-70)", margin: "10px 0 0" }}>
                Le relevé automatique des annonces concurrentes n&apos;a pas abouti lors de cette
                analyse. Le positionnement s&apos;appuie donc intégralement sur les ventes réelles
                actées (DVF) présentées en section suivante — la base la plus fiable pour établir
                la valeur. Un relevé de la concurrence active pourra être joint lors du
                rendez-vous d&apos;estimation.
              </p>
            </>
          )}

          {competitors.length > 0 && (
            <>
              <div className="eyebrow" style={{ color: "var(--ink-45)" }}>
                Concurrence directe — annonces vives équivalentes (prix affichés)
              </div>
              <hr className="rule" style={{ margin: "8px 0 4px" }} />
              <table>
                <thead>
                  <tr>
                    <th>Bien concurrent en vente</th>
                    <th className="r">Surface</th>
                    <th className="r">Prix affiché</th>
                    <th className="r">€ / m²</th>
                    <th className="r">Ancienneté</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.slice(0, 6).map((a, i) => (
                    <tr key={i} className={isStale(a) ? "warn-row" : ""}>
                      <td>
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          {a.url_photo && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={a.url_photo}
                              alt=""
                              style={{ width: 56, height: 40, objectFit: "cover", flexShrink: 0, border: "1px solid var(--line)" }}
                              onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                          )}
                          <div>
                            {a.url_annonce ? (
                              <a href={a.url_annonce} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>{a.titre}</a>
                            ) : (
                              a.titre
                            )}
                            <span className="sub">
                              {a.positionnement ? `${a.positionnement.charAt(0).toUpperCase()}${a.positionnement.slice(1)} · ` : ""}
                              {a.comparaison || a.source}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="r">{a.surface > 0 ? `${int.format(a.surface)} m²` : "—"}</td>
                      <td className="r">{a.prix > 0 ? <span className="money">{euro.format(a.prix)}</span> : "—"}</td>
                      <td className="r">{a.prix_m2 > 0 ? int.format(a.prix_m2) : "—"}</td>
                      <td className="r">{a.anciennete || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {compM2.length >= 2 && posMax > posMin && (
                <div className="posbar">
                  <div className="track">
                    <div className="range" style={{ left: 0, right: 0 }} />
                    <div className="mark" style={{ left: posPct(posMin) }} />
                    <div className="ptag top" style={{ left: posPct(posMin) }}>{int.format(posMin)} €/m²</div>
                    <div className="mark" style={{ left: posPct(posMax) }} />
                    <div className="ptag top" style={{ left: posPct(posMax) }}>{int.format(posMax)} €/m²</div>
                    <div className="mark us" style={{ left: posPct(ourM2) }} />
                    <div className="ptag bot" style={{ left: posPct(ourM2) }}>
                      Notre prix conseillé · {euro.format(prixPresentation)}
                    </div>
                  </div>
                  <div className="ends"><span>Bas du marché affiché</span><span>Haut du marché affiché</span></div>
                </div>
              )}
            </>
          )}

          <Foot left="Prix affichés — non actés · usage strictement indicatif" right={`Réf. ${refDossier}`} />
        </section>

        {/* ============ LECTURE DU MARCHÉ (audit chiffré) ============ */}
        {hasLecture && (
          <section className="page">
            <PageHead page={pgLecture} />
            <SectionTitle idx={secLecture} title="Lecture du marché" />
            <p className="section-lead" style={{ marginBottom: 14 }}>
              Synthèse chiffrée de l&apos;audit concurrentiel : niveaux de prix affichés, tension du
              marché et enseignements des annonces qui stagnent, intégrés au positionnement retenu.
            </p>

            {report.audit_concurrentiel.nb_annonces_analysees > 0 && (
              <>
                <div className="eyebrow" style={{ color: "var(--ink-45)" }}>Audit du marché — chiffres clés</div>
                <hr className="rule" style={{ margin: "8px 0 8px" }} />
                <div className="kpi-row" style={{ marginBottom: 12 }}>
                  <div className="kpi"><div className="k">Annonces analysées</div><div className="v">{report.audit_concurrentiel.nb_annonces_analysees}</div></div>
                  <div className="kpi"><div className="k">€/m² plancher</div><div className="v" style={{ fontSize: "13pt" }}>{report.audit_concurrentiel.prix_m2_min > 0 ? int.format(report.audit_concurrentiel.prix_m2_min) : "—"}</div></div>
                  <div className="kpi"><div className="k">€/m² médian</div><div className="v" style={{ fontSize: "13pt" }}>{report.audit_concurrentiel.prix_m2_median > 0 ? int.format(report.audit_concurrentiel.prix_m2_median) : "—"}</div></div>
                  <div className="kpi"><div className="k">€/m² plafond</div><div className="v" style={{ fontSize: "13pt" }}>{report.audit_concurrentiel.prix_m2_max > 0 ? int.format(report.audit_concurrentiel.prix_m2_max) : "—"}</div></div>
                </div>
                {report.audit_concurrentiel.tension_marche && (
                  <p style={{ fontSize: "9.5pt", color: "var(--ink-70)", marginBottom: 10 }}>
                    <b style={{ color: "var(--ink)" }}>Tension du marché :</b> {report.audit_concurrentiel.tension_marche}
                  </p>
                )}
              </>
            )}

            {report.analyse_concurrence && (
              <>
                <div className="eyebrow" style={{ color: "var(--ink-45)", marginTop: 6 }}>Concurrence active</div>
                <hr className="rule" style={{ margin: "8px 0 6px" }} />
                <p style={{ fontSize: "9.5pt", color: "var(--ink-70)", marginBottom: 10 }}>{report.analyse_concurrence}</p>
              </>
            )}

            {report.analyse_invendus && (
              <>
                <div className="eyebrow" style={{ color: "var(--ink-45)", marginTop: 6 }}>Invendus & plafond de marché</div>
                <hr className="rule" style={{ margin: "8px 0 6px" }} />
                <p style={{ fontSize: "9.5pt", color: "var(--ink-70)", marginBottom: 10 }}>{report.analyse_invendus}</p>
              </>
            )}

            {report.audit_concurrentiel.synthese && (
              <div className="callout" style={{ marginTop: 8 }}>
                <b>Zone de prix gagnante :</b> {report.audit_concurrentiel.synthese}
              </div>
            )}

            <Foot left="Prix affichés — non actés · usage strictement indicatif" right={`Réf. ${refDossier}`} />
          </section>
        )}

        {/* ============ LE BIEN EN IMAGES (6 fiches par page) ============ */}
        {photoPages.map((chunk, pageIdx) => (
          <section className="page" key={`photos-${pageIdx}`}>
            <PageHead page={pgPhotos + pageIdx} />
            <SectionTitle
              idx={secPhotos}
              title={pageIdx === 0 ? "Le bien en images" : "Le bien en images (suite)"}
            />
            {pageIdx === 0 && (
              <p className="section-lead" style={{ marginBottom: 14 }}>
                {hasVisuel
                  ? "Chaque vue est analysée : atouts à valoriser et points de vigilance à anticiper pour la commercialisation."
                  : report.analyse_photos}
              </p>
            )}
            {pageIdx > 0 && <div style={{ height: 18 }} />}
            <div className="photo-grid">
              {chunk.map((pa) => {
                const photo = input.photos[pa.photo - 1];
                return (
                  <div key={pa.photo} className="photo-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`data:${photo.mediaType};base64,${photo.data}`} alt={pa.titre} />
                    <div className="pc-body">
                      <div className="pc-title">{pa.titre}</div>
                      <ul>
                        {pa.bons_points.slice(0, 3).map((b, i) => (
                          <li key={`b${i}`} className="plus">{b}</li>
                        ))}
                        {pa.defauts.slice(0, 3).map((d, i) => (
                          <li key={`d${i}`} className="moins">{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
            <Foot left={`${AGENCE.nom} ${AGENCE.enseigne}`} right={`Réf. ${refDossier}`} />
          </section>
        ))}

        {/* ============ MÉTHODOLOGIE & COMPARABLES ============ */}
        <section className="page">
          <PageHead page={pgMethode} />
          <SectionTitle idx={secMethode} title="Méthodologie & comparables" />
          <p className="section-lead">
            {report.analyse_dvf ||
              "La valeur est établie à partir des ventes réelles actées (données publiques DVF) de biens comparables sur la commune, ajustées aux caractéristiques propres du bien."}
          </p>

          <div className="method">
            <div className="step">
              <div className="n">01</div>
              <h4>Sélection DVF</h4>
              <p>Ventes réelles actées de biens comparables (typologie, surface, secteur) issues des données publiques DVF.</p>
            </div>
            <div className="step">
              <div className="n">02</div>
              <h4>Ajustement</h4>
              <p>Corrections pour surface, étage, extérieur, énergie et vue, complétées par le coefficient d&apos;état issu des photos.</p>
            </div>
            <div className="step">
              <div className="n">03</div>
              <h4>Positionnement</h4>
              <p>Confrontation à la concurrence active et aux invendus +90 jours, à titre indicatif, jamais comme fondement de la valeur.</p>
            </div>
          </div>

          {refs.length > 0 && (
            <>
              <div style={{ height: 26 }} />
              <div className="eyebrow" style={{ color: "var(--ink-45)" }}>Références de vente retenues — source DVF</div>
              <hr className="rule" style={{ margin: "8px 0 4px" }} />
              <table>
                <thead>
                  <tr>
                    <th>Bien comparable</th>
                    <th className="r">Surface</th>
                    <th className="r">Date</th>
                    <th className="r">Prix acté</th>
                    <th className="r">€ / m²</th>
                  </tr>
                </thead>
                <tbody>
                  {refs.map((r, i) => (
                    <tr key={i}>
                      <td>{r.localisation}<span className="sub">{r.detail}</span></td>
                      <td className="r">{int.format(r.surface)} m²</td>
                      <td className="r">{r.date}</td>
                      <td className="r"><span className="money">{euro.format(r.prix)}</span></td>
                      <td className="r">{int.format(r.prix_m2)}</td>
                    </tr>
                  ))}
                  <tr className="median-row">
                    <td>Médiane des références</td>
                    <td className="r">—</td>
                    <td className="r">—</td>
                    <td className="r"><span className="money">{euro.format(medPrix)}</span></td>
                    <td className="r">{int.format(medM2)}</td>
                  </tr>
                </tbody>
              </table>
            </>
          )}

          <Foot left="Références DVF — données publiques Etalab, dernier millésime disponible" right={`Réf. ${refDossier}`} />
        </section>

        {/* ============ AJUSTEMENTS DE VALEUR ============ */}
        {hasAjust && (
          <section className="page">
            <PageHead page={pgAjust} />
            <SectionTitle idx={secAjust} title="Du marché au prix retenu" />
            <p className="section-lead">
              À partir de la base médiane des références comparables, chaque caractéristique propre du
              bien — positive ou négative — est traduite en une correction chiffrée. La somme de ces
              ajustements aboutit au cœur de fourchette retenu.
            </p>

            <div className="adjust">
              <div className="ar">
                <span>Base médiane comparables ({surface} m²)</span>
                <span className="money">{euro.format(report.base_mediane)}</span>
              </div>
              {report.ajustements.map((a, i) => (
                <div key={i} className="ar">
                  <span>{a.libelle}</span>
                  <span className={a.montant >= 0 ? "plus" : "minus"}>
                    {a.montant >= 0 ? "+" : "−"} {int.format(Math.abs(a.montant))} €
                  </span>
                </div>
              ))}
              <div className="ar total">
                <span><b>Cœur de fourchette retenu</b></span>
                <span className="money">{euro.format(report.prix_estime)}</span>
              </div>
            </div>

            <div className="callout" style={{ marginTop: 20 }}>
              <b>Fourchette de valeur : {euro.format(report.fourchette_basse)} à {euro.format(report.fourchette_haute)}.</b>{" "}
              Le cœur de fourchette de {euro.format(report.prix_estime)} résulte des corrections
              ci-dessus ; les bornes traduisent l&apos;incertitude résiduelle du marché
              (indice de confiance : {report.indice_confiance}/100).
            </div>

            <Foot left="Références DVF — données publiques Etalab, dernier millésime disponible" right={`Réf. ${refDossier}`} />
          </section>
        )}

        {/* ============ RECOMMANDATIONS ============ */}
        <section className="page">
          <PageHead page={pgReco} />
          <SectionTitle idx={secReco} title="Recommandations commerciales" />
          <div style={{ height: 20 }} />

          {report.scenarios_prix.length >= 3 ? (
            <div className="reco-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {report.scenarios_prix.slice(0, 3).map((sc, i) => (
                <div key={i} className="reco" style={sc.strategie === "Prix optimal" ? { borderColor: "var(--gold)", borderWidth: 2 } : undefined}>
                  <div className="t">{sc.strategie}{sc.strategie === "Prix optimal" ? " ★" : ""}</div>
                  <div className="big" style={{ fontSize: "20pt" }}>{euro.format(sc.prix)}</div>
                  <p style={{ marginBottom: 6 }}><b style={{ color: "var(--ink)" }}>Délai : {sc.delai}</b></p>
                  <p>{sc.commentaire}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="reco-grid">
              <div className="reco">
                <div className="t">Prix de présentation</div>
                <div className="big">{euro.format(prixPresentation)}</div>
                <p>
                  Positionnement offrant une marge de négociation d&apos;environ {margeNego} % tout en
                  restant crédible face aux dernières ventes du secteur.
                </p>
              </div>
              <div className="reco">
                <div className="t">Délai estimé</div>
                <div className="big" style={{ fontSize: "17pt" }}>{report.delai_vente_estime}</div>
                <p>Sur la base des délais observés pour cette typologie au prix conseillé, hors saisonnalité défavorable.</p>
              </div>
            </div>
          )}

          {report.etapes_commercialisation.length > 0 && (
            <>
              <div style={{ height: 22 }} />
              <div className="eyebrow" style={{ color: "var(--ink-45)" }}>Stratégie de mise en marché</div>
              <hr className="rule" style={{ margin: "8px 0 2px" }} />
              <ul className="strategy">
                {report.etapes_commercialisation.map((e, i) => {
                  const [titre, ...reste] = e.split("—");
                  return (
                    <li key={i}>
                      <b>{titre.trim()}</b>
                      {reste.length ? ` — ${reste.join("—").trim()}` : ""}
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          <Foot left={footLeft} right={`Réf. ${refDossier}`} />
        </section>

        {/* ============ ARGUMENTAIRE & BON POUR ACCORD ============ */}
        <section className="page">
          <PageHead page={pgSign} />
          <SectionTitle idx={secSign} title="Argumentaire & accord" />
          <p className="section-lead" style={{ marginBottom: 14 }}>
            Les éléments chiffrés à présenter au vendeur pour valider le positionnement retenu, et
            l&apos;accord sur la stratégie de commercialisation.
          </p>

          {report.argumentaire_vendeur && (
            <div className="callout">
              <b>Argumentaire :</b> {report.argumentaire_vendeur}
            </div>
          )}

          <div className="sign">
            <div className="box">
              <div className="lbl">Le négociateur</div>
              <div className="name">{input.negociateur || "—"}</div>
              <div className="role">{AGENCE.nom} {AGENCE.enseigne}</div>
            </div>
            <div className="box">
              <div className="lbl">Bon pour accord — le vendeur</div>
              <div className="name">&nbsp;</div>
              <div className="role">Signature précédée de la mention « lu et approuvé »</div>
            </div>
          </div>

          <div className="legal">
            Le présent avis de valeur est établi à titre indicatif à la demande du propriétaire. Il ne
            constitue ni une expertise au sens de la charte de l&apos;expertise en évaluation
            immobilière, ni une garantie de prix de vente. La valeur exprimée reflète les conditions du
            marché à la date d&apos;établissement et les éléments déclarés par le propriétaire, non
            vérifiés contradictoirement. {AGENCE.nom} {AGENCE.enseigne} — {AGENCE.adresse} —{" "}
            {AGENCE.tel} — {AGENCE.site}.
          </div>

          <Foot left={`${footLeft} · ${AGENCE.site}`} right={`Réf. ${refDossier} · ${today}`} />
        </section>
      </div>
    </div>
  );
}
