import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AppHeader } from "@/components/app-header";

import { useLoggedInUser } from "@/hooks/data";

export const Route = createFileRoute("/_main/u")({
  component: MainLayout,
});

function MainLayout() {
  const { data, isLoading } = useLoggedInUser();

  if (isLoading) {
    return (
      <div className="flex h-dvh w-screen items-center justify-center">
        <div className="border-primary/70 size-8 animate-spin rounded-full border-4 border-b-transparent" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <>
      <AppHeader />

      <div className="container py-5">
        <Outlet />
      </div>
    </>
  );
}
