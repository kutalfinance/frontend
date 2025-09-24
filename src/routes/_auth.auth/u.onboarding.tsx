import { Link, createFileRoute, redirect } from "@tanstack/react-router";

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
import { Input, PasswordInput } from "@/components/ui/input";
import { Heading, Paragraph } from "@/components/ui/text";

import { useAdminAuthOnboarding } from "@/hooks/data";

export const Route = createFileRoute("/_auth/auth/u/onboarding")({
  component: AdminOnboarding,
  validateSearch: z.object({ email: z.email() }),
  beforeLoad: ({ search }) => {
    if (!search.email) throw redirect({ to: "/auth/u/check" });
  },
});

const loginSchema = z
  .object({ email: z.email(), password: z.string(), confirmPassword: z.string() })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function AdminOnboarding() {
  const { email } = Route.useSearch();
  const { mutate, isPending } = useAdminAuthOnboarding();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email, password: "", confirmPassword: "" },
  });

  function onLogin(values: z.infer<typeof loginSchema>) {
    mutate({ email, password: values.password });
  }

  return (
    <>
      <hgroup className="flex flex-col">
        <Heading className="mt-4">Set Your Password</Heading>
        <Paragraph className="text-muted-foreground">
          Create a secure password for your new admin account.
        </Paragraph>
      </hgroup>

      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onLogin)} className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Create a secure password" {...field} />
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
                    <PasswordInput placeholder="Confirm your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button isLoading={isPending} className="my-2 w-full">
              Set Password
            </Button>

            <Link to="/auth/u/check" className="link">
              Back to Email
            </Link>
          </form>
        </Form>
      </div>
    </>
  );
}
