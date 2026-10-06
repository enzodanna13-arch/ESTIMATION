// Génère les SUPPORTS DE FORMATION PowerPoint (.pptx) d'un module, en DEUX
// versions cohérentes :
//  - "projection" : support visuel projeté aux négociateurs (sans les réponses
//    de quiz, sans corrigés) ;
//  - "formateur"  : guide complet du manager, avec TOUT le texte à dire (chaque
//    explication et exemple des leçons sur les slides), les corrigés des jeux,
//    les débriefs des jeux de rôle et les bonnes réponses des quiz.
// pptxgenjs est chargé dynamiquement (uniquement au téléchargement).

import type { ModuleFormation } from "./formations";
import type { AnimationModule } from "./formationAnimation";

export type RolePptx = "formateur" | "projection";

const NAVY = "0F2E4C";
const COPPER = "C96F3B";
const COPPER_SOFT = "F6E8DD";
const DARK = "16232F";
const SLATE = "334155";
const GREEN = "047857";
const GREEN_SOFT = "ECFDF5";
const GREY = "64748B";
const LIGHT = "F4F6F8";
const WHITE = "FFFFFF";
const FONT = "Arial";
const W = 13.333, H = 7.5;

const nettoie = (s: string) => (s ?? "")
  .replace(/\*\*/g, "")
  .replace(/^##\s*/, "")
  .replace(/^-\s*/, "")
  .replace(/\s+/g, " ")
  .trim();

const nomFichier = (role: RolePptx, titre: string) => {
  const t = (titre || "module").replace(/[\\/:*?"<>|\r\n]+/g, " ").trim().slice(0, 90);
  return `${role === "formateur" ? "FORMATEUR" : "PROJECTION"} - ${t}.pptx`;
};

const lettre = (i: number) => String.fromCharCode(65 + i);

// Points-clés (sous-titres "##") d'une leçon, pour le support PROJETÉ.
function pointsLecon(lec: { titre: string; contenu: string[] }): string[] {
  const subs = lec.contenu.filter((l) => l.startsWith("## ")).map((l) => l.slice(3).trim());
  if (subs.length) return subs.slice(0, 8);
  const bl = lec.contenu.filter((l) => l.startsWith("- ")).map((l) => nettoie(l));
  if (bl.length) return bl.slice(0, 7);
  return lec.contenu.slice(0, 5).map(nettoie);
}

// Découpe une leçon en sections (par sous-titre "##").
function sectionsLecon(lec: { titre: string; contenu: string[] }): { heading: string; raw: string[] }[] {
  const secs: { heading: string; raw: string[] }[] = []; let cur: { heading: string; raw: string[] } | null = null;
  const flush = () => { if (cur && (cur.heading || cur.raw.length)) secs.push(cur); cur = null; };
  for (const l of lec.contenu) {
    if (l.startsWith("## ")) { flush(); cur = { heading: l.slice(3).trim(), raw: [] }; }
    else { if (!cur) cur = { heading: "", raw: [] }; cur.raw.push(l); }
  }
  flush();
  return secs;
}
type SecDisplay = { heading: string; points: string[] };
// Première phrase « propre » d'un paragraphe (pour condenser).
function premierePhrase(p: string): string {
  const m = p.match(/^.{20,210}?[.!?](\s|$)/);
  return m ? m[0].trim() : (p.length > 200 ? p.slice(0, 197) + "…" : p);
}
// Condense une leçon en 1 à 2 diapos. En PROJECTION : titres + 1-2 points
// concis par section. En FORMATEUR : plus dense (phrase d'intro + puces),
// le texte intégral partant dans les notes du présentateur.
function blocsLecon(lec: { titre: string; contenu: string[] }, role: RolePptx): SecDisplay[][] {
  const secs = sectionsLecon(lec);
  const display: SecDisplay[] = secs.map((s) => {
    const bullets = s.raw.filter((l) => l.startsWith("- ")).map((l) => nettoie(l)).filter(Boolean);
    const paras = s.raw.filter((l) => !l.startsWith("- ")).map((l) => nettoie(l)).filter(Boolean);
    let points: string[] = [];
    if (role === "projection") {
      points = bullets.length ? bullets.slice(0, 2) : (paras.length ? [premierePhrase(paras[0])] : []);
    } else {
      if (paras.length) points.push(premierePhrase(paras[0]));
      points.push(...bullets.slice(0, 4));
      if (!points.length && paras.length) points.push(premierePhrase(paras[0]));
    }
    return { heading: s.heading, points };
  }).filter((d) => d.heading || d.points.length);
  if (!display.length) return [[{ heading: "", points: pointsLecon(lec).slice(0, 6) }]];
  const poids = display.reduce((n, d) => n + 1 + d.points.length, 0);
  const maxUneDiapo = role === "projection" ? 13 : 18;
  if (poids <= maxUneDiapo) return [display];
  // Deux diapos : coupe au milieu (par poids).
  const moitie = poids / 2; let acc = 0, idx = display.length;
  for (let i = 0; i < display.length; i++) { acc += 1 + display[i].points.length; if (acc >= moitie) { idx = i + 1; break; } }
  idx = Math.max(1, Math.min(idx, display.length - 1));
  return [display.slice(0, idx), display.slice(idx)];
}

// Choisit n éléments répartis régulièrement (déterministe → mêmes quiz dans les 2 versions).
function repartir<T>(arr: T[], n: number): T[] {
  if (arr.length <= n) return arr.slice();
  const out: T[] = []; const pas = arr.length / n;
  for (let i = 0; i < n; i++) out.push(arr[Math.floor(i * pas)]);
  return out;
}
function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = []; for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n)); return out;
}
type Run = { text: string; options: Record<string, unknown> };

export async function telechargerSupportPptx(module: ModuleFormation, animation: AnimationModule, role: RolePptx = "projection"): Promise<void> {
  const mod = await import("pptxgenjs");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Pptx: any = (mod as any).default ?? mod;
  const pptx = new Pptx();
  pptx.defineLayout({ name: "W16x9", width: W, height: H });
  pptx.layout = "W16x9";
  pptx.author = "CENTURY 21 Icaza Immobilier";
  pptx.company = "CENTURY 21 Icaza Immobilier";
  pptx.title = `Formation — ${module.titre}`;
  const estFormateur = role === "formateur";

  const ROUND = pptx.ShapeType.roundRect;
  const RECT = pptx.ShapeType.rect;

  pptx.defineSlideMaster({
    title: "CONTENU",
    background: { color: WHITE },
    objects: [
      { rect: { x: 0, y: 0, w: W, h: 0.14, fill: { color: estFormateur ? NAVY : COPPER } } },
      { text: { text: `CENTURY 21 Icaza — ${estFormateur ? "GUIDE FORMATEUR" : "Support"} : ${module.titre}`, options: { x: 0.5, y: 7.04, w: 11, h: 0.3, fontSize: 8, color: GREY, align: "left", fontFace: FONT } } },
    ],
    slideNumber: { x: 12.5, y: 7.04, w: 0.6, h: 0.3, color: GREY, fontSize: 9, fontFace: FONT },
  });

  const puces = (items: string[], o: { color?: string; size?: number } = {}) =>
    items.filter(Boolean).map((t) => ({ text: nettoie(t), options: { bullet: { code: "2022", indent: 18 }, color: o.color ?? DARK, fontSize: o.size ?? 15, paraSpaceAfter: 8, breakLine: true, fontFace: FONT } }));

  const slideContenu = (surtitre: string, titre: string) => {
    const s = pptx.addSlide({ masterName: "CONTENU" });
    if (surtitre) s.addText(surtitre.toUpperCase(), { x: 0.55, y: 0.42, w: 12.2, h: 0.3, fontSize: 12, color: COPPER, bold: true, charSpacing: 2, fontFace: FONT });
    s.addText(titre, { x: 0.55, y: 0.72, w: 12.2, h: 0.75, fontSize: 23, color: NAVY, bold: true, fontFace: FONT });
    s.addShape(RECT, { x: 0.57, y: 1.5, w: 1.1, h: 0.06, fill: { color: COPPER } });
    return s;
  };

  // ---------- Couverture ----------
  {
    const s = pptx.addSlide();
    s.background = { color: NAVY };
    s.addShape(RECT, { x: 0, y: 0, w: 0.35, h: H, fill: { color: COPPER } });
    s.addText("CENTURY 21 · ICAZA IMMOBILIER — FORMATION INTERNE", { x: 0.9, y: 0.7, w: 11.5, h: 0.4, fontSize: 13, color: COPPER, bold: true, charSpacing: 2, fontFace: FONT });
    s.addShape(ROUND, { x: 0.9, y: 1.3, w: estFormateur ? 4.6 : 4.0, h: 0.5, fill: { color: estFormateur ? COPPER : "1E3A56" }, rectRadius: 0.1 });
    s.addText(estFormateur ? "GUIDE FORMATEUR — à garder" : "SUPPORT À PROJETER", { x: 0.9, y: 1.3, w: estFormateur ? 4.6 : 4.0, h: 0.5, fontSize: 12, color: WHITE, bold: true, align: "center", valign: "middle", fontFace: FONT });
    s.addText(module.titre, { x: 0.9, y: 2.3, w: 11.6, h: 1.5, fontSize: 42, color: WHITE, bold: true, fontFace: FONT });
    s.addText(animation.sousTitre || module.resume || "", { x: 0.95, y: 3.85, w: 11.3, h: 0.9, fontSize: 17, color: "CBD5E1", italic: true, fontFace: FONT });
    s.addText(`Niveau ${module.niveau}  ·  ${module.categorie}  ·  ${module.duree}`, { x: 0.95, y: 4.9, w: 11, h: 0.4, fontSize: 13, color: "94A3B8", fontFace: FONT });
    s.addText("Animé par : ______________________        Date : ____________", { x: 0.95, y: 6.2, w: 11, h: 0.4, fontSize: 13, color: "94A3B8", fontFace: FONT });
    if (estFormateur) s.addNotes(["CONSEILS D'ANIMATION :", ...animation.notesFormateur.map((n) => "• " + n)].join("\n"));
  }

  // ---------- [Formateur] Comment utiliser ce guide ----------
  if (estFormateur) {
    const s = slideContenu("Mode d'emploi", "Comment animer avec ce guide");
    s.addText([
      { text: "Ce guide est complet : même sans connaître l'immobilier, vous pouvez animer la séance.", options: { bold: true, color: NAVY, fontSize: 15, breakLine: true, paraSpaceAfter: 10, fontFace: FONT } },
      ...[
        "Lisez d'abord le GLOSSAIRE : il définit chaque terme employé.",
        "Les diapos « Apport » contiennent le texte à transmettre, mot pour mot — dites-le avec vos mots.",
        "Les blocs verts (corrigés, réponses de quiz) et les notes du présentateur sont pour VOUS, pas pour la salle.",
        "Projetez l'autre fichier « PROJECTION » aux négociateurs ; gardez celui-ci sous les yeux.",
        "Suivez le minutage de l'agenda et faites participer avec les « Questions à poser ».",
        "Pour chaque jeu : lisez la règle à voix haute, lancez, puis débriefez avec le corrigé.",
      ].map((t) => ({ text: t, options: { bullet: { code: "2022", indent: 16 }, color: DARK, fontSize: 14, breakLine: true, paraSpaceAfter: 7, fontFace: FONT } })),
    ], { x: 0.7, y: 1.8, w: 11.9, h: 5, valign: "top", autoFit: true });
  }

  // ---------- Objectifs ----------
  {
    const s = slideContenu("Formation", "Objectifs de la séance");
    s.addText(puces(animation.objectifs, { size: 16 }), { x: 0.7, y: 1.8, w: 11.9, h: 5, valign: "top", autoFit: true });
    if (estFormateur) s.addText("À dire : « Voici ce que vous saurez FAIRE en sortant. » Reliez chaque objectif à une situation de terrain vécue.", { x: 0.7, y: 6.6, w: 11.9, h: 0.5, fontSize: 11, italic: true, color: GREY, fontFace: FONT });
  }

  // ---------- [Formateur] Préparation, messages à marteler, ouverture ----------
  if (estFormateur) {
    if (animation.materiel?.length) {
      const s = slideContenu("Avant de commencer", "Préparation & matériel");
      s.addText(puces(animation.materiel, { size: 15 }), { x: 0.7, y: 1.8, w: 11.9, h: 5, valign: "top", autoFit: true });
    }
    if (animation.messagesCles?.length) {
      const s = slideContenu("Fil rouge", "Les messages à marteler");
      s.addText(animation.messagesCles.map((m) => ({ text: nettoie(m), options: { bullet: { code: "2022" }, color: NAVY, bold: true, fontSize: 17, paraSpaceAfter: 12, breakLine: true, fontFace: FONT } })), { x: 0.8, y: 1.9, w: 11.7, h: 5, valign: "top", autoFit: true });
    }
    if (animation.scriptOuverture) {
      const s = slideContenu("Ce que je dis", "Mon ouverture");
      s.addShape(ROUND, { x: 0.7, y: 1.8, w: 11.9, h: 3.4, fill: { color: LIGHT }, line: { color: COPPER, width: 1 }, rectRadius: 0.1 });
      s.addText(`« ${nettoie(animation.scriptOuverture)} »`, { x: 1.0, y: 2.05, w: 11.3, h: 2.9, fontSize: 15, italic: true, color: DARK, valign: "top", autoFit: true, fontFace: FONT });
      if (animation.questionsPublic?.length) s.addText("Puis j'embraye en demandant : « " + nettoie(animation.questionsPublic[0]) + " »", { x: 0.7, y: 5.5, w: 11.9, h: 0.8, fontSize: 13, color: GREY, italic: true, valign: "top", autoFit: true, fontFace: FONT });
    }
    // Glossaire : le vocabulaire défini pour un formateur débutant.
    if (animation.glossaire?.length) {
      for (const grp of chunk(animation.glossaire, 6)) {
        const s = slideContenu("Le vocabulaire à connaître", "Glossaire");
        const runs: Run[] = [];
        grp.forEach((g) => {
          runs.push({ text: nettoie(g.terme), options: { bold: true, color: NAVY, fontSize: 14, breakLine: true, paraSpaceBefore: 7, paraSpaceAfter: 1, fontFace: FONT } });
          runs.push({ text: nettoie(g.definition), options: { color: SLATE, fontSize: 12, breakLine: true, paraSpaceAfter: 5, fontFace: FONT } });
        });
        s.addText(runs, { x: 0.7, y: 1.75, w: 11.9, h: 5.15, valign: "top", autoFit: true });
      }
    }
  }

  // ---------- Au programme ----------
  {
    const s = slideContenu("Déroulé", "Au programme");
    let y = 1.8;
    for (const a of animation.agenda) {
      s.addShape(ROUND, { x: 0.7, y, w: 1.5, h: 0.45, fill: { color: COPPER_SOFT }, rectRadius: 0.08 });
      s.addText(a.duree, { x: 0.7, y, w: 1.5, h: 0.45, fontSize: 11, color: COPPER, bold: true, align: "center", valign: "middle", fontFace: FONT });
      s.addText(a.titre, { x: 2.4, y, w: 10, h: 0.45, fontSize: 14, color: DARK, valign: "middle", fontFace: FONT });
      y += 0.52; if (y > 6.8) break;
    }
  }

  // ---------- Brise-glace ----------
  {
    const s = slideContenu("On démarre", `Brise-glace — ${animation.briseGlace.titre}`);
    s.addShape(ROUND, { x: 0.7, y: 1.75, w: 11.9, h: 4.9, fill: { color: LIGHT }, line: { color: COPPER, width: 1 }, rectRadius: 0.1 });
    s.addText(puces(animation.briseGlace.consignes, { size: estFormateur ? 13 : 15 }), { x: 1.0, y: 2.0, w: 11.3, h: 4.4, valign: "top", autoFit: true });
  }

  // ---------- Divider apports ----------
  {
    const s = pptx.addSlide();
    s.background = { color: NAVY };
    s.addShape(RECT, { x: 0, y: 3.5, w: W, h: 0.06, fill: { color: COPPER } });
    s.addText("LES APPORTS", { x: 0.9, y: 2.7, w: 11.5, h: 0.5, fontSize: 16, color: COPPER, bold: true, charSpacing: 3, fontFace: FONT });
    s.addText(estFormateur ? "Le contenu complet à transmettre" : "Le contenu clé du module", { x: 0.9, y: 3.7, w: 11.5, h: 0.8, fontSize: 28, color: WHITE, bold: true, fontFace: FONT });
  }

  // ---------- Apports : 1 à 2 diapos par leçon (optimisé) ----------
  // Les deux versions restent alignées (même nombre de pages par leçon).
  // Formateur : le texte INTÉGRAL de la leçon part dans les notes du présentateur.
  module.lecons.forEach((lec, i) => {
    const blocs = blocsLecon(lec, estFormateur ? "formateur" : "projection");
    blocs.forEach((grp, gi) => {
      const s = slideContenu(`Apport ${i + 1}/${module.lecons.length}`, gi === 0 ? lec.titre : `${lec.titre} (suite)`);
      const runs: Run[] = [];
      grp.forEach((sec) => {
        if (sec.heading) runs.push({ text: sec.heading, options: { bold: true, color: COPPER, fontSize: estFormateur ? 15 : 16, breakLine: true, paraSpaceBefore: 10, paraSpaceAfter: 4, fontFace: FONT } });
        sec.points.forEach((p) => runs.push({ text: p, options: { bullet: { code: "2022", indent: 16 }, color: DARK, fontSize: estFormateur ? 13 : 14.5, breakLine: true, paraSpaceAfter: estFormateur ? 5 : 7, fontFace: FONT } }));
      });
      s.addText(runs, { x: 0.7, y: 1.8, w: 11.9, h: 5, valign: "top", autoFit: true });
      if (estFormateur) {
        const notes = ["TEXTE COMPLET À TRANSMETTRE (ce que vous développez à l'oral) :", "", ...lec.contenu.map((l) => (l.startsWith("## ") ? "\n— " + nettoie(l) + " —" : (l.startsWith("- ") ? "• " + nettoie(l) : nettoie(l))))];
        s.addNotes(notes.join("\n"));
      }
    });
  });

  // ---------- [Formateur] Exemples terrain & questions à poser ----------
  if (estFormateur) {
    if (animation.exemplesTerrain?.length) {
      for (const grp of chunk(animation.exemplesTerrain, 3)) {
        const s = slideContenu("Pour illustrer", "Exemples & anecdotes terrain");
        const runs: Run[] = [];
        grp.forEach((e) => {
          runs.push({ text: "▸ " + nettoie(e.titre), options: { bold: true, color: COPPER, fontSize: 14, breakLine: true, paraSpaceBefore: 8, paraSpaceAfter: 2, fontFace: FONT } });
          runs.push({ text: nettoie(e.texte), options: { color: SLATE, fontSize: 12.5, breakLine: true, paraSpaceAfter: 6, fontFace: FONT } });
        });
        s.addText(runs, { x: 0.7, y: 1.8, w: 11.9, h: 5, valign: "top", autoFit: true });
      }
    }
    if (animation.questionsPublic?.length) {
      const s = slideContenu("Faire participer", "Questions à poser à la salle");
      s.addText(puces(animation.questionsPublic, { size: 14 }), { x: 0.7, y: 1.8, w: 11.9, h: 5, valign: "top", autoFit: true });
    }
  }

  // ---------- Jeux ----------
  animation.jeux.forEach((j, i) => {
    const s = slideContenu(`Jeu ${i + 1} · ${j.type} · ${j.duree}`, `🎲 ${j.titre}`);
    const hautPanel = estFormateur && j.corrige && j.corrige.length ? 2.9 : 4.9;
    s.addShape(ROUND, { x: 0.7, y: 1.75, w: 11.9, h: hautPanel, fill: { color: COPPER_SOFT }, rectRadius: 0.1 });
    s.addText("Règle du jeu", { x: 1.0, y: 1.92, w: 11, h: 0.35, fontSize: 13, color: COPPER, bold: true, fontFace: FONT });
    s.addText(puces(j.consignes, { size: estFormateur ? 12.5 : 14 }), { x: 1.0, y: 2.3, w: 11.3, h: hautPanel - 0.7, valign: "top", autoFit: true });
    if (estFormateur && j.corrige && j.corrige.length) {
      const yC = 1.75 + hautPanel + 0.15;
      s.addShape(ROUND, { x: 0.7, y: yC, w: 11.9, h: 6.7 - yC, fill: { color: GREEN_SOFT }, line: { color: GREEN, width: 1 }, rectRadius: 0.1 });
      s.addText("✅ Corrigé (réservé formateur)", { x: 1.0, y: yC + 0.12, w: 11, h: 0.35, fontSize: 12, color: GREEN, bold: true, fontFace: FONT });
      s.addText(puces(j.corrige, { size: 11.5, color: SLATE }), { x: 1.0, y: yC + 0.5, w: 11.3, h: 6.6 - yC - 0.5, valign: "top", autoFit: true });
    }
    s.addNotes(["ANIMATION :", ...j.animation.map((a) => "• " + a), ...(j.corrige && j.corrige.length ? ["", "CORRIGÉ :", ...j.corrige.map((c) => "• " + c)] : [])].join("\n"));
  });

  // ---------- Jeux de rôle ----------
  animation.jeuxRole.forEach((jr) => {
    const s = slideContenu("Mise en situation", `🎭 Jeu de rôle — ${jr.titre}`);
    s.addText([{ text: "Contexte : ", options: { bold: true, color: NAVY } }, { text: jr.contexte, options: { color: DARK } }], { x: 0.7, y: 1.7, w: 11.9, h: 0.9, fontSize: 13, valign: "top", autoFit: true, fontFace: FONT });
    const hBox = estFormateur ? 2.1 : 2.7;
    s.addShape(ROUND, { x: 0.7, y: 2.65, w: 5.8, h: hBox, fill: { color: LIGHT }, line: { color: NAVY, width: 1 }, rectRadius: 0.1 });
    s.addText("RÔLE A", { x: 0.9, y: 2.78, w: 5.4, h: 0.3, fontSize: 12, color: NAVY, bold: true, fontFace: FONT });
    s.addText(jr.roleA, { x: 0.9, y: 3.1, w: 5.4, h: hBox - 0.5, fontSize: 12, color: DARK, valign: "top", autoFit: true, fontFace: FONT });
    s.addShape(ROUND, { x: 6.8, y: 2.65, w: 5.8, h: hBox, fill: { color: COPPER_SOFT }, line: { color: COPPER, width: 1 }, rectRadius: 0.1 });
    s.addText("RÔLE B", { x: 7.0, y: 2.78, w: 5.4, h: 0.3, fontSize: 12, color: COPPER, bold: true, fontFace: FONT });
    s.addText(jr.roleB, { x: 7.0, y: 3.1, w: 5.4, h: hBox - 0.5, fontSize: 12, color: DARK, valign: "top", autoFit: true, fontFace: FONT });
    const yObj = 2.65 + hBox + 0.15;
    s.addText([{ text: "Objectif : ", options: { bold: true, color: COPPER } }, { text: jr.objectif, options: { color: DARK } }], { x: 0.7, y: yObj, w: 11.9, h: 0.6, fontSize: 13, valign: "top", autoFit: true, fontFace: FONT });
    if (estFormateur) {
      s.addText([{ text: "Débrief : ", options: { bold: true, color: GREEN } }, ...jr.debrief.map((d) => ({ text: "  • " + nettoie(d), options: { color: SLATE } }))], { x: 0.7, y: yObj + 0.55, w: 11.9, h: 6.7 - (yObj + 0.55), fontSize: 11.5, valign: "top", autoFit: true, fontFace: FONT });
    } else {
      s.addNotes(["DÉBRIEF :", ...jr.debrief.map((d) => "• " + d)].join("\n"));
    }
  });

  // ---------- [Formateur] FAQ stagiaires, erreurs fréquentes, mémo chiffres ----------
  if (estFormateur) {
    if (animation.objectionsStagiaires?.length) {
      for (const grp of chunk(animation.objectionsStagiaires, 3)) {
        const s = slideContenu("Ils vont demander", "Objections des stagiaires — FAQ");
        const runs: Run[] = [];
        grp.forEach((f) => {
          runs.push({ text: "Q.  " + nettoie(f.question), options: { bold: true, color: NAVY, fontSize: 13.5, breakLine: true, paraSpaceBefore: 8, paraSpaceAfter: 2, fontFace: FONT } });
          runs.push({ text: "R.  " + nettoie(f.reponse), options: { color: SLATE, fontSize: 12.5, breakLine: true, paraSpaceAfter: 6, fontFace: FONT } });
        });
        s.addText(runs, { x: 0.7, y: 1.8, w: 11.9, h: 5, valign: "top", autoFit: true });
      }
    }
    if (animation.erreursFrequentes?.length) {
      const s = slideContenu("Points de vigilance", "Erreurs fréquentes à éviter");
      s.addText(puces(animation.erreursFrequentes, { size: 14 }), { x: 0.7, y: 1.8, w: 11.9, h: 5, valign: "top", autoFit: true });
    }
    if (animation.chiffresCles?.length) {
      const s = slideContenu("Mémo", "Chiffres & repères clés");
      s.addText(puces(animation.chiffresCles, { size: 14, color: NAVY }), { x: 0.7, y: 1.8, w: 11.9, h: 5, valign: "top", autoFit: true });
    }
  }

  // ---------- Quiz en direct ----------
  const quizLive = repartir(module.quiz, Math.min(6, module.quiz.length));
  if (quizLive.length) {
    const s = pptx.addSlide();
    s.background = { color: NAVY };
    s.addShape(RECT, { x: 0, y: 3.5, w: W, h: 0.06, fill: { color: COPPER } });
    s.addText("QUIZ EN DIRECT", { x: 0.9, y: 2.7, w: 11.5, h: 0.5, fontSize: 16, color: COPPER, bold: true, charSpacing: 3, fontFace: FONT });
    s.addText(estFormateur ? "Réponses ci-dessous (ne pas projeter aux stagiaires)" : "On teste les acquis — en équipes !", { x: 0.9, y: 3.7, w: 11.5, h: 0.8, fontSize: 26, color: WHITE, bold: true, fontFace: FONT });
  }
  quizLive.forEach((q, i) => {
    const s = slideContenu(`Quiz ${i + 1}/${quizLive.length}`, q.question);
    const runs = q.options.map((o, oi) => {
      const bon = estFormateur && oi === q.correct;
      return { text: `${bon ? "✔ " : ""}${lettre(oi)}.  ${o}`, options: { color: bon ? GREEN : DARK, bold: bon, fontSize: 17, paraSpaceAfter: 12, breakLine: true, fontFace: FONT } };
    });
    s.addText(runs, { x: 0.9, y: 2.0, w: 11.5, h: estFormateur ? 3.4 : 4.4, valign: "top", autoFit: true });
    if (estFormateur) {
      s.addShape(ROUND, { x: 0.7, y: 5.6, w: 11.9, h: 1.1, fill: { color: GREEN_SOFT }, line: { color: GREEN, width: 1 }, rectRadius: 0.1 });
      s.addText([{ text: `Réponse : ${lettre(q.correct)}. ${q.options[q.correct]}  — `, options: { bold: true, color: GREEN } }, { text: q.explication, options: { color: SLATE } }], { x: 0.95, y: 5.72, w: 11.4, h: 0.9, fontSize: 12.5, valign: "top", autoFit: true, fontFace: FONT });
    } else {
      s.addNotes(`Bonne réponse : ${lettre(q.correct)}. ${q.options[q.correct]}\n${q.explication}`);
    }
  });

  // ---------- Points clés ----------
  {
    const s = slideContenu("Synthèse", "Les points clés à retenir");
    s.addText(puces(animation.pointsCles, { size: 16 }), { x: 0.7, y: 1.8, w: 11.9, h: 5, valign: "top", autoFit: true });
  }

  // ---------- Plan d'action ----------
  {
    const s = slideContenu("On passe à l'action", "Dès demain, je…");
    let y = 1.9;
    for (const a of animation.planAction) {
      s.addShape(ROUND, { x: 0.7, y, w: 0.4, h: 0.4, fill: { color: WHITE }, line: { color: COPPER, width: 1.5 }, rectRadius: 0.05 });
      s.addText(nettoie(a), { x: 1.3, y: y - 0.05, w: 11.2, h: 0.5, fontSize: 15, color: DARK, valign: "middle", autoFit: true, fontFace: FONT });
      y += 0.68; if (y > 6.6) break;
    }
  }

  // ---------- Clôture ----------
  {
    const s = pptx.addSlide();
    s.background = { color: NAVY };
    s.addShape(RECT, { x: 0, y: 0, w: 0.35, h: H, fill: { color: COPPER } });
    s.addText("Merci — et place au terrain ! 🚀", { x: 0.9, y: 2.9, w: 11.5, h: 1, fontSize: 34, color: WHITE, bold: true, fontFace: FONT });
    s.addText("CENTURY 21 Icaza Immobilier · Martigues — Formation interne", { x: 0.9, y: 4.1, w: 11.5, h: 0.5, fontSize: 14, color: "CBD5E1", fontFace: FONT });
  }

  await pptx.writeFile({ fileName: nomFichier(role, module.titre) });
}
