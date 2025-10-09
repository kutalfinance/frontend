import { href, redirect, useNavigate } from "react-router";

import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { authToken } from "@/lib/auth-token";
import type { APIResponse, User } from "@/lib/types";

import { errorToast, queryKeys, successToast } from "../data/utils";

// Common auth hooks used by both admin and agent
export const loggedInUserQueryOptions = queryOptions({
  queryKey: queryKeys.users.me(),
  queryFn: async () => {
    try {
      const response = await api.get("user/me").json<APIResponse<User>>();
      return response;
    } catch (err) {
      authToken.clear();
      redirect(href("/auth"));
      return null;
    }
  },
  staleTime: 1000 * 60 * 5, // 5 minutes
});

export function useLoggedInUser() {
  return useQuery(loggedInUserQueryOptions);
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
      navigate(href("/auth"));
    },
    onError: errorToast,
  });
}
