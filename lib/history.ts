import type { EstimateResponse, PropertyInput } from "./types";

// Historique local des estimations (IndexedDB, sur le poste du négociateur —
// rien n'est envoyé sur un serveur). Deux magasins : « meta » (liste légère
// affichée sur l'accueil) et « full » (dossier complet avec photos, chargé
// uniquement à l'ouverture).

export interface HistoryMeta {
  id: string;
  createdAt: number;
  client: string;
  bien: string;
  ville: string;
  fourchetteBasse: number;
  fourchetteHaute: number;
}

export interface HistoryFull extends HistoryMeta {
  result: EstimateResponse;
  input: PropertyInput;
}

const DB_NAME = "estimation-ia";
const META = "meta";
const FULL = "full";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(META)) db.createObjectStore(META, { keyPath: "id" });
      if (!db.objectStoreNames.contains(FULL)) db.createObjectStore(FULL, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function done(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function saveEstimation(entry: HistoryFull): Promise<void> {
  const db = await openDb();
  const tx = db.transaction([META, FULL], "readwrite");
  const { result: _r, input: _i, ...meta } = entry;
  tx.objectStore(META).put(meta);
  tx.objectStore(FULL).put(entry);
  await done(tx);
  db.close();
}

export async function listEstimations(): Promise<HistoryMeta[]> {
  const db = await openDb();
  const tx = db.transaction(META, "readonly");
  const req = tx.objectStore(META).getAll();
  const rows = await new Promise<HistoryMeta[]>((resolve, reject) => {
    req.onsuccess = () => resolve((req.result as HistoryMeta[]) ?? []);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return rows.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getEstimation(id: string): Promise<HistoryFull | null> {
  const db = await openDb();
  const tx = db.transaction(FULL, "readonly");
  const req = tx.objectStore(FULL).get(id);
  const row = await new Promise<HistoryFull | null>((resolve, reject) => {
    req.onsuccess = () => resolve((req.result as HistoryFull) ?? null);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return row;
}

export async function deleteEstimation(id: string): Promise<void> {
  const db = await openDb();
  const tx = db.transaction([META, FULL], "readwrite");
  tx.objectStore(META).delete(id);
  tx.objectStore(FULL).delete(id);
  await done(tx);
  db.close();
}
