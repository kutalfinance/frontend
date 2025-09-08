import { useNavigate } from "react-router";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { Customer } from "@/lib/types";
import type { Branch, User } from "@/lib/types";

import { invalidationHelpers, queryKeys } from "./query-keys";
import { errorToast, successToast } from "./utils";

// Auth
export function useLoggedInUser() {
  return useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: () => api.get("users/me").json<User>(),
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
    }) => api.post("users/admin/init", { json: data }).json(),
    onSuccess: () => {
      successToast("Admin initialized successfully. Please log in to continue.");
      navigate("/auth/otp");
    },
    onError: errorToast,
  });
}

export function useAdminAuthOTP() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: { otp: string; email: string }) =>
      api.post("users/admin/verify-otp", { json: data }).json(),
    onSuccess: (response) => {
      console.log("Response", response);

      successToast("Logged in successfully");
      // @ts-expect-error untyped token
      // TODO: manage token type
      localStorage.setItem("auth_token", response.token);
      navigate("/");
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
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string; superAdmin: boolean }) =>
      api.post("users/admin", { json: data }).json(),
    onSuccess: () => {
      successToast("An OTP has been sent to your email");
      navigate("/auth/otp");
    },
    onError: errorToast,
  });
}

// Branches
export function useBranches() {
  return useQuery({
    queryKey: queryKeys.branches.all(),
    queryFn: () => api.get("branch").json<Branch[]>(),
  });
}

export function useCustomers() {
  return useQuery({
    queryKey: queryKeys.customers.all(),
    queryFn: () => api.get("customer").json<Customer[]>(),
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
