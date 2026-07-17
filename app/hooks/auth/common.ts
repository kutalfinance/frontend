import { href, useNavigate } from "react-router";

import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";

import { api } from "@/lib/api";
import { authToken } from "@/lib/auth-token";
import { getMisc } from "@/lib/offline";
import { isOfflineMode } from "@/lib/offline-mode";
import type { APIResponse, User } from "@/lib/types";

import { errorToast, queryKeys, successToast } from "../data/utils";

// Common auth hooks used by both admin and agent
export const loggedInUserQueryOptions = queryOptions({
  queryKey: queryKeys.users.me(),
  queryFn: async () => {
    if (isOfflineMode()) {
      const cached = await getMisc<APIResponse<User>>("user-me");
      if (cached) return cached;
    }
    try {
      const response = await api.get("user/me").json<APIResponse<User>>();
      return response;
    } catch (err) {
      if (
        err instanceof HTTPError &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        authToken.clear();
        window.location.replace(href("/auth"));
      }
      throw err;
    }
  },
  staleTime: 1000 * 60 * 5, // 5 minutes
});

export function useLoggedInUser() {
  return useSuspenseQuery(loggedInUserQueryOptions);
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
