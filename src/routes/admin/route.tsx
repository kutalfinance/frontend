import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { AppHeader, AppLayoutProvider, AppSidebar } from "@/components/app-layout";
import { AppSplashScreen } from "@/components/app-splash-screen";
import { queryClient } from "@/components/query-provider";

import { loggedInUserQueryOptions } from "@/hooks/auth/common";
import { authToken } from "@/lib/auth-token";
import { UserRoles } from "@/lib/types";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  pendingComponent: AppSplashScreen,
  loader: async () => {
    const response = await queryClient.ensureQueryData(loggedInUserQueryOptions);
    if (response?.data.role !== UserRoles.ADMIN) {
      return redirect({ to: "/agent" });
    }
  },
  onError: () => {
    authToken.clear();
    return redirect({ to: "/auth" });
  },
});

function AdminLayout() {
  return (
    <AppLayoutProvider className="flex min-h-dvh flex-col">
      <AppHeader />

      <div className="flex flex-1">
        <AppSidebar />
        <div className="w-full flex-1 py-5">
          <Outlet />
        </div>
      </div>
    </AppLayoutProvider>
  );
}
