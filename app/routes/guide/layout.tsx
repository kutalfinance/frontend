import { Link, Outlet, href, useLocation } from "react-router";

import { ArrowLeft } from "lucide-react";

import { AppLogo } from "@/components/app-logo";
import { Button } from "@/components/ui/button";

import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

import type { Route } from "./+types/layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `User Guide - ${siteConfig.name}` },
    { name: "description", content: "Step-by-step guide for using KSS" },
  ];
}

const sidebar = [
  {
    label: "Overview",
    children: [{ path: "/guide", label: "Getting Started" }],
  },
  {
    label: "Admin",
    children: [
      { path: "/guide/admin/login", label: "Login" },
      { path: "/guide/admin/dashboard", label: "Dashboard" },
      { path: "/guide/admin/users", label: "Managing Users" },
      { path: "/guide/admin/branches", label: "Managing Branches" },
      { path: "/guide/admin/customers", label: "Managing Customers" },
      { path: "/guide/admin/transactions", label: "Transactions" },
      { path: "/guide/admin/withdrawals", label: "Approving Withdrawals" },
      { path: "/guide/admin/reports", label: "Reports" },
      { path: "/guide/admin/audit-logs", label: "Audit Logs" },
    ],
  },
  {
    label: "Agent",
    children: [
      { path: "/guide/agent/login", label: "Login" },
      { path: "/guide/agent/dashboard", label: "Dashboard" },
      { path: "/guide/agent/customers", label: "Creating Customers" },
      { path: "/guide/agent/deposits", label: "Recording Deposits" },
      { path: "/guide/agent/withdrawals", label: "Requesting Withdrawals" },
      { path: "/guide/agent/customer-details", label: "Customer Details" },
    ],
  },
];

function SidebarNav() {
  const { pathname } = useLocation();

  return (
    <ul className="space-y-4">
      {sidebar.map((group) => (
        <li key={group.label}>
          <p className="text-foreground/50 mb-1 px-3 text-xs font-semibold tracking-wider uppercase">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.children.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "text-muted-foreground hover:text-foreground block rounded-md px-3 py-1.5 text-sm transition-colors",
                    pathname === item.path && "text-primary bg-primary/10 font-medium"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default function GuideLayout() {
  return (
    <div className="min-h-dvh">
      <header className="bg-background sticky top-0 z-40 border-b">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <AppLogo />
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-sm font-medium">User Guide</span>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to={href("/")}>
              <ArrowLeft className="size-4" />
              Back to app
            </Link>
          </Button>
        </div>
      </header>

      <div className="container py-10">
        <div className="flex gap-12">
          {/* Sidebar - desktop */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <nav className="sticky top-24">
              <SidebarNav />
            </nav>
          </aside>

          {/* Content */}
          <main className="min-w-0 flex-1">
            {/* Mobile sidebar */}
            <details className="bg-muted/50 mb-10 rounded-lg border p-4 lg:hidden">
              <summary className="cursor-pointer text-sm font-semibold">Navigation</summary>
              <div className="mt-3">
                <SidebarNav />
              </div>
            </details>

            <Outlet />
          </main>
        </div>
      </div>

      <footer className="border-t">
        <div className="text-muted-foreground container py-4 text-center text-sm">
          &copy; {new Date().getFullYear()} <AppLogo />. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
