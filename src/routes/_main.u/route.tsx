import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AppHeader } from "@/components/app-header";
import { useLoggedInUser } from "@/hooks/data";

export const Route = createFileRoute("/_main/u")({
  component: MainLayout,
});

function MainLayout() {
  useLoggedInUser();

  return (
    <>
      <AppHeader />

      <div className="container py-5">
        <Outlet />
      </div>
    </>
  );
}
