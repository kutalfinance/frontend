import { useEffect } from "react";
import { Outlet, href, redirect } from "react-router";

import { AppLayoutProvider } from "@/components/app-layout";
import { ErrorBoundary as AppErrorBoundary } from "@/components/error-boundary";
import { queryClient } from "@/components/query-provider";

import { loggedInUserQueryOptions } from "@/hooks/auth/common";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { syncOfflineData } from "@/lib/offline";
import { UserRoles } from "@/lib/types";

import type { Route } from "./+types/layout";

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <AppErrorBoundary error={error} />;
}

export async function clientLoader() {
  const response = await queryClient.ensureQueryData(loggedInUserQueryOptions);
  if (response?.data.role !== UserRoles.AGENT) {
    return redirect(href("/auth"));
  }
}

export default function AgentLayout() {
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (!isOnline) return;
    // Sync IDB on mount and whenever coming back online, then every 5 minutes.
    // This ensures data is always available if the agent switches to offline mode.
    syncOfflineData().catch(() => {});
    const interval = setInterval(() => syncOfflineData().catch(() => {}), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isOnline]);

  return (
    <AppLayoutProvider className="bg-muted/50 flex min-h-dvh flex-col">
      <div className="flex-1 py-5">
        <Outlet />
      </div>
    </AppLayoutProvider>
  );
}
