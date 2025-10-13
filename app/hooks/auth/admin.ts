import { href, useNavigate } from "react-router";

import { queryOptions, useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { authToken } from "@/lib/auth-token";
import type { APIResponse, ResetPassword, SendPasswordResetLink } from "@/lib/types";

import { errorToast, queryKeys, successToast } from "../data/utils";

export const ADMIN_INITIALIZED_KEY = "admin_initialized";
export const setAdminInitialized = (value: boolean) =>
  sessionStorage.setItem(ADMIN_INITIALIZED_KEY, value ? "true" : "false");
export const getAdminInitialized = () => sessionStorage.getItem(ADMIN_INITIALIZED_KEY) === "true";

export const checkQueryOptions = queryOptions({
  queryKey: queryKeys.auth.check(),
  queryFn: async () => {
    try {
      return await api.get("check").json<APIResponse<boolean>>();
    } catch (err) {
      console.log("Error in auth check:", err);
      return null;
    }
  },
  staleTime: 1000 * 60 * 5, // 5 minutes
});

// Admin authentication hooks
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
      setAdminInitialized(true);
      successToast("An OTP has been sent to your email");
      navigate(href("/auth/admin/verify") + `?email=${encodeURIComponent(variables.email)}`);
    },
    onError: errorToast,
  });
}

export function useAdminAuthVerify() {
  return useMutation({
    mutationFn: async (data: { otp: string; email: string }) =>
      api.post("user/admin/verify-otp", { json: data }).json<APIResponse<{ token: string }>>(),
    onSuccess: (response) => {
      authToken.set(response.data.token);
      successToast("Logged in successfully");
      window.location.href = href("/");
    },
    onError: errorToast,
  });
}

export function useAdminAuthIsActive() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: { email: string }) =>
      api.get("user/admin/is-active", { searchParams: data }).json<APIResponse<boolean>>(),
    onSuccess: (response, variables) => {
      if (response.data) {
        navigate(href("/auth/admin/login") + `?email=${encodeURIComponent(variables.email)}`);
      } else {
        navigate(href("/auth/admin/setup") + `?email=${encodeURIComponent(variables.email)}`);
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
      successToast("Password set successfully. Please login.");
      navigate(href("/auth/admin/login") + `?email=${encodeURIComponent(variables.email)}`);
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
      navigate(href("/auth/admin/verify") + `?email=${encodeURIComponent(variables.email)}`);
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
