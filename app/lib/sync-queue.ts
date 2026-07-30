import { HTTPError } from "ky";

import { api } from "./api";
import { type QueuedOperation, dequeueOperation, getQueuedOperations } from "./offline";

export type SyncStartedDetail = { ops: QueuedOperation[] };
export type SyncItemResultDetail = { id: number; success: boolean };
export type SyncCompleteDetail = { flushed: number; failed: number };

export async function flushSyncQueue(): Promise<SyncCompleteDetail> {
  const queue = await getQueuedOperations();
  if (queue.length === 0) return { flushed: 0, failed: 0 };

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
    } catch (error) {
      // Permanent client errors (4xx) are dequeued — retrying can't succeed.
      // Network/5xx failures stay queued for the next flush (matches sw.ts).
      const status = error instanceof HTTPError ? error.response.status : 0;
      if (status >= 400 && status < 500) {
        await dequeueOperation(op.id!);
      }
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
  return { flushed, failed };
}
