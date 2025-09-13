import { api } from "@/lib/api";
import { authToken } from "@/lib/auth-token";
import { UserRoles, type User } from "@/lib/types";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

// Root route handler - authenticates user and redirects based on role
export const Route = createFileRoute("/")({
  component: Layout,
  pendingComponent: () => (
    <div className="flex h-dvh w-screen items-center justify-center">
      <div className="border-primary/70 size-8 animate-spin rounded-full border-4 border-b-transparent" />
    </div>
  ),
  loader: async () => {
    const response = await api.get("users/me").json<User>();
    if (response.role === UserRoles.ADMIN) {
      return redirect({ to: "/u" });
    }

    // TODO: Redirect to agent dashboard when implemented
    return redirect({ to: "/auth" });
  },
  onError: () => {
    authToken.clear();
    return redirect({ to: "/auth" });
  },
});

function Layout() {
  return <Outlet />;
}
