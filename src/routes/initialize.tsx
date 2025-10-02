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

import { useAdminAuthInitialize } from "@/hooks/auth/admin";

export const Route = createFileRoute("/initialize")({
  component: AdminInitialize,
});

const initSchema = z.object({ name: z.string(), email: z.email(), password: z.string() });

function AdminInitialize() {
  const { mutate, isPending } = useAdminAuthInitialize();

  const form = useForm<z.infer<typeof initSchema>>({
    resolver: zodResolver(initSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  function onInitialize(values: z.infer<typeof initSchema>) {
    mutate({ ...values, superAdmin: true });
  }

  return (
    <div className="container mx-auto grid min-h-[90dvh] w-full max-w-lg place-items-center">
      <div className="bg-card w-full space-y-8 rounded-md pt-20 pb-24 sm:px-10">
        <hgroup className="flex flex-col">
          <Heading className="mt-4">Initialize Administrator</Heading>
          <Paragraph className="text-muted-foreground">
            Create your administrator account to get started.
          </Paragraph>
        </hgroup>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onInitialize)} className="grid gap-2">
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
                      <PasswordInput placeholder="Create your admin password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button isLoading={isPending} className="mt-2 w-full">
                Create administrator account
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
