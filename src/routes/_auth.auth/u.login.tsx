import { zodResolver } from "@hookform/resolvers/zod";
import { Link, createFileRoute } from "@tanstack/react-router";
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

import { useAdminAuthLogin } from "@/hooks/data";

export const Route = createFileRoute("/_auth/auth/u/login")({
  component: AdminLogin,
});

const loginSchema = z.object({ email: z.email(), password: z.string() });

export default function AdminLogin() {
  const { mutate, isPending } = useAdminAuthLogin();
  const navigate = Route.useNavigate();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onLogin(values: z.infer<typeof loginSchema>) {
    mutate(values, {
      onSuccess: () => navigate({ to: "/auth/u/otp", search: { email: values.email } }),
    });
  }

  return (
    <>
      <Link to="/auth" className="link">
        <CornerUpLeft /> Back
      </Link>

      <hgroup className="flex flex-col">
        <Heading className="mt-4">Welcome Back</Heading>
        <Paragraph className="text-muted-foreground">
          Enter your credentials to access your account.
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button isLoading={isPending} className="mt-2 w-full">
              Sign In
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}