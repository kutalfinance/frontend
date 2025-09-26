import { Link, createFileRoute } from "@tanstack/react-router";

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
import { Input } from "@/components/ui/input";
import { Heading, Paragraph } from "@/components/ui/text";

import { useAgentAuthLogin } from "@/hooks/auth/agent";

export const Route = createFileRoute("/auth/agent/login")({
  component: AgentLogin,
});

const loginSchema = z.object({ email: z.email() });

function AgentLogin() {
  const { mutate, isPending } = useAgentAuthLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "" },
  });

  function onLogin(values: z.infer<typeof loginSchema>) {
    mutate(values);
  }

  return (
    <>
      <Link to="/auth" className="link">
        <CornerUpLeft /> Back
      </Link>

      <hgroup className="flex flex-col">
        <Heading className="mt-4">Agent Login</Heading>
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

            <Button isLoading={isPending} className="my-2 w-full">
              Continue
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}