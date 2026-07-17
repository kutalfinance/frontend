import { href, Link, redirect, useSearchParams } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/input";
import { Heading, Paragraph } from "@/components/ui/text";

import { useResetPassword } from "@/hooks/auth/admin";
import { siteConfig } from "@/lib/config";

export function meta() {
  return [
    { title: `Reset Password - ${siteConfig.name}` },
    { name: "description", content: "Reset your admin password" },
  ];
}

export async function clientLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const email = url.searchParams.get("email");

  if (!token || !email) {
    return redirect(href("/auth"));
  }

  return { token, email };
}

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const { mutate, isPending, isSuccess } = useResetPassword();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    mutate({ email, token, password: values.password });
  }

  if (isSuccess) {
    return (
      <>
        <hgroup className="flex flex-col">
          <Heading className="mt-4">Password Reset</Heading>
          <Paragraph className="text-muted-foreground">
            Your password has been reset successfully.
          </Paragraph>
        </hgroup>
        <Link to={href("/auth/admin/login")} className="link">
          Back to login
        </Link>
      </>
    );
  }

  return (
    <>
      <hgroup className="flex flex-col">
        <Heading className="mt-4">Reset Your Password</Heading>
        <Paragraph className="text-muted-foreground">Enter a new password for {email}.</Paragraph>
      </hgroup>

      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput autoFocus placeholder="Enter new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Confirm new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button isLoading={isPending} className="mt-2 w-full">
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
