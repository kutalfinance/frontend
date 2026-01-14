import { useState } from "react";
import { useNavigate } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";

import { branchByAgent } from "@/hooks/data/branches";
import { useCreateCustomer } from "@/hooks/data/customers";
import { siteConfig } from "@/lib/config";
import {
  customerDetailsSchema as customerSchema,
  nextOfKinSchema,
} from "@/modules/customers/utils";

import type { Route } from "./+types/customer-create";

export function meta() {
  return [
    { title: `Add Customer - ${siteConfig.name}` },
    { name: "description", content: "Create new customer account" },
  ];
}

const customerDetailsSchema = customerSchema.omit({ branchId: true });

type CustomerDetailsForm = z.infer<typeof customerDetailsSchema>;
type NextOfKinForm = z.infer<typeof nextOfKinSchema>;

export default function CreateCustomer({}: Route.ComponentProps) {
  const navigate = useNavigate();
  const { data: branchData } = useQuery(branchByAgent);
  const { mutate: createCustomer, isPending } = useCreateCustomer();
  const [step, setStep] = useState<"customer" | "nextOfKin">("customer");

  const customerForm = useForm<CustomerDetailsForm>({
    resolver: zodResolver(customerDetailsSchema),
    defaultValues: { name: "", phoneNumber: "", email: "", location: "" },
  });

  const nextOfKinForm = useForm<NextOfKinForm>({
    resolver: zodResolver(nextOfKinSchema),
    defaultValues: { name: "", phoneNumber: "", email: "" },
  });

  const handleClose = () => navigate(-1);

  const handleFinalSubmit = (data: NextOfKinForm) => {
    if (!branchData?.data) {
      toast.error(
        "Branch information is missing. Cannot create customer. Please refresh and try again."
      );
      return;
    }

    const customerData = customerForm.getValues();
    createCustomer(
      { ...customerData, branchId: branchData.data.id, nextOfKin: data },
      { onSuccess: () => handleClose() }
    );
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
                name="contributionAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contribution Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="Enter contribution amount"
                        {...field}
                      />
                    </FormControl>
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
