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

import { useAdminAuthLogin } from "@/hooks/auth/admin";

export const Route = createFileRoute("/auth/admin/login")({
  component: AdminLogin,
  validateSearch: z.object({ email: z.email() }),
  beforeLoad: ({ search }) => {
    if (!search.email) throw redirect({ to: "/auth/admin/check" });
  },
});

const loginSchema = z.object({ email: z.email(), password: z.string() });

function AdminLogin() {
  const { email } = Route.useSearch();
  const { mutate, isPending } = useAdminAuthLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email, password: "" },
  });

  function onLogin(values: z.infer<typeof loginSchema>) {
    mutate(values);
  }

  return (
    <>
      <hgroup className="flex flex-col">
        <Heading className="mt-4">Enter Your Password</Heading>
        <Paragraph className="text-muted-foreground">
          Please enter your password to sign in to your account.
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
                    <PasswordInput placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button isLoading={isPending} className="my-2 w-full">
              Sign in
            </Button>

            <Link to="/auth/admin/check" className="link">
              Back to email
            </Link>
          </form>
        </Form>
      </div>
    </>
  );
}