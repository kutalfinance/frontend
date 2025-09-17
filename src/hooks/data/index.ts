import { useNavigate } from "@tanstack/react-router";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { authToken } from "@/lib/auth-token";
import type {
  APIResponse,
  AdminMetrics,
  AgentLogin,
  Branch,
  Customer,
  ResetPassword,
  SendPasswordResetLink,
  User,
  VerifyOtp,
} from "@/lib/types";

import { errorToast, invalidationHelpers, queryKeys, successToast } from "./utils";

// ========== AUTH MODULE START ==========
export function useLoggedInUser() {
  const navigate = useNavigate();

  return useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: async () => {
      try {
        return await api.get("user/me").json<APIResponse<User>>();
      } catch (e) {
        navigate({ to: "/auth" });
        authToken.clear();
        return;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      authToken.clear();
      queryClient.clear();
    },
    onSuccess: () => {
      successToast("Logged out successfully");
      navigate({ to: "/auth/u/login" });
    },
    onError: errorToast,
  });
}

// Auth admin
export function useAdminAuthInitialize() {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      superAdmin: boolean;
    }) => api.post("user/admin/init", { json: data }).json<APIResponse<unknown>>(),
    onSuccess: () => {
      successToast("An OTP has been sent to your email");
    },
    onError: errorToast,
  });
}

export function useAdminAuthOTP() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: { otp: string; email: string }) =>
      api.post("user/admin/verify-otp", { json: data }).json<APIResponse<{ token: string }>>(),
    onSuccess: (response) => {
      authToken.set(response.data.token);
      successToast("Logged in successfully");
      navigate({ to: "/u" });
    },
    onError: errorToast,
  });
}

export function useAdminAuthLogin() {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      api.post("user/admin/login", { json: data }).json<APIResponse<unknown>>(),
    onSuccess: () => {
      successToast("An OTP has been sent to your email");
    },
    onError: errorToast,
  });
}
// ========== AUTH MODULE END ==========

// ========== USERS MODULE START ==========
export function useCreateUser() {
  return useMutation({
    mutationFn: (data: { email: string; superAdmin: boolean }) =>
      api.post("user/admin", { json: data }).json<APIResponse<unknown>>(),
    onSuccess: () => {
      successToast("An OTP has been sent to your email");
    },
    onError: errorToast,
  });
}

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.all(),
    queryFn: () => api.get("users").json<APIResponse<User[]>>(),
  });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; email: string }) =>
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

export function useAgentLogin() {
  return useMutation({
    mutationFn: (data: AgentLogin) =>
      api.post("user/agent/login", { json: data }).json<APIResponse<unknown>>(),
    onSuccess: () => {
      successToast("An OTP has been sent to your email");
    },
    onError: errorToast,
  });
}

export function useVerifyOtp() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: VerifyOtp) =>
      api.post("user/agent/verify-otp", { json: data }).json<APIResponse<{ token: string }>>(),
    onSuccess: (response) => {
      // TODO: manage token type
      // @ts-expect-error untyped token
      authToken.set(response.token);
      successToast("Logged in successfully");
      navigate({ to: "/u" });
    },
    onError: errorToast,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPassword) =>
      api.post("user/admin/reset-password", { json: data }).json<APIResponse<unknown>>(),
    onSuccess: () => {
      successToast("Password reset successfully");
    },
    onError: errorToast,
  });
}

export function useSendPasswordResetLink() {
  return useMutation({
    mutationFn: (data: SendPasswordResetLink) =>
      api.post("user/admin/reset-password/send", { json: data }).json<APIResponse<unknown>>(),
    onSuccess: () => {
      successToast("Password reset link sent to your email");
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
// ========== USERS MODULE END ==========

// ========== BRANCHES MODULE START ==========
export function useBranches() {
  return useQuery({
    queryKey: queryKeys.branches.all(),
    queryFn: () => api.get("branch").json<APIResponse<Branch[]>>(),
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
// ========== BRANCHES MODULE END ==========

// ========== CUSTOMERS MODULE START ==========
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
      // Invalidate related queries using helper
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

export function useCustomerById(id: string) {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => api.get(`customer/${id}`).json<APIResponse<Customer>>(),
    enabled: !!id,
  });
}
// ========== CUSTOMERS MODULE END ==========
