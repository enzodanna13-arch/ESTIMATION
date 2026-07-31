"use client";

import type { DocumentInput } from "@/lib/docTypes";
import { montantEnLettres } from "@/lib/enLettres";

// Mandat SIMPLE de vente CENTURY 21 Icaza Immobilier — reproduction fidèle
// du modèle de l'agence (Information précontractuelle du consommateur + DPI,
// formulaire de rétractation, mandat). Texte légal FIGÉ, coordonnées de
// l'agence en dur ; seuls les champs variables (n° de mandat, mandant,
// désignation du bien, prix, honoraires) sont remplis. Généré sans IA.

const SERIF = 'Cambria, Georgia, "Times New Roman", serif';
const int = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

// Coordonnées EXACTES de l'agence (relevées sur le modèle fourni)
const A = {
  enseigne: "CENTURY 21 Icaza Immobilier",
  societe: "ICAZA Immobilier",
  capital: "25 000 euros",
  adresse: "32 avenue de la Paix 13500 MARTIGUES",
  rcs: "830042354",
  rcsVille: "Aix en Provence",
  carteTitulaire: "CAZARUC Jean-Baptiste",
  carte: "CPI 1310 2017 000 020 086",
  carteDeliv: "Marseille Provence",
  garantie: "GALIAN SMABTP",
  garantieAdr: "89, rue de la Boétie 75008 PARIS",
  garantieNum: "153214M",
  garantieMontant: "120 000 euros",
  rcp: "RCP_01_153214M",
  orias: "18006609",
  tva: "FR43829514587",
  tel: "0442428085",
  mail: "icaza@century21.fr",
  site: "www.century21-icaza-martigues.com",
  representant: "CAZARUC Jean-Baptiste",
  qualite: "Président",
};

function Page({ children, num, sur = 8 }: { children: React.ReactNode; num: number | string; sur?: number }) {
  return (
    <section className="page page-c21" style={{ fontFamily: SERIF, fontSize: "8.6pt", lineHeight: 1.4 }}>
      <div style={{ minHeight: "255mm" }}>{children}</div>
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", fontSize: "7.5pt", color: "#555", borderTop: "1px solid #ccc", paddingTop: 4 }}>
        <span>Paraphes : ……………</span>
        <span>Page {num} sur {sur}</span>
      </div>
    </section>
  );
}

const H = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontWeight: 700, fontSize: "10pt", margin: "10px 0 4px" }}>{children}</div>
);
const P = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <p style={{ margin: "0 0 5px", textAlign: "justify", ...style }}>{children}</p>
);
const Ligne = ({ v }: { v?: string }) => <span style={{ borderBottom: "1px solid #000", padding: "0 4px", fontWeight: 700 }}>{v || "……………………………"}</span>;

export default function MandatVente({ input, onReset }: { input: DocumentInput; onReset: () => void }) {
  const num = input.mandatNumero;
  const mandant = input.mandatMandant?.trim();
  const bien = input.mandatBien?.trim();
  const prix = input.mandatPrix && input.mandatPrix > 0 ? input.mandatPrix : null;
  const hon = input.mandatHonoraires && input.mandatHonoraires > 0 ? input.mandatHonoraires : null;
  const lieu = input.mandatLieu?.trim() || "Martigues";
  const dateStr = input.mandatDate?.trim() || new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const lignesMandant = (mandant ?? "").split("\n").filter(Boolean);
  const lignesBien = (bien ?? "").split("\n").filter(Boolean);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h2 className="text-2xl font-bold text-navy">Mandat simple de vente</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => window.print()} className="rounded-lg bg-copper px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110">📄 Imprimer / PDF</button>
          <button onClick={onReset} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">Nouveau document</button>
        </div>
      </div>

      <div className="dossier">
        {/* ===== COUVERTURE ===== */}
        <section className="page page-c21" style={{ fontFamily: SERIF }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "255mm" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/c21/logo-icaza.png" alt="CENTURY 21 Icaza Immobilier" style={{ width: "70mm", marginBottom: "20mm" }} />
            <div style={{ fontSize: "26pt", fontWeight: 700, letterSpacing: "0.04em", color: "#141414" }}>Mandat simple de vente</div>
            {num && <div style={{ marginTop: 14, fontSize: "12pt", color: "#555" }}>N° {num}</div>}
          </div>
        </section>

        {/* ===== PAGE DPI 1 ===== */}
        <Page num={1}>
          <div style={{ fontWeight: 700, fontSize: "12pt", textAlign: "center", marginBottom: 8 }}>INFORMATION PRÉCONTRACTUELLE DU CONSOMMATEUR</div>
          <H>Notre Agence</H>
          <P>L&apos;agence immobilière {A.enseigne}, exploitée par la société {A.societe}, SAS au capital de {A.capital}, dont le siège social est situé {A.adresse}, est immatriculée au RCS de {A.rcs} sous le n° {A.rcsVille}.</P>
          <P>Elle est titulaire de la carte professionnelle {A.carteTitulaire} n° {A.carte} délivrée par {A.carteDeliv}, située Palais de la Bourse 9 La Canebière 13221 Marseille (France).</P>
          <P>L&apos;Agence est adhérente de la caisse de Garantie {A.garantie} dont le siège est sis {A.garantieAdr} sous le n° {A.garantieNum}, pour un montant de {A.garantieMontant}. Ces garanties sont valables pour le territoire français.</P>
          <P style={{ fontWeight: 700 }}>L&apos;Agence NE PEUT NI RECEVOIR NI DÉTENIR D&apos;AUTRES FONDS, EFFETS OU VALEURS QUE CEUX REPRÉSENTATIFS DE SA RÉMUNÉRATION dans le cadre de son activité de transaction.</P>
          <P>Elle est assurée en responsabilité civile professionnelle par {A.garantie} ({A.garantieAdr}). Ces garanties sont valables pour le territoire français.</P>
          <P>L&apos;agence {A.enseigne} est assujettie à la TVA et identifiée sous le n° {A.tva}.</P>
          <P>L&apos;Agence est située {A.adresse}. Vous pouvez la contacter par téléphone {A.tel} et par mail {A.mail}. Notre site Internet : {A.site}</P>
          <H>Notre activité</H>
          <P>L&apos;activité d&apos;agent immobilier est soumise à la loi du 2 janvier 1970 réglementant les conditions d&apos;exercice des activités relatives à certaines opérations portant sur les immeubles et les fonds de commerce et au décret du 20 juillet 1972 fixant ses conditions d&apos;application.</P>
          <P>Notre activité est également soumise aux dispositions du Code de déontologie des agents immobiliers, des administrateurs de biens, des syndics de copropriété et des marchands de biens annexé au décret du 28 août 2015. Ces textes peuvent être consultés gratuitement sur le site www.legifrance.gouv.fr. La législation applicable est la loi française.</P>
          <H>Nos services</H>
          <P>En signant un MANDAT DE VENTE, vous allez confier à notre Agence la vente de votre bien immobilier. Notre Agence recherchera un acquéreur aux conditions définies au mandat. Dans le cadre d&apos;un MANDAT SIMPLE DE VENTE, vous lui confierez cette mission à titre non-exclusif. Vous conserverez le droit de conclure un ou plusieurs autres mandats de vente non-exclusifs avec d&apos;autres intermédiaires ou de rechercher par vous-même un acquéreur.</P>
        </Page>

        {/* ===== PAGE DPI 2 ===== */}
        <Page num={2}>
          <P>Si la vente se réalise grâce à son intermédiation, notre Agence percevra des honoraires qui seront exigibles au jour de la signature de l&apos;acte authentique de vente. Le montant des honoraires porté au mandat est de <Ligne v={hon ? `${int.format(hon)} € TTC` : undefined} /> pour un prix de <Ligne v={prix ? `${int.format(prix)} €` : undefined} />. Nos honoraires sont à la charge vendeur.</P>
          <P>Vous pouvez retrouver notre barème d&apos;honoraires sur notre site Internet : {A.site}</P>
          <H>Les modalités de paiement</H>
          <P>Nous acceptons les modes de paiement suivants : chèque, virement par le notaire chargé de l&apos;affaire.</P>
          <H>La médiation de la consommation</H>
          <P>En cas de différend, en tant que consommateur, vous pourrez adresser une réclamation écrite au MANDATAIRE. Si la réponse à votre réclamation ne vous satisfait pas ou en l&apos;absence de réponse dans un délai de 30 jours, vous pourrez saisir le médiateur de la consommation compétent inscrit sur la liste des médiateurs agréés par la Commission d&apos;évaluation et de contrôle de la médiation.</P>
          <P>Nom du médiateur : Association MEDIMMOCONSO — Adresse postale : 1 Allée du Parc de Mesemena — Bât A — CS25222 — 44505 LABAULE CEDEX — Site internet : https://medimmoconso.fr/adresser-une-reclamation/</P>
          <P>Le consommateur est informé qu&apos;il peut s&apos;opposer à l&apos;utilisation de ses coordonnées téléphoniques à des fins de prospection commerciale en s&apos;inscrivant sur la liste d&apos;opposition au démarchage téléphonique sur le site bloctel.gouv.fr ou par courrier : Worldline — Service Bloctel — CS 61311 — 41013 BLOIS CEDEX.</P>
          <H>Votre droit de rétractation</H>
          <P>Si votre MANDAT est conclu hors établissement ou à distance, au sens de l&apos;article L 221-1 du Code de la consommation, vous disposerez du droit de vous rétracter sans donner de motif. Vous devrez le faire dans un délai de quatorze jours qui commencera à courir le premier jour qui suit la signature du mandat et prendra fin à l&apos;expiration de la dernière heure du dernier jour du délai. Si ce délai expire un samedi, un dimanche ou un jour férié ou chômé, il sera prorogé jusqu&apos;au premier jour ouvrable suivant.</P>
          <P>Vous pourrez utiliser le modèle de formulaire de rétractation annexé au présent, mais ce n&apos;est pas obligatoire. Il vous suffira de nous notifier votre décision en adressant à l&apos;Agence une déclaration claire et dénuée d&apos;ambiguïté par lettre, télécopie ou courrier électronique. La charge de la preuve de l&apos;exercice de votre droit de rétractation vous incombant, nous vous recommandons d&apos;utiliser la forme de la lettre recommandée avec avis de réception.</P>
        </Page>

        {/* ===== FORMULAIRE RETRACTATION ===== */}
        <Page num={3}>
          <div style={{ fontWeight: 700, fontSize: "12pt", marginBottom: 8 }}>Formulaire de rétractation</div>
          <P>Veuillez compléter et renvoyer le présent formulaire uniquement si vous souhaitez vous rétracter du contrat.</P>
          <P>— À l&apos;attention de : Agence {A.enseigne} — {A.adresse}. Tél. : {A.tel} — {A.mail}</P>
          <P>Je/Nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du contrat portant sur la vente du bien (*)/pour la prestation de service (*) ci-dessous :</P>
          <div style={{ marginTop: 10, lineHeight: 2.2 }}>
            <div>Commandé le (*)/reçu le (*) : ………………………………………………</div>
            <div>Nom du (des) consommateur(s) : ………………………………………………</div>
            <div>Adresse du (des) consommateur(s) : ………………………………………………</div>
            <div>Signature du (des) consommateur(s) (uniquement en cas de notification sur papier) :</div>
            <div style={{ height: 40 }} />
            <div>Date : ……………………………</div>
          </div>
          <P style={{ marginTop: 8, fontSize: "8pt", color: "#555" }}>(*) Rayez la mention inutile</P>
        </Page>

        {/* ===== MANDAT — PARTIES ===== */}
        <Page num={4}>
          <div style={{ fontWeight: 700, fontSize: "12pt", textAlign: "center", marginBottom: 6 }}>MANDAT DE VENTE SANS EXCLUSIVITÉ N° <Ligne v={num} /></div>
          <H>Le mandant</H>
          <div style={{ minHeight: 90, border: "1px solid #bbb", padding: 8, marginBottom: 6 }}>
            {lignesMandant.length ? lignesMandant.map((l, i) => <div key={i}>{l}</div>) : <span style={{ color: "#999" }}>…………………………………………………………………………………………………………</span>}
          </div>
          <P>Ci-après « le MANDANT », D&apos;UNE PART, ET</P>
          <H>Le mandataire</H>
          <P>{A.enseigne}, située {A.adresse}, téléphone {A.tel}, adresse mail {A.mail}, exploitée par la société {A.societe}, SAS au capital de {A.capital}, dont le siège social est situé {A.adresse}, RCS {A.rcs} n° {A.rcsVille}, titulaire de la carte professionnelle {A.carteTitulaire} n° {A.carte} délivrée par {A.carteDeliv}, numéro de TVA {A.tva}, assurée en responsabilité civile professionnelle par {A.garantie} dont le siège est sis {A.garantieAdr}, sur le territoire national sous le n° {A.rcp},</P>
          <P>Adhérente de la caisse de Garantie {A.garantie} dont le siège est sis {A.garantieAdr} sous le n° {A.garantieNum},</P>
          <P style={{ fontWeight: 700 }}>DÉCLARANT NE POUVOIR NI RECEVOIR NI DÉTENIR D&apos;AUTRES FONDS, EFFETS OU VALEURS QUE CEUX REPRÉSENTATIFS DE SA RÉMUNÉRATION</P>
          <P>Immatriculée à l&apos;ORIAS sous le n° {A.orias}, représentée par {A.representant}, agissant en sa qualité de {A.qualite}, ayant tous pouvoirs à l&apos;effet des présentes,</P>
          <P>Ci-après « l&apos;Agence » ou « le MANDATAIRE », D&apos;AUTRE PART,</P>
          <P style={{ textAlign: "center", fontWeight: 700, marginTop: 8 }}>ENTRE LES SOUSSIGNÉS</P>
        </Page>

        {/* ===== OBJET / DESIGNATION / PRIX / HONORAIRES ===== */}
        <Page num={5}>
          <P style={{ textAlign: "center", fontWeight: 700 }}>IL A ÉTÉ CONVENU ET ARRÊTÉ CE QUI SUIT</P>
          <H>Objet du mandat</H>
          <P>Par le présent contrat, le MANDANT confère au MANDATAIRE, qui l&apos;accepte, le Mandat SIMPLE DE RECHERCHER UN ACQUÉREUR pour les biens immobiliers dont il est propriétaire et désignés ci-après, aux prix, charges et conditions indiqués ci-après.</P>
          <H>Désignation des biens à vendre</H>
          <div style={{ minHeight: 80, border: "1px solid #bbb", padding: 8, marginBottom: 6 }}>
            {lignesBien.length ? lignesBien.map((l, i) => <div key={i}>{l}</div>) : <span style={{ color: "#999" }}>…………………………………………………………………………………………………………</span>}
          </div>
          <H>État d&apos;occupation</H>
          <P>Le MANDANT déclare occuper les biens à vendre et qu&apos;ils seront libres de tout titre locatif ou occupation au jour du transfert de jouissance.</P>
          <H>Prix de vente — Honoraires du mandataire</H>
          <P><b>1. Prix de vente des biens.</b> Les biens devront être présentés au prix de {prix ? <b>{montantEnLettres(prix)}</b> : <Ligne />} (<Ligne v={prix ? int.format(prix) : undefined} /> €). Le prix sera réglé comptant au plus tard le jour de la signature de l&apos;acte définitif de vente.</P>
          <P>Le prix de mise en vente des biens a été fixé par le MANDANT après avoir pris connaissance de l&apos;estimation qui en a été faite par le MANDATAIRE à partir des connaissances qu&apos;il a du marché immobilier local. Le prix s&apos;entend TTC de la TVA immobilière en vigueur à la charge du MANDANT si elle est due. Le MANDANT est informé qu&apos;il pourra être assujetti le cas échéant à l&apos;impôt sur les plus-values immobilières.</P>
          <P><b>2. Honoraires du MANDATAIRE.</b> En cas de réalisation de l&apos;opération, les honoraires du MANDATAIRE, d&apos;un montant de {hon ? <b>{montantEnLettres(hon)} TTC</b> : <Ligne />} (<Ligne v={hon ? int.format(hon) : undefined} /> € TTC), seront supportés par le MANDANT.</P>
          <P>Ces honoraires seront payés le jour de la signature de l&apos;acte authentique de vente et le taux de TVA appliqué sera le taux en vigueur à la date de leur exigibilité. En cas d&apos;exercice d&apos;un droit de préemption ou d&apos;une faculté de substitution, son bénéficiaire sera subrogé dans tous les droits et obligations de l&apos;acquéreur.</P>
        </Page>

        {/* ===== DUREE ===== */}
        <Page num={6}>
          <H>Durée du mandat</H>
          <P>Le présent MANDAT NON EXCLUSIF, qui prendra effet le jour de sa signature, est consenti pour une durée de 3 mois. À l&apos;issue de sa durée initiale, il se renouvellera par tacite reconduction, par périodes de 3 mois sans que la durée totale du Mandat ne puisse dépasser au total 15 mois à compter de la date de sa signature.</P>
          <P style={{ fontWeight: 700 }}>Passé un délai de trois mois à compter de sa signature, le mandat pourra toutefois être dénoncé à tout moment par chacune des parties, à charge pour celle qui entend y mettre fin d&apos;en aviser l&apos;autre partie quinze jours au moins à l&apos;avance par lettre recommandée avec demande d&apos;avis de réception, conformément aux dispositions du deuxième alinéa de l&apos;article 78 du décret du 20 juillet 1972.</P>
          <P>En application de l&apos;article L. 215-4 du Code de la consommation, les dispositions des articles L. 215-1 à L. 215-3 et L. 241-3 dudit code sont reproduites : pour les contrats à durée déterminée avec clause de reconduction tacite, le professionnel informe le consommateur par écrit, au plus tôt trois mois et au plus tard un mois avant le terme de la période autorisant le rejet de la reconduction, de la possibilité de ne pas reconduire le contrat, en mentionnant dans un encadré apparent la date limite de non-reconduction. À défaut, le consommateur peut mettre gratuitement un terme au contrat à tout moment à compter de la date de reconduction.</P>
        </Page>

        {/* ===== INTERDICTIONS / ENGAGEMENTS ===== */}
        <Page num={7}>
          <P>Le MANDANT s&apos;engage à exécuter le présent mandat de bonne foi.</P>
          <P style={{ fontWeight: 700 }}>Le MANDANT s&apos;interdit :</P>
          <ul style={{ paddingLeft: 18, margin: "0 0 6px" }}>
            <li>pendant la durée du mandat, de négocier directement ou indirectement la vente des biens désignés avec une personne présentée par le MANDATAIRE ;</li>
            <li>pendant la durée du présent mandat et durant les douze (12) mois suivant sa révocation ou son expiration, de traiter, directement ou indirectement, avec une personne à qui ce bien aura été présenté par le MANDATAIRE, ou un mandataire substitué, et dont l&apos;identité aura été communiquée au MANDANT. Cette interdiction vise l&apos;acheteur, son conjoint, concubin ou partenaire de Pacs, ou toute société dans laquelle il aurait la qualité d&apos;associé.</li>
          </ul>
          <P>Le MANDANT s&apos;oblige, s&apos;il vend les biens pendant la durée du mandat ou durant les douze (12) mois suivant sa révocation ou son expiration, à communiquer immédiatement au MANDATAIRE la date et le prix de la vente, les nom et adresse de l&apos;acquéreur et, le cas échéant, de l&apos;intermédiaire, ainsi que les coordonnées du notaire rédacteur.</P>
          <P style={{ fontWeight: 700 }}>EN CAS DE MANQUEMENT À L&apos;UNE OU L&apos;AUTRE DE CES INTERDICTIONS OU OBLIGATIONS, LE MANDANT S&apos;OBLIGE EXPRESSÉMENT ET DE MANIÈRE IRRÉVOCABLE À VERSER AU MANDATAIRE UNE SOMME ÉGALE AU MONTANT TOTAL, TVA INCLUSE, DE LA RÉMUNÉRATION PRÉVUE AUX PRÉSENTES, À TITRE D&apos;INDEMNITÉ FORFAITAIRE ET DÉFINITIVE.</P>
          <H>Actions commerciales que le mandataire s&apos;engage à réaliser</H>
          <ul style={{ paddingLeft: 18, margin: "0 0 6px" }}>
            <li>Réaliser un dossier de présentation des biens ;</li>
            <li>Réaliser un reportage photographique pour valoriser la présentation des biens ;</li>
            <li>Présenter l&apos;annonce et la photo des biens en vitrine pendant une durée minimale de 60 jours ;</li>
            <li>Diffuser l&apos;annonce sur le site internet de l&apos;Agence et sur les principaux sites internet immobiliers.</li>
          </ul>
          <H>Reddition des comptes</H>
          <P>Le MANDATAIRE s&apos;engage à tenir informé le MANDANT du suivi de ses actions et à lui communiquer après chaque visite un compte-rendu mentionnant les observations éventuelles des prospects.</P>
        </Page>

        {/* ===== RGPD / DISCRIMINATION / SIGNATURES ===== */}
        <Page num={8}>
          <H>Engagement de non-discrimination</H>
          <P>Constitue une discrimination toute distinction opérée entre les personnes sur le fondement de leur origine, de leur sexe, de leur situation de famille (…) et est sanctionnée pénalement. Les parties s&apos;engagent à n&apos;opposer à un candidat acquéreur aucun refus fondé sur un motif discriminatoire. Le MANDANT s&apos;interdit de donner au MANDATAIRE des directives tendant à refuser la vente pour des motifs discriminatoires.</P>
          <H>Collecte et exploitation des données personnelles</H>
          <P>L&apos;Agence et le réseau auquel elle appartient sont responsables des traitements des données à caractère personnel collectées à l&apos;occasion des présentes (gestion des demandes, fichiers clients-prospects, marketing direct, lutte contre le blanchiment). Le MANDANT peut demander à accéder à ses données, les rectifier, les supprimer ou s&apos;opposer à leur exploitation en écrivant à {A.mail} ou à {A.adresse}. Toute réclamation peut être introduite auprès de la CNIL (www.cnil.fr).</P>
          <H>Droit de rétractation</H>
          <P>Le présent mandat étant consenti hors établissement ou à distance, le MANDANT bénéficie, en application des articles L. 221-18 et suivants du Code de la consommation, d&apos;un délai de quatorze jours pour exercer sans motif son droit de rétractation. Le délai court le premier jour suivant la conclusion et prend fin à l&apos;expiration de la dernière heure du dernier jour.</P>

          <H>Signatures</H>
          <P>Fait à {lieu}, le {dateStr}, en deux exemplaires originaux.</P>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginTop: 10 }}>
            <div>
              <div style={{ fontWeight: 700 }}>Le MANDANT</div>
              <div style={{ fontSize: "7.6pt", color: "#555" }}>Précédée de la mention manuscrite « Bon pour mandat »</div>
              <div style={{ border: "1px solid #999", height: 60, marginTop: 6 }} />
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>Le MANDATAIRE</div>
              <div style={{ fontSize: "7.6pt", color: "#555" }}>Précédée de la mention manuscrite « Bon pour acceptation du mandat »</div>
              <div style={{ border: "1px solid #999", height: 60, marginTop: 6 }} />
            </div>
          </div>
        </Page>
      </div>
    </div>
  );
}
