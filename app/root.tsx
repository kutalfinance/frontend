import { useEffect } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { QueryProvider, queryClient } from "./components/query-provider";
import { Toaster } from "./components/ui/sonner";
import { useOnlineStatus } from "./hooks/use-online-status";
import { ENVIRONMENT } from "./lib/config";
import { flushSyncQueue } from "./lib/sync-queue";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

const isDev = ENVIRONMENT !== "production";

function DevBanner() {
  if (!isDev) return null;
  return (
    <div className="fixed top-0 left-0 z-[9999] flex h-6 w-full items-center justify-center bg-amber-500 text-xs font-semibold text-black">
      Development Mode
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="KSS" />
        <Meta />
        <Links />
      </head>
      <body className={isDev ? "pt-6" : ""}>
        <DevBanner />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (!isOnline) return;
    // Flush writes queued while offline, then refetch everything so the UI
    // reflects the synced data (offline snapshot is stale by definition).
    flushSyncQueue().then(({ flushed }) => {
      if (flushed > 0) queryClient.invalidateQueries();
    });
  }, [isOnline]);

  return (
    <QueryProvider>
      <Outlet />
      <Toaster />
    </QueryProvider>
  );
}

export { ErrorBoundary } from "@/components/error-boundary";
export { HydrateFallback } from "@/components/hydrate-fallback";
