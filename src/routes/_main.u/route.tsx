import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AppHeader, AppLayoutProvider, AppSidebar } from "@/components/app-layout";
import { useLoggedInUser } from "@/hooks/data";

export const Route = createFileRoute("/_main/u")({
  component: MainLayout,
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
