"use client";

import type { DocumentInput } from "@/lib/docTypes";

// Devis pré-état daté (« Pack documents Art. 54 Loi ALUR ») — reproduction
// FIDÈLE du modèle papier à en-tête CENTURY 21 Icaza Immobilier du syndic :
// 3 pages (courrier au notaire + suite du tableau + lettre-devis), générées
// sans IA — seules les données du dossier changent.

const OR = "#b4975b";
const OR_CLAIR = "#c9b18a";
const SERIF = 'Cambria, Georgia, "Times New Roman", serif';
const SANS = 'Arial, "Helvetica Neue", sans-serif';

function Sceau({ taille }: { taille: number }) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 100 100" aria-hidden>
      <path d="M 82 20 A 44 44 0 1 0 82 80" fill="none" stroke={OR} strokeWidth="13" />
      <text x="42" y="67" fontSize="46" fontWeight="bold" fill={OR} fontFamily="Georgia, serif">21</text>
    </svg>
  );
}

function EnTete() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ fontFamily: SANS }}>
        <div style={{ color: OR, fontWeight: 700, fontSize: "15pt", letterSpacing: "0.14em" }}>
          CENTURY 21<span style={{ fontSize: "7pt", verticalAlign: "super" }}>®</span>
        </div>
        <div style={{ color: "#8a8a8a", fontSize: "12pt", marginTop: 1 }}>Icaza Immobilier</div>
        <div style={{ fontSize: "10pt", marginTop: 6, fontFamily: SERIF, lineHeight: 1.4 }}>
          32 avenue de la Paix
          <br />
          13500 Martigues
        </div>
      </div>
      <Sceau taille={100} />
    </div>
  );
}

function BlocNotaire({ input }: { input: DocumentInput }) {
  return (
    <div style={{ marginLeft: "46%", fontWeight: 700, fontSize: "12pt", lineHeight: 1.5, marginTop: 12 }}>
      {input.notaireNom || "—"}
      {input.notaireAdresse1 ? (<><br />{input.notaireAdresse1}</>) : null}
      {input.notaireAdresse2 ? (<><br />{input.notaireAdresse2}</>) : null}
    </div>
  );
}

function DateLigne({ dateStr }: { dateStr: string }) {
  return <div style={{ marginLeft: "46%", marginTop: 20 }}>Martigues, le {dateStr}</div>;
}

function PiedC21() {
  return (
    <div style={{ marginTop: "auto", fontFamily: SANS }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingTop: 6 }}>
        <div style={{ flexShrink: 0, marginTop: 2 }}>
          <Sceau taille={30} />
        </div>
        <div style={{ fontSize: "6.8pt", lineHeight: 1.4 }}>
          <b style={{ color: OR }}>Vente – Location – Gestion – Syndic de copropriété</b>
          <br />
          <span style={{ color: OR_CLAIR }}>
            ICAZA Immobilier - SAS au capital de 25 000 € - 830 042 354 R.C.S. Aix en Provence - Carte
            professionnelle CPI 1310 2017 000 020 086 délivrée par la CCI Marseille Provence. Transaction sur
            immeuble et fonds de commerce (non détention de fonds), gestion immobilière, syndic. Garantie
            financière GALIAN 89 rue de la Boétie 75008 Paris. Orias n° 180066.
            <br />
            Chaque Agence est Juridiquement et Financièrement Indépendante
          </span>
        </div>
      </div>
      <div style={{ display: "flex", marginTop: 6 }}>
        <div
          style={{
            flex: 1,
            background: "#141414",
            color: "#fff",
            padding: "7px 16px",
            fontWeight: 800,
            letterSpacing: "0.16em",
            fontSize: "12.5pt",
            border: `3px solid ${OR}`,
            borderRight: "none",
            whiteSpace: "nowrap",
          }}
        >
          PARLONS DE VOUS, PARLONS BIEN<span style={{ color: OR }}>S</span>
        </div>
        <div
          style={{
            background: OR,
            color: "#141414",
            padding: "7px 20px",
            fontWeight: 800,
            letterSpacing: "0.12em",
            fontSize: "12.5pt",
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
        >
          CENTURY 21<span style={{ fontSize: "7pt", verticalAlign: "super" }}>®</span>
        </div>
      </div>
      <div style={{ fontSize: "7.5pt", marginTop: 3, color: "#333" }}>ⓕ ⓟ 🅨 ⓘ ◎ century21.fr</div>
    </div>
  );
}

const cell: React.CSSProperties = {
  border: "1px solid #000",
  padding: "3px 8px",
  verticalAlign: "top",
  fontSize: "10.5pt",
  lineHeight: 1.35,
};

function TableDocs({ lignes }: { lignes: [string, string][] }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
      <tbody>
        {lignes.map(([a, b], i) => (
          <tr key={i}>
            <td style={{ ...cell, width: "47%" }}>{a}</td>
            <td style={cell}>{b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function PreEtatDate({ input, onReset }: { input: DocumentInput; onReset: () => void }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("fr-FR"); // 27/07/2026
  const numeroDevis =
    input.numeroDevis?.trim() ||
    `DE${String(now.getDate()).padStart(2, "0")}${String(now.getMonth() + 1).padStart(2, "0")}${now.getFullYear()}`;
  const ht = input.prixHT && input.prixHT > 0 ? input.prixHT : 316.67;
  const ttc = Math.round(ht * 1.2 * 100) / 100;
  const tva = Math.round((ttc - ht) * 100) / 100;
  const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h2 className="text-2xl font-bold text-navy">Devis pré-état daté</h2>
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
        {/* ============ PAGE 1 — courrier au notaire ============ */}
        <section className="page page-c21">
          <EnTete />
          <BlocNotaire input={input} />
          <DateLigne dateStr={dateStr} />

          <div style={{ marginTop: 20 }}>
            <p style={{ marginBottom: 12 }}>
              <b style={{ textDecoration: "underline" }}>Copropriété</b> :{" "}
              <span style={{ textDecoration: "underline" }}>{input.copropriete || "—"}</span>
            </p>
            <p style={{ marginBottom: 12 }}>
              <b style={{ textDecoration: "underline" }}>Vos réf.&nbsp;:</b> <b>&nbsp;&nbsp;{input.vosRef || "—"}</b>
            </p>
            <p style={{ marginBottom: 4 }}>
              <b style={{ textDecoration: "underline" }}>Objet&nbsp;:</b>{" "}
              <b>&nbsp;&nbsp;Compromis de vente du lot N° {input.numeroLot || "—"}, et documents à fournir</b>
            </p>
            <p style={{ marginBottom: 18, marginLeft: 58 }}>
              <b>Devis de prestation pour délivrance du «&nbsp;Pack documents Art. 54 Loi ALUR&nbsp;»</b>
            </p>

            <p style={{ marginBottom: 12 }}>Madame, Monsieur et Chers Clients,</p>
            <p style={{ marginBottom: 2 }}>
              Nous avons été informés que vous envisagiez la vente du(es) lot(s) référencé(s) ci-dessus.
            </p>
            <p style={{ marginBottom: 12 }}>
              Vous nous avez saisis d&rsquo;une demande de documents en vue de la signature d&rsquo;un compromis de vente.
            </p>
            <p style={{ marginBottom: 12 }}>
              Ces documents, d&rsquo;ordre juridique ou comptable, sont en principe en votre possession en qualité de
              copropriétaire.
            </p>
            <p style={{ marginBottom: 12, textAlign: "justify" }}>
              La loi ALUR, publiée au Journal Officiel le 26 mars 2014, met à la charge du copropriétaire vendeur,
              l&rsquo;obligation de fournir de nombreux documents d&rsquo;ordre juridique et comptable à l&rsquo;acquéreur, qui
              devront être annexés au compromis de vente (voir article L 721-2 du Code de la Construction et de
              l&rsquo;Habitation).
            </p>
            <p style={{ marginBottom: 4, textAlign: "justify" }}>
              Le tableau ci-dessous vous indique l&rsquo;origine de ces documents et leur disponibilité, conformément à
              cet article L 721-2 du Code de la Construction et de l&rsquo;Habitation :
            </p>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
              <thead>
                <tr>
                  <th style={{ ...cell, width: "47%", textAlign: "center", fontWeight: 700 }}>Documents</th>
                  <th style={{ ...cell, textAlign: "center", fontWeight: 700 }}>Origine et disponibilité</th>
                </tr>
              </thead>
              <tbody>
                {([
                  ["Règlement de copropriété", "Remis lors de l’achat par le notaire, également disponible au Bureau des Hypothèques"],
                  ["Modificatif(s) du Règlement de copropriété", "Remis lors de l’achat par le notaire, également disponible au Bureau des Hypothèques"],
                  ["Etat descriptif de division", "Remis lors de l’achat par le notaire, également disponible au Bureau des Hypothèques"],
                  ["PV des assemblées générales des 3 dernières années", "Notifiés ou envoyés par le Syndic après chaque assemblée générale"],
                  ["Carnet d’entretien", "Etabli et mis à jour par le Syndic de l’immeuble"],
                  ["Diagnostic amiante des parties communes", "Obtenu par le Syndic de l’immeuble conformément à la réglementation en vigueur"],
                ] as [string, string][]).map(([a, b], i) => (
                  <tr key={i}>
                    <td style={{ ...cell, width: "47%" }}>{a}</td>
                    <td style={cell}>{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PiedC21 />
        </section>

        {/* ============ PAGE 2 — suite du tableau + demande ============ */}
        <section className="page page-c21">
          <EnTete />

          <div style={{ marginTop: 22 }}>
            <TableDocs
              lignes={[
                ["Montant des charges courantes du budget prévisionnel payées par le copropriétaire vendeur au titre des deux exercices comptables précédant la vente", "« Décompte de charges » ou « Etat des charges » joint à la convocation de l’assemblée générale"],
                ["Sommes pouvant rester dues par le vendeur au syndicat", "Dernier appel de fonds envoyé par le Syndic"],
                ["Sommes qui seront dues au syndicat par l’acquéreur", "Avances qui figurent en rappel sur le dernier appel de charges"],
                ["Etat global des impayés de charges au sein du syndicat et de la dette vis-à-vis des fournisseurs", "Annexe 1 sans détails de l’exercice écoulé"],
                ["Si le Syndic dispose d’un fonds de travaux : le montant de la part de ce fonds rattachée au lot principal vendu et le montant de la dernière cotisation au fonds versée par le vendeur au titre de son(ses) lot(s)", "Somme indiquée sur le dernier état individuel de répartition des comptes annuels approuvés"],
              ]}
            />

            <p style={{ margin: "16px 0 12px", textAlign: "justify" }}>
              S&rsquo;ils ne sont plus en votre possession ou s&rsquo;il ne vous est pas possible de les rechercher sur
              l&rsquo;extranet de votre copropriété, nous sommes en mesure de vous les faire parvenir.
            </p>
            <p style={{ marginBottom: 12, textAlign: "justify" }}>
              Cette prestation n&rsquo;étant pas contractuelle entre le Syndicat des Copropriétaires et le Syndic, seule
              une prestation individualisée peut vous être facturée.
            </p>
            <p style={{ marginBottom: 12, textAlign: "justify" }}>
              C&rsquo;est donc à ce titre que nous vous informons qu&rsquo;il nous est tout à fait possible de vous adresser
              tous les documents listés ci-dessus pour faire suite à votre demande.
            </p>
            <p style={{ marginBottom: 2 }}>
              Vous trouverez en pièce jointe un devis qu&rsquo;il conviendra de compléter, dater et signer et de nous
              retourner
            </p>
            <p style={{ marginBottom: 12 }}>
              l&rsquo;adresse suivante : <a href="mailto:compta.icaza@century21.fr" style={{ color: "#0563c1", textDecoration: "underline" }}>compta.icaza@century21.fr</a> .
            </p>
            <p style={{ marginBottom: 20 }}>
              Les documents seront alors adressés par mail dans <b style={{ textDecoration: "underline", fontStyle: "italic" }}>un délai de 5 jours.</b>
            </p>
            <p style={{ marginBottom: 26, textAlign: "justify" }}>
              Restant à votre disposition, nous vous prions d&rsquo;agréer, Madame, Monsieur et Chers Clients,
              l&rsquo;expression de nos sincères salutations
            </p>
            <p style={{ textAlign: "center", fontWeight: 700, marginBottom: 30 }}>Le service comptable</p>
            <p>
              <b style={{ textDecoration: "underline" }}>PJ</b> : Lettre-devis «&nbsp;Pack Documents Art. 54 Loi ALUR&nbsp;»
            </p>
          </div>

          <PiedC21 />
        </section>

        {/* ============ PAGE 3 — lettre-devis ============ */}
        <section className="page page-c21">
          <EnTete />
          <BlocNotaire input={input} />
          <div style={{ marginLeft: "46%", marginTop: 30 }}>Martigues, le {dateStr}</div>

          <div style={{ marginTop: 26 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ ...cell, width: "50%", textAlign: "center", fontWeight: 700, fontFamily: SANS, padding: "12px 8px" }}>Devis</td>
                  <td style={{ ...cell, textAlign: "center", fontWeight: 700, fontFamily: SANS, padding: "12px 8px" }}>{numeroDevis}</td>
                </tr>
              </tbody>
            </table>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 18 }}>
              <thead>
                <tr>
                  <th style={{ ...cell, width: "9%", textAlign: "center", fontWeight: 700, fontFamily: SANS }}>Réf.</th>
                  <th style={{ ...cell, width: "9%", textAlign: "center", fontWeight: 700, fontFamily: SANS }}>Qté.</th>
                  <th style={{ ...cell, textAlign: "center", fontWeight: 700, fontFamily: SANS }}>Description</th>
                  <th style={{ ...cell, width: "18%", textAlign: "center", fontWeight: 700, fontFamily: SANS }}>Prix Unitaire<br />€ HT</th>
                  <th style={{ ...cell, width: "18%", textAlign: "center", fontWeight: 700, fontFamily: SANS }}>Montant<br />€ HT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...cell, textAlign: "center", height: "74mm", fontFamily: SANS }}>PRES</td>
                  <td style={{ ...cell, textAlign: "center", fontFamily: SANS }}>1</td>
                  <td style={{ ...cell, textAlign: "center", fontFamily: SANS }}>
                    Pack Documents Art. 54 Loi ALUR
                    <div style={{ marginTop: 8 }}>DOSSIER {(input.nomDossier || "—").toUpperCase()}</div>
                  </td>
                  <td style={{ ...cell, textAlign: "right", fontFamily: SANS }}>{fmt(ht)}</td>
                  <td style={{ ...cell, textAlign: "right", fontFamily: SANS }}>{fmt(ht)}</td>
                </tr>
              </tbody>
            </table>

            <table style={{ width: "36%", borderCollapse: "collapse", marginLeft: "64%" }}>
              <tbody>
                {([["Total HT", fmt(ht)], ["TVA 20%", fmt(tva)], ["Total TTC", fmt(ttc)]] as [string, string][]).map(([k, v], i) => (
                  <tr key={i}>
                    <td style={{ ...cell, fontWeight: 700, fontFamily: SANS, width: "55%" }}>{k}</td>
                    <td style={{ ...cell, textAlign: "right", fontFamily: SANS }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p style={{ marginTop: 26, marginBottom: 4 }}>A_______________ le _____________</p>
            <p style={{ fontWeight: 700, textDecoration: "underline" }}>Signature précédée de «&nbsp;Bon pour accord&nbsp;»</p>
          </div>

          <PiedC21 />
        </section>
      </div>
    </div>
  );
}
