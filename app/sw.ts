/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Cache the app shell (navigation requests) so the app loads offline
registerRoute(
  new NavigationRoute(
    new NetworkFirst({
      cacheName: "kss-shell",
      networkTimeoutSeconds: 3,
      plugins: [new CacheableResponsePlugin({ statuses: [200] })],
    })
  )
);

// Cache API responses as a secondary offline fallback
registerRoute(
  /\/api\/v1\//,
  new NetworkFirst({
    cacheName: "kss-api",
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({ maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 }),
    ],
  })
);

// ─── Background Sync ──────────────────────────────────────────────────────────
// When the device regains connectivity (even with no open tab), the browser
// fires a `sync` event here. We flush the IndexedDB queue directly using
// the auth token mirrored there by auth-token.ts.

const DB_NAME = "kss-offline";
const DB_VERSION = 2;
const QUEUE_STORE = "sync-queue";
const MISC_STORE = "offline-misc";
const API_BASE = `${import.meta.env.VITE_API_URL ?? "http://localhost:8080"}/api/v1`;

interface SyncEvent extends Event {
  readonly tag: string;
  waitUntil(f: Promise<unknown>): void;
}

interface QueuedOp {
  id: number;
  url: string;
  method: string;
  body: string;
  idempotencyKey: string;
}

function idbOpen(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbGetAll<T>(db: IDBDatabase, store: string): Promise<T[]> {
  return new Promise((resolve) => {
    const req = db.transaction(store, "readonly").objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => resolve([]);
  });
}

function idbGet<T>(db: IDBDatabase, store: string, key: IDBValidKey): Promise<T | undefined> {
  return new Promise((resolve) => {
    const req = db.transaction(store, "readonly").objectStore(store).get(key);
    req.onsuccess = () => resolve((req.result as { value: T } | undefined)?.value);
    req.onerror = () => resolve(undefined);
  });
}

function idbDelete(db: IDBDatabase, store: string, key: IDBValidKey): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = db.transaction(store, "readwrite").objectStore(store).delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function flushQueue(): Promise<void> {
  const db = await idbOpen();
  const token = await idbGet<string>(db, MISC_STORE, "sw-auth-token");
  const queue = await idbGetAll<QueuedOp>(db, QUEUE_STORE);

  if (queue.length === 0) return;

  for (const op of queue) {
    const res = await fetch(`${API_BASE}/${op.url}`, {
      method: op.method,
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": op.idempotencyKey,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: op.body,
    });

    if (res.ok || (res.status >= 400 && res.status < 500)) {
      // Success or permanent client error (4xx) — remove from queue; retrying won't help
      await idbDelete(db, QUEUE_STORE, op.id);
    } else {
      // 5xx server error — stop and let the browser retry the sync later
      throw new Error(`Sync failed for op ${op.id}: HTTP ${res.status}`);
    }
  }
}

self.addEventListener("sync", (event) => {
  const syncEvent = event as SyncEvent;
  if (syncEvent.tag === "kss-queue-sync") {
    syncEvent.waitUntil(flushQueue());
  }
});
