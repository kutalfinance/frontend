import { useNavigate } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Heading } from "@/components/ui/text";

import { useBranches, useCreateCustomer } from "@/hooks/data";
import { cn } from "@/lib/utils";

/**
 * The phone regex supports common international formats like:
 * - +1 (555) 123-4567
 * - +44 20 7123 4567
 * - 555-123-4567
 * - (555) 123 4567
 * */
const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(phoneRegex, "Please enter a valid phone number (numbers, spaces, +, -, (), allowed)"),
  email: z.email("Please enter a valid email address"),
  location: z.string().min(1, "Location is required"),
  nextOfKin: z.object({
    name: z.string().min(1, "Next of kin name is required"),
    phoneNubmer: z
      .string()
      .min(1, "Next of kin phone number is required")
      .regex(phoneRegex, "Please enter a valid phone number (numbers, spaces, +, -, (), allowed)"),
    email: z.email("Please enter a valid next of kin email address"),
  }),
  branchId: z.string().min(1, "Branch selection is required"),
});

type CustomerForm = z.infer<typeof customerSchema>;

export default function CreateCustomer() {
  const navigate = useNavigate();
  const { mutate: createCustomer, isPending } = useCreateCustomer();
  const { data } = useBranches();
  const branches = data || [];

  const form = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      location: "",
      nextOfKin: { name: "", phoneNubmer: "", email: "" },
      branchId: "",
    },
  });

  const handleClose = () => navigate("/customers");

  const handleSubmit = (data: CustomerForm) => {
    createCustomer(data, {
      onSuccess: () => handleClose(),
    });
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Customer</DialogTitle>
          <DialogDescription>
            Enter the customer details and next of kin information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-4">
              <Heading variant="h4">Customer Information</Heading>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer location" {...field} />
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
                                  >
                                    {branch.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        branch.id === field.value ? "opacity-100" : "opacity-0"
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
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <Heading variant="h4">Next of Kin Information</Heading>

              <FormField
                control={form.control}
                name="nextOfKin.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next of Kin Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter next of kin's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nextOfKin.phoneNubmer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Next of Kin Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Enter next of kin phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nextOfKin.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Next of Kin Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter next of kin email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isPending}>
                Create Customer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
