"use client";

import type { DocumentInput } from "@/lib/docTypes";

// Facture d'honoraires de transaction — reproduction FIDÈLE du modèle de
// l'agence (une page : logo centré, cadre facture, tableau d'honoraires,
// RIB exact, mentions légales). Générée sans IA : seules les informations
// du dossier changent, le RIB et la mise en page sont figés.

const OR = "#b4975b";
const SANS = 'Arial, "Helvetica Neue", sans-serif';
const GRIS = "#d9d9d9";

// RIB de l'agence — copié à l'exact depuis le modèle : NE PAS MODIFIER
const RIB = {
  codeBanque: "10278",
  codeGuichet: "08977",
  numeroCompte: "00020715502",
  cleRib: "82",
  domiciliation: "CCM MARTIGUES JONQUIERES",
  iban: ["FR76", "1027", "8089", "7700", "0207", "1550", "282"],
  bic: "CMCIFR2A",
};

const MENTIONS = [
  "ICAZA Immobilier - SAS au capital de 25 000 € - 32 avenue de la Paix 13500 Martigues - SIREN 830 042 354  RCS Aix en Provence.",
  "Tél. 04 42 42 80 85  email : icaza@century21.fr",
  "Carte professionnelle CPI 1310 2017 000 020 086 délivrée par la CCI Marseille Provence.",
  "Transaction sur immeuble et fonds de commerce (non détention de fonds), gestion immobilière, syndic.",
  "Garantie financière GALIAN 89 rue de la Boétie 75008 Paris.",
];

function SceauCentre() {
  return (
    <svg width={64} height={64} viewBox="0 0 100 100" aria-hidden>
      <path d="M 82 20 A 44 44 0 1 0 82 80" fill="none" stroke={OR} strokeWidth="9" />
      <text x="44" y="64" fontSize="38" fontWeight="bold" fill={OR} fontFamily="Georgia, serif">21</text>
    </svg>
  );
}

const cell: React.CSSProperties = {
  border: "1px solid #000",
  padding: "4px 8px",
  verticalAlign: "top",
  fontSize: "10.5pt",
  lineHeight: 1.35,
  fontFamily: SANS,
};

const espaceMilliers = (v: number) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(v).replace(/[  ]/g, " ");

export default function FactureCommission({ input, onReset }: { input: DocumentInput; onReset: () => void }) {
  const dateStr = new Date().toLocaleDateString("fr-FR");
  const ttc = input.commissionTTC && input.commissionTTC > 0 ? input.commissionTTC : 0;
  const ht = Math.round(ttc / 1.2);
  const tva = ttc - ht;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h2 className="text-2xl font-bold text-navy">Facture de commission</h2>
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
        <section className="page page-c21" style={{ background: "#fff" }}>
          {/* Logo centré-gauche, sceau au-dessus du wordmark */}
          <div style={{ marginLeft: "8%", marginTop: 8, display: "inline-block", textAlign: "center", fontFamily: SANS }}>
            <SceauCentre />
            <div style={{ color: OR, fontWeight: 700, fontSize: "21pt", letterSpacing: "0.1em", lineHeight: 1.05 }}>
              CENTURY 21<span style={{ fontSize: "9pt", verticalAlign: "super" }}>®</span>
            </div>
            <div style={{ color: OR, fontSize: "13pt", letterSpacing: "0.14em", marginTop: 2 }}>ICAZA Immobilier</div>
          </div>

          {/* Client facturé */}
          <div style={{ textAlign: "center", marginTop: 22, fontWeight: 700, fontFamily: SANS, fontSize: "11pt", lineHeight: 1.5 }}>
            {input.factureClientNom || "—"}
            <br />
            {input.factureClientAdresse || ""}
          </div>

          <div style={{ textAlign: "center", marginTop: 22, fontFamily: SANS, fontSize: "11pt" }}>
            Martigues, le {dateStr}
          </div>

          {/* Cadre facture */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 22 }}>
            <tbody>
              <tr>
                <td style={{ ...cell, width: "50%", fontWeight: 700, fontSize: "13pt", padding: "14px 12px 14px 60px" }}>
                  Facture n° {input.factureNumero || "—"}
                </td>
                <td style={{ ...cell, padding: "14px 12px" }}>&nbsp;</td>
              </tr>
            </tbody>
          </table>

          {/* Tableau des honoraires */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
            <thead>
              <tr>
                <th style={{ ...cell, width: "9%", textAlign: "center", fontWeight: 700 }}>Réf.</th>
                <th style={{ ...cell, width: "9%", textAlign: "center", fontWeight: 700 }}>Qté.</th>
                <th style={{ ...cell, textAlign: "center", fontWeight: 700 }}>Description</th>
                <th style={{ ...cell, width: "17%", textAlign: "center", fontWeight: 700 }}>Prix Unitaire<br />€ HT</th>
                <th style={{ ...cell, width: "17%", textAlign: "center", fontWeight: 700 }}>Montant<br />€ HT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...cell, textAlign: "center", height: "62mm" }}>{input.factureRef || ""}</td>
                <td style={{ ...cell, textAlign: "center" }}>1</td>
                <td style={{ ...cell, textAlign: "center" }}>
                  <div style={{ marginTop: 6 }}>Honoraires de transaction</div>
                  {input.factureBien?.trim() ? <div style={{ marginTop: 10 }}>{input.factureBien}</div> : null}
                  <div style={{ marginTop: 26 }}>Signé en l&rsquo;étude de</div>
                  <div style={{ marginTop: 6 }}>Maitre {input.factureNotaire || "—"}</div>
                </td>
                <td style={cell}>&nbsp;</td>
                <td style={{ ...cell, textAlign: "right" }}>
                  {ht > 0 ? espaceMilliers(ht) : "—"}
                  <div style={{ textAlign: "center", marginTop: 6 }}>-</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Totaux */}
          <table style={{ width: "34%", borderCollapse: "collapse", marginLeft: "66%" }}>
            <tbody>
              {([
                ["Total HT", ht > 0 ? espaceMilliers(ht) : "—"],
                ["TVA 20%", ht > 0 ? espaceMilliers(tva) : "—"],
                ["Total TTC", ttc > 0 ? espaceMilliers(ttc) : "—"],
              ] as [string, string][]).map(([k, v], i) => (
                <tr key={i}>
                  <td style={{ ...cell, fontWeight: 700, width: "55%" }}>{k}</td>
                  <td style={{ ...cell, textAlign: "right" }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p style={{ textAlign: "center", marginTop: 14, fontFamily: SANS, fontSize: "11.5pt" }}>
            Valeur en votre aimable règlement
          </p>

          {/* Cadre RIB — figé, identique au modèle */}
          <div style={{ border: "1px solid #000", padding: "8px 10px 12px", marginTop: 8, fontFamily: SANS }}>
            <div style={{ fontSize: "9pt", marginBottom: 3 }}>Identifiant national de compte bancaire – RIB</div>
            <div style={{ display: "flex", gap: 10 }}>
              <table style={{ width: "68%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Code Banque", "Code guichet", "Numéro de compte", "Clé RIB"].map((h) => (
                      <th key={h} style={{ ...cell, textAlign: "center", fontWeight: 700, fontSize: "9.5pt", padding: "2px 4px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {[RIB.codeBanque, RIB.codeGuichet, RIB.numeroCompte, RIB.cleRib].map((v, i) => (
                      <td key={i} style={{ ...cell, textAlign: "center", fontWeight: 700, fontSize: "9.5pt", padding: "2px 4px", background: GRIS }}>{v}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <table style={{ width: "32%", borderCollapse: "collapse" }}>
                <thead>
                  <tr><th style={{ ...cell, textAlign: "center", fontWeight: 700, fontSize: "9.5pt", padding: "2px 4px" }}>Domiciliation</th></tr>
                </thead>
                <tbody>
                  <tr><td style={{ ...cell, textAlign: "center", fontWeight: 700, fontSize: "8.5pt", padding: "3px 4px", background: GRIS }}>{RIB.domiciliation}</td></tr>
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <div style={{ width: "55%" }}>
                <div style={{ fontSize: "9pt", marginBottom: 3 }}>Identifiant international de compte bancaire</div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr><th colSpan={RIB.iban.length} style={{ ...cell, textAlign: "center", fontWeight: 700, fontSize: "9.5pt", padding: "2px 4px" }}>IBAN (International Bank Account Number)</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      {RIB.iban.map((seg, i) => (
                        <td key={i} style={{ ...cell, textAlign: "center", fontWeight: 700, fontSize: "9.5pt", padding: "2px 3px", background: GRIS }}>{seg}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ width: "45%" }}>
                <div style={{ fontSize: "9pt", marginBottom: 3 }}>Identifiant international de l&rsquo;établissement bancaire</div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr><th style={{ ...cell, textAlign: "center", fontWeight: 700, fontSize: "9.5pt", padding: "2px 4px" }}>BIC (Bank Identifier Code)</th></tr>
                  </thead>
                  <tbody>
                    <tr><td style={{ ...cell, textAlign: "center", fontWeight: 700, fontSize: "9.5pt", padding: "2px 4px", background: GRIS }}>{RIB.bic}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mentions légales */}
          <div style={{ marginTop: "auto", fontFamily: SANS, fontSize: "7.5pt", lineHeight: 1.5, color: "#000" }}>
            {MENTIONS.map((m) => (
              <div key={m}>{m}</div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
