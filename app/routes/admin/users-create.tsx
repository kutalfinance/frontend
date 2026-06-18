import { useState } from "react";
import { useNavigate } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SuperAdminOnly } from "@/components/protected";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Paragraph } from "@/components/ui/text";

import { useCreateAdmin, useCreateAgent } from "@/hooks/data/users";
import { siteConfig } from "@/lib/config";
import { UserRoles } from "@/lib/types";

export function meta() {
  return [
    { title: `Add User - ${siteConfig.name}` },
    { name: "description", content: "Create new user account" },
  ];
}

const userTypeOptions = [
  {
    value: UserRoles.AGENT,
    label: "Agent",
    description: "Branch-scoped access for recording deposits and managing customers",
    superAdminOnly: false,
  },
  {
    value: UserRoles.ADMIN,
    label: "Administrator",
    description: "Full system access with approval authority and reporting capabilities",
    superAdminOnly: true,
  },
];

const userDetailsSchema = z.object({
  superAdmin: z.boolean().optional(),
  approver: z.boolean().optional(),
  name: z.string("Name is required"),
  email: z.email("Please enter a valid email address"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

type UserDetailsForm = z.infer<typeof userDetailsSchema>;
type OTPForm = z.infer<typeof otpSchema>;

export default function CreateUser() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"userType" | "details">("userType");
  const [userType, setUserType] = useState<UserRoles>(UserRoles.AGENT);

  const { mutate: createAdmin, isPending: isPendingAdmin } = useCreateAdmin();
  const { mutate: createAgent, isPending: isPendingAgent } = useCreateAgent();

  const detailsForm = useForm<UserDetailsForm>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: { approver: true, superAdmin: false, email: "" },
  });

  const otpForm = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const handleClose = () => navigate(-1);

  const handleUserTypeChange = (value: UserRoles) => {
    setUserType(value);
    detailsForm.reset();
    otpForm.reset();
  };

  const handleDetailsSubmit = (data: UserDetailsForm) => {
    if (userType === UserRoles.AGENT) {
      return createAgent(data, { onSuccess: handleClose });
    }

    createAdmin(data, { onSuccess: handleClose });
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            {step === "userType" && "Select the type of user account to create."}
            {step === "details" && "Enter the user details and permissions."}
          </DialogDescription>
        </DialogHeader>

        {step === "userType" && (
          <form className="space-y-3" onSubmit={() => setStep("details")}>
            <div>
              <RadioGroup onValueChange={handleUserTypeChange} value={userType}>
                {userTypeOptions.map((option) => {
                  const radio = (
                    <div
                      key={option.value}
                      className="border-input has-data-[state=checked]:border-primary relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none"
                    >
                      <div className="grid flex-1 gap-1">
                        <Label htmlFor={option.value}>{option.label}</Label>
                        <Paragraph className="text-muted-foreground text-xs">
                          {option.description}
                        </Paragraph>
                      </div>
                      <RadioGroupItem value={option.value} className="after:absolute after:inset-0" />
                    </div>
                  );
                  return option.superAdminOnly ? (
                    <SuperAdminOnly key={option.value}>{radio}</SuperAdminOnly>
                  ) : (
                    radio
                  );
                })}
              </RadioGroup>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">Continue</Button>
            </DialogFooter>
          </form>
        )}

        {step === "details" && (
          <Form {...detailsForm}>
            <form onSubmit={detailsForm.handleSubmit(handleDetailsSubmit)} className="space-y-3">
              <FormField
                control={detailsForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder={`Enter ${userType} full name`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={detailsForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={`Enter ${userType} email address`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {userType === UserRoles.ADMIN && (
                <>
                  <FormField
                    control={detailsForm.control}
                    name="approver"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="hover:bg-muted relative flex items-start justify-between gap-2 rounded-lg border p-3 transition-colors">
                            <div className="flex-1 space-y-1">
                              <FormLabel htmlFor="super-admin-switch">Approver Access</FormLabel>
                              <Paragraph className="text-muted-foreground text-xs">
                                Allow this administrator to approve transactions and critical
                                actions
                              </Paragraph>
                            </div>
                            <Checkbox
                              id="approver-switch"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="after:absolute after:inset-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <SuperAdminOnly>
                    <FormField
                      control={detailsForm.control}
                      name="superAdmin"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="hover:bg-muted relative flex items-start justify-between gap-2 rounded-lg border p-3 transition-colors">
                              <div className="flex-1 space-y-1">
                                <FormLabel htmlFor="super-admin-switch">
                                  Super Administrator
                                </FormLabel>
                                <Paragraph className="text-muted-foreground text-xs">
                                  Grant full administrative privileges and user management
                                  capabilities
                                </Paragraph>
                              </div>
                              <Checkbox
                                id="super-admin-switch"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="after:absolute after:inset-0"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </SuperAdminOnly>
                </>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setStep("userType")}>
                  Back
                </Button>
                <Button isLoading={isPendingAdmin || isPendingAgent} type="submit">
                  Create user
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
