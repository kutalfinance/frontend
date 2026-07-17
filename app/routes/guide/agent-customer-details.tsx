import {
  ArrowUpDown,
  BanknoteArrowDown,
  BanknoteArrowUp,
  Calendar,
  ChevronDown,
  Coins,
  DollarSign,
  Hash,
  Mail,
  MapPin,
  Phone,
  SearchIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heading, Paragraph } from "@/components/ui/text";

import { GuideNavigation, GuideTitle, Preview, StepLabel } from "./components";

export default function AgentCustomerDetailsGuide() {
  return (
    <div className="text-foreground/80 space-y-8 text-sm leading-relaxed">
      <GuideTitle badge="Agent" badgeVariant="accent">
        Customer Details
      </GuideTitle>

      <p>
        The customer details page shows everything about a single customer — their personal
        information, account metrics, and full transaction history. This is also where you record
        deposits and withdrawals.
      </p>

      {/* Accessing */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Accessing Customer Details</h3>
        <StepLabel n={1}>
          Find the customer on the dashboard and click <strong>View contributions</strong> (shown as{" "}
          <strong>View</strong> on mobile)
        </StepLabel>
        <Preview wide>
          <div className="rounded-lg border">
            <div className="flex items-center justify-between p-4">
              <div>
                <Heading variant="h4">Ama Darko</Heading>
                <Paragraph className="text-muted-foreground text-sm">ama@mail.com</Paragraph>
              </div>
              <Button size="sm" variant="outline" className="border-primary/30 border" disabled>
                <Coins className="size-4" /> View contributions
              </Button>
            </div>
          </div>
        </Preview>
      </div>

      {/* Page Header */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Page Header</h3>
        <p>
          The header shows a breadcrumb, the customer&apos;s name with an info dropdown, and action
          buttons for recording deposits and withdrawals.
        </p>
        <Preview wide>
          <div className="space-y-4">
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <span className="text-primary">Home</span>
              <span>/</span>
              <span>Ama Darko</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Heading variant="h2">Ama Darko</Heading>
                  <Button variant="outline" size="icon" className="size-8" disabled>
                    <ChevronDown className="size-4" />
                  </Button>
                </div>
                <Paragraph className="text-muted-foreground text-sm">
                  View customer details and transaction history
                </Paragraph>
              </div>
              <div className="flex gap-2">
                <Button disabled>
                  <BanknoteArrowUp className="size-4" /> Record deposit
                </Button>
                <Button variant="destructive-outline" disabled>
                  <BanknoteArrowDown className="size-4" /> Record withdrawal
                </Button>
              </div>
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Record deposit</strong> — opens the deposit dialog (see the Recording Deposits
            guide)
          </li>
          <li>
            <strong>Record withdrawal</strong> — opens the withdrawal dialog (see the Requesting
            Withdrawals guide)
          </li>
          <li>On mobile, the action buttons stack below the customer name and breadcrumb.</li>
        </ul>
      </div>

      {/* Customer Info Popover */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Customer Information</h3>
        <p>Click the dropdown arrow next to the customer&apos;s name to see their full details.</p>
        <Preview wide>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Hash, label: "Account Number", value: "KSS-0042" },
              { icon: DollarSign, label: "Contribution Amount", value: "₵ 50.00" },
              { icon: Phone, label: "Phone Number", value: "024 555 1234" },
              { icon: Mail, label: "Email", value: "ama@mail.com" },
              { icon: MapPin, label: "Location", value: "Adum Kumasi" },
              { icon: Calendar, label: "Registration Date", value: "15/01/2025" },
              { icon: Calendar, label: "Last Deposit", value: "28/03/2025" },
            ].map((field) => (
              <div key={field.label} className="flex items-start gap-2 text-xs">
                <field.icon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                <div>
                  <Paragraph className="text-muted-foreground text-xs">{field.label}</Paragraph>
                  <Paragraph className="text-foreground font-medium">{field.value}</Paragraph>
                </div>
              </div>
            ))}
          </div>
        </Preview>
      </div>

      {/* Metrics */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Account Metrics</h3>
        <p>
          Four cards show the customer&apos;s financial summary. These update in real time as
          transactions are recorded.
        </p>
        <Preview wide>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {[
              { label: "Balance", value: "₵ 1,200.00", className: "text-muted-foreground" },
              { label: "Total Deposited", value: "₵ 3,500.00", className: "text-success" },
              { label: "Total Withdrawn", value: "₵ 2,200.00", className: "text-destructive" },
              { label: "Total Charged", value: "₵ 100.00", className: "text-foreground" },
            ].map((metric) => (
              <Card key={metric.label} className="h-fit gap-2">
                <CardHeader>
                  <div className="w-fit rounded-md border p-2">
                    <Coins className={`size-5 ${metric.className}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <Paragraph className="text-muted-foreground text-sm">{metric.label}</Paragraph>
                  <Heading>{metric.value}</Heading>
                </CardContent>
              </Card>
            ))}
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Balance</strong> — current account balance (deposits minus withdrawals and
            charges)
          </li>
          <li>
            <strong>Total Deposited</strong> — sum of all completed deposits (green)
          </li>
          <li>
            <strong>Total Withdrawn</strong> — sum of all completed withdrawals (red)
          </li>
          <li>
            <strong>Total Charged</strong> — sum of all service charges
          </li>
          <li>On mobile, the metric cards display in a 2-column grid.</li>
        </ul>
      </div>

      {/* Filtering & Sorting */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Filtering &amp; Sorting</h3>
        <p>Use the toolbar above the transaction table to narrow down results.</p>
        <Preview wide>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input disabled placeholder="Search transactions..." className="w-full pl-9" />
            </div>
            <Button size="sm" variant="outline" disabled>
              Type: All types
            </Button>
            <Button size="sm" variant="outline" disabled>
              Status: All statuses
            </Button>
            <div className="ml-auto flex items-center gap-1">
              <Button size="icon" variant="ghost" disabled>
                <ArrowUpDown className="size-4" />
              </Button>
              <Button size="sm" variant="outline" disabled>
                Sort by: Date
              </Button>
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Search</strong> — filter by transaction details
          </li>
          <li>
            <strong>Type</strong> — filter by Deposit, Withdrawal, or Service Charge
          </li>
          <li>
            <strong>Status</strong> — filter by Completed, Pending, Rejected, or Failed
          </li>
          <li>
            <strong>Sort by</strong> — sort by Date, Amount, Type, or Status
          </li>
          <li>
            <strong>Clear filters</strong> — appears when filters are active to reset them
          </li>
          <li>
            On mobile, the search bar takes the full width and the filter dropdowns wrap onto a
            second row.
          </li>
        </ul>
      </div>

      {/* Transaction Table */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Transaction History</h3>
        <p>The table shows all transactions for this customer.</p>
        <Preview wide>
          <div className="space-y-0 rounded-md border text-xs">
            <div className="text-muted-foreground grid grid-cols-6 gap-2 border-b px-3 py-2 font-medium">
              <span>Amount</span>
              <span>Customer</span>
              <span>Type</span>
              <span>Status</span>
              <span>Recorded By</span>
              <span>Date &amp; Time</span>
            </div>
            {[
              {
                amount: "₵ 50.00",
                customer: "Ama Darko",
                type: "DEPOSIT" as const,
                status: "COMPLETED" as const,
                recordedBy: "Kofi Mensah",
                date: "Mar 28, 2025 at 2:30 PM",
              },
              {
                amount: "₵ 50.00",
                customer: "Ama Darko",
                type: "DEPOSIT" as const,
                status: "COMPLETED" as const,
                recordedBy: "Kofi Mensah",
                date: "Mar 27, 2025 at 3:00 PM",
              },
              {
                amount: "₵ 1,200.00",
                customer: "Ama Darko",
                type: "WITHDRAWAL" as const,
                status: "PENDING" as const,
                recordedBy: "Kofi Mensah",
                date: "Mar 26, 2025 at 10:15 AM",
              },
            ].map((row) => (
              <div
                key={row.date}
                className="grid grid-cols-6 items-center gap-2 border-b px-3 py-2.5 last:border-0"
              >
                <span className="font-medium whitespace-nowrap">{row.amount}</span>
                <span>{row.customer}</span>
                <span>
                  {row.type === "DEPOSIT" ? (
                    <Badge className="text-[10px]">
                      <BanknoteArrowUp className="size-3" />
                      {row.type}
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-[10px]">
                      <BanknoteArrowDown className="size-3" />
                      {row.type}
                    </Badge>
                  )}
                </span>
                <span>
                  <Badge
                    variant={row.status === "COMPLETED" ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {row.status}
                  </Badge>
                </span>
                <span className="text-muted-foreground">{row.recordedBy}</span>
                <span className="text-muted-foreground whitespace-nowrap">{row.date}</span>
              </div>
            ))}
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Amount</strong> — the transaction value in GHS
          </li>
          <li>
            <strong>Customer</strong> — always shows the current customer&apos;s name (not clickable
            in agent view)
          </li>
          <li>
            <strong>Type</strong> — green badge for deposits, red for withdrawals, outline for
            service charges
          </li>
          <li>
            <strong>Status</strong> — green for Completed, grey for Pending, red for Rejected or
            Failed
          </li>
          <li>
            <strong>Recorded By</strong> — the agent or admin who created the transaction
          </li>
          <li>
            <strong>Date &amp; Time</strong> — when the transaction was recorded
          </li>
          <li>On mobile, the table scrolls horizontally. Swipe left to see all columns.</li>
        </ul>
      </div>

      <GuideNavigation />
    </div>
  );
}
