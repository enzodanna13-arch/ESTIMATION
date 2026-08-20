"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { compressImage } from "@/lib/compressImage";
import { calculerCompletude } from "@/lib/completude";
import { lancerEstimation } from "@/lib/clientApi";
import {
  ETATS_CLIENT, PRESTATIONS_CLIENT, PROJETS_CLIENT,
  type ClientEstimationInput, type TypeBienClient,
} from "@/lib/clientTypes";
import type { PhotoInput } from "@/lib/types";
import Turnstile from "./Turnstile";

const STEPS = ["Adresse", "Votre bien", "Caractéristiques", "Prestations & état", "Photos", "Coordonnées"];
const ANALYSE_STEPS = [
  "Enregistrement de vos informations",
  "Transmission de vos photos",
  "Recherche des ventes réelles de votre secteur",
  "Préparation de votre dossier",
  "Attribution à votre négociateur",
];

type Etat = ClientEstimationInput;

const vide: Etat = {
  adresse: "", codePostal: "", ville: "", quartier: "",
  typeBien: "appartement", surfaceHabitable: null, surfaceTerrain: null,
  nbPieces: null, nbChambres: null, nbSallesDeBain: null, nbWc: null,
  etage: "", nbEtages: null, ascenseur: false, anneeConstruction: "", chauffage: "", dpe: "", exposition: "",
  prestations: [], etat: "",
  prenom: "", nom: "", tel: "", email: "", projet: "", souhaiteRappel: true, consentement: false,
};

const DPE_OPTS = ["", "A", "B", "C", "D", "E", "F", "G"];
const CHAUFFAGE_OPTS = ["", "Individuel gaz", "Individuel électrique", "Collectif", "Pompe à chaleur", "Fioul", "Bois", "Autre"];
const EXPO_OPTS = ["", "Sud", "Nord", "Est", "Ouest", "Sud-Est", "Sud-Ouest", "Nord-Est", "Nord-Ouest", "Traversant"];

export default function TunnelEstimation() {
  const [step, setStep] = useState(0);
  const [f, setF] = useState<Etat>(vide);
  const [photos, setPhotos] = useState<{ p: PhotoInput; url: string }[]>([]);
  const [captcha, setCaptcha] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [phase, setPhase] = useState<"form" | "analyse" | "confirme">("form");
  const [prenomOk, setPrenomOk] = useState("");
  const [analyseStep, setAnalyseStep] = useState(0);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [drag, setDrag] = useState(false);

  const set = <K extends keyof Etat>(k: K, v: Etat[K]) => setF((s) => ({ ...s, [k]: v }));
  const numOr = (v: string): number | null => (v.trim() === "" ? null : Number(v));

  const completude = useMemo(() => calculerCompletude(f, photos.length), [f, photos.length]);

  const togglePrestation = (p: string) =>
    set("prestations", f.prestations.includes(p) ? f.prestations.filter((x) => x !== p) : [...f.prestations, p]);

  const ajouterFichiers = async (files: FileList | null) => {
    if (!files) return;
    const restants = 15 - photos.length;
    const liste = Array.from(files).filter((x) => x.type.startsWith("image/")).slice(0, Math.max(0, restants));
    for (const file of liste) {
      try {
        const p = await compressImage(file);
        setPhotos((s) => [...s, { p, url: `data:${p.mediaType};base64,${p.data}` }]);
      } catch { /* photo ignorée si illisible */ }
    }
  };

  const valideStep = (): string | null => {
    if (step === 0) {
      if (!f.adresse.trim()) return "Merci d'indiquer l'adresse de votre bien.";
      if (!/^\d{5}$/.test(f.codePostal)) return "Le code postal doit comporter 5 chiffres.";
      if (!f.ville.trim()) return "Merci d'indiquer la ville.";
    }
    if (step === 2 && !(f.surfaceHabitable && f.surfaceHabitable > 0)) return "Merci d'indiquer la surface habitable.";
    if (step === 3 && !f.etat) return "Merci de préciser l'état de votre bien.";
    if (step === 5) {
      if (!f.prenom.trim() || !f.nom.trim()) return "Merci d'indiquer votre prénom et votre nom.";
      if (!f.tel.trim()) return "Merci d'indiquer un numéro de téléphone.";
      if (!/.+@.+\..+/.test(f.email)) return "Merci d'indiquer un email valide.";
      if (!f.projet) return "Merci de préciser votre projet.";
      if (!f.consentement) return "Merci d'accepter le traitement de vos données pour continuer.";
    }
    return null;
  };

  const suivant = () => {
    const e = valideStep();
    if (e) { setErr(e); return; }
    setErr(null);
    if (step < STEPS.length - 1) setStep(step + 1);
    else lancer();
  };
  const precedent = () => { setErr(null); setStep(Math.max(0, step - 1)); };

  const lancer = async () => {
    setPhase("analyse");
    setAnalyseStep(0);
    const timer = setInterval(() => setAnalyseStep((s) => Math.min(s + 1, ANALYSE_STEPS.length - 2)), 1300);
    // photos n'appartient pas au type ClientEstimationInput : la route l'accepte
    // en supplément dans le corps JSON.
    const body = { ...f, turnstileToken: captcha, photos: photos.map((x) => x.p) };
    const { resultat, erreur } = await lancerEstimation(body as ClientEstimationInput & { photos: PhotoInput[] });
    clearInterval(timer);
    if (erreur || !resultat) {
      setPhase("form");
      setErr(erreur ?? "Une erreur est survenue.");
      return;
    }
    setAnalyseStep(ANALYSE_STEPS.length);
    setPrenomOk(f.prenom);
    setTimeout(() => setPhase("confirme"), 700);
  };

  if (phase === "confirme") {
    return (
      <main className="tunnel">
        <div className="wrap-narrow">
          <div className="confirme fade-in">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="seal" src="/c21/sceau.png" alt="Century 21 Icaza" />
            <p className="eyebrow">Demande bien reçue</p>
            <h2>Merci {prenomOk}, votre estimation est entre de bonnes mains.</h2>
            <p className="conf-lede">
              Grâce à vos informations et à vos photos, votre négociateur Century 21 Icaza peut
              analyser et référencer votre bien <b>sans même se déplacer</b>. Il finalise votre
              dossier, vous appelle et vous l&apos;envoie par mail.
            </p>
            <div className="conf-delai"><span className="conf-delai-n">3h</span><span>Vous recevez votre estimation complète par mail, en journée.</span></div>
            <div className="conf-steps">
              <div><span className="cs-i">📞</span><b>Un appel personnalisé</b><p>Votre négociateur vous explique la valeur de votre bien.</p></div>
              <div><span className="cs-i">📩</span><b>Votre dossier par mail</b><p>Fourchette justifiée, comparables réels, synthèse claire.</p></div>
              <div><span className="cs-i">🤝</span><b>Zéro pression</b><p>Vous êtes libre : conseil honnête, sans engagement.</p></div>
            </div>
            <Link href="/estimation" className="btn btn-ghost" style={{ marginTop: 26 }}>Retour à l&apos;accueil</Link>
          </div>
        </div>
      </main>
    );
  }

  if (phase === "analyse") {
    return (
      <main className="tunnel">
        <div className="wrap-narrow">
          <div className="analyse">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="seal" src="/c21/sceau-petit.png" alt="" />
            <h2>Nous préparons votre dossier…</h2>
            <div className="steps-live">
              {ANALYSE_STEPS.map((s, i) => (
                <div key={s} className={`live ${i < analyseStep ? "done" : i === analyseStep ? "active" : ""}`}>
                  <span className="mk">{i < analyseStep ? "✓" : ""}</span>{s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="tunnel">
      <div className="wrap-narrow">
        <div className="progress">
          <div className="lbl"><span>Étape {step + 1} sur {STEPS.length}</span><span>{STEPS[step]}</span></div>
          <div className="bar"><span style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>
        </div>

        <div className="qcard fade-in" key={step}>
          {err && <div className="err">{err}</div>}

          {step === 0 && (
            <>
              <h2 className="qtitle">Où se situe votre bien ?</h2>
              <p className="qhint">L&apos;adresse exacte est essentielle : elle nous permet de trouver les ventes réelles les plus proches.</p>
              <div className="field"><label>Adresse (n° et rue)</label><input value={f.adresse} onChange={(e) => set("adresse", e.target.value)} placeholder="12 rue des Lauriers" /></div>
              <div className="row2">
                <div className="field"><label>Code postal</label><input value={f.codePostal} inputMode="numeric" maxLength={5} onChange={(e) => set("codePostal", e.target.value.replace(/\D/g, ""))} placeholder="13008" /></div>
                <div className="field"><label>Ville</label><input value={f.ville} onChange={(e) => set("ville", e.target.value)} placeholder="Marseille" /></div>
              </div>
              <div className="field"><label>Quartier (facultatif)</label><input value={f.quartier} onChange={(e) => set("quartier", e.target.value)} placeholder="Périer" /></div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="qtitle">Quel type de bien ?</h2>
              <p className="qhint">Les questions suivantes s&apos;adapteront à votre choix.</p>
              <div className="choices">
                {(["appartement", "maison"] as TypeBienClient[]).map((t) => (
                  <div key={t} className={`choice ${f.typeBien === t ? "on" : ""}`} onClick={() => set("typeBien", t)}>
                    {t === "appartement" ? "Appartement" : "Maison"}
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="qtitle">Les caractéristiques</h2>
              <p className="qhint">Plus c&apos;est précis, plus votre dossier sera pertinent.</p>
              <div className="row2">
                <div className="field"><label>Surface habitable (m²)</label><input inputMode="numeric" value={f.surfaceHabitable ?? ""} onChange={(e) => set("surfaceHabitable", numOr(e.target.value))} placeholder="80" /></div>
                {f.typeBien === "maison"
                  ? <div className="field"><label>Terrain (m²)</label><input inputMode="numeric" value={f.surfaceTerrain ?? ""} onChange={(e) => set("surfaceTerrain", numOr(e.target.value))} placeholder="400" /></div>
                  : <div className="field"><label>Étage</label><input value={f.etage} onChange={(e) => set("etage", e.target.value)} placeholder="3e" /></div>}
              </div>
              <div className="row3">
                <div className="field"><label>Pièces</label><input inputMode="numeric" value={f.nbPieces ?? ""} onChange={(e) => set("nbPieces", numOr(e.target.value))} placeholder="4" /></div>
                <div className="field"><label>Chambres</label><input inputMode="numeric" value={f.nbChambres ?? ""} onChange={(e) => set("nbChambres", numOr(e.target.value))} placeholder="3" /></div>
                <div className="field"><label>Salles de bain</label><input inputMode="numeric" value={f.nbSallesDeBain ?? ""} onChange={(e) => set("nbSallesDeBain", numOr(e.target.value))} placeholder="1" /></div>
              </div>
              <div className="row2">
                <div className="field"><label>Année de construction</label><input inputMode="numeric" value={f.anneeConstruction} onChange={(e) => set("anneeConstruction", e.target.value)} placeholder="1995" /></div>
                <div className="field"><label>DPE</label><select value={f.dpe} onChange={(e) => set("dpe", e.target.value)}>{DPE_OPTS.map((o) => <option key={o} value={o}>{o || "Je ne sais pas"}</option>)}</select></div>
              </div>
              <div className="row2">
                <div className="field"><label>Chauffage</label><select value={f.chauffage} onChange={(e) => set("chauffage", e.target.value)}>{CHAUFFAGE_OPTS.map((o) => <option key={o} value={o}>{o || "Non précisé"}</option>)}</select></div>
                <div className="field"><label>Exposition</label><select value={f.exposition} onChange={(e) => set("exposition", e.target.value)}>{EXPO_OPTS.map((o) => <option key={o} value={o}>{o || "Non précisée"}</option>)}</select></div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="qtitle">Prestations & état</h2>
              <p className="qhint">Cochez les prestations, puis indiquez l&apos;état général de votre bien.</p>
              <div className="field"><label>Prestations</label>
                <div className="chips">
                  {PRESTATIONS_CLIENT.map((p) => (
                    <button type="button" key={p} className={`chip-btn ${f.prestations.includes(p) ? "on" : ""}`} onClick={() => togglePrestation(p)}>{p}</button>
                  ))}
                </div>
              </div>
              <div className="field" style={{ marginTop: 22 }}><label>État du bien</label>
                <div className="etats">
                  {ETATS_CLIENT.map((e) => (
                    <div key={e} className={`etat-opt ${f.etat === e ? "on" : ""}`} onClick={() => set("etat", e)}>{e}</div>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="qtitle">Photographiez chaque pièce</h2>
              <p className="qhint">Une photo <b>grand angle</b> de chaque pièce, c&apos;est ce qui évite la visite : votre négociateur voit tout le volume et l&apos;état réel de votre bien.</p>
              <ul className="photo-tips">
                <li><b>Grand angle</b> — mode « 0,5 », depuis un coin de la pièce, pour tout capter.</li>
                <li><b>Chaque pièce</b> — séjour, cuisine, chambres, salles de bains…</li>
                <li><b>Les extérieurs</b> — façade, jardin, terrasse, balcon, piscine, vue.</li>
                <li><b>De la lumière</b> — de jour, volets ouverts, téléphone tenu bien droit.</li>
              </ul>
              <div
                className={`dropzone ${drag ? "drag" : ""}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); void ajouterFichiers(e.dataTransfer.files); }}
              >
                <div className="big">Glissez vos photos ici</div>
                <div className="small">ou cliquez pour les sélectionner — jusqu&apos;à 15 photos</div>
                <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { void ajouterFichiers(e.target.files); e.target.value = ""; }} />
              </div>
              {photos.length > 0 && (
                <div className="thumbs">
                  {photos.map((ph, i) => (
                    <div className="thumb" key={i}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ph.url} alt={`Photo ${i + 1}`} />
                      <button type="button" onClick={() => setPhotos((s) => s.filter((_, j) => j !== i))} aria-label="Supprimer">×</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="completude">
                <div className="pct">Dossier complet à {completude.score} %</div>
                {completude.manquants[0] && <div className="tip">{completude.manquants[0]}</div>}
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="qtitle">Vos coordonnées</h2>
              <p className="qhint">Pour vous transmettre votre dossier et, si vous le souhaitez, vous accompagner.</p>
              <div className="row2">
                <div className="field"><label>Prénom</label><input value={f.prenom} onChange={(e) => set("prenom", e.target.value)} /></div>
                <div className="field"><label>Nom</label><input value={f.nom} onChange={(e) => set("nom", e.target.value)} /></div>
              </div>
              <div className="row2">
                <div className="field"><label>Téléphone</label><input inputMode="tel" value={f.tel} onChange={(e) => set("tel", e.target.value)} placeholder="06 12 34 56 78" /></div>
                <div className="field"><label>Email</label><input inputMode="email" value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="vous@email.com" /></div>
              </div>
              <div className="field"><label>Votre projet</label>
                <select value={f.projet} onChange={(e) => set("projet", e.target.value)}>
                  <option value="">Sélectionnez…</option>
                  {PROJETS_CLIENT.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="field"><label>Souhaitez-vous être rappelé par un conseiller Century 21 Icaza ?</label>
                <div className="choices">
                  <div className={`choice ${f.souhaiteRappel ? "on" : ""}`} onClick={() => set("souhaiteRappel", true)}>Oui</div>
                  <div className={`choice ${!f.souhaiteRappel ? "on" : ""}`} onClick={() => set("souhaiteRappel", false)}>Non</div>
                </div>
              </div>
              <label className="consent">
                <input type="checkbox" checked={f.consentement} onChange={(e) => set("consentement", e.target.checked)} />
                <span>J&apos;accepte que mes informations soient utilisées pour traiter ma demande d&apos;estimation et, lorsque je l&apos;ai demandé, être recontacté dans le cadre de mon projet immobilier. Voir la <a href="/estimation/confidentialite" target="_blank" rel="noreferrer">politique de confidentialité</a>.</span>
              </label>
              <Turnstile onToken={setCaptcha} />
            </>
          )}

          <div className="tunnel-nav">
            {step > 0
              ? <button type="button" className="btn btn-ghost" onClick={precedent}>← Retour</button>
              : <span />}
            <button type="button" className="btn btn-gold" onClick={suivant}>
              {step < STEPS.length - 1 ? <>Continuer <span className="arw">→</span></> : <>Lancer mon estimation <span className="arw">→</span></>}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
