import { Outlet, href, redirect } from "react-router";

import { AppHeader, AppLayoutProvider } from "@/components/app-layout";
import { queryClient } from "@/components/query-provider";

import { loggedInUserQueryOptions } from "@/hooks/auth/common";
import { UserRoles } from "@/lib/types";

export async function clientLoader() {
  const response = await queryClient.ensureQueryData(loggedInUserQueryOptions);
  if (response?.data.role !== UserRoles.ADMIN) {
    return redirect(href("/auth"));
  }
}

export default function AdminLayout() {
  return (
    <AppLayoutProvider className="flex min-h-dvh flex-col">
      <AppHeader />

      <div className="flex-1 py-5">
        <Outlet />
      </div>
    </AppLayoutProvider>
  );
}
