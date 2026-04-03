import { ArrowUpDown, ChevronDown, Plus, SearchIcon, SquarePen, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heading, Paragraph } from "@/components/ui/text";

import { AdminNavPreview, GuideNavigation, GuideTitle, Preview, StepLabel } from "./components";

export default function AdminBranchesGuide() {
  return (
    <div className="text-foreground/80 space-y-8 text-sm leading-relaxed">
      <GuideTitle badge="Admin">Managing Branches</GuideTitle>

      <p>
        The Branches page lets you manage all branch locations. Each branch has an assigned agent, one
        or more approvers, and links to its customers. From here you can create, edit, delete branches,
        and download branch reports.
      </p>

      {/* Accessing Branches */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Accessing Branches</h3>
        <p>
          Click <strong>Branches</strong> in the navigation bar to open the Branches page.
        </p>
        <AdminNavPreview highlight="Branches" />
      </div>

      {/* Page Overview */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Page Overview</h3>
        <p>
          The page header shows the title with a single action button, followed by the filter bar and
          branches table.
        </p>
        <Preview wide>
          <div className="flex items-center justify-between">
            <div>
              <Heading variant="h2">Branch Management</Heading>
              <Paragraph className="text-muted-foreground text-sm">
                Manage branch locations and agent assignments. Create new branches, assign agents,
                and track branch performance.
              </Paragraph>
            </div>
            <Button>
              <Plus className="size-4" />
              Add branch
            </Button>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Add branch</strong> — opens the create branch form
          </li>
        </ul>
      </div>

      {/* Creating a Branch */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Creating a Branch</h3>
        <p>
          Click <strong>Add branch</strong> to open the creation dialog. All four fields are required.
        </p>
        <Preview>
          <div className="space-y-4">
            <div>
              <Paragraph className="text-foreground text-sm font-semibold">
                Create New Branch
              </Paragraph>
              <Paragraph className="text-muted-foreground text-xs">
                Add a new branch location and assign an agent to manage it.
              </Paragraph>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Branch Name</Label>
                <Input disabled placeholder="Enter branch name" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Location</Label>
                <Input disabled placeholder="Enter branch location" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Assigned Agent</Label>
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal"
                  disabled
                >
                  <span className="text-muted-foreground text-xs">Select an agent</span>
                  <ChevronDown className="text-muted-foreground size-4" />
                </Button>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Approvers</Label>
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal"
                  disabled
                >
                  <span className="text-muted-foreground text-xs">Select approvers</span>
                  <ChevronDown className="text-muted-foreground size-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" disabled>
                Cancel
              </Button>
              <Button size="sm" disabled>
                Create Branch
              </Button>
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Branch Name</strong> — a unique name for the branch
          </li>
          <li>
            <strong>Location</strong> — the physical address or area
          </li>
          <li>
            <strong>Assigned Agent</strong> — a searchable dropdown showing only agents that are not
            already assigned to another branch
          </li>
          <li>
            <strong>Approvers</strong> — a multi-select dropdown of administrators with approver
            access. Selected approvers appear as removable chips below the field.
          </li>
          <li>
            If no agents exist yet, the dialog shows a prompt to create one first.
          </li>
        </ul>
      </div>

      {/* Searching & Sorting */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Searching &amp; Sorting</h3>
        <p>Use the toolbar above the table to find specific branches.</p>
        <Preview wide>
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1">
              <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input disabled placeholder="Search branches..." className="w-full pl-9" />
            </div>

            <Button size="sm" variant="outline" disabled>
              Agent: All agents
            </Button>

            <Button size="sm" variant="outline" disabled>
              <ArrowUpDown className="size-4" />
              Sort by: Created At
            </Button>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Search</strong> — filter by branch name or location
          </li>
          <li>
            <strong>Agent</strong> — filter branches by their assigned agent
          </li>
          <li>
            <strong>Sort by</strong> — sort by Name, Location, or Created date
          </li>
        </ul>
      </div>

      {/* Branch Table & Actions */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Branch Table &amp; Actions</h3>
        <p>The table displays all branches with the following columns:</p>

        <Preview wide>
          <div className="space-y-0 rounded-md border text-xs">
            {/* Table header */}
            <div className="text-muted-foreground grid grid-cols-6 gap-2 border-b px-3 py-2 font-medium">
              <span>Branch Name</span>
              <span>Location</span>
              <span>Agent</span>
              <span>Approvers</span>
              <span>Created</span>
              <span />
            </div>
            {/* Sample rows */}
            {[
              {
                name: "Kumasi Central",
                location: "Adum, Kumasi",
                agent: "Ama Serwaa",
                approvers: 2,
                date: "15/01/2025",
              },
              {
                name: "Accra Main",
                location: "Osu, Accra",
                agent: "Kofi Mensah",
                approvers: 1,
                date: "22/02/2025",
              },
            ].map((row) => (
              <div
                key={row.name}
                className="grid grid-cols-6 items-center gap-2 border-b px-3 py-2.5 last:border-0"
              >
                <span className="text-primary font-medium whitespace-nowrap">{row.name}</span>
                <span className="text-muted-foreground">{row.location}</span>
                <span>{row.agent}</span>
                <span>
                  {row.approvers > 1 ? (
                    <span className="underline decoration-dotted">{row.approvers} approvers</span>
                  ) : (
                    "1 approver"
                  )}
                </span>
                <span className="text-muted-foreground">{row.date}</span>
                <span className="flex gap-1">
                  <Button variant="ghost" size="icon" className="size-7" disabled>
                    <SquarePen className="size-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-7" disabled>
                    <Trash2 className="text-destructive size-3.5" />
                  </Button>
                </span>
              </div>
            ))}
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Branch Name</strong> — clickable link that navigates to the Customers page
            filtered by that branch
          </li>
          <li>
            <strong>Approvers</strong> — if more than one, hover to see all names in a tooltip
          </li>
          <li>
            <strong>Edit</strong> (<SquarePen className="inline size-3.5" />) — opens the edit dialog
            with the same fields as creation, pre-filled with current values
          </li>
          <li>
            <strong>Delete</strong> (<Trash2 className="text-destructive inline size-3.5" />) —
            permanently deletes the branch after confirmation.{" "}
            <strong className="text-destructive">This action cannot be undone.</strong>
          </li>
        </ul>
      </div>

      {/* Editing a Branch */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Editing a Branch</h3>
        <p>
          Click the edit icon (<SquarePen className="inline size-3.5" />) on any row to open the edit
          dialog. It contains the same fields as the creation form, pre-filled with the branch&apos;s
          current details.
        </p>
        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>You can change the name, location, assigned agent, and approvers.</li>
          <li>
            When approvers are changed, newly added approvers are automatically notified about any
            pending withdrawals for that branch.
          </li>
        </ul>
      </div>

      <GuideNavigation />
    </div>
  );
}
