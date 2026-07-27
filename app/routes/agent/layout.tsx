import { useEffect } from "react";
import { Outlet, href, redirect } from "react-router";

import { AppLayoutProvider } from "@/components/app-layout";
import { ErrorBoundary as AppErrorBoundary } from "@/components/error-boundary";
import { queryClient } from "@/components/query-provider";

import { loggedInUserQueryOptions } from "@/hooks/auth/common";
import { authToken } from "@/lib/auth-token";
import { isOfflineMode } from "@/lib/offline-mode";
import { UserRoles } from "@/lib/types";

import type { Route } from "./+types/layout";

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <AppErrorBoundary error={error} />;
}

export async function clientLoader() {
  // When offline the persist-client cache may not have been restored yet (clientLoaders
  // run before the React tree renders). Trust the auth token as proof of login instead.
  if (isOfflineMode()) {
    if (!authToken.isAuthenticated()) return redirect(href("/auth"));
    return null;
  }
  const response = await queryClient.ensureQueryData(loggedInUserQueryOptions);
  if (response?.data.role !== UserRoles.AGENT) {
    return redirect(href("/auth"));
  }
}

export default function AgentLayout() {
  useEffect(() => {
    // Request persistent storage so the browser doesn't evict the cache under pressure.
    navigator.storage?.persist?.().catch(() => {});
  }, []);

  return (
    <AppLayoutProvider className="bg-muted/50 flex min-h-dvh flex-col">
      <div className="flex-1 py-5">
        <Outlet />
      </div>
    </AppLayoutProvider>
  );
}
