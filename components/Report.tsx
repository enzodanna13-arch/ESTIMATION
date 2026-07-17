"use client";

import { useMemo } from "react";
import { medianeReferences } from "@/lib/references";
import { surfaceDependancesHabitables, surfaceHabitableTotale } from "@/lib/surfaces";
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
  tel: process.env.NEXT_PUBLIC_AGENCE_TEL ?? "04 42 42 80 85",
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
    () => `EST-${year}-${String((Math.round(report.prix_estime % 9973) + Math.round(input.surfaceHabitable ?? 0)) % 10000).padStart(4, "0")}`,
    [year, report.prix_estime, input.surfaceHabitable],
  );

  const clientName = [input.clientCivilite, input.clientPrenom, input.clientNom].filter(Boolean).join(" ");
  const typeLabel =
    input.typeBien === "appartement" && input.nbPieces
      ? `Appartement T${input.nbPieces}`
      : input.typeBien.charAt(0).toUpperCase() + input.typeBien.slice(1) + (input.nbPieces ? ` ${input.nbPieces} pièces` : "");

  const prixPresentation = report.prix_presentation > 0 ? report.prix_presentation : report.prix_estime;
  // Fourchette de valeur du dossier = du prix « Vente rapide » au « Prix
  // optimal » : la synthèse est ainsi parfaitement cohérente avec les deux
  // scénarios présentés au client
  const scRapide = report.scenarios_prix.find((sc) => sc.strategie === "Vente rapide")?.prix ?? 0;
  const scOptimal = report.scenarios_prix.find((sc) => sc.strategie === "Prix optimal")?.prix ?? 0;
  const fourchetteBasse = scRapide > 0 ? scRapide : report.fourchette_basse;
  const fourchetteHaute = scOptimal > fourchetteBasse ? scOptimal : report.fourchette_haute;
  // Surface habitable TOTALE affichée dans le dossier = logement principal
  // + dépendances habitables (studio, T2/T3/T4, maison d'amis)
  const surfaceDeps = surfaceDependancesHabitables(input);
  const surface = surfaceHabitableTotale(input);
  const margeNego = report.prix_estime > 0 ? (((prixPresentation - report.prix_estime) / report.prix_estime) * 100).toFixed(1) : "0";

  const photoAnalyses = report.analyse_par_photo.filter((pa) => input.photos[pa.photo - 1]);

  // Références DVF + médiane — même définition que la base des ajustements
  // (lib/references.ts) : les pages Comparables et Prix retenu affichent
  // toujours le même chiffre
  const refs = report.references_dvf;
  const medPrix = medianeReferences(refs);

  // Ajustements regroupés : la médiane DVF est l'ancre, le prix évolue
  // ensuite par plus-values (atouts) et décotes (défauts, conjoncture)
  const plusValues = report.ajustements.filter((a) => a.montant >= 0);
  const decotes = report.ajustements.filter((a) => a.montant < 0);
  const totalPlus = plusValues.reduce((s, a) => s + a.montant, 0);
  const totalDecotes = decotes.reduce((s, a) => s + a.montant, 0);
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
    ...(input.dependances ?? []).map((d) => d.type),
    ...input.equipements.slice(0, 3),
  ].filter(Boolean) as string[];

  const specs: [string, string][] = (
    [
      ["Type", typeLabel],
      [surfaceDeps > 0 ? "Surface habitable totale" : "Surface habitable", `${surface} m²`],
      surfaceDeps > 0 ? ["Dont logement principal", `${input.surfaceHabitable ?? 0} m²`] : null,
      surfaceDeps > 0 ? ["Dont dépendances habitables", `${surfaceDeps} m²`] : null,
      input.surfaceTerrain ? ["Terrain", `${input.surfaceTerrain} m²`] : null,
      (input.dependances ?? []).length
        ? ["Dépendances", (input.dependances ?? []).map((d) => `${d.type}${d.surface ? ` ${d.surface} m²` : ""}`).join(", ")]
        : null,
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

  // Carte des ventes : le bien géocodé + les ventes DVF proches (lat/lon)
  const subject = result.subject ?? null;
  const mapSales = subject
    ? result.dvfSales
        .filter((s) => s.lat != null && s.lon != null && (s.distanceM ?? Infinity) <= 2500)
        .slice(0, 12)
    : [];
  const isRefSale = (s: (typeof mapSales)[number]) =>
    refs.some((r) => r.prix === s.valeurFonciere && r.surface === s.surface);
  const hasCarte = Boolean(subject && mapSales.length >= 2);

  // Numérotation des sections — certaines pages sont conditionnelles
  const hasPhotoPage = photoPages.length > 0;
  const hasVisuel = report.etat_notes.length > 0;
  const hasAjust = report.ajustements.length > 0 && report.base_mediane > 0;
  let sec = 0;
  const S = () => ROMANS[sec++];
  const secSynthese = S();
  const secBien = S();
  const secVisuel = hasVisuel ? S() : "";
  const secPhotos = hasPhotoPage ? S() : "";
  const secMethode = S();
  const secCarte = hasCarte ? S() : "";
  const secAjust = hasAjust ? S() : "";
  const secReco = S();
  const secSign = S();
  let pageNo = 1;
  const P = () => ++pageNo;
  const pgSynthese = P();
  const pgBien = P();
  const pgVisuel = hasVisuel ? P() : 0;
  const pgPhotos = hasPhotoPage ? P() : 0;
  for (let i = 1; i < photoPages.length; i++) P(); // pages photo supplémentaires
  const pgMethode = P();
  const pgCarte = hasCarte ? P() : 0;
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
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {input.negociateurPhoto && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={`data:${input.negociateurPhoto.mediaType};base64,${input.negociateurPhoto.data}`}
                  alt=""
                  style={{ width: "12mm", height: "12mm", borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(180, 151, 91, 0.7)", flexShrink: 0 }}
                />
              )}
              <div>
              <div className="lbl">Par</div>
              <div className="val">
                {input.negociateur || AGENCE.enseigne}
                {(input.negociateurTel || input.negociateurEmail) && (
                  <span style={{ display: "block", fontSize: "7.5pt", fontWeight: 400, color: "rgba(247, 244, 236, 0.62)", marginTop: 2 }}>
                    {[input.negociateurTel, input.negociateurEmail].filter(Boolean).join(" · ")}
                  </span>
                )}
              </div>
              </div>
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
                {euro.format(fourchetteBasse)} — {euro.format(fourchetteHaute)}
              </div>
            </div>
            <div className="cell">
              <div className="lbl">Prix de présentation</div>
              <div className="amt">{euro.format(prixPresentation)}</div>
            </div>
          </div>

          <div className="kpi-row">
            <div className="kpi"><div className="k">Surface</div><div className="v">{surface} <small>m²</small></div></div>
            <div className="kpi"><div className="k">Fourchette / m²</div><div className="v" style={{ fontSize: "12pt" }}>{surface > 0 ? `${int.format(Math.round(fourchetteBasse / surface))} – ${int.format(Math.round(fourchetteHaute / surface))}` : int.format(report.prix_m2)} <small>€/m²</small></div></div>
            <div className="kpi"><div className="k">DPE</div><div className="v">{input.dpe || "—"}</div></div>
            <div className="kpi"><div className="k">Délai de vente estimé</div><div className="v" style={{ fontSize: "11pt", lineHeight: 1.3 }}>{report.delai_vente_estime}</div></div>
          </div>

          <div className="callout">
            <b>Fourchette de valeur : {euro.format(fourchetteBasse)} à {euro.format(fourchetteHaute)}.
            Prix de présentation conseillé : {euro.format(prixPresentation)}.</b>{" "}
            Ce positionnement conserve une marge de négociation d&apos;environ {margeNego} % tout en
            restant cohérent avec les références de vente et la concurrence active du secteur.
            {input.prixSouhaiteVendeur ? (
              <>
                {" "}Prix que vous envisagez : <b>{euro.format(input.prixSouhaiteVendeur)}</b>{" "}
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
              Chaque photo de votre bien est examinée et notée par catégorie. Le résultat est
              ensuite traduit en euros dans le calcul de votre prix.
            </p>

            <div className="eyebrow" style={{ color: "var(--ink-45)" }}>État de votre bien — lecture des photographies</div>
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
                  ? "Chaque vue de votre bien est analysée : les atouts que nous mettrons en avant, et les points de vigilance à anticiper pour la vente."
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
              "La valeur de votre bien est établie à partir des ventes réellement conclues (données publiques DVF) de biens comparables, ajustées à ses caractéristiques propres."}
          </p>

          <div className="method">
            <div className="step">
              <div className="n">01</div>
              <h4>Sélection DVF</h4>
              <p>On part des ventes réellement conclues autour de chez vous (données publiques DVF) : même type de bien, surface proche, au plus près de votre adresse.</p>
            </div>
            <div className="step">
              <div className="n">02</div>
              <h4>Plus-values &amp; décotes</h4>
              <p>Chaque atout de votre bien ajoute de la valeur, chaque défaut ou effet du marché en retire, à partir de la médiane de ces ventes.</p>
            </div>
            <div className="step">
              <div className="n">03</div>
              <h4>Actualisation au marché</h4>
              <p>Le marché est actuellement en baisse : les ventes des années passées sont ramenées au prix d&apos;aujourd&apos;hui avant de fixer votre fourchette.</p>
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

        {/* ============ CARTE DES VENTES DE RÉFÉRENCE ============ */}
        {hasCarte && subject && (() => {
          const W = 700;
          const H = 370;
          const mPerDegLat = 110540;
          const mPerDegLon = 111320 * Math.cos((subject.lat * Math.PI) / 180);
          // Un point par bâtiment : les ventes d'une même adresse sont
          // regroupées (libellé « n ventes · min–max k€ »)
          const groups = new Map<string, { x: number; y: number; sales: typeof mapSales; ref: boolean }>();
          for (const sale of mapSales) {
            const x = ((sale.lon as number) - subject.lon) * mPerDegLon;
            const y = -((sale.lat as number) - subject.lat) * mPerDegLat;
            const key = `${Math.round(x / 25)}:${Math.round(y / 25)}`;
            const g = groups.get(key);
            if (g) {
              g.sales.push(sale);
              g.ref = g.ref || isRefSale(sale);
            } else {
              groups.set(key, { x, y, sales: [sale], ref: isRefSale(sale) });
            }
          }
          const pts = [...groups.values()];
          const extent = Math.max(150, ...pts.map((p) => Math.max(Math.abs(p.x), Math.abs(p.y)))) * 1.25;
          const scale = (Math.min(W, H) / 2 - 42) / extent;
          const cx = W / 2;
          const cy = H / 2;
          const rings = [250, 500, 1000, 2000].filter((r) => r * scale > 34 && r * scale < Math.min(W, H) / 2 - 6);
          const fmtRing = (r: number) => (r < 1000 ? `${r} m` : `${r / 1000} km`);
          return (
            <section className="page">
              <PageHead page={pgCarte} />
              <SectionTitle idx={secCarte} title="Où se situent les ventes de référence" />
              <p className="section-lead" style={{ marginBottom: 14 }}>
                Votre bien est au centre de la carte. Chaque point est une vente réellement conclue
                autour de chez vous, avec son prix : les points dorés sont les ventes retenues comme
                références pour votre estimation.
              </p>

              <svg
                viewBox={`0 0 ${W} ${H}`}
                style={{ width: "100%", border: "1px solid var(--line)", background: "var(--paper-card)" }}
              >
                {rings.map((r) => (
                  <g key={r}>
                    <circle cx={cx} cy={cy} r={r * scale} fill="none" stroke="var(--line)" strokeDasharray="4 5" />
                    <text x={cx + 6} y={cy - r * scale + 15} fontSize="11" fill="var(--ink-45)">
                      {fmtRing(r)}
                    </text>
                  </g>
                ))}
                {pts.map((p, idx) => {
                  const x = cx + p.x * scale;
                  const y = cy + p.y * scale;
                  const ref = p.ref;
                  const right = x <= W - 130;
                  const prix = p.sales.map((sa) => Math.round(sa.valeurFonciere / 1000)).sort((a, b) => a - b);
                  const label =
                    prix.length === 1
                      ? `${prix[0]} k€`
                      : `${prix.length} ventes · ${prix[0]}–${prix[prix.length - 1]} k€`;
                  // Étiquettes réparties au-dessus / au-dessous pour limiter
                  // les chevauchements dans les zones denses
                  const dy = idx % 2 === 0 ? -12 : 20;
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r={ref ? 7 : 4.5} fill={ref ? "var(--gold)" : "#b6ae9c"} stroke={ref ? "var(--ink)" : "none"} strokeWidth={ref ? 1.2 : 0} />
                      <text
                        x={right ? x + 10 : x - 10}
                        y={y + dy / 2 + 4}
                        fontSize={ref ? 12.5 : 11}
                        fontWeight={ref ? 700 : 400}
                        fill={ref ? "var(--ink)" : "var(--ink-45)"}
                        textAnchor={right ? "start" : "end"}
                        style={{ paintOrder: "stroke", stroke: "var(--paper-card)", strokeWidth: 3.5 }}
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}
                <circle cx={cx} cy={cy} r={10} fill="var(--gold-deep)" stroke="var(--paper)" strokeWidth={2.5} />
                <circle cx={cx} cy={cy} r={3.2} fill="var(--paper)" />
                <text x={cx} y={cy + 28} fontSize="13.5" fontWeight={700} fill="var(--ink)" textAnchor="middle" style={{ paintOrder: "stroke", stroke: "var(--paper-card)", strokeWidth: 3 }}>
                  Votre bien
                </text>
              </svg>

              <div style={{ display: "flex", gap: 22, marginTop: 12, fontSize: "9pt", color: "var(--ink-70)", flexWrap: "wrap" }}>
                <span><span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: "var(--gold-deep)", verticalAlign: "-2px", marginRight: 6 }} />Votre bien (au centre)</span>
                <span><span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: "var(--gold)", border: "1px solid var(--ink)", verticalAlign: "-2px", marginRight: 6 }} />Ventes retenues comme références</span>
                <span><span style={{ display: "inline-block", width: 9, height: 9, borderRadius: "50%", background: "#b6ae9c", verticalAlign: "-1px", marginRight: 6 }} />Autres ventes proches</span>
              </div>
              <p className="photo-note" style={{ marginTop: 8 }}>
                Positions issues des données publiques DVF géolocalisées (Etalab) et de la Base
                Adresse Nationale ; distances à vol d&apos;oiseau autour de votre bien.
              </p>

              <Foot left="Ventes réelles actées — données publiques Etalab" right={`Réf. ${refDossier}`} />
            </section>
          );
        })()}

        {/* ============ AJUSTEMENTS DE VALEUR ============ */}
        {hasAjust && (
          <section className="page">
            <PageHead page={pgAjust} />
            <SectionTitle idx={secAjust} title="Du marché au prix retenu" />
            <p className="section-lead">
              On part de la médiane des ventes comparables. On ajoute les atouts de votre bien, on
              retire ses défauts et l&apos;effet du marché : le résultat est le cœur de votre
              fourchette de valeur.
            </p>

            <div className="adjust">
              <div className="ar">
                <span><b>Médiane DVF de référence — ancre de valeur</b></span>
                <span className="money">{euro.format(report.base_mediane)}</span>
              </div>
              {plusValues.length > 0 && (
                <>
                  <div className="ar group">
                    <span>Plus-values — atouts du bien</span>
                    <span className="plus">+ {int.format(totalPlus)} €</span>
                  </div>
                  {plusValues.map((a, i) => (
                    <div key={`p${i}`} className="ar item">
                      <span>{a.libelle}</span>
                      <span className="plus">+ {int.format(a.montant)} €</span>
                    </div>
                  ))}
                </>
              )}
              {decotes.length > 0 && (
                <>
                  <div className="ar group">
                    <span>Décotes — défauts &amp; conjoncture</span>
                    <span className="minus">− {int.format(Math.abs(totalDecotes))} €</span>
                  </div>
                  {decotes.map((a, i) => (
                    <div key={`d${i}`} className="ar item">
                      <span>{a.libelle}</span>
                      <span className="minus">− {int.format(Math.abs(a.montant))} €</span>
                    </div>
                  ))}
                </>
              )}
              <div className="ar total">
                <span><b>Cœur de fourchette retenu</b></span>
                <span className="money">{euro.format(report.prix_estime)}</span>
              </div>
            </div>

            <div className="callout" style={{ marginTop: 20 }}>
              <b>Fourchette de valeur : {euro.format(fourchetteBasse)} à {euro.format(fourchetteHaute)}.</b>{" "}
              Le cœur de fourchette de {euro.format(report.prix_estime)} résulte de la médiane DVF
              corrigée des plus-values et décotes ci-dessus ; les bornes traduisent
              l&apos;incertitude résiduelle du marché (indice de confiance : {report.indice_confiance}/100).
            </div>

            <Foot left="Références DVF — données publiques Etalab, dernier millésime disponible" right={`Réf. ${refDossier}`} />
          </section>
        )}

        {/* ============ RECOMMANDATIONS ============ */}
        <section className="page">
          <PageHead page={pgReco} />
          <SectionTitle idx={secReco} title="Recommandations commerciales" />
          <div style={{ height: 14 }} />

          {report.scenarios_prix.filter((sc) => sc.strategie !== "Prix plafond").length >= 2 ? (
            /* Le « Prix plafond » sert au calcul (borne haute de la fourchette)
               mais n'apparaît pas dans le dossier : seuls Vente rapide et
               Prix optimal sont présentés au client */
            <div className="reco-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
              {report.scenarios_prix
                .filter((sc) => sc.strategie !== "Prix plafond")
                .slice(0, 2)
                .map((sc, i) => (
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
            Les points clés à retenir sur la valeur de votre bien, et votre accord sur la
            stratégie de commercialisation que nous vous proposons.
          </p>

          {report.argumentaire_vendeur && (() => {
            // Un argument par ligne « Titre — explication » : rendu en liste
            // aérée ; un texte d'un seul bloc (ancien format) reste en encadré
            const items = report.argumentaire_vendeur
              .split(/\n+/)
              .map((s) => s.replace(/^[\s•\-–]+/, "").trim())
              .filter(Boolean);
            if (items.length < 2) {
              return (
                <div className="callout">
                  <b>Argumentaire :</b> {report.argumentaire_vendeur}
                </div>
              );
            }
            return (
              <>
                <div className="eyebrow" style={{ color: "var(--ink-45)" }}>Les points clés à retenir</div>
                <hr className="rule" style={{ margin: "8px 0 2px" }} />
                <ul className="strategy">
                  {items.map((item, i) => {
                    const [titre, ...reste] = item.split("—");
                    return (
                      <li key={i}>
                        <b>{titre.trim()}</b>
                        {reste.length ? ` — ${reste.join("—").trim()}` : ""}
                      </li>
                    );
                  })}
                </ul>
              </>
            );
          })()}

          <div className="sign">
            <div className="box">
              <div className="lbl">Le négociateur</div>
              {input.negociateurPhoto && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={`data:${input.negociateurPhoto.mediaType};base64,${input.negociateurPhoto.data}`}
                  alt=""
                  style={{ width: "16mm", height: "16mm", borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--gold)", margin: "6px 0 4px" }}
                />
              )}
              <div className="name">{input.negociateur || "—"}</div>
              <div className="role">
                {AGENCE.nom} {AGENCE.enseigne}
                {(input.negociateurTel || input.negociateurEmail) &&
                  ` · ${[input.negociateurTel, input.negociateurEmail].filter(Boolean).join(" · ")}`}
              </div>
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
