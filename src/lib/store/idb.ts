import type { StateStorage } from "zustand/middleware";

/**
 * Armazenamento mínimo em IndexedDB para o modo demonstração.
 * Usado pelas galerias criadas no painel, porque as fotos enviadas
 * (em data URL) não cabem no limite de ~5 MB do localStorage.
 */
const DB_NAME = "megga-demo";
const STORE = "kv";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

const available = () => typeof indexedDB !== "undefined";

export const idbStorage: StateStorage = {
  async getItem(name) {
    if (!available()) return null;
    const value = await run<string | undefined>("readonly", (s) => s.get(name));
    return value ?? null;
  },
  async setItem(name, value) {
    if (!available()) return;
    await run("readwrite", (s) => s.put(value, name));
  },
  async removeItem(name) {
    if (!available()) return;
    await run("readwrite", (s) => s.delete(name));
  },
};
