import { Badge } from "@/components/ui/badge";

import { GuideNavigation, GuideTitle } from "./components";

export default function OverviewGuide() {
  return (
    <div className="text-foreground/80 space-y-8 text-sm leading-relaxed">
      <GuideTitle>Getting Started</GuideTitle>

      <div className="space-y-3">
        <p>
          KSS is a financial management system for managing customer savings accounts, deposits,
          withdrawals, and branch operations. This guide walks you through every feature
          step-by-step.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">System Roles</h3>
        <p>There are two roles in KSS:</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="mb-2">
              <Badge>Admin</Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              Full system access. Manages users, branches, customers, and approves withdrawal
              requests. Can view audit logs and generate reports.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <div className="mb-2">
              <Badge variant="accent">Agent</Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              Branch-scoped access. Records deposits and withdrawal requests for customers in their
              assigned branch. Can create customers and view their details.
            </p>
          </div>
        </div>
      </div>

      <GuideNavigation />
    </div>
  );
}
