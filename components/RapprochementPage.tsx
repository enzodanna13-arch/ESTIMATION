"use client";

import { useEffect, useMemo, useState } from "react";
import { listClients } from "@/lib/clients";
import type { ClientDossier, RechercheImmo } from "@/lib/serverHistory";
import { scorerRecherche, rapprocherAcquereurs, NIVEAUX, type BienCriteres, type ResultatMatch } from "@/lib/matching";
import { listBiensRapprochement, LABEL_SOURCE, type BienNormalise, type SourceBien } from "@/lib/rapprochement";
import {
  listMandats, saveMandat, deleteMandat, mandatVide,
  TYPES_MANDAT, STATUTS_MANDAT, TYPES_BIEN_MANDAT, EXTERIEURS_MANDAT, type MandatVente,
} from "@/lib/mandatsVente";
import { NEGOCIATEURS } from "@/lib/equipe";

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const inputCls = "w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm focus:border-copper focus:outline-none";
const COUL: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  slate: "bg-slate-100 text-slate-600 border-slate-200",
};

function BadgeNiveau({ resultat }: { resultat: ResultatMatch }) {
  if (!resultat.niveau) return null;
  const n = NIVEAUX[resultat.niveau];
  return <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${COUL[n.couleur]}`}>{resultat.score} · {n.label}</span>;
}

const norm = (s: string) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

// Meilleure recherche active d'un acquéreur pour un bien donné.
function meilleurPourAcq(criteres: BienCriteres, d: ClientDossier): { recherche: RechercheImmo; resultat: ResultatMatch } | null {
  let best: { recherche: RechercheImmo; resultat: ResultatMatch } | null = null;
  for (const r of (d.recherches ?? []).filter((x) => x.actif !== false)) {
    const resultat = scorerRecherche(criteres, r);
    if (resultat.niveau && (!best || resultat.score > best.resultat.score)) best = { recherche: r, resultat };
  }
  return best;
}

const nomAcq = (d: ClientDossier) => [d.prenom, d.nom].filter(Boolean).join(" ") || d.nom || "Acquéreur";

export default function RapprochementPage({ onRetour }: { onRetour: () => void }) {
  const [biens, setBiens] = useState<BienNormalise[]>([]);
  const [acq, setAcq] = useState<ClientDossier[]>([]);
  const [chargement, setChargement] = useState(true);
  const [tab, setTab] = useState<"bien" | "acquereur" | "mandats">("bien");

  const charger = async () => {
    setChargement(true);
    const [b, clients] = await Promise.all([listBiensRapprochement(), listClients()]);
    setBiens(b);
    setAcq(clients.filter((c) => c.typeClient === "acquereur" || c.typeClient === "investisseur"));
    setChargement(false);
  };
  useEffect(() => { void charger(); }, []);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">🔗 Rapprochement acquéreurs</h2>
          <p className="text-sm text-slate-500">Croisez vos acquéreurs avec vos biens — estimations, chasse et mandats de vente — dans les deux sens, avec filtres.</p>
        </div>
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">← Retour</button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 text-sm text-slate-500">
        <span><b className="text-slate-800">{biens.length}</b> biens à vendre</span>
        <span><b className="text-slate-800">{acq.length}</b> acquéreurs actifs</span>
        <span className="text-slate-400">Sources : {biens.filter((b) => b.source === "estimation").length} estimations · {biens.filter((b) => b.source === "chasse").length} chasse · {biens.filter((b) => b.source === "mandat").length} mandats</span>
      </div>

      <div className="mb-5 flex gap-1 border-b border-slate-200">
        {([["bien", "🏠 Par bien → acquéreurs"], ["acquereur", "🔑 Par acquéreur → biens"], ["mandats", "📜 Mandats de vente"]] as const).map(([v, t]) => (
          <button key={v} onClick={() => setTab(v)} className={`px-4 py-2 text-sm font-semibold ${tab === v ? "border-b-2 border-copper text-copper" : "text-slate-500 hover:text-slate-700"}`}>{t}</button>
        ))}
      </div>

      {chargement ? (
        <p className="text-sm text-slate-500">Chargement…</p>
      ) : tab === "bien" ? (
        <ParBien biens={biens} acq={acq} />
      ) : tab === "acquereur" ? (
        <ParAcquereur biens={biens} acq={acq} />
      ) : (
        <MandatsManager onChange={() => void charger()} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MODE 1 : par bien -> acquéreurs
// ---------------------------------------------------------------------------
function ParBien({ biens, acq }: { biens: BienNormalise[]; acq: ClientDossier[] }) {
  const [sel, setSel] = useState<string>("");
  const [sources, setSources] = useState<Record<SourceBien, boolean>>({ estimation: true, chasse: true, mandat: true });
  const [ville, setVille] = useState("");
  const [type, setType] = useState("");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [nego, setNego] = useState("");
  const [texte, setTexte] = useState("");

  const filtres = useMemo(() => biens.filter((b) => {
    if (!sources[b.source]) return false;
    if (ville && !norm(b.ville).includes(norm(ville))) return false;
    if (type && b.typeBien !== type) return false;
    if (prixMin && (b.prix ?? 0) < Number(prixMin)) return false;
    if (prixMax && (b.prix ?? Infinity) > Number(prixMax)) return false;
    if (nego && norm(b.negociateur) !== norm(nego)) return false;
    if (texte) { const t = norm(texte); if (!norm(`${b.titre} ${b.vendeur} ${b.ref} ${b.ville}`).includes(t)) return false; }
    return true;
  }), [biens, sources, ville, type, prixMin, prixMax, nego, texte]);

  const bien = filtres.find((b) => b.id === sel && sources[b.source]) ?? null;
  const matches = useMemo(() => (bien ? rapprocherAcquereurs(bien.criteres, acq) : []), [bien, acq]);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* Colonne biens */}
      <div>
        <FiltresBiens {...{ sources, setSources, ville, setVille, type, setType, prixMin, setPrixMin, prixMax, setPrixMax, nego, setNego, texte, setTexte }} />
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{filtres.length} bien(s)</p>
        <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
          {filtres.map((b) => (
            <button key={`${b.source}-${b.id}`} onClick={() => setSel(b.id)} className={`w-full rounded-lg border p-3 text-left transition ${sel === b.id ? "border-copper bg-copper/5" : "border-slate-200 bg-white hover:border-slate-300"}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate font-semibold text-slate-800">{b.titre}</div>
                  <div className="truncate text-xs text-slate-500">{[b.typeBien, b.surface ? `${b.surface} m²` : "", b.nbPieces ? `${b.nbPieces} p.` : ""].filter(Boolean).join(" · ")}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-bold text-slate-800">{b.prix ? euro.format(b.prix) : "—"}</div>
                  <span className="text-[10px] uppercase tracking-wide text-slate-400">{LABEL_SOURCE[b.source]}</span>
                </div>
              </div>
            </button>
          ))}
          {filtres.length === 0 && <p className="text-sm text-slate-400">Aucun bien avec ces filtres.</p>}
        </div>
      </div>

      {/* Colonne acquéreurs correspondants */}
      <div>
        {!bien ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">Sélectionnez un bien pour voir les acquéreurs correspondants.</div>
        ) : (
          <>
            <div className="mb-3 rounded-lg bg-slate-50 p-3">
              <div className="font-bold text-slate-800">{bien.titre}</div>
              <div className="text-sm text-slate-500">{[bien.prix ? euro.format(bien.prix) : "", bien.typeBien, bien.surface ? `${bien.surface} m²` : "", bien.ville].filter(Boolean).join(" · ")}</div>
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{matches.length} acquéreur(s) correspondant(s)</p>
            <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
              {matches.map((m) => (
                <div key={m.dossier.id} className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-800">{nomAcq(m.dossier)}</div>
                      <div className="text-xs text-slate-500">{[m.dossier.negociateur, m.dossier.tel, m.dossier.email].filter(Boolean).join(" · ")}</div>
                    </div>
                    <BadgeNiveau resultat={m.resultat} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.resultat.details.map((d) => (
                      <span key={d.cle} className={`rounded px-1.5 py-0.5 text-[11px] ${d.etat === "ok" ? "bg-emerald-50 text-emerald-700" : d.etat === "partiel" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"}`}>{d.label} : {d.texte}</span>
                    ))}
                  </div>
                </div>
              ))}
              {matches.length === 0 && <p className="text-sm text-slate-400">Aucun acquéreur ne correspond (selon les critères enregistrés).</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MODE 2 : par acquéreur -> biens
// ---------------------------------------------------------------------------
function ParAcquereur({ biens, acq }: { biens: BienNormalise[]; acq: ClientDossier[] }) {
  const [sel, setSel] = useState<string>("");
  const [sources, setSources] = useState<Record<SourceBien, boolean>>({ estimation: true, chasse: true, mandat: true });
  const [nego, setNego] = useState("");
  const [texte, setTexte] = useState("");

  const acqFiltres = useMemo(() => acq.filter((d) => {
    if (nego && norm(d.negociateur) !== norm(nego)) return false;
    if (texte) { const t = norm(texte); if (!norm(`${nomAcq(d)} ${d.tel ?? ""} ${d.email ?? ""}`).includes(t)) return false; }
    return true;
  }), [acq, nego, texte]);

  const dossier = acqFiltres.find((d) => d.id === sel) ?? null;
  const biensSource = useMemo(() => biens.filter((b) => sources[b.source]), [biens, sources]);
  const resultats = useMemo(() => {
    if (!dossier) return [] as { bien: BienNormalise; recherche: RechercheImmo; resultat: ResultatMatch }[];
    const out: { bien: BienNormalise; recherche: RechercheImmo; resultat: ResultatMatch }[] = [];
    for (const b of biensSource) {
      const best = meilleurPourAcq(b.criteres, dossier);
      if (best) out.push({ bien: b, recherche: best.recherche, resultat: best.resultat });
    }
    return out.sort((a, z) => z.resultat.score - a.resultat.score);
  }, [dossier, biensSource]);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* Colonne acquéreurs */}
      <div>
        <div className="mb-3 grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
          <select className={inputCls} value={nego} onChange={(e) => setNego(e.target.value)}>
            <option value="">Tous négociateurs</option>
            {NEGOCIATEURS.map((n) => <option key={n}>{n}</option>)}
          </select>
          <input className={inputCls} value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Rechercher un acquéreur…" />
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{acqFiltres.length} acquéreur(s)</p>
        <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
          {acqFiltres.map((d) => {
            const rech = (d.recherches ?? []).filter((r) => r.actif !== false);
            const r0 = rech[0];
            return (
              <button key={d.id} onClick={() => setSel(d.id)} className={`w-full rounded-lg border p-3 text-left transition ${sel === d.id ? "border-copper bg-copper/5" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                <div className="font-semibold text-slate-800">{nomAcq(d)}</div>
                <div className="truncate text-xs text-slate-500">
                  {r0 ? [r0.villes.join(", "), r0.budgetMax ? `≤ ${euro.format(r0.budgetMax)}` : "", (r0.typesBien ?? []).join("/")].filter(Boolean).join(" · ") : "Aucune recherche active"}
                </div>
                <div className="text-[11px] text-slate-400">{d.negociateur}{rech.length > 1 ? ` · ${rech.length} recherches` : ""}</div>
              </button>
            );
          })}
          {acqFiltres.length === 0 && <p className="text-sm text-slate-400">Aucun acquéreur avec ces filtres.</p>}
        </div>
      </div>

      {/* Colonne biens correspondants */}
      <div>
        {!dossier ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">Sélectionnez un acquéreur pour voir les biens qui lui correspondent.</div>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {(Object.keys(sources) as SourceBien[]).map((s) => (
                <label key={s} className="flex items-center gap-1.5 text-xs text-slate-600"><input type="checkbox" checked={sources[s]} onChange={(e) => setSources({ ...sources, [s]: e.target.checked })} /> {LABEL_SOURCE[s]}</label>
              ))}
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{resultats.length} bien(s) correspondant(s)</p>
            <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
              {resultats.map(({ bien, resultat }) => (
                <div key={`${bien.source}-${bien.id}`} className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-slate-800">{bien.titre}</div>
                      <div className="truncate text-xs text-slate-500">{[bien.prix ? euro.format(bien.prix) : "—", bien.typeBien, bien.surface ? `${bien.surface} m²` : "", LABEL_SOURCE[bien.source]].filter(Boolean).join(" · ")}</div>
                    </div>
                    <BadgeNiveau resultat={resultat} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {resultat.details.map((d) => (
                      <span key={d.cle} className={`rounded px-1.5 py-0.5 text-[11px] ${d.etat === "ok" ? "bg-emerald-50 text-emerald-700" : d.etat === "partiel" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"}`}>{d.label} : {d.texte}</span>
                    ))}
                  </div>
                </div>
              ))}
              {resultats.length === 0 && <p className="text-sm text-slate-400">Aucun bien ne correspond à cet acquéreur.</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FiltresBiens(p: {
  sources: Record<SourceBien, boolean>; setSources: (s: Record<SourceBien, boolean>) => void;
  ville: string; setVille: (v: string) => void; type: string; setType: (v: string) => void;
  prixMin: string; setPrixMin: (v: string) => void; prixMax: string; setPrixMax: (v: string) => void;
  nego: string; setNego: (v: string) => void; texte: string; setTexte: (v: string) => void;
}) {
  return (
    <div className="mb-3 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap gap-3">
        {(Object.keys(p.sources) as SourceBien[]).map((s) => (
          <label key={s} className="flex items-center gap-1.5 text-xs text-slate-600"><input type="checkbox" checked={p.sources[s]} onChange={(e) => p.setSources({ ...p.sources, [s]: e.target.checked })} /> {LABEL_SOURCE[s]}</label>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <input className={inputCls} value={p.ville} onChange={(e) => p.setVille(e.target.value)} placeholder="Ville" />
        <select className={inputCls} value={p.type} onChange={(e) => p.setType(e.target.value)}>
          <option value="">Tous types</option>
          {TYPES_BIEN_MANDAT.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input className={inputCls} type="number" value={p.prixMin} onChange={(e) => p.setPrixMin(e.target.value)} placeholder="Prix min €" />
        <input className={inputCls} type="number" value={p.prixMax} onChange={(e) => p.setPrixMax(e.target.value)} placeholder="Prix max €" />
        <select className={inputCls} value={p.nego} onChange={(e) => p.setNego(e.target.value)}>
          <option value="">Tous négociateurs</option>
          {NEGOCIATEURS.map((n) => <option key={n}>{n}</option>)}
        </select>
        <input className={inputCls} value={p.texte} onChange={(e) => p.setTexte(e.target.value)} placeholder="Rechercher (adresse, vendeur…)" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ONGLET 3 : gestion des mandats de vente
// ---------------------------------------------------------------------------
function MandatsManager({ onChange }: { onChange: () => void }) {
  const [liste, setListe] = useState<MandatVente[]>([]);
  const [chargement, setChargement] = useState(true);
  const [edit, setEdit] = useState<MandatVente | null>(null);

  const charger = async () => { setChargement(true); setListe(await listMandats()); setChargement(false); };
  useEffect(() => { void charger(); }, []);

  const enregistrer = async () => {
    if (!edit) return;
    const m = await saveMandat(edit);
    if (m) { setEdit(null); await charger(); onChange(); }
    else alert("Enregistrement impossible (accès ou réseau).");
  };
  const supprimer = async (id: string) => { if (!confirm("Supprimer ce mandat ?")) return; await deleteMandat(id); await charger(); onChange(); };

  if (edit) {
    const set = (champs: Partial<MandatVente>) => setEdit({ ...edit, ...champs });
    const toggleExt = (e: string) => set({ exterieurs: edit.exterieurs.includes(e) ? edit.exterieurs.filter((x) => x !== e) : [...edit.exterieurs, e] });
    return (
      <div className="max-w-3xl">
        <h3 className="mb-3 text-lg font-bold text-slate-800">{edit.id ? "Modifier le mandat" : "Nouveau mandat de vente"}</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <L label="Type de mandat"><select className={inputCls} value={edit.type} onChange={(e) => set({ type: e.target.value })}>{TYPES_MANDAT.map((t) => <option key={t}>{t}</option>)}</select></L>
          <L label="Statut"><select className={inputCls} value={edit.statut} onChange={(e) => set({ statut: e.target.value })}>{STATUTS_MANDAT.map((t) => <option key={t}>{t}</option>)}</select></L>
          <L label="Négociateur"><select className={inputCls} value={edit.negociateur} onChange={(e) => set({ negociateur: e.target.value })}><option value="">— choisir —</option>{NEGOCIATEURS.map((n) => <option key={n}>{n}</option>)}</select></L>
          <L label="Vendeur (nom)"><input className={inputCls} value={edit.vendeurNom} onChange={(e) => set({ vendeurNom: e.target.value })} /></L>
          <L label="Téléphone vendeur"><input className={inputCls} value={edit.vendeurTel} onChange={(e) => set({ vendeurTel: e.target.value })} /></L>
          <L label="Email vendeur"><input className={inputCls} value={edit.vendeurEmail} onChange={(e) => set({ vendeurEmail: e.target.value })} /></L>
          <L label="Adresse du bien" className="sm:col-span-2"><input className={inputCls} value={edit.adresse} onChange={(e) => set({ adresse: e.target.value })} /></L>
          <L label="Code postal"><input className={inputCls} value={edit.codePostal} onChange={(e) => set({ codePostal: e.target.value })} /></L>
          <L label="Ville"><input className={inputCls} value={edit.ville} onChange={(e) => set({ ville: e.target.value })} /></L>
          <L label="Quartier / secteur"><input className={inputCls} value={edit.quartier} onChange={(e) => set({ quartier: e.target.value })} /></L>
          <L label="Type de bien"><select className={inputCls} value={edit.typeBien} onChange={(e) => set({ typeBien: e.target.value })}>{TYPES_BIEN_MANDAT.map((t) => <option key={t} value={t}>{t}</option>)}</select></L>
          <L label="Prix de présentation (€)"><input type="number" className={inputCls} value={edit.prix ?? ""} onChange={(e) => set({ prix: e.target.value ? Number(e.target.value) : null })} /></L>
          <L label="Honoraires (€)"><input type="number" className={inputCls} value={edit.honoraires ?? ""} onChange={(e) => set({ honoraires: e.target.value ? Number(e.target.value) : null })} /></L>
          <L label="Surface (m²)"><input type="number" className={inputCls} value={edit.surface ?? ""} onChange={(e) => set({ surface: e.target.value ? Number(e.target.value) : null })} /></L>
          <L label="Pièces"><input type="number" className={inputCls} value={edit.nbPieces ?? ""} onChange={(e) => set({ nbPieces: e.target.value ? Number(e.target.value) : null })} /></L>
          <L label="Chambres"><input type="number" className={inputCls} value={edit.nbChambres ?? ""} onChange={(e) => set({ nbChambres: e.target.value ? Number(e.target.value) : null })} /></L>
          <L label="Étage"><input className={inputCls} value={edit.etage} onChange={(e) => set({ etage: e.target.value })} /></L>
          <L label="DPE"><input className={inputCls} value={edit.dpe} onChange={(e) => set({ dpe: e.target.value.toUpperCase().slice(0, 2) })} placeholder="D" /></L>
          <L label="Date du mandat"><input type="date" className={inputCls} value={edit.dateMandat} onChange={(e) => set({ dateMandat: e.target.value })} /></L>
          <L label="Fin de mandat"><input type="date" className={inputCls} value={edit.dateFin} onChange={(e) => set({ dateFin: e.target.value })} /></L>
          <div className="sm:col-span-2 lg:col-span-3">
            <span className="mb-1 block text-xs font-semibold text-slate-600">Atouts</span>
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              {EXTERIEURS_MANDAT.map((e) => <label key={e} className="flex items-center gap-1.5"><input type="checkbox" checked={edit.exterieurs.includes(e)} onChange={() => toggleExt(e)} /> {e}</label>)}
              <label className="flex items-center gap-1.5"><input type="checkbox" checked={edit.ascenseur} onChange={(e) => set({ ascenseur: e.target.checked })} /> ascenseur</label>
              <label className="flex items-center gap-1.5"><input type="checkbox" checked={edit.garage} onChange={(e) => set({ garage: e.target.checked })} /> garage</label>
              <label className="flex items-center gap-1.5"><input type="checkbox" checked={edit.stationnement} onChange={(e) => set({ stationnement: e.target.checked })} /> stationnement</label>
              <label className="flex items-center gap-1.5"><input type="checkbox" checked={edit.cave} onChange={(e) => set({ cave: e.target.checked })} /> cave</label>
              <label className="flex items-center gap-1.5"><input type="checkbox" checked={edit.travaux} onChange={(e) => set({ travaux: e.target.checked })} /> travaux à prévoir</label>
            </div>
          </div>
          <L label="Notes" className="sm:col-span-2 lg:col-span-3"><textarea rows={2} className={inputCls} value={edit.notes} onChange={(e) => set({ notes: e.target.value })} /></L>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={() => void enregistrer()} className="rounded-lg bg-copper px-4 py-2 text-sm font-bold text-white hover:brightness-110">💾 Enregistrer</button>
          <button onClick={() => setEdit(null)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Annuler</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => setEdit({ ...mandatVide() })} className="mb-4 rounded-lg bg-copper px-4 py-2 text-sm font-bold text-white hover:brightness-110">+ Nouveau mandat de vente</button>
      {chargement ? (
        <p className="text-sm text-slate-500">Chargement…</p>
      ) : liste.length === 0 ? (
        <p className="text-sm text-slate-400">Aucun mandat de vente. Les mandats actifs alimentent le rapprochement.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {liste.map((m) => (
            <div key={m.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-copper">{m.reference} · {m.type}</div>
                  <div className="truncate font-bold text-slate-800">{m.adresse || m.vendeurNom || "Sans adresse"}</div>
                  <div className="text-xs text-slate-500">{[m.typeBien, m.surface ? `${m.surface} m²` : "", m.ville].filter(Boolean).join(" · ")}</div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${m.statut === "Actif" ? "bg-emerald-100 text-emerald-700" : m.statut === "Vendu" ? "bg-slate-200 text-slate-500" : "bg-amber-100 text-amber-700"}`}>{m.statut}</span>
              </div>
              <div className="mt-2 text-lg font-bold text-slate-800">{m.prix ? euro.format(m.prix) : "—"}</div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEdit(m)} className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Modifier</button>
                <button onClick={() => void supprimer(m.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-red-400 hover:bg-red-50 hover:text-red-600">Suppr.</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function L({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`block ${className}`}><span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>{children}</label>;
}
