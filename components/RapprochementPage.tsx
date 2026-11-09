"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { listClients } from "@/lib/clients";
import type { ClientDossier, RechercheImmo } from "@/lib/serverHistory";
import { getHistoryKey } from "@/lib/history";
import { scorerRecherche, rapprocherAcquereurs, NIVEAUX, type BienCriteres, type ResultatMatch } from "@/lib/matching";
import {
  listBiensRapprochement, LABEL_SOURCE, getSuivi, setSuivi as apiSetSuivi, cleSuivi, STATUTS_RAPPRO,
  type BienNormalise, type SourceBien, type SuiviMap, type StatutRappro,
} from "@/lib/rapprochement";
import {
  listMandats, saveMandat, deleteMandat, mandatVide, ajouterPhotoMandat, supprimerPhotoMandat, urlPhotoMandat, compresserPhoto,
  TYPES_MANDAT, STATUTS_MANDAT, TYPES_BIEN_MANDAT, EXTERIEURS_MANDAT, type MandatVente,
} from "@/lib/mandatsVente";
import { NEGOCIATEURS } from "@/lib/equipe";
import RapprochementCarte, { type PointCarte } from "@/components/RapprochementCarte";

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const inputCls = "w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm focus:border-copper focus:outline-none";
const COUL: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  slate: "bg-slate-100 text-slate-600 border-slate-200",
};
const COUL_HEX: Record<string, string> = { emerald: "#059669", amber: "#d97706", slate: "#64748b" };
const ICONE_SOURCE: Record<SourceBien, string> = { estimation: "🏠", chasse: "🔭", mandat: "📜" };
const COUL_STATUT: Record<string, string> = {
  "Nouveau": "bg-slate-100 text-slate-500", "À contacter": "bg-blue-100 text-blue-700", "Proposé": "bg-indigo-100 text-indigo-700",
  "Visite": "bg-amber-100 text-amber-700", "Refusé": "bg-rose-100 text-rose-600", "Accepté": "bg-emerald-100 text-emerald-700",
};

const norm = (s: string) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const nomAcq = (d: ClientDossier) => [d.prenom, d.nom].filter(Boolean).join(" ") || d.nom || "Acquéreur";

function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371; const toR = (x: number) => (x * Math.PI) / 180;
  const dLat = toR(b.lat - a.lat), dLon = toR(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toR(a.lat)) * Math.cos(toR(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function meilleurPourAcq(criteres: BienCriteres, d: ClientDossier): { recherche: RechercheImmo; resultat: ResultatMatch } | null {
  let best: { recherche: RechercheImmo; resultat: ResultatMatch } | null = null;
  for (const r of (d.recherches ?? []).filter((x) => x.actif !== false)) {
    const resultat = scorerRecherche(criteres, r);
    if (resultat.niveau && (!best || resultat.score > best.resultat.score)) best = { recherche: r, resultat };
  }
  return best;
}

function BadgeNiveau({ resultat }: { resultat: ResultatMatch }) {
  if (!resultat.niveau) return null;
  const n = NIVEAUX[resultat.niveau];
  return <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-bold ${COUL[n.couleur]}`}>{resultat.score}%</span>;
}

function StatutSelect({ valeur, onChange }: { valeur: StatutRappro; onChange: (s: StatutRappro) => void }) {
  return (
    <select value={valeur} onChange={(e) => onChange(e.target.value as StatutRappro)} onClick={(e) => e.stopPropagation()}
      className={`rounded-md border-0 px-2 py-1 text-xs font-semibold ${COUL_STATUT[valeur] ?? COUL_STATUT.Nouveau}`}>
      {STATUTS_RAPPRO.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}

// Carte d'un bien correspondant (photo + infos + score + statut + critères).
function BienCard({ bien, resultat, distance, statut, onStatut }: {
  bien: BienNormalise; resultat: ResultatMatch; distance?: number | null; statut: StatutRappro; onStatut: (s: StatutRappro) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex">
        <div className="h-28 w-32 shrink-0 bg-slate-100">
          {bien.photo
            ? // eslint-disable-next-line @next/next/no-img-element
              <img src={bien.photo} alt={bien.titre} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            : <div className="flex h-full w-full items-center justify-center text-3xl text-slate-300">{ICONE_SOURCE[bien.source]}</div>}
        </div>
        <div className="min-w-0 flex-1 p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate font-semibold text-slate-800">{bien.titre}</div>
              <div className="truncate text-xs text-slate-500">{[bien.typeBien, bien.surface ? `${bien.surface} m²` : "", bien.nbPieces ? `${bien.nbPieces} p.` : "", bien.ville].filter(Boolean).join(" · ")}</div>
            </div>
            <BadgeNiveau resultat={resultat} />
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-bold text-slate-800">{bien.prix ? euro.format(bien.prix) : "—"}</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-500">{LABEL_SOURCE[bien.source]}</span>
            {typeof distance === "number" && <span className="text-xs text-slate-400">· {distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`}</span>}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 px-3 py-2">
        {resultat.details.slice(0, 6).map((d) => (
          <span key={d.cle} className={`rounded px-1.5 py-0.5 text-[11px] ${d.etat === "ok" ? "bg-emerald-50 text-emerald-700" : d.etat === "partiel" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"}`}>{d.label} : {d.texte}</span>
        ))}
        <div className="ml-auto flex items-center gap-2">
          {bien.lien && <a href={bien.lien} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-xs text-copper hover:underline">Annonce ↗</a>}
          <StatutSelect valeur={statut} onChange={onStatut} />
        </div>
      </div>
    </div>
  );
}

export default function RapprochementPage({ onRetour }: { onRetour: () => void }) {
  const [biens, setBiens] = useState<BienNormalise[]>([]);
  const [acq, setAcq] = useState<ClientDossier[]>([]);
  const [suivi, setSuivi] = useState<SuiviMap>({});
  const [chargement, setChargement] = useState(true);
  const [tab, setTab] = useState<"acquereur" | "bien" | "mandats">("acquereur");

  const charger = async () => {
    setChargement(true);
    const [b, clients, s] = await Promise.all([listBiensRapprochement(), listClients(), getSuivi()]);
    setBiens(b);
    setAcq(clients.filter((c) => c.typeClient === "acquereur" || c.typeClient === "investisseur"));
    setSuivi(s);
    setChargement(false);
  };
  useEffect(() => { void charger(); }, []);

  const changerStatut = async (cle: string, statut: StatutRappro) => {
    setSuivi((cur) => ({ ...cur, [cle]: { statut, updatedAt: Date.now() } })); // optimiste
    const maj = await apiSetSuivi(cle, statut);
    if (maj && Object.keys(maj).length >= 0) setSuivi(maj);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">🔗 Rapprochement acquéreurs</h2>
          <p className="text-sm text-slate-500">Pour chaque acquéreur, les biens qui lui correspondent — carte, photos, score et suivi.</p>
        </div>
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">← Retour</button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 text-sm text-slate-500">
        <span><b className="text-slate-800">{acq.length}</b> acquéreurs</span>
        <span><b className="text-slate-800">{biens.length}</b> biens à vendre</span>
        <span className="text-slate-400">{biens.filter((b) => b.source === "estimation").length} estim. · {biens.filter((b) => b.source === "chasse").length} chasse · {biens.filter((b) => b.source === "mandat").length} mandats</span>
      </div>

      <div className="mb-5 flex gap-1 border-b border-slate-200">
        {([["acquereur", "🔑 Par acquéreur"], ["bien", "🏠 Par bien"], ["mandats", "📜 Mandats de vente"]] as const).map(([v, t]) => (
          <button key={v} onClick={() => setTab(v)} className={`px-4 py-2 text-sm font-semibold ${tab === v ? "border-b-2 border-copper text-copper" : "text-slate-500 hover:text-slate-700"}`}>{t}</button>
        ))}
      </div>

      {chargement ? (
        <p className="text-sm text-slate-500">Chargement…</p>
      ) : tab === "acquereur" ? (
        <VueAcquereur biens={biens} acq={acq} suivi={suivi} onStatut={changerStatut} />
      ) : tab === "bien" ? (
        <VueBien biens={biens} acq={acq} suivi={suivi} onStatut={changerStatut} />
      ) : (
        <MandatsManager onChange={() => void charger()} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// VUE PRINCIPALE : par acquéreur (carte + photos + statut)
// ---------------------------------------------------------------------------
function VueAcquereur({ biens, acq, suivi, onStatut }: { biens: BienNormalise[]; acq: ClientDossier[]; suivi: SuiviMap; onStatut: (cle: string, s: StatutRappro) => void }) {
  const [sel, setSel] = useState<string>("");
  const [nego, setNego] = useState("");
  const [texte, setTexte] = useState("");
  const [avecMatchs, setAvecMatchs] = useState(false);
  const [sources, setSources] = useState<Record<SourceBien, boolean>>({ estimation: true, chasse: true, mandat: true });
  const [centres, setCentres] = useState<Record<string, { lat: number; lon: number; label: string } | null>>({});

  const biensSource = useMemo(() => biens.filter((b) => sources[b.source]), [biens, sources]);

  // Matches par acquéreur (sur la source filtrée)
  const matchsAcq = useMemo(() => {
    const map = new Map<string, { bien: BienNormalise; resultat: ResultatMatch }[]>();
    for (const d of acq) {
      const out: { bien: BienNormalise; resultat: ResultatMatch }[] = [];
      for (const b of biensSource) { const best = meilleurPourAcq(b.criteres, d); if (best) out.push({ bien: b, resultat: best.resultat }); }
      out.sort((a, z) => z.resultat.score - a.resultat.score);
      map.set(d.id, out);
    }
    return map;
  }, [acq, biensSource]);

  const acqFiltres = useMemo(() => acq.filter((d) => {
    if (nego && norm(d.negociateur) !== norm(nego)) return false;
    if (texte && !norm(`${nomAcq(d)} ${d.tel ?? ""} ${d.email ?? ""}`).includes(norm(texte))) return false;
    if (avecMatchs && (matchsAcq.get(d.id)?.length ?? 0) === 0) return false;
    return true;
  }), [acq, nego, texte, avecMatchs, matchsAcq]);

  const dossier = acqFiltres.find((d) => d.id === sel) ?? null;
  const matches = dossier ? (matchsAcq.get(dossier.id) ?? []) : [];

  // Géocode le secteur de l'acquéreur sélectionné (1re ville), mémorisé.
  useEffect(() => {
    if (!dossier || dossier.id in centres) return;
    const r0 = (dossier.recherches ?? []).find((r) => r.actif !== false);
    const ville = r0?.villes?.[0] ?? "";
    if (!ville) { setCentres((c) => ({ ...c, [dossier.id]: null })); return; }
    (async () => {
      try {
        const res = await fetch("/api/chasse/geocode", { method: "POST", headers: { "content-type": "application/json", "x-history-key": getHistoryKey() }, body: JSON.stringify({ ville }) });
        const b = (await res.json()) as { trouve?: boolean; lat?: number; lon?: number };
        setCentres((c) => ({ ...c, [dossier.id]: b.trouve && typeof b.lat === "number" && typeof b.lon === "number" ? { lat: b.lat, lon: b.lon, label: ville } : null }));
      } catch { setCentres((c) => ({ ...c, [dossier.id]: null })); }
    })();
  }, [dossier, centres]);

  const centre = dossier ? centres[dossier.id] ?? null : null;
  const points: PointCarte[] = useMemo(() => matches
    .filter((m) => typeof m.bien.lat === "number" && typeof m.bien.lon === "number" && m.resultat.niveau)
    .map((m) => ({ id: `${m.bien.source}-${m.bien.id}`, lat: m.bien.lat as number, lon: m.bien.lon as number, titre: m.bien.titre, sousTitre: `${m.resultat.score}% · ${m.bien.prix ? euro.format(m.bien.prix) : ""}`, couleur: COUL_HEX[NIVEAUX[m.resultat.niveau!].couleur] })), [matches]);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
      {/* Colonne acquéreurs */}
      <div>
        <div className="mb-3 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <input className={inputCls} value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Rechercher un acquéreur…" />
          <div className="grid grid-cols-2 gap-2">
            <select className={inputCls} value={nego} onChange={(e) => setNego(e.target.value)}>
              <option value="">Tous négociateurs</option>
              {NEGOCIATEURS.map((n) => <option key={n}>{n}</option>)}
            </select>
            <label className="flex items-center gap-1.5 text-xs text-slate-600"><input type="checkbox" checked={avecMatchs} onChange={(e) => setAvecMatchs(e.target.checked)} /> Avec correspondances</label>
          </div>
        </div>
        <div className="max-h-[72vh] space-y-2 overflow-y-auto pr-1">
          {acqFiltres.map((d) => {
            const nb = matchsAcq.get(d.id)?.length ?? 0;
            const forts = (matchsAcq.get(d.id) ?? []).filter((m) => m.resultat.niveau === "forte").length;
            const r0 = (d.recherches ?? []).find((r) => r.actif !== false);
            return (
              <button key={d.id} onClick={() => setSel(d.id)} className={`w-full rounded-lg border p-3 text-left transition ${sel === d.id ? "border-copper bg-copper/5" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-800">{nomAcq(d)}</div>
                    <div className="truncate text-xs text-slate-500">{r0 ? [r0.villes.join(", "), r0.budgetMax ? `≤ ${euro.format(r0.budgetMax)}` : ""].filter(Boolean).join(" · ") : "Aucune recherche active"}</div>
                  </div>
                  {nb > 0 && <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${forts > 0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{nb}</span>}
                </div>
              </button>
            );
          })}
          {acqFiltres.length === 0 && <p className="text-sm text-slate-400">Aucun acquéreur.</p>}
        </div>
      </div>

      {/* Colonne correspondances enrichies */}
      <div>
        {!dossier ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">Sélectionnez un acquéreur pour voir ses biens correspondants, sur carte et en photos.</div>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 p-3">
              <div>
                <div className="font-bold text-slate-800">{nomAcq(dossier)}</div>
                <div className="text-xs text-slate-500">{[dossier.negociateur, dossier.tel, dossier.email].filter(Boolean).join(" · ")}</div>
              </div>
              <div className="flex flex-wrap gap-3">
                {(Object.keys(sources) as SourceBien[]).map((s) => (
                  <label key={s} className="flex items-center gap-1.5 text-xs text-slate-600"><input type="checkbox" checked={sources[s]} onChange={(e) => setSources({ ...sources, [s]: e.target.checked })} /> {LABEL_SOURCE[s]}</label>
                ))}
              </div>
            </div>

            {points.length > 0 && <div className="mb-4"><RapprochementCarte points={points} centre={centre} /></div>}

            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{matches.length} bien(s) correspondant(s)</p>
            <div className="space-y-3">
              {matches.map(({ bien, resultat }) => {
                const cle = cleSuivi(dossier.id, bien.source, bien.id);
                const dist = centre && typeof bien.lat === "number" && typeof bien.lon === "number" ? distanceKm(centre, { lat: bien.lat, lon: bien.lon }) : null;
                return <BienCard key={`${bien.source}-${bien.id}`} bien={bien} resultat={resultat} distance={dist} statut={suivi[cle]?.statut ?? "Nouveau"} onStatut={(s) => onStatut(cle, s)} />;
              })}
              {matches.length === 0 && <p className="text-sm text-slate-400">Aucun bien ne correspond à cet acquéreur (selon ses critères enregistrés).</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// VUE SECONDAIRE : par bien -> acquéreurs
// ---------------------------------------------------------------------------
function VueBien({ biens, acq, suivi, onStatut }: { biens: BienNormalise[]; acq: ClientDossier[]; suivi: SuiviMap; onStatut: (cle: string, s: StatutRappro) => void }) {
  const [sel, setSel] = useState<string>("");
  const [sources, setSources] = useState<Record<SourceBien, boolean>>({ estimation: true, chasse: true, mandat: true });
  const [ville, setVille] = useState("");
  const [type, setType] = useState("");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [texte, setTexte] = useState("");

  const filtres = useMemo(() => biens.filter((b) => {
    if (!sources[b.source]) return false;
    if (ville && !norm(b.ville).includes(norm(ville))) return false;
    if (type && b.typeBien !== type) return false;
    if (prixMin && (b.prix ?? 0) < Number(prixMin)) return false;
    if (prixMax && (b.prix ?? Infinity) > Number(prixMax)) return false;
    if (texte && !norm(`${b.titre} ${b.vendeur} ${b.ref} ${b.ville}`).includes(norm(texte))) return false;
    return true;
  }), [biens, sources, ville, type, prixMin, prixMax, texte]);

  const bien = filtres.find((b) => b.id === sel) ?? null;
  const matches = useMemo(() => (bien ? rapprocherAcquereurs(bien.criteres, acq) : []), [bien, acq]);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div>
        <div className="mb-3 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="flex flex-wrap gap-3">
            {(Object.keys(sources) as SourceBien[]).map((s) => (
              <label key={s} className="flex items-center gap-1.5 text-xs text-slate-600"><input type="checkbox" checked={sources[s]} onChange={(e) => setSources({ ...sources, [s]: e.target.checked })} /> {LABEL_SOURCE[s]}</label>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <input className={inputCls} value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Ville" />
            <select className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Tous types</option>{TYPES_BIEN_MANDAT.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <input className={inputCls} type="number" value={prixMin} onChange={(e) => setPrixMin(e.target.value)} placeholder="Prix min €" />
            <input className={inputCls} type="number" value={prixMax} onChange={(e) => setPrixMax(e.target.value)} placeholder="Prix max €" />
            <input className={`${inputCls} sm:col-span-2`} value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Rechercher (adresse, vendeur…)" />
          </div>
        </div>
        <div className="max-h-[72vh] space-y-2 overflow-y-auto pr-1">
          {filtres.map((b) => (
            <button key={`${b.source}-${b.id}`} onClick={() => setSel(b.id)} className={`flex w-full items-center gap-3 rounded-lg border p-2 text-left transition ${sel === b.id ? "border-copper bg-copper/5" : "border-slate-200 bg-white hover:border-slate-300"}`}>
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-slate-100">
                {b.photo ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={b.photo} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" /> : <div className="flex h-full w-full items-center justify-center text-slate-300">{ICONE_SOURCE[b.source]}</div>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-800">{b.titre}</div>
                <div className="truncate text-xs text-slate-500">{[b.prix ? euro.format(b.prix) : "—", b.typeBien, LABEL_SOURCE[b.source]].filter(Boolean).join(" · ")}</div>
              </div>
            </button>
          ))}
          {filtres.length === 0 && <p className="text-sm text-slate-400">Aucun bien.</p>}
        </div>
      </div>

      <div>
        {!bien ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">Sélectionnez un bien pour voir les acquéreurs correspondants.</div>
        ) : (
          <>
            <div className="mb-3 rounded-lg bg-slate-50 p-3">
              <div className="font-bold text-slate-800">{bien.titre}</div>
              <div className="text-sm text-slate-500">{[bien.prix ? euro.format(bien.prix) : "", bien.typeBien, bien.surface ? `${bien.surface} m²` : "", bien.ville].filter(Boolean).join(" · ")}</div>
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{matches.length} acquéreur(s)</p>
            <div className="space-y-2">
              {matches.map((m) => {
                const cle = cleSuivi(m.dossier.id, bien.source, bien.id);
                return (
                  <div key={m.dossier.id} className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-slate-800">{nomAcq(m.dossier)}</div>
                        <div className="text-xs text-slate-500">{[m.dossier.negociateur, m.dossier.tel, m.dossier.email].filter(Boolean).join(" · ")}</div>
                      </div>
                      <div className="flex items-center gap-2"><BadgeNiveau resultat={m.resultat} /><StatutSelect valeur={suivi[cle]?.statut ?? "Nouveau"} onChange={(s) => onStatut(cle, s)} /></div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.resultat.details.slice(0, 6).map((d) => (
                        <span key={d.cle} className={`rounded px-1.5 py-0.5 text-[11px] ${d.etat === "ok" ? "bg-emerald-50 text-emerald-700" : d.etat === "partiel" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"}`}>{d.label} : {d.texte}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
              {matches.length === 0 && <p className="text-sm text-slate-400">Aucun acquéreur ne correspond.</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ONGLET : gestion des mandats de vente (avec photos)
// ---------------------------------------------------------------------------
function MandatsManager({ onChange }: { onChange: () => void }) {
  const [liste, setListe] = useState<MandatVente[]>([]);
  const [chargement, setChargement] = useState(true);
  const [edit, setEdit] = useState<MandatVente | null>(null);
  const [busy, setBusy] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const charger = async () => { setChargement(true); setListe(await listMandats()); setChargement(false); };
  useEffect(() => { void charger(); }, []);

  const enregistrer = async () => {
    if (!edit) return;
    const m = await saveMandat(edit);
    if (!m) { alert("Enregistrement impossible (accès ou réseau)."); return; }
    setEdit(m); // garde le formulaire ouvert (ex. pour ajouter des photos)
    await charger(); onChange();
  };
  const supprimer = async (id: string) => { if (!confirm("Supprimer ce mandat ?")) return; await deleteMandat(id); await charger(); onChange(); };

  const ajouterPhotos = async (files: FileList | File[]) => {
    if (!edit?.id) { alert("Enregistrez d'abord le mandat avant d'ajouter des photos."); return; }
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    let courant = edit;
    for (const f of arr) {
      setBusy(`Envoi de ${f.name}…`);
      try { const data = await compresserPhoto(f); const m = await ajouterPhotoMandat(courant.id, data); if (m) { courant = m; setEdit(m); } }
      catch (e) { alert(e instanceof Error ? e.message : "Photo impossible"); }
    }
    setBusy(""); if (fileRef.current) fileRef.current.value = "";
  };
  const retirerPhoto = async (photoId: string) => { if (!edit?.id) return; const m = await supprimerPhotoMandat(edit.id, photoId); if (m) setEdit(m); };

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

        {/* Photos */}
        <div className="mt-4">
          <span className="mb-1 block text-xs font-semibold text-slate-600">Photos du bien</span>
          {!edit.id ? (
            <p className="text-xs text-slate-400">Enregistrez le mandat pour pouvoir ajouter des photos.</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {edit.photos.map((p) => (
                  <div key={p.id} className="relative h-20 w-24 overflow-hidden rounded border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={urlPhotoMandat(edit.id, p.id)} alt="" className="h-full w-full object-cover" />
                    <button onClick={() => void retirerPhoto(p.id)} className="absolute right-0.5 top-0.5 rounded bg-black/50 px-1 text-xs text-white">✕</button>
                  </div>
                ))}
                <button onClick={() => fileRef.current?.click()} className="flex h-20 w-24 items-center justify-center rounded border-2 border-dashed border-slate-300 text-sm text-slate-400 hover:border-copper">+ Photo</button>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && void ajouterPhotos(e.target.files)} />
              </div>
              {busy && <p className="mt-1 text-xs text-slate-400">{busy}</p>}
            </>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={() => void enregistrer()} className="rounded-lg bg-copper px-4 py-2 text-sm font-bold text-white hover:brightness-110">💾 Enregistrer</button>
          <button onClick={() => setEdit(null)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Fermer</button>
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
            <div key={m.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="h-32 w-full bg-slate-100">
                {m.photos.length > 0 ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={urlPhotoMandat(m.id, m.photos[0].id)} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-4xl text-slate-300">📜</div>}
              </div>
              <div className="p-4">
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
