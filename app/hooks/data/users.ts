import { mutationOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";

import { api } from "@/lib/api";
import { getOfflineCustomers } from "@/lib/offline";
import { isOfflineMode } from "@/lib/offline-mode";
import {
  type APIResponse,
  type AdminMetrics,
  type AgentMetrics,
  type Customer,
  type User,
  UserRoles,
} from "@/lib/types";

import { errorToast, invalidationHelpers, queryKeys, successToast } from "./utils";

export const validateUserSearch = z
  .object({
    q: z.string(),
    role: z.enum(UserRoles),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    superAdmin: z.boolean(),
    approver: z.boolean(),
    hasNoBranch: z.boolean(),
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

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      name: string;
      email: string;
      isApprover?: boolean;
      isSuperAdmin?: boolean;
    }) => api.patch(`user/${id}`, { json: data }).json<APIResponse<User>>(),
    onSuccess: () => {
      invalidationHelpers.users.related().forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      successToast("User updated successfully");
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
      successToast("User(s) deactivated successfully");
    },
    onError: errorToast,
  });
}

export function useRestoreUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (users: string[]) => {
      return api.post("user/reactivate", { json: { ids: users } }).json<APIResponse<unknown>>();
    },
    onSuccess: () => {
      invalidationHelpers.users.related().forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      successToast("User(s) restored successfully");
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

export function useAgentMetrics() {
  return useQuery({
    queryKey: queryKeys.metrics.agent(),
    queryFn: async () => {
      if (isOfflineMode()) {
        const customers = await getOfflineCustomers();
        return {
          msg: "ok",
          data: {
            totalCustomers: customers.length,
            totalCustomersVisitedToday: 0,
            totalCustomersVisitedThisWeek: 0,
            totalNewCustomersToday: 0,
            totalNewCustomersThisWeek: 0,
            totalDepositsToday: 0,
            totalDepositsThisWeek: 0,
            totalWithdrawalsApprovedToday: 0,
            totalWithdrawalsApprovedThisWeek: 0,
            totalWithdrawalsPending: 0,
          } as AgentMetrics,
        } as APIResponse<AgentMetrics>;
      }
      return api.get("user/agent/metrics").json<APIResponse<AgentMetrics>>();
    },
  });
}

export const downloadAgentDailyReportOptions = mutationOptions({
  mutationFn: async (data: { agentId: string; reportDate?: string }) => {
    const searchParams: Record<string, string> = { agentId: data.agentId };
    if (data.reportDate) searchParams.reportDate = data.reportDate;

    const blob = await api.get("data/agent-daily-report", { searchParams }).blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agent-report-${data.reportDate || new Date().toISOString().split("T")[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    return { success: true };
  },
  onSuccess: () => {
    successToast("Agent daily report downloaded successfully");
  },
  onError: errorToast,
});

export const downloadAdminDailyReportOptions = mutationOptions({
  mutationFn: async (data: { reportDate?: string }) => {
    const searchParams: Record<string, string> = {};
    if (data.reportDate) searchParams.reportDate = data.reportDate;

    const blob = await api.get("data/admin-daily-report", { searchParams }).blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-report-${data.reportDate || new Date().toISOString().split("T")[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    return { success: true };
  },
  onSuccess: () => {
    successToast("Admin daily report downloaded successfully");
  },
  onError: errorToast,
});
