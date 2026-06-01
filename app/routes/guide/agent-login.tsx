import { Shield, Users } from "lucide-react";

import { AppLogo } from "@/components/app-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Heading, Paragraph } from "@/components/ui/text";

import { GuideNavigation, GuideTitle, Preview, StepLabel } from "./components";

export default function AgentLoginGuide() {
  return (
    <div className="text-foreground/80 space-y-10 text-sm leading-relaxed">
      <GuideTitle badge="Agent" badgeVariant="accent">
        Login
      </GuideTitle>

      <p>
        Agents log in using their email address and a one-time verification code — no password is
        required. Your admin must have created your account before you can log in.
      </p>

      {/* Step 1: Role Selection */}
      <div className="space-y-3">
        <StepLabel n={1}>
          Navigate to the login page and select <strong>Agent login</strong>.
        </StepLabel>
        <Preview>
          <hgroup className="flex flex-col">
            <AppLogo />
            <Paragraph className="text-muted-foreground">
              Select your account type to proceed.
            </Paragraph>
          </hgroup>
          <div className="space-y-3">
            <Button disabled className="ring-primary w-full ring-2">
              <Users />
              Agent login
            </Button>
            <Button disabled variant="outline" className="w-full">
              <Shield />
              Administrator login
            </Button>
          </div>
        </Preview>
      </div>

      {/* Step 2: Email */}
      <div className="space-y-3">
        <StepLabel n={2}>
          Enter your <strong>email address</strong> and click <strong>Continue</strong>.
        </StepLabel>
        <Preview>
          <hgroup className="flex flex-col">
            <Heading className="mt-4" variant="h2">
              Agent Login
            </Heading>
            <Paragraph className="text-muted-foreground">
              Enter your email address to continue.
            </Paragraph>
          </hgroup>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              defaultValue="agent@example.com"
              disabled
            />
            <Button disabled className="mt-2 w-full">
              Continue
            </Button>
          </div>
        </Preview>
        <p className="text-muted-foreground ml-9 text-xs">
          A 6-digit verification code will be sent to your email. If you don&apos;t receive it,
          check your spam folder or contact your admin.
        </p>
      </div>

      {/* Step 3: OTP */}
      <div className="space-y-3">
        <StepLabel n={3}>
          Enter the <strong>6-digit verification code</strong> sent to your email and click{" "}
          <strong>Verify &amp; Sign in</strong>.
        </StepLabel>
        <Preview>
          <hgroup className="flex flex-col">
            <Heading className="mt-4" variant="h2">
              Agent Verification
            </Heading>
            <Paragraph className="text-muted-foreground">
              We&apos;ve sent a 6-digit verification code to agent@example.com. Enter it below to
              access your agent account.
            </Paragraph>
          </hgroup>
          <div className="grid gap-2">
            <InputOTP maxLength={6} disabled value="">
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button disabled className="my-2 w-full">
              Verify &amp; Sign in
            </Button>
          </div>
        </Preview>
      </div>

      {/* Step 4: Done */}
      <StepLabel n={4}>Once verified, you will be redirected to the agent dashboard.</StepLabel>

      <GuideNavigation />
    </div>
  );
}
