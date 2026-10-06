// Client du service TRANSACTIONS (ventes réalisées). Tout passe par l'API
// protégée par le mot de passe d'équipe.

export type { Transaction, PieceTransaction } from "./serverTransactions";
export { CATEGORIES_TRANSACTION } from "./serverTransactions";
import type { Transaction } from "./serverTransactions";
import { getHistoryKey } from "./history";

const headers = () => ({ "x-history-key": getHistoryKey() });
const jsonHeaders = () => ({ "content-type": "application/json", "x-history-key": getHistoryKey() });

export async function listTransactions(): Promise<Transaction[]> {
  const res = await fetch("/api/transactions", { cache: "no-store", headers: headers() });
  if (!res.ok) return [];
  return ((await res.json()) as { transactions?: Transaction[] }).transactions ?? [];
}

export async function createTransaction(t: Partial<Transaction>): Promise<Transaction | null> {
  const res = await fetch("/api/transactions", { method: "POST", headers: jsonHeaders(), body: JSON.stringify(t) });
  if (!res.ok) return null;
  return ((await res.json()) as { transaction?: Transaction }).transaction ?? null;
}

export async function updateTransaction(id: string, patch: Partial<Transaction>): Promise<Transaction | null> {
  const res = await fetch(`/api/transactions/${encodeURIComponent(id)}`, { method: "PUT", headers: jsonHeaders(), body: JSON.stringify(patch) });
  if (!res.ok) return null;
  return ((await res.json()) as { transaction?: Transaction }).transaction ?? null;
}

export async function deleteTransaction(id: string): Promise<boolean> {
  const res = await fetch(`/api/transactions/${encodeURIComponent(id)}`, { method: "DELETE", headers: headers() });
  return res.ok;
}

// Téléverse un PDF directement vers le Blob, puis enregistre la pièce.
export async function ajouterPieceTransaction(id: string, fichier: Blob, nom: string, categorie: string): Promise<Transaction | null> {
  const { upload } = await import("@vercel/blob/client");
  const fileId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const pathname = `transactions/files/${id.replace(/[^a-z0-9-]/gi, "")}/${fileId}.pdf`;
  try {
    await upload(pathname, fichier, { access: "public", contentType: "application/pdf", handleUploadUrl: "/api/clients/blob-upload", clientPayload: getHistoryKey(), multipart: true });
  } catch (e) {
    const m = e instanceof Error ? e.message : "";
    if (/too large|file length|maximum|size/i.test(m)) throw new Error("Ce PDF est trop lourd pour être envoyé. Réduis-le puis réessaie.");
    throw e;
  }
  const res = await fetch(`/api/transactions/${encodeURIComponent(id)}/files`, {
    method: "POST", headers: jsonHeaders(), body: JSON.stringify({ fileId, nom, categorie }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Enregistrement de la pièce impossible");
  }
  return ((await res.json()) as { transaction?: Transaction }).transaction ?? null;
}

export async function telechargerPieceTransaction(id: string, fileId: string, nom: string): Promise<void> {
  const res = await fetch(`/api/transactions/${encodeURIComponent(id)}/files/${encodeURIComponent(fileId)}`, { headers: headers() });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ? `Téléchargement impossible — ${body.error}` : "Téléchargement impossible");
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = nom || "piece.pdf"; a.click();
  URL.revokeObjectURL(url);
}

export async function supprimerPieceTransaction(id: string, fileId: string): Promise<Transaction | null> {
  const res = await fetch(`/api/transactions/${encodeURIComponent(id)}/files/${encodeURIComponent(fileId)}`, { method: "DELETE", headers: headers() });
  if (!res.ok) return null;
  return ((await res.json()) as { transaction?: Transaction }).transaction ?? null;
}

export async function renommerPieceTransaction(id: string, fileId: string, nom: string, categorie?: string): Promise<Transaction | null> {
  const res = await fetch(`/api/transactions/${encodeURIComponent(id)}/files/${encodeURIComponent(fileId)}`, {
    method: "PATCH", headers: jsonHeaders(), body: JSON.stringify({ nom, ...(categorie !== undefined ? { categorie } : {}) }),
  });
  if (!res.ok) return null;
  return ((await res.json()) as { transaction?: Transaction }).transaction ?? null;
}
