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

import { downloadStatementCsvOptions, downloadStatementOptions } from "@/hooks/data/customers";
import type { Customer } from "@/lib/types";

const statementSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type StatementForm = z.infer<typeof statementSchema>;

export function DownloadStatement({
  customer,
  ...props
}: React.ComponentProps<typeof DialogTrigger> & { customer: Customer }) {
  const [open, setOpen] = useState(false);
  const { mutate: downloadStatement, isPending } = useMutation(downloadStatementOptions);
  const { mutate: downloadCsv, isPending: isCsvPending } = useMutation(downloadStatementCsvOptions);

  const form = useForm<StatementForm>({
    resolver: zodResolver(statementSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
    },
  });

  function buildPayload(data: StatementForm) {
    return {
      customerId: customer.id,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
    };
  }

  const handleSubmit = (data: StatementForm) => {
    downloadStatement(buildPayload(data), {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  const handleCsvSubmit = (data: StatementForm) => {
    downloadCsv(buildPayload(data), {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger {...props} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Account Statement</DialogTitle>
          <DialogDescription>
            Download account statement for <strong>{customer.name}</strong>. Select a date range or
            leave empty to download all transactions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
                isLoading={isCsvPending}
                onClick={form.handleSubmit(handleCsvSubmit)}
              >
                Download CSV
              </Button>
              <Button type="submit" isLoading={isPending}>
                Download PDF
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
