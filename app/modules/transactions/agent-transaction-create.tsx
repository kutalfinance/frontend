import { useState } from "react";

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

import { createDepositOptions, createWithdrawalOptions } from "@/hooks/data/transactions";
import type { Customer } from "@/lib/types";

const transactionSchema = z.object({
  amount: z.coerce.number().optional() as z.ZodOptional<z.ZodNumber>,
});

type TransactionForm = z.infer<typeof transactionSchema>;

export function AgentRecordDeposit({
  customer,
  ...props
}: React.ComponentProps<typeof DialogTrigger> & { customer: Customer }) {
  const [open, setOpen] = useState(false);
  const { mutate: createTransaction, isPending } = useMutation(createDepositOptions);

  const form = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { amount: undefined },
  });

  const handleSubmit = (data: TransactionForm) => {
    createTransaction(
      { customerId: customer.id, amount: data.amount },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger {...props} />

      <DialogContent>
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
  const { mutate: createTransaction, isPending } = useMutation(createWithdrawalOptions);

  const form = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { amount: undefined },
  });

  const handleSubmit = (data: TransactionForm) => {
    createTransaction(
      { customerId: customer.id, amount: data.amount },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger {...props} />

      <DialogContent>
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
