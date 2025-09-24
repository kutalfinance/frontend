import { Link, createFileRoute, redirect } from "@tanstack/react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Heading, Paragraph } from "@/components/ui/text";

import { useAdminAuthOTP } from "@/hooks/data";

export const Route = createFileRoute("/_auth/auth/u/verify")({
  component: AdminOTP,
  validateSearch: z.object({ email: z.email() }),
  beforeLoad: ({ search }) => {
    if (!search.email) throw redirect({ to: "/auth/u/check" });
  },
});

const otpSchema = z.object({ otp: z.string() });

function AdminOTP() {
  const { email } = Route.useSearch();
  const { mutate, isPending } = useAdminAuthOTP();

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  function onLogin(values: z.infer<typeof otpSchema>) {
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
        <form onSubmit={form.handleSubmit(onLogin)} className="grid gap-2">
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
            Verify & Sign In
          </Button>

          <Link to="/auth/u/check" className="link">
            Back to Email
          </Link>
        </form>
      </Form>
    </>
  );
}
