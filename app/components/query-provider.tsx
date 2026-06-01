import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10, // Data considered fresh for 5 seconds
      gcTime: Infinity, // 1000 * 60 * 60, // Keep inactive data for 1 hours
      networkMode: "always", // let queryFn run offline; we handle fallback inside each queryFn
    },
    mutations: {
      networkMode: "always", // same — mutationFn checks isOfflineMode() and enqueues if offline
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>{children}</TooltipProvider>
    </QueryClientProvider>
  );
}
