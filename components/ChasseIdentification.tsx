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
    try {
      const r = await identifierBien({ codePostal: codePostal.trim(), ville: ville.trim() || undefined, surface: s, dpe: dpe || undefined, type: type || undefined });
      setCandidats(r.candidats); setTotal(r.totalTrouves); setEtat("pret");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Identification impossible"); setEtat("idle");
    }
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

      {/* Formulaire */}
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
            Aucune adresse candidate trouvée pour ces critères. Élargissez (retirez le DPE, vérifiez la surface / le code postal).
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
                        {c.superficieFonciere != null && <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700">🌳 {int.format(c.superficieFonciere)} m² terrain</span>}
                        {c.dpe && <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-600">DPE {c.dpe}</span>}
                        {c.parcelle && <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-600">Parc. {c.parcelle.section} {c.parcelle.numero}</span>}
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-500">DPE du {dateFr(c.dateDpe)}</span>
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
