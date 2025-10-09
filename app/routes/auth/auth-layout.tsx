import { Outlet, href, redirect } from "react-router";

import { queryClient } from "@/components/query-provider";

import { checkQueryOptions, getAdminInitialized, setAdminInitialized } from "@/hooks/auth/admin";

export async function clientLoader() {
  const isInitialized = getAdminInitialized();
  if (isInitialized) return null;

  const response = await queryClient.ensureQueryData(checkQueryOptions);

  if (!response) {
    // If the response is undefined, we assume a network or server error occurred
    return null;
  }

  if (!response.data) {
    // If the check returns false, we need to initialize the app
    return redirect(href("/initialize"));
  }

  setAdminInitialized(true);
  return null;
}

export default function AuthLayout() {
  return (
    <div className="container mx-auto grid min-h-[90dvh] w-full max-w-lg place-items-center">
      <div className="bg-card w-full space-y-8 rounded-md pt-20 pb-24 sm:px-10">
        <Outlet />
      </div>
    </div>
  );
}
