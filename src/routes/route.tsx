import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { api } from "@/lib/api";
import { authToken } from "@/lib/auth-token";
import { type User, UserRoles } from "@/lib/types";
import { AppSplashScreen } from "@/components/app-splash-screen";

// Root route handler - authenticates user and redirects based on role
export const Route = createFileRoute("/")({
  component: Layout,
  pendingComponent: () => <AppSplashScreen />,
  loader: async () => {
    try {
      const response = await api.get("user/me").json<User>();
      if (response.role === UserRoles.ADMIN) {
        return redirect({ to: "/u" });
      }
      // Else redirect to agent dashboard
      return redirect({ to: "/a" });
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
