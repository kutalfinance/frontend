/**
 * Offline session preparation.
 *
 * When an agent taps "Go Offline" we snapshot everything the agent side of the
 * app needs into the React Query cache (persisted to localStorage by
 * query-provider). Customer search/filtering and per-customer transaction
 * views are all client-side over these bulk lists, so once the snapshot is in
 * place the full agent surface works without a connection:
 *
 * - logged-in user   → layout/auth guards
 * - branch           → agent dashboard + customers page (suspense query)
 * - customers (all)  → search, list, and customer detail (placeholderData)
 * - transactions     → per-customer history, pending list, metrics placeholder
 * - agent metrics    → dashboard cards, customers-page count badge
 *
 * Writes made while offline are queued in IndexedDB (lib/offline.ts) and
 * flushed when the agent goes back online (lib/sync-queue.ts, wired in root).
 */
import { queryClient } from "@/components/query-provider";

import { loggedInUserQueryOptions } from "@/hooks/auth/common";
import { branchByAgent } from "@/hooks/data/branches";
import { agentMetricsQueryOptions } from "@/hooks/data/users";
import { queryKeys } from "@/hooks/data/utils";
import { api } from "@/lib/api";
import type { APIResponse, Customer, Transaction } from "@/lib/types";

export async function downloadOfflineData(): Promise<void> {
  await Promise.all([
    queryClient.fetchQuery(loggedInUserQueryOptions),
    queryClient.fetchQuery(branchByAgent),
    queryClient.fetchQuery({
      queryKey: queryKeys.customers.all(),
      queryFn: () => api.get("customer").json<APIResponse<Customer[]>>(),
    }),
    queryClient.fetchQuery({
      queryKey: queryKeys.transactions.all(),
      queryFn: () => api.get("transaction").json<APIResponse<Transaction[]>>(),
    }),
    queryClient.fetchQuery(agentMetricsQueryOptions),
  ]);
}
