import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { APIResponse, Branch } from "@/lib/types";

import { errorToast, invalidationHelpers, queryKeys, successToast } from "./utils";

// Branch management hooks
export function useBranches(filters: { agentId?: string } = {}) {
  return useQuery({
    queryKey: queryKeys.branches.all(filters.agentId),
    queryFn: () => {
      const searchParams: Record<string, string> = {};
      if (filters.agentId) {
        searchParams.agentId = filters.agentId;
      }

      return api.get("branch", { searchParams }).json<APIResponse<Branch[]>>();
    },
  });
}

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
    mutationFn: (data: { id: string; name: string; location: string; agentId: string }) =>
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

export function useBranchById(id: string) {
  return useQuery({
    queryKey: queryKeys.branches.detail(id),
    queryFn: () => api.get(`branch/${id}`).json<APIResponse<Branch>>(),
    enabled: !!id,
  });
}
