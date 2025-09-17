import { createFileRoute } from "@tanstack/react-router";

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

import { useAdminAuthInitialize } from "@/hooks/data";

export const Route = createFileRoute("/_auth/auth/u/initialize")({
  component: AdminInitialize,
});

const initSchema = z.object({ name: z.string(), email: z.email(), password: z.string() });

export default function AdminInitialize() {
  const navigate = Route.useNavigate();
  const { mutate, isPending } = useAdminAuthInitialize();

  const form = useForm<z.infer<typeof initSchema>>({
    resolver: zodResolver(initSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  function onLogin(values: z.infer<typeof initSchema>) {
    mutate(
      { ...values, superAdmin: true },
      {
        onSuccess: () => navigate({ to: "/auth/u/otp", search: { email: values.email } }),
      }
    );
  }

  return (
    <>
      <hgroup className="flex flex-col">
        <Heading className="mt-4">Initialize Administrator</Heading>
        <Paragraph className="text-muted-foreground">
          Create your administrator account to get started.
        </Paragraph>
      </hgroup>

      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onLogin)} className="grid gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input autoFocus placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              Create Administrator Account
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
