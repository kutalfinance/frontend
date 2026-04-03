import { Archive, Download, DownloadIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Paragraph } from "@/components/ui/text";

import { AdminNavPreview, GuideNavigation, GuideTitle, Preview, StepLabel } from "./components";

export default function AdminReportsGuide() {
  return (
    <div className="text-foreground/80 space-y-8 text-sm leading-relaxed">
      <GuideTitle badge="Admin">Reports</GuideTitle>

      <p>
        The system provides three types of downloadable PDF reports: an admin daily report, an agent
        daily report, and a customer account statement. There is no dedicated reports page — each
        report is accessed from a different part of the app.
      </p>

      {/* Admin Daily Report */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Admin Daily Report</h3>
        <p>
          The admin daily report summarises all transactions across the system for a given date.
        </p>

        <StepLabel n={1}>Click your profile avatar in the top-right corner of the header</StepLabel>
        <Preview wide>
          <div className="flex items-center justify-end gap-3">
            <span className="text-muted-foreground text-xs">... nav items</span>
            <Avatar className="border-primary size-8 border-2">
              <AvatarFallback className="text-xs">AD</AvatarFallback>
            </Avatar>
          </div>
        </Preview>

        <StepLabel n={2}>
          Select <strong>Download report</strong> from the dropdown menu
        </StepLabel>
        <Preview>
          <div className="rounded-md border text-xs shadow-sm">
            <div className="px-3 py-2">
              <p className="text-foreground text-sm font-medium">Admin User</p>
              <p className="text-muted-foreground">admin@example.com</p>
            </div>
            <Separator />
            <div className="py-1">
              <div className="text-muted-foreground px-3 py-1.5">Pending approvals</div>
              <div className="bg-accent rounded-sm px-3 py-1.5 font-medium">Download report</div>
              <div className="text-muted-foreground px-3 py-1.5">User guide</div>
            </div>
            <Separator />
            <div className="py-1">
              <div className="text-muted-foreground px-3 py-1.5">Log out</div>
            </div>
          </div>
        </Preview>

        <StepLabel n={3}>Select a date and click Download Report</StepLabel>
        <Preview>
          <div className="space-y-4">
            <div>
              <Paragraph className="text-foreground text-sm font-semibold">
                Download Admin Report
              </Paragraph>
              <Paragraph className="text-muted-foreground text-xs">
                Download daily admin report. Select a date to generate the report.
              </Paragraph>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Report Date</Label>
              <Input type="date" disabled defaultValue="2025-03-28" />
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" disabled>
                Cancel
              </Button>
              <Button size="sm" disabled>
                Download Report
              </Button>
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>The date defaults to today.</li>
          <li>The report downloads as a PDF file.</li>
        </ul>
      </div>

      {/* Agent Daily Report */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Agent Daily Report</h3>
        <p>
          The agent daily report summarises all transactions recorded by a specific agent for a given
          date.
        </p>

        <StepLabel n={1}>
          Navigate to the <strong>Users</strong> page
        </StepLabel>
        <AdminNavPreview highlight="Users" />

        <StepLabel n={2}>
          Find the agent in the table and click the download icon (
          <DownloadIcon className="inline size-3.5" />) on their row
        </StepLabel>
        <Preview wide>
          <div className="space-y-0 rounded-md border text-xs">
            <div className="text-muted-foreground grid grid-cols-6 gap-2 border-b px-3 py-2 font-medium">
              <span />
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Created</span>
              <span />
            </div>
            {[
              {
                name: "Kofi Mensah",
                email: "kofi@mail.com",
                role: "AGENT" as const,
                date: "15/01/2025",
              },
              {
                name: "Ama Serwaa",
                email: "ama@mail.com",
                role: "AGENT" as const,
                date: "22/02/2025",
              },
            ].map((row) => (
              <div
                key={row.name}
                className="grid grid-cols-6 items-center gap-2 border-b px-3 py-2.5 last:border-0"
              >
                <span />
                <span className="font-medium whitespace-nowrap">{row.name}</span>
                <span className="text-muted-foreground">{row.email}</span>
                <span>
                  <Badge variant="accent">{row.role}</Badge>
                </span>
                <span className="text-muted-foreground">{row.date}</span>
                <span className="flex gap-1">
                  <Button variant="ghost" size="icon" className="size-7" disabled>
                    <Archive className="text-destructive size-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-7 border border-primary/30">
                    <DownloadIcon className="text-muted-foreground size-3.5" />
                  </Button>
                </span>
              </div>
            ))}
          </div>
        </Preview>
        <p className="text-muted-foreground text-xs">
          Only agent users have the download icon. Admin users only show the deactivate button.
        </p>

        <StepLabel n={3}>Select a date and click Download Report</StepLabel>
        <Preview>
          <div className="space-y-4">
            <div>
              <Paragraph className="text-foreground text-sm font-semibold">
                Download Daily Report
              </Paragraph>
              <Paragraph className="text-muted-foreground text-xs">
                Download daily report for Kofi Mensah. Select a date to generate the report.
              </Paragraph>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Report Date</Label>
              <Input type="date" disabled defaultValue="2025-03-28" />
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" disabled>
                Cancel
              </Button>
              <Button size="sm" disabled>
                Download Report
              </Button>
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>The date defaults to today.</li>
          <li>The report downloads as a PDF file.</li>
        </ul>
      </div>

      {/* Customer Account Statement */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Customer Account Statement</h3>
        <p>
          The customer account statement shows all transactions for a specific customer within an
          optional date range.
        </p>

        <StepLabel n={1}>
          Navigate to the <strong>Customers</strong> page
        </StepLabel>
        <AdminNavPreview highlight="Customers" />

        <StepLabel n={2}>
          Find the customer in the table and click the download icon (
          <Download className="inline size-3.5" />) on their row
        </StepLabel>
        <Preview wide>
          <div className="space-y-0 rounded-md border text-xs">
            <div className="text-muted-foreground grid grid-cols-8 gap-2 border-b px-3 py-2 font-medium">
              <span>Name</span>
              <span>Account #</span>
              <span>Contact</span>
              <span>Branch</span>
              <span>Contrib.</span>
              <span>Registered</span>
              <span>Last Dep.</span>
              <span />
            </div>
            {[
              {
                name: "Ama Darko",
                account: "KSS-0042",
                phone: "024 555 1234",
                email: "ama@mail.com",
                branch: "Kumasi",
                contribution: "₵50.00",
                registered: "15/01/25",
                lastDeposit: "28/03/25",
              },
            ].map((row) => (
              <div
                key={row.name}
                className="grid grid-cols-8 items-center gap-2 border-b px-3 py-2.5 last:border-0"
              >
                <span className="text-primary font-medium whitespace-nowrap">{row.name}</span>
                <span className="font-mono">{row.account}</span>
                <span>
                  <div className="text-muted-foreground leading-tight">
                    <div>{row.phone}</div>
                    <div className="truncate">{row.email}</div>
                  </div>
                </span>
                <span>{row.branch}</span>
                <span className="whitespace-nowrap">{row.contribution}</span>
                <span className="text-muted-foreground">{row.registered}</span>
                <span className="text-muted-foreground">{row.lastDeposit}</span>
                <span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 border border-primary/30"
                    disabled
                  >
                    <Download className="size-3.5" />
                  </Button>
                </span>
              </div>
            ))}
          </div>
        </Preview>

        <StepLabel n={3}>
          Select an optional date range and click Download Statement
        </StepLabel>
        <Preview>
          <div className="space-y-4">
            <div>
              <Paragraph className="text-foreground text-sm font-semibold">
                Download Account Statement
              </Paragraph>
              <Paragraph className="text-muted-foreground text-xs">
                Download account statement for <strong>Ama Darko</strong>. Select a date range or
                leave empty to download the last 3 months.
              </Paragraph>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Start Date (Optional)</Label>
                <Input type="date" disabled />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">End Date (Optional)</Label>
                <Input type="date" disabled />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" disabled>
                Cancel
              </Button>
              <Button size="sm" disabled>
                Download Statement
              </Button>
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            Both dates are optional — leave them empty and the statement defaults to the last 3
            months.
          </li>
          <li>The statement downloads as a PDF file.</li>
        </ul>
      </div>

      <GuideNavigation />
    </div>
  );
}
