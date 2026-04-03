import {
  Archive,
  ArrowUpDown,
  Building2,
  Circle,
  Contact,
  DownloadIcon,
  Plus,
  RotateCcw,
  SearchIcon,
  Trash2,
  Users,
  XIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading, Paragraph } from "@/components/ui/text";

import { AdminNavPreview, GuideNavigation, GuideTitle, Preview, StepLabel } from "./components";

export default function AdminUsersGuide() {
  return (
    <div className="text-foreground/80 space-y-8 text-sm leading-relaxed">
      <GuideTitle badge="Admin">Managing Users</GuideTitle>

      <p>
        The Users page is where you manage all system users — both Admins and Agents. From here you
        can create new users, search and filter the list, deactivate or restore accounts, and
        download agent reports.
      </p>

      {/* Accessing Users */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Accessing Users</h3>
        <p>
          Click <strong>Users</strong> in the navigation bar to open the Users page.
        </p>
        <AdminNavPreview highlight="Users" />
      </div>

      {/* Page Header */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Page Overview</h3>
        <p>
          At the top of the page you'll see the heading with two action buttons, followed by summary
          metric cards.
        </p>
        <Preview wide>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <Heading variant="h2">User Management</Heading>
                <Paragraph className="text-muted-foreground text-sm">
                  Monitor key metrics and manage users.
                </Paragraph>
              </div>
              <div className="flex gap-2">
                <Button>
                  <Plus className="size-4" />
                  Add user
                </Button>
                <Button variant="outline">
                  <Archive className="size-4" />
                </Button>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Building2, label: "Branches", value: "5" },
                { icon: Contact, label: "Customers", value: "128" },
                { icon: Users, label: "Users", value: "12" },
              ].map((metric) => (
                <Card key={metric.label} className="gap-2">
                  <CardHeader>
                    <div className="w-fit rounded-md border p-2">
                      <metric.icon className="text-muted-foreground size-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Paragraph className="text-muted-foreground text-xs">{metric.label}</Paragraph>
                    <Heading variant="h3">{metric.value}</Heading>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Add user</strong> — opens the create user form
          </li>
          <li>
            <strong>Archive icon</strong> — opens the deactivated users panel
          </li>
          <li>
            <strong>Metric cards</strong> — show total branches, customers, and users in the system
          </li>
        </ul>
      </div>

      {/* Creating a User */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Creating a User</h3>
        <p>
          Click the <strong>Add user</strong> button to open a two-step creation wizard inside a
          dialog.
        </p>

        <StepLabel n={1}>Choose the user type</StepLabel>
        <p>Select whether the new user will be an Agent or an Administrator.</p>
        <Preview>
          <div className="space-y-4">
            <div>
              <Paragraph className="text-foreground text-sm font-semibold">Create New User</Paragraph>
              <Paragraph className="text-muted-foreground text-xs">
                Select the type of user account to create.
              </Paragraph>
            </div>

            {/* Radio options */}
            <div className="space-y-2">
              {[
                {
                  label: "Agent",
                  description: "Limited access to assigned tasks and support tickets",
                  checked: true,
                },
                {
                  label: "Administrator",
                  description: "Access to administrative panel and user management",
                  checked: false,
                },
              ].map((option) => (
                <div
                  key={option.label}
                  className={`flex items-start gap-3 rounded-md border p-4 ${option.checked ? "border-primary" : "border-input"}`}
                >
                  <div className="flex-1 space-y-0.5">
                    <Label className="text-sm">{option.label}</Label>
                    <Paragraph className="text-muted-foreground text-xs">
                      {option.description}
                    </Paragraph>
                  </div>
                  <Circle
                    className={`size-4 shrink-0 ${option.checked ? "text-primary fill-primary" : "text-muted-foreground"}`}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" disabled>
                Cancel
              </Button>
              <Button size="sm" disabled>
                Continue
              </Button>
            </div>
          </div>
        </Preview>

        <StepLabel n={2}>Enter user details</StepLabel>
        <p>
          Fill in the name, email, and — for administrators — permission toggles. Then click{" "}
          <strong>Create user</strong>.
        </p>
        <Preview>
          <div className="space-y-4">
            <div>
              <Paragraph className="text-foreground text-sm font-semibold">Create New User</Paragraph>
              <Paragraph className="text-muted-foreground text-xs">
                Enter the user details and permissions.
              </Paragraph>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Full Name</Label>
                <Input disabled placeholder="Enter admin full name" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email Address</Label>
                <Input disabled placeholder="Enter admin email address" />
              </div>

              {/* Admin-only toggles */}
              <div className="flex items-start justify-between gap-2 rounded-lg border p-3">
                <div className="flex-1 space-y-0.5">
                  <Label className="text-xs">Approver Access</Label>
                  <Paragraph className="text-muted-foreground text-xs">
                    Allow this administrator to approve transactions and critical actions
                  </Paragraph>
                </div>
                <Checkbox checked disabled />
              </div>
              <div className="flex items-start justify-between gap-2 rounded-lg border p-3">
                <div className="flex-1 space-y-0.5">
                  <Label className="text-xs">Super Administrator</Label>
                  <Paragraph className="text-muted-foreground text-xs">
                    Grant full administrative privileges and user management capabilities
                  </Paragraph>
                </div>
                <Checkbox disabled />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" disabled>
                Back
              </Button>
              <Button size="sm" disabled>
                Create user
              </Button>
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Agents</strong> — only require a name and email. They receive limited, branch-scoped
            access.
          </li>
          <li>
            <strong>Administrators</strong> — additionally show the <strong>Approver Access</strong>{" "}
            toggle (on by default) and the <strong>Super Administrator</strong> toggle (visible only to
            super admins).
          </li>
          <li>
            After creation, the new user receives a login email with their credentials.
          </li>
        </ul>
      </div>

      {/* Searching, Filtering & Sorting */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Searching, Filtering &amp; Sorting</h3>
        <p>
          Below the metric cards is a toolbar that lets you narrow down the user list.
        </p>
        <Preview wide>
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1">
              <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input disabled placeholder="Search users..." className="w-full pl-9" />
            </div>

            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All roles</TabsTrigger>
                <TabsTrigger value="ADMIN">Admins</TabsTrigger>
                <TabsTrigger value="AGENT">Agents</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button size="sm" variant="outline" disabled>
              Status: All
            </Button>

            <Button size="sm" variant="outline" disabled>
              <ArrowUpDown className="size-4" />
              Sort by: Created At
            </Button>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Search</strong> — type a name or email to filter instantly (debounced)
          </li>
          <li>
            <strong>Role tabs</strong> — toggle between All roles, Admins only, or Agents only
          </li>
          <li>
            <strong>Status</strong> — filter by Active or Inactive status
          </li>
          <li>
            <strong>Sort by</strong> — sort the list by Name, Email, Role, or Created date
          </li>
          <li>
            A <strong>Clear filters</strong> link appears when any filter is active
          </li>
        </ul>
      </div>

      {/* User Actions */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">User Actions</h3>
        <p>The user table displays all active users with the following columns:</p>

        <Preview wide>
          <div className="space-y-0 rounded-md border text-xs">
            {/* Table header */}
            <div className="text-muted-foreground grid grid-cols-6 gap-2 border-b px-3 py-2 font-medium">
              <span>
                <Checkbox disabled />
              </span>
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Created</span>
              <span />
            </div>
            {/* Sample rows */}
            {[
              {
                name: "Kwame Mensah",
                email: "kwame@kss.com",
                role: "ADMIN",
                date: "15/01/2025",
              },
              {
                name: "Ama Serwaa",
                email: "ama@kss.com",
                role: "AGENT",
                date: "22/02/2025",
              },
              {
                name: "Kofi Asante",
                email: "kofi@kss.com",
                role: "ADMIN",
                superAdmin: true,
                date: "03/01/2025",
              },
            ].map((row) => (
              <div
                key={row.name}
                className="grid grid-cols-6 items-center gap-2 border-b px-3 py-2.5 last:border-0"
              >
                <span>
                  <Checkbox disabled />
                </span>
                <span className="font-medium whitespace-nowrap">{row.name}</span>
                <span className="text-muted-foreground truncate">{row.email}</span>
                <span>
                  {row.superAdmin ? (
                    <Badge variant="destructive" className="text-[10px]">
                      SUPER ADMIN
                    </Badge>
                  ) : (
                    <Badge
                      variant={row.role === "ADMIN" ? "default" : "accent"}
                      className="text-[10px]"
                    >
                      {row.role}
                    </Badge>
                  )}
                </span>
                <span className="text-muted-foreground">{row.date}</span>
                <span className="flex gap-1">
                  <Button variant="ghost" size="icon" className="size-7" disabled>
                    <Archive className="text-destructive size-3.5" />
                  </Button>
                  {row.role === "AGENT" && (
                    <Button variant="ghost" size="icon" className="size-7" disabled>
                      <DownloadIcon className="text-muted-foreground size-3.5" />
                    </Button>
                  )}
                </span>
              </div>
            ))}
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Deactivate</strong> (<Archive className="text-destructive inline size-3.5" />) —
            deactivates a user&apos;s account. A confirmation dialog appears before proceeding. This
            action is reversible.
          </li>
          <li>
            <strong>Download report</strong> (
            <DownloadIcon className="text-muted-foreground inline size-3.5" />) — available only for
            Agent users. Opens a dialog to select a date and download the agent&apos;s daily report as a
            PDF.
          </li>
        </ul>

        <h4 className="text-foreground text-sm font-semibold">Bulk actions</h4>
        <p>
          Select multiple users using the checkboxes to reveal a floating action bar at the bottom of
          the screen.
        </p>
        <Preview wide>
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-lg border px-4 py-2 shadow-sm">
              <Paragraph className="text-muted-foreground text-xs">3 users selected</Paragraph>
              <Separator orientation="vertical" className="data-[orientation=vertical]:h-5" />
              <Button variant="destructive-outline" size="sm">
                Deactivate
              </Button>
              <Separator orientation="vertical" className="data-[orientation=vertical]:h-5" />
              <Button variant="ghost" size="icon" className="size-7">
                <XIcon className="size-4" />
              </Button>
            </div>
          </div>
        </Preview>
        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Deactivate</strong> — deactivates all selected users at once
          </li>
          <li>
            <strong>X</strong> — clears the selection
          </li>
        </ul>
      </div>

      {/* Deactivated Users */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Deactivated Users</h3>
        <p>
          Click the <strong>Archive</strong> (<Archive className="inline size-3.5" />) button in the
          page header to open the deactivated users panel. This slides in from the right as a side
          sheet.
        </p>

        <Preview wide>
          <div className="space-y-4">
            <div>
              <Paragraph className="text-foreground text-sm font-semibold">
                Deactivated Users
              </Paragraph>
              <Paragraph className="text-muted-foreground text-xs">
                View and manage deactivated user accounts. You can reactivate users to restore their
                access to the system.
              </Paragraph>
            </div>

            <div className="space-y-0 rounded-md border text-xs">
              {/* Table header */}
              <div className="text-muted-foreground grid grid-cols-6 gap-2 border-b px-3 py-2 font-medium">
                <span>
                  <Checkbox disabled />
                </span>
                <span>Name</span>
                <span>Email</span>
                <span>Role</span>
                <span>Deactivated</span>
                <span />
              </div>
              {[
                {
                  name: "Yaw Boateng",
                  email: "yaw@kss.com",
                  role: "AGENT",
                  date: "10/03/2025",
                },
                {
                  name: "Efua Owusu",
                  email: "efua@kss.com",
                  role: "ADMIN",
                  date: "28/02/2025",
                },
              ].map((row) => (
                <div
                  key={row.name}
                  className="grid grid-cols-6 items-center gap-2 border-b px-3 py-2.5 last:border-0"
                >
                  <span>
                    <Checkbox disabled />
                  </span>
                  <span className="font-medium whitespace-nowrap">{row.name}</span>
                  <span className="text-muted-foreground truncate">{row.email}</span>
                  <span>
                    <Badge
                      variant={row.role === "ADMIN" ? "default" : "accent"}
                      className="text-[10px]"
                    >
                      {row.role}
                    </Badge>
                  </span>
                  <span className="text-muted-foreground">{row.date}</span>
                  <span className="flex gap-1">
                    <Button variant="outline" size="icon" className="size-7" disabled>
                      <RotateCcw className="size-3.5" />
                    </Button>
                    <Button variant="destructive-outline" size="icon" className="size-7" disabled>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Restore</strong> (<RotateCcw className="inline size-3.5" />) — reactivates the
            user, restoring their access to the system. A confirmation dialog appears.
          </li>
          <li>
            <strong>Delete</strong> (<Trash2 className="text-destructive inline size-3.5" />) —
            permanently deletes the user account.{" "}
            <strong className="text-destructive">This action cannot be undone.</strong>
          </li>
          <li>
            <strong>Bulk restore</strong> — select multiple deactivated users and use the floating
            action bar to restore them all at once.
          </li>
        </ul>
      </div>

      <GuideNavigation />
    </div>
  );
}
