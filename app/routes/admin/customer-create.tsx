import { useState } from "react";
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

import { useBranchesAdmin } from "@/hooks/data/branches";
import { useCreateCustomer } from "@/hooks/data/customers";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

export function meta() {
  return [
    { title: `Add Customer - ${siteConfig.name}` },
    { name: "description", content: "Create new customer account" },
  ];
}

/**
 * The phone regex supports common international formats like:
 * - +1 (555) 123-4567
 * - +44 20 7123 4567
 * - 555-123-4567
 * - (555) 123 4567
 * */
const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;

const customerDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(phoneRegex, "Please enter a valid phone number (numbers, spaces, +, -, (), allowed)"),
  email: z.email("Please enter a valid email address"),
  location: z.string().min(1, "Location is required"),
  branchId: z.string().min(1, "Branch selection is required"),
});

const nextOfKinSchema = z.object({
  name: z.string().min(1, "Next of kin name is required"),
  phoneNumber: z
    .string()
    .min(1, "Next of kin phone number is required")
    .regex(phoneRegex, "Please enter a valid phone number (numbers, spaces, +, -, (), allowed)"),
  email: z.email("Please enter a valid next of kin email address"),
});

type CustomerDetailsForm = z.infer<typeof customerDetailsSchema>;
type NextOfKinForm = z.infer<typeof nextOfKinSchema>;

export default function CreateCustomer() {
  const navigate = useNavigate();
  const { mutate: createCustomer, isPending } = useCreateCustomer();
  const { data } = useBranchesAdmin();
  const branches = data?.data || [];
  const [step, setStep] = useState<"customer" | "nextOfKin">("customer");

  const customerForm = useForm<CustomerDetailsForm>({
    resolver: zodResolver(customerDetailsSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      location: "",
      branchId: "",
    },
  });

  const nextOfKinForm = useForm<NextOfKinForm>({
    resolver: zodResolver(nextOfKinSchema),
    defaultValues: { name: "", phoneNumber: "", email: "" },
  });

  const handleClose = () => navigate(-1);

  const handleFinalSubmit = (data: NextOfKinForm) => {
    const customerData = customerForm.getValues();
    createCustomer({ ...customerData, nextOfKin: data }, { onSuccess: () => handleClose() });
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create New Customer</DialogTitle>
          <DialogDescription>
            {step === "customer" && "Enter the customer details and information."}
            {step === "nextOfKin" && "Enter the next of kin information."}
          </DialogDescription>
        </DialogHeader>

        {step === "customer" && (
          <Form {...customerForm}>
            <form
              onSubmit={customerForm.handleSubmit(() => setStep("nextOfKin"))}
              className="space-y-4"
            >
              <FormField
                control={customerForm.control}
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
                  control={customerForm.control}
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
                  control={customerForm.control}
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

              <FormField
                control={customerForm.control}
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
                control={customerForm.control}
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
                                    customerForm.setValue("branchId", branch.id);
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

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit">Continue</Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {step === "nextOfKin" && (
          <Form {...nextOfKinForm}>
            <form onSubmit={nextOfKinForm.handleSubmit(handleFinalSubmit)} className="space-y-4">
              <FormField
                control={nextOfKinForm.control}
                name="name"
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
                  control={nextOfKinForm.control}
                  name="phoneNumber"
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
                  control={nextOfKinForm.control}
                  name="email"
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

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setStep("customer")}>
                  Back
                </Button>
                <Button type="submit" isLoading={isPending}>
                  Create Customer
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
