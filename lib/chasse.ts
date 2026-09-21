export type { FicheChasse } from "./serverChasse";
export { STATUTS_CHASSE } from "./serverChasse";
import type { FicheChasse } from "./serverChasse";
import { getHistoryKey } from "./history";

const headers = () => ({ "x-history-key": getHistoryKey() });
const jsonHeaders = () => ({ "content-type": "application/json", "x-history-key": getHistoryKey() });

export const STATUT_CHASSE_COULEURS: Record<string, string> = {
  "À contacter": "bg-amber-100 text-amber-700",
  Contacté: "bg-cyan-100 text-cyan-700",
  "À visiter": "bg-violet-100 text-violet-700",
  Visité: "bg-indigo-100 text-indigo-700",
  "Estimation faite": "bg-emerald-100 text-emerald-700",
  "Mandat en cours": "bg-teal-200 text-teal-800",
  "Offre en cours": "bg-green-100 text-green-700",
  Écarté: "bg-slate-100 text-slate-500",
};

export interface ResultatExtraction {
  bloque: boolean;
  source: string;
  fiche: Partial<FicheChasse>;
  message?: string;
}

export async function extraireAnnonce(params: { url?: string; texte?: string }): Promise<ResultatExtraction> {
  const res = await fetch("/api/chasse/extract", {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const d = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(d.error || "Lecture de l'annonce impossible");
  }
  return (await res.json()) as ResultatExtraction;
}

// Téléverse des photos (fichiers image) et renvoie leurs URL publiques.
export async function uploadPhotosChasse(ficheId: string, images: { nom: string; data: string }[]): Promise<string[]> {
  const res = await fetch("/api/chasse/upload", {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ ficheId, images }),
  });
  if (!res.ok) {
    const d = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(d.error || "Import des photos impossible");
  }
  const body = (await res.json()) as { urls: string[] };
  return body.urls ?? [];
}

// Lit un fichier image en base64 (préfixe data: inclus).
export function fichierEnBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Lecture du fichier impossible"));
    r.readAsDataURL(file);
  });
}

export async function listChasse(): Promise<FicheChasse[]> {
  const res = await fetch("/api/chasse", { cache: "no-store", headers: headers() });
  if (!res.ok) return [];
  const body = (await res.json()) as { fiches?: FicheChasse[] };
  return body.fiches ?? [];
}

export async function saveChasse(fiche: Partial<FicheChasse>): Promise<FicheChasse> {
  const res = await fetch("/api/chasse", {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ fiche }),
  });
  if (!res.ok) throw new Error("Enregistrement impossible");
  const body = (await res.json()) as { fiche: FicheChasse };
  return body.fiche;
}

export async function deleteChasse(id: string): Promise<void> {
  await fetch(`/api/chasse/${encodeURIComponent(id)}`, { method: "DELETE", headers: headers() });
}

export interface Positionnement {
  trouve: boolean;
  message?: string;
  marcheM2?: number;
  valeur?: number;
  basse?: number;
  haute?: number;
  ecartPct?: number | null;
  nbVentes?: number;
}

export async function estimerMarche(p: { codePostal: string; ville: string; surface: number; typeBien: string; prixAffiche: number }): Promise<Positionnement> {
  const res = await fetch("/api/chasse/marche", { method: "POST", headers: jsonHeaders(), body: JSON.stringify(p) });
  if (!res.ok) {
    const d = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(d.error || "Estimation marché impossible");
  }
  return (await res.json()) as Positionnement;
}

export interface AcquereurMatch {
  id: string; nom: string; prenom: string; tel: string; email: string;
  budget: number | null; ville: string; negociateur: string; statut: string; typeProjet: string;
}

export async function rapprocherAcquereurs(p: { ville: string; codePostal: string; prixAffiche: number }): Promise<AcquereurMatch[]> {
  const res = await fetch("/api/chasse/acquereurs", { method: "POST", headers: jsonHeaders(), body: JSON.stringify(p) });
  if (!res.ok) return [];
  const body = (await res.json()) as { acquereurs?: AcquereurMatch[] };
  return body.acquereurs ?? [];
}
