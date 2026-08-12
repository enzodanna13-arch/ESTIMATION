// Retouche photo immobilière — types partagés client / serveur et abstraction
// du moteur IA. L'interface ImageEditingProvider permet de brancher n'importe
// quel fournisseur (Replicate, Stability, Gemini Image…) sans toucher l'UI.

export type EditAction = "enhance" | "emptyRoom" | "virtualStaging";

export interface ImageData {
  mediaType: string; // ex. image/jpeg
  data: string; // base64 (sans préfixe data:)
}

// Styles de décoration proposés pour le home staging virtuel
export interface StyleDeco {
  id: string;
  label: string;
  description: string;
  // Dégradé de la vignette (rendu rapide, sans image externe)
  swatch: [string, string];
  prompt: string; // fragment de prompt pour le moteur IA
}

export const STYLES_DECO: StyleDeco[] = [
  { id: "moderne", label: "Moderne", description: "Lignes épurées, matériaux actuels", swatch: ["#3a3f47", "#8a929c"], prompt: "modern interior design, clean lines, contemporary furniture, neutral palette" },
  { id: "contemporain", label: "Contemporain", description: "Élégant et intemporel", swatch: ["#4b4e57", "#b7a99a"], prompt: "contemporary interior design, elegant timeless furniture, balanced tones" },
  { id: "scandinave", label: "Scandinave", description: "Bois clair, blanc, chaleureux", swatch: ["#e8e2d8", "#c9b79c"], prompt: "scandinavian interior design, light wood, white walls, cozy minimal furniture, natural light" },
  { id: "industriel", label: "Industriel", description: "Métal, brique, esprit loft", swatch: ["#3b3634", "#7d6a5b"], prompt: "industrial interior design, exposed brick, metal and leather furniture, loft style" },
  { id: "minimaliste", label: "Minimaliste", description: "Sobre, espaces dégagés", swatch: ["#f2f1ee", "#c4c2bd"], prompt: "minimalist interior design, very few furniture pieces, uncluttered, monochrome, calm" },
  { id: "boheme", label: "Bohème", description: "Textiles, plantes, esprit chaleureux", swatch: ["#b5764f", "#d8b98c"], prompt: "bohemian interior design, layered textiles, plants, warm eclectic decor, rattan" },
  { id: "mediterraneen", label: "Méditerranéen", description: "Tons chauds, matières naturelles", swatch: ["#d9a066", "#7fa7a0"], prompt: "mediterranean interior design, warm earthy tones, natural materials, terracotta, airy" },
  { id: "classique", label: "Classique chic", description: "Raffiné, mobilier élégant", swatch: ["#3d3a4e", "#c2a878"], prompt: "classic chic interior design, refined elegant furniture, moldings, sophisticated palette" },
  { id: "luxe", label: "Luxe", description: "Matières nobles, haut de gamme", swatch: ["#2b2b2f", "#c9a15a"], prompt: "luxury interior design, high-end materials, marble, brass accents, designer furniture" },
  { id: "japandi", label: "Japandi", description: "Zen japonais + scandinave", swatch: ["#cabfb0", "#6f6a60"], prompt: "japandi interior design, japanese-scandinavian fusion, low wood furniture, muted natural tones, zen" },
];

// Types de pièces (le mobilier proposé est adapté au type)
export interface RoomType {
  id: string;
  label: string;
  prompt: string;
}

export const ROOM_TYPES: RoomType[] = [
  { id: "salon", label: "Salon", prompt: "living room with sofa, coffee table, rug, lighting" },
  { id: "sam", label: "Salle à manger", prompt: "dining room with dining table, chairs, sideboard" },
  { id: "cuisine", label: "Cuisine", prompt: "kitchen staging with tasteful accessories, keep fixed cabinets" },
  { id: "chambre", label: "Chambre", prompt: "bedroom with bed, nightstands, wardrobe, soft lighting" },
  { id: "chambre_enfant", label: "Chambre enfant", prompt: "child bedroom with small bed, playful yet tasteful furniture" },
  { id: "bureau", label: "Bureau", prompt: "home office with desk, chair, shelving" },
  { id: "sdb", label: "Salle de bain", prompt: "bathroom staging with towels and decor, keep fixed sanitary equipment" },
  { id: "entree", label: "Entrée", prompt: "entrance hall with console, mirror, coat storage" },
  { id: "terrasse", label: "Terrasse", prompt: "terrace with outdoor furniture, plants" },
  { id: "autre", label: "Autre", prompt: "tasteful furniture adapted to the room" },
];

export interface EditRequest {
  action: EditAction;
  image: ImageData;
  style?: string; // id d'un StyleDeco (ou "auto" pour laisser l'IA choisir)
  roomType?: string; // id d'un RoomType
}

export interface EditResult {
  ok: boolean;
  image?: ImageData; // image transformée
  error?: string;
  notConfigured?: boolean; // aucun fournisseur IA branché pour cette action
  provider?: string; // nom du fournisseur ayant produit le résultat
}

// Abstraction du moteur IA : implémentée par un fournisseur concret
// (côté serveur). Changer de fournisseur = changer cette implémentation,
// sans rien modifier dans l'interface.
export interface ImageEditingProvider {
  name: string;
  enhanceImage(req: EditRequest): Promise<EditResult>;
  emptyRoom(req: EditRequest): Promise<EditResult>;
  virtualStaging(req: EditRequest): Promise<EditResult>;
}
