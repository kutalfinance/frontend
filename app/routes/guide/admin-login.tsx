import { Shield, Users } from "lucide-react";

import { AppLogo } from "@/components/app-logo";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Heading, Paragraph } from "@/components/ui/text";

import { GuideNavigation, GuideTitle, Preview, StepLabel } from "./components";

export default function AdminLoginGuide() {
  return (
    <div className="text-foreground/80 space-y-10 text-sm leading-relaxed">
      <GuideTitle badge="Admin">Login</GuideTitle>

      {/* Step 1: Role Selection */}
      <div className="space-y-3">
        <StepLabel n={1}>
          Navigate to the login page and select <strong>Administrator login</strong>.
        </StepLabel>
        <Preview>
          <hgroup className="flex flex-col">
            <AppLogo />
            <Paragraph className="text-muted-foreground">
              Select your account type to proceed.
            </Paragraph>
          </hgroup>
          <div className="space-y-3">
            <Button disabled className="w-full">
              <Users />
              Agent login
            </Button>
            <Button disabled variant="outline" className="ring-primary w-full ring-2">
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
              Admin Login
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
              defaultValue="admin@example.com"
              disabled
            />
            <Button disabled className="mt-2 w-full">
              Continue
            </Button>
          </div>
        </Preview>
      </div>

      {/* Step 3: Password */}
      <div className="space-y-3">
        <StepLabel n={3}>
          Enter your <strong>password</strong> and click <strong>Sign in</strong>.
        </StepLabel>
        <Preview>
          <hgroup className="flex flex-col">
            <Heading className="mt-4" variant="h2">
              Enter Your Password
            </Heading>
            <Paragraph className="text-muted-foreground">
              Please enter your password to sign in to your account.
            </Paragraph>
          </hgroup>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" defaultValue="admin@example.com" disabled />
            <label className="text-sm font-medium">Password</label>
            <PasswordInput disabled placeholder="Enter your password" />
            <Button disabled className="my-2 w-full">
              Sign in
            </Button>
          </div>
        </Preview>
      </div>

      {/* Step 4: OTP */}
      <div className="space-y-3">
        <StepLabel n={4}>
          A 6-digit verification code will be sent to your email. Enter it to complete sign-in.
        </StepLabel>
        <Preview>
          <hgroup className="flex flex-col">
            <Heading className="mt-4" variant="h2">
              Verify OTP
            </Heading>
            <Paragraph className="text-muted-foreground">
              We've sent a 6-digit verification code to admin@example.com. Enter it below to
              complete your sign-in.
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
              Verify & Sign in
            </Button>
          </div>
        </Preview>
      </div>

      {/* Step 5: Done */}
      <StepLabel n={5}>Once verified, you will be redirected to the admin dashboard.</StepLabel>

      <GuideNavigation />
    </div>
  );
}
