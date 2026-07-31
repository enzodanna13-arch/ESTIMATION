"use client";

import { useState } from "react";
import BonVisite from "@/components/BonVisite";
import CompromisPage from "@/components/CompromisPage";
import FactureCommission from "@/components/FactureCommission";
import MandatVente from "@/components/MandatVente";
import PreEtatDate from "@/components/PreEtatDate";
import type { DocumentInput, DocumentResult } from "@/lib/docTypes";
import { DOC_LABELS } from "@/lib/docTypes";

const AGENCE = {
  nom: process.env.NEXT_PUBLIC_AGENCE_NOM ?? "CENTURY 21",
  enseigne: process.env.NEXT_PUBLIC_AGENCE_ENSEIGNE ?? "Icaza Immobilier",
  adresse: process.env.NEXT_PUBLIC_AGENCE_ADRESSE ?? "32 avenue de la Paix, 13500 Martigues",
  tel: process.env.NEXT_PUBLIC_AGENCE_TEL ?? "04 42 42 80 85",
};

const int = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

/**
 * Rendu d'un document généré (annonce, compte rendu de visite, courrier de
 * prospection) dans la charte du dossier d'estimation Century 21 —
 * une page A4, prête à imprimer, mêmes typographies et mêmes règles print.
 */
export default function DocumentPage({
  doc,
  input,
  onReset,
  onSauvegarder,
}: {
  doc: DocumentResult;
  input: DocumentInput;
  onReset: () => void;
  onSauvegarder?: (d: DocumentInput) => void;
}) {
  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const label = DOC_LABELS[input.docType]?.titre ?? "Document";
  // Annonce et post réseaux sociaux : rendu texte à copier-coller
  const annonce = input.docType === "annonce" || input.docType === "social";
  const preetatdate = input.docType === "preetatdate";
  const [copie, setCopie] = useState<string | null>(null);
  const copier = async (cle: string, texte: string) => {
    try {
      await navigator.clipboard.writeText(texte);
      setCopie(cle);
      setTimeout(() => setCopie(null), 2000);
    } catch {
      /* presse-papiers indisponible : sélection manuelle possible */
    }
  };
  const blocEnTexte = (b: { titre?: string; texte?: string; items?: string[] }) =>
    [b.texte ?? "", ...(b.items ?? []).map((i) => `• ${i}`)].filter(Boolean).join("\n");
  const toutLeTexte = doc.blocs
    .map((b) => [b.titre ? `${b.titre.toUpperCase()}` : "", blocEnTexte(b)].filter(Boolean).join("\n"))
    .join("\n\n");
  // La longueur de rédaction de l'IA varie : au-delà d'un seuil, la page
  // passe en mode « dense » pour rester sur une seule page A4
  const dense = toutLeTexte.length > 1600;

  // Devis pré-état daté : modèle fixe du syndic, reproduit fidèlement
  // (papier à en-tête C21) — généré sans IA
  if (preetatdate) {
    return <PreEtatDate input={input} onReset={onReset} />;
  }

  // Facture de commission : modèle fixe de l'agence (RIB figé) — sans IA
  if (input.docType === "facture") {
    return <FactureCommission input={input} onReset={onReset} />;
  }

  // Bon de visite : texte légal fixe (loi Hoguet, art. 1240 C. civ.) — sans IA
  if (input.docType === "bonvisite") {
    return <BonVisite input={input} onReset={onReset} />;
  }

  // Mandat simple de vente + DPI : modèle fixe de l'agence — sans IA
  if (input.docType === "mandat") {
    return <MandatVente input={input} onReset={onReset} />;
  }

  // Demande de compromis : lettre + fusion des pièces PDF — sans IA
  if (input.docType === "compromis") {
    return <CompromisPage input={input} onReset={onReset} onSauvegarder={onSauvegarder} />;
  }

  // Texte d'annonce : pas de page PDF — un rendu texte à copier-coller
  // directement dans les portails (SeLoger, Leboncoin…)
  if (annonce) {
    return (
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-navy">{label}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => copier("tout", toutLeTexte)}
              className="rounded-lg bg-copper px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110"
            >
              {copie === "tout" ? "✓ Copié !" : "📋 Tout copier"}
            </button>
            <button onClick={onReset} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
              Nouveau document
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {doc.blocs.map((b, i) => {
            const texte = blocEnTexte(b);
            return (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">{b.titre || "Texte"}</h3>
                  <button
                    onClick={() => copier(String(i), texte)}
                    className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                  >
                    {copie === String(i) ? "✓ Copié !" : "📋 Copier"}
                  </button>
                </div>
                <div className="select-all whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-800">
                  {texte}
                </div>
                {b.titre?.toLowerCase().includes("version courte") && (
                  <p className="mt-2 text-xs text-slate-400">{texte.length} caractères</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const specs: [string, string][] =
    input.docType === "bilan"
      ? ([
          input.bilanNbVisites ? ["Visites", String(input.bilanNbVisites)] : null,
          input.bilanNbContacts ? ["Contacts", String(input.bilanNbContacts)] : null,
          input.prix ? ["Prix affiché", `${int.format(input.prix)} €`] : null,
          input.bilanPrixRecommande ? ["Prix recommandé ★", `${int.format(input.bilanPrixRecommande)} €`] : null,
        ].filter(Boolean) as [string, string][])
      : annonce
        ? ([
            input.typeBien ? ["Type", input.typeBien.charAt(0).toUpperCase() + input.typeBien.slice(1)] : null,
            input.surface ? ["Surface", `${input.surface} m²`] : null,
            input.nbPieces ? ["Pièces", String(input.nbPieces)] : null,
            input.prix ? ["Prix", `${int.format(input.prix)} €`] : null,
            input.dpe ? ["DPE", input.dpe] : null,
          ].filter(Boolean) as [string, string][])
        : [];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h2 className="text-2xl font-bold text-navy">{label}</h2>
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
        <section className={`page page-doc${dense ? " page-doc-dense" : ""}`}>
          <div className="head">
            <span className="c21">{AGENCE.nom}</span>
            <span className="pg">{label} · {today}</span>
          </div>

          <div className="section-title">
            <h2>{doc.titre}</h2>
          </div>
          <hr className="rule-gold" />

          {doc.objet ? (
            <p className="section-lead" style={{ marginBottom: 10 }}>
              <b>Objet : </b>
              {doc.objet}
            </p>
          ) : (
            <div style={{ height: 6 }} />
          )}

          {specs.length > 0 && (
            <div className="kpi-row" style={{ gridTemplateColumns: `repeat(${specs.length}, 1fr)`, marginBottom: 12 }}>
              {specs.map(([k, v]) => (
                <div key={k} className="kpi">
                  <div className="k">{k}</div>
                  <div className="v" style={{ fontSize: "12pt" }}>{v}</div>
                </div>
              ))}
            </div>
          )}

          {doc.blocs.map((b, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              {b.titre ? (
                <>
                  <div className="eyebrow" style={{ color: "var(--ink-45)" }}>{b.titre}</div>
                  <hr className="rule" style={{ margin: "6px 0 8px" }} />
                </>
              ) : null}
              {b.texte
                ? b.texte.split("\n").filter((p) => p.trim()).map((p, j) => (
                    <p key={j} style={{ marginBottom: 7 }}>{p}</p>
                  ))
                : null}
              {(b.items?.length ?? 0) > 0 && (
                <ul className="strategy">
                  {b.items!.map((it, j) => {
                    const [titre, ...reste] = it.split("—");
                    return (
                      <li key={j}>
                        {reste.length ? (
                          <>
                            <b>{titre.trim()}</b> — {reste.join("—").trim()}
                          </>
                        ) : (
                          it
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}

          <div className="fin-doc" style={{ marginTop: "auto" }}>
            <div className="sign" style={{ gridTemplateColumns: "1fr", marginTop: 10 }}>
              <div className="box">
                <div className="lbl" style={{ marginBottom: 6 }}>Votre négociateur</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {input.negociateurPhoto && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={`data:${input.negociateurPhoto.mediaType};base64,${input.negociateurPhoto.data}`}
                      alt=""
                      style={{ width: "14mm", height: "14mm", borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(180, 151, 91, 0.7)", flexShrink: 0 }}
                    />
                  )}
                  <div>
                    <div className="name">{input.negociateur || AGENCE.enseigne}</div>
                    <div className="role">
                      {AGENCE.nom} {AGENCE.enseigne}
                      {(input.negociateurTel || input.negociateurEmail) &&
                        ` · ${[input.negociateurTel, input.negociateurEmail].filter(Boolean).join(" · ")}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="foot" style={{ marginTop: 12 }}>
              <span>{AGENCE.nom} {AGENCE.enseigne} — {AGENCE.adresse} · {AGENCE.tel}</span>
              <span>Document généré le {today}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
