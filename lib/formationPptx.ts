// Génère un SUPPORT DE FORMATION PowerPoint (.pptx) professionnel pour animer
// un module en présentiel : couverture, objectifs, déroulé, apports (par leçon),
// jeux interactifs, jeux de rôle, quiz en direct, points-clés, plan d'action.
// Les notes de chaque diapo contiennent les consignes d'animation (corrigés,
// timing, réponses des quiz) — visibles par le formateur, pas par la salle.
// pptxgenjs est chargé dynamiquement (uniquement au téléchargement).

import type { ModuleFormation } from "./formations";
import type { AnimationModule } from "./formationAnimation";

const NAVY = "0F2E4C";
const COPPER = "C96F3B";
const COPPER_SOFT = "F6E8DD";
const DARK = "16232F";
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

const nomFichier = (titre: string) => `Formation - ${(titre || "module").replace(/[\\/:*?"<>|\r\n]+/g, " ").trim().slice(0, 100)}.pptx`;

// Points-clés à afficher pour une leçon (sous-titres "##", sinon puces/§).
function pointsLecon(lec: { titre: string; contenu: string[] }): string[] {
  const subs = lec.contenu.filter((l) => l.startsWith("## ")).map((l) => l.slice(3).trim());
  if (subs.length) return subs.slice(0, 7);
  const bl = lec.contenu.filter((l) => l.startsWith("- ")).map((l) => nettoie(l));
  if (bl.length) return bl.slice(0, 6);
  return lec.contenu.slice(0, 4).map(nettoie);
}

// Choisit n éléments répartis régulièrement dans un tableau.
function repartir<T>(arr: T[], n: number): T[] {
  if (arr.length <= n) return arr.slice();
  const out: T[] = []; const pas = arr.length / n;
  for (let i = 0; i < n; i++) out.push(arr[Math.floor(i * pas)]);
  return out;
}

const lettre = (i: number) => String.fromCharCode(65 + i);

export async function telechargerSupportPptx(module: ModuleFormation, animation: AnimationModule): Promise<void> {
  const mod = await import("pptxgenjs");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Pptx: any = (mod as any).default ?? mod;
  const pptx = new Pptx();
  pptx.defineLayout({ name: "W16x9", width: W, height: H });
  pptx.layout = "W16x9";
  pptx.author = "CENTURY 21 Icaza Immobilier";
  pptx.company = "CENTURY 21 Icaza Immobilier";
  pptx.title = `Formation — ${module.titre}`;

  const ROUND = pptx.ShapeType.roundRect;
  const RECT = pptx.ShapeType.rect;

  // Masters
  pptx.defineSlideMaster({
    title: "CONTENU",
    background: { color: WHITE },
    objects: [
      { rect: { x: 0, y: 0, w: W, h: 0.14, fill: { color: COPPER } } },
      { text: { text: `CENTURY 21 Icaza — Formation : ${module.titre}`, options: { x: 0.5, y: 7.04, w: 10, h: 0.3, fontSize: 8, color: GREY, align: "left", fontFace: FONT } } },
    ],
    slideNumber: { x: 12.5, y: 7.04, w: 0.6, h: 0.3, color: GREY, fontSize: 9, fontFace: FONT },
  });

  const puces = (items: string[], o: { color?: string; size?: number } = {}) =>
    items.filter(Boolean).map((t) => ({ text: nettoie(t), options: { bullet: { code: "2022", indent: 18 }, color: o.color ?? DARK, fontSize: o.size ?? 15, paraSpaceAfter: 8, breakLine: true, fontFace: FONT } }));

  // slide de contenu avec en-tête (surtitre + titre + filet cuivre)
  const slideContenu = (surtitre: string, titre: string) => {
    const s = pptx.addSlide({ masterName: "CONTENU" });
    if (surtitre) s.addText(surtitre.toUpperCase(), { x: 0.55, y: 0.42, w: 12.2, h: 0.3, fontSize: 12, color: COPPER, bold: true, charSpacing: 2, fontFace: FONT });
    s.addText(titre, { x: 0.55, y: 0.72, w: 12.2, h: 0.75, fontSize: 25, color: NAVY, bold: true, fontFace: FONT });
    s.addShape(RECT, { x: 0.57, y: 1.52, w: 1.1, h: 0.06, fill: { color: COPPER } });
    return s;
  };

  // ---------- 1. Couverture ----------
  {
    const s = pptx.addSlide();
    s.background = { color: NAVY };
    s.addShape(RECT, { x: 0, y: 0, w: 0.35, h: H, fill: { color: COPPER } });
    s.addText("CENTURY 21 · ICAZA IMMOBILIER — FORMATION INTERNE", { x: 0.9, y: 0.7, w: 11.5, h: 0.4, fontSize: 13, color: COPPER, bold: true, charSpacing: 2, fontFace: FONT });
    s.addText(module.titre, { x: 0.9, y: 2.1, w: 11.6, h: 1.6, fontSize: 44, color: WHITE, bold: true, fontFace: FONT });
    s.addText(animation.sousTitre || module.resume || "", { x: 0.95, y: 3.7, w: 11.3, h: 0.9, fontSize: 18, color: "CBD5E1", italic: true, fontFace: FONT });
    s.addShape(ROUND, { x: 0.95, y: 4.8, w: 2.3, h: 0.5, fill: { color: COPPER }, rectRadius: 0.1 });
    s.addText(`Niveau ${module.niveau}`, { x: 0.95, y: 4.8, w: 2.3, h: 0.5, fontSize: 12, color: WHITE, bold: true, align: "center", valign: "middle", fontFace: FONT });
    s.addShape(ROUND, { x: 3.4, y: 4.8, w: 2.6, h: 0.5, fill: { color: "1E3A56" }, rectRadius: 0.1 });
    s.addText(`${module.categorie} · ${module.duree}`, { x: 3.4, y: 4.8, w: 2.6, h: 0.5, fontSize: 12, color: "CBD5E1", bold: true, align: "center", valign: "middle", fontFace: FONT });
    s.addText("Animé par : ______________________        Date : ____________", { x: 0.95, y: 6.2, w: 11, h: 0.4, fontSize: 13, color: "94A3B8", fontFace: FONT });
    s.addNotes(["SUPPORT D'ANIMATION — conseils formateur :", ...animation.notesFormateur.map((n) => "• " + n)].join("\n"));
  }

  // ---------- 2. Objectifs ----------
  {
    const s = slideContenu("Formation", "Objectifs de la séance");
    s.addText(puces(animation.objectifs, { size: 17 }), { x: 0.7, y: 1.8, w: 11.9, h: 5, valign: "top" });
    s.addNotes("Annoncez les objectifs : ce que chacun saura FAIRE à la fin. Reliez-les au terrain.");
  }

  // ---------- 3. Au programme ----------
  {
    const s = slideContenu("Déroulé", "Au programme");
    let y = 1.85;
    for (const a of animation.agenda) {
      s.addShape(ROUND, { x: 0.7, y, w: 1.5, h: 0.5, fill: { color: COPPER_SOFT }, rectRadius: 0.08 });
      s.addText(a.duree, { x: 0.7, y, w: 1.5, h: 0.5, fontSize: 12, color: COPPER, bold: true, align: "center", valign: "middle", fontFace: FONT });
      s.addText(a.titre, { x: 2.4, y, w: 10, h: 0.5, fontSize: 15, color: DARK, valign: "middle", fontFace: FONT });
      y += 0.62;
      if (y > 6.7) break;
    }
    s.addNotes("Donnez le fil rouge de la séance et le timing. Prévenez qu'il y aura des jeux et de la pratique.");
  }

  // ---------- 4. Brise-glace ----------
  {
    const s = slideContenu("On démarre", `Brise-glace — ${animation.briseGlace.titre}`);
    s.addShape(ROUND, { x: 0.7, y: 1.8, w: 11.9, h: 4.8, fill: { color: LIGHT }, line: { color: COPPER, width: 1 }, rectRadius: 0.1 });
    s.addText("🎯 Consignes", { x: 1.0, y: 2.05, w: 11, h: 0.4, fontSize: 14, color: COPPER, bold: true, fontFace: FONT });
    s.addText(puces(animation.briseGlace.consignes), { x: 1.0, y: 2.5, w: 11.3, h: 3.9, valign: "top" });
    s.addNotes("Objectif : détendre, impliquer, révéler le niveau du groupe. Gardez un rythme vif.");
  }

  // ---------- 5. Divider apports ----------
  {
    const s = pptx.addSlide();
    s.background = { color: NAVY };
    s.addShape(RECT, { x: 0, y: 3.5, w: W, h: 0.06, fill: { color: COPPER } });
    s.addText("LES APPORTS", { x: 0.9, y: 2.7, w: 11.5, h: 0.5, fontSize: 16, color: COPPER, bold: true, charSpacing: 3, fontFace: FONT });
    s.addText("Le contenu clé du module", { x: 0.9, y: 3.7, w: 11.5, h: 0.8, fontSize: 30, color: WHITE, bold: true, fontFace: FONT });
  }

  // ---------- 6. Apports : une diapo par leçon ----------
  module.lecons.forEach((lec, i) => {
    const s = slideContenu(`Apport ${i + 1}/${module.lecons.length}`, lec.titre);
    s.addText(puces(pointsLecon(lec), { size: 16 }), { x: 0.7, y: 1.8, w: 11.9, h: 5, valign: "top" });
    s.addNotes("Développez chaque point à l'oral (le détail est dans le module texte). Illustrez par un exemple local, puis questionnez la salle.");
  });

  // ---------- 7. Jeux ----------
  animation.jeux.forEach((j, i) => {
    const s = slideContenu(`Jeu ${i + 1} · ${j.type} · ${j.duree}`, `🎲 ${j.titre}`);
    s.addShape(ROUND, { x: 0.7, y: 1.8, w: 11.9, h: 4.9, fill: { color: COPPER_SOFT }, rectRadius: 0.1 });
    s.addText("Règle du jeu", { x: 1.0, y: 2.0, w: 11, h: 0.4, fontSize: 14, color: COPPER, bold: true, fontFace: FONT });
    s.addText(puces(j.consignes, { size: 15 }), { x: 1.0, y: 2.45, w: 11.3, h: 4.0, valign: "top" });
    const notes = ["ANIMATION :", ...j.animation.map((a) => "• " + a)];
    if (j.corrige && j.corrige.length) notes.push("", "CORRIGÉ :", ...j.corrige.map((c) => "• " + c));
    s.addNotes(notes.join("\n"));
  });

  // ---------- 8. Jeux de rôle ----------
  animation.jeuxRole.forEach((jr) => {
    const s = slideContenu("Mise en situation", `🎭 Jeu de rôle — ${jr.titre}`);
    s.addText([{ text: "Contexte : ", options: { bold: true, color: NAVY } }, { text: jr.contexte, options: { color: DARK } }], { x: 0.7, y: 1.75, w: 11.9, h: 0.9, fontSize: 14, valign: "top", fontFace: FONT });
    s.addShape(ROUND, { x: 0.7, y: 2.8, w: 5.8, h: 2.6, fill: { color: LIGHT }, line: { color: NAVY, width: 1 }, rectRadius: 0.1 });
    s.addText("RÔLE A", { x: 0.9, y: 2.95, w: 5.4, h: 0.35, fontSize: 12, color: NAVY, bold: true, fontFace: FONT });
    s.addText(jr.roleA, { x: 0.9, y: 3.3, w: 5.4, h: 2.0, fontSize: 13, color: DARK, valign: "top", fontFace: FONT });
    s.addShape(ROUND, { x: 6.8, y: 2.8, w: 5.8, h: 2.6, fill: { color: COPPER_SOFT }, line: { color: COPPER, width: 1 }, rectRadius: 0.1 });
    s.addText("RÔLE B", { x: 7.0, y: 2.95, w: 5.4, h: 0.35, fontSize: 12, color: COPPER, bold: true, fontFace: FONT });
    s.addText(jr.roleB, { x: 7.0, y: 3.3, w: 5.4, h: 2.0, fontSize: 13, color: DARK, valign: "top", fontFace: FONT });
    s.addText([{ text: "Objectif : ", options: { bold: true, color: COPPER } }, { text: jr.objectif, options: { color: DARK } }], { x: 0.7, y: 5.6, w: 11.9, h: 0.8, fontSize: 14, valign: "top", fontFace: FONT });
    s.addNotes(["DÉBRIEF :", ...jr.debrief.map((d) => "• " + d)].join("\n"));
  });

  // ---------- 9. Quiz en direct ----------
  const quizLive = repartir(module.quiz, Math.min(6, module.quiz.length));
  if (quizLive.length) {
    const s = pptx.addSlide();
    s.background = { color: NAVY };
    s.addShape(RECT, { x: 0, y: 3.5, w: W, h: 0.06, fill: { color: COPPER } });
    s.addText("QUIZ EN DIRECT", { x: 0.9, y: 2.7, w: 11.5, h: 0.5, fontSize: 16, color: COPPER, bold: true, charSpacing: 3, fontFace: FONT });
    s.addText("On teste les acquis — en équipes !", { x: 0.9, y: 3.7, w: 11.5, h: 0.8, fontSize: 28, color: WHITE, bold: true, fontFace: FONT });
  }
  quizLive.forEach((q, i) => {
    const s = slideContenu(`Quiz ${i + 1}/${quizLive.length}`, q.question);
    const opts = q.options.map((o, oi) => `${lettre(oi)}.  ${o}`);
    s.addText(puces(opts, { size: 17 }).map((p) => ({ ...p, options: { ...p.options, bullet: false, paraSpaceAfter: 12 } })), { x: 0.9, y: 2.0, w: 11.5, h: 4.4, valign: "top" });
    s.addNotes(`Bonne réponse : ${lettre(q.correct)}. ${q.options[q.correct]}\n${q.explication}`);
  });

  // ---------- 10. Points clés ----------
  {
    const s = slideContenu("Synthèse", "Les points clés à retenir");
    s.addText(puces(animation.pointsCles, { size: 16 }), { x: 0.7, y: 1.8, w: 11.9, h: 5, valign: "top" });
    s.addNotes("Faites reformuler par les participants avant d'afficher. Ancrage = mémorisation.");
  }

  // ---------- 11. Plan d'action ----------
  {
    const s = slideContenu("On passe à l'action", "Dès demain, je…");
    let y = 1.9;
    for (const a of animation.planAction) {
      s.addShape(ROUND, { x: 0.7, y, w: 0.4, h: 0.4, fill: { color: WHITE }, line: { color: COPPER, width: 1.5 }, rectRadius: 0.05 });
      s.addText(nettoie(a), { x: 1.3, y: y - 0.05, w: 11.2, h: 0.5, fontSize: 15, color: DARK, valign: "middle", fontFace: FONT });
      y += 0.68;
      if (y > 6.6) break;
    }
    s.addNotes("Chacun choisit au moins 2 engagements et les note. Prévoyez un point de suivi dans 2 semaines.");
  }

  // ---------- 12. Clôture ----------
  {
    const s = pptx.addSlide();
    s.background = { color: NAVY };
    s.addShape(RECT, { x: 0, y: 0, w: 0.35, h: H, fill: { color: COPPER } });
    s.addText("Merci — et place au terrain ! 🚀", { x: 0.9, y: 2.9, w: 11.5, h: 1, fontSize: 34, color: WHITE, bold: true, fontFace: FONT });
    s.addText("CENTURY 21 Icaza Immobilier · Martigues — Formation interne", { x: 0.9, y: 4.1, w: 11.5, h: 0.5, fontSize: 14, color: "CBD5E1", fontFace: FONT });
  }

  await pptx.writeFile({ fileName: nomFichier(module.titre) });
}
