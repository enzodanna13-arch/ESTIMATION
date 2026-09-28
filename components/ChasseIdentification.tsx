"use client";

import { useMemo, useState } from "react";
import { saveChasse, type FicheChasse } from "@/lib/chasse";
import { identifierBien, type CandidatIdentification } from "@/lib/chasseIdentification";

const inputCls = "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/20";
const int = new Intl.NumberFormat("fr-FR");
const dateFr = (iso: string) => { const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[3]}/${m[2]}/${m[1]}` : "—"; };
const TYPES = [["", "Indifférent"], ["maison", "Maison"], ["appartement", "Appartement"], ["immeuble", "Immeuble"]] as const;

function badgeScore(s: number): string {
  if (s >= 80) return "bg-emerald-100 text-emerald-700";
  if (s >= 62) return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-600";
}
function bordScore(s: number): string {
  if (s >= 80) return "border-emerald-200";
  if (s >= 62) return "border-amber-200";
  return "border-slate-200";
}

export default function ChasseIdentification({ fiches, negociateurDefaut, onCree }: {
  fiches: FicheChasse[]; negociateurDefaut: string; onCree?: () => void;
}) {
  const [type, setType] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [ville, setVille] = useState("");
  const [surface, setSurface] = useState("");
  const [dpe, setDpe] = useState("");
  const [terrainMin, setTerrainMin] = useState("");
  const [terrainMax, setTerrainMax] = useState("");
  const [piscine, setPiscine] = useState(false);
  const [texte, setTexte] = useState("");
  const [dateDiag, setDateDiag] = useState("");
  const [etat, setEtat] = useState<"idle" | "chargement" | "pret">("idle");
  const [candidats, setCandidats] = useState<CandidatIdentification[]>([]);
  const [total, setTotal] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [creees, setCreees] = useState<Set<string>>(new Set());

  // Pré-remplissage depuis une fiche Chasse existante (facultatif).
  const fichesUtiles = useMemo(() => fiches.filter((f) => f.surface > 0 && (f.codePostal || f.ville)), [fiches]);
  const prefill = (id: string) => {
    const f = fiches.find((x) => x.id === id);
    if (!f) return;
    setType(/maison/i.test(f.typeBien) ? "maison" : /appart/i.test(f.typeBien) ? "appartement" : /immeuble/i.test(f.typeBien) ? "immeuble" : "");
    setCodePostal(f.codePostal || "");
    setVille(f.ville || "");
    setSurface(f.surface ? String(f.surface) : "");
    setDpe((f.dpe || "").toUpperCase().slice(0, 1));
  };

  const lancer = async () => {
    setErr(null);
    const s = parseFloat(surface.replace(",", "."));
    if (!/^\d{5}$/.test(codePostal.trim())) { setErr("Renseignez un code postal à 5 chiffres."); return; }
    if (!(s > 0)) { setErr("Renseignez la surface habitable."); return; }
    setEtat("chargement"); setCandidats([]);
    const tMin = parseFloat(terrainMin.replace(",", ".")), tMax = parseFloat(terrainMax.replace(",", "."));
    const r = await identifierBien({
      codePostal: codePostal.trim(), ville: ville.trim() || undefined, surface: s,
      dpe: dpe || undefined, type: type || undefined,
      terrainMin: Number.isFinite(tMin) ? tMin : undefined,
      terrainMax: Number.isFinite(tMax) ? tMax : undefined,
      piscine: piscine || undefined,
      dateDiagnostic: /^\d{4}-\d{2}-\d{2}$/.test(dateDiag) ? dateDiag : undefined,
    });
    if (r.error) { setErr(r.error); setEtat("idle"); return; }
    setCandidats(r.candidats); setTotal(r.totalTrouves); setEtat("pret");
  };

  // Analyse d'un TEXTE d'annonce : l'IA extrait tout (dont la date de DPE),
  // pré-remplit le formulaire, et lance la recherche.
  const lancerTexte = async () => {
    setErr(null);
    if (texte.trim().length < 20) { setErr("Collez le texte de l'annonce."); return; }
    setEtat("chargement"); setCandidats([]);
    const r = await identifierBien({ texte: texte.trim(), piscine: piscine || undefined });
    if (r.extrait) {
      const e = r.extrait;
      if (e.type) setType(/maison/i.test(e.type) ? "maison" : /appart/i.test(e.type) ? "appartement" : /immeuble/i.test(e.type) ? "immeuble" : "");
      if (e.codePostal) setCodePostal(e.codePostal);
      if (e.ville) setVille(e.ville);
      if (e.surface) setSurface(String(e.surface));
      if (e.dpe) setDpe(e.dpe);
      if (e.surfaceTerrain) { setTerrainMin(String(Math.round(e.surfaceTerrain * 0.9))); setTerrainMax(String(Math.round(e.surfaceTerrain * 1.1))); }
      setDateDiag(e.dateDiagnostic || "");
    }
    if (r.error) { setErr(`${r.error}${r.extrait ? " (champs pré-remplis ci-dessous, complétez puis relancez)" : ""}`); setEtat("idle"); return; }
    setCandidats(r.candidats); setTotal(r.totalTrouves); setEtat("pret");
  };

  const creerFiche = async (c: CandidatIdentification) => {
    try {
      await saveChasse({
        negociateur: negociateurDefaut, statut: "À contacter",
        titre: `${c.typeBien ? c.typeBien[0].toUpperCase() + c.typeBien.slice(1) : "Bien"} ${c.surfaceHabitable ?? ""} m² — ${c.ville}`.trim(),
        typeBien: c.typeBien, adresse: c.adresse, ville: c.ville, codePostal: c.codePostal,
        lat: c.lat ?? undefined, lon: c.lon ?? undefined,
        surface: c.surfaceHabitable ?? 0, dpe: c.dpe,
        notes: `Adresse identifiée par rapprochement ADEME (confiance ${c.score} %).${c.superficieFonciere != null ? ` Terrain ${c.superficieFonciere} m².` : ""}${c.parcelle ? ` Parcelle ${c.parcelle.section} ${c.parcelle.numero}.` : ""}`,
      });
      setCreees((prev) => new Set(prev).add(c.adresse + c.lat));
      onCree?.();
    } catch { setErr("Création de la fiche impossible."); }
  };

  return (
    <div className="space-y-4">
      {/* Explication */}
      <div className="rounded-2xl border border-navy/15 bg-navy/5 p-4 text-sm text-slate-600">
        <h3 className="mb-1 text-base font-bold text-navy">🔎 Identification d&apos;un bien à vendre</h3>
        <p>À partir des caractéristiques d&apos;une annonce (commune + surface + DPE + type), on retrouve la ou les <b>adresses probables</b> via la base <b>ADEME</b> (open data), complétées de la <b>surface du terrain</b> (cadastre) et d&apos;une <b>vue aérienne IGN</b>. Vous confirmez visuellement l&apos;adresse.</p>
      </div>

      {/* Coller le texte de l'annonce : l'IA extrait tout et cherche seule */}
      <div className="rounded-2xl border border-copper/30 bg-copper/5 p-4">
        <div className="mb-1 flex items-center gap-2">
          <h3 className="text-base font-bold text-navy">📝 Coller le texte d&apos;une annonce</h3>
          <span className="rounded-full bg-copper/15 px-2 py-0.5 text-[10px] font-bold text-copper">le plus rapide</span>
        </div>
        <p className="mb-2 text-xs text-slate-500">L&apos;IA extrait tout (type, surface, DPE, terrain…) et lance la recherche. Astuce : si l&apos;annonce mentionne la <b>date du DPE</b>, la correspondance devient quasi certaine.</p>
        <textarea className={`${inputCls} min-h-[100px]`} placeholder="Collez ici le texte de l'annonce (Leboncoin, SeLoger…)…" value={texte} onChange={(e) => setTexte(e.target.value)} />
        <div className="mt-2 flex items-center gap-3">
          <button onClick={() => void lancerTexte()} disabled={etat === "chargement" || texte.trim().length < 20} className="rounded-lg bg-copper px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-40">
            {etat === "chargement" ? "Analyse…" : "🔍 Analyser le texte et chercher"}
          </button>
          {dateDiag && <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">📅 DPE détecté : {dateDiag.split("-").reverse().join("/")}</span>}
        </div>
      </div>

      {/* Formulaire (manuel / ajustement) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        {fichesUtiles.length > 0 && (
          <label className="mb-3 block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Pré-remplir depuis une fiche</span>
            <select className={`${inputCls} sm:w-auto`} defaultValue="" onChange={(e) => { prefill(e.target.value); e.target.value = ""; }}>
              <option value="">— Choisir une fiche de chasse —</option>
              {fichesUtiles.map((f) => <option key={f.id} value={f.id}>{f.titre || f.typeBien || "Bien"} · {f.ville} · {f.surface} m²</option>)}
            </select>
          </label>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Type</span>
            <select className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>{TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Code postal *</span>
            <input className={inputCls} value={codePostal} onChange={(e) => setCodePostal(e.target.value.replace(/\D/g, "").slice(0, 5))} placeholder="13500" inputMode="numeric" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ville</span>
            <input className={inputCls} value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Martigues" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Surface habitable (m²) *</span>
            <input className={inputCls} value={surface} onChange={(e) => setSurface(e.target.value.replace(/[^\d.,]/g, ""))} placeholder="105" inputMode="decimal" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">DPE</span>
            <select className={inputCls} value={dpe} onChange={(e) => setDpe(e.target.value)}><option value="">Indifférent</option>{["A", "B", "C", "D", "E", "F", "G"].map((x) => <option key={x}>{x}</option>)}</select>
          </label>
        </div>

        {/* Fourchette de terrain (critère le plus discriminant) + piscine */}
        <div className="mt-3 grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-copper">Terrain min (m²)</span>
            <input className={inputCls} value={terrainMin} onChange={(e) => setTerrainMin(e.target.value.replace(/[^\d]/g, ""))} placeholder="500" inputMode="numeric" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-copper">Terrain max (m²)</span>
            <input className={inputCls} value={terrainMax} onChange={(e) => setTerrainMax(e.target.value.replace(/[^\d]/g, ""))} placeholder="700" inputMode="numeric" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-copper">Date du DPE</span>
            <input type="date" className={inputCls} value={dateDiag} onChange={(e) => setDateDiag(e.target.value)} />
          </label>
          <label className="flex items-center gap-2 py-2 text-sm text-slate-700">
            <input type="checkbox" checked={piscine} onChange={(e) => setPiscine(e.target.checked)} className="h-4 w-4 accent-copper" />
            🏊 <b>Avec piscine</b>
          </label>
        </div>
        <p className="mt-1 text-[11px] text-slate-400">La <b>fourchette de terrain</b> est le filtre le plus précis (ex. « terrain 600 m² » → 550 / 650). La case <b>piscine</b> filtre les résultats : cochée = uniquement les biens <b>avec</b> piscine, décochée = uniquement <b>sans</b> piscine (détection sur la vue aérienne IGN).</p>
        <div className="mt-3 flex items-center gap-3">
          <button onClick={() => void lancer()} disabled={etat === "chargement"} className="rounded-lg bg-navy px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-deep disabled:opacity-50">
            {etat === "chargement" ? "Recherche des adresses…" : "🔍 Identifier les adresses"}
          </button>
          {err && <span className="text-sm text-red-600">{err}</span>}
        </div>
      </div>

      {/* Résultats */}
      {etat === "pret" && (
        candidats.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-400">
            Aucune adresse candidate trouvée pour ces critères. Élargissez (retirez le DPE, vérifiez la surface / le code postal){piscine ? ", ou décochez « Avec piscine » si le bien n'en a pas" : ""}.
          </p>
        ) : (
          <div>
            <div className="mb-2 text-xs font-semibold text-slate-500">{candidats.length} adresse{candidats.length > 1 ? "s" : ""} probable{candidats.length > 1 ? "s" : ""} (sur {total} DPE compatibles) — confirmez visuellement avec la vue aérienne / Street View.</div>
            <div className="grid gap-3 lg:grid-cols-2">
              {candidats.map((c, i) => {
                const dejaCree = creees.has(c.adresse + c.lat);
                return (
                  <div key={i} className={`overflow-hidden rounded-2xl border ${bordScore(c.score)} bg-white`}>
                    {c.orthophoto && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.orthophoto} alt={`Vue aérienne ${c.adresse}`} loading="lazy" className="h-40 w-full object-cover" />
                    )}
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-navy">📍 {c.adresse || "Adresse inconnue"}</span>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${badgeScore(c.score)}`}>{c.score}%</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                        {c.surfaceHabitable != null && <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-600">🏠 {c.surfaceHabitable} m² hab.</span>}
                        {c.superficieFonciere != null && (
                          <span className={`rounded px-1.5 py-0.5 font-semibold ${c.terrainEtat === "in" ? "bg-emerald-100 text-emerald-700" : c.terrainEtat === "near" ? "bg-amber-50 text-amber-700" : c.terrainEtat === "out" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>
                            🌳 {int.format(c.superficieFonciere)} m² terrain{c.terrainEtat === "in" ? " ✓" : c.terrainEtat === "out" ? " ✗" : ""}
                          </span>
                        )}
                        {c.piscine === true && <span className="rounded bg-sky-100 px-1.5 py-0.5 font-semibold text-sky-700">🏊 Piscine</span>}
                        {c.piscine === false && <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-400">Sans piscine</span>}
                        {c.dpe && <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-600">DPE {c.dpe}</span>}
                        {c.parcelle && <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-600">Parc. {c.parcelle.section} {c.parcelle.numero}</span>}
                        <span className={`rounded px-1.5 py-0.5 font-semibold ${c.dateMatch ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>DPE du {dateFr(c.dateDpe)}{c.dateMatch ? " ✓ date annonce" : ""}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {c.streetView && <a href={c.streetView} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50">👁️ Street View</a>}
                        {c.geoportail && <a href={c.geoportail} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50">🛰️ Géoportail</a>}
                        {c.maps && <a href={c.maps} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50">🗺️ Maps</a>}
                        <button onClick={() => void navigator.clipboard?.writeText(`${c.adresse}, ${c.codePostal} ${c.ville}`)} className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50">📋 Copier</button>
                        <button onClick={() => void creerFiche(c)} disabled={dejaCree} className="ml-auto rounded-lg bg-copper px-2.5 py-1 text-xs font-bold text-white transition hover:brightness-110 disabled:opacity-50">
                          {dejaCree ? "✓ Fiche créée" : "➕ Créer une fiche"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] text-slate-400">Adresses déduites de l&apos;open data ADEME (diagnostics DPE) — à confirmer par le négociateur. La correspondance repose sur la surface, le DPE et le type ; elle n&apos;est pas une certitude, surtout en immeuble collectif.</p>
          </div>
        )
      )}
    </div>
  );
}
