/**
 * Offline infrastructure — sync queue only.
 * Data caching is handled by React Query's persist-client (localStorage).
 *
 * The IDB sync queue holds write operations recorded while offline so they
 * can be flushed when connectivity returns (via Background Sync or manual trigger).
 * The offline-misc store is kept for the service worker's sw-auth-token.
 */
import { type IDBPDatabase, openDB } from "idb";

const DB_NAME = "kss-offline";
const DB_VERSION = 2;

const QUEUE_STORE = "sync-queue";
const MISC_STORE = "offline-misc"; // read by service worker for Background Sync auth

export interface QueuedOperation {
  id?: number;
  url: string;
  method: string;
  body: string;
  idempotencyKey: string;
  label: string;
  queuedAt: number;
}

let _db: IDBPDatabase | null = null;

async function getDb() {
  if (!_db) {
    _db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore(QUEUE_STORE, { keyPath: "id", autoIncrement: true });
        }
        if (oldVersion < 2) {
          db.createObjectStore(MISC_STORE, { keyPath: "key" });
        }
      },
    });
  }
  return _db;
}

export async function enqueueOperation(op: Omit<QueuedOperation, "id">) {
  const db = await getDb();
  await db.add(QUEUE_STORE, op);
  window.dispatchEvent(new Event("kss:queue-updated"));
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((reg) => {
        if ("sync" in reg)
          return (
            reg as unknown as { sync: { register(tag: string): Promise<void> } }
          ).sync.register("kss-queue-sync");
      })
      .catch(() => {});
  }
}

export async function dequeueOperation(id: number) {
  const db = await getDb();
  await db.delete(QUEUE_STORE, id);
  window.dispatchEvent(new Event("kss:queue-updated"));
}

export async function getQueuedOperations(): Promise<QueuedOperation[]> {
  const db = await getDb();
  return db.getAll(QUEUE_STORE);
}

export async function getQueueCount(): Promise<number> {
  const db = await getDb();
  return db.count(QUEUE_STORE);
}
