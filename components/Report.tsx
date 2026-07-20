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

function PageHead({ page, label = "Avis de valeur" }: { page: number; label?: string }) {
  return (
    <div className="head">
      <span className="c21">{AGENCE.nom}</span>
      <span className="pg">{label} · {String(page).padStart(2, "0")}</span>
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

  const mission = input.mission ?? "vente";
  const locatif = mission === "locatif";
  const audit = mission === "audit";
  const bienloue = mission === "bienloue";
  const docLabel = audit ? "Audit de commercialisation" : locatif ? "Estimation locative" : bienloue ? "Estimation bien loué" : "Avis de valeur";
  // Bien vendu loué : le prix est la capitalisation du loyer net annuel
  // (loyer − charges non récupérables − taxe foncière) entre 6 et 8 % net
  const loyerBrutAnnuel = (input.loyerActuel ?? 0) * 12;
  const chargesInvestisseur = (input.chargesNonRecuperables ?? 0) + (input.taxeFonciere ?? 0);
  const loyerNetAnn = Math.max(0, Math.round(loyerBrutAnnuel - chargesInvestisseur));
  // En mission locative, tous les montants principaux sont des loyers €/mois
  const fmtP = (v: number) => `${euro.format(v)}${locatif ? " /mois" : ""}`;
  const fmtM2 = (v: number) =>
    locatif ? v.toLocaleString("fr-FR", { maximumFractionDigits: 1 }) : int.format(v);

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

  // Numérotation des sections — certaines pages sont conditionnelles
  const hasPhotoPage = photoPages.length > 0;
  const hasVisuel = report.etat_notes.length > 0;
  const hasAjust = report.ajustements.length > 0 && report.base_mediane > 0;
  const recosAnnonce = report.recommandations_annonce ?? [];
  const hasAuditAnnonce = audit && (recosAnnonce.length > 0 || Boolean(report.analyse_annonce));
  let sec = 0;
  const S = () => ROMANS[sec++];
  const secSynthese = S();
  const secBien = S();
  const secAnnonce = hasAuditAnnonce ? S() : "";
  const secVisuel = hasVisuel ? S() : "";
  const secPhotos = hasPhotoPage ? S() : "";
  const secMethode = S();
  const secAjust = hasAjust ? S() : "";
  const secReco = S();
  const secSign = S();
  let pageNo = 1;
  const P = () => ++pageNo;
  const pgSynthese = P();
  const pgBien = P();
  const pgAnnonce = hasAuditAnnonce ? P() : 0;
  const pgVisuel = hasVisuel ? P() : 0;
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
            <div className="eyebrow">
              {audit ? "Audit confidentiel" : locatif ? "Estimation locative confidentielle" : bienloue ? "Estimation confidentielle · bien vendu loué" : "Estimation confidentielle"}
            </div>
            <div className="cover-title" style={audit ? { fontSize: "40pt" } : bienloue ? { fontSize: "44pt" } : undefined}>
              {audit ? (
                <>Audit de<br />Commercialisation</>
              ) : locatif ? (
                <>Estimation<br />Locative</>
              ) : bienloue ? (
                <>Valeur<br />Investisseur</>
              ) : (
                <>Avis<br />de Valeur</>
              )}
            </div>
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
          <PageHead page={pgSynthese} label={docLabel} />
          <SectionTitle idx={secSynthese} title="Synthèse de l'estimation" />
          <p className="section-lead">{report.positionnement_marche}</p>

          <div className="valuation">
            <div className="cell">
              <div className="lbl">{locatif ? "Loyer au m²" : "Prix moyen au m²"}</div>
              <div className="amt">{fmtM2(report.prix_m2)} €</div>
            </div>
            <div className="cell center">
              <div className="lbl">{locatif ? "Fourchette de loyer" : "Fourchette de valeur"}</div>
              <div className="amt" style={{ fontSize: locatif ? "18pt" : "21pt" }}>
                {euro.format(fourchetteBasse)} — {fmtP(fourchetteHaute)}
              </div>
            </div>
            <div className="cell">
              <div className="lbl">{locatif ? "Loyer conseillé" : "Prix de présentation"}</div>
              <div className="amt">{fmtP(prixPresentation)}</div>
            </div>
          </div>

          <div className="kpi-row">
            <div className="kpi"><div className="k">Surface</div><div className="v">{surface} <small>m²</small></div></div>
            <div className="kpi"><div className="k">{locatif ? "Loyer / m²" : "Fourchette / m²"}</div><div className="v" style={{ fontSize: "12pt" }}>{surface > 0 ? `${fmtM2(locatif ? fourchetteBasse / surface : Math.round(fourchetteBasse / surface))} – ${fmtM2(locatif ? fourchetteHaute / surface : Math.round(fourchetteHaute / surface))}` : fmtM2(report.prix_m2)} <small>€/m²</small></div></div>
            <div className="kpi"><div className="k">DPE</div><div className="v">{input.dpe || "—"}</div></div>
            <div className="kpi"><div className="k">{locatif ? "Délai de mise en location" : audit ? "Délai après repositionnement" : "Délai de vente estimé"}</div><div className="v" style={{ fontSize: "11pt", lineHeight: 1.3 }}>{report.delai_vente_estime}</div></div>
          </div>

          {audit && (
            <>
              <div className="eyebrow" style={{ color: "var(--ink-45)" }}>Situation actuelle de la mise en vente</div>
              <hr className="rule" style={{ margin: "8px 0 8px" }} />
              <div className="kpi-row" style={{ marginBottom: 14 }}>
                <div className="kpi"><div className="k">Prix affiché</div><div className="v" style={{ fontSize: "13pt" }}>{input.prixAffiche ? euro.format(input.prixAffiche) : "—"}</div></div>
                <div className="kpi"><div className="k">En vente depuis</div><div className="v" style={{ fontSize: "13pt" }}>{input.moisEnVente ? `${input.moisEnVente} mois` : "—"}</div></div>
                <div className="kpi"><div className="k">Visites</div><div className="v" style={{ fontSize: "13pt" }}>{input.nbVisites ?? "—"}</div></div>
                <div className="kpi"><div className="k">Offres reçues</div><div className="v" style={{ fontSize: "13pt" }}>{input.nbOffres ?? "—"}</div></div>
              </div>
            </>
          )}

          {bienloue && loyerNetAnn > 0 && (
            <>
              <div className="eyebrow" style={{ color: "var(--ink-45)" }}>Location en place — la base du calcul</div>
              <hr className="rule" style={{ margin: "8px 0 8px" }} />
              <div className="kpi-row" style={{ marginBottom: 14 }}>
                <div className="kpi"><div className="k">Loyer perçu</div><div className="v" style={{ fontSize: "13pt" }}>{euro.format(input.loyerActuel ?? 0)} <small>/mois</small></div></div>
                <div className="kpi"><div className="k">Charges + taxe foncière</div><div className="v" style={{ fontSize: "13pt" }}>{euro.format(chargesInvestisseur)} <small>/an</small></div></div>
                <div className="kpi"><div className="k">Loyer net annuel</div><div className="v" style={{ fontSize: "13pt" }}>{euro.format(loyerNetAnn)}</div></div>
                <div className="kpi"><div className="k">Rentabilité nette visée</div><div className="v" style={{ fontSize: "13pt" }}>6 – 8 %</div></div>
              </div>
            </>
          )}

          <div className="callout">
            <b>{locatif ? "Fourchette de loyer" : "Fourchette de valeur"} : {euro.format(fourchetteBasse)} à {fmtP(fourchetteHaute)}.
            {" "}{locatif ? "Loyer conseillé" : audit ? "Prix de relance conseillé" : "Prix de présentation conseillé"} : {fmtP(prixPresentation)}.</b>{" "}
            {locatif
              ? "Ce positionnement loue dans de bons délais tout en restant au niveau du marché locatif constaté sur la commune."
              : bienloue && loyerNetAnn > 0
                ? ` Prix établis par capitalisation du loyer net annuel de ${euro.format(loyerNetAnn)} à une rentabilité nette de 6 à 8 % : c'est ainsi que raisonne l'acheteur investisseur d'un bien loué.`
                : "Ce positionnement conserve une marge de négociation d'environ " + margeNego + " % tout en restant cohérent avec les références de vente du secteur."}
            {audit && input.prixAffiche ? (
              <>
                {" "}Prix affiché actuellement : <b>{euro.format(input.prixAffiche)}</b>{" "}
                ({input.prixAffiche > fourchetteHaute ? "+" : ""}
                {(((input.prixAffiche - fourchetteHaute) / fourchetteHaute) * 100).toFixed(1)} % au-dessus du haut de fourchette).
              </>
            ) : null}
            {!audit && !locatif && input.prixSouhaiteVendeur ? (
              <>
                {" "}Prix que vous envisagez : <b>{euro.format(input.prixSouhaiteVendeur)}</b>{" "}
                ({input.prixSouhaiteVendeur > report.prix_estime ? "+" : ""}
                {(((input.prixSouhaiteVendeur - report.prix_estime) / report.prix_estime) * 100).toFixed(1)} % vs valeur retenue).
              </>
            ) : null}
            {locatif && input.loyerSouhaite ? (
              <>
                {" "}Loyer que vous envisagez : <b>{euro.format(input.loyerSouhaite)} /mois</b>{" "}
                ({input.loyerSouhaite > report.prix_estime ? "+" : ""}
                {report.prix_estime > 0 ? (((input.loyerSouhaite - report.prix_estime) / report.prix_estime) * 100).toFixed(1) : "0"} % vs loyer retenu).
              </>
            ) : null}
          </div>

          <Foot left={footLeft} right="Document confidentiel · sans valeur d'expertise judiciaire" />
        </section>

        {/* ============ LE BIEN ============ */}
        <section className="page">
          <PageHead page={pgBien} label={docLabel} />
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

        {/* ============ AUDIT DE L'ANNONCE EN LIGNE ============ */}
        {hasAuditAnnonce && (
          <section className="page">
            <PageHead page={pgAnnonce} label={docLabel} />
            <SectionTitle idx={secAnnonce} title="Audit de votre annonce" />
            <p className="section-lead" style={{ marginBottom: 12 }}>
              {report.analyse_annonce ||
                "Votre annonce en ligne a été analysée : prix, texte, photos et historique de diffusion."}
            </p>

            {(report.anciennete_annonce || report.baisses_annonce) && (
              <div className="kpi-row" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 14 }}>
                <div className="kpi">
                  <div className="k">Ancienneté détectée de l&apos;annonce</div>
                  <div className="v" style={{ fontSize: "11pt", lineHeight: 1.35 }}>{report.anciennete_annonce || "Non vérifiable"}</div>
                </div>
                <div className="kpi">
                  <div className="k">Baisses de prix détectées</div>
                  <div className="v" style={{ fontSize: "11pt", lineHeight: 1.35 }}>{report.baisses_annonce || "Non vérifiable"}</div>
                </div>
              </div>
            )}

            {recosAnnonce.length > 0 && (
              <>
                <div className="eyebrow" style={{ color: "var(--ink-45)" }}>Nos recommandations pour relancer votre annonce</div>
                <hr className="rule" style={{ margin: "8px 0 4px" }} />
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: "16%" }}>Volet</th>
                      <th>Constat</th>
                      <th>Notre recommandation</th>
                      <th className="r" style={{ width: "12%" }}>Priorité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recosAnnonce.slice(0, 8).map((rec, i) => (
                      <tr key={i} className={rec.priorite === "haute" ? "warn-row" : ""}>
                        <td><b>{rec.categorie}</b></td>
                        <td>{rec.constat}</td>
                        <td>{rec.recommandation}</td>
                        <td className="r">
                          <span style={rec.priorite === "haute" ? { color: "var(--gold-deep)", fontWeight: 700 } : undefined}>
                            {rec.priorite.charAt(0).toUpperCase()}{rec.priorite.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="photo-note" style={{ marginTop: 8 }}>
                  Audit réalisé à partir de l&apos;annonce en ligne et de son historique public ; les
                  éléments non vérifiables sont signalés.
                </p>
              </>
            )}

            <Foot left={`${AGENCE.nom} ${AGENCE.enseigne}`} right={`Réf. ${refDossier}`} />
          </section>
        )}

        {/* ============ ANALYSE VISUELLE (état du bien) ============ */}
        {hasVisuel && (
          <section className="page">
            <PageHead page={pgVisuel} label={docLabel} />
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
            <PageHead page={pgPhotos + pageIdx} label={docLabel} />
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
          <PageHead page={pgMethode} label={docLabel} />
          <SectionTitle idx={secMethode} title={locatif ? "Méthodologie locative" : bienloue ? "Méthodologie investisseur" : "Méthodologie & comparables"} />
          <p className="section-lead">
            {report.analyse_dvf ||
              "La valeur de votre bien est établie à partir des ventes réellement conclues (données publiques DVF) de biens comparables, ajustées à ses caractéristiques propres."}
          </p>

          <div className="method">
            <div className="step">
              <div className="n">01</div>
              <h4>{locatif ? "Loyers de référence" : bienloue ? "Loyer net annuel" : "Sélection DVF"}</h4>
              <p>{locatif
                ? "On part de l'indicateur officiel des loyers de votre commune (« carte des loyers » du Ministère du Logement), pour la typologie de votre bien."
                : bienloue
                  ? "On part du loyer réellement perçu sur un an, dont on retire les charges non récupérables et la taxe foncière : c'est ce que votre bien rapporte vraiment à son propriétaire."
                  : "On part des ventes réellement conclues autour de chez vous (données publiques DVF) : même type de bien, surface proche, au plus près de votre adresse."}</p>
            </div>
            <div className="step">
              <div className="n">02</div>
              <h4>{bienloue ? "Capitalisation 6 – 8 % net" : "Plus-values & décotes"}</h4>
              <p>{locatif
                ? "Chaque atout de votre bien ajoute des euros au loyer de base, chaque défaut en retire — état, énergie, extérieur, stationnement…"
                : bienloue
                  ? "L'acheteur d'un bien loué est un investisseur : il paie le prix qui lui assure une rentabilité nette de 6 à 8 %. Votre fourchette va du prix à 8 % net (vente rapide) au prix à 6 % net (prix optimal)."
                  : "Chaque atout de votre bien ajoute de la valeur, chaque défaut ou effet du marché en retire, à partir de la médiane de ces ventes."}</p>
            </div>
            <div className="step">
              <div className="n">03</div>
              <h4>{locatif ? "Rendement" : bienloue ? "Contrôle marché (DVF)" : "Actualisation au marché"}</h4>
              <p>{locatif
                ? "Les ventes réelles du secteur donnent une valeur de vente indicative de votre bien : elle permet de calculer votre rendement locatif brut."
                : bienloue
                  ? "Les ventes réelles du quartier (données publiques DVF) servent de contrôle : elles situent la valeur « libre » de votre bien et confirment la cohérence du prix investisseur."
                  : "Le marché est actuellement en baisse : les ventes des années passées sont ramenées au prix d'aujourd'hui avant de fixer votre fourchette."}</p>
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
            <PageHead page={pgAjust} label={docLabel} />
            <SectionTitle idx={secAjust} title={locatif ? "Du marché au loyer retenu" : "Du marché au prix retenu"} />
            <p className="section-lead">
              {locatif
                ? "On part du loyer de référence officiel de votre commune. On ajoute les atouts de votre bien, on retire ses défauts : le résultat est le cœur de votre fourchette de loyer."
                : "On part de la médiane des ventes comparables. On ajoute les atouts de votre bien, on retire ses défauts et l'effet du marché : le résultat est le cœur de votre fourchette de valeur."}
            </p>

            <div className="adjust">
              <div className="ar">
                <span><b>{locatif ? `Loyer de référence du secteur (${surface} m²)` : "Médiane DVF de référence — ancre de valeur"}</b></span>
                <span className="money">{fmtP(report.base_mediane)}</span>
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
                <span><b>{locatif ? "Loyer retenu (cœur de fourchette)" : "Cœur de fourchette retenu"}</b></span>
                <span className="money">{fmtP(report.prix_estime)}</span>
              </div>
            </div>

            <div className="callout" style={{ marginTop: 20 }}>
              <b>{locatif ? "Fourchette de loyer" : "Fourchette de valeur"} : {euro.format(fourchetteBasse)} à {fmtP(fourchetteHaute)}.</b>{" "}
              Le cœur de fourchette de {fmtP(report.prix_estime)} résulte de la {locatif ? "référence officielle des loyers" : "médiane DVF"}
              {" "}corrigée des plus-values et décotes ci-dessus ; les bornes traduisent
              l&apos;incertitude résiduelle du marché (indice de confiance : {report.indice_confiance}/100).
            </div>

            <Foot left="Références DVF — données publiques Etalab, dernier millésime disponible" right={`Réf. ${refDossier}`} />
          </section>
        )}

        {/* ============ RECOMMANDATIONS ============ */}
        <section className="page">
          <PageHead page={pgReco} label={docLabel} />
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
                .map((sc, i) => {
                  const titre =
                    sc.strategie === "Prix optimal"
                      ? locatif ? "Loyer optimal" : audit ? "Prix de relance" : bienloue ? "Prix optimal · 6 % net" : "Prix optimal"
                      : locatif ? "Location rapide" : bienloue ? "Vente rapide · 8 % net" : "Vente rapide";
                  return (
                    <div key={i} className="reco" style={sc.strategie === "Prix optimal" ? { borderColor: "var(--gold)", borderWidth: 2 } : undefined}>
                      <div className="t">{titre}{sc.strategie === "Prix optimal" ? " ★" : ""}</div>
                      <div className="big" style={{ fontSize: locatif ? "17pt" : "20pt" }}>{fmtP(sc.prix)}</div>
                      <p style={{ marginBottom: 6 }}><b style={{ color: "var(--ink)" }}>Délai : {sc.delai}</b></p>
                      <p>{sc.commentaire}</p>
                    </div>
                  );
                })}
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

          {bienloue && loyerNetAnn > 0 && (
            <>
              <div style={{ height: 18 }} />
              <div className="eyebrow" style={{ color: "var(--ink-45)" }}>Ce que voit l&apos;acheteur investisseur</div>
              <hr className="rule" style={{ margin: "8px 0 8px" }} />
              <div className="kpi-row" style={{ marginBottom: 4 }}>
                <div className="kpi"><div className="k">Loyer net annuel</div><div className="v" style={{ fontSize: "13pt" }}>{euro.format(loyerNetAnn)}</div></div>
                <div className="kpi"><div className="k">Rentabilité au prix optimal</div><div className="v" style={{ fontSize: "13pt" }}>{fourchetteHaute > 0 ? ((loyerNetAnn / fourchetteHaute) * 100).toLocaleString("fr-FR", { maximumFractionDigits: 1 }) : "—"} % <small>net</small></div></div>
                <div className="kpi"><div className="k">Rentabilité en vente rapide</div><div className="v" style={{ fontSize: "13pt" }}>{fourchetteBasse > 0 ? ((loyerNetAnn / fourchetteBasse) * 100).toLocaleString("fr-FR", { maximumFractionDigits: 1 }) : "—"} % <small>net</small></div></div>
                <div className="kpi"><div className="k">Location en place</div><div className="v" style={{ fontSize: "13pt" }}>{input.meuble || "Vide"}</div></div>
              </div>
            </>
          )}

          {locatif && (report.valeur_venale_indicative ?? 0) > 0 && (
            <>
              <div style={{ height: 18 }} />
              <div className="eyebrow" style={{ color: "var(--ink-45)" }}>Votre investissement en chiffres</div>
              <hr className="rule" style={{ margin: "8px 0 8px" }} />
              <div className="kpi-row" style={{ marginBottom: 4 }}>
                <div className="kpi"><div className="k">Loyer annuel (loyer conseillé)</div><div className="v" style={{ fontSize: "13pt" }}>{euro.format(prixPresentation * 12)}</div></div>
                <div className="kpi"><div className="k">Valeur de vente indicative</div><div className="v" style={{ fontSize: "13pt" }}>{euro.format(report.valeur_venale_indicative ?? 0)}</div></div>
                <div className="kpi"><div className="k">Rendement brut</div><div className="v" style={{ fontSize: "13pt" }}>{(report.rendement_brut ?? 0).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %</div></div>
                <div className="kpi"><div className="k">Type de location</div><div className="v" style={{ fontSize: "13pt" }}>{input.meuble || "Vide"}</div></div>
              </div>
            </>
          )}

          {report.etapes_commercialisation.length > 0 && (
            <>
              <div style={{ height: 22 }} />
              <div className="eyebrow" style={{ color: "var(--ink-45)" }}>{locatif ? "Plan de mise en location" : audit ? "Plan de relance" : "Stratégie de mise en marché"}</div>
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
          <PageHead page={pgSign} label={docLabel} />
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
