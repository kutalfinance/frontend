import { mutationOptions, queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";

import { api } from "@/lib/api";
import type { APIResponse, Branch } from "@/lib/types";

import { errorToast, invalidationHelpers, queryKeys, successToast } from "./utils";

export const validateBranchSearch = z
  .object({
    q: z.string(),
    location: z.string(),
    agentId: z.string(),
    createdBefore: z.string(), // date-time
    createdAfter: z.string(), // date-time
    sortBy: z.string(),
    sortDirection: z.enum(["asc", "desc"]),
  })
  .partial();

export type BranchSearchParams = z.infer<typeof validateBranchSearch>;

// Branch management hooks
export function useBranchesAdmin({ searchParams }: { searchParams?: BranchSearchParams } = {}) {
  return useQuery({
    queryKey: queryKeys.branches.filters(searchParams),
    queryFn: () => {
      return api.get("branch", { searchParams }).json<APIResponse<Branch[]>>();
    },
  });
}

export const branchByAgent = queryOptions({
  queryKey: queryKeys.branches.agent(),
  queryFn: () => api.get("branch/agent").json<APIResponse<Branch>>(),
});

export function useCreateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; location: string; agentId: string }) =>
      api.post("branch", { json: data }).json<APIResponse<Branch>>(),
    onSuccess: () => {
      invalidationHelpers.branches.related().forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      successToast("Branch created successfully");
    },
    onError: errorToast,
  });
}

export function useUpdateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; name: string; location: string; agentId?: string }) =>
      api.patch(`branch/${data.id}`, { json: data }).json<APIResponse<Branch>>(),
    onSuccess: () => {
      invalidationHelpers.branches.related().forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      successToast("Branch updated successfully");
    },
    onError: errorToast,
  });
}

export function useDeleteBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.delete("branch", { searchParams: { id } }).json<APIResponse<unknown>>(),
    onSuccess: () => {
      invalidationHelpers.branches.related().forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      successToast("Branch deleted successfully");
    },
    onError: errorToast,
  });
}

export const branchByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: queryKeys.branches.detail(id),
    queryFn: () => api.get(`branch/${id}`).json<APIResponse<Branch>>(),
    enabled: !!id,
  });

export const downloadBranchDailyReportOptions = mutationOptions({
  mutationFn: async (data: { branchId: string; reportDate?: string }) => {
    const searchParams: Record<string, string> = { branchId: data.branchId };
    if (data.reportDate) searchParams.reportDate = data.reportDate;

    const blob = await api.get("data/branch-daily-report", { searchParams }).blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `branch-report-${data.reportDate || new Date().toISOString().split("T")[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    return { success: true };
  },
  onSuccess: () => {
    successToast("Branch daily report downloaded successfully");
  },
  onError: errorToast,
});
