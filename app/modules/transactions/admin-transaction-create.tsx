import { useRef, useState } from "react";
import { useSearchParams } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ChevronsUpDown } from "lucide-react";
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
import { Input, inputStyles } from "@/components/ui/input";

import { createDepositOptions, createWithdrawalOptions } from "@/hooks/data/transactions";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/utils/money";
import { CustomerPicker, useSelectedCustomer } from "@/modules/customers/customer-picker";

const transactionSchema = z.object({
  amount: z.coerce.number().optional() as z.ZodOptional<z.ZodNumber>,
  customerId: z.string(),
});

type TransactionForm = z.infer<typeof transactionSchema>;

export function AdminRecordDeposit({ ...props }: React.ComponentProps<typeof DialogTrigger>) {
  const [searchParams] = useSearchParams();
  const customerIdParam = searchParams.get("customerId");

  const [open, setOpen] = useState(false);
  const [pendingData, setPendingData] = useState<TransactionForm | null>(null);
  const { mutate: createTransaction, isPending } = useMutation(createDepositOptions);
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  const form = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { amount: undefined, customerId: customerIdParam ?? "" },
  });
  const selectedCustomer = useSelectedCustomer(form.watch("customerId"));

  const handleSubmit = (data: TransactionForm) => {
    if (
      selectedCustomer &&
      data.amount !== undefined &&
      data.amount % selectedCustomer.contributionAmount !== 0
    ) {
      form.setError("amount", {
        message: `Amount must be a multiple of ${formatMoney(selectedCustomer.contributionAmount)}`,
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
    createTransaction({ ...pendingData, idempotencyKey });
  };

  const pendingCustomerName = pendingData ? selectedCustomer?.name : null;

  return (
    <>
      <AlertDialog open={!!pendingData} onOpenChange={(o) => !o && setPendingData(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Record Deposit?</AlertDialogTitle>
            <AlertDialogDescription>
              This will record a deposit of <strong>{formatMoney(pendingData?.amount ?? 0)}</strong>{" "}
              for customer <strong>{pendingCustomerName}</strong>.
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
            <DialogDescription>Record a customer deposit</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Customer</FormLabel>
                    <CustomerPicker
                      value={field.value}
                      onSelect={(customer) =>
                        form.setValue("customerId", customer?.id ?? "", { shouldValidate: true })
                      }
                    >
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            inputStyles,
                            "justify-between font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <span className="truncate">
                            {field.value
                              ? (selectedCustomer?.name ?? "Loading...")
                              : "Select customer"}
                          </span>
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </CustomerPicker>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <DialogFooter className="sm:col-span-2">
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

const withdrawalSchema = z.object({
  customerId: z.string().min(1),
  amount: z.coerce.number().positive().optional() as z.ZodOptional<z.ZodNumber>,
  serviceCharge: z.coerce.number().min(0).optional() as z.ZodOptional<z.ZodNumber>,
});
type WithdrawalForm = z.infer<typeof withdrawalSchema>;

export function AdminRecordWithdrawal({ ...props }: React.ComponentProps<typeof DialogTrigger>) {
  const [searchParams] = useSearchParams();
  const customerIdParam = searchParams.get("customerId");

  const [open, setOpen] = useState(false);
  const [pendingData, setPendingData] = useState<WithdrawalForm | null>(null);
  const { mutate: createTransaction, isPending } = useMutation(createWithdrawalOptions);
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  const form = useForm<WithdrawalForm>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      customerId: customerIdParam ?? "",
      amount: undefined,
      serviceCharge: undefined,
    },
  });
  const selectedCustomer = useSelectedCustomer(form.watch("customerId"));

  const handleSubmit = (data: WithdrawalForm) => setPendingData(data);

  const handleConfirm = () => {
    if (!pendingData) return;
    setOpen(false);
    setPendingData(null);
    const idempotencyKey = idempotencyKeyRef.current;
    idempotencyKeyRef.current = crypto.randomUUID();
    createTransaction(
      {
        customerId: pendingData.customerId,
        amount: pendingData.amount,
        serviceCharge: pendingData.serviceCharge,
        idempotencyKey,
      },
      {
        onSuccess: () =>
          form.reset({
            customerId: customerIdParam ?? "",
            amount: undefined,
            serviceCharge: undefined,
          }),
      }
    );
  };

  const pendingCustomerName = pendingData ? selectedCustomer?.name : null;

  return (
    <>
      <AlertDialog open={!!pendingData} onOpenChange={(o) => !o && setPendingData(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Record Withdrawal?</AlertDialogTitle>
            <AlertDialogDescription>
              This will initiate a withdrawal
              {pendingData?.amount !== undefined
                ? ` of ${formatMoney(pendingData.amount)}`
                : " of the entire balance"}{" "}
              for <strong>{pendingCustomerName}</strong>.
              {pendingData?.serviceCharge
                ? ` A service charge of ${formatMoney(pendingData.serviceCharge)} will be applied.`
                : " No service charge will be applied."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild onClick={handleConfirm}>
              <Button variant="destructive-outline" isLoading={isPending}>
                Record Withdrawal
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger {...props} />

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Withdrawal</DialogTitle>
            <DialogDescription>Record a customer withdrawal</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Customer</FormLabel>
                    <CustomerPicker
                      value={field.value}
                      onSelect={(customer) =>
                        form.setValue("customerId", customer?.id ?? "", { shouldValidate: true })
                      }
                    >
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            inputStyles,
                            "justify-between font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <span className="truncate">
                            {field.value
                              ? (selectedCustomer?.name ?? "Loading...")
                              : "Select customer"}
                          </span>
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </CustomerPicker>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Withdrawal Amount{" "}
                      <span className="text-muted-foreground font-normal">
                        (leave blank for full balance)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter withdrawal amount"
                        step="1"
                        min="1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceCharge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Service Fee{" "}
                      <span className="text-muted-foreground font-normal">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter service fee"
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
                <Button type="submit" variant="destructive-outline">
                  Record Withdrawal
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
