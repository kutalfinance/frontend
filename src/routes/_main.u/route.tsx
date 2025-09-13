import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AppHeader } from "@/components/app-header";

export const Route = createFileRoute("/_main/u")({
  component: MainLayout,
});

function MainLayout() {
  return (
    <>
      <AppHeader />

      <div className="container py-5">
        <Outlet />
      </div>
    </>
  );
}
