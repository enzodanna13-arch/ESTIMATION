"use client";

import { useMemo, useState } from "react";
import { NEGOCIATEURS, photoNegociateur, telNegociateurFormate } from "@/lib/equipe";
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
  { id: "vendre", label: "Vendre — Estimation offerte", portrait: true },
  { id: "estimer", label: "Faites estimer votre bien", portrait: true },
] as const;
type ModeleId = (typeof MODELES)[number]["id"];
const estPortrait = (id: ModeleId) => Boolean(MODELES.find((m) => m.id === id && "portrait" in m && m.portrait));

// Visuels image (portrait) dont la colonne droite du bandeau a été nettoyée.
const IMG_PORTRAIT: Partial<Record<ModeleId, string>> = {
  "chasse-visite": "/flyers/juste-une-visite-clean.jpg",
  vendre: "/flyers/estimation-vendre-clean.jpg",
  estimer: "/flyers/faites-estimer-clean.jpg",
};

// ---------------------------------------------------------------------------
// Un flyer (A5 paysage : 210 × 148,5 mm)

function Flyer({ modele, nego, tel }: { modele: ModeleId; nego: string; tel: string; dest?: Destinataire }) {

  // 0) CHASSE « Juste une visite » — visuel A5 portrait fourni par l'agence,
  // avec la photo + les coordonnées du négociateur en bas à droite.
  if (IMG_PORTRAIT[modele]) {
    const photo = photoNegociateur(nego);
    const initiales = (nego || "").split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    return (
      <div className="relative overflow-hidden" style={{ width: "148.5mm", height: "210mm" }}>
        {/* Visuel dont la colonne droite du bandeau (illustration + tagline) a
            été nettoyée : le négociateur se pose dessus, sans cadre, et se fond. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG_PORTRAIT[modele]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", right: "1.5mm", bottom: "6mm", width: "35mm", height: "24mm", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5mm" }}>
          {photo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={photo} alt="" style={{ width: "12mm", height: "12mm", borderRadius: "50%", objectFit: "cover", border: "1.5px solid #b8935a" }} />
          ) : (
            <div style={{ width: "12mm", height: "12mm", borderRadius: "50%", border: "1.5px solid #b8935a", background: "rgba(184,147,90,.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#e7cfa0", fontWeight: 800, fontSize: "12px" }}>{initiales}</div>
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

  return null;
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
  const [modele, setModele] = useState<ModeleId>("chasse-visite");
  const [nego, setNego] = useState(NEGOCIATEURS[0] ?? "");
  const [tel, setTel] = useState<string>(telNegociateurFormate(NEGOCIATEURS[0]) ?? "04 42 42 80 85");
  const [perso, setPerso] = useState(false);
  const [csvTexte, setCsvTexte] = useState("");
  const [nbGenerique, setNbGenerique] = useState(2);
  const [pdf, setPdf] = useState(false);
  const [prog, setProg] = useState<{ f: number; t: number } | null>(null);

  const choisirNego = (nom: string) => {
    setNego(nom);
    setTel(telNegociateurFormate(nom) ?? "04 42 42 80 85");
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
  // Espace blanc entre les 2 flyers pour une découpe propre : on réduit très
  // légèrement chaque flyer (proportions conservées) et on centre.
  const GAP = 6; // mm
  const flyScale = (297 - GAP) / 2 / 148.5; // ≈ 0.98
  const cellW = 148.5 * flyScale; // mm
  const cellH = 210 * flyScale; // mm

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
                  <div key={i} className="flyer-sheet" style={{ width: `${sheetW}mm`, height: `${sheetH}mm`, boxSizing: "border-box", background: "#fff", marginBottom: "8mm", display: "flex", flexDirection: portrait ? "row" : "column", alignItems: "center", justifyContent: "center", gap: `${GAP}mm` }}>
                    {paire.map((d, j) => (
                      <div key={j} style={{ width: `${cellW}mm`, height: `${cellH}mm`, overflow: "hidden", borderLeft: portrait && j === 1 ? "1px dashed #e2e8f0" : "none", borderTop: !portrait && j === 1 ? "1px dashed #e2e8f0" : "none" }}>
                        <div style={{ transform: `scale(${flyScale})`, transformOrigin: "top left" }}>
                          <Flyer modele={modele} nego={nego} tel={tel} dest={d} />
                        </div>
                      </div>
                    ))}
                    {paire.length === 1 && <div style={{ width: `${cellW}mm`, height: `${cellH}mm` }} />}
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="mt-2 text-xs text-slate-400">Un espace blanc sépare les 2 flyers au milieu de la feuille : découpez dedans pour un bord net.</p>
        </div>
      </div>
    </div>
  );
}
