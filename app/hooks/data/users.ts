import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";

import { api } from "@/lib/api";
import { type APIResponse, type AdminMetrics, type User, UserRoles } from "@/lib/types";

import { errorToast, invalidationHelpers, queryKeys, successToast } from "./utils";

export const validateUserSearch = z
  .object({
    q: z.string(),
    role: z.enum(UserRoles),
    isActive: z.boolean(),
    isDeactivated: z.boolean(),
    createdBefore: z.string(), // date-time
    createdAfter: z.string(), // date-time
    sortBy: z.string(),
    sortDirection: z.enum(["asc", "desc"]),
  })
  .partial();

export type UserSearchParams = z.infer<typeof validateUserSearch>;

// User management hooks
export function useUsers({ searchParams }: { searchParams?: UserSearchParams } = {}) {
  return useQuery({
    queryKey: queryKeys.users.filters(searchParams),
    queryFn: () => api.get("user", { searchParams }).json<APIResponse<User[]>>(),
    /* queryFn: async () => {
      return axiosApi
        .get<APIResponse<User[]>>("user", { params: searchParams })
        .then((res) => res.data);
    }, */
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
      successToast("Admin created successfully");
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

export function useDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (users: string[]) => {
      return api.delete("user/deactivate", { json: { ids: users } }).json<APIResponse<unknown>>();
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

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (users: string[]) => {
      return api.delete("user", { json: { ids: users } }).json<APIResponse<unknown>>();
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
