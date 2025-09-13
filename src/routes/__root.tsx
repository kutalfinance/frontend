import { Outlet, createRootRoute } from "@tanstack/react-router";

import { TanstackDevtools } from "@tanstack/react-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  head: () => ({}),
  component: () => (
    <QueryProvider>
      <Outlet />
      <Toaster />
      <TanstackDevtools
        config={{ position: "bottom-left" }}
        plugins={[{ name: "Tanstack Router", render: <TanStackRouterDevtoolsPanel /> }]}
      />
    </QueryProvider>
  ),
});
