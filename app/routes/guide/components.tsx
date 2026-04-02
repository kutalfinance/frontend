import { Link, useLocation } from "react-router";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ── Guide Pages Order ── */

export const guidePages = [
  { path: "/guide", label: "Getting Started", group: "Overview" },
  { path: "/guide/admin/login", label: "Login", group: "Admin" },
  { path: "/guide/admin/dashboard", label: "Dashboard", group: "Admin" },
  { path: "/guide/admin/users", label: "Managing Users", group: "Admin" },
  { path: "/guide/admin/branches", label: "Managing Branches", group: "Admin" },
  { path: "/guide/admin/customers", label: "Managing Customers", group: "Admin" },
  { path: "/guide/admin/transactions", label: "Transactions", group: "Admin" },
  { path: "/guide/admin/withdrawals", label: "Approving Withdrawals", group: "Admin" },
  { path: "/guide/admin/reports", label: "Reports", group: "Admin" },
  { path: "/guide/admin/audit-logs", label: "Audit Logs", group: "Admin" },
  { path: "/guide/agent/login", label: "Login", group: "Agent" },
  { path: "/guide/agent/dashboard", label: "Dashboard", group: "Agent" },
  { path: "/guide/agent/customers", label: "Creating Customers", group: "Agent" },
  { path: "/guide/agent/deposits", label: "Recording Deposits", group: "Agent" },
  { path: "/guide/agent/withdrawals", label: "Requesting Withdrawals", group: "Agent" },
  { path: "/guide/agent/customer-details", label: "Customer Details", group: "Agent" },
] as const;

/* ── Prev / Next Navigation ── */

export function GuideNavigation() {
  const { pathname } = useLocation();
  const currentIndex = guidePages.findIndex((p) => p.path === pathname);
  const prev = guidePages[currentIndex - 1];
  const next = guidePages[currentIndex + 1];

  return (
    <div className="mt-12 flex items-stretch justify-between gap-4 border-t pt-6">
      {prev ? (
        <Link
          to={prev.path}
          className="text-muted-foreground hover:text-foreground hover:border-primary group flex flex-col gap-1 rounded-lg border p-4 transition-colors"
        >
          <span className="flex items-center gap-1 text-xs">
            <ChevronLeft className="size-3" />
            Previous
          </span>
          <span className="text-foreground text-sm font-medium">
            {prev.group}: {prev.label}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          to={next.path}
          className="text-muted-foreground hover:text-foreground hover:border-primary group flex flex-col items-end gap-1 rounded-lg border p-4 transition-colors"
        >
          <span className="flex items-center gap-1 text-xs">
            Next
            <ChevronRight className="size-3" />
          </span>
          <span className="text-foreground text-sm font-medium">
            {next.group}: {next.label}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}

/* ── Page Title ── */

export function GuideTitle({
  children,
  badge,
  badgeVariant = "default",
}: {
  children: React.ReactNode;
  badge?: string;
  badgeVariant?: "default" | "accent";
}) {
  return (
    <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
      {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
      {children}
    </h2>
  );
}

/* ── Content Primitives ── */

export function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="space-y-3 pl-1">{children}</ol>;
}

export function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
        {n}
      </span>
      <span className="text-sm leading-6">{children}</span>
    </li>
  );
}

export function StepLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
        {n}
      </span>
      <span className="text-sm leading-6">{children}</span>
    </div>
  );
}

export function Preview({
  children,
  wide,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="relative ml-9 rounded-lg border border-foreground/20">
      <div className="border-b border-foreground/20 px-3 py-1.5">
        <span className="text-muted-foreground text-xs font-medium">Preview</span>
      </div>
      <div className="flex justify-center p-6">
        <div
          className={cn(
            "w-full select-none space-y-6",
            wide ? "max-w-2xl" : "max-w-sm",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
