import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Paragraph } from "@/components/ui/text";

import { useCreateUser } from "@/hooks/data";

export const Route = createFileRoute("/_main/u/users/create")({
  component: CreateUser,
});

const userTypeOptions = [
  {
    value: "agent",
    label: "Agent",
    description: "Limited access to assigned tasks and support tickets",
  },
  {
    value: "admin",
    label: "Administrator",
    description: "Access to administrative panel and user management",
  },
];

const userDetailsSchema = z.object({
  superAdmin: z.boolean(),
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

function CreateUser() {
  const navigate = Route.useNavigate();
  const [step, setStep] = useState<"userType" | "details" | "verification">("userType");
  const [userType, setUserType] = useState<"agent" | "admin" | (string & {})>("agent");

  const { mutate: createUser, isPending } = useCreateUser();

  const detailsForm = useForm<UserDetailsForm>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: { superAdmin: false, email: "" },
  });

  const otpForm = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const handleClose = () => navigate({ to: ".." });

  const handleDetailsSubmit = (data: UserDetailsForm) => {
    createUser(data, { onSuccess: () => setStep("verification") });
  };

  const handleOtpSubmit = (data: OTPForm) => {
    const userDetails = detailsForm.getValues();
    console.log("Creating user:", { ...userDetails, otp: data.otp });
    handleClose();
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            {step === "userType" && "Select the type of user account to create."}
            {step === "details" && "Enter the user details and permissions."}
            {step === "verification" &&
              "Enter the verification code sent to your email to complete user creation."}
          </DialogDescription>
        </DialogHeader>

        {step === "userType" && (
          <form className="space-y-3" onSubmit={() => setStep("details")}>
            <div>
              <RadioGroup onValueChange={(v) => setUserType(v)} value={userType}>
                {userTypeOptions.map((option) => (
                  <div className="border-input has-data-[state=checked]:border-primary relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                    <div className="grid flex-1 gap-1">
                      <Label htmlFor={option.value}>{option.label}</Label>
                      <Paragraph className="text-muted-foreground text-xs">
                        {option.description}
                      </Paragraph>
                    </div>
                    <RadioGroupItem value={option.value} className="after:absolute after:inset-0" />
                  </div>
                ))}
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

              {userType === "admin" && (
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
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setStep("userType")}>
                  Back
                </Button>
                <Button isLoading={isPending} type="submit">
                  Send Verification Code
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {step === "verification" && (
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-3">
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <Paragraph className="text-sm font-medium">Summary</Paragraph>
                    <Paragraph className="text-muted-foreground text-sm">
                      Creating {userType} account:&nbsp;
                      {detailsForm.getValues("email")}
                    </Paragraph>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep("details");
                    otpForm.reset();
                  }}
                >
                  Back
                </Button>
                <Button type="submit">
                  Create {detailsForm.getValues("superAdmin") ? "Administrator" : "Agent"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
