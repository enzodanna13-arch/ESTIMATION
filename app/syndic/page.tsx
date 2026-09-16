"use client";

import { useEffect, useMemo, useState } from "react";
import { ROLES_LABELS, type SyndicRole, type SyndicUserPublic } from "@/lib/syndic/types";
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
  const [onglet, setOnglet] = useState<"residences" | "utilisateurs" | "import">("residences");

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
        {user.role === "admin" ? (
          <>
            <div className="mb-5 inline-flex rounded-lg border border-slate-200 bg-white p-1 text-sm font-semibold">
              {([["residences", "🏢 Résidences"], ["utilisateurs", "👥 Utilisateurs"], ["import", "⬆️ Import CSV"]] as const).map(([k, lbl]) => (
                <button key={k} onClick={() => setOnglet(k)} className={`rounded-md px-4 py-1.5 transition ${onglet === k ? "bg-copper text-white" : "text-slate-600 hover:bg-slate-100"}`}>{lbl}</button>
              ))}
            </div>
            {onglet === "residences" && <AdminResidences />}
            {onglet === "utilisateurs" && <AdminUsers moiId={user.id} />}
            {onglet === "import" && <AdminImport />}
          </>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <div className="text-4xl">🚧</div>
            <h2 className="mt-3 text-xl font-bold text-navy">Bonjour {user.prenom || user.nom}</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
              Votre rôle : <b>{ROLES_LABELS[user.role]}</b>. La saisie et le suivi des demandes
              arrivent au prochain lot. Pour l&apos;instant, seule l&apos;administration
              (résidences, utilisateurs, import) est disponible pour le responsable d&apos;agence.
            </p>
          </div>
        )}
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
