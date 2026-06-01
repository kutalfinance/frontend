import { BanknoteArrowDown, Coins } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heading, Paragraph } from "@/components/ui/text";

import { GuideNavigation, GuideTitle, Preview, StepLabel } from "./components";

export default function AgentWithdrawalsGuide() {
  return (
    <div className="text-foreground/80 space-y-8 text-sm leading-relaxed">
      <GuideTitle badge="Agent" badgeVariant="accent">
        Requesting Withdrawals
      </GuideTitle>

      <p>
        Withdrawals follow the same flow as deposits — navigate to the customer&apos;s details page
        and use the Record withdrawal button. Unlike deposits, withdrawals are not processed
        immediately. They are created with a <strong>Pending</strong> status and must be approved by
        an admin before the customer&apos;s balance is updated.
      </p>

      {/* Step 1 */}
      <div className="space-y-3">
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

      {/* Step 2 */}
      <div className="space-y-3">
        <StepLabel n={2}>
          On the customer details page, click <strong>Record withdrawal</strong>
        </StepLabel>
        <Preview wide>
          <div className="flex items-center justify-between">
            <div>
              <Heading variant="h2">Ama Darko</Heading>
              <Paragraph className="text-muted-foreground text-sm">
                View customer details and transaction history
              </Paragraph>
            </div>
            <div className="flex gap-2">
              <Button variant="destructive-outline" className="border-primary/30 border" disabled>
                <BanknoteArrowDown className="size-4" /> Record withdrawal
              </Button>
            </div>
          </div>
        </Preview>
      </div>

      {/* Step 3 */}
      <div className="space-y-3">
        <StepLabel n={3}>
          Enter the withdrawal amount and click <strong>Record Withdrawal</strong>
        </StepLabel>
        <Preview>
          <div className="space-y-4">
            <div>
              <Paragraph className="text-foreground text-sm font-semibold">
                Record Withdrawal
              </Paragraph>
              <Paragraph className="text-muted-foreground text-xs">
                Record a new withdrawal for <strong>Ama Darko</strong>
              </Paragraph>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Withdrawal Amount</Label>
              <Input type="number" disabled placeholder="Enter withdrawal amount" />
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
            The withdrawal is created with a <strong>Pending</strong> status and must be approved by
            an admin approver assigned to the customer&apos;s branch.
          </li>
          <li>
            The admin approver will receive an email notification about the pending withdrawal.
          </li>
          <li>
            Once approved, the withdrawal is marked as <strong>Completed</strong> and the
            customer&apos;s balance is updated. If rejected, the balance remains unchanged.
          </li>
          <li>On mobile, the dialog takes the full screen width for easier input.</li>
        </ul>
      </div>

      <GuideNavigation />
    </div>
  );
}
