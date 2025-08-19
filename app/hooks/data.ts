import { useNavigate } from "react-router";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

function successToast(description: string) {
  toast.success("Success", { description });
}

async function errorToast(err: any) {
  // const description =  "Something went wrong. Please try again";
  const description = (await err.response.text()) ?? "Something went wrong. Please try again";
  toast.error("Error", { description });
}

// Auth
export function useAuthInitialize() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      superAdmin: boolean;
    }) => api.post("/users/admin", { json: data }),
    onSuccess: () => {
      successToast("An OTP has been sent to your email");
      navigate("/auth/otp");
    },
    onError: errorToast,
  });
}

export function useAuthOTP() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: { otp: string }) => api.post("/users/admin", { json: data }),
    onSuccess: () => {
      successToast("Admin initialized successfully");
      navigate("/");
    },
    onError: errorToast,
  });
}

export function useAuthLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      api.post("/users/admin", { json: data }),
    onSuccess: () => {
      successToast("Logged in successfully");
      navigate("/");
    },
    onError: errorToast,
  });
}
