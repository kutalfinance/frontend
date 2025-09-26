import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { AppHeader, AppLayoutProvider, AppSidebar } from "@/components/app-layout";
import { loggedInUserQueryOptions } from "@/hooks/auth/common";
import { AppSplashScreen } from "@/components/app-splash-screen";
import { UserRoles } from "@/lib/types";
import { authToken } from "@/lib/auth-token";
import { queryClient } from "@/components/query-provider";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  pendingComponent: () => <AppSplashScreen />,
  loader: async () => {
    try {
      const response = await queryClient.ensureQueryData(loggedInUserQueryOptions);
      if (response?.data.role !== UserRoles.ADMIN) {
        return redirect({ to: "/agent" });
      }
    } catch (err) {
      authToken.clear();
      return redirect({ to: "/auth" });
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
