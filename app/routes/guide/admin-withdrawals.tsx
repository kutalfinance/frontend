import { BanknoteArrowDown, Check, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heading, Paragraph } from "@/components/ui/text";

import { AdminNavPreview, GuideNavigation, GuideTitle, Preview } from "./components";

export default function AdminWithdrawalsGuide() {
  return (
    <div className="text-foreground/80 space-y-8 text-sm leading-relaxed">
      <GuideTitle badge="Admin">Approving Withdrawals</GuideTitle>

      <p>
        The Pending Approvals page shows all withdrawal transactions that are waiting for admin
        review. As an approver assigned to a branch, you can approve or reject each withdrawal
        request. Approved withdrawals are completed immediately; rejected withdrawals cannot be
        undone.
      </p>

      {/* Accessing Approvals */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Accessing Approvals</h3>
        <p>
          Approvers are notified via email when a new withdrawal is submitted. If you don&apos;t
          receive the email, click the <strong>Approvals</strong> button in the header bar to open
          the Pending Approvals page.
        </p>
        <AdminNavPreview highlight="Approvals" />
        <p className="text-muted-foreground text-xs">
          The Approvals button is only visible if you are assigned as an approver on at least one
          branch. You can also find it under <strong>Pending approvals</strong> in the profile
          dropdown menu.
        </p>
      </div>

      {/* Page Overview */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Page Overview</h3>
        <p>
          The page shows a simple header followed by a table of pending transactions. There are no
          top-level action buttons — all actions are per-row.
        </p>
        <Preview wide>
          <div>
            <Heading variant="h2">Pending Approvals</Heading>
            <Paragraph className="text-muted-foreground text-sm">
              Review and approve or reject transactions awaiting approval.
            </Paragraph>
          </div>
        </Preview>
      </div>

      {/* Approvals Table */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Approvals Table</h3>
        <p>
          Each row represents a pending withdrawal with details and action buttons on the right.
        </p>

        <Preview wide>
          <div className="space-y-0 rounded-md border text-xs">
            <div className="text-muted-foreground grid grid-cols-6 gap-2 border-b px-3 py-2 font-medium">
              <span>Amount</span>
              <span>Customer</span>
              <span>Type</span>
              <span>Recorded By</span>
              <span>Date &amp; Time</span>
              <span />
            </div>
            {[
              {
                amount: "₵ 1,200.00",
                customer: "Ama Darko",
                type: "WITHDRAWAL" as const,
                recordedBy: "Kofi Mensah",
                date: "Mar 28, 2025 at 2:30 PM",
              },
              {
                amount: "₵ 500.00",
                customer: "Kofi Boateng",
                type: "WITHDRAWAL" as const,
                recordedBy: "Ama Serwaa",
                date: "Mar 27, 2025 at 10:15 AM",
              },
            ].map((row) => (
              <div
                key={row.date}
                className="grid grid-cols-6 items-center gap-2 border-b px-3 py-2.5 last:border-0"
              >
                <span className="font-medium whitespace-nowrap">{row.amount}</span>
                <span className="text-primary font-medium">{row.customer}</span>
                <span>
                  <Badge variant="destructive" className="text-[10px]">
                    <BanknoteArrowDown className="size-3" />
                    {row.type}
                  </Badge>
                </span>
                <span className="text-muted-foreground">{row.recordedBy}</span>
                <span className="text-muted-foreground whitespace-nowrap">{row.date}</span>
                <span className="flex gap-1">
                  <Button size="sm" variant="outline" className="h-7 text-[10px]" disabled>
                    <Check className="size-3" />
                    Approve
                  </Button>
                  <Button size="sm" variant="destructive" className="h-7 text-[10px]" disabled>
                    <X className="size-3" />
                    Reject
                  </Button>
                </span>
              </div>
            ))}
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Amount</strong> — the withdrawal value in GHS
          </li>
          <li>
            <strong>Customer</strong> — clickable link to the Customers page filtered by that
            customer
          </li>
          <li>
            <strong>Type</strong> — always shows as a red Withdrawal badge on this page
          </li>
          <li>
            <strong>Recorded By</strong> — the agent or admin who requested the withdrawal
          </li>
          <li>
            <strong>Date &amp; Time</strong> — when the withdrawal was requested
          </li>
        </ul>
      </div>

      {/* Approving */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Approving a Withdrawal</h3>
        <p>
          Click <strong>Approve</strong> on a row to open a confirmation dialog.
        </p>
        <Preview>
          <div className="space-y-4">
            <div>
              <Paragraph className="text-foreground text-sm font-semibold">
                Approve Transaction?
              </Paragraph>
              <Paragraph className="text-muted-foreground text-xs">
                This will approve the withdrawal of <strong>GHS 1,200.00</strong> for customer{" "}
                <strong>Ama Darko</strong>.
              </Paragraph>
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" disabled>
                Cancel
              </Button>
              <Button size="sm" disabled>
                Approve Transaction
              </Button>
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            Once approved, the withdrawal status changes to <strong>Completed</strong> and the
            customer&apos;s balance is updated.
          </li>
          <li>The transaction is removed from the pending list automatically.</li>
        </ul>
      </div>

      {/* Rejecting */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Rejecting a Withdrawal</h3>
        <p>
          Click <strong>Reject</strong> on a row to open a confirmation dialog.
        </p>
        <Preview>
          <div className="space-y-4">
            <div>
              <Paragraph className="text-foreground text-sm font-semibold">
                Reject Transaction?
              </Paragraph>
              <Paragraph className="text-muted-foreground text-xs">
                This will reject the withdrawal of <strong>GHS 1,200.00</strong> for customer{" "}
                <strong>Ama Darko</strong>. This action cannot be undone.
              </Paragraph>
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" disabled>
                Cancel
              </Button>
              <Button size="sm" variant="destructive" disabled>
                Reject Transaction
              </Button>
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            Once rejected, the withdrawal status changes to <strong>Rejected</strong> and the
            customer&apos;s balance remains unchanged.
          </li>
          <li>
            <strong className="text-destructive">This action cannot be undone.</strong> A new
            withdrawal must be submitted if needed.
          </li>
        </ul>
      </div>

      {/* How Approvals Work */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">How Approvals Work</h3>
        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            When an agent or admin records a withdrawal, it is created with a{" "}
            <Badge variant="secondary" className="text-[10px]">
              PENDING
            </Badge>{" "}
            status.
          </li>
          <li>
            Only admins who are assigned as <strong>approvers</strong> on the customer&apos;s branch
            can see and act on pending withdrawals for that branch.
          </li>
          <li>
            If a branch&apos;s approvers are changed, newly added approvers are automatically
            notified about any existing pending withdrawals. They can also log in to the app and
            check the Pending Approvals page directly.
          </li>
        </ul>
      </div>

      <GuideNavigation />
    </div>
  );
}
