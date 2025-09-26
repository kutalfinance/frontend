import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { AppSplashScreen } from "@/components/app-splash-screen";
import { api } from "@/lib/api";
import { UserRoles, type APIResponse, type User } from "@/lib/types";
import { authToken } from "@/lib/auth-token";

import { AppHeader, AppLayoutProvider, AppSidebar } from "@/components/app-layout";
import { useLoggedInUser } from "@/hooks/auth/common";

export const Route = createFileRoute("/agent")({
  component: AgentLayout,
  pendingComponent: () => <AppSplashScreen />,
  loader: async () => {
    try {
      const response = await api.get("user/me").json<APIResponse<User>>();
      if (response.data.role !== UserRoles.AGENT) {
        return redirect({ to: "/admin" });
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

function AgentLayout() {
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

