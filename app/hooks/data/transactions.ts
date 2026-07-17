import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import z from "zod";

import { queryClient } from "@/components/query-provider";

import { api } from "@/lib/api";
import { enqueueOperation, getOfflineTransactions, syncTransactionsOffline } from "@/lib/offline";
import { isOfflineMode } from "@/lib/offline-mode";
import { TransactionTypes } from "@/lib/types";
import type { APIResponse, Transaction, TransactionMetrics } from "@/lib/types";

import { errorToast, queryKeys, successToast } from "./utils";

export const validateTransactionsSearch = z
  .object({
    q: z.string(),
    customerId: z.string(),
    userId: z.string(),
    recordedBefore: z.string(), // date-time
    recordedAfter: z.string(), // date-time
    type: z.enum(["DEPOSIT", "WITHDRAWAL", "SERVICE_CHARGE"]),
    status: z.enum(["COMPLETED", "REJECTED", "PENDING", "FAILED"]),
    sortBy: z.string(),
    sortDirection: z.enum(["asc", "desc"]),
  })
  .partial();

export type TransactionsSearchParams = z.infer<typeof validateTransactionsSearch>;

function filterTransactionsOffline(
  transactions: Transaction[],
  searchParams?: TransactionsSearchParams
): Transaction[] {
  let result = transactions;
  if (searchParams?.customerId) {
    result = result.filter((t) => t.customer.id === searchParams.customerId);
  }
  if (searchParams?.type) {
    result = result.filter((t) => t.type === searchParams.type);
  }
  if (searchParams?.status) {
    result = result.filter((t) => t.status === searchParams.status);
  }
  if (searchParams?.q) {
    const q = searchParams.q.toLowerCase();
    result = result.filter((t) => t.customer.name.toLowerCase().includes(q));
  }
  return result;
}

export const transactionsQueryOptions = ({
  searchParams,
}: {
  searchParams?: TransactionsSearchParams;
}) =>
  queryOptions({
    queryKey: queryKeys.transactions.filters(searchParams),
    queryFn: async () => {
      if (isOfflineMode()) {
        const all = await getOfflineTransactions();
        return { msg: "ok", data: filterTransactionsOffline(all, searchParams) } as APIResponse<
          Transaction[]
        >;
      }
      return api.get("transaction", { searchParams }).json<APIResponse<Transaction[]>>();
    },
  });

export const createWithdrawalOptions = mutationOptions({
  mutationFn: ({
    idempotencyKey,
    customerName: _customerName,
    ...data
  }: {
    customerId: string;
    amount?: number;
    idempotencyKey: string;
    customerName?: string;
  }) => {
    if (isOfflineMode()) {
      return Promise.reject(Object.assign(new Error("offline"), { isOffline: true }));
    }
    const body: { customerId: string; amount?: number } = { customerId: data.customerId };
    if (data.amount !== undefined) body.amount = data.amount;
    return api
      .post("transaction/withdraw", { json: body, headers: { "Idempotency-Key": idempotencyKey } })
      .json<APIResponse<Transaction>>();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() });
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() });
    syncTransactionsOffline().catch(() => {});
    successToast("Withdrawal request initiated");
  },
  onError: (error: any, variables) => {
    if (error.isOffline || isOfflineMode()) {
      enqueueOperation({
        url: "transaction/withdraw",
        method: "POST",
        body: JSON.stringify({ customerId: variables.customerId, amount: variables.amount }),
        idempotencyKey: variables.idempotencyKey,
        label: `Withdrawal – ${variables.customerName ?? ""}`.trim().replace(/–\s*$/, ""),
        queuedAt: Date.now(),
      });
      toast.info("You're offline — withdrawal queued and will sync automatically");
      return;
    }
    errorToast(error);
  },
});

export const createDepositOptions = mutationOptions({
  mutationFn: ({
    idempotencyKey,
    customerName: _customerName,
    ...data
  }: {
    customerId: string;
    amount?: number;
    idempotencyKey: string;
    customerName?: string;
  }) => {
    if (isOfflineMode()) {
      return Promise.reject(Object.assign(new Error("offline"), { isOffline: true }));
    }
    return api
      .post("transaction/deposit", { json: data, headers: { "Idempotency-Key": idempotencyKey } })
      .json<APIResponse<Transaction>>();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() });
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() });
    syncTransactionsOffline().catch(() => {});
    successToast("Deposit recorded successfully");
  },
  onError: (error: any, variables) => {
    if (error.isOffline || isOfflineMode()) {
      const name = variables.customerName ? ` – ${variables.customerName}` : "";
      enqueueOperation({
        url: "transaction/deposit",
        method: "POST",
        body: JSON.stringify({ customerId: variables.customerId, amount: variables.amount }),
        idempotencyKey: variables.idempotencyKey,
        label: `Deposit${name}`,
        queuedAt: Date.now(),
      });
      toast.info("You're offline — deposit queued and will sync automatically");
      return;
    }
    errorToast(error);
  },
});

export const pendingApprovalsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.transactions.pendingApprovals(),
    queryFn: () => api.get("transaction/pending-approvals").json<APIResponse<Transaction[]>>(),
  });

export const approveTransactionOptions = mutationOptions({
  mutationFn: (transactionId: string) =>
    api.patch(`transaction/${transactionId}/approve`).json<APIResponse<Transaction>>(),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() });
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() });
    successToast("Transaction approved successfully");
  },
  onError: errorToast,
});

export const rejectTransactionOptions = mutationOptions({
  mutationFn: (transactionId: string) =>
    api.patch(`transaction/${transactionId}/reject`).json<APIResponse<Transaction>>(),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() });
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() });
    successToast("Transaction rejected successfully");
  },
  onError: errorToast,
});

const validateMetricsSearch = validateTransactionsSearch.pick({ customerId: true }).extend({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
type TransactionsMetricsSearchParams = z.infer<typeof validateMetricsSearch>;

export const transactionsMetricsOptions = ({
  searchParams,
}: {
  searchParams: TransactionsMetricsSearchParams;
}) =>
  queryOptions({
    queryKey: queryKeys.transactions.metrics(searchParams),
    queryFn: async () => {
      if (isOfflineMode()) {
        const all = await getOfflineTransactions();
        let filtered = searchParams.customerId
          ? all.filter((t) => t.customer.id === searchParams.customerId)
          : all;
        if (searchParams.startDate) {
          const start = new Date(searchParams.startDate).getTime();
          filtered = filtered.filter((t) => new Date(t.createdAt).getTime() >= start);
        }
        if (searchParams.endDate) {
          const end = new Date(searchParams.endDate + "T23:59:59").getTime();
          filtered = filtered.filter((t) => new Date(t.createdAt).getTime() <= end);
        }
        const completed = (type: TransactionTypes) =>
          filtered
            .filter((t) => t.type === type && t.status === "COMPLETED")
            .reduce((sum, t) => sum + t.amount, 0);
        const totalDeposited = completed(TransactionTypes.DEPOSIT);
        const totalWithdrawn = completed(TransactionTypes.WITHDRAWAL);
        const totalCharged = completed(TransactionTypes.SERVICE_CHARGE);
        return {
          msg: "ok",
          data: {
            totalDeposited,
            totalWithdrawn,
            totalCharged,
            balance: totalDeposited - totalWithdrawn - totalCharged,
          } as TransactionMetrics,
        } as APIResponse<TransactionMetrics>;
      }
      return api
        .get("transaction/metrics", { searchParams })
        .json<APIResponse<TransactionMetrics>>();
    },
  });
