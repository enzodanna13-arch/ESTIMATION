// Déclenche le téléchargement d'une sauvegarde complète (.zip) de tout le
// stockage partagé, via l'API protégée par le mot de passe d'équipe.
import { getHistoryKey } from "./history";

export async function telechargerSauvegarde(): Promise<void> {
  const res = await fetch("/api/backup", {
    cache: "no-store",
    headers: { "x-history-key": getHistoryKey() },
  });
  if (res.status === 401) throw new Error("Déverrouillez d'abord l'espace avec le mot de passe d'équipe.");
  if (!res.ok) throw new Error("Sauvegarde impossible — réessayez.");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const d = new Date();
  a.href = url;
  a.download = `sauvegarde-estimation-ia-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
