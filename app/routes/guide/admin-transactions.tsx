import {
  ArrowUpDown,
  BanknoteArrowDown,
  BanknoteArrowUp,
  Calendar,
  ChevronDown,
  Coins,
  SearchIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heading, Paragraph } from "@/components/ui/text";

import { AdminNavPreview, GuideNavigation, GuideTitle, Preview } from "./components";

export default function AdminTransactionsGuide() {
  return (
    <div className="text-foreground/80 space-y-8 text-sm leading-relaxed">
      <GuideTitle badge="Admin">Transactions</GuideTitle>

      <p>
        The Transactions page shows every deposit, withdrawal, and service charge across all
        branches. You can record new deposits and withdrawals, view summary metrics, and filter the
        full transaction history.
      </p>

      {/* Accessing Transactions */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Accessing Transactions</h3>
        <p>
          Click <strong>Home</strong> in the navigation bar. The admin home page is the Transactions
          page.
        </p>
        <AdminNavPreview highlight="Home" />
      </div>

      {/* Page Overview */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Page Overview</h3>
        <p>
          The page header shows a personalised greeting with two action buttons, followed by summary
          metric cards, filters, and the transaction table.
        </p>
        <Preview wide>
          <div className="flex items-center justify-between">
            <div>
              <Heading variant="h2">Welcome Admin</Heading>
              <Paragraph className="text-muted-foreground text-sm">
                View all customer transactions, deposits, and withdrawals across all branches.
              </Paragraph>
            </div>
            <div className="flex gap-2">
              <Button>
                <BanknoteArrowUp className="size-4" />
                Record deposit
              </Button>
              <Button variant="destructive-outline">
                <BanknoteArrowDown className="size-4" />
                Record withdrawal
              </Button>
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Record deposit</strong> — opens a dialog to record a customer deposit
          </li>
          <li>
            <strong>Record withdrawal</strong> — opens a dialog to record a customer withdrawal
            (requires admin approval)
          </li>
        </ul>
      </div>

      {/* Metrics */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Summary Metrics</h3>
        <p>
          Four cards at the top of the page show aggregated totals. When you filter by a specific
          customer, the metrics update to reflect that customer&apos;s data only.
        </p>
        <Preview wide>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {[
              { label: "Balance", value: "₵ 12,500.00", className: "text-muted-foreground" },
              { label: "Total Deposited", value: "₵ 45,000.00", className: "text-success" },
              { label: "Total Withdrawn", value: "₵ 30,000.00", className: "text-destructive" },
              { label: "Total Charged", value: "₵ 2,500.00", className: "text-foreground" },
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
            <strong>Balance</strong> — total account balance across all customers
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
        </ul>
      </div>

      {/* Recording a Deposit */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Recording a Deposit</h3>
        <p>
          Click <strong>Record deposit</strong> to open the deposit dialog. Select a customer and
          enter the amount.
        </p>
        <Preview>
          <div className="space-y-4">
            <div>
              <Paragraph className="text-foreground text-sm font-semibold">Record Deposit</Paragraph>
              <Paragraph className="text-muted-foreground text-xs">
                Record a customer deposit
              </Paragraph>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Customer</Label>
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal"
                  disabled
                >
                  <span className="text-muted-foreground text-xs">Select customer</span>
                  <ChevronDown className="text-muted-foreground size-4" />
                </Button>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Deposit Amount</Label>
                <Input disabled placeholder="Enter deposit amount" />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" disabled>
                Cancel
              </Button>
              <Button size="sm" disabled>
                Record Deposit
              </Button>
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Customer</strong> — a searchable dropdown of all customers
          </li>
          <li>
            If the amount is left empty, it defaults to the customer&apos;s agreed contribution
            amount.
          </li>
          <li>Deposits are processed immediately and marked as completed.</li>
        </ul>
      </div>

      {/* Recording a Withdrawal */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Recording a Withdrawal</h3>
        <p>
          Click <strong>Record withdrawal</strong> to open the withdrawal dialog. It works the same
          way as a deposit but the withdrawal requires admin approval before it is completed.
        </p>
        <Preview>
          <div className="space-y-4">
            <div>
              <Paragraph className="text-foreground text-sm font-semibold">
                Record Withdrawal
              </Paragraph>
              <Paragraph className="text-muted-foreground text-xs">
                Record a customer withdrawal
              </Paragraph>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Customer</Label>
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal"
                  disabled
                >
                  <span className="text-muted-foreground text-xs">Select customer</span>
                  <ChevronDown className="text-muted-foreground size-4" />
                </Button>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Withdrawal Amount</Label>
                <Input disabled placeholder="Enter withdrawal amount" />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" disabled>
                Cancel
              </Button>
              <Button size="sm" variant="destructive-outline" disabled>
                Record Withdrawal
              </Button>
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            If the amount is left empty, it defaults to the customer&apos;s entire deposit balance.
          </li>
          <li>
            Withdrawals are created with a <strong>Pending</strong> status and must be approved by an
            admin approver assigned to the customer&apos;s branch.
          </li>
          <li>
            See the <strong>Approving Withdrawals</strong> guide for more details on the approval
            process.
          </li>
        </ul>
      </div>

      {/* Filtering & Sorting */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Filtering &amp; Sorting</h3>
        <p>Use the toolbar above the table to narrow down the transaction list.</p>
        <Preview wide>
          <div className="flex flex-wrap gap-2">
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

            <Button size="sm" variant="outline" disabled>
              Customer: All customers
            </Button>

            <Button size="sm" variant="outline" disabled>
              <Calendar className="size-4" />
              Date range
            </Button>

            <Button size="sm" variant="outline" disabled>
              <ArrowUpDown className="size-4" />
              Sort by: Date
            </Button>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Search</strong> — filter by customer name or transaction details
          </li>
          <li>
            <strong>Type</strong> — filter by Deposit, Withdrawal, or Service Charge
          </li>
          <li>
            <strong>Status</strong> — filter by Completed, Pending, Rejected, or Failed
          </li>
          <li>
            <strong>Customer</strong> — filter by a specific customer (also updates the metrics
            cards)
          </li>
          <li>
            <strong>Date range</strong> — filter transactions between a start and end date
          </li>
          <li>
            <strong>Sort by</strong> — sort by Date, Amount, Type, or Status
          </li>
          <li>
            <strong>Clear filters</strong> — a link appears when filters are active to reset them
          </li>
        </ul>
      </div>

      {/* Transaction Table */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Transaction Table</h3>
        <p>The table displays all transactions with the following columns:</p>

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
                amount: "₵ 500.00",
                customer: "Ama Darko",
                type: "DEPOSIT" as const,
                status: "COMPLETED" as const,
                recordedBy: "Kofi Mensah",
                date: "Mar 28, 2025 at 2:30 PM",
              },
              {
                amount: "₵ 1,200.00",
                customer: "Kofi Boateng",
                type: "WITHDRAWAL" as const,
                status: "PENDING" as const,
                recordedBy: "Ama Serwaa",
                date: "Mar 27, 2025 at 10:15 AM",
              },
              {
                amount: "₵ 25.00",
                customer: "Ama Darko",
                type: "SERVICE_CHARGE" as const,
                status: "COMPLETED" as const,
                recordedBy: "System",
                date: "Mar 26, 2025 at 12:00 AM",
              },
            ].map((row) => (
              <div
                key={row.date}
                className="grid grid-cols-6 items-center gap-2 border-b px-3 py-2.5 last:border-0"
              >
                <span className="font-medium whitespace-nowrap">{row.amount}</span>
                <span className="text-primary font-medium">{row.customer}</span>
                <span>
                  {row.type === "DEPOSIT" ? (
                    <Badge className="text-[10px]">
                      <BanknoteArrowUp className="size-3" />
                      {row.type}
                    </Badge>
                  ) : row.type === "WITHDRAWAL" ? (
                    <Badge variant="destructive" className="text-[10px]">
                      <BanknoteArrowDown className="size-3" />
                      {row.type}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">
                      {row.type}
                    </Badge>
                  )}
                </span>
                <span>
                  <Badge
                    variant={
                      row.status === "COMPLETED"
                        ? "default"
                        : row.status === "PENDING"
                          ? "secondary"
                          : "destructive"
                    }
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
            <strong>Customer</strong> — clickable link that navigates to the Customers page filtered
            by that customer
          </li>
          <li>
            <strong>Type</strong> — colour-coded badge: green for deposits, red for withdrawals,
            outline for service charges
          </li>
          <li>
            <strong>Status</strong> — green for Completed, grey for Pending, red for Rejected or
            Failed
          </li>
          <li>
            <strong>Recorded By</strong> — the admin or agent who created the transaction
          </li>
          <li>
            <strong>Date &amp; Time</strong> — full timestamp of when the transaction was recorded
          </li>
        </ul>
      </div>

      <GuideNavigation />
    </div>
  );
}
