import { Link, href, redirect } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Heading, Paragraph } from "@/components/ui/text";

import { useAdminAuthVerify } from "@/hooks/auth/admin";
import { siteConfig } from "@/lib/config";

import type { Route } from "./+types/verify";

export function meta() {
  return [
    { title: `Verify OTP - ${siteConfig.name}` },
    { name: "description", content: "Enter verification code to continue" },
  ];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    throw redirect(href("/auth/admin/login"));
  }

  return { email };
}

const otpSchema = z.object({ otp: z.string() });

export default function AdminVerify({ loaderData }: Route.ComponentProps) {
  const { email } = loaderData;
  const { mutate, isPending } = useAdminAuthVerify();

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  function onVerify(values: z.infer<typeof otpSchema>) {
    mutate({ ...values, email });
  }

  return (
    <>
      <hgroup className="flex flex-col">
        <Heading className="mt-4">Verify OTP</Heading>
        <Paragraph className="text-muted-foreground">
          We've sent a 6-digit verification code to {email}. Enter it below to complete your
          sign-in.
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

          <Link to="/auth/admin/login" className="link">
            Back to email
          </Link>
        </form>
      </Form>
    </>
  );
}
