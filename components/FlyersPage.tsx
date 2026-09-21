"use client";

import { useMemo, useState } from "react";
import { EQUIPE, NEGOCIATEURS, photoNegociateur } from "@/lib/equipe";
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
  { id: "chasse-visite", label: "Chasse — Juste une visite", portrait: true },
  { id: "estimation", label: "Avis de recherche" },
  { id: "acquereur", label: "Acquéreurs en attente" },
  { id: "vendu", label: "Quartier très recherché" },
  { id: "valeur", label: "Nous avons l'acheteur" },
] as const;
type ModeleId = (typeof MODELES)[number]["id"];
const estPortrait = (id: ModeleId) => Boolean(MODELES.find((m) => m.id === id && "portrait" in m && m.portrait));

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
  const photo = photoNegociateur(nego);
  return (
    <div className="flex items-end justify-between">
      <div className="flex items-center gap-3">
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" style={{ width: "17mm", height: "17mm", borderRadius: "50%", objectFit: "cover", border: "2px solid #b8935a", flexShrink: 0 }} />
        )}
        <div>
          <div className="text-[11px] uppercase tracking-[0.15em]" style={{ color: "#b8935a" }}>Votre conseiller</div>
          <div className="text-[15px] font-bold" style={{ color: clair ? "#f7f3ec" : "#0f1e3d" }}>{nego || "Votre agence CENTURY 21"}</div>
        </div>
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

  // 0) CHASSE « Juste une visite » — visuel A5 portrait fourni par l'agence,
  // avec la photo + les coordonnées du négociateur en bas à droite.
  if (modele === "chasse-visite") {
    const photo = photoNegociateur(nego);
    const initiales = (nego || "").split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    return (
      <div className="relative overflow-hidden" style={{ width: "148.5mm", height: "210mm" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/flyers/juste-une-visite.webp" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", right: 0, bottom: 0, width: "41.5mm", height: "27mm", background: "#1c1915", borderLeft: "1px solid rgba(184,147,90,.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5mm", padding: "2mm" }}>
          {photo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={photo} alt="" style={{ width: "12.5mm", height: "12.5mm", borderRadius: "50%", objectFit: "cover", border: "1.5px solid #b8935a" }} />
          ) : (
            <div style={{ width: "12.5mm", height: "12.5mm", borderRadius: "50%", border: "1.5px solid #b8935a", background: "#2a2621", display: "flex", alignItems: "center", justifyContent: "center", color: "#e7cfa0", fontWeight: 800, fontSize: "13px" }}>{initiales}</div>
          )}
          <div style={{ textAlign: "center", lineHeight: 1.25, color: "#f7f3ec" }}>
            <div style={{ fontSize: "6.5px", letterSpacing: "1.5px", color: "#b8935a", textTransform: "uppercase" }}>Votre conseiller</div>
            <div style={{ fontSize: "10px", fontWeight: 800, whiteSpace: "nowrap" }}>{nego}</div>
            {tel && <div style={{ fontSize: "9.5px", fontWeight: 700, color: "#e7cfa0" }}>{tel}</div>}
          </div>
        </div>
      </div>
    );
  }

  // 1) AVIS DE RECHERCHE — style « affiche recherchée », navy + or
  if (modele === "estimation") {
    return (
      <div className={base} style={{ ...style, background: "#0f1e3d", color: "#f7f3ec" }}>
        <div className="flex items-start justify-between">
          <Logo clair />
          <div className="rotate-3 rounded-md border-2 px-3 py-1 text-[12px] font-black uppercase tracking-[0.2em]" style={{ borderColor: "#b8935a", color: "#b8935a" }}>Avis de recherche</div>
        </div>
        <div className="mt-5 flex items-start gap-4">
          <div className="text-[52px] leading-none">🔍</div>
          <div>
            <BandeauDestinataire d={dest} clair />
            <h1 className="font-serif text-[34px] font-black leading-[1.05]">Nous recherchons un bien<br />dans <span style={{ color: "#b8935a" }}>votre quartier</span>.</h1>
            <p className="mt-3 max-w-[128mm] text-[14px]" style={{ color: "#d9c7ad" }}>
              Pour le compte d&apos;<b style={{ color: "#f7f3ec" }}>acquéreurs déjà sélectionnés et finançables</b>, nous cherchons activement maisons et appartements à vendre près de chez vous.
            </p>
          </div>
        </div>
        <div className="absolute inset-x-[14mm] bottom-[10mm]"><Contact nego={nego} tel={tel} clair /></div>
      </div>
    );
  }

  // 2) ACQUÉREURS EN ATTENTE — chiffre fort + urgence
  if (modele === "acquereur") {
    return (
      <div className={base} style={{ ...style, background: "#f7f3ec", color: "#0f1e3d" }}>
        <div className="flex items-start justify-between"><Logo /><div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#b8935a" }}>🎯 Recherche active</div></div>
        <div className="mt-4 flex items-center gap-5">
          <div className="font-serif text-[92px] font-black leading-none" style={{ color: "#b8935a" }}>3</div>
          <div>
            <BandeauDestinataire d={dest} />
            <h1 className="font-serif text-[30px] font-black leading-[1.08]">acquéreurs recherchent<br />un bien dans <span style={{ color: "#b8935a" }}>votre secteur</span>.</h1>
            <p className="mt-2 max-w-[120mm] text-[14px] text-slate-700">
              Leur projet est prêt, leur financement validé. <b>Votre bien les intéresse peut-être déjà.</b>
            </p>
          </div>
        </div>
        <div className="absolute inset-x-[14mm] bottom-[10mm]"><Contact nego={nego} tel={tel} /></div>
      </div>
    );
  }

  // 3) QUARTIER TRÈS RECHERCHÉ — pénurie de biens
  if (modele === "vendu") {
    return (
      <div className={base} style={{ ...style, background: "#ffffff", color: "#0f1e3d" }}>
        <div className="flex items-start justify-between">
          <Logo />
          <div className="rounded-md px-3 py-1.5 text-[12px] font-black uppercase tracking-widest" style={{ background: "#0f1e3d", color: "#f7f3ec" }}>🔥 Très demandé</div>
        </div>
        <div className="mt-6 pl-[4mm]">
          <BandeauDestinataire d={dest} />
          <h1 className="font-serif text-[33px] font-black leading-[1.06]">Votre quartier est<br /><span style={{ color: "#b8935a" }}>très recherché</span>.</h1>
          <p className="mt-3 max-w-[135mm] text-[14px] text-slate-700">
            Nous <b>manquons de biens</b> à proposer à nos acheteurs dans votre secteur. Si vous vendez (même plus tard), votre bien pourrait partir vite et au bon prix.
          </p>
        </div>
        <div className="absolute left-0 top-0 h-full w-[8mm]" style={{ background: "#b8935a" }} />
        <div className="absolute inset-x-[14mm] bottom-[10mm]"><Contact nego={nego} tel={tel} /></div>
      </div>
    );
  }

  // 4) NOUS AVONS DÉJÀ L'ACHETEUR — estimation offerte
  return (
    <div className={base} style={{ ...style, background: "#f7f3ec", color: "#0f1e3d" }}>
      <div className="flex items-start justify-between"><Logo /><div className="text-[44px] leading-none">🏡</div></div>
      <div className="mt-4">
        <BandeauDestinataire d={dest} />
        <div className="mb-2 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest" style={{ background: "#b8935a", color: "#0f1e3d" }}>Estimation offerte</div>
        <h1 className="font-serif text-[32px] font-black leading-[1.08]">Vous vendez ?<br />Nous avons peut-être <span style={{ color: "#b8935a" }}>déjà l&apos;acheteur</span>.</h1>
        <p className="mt-3 max-w-[135mm] text-[14px] text-slate-700">
          Grâce à notre fichier d&apos;acquéreurs en recherche active, nous rapprochons rapidement votre bien du bon acheteur. <b>Estimation offerte et sans engagement.</b>
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

  const portrait = estPortrait(modele);
  const telecharger = async () => {
    setPdf(true); setProg({ f: 0, t: feuilles.length });
    try {
      await genererFlyersPdf(`flyers-${modele}.pdf`, (f, t) => setProg({ f, t }), portrait ? "landscape" : "portrait");
    } catch { /* silencieux */ } finally { setPdf(false); setProg(null); }
  };

  // Feuille A4 : portrait (2 flyers paysage empilés) ou paysage (2 flyers
  // portrait côte à côte, pour « Juste une visite »).
  const sheetW = portrait ? 297 : 210; // mm
  const sheetH = portrait ? 210 : 297; // mm
  const SCALE = 0.62;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">🖨️ Flyers de prospection — chasse immobilière</h2>
          <p className="text-sm text-slate-500">Visuels « recherche active de biens », 2 flyers par A4. Personnalisez avec les noms relevés (CSV) pour un flyer nominatif par boîte aux lettres.</p>
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
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-3" style={{ height: `${feuilles.length * sheetH * SCALE + 8 * feuilles.length}mm` }}>
              <div className="flyers-doc" style={{ transform: `scale(${SCALE})`, transformOrigin: "top left", width: `${sheetW}mm` }}>
                {feuilles.map((paire, i) => (
                  <div key={i} className="flyer-sheet" style={{ width: `${sheetW}mm`, height: `${sheetH}mm`, boxSizing: "border-box", background: "#fff", marginBottom: "8mm", display: portrait ? "flex" : "block" }}>
                    {paire.map((d, j) => (
                      <div key={j} style={portrait
                        ? { width: "148.5mm", height: "210mm", borderRight: j === 0 ? "1px dashed #cbd5e1" : "none" }
                        : { height: "148.5mm", borderBottom: j === 0 ? "1px dashed #cbd5e1" : "none" }}>
                        <Flyer modele={modele} nego={nego} tel={tel} dest={d} />
                      </div>
                    ))}
                    {paire.length === 1 && <div style={portrait ? { width: "148.5mm", height: "210mm" } : { height: "148.5mm" }} />}
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
