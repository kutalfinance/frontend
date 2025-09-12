import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { api } from "@/lib/api";
import { authToken } from "@/lib/auth-token";
import type { APIResponse, Branch, Customer, User } from "@/lib/types";

import { errorToast, invalidationHelpers, queryKeys, successToast } from "./utils";

// Auth
export function useLoggedInUser() {
  const navigate = useNavigate();

  return useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: async () => {
      try {
        const response = await api.get("users/me").json<User>();
        if (!response) {
          navigate({ to: "/auth" });
          authToken.clear();
          return;
        }

        return response;
      } catch (e) {
        navigate({ to: "/auth" });
        authToken.clear();
        return;
      }
    },
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
    }) => api.post("users/admin/init", { json: data }).json(),
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
      api.post("users/admin/verify-otp", { json: data }).json<APIResponse<{ token: string }>>(),
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

export function useAdminAuthLogin() {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      api.post("users/admin/login", { json: data }).json(),
    onSuccess: () => {
      successToast("An OTP has been sent to your email");
    },
    onError: errorToast,
  });
}

export function useCreateUser() {
  return useMutation({
    mutationFn: (data: { email: string; superAdmin: boolean }) =>
      api.post("users/admin", { json: data }).json(),
    onSuccess: () => {
      successToast("An OTP has been sent to your email");
    },
    onError: errorToast,
  });
}

// Branches
export function useBranches() {
  return useQuery({
    queryKey: queryKeys.branches.all(),
    queryFn: () => api.get("branch").json<APIResponse<Branch[]>>(),
  });
}

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
      api.post("customer", { json: data }).json<Customer>(),
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
