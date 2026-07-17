import { api } from "./api";
import { dequeueOperation, getQueuedOperations, type QueuedOperation } from "./offline";

export type SyncStartedDetail = { ops: QueuedOperation[] };
export type SyncItemResultDetail = { id: number; success: boolean };
export type SyncCompleteDetail = { flushed: number; failed: number };

export async function flushSyncQueue() {
  const queue = await getQueuedOperations();
  if (queue.length === 0) return;

  window.dispatchEvent(
    new CustomEvent<SyncStartedDetail>("kss:sync-started", { detail: { ops: queue } })
  );

  let flushed = 0;
  let failed = 0;

  for (const op of queue) {
    try {
      await api(op.url, {
        method: op.method,
        json: JSON.parse(op.body),
        headers: { "Idempotency-Key": op.idempotencyKey },
      });
      await dequeueOperation(op.id!);
      flushed++;
      window.dispatchEvent(
        new CustomEvent<SyncItemResultDetail>("kss:sync-item-result", {
          detail: { id: op.id!, success: true },
        })
      );
    } catch {
      failed++;
      window.dispatchEvent(
        new CustomEvent<SyncItemResultDetail>("kss:sync-item-result", {
          detail: { id: op.id!, success: false },
        })
      );
    }
  }

  window.dispatchEvent(
    new CustomEvent<SyncCompleteDetail>("kss:sync-complete", { detail: { flushed, failed } })
  );
}
