import { BanknoteArrowUp, Coins } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heading, Paragraph } from "@/components/ui/text";

import { GuideNavigation, GuideTitle, Preview, StepLabel } from "./components";

export default function AgentDepositsGuide() {
  return (
    <div className="text-foreground/80 space-y-8 text-sm leading-relaxed">
      <GuideTitle badge="Agent" badgeVariant="accent">
        Recording Deposits
      </GuideTitle>

      <p>
        To record a deposit you first navigate to the customer&apos;s details page, then use the
        Record deposit button. Deposits are processed immediately and marked as completed.
      </p>

      {/* Step 1 */}
      <div className="space-y-3">
        <StepLabel n={1}>
          Find the customer on the dashboard and click <strong>View contributions</strong> (shown
          as <strong>View</strong> on mobile)
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
          On the customer details page, click <strong>Record deposit</strong>
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
              <Button className="border-primary/30 border" disabled>
                <BanknoteArrowUp className="size-4" /> Record deposit
              </Button>
            </div>
          </div>
        </Preview>
      </div>

      {/* Step 3 */}
      <div className="space-y-3">
        <StepLabel n={3}>
          Enter the deposit amount and click <strong>Record Deposit</strong>
        </StepLabel>
        <Preview>
          <div className="space-y-4">
            <div>
              <Paragraph className="text-foreground text-sm font-semibold">Record Deposit</Paragraph>
              <Paragraph className="text-muted-foreground text-xs">
                Record a new deposit for <strong>Ama Darko</strong>
              </Paragraph>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Deposit Amount</Label>
              <Input type="number" disabled placeholder="Enter deposit amount" />
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
            If the amount is left empty, it defaults to the customer&apos;s agreed contribution
            amount.
          </li>
          <li>Deposits are processed immediately and marked as completed.</li>
          <li>The transaction appears in the customer&apos;s transaction history right away.</li>
          <li>
            On mobile, the dialog takes the full screen width for easier input.
          </li>
        </ul>
      </div>

      <GuideNavigation />
    </div>
  );
}
