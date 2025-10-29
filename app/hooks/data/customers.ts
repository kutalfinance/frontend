import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import z from "zod";

import { api } from "@/lib/api";
import type { APIResponse, Contribution, Customer } from "@/lib/types";

import { errorToast, invalidationHelpers, queryKeys, successToast } from "./utils";
import { queryClient } from "@/components/query-provider";

export const validateCustomerSearch = z
  .object({
    q: z.string(),
    branchId: z.string(),
    createdBefore: z.string(), // date-time
    createdAfter: z.string(), // date-time
    sortBy: z.string(),
    sortDirection: z.enum(["asc", "desc"]),
  })
  .partial();

export type CustomerSearchParams = z.infer<typeof validateCustomerSearch>;

// Customer management hooks
export function useCustomers({ searchParams }: { searchParams?: CustomerSearchParams } = {}) {
  return useQuery({
    queryKey: queryKeys.customers.filters(searchParams),
    queryFn: () => {
      return api.get("customer", { searchParams }).json<APIResponse<Customer[]>>();
    },
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Customer> & { branchId: string }) =>
      api.post("customer", { json: data }).json<APIResponse<Customer>>(),
    onSuccess: () => {
      invalidationHelpers.customers.related().forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      successToast("Customer created successfully");
    },
    onError: errorToast,
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Customer> & { id: string }) =>
      api.patch(`customer/${data.id}`, { json: data }).json<APIResponse<Customer>>(),
    onSuccess: () => {
      invalidationHelpers.customers.related().forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      successToast("Customer updated successfully");
    },
    onError: errorToast,
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`customer/${id}`).json<APIResponse<unknown>>(),
    onSuccess: () => {
      invalidationHelpers.customers.related().forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      successToast("Customer deleted successfully");
    },
    onError: errorToast,
  });
}

export const customerByIdQueryOptions = (id: string) => ({
  queryKey: queryKeys.customers.detail(id),
  queryFn: () => api.get(`customer/${id}`).json<APIResponse<Customer>>(),
  enabled: !!id,
});

// Contributions

export const validateContributionsSearch = z
  .object({
    q: z.string(),
    customerId: z.string(),
    userId: z.string(),
    recordedBefore: z.string(), // date-time
    recordedAfter: z.string(), // date-time
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
    queryKey: queryKeys.customers.contributions(searchParams),
    queryFn: () => api.get("contribution", { searchParams }).json<APIResponse<Contribution[]>>(),
  });

export const createWithdrawalOptions = mutationOptions({
  mutationFn: (data: { customerId: string; amount: number }) =>
    api.post("contribution/withdrawal", { json: data }).json<APIResponse<Contribution>>(),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() });
    successToast("Withdrawal recorded successfully");
  },
});

export const createDepositOptions = mutationOptions({
  mutationFn: (data: { customerId: string; amount: number }) =>
    api.post("contribution/deposit", { json: data }).json<APIResponse<Contribution>>(),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() });
    successToast("Deposit recorded successfully");
  },
});
