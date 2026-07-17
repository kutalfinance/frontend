import { Link, useLocation } from "react-router";

import {
  Building2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Contact,
  History,
  Home,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/text";

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

/* ── Admin Nav Preview ── */

const adminNavItems = [
  { label: "Home", icon: Home },
  { label: "Branches", icon: Building2 },
  { label: "Customers", icon: Contact },
  { label: "Users", icon: Users },
  { label: "Audit Logs", icon: History },
] as const;

export type AdminNavHighlight = (typeof adminNavItems)[number]["label"] | "Approvals";

export function AdminNavPreview({ highlight }: { highlight: AdminNavHighlight }) {
  return (
    <div className="border-foreground/20 relative ml-9 rounded-lg border">
      <div className="border-foreground/20 border-b px-3 py-1.5">
        <span className="text-muted-foreground text-xs font-medium">Preview</span>
      </div>
      <div className="p-4 select-none">
        <div className="flex items-center justify-between">
          {/* Left: logo + nav */}
          <div className="flex items-center gap-6">
            <Heading className="inline" variant="h4">
              KSS
            </Heading>
            <div className="flex items-center gap-0.5">
              {adminNavItems.map((item) => {
                const isActive = item.label === highlight;
                return (
                  <div
                    key={item.label}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs",
                      isActive
                        ? "border-primary bg-primary/5 text-primary border font-semibold"
                        : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="size-3.5" />
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: approvals + avatar */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs",
                highlight === "Approvals"
                  ? "border-primary bg-primary/5 text-primary border font-semibold"
                  : "text-muted-foreground"
              )}
            >
              <CheckCircle className="size-3.5" />
              Approvals
            </div>
            <Avatar className="size-7">
              <AvatarFallback className="text-[10px]">AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Preview Card ── */

export function Preview({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="border-foreground/20 relative ml-9 rounded-lg border">
      <div className="border-foreground/20 border-b px-3 py-1.5">
        <span className="text-muted-foreground text-xs font-medium">Preview</span>
      </div>
      <div className="flex justify-center p-6">
        <div className={cn("w-full space-y-6 select-none", !wide && "max-w-sm")}>{children}</div>
      </div>
    </div>
  );
}
