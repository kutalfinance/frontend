import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Download } from "lucide-react";
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

import { useBranchesAdmin } from "@/hooks/data/branches";
import { uploadCustomersOptions } from "@/hooks/data/customers";
import { cn } from "@/lib/utils";

const CSV_TEMPLATE = [
  "name,email,phone number,location,contribution amount,nok name,nok phone number,nok email,last withdrawal date,contribution start date,registration date,balance",
  "Ama Darko,ama@example.com,0245551234,Adum Kumasi,50.00,Kofi Darko,0201234567,kofi@example.com,2025-01-15,2024-06-01,2024-05-20,1000.00",
].join("\n");

function downloadTemplate() {
  const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "customer-upload-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

const uploadSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Please select a file")
    .refine((files) => files[0]?.name.endsWith(".csv"), "Only CSV files are allowed"),
  branchId: z.string().min(1, "Please select a branch"),
});

type UploadForm = z.infer<typeof uploadSchema>;

export function CustomerBulkUpload({ ...props }: React.ComponentProps<typeof DialogTrigger>) {
  const [open, setOpen] = useState(false);
  const { mutate: uploadCustomers, isPending } = useMutation(uploadCustomersOptions);
  const { data } = useBranchesAdmin();
  const branches = data?.data ?? [];

  const form = useForm<UploadForm>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      branchId: "",
    },
  });

  const handleSubmit = (data: UploadForm) => {
    const file = data.file[0];
    uploadCustomers(
      { file, branchId: data.branchId },
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
          <DialogTitle>Upload Customers</DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk create customers. All customers will be assigned to the
            selected branch.
          </DialogDescription>
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto w-fit p-0 text-xs"
            onClick={downloadTemplate}
          >
            <Download className="size-3" />
            Download CSV template
          </Button>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>CSV File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Branch</FormLabel>
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
                            ? branches.find((branch) => branch.id === field.value)?.name
                            : "Select branch"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search branches..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No branches found.</CommandEmpty>
                          <CommandGroup>
                            {branches.map((branch) => (
                              <CommandItem
                                value={branch.id}
                                key={branch.id}
                                onSelect={() => {
                                  form.setValue("branchId", branch.id);
                                }}
                                asChild
                              >
                                <PopoverClose className="w-full">
                                  {branch.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      branch.id === field.value ? "opacity-100" : "opacity-0"
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
              <Button type="submit" isLoading={isPending}>
                Upload Customers
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
