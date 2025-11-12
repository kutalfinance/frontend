import { mutationOptions, queryOptions } from "@tanstack/react-query";
import z from "zod";

import { queryClient } from "@/components/query-provider";

import { api } from "@/lib/api";
import type { APIResponse, Contribution } from "@/lib/types";

import { queryKeys, successToast } from "./utils";

export const validateContributionsSearch = z
  .object({
    q: z.string(),
    customerId: z.string(),
    userId: z.string(),
    recordedBefore: z.string(), // date-time
    recordedAfter: z.string(), // date-time
    contributionType: z.enum(["DEPOSIT", "WITHDRAWAL"]),
    sortBy: z.string(),
    sortDirection: z.enum(["asc", "desc"]),
  })
  .partial();

export type ContributionsSearchParams = z.infer<typeof validateContributionsSearch>;

export const contributionsQueryOptions = ({
  searchParams,
}: {
  searchParams?: ContributionsSearchParams;
}) =>
  queryOptions({
    queryKey: queryKeys.contributions.filters(searchParams),
    queryFn: () => api.get("contribution", { searchParams }).json<APIResponse<Contribution[]>>(),
  });

export const createWithdrawalOptions = mutationOptions({
  mutationFn: (data: { customerId: string; amount: number }) =>
    api.post("contribution/withdraw", { json: data }).json<APIResponse<Contribution>>(),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.contributions.all() });
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() });
    successToast("Withdrawal recorded successfully");
  },
});

export const createDepositOptions = mutationOptions({
  mutationFn: (data: { customerId: string; amount: number }) =>
    api.post("contribution/deposit", { json: data }).json<APIResponse<Contribution>>(),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.contributions.all() });
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() });
    successToast("Deposit recorded successfully");
  },
});

const validateMetricsSearch = validateContributionsSearch.pick({ customerId: true });
type ContributionsMetricsSearchParams = z.infer<typeof validateMetricsSearch>;

export const contributionsMetricsOptions = ({
  searchParams,
}: {
  searchParams: ContributionsMetricsSearchParams;
}) =>
  queryOptions({
    queryKey: queryKeys.contributions.metrics(searchParams),
    queryFn: () =>
      api
        .get("contribution/metrics", { searchParams })
        .json<APIResponse<{ totalDeposited: number; totalWithdrawn: number; net: number }>>(),
  });
