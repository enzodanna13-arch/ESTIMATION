"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  listSinistres, createSinistre, updateSinistre, deleteSinistre,
  ajouterSuivi, ajouterPhoto, modifierPhoto, supprimerPhoto,
  compresserPhoto, urlPhotoSinistre,
  STATUTS_SINISTRE, MOTIFS_SINISTRE, type Sinistre,
} from "@/lib/sinistres";
import { genererDeclarationSinistrePdf, type PhotoBytes } from "@/lib/declarationSinistrePdf";

const nf = new Intl.NumberFormat("fr-FR");
const euros = (n: number | null) => (n && n > 0 ? `${nf.format(n)} €` : "—");
const dateFr = (iso: string) => { if (!iso) return "—"; const d = new Date(iso + "T12:00:00"); return Number.isFinite(d.getTime()) ? d.toLocaleDateString("fr-FR") : iso; };
const dateHeure = (ts: number) => new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

// Couleur de badge par statut (progression gauche → droite).
const STATUT_COULEUR: Record<string, string> = {
  "Déclaré": "bg-slate-200 text-slate-700",
  "Déclaration envoyée": "bg-sky-100 text-sky-700",
  "Expertise en attente": "bg-amber-100 text-amber-700",
  "Expertise réalisée": "bg-violet-100 text-violet-700",
  "Travaux en cours": "bg-orange-100 text-orange-700",
  "Indemnisé": "bg-emerald-100 text-emerald-700",
  "Clôturé": "bg-slate-800 text-white",
};
const badgeStatut = (s: string) => STATUT_COULEUR[s] ?? "bg-slate-200 text-slate-700";

const MOTIF_ICONE: Record<string, string> = {
  "Inondation": "🌊", "Catastrophe naturelle": "⚠️", "Dégât des eaux": "💧",
  "Incendie": "🔥", "Tempête / Grêle": "🌪️", "Bris de glace": "🪟", "Vandalisme": "🔨", "Autre": "📍",
};

function telechargerPdf(octets: Uint8Array, nom: string) {
  const blob = new Blob([new Uint8Array(octets)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = nom; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const champ = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-copper focus:outline-none";
const labelCls = "mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500";

export default function SinistresPage({ onRetour }: { onRetour: () => void }) {
  const [sinistres, setSinistres] = useState<Sinistre[]>([]);
  const [chargement, setChargement] = useState(true);
  const [selId, setSelId] = useState<string | null>(null);
  const [nouveau, setNouveau] = useState(false);
  const [q, setQ] = useState("");
  const [fStatut, setFStatut] = useState("");
  const [fMotif, setFMotif] = useState("");

  useEffect(() => { let a = false; void (async () => { const l = await listSinistres(); if (!a) { setSinistres(l); setChargement(false); } })(); return () => { a = true; }; }, []);

  const majLocal = (s: Sinistre) => setSinistres((prev) => { const i = prev.findIndex((x) => x.id === s.id); const cp = [...prev]; if (i >= 0) cp[i] = s; else cp.unshift(s); return cp; });

  const filtrees = useMemo(() => {
    const t = q.trim().toLowerCase();
    return sinistres.filter((s) => {
      if (fStatut && s.statut !== fStatut) return false;
      if (fMotif && s.motif !== fMotif) return false;
      if (t && !`${s.coproNom} ${s.coproAdresse} ${s.reference} ${s.motif} ${s.assureur}`.toLowerCase().includes(t)) return false;
      return true;
    });
  }, [sinistres, q, fStatut, fMotif]);

  const stats = useMemo(() => {
    const ouverts = sinistres.filter((s) => s.statut !== "Clôturé").length;
    const expertise = sinistres.filter((s) => s.statut === "Expertise en attente" || s.statut === "Expertise réalisée").length;
    const montant = sinistres.reduce((acc, s) => acc + (s.montantEstime ?? 0), 0);
    return { total: sinistres.length, ouverts, expertise, montant };
  }, [sinistres]);

  const selected = selId ? sinistres.find((s) => s.id === selId) ?? null : null;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Accueil</button>
        <h2 className="text-2xl font-bold text-navy">🌊 Sinistres &amp; assurances</h2>
        {!nouveau && !selected && (
          <button onClick={() => setNouveau(true)} className="ml-auto rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:brightness-110">+ Nouveau sinistre</button>
        )}
      </div>

      {nouveau ? (
        <FormSinistre
          onCancel={() => setNouveau(false)}
          onSaved={(s) => { majLocal(s); setNouveau(false); setSelId(s.id); }}
        />
      ) : selected ? (
        <FicheSinistre
          s={selected}
          onRetour={() => setSelId(null)}
          onChange={majLocal}
          onDelete={async () => { await deleteSinistre(selected.id); setSinistres((p) => p.filter((x) => x.id !== selected.id)); setSelId(null); }}
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500">Référencez chaque sinistre de vos copropriétés (inondations, catastrophes naturelles…), suivez son avancement et générez la déclaration d'assurance pré-remplie avec photos légendées.</p>

          <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[["Sinistres", nf.format(stats.total)], ["En cours", nf.format(stats.ouverts)], ["En expertise", nf.format(stats.expertise)], ["Dommages estimés", euros(stats.montant)]].map(([l, v]) => (
              <div key={l} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center"><div className="text-lg font-bold text-navy">{v}</div><div className="text-[10px] text-slate-500">{l}</div></div>
            ))}
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Copropriété, référence, assureur…" className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-copper focus:outline-none" />
            <select value={fMotif} onChange={(e) => setFMotif(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-semibold text-navy focus:border-copper focus:outline-none">
              <option value="">Tous motifs</option>
              {MOTIFS_SINISTRE.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={fStatut} onChange={(e) => setFStatut(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-semibold text-navy focus:border-copper focus:outline-none">
              <option value="">Tous statuts</option>
              {STATUTS_SINISTRE.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="text-xs text-slate-400">{filtrees.length} sinistre(s)</span>
          </div>

          {chargement ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400">Chargement…</div>
          ) : filtrees.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">Aucun sinistre. Clique sur « + Nouveau sinistre » pour en référencer un.</div>
          ) : (
            <div className="space-y-2.5">
              {filtrees.map((s) => (
                <button key={s.id} onClick={() => setSelId(s.id)} className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl">{MOTIF_ICONE[s.motif] ?? "📍"}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-navy">{s.coproNom || "Copropriété"} <span className="text-[11px] font-medium text-slate-400">· {s.reference}</span></div>
                    <div className="truncate text-xs text-slate-500">{s.motif} · {dateFr(s.dateSinistre)}{s.coproAdresse ? ` · ${s.coproAdresse}` : ""}</div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeStatut(s.statut)}`}>{s.statut}</span>
                    {s.photos.length > 0 && <span className="text-[10px] text-slate-400">📷 {s.photos.length}</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ------- Formulaire de création -------
function FormSinistre({ onCancel, onSaved }: { onCancel: () => void; onSaved: (s: Sinistre) => void }) {
  const [f, setF] = useState<Partial<Sinistre>>({ motif: "Inondation", statut: "Déclaré", dateSinistre: new Date().toISOString().slice(0, 10), qualite: "Syndic de copropriété", signataire: "CENTURY 21 ICAZA Immobilier" });
  const [enreg, setEnreg] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const set = (k: keyof Sinistre, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  const soumettre = async () => {
    if (!f.coproNom?.trim() && !f.coproAdresse?.trim()) { setErr("Indique au moins la copropriété."); return; }
    setEnreg(true); setErr(null);
    const s = await createSinistre(f);
    setEnreg(false);
    if (s) onSaved(s); else setErr("Enregistrement impossible (réessaie).");
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-navy">Nouveau sinistre</h3>
      {err && <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{err}</div>}
      <ChampsSinistre f={f} set={set} />
      <div className="mt-5 flex gap-2">
        <button onClick={() => void soumettre()} disabled={enreg} className="rounded-lg bg-navy px-5 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{enreg ? "Enregistrement…" : "Enregistrer"}</button>
        <button onClick={onCancel} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">Annuler</button>
      </div>
    </div>
  );
}

// Champs partagés création / édition.
function ChampsSinistre({ f, set }: { f: Partial<Sinistre>; set: (k: keyof Sinistre, v: unknown) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className={labelCls}>Copropriété</label><input value={f.coproNom ?? ""} onChange={(e) => set("coproNom", e.target.value)} placeholder="Nom de la copropriété" className={champ} /></div>
        <div><label className={labelCls}>Adresse</label><input value={f.coproAdresse ?? ""} onChange={(e) => set("coproAdresse", e.target.value)} placeholder="Adresse du bâtiment" className={champ} /></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div><label className={labelCls}>Motif</label><select value={f.motif ?? "Inondation"} onChange={(e) => set("motif", e.target.value)} className={champ}>{MOTIFS_SINISTRE.map((m) => <option key={m} value={m}>{m}</option>)}</select></div>
        <div><label className={labelCls}>Date du sinistre</label><input type="date" value={f.dateSinistre ?? ""} onChange={(e) => set("dateSinistre", e.target.value)} className={champ} /></div>
        <div><label className={labelCls}>Gravité</label><select value={f.gravite ?? ""} onChange={(e) => set("gravite", e.target.value)} className={champ}><option value="">—</option><option>Léger</option><option>Modéré</option><option>Grave</option></select></div>
      </div>
      <div><label className={labelCls}>Description / circonstances</label><textarea value={f.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Ce qui s'est passé, les parties touchées…" className={champ} /></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className={labelCls}>Statut</label><select value={f.statut ?? "Déclaré"} onChange={(e) => set("statut", e.target.value)} className={champ}>{STATUTS_SINISTRE.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
        <div><label className={labelCls}>Montant estimé (€)</label><input type="number" value={f.montantEstime ?? ""} onChange={(e) => set("montantEstime", e.target.value ? Number(e.target.value) : null)} placeholder="0" className={champ} /></div>
      </div>
      <div className="rounded-xl bg-slate-50 p-3">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Assurance</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className={labelCls}>Assureur</label><input value={f.assureur ?? ""} onChange={(e) => set("assureur", e.target.value)} placeholder="Compagnie d'assurance" className={champ} /></div>
          <div><label className={labelCls}>N° contrat / police</label><input value={f.assurancePolice ?? ""} onChange={(e) => set("assurancePolice", e.target.value)} className={champ} /></div>
          <div><label className={labelCls}>Adresse de l'assurance</label><textarea value={f.assuranceAdresse ?? ""} onChange={(e) => set("assuranceAdresse", e.target.value)} rows={2} placeholder="Service sinistres, adresse postale…" className={champ} /></div>
          <div><label className={labelCls}>Contact (tél. / email)</label><textarea value={f.assuranceContact ?? ""} onChange={(e) => set("assuranceContact", e.target.value)} rows={2} className={champ} /></div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className={labelCls}>Signataire</label><input value={f.signataire ?? ""} onChange={(e) => set("signataire", e.target.value)} className={champ} /></div>
        <div><label className={labelCls}>Qualité du signataire</label><input value={f.qualite ?? ""} onChange={(e) => set("qualite", e.target.value)} placeholder="Syndic de copropriété" className={champ} /></div>
      </div>
    </div>
  );
}

// ------- Fiche détaillée -------
function FicheSinistre({ s, onRetour, onChange, onDelete }: { s: Sinistre; onRetour: () => void; onChange: (s: Sinistre) => void; onDelete: () => void }) {
  const [f, setF] = useState<Partial<Sinistre>>(s);
  const [enreg, setEnreg] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [onglet, setOnglet] = useState<"infos" | "photos" | "suivi" | "declaration">("infos");
  const set = (k: keyof Sinistre, v: unknown) => { setF((p) => ({ ...p, [k]: v })); setDirty(true); };

  useEffect(() => { setF(s); setDirty(false); }, [s.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const enregistrer = async () => {
    setEnreg(true);
    const maj = await updateSinistre(s.id, f);
    setEnreg(false);
    if (maj) { onChange(maj); setDirty(false); }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">← Tous les sinistres</button>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeStatut(s.statut)}`}>{s.statut}</span>
        <span className="text-xs text-slate-400">{s.reference}</span>
        {dirty && <button onClick={() => void enregistrer()} disabled={enreg} className="ml-auto rounded-lg bg-copper px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{enreg ? "Enregistrement…" : "💾 Enregistrer"}</button>}
      </div>

      <div className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-l-4 border-copper bg-slate-50/70 p-4">
          <div className="text-xl font-black text-navy">{MOTIF_ICONE[s.motif] ?? "📍"} {s.coproNom || "Copropriété"}</div>
          <div className="text-sm text-slate-600">{s.motif} · {dateFr(s.dateSinistre)}{s.coproAdresse ? ` · ${s.coproAdresse}` : ""}</div>
        </div>
        <div className="flex flex-wrap gap-1 border-b border-slate-100 p-2">
          {([["infos", "📋 Infos"], ["photos", `📷 Photos (${s.photos.length})`], ["suivi", `📈 Suivi (${s.suivi.length})`], ["declaration", "📄 Déclaration"]] as const).map(([v, t]) => (
            <button key={v} onClick={() => setOnglet(v)} className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${onglet === v ? "bg-navy text-white" : "text-slate-500 hover:text-navy"}`}>{t}</button>
          ))}
        </div>

        <div className="p-4">
          {onglet === "infos" && (
            <>
              <ChampsSinistre f={f} set={set} />
              <div className="mt-5 flex gap-2">
                <button onClick={() => void enregistrer()} disabled={enreg || !dirty} className="rounded-lg bg-navy px-5 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-40">{enreg ? "Enregistrement…" : "Enregistrer"}</button>
                <button onClick={() => { if (confirm("Supprimer définitivement ce sinistre et ses photos ?")) onDelete(); }} className="ml-auto rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100">Supprimer</button>
              </div>
            </>
          )}
          {onglet === "photos" && <OngletPhotos s={s} onChange={onChange} />}
          {onglet === "suivi" && <OngletSuivi s={s} onChange={onChange} />}
          {onglet === "declaration" && <OngletDeclaration s={s} />}
        </div>
      </div>
    </div>
  );
}

// ------- Onglet photos -------
function OngletPhotos({ s, onChange }: { s: Sinistre; onChange: (s: Sinistre) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [envoi, setEnvoi] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const ajouter = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setEnvoi(true); setErr(null);
    let dernier: Sinistre | null = null;
    try {
      for (const file of Array.from(files)) {
        const data = await compresserPhoto(file);
        dernier = await ajouterPhoto(s.id, { nom: file.name.replace(/\.[^.]+$/, "").slice(0, 60), legende: "", data });
      }
      if (dernier) onChange(dernier);
    } catch (e) { setErr(e instanceof Error ? e.message : "Envoi impossible"); }
    setEnvoi(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const majLegende = async (photoId: string, nom: string, legende: string) => { const maj = await modifierPhoto(s.id, photoId, nom, legende); if (maj) onChange(maj); };
  const supprimer = async (photoId: string) => { const maj = await supprimerPhoto(s.id, photoId); if (maj) onChange(maj); };

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => void ajouter(e.target.files)} />
        <button onClick={() => fileRef.current?.click()} disabled={envoi} className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{envoi ? "Envoi…" : "+ Ajouter des photos"}</button>
        <span className="text-xs text-slate-400">Chaque photo peut être légendée (l'explication apparaît sous la photo dans la déclaration).</span>
      </div>
      {err && <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{err}</div>}
      {s.photos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">Aucune photo pour l'instant.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {s.photos.map((p, i) => (
            <div key={p.id} className="overflow-hidden rounded-xl border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={urlPhotoSinistre(s.id, p.id)} alt={p.nom} className="h-44 w-full bg-slate-100 object-cover" />
              <div className="space-y-1.5 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">Photo {i + 1}</span>
                  <button onClick={() => void supprimer(p.id)} className="text-[11px] font-semibold text-red-500 hover:underline">Supprimer</button>
                </div>
                <input defaultValue={p.nom} onBlur={(e) => { if (e.target.value !== p.nom) void majLegende(p.id, e.target.value, p.legende); }} placeholder="Titre (ex. Hall d'entrée)" className="w-full rounded-md border border-slate-200 px-2 py-1 text-xs focus:border-copper focus:outline-none" />
                <textarea defaultValue={p.legende} onBlur={(e) => { if (e.target.value !== p.legende) void majLegende(p.id, p.nom, e.target.value); }} rows={2} placeholder="Explication (apparaît sous la photo)…" className="w-full rounded-md border border-slate-200 px-2 py-1 text-xs focus:border-copper focus:outline-none" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ------- Onglet suivi -------
function OngletSuivi({ s, onChange }: { s: Sinistre; onChange: (s: Sinistre) => void }) {
  const [texte, setTexte] = useState("");
  const [statut, setStatut] = useState("");
  const [envoi, setEnvoi] = useState(false);

  const ajouter = async () => {
    if (!texte.trim() && !statut) return;
    setEnvoi(true);
    const maj = await ajouterSuivi(s.id, texte, statut || undefined);
    setEnvoi(false);
    if (maj) { onChange(maj); setTexte(""); setStatut(""); }
  };

  const entrees = [...s.suivi].sort((a, b) => b.date - a.date);

  return (
    <div>
      <div className="mb-4 rounded-xl bg-slate-50 p-3">
        <label className={labelCls}>Ajouter une étape</label>
        <textarea value={texte} onChange={(e) => setTexte(e.target.value)} rows={2} placeholder="Ex. Expert mandaté, passage prévu le…" className={champ} />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <select value={statut} onChange={(e) => setStatut(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-semibold text-navy focus:border-copper focus:outline-none">
            <option value="">(ne pas changer le statut)</option>
            {STATUTS_SINISTRE.map((x) => <option key={x} value={x}>Passer à : {x}</option>)}
          </select>
          <button onClick={() => void ajouter()} disabled={envoi} className="rounded-lg bg-navy px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{envoi ? "…" : "Ajouter"}</button>
        </div>
      </div>
      <div className="relative space-y-3 pl-5">
        <div className="absolute bottom-1 left-[7px] top-1 w-px bg-slate-200" />
        {entrees.map((e) => (
          <div key={e.id} className="relative">
            <span className="absolute -left-5 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-copper shadow" />
            <div className="text-[11px] font-semibold text-slate-400">{dateHeure(e.date)}</div>
            <div className="text-sm text-navy">{e.texte}{e.statut && <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeStatut(e.statut)}`}>{e.statut}</span>}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------- Onglet déclaration d'assurance -------
function OngletDeclaration({ s }: { s: Sinistre }) {
  const [lieu, setLieu] = useState("Martigues");
  const [circonstances, setCirconstances] = useState("");
  const [dommages, setDommages] = useState("");
  const [recommande, setRecommande] = useState(true);
  const [gen, setGen] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const generer = async () => {
    setGen(true); setErr(null);
    try {
      const photos: PhotoBytes[] = [];
      for (const p of s.photos) {
        try {
          const r = await fetch(urlPhotoSinistre(s.id, p.id), { cache: "no-store" });
          if (r.ok) photos.push({ nom: p.nom, legende: p.legende, bytes: new Uint8Array(await r.arrayBuffer()) });
        } catch { /* on ignore une photo illisible */ }
      }
      const octets = await genererDeclarationSinistrePdf(s, photos, { lieu, circonstances, dommages, recommande });
      const nomFichier = `Declaration ${s.reference || s.coproNom || "sinistre"}`.replace(/[\\/:*?"<>|]/g, "-") + ".pdf";
      telechargerPdf(octets, nomFichier);
    } catch (e) { setErr(e instanceof Error ? e.message : "Génération impossible"); }
    setGen(false);
  };

  const manque: string[] = [];
  if (!s.assureur) manque.push("l'assureur");
  if (!s.assuranceAdresse && !s.assuranceContact) manque.push("les coordonnées de l'assurance");

  return (
    <div>
      <p className="mb-3 text-sm text-slate-500">Génère une <strong>lettre de déclaration de sinistre</strong> pré-remplie (copropriété, motif, assurance) avec en annexe toutes les photos et leur explication. Complète si besoin les champs ci-dessous.</p>
      {manque.length > 0 && <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">Pense à renseigner {manque.join(" et ")} dans l'onglet « Infos » pour une déclaration complète.</div>}
      {err && <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}

      <div className="space-y-3 rounded-xl bg-slate-50 p-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className={labelCls}>Lieu de rédaction</label><input value={lieu} onChange={(e) => setLieu(e.target.value)} className={champ} /></div>
          <label className="flex items-end gap-2 pb-2 text-sm font-semibold text-slate-600"><input type="checkbox" checked={recommande} onChange={(e) => setRecommande(e.target.checked)} /> Mention « recommandé avec AR »</label>
        </div>
        <div><label className={labelCls}>Circonstances complémentaires (optionnel)</label><textarea value={circonstances} onChange={(e) => setCirconstances(e.target.value)} rows={2} placeholder="Précisions sur l'origine, l'étendue…" className={champ} /></div>
        <div><label className={labelCls}>Dommages constatés (une ligne par dommage, optionnel)</label><textarea value={dommages} onChange={(e) => setDommages(e.target.value)} rows={3} placeholder={"Sous-sol inondé\nHall d'entrée dégradé\nTableau électrique HS"} className={champ} /></div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button onClick={() => void generer()} disabled={gen} className="rounded-lg bg-copper px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{gen ? "Génération…" : "📄 Générer la déclaration (PDF)"}</button>
        <span className="text-xs text-slate-400">{s.photos.length} photo(s) en annexe</span>
      </div>
    </div>
  );
}
