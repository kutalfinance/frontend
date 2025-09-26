import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { authToken } from "@/lib/auth-token";
import { UserRoles } from "@/lib/types";
import { AppSplashScreen } from "@/components/app-splash-screen";
import { queryClient } from "@/components/query-provider";
import { loggedInUserQueryOptions } from "@/hooks/auth/common";

// Root route handler - authenticates user and redirects based on role
export const Route = createFileRoute("/")({
  component: Layout,
  pendingComponent: () => <AppSplashScreen />,
  loader: async () => {
    try {
      const response = await queryClient.ensureQueryData(loggedInUserQueryOptions);
      if (response?.data.role === UserRoles.ADMIN) {
        return redirect({ to: "/admin" });
      }
      return redirect({ to: "/agent" });
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

function Layout() {
  return <Outlet />;
}
