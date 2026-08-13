"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SOURCES_LEAD, STATUTS_LEAD, STATUT_LEAD_COULEURS, SUIVI_TYPES, TYPES_PROJET_LEAD,
  createLead, deleteLead, listLeads, updateLead, type Lead,
} from "@/lib/leads";
import { createClient } from "@/lib/clients";

const inputCls = "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/20";
const int = new Intl.NumberFormat("fr-FR");
const dateFr = (t: number) => new Date(t).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" });
const labelSource = (id: string) => SOURCES_LEAD.find((s) => s.id === id)?.label ?? id;

export default function LeadsPage({ onRetour }: { onRetour: () => void }) {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [q, setQ] = useState("");
  const [fStatut, setFStatut] = useState("");
  const [fSource, setFSource] = useState("");
  const [sel, setSel] = useState<Lead | null>(null);
  const [creation, setCreation] = useState(false);
  const [config, setConfig] = useState(false);
  const [nouveau, setNouveau] = useState<Partial<Lead>>({ typeProjet: "acquereur", source: "manuel" });

  const [maj, setMaj] = useState(false);
  const recharger = () => { setMaj(true); return listLeads().then(setLeads).catch(() => setLeads([])).finally(() => setTimeout(() => setMaj(false), 400)); };
  useEffect(() => {
    void recharger();
    // Rafraîchissement automatique toutes les 30 s pour voir les nouveaux leads
    const t = setInterval(() => { listLeads().then(setLeads).catch(() => {}); }, 30000);
    return () => clearInterval(t);
  }, []);

  const resultats = useMemo(() => {
    let base = leads ?? [];
    const t = q.trim().toLowerCase();
    if (t) base = base.filter((l) => [l.nom, l.prenom, l.tel, l.email, l.ville, l.campagne, l.negociateur, l.message].filter(Boolean).join(" ").toLowerCase().includes(t));
    if (fStatut) base = base.filter((l) => l.statut === fStatut);
    if (fSource) base = base.filter((l) => l.source === fSource);
    return base;
  }, [leads, q, fStatut, fSource]);

  const compteur = useMemo(() => {
    const c: Record<string, number> = {};
    for (const l of leads ?? []) c[l.statut] = (c[l.statut] ?? 0) + 1;
    return c;
  }, [leads]);

  const majLead = async (id: string, patch: Partial<Lead>) => {
    const maj = await updateLead(id, patch);
    if (maj) { setSel((s) => (s?.id === id ? maj : s)); setLeads((ls) => (ls ?? []).map((l) => (l.id === id ? maj : l))); }
    return maj;
  };

  const changerStatut = async (l: Lead, statut: string) => {
    const suivi = [{ id: `${Date.now()}`, date: Date.now(), type: "statut", texte: `Statut : ${statut}`, auteur: l.negociateur || "—" }, ...l.suivi];
    await majLead(l.id, { statut, suivi });
  };

  const ajouterSuivi = async (l: Lead, type: string, texte: string) => {
    if (!texte.trim()) return;
    const suivi = [{ id: `${Date.now()}`, date: Date.now(), type, texte: texte.trim(), auteur: l.negociateur || "—" }, ...l.suivi];
    await majLead(l.id, { suivi });
  };

  const creerLead = async () => {
    if (!nouveau.nom?.trim() && !nouveau.tel?.trim() && !nouveau.email?.trim()) return;
    const l = await createLead(nouveau);
    if (l) { setCreation(false); setNouveau({ typeProjet: "acquereur", source: "manuel" }); void recharger(); setSel(l); }
  };

  const convertir = async (l: Lead) => {
    if (l.dossierId) return alert("Ce lead est déjà converti en dossier.");
    const type = l.typeProjet === "investisseur" ? "investisseur" : l.typeProjet === "vendeur" ? "vendeur" : "acquereur";
    const d = await createClient({ nom: l.nom || "Lead", bien: [l.ville, l.message].filter(Boolean).join(" — "), prenom: l.prenom, tel: l.tel, email: l.email, negociateur: l.negociateur, typeClient: type });
    if (!d) return alert("Conversion impossible.");
    const suivi = [{ id: `${Date.now()}`, date: Date.now(), type: "conversion", texte: `Converti en dossier ${type}`, auteur: l.negociateur || "—" }, ...l.suivi];
    await majLead(l.id, { statut: "Converti", dossierId: d.id, suivi });
    alert(`Dossier ${type} créé. Retrouvez-le dans « Dossiers clients » pour compléter le projet de recherche.`);
  };

  const supprimer = async (l: Lead) => { if (confirm("Supprimer ce lead ?")) { await deleteLead(l.id); setSel(null); void recharger(); } };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-navy">📥 Leads entrant</h2>
          <p className="text-sm text-slate-500">Les leads de vos campagnes marketing — suivi du premier contact jusqu&apos;à la conversion.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={onRetour} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">← Accueil</button>
          <button onClick={() => void recharger()} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">{maj ? "⏳ Actualisation…" : "🔄 Actualiser"}</button>
          <button onClick={() => setConfig(!config)} className="rounded-lg border border-copper bg-white px-3 py-1.5 text-sm font-bold text-copper hover:bg-copper-soft/40">🔌 Brancher mes campagnes</button>
          <button onClick={() => setCreation(!creation)} className="rounded-lg bg-copper px-4 py-1.5 text-sm font-bold text-white hover:brightness-110">+ Nouveau lead</button>
        </div>
      </div>

      {config && <ConfigPasserelle />}

      {creation && (
        <div className="mb-4 grid gap-3 rounded-2xl border border-copper/40 bg-copper-soft/30 p-4 sm:grid-cols-3">
          <input className={inputCls} placeholder="Nom" value={nouveau.nom ?? ""} onChange={(e) => setNouveau({ ...nouveau, nom: e.target.value })} />
          <input className={inputCls} placeholder="Prénom" value={nouveau.prenom ?? ""} onChange={(e) => setNouveau({ ...nouveau, prenom: e.target.value })} />
          <input className={inputCls} placeholder="Téléphone" value={nouveau.tel ?? ""} onChange={(e) => setNouveau({ ...nouveau, tel: e.target.value })} />
          <input className={inputCls} placeholder="Email" value={nouveau.email ?? ""} onChange={(e) => setNouveau({ ...nouveau, email: e.target.value })} />
          <input className={inputCls} placeholder="Ville / secteur" value={nouveau.ville ?? ""} onChange={(e) => setNouveau({ ...nouveau, ville: e.target.value })} />
          <select className={inputCls} value={nouveau.typeProjet} onChange={(e) => setNouveau({ ...nouveau, typeProjet: e.target.value })}>{TYPES_PROJET_LEAD.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</select>
          <textarea className={`${inputCls} sm:col-span-2`} rows={2} placeholder="Message / demande" value={nouveau.message ?? ""} onChange={(e) => setNouveau({ ...nouveau, message: e.target.value })} />
          <button onClick={() => void creerLead()} className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white hover:bg-navy-deep">Créer le lead</button>
        </div>
      )}

      {/* Pipeline : compteurs par statut */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        <button onClick={() => setFStatut("")} className={`rounded-full px-3 py-1 text-xs font-semibold ${!fStatut ? "bg-navy text-white" : "border border-slate-200 bg-white text-slate-600"}`}>Tous ({(leads ?? []).length})</button>
        {STATUTS_LEAD.map((s) => (
          <button key={s} onClick={() => setFStatut(fStatut === s ? "" : s)} className={`rounded-full px-3 py-1 text-xs font-semibold ${fStatut === s ? "ring-2 ring-navy " : ""}${STATUT_LEAD_COULEURS[s]}`}>{s} ({compteur[s] ?? 0})</button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input className={`${inputCls} max-w-xs flex-1`} placeholder="🔎 Nom, tél, ville, campagne…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={`${inputCls} w-auto`} value={fSource} onChange={(e) => setFSource(e.target.value)}><option value="">Toutes sources</option>{SOURCES_LEAD.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
      </div>

      {leads === null ? <p className="text-sm text-slate-400">Chargement…</p> : resultats.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-400">Aucun lead. Branchez vos campagnes (bouton « Brancher mes campagnes ») ou créez un lead manuellement.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase text-slate-500"><tr><th className="px-3 py-2">Contact</th><th className="px-3 py-2">Source</th><th className="px-3 py-2">Projet</th><th className="px-3 py-2">Statut</th><th className="px-3 py-2">Transféré à</th><th className="px-3 py-2">Reçu</th></tr></thead>
            <tbody>
              {resultats.map((l) => (
                <tr key={l.id} onClick={() => setSel(l)} className="cursor-pointer border-t border-slate-100 hover:bg-copper-soft/20">
                  <td className="px-3 py-2"><div className="font-semibold text-navy">{[l.prenom, l.nom].filter(Boolean).join(" ") || "—"}</div><div className="text-xs text-slate-500">{[l.tel, l.email].filter(Boolean).join(" · ")}</div></td>
                  <td className="px-3 py-2 text-xs">{labelSource(l.source)}</td>
                  <td className="px-3 py-2 text-xs">{TYPES_PROJET_LEAD.find((t) => t.id === l.typeProjet)?.label ?? l.typeProjet}{l.ville ? ` · ${l.ville}` : ""}</td>
                  <td className="px-3 py-2"><span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUT_LEAD_COULEURS[l.statut] ?? "bg-slate-100 text-slate-600"}`}>{l.statut}</span></td>
                  <td className="px-3 py-2 text-xs">{l.negociateur || "—"}</td>
                  <td className="px-3 py-2 text-xs text-slate-400">{dateFr(l.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sel && <FicheLead lead={sel} onClose={() => setSel(null)} onStatut={changerStatut} onSuivi={ajouterSuivi} onPatch={majLead} onConvert={convertir} onDelete={supprimer} />}
    </div>
  );
}

function ConfigPasserelle() {
  const [origin, setOrigin] = useState("");
  useEffect(() => { setOrigin(window.location.origin); }, []);
  return (
    <div className="mb-4 rounded-2xl border border-copper/40 bg-white p-4 text-sm">
      <div className="mb-2 font-bold text-navy">🔌 Brancher vos campagnes (Facebook / Instagram Ads)</div>
      <ol className="ml-4 list-decimal space-y-1.5 text-slate-600">
        <li><b>Le plus simple (Zapier / Make)</b> : créez un scénario « Nouveau lead Facebook » → action « Webhook POST » vers <code className="rounded bg-slate-100 px-1">{origin}/api/leads</code>, en-tête <code className="rounded bg-slate-100 px-1">x-leads-key: VOTRE_SECRET</code>, corps JSON avec nom, prenom, tel, email, ville, message, source.</li>
        <li><b>Intégration native Meta</b> : dans votre App Meta, ajoutez le webhook <code className="rounded bg-slate-100 px-1">{origin}/api/leads/facebook</code> (champ <i>leadgen</i>), token de vérification <code className="rounded bg-slate-100 px-1">META_VERIFY_TOKEN</code>. Les leads arrivent automatiquement.</li>
      </ol>
      <p className="mt-2 text-xs text-slate-400">Variables à définir sur Vercel : <code>LEADS_INBOUND_SECRET</code> (Zapier/Make), <code>META_VERIFY_TOKEN</code> + <code>META_PAGE_TOKEN</code> (natif). Donnez-moi le feu vert et je peux les configurer.</p>
    </div>
  );
}

function FicheLead({ lead, onClose, onStatut, onSuivi, onPatch, onConvert, onDelete }: {
  lead: Lead; onClose: () => void;
  onStatut: (l: Lead, s: string) => void; onSuivi: (l: Lead, t: string, txt: string) => void;
  onPatch: (id: string, p: Partial<Lead>) => Promise<Lead | null>; onConvert: (l: Lead) => void; onDelete: (l: Lead) => void;
}) {
  const [type, setType] = useState(SUIVI_TYPES[0].id);
  const [texte, setTexte] = useState("");
  const [nego, setNego] = useState(lead.negociateur);
  const [notes, setNotes] = useState(lead.notes);
  const [copie, setCopie] = useState(false);

  const ficheEnTexte = (l: Lead): string =>
    [
      "🔔 NOUVEAU LEAD — " + (TYPES_PROJET_LEAD.find((t) => t.id === l.typeProjet)?.label ?? l.typeProjet),
      "",
      ["Nom", [l.prenom, l.nom].filter(Boolean).join(" ")],
      ["Téléphone", l.tel],
      ["Email", l.email],
      ["Ville", l.ville],
      l.budget != null ? ["Budget", `${int.format(l.budget)} €`] : null,
      ["Demande", l.message],
      ["Source", `${labelSource(l.source)}${l.campagne ? ` (${l.campagne})` : ""}`],
      ["Statut", l.statut],
      ["Reçu le", new Date(l.createdAt).toLocaleString("fr-FR")],
    ]
      .filter(Boolean)
      .map((e) => (Array.isArray(e) ? (e[1] && String(e[1]).trim() ? `${e[0]} : ${e[1]}` : "") : e))
      .filter((x) => x !== "")
      .join("\n");

  const copierFiche = async () => {
    try { await navigator.clipboard.writeText(ficheEnTexte(lead)); setCopie(true); setTimeout(() => setCopie(false), 1800); } catch { /* presse-papiers indisponible */ }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[88vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between">
          <div>
            <div className="text-lg font-bold text-navy">{[lead.prenom, lead.nom].filter(Boolean).join(" ") || "Lead"}</div>
            <div className="text-xs text-slate-500">{labelSource(lead.source)}{lead.campagne ? ` · ${lead.campagne}` : ""} · reçu le {new Date(lead.createdAt).toLocaleString("fr-FR")}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => void copierFiche()} className="rounded-lg bg-copper px-3 py-1.5 text-sm font-bold text-white transition hover:brightness-110">{copie ? "✓ Copié" : "📋 Copier la fiche"}</button>
            <button onClick={onClose} className="rounded-lg border border-slate-200 px-2 py-1 text-sm text-slate-500 hover:bg-slate-100">✕</button>
          </div>
        </div>

        <div className="grid gap-1.5 text-sm sm:grid-cols-2">
          {lead.tel && <div>📞 <a className="text-copper" href={`tel:${lead.tel}`}>{lead.tel}</a></div>}
          {lead.email && <div>✉ <a className="text-copper" href={`mailto:${lead.email}`}>{lead.email}</a></div>}
          {lead.ville && <div>📍 {lead.ville}</div>}
          {lead.budget != null && <div>💶 {int.format(lead.budget)} €</div>}
        </div>
        {lead.message && <p className="mt-2 rounded-lg bg-slate-50 p-2 text-sm text-slate-700">💬 {lead.message}</p>}

        {/* Pipeline de statut */}
        <div className="mt-3">
          <div className="mb-1 text-xs font-semibold uppercase text-slate-400">Statut du lead</div>
          <div className="flex flex-wrap gap-1.5">
            {STATUTS_LEAD.map((s) => (
              <button key={s} onClick={() => onStatut(lead, s)} className={`rounded-full px-3 py-1 text-xs font-semibold ${lead.statut === s ? "ring-2 ring-navy " : ""}${STATUT_LEAD_COULEURS[s]}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-slate-500">Transféré à (négociateur)
            <div className="mt-1 flex gap-1"><input className={inputCls} value={nego} onChange={(e) => setNego(e.target.value)} placeholder="Nom du négociateur" />
              <button onClick={() => { void onPatch(lead.id, { negociateur: nego }); if (nego && nego !== lead.negociateur) onSuivi(lead, "transfert", `Transféré à ${nego}`); }} className="rounded-lg bg-navy px-3 text-sm font-bold text-white">OK</button></div>
          </label>
          <label className="text-xs font-semibold text-slate-500">Notes internes
            <textarea className={`${inputCls} mt-1`} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={() => notes !== lead.notes && void onPatch(lead.id, { notes })} />
          </label>
        </div>

        {/* Ajout de suivi */}
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <select className={`${inputCls} w-auto`} value={type} onChange={(e) => setType(e.target.value)}>{SUIVI_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</select>
          <input className={`${inputCls} min-w-[180px] flex-1`} value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Ex. Appelé, RDV fixé mardi 14h" />
          <button onClick={() => { onSuivi(lead, type, texte); setTexte(""); }} className="rounded-lg bg-copper px-4 py-1.5 text-sm font-bold text-white">Ajouter au suivi</button>
        </div>

        {/* Timeline */}
        <ul className="mt-3 space-y-1.5">
          {lead.suivi.map((s) => (
            <li key={s.id} className="flex gap-2 text-sm"><span className="mt-0.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-500">{SUIVI_TYPES.find((t) => t.id === s.type)?.label ?? s.type}</span><div><div className="text-slate-800">{s.texte}</div><div className="text-xs text-slate-400">{new Date(s.date).toLocaleString("fr-FR")}{s.auteur && s.auteur !== "—" ? ` · ${s.auteur}` : ""}</div></div></li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <button onClick={() => onDelete(lead)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">Supprimer</button>
          <button onClick={() => onConvert(lead)} disabled={!!lead.dossierId} className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-bold text-white hover:brightness-110 disabled:opacity-50">{lead.dossierId ? "✓ Converti en dossier" : "→ Convertir en dossier client"}</button>
        </div>
      </div>
    </div>
  );
}
