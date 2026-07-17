import { ArrowUpDown, CalendarIcon, SearchIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heading, Paragraph } from "@/components/ui/text";

import { AdminNavPreview, GuideNavigation, GuideTitle, Preview, StepLabel } from "./components";

export default function AdminAuditLogsGuide() {
  return (
    <div className="text-foreground/80 space-y-8 text-sm leading-relaxed">
      <GuideTitle badge="Admin">Audit Logs</GuideTitle>

      <p>
        The Audit Logs page records every significant action performed in the system. Use it to
        track user activity, investigate issues, and maintain an accountability trail. Every login,
        data change, and admin action is automatically captured with timestamps and IP addresses.
      </p>

      {/* Accessing Audit Logs */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Accessing Audit Logs</h3>
        <p>
          Click <strong>Audit Logs</strong> in the navigation bar.
        </p>
        <AdminNavPreview highlight="Audit Logs" />
      </div>

      {/* Page Overview */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Page Overview</h3>
        <p>
          The page shows a header, a search and filter toolbar, and a table of all audit log entries
          sorted by most recent first.
        </p>
        <Preview wide>
          <div>
            <Heading variant="h2">Audit Logs</Heading>
            <Paragraph className="text-muted-foreground text-sm">
              View system activity logs and track user actions across the application
            </Paragraph>
          </div>
        </Preview>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Search &amp; Filters</h3>
        <p>
          The toolbar above the table lets you narrow down the audit log entries. All filters work
          together — for example, you can search for a user&apos;s name while filtering by a
          specific action and date range.
        </p>

        <Preview wide>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full md:max-w-xs">
              <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input disabled placeholder="Search audit logs..." className="w-full pl-9" />
            </div>

            <Button size="sm" variant="outline" disabled>
              Action: All actions
            </Button>

            <Button size="sm" variant="outline" disabled>
              Entity: All entities
            </Button>

            <Button size="sm" variant="outline" disabled>
              <CalendarIcon className="size-4" />
              Date range
            </Button>

            <div className="ml-auto flex items-center gap-1">
              <Button size="sm" variant="ghost" disabled>
                <ArrowUpDown className="size-4" />
              </Button>
              <Button size="sm" variant="outline" disabled>
                Sort by: Time
              </Button>
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Search</strong> — free-text search across user names, descriptions, and other
            log fields
          </li>
          <li>
            <strong>Action</strong> — filter by a specific action type (e.g. LOGIN,
            CUSTOMER_CREATED, TRANSACTION_DEPOSIT, BRANCH_UPDATED, etc.)
          </li>
          <li>
            <strong>Entity</strong> — filter by entity type: Admin, Agent, Branch, Customer,
            Transaction, User, or System
          </li>
          <li>
            <strong>Date range</strong> — filter logs between a start and end date using the date
            picker popover
          </li>
          <li>
            <strong>Sort direction</strong> — toggle between ascending and descending order
          </li>
          <li>
            <strong>Sort by</strong> — sort by Time, User, Action, or Entity Type
          </li>
          <li>
            <strong>Clear filters</strong> — a link appears when filters are active to reset them
            all at once
          </li>
        </ul>
      </div>

      {/* Date Range Filter */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Using the Date Range Filter</h3>
        <StepLabel n={1}>
          Click the <strong>Date range</strong> button in the filter toolbar
        </StepLabel>
        <StepLabel n={2}>Select a start and/or end date, then click Apply</StepLabel>
        <Preview>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Input type="date" disabled defaultValue="2025-03-01" />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input type="date" disabled defaultValue="2025-03-28" />
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" disabled>
                Clear
              </Button>
              <Button size="sm" disabled>
                Apply
              </Button>
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>Both dates are optional — you can set just a start date or just an end date.</li>
          <li>
            The active date range is displayed on the button (e.g. &quot;Mar 01, 2025 - Mar 28,
            2025&quot;).
          </li>
          <li>Click Clear inside the popover to remove the date filter.</li>
        </ul>
      </div>

      {/* Audit Log Table */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Audit Log Table</h3>
        <p>Each row represents a single logged event with the following columns:</p>

        <Preview wide>
          <div className="space-y-0 rounded-md border text-xs">
            <div className="text-muted-foreground grid grid-cols-6 gap-2 border-b px-3 py-2 font-medium">
              <span>Time</span>
              <span>User</span>
              <span>Action</span>
              <span>Entity Type</span>
              <span>Description</span>
              <span>IP Address</span>
            </div>
            {[
              {
                time: "Mar 28, 2025 at 2:30 PM",
                user: "Admin User",
                action: "LOGIN",
                entity: "USER",
                description: "Admin User logged in successfully",
                ip: "192.168.1.10",
              },
              {
                time: "Mar 28, 2025 at 2:35 PM",
                user: "Admin User",
                action: "CUSTOMER_CREATED",
                entity: "CUSTOMER",
                description: "Created customer Ama Darko (KSS-0042)",
                ip: "192.168.1.10",
              },
              {
                time: "Mar 28, 2025 at 3:00 PM",
                user: "Kofi Mensah",
                action: "TRANSACTION_DEPOSIT",
                entity: "TRANSACTION",
                description: "Recorded deposit of GHS 500.00 for Ama Darko",
                ip: "192.168.1.25",
              },
            ].map((row) => (
              <div
                key={row.time + row.action}
                className="grid grid-cols-6 items-center gap-2 border-b px-3 py-2.5 last:border-0"
              >
                <span className="text-muted-foreground whitespace-nowrap">{row.time}</span>
                <span className="font-medium whitespace-nowrap">{row.user}</span>
                <span>
                  <Badge variant="accent" className="text-[10px]">
                    {row.action}
                  </Badge>
                </span>
                <span className="text-muted-foreground">{row.entity}</span>
                <span>{row.description}</span>
                <span className="text-muted-foreground font-mono text-[10px]">{row.ip}</span>
              </div>
            ))}
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Time</strong> — full timestamp of when the action occurred
          </li>
          <li>
            <strong>User</strong> — the admin or agent who performed the action
          </li>
          <li>
            <strong>Action</strong> — colour-coded badge showing the action type (e.g. LOGIN,
            CUSTOMER_CREATED, TRANSACTION_DEPOSIT)
          </li>
          <li>
            <strong>Entity Type</strong> — the category of entity affected (User, Customer,
            Transaction, Branch, etc.)
          </li>
          <li>
            <strong>Description</strong> — a human-readable summary of what happened
          </li>
          <li>
            <strong>IP Address</strong> — the IP address from which the action was performed (hidden
            on smaller screens)
          </li>
        </ul>
      </div>

      {/* Common Actions */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Common Logged Actions</h3>
        <p>The system automatically logs a wide range of actions. Here are the most common ones:</p>

        <div className="space-y-2 pl-1">
          <div>
            <strong className="text-foreground">Authentication</strong>
            <ul className="list-inside list-disc space-y-0.5 pl-2">
              <li>LOGIN, LOGOUT, PASSWORD_SET, PASSWORD_RESET</li>
            </ul>
          </div>
          <div>
            <strong className="text-foreground">User Management</strong>
            <ul className="list-inside list-disc space-y-0.5 pl-2">
              <li>ADMIN_CREATED, ADMIN_UPDATED, ADMIN_DELETED</li>
              <li>AGENT_CREATED, AGENT_UPDATED, AGENT_DELETED</li>
              <li>USER_ROLE_CHANGED</li>
            </ul>
          </div>
          <div>
            <strong className="text-foreground">Customer Management</strong>
            <ul className="list-inside list-disc space-y-0.5 pl-2">
              <li>CUSTOMER_CREATED, CUSTOMER_UPDATED, CUSTOMER_DELETED, CUSTOMER_VIEWED</li>
            </ul>
          </div>
          <div>
            <strong className="text-foreground">Transactions</strong>
            <ul className="list-inside list-disc space-y-0.5 pl-2">
              <li>TRANSACTION_DEPOSIT, TRANSACTION_DELETED</li>
              <li>
                TRANSACTION_WITHDRAWAL_REQUEST, TRANSACTION_WITHDRAWAL_APPROVED,
                TRANSACTION_WITHDRAWAL_REJECTED
              </li>
              <li>SERVICE_CHARGE</li>
            </ul>
          </div>
          <div>
            <strong className="text-foreground">Branches</strong>
            <ul className="list-inside list-disc space-y-0.5 pl-2">
              <li>BRANCH_CREATED, BRANCH_UPDATED, BRANCH_DELETED, BRANCH_VIEWED</li>
            </ul>
          </div>
          <div>
            <strong className="text-foreground">Data Operations</strong>
            <ul className="list-inside list-disc space-y-0.5 pl-2">
              <li>DATA_EXPORTED, DATA_IMPORTED</li>
              <li>BULK_DEACTIVATE, BULK_REACTIVATE, BULK_DELETE</li>
            </ul>
          </div>
        </div>
      </div>

      <GuideNavigation />
    </div>
  );
}
