import { useEffect } from "react";
import { useNavigate } from "react-router";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { API_URL } from "@/lib/config";
import type { Branch, Customer, User } from "@/lib/types";

import { useReplicache } from "./use-replicache";

function successToast(description: string) {
  toast.success("Success", { description });
}

async function errorToast(err: any) {
  const errResponse = await err.response?.json();

  // TODO: Remove console log in production
  console.log("API Error:", errResponse);

  const title = errResponse?.title ?? "Error";
  const description = errResponse?.detail ?? "Something went wrong. Please try again";
  toast.error(title, { description });
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

// Customers
export function useCustomers() {
  const rep = useReplicache({
    name: "customers",
    puller: async () => {
      const res = await fetch(`${API_URL}/api/v1/customer`);

      return {
        httpRequestInfo: {
          httpStatusCode: res.status,
          errorMessage: "",
        },
      };
    },
    pusher: async (req) => {
      console.log("pusher", req);

      const promises = req.mutations.map((m) =>
        fetch(`${API_URL}/api/v1/customer`, {
          method: "POST",
          body: JSON.stringify(m),
          headers: { "Content-Type": "application/json" },
        })
      );
      const responses = await Promise.all(promises);
      return {
        httpRequestInfo: {
          httpStatusCode: responses[0].status,
          errorMessage: "",
        },
      };
    },

    mutators: {},
  });

  useEffect(() => {
    if (!rep) return;

    rep.subscribe(
      async (tx) => {
        return await tx.scan<Customer>().values().toArray();
      },
      {
        onData: (customers) => {
          console.log("Customers updated:", customers);
        },
      }
    );
  }, []);

  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      if (!rep) return [];
      return await rep.query((tx) => tx.scan<Customer>().toArray());
    },
    retry: false,
  });

  // return useQuery({
  //   queryKey: ["customers"],
  //   queryFn: () => api.get("customers").json<Customer[]>(),
  // });
}

export function useCreateCustomer() {
  return useMutation({
    mutationFn: (data: Partial<Customer> & { branchId: string }) =>
      api.post("customers", { json: data }),
    onSuccess: () => {
      successToast("Customer created successfully");
    },
    onError: errorToast,
  });
}

// Branches
export function useBranches() {
  return useQuery({
    queryKey: ["branches"],
    queryFn: () => api.get("branches").json<Branch[]>(),
  });
}
