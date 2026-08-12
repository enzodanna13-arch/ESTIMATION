"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addClientFile, deleteClientFile, getClientFileB64, telechargerClientFile, updateClient,
  type ClientDossier, type RechercheImmo,
} from "@/lib/clients";
import {
  CATEGORIES_DOCS_ACQUEREUR, ETATS_RECHERCHE, EXTERIEURS, OBJECTIFS_INVEST,
  STATUT_COULEURS, STATUTS_RECHERCHE, TYPES_BIEN_RECHERCHE, TYPES_TIMELINE,
  completudeDossier, financementVide, investissementVide, rechercheVide,
} from "@/lib/acquereurs";
import { listEstimations, getEstimation } from "@/lib/history";
import { bienDepuisEstimation, NIVEAUX, scorerRecherche } from "@/lib/matching";

const inputCls = "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/20";
const int = new Intl.NumberFormat("fr-FR");
const eur = (n: number | null | undefined) => (n != null ? `${int.format(n)} €` : "—");
const dateFr = (t: number) => new Date(t).toLocaleDateString("fr-FR");

function Champ({ label, essentiel, children, className }: { label: string; essentiel?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}{essentiel && <span className="text-copper" title="Essentiel au rapprochement"> ★</span>}</span>
      {children}
    </label>
  );
}
function Section({ titre, children, defautOuvert = true }: { titre: string; children: React.ReactNode; defautOuvert?: boolean }) {
  const [o, setO] = useState(defautOuvert);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <button type="button" onClick={() => setO(!o)} className="flex w-full items-center justify-between px-4 py-3 text-left">
        <span className="text-sm font-bold text-navy">{titre}</span>
        <span className="text-slate-400">{o ? "▾" : "▸"}</span>
      </button>
      {o && <div className="border-t border-slate-100 p-4">{children}</div>}
    </div>
  );
}
function Chips<T extends { id: string; label: string }>({ options, values, onToggle }: { options: T[]; values: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button key={o.id} type="button" onClick={() => onToggle(o.id)} className={`rounded-full px-3 py-1 text-xs font-semibold transition ${values.includes(o.id) ? "bg-copper text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}>{o.label}</button>
      ))}
    </div>
  );
}

export default function AcquereurFiche({ dossier, onRetour, onSaved }: { dossier: ClientDossier; onRetour: () => void; onSaved?: (d: ClientDossier) => void }) {
  const [d, setD] = useState<ClientDossier>({
    ...dossier,
    recherches: dossier.recherches?.length ? dossier.recherches : [rechercheVide()],
    financement: dossier.financement ?? financementVide(),
    investissement: dossier.investissement ?? (dossier.typeClient === "investisseur" ? investissementVide() : undefined),
    timeline: dossier.timeline ?? [],
  });
  const [rIdx, setRIdx] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [catDoc, setCatDoc] = useState(CATEGORIES_DOCS_ACQUEREUR[0]);
  const [busy, setBusy] = useState(false);

  const set = (patch: Partial<ClientDossier>) => { setD((p) => ({ ...p, ...patch })); setDirty(true); };
  const recherche = d.recherches![Math.min(rIdx, d.recherches!.length - 1)];
  const setRecherche = (patch: Partial<RechercheImmo>) => {
    setD((p) => ({ ...p, recherches: p.recherches!.map((r, i) => (i === rIdx ? { ...r, ...patch } : r)) }));
    setDirty(true);
  };
  const toggle = (arr: string[], id: string) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  const completude = useMemo(() => completudeDossier(d), [d]);
  const estInvest = d.typeClient === "investisseur";

  const enregistrer = async () => {
    setSaving(true); setMsg(null);
    const patch: Partial<ClientDossier> = {
      nom: d.nom, prenom: d.prenom, tel: d.tel, email: d.email, adresseActuelle: d.adresseActuelle,
      negociateur: d.negociateur, statut: d.statut, notes: d.notes, derniereInteraction: Date.now(),
      bien: d.recherches![0] ? resumeDepuisRecherche(d) : d.bien,
      recherches: d.recherches, financement: d.financement, investissement: d.investissement, timeline: d.timeline,
    };
    const maj = await updateClient(d.id, patch);
    setSaving(false);
    if (maj) { setDirty(false); setMsg("✓ Enregistré"); setTimeout(() => setMsg(null), 2000); onSaved?.(maj); }
    else setMsg("Enregistrement impossible");
  };

  const ajouterEvenement = (type: string, texte: string) => {
    if (!texte.trim()) return;
    const ev = { id: `${Date.now()}`, date: Date.now(), type, texte: texte.trim(), auteur: d.negociateur || "—" };
    set({ timeline: [ev, ...(d.timeline ?? [])] });
  };

  // Documents
  const televerser = async (files: FileList | null) => {
    if (!files) return;
    setBusy(true); setMsg(null);
    try {
      for (const f of Array.from(files)) {
        if (!f.name.toLowerCase().endsWith(".pdf")) continue;
        if (f.size > 4_000_000) throw new Error(`« ${f.name} » dépasse 4 Mo.`);
        const buf = new Uint8Array(await f.arrayBuffer());
        let bin = ""; for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
        const maj = await addClientFile(d.id, { nom: f.name, categorie: catDoc, data: btoa(bin) });
        if (maj) { setD((p) => ({ ...p, pieces: maj.pieces })); }
      }
      ajouterEvenement("document", `Document ajouté (${catDoc})`);
    } catch (e) { setMsg(e instanceof Error ? e.message : "Envoi impossible"); }
    finally { setBusy(false); }
  };
  const suppDoc = async (fileId: string, nom: string) => {
    if (!confirm(`Supprimer « ${nom} » ?`)) return;
    const maj = await deleteClientFile(d.id, fileId);
    if (maj) setD((p) => ({ ...p, pieces: maj.pieces }));
  };

  return (
    <div className="pb-24">
      {/* En-tête */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <button onClick={onRetour} className="mb-2 rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">← Tous les dossiers</button>
          <h2 className="text-2xl font-bold text-navy">
            {estInvest ? "📈" : "🔑"} {[d.prenom, d.nom].filter(Boolean).join(" ") || "Nouveau client"}
            <span className={`ml-2 rounded-full px-2.5 py-0.5 align-middle text-xs font-bold ${estInvest ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"}`}>{estInvest ? "Investisseur" : "Acquéreur"}</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <select className={`${inputCls} w-auto`} value={d.statut ?? "Nouveau"} onChange={(e) => { const ancien = d.statut; set({ statut: e.target.value }); if (ancien !== e.target.value) ajouterEvenement("statut", `Statut : ${e.target.value}`); }}>
            {STATUTS_RECHERCHE.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Barre de complétude */}
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="font-bold text-navy">Dossier complété à {completude.pct} %</span>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUT_COULEURS[d.statut ?? "Nouveau"] ?? "bg-slate-100 text-slate-600"}`}>{d.statut ?? "Nouveau"}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-copper transition-all" style={{ width: `${completude.pct}%` }} /></div>
        {completude.manquants.length > 0 && <p className="mt-2 text-xs text-slate-500">À compléter : {completude.manquants.join(" · ")} <span className="text-copper">(★ = essentiel au rapprochement)</span></p>}
      </div>

      <div className="space-y-3">
        {/* 1. Fiche client */}
        <Section titre="👤 Fiche client">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Champ label="Nom *"><input className={inputCls} value={d.nom} onChange={(e) => set({ nom: e.target.value })} /></Champ>
            <Champ label="Prénom"><input className={inputCls} value={d.prenom ?? ""} onChange={(e) => set({ prenom: e.target.value })} /></Champ>
            <Champ label="Négociateur en charge"><input className={inputCls} value={d.negociateur} onChange={(e) => set({ negociateur: e.target.value })} /></Champ>
            <Champ label="Téléphone"><input className={inputCls} value={d.tel ?? ""} onChange={(e) => set({ tel: e.target.value })} /></Champ>
            <Champ label="Email"><input className={inputCls} value={d.email ?? ""} onChange={(e) => set({ email: e.target.value })} /></Champ>
            <Champ label="Adresse actuelle"><input className={inputCls} value={d.adresseActuelle ?? ""} onChange={(e) => set({ adresseActuelle: e.target.value })} /></Champ>
            <Champ label="Notes internes" className="sm:col-span-2 lg:col-span-3"><textarea rows={2} className={inputCls} value={d.notes ?? ""} onChange={(e) => set({ notes: e.target.value })} /></Champ>
          </div>
          <p className="mt-2 text-xs text-slate-400">Créé le {dateFr(d.createdAt)}{d.derniereInteraction ? ` · dernière interaction le ${dateFr(d.derniereInteraction)}` : ""}</p>
        </Section>

        {/* 2. Projet de recherche */}
        <Section titre="🔎 Projet de recherche">
          {/* Onglets recherches multiples */}
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            {d.recherches!.map((r, i) => (
              <button key={r.id} type="button" onClick={() => setRIdx(i)} className={`rounded-full px-3 py-1 text-xs font-semibold ${i === rIdx ? "bg-navy text-white" : "border border-slate-200 bg-white text-slate-600"}`}>{r.libelle || `Recherche ${i + 1}`}{r.actif === false ? " (inactive)" : ""}</button>
            ))}
            <button type="button" onClick={() => { set({ recherches: [...d.recherches!, rechercheVide(`Recherche ${d.recherches!.length + 1}`)] }); setRIdx(d.recherches!.length); }} className="rounded-full border border-dashed border-copper px-3 py-1 text-xs font-bold text-copper">+ Recherche</button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Champ label="Libellé de la recherche"><input className={inputCls} value={recherche.libelle} onChange={(e) => setRecherche({ libelle: e.target.value })} placeholder="Résidence principale…" /></Champ>
            <Champ label="Ville(s) recherchée(s)" essentiel className="lg:col-span-2"><input className={inputCls} value={recherche.villes.join(", ")} onChange={(e) => setRecherche({ villes: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })} placeholder="Martigues, Saint-Mitre-les-Remparts" /></Champ>
            <Champ label="Secteurs / quartiers"><input className={inputCls} value={recherche.secteurs} onChange={(e) => setRecherche({ secteurs: e.target.value })} placeholder="Côte Bleue, Ferrières…" /></Champ>
            <Champ label="Rayon (km)"><input type="number" className={inputCls} value={recherche.rayonKm ?? ""} onChange={(e) => setRecherche({ rayonKm: e.target.value ? +e.target.value : null })} /></Champ>
            <Champ label="Statut recherche"><label className="flex items-center gap-2 py-2 text-sm"><input type="checkbox" checked={recherche.actif !== false} onChange={(e) => setRecherche({ actif: e.target.checked })} /> Recherche active</label></Champ>
            <Champ label="Type de bien recherché" essentiel className="sm:col-span-2 lg:col-span-3"><Chips options={TYPES_BIEN_RECHERCHE} values={recherche.typesBien} onToggle={(id) => setRecherche({ typesBien: toggle(recherche.typesBien, id) })} /></Champ>
            <Champ label="Budget minimum"><input type="number" className={inputCls} value={recherche.budgetMin ?? ""} onChange={(e) => setRecherche({ budgetMin: e.target.value ? +e.target.value : null })} /></Champ>
            <Champ label="Budget maximum" essentiel><input type="number" className={inputCls} value={recherche.budgetMax ?? ""} onChange={(e) => setRecherche({ budgetMax: e.target.value ? +e.target.value : null })} placeholder="400000" /></Champ>
            <Champ label="DPE minimum souhaité"><select className={inputCls} value={recherche.dpeMin} onChange={(e) => setRecherche({ dpeMin: e.target.value })}><option value="">Indifférent</option>{["A","B","C","D","E","F","G"].map((x) => <option key={x}>{x}</option>)}</select></Champ>
            <Champ label="Surface minimum (m²)"><input type="number" className={inputCls} value={recherche.surfaceMin ?? ""} onChange={(e) => setRecherche({ surfaceMin: e.target.value ? +e.target.value : null })} /></Champ>
            <Champ label="Surface idéale (m²)"><input type="number" className={inputCls} value={recherche.surfaceIdeale ?? ""} onChange={(e) => setRecherche({ surfaceIdeale: e.target.value ? +e.target.value : null })} /></Champ>
            <Champ label="Étage souhaité"><input className={inputCls} value={recherche.etage} onChange={(e) => setRecherche({ etage: e.target.value })} placeholder="Rez, dernier…" /></Champ>
            <Champ label="Pièces minimum"><input type="number" className={inputCls} value={recherche.piecesMin ?? ""} onChange={(e) => setRecherche({ piecesMin: e.target.value ? +e.target.value : null })} /></Champ>
            <Champ label="Chambres minimum"><input type="number" className={inputCls} value={recherche.chambresMin ?? ""} onChange={(e) => setRecherche({ chambresMin: e.target.value ? +e.target.value : null })} /></Champ>
            <Champ label="Ascenseur"><select className={inputCls} value={recherche.ascenseur} onChange={(e) => setRecherche({ ascenseur: e.target.value as RechercheImmo["ascenseur"] })}><option value="indiff">Indifférent</option><option value="oui">Obligatoire</option><option value="non">Sans importance</option></select></Champ>
            <Champ label="Extérieur souhaité" className="sm:col-span-2"><Chips options={EXTERIEURS} values={recherche.exterieurs} onToggle={(id) => setRecherche({ exterieurs: toggle(recherche.exterieurs, id) })} /></Champ>
            <Champ label="Annexes" className="lg:col-span-1"><div className="flex flex-wrap gap-2 py-1 text-xs">
              {([["garage","Garage"],["stationnement","Stationnement"],["cave","Cave"],["piscine","Piscine"]] as const).map(([k, l]) => (
                <label key={k} className="flex items-center gap-1"><input type="checkbox" checked={recherche[k] as boolean} onChange={(e) => setRecherche({ [k]: e.target.checked } as Partial<RechercheImmo>)} /> {l}</label>
              ))}
            </div></Champ>
            <Champ label="Travaux acceptés ?"><select className={inputCls} value={recherche.travaux} onChange={(e) => setRecherche({ travaux: e.target.value as RechercheImmo["travaux"] })}><option value="indiff">Indifférent</option><option value="oui">Oui</option><option value="non">Non (prêt à vivre)</option></select></Champ>
            <Champ label="État du bien recherché" className="sm:col-span-2"><Chips options={ETATS_RECHERCHE} values={recherche.etatRecherche} onToggle={(id) => setRecherche({ etatRecherche: toggle(recherche.etatRecherche, id) })} /></Champ>
            <Champ label="Critères indispensables" className="lg:col-span-1"><textarea rows={2} className={inputCls} value={recherche.indispensables} onChange={(e) => setRecherche({ indispensables: e.target.value })} /></Champ>
            <Champ label="Critères secondaires"><textarea rows={2} className={inputCls} value={recherche.secondaires} onChange={(e) => setRecherche({ secondaires: e.target.value })} /></Champ>
            <Champ label="Critères rédhibitoires"><textarea rows={2} className={inputCls} value={recherche.redhibitoires} onChange={(e) => setRecherche({ redhibitoires: e.target.value })} placeholder="Rez-de-chaussée, travaux lourds…" /></Champ>
            <Champ label="Commentaires libres" className="sm:col-span-2 lg:col-span-3"><textarea rows={2} className={inputCls} value={recherche.commentaires} onChange={(e) => setRecherche({ commentaires: e.target.value })} /></Champ>
          </div>
          {d.recherches!.length > 1 && <button type="button" onClick={() => { set({ recherches: d.recherches!.filter((_, i) => i !== rIdx) }); setRIdx(0); }} className="mt-2 text-xs font-semibold text-red-500 hover:underline">Supprimer cette recherche</button>}
        </Section>

        {/* 3. Financement */}
        <Section titre="💶 Financement">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Champ label="Apport personnel"><input type="number" className={inputCls} value={d.financement!.apport ?? ""} onChange={(e) => set({ financement: { ...d.financement!, apport: e.target.value ? +e.target.value : null } })} /></Champ>
            <Champ label="Montant financé"><input type="number" className={inputCls} value={d.financement!.montantFinancement ?? ""} onChange={(e) => set({ financement: { ...d.financement!, montantFinancement: e.target.value ? +e.target.value : null } })} /></Champ>
            <Champ label="Capacité d'emprunt estimée"><input type="number" className={inputCls} value={d.financement!.capaciteEmprunt ?? ""} onChange={(e) => set({ financement: { ...d.financement!, capaciteEmprunt: e.target.value ? +e.target.value : null } })} /></Champ>
            <Champ label="Mensualité max"><input type="number" className={inputCls} value={d.financement!.mensualiteMax ?? ""} onChange={(e) => set({ financement: { ...d.financement!, mensualiteMax: e.target.value ? +e.target.value : null } })} /></Champ>
            <Champ label="Financement validé"><select className={inputCls} value={d.financement!.financementValide} onChange={(e) => set({ financement: { ...d.financement!, financementValide: e.target.value as "oui" | "non" | "encours" } })}><option value="non">Non</option><option value="encours">En cours</option><option value="oui">Oui</option></select></Champ>
            <Champ label="Accord de principe"><label className="flex items-center gap-2 py-2 text-sm"><input type="checkbox" checked={d.financement!.accordPrincipe} onChange={(e) => set({ financement: { ...d.financement!, accordPrincipe: e.target.checked } })} /> Obtenu</label></Champ>
            <Champ label="Banque"><input className={inputCls} value={d.financement!.banque} onChange={(e) => set({ financement: { ...d.financement!, banque: e.target.value } })} /></Champ>
            <Champ label="Courtier"><input className={inputCls} value={d.financement!.courtier} onChange={(e) => set({ financement: { ...d.financement!, courtier: e.target.value } })} /></Champ>
            <Champ label="Date de l'accord"><input className={inputCls} value={d.financement!.dateAccord} onChange={(e) => set({ financement: { ...d.financement!, dateAccord: e.target.value } })} placeholder="jj/mm/aaaa" /></Champ>
          </div>

          {estInvest && (
            <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50/40 p-3">
              <div className="mb-2 text-sm font-bold text-violet-800">Objectif d'investissement</div>
              <Chips options={OBJECTIFS_INVEST} values={d.investissement?.objectifs ?? []} onToggle={(id) => set({ investissement: { ...(d.investissement ?? investissementVide()), objectifs: toggle(d.investissement?.objectifs ?? [], id) } })} />
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Champ label="Rendement min recherché (%)"><input type="number" className={inputCls} value={d.investissement?.rendementMin ?? ""} onChange={(e) => set({ investissement: { ...(d.investissement ?? investissementVide()), rendementMin: e.target.value ? +e.target.value : null } })} /></Champ>
                <Champ label="Rentabilité brute visée (%)"><input type="number" className={inputCls} value={d.investissement?.rentabiliteBrute ?? ""} onChange={(e) => set({ investissement: { ...(d.investissement ?? investissementVide()), rentabiliteBrute: e.target.value ? +e.target.value : null } })} /></Champ>
                <Champ label="Loyer cible (€/mois)"><input type="number" className={inputCls} value={d.investissement?.loyerCible ?? ""} onChange={(e) => set({ investissement: { ...(d.investissement ?? investissementVide()), loyerCible: e.target.value ? +e.target.value : null } })} /></Champ>
                <Champ label="Cash-flow min (€/mois)"><input type="number" className={inputCls} value={d.investissement?.cashflowMin ?? ""} onChange={(e) => set({ investissement: { ...(d.investissement ?? investissementVide()), cashflowMin: e.target.value ? +e.target.value : null } })} /></Champ>
                <Champ label="Type de location"><input className={inputCls} value={d.investissement?.typeLocation ?? ""} onChange={(e) => set({ investissement: { ...(d.investissement ?? investissementVide()), typeLocation: e.target.value } })} placeholder="Nue, meublée, courte durée…" /></Champ>
                <Champ label="Durée du projet"><input className={inputCls} value={d.investissement?.dureeProjet ?? ""} onChange={(e) => set({ investissement: { ...(d.investissement ?? investissementVide()), dureeProjet: e.target.value } })} /></Champ>
              </div>
            </div>
          )}
        </Section>

        {/* 4. Documents */}
        <Section titre={`📎 Documents (${d.pieces.length})`}>
          <div className="mb-3 flex flex-wrap items-end gap-3">
            <Champ label="Catégorie"><select className={`${inputCls} w-auto`} value={catDoc} onChange={(e) => setCatDoc(e.target.value)}>{CATEGORIES_DOCS_ACQUEREUR.map((c) => <option key={c}>{c}</option>)}</select></Champ>
            <label className={`cursor-pointer rounded-xl border-2 border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-500 hover:border-copper hover:text-copper ${busy ? "opacity-50" : ""}`}>{busy ? "Envoi…" : "+ Ajouter des PDF"}<input type="file" accept="application/pdf" multiple className="hidden" onChange={(e) => { void televerser(e.target.files); e.target.value = ""; }} /></label>
          </div>
          {d.pieces.length === 0 ? <p className="text-sm text-slate-400">Aucun document.</p> : (
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase text-slate-400"><tr><th className="py-1">Nom</th><th>Type</th><th>Ajouté le</th><th></th></tr></thead>
              <tbody>{[...d.pieces].sort((a, b) => b.createdAt - a.createdAt).map((p) => (
                <tr key={p.fileId} className="border-t border-slate-100"><td className="py-1.5">📄 {p.nom}</td><td><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{p.categorie}</span></td><td className="text-xs text-slate-500">{dateFr(p.createdAt)}</td>
                  <td className="text-right whitespace-nowrap"><button onClick={() => void telechargerClientFile(d.id, p.fileId, p.nom)} className="mr-1 rounded px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-100">⬇</button><button onClick={() => void suppDoc(p.fileId, p.nom)} className="rounded px-2 py-0.5 text-xs text-red-500 hover:bg-red-50">✕</button></td></tr>
              ))}</tbody>
            </table>
          )}
        </Section>

        {/* 5. Biens correspondant à cette recherche */}
        <BiensCorrespondant recherche={recherche} />

        {/* 6. Historique */}
        <Section titre="🕒 Historique & suivi" defautOuvert={false}>
          <AjoutEvenement onAdd={ajouterEvenement} />
          {(d.timeline ?? []).length === 0 ? <p className="mt-2 text-sm text-slate-400">Aucun évènement.</p> : (
            <ul className="mt-3 space-y-2">{(d.timeline ?? []).map((ev) => (
              <li key={ev.id} className="flex gap-2 text-sm"><span className="mt-0.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-500">{TYPES_TIMELINE.find((t) => t.id === ev.type)?.label ?? ev.type}</span><div><div className="text-slate-800">{ev.texte}</div><div className="text-xs text-slate-400">{dateFr(ev.date)}{ev.auteur && ev.auteur !== "—" ? ` · ${ev.auteur}` : ""}</div></div></li>
            ))}</ul>
          )}
        </Section>
      </div>

      {/* Barre de sauvegarde flottante */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <span className="text-xs text-slate-500">{dirty ? "Modifications non enregistrées" : "À jour"}{msg && <span className="ml-2 font-semibold text-copper">{msg}</span>}</span>
          <button onClick={() => void enregistrer()} disabled={saving || !dirty} className="rounded-lg bg-copper px-6 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{saving ? "Enregistrement…" : "Enregistrer la fiche"}</button>
        </div>
      </div>
    </div>
  );
}

// Recalcule le résumé « bien » à partir de la 1re recherche (pour la liste)
function resumeDepuisRecherche(d: ClientDossier): string {
  const r = d.recherches?.[0];
  if (!r) return d.bien;
  const types = r.typesBien.join("/");
  return [types, r.villes.join(", "), r.budgetMax ? `≤ ${int.format(r.budgetMax)} €` : ""].filter(Boolean).join(" · ");
}

function AjoutEvenement({ onAdd }: { onAdd: (type: string, texte: string) => void }) {
  const [type, setType] = useState(TYPES_TIMELINE[0].id);
  const [texte, setTexte] = useState("");
  return (
    <div className="flex flex-wrap items-end gap-2">
      <select className={`${inputCls} w-auto`} value={type} onChange={(e) => setType(e.target.value)}>{TYPES_TIMELINE.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</select>
      <input className={`${inputCls} min-w-[200px] flex-1`} value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Ex. Appel — recentre sa recherche sur Martigues" />
      <button type="button" onClick={() => { onAdd(type, texte); setTexte(""); }} className="rounded-lg bg-navy px-4 py-1.5 text-sm font-bold text-white hover:bg-navy-deep">Ajouter</button>
    </div>
  );
}

// Rapprochement inverse : les biens (estimations) correspondant à la recherche
function BiensCorrespondant({ recherche }: { recherche: RechercheImmo }) {
  const [ouvert, setOuvert] = useState(false);
  const [biens, setBiens] = useState<{ nom: string; ville: string; score: number; niveau: string; prix: number | null; resume: string }[] | null>(null);

  useEffect(() => {
    if (!ouvert || biens) return;
    (async () => {
      const metas = await listEstimations();
      const cibles = metas.slice(0, 40);
      const out: { nom: string; ville: string; score: number; niveau: string; prix: number | null; resume: string }[] = [];
      for (const m of cibles) {
        const full = await getEstimation(m.id).catch(() => null);
        if (!full?.input) continue;
        const bien = bienDepuisEstimation(full.input, full.result?.report);
        const res = scorerRecherche(bien, recherche);
        if (res.niveau) out.push({ nom: m.bien || m.client, ville: bien.ville, score: res.score, niveau: NIVEAUX[res.niveau].label, prix: bien.prix, resume: `${bien.typeBien} · ${bien.surface ?? "?"} m² · ${bien.nbPieces ?? "?"} p.` });
      }
      setBiens(out.sort((a, b) => b.score - a.score));
    })();
  }, [ouvert, biens, recherche]);

  return (
    <Section titre="🏠 Biens correspondant à cette recherche" defautOuvert={false}>
      {!ouvert ? (
        <button type="button" onClick={() => setOuvert(true)} className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white hover:bg-navy-deep">Rechercher les biens correspondants</button>
      ) : biens === null ? (
        <p className="text-sm text-slate-400">Analyse des biens de l&apos;agence…</p>
      ) : biens.length === 0 ? (
        <p className="text-sm text-slate-400">Aucun bien de la base ne correspond suffisamment à cette recherche pour l&apos;instant.</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {biens.map((b, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center justify-between"><span className="font-semibold text-navy">{b.nom}</span><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">{b.score}%</span></div>
              <div className="text-xs text-slate-500">{b.ville} · {b.resume} · {eur(b.prix)}</div>
              <div className="mt-1 text-[11px] font-semibold text-slate-400">{b.niveau}</div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
