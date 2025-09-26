import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { authToken } from "@/lib/auth-token";
import type { APIResponse, User } from "@/lib/types";
import { errorToast, queryKeys, successToast } from "../data/utils";

// Common auth hooks used by both admin and agent
export function useLoggedInUser() {
  const navigate = useNavigate();

  return useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: async () => {
      try {
        return await api.get("user/me").json<APIResponse<User>>();
      } catch (e) {
        navigate({ to: "/auth" });
        authToken.clear();
        return;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
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
      navigate({ to: "/auth" });
    },
    onError: errorToast,
  });
}