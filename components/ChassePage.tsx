"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  STATUTS_CHASSE, STATUT_CHASSE_COULEURS,
  extraireAnnonce, listChasse, saveChasse, deleteChasse,
  uploadPhotosChasse, fichierEnBase64,
  type FicheChasse,
} from "@/lib/chasse";
import { NEGOCIATEURS } from "@/lib/equipe";

const inputCls = "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/20";
const int = new Intl.NumberFormat("fr-FR");
const euro = (n: number) => (n > 0 ? `${int.format(n)} €` : "—");
const dateFr = (t: number) => new Date(t).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" });

function StatutChip({ s }: { s: string }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUT_CHASSE_COULEURS[s] ?? "bg-slate-100 text-slate-600"}`}>{s}</span>;
}

export default function ChassePage({ onRetour }: { onRetour: () => void }) {
  const [fiches, setFiches] = useState<FicheChasse[]>([]);
  const [chargement, setChargement] = useState(true);
  const [q, setQ] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");
  const [filtreNego, setFiltreNego] = useState("");
  const [tri, setTri] = useState<"recent" | "prix-asc" | "prix-desc" | "ecart">("recent");
  const [selection, setSelection] = useState<FicheChasse | null>(null);

  // Nouvelle chasse
  const [texte, setTexte] = useState("");
  const [nego, setNego] = useState(NEGOCIATEURS[0] ?? "");
  const [analyse, setAnalyse] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const bookRef = useRef<HTMLAnchorElement>(null);

  const recharger = () => {
    setChargement(true);
    listChasse().then((f) => { setFiches(f); setChargement(false); }).catch(() => setChargement(false));
  };
  useEffect(recharger, []);

  // Import automatique déclenché par le bouton « Piger » (bookmarklet) : les
  // données de l'annonce ont été déposées dans sessionStorage par la page.
  useEffect(() => {
    let raw: string | null = null;
    try { raw = sessionStorage.getItem("chasse_import"); } catch { /* ignore */ }
    if (!raw) return;
    try { sessionStorage.removeItem("chasse_import"); } catch { /* ignore */ }
    let payload: { url?: string; titre?: string; texte?: string; photos?: string[] };
    try { payload = JSON.parse(decodeURIComponent(escape(atob(raw)))); } catch { return; }
    setImporting(true); setErr(null); setMsg(null);
    (async () => {
      try {
        const r = await extraireAnnonce({ url: payload.url ?? "", texte: payload.texte ?? "" });
        const photos = Array.from(new Set([...(r.fiche.photos ?? []), ...(payload.photos ?? [])])).slice(0, 30);
        const fiche = await saveChasse({ ...r.fiche, url: payload.url ?? "", titre: r.fiche.titre || payload.titre || "", photos, negociateur: nego, statut: "À contacter" });
        setFiches((prev) => [fiche, ...prev.filter((x) => x.id !== fiche.id)]);
        setSelection(fiche);
        setMsg("Annonce pigée ✔ — vérifiez et complétez la fiche.");
      } catch (e) {
        setErr("Import automatique impossible : " + (e instanceof Error ? e.message : "erreur"));
      } finally {
        setImporting(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const affichees = useMemo(() => {
    const qt = q.trim().toLowerCase();
    const list = fiches.filter((f) =>
      (!filtreStatut || f.statut === filtreStatut) &&
      (!filtreNego || f.negociateur === filtreNego) &&
      (!qt || [f.titre, f.ville, f.codePostal, f.source, f.negociateur, f.description].join(" ").toLowerCase().includes(qt)),
    );
    const ecart = (f: FicheChasse) => (f.prixAffiche > 0 && f.estimationNego > 0 ? f.estimationNego - f.prixAffiche : Number.POSITIVE_INFINITY);
    const arr = [...list];
    if (tri === "prix-asc") arr.sort((a, b) => (a.prixAffiche || Infinity) - (b.prixAffiche || Infinity));
    else if (tri === "prix-desc") arr.sort((a, b) => (b.prixAffiche || 0) - (a.prixAffiche || 0));
    else if (tri === "ecart") arr.sort((a, b) => ecart(a) - ecart(b)); // plus grosse opportunité (sous le prix) d'abord
    else arr.sort((a, b) => b.updatedAt - a.updatedAt);
    return arr;
  }, [fiches, q, filtreStatut, filtreNego, tri]);

  // Statistiques globales du portefeuille de chasse
  const stats = useMemo(() => {
    const prix = fiches.filter((f) => f.prixAffiche > 0).map((f) => f.prixAffiche);
    const prixMoyen = prix.length ? Math.round(prix.reduce((s, p) => s + p, 0) / prix.length) : 0;
    const avecEstim = fiches.filter((f) => f.estimationNego > 0).length;
    const parStatut: Record<string, number> = {};
    for (const f of fiches) parStatut[f.statut] = (parStatut[f.statut] ?? 0) + 1;
    return { total: fiches.length, prixMoyen, avecEstim, parStatut };
  }, [fiches]);

  // Code du bouton « Piger » (bookmarklet) — s'exécute sur l'annonce, dans le
  // navigateur du négociateur (donc passe les blocages type Leboncoin/SeLoger).
  const bookmarklet = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://estimation-ia.vercel.app";
    return `javascript:(function(){try{var d=document,I=[],A=function(u){if(!u)return;try{u=new URL(u,location.href).href}catch(e){return}if(/^https?:/.test(u)&&!/\\.svg($|\\?)/i.test(u)&&!/(sprite|logo|icon|favicon|pixel|placeholder|avatar)/i.test(u)&&(/\\.(jpe?g|png|webp|avif)($|\\?)/i.test(u)||/(image|photo|media|cdn|static)/i.test(u))&&I.indexOf(u)<0)I.push(u)};var M=d.querySelectorAll('meta[property=\"og:image\"],meta[name=\"twitter:image\"]');for(var i=0;i<M.length;i++)A(M[i].content);var G=d.images;for(var j=0;j<G.length;j++){A(G[j].currentSrc||G[j].src);A(G[j].getAttribute('data-src'))}I=I.slice(0,20);var T=(d.body.innerText||'').replace(/\\s+/g,' ').trim().slice(0,7000);var P={url:location.href,titre:d.title||'',texte:T,photos:I};var B=btoa(unescape(encodeURIComponent(JSON.stringify(P))));window.open('${origin}/#chasse='+encodeURIComponent(B),'_blank')}catch(e){alert('Piger: '+e)}})();`;
  }, []);

  // On pose l'URL javascript: directement sur l'ancre (React neutralise les
  // href « javascript: ») pour que le glisser-vers-favoris capture le vrai code.
  useEffect(() => {
    if (bookRef.current) bookRef.current.setAttribute("href", bookmarklet);
  }, [bookmarklet, showBook]);

  // Analyse d'un texte d'annonce collé (l'IA remplit la fiche).
  const analyserTexte = async () => {
    setErr(null); setMsg(null);
    const txt = texte.trim();
    if (txt.length < 30) { setErr("Collez le texte de l'annonce (au moins quelques lignes)."); return; }
    setAnalyse(true);
    try {
      const r = await extraireAnnonce({ texte: txt });
      const fiche = await saveChasse({ ...r.fiche, negociateur: nego, statut: "À contacter" });
      setFiches((prev) => [fiche, ...prev.filter((x) => x.id !== fiche.id)]);
      setTexte("");
      setMsg("Fiche créée depuis le texte ✔ — vérifiez, complétez et ajoutez les photos.");
      setSelection(fiche);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Analyse impossible");
    } finally {
      setAnalyse(false);
    }
  };

  // Création manuelle : le négociateur remplit lui-même la fiche.
  const creerManuelle = async () => {
    setErr(null); setMsg(null);
    setAnalyse(true);
    try {
      const fiche = await saveChasse({ negociateur: nego, statut: "À contacter" });
      setFiches((prev) => [fiche, ...prev.filter((x) => x.id !== fiche.id)]);
      setSelection(fiche);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Création impossible");
    } finally {
      setAnalyse(false);
    }
  };

  if (selection) {
    return (
      <FicheDetail
        fiche={selection}
        onRetour={() => setSelection(null)}
        onEnregistre={(f) => { setFiches((prev) => prev.map((x) => (x.id === f.id ? f : x))); setSelection(f); }}
        onSupprime={(id) => { setFiches((prev) => prev.filter((x) => x.id !== id)); setSelection(null); }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">🏹 Chasse immobilière</h2>
          <p className="text-sm text-slate-500">Repérez un bien en ligne, l&apos;IA récupère la fiche, vous ajoutez votre estimation et votre suivi.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowBook((v) => !v)} className="rounded-lg border border-copper/40 bg-copper/10 px-3 py-1.5 text-sm font-semibold text-copper hover:bg-copper/20">⚡ Bouton Piger</button>
          <button onClick={onRetour} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">← Retour</button>
        </div>
      </div>

      {/* Installer le bouton Piger (bookmarklet) */}
      {showBook && (
        <div className="mb-6 rounded-2xl border border-navy/20 bg-navy/5 p-5 text-sm">
          <h3 className="mb-2 text-base font-bold text-navy">⚡ Le bouton « Piger » — importer une annonce en 1 clic (gratuit, marche partout)</h3>
          <p className="mb-3 text-slate-600">
            Idéal pour <b>Leboncoin et SeLoger</b> : comme le bouton s&apos;exécute dans <b>votre</b> navigateur, il n&apos;est jamais bloqué. Installation en une fois :
          </p>
          <ol className="mb-3 list-decimal space-y-1 pl-5 text-slate-600">
            <li>Affichez la barre des favoris (<b>Cmd/Ctrl + Maj + B</b>).</li>
            <li><b>Glissez le bouton bleu ci-dessous</b> dans votre barre des favoris.</li>
            <li>Sur n&apos;importe quelle annonce, cliquez ce favori : la fiche se crée ici avec les photos.</li>
          </ol>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages, jsx-a11y/anchor-is-valid */}
          <a ref={bookRef} href="#" onClick={(e) => e.preventDefault()} draggable className="inline-block cursor-move rounded-lg bg-navy px-4 py-2 font-bold text-white shadow hover:bg-navy-deep" title="Glissez-moi dans votre barre de favoris">🏹 Piger → Icaza</a>
          <p className="mt-2 text-xs text-slate-400">Astuce : ne cliquez pas le bouton ici — <b>glissez-le</b> vers vos favoris. Ensuite servez-vous-en sur les annonces.</p>
          <details className="mt-3 text-xs text-slate-500">
            <summary className="cursor-pointer font-semibold">Le glisser ne marche pas ? Créer le favori à la main</summary>
            <p className="mt-2">Créez un nouveau favori, nommez-le « Piger → Icaza », et collez ce code dans le champ adresse&nbsp;:</p>
            <textarea readOnly onFocus={(e) => e.currentTarget.select()} className={`${inputCls} mt-1 min-h-[70px] font-mono text-[10px]`} value={bookmarklet} />
          </details>
        </div>
      )}

      {importing && (
        <div className="mb-4 rounded-xl border border-copper/30 bg-copper/5 p-3 text-sm font-semibold text-copper">⏳ Import de l&apos;annonce pigée en cours…</div>
      )}

      {/* Nouvelle chasse */}
      <div className="mb-6 rounded-2xl border border-copper/30 bg-copper/5 p-5">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-copper">Nouvelle chasse</h3>
          <div className="flex items-end gap-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Négociateur</label>
              <select className={`${inputCls} w-48`} value={nego} onChange={(e) => setNego(e.target.value)}>
                {NEGOCIATEURS.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <button onClick={creerManuelle} disabled={analyse} className="rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-deep disabled:opacity-50">
              ➕ Créer une fiche
            </button>
          </div>
        </div>

        <p className="mb-2 text-xs text-slate-500">
          Créez une fiche vide et remplissez-la vous-même, <b>ou</b> collez le texte d&apos;une annonce ci-dessous et l&apos;IA la remplit (marche partout, même Leboncoin/SeLoger). Les photos s&apos;ajoutent dans la fiche avec « 📷 Importer des photos », ou en 1 clic avec le bouton <b>Piger</b>.
        </p>
        <textarea className={`${inputCls} min-h-[110px]`} placeholder="Facultatif — collez ici le texte d'une annonce (titre, prix, surface, pièces, description…) pour que l'IA remplisse la fiche" value={texte} onChange={(e) => setTexte(e.target.value)} />
        <div className="mt-2 flex justify-end">
          <button onClick={analyserTexte} disabled={analyse || texte.trim().length < 30} className="rounded-xl bg-copper px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-copper/90 disabled:opacity-40">
            {analyse ? "…" : "Créer depuis le texte collé"}
          </button>
        </div>
        {msg && <p className="mt-3 rounded-lg bg-emerald-50 p-2.5 text-sm text-emerald-700">{msg}</p>}
        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
      </div>

      {/* Statistiques du portefeuille */}
      {fiches.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
            <div className="text-2xl font-bold text-navy">{stats.total}</div>
            <div className="text-xs text-slate-500">bien{stats.total > 1 ? "s" : ""} en chasse</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
            <div className="text-2xl font-bold text-navy">{euro(stats.prixMoyen)}</div>
            <div className="text-xs text-slate-500">prix moyen affiché</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
            <div className="text-2xl font-bold text-copper">{stats.avecEstim}</div>
            <div className="text-xs text-slate-500">avec mon estimation</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
            <div className="text-2xl font-bold text-emerald-600">{stats.parStatut["Mandat en cours"] ?? 0}</div>
            <div className="text-xs text-slate-500">mandat en cours</div>
          </div>
        </div>
      )}

      {/* Filtres par statut (puces cliquables avec compteur) */}
      {fiches.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          <button onClick={() => setFiltreStatut("")} className={`rounded-full px-3 py-1 text-xs font-semibold ${!filtreStatut ? "bg-navy text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>Tous ({stats.total})</button>
          {STATUTS_CHASSE.filter((s) => (stats.parStatut[s] ?? 0) > 0).map((s) => (
            <button key={s} onClick={() => setFiltreStatut(filtreStatut === s ? "" : s)} className={`rounded-full px-3 py-1 text-xs font-semibold ${filtreStatut === s ? (STATUT_CHASSE_COULEURS[s] ?? "bg-navy text-white") + " ring-2 ring-offset-1 ring-copper" : STATUT_CHASSE_COULEURS[s] ?? "bg-slate-100 text-slate-600"}`}>
              {s} ({stats.parStatut[s]})
            </button>
          ))}
        </div>
      )}

      {/* Recherche + tri + négociateur */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input className={`${inputCls} max-w-xs`} placeholder="Rechercher (ville, titre…)" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={`${inputCls} max-w-[11rem]`} value={filtreNego} onChange={(e) => setFiltreNego(e.target.value)}>
          <option value="">Tous les négociateurs</option>
          {NEGOCIATEURS.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <select className={`${inputCls} max-w-[12rem]`} value={tri} onChange={(e) => setTri(e.target.value as typeof tri)}>
          <option value="recent">Plus récents</option>
          <option value="ecart">Meilleure opportunité (sous mon estim.)</option>
          <option value="prix-asc">Prix croissant</option>
          <option value="prix-desc">Prix décroissant</option>
        </select>
        <span className="ml-auto text-sm text-slate-500">{affichees.length} affiché{affichees.length > 1 ? "s" : ""}</span>
      </div>

      {/* Liste */}
      {chargement ? (
        <p className="py-16 text-center text-slate-400">Chargement…</p>
      ) : affichees.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-400">
          Aucun bien en chasse pour l&apos;instant. Cliquez « ➕ Créer une fiche », collez le texte d&apos;une annonce, ou utilisez le bouton « Piger » pour démarrer.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {affichees.map((f) => (
            <button key={f.id} onClick={() => setSelection(f)} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:shadow-md">
              <div className="relative h-40 w-full bg-slate-100">
                {f.photos[0]
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={f.photos[0]} alt="" className="h-full w-full object-cover transition group-hover:scale-[1.02]" loading="lazy" referrerPolicy="no-referrer" />
                  : <div className="flex h-full items-center justify-center text-3xl text-slate-300">🏠</div>}
                <div className="absolute left-2 top-2"><StatutChip s={f.statut} /></div>
                {f.photos.length > 1 && <div className="absolute bottom-2 right-2 rounded-md bg-black/60 px-1.5 py-0.5 text-xs text-white">📷 {f.photos.length}</div>}
              </div>
              <div className="p-3">
                <div className="truncate text-sm font-bold text-navy">{f.titre || f.typeBien || "Bien sans titre"}</div>
                <div className="truncate text-xs text-slate-500">
                  {[f.ville, f.codePostal].filter(Boolean).join(" · ") || f.source}
                  {f.surface > 0 ? ` · ${int.format(f.surface)} m²` : ""}{f.pieces > 0 ? ` · ${f.pieces} p.` : ""}
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-slate-600">Annonce&nbsp;: <b>{euro(f.prixAffiche)}</b></span>
                  <span className="text-copper">Estim.&nbsp;: <b>{euro(f.estimationNego)}</b></span>
                </div>
                {f.prixAffiche > 0 && f.estimationNego > 0 && (
                  <div className={`mt-1 text-xs font-semibold ${f.estimationNego < f.prixAffiche ? "text-red-600" : "text-emerald-600"}`}>
                    {f.estimationNego < f.prixAffiche ? "▼" : "▲"} {int.format(Math.abs(f.estimationNego - f.prixAffiche))} € {f.estimationNego < f.prixAffiche ? "sous" : "au-dessus"} du prix affiché
                  </div>
                )}
                <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                  <span>{f.negociateur || "—"}</span>
                  <span>{dateFr(f.updatedAt)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function FicheDetail({ fiche, onRetour, onEnregistre, onSupprime }: {
  fiche: FicheChasse;
  onRetour: () => void;
  onEnregistre: (f: FicheChasse) => void;
  onSupprime: (id: string) => void;
}) {
  const [f, setF] = useState<FicheChasse>(fiche);
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  const [nouvellePhoto, setNouvellePhoto] = useState("");
  const [upload, setUpload] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);

  const maj = <K extends keyof FicheChasse>(k: K, v: FicheChasse[K]) => { setF((p) => ({ ...p, [k]: v })); setOk(false); };
  const majNum = (k: keyof FicheChasse, v: string) => maj(k, (Number(v.replace(/[^0-9.]/g, "")) || 0) as never);

  const enregistrer = async () => {
    setBusy(true);
    try {
      const saved = await saveChasse(f);
      setF(saved); setOk(true); onEnregistre(saved);
    } catch { /* silencieux */ } finally { setBusy(false); }
  };
  const supprimer = async () => {
    if (!confirm("Supprimer définitivement cette fiche de chasse ?")) return;
    setBusy(true);
    try { await deleteChasse(f.id); onSupprime(f.id); } finally { setBusy(false); }
  };
  const retirerPhoto = (i: number) => maj("photos", f.photos.filter((_, j) => j !== i));
  const ajouterPhoto = () => {
    const u = nouvellePhoto.trim();
    if (/^https?:\/\//i.test(u)) { maj("photos", [...f.photos, u]); setNouvellePhoto(""); }
  };
  const importerFichiers = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadErr(null); setUpload(true);
    try {
      const images = await Promise.all(
        Array.from(files).slice(0, 20).filter((x) => x.type.startsWith("image/")).map(async (x) => ({ nom: x.name, data: await fichierEnBase64(x) })),
      );
      if (images.length === 0) { setUploadErr("Choisissez des fichiers image (JPEG, PNG, WebP)."); return; }
      const urls = await uploadPhotosChasse(f.id, images);
      const fusion = { ...f, photos: [...f.photos, ...urls], updatedAt: Date.now() };
      const saved = await saveChasse(fusion);
      setF(saved); onEnregistre(saved);
    } catch (e) {
      setUploadErr(e instanceof Error ? e.message : "Import impossible");
    } finally {
      setUpload(false);
    }
  };

  const ecart = f.prixAffiche > 0 && f.estimationNego > 0 ? f.estimationNego - f.prixAffiche : 0;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex items-center justify-between">
        <button onClick={onRetour} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">← Toutes les chasses</button>
        <div className="flex items-center gap-2">
          {ok && <span className="text-sm font-semibold text-emerald-600">Enregistré ✔</span>}
          <button onClick={enregistrer} disabled={busy} className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-50">{busy ? "…" : "Enregistrer"}</button>
          <button onClick={supprimer} disabled={busy} className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Supprimer</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Photos */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {f.photos[0]
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={f.photos[0]} alt="" className="h-72 w-full object-cover" referrerPolicy="no-referrer" />
              : <div className="flex h-72 items-center justify-center text-5xl text-slate-300">🏠</div>}
          </div>
          {f.photos.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {f.photos.map((p, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p} alt="" className="h-full w-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
                  <button onClick={() => retirerPhoto(i)} className="absolute right-0.5 top-0.5 hidden rounded bg-black/60 px-1 text-xs text-white group-hover:block">✕</button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className={`cursor-pointer whitespace-nowrap rounded-lg bg-navy px-3 py-2 text-sm font-semibold text-white hover:bg-navy-deep ${upload ? "opacity-50" : ""}`}>
              {upload ? "Import…" : "📷 Importer des photos"}
              <input type="file" accept="image/*" multiple className="hidden" disabled={upload} onChange={(e) => { void importerFichiers(e.target.files); e.target.value = ""; }} />
            </label>
            <span className="text-xs text-slate-400">ou par URL :</span>
            <input className={`${inputCls} flex-1`} placeholder="https://…" value={nouvellePhoto} onChange={(e) => setNouvellePhoto(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ajouterPhoto()} />
            <button onClick={ajouterPhoto} className="whitespace-nowrap rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">+ Ajouter</button>
          </div>
          {uploadErr && <p className="mt-2 text-sm text-red-600">{uploadErr}</p>}
          <div className="mt-3">
            <label className="mb-1 block text-xs font-semibold text-slate-600">Description</label>
            <textarea className={`${inputCls} min-h-[120px]`} value={f.description} onChange={(e) => maj("description", e.target.value)} />
          </div>
        </div>

        {/* Infos & saisie */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <StatutChip s={f.statut} />
              {f.url && <a href={f.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-copper hover:underline">Voir l&apos;annonce ↗</a>}
            </div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Titre</label>
            <input className={inputCls} value={f.titre} onChange={(e) => maj("titre", e.target.value)} />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div><label className="mb-1 block text-xs font-semibold text-slate-600">Type</label><input className={inputCls} value={f.typeBien} onChange={(e) => maj("typeBien", e.target.value)} /></div>
              <div><label className="mb-1 block text-xs font-semibold text-slate-600">DPE</label><input className={inputCls} value={f.dpe} onChange={(e) => maj("dpe", e.target.value.toUpperCase().slice(0, 1))} /></div>
              <div><label className="mb-1 block text-xs font-semibold text-slate-600">Ville</label><input className={inputCls} value={f.ville} onChange={(e) => maj("ville", e.target.value)} /></div>
              <div><label className="mb-1 block text-xs font-semibold text-slate-600">Code postal</label><input className={inputCls} value={f.codePostal} onChange={(e) => maj("codePostal", e.target.value)} /></div>
              <div><label className="mb-1 block text-xs font-semibold text-slate-600">Surface (m²)</label><input className={inputCls} value={f.surface || ""} onChange={(e) => majNum("surface", e.target.value)} /></div>
              <div><label className="mb-1 block text-xs font-semibold text-slate-600">Pièces</label><input className={inputCls} value={f.pieces || ""} onChange={(e) => majNum("pieces", e.target.value)} /></div>
              <div><label className="mb-1 block text-xs font-semibold text-slate-600">Chambres</label><input className={inputCls} value={f.chambres || ""} onChange={(e) => majNum("chambres", e.target.value)} /></div>
            </div>
          </div>

          <div className="rounded-2xl border border-copper/30 bg-copper/5 p-4">
            <h3 className="mb-2 text-sm font-bold text-copper">Estimation & suivi</h3>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Prix affiché (annonce)</label>
            <input className={inputCls} value={f.prixAffiche || ""} onChange={(e) => majNum("prixAffiche", e.target.value)} />
            <label className="mb-1 mt-2 block text-xs font-semibold text-slate-600">Mon estimation (€)</label>
            <input className={inputCls} value={f.estimationNego || ""} onChange={(e) => majNum("estimationNego", e.target.value)} />
            {ecart !== 0 && (
              <p className={`mt-1 text-xs font-semibold ${ecart < 0 ? "text-red-600" : "text-emerald-600"}`}>
                {ecart < 0 ? "En dessous" : "Au dessus"} du prix affiché de {int.format(Math.abs(ecart))} €
              </p>
            )}
            <label className="mb-1 mt-3 block text-xs font-semibold text-slate-600">Statut</label>
            <select className={inputCls} value={f.statut} onChange={(e) => maj("statut", e.target.value)}>
              {STATUTS_CHASSE.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <label className="mb-1 mt-3 block text-xs font-semibold text-slate-600">Négociateur</label>
            <select className={inputCls} value={f.negociateur} onChange={(e) => maj("negociateur", e.target.value)}>
              {NEGOCIATEURS.map((n) => <option key={n} value={n}>{n}</option>)}
              {f.negociateur && !NEGOCIATEURS.includes(f.negociateur) && <option value={f.negociateur}>{f.negociateur}</option>}
            </select>
            <label className="mb-1 mt-3 block text-xs font-semibold text-slate-600">Contact propriétaire</label>
            <input className={inputCls} placeholder="Nom, téléphone, email…" value={f.contactProprietaire} onChange={(e) => maj("contactProprietaire", e.target.value)} />
            <label className="mb-1 mt-3 block text-xs font-semibold text-slate-600">Notes</label>
            <textarea className={`${inputCls} min-h-[90px]`} value={f.notes} onChange={(e) => maj("notes", e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
