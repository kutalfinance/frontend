import { useState } from "react";
import { useSearchParams } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const transactionSchema = z.object({
  amount: z.coerce.number().optional() as z.ZodOptional<z.ZodNumber>,
  customerId: z.string(),
});

type TransactionForm = z.infer<typeof transactionSchema>;

export function AdminRecordDeposit({ ...props }: React.ComponentProps<typeof DialogTrigger>) {
  const [searchParams] = useSearchParams();
  const customerIdParam = searchParams.get("customerId");

  const [open, setOpen] = useState(false);
  const { mutate: createTransaction, isPending } = useMutation(createDepositOptions);
  const { data } = useCustomers();
  const customers = data?.data ?? [];

  const form = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { amount: undefined, customerId: customerIdParam ?? "" },
  });

  const handleSubmit = (data: TransactionForm) => {
    createTransaction(data, { onSuccess: () => setOpen(false) });
  };

  return (
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

export function AdminRecordWithdrawal({ ...props }: React.ComponentProps<typeof DialogTrigger>) {
  const [searchParams] = useSearchParams();
  const customerIdParam = searchParams.get("customerId");

  const [open, setOpen] = useState(false);
  const { mutate: createTransaction, isPending } = useMutation(createWithdrawalOptions);
  const { data } = useCustomers();
  const customers = data?.data ?? [];

  const form = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { amount: undefined, customerId: customerIdParam ?? "" },
  });

  const handleSubmit = (data: TransactionForm) => {
    createTransaction(data, { onSuccess: () => setOpen(false) });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger {...props} />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Withdrawal</DialogTitle>
          <DialogDescription>Record a customer withdrawal</DialogDescription>
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
                              >
                                {customer.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    customer.id === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
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

            <DialogFooter className="sm:col-span-2">
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
