import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { QueryProvider } from "./components/query-provider";
import { Toaster } from "./components/ui/sonner";

export const links: Route.LinksFunction = () => [
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

function DevBanner() {
  if (!import.meta.env.DEV) return null;
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
        <Meta />
        <Links />
      </head>
      <body className={import.meta.env.DEV ? "pt-6" : ""}>
        <DevBanner />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <QueryProvider>
      <Outlet />
      <Toaster />
    </QueryProvider>
  );
}

export { ErrorBoundary } from "@/components/error-boundary";
export { HydrateFallback } from "@/components/hydrate-fallback";
