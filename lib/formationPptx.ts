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

// Découpe le contenu d'une leçon en « pages » bornées (support FORMATEUR).
function paginer(lines: string[], budget = 840): string[][] {
  const chunks: string[][] = []; let cur: string[] = []; let c = 0;
  const flush = () => { if (cur.length) { chunks.push(cur); cur = []; c = 0; } };
  for (const l of lines) {
    const len = nettoie(l).length + 8;
    if (l.startsWith("## ") && c > budget * 0.5) flush();
    if (c + len > budget && cur.length) flush();
    cur.push(l); c += len;
  }
  flush();
  return chunks.length ? chunks : [lines];
}

// Choisit n éléments répartis régulièrement (déterministe → mêmes quiz dans les 2 versions).
function repartir<T>(arr: T[], n: number): T[] {
  if (arr.length <= n) return arr.slice();
  const out: T[] = []; const pas = arr.length / n;
  for (let i = 0; i < n; i++) out.push(arr[Math.floor(i * pas)]);
  return out;
}

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

  // Rendu riche (sous-titres, puces, paragraphes) — guide formateur.
  const renduRiche = (lines: string[]) => lines.map((l) => {
    if (l.startsWith("## ")) return { text: nettoie(l), options: { bold: true, color: COPPER, fontSize: 13.5, breakLine: true, paraSpaceBefore: 8, paraSpaceAfter: 2, fontFace: FONT } };
    if (l.startsWith("- ")) return { text: nettoie(l), options: { bullet: { code: "2022", indent: 14 }, color: DARK, fontSize: 12.5, breakLine: true, paraSpaceAfter: 3, fontFace: FONT } };
    return { text: nettoie(l), options: { color: SLATE, fontSize: 12.5, breakLine: true, paraSpaceAfter: 5, fontFace: FONT } };
  });

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

  // ---------- Objectifs ----------
  {
    const s = slideContenu("Formation", "Objectifs de la séance");
    s.addText(puces(animation.objectifs, { size: 16 }), { x: 0.7, y: 1.8, w: 11.9, h: 5, valign: "top", autoFit: true });
    if (estFormateur) s.addText("À dire : « Voici ce que vous saurez FAIRE en sortant. » Reliez chaque objectif à une situation de terrain vécue.", { x: 0.7, y: 6.6, w: 11.9, h: 0.5, fontSize: 11, italic: true, color: GREY, fontFace: FONT });
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

  // ---------- Apports ----------
  module.lecons.forEach((lec, i) => {
    if (estFormateur) {
      // Contenu INTÉGRAL, paginé.
      const pages = paginer(lec.contenu, 840);
      pages.forEach((chunk, pi) => {
        const s = slideContenu(`Apport ${i + 1}/${module.lecons.length}`, pi === 0 ? lec.titre : `${lec.titre} (suite)`);
        s.addText(renduRiche(chunk), { x: 0.7, y: 1.75, w: 11.9, h: 5.15, valign: "top", autoFit: true });
      });
    } else {
      const s = slideContenu(`Apport ${i + 1}/${module.lecons.length}`, lec.titre);
      s.addText(puces(pointsLecon(lec), { size: 16 }), { x: 0.7, y: 1.8, w: 11.9, h: 5, valign: "top", autoFit: true });
    }
  });

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
