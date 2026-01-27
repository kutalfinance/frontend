import { mutationOptions, queryOptions } from "@tanstack/react-query";
import z from "zod";

import { queryClient } from "@/components/query-provider";

import { api } from "@/lib/api";
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

export const transactionsQueryOptions = ({
  searchParams,
}: {
  searchParams?: TransactionsSearchParams;
}) =>
  queryOptions({
    queryKey: queryKeys.transactions.filters(searchParams),
    queryFn: () => api.get("transaction", { searchParams }).json<APIResponse<Transaction[]>>(),
  });

export const createWithdrawalOptions = mutationOptions({
  mutationFn: (data: { customerId: string; amount?: number }) =>
    api.post("transaction/withdraw", { json: data }).json<APIResponse<Transaction>>(),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() });
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() });
    successToast("Withdrawal recorded successfully");
  },
  onError: errorToast,
});

export const createDepositOptions = mutationOptions({
  mutationFn: (data: { customerId: string; amount?: number }) =>
    api.post("transaction/deposit", { json: data }).json<APIResponse<Transaction>>(),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() });
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() });
    successToast("Deposit recorded successfully");
  },
  onError: errorToast,
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

const validateMetricsSearch = validateTransactionsSearch.pick({ customerId: true });
type TransactionsMetricsSearchParams = z.infer<typeof validateMetricsSearch>;

export const transactionsMetricsOptions = ({
  searchParams,
}: {
  searchParams: TransactionsMetricsSearchParams;
}) =>
  queryOptions({
    queryKey: queryKeys.transactions.metrics(searchParams),
    queryFn: () =>
      api.get("transaction/metrics", { searchParams }).json<APIResponse<TransactionMetrics>>(),
  });
