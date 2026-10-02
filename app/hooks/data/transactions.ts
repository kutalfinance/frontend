import { keepPreviousData, mutationOptions, queryOptions } from "@tanstack/react-query";
import z from "zod";

import { queryClient } from "@/components/query-provider";

import { api } from "@/lib/api";
import type { APIResponse, PagedResponse, Transaction, TransactionMetrics } from "@/lib/types";

import { errorToast, queryKeys, successToast } from "./utils";

export const validateTransactionsSearch = z
  .object({
    q: z.string(),
    customerId: z.string(),
    userId: z.string(),
    recordedBefore: z.string(),
    recordedAfter: z.string(),
    type: z.enum(["DEPOSIT", "WITHDRAWAL", "SERVICE_CHARGE", "OPENING_BALANCE", "REVERSAL"]),
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
    queryFn: () =>
      api
        .get("transaction", { searchParams: searchParams ?? {} })
        .json<APIResponse<Transaction[]>>(),
  });

export const PAGED_TRANSACTIONS_PAGE_SIZE = 20;

export const pagedTransactionsQueryOptions = ({
  searchParams,
  page,
}: {
  searchParams?: TransactionsSearchParams;
  page: number;
}) =>
  queryOptions({
    queryKey: [...queryKeys.transactions.filters(searchParams), "paged", page] as const,
    queryFn: () =>
      api
        .get("transaction/paged", {
          searchParams: { ...searchParams, page, size: PAGED_TRANSACTIONS_PAGE_SIZE },
        })
        .json<APIResponse<PagedResponse<Transaction>>>(),
    placeholderData: keepPreviousData,
  });

export const createWithdrawalOptions = mutationOptions({
  mutationFn: ({
    idempotencyKey,
    ...data
  }: {
    customerId: string;
    amount?: number;
    serviceCharge?: number;
    idempotencyKey: string;
  }) => {
    const body: { customerId: string; amount?: number; serviceCharge?: number } = {
      customerId: data.customerId,
    };
    if (data.amount !== undefined) body.amount = data.amount;
    if (data.serviceCharge !== undefined) body.serviceCharge = data.serviceCharge;
    return api
      .post("transaction/withdraw", { json: body, headers: { "Idempotency-Key": idempotencyKey } })
      .json<APIResponse<Transaction>>();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() });
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() });
    successToast("Withdrawal request initiated");
  },
  onError: errorToast,
});

export const createDepositOptions = mutationOptions({
  mutationFn: ({
    idempotencyKey,
    ...data
  }: {
    customerId: string;
    amount?: number;
    idempotencyKey: string;
  }) =>
    api
      .post("transaction/deposit", { json: data, headers: { "Idempotency-Key": idempotencyKey } })
      .json<APIResponse<Transaction>>(),
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
    queryFn: () =>
      api.get("transaction/metrics", { searchParams }).json<APIResponse<TransactionMetrics>>(),
  });

export const reverseTransactionOptions = mutationOptions({
  mutationFn: (transactionId: string) =>
    api.post(`transaction/${transactionId}/reverse`).json<APIResponse<Transaction>>(),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() });
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() });
    successToast("Transaction reversed successfully");
  },
  onError: errorToast,
});
