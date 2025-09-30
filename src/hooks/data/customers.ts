import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { APIResponse, Customer } from "@/lib/types";

import { errorToast, invalidationHelpers, queryKeys, successToast } from "./utils";

// Customer management hooks
export function useCustomers() {
  return useQuery({
    queryKey: queryKeys.customers.all(),
    queryFn: () => api.get("customer").json<APIResponse<Customer[]>>(),
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

export function useCustomerById(id: string) {
  return useSuspenseQuery(customerByIdQueryOptions(id));
}
