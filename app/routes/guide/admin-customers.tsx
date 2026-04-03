import { ArrowUpDown, ChevronDown, Download, Plus, SearchIcon, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heading, Paragraph } from "@/components/ui/text";

import { AdminNavPreview, GuideNavigation, GuideTitle, Preview, StepLabel } from "./components";

export default function AdminCustomersGuide() {
  return (
    <div className="text-foreground/80 space-y-8 text-sm leading-relaxed">
      <GuideTitle badge="Admin">Managing Customers</GuideTitle>

      <p>
        The Customers page lets you manage all customer accounts. Each customer belongs to a branch
        and has a contribution amount, contact information, and a next of kin. You can create
        customers individually, upload them in bulk via CSV, search and filter the list, and download
        account statements.
      </p>

      {/* Accessing Customers */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Accessing Customers</h3>
        <p>
          Click <strong>Customers</strong> in the navigation bar to open the Customers page.
        </p>
        <AdminNavPreview highlight="Customers" />
      </div>

      {/* Page Overview */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Page Overview</h3>
        <p>
          The page header shows the title with two action buttons, followed by the filter bar and
          customers table.
        </p>
        <Preview wide>
          <div className="flex items-center justify-between">
            <div>
              <Heading variant="h2">Customer Management</Heading>
              <Paragraph className="text-muted-foreground text-sm">
                Manage customer accounts and information. Create new customers, view their details,
                and track customer interactions.
              </Paragraph>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Upload className="size-4" />
                Upload Customers
              </Button>
              <Button>
                <Plus className="size-4" />
                Add customer
              </Button>
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Upload Customers</strong> — opens a dialog to bulk-import customers from a CSV
            file
          </li>
          <li>
            <strong>Add customer</strong> — opens the create customer form
          </li>
        </ul>
      </div>

      {/* Creating a Customer */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Creating a Customer</h3>
        <p>
          Click <strong>Add customer</strong> to open a two-step creation wizard.
        </p>

        <StepLabel n={1}>Enter customer details</StepLabel>
        <p>Fill in the customer&apos;s personal information and assign them to a branch.</p>
        <Preview>
          <div className="space-y-4">
            <div>
              <Paragraph className="text-foreground text-sm font-semibold">
                Create New Customer
              </Paragraph>
              <Paragraph className="text-muted-foreground text-xs">
                Enter the customer details and information.
              </Paragraph>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Full Name</Label>
                <Input disabled placeholder="Enter customer's full name" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Phone Number</Label>
                  <Input disabled placeholder="Enter phone number" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Email Address</Label>
                  <Input disabled placeholder="Enter email address" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Location</Label>
                <Input disabled placeholder="Enter customer location" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Contribution Amount</Label>
                <Input disabled placeholder="Enter contribution amount" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Branch</Label>
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal"
                  disabled
                >
                  <span className="text-muted-foreground text-xs">Select branch</span>
                  <ChevronDown className="text-muted-foreground size-4" />
                </Button>
              </div>
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

        <StepLabel n={2}>Enter next of kin</StepLabel>
        <p>
          Provide the customer&apos;s next of kin details, then click{" "}
          <strong>Create Customer</strong>.
        </p>
        <Preview>
          <div className="space-y-4">
            <div>
              <Paragraph className="text-foreground text-sm font-semibold">
                Create New Customer
              </Paragraph>
              <Paragraph className="text-muted-foreground text-xs">
                Enter the next of kin information.
              </Paragraph>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Next of Kin Name</Label>
                <Input disabled placeholder="Enter next of kin's full name" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Next of Kin Phone</Label>
                  <Input disabled placeholder="Enter next of kin phone" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Next of Kin Email</Label>
                  <Input disabled placeholder="Enter next of kin email" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" disabled>
                Back
              </Button>
              <Button size="sm" disabled>
                Create Customer
              </Button>
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Branch</strong> — a searchable dropdown of all available branches
          </li>
          <li>
            <strong>Contribution Amount</strong> — the customer&apos;s agreed daily or periodic
            contribution in GHS
          </li>
          <li>
            If no branches exist yet, the dialog shows a prompt to create one first.
          </li>
        </ul>
      </div>

      {/* Bulk Upload */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Bulk Upload</h3>
        <p>
          Click <strong>Upload Customers</strong> to import multiple customers at once from a CSV
          file. The dialog provides a <strong>Download CSV template</strong> link so you can see the
          exact format required.
        </p>
        <p>The CSV must include these columns (headers are case-insensitive):</p>
        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>name</strong>, <strong>email</strong>, <strong>phone number</strong>,{" "}
            <strong>location</strong>
          </li>
          <li>
            <strong>contribution amount</strong> — numeric, cannot be negative
          </li>
          <li>
            <strong>nok name</strong>, <strong>nok phone number</strong>, <strong>nok email</strong>{" "}
            — next of kin details
          </li>
          <li>
            <strong>last withdrawal date</strong>, <strong>contribution start date</strong>,{" "}
            <strong>registration date</strong> — format: YYYY-MM-DD
          </li>
          <li>
            <strong>balance</strong> — the customer&apos;s opening balance
          </li>
        </ul>
        <p className="text-muted-foreground text-xs">
          Maximum file size: 10 MB. All customers in the file will be assigned to the branch you
          select in the dialog.
        </p>
      </div>

      {/* Searching & Sorting */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Searching &amp; Sorting</h3>
        <p>Use the toolbar above the table to narrow down the customer list.</p>
        <Preview wide>
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1">
              <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input disabled placeholder="Search customers..." className="w-full pl-9" />
            </div>

            <Button size="sm" variant="outline" disabled>
              Branch: All branches
            </Button>

            <Button size="sm" variant="outline" disabled>
              <ArrowUpDown className="size-4" />
              Sort by: Created At
            </Button>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Search</strong> — filter by customer name, email, or phone number
          </li>
          <li>
            <strong>Branch</strong> — filter customers by their assigned branch
          </li>
          <li>
            <strong>Sort by</strong> — sort by Name, Email, Location, or Created date
          </li>
        </ul>
      </div>

      {/* Customer Table */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Customer Table</h3>
        <p>The table displays all customers with the following columns:</p>

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
              {
                name: "Kofi Boateng",
                account: "KSS-0078",
                phone: "020 333 9876",
                email: "kofi@mail.com",
                branch: "Accra",
                contribution: "₵100.00",
                registered: "02/02/25",
                lastDeposit: "25/03/25",
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
                  <Button variant="ghost" size="icon" className="size-7" disabled>
                    <Download className="size-3.5" />
                  </Button>
                </span>
              </div>
            ))}
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Name</strong> — clickable link that navigates to the Transactions page filtered
            by that customer
          </li>
          <li>
            <strong>Account Number</strong> — the customer&apos;s unique KSS account number
          </li>
          <li>
            <strong>Contact</strong> — phone number and email
          </li>
          <li>
            <strong>Contribution</strong> — the customer&apos;s agreed contribution amount in GHS
          </li>
          <li>
            <strong>Download statement</strong> (<Download className="inline size-3.5" />) — downloads
            the customer&apos;s account statement as a PDF for a selected date range
          </li>
        </ul>
      </div>

      <GuideNavigation />
    </div>
  );
}
