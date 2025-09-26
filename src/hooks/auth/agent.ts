import { useNavigate } from "@tanstack/react-router";

import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { authToken } from "@/lib/auth-token";
import type { APIResponse, VerifyOtp } from "@/lib/types";

import { errorToast, successToast } from "../data/utils";

// Agent authentication hooks
export function useAgentAuthLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string }) =>
      api.post("user/agent/login", { json: data }).json<APIResponse<unknown>>(),
    onSuccess: (_, variables) => {
      successToast("An OTP has been sent to your email");
      navigate({ to: "/auth/agent/verify", search: { email: variables.email } });
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
