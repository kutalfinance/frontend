import { Download, DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { AdminNavPreview, GuideNavigation, GuideTitle, Preview, StepLabel } from "./components";

export default function AdminReportsGuide() {
  return (
    <div className="text-foreground/80 space-y-8 text-sm leading-relaxed">
      <GuideTitle badge="Admin">Reports</GuideTitle>

      <p>
        The system provides three types of downloadable reports: a branch report, an admin report,
        and a customer account statement. The branch and admin reports are on the dedicated Reports
        page. The customer statement is accessed from the Customers page. All reports support date
        ranges and can be downloaded as PDF or CSV.
      </p>

      {/* Reports Page */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Accessing Reports</h3>
        <p>
          Click <strong>Reports</strong> in the navigation bar to open the Reports page.
        </p>
        <AdminNavPreview highlight="Reports" />
      </div>

      {/* Branch Report */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Branch Report</h3>
        <p>
          The branch report summarises all deposits, withdrawals, and pending requests recorded by a
          specific branch&apos;s agent for a given date range.
        </p>

        <StepLabel n={1}>Select a branch from the dropdown</StepLabel>
        <StepLabel n={2}>Select a date range — From and To both default to today</StepLabel>
        <StepLabel n={3}>
          Click <strong>Download PDF</strong> for a printable report, or{" "}
          <strong>Download CSV</strong> for a spreadsheet
        </StepLabel>

        <Preview>
          <Card className="gap-2">
            <CardHeader>
              <CardTitle className="text-sm">Branch Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Branch</Label>
                <Button
                  variant="outline"
                  className="w-full justify-start font-normal"
                  disabled
                  size="sm"
                >
                  <span className="text-muted-foreground text-xs">Select a branch</span>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">From</Label>
                  <Input type="date" disabled defaultValue="2025-03-28" className="text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">To</Label>
                  <Input type="date" disabled defaultValue="2025-03-28" className="text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" size="sm" disabled>
                  Download CSV
                </Button>
                <Button size="sm" disabled>
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>A branch must be selected before either download button becomes active.</li>
          <li>
            The PDF includes three sections: deposits, approved withdrawals, and pending withdrawals.
          </li>
          <li>
            The CSV contains the same data in spreadsheet format with columns: Time, Amount, Customer
            Name, Account Number, Phone Number.
          </li>
        </ul>
      </div>

      {/* Admin Report */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Admin Report</h3>
        <p>
          The admin report summarises all transactions across every branch — deposits, withdrawals,
          service charges, and pending approvals — for a given date range.
        </p>

        <StepLabel n={1}>Select a date range — From and To both default to today</StepLabel>
        <StepLabel n={2}>
          Click <strong>Download PDF</strong> or <strong>Download CSV</strong>
        </StepLabel>

        <Preview>
          <Card className="gap-2">
            <CardHeader>
              <CardTitle className="text-sm">Admin Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-xs">
                Summary report across all branches — deposits, withdrawals, service charges and
                pending approvals.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">From</Label>
                  <Input type="date" disabled defaultValue="2025-03-28" className="text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">To</Label>
                  <Input type="date" disabled defaultValue="2025-03-28" className="text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" size="sm" disabled>
                  Download CSV
                </Button>
                <Button size="sm" disabled>
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            The PDF lists all branches with totals for deposits, withdrawals, service charges,
            pending amount, and new customers.
          </li>
          <li>The CSV contains the same data per branch with a grand total row at the bottom.</li>
          <li>
            The admin report is also accessible from the profile dropdown via{" "}
            <strong>Download report</strong> — this opens the same dialog with the same date range
            and PDF / CSV options.
          </li>
        </ul>
      </div>

      {/* Customer Account Statement */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Customer Account Statement</h3>
        <p>
          The customer account statement shows all transactions for a specific customer within an
          optional date range. It is accessed from the Customers page, not the Reports page.
        </p>

        <StepLabel n={1}>
          Navigate to the <strong>Customers</strong> page and find the customer in the table
        </StepLabel>
        <StepLabel n={2}>
          Click the download icon (<Download className="inline size-3.5" />) on their row
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
            <div className="grid grid-cols-8 items-center gap-2 px-3 py-2.5">
              <span className="text-primary font-medium whitespace-nowrap">Ama Darko</span>
              <span className="font-mono">KSS-0042</span>
              <span>
                <div className="text-muted-foreground leading-tight">
                  <div>024 555 1234</div>
                  <div className="truncate">ama@mail.com</div>
                </div>
              </span>
              <span>Kumasi</span>
              <span className="whitespace-nowrap">₵50.00</span>
              <span className="text-muted-foreground">15/01/25</span>
              <span className="text-muted-foreground">28/03/25</span>
              <span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="border-primary/30 size-7 border"
                  disabled
                >
                  <Download className="size-3.5" />
                </Button>
              </span>
            </div>
          </div>
        </Preview>

        <StepLabel n={3}>Select an optional date range and click Download Statement</StepLabel>
        <Preview>
          <div className="space-y-4">
            <div>
              <p className="text-foreground text-sm font-semibold">Download Account Statement</p>
              <p className="text-muted-foreground text-xs">
                Download account statement for <strong>Ama Darko</strong>. Select a date range or
                leave empty to download the last 3 months.
              </p>
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
          <li>The statement downloads as a PDF file only.</li>
        </ul>
      </div>

      {/* Agent Report from Users Page */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Agent Report (Users Page)</h3>
        <p>
          Individual agent reports can also be downloaded directly from the Users page. Navigate to{" "}
          <strong>Users</strong>, find the agent in the table, and click the download icon (
          <DownloadIcon className="inline size-3.5" />) on their row. Select a date range and click{" "}
          <strong>Download Report</strong>.
        </p>
        <p className="text-muted-foreground text-xs">
          Only agent users have the download icon. This downloads a PDF only — use the Reports page
          for the CSV version.
        </p>
      </div>

      <GuideNavigation />
    </div>
  );
}
