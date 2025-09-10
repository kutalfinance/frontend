import { Outlet } from "react-router";

import { AppHeader } from "@/components/app-header";

import { useLoggedInUser } from "@/hooks/data";

export default function DashLayout() {
  const { data, isLoading } = useLoggedInUser();

  if (isLoading) {
    return (
      <div className="flex h-dvh w-screen items-center justify-center">
        <div className="border-primary/70 size-10 animate-spin rounded-full border-4 border-b-transparent" />
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
