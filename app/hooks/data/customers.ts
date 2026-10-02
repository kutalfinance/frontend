import {
  keepPreviousData,
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import z from "zod";

import { queryClient } from "@/components/query-provider";

import { api } from "@/lib/api";
import type { APIResponse, Customer, PagedResponse, UploadJob } from "@/lib/types";

import { errorToast, invalidationHelpers, queryKeys, successToast } from "./utils";

export const validateCustomerSearch = z
  .object({
    q: z.string(),
    branchId: z.string(),
    createdBefore: z.string(),
    createdAfter: z.string(),
    lastDepositAfter: z.string(),
    sortBy: z.string(),
    sortDirection: z.enum(["asc", "desc"]),
    hasPendingWithdrawal: z.enum(["true"]),
  })
  .partial();

export type CustomerSearchParams = z.infer<typeof validateCustomerSearch>;

/** Unpaginated, server-filtered. Only for bounded sets (e.g. one branch's customers). */
export function useCustomers({ searchParams }: { searchParams?: CustomerSearchParams } = {}) {
  return useQuery({
    queryKey: queryKeys.customers.filters(searchParams),
    queryFn: () =>
      api.get("customer", { searchParams: searchParams ?? {} }).json<APIResponse<Customer[]>>(),
  });
}

export const CUSTOMERS_PAGE_SIZE = 20;

export const pagedCustomersQueryOptions = ({
  searchParams,
  page,
  size = CUSTOMERS_PAGE_SIZE,
}: {
  searchParams?: CustomerSearchParams;
  page: number;
  size?: number;
}) =>
  queryOptions({
    queryKey: [...queryKeys.customers.filters(searchParams), "paged", page, size],
    queryFn: () =>
      api
        .get("customer/paged", { searchParams: { ...searchParams, page, size } })
        .json<APIResponse<PagedResponse<Customer>>>(),
    placeholderData: keepPreviousData,
  });

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

export function useDeleteCustomers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      api.delete("customer", { json: { ids } }).json<APIResponse<unknown>>(),
    onSuccess: () => {
      invalidationHelpers.customers.related().forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      successToast("Customer(s) deleted successfully");
    },
    onError: errorToast,
  });
}

export function useMoveCustomers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { ids: string[]; targetBranchId: string }) =>
      api.post("customer/move", { json: data }).json<APIResponse<unknown>>(),
    onSuccess: () => {
      invalidationHelpers.customers.related().forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      successToast("Customers moved successfully");
    },
    onError: errorToast,
  });
}

export const customerByIdQueryOptions = (id: string) => ({
  queryKey: queryKeys.customers.detail(id),
  queryFn: () => api.get(`customer/${id}`).json<APIResponse<Customer>>(),
  enabled: !!id,
  // Show the row from any customer list already in the cache while the detail loads.
  placeholderData: (): APIResponse<Customer> | undefined => {
    const lists = queryClient.getQueriesData<APIResponse<Customer[] | PagedResponse<Customer>>>({
      queryKey: queryKeys.customers.all(),
    });
    for (const [, res] of lists) {
      const rows = Array.isArray(res?.data) ? res.data : res?.data?.items;
      const found = rows?.find((c) => c.id === id);
      if (found) return { msg: "ok", data: found };
    }
    return undefined;
  },
});

export const uploadCustomersOptions = mutationOptions({
  mutationFn: async (data: { file: File; branchId: string }) => {
    const formData = new FormData();
    formData.append("file", data.file);

    return api
      .post(`data/customer-upload?branchId=${data.branchId}`, { body: formData })
      .json<APIResponse<string>>();
  },
});

export function useUploadStatus(jobId: string | null) {
  return useQuery({
    queryKey: ["upload-status", jobId],
    queryFn: () => api.get(`data/upload-status/${jobId}`).json<APIResponse<UploadJob>>(),
    enabled: !!jobId,
    retry: 2,
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      if (status === "DONE" || status === "FAILED") return false;
      if (query.state.error) return false;
      return 2000;
    },
  });
}

export const downloadStatementOptions = mutationOptions({
  mutationFn: async (data: { customerId: string; startDate?: string; endDate?: string }) => {
    const searchParams: Record<string, string> = { customerId: data.customerId };
    if (data.startDate) searchParams.startDate = data.startDate;
    if (data.endDate) searchParams.endDate = data.endDate;

    const blob = await api.get("data/account-statement", { searchParams }).blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `statement-${data.customerId}-${Date.now()}.pdf`;
    try {
      document.body.appendChild(a);
      a.click();
    } finally {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }

    return { success: true };
  },
  onSuccess: () => {
    successToast("Statement downloaded successfully");
  },
  onError: errorToast,
});

export const downloadStatementCsvOptions = mutationOptions({
  mutationFn: async (data: { customerId: string; startDate?: string; endDate?: string }) => {
    const searchParams: Record<string, string> = { customerId: data.customerId };
    if (data.startDate) searchParams.startDate = data.startDate;
    if (data.endDate) searchParams.endDate = data.endDate;

    const blob = await api.get("data/account-statement/csv", { searchParams }).blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `statement-${data.customerId}-${Date.now()}.csv`;
    try {
      document.body.appendChild(a);
      a.click();
    } finally {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }

    return { success: true };
  },
  onSuccess: () => successToast("CSV downloaded successfully"),
  onError: errorToast,
});
