import { useNavigate } from "react-router";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

function successToast(description: string) {
  toast.success("Success", { description });
}

async function errorToast(err: any) {
  const errResponse = await err.response?.json();
  // TODO: Remove console log in production
  console.log("API Error:", errResponse);
  const description =
    errResponse?.detail ?? errResponse?.title ?? "Something went wrong. Please try again";
  toast.error("Error", { description });
}

// Auth
export function useLoggedInUser() {
  return useMutation({
    mutationFn: () => api.get("users/me").json<User>(),
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
    }) => api.post("users/admin/init", { json: data }),
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
    mutationFn: async (data: { otp: string }) => api.post("users/admin/verify-otp", { json: data }),
    onSuccess: () => {
      successToast("Logged in successfully");
      navigate("/");
    },
    onError: errorToast,
  });
}

export function useAdminAuthLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      api.post("users/admin/login", { json: data }),
    onSuccess: () => {
      successToast("An OTP has been sent to your email");
      navigate("/auth/otp");
    },
    onError: errorToast,
  });
}

export function useCreateUser() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string; superAdmin: boolean }) =>
      api.post("users/admin", { json: data }),
    onSuccess: () => {
      successToast("An OTP has been sent to your email");
      navigate("/auth/otp");
    },
    onError: errorToast,
  });
}
