"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { NEGOCIATEURS } from "@/lib/equipe";
import TravauxDossier from "@/components/TravauxDossier";
import {
  listTravaux, createTravaux, updateTravaux, deleteTravaux,
  ajouterPhoto, supprimerPhoto, urlPhotoTravaux, analyserPhotoTravaux, compresserPhoto,
  POSTES_TRAVAUX, CATEGORIES_TRAVAUX, posteParId, totalLigne, chiffrage,
  type DossierTravaux, type LigneTravaux, type UniteTravaux,
} from "@/lib/travaux";

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const inputCls = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-copper focus:outline-none";
const rid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const UNITES: UniteTravaux[] = ["m²", "ml", "u", "forfait", "h", "m³"];

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>
      {children}
    </label>
  );
}

export default function TravauxPage({ onRetour }: { onRetour: () => void }) {
  const [liste, setListe] = useState<DossierTravaux[]>([]);
  const [chargement, setChargement] = useState(true);
  const [dossier, setDossier] = useState<DossierTravaux | null>(null);
  const [onglet, setOnglet] = useState<"edition" | "apercu">("edition");
  const [message, setMessage] = useState("");
  const [sauveEtat, setSauveEtat] = useState<"" | "en-cours" | "ok">("");

  // Formulaire de création
  const [form, setForm] = useState({ adresse: "", codePostal: "", ville: "Martigues", typeBien: "Appartement", surface: "", nbPieces: "", clientNom: "", negociateur: "", contexte: "Remise en état avant mise en vente." });

  const charger = async () => { setChargement(true); setListe(await listTravaux()); setChargement(false); };
  useEffect(() => { void charger(); }, []);

  const creer = async () => {
    if (!form.adresse && !form.clientNom) { setMessage("Renseignez au moins l'adresse ou le client."); return; }
    setMessage("");
    const d = await createTravaux({
      adresse: form.adresse, codePostal: form.codePostal, ville: form.ville, typeBien: form.typeBien,
      surface: form.surface ? Number(form.surface) : null, nbPieces: form.nbPieces ? Number(form.nbPieces) : null,
      clientNom: form.clientNom, negociateur: form.negociateur, contexte: form.contexte, margeAlea: 10,
    });
    if (!d) { setMessage("Création impossible (accès ou réseau)."); return; }
    setForm({ adresse: "", codePostal: "", ville: "Martigues", typeBien: "Appartement", surface: "", nbPieces: "", clientNom: "", negociateur: "", contexte: "Remise en état avant mise en vente." });
    await charger();
    setDossier(d); setOnglet("edition");
  };

  // Persiste le dossier courant (infos + lignes + marge + synthèse). Les photos
  // sont gérées par leurs propres endpoints et préservées côté serveur.
  const persister = async (d: DossierTravaux): Promise<DossierTravaux | null> => {
    setSauveEtat("en-cours");
    const maj = await updateTravaux(d.id, {
      adresse: d.adresse, codePostal: d.codePostal, ville: d.ville, typeBien: d.typeBien,
      surface: d.surface, nbPieces: d.nbPieces, clientNom: d.clientNom, negociateur: d.negociateur,
      contexte: d.contexte, syntheseIA: d.syntheseIA, lignes: d.lignes, margeAlea: d.margeAlea,
    });
    if (maj) { setDossier((cur) => (cur ? { ...cur, ...maj, photos: cur.photos } : maj)); setSauveEtat("ok"); setTimeout(() => setSauveEtat(""), 1500); }
    else setSauveEtat("");
    return maj;
  };

  const supprimer = async (id: string) => {
    if (!confirm("Supprimer ce dossier travaux ?")) return;
    await deleteTravaux(id); if (dossier?.id === id) setDossier(null); await charger();
  };

  if (dossier) {
    return (
      <DossierEditeur
        dossier={dossier}
        setDossier={setDossier}
        onglet={onglet}
        setOnglet={setOnglet}
        persister={persister}
        sauveEtat={sauveEtat}
        onFermer={async () => { if (dossier) await persister(dossier); setDossier(null); await charger(); }}
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">🔨 Chiffrage travaux</h2>
          <p className="text-sm text-slate-500">Chiffrez les travaux d&apos;un logement et générez un dossier modifiable (photos, devis estimatif, PDF).</p>
        </div>
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">← Retour</button>
      </div>

      {/* Création */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-bold text-slate-700">Nouveau dossier travaux</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Adresse du bien" className="sm:col-span-2"><input className={inputCls} value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} placeholder="12 rue des Lavandes" /></Field>
          <Field label="Code postal"><input className={inputCls} value={form.codePostal} onChange={(e) => setForm({ ...form, codePostal: e.target.value })} placeholder="13500" /></Field>
          <Field label="Ville"><input className={inputCls} value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} /></Field>
          <Field label="Type de bien">
            <select className={inputCls} value={form.typeBien} onChange={(e) => setForm({ ...form, typeBien: e.target.value })}>
              {["Appartement", "Maison", "Studio", "Local", "Immeuble"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Surface (m²)"><input type="number" className={inputCls} value={form.surface} onChange={(e) => setForm({ ...form, surface: e.target.value })} placeholder="65" /></Field>
          <Field label="Nb pièces"><input type="number" className={inputCls} value={form.nbPieces} onChange={(e) => setForm({ ...form, nbPieces: e.target.value })} placeholder="3" /></Field>
          <Field label="Client / propriétaire"><input className={inputCls} value={form.clientNom} onChange={(e) => setForm({ ...form, clientNom: e.target.value })} placeholder="M. et Mme Martin" /></Field>
          <Field label="Négociateur">
            <select className={inputCls} value={form.negociateur} onChange={(e) => setForm({ ...form, negociateur: e.target.value })}>
              <option value="">— choisir —</option>
              {NEGOCIATEURS.map((n) => <option key={n}>{n}</option>)}
            </select>
          </Field>
          <Field label="Objectif des travaux" className="sm:col-span-2 lg:col-span-3"><input className={inputCls} value={form.contexte} onChange={(e) => setForm({ ...form, contexte: e.target.value })} /></Field>
        </div>
        {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
        <button onClick={() => void creer()} className="mt-3 rounded-lg bg-copper px-4 py-2 text-sm font-bold text-white hover:brightness-110">+ Créer le dossier</button>
      </div>

      {/* Liste */}
      <h3 className="mb-2 text-sm font-bold text-slate-700">Dossiers travaux</h3>
      {chargement ? (
        <p className="text-sm text-slate-500">Chargement…</p>
      ) : liste.length === 0 ? (
        <p className="text-sm text-slate-500">Aucun dossier pour le moment.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {liste.map((d) => {
            const { total } = chiffrage(d.lignes, d.margeAlea);
            return (
              <div key={d.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-semibold text-copper">{d.reference}</div>
                    <div className="font-bold text-slate-800">{d.adresse || d.clientNom || "Sans adresse"}</div>
                    <div className="text-xs text-slate-500">{[d.typeBien, d.surface ? `${d.surface} m²` : "", d.ville].filter(Boolean).join(" · ")}</div>
                  </div>
                  <button onClick={() => void supprimer(d.id)} className="text-slate-300 hover:text-red-500" title="Supprimer">✕</button>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-slate-400">Estimation</div>
                    <div className="text-lg font-bold text-slate-800">{euro.format(total)}</div>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <div>{d.photos.length} photo{d.photos.length > 1 ? "s" : ""}</div>
                    <div>{d.lignes.length} ligne{d.lignes.length > 1 ? "s" : ""}</div>
                  </div>
                </div>
                <button onClick={() => { setDossier(d); setOnglet("edition"); }} className="mt-3 w-full rounded-lg border border-copper/40 bg-copper/5 px-3 py-1.5 text-sm font-semibold text-copper hover:bg-copper/10">Ouvrir</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Éditeur d'un dossier (infos + photos + chiffrage) et aperçu PDF
// ---------------------------------------------------------------------------
function DossierEditeur({
  dossier, setDossier, onglet, setOnglet, persister, sauveEtat, onFermer,
}: {
  dossier: DossierTravaux;
  setDossier: React.Dispatch<React.SetStateAction<DossierTravaux | null>>;
  onglet: "edition" | "apercu";
  setOnglet: (o: "edition" | "apercu") => void;
  persister: (d: DossierTravaux) => Promise<DossierTravaux | null>;
  sauveEtat: "" | "en-cours" | "ok";
  onFermer: () => void;
}) {
  const [busy, setBusy] = useState("");
  const [analyseAuto, setAnalyseAuto] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);
  const [glisser, setGlisser] = useState(false);

  const maj = (champs: Partial<DossierTravaux>) => setDossier((d) => (d ? { ...d, ...champs } : d));
  const { sousTotal, aleas, total } = chiffrage(dossier.lignes, dossier.margeAlea);

  // ---- Lignes ----
  const ajouterLigne = (posteId = "") => {
    const p = posteId ? posteParId(posteId) : undefined;
    const l: LigneTravaux = {
      id: rid(), piece: "", posteId,
      libelle: p?.libelle ?? "", unite: p?.unite ?? "u",
      quantite: p?.unite === "forfait" ? 1 : 0, prixUnitaire: p?.moyen ?? 0,
    };
    maj({ lignes: [...dossier.lignes, l] });
  };
  const modifierLigne = (id: string, champs: Partial<LigneTravaux>) =>
    maj({ lignes: dossier.lignes.map((l) => (l.id === id ? { ...l, ...champs } : l)) });
  const choisirPoste = (id: string, posteId: string) => {
    const p = posteParId(posteId);
    modifierLigne(id, p ? { posteId, libelle: p.libelle, unite: p.unite, prixUnitaire: p.moyen } : { posteId: "" });
  };
  const retirerLigne = (id: string) => maj({ lignes: dossier.lignes.filter((l) => l.id !== id) });

  // ---- Photos ----
  const traiterFichiers = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) return;
    // On persiste d'abord les lignes en cours pour ne pas les perdre.
    const base = await persister(dossier);
    let courant = base ?? dossier;
    for (const f of arr) {
      setBusy(`Envoi de ${f.name}…`);
      try {
        const data = await compresserPhoto(f);
        let analyse: Awaited<ReturnType<typeof analyserPhotoTravaux>> | null = null;
        if (analyseAuto) {
          setBusy(`Analyse IA de ${f.name}…`);
          try { analyse = await analyserPhotoTravaux(data, courant.contexte); } catch { analyse = null; }
        }
        const maj2 = await ajouterPhoto(courant.id, {
          nom: f.name, piece: analyse?.piece ?? "", etat: analyse?.etat ?? "",
          legendeAvant: analyse?.legendeAvant ?? "", legendeApres: analyse?.legendeApres ?? "", data,
        });
        if (maj2) { courant = maj2; setDossier(maj2); }
      } catch (e) {
        alert(e instanceof Error ? e.message : "Photo impossible");
      }
    }
    setBusy("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const retirerPhoto = async (photoId: string) => {
    const maj2 = await supprimerPhoto(dossier.id, photoId);
    if (maj2) setDossier(maj2);
  };

  // Analyse IA d'une photo déjà présente -> remplit légendes + propose des lignes
  const analyser = async (photoId: string) => {
    const ph = dossier.photos.find((p) => p.id === photoId); if (!ph) return;
    setBusy("Analyse IA…");
    try {
      const url = urlPhotoTravaux(dossier.id, photoId);
      const blob = await (await fetch(url)).blob();
      const data = await compresserPhoto(new File([blob], "photo.jpg", { type: "image/jpeg" }));
      const a = await analyserPhotoTravaux(data, dossier.contexte);
      if (a) {
        // Met à jour les légendes de la photo (localement + serveur via PUT dossier n'inclut pas photos ;
        // on passe par l'endpoint photo).
        const { modifierPhoto } = await import("@/lib/travaux");
        const maj2 = await modifierPhoto(dossier.id, photoId, { piece: a.piece || ph.piece, etat: a.etat || ph.etat, legendeAvant: a.legendeAvant || ph.legendeAvant, legendeApres: a.legendeApres || ph.legendeApres });
        if (maj2) setDossier(maj2);
        // Propose d'ajouter les lignes détectées
        if (a.travaux.length > 0 && confirm(`L'IA propose ${a.travaux.length} ligne(s) de travaux pour cette photo. Les ajouter au chiffrage ?`)) {
          const nouvelles: LigneTravaux[] = a.travaux.map((t) => {
            const p = posteParId(t.posteId);
            return { id: rid(), piece: a.piece || "", posteId: t.posteId, libelle: t.libelle || p?.libelle || "", unite: (p?.unite ?? (t.unite as UniteTravaux)) || "u", quantite: t.quantite || (p?.unite === "forfait" ? 1 : 0), prixUnitaire: p?.moyen ?? 0 };
          });
          setDossier((d) => (d ? { ...d, lignes: [...d.lignes, ...nouvelles] } : d));
        }
      }
    } catch (e) { alert(e instanceof Error ? e.message : "Analyse impossible"); }
    setBusy("");
  };

  const modifierLegende = async (photoId: string, champs: { piece?: string; etat?: string; legendeAvant?: string; legendeApres?: string }) => {
    // mise à jour locale immédiate
    setDossier((d) => (d ? { ...d, photos: d.photos.map((p) => (p.id === photoId ? { ...p, ...champs } : p)) } : d));
  };
  const enregistrerLegende = async (photoId: string) => {
    const ph = dossier.photos.find((p) => p.id === photoId); if (!ph) return;
    const { modifierPhoto } = await import("@/lib/travaux");
    const maj2 = await modifierPhoto(dossier.id, photoId, { piece: ph.piece, etat: ph.etat, legendeAvant: ph.legendeAvant, legendeApres: ph.legendeApres });
    if (maj2) setDossier(maj2);
  };

  const postesParCategorie = useMemo(() => CATEGORIES_TRAVAUX.map((c) => ({ c, postes: POSTES_TRAVAUX.filter((p) => p.categorie === c) })), []);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xs font-semibold text-copper">{dossier.reference}</div>
          <h2 className="text-xl font-bold text-navy">{dossier.adresse || dossier.clientNom || "Dossier travaux"}</h2>
        </div>
        <div className="flex items-center gap-2">
          {sauveEtat === "en-cours" && <span className="text-xs text-slate-400">Enregistrement…</span>}
          {sauveEtat === "ok" && <span className="text-xs text-emerald-600">✓ Enregistré</span>}
          <button onClick={() => void persister(dossier)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">💾 Enregistrer</button>
          <button onClick={onFermer} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">← Liste</button>
        </div>
      </div>

      <div className="mb-4 flex gap-1 border-b border-slate-200">
        {([["edition", "✏️ Édition"], ["apercu", "📄 Aperçu & PDF"]] as const).map(([v, t]) => (
          <button key={v} onClick={() => { if (v === "apercu") void persister(dossier); setOnglet(v); }} className={`px-4 py-2 text-sm font-semibold ${onglet === v ? "border-b-2 border-copper text-copper" : "text-slate-500 hover:text-slate-700"}`}>{t}</button>
        ))}
      </div>

      {onglet === "apercu" ? (
        <TravauxDossier dossier={dossier} />
      ) : (
        <div className="space-y-6">
          {/* Infos bien */}
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-bold text-slate-700">Informations</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Adresse" className="sm:col-span-2"><input className={inputCls} value={dossier.adresse} onChange={(e) => maj({ adresse: e.target.value })} /></Field>
              <Field label="Ville"><input className={inputCls} value={dossier.ville} onChange={(e) => maj({ ville: e.target.value })} /></Field>
              <Field label="Type"><input className={inputCls} value={dossier.typeBien} onChange={(e) => maj({ typeBien: e.target.value })} /></Field>
              <Field label="Surface (m²)"><input type="number" className={inputCls} value={dossier.surface ?? ""} onChange={(e) => maj({ surface: e.target.value ? Number(e.target.value) : null })} /></Field>
              <Field label="Nb pièces"><input type="number" className={inputCls} value={dossier.nbPieces ?? ""} onChange={(e) => maj({ nbPieces: e.target.value ? Number(e.target.value) : null })} /></Field>
              <Field label="Client"><input className={inputCls} value={dossier.clientNom} onChange={(e) => maj({ clientNom: e.target.value })} /></Field>
              <Field label="Négociateur">
                <select className={inputCls} value={dossier.negociateur} onChange={(e) => maj({ negociateur: e.target.value })}>
                  <option value="">— choisir —</option>
                  {NEGOCIATEURS.map((n) => <option key={n}>{n}</option>)}
                </select>
              </Field>
              <Field label="Objectif des travaux" className="sm:col-span-2 lg:col-span-3"><input className={inputCls} value={dossier.contexte} onChange={(e) => maj({ contexte: e.target.value })} /></Field>
              <Field label="Synthèse générale (texte du dossier)" className="sm:col-span-2 lg:col-span-3"><textarea rows={3} className={inputCls} value={dossier.syntheseIA} onChange={(e) => maj({ syntheseIA: e.target.value })} placeholder="Synthèse des travaux à prévoir (reprise dans le dossier)." /></Field>
            </div>
          </section>

          {/* Photos */}
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700">Photos (état des lieux)</h3>
              <label className="flex items-center gap-1.5 text-xs text-slate-500"><input type="checkbox" checked={analyseAuto} onChange={(e) => setAnalyseAuto(e.target.checked)} /> Analyser à l&apos;ajout (IA)</label>
            </div>
            <div
              onDragOver={(e) => { e.preventDefault(); setGlisser(true); }}
              onDragLeave={() => setGlisser(false)}
              onDrop={(e) => { e.preventDefault(); setGlisser(false); void traiterFichiers(e.dataTransfer.files); }}
              className={`mb-4 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center text-sm ${glisser ? "border-copper bg-copper/5" : "border-slate-300 text-slate-500"}`}
              onClick={() => fileRef.current?.click()}
            >
              {busy || "Glissez des photos ici, ou cliquez pour choisir. L'IA décrit l'existant et le rendu après travaux."}
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && void traiterFichiers(e.target.files)} />
            </div>
            {dossier.photos.length === 0 ? (
              <p className="text-sm text-slate-400">Aucune photo.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {dossier.photos.map((ph) => (
                  <div key={ph.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={urlPhotoTravaux(dossier.id, ph.id)} alt={ph.nom} className="h-28 w-28 shrink-0 rounded object-cover" />
                      <div className="flex-1 space-y-1.5">
                        <input className={inputCls} value={ph.piece} onChange={(e) => modifierLegende(ph.id, { piece: e.target.value })} onBlur={() => void enregistrerLegende(ph.id)} placeholder="Pièce (ex. Séjour)" />
                        <input className={inputCls} value={ph.etat} onChange={(e) => modifierLegende(ph.id, { etat: e.target.value })} onBlur={() => void enregistrerLegende(ph.id)} placeholder="État constaté" />
                      </div>
                    </div>
                    <textarea rows={2} className={`${inputCls} mt-2`} value={ph.legendeAvant} onChange={(e) => modifierLegende(ph.id, { legendeAvant: e.target.value })} onBlur={() => void enregistrerLegende(ph.id)} placeholder="Légende « avant » (l'existant)" />
                    <textarea rows={3} className={`${inputCls} mt-2`} value={ph.legendeApres} onChange={(e) => modifierLegende(ph.id, { legendeApres: e.target.value })} onBlur={() => void enregistrerLegende(ph.id)} placeholder="Description « après travaux » (projection)" />
                    <div className="mt-2 flex items-center justify-between">
                      <button onClick={() => void analyser(ph.id)} className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">✨ Analyser (IA)</button>
                      <button onClick={() => void retirerPhoto(ph.id)} className="text-xs text-red-400 hover:text-red-600">Supprimer</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Chiffrage */}
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-700">Chiffrage des travaux</h3>
              <div className="flex items-center gap-2">
                <select className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" defaultValue="" onChange={(e) => { if (e.target.value) { ajouterLigne(e.target.value); e.target.value = ""; } }}>
                  <option value="">+ Ajouter un poste du barème…</option>
                  {postesParCategorie.map(({ c, postes }) => (
                    <optgroup key={c} label={c}>
                      {postes.map((p) => <option key={p.id} value={p.id}>{p.libelle} ({euro.format(p.moyen)}/{p.unite})</option>)}
                    </optgroup>
                  ))}
                </select>
                <button onClick={() => ajouterLigne()} className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">+ Ligne libre</button>
              </div>
            </div>

            {dossier.lignes.length === 0 ? (
              <p className="text-sm text-slate-400">Aucune ligne. Ajoutez un poste du barème, une ligne libre, ou analysez une photo avec l&apos;IA.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                      <th className="py-1.5 pr-2">Pièce</th><th className="pr-2">Poste / descriptif</th><th className="pr-2 text-right">Qté</th><th className="pr-2">Unité</th><th className="pr-2 text-right">P.U. €</th><th className="pr-2 text-right">Total</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {dossier.lignes.map((l) => (
                      <tr key={l.id} className="border-b border-slate-100">
                        <td className="py-1.5 pr-2"><input className="w-24 rounded border border-slate-200 px-2 py-1 text-sm" value={l.piece} onChange={(e) => modifierLigne(l.id, { piece: e.target.value })} placeholder="Pièce" /></td>
                        <td className="pr-2">
                          <select className="mb-1 w-full rounded border border-slate-200 px-1.5 py-1 text-xs" value={l.posteId} onChange={(e) => choisirPoste(l.id, e.target.value)}>
                            <option value="">— ligne libre —</option>
                            {postesParCategorie.map(({ c, postes }) => (
                              <optgroup key={c} label={c}>{postes.map((p) => <option key={p.id} value={p.id}>{p.libelle}</option>)}</optgroup>
                            ))}
                          </select>
                          <input className="w-full rounded border border-slate-200 px-2 py-1 text-sm" value={l.libelle} onChange={(e) => modifierLigne(l.id, { libelle: e.target.value })} placeholder="Descriptif" />
                        </td>
                        <td className="pr-2 text-right"><input type="number" className="w-16 rounded border border-slate-200 px-1.5 py-1 text-right text-sm" value={l.quantite || ""} onChange={(e) => modifierLigne(l.id, { quantite: Number(e.target.value) || 0 })} /></td>
                        <td className="pr-2">
                          <select className="rounded border border-slate-200 px-1.5 py-1 text-sm" value={l.unite} onChange={(e) => modifierLigne(l.id, { unite: e.target.value as UniteTravaux })}>
                            {UNITES.map((u) => <option key={u}>{u}</option>)}
                          </select>
                        </td>
                        <td className="pr-2 text-right"><input type="number" className="w-20 rounded border border-slate-200 px-1.5 py-1 text-right text-sm" value={l.prixUnitaire || ""} onChange={(e) => modifierLigne(l.id, { prixUnitaire: Number(e.target.value) || 0 })} /></td>
                        <td className="pr-2 text-right font-semibold">{euro.format(totalLigne(l))}</td>
                        <td><button onClick={() => retirerLigne(l.id)} className="text-slate-300 hover:text-red-500" title="Retirer">✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-end justify-end gap-4 border-t border-slate-200 pt-3">
              <label className="flex items-center gap-2 text-sm text-slate-600">Aléas / imprévus
                <input type="number" className="w-16 rounded border border-slate-300 px-2 py-1 text-right text-sm" value={dossier.margeAlea} onChange={(e) => maj({ margeAlea: Math.max(0, Math.min(50, Number(e.target.value) || 0)) })} /> %
              </label>
              <div className="text-right text-sm">
                <div className="text-slate-500">Sous-total : <b>{euro.format(sousTotal)}</b></div>
                <div className="text-slate-500">Aléas : <b>{euro.format(aleas)}</b></div>
                <div className="text-lg font-bold text-slate-800">Total TTC : {euro.format(total)}</div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
