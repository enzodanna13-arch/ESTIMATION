// Kits d'animation de formation (un par module) : objectifs, déroulé minuté,
// brise-glace, jeux interactifs, jeux de rôle, points-clés, plan d'action et
// notes pour le formateur. Servent à générer le support PowerPoint d'animation
// (réservé au profil manager). Les données sont renseignées dans ANIMATIONS.

export interface JeuAnimation {
  titre: string;
  type: string;
  duree: string;
  consignes: string[];
  animation: string[];
  corrige?: string[];
}
export interface JeuRole {
  titre: string;
  contexte: string;
  roleA: string;
  roleB: string;
  objectif: string;
  debrief: string[];
}
export interface ExempleTerrain { titre: string; texte: string; }
export interface FaqStagiaire { question: string; reponse: string; }

export interface AnimationModule {
  id: string;
  sousTitre: string;
  objectifs: string[];
  agenda: { titre: string; duree: string }[];
  briseGlace: { titre: string; consignes: string[] };
  jeux: JeuAnimation[];
  jeuxRole: JeuRole[];
  pointsCles: string[];
  planAction: string[];
  notesFormateur: string[];
  // Complément GUIDE FORMATEUR (optionnel — affiché seulement dans la version formateur).
  materiel?: string[];
  messagesCles?: string[];
  scriptOuverture?: string;
  questionsPublic?: string[];
  exemplesTerrain?: ExempleTerrain[];
  objectionsStagiaires?: FaqStagiaire[];
  erreursFrequentes?: string[];
  chiffresCles?: string[];
}

// Rempli automatiquement (voir ANIMATIONS_DATA ci-dessous).
import { ANIMATIONS_DATA } from "./formationAnimationData";

export const ANIMATIONS: Record<string, AnimationModule> = ANIMATIONS_DATA;

export function getAnimation(id: string): AnimationModule | null {
  return ANIMATIONS[id] ?? null;
}
