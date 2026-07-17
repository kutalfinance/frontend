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

import { approveTransactionOptions, rejectTransactionOptions } from "@/hooks/data/transactions";
import type { Transaction } from "@/lib/types";
import { formatMoney } from "@/lib/utils/money";

export function ApproveTransaction({
  transaction,
  ...props
}: React.ComponentProps<typeof AlertDialogTrigger> & { transaction: Transaction }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useMutation(approveTransactionOptions);

  function onApprove() {
    mutate(transaction.id);
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild disabled={isPending} {...props} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Transaction?</AlertDialogTitle>
          <AlertDialogDescription>
            This will approve the {transaction.type.toLowerCase()} of{" "}
            <strong>{formatMoney(transaction.amount)}</strong> for customer{" "}
            <strong>{transaction.customer.name}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild onClick={onApprove}>
            <Button>Approve Transaction</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function RejectTransaction({
  transaction,
  ...props
}: React.ComponentProps<typeof AlertDialogTrigger> & { transaction: Transaction }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useMutation(rejectTransactionOptions);

  function onReject() {
    mutate(transaction.id);
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild disabled={isPending} {...props} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject Transaction?</AlertDialogTitle>
          <AlertDialogDescription>
            This will reject the {transaction.type.toLowerCase()} of{" "}
            <strong>{formatMoney(transaction.amount)}</strong> for customer{" "}
            <strong>{transaction.customer.name}</strong>. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild onClick={onReject}>
            <Button variant="destructive">Reject Transaction</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
