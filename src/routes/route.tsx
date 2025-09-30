import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { AppSplashScreen } from "@/components/app-splash-screen";
import { queryClient } from "@/components/query-provider";

import { loggedInUserQueryOptions } from "@/hooks/auth/common";
import { authToken } from "@/lib/auth-token";
import { UserRoles } from "@/lib/types";

// Root route handler - authenticates user and redirects based on role
export const Route = createFileRoute("/")({
  component: Layout,
  pendingComponent: AppSplashScreen,
  beforeLoad: async () => {
    const response = await queryClient.ensureQueryData(loggedInUserQueryOptions);
    if (response?.data.role === UserRoles.ADMIN) {
      return redirect({ to: "/admin" });
    }

    return redirect({ to: "/agent" });
  },
  onError: () => {
    authToken.clear();
    return redirect({ to: "/auth" });
  },
});

function Layout() {
  return <Outlet />;
}
