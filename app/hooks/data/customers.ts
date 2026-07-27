import { mutationOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import z from "zod";

import { queryClient } from "@/components/query-provider";

import { api } from "@/lib/api";
import { enqueueOperation } from "@/lib/offline";
import { isOfflineMode } from "@/lib/offline-mode";
import type { APIResponse, Customer, UploadJob } from "@/lib/types";

import { errorToast, invalidationHelpers, queryKeys, successToast } from "./utils";

export const validateCustomerSearch = z
  .object({
    q: z.string(),
    branchId: z.string(),
    createdBefore: z.string(),
    createdAfter: z.string(),
    sortBy: z.string(),
    sortDirection: z.enum(["asc", "desc"]),
  })
  .partial();

export type CustomerSearchParams = z.infer<typeof validateCustomerSearch>;

function filterCustomers(customers: Customer[], searchParams?: CustomerSearchParams): Customer[] {
  let result = customers;
  if (searchParams?.q) {
    const q = searchParams.q.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phoneNumber.includes(q) ||
        c.accountNumber.toLowerCase().includes(q)
    );
  }
  if (searchParams?.branchId) {
    result = result.filter((c) => c.branch?.id === searchParams.branchId);
  }
  if (searchParams?.createdAfter) {
    const after = new Date(searchParams.createdAfter).getTime();
    result = result.filter((c) => new Date(c.createdAt).getTime() >= after);
  }
  if (searchParams?.createdBefore) {
    const before = new Date(searchParams.createdBefore).getTime();
    result = result.filter((c) => new Date(c.createdAt).getTime() <= before);
  }
  if (searchParams?.sortBy) {
    const dir = searchParams.sortDirection === "desc" ? -1 : 1;
    const key = searchParams.sortBy as keyof Customer;
    result = [...result].sort(
      (a, b) => String(a[key] ?? "").localeCompare(String(b[key] ?? "")) * dir
    );
  }
  return result;
}

export function useCustomers({ searchParams }: { searchParams?: CustomerSearchParams } = {}) {
  return useQuery({
    queryKey: queryKeys.customers.all(),
    queryFn: () => api.get("customer").json<APIResponse<Customer[]>>(),
    select: (data) => ({ ...data, data: filterCustomers(data.data, searchParams) }),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Customer> & { branchId: string }) => {
      if (isOfflineMode()) {
        return Promise.reject(Object.assign(new Error("offline"), { isOffline: true }));
      }
      return api.post("customer", { json: data }).json<APIResponse<Customer>>();
    },
    onSuccess: () => {
      invalidationHelpers.customers.related().forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      successToast("Customer created successfully");
    },
    onError: (error: any, variables) => {
      if (error.isOffline || isOfflineMode() || !navigator.onLine) {
        enqueueOperation({
          url: "customer",
          method: "POST",
          body: JSON.stringify(variables),
          idempotencyKey: crypto.randomUUID(),
          label: `New Customer – ${variables.name ?? ""}`,
          queuedAt: Date.now(),
        });
        toast.info("You're offline — customer will be created when connection is restored");
        return;
      }
      errorToast(error);
    },
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
    mutationFn: (ids: string[]) => api.delete("customer", { json: { ids } }).json<APIResponse<unknown>>(),
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
  placeholderData: (): APIResponse<Customer> | undefined => {
    const all = queryClient.getQueryData<APIResponse<Customer[]>>(queryKeys.customers.all());
    const found = all?.data.find((c) => c.id === id);
    return found ? { msg: "ok", data: found } : undefined;
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
