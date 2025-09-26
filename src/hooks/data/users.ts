import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { type APIResponse, type AdminMetrics, type User, UserRoles } from "@/lib/types";

import { errorToast, invalidationHelpers, queryKeys, successToast } from "./utils";

// User management hooks
export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.all(),
    queryFn: () => api.get("user").json<APIResponse<User[]>>(),
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) =>
      api.post("user/admin", { json: data }).json<APIResponse<unknown>>(),
    onSuccess: () => {
      invalidationHelpers.users.related().forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      successToast("An OTP has been sent to your email");
    },
    onError: errorToast,
  });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) =>
      api.post("user/agent", { json: data }).json<APIResponse<unknown>>(),
    onSuccess: () => {
      invalidationHelpers.users.related().forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      successToast("Agent created successfully");
    },
    onError: errorToast,
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRoles }) => {
      const PATH = role === UserRoles.ADMIN ? `user/admin/${id}` : `user/agent/${id}`;
      return api.delete(PATH).json<APIResponse<unknown>>();
    },
    onSuccess: () => {
      invalidationHelpers.users.related().forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      successToast("Admin deleted successfully");
    },
    onError: errorToast,
  });
}

export function useAdminMetrics() {
  return useQuery({
    queryKey: queryKeys.metrics.admin(),
    queryFn: () => api.get("user/admin/metrics").json<APIResponse<AdminMetrics>>(),
  });
}
