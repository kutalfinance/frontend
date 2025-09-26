import { useNavigate } from "@tanstack/react-router";

import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { authToken } from "@/lib/auth-token";
import type { APIResponse, ResetPassword, SendPasswordResetLink } from "@/lib/types";

import { errorToast, successToast } from "../data/utils";

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
      successToast("An OTP has been sent to your email");
      navigate({ to: "/auth/admin/verify", search: { email: variables.email } });
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
        navigate({ to: "/auth/admin/login", search: { email: variables.email } });
      } else {
        navigate({ to: "/auth/admin/setup", search: { email: variables.email } });
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
      navigate({ to: "/auth/admin/login", search: { email: variables.email } });
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
      navigate({ to: "/auth/admin/verify", search: { email: variables.email } });
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
