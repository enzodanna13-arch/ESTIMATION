import { getHistoryKey } from "@/lib/history";
import { enhanceLocal, type EnhanceOptions } from "./localEnhance";
import type { EditRequest, EditResult, ImageData } from "./types";

// Service de retouche photo — SEULE porte d'entrée utilisée par l'UI.
// L'interface reste stable même si le moteur IA change : « Embellir » tourne
// en local (canvas), « Vider la pièce » et « Meubler » passent par la route
// serveur /api/retouche qui, elle, choisit le fournisseur IA branché.

async function appelServeur(req: EditRequest): Promise<EditResult> {
  try {
    const res = await fetch("/api/retouche", {
      method: "POST",
      headers: { "content-type": "application/json", "x-history-key": getHistoryKey() },
      body: JSON.stringify(req),
    });
    if (res.status === 401) return { ok: false, error: "Accès réservé — reconnectez-vous." };
    const body = (await res.json()) as EditResult;
    if (res.status === 501 || body.notConfigured) {
      return { ok: false, notConfigured: true, error: body.error ?? "Moteur IA de génération non encore connecté." };
    }
    if (!res.ok || !body.ok) return { ok: false, error: body.error ?? "Génération impossible." };
    return body;
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Réseau indisponible." };
  }
}

export const imageEditingService = {
  // Amélioration « qualité photographe » : d'abord le moteur IA (rendu pro),
  // repli automatique sur le traitement local instantané si l'IA n'est pas
  // disponible ou échoue — ainsi « Embellir » fonctionne toujours.
  async enhanceImage(image: ImageData, options?: EnhanceOptions): Promise<EditResult> {
    const ia = await appelServeur({ action: "enhance", image });
    if (ia.ok && ia.image) return ia;
    const local = await enhanceLocal(image, options);
    return local.ok ? { ...local, provider: "local-enhance (repli)" } : local;
  },

  // Amélioration locale uniquement (instantanée, sans coût)
  async enhanceLocalOnly(image: ImageData, options?: EnhanceOptions): Promise<EditResult> {
    return enhanceLocal(image, options);
  },

  // Pièce vidée de son mobilier (moteur IA serveur)
  async emptyRoom(image: ImageData): Promise<EditResult> {
    return appelServeur({ action: "emptyRoom", image });
  },

  // Home staging virtuel (moteur IA serveur)
  async virtualStaging(image: ImageData, style: string, roomType: string): Promise<EditResult> {
    return appelServeur({ action: "virtualStaging", image, style, roomType });
  },
};

export type { EditResult, ImageData, EnhanceOptions };
