import { useRef, useState } from "react";
import { useSearchParams } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { useCustomers } from "@/hooks/data/customers";
import { createDepositOptions, createWithdrawalOptions } from "@/hooks/data/transactions";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/utils/money";

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
  const { data } = useCustomers();
  const idempotencyKeyRef = useRef(crypto.randomUUID());
  const customers = data?.data ?? [];

  const form = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { amount: undefined, customerId: customerIdParam ?? "" },
  });

  const handleSubmit = (data: TransactionForm) => {
    const selectedCustomer = customers.find((c) => c.id === data.customerId);
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

  const pendingCustomerName = pendingData
    ? customers.find((c) => c.id === pendingData.customerId)?.name
    : null;

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
                    <Popover>
                      <PopoverTrigger asChild>
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
                            {field.value
                              ? customers.find((customer) => customer.id === field.value)?.name
                              : "Select customer"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Search customers..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No customers found.</CommandEmpty>
                            <CommandGroup>
                              {customers.map((customer) => (
                                <CommandItem
                                  key={customer.id}
                                  value={customer.name}
                                  onSelect={() => {
                                    form.setValue("customerId", customer.id);
                                  }}
                                  asChild
                                >
                                  <PopoverClose className="w-full">
                                    {customer.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        customer.id === field.value ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                  </PopoverClose>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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

const withdrawalSchema = z.object({ customerId: z.string().min(1) });
type WithdrawalForm = z.infer<typeof withdrawalSchema>;

export function AdminRecordWithdrawal({ ...props }: React.ComponentProps<typeof DialogTrigger>) {
  const [searchParams] = useSearchParams();
  const customerIdParam = searchParams.get("customerId");

  const [open, setOpen] = useState(false);
  const [pendingCustomerId, setPendingCustomerId] = useState<string | null>(null);
  const { mutate: createTransaction } = useMutation(createWithdrawalOptions);
  const { data } = useCustomers();
  const idempotencyKeyRef = useRef(crypto.randomUUID());
  const customers = data?.data ?? [];

  const form = useForm<WithdrawalForm>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: { customerId: customerIdParam ?? "" },
  });

  const handleSubmit = (data: WithdrawalForm) => {
    setPendingCustomerId(data.customerId);
  };

  const handleConfirm = () => {
    if (!pendingCustomerId) return;
    setOpen(false);
    setPendingCustomerId(null);
    const idempotencyKey = idempotencyKeyRef.current;
    idempotencyKeyRef.current = crypto.randomUUID();
    createTransaction({ customerId: pendingCustomerId, idempotencyKey });
  };

  const pendingCustomerName = pendingCustomerId
    ? customers.find((c) => c.id === pendingCustomerId)?.name
    : null;

  return (
    <>
      <AlertDialog
        open={!!pendingCustomerId}
        onOpenChange={(o) => !o && setPendingCustomerId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Record Withdrawal?</AlertDialogTitle>
            <AlertDialogDescription>
              This will withdraw the entire balance for customer{" "}
              <strong>{pendingCustomerName}</strong>.
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
                    <Popover>
                      <PopoverTrigger asChild>
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
                            {field.value
                              ? customers.find((customer) => customer.id === field.value)?.name
                              : "Select customer"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Search customers..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No customers found.</CommandEmpty>
                            <CommandGroup>
                              {customers.map((customer) => (
                                <CommandItem
                                  key={customer.id}
                                  value={customer.name}
                                  onSelect={() => {
                                    form.setValue("customerId", customer.id);
                                  }}
                                  asChild
                                >
                                  <PopoverClose className="w-full">
                                    {customer.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        customer.id === field.value ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                  </PopoverClose>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
