/**
 * Offline infrastructure — all in one place:
 *   1. IndexedDB   (sync queue + data cache)
 *   2. Sync        (full prefetch + partial post-mutation syncs)
 *
 * Offline detection: use `isOfflineMode()` from lib/offline-mode — agents toggle manually.
 * Data is kept fresh automatically: on agent layout mount and every 5 min (while online).
 */
import { type IDBPDatabase, openDB } from "idb";

import { api } from "./api";
import { isOfflineMode } from "./offline-mode";
import type { APIResponse, Branch, Customer, Transaction, User } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// 1. IndexedDB
// ─────────────────────────────────────────────────────────────────────────────

const DB_NAME = "kss-offline";
const DB_VERSION = 2;

const QUEUE_STORE = "sync-queue"; // write ops queued while offline
const CUSTOMERS_STORE = "offline-customers";
const TRANSACTIONS_STORE = "offline-transactions";
const MISC_STORE = "offline-misc"; // key-value: user, branch

export interface QueuedOperation {
  id?: number;
  url: string;
  method: string;
  body: string; // JSON-stringified payload
  idempotencyKey: string;
  label: string; // e.g. "Deposit – Kwame Mensah"
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
          db.createObjectStore(CUSTOMERS_STORE, { keyPath: "id" });
          db.createObjectStore(TRANSACTIONS_STORE, { keyPath: "id" });
          db.createObjectStore(MISC_STORE, { keyPath: "key" });
        }
      },
    });
  }
  return _db;
}

// Sync queue ──────────────────────────────────────────────────────────────────

export async function enqueueOperation(op: Omit<QueuedOperation, "id">) {
  const db = await getDb();
  await db.add(QUEUE_STORE, op);
  window.dispatchEvent(new Event("kss:queue-updated"));
  // Register a Background Sync tag so the browser can flush the queue even if
  // the tab is closed when connectivity returns.
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((reg) => {
        if ("sync" in reg) return (reg as unknown as { sync: { register(tag: string): Promise<void> } }).sync.register("kss-queue-sync");
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

// Customer cache ──────────────────────────────────────────────────────────────

export async function saveOfflineCustomers(customers: Customer[]) {
  const db = await getDb();
  const tx = db.transaction(CUSTOMERS_STORE, "readwrite");
  await tx.store.clear();
  await Promise.all(customers.map((c) => tx.store.put(c)));
  await tx.done;
}

export async function getOfflineCustomers(): Promise<Customer[]> {
  const db = await getDb();
  return db.getAll(CUSTOMERS_STORE);
}

export async function getOfflineCustomerById(id: string): Promise<Customer | undefined> {
  const db = await getDb();
  return db.get(CUSTOMERS_STORE, id);
}

// Transaction cache ───────────────────────────────────────────────────────────

export async function saveOfflineTransactions(transactions: Transaction[]) {
  const db = await getDb();
  const tx = db.transaction(TRANSACTIONS_STORE, "readwrite");
  await tx.store.clear();
  await Promise.all(transactions.map((t) => tx.store.put(t)));
  await tx.done;
}

export async function getOfflineTransactions(): Promise<Transaction[]> {
  const db = await getDb();
  return db.getAll(TRANSACTIONS_STORE);
}

// Misc key-value store (user, branch) ─────────────────────────────────────────

export async function saveMisc(key: string, value: unknown) {
  const db = await getDb();
  await db.put(MISC_STORE, { key, value });
}

export async function getMisc<T = unknown>(key: string): Promise<T | undefined> {
  const db = await getDb();
  const record = await db.get(MISC_STORE, key);
  return record?.value as T | undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Sync
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Full sync — downloads everything the agent needs offline.
 * Called on agent layout mount and every 5 minutes while online.
 * Silently ignored if the network is unavailable.
 */
export async function syncOfflineData(): Promise<void> {
  if (isOfflineMode()) return;

  const [userRes, branchRes, customersRes, transactionsRes] = await Promise.all([
    api.get("user/me").json<APIResponse<User>>(),
    api.get("branch").json<APIResponse<Branch[]>>(),
    api.get("customer").json<APIResponse<Customer[]>>(),
    api.get("transaction").json<APIResponse<Transaction[]>>(),
  ]);

  await Promise.all([
    saveMisc("user-me", userRes),
    saveMisc("branch", { ...branchRes, data: branchRes.data[0] ?? null }),
    saveOfflineCustomers(customersRes.data),
    saveOfflineTransactions(transactionsRes.data),
  ]);
}

/**
 * Partial sync — refreshes only transactions after a deposit/withdrawal.
 * Faster than a full sync; keeps IDB consistent after writes.
 */
export async function syncTransactionsOffline(): Promise<void> {
  if (isOfflineMode()) return;
  const res = await api.get("transaction").json<APIResponse<Transaction[]>>();
  await saveOfflineTransactions(res.data);
}
