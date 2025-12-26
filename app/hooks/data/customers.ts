import { mutationOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";

import { queryClient } from "@/components/query-provider";

import { api } from "@/lib/api";
import type { APIResponse, Customer } from "@/lib/types";

import { errorToast, invalidationHelpers, queryKeys, successToast } from "./utils";

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

export const uploadCustomersOptions = mutationOptions({
  mutationFn: async (data: { file: File; branchId: string }) => {
    const formData = new FormData();
    formData.append("file", data.file);

    return api
      .post(`data/customer-upload?branchId=${data.branchId}`, { body: formData })
      .json<APIResponse<{ success: number; failed: number }>>();
  },
  onSuccess: (response) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() });
    successToast(`${response.data.success} customers uploaded successfully`);
  },
  onError: errorToast,
});

export const downloadStatementOptions = mutationOptions({
  mutationFn: async (data: { customerId: string; startDate?: string; endDate?: string }) => {
    const searchParams: Record<string, string> = { customerId: data.customerId };
    if (data.startDate) searchParams.startDate = data.startDate;
    if (data.endDate) searchParams.endDate = data.endDate;

    const blob = await api.get("data/account-statement", { searchParams }).blob();

    // Trigger browser download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `statement-${data.customerId}-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    return { success: true };
  },
  onSuccess: () => {
    successToast("Statement downloaded successfully");
  },
  onError: errorToast,
});
