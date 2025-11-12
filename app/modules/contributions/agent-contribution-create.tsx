import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { createDepositOptions, createWithdrawalOptions } from "@/hooks/data/customers";
import type { Customer } from "@/lib/types";
import { useState } from "react";

const contributionSchema = z.object({ amount: z.coerce.number() as z.ZodNumber });

type ContributionForm = z.infer<typeof contributionSchema>;

export function AgentRecordDeposit({
  customer,
  ...props
}: React.ComponentProps<typeof DialogTrigger> & { customer: Customer }) {
  const [open, setOpen] = useState(false);
  const { mutate: createContribution, isPending } = useMutation(createDepositOptions);

  const form = useForm<ContributionForm>({
    resolver: zodResolver(contributionSchema),
    defaultValues: { amount: undefined },
  });

  const handleSubmit = (data: ContributionForm) => {
    createContribution(
      { customerId: customer.id, amount: data.amount },
      { onSuccess: () => setOpen(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger {...props} />

      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Record Deposit</DialogTitle>
          <DialogDescription>
            Record a new deposit for <strong>{customer.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deposit Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter deposit amount"
                      step="1"
                      min="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isPending}>
                Record Deposit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function AgentRecordWithdrawal({
  customer,
  ...props
}: React.ComponentProps<typeof DialogTrigger> & { customer: Customer }) {
  const [open, setOpen] = useState(false);
  const { mutate: createContribution, isPending } = useMutation(createWithdrawalOptions);

  const form = useForm<ContributionForm>({
    resolver: zodResolver(contributionSchema),
    defaultValues: { amount: undefined },
  });

  const handleSubmit = (data: ContributionForm) => {
    createContribution(
      { customerId: customer.id, amount: data.amount },
      { onSuccess: () => setOpen(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger {...props} />

      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Record Withdrawal</DialogTitle>
          <DialogDescription>
            Record a new withdrawal for <strong>{customer.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Withdrawal Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter withdrawal amount"
                      step="1"
                      min="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isPending} variant="destructive-outline">
                Record Withdrawal
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
