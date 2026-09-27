import { useState } from "react";

import { useMutation } from "@tanstack/react-query";

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

import { reverseTransactionOptions } from "@/hooks/data/transactions";
import type { Transaction } from "@/lib/types";
import { formatMoney } from "@/lib/utils/money";

export function ReverseTransaction({
  transaction,
  ...props
}: React.ComponentProps<typeof AlertDialogTrigger> & { transaction: Transaction }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useMutation(reverseTransactionOptions);

  function onReverse() {
    mutate(transaction.id);
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild disabled={isPending} {...props} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reverse Transaction?</AlertDialogTitle>
          <AlertDialogDescription>
            This will reverse the {transaction.type.toLowerCase()} of{" "}
            <strong>{formatMoney(transaction.amount)}</strong> for{" "}
            <strong>{transaction.customer.name}</strong>. The transaction will be marked as
            reversed and the customer's balance and contribution days will be adjusted. This cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild onClick={onReverse}>
            <Button variant="destructive" isLoading={isPending}>
              Reverse Transaction
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
