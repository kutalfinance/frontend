import { useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { formatMoney } from "@/lib/utils/money";

const transactionSchema = z.object({
  amount: z.coerce.number().optional() as z.ZodOptional<z.ZodNumber>,
});

type TransactionForm = z.infer<typeof transactionSchema>;

export function AgentRecordDeposit({
  customer,
  ...props
}: React.ComponentProps<typeof DialogTrigger> & { customer: Customer }) {
  const [open, setOpen] = useState(false);
  const [pendingData, setPendingData] = useState<TransactionForm | null>(null);
  const { mutate: createTransaction, isPending } = useMutation(createDepositOptions);
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  const form = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { amount: undefined },
  });

  const handleSubmit = (data: TransactionForm) => {
    if (data.amount !== undefined && data.amount % customer.contributionAmount !== 0) {
      form.setError("amount", {
        message: `Amount must be a multiple of ${formatMoney(customer.contributionAmount)}`,
      });
      return;
    }
    setPendingData(data);
  };

  const handleConfirm = () => {
    if (!pendingData) return;
    setOpen(false);
    setPendingData(null);
    const idempotencyKey = idempotencyKeyRef.current;
    idempotencyKeyRef.current = crypto.randomUUID();
    createTransaction(
      { customerId: customer.id, amount: pendingData.amount, idempotencyKey, customerName: customer.name },
      { onSuccess: () => form.reset() }
    );
  };

  return (
    <>
      <AlertDialog open={!!pendingData} onOpenChange={(o) => !o && setPendingData(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Record Deposit?</AlertDialogTitle>
            <AlertDialogDescription>
              This will record a deposit of <strong>{formatMoney(pendingData?.amount ?? 0)}</strong>{" "}
              for customer <strong>{customer.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild onClick={handleConfirm}>
              <Button isLoading={isPending}>Record Deposit</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                <Button type="submit">Record Deposit</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AgentRecordWithdrawal({
  customer,
  ...props
}: React.ComponentProps<typeof AlertDialogTrigger> & { customer: Customer }) {
  const { mutate: createTransaction } = useMutation(createWithdrawalOptions);
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  function handleConfirm() {
    const idempotencyKey = idempotencyKeyRef.current;
    idempotencyKeyRef.current = crypto.randomUUID();
    createTransaction({ customerId: customer.id, idempotencyKey, customerName: customer.name });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild {...props} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Record Withdrawal?</AlertDialogTitle>
          <AlertDialogDescription>
            This will withdraw the entire balance for customer <strong>{customer.name}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild onClick={handleConfirm}>
            <Button variant="destructive-outline">Record Withdrawal</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
