import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { AppSplashScreen } from "@/components/app-splash-screen";
import { api } from "@/lib/api";
import { UserRoles, type User } from "@/lib/types";
import { authToken } from "@/lib/auth-token";

import { AppHeader, AppLayoutProvider, AppSidebar } from "@/components/app-layout";
import { useLoggedInUser } from "@/hooks/data";

export const Route = createFileRoute("/_main/a")({
  component: MainLayout,
  pendingComponent: () => <AppSplashScreen />,
  loader: async () => {
    try {
      const response = await api.get("user/me").json<User>();
      if (response.role !== UserRoles.AGENT) {
        return redirect({ to: "/u" });
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

function MainLayout() {
  useLoggedInUser();

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
