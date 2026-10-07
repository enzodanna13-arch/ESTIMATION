// Client du CODE ADMIN. Le code validé est conservé en localStorage et revérifié
// au chargement (un simple booléen trafiqué ne suffit pas : le serveur doit
// accepter le code). Le mot de passe d'équipe autorise le POST.

import { getHistoryKey } from "./history";

const CLE_ADMIN = "estimation-admin-key";
const jsonHeaders = () => ({ "content-type": "application/json", "x-history-key": getHistoryKey() });

export function getAdminKey(): string {
  try { return localStorage.getItem(CLE_ADMIN) ?? ""; } catch { return ""; }
}
export function setAdminKey(code: string): void {
  try { localStorage.setItem(CLE_ADMIN, code); } catch { /* ignore */ }
}
export function clearAdminKey(): void {
  try { localStorage.removeItem(CLE_ADMIN); } catch { /* ignore */ }
}

async function poster(body: Record<string, unknown>): Promise<Record<string, unknown>> {
  try {
    const res = await fetch("/api/admin", { method: "POST", headers: jsonHeaders(), body: JSON.stringify(body) });
    if (!res.ok) return {};
    return (await res.json()) as Record<string, unknown>;
  } catch { return {}; }
}

// Un code admin est-il déjà configuré ?
export async function adminConfigure(): Promise<boolean> {
  return !!(await poster({ action: "etat" })).configure;
}
// Vérifie un code (déverrouillage).
export async function verifierCodeAdmin(code: string): Promise<boolean> {
  return !!(await poster({ action: "verifier", code })).ok;
}
// Définit / change le code admin (actuel = code admin courant ou mot de passe d'équipe).
export async function definirCodeAdmin(actuel: string, nouveau: string): Promise<{ ok: true } | { erreur: string }> {
  const r = await poster({ action: "definir", actuel, nouveau });
  if (r.ok) return { ok: true };
  return { erreur: typeof r.error === "string" ? r.error : "Impossible d'enregistrer le code." };
}
