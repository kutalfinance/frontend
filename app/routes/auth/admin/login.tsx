import { Link, useSearchParams } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { CornerUpLeft } from "lucide-react";
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

import { useAdminAuthIsActive, useAdminAuthLogin } from "@/hooks/auth/admin";
import { siteConfig } from "@/lib/config";

export function meta() {
  return [
    { title: `Admin Login - ${siteConfig.name}` },
    { name: "description", content: "Sign in to admin dashboard" },
  ];
}

export default function AdminAuth() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  return email ? <AdminLogin email={email} /> : <AdminIsActive />;
}

const isActiveSchema = z.object({ email: z.email() });

function AdminIsActive() {
  const { mutate, isPending } = useAdminAuthIsActive();

  const form = useForm<z.infer<typeof isActiveSchema>>({
    resolver: zodResolver(isActiveSchema),
    defaultValues: { email: "" },
  });

  function onLogin(values: z.infer<typeof isActiveSchema>) {
    mutate(values);
  }

  return (
    <>
      <Link to="/auth" className="link">
        <CornerUpLeft /> Back
      </Link>

      <hgroup className="flex flex-col">
        <Heading className="mt-4">Admin Login</Heading>
        <Paragraph className="text-muted-foreground">
          Enter your email address to continue.
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
                    <Input type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button isLoading={isPending} className="mt-2 w-full">
              Continue
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}

const loginSchema = z.object({ email: z.email(), password: z.string() });

function AdminLogin({ email }: { email: string }) {
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

            <Link to="/auth/admin/login" className="link">
              Back to email
            </Link>
          </form>
        </Form>
      </div>
    </>
  );
}
