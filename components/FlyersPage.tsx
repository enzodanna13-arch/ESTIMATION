"use client";

import { useMemo, useState } from "react";
import { EQUIPE, NEGOCIATEURS } from "@/lib/equipe";
import { genererFlyersPdf } from "@/lib/genererFlyersPdf";

const inputCls = "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/20";

// Coordonnées de l'agence (affichées sur chaque flyer).
const AGENCE = {
  nom: "CENTURY 21",
  enseigne: "Icaza Immobilier",
  adresse: "Martigues (13500)",
};

interface Destinataire { civilite: string; prenom: string; nom: string; adresse: string }

const MODELES = [
  { id: "estimation", label: "Estimation offerte" },
  { id: "acquereur", label: "Acquéreur en attente" },
  { id: "vendu", label: "Vendu dans le quartier" },
  { id: "valeur", label: "Valeur du bien" },
] as const;
type ModeleId = (typeof MODELES)[number]["id"];

// ---------------------------------------------------------------------------
// Un flyer (A5 paysage : 210 × 148,5 mm)

function Logo({ clair = false }: { clair?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-[6px] text-lg font-black" style={{ background: "#b8935a", color: "#0f1e3d" }}>21</div>
      <div className="leading-tight">
        <div className="text-[15px] font-semibold tracking-[0.18em]" style={{ color: clair ? "#f7f3ec" : "#0f1e3d" }}>CENTURY 21</div>
        <div className="text-[9px] uppercase tracking-[0.2em]" style={{ color: "#b8935a" }}>Icaza Immobilier · Martigues</div>
      </div>
    </div>
  );
}

function Contact({ nego, tel, clair = false }: { nego: string; tel: string; clair?: boolean }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <div className="text-[11px] uppercase tracking-[0.15em]" style={{ color: "#b8935a" }}>Votre conseiller</div>
        <div className="text-[15px] font-bold" style={{ color: clair ? "#f7f3ec" : "#0f1e3d" }}>{nego || "Votre agence CENTURY 21"}</div>
      </div>
      {tel && <div className="text-right text-[17px] font-black" style={{ color: clair ? "#f7f3ec" : "#0f1e3d" }}>📞 {tel}</div>}
    </div>
  );
}

function BandeauDestinataire({ d, clair = false }: { d?: Destinataire; clair?: boolean }) {
  if (!d || (!d.nom && !d.adresse)) return null;
  const ligne = [[d.civilite, d.prenom, d.nom].filter(Boolean).join(" "), d.adresse].filter(Boolean).join(" — ");
  return (
    <div className="mb-2 inline-block rounded-md px-2.5 py-1 text-[11px] font-semibold" style={{ background: clair ? "rgba(255,255,255,.12)" : "#f2ece1", color: clair ? "#f7f3ec" : "#0f1e3d" }}>
      Pour {ligne}
    </div>
  );
}

function Flyer({ modele, nego, tel, dest }: { modele: ModeleId; nego: string; tel: string; dest?: Destinataire }) {
  const base = "relative overflow-hidden";
  const style: React.CSSProperties = { width: "210mm", height: "148.5mm", boxSizing: "border-box", padding: "12mm 14mm" };

  if (modele === "estimation") {
    return (
      <div className={base} style={{ ...style, background: "#0f1e3d", color: "#f7f3ec" }}>
        <div className="flex items-start justify-between">
          <Logo clair />
          <div className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest" style={{ background: "#b8935a", color: "#0f1e3d" }}>Offert</div>
        </div>
        <div className="mt-6">
          <BandeauDestinataire d={dest} clair />
          <h1 className="font-serif text-[40px] font-black leading-[1.05]">Vendez au<br />meilleur prix.</h1>
          <p className="mt-3 max-w-[130mm] text-[14px]" style={{ color: "#d9c7ad" }}>
            Profitez d&apos;une <b style={{ color: "#f7f3ec" }}>estimation offerte et sans engagement</b> de votre bien, réalisée par un expert de votre secteur.
          </p>
        </div>
        <div className="absolute inset-x-[14mm] bottom-[10mm]"><Contact nego={nego} tel={tel} clair /></div>
      </div>
    );
  }

  if (modele === "acquereur") {
    return (
      <div className={base} style={{ ...style, background: "#f7f3ec", color: "#0f1e3d" }}>
        <div className="flex items-start justify-between"><Logo /><div className="text-5xl">📍</div></div>
        <div className="mt-5">
          <BandeauDestinataire d={dest} />
          <h1 className="font-serif text-[34px] font-black leading-[1.08]">Un acquéreur recherche<br />un bien dans <span style={{ color: "#b8935a" }}>votre quartier</span>.</h1>
          <p className="mt-3 max-w-[135mm] text-[14px] text-slate-700">
            Nous accompagnons des acheteurs sérieux à la recherche d&apos;un bien près de chez vous. <b>Vous envisagez de vendre ?</b> Parlons-en, sans engagement.
          </p>
        </div>
        <div className="absolute inset-x-[14mm] bottom-[10mm]"><Contact nego={nego} tel={tel} /></div>
      </div>
    );
  }

  if (modele === "vendu") {
    return (
      <div className={base} style={{ ...style, background: "#ffffff", color: "#0f1e3d" }}>
        <div className="flex items-start justify-between">
          <Logo />
          <div className="rounded-md px-3 py-1.5 text-[13px] font-black uppercase tracking-widest" style={{ background: "#0f1e3d", color: "#f7f3ec" }}>Vendu</div>
        </div>
        <div className="mt-6">
          <BandeauDestinataire d={dest} />
          <h1 className="font-serif text-[36px] font-black leading-[1.06]">Encore un bien vendu<br />près de chez vous.</h1>
          <p className="mt-3 max-w-[135mm] text-[14px] text-slate-700">
            Le marché est actif dans votre secteur. <b>Votre bien vaut peut-être plus que vous ne le pensez</b> — demandez votre estimation gratuite.
          </p>
        </div>
        <div className="absolute left-0 top-0 h-full w-[8mm]" style={{ background: "#b8935a" }} />
        <div className="absolute inset-x-[14mm] bottom-[10mm]"><Contact nego={nego} tel={tel} /></div>
      </div>
    );
  }

  // valeur
  return (
    <div className={base} style={{ ...style, background: "#f7f3ec", color: "#0f1e3d" }}>
      <div className="flex items-start justify-between"><Logo /></div>
      <div className="mt-5">
        <BandeauDestinataire d={dest} />
        <div className="mb-2 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest" style={{ background: "#b8935a", color: "#0f1e3d" }}>Estimation gratuite</div>
        <h1 className="font-serif text-[33px] font-black leading-[1.08]">Connaissez-vous la valeur<br />de votre bien aujourd&apos;hui ?</h1>
        <p className="mt-3 max-w-[135mm] text-[14px] text-slate-700">
          Les prix ont bougé. Obtenez une <b>estimation fiable et gratuite</b> de votre appartement ou maison, fondée sur les ventes réelles de votre quartier.
        </p>
      </div>
      <div className="absolute inset-x-[14mm] bottom-[10mm]"><Contact nego={nego} tel={tel} /></div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Analyse tolérante d'un CSV / texte collé → destinataires

function parseDestinataires(texte: string): Destinataire[] {
  const lignes = texte.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lignes.length === 0) return [];
  const sep = [";", "\t", ","].map((c) => ({ c, n: (lignes[0].match(new RegExp(`\\${c}`, "g")) || []).length })).sort((a, b) => b.n - a.n)[0].c;
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  const cells = (l: string) => l.split(sep).map((c) => c.replace(/^"|"$/g, "").trim());
  // Détection d'un en-tête
  const tete = cells(lignes[0]).map(norm);
  const idx = { civilite: -1, prenom: -1, nom: -1, adresse: -1 };
  let aEntete = false;
  tete.forEach((h, i) => {
    if (/(civilite|titre|mr|mme)/.test(h)) { idx.civilite = i; aEntete = true; }
    else if (/(prenom)/.test(h)) { idx.prenom = i; aEntete = true; }
    else if (/(nom|client|destinataire)/.test(h)) { if (idx.nom < 0) idx.nom = i; aEntete = true; }
    else if (/(adresse|rue|voie|boite|bal)/.test(h)) { idx.adresse = i; aEntete = true; }
  });
  const corps = aEntete ? lignes.slice(1) : lignes;
  return corps.map((l) => {
    const c = cells(l);
    if (aEntete) {
      return {
        civilite: idx.civilite >= 0 ? c[idx.civilite] ?? "" : "",
        prenom: idx.prenom >= 0 ? c[idx.prenom] ?? "" : "",
        nom: idx.nom >= 0 ? c[idx.nom] ?? "" : "",
        adresse: idx.adresse >= 0 ? c[idx.adresse] ?? "" : "",
      };
    }
    // Sans en-tête : colonne 0 = nom, colonne 1 = adresse
    return { civilite: "", prenom: "", nom: c[0] ?? "", adresse: c.slice(1).join(" ") };
  }).filter((d) => d.nom || d.adresse);
}

// ---------------------------------------------------------------------------

export default function FlyersPage({ onRetour }: { onRetour: () => void }) {
  const [modele, setModele] = useState<ModeleId>("estimation");
  const [nego, setNego] = useState(NEGOCIATEURS[0] ?? "");
  const [tel, setTel] = useState<string>(EQUIPE.find((m) => m.nom === NEGOCIATEURS[0])?.tel ?? "04 42 00 00 00");
  const [perso, setPerso] = useState(false);
  const [csvTexte, setCsvTexte] = useState("");
  const [nbGenerique, setNbGenerique] = useState(2);
  const [pdf, setPdf] = useState(false);
  const [prog, setProg] = useState<{ f: number; t: number } | null>(null);

  const choisirNego = (nom: string) => {
    setNego(nom);
    const m = EQUIPE.find((e) => e.nom === nom);
    if (m?.tel) setTel(m.tel.replace("+33", "0").replace(/(\d)(\d{2})(\d{2})(\d{2})(\d{2})/, "$1$2 $3 $4 $5"));
  };

  const destinataires = useMemo(() => (perso ? parseDestinataires(csvTexte) : []), [perso, csvTexte]);

  // Un flyer par destinataire (personnalisé) ; sinon N flyers génériques.
  const flyers: (Destinataire | undefined)[] = useMemo(() => {
    if (perso) return destinataires.length ? destinataires : [];
    return Array.from({ length: Math.max(2, nbGenerique) }, () => undefined);
  }, [perso, destinataires, nbGenerique]);

  // Regroupe par 2 → feuilles A4
  const feuilles = useMemo(() => {
    const out: (Destinataire | undefined)[][] = [];
    for (let i = 0; i < flyers.length; i += 2) out.push(flyers.slice(i, i + 2));
    return out;
  }, [flyers]);

  const telecharger = async () => {
    setPdf(true); setProg({ f: 0, t: feuilles.length });
    try {
      await genererFlyersPdf(`flyers-${modele}.pdf`, (f, t) => setProg({ f, t }));
    } catch { /* silencieux */ } finally { setPdf(false); setProg(null); }
  };

  const SCALE = 0.62;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">🖨️ Flyers de prospection</h2>
          <p className="text-sm text-slate-500">Choisissez un visuel, 2 flyers par A4. Personnalisez avec les noms relevés (CSV) pour un flyer nominatif par boîte aux lettres.</p>
        </div>
        <button onClick={onRetour} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">← Retour</button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Réglages */}
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="mb-2 text-sm font-bold text-navy">1. Visuel</h3>
            <div className="grid grid-cols-2 gap-2">
              {MODELES.map((m) => (
                <button key={m.id} onClick={() => setModele(m.id)} className={`rounded-lg border-2 p-2 text-left text-xs font-semibold transition ${modele === m.id ? "border-copper bg-copper/5 text-copper" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="mb-2 text-sm font-bold text-navy">2. Conseiller</h3>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Négociateur</label>
            <select className={inputCls} value={nego} onChange={(e) => choisirNego(e.target.value)}>
              {NEGOCIATEURS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <label className="mb-1 mt-2 block text-xs font-semibold text-slate-600">Téléphone affiché</label>
            <input className={inputCls} value={tel} onChange={(e) => setTel(e.target.value)} placeholder="06 12 34 56 78" />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="mb-2 text-sm font-bold text-navy">3. Destinataires</h3>
            <div className="mb-3 flex rounded-lg border border-slate-200 p-0.5 text-xs font-semibold">
              <button onClick={() => setPerso(false)} className={`flex-1 rounded-md px-2 py-1 ${!perso ? "bg-navy text-white" : "text-slate-600"}`}>Générique</button>
              <button onClick={() => setPerso(true)} className={`flex-1 rounded-md px-2 py-1 ${perso ? "bg-navy text-white" : "text-slate-600"}`}>Personnalisé (CSV)</button>
            </div>
            {!perso ? (
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Nombre de flyers</label>
                <input type="number" min={2} step={2} className={inputCls} value={nbGenerique} onChange={(e) => setNbGenerique(Math.max(2, Number(e.target.value) || 2))} />
                <p className="mt-1 text-xs text-slate-400">2 flyers par feuille A4.</p>
              </div>
            ) : (
              <div>
                <p className="mb-1 text-xs text-slate-500">Collez ou importez votre liste. Colonnes reconnues : <b>civilité, prénom, nom, adresse</b> (ou simplement <b>nom ; adresse</b>).</p>
                <textarea className={`${inputCls} min-h-[110px] font-mono text-[11px]`} placeholder={"nom;adresse\nM. et Mme DUPONT;12 rue des Écoles\nMme MARTIN;5 av. de la Mer"} value={csvTexte} onChange={(e) => setCsvTexte(e.target.value)} />
                <div className="mt-2 flex items-center gap-2">
                  <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                    📄 Importer un CSV
                    <input type="file" accept=".csv,.txt,text/csv" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setCsvTexte(await f.text()); e.target.value = ""; }} />
                  </label>
                  <span className="text-xs text-slate-500">{destinataires.length} destinataire{destinataires.length > 1 ? "s" : ""}</span>
                </div>
              </div>
            )}
          </div>

          <button onClick={telecharger} disabled={pdf || flyers.length === 0} className="w-full rounded-xl bg-copper px-5 py-3 text-sm font-bold text-white transition hover:bg-copper/90 disabled:opacity-50">
            {pdf ? (prog ? `Génération… ${prog.f}/${prog.t}` : "Génération…") : `📥 Télécharger le PDF (${feuilles.length} page${feuilles.length > 1 ? "s" : ""})`}
          </button>
          <p className="text-center text-xs text-slate-400">{flyers.length} flyer{flyers.length > 1 ? "s" : ""} · 2 par A4</p>
        </div>

        {/* Aperçu */}
        <div className="lg:col-span-2">
          <div className="mb-2 text-sm font-semibold text-slate-500">Aperçu</div>
          {flyers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-400">
              Ajoutez des destinataires (ou passez en « Générique ») pour voir l&apos;aperçu.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-3" style={{ height: `${feuilles.length * 297 * SCALE + 8 * feuilles.length}mm` }}>
              <div className="flyers-doc" style={{ transform: `scale(${SCALE})`, transformOrigin: "top left", width: "210mm" }}>
                {feuilles.map((paire, i) => (
                  <div key={i} className="flyer-sheet" style={{ width: "210mm", height: "297mm", boxSizing: "border-box", background: "#fff", marginBottom: "8mm" }}>
                    {paire.map((d, j) => (
                      <div key={j} style={{ height: "148.5mm", borderBottom: j === 0 ? "1px dashed #cbd5e1" : "none" }}>
                        <Flyer modele={modele} nego={nego} tel={tel} dest={d} />
                      </div>
                    ))}
                    {paire.length === 1 && <div style={{ height: "148.5mm" }} />}
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="mt-2 text-xs text-slate-400">La ligne pointillée au milieu de la feuille est un repère de découpe entre les 2 flyers.</p>
        </div>
      </div>
    </div>
  );
}
