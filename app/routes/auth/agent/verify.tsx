import { useEffect, useState } from "react";
import { Link, href, redirect } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Heading, Paragraph } from "@/components/ui/text";

import { useAgentAuthVerify, useAgentResendOtp } from "@/hooks/auth/agent";
import { siteConfig } from "@/lib/config";

import type { Route } from "./+types/verify";

export function meta() {
  return [
    { title: `Agent Verification - ${siteConfig.name}` },
    { name: "description", content: "Enter verification code to continue" },
  ];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    throw redirect(href("/auth/agent/login"));
  }

  return { email };
}

const OTP_TTL = 5 * 60; // seconds, matches backend expiry

const otpSchema = z.object({ otp: z.string() });

export default function AgentVerify({ loaderData }: Route.ComponentProps) {
  const { email } = loaderData;
  const { mutate, isPending } = useAgentAuthVerify();
  const { mutate: resend, isPending: isResending } = useAgentResendOtp();

  const [secondsLeft, setSecondsLeft] = useState(OTP_TTL);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  function onVerify(values: z.infer<typeof otpSchema>) {
    mutate({ ...values, email });
  }

  function onResend() {
    resend(email, {
      onSuccess: () => {
        setSecondsLeft(OTP_TTL);
        form.reset();
      },
    });
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <>
      <hgroup className="flex flex-col">
        <Heading className="mt-4">Agent Verification</Heading>
        <Paragraph className="text-muted-foreground">
          We've sent a 6-digit verification code to {email}. Enter it below to access your agent
          account.
        </Paragraph>
      </hgroup>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onVerify)} className="grid gap-2">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP maxLength={6} {...field} autoFocus>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button isLoading={isPending} className="my-2 w-full">
            Verify & Sign in
          </Button>

          {secondsLeft > 0 ? (
            <p className="text-muted-foreground text-center text-sm">
              Resend OTP in {mm}:{ss}
            </p>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onResend}
              isLoading={isResending}
            >
              Resend OTP
            </Button>
          )}

          <Link to="/auth/agent/login" className="link text-center text-sm">
            Back to login
          </Link>
        </form>
      </Form>
    </>
  );
}
