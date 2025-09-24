import { useNavigate } from "@tanstack/react-router";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { authToken } from "@/lib/auth-token";
import type {
  APIResponse,
  AdminMetrics,
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
      navigate({ to: "/auth" });
    },
    onError: errorToast,
  });
}

// Auth admin
export function useAdminAuthInitialize() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      superAdmin: boolean;
    }) => api.post("user/admin/init", { json: data }).json<APIResponse<unknown>>(),
    onSuccess: (_, variables) => {
      successToast("An OTP has been sent to your email");
      navigate({ to: "/auth/u/verify", search: { email: variables.email } });
    },
    onError: errorToast,
  });
}

export function useAdminAuthVerify() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: { otp: string; email: string }) =>
      api.post("user/admin/verify-otp", { json: data }).json<APIResponse<{ token: string }>>(),
    onSuccess: (response) => {
      authToken.set(response.data.token);
      successToast("Logged in successfully");
      navigate({ to: "/" });
    },
    onError: errorToast,
  });
}

export function useAdminAuthCheck() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: { email: string }) =>
      api.get("user/admin/is-active", { searchParams: data }).json<APIResponse<boolean>>(),
    onSuccess: (response, variables) => {
      if (response.data) {
        navigate({ to: "/auth/u/login", search: { email: variables.email } });
      } else {
        navigate({ to: "/auth/u/onboarding", search: { email: variables.email } });
      }
    },
    onError: errorToast,
  });
}

export function useAdminAuthOnboarding() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      api.post("user/admin/set-password", { json: data }).json<APIResponse<unknown>>(),
    onSuccess: (_, variables) => {
      successToast("An OTP has been sent to your email");
      navigate({ to: "/auth/u/verify", search: { email: variables.email } });
    },
    onError: errorToast,
  });
}

export function useAdminAuthLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      api.post("user/admin/login", { json: data }).json<APIResponse<unknown>>(),
    onSuccess: (_, variables) => {
      successToast("An OTP has been sent to your email");
      navigate({ to: "/auth/u/verify", search: { email: variables.email } });
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

// Auth agent
export function useAgentAuthLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string }) =>
      api.post("user/agent/login", { json: data }).json<APIResponse<unknown>>(),
    onSuccess: (_, variables) => {
      successToast("An OTP has been sent to your email");
      navigate({ to: "/auth/a/verify", search: { email: variables.email } });
    },
    onError: errorToast,
  });
}

export function useAgentAuthVerify() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: VerifyOtp) =>
      api.post("user/agent/verify-otp", { json: data }).json<APIResponse<{ token: string }>>(),
    onSuccess: (response) => {
      authToken.set(response.data.token);
      successToast("Logged in successfully");
      navigate({ to: "/" });
    },
    onError: errorToast,
  });
}
// ========== AUTH MODULE END ==========

// ========== USERS MODULE START ==========
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
