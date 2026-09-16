"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ROLES_LABELS, CATEGORIES_LABELS, PRIORITES_LABELS, STATUTS_LABELS, QUALITES_LABELS,
  type SyndicRole, type SyndicUserPublic,
} from "@/lib/syndic/types";
import { CHAMPS_IMPORT, type TypeImport } from "@/lib/syndic/csv";
import * as api from "@/lib/syndic/client";
import type { ResidenceListe } from "@/lib/syndic/client";

const inputCls = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/20";
const btnNavy = "rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-deep disabled:opacity-50";
const btnCopper = "rounded-lg bg-copper px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50";
const ROLES: SyndicRole[] = ["accueil", "gestionnaire_syndic", "admin"];

function Centre({ children }: { children: React.ReactNode }) {
  return <div className="grid min-h-screen place-items-center bg-slate-100 p-4">{children}</div>;
}

export default function SyndicPage() {
  const [chargement, setChargement] = useState(true);
  const [user, setUser] = useState<SyndicUserPublic | null>(null);
  const [besoinBootstrap, setBesoin] = useState(false);
  const [section, setSection] = useState<string>("demandes");
  const [ticketId, setTicketId] = useState<string | null>(null);

  const recharger = async () => {
    try { const r = await api.meApi(); setUser(r.user); setBesoin(Boolean(r.besoinBootstrap)); }
    catch { /* hors ligne : on laisse l'écran de connexion */ }
    finally { setChargement(false); }
  };
  useEffect(() => { void recharger(); }, []);

  if (chargement) return <Centre><p className="text-sm text-slate-400">Chargement…</p></Centre>;
  if (!user) return besoinBootstrap ? <Bootstrap onOk={recharger} /> : <Login onOk={recharger} />;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="flex items-center gap-3 bg-navy-deep px-4 py-3 text-white">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-copper text-lg font-black">21</span>
        <div className="leading-tight">
          <b className="block text-sm font-bold tracking-wide">Century 21 Icaza — Syndic</b>
          <span className="text-[11px] text-white/60">Gestion des demandes des copropriétaires</span>
        </div>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <span className="hidden sm:inline">{user.prenom} {user.nom} · <b className="text-copper">{ROLES_LABELS[user.role]}</b></span>
          <a href="/" className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold hover:bg-white/10">← Outils</a>
          <button onClick={async () => { await api.logoutApi(); setUser(null); void recharger(); }} className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold hover:bg-white/10">Déconnexion</button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {(() => {
          const nav: [string, string][] =
            user.role === "admin"
              ? [["demandes", "📋 Demandes"], ["nouvelle", "➕ Nouvelle demande"], ["mail", "📧 Depuis un mail"], ["residences", "🏢 Résidences"], ["utilisateurs", "👥 Utilisateurs"], ["import", "⬆️ Import CSV"]]
              : user.role === "accueil"
                ? [["demandes", "📋 Demandes du jour"], ["nouvelle", "➕ Nouvelle demande"], ["mail", "📧 Depuis un mail"]]
                : [["demandes", "📋 Mes demandes"], ["mail", "📧 Depuis un mail"]];
          const goto = (s: string) => { setTicketId(null); setSection(s); };
          return (
            <>
              <div className="mb-5 flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-white p-1 text-sm font-semibold">
                {nav.map(([k, lbl]) => (
                  <button key={k} onClick={() => goto(k)} className={`rounded-md px-4 py-1.5 transition ${section === k && !ticketId ? "bg-copper text-white" : "text-slate-600 hover:bg-slate-100"}`}>{lbl}</button>
                ))}
              </div>
              {ticketId ? (
                <TicketDetail id={ticketId} role={user.role} onBack={() => setTicketId(null)} />
              ) : section === "demandes" ? (
                <TicketsList role={user.role} onOpen={setTicketId} onNouvelle={() => goto("nouvelle")} />
              ) : section === "nouvelle" ? (
                <NouvelleDemande onCree={(id) => setTicketId(id)} />
              ) : section === "mail" ? (
                <ColleMail onCree={(id) => setTicketId(id)} />
              ) : section === "residences" ? (
                <AdminResidences />
              ) : section === "utilisateurs" ? (
                <AdminUsers moiId={user.id} />
              ) : section === "import" ? (
                <AdminImport />
              ) : null}
            </>
          );
        })()}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------- Connexion
function Login({ onOk }: { onOk: () => void }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const soumettre = async () => {
    setErr(null); setBusy(true);
    try { await api.loginApi(email, pw); onOk(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Connexion impossible"); }
    finally { setBusy(false); }
  };
  return (
    <Centre>
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-copper text-xl font-black text-white">21</div>
        <h1 className="text-xl font-bold text-navy">Syndic — Century 21 Icaza</h1>
        <p className="mt-1 text-sm text-slate-500">Connectez-vous avec votre identifiant personnel.</p>
        <input className={`${inputCls} mt-5`} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={`${inputCls} mt-3`} type="password" placeholder="Mot de passe" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && soumettre()} />
        <button onClick={soumettre} disabled={busy} className={`${btnNavy} mt-4 w-full`}>{busy ? "Connexion…" : "Se connecter"}</button>
        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
      </div>
    </Centre>
  );
}

// ---------------------------------------------------- Premier admin (bootstrap)
function Bootstrap({ onOk }: { onOk: () => void }) {
  const [f, setF] = useState({ nom: "", prenom: "", email: "", motDePasse: "", equipe: "" });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));
  const soumettre = async () => {
    setErr(null); setBusy(true);
    try {
      await api.bootstrapApi({ nom: f.nom, prenom: f.prenom, email: f.email, motDePasse: f.motDePasse }, f.equipe);
      onOk();
    } catch (e) { setErr(e instanceof Error ? e.message : "Initialisation impossible"); }
    finally { setBusy(false); }
  };
  return (
    <Centre>
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-navy">Initialiser le module Syndic</h1>
        <p className="mt-1 text-sm text-slate-500">Créez le premier compte <b>responsable d&apos;agence</b>. Vous pourrez ensuite créer les gestionnaires et l&apos;accueil.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <input className={inputCls} placeholder="Nom" value={f.nom} onChange={(e) => set("nom", e.target.value)} />
          <input className={inputCls} placeholder="Prénom" value={f.prenom} onChange={(e) => set("prenom", e.target.value)} />
        </div>
        <input className={`${inputCls} mt-3`} type="email" placeholder="Email (identifiant)" value={f.email} onChange={(e) => set("email", e.target.value)} />
        <input className={`${inputCls} mt-3`} type="password" placeholder="Mot de passe (6 caractères min.)" value={f.motDePasse} onChange={(e) => set("motDePasse", e.target.value)} />
        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Pour sécuriser cette première création, saisissez le <b>mot de passe d&apos;équipe</b> de l&apos;agence (le même que l&apos;outil d&apos;estimation).</p>
          <input className={`${inputCls} mt-2`} type="password" placeholder="Mot de passe d'équipe" value={f.equipe} onChange={(e) => set("equipe", e.target.value)} />
        </div>
        <button onClick={soumettre} disabled={busy} className={`${btnCopper} mt-4 w-full`}>{busy ? "Création…" : "Créer le responsable et entrer"}</button>
        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
      </div>
    </Centre>
  );
}

// -------------------------------------------------------------- Utilisateurs
function AdminUsers({ moiId }: { moiId: string }) {
  const [users, setUsers] = useState<SyndicUserPublic[]>([]);
  const [nouveau, setNouveau] = useState({ nom: "", prenom: "", email: "", role: "gestionnaire_syndic" as SyndicRole, telephoneMobile: "", motDePasse: "" });
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const charger = () => api.listUsersApi().then((r) => setUsers(r.users)).catch(() => {});
  useEffect(() => { void charger(); }, []);
  const setN = (k: keyof typeof nouveau, v: string) => setNouveau((p) => ({ ...p, [k]: v }));

  const creer = async () => {
    setErr(null); setMsg(null);
    try { await api.createUserApi(nouveau); setNouveau({ nom: "", prenom: "", email: "", role: "gestionnaire_syndic", telephoneMobile: "", motDePasse: "" }); setMsg("Utilisateur créé."); void charger(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Création impossible"); }
  };
  const maj = async (id: string, patch: Record<string, unknown>) => { try { await api.updateUserApi(id, patch); void charger(); } catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); } };
  const supprimer = async (id: string) => { if (!confirm("Supprimer cet utilisateur ?")) return; try { await api.deleteUserApi(id); void charger(); } catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); } };
  const resetPw = async (id: string) => { const p = prompt("Nouveau mot de passe (6 caractères min.) :"); if (p && p.length >= 6) await maj(id, { motDePasse: p }); else if (p) alert("Trop court."); };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-3 text-sm font-bold text-navy">Ajouter un utilisateur</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input className={inputCls} placeholder="Nom" value={nouveau.nom} onChange={(e) => setN("nom", e.target.value)} />
          <input className={inputCls} placeholder="Prénom" value={nouveau.prenom} onChange={(e) => setN("prenom", e.target.value)} />
          <input className={inputCls} type="email" placeholder="Email" value={nouveau.email} onChange={(e) => setN("email", e.target.value)} />
          <select className={inputCls} value={nouveau.role} onChange={(e) => setN("role", e.target.value)}>
            {ROLES.map((r) => <option key={r} value={r}>{ROLES_LABELS[r]}</option>)}
          </select>
          <input className={inputCls} placeholder="Mobile (SMS)" value={nouveau.telephoneMobile} onChange={(e) => setN("telephoneMobile", e.target.value)} />
          <input className={inputCls} type="text" placeholder="Mot de passe (6+)" value={nouveau.motDePasse} onChange={(e) => setN("motDePasse", e.target.value)} />
        </div>
        <button onClick={creer} className={`${btnCopper} mt-3`}>+ Créer</button>
        {msg && <span className="ml-3 text-sm text-emerald-600">{msg}</span>}
        {err && <span className="ml-3 text-sm text-red-600">{err}</span>}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
            <th className="p-3">Nom</th><th className="p-3">Email</th><th className="p-3">Rôle</th><th className="p-3">Actif</th><th className="p-3">Absence</th><th className="p-3"></th>
          </tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-100 align-top">
                <td className="p-3 font-semibold text-navy">{u.prenom} {u.nom}</td>
                <td className="p-3 text-slate-600">{u.email}</td>
                <td className="p-3">
                  <select className={`${inputCls} !py-1`} value={u.role} onChange={(e) => maj(u.id, { role: e.target.value })}>
                    {ROLES.map((r) => <option key={r} value={r}>{ROLES_LABELS[r]}</option>)}
                  </select>
                </td>
                <td className="p-3"><input type="checkbox" checked={u.actif} onChange={(e) => maj(u.id, { actif: e.target.checked })} /></td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <input type="date" className={`${inputCls} !py-1`} value={u.absentDu ?? ""} onChange={(e) => maj(u.id, { absentDu: e.target.value || null })} />
                    <span className="text-slate-400">→</span>
                    <input type="date" className={`${inputCls} !py-1`} value={u.absentAu ?? ""} onChange={(e) => maj(u.id, { absentAu: e.target.value || null })} />
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => resetPw(u.id)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-100">Mot de passe</button>
                    {u.id !== moiId && <button onClick={() => supprimer(u.id)} className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50">Supprimer</button>}
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-slate-400">Aucun utilisateur.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Résidences
function AdminResidences() {
  const [residences, setResidences] = useState<ResidenceListe[]>([]);
  const [users, setUsers] = useState<SyndicUserPublic[]>([]);
  const [n, setNv] = useState({ nom: "", refExterne: "", adresse: "", codePostal: "", commune: "" });
  const [err, setErr] = useState<string | null>(null);
  const charger = async () => {
    try {
      const [r, u] = await Promise.all([api.listResidencesApi(), api.listUsersApi()]);
      setResidences(r.residences); setUsers(u.users);
    } catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); }
  };
  useEffect(() => { void charger(); }, []);
  const gestionnaires = useMemo(() => users.filter((u) => u.role === "gestionnaire_syndic" || u.role === "admin"), [users]);
  const setN = (k: keyof typeof n, v: string) => setNv((p) => ({ ...p, [k]: v }));

  const creer = async () => {
    setErr(null);
    try { await api.createResidenceApi(n); setNv({ nom: "", refExterne: "", adresse: "", codePostal: "", commune: "" }); void charger(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Création impossible"); }
  };
  const maj = async (id: string, patch: Record<string, unknown>) => { try { await api.updateResidenceApi(id, patch); void charger(); } catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); } };
  const supprimer = async (id: string) => { if (!confirm("Supprimer cette résidence ?")) return; try { await api.deleteResidenceApi(id); void charger(); } catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); } };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-3 text-sm font-bold text-navy">Ajouter une résidence</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input className={inputCls} placeholder="Nom de la résidence" value={n.nom} onChange={(e) => setN("nom", e.target.value)} />
          <input className={inputCls} placeholder="Référence syndic (facultatif)" value={n.refExterne} onChange={(e) => setN("refExterne", e.target.value)} />
          <input className={inputCls} placeholder="Adresse" value={n.adresse} onChange={(e) => setN("adresse", e.target.value)} />
          <input className={inputCls} placeholder="Code postal" value={n.codePostal} onChange={(e) => setN("codePostal", e.target.value)} />
          <input className={inputCls} placeholder="Commune" value={n.commune} onChange={(e) => setN("commune", e.target.value)} />
        </div>
        <button onClick={creer} className={`${btnCopper} mt-3`}>+ Créer</button>
        {err && <span className="ml-3 text-sm text-red-600">{err}</span>}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
            <th className="p-3">Résidence</th><th className="p-3">Réf.</th><th className="p-3">Commune</th><th className="p-3">Lots</th><th className="p-3">Titulaire</th><th className="p-3">Suppléant</th><th className="p-3"></th>
          </tr></thead>
          <tbody>
            {residences.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="p-3 font-semibold text-navy">{r.nom}</td>
                <td className="p-3 text-slate-500">{r.refExterne || "—"}</td>
                <td className="p-3 text-slate-600">{[r.codePostal, r.commune].filter(Boolean).join(" ") || "—"}</td>
                <td className="p-3 tabular-nums">{r.nbLots}</td>
                <td className="p-3">
                  <select className={`${inputCls} !py-1`} value={r.gestionnaireTitulaireId ?? ""} onChange={(e) => maj(r.id, { gestionnaireTitulaireId: e.target.value || null })}>
                    <option value="">— aucun —</option>
                    {gestionnaires.map((u) => <option key={u.id} value={u.id}>{u.prenom} {u.nom}</option>)}
                  </select>
                </td>
                <td className="p-3">
                  <select className={`${inputCls} !py-1`} value={r.gestionnaireSuppleantId ?? ""} onChange={(e) => maj(r.id, { gestionnaireSuppleantId: e.target.value || null })}>
                    <option value="">— aucun —</option>
                    {gestionnaires.map((u) => <option key={u.id} value={u.id}>{u.prenom} {u.nom}</option>)}
                  </select>
                </td>
                <td className="p-3"><button onClick={() => supprimer(r.id)} className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50">Supprimer</button></td>
              </tr>
            ))}
            {residences.length === 0 && <tr><td colSpan={7} className="p-4 text-center text-slate-400">Aucune résidence. Ajoutez-en une ou importez un CSV.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Import CSV
function AdminImport() {
  const [type, setType] = useState<TypeImport>("residences");
  const [csvText, setCsvText] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [apercu, setApercu] = useState<api.ApercuImport | null>(null);
  const [rapport, setRapport] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const champs = CHAMPS_IMPORT[type];

  const auto = (hs: string[], t: TypeImport): Record<string, string> => {
    const m: Record<string, string> = {};
    for (const c of CHAMPS_IMPORT[t]) {
      const trouve = hs.find((h) => h.toLowerCase().replace(/[^a-z]/g, "").includes(c.cle.toLowerCase().replace(/[^a-z]/g, "").slice(0, 4)));
      if (trouve) m[c.cle] = trouve;
    }
    return m;
  };

  const onFichier = async (file: File | undefined) => {
    if (!file) return;
    setErr(null); setApercu(null); setRapport(null);
    const texte = await file.text();
    setCsvText(texte);
    const ligne1 = texte.replace(/\r/g, "").split("\n")[0] ?? "";
    const sep = [";", ",", "\t"].sort((a, b) => ligne1.split(b).length - ligne1.split(a).length)[0];
    const hs = ligne1.split(sep).map((h) => h.trim().replace(/^"|"$/g, ""));
    setHeaders(hs); setMapping(auto(hs, type));
  };

  const preview = async () => {
    setErr(null); setRapport(null); setBusy(true);
    try { setApercu(await api.previewImportApi(type, csvText, mapping)); }
    catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); }
    finally { setBusy(false); }
  };
  const appliquer = async () => {
    setErr(null); setBusy(true);
    try { const r = await api.applyImportApi(type, csvText, mapping); setRapport(`Import terminé : ${r.crees} créé(s), ${r.majs} mis à jour, ${r.ignores} ignoré(s).${r.erreurs.length ? " " + r.erreurs.slice(0, 5).join(" ; ") : ""}`); }
    catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-navy">Type :</span>
          {(["residences", "lots", "contacts"] as TypeImport[]).map((t) => (
            <button key={t} onClick={() => { setType(t); setApercu(null); setRapport(null); setMapping(auto(headers, t)); }} className={`rounded-full px-3 py-1 text-xs font-semibold ${type === t ? "bg-navy text-white" : "border border-slate-200 text-slate-600"}`}>{t}</button>
          ))}
          <label className="ml-auto cursor-pointer rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
            📄 Choisir un fichier CSV
            <input type="file" accept=".csv,text/csv,text/plain" className="hidden" onChange={(e) => onFichier(e.target.files?.[0])} />
          </label>
        </div>
        <p className="mt-2 text-xs text-slate-400">Import rejouable sans doublon : les lignes déjà présentes (même référence) sont mises à jour, pas dupliquées.</p>
      </div>

      {headers.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-bold text-navy">Correspondance des colonnes</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {champs.map((c) => (
              <label key={c.cle} className="text-sm">
                <span className="mb-1 block font-semibold text-slate-600">{c.libelle}{c.requis && <span className="text-red-500"> *</span>}</span>
                <select className={inputCls} value={mapping[c.cle] ?? ""} onChange={(e) => setMapping((m) => ({ ...m, [c.cle]: e.target.value }))}>
                  <option value="">— ignorer —</option>
                  {headers.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </label>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={preview} disabled={busy} className={btnNavy}>Aperçu</button>
            {apercu && <button onClick={appliquer} disabled={busy || apercu.nbValides === 0} className={btnCopper}>Importer {apercu.nbValides} ligne(s)</button>}
          </div>
          {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
          {rapport && <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{rapport}</p>}
        </div>
      )}

      {apercu && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="mb-2 text-sm font-bold text-navy">Aperçu — {apercu.nbValides} valides, {apercu.nbErreurs} en erreur (sur {apercu.total})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="text-left text-slate-400">
                <th className="p-2">#</th>{champs.map((c) => <th key={c.cle} className="p-2">{c.libelle}</th>)}<th className="p-2">Contrôle</th>
              </tr></thead>
              <tbody>
                {apercu.apercu.map((l) => (
                  <tr key={l.ligne} className={`border-t border-slate-100 ${l.erreurs.length ? "bg-red-50/50" : ""}`}>
                    <td className="p-2 text-slate-400">{l.ligne}</td>
                    {champs.map((c) => <td key={c.cle} className="p-2">{l.valeurs[c.cle] || "—"}</td>)}
                    <td className="p-2">{l.erreurs.length ? <span className="text-red-600">{l.erreurs.join(", ")}</span> : <span className="text-emerald-600">OK</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// TICKETS / DEMANDES
// ============================================================================
const prioCls: Record<string, string> = { normale: "bg-slate-100 text-slate-600", haute: "bg-amber-100 text-amber-700", urgence: "bg-red-100 text-red-700" };
const statutCls: Record<string, string> = { nouveau: "bg-blue-100 text-blue-700", assigne: "bg-indigo-100 text-indigo-700", en_cours: "bg-amber-100 text-amber-700", en_attente: "bg-purple-100 text-purple-700", clos: "bg-emerald-100 text-emerald-700" };
const CATS = Object.keys(CATEGORIES_LABELS);
const CAT_ICONS: Record<string, string> = { information: "ℹ️", demande_document: "📄", travaux_parties_communes: "🔧", sinistre: "🌊", reclamation: "⚠️", charges_comptabilite: "💶", assemblee_generale: "🏛️", autre: "📌" };
const MOTS_URGENCE = ["fuite", "eau", "gaz", "feu", "fumée", "fumee", "incendie", "ascenseur", "coincé", "coince", "inondation", "courant", "électricité", "electricite", "porte bloquée", "porte bloquee", "vitre cassée", "vitre cassee", "effraction"];
const dateFr = (t: number) => new Date(t).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" });
const dateHeure = (t: number) => new Date(t).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

function TicketsList({ role, onOpen, onNouvelle }: { role: SyndicRole; onOpen: (id: string) => void; onNouvelle: () => void }) {
  const [tickets, setTickets] = useState<api.TicketResume[]>([]);
  const [f, setF] = useState<string>("");
  const [charge, setCharge] = useState(false);
  useEffect(() => { setCharge(true); api.listTicketsApi().then((r) => setTickets(r.tickets)).catch(() => {}).finally(() => setCharge(false)); }, []);
  const list = tickets.filter((t) => !f || (f === "qualifier" ? t.aQualifier : f === "attribuer" ? t.aAttribuer : f === "valider" ? t.aValider : t.statut === f));
  const filtres: [string, string][] = [["", "Toutes"], ["valider", "À valider"], ["nouveau", "Nouveau"], ["en_cours", "En cours"], ["en_attente", "En attente"], ["clos", "Clos"], ["qualifier", "À qualifier"], ["attribuer", "À attribuer"]];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-1.5">
        {filtres.map(([k, lbl]) => (
          <button key={k || "all"} onClick={() => setF(k)} className={`rounded-full px-3 py-1 text-xs font-semibold ${f === k ? "bg-navy text-white" : "border border-slate-200 bg-white text-slate-600"}`}>{lbl}</button>
        ))}
        {(role === "accueil" || role === "admin") && <button onClick={onNouvelle} className={`${btnCopper} ml-auto !py-1.5`}>➕ Nouvelle demande</button>}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
            <th className="p-3">N°</th><th className="p-3">Objet</th><th className="p-3">Catégorie</th><th className="p-3">Résidence</th><th className="p-3">Gestionnaire</th><th className="p-3">Priorité</th><th className="p-3">Statut</th><th className="p-3">Reçu</th>
          </tr></thead>
          <tbody>
            {list.map((t) => (
              <tr key={t.id} onClick={() => onOpen(t.id)} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50">
                <td className="p-3 font-mono text-xs text-slate-500">{t.numero}{t.origine === "mail" && <span title="Créé depuis un mail"> 📧</span>}</td>
                <td className="p-3 font-semibold text-navy">{t.objet || CATEGORIES_LABELS[t.categorie]}{t.aValider && <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">à valider</span>}</td>
                <td className="p-3 text-slate-600">{CAT_ICONS[t.categorie]} {CATEGORIES_LABELS[t.categorie]}</td>
                <td className="p-3 text-slate-600">{t.residenceNom || <span className="text-amber-600">à qualifier</span>}</td>
                <td className="p-3 text-slate-600">{t.assigneNom || <span className="text-amber-600">à attribuer</span>}</td>
                <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${prioCls[t.priorite]}`}>{PRIORITES_LABELS[t.priorite]}</span></td>
                <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${statutCls[t.statut]}`}>{STATUTS_LABELS[t.statut]}</span></td>
                <td className="p-3 text-xs text-slate-400">{dateFr(t.creeLe)}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-sm text-slate-400">{charge ? "Chargement…" : "Aucune demande."}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NouvelleDemande({ onCree }: { onCree: (id: string) => void }) {
  const [residences, setResidences] = useState<api.ResidenceListe[]>([]);
  const [urgence, setUrgence] = useState(false);
  const [appele, setAppele] = useState(false);
  const [f, setF] = useState({ demandeurNom: "", demandeurTelephone: "", demandeurEmail: "", demandeurQualite: "proprietaire", residenceId: "", categorie: "", objet: "", description: "", creneauRappel: "", origine: "accueil_telephone" });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [succes, setSucces] = useState<{ numero: string; id: string } | null>(null);
  useEffect(() => { api.listResidencesApi().then((r) => setResidences(r.residences)).catch(() => {}); }, []);
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));
  const motUrgence = MOTS_URGENCE.find((m) => f.description.toLowerCase().includes(m));

  const soumettre = async () => {
    setErr(null);
    if (!f.demandeurNom || !f.demandeurTelephone || !f.categorie || !f.description) { setErr("Nom, téléphone, catégorie et description sont obligatoires."); return; }
    if (urgence && !appele) { setErr("Cochez « J'ai appelé le gestionnaire » pour valider une urgence."); return; }
    setBusy(true);
    try {
      const r = await api.createTicketApi({ ...f, priorite: urgence ? "urgence" : "normale" });
      setSucces({ numero: r.ticket.numero, id: r.ticket.id });
    } catch (e) { setErr(e instanceof Error ? e.message : "Création impossible"); }
    finally { setBusy(false); }
  };

  if (succes) return (
    <div className="mx-auto max-w-lg rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
      <div className="text-4xl">✅</div>
      <h2 className="mt-3 text-xl font-bold text-navy">Demande transmise</h2>
      <p className="mt-2 text-sm text-slate-600">À dire au client : « C&apos;est transmis à votre gestionnaire. Vous serez rappelé{f.creneauRappel ? ` (${f.creneauRappel})` : ""}. »</p>
      <p className="mt-2 font-mono text-sm font-bold text-emerald-700">{succes.numero}</p>
      <div className="mt-5 flex justify-center gap-3">
        <button onClick={() => onCree(succes.id)} className={btnNavy}>Ouvrir la demande</button>
        <button onClick={() => { setSucces(null); setUrgence(false); setAppele(false); setF({ demandeurNom: "", demandeurTelephone: "", demandeurEmail: "", demandeurQualite: "proprietaire", residenceId: "", categorie: "", objet: "", description: "", creneauRappel: "", origine: "accueil_telephone" }); }} className={btnCopper}>Nouvelle demande</button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* URGENCE */}
      <div className={`rounded-2xl border-2 p-4 ${urgence ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"}`}>
        <button onClick={() => setUrgence((u) => !u)} className={`w-full rounded-xl px-4 py-3 text-lg font-black ${urgence ? "bg-red-600 text-white" : "bg-red-100 text-red-700"}`}>🚨 URGENCE {urgence ? "ACTIVÉE" : ""}</button>
        {urgence && (
          <div className="mt-3 text-sm text-red-800">
            <p className="font-semibold">Appelez maintenant le gestionnaire de la résidence. Sans réponse en 15 minutes, appelez le responsable.</p>
            <label className="mt-2 flex items-center gap-2 font-semibold"><input type="checkbox" checked={appele} onChange={(e) => setAppele(e.target.checked)} /> J&apos;ai appelé le gestionnaire</label>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <div>
          <div className="mb-1 text-sm font-bold text-navy">Qui appelle ?</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={inputCls} placeholder="Nom du demandeur *" value={f.demandeurNom} onChange={(e) => set("demandeurNom", e.target.value)} />
            <input className={inputCls} placeholder="Téléphone *" value={f.demandeurTelephone} onChange={(e) => set("demandeurTelephone", e.target.value)} />
            <input className={inputCls} type="email" placeholder="Email (facultatif)" value={f.demandeurEmail} onChange={(e) => set("demandeurEmail", e.target.value)} />
            <select className={inputCls} value={f.demandeurQualite} onChange={(e) => set("demandeurQualite", e.target.value)}>
              {Object.entries(QUALITES_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>
        <div>
          <div className="mb-1 text-sm font-bold text-navy">Résidence <span className="font-normal text-slate-400">(sans résidence, la demande part « à qualifier »)</span></div>
          <select className={inputCls} value={f.residenceId} onChange={(e) => set("residenceId", e.target.value)}>
            <option value="">— résidence inconnue —</option>
            {residences.map((r) => <option key={r.id} value={r.id}>{r.nom}{r.commune ? ` · ${r.commune}` : ""}</option>)}
          </select>
        </div>
        <div>
          <div className="mb-1 text-sm font-bold text-navy">Catégorie *</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CATS.map((c) => (
              <button key={c} onClick={() => set("categorie", c)} className={`rounded-xl border p-2 text-center text-xs font-semibold transition ${f.categorie === c ? "border-copper bg-copper-soft/40 text-copper" : "border-slate-200 text-slate-600 hover:border-copper/50"}`}>
                <div className="text-lg">{CAT_ICONS[c]}</div>{CATEGORIES_LABELS[c]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 text-sm font-bold text-navy">Ce qu&apos;il veut *</div>
          <input className={`${inputCls} mb-2`} placeholder="Objet court (facultatif)" value={f.objet} onChange={(e) => set("objet", e.target.value)} />
          <textarea rows={4} className={inputCls} placeholder="Description de la demande" value={f.description} onChange={(e) => set("description", e.target.value)} />
          {motUrgence && !urgence && (
            <button onClick={() => setUrgence(true)} className="mt-2 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700">⚠️ Mot d&apos;urgence détecté (« {motUrgence} ») — passer en URGENCE ?</button>
          )}
          <input className={`${inputCls} mt-2`} placeholder="Créneau de rappel souhaité (ex. demain matin)" value={f.creneauRappel} onChange={(e) => set("creneauRappel", e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={soumettre} disabled={busy} className={btnCopper}>{busy ? "Envoi…" : "Envoyer au gestionnaire"}</button>
          {err && <span className="text-sm text-red-600">{err}</span>}
        </div>
      </div>
    </div>
  );
}

function TicketDetail({ id, role, onBack }: { id: string; role: SyndicRole; onBack: () => void }) {
  const [d, setD] = useState<api.TicketDetail | null>(null);
  const [users, setUsers] = useState<SyndicUserPublic[]>([]);
  const [residences, setResidences] = useState<api.ResidenceListe[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [statutCible, setStatutCible] = useState("");
  const [motif, setMotif] = useState("");
  const [reassignId, setReassignId] = useState("");
  const [reassignMotif, setReassignMotif] = useState("");
  const [qualifId, setQualifId] = useState("");
  const [faits, setFaits] = useState("");
  const [brouillon, setBrouillon] = useState<{ objet: string; corps: string } | null>(null);
  const [iaBusy, setIaBusy] = useState(false);
  const [copie, setCopie] = useState(false);
  const canTraiter = role === "gestionnaire_syndic" || role === "admin";
  const canQualifier = role === "accueil" || role === "admin";

  const charger = () => api.getTicketApi(id).then(setD).catch((e) => setErr(e instanceof Error ? e.message : "Erreur"));
  useEffect(() => { void charger(); if (role !== "accueil") { api.listUsersApi().then((r) => setUsers(r.users)).catch(() => {}); api.listResidencesApi().then((r) => setResidences(r.residences)).catch(() => {}); } }, [id]);

  const action = async (payload: Record<string, unknown>) => { setErr(null); try { await api.patchTicketApi(id, payload); await charger(); } catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); } };
  const rediger = async () => { setErr(null); setIaBusy(true); try { const r = await api.draftEmailApi(id, faits); setBrouillon(r.brouillon); } catch (e) { setErr(e instanceof Error ? e.message : "Rédaction impossible"); } finally { setIaBusy(false); } };
  const copier = async () => { if (!brouillon) return; try { await navigator.clipboard.writeText(`Objet : ${brouillon.objet}\n\n${brouillon.corps}`); setCopie(true); setTimeout(() => setCopie(false), 2000); } catch { /* ignore */ } };

  if (!d) return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-400">{err || "Chargement…"}</div>;
  const t = d.ticket;
  const gestionnaires = users.filter((u) => u.role === "gestionnaire_syndic" || u.role === "admin");

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-sm font-semibold text-slate-500 hover:text-copper">← Retour aux demandes</button>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm text-slate-500">{t.numero}</span>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${prioCls[t.priorite]}`}>{PRIORITES_LABELS[t.priorite]}</span>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${statutCls[t.statut]}`}>{STATUTS_LABELS[t.statut]}</span>
          <span className="ml-auto text-xs text-slate-400">Reçu le {dateHeure(t.creeLe)}</span>
        </div>
        <h2 className="mt-2 text-xl font-bold text-navy">{t.objet || CATEGORIES_LABELS[t.categorie]}</h2>
        <div className="mt-1 text-sm text-slate-500">{CAT_ICONS[t.categorie]} {CATEGORIES_LABELS[t.categorie]} · {d.residenceNom || "résidence à qualifier"} · Gestionnaire : {d.assigneNom || "à attribuer"}</div>
        <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{t.description}</p>
        {canTraiter && (
          <div className="mt-4 grid gap-2 rounded-xl bg-slate-50 p-3 text-sm sm:grid-cols-2">
            <div><span className="text-slate-400">Demandeur :</span> <b>{t.demandeurNom}</b> ({QUALITES_LABELS[t.demandeurQualite] ?? t.demandeurQualite})</div>
            <div><span className="text-slate-400">Contact :</span> {t.demandeurTelephone}{t.demandeurEmail ? ` · ${t.demandeurEmail}` : ""}</div>
            {t.creneauRappel && <div><span className="text-slate-400">Rappel souhaité :</span> {t.creneauRappel}</div>}
          </div>
        )}
        {t.statut === "en_attente" && t.motifAttente && <p className="mt-2 text-xs text-purple-700">En attente : {t.motifAttente}</p>}
        {t.statut === "clos" && t.resumeResolution && <p className="mt-2 text-xs text-emerald-700">Résolution : {t.resumeResolution}</p>}
      </div>

      {/* Demande issue d'un mail, à valider */}
      {canTraiter && Boolean(t.aValider) && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <span className="text-sm text-amber-800">📧 Demande créée automatiquement par l&apos;IA depuis un mail — à confirmer avant traitement.</span>
          <button onClick={() => action({ action: "valider" })} className={`${btnCopper} ml-auto`}>Valider la demande</button>
        </div>
      )}

      {/* Qualifier (résidence inconnue) */}
      {canQualifier && !t.residenceId && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="mb-2 text-sm font-bold text-amber-800">Qualifier la résidence</div>
          <div className="flex flex-wrap gap-2">
            <select className={`${inputCls} max-w-xs`} value={qualifId} onChange={(e) => setQualifId(e.target.value)}>
              <option value="">— choisir une résidence —</option>
              {residences.map((r) => <option key={r.id} value={r.id}>{r.nom}</option>)}
            </select>
            <button onClick={() => qualifId && action({ action: "qualifier", residenceId: qualifId })} className={btnNavy}>Attribuer</button>
          </div>
        </div>
      )}

      {/* Actions gestionnaire */}
      {canTraiter && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="text-sm font-bold text-navy">Traiter la demande</div>
          <div className="flex flex-wrap gap-2">
            {t.statut !== "en_cours" && t.statut !== "clos" && <button onClick={() => action({ action: "prendre" })} className={btnNavy}>Prendre en charge</button>}
            <button onClick={() => action({ action: "reponse" })} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">J&apos;ai rappelé le client</button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select className={`${inputCls} max-w-[180px]`} value={statutCible} onChange={(e) => setStatutCible(e.target.value)}>
              <option value="">Changer le statut…</option>
              {Object.entries(STATUTS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            {(statutCible === "en_attente" || statutCible === "clos") && (
              <input className={`${inputCls} flex-1`} placeholder={statutCible === "clos" ? "Résumé de résolution (obligatoire)" : "Motif d'attente (obligatoire)"} value={motif} onChange={(e) => setMotif(e.target.value)} />
            )}
            <button onClick={() => statutCible && action({ action: "statut", statut: statutCible, motif })} disabled={!statutCible} className={btnCopper}>Appliquer</button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select className={`${inputCls} max-w-[180px]`} value={reassignId} onChange={(e) => setReassignId(e.target.value)}>
              <option value="">Réattribuer à…</option>
              {gestionnaires.map((u) => <option key={u.id} value={u.id}>{u.prenom} {u.nom}</option>)}
            </select>
            <input className={`${inputCls} flex-1`} placeholder="Motif de réattribution (obligatoire)" value={reassignMotif} onChange={(e) => setReassignMotif(e.target.value)} />
            <button onClick={() => reassignId && action({ action: "reassigner", assigneA: reassignId, motif: reassignMotif })} disabled={!reassignId} className={btnNavy}>Réattribuer</button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input className={`${inputCls} flex-1`} placeholder="Commentaire interne (non visible du client)" value={comment} onChange={(e) => setComment(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && comment.trim()) { action({ action: "commentaire", texte: comment }); setComment(""); } }} />
            <button onClick={() => { if (comment.trim()) { action({ action: "commentaire", texte: comment }); setComment(""); } }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Ajouter</button>
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
        </div>
      )}

      {/* Rédaction IA de l'email */}
      {canTraiter && (
        <div className="rounded-2xl border border-copper/40 bg-copper-soft/20 p-5">
          <div className="text-sm font-bold text-navy">✍️ Proposer une réponse par email (IA)</div>
          <p className="mt-1 text-xs text-slate-500">Saisissez les informations à communiquer (date d&apos;intervention, prestataire, montant, décision…). L&apos;IA rédige un brouillon d&apos;email — à relire et compléter avant envoi. Aucune coordonnée du demandeur n&apos;est envoyée à l&apos;IA.</p>
          <textarea rows={3} className={`${inputCls} mt-3`} placeholder="Ex. Intervention plombier prévue le 14/10, société Martin, prise en charge par la copropriété." value={faits} onChange={(e) => setFaits(e.target.value)} />
          <button onClick={rediger} disabled={iaBusy} className={`${btnCopper} mt-3`}>{iaBusy ? "Rédaction en cours…" : "Rédiger le brouillon"}</button>
          {brouillon && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-copper">Brouillon — à relire avant envoi</div>
              <input className={`${inputCls} mb-2 font-semibold`} value={brouillon.objet} onChange={(e) => setBrouillon({ ...brouillon, objet: e.target.value })} />
              <textarea rows={10} className={inputCls} value={brouillon.corps} onChange={(e) => setBrouillon({ ...brouillon, corps: e.target.value })} />
              <button onClick={copier} className={`${btnNavy} mt-2`}>{copie ? "✓ Copié" : "📋 Copier"}</button>
            </div>
          )}
        </div>
      )}

      {/* Historique */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-3 text-sm font-bold text-navy">Historique</div>
        <ul className="space-y-2">
          {d.evenements.map((e) => (
            <li key={e.id} className="flex gap-2 text-sm">
              <span className="mt-0.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-500">{e.type.replace(/_/g, " ")}</span>
              <div><div className="text-slate-700">{e.contenu}</div><div className="text-xs text-slate-400">{dateHeure(e.creeLe)}{e.auteurNom ? ` · ${e.auteurNom}` : ""}</div></div>
            </li>
          ))}
          {d.evenements.length === 0 && <li className="text-sm text-slate-400">Aucun événement.</li>}
        </ul>
      </div>
    </div>
  );
}

// -------------------------------------------------- Coller un mail → ticket
function ColleMail({ onCree }: { onCree: (id: string) => void }) {
  const [f, setF] = useState({ from: "", fromName: "", subject: "", body: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<api.ResultatIngestion | null>(null);
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const analyser = async () => {
    setErr(null); setRes(null); setBusy(true);
    try { const r = await api.ingestEmailApi(f); setRes(r.resultat); }
    catch (e) { setErr(e instanceof Error ? e.message : "Analyse impossible"); }
    finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="rounded-2xl border border-copper/40 bg-copper-soft/20 p-5">
        <div className="text-sm font-bold text-navy">📧 Créer une demande depuis un mail</div>
        <p className="mt-1 text-xs text-slate-500">Collez un mail reçu : l&apos;IA détermine s&apos;il s&apos;agit d&apos;une demande et crée le ticket (directement si clair, « à valider » si ambigu). Minimisation : seuls le sujet et le corps sont analysés par l&apos;IA. <b>Bientôt automatique</b> une fois la connexion Outlook autorisée.</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input className={inputCls} placeholder="Email de l'expéditeur" value={f.from} onChange={(e) => set("from", e.target.value)} />
          <input className={inputCls} placeholder="Nom de l'expéditeur (facultatif)" value={f.fromName} onChange={(e) => set("fromName", e.target.value)} />
        </div>
        <input className={inputCls} placeholder="Sujet du mail" value={f.subject} onChange={(e) => set("subject", e.target.value)} />
        <textarea rows={8} className={inputCls} placeholder="Corps du mail (copier-coller)" value={f.body} onChange={(e) => set("body", e.target.value)} />
        <div className="flex items-center gap-3">
          <button onClick={analyser} disabled={busy} className={btnCopper}>{busy ? "Analyse IA…" : "Analyser et créer la demande"}</button>
          {err && <span className="text-sm text-red-600">{err}</span>}
        </div>
        {res && (
          <div className={`rounded-xl p-4 text-sm ${res.statut === "ignore" ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-800"}`}>
            {res.statut === "ignore" && <>Aucun ticket créé — {res.raison}.</>}
            {res.statut === "relance" && <>Cet expéditeur avait déjà une demande ouverte : ajoutée comme <b>relance</b> ({res.numero}).</>}
            {(res.statut === "cree" || res.statut === "a_valider") && (
              <div className="flex flex-wrap items-center gap-3">
                <span>Demande <b>{res.numero}</b> créée{res.aValider ? " (à valider)" : " et attribuée"}.</span>
                {res.ticketId && <button onClick={() => onCree(res.ticketId!)} className={btnNavy}>Ouvrir la demande</button>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
