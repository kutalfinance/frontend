import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paragraph } from "@/components/ui/text";

import { GuideNavigation, GuideTitle, Preview, StepLabel } from "./components";

export default function AgentCustomersGuide() {
  return (
    <div className="text-foreground/80 space-y-8 text-sm leading-relaxed">
      <GuideTitle badge="Agent" badgeVariant="accent">
        Creating Customers
      </GuideTitle>

      <p>
        As an agent you can register new customers in your branch. The process is a two-step dialog
        — first you enter the customer&apos;s details, then their next of kin information.
      </p>

      {/* Step 1 */}
      <div className="space-y-3">
        <StepLabel n={1}>
          Click <strong>Add customer</strong> on the dashboard
        </StepLabel>
        <Preview>
          <Button disabled>
            <Plus className="size-4" /> Add customer
          </Button>
        </Preview>
      </div>

      {/* Step 2 */}
      <div className="space-y-3">
        <StepLabel n={2}>Fill in the customer details and click Continue</StepLabel>
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

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Full Name</strong> — the customer&apos;s full name (required)
          </li>
          <li>
            <strong>Phone Number</strong> — the customer&apos;s phone number (required)
          </li>
          <li>
            <strong>Email Address</strong> — optional email address
          </li>
          <li>
            <strong>Location</strong> — the customer&apos;s location or address (required)
          </li>
          <li>
            <strong>Contribution Amount</strong> — the agreed daily contribution amount in GHS. This
            is used as the default deposit amount when recording transactions.
          </li>
          <li>
            On mobile, the Phone Number and Email fields stack vertically instead of side by side.
          </li>
        </ul>
      </div>

      {/* Step 3 */}
      <div className="space-y-3">
        <StepLabel n={3}>
          Fill in the next of kin details and click <strong>Create Customer</strong>
        </StepLabel>
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
            <strong>Back</strong> — returns to the customer details step without losing your input
          </li>
          <li>All next of kin fields are optional but recommended.</li>
          <li>
            The customer is automatically assigned to your branch — you do not need to select a
            branch.
          </li>
        </ul>
      </div>

      {/* Step 4 */}
      <StepLabel n={4}>
        The customer is created and appears in your customer list on the dashboard.
      </StepLabel>

      <GuideNavigation />
    </div>
  );
}
