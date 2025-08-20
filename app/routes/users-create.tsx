import { useState } from "react";
import { useNavigate } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { Switch } from "@/components/ui/switch";
import { Paragraph } from "@/components/ui/text";

// Zod schemas
const userDetailsSchema = z.object({
  isSuperAdmin: z.boolean(),
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
  const [step, setStep] = useState<"details" | "verification">("details");

  const detailsForm = useForm<UserDetailsForm>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: { isSuperAdmin: false, email: "" },
  });

  const otpForm = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const handleClose = () => {
    navigate("/users");
  };

  const handleDetailsSubmit = (data: UserDetailsForm) => {
    // Store user details and proceed to OTP
    setStep("verification");
    // Here you would send the email and trigger OTP
    console.log("Sending OTP for:", data);
  };

  const handleOtpSubmit = (data: OTPForm) => {
    const userDetails = detailsForm.getValues();
    console.log("Creating user:", { ...userDetails, otp: data.otp });
    handleClose();
  };

  const handleBackToDetails = () => {
    setStep("details");
    otpForm.reset();
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            {step === "details" && "Select the type of user and enter their email address."}
            {step === "verification" && "Enter the OTP sent to your email address to continue."}
          </DialogDescription>
        </DialogHeader>

        {step === "details" && (
          <Form {...detailsForm}>
            <form onSubmit={detailsForm.handleSubmit(handleDetailsSubmit)} className="space-y-3">
              <FormField
                control={detailsForm.control}
                name="isSuperAdmin"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="hover:bg-muted relative flex items-center justify-between rounded-lg border p-3 transition-colors">
                        <div className="space-y-1">
                          <Label htmlFor="super-admin-switch" className="font-medium">
                            Super Admin
                          </Label>
                          <Paragraph className="text-muted-foreground text-sm">
                            Full access to admin panel and user management
                          </Paragraph>
                        </div>
                        <Switch
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

              <FormField
                control={detailsForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={`Enter ${detailsForm.watch("isSuperAdmin") ? "super admin" : "agent"} email address`}
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
                <Button type="submit">Send Verification</Button>
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
                      Creating {detailsForm.getValues("isSuperAdmin") ? "super admin" : "agent"}{" "}
                      user: {detailsForm.getValues("email")}
                    </Paragraph>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleBackToDetails}>
                  Back
                </Button>
                <Button type="submit">
                  Create {detailsForm.getValues("isSuperAdmin") ? "Super Admin" : "Agent"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
