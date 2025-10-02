import { AppSplashScreen } from "@/components/app-splash-screen";
import { queryClient } from "@/components/query-provider";
import { checkQueryOptions } from "@/hooks/auth/common";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
  pendingComponent: AppSplashScreen,
  loader: async () => {
    const response = await queryClient.ensureQueryData(checkQueryOptions);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate a short delay

    if (!response?.data) {
      return redirect({ to: "/initialize" });
    }

    return null;
  },
});

function AuthLayout() {
  return (
    <div className="container mx-auto grid min-h-[90dvh] w-full max-w-lg place-items-center">
      <div className="bg-card w-full space-y-8 rounded-md pt-20 pb-24 sm:px-10">
        <Outlet />
      </div>
    </div>
  );
}
